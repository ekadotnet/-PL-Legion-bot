const sender = require("../shared/sender.js");

const pingDescription = {
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

const meDescription = {
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

const helpDescription = {
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

const ping = async (message, args, client) => {
  let user = message.author.id;

  if (args[0] === "help") {
    await sender.getHelp(message.channel, user, pingDescription);
  } else {
    const m = await sender.sendMessage(message.channel, "Ping?");
    m.edit(
      `<@${user}>\nPong!\nYour Latency: ${m.createdTimestamp -
        message.createdTimestamp}ms.\nAPI Latency: ${Math.round(client.ping)}ms`
    );
  }
};

const me = async (message, args) => {
  if (args[0] === "help") {
    await sender.getHelp(message.channel, message.author.id, meDescription);
  } else {
    let activity = args.join(" ");

    if (activity === "" || activity === null) {
      let message = `${
        message.author.username
      } is too dumb to pass me arguments :(`;
      await sender.sendMessage(message.channel, message);
    } else {
      let message = `${message.author.username} *is ${activity}*`;
      await sender.sendMessage(message.channel, message);
    }
  }
};

help = async message => {
  await sender.getHelp(message.channel, message.author.id, helpDescription);
};

module.exports = {
  ping: ping,
  me: me,
  help: help
};
