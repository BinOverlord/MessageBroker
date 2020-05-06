const http = require('http');
const axios = require('axios');

var listenerList = [] // Array of suscribes 

module.exports = function(){
  async function respondToSuscribers(topic, message) { // Function that send the response to all the suscribers of a topic
    for (let index = 0; index < listenerList.length; index++) {
      if (listenerList[index].topic == topic) {
        let suscriber = listenerList[index].url;
        let body = {
          message: message
        }
        await axios.post(suscriber, body);
      }
    }
    return 1;
  }
  
  http.createServer(function (req, res) {
    let body = '';
    let err = false; // error flag
  
    function respond(type, message) { // Function that manages the response to de clients
      var response = {};
      switch (type) {
        case "message":
          response.message = message;
          break;
        case "status":
          response.status = message;
          break;
        case "error":
          response.error = message;
          break;
      }
      res.write(JSON.stringify(response));
      res.end();
    }
  
    if (req.method === 'POST') {
      var urlParams = req.url.split('/');
      if (urlParams.length < 3 || (urlParams[1].length < 1 && urlParams[2].length < 1)) {
        respond('error', 'action and topic are requiered');
        return 0;
      } else {
        var action = urlParams[1]
        var topic = urlParams[2]
      }
  
      req.on('data', chunk => {     // Catch the chunks of the body an conver it to a string
        body += chunk.toString();
      });
  
      req.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'appication/json' });
        try {
          if (body.length < 9) {
            throw 'error'
          }
          var bodyParams = JSON.parse(body);
        } catch (error) {
          err = 'request body is not a JSON object';
          return respond('error', err);
        }
  
        switch (action) {
          case 'suscribe':
            if (bodyParams.url) {
              listenerList.push({ topic: topic, url: bodyParams.url });
            } else {
              err = 'a url is necessary to suscribe to a topic';
            }
            break;
          case 'publish':
            if (bodyParams.url) {
              respondToSuscribers(topic, bodyParams.message);
            } else {
              err = 'a message  is necessary to publish to a topic';
            }
            break;
          default:
            err = 'action does not exist';
        }
  
        if (err) {
          return respond('error', err);
        } else {
          return respond('status', 1);
        }
      });
  
    } else {
      err = 'this server only response to POST request';
      return respond('error', err);
    }
  
  }).listen(8000);
}
