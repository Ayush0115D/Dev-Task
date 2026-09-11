# Product Management Application

A full-stack product management dashboard built with FastAPI, React, and MongoDB.

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI application
│   │   ├── database.py      # MongoDB connection
│   │   └── schemas.py       # Pydantic models
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── main.jsx         # React entry point
│   │   ├── App.jsx          # Main component
│   │   └── index.css        # Dark theme styles
│   ├── package.json
│   ├── vite.config.js
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

## Setup

### Using Docker (Recommended)

1. Clone the repository
2. Run the application:

```bash
docker compose up
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:8000

### Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get all products |
| GET | /api/products/{id} | Get single product |
| POST | /api/products | Create product |
| PUT | /api/products/{id} | Update product |
| DELETE | /api/products/{id} | Delete product |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| MONGODB_URL | MongoDB connection string | mongodb://localhost:27017 |
| DATABASE_NAME | Database name | product_db |

## Tech Stack

- **Backend:** FastAPI, Motor (async MongoDB driver), Pydantic
- **Frontend:** React, Vite
- **Database:** MongoDB
- **Containerization:** Docker, Docker Compose
