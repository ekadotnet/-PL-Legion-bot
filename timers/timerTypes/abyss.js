const moment = require("moment");
const sender = require("../../commands/shared/sender.js");
const { getDuration } = require("../duration.js");
const {
  daysOfWeek,
  ABYSS_OPEN_TIME,
  ABYSS_CLOSE_TIME,
  ABYSS_CALC_OFFSET,
  ABYSS_REMIND_OFFSET,
  SUBSCRIBER_ROLE,
  SUBSCRIBER_MSG
} = require("../constants");

var reminderSent = false;

const addSubscriber = async message => {
  let role = message.guild.roles.find(r => r.name === SUBSCRIBER_ROLE);
  let member = message.member;
  let msg = `<@${message.author.id}> succesfuly subscribed to timers`;

  member.addRole(role).then(
    () => handler.onResolved(addSubscriber),
    reason =>
      handler.onRejected(reason, addSubscriber, {
        guild: message.guild.name,
        member: message.member.nickname
      })
  );
  await sender.sendMessage(channel, msg);
};

const resetRemindStatus = () => {
  reminderSent = false;
};

const remindSubscribers = guild => {
  let role = guild.roles.find(r => r.name === SUBSCRIBER_ROLE);
  let channel = guild.channels.find(channel => channel.name == `reminder-chan`);

  sender.sendRoleMention(channel, role, SUBSCRIBER_MSG);
};

const getOngoingAbyssStatus = duration => {
  return `🔥❗❗ Ongoing ${duration}`;
};

const getPreparingAbyssStatus = duration => {
  return `🔥💤 Preparing ${duration}`;
};

const getCalculatingAbyssStatus = duration => {
  return `🔥⏳ Calculating ${duration}`;
};

const handleAbyssOpenDay = (dateNow, currentDay, closeDay) => {
  if (dateNow.hour() < ABYSS_OPEN_TIME) {
    let duration = getDuration(dateNow, currentDay, ABYSS_OPEN_TIME);
    return getPreparingAbyssStatus(duration);
  } else {
    let duration = getDuration(dateNow, closeDay, ABYSS_CLOSE_TIME);
    return getOngoingAbyssStatus(duration);
  }
};

const handleAbyssCloseDay = (dateNow, currentDay, openDay) => {
  if (dateNow.hour() < ABYSS_CLOSE_TIME) {
    let duration = getDuration(dateNow, currentDay, ABYSS_CLOSE_TIME);
    if (
      dateNow.hour() == ABYSS_CLOSE_TIME - ABYSS_REMIND_OFFSET &&
      !reminderSent
    ) {
      reminderSent = true;
      remindSubscribers(guild);
    }
    return getOngoingAbyssStatus(duration);
  } else if (
    dateNow.hour() == ABYSS_CLOSE_TIME &&
    dateNow.minutes() < ABYSS_CALC_OFFSET
  ) {
    let duration = getDuration(
      dateNow,
      currentDay,
      ABYSS_CLOSE_TIME,
      ABYSS_CALC_OFFSET
    );
    resetRemindStatus();
    return getCalculatingAbyssStatus(duration);
  } else {
    let duration = getDuration(dateNow, openDay, ABYSS_OPEN_TIME);
    return getPreparingAbyssStatus(duration);
  }
};

const handleAbyssPreparingDay = (dateNow, openDay) => {
  let duration = getDuration(dateNow, openDay, ABYSS_OPEN_TIME);
  return getPreparingAbyssStatus(duration);
};

const handleAbyssOngoingDay = (dateNow, closeDay) => {
  let duration = getDuration(dateNow, closeDay, ABYSS_CLOSE_TIME);
  return getOngoingAbyssStatus(duration);
};

const setAbyssStatus = () => {
  let dateNow = moment();
  let currentDay = dateNow.day();

  switch (currentDay) {
    case daysOfWeek.MONDAY: {
      return handleAbyssOpenDay(dateNow, currentDay);
    }
    case daysOfWeek.TUESDAY: {
      return handleAbyssOngoingDay(dateNow, daysOfWeek.WEDNESDAY);
    }
    case daysOfWeek.WEDNESDAY: {
      return handleAbyssCloseDay(dateNow, currentDay, daysOfWeek.FRIDAY);
    }
    case daysOfWeek.THURSDAY: {
      return handleAbyssPreparingDay(dateNow, daysOfWeek.FRIDAY);
    }
    case daysOfWeek.FRIDAY: {
      return handleAbyssOpenDay(dateNow, currentDay, daysOfWeek.SUNDAY);
    }
    case daysOfWeek.SATURDAY: {
      return handleAbyssOngoingDay(dateNow, daysOfWeek.SUNDAY);
    }
    case daysOfWeek.SUNDAY: {
      return handleAbyssCloseDay(dateNow, currentDay, daysOfWeek.TUESDAY);
    }
  }
};

module.exports = {
  setAbyssStatus: setAbyssStatus
};
