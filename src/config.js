export const config = {
    apiBaseUrl:
    process.env.NODE_ENV === 'production'
    ? "https://gestion-corriente-server.vercel.app"
    : "http://localhost:4000"
}