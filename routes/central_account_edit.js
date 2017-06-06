exports.index = function (req,res,next){
	res.render('central-account_edit',{title: 'User Management Edit'
		,user: req.session.user
		,menu: req.session.userMenu
		,host: req.protocol + '://' + req.get('host')
	});
};
exports.edit = function(req,res,next){
	res.render('central-account_edit', { title: 'User Management Edit'
		  ,user: req.session.user 
		  ,menu: req.session.userMenu
		  ,host : req.protocol + '://' + req.get('host')
		  ,id : req.params.id
	 });
};
exports.role = function (req,res){
	req.db.collection('sys-role').find({}).toArray(function(err,recrole){    
		if (err) console.log(' central-account_edit.role has error ',err);                                                 		
		// if(!err){                           	
	     	//console.log(recrole);
	     	res.send(recrole);
        	// res.json(recrole);                            	
        // }
        });	
};
exports.find_id = function (req,res){
	// console.log('testFind==',(req.body.id))
	var ObjectId = require('mongoskin').ObjectId
	req.db.collection('userList').find({_id : ObjectId(req.body.id)}).toArray(function(err,result){
  		if (err) console.log(' central-account_edit.find has error ',err);
  		// console.log('req==',req.body);
  		 // console.log('R==',result);
  		res.send(result);
  		// res.send({data:JSON.stringify(result) });
	  		
	  });
};
exports.find_update = function(req,res){
	var ObjectId = require('mongoskin').ObjectId
	var exd = '';
	if (req.body.expiredate !== ''){
		exd = new Date(Date.parse(req.body.expiredate))
//		exd.setHours(0,0,0,0);
	}
	console.log('exd=',exd);
	var bf = []
	if (req.body.branchfilter == '') {bf = [];} else {bf = [req.body.branchfilter];}
	req.db.collection('userList').findOneAndUpdate({
		"_id" : ObjectId(req.body.id)
	},{
		'$set' : {
			"userName" : req.body.userName,
			"FullName" : req.body.FullName,
			"roleLevel" : req.body.rolelevel,
			"userState" :  req.body.userState,
            "startDate" :  new Date(Date.parse(req.body.startdate)),
            "expireDate" : exd,
            "passPolicy" : (req.body.passpolicy === '0'?false:true),
			"branchFilter" : bf 
				}
		},function(err,result){
			console.log('result==',result)
			if (!err) {res.send(result);}
			else {res.send(err);}			
		});

};

// 	                           coll.findOneAndUpdate({
// 	                            "_id" : ObjectId(req.body.id)                       
// 	                        },{ 
// 	                           "$set" : {
// 	                               "userPass" : rec.userPass,
// 	                               "worngLogin" : 0,
// 	                               "firstLogon" :  Boolean(1),
// 	                               "deployStatus" : deployS
// 	                              // "dataCreate" : new Date()                              
// 	                            }

// 	                        },function(err,record){
// 	                           if(!err){

exports.insert = function(req,res){
	var pwden = pwdencryptest(req.body.password);	 
//	console.log(pwden);
// 	                    	getMaxDocID(function (maxid){
// 	                    		/*var raw = req.body.startdate.split('/');
// 	                    		var stDate = new Date(raw[2] + '-' + raw[1] + '-' + raw[0]);*/
// 	                    		//var arrBranch = req.body.ddlBranch.split('|');
	var d = new Date(Date.parse(req.body.startdate));
	var dateEx = new Date();
	dateEx.setDate(dateEx.getDate() + 90);
	var exd = '';
	if (req.body.expiredate !== ''){
		exd = new Date(Date.parse(req.body.expiredate))							
	} 
// 								var disS = '';
// 								var disE = '';
// 								if (req.body.disablestart !== ''){
// 									disS = new Date(Date.parse(req.body.disablestart))
// //									disS.setHours (0,0,0,0);
// 								}
// 								if (req.body.disableexpire !== ''){
// 									disE = new Date(Date.parse(req.body.disableexpire))
// //									disE.setHours (0,0,0,0);
// 								}
// //								console.log('||||||||||||||||||',req.body.passpolicy);
// 								var deployS = 'wait'
// 								if (req.body.branchid  == '0000' || req.body.branchid.length < 4){deployS = 'Successfully';}
// 								else {deployS = 'wait'}
// 								var rf = []
// 								if (req.body.regionfilter == '') {rf = [];} else {rf = [req.body.regionfilter];}
// 								var zf = []
// 								if (req.body.zonefilter == '') {zf = [];} else {zf = [req.body.zonefilter];}
	var bf = []
	if (req.body.branchfilter == '') {bf = [];} else {bf = [req.body.branchfilter];}
	// 							console.log('deployS====',deployS);
	req.db.collection('userList').insertOne({
		"userName" : req.body.userName,
		 // "staffID" : req.body.staffid,
		"roleLevel" : req.body.rolelevel,
        "FullName" : req.body.fullname,
        "lastLogon" : ['',''],
        "wrongLogon" : 0,
        "userState" : req.body.userState,
        "firstLogon" : true, 
        "createDate" : new Date(),
        "startDate" : new Date(Date.parse(req.body.startdate)),				//(req.body.startdate),  /*stDate.toISOString,*/	                                   
        "expireDate" : exd,					//(req.body.expirydate),                            
		// "activeDate" : '',
		// "disableStart" : disS,
		// "disableExpire"  : disE,
		// "branchID" :{branchID:req.body.branchid,branchName:req.body.branchname},
  		// "branchID" : req.body.branchid,
		// "branchName" : req.body.branchname,
		// "deployStatus" : deployS,
        //"status" : [],
		// "regionFilter" : rf,
		// "zoneFilter" : zf,
		"branchFilter" : bf,
        "passPolicy" : (req.body.passpolicy === '0'?false:true),
        "userPass" : [{userPass:pwden,dateCreate:new Date(),dateExpiry:dateEx},
                      {userPass:'',dateCreate:new Date(),dateExpiry:new Date()},        
                      {userPass:'',dateCreate:new Date(),dateExpiry:new Date()},
                      {userPass:'',dateCreate:new Date(),dateExpiry:new Date()},        
                      {userPass:'',dateCreate:new Date(),dateExpiry:new Date()},        
                      {userPass:'',dateCreate:new Date(),dateExpiry:new Date()}]
                      },function(err,record){
				            if(!err){
				            	res.send('insert complete');
				            }else{
				            	console.log('central-account_add_insert has error');
				            }
	 //            		
	});


};
function pwdencryptest(password){
	var crypto = require('crypto'),
    algorithm = 'aes-128-cbc',
    key = 'Pas$w0rd';
	
	  var cipher = crypto.createCipher(algorithm,key)
	  var crypted = cipher.update(password,'utf8','hex')
	  crypted += cipher.final('hex');
	  return crypted;  
};

