"use strict";
window.appNameSpace = window.appNameSpace || { };
window.sessionInvalid = false;
$(document).ready(function(){
  var token = sessionStorage.getItem('token');
  getHolidays();
})

function getHolidays(){
    $("#userTable").DataTable().clear();


    $.get(appConfig.url + appConfig.api + 'getFreeDaysApprover?token=' + token, function(data){
      if ( data.code == 110 ){
  			if (!appConfig.sessionInvalid) {
  				appConfig.sessionInvalid = true;
  				alert('Session expired');
          $.post(appConfig.url + appConfig.api+ 'logout', { email: theUser.email}).done(function( data ) {
         });
  				window.location.href = 'login.html';
  			}
  	}
    $("#userTable").DataTable().clear();
      var table = $('#userTable').DataTable();
      var j = 1;
      $("#userTable").DataTable().clear();
      for (var i=0; i<data.length; i++){
          if ( data[i].approved == 2) {
              var acc = 'Not approved';
          }
          else {
              var acc = 'Approved';
          }
        table.row.add( [
          j,
          data[i].name,
          data[i].days,
          moment(data[i].startDate).format("DD/MM/Y"),
          moment(data[i].endDate).format("DD/MM/Y"),
          data[i].type,
          data[i].comment,
          acc,
          data[i].isActive,
         // '<i class="fa fa-times" id="' + freeDays[i].id + '"></i>'
          '<div onclick="displayDeleteModal(event, this, ' + data[i].id + ',' + data[i].approved + ')"><i class="fa fa-times"</i></div>'
        ] ).draw( false )
        .nodes()
        .to$()
        .addClass();
        j++;
      }

    //   for (var k = 0;  k < freeDays.length; k++) {
    //       $(`#${freeDays[k].id}`).click(function(){
    //           console.log(freeDays[k].approved);
    //           displayDeleteModal(event, $(this), freeDays[i].id, freeDays[i].approved)
    //       });
    //   }
      for ( var i = 0 ; i < data.length; i++ ){
        var appr = $("#userTable>tbody>tr:nth-child("+(i+1)+")>td:nth-last-child(3)");
        var active = $("#userTable>tbody>tr:nth-child("+(i+1)+")>td:nth-last-child(2)");

        if ( appr.html() == "true" ){
          $("#userTable>tbody>tr:nth-child("+(i+1)+")").css('backgroundColor', "#d9edf7")
        }else{
          $("#userTable>tbody>tr:nth-child("+(i+1)+")").css('backgroundColor', "#f2dede")
        }

        if ( active.html() == "true" ){
          active.css('backgroundColor', "#d9edf7")
        }else{
          active.css('backgroundColor', "#f2dede")
        }
      }
    });
}
function displayDeleteModal(event, elem, id, approved){
    event.preventDefault();
    event.stopPropagation();
    var deleteModal =  $("#delete-modal");
	deleteModal.modal('show');
    // $("#delete-modal-btn-yes").addEventListener("click", function(){
    //     console.log('click');
    //     deleteHolidayModal(elem, id, approved);
    //     $("#delete-modal").modal('hide');
    // });

    $("#delete-modal-btn-yes").click(function(){
        console.log('click');
        deleteHolidayModal(elem, id, approved);
        $("#delete-modal").modal('hide');
    });
    $("#delete-modal-btn-no").click(function(){
        $("#delete-modal").modal('hide');
    });
}

function deleteHolidayModal(elem, id, approved){
    console.log(elem);
    if (approved != 1) {
        $.post(appConfig.url + appConfig.api+ 'deleteHoliday?token=' + token, { id: id}).done(function( data ) {
            //$(elem).addClass("test");
            //$(elem).parent().parent().slideUp("slow");

            $("#userTable").DataTable().clear();
            getHolidays();
        });
    }
    else {
        alert("You can not delete this. Please contact your manager.");
    }
}
