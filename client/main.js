import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

Bert.defaults = {
  hideDelay: 2500,
  style: 'growl-top-right',
  type: 'success'
};

AutoForm.hooks({
  insertInsiderForm:{
    before: {
      insert: function(doc) {
        Meteor.call('checkIPEmailValid', doc, (error, response) => {
          if (error) {
            Bert.alert(error.reason + ", " + error.details, 'danger');
            this.result(false);
          } else if (response) {
            if (Session.get('referredByCode')){
              response['isReferredByCode'] = Session.get('referredByCode');
            }
            if (Session.get('referredByFirstName')){
              response['isReferredByName'] = Session.get('referredByFirstName');
            }
            if (Session.get('referredByEmail')){
              response['isReferredByEmail'] = Session.get('referredByEmail');
            }
            Session.set('referralCode', response['isUniqueCode']);
            this.result(response);
          }
        });
      }
    },
    onSuccess: function(insert, result) {
      Meteor.call('waitlistWelcomeEmail', result, (error, response) => {
        if (error) {
          Bert.alert(error.reason + ", " + error.details, 'danger');
        } else if (response) {
          FlowRouter.go('/referfriends');
        }
      });
    },
    onError: function(insert, error) {
      console.log("onerror error: " + error);
      Bert.alert("An error occurred, please contact us if you need help", 'danger');
      this.resetForm();
    },
  },
});

Template.home.helpers({
  referralPersonName: function (template) {
    if (Session.get('referredByFirstName')){
      return Session.get('referredByFirstName');
    }
  },
  referred: function (template) {
    if (Session.get('referredByFirstName')){
      return true;
    }
  },
});
