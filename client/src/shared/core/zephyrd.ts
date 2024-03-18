import MoneroDaemonRpc from "zephyr-javascript/src/main/js/daemon/MoneroDaemonRpc";
import { connectToDaemonRpc } from "zephyr-javascript/index";
import { IMonerRPCConnection } from "typings";

let daemon: MoneroDaemonRpc;

export const createDaemonConnection = async (rpcConnection: IMonerRPCConnection) => {
  daemon = await connectToDaemonRpc(rpcConnection);
  return true;
};

export const getLastBlockHeader = () => {
  return daemon.getLastBlockHeader();
};

export const isConnected = () => {
  if (daemon) {
    return daemon.isConnected();
  }
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
