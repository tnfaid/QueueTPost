function clsReport_Summary_Month_Views(){

	var allBranch = [];
	$.get('/config/branch/all').success(function(result){
		allBranch = result;
	});

	this.Fn_Initial = function(){
		$(document).ready(function(){
			
			$('#btnSearch').click(function(){
				Fn_Search();
			});
			
			$('#btnExport').click(function(){
				Fn_ExportXLS();
			})

			var date = new Date();
			for(var i = 2016 ; i <= date.getFullYear(); i++){
				$('#ddlYear').append('<option value="' + i + '">' + i + '</option>');
			}
		});
		
	};
		
	function Fn_Search(){
		var selectYear = $('#ddlYear option:selected').val();
		$.ajax({url: host + '/reports/summary_month/find', 
			type: 'POST',
			data :{ 
			   year : selectYear
			},
			success: function(result){
				//console.log(result);
				$('#tbResult tbody').html('');
				$('#lbYear').text($('#ddlYear option:selected').text());
			    var d =  result.data;
				
				var data='';

				for(var j = 0 ; j < d.length ; j++){
					data += '<tr>';
					var br = $.grep(allBranch,function(e){return e.branchID == d[j]._id});
					data += '<td style="text-align:center">'+ br[0].branchName + '</td>';

					for(var i=1;i<=12;i++){
						var item = $.grep(d[j].queue,function(e){ return e.month == i && e.year == selectYear});
						data += '<td style="text-align:center;">' + (item.length > 0 ? item[0].total : '0') + '</td>';
					}
					data += '</tr>';
				}

				$('#tbResult tbody:last-child').append(data);
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
				filename : 'report_monthly',
				table : $('#tbResult').parent().html()
			},
			success: function(result){
				console.log(result.url);
				window.open(result.url);
			}
		});
	};
}