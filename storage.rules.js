rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /failures/{allPaths=**} {
      // Pozwala na wysyłanie zdjęć każdemu (lub zalogowanemu)
      allow create: if request.resource.size < 10 * 1024 * 1024 // max 10MB
                    && request.resource.contentType.matches('image/.*');
      
      // Pozwala na odczyt konkretnego zdjęcia, jeśli zna się link
      allow get: if true;
      
      // Blokuje usuwanie i listowanie wszystkich plików
      allow delete, list: if false;
    }
  }
}