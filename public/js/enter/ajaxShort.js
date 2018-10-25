// Button Go
$(function() {
	$("#btnGo").click(() => {
		let oldUrl1 = $("#oldUrl").val(); oldUrl1 = oldUrl1.trim();
		if(oldUrl1.length != 0){
			$.post("/enterprise/getShortLink", oldUrl1)
			.done(function(newUrl1){
			   $('#newUrl').val(newUrl1);
			})
		}
	})
// Button save
	$("#btnSave").click(() => {
		let oldUrl = $("#oldUrl").val(); oldUrl = oldUrl.trim();// console.log("oldUrl:", oldUrl);
		let newUrl = $("#newUrl").val(); newUrl = newUrl.trim(); //console.log("newUrl:", newUrl);
		if(oldUrl.length == 0) {
			alert("Url Original not be empty !!!");
		} else if (newUrl.length == 0) {
			alert("Url Shorten not be empty !!!");
		}
		else {
			//alert("ok");
			let data = {oldUrl: oldUrl, newUrl: newUrl}
			$.post("/enterprise/shortLink",data )
			.done(function(customer){
			   	if(customer.state == "ok"){
					alert("Create success!");
					$("#oldUrl").val(""); $("#newUrl").val('');
					$("#slider").slideReveal("hide");
				} 
			   	else if(customer.state =="fail") {
				   if(customer.err_format) alert("Invalid UrlShorten format!!!");
				   if(customer.err_exist) alert("UrlShorten already exists !!!");
			   	}
			})
		}
	})
	
})