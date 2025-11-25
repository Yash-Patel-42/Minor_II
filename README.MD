<div align="center">

![Tubix Logo](<Frontend/src/assets/Tubix(PNG)/2.png>)

# Tubix

**Collaborative YouTube Content Management Platform**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8%2B-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1-lightgrey)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)](https://www.mongodb.com/)

</div>

---

## Overview

Tubix is an enterprise-grade collaborative platform designed to streamline YouTube content management workflows for teams of all sizes. The platform enables content creators, editors, and managers to coordinate video production, manage approval workflows, and maintain granular permission controls across shared YouTube channels.

### The Problem We Solve

Modern YouTube content teams face significant challenges:

-   **Fragmented Communication**: Teams rely on multiple disconnected tools for video planning, editing feedback, and publishing coordination.
-   **Access Control Limitations**: YouTube's native permission system lacks fine-grained control required for professional workflows.
-   **Approval Bottlenecks**: No standardized approval process for video content before publication, leading to quality inconsistencies.
-   **Collaboration Barriers**: Difficulty managing multiple contributors across different roles and responsibilities within a single channel.

Tubix addresses these pain points by providing a centralized workspace with role-based permissions, structured approval workflows, and seamless YouTube integration.

---

## Features

### Core Capabilities

-   **Workspace Management**: Create isolated workspaces for different YouTube channels with custom permission matrices
-   **Role-Based Access Control**: Five-tier permission system (Owner, Admin, Manager, Editor, Viewer) with customizable capabilities
-   **Video Upload Pipeline**: Streamlined video upload interface with metadata management and thumbnail support
-   **Approval Workflows**: Multi-stage approval requests with commenting and review functionality
-   **YouTube Integration**: Direct OAuth integration with YouTube Data API v3 for channel management
-   **Real-time Notifications**: Socket.io-powered inbox system for collaboration updates
-   **AI Assistant**: Integrated AI agent powered by Gemini for content optimization and workflow assistance

### Security & Authentication

-   JWT-based authentication with refresh token rotation
-   Google OAuth 2.0 integration for YouTube channel access
-   Secure credential storage with bcrypt password hashing
-   Cookie-based session management with CORS protection

---

## Technology Stack

### Frontend

-   **Framework**: React 19.1 with TypeScript
-   **Build Tool**: Vite 7.1
-   **Routing**: React Router 7.9
-   **Styling**: Tailwind CSS 4.1
-   **Animations**: Framer Motion 12.23, AnimeJS 4.2
-   **State Management**: React Context API
-   **Form Handling**: React Hook Form 7.63
-   **HTTP Client**: Axios 1.12

### Backend

-   **Runtime**: Node.js with TypeScript
-   **Framework**: Express 5.1
-   **Database**: MongoDB with Mongoose 8.18
-   **Authentication**: JWT (jsonwebtoken 9.0), bcrypt 6.0
-   **File Upload**: Multer 2.0, Cloudinary 2.8
-   **Real-time**: Socket.io 4.8
-   **External APIs**: Google APIs 161.0, YouTube Data API v3

### AI Agent

-   **LLM Integration**: Google Generative AI (Gemini)
-   **Framework**: LangChain 1.0, LangGraph 1.0
-   **Server**: Express-based agent service with compression

---

## Project Structure

```
Minor_II/
├── Frontend/                   # React-based web application
│   ├── src/
│   │   ├── assets/            # Static assets including logos
│   │   ├── components/        # Reusable UI components
│   │   ├── Context/           # React context providers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Route-specific page components
│   │   │   ├── auth/          # Authentication pages (Login, Register)
│   │   │   ├── general/       # Main application pages
│   │   │   ├── policy/        # Privacy & Terms pages
│   │   │   └── youtube/       # YouTube-specific pages
│   │   ├── styles/            # Global styles and CSS modules
│   │   ├── types/             # TypeScript type definitions
│   │   └── utils/             # Utility functions and helpers
│   └── package.json
│
├── Backend/                    # Express API server
│   ├── src/
│   │   ├── approval/          # Approval request management
│   │   ├── config/            # Configuration (DB, Cloudinary, env)
│   │   ├── constant/          # Permission matrix constants
│   │   ├── helper/            # Business logic helpers
│   │   ├── inbox/             # Notification system
│   │   ├── middlewares/       # Authentication & authorization
│   │   ├── user/              # User management
│   │   ├── video/             # Video upload and metadata
│   │   ├── workspace/         # Workspace and member management
│   │   ├── youtubeChannel/    # YouTube API integration
│   │   └── utils/             # Shared utilities
│   ├── uploads/               # Temporary file storage
│   └── package.json
│
└── agent/                      # AI Assistant service
    ├── src/
    │   ├── config/            # Agent configuration
    │   ├── controllers/       # Request handlers
    │   ├── lib/               # Core agent logic
    │   ├── routes/            # API routes
    │   ├── tools/             # LangChain tools integration
    │   └── utils/             # LLM utilities (Gemini, Groq)
    └── package.json
```

---

## Installation

### Prerequisites

Ensure the following are installed on your system:

-   **Node.js**: v18.x or higher ([Download](https://nodejs.org/))
-   **npm**: v9.x or higher (included with Node.js)
-   **MongoDB**: v6.x or higher ([Installation Guide](https://www.mongodb.com/docs/manual/installation/))
-   **Git**: For cloning the repository ([Download](https://git-scm.com/))

### Environment Setup

1. **Clone the Repository**

    ```bash
    git clone https://github.com/yourusername/Minor_II.git
    cd Minor_II
    ```

2. **Backend Configuration**

    ```bash
    cd Backend
    npm install
    ```

    Create a `.env` file in the `Backend` directory:

    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/tubix
    JWT_SECRET=your_jwt_secret_key
    JWT_SECRET_REFRESH=your_refresh_secret_key
    FRONTEND_URL=http://localhost:3000

    # Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret

    # Google OAuth & YouTube API
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GOOGLE_REDIRECT_URI=http://localhost:5000/api/channel/oauth2callback
    ```

3. **Frontend Configuration**

    ```bash
    cd ../Frontend
    npm install
    ```

    Create a `.env` file in the `Frontend` directory:

    ```env
    VITE_API_URL=http://localhost:5000
    ```

4. **Agent Configuration**

    ```bash
    cd ../agent
    npm install
    ```

    Create a `.env` file in the `agent` directory:

    ```env
    PORT=3001
    GEMINI_API_KEY=your_gemini_api_key
    GROQ_API_KEY=your_groq_api_key
    ```

5. **Google Cloud Console Setup**

    To enable YouTube integration:

    - Create a project in [Google Cloud Console](https://console.cloud.google.com/)
    - Enable YouTube Data API v3
    - Create OAuth 2.0 credentials
    - Add authorized redirect URIs: `http://localhost:5000/api/channel/oauth2callback`
    - Download credentials and update `.env` with Client ID and Secret

---

## Usage

### Development

Start all services concurrently in separate terminal windows:

1. **Backend Server**

    ```bash
    cd Backend
    npm run dev
    ```

    Server will start on `http://localhost:5000`

2. **Frontend Application**

    ```bash
    cd Frontend
    npm run dev
    ```

    Application will start on `http://localhost:3000`

3. **AI Agent Service**

    ```bash
    cd agent
    npm run agent
    ```

    Agent will start on `http://localhost:3001`

4. **MongoDB**
    ```bash
    # Ensure MongoDB is running
    mongod --dbpath /path/to/your/data/directory
    ```

### Production

Build optimized production bundles:

```bash
# Backend
cd Backend
npm run build
npm start

# Frontend
cd Frontend
npm run build
npm run preview

# Agent
cd agent
npm run build
npm run agent
```

### First-Time Setup

1. Navigate to `http://localhost:3000`
2. Register a new account
3. Authenticate with Google to connect your YouTube channel
4. Create your first workspace
5. Invite team members via email
6. Configure workspace permissions
7. Start uploading and managing content

---

## API Documentation

### Base URLs

-   **Backend API**: `http://localhost:5000/api`
-   **Agent API**: `http://localhost:3001`

### Key Endpoints

#### Authentication

-   `POST /api/users/register` - User registration
-   `POST /api/users/login` - User login
-   `POST /api/users/logout` - User logout
-   `GET /api/users/refresh` - Refresh access token

#### Workspaces

-   `GET /api/workspaces` - List all workspaces
-   `POST /api/workspaces` - Create workspace
-   `GET /api/workspaces/:id` - Get workspace details
-   `PUT /api/workspaces/:id` - Update workspace
-   `DELETE /api/workspaces/:id` - Delete workspace

#### Videos

-   `POST /api/videos/upload` - Upload video
-   `GET /api/videos/:workspaceId` - List workspace videos
-   `PUT /api/videos/:id` - Update video metadata
-   `DELETE /api/videos/:id` - Delete video

#### Approval Requests

-   `POST /api/approval-requests` - Create approval request
-   `GET /api/approval-requests/:workspaceId` - List approval requests
-   `PUT /api/approval-requests/:id` - Update approval status

---

## Contributing

We welcome contributions from the community. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes following conventional commit standards
4. Push to your branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request with a detailed description

### Code Standards

-   Use TypeScript for all new code
-   Follow ESLint and Prettier configurations
-   Write meaningful commit messages
-   Include type definitions for all functions
-   Add comments for complex business logic

---

## License

This project is licensed under the ISC License. See the `LICENSE` file for details.

---

## Contact & Support

For questions, issues, or feature requests, please open an issue on the GitHub repository.

**Project Maintainers**: Yash Patel

---

<div align="center">

**Built with precision for content creators who demand professional workflows**

[Report Bug](https://github.com/yourusername/Minor_II/issues) • [Request Feature](https://github.com/yourusername/Minor_II/issues)

</div>
