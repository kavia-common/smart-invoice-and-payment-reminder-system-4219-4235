# API Usage

To call backend endpoints, use the base URL from env:

Example with axios:

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // no trailing slash
});

export default api;

Then use:
api.post('/api/auth/login', { email, password });

Ensure the backend allows your origin via CORS_ALLOWED_ORIGINS.
