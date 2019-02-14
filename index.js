const Discord = require("discord.js");
const client = new Discord.Client();

const utils = require("./commands/utils/utils.js");
const reddit = require("./commands/reddit/reddit.js");
const danbooru = require("./commands/danbooru/danbooru.js");
const handler = require("./commands/shared/logger.js");
const timers = require("./timers/timerHandler.js");

const commands = {
  PING: "ping",
  ME: "me",
  R: "r",
  MOMO: "momo",
  DANBOORU: "danbooru",
  COMMANDS: "commands",
  HELP: "help",
  TIMERS: "timers"
};

client.on("ready", () => {
  handler.log(
    `Bot has started, with ${client.users.size} users, in ${
      client.channels.size
    } channels of ${client.guilds.size} guilds.`
  );
  client.user.setActivity(`Thighs save lives`);
});

client.on("guildCreate", guild => {
  handler.log(
    `New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${
      guild.memberCount
    } members!`
  );
  client.user.setActivity(`Thighs save lives`);
});

client.on("guildDelete", guild => {
  handler.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Thighs save lives`);
});

client.on("error", error => {
  handler.onError(error);
});

client.on("message", async message => {
  if (message.author.bot) return;
  if (message.content.indexOf(process.env.PREFIX) !== 0) return;

  const args = message.content
    .slice(process.env.PREFIX.length)
    .trim()
    .split(/ +/g); //KIANA BEST GIRL
  const command = args.shift().toLowerCase();

  switch (command) {
    case commands.PING: {
      await utils.ping(message, args, client);
      break;
    }
    case commands.ME: {
      await utils.me(message, args);
      break;
    }
    case commands.R: {
      await reddit.getImage(message, args);
      break;
    }
    case commands.MOMO: {
      await danbooru.getMomo(message, args);
      break;
    }
    case commands.DANBOORU: {
      await danbooru.getImage(message, args);
      break;
    }
    case commands.TIMERS: {
      await timers.handleCommand(message, args, Discord.Permissions);
      break;
    }
    case commands.COMMANDS:
    case commands.HELP: {
      await utils.help(message, args);
      break;
    }
  }
});

client.login(process.env.TOKEN);
