# Uttarandhra Tirumala (Uttandratirumala) - Temple Management System

An advanced, frontend-only demonstration of a Temple Management System built for **Shri Venkateswara Swamy Temple, Pendurthi**, widely revered as **Uttarandhra Tirumala**. This application serves as a digital gateway for devotees to book darshan, make donations (E-Hundi), view the digital library, perform virtual Arathi, and access daily temple updates.

## 🚀 Technology Stack

- **Frontend Framework**: Angular v19+ (Standalone Components, Signals, Zoneless Change Detection).
- **Styling**: Tailwind CSS (Utility-first CSS).
- **Backend / Database**: 
  - **None**. This is a frontend-only demonstration. All data is hardcoded in the Angular service.
- **AI & 3D**: 
  - **Google Gemini API** (Digital Sahayak AI Chatbot).
  - **Three.js** (3D Digital Darshan with interactive animations).
- **Visualization**: D3.js (Admin Dashboard Charts).
- **Icons**: Heroicons (SVG).
- **Routing**: Angular Router (Hash Location Strategy).

## ✨ Features

### 🕉️ For Devotees (Public Interface)
*   **Hero Dashboard**: Immersive landing page with a scrolling news ticker, daily Panchangam (Almanac), and official media links.
*   **3D Digital Darshan**: 
    *   Interactive 3D idol of the deity with subtle, continuous flower petal effects.
    *   Perform virtual **Harathi** and **Pushpanjali** (Flower Rain).
    *   Adjustable camera angles (Netra Darshanam, Pada Darshanam).
*   **AI Digital Sahayak**: 
    *   Conversational AI assistant powered by **Gemini 2.5 Flash**.
    *   Answers queries about timings, history, and booking procedures in natural language.
*   **Special Entry Darshan Booking**:
    *   Simulated calendar-based slot selection with mock availability.
    *   Form validation for pilgrim details.
    *   **Digital Ticket Generation**: Instant printable ticket for entry verification.
*   **E-Hundi (Donations)**:
    *   Support for Online Payment Gateway simulation and Direct Bank Transfer/UPI.
    *   Instant digital receipt generation with transaction details.
*   **Digital Library**: Access to devotional audio tracks (MP3) and spiritual E-Books (PDF) with offline caching.
*   **Enhanced Gallery**: 
    *   Media gallery with an interactive lightbox for viewing high-res images.
*   **History & Info**: Detailed temple timeline, architecture info, and visiting hours.
*   **Global Audio Player**: Persistent background chanting (*Om Namo Venkatesaya*) with toggle controls.

### 🛡️ For Administrators (CMS)
*   **Disabled**: The Admin Portal is a placeholder in this version, as it requires a backend to function.

## 🛠️ Setup & Installation

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

### Installation
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/uttandratirumala.git
    cd uttandratirumala
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the application**:
    ```bash
    npm start
    ```
    Navigate to `http://localhost:4200/`.

## 📂 Project Structure

```
src/
├── app.component.ts         # Main layout, Global Audio, Header/Footer
├── components/              # Feature-specific pages
│   ├── admin.component.ts   # Placeholder for CMS
│   ├── booking.component.ts # Slot selection, Ticket generation
│   ├── chat.component.ts    # Gemini AI Chatbot
│   ├── digital-darshan.ts   # Three.js 3D View with effects
│   ├── ehundi.component.ts  # Donation forms, Receipt generation
│   └── ...
├── services/
│   └── temple.service.ts    # Global State Signals with hardcoded data
└── environments/            # Environment config (no backend keys)
```

## 🔮 Future Upgrades

### 1. Backend Integration
*   Connect the application to a backend service like **Firebase** or **Supabase** to enable persistent data, user authentication, and real-time updates.

### 2. Payment Gateway Integration
*   Integrate **Razorpay** or **Stripe** API for real-time payment processing for bookings and donations.

### 3. Progressive Web App (PWA) Enhancements
*   Enable push notifications for temple events and festivals.

## 📄 License

This project is licensed under the MIT License.
