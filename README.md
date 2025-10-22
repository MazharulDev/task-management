# Task Management System

A full-stack task management application with real-time collaboration features, built with React, Node.js, TypeScript, and PostgreSQL.

## 🌟 Features

- **User Authentication**: Secure login and registration with JWT
- **Task Management**: Create, read, update, and delete tasks
- **Real-time Collaboration**: See when others are editing tasks
- **Task Locking**: Prevent concurrent edits with real-time locking
- **Responsive Design**: Works on desktop and mobile devices
- **Role-based Access Control**: Different permissions for users, admins, and super admins

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **React Router** for navigation
- **Socket.IO Client** for real-time features
- **Axios** for HTTP requests

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** with Prisma ORM
- **JWT** for authentication
- **Socket.IO** for real-time communication
- **Zod** for validation

## 📁 Project Structure

```
task-management/
├── task-client/          # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # React context providers
│   │   ├── lib/          # API utilities and types
│   │   ├── pages/        # Page components
│   │   └── ...
│   ├── public/           # Static assets
│   └── ...
└── task-server/          # Node.js backend API
    ├── src/
    │   ├── app/          # Application modules
    │   ├── config/       # Configuration files
    │   ├── prisma/       # Database schema and migrations
    │   └── ...
    └── ...
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database

### Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/MazharulDev/task-management.git
cd task-management
```

#### 2. Backend Setup (task-server)

```bash
cd task-server
npm install
```

Create a `.env` file in the `task-server` directory with the following variables:

```env
# Application
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/task_management"

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=365d

# Bcrypt
BCRYPT_SALT_ROUNDS=12
```

Initialize the database:

```bash
npx prisma generate
npx prisma migrate dev
```

Start the backend server:

```bash
npm run dev
```

The backend server will start on `http://localhost:5000`.

#### 3. Frontend Setup (task-client)

Open a new terminal window and navigate to the client directory:

```bash
cd ../task-client
npm install
```

Create a `.env.local` file in the `task-client` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`.

## 📜 Available Scripts

### Backend (task-server)

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint:check   # Check for linting errors
npm run lint:fix     # Fix linting errors
npm run prettier:fix # Format code
```

### Frontend (task-client)

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check for linting errors
```

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|---------|-------------|---------|
| `NODE_ENV` | Application environment | `development` |
| `PORT` | Server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | JWT secret key | `your-secret-key` |
| `JWT_REFRESH_SECRET` | JWT refresh secret | `your-refresh-secret` |
| `JWT_EXPIRES_IN` | Access token expiry | `1d` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `365d` |
| `BCRYPT_SALT_ROUNDS` | Bcrypt salt rounds | `12` |

### Frontend (.env.local)

| Variable | Description | Example |
|---------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |

## 🔄 Real-time Features

The application includes real-time collaboration features:

1. **Task Locking**: When a user opens a task for editing, it gets locked for others
2. **Live Updates**: Changes made by one user are immediately visible to others
3. **Presence Indicators**: See who is currently online and editing tasks

## 🛡️ Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- HTTP-only cookies for refresh tokens
- Role-based access control
- Input validation using Zod
- SQL injection prevention through Prisma ORM

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices

All UI components adapt to different screen sizes for optimal user experience.

## 🚀 Deployment

### Backend Deployment

You can deploy the backend to platforms like:
- Railway
- Heroku
- DigitalOcean App Platform
- AWS Elastic Beanstalk

Make sure to set the environment variables in your deployment platform.

### Frontend Deployment

You can deploy the frontend to:
- Vercel (recommended)
- Netlify
- GitHub Pages

For Vercel deployment:
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set the build command to `npm run build`
4. Set the output directory to `dist`
5. Add environment variables in the Vercel dashboard


## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Md Mazharul Islam**
- Email: mdmazharulislam.dev@gmail.com
- Phone: +8801911396142
- Location: Mymensingh, Dhaka, Bangladesh

## 🙏 Acknowledgements

- Thanks to all contributors who have helped build this project
- Inspired by modern task management applications like Trello and Asana