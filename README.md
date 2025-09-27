# 🎬 FletNix - Netflix Clone

A full-stack Netflix clone built with Angular, Node.js, and MongoDB. Features user authentication, content browsing, advanced search and filtering, responsive design, and comprehensive testing.

![FletNix Preview](https://img.shields.io/badge/Status-Complete-success)
![Tech Stack](https://img.shields.io/badge/Tech-Angular%20%7C%20Node.js%20%7C%20MongoDB-blue)
![Testing](https://img.shields.io/badge/Testing-Jest%20%7C%20Playwright-green)

## ✨ Features

### 🔐 Authentication
- User registration and login with JWT
- Secure password hashing with bcryptjs
- Age-based content restrictions
- Persistent sessions with localStorage

### 🎭 Content Management
- **8,807+ Netflix titles** imported from CSV
- Advanced search (title, cast, description)
- Multi-filter system (type, genre)
- Pagination (15 items per page)
- Content details with full information

### 📱 User Experience
- **Responsive design** - Mobile, tablet, desktop
- Netflix-style UI with gradients and animations
- Touch-friendly interface
- Loading states and error handling
- Beautiful hover effects and transitions

### 🧪 Quality Assurance
- **Unit tests** with Jasmine/Karma
- **E2E tests** with Playwright
- **Good code coverage**
- Production-ready error handling

## 🛠️ Tech Stack

### Frontend
- **Angular 15+** with TypeScript
- **Tailwind CSS** for styling
- **FontAwesome** icons
- **RxJS** for reactive programming
- **Angular Router** with guards

### Backend
- **Node.js** with Express.js
- **MongoDB Atlas** cloud database
- **JWT** authentication
- **bcryptjs** password hashing
- **CORS** enabled

### Testing
- **Jasmine/Karma** for unit testing
- **Playwright** for E2E testing
- **Chrome/Firefox** browser testing

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/meCeltic/fletnix-netflix-clone.git
   cd fletnix-netflix-clone
   ```

2. **Backend Setup**
   ```bash
   cd fletnix-backend
   npm install
   ```
   
   Create `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ```
   
   Import Netflix data:
   ```bash
   node scripts/importNetflixData.js
   ```
   
   Start backend:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../fletnix-frontend
   npm install
   ```
   
   Start frontend:
   ```bash
   ng serve
   ```

4. **Access the app**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:5000

## 📊 Project Structure

fletnix-netflix-clone/
├── fletnix-backend/ # Node.js Express API
│ ├── models/ # MongoDB models
│ ├── routes/ # API routes
│ ├── middleware/ # Custom middleware
│ ├── scripts/ # Data import scripts
│ └── server.js # Main server file
├── fletnix-frontend/ # Angular application
│ ├── src/app/
│ │ ├── components/ # Angular components
│ │ ├── services/ # Angular services
│ │ ├── guards/ # Route guards
│ │ └── interceptors/ # HTTP interceptors
│ └── tests/ # E2E tests
└── README.md

## 🎯 Key Features Demo

### Authentication Flow
- Register with name, email, password, and age
- Login with email and password
- JWT token storage and validation
- Protected routes with auth guards

### Content Browsing
- Browse 8,807+ Netflix titles
- Search across title, cast, and description
- Filter by type (Movies/TV Shows)
- Filter by 50+ genres
- Age-appropriate content filtering

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly controls
- Smooth animations and transitions

## 🧪 Testing

### Run Unit Tests
```bash
cd fletnix-frontend
npm test
```

### Run E2E Tests
```bash
npm run e2e
```

### View Coverage Report
```bash
npm run test:coverage
```

## 📈 Performance

- **Pagination**: Efficient loading of 15 items per page
- **Search**: Fast text-based search with MongoDB indexing
- **Responsive**: Optimized for mobile and desktop
- **Caching**: JWT token persistence and user data caching

## 🎨 UI/UX Highlights

- Netflix-inspired color scheme (#E50914)
- Gradient backgrounds and hover effects
- FontAwesome icons throughout
- Smooth page transitions
- Loading states and error handling
- Mobile-optimized touch targets

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- Age-based content filtering
- Input validation and sanitization
- CORS configuration

## 🚀 Deployment Ready

- Environment variable configuration
- Production build optimizations
- Error handling and logging
- MongoDB Atlas cloud database
- Scalable architecture

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Content Endpoints
- `GET /api/content` - Get paginated content
- `GET /api/content/:id` - Get content details
- `GET /api/content/genres` - Get all genres

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ankit Singh**
- GitHub: [@meCeltic](https://github.com/meCeltic)
- Email: ankit.singh.work2024@gmail.com

## 🎯 Assignment Achievement

**Benchmarks**

✅ Authentication  
✅ Backend Development
✅ Frontend Development
✅ Paginated List
✅ Search Functionality
✅ Age Restriction
✅ Type Filtering
✅ Detail Pages
✅ Testing Suite 

---

⭐ **Star this repo if you found it helpful!**