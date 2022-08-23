
const appUrl = process.env.NEXT_PUBLIC_APP_URL

export const config = {
  appUrl,
  apiUrl: process.env.NEXT_PUBLIC_API_URL || `${appUrl}/api`,
} as const 

