$( document ).ready(function() {
	
	// SUBMIT FORM
    $("#customerForm").submit(function(event) {
		// Prevent the form from submitting via the browser.
		event.preventDefault();
		ajaxPost();
	});
    
    
    function ajaxPost(){
    	
    	// PREPARE FORM DATA
    	var formData = {
    		username : $("#username").val(),
			password :  $("#password").val(),
			email :  $("#email").val(),
    	}
    	
    	// DO POST
    	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : "/user/signup",
			data : JSON.stringify(formData),
			dataType : 'json',
			success : function(customer) {
				if(customer.state == "ok"){
					window.location = "/manager/1";
				} else if (customer.state == "emailErr") {
					alert("Email already exists !");
                } else if(customer.state == "userErr"){
					alert("Username already exists !");
				}
				
				// $("#input1").val(customer.firstname);
				// $("#input2").val(customer.lastname);
			},
			error : function(e) {
				alert("Error tuan!")
				console.log("ERROR: ", e);
			}
		});
    	
    	// Reset FormData after Posting
    	resetData();

    }
    
    function resetData(){
    	$("#firstname").val("");
		$("#lastname").val("");
		// $("#email").val("");
		
    }
})

// <!-- <script src="/js/user/ajaxSignup.js"></script> -->