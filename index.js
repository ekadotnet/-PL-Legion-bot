const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

const boop = require("./commands/boop.js");
const utils = require("./commands/utils.js");
const reddit = require("./commands/reddit.js");
const danbooru = require("./commands/danbooru.js");

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

client.on("message", async message => {
  if (message.author.bot) return;
  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g); //KIANA BEST GIRL
  const command = args.shift().toLowerCase();

  switch (command) {
    case "ping": {
      await utils.ping(message, args, client);
      break;
    }
    case "me": {
      await utils.me(message, args);
      break;
    }
    case "say": {
      await utils.say(message, args);
      break;
    }
    case "boop": {
      await boop.execute(message, args);
      break;
    }
    case "r": {
      await reddit.getImage(message, args);
      break;
    }
    case "momo": {
      await danbooru.getMomo(message, args);
      break;
    }
    case "commands":
    case "help": {
      await utils.help(message, args);
      break;
    }
    default:
      await message.channel.send(`Unknown command !${command}. Try !help or !commands to get more info.`)
  }
});

client.login(config.token);
