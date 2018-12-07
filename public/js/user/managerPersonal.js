$(function () {
    // copy short link
    new Clipboard('.copy-text');

    // Create customer Link
    let call = () => {
        const domain = $("#domain").attr("domain");
        const { value: formValues } = swal({
            title: 'Create & Customer link',
            html:
                '<p style ="font-weight:bold; margin-bottom: 0px; padding-top:10px; margin-left:-230px">Url Original</p>' +
                '<input id="oldUrl" class="swal2-input" placeholder = "Enter Url nedd to shorten" style = "font-weight: bold; color: #3c8dbc" >' +
                '<p style ="font-weight:bold; margin-bottom: 0px; padding-top:10px; margin-left:-230px">Url Shorten</p>' +
                '<input id="newUrl" class="swal2-input" style = "font-weight: bold; color: #3c8dbc" value=' + domain + '>' +
                '<p style = "display: none; color: red" id="idErr" >Url shorten invalid!</p>',

            focusConfirm: false,
            showCancelButton: true,
        }).then((result) => {
            if (result.value) {
                // call ajax here when click confirm
                let oldUrl = $("#oldUrl").val();
                let newUrl = $("#newUrl").val();
                $.post("/user/createLink", { oldUrl: oldUrl, newUrl: newUrl })
                    .done(function (customer) {
                        if (customer.state == "ok") {
                            swal(
                                'successfully created',
                                'success'
                            ).then((result) => {
                                if (result.value) {
                                    window.location = "/user/manager/" + customer.last_page;
                                }
                            })

                        } else if (customer.state == "fail") {
                            swal(
                                'Invalid Url Shorten',
                                'example: yourdomain/balabala',
                                'error'
                            ).then((result) => {
                                if (result.value) {
                                    call();
                                }
                            })
                        }
                    })
            } else if (result.dismiss === swal.DismissReason.cancel) {
                //do sth when cancle
            }
        })
    }
    $("#btnCreate").click(() => {
        call();
    })


    // Edit link
    $(".idEdit").click(function () {
        let call = () => {
            const { value: formValues } = swal({
                title: 'Edit link',
                html:
                    '<p style ="font-weight:bold; margin-bottom: 0px; padding-top:10px; margin-left:-230px">Url Original</p>' +
                    '<input id="oldUrle" class="swal2-input" readonly style = "font-weight: bold; color: #3c8dbc">' +
                    '<p style ="font-weight:bold; margin-bottom: 0px; padding-top:10px; margin-left:-230px">Url Shorten</p>' +
                    '<input id="newUrle" class="swal2-input"style = "font-weight: bold; color: #3c8dbc">',
                focusConfirm: false,
                showCancelButton: true,
            }).then((result) => {
                if (result.value) {
                    // call ajax here when click confirm
                    let id = $(this).attr('id_e');
                    let oldUrl = $("#oldUrle").val();
                    let newUrl = $("#newUrle").val();
                    let urlPreEdit = $(this).attr('newUrl_e');
                    let idShortUrl = $(this).attr('idShortUrl');
                    let object_edit = { id: id, oldUrl: oldUrl, newUrl: newUrl, idShortUrl: idShortUrl, urlPreEdit: urlPreEdit };
                    $.post("/user/editLink", object_edit)
                        .done(function (customer) {
                            if (customer.state == "ok") {
                                swal(
                                    'successfully created',
                                    'success'
                                ).then((result) => {
                                    if (result.value) {
                                        window.location.reload(true);
                                    }
                                })

                            } else if (customer.state == "fail") {
                                swal(
                                    'Invalid Url Shorten',
                                    'url already exists or invalid',
                                    'error'
                                ).then((result) => {
                                    if (result.value) {
                                        call();
                                        $("#oldUrle").val(oldUrle);
                                        $("#newUrle").val(newUrle);
                                    }
                                })
                            }
                        })
                } else if (result.dismiss === swal.DismissReason.cancel) {
                    //do sth when cancle
                }
            })
        }//end call function
        call();
        let oldUrle = $(this).attr('oldUrl_e');
        let newUrle = $(this).attr('newUrl_e');
        $("#oldUrle").val(oldUrle);
        $("#newUrle").val(newUrle);

    })
    // Reload Click Link
    $("#clickUrl").click(function () {
        window.location.reload(true);
    })
})