Meteor.publish('the_contacts', function(){
    var currentUserId = this.userId;
    return contactList.find({createdBy:this.userId},{sort:{date:-1},limit:10});
  });