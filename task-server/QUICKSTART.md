# Quick Start Guide

## Setup in 5 Minutes

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Create Environment File

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000

# Update with your PostgreSQL credentials
DATABASE_URL="postgresql://postgres:password@localhost:5432/task_management?schema=public"

# Generate secure random strings for these
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=365d

BCRYPT_SALT_ROUNDS=12
```

### Step 3: Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init

# Optional: Open Prisma Studio to view database
npx prisma studio
```

### Step 4: Start the Server

```bash
npm run dev
```

Server will run on: `http://localhost:5000`

---

## Test the API

### 1. Register a User

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123",
    "name": "Admin User"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123"
  }'
```

Copy the `accessToken` from the response.

### 3. Get All Users (Protected Route)

```bash
curl -X GET http://localhost:5000/api/v1/users \
  -H "Authorization: YOUR_ACCESS_TOKEN_HERE"
```

---

## Project Structure Overview

```
task-server/
├── prisma/
│   ├── migrations/       # Database migrations
│   └── schema.prisma     # Database schema
├── src/
│   ├── app/
│   │   ├── modules/
│   │   │   ├── auth/    # Authentication (login, register)
│   │   │   └── user/    # User management
│   │   ├── middlewares/ # Auth, validation, error handling
│   │   └── routes/      # API routes
│   ├── config/          # Configuration
│   ├── shared/          # Shared utilities
│   └── server.ts        # Entry point
├── .env                 # Environment variables (create this)
├── .env.example         # Environment template
├── package.json
└── README.md
```

---

## Available API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh-token` - Refresh access token

### Users

- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get user by ID (Admin only)
- `POST /api/v1/users` - Create user
- `PATCH /api/v1/users/:id` - Update user (Admin only)
- `DELETE /api/v1/users/:id` - Delete user (Super Admin only)

---

## Default User Roles

- **USER** - Regular user (default)
- **ADMIN** - Can manage users
- **SUPER_ADMIN** - Full system access

---

## Common Issues & Solutions

### Issue: Database connection failed

**Solution:** Make sure PostgreSQL is running and DATABASE_URL is correct

### Issue: Prisma Client error

**Solution:** Run `npx prisma generate`

### Issue: Migration failed

**Solution:**

```bash
npx prisma migrate reset
npx prisma migrate dev
```

### Issue: Port already in use

**Solution:** Change PORT in .env file or kill the process using port 5000

---

## Next Steps

1. ✅ Setup completed? Great!
2. 📝 Read the full [README.md](./README.md)
3. 📚 Check [API_DOCS.md](./API_DOCS.md) for detailed API documentation
4. 🚀 Start building your task management features:
   - Add Task module
   - Add Project module
   - Add Team module
   - Add Comments
   - Add File uploads

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server with hot reload

# Database
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Create and apply migration
npx prisma generate      # Generate Prisma Client

# Code Quality
npm run lint:check       # Check for linting errors
npm run lint:fix         # Fix linting errors
npm run prettier:fix     # Format code
```

---

## Need Help?

- Check the [API Documentation](./API_DOCS.md)
- Review the [README](./README.md)
- Check Prisma docs: https://www.prisma.io/docs

Happy Coding! 🎉
