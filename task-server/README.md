# Task Management Backend API

A robust backend API for task management system built with Node.js, Express, TypeScript, Prisma, and PostgreSQL with JWT authentication.

## Features

- ✅ User Authentication (Register/Login)
- ✅ JWT-based Authorization
- ✅ Role-based Access Control (SUPER_ADMIN, ADMIN, USER)
- ✅ User Management CRUD Operations
- ✅ Refresh Token Support
- ✅ Password Hashing with Bcrypt
- ✅ Input Validation with Zod
- ✅ Error Handling
- ✅ Pagination Support

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Password Hashing**: Bcrypt

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd task-server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env` and update the values:

   ```bash
   cp .env.example .env
   ```

4. **Set up the database**

   Update the `DATABASE_URL` in your `.env` file, then run:

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000` (or your configured PORT).

## API Endpoints

### Authentication

- **POST** `/api/v1/auth/register` - Register a new user
- **POST** `/api/v1/auth/login` - Login user
- **POST** `/api/v1/auth/refresh-token` - Refresh access token

### Users

- **GET** `/api/v1/users` - Get all users (Admin/Super Admin only)
- **GET** `/api/v1/users/:id` - Get single user (Admin/Super Admin only)
- **POST** `/api/v1/users` - Create user
- **PATCH** `/api/v1/users/:id` - Update user (Admin/Super Admin only)
- **DELETE** `/api/v1/users/:id` - Delete user (Super Admin only)

## Project Structure

```
src/
├── app/
│   ├── events/          # Event handlers
│   ├── middlewares/     # Auth, validation, error handlers
│   ├── modules/
│   │   ├── auth/        # Authentication module
│   │   └── user/        # User management module
│   └── routes/          # Route definitions
├── config/              # Configuration
├── constants/           # Constants
├── enums/              # Enums (user roles, etc.)
├── errors/             # Custom error handlers
├── helpers/            # Helper functions (JWT, pagination)
├── interfaces/         # TypeScript interfaces
├── shared/             # Shared utilities
├── app.ts              # Express app setup
└── server.ts           # Server entry point
```

## User Roles

- **SUPER_ADMIN**: Full access to all resources
- **ADMIN**: Manage users and tasks
- **USER**: Regular user with limited access

## Authentication Flow

1. **Register**: Create a new user account

   - Email and password are required
   - Password is hashed before storage
   - Returns access token and refresh token

2. **Login**: Authenticate existing user

   - Validates credentials
   - Returns access token and refresh token

3. **Refresh Token**: Get new access token
   - Uses refresh token from cookies
   - Returns new access token

## Environment Variables

| Variable                 | Description                  | Example                                    |
| ------------------------ | ---------------------------- | ------------------------------------------ |
| `NODE_ENV`               | Application environment      | `development`                              |
| `PORT`                   | Server port                  | `5000`                                     |
| `DATABASE_URL`           | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET`             | JWT secret key               | `your-secret-key`                          |
| `JWT_REFRESH_SECRET`     | JWT refresh secret           | `your-refresh-secret`                      |
| `JWT_EXPIRES_IN`         | Access token expiry          | `1d`                                       |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry         | `365d`                                     |
| `BCRYPT_SALT_ROUNDS`     | Bcrypt salt rounds           | `12`                                       |

## Scripts

```bash
npm run dev          # Start development server
npm run lint:check   # Check linting
npm run lint:fix     # Fix linting issues
npm run prettier:fix # Format code
```

## Database Schema

### User Model

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum UserRole {
  SUPER_ADMIN
  ADMIN
  USER
}
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- HTTP-only cookies for refresh tokens
- Role-based access control
- Input validation using Zod

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC

## Author

Your Name

---

**Note**: This is a task management backend API. You can extend it by adding more modules like:

- Projects
- Tasks
- Teams
- Comments
- File uploads
- Notifications
