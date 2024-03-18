import { isDesktop } from "constants/env";
import { callWalletBackend } from "platforms/desktop/ipc/wallet";
import * as walletCore from "./wallet";
import * as zephyrdCore from "./zephyrd";
import MoneroTxWallet from "zephyr-javascript/src/main/js/wallet/model/MoneroTxWallet";
import { CommunicationChannel } from "platforms/desktop/ipc/ipc-types";
import MoneroBlockHeader from "zephyr-javascript/src/main/js/daemon/model/MoneroBlockHeader";
import MoneroSubaddress from "zephyr-javascript/src/main/js/wallet/model/MoneroSubaddress";
import { logM } from "utility/utility";
import MoneroBlock from "zephyr-javascript/src/main/js/daemon/model/MoneroBlock";
import ZephyrBalance from "zephyr-javascript/src/main/js/wallet/model/ZephyrBalance";
import ZephyrReserveInfo from "zephyr-javascript/src/main/js/wallet/model/ZephyrReserveInfo";

const walletHandler: ProxyHandler<typeof walletCore> = {
  get: (target: typeof walletCore, name: keyof typeof walletCore, receiver: any) => {
    if (isDesktop()) {
      return async function (...args: any[]) {
        // we need to handle serialization of data as ipcrenderer cannot transport classes, only raw objects

        try {
          const response = await callWalletBackend(name, args, CommunicationChannel.WALLET);

          logM(response);

          if (response && response.status && response.status === "error") {
            throw new Error(response.message);
          }

          if (name === "transfer" || name === "sweep") {
            const txs: MoneroTxWallet[] = response.map((jsonTx: any) => new MoneroTxWallet(jsonTx));

            return txs;
          }

          if (name === "getTxs") {
            const transfers: MoneroTxWallet[] = response.map((state: any) => {
              //workaround to pull in block info into the core lib architecture
              const txWallet = new MoneroTxWallet(state);
              if (state.block) {
                //@ts-ignore
                const block = new MoneroBlock(state.block);
                txWallet.setBlock(block);
              }

              return txWallet;
            });

            return transfers;
          }

          if (name === "getReserveInfo") {
            //@ts-ignore
            const reserveInfo: ZephyrReserveInfo = new ZephyrReserveInfo(response);
            return reserveInfo;
          }

          if (name === "getSubAddresses") {
            const addresses: MoneroSubaddress[] = response.map((jsonAddress: any) => new MoneroSubaddress(jsonAddress));

            return addresses;
          }

          if (name === "createSubAddress") {
            const address: MoneroSubaddress = new MoneroSubaddress(response);
            return address;
          }

          if (name === "getBalance" || name === "getUnlockedBalance") {
            //@ts-ignore
            const balance: ZephyrBalance = new ZephyrBalance(response);
            return balance;
          }

          return response;
        } catch (e: any) {
          throw e.message;
        }
      };
    }
    return Reflect.get(target, name, receiver);
  },
};

const zephyrdHandler: ProxyHandler<typeof zephyrdCore> = {
  get: (target: typeof zephyrdCore, name: keyof typeof zephyrdCore, receiver: any) => {
    if (isDesktop()) {
      return async function (...args: any[]) {
        try {
          const response = await callWalletBackend(name, args, CommunicationChannel.DAEMON);

          if (name === "getLastBlockHeader") {
            const headerResponse: MoneroBlockHeader = new MoneroBlockHeader(response);
            return headerResponse;
          }
          return response;
        } catch (e) {
          throw e;
        }
      };
    }
    return Reflect.get(target, name, receiver);
  },
};

export const zephyrdProxy = new Proxy(zephyrdCore, zephyrdHandler);
export const walletProxy = new Proxy(walletCore, walletHandler);
