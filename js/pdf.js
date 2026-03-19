import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function downloadShiftPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const db = getFirestore();

    // Pobieramy dane z ostatnich 24h
    const d = new Date();
    d.setHours(d.getHours() - 24);
    
    const q = query(collection(db, "dziennik_wpisy"), where("data", ">=", d));
    const querySnapshot = await getDocs(q);

    // Nagłówek raportu
    doc.setFontSize(18);
    doc.text("RAPORT DOBOWY ELEWATORA", 10, 20);
    doc.setFontSize(12);
    doc.text(`Data generowania: ${new Date().toLocaleString()}`, 10, 30);
    doc.line(10, 35, 200, 35);

    let y = 45;
    doc.text("Wpisy z ostatnich 24h:", 10, y);
    y += 10;

    querySnapshot.forEach((res) => {
        const data = res.data();
        const tekst = `${data.autor}: ${data.tresc}`;
        
        // Zawijanie tekstu, żeby nie wyszedł poza stronę
        const splitText = doc.splitTextToSize(tekst, 180);
        doc.text(splitText, 10, y);
        y += (splitText.length * 7);
    });

    doc.save(`raport_${new Date().toLocaleDateString()}.pdf`);
}