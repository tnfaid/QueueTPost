function clscentral_account_add(){
	this.Fn_Initial = function(){
		$(document).ready(function(){
				// console.log('a==',a);
				//createtable(a);
			//////////////// Set ready //////////////////////////////////////////
				
			$('#central-user-alert').empty();
			//////////////////// Check box expiredate  /////////////////////////////

			$("#central-user-expiredate").prop('disabled', false);
			$('#cbnoexpire').unbind("change");
			$('#cbnoexpire').change(function(){	
				
				if($("#cbnoexpire").is(':checked')) {	
					$("#central-user-expiredate").val("");
					$("#central-user-expiredate").prop('disabled', true);	
				}				
				else{
					$("#central-user-expiredate").prop('disabled', false);
				}					
			 });

			role();

			$('#btn-add').unbind('click');
			$('#btn-add').click(function(){
				// console.log('click_btn-add-ok');
				if (CheckData()){
					// console.log('checkdata_true');
					$.post('/config/central_account_add_find',{ userName : $.trim($('#central-user-username').val())}).success(function(data){
						 console.log('data===',data.length);
						if (data.length > 0){
							$('#central-user-alert').html('This username already exists.');
						}else{
							var exd = '';
							// var disstart = '';
							// var disexp = '';							
							// if($("#cbnoexpire-user").is(':not(:checked)')) {					
							// 	exd = $.trim($('#central-user-expiredate').val());
							// 	}
							// if($("#cbnodisable-user").is(':not(:checked)')) {					
							// 	disstart = $.trim($('#central-user-disablestart').val());
							// 	disexp = $.trim($('#central-user-disableexpire').val());
							// 	}
							if($("#cbnoexpire").is(':not(:checked)')) {					
								exd = $.trim($('#central-user-expiredate').val());
								}
							$.post('/config/central_account_add_insert',{
								userName:$.trim($('#central-user-username').val()),
								password:$.trim($('#central-user-password').val()),
								fullname:$.trim($('#central-user-name-surname').val()),
								userState:$.trim($('#central-user-enable').val()),
								passpolicy:$.trim($('#central-user-passpolicy').val()),
								startdate:$.trim($('#central-user-startdate').val()),
								expiredate:exd,
								branchfilter:$.trim($('#central-user-branchfilter').val()),
								rolelevel:$.trim($('#central-user-role').val())
							}).success(function(datainsert){
								console.log('insert Complete')
									$(location).attr('href','/config/central_account');
									});
							}
					});

				}
			});

			$('#btn-cancel').click(function(){
				$(location).attr('href','/config/central_account');
			})
			/////////////////////////////////////////////////////////////////////////
			///////////////////  Date time Picker///////////////////////////////////////////////////////////////////////
			$('#central-user-startdate').daterangepicker({
				"singleDatePicker" : true,
				 locale: {format: 'YYYY-MM-DD' },		
				"startDate": moment(),
				"endDate": moment()
			}, function(start, end, label) {
			//console.log("New date range 44  : ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
			});
			$('#central-user-expiredate').daterangepicker({
				"singleDatePicker" : true,
				locale: {format: 'YYYY-MM-DD' },		
				"startDate": moment(),
				"endDate": moment()
			}, function(start, end, label) {
			//console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
			});  	  	
			//$.post('http://<%= host %>/config/central-account',{ action:'table' },function(data){
			//    	$('#central-displayuser').html(data);
			//});
			$('#central-edit-startdate').daterangepicker({
				"singleDatePicker" : true,
				locale: {format: 'YYYY-MM-DD' },
				"startDate": moment(),
				"endDate": moment()
			}, function(start, end, label) {
//		  console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
			});
			$('#central-edit-expiredate').daterangepicker({
				"singleDatePicker" : true,
				locale: {format: 'YYYY-MM-DD' },
				"startDate": moment(),
				"endDate": moment()
			}, function(start, end, label) {
//		  console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
			}); 
			$('#central-edit-disablestart').daterangepicker({
				"singleDatePicker" : true,
				 locale: {format: 'YYYY-MM-DD' },		
				"startDate": moment(),
				"endDate": moment()
			}, function(start, end, label) {
			});
			$('#central-edit-disableexpire').daterangepicker({
				"singleDatePicker" : true,
				 locale: {format: 'YYYY-MM-DD' },		
				"startDate": moment(),
				"endDate": moment()
			}, function(start, end, label) {
			});
////////////////////////////////////////////////////////////////////////////////////////////////////////
			// $('#cbnodisable-user').prop('checked', true);
		 //    $("#central-user-disablestart").prop('disabled', true);	
		 //    $("#central-user-disableexpire").prop('disabled', true);
			// $('#central-user-disablestart').val("");
			// $('#central-user-disableexpire').val("");
			// $('#cbnodisable-user').unbind("change");
			// $('#cbnodisable-user').change(function(){
				
			// 	if($("#cbnodisable-user").is(':checked')) {
			// 		$('#central-user-disablestart').val("");
			// 		$('#central-user-disableexpire').val("");
			//     $("#central-user-disablestart").prop('disabled', true);	
			//     $("#central-user-disableexpire").prop('disabled', true);
			// 	}else{			
			// 		 $("#central-user-disablestart").prop('disabled', false);	
			// 		 $("#central-user-disableexpire").prop('disabled', false);	
			// 	}	
			//    });

		});


		function role(){
			$.post('/config/central_account_add_role',{'data' : ''}).success(function(role){
				 // console.log('resultRole==',role);
				$('#central-user-role').empty();
				$('#central-edit-role').empty();
				for(var i=0; i < role.length; i++) { 
					$('#central-user-role').append('<option>' + role[i].roleLevel + '</option>');
					$('#central-edit-role').append('<option>' + role[i].roleLevel + '</option>');
				}
			})
		};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		function closeWin() {
		    window.close();   // Closes the new window
		};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		function CheckData(){
			
			var pwd = $.trim($('#central-user-password').val());
//					console.log('password=',pwd);	
			$('#central-user-alert').html('');
			if ($.trim($('#central-user-username').val()) == ''){ 
					$('#central-user-alert').html('กรุณาใส่ข้อมูล Username');
					return false;
			}
			// if ($.trim($('#central-user-username').val().length) < 8){ 
			// 	$('#central-user-alert').html('จำนวนตัวอักขระของ User น้อยกว่าที่กำหนดไว้ …ต้องอย่างน้อย  8');
			// 	return false;
			// }
			// if ($.trim($('#central-user-username').val().length) > 10){ 
			// 	$('#central-user-alert').html('จำนวนตัวอักขระของ User มากกว่าที่กำหนดไว้ …ต้องห้ามมากกว่า  10');
			// 	return false;
			// }
			// 	if ($.trim($('#central-user-staffid').val()) == ''){
			// 	$('#central-user-alert').html('กรุณาใส่ข้อมูล  StaffID');
			// 	return false;
			// }
			if ($.trim($('#central-user-password').val()) == ''){
				$('#central-user-alert').html('กรุณาใส่ข้อมูล Password');
				return false;
			}
			if ($.trim($('#central-user-password').val()).length < 8){
				$('#central-user-alert').html('Password ต้องมีจำนวนอักษรมากกว่าหรือเท่ากับ 8 ตัว');
				return false;
			}
			if ($.trim($('#central-user-password').val()).length > 30){
				$('#central-user-alert').html('จำนวนตัวอักขระของ Password มากกว่าที่กำหนดไว้…ต้องมีน้อยกว่า 30');
				return false;
			}		
			//////////ตัวแรกเป็นภาษาอังกฤษ/////////////////
//				var fstChr = $.trim($('#central-user-password').val().toUpperCase());						
//			    if (fstChr[0] < 'A' || fstChr[0] > 'Z') {
//			    	$('#central-user-alert').html('Password ตัตวแรกต้องเป็นตัวอักษรเท่านั้น...');
//			    	return false;
//			    }
		    
		    ///////////Pwd จะต้องมีภาษาอังกฤษตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว//////////////////////////
// 		    var Eng = 0;
// 		    for (var i = 0; i < pwd.length; i++){
// 		    	if (pwd[i] >= 'A' && pwd[i] <= 'Z' ) Eng++;
// 		    	}
// 		    if (Eng < 1) {$('#central-user-alert').html('Password ต้องมีจำนวนอักษรภาษาอังกฤษพิมพ์ใหญ่มากกว่าหรือเท่ากับ 1 ตัว');
// //		    	console.log(Eng);
// 	    		return false;
// 		    }
	    	
		    ///////////รหัสต้องมีเลข////////////////
		    var num = 0;
		    //var pwdlength = $.trim($('#central-user-password').val();
		    for (var i = 0; i < pwd.length; i++){
		    	if (pwd[i] >= '0' && pwd[i] <= '9' ) num++;
//			    	console.log('pwd=',pwd[i]);
		    	}
		    if (num < 1) {$('#central-user-alert').html('Password ต้องมีจำนวนตัวเลขมากกว่าหรือเท่ากับ 1 ตัว');
//			    	console.log(num);
		    	return false;
		    }
		    ///////////รหัสต้องมีอักษรพิเศษ///////////////////
		    var spl = 0;
		    var splChars = "*|,\":<>[]{}`\';()@&$#%";
		    for (var i = 0; i < pwd.length; i++)  {
		      if (splChars.indexOf(pwd.charAt(i)) != -1)  spl++;
		    }
		    if (spl < 1)  {$('#central-user-alert').html('Password ต้องมีจำนวนอักขระพิเศษ (เช่น @ / *) มากกว่าหรือเท่ากับ 1 ตัว');
		      return false; 
		    }  
		    ////////////รหัสผ่านจะต้องไม่ซ้ำกับตัวหน้า///////////////////////////
//			    var dup = 0;
//			    for (var i = 0; i < pwd.length; i++)  {  
//			      if (i < pwd.length-1 && pwd[i] == pwd[i+1])  dup++;                 
//			    //console.log('dup='+ dup + 'password' + i + '=' + pwd[i] );			    
//			      } 
//				 if (dup > 0)  {$('#central-user-alert').html('ตัวอักษรของรหัสที่ติดกันต้องไม่ซำ้กัน');
//			     return false;
//			     } 
			/////////////////////////////////////////////////
			 
			if ($.trim($('#central-user-password-again').val()) == ''){
					$('#central-user-alert').html('กรุณาใส่ข้อมูล Password Again');
					return false;
			}
			if ($.trim($('#central-user-password').val()) !== $.trim($('#central-user-password-again').val())){
					$('#central-user-alert').html('Password และ Password again ไม่ตรงกัน');
					return false;
			}
			if ($.trim($('#central-user-name-surname').val()) == ''){
					$('#central-user-alert').html('กรุณาใส่ข้อมูล  Name-Surname');
					return false;
			}
			if ($.trim($('#central-user-startdate').val()) == ''){
					$('#central-user-alert').html('กรุณาใส่ข้อมูล StartDate')
					return false;
			}
			// if ($.trim($('#central-user-branchid').val()) == ''){
			// 		$('#central-user-alert').html('กรุณาใส่ข้อมูล BranchID')
			// 		return false;
			// }
			// if ($.trim($('#central-user-branchname').val()) == ''){
			// 		$('#central-user-alert').html('กรุณาใส่ข้อมูล Branchname')
			// 		return false;
			// }
			if($.trim($('#central-user-expiredate').val()) == '' && ($("#cbnoexpire").is(':not(:checked)'))) {
					$('#central-user-alert').html('กรุณาใส่ข้อมูล ExpireDate');
					return false
			}
			if ($.trim($('#central-user-startdate').val()) == $.trim($('#central-user-expiredate').val())){
					$('#central-user-alert').html('StartDate และ ExpireDate ตรงกัน');
					return false;
			}
			return true;
		};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		function formatDate(date) {
				var d = new Date(date),
			  	month = '' + (d.getMonth() + 1),
			 	day = '' + d.getDate(),
			  	year = d.getFullYear();
			  	if (month.length < 2) month = '0' + month;
				if (day.length < 2) day = '0' + day;
				return [year, month, day].join('-');
		};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	};
};


