import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  process.env.MAIL_URL = Meteor.settings.private.SMTP_URL;
});

SyncedCron.start();
