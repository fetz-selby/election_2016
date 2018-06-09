
var request = require('request'),
        event = require('events').EventEmitter,
        EventEmitter = new event(),
        fs = require('fs'),
        sql = require('../sql')();


var service = function(){
   

    // Asynchronous read
    fs.readFile('../resources/agents.csv', function (err, data) {
       if (err) {
          return console.error(err);
       }
       //console.log("Asynchronous read: " + data.toString());

       var dataToken = data.toString().split(/\n/);
       dataToken.forEach(function(element, i, arr){
        //console.log(element);
        doExtraction(element, i);
       });
    });
    
    //return {push: push, event: EventEmitter};
}



//bvpn3054
//581261


var doExtraction = function(element, index){
    //Spit to get all columns

    var re = /,+/;

    var dataColumns = element.split(re);
    //console.log('Constituency => '+dataColumns[4]+' row => '+(index+1));

    var candidate = {};
    candidate.name = dataColumns[0].trim();

    //console.log('*** candidate '+candidate.name);

    candidate.phone = '+233'+dataColumns[1].trim();
    candidate.constituency = dataColumns[2].trim();

    fetchForParentConstituency(candidate);
}

var fetchForParentConstituency = function(candidate){
sql.execute({
      query:'select id,name from constituencies where year = @year and name like @name',
      params:{
          name:{
              type: sql.VARCHAR,
              val: candidate.constituency
          },
          year:{
              type: sql.CHAR,
              val: 2016
          }
      }
  }).then(function(results){
      if(results.length == 1){
        //console.log('Sheet Cons => '+candidate.constituency+', DB Constituency => '+results[0].name+', id => '+results[0].id);
        candidate.constituency_id = results[0].id;

        //Insert candidate
        grabPollingStation(candidate);
      }else{
        //console.log('Bad constituency => '+candidate.constituency);
      }
  }, function(err){
      console.log(err);
  });
}

var grabPollingStation = function(candidate){
  sql.execute({
      query:'select top 1 id,name from polls where cons_id = @constituencyId',
      params:{
          constituencyId:{
              type: sql.INT,
              val: candidate.constituency_id
          }
      }
  }).then(function(results){
      if(results.length == 1){
        //console.log('Constituency Id => '+candidate.constituency_id+', DB poll => '+results[0].name+', poll id => '+results[0].id);
        candidate.poll_id = results[0].id;
        console.log('name => '+candidate.name+', phone => '+candidate.phone+', consId => '+candidate.constituency_id+', pollId => '+candidate.poll_id);

        //Insert candidate
        //insertAgent(candidate);
      }else{

        console.log('Bad poll => '+candidate.constituency_id);
        return;
      }
  }, function(err){
      console.log(err);
  });
}

var insertAgent = function(candidate) {
    console.log('name => '+candidate.name+', phone => '+candidate.phone+', consId => '+candidate.constituency_id+', pollId => '+candidate.poll_id);
    sql.execute({
        query: 'insert into agents(name,msisdn,cons_id,poll_id,year,pin,status) values(@name,@phone,@consId,@pollId,@year,@pin,@status)',
        params: {
            name: {
                type: sql.VARCHAR,
                val: candidate.name
            },
            phone: {
                type: sql.VARCHAR,
                val: candidate.phone
            },
            consId: {
                type: sql.INT,
                val: candidate.constituency_id
            },
            pollId: {
                type: sql.INT,
                val: candidate.poll_id
            },
            year: {
                type: sql.VARCHAR,
                val: '2016'
            },
            pin: {
                type: sql.VARCHAR,
                val: '0000'
            },
            status: {
                type: sql.CHAR,
                val: 'A'
            }
        }
    }).then(function(results) {
        console.log('One added');
    }, function(err) {
        console.log(err);
    });
}

service();
//module.exports = service;