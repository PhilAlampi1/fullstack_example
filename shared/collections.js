InsiderSignups = new Mongo.Collection("InsiderSignups");
// SimpleSchema.debug = true;

InsiderSignups.allow({
  insert() { return true; },
});
InsiderSignups.deny({
  update() { return true; },
  remove() { return true; },
});

InsiderSignupsSchema = new SimpleSchema ({
  isCreatedOn: {
    type: Date,
    label: "Created On",
    optional: true,
    autoform: {
      type: "hidden",
      omit: true
    },
    // Force value to be current date (on server) upon insert and prevent updates afterwards
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  isLastModifiedOn: {
    type: Date,
    label: "Modified On",
    optional: true,
    autoform: {
      type: "hidden",
      omit: true
    },
    // Force value to be current date (on server) upon insert and prevent updates afterwards
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true,
  },
  isFirstName: {
    type: String,
    label: "First Name",
    optional: false
  },
  isEmail: {
    type: String,
    label: "Email",
    optional: false
  },
  isIPAddress: {
    type: String,
    label: "IP Address",
    optional: false
  },
  isUniqueCode: {
    type: String,
    label: "Unique Code",
    optional: true
  },
  isReferredByEmail: {
    type: String,
    label: "Referred By Email",
    optional: true
  },
  isReferredByName: {
    type: String,
    label: "Referred By Name",
    optional: true
  },
  isReferredByCode: {
    type: String,
    label: "Referred By ID",
    optional: true
  },
  isReferrerNotified: {
    type: String,
    label: "Referrer Notified",
    optional: true
  },
  isTotalReferralsMade: {
    type: Number,
    label: "Total Referrals Made",
    optional: true
  },
  isUnsubscribed: {
    type: String,
    label: "Unsubscribed",
    optional: true
  }
});

InsiderSignups.attachSchema(InsiderSignupsSchema);
