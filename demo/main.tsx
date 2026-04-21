import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

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
