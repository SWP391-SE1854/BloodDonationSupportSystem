# Blood Donation Management System

A modern web application for managing blood donations using React, TypeScript, and a local SQL database.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Local SQL database server

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd blood-donation-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create `.env` file in the root directory
   - Add the following variables:
     ```
     VITE_API_BASE_URL=http://localhost:5000/api
     ```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Access the application:
   - Frontend: http://localhost:5173

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Staff, Donor)
- Protected routes
- Session management

### User Management
- User registration and profile management
- Role-based permissions
- Profile updates and password changes
- Account deletion

### Blood Donation Management
- Blood request creation and tracking
- Donor matching system
- Donation history tracking
- Blood inventory management

### Admin Features
- User management dashboard
- System monitoring and logs
- Report generation
- System configuration

### Staff Features
- Blood request management
- Donor record management
- Inventory tracking
- Donation scheduling

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- Axios for API calls
- Local SQL Database

