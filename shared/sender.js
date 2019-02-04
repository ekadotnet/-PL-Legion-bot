getHelp = async (channel, user, data) => {
  await channel.send(`<@${user}>`, {
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

sendMessage = async (channel, message) => {
  await channel.send(message);
};

module.exports = {
  getHelp: getHelp,
  sendImage: sendImage,
  sendMessage: sendMessage
};
