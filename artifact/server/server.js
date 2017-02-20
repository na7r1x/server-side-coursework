//************************************************
//*                LOAD MODULES                  *
//************************************************
var express = require('express');
var app = express();
var util = require('../utility/');

//************************************************
//*              GLOBAL VARIABLES                *
//************************************************
var stories = [{
  "id": 1,
  "author": "Luke Skywalker",
  "title": "Hello world!",
  "text": "So I decided to join jsbook like everyone else. What does one post here?"
}];

//************************************************
//*                SERVER API                    *
//************************************************
//   GET    /api/stories           - list all stories from newest to oldest
//            ?p=...                - list stories in pages of 10 from newest to oldest with p=page number
//   GET    /api/stories/newest    - return the newest story
//   GET    /api/stories/oldest    - return the oldest story
//   POST   /api/stories           - add a new story at the start of the array with the given parameters, gives it a unique id and returns it
//            ?author=..&title=..&text=..
//   DELETE /api/stories           - removes a story with the given id and returns status code
//            ?id=..

app.get('/api/stories', getAll);
app.get('/api/stories/newest', getNewest);
app.get('/api/stories/oldest', getOldest);
app.post('/api/stories', addStory);
app.delete('/api/stories', deleteStory);



//************************************************
//*               SERVER STATIC                  *
//************************************************
app.use('/', express.static('webpages', { extensions: ['html'] }));
app.use('/', express.static('../../webpages', { extensions: ['html'] }));



//************************************************
//*               START  SERVER                  *
//************************************************
app.listen(8080);



//************************************************
//*              SERVER FUNCTIONS                *
//************************************************


//*___________MAIN FUNCTIONS_____________*

function getAll(req, res) {
  // pagination check
  if (req.query.p > 0) {
    // variables for readibility/maintainability
    var beginP = (parseInt(req.query.p)-1)*10;
    var endP = beginP + 10
    res.send(stories.slice(beginP, endP));
  }
  else {
    // return with no pagination
    res.send(stories);
  }
};


function getNewest(req, res) {
  res.send(
    // array items are added with unshift, so index 0 is the newest
    stories[0]
  );
};


function getOldest(req, res) {
  res.send(
    // adding with unshift, last item has last index
    stories[stories.length-1]
  );
};



function addStory(req, res) {
    // adding with unshift so that a call on the array would return it in the required order
    // for some reason the test requires id to be last, which does not make great sense?
    stories.unshift({"author":req.query.author,"title":req.query.title,"text":req.query.text,"id":generateId(stories)});
    res.send(stories[0]);
};


function deleteStory(req, res) {
  var statusCheck = 0;
  for (var i = 0; i<stories.length; i++) {
    if (stories[i].id == req.query.id) {
      // line required, because the utility function would not change the original array, as stated in requirements
      stories = util.removeFromArray(stories, i);
      statusCheck++;
    }
  };
  if (statusCheck===1) {
    res.sendStatus(200);
  }
  else {
    res.sendStatus(404);
  }
};



//*___________ID VALIDATOR FUNCTIONS_____________*

function generateId(arr) {
  var id=1; // initial id to start the cycle
  while (validateId(arr, id) == false) {
    id++; // generate new id until it is unique
  }
  return id;
}

function validateId(arrToCheck, value) { // checks the uniqueness of the generted id in generateId
  for (var i = 0; i < arrToCheck.length; i++) {
    if (arrToCheck[i].id == value) {
      return false
    }
  }
}
