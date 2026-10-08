# SocialSphere - Modern Social Networking Platform

A modern, high-performance social networking web application crafted with React 19, Vite, and custom Glassmorphism aesthetics.

## ✨ Features

### 1. Feed & Posts
- **Interactive Feed:** Publish updates with image attachments, rich typography, and instant timestamps.
- **Micro-Interactions:** Like and comment on posts with responsive animated feedback.
- **Clean Card Views:** Glassmorphic translucent cards with delicate blur filters and fluid transitions.

### 2. Search & People Discovery (`/search`)
- **Find People:** Search creators by name or `@username`.
- **Debounced Search:** ~300ms input debounce for optimized responsiveness.
- **Instant Follow Action:** Direct Follow/Following toggle buttons right from search results.
- **Profile Navigation:** One-tap navigation directly to user profiles.
- **Empty States:** Friendly empty states for query misses and suggested users.

### 3. Followers & Following System (Popup Modal)
- **Modal Dialogue:** Accessible by tapping follower or following stats on profiles.
- **Tabbed Views:** Separate Followers and Following tabs with real-time counts.
- **Interactive Rows:** View user avatars, handles, and toggle follow/unfollow status.
- **Zero-State Handling:** Contextual feedback when lists are empty.

### 4. Real-Time Chat & Direct Messaging (`/messages`)
- **Split-Screen Layout:** Conversations sidebar with search preview, last message snippets, and timestamps.
- **Responsive Mobile Experience:** List-first navigation on small screens with smooth drawer transition to active chats.
- **Real-Time Integration:** Socket.IO architecture for instant bidirectional communication with fallback simulation.
- **Auto-Scroll Stream:** Automatic scroll anchoring to the newest incoming message bubble.
- **Direct Profile Messaging:** Start a chat directly from any user profile.
- **Unread Badges:** Unread message indicators on conversation threads and navbar badge counters.

### 5. Notifications Hub (`/notifications`)
- **Chronological Feed:** Newest-first notifications for likes, comments, and new followers.
- **Visual Categorization:** Color-coded badges for like hearts, comment bubbles, and follow pluses.
- **Unread Status:** Prominently highlighted cards and unread dot indicators.
- **Navigation Shortcuts:** Click any notification to navigate directly to the relevant post or profile.
- **Mark All Read:** Single-click bulk mark-as-read action.
- **Navbar Bell Badge:** Dynamic counter indicating unread alerts.

### 6. User Profiles & Customization (`/profile`, `/user/:id`, `/edit-profile`)
- **My Profile & User Profiles:** View bio, published posts, follow metrics, and mutual actions.
- **Profile Customizer:** Update display name, handle, avatar URL with live preview, and biography.

### 7. Settings & Account Security (`/settings`)
- **Change Password:** Validate current credentials and update to new passwords with safety checks.
- **Session Control:** Secure logout action and demo switch.
- **Danger Zone / Account Deletion:** Permanent account removal with mandatory "DELETE" typing confirmation popup.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 19
- **Bundler & Dev Server:** Vite
- **Routing:** React Router DOM v7
- **Icons:** Lucide React
- **Notifications & Toasts:** React Hot Toast
- **Date Formatting:** date-fns
- **Real-Time Communications:** Socket.IO Client
- **Styling:** Custom CSS Glassmorphism with HSL color variables & backdrop filters

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone git@github.com:shreya-kiran/Social-Networking-Website.git

# Navigate to the project directory
cd Social-Networking-Website

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

### Production Build

```bash
# Create optimized production bundle
npm run build

# Preview production build locally
npm run preview
```
