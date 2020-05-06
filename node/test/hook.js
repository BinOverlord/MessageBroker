const axios = require('axios');
const http = require('http');

module.exports = function(broker, topic, port, callback){
    const server = http.createServer(function (req, res) {
        // Read the body of the request
        let body = '';
        // Catch the chunks of the body an conver to a string
        req.on('data', chunk => {
                body += chunk.toString();
        });
        req.on('end', () => {
            callback(body);
        });

        res.end(); // En request   
    })
    
    server.listen(port, function(){
        async function suscribe(topic, url){
            let body = {
                url: url
            }
            let res = await axios.post(broker + '/suscribe/' + topic, body);
        
            return res;
        }
        suscribe(topic, 'http://127.0.0.1:'+ port).then((res)=>{
        console.log(port + ': suscribed to ' + topic);
    })
    });
}



