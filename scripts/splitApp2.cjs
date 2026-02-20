const fs = require('fs');
const path = require('path');

const sections = JSON.parse(fs.readFileSync('sections_content.json', 'utf8'));

// Ensure directories
['src/components/ui', 'src/pages', 'src/context', 'src/utils'].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function getSection(title) {
    const s = sections.find(x => x.t === title);
    return s ? s.c : '';
}

function cleanExports(content, componentName) {
    // Check if the component exists in the section
    if (content.includes(`function ${componentName}`)) {
        return content.replace(new RegExp(`function ${componentName}`), `export default function ${componentName}`);
    } else if (content.includes(`const ${componentName} =`)) {
        return content + `\nexport default ${componentName};\n`;
    }
    return content;
}

const UI_COMPONENTS = "import React from 'react';\n\n" + getSection("COMPONENTS") + "\nexport { Badge, StatusBadge, Card, Btn, Input, Select };\n";
fs.writeFileSync('src/components/ui/index.jsx', UI_COMPONENTS);

const I18N = "export " + getSection("TRANSLATION DICTIONARY").trim();
fs.writeFileSync('src/i18n.js', I18N);

const UTILS = getSection("UTILS") + "\nexport { formatINR, haversine, maskEmail, sendOtpEmail, sendResetEmail };\n";
fs.writeFileSync('src/utils/index.js', UTILS);

const CONTEXT = "import { createContext, useContext } from 'react';\n\nexport " + getSection("CONTEXT") + "\nexport const AppCtx = createContext(null);\nexport const useApp = () => useContext(AppCtx);\n";
fs.writeFileSync('src/context/AppContext.jsx', CONTEXT);


const baseImports = `import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useApp } from '../context/AppContext';
import { Badge, StatusBadge, Card, Btn, Input, Select } from '../components/ui';
import { formatINR, haversine, maskEmail, sendOtpEmail, sendResetEmail } from '../utils';
import { LANGUAGES, translations } from '../i18n';

// For simplicity in this automated script, we might import things that are not used, 
// but it's better than missing them. 
`;

function createComponent(title, fileName, outDir, customImports = '') {
    let content = getSection(title);
    if (!content) { console.log("Missing section: " + title); return; }
    
    // Auto-export the main function matching filename
    const componentName = fileName.replace('.jsx', '');
    content = cleanExports(content, componentName);

    // If it's the main App, handle differently (already handled below)
    
    fs.writeFileSync(path.join(outDir, fileName), baseImports + customImports + "\n" + content);
}

const customImportsMain = `
import LanguagePicker from '../components/LanguagePicker';
import NotificationBell from '../components/NotificationBell';
`;

const customImportsPages = `
import LanguagePicker from '../components/LanguagePicker';
import NotificationBell from '../components/NotificationBell';
`;


createComponent("LANGUAGE PICKER", "LanguagePicker.jsx", "src/components");
createComponent("NOTIFICATION BELL", "NotificationBell.jsx", "src/components");
createComponent("HEADER", "Header.jsx", "src/components", customImportsMain);
createComponent("ROLE SELECT PAGE", "RoleSelectPage.jsx", "src/pages");
createComponent("FARMER LOGIN", "FarmerLoginPage.jsx", "src/pages");
createComponent("BUYER LOGIN / SIGNUP", "BuyerLoginPage.jsx", "src/pages");
createComponent("RESET PASSWORD PAGE", "ResetPasswordPage.jsx", "src/pages");
createComponent("SIDEBAR NAV", "Sidebar.jsx", "src/components");
createComponent("STATS CARD", "StatCard.jsx", "src/components");
createComponent("FARMER DASHBOARD", "FarmerDashboard.jsx", "src/pages", "import StatCard from '../components/StatCard';\n");
createComponent("BUYER DASHBOARD", "BuyerDashboard.jsx", "src/pages", "import StatCard from '../components/StatCard';\n");
createComponent("CREATE LISTING", "CreateListingPage.jsx", "src/pages");
createComponent("CREATE DEMAND", "CreateDemandPage.jsx", "src/pages");
createComponent("FARMER LISTINGS PAGE", "FarmerListingsPage.jsx", "src/pages");
createComponent("OFFERS PAGE", "OffersPage.jsx", "src/pages");
createComponent("BUYER DEMANDS PAGE", "BuyerDemandsPage.jsx", "src/pages");
createComponent("MATCHES PAGE", "MatchesPage.jsx", "src/pages");
createComponent("MAP VIEW (SVG-based mock)", "MapViewPage.jsx", "src/pages");
createComponent("IMPACT DASHBOARD", "ImpactDashboard.jsx", "src/pages", "import StatCard from '../components/StatCard';\n");
createComponent("BURN VS SELL CALCULATOR", "CalculatorPage.jsx", "src/pages");
createComponent("ADMIN PAGE", "AdminPage.jsx", "src/pages", "import StatCard from '../components/StatCard';\n");
createComponent("MOBILE NAV", "MobileNav.jsx", "src/components");


const MAIN_APP = baseImports + `
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';

import RoleSelectPage from './pages/RoleSelectPage';
import FarmerLoginPage from './pages/FarmerLoginPage';
import BuyerLoginPage from './pages/BuyerLoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import CreateListingPage from './pages/CreateListingPage';
import CreateDemandPage from './pages/CreateDemandPage';
import FarmerListingsPage from './pages/FarmerListingsPage';
import OffersPage from './pages/OffersPage';
import BuyerDemandsPage from './pages/BuyerDemandsPage';
import MatchesPage from './pages/MatchesPage';
import MapViewPage from './pages/MapViewPage';
import ImpactDashboard from './pages/ImpactDashboard';
import CalculatorPage from './pages/CalculatorPage';
import AdminPage from './pages/AdminPage';
` + "\n" + cleanExports(getSection("MAIN APP"), "App");

fs.writeFileSync('src/App.jsx', MAIN_APP.replaceAll('../', './'));

console.log("Partitioning complete based on sections.json");
