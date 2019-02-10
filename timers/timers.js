const moment = require("moment");
const sender = require("../commands/shared/sender");
const {
  commandType,
  daysOfWeek,
  timersDescription,
  ABYSS_OPEN_TIME,
  ABYSS_CLOSE_TIME,
  ABYSS_CALC_OFFSET,
  ABYSS_REMIND_OFFSET,
  OPEN_WORLD_CLOSE_TIME,
  OPEN_WORLD_RESET_TIME,
  OPEN_WORLD_LOCK_TIME,
  SUBSCRIBER_ROLE,
  SUBSCRIBER_MSG,
  REFRESH_RATE
} = require("./constants.js");

var isRunning = false;
var reminderSent = false;
var guild;
var channel;

const handleCommand = async (message, args, permissions) => {
  switch (args[0]) {
    case commandType.START: {
      if (!message.member.hasPermission(permissions.FLAGS.ADMINISTRATOR)) {
        return;
      }
      guild = message.guild;
      channel = message.channel;
      init(message, permissions).then(() => start(message));
      break;
    }
    case commandType.STOP: {
      if (!message.member.hasPermission(permissions.FLAGS.ADMINISTRATOR)) {
        return;
      }
      stop();
      break;
    }
    case commandType.SUBSCRIBE: {
      await addSubscriber(message);
      break;
    }
    case commandType.HELP: {
      await sender.getHelp(
        message.channel,
        message.author.id,
        timersDescription
      );
    }
  }
};

const init = (message, permissions) => {
  var server = message.guild;

  return server.createChannel("Abyss", "category").then(category => {
    server
      .createChannel("Abyss", "voice", [
        {
          id: server.id,
          denied: permissions.ALL
        }
      ])
      .then(channel => {
        channel.setParent(category).then(() => {
          server.createChannel("Open World", "category").then(category => {
            server
              .createChannel("Round", "voice", [
                {
                  id: server.id,
                  denied: permissions.ALL
                }
              ])
              .then(channel => {
                channel.setParent(category);
                server.createRole({
                  name: SUBSCRIBER_ROLE,
                  mentionable: true
                });
              });
          });
        });
      });
  });
};

const addSubscriber = async message => {
  let role = message.guild.roles.find(r => r.name === SUBSCRIBER_ROLE);
  let member = message.member;
  let msg = `<@${message.author.id}> succesfuly subscribed to timers`;

  member.addRole(role);
  await sender.sendMessage(channel, msg);
};

const start = message => {
  isRunning = true;

  var interval = setInterval(() => {
    if (isRunning) {
      let abyssCategory = message.guild.channels.find(channel =>
        channel.name.startsWith("Abyss")
      );
      abyssCategory.children.forEach(channel =>
        channel.setName(setAbyssStatus())
      );

      let openWorldCategory = message.guild.channels.find(channel =>
        channel.name.startsWith("Open")
      );
      openWorldCategory.children.forEach(channel =>
        channel.setName(setOpenWorldStatus())
      );
    } else {
      clearInterval(interval);
    }
  }, REFRESH_RATE);
};

const stop = () => {
  isRunning = false;
};

const getNextDayOfWeek = (date, dayOfWeek, offset, minutesOffset = 0) => {
  let resultDate = date.clone();

  resultDate.date(date.date() + ((7 + dayOfWeek - date.day()) % 7));
  resultDate
    .hours(offset)
    .minutes(minutesOffset)
    .seconds(0);

  return resultDate;
};

const remindSubscribers = () => {
  let role = guild.roles.find(r => r.name === SUBSCRIBER_ROLE);

  sender.sendRoleMention(channel, role, SUBSCRIBER_MSG);
};

const resetRemindStatus = () => {
  reminderSent = false;
};

const getOngoingAbyssStatus = duration => {
  return `🔥❗❗ Ongoing ${duration}`;
};

const getPreparingAbyssStatus = duration => {
  return `🔥💤 Preparing ${duration}`;
};

const getCalculatingAbyssStatus = duration => {
  return `🔥⏳ Calculating ${duration}`;
};

