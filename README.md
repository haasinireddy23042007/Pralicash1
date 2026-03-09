# 🌱 PraliCash - AgriTech Marketplace

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**PraliCash** is a powerful AgriTech marketplace MVP designed to connect **Farmers** (supply) with **Industrial Buyers** (demand) for crop stubble. Our mission is to eliminate stubble burning—a major cause of air pollution—by transforming agricultural waste into a valuable commodity.

---

## 🚀 Key Features

### 🌾 For Farmers
- **Easy Listing**: Quick OTP login to list stubble acreage, estimated tonnage, and location.
- **Monetization**: Turn waste into profit by connecting directly with buyers.
- **Multilingual Support**: Fully translated interface in Hindi, Punjabi, and Telugu with voice assistance.
- **Transparent Tracking**: Real-time status updates on "Received Money" or "Unpaid Taken".

### 🏢 For Company Buyers
- **Demand Posting**: Specify tonnage requirements, price offers, and target locations.
- **Smart Dashboard**: Manage matches and streamline logistics for biomass collection.

### ⚙️ Under the Hood (The Engine)
- **Geospatial Clustering**: Uses Haversine distance algorithms to group nearby farmer listings into high-density "Clusters".
- **Optimization Engine**: Matches clusters to demands using a weighted scoring system that balances distance and price for maximum efficiency.

---

## 🛠️ Tech Stack

- **Frontend**: React 19 (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State**: React Context API (In-memory `INITIAL_DB` for MVP)
- **AI/Linguistic**: Google Cloud Translation & Text-to-Speech (via Node.js backend proxy)

---

## 📥 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)

### Installation
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/CharanMunur/PraliCash1.git
    cd PraliCash1
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run in development mode**:
    ```bash
    npm run dev
    ```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact
Built with ❤️ for a greener future. For inquiries, please reach out to the project maintainer.
