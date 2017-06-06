function clsReport_Summary_Views(){
	
	this.Fn_Initial = function(){
		$(document).ready(function(){
			
			$('#btnSearch').click(function(){
				Fn_Search();
			});
			
			$('#btnExport').click(function(){
				Fn_ExportXLS();
			})
			
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
			
			String.prototype.toHHMMSS = function () {
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

			Number.prototype.format = function(n, x) {
				var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
				return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
			};
			
			Date.prototype.ddmmyyyy = function() {
				var dd = this.getDate();
				var mm = this.getMonth()+1; //January is 0!

				var yyyy = this.getFullYear();
				if(dd<10){
				    dd='0'+dd;
				} 
				if(mm<10){
				    mm='0'+mm;
				} 
				return dd+'/'+mm+'/'+yyyy;
			};

		});
		
	};
	
	function Fn_Search(){
		var	out=''; 
		var sumComplete=0;
		$.ajax({url: host + '/reports/summary/find', 
			type: 'POST',
			data :{ 
			   startDate : $('#txtStartDate').val(),
			   endDate : $('#txtEndDate').val()
			},
			success: function(result){
				console.log(result);
				$('#tbResult tbody').html('');
				$('#lbStart').text($('#txtStartDate').val());
				$('#lbEnd').text($('#txtEndDate').val());
				var d = result.data;
				var data='';
				
				for(var i = 0 ; i < d.length ; i++){
					console.log(d[i]);
					var dDate = new Date(d[i]._id);
					var sum = [0,0,0];
					data += '<tr class="bg-warning"><td colspan="4">วันที่ ' + dDate.ddmmyyyy(); + '</td></tr>'
					for(var j = 0 ; j < d[i].data.length ; j++){
						data += '<tr>'
						data += '<td align="center">' + d[i].data[j].counter + '</td>';
						data += '<td align="center">' + d[i].data[j].Queue.format() + '</td>';
						data += '<td align="center">' + String(d[i].data[j].QWait / 1000).toHHMMSS() + '</td>';
						data += '<td align="center">' + String(d[i].data[j].QService / 1000).toHHMMSS() + '</td>';
						data += '</tr>';
						sum[0] = sum[0] + d[i].data[j].Queue;
						sum[1] = sum[1] + d[i].data[j].QWait /1000;
						sum[2] = sum[2] + d[i].data[j].QService /1000;
 					}
 					data += '<tr class="bg-success"><td align="center">รวม</td>';
 					data += '<td align="center">' + sum[0].format() + '</td>';
 					data += '<td align="center" colspan="2"></td>';
 					data += '</tr>';
 					data += '<tr class="bg-success"><td align="center">เฉลี่ย</td>';
 					data += '<td align="center"></td>';
 					data += '<td align="center">' + String(sum[1] / sum[0]).toHHMMSS() + '</td>';
 					data += '<td align="center">' + String(sum[2] / sum[0]).toHHMMSS() + '</td>';
 					data += '</tr>';
				}
				//console.log(data);
				$('#tbResult tbody').append(data);
				$('#btnSearch').removeAttr('disabled');
			}
		});
		
	};
	
		
	function Fn_ExportXLS(){
		var	out=''; 
		var sumComplete=0;
		$.ajax({url: host + '/reports/excel_file', 
			type: 'POST',
			data :{
				filename : 'report_summary',
				table : $('#tbResult').parent().html()
			},
			success: function(result){
				console.log(result.url);
				window.open(result.url);
			}
		});
	};
}