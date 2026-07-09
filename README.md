# RentiGo — Vehicle Rental Platform

A centralized web platform for renting two-wheelers and four-wheelers on
daily/weekly/monthly terms, built on the MVC pattern with a Node/Express/MongoDB
backend and a React frontend.

## Folder structure

```
rentigo/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/              # Business logic (the "C" in MVC)
│   │   ├── authController.js     # register, login, refresh, logout
│   │   ├── vehicleController.js  # browse, CRUD, block/maintenance
│   │   ├── bookingController.js  # create, approve/reject, cancel
│   │   └── adminController.js    # stats, user mgmt, vehicle approval, analytics
│   ├── middleware/
│   │   └── auth.js               # verifyToken (JWT) + checkRole (RBAC)
│   ├── models/                   # Mongoose schemas (the "M" in MVC)
│   │   ├── User.js
│   │   ├── Vehicle.js
│   │   ├── Booking.js
│   │   └── PricingPlan.js
│   ├── routes/                   # Express route definitions
│   │   ├── authRoutes.js
│   │   ├── vehicleRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── pricingRoutes.js
│   │   ├── agencyRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   └── seed.js                # demo data seeder
│   ├── .env.example
│   ├── package.json
│   └── server.js                  # app entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── common/
        │   │   ├── Navbar.jsx
        │   │   └── ProtectedRoute.jsx   # RBAC route guard (the "V" helper)
        │   ├── customer/
        │   │   └── VehicleCard.jsx
        │   ├── agency/                  # (agency-specific shared components)
        │   └── admin/                   # (admin-specific shared components)
        ├── pages/                       # Views (the "V" in MVC)
        │   ├── auth/
        │   │   ├── Login.jsx
        │   │   └── Register.jsx
        │   ├── customer/
        │   │   ├── Home.jsx              # browse + search/filter
        │   │   ├── VehicleDetail.jsx
        │   │   ├── BookingFlow.jsx
        │   │   └── BookingHistory.jsx
        │   ├── agency/
        │   │   ├── AgencyDashboard.jsx
        │   │   └── FleetManagement.jsx
        │   └── admin/
        │       ├── AdminDashboard.jsx
        │       └── UserManagement.jsx
        ├── context/
        │   └── AuthContext.js            # global session state
        ├── services/
        │   └── api.js                    # Axios instance + interceptors
        ├── styles/
        │   └── main.css                  # mobile-first responsive styles
        ├── App.js                        # route definitions
        └── index.js
```

## MVC mapping

**Model** — `backend/models/*.js`. Four Mongoose schemas: `User`, `Vehicle`,
`Booking`, `PricingPlan`. Indexes on `(vehicle, pickupDate, returnDate)` and
`(city, type, status)` keep availability lookups fast as the fleet grows.

**Controller** — `backend/controllers/*.js`. All business logic lives here:
password hashing, JWT issuance, booking-conflict detection
(`Booking.hasConflict`), pricing calculation, and RBAC-gated admin actions.
Controllers never talk to Express directly — they only receive `req`/`res`
from the route layer, keeping them unit-testable.

**View** — `frontend/src/pages/*.jsx` + `components/*`. Three separate page
trees for customer, agency, and admin, each gated by `ProtectedRoute` using
the role embedded in the JWT.

## Getting started

### Backend
```bash
cd backend
cp .env.example .env        # fill in MONGO_URI, JWT secrets
npm install
npm run seed                # creates demo admin/agency/customer + 1 vehicle
npm run dev                 # starts on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm start                   # starts on http://localhost:3000
```

### Demo accounts (after `npm run seed`)
| Role     | Email                  | Password       |
|----------|------------------------|----------------|
| Admin    | admin@rentigo.com      | Admin@1234     |
| Agency   | agency@speedrent.com   | Agency@1234    |
| Customer | riya@email.com         | Customer@1234  |

## Key design decisions

- **Stateless JWT auth** with a 24h access token + 7-day refresh token stored
  server-side per user, so logout can revoke sessions immediately.
- **Booking conflict prevention** happens at the model layer
  (`Booking.hasConflict`) using a date-overlap query, called both when a
  customer books and when an agency tries to block a vehicle for maintenance.
- **Pricing** is a separate collection from `Vehicle` so rates can change
  independently of the vehicle record, and a category-default vs per-vehicle
  override pattern is easy to layer on top later.
- **RBAC** is enforced once in middleware (`checkRole`) rather than
  per-controller, so every new route automatically inherits consistent
  access control.

## Next steps (Phase 2, per PRD's Future Enhancements)
Payment gateway integration, native mobile apps, GPS tracking, dynamic
pricing, and insurance/damage workflows are intentionally left out of this
Phase 1 build, matching the PRD's stated scope.
