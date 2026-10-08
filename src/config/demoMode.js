// Toggle between demo mode (mock data, localStorage) and production mode (real API)
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

export { DEMO_MODE };