// exports.drawtable = function drawtable(records){
//   	            var str =  "<tr>\n\
//                 <th width='5%'>UserName</th>\n\
//                 <th width='12%'>Name - Surname</th>\n\
//         		<th width='5%'>StaffID</th>\n\
//                 <th width='5%'>Role</th>\n\
//             	<th width='3%'>Status</th>\n\
//         		<th width='7%'>StartDate</th>\n\
//         		<th width='7%'>ExpireDate</th>\n\
//                 <th width='3%'>BrID</th>\n\
//                 <th width='13%'>BranchName</th>\n\
//             	<th width='2%'>RF</th>\n\
//             	<th width='2%'>ZF</th>\n\
//             	<th width='2%'>BF</th>\n\
//             	<th width='7%'>DeployStatus</th>\n\
//             	<th width='15%'>Action</th>\n\
//             	</tr>";
//             	if(records.length > 0) { 
//             	for(var i=0; i < records.length; i++) {
//                 	if (records[i].startDate !== '') {
//                     	var datest = formatDate(records[i].startDate)}	                    	
//                     else {datest = ''}                    			
//                     if (records[i].expireDate !== '') {
//                     	var dateexp = formatDate(records[i].expireDate)}
//                     else {dateexp = ''}
// //                    if (records[i].lastLogon[0] !== '' && records[i].lastLogon[0] !== undefined && records[i].lastLogon !== undefined ) {
// //                    	var lastlog = newformate(records[i].lastLogon[0]) }
// //                    else {lastlog = ''}
//                     if (records[i].deployStatus !== '' && records[i].deployStatus !== undefined) {
//                     	var deploystat = records[i].deployStatus }
//                     else {deploystat = ''}
//                     if (records[i].regionFilter !== '' && records[i].regionFilter !== undefined) {
//                     	var rf = records[i].regionFilter }
//                     else {rf = ''}
//                     if (records[i].zoneFilter !== '' && records[i].zoneFilter !== undefined) {
//                     	var zf = records[i].zoneFilter }
//                     else {zf = ''}
//                     if (records[i].branchFilter !== '' && records[i].branchFilter !== undefined) {
//                     	var bf = records[i].branchFilter }
//                     else {bf = ''}
//                     	//var d = formatDate(records[i].lastLogon[0]);
//                     	//var h = records[i].lastLogon[0];
//                 	//console.log('lastlogon=',formatDate(records[i].lastLogon[0]).toHHMMSS());
//                 	//console.log('lastlogon=',newformate(records[i].lastLogon[0]));
//                     var roleDelete ="disabled='disabled'";
//                     //console.log(req.session.userMenu);
//                     for(var k=0;k<req.session.userMenu.length;k++){
//                     	if (req.session.userMenu[k].menuName =='Delete User'){
//                     		roleDelete='';
//                     	}
//                     }
//                     str += "<tr>\n\
//                                 <td align='center' class='vert-align'>" + records[i].userName + "</td>\n\
//                                 <td align='center' class='vert-align'>" + records[i].FullName + "</td>\n\
//                                 <td align='center' class='vert-align'>" + records[i].staffID + "</td>\n\
//                                 <td align='center' class='vert-align'>" + records[i].roleLevel + "</td>\n\
//                                 <td align='center' class='vert-align'>" + records[i].userState + "</td>\n\
//                                 <td align='center' class='vert-align'>" + datest + "</td>\n\
//                                 <td align='center' class='vert-align'>" + dateexp + "</td>\n\
//                                 <td align='center' class='vert-align'>" + records[i].branchID + "</td>\n\
//                                 <td align='center' class='vert-align'>" + records[i].branchName + "</td>\n\
//                                 <td align='center' class='vert-align'>" + rf + "</td>\n\
//                                 <td align='center' class='vert-align'>" + zf + "</td>\n\
//                                 <td align='center' class='vert-align'>" + bf + "</td>\n\
//                                 <td align='center' class='vert-align'>" + deploystat + "</td>\n\
//                                 <td align='center'><div class='btn-group'>\n\
//                                 <button type='button' ID='btnreset' class='btn btn-warning' data-id='" + records[i]._id + "' data-name='" + records[i].userName + "'  data-toggle='modal' data-toggle='modal' data-target='#central-confirm-reset'>Reset</button>\n\
//                                 <button type='button' ID='btnedit' class='btn btn-primary' data-id='" + records[i]._id + "' data-toggle='modal' data-target='#central-userdata-edit'>Edit</button>\n\
//                                 <button type='button' ID='btndel' " + roleDelete + " class='btn btn-danger' data-id='" + records[i]._id + "' data-name='" + records[i].userName + "' data-brid='" + records[i].branchID + "' data-brname='" + records[i].branchName + "' data-toggle='modal' data-target='#central-confirm-delete'>Delete</button>\n\
//                                 </td></div>\n\
//                             </tr>";	                  

//                 } 
//             }else {
//                 str += '<tr><td colspan="9" align="center">ไม่มีข้อมูล</td></tr>';
//             } 
// 	                return str;
// 	        }


// //		                        	console.log('error|' , err);
// };
// var mongo = require('mongoskin'); 
// var ObjectId = require('mongoskin').ObjectId;
// var fs = require('fs-extra');
// var timeO = 1;
// var reD = 10;
// module.exports = {
// 		index : function (req,res,next){
// 			var db_br = req.db.collection('branchs');
// 			db_br.find({}).toArray(function(err,result){
// //				console.log(result);
// 				if (err) throw err;
// 				if (result){
// 					res.render('central-account',{host:req.protocol + '://' + req.get('host'),br:result
// 						, user: req.session.userLogin, 
// 						  menu: req.session.userMenu,
// 						  bulkload : (req.session.blukstatus ==null?'' : true)
// 						});
					
// 				}
// 			});
// 		},
// 			//-------------------------------------------------------------------------------------POM
// 			SearchBranch: function(req,res,next){
// 				var db = req.db.collection('branch');
// 				try{
// 				//res.end(JSON.stringify(['10001','10002','10003']));
// 					db.aggregate({"$match" : {'branchID' :  req.query.bid}},
// 							     {$project: { display : { $concat : ["$branchID", " (", "$branchName",")"]},
// 	                              branchID : "$branchID" , 
// 	                              branchName : "$branchName"}},
// 	                              { $sort : { 'branchID' : 1 }},
// 	                              { $limit : 5 },function(err,rec){
// 	                            	  	if(err){console.log('central account searchbranch : ',err);}
// //	              						console.log('briffffffdddddddd=',rec);
// 	              						res.json({'results' :rec});
// 								 })
// 				}catch(err){
// 					if(err){console.log('central account searchbranch : ',err);}
// 				}
// 		},
// 		CentralAccount: function(req, res, next){
// 			//console.log(req.session.roleLevel);
// 			//console.log(req.session.userMenu);
// 	        function drawtable(records){
//   	            var str =  "<tr>\n\
//                 <th width='5%'>UserName</th>\n\
//                 <th width='12%'>Name - Surname</th>\n\
//         		<th width='5%'>StaffID</th>\n\
//                 <th width='5%'>Role</th>\n\
//             	<th width='3%'>Status</th>\n\
//         		<th width='7%'>StartDate</th>\n\
//         		<th width='7%'>ExpireDate</th>\n\
//                 <th width='3%'>BrID</th>\n\
//                 <th width='13%'>BranchName</th>\n\
//             	<th width='2%'>RF</th>\n\
//             	<th width='2%'>ZF</th>\n\
//             	<th width='2%'>BF</th>\n\
//             	<th width='7%'>DeployStatus</th>\n\
//             	<th width='15%'>Action</th>\n\
//             	</tr>";
//             if(records.length > 0) { 
//             	for(var i=0; i < records.length; i++) {
//                 	if (records[i].startDate !== '') {
//                     	var datest = formatDate(records[i].startDate)}	                    	
//                     else {datest = ''}                    			
//                     if (records[i].expireDate !== '') {
//                     	var dateexp = formatDate(records[i].expireDate)}
//                     else {dateexp = ''}
// //                    if (records[i].lastLogon[0] !== '' && records[i].lastLogon[0] !== undefined && records[i].lastLogon !== undefined ) {
// //                    	var lastlog = newformate(records[i].lastLogon[0]) }
// //                    else {lastlog = ''}
//                     if (records[i].deployStatus !== '' && records[i].deployStatus !== undefined) {
//                     	var deploystat = records[i].deployStatus }
//                     else {deploystat = ''}
//                     if (records[i].regionFilter !== '' && records[i].regionFilter !== undefined) {
//                     	var rf = records[i].regionFilter }
//                     else {rf = ''}
//                     if (records[i].zoneFilter !== '' && records[i].zoneFilter !== undefined) {
//                     	var zf = records[i].zoneFilter }
//                     else {zf = ''}
//                     if (records[i].branchFilter !== '' && records[i].branchFilter !== undefined) {
//                     	var bf = records[i].branchFilter }
//                     else {bf = ''}
//                     	//var d = formatDate(records[i].lastLogon[0]);
//                     	//var h = records[i].lastLogon[0];
//                 	//console.log('lastlogon=',formatDate(records[i].lastLogon[0]).toHHMMSS());
//                 	//console.log('lastlogon=',newformate(records[i].lastLogon[0]));
//                     var roleDelete ="disabled='disabled'";
//                     //console.log(req.session.userMenu);
//                     for(var k=0;k<req.session.userMenu.length;k++){
//                     	if (req.session.userMenu[k].menuName =='Delete User'){
//                     		roleDelete='';
//                     	}
//                     }
//                     str += "<tr>\n\
//                                 <td align='center' class='vert-align'>" + records[i].userName + "</td>\n\
//                                 <td align='center' class='vert-align'>" + records[i].FullName + "</td>\n\
//                                 <td align='center' class='vert-align'>" + records[i].staffID + "</td>\n\
//                                 <td align='center' class='vert-align'>" + records[i].roleLevel + "</td>\n\
//                                 <td align='center' class='vert-align'>" + records[i].userState + "</td>\n\
//                                 <td align='center' class='vert-align'>" + datest + "</td>\n\
//                                 <td align='center' class='vert-align'>" + dateexp + "</td>\n\
//                                 <td align='center' class='vert-align'>" + records[i].branchID + "</td>\n\
//                                 <td align='center' class='vert-align'>" + records[i].branchName + "</td>\n\
//                                 <td align='center' class='vert-align'>" + rf + "</td>\n\
//                                 <td align='center' class='vert-align'>" + zf + "</td>\n\
//                                 <td align='center' class='vert-align'>" + bf + "</td>\n\
//                                 <td align='center' class='vert-align'>" + deploystat + "</td>\n\
//                                 <td align='center'><div class='btn-group'>\n\
//                                 <button type='button' ID='btnreset' class='btn btn-warning' data-id='" + records[i]._id + "' data-name='" + records[i].userName + "'  data-toggle='modal' data-toggle='modal' data-target='#central-confirm-reset'>Reset</button>\n\
//                                 <button type='button' ID='btnedit' class='btn btn-primary' data-id='" + records[i]._id + "' data-toggle='modal' data-target='#central-userdata-edit'>Edit</button>\n\
//                                 <button type='button' ID='btndel' " + roleDelete + " class='btn btn-danger' data-id='" + records[i]._id + "' data-name='" + records[i].userName + "' data-brid='" + records[i].branchID + "' data-brname='" + records[i].branchName + "' data-toggle='modal' data-target='#central-confirm-delete'>Delete</button>\n\
//                                 </td></div>\n\
//                             </tr>";	                  

