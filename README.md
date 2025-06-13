
# Blood Donation Management System

A frontend application for a blood donation management system, built with React and TypeScript.

## Project Overview

This system provides a user interface for a comprehensive blood donation management platform. It includes pages and components for three main user roles:

*   **Donors**: Can register, manage their profile, and view donation history.
*   **Staff**: Can manage blood requests, inventory, and donor records.
*   **Administrators**: Have access to a dashboard for user management and system monitoring.

_Note: This is a frontend-only application. It requires a separate backend service to function fully._

## Tech Stack

*   React 18 with TypeScript
*   Vite for build tooling
*   Tailwind CSS for styling
*   Shadcn/ui for UI components
*   React Query for data fetching
*   React Router for navigation
*   Axios for API communication

## Project Structure

```
├── src/                    # Frontend source code
│   ├── components/        # Reusable UI components
│   ├── contexts/         # React contexts (Auth, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   ├── services/        # API service functions
│   └── types/           # TypeScript type definitions
```

## Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone [repository-url]
    cd blood-donation-system
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Application

1.  Start the frontend development server:
    ```bash
    npm run dev
    ```

2.  Access the application in your browser, typically at `http://localhost:5173`.

## Connecting to a Backend

This frontend is designed to work with a backend API. The API service calls are defined in `src/services/api.ts`. You will need to configure the `VITE_API_BASE_URL` in your environment to point to your backend server.

Create a `.env` file in the root of the project:
```
VITE_API_BASE_URL=http://your-backend-api-url.com/api
```

## Contributing

1.  Fork the repository
2.  Create a feature branch
3.  Commit your changes
4.  Push to the branch
5.  Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the repository.
