ping = async message => {
  const m = await message.channel.send("Ping?");
  m.edit(
    `Pong! Latency is ${m.createdTimestamp -
      message.createdTimestamp}ms. Latency is ${Math.round(client.ping)}ms`
  );
};

me = async (message, args, user) => {
  const activity = args.join(" ");
  if (activity === "" || activity === null) {
    await message.channel.send(`${user} is too dumb to pass me arguments :(`);
  } else {
    await message.channel.send(`${user} *is ${activity}*`);
  }
};

module.exports = {
  ping: ping,
  me: me
};
