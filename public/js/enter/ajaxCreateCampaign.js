$(function(){
    //slider (short link)
    $('#slider').slideReveal({
        trigger: $("#btnShort"),
        position: "right",
        push: false,
        // width: 300,
        overlay: true,
        autoEscape: false,
    });

    //apend group facebook
    $("#btn2").click(function(){
        event.preventDefault();
        $("ol").append('<li><input type="text" class="form-control faceGroup" placeholder="Enter name face group" name ="faceGroup"/></li>');
    });

    // undo group facebook
    $("#btn1").click(function(){
        event.preventDefault();
        $("#idOl li:last-child").remove()
    })
    
    //date picker
    $(".datepicker").datepicker();
        $('.fa-calendar').click(function() {
        $("#datepicker").focus();
    });

    //compare Date
    let compareDate = (start, end) => {
        //format : 10/08/2018 => 08/october/2018
        let day_start = start.slice(3,5);
        let month_start = start.slice(0,2);
        let year_start = start.slice(6,10);

        let day_end = end.slice(3,5);
        let month_end = end.slice(0,2);
        let year_end = end.slice(6,10);

        if(year_start <= year_end){
            if(month_start <= month_end){
                if(year_start == year_end && month_start == month_end){
                    if(day_start < day_end){
                        return true;
                    } else return false;
                }
                else if(day_start <= day_end){
                    return true;
                } else return false;
            } else return false;
        } else return false;
    }

    // validate form;
    $("#formSubmit").submit(function(){
        try{
            let name = $("#name").val(); name = name.trim();
            let oldUrl = $("#oldUrl").val(); oldUrl = oldUrl.trim();
            let start = $("#start").val();
            let end = $("#end").val();
            let groupArr = $('.faceGroup').map(function() {
                return this.value;
            }).get()
            let lenGroup = groupArr.length;
           

            if(name.length == 0) {alert("Name must be filled out"); return false}
            else if(oldUrl.length == 0) {alert("Url Origin must be filled out");return false}
            else if(start.length == 0) {alert("Start time must be filled out ");return false}
            else if(end.length == 0) {alert("End time must be filled out ");return false}
            else if(compareDate(start,end) == false){alert("End time must be greater than start time ");return false}
            else if(lenGroup == 0) {alert("Must have at least one face group ");return false}
            else if(lenGroup > 0){
                for(let j = 0; j < lenGroup; j++){
                    if(groupArr[j].trim().length == 0){
                        alert("Name group must be filled out ");
                        return false;
                    }
                }
            }
            else return true;
        } catch(e) {
            console.log(e);
            return false;
        }
    })
})