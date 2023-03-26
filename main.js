document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const results = document.getElementById('results');
  const querySuggest = document.getElementById('query-suggest');

  const dbName = 'searchHistory';
  const objectStoreName = 'queries';
  let db;

  // IndexedDBの初期化
  initIndexedDB();

  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    // 検索処理
    const searchResults = await performSearch(query);

    // 検索結果を表示
    displaySearchResults(searchResults);

    // 検索履歴を保存
    saveSearchHistory(query);
  });

  searchInput.addEventListener('input', async () => {
    const query = searchInput.value.trim();
    if (!query) {
      querySuggest.innerHTML = '';
      return;
    }

    // クエリサジェストを表示
    const suggestions = await getSuggestions(query);
    displaySuggestions(suggestions);
  });

  async function initIndexedDB() {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      db.createObjectStore(objectStoreName, { keyPath: 'id', autoIncrement: true });
    };

    request.onsuccess = (event) => {
      db = event.target.result;
    };

    request.onerror = (event) => {
      console.error('IndexedDBの初期化に失敗しました', event);
    };
  }

  async function performSearch(query) {
    // ここでは、デモ用にダミーの検索結果を返すようにしています。
    return [
      { title: 'タイトル1', author: '著者1' },
      { title: 'タイトル2', author: '著者2' },
      { title: 'タイトル3', author: '著者3' }
    ];
  }

  function displaySearchResults(searchResults) {
    results.innerHTML = '';

    if (searchResults.length === 0) {
      results.innerHTML = '<p>検索結果が見つかりませんでした。</p>';
      return;
    }

    const ul = document.createElement('ul');
    results.appendChild(ul);

    searchResults.forEach(result => {
      const li = document.createElement('li');
      li.textContent = `${result.title} - ${result.author}`;
      ul.appendChild(li);
    });
  }

  async function saveSearchHistory(query) {
    const transaction = db.transaction([objectStoreName], 'readwrite');
    const objectStore = transaction.objectStore(objectStoreName);
    await objectStore.add({ query, timestamp: Date.now() });
  }

  async function getSuggestions(query) {
    const transaction = db.transaction([objectStoreName], 'readonly');
    const objectStore = transaction.objectStore(objectStoreName);
    const allRecords = await objectStore.getAll();
    // クエリに関連する検索履歴をフィルタリング
    const suggestions = allRecords.result
      .filter(record => record.query.startsWith(query))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5)
      .map(record => record.query);

    return suggestions;
  }
  function displaySuggestions(suggestions) {
    querySuggest.innerHTML = '';

    if (suggestions.length === 0) {
        return;
    }

    const ul = document.createElement('ul');
    querySuggest.appendChild(ul);

    suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        li.classList.add('suggest-item');
        li.addEventListener('click', () => {
            searchInput.value = suggestion;
            querySuggest.innerHTML = '';
        });
        ul.appendChild(li);
    });
}
});
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js', { scope: './' })
      .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
          console.error('Service Worker registration failed:', error);
      });
}
