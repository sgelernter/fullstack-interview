# Fullstack Interview

- **Backend:** Django + Django REST Framework, PostgreSQL, session auth with CSRF
- **Frontend:** React + TypeScript + Vite, Tailwind CSS

## Prerequisites

- Python 3.12
- Node 22+
- A running PostgreSQL server

## Getting started

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env   # then fill in your Postgres credentials and a secret key
createdb fullstack_interview   # or whatever POSTGRES_DB is set to

python manage.py migrate
python manage.py runserver   # http://localhost:8000
```

### Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev   # http://localhost:5173
```

Open http://localhost:5173. Vite proxies `/api` requests to the backend on port 8000, so both servers need to be running.

## API

All endpoints are under `/api/`. Endpoints marked 🔒 require a logged-in session.

| Method | Path              | Description                                             |
| ------ | ----------------- | ------------------------------------------------------- |
| GET    | `csrf/`           | Sets the CSRF cookie                                    |
| POST   | `register/`       | Create a user (`email`, `password`)                     |
| POST   | `login/`          | Log in (`email`, `password`)                            |
| POST   | `logout/` 🔒      | Log out                                                 |
| GET    | `me/` 🔒          | Current user and their orders                           |
| GET    | `products/` 🔒    | Product list, proxied from Fake Store API               |
| POST   | `orders/` 🔒      | Place an order (`contents`: arbitrary JSON)             |
| DELETE | `orders/<id>/` 🔒 | Cancel (delete) one of your orders with status `PLACED` |
