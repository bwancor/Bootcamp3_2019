//This file holds any configuration variables we may need 
//'config.js' is ignored by git to protect sensitive information, such as your database's username and password
//copy this file's contents to another file 'config.js' and store your MongoLab uri there

module.exports = {
  db: {
    uri: 'mongodb+srv://bcorrea:bcorrea1@cen3031-1nzo0.azure.mongodb.net/test?retryWrites=true&w=majority'//place the URI of your mongo database here.
  }, 
  openCage: {
    key: '3d351ab365834b49bb0022be32e303fe' //place your openCage public key here - Sign-up for a free key https://opencagedata.com/
  },
  port: 8080
};