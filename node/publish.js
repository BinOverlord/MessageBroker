const axios = require('axios');

async function publish(topic, message){
    let body = {
        message: message
    }
    let res = await axios.post('http://127.0.0.1:8000/publish/' + topic, body);

    return res;
}