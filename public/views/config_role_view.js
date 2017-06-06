$(document).ready(function(){
	this.EditItem = function(id){
		window.location.assign('/config/role/edit/' + id);
	}
	this.DelItem = function(id){
		var r = confirm("คุณต้องการลบข้อมูลนี้หรือไม่");
		if(r==true){
			window.location.assign('/config/role/delete/' + id);
		}
	}
});