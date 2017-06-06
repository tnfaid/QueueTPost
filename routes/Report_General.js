var PDFDocument = require('pdfkit');

exports.index = function(req,res,next){
	res.render('Report_General', { title: 'General Report'
		  ,user: req.session.user 
		  ,host : req.protocol + '://' + req.get('host')
		  , menu: req.session.userMenu	
	 });
	
};

exports.getJob = function(req,res){
	   var arr =[];
		req.dbmbedq.collection('servItem').find().toArray(function(err,result){
			if(err) console.log('Report_General.getSG has error ',err);
			for (var i=0;i <result.length;i++){
				arr.push(result[i].jobName.th);
			}
			
			 res.send({data:JSON.stringify(arr)});
		});
};

exports.getUser = function(req,res){

		req.dbmbedq.collection('userList').find().toArray(function(err,result){
			if(err) console.log('Report_General.getUser has error ',err);

			 res.send({data:JSON.stringify(result)});
		});
};

exports.getRemote = function(req,res){

		req.dbmbedq.collection('remote').find().toArray(function(err,result){
			if(err) console.log('Report_General.getRemote has error ',err);

			 res.send({data:JSON.stringify(result)});
		});
};

exports.find = function(req,res,next){
	var coll = req.db.collection('br-Qtoday');
	 var dt1 = req.body.startDate.split("/");
	 var dt2 = req.body.endDate.split("/");
     var fdt1 = new Date(dt1[2] , parseInt(dt1[1])-1, dt1[0] );
     var fdt2 = new Date(dt2[2] , parseInt(dt2[1])-1, dt2[0] );
     var cond=[];
	 var sort={};
	 if (req.body.counterID !=''){
		 cond.push({'counterID' :req.body.counterID});
	 }
	 
	 if (req.body.job !=''){
		 	 cond.push({'jobName' :req.body.job});
	 }
	 
	if (req.body.userName !=''){
		 	 cond.push({'userName' :req.body.userName});
	 }
	 
	 if (req.body.status !=''){
		 	 cond.push({'Qstatus' :req.body.status});
	 }
	 
	 if (req.body.status !=''){
		 	 cond.push({'Qstatus' :req.body.status});
	 }
	 
	 var arrT1 = req.body.startTime.split(':');
	 var arrT2 = req.body.endTime.split(':');
	 var T1 =parseInt(arrT1[0]) + (parseInt(arrT1[1]) * 0.01);
	 var T2 =parseInt(arrT2[0]) + (parseInt(arrT2[1]) * 0.01);
	 cond.push({'sumTime'  : {"$gte":T1, "$lt": T2 }});
	 
	 if (req.body.sort !=''){
		 if (req.body.sort =='job'){
			sort = {yearMonthDay : 1 , jobName: 1};
		}else if (req.body.sort =='counter'){
			sort = {yearMonthDay : 1 , counterID: 1};
		}else if (req.body.sort =='employee'){
			sort = {yearMonthDay : 1 , userName: 1};
		}
		 
	 }
	
	 cond.push({'Qnumber'  : {$ne : ''}});
     console.log(cond);
	  try{
     coll.aggregate([
					{ $match: {'date'  : {"$gte": fdt1 , "$lt": fdt2}}},
					{ $unwind: '$data' },
					{ $project:{
							hour :  {$hour  : { $add : ['$data.QpressTime',25200000 ] }},
							minute : {$minute  : { $add : ['$data.QpressTime' ,25200000 ]}},
							sumTime : {$add : [{$hour  : { $add : ['$data.QpressTime',25200000 ] }} ,  { $multiply :[{$minute  : { $add : ['$data.QpressTime' ,25200000 ]}},0.01]} ]},
							yearMonthDay: { $dateToString: { format: "%Y-%m-%d", date: "$data.QpressTime" } },
							QpressTime :  '$data.QpressTime' ,
							Qnumber:  '$data.Qnumber' ,
							jobName :  '$data.jobName' ,
							counterID :  '$data.counterID' ,
							QbeginTime : '$data.QbeginTime' ,
							QendTime : '$data.QendTime' ,
							Qstatus :'$data.Qstatus' ,
							userName : '$data.userName' ,
					}},
					{ $match: { $and : cond}},
					{$sort :sort}
         ],function(err, result) {
			 
		   //console.log(err,result);
			  //---start format time---
			var arrOut=[];
			  for(var i =0 ;i<result.length;i++){
				//console.log(result[i]);

					result[i].waitTime= 0;
					result[i].serviceTime= 0;
					if (result[i].QbeginTime!='' && (result[i].Qstatus!='standby'  )){
						//Change type string to dateime
						//result[i].QbeginTime = new Date(result[i].QbeginTime);
						//result[i].QpressTime = new Date(result[i].QpressTime);
						//result[i].QendTime = new Date(result[i].QendTime);
						
						var waittime = Math.floor((result[i].QbeginTime - result[i].QpressTime) / (1000));
						var servicetime = Math.floor((result[i].QendTime - result[i].QbeginTime) / (1000));
						result[i].waitTime= waittime;
						
						if (result[i].Qstatus!='service' && result[i].Qstatus!='hold' && result[i].Qstatus!='transfer' ){
							result[i].serviceTime= servicetime;
						}
						
						
						result[i].QbeginTime = newformate(result[i].QbeginTime);
			 
					}else{
						result[i].QbeginTime='';
					}
					
					if ( result[i].Qstatus!='standby' && result[i].Qstatus!='service' && result[i].Qstatus!='noservice'&& result[i].Qstatus!='hold' && result[i].Qstatus!='transfer' ){
						//result[i].QendTime = new Date(result[i].QendTime);
						result[i].QendTime = newformate(result[i].QendTime);
					}else{
						result[i].QendTime ='';
					}

					var pressTime =result[i].QpressTime;
					result[i].QpressTime = newformate(pressTime);
					result[i].QpressDate = formatDate(pressTime);

					arrOut.push(result[i]);
				  
			  }
			  res.send({data:JSON.stringify(arrOut)});
		  //----end format time---
	   });
	  }catch(e){
		  console.log(e);
	  }
};

