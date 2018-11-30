$(function () {
    //get data
    let arrCampaign = $("#arr_campaign").attr("arrCampaign"); //console.log("arrCamp:", arrCampaign);
    arrCampaign = JSON.parse(arrCampaign);
    let obCamp = $("#arr_campaign").attr("obCamp");//console.log("obCamp:", obCamp);
    obCamp = JSON.parse(obCamp);
    let customer = $("#arr_campaign").attr("customer");//console.log("customer:", customer);
    customer = JSON.parse(customer);


    // Fuction Chart
    let detailCampaign = (data, elementCampaign) => {
        let arr_shortUrl = data.arr_shortUrl;
        $("#idname").val(elementCampaign.name);
        $("#idOldUrl").val(data.ob_url.url);
        $("#start").val(elementCampaign.start_time);
        $("#end").val(elementCampaign.end_time);
        $("#create").val(elementCampaign.time_create);
        $("#email").val(arr_shortUrl.email.url);
        $("#sms").val(arr_shortUrl.sms.url);
        $("#other").val(arr_shortUrl.other.url);
        $(".block1").empty();
        for (let j = 0; j < arr_shortUrl.fb.length; j++) {
            $(".block1").append('<label for="" style ="color: white; width:20%"> ' + (j + 1) + '. ' + arr_shortUrl.fb[j].group + ':</label>');
            $(".block1").append('<br>');
            $(".block1").append('<input type="text" class = "infoDetail" readonly value= "' + arr_shortUrl.fb[j].url + '"></input>')
        }
    }
    let mylocation = (objLocation) => {
        let arr_label = [];
        let arr_data = [];
        for (const key of Object.keys(objLocation)) {
            let obj1 = {};
            let obj2 = {};
            obj1.label = key;
            obj2.value = objLocation[key];
            arr_label.push(obj1);
            arr_data.push(obj2);
        }
        $(".location").empty();
        $(".location").append(' <div id="location"></div> ');
        FusionCharts.ready(function () {
            var revenueChart = new FusionCharts({
                type: 'scrollColumn2d',
                renderAt: 'location',
                width: '100%',
                height: '300',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "theme": "fusion",
                        "showvalues": "1",
                        "numVisiblePlot": "10",
                        "labeldisplay": "auto",
                    },
                    "categories": [{
                        "category": arr_label
                    }],
                    "dataset": [{
                        "data": arr_data
                    }]
                }
            });
            revenueChart.render();
        });
    }

    let osPhone = (osPhone) => {
        // console.log("osPhone:", osPhone);
        let total = osPhone.android + osPhone.ios + osPhone.otherphone;
        let android_per = Math.round(((osPhone.android) / total) * 100);
        let ios_per = Math.round(((osPhone.ios) / total) * 100);
        let other_per = Math.round(((osPhone.otherphone) / total) * 100);

        $("#total0SPhone").text(total);
        $("#totalAn").text(osPhone.android);
        $("#totaliOS").text(osPhone.ios);
        $("#totalOthPhone").text(osPhone.otherphone);

        $(".osPhone").empty();
        $(".osPhone").append(' <div id="osPhone" style="height: 250px;"></div>  ');
        new Morris.Donut({
            // ID of the element in which to draw the chart.
            element: 'osPhone',
            // Chart data records -- each entry in this array corresponds to a point on
            // the chart.
            resize: true,
            colors: ["#3c8dbc", "#f56954", "#00a65a", "gray"],
            data: [
                { label: "Android(%)", value: android_per },
                { label: "iOS(%)", value: ios_per },
                { label: "Other(%)", value: other_per },
            ],
            hideHover: 'auto'
        });
    }

    let osDesktop = (osDesktop) => {
        let total = osDesktop.mac + osDesktop.linux + osDesktop.window + osDesktop.otherdesktop;
        let mac_per = Math.round(((osDesktop.mac) / total) * 100);
        let linux_per = Math.round(((osDesktop.linux) / total) * 100);
        let window_per = Math.round(((osDesktop.window) / total) * 100);
        let other_per = Math.round(((osDesktop.otherdesktop) / total) * 100);

        $("#totalOsDesk").text(total);
        $("#totalWin").text(osDesktop.window);
        $("#totalMac").text(osDesktop.mac);
        $("#totalLinux").text(osDesktop.linux);
        $("#totalOthOsDesk").text(osDesktop.otherdesktop);

        $(".osDesktop").empty();
        $(".osDesktop").append(' <div id="osDesktop" style="height: 250px;"></div>  ');
        new Morris.Donut({
            // ID of the element in which to draw the chart.
            element: 'osDesktop',
            // Chart data records -- each entry in this array corresponds to a point on
            // the chart.
            resize: true,
            colors: ["#3c8dbc", "#f56954", "#00a65a", "gray"],
            data: [
                { label: "Windows(%)", value: window_per },
                { label: "Mac OS(%)", value: mac_per },
                { label: "Linux(%)", value: linux_per },
                { label: "Other(%)", value: other_per },
            ],
            hideHover: 'auto'
        });
    }
    let device = (device) => {
        // console.log("device:", JSON.stringify(device));
        let total = device.desktop + device.phone + device.tablet + device.other;
        let desktop_per = Math.round(((device.desktop) / total) * 100);
        let phone_per = Math.round(((device.phone) / total) * 100);
        let tablet_per = Math.round(((device.tablet) / total) * 100);
        let other_per = Math.round(((device.other) / total) * 100);

        $("#totalDevice").text(total);
        $("#totalDes").text(device.desktop);
        $("#totalPhone").text(device.phone);
        $("#totalTab").text(device.tablet);
        $("#totalOthDevice").text(device.other);


        $(".device").empty();
        $(".device").append(' <div id="device" style="height: 250px;"></div> ');
        new Morris.Donut({
            // ID of the element in which to draw the chart.
            element: 'device',
            // Chart data records -- each entry in this array corresponds to a point on
            // the chart.
            resize: true,
            colors: ["#3c8dbc", "#f56954", "#00a65a", "gray"],
            data: [
                { label: "Desktop(%)", value: desktop_per },
                { label: "Phone(%)", value: phone_per },
                { label: "Tablet(%)", value: tablet_per },
                { label: "Other(%)", value: other_per }
            ],
            hideHover: 'auto'
        });
    }
    let browser = (browser) => {
        let total = browser.chrome + browser.ie + browser.opera + browser.firefox + browser.safari + browser.coccoc +
            browser.fb + browser.otherbrowser;
        $("#totalBrowser").text(total);
        $("#totalChrome").text(browser.chrome);
        $("#totalIE").text(browser.ie);
        $("#totalOpera").text(browser.opera);
        $("#totalFire").text(browser.firefox);
        $("#totalSafa").text(browser.safari);
        $("#totalCoc").text(browser.coccoc);
        $("#totalFb").text(browser.fb);
        $("#totalOth").text(browser.otherbrowser);

        let arr = [browser.chrome, browser.ie, browser.opera, browser.firefox, browser.safari, browser.coccoc,
        browser.fb, browser.otherbrowser];
        let arr2 = ["Chrome", "IE", "Opera", "Firefox", "Safari", "CocCoc", "Fabook", "Other"];
        $(".browser").empty();
        $(".browser").append('<canvas id="myBrowser" height="110vh" width="200vw"></canvas>');
        new Chart($("#myBrowser"), {
            type: 'doughnut',
            data: {
                labels: ["Chrome", "IE", "Opera", "Firefox", "Safari", "CocCoc", "Fabook", "Other"],
                datasets: [
                    {
                        label: "Population (millions)",
                        backgroundColor: ["#da6d5f", "#e08308", "green", "#e2d958", "#ea1cb1", "#8f82ec", "#bcd6de", "gray"],
                        data: arr
                    }
                ]
            },
            options: {
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            var dataset = data.datasets[tooltipItem.datasetIndex];
                            var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                                return previousValue + currentValue;
                            });
                            var currentValue = dataset.data[tooltipItem.index];
                            var percentage = Math.floor(((currentValue / total) * 100) + 0.5);
                            return arr2[tooltipItem.index] + " " + percentage + "%";
                        }
                    }
                }
            }
        });
    }
    // Group face
    let groupFace = (averageGr) => {
        let arr = [];
        for (let i = 0; i < averageGr.length; i++) {
            let obj = {};
            obj.label = averageGr[i].name;
            obj.data = averageGr[i].tbHour;
            obj.borderColor = randomArray([randomColor(1), randomColor(1)]);
            obj.radius = 0,
                obj.fill = false;
            arr.push(obj);
        }
        $(".groupface").empty();
        $(".groupface").append('<canvas id="line-chart" height="90vh" width="300vw"></canvas>');
        new Chart(document.getElementById("line-chart"), {
            type: 'line',
            data: {
                labels: ["1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h", "21h", "21h", "23h", "24h"],
                datasets: arr
            },
            options: {
                pointDotRadius: 0,
                title: {
                    display: true,
                    text: 'Time click on group facebook(in hour)'
                }
            }
        });
    }
    // js Average number of visits in a day
    let timeClickMonth = (customer) => {
        $(".averageMonth").empty();
        $(".averageMonth").append('<canvas id="bar-chart-grouped"  height="90vh" width="300vw"></canvas>');
        new Chart($("#bar-chart-grouped"), {
            type: 'bar',
            data: {
                labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
                datasets: [
                    {
                        label: "FACEBOOK",
                        backgroundColor: "#3e95cd",
                        data: customer.averageDayF
                    },
                    {
                        label: "EMAIL",
                        backgroundColor: "#8e5ea2",
                        data: customer.averageDayE
                    },
                    {
                        label: "SMS ",
                        backgroundColor: "gray",
                        data: customer.averageDayS
                    },
                    {
                        label: "OTHER",
                        backgroundColor: "#73d456",
                        data: customer.averageDayO
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Time Click(date)'
                }
            }
        });
    }
    // js chart detail total click
    let chartTotalDetail = (data) => {
        let total = data.clickF + data.clickE + data.clickS + data.clickO;
        $("#totalF").text(data.clickF);
        $("#totalE").text(data.clickE);
        $("#totalS").text(data.clickS);
        $("#totalO").text(data.clickO);
        $("#total").text(total);

        $(".tongquan").empty();
        $(".tongquan").append('<canvas id="doughnut-chart-tongquan" height="40vh" width="100vw"></canvas>');
        let arr2 = ["Facebook", "Email", "SMS", "Other"];
        new Chart($("#doughnut-chart-tongquan"), {
            type: 'doughnut',
            data: {
                labels: ["Facebook", "Email", "SMS", "Other"],
                datasets: [
                    {
                        label: "Overview tiem click",
                        backgroundColor: ["#7ab7da", "#81de65", "#f26854", "gray"],
                        data: [data.clickF, data.clickE, data.clickS, data.clickO]
                    }
                ]
            },
            options: {
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            var dataset = data.datasets[tooltipItem.datasetIndex];
                            var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                                return previousValue + currentValue;
                            });
                            var currentValue = dataset.data[tooltipItem.index];
                            var percentage = Math.floor(((currentValue / total) * 100) + 0.5);
                            return arr2[tooltipItem.index] + " " + percentage + "%";
                        }
                    }
                }
            }
        });
    }

    const randomColorFactor = function () {
        return Math.round(Math.random() * 255);
    };
    const randomColor = function (opacity) {
        //ex: randomColor(1);
        return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
    };
    let randomArray = (arr) => {
        let result = arr[Math.floor(Math.random() * arr.length)];
        return result;
    }

    // set Chart
    detailCampaign(customer, obCamp);
    chartTotalDetail(customer);
    timeClickMonth(customer);
    groupFace(customer.averageGr);
    browser(customer.browser);
    device(customer.device);
    osDesktop(customer.osDesktop);
    osPhone(customer.osPhone);
    mylocation(customer.objLocation);
})// end function ready



























