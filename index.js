const Discord = require("discord.js");
const client = new Discord.Client();

const boop = require("./commands/boop.js");
const utils = require("./commands/utils.js");
const reddit = require("./commands/reddit.js");
const danbooru = require("./commands/danbooru.js");
const sender = require("./shared/sender.js");

const commands = {
  PING: "ping",
  ME: "me",
  BOOP: "boop",
  R: "r",
  MOMO: "momo",
  DANBOORU: "danbooru",
  COMMANDS: "commands",
  HELP: "help"
};

client.on("ready", () => {
  console.log(
    `Bot has started, with ${client.users.size} users, in ${
      client.channels.size
    } channels of ${client.guilds.size} guilds.`
  );
  //client.user.setActivity(`Serving ${client.guilds.size} servers`);
  client.user.setActivity(`Annoying Boopers`);
});

client.on("guildCreate", guild => {
  console.log(
    `New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${
      guild.memberCount
    } members!`
  );
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("error", error => {
  console.log(`${error.name} error occured:\n${error.message}`);
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
    case commands.BOOP: {
      await boop.execute(message, args);
      break;
    }
    case commands.R: {
      await reddit.getImage(message, args);
      break;
    }
    case commands.DANBOORU: {
      await danbooru.getMomo(message, args);
      break;
    }
    case commands.DANBOORU: {
      await danbooru.getImage(message, args);
      break;
    }
    case commands.COMMANDS:
    case commands.HELP: {
      await utils.help(message, args);
      break;
    }
    default: {
      let msg = `Unknown command !${command}. Try !help or !commands to get more info.`;
      await sender.sendMessage(message.chanel, msg);
    }
  }
});

client.login(process.env.TOKEN);
