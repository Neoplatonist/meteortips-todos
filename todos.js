Todos = new Mongo.Collection('todos');
Lists = new Mongo.Collection('lists');

if (Meteor.isClient) {
  // client code goes here

  // returns all of the documents from the "Todos" Collection
  Template.todos.helpers({
    'todo': function() {
      var currentList = this._id;
      var currentUser = Meteor.userId();
      return Todos.find({ listId: currentList, createdBy: currentUser }, {sort: {createdAt: -1}});
    }
  });

  // Ticks input checkbox if in db completed is set to true
  Template.todoItem.helpers({
    'checked': function(){
      var isCompleted = this.completed;
      if(isCompleted){
        return "checked";
      } else {
        return "";
      }
    }
  });

  // counts the total todos and how many completed
  Template.todosCount.helpers({
    'totalTodos': function(){
      var currentList = this._id;
      return Todos.find({ listId: currentList}).count();
    },
    'completedTodos': function(){
      var currentList = this._id;
      return Todos.find({ listId: currentList, completed: true }).count();
    }
  });

  // retrieves the list from the "Lists" Collection
  Template.lists.helpers({
    'list': function(){
      var currentUser = Meteor.userId();
      return Lists.find({ createdBy: currentUser }, {sort: { name: 1 }});
    }
  });

  // submits new task to the "Todos" Collection
  Template.addTodo.events({
    // events go here
    'submit form': function(event){
      event.preventDefault();
      var todoName = $('[name="todoName"]').val();
      var currentUser = Meteor.userId();
      var currentList = this._id;
      Todos.insert({
        name: todoName,
        completed: false,
        createdAt: new Date(),
        createdBy: currentUser,
        listId: currentList
      });
      // .val('') resets the input field to an empty value
      $('[name="todoName"]').val('');
    }
  });

  // deletes select task
  Template.todoItem.events({
    // change watches for changes on the checkbox
   'change [type=checkbox]': function(){
     var documentId = this._id;
     var isCompleted = this.completed;
     if(isCompleted){
       Todos.update({ _id: documentId }, {$set: { completed: false }});
       console.log("Task marked as incomplete.");
     } else {
       Todos.update({ _id: documentId }, {$set: { completed: true }});
       console.log("Task marked as complete.");
     }
   },
   'click .delete-todo': function(event){
     event.preventDefault();
     var documentId = this._id;
     var confirm = window.confirm("Delete this task?");
     if(confirm){
       Todos.remove({ _id: documentId });
     }
   },
   // the keyup allows the name to be saved automatically
   // keyup - event executes immediately after key pressed
   // keydown - event executes repeatedly as user presses key. Holding down the key triggers event repeatedly.
   // keypress - event executes when a user presses a key. Event does not repeat until key pressed again.
   'keyup [name=todoItem]': function(event){
     // when Enter/Return(13) or Escape(27) is pressed the input field loses focus
     if(event.which == 13 || event.which == 27){
       $(event.target).blur();
     } else {
       var documentId = this._id;
       var todoItem = $('[name=todoItem]').val();
       Todos.update({ _id: documentId }, {$set: { name: todoItem }});
     }
   }
  });

  // Allows user to create a list without submit button
  Template.addList.events({
    'submit form': function(event){
      event.preventDefault();
      var listName = $('[name=listName]').val();
      var currentUser = Meteor.userId();
      Lists.insert({
        name: listName,
        createdBy: currentUser
      }, function(error, results){
        // after creating new list user is redirected to created list
        Router.go('listPage', { _id: results });
      });
      // .val('') resets the input field to an empty value
      $('[name="listName"]').val('');
    }
  });

  // Allows user to logout
  Template.navigation.events({
    'click .logout': function(event){
      event.preventDefault();
      Meteor.logout();
    }
  });

  // Creates user accounts
  Template.register.events({
    'submit form': function(){
      event.preventDefault();

    }
  });

  // Allows user to login and validates with Accounts Package
  Template.login.events({
    'submit form': function(event){
      event.preventDefault();

    }
  });

  Template.register.onRendered(function(){
    var validator = $('.register').validate({
      submitHandler: function(event){
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Accounts.createUser({
          email: email,
          password: password
        }, function(error){
          if(error){
            if(error.reason == "Email already exists."){
              validator.showErrors({
                email: "That email already belongs to a registered user."
              });
            }
          } else {
            Router.go('home');
          }
        });
      }
    });
  });

  Template.login.onRendered(function(){
    var validator = $('.login').validate({
      submitHandler: function(event){
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        // lets meteor handle logic and validation
        Meteor.loginWithPassword(email, password, function(error){
          if(error){
            if(error.reason == "User not found"){
              validator.showErrors({
                email: "That email doesn't belond to a registered user."
              });
            }
            if(error.reason == "Incorrect password"){
              validator.showErrors({
                password: "You entered an incorrect password."
              });
            }
          } else {
            // redirects you to home page from login...if not on login it lets you stay on current page
            var currentRoute =  Router.current().route.getName();
            if(currentRoute == "login"){
              Router.go("home");
            }
          }
        });
      }
    });
  });

  $.validator.setDefaults({
    rules: {
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 6
      }
    },
    messages: {
      email: {
        required: "You must enter an email address.",
        email: "You've entered an invalid email address."
      },
      password: {
        required: "You must enter a password.",
        minlength: "Your password must be at least {0} characters."
      }
    }
  });


}

if (Meteor.isServer) {
 // server code goes here
}
