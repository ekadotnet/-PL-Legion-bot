execute = async (message, args) => {
  if (args[0] === "help") {
    let user = message.author.id;

    await message.channel.send(`<@${user}>`, {
      embed: {
        title: `!say`,
        description: `Command will make bot say whatever you want`,
        fields: [
          { name: `Usage:`, value: `!say [text]` },
          { name: `Optional parameters:`, value: `none` },
          { name: `Examples`, value: `!say Kiana best girl` }
        ]
      }
    });
  } else {
    const say = args.join(" ");
    message.delete().catch(O_o => {});
    if (say === "" || say === null) {
      await message.channel.send(
        "Co mam się kurwa domyśleć co powiedzieć? Daj jakiś tekścior ziomek"
      );
    } else {
      await message.channel.send(say);
    }
  }
};

module.exports = {
  execute: execute
};
