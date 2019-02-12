const moment = require("moment");

const getNextDayOfWeek = (date, dayOfWeek, offset, minutesOffset = 0) => {
  let resultDate = date.clone();

  resultDate.date(date.date() + ((7 + dayOfWeek - date.day()) % 7));
  resultDate
    .hours(offset)
    .minutes(minutesOffset)
    .seconds(0);

  return resultDate;
};

const getDuration = (now, dayOfWeek, offset, minutesOffset = 0) => {
  let then = getNextDayOfWeek(now, dayOfWeek, offset, minutesOffset);

  let difference = then.diff(now);
  let duration = moment.duration(difference);
  let remaining =
    Math.floor(duration.asHours()) + moment(difference).format(":mm");

  let dateParts = remaining.split(":");

  return `${dateParts[0]}h ${dateParts[1]}m`;
};

module.exports = {
  getDuration: getDuration
};