// //function parseIsoDatetime(dtstr) {
// //    var dt = dtstr.split(/[: T-]/).map(parseFloat);
// //    return new Date(dt[0], dt[1] - 1, dt[2], dt[3] || 0, dt[4] || 0, dt[5] || 0, 0);
// //}
// function formatDate(date) {
//     var d = new Date(date),
//         month = '' + (d.getMonth() + 1),
//         day = '' + d.getDate(),
//         year = d.getFullYear();

//     if (month.length < 2) month = '0' + month;
//     if (day.length < 2) day = '0' + day;

    
//     return [year, month, day].join('-');
// }

// function clscentral_account_view(){

// 	 var arrDataVal1 =[];
// 	 var arrDataVal2 =[];
// 	this.fn_inital = function(){
		
// 		$(document).ready(function(){	
			
// 			if (btn_create === 'no'){ $('#btnAdd').css('display','none'); }
// 			if (btn_bulk === 'no'){ $('#btnBulkLoad').css('display','none'); }
// 			if (btn_export === 'no'){ $('#btnExport').css('display','none'); }
// 			if (bulkload !=''){
// 				$('#central-bulkload').modal('show');
// 				Fn_CheckBulkLoad();
// 			}
// 			loadDataVal();
			
// 			//---------------------------------Search Branch---------------------------------------
// 			var branchData = new Bloodhound({
// 			    datumTokenizer: function (datum) {
// 			        return Bloodhound.tokenizers.whitespace(datum.value);
// 			    },
// 			    queryTokenizer: Bloodhound.tokenizers.whitespace,
// 			    remote: {
// 			        url: '/config/ac_searchbranch?bid=%QUERY',
// 			        limit: 5,
// 			        wildcard: '%QUERY',
// 			        filter: function (branchs) {
// 			            return $.map(branchs.results, function (branch) {
// 			                return {
// 			                    value: branch.display,
// 			                    id : branch.branchID,
// 			                    name : branch.branchName
// 			                };
// 			            });
// 			        }
// 			    }
// 			});

