const sender = require("../shared/sender.js");
const handler = require("../shared/logger.js");
const {
  pingDescription,
  meDescription,
  helpDescription
} = require("./constants.js");

const ping = async (message, args, client) => {
  let user = message.author.id;

  if (args[0] === "help") {
    await sender.getHelp(message.channel, user, pingDescription);
  } else {
    let m = await sender.sendMessage(message.channel, "Ping?");
    m.edit(
      `<@${user}>\nPong!\nYour Latency: ${m.createdTimestamp -
        message.createdTimestamp}ms.\nAPI Latency: ${Math.round(client.ping)}ms`
    ).then(
      () => {
        handler.onResolved(ping, { guild: message.guild.name });
      },
      reason => {
        return handler.onRejected(reason, ping);
      }
    );
  }
};

const me = async (message, args) => {
  if (args[0] === "help") {
    await sender.getHelp(message.channel, message.author.id, meDescription);
  } else {
    let activity = args.join(" ");

    if (activity === "" || activity === null) {
      let msg = `<@${message.author.id}> is too dumb to pass me arguments :(`;
      await sender.sendMessage(message.channel, msg);
    } else {
      let msg = `<@${message.author.id}> *is ${activity}*`;
      await sender.sendMessage(message.channel, msg);
    }
  }
};

const help = async message => {
  await sender.getHelp(message.channel, message.author.id, helpDescription);
};

module.exports = {
  ping: ping,
  me: me,
  help: help
};
