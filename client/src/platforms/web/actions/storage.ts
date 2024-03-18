import { walletProxy } from "shared/core/proxy";
import { addNotificationByMessage } from "shared/actions/notification";
import { NotificationType } from "constants/notificationList";
import { saveAs } from "vendor/FileSaver";
import { ZephyrAppState } from "platforms/desktop/reducers";

const ZEPHYR_DB = "zephyr";
const WALLET_STORE = "wallets";
const DB_VERSION = 4;

export const storeKeyFileToDisk = (name: string) => {
  return async (dispatch: any) => {
    const walletData = await walletProxy.getWalletData();
    const keysData = walletData[0];
    const blob = new Blob([keysData.buffer]);
    saveAs(blob, name + ".keys");

    dispatch(addNotificationByMessage(NotificationType.SUCCESS, "Wallet file download was successful"));
  };
};

export const storeWalletInDB = (): any => {
  return async (dispatch: any, getState: () => ZephyrAppState) => {
    const walletName = getState().walletSession.activeWallet;
    const currentHeight = getState().chain.walletHeight;
    // if its a temporary wallet ( just login via seed ) we don't store the wallet in any way

    if (walletName !== undefined) {
      try {
        await storeWalletDataInIndexedDB(walletName);
      } catch (e) {
        return false;
      }
    }
    //  dispatch({ type: SET_STORED_HEIGHT, payload: 0 });
    return true;
  };
};

export const deleteWalletInDB = async (walletName: string): Promise<boolean> => {
  if (walletName !== undefined) {
    try {
      await deleteWalletInIndexedDb(walletName);
    } catch (e) {
      return false;
    }
  }
  return true;
};

export const getWalletCacheByName = async (name: string): Promise<ArrayBuffer> => {
  try {
    const walletCache: ArrayBuffer = await fetchValueByKey(name);
    return walletCache;
  } catch (e) {
    // if wallet not exist just return an empty one
    return new ArrayBuffer(0);
  }
};

const fetchValueByKey = (name: string): Promise<ArrayBuffer> => {
  return new Promise((resolutionFunc, rejectionFunc) => {
    const openRequest: IDBOpenDBRequest = indexedDB.open(ZEPHYR_DB, DB_VERSION);
    openRequest.onupgradeneeded = function (this: IDBRequest<IDBDatabase>) {
      const db = this.result;
      db.createObjectStore(WALLET_STORE);
    };

    openRequest.onerror = function (this: IDBRequest<IDBDatabase>) {
      rejectionFunc("Sorry, cannot open indexedDB");
    };
    openRequest.onsuccess = function (this: IDBRequest<IDBDatabase>) {
      const db = this.result;
      if (db.objectStoreNames.contains(WALLET_STORE)) {
        const transaction = db.transaction(WALLET_STORE, "readonly");
        const keyRequest = transaction.objectStore(WALLET_STORE).get(name);
        keyRequest.onsuccess = function (this: IDBRequest<any>) {
          if (this.result === undefined) {
            rejectionFunc("Does not exist or is undefined");
          } else {
            const walletCache = this.result as ArrayBuffer;
            resolutionFunc(walletCache);
          }
        };
        keyRequest.onerror = function (error: any) {
          rejectionFunc(error);
        };
      } else {
        rejectionFunc(`${WALLET_STORE} does not exist as object store yet`);
      }
    };
  });
};

const fetchKeysFromDB = () => {
  let keys: string[] = [];
  const openRequest: IDBOpenDBRequest = indexedDB.open("zephyr", DB_VERSION);
  openRequest.onsuccess = function (this: IDBRequest<IDBDatabase>) {
    const db = this.result;
    const transaction = db.transaction("wallet", "readonly");
    const keyRequest = transaction.objectStore("wallet").getAllKeys();
    keyRequest.onsuccess = function (this: IDBRequest<IDBValidKey[]>) {
      keys = this.result as string[];
    };
  };
};

const storeWalletDataInIndexedDB = async (name: string): Promise<void> => {
  return new Promise(async (resolutionFunc, rejectionFunc) => {
    const walletData = await walletProxy.getWalletData();
    const wallet = walletData[1];
    const openRequest: IDBOpenDBRequest = indexedDB.open(ZEPHYR_DB, DB_VERSION);

    openRequest.onupgradeneeded = function (this: IDBRequest<IDBDatabase>) {
      const db = this.result;
      db.createObjectStore(WALLET_STORE);
    };

    openRequest.onerror = function (error: any) {
      rejectionFunc();
    };

    openRequest.onsuccess = function (this: IDBRequest<IDBDatabase>) {
      const db = this.result;

      const transaction = db.transaction(WALLET_STORE, "readwrite");
      const putRequest: IDBRequest<IDBValidKey> = transaction.objectStore(WALLET_STORE).put(wallet.buffer, name);

      putRequest.onsuccess = function (this: IDBRequest<IDBValidKey>) {
        resolutionFunc();
      };
      putRequest.onerror = function (this: IDBRequest<IDBValidKey>) {
        rejectionFunc();
      };
    };
  });
};

export const deleteWalletInIndexedDb = async (name: string): Promise<void> => {
  return new Promise(async (resolutionFunc, rejectionFunc) => {
    const openRequest: IDBOpenDBRequest = indexedDB.open(ZEPHYR_DB, DB_VERSION);

    openRequest.onupgradeneeded = function (this: IDBRequest<IDBDatabase>) {
      const db = this.result;
      db.createObjectStore(WALLET_STORE);
    };

    openRequest.onerror = function (error: any) {
      rejectionFunc();
    };

    openRequest.onsuccess = function (this: IDBRequest<IDBDatabase>) {
      const db = this.result;

      const transaction = db.transaction(WALLET_STORE, "readwrite");
      const delRequest: IDBRequest<undefined> = transaction.objectStore(WALLET_STORE).delete(name);

      delRequest.onsuccess = function (this: IDBRequest<undefined>) {
        resolutionFunc();
      };
      delRequest.onerror = function (this: IDBRequest<undefined>) {
        rejectionFunc();
      };
    };
  });
};