const getDuration = (now, dayOfWeek, offset, minutesOffset = 0) => {
  let then = getNextDayOfWeek(now, dayOfWeek, offset, minutesOffset);

  let difference = then.diff(now);
  let duration = moment.duration(difference);
  let remaining =
    Math.floor(duration.asHours()) + moment.utc(difference).format(":mm");

  let dateParts = remaining.split(":");

  return `${dateParts[0]}h ${dateParts[1]}m`;
};

const setAbyssStatus = () => {
  let dateNow = moment();
  let currentDay = dateNow.day();

  switch (currentDay) {
    case daysOfWeek.MONDAY: {
      let duration = getDuration(dateNow, daysOfWeek.TUESDAY, ABYSS_OPEN_TIME);
      return getPreparingAbyssStatus(duration);
    }
    case daysOfWeek.TUESDAY: {
      if (dateNow.hour() <= ABYSS_OPEN_TIME) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.TUESDAY,
          ABYSS_OPEN_TIME
        );
        return getPreparingAbyssStatus(duration);
      } else {
        let duration = getDuration(
          dateNow,
          daysOfWeek.THURSDAY,
          ABYSS_CLOSE_TIME
        );
        return getOngoingAbyssStatus(duration);
      }
    }
    case daysOfWeek.WEDNESDAY: {
      let duration = getDuration(
        dateNow,
        daysOfWeek.THURSDAY,
        ABYSS_CLOSE_TIME
      );
      return getOngoingAbyssStatus(duration);
    }
    case daysOfWeek.THURSDAY: {
      if (dateNow.hour() < ABYSS_CLOSE_TIME) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.THURSDAY,
          ABYSS_CLOSE_TIME
        );
        if (
          dateNow.hour() == ABYSS_CLOSE_TIME - ABYSS_REMIND_OFFSET &&
          !reminderSent
        ) {
          reminderSent = true;
          remindSubscribers();
        }
        return getOngoingAbyssStatus(duration);
      } else if (
        dateNow.hour() == ABYSS_CLOSE_TIME &&
        dateNow.minutes() < ABYSS_CALC_OFFSET
      ) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.THURSDAY,
          ABYSS_CLOSE_TIME,
          ABYSS_CALC_OFFSET
        );
        resetRemindStatus();
        return getCalculatingAbyssStatus(duration);
      } else {
        let duration = getDuration(dateNow, daysOfWeek.FRIDAY, ABYSS_OPEN_TIME);
        return getPreparingAbyssStatus(duration);
      }
    }
    case daysOfWeek.FRIDAY: {
      if (dateNow.hour() <= ABYSS_OPEN_TIME) {
        let duration = getDuration(dateNow, daysOfWeek.FRIDAY, ABYSS_OPEN_TIME);
        return getPreparingAbyssStatus(duration);
      } else {
        let duration = getDuration(
          dateNow,
          daysOfWeek.SUNDAY,
          ABYSS_CLOSE_TIME
        );
        return getOngoingAbyssStatus(duration);
      }
    }
    case daysOfWeek.SATURDAY: {
      let duration = getDuration(dateNow, daysOfWeek.SUNDAY, ABYSS_CLOSE_TIME);
      return getOngoingAbyssStatus(duration);
    }
    case daysOfWeek.SUNDAY: {
      if (dateNow.hour() < ABYSS_CLOSE_TIME) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.SUNDAY,
          ABYSS_CLOSE_TIME
        );
        if (
          dateNow.hour() == ABYSS_CLOSE_TIME - ABYSS_REMIND_OFFSET &&
          !reminderSent
        ) {
          reminderSent = true;
          remindSubscribers();
        }
        return getOngoingAbyssStatus(duration);
      } else if (
        dateNow.hour() == ABYSS_CLOSE_TIME &&
        dateNow.minutes() < ABYSS_CALC_OFFSET
      ) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.SUNDAY,
          ABYSS_CLOSE_TIME,
          ABYSS_CALC_OFFSET
        );
        resetRemindStatus();
        return getCalculatingAbyssStatus(duration);
      } else {
        let duration = getDuration(
          dateNow,
          daysOfWeek.TUESDAY,
          ABYSS_OPEN_TIME
        );
        return getPreparingAbyssStatus(duration);
      }
    }
  }
};

