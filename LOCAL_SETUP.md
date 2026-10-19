# SkillSwap – Local Setup & Development Guide

## Table of Contents
1. [Project Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Project Structure](#project-structure)
5. [Backend Setup (Spring Boot)](#backend-setup)
6. [Frontend Setup (React)](#frontend-setup)
7. [OAuth2 Configuration](#oauth2-configuration)
8. [Running the Application](#running)
9. [API Reference](#api-reference)
10. [Feature Walkthrough](#features)
11. [Troubleshooting](#troubleshooting)

---

## 1. Project Overview {#overview}

**SkillSwap** is a full-stack service marketplace platform where users can:
- Browse and search professional services
- Create and manage service listings
- Book services and manage bookings
- Chat in real-time with providers/clients
- Leave and respond to reviews
- Sign in with Google or GitHub (OAuth2)

---

## 2. Tech Stack {#tech-stack}

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend    | Java 21, Spring Boot 3.2, Spring Security |
| Database   | MongoDB 7.x                             |
| Auth       | JWT + OAuth2 (Google, GitHub)           |
| Build Tool | Maven 3.9+                              |

---

## 3. Prerequisites {#prerequisites}

Install all of the following before proceeding:

### Java 21
```bash
# Ubuntu/Debian
sudo apt install openjdk-21-jdk

# macOS (Homebrew)
brew install openjdk@21

# Verify
java -version   # should show openjdk 21.x
```

### Maven 3.9+
```bash
# Ubuntu/Debian
sudo apt install maven

# macOS
brew install maven

# Verify
mvn -version
```

### Node.js 18+ & npm
```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Verify
node -v   # v18.x or higher
npm -v    # 9.x or higher
```

### MongoDB 7.x
```bash
# Ubuntu
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update && sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# macOS
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0

# Verify
mongosh --eval "db.runCommand({ connectionStatus: 1 })"
```

---

## 4. Project Structure {#project-structure}

```
skillswap/
├── backend/                          # Spring Boot application
│   ├── pom.xml
│   └── src/main/java/com/skillswap/
│       ├── SkillSwapApplication.java
│       ├── config/
│       │   └── SecurityConfig.java
│       ├── controller/
│       │   ├── AuthController.java
│       │   ├── UserController.java
│       │   ├── ServiceController.java
│       │   ├── BookingController.java
│       │   ├── ReviewController.java
│       │   └── MessageController.java
│       ├── dto/
│       │   ├── AuthDto.java
│       │   ├── UserDto.java
│       │   ├── ServiceDto.java
│       │   ├── BookingDto.java
│       │   └── ReviewDto.java
│       ├── model/
│       │   ├── User.java
│       │   ├── Service.java
│       │   ├── Booking.java
│       │   ├── Review.java
│       │   └── Message.java
│       ├── repository/
│       │   ├── UserRepository.java
│       │   ├── ServiceRepository.java
│       │   ├── BookingRepository.java
│       │   ├── ReviewRepository.java
│       │   └── MessageRepository.java
│       ├── security/
│       │   ├── JwtUtils.java
│       │   ├── JwtAuthenticationFilter.java
│       │   ├── UserDetailsServiceImpl.java
│       │   └── OAuth2AuthenticationSuccessHandler.java
│       └── service/
│           ├── AuthService.java
│           ├── UserService.java
│           ├── ServiceService.java
│           ├── BookingService.java
│           ├── ReviewService.java
│           └── MessageService.java
│
└── frontend/                         # React application
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── context/
        │   └── AuthContext.jsx
        ├── utils/
        │   └── api.js
        ├── components/
        │   ├── common/
        │   │   ├── Navbar.jsx
        │   │   ├── Footer.jsx
        │   │   └── StarRating.jsx
        │   ├── services/
        │   │   ├── ServiceCard.jsx
        │   │   └── ReviewCard.jsx
        │   └── booking/
        │       └── BookingCard.jsx
        └── pages/
            ├── HomePage.jsx
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── ServicesPage.jsx
            ├── ServiceDetailPage.jsx
            ├── DashboardPage.jsx
            ├── ProfilePage.jsx
            ├── BookingsPage.jsx
            ├── MessagesPage.jsx
            ├── CreateServicePage.jsx
            ├── EditServicePage.jsx
            ├── ProviderProfilePage.jsx
            ├── OAuth2RedirectPage.jsx
            └── NotFoundPage.jsx
```

---

## 5. Backend Setup (Spring Boot) {#backend-setup}

### Step 1 — Clone / copy the project
```bash
# Navigate to the backend folder
cd skillswap/backend
```

### Step 2 — Configure application.properties
Open `src/main/resources/application.properties` and update:

```properties
# MongoDB — no changes needed if MongoDB is on localhost
spring.data.mongodb.uri=mongodb://localhost:27017/skillswap

# JWT Secret — CHANGE THIS in production (min 32 chars)
app.jwt.secret=YourSuperSecretKeyForSkillSwapPlatform2024MustBeLongEnoughForHS512Algorithm

# OAuth2 — fill in after Step 7 (OAuth2 Configuration)
spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET
spring.security.oauth2.client.registration.github.client-id=YOUR_GITHUB_CLIENT_ID
spring.security.oauth2.client.registration.github.client-secret=YOUR_GITHUB_CLIENT_SECRET
```

### Step 3 — Build and run
```bash
# Download dependencies and build
mvn clean install -DskipTests

# Run the application
mvn spring-boot:run

# Alternatively, build a JAR and run it
mvn clean package -DskipTests
java -jar target/skillswap-backend-1.0.0.jar
```

The backend will start on **http://localhost:8080**

### Step 4 — Verify backend is running
```bash
curl http://localhost:8080/api/services
# Should return: {"content":[],"totalElements":0,...}
```

---

## 6. Frontend Setup (React) {#frontend-setup}

### Step 1 — Install dependencies
```bash
cd skillswap/frontend
npm install
```

### Step 2 — Start development server
```bash
npm run dev
```

The frontend will start on **http://localhost:3000**

The Vite dev server proxies `/api` and `/oauth2` requests to `http://localhost:8080`, so no CORS issues during development.

### Step 3 — Build for production
```bash
npm run build
# Output is in the dist/ folder
```

---

## 7. OAuth2 Configuration {#oauth2-configuration}

OAuth2 login is optional for local development. To enable it:

### Google OAuth2
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client IDs**
5. Set Application Type to **Web application**
6. Add Authorized redirect URIs:
   ```
   http://localhost:8080/oauth2/callback/google
   ```
7. Copy the **Client ID** and **Client Secret** into `application.properties`

### GitHub OAuth2
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Set the callback URL to:
   ```
   http://localhost:8080/oauth2/callback/github
   ```
4. Copy the **Client ID** and generate a **Client Secret**
5. Add them to `application.properties`

---

## 8. Running the Application {#running}

### Development (recommended)

Open **two terminal windows**:

**Terminal 1 — Backend:**
```bash
cd skillswap/backend
mvn spring-boot:run
# Running on http://localhost:8080
```

**Terminal 2 — Frontend:**
```bash
cd skillswap/frontend
npm run dev
# Running on http://localhost:3000
```

Then open **http://localhost:3000** in your browser.

### Environment Variables (Production)

For production deployments, set these environment variables instead of editing `application.properties`:

```bash
SPRING_DATA_MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/skillswap
APP_JWT_SECRET=your-256-bit-secret
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_ID=xxx
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_SECRET=xxx
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GITHUB_CLIENT_ID=xxx
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GITHUB_CLIENT_SECRET=xxx
APP_CORS_ALLOWEDORIGINS=https://yourdomain.com
```

---

## 9. API Reference {#api-reference}

Base URL: `http://localhost:8080/api`

All protected routes require the header:
```
Authorization: Bearer <jwt_token>
```

### Authentication
| Method | Endpoint                   | Auth | Description            |
|--------|----------------------------|------|------------------------|
| POST   | /auth/register             | ✗    | Register new user      |
| POST   | /auth/login                | ✗    | Login, returns JWT     |
| POST   | /auth/refresh              | ✗    | Refresh JWT token      |
| POST   | /auth/forgot-password      | ✗    | Request password reset |
| POST   | /auth/reset-password       | ✗    | Reset password         |

### Users
| Method | Endpoint                   | Auth | Description            |
|--------|----------------------------|------|------------------------|
| GET    | /users/me                  | ✓    | Get current user       |
| PUT    | /users/me                  | ✓    | Update profile         |
| POST   | /users/me/avatar           | ✓    | Upload avatar          |
| GET    | /users/me/dashboard        | ✓    | Dashboard stats        |
| GET    | /users/:id/profile         | ✗    | Get public profile     |

### Services
| Method | Endpoint                   | Auth | Description            |
|--------|----------------------------|------|------------------------|
| GET    | /services                  | ✗    | List all services      |
| GET    | /services/:id              | ✗    | Get service by ID      |
| GET    | /services/search?keyword=  | ✗    | Search services        |
| GET    | /services/category/:cat    | ✗    | Filter by category     |
| GET    | /services/my-services      | ✓    | My services            |
| POST   | /services                  | ✓    | Create service         |
| PUT    | /services/:id              | ✓    | Update service         |
| DELETE | /services/:id              | ✓    | Delete service         |

### Bookings
| Method | Endpoint                      | Auth | Description              |
|--------|-------------------------------|------|--------------------------|
| POST   | /bookings                     | ✓    | Create booking           |
| GET    | /bookings/my-bookings         | ✓    | Client's bookings        |
| GET    | /bookings/provider-bookings   | ✓    | Provider's bookings      |
| GET    | /bookings/:id                 | ✓    | Get booking details      |
| PATCH  | /bookings/:id/status          | ✓    | Update booking status    |

### Reviews
| Method | Endpoint                      | Auth | Description              |
|--------|-------------------------------|------|--------------------------|
| POST   | /reviews                      | ✓    | Submit review            |
| GET    | /reviews/service/:id          | ✗    | Service reviews          |
| POST   | /reviews/:id/respond          | ✓    | Provider response        |

### Messages
| Method | Endpoint                      | Auth | Description              |
|--------|-------------------------------|------|--------------------------|
| POST   | /messages/send                | ✓    | Send message             |
| GET    | /messages/conversation/:uid   | ✓    | Get conversation         |
| GET    | /messages/conversations       | ✓    | All conversations list   |

---

## 10. Feature Walkthrough {#features}

### User Registration & Login
- Navigate to `/register` to create an account with email/password
- Or click the **Google** or **GitHub** button for OAuth2 single sign-on
- After login, you're redirected to the Dashboard

### Browsing Services
- Visit `/services` to see all services
- Use the search bar to find services by keyword
- Filter by category using the pill buttons
- Sort by Newest, Top Rated, or Most Booked

### Booking a Service
1. Click any service card to view details
2. Select a date/time in the booking widget
3. Add optional notes about your requirements
4. Click **Book Now** (must be logged in)
5. Track status in **My Bookings**

### Posting a Service
1. Click **Post Service** in the navbar or dashboard
2. Fill in title, description, category, pricing
3. Add what's included, tags, and a thumbnail image URL
4. Click **Publish Service**
5. Your service is live immediately

### Booking Management
- **Client tab**: See bookings you've made; cancel pending ones; leave reviews after completion
- **Provider tab**: Accept or decline pending bookings; mark as complete; add meeting links

### Messaging
- Click **Message** on any booking card or provider profile
- Conversations are grouped in the Messages sidebar
- Real-time-style chat with read indicators

### Reviews
- After a booking is marked **Completed**, the client can leave a star rating and comment
- Providers can respond to reviews from the booking view

---

## 11. Troubleshooting {#troubleshooting}

### MongoDB connection refused
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start it if stopped
sudo systemctl start mongod
```

### Port already in use
```bash
# Kill process on port 8080 (backend)
lsof -ti:8080 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Maven build fails
```bash
# Clean Maven cache and rebuild
mvn clean install -DskipTests -U

# Check Java version — must be 21+
java -version
```

### Frontend can't reach backend
- Make sure the backend is running on port 8080
- Check `vite.config.js` proxy settings
- The proxy target should be `http://localhost:8080`

### OAuth2 redirect_uri_mismatch error
- Ensure the redirect URI in Google/GitHub console exactly matches:
  - Google: `http://localhost:8080/oauth2/callback/google`
  - GitHub: `http://localhost:8080/oauth2/callback/github`

### JWT token expired / 401 errors
- The token auto-refreshes using the refresh token stored in localStorage
- If you see persistent 401s, clear localStorage and log in again:
  ```javascript
  // In browser console
  localStorage.clear()
  ```

---

## Default Test Credentials

You can register any email/password combination. For quick testing:
```
Email:    test@skillswap.com
Password: password123
```

---

*SkillSwap v1.0.0 — Built with React + Spring Boot + MongoDB*
