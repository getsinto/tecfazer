import db from './db'

const redirectsMap = new Map<string, { toPath: string; statusCode: number }>()
let isLoaded = false

export async function loadRedirects() {
  try {
    const redirects = await db.redirect.findMany({
      where: { isActive: true },
    })
    
    redirectsMap.clear()
    redirects.forEach((redirect) => {
      redirectsMap.set(redirect.fromPath, {
        toPath: redirect.toPath,
        statusCode: redirect.statusCode,
      })
    })
    
    isLoaded = true
    console.log(`Loaded ${redirects.length} redirects into cache`)
  } catch (error) {
    console.error('Failed to load redirects:', error)
  }
}

export function getRedirect(path: string) {
  return redirectsMap.get(path) || null
}

// Auto-refresh every 5 minutes
if (typeof window === 'undefined') {
  // Only run on server
  setInterval(loadRedirects, 5 * 60 * 1000)
  
  // Initial load
  if (!isLoaded) {
    loadRedirects()
  }
}
