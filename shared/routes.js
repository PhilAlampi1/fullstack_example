FlowRouter.route('/', {
  name:'/',
  action() {
    GAnalytics.pageview();
    BlazeLayout.render('layout', { top: "navbar", main: "home", bottom: "footer"});
  }
});

FlowRouter.route('/r/:friendcode', {
  name:'homewithcode',
  action(params) {
    GAnalytics.pageview();
    if (params.friendcode){
      console.log("calling method");
      Meteor.call("getReferringPersonInfo", params.friendcode, function (error, response) {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else if (response !== false){
          console.log("RETURNED: " + response['isUniqueCode'] + " | " + response['isFirstName'] + " | " + response['isEmail']);
          Session.set('referredByCode', response['isUniqueCode']);
          Session.set('referredByFirstName', response['isFirstName']);
          Session.set('referredByEmail', response['isEmail']);
        }
        FlowRouter.go('/');
      });
    } else {
      FlowRouter.go('/');
    }
  }
});

FlowRouter.route('/referfriends', {
  name:'referfriends',
  action() {
    GAnalytics.pageview();
    if (!Session.get('referralCode')){
      console.log("Session: " + Session.get('referralCode'));
      FlowRouter.go("/");
    } else {
      BlazeLayout.render('layout', { top: "navbar", main: "referfriends", bottom: "footer"});
    }
  }
});

FlowRouter.route('/privacy', {
  name:'privacy',
  action() {
    GAnalytics.pageview();
    BlazeLayout.render('layout', { top: "navbar", main: "privacy", bottom: "footer"});
  }
});

FlowRouter.route('/terms', {
  name:'terms',
  action() {
    GAnalytics.pageview();
    BlazeLayout.render('layout', { top: "navbar", main: "terms", bottom: "footer"});
  }
});

FlowRouter.route('/rterms', {
  name:'rterms',
  action() {
    GAnalytics.pageview();
    BlazeLayout.render('layout', { top: "navbar", main: "rterms", bottom: "footer"});
  }
});

FlowRouter.route('/login', {
  name:'login',
  action() {
    GAnalytics.pageview();
    BlazeLayout.render('layout', { top: "navbar", main: "login", bottom: "footer"});
  }
});
