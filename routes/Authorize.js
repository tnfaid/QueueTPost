/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var BaseController = require('./Base');
module.exports = BaseController.extend({
	 index: function(req,res,next){ 
		 if (req.session.userLogin){res.redirect('/');}
			res.render('authorize-login',{title:'Login', err:''});
	  },
	 login : function(req,res,callback){
       
       if ((!req.body.txtUser) || (!req.body.txtPWD)){
    	   console.log('show login');
           res.render('authorize-login',{title:'Login',err:''});
       }
       
       var password = pwdencryptest(req.body.txtPWD);
       console.log(' login with ',req.body.txtUser);
       var collection = req.db.collection('userList');
       collection.find({'userName':req.body.txtUser,'userPass.0.userPass':password}).toArray(function(err, records){
            if (records.length > 0){
            	//console.log(records);

                if (records[0].roleLevel != null){
                	console.log(records[0]);
                    req.session.userLogin = true;
                    req.session.user = records[0];
                    res.redirect('/');
                    
                    /*
                    collection = req.db.collection('branchList');
                    var query ;
                    switch (records[0].roleLevel){
                       case "1" : 
                            query = {BranchID:records[0].branch.branchID};
                            break;
                       case "2" :
                            query = {zoneID:records[0].zoneID};
                            break;   
                       case "3" :
                            query = {regionID:records[0].regionID};
                            break;   
                    }
                    collection.find({$query: query, $orderby : {'BranchID':1}}).toArray(function(err,record){
                    	console.log('-----',req.session.branch);
                        req.session.branch = record;
                        res.redirect('/');
                    });
                    */
                }else{
                    res.render('authorize-login',{title:'Login',err:'สิทธิ์การใช้งานไม่ถึง กรุณาติดต่อผู้ดูแลระบบ'});
                }
            }else{
                res.render('authorize-login',{title:'Login',err:'ไม่พบ Username หรือ Password ไม่ถูกต้อง'});
            }
       });
   },
   logout: function(req,res,next){
       req.session.destroy();
       res.render('authorize-login',{title:'Login',err:"ไม่สามารถติดต่อสาขาได้"});
   },
   connectBranchFail: function(req,res,next){
       req.session.destroy();
       res.render('authorize-login',{title:'Login',err:"ไม่สามารถติดต่อสาขาได้"});
   }
});

function pwdencryptest(password){
	var crypto = require('crypto'),
    algorithm = 'aes-128-cbc',
    key = 'Pas$w0rd';
	
	  var cipher = crypto.createCipher(algorithm,key)
	  var crypted = cipher.update(password,'utf8','hex')
	  crypted += cipher.final('hex');
//	  console.log ('11111111111111111111111', crypted)
	  return crypted;  
};
