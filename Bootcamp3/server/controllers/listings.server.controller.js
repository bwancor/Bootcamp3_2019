
/* Dependencies */
var mongoose = require('mongoose'), 
    Listing = require('../models/listings.server.model.js'),
    coordinates = require('./coordinates.server.controller.js'),
    config = require('../config/config.js');
    
/*
  In this file, you should use Mongoose queries in order to retrieve/add/remove/update listings.
  On an error you should send a 404 status code, as well as the error message. 
  On success (aka no error), you should send the listing(s) as JSON in the response.

  HINT: if you are struggling with implementing these functions refer back to this tutorial 
  https://www.callicoder.com/node-js-express-mongodb-restful-crud-api-tutorial/
  or
  https://medium.com/@dinyangetoh/how-to-build-simple-restful-api-with-nodejs-expressjs-and-mongodb-99348012925d
  

  If you are looking for more understanding of exports and export modules - 
  https://www.sitepoint.com/understanding-module-exports-exports-node-js/
  or
  https://adrianmejia.com/getting-started-with-node-js-modules-require-exports-imports-npm-and-beyond/
 */

mongoose.connect(config.db.uri, { useNewUrlParser: true });
var Listings = mongoose.model('Listing', Listing.schema);

/* Create a listing */
exports.create = function(req, res, next, params) {
  
  /* Instantiate a Listing */
  var listing = JSON.parse(params);

  var mylisting = new Listing({
          code: listing.code,
          name: listing.name.replace(/\+/g, ' ').replace(/%20/g, ','),
          coordinates: listing.coordinates,
          address: listing.address.replace(/\+/g, ' ').replace(/%20/g, ',')
      }).save();
  
  next();
};

/* Show the current listing */
exports.read = function(req, res) {
  /* send back the listing as json from the request */
  var listing = req.listing
  
  Listings.findOne({ 'code': listing.code }, function(err, foundListing) {
    if (foundListing != null)
      res.json(foundListing);
    else
      res.json('Listing not found: %s', listing.code);
  });
};

/* Update a listing - note the order in which this function is called by the router*/
exports.update = function(req, res, next, params) {
  
  var listing = JSON.parse(params);

  var newListing = new Listing({
          code: listing.code,
          name: listing.name.replace(/\+/g, ' ').replace(/%20/g, ','),
          coordinates: listing.coordinates,
          address: listing.address.replace(/\+/g, ' ').replace(/%20/g, ',')
      });

  /* Replace the listings's properties with the new properties found in req.body */
  Listings.findOne({ 'code': newListing.code }, function(err, foundListing) {
    if (foundListing != null) {
      foundListing.name = newListing.name;
      foundListing.coordinates = newListing.coordinates;
      foundListing.address = newListing.address;
      foundListing.save();
    } 
  });

  next();
};

/* Delete a listing */
exports.delete = function(req, res, next, id) {
  Listings.findOneAndRemove({ 'code': id }, function(err, foundListing) {
    if(foundListing == null) 
      res.json('Listing not found: %s', id);
    else {
      res.json(foundListing);
    }
    
    next();
  });
};

/* Retreive all the directory listings, sorted alphabetically by listing code */
exports.list = function(req, res) {
  Listings.find({ }, 
    function(err, results) {
      if (results != null) res.json(results.sort((a, b) => a.code < b.code ? -1 : +(a.code > b.code)));
      else if (err) { console.log(err); res.json('Unable to retrieve listings.'); }
      else res.json('No listings found.');
    }
  );
};

/* 
  Middleware: find a listing by its ID, then pass it to the next request handler. 

  HINT: Find the listing using a mongoose query, 
        bind it to the request object as the property 'listing', 
        then finally call next
 */
exports.listingByID = function(req, res, next, id) {
  Listings.findOne({'code':id}).exec(function(err, listing) {
    if(listing != null) {
      req.listing = listing;
      next();
    } else {
      res.status(400).send(err);
    }
  });
};