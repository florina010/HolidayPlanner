$(document).ready(function() {
    var theUser = JSON.parse(sessionStorage.getItem('user')),
        token = sessionStorage.getItem('token');

    if (theUser.admin == 2) {
        var ldate = moment();
        var date = ldate.format();
        var year = moment().year();
        var today = new Date().getFullYear();
        var id;

        function checkYear() {
            $.get(appConfig.url + appConfig.api + 'selectLastYear?token=' + token + '&year=' + year, function(data) {
                if ((data.length == 0) || (today > data[0].year)) {
                    displayForm();
                    $.get(appConfig.url + appConfig.api + 'getLastYear?token=' + token + '&year=' + today, function(data) {
                        out(data.code);
                    });

                    $.get(appConfig.url + appConfig.api + 'legalHolidaysToDb', function(data) {
                        out(data.code);
                    });
                };
            });
        };
        checkYear();
    };

    // Load the New Year Days Off form on button click.
    $("a[name='udpateinfo']").click(function() {
        displayFormClick();
    });

    function newYearForm() {
        //New year update
        var date = new Date();
        date.setDate(date.getDate());
        $('#stholi').datepicker({
            format: 'yyyy-mm-dd'
        }).on('changeDate', function(e) {
            $('#new-year-form').formValidation('revalidateField', 'stholi');
        });

        $("#new-year-form").formValidation({
            framework: 'bootstrap',
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {}
        }).on('submit', function(e, data) {
            if (!e.isDefaultPrevented()) {
                var formWrapper = $("#new-year-form");
                var avfreedays = formWrapper.find("input[name = 'avfreedays']").val();
                var name = formWrapper.find("input[name ='newholiday']").val();
                var startDate = formWrapper.find("input[name = 'stholi']").val();
                $.get(appConfig.url + appConfig.api + 'updateAllFreeDays?token=' + token + '&avfreedays=' + avfreedays, function(data) {
                    out(data.code);
                });
            };
            e.preventDefault();
            $('.modal-body> div:first-child').css('display', 'block');
            $('#myModalOncePerYear').modal('hide');
        });
    };

    function newHolidayForm() {
        //New holiday update
        var date = new Date();
        date.setDate(date.getDate());
        $('#stholi').datepicker({
            format: 'yyyy-mm-dd'
        }).on('changeDate', function(e) {
            $('#new-year-form').formValidation('revalidateField', 'stholi');
        });

        $("#new-year-form").formValidation({
            framework: 'bootstrap',
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
              newholiday: {
                  validators: {
                      notEmpty: {
                          message: 'This is required'
                      }
                  }
              },
              stholi: {
                  validators: {
                      notEmpty: {
                          message: 'The start date is required'
                      }
                  }
              }
            }
        }).on('submit', function(e, data) {
            if (!e.isDefaultPrevented()) {
                var formWrapper = $("#new-year-form");
                var name = formWrapper.find("input[name ='newholiday']").val();
                var startDate = formWrapper.find("input[name = 'stholi']").val();

                $.get(appConfig.url + appConfig.api + 'getNewHoliday?token=' + token + '&startDate=' + startDate + '&name=' + name, function(data) {
                    out(data.code);
                });
                  $('#myModalOncePerYear').modal('hide');
            }
            e.preventDefault();
        });
        getAllHolidays();
        deleteLegalHoliday();
    };
    var id;

    function updateHolidayForm() {
        //Update holidays
        var date = new Date();
        date.setDate(date.getDate());
        $('#stholi').datepicker({
            format: 'yyyy-mm-dd'
        }).on('changeDate', function(e) {
            $('#edit-holiday-form').formValidation('revalidateField', 'stholi');
        });

        $("#edit-holiday-form").formValidation({
            framework: 'bootstrap',
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                stholi: {
                    validators: {
                        date: {
                            format: 'YYYY-MM-DD',
                            message: 'The value is not a valid date'
                        }
                    }
                },
            }
        }).on('submit', function(e, data) {
            if (!e.isDefaultPrevented()) {
                var formWrapper = $("#edit-holiday-form");
                var name = formWrapper.find("input[name ='name']").val();
                var type = formWrapper.find("input[name ='typeh']").val();
                var startDate = formWrapper.find("input[name = 'stholi']").val();
                $.get(appConfig.url + appConfig.api + 'updateAllHolidays?token=' + token + '&id=' + id + '&startDate=' + startDate + '&name=' + name + '&type=public', function(datah) {});
            }
            e.preventDefault();
            $('.modal-body> div:first-child').css('display', 'block');
            setTimeout(function() {
                $('#myModalOncePerYear').modal('hide');
            }, 1000);

        });
    };

    function getAllHolidays() {
      $.ajax({
               type: 'GET',
               url: appConfig.url + appConfig.api + 'getAllHolidays?token=' + token,
               success: function(data){
                 var holidaytable = $('#example').DataTable();
                    var j = 1;
                    for (var i = 0; i < data.length; i++) {
                        holidaytable.row.add([
                            j,
                            moment(data[i].startDate).format("YYYY-MM-DD"),
                            data[i].name,
                            data[i].type
                        ]).draw(false);
                        j++;
                    };
                    $('#example tbody').on('click', 'tr', function() {
                        id = $(this).find("td:nth-child(1)").html();
                        var data = $(this).find("td:nth-child(2)").html();
                        var name = $(this).find("td:nth-child(3)").html();
                        var type = $(this).find("td:nth-child(4)").html();
                         displayFormOnUpdateClick(id, name, data, type);
                      });
              },
               async:false
          });
    };

    function prepareUserForm() {
        //New year update
        var date = new Date();
        date.setDate(date.getDate());
        $('#stholi').datepicker({
            endDate: date,
            format: 'yyyy/mm/dd'
        }).on('changeDate', function(e) {
            $('#new-year-form').formValidation('revalidateField', 'stholi');
        });

        $("#new-year-form").formValidation({
            framework: 'bootstrap',
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {}
        }).on('submit', function(e, data) {
            var formWrapper = $("#new-year-form");
            var avfreedays = formWrapper.find("input[name = 'avfreedays']").val();
            var name = formWrapper.find("input[name ='newholiday']").val();
            var startDate = formWrapper.find("input[name = 'stholi']").val();

            $.get(appConfig.url + appConfig.api + 'updateAllFreeDays?token=' + token + '&avfreedays=' + avfreedays, function(data) {
                out(data.code);
            });

            $.get(appConfig.url + appConfig.api + 'getNewHoliday?token=' + token + '&startDate=' + startDate + '&name=' + name, function(data) {
                out(data.code);
            });

        });
    };

    function displayForm() {
        $('#myModalOncePerYear').modal({
            backdrop: 'static',
            keyboard: false
        });

        $("#myModalOncePerYear").load("newyearform.html", function() {
            newYearForm();
            $('#myModalOncePerYear').modal('show');

        });
    };

    function displayFormClick() {
        $("#myModalOncePerYear").load("updateinfo.html", function() {
            newHolidayForm();
            $('#myModalOncePerYear').modal('show');
        });
    };

    function displayFormOnUpdateClick(id, name, data, type) {
        $("#myModalOncePerYear").load("editholiday.html", function() {
            $("#nume").val(name);
            $("#type").val(type);
            $("div > #dateval").val(data);
            updateHolidayForm();
            $('#myModalOncePerYear').modal('show');
        });
    };

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
    };
var holidayId;
    function deleteLegalHoliday(){
      $.ajax({
               type: 'GET',
               url: appConfig.url + appConfig.api + 'getAllHolidays?token=' + token,
               success: function(data){
                 console.log(data);
                    $('#example tbody').on('click', 'tr', function() {
                      holidayId = $(this).find("td:nth-child(1)").html();
                        console.log(holidayId);
                        $.post(appConfig.url + appConfig.api + 'deleteLegalHoliday?token=' + token, {
                            id: holidayId,
                        }).done(function(data) {

                        });
                    });
              },
               async:false
          });
    }
});
