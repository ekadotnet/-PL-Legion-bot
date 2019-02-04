module.exports = {
  commandTypes: {
    NOT_PASSED: "",
    HOT: "hot",
    TOP: "top"
  },
  errorTypes: {
    DEFAULT: 0,
    TIME_OPTION: 1,
    WRONG_PARAMETER: 2,
    NO_SUBREDDIT: 3
  },
  time: ["all", "hour", "day", "week", "month", "year"],
  redditDescription: {
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
        value: `!r zettairyouiki | !r zettairyouiki hot | !r zettairyouiki top all`
      },
      {
        name: `**Important:**`,
        value: `Remember that passed name must point to existing (and non-empty) subreddit!`
      }
    ]
  }
};
