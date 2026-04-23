import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import '@fontsource/nunito/latin-500.css';
import '@fontsource/nunito/latin-700.css';
import '@fontsource/nunito/latin-900.css';
import '@fontsource/zen-maru-gothic/latin-500.css';
import '@fontsource/zen-maru-gothic/latin-700.css';
import '@fontsource/zen-maru-gothic/latin-900.css';
import '@fontsource/zen-maru-gothic/japanese-500.css';
import '@fontsource/zen-maru-gothic/japanese-700.css';
import '@fontsource/zen-maru-gothic/japanese-900.css';
import '@fontsource/m-plus-rounded-1c/latin-500.css';
import '@fontsource/m-plus-rounded-1c/latin-700.css';
import '@fontsource/m-plus-rounded-1c/latin-900.css';
import '@fontsource/m-plus-rounded-1c/japanese-500.css';
import '@fontsource/m-plus-rounded-1c/japanese-700.css';
import '@fontsource/m-plus-rounded-1c/japanese-900.css';

document.body.style.margin = '0';

const globalStyle = document.createElement('style');
globalStyle.textContent = `
  *::-webkit-scrollbar { display: none; }
`;
document.head.appendChild(globalStyle);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
