function configrole_view(){

	this.fn_inital = function(){

		$(document).ready(function(){	

			$('#btnAddRole').click(function(){
				if (CheckData()){
					var sendData = GetFrmData();

					$.ajax({
						url: '/config/role/add' ,
						type: 'POST',
						data :{action:'add',role:JSON.stringify(sendData)},
						success: function(results){
							window.location.assign('/config/role')
						}
					});
				}
			});
			
			$('#btnEditRole').click(function(){
				if (CheckData()){
					var sendData = GetFrmData();
					console.log(sendData);
					$.ajax({
						url: '/config/role/edit' ,
						type: 'POST',
						data :{action:'edit',role:JSON.stringify(sendData),id:$('#itemid').val()},
						success: function(results){
							window.location.assign('/config/role')
						}
					});
				}
			})
			$('#btnCancle').click(function(){
				window.location.assign('/config/role')
			});

			$("#tree input:checkbox").change(function () {
		        var $this = $(this), val = this.checked, $parent = $(this.parentNode.parentNode);
		        $this.parent().parent().find("input:checkbox").each(function () {
		            this.checked = val;
		        });

		    });
			
		});
	};
		
	function CheckData(){
		var errfrm = true;
		if ($('#rolename').val() == ''){
			$('#rolename').attr('placeholder','กรุณากรอกข้อมูล');
			errfrm = false;
		}
		
		return errfrm;
	}
	
	function GetFrmData(){
		var menu = $('input:checkbox:checked').map(function () {
			  return this.value;
		}).get();
		
		var rtnData = {
					roleName : $('#rolename').val(),
					discription : $('#discription').val(),
					menu : menu
		};
		
		return rtnData;
	}

}