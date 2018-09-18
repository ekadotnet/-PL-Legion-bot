const helper = require("../shared/helper.js");

execute = async (message, args) => {
  if (args[0] === "help") {
    let user = message.author.id;
    const helpData = {
      title: `!boop`,
      description: `This command only usage is to annoy Boop >:)`
    };
    await helper.getHelp(message, user, helpData);
  } else {
    const boop = "188416390330318848";
    await message.channel.send(`<@${boop}> >:(`);
  }
};

module.exports = {
  execute: execute
};
