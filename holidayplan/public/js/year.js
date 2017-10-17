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

  // Load the New Year Days Off form on button click.
  $("a[name='newyearform']").click(function(){
    displayForm();
  });

  function newYearForm() {
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
      if (!e.isDefaultPrevented()) {
        var formWrapper = $("#new-year-form");
        var avfreedays = formWrapper.find("input[name = 'avfreedays']").val();

        $.get(appConfig.url + appConfig.api + 'updateAllFreeDays?token=' + token + '&avfreedays=' + avfreedays, function (data) {
          out (data.code);
        });
      }
      e.preventDefault();
      $('#myModalOncePerYear').modal('hide');
    });
  }

  function prepareUserForm() {
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
      alert("din year");
      var avfreedays = formWrapper.find("input[name = 'avfreedays']").val();

      $.get(appConfig.url + appConfig.api + 'updateAllFreeDays?token=' + token + '&avfreedays=' + avfreedays, function (data) {
        out (data.code);
      });
    });
  };

  function displayForm(){
    $("#myModalOncePerYear").load("newyearform.html", function(){
      newYearForm();
      $('#myModalOncePerYear').modal('show');
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
