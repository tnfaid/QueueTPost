exports.index = function(req,res,next){
	res.render('dashboard_posid', { title: 'Dashboard'
		  ,user: req.session.user 
		  ,menu: req.session.userMenu
		  ,host : req.protocol + '://' + req.get('host')
	 });
	
};

exports.find = function(req,res,next){
	//console.log(req.body.startDate);
	var cond =  [];
	if (req.body.branchID !=''){
		cond.push({branchID : req.body.branchID});
	}
	if (req.body.startDate!='' && req.body.endDate!=''){
		//-----------//
		 var strDT = req.body.startDate;
		 var d1 = strDT.substring(0,2);
		 var m1 = strDT.substring(3,5);
		 var y1 = strDT.substring(6,10);
		 var arrT1 = req.body.startTime.split(':');
		 
		 var endDT = req.body.endDate;
		 var d2 = endDT.substring(0,2);
		 var m2= endDT.substring(3,5);
		 var y2 = endDT.substring(6,10);
		 var arrT2 = req.body.endTime.split(':');
		
		cond.push({ReceiptTime :   {
			$gte:  new Date( y1,  parseInt(m1)-1 , d1 , arrT1[0], arrT1[1]),
			$lt: new Date( y2,  parseInt(m2)-1 , d2, arrT2[0], arrT2[1])
		}});
		
	}
		
	if (req.body.posid !=''){
		cond.push({POSID : req.body.posid});
	}
	if (req.body.receipt !=''){
		cond.push({Receipt : {'$regex': req.body.receipt }});
	}

	try{
		
		req.db.collection('transaction').find({$and : cond}).toArray(function(err, result) {
			if (err) console.log( ' dashboard_posid.find has error ',err);
			
			for(var i=0;i < result.length;i++){
				result[i].ScanTime = newformate(result[i].ScanTime );
				result[i].AccessTime = newformate(result[i].AccessTime );
				result[i].ReceiptTime = newformate(result[i].ReceiptTime );
			}
			res.send({data:JSON.stringify(result) });
		});
	}catch(ex){
		console.log(ex);
	}
};

exports.getBranch = function(req,res){
	req.db.collection('branchList').find().toArray(function(err, result) {
			if (err) console.log( ' dashboard_posid.getBranch has error ',err);
			
			res.send({data:JSON.stringify(result) });
		});
};

exports.exportXLS = function( req, res, next){
	var fs = require('fs');
	/*Step save image on server*/
	try{
	 
		var data =req.body.table;  

		fs.writeFileSync(req.pathfile + "/report/" + req.body.filename + ".xls", data);
		res.json({url : "/report/" + req.body.filename + ".xls"});
	}catch(err){
		console.log(err);
	}
};

function newformate(data){
	var pad = "00"

	 return  '' + String(pad + data.getDate()).slice(-2)
     + '/' + String(pad +(data.getMonth()+1)).slice(-2)
     + '/' +  data.getFullYear()
     + ' ' + String(pad +data.getHours()).slice(-2)
     + ':' + String(pad +data.getMinutes()).slice(-2)
     + ':' + String(pad +data.getSeconds()).slice(-2) ;
}