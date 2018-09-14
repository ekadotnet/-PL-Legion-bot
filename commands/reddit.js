const fetch = require("node-fetch");
const snoowrap = require("snoowrap");
const config = require("../config.json");

const r = new snoowrap({
  userAgent: config.reddit.useragent,
  clientId: config.reddit.redditId,
  clientSecret: config.reddit.redditSecret,
  refreshToken: config.reddit.refreshToken
});

const time = ["all", "hour", "day", "week", "month", "year"];

getHotImage = (message, data) => {
  let user = message.author.id;

  try {
    r.getSubreddit(data.subreddit)
      .getHot()
      .map(submission => ({
        link: submission.url,
        img: submission.thumbnail,
        stickied: submission.stickied
      }))
      .filter(submission => submission.stickied !== true)
      .filter(submission => submission.thumbnail !== "self")
      .then(submissions => {
        let post =
          submissions[Math.floor(Math.random() * submissions.length)].link;
        message.channel.send(
          `<@${user}> here's random hot image from r/${
            data.subreddit
          } for you! owo\n${post}`
        );
      })
      .catch(() => {
        errorMsg(message, user);
      });
  } catch (error) {
    errorMsg(message, user);
  }
};

checkTimeRangeOption = option => {
  return time.includes(option);
};

getTopImage = (message, data) => {
  let time = data.timeOptions || "all";
  let user = message.author.id;

  if (!checkTimeRangeOption(data.timeOptions)) {
    message.channel.send(
      `<@${user}> you passed wrong time range option, correct ones are: all, hour, day, week, month, year`
    );
    return;
  }

  try {
    r.getSubreddit(data.subreddit)
      .getTop({ time: time })
      .map(submission => ({
        link: submission.url,
        img: submission.thumbnail,
        stickied: submission.stickied
      }))
      .filter(submission => submission.stickied !== true)
      .filter(submission => submission.thumbnail !== "self")
      .then(submissions => {
        let post =
          submissions[Math.floor(Math.random() * submissions.length)].link;
        message.channel.send(
          `<@${user}> here's random top image (range: ${time}) from r/${
            data.subreddit
          } for you! owo\n${post}`
        );
      })
      .catch(() => {
        errorMsg(message, user);
      });
  } catch (error) {
    errorMsg(message, user);
  }
};

errorMsg = (message, user) => {
  message.channel.send(
    `<@${user}> something went wrong, maybe wrong subreddit name? uwu`
  );
};

getImage = async (message, args) => {
  if (args[0] === "help") {
    let user = message.author.id;

    await message.channel.send(`<@${user}>`, {
      embed: {
        title: `!r`,
        description: `Gets random image from given subreddit's hot or top page`,
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
          }
        ]
      }
    });
  } else {
    let data = {
      subreddit: args[0],
      type: args[1],
      timeOptions: args[2]
    };

    if (data.subreddit === undefined || data.subreddit === "") {
      message.channel.send(
        `<@${message.author.id}> GIMME SUBREDDIT NAME DAMMIT >:(`
      );
      return;
    }

    switch (data.type) {
      case undefined:
      case "":
      case "hot": {
        getHotImage(message, data);
        break;
      }
      case "top": {
        getTopImage(message, data);
        break;
      }
      default: {
        message.channel.send("You gave me wrong parameters uwu");
        break;
      }
    }
  }
};

module.exports = {
  getImage: getImage
};
