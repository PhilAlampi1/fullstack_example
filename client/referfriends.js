import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './referfriends.html';

Template.referfriends.helpers({
  fbLink: function () {
    var userReferralCode = Session.get('referralCode');
    return getFacebookLink(userReferralCode);
  },
  twitterLink: function () {
    var userReferralCode = Session.get('referralCode');
    return getTwitterLink(userReferralCode);
  },
  liLink: function () {
    var userReferralCode = Session.get('referralCode');
    return getLinkedInLink(userReferralCode);
  },
  getReferralLink: function () {
    var refLink = Meteor.settings.public.BASE_URL + "/r/" + Session.get('referralCode');
    return refLink;
  }
});
