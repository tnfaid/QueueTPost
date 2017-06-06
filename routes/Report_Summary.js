
exports.index = function(req,res,next){
	res.render('Report_Summary',{
		        host: req.protocol + '://' + req.get('host')
				,title : 'รายงานสรุปการรับบริการของแต่ละเคาน์เตอร์'
		        , user: req.session.userLogin
		        , menu: req.session.userMenu
		    });
};

exports.find = function(req,res,next){
	//console.log('calling function');
	var cond =  [];
	if (req.body.branchID !=''){
		//cond.push({branchID : req.body.branchID});
	}
	if (req.body.startDate!='' && req.body.endDate!=''){
		//-----------//
		var strDT = req.body.startDate;
		var d1 = strDT.substring(0,2);
		var m1 = strDT.substring(3,5);
		var y1 = strDT.substring(6,10);
		var endDT = req.body.endDate;
		var d2 = endDT.substring(0,2);
		var m2 = endDT.substring(3,5);
		var y2 = endDT.substring(6,10);

		cond.push({date :   {
			$gte:  new Date( y1,  parseInt(m1)-1 , d1,'00','00'),
			$lt: new Date( y2,  parseInt(m2)-1 , d2,'23','59')
		}});
		
	}
		

	try{
        console.log(cond);
		req.db.collection('br-Qtoday').aggregate([
					{ $match : cond[0]},
			        { $unwind : "$data" },
			        { $project : {
			                branchID : '$branchID',
			                date : '$date',
			                Qnumber : '$data.Qnumber', 
			                CounterID : '$data.counterID',
			                UserName : '$data.userName',
			                FullName : '$data.FullName',
			                Qwait : { $subtract : ['$data.QbeginTime','$data.QpressTime']},
			                Qservice : { $subtract : ['$data.QendTime','$data.QpressTime']},
			         }},
			         { $group : {
			                _id : {date : '$date',counterID : '$CounterID'},
			                Queue : {$sum : 1},
			                QWait : {$sum : '$Qwait'},
			                QService : {$sum : '$Qservice'}
			         }},
			         { $sort : {'_id.date' : -1 , '_id.counterID' : 1}},
			         { $group : { 
			                _id : '$_id.date',
			                data : { '$push' : {counter : '$_id.counterID' ,
			                                    Queue : '$Queue',
			                                    QWait : '$QWait',
			                                    QService : '$QService'}
			                       }
			         }}
			    ],function(err, result) {
					if (err) console.log( ' report_day.find has error ',err);
		             console.log(JSON.stringify(result));
					res.json({data:result});
			});
	}catch(ex){
		console.log(ex);
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