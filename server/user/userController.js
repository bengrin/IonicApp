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


  /*        Route Handler - POST /api/user/friend

        * Expects an object with the properties userId, and friendId
        * Responds with a 200 status code if successful,
          and 400 if user can't be found
  */

  deleteFriend : function(req, res, next){
    var userId= {
      _id: req.body.userId
    }

    User.findOneAndUpdate(userId)
      .then (function (dbResults){
        if(!dbResults) res.sendStatus(400); //bad request: couldn't delete friend
        dbResults.friends.some(function (friendId, idx)  {
          if(String(friendId)=== String(req.body.friendId)) {
            dbResults.friends.splice(idx,1); 
            dbResults.save(); 
            return true;
          }
          return false; 
        })
        res.sendStatus(200); //friend is now deleted
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
        var uniqueFriends= friends.reduce(function (unique, friend) {
          unique.push({id: friend._id, username: friend.username});
          return unique;  
        }, []); 
        console.log('unique friends', uniqueFriends); 

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
            var results= {
              whiches: dbResults,
              uniqueFriends: uniqueFriends
            }
            res.status(200).json(results); 
          })
          .catch(function (err){
            throw err; 
          })
      })

  },


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
