# 🎵 Dhunn – Your Music, Your Mood

<p align="center">
  <strong>A modern music player built with React Native and Expo.</strong><br/>
  Discover music, explore songs, manage your playlists and enjoy a personalized listening experience.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.88.1-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Expo-SDK%2058-000020?logo=expo" />
  <img src="https://img.shields.io/badge/TypeScript-6.0.3-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Platform-Android-green?logo=android" />
</p>

## 📱 Download APK

Try the latest Android version of Dhunn:

**[⬇️ Download Dhunn APK](https://expo.dev/artifacts/eas/955LdLG11CgGFOoISMUzZNmG11T0sNn2KBUJiIdWHkg.apk)**

> Download the APK, install it on your Android device and start listening.

---

## ✨ Features

- 🎧 **Music Discovery** – Explore and discover songs.
- 🔍 **Smart Search** – Search for tracks and explore music categories.
- ▶️ **Music Player** – Play, pause, skip and control playback.
- ❤️ **Liked Songs** – Save your favourite tracks.
- 📂 **Playlist Management** – Create, manage and organize playlists.
- 🌙 **Dark & Light Mode** – Switch between beautiful themes.
- 👤 **User Profile** – Manage your profile and view listening statistics.
- 🔐 **Authentication** – Login, signup and password reset screens.
- 🎨 **Modern UI** – Premium purple and lavender-inspired interface.

## 🖼️ App Screenshots

### 🔐 Authentication

<p align="center">
  <img src="screenshots/auth.jpeg" width="200" height="390" alt="Dhunn Login and Signup" />
</p>

### 🏠 Home Experience

<p align="center">
  <img src="screenshots/home-light.jpeg" width="200" height="390" alt="Home Light Mode" />
  <img src="screenshots/home-dark.jpeg" width="200" height="390" alt="Home Dark Mode" />
  <img src="screenshots/home-scroll.jpeg" width="200" height="390" alt="Home Scroll View" />
</p>

### 🔍 Music Discovery

<p align="center">
  <img src="screenshots/search-categories.jpeg" width="200" height="390" alt="Search Categories" />
  <img src="screenshots/search-results.jpeg" width="200" height="390" alt="Search Results" />
</p>

### ❤️ Your Library

<p align="center">
  <img src="screenshots/library.jpeg" width="200" height="390" alt="Dhunn Library" />
</p>

### 👤 User Profile

<p align="center">
  <img src="screenshots/profile.jpeg" width="200" height="390" alt="Dhunn Profile" />
</p>

---

## 🛠️ Tech Stack

| Technology        | Purpose                        |
| ----------------- | ------------------------------ |
| React Native      | Mobile application development |
| Expo              | Development and build platform |
| TypeScript        | Type-safe development          |
| Expo Router       | File-based navigation          |
| React Context API | Global state management        |
| AsyncStorage      | Local data persistence         |
| Ionicons          | Application icons              |
| Expo Image Picker | Profile photo selection        |

## 📁 Project Structure

```text
dhunn/
├── assets/
│   └── images/
├── screenshots/
├── src/
│   ├── app/
│   │   ├── (tabs)/
│   │   ├── playlist/
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── forgot-password.tsx
│   │   └── now-playing.tsx
│   ├── components/
│   ├── constants/
│   ├── context/
│   ├── hooks/
│   ├── services/
│   └── types/
├── app.json
├── eas.json
├── package.json
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/soniya1610/dhunn.git
```

### 2. Navigate to the project

```bash
cd dhunn
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the Expo development server

```bash
npx expo start
```

Follow the Expo CLI instructions to run the app on your device or emulator.

## 🏗️ Build APK

To generate an Android APK using EAS Build:

```bash
eas build -p android --profile preview
```

## 👩‍💻 Developer

**Soniya Meena**

- GitHub: [@soniya1610](https://github.com/soniya1610)
- Project: [Dhunn](https://github.com/soniya1610/dhunn)

---

<p align="center">
  Made with ❤️ and 🎵
  <br/>
  <strong>Dhunn – Feel Every Beat.</strong>
</p>
