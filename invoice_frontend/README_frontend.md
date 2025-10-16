# Invoice Frontend (React)

This is the React frontend for the Smart Invoice & Payment Reminder System.

## Features
- Routing with react-router-dom v6
- Auth state via Context + useAuth hook (JWT in localStorage)
- Axios API client with baseURL from REACT_APP_API_BASE_URL and JWT interceptors
- Ocean Professional theme (blue + amber accents), rounded corners, subtle shadows, gradient accents
- Core layout with responsive Sidebar + Topbar
- Stub pages: Login, Register, Dashboard, Invoices, Partners, Templates, Analytics, Settings
- Common components: WidgetCard, Badge, Table, Modal, FileUploader (stubs)

## Getting Started

1) Install dependencies:
   npm install

2) Create your .env file:
   cp .env.example .env
   # Edit .env and set:
   # REACT_APP_API_BASE_URL=<http://your-backend-host>

3) Start the app:
   npm start
   # Visit http://localhost:3000

## Authentication
- On login/register success, the backend should return a JWT token as `token` (or `accessToken` or `jwt`). The frontend stores it in localStorage and attaches it to subsequent API requests via Authorization: Bearer <token>.
- On 401 responses, the frontend clears auth and redirects to /login.

## CORS
CORS is expected to be handled by the backend. Ensure your backend allows requests from the frontend origin during development.

## Notes
- This is an MVP scaffold; pages are minimal and intended to be wired to backend endpoints in subsequent tasks.
- Error notifications currently use window.alert for simplicity.
