// 1. IMPORTY (wszystkie na samej górze, bez duplikatów)
import { initAuthStateListener, handleLogin, resetPassword } from './auth.js';
import { showTab } from './ui.js';
import { initDziennikListener } from './dziennik.js';
import { initAwarieListener } from './awarie.js';
import { initDashboard } from './dashboard.js';
import { initZmianyUI } from './zmiany.js';
import { downloadShiftPDF } from './pdf.js';

// 2. INICJALIZACJA (poza blokiem DOMContentLoaded, by nasłuchiwać sesji od razu)
initAuthStateListener();

// 3. LOGIKA PO ZAŁADOWANIU STRONY
document.addEventListener('DOMContentLoaded', () => {
    
    // --- OBSŁUGA LOGOWANIA ---
    document.getElementById('btn-login')?.addEventListener('click', () => {
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;
        handleLogin(email, pass);
    });

    document.getElementById('btn-reset-password')?.addEventListener('click', resetPassword);

    // --- NAWIGACJA (SIDEBAR) ---
    // Definiujemy akcje dla każdej zakładki
    const tabActions = {
        'side-dziennik': () => { showTab('dziennik'); initDziennikListener(); },
        'side-awarie': () => { showTab('awarie'); initAwarieListener(); },
        'side-zmiany': () => { showTab('zmiany'); initZmianyUI(); },
        'side-dashboard': () => { showTab('dashboard'); initDashboard(); }
    };

    // Podpinamy listenery do przycisków menu
    Object.entries(tabActions).forEach(([id, actionFn]) => {
        document.getElementById(id)?.addEventListener('click', actionFn);
    });

    // --- OBSŁUGA MODALI I PDF ---
    // Zamknięcie modala
    document.getElementById('btn-close-modal')?.addEventListener('click', () => {
        document.getElementById('shift-modal').classList.add('hidden');
    });

    // Pobieranie PDF (obsługa kliknięcia w dowolny przycisk z tym ID, nawet generowany dynamicznie)
    document.addEventListener('click', (e) => {
        if (e.target.id === 'btn-report-pdf' || e.target.id === 'btn-download-pdf') {
            downloadShiftPDF();
        }
    });

    // --- STARTOWE NASŁUCHIWANIE DANYCH ---
    // Inicjalizujemy dziennik na start (żeby dane były gotowe po zalogowaniu)
    initDziennikListener();
});