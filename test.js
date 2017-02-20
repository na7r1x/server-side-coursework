"use strict";

require('./logger').setupLogging(QUnit, test);

var fs = require('fs');
var http = require('http');

var root = "./artifact/"

var pathServer = root + "server/";
var pathServerPackage = pathServer + "package.json";

var pathUtil = root + "utility/";
var pathUtilPackage = pathUtil + "package.json";

QUnit.module("Coursework2");



/**
 * Given an assert object and a path, this will cause Qunit
 * to fail if the path is not present.
 */
function testPathExists(assert, path) {
    try {
        fs.accessSync(path, fs.F_OK);
        assert.ok(true, path + " created");
      } catch (e) {
        assert.ok(false, path + " is missing - please create it");
      }
}

/**
 * You will be developing both a utility module and a web server,
 * all of your work should exist under a folder called artifact.
 * Create these folders!
 */
QUnit.test(
  "Create folders.",
  function(assert) {
      testPathExists(assert, root);
      testPathExists(assert, pathUtil);
      testPathExists(assert, pathServer);
   }
);


/**
 * In the utility folder, create a package.json file, so that
 * it can be managed by NPM.  The package should be named
 * uupxxxxxx.  That's a 'u' followed by your student ID, all in
 * lower case.  Remember that if you're at the command line and
 * cd to this folder npm test won't work until you cd up a
 * level (because the more local npm test (which is undefined
 * by default) will be chosen).
 */
QUnit.test(
  "Add a package.json to the utility folder.",
  function (assert) {
    var pkg = require(pathUtilPackage);
    assert.equal(
      pkg.name.toLowerCase(),
      "u" + id().toLowerCase(),
      "Utility package name should be uupxxxxxx where xxxxxx is your id number (i.e. u" + id().toLowerCase() + ")."
    );

  }
);


/**
 * In the server folder, create a package.json file, so that
 * it can be started by NPM.  The server should be named
 * supxxxxxx.  That's an 's' followed by your student ID, all in
 * lower case.
 */
QUnit.test(
  "Add a package.json to the server folder.",
  function (assert) {
    var pkg = require(pathServerPackage);
    assert.equal(
      pkg.name.toLowerCase(),
      "s" + id().toLowerCase(),
      "Server package name should be supxxxxxx where xxxxxx is your id number (i.e. s" + id().toLowerCase() + ")."
    );
    assert.ok(
      pkg.main,
      "You must specify 'main' in your server package.json - it should specify which code to run when running the server (e.g. 'server.js')."
    );
  }
);



/**
 * Create a web server with express, with an API as described
 * in the README.
 *
 * The server should respond to requests on `/api/stories`.
 *
 * The web server has to listen on port 8080. Running `npm test`
 * will start the server so it should not be running already.
 *
 * Running the tests starts your web server, but if you want to
 * try it in your browser, you need to start the web server
 * explicitly, with the command `node artifact/server`
 */
var initial = {
  "id": 1,
  "author": "Luke Skywalker",
  "title": "Hello world!",
  "text": "So I decided to join jsbook like everyone else. What does one post here?"
};

var stories = [ initial ];

var api = '/api/stories';
var apiN = api + '/newest';
var apiO = api + '/oldest';

test(
  `Initial response to ${api}`,
  function () {
    console.log('starting server, if you see EADDRINUSE errors, something is blocking port 8080.');
    require(pathServer);
    testJSONResponse(
      'GET',
      api,
      stories,
      'initially, there should be just one story by Luke Skywalker, copied from the README');
  }
);

test(
  `Initial response to ${apiN} and ${apiO}`,
  function () {
    testJSONResponse(
      'GET',
      apiN,
      initial,
      'initially, the newest story should be by Luke Skywalker, copied from the README')
    .then(function() {
      return testJSONResponse(
        'GET',
        apiO,
        initial,
        'initially, the oldest story should be by Luke Skywalker, copied from the README');
    });
  }
);

