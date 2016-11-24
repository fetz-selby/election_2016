angular.module('app')
.factory('agentFormService', function(){
	var agentFormService = {},
	agent = {},
	year = '2016',
	regionId = 0,
	constituencyId = 0,
	pollingStationId = 0;

	agentFormService.getAllRegions = function(){
		var regions = [{id:1, name:'Ashanti'}, {id:2, name:'Greater Accra'}, {id:3, name:'Western'}, {id:4, name:'Eastern'}, {id:5, name:'Central'}];

		return regions;
	}

	agentFormService.getConstituencies = function(regionId){
		var constituencies = [{id:1, name:'Adansi-Asokwa', regionId: 1}, {id:2, name:'Fomena', regionId: 1}, {id:3, name:'New Edubiase', regionId: 1}, {id:4, name:'Kwabre West', regionId: 1},
		 {id:5, name:'Ahafo Ano North', regionId: 1}, {id:6, name:'Ahafo Ano South', regionId: 1}, {id:7, name:'Odotobri', regionId: 1}, {id:8, name:'Amansie West', regionId: 1}, 
		 {id:9, name:'Obuasi', regionId: 1}, {id:10, name:'Bekwai', regionId: 1}, {id:11, name:'Bosome-Freho', regionId: 1}];

		return constituencies;
	}

	agentFormService.getPollingStations = function(constituencyId){
		return [];
	}

	agentFormService.getPollingStations = function(){

	}

	agentFormService.setYear = function(year){
		this.year = year;
	}

	agentFormService.setRegionId = function(regionId){
		this.regionId = regionId;
	}

	agentFormService.setConstituencyId = function(constituencyId){
		this.constituencyId = constituencyId;
	}

	agentFormService.setAgent = function(agent){
		this.agent = agent;
	}

	agentFormService.addAgent = function(){

	}


	return agentFormService;
})