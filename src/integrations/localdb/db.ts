// Local, in-browser database backed by IndexedDB.
//
// This is a temporary stand-in for a real backend: it lets registration and
// sign-in persist user accounts on the device until the server endpoints land.
// Keep the schema small and the helpers generic so new stores can be added in
// `STORES` + `onupgradeneeded` without touching call sites.

const DB_NAME = 'readom';
const DB_VERSION = 1;

// Object stores and the key path each is keyed by. Bump DB_VERSION whenever
// this list changes so existing clients run the upgrade.
export const STORES = {
  users: { keyPath: 'email' },
} as const;

export type StoreName = keyof typeof STORES;

let dbPromise: Promise<IDBDatabase> | null = null;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      for (const [name, config] of Object.entries(STORES)) {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: config.keyPath });
        }
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open the local database'));
  });
}

// Lazily open (and cache) the connection so callers don't manage lifecycle.
export function getDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = openDatabase().catch((err) => {
      // Reset so a later call can retry instead of reusing the rejection.
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
}

// Wrap a single-store transaction and resolve once it completes, surfacing
// either the request result or the transaction error.
async function run<T>(
  store: StoreName,
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await getDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const request = action(tx.objectStore(store));
    tx.oncomplete = () => resolve(request.result);
    tx.onerror = () => reject(tx.error ?? new Error('Local database transaction failed'));
    tx.onabort = () => reject(tx.error ?? new Error('Local database transaction aborted'));
  });
}

export function getRecord<T>(store: StoreName, key: IDBValidKey): Promise<T | undefined> {
  return run<T | undefined>(store, 'readonly', (s) => s.get(key) as IDBRequest<T | undefined>);
}

export function putRecord<T>(store: StoreName, value: T): Promise<IDBValidKey> {
  return run<IDBValidKey>(store, 'readwrite', (s) => s.put(value) as IDBRequest<IDBValidKey>);
}

export function getAllRecords<T>(store: StoreName): Promise<T[]> {
  return run<T[]>(store, 'readonly', (s) => s.getAll() as IDBRequest<T[]>);
}

export function deleteRecord(store: StoreName, key: IDBValidKey): Promise<undefined> {
  return run<undefined>(store, 'readwrite', (s) => s.delete(key) as IDBRequest<undefined>);
}
