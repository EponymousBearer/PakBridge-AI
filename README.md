# PakBridge AI: Pakistan Grid Emergency Intelligence & Agentic Dispatch Platform 🛰️⚡

PakBridge AI is a state-of-the-art, high-performance mobile emergency response and intelligence dispatch platform tailored specifically for Pakistan's national and sub-neighborhood infrastructures. Designed to bridge the critical gap between citizens, AI-agent analysis pipelines, and emergency response organizations (like NDMA, Rescue 1122, and regional fire brigades), the application provides real-time hazard detection, automated AI threat assessment, and geo-targeted safe evacuation routing.

---

## 🎨 Design System & Aesthetics (Premium "Cloud Live" UI)
The application adheres to a highly customized, premium visual design system, utilizing **vibrant dark modes, elegant gradients, glassmorphism, and smooth micro-animations** powered by `react-native-reanimated` and native Tailwind compilation.

*   **Color Palette**: Replaced standard flat colors with a curated high-contrast HSL theme (Deep Space Charcoal backgrounds, Neon Cyan accents `#00f1fe`, and Crimson Red indicators `#d71a18` for critical warnings).
*   **Typography**: Clean, professional layout with modern sans-serif hierarchies, making alert statistics immediately readable in high-stress scenarios.
*   **Micro-Animations**: Uses dynamic, spring-loaded entrance animations for list items, pulsing live radar sweep indicators, and high-framerate sliding notification banners.

---

## 🏗️ System Architecture

PakBridge AI is built on a highly decoupled, three-tier agentic architecture:

```mermaid
graph TD
    subgraph Client [Presentation & State Layer (React Native / Expo)]
        UI[Expo Router UI Views]
        Store[Zustand Stores: crisisStore, authStore]
        Banner[Notification Banner Component]
    end

    subgraph Intelligence [Cognitive Agent Layer]
        Gemini[Gemini 2.5 Flash Model]
        Parser[Geo-Intelligence Parser - AREA_MAP]
    end

    subgraph Backend [Data & Messaging Layer]
        Auth[Firebase Auth - AsyncStorage Persistence]
        DB[Firestore Real-time DB]
        Push[Expo Notifications Service]
    end

    UI --> Store
    Store <--> DB
    Store <--> Auth
    UI --> Banner
    
    UI -- 1. Submit Description --> Gemini
    Gemini -- 2. Structured JSON Assessment --> Store
    Parser -- 3. Sub-neighborhood Geo-Coords --> Store
    Store -- 4. Multi-Agent Pipeline --> UI
```

### 1. Data & Persistence Layer
*   **Firebase Firestore**: Serves as the primary real-time synchronization backend. Every reported incident, sensor telemetry feed, roadblock, and authority status is synced instantaneously across all clients using native `onSnapshot` subscriptions.
*   **Firebase Authentication (Session Persistence)**: Supports secure anonymous authentication. Integrates `@react-native-async-storage/async-storage` (v2) persistent storage into the firebase initialization flow to ensure user profiles are securely retained across device reboots and session restarts.

### 2. Cognitive & Agent Layer
*   **Gemini 2.5 Flash**: Leveraged via `@google/generative-ai` to perform zero-shot, real-time crisis analysis. Incoming emergency reports are processed by the generative AI model, returning structured JSON threat scores, action plans, and safety instructions in English, Urdu, and Roman Urdu.
*   **High-Precision Geo-Intelligence Parser (`AREA_MAP`)**: Maps natural language descriptions into exact coordinate pins across Karachi, Lahore, Islamabad, and other Pakistani sectors. Specific sub-neighborhoods (e.g. *Malir, Clifton, Korangi, Gulshan, Johar Town, Gulberg, Blue Area*) are recognized first and mapped to precise latitudes/longitudes, using random geographic offsets to prevent multiple overlapping marker pins.

### 3. State Orchestration Layer
*   **Zustand (Global Reactive Stores)**: 
    *   `authStore`: Manages registration profiles, user roles (Citizen vs. Authority), and persistent sessions.
    *   `crisisStore`: Handles Firestore synchronization, live incident tracking, active workflow pipelines, sensor feeds, roadblocks, and dispatched authorities.

---

## 🤖 Dynamic Multi-Agent Crisis Workflow

When an emergency is reported, PakBridge AI triggers an automated, modally encapsulated **Multi-Agent Pipeline** representing five specialized sub-agents working concurrently:

