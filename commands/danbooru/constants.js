module.exports = {
  errorTypes: {
    DEFAULT: 0,
    TOO_MUCH_TAGS: 1,
    NO_RESULTS: 2
  },
  momoTags: "rating:safe momo_velia_deviluke",
  momoNsfwTags: "rating:questionable momo_velia_deviluke",
  momoDescription: {
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
  },
  danbooruDescription: {
    title: `!danbooru`,
    description: `Gets random image from danbooru with given tag(s) (max. **2**)\n**Note:** passing no tags will select completely random image from the first page`,
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
  }
};
