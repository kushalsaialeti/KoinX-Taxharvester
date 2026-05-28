# KoinX Tax Loss Harvesting Tool

A production-grade, highly-interactive Tax Loss Harvesting (TLH) dashboard developed for KoinX. The tool enables cryptocurrency investors to analyze their portfolio, identify capital losses, and dynamically harvest them against realized capital gains to minimize their overall tax burden.

Developed as a modern Next.js 14 App Router application with React 18, TypeScript, Tailwind CSS, next-themes, and Framer Motion.

---

## Features

- **Tax Loss Harvesting Core Calculations**: Implements precise financial calculations to dynamically determine potential tax savings and effective capital gains pre/post harvesting.
- **Interactive SVG Tax Savings Meter**: A custom semicircular gauge visualizing real-time harvesting percentage and progress with smooth spring animations.
- **Staggered Table Entry**: Visualizes holdings sorted by absolute tax impact with staggered entrance animations, custom high-fidelity checkboxes, and row-level click toggle toggles.
- **Collapsible Notes & Disclaimers Accordion**: Includes critical contextual insights and warnings matching Figma specifications.
- **Premium Light/Dark/System Theme Support**: Clean theme transitions using next-themes and a segmented control pill.
- **In-Memory Rate Limiting**: Secures mock API endpoints using a continuously refilled Token Bucket rate limiter (max 30 requests/minute) per client IP.
- **Hardened Security Headers**: Complete Content Security Policy (CSP), clickjacking defense, type sniffing protection, and referrer configuration in `next.config.mjs`.

---

## Getting Started

### Prerequisites

Make sure you have Node.js (v18.x or later) and npm installed.

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kushalsaialeti/KoinX-Taxharvester.git
   cd KoinX-Taxharvester
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open the browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the tool.

5. **Build for production**:
   To compile and package the app for production deployment:
   ```bash
   npm run build
   ```

---

## Screenshots

*Note: Visual interfaces can be previewed locally using the development server. Dark mode, light mode, and system settings adapt dynamically.*

### Desktop Layout (Light Theme)
[Desktop Light Mode Interface Placeholder]

### Desktop Layout (Dark Theme)
[Desktop Dark Mode Interface Placeholder]

### Mobile Layout (Responsive)
[Mobile Responsive Dashboard Flow Placeholder]

---

## Core Assumptions & Technical Decisions

- **Currency Unit**: All values, gains, and averages are calculated and formatted in Indian Rupees (INR - ₹) using Indian number grouping (e.g. `₹1,00,000.00`).
- **Holdings Identifier**: To account for duplicate tickers across networks (e.g. multiple `USDC` assets), each holding is identified uniquely using a composite string `${coin}-${coinName}`.
- **Calculations Mode**: Pure functions execute synchronously without side effects or mutations, ensuring real-time calculation changes can be animated instantly.
- **Mock API Rate Limiting**: The rate limiter is stored in-memory (resets on server restart) and purges entries idle for >5 minutes on each check to prevent memory leaks in long-running processes.
- **Default Theme**: Adapts to the client's operating system preferences (`system` mode) automatically on first load, falling back gracefully.