test(
  "Adding stories",
  function () {
    var expected = {
      "author": "a",
      "title": "t1",
      "text": "t2 t3"
    };
    var i = 1;
    function newExpected() {
      i++;
      return {
        "author": "a" + i,
        "title": "t" + i,
        "text": "text" + i
      };
    };

    testJSONResponse(
      'POST',
      api+'?author=a&title=t1&text=t2+t3',
      function(json) {
        notEqual(json.id, 1, 'a newly submitted story cannot have the id 1');
        expected.id = json.id;
        stories.unshift(expected);
        return expected;
      },
      'a newly submitted story must match the submitted data, with a new ID'
    )
    .then(function() {
      return testJSONResponse(
        'GET',
        apiO,
        initial,
        'after submitting a story, the oldest story should still be by Luke Skywalker');
    })
    .then(function() {
      return testJSONResponse(
        'GET',
        apiN,
        expected,
        'after submitting a story, the newest story must match the submitted data');
    })
    .then(function() {
      return testJSONResponse(
        'GET',
        api,
        stories,
        `after submitting a story, ${api} should list all from newest to oldest`);
    })

    // now add 12 more stories
    .then(function() {
      var exp = newExpected();
      return testJSONResponse(
        'POST',
        `${api}?author=${exp.author}&title=${exp.title}&text=${exp.text}`,
        function(json) {
          notEqual(json.id, stories[0].id, 'a newly submitted story cannot have the same id as a story before');
          exp.id = json.id;
          stories.unshift(exp);
          return exp;
        },
        `a newly submitted story (${i})must match the submitted data, with a new ID`
      )
    })
    .then(function() {
      var exp = newExpected();
      return testJSONResponse(
        'POST',
        `${api}?author=${exp.author}&title=${exp.title}&text=${exp.text}`,
        function(json) {
          notEqual(json.id, stories[0].id, 'a newly submitted story cannot have the same id as a story before');
          exp.id = json.id;
          stories.unshift(exp);
          return exp;
        },
        `a newly submitted story (${i})must match the submitted data, with a new ID`
      )
    })
    .then(function() {
      var exp = newExpected();
      return testJSONResponse(
        'POST',
        `${api}?author=${exp.author}&title=${exp.title}&text=${exp.text}`,
        function(json) {
          notEqual(json.id, stories[0].id, 'a newly submitted story cannot have the same id as a story before');
          exp.id = json.id;
          stories.unshift(exp);
          return exp;
        },
        `a newly submitted story (${i})must match the submitted data, with a new ID`
      )
    })
    .then(function() {
      var exp = newExpected();
      return testJSONResponse(
        'POST',
        `${api}?author=${exp.author}&title=${exp.title}&text=${exp.text}`,
        function(json) {
          notEqual(json.id, stories[0].id, 'a newly submitted story cannot have the same id as a story before');
          exp.id = json.id;
          stories.unshift(exp);
          return exp;
        },
        `a newly submitted story (${i})must match the submitted data, with a new ID`
      )
    })
    .then(function() {
      var exp = newExpected();
      return testJSONResponse(
        'POST',
        `${api}?author=${exp.author}&title=${exp.title}&text=${exp.text}`,
        function(json) {
          notEqual(json.id, stories[0].id, 'a newly submitted story cannot have the same id as a story before');
          exp.id = json.id;
          stories.unshift(exp);
          return exp;
        },
        `a newly submitted story (${i})must match the submitted data, with a new ID`
      )
    })
    .then(function() {
      var exp = newExpected();
      return testJSONResponse(
        'POST',
        `${api}?author=${exp.author}&title=${exp.title}&text=${exp.text}`,
        function(json) {
          notEqual(json.id, stories[0].id, 'a newly submitted story cannot have the same id as a story before');
          exp.id = json.id;
          stories.unshift(exp);
          return exp;
        },
        `a newly submitted story (${i})must match the submitted data, with a new ID`
      )
    })
    .then(function() {
      var exp = newExpected();
      return testJSONResponse(
        'POST',
        `${api}?author=${exp.author}&title=${exp.title}&text=${exp.text}`,
        function(json) {
          notEqual(json.id, stories[0].id, 'a newly submitted story cannot have the same id as a story before');
          exp.id = json.id;
          stories.unshift(exp);
          return exp;
        },
        `a newly submitted story (${i})must match the submitted data, with a new ID`
      )
    })
    .then(function() {
      var exp = newExpected();
      return testJSONResponse(
        'POST',
        `${api}?author=${exp.author}&title=${exp.title}&text=${exp.text}`,
        function(json) {
          notEqual(json.id, stories[0].id, 'a newly submitted story cannot have the same id as a story before');
          exp.id = json.id;
          stories.unshift(exp);
          return exp;
        },
        `a newly submitted story (${i})must match the submitted data, with a new ID`
      )
    })
    .then(function() {
      var exp = newExpected();
      return testJSONResponse(
        'POST',
        `${api}?author=${exp.author}&title=${exp.title}&text=${exp.text}`,
        function(json) {
          notEqual(json.id, stories[0].id, 'a newly submitted story cannot have the same id as a story before');
          exp.id = json.id;
          stories.unshift(exp);
          return exp;
        },
        `a newly submitted story (${i})must match the submitted data, with a new ID`
      )
    })
    .then(function() {
      var exp = newExpected();
      return testJSONResponse(
        'POST',
        `${api}?author=${exp.author}&title=${exp.title}&text=${exp.text}`,
        function(json) {
          notEqual(json.id, stories[0].id, 'a newly submitted story cannot have the same id as a story before');
          exp.id = json.id;
          stories.unshift(exp);
          return exp;
        },
        `a newly submitted story (${i})must match the submitted data, with a new ID`
      )
    })
    .then(function() {
      var exp = newExpected();
      return testJSONResponse(
        'POST',
        `${api}?author=${exp.author}&title=${exp.title}&text=${exp.text}`,
        function(json) {
          notEqual(json.id, stories[0].id, 'a newly submitted story cannot have the same id as a story before');
          exp.id = json.id;
          stories.unshift(exp);
          return exp;
        },
        `a newly submitted story (${i})must match the submitted data, with a new ID`
      )
    })
    .then(function() {
      var exp = newExpected();
      return testJSONResponse(
        'POST',
        `${api}?author=${exp.author}&title=${exp.title}&text=${exp.text}`,
        function(json) {
          notEqual(json.id, stories[0].id, 'a newly submitted story cannot have the same id as a story before');
          exp.id = json.id;
          stories.unshift(exp);
          return exp;
        },
        `a newly submitted story (${i})must match the submitted data, with a new ID`
      )
    })

    // and check that all are there
    .then(function() {
      return testJSONResponse(
        'GET',
        api,
        stories,
        `after submitting many stories, ${api} should list all from newest to oldest`);
    })
  }
);