//                 } 
//             }else {
//                 str += '<tr><td colspan="9" align="center">ไม่มีข้อมูล</td></tr>';
//             } 
// 	                return str;
// 	        }
	        	     
// 	        function pwdencryptest(password){
// 	        	var crypto = require('crypto'),
// 	            algorithm = 'aes-128-cbc',
// 	            key = 'Pas$w0rd';
	        	
// 	        	  var cipher = crypto.createCipher(algorithm,key)
// 	        	  var crypted = cipher.update(password,'utf8','hex')
// 	        	  crypted += cipher.final('hex');
// //	        	  console.log ('11111111111111111111111', crypted)
// 	        	  return crypted;  
// 	        };
// 	        function getMaxDocID(next){
// 	    		coll.find().sort({"userID" : -1}).limit(1).toArray(function(err,rec){
// 	                        if (!err){
// 	                            if (rec.length > 0){
// 	                                var rtn = rec[0]._id;
// 	                              next(parseFloat(rtn) + 1) ;
// 	                            }else{
// 	                                next(1);
// 	                            }
// 	                        }
// 	                    });
// 	    	}  
// 	        function writeFile(rec){
// 	        	var fs = require('fs');
// 	        	 //console.log(rec.length);
// 	        	    var data ="db=db.getSiblingDB('mbedq') \r\n";
// 	        	    data += " db.userList.drop() \r\n ";
	        	 
// 	        	    for(var i=0;i<rec.length;i++){
// 	        	    	data += " db.userList.insert(" + JSON.stringify(rec[i]) + ") \r\n";
// 	        	    }
	        	   
// 	        		fs.writeFile(req.pathWrite +  "/download/users.js",data , function(err) {
// 	        		    if(err) {
// 	        		    	 console.log(err);
// 	        		    	 return 'fail';
// 	        		    }
// 	        		    console.log("The file was saved!");
// 	        		    return  'success';
// 	        		}); 
// 	        		return  'success';
	        		
// 	        };

// 	        switch (req.method){
// 	            case 'POST':
// 	                var coll = req.db.collection('userList');

// 	                switch (req.body.action){
// 	                    case 'table':
// 	                    	if (JSON.parse(req.body.brall) == '' && req.body.username == '')
// 	                    		{
// //	                    		console.log('break');
// 	                    		break;
// 	                    		}
// 	                    	else if (req.body.brsearch !== '') {
// //	                    		console.log('brsearch|' , req.body.brsearch);
// 	                    		coll.find({ $and:[
// 	                    	                   {branchID : {$in : [req.body.brsearch]}},
// 	                    	                   { $or : [
// 	                    	                            {userName : {$regex :'(?i)' + req.body.username}} ,
// 	                    	                            {FullName : {$regex :'(?i)' + req.body.username}}
// 	                    	                           ]
// 	                    	                   }
// 	                    	                   ]}).sort({"branchName": 1 }).toArray(function(err,rec){
// //	                        coll.find({ $or : [{"userName" : {$regex : '(?i)' + req.body.username }}, {FullName : {$regex : '(?i)' + req.body.username}}]}).sort({"_id": 1 }).toArray(function(err,rec){
// //	                        	console.log('error|' , err);
// 	                    	                	   if(!err){
// //	                	                               res.json(JSON.stringify(rec));
// //	                	                        	   console.log('reponse web 1');
// 	                	                        	   if (req.session.userLogin!=null){
// 	                	                        		   var o={status:true,data:drawtable(rec)};
// //	                	                        		   console.log(o);
// 	                	                        		   res.send(JSON.stringify(o));
// 	                	                        	   	}else{
// 	                	                        	   	  var o={status:false,data:''};
// 	                	                        		   res.send(JSON.stringify(o));
// 	                	                        	   	}
// 	                	                        	   //res.send(drawtable(rec));
// //	                	                        	   console.log(rec);
// 	                	                           }else{
// 	                	                        	   var o={status:false,data:''};
// 	                	                        	   console.log(err,o);
// 	                                        		   res.send(JSON.stringify(o));
// 	                	                           }

// 	                    	                   });
	                    		
// 	                    		}
	                    	
// 	                    	else if (req.body.brsearch == '' && JSON.parse(req.body.brall).length > 0 ) {
// //	                    		console.log('brall|', JSON.parse(req.body.brall));
// 	                    		coll.find({ $and:[
// 		                    	                   {branchID : {$in : JSON.parse(req.body.brall)}},
// 		                    	                   { $or : [
// 		                    	                            {userName : {$regex :'(?i)' + req.body.username}} ,
// 		                    	                            {FullName : {$regex :'(?i)' + req.body.username}}
// 		                    	                           ]
// 		                    	                   }
// 		                    	                   ]}).sort({"branchName": 1 }).toArray(function(err,rec){
// //		                        coll.find({ $or : [{"userName" : {$regex : '(?i)' + req.body.username }}, {FullName : {$regex : '(?i)' + req.body.username}}]}).sort({"_id": 1 }).toArray(function(err,rec){
// //		                        	console.log('error|' , err);

// 		                    	                	   if(!err){
// //		                	                               res.json(JSON.stringify(rec));
// //		                	                        	   console.log('reponse web 2');
// 		                	                        	   if (req.session.userLogin!=null){
// 		                	                        		   var o={status:true,data:drawtable(rec)};
// //		                	                        		   console.log(o);
// 		                	                        		   res.send(JSON.stringify(o));
// 		                	                        	   	}else{
// 		                	                        	   	  var o={status:false,data:''};
// 		                	                        		   res.send(JSON.stringify(o));
// 		                	                        	   	}
// 		                	                        	   //res.send(drawtable(rec));
// //		                	                        	   console.log(rec);
// 		                	                           }else{
// 		                	                        	   var o={status:false,data:''};
// 		                	                        	   console.log(err,o);
// 		                                        		   res.send(JSON.stringify(o));
// 		                	                           }
// 		                    	                   });
	                    		
