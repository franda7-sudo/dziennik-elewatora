import { 
    getFirestore, 
    collection, 
    query, 
    where, 
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const db = getFirestore();

export function initDashboard() {
    const container = document.getElementById('tab-dashboard-content');

    // Przygotowanie szkieletu Dashboardu
    container.innerHTML = `
        <h3>Podsumowanie Elewatora</h3>
        <div class="dashboard-grid">
            <div class="card stat-card">
                <h4>Aktywne Awarie</h4>
                <p id="stat-awarie">Ładowanie...</p>
            </div>
            <div class="card stat-card">
                <h4>Wpisy (Dziś)</h4>
                <p id="stat-wpisy">Ładowanie...</p>
            </div>
            <div class="card stat-card">
                <h4>Maszyny w naprawie</h4>
                <p id="stat-naprawy">Ładowanie...</p>
            </div>
        </div>
        <div class="dashboard-alerts" id="dashboard-alerts">
            </div>
    `;

    // 1. Licznik awarii (Status: Oczekiwanie)
    const qAwarie = query(collection(db, "awarie"), where("status", "==", "Oczekiwanie"));
    onSnapshot(qAwarie, (snapshot) => {
        document.getElementById('stat-awarie').textContent = snapshot.size;
    });

    // 2. Licznik maszyn w trakcie naprawy
    const qNaprawy = query(collection(db, "awarie"), where("status", "==", "W trakcie"));
    onSnapshot(qNaprawy, (snapshot) => {
        document.getElementById('stat-naprawy').textContent = snapshot.size;
    });

    // 3. Licznik wpisów z ostatnich 24h
    const d = new Date();
    d.setHours(d.getHours() - 24);
    const qWpisy = query(collection(db, "dziennik_wpisy"), where("data", ">=", d));
    
    onSnapshot(qWpisy, (snapshot) => {
        document.getElementById('stat-wpisy').textContent = snapshot.size;
    });
}