const moment = require("moment");

var isRunning = false;

const handleCommand = (message, args, permissions) => {
  switch (args[0]) {
    case "start": {
      init(message, permissions).then(() => start(message));
    }
    case "stop": {
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
        channel.setParent(category);

        /* second timer for Samsara, WIP */

        // server
        //   .createChannel("World: ", "text", [
        //     {
        //       id: server.id,
        //       denied: permissions.ALL
        //     }
        //   ])
        //   .then(channel => {
        //     return channel.setParent(category);
        //   });
      });
  });
};

const start = message => {
  isRunning = true;

  var interval = setInterval(() => {
    if (isRunning) {
      let abyssParent = message.guild.channels.find(channel =>
        channel.name.startsWith("Abyss")
      );
      abyssParent.children.forEach(channel =>
        channel.setName(setAbyssStatus())
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
  let now = moment();
  let dayOfWeek = now.day();

  switch (dayOfWeek) {
    case 1: {
      let duration = getDuration(now, 2, 15);
      return `🔥💤 Preparing ${duration}`;
    }
    case 2: {
      if (now.hour() <= 15) {
        let duration = getDuration(now, 2, 15);
        return `🔥💤 Preparing ${duration}`;
      } else {
        let duration = getDuration(now, 4, 22);
        return `🔥❗❗ Ongoing ${duration}`;
      }
    }
    case 3: {
      let duration = getDuration(now, 4, 22);
      return `🔥❗❗ Ongoing ${duration}`;
    }
    case 4: {
      if (now.hour() <= 22) {
        let duration = getDuration(now, 4, 22);
        return `🔥❗❗ Ongoing ${duration}`;
      } else if (now.hour() >= 22 && now.minutes() <= 33) {
        let duration = getDuration(now, 4, 22, 30);
        return `🔥⏳ Calculating ${duration}`;
      } else {
        let duration = getDuration(now, 5, 15);
        return `🔥💤 Preparing ${duration}`;
      }
    }
    case 5: {
      if (now.hour() <= 15) {
        let duration = getDuration(now, 5, 15);
        return `🔥💤 Preparing ${duration}`;
      } else {
        let duration = getDuration(now, 0, 22);
        return `🔥❗❗ Ongoing ${duration}`;
      }
    }
    case 6: {
      let duration = getDuration(now, 0, 22);
      return `🔥❗❗ Ongoing ${duration}`;
    }
    case 0: {
      if (now.hour() <= 22) {
        let duration = getDuration(now, 0, 22);
        return `🔥❗❗ Ongoing ${duration}`;
      } else if (now.hour() >= 22 && now.minutes() <= 33) {
        let duration = getDuration(now, 0, 22, 30);
        return `🔥⏳ Calculating ${duration}`;
      } else {
        let duration = getDuration(now, 2, 15);
        return `🔥💤 Preparing ${duration}`;
      }
    }
  }
};

module.exports = {
  handleCommand: handleCommand
};
