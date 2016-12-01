/**
 * Created by wemakefocus on 2016/7/30.
 */
'use strict';

angular.module('app')
    .controller('sankeyMedController',function($scope,Data,SPMedicationSharedDataService,$interval,$location,$rootScope){
          
           $scope.cohortslist = {model:"1",lists:[]};
           $scope.patients = 5;
           $scope.patterns = 2;
           $scope.indexs = 0;
           $scope.eventsByID_cpy = {};
           $scope.eventsByID = {};
           $scope.sandata = {};
           $scope.frequency = [];

        
/////////////////////////////////////////// watch event STARTRENDER from service SPDiaosisSharedData /////////////////////////////////
      $scope.$on('STARTRENDER', function (event, args) {

          $scope.drawSankey();

      });
     
///////////////////////////////////// get data from service ///////////////////////////////////    
      $scope.drawSankey = function () {

          var sharedData = SPMedicationSharedDataService.getData();
          $scope.sandata = sharedData.sankeyData;
          var name_cn ={
                "ChronicObstructivePulmonaryDis":"慢性阻塞性肺病",
                "Heart_failure":"心力衰竭",
                "Obesity":"肥胖症",
                "PulmonaryDis":"肺病",
                "KidneyDis":"肾病",
                "Diabetes":"糖尿病"
            };

            for(var i = 0 ;i<$scope.sandata.length; i++){
                  var patilist = {};
                  patilist["id"] = $scope.sandata[i].CohortIdx;
                  patilist["name"] = name_cn[$scope.sandata[i].CohortName];
                  $scope.cohortslist.lists.push(patilist);
                  var similarities = $scope.sandata[i].Similarities;
                  for(var j= 0; j < similarities.length ; j++){
                      var sequ = similarities[j].Sequences;
                      similarities[j].Sequences = d3.nest()
                          .key(function(d) { return d["DD"]; })
                          .sortKeys(d3.ascending)
                          .entries(sequ);
                  }
              }

                        $scope.dealSankeyData();
            }


///////////////////////////////// decide which cohort of data to draw sankey, First, choose the first one /////////////////////
      $scope.dealSankeyData = function(){

             $scope.eventsByID  = clone($scope.sandata[0].Similarities);
             $scope.eventsByID_cpy = clone($scope.sandata[0].Similarities);
             $scope.createData_new();

         }


        
//////////////////////////////////////////// decide alignment point and choose data to display ///////////////////////   
        $scope.createData_new = function(){

            $("#chart_sankeys_med svg g").html("");
            var datas = $scope.eventsByID;
            var hlen = $scope.patterns;
            var stv = [];
            for(var i = 0,leni = $scope.patients;i < leni&&i<datas.length;i++){
                var refTime = datas[i].RefTime;
                //console.log(refTime);
                var refIndex = 0;
                for(var j = 0, lenj = datas[i].Sequences.length-1; j < lenj; j++ ){
                    if(datas[i].Sequences[j].key == refTime)
                    {
                        refIndex = j;
                    }
                }
                //console.log(refIndex);
                for(var j = 0, lenj = 2*hlen; j<lenj; j++){
                    var linkIndex = refIndex+j;

                    if(linkIndex<-1 || linkIndex > (datas[i].Sequences.length - 1))
                    {
                        // stv.push({"source": j+"_",
                        //    "target": (j+1)+"_",
                        //     "value": 1});
                    }
                    else if(linkIndex == -1){
                        //var nextValues = eventsByID[i].values[linkIndex+1].values;
                        // var nextValues =  datas[i].Sequences[linkIndex+1].values;
                        // for(var jj = 0, lenjj = nextValues.length; jj < lenjj; jj++){
                        //     stv.push({"source": j + "_",
                        //               "target": (j+1) + "_" + nextValues[jj]["NAMECN"],
                        //               "value": 1});
                        //   }
                    }
                    else if(linkIndex == (datas[i].Sequences.length - 1)){
                       // var curValues = eventsByID[i].values[linkIndex].values;
                        // var curValues = datas[i].Sequences[linkIndex].values;
                        // for(var ii = 0, lenii = curValues.length; ii < lenii; ii++){
                        //     stv.push({"source": j + "_" + curValues[ii]["NAMECN"],
                        //              "target": (j+1) + "_",
                        //              "value": 1});
                        // }
                    }
                    else
                    {
                        var curValues = datas[i].Sequences[linkIndex].values,
                            nextValues = datas[i].Sequences[linkIndex+1].values;
                        // console.log(curValues);
                        // console.log(nextValues);
                        for(var ii = 0, lenii = curValues.length; ii < lenii; ii++){

                            for(var jj = 0, lenjj = nextValues.length; jj < lenjj; jj++){

                                if((curValues[ii]["NAMECN"]!= undefined) && (nextValues[jj]["NAMECN"]!=undefined)){

                                    stv.push({"source": curValues[ii]["NAMECN"] + "_" + j,
                                        "target": nextValues[jj]["NAMECN"] + "_" + (j+1),
                                        "value": 1});

                                }
                            }
                        }
                    }

                }

            }
            $scope.createSankey(stv);
           // console.log(stv);
        }


///////////////////////////////////////////////////////// layout the sankey and draw it ////////////////////////////////////////////

        $scope.createSankey = function(data){
           
                    var units = "Widgets";

                    var margin = {top: 10, right: 20, bottom: 10, left: 10},
                        width = $('#chart_sankeys_med').width() - margin.left - margin.right,
                        height = 1000 - margin.top - margin.bottom;

                    var formatNumber = d3.format(",.0f"),    // zero decimal places
                        format = function(d) { return formatNumber(d) + " " + units; },
                        color = d3.scale.category20();

                    // append the svg canvas to the page
                    $("#chart_sankeys_med").html("");
                    var svg1 = d3.select("#chart_sankeys_med").append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform",
                            "translate(" + margin.left + "," + margin.top + ")");

                    // Set the sankey diagram properties
                    var sankey = d3.sankey()
                        .nodeWidth(36)
                        .nodePadding(40)
                        .width($('#chart_sankeys_med').width()*0.9)
                        .size([width, height]);

                    var path = sankey.link();
                    var sizes=0;


                    var  graph = {"nodes" : [], "links" : []};

                    data.forEach(function (d) {
                        graph.nodes.push({ "name": d.source });
                        graph.nodes.push({ "name": d.target });
                        graph.links.push({ "source": d.source,
                            "target": d.target,
                            "value": d.value });
                    });

                    graph.nodes = graph.nodes.filter(
                        function(d)
                        {return d.name.charAt(d.name.length - 1) != "_";})
                    graph.links = graph.links.filter(
                        function(d) {return (d.source.charAt(d.source.length - 1) != "_"
                        && d.target.charAt(d.target.length - 1) != "_");})

                    // return only the distinct / unique nodes
                    graph.nodes = d3.keys(d3.nest()
                        .key(function (d) { return d.name; })
                        .map(graph.nodes));

                    // loop through each link replacing the text with its index from node
                    graph.links.forEach(function (d, i) {
                        graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
                        graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
                    });

                    //now loop through each nodes to make nodes an array of objects
                    // rather than an array of strings
                    graph.nodes.forEach(function (d, i) {
                        graph.nodes[i] = { "name": d };
                    });
                    // console.log(graph.nodes);
                    sankey
                        .nodes(graph.nodes)
                        .links(graph.links)
                        .layout(32);
                
                    var link = svg1.append("g").selectAll(".link")
                        .data(graph.links)
                        .enter().append("path")
                        .attr("class", "link")
                        .attr("d", path)
                        .style("stroke-width", function(d) { return Math.max(1, d.dy); })
                        // .style("stroke-width", 0.1)
                        .style("stroke","#000")
                        .style("stroke-opacity",0.2)
                        .sort(function(a, b) { return b.dy - a.dy; });

                    // add the link titles
                    link.append("title")
                        .text(function(d) {
                            return d.source.name + " → " +
                                d.target.name + "\n" + format(d.value); });

                    // add in the nodes
                    var node = svg1.append("g").selectAll(".node")
                        .data(graph.nodes)
                        .enter().append("g")
                        .attr("class", "node")
                        .attr("transform", function(d) {
                            return "translate(" + d.x + "," + d.y + ")"; })
                        .call(d3.behavior.drag()
                            .origin(function(d) { return d; })
                            .on("dragstart", function() {
                                this.parentNode.appendChild(this); })
                            .on("drag", dragmove));

                    // add the rectangles for the nodes
                    node.append("rect")
                        .attr("height", function(d) { return d.dy; })
                        .attr("width", sankey.nodeWidth())
                        .style("fill", function(d) {
                            return d.color = color(d.name.substring(0,d.name.length-2)); })
                        .style("stroke", function(d) {
                            return d3.rgb(d.color).darker(2); })
                        .append("title")
                        .text(function(d) {
                            return d.name + "\n" + format(d.value); });

                    // add in the title for the nodes
                    node.append("text")
                        .attr("x", -6)
                        .attr("y", function(d) { return d.dy / 2; })
                        .attr("dy", ".35em")
                        .attr("text-anchor", "end")
                        .attr("transform", null)
                        .text(function(d) { return d.name.substring(0,d.name.length-2); })
                        .filter(function(d) { return d.x < width / 2; })
                        .attr("x", 6 + sankey.nodeWidth())
                        .attr("text-anchor", "start");

                    // the function for moving the nodes
                    function dragmove(d) {
                        d3.select(this).attr("transform",
                            "translate(" + d.x + "," + (
                                d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
                            ) + ")");
                        sankey.relayout();
                        link.attr("d", path);
                    }


        };
        //$scope.apply();
        $scope.refreshsankey = function(){
            
            $scope.createData_new();

        }


      
/////////reder chart  need to be written again  ////////////

        //reader chart
        // function renderChart(data) {
        //     // console.log(data);
        //     $("#fre_med").html("");
        //     var margin = {top: 20, right: 10, bottom: 30, left: 30},
        //         width = $("#fre_med").width() - margin.left - margin.right,
        //         height = 200 - margin.top - margin.bottom;
        //     var x = d3.scale.ordinal()
        //         .rangeRoundBands([0, width], .1);

        //     var y = d3.scale.linear()
        //         .range([height, 0]);

        //     var xAxis = d3.svg.axis()
        //         .scale(x)
        //         .orient("bottom");

        //     var yAxis = d3.svg.axis()
        //         .scale(y)
        //         .orient("left");

        //     var chart = d3.select("#fre_med")
        //         .attr("width", width + margin.left + margin.right)
        //         .attr("height", height + margin.top + margin.bottom)
        //         .append("g")
        //         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        //     x.domain(data.map(function(d) { return d.name; }));
        //     y.domain([0, d3.max(data, function(d) { return d.value; })]);

        //     chart.append("g")
        //         .attr("class", "x axis")
        //         .attr("transform", "translate(0," + height + ")")
        //         .call(xAxis);

        //     chart.append("g")
        //         .attr("class", "y axis")
        //         .call(yAxis);

        //     chart.selectAll(".bar")
        //         .data(data)
        //         .enter().append("rect")
        //         .attr("class", "bar")
        //         .attr("x", function(d) { return x(d.name); })
        //         .attr("y", function(d) { return y(d.value); })
        //         .attr("height", function(d) { return height - y(d.value); })
        //         .attr("width", x.rangeBand())
        //         .attr("fill","steelblue");
           

        //     chart.append("g")
        //         .attr("class", "brush")
        //         .call(d3.svg.brush().x(x)
        //         .on("brushend", brushend))
        //         .selectAll("rect")
        //         .attr("height", height);

        //     function brushend() {
        //         var s = d3.event.target.extent();
        //         chart.classed("selecting", !d3.event.target.empty());
        //         var x_values = [];
        //         var ll = {"frequency" : 0, "value":0};
        //         var rr = {"frequency" : 10000, "value":10000};
        //         x_values.push(ll);
        //         d3.selectAll("#fre_med .selecting .x>.tick").forEach(function(d,i){
        //             // console.log(d);
        //             // console.log(d[1].attributes[2].value.length);
        //             //console.log(d.length)
        //             for(var j =0 ; j<d.length; j++){
        //                 if(typeof(d[j].attributes[2].value) != undefined){
        //                     var x_vv = {};
        //                     var right = d[j].attributes[2].value.indexOf(",");
        //                     // x_vv[d[j].textContent] = d[j].attributes[2].value.substring(10,right);
        //                     x_vv["frequency"] =  d[j].textContent;
        //                     x_vv["value"] = parseInt(d[j].attributes[2].value.substring(10,right));
        //                     x_values.push(x_vv);
        //                     // console.log(d[j].attributes[2].value.substring(10,right));
        //                 }
        //             }

        //             //});
        //             // return s[0] <= (d = x(d)) && d <= s[1];
        //         });
        //         x_values.push(rr);
        //         console.log(x_values);
        //         console.log(s[0]+","+s[1]);
        //         var sca = []
        //         for(var i = 0 ;i<x_values.length;i++)
        //         {
        //             if(parseInt(s[0]) <= x_values[i].value && parseInt(s[1]) >= x_values[i].value){
        //                 sca.push(x_values[i].frequency);
        //             }

        //         }

        //         //console.log(left+""+right);
        //         // console.log(sca);
        //         if(sca.length == 1){
        //             $scope.filter_ctr = 1;
        //             $scope.fre_min = parseInt(sca[0]);
        //             $scope.fre_max = parseInt(sca[0]);
        //             $scope.refreshsankey1();
        //         }else if(sca.length >= 2){
        //             $scope.filter_ctr = 1;
        //             $scope.fre_min = parseInt(sca[0]);
        //             $scope.fre_max = parseInt(sca[sca.length-1]);
        //             $scope.refreshsankey1();
        //         }
        //         console.log($scope.fre_min+","+$scope.fre_max);
        //     }



        //     function type(d) {
        //         d.value = +d.value; // coerce to number
        //         return d;
        //     }

        // }




        //第一个参数是被克隆的对象，第二个参数是需要克隆的属性列表
        function clone(obj){
            var o;
            switch(typeof obj){
                case 'undefined': break;
                case 'string'   : o = obj + '';break;
                case 'number'   : o = obj - 0;break;
                case 'boolean'  : o = obj;break;
                case 'object'   :
                    if(obj === null){
                        o = null;
                    }else{
                        if(obj instanceof Array){
                            o = [];
                            for(var i = 0, len = obj.length; i < len; i++){
                                o.push(clone(obj[i]));
                            }
                        }else{
                            o = {};
                            for(var k in obj){
                                o[k] = clone(obj[k]);
                            }
                        }
                    }
                    break;
                default:
                    o = obj;break;
            }
            return o;
        }
        // if(!!$rootScope.pItemSelected) $scope.drawSankey($rootScope.pItemSelected);


    });