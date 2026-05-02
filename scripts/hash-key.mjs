import { randomBytes, scryptSync } from 'node:crypto'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

function createSecretHash(key, salt = randomBytes(16).toString('base64url')) {
  const hash = scryptSync(key, salt, 32).toString('base64url')
  return `scrypt.${salt}.${hash}`
}

const cliKey = process.argv.slice(2).join(' ').trim()
let key = cliKey

if (!key) {
  const rl = createInterface({ input, output })
  key = await rl.question('输入要生成 hash 的密钥：')
  rl.close()
}

if (!key.trim()) {
  console.error('密钥不能为空。')
  process.exit(1)
}

console.log(createSecretHash(key.trim()))
