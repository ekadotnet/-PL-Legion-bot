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

module.exports = {
  getMomo: getMomo
};