// 	                    	}
// 	                    	else if (req.body.brsearch == '' && JSON.parse(req.body.brall) == '' && req.body.username !== '' ) {
// //	                    		console.log('username|', req.body.username);
// 	                    		coll.find(
// 		                    	                   { $or : [
// 		                    	                            {userName : {$regex :'(?i)' + req.body.username}} ,
// 		                    	                            {FullName : {$regex :'(?i)' + req.body.username}}
// 		                    	                           ]
// 		                    	                   }
// 		                    	                   ).sort({"branchName": 1 }).toArray(function(err,rec){
// //		                        coll.find({ $or : [{"userName" : {$regex : '(?i)' + req.body.username }}, {FullName : {$regex : '(?i)' + req.body.username}}]}).sort({"_id": 1 }).toArray(function(err,rec){
// //		                        	console.log('error|' , err);

// 		                    	                	   if(!err){
// //		                	                               res.json(JSON.stringify(rec));
// //		                	                        	   console.log('reponse web 3');
// 		                	                        	   if (req.session.userLogin!=null){
// 		                	                        		   var o={status:true,data:drawtable(rec)};
// //		                	                        		   console.log(o);
// 		                	                        		   res.send(JSON.stringify(o));
// 		                	                        	   	}else{
// 		                	                        	   	  var o={status:false,data:''};
// 		                	                        		   res.send(JSON.stringify(o));
// 		                	                        	   	}
// 		                	                        	   //res.send(drawtable(rec));
// //		                	                        	   console.log(rec);
// 		                	                           }else{
// 		                	                        	   var o={status:false,data:''};
// 		                	                        	   console.log(err,o);
// 		                                        		   res.send(JSON.stringify(o));
// 		                	                           }
// 		                    	                   });
                    		
// 	                    	}
// 	                        break;
// 	                   case 'write':
	                    	
// 	                        coll.find({ "branchID" : req.body.branchid }).sort({"_id": 1 }).toArray(function(err,rec){
// 	                           if(!err){
	                        	   
// 	                               res.send(writeFile(rec));
// 	                           }
// 	                       });
// 	                        break;
// 	                    case 'check':
// 	                    	coll.find({"userName" : req.body.username}).toArray(function(err,rec){
// //	                    		console.log ('username|=' + req.body.username);
// //	                    		console.log(rec.length , rec);
// 	                    		if (rec.length !== 0){
// 	                    			res.send('username is duplicated');
// 	                    		}
// 	                    		else {
// 	                    			res.send('');
// 	                    		}
// 	                    	})
	                    	
// 	                    	break;
// 	                    case 'role':
// 	                    	req.db.collection('sys-role').find({}).toArray(function(err,recrole){                                                     		
// 	                    		if(!err){                           	
// //	                            	console.log(recrole);
// 	                            	res.json(recrole);                            	
// 	                            }
// 	                    	});
	                    	
// 	                    	break;
// 	                    case 'select':
// 	                        coll.findOne({
// 	                            "_id" : ObjectId(req.body.id)
// 	                        	//"_id" : String(req.body.id)
	                            
// 	                        },function(err, rec){
// 	                            if(!err){                           	
// 	                            	//console.log(rec);
// 	                            	if (rec.lastLogon[0] !== '' && rec.lastLogon[0] !== undefined && rec.lastLogon !== undefined) {
// 	                    				var lastlogon = (rec.lastLogon[0])
// 	                            		rec.lastLogon[0] = newformate(rec.lastLogon[0])}
// 	                    				else {rec.lastLogon[0] = ''}	                            	

// 	                            	res.send(JSON.stringify(rec));
	                            	
// 	                            }
// 	                        });
// 	                    break;
// 	                    ///////////////////////insert////////////////////////////////////////////////////////////////////////////////
// 	                    case 'insert':   
// 	                    	var pwden = pwdencryptest(req.body.password);	 
// //	                    	console.log(pwden);
// 	                    	getMaxDocID(function (maxid){
// 	                    		/*var raw = req.body.startdate.split('/');
// 	                    		var stDate = new Date(raw[2] + '-' + raw[1] + '-' + raw[0]);*/
// 	                    		//var arrBranch = req.body.ddlBranch.split('|');
// 	                    		var d = new Date(Date.parse(req.body.startdate));
// 	                    		var dateEx = new Date();
// 	                    		dateEx.setDate(dateEx.getDate() + 90);
// 								var exd = '';
// 								if (req.body.expiredate !== ''){
// 									exd = new Date(Date.parse(req.body.expiredate))							
// 								} 
// 								var disS = '';
// 								var disE = '';
// 								if (req.body.disablestart !== ''){
// 									disS = new Date(Date.parse(req.body.disablestart))
// //									disS.setHours (0,0,0,0);
// 								}
// 								if (req.body.disableexpire !== ''){
// 									disE = new Date(Date.parse(req.body.disableexpire))
// //									disE.setHours (0,0,0,0);
// 								}
// //								console.log('||||||||||||||||||',req.body.passpolicy);
// 								var deployS = 'wait'
// 								if (req.body.branchid  == '0000' || req.body.branchid.length < 4){deployS = 'Successfully';}
// 								else {deployS = 'wait'}
// 								var rf = []
// 								if (req.body.regionfilter == '') {rf = [];} else {rf = [req.body.regionfilter];}
// 								var zf = []
// 								if (req.body.zonefilter == '') {zf = [];} else {zf = [req.body.zonefilter];}
// 								var bf = []
// 								if (req.body.branchfilter == '') {bf = [];} else {bf = [req.body.branchfilter];}
// 								console.log('deployS====',deployS);
// 	                            coll.insertOne({
// 	                            	 // "_id" : String(maxid),
// 	                            		//"_id" :  ObjectId(req.body.id),
// 	                                    "userName" : req.body.username,

// 	                                    "staffID" : req.body.staffid,
// 	                                   // "delete" : false,
// 	                                    "roleLevel" : req.body.rolelevel,
// 	                                    "FullName" : req.body.fullname,
// 	                                    "lastLogon" : ['',''],
// 	                                    "wrongLogon" : 0,
// 	                                    "userState" : req.body.userState,
// 	                                    "firstLogon" : true,
// 	                                  //  "isEnable" : Boolean(req.body.enable),
// 	                                  //  "isEnable" : (req.body.enable === 1?true:false),
// 	                                    "createDate" : new Date(),
// 	                                    "startDate" : new Date(Date.parse(req.body.startdate)),				//(req.body.startdate),  /*stDate.toISOString,*/	                                   
// 	                                    "expireDate" : exd,					//(req.body.expirydate),                            
// 	                            		"activeDate" : '',
// 	                            		"disableStart" : disS,
// 	                            		"disableExpire"  : disE,
// 	                            		//"branchID" :{branchID:req.body.branchid,branchName:req.body.branchname},
// 	                                    "branchID" : req.body.branchid,
// 	                            		"branchName" : req.body.branchname,
// 	                            		"deployStatus" : deployS,
// 	                                   //"status" : [],
// 	                            		"regionFilter" : rf,
// 	                            		"zoneFilter" : zf,
// 	                            		"branchFilter" : zf,
// 	                                    "passPolicy" : (req.body.passpolicy === '0'?false:true),
// //	                            		"passPolicy" : (req.body.passpolicy === 'true'?true:false),
// 	                                    "userPass" : [{userPass:pwden,dateCreate:new Date(),dateExpiry:dateEx},
// 	                                                  {userPass:'',dateCreate:new Date(),dateExpiry:new Date()},        
// 	                                                  {userPass:'',dateCreate:new Date(),dateExpiry:new Date()},
// 	                                                  {userPass:'',dateCreate:new Date(),dateExpiry:new Date()},        
// 	                                                  {userPass:'',dateCreate:new Date(),dateExpiry:new Date()},        
// 	                                                  {userPass:'',dateCreate:new Date(),dateExpiry:new Date()},        
// 	                                    ],
// 	                                    segment: [
// 	                            			      { name: 'Wisdom',  Qcomplete: 0, Qcancel: 0, QserviceTime: 0,  QwaitTime: 0, },
// 	                            			      { name: 'Mass',  Qcomplete: 0, Qcancel: 0, QserviceTime: 0,  QwaitTime: 0, },
// 	                            			      { name: 'Corperate',  Qcomplete: 0, Qcancel: 0, QserviceTime: 0,  QwaitTime: 0, },
// 	                            			    ]	  
	                            
