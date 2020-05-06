const axios = require('axios');
const http = require('http');

const server = http.createServer(function (req, res) {
    // Read the body of the request
    let body = '';
    // Catch the chunks of the body an conver to a string
    req.on('data', chunk => {
            body += chunk.toString();
    });
    req.on('end', () => {
        console.log(body);
    });

    res.end(); // En request   
})

server.listen(8001, function(){
    async function suscribe(topic, url){
        let body = {
            url: url
        }
        let res = await axios.post('http://127.0.0.1:8000/suscribe/' + topic, body);
    
        return res;
    }
    
    suscribe('topic1', 'http://127.0.0.1:8001').then((res)=>{
        console.log(res.data);
    })
});


