"use strict";
window.appNameSpace = window.appNameSpace || {};
window.sessionInvalid = false;
$(document).ready(function() {
    var token = sessionStorage.getItem('token');
    getHolidays();
});

function getHolidays() {
    $("#userTable").DataTable().clear();
    $.get(appConfig.url + appConfig.api + 'getFreeDaysApprover?token=' + token, function(data) {
        $("#userTable").DataTable().clear();
        out(data.code);

        var table = $('#userTable').DataTable({
            "aoColumnDefs": [{
                bSortable: false,
                aTargets: [-1]
            }],
            "columnDefs": [{
                orderable: false,
                targets: -1
            }],
            "bDestroy": true,
        });
        var j = 1;
        for (var i = 0; i < data.length; i++) {
            var colorClass = colorTableRow(data[i].approved);
            if (data[i].approved == 2) {
                var acc = 'Not approved';
            } else if (data[i].approved == 1) {
                var acc = 'Approved';
            } else {
                var acc = 'Pending'
            }
            table.row.add([
                    j,
                    data[i].name,
                    data[i].days,
                    moment(data[i].startDate).format("DD/MM/YYYY"),
                    moment(data[i].endDate).format("DD/MM/YYYY"),
                    data[i].type,
                    '<div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">'+ data[i].comment+ "</div>",
                    acc,
                    '<div onclick="displayDeleteModal(event, this, ' + data[i].id + ',' + data[i].approved + ')"><i class="fa fa-times"</i></div>'
                ]).draw(false)
                .nodes()
                .to$()
                .addClass(colorClass);
            j++;
        }
    });
}

function colorTableRow(approved) {
    if (approved == true) {
        return "info";
    } else {
        return "danger";
    }
};

function displayDeleteModal(event, elem, id, approved) {
    var deleteModal = $("#delete-modal");
    deleteModal.modal('show');


    $("#delete-modal-btn-yes").one('click', function() {
        event.stopPropagation();
        deleteHolidayModal(elem, id, approved);
        var events = ($("#calendar").fullCalendar( 'getEventSources' ));
        for(var i = 0; i < events[0]['rawEventDefs'].length; i++) {
            if (events[0]['rawEventDefs'][i]['id'] == id) {
                events[0]['rawEventDefs'].splice(i,1);
                $("#calendar").fullCalendar('removeEvents');
                $("#calendar").fullCalendar( 'addEventSource', events[0]['rawEventDefs'])
            }
        }
        $("#delete-modal").modal('hide');
    });
    $("#delete-modal-btn-no").click(function() {
        $("#delete-modal").modal('hide');
    });
}

function deleteHolidayModal(elem, id, approved) {
    if (approved == 0) {
        $.post(appConfig.url + appConfig.api + 'deleteHoliday?token=' + token, {
            id: id
        }).done(function(data) {
            $("#userTable").DataTable().clear();
            getHolidays();
        //    $("#calendar").fullCalendar( 'removeEventSource', id )
        });
    } else {
        alert("You can not delete this. Please contact your manager.");
        return;
    }
}

function out(data) {
    if (data == 110) {
        if (!appConfig.sessionInvalid) {
            appConfig.sessionInvalid = true;
            alert('Session expired');
            $.post(appConfig.url + appConfig.api + 'logout', {
                email: theUser.email
            });
            window.location.href = 'login.html';
        }
    }
}
