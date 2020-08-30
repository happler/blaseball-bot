import { default as Socket } from "socket.io-client";
import ChannelSubscription from "./channel_subscription.mjs";

class Radio {
  constructor(client) {
    this.client = client;
    this.socket = Socket("https://blaseball.com", { reconnectionAttempts: 50 });
    this.subscriptions = [];
    this.socketConnectListener(this.socket);
    this.socketDisconnectListener(this.socket);
    this.socketDataListener(this.socket);
  }

  addSubscription = (teamName, channel, duration) => {
    this.subscriptions.push(
      new ChannelSubscription(teamName, channel, duration)
    );
    console.log(`current subscriptions are ${this.subscriptions}`);
    if (this.socket.disconnected) {
      this.socket.connect;
    }
  };

  socketConnectListener = (socket) => {
    socket.on("connect", () => {
      console.log("> connected");
    });
  };

  socketDisconnectListener = (socket) => {
    socket.on("disconnect", (reason) => {
      console.log(`> disconnected (${reason})`);
    });
  };

  socketDataListener = (socket) => {
    const activeSubscriptions = [];
    socket.on("gameDataUpdate", (data) => {
      this.subscriptions.forEach((subscription) => {
        subscription.sendGameUpdates(data);
        if (subscription.active()) {
          activeSubscriptions.push(subscription);
        }
      });
    });
    if (activeSubscriptions.length === 0) {
      this.socket.close;
    } else {
      this.subscriptions = activeSubscriptions;
    }
  };
}
export default Radio;