// //	                            		"QComplete" : {Wisdom:0,Mass:0,Corporate:0},
// //	                            		"QCancel" : {Wisdom:0,Mass:0,Corporate:0},
// //	                            		"serviceTime" : {Wisdom:0,Mass:0,Corporate:0},
// //	                            		"waitTime" : {Wisdom:0,Mass:0,Corporate:0}
	                           
// 	                            },function(err,record){
// 	                                if(!err){
// //	                                	var bid = (req.body.branchid)
// //	                                	console.log('bid===',bid);
// //	                                	console.log('LENGTH=====',(req.body.branchid.length));
	                                	
// 	                                   // coll.find({}).sort({"_id": 1 }).toArray(function(err,records){
// //	                                	console.log('AddBrach:' + req.body.branchid);
// //	                                	coll.find({ "userName" : req.body.username },{"_id":0,"branchID":0,"branchName":0,"dateUpdate":0,"fileUpdate":0,"delete":0,"action":0}).sort({"_id": 1 }).toArray(function(err,result){	
// 	                                		coll.find({ "userName" : req.body.username },{"_id":0,"dateUpdate":0,"fileUpdate":0,"delete":0,"action":0}).sort({"_id": 1 }).toArray(function(err,result){	
	    	                                		
// 	                                		if (!err){
// 	                                			//console.log( 'user|' , result);
// 	                                			////////////////////////write file////////////////////////////////////////
// 	                                			var fs = require('fs');
// 	                                	    	var filenamepath ="/public/download/userList_" +  req.body.branchid + '_' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(' ', '-').replace(':', '-').replace(':', '-')  +  ".json";
// 	                                	    	var filename ="userList_" + req.body.branchid + '_' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(' ', '-').replace(':', '-').replace(':', '-')  +  ".json";
// //	                                	    	console.log('calling saveFileDeploy');
// //	                                	    	console.log('filenamepath|' + filenamepath );
// //	                                	    	console.log('filename|' + filename);
// 	                                	    	var data ="[";
// 	                        	    	    	for(var i=0;i<result.length;i++){
// 	                        	    	    	//	result[i].delete = false;
// 	                        	    	    		if (i != 0) {
// 	                        	    	    			data += ','
// 	                        	    	    		}
// 	                        	        	    	data +='{"collection":"userList",';
// 	                        	        	    	data +='"query": {"userName":"' + result[i].userName  + '"},';
// 	                        	        	    	data +='"action":"update",';
// 	                        	        	    	data +='"data":' + JSON.stringify(result[i],null, 4);
// 	                        	        	    	data +='}';
// 	                        	        	    	}
// 	                        	        	    	data+="]"
// 	                        	        	    		if (req.body.branchid  !== '0000' && req.body.branchid.length >= 4){
// 	                        	        	     // fs.writeFile(__dirname.replace('\\routes','')  + filenamepath, data, function(err){     // Windows
// 	                                	    	fs.writeFile(__dirname.replace('/routes','')  + filenamepath, data, function(err){		// Linux
// 	                                	    		if(!err){	    			
// 	                                	    			console.log('write_file_' + filename + '_in_public_path_Success');	  
// 	                                	    			//console.log(req)
// 	                                	    			req.db.collection('sys-update-log').insertOne(
// 	                                	    					{
// 	                                	    						branchID : req.body.branchid
// 	                                	    						,branchName : req.body.branchname
// 	                                	    						,deploytype: 'json'
// 	                                	    						,deployval : filename
// 	                                	    						,deploykind : 'userList'
// 	                                	    						,deployby : req.session.userLogin.userName
// 	                                	    						,filepath : req.protocol + '://' + req.get('host')  + filenamepath.replace('/public','')
// 	                                	    						,filename : filename
// 	                                	    						,createdate : new Date()
// 	                                	    						,deploySchedule : new Date()
// 	                                	    					    ,status :'wait'
// 	                                	    					    ,modifydate : new Date()
// 	                                	    						,reDeploy : reD
// 	                                								,timeout : timeO
// 	                                	    					    ,updated :  'now'
// 	                                	    					},function(err, result) {
// 	                                	    					 if (err) throw err;
// 	                                	    					 console.log('writeDB_BrID=_'+ req.body.branchid + '_complete')
// 	                                	    					// console.log('ffffff|' + req.headers.origin  + filenamepath.replace('/public',''));
	                                	    						
// 	                                	    						 //res.send({data : {status: 'success'}});
// 	                                	    				     }); 
// 	                                	    		}
// 	                                	    		else {
// 	                                	    			console.log('error|' +err);
// 	                                	    		}
// 	                                	    	})
// 	                        	        	    		}
// 	                                	    	///////////////////////////////////////////////////////////////////////////////////////	                 		
// 	                                		}
// 	                                	});
	                                	
// 	                                	 coll.find({ "userName" : req.body.username  }).sort({"_id": 1 }).toArray(function(err,records){
// 	                                       if (!err){
// //	                                    	   console.log('ROLELEVEL| ' + req.body.rolelevel);
// //	                                    	   console.log('USERSTATE| ' + req.body.userState);	                                    	   
// 	                                           res.send(drawtable(records));
// 	                                       }
// 	                                    });
// 	                                	 /////////////////////
	                                
// 	                                }
// 	                            }
// 	                            );
// 	                    	});
// 	                        break;  
//                 	    	////////////////delete///////////////////////////////////////////////////////////////////////	                                			
// 	                    case 'delete':
// 	                    	coll.find({ "userName" : req.body.username, "branchID" : req.body.branchid },{"_id":0,"branchID":0,"branchName":0,"dateUpdate":0,"fileUpdate":0,"delete":0,"action":0}).sort({"_id": 1 }).toArray(function(err,result){
// //	        	        		console.log('findusername,br', result );
// //	        	        		console.log('br=', req.body.branchid);
// //	        	        		console.log('unamer=', req.body.username);
// 	        	        		//console.log(err);
// 	        	        		if (!err)
// 	        	        	{
// 	        	        			console.log('--------delete user');
// 	        	        			 coll.deleteOne({
//     		    						 "_id" : ObjectId(req.body.id)	        		    					 
//     		    					 },function(err,rec){
//     		    						 if(!err){
//     		    							 res.send(drawtable(rec));
// //    		    							 console.log('DeleteBrach:' + req.body.branchid);
// //    			                             console.log('username:' + req.body.username);
// //    			                             coll.find({ "branchID" : req.body.branchid }).sort({"_id": 1 }).toArray(function(err,records){                                   
// //    			                            	 if (!err){
// //    			                            		 res.send(drawtable(records));
// //    			                            	 		}
// //    			                             		});
    		    						 		
// //	        	        			console.log(req.session.userLogin.userName);
// 	        	        		var fs = require('fs');
// 	        					var filenamepath ="/public/download/userList_" +  req.body.branchid + '_' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(' ', '-').replace(':', '-').replace(':', '-')  +  ".json";
// 	        	    	    	var filename ="userList_" + req.body.branchid + '_' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(' ', '-').replace(':', '-').replace(':', '-')  +  ".json";
// 	        	    	    	var data ="[";
// 	        	    	    	for(var i=0;i<result.length;i++){
// 	        	    	    		result[i].userState = 'disable';
// 	        	    	    		if (i != 0) {
// 	        	    	    			data += ','
// 	        	    	    		}
// 	        	        	    	data +='{"collection":"userList",';
// 	        	        	    	data +='"query": {"userName":"' + result[i].userName  + '"},';
// 	        	        	    	data +='"action":"delete",';
// 	        	        	    	data +='"data":' + JSON.stringify(result[i],null, 4);
// 	        	        	    	data +='}';
// 	        	        	    	}
// 	        	        	    	data+="]"
// 	        	        	    		if (req.body.branchid  !== '0000' && req.body.branchid.length >= 4){
// 	        					 // fs.writeFile(__dirname.replace('\\routes','')  + filenamepath, data, function(err){		//windows
// 	        					fs.writeFile(__dirname.replace('/routes','')  + filenamepath, data, function(err){		//linux
// 	        	        	    //console.log(req.pathWrite +  filenamepath ,data);
	        	        	    
