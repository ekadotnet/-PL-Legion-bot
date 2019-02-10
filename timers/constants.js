module.exports = {
  timersDescription: {
    title: `\`timers`,
    description: `Timers for abyss and open world`,
    fields: [
      {
        name: `Usage:`,
        value: `\`timers start`
      },
      {
        name: `Optional parameters:`,
        value: `none`
      },
      {
        name: `Examples:`,
        value: `timers start`
      },
      {
        name: `**Important:**`,
        value: `User can subscribe to timer by executing command **\`timers subscribe**`
      }
    ]
  },
  commandType: {
    START: "start",
    STOP: "stop",
    SUBSCRIBE: "subscribe",
    HELP: "help"
  },

  daysOfWeek: {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 0
  },

  ABYSS_OPEN_TIME: 15,
  ABYSS_CLOSE_TIME: 22,
  ABYSS_CALC_OFFSET: 33,
  ABYSS_REMIND_OFFSET: 1,

  OPEN_WORLD_CLOSE_TIME: 3,
  OPEN_WORLD_RESET_TIME: 4,
  OPEN_WORLD_LOCK_TIME: 60,

  REFRESH_RATE: 30000,

  SUBSCRIBER_ROLE: "Remind me",
  SUBSCRIBER_MSG: "abyss is ending!"
};