const getOngoingWorldStatus = duration => {
  return `🌏❗❗ Ongoing ${duration}`;
};

const getLockedWorldStatus = duration => {
  return `🌏🔒 Locked ${duration}`;
};

const setOpenWorldStatus = () => {
  let dateNow = moment();
  let currentDay = dateNow.day();

  switch (currentDay) {
    case daysOfWeek.MONDAY: {
      if (dateNow.hour() < OPEN_WORLD_CLOSE_TIME) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.MONDAY,
          OPEN_WORLD_CLOSE_TIME
        );
        return getOngoingWorldStatus(duration);
      } else if (
        dateNow.hour() >= OPEN_WORLD_CLOSE_TIME &&
        dateNow.hour() <= OPEN_WORLD_RESET_TIME
      ) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.MONDAY,
          OPEN_WORLD_CLOSE_TIME,
          OPEN_WORLD_LOCK_TIME
        );
        return getLockedWorldStatus(duration);
      } else {
        let duration = getDuration(
          dateNow,
          daysOfWeek.THURSDAY,
          OPEN_WORLD_CLOSE_TIME
        );
        return getOngoingWorldStatus(duration);
      }
    }
    case daysOfWeek.TUESDAY: {
      let duration = getDuration(
        dateNow,
        daysOfWeek.THURSDAY,
        OPEN_WORLD_CLOSE_TIME
      );
      return getOngoingWorldStatus(duration);
    }
    case daysOfWeek.WEDNESDAY: {
      let duration = getDuration(
        dateNow,
        daysOfWeek.THURSDAY,
        OPEN_WORLD_CLOSE_TIME
      );
      return getOngoingWorldStatus(duration);
    }
    case daysOfWeek.THURSDAY: {
      if (dateNow.hour() < OPEN_WORLD_CLOSE_TIME) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.THURSDAY,
          OPEN_WORLD_CLOSE_TIME
        );
        return getOngoingWorldStatus(duration);
      } else if (
        dateNow.hour() >= OPEN_WORLD_CLOSE_TIME &&
        dateNow.hour() <= OPEN_WORLD_RESET_TIME
      ) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.THURSDAY,
          OPEN_WORLD_CLOSE_TIME,
          OPEN_WORLD_LOCK_TIME
        );
        return getLockedWorldStatus(duration);
      } else {
        let duration = getDuration(
          dateNow,
          daysOfWeek.SATURDAY,
          OPEN_WORLD_CLOSE_TIME
        );
        return getOngoingWorldStatus(duration);
      }
    }
    case daysOfWeek.FRIDAY: {
      let duration = getDuration(
        dateNow,
        daysOfWeek.SATURDAY,
        OPEN_WORLD_CLOSE_TIME
      );
      return getOngoingWorldStatus(duration);
    }
    case daysOfWeek.SATURDAY: {
      if (dateNow.hour() < OPEN_WORLD_CLOSE_TIME) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.SATURDAY,
          OPEN_WORLD_CLOSE_TIME
        );
        return getOngoingWorldStatus(duration);
      } else if (
        dateNow.hour() >= OPEN_WORLD_CLOSE_TIME &&
        dateNow.hour() <= OPEN_WORLD_RESET_TIME
      ) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.SATURDAY,
          OPEN_WORLD_CLOSE_TIME,
          OPEN_WORLD_LOCK_TIME
        );
        return getLockedWorldStatus(duration);
      } else {
        let duration = getDuration(
          dateNow,
          daysOfWeek.MONDAY,
          OPEN_WORLD_CLOSE_TIME
        );
        return getOngoingWorldStatus(duration);
      }
    }
    case daysOfWeek.SUNDAY: {
      let duration = getDuration(
        dateNow,
        daysOfWeek.MONDAY,
        OPEN_WORLD_CLOSE_TIME
      );
      return getOngoingWorldStatus(duration);
    }
  }
};

module.exports = {
  handleCommand: handleCommand
};
