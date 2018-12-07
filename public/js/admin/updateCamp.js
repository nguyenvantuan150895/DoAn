$(function () {
    //date picker
    $(".datepicker").datepicker();
    $('.fa-calendar').click(function () {
        $("#datepicker").focus();
    });


    // call ajax
    $("#save").click(() => {
        let checkGroup;
        let checkUrlGroup;
        //get data
        let username = $("#idusername").val(); username = username.trim();
        let name = $("#idname").val(); name = name.trim();
        let oldUrl = $("#idoldUrl").val(); oldUrl = oldUrl.trim();
        let email = $("#idemail").val(); email = email.trim()
        let sms = $("#idsms").val(); sms = sms.trim();
        let other = $("#idother").val(); other = other.trim();
        let start = $("#idstart").val(); start = start.trim();
        let end = $("#idend").val(); end = end.trim();
        let fbArr = $('.fb').map(function () {
            return this.value;
        }).get();
        let groupArr = $('.group').map(function () {
            return this.value;
        }).get();
        let ob_data = {
            username: username, name: name, oldUrl: oldUrl, email: email,
            sms: sms, other: other, fbArr: fbArr, groupArr: groupArr, start: start, end: end
        };
        // let ob_fb = {};
        if (groupArr.length > 0) {
            for (let j = 0; j < groupArr.length; j++) {
                if (groupArr[j].trim().length == 0) checkGroup = false;
            }
        }
        if (fbArr.length > 0) {
            for (let j = 0; j < fbArr.length; j++) {
                if (fbArr[j].trim().length == 0) checkUrlGroup = false;
            }
        }
        if (username.length == 0) alert("Username must be filled out!");
        else if (name.length == 0) alert("Name Campaign must be filled out!");
        else if (oldUrl.length == 0) alert("Url Origin must be filled out!");
        else if (email.length == 0) alert("Url for email must be filled out!");
        else if (sms.length == 0) alert("Url for sms must be filled out!");
        else if (other.length == 0) alert("Url for other must be filled out!");
        else if (start.length == 0) alert("Start time must be filled out!");
        else if (end.length == 0) alert("End time must be filled out!");
        else if (!compareDate(start, end)) alert("End time must be greater than start time!");
        else if(checkOneYear(start, end) == false) alert("Campaign limit is only one year!");
        else if(checkGroup == false) alert("Name group must be filled out! ");
        else if(checkUrlGroup == false) alert("Url for group facebook must be filled out! ");
        else {
            $.post("/admin/manager/campaign/update", ob_data).done(function (customer) {
                if (customer.state == "ok") {
                    alert("Success!");
                    let path = '/admin/manager/campaign/'+customer.page_current;
                    window.location = path;
                } else if (customer.state == "fail") {
                    if(customer.existUser == false) alert("Username does not exist");
                    else if (customer.checkRoleUser == false) alert("Invalid user role!");
                    else if (customer.existNameCamp == true) alert("Name Campaign already exists!");
                    else if (customer.emailFormat == false) alert("Wrong url email format!");
                    else if (customer.smsFormat == false) alert("Wrong url sms format!");
                    else if (customer.otherFormat == false) alert("Wrong url other format!");
                    else if (customer.fbFormat == false) alert("Wrong url facebook format!");
                    else if (customer.existEmail == true) alert("Url for email already exists!");
                    else if (customer.existSms == true) alert("Url for sms already exists!");
                    else if (customer.existOther == true) alert("Url for other already exists!");
                    else if (customer.existFb == true) alert("Url for facebook already exists!");
                    else if (customer.checkDup == true) alert("Url shorten can not be duplicated!");
                }
            })
        }
    })

})


//compare Date
let compareDate = (start, end) => {
    //format : 10/08/2018 => 08/october/2018
    let day_start = start.slice(3, 5);
    let month_start = start.slice(0, 2);
    let year_start = start.slice(6, 10);

    let day_end = end.slice(3, 5);
    let month_end = end.slice(0, 2);
    let year_end = end.slice(6, 10);
    if (year_start == year_end && month_start == month_end && day_start == day_end) {
        return false;
    }
    if (year_start < year_end) return true;
    else if (year_start > year_end) return false;
    else if (year_start == year_end) {
        if (month_start < month_end) return true;
        else if (month_start > month_end) return false;
        else if (month_start == month_end) {
            if (day_start < day_end) return true;
            else if (day_start > day_end) return false;
        }
    }
}


let daysDifference = (d0, d1) => {
    var diff = new Date(+d1).setHours(12) - new Date(+d0).setHours(12);
    return Math.round(diff / 8.64e7);
}
// Simple formatter
let formatDate = (date) => {
    return [date.getFullYear(), ('0' + (date.getMonth() + 1)).slice(-2), ('0' + date.getDate()).slice(-2)].join('-');
}

// Examples
let checkOneYear = (start, end) => {
     //format : 10/08/2018 => 08/october/2018
     let ds = start.slice(3, 5);
     let ms = start.slice(0, 2);
     let ys = start.slice(6, 10);
 
     let de = end.slice(3, 5);
     let me = end.slice(0, 2);
     let ye = end.slice(6, 10);
    let start1 = new Date(ys, ms, ds);
    let end1 =  new Date(ye, me, de);
    let distance = daysDifference(start1, end1);
    if( (Number(ys)+1) == Number(ye) && ms == me && ds == de){
        if(Number(distance) == 366 || Number(distance) == 365) return true;
        else return false;
    }
    else if(Number(distance) > 365 ) return false;
    else return true;
}
