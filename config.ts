
const appUrl = process.env.APP_URL

export const config = {
  appUrl,
  apiUrl: process.env.API_URL || `${appUrl}/api`,
  secretToken: process.env.API_KEY || 'secret',
} as const 

