$(document).ready( function () {
  var theUser = JSON.parse(sessionStorage.getItem('user')),
  token = sessionStorage.getItem('token');

  if(theUser.admin == 2) {
    var ldate = moment();
    var date = ldate.format();
    var year = moment().year();
    var today = new Date().getFullYear();
    var id;
    function checkYear(){
      $.get(appConfig.url + appConfig.api + 'selectLastYear?token=' + token + '&year=' + year, function (data) {
        if((data.length == 0) || (today > data[0].year)){
          displayForm();
          $.get(appConfig.url + appConfig.api + 'getLastYear?token=' + token + '&year=' + today, function (data) {
            out(data.code);
          });
          $.get(appConfig.url + appConfig.api + 'legalHolidaysToDb', function (data) {
            out(data.code);
          });
        };
      });
    };
    checkYear();
   };

  // Load the New Year Days Off form on button click.
  $("a[name='udpateinfo']").click(function(){
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
      fields: {
      }
    }).on('submit', function(e, data) {
      if (!e.isDefaultPrevented()) {
        var formWrapper = $("#new-year-form");
        var avfreedays = formWrapper.find("input[name = 'avfreedays']").val();
        var name = formWrapper.find("input[name ='newholiday']").val();
        var startDate = formWrapper.find("input[name = 'stholi']").val();

        $.get(appConfig.url + appConfig.api + 'updateAllFreeDays?token=' + token + '&avfreedays=' + avfreedays, function (data) {
          out (data.code);
        });
      };
      e.preventDefault();
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
      }
    }).on('submit', function(e, data) {
      if (!e.isDefaultPrevented()) {
        var formWrapper = $("#new-year-form");
        var name = formWrapper.find("input[name ='newholiday']").val();
        var startDate = formWrapper.find("input[name = 'stholi']").val();

        $.get(appConfig.url + appConfig.api + 'getNewHoliday?token=' + token + '&startDate=' + startDate + '&name=' + name, function (data) {
          out(data.code);
        });
      }
      e.preventDefault();
      $('#myModalOncePerYear').modal('hide');
    });
      getAllHolidays();
  };

  function updateHolidayForm(){
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
      }
    }).on('submit', function(e, data) {
      if (!e.isDefaultPrevented()) {
        var formWrapper = $("#edit-holiday-form");
        var name = formWrapper.find("input[name ='name']").val();
        var type = formWrapper.find("input[name ='typeh']").val();
        var startDate = formWrapper.find("input[name = 'stholi']").val();

        $.get(appConfig.url + appConfig.api + 'updateAllHolidays?token=' + token + '&id='+ id +'&startDate='+ startDate + '&name=' + name + '&type=public' , function (datah) {
          //out (data.code);
        });
      }
      e.preventDefault();
      $('#myModalOncePerYear').modal('hide');
    });
  };

  function getAllHolidays () {
   $.get(appConfig.url + appConfig.api + 'getAllHolidays?token='+token, function (data) {
     out (data.code);
     var holidaytable = $('#example').DataTable();
     var j = 1;
     for ( var i= 0; i < data.length; i++ ){
       holidaytable.row.add( [
         j,
         moment(data[i].startDate).format("DD/MM/YYYY"),
         data[i].name,
         data[i].type
       ] ).draw( false );
       j++;
     };

     $('#example tbody tr').click( function() {
          var str = $(this).text();
          id = parseInt(str[0]);
          var datahol= str.slice(1,11);
          var nume = str.slice(11);
         displayFormOnUpdateClick();
     });
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
      fields: {
      }
    }).on('submit', function(e, data) {
      var formWrapper = $("#new-year-form");
      alert("din year");
      var avfreedays = formWrapper.find("input[name = 'avfreedays']").val();
      var name = formWrapper.find("input[name ='newholiday']").val();
      var startDate = formWrapper.find("input[name = 'stholi']").val();

      $.get(appConfig.url + appConfig.api + 'updateAllFreeDays?token=' + token + '&avfreedays=' + avfreedays, function (data) {
        out (data.code);
      });

      $.get(appConfig.url + appConfig.api + 'getNewHoliday?token=' + token + '&startDate=' + startDate + '&name=' + name, function (data) {
        out(data.code);
      });

    });
  };

  function displayForm(){
    $('#myModalOncePerYear').modal({
      backdrop: 'static',
      keyboard: false
    });

    $("#myModalOncePerYear").load("newyearform.html", function(){
      newYearForm();
      $('#myModalOncePerYear').modal('show');

    });
  };

  function displayFormClick(){
    $("#myModalOncePerYear").load("updateinfo.html", function(){
      newHolidayForm();
      $('#myModalOncePerYear').modal('show');
    });
  };

  function displayFormOnUpdateClick(){
    $("#myModalOncePerYear").load("editholiday.html", function(){
      updateHolidayForm();
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
