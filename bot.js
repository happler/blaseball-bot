// Run dotenv
require("dotenv").config();

import ChannelSubscription from "channel_subscription.js";
import Radio from "./radio";

const Discord = require("discord.js");
const client = new Discord.Client();
const radio = new Radio();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (message) => {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  if (message.substring(0, 1) == "!") {
    let args = message.substring(1).split(" ");
    let cmd = args.shift();

    switch (cmd) {
      // !ping
      case "ping":
        message.channel.send(
          `ping by ${message.author} in channel ${message.channel}`
        );
        break;
      // !tuneIn
      case "tuneIn":
        radio.addSubscription(args[0], message.channel);
        break;
      // Just add any case commands if you want to..
    }
  }
});

process.on("SIGINT", () => {
  radio.socket.close();
  process.exit();
});

client.login(process.env.DISCORD_TOKEN);