test(
  `Paging at ${api}?p`,
  function () {
    testJSONResponse(
      'GET',
      api+'?p=1',
      stories.slice(0,10),
      'first page should return newest ten stories')
    .then(function() {
      return testJSONResponse(
        'GET',
        api+'?p=2',
        stories.slice(10,20),
        'second page should return only four stories');
    })
    .then(function() {
      return testJSONResponse(
        'GET',
        api+'?p=3',
        [],
        'third page should return an empty array');
    })
    .then(function() {
      return testJSONResponse(
        'GET',
        api+'?p=42',
        [],
        'forty-second page should return an empty array');
    })
    .then(function() {
      return testJSONResponse(
        'GET',
        api,
        stories,
        'without paging we should get the whole list');
    })
  }
);

test(
  "Deletion of stories",
  function () {
    var deleted = stories.splice(3,1)[0];
    testStatusResponse(
      'DELETE',
      api+'?id='+deleted.id,
      200,
      'successful deletion should return 200')
    .then(function() {
      return testJSONResponse(
        'GET',
        api+'?p=1',
        stories.slice(0,10),
        'first page should return newest ten stories');
    })
    .then(function() {
      return testJSONResponse(
        'GET',
        api+'?p=2',
        stories.slice(10,20),
        'second page should return only three stories');
    })
    .then(function() {
      return testJSONResponse(
        'GET',
        api,
        stories,
        'without paging we should get the whole list');
    })
    .then(function() {
      return testJSONResponse(
        'GET',
        apiN,
        stories[0],
        `after deletion ${apiN} should still show the newest one`);
    })
    .then(function() {
      return testJSONResponse(
        'GET',
        apiO,
        initial,
        `after deletion ${apiO} should still show the oldest one`);
    })

    // and delete another one
    .then(function() {
      var deleted = stories.splice(stories.length-1,1)[0];
      return testStatusResponse(
        'DELETE',
        api+'?id='+deleted.id,
        200,
        'successful deletion should return 200');
    })
    .then(function() {
      return testJSONResponse(
        'GET',
        api+'?p=2',
        stories.slice(10,20),
        'second page should return only two stories');
    })
    .then(function() {
      return testJSONResponse(
        'GET',
        apiN,
        stories[0],
        `after deletion ${apiN} should still show the newest one`);
    })
    .then(function() {
      return testJSONResponse(
        'GET',
        apiO,
        function(json) {
          notEqual(json.id, 1, 'after deleting story with id 1 there should be no story with id 1');
          return stories[stories.length-1];
        },
        `after deletion ${apiO} should still show the oldest one`);
    })
  }
);

