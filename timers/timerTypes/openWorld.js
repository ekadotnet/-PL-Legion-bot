const moment = require("moment");
const { getDuration } = require("../duration.js");
const {
  daysOfWeek,
  OPEN_WORLD_CLOSE_TIME,
  OPEN_WORLD_RESET_TIME,
  OPEN_WORLD_LOCK_TIME
} = require("../constants");

const getOngoingWorldStatus = duration => {
  return `🌏❗❗ Ongoing ${duration}`;
};

const getLockedWorldStatus = duration => {
  return `🌏🔒 Locked ${duration}`;
};

const setOpenWorldStatus = () => {
  let dateNow = moment();
  let currentDay = dateNow.day();

  switch (currentDay) {
    case daysOfWeek.MONDAY: {
      if (dateNow.hour() < OPEN_WORLD_CLOSE_TIME) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.MONDAY,
          OPEN_WORLD_CLOSE_TIME
        );
        return getOngoingWorldStatus(duration);
      } else if (
        dateNow.hour() >= OPEN_WORLD_CLOSE_TIME &&
        dateNow.hour() <= OPEN_WORLD_RESET_TIME
      ) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.MONDAY,
          OPEN_WORLD_CLOSE_TIME,
          OPEN_WORLD_LOCK_TIME
        );
        return getLockedWorldStatus(duration);
      } else {
        let duration = getDuration(
          dateNow,
          daysOfWeek.THURSDAY,
          OPEN_WORLD_CLOSE_TIME
        );
        return getOngoingWorldStatus(duration);
      }
    }
    case daysOfWeek.TUESDAY: {
      let duration = getDuration(
        dateNow,
        daysOfWeek.THURSDAY,
        OPEN_WORLD_CLOSE_TIME
      );
      return getOngoingWorldStatus(duration);
    }
    case daysOfWeek.WEDNESDAY: {
      let duration = getDuration(
        dateNow,
        daysOfWeek.THURSDAY,
        OPEN_WORLD_CLOSE_TIME
      );
      return getOngoingWorldStatus(duration);
    }
    case daysOfWeek.THURSDAY: {
      if (dateNow.hour() < OPEN_WORLD_CLOSE_TIME) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.THURSDAY,
          OPEN_WORLD_CLOSE_TIME
        );
        return getOngoingWorldStatus(duration);
      } else if (
        dateNow.hour() >= OPEN_WORLD_CLOSE_TIME &&
        dateNow.hour() <= OPEN_WORLD_RESET_TIME
      ) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.THURSDAY,
          OPEN_WORLD_CLOSE_TIME,
          OPEN_WORLD_LOCK_TIME
        );
        return getLockedWorldStatus(duration);
      } else {
        let duration = getDuration(
          dateNow,
          daysOfWeek.SATURDAY,
          OPEN_WORLD_CLOSE_TIME
        );
        return getOngoingWorldStatus(duration);
      }
    }
    case daysOfWeek.FRIDAY: {
      let duration = getDuration(
        dateNow,
        daysOfWeek.SATURDAY,
        OPEN_WORLD_CLOSE_TIME
      );
      return getOngoingWorldStatus(duration);
    }
    case daysOfWeek.SATURDAY: {
      if (dateNow.hour() < OPEN_WORLD_CLOSE_TIME) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.SATURDAY,
          OPEN_WORLD_CLOSE_TIME
        );
        return getOngoingWorldStatus(duration);
      } else if (
        dateNow.hour() >= OPEN_WORLD_CLOSE_TIME &&
        dateNow.hour() <= OPEN_WORLD_RESET_TIME
      ) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.SATURDAY,
          OPEN_WORLD_CLOSE_TIME,
          OPEN_WORLD_LOCK_TIME
        );
        return getLockedWorldStatus(duration);
      } else {
        let duration = getDuration(
          dateNow,
          daysOfWeek.MONDAY,
          OPEN_WORLD_CLOSE_TIME
        );
        return getOngoingWorldStatus(duration);
      }
    }
    case daysOfWeek.SUNDAY: {
      let duration = getDuration(
        dateNow,
        daysOfWeek.MONDAY,
        OPEN_WORLD_CLOSE_TIME
      );
      return getOngoingWorldStatus(duration);
    }
  }
};

module.exports = {
  setOpenWorldStatus: setOpenWorldStatus
};
