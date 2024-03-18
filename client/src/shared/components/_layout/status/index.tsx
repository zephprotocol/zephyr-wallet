// Library Imports
// Relative Imports
import { Container, Content, TimerBar } from "./styles";
import { getNotification, ZephyrNotification } from "shared/reducers/notification";
import { DesktopAppState } from "platforms/desktop/reducers";
import { WebAppState } from "platforms/web/reducers";
import { connect } from "react-redux";
import React from "react";

interface StatusProps {
  notifications: ZephyrNotification[];
}

class Status extends React.Component<StatusProps, any> {
  render() {
    if (!this.props.notifications) return null;
    return this.props.notifications.map((notification, index) => (
      <Container count={index} key={notification.id}>
        <Content type={notification.type}>
          {notification.message}
          <TimerBar duration={notification.duration}></TimerBar>
        </Content>
      </Container>
    ));
  }
}

const mapStateToProps = (state: DesktopAppState | WebAppState) => ({
  notifications: getNotification(state),
});

export const StatusComponent = connect(mapStateToProps)(Status);
