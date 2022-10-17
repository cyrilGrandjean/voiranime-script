export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const DBOpenRequest = window.indexedDB.open("csvExporter", 4);

    DBOpenRequest.onerror = (_) => {
      console.error("Error loading database.");
      reject();
    }

    DBOpenRequest.onupgradeneeded = (_: IDBVersionChangeEvent) => {
      const db = DBOpenRequest.result;
      // Create an objectStore for this database
      const objectStore = db.createObjectStore("chapterUrls", {
          keyPath: ["serie", "chapter"],
      });
    
      // Define what data items the objectStore will contain
      objectStore.createIndex("serie", "serie", {unique: false});
      objectStore.createIndex("url", "url", {unique: false});
      objectStore.createIndex("fullUrl", "fullUrl", {unique: true});
    };

    DBOpenRequest.onsuccess = (_) => {
      console.info("Database initialized.");
      resolve(DBOpenRequest.result);
    };
  });
}