// 			branchData.initialize();

// 			$('#central-user-branchid').typeahead({
// 			    hint: true,
// 			    highlight: true,
// 			    minLength: 1
// 			}, {
// 			    displayKey: 'id',
// 			    source: branchData.ttAdapter(),
// 			    templates:{
// 			    	empty: [
// 			    	        '<p style="margin-left:10px"><strong>',
// 			    	        'ไม่มีข้อมูลสาขา',
// 			    	        '</strong></p>'
// 			    	      ].join('\n'),
// 			    	suggestion: function(data){
// 			    	      return '<p><strong>' + data.id + '</strong> (' + data.name + ')</p>';
// 			        }
// 			    }
// 			});
			
// 			$('#central-user-branchid').bind('typeahead:selected', function(obj, datum, name) { 
// 		        $('#central-user-branchid').val(datum.id);
// 		        $('#central-user-branchname').val(datum.name);
// 			});
			
			
// 			$('#central-edit-branchid').typeahead({
// 			    hint: true,
// 			    highlight: true,
// 			    minLength: 1
// 			}, {
// 			    displayKey: 'id',
// 			    source: branchData.ttAdapter(),
// 			    templates:{
// 			    	empty: [
// 			    	        '<p style="margin-left:10px"><strong>',
// 			    	        'ไม่มีข้อมูลสาขา',
// 			    	        '</strong></p>'
// 			    	      ].join('\n'),
// 			    	suggestion: function(data){
// 			    	      return '<p><strong>' + data.id + '</strong> (' + data.name + ')</p>';
// 			        }
// 			    }
// 			});
			
// 			$('#central-edit-branchid').bind('typeahead:selected', function(obj, datum, name) { 
// 		        $('#central-edit-branchid').val(datum.id);
// 		        $('#central-edit-branchname').val(datum.name);
// 			});
			
// 		//------------------------------------------------------------------------	
			
// 			$('#btnExport').click(function(){
// 				Fn_ExportXLS();
// 			});
// ////////////////Region Select ////////////////////////////////////////////			
// 			$('#ddlRegion').change(function(){
				
// 				$.ajax({url:  host + '/config/ac_dataval/' , 
// 					type: 'POST',
// 					data :{type: "3" ,cond1 : $('#ddlRegion option:selected').val(),cond2 : $('#ddlZone option:selected').val()},
// 					success: function(result){
// 						 var dataVal=$.parseJSON(result.branch)
// 					     $('#ddlBranch').empty();
// 					     $('#ddlBranch').append('<option value="">ทั้งหมด</option>');
// 						for(var i=0;i<dataVal.length;i++){
							
// 							 $('#ddlBranch').append('<option value="' + dataVal[i].id  +'">' +  dataVal[i].name  +  '</option>');
// 						}
// 					}
// 				});	 
		   
// 			});
// ////////////////  Zone Select ////////////////////////////////////////////
// 			$('#ddlZone').change(function(){
				
// 				$.ajax({url:  host + '/config/ac_dataval/' , 
// 					type: 'POST',
// 					data :{type: "3" ,cond1 : $('#ddlRegion option:selected').val(),cond2 : $('#ddlZone option:selected').val()},
// 					success: function(result){
// 						 var dataVal=$.parseJSON(result.branch)
// 					     $('#ddlBranch').empty();
// 					     $('#ddlBranch').append('<option value="">ทั้งหมด</option>');
// 						for(var i=0;i<dataVal.length;i++){
							
// 							 $('#ddlBranch').append('<option value="' + dataVal[i].id  +'">' +  dataVal[i].name  +  '</option>');
// 						}
// 					}
// 				});	 
				 				
// 			});

// 			/*modify on May 26,2016 : set time interval search*/
// 			var timeFind=null;
// 			$(this).find('#btnSearch').unbind("click");
// 			$('#btnSearch').click(function(){				

// 				Fn_LoadUser();
// 				clearInterval(timeFind);
// 				timeFind = setInterval(function(){
// 					Fn_LoadUser();
// //					console.log('search user');
// 					},10000);
// 			}); 
			
// 			$(this).find('#uploadxls').unbind("click"); 
// 			$('#uploadxls').click(function(){
// 				var filename = $('#fileUploaded').val();

// 			});
// 			/////////////////  Date time Picker///////////////////////////////////////////////////////////////////////
// 		$('#central-user-startdate').daterangepicker({
// 			"singleDatePicker" : true,
// 			 locale: {format: 'YYYY-MM-DD' },		
// 			"startDate": moment(),
// 			"endDate": moment()
// 		}, function(start, end, label) {
// //		  console.log("New date range 44  : ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
// 		});
// 		$('#central-user-expiredate').daterangepicker({
// 			"singleDatePicker" : true,
// 			locale: {format: 'YYYY-MM-DD' },		
// 			"startDate": moment(),
// 			"endDate": moment()
// 		}, function(start, end, label) {
// //		  console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
// 		});  	  	
// //    	$.post('http://<%= host %>/config/central-account',{ action:'table' },function(data){
// //    		$('#central-displayuser').html(data);
// //    	});
// 		$('#central-edit-startdate').daterangepicker({
// 			"singleDatePicker" : true,
// 			locale: {format: 'YYYY-MM-DD' },
// 			"startDate": moment(),
// 			"endDate": moment()
// 		}, function(start, end, label) {
// //		  console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
// 		});
// 		$('#central-edit-expiredate').daterangepicker({
// 			"singleDatePicker" : true,
// 			locale: {format: 'YYYY-MM-DD' },
// 			"startDate": moment(),
// 			"endDate": moment()
// 		}, function(start, end, label) {
// //		  console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
// 		}); 
// 		$('#central-edit-disablestart').daterangepicker({
// 			"singleDatePicker" : true,
// 			 locale: {format: 'YYYY-MM-DD' },		
// 			"startDate": moment(),
// 			"endDate": moment()
// 		}, function(start, end, label) {
// 		});
// 		$('#central-edit-disableexpire').daterangepicker({
// 			"singleDatePicker" : true,
// 			 locale: {format: 'YYYY-MM-DD' },		
// 			"startDate": moment(),
// 			"endDate": moment()
// 		}, function(start, end, label) {
// 		});
// 		//////////Add from check box disableStart & disableExpire///////////////////////////////////////////
// 		$('#central-user-disablestart').daterangepicker({
// 			"singleDatePicker" : true,
// 			 locale: {format: 'YYYY-MM-DD' },		
// 			"startDate": moment(),
// 			"endDate": moment()
// 		}, function(start, end, label) {
// 		});
// 		$('#central-user-disableexpire').daterangepicker({
// 			"singleDatePicker" : true,
// 			 locale: {format: 'YYYY-MM-DD' },		
// 			"startDate": moment(),
// 			"endDate": moment()
// 		}, function(start, end, label) {
// 		});
		
