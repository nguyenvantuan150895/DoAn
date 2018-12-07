$(function(){
    $("#submitEdit").click(function(){
        let username = $("#idUsername").val(); username = username.trim();
        let password = $("#idPassword").val(); password = password.trim();
        let email = $("#idEmail").val(); email = email.trim();
        if(username.length == 0) alert("Username must not be blank!");
        else if(password.length == 0) alert("Password must not be blank!");
        else if(email.length == 0) alert("Email must not be blank!");
        else{
            let data = {username: username, password: password, email: email};
            //call ajax
            $.post('/enterprise/editEnter', data, function (customer) {
                // console.log("data:", response);
                if (customer.state == 'ok') {
                    alert("Success!");
                    window.location = "/enterprise/profile";
                }
                else if (customer.state == 'fail') {
                    if(customer.existUser) alert("Username already exists!");
                    else if(customer.existEmail) alert("Email already exists!");
                }
              })
        }
    })
})