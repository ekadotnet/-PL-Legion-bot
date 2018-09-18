getHelp = async (message, user, data) => {
  await message.channel.send(`<@${user}>`, {
    embed: {
      title: data.title,
      description: data.description,
      fields: data.fields || ""
    }
  });
};

module.exports = {
  getHelp: getHelp
};