// 		$.post( host + '/config/account-find/',{action:'role'},function(roledata){
// 			//var a = JSON.parse(roledata);
// //			console.log(roledata);
// 			$('#central-user-role').empty();
// 			$('#central-edit-role').empty();
// 			for(var i=0; i < roledata.length; i++) { 
// 				$('#central-user-role').append('<option>' + roledata[i].roleLevel + '</option>');
// 				$('#central-edit-role').append('<option>' + roledata[i].roleLevel + '</option>');
// 			}
// 		});	 
		
//     	 $('#select_file').change(function(e){			   		 
//     		 $("#userDetail").empty();
// 		   });
		   
// 		 $('#central-bulkload').on('show.bs.modal', function (e) {

// 	        });
// 		 $('#central-bulkload').on('hide.bs.modal', function (e) {
// 			  //console.log('hide');
// 			 Fn_BulkClear();
// 	       });
// /////////////////////////delete form///////////////////////////////////////
//         $('#central-confirm-delete').on('show.bs.modal', function (e) {
// 			$(this).find('.modal-body').html('Do you want delete user : ' + $(e.relatedTarget).attr('data-name')); //+ $(e.relatedTarget).attr('data-name'));
//             $(this).find('.btn-ok').unbind("click");
// 			$(this).find('.btn-ok').click(function () {
//                 $a = $.post(  host + '/config/account-find/', {action:'delete',id: $(e.relatedTarget).attr('data-id'), username: $(e.relatedTarget).attr('data-name') ,branchid: $(e.relatedTarget).attr('data-brid'), branchname : $(e.relatedTarget).attr('data-brname')},function( data ) {
// 					console.log($(e.relatedTarget).attr('data-brid'));
// 					console.log($(e.relatedTarget).attr('data-brname'));
//                 	$( "#central-displayuser" ).html( data );
// 				});
// 				$a.done(function () { $('#central-confirm-delete').modal('hide'); });
//             });
//         });
// /////////////////////////reset password form///////////////////////////////////////
//         $('#central-confirm-reset').on('show.bs.modal', function (e) {
// //			$(this).find('.modal-body').html('Do you want to reset password ? "default password is Kbank@1234"');
//         	 function CheckDataReset(){
// 				var pwd = $.trim($('#central-resetpass').val());
	
// 				$('#central-reset-alert').html('');

// 				if ($.trim($('#central-resetpass').val()) == ''){
// 					$('#central-reset-alert').html('กรุณาใส่ข้อมูล Password');
// 					return false;
// 				}
// 				if ($.trim($('#central-resetpass').val()).length < 8){
// 					$('#central-reset-alert').html('Password ต้องมีจำนวนอักษรมากกว่าหรือเท่ากับ 8 ตัว');
// 					return false;
// 				}
// 				if ($.trim($('#central-resetpass').val()).length > 30){
// 					$('#central-reset-alert').html('จำนวนตัวอักขระของ Password มากกว่าที่กำหนดไว้…ต้องมีน้อยกว่า 30');
// 					return false;
// 				}
			
// 				//////////ตัวแรกเป็นภาษาอังกฤษ/////////////////
// //				var fstChr = $.trim($('#central-resetpass').val().toUpperCase());						
// //			    if (fstChr[0] < 'A' || fstChr[0] > 'Z') {
// //			    	$('#central-reset-alert').html('Password ตัตวแรกต้องเป็นตัวอักษรเท่านั้น...');
// //			    	return false;
// //			    }
// 			    ///////////Pwd จะต้องมีภาษาอังกฤษตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว//////////////////////////
// 			    var Eng = 0;
// 			    for (var i = 0; i < pwd.length; i++){
// 			    	if (pwd[i] >= 'A' && pwd[i] <= 'Z' ) Eng++;
// 			    	}
// 			    if (Eng < 1) {$('#central-reset-alert').html('Password ต้องมีจำนวนอักษรภาษาอังกฤษพิมพ์ใหญ่มากกว่าหรือเท่ากับ 1 ตัว');
// //		    	console.log(Eng);
// 		    		return false;
// 			    }
// 			    ///////////รหัสต้องมีเลข////////////////
// 			    var num = 0;
// 			    //var pwdlength = $.trim($('#central-user-password').val();
// 			    for (var i = 0; i < pwd.length; i++){
// 			    	if (pwd[i] >= '0' && pwd[i] <= '9' ) num++;
// //			    	console.log('pwd=',pwd[i]);
// 			    	}
// 			    if (num < 1) {$('#central-reset-alert').html('Password ต้องมีจำนวนตัวเลขมากกว่าหรือเท่ากับ 1 ตัว');
// 			    	return false;
// 			    }
// 			    ///////////รหัสต้องมีอักษรพิเศษ///////////////////
// 			    var spl = 0;
// 			    var splChars = "*|,\":<>[]{}`\';()@&$#%";
// 			    for (var i = 0; i < pwd.length; i++)  {
// 			      if (splChars.indexOf(pwd.charAt(i)) != -1)  spl++;
// 			    }
// 			    if (spl < 1)  {$('#central-reset-alert').html('Password ต้องมีจำนวนอักขระพิเศษ (เช่น @ / *) มากกว่าหรือเท่ากับ 1 ตัว');
// 			      return false; 
// 			    }  
// 				return true;
//         	 }
        	 
//             $(this).find('.btn-ok').unbind("click");
// 			$(this).find('.btn-ok').click(function () {
// 				if (CheckDataReset()){

// 						$a = $.post(  host + '/config/account-find/', {action:'reset',id: $(e.relatedTarget).attr('data-id'),branchid : $('#ddlBranch option:selected').val(),newpwd:$('#central-resetpass').val()},function( data ) {
// 						$( "#central-displayuser" ).html( data );
// 						});
// 						$a.done(function () { $('#central-confirm-reset').modal('hide'); });
					               
// 				}
//             });
//         });
        
// /////////////////////////add form///////////////////////////////////////       
// 		$('#central-userdata').on('show.bs.modal',function(e){
			
// 			  $("#central-user-staffid").keypress(function (e) {
// 				     //if the letter is not digit then display error and don't type anything
// 				     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) 
// 				     {
// 				        //display error message
// 				       // $("#errmsg").html("Digits Only").show().fadeOut("slow");
// 				    	  $('#central-user-alert').html('Please insert number only');
// 				               return false;				              
// 				     }
// 				     else {$('#central-user-alert').html('');}				    	 
// 				   });
			  
// 			$('#central-user-alert').empty();
// 			$("#central-user-expiredate").prop('disabled', false);
// 			$('#cbnoexpire').unbind("change");
// 			$('#cbnoexpire').change(function(){	
				
// 				if($("#cbnoexpire").is(':checked')) {	
// 					$("#central-user-expiredate").val("");
// 					$("#central-user-expiredate").prop('disabled', true);	
// 				}
				
// 				else{
// 					$("#central-user-expiredate").prop('disabled', false);
// 				}
					
