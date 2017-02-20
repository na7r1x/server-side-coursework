# Web-Script Programming
## Coursework Challenge 2 (ws_cwk2)

Welcome to the second coursework for the Web Script Programming unit.  This folder contains all the challenges that you will try to complete.

This is an individual coursework, so whilst you are allowed to discuss both the challenges _and_ the approaches you might take to tackling them, all work must be your own.

## Preparation

1. Download/clone.

3. To download the dependencies (QUnit and Archiver) type (top-level dir):

  ```bash
  npm install
  ```

3. To download the artifact dependencies (express) navigate to artifact/server/ and type:

  ```bash
  npm install
  ```

4. Run the tests by going back to top-level directory and typing:

  ```bash
  npm test
  ```


## Structure

Main deliverable folder is artifact/ 

Main piece of work is artifact/server/server.js

## Task(s)

* We have created an API for a story-sharing service called JSBook.
* You must create a server which implements this API.
* You will need to create a server and a module in order to pass all the tests – we have provided the appropriate folder structure for you.  
* The server will keep stories in-memory.  There is no need to write stories to file or database.

The `server` folder should contain a `package.json` file in which you should manage your dependencies (such as the `express` package).

The `webpages/index.html` page (which you do **not** have to edit) will be a client page for the API. Your server should serve this page if you include this code:

```javascript
app.use('/', express.static('webpages', { extensions: ['html'] }));
```

When not running `npm test`, you can start your server from the top-level `ws_cwk2` directory, using this command (assuming you have correctly set the value `main` in `artifact/server/package.json`):

```shell
node artifact/server
```

### The API

The API you must implement has the following end-points:

 * GET on `/api/stories` — return an array of stories, in JSON, initially like this:
   ```json
   [
     {
       "id": 1,
       "author": "Luke Skywalker",
       "title": "Hello world!",
       "text": "So I decided to join jsbook like everyone else. What does one post here?"
     }
   ]
   ```

   The API should provide results in pages of 10 entries.  A query parameter `p` specifies which page to return, starting with 1.  If the client asks for `/api/stories?p=1`, they should only get 10 stories, starting from the newest one.  If `p=2`, the API must return stories 11–20 (not by ID but by position: i.e. if we have stories with IDs from 1 to 20 and we delete story 14, `p=1` will give us stories 20–10, which is 10 stories).  When a page of stories is returned it must be ordered with the most recent story first.

 * GET on `/api/stories/oldest` — return the oldest story, e.g.
   ```json
   {
     "id": 1,
     "author": "Luke Skywalker",
     "title": "Hello world!",
     "text": "So I decided to join jsbook like everyone else. What does one post here?"
   }
   ```

 * GET on `/api/stories/newest` — return the newest story, otherwise like above

 * POST on `/api/stories` — there will be three query parameters: `author`, `title`, and `text`, containing a new story. When a new story is accepted at `/api/stories`, your server must give it a new ID that is not used by any previous story. The new story must be added to the list of stories (so that it is returned as the newest story on a GET request to `/api/stories`). The response on POST to `/api/stories` should return the new story as JSON, complete with the new ID, for example like this:
   ```json
   {
     "id": 2,
     "author": "Chewbacca",
     "title": "grrrwaaaaaarggggh!",
     "text": "brrwhhhaargh!"
   }
   ```

 * DELETE on `/api/stories` — there will be one query parameters: `id`. If the server has a story with the given ID, it should remove it and the response should be only the 200 status code. No other stories should be affected; in particular, their IDs won't change. If the server did not have a story with the given ID, the response should be the 404 status code.


To implement the last functionality, write a `utility` module with a function called `removeFromArray(arr, index)`:
The function will remove an element from an array: it **must not** change the original array, it **must** return a copy of the array without the `index`'th element (starting from 0), so the resulting array is one element shorter than the original array.

## A note on security (the lack of it)
We have not looked at authentication and authorization yet, so this service is completely open to everyone and therefore clearly impractical in the real world — however — it exercises the server-side material we have been looking at in the last 6 weeks.

