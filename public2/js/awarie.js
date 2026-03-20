// 1. Inicjalizacja EmailJS (Pamiętaj o podaniu swoich kluczy w panelu EmailJS)
emailjs.init("TWÓJ_PUBLIC_KEY"); 

// 2. Importy z Firebase
import { 
    getAuth 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    updateDoc, 
    doc, 
    query, 
    orderBy, 
    onSnapshot, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const db = getFirestore();
const auth = getAuth(); // Inicjalizacja auth, aby móc pobrać currentUser
const awarieRef = collection(db, "awarie");

/**
 * Zgłaszanie nowej awarii wraz z powiadomieniem E-mail
 */
export async function reportAwaria(userEmail, maszyna, opis) {
    if (!maszyna || !opis) {
        alert("Wypełnij wszystkie pola!");
        return;
    }

    try {
        // Zapis do bazy Firestore
        const docRef = await addDoc(awarieRef, {
            autor: userEmail,
            maszyna: maszyna,
            opis: opis,
            status: "Oczekiwanie",
            dataZgloszenia: serverTimestamp()
        });

        console.log("Awaria zapisana w bazie. ID:", docRef.id);

        // Wysyłka powiadomienia E-mail przez EmailJS
        await sendEmailNotification(userEmail, maszyna, opis);
        
        alert("Zgłoszono awarię i wysłano powiadomienie do biura.");

    } catch (e) {
        console.error("Błąd podczas zgłaszania awarii:", e);
        alert("Wystąpił błąd podczas zgłaszania.");
    }
}

/**
 * Funkcja pomocnicza do wysyłki Email
 */
async function sendEmailNotification(userEmail, maszyna, opis) {
    const serviceID = "hs_OQseuLVA2jpBfR";   
    const templateID = "template_x2idxhb"; 
    
    const templateParams = {
        from_name: userEmail,
        machine_name: maszyna,
        description: opis,
        admin_email: "kierownik@twoja-firma.pl" 
    };

    try {
        await emailjs.send(serviceID, templateID, templateParams);
        console.log("E-mail wysłany pomyślnie.");
    } catch (error) {
        console.error("Błąd wysyłki e-mail:", error);
    }
}

/**
 * Aktualizacja statusu awarii
 */
export async function updateAwariaStatus(id, nowyStatus) {
    try {
        const awariaDoc = doc(db, "awarie", id);
        await updateDoc(awariaDoc, { status: nowyStatus });
    } catch (e) {
        console.error("Błąd aktualizacji statusu:", e);
    }
}

/**
 * Nasłuchiwanie i renderowanie listy awarii
 */
export function initAwarieListener() {
    const q = query(awarieRef, orderBy("dataZgloszenia", "desc"));
    const container = document.getElementById('tab-awarie-content');

    if (!container) return;

    onSnapshot(q, (snapshot) => {
        container.innerHTML = `
            <h3>Zgłoś nową awarię</h3>
            <div class="awaria-form">
                <input id="awaria-maszyna" type="text" placeholder="Nazwa maszyny/urządzenia">
                <textarea id="awaria-opis" placeholder="Opis usterki"></textarea>
                <button id="btn-add-awaria">Zgłoś awarię</button>
            </div>
            <hr>
            <h3>Lista aktywnych zgłoszeń</h3>
            <div id="awarie-list"></div>
        `;

        const list = document.getElementById('awarie-list');

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;
            
            const card = document.createElement('div');
            card.className = `awaria-card status-${data.status.toLowerCase()}`;
            card.innerHTML = `
                <h4>${data.maszyna} <span>(${data.status})</span></h4>
                <p>${data.opis}</p>
                <small>Zgłosił: ${data.autor}</small>
                <div class="awaria-actions">
                    <button onclick="window.updateStatus('${id}', 'W trakcie')">⚙️ Naprawiam</button>
                    <button onclick="window.updateStatus('${id}', 'Naprawione')">✅ Gotowe</button>
                </div>
            `;
            list.appendChild(card);
        });

        // Obsługa kliknięcia przycisku zgłaszania
        document.getElementById('btn-add-awaria')?.addEventListener('click', () => {
            const m = document.getElementById('awaria-maszyna').value;
            const o = document.getElementById('awaria-opis').value;
            const user = auth.currentUser; 
            if (user) {
                reportAwaria(user.email, m, o);
            } else {
                alert("Musisz być zalogowany, aby zgłosić awarię!");
            }
        });
    });
}

// Udostępnienie funkcji globalnie dla onclick w HTML
window.updateStatus = updateAwariaStatus;