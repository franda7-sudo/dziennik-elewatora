import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { toggleAuthUI } from './ui.js';

const auth = getAuth();

/**
 * Inicjalizacja nasłuchiwania stanu logowania.
 * Powinna być wywołana raz przy starcie aplikacji.
 */
export function initAuthStateListener() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("Użytkownik zalogowany:", user.email);
            toggleAuthUI(true);
        } else {
            console.log("Brak zalogowanego użytkownika");
            toggleAuthUI(false);
        }
    });
}

/**
 * Logowanie użytkownika
 */
export async function handleLogin(email, password) {
    const errorElement = document.getElementById('login-error');
    errorElement.textContent = ""; // Wyczyść stare błędy

    try {
        await signInWithEmailAndPassword(auth, email, password);
        // UI przełączy się automatycznie dzięki onAuthStateChanged
    } catch (error) {
        console.error("Błąd logowania:", error.code);
        errorElement.textContent = "Błędny email lub hasło.";
    }
}

/**
 * Resetowanie hasła
 */
export async function resetPassword() {
    const email = document.getElementById('login-email').value;
    if (!email) {
        alert("Wpisz adres email w polu logowania.");
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        alert("Link do resetowania hasła został wysłany na Twój email.");
    } catch (error) {
        alert("Błąd: Nie udało się wysłać linku.");
    }
}

/**
 * Wylogowanie
 */
export function handleLogout() {
    signOut(auth).catch((error) => console.error("Błąd wylogowania:", error));
}