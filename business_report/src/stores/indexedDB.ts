export interface LoginType {
  address: string
  id: string
  pw: string
}

export const getDB = async () => {
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open('jiraInfoDB', 2)

    request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      const db = (e.target as IDBOpenDBRequest).result
      db.createObjectStore('jiraInfo', {
        autoIncrement: true,
        keyPath: 'id'
      })
    }
    request.onerror = (error) => reject(error)
    request.onsuccess = (info) => {
      const success = info.target as IDBOpenDBRequest
      resolve(success.result)
    }
  })
}

export const getJiraInfo: (dbInfo: IDBDatabase) => Promise<LoginType[]> = async (
  dbInfo: IDBDatabase
) => {
  return await new Promise((resolve) => {
    const info: LoginType[] = []
    const transaction = dbInfo?.transaction('jiraInfo', 'readonly')

    const objStore = transaction.objectStore('jiraInfo')
    const cursorRequest = objStore.openCursor()

    cursorRequest.onsuccess = (e: any) => {
      const cursor = e.target.result
      if (cursor) {
        info.push(cursor.value)
        cursor.continue()
      }
    }

    transaction.oncomplete = () => resolve(info)
  })
}

export const addJiraInfo = async (dbInfo: IDBDatabase, data: LoginType) => {
  return new Promise((resolve) => {
    const transaction = dbInfo.transaction(['jiraInfo'], 'readwrite')
    const objStore = transaction.objectStore('jiraInfo')
    objStore.delete(data.id)
    objStore.add(data)
    transaction.oncomplete = () => resolve(true)
  })
}
