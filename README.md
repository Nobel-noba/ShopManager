# SmartStockTracker

A modern inventory and sales management system built with React, TypeScript, and Node.js.

## Features

- User authentication and role-based access control
- Product inventory management
- Sales tracking and reporting
- Category management
- Real-time stock updates
- Dashboard with key metrics
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd SmartStockTracker
```

### 2. Install Dependencies

Install both server and client dependencies:

```bash
npm install
```

### 3. Database Setup

1. Create a MySQL database:

```sql
CREATE DATABASE ashe;
```

2. Configure database connection:

Create a `.env` file in the root directory with the following content:

```env
DATABASE_URL=mysql://root:1234@localhost:3306/ashe
SESSION_SECRET=your-secret-key
```

Replace the database credentials with your own.

3. Run database setup script:

```bash
node setup-local-db.js
```

### 4. Start the Application

1. Start the development server:

```bash
npm run dev
```

This will start both the client and server in development mode.

- Client: http://localhost:5173
- Server: http://localhost:3000

## Default Users

The application comes with two default users:

1. Admin User
   - Username: admin@admin.com
   - Password: 123456

2. Staff User
   - Username: staff@example.com
   - Password: 123456

## Project Structure

```
SmartStockTracker/
├── client/           # React frontend
│   ├── src/
│   ├── index.html
│   └── vite.config.ts
├── server/           # Node.js backend
│   ├── routes.ts
│   ├── storage.ts
│   └── index.ts
├── shared/           # Shared types and schemas
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Environment Variables

### Required Variables

```env
DATABASE_URL=mysql://user:password@host:port/database
SESSION_SECRET=your-secret-key
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.