exports.findOld = function(req,res,next){
	var coll = req.db.collection('br-Qtoday');
	 var dt1 = req.body.startDate.split("/");
	 var dt2 = req.body.endDate.split("/");
     var fdt1 = new Date(dt1[2] , parseInt(dt1[1])-1, dt1[0] );
     var fdt2 = new Date(dt2[2] , parseInt(dt2[1])-1, dt2[0] );
     var cond=[];
	 cond.push({'date'  : {"$gte": fdt1 , "$lt": fdt2}});
	
     console.log(cond);
	  
     coll.find({$and : cond }).sort({'date' : 1}).toArray(function(err,result){
    	  if (err) console.log( ' Report_General has error ',err);
    	  //console.log(result);
    	  var arrOut=[];
    	  for(var i =0 ;i<result.length;i++){
    		//console.log(result[i]);
            var resultA = result[i].data;
            
            for(var j =0 ;j<resultA.length;j++){
            	resultA[j].waitTime= 0;
            	resultA[j].serviceTime= 0;
	    		if (resultA[j].QbeginTime!='' && (resultA[j].Qstatus!='standby'  )){
	    			//Change type string to dateime
	    			resultA[j].QbeginTime = new Date(resultA[j].QbeginTime);
	    			resultA[j].QpressTime = new Date(resultA[j].QpressTime);
	    			resultA[j].QendTime = new Date(resultA[j].QendTime);
	    			
	    			var waittime = Math.floor((resultA[j].QbeginTime - resultA[j].QpressTime) / (1000));
	    			var servicetime = Math.floor((resultA[j].QendTime - resultA[j].QbeginTime) / (1000));
	    			resultA[j].waitTime= waittime;
	    			
	    			if (resultA[j].Qstatus!='service' && resultA[j].Qstatus!='hold' && resultA[j].Qstatus!='transfer' ){
	    				resultA[j].serviceTime= servicetime;
	    			}
	    			
	    			
	    			resultA[j].QbeginTime = newformate(resultA[j].QbeginTime);
	     
	    		}else{
	    			resultA[j].QbeginTime='';
	    		}
	  	    	
	  	        if ( resultA[j].Qstatus!='standby' && resultA[j].Qstatus!='service' && resultA[j].Qstatus!='noservice'&& resultA[j].Qstatus!='hold' && resultA[j].Qstatus!='transfer' ){
	  	        	resultA[j].QendTime = new Date(resultA[j].QendTime);
	  	        	resultA[j].QendTime = newformate(resultA[j].QendTime);
	    		}else{
	    			resultA[j].QendTime ='';
	    		}
	  	       
				var pressTime = new Date(resultA[j].QpressTime);
	  	        resultA[j].QpressTime = newformate(pressTime);
				resultA[j].QpressDate = formatDate(pressTime);
	  	        //console.log(resultA[j].Qnumber);
	  	        arrOut.push(resultA[j]);
	    	  }
    	  }
    	  res.send({data:JSON.stringify(arrOut)});
      });
};


