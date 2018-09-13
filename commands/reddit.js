const fetch = require("node-fetch");
const snoowrap = require("snoowrap");
const config = require("../config.json");

const r = new snoowrap({
  userAgent: config.reddit.useragent,
  clientId: config.reddit.redditId,
  clientSecret: config.reddit.redditSecret,
  refreshToken: config.reddit.refreshToken
});

getHotImage = (message, data) => {
  let user = message.author.id;

  try {
    r.getSubreddit(data.subreddit)
      .catch(() => {
        errorMsg(message, user);
      })
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
      });
  } catch (error) {
    errorMsg(message, user);
  }
};

getTopImage = (message, data) => {
  let time = data.timeOptions || "all";
  let user = message.author.id;

  try {
    r.getSubreddit(data.subreddit)
      .catch(() => {
        errorMsg(message, user);
      })
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
};

getImage_Old = async (message, args) => {
  //why did I left this here?
  //https://developers.google.com/web/updates/2015/03/introduction-to-fetch
  let response;
  if (args[0] === null || args[0] === "") {
    message.channel.send("GIMME SUBREDDIT NAME DAMMIT >:(");
  } else {
  }
  fetch(`https://www.reddit.com/r/${args[0]}.json`)
    .then(res => res.json())
    .then(json =>
      json.data.children
        .slice(0, 20)
        .map(post => ({
          link: post.data.url,
          img: post.data.thumbnail,
          stickied: post.data.stickied
        }))
        .filter(post => post.stickied !== true)
        .filter(post => post.img !== "self")
    )
    .then(posts => {
      // posts.forEach(post => {
      //   message.channel.send(post.link);
      // })
      let post = posts[Math.floor(Math.random() * posts.length)].link;
      let user = message.author.id;
      message.channel.send(
        `<@${user}> here's random hot image from r/${
          args[0]
        } for you! owo\n${post}`
      );
    });
};

module.exports = {
  getImage: getImage,
  getImage_Old: getImage_Old
};
