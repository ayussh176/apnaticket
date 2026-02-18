# APNATICKET 🎟️

ApnaTicket is a modern, full-stack ticketing platform designed for booking Railway, Metro, and Event tickets with a focus on ease of use and security.

## 🚀 Features

- **User Roles**: Separate flows for Majors, Minors (with Guardian validation), and Admins.
- **Booking Engine**: Validates identity documents (PAN/Aadhaar) and enforces daily booking limits.
- **E-Rupee Wallet**: Integrated wallet system for seamless payments and refunds.
- **Dashboard**: Real-time overview of latest bookings and wallet balance.
- **Security**: JWT Authentication, Role-Based Access Control (RBAC), and Audit Logging.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **State Management**: React Hooks

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JSON Web Tokens (JWT), Bcrypt
- **Logging**: Winston

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/your-repo/apnaticket.git
cd apnaticket
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd server
npm install
cp .env.example .env # Configure your PORT, JWT_SECRET, DB_URL
npm start
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd client
npm install
# Update .env with VITE_API_BASE=http://localhost:5000
npm run dev
\`\`\`

## 🧪 Testing Credentials

| Role | Email | Password | valid ID |
|------|-------|----------|----------|
| **Major** | `user@example.com` | `password` | `ABCDE1234F` (PAN) |
| **Minor** | `minor@example.com` | `password` | `123456789012` (Aadhaar) |
| **Admin** | `admin@example.com` | `admin123` | N/A |

## 🌐 Deployment

- **Frontend**: Deployed on Vercel.
- **Backend**: Deployed on Render/Railway.

## 🛡️ Security Measures
- **Rate Limiting**: Protects against brute-force attacks.
- **Input Validation**: Strict regex checks for PAN and Aadhaar.
- **Audit Logs**: Tracks all critical actions (Bookings, Cancellations, Recharges).
