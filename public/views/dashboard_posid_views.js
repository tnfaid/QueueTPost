function clsDashboard_Posid_Views(){
	
	this.Fn_Initial =function(){
		
		$(document).ready(function(){
			
			Fn_GetBranch();
			
			$('#btnSearch').click(function(){
				 $('#btnSearch').attr({'disabled':'disabled'});
				Fn_Search();
				
			});
			
			$('#btnXLS').click(function(){
			   Fn_ExportXLS();
			});
			
			$('#btnPDF').click(function(){
				Fn_ExportPDF();
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
			$('#txtEndTime').val('00:00');
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
	
	function Fn_GetBranch(){
		var	out=''; 
		var sumComplete=0;
		$('#ddlBranch').append("<option value=''>All</option");
		$.ajax({url: host + '/dashboard/getBranch', 
			type: 'POST',
			data :'',
			success: function(result){
			    var d =  $.parseJSON(result.data);
				for(var i=0;i<d.length;i++){
					$('#ddlBranch').append("<option value='" + d[i].branchID + "'>" + d[i] .branchName+"</option");
				}
			}
		});
		
	};
	
	function Fn_Search(){
		var	out=''; 
		var sumComplete=0;
		$.ajax({url: host + '/dashboard/find', 
			type: 'POST',
			data :{ branchID : $('#ddlBranch option:selected').val(),
			   startDate : $('#txtStartDate').val(),
			   endDate : $('#txtEndDate').val(),
			   startTime : $('#txtStartTime').val(),
			   endTime : $('#txtEndTime').val(),
			   posid : $('#txtPosID').val(),
			   receipt : $('#txtReceipt').val()
			},
			success: function(result){
				$('#divResult > table > tbody').html('');
			    var d =  $.parseJSON(result.data);
				var data='';
				for(var i=0;i<d.length;i++){
					data +="<tr>";
					data +="<td  style='text-align: center;'>" + d[i].branchShort + "</td>";
					data +="<td  style='text-align: center;'>" + d[i].POSID + "</td>";
					data +="<td style='text-align: center;'>" + d[i].Receipt + "</td>";
					data +="<td style='text-align: center;'>" + d[i].PointBox + "</td>";
					data +="<td style='text-align: center;'>" + d[i].Other + "</td>";
					data +="<td style='text-align: center;'>" + d[i].ReceiptTime + "</td>";
					data +="<td style='text-align: center;'>" + d[i].AccessTime + "</td>";

					data +="</tr>";
				}
				//console.log(data);
				$('#divResult > table > tbody').append(data);
				$('#btnSearch').removeAttr('disabled');
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
	
	function Fn_ExportXLS(){
		var	out=''; 
		var sumComplete=0;
		$.ajax({url: host + '/dashboard/exportxls', 
			type: 'POST',
			data :{
				filename : 'dashboard',
				table : $('#divResult').html()
			},
			success: function(result){
				console.log(result.url);
				window.open(result.url);

			}
		});
		
	};
}