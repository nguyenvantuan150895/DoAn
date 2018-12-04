

$(function () {
    //handle click edit button
    $(".classEdit").click(function () {
        let obBefore = $(this).attr('obShortBefore'); console.log("obBefore:", obBefore);
        obBefore = JSON.parse(obBefore);
        let call = () => {
            const { value: formValues } = swal({
                title: 'Edit Link',
                html:
                    '<p style ="font-weight:bold; margin-bottom: 0px; padding-top:10px; margin-left:-230px">Url Original</p>' +
                    '<input id="urlOriginE" class="swal2-input" readonly style = "font-weight: bold; color: #3c8dbc;">' +
                    '<p style = "font-weight:bold; margin-bottom: 0px; margin-left:-230px">Url Shorten</p>' +
                    '<input id="urlShortE" class="swal2-input" style = "font-weight: bold; color: #3c8dbc">',
                focusConfirm: false,
                showCancelButton: true,
            }).then((result) => {
                if (result.value) {


                    // call ajax here when click confirm
                    let idUrl = obBefore.idUrl;
                    let urlOriginE = $("#urlOriginE").val();
                    let urlShortE = $("#urlShortE").val();
                    let urlPreEdit = obBefore.urlOrigin;
                    let idShort = obBefore.idShortUrl;
                    let object_edit = { idUrl: idUrl, oldUrl: urlOriginE, newUrl: urlShortE, idShortUrl: idShort, urlPreEdit: urlPreEdit };
                    $.post("/enterprise/editLink", object_edit)
                        .done(function (customer) {
                            if (customer.state == "ok") {
                                swal(
                                    'successfully edit',
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
                                        $("#urlOriginE").val(urlOriginBefore);
                                        $("#urlShortE").val(urlShortBefore);
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
        let urlOriginBefore = obBefore.urlOrigin;
        let urlShortBefore = obBefore.urlShort;
        $("#urlOriginE").val(urlOriginBefore);
        $("#urlShortE").val(urlShortBefore);
    })
})

