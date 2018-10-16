$( document ).ready(function() {
	
    // SUBMIT FORM
    $("#inputOldUrl").submit(function(event) {
        // Prevent the form from submitting via the browser.
        event.preventDefault();
        ajaxPost();
    });

    function ajaxPost(){
        
        // PREPARE FORM DATA
        var formData = {
            urlOrigin : $("#idOldUrl").val(),
        }
        console.log("formData:", formData.urlOrigin.length);
        // DO POST
        if(formData.urlOrigin.length){
            $.ajax({
            type : "POST",
            contentType : "application/json",
            url : "/shortUrl",
            data : JSON.stringify(formData),
            dataType : 'json',
            success : function(data) {
                $("#idOldUrl").val(data.urlOrigin);
                $("#idNewUrl").val(data.urlShort);
            },
            error : function(e) {
                alert("Error!")
                console.log("ERROR: ", e);
            }
            });
        }
        
        
        // Reset FormData after Posting
        resetData();

    }
    
    function resetData(){
        $("#idOldUrl").val("");
        $("#idNewUrl").val("");
    }
})