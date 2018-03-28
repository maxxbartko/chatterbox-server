const headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'appliction/json'
};

const sendResponse = function (response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
};

const requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // define request variables
  let { method, url } = request;
  let objectId = 1;
  const messages = [{ username: 'me', text: 'lol', objectId: objectId }];

  // set conditional request handlers
  if (method === 'POST') {
    let body = [];
    let objectId = 1;
    let message = '';

    request.on('data', (chunk) => {
      body.push(chunk); // chunk is JSON string // need to add createdAt and objectID fields
      message = JSON.parse(body);

      message.objectId = ++objectId;
      message.createdAt = new Date();
    }).on('error', () => {
      sendResponse(response, null, 404);
    }).on('end', () => {
      messages.push(message);
      sendResponse(response, message, 201);
    });

  } else if (method === 'GET') {
    sendResponse(response, {results: messages});
  } else if (method === 'OPTIONS') {
    sendResponse(response, null);
  }
};

exports.requestHandler = requestHandler;
exports.headers = headers;

// *** NOTES *** ///

/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// Request and Response come from node's http module.
//
// They include information about both the incoming request, such as
// headers and URL, and about the outgoing response, such as its status
// and content.
//
// Documentation for both request and response can be found in the HTTP section at
// http://nodejs.org/documentation/api/

// Do some basic logging.
//
// Adding more logging to your server can be an easy way to get passive
// debugging help, but you should always be careful about leaving stray
// console.logs in your code.
// The outgoing status.
// var statusCode = 200;

// See the note below about CORS headers.
// var headers = headers;

// Tell the client we are sending them plain text.
//
// You will need to change this if you are sending something
// other than plain text, like JSON or HTML.
// headers['Content-Type'] = 'application/json';   //charset=utf-8

// .writeHead() writes to the request line and headers of the response,
// which includes the status and all headers.
// response.writeHead(statusCode, headers);
// console.log(response.headers)
// Make sure to always call response.end() - Node may not send
// anything back to the client until you do. The string you pass to
// response.end() will be the body of the response - i.e. what shows
// up in the browser.
//
// Calling .end "flushes" the response's internal buffer, forcing
// node to actually send all the data over to the client.

// Make sure to always call response.end() - Node may not send
// anything back to the client until you do. The string you pass to
// response.end() will be the body of the response - i.e. what shows
// up in the browser.
//
// Calling .end "flushes" the response's internal buffer, forcing
// node to actually send all the data over to the client.

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.