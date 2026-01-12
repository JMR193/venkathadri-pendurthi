# Uttarandhra Tirumala (Uttandratirumala) - Temple Management System

An advanced, full-stack Temple Management System built for **Shri Venkateswara Swamy Temple, Pendurthi**, widely revered as **Uttarandhra Tirumala**. This application serves as a digital gateway for devotees to book darshan, make donations (E-Hundi), view the digital library, perform virtual Arathi, and access daily temple updates, while providing a robust CMS for temple administrators.

## 🚀 Technology Stack

- **Frontend Framework**: Angular v19+ (Standalone Components, Signals, Zoneless Change Detection).
- **Styling**: Tailwind CSS (Utility-first CSS).
- **Backend / Database**: 
  - **Firebase** (Realtime Firestore, Auth, Storage).
  - **Supabase** (PostgreSQL, Auth, Storage).
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
    *   Calendar-based slot selection with real-time capacity management.
    *   Form validation for pilgrim details.
    *   **Digital Ticket Generation**: Instant printable ticket with a QR code for entry verification.
*   **E-Hundi (Donations)**:
    *   Support for Online Payment Gateway simulation and Direct Bank Transfer/UPI.
    *   Instant digital receipt generation with transaction details.
*   **Digital Library**: Access to devotional audio tracks (MP3) and spiritual E-Books (PDF) with offline caching.
*   **Enhanced Gallery**: 
    *   Media gallery with an interactive lightbox for viewing high-res images.
    *   **Download** functionality for all images.
    *   Instructions for setting images as device wallpaper.
*   **History & Info**: Detailed temple timeline, architecture info, and visiting hours.
*   **Global Audio Player**: Persistent background chanting (*Om Namo Venkatesaya*) with toggle controls.

### 🛡️ For Administrators (CMS)
*   **Secure Authentication**: Email/Password login with simulated Two-Factor Authentication (2FA).
*   **Dashboard**: Real-time statistics and quick actions like "Festival Mode".
*   **Theme & Design Customizer**:
    *   Dynamically change the website's entire color scheme (primary, secondary, accent colors).
    *   Customize typography by selecting different Google Fonts for headings and body text.
    *   Changes are applied sitewide instantly.
*   **Content Management**:
    *   **Enhanced Announcements**: Post news with a title, rich content, featured image, and file attachments.
    *   **Gallery Management**: Upload images/videos directly to Cloud Storage or via URL.
    *   **Library Management**: Add/Remove audio and PDF resources.
*   **Site Configuration**: Dynamic control over Temple Name, Logos, Contact Info, Daily Panchangam image, and Bank QR codes.
*   **Donation Reports**: Filterable ledger of all transactions with CSV export.

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

3.  **Environment Configuration**:
    The app comes with a pre-configured `src/environments/environment.ts`. 
    
### 🗄️ Supabase Setup
To initialize the backend:
1.  Go to your Supabase Project Dashboard.
2.  Open the **SQL Editor**.
3.  Copy the contents of `supabase_schema.sql` from the project root.
4.  Run the query to create all required tables and policies.
5.  Create a storage bucket named `temple-assets` (Public) in the Storage section.

4.  **Run the application**:
    ```bash
    npm start
    ```
    Navigate to `http://localhost:4200/`.

## 📂 Project Structure

```
src/
├── app.component.ts         # Main layout, Global Audio, Header/Footer, Theme Engine
├── components/              # Feature-specific pages
│   ├── admin.component.ts   # CMS, Dashboard, Auth, Editors, Theme Customizer
│   ├── booking.component.ts # Slot selection, Ticket generation
│   ├── chat.component.ts    # Gemini AI Chatbot
│   ├── digital-darshan.ts   # Three.js 3D View with effects
│   ├── ehundi.component.ts  # Donation forms, Receipt generation
│   ├── gallery.component.ts # Media grid with Lightbox & Download
│   ├── history.component.ts # Static info pages
│   ├── home.component.ts    # Landing page, Panchangam widget, News display
│   └── ...
├── services/
│   └── temple.service.ts    # Supabase Client, Global State Signals (Config, Theme, Data)
└── environments/            # API Keys and Config
```

## 🔮 Future Upgrades

### 1. Payment Gateway Integration
*   Integrate **Razorpay** or **Stripe** API for real-time payment processing for bookings and donations.

### 2. WhatsApp API Automation
*   Automatically send Booking Tickets and Donation Receipts to the devotee's WhatsApp number.

### 3. Progressive Web App (PWA) Enhancements
*   Enable push notifications for temple events and festivals.

## 📄 License

This project is licensed under the MIT License.