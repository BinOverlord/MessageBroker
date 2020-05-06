const broker = require('../server');
const hook = require('./hook');

console.log('Test start');

console.log('Starting server');
broker();


console.log('Starting clients')
hook('http://127.0.0.1:8000', 'topic1', '8001', function(data){ // client to topic1
    message = JSON.parse(data);
    if(message.topic == 'topic1'){
        console.log(8001 +': message '+ message.message +' from ' + message.topic);
    } else {
        throw new Error('recived message from incorrec topic2')
    }
});


hook('http://127.0.0.1:8000', 'topic2', '8002', function(data){ // client to topic2
    message = JSON.parse(data);
    if(message.topic == 'topic2'){
        console.log('message from topic 2 ');
        console.log(8002 +': message '+ message.message +'from ' + message.topic);
    } else {
        throw new Error('recived message from incorrec topic2')
    }
});
