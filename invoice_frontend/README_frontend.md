# Invoice Frontend

Environment

- REACT_APP_API_BASE_URL: Base URL of the backend API (no trailing slash).
  - Example: http://localhost:8080

Usage in code

- Create your API client using the env variable:
  - Example with fetch:
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    fetch(`${baseUrl}/api/auth/login`, { method: 'POST', body: JSON.stringify({ email, password }) });

Notes

- When deploying, ensure the backend is configured with CORS_ALLOWED_ORIGINS to include this frontend's origin.
- If using auth email redirects in future, set REACT_APP_SITE_URL to the deployed frontend URL.
