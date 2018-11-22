$(function () {
    
    let overView = (idChart, nameChart, description) => {
        let data = $("#adminInfo").attr("data");
        data = JSON.parse(data);
        let max1 , max2;
        let limit = '1';
        let total;
        if(idChart == "idUser") total = data.totalUser;
        else if(idChart == "idCampaign") total = data.totalCamp;
        else if(idChart == "idLink") total = data.totalLink;
        else if(idChart == "idClick") total = data.totalClick;
        let len = total.toString().length;
        for( let i = 0; i < len; i++ ) {
            limit = limit + '0';
        }
        limit = Number(limit);
        max1 = limit / 2;
        max2 = Math.round((3/4)*limit);
        if(limit == 10) {
            max1 = 4;
            max2 = 8;
        }
        console.log("limit:", limit);
        console.log("max1:", max1);
        console.log("max2:", max2);

        const dataSource = {
            "chart": {
                "caption": description,
                "lowerlimit": "0",
                "upperlimit": limit,
                "showvalue": "1",
                "numbersuffix": nameChart,
                "theme": "fusion",
                "showtooltip": "0"
            },
            "colorrange": {
                "color": [
                    {
                        "minvalue": "0",
                        "maxvalue": max1,
                        "code": "#2ed42e"
                    },
                    {
                        "minvalue": max1,
                        "maxvalue": max2,
                        "code": "#ef812e"
                    },
                    {
                        "minvalue": max2,
                        "maxvalue": limit,
                        "code": "#ef2e2e"
                    }
                ]
            },
            "dials": {
                "dial": [
                    {
                        "value": total
                    }
                ]
            }
        };
        FusionCharts.ready(function () {
            var myChart = new FusionCharts({
                type: "angulargauge",
                renderAt: idChart,
                width: "500",
                height: "250",
                dataFormat: "json",
                dataSource
            }).render();
        });
    }



    overView("idUser", " user","Total number of registered users");
    overView("idCampaign", " camp","Total campaign created");
    overView("idLink", " link","Total links created");
    overView("idClick", " click","Total click");

})