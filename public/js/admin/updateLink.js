$(function () {
    $("#idUpdate").click(function () {
        let username = $("#idUserName").val(); username = username.trim();
        let urlOrigin = $("#idUrlOrigin").val(); urlOrigin = urlOrigin.trim();
        let urlShort = $("#idUrlShort").val(); urlShort = urlShort.trim();
        let formData = { username: username, urlOrigin: urlOrigin, urlShort: urlShort };
        // DO POST
        $.post('/admin/manager/link/update', formData, function (customer) {
            if (customer.state == 'ok') {
                alert("Success !");
                let page_current = customer.page_current;
                let path = '/admin/manager/link/' + page_current.toString();
                window.location = path;
            }
            else if (customer.state == 'fail') {
                if (customer.blankUrlOrigin) alert("Url Origin must not be blank!");
                if (customer.blankUrlShort) alert("Url Shorten must not be blank!");
                if (customer.blankUser) alert("User must not be blank!");
                if (customer.formatShort == false) alert("Url Shorten is not in the correct format!");
                if (customer.existShort) alert("Url Shorten already exist!");
                if (customer.existUser == false) alert("User does not exist!");
            }
        })
    });
})