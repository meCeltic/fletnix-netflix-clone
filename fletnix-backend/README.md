# FletNix Backend API

🎬 Backend service for FletNix - A Netflix content discovery application.

## 🚀 Features

- **User Authentication**: JWT-based auth with email, password, and age
- **Content Management**: Paginated content display (15 items per page)
- **Advanced Search**: Search by title, cast members, and description
- **Smart Filtering**: Filter by content type (Movies vs TV Shows)
- **Age Restrictions**: Automatic R-rated content filtering for users under 18
- **Security**: CORS, rate limiting, helmet protection, and password hashing
- **MongoDB Integration**: Cloud-based database with Atlas

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT + bcryptjs
- **Security**: Helmet, CORS, Rate Limiting

## ⚡ Quick Start

### 1. Environment Setup
Create `.env` file:
