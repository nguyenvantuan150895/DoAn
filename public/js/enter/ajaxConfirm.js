$(document).ready(function() {
    // slidereveal
    $('#slider').slideReveal({
      trigger: $("#btnShort"),
      position: "right",
      push: false,
      // width: 300,
      overlay: true,
      autoEscape: false,
    });

    //date picker
    $(".datepicker").datepicker();
        $('.fa-calendar').click(function() {
        $("#datepicker").focus();
    });

    // call ajax
    $("#save").click(() => {
        let name = $("#idname").val();
        let oldUrl = $("#idoldUrl").val();
        let email = $("#idemail").val();
        let sms = $("#idsms").val();
        let other = $("#idother").val();
        let start = $("#idstart").val();
        let end = $("#idend").val();
        let fbArr = $('.fb').map(function() {
            return this.value;
        }).get();
        let groupArr = $('.group').map(function() {
            return this.value;
        }).get();
        let ob_fb = {};
        //for( let j = 0; fbArr.le)
        let ob_data = {name: name, oldUrl: oldUrl, email: email, sms: sms, other: other, fbArr: fbArr, groupArr: groupArr, start: start, end: end};
        
        $.post("/enterprise/confirm", ob_data)
        .done(function(customer){
            if(customer.state == "ok"){
              alert("Success!");
            } else if(customer.state == "fail"){
                if(customer.err_campaign)alert("Name campaign already  exists!");
                else if(customer.err_dup) alert("Url shorten must not be duplicate!");
                else if(customer.err_format) alert ("Url shorten wrong format!");
                else if(customer.err_exist)alert("Url shorten already exists!");
            }
        })
    
    })
})