// //	        	        	    fs.writeFile(req.pathWrite +  filenamepath ,data,function(err){
	        	        	    	
// 	        						if(!err){
// 	        							console.log('write_file_delete_' + filename + '_in_public_path_Success');
// 	        							req.db.collection('sys-update-log').insertOne({
// 	        								branchID : req.body.branchid
// 	        								,branchName : req.body.branchname
// 	        	    						,deploytype: 'json'
// 	            	    					,deployval : filename
// 	            	    					,deploykind : 'userList'
// 	            	    					,deployby : req.session.userLogin.userName
// 	        	    						,filepath : req.protocol + '://' + req.get('host')  + filenamepath.replace('/public','')
// 	        	    						,filename : filename
// 	        	    						,createdate : new Date()
// 	        								,deploySchedule : new Date()
// 	        	    					    ,status :'wait'
// 	        	    					    ,modifydate : new Date()
// 	        								,reDeploy : reD
// 	        								,timeout : timeO
// 	        	    					    ,updated :  'now'
// 	        							},function(err, result) {
// 	        								 if (err) throw err;
// 	        		    					 console.log('writeDB_delete_BrID=_'+ req.body.branchid + '_complete');
	        		    					
// 	        							});                          	    									
// 	        						}
// 	        						else{
// 	        							console.log('Error_Update_Delete| ' + err);
// 	        						}
// 	        					});
// 	        	        	}
//     		    						 }
//     		    					 })	
// 	        					//////////////////////////////////////////
// 	        	        	}
	        	        			
// 	        	        	});
	                    	
	                    	
// //	                    	coll.deleteOne({
// //	                            "_id" :  ObjectId(req.body.id)
// //	                            
// //	                    	//	"_id" : req.body.id
// //	                        },function(err,rec){
// //	                            if(!err){
// //	                                 // coll.find({}).sort({"_id": 1 }).toArray(function(err,records){
// //	                                	 // console.log(req.body.id);
// //	                                	 // console.log(records);
// //	                            	console.log('DeleteBrach:' + req.body.brid);
// //	                            	console.log('username:' + req.body.username);
// //	                            	 coll.find({ "branchID" : req.body.branchid }).sort({"_id": 1 }).toArray(function(err,records){                                   
// //	                                     if (!err){
// //	                                         res.send(drawtable(records));
// //	                                     }
// //	                                  });
// //	                            }
// //	                        });
// 	                        break;
// 	                    case 'check-edit':
// 	        	        	coll.find({ "userName" : req.body.username, "branchID" : req.body.branchid },{"_id":0,"branchID":0,"branchName":0,"dateUpdate":0,"fileUpdate":0,"delete":0,"action":0}).sort({"_id": 1 }).toArray(function(err,result){
// 	        	        		//console.log('oldbranchhhhhh', result );
// 	        	        		//console.log(err);
// 	        	        		if (!err){
// //	        	        			console.log('asdfasdfasdfasdf',' uname=',req.body.username,' brOldID=',req.body.branchidold,' brID=',req.body.branchid,' result=',result)
// 	        	        			if (result.length > 0) {
// 	        	        			res.send('Branch is duplicate');}		        	        			
// 	        	        			else {res.send('');}
// 	        	        				}
// 	        	        	})	        	        		                    	
// 	                    	break;
// 	                    case 'editbranch' :
// 	                    	coll.find({ "userName" : req.body.username},{"_id":0,"branchID":0,"branchName":0,"dateUpdate":0,"fileUpdate":0,"delete":0,"action":0}).sort({"_id": 1 }).toArray(function(err,result){
// //	        	        		coll.find({ "userName" : req.body.username, "branchID" : req.body.branchidold},{"_id":0,"branchID":0,"branchName":0,"dateUpdate":0,"fileUpdate":0,"delete":0,"action":0}).sort({"_id": 1 }).toArray(function(err,result){
	        	    	        		
// 	        	        		//console.log('oldbranchhhhhh', result );
// 	        	        		//console.log(err);
// 	        	        		if (!err){	        	
// 	        	        			console.log('--------delete user oldBR');
// //	        	        			console.log(req.session.userLogin.userName);
// 	        	        		var fs = require('fs');
// 	        					var filenamepath ="/public/download/userList_" +  req.body.branchidold + '_' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(' ', '-').replace(':', '-').replace(':', '-')  +  ".json";
// 	        	    	    	var filename ="userList_" + req.body.branchidold + '_' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(' ', '-').replace(':', '-').replace(':', '-')  +  ".json";
// 	        	    	    	var data ="[";
// 	        	    	    	for(var i=0;i<result.length;i++){
// 	        	    	    		result[i].userState = 'disable';
// 	        	    	    		if (i != 0) {
// 	        	    	    			data += ','
// 	        	    	    		}
// 	        	        	    	data +='{"collection":"userList",';
// 	        	        	    	data +='"query": {"userName":"' + result[i].userName  + '"},';
// 	        	        	    	data +='"action":"delete",';
// 	        	        	    	data +='"data":' + JSON.stringify(result[i],null, 4);
// 	        	        	    	data +='}';
// 	        	        	    	}
// 	        	        	    	data+="]"
	        	        	    		
// 	        	        	    		if (req.body.branchidold  !== '0000' && req.body.branchidold.length >= 4){
// 	        					 // fs.writeFile(__dirname.replace('\\routes','')  + filenamepath, data, function(err){		//windows
// 	        						fs.writeFile(__dirname.replace('/routes','')  + filenamepath, data, function(err){		//linux
// 	        	        	    //console.log(req.pathWrite +  filenamepath ,data);
	        	        	    
// //	        	        	    fs.writeFile(req.pathWrite +  filenamepath ,data,function(err){
	        	        	    	
// 	        						if(!err){
// 	        							console.log('write_file_delete_' + filename + '_in_public_path_Success');
// 	        							req.db.collection('sys-update-log').insertOne({
// 	        								branchID : req.body.branchidold
// 	        								,branchName : req.body.branchnameold
// 	        	    						,deploytype: 'json'
// 	            	    					,deployval : filename
// 	            	    					,deploykind : 'userList'
// 	            	    					,deployby : req.session.userLogin.userName
// 	        	    						,filepath : req.protocol + '://' + req.get('host')  + filenamepath.replace('/public','')
// 	        	    						,filename : filename
// 	        	    						,createdate : new Date()
// 	        								,deploySchedule : new Date()
// 	        	    					    ,status :'wait'
// 	        	    					    ,modifydate : new Date()
// 	        								,reDeploy : reD
// 	        								,timeout : timeO
// 	        	    					    ,updated :  'now'
// 	        							},function(err, result) {
// 	        								 if (err) throw err;
// 	        		    					 console.log('writeDB_delete_BrID=_'+ req.body.branchidold + '_complete');
// 	        		    					 res.send({data:'ok'});
// 	        							});                          	    									
// 	        						}
// 	        						else{
// 	        							console.log('Error_Update_Delete| ' + err);
// 	        						}
// 	        					});
// 	        	        		}
// //	        	        	    		else{res.send({data:'ok'});}
// 	        					/////////////////////////////////////////////
// 	        	        	}
	        	        			
