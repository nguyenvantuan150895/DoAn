const excel = require('node-excel-export');




const exportExcel = (ob_campaignPl, ob_urlPl, arr_shortPl, accessE_Pl, accessS_Pl, accessO_Pl, accessGr_Pl, user) => {
    // console.log("arr_shortPl:", arr_shortPl);
    let overview = getOverview(arr_shortPl, ob_campaignPl, accessGr_Pl, accessE_Pl, accessS_Pl, accessO_Pl, ob_urlPl, user);
    let detail = getDetail(arr_shortPl, accessE_Pl, accessS_Pl, accessO_Pl, accessGr_Pl);
    // Format Style
    const styles = getStyle();
    // Heading
    const heading = [[{ value: 'Overview', style: styles.headerOverview }],];
    const heading2 = [[{ value: 'Detail', style: styles.headerOverview }],];
    //Here you specify the export structure
    const specification = {
        user: {
            displayName: 'User',
            headerStyle: styles.headerSub,
            width: 100
        },
        name: {
            displayName: 'Name',
            headerStyle: styles.headerSub,
            width: 100
        },
        time_create: {
            displayName: 'Time create',
            headerStyle: styles.headerSub,
            width: 100
        },
        start_time: {
            displayName: 'Start time',
            headerStyle: styles.headerSub,
            width: 100
        },
        end_time: {
            displayName: 'End time',
            headerStyle: styles.headerSub,
            width: 100
        },
        url_origin: {
            displayName: 'URL Origin',
            headerStyle: styles.headerSub,
            width: 100
        },
        url_shorten: {
            displayName: 'URL Shorten',
            headerStyle: styles.headerSub,
            width: 100
        },
        resource: {
            displayName: 'Resource',
            headerStyle: styles.headerSub,
            width: 100
        },
        group: {
            displayName: 'Group',
            headerStyle: styles.headerSub,
            width: 100
        },
        total_click: {
            displayName: 'Total click',
            headerStyle: styles.headerSub,
            width: 100
        }
    }
    const specification2 = {
        url_shorten: {
            displayName: 'Url shorten',
            headerStyle: styles.headerSub,
            width: 100
        },
        resource: {
            displayName: 'Resource',
            headerStyle: styles.headerSub,
            width: 100
        },
        group: {
            displayName: 'Group',
            headerStyle: styles.headerSub,
            width: 100
        },
        ip: {
            displayName: 'IP',
            headerStyle: styles.headerSub,
            width: 100
        },
        date_click: {
            displayName: 'Date click',
            headerStyle: styles.headerSub,
            width: 100
        },
        hour_click: {
            displayName: 'Hour click',
            headerStyle: styles.headerSub,
            width: 100
        },
        location: {
            displayName: 'Location',
            headerStyle: styles.headerSub,
            width: 100
        },
        device: {
            displayName: 'Device',
            headerStyle: styles.headerSub,
            width: 100
        },
        os: {
            displayName: 'OS',
            headerStyle: styles.headerSub,
            width: 100
        },
        browser: {
            displayName: 'Browser',
            headerStyle: styles.headerSub,
            width: 100
        }
    }
    // Create the excel report.
    const report = excel.buildExport(
        [
            {
                name: 'Overview',
                heading: heading,
                specification: specification,
                data: overview
            },
            {
                name: 'Detail',
                heading: heading2,
                specification: specification2,
                data: detail
            }
        ]
    );
    // console.log("report:", report);
    return report;
}
const exportAccessLog = (arr_access) => {
    let dataAccess = convertAccess(arr_access);
    // Format Style
    const styles = getStyle();
    // Heading
    const heading = [[{ value: 'Data Access Log', style: styles.headerOverview }],];
    //Here you specify the export structure
    const specification = {
        id: {
            displayName: 'ID',
            headerStyle: styles.headerSub,
            width: 100
        },
        ip: {
            displayName: 'IP',
            headerStyle: styles.headerSub,
            width: 100
        },
        date_click: {
            displayName: 'Date Click',
            headerStyle: styles.headerSub,
            width: 100
        },
        hour_click: {
            displayName: 'Hour Click',
            headerStyle: styles.headerSub,
            width: 100
        },
        location: {
            displayName: 'Location',
            headerStyle: styles.headerSub,
            width: 100
        },
        device: {
            displayName: 'Device',
            headerStyle: styles.headerSub,
            width: 100
        },
        id_shorten: {
            displayName: 'ID Shorten',
            headerStyle: styles.headerSub,
            width: 100
        },
        browser: {
            displayName: 'Browser',
            headerStyle: styles.headerSub,
            width: 100
        },
        os: {
            displayName: 'OS',
            headerStyle: styles.headerSub,
            width: 100
        }
    }

    // Create the excel report.
    const report = excel.buildExport(
        [
            {
                name: 'dataAccess',
                heading: heading,
                specification: specification,
                data: dataAccess
            },
        ]
    );
    // console.log("report:", report);
    return report;
}
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//FUNCTION SUPORT
const getStyle = () => {
    const styles = {
        headerOverview: {
            font: {
                color: {
                    rgb: '1282E7'
                },
                bold: true,
                underline: false,
            }
        },
        headerSub: {

            font: {
                color: {
                    rgb: 'FA5700'
                },
                bold: false,
                underline: false
            }
        }
    };
    return styles;
}
const getOverview = (arr_shortPl, ob_campaignPl, accessGr_Pl, accessE_Pl, accessS_Pl, accessO_Pl, ob_urlPl, user) => {
    let overview = [];
    for (let i = 0; i < arr_shortPl.length; i++) {
        let ob = {};
        if (i == 0) {
            ob.user = user;
            ob.name = ob_campaignPl.name;
            ob.url_origin = ob_urlPl.url;
            ob.time_create = ob_campaignPl.time_create;
            ob.start_time = ob_campaignPl.start_time;
            ob.end_time = ob_campaignPl.end_time;
        } else {
            ob.user = null;
            ob.name = null;
            ob.url_origin = null;
            ob.time_create = null;
            ob.start_time = null;
            ob.end_time = null;
        }
        ob.url_shorten = arr_shortPl[i].url;
        ob.resource = arr_shortPl[i].resource;
        ob.group = arr_shortPl[i].group;
        // console.log(arr_shortPl[i].group)
        if (arr_shortPl[i].resource == "fb") {
            for (let k = 0; k < accessGr_Pl.length; k++) {
                if (arr_shortPl[i].group == accessGr_Pl[k].name) {
                    ob.total_click = accessGr_Pl[k].arr_access.length;
                }
            }
        }
        else if (arr_shortPl[i].resource == "email") { ob.total_click = accessE_Pl.length; }
        else if (arr_shortPl[i].resource == "sms") { ob.total_click = accessS_Pl.length; }
        else if (arr_shortPl[i].resource == "other") { ob.total_click = accessO_Pl.length; }
        overview.push(ob);
    }
    return overview;
}
// ghep noi du lieu tu cac nguon khac nhau (email, sms, other, fb)
const getDetail = (arr_shortPl, accessE_Pl, accessS_Pl, accessO_Pl, accessGr_Pl) => {
    let email, sms, other, fb;
    let group = [];
    let data = [];
    for (let i = 0; i < arr_shortPl.length; i++) {
        if (arr_shortPl[i].resource == "email") {
            email = prepareData2(arr_shortPl[i], accessE_Pl);
            data = data.concat(email);
        }
        else if (arr_shortPl[i].resource == "sms") {
            sms = prepareData2(arr_shortPl[i], accessS_Pl);
            data = data.concat(sms);
        }
        else if (arr_shortPl[i].resource == "other") {
            other = prepareData2(arr_shortPl[i], accessO_Pl);
            data = data.concat(other);
        }
        else if (arr_shortPl[i].resource == "fb") {
            group.push(arr_shortPl[i]);
        }
    }
    for (let j = 0; j < group.length; j++) {
        fb = prepareData2(group[j], accessGr_Pl[j].arr_access);
        data = data.concat(fb);
    }
    return data;
}
const convertAccess = (arr_access) => {
    let arr = [];
    for(let i = 0; i < arr_access.length; i++) {
        let ob = {};
        ob.id = arr_access[i].id;
        ob.ip = arr_access[i].ip;
        ob.date_click = arr_access[i].time_click.date;
        ob.hour_click = arr_access[i].time_click.hour;
        ob.location = arr_access[i].location;
        ob.device = arr_access[i].device;
        ob.id_shorten = arr_access[i].id_shorten;
        ob.browser = arr_access[i].browser;
        ob.os = arr_access[i].os;
        arr.push(ob);
    }
    // console.log("arr:", arr);
    return arr;
}
// chuan hoa du lieu 
const prepareData2 = (urlshorten, arr_access) => {
    let data = [];
    for (let i = 0; i < arr_access.length; i++) {
        let ob = {};
        if (i == 0) {
            ob.url_shorten = urlshorten.url;
            ob.resource = urlshorten.resource;
            ob.group = urlshorten.group;
        } else {
            ob.url_shorten = null;
            ob.resource = null;
            ob.group = null;
        }
        ob.ip = arr_access[i].ip;
        ob.date_click = arr_access[i].time_click.date;
        ob.hour_click = arr_access[i].time_click.hour;
        ob.location = arr_access[i].location;
        ob.device = arr_access[i].device;
        ob.os = arr_access[i].os;
        ob.browser = arr_access[i].browser;
        data.push(ob);
    }
    return data;
}


module.exports = {
    exportExcel,
    exportAccessLog
}