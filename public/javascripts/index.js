(function () { 
	'use strict';
	var app = angular.module('QueueManagement',[]);
	app.controller('branchController',function(){
		this.config={branchID:'10001',
					 branchName:'สำนักงานใหญ่',
					 tel:"02-8888888",
					 address:'ประเทศไทย',
					 ipAddress:'192.168.1.1'
					 };
	});
})();