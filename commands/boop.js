const sender = require("../shared/sender.js");

const boopDescription = {
  title: `!boop`,
  description: `This command only usage is to annoy Boop >:)`
};

const boop = "188416390330318848";

const execute = async (message, args) => {
  if (args[0] === "help") {
    await sender.getHelp(message.channel, message.author.id, boopDescription);
  } else {
    let message = `<@${boop}> >:(`;
    await sender.sendMessage(message.channel, message);
  }
};

module.exports = {
  execute: execute
};
