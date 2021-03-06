  var cssSetDefault = {  
        "width": 550,  
        'visibility':'visible',
        "height": 400, 
        "z-index": 0, 
        "top": 50, 
        "right": 1,
        "position": "absolute"  
      };

  var engineMin = 0;
  var engineMax = 255;
  var idsetPrev = "";
  var locationImgPrev = "";
  var xmlhttp;
  var sizeFlag = 0;
  var re = /(ipad|iphone)/i;


$(function() {
  // when document loads this jquery docuement body runs.

  // check for ipad or iphone browsers and hide the 
  // slider controls  the do not work on the ipad but 
  // can still drive the rover with those devices
  var match = re.exec(navigator.userAgent);
  if (match) {
    $("#slider-impulseH").hide();
    $("#slider-vertical2").hide();
    $("#slider-vertical3").hide();
  }

  // set the canvas to default values
  // we do use this for zooming in later
  $("#myCanvas").addClass(cssSetDefault);
  $("#myCanvas").show();
  // TODO rewrite completely  using addClass and rmClass

  var sizeFlag = 0;
  // set the update request to 1500 ms
  // This gets the tank data etc 
  // AskforDataFromNode sets all the variables for the tank from the server
 
  var myVar = setInterval(function(){
    askForDataFromNode({roverData:1});
  }, 1500);

  // click event.
  $("#forward").click(function(){
    changeIndicator('#forwardImg', 'images/forward_green.jpg', {color:"#ffffff",direction:"forward"});
  });

  $("#back").click(function(){
    changeIndicator('#backImg', 'images/back_green.jpg',{color:"#ffffff",direction:"back"});
  });

  $("#left").click(function(){
  	changeIndicator('#leftImg', 'images/left_green.jpg',{color:"#ffffff",direction:"left"});
  });

  $("#right").click(function(){
  	changeIndicator('#rightImg', 'images/right_green.jpg', { color:"#ffffff",direction:"right"});
  });

  $("#stop").click(function(){
		changeIndicator("", "", {color:"#ff0000", directon:"stop"});
  }); 

  // sliders do not work on tablets
  $("#slider-impulseH").slider({
		orientation: "hortizonal",
		range: "min",
		min: 300,
		max: 2500,
		step: 100,
		value: 500,
		slide: function( event, ui ) {
  		$( "#engineI" ).text( ui.value );
		  askForDataFromNode ({engine:ui.value,engineUpDate:"power"});
		},
	  change: function( event, ui ) {
		 $( "#engineI" ).text( ui.value );
	  }
  });

	$("#slider-vertical2").slider({
		orientation: "vertical",
		range: "min",
		min: engineMin,
		max: engineMax,
		value: 60,
		slide: function( event, ui ) {
  		$( "#amount2" ).text( ui.value );
	    askForDataFromNode ({engine:ui.value,engineUpDate:"left"});
		},
	  change: function( event, ui ) {
		  $( "#amount2" ).text( ui.value );
	  }
  });

	$("#slider-vertical3").slider({
		orientation: "vertical",
		range: "min",
		min: engineMin,
		max: engineMax,
		value: 60,
		slide: function( event, ui ) {
  		$( "#amount3" ).text( ui.value );
		  askForDataFromNode ({engine:ui.value,engineUpDate:"right"});
    },
	  change: function( event, ui ) {
  		$( "#amount3" ).text( ui.value );
	  }
	});

   // canvas click, that enlarges the radar
   // this acts like a detail zoon for the radar
   // we use the sizeflag so when clicked we can return to 
   // normal "default"
  $("#myCanvas").click(function(){
    if (sizeFlag == 1) {
      $("#myCanvas").css(cssSetDefault);
      $("#myCanvas").show();
      // flag signals signals radar is small map
      sizeFlag = 0;
    } 
    else {
      // set the windows to full size
      var y =  $.getDocHeight() ;
      var x  = $.getDocWidth() ;   
       cssSet = {  
        "width": x,  
        "height": y, 
        "z-index": 0, 
        "top": 1, 
        "right": 1,
        "position": "absolute",
        "z-index": 3  
      };
      $("#myCanvas").css(cssSet);
      $("#myCanvas").show();
      // flag signals signals radar is large map
      sizeFlag = 1;
    }    
  });

  /* changes the colours to active  */
  function changeIndicator (idset, locationImg, data) {
  	if (idsetPrev) {
  		$(idsetPrev).attr('src',locationImgPrev);
  	}	
  	idsetPrev = idset;
  	locationImgPrev = $(idset).attr('src');
  	$(idset).attr('src',locationImg);
    askForDataFromNode (data);
  }

  var xmlhttp;
  function loadXMLDoc(url, cfunc) {
  	if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
    	xmlhttp=new XMLHttpRequest();
    }
  	else {   // code for IE6, IE5
    	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
  	xmlhttp.onreadystatechange=cfunc;
  	xmlhttp.open("GET",url,true);
  	xmlhttp.send();
    //console.log(xmlhttp);
  }

  function askForDataFromNode(data) {
    console.log("aaaa ask for data " );
    console.log (data);
  	var str = $.param(data);
    console.log (str.legnth);

  	loadXMLDoc("index.html?" + str , function() {
        console.log (xmlhttp);

      	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
    		  processFeedBack($.parseJSON(xmlhttp.responseText)) ;
        }
    });
  }

  function processFeedBack (data) {
    // this is the core of changing the data that 
    // is feedback from the node server or the rover

   	$("#status1").text( data.range );
    if ((data.lastCommand != "roverdata") && ( data.lastCommand != "roverdataroverdata")){
  	   $("#status2").text( data.lastCommand );
    }
    
    if (data.alert) {
    	$("#status1,#status2,#status3, #status4").css("color", "#FF6802");
  		$("#status3").text( data.alert);
  		changeIndicator("","");
  		return;
  	}	
  	else if (data.lastCommand == "stop") {
      changeIndicator("","");
  		$("#status2").text( " ");
  		$("#status2,#status1").css("color", "#DE6262");
  	}
  	else { 
  		$("#status1,#status2,#status3").css("color", "#000000");
  		$("#slider-vertical2").slider("value",data.leftEngine);
  		$("#slider-vertical3").slider("value", data.rightEngine);
  	}
    
    $("#engineL").text(data.leftEngine);
    $("#engineR").text(data.rightEngine);
    $("#engineI").text(data.engineImpulse);
    $("#rangeD").text(data.range);
    $("#status3").text(data.Ready4Command);
    drawScannerData(data.radarData);
  }

  function drawScannerData (data) {
    /* Three phase draw
      1) draw the outter shell and fill the ranges
      2) draw the range lines for each 5 degrees
      3) draw the scanning cone lines
    */ 
    var c = document.getElementById("myCanvas");
    var dataList = new Array();
    var ctx = c.getContext("2d");
    //console.log(data);
    ctx.clearRect(0, 0, 550, 400);

    var alertFlag = false;
    $("#status4").text(data.Ready4Command);
    $("#status3,#status4").css("color", "#000000");
    var baseX = 275;
    var baseY = 400;
    var baseRatio = .9;
    ctx.beginPath();
    dataList = data.split(/,/);


    ctx.lineTo(baseX,baseY);
    // draw the outter limit of determiend clear range
    // fill it in with grey
    for (i= 1; i < dataList.length; i++) { 
      var quad = 1;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      range = (dataList[i] * baseRatio);
      degree = 20 + (i * 5);
      if (degree > 90) {
        degree = 180 - degree;
        quad  = 2
      }
      //console.log(i + "  ---- " + range + " " + degree);
      radian = degree * (3.142 / 180);
      var x_new = range * Math.cos(radian);
      var y_new = baseY - Math.sqrt ( (range * range) - (x_new * x_new));

      if (quad === 2) {
          x_new = x_new + baseX;   
      }
      else {
        x_new = baseX - x_new;
      }
      //console.log("--->" + x_new + " y---->" + y_new);
      ctx.lineTo(x_new,y_new);
    }    
    ctx.lineTo(baseX,baseY);

    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle="grey";
    ctx.fill();
    ctx.stroke();

    // radar spoke colours for the range lines
    var colors = [
      "#ff0000", //25
      "#ff0000", //30
      "#000000", //35
      "#ff0000", //40
      "#000000", //45 
      "#ff0000", //50
      "#000000", //55
      "#ff0000", //60
      "#000000",  //65
      "#ff0000",  //70
      "#000000", //75
      "#ffff00", //80
      "#ff00ff", // 85
      "#ffffff", // 90
      "#ff00ff", // 95
      "#ffff00", // 100
      "#ffff00",
      "#ff0000",
      "#000000",
      "#ff0000",
      "#000000",
      "#ff0000",
      "#000000",
      "#ff0000",
      "#000000",
      "#ff0000" 
    ];
  
    for (i= 1; i < dataList.length; i++) {  
        quad = 1;
      


      ctx.lineWidth = 3;

      range = (dataList[i] * baseRatio);
      // over ride the colours for range lines
      if (range < 30) {
         ctx.strokeStyle = "#ff0000" ;
      }
      else if (range >= 30 && range <= 90) {
        ctx.strokeStyle = "#ffff00" ;
      }
      else {
          ctx.strokeStyle = "#00ff00" ; 
      }

      degree = 25 + (i * 5);
      if (degree >= 85 && degree <= 95 && range <= 40) {
          alertFlag = true;
      }
      // graph is Cartesian coordinate system quadran system
      // Quadrant 4 and 1 , when first draw in 4 and then quad 2
      if (degree > 90) {
        degree = 180 - degree;
        quad  = 2
      }
      //console.log("count " +i + "degree " + degree + " color " + colors[i] + " range " + range);
      radian = degree * (3.142 / 180);
      var x_new = range * Math.cos(radian);
      var y_new = baseY - Math.sqrt ( (range * range) - (x_new * x_new));
      if (quad === 2) {
          x_new = x_new + baseX;   
      }
      else {
        x_new = baseX - x_new;
      }
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(x_new, y_new);
      ctx.stroke();
    }  
    if (alertFlag) {
      $("#status3").text("WARN");
      $("#status4").text("RANGE 4");
      $("#status3,#status4").css("color", "#DE6262");
    }

    // draw outer cone shape not actual readings.
    var range = 400;
    radian = 30 * (3.142 / 180);
    var x_new = range * Math.cos(radian);
    
    var y_new = baseY - Math.sqrt ( (range * range) - (x_new * x_new));
    ctx.strokeStyle = "#FFffFF" ;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.lineTo((baseX + x_new), y_new);
    ctx.stroke();

    range = 400;
    radian = 30 * (3.142 / 180);
    x_new = range * Math.cos(radian);
    
    y_new = baseY - Math.sqrt ( (range * range) - (x_new * x_new));
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.lineTo((baseX - x_new), y_new);
    ctx.stroke();
  }

  function roverOverLay (status) {
    // when called will draw a orange box on the overlay
    var c = document.getElementById("myCanvas");
    var dataList = new Array();
    var ctx = c.getContext("2d");

    var baseX = 275;
    var baseY = 400;
    var baseRatio = .9;
    ctx.beginPath();
    ctx.fillStyle = '#ff6600';
    ctx.fillRect(baseX - (10 *baseRatio),baseY-(50*baseRatio),(20 * baseRatio),(50*baseRatio));
    ctx.stroke();
  }

});

$.getDocHeight = function(){
  // this gets back the proper size  of the body height in any browser.
        var db = document.body;
        var dde = document.documentElement;
    return Math.min( db.scrollHeight, dde.scrollHeight, db.offsetHeight,
        dde.offsetHeight, db.clientHeight, dde.clientHeight,
        $(document).height(), $(window).height(),
        document.documentElement.clientHeight);
};

$.getDocWidth = function(){
    // this gets back the proper size  of the body width in any browser.
        var db = document.body;
        var dde = document.documentElement;
        return Math.min( db.scrollWidth, dde.scrollWidth, db.offsetWidth,
                dde.offsetWidth, db.clientWidth, dde.clientWidth, $(document).width(),
                $(window).width(), document.documentElement.clientWidth);
};

