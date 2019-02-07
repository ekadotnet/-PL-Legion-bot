const moment = require("moment");
const {
  commandType,
  daysOfWeek,
  ABYSS_OPEN_TIME,
  ABYSS_CLOSE_TIME,
  ABYSS_CALC_OFFSET,
  OPEN_WORLD_CLOSE_TIME,
  OPEN_WORLD_RESET_TIME,
  OPEN_WORLD_LOCK_TIME,
  REFRESH_RATE
} = require("./constants.js");

var isRunning = false;

const handleCommand = (message, args, permissions) => {
  switch (args[0]) {
    case commandType.START: {
      init(message, permissions).then(() => start(message));
    }
    case commandType.STOP: {
      stop();
    }
  }
};

const init = (message, permissions) => {
  var server = message.guild;

  return server.createChannel("Abyss", "category").then(category => {
    server
      .createChannel("Abyss", "text", [
        {
          id: server.id,
          denied: permissions.ALL
        }
      ])
      .then(channel => {
        channel.setParent(category).then(() => {
          server.createChannel("Open World", "category").then(category => {
            server
              .createChannel("Round", "text", [
                {
                  id: server.id,
                  denied: permissions.ALL
                }
              ])
              .then(channel => {
                channel.setParent(category);
              });
          });
        });
      });
  });
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
  }, 3000);
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
      return `🔥💤 Preparing ${duration}`;
    }
    case daysOfWeek.TUESDAY: {
      if (dateNow.hour() <= ABYSS_OPEN_TIME) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.TUESDAY,
          ABYSS_OPEN_TIME
        );
        return `🔥💤 Preparing ${duration}`;
      } else {
        let duration = getDuration(
          dateNow,
          daysOfWeek.THURSDAY,
          ABYSS_CLOSE_TIME
        );
        return `🔥❗❗ Ongoing ${duration}`;
      }
    }
    case daysOfWeek.WEDNESDAY: {
      let duration = getDuration(
        dateNow,
        daysOfWeek.THURSDAY,
        ABYSS_CLOSE_TIME
      );
      return `🔥❗❗ Ongoing ${duration}`;
    }
    case daysOfWeek.THURSDAY: {
      if (dateNow.hour() < ABYSS_CLOSE_TIME) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.THURSDAY,
          ABYSS_CLOSE_TIME
        );
        return `🔥❗❗ Ongoing ${duration}`;
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
        return `🔥⏳ Calculating ${duration}`;
      } else {
        let duration = getDuration(dateNow, daysOfWeek.FRIDAY, ABYSS_OPEN_TIME);
        return `🔥💤 Preparing ${duration}`;
      }
    }
    case daysOfWeek.FRIDAY: {
      if (dateNow.hour() <= ABYSS_OPEN_TIME) {
        let duration = getDuration(dateNow, daysOfWeek.FRIDAY, ABYSS_OPEN_TIME);
        return `🔥💤 Preparing ${duration}`;
      } else {
        let duration = getDuration(
          dateNow,
          daysOfWeek.SUNDAY,
          ABYSS_CLOSE_TIME
        );
        return `🔥❗❗ Ongoing ${duration}`;
      }
    }
    case daysOfWeek.SATURDAY: {
      let duration = getDuration(dateNow, daysOfWeek.SUNDAY, ABYSS_CLOSE_TIME);
      return `🔥❗❗ Ongoing ${duration}`;
    }
    case daysOfWeek.SUNDAY: {
      if (dateNow.hour() < 22) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.SUNDAY,
          ABYSS_CLOSE_TIME
        );
        return `🔥❗❗ Ongoing ${duration}`;
      } else if (
        dateNow.hour() == 22 &&
        dateNow.minutes() < ABYSS_CALC_OFFSET
      ) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.SUNDAY,
          ABYSS_CLOSE_TIME,
          ABYSS_CALC_OFFSET
        );
        return `🔥⏳ Calculating ${duration}`;
      } else {
        let duration = getDuration(
          dateNow,
          daysOfWeek.TUESDAY,
          ABYSS_OPEN_TIME
        );
        return `🔥💤 Preparing ${duration}`;
      }
    }
  }
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
        return `🌏❗❗ Ongoing ${duration}`;
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
        return `🌏🔒 Locked ${duration}`;
      } else {
        let duration = getDuration(
          dateNow,
          daysOfWeek.THURSDAY,
          OPEN_WORLD_CLOSE_TIME
        );
        return `🌏❗❗ Ongoing ${duration}`;
      }
    }
    case daysOfWeek.TUESDAY: {
      let duration = getDuration(
        dateNow,
        daysOfWeek.THURSDAY,
        OPEN_WORLD_CLOSE_TIME
      );
      return `🌏❗❗ Ongoing ${duration}`;
    }
    case daysOfWeek.WEDNESDAY: {
      let duration = getDuration(
        dateNow,
        daysOfWeek.THURSDAY,
        OPEN_WORLD_CLOSE_TIME
      );
      return `🌏❗❗ Ongoing ${duration}`;
    }
    case daysOfWeek.THURSDAY: {
      if (dateNow.hour() < OPEN_WORLD_CLOSE_TIME) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.THURSDAY,
          OPEN_WORLD_CLOSE_TIME
        );
        return `🌏❗❗ Ongoing ${duration}`;
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
        return `🌏🔒 Locked ${duration}`;
      } else {
        let duration = getDuration(
          dateNow,
          daysOfWeek.SATURDAY,
          OPEN_WORLD_CLOSE_TIME
        );
        return `🌏❗❗ Ongoing ${duration}`;
      }
    }
    case daysOfWeek.FRIDAY: {
      let duration = getDuration(
        dateNow,
        daysOfWeek.SATURDAY,
        OPEN_WORLD_CLOSE_TIME
      );
      return `🌏❗❗ Ongoing ${duration}`;
    }
    case daysOfWeek.SATURDAY: {
      if (dateNow.hour() < OPEN_WORLD_CLOSE_TIME) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.SATURDAY,
          OPEN_WORLD_CLOSE_TIME
        );
        return `🌏❗❗ Ongoing ${duration}`;
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
        return `🌏🔒 Locked ${duration}`;
      } else {
        let duration = getDuration(
          dateNow,
          daysOfWeek.MONDAY,
          OPEN_WORLD_CLOSE_TIME
        );
        return `🌏❗❗ Ongoing ${duration}`;
      }
    }
    case daysOfWeek.SUNDAY: {
      let duration = getDuration(
        dateNow,
        daysOfWeek.MONDAY,
        OPEN_WORLD_CLOSE_TIME
      );
      return `🌏❗❗ Ongoing ${duration}`;
    }
  }
};

module.exports = {
  handleCommand: handleCommand
};
