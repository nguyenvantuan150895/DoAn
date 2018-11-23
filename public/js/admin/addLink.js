$(function () {
    $("#idCreate").click(function () {

        let username = $("#idUserName").val(); username = username.trim();
        let urlOrigin = $("#idUrlOrigin").val(); urlOrigin = urlOrigin.trim();
        let formData = { username: username, urlOrigin: urlOrigin };
        // DO POST
        $.post('/admin/manager/link/add', formData, function (customer) {
            console.log("customer:", customer);
            if (customer.state == 'ok') {
                alert("Success !");
                let last_page = customer.last_page;
                let path = '/admin/manager/link/' + last_page.toString();
                window.location = path;
            }
            else if (customer.state == 'fail') {
                if (customer.blankUrl) alert("Url Origin must not be blank!");
                if (customer.blankUser) alert("User must not be blank!");
                if (customer.checkUser == false) alert("User does not exist!");
            }
        })
    });
})