// 			   });
// 			$('#cbnodisable-user').prop('checked', true);
// 		    $("#central-user-disablestart").prop('disabled', true);	
// 		    $("#central-user-disableexpire").prop('disabled', true);
// 			$('#central-user-disablestart').val("");
// 			$('#central-user-disableexpire').val("");
// 			$('#cbnodisable-user').unbind("change");
// 			$('#cbnodisable-user').change(function(){
				
// 				if($("#cbnodisable-user").is(':checked')) {
// 					$('#central-user-disablestart').val("");
// 					$('#central-user-disableexpire').val("");
// 			    $("#central-user-disablestart").prop('disabled', true);	
// 			    $("#central-user-disableexpire").prop('disabled', true);
// 				}else{			
// 					 $("#central-user-disablestart").prop('disabled', false);	
// 					 $("#central-user-disableexpire").prop('disabled', false);	
// 				}	
// 			   });
			
// 			function CheckData(){
				
// //				$.post('/policy', {user: $('#central-user-username').val() , 
// //					               password : $('#central-user-password').val()},function (data){
// //					alert(data);
// //				});
// 				var pwd = $.trim($('#central-user-password').val());
// //					console.log('password=',pwd);	
// 				$('#central-user-alert').html('');
// 				if ($.trim($('#central-user-username').val()) == ''){ 
// 						$('#central-user-alert').html('กรุณาใส่ข้อมูล Username');
// 						return false;
// 				}
// 				if ($.trim($('#central-user-username').val().length) < 8){ 
// 					$('#central-user-alert').html('จำนวนตัวอักขระของ User น้อยกว่าที่กำหนดไว้ …ต้องอย่างน้อย  8');
// 					return false;
// 				}
// 				if ($.trim($('#central-user-username').val().length) > 10){ 
// 					$('#central-user-alert').html('จำนวนตัวอักขระของ User มากกว่าที่กำหนดไว้ …ต้องห้ามมากกว่า  10');
// 					return false;
// 				}
// 					if ($.trim($('#central-user-staffid').val()) == ''){
// 					$('#central-user-alert').html('กรุณาใส่ข้อมูล  StaffID');
// 					return false;
// 				}
// 				if ($.trim($('#central-user-password').val()) == ''){
// 					$('#central-user-alert').html('กรุณาใส่ข้อมูล Password');
// 					return false;
// 				}
// 				if ($.trim($('#central-user-password').val()).length < 8){
// 					$('#central-user-alert').html('Password ต้องมีจำนวนอักษรมากกว่าหรือเท่ากับ 8 ตัว');
// 					return false;
// 				}
// 				if ($.trim($('#central-user-password').val()).length > 30){
// 					$('#central-user-alert').html('จำนวนตัวอักขระของ Password มากกว่าที่กำหนดไว้…ต้องมีน้อยกว่า 30');
// 					return false;
// 				}
			
// 				//////////ตัวแรกเป็นภาษาอังกฤษ/////////////////
// //				var fstChr = $.trim($('#central-user-password').val().toUpperCase());						
// //			    if (fstChr[0] < 'A' || fstChr[0] > 'Z') {
// //			    	$('#central-user-alert').html('Password ตัตวแรกต้องเป็นตัวอักษรเท่านั้น...');
// //			    	return false;
// //			    }
			    
// 			    ///////////Pwd จะต้องมีภาษาอังกฤษตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว//////////////////////////
// 			    var Eng = 0;
// 			    for (var i = 0; i < pwd.length; i++){
// 			    	if (pwd[i] >= 'A' && pwd[i] <= 'Z' ) Eng++;
// 			    	}
// 			    if (Eng < 1) {$('#central-user-alert').html('Password ต้องมีจำนวนอักษรภาษาอังกฤษพิมพ์ใหญ่มากกว่าหรือเท่ากับ 1 ตัว');
// //		    	console.log(Eng);
// 		    		return false;
// 			    }
		    	
// 			    ///////////รหัสต้องมีเลข////////////////
// 			    var num = 0;
// 			    //var pwdlength = $.trim($('#central-user-password').val();
// 			    for (var i = 0; i < pwd.length; i++){
// 			    	if (pwd[i] >= '0' && pwd[i] <= '9' ) num++;
// //			    	console.log('pwd=',pwd[i]);
// 			    	}
// 			    if (num < 1) {$('#central-user-alert').html('Password ต้องมีจำนวนตัวเลขมากกว่าหรือเท่ากับ 1 ตัว');
// //			    	console.log(num);
// 			    	return false;
// 			    }
// 			    ///////////รหัสต้องมีอักษรพิเศษ///////////////////
// 			    var spl = 0;
// 			    var splChars = "*|,\":<>[]{}`\';()@&$#%";
// 			    for (var i = 0; i < pwd.length; i++)  {
// 			      if (splChars.indexOf(pwd.charAt(i)) != -1)  spl++;
// 			    }
// 			    if (spl < 1)  {$('#central-user-alert').html('Password ต้องมีจำนวนอักขระพิเศษ (เช่น @ / *) มากกว่าหรือเท่ากับ 1 ตัว');
// 			      return false; 
// 			    }  
// 			    ////////////รหัสผ่านจะต้องไม่ซ้ำกับตัวหน้า///////////////////////////
// //			    var dup = 0;
// //			    for (var i = 0; i < pwd.length; i++)  {  
// //			      if (i < pwd.length-1 && pwd[i] == pwd[i+1])  dup++;                 
// //			    //console.log('dup='+ dup + 'password' + i + '=' + pwd[i] );			    
// //			      } 
// //				 if (dup > 0)  {$('#central-user-alert').html('ตัวอักษรของรหัสที่ติดกันต้องไม่ซำ้กัน');
// //			     return false;
// //			     } 
// 				/////////////////////////////////////////////////
				 
// 				if ($.trim($('#central-user-password-again').val()) == ''){
// 						$('#central-user-alert').html('กรุณาใส่ข้อมูล Password Again');
// 						return false;
// 				}
// 				if ($.trim($('#central-user-password').val()) !== $.trim($('#central-user-password-again').val())){
// 						$('#central-user-alert').html('Password และ Password again ไม่ตรงกัน');
// 						return false;
// 				}
// 				if ($.trim($('#central-user-name-surname').val()) == ''){
// 						$('#central-user-alert').html('กรุณาใส่ข้อมูล  Name-Surname');
// 						return false;
// 				}
// 				if ($.trim($('#central-user-startdate').val()) == ''){
// 						$('#central-user-alert').html('กรุณาใส่ข้อมูล StartDate')
// 						return false;
// 				}
// 				if ($.trim($('#central-user-branchid').val()) == ''){
// 						$('#central-user-alert').html('กรุณาใส่ข้อมูล BranchID')
// 						return false;
// 				}
// 				if ($.trim($('#central-user-branchname').val()) == ''){
// 						$('#central-user-alert').html('กรุณาใส่ข้อมูล Branchname')
// 						return false;
// 				}
// 				if($.trim($('#central-user-expiredate').val()) == '' && ($("#cbnoexpire").is(':not(:checked)'))) {
// 						$('#central-user-alert').html('กรุณาใส่ข้อมูล ExpireDate');
// 						return false
// 				}
// 				if ($.trim($('#central-user-startdate').val()) == $.trim($('#central-user-expiredate').val())){
// 						$('#central-user-alert').html('StartDate และ ExpireDate ตรงกัน');
// 						return false;
// 				}

