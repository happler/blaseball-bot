// Run dotenv
import dotenv from "dotenv";
dotenv.config({ silent: true });
import { default as Radio } from "./radio.mjs";
import Discord from "discord.js";

const client = new Discord.Client();
const radio = new Radio();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (message) => {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  if (message.content.substring(0, 1) == "!") {
    let args = message.content.substring(1).split(" ");
    let cmd = args.shift();
    let potentialDuration = args.pop();
    let duration = parseInt(potentialDuration);

    if (duration) {
      args = args.join(" ");
    } else {
      args.push(potentialDuration);
      args = args.join(" ");
    }

    switch (cmd) {
      // !ping
      case "ping":
        console.log("we've been pinged");
        message.channel.send(
          `ping by ${message.author} in channel ${message.channel}`
        );
        break;
      // !tuneIn
      case "tuneIn":
        console.log(`request for a tune in to ${args}`);
        radio.addSubscription(args, message.channel);
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
