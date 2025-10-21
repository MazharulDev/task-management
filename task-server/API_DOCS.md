# API Documentation

Base URL: `http://localhost:5000/api/v1`

## Authentication Endpoints

### 1. Register User

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Login User

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Note:** Refresh token is set in HTTP-only cookie

---

### 3. Refresh Token

**Endpoint:** `POST /auth/refresh-token`

**Headers:**
```
Cookie: refreshToken=<refresh_token>
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## User Endpoints

### 1. Get All Users

**Endpoint:** `GET /users`

**Auth Required:** Yes (ADMIN or SUPER_ADMIN)

**Headers:**
```
Authorization: <access_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sortBy` (optional): Field to sort by
- `sortOrder` (optional): asc | desc
- `searchTerm` (optional): Search in name and email
- `email` (optional): Filter by email
- `name` (optional): Filter by name
- `role` (optional): Filter by role

**Example:** `GET /users?page=1&limit=10&searchTerm=john&role=USER`

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25
  },
  "data": [
    {
      "id": "uuid-123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER",
      "createdAt": "2025-10-21T10:00:00.000Z",
      "updatedAt": "2025-10-21T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Single User

**Endpoint:** `GET /users/:id`

**Auth Required:** Yes (ADMIN or SUPER_ADMIN)

**Headers:**
```
Authorization: <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User fetched successfully",
  "data": {
    "id": "uuid-123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "createdAt": "2025-10-21T10:00:00.000Z",
    "updatedAt": "2025-10-21T10:00:00.000Z"
  }
}
```

---

### 3. Create User

**Endpoint:** `POST /users`

**Auth Required:** No (Public endpoint)

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "Jane Smith",
  "role": "USER"
}
```

**Note:** Role is optional and defaults to "USER"

**Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User created successfully",
  "data": {
    "id": "uuid-456",
    "email": "newuser@example.com",
    "name": "Jane Smith",
    "role": "USER",
    "createdAt": "2025-10-21T10:00:00.000Z",
    "updatedAt": "2025-10-21T10:00:00.000Z"
  }
}
```

---

### 4. Update User

**Endpoint:** `PATCH /users/:id`

**Auth Required:** Yes (ADMIN or SUPER_ADMIN)

**Headers:**
```
Authorization: <access_token>
```

**Request Body (All fields optional):**
```json
{
  "email": "updated@example.com",
  "password": "newpassword123",
  "name": "Jane Updated",
  "role": "ADMIN"
}
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User updated successfully",
  "data": {
    "id": "uuid-456",
    "email": "updated@example.com",
    "name": "Jane Updated",
    "role": "ADMIN",
    "createdAt": "2025-10-21T10:00:00.000Z",
    "updatedAt": "2025-10-21T10:30:00.000Z"
  }
}
```

---

### 5. Delete User

**Endpoint:** `DELETE /users/:id`

**Auth Required:** Yes (SUPER_ADMIN only)

**Headers:**
```
Authorization: <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User deleted successfully",
  "data": {
    "id": "uuid-456",
    "email": "deleted@example.com",
    "name": "Deleted User",
    "role": "USER",
    "createdAt": "2025-10-21T10:00:00.000Z",
    "updatedAt": "2025-10-21T10:00:00.000Z"
  }
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation Error",
  "errorMessages": [
    {
      "path": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "statusCode": 401,
  "message": "You are not authorized"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "statusCode": 403,
  "message": "Forbidden"
}
```

### Not Found (404)
```json
{
  "success": false,
  "statusCode": 404,
  "message": "User not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal Server Error"
}
```

---

## User Roles

- **SUPER_ADMIN**: Full access to all operations
- **ADMIN**: Can manage users (except delete)
- **USER**: Regular user access

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get All Users (with token)
```bash
curl -X GET http://localhost:5000/api/v1/users \
  -H "Authorization: YOUR_ACCESS_TOKEN"
```

---

## Testing with Postman

1. Import the endpoints into Postman
2. Set up an environment variable for `accessToken`
3. Add the token to Authorization header for protected routes
4. Use the refresh token endpoint when the access token expires
