# 🕌 Islamic Report Management System

A full-stack web app for tracking daily Islamic activities and generating monthly reports. Built with MERN stack (MongoDB, Express, React, Node.js) and Tailwind CSS.

## ✨ Features

- **Daily Tracking**: Namaz, Hifz, Nazra, Tafseer, Hadees + outreach metrics
- **Monthly Reports**: Visual progress tracking and statistics
- **Q&A System**: 28 monthly reflection questions
- **PDF Generation**: Professional reports for submission
- **Mobile Responsive**: Works on all devices
- **JWT Authentication**: Secure user management

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)
- npm

### Installation

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd islamic-report-app
   
   # Backend
   cd backend && npm install
   
   # Frontend  
   cd ../frontend && npm install
   ```

2. **Environment Setup**

   **Backend (.env):**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/islamic-reports
   JWT_SECRET=your-secret-key
   ```

   **Frontend (.env):**
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

3. **Run Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm start
   ```

4. **Access App**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 📖 Usage

1. **Register/Login** → Create account
2. **Daily Report** → Track daily activities
3. **Monthly View** → See progress overview
4. **Q&A** → Answer monthly questions
5. **Download PDF** → Generate report for submission

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Auth**: JWT with bcryptjs
- **PDF**: PDFKit for report generation

## 🚀 Deployment

### Render (Recommended)
1. Push to GitHub
2. Connect repository to Render
3. Set environment variables
4. Deploy automatically

### Environment Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/islamic-reports
JWT_SECRET=your-production-secret
REACT_APP_API_URL=https://your-backend-url.com
```

## 🧪 Testing

```bash
# Backend tests
cd backend && node test-app.js

# Frontend tests  
cd frontend && npm test
```

## 🔧 Common Issues

- **MongoDB Connection**: Check URI and credentials
- **JWT Errors**: Verify JWT_SECRET is set
- **CORS Issues**: Update CORS config in server.js
- **PDF Generation**: Ensure PDFKit is installed

## 📞 Support

- Check backend README for detailed API docs
- Review server logs for errors
- Test locally before reporting issues

---

**Built with ❤️ for the Islamic community**

*"Verily, Allah loves those who are consistent in their actions." - Prophet Muhammad (ﷺ)* 