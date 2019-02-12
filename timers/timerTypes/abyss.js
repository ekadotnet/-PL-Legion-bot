const moment = require("moment");
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

const resetRemindStatus = () => {
  reminderSent = false;
};

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

const remindSubscribers = () => {
  let role = guild.roles.find(r => r.name === SUBSCRIBER_ROLE);
  let channel = message.guild.channels.find(
    channel => channel.name == `reminder-chan`
  );

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

const setAbyssStatus = () => {
  let dateNow = moment();
  let currentDay = dateNow.day();

  switch (currentDay) {
    case daysOfWeek.MONDAY: {
      let duration = getDuration(dateNow, daysOfWeek.TUESDAY, ABYSS_OPEN_TIME);
      return getPreparingAbyssStatus(duration);
    }
    case daysOfWeek.TUESDAY: {
      if (dateNow.hour() < ABYSS_OPEN_TIME) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.TUESDAY,
          ABYSS_OPEN_TIME
        );
        return getPreparingAbyssStatus(duration);
      } else {
        let duration = getDuration(
          dateNow,
          daysOfWeek.THURSDAY,
          ABYSS_CLOSE_TIME
        );
        return getOngoingAbyssStatus(duration);
      }
    }
    case daysOfWeek.WEDNESDAY: {
      let duration = getDuration(
        dateNow,
        daysOfWeek.THURSDAY,
        ABYSS_CLOSE_TIME
      );
      return getOngoingAbyssStatus(duration);
    }
    case daysOfWeek.THURSDAY: {
      if (dateNow.hour() < ABYSS_CLOSE_TIME) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.THURSDAY,
          ABYSS_CLOSE_TIME
        );
        if (
          dateNow.hour() == ABYSS_CLOSE_TIME - ABYSS_REMIND_OFFSET &&
          !reminderSent
        ) {
          reminderSent = true;
          remindSubscribers();
        }
        return getOngoingAbyssStatus(duration);
      } else if (
        dateNow.hour() == ABYSS_CLOSE_TIME &&
        dateNow.minutes() < ABYSS_CALC_OFFSET
      ) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.THURSDAY,
          ABYSS_CLOSE_TIME,
          ABYSS_CALC_OFFSET
        );
        resetRemindStatus();
        return getCalculatingAbyssStatus(duration);
      } else {
        let duration = getDuration(dateNow, daysOfWeek.FRIDAY, ABYSS_OPEN_TIME);
        return getPreparingAbyssStatus(duration);
      }
    }
    case daysOfWeek.FRIDAY: {
      if (dateNow.hour() < ABYSS_OPEN_TIME) {
        let duration = getDuration(dateNow, daysOfWeek.FRIDAY, ABYSS_OPEN_TIME);
        return getPreparingAbyssStatus(duration);
      } else {
        let duration = getDuration(
          dateNow,
          daysOfWeek.SUNDAY,
          ABYSS_CLOSE_TIME
        );
        return getOngoingAbyssStatus(duration);
      }
    }
    case daysOfWeek.SATURDAY: {
      let duration = getDuration(dateNow, daysOfWeek.SUNDAY, ABYSS_CLOSE_TIME);
      return getOngoingAbyssStatus(duration);
    }
    case daysOfWeek.SUNDAY: {
      if (dateNow.hour() < ABYSS_CLOSE_TIME) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.SUNDAY,
          ABYSS_CLOSE_TIME
        );
        if (
          dateNow.hour() == ABYSS_CLOSE_TIME - ABYSS_REMIND_OFFSET &&
          !reminderSent
        ) {
          reminderSent = true;
          remindSubscribers();
        }
        return getOngoingAbyssStatus(duration);
      } else if (
        dateNow.hour() == ABYSS_CLOSE_TIME &&
        dateNow.minutes() < ABYSS_CALC_OFFSET
      ) {
        let duration = getDuration(
          dateNow,
          daysOfWeek.SUNDAY,
          ABYSS_CLOSE_TIME,
          ABYSS_CALC_OFFSET
        );
        resetRemindStatus();
        return getCalculatingAbyssStatus(duration);
      } else {
        let duration = getDuration(
          dateNow,
          daysOfWeek.TUESDAY,
          ABYSS_OPEN_TIME
        );
        return getPreparingAbyssStatus(duration);
      }
    }
  }
};

module.exports = {
  setAbyssStatus: setAbyssStatus
};
