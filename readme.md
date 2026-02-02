# 🎫 APNATICKET – A Secure, Transparent, Agent-Free Booking Platform Using E-Rupee

APNATICKET is a full-stack FinTech + GovTech platform designed to eliminate agent-driven ticket hoarding and black marketing. It uses identity-verified booking (PAN/Aadhaar), simulates CBDC (E-Rupee) wallet payments, enforces booking limits, and ensures full auditability of public ticketing services like railways, metros, and large events.

---

## 🧱 Tech Stack

### Frontend
- **React + TypeScript** (via Vite)
- **Tailwind CSS** for modern UI styling
- **PostCSS + Autoprefixer**
- Secure file upload for PAN/Aadhaar image verification

### Backend
- **Node.js + Express**
- **PostgreSQL** with Prisma or Sequelize ORM
- **JWT** for authentication
- **Rate limiting** and abuse detection
- **AES-256 encryption** for sensitive data

### Other
- **E-Rupee Wallet (Simulated)** – user balance, traceable payments
- **QR-code ticketing** with encrypted metadata
- **Admin Dashboard** for monitoring & anomaly detection
- **Immutable Logs** for audit compliance

---

## 🔐 Key Features

- PAN/Aadhaar-based user registration and login
- One PAN = max 2 tickets per booking cycle
- Identity-linked tickets (no anonymous bookings)
- IP + UserID-based blocking for mass-booking attempts
- E-Rupee wallet simulation — no UPI/cards allowed
- Role-based access (User, Admin)
- Admin can view all bookings, flag suspicious activity

---

## 🏗️ Folder Structure

- /client → React frontend (Vite)
- /server → Express backend (Node.js)
- /docs → Architecture, DB schema, flowcharts
- /infra → Docker, CI/CD (AWS or Render)
- /design → UI wireframes, admin panel sketches


---

## 🚀 Getting Started (Dev)

### Clone the repo:
```bash
git clone https://github.com/ayussh176/apnaticket.git
cd apnaticket

cd client
npm install
npm run dev

cd server
npm install
node index.js

