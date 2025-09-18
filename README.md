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
├── src/ <br>
│ ├── components/ <br>
│ │ ├── Navbar.tsx <br>
│ │ └── ArticleCard.tsx <br>
│ ├── routes/ <br>
│ │ ├── index.tsx # Home Page <br>
│ │ ├── category.tsx # Category News <br>
│ │ ├── history.tsx # User History <br>
│ │ ├── saved.tsx # Saved Articles <br>
│ │ ├── login.tsx # Login <br>
│ │ └── register.tsx # Register <br>
│ └── services/ <br>
│ └── api.ts # API Calls to Backend <br>
├── src/global.css # TailwindCSS <br>
└── .env # Frontend environment variables <br>


### Backend (`/backend`)
backend/ <br>
├── app/ <br>
│ ├── main.py <br>
│ ├── core/ # Config (CORS, DB, API keys) <br>
│ ├── models/ # Pydantic Schemas <br>
│ ├── routers/ # API Routes (auth, news, user) <br>
│ └── services/ # GNews API logic <br>
├── venv/ # Virtual Environment <br>
├── requirements.txt <br>
└── .env # Backend environment variables <br>


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
