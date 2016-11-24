
var request = require('request'),
        event = require('events').EventEmitter,
        EventEmitter = new event(),
        fs = require('fs'),
        sql = require('../sql')();


var service = function(){
   

    // Asynchronous read
    fs.readFile('../resources/sh5.csv', function (err, data) {
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

var doExtraction = function(element, index){
    //Spit to get all columns

    var re = /,+/;

    var dataColumns = element.split(re);
    //console.log('Constituency => '+dataColumns[4]+' row => '+(index+1));

    var candidate = {};
    candidate.name = dataColumns[0].trim();
    candidate.party = dataColumns[1].trim();
    candidate.votes = dataColumns[2].trim();
    candidate.year = dataColumns[3].trim();
    candidate.constituency = dataColumns[4].trim();
    candidate.group_type = dataColumns[5].trim();

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
              val: 2012
          }
      }
  }).then(function(results){
      if(results.length == 1){
        //console.log('Sheet Cons => '+candidate.constituency+', DB Constituency => '+results[0].name+', id => '+results[0].id);
        candidate.constituency_id = results[0].id;

        //Insert candidate
        insertCandidate(candidate);
      }else{
        console.log('Bad constituency => '+candidate.constituency);
      }
  }, function(err){
      console.log(err);
  });
}

var insertCandidate = function(candidate){
  sql.execute({
      query:'insert into candidates(name,party_id,constituency_id,votes,group_type,year,percentage,angle,bar_ratio) values(@name,@party,@consId,@votes,@group,@year,0,0,0)',
      params:{
          name:{
              type: sql.VARCHAR,
              val: candidate.name
          },
          party:{
              type: sql.INT,
              val: getPartyCode(candidate.party)
          },
          consId:{
              type: sql.INT,
              val: candidate.constituency_id
          },
          votes:{
              type: sql.INT,
              val: candidate.votes
          },
          group:{
              type: sql.CHAR,
              val: candidate.group_type
          },
          year:{
              type: sql.CHAR,
              val: 2012
          }
      }
  }).then(function(results){
      console.log('One added');
  }, function(err){
      console.log(err);
  });
}

var getPartyCode = function(party){
  if(party.toLowerCase() == 'npp'){
    return 1;
  }else if(party.toLowerCase() == 'ndc'){
    return 2;
  }else if(party.toLowerCase() == 'cpp'){
    return 3;
  }else if(party.toLowerCase() == 'pnc'){
    return 4;
  }else if(party.toLowerCase() == 'ind'){
    return 5;
  }else if(party.toLowerCase() == 'pcp'){
    return 7;
  }else if(party.toLowerCase() == 'ncp'){
    return 8;
  }else if(party.toLowerCase() == 'eagle'){
    return 9;
  }else if(party.toLowerCase() == 'gcpp'){
    return 10;
  }else if(party.toLowerCase() == 'dpp'){
    return 11;
  }else if(party.toLowerCase() == 'dfp'){
    return 12;
  }else if(party.toLowerCase() == 'nvp'){
    return 13;
  }else if(party.toLowerCase() == 'rpd'){
    return 14;
  }else if(party.toLowerCase() == 'nrp'){
    return 16;
  }else if(party.toLowerCase() == 'ugm'){
    return 17;
  }else if(party.toLowerCase() == 'ppp'){
    return 18;
  }else if(party.toLowerCase() == 'ndp'){
    return 22;
  }else if(party.toLowerCase() == 'ufp'){
    return 25;
  }else if(party.toLowerCase() == 'ipp'){
    return 26;
  }else if(party.toLowerCase() == 'gfp'){
    return 27;
  }else if(party.toLowerCase() == 'ypp'){
    return 28;
  }else if(party.toLowerCase() == 'urp'){
    return 29;
  }else if(party.toLowerCase() == 'noc'){
    return 31;
  }else if(party.toLowerCase() == 'nop'){
    return 32;
  }else if(party.toLowerCase() == 'gnp'){
    return 33;
  }else if(party.toLowerCase() == 'upp'){
    return 34;
  }else if(party.toLowerCase() == 'apc'){
    return 36;
  }
}

service();
//module.exports = service;