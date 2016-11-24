exports.pusher = function(){
    var Pusher = require('pusher');
    var pusher = new Pusher({
        appId: '223164',
        key: '009b6b4428d3eaaeb29a',
        secret: '3b65c8a46f9ffc1dadf5',
        encrypted: true
    });
    
    
    return pusher;
};