```
[ Citizen Report ] 
       │
       ▼
 [ Gemini Agent ] ────► Category, Severity, Multi-lingual Instruction set, & Base Action Plan
       │
       ▼
┌────────────────────────────────────────────────────────┐
│             MULTI-AGENT REACTION PIPELINE              │
├───────────────────┬───────────────────┬────────────────┤
│ 🛰️ Radar Scan     │ 🧠 Impact Score   │ 🚧 Path Router │
│ (Telemetry &      │ (Predicts damage  │ (Identifies    │
│ Drone feeds)      │ radii & sensors)  │ roadblocks)    │
├───────────────────┴───────────────────┴────────────────┤
│ 📢 Broadcast Agent (SMS & Local Network warning)      │
├────────────────────────────────────────────────────────┤
│ 🚒 Mobilizer Agent (Dispatches nearest Rescue 1122)    │
└────────────────────────────────────────────────────────┘
       │
       ▼
 [ Live Map Render ] ──► Real-Time Evacuation paths & Map Pins Active
```

1.  **🛰️ Telemetry Radar Scanning Agent**: Aggregates local CCTV, drone feeds, and localized sensor networks (such as river level gauges in Swat or local heat nodes).
2.  **🧠 Impact Score Calculation Agent**: Evaluates the potential damage radius and estimates the number of affected nearby cellular devices.
3.  **🚧 Evacuation & Path Routing Agent**: Dynamically computes optimal evacuation paths and identifies roadblocks (such as structural overflows or building collapses).
4.  **📢 Broadcast Broadcast Agent**: Simulates immediate SMS alerts and local cellular tower broadcasts to devices within the calculated danger radius.
5.  **🚒 Emergency Mobilizer Agent**: Pairs the incident with the nearest emergency rescue service (police, municipal fire brigade, or Rescue 1122) and dispatches them with precise contact and routing telemetry.

---

## 🔌 API Integration Details

### Real-world APIs
*   **Google Gemini API**: Utilizes `gemini-2.5-flash` via the `@google/generative-ai` SDK to ingest raw civilian reports and formulate critical priorities, evacuation blueprints, and multi-lingual translations.
*   **Firebase SDK suite**: Employs Firestore real-time queries and Firebase Auth with persistent session engines.
*   **Expo Notifications Service**: Triggers system-level local push notifications. Automatically bypasses remote APNS/FCM registrations when running in simulator sandboxes or Expo Go environments to prevent crash triggers.

### Fallbacks & Offline Capabilities
*   **Robust Offline Fail-safes**: If internet connectivity is lost or API quotas/restrictions are exceeded, `geminiService` intercepts the error and seamlessly routes the incident through local regex-based semantic fallback algorithms, ensuring full operational capabilities even in remote disaster zones.
*   **Silent Error Interceptors**: Supresses noisy error stack traces in the terminal console by converting blocked or unavailable API keys into clean, actionable warning indicators.

---

## 📡 Live Proximity & Neighborhood Alert System

The in-app **Notification Banner** monitors active Firestore incident updates and cross-references them with the logged-in user's profile:
*   **Proximity Calculations**: Evaluates the mathematical distance between coordinates.
*   **Specific Sub-Neighborhood Recognition**: If both the user's home/office neighborhood (from profile settings) and the active report match a specific keyword (e.g. *Malir*), a dynamic, hyper-localized, system-level notification is pushed to the client immediately:
    > `"⚠️ [Category] is happening near you in [Neighborhood], be alert!"`
*   **Auto-Dismiss Timers**: Features an integrated layout dismiss scheduler that gracefully slides the banner out of view after **6 seconds** to keep screen real estate clean.

---

## 🛠️ Setup & Local Development

### 1. Requirements
*   Node.js (v18+)
*   Expo Go app on Android/iOS (or emulator setup)

### 2. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 3. Environment Variables (`.env`)
Create a `.env` file in your root folder with the following variables:
```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
EXPO_PUBLIC_GEMINI_API_KEY=your_unrestricted_gemini_api_key

EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

### 4. Running the App
Since Expo caches environment variables, start the development server clearing all caches:
```bash
npx expo start -c
```
Press **`a`** to open in Android Emulator, or scan the QR code using your **Expo Go** app on your physical device.

---

## 📦 Exporting as a Standalone APK (`.apk`)

This project has been pre-configured with **EAS Build** profiles for Android standalone builds:

1.  Install the EAS CLI globally:
    ```bash
    npm install -g eas-cli
    ```
2.  Log in to your Expo account:
    ```bash
    eas login
    ```
3.  Trigger the standalone APK compile command:
    ```bash
    eas build --platform android --profile preview
    ```
Once compiled, download the direct APK on your phone via the terminal-generated QR code or download link!
