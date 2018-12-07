$(function () {
    //date picker
    $(".datepicker").datepicker();
    //apend group facebook
    $("#btn2").click(function () {
        event.preventDefault();
        $("ol").append('<li style = "margin-top:10px;"> <input type="text" class="form-control faceGroup" placeholder="Enter name face group" name="faceGroup" autocomplete="off" /> </li>');
    });

    // undo group facebook
    $("#btn1").click(function () {
        event.preventDefault();
        $("#idOl li:last-child").remove()
    });
    // validate form;
    $("#formSubmit").submit(function () {
        try {
            let user = $("#username").val(); user = user.trim();
            let name = $("#name").val(); name = name.trim();
            let oldUrl = $("#oldUrl").val(); oldUrl = oldUrl.trim();
            let start = $("#start").val();
            let end = $("#end").val();
            let groupArr = $('.faceGroup').map(function () {
                return this.value;
            }).get()
            let lenGroup = groupArr.length;

            if (user.length == 0) { alert("User Name must be filled out"); return false }
            else if (name.length == 0) { alert("Name Campaign must be filled out"); return false }
            else if (oldUrl.length == 0) { alert("Url Origin must be filled out"); return false }
            else if (start.length == 0) { alert("Start time must be filled out "); return false }
            else if (end.length == 0) { alert("End time must be filled out "); return false }
            else if (compareDate(start, end) == false) { alert("End time must be greater than start time "); return false }
            else if(checkOneYear(start, end) == false) {alert("Campaign limit is only one year!"); return false}
            else if (lenGroup == 0) { alert("Must have at least one face group "); return false }
            else if (lenGroup > 0) {
                for (let j = 0; j < lenGroup; j++) {
                    if (groupArr[j].trim().length == 0) {
                        alert("Name group must be filled out ");
                        return false;
                    }
                }
            }
            else return true;
        } catch (e) {
            console.log(e);
            return false;
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
