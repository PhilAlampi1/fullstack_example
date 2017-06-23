SyncedCron.add({
  name: 'Daily Referral Updates',
  schedule: function(parser) {
    return parser.text('at 9:00 am every 1 day');
    // For Testing:
    // return parser.text('at 7:31 pm');
  },
  job: function() {

    // See which Refering Persons have made an unreported referral that has not unsubscribed
    var activeReferrers = _.uniq(InsiderSignups.find({isReferrerNotified: {$ne: 'TRUE'}, isUnsubscribed: {$ne: "TRUE"}},
    {sort: {isReferredByEmail: 1}, fields: {isReferredByEmail: true}}).fetch().map(function(x) {
      return x.isReferredByEmail;
    }), true);

    // For each Active Referrer:
    try {
      activeReferrers.forEach(function(ar) {
        try {
          var fullReferrerDoc = InsiderSignups.findOne({isEmail: ar}),
          userReferralCode = fullReferrerDoc.isUniqueCode,
          fLink = getFacebookLink(userReferralCode);
          tLink = getTwitterLink(userReferralCode);
          lLink = getLinkedInLink(userReferralCode);
          previousReferralsCtr = 0,
          previousReferralNames = '',
          newReferralsCtr = 0,
          numAllReferals = 0,
          newReferralNames = '',
          allArReferrals = InsiderSignups.find({isReferredByEmail: fullReferrerDoc.isEmail, isUnsubscribed: {$ne: "TRUE"}});

          // For each Waitlist Particpant, add names to appropriate string and increment appropraite counter
          allArReferrals.forEach(function(all) {
            if (all.isReferrerNotified == "TRUE"){
              if (previousReferralNames){
                previousReferralNames += ", " + all.isFirstName;
              } else {
                previousReferralNames += all.isFirstName;
              }
              previousReferralsCtr++;
            } else {
              if (newReferralNames){
                newReferralNames += ", " + all.isFirstName;
              } else {
                newReferralNames += all.isFirstName;
              }
              newReferralsCtr++;
            }
          });
          numAllReferals = previousReferralsCtr + newReferralsCtr;

          // If no previous referrals, we want to show N/A in the email
          if (previousReferralsCtr == 0){
            previousReferralNames = "N/A";
          }

          // Send email to Referrer to give them an update
          console.log("sending email to " + fullReferrerDoc.isEmail + " | " + fullReferrerDoc.isFirstName);
          Email.send({
            to: fullReferrerDoc.isEmail,
            from: 'support@bpofusion.com',
            subject: 'You have new friends that have signed up',
            html:
            '<html xmlns="http://www.w3.org/1999/xhtml">' +
            '<head>' +
            '<meta name="viewport" content="width=device-width"/>' +
            '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>' +
            '<title>HTML email test</title>' +
            '<link href="styles.css" media="all" rel="stylesheet" type="text/css"/>' +
            '<style>p {margin-bottom:1em;}</style>' +
            '</head>' +
            '<p>Hi ' + fullReferrerDoc.isFirstName + ',</p>' +
            '<p>Thank you for helping to spread the word on our upcoming product launch. Here is an update for you: Your Total Referrals: ' + numAllReferals + ', Your Referrals Since Last Update: ' + newReferralsCtr + '. See below for more details.</p>' +
            '<p><strong>Prior waitlist referrals:</strong> ' + previousReferralNames + ' | ' +
            '<strong>New waitlist referrals:</strong> ' + newReferralNames + '</p>' +
            '<p>Remember, the people you referred are not customers yet. Continue to share your referal link below via email, Facebook, Twitter and LinkedIn. For each friend you refer who becomes a customer, you will receive the first $15 they spend in our product in cash and they will get a $15 credit.</p>' +
            '<p>Send friends your referral link*: ' +
            '<strong>' + Meteor.settings.public.BASE_URL + '/r/' + fullReferrerDoc.isUniqueCode + '</strong></p>' +
            '<p>Or click to share on these services*:</p>' +
            '<a target="_blank" href=' + fLink + '>Facebook</a>' +
            '<br><a target="_blank" href=' + tLink + '>Twitter</a>' +
            '<br><a target="_blank" href=' + lLink + '>LinkedIn</a>' +
            '<br><p>*Note, by sharing the link above, you agree to our Referral Program Terms and Conditions located at YOUR_URL. Thanks again for helping to spread the word of our upcoming launch!</p>' +
            '<p>Sincerely,</p><p>YOUR_TEAM</p>' +
            '<br><br><p><i>YOUR_DISCLAIMER_ADDRESS_ETC</i></p>'
            + '</body></html>'
          });

          // Upon successful email, update isReferrerNotified = TRUE in for all referals
          InsiderSignups.update({isReferredByEmail: fullReferrerDoc.isEmail, isReferrerNotified: {$ne: "TRUE"}}, {$set: {isReferrerNotified: "TRUE"}});

          // Update Referring Person total referrals counter
          InsiderSignups.update({isEmail: fullReferrerDoc.isEmail}, {$set: {isTotalReferralsMade: numAllReferals}});

        } catch (e) {
          console.log("Could not loop through Active Referrers: " + e);
        }
      });
    } catch (e) {
      console.log("No active referrers: " + e);
    }

    // After all emails are sent, send yourself an updated report
    var totReferralsSinceLaunch = InsiderSignups.find().count(),
      allInsiderSignups = InsiderSignups.find(),
      allReferrers = InsiderSignups.find({isTotalReferralsMade: {$gt: 0}}, {sort: {isTotalReferralsMade: -1 }}),
      referrerList = '',
      referrerCtr = 0;

      // Set referrer names and # referrals
      allReferrers.forEach(function(allRefs){
        var nameNCount = allRefs.isFirstName + " - " + allRefs.isEmail + " - Total Referrals Made: " + allRefs.isTotalReferralsMade;
        if (referrerList){
        referrerList += ", " + nameNCount;
      } else {
        referrerList += nameNCount;
      }
        referrerCtr++;
      });

      Email.send({
        to: 'ADD_TO_EMAIL',
        from: 'ADD_FROM_EMAIL',
        subject: 'YOUR_PRODUCT Waitlist Summary',
        html:
        '<p>Total Waitlist Signups: ' + totReferralsSinceLaunch + '</p>' +
        '<p>Total Number of Referrers: ' + referrerCtr + ' </p>' +
        '<p>List of all Referrers: ' + referrerList + ' </p>'
      });
      return "REFERRAL CRON FINISHED";
    }
  });
