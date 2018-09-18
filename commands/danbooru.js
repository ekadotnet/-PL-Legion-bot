const Danbooru = require("danbooru");
const helper = require("../shared/helper.js");

const booru = new Danbooru(
  process.env.DANBOORU_LOGIN + ":" + process.env.DANBOORU_KEY
);

getMomo = async (message, args) => {
  let user = message.author.id;
  if (args[0] === "help") {
    const helpData = {
      title: `!momo`,
      description: `Gets random Momo image from danbooru`,
      fields: [
        {
          name: `Usage:`,
          value: `!momo [nsfw]`
        },
        {
          name: `Optional parameters:`,
          value: `[nsfw]`
        },
        {
          name: `Examples:`,
          value: `!momo || !momo nsfw`
        }
      ]
    };
    await helper.getHelp(message, user, helpData);
  } else {
    let user = message.author.id;
    let nsfw = args[0] === "nsfw" ? true : false;
    let page = Math.floor(Math.random() * 10);

    booru
      .posts({
        tags: nsfw
          ? "rating:questionable momo_velia_deviluke"
          : "rating:safe momo_velia_deviluke",
        page: page
      })
      .then(posts => {
        const index = Math.floor(Math.random() * posts.length);
        const post = posts[index];
        const imgData = {
          title: `<Here's random ${
            nsfw ? "and (probably) nsfw " : ""
          }Momo image for you! owo`,
          description: `[Full image](${booru.url(post.file_url)})`,
          url: `${booru.url(post.large_file_url)}`
        };

        helper.sendImage(message.channel, message.author.id, imgData);
      });
  }
};

getImage = async (message, args) => {
  let user = message.author.id;

  if (args[0] === "help") {
    const helpData = {
      title: `!danbooru`,
      description: `Gets random image from danbooru with given tag(s) (max. **2**)\nNote: passing no tags will select completely random image from the first page`,
      fields: [
        {
          name: `Usage:`,
          value: `!danbooru [tags]`
        },
        {
          name: `Optional parameters:`,
          value: `[tags]`
        },
        {
          name: `Examples:`,
          value: `!danbooru || !danbooru kiana_kaslana`
        },
        {
          name: `**Important:**`,
          value: `Remember that passed tag(s) must be a **valid** danbooru tag!`
        }
      ]
    };
    await helper.getHelp(message, user, helpData);
  } else {
    if (args.length > 2) {
      await message.channel.send(`<@${user}> you gave me too much tags uwu`);
      return;
    }

    let tags = [args[0] || "", args[1] || ""];

    booru
      .posts({
        tags: `${tags[0]} ${tags[1]}`
      })
      .then(posts => {
        if (posts.length === 0) {
          message.channel.send(
            `<@${user}> I found 0 images with given tag(s), are you sure they're correct?`
          );
          return;
        }

        const index = Math.floor(Math.random() * posts.length);
        const post = posts[index];
        const imgData = {
          title:
            tags[0] === "" && tags[1] === ""
              ? `Here's random image`
              : `Here's random image with tag(s): ${tags[0]} ${tags[1]}`,
          description: `[Full image](${booru.url(post.file_url)})`,
          url: `${booru.url(post.large_file_url)}`
        };

        helper.sendImage(message.channel, message.author.id, imgData);
      });
  }
};

module.exports = {
  getMomo: getMomo,
  getImage: getImage
};