exports.ExportPDF = function(req,res,next){
	var coll = req.db.collection('br-Qtoday');
	  var dt1 = req.body.startDate.split("/");
	  var dt2 = req.body.endDate.split("/");
      var fdt1 = new Date(dt1[2] + '-' + dt1[1] + '-' + dt1[0] + " 00:00:00");
      var fdt2 = new Date(dt2[2] + '-' + dt2[1] + '-' + dt2[0] + " 23:59:59");
      var cond = {'date'  : {"$gte": fdt1 , "$lt": fdt2}};
      coll.find(cond).toArray(function(err,result){
    	  if (err) console.log( ' Report_General has error ',err);
    	  console.log(result);
    	  var arrOut=[];
    	  for(var i =0 ;i<result.length;i++){

    		  var resultA = result[i].data;
              
              for(var j =0 ;j<resultA.length;j++){
            	  resultA[j].waitTime= 0;
            	  resultA[j].serviceTime= 0;
	    		if (resultA[j].QbeginTime!='' && (resultA[j].Qstatus!='standby'  )){
	    			
	    			resultA[j].QbeginTime = new Date(resultA[j].QbeginTime);
	    			resultA[j].QpressTime = new Date(resultA[j].QpressTime);
	    			resultA[j].QendTime = new Date(resultA[j].QendTime);
	    			
	    			var waittime = Math.floor((resultA[j].QbeginTime - resultA[j].QpressTime) / (1000));
	    			var servicetime = Math.floor((resultA[j].QendTime - resultA[j].QbeginTime) / (1000));
	    			resultA[j].waitTime= waittime;
	    			
	    			if (resultA[j].Qstatus!='service' && resultA[j].Qstatus!='hold' && resultA[j].Qstatus!='transfer' ){
	    				resultA[j].serviceTime= servicetime;
	    			}
	    			
	    		
	    			resultA[j].QbeginTime = newformate(resultA[j].QbeginTime);
	     
	    		}else{
	    			resultA[j].QbeginTime='';
	    		}
	  	    	
	  	        if ( resultA[j].Qstatus!='standby' && resultA[j].Qstatus!='service' && resultA[j].Qstatus!='noservice'&& resultA[j].Qstatus!='hold' && resultA[j].Qstatus!='transfer'  ){
	  	        	resultA[j].QendTime = new Date(resultA[j].QendTime);
	  	        	resultA[j].QendTime = newformate(resultA[j].QendTime);
	    		}else{
	    			resultA[j].QendTime ='';
	    		}
	  	        resultA[j].QpressTime = new Date(resultA[j].QpressTime);
	  	        resultA[j].QpressTime = newformate(resultA[j].QpressTime);
	  	      	arrOut.push(resultA[j]);
	    	  }
    	  }
    	  exportPDFZ(req,res,arrOut);
      });
};

