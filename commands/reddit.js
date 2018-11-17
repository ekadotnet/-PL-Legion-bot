const fetch = require("node-fetch");
const snoowrap = require("snoowrap");
const helper = require("../shared/helper.js");

const r = new snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT,
  clientId: process.env.REDDIT_ID,
  clientSecret: process.env.REDDIT_SECRET,
  refreshToken: process.env.REDDIT_REFRESH_TOKEN
});

const time = ["all", "hour", "day", "week", "month", "year"];

getHotImage = (message, data) => {
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

        let imgData = {
          title: `Here's random image from r/${data.subreddit} for you! owo`,
          description: `[Full image](${post.link})`,
          url: post.link
        };
        helper.sendImage(message.channel, message.author.id, imgData);
      })
      .catch(() => {
        errorMsg(message.channel, message.author.id);
      });
  } catch (error) {
    errorMsg(message.channel, message.author.id);
  }
};

checkTimeRangeOption = option => {
  return time.includes(option);
};

getTopImage = (message, data) => {
  let time = data.timeOptions || "all";

  if (!checkTimeRangeOption(data.timeOptions)) {
    message.channel.send(
      `<@${
        message.author.id
      }> you passed wrong time range option, correct ones are: all, hour, day, week, month, year`
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

        let imgData = {
          title: `Here's random top image (range: ${time}) from r/${
            data.subreddit
          } for you! owo`,
          description: `[Full image](${post.link})`,
          url: post.link
        };
        helper.sendImage(message.channel, message.author.id, imgData);
      })
      .catch(() => {
        errorMsg(message.channel, message.author.id);
      });
  } catch (error) {
    errorMsg(message.channel, message.author.id);
  }
};

errorMsg = async (channel, user) => {
  await channel.send(
    `<@${user}> something went wrong, maybe invalid subreddit name? uwu`
  );
};

getImage = async (message, args) => {
  if (args[0] === "help") {
    const helpData = {
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
    await helper.getHelp(message.channel, message.author.id, helpData);
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
