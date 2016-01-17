var mongoose = require('mongoose');

var User = require('./userModel.js'),
    bluebird = require('bluebird'),
    Which    = require('../which/whichModel.js'),
    util     = require('../helpers/util.js'); 

var buildDefaultWhichQuery = util.buildDefaultWhichQuery; 



module.exports = {

  /*        Route Handler - POST /api/user/signup

        * Expects an object with the properties username
          and password
        * Responds with a 201 status code if successful,
          and 409 if the username already exists
  */
  createUser   : function(req, res, next){
    var user = {
      username: req.body.username,
      password: req.body.password
    };

    User.findOne(user)
      .then(function(dbResults){
        if (dbResults) res.sendStatus(409); // signup failed: user already exists
        else {
          User(user).save()
            .then(function(createdUser){
              res.status(201).json( {id: createdUser._id} ); // signup successful: created
            })
            .catch(function(err){
              throw err;
            });
        }
      })
  },


  /*        Route Handler - POST /api/user/login

        * Expects an object with the properties username
          and password
        * Responds with a 201 status code if successful,
          and 401 if the credentials are invalid
  */
  authenticate : function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({username: username, password: password})
      .then(function(dbResults){
        if (!dbResults) res.sendStatus(401); // unauthorized: invalid credentials
        else res.status(200).json( {id: dbResults._id} ); // login successful
      })
      .catch(function(err){
        throw err;
      });
  },

  /*        Route Handler - POST /api/user/friends

        * Expects an object with the property username
        * Responds with a 200 status code if successful,
          and 400 user isn't found
  */

  addFriend : function(req, res, next){
    var userId= {
      _id: req.body.userId
    }
    var friend= {
      username: req.body.friend
    }

    User.findOne(friend)
      .then(function (dbResults){
        if(!dbResults) res.sendStatus(400); //bad request: that friend isn't in our db!
        else return dbResults; 
      })
      .then(function(friend){
        User.findOne(userId)
          .then(function (dbResults) {  
            if(dbResults.friends.indexOf(friend._id) === -1) {
              dbResults.friends.push(friend._id);
              dbResults.save( function (err) {
                if (err) console.log(err);
                res.sendStatus(200); //great! friend is now saved
              });  
            } else {
              res.sendStatus(200); //friend already exists
            }  
          }); 
      })


  },

  /*        Route Handler - GET /api/user/friends/:userID

        * Expects no incoming data.
        * Responds with an array of friends for user
  */

  getFriendsWhiches : function (req, res, next) {
    var userId = {
      _id: req.query.userId
    };
    console.log('who am i: ', userId); 

    User.findOne(userId)
      .populate('friends')
      .then(function (dbResults){
        if(!dbResults) res.sendStatus(400); //bad request: that user doesn't exist
        else return dbResults.friends; 
      })
      .then (function (friends) {
        console.log('friends', friends); 
        var friendsIds= friends.map(function(friend) {
          return  mongoose.Types.ObjectId(friend._id);
        })
        console.log('friendsIds', friendsIds); 
        var friendsQry= {
          'createdBy': {$in: friendsIds}
        }

        Which.find(friendsQry)
          .sort({createdBy: 1, createdAt: -1}) //asc order of friends, newest whiches first
          .limit(100)
          .then(function (dbResults){
            console.log('friends whiches', dbResults); 
            res.status(200).json(dbResults); 
          })
          .catch(function (err){
            throw err; 
          })
      })
      // .exec(function (err, user) {
      //   if (err) console.log(err);
      //   console.log('the users friends are: ' , user.friends);
      //   //instead of responding, need to kick off a call to the which controller
      //   res.status(200).json(user.friends); 
      // });

  },

  //example of how to get a whiches for a specific userId
  // getWhich : function (req, res, next) {
  //   var dbQuery = buildDefaultWhichQuery(req);
  //   var resultLimit  = Number(req.query.resultLimit) || 1;

  //   Which.find(dbQuery)
  //     .sort({createdAt:1}) // oldest first
  //     .limit(resultLimit)
  //     .then(function(dbResults){
  //       res.json( defaultWhichProps(dbResults) );
  //     })
  //     .catch(function(err){
  //       throw err;
  //     });





   /*        Route Handler - GET /api/user/:userId

        * Expects no incoming data.
        * Responds with an array of users that you can add as a friend
  */

  getUsers: function (req, res, next) {
    User.find({_id: {$ne: req.query.userId}})
      .exec(function (err, users){

        var result= users.reduce(function (usersArr, user){
          usersArr.push(user.username); 
          return usersArr; 
        }, []);
        console.log('result', result); 

        res.status(200).json(result); 


      })
  }


};
