// The client always calls the app's own origin under this prefix; next.config.ts
// rewrites /api/v1/* to the upstream API server-side (the API has no CORS headers).
export const API_PREFIX = "/api/v1";
