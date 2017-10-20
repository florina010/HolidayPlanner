"use strict";
window.appNameSpace = window.appNameSpace || { };
window.sessionInvalid = false;

function weekend(d1,d2){
  var we = 0,
      days = d2.diff(d1,"days") + 1;
  while (d1 <= d2){
      if (d1.days() == 0 || d1.days() == 6){
          we++;
      }
      d1.add(1,"days");
  }
  return days-we;
}

$('#tabClickCalendar').click(function(){
  setTimeout(function(){
    $("#calendar").empty();
    reloadJs('../js/calendar.js');
  }, 400);
});

$(document).ready( function () {

    $('.date').datepicker({
        multidate: 2,
        multidateSeparator: ";",
        toggleActive: true,
        startDate: new Date(),
        clearBtn: true,
        minViewMode: 0
    });


    var commentEn = 0;
    $('#tabClick').addClass('active');
    var theUser = JSON.parse(sessionStorage.getItem('user')),
      token = sessionStorage.getItem('token'),
      currentDate = moment(),
      sum = 0, manager, manId, dates = new Array(), isOk = true;


  $('#fileupload').fileupload({
      url: appConfig.url + appConfig.api + 'upload',
      formData: {
        id: theUser.userID,
        token: token
      },
      dataType: 'json',
      done: function (e, data) {
          $.each(data.result.files, function (index, file) {
              $('<p/>').text(file.name).appendTo('#files');
          });
          theUser.picture = data.result;
          sessionStorage.setItem('user', JSON.stringify(theUser));
          $("#avatar").attr("src", 'data:image/png;base64,'+ theUser.picture);
      }
  });

//file upload

  if ( theUser != null ) {
    $.post(appConfig.url + appConfig.api, { id: theUser.userID }).done(function( data ) {
      if (data.length != 0) {
        manager = data[0].name;
        manId = data[0].userID;
      }
      else {
        manager = 'admin';
        manId = 1;
      }
      $.get(appConfig.url + appConfig.api + 'getFreeDays?token=' + token + '&userID=' + theUser.userID, function (data) {
          out (data.code);
          $("[name=mName]").val(manager);
          $("#avatar").attr("src", 'data:image/png;base64,'+ theUser.picture);
          $("[name=name]").val(theUser.name);
          var yearOfBirth = moment().diff(theUser.age, 'years', false);
          $("[name=age]").val(yearOfBirth);
          $("[name=email]").val(theUser.email);
          $("[name=phone]").val(theUser.phone);
          $("[name=position]").val(theUser.position);
          var fDate = moment(theUser.startDate).format("YYYY/MM/DD");
          $("[name=sDate]").val(fDate);
          $("[name=timeSpent]").val(moment().diff(theUser.startDate, 'months',false) + " months");
          window.theUser = theUser;

          if(data.length == 0 ) {
            sum = 0;
          }
          else {
            for (var i = 0; i < data.length; i++){
                if ( data[i].approved == true )
                  sum += data[i].days;
          }
        }

          // var work = moment().diff(theUser.startDate, 'months', false);
          //
          // var restM = 12 - currentDate.month();
          // if ( work < 12 ){
          //     $("[name=avDays]").val(Math.floor(21/12*restM - sum));
          // };
          //
          //
          // if (currentDate.month() == 0 && currentDate.date() == 1 ) {
          //   $("[name=avDays]").val(parseInt($("[name=avDays]").val()) + 21 + theUser.bonus);
          // }

          if (theUser.avfreedays <= 0)
          {
    		    $("[name=avDays]").val(0);
            $("#holiday").css("display", 'none');
            theUser.avfreedays = $("[name=avDays]").val();
          };

          sessionStorage.setItem('user', JSON.stringify(theUser));
          $.get(appConfig.url + appConfig.api + 'updateFreeDays?token=' + token + '&userEmail=' + theUser.email + '&avfreedays=' + $("[name=avDays]").val(), function (data) {
            out (data.code);
          });
        });
      });
    }

    else {
      alert("No user loged in!");
      window.location.href = "login.html";
    }

    if ( sessionStorage.getItem('admin') != null ) {
        $('#navbar1 ul:first-of-type > li:nth-child(2)').css('display', 'block');
     // $('#navbar1 .navbar-nav li:nth-child(2)').css('display', 'block');
      var li = $("<li></li>"),
          a = $("<a data-toggle='tab' href='#management'></a>"),
          i = $("<i class='fa fa-pencil-square-o' aria-hidden='true'> Management</i>"),
          div =$("<div id='management' class='tab-pane fade'></div>"),
          table = $("<table id='manager-table' class='table display' cellspacing='0' width='100%'></table>"),
          thead = $("<thead class='thead-inverse'></thead>"),
          tr = $("<tr></tr>"),
          th = $("<th>#</th>"),
          thN = $("<th>Name</th>"),
          thP = $("<th>Position</th>"),
          thE = $("<th>Email</th>"),
          thD = $("<th>Start Date</th>"),
          thDa = $("<th>End Date</th>"),
          thDy = $("<th>Days</th>"),
          thTy = $("<th>Type</th>"),
          thCo = $("<th>Comment</th>"),
          thAf = $("<th>Free days</th>"),
          thAd = $("<th>Approved</th>"),
          thAp = $("<th>Approve</th>");
      $(tr).append($(th));
      $(tr).append($(thN));
      $(tr).append($(thP));
      $(tr).append($(thE));
      $(tr).append($(thD));
      $(tr).append($(thDa));
      $(tr).append($(thDy));
      $(tr).append($(thTy));
      $(tr).append($(thCo));
      $(tr).append($(thAf));
      $(tr).append($(thAd));
      $(tr).append($(thAp));
      $(thead).append($(tr));
      $(table).append($(thead));
      $(div).append($(table));
      $(".tab-content").append($(div));
      $(a).append($(i)),
      $(li).append($(a));
      $("#tabs").append($(li));

     var li = $("<li></li>"),
          a = $("<a data-toggle='tab' href='#users-list' name='userst'></a>"),
          i = $("<i class='fa fa-pencil-square' aria-hidden='true'> Managed Users</i>"),
          div =$("<div id='users-list' class='tab-pane fade'></div>"),
          table = $("<table id='users-list-table' class='table display' cellspacing='0' width='100%'></table>"),
          thead = $("<thead class='thead-inverse'></thead>"),
          tr = $("<tr></tr>"),
          th = $("<th>#</th>"),
          thN = $("<th>Name</th>"),
          thP = $("<th>Position</th>"),
          thE = $("<th>Email</th>"),
          thD = $("<th>Start Date</th>"),
      thPh = $("<th>Phone</th>"),
      thM = $("<th>Manager</th>"),
      thAc = $("<th>Active</th>"),
      thAg = $("<th>Age</th>"),
      thBo = $("<th>Bonus</th>"),
      thAct = $("<th>Actions</th>");
      $(tr).append($(th));
      $(tr).append($(thN));
      $(tr).append($(thP));
      $(tr).append($(thE));
      $(tr).append($(thD));
      $(tr).append($(thPh));
      $(tr).append($(thM));
      $(tr).append($(thAc));
      $(tr).append($(thAg));
      $(tr).append($(thBo));
      $(tr).append($(thAct));
      $(thead).append($(tr));
      $(table).append($(thead));
      $(div).append($(table));
      $(".tab-content").append($(div));
      $(a).append($(i)),
      $(li).append($(a));
      $("#tabs").append($(li));
    }

    if (theUser.admin == 2) {
        $("[name=userst]").parent().addClass('active');
        $("[name=userst]").attr('aria-expanded', true);
        $("#users-list").addClass('active in');
        $("[name=add]").parent().css('display', 'none');
        $("[name=addUser]").parent().css('display', 'block');
        $("#tabs li:not(:last)").css('display', 'none');
        $("#calendar").css('display', 'none');
        $("[name=mName]").val('admin');
        $("[name=avDays]").val(0);
    }
    else if (theUser.admin != 2) {
        $("#forAdmin").css("display", 'none');
        $("#holiday").css('display', 'block');
        $("[name=addUser]").parent().css('display', 'block');
        $("#newyear").css("display", 'none');
    }

    if (theUser.admin == 0) {
        $("[name=addUser]").css('display', 'none');
    }

    $('#logout').click( function () {
      sessionStorage.clear();
      window.location.href = "login.html";

    });
    var date = new Date();
    date.setDate(date.getDate());


     $('#myModal').on('hidden.bs.modal', function () {
         $('#eventForm').bootstrapValidator('resetForm', true);
         $(this).find("input,textarea,select").val('').end();
         $('#myModal').find('form')[0].reset();
         $("#eventForm").data('formValidation').resetForm();
         $('.modal-body> div:first-child').css('display','none');
         $('.modal-body> div:nth-child(2)').css('display','none');
         $('.modal-body> div:nth-child(3)').css('display','none');
     });


     $('#startDatePicker')
           .datepicker({
               startDate: date,
               format: 'yyyy/mm/dd'
           })
           .on('changeDate', function(e) {
               // Revalidate the start date field
               $('#eventForm').formValidation('revalidateField', 'startDate');
           });

     $('#endDatePicker')
         .datepicker({
             startDate: date,

             format: 'yyyy/mm/dd'
         })
         .on('changeDate', function(e) {
             $('#eventForm').formValidation('revalidateField', 'endDate');
         });


         $('#eventForm')
             .formValidation({
                 framework: 'bootstrap',
                 icon: {
                     valid: 'glyphicon glyphicon-ok',
                     invalid: 'glyphicon glyphicon-remove',
                     validating: 'glyphicon glyphicon-refresh'
                 },
                 fields: {
                     vacationtype: {
                         validators: {
                             notEmpty: {
                                 message: 'The type is required'
                             }
                         }
                     },

                     comment: {
                         validators: {
                             notEmpty: {
                                 enabled: false,
                                 message: 'The comment is required'
                             }
                         }
                     },
                 }
             }).on('success.field.fv', function(e, data) {
                 e.preventDefault();
                 switch ($("[name=comment]").attr('name')) {
                     case 'comment':
                        if ($("#vacationtype").val() == 'Other') {
                            data.fv.enableFieldValidators('comment', true);
                            commentEn = 1;
                            break;
                        }
                        break;
                    default:
                        break;
                    }
             }).on('submit', function(e, data) {
               if (!e.isDefaultPrevented()) {
                   var date = $(".date").val().split(";"),
                        stdate = date[0],
                        enddate = date[1];

                   var from, to, duration;
                   from = moment(stdate, 'MM/DD/YYYY').format('YYYY/MM/DD');
                   if (!enddate){
                       to =  moment(stdate, 'MM/DD/YYYY').format('YYYY/MM/DD');
                   }
                   else {
                       to = moment(enddate, 'MM/DD/YYYY').format('YYYY/MM/DD');
                   }

                   duration = weekend(moment(from), moment(to));
                 //  let myDate:Date = moment(dateString,"YYYY-MM-DD").format("DD-MM-YYYY");
                   if ($('#vacationtype').val() =='Other'){
                       duration = 0;
                   }
                   //$.post(appConfig.url + appConfig.api+ 'getManagerDetails', { managerId: manId}).done(function( data ) {
       						 //});

                   var holidayOptions = {
                       managerName: manager,
                       manag: manId,
                       vacationtype: $("#vacationtype").val(),
                       comment: $("#comment").val(),
                       avDays: theUser.avfreedays,
                       stdate: from,
                       enddate: to,
                       duration: duration
                   }

                   check(from, to, holidayOptions, addHoliday);


          }
        });

        $('#logout').click( function (e) {
          $.post(appConfig.url + appConfig.api+ 'logout', { email: theUser.email}).done(function( data ) {
         });
       });

       function getFreeDays() {
           $.get(appConfig.url + appConfig.api + 'legalFreeHolidays', function (data) {
               for (var i = 0; i < data.length; i++){
                   if (data[i].type == 'public') {
                       dates.push(moment(data[i].date).format("YYYY/MM/DD"));
                   }
               }
           });
       };

       function addHoliday(options) {
         console.log(options.avDays);
         console.log(options.duration);
           if (options.avDays >= options.duration) {
               $.get(appConfig.url + appConfig.api + 'updatedate?token=' + token, {
                   vacationtype: options.vacationtype,
                   comment: options.comment,
                   stdate: moment(options.stdate).format("YYYY/MM/DD"),
                   enddate: moment(options.enddate).format("YYYY/MM/DD"),
                   userID: theUser.userID,
                   days: options.duration,
                   approverID: options.manag
               }, function( data ) {
                   out (data.code);
                   // Insert event into calendar.
                   var event = {
                     title: 'pending: ' + options.comment,
                     start:  moment(options.stdate).format("YYYY-MM-DD"),
                     end:  moment(options.enddate).format("YYYY-MM-DD"),
                   };
                   $('#calendar').fullCalendar( 'renderEvent', event, true);

                   e.preventDefault();
                   $('#myModal').find('form')[0].reset();
                   $("#eventForm").data('formValidation').resetForm();
               });
               $('.modal-body> div:first-child').css('display','block');
               $('.modal-body> div:nth-child(2)').css('display','none');
               $('.modal-body> div:nth-child(3)').css('display','none');
           } else {
             $('.modal-body> div:first-child').css('display','none');
             $('.modal-body> div:nth-child(2)').css('display','block');
             $('.modal-body> div:nth-child(3)').css('display','none');
             isOk = false;
           }

           $('#myModal').find('form')[0].reset();
           $("#eventForm").data('formValidation').resetForm();
           $('#calendar').empty();
           reloadJs('../js/calendar.js');
       }

      function check(startString, endString, options, callback) {
          getFreeDays();
          var start = moment(startString).format("YYYY/MM/DD"),
              end = moment(endString).format("YYYY/MM/DD");
          $.get(appConfig.url + appConfig.api + 'getFreeDays?token=' + token + '&userID=' + theUser.userID, function (data) {
              out(data.code);

              if(data.length > 0 ) {
                  for (var i = 0; i < data.length; i++) {
                      var st = moment(data[i].startDate).format("YYYY/MM/DD"),
                        ends = moment(data[i].endDate).format("YYYY/MM/DD"),
                        start2 = start, end2 = end,
                        dateArray = new Array();
                      if ( moment(start).isBetween(st,ends) || moment(end).isBetween(st,ends) || start == st || start == ends || end == st || end == ends || start > end) {
                          $('.modal-body> div:first-child').css('display','none');
                          $('.modal-body> div:nth-child(2)').css('display','none');
                          $('.modal-body> div:nth-child(3)').css('display','block');
                          $('#myModal').find('form')[0].reset();
                          $("#eventForm").data('formValidation').resetForm();
                         // $('#myModal').modal('toggle');
                          isOk = false;
                          break;
                      }
                      while (start2 <= end2) {
                          dateArray.push(start2);
                          var duration = moment.duration({'days' : 1});
                          start2 = moment(start2, "YYYY/MM/DD").add(duration).format('YYYY/MM/DD');
                      }
                      for (var j = 0; j < dateArray.length; j++) {
                          if (dateArray[j] == st || dateArray[j] == ends) {
                              $('.modal-body> div:first-child').css('display','none');
                              $('.modal-body> div:nth-child(2)').css('display','none');
                              $('.modal-body> div:nth-child(3)').css('display','block');
                              $('#myModal').find('form')[0].reset();
                              $("#eventForm").data('formValidation').resetForm();
                             // $('#myModal').modal('toggle');
                              isOk = false;
                              break;
                          }
                      }
                  }

                options.duration = checkArrays (dateArray, dates, options.duration);
                  if (isOk) {
                      callback(options);
                  }
              } else {
                  callback(options);
              }

              if (data.length > 0 && isOk){
                 var dataId = data[0].id ;
                 var tr = $("<tr>");
                 tr.addClass("danger");
                 var index = parseInt($("#userTable tbody tr").last().find("td").first().text()) + 1;
                 tr.append("<td class='sorting_1'>"+ index +"</td>").css("backgroundColor", "rgb(242, 222, 222)");
                 tr.append("<td>" + options.managerName +"</td>");
                 tr.append("<td>" + options.duration + "</td>");
                 tr.append("<td>"+  moment(options.stdate).format("DD/MM/YYYY") +"</td>");
                 tr.append("<td>"+ moment(options.enddate).format("DD/MM/YYYY") +"</td>");
                 tr.append("<td>"+ options.vacationtype +"</td>");
                 tr.append("<td>"+ options.comment +"</td>");
                 tr.append("<td>" + 0 + "</td>");
                 tr.append("<td>" + 0 + "</td>");
                 tr.append("<td>"+ '<i class="fa fa-times" onclick="deleteHolidayModal(this,'+ dataId +')"></i>' +"</td>");
                 $("#userTable tbody").append(tr);
             }else if(data.length == 0 && isOk){
              $(".dataTables_empty").css("display", "none");
                var tr = $("<tr>");
                tr.addClass("danger");
                var index = parseInt($("#userTable tbody tr").last().find("td").first().text());
                tr.append("<td class='sorting_1'>"+ 1 +"</td>").css("backgroundColor", "rgb(242, 222, 222)");
                tr.append("<td>" + options.managerName +"</td>");
                tr.append("<td>" + options.duration + "</td>");
                tr.append("<td>"+  moment(options.stdate).format("DD/MM/YYYY") +"</td>");
                tr.append("<td>"+ moment(options.enddate).format("DD/MM/YYYY") +"</td>");
                tr.append("<td>"+ options.vacationtype +"</td>");
                tr.append("<td>"+ options.comment +"</td>");
                tr.append("<td>" + 0 + "</td>");
                tr.append("<td>" + 0 + "</td>");
                tr.append("<td>"+ '<i class="fa fa-times" onclick="deleteHolidayModal(this,'+ 0 +')"></i>' +"</td>");
                $("#userTable tbody").append(tr);
              }
          });
      }

      function checkArrays (arr1, arr2, options) {
       for(var l = 0; l < arr1.length; l++) {
           for(var d = 0; d < arr2.length; d++) {
               if (arr1[l] == arr2[d]) {
                   options--;
               }
           }
       }
       return options;
   }

   function out (data) {
       if ( data == 110 ){
           if (!appConfig.sessionInvalid) {
               appConfig.sessionInvalid = true;
               alert('Session expired');
               $.post(appConfig.url + appConfig.api+ 'logout', { email: theUser.email});
               window.location.href = 'login.html';
           }
       }
   }

   $("#close").click(function(){
     location.reload();
   });
   $(".close").click(function(){
     location.reload();
   });
    $("#save").click(function(){
        if (commentEn == 0) {
            setTimeout(function(){
                location.reload();
            },1000);
        }
        else if ($('[name=comment]').val() && commentEn == 1) {
            setTimeout(function(){
                location.reload();
            },1000);
        }
    });
});
