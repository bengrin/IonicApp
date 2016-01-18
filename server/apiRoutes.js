var whichController = require('./which/whichController.js');
var userController = require('./user/userController.js');

module.exports = function (apiRouter) {

  /*     Routes beginning with /api/which

       See documentation at corresponding
       function in whichController.js
  */
  apiRouter.get( '/which',          whichController.getWhich);
  apiRouter.get( '/which/:whichID', whichController.getWhichById);

  apiRouter.post('/which',                whichController.createWhich);
  apiRouter.post('/which/:whichID/judge', whichController.judgeWhich);
  apiRouter.post('/which/:whichID/tag',   whichController.tagWhich);

  apiRouter.get('/tag/:tagName',        whichController.getWhichByTag);
  apiRouter.get('/tag/:tagName/newest', whichController.getNewestWhichByTag);

  apiRouter.delete('/which/:whichID', whichController.deleteWhich);
  apiRouter.get('/tags', whichController.getAll);

  /*     Routes beginning with /api/user
       See documentation at corresponding
       function in userController.js
  */
  apiRouter.post( '/user/signup', userController.createUser);
  apiRouter.post( '/user/login', userController.authenticate);
  apiRouter.get('/users', userController.getUsers); 




  apiRouter.get( '/user/friends', userController.getFriendsWhiches); 
  apiRouter.post( '/user/friends', userController.addFriend);
  apiRouter.post('/user/friend', userController.deleteFriend);  


  /*   For all dynamic routes containing a :whichID or :tagName,
       before passing the request along to its handler
       create a property on req.body of the same name,
       containing the dynamic value
  */
  apiRouter.param('tagName', function(req, res, next, tagName){
    req.body.tagName = tagName;
    next();
  });
  apiRouter.param('whichID', function(req, res, next, whichID){
    req.body.whichID = whichID;
    next();
  });
};
