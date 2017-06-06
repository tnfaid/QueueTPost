var async = require("async");
var objid = require('mongoskin').ObjectID;

module.exports = {
		index : function (req,res,next){
			var db_role = req.db.collection('sys-role');
			var db_menu = req.db.collection('sys-menu');
			var data = [];
			var q = async.queue(function (doc, callback) {
					db_menu.find({roleLevel : doc.roleLevel},{"_id":0,"roleLevel":0}).toArray(function(err,menu){					
						doc.menu =  menu;
						data.push(doc);
						callback();
					});
				}, Infinity);
			
			var cursor = db_role.find({},{}).each(function(err,role){
				if (role) q.push(role)			
			});
			
			q.drain = function() {
				  if (cursor.isClosed()) {
				    console.log('data-------------',data);
					res.render('Config_Role_View',{
						data: data,
						host : req.protocol + '://' + req.get('host'),
						user: req.session.userLogin, 
						menu: req.session.userMenu});
				    db_role.close();			  
				    }
				}
		},
		modifydata : function (req,res,next){
			var db_role = req.db.collection('sys-role');
			var db_menu = req.db.collection('sys-menu');
			var action = req.params.action;
			switch (action){
			case 'add':
				res.render('Config_Role_ModifyData',{action : 'Add',
					data : '',
					host : req.protocol + '://' + req.get('host'),
					user: req.session.userLogin, 
					menu: req.session.userMenu});
				break;
			case 'edit':
				
				var db_role = req.db.collection('sys-role');
				var db_menu = req.db.collection('sys-menu');
				var data = [];
				var q = async.queue(function (doc, callback) {
						db_menu.find({roleLevel : doc.roleLevel},{}).toArray(function(err,menu){					
							doc.menu =  menu;
							data.push(doc);
							callback();
						});
					}, Infinity);
				
				var cursor = db_role.find({"_id" : objid(req.params.id)},{}).each(function(err,role){
					if (role) q.push(role)			
				});
				
				q.drain = function() {
					  if (cursor.isClosed()) {
						  console.log('---------------',data);
						res.render('Config_Role_ModifyData',{'action' : 'Edit',
							'data': data[0],
							'host' : req.protocol + '://' + req.get('host'),
							'user': req.session.userLogin, 
							'menu': req.session.userMenu});
					    db_role.close();			  
					    }
					}
				
				break;
			case 'delete':
				db_role.remove({'_id' : objid(req.params.id) } , function(err){
					res.redirect('/config/role');
				});
				break;
			}
		},
		editDB : function(req,res,next){
			var action = req.params.action;
			var db_role = req.db.collection('sys-role');
			var db_menu = req.db.collection('sys-menu');
			
			switch(action){
			case 'add' : 
				var data = JSON.parse(req.body.role);
				var rolecount = 0;
				db_role.aggregate(
				   [
				      { $group: { _id: null, count: { $sum: 1 } } }
				   ],function (err,result){
					   rolecount = result[0].count + 1;
					db_role.insert({
						roleLevel : data.roleName,
						roleName : data.roleName,
						host : req.protocol + '://' + req.get('host'),
						Discription : data.discription
					},function(err){
						db_menu.update({},{$pullAll : {roleLevel : [data.roleName]}},{multi : true},function(){
							console.log(err);
							db_menu.update({'menuName' : {$in : data.menu}},{
							
							 $push : {roleLevel : data.roleName}},{multi : true}
							,function(err){
								res.send(err);
							})
					})
					})
				});
				break;
			case 'edit' :
				var data = JSON.parse(req.body.role);
				db_role.findOneAndUpdate({
					'_id' : objid(req.body.id)
				},{
					'$set' : {
						'roleLevel' : data.roleName,
						'roleName' : data.roleName,
						'Discription' : data.discription
					}
				},function(err){
						console.log('----------------x' , err);
						db_menu.update({},{$pullAll : {roleLevel : [data.roleName]}},{multi : true},function(err){
							console.log('Config Role Error (edit pullall): ' ,err);
							db_menu.update({'menuName' : {$in : data.menu}},{
							
							 $push : {roleLevel : data.roleName}},{multi : true}
							,function(errr){
								console.log('Config Role Error (edit push): ' ,errr);
								res.send(err);
							})
						});
				});
				break;
			}
		}
}