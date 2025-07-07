# SafeGuard: Real-Time Disaster Response Platform

**SafeGuard** is a web-based application designed to facilitate communication and coordination during emergency and disaster situations. It connects users in need with volunteers and administrators through a real-time chat system, incident reporting, and a live map.

**Live Demo:** [Link to your deployed application]

## Key Features

-   **Real-Time Chat**: One-on-one and group chats between users, volunteers, and admins.
-   **Message Status**: WhatsApp-style "sent," "delivered," and "seen" indicators.
-   **Typing Indicators & Online Status**: See when users are typing or are online.
-   **Incident Reporting**: Users can report emergencies with details.
-   **Help Requests**: Users can request assistance from registered volunteers.
-   **Admin Dashboard**: A central hub for administrators to monitor chats, manage users, and broadcast alerts.
-   **Admin Broadcasts**: Admins can send out global alerts to all users.
-   **Live Disaster Map**: Visualize incident locations and safe zones.
-   **Secure Authentication**: Powered by Firebase Authentication for secure user login and registration.
-   **Role-Based Access Control**: Different permissions for regular users, volunteers, and administrators enforced by Firestore Security Rules.
-   **Responsive Design**: A modern and mobile-friendly UI built with Tailwind CSS.

## Tech Stack

### Frontend

-   **Framework**: [React.js](https://reactjs.org/) with [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Routing**: [React Router](https://reactrouter.com/)
-   **State Management**: React Context API
-   **Real-Time Communication**: [Socket.IO Client](https://socket.io/docs/v4/client-api/)
-   **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore) & [Firebase Authentication](https://firebase.google.com/docs/auth)

### Backend

-   **Runtime**: [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/)
-   **Language**: [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
-   **Real-Time Communication**: [Socket.IO](https://socket.io/)
-   **Database**: [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) for server-side operations.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

## Project Structure

```
SafeGuard/
├── frontend/                    # React.js frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Chat/          # Chat-related components
│   │   │   ├── Layout/        # Layout components (Header, Sidebar)
│   │   │   ├── Alerts/        # Alert and notification components
│   │   │   ├── Dashboard/     # Dashboard components
│   │   │   └── Map/           # Map-related components
│   │   ├── pages/             # Page components
│   │   │   ├── Auth/          # Authentication pages
│   │   │   ├── User/          # User-specific pages
│   │   │   ├── Admin/         # Admin-specific pages
│   │   │   ├── Chat/          # Chat pages
│   │   │   └── Volunteer/     # Volunteer pages
│   │   ├── contexts/          # React Context providers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── types/             # TypeScript type definitions
│   │   └── utils/             # Utility functions
│   ├── public/                # Static assets
│   ├── package.json
│   └── vite.config.ts
├── backend/                    # Node.js backend server
│   ├── index.js              # Main server file
│   ├── routes/               # API routes
│   ├── middleware/           # Express middleware
│   ├── utils/                # Backend utilities
│   ├── package.json
│   └── serviceAccountKey.json # Firebase service account (not in repo)
├── firestore.rules            # Firestore security rules
├── .gitignore
├── README.md
└── package.json
```

### Prerequisites

-   [Node.js](https://nodejs.org/en/download/) (v18 or newer recommended)
-   [npm](https://www.npmjs.com/get-npm) or [yarn](https://classic.yarnpkg.com/en/docs/install/)
-   A [Firebase](https://firebase.google.com/) project with Firestore and Authentication enabled.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/mshiveshm/SafeGuard.git
    cd SafeGuard
    ```

2.  **Set up the Backend:**
    -   Navigate to the `backend` directory: `cd backend`
    -   Install dependencies: `npm install`
    -   Create a `.env` file and add your Firebase project configuration.
    -   **Important**: Download your Firebase service account key, rename it to `serviceAccountKey.json`, and place it in the `backend` directory.
    -   Start the server: `npm start`

3.  **Set up the Frontend:**
    -   Navigate to the `frontend` directory: `cd ../frontend`
    -   Install dependencies: `npm install`
    -   Create a `.env` file and add your Firebase client-side configuration keys (apiKey, authDomain, etc.).
    -   Start the development server: `npm run dev`

4.  **Deploy Firestore Rules:**
    -   Install the Firebase CLI: `npm install -g firebase-tools`
    -   Log in to Firebase: `firebase login`
    -   Deploy the rules from the root directory: `firebase deploy --only firestore:rules`

The application should now be running locally, with the frontend accessible at `http://localhost:5173` and the backend at `http://localhost:3001`.

---

Thank you for checking out SafeGuard!
