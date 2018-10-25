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


    // call ajax
    $("#submit").click(function(){
        event.preventDefault();
        //get array name group
        let faGroup = $('.faceGroup').map(function() {
            return this.value;
        }).get();
        let name = $("#name").val(); name = name.trim();
        let oldUrl = $("#oldUrl").val();oldUrl = oldUrl.trim();
        let start = $("#start").val();
        let end = $("#end").val();

        let data = {name: name, oldUrl: oldUrl, faGroup: faGroup, start: start, end: end}
        $.post("/enterprise/create",data )
        .done(function(customer){
            //do sth
        })
    })


    // $.post("/enterprise/create",data )
    // .done(function(customer){
    //     if(customer.state == "ok"){
    //         alert("Create success!");
    //         $("#oldUrl").val(""); $("#newUrl").val('');
    //         $("#slider").slideReveal("hide");
    //     } 
    //     else if(customer.state =="fail") {
    //         if(customer.err_format) alert("Invalid UrlShorten format!!!");
    //         if(customer.err_exist) alert("UrlShorten already exists !!!");
    //     }
    // })

})