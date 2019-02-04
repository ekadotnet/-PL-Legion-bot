module.exports = {
  pingDescription: {
    title: `!ping`,
    description: `Command will measure user's ping`,
    fields: [
      {
        name: `Usage:`,
        value: `!ping`
      },
      {
        name: `Optional Parameters:`,
        value: `none`
      },
      {
        name: `Examples:`,
        value: `!ping`
      }
    ]
  },
  meDescription: {
    title: `!me`,
    description: `Displays activity given by user`,
    fields: [
      {
        name: `Usage:`,
        value: `!me [activity]`
      },
      {
        name: `Optional Parameters:`,
        value: `none`
      },
      {
        name: `Examples:`,
        value: `!me watching anime`
      }
    ]
  },
  helpDescription: {
    title: `Who am I?`,
    description: `Simple, open source, lewd oriented bot for [PL]Legion armada`,
    fields: [
      {
        name: `Available commands:`,
        value: `**!ping !me !boop !r !momo !danbooru !commands !help**\nTo get more specific info:\n**!command help** (for example: **!r help**)`
      },
      { name: `Author:`, value: `EnjoyTheNoise#2702` },
      { name: `Repository:`, value: `[GitHub](https://github.com/EnjoyTheNoise/-PL-Legion-bot)`}
    ]
  }
};
