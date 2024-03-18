import { NodeLocation, SelectedNode, RemoteNode } from "platforms/desktop/types";
import { NodeOption, NodeSelectionType } from "platforms/desktop/pages/_wallet/settings/node/nodeSetting";

export const createNodeOptions = (zephyrdState: SelectedNode, remoteList: RemoteNode[]): NodeOption[] => {
  const remoteNodes: NodeOption[] = remoteList.map((node) => {
    return {
      location: NodeLocation.Remote,
      address: node.address!,
      port: node.port!,
      trusted: true,
      provider: node.provider,
      name: `Remote Node (${node.provider})`,
      selectionType: NodeSelectionType.remote,
    };
  });

  // const localNode: NodeOption = {
  //   location: NodeLocation.Local,
  //   address: "",
  //   port: "",
  //   trusted: true,
  //   name: "Local Node",
  //   selectionType: NodeSelectionType.local,
  // };

  const customNode: NodeOption = isCustomNode(zephyrdState, remoteList)
    ? {
        location: NodeLocation.Remote,
        address: zephyrdState.address!,
        port: zephyrdState.port!,
        name: createCustomNodeName(zephyrdState),
        selectionType: NodeSelectionType.custom,
        trusted: false,
      }
    : {
        location: NodeLocation.Remote,
        address: "",
        port: "",
        name: "Custom Node",
        selectionType: NodeSelectionType.custom,
        trusted: false,
      };

  //quick check to omit local node option for macOS for first
  if (window.zephyrProcess.platform === "darwin") {
    return [...remoteNodes, customNode];
  }

  // omit local node for windows as well for now
  return [...remoteNodes, customNode];
};

const createCustomNodeName = (zephyrdState: SelectedNode) => {
  try {
    return `Custom Node ( ${new URL(zephyrdState.address!).host} )`;
  } catch (e) {
    return "Custom Node";
  }
};

const isCustomNode = (zephyrdState: SelectedNode, remoteList: RemoteNode[]): boolean => {
  return (
    zephyrdState.location === NodeLocation.Remote &&
    !remoteList.some((remoteNode) => remoteNode.address === zephyrdState.address)
  );
};

export const getDefaultNode = (nodeList: RemoteNode[]): NodeOption => {
  const node: RemoteNode = nodeList.find((node) => !!node.default)!;

  return {
    location: NodeLocation.Remote,
    address: node.address!,
    port: node.port!,
    trusted: true,
    name: `Remote Node (${node.provider})`,
    selectionType: NodeSelectionType.remote,
  };
};