// //				if ($.trim($('#central-user-startdate').val()) == $.trim($('#central-user-expiredate').val())){
// //					$('#central-user-alert').html('StartDate and ExpireDate is math');
// //					return false;
// //				}
// 				return true;

// 			}
// 			$(this).find('.btn-ok').unbind('click');
// 			$(this).find('.btn-ok').click(function(){

// 				if (CheckData()){
// 				$.post( host + '/config/account-find/', {action:'check',username:$.trim($('#central-user-username').val()),branchid:$('#central-user-branchid').val()},function (data){
// 					if (data !== ''){					
// 						$('#central-user-alert').html(data);
// 					}else{
// 						var exd = '';
// 						var disstart = '';
// 						var disexp = '';							
// 						if($("#cbnoexpire-user").is(':not(:checked)')) {					
// 							exd = $.trim($('#central-user-expiredate').val());
// 							}
// 						if($("#cbnodisable-user").is(':not(:checked)')) {					
// 							disstart = $.trim($('#central-user-disablestart').val());
// 							disexp = $.trim($('#central-user-disableexpire').val());
// 							}
// 						if($("#cbnoexpire").is(':not(:checked)')) {					
// 							exd = $.trim($('#central-user-expiredate').val());
// 							}
// 						$a = $.post(  host + '/config/account-find/', {action:'insert',
// 									username:$.trim($('#central-user-username').val()),
// 									password:$.trim($('#central-user-password').val()),
// 									fullname:$.trim($('#central-user-name-surname').val()),
// 									staffid:$.trim($('#central-user-staffid').val()),
// 									userState:$.trim($('#central-user-enable').val()),									
// 									passpolicy:$.trim($('#central-user-passpolicy').val()),									
// 									startdate:$.trim($('#central-user-startdate').val()),
// 									expiredate:exd,
// 									disablestart:disstart,
// 									disableexpire:disexp,
// 									branchid:$('#central-user-branchid').val(),
// 									branchname:$('#central-user-branchname').val(),
// 									regionfilter:$('#central-user-regionfilter').val(),
// 									zonefilter:$('#central-user-zonefilter').val(),
// 									branchfilter:$('#central-user-branchfilter').val(),
									
// //									branchid:$('#ddlBranch option:selected').val(),
// //									branchname:$('#ddlBranch option:selected').text(),									
// 									rolelevel:$.trim($('#central-user-role').val())},									
// 									function( data ) {
// 									$( "#central-displayuser" ).html( data );
// 								});
// 						$a.done(function () { $('#central-userdata').modal('hide');});
// 					}
// 				});
// 				}
// 			});
			
// 		});
// 		$('#central-userdata').on('hidden.bs.modal', function (e) {
// 			 $(this)
// 				.find("input,textarea")
// 				   .val('')
// 				   .end()
// 				.find("input[type=checkbox], input[type=radio]")
// 				   .prop("checked", "")
// 				   .end();
// 		});
			
		
// ///////////////////////////////////////edit from///////////////////////////////////////////////////////////////////////////////////
	
// 		$('#central-userdata-edit').on('show.bs.modal',function(e){
			
// 			 $("#central-edit-staffid").keypress(function (e) {
// 			     //if the letter is not digit then display error and don't type anything
// 			     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)){ 
// 			    	  $('#central-edit-alert').html('กรุณากรอกเป็นตัวเลขเท่านั้น');
// 			         return false;
// 			     }else{			              			    
// 			     $('#central-edit-alert').html('');}				    	 
// 			   });
			 
// 			$('#central-edit-alert').empty()
// 			$("#cbnoexpire-edit").is(':not(:checked)')
// 			$("#central-edit-expiredate").prop('disabled', false);			
// 			$('#cbnoexpire-edit').unbind("change");
// 			$('#cbnoexpire-edit').change(function(){	
				
// 				if($("#cbnoexpire-edit").is(':checked')) {	
// 					$("#central-edit-expiredate").val("");
// 			    $("#central-edit-expiredate").prop('disabled', true);
// 			    }else{					
// 					$("#central-edit-expiredate").prop('disabled', false);}
// 			});

// 			$('#cbnodisable-edit').unbind("change");
// 			$('#cbnodisable-edit').change(function(){
				
// 				if($("#cbnodisable-edit").is(':checked')) {
// 					$('#central-edit-disablestart').val("");
// 					$('#central-edit-disableexpire').val("");
// 			    $("#central-edit-disablestart").prop('disabled', true);	
// 			    $("#central-edit-disableexpire").prop('disabled', true);
// 				}else{			
// 					 $("#central-edit-disablestart").prop('disabled', false);	
// 					 $("#central-edit-disableexpire").prop('disabled', false);	
// 				}	
// 			   });
// 			$.post( host + '/config/account-find/',{action:'select',id:$(e.relatedTarget).attr('data-id') },function(data){ //,branchid : $('#ddlBranch option:selected').val()
// 				var doc = JSON.parse(data);
// 				if (doc.startDate !== '' && doc.startDate !== undefined) {
//             	var datest = formatDate(doc.startDate)}	                    	
//             	else {datest = ''}                    			
//             	if (doc.expireDate !== ''&& doc.expireDate !== undefined) {
//             	var dateexp = formatDate(doc.expireDate)}
//             	else {dateexp = ''}
//             	if (doc.disableStart !== '' && doc.disableStart !== undefined) {
//                 var disst = formatDate(doc.disableStart)}
//                 else {disst = ''}
//             	if (doc.disableExpire !== '' && doc.disableExpire !== undefined) {
//                 var disexp = formatDate(doc.disableExpire)}
//                 else {disexp = ''} 
//             	if (doc.lastLogon[0] !== '' && doc.lastLogon[0] !== undefined && doc.lastLogon !== undefined) {
// 				var lastlogon = (doc.lastLogon[0])}
// 				else {lastlogon = ''}
// //            	if (doc.disableExpire !== '' && doc.disableExpire !== undefined) {
// //                var rf = doc.disableExpire[0]}
// //                else {disexp = ''}
            	
// //            	console.log(doc);
//             	//console.log(doc.disableStart);
//             	//console.log('lastlogon=',doc.lastLogon[0]);
// 				$('#central-edit-username').val(doc.userName);
// 				$('#central-edit-name-surname').val(doc.FullName);
// 				$('#central-edit-staffid').val(doc.staffID);
// 				$('#central-edit-role').val(doc.roleLevel);
// 				$('#central-edit-enable').val(doc.userState);
// 				$('#central-edit-branchid').val(doc.branchID);
// 				$('#central-edit-branchid-old').val(doc.branchID);									
// 				$('#central-edit-branchname').val(doc.branchName);
// 				$('#central-edit-branchname-old').val(doc.branchName);	
// 				$('#central-edit-startdate').val(datest);
// 				$('#central-edit-expiredate').val(dateexp);
// 				$('#central-edit-disablestart').val(disst);
// 				$('#central-edit-disableexpire').val(disexp);
				
