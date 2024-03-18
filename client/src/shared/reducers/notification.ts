import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from "../actions/types";
import { AnyAction } from "redux";
import { DesktopAppState } from "platforms/desktop/reducers";
import { WebAppState } from "platforms/web/reducers";

export enum NotificationDuration {
  STICKY = -1,
  DEFAULT = 3500,
}

export interface ZephyrNotification {
  id: string;
  type: string;
  message: string;
  duration: NotificationDuration;
}

const INITIAL_STATE: { notifications: ZephyrNotification[] } = {
  notifications: [],
};

export default function (state = INITIAL_STATE, action: AnyAction) {
  switch (action.type) {
    case ADD_NOTIFICATION:
      return { notifications: [...state.notifications, action.payload] };
    case REMOVE_NOTIFICATION:
      return {
        //check for matching ids, only return element if the new filtered array doesn't match this one to be removed
        notifications: state.notifications.filter(
          (notification: ZephyrNotification) => notification.id !== action.payload,
        ),
      };
    default:
      return state;
  }
}

export const getNotification = (state: DesktopAppState | WebAppState): ZephyrNotification[] => {
  return state.notification.notifications;
};
