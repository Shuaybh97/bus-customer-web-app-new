# Getting Started - Supabase Authentication

## ⚡ Quick Start (5 Minutes)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up / Create new project
3. Wait for setup (~2 mins)

### 2. Get Credentials
1. Go to **Settings** → **API**
2. Copy:
   - **URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGci...`

### 3. Backend Setup
```bash
# Install Python dependencies
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure
cp .env.example .env
# Edit .env: paste your SUPABASE_URL and SUPABASE_KEY

# Run
uvicorn app.main:app --reload --port 8000
```

✅ Backend running at http://localhost:8000  
✅ API docs at http://localhost:8000/docs

### 4. Frontend Setup
```bash
# Install Node dependencies
npm install

# Run
npm run dev
```

✅ Frontend running at http://localhost:5173

### 5. Test It!
1. Open http://localhost:5173
2. Click "Sign In / Register"
3. Create account
4. Check Supabase dashboard: **Authentication** → **Users**

---

## 📦 What's Included

- **Backend**: Python/FastAPI with Supabase Auth
- **Frontend**: React/TypeScript with automatic token refresh
- **Features**: Register, Login, Refresh tokens, Password reset

---

## 📚 Documentation

- **SETUP.md** - Detailed setup guide
- **README.md** - API documentation
- **BACKEND_REQUIREMENTS.md** - Python/dependencies
- **FRONTEND_REQUIREMENTS.md** - Node/dependencies
- **TOKEN_REFRESH_EXPLAINED.md** - How token refresh works
- **SUPABASE_MODULE_GUIDE.md** - Supabase features

---

## 🔧 Requirements

- Python 3.9+
- Node.js 18+
- Supabase account (free)

---

## 🎯 Stack

| Component | Technology |
|-----------|------------|
| Backend | FastAPI + Supabase Auth |
| Frontend | React + TypeScript + Vite |
| Styling | TailwindCSS + Radix UI |
| State | React Query |
| Auth | JWT + Refresh Tokens |
| Database | Supabase (cloud) |

---

## 🚀 API Endpoints

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login (returns access + refresh tokens)
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout
- `POST /api/auth/reset-password-request` - Password reset email
- `POST /api/auth/update-password` - Update password

---

## 💡 Key Features

✅ Automatic token refresh (frontend-managed)  
✅ Secure password hashing (Supabase)  
✅ Email verification ready  
✅ OAuth ready (Google, GitHub, etc.)  
✅ Production-ready  
✅ No local database needed  

---

## 🐛 Common Issues

**"No module named 'supabase'"**
```bash
source venv/bin/activate
pip install -r requirements.txt
```

**"SUPABASE_URL not found"**
```bash
# Check .env file exists
cat .env
```

**Port already in use**
```bash
# Backend:
uvicorn app.main:app --reload --port 8001

# Frontend:
npm run dev -- --port 3000
```

---

**Need help?** Check the detailed guides in the docs folder!
