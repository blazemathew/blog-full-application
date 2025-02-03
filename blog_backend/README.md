# Full Stack Blog Application

A modern blog application built with Angular frontend and NestJS backend, featuring social authentication, blog post management, and secure API endpoints.

## 🏗️ Architecture

### Frontend
- Angular 17+
- Social Authentication (Google & Facebook)
- JWT-based authentication with auto-refresh
- Responsive design with SCSS
- Protected routes

### Backend
- NestJS
- MySQL with TypeORM
- JWT Authentication
- Social OAuth (Google & Facebook)
- Rate limiting
- Security middleware

## 🚀 Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- MySQL (v8 recommended)
- Angular CLI (v17 or higher)

## 📦 Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd blog-backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the following variables:
     ```
     DATABASE_HOST=localhost
     DATABASE_PORT=3306
     DATABASE_USERNAME=your_username
     DATABASE_PASSWORD=your_password
     DATABASE_NAME=blog_db

     JWT_SECRET=your_jwt_secret
     JWT_EXPIRATION=1h
     JWT_REFRESH_SECRET=your_refresh_token_secret
     JWT_REFRESH_EXPIRATION=7d

     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

     FACEBOOK_APP_ID=your_facebook_app_id
     FACEBOOK_APP_SECRET=your_facebook_app_secret
     FACEBOOK_CALLBACK_URL=http://localhost:3000/auth/facebook/callback

     FRONTEND_URL=http://localhost:4200
     ```

4. Start the backend server:
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd blog-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
   - Update `src/environments/environment.ts` with your backend URL and other configurations

4. Start the frontend application:
```bash
ng serve
```

## 🔒 Security Features

- JWT Authentication with refresh tokens
- Rate limiting
- CORS protection
- Helmet security headers
- Request validation
- SQL injection protection through TypeORM
- XSS protection

## 📁 Project Structure

### Backend Structure
```
src/
├── auth/
│   ├── strategies/
│   └── auth.module.ts
├── controllers/
│   ├── auth.controller.ts
│   └── post.controller.ts
├── entities/
│   ├── user.entity.ts
│   └── post.entity.ts
├── services/
│   ├── auth.service.ts
│   └── post.service.ts
├── guards/
├── filters/
├── interceptors/
└── main.ts
```

### Frontend Structure
```
src/
├── app/
│   ├── components/
│   │   ├── auth-callback/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── post-detail/
│   │   └── post-list/
│   ├── core/
│   │   ├── guards/
│   │   ├── interfaces/
│   │   └── services/
│   └── shared/
└── environments/
```

## 🛠️ API Endpoints

### Authentication
- `GET /auth/google` - Google authentication
- `GET /auth/facebook` - Facebook authentication
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user

### Posts
- `GET /posts` - Get all posts
- `GET /posts/:id` - Get specific post
- `POST /posts` - Create new post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post

## 🧪 Testing

### Backend Tests
```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e
```

### Frontend Tests
```bash
# Unit tests
ng test

# e2e tests
ng e2e
```

## 🚀 Deployment

### Backend
1. Set up your production database
2. Update environment variables for production
3. Build the application:
```bash
npm run build
```
4. Start the production server:
```bash
npm run start:prod
```

### Frontend
1. Update environment.prod.ts with production URLs
2. Build for production:
```bash
ng build --configuration=production
```
3. Deploy the contents of the `dist` folder to your web server

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE.md file for details.