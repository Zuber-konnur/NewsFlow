# 📰 NewsFlow - Modern News Website

NewsFlow is a full-stack news website built with **Qwik (frontend)**, **FastAPI (backend)**, and **Supabase (database & authentication)**.  
It fetches live news from the **GNews API** and provides features like authentication, saved articles, and user history.

---

## 🚀 Features
- ✅ Browse latest news by category (Home, Technology, Business, Sports, Science, Nation, Entertainment, Health)
- ✅ Search news articles
- ✅ Authentication (Signup/Login using Supabase)
- ✅ Save favorite news
- ✅ View history of last 20 articles viewed
- ✅ Text-to-Speech for news titles and descriptions
- ✅ Responsive & premium UI using **TailwindCSS**
- ✅ Secure environment variables & API key rotation for GNews API
- ✅ Deployed on **Vercel (frontend)** and **Render (backend)**

---

## 🏗️ Tech Stack
- **Frontend**: [Qwik + QwikCity](https://qwik.builder.io/) with TailwindCSS
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **News API**: [GNews API](https://gnews.io/)
- **Deployment**: Vercel (Frontend) + Render (Backend)

---

## 📂 Project Structure

### Frontend (`/frontend`)
frontend/
├── src/
│ ├── components/
│ │ ├── Navbar.tsx
│ │ └── ArticleCard.tsx
│ ├── routes/
│ │ ├── index.tsx # Home Page
│ │ ├── category.tsx # Category News
│ │ ├── history.tsx # User History
│ │ ├── saved.tsx # Saved Articles
│ │ ├── login.tsx # Login
│ │ └── register.tsx # Register
│ └── services/
│ └── api.ts # API Calls to Backend
├── src/global.css # TailwindCSS
└── .env # Frontend environment variables


### Backend (`/backend`)
backend/
├── app/
│ ├── main.py
│ ├── core/ # Config (CORS, DB, API keys)
│ ├── models/ # Pydantic Schemas
│ ├── routers/ # API Routes (auth, news, user)
│ └── services/ # GNews API logic
├── venv/ # Virtual Environment
├── requirements.txt
└── .env # Backend environment variables


---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/newsflow.git
cd newsflow

---

Backend Setup (FastAPI)
cd backend
python -m venv venv
source venv/bin/activate   # (Linux/Mac)
venv\Scripts\activate      # (Windows)

pip install -r requirements.txt
uvicorn app.main:app --reload

Backend runs at: http://127.0.0.1:8000

---

Frontend Setup (Qwik)
cd frontend
npm install
npm run dev

Frontend runs at: http://localhost:5173

---

🔑 Environment Variables
Backend .env
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_KEY=your-supabase-service-role-key
FRONTEND_URL=http://localhost:5173

GNEWS_API_KEY_1=your-api-key-1
GNEWS_API_KEY_2=your-api-key-2
GNEWS_API_KEY_3=your-api-key-3
GNEWS_API_KEY_4=your-api-key-4
GNEWS_API_KEY_5=your-api-key-5

Frontend .env
VITE_API_URL=http://127.0.0.1:8000/api
