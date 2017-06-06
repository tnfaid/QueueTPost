/**
 * Routes Report
 */

var express = require('express');
var router = express.Router();

//-----------------------------Module------------------------------------
var rGeneral = require('../routes/Report_General');
var rSummary = require('../routes/Report_Summary');
var rSummaryByMonth = require('../routes/Report_Summary_Month');
//---------------------------Report Index--------------------------------
router.all('/',function(req,res,next){
	res.redirect('/');
})

//---------------------------- general ---------------------------------
router.all('/general/getremote',rGeneral.getRemote);
router.all('/general/getuser',rGeneral.getUser);
router.all('/general/getjob',rGeneral.getJob);
router.all('/general/find',rGeneral.find);
router.get('/general',rGeneral.index);
router.all('/year/find',rGeneral.find);


//---------------------------- summary ---------------------------------

router.get('/summary',rSummary.index);
router.all('/summary/find',rSummary.find);

//---------------------------- summary ---------------------------------

router.get('/summary_month',rSummaryByMonth.index);
router.all('/summary_month/find',rSummaryByMonth.find);

//-------------------------------Export Excel----------------------------

router.post('/excel_file',function( req, res, next){
	var fs = require('fs');
	/*Step save image on server*/
	try{
	 	var arrpath = __dirname.split('\\'); 
		var path = '';
		for(var i=0 ;i<arrpath.length-1;i++){
			path += arrpath[i] + "\\";
		}
		var pathWrite = path + "public";
		var data =req.body.table;  

		fs.writeFileSync(pathWrite + "/report/" + req.body.filename + ".xls", data);
		res.json({url : "/report/" + req.body.filename + ".xls"});
	}catch(err){
		console.log(err);
	}
});

//-----------------------------------------------------------------------
module.exports = router;