# Zervvo - Books & Authors API

A simple backend system with JWT authentication, Redis rate limiting, and book/author management.

##  Features

- JWT login system with password hashing
- Two user roles (ADMIN and USER) with different permissions
- Rate limiting with Redis (prevents spam)
- Image upload for book covers (auto-resize to 250X250)
- Authors can have multiple books (no duplicate titles)
- Query params to choose which fields to return
- Proper error messages

---

##  Stack

- Node.js + Express
- MySQL database
- JWT for auth
- Redis for rate limiting
- Sharp for image resizing
- Multer for file uploads
- Joi for validation

---

##  Installation

### Prerequisites
- Node.js
- MySQL
- Redis

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd zervvo
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables** (see [Environment Variables](#environment-variables))

4. **Start the server**
```bash
npm start
```

The server will run on `http://localhost:3005` by default.

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Server
PORT=3005
URL=http://localhost:3005

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=zervvo

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://localhost:6379

# Rate Limiting
RATE_LIMIT_WINDOW_SECONDS=60
RATE_LIMIT_MAX_REQUESTS=10
```

---

##  User Roles

### **ADMIN**
- Full access to all endpoints
- Can create, read, update, and delete authors
- Can create, read, update, and delete books
- Can upload book cover images
- Subject to user-based rate limiting (10 requests/min per user)

### **USER**
- Read-only access to authors and books
- Can view author details and associated books
- Cannot create, update, or delete resources
- Subject to user-based rate limiting (10 requests/min per user)

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user (Rate limit: IP-based)
- `POST /api/auth/login` - User login (Rate limit: IP-based)

### Authors
- `POST /api/authors` - Create (ADMIN only)
- `GET /api/authors` - List all (ADMIN, USER)
- `GET /api/authors/:id` - Get single (ADMIN, USER)
- `GET /api/authors/:id/books` - Get author with books (ADMIN, USER)
- `PUT /api/authors/:id` - Update (ADMIN only)
- `DELETE /api/authors/:id` - Delete (ADMIN only)

### Books
- `POST /api/books` - Create (ADMIN only)
- `GET /api/books` - List all (ADMIN, USER)
- `GET /api/books/:id` - Get single (ADMIN, USER)
- `PUT /api/books/:id` - Update (ADMIN only)
- `DELETE /api/books/:id` - Delete (ADMIN only)
- `POST /api/books/:id/upload-image` - Upload cover (ADMIN only)

**All protected endpoints require JWT authentication and use User ID-based rate limiting (10 req/min per user)**

**Query Parameters**: Most GET endpoints support `fields` parameter for selecting specific fields
- Example: `/api/authors?fields=id,name`


##  Rate Limiting

Two types of rate limiting:

### IP-Based (Auth routes)
- `/api/auth/register` and `/api/auth/login`
- 10 requests per 60 seconds per IP
- Stops brute force attacks

### User ID-Based (Protected routes)
- All `/api/authors/*` and `/api/books/*` endpoints
- 10 requests per 60 seconds per user
- Prevents abuse

### Configuration
Update rate limiting parameters in `.env`:
```env
RATE_LIMIT_WINDOW_SECONDS=60      # Time window in seconds
RATE_LIMIT_MAX_REQUESTS=10        # Maximum requests per window
```

### Rate Limit Headers
All responses include rate limit information:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 45
```

---

##  File Upload

`POST /api/books/:id/upload-image` - Upload book cover

### Supported
- PNG, JPEG, JPG
- Max 5MB

### What happens
- Original saved to `uploads/books/original/`
- Resized to 250x250px WebP format
- Stored in `uploads/books/resized/`

### Storage Structure
```
uploads/
└── books/
    ├── original/
    │   └── {timestamp}.{ext}
    └── resized/
        └── {filename}{bookId}.webp
```

### Response
The API returns both image URLs:
```json
{
  "message": "Book cover uploaded successfully",
  "image": "http://localhost:3005/uploads/books/resized/filename.webp",
  "originalImage": "http://localhost:3005/uploads/books/original/filename.jpg"
}
```


## Auth

Token contains: id, email, name, role

- Access token: 7 days
- Refresh token: 12 days

Use in requests:
```bash
curl -H "Authorization: Bearer {token}" http://localhost:3005/api/authors
```

---


## Quick Start

### 1. Register a User
```bash
curl -X POST http://localhost:3005/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "ADMIN"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3005/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### 3. Create an Author
```bash
curl -X POST http://localhost:3005/api/authors \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "J.K. Rowling"
  }'
```

### 4. Create a Book
```bash
curl -X POST http://localhost:3005/api/books \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Harry Potter",
    "authorId": 1,
    "publishedYear": 1997
  }'
```

### 5. Upload Book Cover
```bash
curl -X POST http://localhost:3005/api/books/1/upload-image \
  -H "Authorization: Bearer {accessToken}" \
  -F "image=@/path/to/image.jpg"
```

