// Global functions for mReferralUpdateCron.js, methods.js (waitlistWelcomeEmail) and referfriends.js
getFacebookLink = function(userReferralCode) {
  return "https://www.facebook.com/dialog/feed?app_id=184683071273&link=www.YOUREXAMPLETEST.com%2Fr%2F" + userReferralCode + "&picture=https%3A%2F%2Fpreview.ibb.co%2FkcSqNa%2Ffb_Background1.jpg&name=YOUR%20CATCHY%20HEADLINE&caption=%20&description=MORE%20COPY%20ABOUT%20YOUR%20PRODUCT%20OR%20OFFER.&redirect_uri=http%3A%2F%2Fwww.facebook.com%2F";
}
getTwitterLink = function(userReferralCode) {
  return "https://twitter.com/home?status=Looking%20forward%20to%20YOUR%20PRODUCT%20NAME%20launching!%20Use%20my%20link%20and%20save%20%2415%3A%20www.YOUREXAMPLETEST.com/r/" + userReferralCode;
}
getLinkedInLink = function(userReferralCode) {
  return"https://www.linkedin.com/shareArticle?mini=true&url=https://www.YOUREXAMPLETEST.com/r/" + userReferralCode + "&title=Looking%20forward%20to%20YOUR%20PRODUCT%20NAME%20launching!%20Use%20this%20link%20and%20save%20%2415.&summary=Be%20the%20first%20to%20know%20when%20it%20is%20ready.&source=BPO%20Fusion";
}
