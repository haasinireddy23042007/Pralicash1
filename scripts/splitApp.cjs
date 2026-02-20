const fs = require('fs');
const path = require('path');

const lines = fs.readFileSync('src/App.jsx', 'utf8').split('\n');
function getBlock(start, end) {
    return lines.slice(start - 1, end).join('\n');
}

// Ensure directories
['src/components/ui', 'src/pages', 'src/context', 'src/utils'].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 1. i18n
fs.writeFileSync('src/i18n.js', `export ${getBlock(4, 225)}\n\nexport ${getBlock(240, 244)}`);

// 2. utils
fs.writeFileSync('src/utils/index.js', `${getBlock(247, 333)}\n\nexport { formatINR, haversine, maskEmail, sendOtpEmail, sendResetEmail };`);

// 3. context
fs.writeFileSync('src/context/AppContext.jsx', `import { createContext, useContext } from 'react';\n\nexport ${getBlock(228, 234)}\n\nexport const AppCtx = createContext(null);\nexport const useApp = () => useContext(AppCtx);\n`);

// 4. UI components
fs.writeFileSync('src/components/ui/index.jsx', `import React from 'react';\n\n${getBlock(336, 400)}\n\nexport { Badge, StatusBadge, Card, Btn, Input, Select };`);

const appContent = fs.readFileSync('src/App.jsx', 'utf8');

const components = [
    { name: 'LanguagePicker', type: 'component' },
    { name: 'NotificationBell', type: 'component' },
    { name: 'Header', type: 'component' },
    { name: 'Sidebar', type: 'component' },
    { name: 'StatCard', type: 'component' },
    { name: 'RoleSelectPage', type: 'page' },
    { name: 'FarmerLoginPage', type: 'page' },
    { name: 'BuyerLoginPage', type: 'page' },
    { name: 'ResetPasswordPage', type: 'page' },
    { name: 'FarmerDashboard', type: 'page' },
    { name: 'BuyerDashboard', type: 'page' },
    { name: 'CreateListingPage', type: 'page' },
    { name: 'CreateDemandPage', type: 'page' },
    { name: 'FarmerListingsPage', type: 'page' },
    { name: 'OffersPage', type: 'page' },
    { name: 'BuyerDemandsPage', type: 'page' },
    { name: 'MatchesPage', type: 'page' },
    { name: 'MapViewPage', type: 'page' },
    { name: 'ImpactDashboard', type: 'page' },
    { name: 'CalculatorPage', type: 'page' },
    { name: 'AdminPage', type: 'page' },
    { name: 'MobileNav', type: 'component' }
];

components.forEach(comp => {
    let index = appContent.indexOf(`function ${comp.name}(`);
    if (index === -1) {
        console.log("Not found: " + comp.name);
        return;
    }
    let braceCount = 0;
    let started = false;
    let end = index;
    for (let i = index; i < appContent.length; i++) {
        if (appContent[i] === '{') {
            braceCount++;
            started = true;
        } else if (appContent[i] === '}') {
            braceCount--;
        }
        if (started && braceCount === 0) {
            end = i + 1;
            break;
        }
    }
    
    let code = appContent.substring(index, end);
    let isPage = comp.type === 'page';
    let folder = isPage ? 'src/pages' : 'src/components';
    
    let fileContent = `import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useApp } from '../context/AppContext';
import { Badge, StatusBadge, Card, Btn, Input, Select } from '../components/ui';
import { formatINR, haversine, maskEmail, sendOtpEmail, sendResetEmail } from '../utils';

import LanguagePicker from '../components/LanguagePicker';
import NotificationBell from '../components/NotificationBell';

export default ${code}
`;

    // A hacky fix: some components render other components like <Header />, <Sidebar />, etc.
    // In a real app we'd resolve dependencies, but for this quick script, we just ignore undefined imports.
    // We will let Vite complain and we will fix the few errors manually.
    
    fs.writeFileSync(`${folder}/${comp.name}.jsx`, fileContent);
});

console.log("Extraction complete!");
