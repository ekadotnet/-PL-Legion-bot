const helper = require("../shared/helper.js");

ping = async (message, args, client) => {
  let user = message.author.id;

  if (args[0] === "help") {
    const helpData = {
      title: `!ping`,
      description: `Command will measure user's ping`,
      fields: [
        {
          name: `Usage:`,
          value: `!ping`
        },
        {
          name: `Optional Parameters:`,
          value: `none`
        },
        {
          name: `Examples:`,
          value: `!ping`
        }
      ]
    };
    await helper.getHelp(message, user, helpData);
  } else {
    const m = await message.channel.send("Ping?");
    m.edit(
      `<@${user}>\nPong!\nYour Latency: ${m.createdTimestamp -
        message.createdTimestamp}ms.\nAPI Latency: ${Math.round(client.ping)}ms`
    );
  }
};

me = async (message, args) => {
  let user = message.author.id;

  if (args[0] === "help") {
    const helpData = {
      title: `!me`,
      description: `Displays activity given by user`,
      fields: [
        {
          name: `Usage:`,
          value: `!me [activity]`
        },
        {
          name: `Optional Parameters:`,
          value: `none`
        },
        {
          name: `Examples:`,
          value: `!me watching anime`
        }
      ]
    };
    await helper.getHelp(message, user, helpData);
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
  let user = message.author.id;

  if (args[0] === "help") {
    const helpData = {
      title: `!say`,
      description: `Command will make bot say whatever you want`,
      fields: [
        {
          name: `Usage:`,
          value: `!say [text]`
        },
        {
          name: `Optional Parameters:`,
          value: `none`
        },
        {
          name: `Examples:`,
          value: `!say Kiana best girl`
        }
      ]
    };
    await helper.getHelp(message, user, helpData);
  } else {
    const say = args.join(" ");
    message.delete().catch(error => console.log(error));
    if (say === "" || say === null) {
      await message.channel.send(`What am I supposed to say? >:(`);
    } else {
      await message.channel.send(say);
    }
  }
};

help = async message => {
  let user = message.author.id;
  const helpData = {
    title: `Who am I?`,
    description: `Simple, lewd oriented bot for [PL]Legion armada`,
    fields: [
      {
        name: `Available commands:`,
        value: `**!ping !me !say !boop !r !momo !danbooru !commands !help**\nTo get more specific info:\n**!command help** (for example: **!r help**)`
      },
      { name: `Author:`, value: `EnjoyTheNoise#2702` }
    ]
  };
  await helper.getHelp(message, user, helpData);
};

module.exports = {
  ping: ping,
  me: me,
  say: say,
  help: help
};
