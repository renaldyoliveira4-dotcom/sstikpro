const RATE_LIMIT = new Map<string, { count: number; reset: number }>()

export function checkRateLimit(
  ip: string,
  limit = 10,
  windowMs = 60000
): boolean {
  const now = Date.now()
  const entry = RATE_LIMIT.get(ip)

  if (!entry || now > entry.reset) {
    RATE_LIMIT.set(ip, { count: 1, reset: now + windowMs })
    return true
  }

  if (entry.count >= limit) return false
  entry.count++
  return true
}

export function getIP(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}
