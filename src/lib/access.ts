import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

export type AccessRole = 'her' | 'owner'

export type AccessSession = {
  role: AccessRole
  issuedAt: number
  expiresAt: number
}

type HashParts = {
  salt: string
  key: string
}

type CookieReader = {
  get: (name: string) => { value: string } | undefined
}

const ACCESS_COOKIE = 'void_access'
const ACCESS_TTL_SECONDS = 60 * 60 * 24 * 30
const SCRYPT_KEY_LENGTH = 32

export function getAccessCookieName() {
  return ACCESS_COOKIE
}

function encodeBase64Url(value: string | Buffer) {
  const buffer = typeof value === 'string' ? Buffer.from(value, 'utf8') : value
  return buffer.toString('base64url')
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function parseSecretHash(hash: string): HashParts | null {
  const separator = hash.includes('$') ? '$' : '.'
  const [scheme, salt, key] = hash.split(separator)

  if (scheme !== 'scrypt' || !salt || !key)
    return null

  return { salt, key }
}

function hashKeyWithSalt(key: string, salt: string) {
  return scryptSync(key, salt, SCRYPT_KEY_LENGTH).toString('base64url')
}

export function getAccessCookieSecret() {
  const explicit = process.env.ACCESS_COOKIE_SECRET?.trim()

  if (explicit)
    return explicit

  const fallback = `${process.env.OWNER_KEY_HASH ?? ''}.${process.env.HER_KEY_HASH ?? ''}`

  if (fallback.length > 1)
    return fallback

  if (process.env.NODE_ENV !== 'production')
    return 'void-local-dev-cookie-secret'

  return null
}

function signPayload(payload: string) {
  const secret = getAccessCookieSecret()

  if (!secret)
    return null

  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function createSecretHash(key: string, salt = randomBytes(16).toString('base64url')) {
  return `scrypt.${salt}.${hashKeyWithSalt(key, salt)}`
}

export function verifySecretKey(key: string, storedHash?: string) {
  if (!storedHash)
    return false

  const parts = parseSecretHash(storedHash)

  if (!parts)
    return false

  const actual = Buffer.from(hashKeyWithSalt(key, parts.salt), 'base64url')
  const expected = Buffer.from(parts.key, 'base64url')

  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export function resolveAccessRole(key: string): AccessRole | null {
  if (verifySecretKey(key, process.env.OWNER_KEY_HASH))
    return 'owner'
  if (verifySecretKey(key, process.env.HER_KEY_HASH))
    return 'her'
  return null
}

export function createAccessToken(role: AccessRole) {
  const now = Math.floor(Date.now() / 1000)
  const session: AccessSession = {
    role,
    issuedAt: now,
    expiresAt: now + ACCESS_TTL_SECONDS,
  }
  const payload = encodeBase64Url(JSON.stringify(session))
  const signature = signPayload(payload)

  if (!signature)
    throw new Error('ACCESS_COOKIE_SECRET or key hashes are required to sign access cookies.')

  return `${payload}.${signature}`
}

export function verifyAccessToken(token?: string): AccessSession | null {
  if (!token)
    return null

  const [payload, signature] = token.split('.')

  if (!payload || !signature)
    return null

  const signedPayload = signPayload(payload)

  if (!signedPayload)
    return null

  const actual = Buffer.from(signedPayload, 'base64url')
  const expected = Buffer.from(signature, 'base64url')

  if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
    return null

  try {
    const session = JSON.parse(decodeBase64Url(payload)) as AccessSession
    const now = Math.floor(Date.now() / 1000)

    if ((session.role !== 'her' && session.role !== 'owner') || session.expiresAt <= now)
      return null

    return session
  }
  catch {
    return null
  }
}

export function getAccessSession(cookieStore: CookieReader) {
  return verifyAccessToken(cookieStore.get(ACCESS_COOKIE)?.value)
}

export function getAccessCookieMaxAge() {
  return ACCESS_TTL_SECONDS
}