function exportPDFZ(req, res,data){
	console.log('calling exports');
	var fs = require('fs');
	/*
	try{
	
	var newdata =req.body.img.substring(1,req.body.img.length-1);  

	var decodedImage =new Buffer(newdata, 'base64');

	fs.writeFileSync(req.pathWrite + "/report/rpt_general.jpeg", decodedImage);
	
	}catch(err){
		console.log(err);
		
	}
	*/
	
	var doc = new PDFDocument(  { size: 'A4', layout : 'landscape' });

	doc.pipe( fs.createWriteStream(req.pathWrite + '/report/rpt_general.pdf'));
	doc.font(req.pathWrite + '/fonts/angsau.ttf',18);
	doc.y = 50;
	doc.text('General Report', { align: 'center' });
	var now = new Date();
	var yy=75;
	doc.font(req.pathWrite + '/fonts/angsau.ttf',14);
	doc.text("วันและเวลาที่พิมพ์ " + formatLocalDate(), { align: 'right' });
	doc.text("วันที่ " + req.body.startDate + " ถึง " +  req.body.endDate,50,yy);

	//console.log(req.body.cond4);
	
	console.log('start write data');
	//console.log(req.body.data); 
    doc.text('หมายเลขคิว',50,yy+25);
    doc.rect(45, yy+25, 50, 20).stroke();
    doc.text('ธุรกรรม',100,yy+25);
    doc.rect(95, yy+25, 120, 20).stroke();
    doc.text('ผู้ให้บริการ',220,yy+25);
    doc.rect(215, yy+25, 50, 20).stroke();
    doc.text('เคาน์เตอร์',270,yy+25);
    doc.rect(265, yy+25, 50, 20).stroke();
    doc.text('เวลากดคิว',320,yy+25);
    doc.rect(315, yy+25, 100, 20).stroke();
    doc.text('เวลาเริ่มคิว',420,yy+25);
    doc.rect(415, yy+25, 100, 20).stroke();
    doc.text('เวลาสิ้นสุดคิว',520,yy+25);
    doc.rect(515, yy+25, 100, 20).stroke();
    doc.text('เวลารอ',620,yy+25);
    doc.rect(615, yy+25, 50, 20).stroke();
    doc.text('เวลาให้บริการ',670,yy+25);
    doc.rect(665, yy+25, 50, 20).stroke();
    doc.text('สถานะ',720,yy+25);
    doc.rect(715, yy+25, 50, 20).stroke();
    /*body data*/
     console.log('head write');
   // var item = req.body.data;
    //var dataBody = JSON.parse(item);
    var dataBody =data;
    console.log( dataBody.length);

    var y = 120;
    var line =0;
    var varMod=18;
    var sumComplete =0;
    try{
    for(var i=0;i<dataBody.length;i++){
    	console.log(dataBody[i]);
    	
    	if (i==0){
    		y = 120;
    	
    	}else{
    		if ((line % varMod) ==0){
    			//console.log(i,i % 18);
    			y=50;
    			line=0;
    			varMod=23;
    			doc.addPage({
    			    size: 'A4',
    			    layout: 'landscape'
    			});
    		}
    	}
    	
        doc.text(dataBody[i].Qnumber,50,(y+(line*20)));
        doc.rect(45, (y+(line*20)), 50, 20).stroke();
        doc.text(dataBody[i].jobName[0] ,100,(y+(line*20)));
        doc.rect(95, (y+(line*20)), 120, 20).stroke();
        if (dataBody[i].userName.hasOwnProperty('FullName')){
        	  doc.text(dataBody[i].userName.FullName ,220,(y+(line*20)));
		}else{
			  doc.text('' ,220,(y+(line*20)));
		}
        doc.rect(215, (y+(line*20)), 50, 20).stroke();
        doc.text(dataBody[i].rmtID ,270,(y+(line*20)));
        doc.rect(265, (y+(line*20)), 50, 20).stroke();
        doc.text(dataBody[i].QpressTime,320,(y+(line*20)));
        doc.rect(315, (y+(line*20)), 100, 20).stroke();
        doc.text(dataBody[i].QbeginTime,420,(y+(line*20)));
        doc.rect(415, (y+(line*20)), 100, 20).stroke();
        doc.text(dataBody[i].QendTime,520,(y+(line*20)));
        doc.rect(515, (y+(line*20)), 100, 20).stroke();
        doc.text(dataBody[i].waitTime.toHHMMSS(),620,(y+(line*20)));
        doc.rect(615, (y+(line*20)), 50, 20).stroke();
        doc.text(dataBody[i].serviceTime.toHHMMSS(),670,(y+(line*20)));
        doc.rect(665, (y+(line*20)), 50, 20).stroke();
        doc.text(dataBody[i].Qstatus,720,(y+(line*20)));
        doc.rect(715, (y+(line*20)), 50, 20).stroke();
        line++;
        if (dataBody[i].Qstatus=='completed'){
            sumComplete++;
        }

       }
       doc.text('รวมคิวทั้งหมด ' +  dataBody.length + ' คิว , คิว Complete ' +  sumComplete + ' คิว',50,(y+(line*20)));
       doc.rect(45, (y+(line*20)), 720, 20).stroke();
    }catch(err){
    	 console.log('-err-',err);
    }
    console.log('--------------end');
    
    doc.end();
	res.send( '/report/rpt_general.pdf');
    
};

function newformate(data){
	var pad = "00"

	 return  '' +  String(pad +data.getHours()).slice(-2)
     + ':' + String(pad +data.getMinutes()).slice(-2)
     + ':' + String(pad +data.getSeconds()).slice(-2) ;
}

function formatDate(data){
	var pad = "00"

	 return  '' + String(pad + data.getDate()).slice(-2)
     + '/' + String(pad +(data.getMonth()+1)).slice(-2)
     + '/' +  data.getFullYear();
}

function formatLocalDate() {
    var now = new Date(),
        tzo = -now.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.abs(Math.floor(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return  '' + pad(now.getDate())
        + '/' + pad(now.getMonth()+1)
        + '/' +  now.getFullYear() 
        + ' ' + pad(now.getHours())
        + ':' + pad(now.getMinutes()) 
        + ':' + pad(now.getSeconds()) ;
}

Number.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}