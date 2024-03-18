import { isDesktop } from "constants/env";
import { getLocalNodeState } from "platforms/desktop/actions/localNode";
import { ZephyrAppState } from "platforms/desktop/reducers";
import { getNodeForWallet } from "platforms/web/actions";
import { walletProxy } from "shared/core/proxy";
import { MODAL_TYPE } from "shared/reducers/modal";
import { getHeightOfFirstIncomingTx, hasNoTxsEntries } from "shared/reducers/xTransferList";
import { logM } from "utility/utility";
import { getAppConnectionState, getWalletConnectionState } from "./connection";
import { hideModal, showModal } from "./modal";
import { getAllTransfers } from "./transferHistory";
import { SET_RESTORE_HEIGHT } from "./types";
import { saveWallet } from "./walletSession";

// a few things we need to refresh
export const refresh = () => {
  return (dispatch: any) => {
    dispatch(getWalletConnectionState());
    dispatch(getAppConnectionState());
    if (isDesktop()) {
      dispatch(getLocalNodeState());
    }
  };
};

export const syncFromFirstIncomingTx = () => {
  return async (dispatch: any, getState: () => ZephyrAppState) => {
    if (hasNoTxsEntries(getState())) {
      await dispatch(getAllTransfers());
    }

    let currentSyncHeight = await walletProxy.getRestoreHeight();

    let newSyncHeight = getHeightOfFirstIncomingTx(getState());

    dispatch({ type: SET_RESTORE_HEIGHT, payload: newSyncHeight });

    // await walletProxy.stopSyncing();
    if (newSyncHeight !== -1) {
      // give 5 blocks tolerance
      newSyncHeight = Math.max(newSyncHeight - 5, currentSyncHeight, 0);
      await walletProxy.setRestoreHeight(newSyncHeight);
    }
    dispatch(showModal(MODAL_TYPE.RescanBC));
    await walletProxy.rescanBlockchain();
    dispatch(saveWallet());
    dispatch(hideModal());
  };
};

export const setRestoreFromHeight = (height: number) => {
  return async (dispatch: any, getState: () => ZephyrAppState) => {
    dispatch({ type: SET_RESTORE_HEIGHT, payload: height });

    await walletProxy.setRestoreHeight(height);

    dispatch(showModal(MODAL_TYPE.RescanBCLoading));
    await walletProxy.rescanBlockchain();
    dispatch(saveWallet());
    dispatch(hideModal());
  };
};

export const rescanSpent = () => {
  return async (dispatch: any, getState: () => ZephyrAppState) => {
    dispatch({ type: "RESCAN_SPENT" });
    walletProxy.rescanSpent();
  };
};
