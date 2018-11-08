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
        let name = $("#idname").val(); name = name.trim();
        let oldUrl = $("#idoldUrl").val(); oldUrl = oldUrl.trim();
        let email = $("#idemail").val(); email = email.trim()
        let sms = $("#idsms").val(); sms = sms.trim();
        let other = $("#idother").val(); other = other.trim();
        let start = $("#idstart").val(); start = start.trim();
        let end = $("#idend").val(); end = end.trim();
        let fbArr = $('.fb').map(function() {
            return this.value;
        }).get();
        let groupArr = $('.group').map(function() {
            return this.value;
        }).get();
        // let ob_fb = {};
        if(start.length == 0 ) alert("Start time must be filled out");
        else if(end.length == 0) alert("End time must be filled out");
        else if(!compareDate(start, end)) alert("End time must be greater than start time");
        let ob_data = {name: name, oldUrl: oldUrl, email: email, sms: sms, other: other, fbArr: fbArr, groupArr: groupArr, start: start, end: end};
        if(start.length != 0 && end.length != 0 && compareDate(start,end)){
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
        }
    })
})
//compare Date
let compareDate = (start, end) => {
    //format : 10/08/2018 => 08/october/2018
    let day_start = start.slice(3,5);
    let month_start = start.slice(0,2);
    let year_start = start.slice(6,10);

    let day_end = end.slice(3,5);
    let month_end = end.slice(0,2);
    let year_end = end.slice(6,10);
    if(year_start == year_end && month_start == month_end && day_start == day_end){
        return false;
    }
    if(year_start < year_end) return true;
    else if(year_start > year_end) return false;
    else if(year_start == year_end){
        if(month_start < month_end) return true;
        else if(month_start > month_end) return false;
        else if(month_start == month_end){
            if(day_start < day_end) return true;
            else if(day_start > day_end) return false;
        }
    }
}