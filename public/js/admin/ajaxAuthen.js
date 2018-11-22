$(document).ready(function () {
  // SUBMIT FORM
  $("#login").click(function () {
    ajaxPost();
  });

  function ajaxPost() {
    // PREPARE FORM DATA
    var formData = {
      account: $("#idAccount").val(),
      password: $("#idPassword").val()
    }
    // DO POST
    $.post('/admin/login', formData, function (response) {
      console.log("data:", response);
      if (response.mess == 'ok') window.location = "/admin/manager";
      else if (response.mess == 'fail') {
        $("#error").show();
      }
    })
  }
})