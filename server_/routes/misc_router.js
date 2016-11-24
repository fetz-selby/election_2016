var express = require('express'),
    event = require('events').EventEmitter;

var routes = function(sql){
    var miscRouter = express.Router(),
        EventEmitter = new event();

    miscRouter.route('/seatsetter')
        .get(function(req, res){
            if(req.query.level === 'A' || req.query.level === 'S'){
                sql.execute({
                    query:'delete from constituency_seat',
                    params:{}
                }).then(function(results){
                    var seatSetter = require('../service/seat_service');
                    seatSetter.computeForSeats(sql, res);
                }, function(err){
                    console.log(err);
                });
                
            }else{
                res.status(400).send('Restricted Access');
            }
    })
           
    miscRouter.route('/auto_compute_regional')
        .get(function(req, res){
            if(req.query.level === 'A' || req.query.level === 'S'){
                sql.execute({
                    query:'delete from regional_analysis',
                    params:{}
                }).then(function(results){
                    deleteNationAnalysis(res, sql);
                }, function(err){
                    console.log(err);
                });
                
            }else{
                res.status(400).send('Restricted Access');
            }
    })

    miscRouter.route('/sms')
        .get(function(req, res){
            console.log('sms hit');
            res.status(200).send('success');
    })
    
    var deleteNationAnalysis = function(res, sql){
        sql.execute({
                    query:'delete from national_analysis',
                    params:{}
                }).then(function(results){
                    var compute = require('../service/regional_analysis_service');
                    compute.autoComputeRegionalAnalysis(res, sql);
                }, function(err){
                    console.log(err);
                });
    }
    
    return {router: miscRouter, event: EventEmitter};
}

module.exports = routes;