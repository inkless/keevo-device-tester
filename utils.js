import u2f from 'u2f-api'

const U2F_VERSION = 'U2F_V2'

export function toWebsafeBase64(buf) {
  return buf
    .toString('base64')
    .replace(/\//g, '_')
    .replace(/\+/g, '-')
    .replace(/=/g, '')
}

export function fromWebsafeBase64(base64) {
  const normalBase64 =
    base64.replace(/-/g, '+').replace(/_/g, '/') + '=='.substring(0, (3 * base64.length) % 4)
  return Buffer.from(normalBase64, 'base64')
}

export async function command(payload, { timeout } = {}) {
  const signRequest = {
    appId: location.origin,
    challenge: 'E'.repeat(43),
    version: U2F_VERSION,
    keyHandle: toWebsafeBase64(payload.toString('base64')),
    // keyHandle: 'NMUmjqP7a-bdyZYvmM6KrB7tDTtYDZWSbp18TCL4VgqQEu-Tfa4OHhT1JwqSHJmJ5iLfkGekF1ZYA5IqAs51Ng'
  }

  const response = await u2f.sign([signRequest], timeout)

  if (response.signatureData !== undefined) {
    return fromWebsafeBase64(response.signatureData).toString('hex', 5)
  } else {
    throw response
  }
}
