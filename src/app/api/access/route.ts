import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import {
  createAccessToken,
  getAccessCookieMaxAge,
  getAccessCookieName,
  getAccessCookieSecret,
  resolveAccessRole,
} from '@/lib/access'

type AttemptState = {
  failures: number
  lockedUntil: number
}

const ERROR_MESSAGE = '这不是打开它的密钥。'
const CLIENT_COOKIE = 'letter_client'
const ATTEMPT_COOKIE = 'letter_attempts'
const FAILURE_LIMIT = 5
const COOLDOWN_MS = 5 * 60 * 1000
const DELAY_MIN_MS = 500
const DELAY_MAX_MS = 1000
const CLIENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365
const attemptBuckets = new Map<string, AttemptState>()

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function slowDown() {
  const delay = DELAY_MIN_MS + Math.floor(Math.random() * (DELAY_MAX_MS - DELAY_MIN_MS + 1))
  await wait(delay)
}

function isSecureRequest(request: NextRequest) {
  const forwardedProto = request.headers.get('x-forwarded-proto')
  return request.nextUrl.protocol === 'https:' || forwardedProto === 'https'
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwardedFor
    || request.headers.get('x-real-ip')?.trim()
    || request.headers.get('cf-connecting-ip')?.trim()
    || 'unknown'
}

function getAttemptKeys(request: NextRequest, clientId: string) {
  return [`ip:${getClientIp(request)}`, `client:${clientId}`]
}

function getLockedUntil(keys: string[]) {
  const now = Date.now()
  let lockedUntil = 0

  for (const key of keys) {
    const state = attemptBuckets.get(key)

    if (!state)
      continue

    if (state.lockedUntil <= now && state.failures <= 0) {
      attemptBuckets.delete(key)
      continue
    }

    lockedUntil = Math.max(lockedUntil, state.lockedUntil)
  }

  return lockedUntil > now ? lockedUntil : 0
}

function markMemoryFailure(keys: string[]) {
  const now = Date.now()

  for (const key of keys) {
    const current = attemptBuckets.get(key)
    const failures = current && current.lockedUntil > now
      ? current.failures
      : (current?.failures ?? 0) + 1

    attemptBuckets.set(key, {
      failures,
      lockedUntil: failures >= FAILURE_LIMIT ? now + COOLDOWN_MS : 0,
    })
  }
}

function clearMemoryFailures(keys: string[]) {
  for (const key of keys)
    attemptBuckets.delete(key)
}

function encodeBase64Url(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url')
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function signAttemptPayload(payload: string) {
  const secret = getAccessCookieSecret()

  if (!secret)
    return null

  return createHmac('sha256', secret).update(payload).digest('base64url')
}

function createAttemptCookie(state: AttemptState) {
  const payload = encodeBase64Url(JSON.stringify(state))
  const signature = signAttemptPayload(payload)

  if (!signature)
    return null

  return `${payload}.${signature}`
}

function readAttemptCookie(request: NextRequest): AttemptState {
  const raw = request.cookies.get(ATTEMPT_COOKIE)?.value

  if (!raw)
    return { failures: 0, lockedUntil: 0 }

  const [payload, signature] = raw.split('.')

  if (!payload || !signature)
    return { failures: 0, lockedUntil: 0 }

  const expectedSignature = signAttemptPayload(payload)

  if (!expectedSignature)
    return { failures: 0, lockedUntil: 0 }

  const actual = Buffer.from(expectedSignature, 'base64url')
  const expected = Buffer.from(signature, 'base64url')

  if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
    return { failures: 0, lockedUntil: 0 }

  try {
    const state = JSON.parse(decodeBase64Url(payload)) as AttemptState

    if (!Number.isFinite(state.failures) || !Number.isFinite(state.lockedUntil))
      return { failures: 0, lockedUntil: 0 }

    return {
      failures: Math.max(0, Math.floor(state.failures)),
      lockedUntil: Math.max(0, Math.floor(state.lockedUntil)),
    }
  }
  catch {
    return { failures: 0, lockedUntil: 0 }
  }
}

function markBrowserFailure(state: AttemptState) {
  const now = Date.now()

  if (state.lockedUntil > now)
    return state

  const failures = state.failures + 1

  return {
    failures,
    lockedUntil: failures >= FAILURE_LIMIT ? now + COOLDOWN_MS : 0,
  }
}

function setClientCookie(response: NextResponse, request: NextRequest, clientId: string) {
  response.cookies.set(CLIENT_COOKIE, clientId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isSecureRequest(request),
    path: '/',
    maxAge: CLIENT_COOKIE_MAX_AGE,
  })
}

function setAttemptCookie(response: NextResponse, request: NextRequest, state: AttemptState) {
  const value = createAttemptCookie(state)

  if (!value)
    return

  response.cookies.set(ATTEMPT_COOKIE, value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isSecureRequest(request),
    path: '/',
    maxAge: Math.ceil(COOLDOWN_MS / 1000),
  })
}

function clearAttemptCookie(response: NextResponse) {
  response.cookies.delete(ATTEMPT_COOKIE)
}

async function readSubmittedKey(request: NextRequest) {
  try {
    const body = await request.json() as unknown
    return typeof body === 'object' && body && 'key' in body ? String(body.key).trim() : ''
  }
  catch {
    return ''
  }
}

function failureResponse(status = 401) {
  return NextResponse.json({ ok: false, message: ERROR_MESSAGE }, { status })
}

export async function POST(request: NextRequest) {
  const clientId = request.cookies.get(CLIENT_COOKIE)?.value || randomUUID()
  const attemptKeys = getAttemptKeys(request, clientId)
  const browserAttempts = readAttemptCookie(request)
  const now = Date.now()
  const lockedUntil = Math.max(getLockedUntil(attemptKeys), browserAttempts.lockedUntil > now ? browserAttempts.lockedUntil : 0)

  if (lockedUntil) {
    await slowDown()
    const response = failureResponse(429)
    setClientCookie(response, request, clientId)
    setAttemptCookie(response, request, browserAttempts)
    return response
  }

  const key = await readSubmittedKey(request)
  const role = key ? resolveAccessRole(key) : null

  if (!role) {
    markMemoryFailure(attemptKeys)
    const nextBrowserAttempts = markBrowserFailure(browserAttempts)

    await slowDown()

    const response = failureResponse()
    setClientCookie(response, request, clientId)
    setAttemptCookie(response, request, nextBrowserAttempts)
    return response
  }

  let token: string

  try {
    token = createAccessToken(role)
  }
  catch {
    await slowDown()
    const response = failureResponse(500)
    setClientCookie(response, request, clientId)
    return response
  }

  clearMemoryFailures(attemptKeys)

  const response = NextResponse.json({ ok: true })

  setClientCookie(response, request, clientId)
  clearAttemptCookie(response)
  response.cookies.set(getAccessCookieName(), token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isSecureRequest(request),
    path: '/',
    maxAge: getAccessCookieMaxAge(),
  })

  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })

  response.cookies.delete(getAccessCookieName())

  return response
}
