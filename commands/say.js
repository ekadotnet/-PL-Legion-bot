execute = async (message, args) => {
  const say = args.join(" ");
  message.delete().catch(O_o => {});
  if (say === "" || say === null) {
    await message.channel.send(
      "Co mam się kurwa domyśleć co powiedzieć? Daj jakiś tekścior ziomek"
    );
  } else {
    await message.channel.send(say);
  }
};

module.exports = {
  execute: execute
};
