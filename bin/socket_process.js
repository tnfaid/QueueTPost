var mongo = require('mongoskin'); 
var config = require('../config/index')();
var db ={};
var webSock = [];


this.baseInit = function(callback) {
	try{
		db = mongo.db('mongodb://' + config.mongo.login + '@' + config.mongo.host+':'+config.mongo.port+'/'+config.mongo.collection, {native_parser:true});
		console.log('connect mongo success',config);
		callback(null,true);
	}catch(e){
		console.log('connect  mongo fail',e);
		callback(null,false);
	}
};


this.start = function(){
/* start open io 
	var io = require('socket.io').listen(8000);

	io.on('connection', function (socket) {
		console.log('Server-socket.io start...');
		var bIP = socket.client.conn.remoteAddress;
		socket.on('disconnect', function () {
			
		});
		
		socket.on('api-playlist', function (data) {
			console.log(bIP,data);
			Fn_GetPlaylist(data.branchID,function(err,result){
				socket.emit('playlist',result);
			});
			
		});
		//update status when loaded playlist  to success
		socket.on('api-playlist-ok', function (data) {
			//console.log(bIP,data);
			Fn_UpdatePlaylist(data.id,function(result){
				console.log('call Fn_UpdatePlaylist->',data.id);
			})
			
		});
		
		socket.on('api-transaction', function (dataItem) {
			Fn_AddTransaction(dataItem.data,function(err,result){
					console.log('call Fn_AddTransaction success');
			});
		});
		
	});	   */
}

// unittest
this.unittest =function(){
	var ObjectID = require('mongodb').ObjectID;
	var io2 = require('socket.io-client');

	var socket2 = io2.connect('http://localhost:8000'); 
	socket2.emit('api-playlist',{branchID : '00210'})
	
	socket2.on('playlist',function(data){
		if (data.length > 0){
			socket2.emit('api-playlist-ok',{id : data[0]._id.toString() });
		}
		
	});
	
	//sample data test
	var dataTrans =[{
			"_id" : ObjectID("58a80cff5839fd0d65e499b4"),
			"PointBox" : "2",
			"Other" : "2",
			"ScanTime" : new Date("2017-01-05T01:01:00.000Z"),
			"AcessTime" : new Date("2017-01-05T01:14:00.126Z"),
			"ReceiptTime" : new Date("2017-01-05T01:00:01.103Z"),
			"BranchID" : "00210",
			"BrnchName" : "พระราม3",
			"UserID" : "1102001",
			"PhoneNo" : "",
			"CounterID" : "3",
			"Input" : "RA1252310300H",
			"Receipt" : "125231030",
			"POSID" : "120",
			"Send" : ""
		},
		{
			"_id" : ObjectID("58a80cb45839fd0d65e4998c"),
			"PointBox" : "1",
			"Other" : "1",
			"ScanTime" : new Date("2017-01-01T08:10:00.000Z"),
			"AcessTime" : new Date("2017-01-01T08:14:00.186Z"),
			"ReceiptTime" : new Date("2017-01-01T08:00:00.113Z"),
			"BranchID" : "00210",
			"BrnchName" : "พระราม3",
			"UserID" : "1000001",
			"PhoneNo" : "",
			"CounterID" : "2",
			"Input" : "RA1512340100H",
			"Receipt" : "151234010",
			"POSID" : "110",
			"Send" : ""
		}];
		
		socket2.emit('api-transaction',{data :dataTrans});
}


/* Function connect to MongoDB */
function Fn_GetPlaylist(branchID,callback){
	try{
		var cond=[];
		
		cond.push({branchID : branchID});
		cond.push({status : 'wait'});
		cond.push({isDelete : false});
		db.collection('playlist_deploy').find({$and : cond}).toArray(function(err, result) {
				if (err) console.log( ' socket_process.Fn_GetPlaylist has error ',err);
				
			     callback(null,result);
		});
		
	}catch(e){
		console.log('error Fn_GetPlaylist ',e);
		  callback(null,'');
	}
};

function Fn_UpdatePlaylist(id,callback){
	var ObjectID = require('mongodb').ObjectID;
	try{
		
		db.collection('playlist_deploy').findOneAndUpdate({
				 "_id" : new ObjectID(id)
			 }
			 ,{ "$set" :{
					status : 'complete'
			 }},function(err, result) {
				if (err) console.log( ' socket_process.Fn_UpdatePlaylist has error ',err);
				
			     callback(null,result);
		});
		
	}catch(e){
		console.log('error Fn_UpdatePlaylist',e);
		  callback(null,'');
	}
};

function Fn_AddTransaction(data,callback){
	
	try{
	
		for(var i =0;i < data.length;i++){
			delete data[i]._id;
		}
		console.log(data);
		db.collection('transaction').insert(data,function(err, result) {
				if (err) console.log( ' socket_process.Fn_AddTransaction has error ',err);
				
			     callback(null,'');
		});
		
	}catch(e){
		console.log('error Fn_AddTransaction '.e);
		 callback(null,result);
	}
};

