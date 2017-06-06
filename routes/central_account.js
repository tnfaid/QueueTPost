exports.index = function (req,res,next){
	res.render('central-account',{title: 'User Management'
		,user: req.session.user
		,menu: req.session.userMenu
		,host: req.protocol + '://' + req.get('host')
	});
};

exports.search = function (req,res){
	  req.db.collection('userList').find({ $or : [{"userName" : {$regex : '(?i)' + req.body.data }}, {"FullName" : {$regex : '(?i)' + req.body.data}}]}).sort({"_id": 1 }).toArray(function(err,result){
	  		if (err) console.log(' central-account.search has error ',err);
	  		// console.log('req==',req.body);
	  		// console.log('R==',result);
	  		res.send(result);
	  		
	  });
};	  
exports.resetpass = function ( req,res){
	 	var ObjectId = require('mongoskin').ObjectId
        var dateEx = new Date();
    	// var uname = '';
    	console.log('dateEX=',dateEx);
		dateEx.setDate(dateEx.getDate() + 90);
		console.log('dateEX+90=',dateEx);
   		 req.db.collection('userList').findOne({"_id" : ObjectId(req.body.id)},function(err, rec){
        	  			console.log('id==', ObjectId(req.body.id));
        	  			console.log('rec==',rec)
        			if (!err){
        				console.log('rec=',rec.userPass[0]);
        				// arr.unshift
        				rec.userPass.unshift ({ 'userPass' : pwdencryptest(req.body.newpwd),
        										'dateCreate' : new Date(),
        										'dateExpiry' : dateEx })
        				rec.userPass.pop();				
			        	// rec.userPass[0].userPass = pwdencryptest(req.body.newpwd)
            //         	rec.userPass[0].dateCreate = new Date()
            //         	rec.userPass[0].dateExpiry = dateEx
                    	console.log(rec.userPass[0].userPass)
						req.db.collection('userList').findOneAndUpdate({
       			 			"_id" : ObjectId(req.body.id)                   
    					},{ 
	       			  	"$set" : {
	         		 		 "userPass" : rec.userPass,
	         		 		 "worngLogin" : 0,
	          		  	     "firstLogon" :  Boolean(1),                       
        					}
    					})
						res.send('OK');
        			}else{
        				console.log(' central-account.resetpass findone has error ',err );
        				res.send('error');
        			}
			});
};
exports.deleteuser = function(req,res){
	var ObjectId = require('mongoskin').ObjectId
	req.db.collection('userList').deleteOne({
		 "_id" : ObjectId(req.body.id)	        		    					 
	},function(err,rec){
		 	if(!err){
		 		res.send('delete success');
		 	};		
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
