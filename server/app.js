var express = require('express'),
    https = require('https'),
    fs = require('fs'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    sql = require('./sql'),
    Pusher = require('./push_config'),
    pusher = Pusher.pusher(),
    port = process.env.PORT || 3000;
    
var app = express();
var smsDispatcher = require('./service/sms_gateway');

//Instantiating all routes
var candidateRoute = require('./routes/candidate_router')(sql()),
    agentRoute = require('./routes/agent_router')(sql()),
    constituencyRoute = require('./routes/constituency_router')(sql()),
    partyRoute = require('./routes/party_router')(sql()),
    regionRoute = require('./routes/region_router')(sql()),
    userRoute = require('./routes/user_router')(sql()),
    pollingstationRoute = require('./routes/pollingstation_router')(sql()),
    inboxRoute = require('./routes/inbox_router')(sql()),
    outboxRoute = require('./routes/outbox_router')(sql()),
    sessionRoute = require('./routes/session_router')(sql()),
    regionalAnalysisRoute = require('./routes/regional_analysis_router')(sql()),
    autoComputeRoute = require('./routes/computed_regions_router')(sql()),
    yearRoute = require('./routes/year_router')(sql()),
    parentConstituencyRoute = require('./routes/parent_constituency_router')(sql()),
    sendMessageRoute = require('./routes/send_message_router')(sql()),
    approveRoute = require('./routes/approve_router')(sql()),
    miscRoute = require('./routes/misc_router')(sql()),
    nationalRoute = require('./routes/national_analysis_router')(sql());

//Set middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({resave:true, saveUninitialized: true, secret: 'thequickbrownfoxjumpedoverthelazydog',cookieName: 'session', duration: 30*60*1000, activeDuration: 5*60*1000, httpOnly: true, cookie: {secure: false }}));

//CORS enabling
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
});

//Middleware to check for user validity
app.use('/api/elections/*', function(req, res, next){
    
    if(req.query.email && req.query.password){
        
        var sqltmp = new sql();
        sqltmp.execute({
            query:'select id,level from users where email=@email and password=@password',
                params:{
                    email:{
                        type: sqltmp.VARCHAR,
                        val: req.query.email
                    },
                    password:{
                        type: sqltmp.VARCHAR,
                        val: require('./service/utils').getHash(req.query.email+req.query.password)
                    }
                }
                }).then(function(results){
                    if(results.length === 1 && results[0].id > 0){
                        req.query.level = results[0].level;
                        req.query.userId = results[0].id;
                        next();  
                    }else{
                        res.status(200).json([]);
                    }
                    
                }, function(err){
                    console.log(err);
                });
    }else{
        res.status(400).send('Please provide correct email and password');
    }
})

app.use('/api/elections/candidates', candidateRoute.router);
app.use('/api/elections/parties', partyRoute.router);
app.use('/api/elections/constituencies', constituencyRoute.router);
app.use('/api/elections/regions', regionRoute.router);
app.use('/api/elections/pollingstations', pollingstationRoute.router);
app.use('/api/elections/agents', agentRoute.router);
app.use('/api/elections/users', userRoute.router);
app.use('/api/elections/inbox', inboxRoute.router);
app.use('/api/elections/outbox', outboxRoute.router);
app.use('/api/elections/regional_analysis', regionalAnalysisRoute.router);
app.use('/api/elections/computed_regions', autoComputeRoute.router);
app.use('/api/elections/years', yearRoute.router);
app.use('/api/elections/parent_constituencies', parentConstituencyRoute.router);
app.use('/api/elections/send', sendMessageRoute.router);
app.use('/api/elections/approve', approveRoute.router);
app.use('/api/elections/misc', miscRoute.router);
app.use('/api/elections/national_analysis', nationalRoute.router);

app.use('/api/sessions', sessionRoute.router);

app.get('/api', function(req, res){
    res.status(200).send('Please check API documentation');
});

app.get('/', function(req, res){
    res.status(200).send('Please check API documentation');
});



//////////////////////////////////////////////////////


// https.createServer({key: fs.readFileSync('key.pem'), 
//                     cert: fs.readFileSync('cert.pem')}, app).listen(port, function(){

//                         console.log('Running on PORT '+port);
//                         initAllEvents();
//                         startReadMessages(15*1000);

// });

app.listen(port, function(){
    console.log('Running on PORT '+port);
    initAllEvents();
    startReadMessages(15*1000);
});


///////////////////////////////////////////////////////

var startReadMessages = function(timer){
    setInterval(function(){
        console.log('message reading starting ...');
        smsDispatcher.listAllMessages(sql());  
    }, timer)
}

var initAllEvents = function(){
    
    //Agent Events
    agentRoute.event.on('add', function(data){
        console.log('AGENT Added !!!');
    });
    
    agentRoute.event.on('delete', function(data){
        console.log('AGENT Deleted !!!');
    });
    
    
    //Approve Events
    approveRoute.event.on('approved_add', function(data){
        pusher.trigger('approve_approved', 'add', data);
    });
    
    approveRoute.event.on('rejected_add', function(data){
        pusher.trigger('approve_rejected', 'add', data);
    });
    
    approveRoute.event.on('change_update', function(data){
        pusher.trigger('approve_change', 'update', data);
    });
    
    
    //Candidate Events
    candidateRoute.event.on('add', function(data){
        
    });
    candidateRoute.event.on('delete', function(data){
        
    });
    candidateRoute.event.on('update', function(id){
        
    });
    
    
    //Users Events
    userRoute.event.on('add', function(data){
        
    });
    userRoute.event.on('update', function(id){
        
    });
    userRoute.event.on('delete', function(data){
        
    });
}