$(function () {
    let user = $("#idAdminInfo").attr("user");
    user = JSON.parse(user);
    // console.log("user:", user);
    if (user.role == "enterprise") $('#idEnterprise').prop('checked', true);
    else if (user.role == "personal") $('#idPersonal').prop('checked', true);
    // call ajax
    let role1;
    $("#submit").click(function () {
        var radioValue = $("input[name='optradio']:checked").val();
        if (radioValue) {
            role1 = radioValue;
        }
        let username = $("#idUsername").val(); username = username.trim();
        let password = $("#idPassword").val(); password = password.trim();
        let email = $("#idEmail").val(); email = email.trim();
        let formData = { username: username, password: password, email: email, role: role1 };
        // DO POST
        $.post('/admin/manager/user/update', formData, function (customer) {
            console.log("customer:", customer);
            if (customer.state == 'ok') {
                alert("Succeess.")
                let page_current = customer.page_current;
                let path = '/admin/manager/user/' + page_current.toString();
                window.location = path;
            }
            else if (customer.state == 'fail') {
                if (customer.userBlank) alert("Username should not be left blank!");
                else if (customer.passBlank) alert("Password should not be left blank!");
                else if (customer.emailBlank) alert("Email should not be left blank!");
                else if (customer.userDup) alert("Username already exists !");
                else if (customer.emailDup) alert("Email already exists !");
            }
        })
    });

})