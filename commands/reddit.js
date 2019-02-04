const snoowrap = require("snoowrap");
const sender = require("../shared/sender.js");

const r = new snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT,
  clientId: process.env.REDDIT_ID,
  clientSecret: process.env.REDDIT_SECRET,
  refreshToken: process.env.REDDIT_REFRESH_TOKEN
});

const commandTypes = {
  NOT_PASSED: "",
  HOT: "hot",
  TOP: "top"
};

const errorTypes = {
  DEFAULT: 0,
  TIME_OPTION: 1,
  WRONG_PARAMETER: 2,
  NO_SUBREDDIT: 3
};

const time = ["all", "hour", "day", "week", "month", "year"];

const defaultTimeOption = "all";

const redditDescription = {
  title: `!r`,
  description: `Gets random image from given subreddit's hot or top page\n**Note:** use time option only when getting images from top`,
  fields: [
    {
      name: `Usage:`,
      value: `!r [**subreddit_name**] [**hot**/top] [**all**/hour/day/week/month/year]`
    },
    {
      name: `Optional parameters:`,
      value: `[hot/top] [all/hour/day/week/month/year]`
    },
    {
      name: `Examples:`,
      value: `!r zettairyouiki || !r zettairyouiki hot || !r zettairyouiki top all`
    },
    {
      name: `**Important:**`,
      value: `Remember that passed name must point to existing (and non-empty) subreddit!`
    }
  ]
};

const sendErrorMessage = async (channel, user, errorType) => {
  switch (errorType) {
    case errorTypes.TIME_OPTION: {
      let message = `<@${user}> you passed wrong time range option, correct ones are: all, hour, day, week, month, year`;
      await sender.sendMessage(channel, message);
    }
    case errorTypes.WRONG_PARAMETER: {
      let message = `<@${user}> gave me wrong parameters uwu`;
      await sender.sendMessage(channel, message);
    }
    case errorTypes.NO_SUBREDDIT: {
      let message = `<@${user}> GIMME SUBREDDIT NAME DAMMIT >:(`;
      await sender.sendMessage(channel, message);
    }
    case errorTypes.DEFAULT:
    default: {
      let message = `<@${user}> something went wrong, maybe invalid subreddit name? uwu`;
      await sender.sendMessage(channel, message);
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
  let time = data.timeOptions || defaultTimeOption;

  if (!checkTimeRangeOption(data.timeOptions)) {
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
      .then(submissions => {
        let post = submissions[Math.floor(Math.random() * submissions.length)];
        let imgData = formatImageData(time, data.subreddit, post.link);

        sender.sendImage(message.channel, message.author.id, imgData);
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
