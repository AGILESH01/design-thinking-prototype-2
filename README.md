# Senior-Friendly UPI – Prototype Version 2
> **Design Thinking Prototype 2**: An accessible, senior-centric digital payments application designed to make UPI payments safer, transparent, and intuitive.

[![Tests](https://img.shields.io/badge/tests-85%20passed-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)]()
[![React](https://img.shields.io/badge/React-19.x-61dafb.svg)]()
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57.svg)]()

---

## 🌟 Key Features

### 1. 🎨 Colour-Differentiated Transaction History
- **Sent (Outgoing) Transactions**: Rendered in clear high-contrast **Red** (`-₹500`), with an upward arrow (`↑`), recipient name, and "Sent" badge.
- **Received (Incoming) Transactions**: Rendered in clear high-contrast **Green** (`+₹1,000`), with a downward arrow (`↓`), sender name, and "Received" badge.
- **Dynamic Directional Filters**: Instant filtering by **All**, **Sent**, or **Received** with live count badges.
- **Accessible Status Badges**: Independent status indicators for **Completed**, **Pending**, and **Failed** transactions to prevent confusion.

### 2. 🌐 Complete Indian Multilingual Support
- 4 full languages with 192 translated keys across every screen:
  - **English**
  - **हिन्दी (Hindi)**
  - **ಕನ್ನಡ (Kannada)**
  - **தமிழ் (Tamil)**
- Persistent language selection in local storage and backend SQLite database.
- Extensible translation architecture with dynamic parameter interpolation (`{amount}`, `{balance}`, `{limit}`).

### 3. 🛡️ High-Amount Transaction Warnings & Limit Protection
- Intelligent safety threshold comparison:
  - **High-Amount Warning Threshold**: ₹3,000
  - **Maximum Transaction Limit**: ₹5,000
  - **Minimum Transaction Limit**: ₹1
- Explicit warning dialog on payments $\ge$ ₹3,000 with verbal number-to-words (`"Three Thousand Five Hundred Rupees Only"`) and actions to **Review Payment** or **Continue**.
- Explainable anomaly detection for transactions exceeding $2.8\times$ the user's historical spending average.
- Strict balance check before PIN entry preventing overdrafts and duplicate deductions.

### 4. 👁️ Biometric Balance Protection & Real Hardware Sensors
- **Privacy by Default**: Account balance is masked as `₹ ••••••` with eye toggles and a prominent "View Balance" button.
- **Real Device Sensors**:
  - **Optical Face ID**: Uses the front camera sensor (`navigator.mediaDevices.getUserMedia`) with circular reticle and template matching.
  - **Touch ID / Platform Authenticator**: WebAuthn (`PublicKeyCredential`) integration for macOS Touch ID and Windows Hello.
  - **Tactile Haptic Feedback**: Gentle vibration pulses (`navigator.vibrate`) on keypad interactions and biometric confirmation.
- **Privacy Auto-Hide**: Automatically re-masks the balance after 30 seconds of inactivity or when navigating away from the home screen.
- **Demo PIN Fallback**: PIN `1234` available at all times.

### 5. 📊 Monthly Expense Infographics & Spending Analytics
- **Interactive SVG Doughnut Chart**: Categorizes spending into 7 distinct colors:
  - Food & Groceries
  - Utilities & Bills
  - Healthcare & Medicines
  - Transportation
  - Shopping & Gifts
  - Entertainment
  - Other Expenses
- **Strict Calculation Integrity**: Only completed outgoing transactions are counted. Received pension (`+₹2,500`), pending, and failed transactions are strictly excluded.
- **Month-over-Month Comparison**: Compare expenses across November 2026, October 2026, and September 2026 with percentage change metrics.
- **Accessible Data Table**: Tabular breakdown beneath the chart showing percentages, counts, and rupee amounts.

### 6. 🔊 Audio Chime & Spoken SoundBox Voice
- **Offline Web Audio API Chime**: Plays an uplifting 4-note ascending chord (`C5` $\to$ `E5` $\to$ `G5` $\to$ `C6`) upon payment completion.
- **SpeechSynthesis Voice SoundBox**: Announces payment completion out loud in the chosen language (Hindi, Kannada, Tamil, or English).

---

## 🗄️ Backend Architecture & Database

- **Native SQLite Database**: Powered by Node.js built-in `node:sqlite` (`senior_upi.sqlite`).
- **Data Tables**:
  - `users`: Stores user profile, demo PIN (`1234`), balance (`₹2,560`), limits, and language preference.
  - `biometric_credentials`: Stores registered WebAuthn credentials and optical face templates.
  - `biometric_audit_logs`: Complete audit trail of all authentication events.
  - `transactions`: Multi-month transaction records with status and categories.
  - `contacts`: Trusted contact list.
- **API Endpoints**:
  - `GET /api/user` — Fetch user profile & security status.
  - `POST /api/user/reveal-balance` — Reveal balance via PIN or Face ID.
  - `POST /api/face-id/enroll` — Enroll facial template in SQLite database.
  - `GET /api/transactions` — Fetch transaction history with filter support.
  - `POST /api/transactions/pay` — Atomic transaction deduction.
  - `POST /api/settings` — Update preferences and limits.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ (Node 22+ recommended for native `node:sqlite`)
- npm 10+

### Installation & Running Locally

```bash
# Clone the repository
git clone https://github.com/AGILESH01/design-thinking-prototype-2.git
cd design-thinking-prototype-2

# Install dependencies
npm install

# Start the development server (Frontend + Backend on port 5173)
npm run dev

# Run automated test suites (85 tests)
npm test

# Build for production
npm run build
```

---

## 🧪 Automated Test Suite

Run the full verification suite with:
```bash
npm test
```

Verifies:
- 192 translation keys across all 4 Indian languages
- High-amount warning thresholds and safety limits
- Number-to-words conversion
- Red/Green colour-differentiated transactions and filter partitions
- Monthly expense doughnut calculations and pension exclusion
- Balance privacy masking and biometric unmasking

---

## 📜 License
MIT License. Built for Design Thinking UPI Prototype demonstrations. All financial transactions are strictly simulated.
