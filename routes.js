Router.route('/', {
  name: 'home',
  template: 'home'
});
Router.route('/register');
Router.route('/login');

// Creates Route /list/ObjId(nP9fwhphXNhbWwgk7)
Router.route('/list/:_id', {
  name: 'listPage',
  template: 'listPage',
  data: function(){
    var currentList = this.params._id; // grabs list objectId
    var currentUser = Meteor.userId();
    // Pulls list ids from database per current user
    return Lists.findOne({ _id: currentList, createdBy: currentUser });
  },
  onBeforeAction: function(){
    var currentUser = Meteor.userId();
    if(currentUser){
      this.next(); // lets router continue normal route
    } else {
      this.render("login"); // if not logged in redirect to login page
    }
  }
});

Router.configure({
  layoutTemplate: 'main'
});
