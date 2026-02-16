# Pollio - Real-Time Poll Rooms

**Pollio** is a premium, full-stack MERN application designed for creating and sharing real-time polls. Built with a focus on visual excellence, real-time interactivity, and fairness, it provides a seamless experience for both poll creators and participants.

## ✨ Features

- **Premium UI**: Sleek dark-mode aesthetic with glassmorphism, fluid animations (Framer Motion), and a custom toast system.
- **Real-Time Synchronicity**: Powered by Socket.io, poll results update instantly across all connected clients without page refreshes.
- **Secure Authentication**: JWT-based authentication for poll creators, ensuring persistent and private poll management.
- **Intelligent Anti-Abuse**: Layered mechanisms to prevent repetitive voting and ensure poll integrity.
- **Instant Sharing**: One-click sharing with unique, SEO-friendly poll links.

## 🛠️ Tech Stack

- **Frontend**: React 19 (Vite), Tailwind CSS, Framer Motion, Lucide React, Socket.io-client.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io.
- **Infrastructure**: Environment-aware configuration, trust-proxy support for deployment.

## 🛡️ Fairness & Anti-Abuse Mechanisms

To ensure integrity and prevent "vote stuffing," Pollio implements a two-layered defense:

1. **Server-Side IP Tracking (Primary)**:
   - Every poll document stores a unique list of voter IP addresses (`votedIPs`).
   - The backend is `trust proxy` aware, accurately identifying users even when behind reverse proxies (like Nginx).
   - *Advantage*: Blocks users from voting multiple times even if they clear their browser cache or use incognito mode.

2. **Client-Side Session Persistence (Secondary)**:
   - Uses `localStorage` to persist the "voted" state on the user's device.
   - *Advantage*: Provides an instant, seamless UX that "remembers" the user's choice across browser restarts and page refreshes, even before a network request is made.

## 🚀 Setup Instructions

### Backend
1. `cd Backend`
2. `npm install`
3. Configure `.env` (Template provided in `Backend/.env`).
4. `npm run dev`

### Frontend
1. `cd Frontend`
2. `npm install`
3. Configure `.env` (Template provided in `Frontend/.env`).
4. `npm run dev`

## 🧠 Edge Cases & Handled Scenarios

- **Network Instability**: Socket.io handles automatic reconnection for real-time updates.
- **Link Sharing**: Custom Toast feedback confirms successful clipboard copy, avoiding generic browser alerts.
- **State Persistence**: The "Voted" UI state is preserved using local storage, preventing "UI flickering" back to a voting state on refresh.
- **Proxy Headers**: Correct IP detection in production environments via `X-Forwarded-For` support.

## ⚠️ Known Limitations

- **Shared Networks**: Multiple users on the same public IP (e.g., in a single office) might be restricted to one vote collectively due to IP tracking.
- **VPN Bypass**: Users can circumvent IP tracking by rotating VPN locations.
- **No User Profiles for Voters**: Currently, voting is open to public participants; identity is tracked via IP rather than a required login for maximum engagement.
