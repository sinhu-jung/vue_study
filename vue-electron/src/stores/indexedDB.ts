export interface LoginType {
  address: string;
  id: string;
  pw: string;
}

export const getDB = async () => {
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open("jiraInfoDB");

    request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      const db = (e.target as IDBOpenDBRequest).result;
      db.createObjectStore("jiraInfo", {
        autoIncrement: true,
        keyPath: "id",
      });
      db.createObjectStore("searchInfo", {
        autoIncrement: true,
        keyPath: "id",
      });
      db.createObjectStore("weekCellInfo", {
        autoIncrement: true,
        keyPath: "id",
      });
    };
    request.onerror = (error) => reject(error);
    request.onsuccess = (info) => {
      const success = info.target as IDBOpenDBRequest;
      resolve(success.result);
    };
  });
};

export const getJiraInfo: (
  dbInfo: IDBDatabase,
  tableName: string
) => Promise<any[]> = async (dbInfo: IDBDatabase, tableName: string) => {
  return await new Promise((resolve) => {
    const info: any[] = [];
    const transaction = dbInfo.transaction(tableName, "readonly");

    const objStore = transaction.objectStore(tableName);
    const cursorRequest = objStore.openCursor();

    cursorRequest.onsuccess = (e: any) => {
      const cursor = e.target.result;
      if (cursor) {
        info.push(cursor.value);
        cursor.continue();
      }
    };

    transaction.oncomplete = () => resolve(info);
  });
};

export const addJiraInfo = async (
  dbInfo: IDBDatabase,
  data: LoginType,
  tableName: string
) => {
  return new Promise((resolve) => {
    const transaction = dbInfo.transaction([tableName], "readwrite");
    const objStore = transaction.objectStore(tableName);
    objStore.clear();
    objStore.add({
      address: data.address,
      id: data.id,
      pw: data.pw,
    });
    transaction.oncomplete = () => resolve(true);
  });
};

export const addUserId = async (
  dbInfo: IDBDatabase,
  data: string,
  tableName: string
) => {
  return new Promise((resolve) => {
    const transaction = dbInfo.transaction([tableName], "readwrite");
    const objStore = transaction.objectStore(tableName);
    objStore.add({ id: data });
    transaction.oncomplete = () => resolve(true);
  });
};

export const deleteUserId = async (
  dbInfo: IDBDatabase,
  data: string,
  tableName: string
) => {
  return new Promise((resolve) => {
    const transaction = dbInfo.transaction([tableName], "readwrite");
    const objStore = transaction.objectStore(tableName);
    objStore.delete(data);
    transaction.oncomplete = () => resolve(true);
  });
};

export const addCellInfo = async (
  dbInfo: IDBDatabase,
  data: {
    id: string;
    title: string;
    cellUserList: string[];
  }
) => {
  return new Promise((resolve) => {
    const transaction = dbInfo.transaction(["weekCellInfo"], "readwrite");
    const objStore = transaction.objectStore("weekCellInfo");
    objStore.add(data);
    transaction.oncomplete = () => resolve(true);
  });
};

export const updateCellInfo = async (
  dbInfo: IDBDatabase,
  data: {
    id: string;
    title: string;
    cellUserList: string[];
    selectId: string | null;
    index: number;
  }
) => {
  return new Promise((resolve) => {
    const transaction = dbInfo.transaction(["weekCellInfo"], "readwrite");
    const objStore = transaction.objectStore("weekCellInfo");
    const updateStore = objStore.get(data.id);
    updateStore.onsuccess = () => {
      objStore.put(data);
    };
    transaction.oncomplete = () => resolve(true);
  });
};

export const deleteCellInfo = async (dbInfo: IDBDatabase, data: string) => {
  return new Promise((resolve) => {
    const transaction = dbInfo.transaction(["weekCellInfo"], "readwrite");
    const objStore = transaction.objectStore("weekCellInfo");
    objStore.delete(data);
    transaction.oncomplete = () => resolve(true);
  });
};
