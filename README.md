# Authentication API - Supabase Backend

This is a Python/FastAPI authentication backend that uses **Supabase Auth** for user management and authentication.

## Features

- **FastAPI** - Modern, fast Python web framework
- **Supabase Auth** - Managed authentication service
- **JWT Tokens** - Secure token-based authentication with refresh tokens
- **Pydantic Validation** - Type-safe request/response validation
- **Auto-generated API Docs** - Interactive Swagger UI

## What This Backend Provides

This backend handles user authentication using Supabase's managed auth service:
- ✅ User registration
- ✅ User login (JWT + refresh tokens)
- ✅ Get current user info
- ✅ Token refresh
- ✅ Password reset
- ✅ User logout
- ✅ **Automatic password hashing** (handled by Supabase)
- ✅ **Token validation** (handled by Supabase)
- ✅ **OAuth ready** (configure in Supabase dashboard)

This backend **DOES NOT** handle:
- ❌ Business logic (trips, bookings, locations)
- ❌ Data operations beyond user management
- ❌ Any domain-specific functionality

## Quick Start

### Prerequisites

- Python 3.9+
- Supabase account (free tier: https://supabase.com)

**No local database needed!**

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click **New Project**
3. Fill in project details (name, password, region)
4. Wait 2-3 minutes for setup

### 2. Get Supabase Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGci...`

### 3. Install Dependencies

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 4. Configure Environment

```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

Your `.env` should look like:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SECRET_KEY=optional-additional-secret-key
```

### 5. Run the Application

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

**Users are automatically created in Supabase's auth.users table!**

## API Documentation

FastAPI provides automatic interactive API documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
  - Request: `{ "email": "user@example.com", "password": "password123", "full_name": "John Doe" }`
  - Response: User confirmation message

- `POST /api/auth/login` - Login (returns JWT tokens)
  - Request: `{ "email": "user@example.com", "password": "password123" }`
  - Response: `{ "access_token": "...", "refresh_token": "...", "token_type": "bearer", "user": {...} }`

- `GET /api/auth/me` - Get current user info (requires Bearer token)
  - Headers: `Authorization: Bearer {token}`
  - Response: User object

- `POST /api/auth/logout` - Logout (invalidates session)
  - Headers: `Authorization: Bearer {token}`
  - Response: `{ "message": "Successfully logged out" }`

- `POST /api/auth/refresh` - Refresh access token
  - Request: `{ "refresh_token": "..." }`
  - Response: `{ "access_token": "...", "refresh_token": "...", "token_type": "bearer" }`

- `POST /api/auth/reset-password-request` - Request password reset email
  - Request: `{ "email": "user@example.com" }`
  - Response: Confirmation message

- `POST /api/auth/update-password` - Update password
  - Headers: `Authorization: Bearer {token}`
  - Request: `{ "new_password": "newpass123" }`
  - Response: Success message

### Health Check
- `GET /` - API status
- `GET /health` - Health check

## User Storage

With Supabase, users are stored in Supabase's **auth.users** table:

### View in Supabase Dashboard:
1. Go to **Authentication** → **Users**
2. See all registered users
3. Can manually manage users (delete, ban, update)

**You don't create this table** - Supabase manages it automatically!

## Frontend Integration

To integrate with a frontend application:

### 1. Login Request
```javascript
const response = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: email,
    password: password
  })
});
const data = await response.json();
localStorage.setItem('access_token', data.access_token);
localStorage.setItem('refresh_token', data.refresh_token);
```

### 2. Authenticated Requests
```javascript
const token = localStorage.getItem('access_token');
const response = await fetch('http://localhost:8000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### 3. Refresh Token
```javascript
const refresh_token = localStorage.getItem('refresh_token');
const response = await fetch('http://localhost:8000/api/auth/refresh', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refresh_token })
});
const data = await response.json();
localStorage.setItem('access_token', data.access_token);
localStorage.setItem('refresh_token', data.refresh_token);
```

### 4. Logout
```javascript
await fetch('http://localhost:8000/api/auth/logout', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
```

## Security Features

- **Password Hashing**: Automatic via Supabase
- **JWT Tokens**: Short-lived access tokens + long-lived refresh tokens
- **Token Validation**: Automatic via Supabase
- **CORS**: Configured for frontend origins
- **Supabase Security**: Industry-standard cloud auth with SSL/TLS

## Supabase Features

### Built-in Features (Configure in Dashboard)

1. **Email Verification**
   - Enable in **Authentication** → **Settings**
   - Sends confirmation emails automatically

2. **OAuth Providers**
   - Google, GitHub, Facebook, etc.
   - Configure in **Authentication** → **Providers**

3. **Password Reset**
   - Automatic email templates
   - Customize in **Authentication** → **Email Templates**

4. **User Management**
   - View all users in dashboard
   - Ban, delete, or update users manually

## Development Tips

- Use `--reload` flag for auto-reload during development
- Check `/docs` for interactive API testing
- View users in Supabase dashboard: **Authentication** → **Users**
- Monitor API calls in Supabase: **API** → **Logs**

## Deployment

For production deployment:

1. Use production Supabase URL and keys
2. Set up proper CORS origins for your frontend domain
3. Use environment variables for all secrets
4. Enable HTTPS
5. Use Gunicorn with uvicorn workers:
   ```bash
   gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   ```

## Why Supabase?

✅ **No local database setup** - Works immediately  
✅ **Free tier** - Perfect for development and small projects  
✅ **Automatic backups** - Built into Supabase  
✅ **SSL/TLS** - Secure connections by default  
✅ **User dashboard** - Visual interface to manage users  
✅ **Scalable** - Grows with your application  
✅ **Built-in features** - Email verification, OAuth, password reset  
✅ **Refresh tokens** - Long-lived sessions built-in  

## Example Usage

### Register a new user
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secure123", "full_name": "John Doe"}'
```

### Login
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secure123"}'
```

### Get current user
```bash
curl -X GET "http://localhost:8000/api/auth/me" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Refresh token
```bash
curl -X POST "http://localhost:8000/api/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "YOUR_REFRESH_TOKEN"}'
```

## Support

For issues or questions:
- Check the Supabase documentation: https://supabase.com/docs
- Check FastAPI documentation: https://fastapi.tiangolo.com
- Check the `SUPABASE_MODULE_GUIDE.md` file for detailed configuration

## License

MIT


This is a Python/FastAPI authentication-only backend that provides JWT-based user authentication using Supabase PostgreSQL as the database.

## Features

- **FastAPI** - Modern, fast Python web framework
- **SQLAlchemy** - SQL ORM for database operations
- **Supabase PostgreSQL** - Cloud database (no local database needed!)
- **JWT Authentication** - Secure token-based authentication
- **Pydantic Validation** - Type-safe request/response validation
- **Auto-generated API Docs** - Interactive Swagger UI

## What This Backend Provides

This backend **ONLY** handles user authentication and authorization:
- ✅ User registration
- ✅ User login (JWT tokens)
- ✅ Get current user info
- ✅ User logout
- ✅ Password hashing (bcrypt)
- ✅ Token validation
- ✅ **Works with Supabase - no local database setup needed!**

This backend **DOES NOT** handle:
- ❌ Business logic (trips, bookings, locations)
- ❌ Data operations beyond user management
- ❌ Any domain-specific functionality

## Project Structure

```
python-backend/
├── app/
│   ├── auth/             # Authentication logic
│   │   ├── routes.py     # Auth endpoints (register, login, me, logout)
│   │   └── utils.py      # JWT utilities, password hashing
│   ├── core/             # Core functionality
│   │   ├── config.py     # Configuration
│   │   └── database.py   # Database connection
│   ├── models/           # Data models
│   │   ├── models.py     # SQLAlchemy User model
│   │   └── schemas.py    # Pydantic User schemas
│   └── main.py           # Application entry point
├── requirements.txt      # Python dependencies
├── .env.example         # Environment variables template
└── README.md            # This file
```

## Prerequisites

- Python 3.9+
- Supabase account (free tier available)

**No local PostgreSQL installation needed!**

## Quick Start with Supabase

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project (free tier is fine)
3. Wait for the database to be created

### 2. Get Your Connection String

1. In Supabase dashboard, go to **Settings** → **Database**
2. Scroll to **Connection string**
3. Select **URI** tab
4. Copy the connection string:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

### 3. Install Dependencies

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 4. Configure Environment

```bash
cp .env.example .env
# Edit .env with your Supabase connection string
```

Your `.env` should look like:
```env
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:your-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
SECRET_KEY=your-secret-key-change-this-to-something-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 5. Run the Application

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

**The `users` table will be automatically created in Supabase!**

## API Documentation

FastAPI provides automatic interactive API documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
  - Request: `{ "email": "user@example.com", "password": "password123", "full_name": "John Doe" }`
  - Response: User object

- `POST /api/auth/login` - Login (returns JWT token)
  - Request: Form data with `username` and `password`
  - Response: `{ "access_token": "...", "token_type": "bearer" }`

- `GET /api/auth/me` - Get current user info (requires Bearer token)
  - Headers: `Authorization: Bearer {token}`
  - Response: User object

- `POST /api/auth/logout` - Logout (client-side, just clears token)
  - Response: `{ "message": "Successfully logged out" }`

### Health Check
- `GET /` - API status
- `GET /health` - Health check

## Database Schema

The database contains only one table in Supabase:

### `users` table
- `id` (varchar) - Primary key (UUID)
- `email` (varchar) - Unique email address
- `password` (varchar) - Hashed password (bcrypt)
- `full_name` (varchar) - Optional full name
- `created_at` (timestamp) - Account creation date

**View this table in Supabase:**
- Go to **Table Editor** in Supabase dashboard
- You'll see the `users` table after first run

## Environment Variables

Required environment variables in `.env`:

```env
# Supabase Connection (required)
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:password@aws-0-region.pooler.supabase.com:6543/postgres

# JWT Configuration (required)
SECRET_KEY=your-secret-key-here-change-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Frontend Integration

To integrate with a frontend application:

1. **Login Request:**
```javascript
const response = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    username: email,
    password: password
  })
});
const data = await response.json();
localStorage.setItem('token', data.access_token);
```

2. **Authenticated Requests:**
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:8000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

3. **Logout:**
```javascript
localStorage.removeItem('token');
```

## Security Features

- **Password Hashing**: Uses bcrypt for secure password storage
- **JWT Tokens**: Stateless authentication with configurable expiration
- **Token Validation**: Automatic validation on protected endpoints
- **CORS**: Configured for frontend origins
- **SQL Injection Protection**: SQLAlchemy ORM with parameterized queries
- **Supabase Security**: Industry-standard cloud database with SSL

## Verifying Your Setup

After starting the backend:

1. **Check API Docs**: Visit http://localhost:8000/docs
2. **Register a User**: Use the Swagger UI to register
3. **Check Supabase Dashboard**: 
   - Go to **Table Editor**
   - See your new `users` table
   - View the registered user

## Common Supabase Connection Issues

### Issue: "could not connect to server"
**Solution:** Check your connection string is correct and password is updated

### Issue: "SSL connection error"
**Solution:** Use the pooler connection string (port 6543) from Supabase dashboard

### Issue: Password has special characters
**Solution:** URL-encode your password or use the connection string from Supabase directly

### Issue: "prepared statement already exists"
**Solution:** You're already using the right connection (transaction pooler on port 6543)

## Development Tips

- Use `--reload` flag for auto-reload during development
- Check `/docs` for interactive API testing
- Use `pytest` for testing (add tests in `tests/` directory)
- Run `black app/` for code formatting
- Run `mypy app/` for type checking

## Deployment

For production deployment:

1. Set `SECRET_KEY` to a strong random string (32+ characters)
2. Use Supabase production connection string
3. Set up proper CORS origins for your frontend domain
4. Use environment variables for all secrets
5. Enable HTTPS
6. Use Gunicorn with uvicorn workers:
   ```bash
   gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   ```

## Why Supabase?

✅ **No local database setup** - Works immediately  
✅ **Free tier** - Perfect for development and small projects  
✅ **Automatic backups** - Built into Supabase  
✅ **SSL/TLS** - Secure connections by default  
✅ **Dashboard** - Visual interface to see your data  
✅ **Scalable** - Grows with your application  

## Alternative: Local PostgreSQL

While this project is optimized for Supabase, you can use local PostgreSQL:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/auth_db
```

## Example Usage

### Register a new user
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secure123", "full_name": "John Doe"}'
```

### Login
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=secure123"
```

### Get current user
```bash
curl -X GET "http://localhost:8000/api/auth/me" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Support

For issues or questions:
- Check the Supabase documentation: https://supabase.com/docs
- Check FastAPI documentation: https://fastapi.tiangolo.com
- Check the `SUPABASE_SETUP.md` file for detailed Supabase configuration

## License

MIT
