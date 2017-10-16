$(document).ready( function () {
  var theUser = JSON.parse(sessionStorage.getItem('user')),
      token = sessionStorage.getItem('token');

if(theUser.admin == 2) {
    var ldate = moment();
    var date = ldate.format();
    var year = moment().year();

    function checkYearSetup(){
            $.get(appConfig.url + appConfig.api + 'getLastSetup?token=' + token + '&lastDate=' + date + '&year=' + year, function (data) {
                out(data.code);
                if(ldate.year() == year){
                    displayForm();
                };
            });
        };
    checkYearSetup();
};

function prepareUserForm() {
  var date = new Date();
  date.setDate(date.getDate()-1);
  $('#stwork').datepicker({
    endDate: date,
    format: 'yyyy/mm/dd'
  }).on('changeDate', function(e) {
    $('#add-user-form').formValidation('revalidateField', 'stwork');
  });

  //New year update
  $("#new-year-form").formValidation({
    framework: 'bootstrap',
    icon: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
    }
  }).on('submit', function(e, data) {
    var formWrapper = $("#new-year-form");
    var avfreedays = formWrapper.find("input[name = 'avfreedays']").val();

    $.get(appConfig.url + appConfig.api + 'updateAllFreeDays?token=' + token + '&avfreedays=' + avfreedays, function (data) {
      out (data.code);
    });
  });
};

function displayForm(){
  $("#result").load("newyearform.html", function(){
      prepareUserForm();
  });
};

function out (data) {
      if ( data == 110 ){
          if (!appConfig.sessionInvalid) {
              appConfig.sessionInvalid = true;
              alert('Session expired');
              $.post(appConfig.url + appConfig.api+ 'logout', { email: theUser.email});
              window.location.href = 'login.html';
          }
      }
};

});
