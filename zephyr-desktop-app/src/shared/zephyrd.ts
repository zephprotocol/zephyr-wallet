import MoneroDaemonRpc from "zephyr-javascript/src/main/js/daemon/MoneroDaemonRpc";
import { connectToDaemonRpc } from "zephyr-javascript/index";
import { IMonerRPCConnection } from ".";

let daemon: MoneroDaemonRpc;

export const createDaemonConnection = async (rpcConnection: IMonerRPCConnection) => {
  try {
    daemon = await connectToDaemonRpc(rpcConnection);
    return true;
  } catch (e) {
    console.error("connectToDaemonRpc:", e);
    return false;
  }
};

export const getLastBlockHeader = () => {
  return daemon.getLastBlockHeader();
};

export const isConnected = () => {
  return daemon.isConnected();
};

// only for local nodes

export const startMining = (params: any) => {
  const threads_count = 1;
  const do_background_mining = true;
  const ignore_battery = false;

  //@ts-ignore
  return daemon.startMining();
};

export const getMiningStatus = () => {
  return daemon.getMiningStatus();
};

export const stopMining = () => {
  return daemon.stopMining();
};

export const getConnections = () => {
  return daemon.getConnections();
};
