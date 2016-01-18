var Which    = require('./whichModel.js'),
    bluebird = require('bluebird'),
    util     = require('../helpers/util.js');

var selectProperties       = util.selectProperties;
var defaultWhichProps      = util.defaultWhichProperties;
var buildDefaultWhichQuery = util.buildDefaultWhichQuery;

module.exports = {

  /* * * * * * * * * * * * GET HANDLERS * * * * * * * * * * * * */




  /*        Route Handler - GET /api/which

        * Expects an userID parameter in the query string.
            Optional query parameters:

               Parameter       Value         Description
                 resultLimit     [number]      Number of results to return.
                                               Default value: 1
                 createdBy       [userID]      Only return Whiches created by this user.
                                               Default: not used in query unless specified

        * Responds with the oldest Which, not created by userID, not
          yet judged by userID. Optional query parameters change results accordingly.

  */
  getWhich : function (req, res, next) {
    var dbQuery = buildDefaultWhichQuery(req);
    var resultLimit  = Number(req.query.resultLimit) || 1;

    Which.find(dbQuery)
      .sort({createdAt:1}) // oldest first
      .limit(resultLimit)
      .then(function(dbResults){
        res.json( defaultWhichProps(dbResults) );
      })
      .catch(function(err){
        throw err;
      });

  },


  /*        Route Handler - GET /api/which/:whichID

        * Expects no incoming data.
        * Responds with the Which specified by whichID
  */
  getWhichById : function (req, res, next) {
    var whichID  = req.body.whichID;

    Which.findOne({_id: whichID})
      .then(function(dbResults){
        res.json( defaultWhichProps(dbResults) );
      })
      .catch(function(err){
        throw err;
      });
  },


  /*        Route Handler - GET /api/tag/:tagName

        * Expects an userID parameter in the query string.
            Optional query parameters:

               Parameter       Value         Description
                 resultLimit     [number]      Number of results to return.
                                               Default value: 1
                 createdBy       [userID]      Only return Whiches created by this user.
                                               Default: not used in query unless specified

        * Responds with the oldest Which, not created by userID, not
          yet judged by userID, and whose tags array contains tagName.
          Optional query parameters change results accordingly.
  */
  getWhichByTag : function (req, res, next) {
    // console.log('req in getWhichByTag', req); 
    var dbQuery = buildDefaultWhichQuery(req);
    console.log('dbquery get which by tag', dbQuery)
    var resultLimit = Number(req.query.resultLimit) || 1;

    dbQuery.tags = req.body.tagName;
    // dbQuery.friendsOnly= false; 
        console.log('dbquery get which by tag', dbQuery)

    Which.find(dbQuery)
      .limit(resultLimit)
      .sort({createdAt:1}) // oldest first
      .then(function(dbResults){
        console.log('dbResults', dbResults);
        res.json( defaultWhichProps(dbResults) );
      })
      .catch(function(err){
        throw err;
      });
  },


  /*        Route Handler - GET /api/tag/:tagName/newest

        * Expects an userID parameter in the query string.
            Optional query parameters:

               Parameter       Value         Description
                 resultLimit     [number]      Number of results to return.
                                               Default value: 1
                 createdBy       [userID]      Only return Whiches created by this user.
                                               Default: not used in query unless specified

        * Responds with the newest Which, not created by userID, not
          yet judged by userID, and whose tags array contains tagName.
          Optional query parameters change results accordingly.
  */
  getNewestWhichByTag : function (req, res, next) {
    var dbQuery = buildDefaultWhichQuery(req);
    var resultLimit = Number(req.query.resultLimit) || 1;

    dbQuery.tags = req.body.tagName;

    Which.find(query)
      .limit(resultLimit)
      .sort({createdAt:-1}) // newest first
      .then(function(dbResults){
        res.json( defaultWhichProps(dbResults) );
      })
      .catch(function(err){
        throw err;
      });
  },



  /* * * * * * * * * * * * POST HANDLERS * * * * * * * * * * * * * /

  /*        Route Handler - POST /api/which/

        * Expects a Which object with properties enumerated
          in newWhich below
        * Responds with a status code 201 and the newly created Which object
  */
  createWhich : function (req, res, next) {
    var data = req.body;

    var newWhich = {
      question: data.question,
      createdBy: data.createdBy, // userID
      tags: data.tags,
      type : data.type,
      thingA : data.thingA, // either string of text, or url to resource
      thingB : data.thingB,
      friendsOnly: data.friendsOnly
    };

    Which(newWhich).save()
      .then(function(createdWhich){
        if (createdWhich) res.status(201).json( defaultWhichProps(createdWhich) );
      })
      .catch(function(err){
        throw err;
      });
  },


  /*        Route Handler - POST /api/which/:id/judge

        * Expects an object with the properties userID
          and choice. Expects choice to be the string 'A' or 'B'
        * If successful, responds with an object containing
          the current vote counts for both Which choices.
          Sends 409 if the ID is invalid, or the user already judged
  */
  judgeWhich : function (req, res, next) {
    var whichID  = req.body.whichID;
    var choice   = req.body.choice.toUpperCase();
    var userID   = req.body.userID;

    // Find one Which by ID, but only if the user has not previously judged it
    var query = {_id: whichID, votesFrom: {$ne: userID} };

    // If found, increment appropriate VoteCount property, and push user to votesFrom
    var updateCommand = { $inc: {}, $push: {votesFrom: userID} };
    updateCommand.$inc['thing'+ choice + 'VoteCount'] = 1;

    Which.findOneAndUpdate(query, updateCommand, {new:true}) // include updated values in dbResults
      .then(function(dbResults){
        if (!dbResults) res.sendStatus(409) // invalid whichID or user already judged
        else {
          var clientResults = {
            votesForA: dbResults.thingAVoteCount,
            votesForB: dbResults.thingBVoteCount,
          }
          res.json(clientResults);
        }
      })
      .catch(function(err){
        throw err;
      });
  },


  /*        Route Handler - POST /api/which/:id/tag

        * Expects an object with a property tag.
          Expects tag to be a string that does not contain spaces.
        * Responds with an object containing a tagNames property.
          tagNames is an array containing all tags the Which currently has.
  */
  tagWhich : function (req, res, next) {
    var whichID  = req.body.whichID;
    var tag      = req.body.tag;

    var updateCommand = { $addToSet: {"tags": tag} }; // $addToSet will not add the value if it already exists

    Which.findByIdAndUpdate(whichID,updateCommand, {new:true}) // include updated values in dbResults
      .then(function(dbResults){
          var clientResults = {tagNames: dbResults.tags};
          res.json(clientResults);
      })
      .catch(function(err){
        throw err;
      });
  },

  deleteWhich : function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'DELETE');
    var whichID = req.body.whichID
    Which.findByIdAndRemove(whichID, function(err, which){
      if (err) console.log(err);
    })
  },

  getAll : function(req, res, next) {
    Which.find({}, function(err, whiches) {
      if (err) console.log(err);
      var tags = whiches.reduce(function(tags, which) {
        tags[which.tags] = ++tags[which.tags] || 1;
        return tags;
      }, {})
      var topThree = Object.keys(tags).sort(function(a, b) {
        return tags[a] < tags[b];
      }).slice(0,3);
      res.json(topThree);
    })
  }
};
