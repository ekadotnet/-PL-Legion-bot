const Danbooru = require("danbooru");
const sender = require("../shared/sender.js");
const {
  errorTypes,
  momoNsfwTags,
  momoTags,
  momoDescription,
  danbooruDescription
} = require("./constants.js");

const booru = new Danbooru(
  process.env.DANBOORU_LOGIN + ":" + process.env.DANBOORU_KEY
);

const sendErrorMessage = async (channel, user, errorType) => {
  switch (errorType) {
    case errorTypes.TOO_MUCH_TAGS: {
      let message = `<@${user}> you gave me too much tags uwu`;
      sender.sendMessage(channel, message);
      break;
    }
    case errorTypes.NO_RESULTS: {
      let message = `<@${user}> I found 0 images with given tag(s), are you sure they're correct?`;
      sender.sendMessage(channel, message);
      break;
    }
    case errorTypes.DEFAULT:
    default: {
      let message = `<@${user}> Something went wrong, sowwy`;
      sender.sendMessage(channel, message);
      break;
    }
  }
};

const formatMomoImage = (isNsfw, fileUrl, largeFileUrl) => {
  return {
    title: `Here's random ${
      isNsfw ? "and (probably) nsfw " : ""
    }Momo image for you! owo`,
    description: `[Full image](${booru.url(fileUrl)})`,
    url: `${booru.url(largeFileUrl)}`
  };
};

const formatImage = (tags, fileUrl, LargeFileUrl) => {
  return {
    title:
      tags[0] === "" && tags[1] === ""
        ? `Here's random image`
        : `Here's random image with tag(s): ${tags[0]} ${tags[1]}`,
    description: `[Full image](${booru.url(fileUrl)})`,
    url: `${booru.url(LargeFileUrl)}`
  };
};

const getRandomPost = posts => {
  return posts[Math.floor(Math.random() * posts.length)];
};

const getMomo = async (message, args) => {
  if (args[0] === "help") {
    await sender.getHelp(message.channel, message.author.id, momoDescription);
  } else {
    let nsfw = args[0] === "nsfw" ? true : false;
    let page = Math.floor(Math.random() * 10);

    booru
      .posts({
        tags: nsfw ? momoNsfwTags : momoTags,
        page: page
      })
      .then(async posts => {
        let post = getRandomPost(posts);
        let imgData = formatMomoImage(nsfw, post.file_url, post.large_file_url);

        await sender.sendImage(message.channel, message.author.id, imgData);
      });
  }
};

const getImage = async (message, args) => {
  if (args[0] === "help") {
    await sender.getHelp(
      message.channel,
      message.author.id,
      danbooruDescription
    );
  } else {
    if (args.length > 2) {
      await sendErrorMessage(
        message.channel,
        message.author.id,
        errorTypes.TOO_MUCH_TAGS
      );
      return;
    }

    let tags = [args[0] || "", args[1] || ""];

    booru
      .posts({
        tags: `${tags[0]} ${tags[1]}`
      })
      .then(async posts => {
        if (posts.length === 0) {
          await sendErrorMessage(
            message.channel,
            message.author.id,
            errorTypes.NO_RESULTS
          );
          return;
        }

        let post = getRandomPost(posts);
        let imgData = formatImage(tags, post.file_url, post.large_file_url);

        await sender.sendImage(message.channel, message.author.id, imgData);
      });
  }
};

module.exports = {
  getMomo: getMomo,
  getImage: getImage
};
