var BaseController = require('./Base');

/* GET users listing. */
module.exports = BaseController.extend({
    index: function(req,res,next){
        res.render('branch', { title: 'SatisfyApp'
						  ,menu: req.session.userMenu
						  ,user: req.session.user 
						  ,host : req.protocol + '://' + req.get('host')
						  });
    },
    all: function(req, res, next){
    	req.dbmbedq.collection('branchList').find().sort({"branchID" : -1}).toArray(function(err,result){
    		if(!err){
    			console.log('branch all ' , result);
    			res.json(result);
    		}else{
    			console.log('branch all error : ' , err);
    			res.json({'status' : 'error' , 'data' : err});
    		}
    	})
    },
    modifydata: function(req, res, next){
    	var action = req.params.action;
    	var id = req.params.id;
    	console.log(action , id , req.method , req.body);
    	switch(action){
    		case "view" : 
    			req.dbmbedq.collection('branchList').findOne({'branchID' : id},function(err,result){
    				if(err){ console.log('view error : ' + err);}
	    			res.json(JSON.stringify(result));
    			});
    		break;
    		case "edit" : 
                if(req.method === 'GET'){res.send('')}
                req.dbmbedq.collection('branchList').findOneAndUpdate({'branchID' : id},{'$set' : 
                    {'branchID' : req.body.branchID , 'branchName' : req.body.branchName, 'bAddr' : req.body.bAddr}},
                    function(err){
                        var result = { 'status' : 'success' , 'message' : ''}
                        if(err){ 
                            result.status = 'error';
                            result.message = err;
                            console.log('edit error : ' + err);
                        }
                        res.json(JSON.stringify(result));
                    })
    		break;
            case "delete" : 
                try{
                    req.dbmbedq.collection('branchList').remove({'branchID' : id},function(err){
                    var result = { 'status' : 'success' , 'message' : ''}
                    if(err){ 
                            result.status = 'error';
                            result.message = err;
                            console.log('edit error : ' + err);
                        }
                        res.json(JSON.stringify(result));
                    });
                }catch(er){
                    console.log(er);
                }
                
            break;
    		case "add" : 
                if(req.method === 'GET'){res.send('')}
                var doc = {
                    "branchID" : req.body.branchID,
                    "lastUpdate" : new Date(),
                    "bStatus" : "offline",
                    "date" : "",
                    "bAddr" : req.body.bAddr,
                    "lastOffline" : new Date(),
                    "branchName" : req.body.branchName,
                    "lastOnline" : null,
                    "getDataFlag" : 0
                }    
                req.dbmbedq.collection('branchList').find({'branchID' : doc.branchID}).toArray(function(err,data){
                    var result = { 'status' : 'success' , 'message' : ''}
                    if(data.length === 0){
                        req.db.collection('branchList').insert(doc,function(err){
                            if(err){ 
                                result.status = 'error';
                                result.message = err;
                                console.log('edit error : ' + err);
                            }
                            res.json(JSON.stringify(result));
                        });  
                    }else{
                        result.status = 'error';
                        result.message = 'duplicate branchid';
                        res.json(JSON.stringify(result));
                    }
                })
                    
    		break;
    	}
    }
});
