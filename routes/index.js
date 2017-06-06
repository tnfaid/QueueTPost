var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	
    console.log('index show');
	req.session.alertmsg = '';
	res.render('index', { title: 'KTB Report'
						  ,menu: req.session.userMenu
						  ,user: req.session.user 
						  ,host : req.protocol + '://' + req.get('host')
						  });
});

module.exports = router;
