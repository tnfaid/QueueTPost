$(document).ready(function () {
    
    $.get('/config/branch/all').success(function(data){
      console.log(JSON.stringify(data));
      if(data.length > 0){
        for(var i = 0 ; i < data.length ; i++){
          var row = "<tr>";
          row += "<td class='text-center' style='mso-number-format:\"\@\";'>" + data[i].branchID + "</td>";
          row += "<td class='text-center' >" + data[i].branchName + "</td>";
          //row += "<td class='text-center' >" + data[i].bStatus + "</td>";
          //row += "<td class='text-center' >" + data[i].bAddr + "</td>";
          row += "<td class='text-center'>";
          row += "<div class='btn-group'>";
          //row += "<button class='btn btn-xs btn-primary' value='View' onclick=\"branchView('"+data[i].branchID+"')\"><span class='glyphicon glyphicon-list-alt'></span></button>"; 
          row += "<button class='btn btn-xs btn-warning' value='Edit' onclick=\"branchEdit('"+data[i].branchID+"')\"><span class='glyphicon glyphicon-edit'></span> แก้ไข</button>";
          //row += "<button class='btn btn-xs btn-danger' value='Delete' onclick=\"branchDel('"+data[i].branchID+"','"+data[i].branchName+"')\"><span class='glyphicon glyphicon-remove'></span></button>";
          row += "</div></td>";
          row += "</tr>";
          $('#table_id > tbody:last-child').append(row);
        }
      }else if(data.length == 1){
        //$(location).attr('href','branch-view.php?branchid=' + data[0].branchID);
      }
    })/*.done(function(){
          $('#table_id').DataTable({
             "pagingType": "full_numbers",
             "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
             "scrollY"  : "400px",
             "dom": '<"toolbar">frtip',
             "sPaginationType":"bs_four_button",
             "oLanguage": { "sSearch": "" },
             "columnDefs": [  {"targets": 1,"orderable": false},
                              {"targets": 2,"orderable": false},
                              {"targets": 3,"orderable": false},
                              {"targets": 4,"orderable": false}] 
           });

          var tabelbar = "<input type='button' id='btnadd' class='btn btn-primary' value='เพิ่มสาขา' style='margin-left:10px'>";

          $("div.toolbar").html( tabelbar);
          $('#table_id_filter label input').attr('placeholder','ค้นหา');
          $('#table_id_filter label input').addClass('form-control')
          $('#btnadd').click(function(){
            $('#addbranch').modal('show');
          })

    })*/

    $('#delbranch').on('show.bs.modal',function(e){
      $(this).find('.btn-ok').unbind('click');
      var bid = $(this).find('#delbid').val();
      $(this).find('.btn-ok').click(function(){
          $.post( "/config/branch/delete/" + bid, JSON.stringify({branchID:bid}),
                   function( data ) {
                  if(data.status == 'success'){
                    $(location).attr('href', '/config/branch/')
                  }
                 });
          $a.done(function () { $('#delbranch').modal('hide');});
      });
    });

    $('#editbranch').on('show.bs.modal',function(e){
      $(this).find('.btn-ok').unbind('click')
      $(this).find('.btn-ok').click(function(){
        var sendData = { 
          branchID : $('#ebranchID').val(),
          branchName : $('#ebranchName').val(),
          //bAddr : $('#eIPAddr').val()
        }
        $.post('/config/branch/edit/' +  $('#ebid').val() , sendData).success(function(result){
          console.log(result);
          var res = JSON.parse(result);
          if(res.status == 'success'){
              $(location).attr('href','/config/branch/');
              //$('#editbranch').modal('hide');
          }
        })
      })
    })

    $('#addbranch').on('show.bs.modal',function(e){
      $('#abranchID').val('');
      $('#abranchName').val('');
      $('#aIPAddr').val('');
      $(this).find('.btn-ok').unbind('click')
      $(this).find('.btn-ok').click(function(){
        var sendData = { 
          branchID : $('#abranchID').val(),
          branchName : $('#abranchName').val(),
          //bAddr : $('#aIPAddr').val()
        }
        $.post('/config/branch/add/' + sendData.branchID, sendData).success(function(result){
          if(result.status === 'success'){
            $(location).attr('href','/config/branch/');
          }
        })
      })
    })
});


function branchView(bid){
  //$(location).attr('href','/config/branch/view/'+bid);
  $.get('/config/branch/view/' + bid).success(function(data){
    if(data){
      var raw = JSON.parse(data);
      $('#vbranchID').html(raw.branchID);
      $('#vbranchName').html(raw.branchName);
      //$('#vIPAddr').html(raw.bAddr);
      //$('#vStatus').html(raw.bStatus);  
      $('#viewbranch').modal('show');
    }
  })
}
function branchEdit(bid){
  $.get('/config/branch/view/' + bid).success(function(data){
    if(data){
      var raw = JSON.parse(data);
      $('#ebid').val(bid);
      $('#ebranchID').val(raw.branchID);
      $('#ebranchName').val(raw.branchName);
      //$('#eIPAddr').val(raw.bAddr);
      //$('#eStatus').val(raw.bStatus);  
      $('#editbranch').modal('show');
    }
  })
}
function branchDel(bid,bname){
  $('#abname').html("'" + bname + "'");
  $('#delbid').val(bid);
  $('#delbranch').modal('show'); 
}