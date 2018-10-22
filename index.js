const request = require('request');
const cheerio = require('cheerio');
request('https://translate.google.com/#en/vi/hour', (err, res, body) => {
    const $ = cheerio.load(body);
    console.log($('title').text())
})

//***************************************************************/
app.get('/test', (req, res) => {
    let now = new Date();
    let geo = {"range":[2064646144,2064654335],"country":"VN","region":"AS","eu":"0","timezone":"Asia/Ho_Chi_Minh","city":"Hanoi","ll":[21.0333,105.85],"metro":0,"area":1};
    let date = date1.format(now, 'MM/DD/YYYY');  // => '12:34 p.m.'
    let hour = date1.format(now,'HH');
    let ob_time = {date: date, hour: hour}; console.log("ob_time:", ob_time);


    let country = geo["country"]; let city = geo.city; console.log("country:" + country + " \ncity:" + city);
    let agent1 = useragent.parse(req.headers['user-agent']);
    let agent2 = useragent.parse(req.headers['user-agent'], req.query.jsuseragent);
    var agent3 = useragent.lookup(req.headers['user-agent']);
    var agent = useragent.parse(req.headers['user-agent']);// agent.toAgent() ; agent.os.toString();agent.os.toVersion()
   
    console.log("User agent:",  agent.device.toJSON());

    //get khu vuc 
    res.send("hello");


    const ip = req.clientIp;
    const geo = geoip.lookup(ip);
    //const type = typeof geo;
    const device = req.device.type;
    

    var agent = useragent.parse(req.headers['user-agent']); 
    let info = agent.toString();
    res.send('--> your ip: ' + ip + ',  --> geo: ' + JSON.stringify(geo) + "  --> Device:  " + thietbi + "   -->info: " + info + "  --> nameDevice: "+ agent.device.toString());

    
})


//***************************************************************/