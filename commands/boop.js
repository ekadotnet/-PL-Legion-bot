execute = async (message, args) => {
  if (args[0] === "help") {
    let user = message.author.id;

    await message.channel.send(`<@${user}>`, {
      embed: {
        title: `!boop`,
        description: `this command only usage is to annoy Boop >:)`
      }
    });
  } else {
    const boop = "188416390330318848";
    await message.channel.send(`<@${boop}> >:(`);
  }
};

module.exports = {
  execute: execute
};
