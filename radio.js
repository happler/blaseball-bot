import { default as Socket } from "socket.io-client";
import ChannelSubscription from "./channel_subscription";

class Radio {
  constructor(client) {
    this.client = client;
    this.socket = Socket("https://blaseball.com", { reconnectionAttempts: 50 });
    this.subscriptions = [];
  }

  addSubscription = (teamName, channel) => {
    this.subscriptions.push(new ChannelSubscription(teamName, channel));
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
    this.subscriptions = activeSubscriptions;
  };
}
export default Radio;
