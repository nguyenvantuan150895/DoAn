$(document).ready(function () {
    // SUBMIT FORM
    let role1;
    $("#idCreate").click(function () {
        var radioValue = $("input[name='optradio']:checked").val();
        if (radioValue) {
            role1 = radioValue;
        }
        let username = $("#idUsername").val(); username = username.trim();
        let password = $("#idPassword").val(); password = password.trim();
        let email = $("#idEmail").val(); email = email.trim();
        let formData = { username: username, password: password, email: email, role: role1 };
        // DO POST
        $.post('/admin/manager/user/add', formData, function (customer) {
            console.log("customer:", customer);
            if (customer.state == 'ok') {
                alert("Success.")
                let last_page = customer.last_page;
                let path = '/admin/manager/user/' + last_page.toString();
                window.location = path;
            }
            else if (customer.state == 'fail') {
                if(customer.userBlank) alert("Username should not be left blank!");
                else if(customer.passBlank) alert("Password should not be left blank!");
                else if(customer.emailBlank) alert("Email should not be left blank!");
                else if(customer.userDup) alert("Username already exists !");
                else if(customer.emailDup) alert("Email already exists !");
            }
        })
    });
    
})