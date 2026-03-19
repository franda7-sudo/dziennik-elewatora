import { 
    getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const db = getFirestore();

export async function startShift(userEmail) {
    try {
        await addDoc(collection(db, "zmiany"), {
            uzytkownik: userEmail,
            start: serverTimestamp(),
            status: "aktywna"
        });
        alert("Zmiana rozpoczęta!");
        initZmianyUI();
    } catch (e) {
        console.error("Błąd startu zmiany:", e);
    }
}

export function initZmianyUI() {
    const container = document.getElementById('tab-zmiany-content');
    container.innerHTML = `
        <h3>Zarządzanie Zmianą</h3>
        <div class="shift-controls">
            <button id="btn-start-shift">Rozpocznij Dyżur</button>
            <button id="btn-report-pdf">Generuj Raport Dobowy (PDF)</button>
        </div>
        <div id="active-shift-info"></div>
    `;

    document.getElementById('btn-start-shift').addEventListener('click', () => {
        // Tu pobierz maila z Firebase Auth
        const user = auth.currentUser;
        if (user) startShift(user.email);
    });
}