// 	        	        	});
// //	                    	updateoldbranch(req);
// 	                    	break;
//                 	    	/////////////edit//////////////////////////////////////////////////////////////////////////	                                			
// 	                    case 'edit':
// 	                    	var exd = '';
// 	                    	var disstart = '';
// 	                    	var disexp = '';
// 	                    	if (req.body.expiredate !== ''){
// 								exd = new Date(Date.parse(req.body.expiredate))
// //								exd.setHours(0,0,0,0);
// 							}
// 	                    	if (req.body.disablestart !== ''){
// 	                    		disstart = new Date(Date.parse(req.body.disablestart))
// //	                    		disstart.setHours(0,0,0,0);
// 							}
// 	                    	if (req.body.disableexpire !== ''){
// 	                    		disexp = new Date(Date.parse(req.body.disableexpire))
// //	                    		disexp.setHours(0,0,0,0);
// 							}
// 							var deployS = 'wait'
// 							if (req.body.branchid  == '0000' || req.body.branchid.length < 4){deployS = 'Successfully';}
// 							else {deployS = 'wait'}
// 							var rf = []
// 							if (req.body.regionfilter == '') {rf = [];} else {rf = [req.body.regionfilter];}
// 							var zf = []
// 							if (req.body.zonefilter == '') {zf = [];} else {zf = [req.body.zonefilter];}
// 							var bf = []
// 							if (req.body.branchfilter == '') {bf = [];} else {bf = [req.body.branchfilter];}
// 							console.log('deployS====',deployS);
// 	                    //	console.log(req.body.passpolicy,(req.body.passpolicy == '1'?true:false));
// //	                    console.log	(req.body.regionfilter,req.body.branchfilter,req.body.branchfilter)
	                    
// 	                        coll.findOneAndUpdate({
// 	                            "_id" : ObjectId(req.body.id)
// 	                        //	"_id" : req.body.id
// 	                        },{ 
// 	                            "$set" : {
// 	                                "userName" : req.body.username,
// 	                                "staffID" : req.body.staffid,
// 	                             //   "delete" : false,
// 	                                "roleLevel" : req.body.rolelevel,
// 	                                "FullName" : req.body.fullname,
// 	                                "userState" :  req.body.userState,
// 	                                "startDate" :  new Date(Date.parse(req.body.startdate)),
// 	                                "expireDate" : exd,
// 	                                "disableStart" : disstart,
// 	                                "disableExpire" : disexp,
// 	                                "passPolicy" : (req.body.passpolicy === '0'?false:true),
// 	                                //"branch" :{branchID:req.body.branchid,branchName:req.body.branchname}
// 	                                "branchID" : req.body.branchid,
// 	                                "branchName" : req.body.branchname,
//                             		"regionFilter" : rf,
//                             		"zoneFilter" : zf,
//                             		"branchFilter" : bf,                           		
// 	                                "deployStatus" : deployS
// 	                            }

// 	                        },function(err,record){
// 	                            if(!err){
	                            	
	                            	
// 	                            	coll.find({ "userName" : req.body.username, "branchID" : req.body.branchid  },{"_id":0,"branchID":0,"branchName":0,"dateUpdate":0,"fileUpdate":0,"delete":0,"action":0}).sort({"_id": 1 }).toArray(function(err,results){	
//                                 		if (!err){
//                                 			//console.log( 'user|' , result);
//                                 			////////////////////////write file////////////////////////////////////////
//                                 			var fs = require('fs');
//                                 	    	var filenamepath ="/public/download/userList_" +  req.body.branchid + '_' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(' ', '-').replace(':', '-').replace(':', '-')  +  ".json";
//                                 	    	var filename ="userList_" + req.body.branchid + '_' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(' ', '-').replace(':', '-').replace(':', '-')  +  ".json";
// //                                	    	console.log('calling saveFileDeploy');
// //                                	    	console.log('filenamepath|' + filenamepath );
// //                                	    	console.log('filename|' + filename);
//                                 	    	var data ="[";
//                         	    	    	for(var i=0;i<results.length;i++){
//                         	    	    	//	results[i].delete = false;
//                         	    	    		if (i != 0) {
//                         	    	    			data += ','
//                         	    	    		}
//                         	        	    	data +='{"collection":"userList",';
//                         	        	    	data +='"query": {"userName":"' + results[i].userName  + '"},';
//                         	        	    	data +='"action":"update",';
//                         	        	    	data +='"data":' + JSON.stringify(results[i],null, 4);
//                         	        	    	data +='}';
//                         	        	    	}
//                         	        	    	data+="]"
// //                                	    		console.log(__dirname);
//                         	        	    		if (req.body.branchid  !== '0000' && req.body.branchid.length >= 4){
//                              	    	fs.writeFile(__dirname.replace('/routes','')  + filenamepath, data, function(err){		//linux
//                                 	    	 // fs.writeFile(__dirname.replace('\\routes','')  + filenamepath, data, function(err){		//Window
//                                 	    		if(!err){	    			
//                                 	    			console.log('write_file_' + filename + '_in_public_path_Success');	  
//                                 	    			//console.log(req)
//                                 	    			req.db.collection('sys-update-log').insertOne(
//                                 	    					{
//                                 	    						branchID : req.body.branchid
//                                 	    						,branchName : req.body.branchname
//                                 	    						,deploytype: 'json'
// 	                                	    					,deployval : filename
// 	                                	    					,deploykind : 'userList'
// 	                                	    					,deployby : req.session.userLogin.userName	
//                                 	    						,filepath : req.protocol + '://' + req.get('host') + filenamepath.replace('/public','')
//                                 	    						,filename : filename
//                                 	    						,createdate : new Date()
//                                 	    						,deploySchedule : new Date()
//                                 	    					    ,status :'wait'
//                                 	    					    ,modifydate : new Date()
//                                 	    						,reDeploy : reD
//                                 								,timeout : timeO
//                                 	    					    ,updated :  'now'
//                                 	    					},function(err, result) {
//                                 	    					 if (err) throw err;
//                                 	    					 console.log('writeDB_BrID=_'+ req.body.branchid + '_complete');
//                                 	    					// console.log('ffffff|' + req.headers.origin  + filenamepath.replace('/public',''));
// //                                	    						if (req.body.branchid != req.body.branchidold) {
// //                                	    							console.log('branchidold= '+  req.body.branchidold + '|' + filenamepath + '|' + filename);
// //                                   							
// //                                	    							
// //                                	    							
// //                                	    							console.log('logssssss|',results)
// //                                	    						}
//                                 	    						 //res.send({data : {status: 'success'}});
//                                 	    				     }); 
//                                 	    		}
//                                 	    		else {
//                                 	    			console.log('error|' +err);
//                                 	    		}
//                                 	    	})
//                                 		}
//                                 	    	///////////////////////////////////////////////////////////////////////////////////////	                                			
//                                 		}
                                		
//                                 	});
	                            	
// 	                            	 coll.find({ "branchID" : req.body.branchidold }).sort({"_id": 1 }).toArray(function(err,records){
// 	                                   if (!err){                          	   
// 	                                       res.send(drawtable(records));
// 	                                   }
// 	                                });
// 	                            }
// 	                        }
// 	                        );
// 	                        break; 
//                 	    	/////////reset//////////////////////////////////////////////////////////////////////////////	                                			
// 	                    case 'reset':
// 	                    	var dateEx = new Date();
// 	                    	var uname = '';
//                     		dateEx.setDate(dateEx.getDate() + 90);

// 	                        coll.findOne({
// 	                            //"_id" : ObjectId(req.body.id)
// 	                        	 "_id" : ObjectId(req.body.id)
// 	                        },function(err, rec){
// 	                            if(!err){       
// //	                            	console.log(rec.userPass[0]);
// 	                    			var deployS = 'wait'
// 	            					if (req.body.branchid  == '0000' || req.body.branchid.length < 4){deployS = 'Successfully';}
// 	            					else {deployS = 'wait'}
// 	                    			console.log('deployS====',deployS);
// 	                            	uname = rec.userName,
// 	                            	brid = rec.branchID,
// 	                            	brname = rec.branchName,
// 	                            	rec.userPass[0].userPass = pwdencryptest(req.body.newpwd),
// 	                            	rec.userPass[0].dateCreate = new Date(),
// 	                            	rec.userPass[0].dateExpiry = dateEx
// 	                           coll.findOneAndUpdate({
// 	                            "_id" : ObjectId(req.body.id)                       
// 	                        },{ 
// 	                           "$set" : {
// 	                               "userPass" : rec.userPass,
// 	                               "worngLogin" : 0,
// 	                               "firstLogon" :  Boolean(1),
// 	                               "deployStatus" : deployS
// 	                              // "dataCreate" : new Date()                              
// 	                            }

