
exports.index = function(req,res,next){
	res.render('Report_Summary_Month',{
		        host: req.protocol + '://' + req.get('host')
				,title : 'รายงานสรุปยอดผู้ใช้บริการรายที่ทำการต่อเดือน'
		        , user: req.session.userLogin
		        , menu: req.session.userMenu
		    });
};

exports.find = function(req,res,next){
	//console.log('calling function');
	if (req.body.year==''){
		res.json({data:''});
	}
		
	try{
		req.db.collection('br-Qtoday').aggregate([
		 	  	{
			        $group:{
			            _id : {month : {$month:'$date'},year : {$year:'$date'},branchID : '$branchID'},
			            queue : {$sum : {$size:'$data'}}
			        }
			    },
			    {
			    	$match:{'_id.year' : parseInt(req.body.year)}
			    },
			    {
                    $group: {
                        _id : '$_id.branchID',
                        queue : {$push : {month : '$_id.month',year : '$_id.year', total : '$queue'}}
                    }
                }                   		                                    		    
		 	    ],function(err, result) {
					if (err) console.log( 'Report_Summary_Month .find has error ',err);
		            //console.log(result);
					res.json({data: result});
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