export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL?.trim() || 'https://bakku-dev-api.marstech.kr',
} as const;
