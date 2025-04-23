# MediConnect - Hospital Management System

MediConnect is a comprehensive hospital management system that streamlines patient care, bed management, appointment scheduling, and inventory tracking for healthcare facilities.

## Features

- **Role-based Access Control**: Different dashboards and permissions for admins, doctors, receptionists, and inventory managers
- **OPD Queuing System**: Manage patient appointments and doctor schedules efficiently
- **Bed Management**: Real-time tracking of bed availability across different wards
- **Patient Records**: Comprehensive patient information management
- **Inventory Tracking**: Monitor medical supplies and equipment with reorder alerts
- **Interactive Dashboard**: Data visualization and analytics for hospital metrics

## Tech Stack

### Frontend
- React.js with TypeScript
- Tailwind CSS for styling
- React Context for state management
- React Router for navigation
- Clerk.js for authentication
- Framer Motion for animations
- Chart.js for data visualization

### Backend
- Node.js with Express.js
- PostgreSQL database
- Prisma ORM for database operations
- Clerk.js for user authentication and management

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- Clerk.js account

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create a `.env` file based on `.env.example` and add your Clerk publishable key.

3. Start the development server:
```bash
npm run dev
```

### Backend Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create a `.env` file based on `.env.example` and configure your database connection and Clerk secret key.

3. Run Prisma migrations to create the database schema:
```bash
npx prisma migrate dev
```

4. Seed the database with initial data:
```bash
npm run seed
```

5. Start the backend server:
```bash
npm run dev
```

## Project Structure

### Frontend
```
/frontend
├── /public               # Static assets
├── /src
│   ├── /assets           # Images, icons, etc.
│   ├── /components       # Reusable UI components
│   │   ├── /common       # Common UI elements
│   │   ├── /auth         # Authentication components
│   │   └── /...          # Feature-specific components
│   ├── /context          # React Context providers
│   ├── /hooks            # Custom React hooks
│   ├── /layouts          # Page layouts
│   ├── /pages            # Route components
│   ├── /services         # API service functions
│   ├── /types            # TypeScript type definitions
│   ├── /utils            # Utility functions
│   ├── App.tsx           # Main application component
│   ├── index.css         # Global CSS
│   └── main.tsx          # Application entry point
```

### Backend
```
/backend
├── /prisma               # Prisma schema and migrations
├── /src
│   ├── /controllers      # Route handlers
│   ├── /middlewares      # Express middlewares
│   ├── /routes           # API routes
│   ├── /services         # Business logic
│   ├── /utils            # Utility functions
│   └── index.js          # Server entry point
```

## API Endpoints

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create a new patient
- `PUT /api/patients/:id` - Update a patient
- `DELETE /api/patients/:id` - Delete a patient
- `GET /api/patients/:id/appointments` - Get patient appointments
- `GET /api/patients/:id/admissions` - Get patient admissions

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/today` - Get today's appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create a new appointment
- `PUT /api/appointments/:id` - Update an appointment
- `DELETE /api/appointments/:id` - Delete an appointment

### Beds
- `GET /api/beds` - Get all beds
- `GET /api/beds/ward/:ward` - Get beds by ward
- `GET /api/beds/available` - Get available beds
- `GET /api/beds/:id` - Get bed by ID
- `POST /api/beds` - Create a new bed
- `PUT /api/beds/:id` - Update a bed
- `DELETE /api/beds/:id` - Delete a bed

### Admissions
- `GET /api/admissions` - Get all admissions
- `GET /api/admissions/active` - Get active admissions
- `GET /api/admissions/:id` - Get admission by ID
- `POST /api/admissions` - Create a new admission
- `PUT /api/admissions/:id` - Update an admission
- `DELETE /api/admissions/:id` - Delete an admission

### Inventory
- `GET /api/inventory` - Get all inventory items
- `GET /api/inventory/low-stock` - Get low stock items
- `GET /api/inventory/category/:category` - Get items by category
- `GET /api/inventory/:id` - Get item by ID
- `POST /api/inventory` - Create a new inventory item
- `PUT /api/inventory/:id` - Update an inventory item
- `DELETE /api/inventory/:id` - Delete an inventory item

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard summary data
- `GET /api/dashboard/appointments/stats` - Get appointment statistics
- `GET /api/dashboard/beds/stats` - Get bed occupancy statistics

## License

This project is licensed under the MIT License.