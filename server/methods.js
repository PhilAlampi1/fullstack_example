Meteor.methods({

  // Method for waitlist - called in main.js when someone signs up to help discourage fraud
  checkIPEmailValid: function(doc) {
    check(doc['isEmail'], String);
    check(doc['isFirstName'], String);

    // Check that IP has not been submitted more than 1x before
    var ip = this.connection.clientAddress;
    var ipSignups = InsiderSignups.find({'isIPAddress': ip}).count();
    if (Number(ipSignups) > 0){ // If not, throw error
      throw new Meteor.Error(500, 'Hey', 'no more than one signup per IP address');
    } else { // If so, update document
      doc['isIPAddress'] = ip;
    }

    // Check if email is not a dup
    var dupEmail = InsiderSignups.find({'isEmail': doc['isEmail']}).count();
    if (Number(dupEmail) > 0){
      throw new Meteor.Error(500, 'Hey', 'you have already signed up!');
    }

    // Check if email is valid (call Mailgun API)
    try {
      var mgResult = HTTP.get('https://api.mailgun.net/v3/address/validate', {
        auth: 'api:' + Meteor.settings.public.MAIL_GUN_PUB_KEY,
        params: {address: doc['isEmail']}
      });
      if (!mgResult.data.is_valid){
        throw new Meteor.Error(999, 'Error', 'invalid email address');
      } else {
        // Generate unique code and add to doc
        var uniqueCode = Random.id();
        var codeSignups = InsiderSignups.find({'isUniqueCode': uniqueCode}).count();
        if (codeSignups == 0){
          doc['isUniqueCode'] = uniqueCode;
          return doc;
        } else {
          while (codeSignups > 0){
            uniqueCode = Random.id();
            codeSignups = InsiderSignups.find({'isUniqueCode': uniqueCode}).count();
          }
          doc['isUniqueCode'] = uniqueCode;
          return doc;
        }
      }
    } catch (e) {
      console.log("ERROR IN MAILGUN CHECK: " + e.name + " | " + e.message);
      throw new Meteor.Error(999, 'Error', 'invalid email address');
    }
  },

  // Get Referring Person details when someone comes to main page from a referral link
  getReferringPersonInfo: function (referrerCode) {
    var referringPerson = InsiderSignups.findOne({"isUniqueCode": referrerCode});
    if (referringPerson){
      return referringPerson;
    } else {
      return false;
    }
  },

  waitlistWelcomeEmail: function (id) {
    // Get user's email address
    var wlPerson = InsiderSignups.findOne({"_id": id}),
    userReferralCode = wlPerson.isUniqueCode,
    fLink = getFacebookLink(userReferralCode),
    tLink = getTwitterLink(userReferralCode),
    lLink = getLinkedInLink(userReferralCode);

    Email.send({
      to: wlPerson['isEmail'],
      from: 'support@bpofusion.com',
      subject: 'Thanks for signing up, now help spread the word for cash',
      html:
      '<html xmlns="http://www.w3.org/1999/xhtml">' +
      '<head>' +
      '<meta name="viewport" content="width=device-width"/>' +
      '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>' +
      '<title>HTML email test</title>' +
      '<link href="styles.css" media="all" rel="stylesheet" type="text/css"/>' +
      '<style>p {margin-bottom:1em;}</style>' +
      '</head>' +
      '<body itemscope itemtype="http://schema.org/EmailMessage">'+
      '<p>Hi ' + wlPerson.isFirstName + ',</p>' +
      '<p>Thank you for joining our YOUR_PRODUCT waitlist. We are working hard to launch this product soon and will keep you informed on our progress. In the meantime, we would really appreciate it if you help spread the word; plus you can earn $15 cash for each qualified friend you refer!</p>' +
      '<p>Share your referal link below via email, Facebook, Twitter and LinkedIn. For each friend you refer who becomes a customer, you will receive the first $15 they spend in our product in cash and they will get a $15 credit.</p>' +
      '<p>Send friends your referral link*: ' +
      '<strong>' + Meteor.settings.public.BASE_URL + '/r/' + wlPerson.isUniqueCode + '</strong></p>' +
      '<p>Or click to share on these services*:</p>' +
      '<a target="_blank" href=' + fLink + '>Facebook</a>' +
      '<br><a target="_blank" href=' + tLink + '>Twitter</a>' +
      '<br><a target="_blank" href=' + lLink + '>LinkedIn</a>' +
      '<br><p>*Note, by sharing the link above, you agree to our Referral Program Terms and Conditions located at YOUR_LINK. Thanks again for helping to spread the word of our upcoming launch.</p>' +
      '<p>Sincerely,</p><p>YOUR_TEAM</p>' +
      '<br><br><p><i>YOUR_DISCLAIMER_ADDRESS_ETC</i></p>'
      + '</body></html>'
    });
    return true;
  }
});
