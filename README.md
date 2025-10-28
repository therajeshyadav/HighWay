# HighWay Experience Hub

A full-stack web application for booking and managing travel experiences.

## Project Structure

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL (Neon)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/therajeshyadav/HighWay.git
cd HighWay
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd backend
npm install
```

4. Set up environment variables
```bash
# Copy example files and configure
cp .env.example .env
cp backend/.env.example backend/.env
```

5. Set up the database
```bash
cd backend
npm run migrate
npm run seed
```

### Running the Application

1. Start the backend server
```bash
cd backend
npm run dev
```

2. Start the frontend development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Features

- Experience browsing and booking
- User authentication
- Payment processing
- Admin dashboard
- Responsive design

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- JWT Authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.