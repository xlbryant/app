/**
 * Created by Wemakefocus on 2016/10/9.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('CPcomparisonController', CPcomparisonController);

    // CPcomparisonController.$inject = [''];

    /* @ngInject */
    function CPcomparisonController($timeout,$scope,$rootScope) {
        // console.log("CPcomparisonController");
        var vm = $scope.vm = {};
        vm.title = 'ControllerName';
        // console.log(screen);
        $("#cfGraphs").height(screen.height*0.9 - 210);
        $("#patientsOverview").height(screen.height*0.9 - 210);
        var cliPath = {};
        var overview = {
            width: $("#simplewizard-steps").width(),
            height: 600
        };
        // console.log(overview);
        $.get("data/queryRawStat.json").success(function (res) {
            var patientsData = res.content;
            console.log(patientsData);
            cliPath.createCrossfiterGraphs(patientsData);
        });
        cliPath.createCrossfiterGraphs = function (data) {//receive a dict here for now
            var width = $("#simplewizard-steps").width()*0.3 - 37,
                height = width*0.618;
            console.log(width,height);
            var patientList = [],
                records = {};
                for(var key in data){
                    if(data.hasOwnProperty(key)){
                        var tempA = data[key];
                        tempA.ID = key;
                        if(tempA.Age < 26){
                            tempA.AgeRange = "0~25";
                        }else if(tempA.Age < 46){
                            tempA.AgeRange = "26~45";
                        }else if(tempA.Age < 61){
                            tempA.AgeRange = "46~60";
                        }else if(tempA.Age <71){
                            tempA.AgeRange = "61~70";
                        }else {
                            tempA.AgeRange = "70~";
                        }
                        if(tempA.Pathway_on === 0){
                            tempA.Pathway_on = "否";
                        }else {
                            tempA.Pathway_on = "是";
                        }
                        patientList.push(tempA);
                    }
                }
                console.log(patientList);
            var recordsCf = crossfilter(patientList);
            records.dim = {
                "gender": recordsCf.dimension(function (d) {
                    return d.Gender;
                }),
                "age": recordsCf.dimension(function (d) {
                    return d.Age;
                }),
                "ageRange": recordsCf.dimension(function (d) {
                    return d.AgeRange;
                }),
                "stayDays": recordsCf.dimension(function (d) {
                    return d.Stay_days;
                }),
                "score": recordsCf.dimension(function (d) {
                    return d.Score;
                }),
                "isOnPathway": recordsCf.dimension(function (d) {
                    return d.Pathway_on;
                }),
                "cost": recordsCf.dimension(function (d) {
                    return [d.Cost, 1];
                })
            };
            console.log(records.dim.cost.group());
            var isOnPathwayGroup = records.dim.isOnPathway.group().reduceCount(function (d) {
                // console.log(d);
                // return d.Pathway_on;
            }),
                genderGroup = records.dim.gender.group().reduceCount(),
                ageRangeGroup = records.dim.ageRange.group().reduceCount(),
                stayDaysGroup = records.dim.stayDays.group().reduceCount(function (d) {
                // console.log(d);
                // return d.Stay_days;
            }),
                agePathwayRangeGroup = records.dim.ageRange.group().reduce(function (p,v) {
                   // console.log(p,v);
                    p[v.Pathway_on] = (p[v.Pathway_on]||0) + 1;
                    return p;
                },function (p,v) {
                    // console.log(p,v);
                    p[v.Pathway_on] = (p[v.Pathway_on]||0) - 1;
                    // p[v.Pathway_on] = (p[v.Pathway_on])
                    return p;
                },function () {
                    return {};
                }),
                costGroup = records.dim.cost.group();
            console.log(agePathwayRangeGroup.all());
            // function sel_stack(i) {
            //     return function (d) {
            //         // console.log(d);
            //         return d.value[i];
            //     };
            // }
            var pathwayChart = dc.barChart("#cfPathwayBar"),
                genderChart = dc.barChart("#cfGenderBar"),
                ageRangeChart = dc.barChart("#cfAgeRangBar"),
                stayLengthChart = dc.barChart("#cfStayLengthBar"),
                // agePathwayRangeChart = dc.barChart("#cfAgePathwayRangeBar"),
                costChart = dc.scatterPlot("#cfCostBar");
            pathwayChart.margins().left = 60;
            genderChart.margins().left = 60;
            ageRangeChart.margins().left = 60;
            stayLengthChart.margins().left = 60;
            costChart.margins().left = 60;
            pathwayChart.width(width)
                .height(height)
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                // .brushOn(true)
                .xAxisLabel("是否在标准临床路径中")
                .dimension(records.dim.isOnPathway)
                .group(isOnPathwayGroup)
                .elasticX(true)
                .controlsUseVisibility(true)
                .on("preRedraw",function (chart) {
                    // console.log(chart);
                    // console.log(records.dim.score.top(30));
                    cliPath.createOverview(records.dim.score.top(30));
                });
            genderChart.width(width)
                .height(height)
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                // .brushOn(true)
                // .yAxisLabel("Y Axis")
                .xAxisLabel("性别")
                .dimension(records.dim.gender)
                .group(genderGroup)
                .elasticY(true)
                .controlsUseVisibility(true);
            ageRangeChart.width(width)
                .height(height)
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                // .brushOn(true)
                // .yAxisLabel("Y Axis")
                .xAxisLabel("年龄段")
                .dimension(records.dim.ageRange)
                .group(ageRangeGroup)
                .elasticY(true)
                .controlsUseVisibility(true);
            stayLengthChart.width(width)
                .height(height)
                .x(d3.scale.linear().domain([1,52]))
                // .xUnits(dc.units.ordinal)
                // .brushOn(true)
                // .yAxisLabel("Y Axis")
                .xAxisLabel("在院时间（天）")
                .dimension(records.dim.stayDays)
                .group(stayDaysGroup)
                .elasticY(true)
                .controlsUseVisibility(true);


            // agePathwayRangeChart.width(width)
            //     .height(height)
            //     .x(d3.scale.ordinal())
            //     .xUnits(dc.units.ordinal)
            //     // .brushOn(true)
            //     // .yAxisLabel("Y Axis")
            //     .renderType('group')
            //     // .centerBar(true)
            //     .dimension(records.dim.ageRange)
            //     .group(agePathwayRangeGroup,"0",sel_stack(0))
            //     // .elasticY(true)
            //     .controlsUseVisibility(true);
            // agePathwayRangeChart.stack(agePathwayRangeGroup, "1", sel_stack(1));

            costChart.width(width)
                .height(height)
                .x(d3.scale.linear().domain([0, 200000]))
                .y(d3.scale.linear().domain([0,2]))
                .dimension(records.dim.cost)
                .excludedColor("#ddd")
                // .clipPadding(2)
                .group(costGroup)
                .xAxisLabel("费用(元)")
                .controlsUseVisibility(true)
                .on("postRender",function () {
                    // console.log($("#cfCostBar text").transform());
                    $("#cfCostBar svg").css("height", height+30);
                    $("#cfCostBar .x-axis-label").css("transform","matrix(1, 0, 0, 1, "+ width/2 +", " + (height +　45) + ")");
                    console.log("postRender");
                });
            dc.renderAll();

            vm.reset = {
                // stayLengthChart: function () {
                //     resetChart(stayLengthChart);
                // },
                // pathwayChart: function () {
                //     resetChart(pathwayChart);
                // },
                // ageRangeChart: function () {
                //     resetChart(ageRangeChart);
                // },
                // agePathwayRangeChart: function () {
                //     resetChart(agePathwayRangeChart);
                // },
                // genderChart: function () {
                //     resetChart(genderChart);
                // },
                // costChar: function () {
                //     resetChart(costChart);
                // },
                all: function () {
                    resetChart(stayLengthChart,pathwayChart,ageRangeChart/*,agePathwayRangeChart*/,genderChart,costChart);
                }
            };
            function resetChart(chart) {
                for(var i=0,l=arguments.length;i<l;i++){
                    arguments[i].filterAll();
                }
                dc.redrawAll();
            }
            cliPath.createOverview(records.dim.score.top(9999));
            // stayLengthChart.render();
            // pathwayChart.render();
            // var test = recordsCf.groupAll();
            // console.log(recordsCf);
            // console.log(test);
            // console.log(records.dim.score);
            // console.log(records.dim.score.top(30));
            // console.log(records.dim.score.group());
            // console.log(test.top(999));
        };
        /*$.get("data/patients_info.json").success(function (res) {
            //http://1.85.37.136:9999/clinicalpath/queryPatients/
            // res = res.content;
            var patientsInfo = [];
            for (var k in res){
                res[k].Score/=5;
                var patient = res[k];
                patientsInfo.push(patient);
            }
            // console.log(patientsInfo);
            patientsInfo.sort(function (a,b) {
                return a.Score<b.Score?1:-1;
            });
            cliPath.createOverview(patientsInfo);
        });*/
        $("#nextButton").bind("click",processData);
        function processData() {
            vm.isLoading = true;
            $scope.$apply();
            // console.log(cliPath);
            var averageValue = [
                132.04928571428573,
                190.78868421052624,
                144.86387096774192,
                142.4047619047619,
                532.5679411764705,
                736.4989255018023
            ];
            // var phaseOrder = {
            //     "住院第1天": 0,
            //     "住院第2-6天": 1,
            //     "术前1天": 2,
            //     "手术日": 3,
            //     "术后第2-14天": 4,
            //     "出院日": 5
            // };
            var queryItemsTime,
                // queryScore,
                queryItem,
                queryCohortCPData;
            var standardPathCode = [
                [
                    "F00000003702",
                    "F00000008313",
                    "F00000144169",
                    "F00000002992",
                    "F00000003633",
                    "F00000056668",
                    "F00000056670",
                    "F00000056568",
                    "F00000003634",
                    "F00000008157",
                    "F00000001600",
                    "F00000083368",
                    "F00000001063",
                    "F00000001062",
                    "F00000008139",
                    "F00000108168",
                    "F00000008137",
                    "F00000008336",
                    "F00000008196",
                    "F00000008243"
                ],
                [
                    "F00000001063",
                    "Y00000001225",
                    "Y00000011459",
                    "Y00000034756",
                    "Y00000002592"
                ],
                [
                    "Y00000011359",
                    "F00000006578",
                    "Y00000003595"
                ],
                [
                    "F00000001600",
                    "F00000056670",
                    "F00000056568",
                    "F00000006358",
                    "F00000108172",
                    "Y00000002592",
                    "F00000144169",
                    "Y00000001225",
                    "Y00000003595",
                    "F00000001061",
                    "F00000001062",
                    "Y00000011359",
                    "F00000001082",
                    "F00000001083"
                ],
                [
                    "Y00000003595",
                    "F00000001118",
                    "F00000001062",
                    "F00000001063",
                    "F00000056670",
                    "Y00000001274",
                    "F00000144169",
                    "F00000008195",
                    "F00000001600",
                    "F00000056668"
                ],
                []
            ];
            var standardPathName = [
                [
                    "十二通道心电图检查",
                    "心动超声[复]",
                    "肝功十四项[复]",
                    "卡式血型鉴定",
                    "肺通气功能检查",
                    "肾功五项[复]",
                    "电解质六项[复]",
                    "凝血六项[复]",
                    "肺弥散功能检查",
                    "传染性指标检测八项(常规)[复]",
                    "血细胞分析+五分类",
                    "肿瘤标志物胃肠癌检测[复]",
                    "二级护理",
                    "一级护理",
                    "粪常规[复]",
                    "传染性指标检测八项(急诊)[复]",
                    "尿常规(分析+尿沉渣定量)[复]",
                    "电子胃镜常规检查[复]",
                    "正、侧位[复]",
                    "多层CT平扫（每部位）[复]"
                ],
                [
                    "二级护理",
                    "0.9%氯化钠(袋)",
                    "转化糖电解质（田力）",
                    "庆大霉素",
                    "氨溴索(兰苏)"
                ],
                [
                    "头孢替安（佩罗欣）",
                    "红细胞2u",
                    "头孢呋辛钠(西力欣)"
                ],
                [
                    "血细胞分析+五分类",
                    "电解质六项[复]",
                    "凝血六项[复]",
                    "气压治疗",
                    "肾功六项[复]",
                    "氨溴索(兰苏)",
                    "肝功十四项[复]",
                    "0.9%氯化钠(袋)",
                    "头孢呋辛钠(西力欣)",
                    "特级护理",
                    "一级护理",
                    "头孢替安（佩罗欣）",
                    "加压给氧",
                    "持续吸氧"
                ],
                [
                    "头孢呋辛钠(西力欣)",
                    "特大换药",
                    "一级护理",
                    "二级护理",
                    "电解质六项[复]",
                    "复方泛影葡胺(#B)",
                    "肝功十四项[复]",
                    "正位片[复]",
                    "血细胞分析+五分类",
                    "肾功五项[复]"
                ],
                []
            ];
            // console.log(cliPath.patientInfo.ID);
            Date.prototype.format=function (){
                var s='';
                s+=this.getFullYear()+"/";          // 获取年份。
                s+=(this.getMonth()+1)+"/";         // 获取月份。
                s+= this.getDate();                 // 获取日。
                return(s);                          // 返回日期。
            };
            function getDatesBetween2Dates(begin,end){
                var ab = begin.split("/");
                var ae = end.split("/");
                var db = new Date();
                db.setUTCFullYear(ab[0], ab[1]-1, ab[2]);
                var de = new Date();
                de.setUTCFullYear(ae[0], ae[1]-1, ae[2]);
                var unixDb=db.getTime();
                var unixDe=de.getTime();
                var datesA = [];
                for(var k=unixDb;k<=unixDe;){
                    // console.log((new Date(parseInt(k))).format());
                    if(k!==unixDb && k!==unixDe){
                        datesA.push((new Date(parseInt(k))).format());
                    }
                    k=k+24*60*60*1000;
                }
                return datesA;
            }
            function getSomeDate(todayDate,distanceCount) {//get "distanceCount" days later
                var ab = todayDate.split("/");
                var db = new Date();
                db.setUTCFullYear(ab[0], ab[1]-1, ab[2]);
                var unixDb=db.getTime() + 24*60*60*1000*distanceCount;
                var someDate = (new Date(parseInt(unixDb))).format();
                // console.log(someDate);
                return someDate;
            }
            var queryItemsTimeP = $.ajax({
                url: "http://1.85.37.136:9999/clinicalpath/queryItemsTime/?q=%7B%22PID%22:%22"+cliPath.patientInfo.ID+"%22%7D",
                // async: false,
                success: function (res) {
                    console.log("get queryItemsTime json success");
                    console.log(cliPath.patientInfo.ID);
                    console.log(res);
                    queryItemsTime = res;
                }
            });
            var queryItemP = $.ajax({
                url: "http://1.85.37.136:9999/clinicalpath/queryItem/?q=%7B%22PID%22:%22"+cliPath.patientInfo.ID+"%22%7D",
                // async: false,
                success: function (res) {
                    console.log("get queryItem json success");
                    console.log(res);
                    queryItem = res.Items;
                }
            });
            Promise.all([queryItemsTimeP,queryItemP]).then(function (res) {
                console.log(res);
                vm.isLoading = false;
                // console.log($scope);
                $scope.$apply();
                queryItemsTime = res[0];
                queryItem = res[1].Items;
                manipulateData();
            })
            // manipulateData();
            function manipulateData() {
                var specialDate = queryItemsTime.special_date,
                    inDate = specialDate.in_date,
                    opDate = specialDate.operation_date,
                    outDate = specialDate.out_date,
                    phaseTime = [];
                // console.log([inDate,opDate,outDate]);
                phaseTime[0] = [inDate];
                phaseTime[1] = getDatesBetween2Dates(inDate,getSomeDate(opDate,-1));
                phaseTime[2] = [getSomeDate(opDate,-1)];
                phaseTime[3] = [opDate];
                phaseTime[4] = getDatesBetween2Dates(opDate,outDate);
                phaseTime[5] = [outDate];
                // console.log(phaseTime);
                var combinedPath = {
                    // "xNodesNum": 6,
                    // "yNodesNum": 45,
                    // "valMax": 5752,
                    // "valMin": 0.19,
                    // "scoreMax": 9.836601307189541,
                    // "scoreMin": 0.39052287581699346,
                    // "inpatientNo": "ZY010001102284",
                    "nodes": [
                        {
                            "phase": 0,
                            "sphase": [
                                {
                                    "sphase": 0,
                                    "tphase": []
                                }
                            ]
                        },
                        {
                            "phase": 1,
                            "sphase": [
                                {
                                    "sphase": 0,
                                    "tphase": []
                                }
                            ]
                        },
                        {
                            "phase": 2,
                            "sphase": [
                                {
                                    "sphase": 0,
                                    "tphase": []
                                }
                            ]
                        },
                        {
                            "phase": 3,
                            "sphase": [
                                {
                                    "sphase": 0,
                                    "tphase": []
                                }
                            ]
                        },
                        {
                            "phase": 4,
                            "sphase": [
                                {
                                    "sphase": 0,
                                    "tphase": []
                                }
                            ]
                        },
                        {
                            "phase": 5,
                            "sphase": [
                                {
                                    "sphase": 0,
                                    "tphase": []
                                }
                            ]
                        }
                    ]
                };
                var xNodeNum,
                    yNodeNum = -1,
                    valMax = -1,
                    valMin = 1000,
                    scoreMax = -1,
                    scoreMin = 1000;
                for(var phaseI=0,phaseL=phaseTime.length;phaseI < phaseL; phaseI++){
                    var personalItems = [],
                        itemsRecord = [];
                    for(var timeI=0,timeL=phaseTime[phaseI].length;timeI<timeL;timeI++){
                        var curTime = phaseTime[phaseI][timeI];
                        // console.log(curTime);
                        var curItemsA = queryItemsTime["normal_date"][curTime];
                        // console.log(curItemsA);
                        if(curItemsA === undefined){
                            continue;
                        }
                        // console.log(timeL);
                        // console.log(curTime);
                        // console.log(curItemsA);
                        for(var itemI=0,itemL=curItemsA.length;itemI<itemL;itemI++){
                            // console.log(personalItems.indexOf(curItemsA[itemI]));
                            if(personalItems.indexOf(curItemsA[itemI]) === -1){
                                personalItems.push(curItemsA[itemI]);
                                itemsRecord.push(1);
                            }else {
                                itemsRecord[personalItems.indexOf(curItemsA[itemI])]++;
                            }
                        }
                    }
                    // console.log(phaseI);
                    // console.log(personalItems);
                    // console.log(itemsRecord);
                    var destinationA = combinedPath.nodes[phaseI].sphase[0].tphase;
                    var commonCodeA = [];
                    for(itemI=0,itemL=personalItems.length;itemI<itemL;itemI++){
                        var itemID = personalItems[itemI];
                        var item = {
                            code: itemID,
                            count: itemsRecord[itemI],
                            node: queryItem[itemID].item_name,
                            cost: queryItem[itemID].item_fee,
                            score: queryItem[itemID].score,
                            reason: queryItem[itemID].reason
                        };
                        item.value = item.cost*item.count;
                        if(item.score !== ""){
                            item.target = 3;
                        }else {
                            item.target = 2;
                            item.value = averageValue[phaseI];
                            item.score = 2.6397996357012747/5;
                            commonCodeA.push(itemID);
                        }
                        if(item.score > scoreMax){
                            scoreMax = item.score;
                        }
                        if(item.score < scoreMin){
                            scoreMin = item.score;
                        }
                        if(item.value > valMax){
                            valMax = item.value;
                        }
                        if(item.value < valMin){
                            valMin = item.value;
                        }
                        destinationA.push(item);
                    }
                    // console.log(destinationA);
                    var destA = destinationA;
                    for(var destAI=0,destAL=destA.length;destAI<destAL;destAI++){
                        if(destA[destAI].target === 2 && standardPathCode[phaseI].indexOf(destA[destAI].code) === -1){
                            destA[destAI].target = 3;
                            // console.log(phaseI);
                            // console.log(standardPathCode[phaseI]);
                            // console.log(destA[destAI].code)
                            // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                            // console.log(destA[destAI]);
                        }
                    }
                    for(itemI=0,itemL=standardPathCode[phaseI].length;itemI<itemL;itemI++){
                        // console.log(destinationA);
                        if(commonCodeA.indexOf(standardPathCode[phaseI][itemI]) === -1){
                            itemID = standardPathCode[phaseI][itemI];
                            // console.log(itemID);
                            var item2 = {
                                code: itemID,
                                node: standardPathName[phaseI][itemI],
                                target: 1,
                                value: averageValue[phaseI],
                                score: 2.6397996357012747/5
                            };
                            destinationA.push(item2);
                        }
                    }
                    if(yNodeNum < destinationA.length){
                        yNodeNum = destinationA.length;
                    }
                    destinationA.sort(function (a,b) {
                        if(a.target === b.target){
                            return a.score>b.score?1:-1;
                        }else {
                            return b.target-a.target;
                        }
                    });
                }
                xNodeNum = phaseL;
                combinedPath.xNodesNum = xNodeNum;
                combinedPath.yNodesNum = yNodeNum;
                combinedPath.valMax = valMax;
                combinedPath.valMin = valMin;
                combinedPath.scoreMax = scoreMax;
                combinedPath.scoreMin = scoreMin;
                console.log(combinedPath);
                // cliPath.pathData = combinedPath;
                function createPath() {
                    var clinicPathSvg = $("#clinicPath svg");
                    if(clinicPathSvg.length !== 0){
                        clinicPathSvg.remove();
                    }
                    var clinicLegendSvg = $("#cpLegend svg");
                    if(clinicLegendSvg.length !== 0){
                        clinicLegendSvg.remove();
                    }
                    cliPath.createPath(combinedPath);
                }
                $timeout(createPath,200);
                // createPath();
            }




        }
        cliPath.createOverview = function (data) {
            var formerSvg = $("#patientsOverview svg");
            console.log("creating overview");
            if(formerSvg.length > 0){
                // console.log("removing!!!");
                // console.log(rects);
                d3.select("#patientsOverview svg")
                    // .selectAll()
                    // .transition()
                    // .duration(500)
                    // .style("opacity",0);
                    .remove();
                // rects/*.transition()
                //     .duration(800)*/
                    // .style("opacity",0);
                // formerSvg.selectAll().remove();
                // formerSvg.remove();
            }
            $rootScope.pageLoading = false;
            console.log(data);
            var width = $("#simplewizard-steps").width()*0.7 - 37,
                margin = {
                    top: 5,
                    bottom: 5,
                    left: 10,
                    right: 10
                },
                topNum = data.length;
            console.log(topNum);
            // if(data.length < 36){
            //     topNum = data.length;
            // }
            var height = topNum * 30;
            cliPath.svgWidth = width/0.7;
            cliPath.patientInfo = data[0];
            var patientsData = data.slice(0,topNum);
            cliPath.patientInfo = patientsData[0];
            console.log(patientsData);
            var  scoreMin = patientsData[topNum-1].Score,
                 scoreMax = patientsData[0].Score;
            var svg = d3.select("#patientsOverview").append("svg")
                .attr("width",width)
                .attr("height",height)
                .append("g")
                .attr("transform","translate(" + margin.left + "," + margin.top + ")");
            var divideLineX = width*0.15;
            var x = d3.scale.linear().range([0,width - divideLineX - 50])
                .domain([scoreMin-1,scoreMax]);
            var y = d3.scale.ordinal()
                .rangeRoundBands([-8,height],.2)
                .domain(patientsData.map(function (d) {
                    return d.ID;
                }));
            var tip = d3.tip()
                .attr("class", "d3-tip")
                .offset([-10, 0])
                .html(function(d) {
                    // console.log(d);
                    return "<p><strong>ID:</strong>&nbsp&nbsp" + d.ID + "</p>"+
                        "<p><strong>姓名:</strong>&nbsp&nbsp " + d.Name + "</p>"+
                        "<p><strong>性别:</strong>&nbsp&nbsp " + d.Gender + "</p>"+
                        "<p><strong>年龄:</strong>&nbsp&nbsp " + d.Age + "岁</p>"+
                        "<p><strong>费用:</strong>&nbsp&nbsp " + d.Cost + "元</p>"/*+
                        "<p><strong>出院时间:</strong>&nbsp&nbsp" + d.OutTme + "</p>"+
                        "<p><strong>联系人:</strong>&nbsp&nbsp" + d.Contact + "</p>"*/;
                });
            svg.call(tip);
            var rects = svg.selectAll()
                .data(patientsData)
                .enter().append("rect")
                .attr("class", "bar")
                // .attr("transform", "translate(0,30)")
                .attr("y", function(d) { return y(d.ID); })
                .attr("height", y.rangeBand())
                .attr("x", function(d) { return divideLineX - 10; })
                .on("mouseover",tip.show)
                .on("mouseover.test2",function (d) {

                    // console.log(d);
                    // var selectedRect = rects.filter(function (d2) {
                    //     console.log(d2);
                    //     return d2.ID === d.ID;
                    // });
                    // console.log(selectedRect);
                    d3.select(this).style("fill","red");
                    // console.log(d3.select(this));
                })
                .on("mouseout",function (d) {
                    tip.hide();
                    d3.selectAll("#patientsOverview rect").filter(function (d2) {
                        // console.log(d2);
                        return d2.ID === d.ID;
                    }).style("fill","steelblue");
                })
                .on("click",function (d) {
                    cliPath.patientInfo = d;
                    $("#nextButton").trigger("click");
                })
                // .attr("width",function (d){return 0;})
                // .attr("width", function(d) { return 0; })
                // .style({"opacity":1,"color":"steelblue"})
                // .transition()
                // .duration(500)
                // .style({"opacity":1,"color":"steelblue"})
                .attr("width", function(d) { return x(d.Score); })
                // .transition()
                // .duration(800)
                .style({"opacity":1,"color":"steelblue","cursor":"pointer"})
                .attr("fill","steelblue");
            svg.selectAll()
                .data(patientsData)
                .enter().append("text")
                .attr("class","featuretext")
                .attr("text-anchor","right")
                // .attr("transform","translate(0,30)")
                .on("mouseover",tip.show)
                .on("mouseout",tip.hide)
                // .attr("x",function(){return 0;})
                // .style({"opacity":0,"color":"steelblue"})
                // .transition()
                // .duration(500)
                // .transition()
                // .duration(800)
                .style("opacity",1)
                .attr("x",function(d){return divideLineX - 100})
                .attr("y",function(d){return y(d.ID);})
                .attr("dy",15)
                .attr("dx",4)
                .text(function(d){return d.Name;});
            svg.selectAll()
                .data(patientsData)
                .enter().append("text")
                .attr("class","featuretext")
                .attr("text-anchor","right")
                // .attr("transform","translate(0,30)")
                .on("mouseover",tip.show)
                .on("mouseout",tip.hide)
                // .attr("x",function(){return 0;})
                // .style({"opacity":0,"color":"steelblue"})
                // .transition()
                // .duration(500)
                // .transition()
                // .duration(800)
                .style("opacity",1)
                .attr("x",function(d){return x(d.Score) + divideLineX - 10})
                .attr("y",function(d){return y(d.ID);})
                .attr("dy",15)
                .attr("dx",4)
                .text(function(d){return (d.Score).toFixed(2);});

        };
        cliPath.legend = {
            shortR: -1,
            longR: -1,
            deepColor: "",
            lightColor: "",
            midColor: "",
            normalScore: 0.51,
            maxScore: -1,
            minCost: -1,
            maxCost: -1
        };
        cliPath.createPath = function (data) {
            // console.log(cliPath);
            $("#patientInfo").html("<p style='padding-top: 30px'> &nbsp姓名:&nbsp" + cliPath.patientInfo.Name + ";&nbsp&nbsp&nbsp总得分:&nbsp  " + (cliPath.patientInfo.Score).toFixed(2) + "</p>");
            var margin = {
                    left:40,
                    right:40,
                    top:20,
                    bottom:20
                },
                // svg = $("#clinicalPathway").children("svg"),
                nodesData = [],
                width = cliPath.svgWidth-margin.left,
                height = 600-margin.top-margin.bottom,
                dx = width/(data.xNodesNum+1),//distance between nodes in X axis
                dy = height/(data.yNodesNum+1),
                cxA = [],//save 'x's of circles
                cyA = [],
                rA = [],
                rMax = 20,
                rMin = 1,
                valMax = data.valMax,
                valMin = data.valMin,
                scoreMax = data.scoreMax,
                scoreMin = data.scoreMin,
                typeA = [],
                nodes = data.nodes,
                phaseNum = nodes.length,
                curX = 0,//record current x
                curY = 0,
                deltaYArray = [],
                curR = 0,
                upPersonalTargets = [],//record nodes which is at the top boundary
                downPersonalTargets = [],
                upStandardTargets = [],
                downStandardTargets = [],
                nodeCount = 0;
            cliPath.legend.minCost = valMin;
            cliPath.legend.minScore = scoreMin;
            cliPath.legend.maxCost = valMax;
            cliPath.legend.maxScore = scoreMax;
            console.log(dx);
            // console.log(nodes);
            cliPath.isLackOfSixPhase = 1;
            cliPath.legend.shortR = rMax-(rMax-rMin)*(scoreMax-0.51)/(scoreMax-scoreMin);
            cliPath.legend.longR = rMax;
            console.log(cliPath.legend.shortR);
            var yLengthMax = -1;
            for(var i=0;i<phaseNum;i++) {
                var sphaseNum2 = nodes[i].sphase.length,
                    sphaseNodes2 = nodes[i].sphase;
                for (var j = 0; j < sphaseNum2; j++) {
                    curX += dx;
                    var tphaseNum2 = sphaseNodes2[j].tphase.length,
                        tphaseNodes2 = sphaseNodes2[j].tphase;
                    curY = 0;
                    var rSum2 = 0;
                    for (var k = 0; k < tphaseNum2; k++) {
                        // console.log(tphaseNodes[k]);
                        // if(!tphaseNodes[k].score){
                        //     console.log(!tphaseNodes[k].score);
                        //     tphaseNodes[k].score = 4;
                        // }
                        curR = rMax - (rMax - rMin) * (scoreMax - tphaseNodes2[k].score) / (scoreMax - scoreMin);
                        // console.log(curR);
                        rSum2 += curR;
                        if (k === tphaseNum2 - 1) {
                            deltaYArray.push(height / 2 - rSum2);
                            console.log(rSum2 * 2.2);
                            if (rSum2 * 2.2 > yLengthMax) {
                                yLengthMax = rSum2 * 2.2;
                            }
                            if (i === phaseNum - 1 && yLengthMax > height) {
                                dx = yLengthMax * width / height / (data.xNodesNum + 1) /** 0.95*/;
                                console.log(dx);
                            }
                        }
                    }
                }
            }
            curX = 0;
            for(i=0;i<phaseNum;i++){
                var sphaseNum = nodes[i].sphase.length,
                    sphaseNodes = nodes[i].sphase;
                for(j=0;j<sphaseNum;j++){
                    curX += dx;
                    var tphaseNum = sphaseNodes[j].tphase.length,
                        tphaseNodes = sphaseNodes[j].tphase;
                    curY = 0;
                    var rSum = 0;
                    for(k=0;k<tphaseNum;k++){
                        // console.log(tphaseNodes[k]);
                        // if(!tphaseNodes[k].score){
                        //     console.log(!tphaseNodes[k].score);
                        //     tphaseNodes[k].score = 4;
                        // }
                        curR = rMax-(rMax-rMin)*(scoreMax-tphaseNodes[k].score)/(scoreMax-scoreMin);
                        // console.log(curR);
                        rSum += curR;
                        if(k === tphaseNum-1){
                            deltaYArray.push(height/2-rSum);
                        }
                    }
                    // console.log(deltaYArray);
                    for(k=0;k<tphaseNum;k++){
                        if(i === phaseNum-1 && tphaseNodes[k].target !== 3){
                            cliPath.isLackOfSixPhase = 0;
                        }
                        curR = rMax-(rMax-rMin)*(scoreMax-tphaseNodes[k].score)/(scoreMax-scoreMin);
                        curY += curR*1.1;
                        // console.log(deltaYArray[i]);
                        // console.log(curY);
                        var yVal = curY+deltaYArray[i];
                        // console.log(yVal);
                        cyA.push(yVal);
                        curY += curR*1.1;
                        if(k === 0){
                            if(tphaseNodes[k].target === 2){
                                upPersonalTargets.push(nodeCount);
                                upStandardTargets.push(nodeCount);
                            } else if(tphaseNodes[k].target === 3){
                                upPersonalTargets.push(nodeCount);
                                // console.log(nodeCount);
                            } else if(tphaseNodes[k].target === 1){
                                upStandardTargets.push(nodeCount);
                                // console.log(nodeCount);
                            }
                        }else if(k === tphaseNum-1){
                            if(tphaseNodes[k].target === 2){
                                downPersonalTargets.push(nodeCount);
                                downStandardTargets.push(nodeCount);
                            } else if(tphaseNodes[k].target === 3){
                                downPersonalTargets.push(nodeCount);
                            } else if(tphaseNodes[k].target === 1){
                                downStandardTargets.push(nodeCount);
                            }
                        }
                        if((tphaseNodes[k].target === 2 || tphaseNodes[k].target === 3) && k<tphaseNum-1 && tphaseNodes[k+1].target === 1){
                            downPersonalTargets.push(nodeCount);
                            // console.log(nodeCount);
                        }
                        if(tphaseNodes[k].target === 3 && k<tphaseNum-1 && (tphaseNodes[k+1].target === 1 || tphaseNodes[k+1].target === 2)){
                            upStandardTargets.push(nodeCount+1);
                            // console.log(nodeCount+1);
                        }
                        var node = tphaseNodes[k];
                        node.x = curX;
                        node.y = yVal;
                        node.r = curR;
                        // console.log(node);
                        nodesData.push(node);
                        cxA.push(curX);
                        rA.push(curR);//r will be supposed to be set as a range in the future
                        typeA.push(tphaseNodes[k].type);
                        // calculate r in this way just for now
                        nodeCount++;
                        // console.log(downPersonalTargets);
                        // if(!!node.score){
                        //     if(node.score > scoreMax){
                        //         scoreMax = node.score;
                        //     }
                        //     if(node.score < scoreMin){
                        //         scoreMin = node.score;
                        //     }
                        // }
                    }
                }
            }
            console.log(nodesData);
            // console.log([scoreMin,scoreMax]);
            // console.log(nodesData);
            // console.log(upStandardTargets);
            var tip = d3.tip()
                .attr("class", "d3-tip")
                .offset([-10, 0])
                .html(function(d) {
                    // console.log(d);
                    return "<strong>名称:</strong> <span style='color:red'>" + d.node + "</span>";
                });

            var d3svg = d3.select("#clinicPath").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);
            cliPath.legend.pathSvgWidth = width + margin.left + margin.right;
            cliPath.legend.pathSvgHeight = height + margin.top + margin.bottom;
            d3svg.call(tip);
            //**************************** to add the flow path ***************************************//
            var lineFunction = d3.svg.line()
                .x(function(d) { return d.x; })
                .y(function(d) { return d.y; })
                .interpolate("cardinal");
            // .interpolate("monotone");
            function drawFlows() {
                // var personalPath = getFlowData(cxA,cyA,rA,upPersonalTargets,downPersonalTargets,margin,width,1),
                //     standardPath = getFlowData(cxA,cyA,rA,upStandardTargets,downStandardTargets,margin,width,1);
                var personalPath = createLinkFromNodes(cxA,cyA,rA,upPersonalTargets,downPersonalTargets,margin,width,0,dx),
                    standardPath = createLinkFromNodes(cxA,cyA,rA,upStandardTargets,downStandardTargets,margin,width,cliPath.isLackOfSixPhase,dx);
                d3svg.append("path")
                    // .datum(personalPath)
                    .attr("d",personalPath)
                    .attr("class","personalLink");
                d3svg.append("path")
                    // .datum(standardPath)
                    .attr("d",standardPath)
                    .attr("class","standardLink");
            }
            drawFlows();

            // var pathPersonalVal,
            //     pathStandardVal;
            // pathPersonalVal = createLinkFromNodes(cxA,cyA,rA,upPersonalTargets,downPersonalTargets,margin,width);
            // pathStandardVal = createLinkFromNodes(cxA,cyA,rA,upStandardTargets,downStandardTargets,margin,width);
            // var personalLine = document.createElementNS("http://www.w3.org/2000/svg","path");
            // personalLine.setAttribute("class","personalLink");
            // personalLine.setAttribute("d",pathPersonalVal);
            // // svg.append(personalLine);
            // var standardLine = document.createElementNS("http://www.w3.org/2000/svg","path");
            // standardLine.setAttribute("class","standardLink");
            // standardLine.setAttribute("d",pathStandardVal);
            // // d3svg.append(standardLine);
            // $("svg").append(personalLine).append(standardLine);
            // var phasesLines = document.createElementNS("http://www.w3.org/2000/svg","path");

            //**************************** to add the flow path End ***************************************//

            //***************************** to draw circles **********************************************//
            // console.log(nodesData);
            // console.log(JSON.stringify(nodesData));
            var colorSteelblue = d3.rgb(70,130,180),//steelblue
                colorSeagreen = d3.rgb(84,138,84),//palegreen4
                colorRed = d3.rgb(255,0,0),
                colorBlue = d3.rgb(0,0,255),
                colorGreen = d3.rgb(0,255,0),
                colorWhite = d3.rgb(255,255,255),
                linear = d3.scale.linear().domain([valMin,valMax]).range([0.5,1]),
                computeBlue = d3.interpolate(colorSteelblue,colorBlue),
                computeGreen = d3.interpolate(colorSeagreen,colorGreen),
                computeRed = d3.interpolate(colorWhite,colorRed);
            cliPath.legend.deepColor = computeRed(linear(valMax));
            cliPath.legend.lightColor = computeRed(linear(valMin));
            cliPath.legend.midColor = computeRed(linear((valMax + valMin)/2));

            var circles = d3svg.selectAll()
                .data(nodesData)
                .enter().append("circle")
                .style("fill",function (d) {
                    if(!d.score && d.target <3){
                        d.score = 0;
                    }
                    return computeRed(linear(d.value));
                })
                .style("cursor","pointer")
                .attr("cx", function (d) {
                    // console.log(d);
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("r", function (d) {
                    return d.r;
                })
                .on("mouseover",tip.show)//manipulated the original show func
                .on("mouseover.test",function (d) {
                    // console.log("mouseover.test");
                    // console.log(d);
                    circles.filter(function (d2) {
                        // console.log(d2);
                        return d2.node === d.node;
                    })
                        .style("stroke", "black")
                        .style("stroke-width",2);
                    $("#showReason").html("<p> 名称 :"+d.node+"   得分: "+d.score.toFixed(2)+/* "  Target: " + d.target +*/"</p>"+"<p> 原因 :"+d.reason+"</p>");
                    // console.log([scoreMax,scoreMin]);
                })
                .on("mouseout",function (d) {
                    tip.hide();
                    circles.filter(function (d2) {
                        return d2.node === d.node;
                    })
                        .style("stroke-width", 0);
                    $("#showReason").html("");
                });
                // .on("click",function (d) {
                //     circles.filter(function (d2) {
                //         // console.log(d2);
                //         return d2.node === d.node;
                //     })
                //         .style("fill", "red");
                //     var filteredCircles = circles.filter(function (d2) {
                //         return d2.node !== d.node;
                //     });
                //     resetCircleColor(filteredCircles);
                //     $("#showReason").html("<p> Name :"+d.node+"   Score: "+d.score+ "  Target: " + d.target +"</p>"+"<p> Reason :"+d.reason+"</p>");
                //     console.log([scoreMax,scoreMin]);
                // });
            // function equalToEventTarget() {
            //     return this == d3.event.target;
            // }
            // d3.select("svg").on("click",function () {
            //     var outside = circles.filter(equalToEventTarget).empty();
            //     console.log(outside);
            //     if(outside){
            //         resetCircleColor(circles);
            //         $("#showReason").html("");
            //     }
            // });
            function resetCircleColor(circles){
                circles
                    .style("fill", function (d) {
                        if(d.type === "shortTerm"){
                            return "steelblue";
                        }
                        if(d.type === "longTerm"){
                            return "green";
                        }
                    });
            }
            //********************* draw circles End *****************************************//

            //********************* to add pan and zoom with svg-pan-zoom ****************************//
            function addPanzoom() {
                console.log("adding pan zoom");
                window.zoomTiger = svgPanZoom("#clinicPath svg", {
                    zoomEnabled: true,
                    controlIconsEnabled: false,
                    fit: true,
                    center: true,
                    width: width,
                    height: height
                });
            }
            addPanzoom();

            //********************* to add pan and zoom  End  ****************************//

            cliPath.legend.create();
        };
        cliPath.legend.create = function () {
            console.log(cliPath.legend);
            var svg = d3.select("#cpLegend").append("svg")
                .attr("width",540)
                .attr("height",75)
                .attr("style","position: relative;left: "+ (cliPath.legend.pathSvgWidth-540) +
                    "px;top: "+ (0) +"px;outline: 1px solid steelblue;");
            var margin = {
                left: 10,
                top: -10,
                right: 10,
                bottom: 10
            },
                rect = {
                    width: 60,
                    height: 15
                };
            var rects = [
                {
                    x: margin.left + 10,
                    y: margin.top + 20,
                    dx: rect.width,
                    dy: rect.height,
                    color: "rgb(0,255,0)",
                    opacity: 0.2
                },
                {
                    x: margin.left + 10,
                    y: margin.top + 40,
                    dx: rect.width,
                    dy: rect.height,
                    color: "rgb(159,201,215)",
                    opacity: 1
                },
                {
                    x: margin.left + 10,
                    y: margin.top + 60,
                    dx: rect.width,
                    dy: rect.height,
                    color: "rgb(0,0,255)",
                    opacity: 0.2
                }
            ];
            var text = [
                {
                    x: rects[0].x + rect.width + 10,
                    y: rects[0].y + 12,
                    content: "个人路径"
                },
                {
                    x: rects[1].x + rect.width + 10,
                    y: rects[1].y + 12,
                    content: "重叠部分"
                },
                {
                    x: rects[2].x + rect.width + 10,
                    y: rects[2].y + 12 ,
                    content: "标准路径"
                }
            ];
            var circleY = text[1].y - 20;
            var extraDx = -30;
            var circles = [
                // {
                //     y: rects[2].y + 50,
                //     r: (cliPath.legend.shortR + cliPath.legend.longR)/2,
                //     color: cliPath.legend.lightColor
                // },
                {
                    x: text[0].x + 100,
                    r: cliPath.legend.shortR,
                    color: cliPath.legend.lightColor
                },
                {
                    x: text[0].x + 150,
                    r: (cliPath.legend.shortR + cliPath.legend.longR)/2,
                    color: cliPath.legend.lightColor
                },
                {
                    x: text[0].x + 200,
                    r: cliPath.legend.longR,
                    color: cliPath.legend.lightColor
                },
                {
                    x: text[0].x + 280,
                    r: (cliPath.legend.shortR + cliPath.legend.longR)/2,
                    color: cliPath.legend.lightColor
                },
                {
                    x: text[0].x + 330,
                    r: (cliPath.legend.shortR + cliPath.legend.longR)/2,
                    color: cliPath.legend.midColor
                },
                {
                    x: text[0].x + 380,
                    r: (cliPath.legend.shortR + cliPath.legend.longR)/2,
                    color: cliPath.legend.deepColor
                }
            ];
            var xlineY = circleY + circles[2].r + 5;
            var xlineYlength = 4;
            var xline = [
                {
                    "x1": circles[0].x,
                    "y1": xlineY,
                    "x2": circles[2].x,
                    "y2": xlineY,
                    "isXAxis": 1
                },
                {
                    "x1": circles[3].x,
                    "y1": xlineY,
                    "x2": circles[5].x,
                    "y2": xlineY,
                    "isXAxis": 1
                },
                {
                    "x1": circles[0].x,
                    "y1": xlineY,
                    "x2": circles[0].x,
                    "y2": xlineY - xlineYlength
                },
                {
                    "x1": circles[1].x,
                    "y1": xlineY,
                    "x2": circles[1].x,
                    "y2": xlineY - xlineYlength
                },
                {
                    "x1": circles[2].x,
                    "y1": xlineY,
                    "x2": circles[2].x,
                    "y2": xlineY - xlineYlength
                },
                {
                    "x1": circles[3].x,
                    "y1": xlineY,
                    "x2": circles[3].x,
                    "y2": xlineY - xlineYlength
                },
                {
                    "x1": circles[4].x,
                    "y1": xlineY,
                    "x2": circles[4].x,
                    "y2": xlineY - xlineYlength
                },
                {
                    "x1": circles[5].x,
                    "y1": xlineY,
                    "x2": circles[5].x,
                    "y2": xlineY - xlineYlength
                }
            ];
            console.log(cliPath.legend);
            console.log(cliPath.legend.normalScore);
            console.log(cliPath.legend.maxScore);

            text.push(
                {
                    x: circles[0].x-10,
                    y: xlineY + 13,
                    content:cliPath.legend.normalScore.toFixed(1)
                },
                {
                    x: circles[1].x-10,
                    y: xlineY + 13,
                    content:((cliPath.legend.normalScore + cliPath.legend.maxScore)/2).toFixed(1)
                },
                {
                    x: circles[2].x-10,
                    y: xlineY + 13,
                    content:cliPath.legend.maxScore.toFixed(1)
                },
                {
                    x: circles[3].x-10,
                    y: xlineY + 13,
                    content:cliPath.legend.minCost.toFixed(1)
                },
                {
                    x: circles[4].x-15,
                    y: xlineY + 13,
                    content:(cliPath.legend.minScore + cliPath.legend.maxCost).toFixed(1)
                },
                {
                    x: circles[5].x-5,
                    y: xlineY + 13,
                    content:cliPath.legend.maxCost.toFixed(1)
                },
                {
                    x: circles[2].x + 20,
                    y: xlineY,
                    content:"得分"
                },
                {
                    x: circles[5].x + 20,
                    y: xlineY,
                    content:"花费(元)"
                }
                // {
                //     x: rects[2].x + rect.width + 4 + extraDx,
                //     y: circles[1].y + 5,
                //     content: "得分"+ cliPath.legend.maxScore +"的事件"
                // },
                // {
                //     x: rects[2].x + rect.width + 4 + extraDx,
                //     y: circles[2].y + 5,
                //     content: "花费"+ cliPath.legend.minCost +"元的事件"
                // },
                // {
                //     x: rects[2].x + rect.width + 4 + extraDx,
                //     y: circles[3].y + 5,
                //     content: "花费"+ cliPath.legend.maxCost +"元的事件"
                // },
                // {
                //     x: rects[2].x + rect.width + 10,
                //     y: circles[4].y,
                //     content: "标准路径"
                // }
            );
            var defs = svg.append("defs");

            var arrowMarker = defs.append("marker")
                .attr("id","arrow")
                .attr("markerUnits","strokeWidth")
                .attr("markerWidth","12")
                .attr("markerHeight","12")
                .attr("viewBox","0 0 12 12")
                .attr("refX","10")
                .attr("refY","6")
                .attr("orient","auto");

            var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";

            arrowMarker.append("path")
                .attr("d",arrow_path)
                .attr("fill","#000");
            svg.selectAll()
                .data(xline)
                .enter()
                .append("line")
                .attr("x1",function (d) {return d.x1;})
                .attr("y1",function (d) {return d.y1;})
                .attr("x2",function (d) {return d.x2;})
                .attr("y2",function (d) {return d.y2;})
                .style({
                    "stroke-width": 1,
                    "stroke": "black"
                })
                .attr("marker-end",function (d) {
                    if(!!d.isXAxis){
                        return "url(#arrow)"
                    }
                });

            svg.selectAll()
                .data(rects)
                .enter()
                .append("rect")
                .attr("x", margin.left)
                .attr("y",function (d) {return d.y;})
                .attr("width",function (d) {return d.dx;})
                .attr("height",function (d) {return d.dy;})
                .attr("fill",function (d) {return d.color;})
                .style("opacity",function (d) {return d.opacity});
            svg.selectAll()
                .data(text)
                .enter()
                .append("text")
                .attr("x",function (d) {return d.x;})
                .attr("y",function (d) {return d.y;})
                .text(function (d) {
                    return d.content;
                });
            svg.selectAll()
                .data(circles)
                .enter()
                .append("circle")
                .attr("cy", circleY)
                .attr("cx",function (d) {return d.x;})
                .attr("r",function (d) {return d.r;})
                // .attr("height",function (d) {return d.dy;})
                .attr("fill",function (d) {return d.color;});
                // .style("opacity",function (d) {return d.opacity});
        };
        function getFlowData(cxA,cyA,rA,upTargets,downTargets,margin,width,isComplete) {
            var lineData = [{
                    x: 0,
                    y: cyA[upTargets[0]]
                }],
                upPTL = upTargets.length,
                dowmPTL = downTargets.length;
            for(var i=0;i<upPTL;i++){
                var tempX = cxA[upTargets[i]],
                    tempY = cyA[upTargets[i]],
                    tempR = rA[upTargets[i]];
                lineData.push({
                    x:tempX,
                    y:tempY-tempR
                });
            }
            if(isComplete === 1){
                lineData.push({
                    x: width+margin.left,
                    y: tempY-tempR
                },{
                    x: width+margin.left,
                    y:cyA[downTargets[dowmPTL-1]]+rA[downTargets[dowmPTL-1]]+5
                });
            }
            // console.log(downTargets);
            for(i=dowmPTL-1;i>=0;i--){
                // console.log(i);
                var temp2X = cxA[downTargets[i]],
                    temp2Y = cyA[downTargets[i]],
                    temp2R = rA[downTargets[i]];
                // console.log(temp2R);
                lineData.push({
                    x:temp2X,
                    y:temp2Y+temp2R
                });
            }
            lineData.push({
                    x: 0,
                    y: temp2Y+temp2R
                },
                {
                    x: 0,
                    y: cyA[upTargets[0]]
                });
            return lineData;
        }
        function interpolateNumber(a,b) {
            // console.log(a);
            // console.log(b);
            // a = +a, b = +b;
            return function(t) {
                return a * (1 - t) + b * t;
            };
        }
        function createLinkFromNodes(cxA,cyA,rA,upTargets,downTargets,margin,width,isLackOfSixPhase,dx) {
            if(isLackOfSixPhase === 1){
                cxA.push(cxA[cxA.length-1]);
                cyA.push(cyA[downTargets[downTargets.length-1]]);
                rA.push(rA[downTargets[downTargets.length-1]]);
                downTargets.push(cxA.length-1);
            }
            var cxAL = cxA.length,
                x0 = cxA[0],
                x1 = cxA[1],
                xi = interpolateNumber(x0,x1),
                curvature = 0.5,
                // x2 = xi(curvature),
                // x3 = xi(1-curvature),
                y0 = cyA[upTargets[0]]-rA[upTargets[0]],
                y1 = cyA[upTargets[1]]-rA[upTargets[1]],
                pathVal = "M" + margin.left + ","+ y0 + " L" + x0 + "," + y0;
            var upTL = upTargets.length,
                downTL = downTargets.length,
                i1,
                i2;
            for(var i=0;i<upTL-1;i++){
                i1 = upTargets[i];
                i2 = upTargets[i+1];
                x0 = cxA[i1];
                x1 = cxA[i2];
                xi = interpolateNumber(x0,x1);
                y0 = cyA[i1] - rA[i1] ;
                y1 = cyA[i2] - rA[i2] ;
                pathVal +=
                    "C" + xi(curvature) + "," + y0 +
                    " " + xi(1-curvature) + "," + y1 +
                    " " + x1 + "," + y1;
            }
            console.log(dx);
            console.log(cxA[upTargets[upTL-1]]+dx);
            // pathVal += "L" + x1 + "," + (cyA[downTargets[downTL-1]] + rA[downTargets[downTL-1]] + 5);
            //     // "L" + cxA[cxAL-1] + "," + (cyA[downTargets[downTL-1]] + rA[downTargets[downTL-1]] + 5);
            // pathVal += "L" + (width + margin.left) + "," + (cyA[upTargets[upTL-1]] - rA[upTargets[upTL-1]] - 5) +
            //     "L" + (width + margin.left) + "," + (cyA[downTargets[downTL-1]] + rA[downTargets[downTL-1]] + 5)+
            //     "L" + cxA[cxAL-1] + "," + (cyA[downTargets[downTL-1]] + rA[downTargets[downTL-1]] + 5);
            pathVal += "L" + (cxA[upTargets[upTL-1]]+dx) + "," + (cyA[upTargets[upTL-1]] - rA[upTargets[upTL-1]] ) +
                "L" + (cxA[upTargets[upTL-1]]+dx) + "," + (cyA[downTargets[downTL-1]] + rA[downTargets[downTL-1]] )+
                "L" + cxA[cxAL-1] + "," + (cyA[downTargets[downTL-1]] + rA[downTargets[downTL-1]] );
            for(i=downTL-1;i>0;i--){
                console.log("down!");
                i1 = downTargets[i];
                i2 = downTargets[i-1];
                x0 = cxA[i1];
                x1 = cxA[i2];
                xi = interpolateNumber(x0,x1);
                y0 = cyA[i1] + rA[i1] ;
                y1 = cyA[i2] + rA[i2] ;
                pathVal +=
                    "C" + xi(curvature) + "," + y0 +
                    " " + xi(1-curvature) + "," + y1 +
                    " " + x1 + "," + y1;
            }
            pathVal += "L" + margin.left + ","+ (cyA[downTargets[0]] + rA[downTargets[0]] );
            // console.log(pathVal);
            return pathVal;
        }
    }

})();

