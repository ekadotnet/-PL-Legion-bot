const sender = require("../commands/shared/sender");
const handler = require("../commands/shared/logger");
const { setAbyssStatus, addSubscriber } = require("./timerTypes/abyss");
const { setOpenWorldStatus } = require("./timerTypes/openWorld");
const {
  commandType,
  timersDescription,
  SUBSCRIBER_ROLE,
  REFRESH_RATE
} = require("./constants.js");

var isRunning = true;

const timersUp = (guild, permissions) => {
  init(guild, permissions).then(
    () => {
      start(guild);
      handler.onResolved(handleCommand, { guild: guild.name });
    },
    reason =>
      handler.onRejected(reason, handleCommand, {
        args: args,
        guild: guild.id,
        guildName: guild.name,
        channel: channel.name
      })
  );
};

const handleCommand = async (message, args, permissions) => {
  switch (args[0]) {
    case commandType.START: {
      if (!message.member.hasPermission(permissions.FLAGS.ADMINISTRATOR)) {
        return;
      }
      timersUp(message.guild, permissions);
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

const checkIfAbyssTimerExists = guild => {
  return guild.channels.find(channel => channel.name == `Abyss`) != null;
};

const checkIfOwTimerExists = guild => {
  return guild.channels.find(channel => channel.name == `Open World`) != null;
};

const checkIfSubscriberRoleExists = guild => {
  return guild.roles.find(r => r.name === SUBSCRIBER_ROLE) != null;
};

const checkIfReminderChannelExists = guild => {
  return (
    guild.channels.find(channel => channel.name == `reminder-chan`) != null
  );
};

const handleBotRestart = (guild, permissions) => {
  timersUp(guild, permissions);
};

const createAbyssTimer = (guild, permissions, skip) => {
  if (skip) {
    return Promise.resolve();
  }
  return guild.createChannel("Abyss", "category").then(
    category => {
      guild
        .createChannel("Abyss", "voice", [
          {
            id: guild.id,
            denied: permissions.ALL
          }
        ])
        .then(
          channel => {
            channel.setParent(category).then(
              () => handler.onResolved(init, { guild: guild.name }),
              reason => {
                return handler.onRejected(reason, createChannel, {
                  step: `Set Abyss timer parent`
                });
              }
            );
          },
          reason => {
            return handler.onRejected(reason, createChannel, {
              step: `Create Abyss timer`
            });
          }
        );
    },
    reason => {
      return handler.onRejected(reason, createChannel, {
        step: `Create Abyss category`
      });
    }
  );
};

const createOwTimer = (guild, permissions, skip) => {
  if (skip) {
    return Promise.resolve();
  }
  return guild.createChannel("Open World", "category").then(
    category => {
      guild
        .createChannel("Round", "voice", [
          {
            id: guild.id,
            denied: permissions.ALL
          }
        ])
        .then(
          channel => {
            channel.setParent(category).then(
              () => handler.onResolved(init, { guild: guild.name }),
              reason => {
                return handler.onRejected(reason, createChannel, {
                  step: `Set Open World timer parent`
                });
              }
            );
          },
          reason => {
            return handler.onRejected(reason, createChannel, {
              step: `Create Open World timer`
            });
          }
        );
    },
    reason => {
      return handler.onRejected(reason, createChannel, {
        step: `Create Open World category`
      });
    }
  );
};

const createReminderChannel = (guild, permissions, skip) => {
  if (skip) {
    return Promise.resolve();
  }
  return guild
    .createChannel("reminder-chan", "text", [
      {
        id: guild.id,
        denied: permissions.ALL
      }
    ])
    .then(
      () =>
        handler.onResolved(init, {
          guild: guild.name
        }),
      reason => {
        return handler.onRejected(reason, createChannel, {
          step: `Create subscriber channel`
        });
      }
    );
};

const createSubscriberRole = (guild, skip) => {
  if (skip) {
    return Promise.resolve();
  }
  return guild
    .createRole({
      name: SUBSCRIBER_ROLE,
      mentionable: true
    })
    .then(
      () =>
        handler.onResolved(init, {
          guild: guild.name
        }),
      reason => {
        return handler.onRejected(reason, createChannel, {
          step: `Create subscriber role`
        });
      }
    );
};

const init = (guild, permissions) => {
  return createAbyssTimer(
    guild,
    permissions,
    checkIfAbyssTimerExists(guild)
  ).then(() =>
    createOwTimer(guild, permissions, checkIfOwTimerExists(guild)).then(() =>
      createReminderChannel(
        guild,
        permissions,
        checkIfReminderChannelExists(guild)
      ).then(() =>
        createSubscriberRole(guild, checkIfSubscriberRoleExists(guild))
      )
    )
  );
};

const updateStatus = guild => {
  let timeout = setTimeout(() => updateStatus(guild), REFRESH_RATE);
  if (isRunning) {
    let abyssCategory = guild.channels.find(channel =>
      channel.name.startsWith("Abyss")
    );
    try {
      abyssCategory.children.forEach(channel =>
        channel
          .setName(setAbyssStatus(guild))
          .then(
            () => handler.onResolved(setAbyssStatus),
            reason => handler.onRejected(reason, setAbyssStatus)
          )
      );
    } catch (error) {
      handler.onError(error);
    }

    let openWorldCategory = guild.channels.find(channel =>
      channel.name.startsWith("Open")
    );
    try {
      openWorldCategory.children.forEach(channel =>
        channel.setName(setOpenWorldStatus()).then(
          () => {
            handler.onResolved(setOpenWorldStatus);
          },
          reason => handler.onRejected(reason, setOpenWorldStatus)
        )
      );
    } catch (error) {
      handler.onError(error);
    }
  } else {
    handler.log("clearTimeout");
    clearTimeout(timeout);
  }
};

const start = guild => {
  isRunning = true;
  updateStatus(guild);
};

const stop = () => {
  isRunning = false;
};

module.exports = {
  handleCommand: handleCommand,
  handleBotRestart: handleBotRestart
};