// 	                        },function(err,record){
// 	                           if(!err){
// //	                        	   console.log('U:' + uname);
// //	                        	   console.log('brid:' + brid);
// 	                            	coll.find({ "userName" : uname },{"_id":0,"branchID":0,"branchName":0,"dateUpdate":0,"fileUpdate":0,"delete":0,"action":0}).sort({"_id": 1 }).toArray(function(err,results){	
//                                 		if (!err){
//                                 			//console.log( 'user|' , result);
//                                 			////////////////////////write file////////////////////////////////////////
//                                 			var fs = require('fs');
//                                 	    	var filenamepath ="/public/download/userList_" +  brid + '_' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(' ', '-').replace(':', '-').replace(':', '-')  +  ".json";
//                                 	    	var filename ="userList_" + brid + '_' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(' ', '-').replace(':', '-').replace(':', '-')  +  ".json";
// //                                	    	console.log('calling saveFileDeploy');
// //                                	    	console.log('filenamepath|' + filenamepath );
// //                                	    	console.log('filename|' + filename);
//                                 	    	var data ="[";
//                         	    	    	for(var i=0;i<results.length;i++){
//                         	    	    	//	results[i].delete = false;
//                         	    	    		if (i != 0) {
//                         	    	    			data += ','
//                         	    	    		}
//                         	        	    	data +='{"collection":"userList",';
//                         	        	    	data +='"query": {"userName":"' + results[i].userName  + '"},';
//                         	        	    	data +='"action":"update",';
//                         	        	    	data +='"data":' + JSON.stringify(results[i],null,4);
//                         	        	    	data +='}';
//                         	        	    	}
//                         	        	    	data+="]"
// //                                	    		console.log(__dirname);
//                         	        	    		if (rec.branchID  !== '0000' && rec.branchID.length >= 4){
//                               	    	fs.writeFile(__dirname.replace('/routes','')  + filenamepath, data, function(err){		//linux
//                                 	    	 // fs.writeFile(__dirname.replace('\\routes','')  + filenamepath, data, function(err){		//Window
//                                 	    		if(!err){	    			
//                                 	    			console.log('write_file_reset' + filename + '_in_public_path_Success');	  
//                                 	    			//console.log(req)
//                                 	    			req.db.collection('sys-update-log').insertOne(
//                                 	    					{
//                                 	    						branchID : brid
//                                 	    						,branchName : brname
//                                 	    						,deploytype: 'json'
// 	                                	    					,deployval : filename
// 	                                	    					,deploykind : 'userList'
// 	                                	    					,deployby : req.session.userLogin.userName	
//                                 	    						,filepath : req.protocol + '://' + req.get('host') + filenamepath.replace('/public','')
//                                 	    						,filename : filename
//                                 	    						,createdate : new Date()
//                                 	    						,deploySchedule : new Date()
//                                 	    					    ,status :'wait'
//                                 	    					    ,modifydate : new Date()
//                                 	    						,reDeploy : reD
//                                 								,timeout : timeO
//                                 	    					    ,updated :  'now'
//                                 	    					},function(err, result) {
//                                 	    					 if (err) throw err;
//                                 	    					 console.log('writeDB_BrID=_'+ brid + '_complete');
//                                 	    					// console.log('ffffff|' + req.headers.origin  + filenamepath.replace('/public',''));
// //                                	    						if (req.body.branchid != req.body.branchidold) {
// //                                	    							console.log('branchidold= '+  req.body.branchidold + '|' + filenamepath + '|' + filename);
// //                                   							
// //                                	    							
// //                                	    							
// //                                	    							console.log('logssssss|',results)
// //                                	    						}
//                                 	    						 //res.send({data : {status: 'success'}});
//                                 	    				     }); 
//                                 	    		}
//                                 	    		else {
//                                 	    			console.log('error|' +err);
//                                 	    		}
//                                 	    	})
//                                 		}
//                                 	    	///////////////////////////////////////////////////////////////////////////////////////	                                			
//                                 		}
                                		
//                                 	});
	                        	   
	                        	   
// 	                            	 coll.find({ "branchID" : brid }).sort({"_id": 1 }).toArray(function(err,records){
// 	                                   if (!err){
// 	                                       res.send(drawtable(records));
// 	                                   }
// 	                                });
// 	                            }

// 	                        }
// 	                        );
	                            	
// 	                            }
// 	                        });                 
	                        
// 	                        break;  
// 	                    default:
// 	                }
// 	                break;
// 	            default:  
// 	            	var ipaddress='127.0.0.1';
// 	            require('dns').lookup(require('os').hostname(), function (err, add, fam) {
// 					  ipaddress = add;
// 					  console.log(ipaddress);
					  
// 			          res.render('central-account',{
// 		                   title:'Central - Account',
// 		                   user:req.session.user,
// 		                   host:req.headers.host,
// 		                   branch :req.session.branch,
// 		                   branchText :JSON.stringify(req.session.branch),
// 		                   ipaddress : ipaddress
// 		               });
					  
// 	            });
	     
// 	        }
// 	    },
// 	    getbranch : function(req, res){
	    	
// 	    	var branch=[];
// 	    	var coll;
// 	    	var cond1={};
// 	    	var cond2={};
// 	    	console.log( 'getbranch ' + req.body.type);
// 	    	switch(req.body.type){
// 	    	 case "1" : 
// 	    		coll = req.db.collection('region');
	    		
// 	    		break;
// 	    	 case "2" : 
// 	    		coll = req.db.collection('zone');
	    	
	    		
// 	    	    break;
// 	    	 default :
// 	    		coll = req.db.collection('branch');	
// 	    	    if (req.body.cond1!=''){
// 	    		    cond1 = {'regionID' : req.body.cond1};
	    		    
// 	    	    }
// 	    	    if (req.body.cond2!=''){
// 	    		    cond2 = {'zoneID' : req.body.cond2};
	    		    
// 	    	    }

// 	    	}

	    	
// 	    	coll.find({$and: [cond1,cond2]}).toArray(function(err, result) {

// 	    	    if (err) throw err;
	    	    
// 	    	    for(var i=0;i<result.length;i++){
	    	    
// 	    	     switch(req.body.type){
// 	    	   	    case "1" : 
// 	    	   	    	branch.push({ id : result[i].RegionID, name:result[i].RegionName});
// 	    	   		   break;
// 	    	   	    case "2" : 
// 	    	   	    	branch.push({ id : result[i].ZoneID, name:result[i].ZoneName});
// 	    	   	       break;
// 	    	   	    default :
// 	    	   	    	branch.push({ id : result[i].branchID, name: result[i].branchID + ' : ' +result[i].branchName});
// 	    	   		}
	    	    	
// 	    	    }
// 	    	    //req.session.db_Cond = branch;
// 	    	    res.send({	branch:JSON.stringify(branch) });
// 	    	});
// 	    }
// };
// function formatDate(date) {
// var d = new Date(date),
//   month = '' + (d.getMonth() + 1),
//   day = '' + d.getDate(),
//   year = d.getFullYear();

// if (month.length < 2) month = '0' + month;
// if (day.length < 2) day = '0' + day;

// return [year, month, day].join('-');
// }
// function newformate(data){
// 	var pad = "00"

// 		 return  '' + data.getFullYear() 
// 	     + '-' + String(pad +(data.getMonth()+1)).slice(-2)
// 	     + '-' + String(pad + data.getDate()).slice(-2)
// 	     + ' ' + String(pad +data.getHours()).slice(-2)
//          + ':' + String(pad +data.getMinutes()).slice(-2)
//          + ':' + String(pad +data.getSeconds()).slice(-2) ;
// //	 return  '' + String(pad + data.getDate()).slice(-2)
// //     + '/' + String(pad +(data.getMonth()+1)).slice(-2)
// //     + '/' +  data.getFullYear() 
// //     + ' ' + String(pad +data.getHours()).slice(-2)
// //     + ':' + String(pad +data.getMinutes()).slice(-2)
// //     + ':' + String(pad +data.getSeconds()).slice(-2) ;
// }