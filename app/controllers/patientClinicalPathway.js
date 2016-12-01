/**
 * Created by Wemakefocus on 2016/7/26.
 */
'use strict';

angular.module('app')
    .controller('patientClinicalPathwayController',PatientClinicalPathwayController);
function PatientClinicalPathwayController($scope,Data,$rootScope,$http) {
    $scope.isMax = false;
    // if (!!$rootScope.dTypeSelected) $scope.dTypeSelected = $rootScope.dTypeSelected;
    if (!!$rootScope.pItemSelected) $scope.pItemSelected = $rootScope.pItemSelected;
    // $scope.dTypes = [
    //     "心力衰竭",
    //     "糖尿病",
    //     "肺病",
    //     "肥胖症",
    //     "慢性阻塞性肺病",
    //     "肾病"
    //     // "慢性肾病",
    //     // "高血压",
    //     // "高血脂",
    //     // "冠心病",
    //     // "哮喘"
    // ];
        $scope.pIds = [
        945209345,
        390870343,
        792838150,
        843209388,
        200483967,
        379404302,
        391970840,
        936108059,
        918102054,
        268058664,
        885653512,
        786333707,
        189759502,
        539164696,
        280543278
    ];
    $scope.getPid = function (dType) {
        // console.log($scope);
        // console.log(dType);
        // console.log(str);
        var num = $scope.dTypes.indexOf(dType);
        // console.log($scope.dTypes.indexOf(dType));
        // if(num < 0) alert("disease type is wrong !");
        var ids = Data.getPid(num).then(function (res) {
            // console.log(res);
            return res.Results;
        })
        return ids;
    };
    // $scope.dTypeChanged = function () {
    //     // console.log($scope.dTypeSelected)
    //     $rootScope.dTypeSelected = $scope.dTypeSelected;
    //     $scope.pItemSelected = [];
    //     // console.log($('form input'));
    //     $('form input').trigger('click');
    // }
    
    $scope.drawTimeline = function (pId) {

        $rootScope.pItemSelected = pId;

		var timeline_json = {
        "scale": "human",
        "title": {
            "media": {
                "caption": "",
                "credit": "",
                "url":"assets/img/timeline/placeholder.jpg",
                "thumb": 	""
            },
            "text": {
                "headline": "个人信息展示",
                "text": "<p></p>"
            }
        },
        "events": []
		};
        $("#timeline").html('');
        Data.getPatientByID(pId).then( function(res){
            console.log(res);
            var records = res.DIAGNOSIS.Records.concat(res.LAB.Records.concat(res.MEDICATION.Records.concat(res.PROCEDURE.Records)) );
            records.sort(function (a,b) {
                var dateA = Date.parse(new Date(a.DD)),dataB = Date.parse(new Date(b.DD));
                if ( dateA === dataB){
                    if(a.FTYPE === b.FTYPE)
                        return a.NAMECN.localeCompare(b.NAMECN);
                    else
                        return a.FTYPE.localeCompare(b.FTYPE);
                } else
                    return Date.parse(new Date(a.DD))-Date.parse(new Date(b.DD));
            });
            ////////////////////////////************Stop Drawing HGraph for now*************/////////////////
			var hGraphData = {"LAB":{"Records":res.LAB.Records}};
            // var data = res;
            // var l = data.length;
            // theF:for(var i=0;i<l;i++){
                // var sim = data[i].Similarities;
                // var l2 = sim.length;
                // console.log("interaction level 1");
                // for(var j=0;j<l2;j++){
                    // var seq = sim[i].Sequences;
                    // var l3 = seq.length;
                    // for(var k=0;k<l3;k++){
                        // if(records.length>200) break theF;
                        // records.push(seq[k]);
                        // hGraphData.LAB.Records.push(seq[k]);
                    // }
                     // console.log(records);
                // }
            // }
			// console.log(hGraphData);
            ////////////////////////////************Stop Drawing HGraph for now*************/////////////////

            // console.log(records);
            // var records = res.DIAGNOSIS.Records.concat(res.LAB.Records.concat(res.MEDICATION.Records.concat(res.PROCEDURE.Records)) );
            hGraphData.LAB.Records.sort(function (a,b) {
                var dateA = Date.parse(new Date(a.DD)),dataB = Date.parse(new Date(b.DD));
                if ( dateA === dataB){
                    if(a.FTYPE === b.FTYPE)
                        return a.NAMECN.localeCompare(b.NAMECN);
                    else
                        return a.FTYPE.localeCompare(b.FTYPE);
                } else
                    return Date.parse(new Date(a.DD))-Date.parse(new Date(b.DD));
            });
			console.log(hGraphData);
            var i = 0,
                iconrec = {"DIAGNOSIS":"Symptom.png","LAB":"Lab.png","MEDICATION":"Medication.png",
                    "PROCEDURE":"Clinicalpath.png"};
            var colorrec = {"DIAGNOSIS":"#FF9966","LAB":"#ACE1AF","MEDICATION":"#B9DCED",
                "PROCEDURE":"#cc99cc"};
            while(i<records.length){
                var event = {
                    "start_date":{},
                    "media": {
                        "caption": "",
                        "credit": "",
                        "url":"assets/img/timeline/placeholder.jpg",
                        "thumb": 	""
                    },
                    "text":{}
                };
                var eventTime = records[i].DD.split('-');
                event.start_date = {
                    "year": eventTime[0],
                    "month": eventTime[1],
                    "day": eventTime[2]
                };
                var name = '<div class="tl-nodesType-'+records[i].FTYPE.toLowerCase()+'"><img src="assets/img/timeline/' + iconrec[records[i].FTYPE] +
                    '" style="width:10px; height:10px;background-color:'+colorrec[records[i].FTYPE] +'">' + records[i].NAMECN;
                var num = 1;
                while(i < records.length-1 && records[i].NAMECN === records[i+1].NAMECN){
                    if(records[i].DD === records[i+1].DD){
						// console.log("the two are the same");
                        i++;
                        num++;
                    }else break;
					// console.log("the dates are the same");
                }
				// console.log("loop out!");
                if(num > 1){//http://localhost:3001/img/Clinicalpath.png
                    name += "*" + num;
                }
                name += '</div>';
                event.text.headline = name;
                console.log(records[i]);
                // if(records[i].FTYPE !== "LAB"){
                //     console.log(records[i]);
                //     var tableHtml = '<table><tr><td>';
                //     for(var key in records[i]){
                //         tableHtml += key + '</td><td>' + records[i][key] + '</td></tr><tr><td>';
                //     }
                //     tableHtml += '</table>';
                //
                //     event.text.text = tableHtml;
                // }

				console.log(event);
                timeline_json.events.push(event);
                i++;
				// console.log(i);
            }
			console.log(timeline_json);
			// console.log("out loop out");
//			console.log(timeline_json);
            var options = {
                language:"zh-cn"
            };
			console.log("going to init tl");
            var timeline = new TL.Timeline('timeline',timeline_json, options);
//				theme_color: "#288EC3",
//				ga_property_id: "UA-27829802-4"
console.log('did init TL');
            var types = ["diagnosis","lab","medication","procedure"];
                for(var i=0;i<types.length;i++){
                    var textEle = $(".tl-nodesType-"+types[i]);
                    $(".tl-nodesType-"+types[i]).parents(".tl-timemarker-content-container").css({"background-color":colorrec[types[i].toUpperCase()]});
                    $(".tl-nodesType-"+"procedure").parents(".tl-timemarker-content-container").prev(".tl-timemarker-timespan").children(".tl-timemarker-line-left")
                        .addClass("PROCEDURE");
                    $(".tl-nodesType-"+"medication").parents(".tl-timemarker-content-container").prev(".tl-timemarker-timespan").children(".tl-timemarker-line-left")
                        .addClass("MEDICATION");
                    $(".tl-nodesType-"+"lab").parents(".tl-timemarker-content-container").prev(".tl-timemarker-timespan").children(".tl-timemarker-line-left")
                        .addClass("LAB");
                    $(".tl-nodesType-"+"diagnosis").parents(".tl-timemarker-content-container").prev(".tl-timemarker-timespan").children(".tl-timemarker-line-left")
                        .addClass("DIAGNOSIS");
                }
            $('.tl-slidenav-content-container').click(function () {
                console.log('tl-slidenav-content-container clicked!');
                setTimeout("$('.tl-timemarker-active').trigger('click',console.log('trigger click'))",100);
            });
            for(var i=0;i<types.length;i++){
                var textEle = $(".tl-nodesType-"+types[i]);
                $(".tl-nodesType-"+types[i]).parents(".tl-timemarker-content-container").css({"background-color":colorrec[types[i].toUpperCase()]});
            }
            $(".tl-nodesType-lab").parents(".tl-timemarker").click(function(){
				console.log("lab node click!");
                console.log(this);
                console.log($(this).attr('id'));
                var markerId = $(this).attr('id');
                var slideId = markerId.substring(0,markerId.length-7);
                console.log(slideId);
				console.log($('#'+slideId));
				console.log($('#'+slideId).find(".tl-headline-date"));
				var curDate = $('#'+slideId).find(".tl-headline-date").html();
				var monthPos = curDate.indexOf('月'),dayPos = curDate.indexOf('日');
				var month,day;
				if(monthPos-6>0) month = curDate.substring(5,monthPos);
				else	month = "0" + curDate.substring(5,monthPos);
				if(dayPos-monthPos-3>0) day = curDate.substring(monthPos+2,dayPos);
				else	day = "0" + curDate.substring(monthPos+2,dayPos);
				var date = curDate.substring(0,4)+'-'+ month +'-' + day;
				console.log(curDate);
				console.log(slideId);
				console.log(hGraphData);
				console.log(date);
                drawHgraph(slideId,hGraphData,date);
            });
        })
    }

    var scrollFunc = function (e) {
        e = e || window.event;
        var ele = $('.tl-timenav');
        var wheelFun = function (val) {
            if(val>0)
                $(".tl-icon-zoom-in").trigger('click');
            else
                $(".tl-icon-zoom-out").trigger('click');
        }
        if(e.wheelDelta){
            wheelFun(e.wheelDelta);
//				console.log(e.wheelDelta);
//				console.log("e.wheelDelta!");
        }else if(e.detail){
            wheelFun(e.detail);
//				console.log("e.detail!")
        }
    }
    $(".tl-icon-zoom-in").context.onmousewheel = scrollFunc;
	 var drawHgraph = function(id,data,date){
        console.log('drawHgraph()');
        console.log(data);
        var drawInterval = setInterval(draw,100);
		var countNum = 0,waitingTime = 0;
		draw();
        function draw(){
            console.log("draw()");
			waitingTime++;
            console.log($('#'+id));
            var iframe = $('#'+id+' .tl-media-content img');
            if(iframe.length==0 && waitingTime < 20){
                console.log(iframe.length);
                return;
            }
			console.log(iframe);
            clearInterval(drawInterval);
//			console.log($(".tl-storyslider h2 img"));
//			console.log(iframe);
//			$(".tl-media-content img").hide();
            // <img class="tl-media-item tl-media-image tl-media-shadow" src="graph" style="max-height: 448px;">
             $("#hgraph").remove();
			 var html2Change;
			 if(waitingTime>19){
				 html2Change = $('#'+id+' .tl-media-content');
			 }else{
				 html2Change = iframe.parent();
			 }
            html2Change.html('<div id="hgraph" class="tl-media-item tl-media-image tl-media-shadow" src="graph" style="max-height: 448px;">' +
                '' +
                '<div id="map'+'" style="height: 340px;min-height: 300px;  min-width: 360px;"></div>' +
                '</div>');
//			iframe.remove();
//	var svg = d3.select("#graph")				//选择文档中的body元素
//				.append("svg")				//添加一个svg元素
//				.attr("width",400)		//设定宽度
//				.attr("height",200);	//设定高度
//	var dataset = [ 250 , 210 , 170 , 130 , 90 ];
//	var rectHeight = 25;	//每个矩形所占的像素高度(包括空白)
//	svg.selectAll("rect")
//		  .data(dataset)
//		  .enter()
//		  .append("rect")
//		  .attr("x",20)
//		  .attr("y",function(d,i){
//				return i * rectHeight;
//		  })
//		  .attr("width",function(d){
//		   		return d;
//		  })
//		  .attr("height",rectHeight-2)
//		  .attr("fill","steelblue");
            console.log("to draw hgraph");
			var targetId = "map"+countNum;
            // d3.json('lib/timeline/myhGraph/records.json',function (data) {
                myhGraph(data,date,"map");
				console.log(data);
                function myhGraph(metrics,day,testg){
                    setdata(metrics,day,testg);
                    initializeUser(metrics,day,testg);
                }
            // })

			countNum++;
        }

    }
	console.log("the end of ctl");
    $rootScope.pageLoading = false;
}