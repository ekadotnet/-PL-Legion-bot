const helper = require("../shared/helper.js");

execute = async (message, args) => {
  if (args[0] === "help") {
    const helpData = {
      title: `!boop`,
      description: `This command only usage is to annoy Boop >:)`
    };
    await helper.getHelp(message.channel, message.author.id, helpData);
  } else {
    const boop = "188416390330318848";
    await message.channel.send(`<@${boop}> >:(`);
  }
};

module.exports = {
  execute: execute
};
