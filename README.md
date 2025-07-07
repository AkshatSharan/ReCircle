# 🔄 ReCircle

**A gamified sustainability platform promoting circular economy through item reuse and recycling**

*Built for Walmart Sparkathon Hackathon*

## 🌟 Overview

ReCircle is a comprehensive sustainability platform that gamifies the circular economy by connecting users who want to share reusable items. Through an intuitive swipe-based interface, users can discover, share, and exchange items while earning points and achievements for their eco-friendly actions.

## ✨ Key Features

### 🔐 Authentication & Onboarding
- **Secure Login/Registration** via Firebase Authentication
- **Automatic Profile Creation** with welcome bonus (+30 points)
- **Token-based Middleware** for secure backend access
- **Achievement System** starts immediately with welcome badge

### 🏠 Interactive Dashboard
- **Green Score Display** based on accumulated points
- **User Ranking System** showing position among all users
- **Recent Achievements** showcase with visual badges
- **Activity Feed** tracking shared and liked items
- **Real-time Notifications** for item interactions

### ⚡ Quick Actions Panel
Four main action paths from dashboard:
- **Add Item** - Upload reusable items with photos
- **Scan Item** - Future feature for recyclability checking
- **Find Centers** - Map view of nearby recycling/donation locations
- **SwipeCycle** - Browse and interact with community items

### 🔁 SwipeCycle Interface
- **Tinder-style Swiping** for item discovery
- **Smart Filtering** (excludes user's own items)
- **Instant Reactions**:
  - Swipe Right → Like item (+10 points + achievement)
  - Swipe Left → Skip (no data saved)
- **Real-time Notifications** to item owners

### 🔔 Comprehensive Notification System
- **Like Notifications** sent to item owners
- **Dashboard Integration** with notification panel
- **Future Enhancement** for match approval and item exchange

### 🏅 Gamification & Ranking
**Point System:**
- Sign up: +30 points
- Add item: +10 points
- Item interactions: +10 points

**Features:**
- **Dynamic Leaderboard** with real-time rankings
- **Achievement Badges** for milestones
- **Eco-Rank Calculation** based on contributions

### 📤 Seamless Item Upload
- **Multi-field Form** (name, description, image)
- **Cloudinary Integration** for image storage
- **MongoDB Storage** with user linking
- **Instant Rewards** (+10 points + contribution badge)

### 🌍 Find Centers Map
- **Interactive Map Interface** showing recycling/donation locations
- **Location Pins** for easy navigation
- **Extensible Design** for API integration

## 🛠️ Tech Stack

### Frontend
- **React** with Vite for fast development
- **Firebase Authentication** for secure user management
- **Responsive Design** for mobile-first experience

### Backend
- **Node.js/Express** RESTful API
- **MongoDB** with Mongoose ODM
- **JWT Middleware** for authentication
- **Cloudinary** for image management

### External Services
- **Firebase Auth** - User authentication
- **MongoDB Atlas** - Cloud database
- **Cloudinary** - Image storage and optimization
- **OpenRouter API** - AI integration capabilities

## 🏗️ Architecture

### Database Models
- **Users**: UID, points, achievements, activity history
- **Items**: Product details, owner references, like counts
- **Notifications**: User interactions and system events
- **Achievements**: Milestone tracking and badge system


## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Firebase project
- Cloudinary account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/user/repo.git
```

2. **Install dependencies**

For the client:
```bash
cd client
npm install
```

For the server:
```bash
cd server
npm install
```

3. **Environment Configuration**

Create `.env` file in the client directory:
```bash
VITE_BACKEND_URL=http://localhost:5000/api
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```

Create `.env` file in the server directory:
```bash
MONGO_URI=your_mongodb_connection_string
PORT=5000
OPENAI_API_KEY=your_openai_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. **Start the development servers**

Start the backend server:
```bash
cd server
npm run dev
```

Start the frontend development server:
```bash
cd client
npm run dev
```

## 🎮 User Journey

1. **Onboarding**: User registers/logs in via Firebase Auth
2. **Profile Creation**: Backend automatically creates user profile with welcome rewards
3. **Dashboard Exploration**: User views their green score, rank, and recent activities
4. **Item Discovery**: User navigates to SwipeCycle to browse available items
5. **Engagement**: User swipes right on items of interest, earning points and sending notifications
6. **Contribution**: User uploads their own items, earning additional points and achievements
7. **Community Interaction**: User checks leaderboard and competes with other eco-warriors
8. **Sustainability Action**: User finds nearby recycling centers via the map feature

## 🏆 Hackathon Context

This project was developed for the **Walmart Sparkathon Hackathon**, focusing on innovative solutions for sustainability and circular economy. Recircle addresses the challenge of reducing waste through community-driven item reuse, gamification, and environmental awareness.

## 🔮 Future Enhancements

- **Item Exchange System**: Enable direct item swapping between users
- **AI-Powered Recommendations**: Suggest items based on user preferences
- **Carbon Footprint Tracking**: Calculate environmental impact of reuse activities
- **Social Features**: Add friend systems and group challenges
- **Mobile App**: Native iOS and Android applications
- **Blockchain Integration**: NFT-based achievement system

*Built with 💚 for a sustainable future*
