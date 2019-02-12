const handler = require("./logger");

const getHelp = async (channel, user, data) => {
  await channel
    .send(`<@${user}>`, {
      embed: {
        title: data.title,
        description: data.description,
        fields: data.fields || ""
      }
    })
    .then(
      () => handler.onResolved(getHelp),
      reason => {
        return handler.onRejected(reason, getHelp, {
          channel: channel,
          user: user,
          data: data
        });
      }
    );
};

const sendImage = async (channel, user, data) => {
  await channel
    .send(`<@${user}>`, {
      embed: {
        title: data.title,
        description: data.description,
        image: {
          url: data.url
        }
      }
    })
    .then(
      () => handler.onResolved(sendImage),
      reason => {
        return handler.onRejected(reason, sendImage, {
          channel: channel,
          user: user,
          data: data
        });
      }
    );
};

const sendMessage = async (channel, message) => {
  return await channel.send(message).then(
    message => {
      handler.onResolved(sendMessage);
      return message;
    },
    reason => {
      return handler.onRejected(reason, sendMessage, {
        channel: channel,
        message: message
      });
    }
  );
};

const sendRoleMention = async (channel, role, msg) => {
  return await channel.send(`${role} ${msg}`).then(
    () => handler.onResolved(sendRoleMention),
    reason => {
      return handler.onRejected(reason, sendRoleMention, {
        channel: channel,
        role: role,
        msg: msg
      });
    }
  );
};

module.exports = {
  getHelp: getHelp,
  sendImage: sendImage,
  sendMessage: sendMessage,
  sendRoleMention: sendRoleMention
};
