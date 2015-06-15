contactList=new Mongo.Collection('contactlist')
if (Meteor.isClient) {
  // counter starts at 0
  Template.contacts.onCreated( function() {
  this.subscribe("the_contacts");
});

Template.contacts.viewmodel({
  contactList: function() {
    return contactlist.find();
  },
  name: '',
  number: '',
  canAddContact: function() {
    return !!this.name() && !!this.number() && Contacts.find().count() <= 10;
  },
  addContact: function() {
    if (this.canAddContact()) {
      Contacts.insert({
      name: this.name(),
        number: this.number()
      });
      this.name('');
      this.number('');
    }
  },
  tryAdd: false,
  errorText: function() {
    if (this.tryAdd() && !this.canAddContact()) {
      if (Contacts.find().count() >= 10) {
        return "Can't have more than 10 contacts";
      } else {
        return "Name and Number are required";
      }
    } else {
      return '';
    }
  }
}, 'contactList');

Template.contact.viewmodel( function(data) { return data; }, {
  contact: function() {
    return Contacts.findOne(this._id());
  },
  "delete": function() {
    Contacts.remove(this._id());
  },
  editMode: false,
  numberFocus: false,
  edit: function() {
    this.name(this.contact().name);
    this.number(this.contact().number);
    this.editMode(true);
    this.numberFocus(true);
  },
  showControls: false,
  cancel: function() {
    this.editMode(false);
  },
  canUpdate: function() {
    return !!this.name() && !!this.number();
  },
  update: function() {
    Contacts.update(this._id(), {
      $set: {
        name: this.name(),
        number: this.number()
      }
    });
    this.editMode(false);
  }
});

}

if (Meteor.isServer) {
  Meteor.publish('the_contacts', function(){
    var currentUserId = this.userId;
    return contactList.find({createdBy:this.userId},{sort:{date:-1},limit:10});
  });
}