test(
  "Deletion of non-existent stories",
  function () {
    testStatusResponse(
      'DELETE',
      api+'?id=1',
      404,
      `attempt to delete id 1 should return status code 404`)
    .then(function() {
      return testStatusResponse(
        'DELETE',
        api+'?id=nonexistent',
        404,
        `attempt to delete id 'nonexistent' should return status code 404`);
    })
  }
);


test(
   "Delete should be implemented through a utility module",
   function () {
     var util = require(pathUtil);

     ok(
       typeof util.removeFromArray === "function",
       "Create a function called removeFromArray."
     );
     equal(
       util.removeFromArray.length,
       2,
       "The removeFromArray function must accept two parameters"
     );

     var original = [ Object.assign({},initial), Object.assign({},initial), Object.assign({},initial), ];
     original[1].author = "Obi von Kenobi";
     original[2].author = "Han Solo";
     var copied;

     equal( original.length, 3, "Before calling removeFromArray 'original' has 3 elements.")
     equal( copied, undefined, "Before calling removeFromArray 'copied' is expected to be undefined.")
     equal( original[0].author, "Luke Skywalker", "Before calling removeFromArray 'Luke Skywalker' is in position 0.")
     equal( original[1].author, "Obi von Kenobi", "Before calling removeFromArray 'Obi von Kenobi' is in position 1.")
     equal( original[2].author, "Han Solo", "Before calling removeFromArray 'Han Solo' is in position 2.")
     copied = util.removeFromArray(original, 1);
     equal( original.length, 3, "After calling removeFromArray 'original' should still have 3 elements.")
     equal( copied.length, 2, "After calling removeFromArray 'copied' should have two elements.")
     equal( copied[1].author, "Han Solo", "After calling removeFromArray 'Han Solo' is in position 1.")

   }
 );



function testJSONResponse(method, path, result, message) {
  var options = {
    host: 'localhost',
    port: '8080',
    method: method,
    path: path,
  };
  return new Promise(function (resolve, reject) {
    stop();
    var req = http.request(options, function(response) {
      equal(response.statusCode, 200, `successful ${path} should return status code 200`);
      var str = '';
      response.on('data', function(chunk) { str += chunk; });
      response.on('end', function() {
        var json;
        try {
          json = JSON.parse(str);
          if (typeof result === 'function') result = result(json);
          deepEqual(json, result, message);
        } catch (e) {
          ok(false, `response to ${path} must be JSON`);
          reject();
        }
        start();
        resolve();
      });
    });
    req.on('error', function (e) {
      ok(false, `error in ${path}: ${e}`);
      start();
      reject();
    });
    req.end();
  });
}

function testStatusResponse(method, path, code, message) {
  var options = {
    host: 'localhost',
    port: '8080',
    method: method,
    path: path,
  };
  return new Promise(function (resolve, reject) {
    stop();
    var req = http.request(options, function(response) {
      equal(response.statusCode, code, message);
      var str = '';
      response.on('data', function(chunk) { str += chunk; });
      response.on('end', function() {
        // not expecting any response
        start();
        resolve();
      });
    });
    req.on('error', function (e) {
      ok(false, `error in ${path}: ${e}`);
      start();
      reject();
    });
    req.end();
  });
}