// 				$('#central-edit-regionfilter').val(doc.regionFilter);
// 				$('#central-edit-zonefilter').val(doc.zoneFilter);
// 				$('#central-edit-branchfilter').val(doc.branchFilter);
// 				$('#central-edit-lastlogon').val(lastlogon);
// //							console.log(doc.disableStart, '+' ,doc.disableExpire);
// 				if ($('#central-edit-expiredate').val() == '') {
					
// 					$('#cbnoexpire-edit').prop('checked', true);
// 					$("#central-edit-expiredate").val("");
// 					$("#central-edit-expiredate").prop('disabled', true);
// 					} else if ($('#central-edit-expiredate').val() !== ''){
// 					$("#cbnoexpire-edit").prop('checked', false);
// 					$("#central-edit-expiredate").prop('disabled', false);
// 				};
					
// 				if ($('#central-edit-disablestart').val() == ''){
// 					$('#cbnodisable-edit').prop('checked', true);
// 					$("#central-edit-disablestart").val("");
// 					$("#central-edit-disablestart").prop('disabled', true);	
// 					$("#central-edit-disableexpire").val("");
// 					$("#central-edit-disableexpire").prop('disabled', true);		
// 					} else if ($('#central-edit-disablestart').val() !== ''){
// 						$("#cbnodisable-edit").prop('checked', false);
// 						$("#central-edit-disablestart").prop('disabled', false);	
// 						$("#central-edit-disableexpire").prop('disabled', false);
// 					}
// //							console.log('}}}}}}}}}}}}}}}}}}}',doc.passPolicy );
// 				if (doc.passPolicy == false) {
// 					$('#central-edit-passpolicy').val('0');
// 				} else {
// 					$('#central-edit-passpolicy').val('1');
// 				};
					
// 			});
// 			function CheckData(){			
				
// 				if ($.trim($('#central-edit-username').val()) == ""){
// 					$('#central-edit-alert').html('กรุณาใส่ข้อมูล Username');
// 					return false;
// 				}
// 				if ($.trim($('#central-edit-name-surname').val()) == ""){
// 					$('#central-edit-alert').html('กรุณาใส่ข้อมูล Name-Surname');
// 					return false;
// 				}
// 				if ($.trim($('#central-edit-staffid').val()) == ''){
// 					$('#central-edit-alert').html('กรุณาใส่ข้อมูล StaffID');
// 					return false;
// 				}
// 				if ($.trim($('#central-edit-startdate').val()) == ''){
// 					$('#central-edit-alert').html('กรุณาใส่ข้อมูล StartDate');
// 					return false;
// 				}	
// 				if ($.trim($('#central-edit-role').val()) == ''){
// 					$('#central-edit-alert').html('กรุณาใส่ข้อมูล Role');
// 					return false;
// 				}
// 				if ($.trim($('#central-edit-enable').val()) == ''){
// 					$('#central-edit-alert').html('กรุณาใส่ข้อมูล userState');
// 					return false;
// 				}
// 				if ($.trim($('#central-edit-branchid').val()) == ''){
// 					$('#central-edit-alert').html('กรุณาใส่ข้อมูล BranchID')
// 					return false;
// 				}
// 				if ($.trim($('#central-edit-branchname').val()) == ''){
// 					$('#central-edit-alert').html('กรุณาใส่ข้อมูล Branchname')
// 					return false;
// 				}
// 				if ($.trim($('#central-edit-startdate').val()) == $.trim($('#central-edit-expiredate').val())){
// 					$('#central-edit-alert').html('StartDate และ ExpireDate ตรงกัน');
// 					return false;
// 				}
// 				if($.trim($('#central-edit-disablestart').val()) == '' && ($("#cbnodisable-edit").is(':not(:checked)'))) {
// 					$('#central-edit-alert').html('กรุณาใส่ข้อมูล DisableStart');
// 					return false
// 				}	
// 				if($.trim($('#central-edit-expiredate').val()) == '' && ($("#cbnoexpire-edit").is(':not(:checked)'))) {
// 					$('#central-edit-alert').html('กรุณาใส่ข้อมูล ExpireDate');
// 					return false
// 				}				
// 				if($.trim($('#central-edit-disableexpire').val()) == '' && ($("#cbnodisable-edit").is(':not(:checked)'))) {
// 					$('#central-edit-alert').html('กรุณาใส่ข้อมูล DisableExpire');
// 					return false
// 				}
// 				return true;
// 			}
// 			$(this).find('.btn-edit').unbind('click');
// 			$(this).find('.btn-edit').click(function(){
// 				console.log('btn-edit');
// 				//alert('testbug');
// 				if (CheckData()){
									
// 							console.log('edit action');
// 							var exd = '';
// 							var disstart = '';
// 							var disexp = '';							
// 							if($("#cbnoexpire-edit").is(':not(:checked)')) {					
// 								exd = $.trim($('#central-edit-expiredate').val());
// 								}
// 							if($("#cbnodisable-edit").is(':not(:checked)')) {					
// 								disstart = $.trim($('#central-edit-disablestart').val());
// 								disexp = $.trim($('#central-edit-disableexpire').val());
// 							}
							
// 							$a = $.post( host + '/config/account-find/', {action:'edit',
// 										id:$(e.relatedTarget).attr('data-id'),
// 										username:$.trim($('#central-edit-username').val()),										
// 										fullname:$.trim($('#central-edit-name-surname').val()),
// 										staffid:$.trim($('#central-edit-staffid').val()),
// 										passpolicy:$.trim($('#central-edit-passpolicy').val()),
// 										userState:$.trim($('#central-edit-enable').val()),
// 										startdate:$.trim($('#central-edit-startdate').val()),
// 										expiredate:exd,
// 										disablestart:disstart,
// 										disableexpire:disexp,
// 										branchid:$.trim($('#central-edit-branchid').val()),
// 										branchidold:$.trim($('#central-edit-branchid-old').val()),
// 										branchname:$.trim($('#central-edit-branchname').val()),
// 										branchnameold:$.trim($('#central-edit-branchname-old').val()),
// 										regionfilter:$.trim($('#central-edit-regionfilter').val()),
// 										zonefilter:$.trim($('#central-edit-zonefilter').val()),
// 										branchfilter:$.trim($('#central-edit-branchfilter').val()),										
// 										rolelevel:$.trim($('#central-edit-role').val())}
// 							,function( data ) {
// //										$( "#central-displayuser" ).html( data );
// //									}
// ///						)
// //							$a.done(function () { $('#central-userdata-edit').modal('hide');});
							
