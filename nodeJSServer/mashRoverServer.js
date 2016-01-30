var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var useragent = require('useragent');
var session = require('express-session');
var express = require('express');
var topojson = require("topojson");
//var sys     = require("sys"); 
var path    = require("path");  
var filesys = require("fs");  
var uuid = require('node-uuid');
var logger = require('morgan');
var log4js = require('log4js');
var assert = require('assert');
var fs = require('fs');
var util = require('util');

var serialPortCom = require("serialport");
var SerialPort = require("serialport").SerialPort;

var comName;
var testMode;
var test  =  getCommPort(serialPortCom);

console.log ("test %s", test);

process.exit(); 
var sp = new SerialPort( getCommPort(serialPortCom), { parser: serialPortCom.parsers.readline(), baudrate: 9600}, {});

// is the xbee  FTDI
// lenardo - Arduino LLC
// clone lenardo - manufacture Unknown
// clone uno  -  Arduino Srl
// uno  Arduino (www.arduino.cc)
// mega - manufacture Arduino (www.arduino.cc)
// due - manufacture Arduino (www.arduino.cc)



////////////////////////////////////////////////////////
//
///		init the base express
var app = express();
////////////////////////////////////////////////////////
//
//                SERVICE CONFIG FILE
var Conf = require("./server.conf");
////////////////////////////////////////////////////////
//
//              log4js   setup
//
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file(Conf.logFile),Conf.log4jsHandle );
var logger = log4js.getLogger(Conf.log4jsHandle);
logger.setLevel(Conf.logLevel[Conf.env]);
////////////////////////////////////////////////////////
//
//              error shut down for unknow reasons catcher
//
/*
process.on('uncaughtException', function(err) {
        console.log ("uncaught exception found - exiting gracefully");
        console.log('Version: ' + process.version);
        console.log(process.versions);
        console.log(process.config)
        console.log('This platform is ' + process.platform);
        console.log(util.inspect(process.memoryUsage()));
        console.log(process.uptime());
        console.log(err);
        process.exit(1);
}); */

////////////////////////////////////////////////////////
//
//         start logging: Date() may seen redundant its not
//
logger.debug('Logger for %s is setup ', Conf.serviceName );
logger.debug('Starting %s server  %s',Conf.serviceName, Date() );
////////////////////////////////////////////////////////
//
//      Seed for Session: secretServiceID
//
var secretServiceID = genuuid("Secret Service ID creation");

////////////////////////////////////////////////////////
//
//              Express settings, routes,  etc.
//
//
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.engine('insert', require('ejs').renderFile);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use( 
    session({
        name:Conf.sessionName,
        genid: function (request) {
                logger.debug ('Session route called');
                return genuuid ("session");
        },
        secret:secretServiceID, // generated before we get here above;
        rolling: true,
        resave: true,
        cookie: { secure:false},
        saveUninitialized: true
    }) 
);




app.get(/^\/ajax\/\w{1,}\.html/, pageData, function (request, response) {
	logger.debug("we have a data call %s ", request.path);
    var subToRender  =    getPath(request).split('/');
	var renderThis =  subToRender[subToRender.length -1];
	logger.debug("render the sub page %s and %s" , subToRender, renderThis);
  	response.render(renderThis, request.pagedata);
});


app.get('/', function (request, response) {
    logger.debug("we have a data call %s ", request.path);
    response.render('index.html', { title: 'the index page!', session: session, baseref: base ,city : theirlocation, geo: geo.ll});

});





app.get(/^\/(img|css|js|images|music|wav|png|data|lib)\/.+$/, function (request, response) {
	request.session.data++;
	logger.debug (getPath(request));
    response.sendFile(getPath(request));
});

app.get('/music', function(request, response){
    response.set({'Content-Type': 'audio/mpeg'});
    filepath = Conf.soundEffectsDir + "beep.mp3";
    logger.debug ('send music files called %s ' , filepath);
    var readStream = fs.createReadStream(filepath);
    readStream.pipe(response);
});

///////////////////////////////////////////////
//
//		FUNCTIONS
//
function genuuid (whoCalledMe) {
    logger.debug("Generate UUID called by  %s", whoCalledMe);
    return  uuid.v1({
        node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
        clockseq: 0x1234,
        msecs: new Date('2014-07-01').getTime(),
        nsecs: 5678
    });
}

function blank(calledBy) {
	logger.debug("blank called %s", calledBy);
}
	
function pageData (req, rep, next)  {
	var agent = useragent.parse(req.headers['user-agent'])
	var langAccept  =  req.headers['accept-language'].match(/(^\w{1,2})/);	
    req.pagedata = { ip: req.ip, os: agent.os.toString() , language: lang.getLanguageName(langAccept[0]) , browser: agent.toAgent()  };
	next();
}


function getPath(request) {
    // SECURITY : is there an issue with the brower send req.path?
    logger.debug("getPath called %s", request.path);
    var test = decodeURIComponent(request.path);
    var publicPath = process.cwd() + "/public" + request.path;
    return publicPath;
}




// used to check valid user credentials MIDDLEWare
function checkUserAccess(request, response, next) {
    
}






// function to act as place holder functions in ways like promise
function blank (whoCalledMe) {
    logger.debug("Blank was called by % ", whoCalledMe);
}



function genuuid (whoCalledMe) {
    logger.debug("Generate UUID called by  %s", whoCalledMe);
    return  uuid.v1({
        node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
        clockseq: 0x1234,
        msecs: new Date().getTime(),
        nsecs: 5678
    });
}   



var closeWindow = "<div id=\"closeWindow\">Close Window</div>";
///////////////////////////////////////////////////////////////////
//              SERVER START 
var server = app.listen(Conf.serverPort[Conf.env], function () {
    var host = server.address().address;
    var port = Conf.serverPort[Conf.env];
    logger.info("Starting Service at http://%s:%s", host,port);
});


module.exports = app;


/// Functions ///
function messagesError (error) {
        if (testMode) {
                return;
        }
        console.log ("\nThere was an error %s", error);
        console.log ("Exiting...");
        process.exit(1);
}


function getCommPort (serial) {
	var comName;
    console.log (serial.list);
	serial.list(function (err, ports) {
        console.log ("ports", ports);
		ports.forEach(function(port) {
    	   var re = /(Arduino|FTDI|Unknown)/;
		  var str = port.manufacturer;
		  if (re.test(str)) {
			console.log ( port.comName);
			comName = port.comName;
		  }
		});
	}); 
    if (typeof comName == undefined) {
        process.exit();
    }
	return comName;
}

