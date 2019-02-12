const sender = require("../commands/shared/sender");
const handler = require("../commands/shared/logger");
const { setAbyssStatus } = require("./timerTypes/abyss");
const { setOpenWorldStatus } = require("./timerTypes/openWorld");
const {
  commandType,
  timersDescription,
  SUBSCRIBER_ROLE,
  REFRESH_RATE
} = require("./constants.js");

var isRunning = false;

const handleCommand = async (message, args, permissions) => {
  switch (args[0]) {
    case commandType.START: {
      if (!message.member.hasPermission(permissions.FLAGS.ADMINISTRATOR)) {
        return;
      }
      guild = message.guild;
      channel = message.channel;
      if (
        message.guild.channels.find(channel => channel.name == `Abyss`) !=
          null &&
        message.guild.channels.find(channel => channel.name == `Open World`) !=
          null
      ) {
        start(message);
      } else {
        init(message, permissions).then(
          () => {
            start(message);
            handler.onResolved(handleCommand, { guild: message.guild.name });
          },
          reason =>
            handler.onRejected(reason, handleCommand, {
              args: args,
              guild: message.guild.id,
              guildName: message.guild.name,
              channel: message.channel.name
            })
        );
      }
      break;
    }
    case commandType.STOP: {
      if (!message.member.hasPermission(permissions.FLAGS.ADMINISTRATOR)) {
        return;
      }
      stop();
      break;
    }
    case commandType.RESTART: {
      if (!message.member.hasPermission(permissions.FLAGS.MANAGE_CHANNELS)) {
        return;
      }
      start(message);
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

  return server.createChannel("Abyss", "category").then(
    category => {
      server
        .createChannel("Abyss", "voice", [
          {
            id: server.id,
            denied: permissions.ALL
          }
        ])
        .then(
          channel => {
            channel.setParent(category).then(
              () => {
                server.createChannel("Open World", "category").then(
                  category => {
                    server
                      .createChannel("Round", "voice", [
                        {
                          id: server.id,
                          denied: permissions.ALL
                        }
                      ])
                      .then(
                        channel => {
                          channel.setParent(category).then(
                            () =>
                              handler.onResolved(init, { guild: server.name }),
                            reason => {
                              return handler.onRejected(reason, createChannel, {
                                step: `Set Open World timer parent`
                              });
                            }
                          );
                          if (
                            message.guild.roles.find(
                              r => r.name === SUBSCRIBER_ROLE
                            ) == null
                          ) {
                            server
                              .createRole({
                                name: SUBSCRIBER_ROLE,
                                mentionable: true
                              })
                              .then(
                                () =>
                                  handler.onResolved(init, {
                                    guild: server.name
                                  }),
                                reason => {
                                  return handler.onRejected(
                                    reason,
                                    createChannel,
                                    {
                                      step: `Create subscriber role`
                                    }
                                  );
                                }
                              );
                          }
                          server
                            .createChannel("reminder-chan", "text", [
                              {
                                id: server.id,
                                denied: permissions.ALL
                              }
                            ])
                            .then(
                              () =>
                                handler.onResolved(init, {
                                  guild: server.name
                                }),
                              reason => {
                                return handler.onRejected(
                                  reason,
                                  createChannel,
                                  {
                                    step: `Create subscriber channel`
                                  }
                                );
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
              },
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

const start = message => {
  isRunning = true;

  var interval = setInterval(() => {
    if (isRunning) {
      let abyssCategory = message.guild.channels.find(channel =>
        channel.name.startsWith("Abyss")
      );
      abyssCategory.children.forEach(channel =>
        channel
          .setName(setAbyssStatus())
          .then(
            () => handler.onResolved(setAbyssStatus),
            reason => handler.onRejected(reason, setAbyssStatus)
          )
      );

      let openWorldCategory = message.guild.channels.find(channel =>
        channel.name.startsWith("Open")
      );
      openWorldCategory.children.forEach(channel =>
        channel
          .setName(setOpenWorldStatus())
          .then(
            () => handler.onResolved(setOpenWorldStatus),
            reason => handler.onRejected(reason, setOpenWorldStatus)
          )
      );
    } else {
      clearInterval(interval);
    }
  }, REFRESH_RATE);
};

const stop = () => {
  isRunning = false;
};

module.exports = {
  handleCommand: handleCommand
};
