$(function(){
    var timeoutId;
    //nut 1
    $("#nut1").hover(function() {
        if (!timeoutId) {
            timeoutId = window.setTimeout(function() {
                timeoutId = null;
                $("#nut1").animate({'width': '200px'}, 1000);
           }, 300);
        }
    },
    function () {
        if (timeoutId) {
            window.clearTimeout(timeoutId);
            timeoutId = null;
        }
        else {
            $(this).animate({'width': '33px'}, 1000);
        }
    });
    // nut 2
    $("#nut2").hover(function() {
        if (!timeoutId) {
            timeoutId = window.setTimeout(function() {
                timeoutId = null;
                $("#nut2").animate({'width': '200px'}, 1000);
           }, 300);
        }
    },
    function () {
        if (timeoutId) {
            window.clearTimeout(timeoutId);
            timeoutId = null;
        }
        else {
            $(this).animate({'width': '33px'}, 1000);
        }
    });
    // nut 3
    $("#nut3").hover(function() {
        if (!timeoutId) {
            timeoutId = window.setTimeout(function() {
                timeoutId = null;
                $("#nut3").animate({'width': '200px'}, 1000);
           }, 300);
        }
    },
    function () {
        if (timeoutId) {
            window.clearTimeout(timeoutId);
            timeoutId = null;
        }
        else {
            $(this).animate({'width': '33px'}, 1000);
        }
    });
    // nut 4
    $("#nut4").hover(function() {
        if (!timeoutId) {
            timeoutId = window.setTimeout(function() {
                timeoutId = null;
                $("#nut4").animate({'width': '200px'}, 1000);
           }, 300);
        }
    },
    function () {
        if (timeoutId) {
            window.clearTimeout(timeoutId);
            timeoutId = null;
        }
        else {
            $(this).animate({'width': '33px'}, 1000);
        }
    });
    //nut 5
    $("#nut5").hover(function() {
        if (!timeoutId) {
            timeoutId = window.setTimeout(function() {
                timeoutId = null;
                $("#nut5").animate({'width': '200px'}, 1000);
           }, 300);
        }
    },
    function () {
        if (timeoutId) {
            window.clearTimeout(timeoutId);
            timeoutId = null;
        }
        else {
            $(this).animate({'width': '33px'}, 1000);
        }
    });
    //nut 6
    $("#nut6").hover(function() {
        if (!timeoutId) {
            timeoutId = window.setTimeout(function() {
                timeoutId = null;
                $("#nut6").animate({'width': '200px'}, 1000);
           }, 300);
        }
    },
    function () {
        if (timeoutId) {
            window.clearTimeout(timeoutId);
            timeoutId = null;
        }
        else {
            $(this).animate({'width': '33px'}, 1000);
        }
    });
    //nut 7
    $("#nut7").hover(function() {
        if (!timeoutId) {
            timeoutId = window.setTimeout(function() {
                timeoutId = null;
                $("#nut7").animate({'width': '200px'}, 1000);
           }, 300);
        }
    },
    function () {
        if (timeoutId) {
            window.clearTimeout(timeoutId);
            timeoutId = null;
        }
        else {
            $(this).animate({'width': '33px'}, 1000);
        }
    });

    //nut 8
    $("#nut8").hover(function() {
        if (!timeoutId) {
            timeoutId = window.setTimeout(function() {
                timeoutId = null;
                $("#nut8").animate({'width': '200px'}, 1000);
           }, 300);
        }
    },
    function () {
        if (timeoutId) {
            window.clearTimeout(timeoutId);
            timeoutId = null;
        }
        else {
            $(this).animate({'width': '33px'}, 1000);
        }
    });
})








    // $("#nut1").hover(function(){
    //     $(this).animate({'width': '200px'}, 1000);
    //     // $(this).text("Over view total click");

    // }, function(){
    //     $(this).animate({'width': '33px'}, 1000);
    //     // $(this).text("1");
    // });

    // $("#nut2").hover(function(){
    //     $(this).animate({'width': '200px'}, 1000);
    //     // $(this).text("Average day");

    // }, function(){
    //     $(this).animate({'width': '33px'}, 1000)
    //     // $(this).text("2");
    // });

    // $("#nut3").hover(function(){
    //     $(this).animate({'width': '200px'}, 1000);
    //     // $(this).text("Average hour");

    // }, function(){
    //     $(this).animate({'width': '33px'}, 1000)
    //     // $(this).text("3");
    // });

    // $("#nut4").hover(function(){
    //     $(this).animate({'width': '200px'}, 1000);
    //     // $(this).text("Location");

    // }, function(){
    //     $(this).animate({'width': '33px'}, 1000)
    //     // $(this).text("4");
    // });

    // $("#nut5").hover(function(){
    //     $(this).animate({'width': '200px'}, 1000);
    //     // $(this).text("Browser");

    // }, function(){
    //     $(this).animate({'width': '33px'}, 1000)
    //     // $(this).text("5");
    // });

    // $("#nut6").hover(function(){
    //     $(this).animate({'width': '200px'}, 1000);
    //     // $(this).text("Device");

    // }, function(){
    //     $(this).animate({'width': '33px'}, 1000)
    //     // $(this).text("6");
    // });


    // $("#nut7").hover(function(){
    //     $(this).animate({'width': '200px'}, 1000);
    //     // $(this).text("OS desktop");

    // }, function(){
    //     $(this).animate({'width': '33px'}, 1000)
    //     // $(this).text("7");
    // });


    // $("#nut8").hover(function(){
    //     $(this).animate({'width': '200px'}, 1000);
    //     // $(this).text("OS phone");

    // }, function(){
    //     $(this).animate({'width': '33px'}, 1000)
    //     // $(this).text("8");
    // });
    
