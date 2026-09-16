# Store Rating Platform (MERN)

Full-stack app where Normal Users rate stores (1-5), Store Owners see their store's
ratings, and a System Administrator manages users/stores from a dashboard.

## Tech Stack
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Frontend: React (React Router, Axios)
- Auth: JWT, single login endpoint, role-based access (admin / user / owner)

## Folder Structure
```
store-rating-app/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── models/                   # User, Store, Rating (Mongoose schemas)
│   ├── middleware/auth.js        # JWT verify (protect) + role check (authorize)
│   ├── controllers/              # authController, adminController, storeController, ownerController
│   ├── routes/                   # authRoutes, adminRoutes, storeRoutes, ownerRoutes
│   ├── utils/validators.js       # Name/Email/Password/Address/Rating validation rules
│   ├── seed/seedAdmin.js         # creates the first System Administrator
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── public/index.html
    └── src/
        ├── api/axios.js          # axios instance + JWT interceptor
        ├── context/AuthContext.js
        ├── components/           # Navbar, PrivateRoute, StarRating, SortableHeader
        ├── pages/
        │   ├── Login.js, Signup.js, UpdatePassword.js
        │   ├── UserStores.js             (Normal User: browse/search/rate stores)
        │   ├── AdminDashboard.js, AdminUsers.js, AdminAddUser.js,
        │   │   AdminUserDetail.js, AdminStores.js, AdminAddStore.js
        │   └── OwnerDashboard.js         (Store Owner: raters + average rating)
        ├── utils/validators.js
        ├── App.js, App.css, index.js
        └── package.json
```

## Database Schema (MongoDB / Mongoose)
- **User**: `name` (3-60 chars), `email` (unique), `password` (hashed, bcrypt),
  `address` (max 400), `role` (`admin` | `user` | `owner`)
- **Store**: `name`, `email` (unique), `address`, `owner` (ref User, optional — links a
  Store Owner account to the store they manage)
- **Rating**: `user` (ref User), `store` (ref Store), `rating` (1-5); unique compound
  index on `(user, store)` so a resubmission simply updates the existing rating (upsert)

Average/overall ratings are **not stored redundantly** — they're computed on the fly via
MongoDB aggregation (`$group` + `$avg`) whenever a store list or dashboard is requested,
so the number is always accurate even after edits/deletes.

## Setup & Run

### 1. Backend
```bash
cd backend
npm install

# Create the .env file — `cp` only works in bash/macOS/Linux/Git Bash.
# On Windows cmd.exe use:      copy .env.example .env
# On Windows PowerShell use:   Copy-Item .env.example .env
# On macOS/Linux use:          cp .env.example .env
# (or just create a new file named ".env" and paste .env.example's contents in)

# then edit .env: set MONGO_URI to your MongoDB connection string, e.g.
#   MONGO_URI=mongodb://127.0.0.1:27017/store_rating_db
# (needs a running MongoDB — install MongoDB Community Server locally, or
#  use a free MongoDB Atlas cluster and paste its connection string here)

npm run seed:admin        # creates the first admin login (see .env for credentials)
npm run dev                # starts on http://localhost:5000
```
> If `npm run seed:admin` / `npm run dev` says `MongoDB connection error: ... "uri" ... got "undefined"`,
> it means **.env wasn't created/read** — the `MONGO_URI` value came through as empty.
> Double check a file literally named `.env` (not `.env.txt`) exists in `backend/` and
> that it has a `MONGO_URI=...` line with no quotes around the value.

### 2. Frontend
```bash
cd frontend
npm install

# Create .env the same way as above (copy / Copy-Item / cp), containing:
#   REACT_APP_API_URL=http://localhost:5000/api

npm run dev                # starts on http://localhost:3000
```

### 3. First login
Use the admin credentials from `backend/.env` (defaults: `admin@storerating.com` /
`Admin@12345`) to log in as System Administrator. From there:
1. Add a **Store Owner** user (role = Store Owner) via Admin → Add User.
2. Add a **Store** via Admin → Add Store and link it to that owner.
3. Sign up as a Normal User (or add one) to browse stores and submit ratings.

## Role-based Flow Summary
| Role | Can do |
|---|---|
| **Admin** | Add users/admins/stores, view dashboard stats, filter & sort user/store lists, view user detail (with rating if owner) |
| **Normal User** | Sign up, browse/search stores, submit or modify a 1-5 rating, change password |
| **Store Owner** | Log in, view average rating + list of users who rated their store, change password |

## Validation Rules (enforced both frontend & backend)
- Name: 3-60 characters
- Address: max 400 characters
- Password: 8-16 characters, at least 1 uppercase letter + 1 special character
- Email: standard email format
- Rating: integer 1-5

## API Overview
```
POST   /api/auth/signup            (Normal User self-registration)
POST   /api/auth/login             (all roles)
PUT    /api/auth/update-password   (any logged-in role)
GET    /api/auth/me

GET    /api/admin/dashboard        (admin)
POST   /api/admin/users            (admin)
GET    /api/admin/users            (admin, ?name=&email=&address=&role=&sortBy=&order=)
GET    /api/admin/users/:id        (admin)
POST   /api/admin/stores           (admin)
GET    /api/admin/stores           (admin, ?name=&email=&address=&sortBy=&order=)

GET    /api/stores                 (user, ?name=&address=&sortBy=&order=)
POST   /api/stores/:id/rating      (user — upsert)

GET    /api/owner/dashboard        (owner)
```

## Notes on Best Practices Followed
- Passwords hashed with bcrypt, never returned in API responses
- JWT auth via middleware, role-based `authorize()` guard on every protected route
- Server-side validation mirrors client-side validation (never trust the client)
- Mongoose indexes on frequently filtered/sorted fields + unique constraints where needed
- Centralized error handling and a 404 fallback in Express
- Environment-based config (`.env`) — no secrets committed