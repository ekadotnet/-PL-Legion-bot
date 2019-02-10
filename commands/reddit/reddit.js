const snoowrap = require("snoowrap");
const sender = require("../shared/sender.js");
const {
  commandTypes,
  errorTypes,
  time,
  redditDescription
} = require("./constants.js");

const r = new snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT,
  clientId: process.env.REDDIT_ID,
  clientSecret: process.env.REDDIT_SECRET,
  refreshToken: process.env.REDDIT_REFRESH_TOKEN
});

const sendErrorMessage = async (channel, user, errorType) => {
  switch (errorType) {
    case errorTypes.TIME_OPTION: {
      let message = `<@${user}> you passed wrong time range option, correct ones are: all, hour, day, week, month, year`;
      await sender.sendMessage(channel, message);
      break;
    }
    case errorTypes.WRONG_PARAMETER: {
      let message = `<@${user}> gave me wrong parameters uwu`;
      await sender.sendMessage(channel, message);
      break;
    }
    case errorTypes.NO_SUBREDDIT: {
      let message = `<@${user}> GIMME SUBREDDIT NAME DAMMIT >:(`;
      await sender.sendMessage(channel, message);
      break;
    }
    case errorTypes.DEFAULT:
    default: {
      let message = `<@${user}> something went wrong, maybe invalid subreddit name? uwu`;
      await sender.sendMessage(channel, message);
      break;
    }
  }
};

const formatImageData = (subreddit, link, time) => {
  return time === undefined
    ? {
        title: `Here's random image from r/${subreddit} for you! owo`,
        description: `[Full image](${link})`,
        url: link
      }
    : {
        title: `Here's random top image (range: ${time}) from r/${subreddit} for you! owo`,
        description: `[Full image](${link})`,
        url: link
      };
};

const checkTimeRangeOption = option => {
  return time.includes(option);
};

const getHotImage = async (message, data) => {
  let submissionThumbnail = "self";

  try {
    r.getSubreddit(data.subreddit)
      .getHot()
      .map(submission => ({
        link: submission.url,
        img: submission.thumbnail,
        stickied: submission.stickied
      }))
      .filter(submission => submission.stickied !== true)
      .filter(submission => submission.thumbnail !== submissionThumbnail)
      .then(async submissions => {
        let post = submissions[Math.floor(Math.random() * submissions.length)];

        if (post.link.includes("imgur")) {
          if (
            !post.link.endsWith("png") ||
            !post.link.endsWith("png") ||
            !post.link.endsWith("jpeg")
          ) {
            post.link += ".png";
          }
        }

        let imgData = formatImageData(data.subreddit, post.link);

        await sender.sendImage(message.channel, message.author.id, imgData);
      })
      .catch(
        async () =>
          await sendErrorMessage(
            message.channel,
            message.author.id,
            errorTypes.DEFAULT
          )
      );
  } catch (error) {
    await sendErrorMessage(
      message.channel,
      message.author.id,
      errorTypes.DEFAULT
    );
  }
};

const getTopImage = async (message, data) => {
  let time = data.timeOptions || "all";

  if (!checkTimeRangeOption(time)) {
    await sendErrorMessage(
      message.channel,
      message.author.id,
      errorTypes.TIME_OPTION
    );
    return;
  }

  try {
    let submissionThumbnail = "self";
    r.getSubreddit(data.subreddit)
      .getTop({ time: time })
      .map(submission => ({
        link: submission.url,
        img: submission.thumbnail,
        stickied: submission.stickied
      }))
      .filter(submission => submission.stickied !== true)
      .filter(submission => submission.thumbnail !== submissionThumbnail)
      .then(async submissions => {
        let post = submissions[Math.floor(Math.random() * submissions.length)];

        if (post.link.includes("imgur")) {
          if (
            !post.link.endsWith("png") ||
            !post.link.endsWith("png") ||
            !post.link.endsWith("jpeg")
          ) {
            post.link += ".png";
          }
        }

        let imgData = formatImageData(data.subreddit, post.link, time);

        await sender.sendImage(message.channel, message.author.id, imgData);
      })
      .catch(
        async () =>
          await sendErrorMessage(
            message.channel,
            message.author.id,
            errorTypes.DEFAULT
          )
      );
  } catch (error) {
    await sendErrorMessage(
      message.channel,
      message.author.id,
      errorTypes.DEFAULT
    );
  }
};

const getImage = async (message, args) => {
  if (args[0] === "help") {
    await sender.getHelp(message.channel, message.author.id, redditDescription);
  } else {
    let commandOptions = {
      subreddit: args[0],
      type: args[1],
      timeOptions: args[2]
    };

    if (
      commandOptions.subreddit === undefined ||
      commandOptions.subreddit === ""
    ) {
      await sendErrorMessage(
        message.channel,
        message.author.id,
        errorTypes.NO_SUBREDDIT
      );
      return;
    }

    switch (commandOptions.type) {
      case undefined:
      case commandTypes.NOT_PASSED:
      case commandTypes.HOT: {
        await getHotImage(message, commandOptions);
        break;
      }
      case commandTypes.TOP: {
        await getTopImage(message, commandOptions);
        break;
      }
      default: {
        await sendErrorMessage(
          message.channel,
          message.author.id,
          errorTypes.WRONG_PARAMETER
        );
        break;
      }
    }
  }
};

module.exports = {
  getImage: getImage
};
