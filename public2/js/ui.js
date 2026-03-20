/**
 * Zarządzanie widocznością zakładek
 * @param {string} tabName - nazwa zakładki (np. 'dziennik')
 */
export function showTab(tabName) {
    // 1. Ukryj wszystkie sekcje zakładek
    const allTabs = document.querySelectorAll('.tab');
    allTabs.forEach(tab => {
        tab.classList.add('hidden');
    });

    // 2. Usuń klasę 'active' ze wszystkich przycisków menu (opcjonalne dla stylizacji CSS)
    const menuButtons = document.querySelectorAll('#sidebar button');
    menuButtons.forEach(btn => btn.classList.remove('active'));

    // 3. Pokaż wybraną zakładkę
    const targetTab = document.getElementById(`tab-${tabName}-content`);
    if (targetTab) {
        targetTab.classList.remove('hidden');
        console.log(`Przełączono na zakładkę: ${tabName}`);
    }

    // 4. Podświetl aktywny przycisk w menu
    const activeBtn = document.getElementById(`side-${tabName}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

/**
 * Przełączanie między ekranem logowania a główną aplikacją
 * @param {boolean} isLoggedIn 
 */
export function toggleAuthUI(isLoggedIn) {
    const loginScreen = document.getElementById('login-screen');
    const appContent = document.getElementById('app-content');

    if (isLoggedIn) {
        loginScreen.classList.add('hidden');
        appContent.classList.remove('hidden');
        // Domyślnie pokaż pierwszą zakładkę po zalogowaniu
        showTab('dziennik');
    } else {
        loginScreen.classList.remove('hidden');
        appContent.classList.add('hidden');
    }
}

/**
 * Obsługa Modala (okna wyskakującego)
 */
export function toggleModal(modalId, show = true) {
    const modal = document.getElementById(modalId);
    if (modal) {
        show ? modal.classList.remove('hidden') : modal.classList.add('hidden');
    }
}