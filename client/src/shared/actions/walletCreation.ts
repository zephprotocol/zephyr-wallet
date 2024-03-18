import { getNetworkByName, isDesktop, isWeb } from "constants/env";
import { NotificationType } from "constants/notificationList";
import { DesktopAppState, ZephyrAppState } from "platforms/desktop/reducers";
import { selectStorePath } from "platforms/desktop/reducers/storedWallets";
import { NodeLocation } from "platforms/desktop/types";
import { getWalletCacheByName } from "platforms/web/actions/storage";
import { webWalletConnection } from "platforms/web/nodes";
import { Chain } from "shared/reducers/chain";
import { ICreateWallet, IMonerRPCConnection, IOpenWallet } from "typings";
import { walletProxy } from "../core/proxy";
import { addNotificationByMessage } from "./notification";
import {
  CREATE_WALLET_FAILED,
  CREATE_WALLET_FETCHING,
  CREATE_WALLET_SUCCEED,
  GET_WALLET_HEIGHT_SUCCEED,
  OPEN_WALLET_FAILED,
  OPEN_WALLET_FETCHING,
  OPEN_WALLET_SUCCEED,
  QUERY_MNEMONIC_FOR_WALLET_GENERATION_SUCCEED,
  RESTORE_WALLET_BY_SEED_FAILED,
  RESTORE_WALLET_BY_SEED_FETCHING,
  RESTORE_WALLET_BY_SEED_SUCCEED,
} from "./types";
import { startWalletSession } from "./walletSession";

/** collection of actions to open, create and store wallet */

/** used by browser */
export const openWalletByData = (keysData: Uint8Array, password: string, walletName: string) => {
  return async (dispatch: any, getState: any) => {
    const cacheData = await getWalletCacheByName(walletName);
    const walletData: IOpenWallet = {
      keysData,
      //@ts-ignore
      cacheData: new Uint8Array(cacheData),
      password,
      networkType: getNetworkByName(),
      server: getNodeForWallet(getState),
      proxyToWorker: true,
    };
    dispatch(openWallet(walletData, walletName));
  };
};

/** used by nodejs env */
export const openWalletByFile = (filename: string, password: string) => {
  return (dispatch: any, getStore: () => DesktopAppState) => {
    const path = createStorePath(getStore, filename);

    const walletData: IOpenWallet = {
      path,
      password,
      networkType: getNetworkByName(),
      server: getNodeForWallet(getStore),
      proxyToWorker: true,
    };

    dispatch(openWallet(walletData, filename));
  };
};

const openWallet = (walletData: IOpenWallet, path: string) => {
  return async (dispatch: any) => {
    dispatch(openWalletFetching());

    try {
      await walletProxy.openWallet(walletData);

      dispatch(openWalletSucceed(path));
      /*     dispatch(
        addNotificationByMessage(
          NotificationType.SUCCESS,
          "Wallet was successfully unlocked"
        )
      ); */
      dispatch(startWalletSession(path));
    } catch (e) {
      addNotificationByMessage(NotificationType.ERROR, "Open wallet is not working, please try again soon...");
      dispatch(openWalletFailed(e as object));
    }
  };
};

export const createNewWallet = (path: string | undefined, password: string, walletName: string) => {
  return async (dispatch: any, getStore: () => ZephyrAppState) => {
    dispatch(createWalletFetch(walletName));

    let storePath = path;

    if (isDesktop()) {
      storePath = createStorePath(getStore as () => DesktopAppState, path);
    }

    const walletData: ICreateWallet = {
      path: storePath,
      password,
      server: getNodeForWallet(getStore),
      networkType: getNetworkByName(),
      proxyToWorker: true,
    };

    try {
      await walletProxy.createWallet(walletData);

      const mnemomic = await walletProxy.getMnemonic();
      dispatch(queryMnemonicForWalletGenerationSucceed(mnemomic));
      dispatch(createWalletSucceed());
      addNotificationByMessage(NotificationType.SUCCESS, "Wallet is open");
    } catch (e) {
      addNotificationByMessage(NotificationType.ERROR, "Open wallet is not working, please try again soon...");
      dispatch(createWalletFailed(e as object));
    }
  };
};

/**
 * restores/creates a wallet by seed, path is defined for nodejs-wallets and undefined for web wallets
 * @param path
 * @param mnemonic
 * @param password
 * @param walletName
 */
