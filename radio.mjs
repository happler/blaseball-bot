import EventSource from "eventsource";
import ChannelSubscription from "./channel_subscription.mjs";

class Radio {
  constructor(client) {
    this.eventSource;
    this.client = client;
    this.subscriptions = [];
  }

  addSubscription = (teamName, channel, duration) => {
    this.subscriptions.push(
      new ChannelSubscription(teamName, channel, duration)
    );
    if (!this.eventSource) {
      console.log("attempting to establish connection");
      this.eventSource = this.establishConnection();
      console.log(`Connection Established: ${!!this.eventSource}`);
      this.eventDataListener(this.eventSource);
    }
  };

  eventDataListener = (eventSource) => {
    console.log("setting data listener");
    eventSource.on("streamData", (data) => {
      console.log("incoming data!");
      const activeSubscriptions = [];
      this.subscriptions.forEach((subscription) => {
        subscription.sendGameUpdates(data);
        if (subscription.active()) {
          activeSubscriptions.push(subscription);
        }
      });
      if (activeSubscriptions.length === 0) {
        console.log("no active subscriptions, closing");
        this.eventSource.close();
        console.log(`Connection Established: ${!!this.eventSource}`);
      } else {
        this.subscriptions = activeSubscriptions;
      }
    });
  };

  establishConnection = () => {
    const eventSource = new EventSource(
      "https://www.blaseball.com/events/streamData",
      {
        initialRetryDelayMillis: 2000,
        maxBackoffMillis: 5000,
        errorFilter: function errorFilter() {
          return true;
        },
      }
    );
    this.setEventListeners(eventSource);
    return eventSource;
  };

  setEventListeners = (eventSource) => {
    eventSource.on("error", (evt) => {
      console.log(`${evt.type}: ${evt.message}`);
    });

    eventSource.on("retrying", (evt) => {
      console.log(`${evt.type}`);
    });
  };
}
export default Radio;
