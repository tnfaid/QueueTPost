function clscentral_account_view(){
	this.Fn_Initial = function(){
		$(document).ready(function(){

			$('#btnSearch').click(function(){
				var a =	Fn_Search();
				// console.log('a==',a);
				//createtable(a);

			});
			$('#btnAdd').click(function(){
				$(location).attr('href','/config/central_account_add');
			});

			$('#btnedit').click(function(){
				console.log('clickedit');

				// $.post('/config/central_account_edit',{ id : $(e.relatedTarget).attr('data-id'),username: $(e.relatedTarget).attr('data-name') }).success(function(data){
				// 		// $('#central-confirm-delete').modal('hide');
				// 		// Fn_Search();
				// 	});   
			});
/////////////////reset password//////////////////
			 $('#central-confirm-reset').on('show.bs.modal', function (e) {
//			$(this).find('.modal-body').html('Do you want to reset password ? "default password is Kbank@1234"');
        	 function CheckDataReset(){
				var pwd = $.trim($('#central-resetpass').val());	
				$('#central-reset-alert').html('');
				if ($.trim($('#central-resetpass').val()) == ''){
					$('#central-reset-alert').html('กรุณาใส่ข้อมูล Password');
					return false;
				}
				if ($.trim($('#central-resetpass').val()).length < 8){
					$('#central-reset-alert').html('Password ต้องมีจำนวนอักษรมากกว่าหรือเท่ากับ 8 ตัว');
					return false;
				}
				if ($.trim($('#central-resetpass').val()).length > 30){
					$('#central-reset-alert').html('จำนวนตัวอักขระของ Password มากกว่าที่กำหนดไว้…ต้องมีน้อยกว่า 30');
					return false;
				}			
				//////////ตัวแรกเป็นภาษาอังกฤษ/////////////////
//				var fstChr = $.trim($('#central-resetpass').val().toUpperCase());						
//			    if (fstChr[0] < 'A' || fstChr[0] > 'Z') {
//			    	$('#central-reset-alert').html('Password ตัตวแรกต้องเป็นตัวอักษรเท่านั้น...');
//			    	return false;
//			    }
			    ///////////Pwd จะต้องมีภาษาอังกฤษตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว//////////////////////////
			    var Eng = 0;
			    for (var i = 0; i < pwd.length; i++){
			    	if (pwd[i] >= 'A' && pwd[i] <= 'Z' ) Eng++;
			    	}
			    if (Eng < 1) {$('#central-reset-alert').html('Password ต้องมีจำนวนอักษรภาษาอังกฤษพิมพ์ใหญ่มากกว่าหรือเท่ากับ 1 ตัว');
//		    	console.log(Eng);
		    		return false;
			    }
			    ///////////รหัสต้องมีเลข////////////////
			    var num = 0;
			    //var pwdlength = $.trim($('#central-user-password').val();
			    for (var i = 0; i < pwd.length; i++){
			    	if (pwd[i] >= '0' && pwd[i] <= '9' ) num++;
//			    	console.log('pwd=',pwd[i]);
			    	}
			    if (num < 1) {$('#central-reset-alert').html('Password ต้องมีจำนวนตัวเลขมากกว่าหรือเท่ากับ 1 ตัว');
			    	return false;
			    }
			    ///////////รหัสต้องมีอักษรพิเศษ///////////////////
			    var spl = 0;
			    var splChars = "*|,\":<>[]{}`\';()@&$#%";
			    for (var i = 0; i < pwd.length; i++)  {
			      if (splChars.indexOf(pwd.charAt(i)) != -1)  spl++;
			    }
			    if (spl < 1)  {$('#central-reset-alert').html('Password ต้องมีจำนวนอักขระพิเศษ (เช่น @ / *) มากกว่าหรือเท่ากับ 1 ตัว');
			      return false; 
			    }  
				return true;
        	 }       	 
            $(this).find('.btn-ok').unbind("click");
			$(this).find('.btn-ok').click(function () {
				if (CheckDataReset()){
						// $a = $.post(  host + '/config/central_account_resetpass', {action:'reset',id: $(e.relatedTarget).attr('data-id'),branchid : $('#ddlBranch option:selected').val(),newpwd:$('#central-resetpass').val()},function( data ) {
						// $( "#central-displayuser" ).html( data );
						// });
						// $a.done(function () { $('#central-confirm-reset').modal('hide'); });
					     $.post('/config/central_account_resetpass',{ id : $(e.relatedTarget).attr('data-id'), newpwd : $('#central-resetpass').val() }).success(function(records){
					     	// console.log('id=',id ,'newpwd=',newpwd);
					     	$('#central-confirm-reset').modal('hide');
					     });          
				}
            });
        });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////delete user//////////////////////////////////////////////////////////////////////////////////
	        $('#central-confirm-delete').on('show.bs.modal', function (e) {
	        	console.log($(e.relatedTarget).attr('data-name'))
				$(this).find('.modal-body').html('Do you want delete user : ' + $(e.relatedTarget).attr('data-name')); //+ $(e.relatedTarget).attr('data-name'));
	            $(this).find('.btn-ok').unbind("click");
				$(this).find('.btn-ok').click(function () {
					$.post('/config/central_account_deleteuser',{ id : $(e.relatedTarget).attr('data-id'),username: $(e.relatedTarget).attr('data-name') }).success(function(data){
						$('#central-confirm-delete').modal('hide');
						Fn_Search();
					});   
	            });
	        });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////       
		});
	};



	function Fn_Search(){
		var namesearch = $('#txtSearchUser').val();
		// console.log(namesearch);
		var rtn = {};
		/*$.ajax({url: host + '/config/central_account_search',
			type: 'POST',
			data: {'data' : namesearch},
			success: function(result){
				console.log('result==',result);
				// $('#central-displayuser').html(result);
				 rtn = result;
			}
		});*/
		$.post('/config/central_account_search',{'data' : namesearch}).success(function(result){
			// console.log('result==',result);
			createtable(result);
		})

	};
	function createtable(records){
				// records = records.data;
				// console.log(records.length)
		  	    var str =  "<tr>\n\
                <th width='4%'>UserName</th>\n\
                <th width='12%'>Name - Surname</th>\n\
                <th width='3%'>Role</th>\n\
            	<th width='2%'>Status</th>\n\
        		<th width='3%'>StartDate</th>\n\
        		<th width='3%'>ExpireDate</th>\n\
            	<th width='10%'>Action</th>\n\
            	</tr>";
            		if(records.length > 0) { 
            				for(var i=0; i < records.length; i++) {
            					if (records[i].startDate !== '') {
                    				var datest = formatDate(records[i].startDate)}                    				
			                    else {datest = ''}                    			
			                    if (records[i].expireDate !== '') {
			                    	var dateexp = formatDate(records[i].expireDate)}
			                    	
			                    else {dateexp = ''}
            					str += "<tr>\n\
                                <td align='center' class='vert-align'>" + records[i].userName + "</td>\n\
                                <td align='center' class='vert-align'>" + records[i].FullName + "</td>\n\
                                <td align='center' class='vert-align'>" + records[i].roleLevel + "</td>\n\
                                <td align='center' class='vert-align'>" + records[i].userState + "</td>\n\
                                <td align='center' class='vert-align'>" + datest + "</td>\n\
                                <td align='center' class='vert-align'>" + dateexp + "</td>\n\
                                <td align='center'><div class='btn-group'>\n\
                                <button type='button' ID='btnreset' class='btn btn-warning' data-id='" + records[i]._id + "' data-name='" + records[i].userName + "'  data-toggle='modal' data-toggle='modal' data-target='#central-confirm-reset'>Reset</button>\n\
                                <button type='button' ID='btnedit' class='btn btn-primary' data-id='" + records[i]._id + "' onclick=\"frm.Fn_Edit('" + records[i]._id + "');\" >Edit</button>\n\
                                <button type='button' ID='btndel'  class='btn btn-danger' data-id='" + records[i]._id + "' data-name='" + records[i].userName + "'  data-toggle='modal' data-target='#central-confirm-delete'>Delete</button>\n\
                                </td></div>\n\
                            	</tr>";	  
            				};
            		}else {
            			str += '<tr><td colspan="9" align="center">ไม่มีข้อมูล</td></tr>';
            		}
                		
            		 $('#central-displayuser').html(str);
            		 // console.log('str===',str);
	};

	function formatDate(date) {
			var d = new Date(date),
		  	month = '' + (d.getMonth() + 1),
		 	day = '' + d.getDate(),
		  	year = d.getFullYear();
		  	if (month.length < 2) month = '0' + month;
			if (day.length < 2) day = '0' + day;
			return [year, month, day].join('-');
	 };
				
	this.Fn_Edit =function(id){
		window.location.href  = host  + '/config/central_account_edit/' + id
	};

};

	