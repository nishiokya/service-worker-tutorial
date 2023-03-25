const indexedDBButton = document.getElementById('indexeddb-button');

indexedDBButton.addEventListener('click', function(event) {
  const data = document.getElementById('input').value;

  const request = indexedDB.open('my-db', 1);

  request.onsuccess = function(event) {
    const db = event.target.result;

    const transaction = db.transaction(['my-store'], 'readwrite');

    const store = transaction.objectStore('my-store');

    const dataObject = {
      id: Date.now(),
      data: data
    };

    const request = store.add(dataObject);

    request.onsuccess = function(event) {
      console.log('Data added to IndexedDB:', dataObject);
    };

    request.onerror = function(event) {
      console.error('Error adding data to IndexedDB:', event.target.error);
    };
  };

  request.onerror = function(event) {
    console.error('Error opening IndexedDB:', event.target.error);
  };
});
