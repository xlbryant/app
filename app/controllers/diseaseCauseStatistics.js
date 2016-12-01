/**
 * Created by Wemakefocus on 2016/7/18.
 */
angular.module('app')
    .controller('DiseaseCauseStatisticsController',DiseaseCauseStatisticsController);
function DiseaseCauseStatisticsController($scope,Data,$rootScope) {

    $scope.isMax = false;
    // if(!!$rootScope.dTypeSelected) $scope.dTypeSelected = $rootScope.dTypeSelected;
    if(!!$rootScope.pItemSelected) $scope.pItemSelected = $rootScope.pItemSelected;
    $scope.dTypes = [
        "心力衰竭",
        "糖尿病",
        "肺病",
        "肥胖症",
        "慢性阻塞性肺病",
        "肾病"
    ];
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

    $scope.getPid = function (dType,str) {
        
        var num = $scope.dTypes.indexOf(dType);
       
        var ids = Data.getPid(num).then(function (res) {
           
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
    $scope.RenderBubbleChart = function(pId){
        
        if(!pId) pId = $rootScope.pItemSelected;
        $rootScope.pItemSelected = pId;
        d3.select("#bar").selectAll("svg").remove();
        d3.select("#bubble").selectAll("svg").remove();
        function count(obj){
            var k=0;
            for(var key in obj)
                k++;
            return k;
        }
        //@chen si rui
    queue().defer(d3.json, 'http://1.85.37.136:9999/usdata/riskScore/?q=%7B%22Pid%22:'+pId+'%7D')
           .defer(d3.json, 'http://1.85.37.136:9999/usdata/featureImportance/?q=%7B%22Pid%22:'+pId+'%7D')
           .await(renderBubbleChart);

        var margin = {top: 40, right: 20, bottom: 30, left: 40};

        if($scope.isMax==false) {
            var width=$(".widget-body").width()*0.5;
            var height = 600 - margin.top - margin.bottom;
            $("#bar").css("height",height+"px");
            $("#bubble").css("height",height+"px");
        } else{

            var height=$(".widget-body").height();
            var width=$(".widget-body").width()*0.5;
            $("#bar").css("height",height+"px");
            $("#bubble").css("height",height+"px");
        }
        
/////////////////////////////// render bubblec chart //////////////////////////////////////////

        function renderBubbleChart(error, diseaseNew, featureNew) {
            if (error) throw error;

            function processData(data) {
                var obj = data;
                var newDataSet = [];
                for(var prop in obj) {
                    newDataSet.push({name: data[prop].disease, className: prop.toLowerCase(), size: obj[prop].risk_score});
                }
                return {children: newDataSet};
            };



            // 定义颜色比例尺，用于bubble填充
            var blue=d3.rgb(174,238,238);
            var orange=d3.rgb(255,130,71);
            var Color=d3.interpolate(blue,orange);

            //定义bubble图的tooltips
            var tipsForBubble=d3.tip()
                .attr('class', 'd3-Bubbletip')
                .offset([-10, 0])
                .html(function(d) {
                    return "<strong>患病概率:</strong> <span style='color:white'>" + d.value.toFixed(2) + "</span>";
                });

            //定义bar图的tooltips
            var tipsForBar=d3.tip()
                .attr('class', 'd3-Bartip')
                .offset([0, 0])
                .html(function(d) {
                    return "<strong>致病概率:</strong> <span style='color:white'>" + d.value.toFixed(5) + "</span>";
                });




            var bubble = d3.layout.pack()
                .size([width, height])
                .value(function(d) {return d.size;})
                .padding(3);

            var nodes = bubble.nodes(processData(diseaseNew.Results))
                .filter(function(d) { return !d.children; }); // filter out the outer bubble
            // console.log(nodes);


            function MaxNode(nodes)
            {
                var temp;
                var leng=nodes.length;
                for (var i=0;i<leng;i++)
                    if (nodes[i]>nodes[i+1])
                    {temp=nodes[i];
                        nodes[i]=nodes[i+1];
                        nodes[i+1]=temp;}
                return nodes[leng-1];

            }
            var MaxDisease=MaxNode(nodes);
            var maxname=MaxDisease.name;
            // console.log(featureNew.Results[maxname]);

            // console.log(featureNew.Results[maxname].length);
            var featureValues=[];
            for (var i=0;i<featureNew.Results[maxname].length;i++)
                for (var key in featureNew.Results[maxname][i])
                    featureValues.push({"variable":key,"value":featureNew.Results[maxname][i][key]});
            featureValues.sort(function(a,b){return a.value<b.value?1:-1;});


            var svg = d3.select('#bubble').append('svg')
                .attr('width', width)
                .attr('height', height);

            var svgDetails=d3.select('#bar').append('svg')
                .attr('width',width)
                .attr('height',featureValues.length*30+100)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .call(tipsForBar);

            svg.call(tipsForBubble);

            //比例尺和坐标轴
            var x = d3.scale.linear()
                .range([0,width-100]);

            var y = d3.scale.ordinal()
                .rangeRoundBands([0,featureValues.length*30],.1);

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("top")
                .ticks(6, "%");


            y.domain(featureValues.map(function(d) { return d.variable; }));
            x.domain([0, 1.5*d3.max(featureValues, function(d) { return d.value; })]);

            //bar chart的x轴
            svgDetails.append("g")
                .attr("class", "xaxis")
                .attr("transform", "translate(0,30)")
                .call(xAxis);

            //bar chart的y轴
            svgDetails.append("g")
                .attr("class", "yaxis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("病因");


            //添加bar
            svgDetails.selectAll(".bar")
                .data(featureValues)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("transform", "translate(0,30)")
                .attr("y", function(d) { return y(d.variable); })
                .attr("height", y.rangeBand())
                .attr("x", function(d) { return 0; })
                .on("mouseover",tipsForBar.show)
                .on("mouseout",tipsForBar.hide)
                .attr("width",function (d){return 0;})
                .transition()
                .duration(400)
                .attr("width", function(d) { return x(d.value); })
                .attr("fill",d3.rgb(210,180,130));
            //为bar元素添加text
            svgDetails.selectAll(".featuretext")
                .data(featureValues)
                .enter().append("text")
                .attr("class","featuretext")
                .attr("text-anchor","right")
                .attr("transform","translate(0,30)")
                .attr("x",function(){return 0;})
                .style({"opacity":0,"color":"white"})
                .transition()
                .duration(400)
                .style("opacity",1)
                .attr("x",function(d){return x(d.value);})
                .attr("y",function(d){return y(d.variable);})
                .attr("dy",15)
                .attr("dx",4)
                .text(function(d){return d.variable;});


            var radius=[];
            for(var i=0;i<nodes.length;i++)
            {radius.push(nodes[i].r);}
            // console.log(radius);
            var textScale=d3.scale.linear()
                .domain([0,d3.max(radius)])
                .range([0,10])



            var risks=[];
            for (var key in diseaseNew.Results)
            {risks.push(diseaseNew.Results[key].risk_score);}


            var min=0;
            var max=d3.max(risks);
            // console.log(risks);
            // console.log(nodes);

            var linear=d3.scale.linear()
                .domain([min,max])
                .range([0,1]);


            //添加bubble元素
            var circles=svg.selectAll('circle')
                .data(nodes);

            var tipsForBubble=d3.tip()
                .attr('class', 'd3-Bubbletip')
                .offset([0, 0])
                .html(function(d) {
                    return "<strong>患病概率: </strong><span style='color:white;'>" + d.value.toFixed(2) + "</span>";
                });
            svg.call(tipsForBubble);

            circles.enter()
                .append('circle')
                .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
                .attr('r', function(d) { return d.r; })
                .attr('class', "circle")
                .attr("fill",function(d,i){
                    var t=linear(risks[i]);
                    var fill=Color(t);
                    return fill.toString();})
                .on("mouseover",tipsForBubble.show)
                .on("mouseout",tipsForBubble.hide);

            // console.log(d3.selectAll('#bubble svg circle'));
            var rMax = 0,nMax;
            d3.selectAll('#bubble svg circle').each(function (d,i) {
                // console.log(d);
                // console.log(d3.select(this).attr('r'));
                var r = d3.select(this).attr('r');
                if(r > rMax){
                    rMax = r;
                    nMax = d3.select(this);
                }
            });
            nMax.style({stroke:"red","stroke-width":"2px"});

            circles.on("click", function(d, i) {//为每一个bubble元素添加一个click事件，绘制相应的barchart
                d3.selectAll('.circle').style({"fill":function(d,i){
                    var t=linear(risks[i]);
                    var fill=Color(t);
                    return fill.toString();},"stroke-width":"0px"})
              
                d3.select(this).style({stroke:"red","stroke-width":"2px"});
                d3.select("#bar").selectAll("svg").remove();

                

                //添加svg用于绘制bar chart


                var featureValues=[];
                var LengthOfFeature=featureNew.Results[d.name].length;
                // console.log(LengthOfFeature);
                for(var i=0;i<LengthOfFeature;i++)
                    for(var key in featureNew.Results[d.name][i])
                        featureValues.push({"variable":key,"value":featureNew.Results[d.name][i][key]});
                    
                featureValues.sort(function(a,b){return a.value<b.value?1:-1;});

                var svgDetails = d3.select("#bar").append("svg")
                    .call(tipsForBar)
                    .attr("width", width /*+ margin.left + margin.right+200*/)
                    .attr("height", featureValues.length*30+100 /*+ margin.top + margin.bottom*/)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                var length=count(featureNew.Results[d.name]);

                //比例尺和坐标轴
                var x = d3.scale.linear()
                    .range([0,width-100]);

                var y = d3.scale.ordinal()
                    .rangeRoundBands([0,length*30],.1);

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("top")
                    .ticks(6, "%");


                y.domain(featureValues.map(function(d) { return d.variable; }));
                x.domain([0, 1.5*d3.max(featureValues, function(d) { return d.value; })]);

                //bar chart的x轴
                svgDetails.append("g")
                    .attr("class", "xaxis")
                    .attr("transform", "translate(0,30)")
                    .call(xAxis);

                //bar chart的y轴
                svgDetails.append("g")
                    .attr("class", "yaxis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("病因");

                //添加bar
                svgDetails.selectAll(".bar")
                    .data(featureValues)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("transform", "translate(0,30)")
                    .attr("y", function(d) { return y(d.variable); })
                    .attr("height", y.rangeBand())
                    .attr("x", function(d) { return 0; })
                    .on("mouseover",tipsForBar.show)
                    .on("mouseout",tipsForBar.hide)
                    .attr("width",function (d){return 0;})
                    .transition()
                    .duration(400)
                    .attr("width", function(d) { return x(d.value); })
                    .attr("fill",d3.rgb(210,180,130))
                ;
                //为bar元素添加text
                svgDetails.selectAll(".featuretext")
                    .data(featureValues)
                    .enter().append("text")
                    .attr("class","featuretext")
                    .attr("text-anchor","right")
                    .attr("transform","translate(0,30)")
                    .attr("x",function(){return 0;})
                    .style({"opacity":0,"color":"white"})
                    .transition()
                    .duration(400)
                    .style("opacity",1)
                    .attr("x",function(d){return x(d.value);})
                    .attr("y",function(d){return y(d.variable);})
                    .attr("dy",15)
                    .attr("dx",4)
                    .text(function(d){return d.variable;});


            });
            //为bubble元素添加text
            // console.log("bubbletext append!");
            svg.selectAll("bubbletext")
                .data(nodes)
                .enter()
                .append('text')
                .attr("class","bubbletext")
                .attr("x",function(d){ return d.x; })
                .attr("y",function(d){ return d.y; })
                .attr("text-anchor","middle")
                .text(function(d){return d.name;})
                .style("opacity",function(d){if (d.r==0)return 0;else return 1;})
                .attr("font-size",function(d){
                    if(d.name.length<5){
                        // console.log(d.r/d.name.length+"px");
                        return (d.r/d.name.length+"px");
                    }
                    else{
                        return (d.r*1.6/d.name.length+"px");}
                        	});

        };
    };
    // if(!!$rootScope.pItemSelected) $scope.RenderBubbleChart($rootScope.pItemSelected);
    $rootScope.pageLoading = false;
}