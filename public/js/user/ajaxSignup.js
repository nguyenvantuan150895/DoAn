$( document ).ready(function() {
	let role1;
	// SUBMIT FORM
    $("#customerForm").submit(function(event) {
		// Prevent the form from submitting via the browser.
		var radioValue = $("input[name='optradio']:checked").val();
		if(radioValue){
			role1 = radioValue;
		}

		event.preventDefault();
		ajaxPost();
	});
    function ajaxPost(){
    	
    	// PREPARE FORM DATA
    	var formData = {
    		username : $("#username").val(),
			password :  $("#password").val(),
			email :  $("#email").val(),
			role: role1
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
					if(customer.role == "personal") window.location = "/user/manager/1";
					else if(customer.role == "enterprise") window.location = "/enterprise/manager";
					
				}
				if(customer.state == "fail"){
					if(customer.userBlank) $('#errUserBlank').show();
					else $('#errUserBlank').hide();
					if(customer.passBlank) $('#errPassBlank').show();
					else $('#errPassBlank').hide();
					if(customer.emailBlank) $('#errEmailBlank').show();
					else $('#errEmailBlank').hide();
					if(customer.userDup) $('#errUser').show();
					else $('#errUser').hide();
					if(customer.emailDup) $('#errEmail').show();
					else $('#errEmail').hide();
				}
				//alert(customer);
				console.log('customer:', customer);
			},
			error : function(e) {
				
				//alert("Error tuan!")
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