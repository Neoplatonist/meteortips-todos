Router.route('/', {
  name: 'home',
  template: 'home'
});
Router.route('/register');
Router.route('/login');

Router.configure({
  layoutTemplate: 'main'
});
