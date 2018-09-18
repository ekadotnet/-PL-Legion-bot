getHelp = async (message, user, data) => {
  await message.channel.send(`<@${user}>`, {
    embed: {
      title: data.title,
      description: data.description,
      fields: data.fields || ""
    }
  });
};

sendImage = async (channel, user, data) => {
  await channel.send(`<@${user}>`, {
    embed: {
      title: data.title,
      description: data.description,
      image: {
        url: data.url
      }
    }
  });
};

module.exports = {
  getHelp: getHelp,
  sendImage: sendImage
};