// 							if ($('#central-edit-branchid').val() != $('#central-edit-branchid-old').val()){
// //								console.log('loopppp');
// 								console.log('edit brold send delete result');
// 								$a = $.post( host + '/config/account-find/', {action:'editbranch',
// 								id:$(e.relatedTarget).attr('data-id'),
// 								username:$.trim($('#central-edit-username').val()),										
// 								fullname:$.trim($('#central-edit-name-surname').val()),
// 								staffid:$.trim($('#central-edit-staffid').val()),
// 								passpolicy:$.trim($('#central-edit-passpolicy').val()),
// 								userState:$.trim($('#central-edit-enable').val()),
// 								startdate:$.trim($('#central-edit-startdate').val()),
// 								expiredate:$.trim($('#central-edit-expiredate').val()),
// 								branchid:$.trim($('#central-edit-branchid').val()),
// 								branchidold:$.trim($('#central-edit-branchid-old').val()),
// 								branchname:$.trim($('#central-edit-branchname').val()),
// 								branchnameold:$.trim($('#central-edit-branchname-old').val()),
// 								regionfilter:$.trim($('#central-edit-regionfilter').val()),
// 								zonefilter:$.trim($('#central-edit-zonefilter').val()),
// 								branchfilter:$.trim($('#central-edit-branchfilter').val()),		
// 								rolelevel:$.trim($('#central-edit-role').val())},function( data ) {
// 									console.log('editbranch callback',data.data);
// 									$('#central-userdata-edit').modal('hide');
								
// //								$a.done(function () { $('#central-userdata-edit').modal('hide');});	
// 							})
// 							//console.log('gotoedit')													
// 							}else{
// 							 $('#central-userdata-edit').modal('hide'); 
// 							console.log('==========changeBRold===========');
// 							}
// 							$( "#central-displayuser" ).html( data );
// 							$('#central-userdata-edit').modal('hide');
// 							})
// 							//$a.done(function () { $('#central-userdata-edit').modal('hide');});	
// ///						}						
// ///					});
// 				}
// 			});
			
// 		});
		
		
// 		$('#central-userdata-edit').on('hidden.bs.modal',function(e){

// 			$(this).find("input,textarea,select").val("").end();			
// 		});
	 
// 		$('#btnBulkLoad').unbind('click');
//     	$('#btnBulkLoad').click(function(){
//     		$('#select_file').val('')
//     		$('#fileUploaded').val('')    		
    		
// 		});
		
// 	});	
	
		
// 		function Fn_LoadUser(){
// 			//alert($('#ddlBranch option:selected').val());
// 			var brSearch = '';
// 			var  arrBrID = [];
// 			$('#ddlBranch option').each(function(index,rec){
// 				if ($(rec).val() !== '')
// 					{
// 						arrBrID.push($(rec).val());
// 					}					
// 			})
			
// 			if ($('#ddlBranch option:selected').val() !== '')
// 			{
// 				brSearch = $('#ddlBranch option:selected').val()
// 			}	
			

			
// 			$a = $.post( host + '/config/account-find/', {action:'table',
// 				 username : $('#txtSearchUser').val(),
// 			    	brall : JSON.stringify(arrBrID) ,
// 			    	brsearch : brSearch},function(data){
// 			    		//console.log(data);
// 			    		try{
// 				    		var obj = $.parseJSON(data);
// 				    		if (obj.status==true){
// 				    			$( "#central-displayuser" ).html( obj.data );	
// 				    		}else
// 				    			{
// 				    			window.location='/';
// 				    			}
// 			    		}catch(e){
// 			    			window.location='/';
// 			    		}
// 			    	});

   
// 	};
	
// 	function loadDataVal(){
		
// 		$.ajax({url:  host + '/config/ac_dataval/' , 
// 			type: 'POST',
// 			data :{type: "1"},
// 			success: function(result){
// 				 var dataVal=$.parseJSON(result.branch)
// 				 $('#ddlRegion').empty();
// 			     $('#ddlRegion').append('<option value="">ทั้งหมด</option>');
// 				 $('#ddlBranch').empty();
// 			     $('#ddlBranch').append('<option value="">ทั้งหมด</option>');
// 				for(var i=0;i<dataVal.length;i++){
// 					arrDataVal1.push({'value' : dataVal[i].id ,'name': dataVal[i].name });
// 				    $('#ddlRegion').append('<option value="' + dataVal[i].id  +'">' +  dataVal[i].name  +  '</option>');
// 				  // console.log(dataVal[i].name);
// 				}
// 			}
// 		});
		
// 		$.ajax({url:  host + '/config/ac_dataval/' , 
// 			type: 'POST',
// 			data :{type: "2" },
// 			success: function(result){
// 				 var dataVal=$.parseJSON(result.branch)
// 				 $('#ddlZone').empty();
// 			     $('#ddlZone').append('<option value="">ทั้งหมด</option>');
// 				for(var i=0;i<dataVal.length;i++){
// 					arrDataVal2.push({'value' : dataVal[i].id ,'name': dataVal[i].name });
// 				    $('#ddlZone').append('<option value="' + dataVal[i].id  +'">' +  dataVal[i].name  +  '</option>');
// 				    //console.log(dataVal[i].name)
// 				}
// 			}
// 		});
			
// 	};
	
// 	function Fn_ExportXLS(){
// 		var r = confirm("คุณต้องการ export ข้อมูลนี้หรือไม่");
// 		if(r==false){return;}
// 		$.ajax({url:  host + '/config/ac_exportxls/' , 
// 			type: 'POST',
// 			data :{regionID : $('#ddlRegion option:selected').val(),zoneID : $('#ddlZone option:selected').val()
// 				  ,branchID : $('#ddlBranch option:selected').val()
// 				  ,search : $('#txtSearchUser').val()
// 				},
// 			success: function(result){
// 				window.open(result);
			
// 			}
// 		});
// 	};

// 	function Fn_ValidXLS(){
		
// 		$.ajax({url:  host + '/config/ac_valid' , 
// 			type: 'POST',
// 			data :'',
// 			success: function(result){
// 				console.log(result.data.result,result.data.filename);
			
// 			}
// 		});
// 	};
// 	function Fn_CheckBulkLoad(){
		
// 		$.ajax({url:  host + '/config/ac_check_valid' , 
// 			type: 'POST',
// 			data :'',
// 			success: function(result){
// 				//console.log(result.data.result,result.data.filename);
			  

// 			    if (result.data.result!=null){
// 			    	if (result.data.result==true){
// 			    		$('#lbFileCheck').html('<font color="green">Bulk Complete <a href="' + result.data.filename + '">' + result.data.filename + '</a> </font>');
// 			    	}else{
			    		
// 			    		$('#lbFileCheck').html('<font color="red">Bulk Fail <a href="' + result.data.filename + '">' + result.data.filename + '</a> </font>');
// 			    	}
			    	
// 			    }
// 			}
// 		});
// 	};
// 		function Fn_BulkClear(){
			
// 			$.ajax({url:  host + '/config/ac_clear' , 
// 				type: 'POST',
// 				data :'',
// 				success: function(result){
// 					//console.log(result.data.result,result.data.filename);
// 				  $('#lbFileCheck').html('');
				    
// 				}
// 			});
// 	   };
// 	}}
