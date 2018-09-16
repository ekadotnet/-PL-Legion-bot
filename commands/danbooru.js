const Danbooru = require("danbooru");
const config = require("../config.json");

// Perform a search for popular image posts
const booru = new Danbooru(config.danbooru.login + ":" + config.danbooru.key);

getMomo = async (message, args) => {
  if (args[0] === "help") {
    let user = message.author.id;

    await message.channel.send(`<@${user}>`, {
      embed: {
        title: `!momo`,
        description: `Gets random Momo image from danbooru`,
        fields: [
          { name: `Usage:`, value: `!momo [nsfw]` },
          { name: `Optional parameters:`, value: `[nsfw]` },
          { name: `Examples:`, value: `!momo || !momo nsfw` }
        ]
      }
    });
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
        const url = booru.url(post.large_file_url);
        const originalImage = booru.url(post.file_url);

        message.channel
          .send(
            `<@${user}> here's random ${
              nsfw ? "and (probably) nsfw " : ""
            }Momo image for you! owo\n${url}`
          )
          .then(() =>
            message.channel.send({
              embed: { description: `[Full image](${originalImage})` }
            })
          );
      });
  }
};

getImage = async (message, args) => {
  let user = message.author.id;

  if (args[0] === "help") {
    await message.channel.send(`<@${user}>`, {
      embed: {
        title: `!danbooru`,
        description: `Gets random image from danbooru with given tags\nNote: passing no tags will select completely random image from first page`,
        fields: [
          { name: `Usage:`, value: `!danbooru [tags]` },
          { name: `Optional parameters:`, value: `[tags]` },
          { name: `Examples:`, value: `!danbooru || !danbooru kiana_kaslana` }
        ]
      }
    });
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
            `<@${user}> I found 0 images with given tags, are you sure they're correct?`
          );
          return;
        }

        const index = Math.floor(Math.random() * posts.length);
        const post = posts[index];
        const url = booru.url(post.large_file_url);
        const originalImage = booru.url(post.file_url);

        message.channel
          .send(
            tags[0] === "" && tags[1] === ""
              ? `<@${user}> here's random image\n${url}`
              : `<@${user}> here's random image with tag(s): ${tags[0]} ${
                  tags[1]
                }\n${url}`
          )
          .then(() =>
            message.channel.send({
              embed: { description: `[Full image](${originalImage})` }
            })
          );
      });
  }
};

module.exports = {
  getMomo: getMomo,
  getImage: getImage
};
