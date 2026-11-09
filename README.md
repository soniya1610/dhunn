# Dhunn – Music Player 🎵

A modern mobile music player built with **React Native and Expo**. Dhunn provides a clean interface for discovering music, managing your library, creating playlists, and enjoying a personalized listening experience.

## ✨ Features

- **Authentication:** Login and signup screens.
- **Home:** Main music player dashboard.
- **Search:** Search interface for finding music.
- **Library:** Manage your personal music library.
- **Playlists:** Organize music into playlists.
- **Now Playing:** Dedicated music playback screen.
- **Mini Player:** Compact player component for quick access.
- **User Profile:** Profile screen.
- **Theme Support:** Theme management and customizable UI styling.
- **Reusable Components:** Modular components for track cards, artwork, and player controls.

## 🛠️ Tech Stack

- React Native
- Expo
- TypeScript
- Expo Router
- React Hooks and Context API
- JavaScript / TypeScript
- Git and GitHub

## 📁 Project Structure

```text
dhunn/
├── src/
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   ├── library.tsx
│   │   │   ├── profile.tsx
│   │   │   └── search.tsx
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── now-playing.tsx
│   │   └── playlist/
│   │       └── [id].tsx
│   ├── components/
│   ├── constants/
│   ├── context/
│   ├── hooks/
│   ├── services/
│   └── types/
├── assets/
├── app.json
├── package.json
├── package-lock.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- Expo Go or an Android emulator
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/soniya1610/dhunn.git
```

2. Navigate to the project directory:

```bash
cd dhunn
```

3. Install dependencies:

```bash
npm install
```

4. Start the Expo development server:

```bash
npx expo start
```

5. Run the app using Expo Go or an Android emulator.

## 📱 Android Build

To create an Android APK using EAS Build:

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

## 🔮 Future Improvements

- Enhanced music discovery and recommendations.
- Improved playlist management.
- Backend integration for music and user data.
- Better playback controls and listening experience.
- Additional personalization options.

## 👩‍💻 Developer

**Soniya Meena**

GitHub: [@soniya1610](https://github.com/soniya1610)

---

⭐ If you like this project, consider giving it a star!
