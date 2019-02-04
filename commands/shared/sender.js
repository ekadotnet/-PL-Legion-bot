const getHelp = async (channel, user, data) => {
  await channel.send(`<@${user}>`, {
    embed: {
      title: data.title,
      description: data.description,
      fields: data.fields || ""
    }
  });
};

const sendImage = async (channel, user, data) => {
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

const sendMessage = async (channel, message) => {
  return await channel.send(message);
};

module.exports = {
  getHelp: getHelp,
  sendImage: sendImage,
  sendMessage: sendMessage
};
