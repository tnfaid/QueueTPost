function clsReport_General_View(){
	
	this.Fn_Initial =function(){
		
		$(document).ready(function(){
			
			Fn_GetJob();
			Fn_GetUser();
			Fn_GetRemote();
			Fn_LoadStatus();
			
			$('#btnReport').click(function(){
				 $('#btnReport').attr({'disabled':'disabled'});
				Fn_Search();
				
			});
			
			
			
			$('#btnExport').click(function(){
				Fn_ExportXLS();
				
			});
			
			$('#txtStartDate').daterangepicker({
            	"locale" : {"format" : "DD/MM/YYYY"},
				"singleDatePicker": true,
				"startDate": moment(),
				"endDate": moment()
				}, function(start, end, label) {
				console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
				});
			
			$('#txtEndDate').daterangepicker({
            	"locale" : {"format" : "DD/MM/YYYY"},
				"singleDatePicker": true,
				"startDate": moment(),
				"endDate": moment()
				}, function(start, end, label) {
				console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
				});
				
			$('#txtStartTime').datetimepicker({
            	  "format": 'HH:mm'
			});
			
			$('#txtEndTime').datetimepicker({
            	  "format": 'HH:mm'
			});
			$('#txtStartTime').val('00:00');
			$('#txtEndTime').val('23:59');
		});
		
		Number.prototype.toHHMMSS = function(){
			if (this){
				var sec_num = parseInt(this, 10); // don't forget the second param
				var hours   = Math.floor(sec_num / 3600);
				var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
				var seconds = sec_num - (hours * 3600) - (minutes * 60);

				if (hours   < 10) {hours   = "0"+hours;}
				if (minutes < 10) {minutes = "0"+minutes;}
				if (seconds < 10) {seconds = "0"+seconds;}
				var time    = hours+':'+minutes+':'+seconds;
				return time;
			}else{
				return "00:00:00";
			}
		}
	};
	
	function Fn_ExportXLS(){
		var	out=''; 
		var sumComplete=0;
		$.ajax({url: host + '/reports/excel_file', 
			type: 'POST',
			data :{
				filename : 'report_general',
				table : $('#divResult').html()
			},
			success: function(result){
				console.log(result.url);
				window.open(result.url);

			}
		});
		
	};
	
	function Fn_LoadStatus(){
		$('#ddlStatus').append("<option value=''>ทั้งหมด</option");
		$('#ddlStatus').append("<option value='completed'>completed</option");
		$('#ddlStatus').append("<option value='noservice'>noservice</option");
		$('#ddlStatus').append("<option value='standby'>standby</option");
		$('#ddlStatus').append("<option value='service'>service</option");
		$('#ddlStatus').append("<option value='hold'>hold</option");
		$('#ddlStatus').append("<option value='transfer'>transfer</option");
	};
	
	function Fn_GetJob(){
		$('#ddlJob').append("<option value=''>ทั้งหมด</option");
		$.ajax({url: host + '/reports/general/getjob', 
			type: 'POST',
			data :'',
			success: function(result){
				var d=$.parseJSON(result.data);
				for(var i=0;i<d.length;i++){
					$('#ddlJob').append("<option value='" + d[i] + "'>" + d[i] +"</option");
				}
			}
		});	
	};
	
	function Fn_GetUser(){
		$('#ddlEmployee').append("<option value=''>ทั้งหมด</option");
		$.ajax({url: host + '/reports//general/getuser', 
			type: 'POST',
			data :'',
			success: function(result){
				var d=$.parseJSON(result.data);
				for(var i=0;i<d.length;i++){
					$('#ddlEmployee').append("<option value='" + d[i].userName + "'>" + d[i].FullName +"</option");
				}
			}
		});	
	};
	
	function Fn_GetRemote(){
		$('#ddlCounter').append("<option value=''>ทั้งหมด</option");
		$.ajax({url: host + '/reports//general/getremote', 
			type: 'POST',
			data :'',
			success: function(result){
				var d=$.parseJSON(result.data);
				for(var i=0;i<d.length;i++){
					$('#ddlCounter').append("<option value='" + d[i].counterID + "'>" + d[i].counterID +"</option");
				}
			}
		});	
	};
	
	function Fn_Search(){
		var	out=''; 
		var sumComplete=0;
		var job = $('input[name=rdoJob]:checked').val();
		var indexG=0;
		switch(job){
			case "job" : indexG=0;
			    break; 
			case "counter" : indexG=1;
			    break; 
			case "employee" : indexG=2;
			    break; 
		}
		
		$.ajax({url: host + '/reports/general/find', 
			type: 'POST',
			data :{
				startDate : $('#txtStartDate').val(),
				endDate :$('#txtEndDate').val(),
			    startTime : $('#txtStartTime').val(),
			    endTime : $('#txtEndTime').val(),
				counterID : $('#ddlCounter option:selected').val(),
				userName : $('#ddlEmployee option:selected').val(),
				job : $('#ddlJob option:selected').val(),
				status : $('#ddlStatus option:selected').val(),
				sort : job
			},
			success: function(result){
				var d=$.parseJSON(result.data);
				console.log(d);
				var  dateStart ='';
				var choise ='';
				var iD=0 ;
				var iDwait=0;
				var iDser =0;
				var iC=0;
				var iCwait=0;
				var iCser =0;
				var iA=0;
				for(var i=0; i < d.length ; i++){
					if (dateStart==''  || dateStart != d[i].QpressDate){
						out +="<tr  style='background-color:#9966FF'>";
						out += "<td colspan='9'><b>วันที่  " + d[i].QpressDate +  "</b></td>";
						out += "</tr>";
						//dateStart = d[i].QpressDate ;
					}
					switch (indexG ){
						case 0:
							if(choise =='' || choise != d[i].jobName  || dateStart != d[i].QpressDate){
								out +="<tr  style='background-color:#9999FF'>";
								out += "<td colspan='9'><b>" + d[i].jobName +  "</b></td>";
								out += "</tr>";
								choise = d[i].jobName ;
							}
							break;
						case 1: 
							if(choise =='' || choise != d[i].counterID  || dateStart != d[i].QpressDate){
								out +="<tr  style='background-color:#9999FF'>";
								out += "<td colspan='9'><b>Counter No." + d[i].counterID +  "</b></td>";
								out += "</tr>";
								choise = d[i].counterID ;
							}
							break;
						case 2:
							if(choise =='' || choise != d[i].userName  || dateStart != d[i].QpressDate){
								out +="<tr  style='background-color:#9999FF'>";
								out += "<td colspan='9'><b>Name " + d[i].userName +  "</b></td>";
								out += "</tr>";
								choise = d[i].userName ;
							}
							break;
					}
					if (dateStart==''  || dateStart != d[i].QpressDate){
						dateStart = d[i].QpressDate ;
					}
					//--body data-//
					out +="<tr>";
					out += "<td>" + d[i].Qnumber +  "</td>";
					out += "<td>" + d[i].jobName +  "</td>";
					out += "<td>" + d[i].counterID +  "</td>";
					out += "<td align='center'>" + d[i].QpressTime +  "</td>";
					out += "<td align='center'>" + d[i].QbeginTime +  "</td>";
					out += "<td align='center'>" + d[i].QendTime +  "</td>";
					out += "<td align='center'>" + d[i].serviceTime.toHHMMSS() +  "</td>";
					out += "<td align='center'>" + d[i].waitTime.toHHMMSS() +  "</td>";
					out += "<td align='center'>" + d[i].Qstatus +  "</td>";
					out += "</tr>";
					
					iDwait += d[i].waitTime;
					iDser += d[i].serviceTime;
					iD++;
					iA++;
					
					iCwait += d[i].waitTime;
					iCser += d[i].serviceTime;
					iC++;
					//--start group---//
					if ((i+1) <  d.length  ){
						switch (indexG ){
							case 0:
								if( choise != d[i+1].jobName || dateStart != d[i +1].QpressDate ){
									out +="<tr  style='background-color:#9999FF'>";
									out += "<td ><b>รวม</b></td>";
									out += "<td >" + iC + "</td>";
									out += "<td >คิว</td>";
									out += "<td ></td>";
									out += "<td ></td>";
									out += "<td align='center'>เวลาเฉลี่ย</td>";
									out += "<td  align='center'>" + (iCser / iC).toHHMMSS() + "</td>";
									out += "<td align='center'>"+ (iCwait /iC).toHHMMSS() + "</td>";
									out += "<td ></td>";
									out += "</tr>";
									
									iC=0;
									iCwait=0;
									iCser=0;
								}
								break;
							case 1: 
								if( choise != d[i+1].counterID || dateStart != d[i +1].QpressDate){
									out +="<tr  style='background-color:#9999FF'>";
									out += "<td ><b>รวม</b></td>";
									out += "<td >" + iC + "</td>";
									out += "<td >คิว</td>";
									out += "<td ></td>";
									out += "<td ></td>";
									out += "<td align='center'>เวลาเฉลี่ย</td>";
									out += "<td  align='center'>" + (iCser / iC).toHHMMSS() + "</td>";
									out += "<td align='center'>"+ (iCwait /iC).toHHMMSS() + "</td>";
									out += "<td ></td>";
									out += "</tr>";
									
									iC=0;
									iCwait=0;
									iCser=0;
								}
								break;
							case 2:
								if(choise != d[i+1].userName || dateStart != d[i +1].QpressDate){
									out +="<tr  style='background-color:#9999FF'>";
									out += "<td ><b>รวม</b></td>";
									out += "<td >" + iC + "</td>";
									out += "<td >คิว</td>";
									out += "<td ></td>";
									out += "<td ></td>";
									out += "<td align='center'>เวลาเฉลี่ย</td>";
									out += "<td  align='center'>" + (iCser / iC).toHHMMSS() + "</td>";
									out += "<td align='center'>"+ (iCwait /iC).toHHMMSS() + "</td>";
									out += "<td ></td>";
									out += "</tr>";
									
									iC=0;
									iCwait=0;
									iCser=0;
								}
								break;
						}
					}else{
							out +="<tr  style='background-color:#9999FF'>";
							out += "<td ><b>รวม</b></td>";
							out += "<td >" + iC + "</td>";
							out += "<td >คิว</td>";
							out += "<td ></td>";
							out += "<td ></td>";
							out += "<td align='center'>เวลาเฉลี่ย</td>";
							out += "<td  align='center'>" + (iCser / iC).toHHMMSS() + "</td>";
							out += "<td align='center'>"+ (iCwait /iC).toHHMMSS() + "</td>";
							out += "<td ></td>";
							out += "</tr>";
							
							iC=0;
							iCwait=0;
							iCser=0;
					}
					//----last date---//
					if ((i+1) <  d.length  ){
						if (dateStart != d[i +1].QpressDate){
							out +="<tr  style='background-color:#9966FF'>";
							out += "<td ><b>รวมต่อวัน " + dateStart + "</b></td>";
							out += "<td >" + iD + "</td>";
							out += "<td >คิว</td>";
							out += "<td ></td>";
							out += "<td ></td>";
							out += "<td align='center'>เวลาเฉลี่ย</td>";
							out += "<td  align='center'>" + (iDser / iD).toHHMMSS() + "</td>";
							out += "<td align='center'>"+ (iDwait /iD).toHHMMSS() + "</td>";
							out += "<td ></td>";
							out += "</tr>";
							
							iD=0;
							iDwait=0;
							iDser=0;
						}
					}else if ((i+1) == d.length){
							out +="<tr  style='background-color:#9966FF'>";
							out += "<td ><b>รวมต่อวัน " + dateStart + "</b></td>";
							out += "<td >" + iD + "</td>";
							out += "<td >คิว</td>";
							out += "<td ></td>";
							out += "<td ></td>";
							out += "<td align='center'>เวลาเฉลี่ย</td>";
							out += "<td align='center'>" + (iDser / iD).toHHMMSS() + "</td>";
							out += "<td align='center'>"+ (iDwait /iD).toHHMMSS() + "</td>";
							out += "<td ></td>";
							out += "</tr>";
							
							iD=0;
					}
				}
				$('#divResult > table > tbody').html(out);
				$('#btnReport').removeAttr('disabled');
			}
		});
		
	};
	
	
	function Fn_ExportPDF(){
		var	out=''; 
		var sumComplete=0;
		$.ajax({url: host + '/reports/generalreport/exportpdf', 
			type: 'POST',
			data :{
				startDate : $('#txtStartDate').val()
				,endDate :$('#txtEndDate').val()
			},
			success: function(result){
				console.log(result);
				window.open(result);

			}
		});
		
	};
}