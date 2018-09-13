ping = async (message, args) => {
  if (args[0] === "help") {
    let user = message.author.id;

    await message.channel.send(`<@${user}>`, {
      embed: {
        title: `!ping`,
        description: `Command will measue user's ping`,
        fields: [
          { name: `Usage:`, value: `!ping` },
          { name: `Optional parameters:`, value: `none` },
          { name: `Examples`, value: `!ping` }
        ]
      }
    });
  } else {
    const m = await message.channel.send("Ping?");
    m.edit(
      `Pong! Latency is ${m.createdTimestamp -
        message.createdTimestamp}ms. Latency is ${Math.round(client.ping)}ms`
    );
  }
};

me = async (message, args, user) => {
  if (args[0] === "help") {
    let user = message.author.id;

    await message.channel.send(`<@${user}>`, {
      embed: {
        title: `!me`,
        description: `Displays user's current activity or the one given by user`,
        fields: [
          { name: `Usage:`, value: `!me [activity]` },
          { name: `Optional parameters:`, value: `none` },
          { name: `Examples`, value: `!me watching anime` }
        ]
      }
    });
  } else {
    const activity = args.join(" ");
    let username = message.author.username;

    if (activity === "" || activity === null) {
      await message.channel.send(
        `${username} is too dumb to pass me arguments :(`
      );
    } else {
      await message.channel.send(`${username} *is ${activity}*`);
    }
  }
};

module.exports = {
  ping: ping,
  me: me
};
