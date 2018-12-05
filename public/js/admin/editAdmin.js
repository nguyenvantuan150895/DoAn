$(function(){
    $("#smEditAdmin").click(function(){
        let account = $("#idAccount").val(); account = account.trim();
        let password = $("#idPassword").val(); password = password.trim();
        let email = $("#idEmail").val(); email = email.trim();
        if(account.length == 0) alert("Account must not be blank!");
        else if(password.length == 0) alert("Password must not be blank!");
        else if(email.length == 0) alert("Email must not be blank!");
        else{
            let data = {account: account, password: password, email: email};
            //call ajax
            $.post('/admin/editAdmin', data, function (customer) {
                // console.log("data:", response);
                if (customer.state == 'ok') {
                    alert("Success!");
                    window.location = "/admin/profile";
                }
                else if (customer.state == 'fail') {
                    if(customer.existAccount) alert("Account already exists!");
                    else if(customer.existEmail) alert("Email already exists!");
                }
              })
        }
    })
})