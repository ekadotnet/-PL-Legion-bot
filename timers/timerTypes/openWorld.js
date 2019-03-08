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

const handleResetDay = (dateNow, currentDay, nextReset) => {
  if (dateNow.hour() < OPEN_WORLD_CLOSE_TIME) {
    let duration = getDuration(dateNow, currentDay, OPEN_WORLD_CLOSE_TIME);
    return getOngoingWorldStatus(duration);
  } else if (
    dateNow.hour() >= OPEN_WORLD_CLOSE_TIME &&
    dateNow.hour() <= OPEN_WORLD_RESET_TIME
  ) {
    let duration = getDuration(
      dateNow,
      currentDay,
      OPEN_WORLD_CLOSE_TIME,
      OPEN_WORLD_LOCK_TIME
    );
    return getLockedWorldStatus(duration);
  } else {
    let duration = getDuration(dateNow, nextReset, OPEN_WORLD_CLOSE_TIME);
    return getOngoingWorldStatus(duration);
  }
};

const handleOngoingDay = (dateNow, nextReset) => {
  let duration = getDuration(dateNow, nextReset, OPEN_WORLD_CLOSE_TIME);
  return getOngoingWorldStatus(duration);
};

const setOpenWorldStatus = () => {
  let dateNow = moment();
  let currentDay = dateNow.day();

  switch (currentDay) {
    case daysOfWeek.MONDAY: {
      return handleResetDay(dateNow, currentDay, daysOfWeek.THURSDAY);
    }
    case daysOfWeek.TUESDAY: {
      return handleOngoingDay(dateNow, daysOfWeek.THURSDAY);
    }
    case daysOfWeek.WEDNESDAY: {
      return handleOngoingDay(dateNow, daysOfWeek.THURSDAY);
    }
    case daysOfWeek.THURSDAY: {
      return handleResetDay(dateNow, currentDay, daysOfWeek.SATURDAY);
    }
    case daysOfWeek.FRIDAY: {
      return handleOngoingDay(dateNow, daysOfWeek.SATURDAY);
    }
    case daysOfWeek.SATURDAY: {
      return handleResetDay(dateNow, currentDay, daysOfWeek.MONDAY);
    }
    case daysOfWeek.SUNDAY: {
      return handleOngoingDay(dateNow, daysOfWeek.MONDAY);
    }
  }
};

module.exports = {
  setOpenWorldStatus: setOpenWorldStatus
};
