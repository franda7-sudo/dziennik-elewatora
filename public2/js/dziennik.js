import { 
    getFirestore, 
    collection, 
    addDoc, 
    query, 
    orderBy, 
    onSnapshot, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const db = getFirestore();
const entriesRef = collection(db, "dziennik_wpisy");

/**
 * Dodaje nowy wpis do dziennika
 * @param {string} userEmail - email zalogowanego użytkownika
 * @param {string} content - treść wpisu
 */
export async function addLogEntry(userEmail, content) {
    if (!content.trim()) return;

    try {
        await addDoc(entriesRef, {
            autor: userEmail,
            tresc: content,
            data: serverTimestamp() // Czas serwera, nie lokalny!
        });
        console.log("Wpis dodany pomyślnie");
    } catch (e) {
        console.error("Błąd zapisu: ", e);
    }
}

/**
 * Subskrybuje zmiany w bazie i aktualizuje UI w czasie rzeczywistym
 */
export function initDziennikListener() {
    const q = query(entriesRef, orderBy("data", "desc"));
    const container = document.getElementById('tab-dziennik-content');

    onSnapshot(q, (snapshot) => {
        // Czyścimy kontener przed renderowaniem nowej listy
        container.innerHTML = `
            <h3>Wpisy w dzienniku</h3>
            <div class="entry-form">
                <textarea id="log-input" placeholder="Co się dzieje na elewatorze?"></textarea>
                <button id="btn-add-log">Dodaj wpis</button>
            </div>
            <div id="log-list"></div>
        `;

        const logList = document.getElementById('log-list');

        snapshot.forEach((doc) => {
            const data = doc.data();
            const date = data.data?.toDate().toLocaleString('pl-PL') || "Ładowanie...";
            
            const entryDiv = document.createElement('div');
            entryDiv.className = 'log-entry';
            entryDiv.innerHTML = `
                <small>${date} | <strong>${data.autor}</strong></small>
                <p>${data.tresc}</p>
                <hr>
            `;
            logList.appendChild(entryDiv);
        });

        // Musimy ponownie podpiąć listener pod nowo wygenerowany przycisk
        document.getElementById('btn-add-log')?.addEventListener('click', () => {
            const content = document.getElementById('log-input').value;
            // Pobieramy aktualnie zalogowanego użytkownika z Firebase Auth
            const user = auth.currentUser; 
            if (user) {
                addLogEntry(user.email, content);
            }
        });
    });
}