export const restoreWalletByMnemomic = (
  path: string | undefined,
  mnemonic: string,
  password: string,
  walletName: string | undefined,
  restoreHeight?: number,
) => {
  return async (dispatch: any, getStore: () => ZephyrAppState) => {
    let storePath = path;

    if (isDesktop()) {
      storePath = createStorePath(getStore as () => DesktopAppState, path);
    }

    const walletData: ICreateWallet = {
      path: storePath,
      mnemonic,
      password,
      networkType: getNetworkByName(),
      server: getNodeForWallet(getStore),
      restoreHeight,
      proxyToWorker: true,
    };

    dispatch(restoreWalletFetching(walletName));

    try {
      await walletProxy.createWallet(walletData);

      dispatch(restoreWalletSucceed(walletName));
      addNotificationByMessage(NotificationType.SUCCESS, "Restored wallet with Mnemomic");
    } catch (e) {
      addNotificationByMessage(NotificationType.ERROR, "Restore wallet is not working, please try again soon...");
      dispatch(restoreWalletFailed(e));
    }
  };
};

export const restoreWalletByKeys = (
  path: string | undefined,
  primaryAddress: string,
  privateSpendKey: string,
  privateVieKey: string,
  password: string,
  walletName: string,
) => {
  return async (dispatch: any, getStore: any) => {
    const walletData: ICreateWallet = {
      path,
      networkType: getNetworkByName(),
      server: getNodeForWallet(getStore),
      password,
    };

    dispatch(createWalletFetch(walletName));

    try {
      await walletProxy.createWallet(walletData);

      dispatch(restoreWalletSucceed(path));
      addNotificationByMessage(NotificationType.SUCCESS, "Restored wallet with Keystore");
    } catch (e) {
      addNotificationByMessage(NotificationType.ERROR, "Open wallet is not working, please try again soon...");
      dispatch(restoreWalletFailed(e));
    }
  };
};

export const onWalletSyncUpdateSucceed = (heights: Partial<Chain>) => {
  return { type: GET_WALLET_HEIGHT_SUCCEED, payload: heights };
};

const openWalletFetching = () => {
  return { type: OPEN_WALLET_FETCHING };
};

const openWalletSucceed = (fileName: string) => {
  return { type: OPEN_WALLET_SUCCEED, payload: fileName };
};

const openWalletFailed = (error: object) => {
  return { type: OPEN_WALLET_FAILED, payload: error };
};

const createWalletFetch = (walletName: string) => ({
  type: CREATE_WALLET_FETCHING,
  payload: walletName,
});

const createWalletSucceed = () => ({
  type: CREATE_WALLET_SUCCEED,
});
const createWalletFailed = (error: object) => ({
  type: CREATE_WALLET_FAILED,
  payload: error,
});

const queryMnemonicForWalletGenerationSucceed = (key: string) => ({
  type: QUERY_MNEMONIC_FOR_WALLET_GENERATION_SUCCEED,
  payload: key,
});

const restoreWalletFetching = (walletName: string | undefined) => ({
  type: RESTORE_WALLET_BY_SEED_FETCHING,
  payload: walletName,
});
const restoreWalletSucceed = (name: string | undefined) => ({
  type: RESTORE_WALLET_BY_SEED_SUCCEED,
  payload: name,
});
const restoreWalletFailed = (error: any) => ({
  type: RESTORE_WALLET_BY_SEED_FAILED,
  payload: error,
});

export const rescanBlockchain = async () => {
  return walletProxy.rescanBlockchain();
};

const createStorePath = (getStore: () => DesktopAppState, filename: string | undefined) => {
  if (filename === undefined) {
    return filename;
  }

  const storePath = selectStorePath(getStore());

  if (storePath) {
    return storePath + "/" + filename;
  }
  return filename;
};

export const getNodeForWallet = (getState: () => ZephyrAppState): IMonerRPCConnection | undefined => {
  if (isWeb()) {
    return webWalletConnection();
  }

  const selectedNode = (getState() as DesktopAppState).connectedNode;

  if (selectedNode.location === NodeLocation.None) {
    return undefined;
  }

  return { uri: selectedNode.address! + ":" + selectedNode.port!, username: "super", password: "super" };
};
