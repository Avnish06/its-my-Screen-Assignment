const isProd = import.meta.env.PROD;

export const API_URL = import.meta.env.VITE_API_URL || (isProd ? '' : 'http://localhost:5000/api');
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (isProd ? '' : 'http://localhost:5000');

if (isProd && !import.meta.env.VITE_API_URL) {
    console.warn('VITE_API_URL is not defined in production environment!');
}
