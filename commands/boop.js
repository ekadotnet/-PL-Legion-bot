execute = async message => {
  const boop = "188416390330318848";
  await message.channel.send(`<@${boop}> >:(`);
};

module.exports = {
  execute: execute
};
