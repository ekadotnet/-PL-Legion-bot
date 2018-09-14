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
          { name: `Examples:`, value: `!me watching anime` }
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

say = async (message, args) => {
  if (args[0] === "help") {
    let user = message.author.id;

    await message.channel.send(`<@${user}>`, {
      embed: {
        title: `!say`,
        description: `Command will make bot say whatever you want`,
        fields: [
          { name: `Usage:`, value: `!say [text]` },
          { name: `Optional parameters:`, value: `none` },
          { name: `Examples:`, value: `!say Kiana best girl` }
        ]
      }
    });
  } else {
    const say = args.join(" ");
    message.delete().catch(O_o => {});
    if (say === "" || say === null) {
      await message.channel.send(`What am I supposed to say? >:(`);
    } else {
      await message.channel.send(say);
    }
  }
};

help = async (message, args) => {
  let user = message.author.id;

  await message.channel.send(`<@${user}>`, {
    embed: {
      title: `Who am I?`,
      description: `Simple, lewd oriented bot for [PL]Legion armada`,
      fields: [
        {
          name: `Available commands:`,
          value: `**!ping !me !say !boop !r !momo !commands !help**\nTo get more specific info:\n**!command help** (for example: **!r help**)`
        },
        { name: `Author:`, value: `EnjoyTheNoise#2702` }
      ]
    }
  });
};

module.exports = {
  ping: ping,
  me: me,
  say: say,
  help: help
};
