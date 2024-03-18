import { ipcMain } from "electron";
import * as core from "../shared/wallet";
import * as daemon from "../shared/zephyrd";
import { logInDevMode } from "../dev";
import { mainWindow } from "../index";
import { CommunicationChannel, NET } from "../types";
import { getAvailableWallets } from "./walletPaths";
import { ZephyrWalletListener } from "./ZephyrWalletListener";
import MoneroTx = require("zephyr-javascript/src/main/js/daemon/model/MoneroTx");
import MoneroSubaddress = require("zephyr-javascript/src/main/js/wallet/model/MoneroSubaddress");
import { enableKeysMenu } from "../menu";

export interface WalletRequest {
  methodName: string;
  params: any[];
}

/**
 * this class establishes the communication between client app and wallet
 */
export class WalletHandler {
  public start() {
    this.addHandlers();
  }

  public quit() {
    this.removeHandlers();
  }

  private addHandlers() {
    ipcMain.handle(CommunicationChannel.STORED_WALLETS, (event, netTypeID: NET) => getAvailableWallets(netTypeID));
    ipcMain.handle(CommunicationChannel.WALLET, (event, args) => this.handleWalletCoreRequest(args as WalletRequest));
    ipcMain.handle(CommunicationChannel.DAEMON, (event, args) => this.handleDaemonCoreRequest(args as WalletRequest));
  }

  private removeHandlers() {
    ipcMain.removeHandler(CommunicationChannel.WALLET);
    ipcMain.removeHandler(CommunicationChannel.DAEMON);
    ipcMain.removeHandler(CommunicationChannel.STORED_WALLETS);
  }

  private handleWalletCoreRequest = async (request: WalletRequest) => {
    const methodName: keyof typeof core = request.methodName as keyof typeof core;
    const params = request.params;

    logInDevMode(request.methodName);

    if (methodName === "addWalletListener") {
      this.addWalletListener();
      enableKeysMenu(true);
      return;
    }

    if (methodName === "closeWallet") {
      enableKeysMenu(false);
    }

    try {
      const response = await core[methodName].call(null, ...params);

      logInDevMode(response);

      if (methodName === "getTxs") {
        const txClassObjects = response;
        const txJsonObjects = txClassObjects.map((tx: MoneroTx) => {
          const txJson = tx.toJson();

          // little workaround to preserve block data ( height, timestamp ) in tx
          if (tx.getBlock()) {
            const block = tx.getBlock().toJson();
            delete block.txs;
            txJson.block = block;
          }
          return txJson;
        });
        return txJsonObjects;
      }

      if (methodName === "transfer" || methodName === "sweep") {
        const txClassObjects = response;
        const txJsonObjects = txClassObjects.map((tx: MoneroTx) => {
          // serialize tx data
          return tx.toJson();
        });
        return txJsonObjects;
      }

      if (methodName === "getMaxDestinationAmount") {
        return response.toString();
      }

      if (methodName === "getSubAddresses") {
        const addressClassObjects = response;
        const addressJsonObjects = addressClassObjects.map((address: MoneroSubaddress) => {
          // serialize address data
          return address.toJson();
        });
        return addressJsonObjects;
      }
      if (
        methodName === "createSubAddress" ||
        methodName === "getBalance" ||
        methodName === "getUnlockedBalance" ||
        methodName === "getReserveInfo"
      ) {
        // serialize address and balance data
        return response.toJson();
      }
      return response;
    } catch (e) {
      logInDevMode(e);

      return {
        message: e.message,
        status: "error",
        code: e.code,
      };
    }
  };

  private handleDaemonCoreRequest = async (request: WalletRequest) => {
    const methodName: keyof typeof daemon = request.methodName as keyof typeof daemon;
    const params = request.params;

    try {
      const response = await daemon[methodName].call(null, ...params);
      if (response.toJson) {
        const jsonResponse = response.toJson();
        return jsonResponse;
      }

      return response;
    } catch (e) {
      return e.toString();
    }
  };

  addWalletListener = () => {
    const listener = new ZephyrWalletListener(mainWindow.webContents);
    core.addWalletListener(listener);
  };
}
