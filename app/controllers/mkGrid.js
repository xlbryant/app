/**
 * Created by Wemakefocus on 2016/7/18.
 */
angular.module('app')
    .controller('MkGridController',MkGridController);
function MkGridController($scope,$compile,$rootScope) {
    // console.log("it is MkDisplaydataController");
    // console.log($scope);
    $scope.isInit = 1;
    var urllist=[];
    var pointer=0;
    var urltable="http://1.85.37.136:9999/medknowledge/list/";
    var urlop="http://1.85.37.136:9999/medknowledge/op/";
    var urlfilter="http://1.85.37.136:9999/medknowledge/list/";
    var chance=0;
    var screenwith = screen.with - 244;
    $scope.screenwith = "with:"+screenwith+"px";
    console.log("$scope.screenwith");
///////////////////// display medical data ////////////////////
    $scope.displayData = function (tables,nums){
        if(!!$scope.table){
            $("#example1").html('<div class="" ');
            $scope.table.api().destroy();
        }
        var json = {};
        $("#example1 thead tr th").each(function(){ // add or remove click event to decide asc or desc sort
            if($(this).attr("class").indexOf("click")>=0) {
                if($(this).attr("class").indexOf("asc")>=0) {
                    json["Sort_item"]=$(this).attr("id");
                } else if($(this).attr("class").indexOf("desc")>=0) {
                    var sss=$(this).attr("id");
                    json["Sort_item"]="-"+sss;
                }
            }
        })
        json["Table"] = tables;
        var numss=1;
        if(nums=="forward"){
            numss=parseInt($("#pagination .active").text())+1;
        }else if(nums=="back"){
            numss=parseInt($("#pagination .active").text())-1;
        }else{
            numss=nums;
        }
        json["Start"]=(numss-1)*20||0;
        json["End"] = numss*20||20;
        var jsonStr={};

////////////////////// according to different type to get different data /////////////        
        if(tables=="Disease") { // disease
            var Icd10=$("#ICD10").val();
            var Name=$("#名字").val();
            var Ename=$("#英文名").val();
            var Oname=$("#别名").val();
            var Dclass=$("#科室").val();
            if($scope.isInit === 1) json["Sort_item"] = "Icd10";
            var filter={};
            filter["Icd10"]=Icd10;
            filter["Name"]=Name;
            filter["Ename"]=Ename;
            filter["Oname"]=Oname;
            filter["Dclass"] = Dclass;
            json["Filter"]=filter;
            jsonStr = JSON.stringify(json);
        }else
        if(tables=="Symptom") { //symptom

            var Name=$("#名称").val();
            var Yjks=$("#一级科室").val();
            var Ejks=$("#二级科室").val();
            var Yjbw=$("#一级部位").val();
            var Ejbw=$("#二级部位").val();
            if($scope.isInit === 1) json["Sort_item"] = "Name";
            var filter={};
            filter["Name"]=Name;
            filter["Yjks"]=Yjks;
            filter["Ejks"]=Ejks;
            filter["Yjbw"]=Yjbw;
            filter["Ejbw"]=Ejbw;
            json["Filter"]=filter;
            jsonStr = JSON.stringify(json);


        }else
        if(tables=="Medication"){ //medication
            var Name=$("#名字").val();
            var Ename=$("#英文名").val();
            var Oname=$("#别名").val();
            var Sclass=$("#类别").val();
            if($scope.isInit === 1) json["Sort_item"] = "Name";
            var filter={};
            filter["Name"]=Name;
            filter["Ename"]=Ename;
            filter["Oname"]=Oname;
            filter["Sclass"]=Sclass;
            json["Filter"]=filter;
            jsonStr = JSON.stringify(json);
        }else
        if(tables=="Medicare"){ //medicare


            var Name=$("#名字").val();
            var Ename=$("#英文名").val();
            var Fclass=$("#分类").val();
            var Ybbxjx=$("#医保报销剂型").val();
            var Ybbxxzlb=$("#报销限制类别").val();
            if($scope.isInit === 1) json["Sort_item"] = "Name";
            var filter={};
            filter["Name"]=Name;
            filter["Ename"]=Ename;
            filter["Ybbxjx"]=Ybbxjx;
            filter["Fclass"]=Fclass;
            filter["Ybbxxzlb"]=Ybbxxzlb;
            json["Filter"]=filter;
            jsonStr = JSON.stringify(json);

        }else
        if(tables=="Lab") { //lab

            var Name=$("#名字").val();
            var Ename=$("#英文名字").val();
            var Oname=$("#别名").val();
            var Fclass=$("#一级分类").val();
            var Sclass=$("#二级分类").val();
            if($scope.isInit === 1) json["Sort_item"] = "Name";
            var filter={};
            filter["Name"]=Name;
            filter["Ename"]=Ename;
            filter["Oname"]=Oname;
            filter["Fclass"]=Fclass;
            filter["Sclass"]=Sclass;
            json["Filter"]=filter;
            jsonStr = JSON.stringify(json);


        }else
        if(tables=="Clinicalpath") { //clinicalpath

            var Name=$("#名字").val();
            var classs=$("#分类").val();
            var Year=$("#版本号").val();
            if($scope.isInit === 1) json["Sort_item"] = "Name";
            var filter={};
            filter["Name"]=Name;
            filter["Class"]=classs;
            filter["Year"]=Year;
            json["Filter"]=filter;
            jsonStr = JSON.stringify(json);

        }else
        if(tables=='Evidence') { //evidence

            var title=$("#题目").val();
            var type=$("#类型 ").val();
            var dis=$("#研究疾病").val();
            var author=$("#作者").val();
            var from=$("#出处").val();
            // var download=$("#下载").val();
            if($scope.isInit === 1) json["Sort_item"] = "Name";
            var filter={};
            filter["Name"]=title;
            filter["Fclass"]=type;
            filter["Jbyj"]=dis;
            filter["Zz"]=author;
            filter["Cc"]=from;
            // filter["Pdf"]=download;
            json["Filter"]=filter;
            jsonStr = JSON.stringify(json);

        }
        else
        if(tables==='Research') { //research

            var Name =$("#疾病名称").val();
            var Ename = $("#英文名").val();
            var Oname = $("#别名").val();
            var Fclass = $("#疾病分类").val();
            var Icd10 = $("#ICD号").val();
            //  var Pdf = $("#下载").val();
            if($scope.isInit === 1) json["Sort_item"] = "Name";
            var filter={};
            filter["Name"] = Name;
            filter["Ename"] = Ename;
            filter["Oname"] = Oname;
            filter["Fclass"] = Fclass;
            filter["Icd10"] = Icd10;
            // filter["Pdf"] =Pdf;
            json["Filter"]=filter;
            jsonStr = JSON.stringify(json);

        }
        else
        if(tables === 'Clinicalg') { //clinical guide

            var Name = $("#题目").val();
            var Fclass = $("#分类").val();
            if($scope.isInit === 1) json["Sort_item"] = "Name";
            var filter={};
            filter["Name"] = Name;
            filter["Fclass"] = Fclass;
            json["Filter"] = filter;
            jsonStr = JSON.stringify(json);
        }
        else
        if(tables === 'Video') {

            var Name = $("#视频名 ").val();
            var Fclass = $("#学科类别--学科--专业").val();
            if($scope.isInit === 1) json["Sort_item"] = "Name";
            var filter={};
            filter["Name"] = Name;
            filter["Fclass"] = Fclass;
            json["Filter"] = filter;
            jsonStr = JSON.stringify(json);
        }
        else
        if(tables === 'Otherres') {

            var Name = $('#题目').val();
            var Fclass = $('#分类').val();
            if($scope.isInit === 1) json["Sort_item"] = "Name";
            var filter={};
            filter["Name"] = Name;
            filter["Fclass"] = Fclass;
            json["Filter"] = filter;
            jsonStr = JSON.stringify(json);
        }


        var canshu={"q":jsonStr};
        $.ajax({
            type: "GET",
            url: urlfilter,
            data:canshu,
            dataType: "json",
            success: function(data) {
                if(tables=="Disease") {

                    $scope.displayDisease(data,"Disease",nums);

                }else if(tables=="Symptom") {

                    $scope.displaySymptom(data,"Symptom",nums);

                }else if(tables=="Medication") {

                    $scope.displayMedication(data,"Medication",nums);

                }else if(tables=="Lab") {

                    $scope.displayLab(data,"Lab",nums);

                }else if(tables=="Medicare") {

                    $scope.displayMedicare(data,"Medicare",nums);

                }else  if(tables=="Clinicalpath") {

                    $scope.displayClinicalpath(data,"Clinicalpath",nums);

                }else if(tables=="Evidence") {

                    $scope.displayEvidence(data,"Evidence",nums);
                }else if(tables==="Research") {

                    $scope.displayResearch(data,"Research",nums);
                }else if(tables==="Clinicalg" ) {

                    $scope.displayClinicalg(data,"Clinicalg",nums);
                }else if(tables==='Video') {

                    $scope.displayVideo(data,"Video",nums);
                }else if(tables === 'Otherres') {

                    $scope.displayOtherres(data,"Otherres",nums);
                }


            }



        });
    }

    //////////////////  init to display page 1 //////////////////
    if(!!$rootScope.mkCurrentPage){

        if(!!$scope.table) $scope.table.api().destroy();
        $('#example1_wrapper').find('thead tr th').remove();
        $scope.displayData($rootScope.mkCurrentPage,1);
    }

    ////////// bind click evnt to each records to display more information //////////////////////
    $scope.bindclick = function(tables){

        if(tables=="Disease")
        {
            $(".dis_click").click(function(){

                var id=$(this).attr("id");
                var json={};
                json["Table"] = tables;
                json["Did"]=id;
                var jsonStr = JSON.stringify(json);
                var canshu={"q":jsonStr};
                $.getJSON(urlop,canshu,function(datas) {
                    var times=10;
                    urllist=[];
                    pointer=0;
                    var strs="disease/";
                    strs=strs+id;
                    urllist.push(strs);
                    pointer++;
                    var details="";
                    var mainwords_dis={"Ename":"英文名字","Oname":"别名","Icd10":"Icd10"};
                    var dkey={"Gs":"概述" ,"Lxbx":"流行病学" ,"By":"病因" ,"Fbjz":"发病机制" ,"Lcbx":"临床表现" ,"Bfz":"并发症" ,"Sysjc":"实验室检查" ,"Qtfzjc":"其他辅助检查" ,"Zd":"诊断" ,"Jbzd":"鉴别诊断" ,"Zl":"治疗" ,"Yh":"预后" ,"Yf":"预防" };
                    details=details+'<div class="modal-header">';
                    details=details+'<button type="button" class="close"';
                    details=details+' data-dismiss="modal" aria-hidden="true"> &times';
                    details=details+'</button>';
                    details=details+'<h2  style="color: #3c8dbc; text-align:center " class="modal-title bigtitle" id="myModalLabel">';
                    details=details+datas.Results["Name"];
                    details=details+'</h2>';
                    details=details+'<div style="float:right" ><a href="javascript:void(0);" ng-click="showback()" style="display:none"><i class="fa fa-fw fa-arrow-left"></i>后退</a>';
                    details=details+'<a href="javascript:void(0);" style="display:none"><i class="fa fa-fw fa-arrow-right"></i>前进</a> </div>';
                    details=details+'</div><div class="modal-body" du-scroll-container>';
                    //nava bar
                    details=details+'<div class="col-md-3" role="complementary">';
                    //details=details+'<nav class="bs-docs-sidenav hidden-print hidden-xs hidden-sm affix-top" >';
                    details=details+'<ul class="nav  nav-list bs-docs-sidenav affix" id="gundongtiao">';
                    for(var j in dkey) {
                        for(var i in datas.Results) {
                            if(i==j) {
                                details=details+'<li class>';
                                details=details+'<a href="#'+j+'" du-smooth-scroll du-scrollspy><i class="fa fa-fw fa-chevron-right iconss"></i>'+dkey[j]+'</a>';
                                details=details+'</li>';
                            }
                        }
                    }
                    details=details+'</ul>';
                    //    details=details+'</nav>';
                    details=details+'</div>';
                    //end nav
                    details+='<div class="col-md-9" role="main">'; // generate table data
                    var de='<table class="table table-bordered table-striped"><thead>'+
                        '<tr>'+
                        '<th>英文名称</th>'+
                        '<th>别名</th>'+
                        '<th>ICD10</th>'+
                        '</tr>'+
                        '</thead>'+
                        ' <tbody>'+
                        '<tr>';
                    for(var m in mainwords_dis) {
                        for(var n in datas.Results) {
                            if(m==n) {
                                if(m!="Oname") {
                                    de+='<td>';
                                    de+=datas.Results[n];
                                    de+='</td>';
                                }else{
                                    de+='<td>';
                                    de+=datas.Results[n];
                                    de+='</td>';
                                }
                            }

                        }

                    }
                    de+='</tr>';
                    de+='</tbody></table>';
                    for(var j in dkey) {
                        for(var i in datas.Results) {

                            var temp=0;
                            var title="";
                            if(i==j) {

                                de=de+'<h3 style="color: #3c8dbc;" id="'+i+'">'+dkey[i]+'</h3>';
                                var rs=eval(datas.Results[i]);
                                for(var m in rs ) {

                                    if(rs[m][0]=='0') {

                                        de=de+rs[m][1];
                                    } else if(rs[m][0]=='1') {

                                        de=de+"<a href='javascript:void(0);' ng-click=\"showdetails('"+rs[m][2]+"')\">"+rs[m][1]+"</a>";

                                    } else if(rs[m][0]=='10') {

                                        de=de+'</br>';
                                    } else if(rs[m][0]=='2') {

                                        de=de+'</br>';
                                        var imagelist=rs[m][1].split("/");
                                        if(imagelist[1]!=null) {

                                            var height=200,width=100;
                                            if(rs[m][2]!=0) {

                                                height=rs[m][2];
                                            }

                                            if(rs[m][3]!=0) {

                                                width=rs[m][3];
                                            }
                                            var imageurl='http://1.85.37.136:9999/medknowledge/imageop/?q={"Iid":"'+imagelist[1]+'"}';
                                            de=de+'<div><img alt="User Image" src='+ imageurl+'  style="width:'+width+', height:'+height+'"/></div>';
                                            de=de+'</br>';
                                        }


                                    }

                                }

                            }
                        }

                    }
                    details=details+de;
                    details=details+'</div>';
                    details=details+'</div>';
                    $(".modal-content").html("");
                    $scope.details=$compile(details)($scope); // compile again to fresh data
                    angular.element('.modal-content').html($scope.details);
                    $('#myModal').modal();

                });

            });

        } else if(tables=="Symptom") {

            $(".dis_click").click(function() {
                var id=$(this).attr("id");
                var json={};
                json["Table"] = "Symptom";
                json["Sid"]=id;
                var jsonStr = JSON.stringify(json);
                var canshu={"q":jsonStr};
                //  console.log(canshu);
                $.getJSON(urlop, canshu, function(datas) {
                    urllist=[];
                    pointer=0;
                    // console.log(datas);
                    var strs="symptom/";
                    strs=strs+id;
                    urllist.push(strs);
                    pointer++;
                    var details="";
                    var dkey={"Zs":"综述", "Zzxs":"症状详述", "Zzqy":"症状起因","Dzyp":"对症药品","Xszz":"相似症状"};
                    var mainwords_sym={"Yjks":"一级科室","Ejks":"二级科室","Yjbw":"一级部位","Ejbw":"二级部位"};
                    details=details+'<div class="modal-header">';
                    details=details+'<button type="button" class="close"';
                    details=details+' data-dismiss="modal" aria-hidden="true"> &times';
                    details=details+'</button>';
                    details=details+'<h2  style="color: #3c8dbc;text-align:center" class="modal-title" id="myModalLabel">';
                    details=details+datas.Results["Name"];
                    details=details+'</h2>';
                    details=details+'<div style="float:right" ><a href="javascript:void(0);" ng-click="showback()" style="display:none"><i class="fa fa-fw fa-arrow-left"></i>后退</a>';
                    details=details+'<a href="javascript:void(0);" style="display:none"><i class="fa fa-fw fa-arrow-right"></i>前进</a> </div>';
                    details=details+'</div><div class="modal-body" du-scroll-container>';
                    details=details+'<div class="col-md-3" role="complementary">';
                    // details=details+'<nav class="bs-docs-sidenav hidden-print hidden-xs hidden-sm affix-top" >';
                    details=details+'<ul class="nav  nav-list bs-docs-sidenav affix" id="gundongtiao">';
                    for(var j in dkey) {

                        for(var i in datas.Results) {

                            if(i==j) {

                                details=details+'<li>';
                                details=details+'<a href="#'+j+'"du-smooth-scroll du-scrollspy><i class="fa fa-fw fa-chevron-right iconss"></i>'+dkey[j]+'</a>';
                                details=details+'</li>';
                            }
                        }
                    }
                    details=details+'</ul>';
                    details=details+'</div>';
                    details+='<div class="col-md-9">';
                    var de='<table class="table table-bordered table-striped"><thead>'+
                        '<tr>'+
                        '<th>一级科室</th>'+
                        '<th>二级科室</th>'+
                        '<th>一级部位</th>'+
                        '<th>二级部位</th>'+
                        '</tr>'+
                        '</thead>'+
                        ' <tbody>'+
                        '<tr>';
                    for(var m in mainwords_sym) {

                        for(var n in datas.Results) {

                            if(m==n) {

                                var ts=datas.Results[n];
                                if(ts) {
                                    de+='<td>';
                                    de+=datas.Results[n];
                                    de+='</td>';
                                }
                            }

                        }

                    }
                    de+='</tr>';
                    de+='</tbody></table>';
                    for(var j in dkey) {

                        for(var i in datas.Results) {

                            var temp=0;
                            var title="";
                            if(i==j) {

                                de=de+'<h3 style="color: #3c8dbc;" id="'+i+'">'+dkey[i]+'</h3>';
                                var rs=eval(datas.Results[i]);
                                for(var m in rs ) {

                                    if(rs[m][0]=='0') {

                                        de=de+rs[m][1];
                                    } else if(rs[m][0]=='1') {

                                        de=de+"<a href='javascript:void(0);' ng-click=\"showdetails('"+rs[m][2]+"')\">"+rs[m][1]+"</a>";

                                    } else if(rs[m][0]=='10') {

                                        de=de+'</br>';
                                    } else if(rs[m][0]=='2') {

                                        de=de+'</br>';
                                        var imagelist=rs[m][1].split("/");
                                        if(imagelist[1]!=null) {

                                            var height=200,width=400;
                                            if(rs[m][2]!=0){
                                                height=rs[m][2];
                                            }

                                            if(rs[m][3]!=0) {

                                                width=rs[m][3];
                                            }
                                            var imageurl='http://1.85.37.136:9999/medknowledge/imageop/?q={"Iid":"'+imagelist[1]+'"}';
                                            de=de+'<div><img alt="User Image" src='+ imageurl+'  style="width:'+width+', height:'+height+'"/></div>';
                                            de=de+'</br>';
                                        }
                                    }

                                }

                            }
                        }

                    }


                    //可能疾病和常用检查

                    //  for(var i in datas.Results)
                    //   {
                    //     if(i=="Knjb"){
                    //       de=de+'<h3 style="color: #3c8dbc;" id="'+i+'"><b>可能疾病</b></h3>';
                    //       de+='<table class="table table-bordered table-striped"><thead>'+
                    //                   '<tr>'+
                    //                        '<th>可能疾病</th>'+
                    //                        '<th>伴随症状</th>'+
                    //                        '<th>就诊科室</th>'+
                    //                     //   '<th>二级部位</th>'+
                    //                    '</tr>'+
                    //              '</thead>'+
                    //              ' <tbody>'+
                    //     //   console.log(eval(datas.Results[i]));
                    //        var knbj={};
                    //        kbnj=eval(datas.Results[i]);
                    //        for(var j=0;j<knbj.length;j++)
                    //        {
                    //             de+='<tr>';
                    //           //  console.log(knbj[j]);
                    //             var strs="disease/"+knbj[j]["did"];
                    //              de+="<td><a href='javascript:void(0);' ng-click=\"showdetails('"+strs+"')\">";
                    //              de+=knbj[j]["dname"];
                    //              de+='</a></td>';
                    //              de+='<td>';
                    //              var temp="";
                    //              for(var p=0;p<knbj[j]["伴随症状"].length;p++){
                    //              temp+=knbj[j]["伴随症状"][p]["sname"]+" ";
                    //           //   console.log(temp);
                    //              }
                    //           //   de+=temp;
                    //              de+='</td>';
                    //              de+='<td>';
                    //              de+=knbj[j]["dname"];
                    //              de+='</td>';
                    //              de+='</tr>';
                    //        }
                    //     }
                    // //  console.log(datas.Results[i]);
                    //
                    //   }

                    //   de+='</tbody></table>';
                    details=details+de;
                    details=details+'</div>';
                    details=details+'</div>';
                    $(".modal-content").html("");
                    $(".modal-content").html($compile(details)($scope));

                });
            });



        } else if(tables=="Medication") {
            $(".dis_click").click(function() {
                var id=$(this).attr("id");
                var json={};
                json["Table"] = "Medication";
                json["Mid"]=id;
                var jsonStr = JSON.stringify(json);
                var canshu={"q":jsonStr};
                // console.log(canshu);
                $.getJSON(urlop, canshu, function(datas) {

                    urllist=[];
                    pointer=0;
                    var strs="medication/";
                    strs=strs+id;
                    urllist.push(strs);
                    pointer++;
                    var details="";
                    var mainwords_med={"Ename":"英文名称","Oname":"别名","Sclass":"类别"};
                    var dkey={"Ylzy":"药理作用","Yfyl":"用法用量", "Ydx":"药动学", "Zysx":"注意事项", "Zjdp":"专家点评", "Ywxhzy":"药物相互作用", "Jjz":"禁忌症", "Syz":"适应症", "Ywjx":"药物剂型", "Blfy":"不良反应"};
                    details=details+'<div class="modal-header">';
                    details=details+'<button type="button" class="close"';
                    details=details+' data-dismiss="modal" aria-hidden="true"> &times';
                    details=details+'</button>';
                    details=details+'<h2  style="color: #3c8dbc; text-align:center" class="modal-title" id="myModalLabel">';
                    details=details+datas.Results["Name"];
                    details=details+'</h2>';
                    details=details+'<div style="float:right" ><a href="javascript:void(0);" ng-click="showback()" style="display:none"><i class="fa fa-fw fa-arrow-left"></i>后退</a>';
                    details=details+'<a href="javascript:void(0);" style="display:none"><i class="fa fa-fw fa-arrow-right"></i>前进</a> </div>';
                    details=details+'</div><div class="modal-body" du-scroll-container>';
                    details=details+'<div class="col-md-3" role="complementary">';
                    details=details+'<ul class="nav  nav-list bs-docs-sidenav affix" id="gundongtiao">';
                    for(var j in dkey) {

                        for(var i in datas.Results) {

                            if(i==j) {

                                details=details+'<li>';
                                details=details+'<a href="#'+j+'"du-smooth-scroll du-scrollspy><i class="fa fa-fw fa-chevron-right iconss"></i>'+dkey[j]+'</a>';
                                details=details+'</li>';
                            }
                        }
                    }
                    details=details+'</ul>';
                    details=details+'</div>';
                    details+='<div class="col-md-9">';
                    var de='<table class="table table-bordered table-striped"><thead>'+
                        '<tr>'+
                        '<th>英文名称</th>'+
                        '<th>别名</th>'+
                        '<th>类别</th>'+
                        '</tr>'+
                        '</thead>'+
                        ' <tbody>'+
                        '<tr>';
                    for(var m in mainwords_med) {

                        for(var n in datas.Results) {

                            if(m==n) {
                                if(m!="Oname") {

                                    de+='<td>';
                                    de+=datas.Results[n];
                                    de+='</td>';
                                } else {

                                    de+='<td>';
                                    de+=datas.Results[n];
                                    de+='</td>';
                                }
                            }

                        }

                    }
                    de+='</tr>';
                    de+='</tbody></table>';
                    for(var j in dkey) {

                        for(var i in datas.Results) {

                            var temp=0;
                            var title="";
                            if(i==j) {
                                de=de+'<h3 style="color: #3c8dbc;" id="'+i+'">'+dkey[i]+'</h3>';
                                var rs=eval(datas.Results[i]);
                                for(var m in rs ) {

                                    if(rs[m][0]=='0') {

                                        de=de+rs[m][1];
                                    } else if(rs[m][0]=='1') {

                                        de=de+"<a href='javascript:void(0);' ng-click=\"showdetails('"+rs[m][2]+"')\">"+rs[m][1]+"</a>";
                                    } else if(rs[m][0]=='10') {

                                        de=de+'</br>';
                                    } else if(rs[m][0]=='2') {

                                        de=de+'</br>';
                                        var imagelist=rs[m][1].split("/");
                                        if(imagelist[1]!=null) {

                                            var height=200,width=100;
                                            if(rs[m][2]!=0) {

                                                height=rs[m][2];
                                            }
                                            if(rs[m][3]!=0) {

                                                width=rs[m][3];
                                            }
                                            var imageurl='http://1.85.37.136:9999/medknowledge/imageop/?q={"Iid":"'+imagelist[1]+'"}';
                                            de=de+'<div><img alt="User Image" src='+ imageurl+'  style="width:'+width+', height:'+height+'"/></div>';
                                            de=de+'</br>';
                                        }
                                    }

                                }

                            }
                        }

                    }
                    details=details+de;
                    details=details+'</div>';
                    details=details+'</div>';
                    $(".modal-content").html("");
                    $(".modal-content").html($compile(details)($scope));
                });
            });


        } else if(tables=="Lab") {

            $(".dis_click").click(function() {

                var id=$(this).attr("id");
                var json={};
                json["Table"] = "Lab";
                json["Lid"]=id;
                var jsonStr = JSON.stringify(json);
                var canshu={"q":jsonStr};
                $.getJSON(urlop,canshu,   function(datas) {
                    //console.log(datas);
                    urllist=[];
                    pointer=0;
                    var strs="laboratory/";
                    strs=strs+id;
                    urllist.push(strs);
                    pointer++;
                    var details="";
                    var mainwords_lab={"Ename":"英文名字","Oname":"别名","Fclass":"Fclass","Sclass":"Sclass"};
                    var dkey={"Gs":"概述","Yl":"原理", "Sj":"试剂", "Zcz":"正常值","Lcyy":"临床意义","Czff":"操作方法","Fz":"附注"};
                    details=details+'<div class="modal-header">';
                    details=details+'<button type="button" class="close"';
                    details=details+' data-dismiss="modal" aria-hidden="true"> &times';
                    details=details+'</button>';
                    details=details+'<h2  style="color: #3c8dbc; text-align:center " class="modal-title" id="myModalLabel">';
                    details=details+datas.Results["Name"];
                    details=details+'</h2>';
                    details=details+'<div style="float:right" ><a href="javascript:void(0);" ng-click="showback()" style="display:none"><i class="fa fa-fw fa-arrow-left"></i>后退</a>';
                    details=details+'<a href="javascript:void(0);" style="display:none"><i class="fa fa-fw fa-arrow-right"></i>前进</a> </div>';
                    details=details+'</div><div class="modal-body" du-scroll-container>';
                    details=details+'<div class="col-md-3" role="complementary">';
                    details=details+'<ul class="nav  nav-list bs-docs-sidenav affix" id="gundongtiao">';
                    for(var j in dkey) {
                        for(var i in datas.Results) {

                            if(i==j) {

                                details=details+'<li>';
                                details=details+'<a href="#'+j+'"du-smooth-scroll du-scrollspy><i class="fa fa-fw fa-chevron-right iconss"></i>'+dkey[j]+'</a>';
                                details=details+'</li>';
                            }
                        }
                    }
                    details=details+'</ul>';
                    details=details+'</div>';
                    details+='<div class="col-md-9">';
                    var de='<table class="table table-bordered table-striped"><thead>'+
                        '<tr>'+
                        '<th>英文名称</th>'+
                        '<th>别名</th>'+
                        '<th>一级分类</th>'+
                        '<th>二级分类</th>'+
                        '</tr>'+
                        '</thead>'+
                        ' <tbody>'+
                        '<tr>';
                    for(var m in mainwords_lab) {

                        for(var n in datas.Results) {

                            if(m==n) {

                                if(m!="Oname") {

                                    de+='<td>';
                                    de+=datas.Results[n];
                                    de+='</td>';
                                } else {

                                    de+='<td>';
                                    de+=datas.Results[n];
                                    de+='</td>';
                                }
                            }

                        }

                    }
                    de+='</tr>';
                    de+='</tbody></table>';
                    for(var j in dkey) {

                        for(var i in datas.Results) {

                            var temp=0;
                            var title="";
                            if(i==j) {

                                de=de+'<h3 style="color:#3c8dbc;" id="'+i+'">'+dkey[i]+'</h3>';
                                var rs=eval(datas.Results[i]);
                                for(var m in rs ) {

                                    if(rs[m][0]=='0') {

                                        de=de+rs[m][1];
                                    } else if(rs[m][0]=='1') {

                                        de=de+"<a href='javascript:void(0);' ng-click=\"showdetails('"+rs[m][2]+"')\">"+rs[m][1]+"</a>";

                                    } else if(rs[m][0]=='10') {

                                        de=de+'</br>';
                                    } else if(rs[m][0]=='2') {

                                        de=de+'</br>';
                                        var imagelist=rs[m][1].split("/");
                                        if(imagelist[1]!=null) {

                                            var height=200,width=100;
                                            if(rs[m][2]!=0) {

                                                height=rs[m][2];
                                            }
                                            if(rs[m][3]!=0) {

                                                width=rs[m][3];
                                            }
                                            var imageurl='http://1.85.37.136:9999/medknowledge/imageop/?q={"Iid":"'+imagelist[1]+'"}';
                                            de=de+'<div><img alt="User Image" src='+ imageurl+'  style="width:'+width+', height:'+height+'"/></div>';
                                            de=de+'</br>';
                                        }
                                    }

                                }

                            }
                        }

                    }
                    details=details+de;
                    details=details+'</div>';
                    details=details+'</div>';
                    $(".modal-content").html("");
                    $(".modal-content").html($compile(details)($scope));
                });
            });

        } else if(tables=="Medicare") {

            $(".dis_click").click(function() {

                var id=$(this).attr("id");
                var json={};
                json["Table"] = "Medicare";
                json["Mid"]=id;
                var jsonStr = JSON.stringify(json);
                var canshu={"q":jsonStr};
                $.getJSON(urlop,canshu,
                    function(datas) {
                        if(datas.Return==0) {

                            urllist=[];
                            pointer=0;
                            var strs="medicare/";
                            strs=strs+id;
                            urllist.push(strs);
                            pointer++;
                            var details="";
                            var mainwords_dis={"Fclass":"一级类别","Sclass":"二级类别","Ybbxxzlb":"医保报销限制类别","Ybbh":"医保编号","Ybbxjx":"医保报销剂型"};
                            var dkey={"Yfyl":"用法用量" ,"Blfy":"不良反应" ,"Ylzy":"药理作用" ,"Ywxyzy":"药物相互作用" ,"Syz":"适应症" ,"Zysx":"注意事项" ,"Jjz":"禁忌症"};
                            details=details+'<div class="modal-header">';
                            details=details+'<button type="button" class="close"';
                            details=details+' data-dismiss="modal" aria-hidden="true"> &times';
                            details=details+'</button>';
                            details=details+'<h2  style="color: #3c8dbc; text-align:center " class="modal-title bigtitle" id="myModalLabel">';
                            details=details+datas.Results["Name"];
                            details=details+'</h2>';
                            details=details+'<div style="float:right" ><a href="javascript:void(0);" ng-click="showback()" style="display:none"><i class="fa fa-fw fa-arrow-left"></i>后退</a>';
                            details=details+'<a href="javascript:void(0);" style="display:none"><i class="fa fa-fw fa-arrow-right"></i>前进</a> </div>';
                            details=details+'</div><div class="modal-body" du-scroll-container>';
                            details=details+'<div class="col-md-3" role="complementary">';
                            // details=details+'<nav class="bs-docs-sidenav hidden-print hidden-xs hidden-sm affix-top" style="position:fixed;">';
                            details=details+'<ul class="nav  nav-list bs-docs-sidenav affix" id="gundongtiao">';
                            for(var j in dkey) {
                                for(var i in datas.Results) {

                                    if(i==j) {

                                        details=details+'<li>';
                                        details=details+'<a href="#'+j+'"du-smooth-scroll du-scrollspy><i class="fa fa-fw fa-chevron-right iconss"></i>'+dkey[j]+'</a>';
                                        details=details+'</li>';
                                    }
                                }
                            }
                            details=details+'</ul>';
                            details=details+'</div>';
                            details+='<div class="col-md-9" role="main">';
                            var de='<table class="table table-bordered table-striped"><thead>'+
                                '<tr>'+
                                '<th>一级类别</th>'+
                                '<th>二级类别</th>'+
                                '<th>医保报销限制类别</th>'+
                                '<th>医保编号</th>'+
                                '<th>医保报销剂型</th>'+
                                '</tr>'+
                                '</thead>'+
                                ' <tbody>'+
                                '<tr>';
                            for(var m in mainwords_dis) {

                                for(var n in datas.Results) {

                                    if(m==n) {

                                        if(m=="Ybbxjx"||m=="Ybbxxzlb") {

                                            de+='<td>';
                                            de+=datas.Results[n];
                                            de+='</td>';
                                        } else {

                                            de+='<td>';
                                            de+=(datas.Results[n]);
                                            de+='</td>';
                                        }
                                    }

                                }

                            }
                            de+='</tr>';
                            de+='</tbody></table>';
                            for(var j in dkey) {

                                for(var i in datas.Results) {
                                    var temp=0;
                                    var title="";
                                    if(i==j) {

                                        de=de+'<h3 style="color: #3c8dbc;" id="'+i+'">'+dkey[i]+'</h3>';
                                        var rs=datas.Results[i];
                                        de+=rs+'</br>';
                                    }
                                }

                            }
                            details=details+de;
                            details=details+'</div>';
                            details=details+'</div>';
                            $(".modal-content").html("");
                            $(".modal-content").html($compile(details)($scope));
                        }

                    });

            });

        } else if(tables=="Clinicalpath") {

            $(".dis_click").click(function() {

                var id=$(this).attr("id");
                var json={};
                json["Table"] = "Clinicalpath";
                json["Cid"]=id;
                var jsonStr = JSON.stringify(json);
                var canshu={"q":jsonStr};
                $.getJSON(urlop,canshu,function(datas) {

                    if(datas.Return==0) {

                        urllist=[];
                        pointer=0;
                        var strs="Clinicalpath/";
                        strs=strs+id;
                        urllist.push(strs);
                        pointer++;
                        var details="";
                        var mainwords_dis={"Name":"名字","Class":"分类","Year":"年份"};
                        var dkey={"Content":"内容" };
                        details=details+'<div class="modal-header">';
                        details=details+'<button type="button" class="close"';
                        details=details+' data-dismiss="modal" aria-hidden="true"> &times';
                        details=details+'</button>';
                        details=details+'<h2  style="color: #3c8dbc; text-align:center " class="modal-title bigtitle" id="myModalLabel">';
                        details=details+datas.Results["Name"];
                        details=details+'</h2>';
                        details=details+'<div style="float:right" ><a href="javascript:void(0);" ng-click="showback()" style="display:none"><i class="fa fa-fw fa-arrow-left"></i>后退</a>';
                        details=details+'<a href="javascript:void(0);" style="display:none"><i class="fa fa-fw fa-arrow-right"></i>前进</a> </div>';

                        details=details+'</div><div class="modal-body" du-scroll-container>';

                        details=details+'<div class="col-md-3" role="complementary">';
                        //   details=details+'<nav class="bs-docs-sidenav hidden-print hidden-xs hidden-sm affix-top" style="position:fixed;">';
                        details=details+'<ul class="nav  nav-list bs-docs-sidenav affix" id="gundongtiao">';
                        for(var j in dkey) {

                            for(var i in datas.Results) {

                                if(i==j) {

                                    var rs=eval(datas.Results[i]);
                                    for(var m in rs ) {

                                        if(rs[m][0]=='1') {

                                            details=details+'<li>';
                                            details=details+'<a href="#'+rs[m][1]+'"du-smooth-scroll du-scrollspy><i class="fa fa-fw fa-chevron-right iconss"></i>'+rs[m][1]+'</a>';
                                            details=details+'</li>';
                                        }
                                        else if(rs[m][0]=='2') {

                                            details=details+'<li>';
                                            details=details+'<a href="#'+rs[m][1]+'"du-smooth-scroll du-scrollspy><i class="fa fa-fw fa-chevron-right iconss"></i>'+rs[m][1]+'</a>';
                                            details=details+'</li>';
                                        }

                                    }

                                }
                            }

                        }
                        details=details+'</ul>';
                        details=details+'</div>';
                        details+='<div class="col-md-9" role="main">';
                        var de='<table class="table table-bordered table-striped"><thead>'+
                            '<tr>'+
                            '<th>名字</th>'+
                            '<th>类别</th>'+
                            '<th>年份</th>'+
                            '</tr>'+
                            '</thead>'+
                            ' <tbody>'+
                            '<tr>';
                        for(var m in mainwords_dis) {

                            for(var n in datas.Results) {

                                if(m==n) {

                                    de+='<td>';
                                    de+=datas.Results[n];
                                    de+='</td>';

                                }

                            }

                        }
                        de+='</tr>';
                        de+='</tbody></table>';
                        for(var j in dkey) {

                            for(var i in datas.Results) {
                                var temp=0;
                                var title="";
                                if(i==j) {
                                    //    de=de+'<h3 style="color: #3c8dbc;" id="'+i+'"><b>'+dkey[i]+'</b></h3>';
                                    var rs=eval(datas.Results[i]);
                                    for(var m in rs ) {

                                        if(rs[m][0]=='1') {

                                            de=de+'<h3 style="color: #3c8dbc;" id="'+rs[m][1]+'">'+rs[m][1]+'</h3>';
                                        } else if(rs[m][0]=='2') {

                                            de=de+'<span id="'+rs[m][1]+'">'+rs[m][1]+"</span>"+"</br>";

                                        } else if(rs[m][0]=='3') {

                                            de=de+rs[m][1]+"</br>";
                                        } else if(rs[m][0]=='table') {

                                            de=de+rs[m][1];
                                            de=de+'</br>';
                                        } else {
                                            de=de+rs[m][1]+"</br>";
                                        }

                                    }

                                }
                            }

                        }
                        details=details+de;
                        details=details+'</div>';
                        details=details+'</div>';
                        details=details+' <div class="modal-footer">';
                        details=details+'</div>';
                        $(".modal-content").html("");
                        $(".modal-content").html($compile(details)($scope));
                    }

                });
            });

        }else if(tables === "Evidence") { // display evidence
            $(".dis_click").click(function() {
                var id=$(this).attr("id");
                var json={};
                json["Table"] = "Evidence";
                json["Eid"]=id;
                var jsonStr = JSON.stringify(json);
                var canshu={"q":jsonStr};
                $.getJSON(urlop,canshu,
                    function(datas) {
                        if(datas.Return===0) {

                            urllist=[];
                            pointer=0;
                            var strs="evidence/";
                            strs=strs+id;
                            urllist.push(strs);
                            pointer++;
                            var details="";
                            var mainwords_dis={"Eid":"id","Name":"name","Pdf":"pdf","Fclass":"文献类型","Zz":"作者","Zzdw":"作者单位",
                                "Dz":"地址","Yb":"邮编","Email":"Email","Gjz":"关键字","Ywgjz":"英文关键字","Jbyj":"疾病研究","Cc":"出处","Njq":"年卷期","Zy":"摘要"};
                            details=details+'<div class="modal-header">';
                            details=details+'<button type="button" class="close"';
                            details=details+' data-dismiss="modal" aria-hidden="true"> &times';
                            details=details+'</button>';
                            details=details+'<h2  style="color: #3c8dbc; text-align:center " class="modal-title bigtitle" id="myModalLabel">';
                            details=details+datas.Results["Name"];
                            // details=details+'('+datas.Results["Pdf"]+')';
                            var pdf_name = datas.Results["Pdf"].split("/");
                            // console.log(pdf_name);
                            details=details+'('+'<a href="http://1.85.37.136:9999/medknowledge/pdfop/?q={%22Table%22:%22Pdf%22,%22Pid%22:%22'+pdf_name[2]+'%22}" ><img src="assets/img/medicalKnowledge/pdf.png" title="点击下载"></a>'+')';
                            details=details+'</h2>';
                            details=details+'<div style="float:right" ><a href="javascript:void(0);" ng-click="showback()" style="display:none"><i class="fa fa-fw fa-arrow-left"></i>后退</a>';
                            details=details+'<a href="javascript:void(0);" style="display:none"><i class="fa fa-fw fa-arrow-right"></i>前进</a> </div>';
                            details=details+'</div><div class="modal-body" du-scroll-container>';
                            details+='<div class="col-md-12" role="main">';
                            var de='<table class="table table-bordered table-striped">'+
                                '<tr>';
                            de+='<td width="10%"><b>文献类型：</b></td>';
                            de+='<td width="40%">'+datas.Results["Fclass"]+'</td>';
                            de+='<td width="25%"><b>作者：</b></td>';
                            de+='<td width="25%">'+datas.Results["Zz"]+' </td>';
                            de+='</tr>';
                            de+='<tr>';
                            de+='<td><b>作者单位:</b></td>';
                            de+='<td>'+datas.Results["Zzdw"]+'</td>';
                            de+='<td><b>地址：</b></td>';
                            de+='<td> </td>';
                            de+='</tr>';
                            de+='<tr>'
                            de+='<td><b>邮编:</b></td>';
                            de+='<td></td>';
                            de+='<td><b>适用范围：</b></td>';
                            de+='<td></td>';
                            de+='</tr>';
                            de+='<tr>';
                            de+='<td><b>关键字</b></td>';
                            de+='<td>'+datas.Results["Gjz"]+' </td>';
                            de+='<td><b>疾病研究：</b></td>';
                            de+='<td>'+datas.Results["Jbyj"]+'</td>';
                            de+='</tr>';
                            de+='<tr>';
                            de+='<td><b>出处：</b></td>';
                            de+='<td>'+datas.Results["Cc"]+'</td>';
                            de+='<td><b>年卷期:</b></td>';
                            de+='<td>'+datas.Results["Njq"]+'</td>';
                            de+='</tr>';
                            de+='<tr>';
                            de+='<td><b>摘要:</b></td>';
                            de+='<td colspan="3">'+datas.Results["Zy"]+'</td>';
                            de+='</tr>';
                            de+='</table>';
                            details=details+de;
                            details=details+'</div>';
                            details=details+'</div>';
                            $(".modal-content").html("");
                            $(".modal-content").html($compile(details)($scope));
                        }

                    });

            });

        }else if(tables === "Research") {

            $(".dis_click").click(function() {

                var id=$(this).attr("id");
                var json={};
                json["Table"] = "Research";
                json["Rid"]=id;
                var jsonStr = JSON.stringify(json);
                var canshu={"q":jsonStr};
                $.getJSON(urlop,canshu,function(datas) {

                    if(datas.Return==0) {

                        urllist=[];
                        pointer=0;
                        var strs="Clinicalpath/";
                        strs=strs+id;
                        urllist.push(strs);
                        pointer++;
                        var details="";
                        var mainwords_dis={"Fclass":"所属科室","Ename":"英文名","Icd10":"ICd号"};
                        var dkey={"Byhfbjzyjjz":"病因和发病机制研究进展","Zdyjjz":"诊断研究进展","Zlhyfyjjz":"治疗和预防研究进展","Czwthyjrd":"存在问题和研究热点" };
                        details=details+'<div class="modal-header">';
                        details=details+'<button type="button" class="close"';
                        details=details+' data-dismiss="modal" aria-hidden="true"> &times';
                        details=details+'</button>';
                        details=details+'<h2  style="color: #3c8dbc; text-align:center " class="modal-title bigtitle" id="myModalLabel">';
                        details=details+datas.Results["Name"];
                        // details=details+'('+datas.Results["Pdf"]+')';
                        var pdf_name = datas.Results["Pdf"].split("/");
                        details=details+'('+'<a href="http://1.85.37.136:9999/medknowledge/pdfop/?q={%22Table%22:%22Pdf%22,%22Pid%22:%22'+pdf_name[2]+'%22}" ><img src="assets/img/medicalKnowledge/pdf.png" title="点击下载"></a>'+')';
                        details=details+'</h2>';
                        details=details+'<div style="float:right" ><a href="javascript:void(0);" ng-click="showback()" style="display:none"><i class="fa fa-fw fa-arrow-left"></i>后退</a>';
                        details=details+'<a href="javascript:void(0);" style="display:none"><i class="fa fa-fw fa-arrow-right"></i>前进</a> </div>';

                        details=details+'</div><div class="modal-body" du-scroll-container>';

                        details=details+'<div class="col-md-3" role="complementary">';
                        //   details=details+'<nav class="bs-docs-sidenav hidden-print hidden-xs hidden-sm affix-top" style="position:fixed;">';
                        details=details+'<ul class="nav  nav-list bs-docs-sidenav affix" id="gundongtiao">';
                        for(var j in dkey) {

                            details=details+'<li>';
                            details=details+'<a href="#'+j+'"du-smooth-scroll du-scrollspy><i class="fa fa-fw fa-chevron-right iconss"></i>'+dkey[j]+'</a>';
                            details=details+'</li>';
                        }
                        details=details+'</ul>';
                        details=details+'</div>';
                        details+='<div class="col-md-9" role="main">';
                        var de='<table class="table table-bordered table-striped"><thead>'+
                            '<tr>'+
                            '<th>所属科室</th>'+
                            '<th>英文名</th>'+
                            '<th>ICd号</th>'+
                            '</tr>'+
                            '</thead>'+
                            ' <tbody>'+
                            '<tr>';
                        for(var m in mainwords_dis) {

                            for(var n in datas.Results) {

                                if(m==n) {

                                    de+='<td>';
                                    de+=datas.Results[n];
                                    de+='</td>';

                                }

                            }

                        }
                        de+='</tr>';
                        de+='</tbody></table>';
                        for(var j in dkey) {

                            for(var i in datas.Results) {
                                var temp=0;
                                var title="";
                                if(i==j) {
                                    de=de+'<h3 style="color: #3c8dbc;" id="'+i+'"><b>'+dkey[i]+'</b></h3>';
                                    var rs=eval(datas.Results[i]);
                                    for(var m in rs ) {

                                        if(rs[m][0]=='1') {

                                            de=de+'<h3 style="color: #3c8dbc;" id="'+rs[m][1]+'">'+rs[m][1]+'</h3>';
                                        } else if(rs[m][0]=='2') {

                                            de=de+'<span id="'+rs[m][1]+'">'+rs[m][1]+"</span>"+"</br>";

                                        } else if(rs[m][0]=='3') {

                                            de=de+rs[m][1]+"</br>";
                                        } else if(rs[m][0]=='table') {

                                            de=de+rs[m][1];
                                            de=de+'</br>';
                                        } else {
                                            de=de+rs[m][1]+"</br>";
                                        }

                                    }

                                }
                            }

                        }
                        details=details+de;
                        details=details+'</div>';
                        details=details+'</div>';
                        details=details+' <div class="modal-footer">';
                        details=details+'</div>';
                        $(".modal-content").html("");
                        $(".modal-content").html($compile(details)($scope));
                    }

                });
            });

        }else if(tables === "Clinicalg") {  //display clinicalguide  picture left to do
            $(".dis_click").click(function() {

                var id=$(this).attr("id");
                var json={};
                json["Table"] = "Clinicalg";
                json["Cid"]=id;
                var jsonStr = JSON.stringify(json);
                var canshu={"q":jsonStr};
                $.getJSON(urlop,canshu,function(datas) {

                    if(datas.Return==0) {

                        urllist=[];
                        pointer=0;
                        var strs="Clinicalpath/";
                        strs=strs+id;
                        urllist.push(strs);
                        pointer++;
                        var details="";
                        var mainwords_dis={"Fclass":"分类","Year":"年份"};
                        details=details+'<div class="modal-header">';
                        details=details+'<button type="button" class="close"';
                        details=details+' data-dismiss="modal" aria-hidden="true"> &times';
                        details=details+'</button>';
                        details=details+'<h2  style="color: #3c8dbc; text-align:center " class="modal-title bigtitle" id="myModalLabel">';
                        details=details+datas.Results["Name"];
                        details=details+'</h2>';
                        details=details+'<div style="float:right" ><a href="javascript:void(0);" ng-click="showback()" style="display:none"><i class="fa fa-fw fa-arrow-left"></i>后退</a>';
                        details=details+'<a href="javascript:void(0);" style="display:none"><i class="fa fa-fw fa-arrow-right"></i>前进</a> </div>';

                        details=details+'</div><div class="modal-body" du-scroll-container>';

                        // details=details+'<div class="col-md-3" role="complementary">';
                        // //   details=details+'<nav class="bs-docs-sidenav hidden-print hidden-xs hidden-sm affix-top" style="position:fixed;">';
                        // details=details+'<ul class="nav  nav-list bs-docs-sidenav affix" id="gundongtiao">';
                        // for(var j in dkey) {

                        //     details=details+'<li>';
                        //     details=details+'<a href="#'+j+'"du-smooth-scroll du-scrollspy><i class="fa fa-fw fa-chevron-right iconss"></i>'+dkey[j]+'</a>';
                        //     details=details+'</li>';
                        // }
                        // details=details+'</ul>';
                        // details=details+'</div>';
                        details+='<div class="col-md-12" role="main">';
                        var de='<table class="table table-bordered table-striped"><thead>'+
                            '<tr>'+
                            '<th>分类</th>'+
                            '<th>年份</th>'+
                            '</tr>'+
                            '</thead>'+
                            ' <tbody>'+
                            '<tr>';
                        for(var m in mainwords_dis) {

                            for(var n in datas.Results) {

                                if(m==n) {

                                    de+='<td>';
                                    de+=datas.Results[n];
                                    de+='</td>';

                                }

                            }

                        }
                        de+='</tr>';
                        de+='</tbody></table>';
                        var images = eval(datas.Results["Images"]);
                        console.log(images);
                        for(var im in images) {

                            var imagelist=images[im][1].split("/");
                            // console.log(imagelist);
                            var imageurl = 'http://1.85.37.136:9999/medknowledge/imageop/?q={"Iid":"'+imagelist[1]+'"}';
                            de=de+'<div><img alt="User Image" src='+ imageurl+'  style="width:80%;"/></div>';
                            de=de+'</br>';
                        }
                        details=details+de;
                        details=details+'</div>';
                        details=details+'</div>';
                        details=details+' <div class="modal-footer">';
                        details=details+'</div>';
                        $(".modal-content").html("");
                        $(".modal-content").html($compile(details)($scope));
                    }

                });
            });


        }else if(tables === "Video") {

            $(".dis_click").click(function() {

                var id=$(this).attr("id");
                var json={};
                json["Table"] = "Video";
                json["Vid"]=id;
                var jsonStr = JSON.stringify(json);
                var canshu={"q":jsonStr};
                $.getJSON(urlop,canshu,function(datas) {

                    if(datas.Return==0) {

                        urllist=[];
                        pointer=0;
                        var strs="Video/";
                        strs=strs+id;
                        urllist.push(strs);
                        pointer++;
                        var details="";
                        var mainwords_dis={"Name":""};
                        details=details+'<div class="modal-header">';
                        details=details+'<button type="button" class="close"';
                        details=details+' data-dismiss="modal" aria-hidden="true"> &times';
                        details=details+'</button>';
                        details=details+'<h2  style="color: #3c8dbc; text-align:center " class="modal-title bigtitle" id="myModalLabel">';
                        details=details+datas.Results["Name"];
                        var video_name = datas.Results["Video"].split("/");
                        details=details+'('+'<a href="http://1.85.37.136:9999/medknowledge/videoop/?q={%22Table%22:%22Video%22,%22Vid%22:%22'+video_name[2]+'%22}" ><img src="assets/img/medicalKnowledge/video.png" title="点击下载"></a>'+')';
                        //details=details+'('+'<a href="http://1.85.37.136:9999/medknowledge/videoop/?q={%22Table%22:%22Video%22,%22Vid%22:%22'+video_name[2]+'%22}" ><img src="resources/medicalKnowledge/video.png"></a>'+')';
                        details=details+'</h2>';
                        details=details+'<div style="float:right" ><a href="javascript:void(0);" ng-click="showback()" style="display:none"><i class="fa fa-fw fa-arrow-left"></i>后退</a>';
                        details=details+'<a href="javascript:void(0);" style="display:none"><i class="fa fa-fw fa-arrow-right"></i>前进</a> </div>';
                        details=details+'</div><div class="modal-body" du-scroll-container>';
                        details+='<div class="col-md-12" role="main">' +'<div class="spinner"></div>';
                        //details+='<video src="http://1.85.37.136:9999/medknowledge/videoop/?q={%22Table%22:%22Video%22,%22Vid%22:%22v1000007%22}" width="100%"  controls="controls">';
                        details+='<video src="http://1.85.37.136:9999/medknowledge/videoop/?q={%22Table%22:%22Video%22,%22Vid%22:%22'+video_name[2]+'%22}" width="100%"  controls preload>';
                        details+='</video>';
                        details=details+'</div>';
                        details=details+'</div>';
                        details=details+' <div class="modal-footer">';
                        details=details+'</div>';
                        $(".modal-content").html("");
                        $(".modal-content").html($compile(details)($scope));
                        // $rootScope.pageLoading = true;
                        // $(".loading-container").on("click",function () {
                        //     console.log(click);
                        // })
                        var video = $("VIDEO");
                        /*console.log(video);
                        video.loadeddata = console.log("loaded data");
                        video.oncanplay = console.log("can play");
                        video.oncanplaythrough = console.log("can play through");
                        video[0].addEventListener("suspend", function () {
                            console.log("suspend");
                        });
                        video[0].addEventListener("about", function () {
                            console.log("about");
                        });*/
                        video[0].addEventListener("canplaythrough", function () {
                            console.log("canplaythrough");
                            console.log($(".spinner"));
                            $(".spinner").removeClass("spinner");
                            // $rootScope.pageLoading = false;
                        });
                       /* video[0].addEventListener("seeking", function () {
                            console.log("seeking");
                        });
                        video[0].addEventListener("loadeddata", function () {
                            console.log("loadeddata");
                        });
                        video[0].addEventListener("loadedmetadata", function () {
                            console.log("loadedmetadata");
                        });*/
                        $("#myModal").on("hidden.bs.modal", function () {
                            console.log("modal hidden");
                            video[0].pause();
                        });

                    }

                });
            });


        }else if(tables === "Otherres") {

            $(".dis_click").click(function() {

                var id=$(this).attr("id");
                var json={};
                json["Table"] = "Otherres";
                json["Oid"]=id;
                var jsonStr = JSON.stringify(json);
                var canshu={"q":jsonStr};
                $.getJSON(urlop,canshu,function(datas) {

                    if(datas.Return==0) {

                        urllist=[];
                        pointer=0;
                        var strs="Otherres/";
                        strs=strs+id;
                        urllist.push(strs);
                        pointer++;
                        var details="";
                        var mainwords_dis={"Fclass":"分类","Year":"年份","Pdf":"下载全文"};
                        details=details+'<div class="modal-header">';
                        details=details+'<button type="button" class="close"';
                        details=details+' data-dismiss="modal" aria-hidden="true"> &times';
                        details=details+'</button>';
                        details=details+'<h2  style="color: #3c8dbc; text-align:center " class="modal-title bigtitle" id="myModalLabel">';
                        details=details+datas.Results["Name"];
                        details=details+'</h2>';
                        details=details+'<div style="float:right" ><a href="javascript:void(0);" ng-click="showback()" style="display:none"><i class="fa fa-fw fa-arrow-left"></i>后退</a>';
                        details=details+'<a href="javascript:void(0);" style="display:none"><i class="fa fa-fw fa-arrow-right"></i>前进</a> </div>';
                        details=details+'</div><div class="modal-body" du-scroll-container>';
                        details+='<div class="col-md-12" role="main">';
                        var de='<table class="table table-bordered table-striped"><thead>'+
                            '<tr>'+
                            '<th>分类</th>'+
                            '<th>年份</th>'+
                            '<th>下载全文</th>'+
                            '</tr>'+
                            '</thead>'+
                            ' <tbody>'+
                            '<tr>';
                        for(var m in mainwords_dis) {

                            for(var n in datas.Results) {

                                if(m===n && m!=="Pdf") {

                                    de+='<td>';
                                    de+=datas.Results[n];
                                    de+='</td>';

                                }else if(m===n && m==="Pdf") {
                                    de+='<td>';
                                    var pdf_name = datas.Results["Pdf"].split("/");
                                    de=de+'<a href="http://1.85.37.136:9999/medknowledge/pdfop/?q={%22Table%22:%22Pdf%22,%22Pid%22:%22'+pdf_name[2]+'%22}" ><img src="assets/img/medicalKnowledge/pdf.png">点击下载</a>';
                                    de+='</td>';
                                }

                            }

                        }
                        de+='</tr>';
                        de+='</tbody></table>';
                        details = details+de;
                        details=details+'</div>';
                        details=details+'</div>';
                        details=details+' <div class="modal-footer">';
                        details=details+'</div>';
                        $(".modal-content").html("");
                        $(".modal-content").html($compile(details)($scope));
                    }

                });
            });

        }
    }


    ///////////////////////////// filter data under conditions ////////////////////////
    $scope.filter = function(table,tables,flag) {

        var json={};
        json["Table"] = tables;
        json["Start"]=0;
        json["End"] = 20;
        //  console.log(table);
        if(flag==0) {

            if(tables=="Disease") {

                $scope.filterDisease(tables,json);
            } else if(tables=="Symptom") {

                $scope.filterSymptom(tables,json);
            } else if(tables=="Medication") {

                $scope.filterMedication(tables,json);
            } else if(tables=="Lab") {

                $scope.filterLab(tables,json);
            } else if(tables=="Medicare") {

                $scope.filterMedicare(tables,json);

            } else if(tables=="Clinicalpath") {

                $scope.filterClinicalpath(tables,json);
            } else if(tables=="Evidence") {

                $scope.filterEvidence(tables,json);
            } else if(tables === "Research") {

                $scope.filterResearch(tables,json);
            } else if(tables === "Clinicalg") {

                $scope.filterClinicalg(tables,json);
            } else if(tables === 'Video') {

                $scope.filterVideo(tables,json);
            } else if(tables === 'Otherres') {

                $scope.filterOtherres(tables,json);
            }

        } else {

            table.api().columns().every( function () {

                var that = this;
                $( 'input', this.footer() ).on( 'keyup', function () {

                    $scope.filterText = [];
                    $('#example1 tfoot th').each( function (a,b) {

                        if(!!$(this).children().val()) $scope.filterText.push($(this).children().val());
                        else $scope.filterText.push('');
                        // console.log($scope.filterText);
                    })
                    if(tables=="Disease") {

                        $scope.filterDisease(tables,json);
                    } else if(tables=="Symptom") {

                        $scope.filterSymptom(tables,json);
                    } else if(tables=="Medication") {

                        $scope.filterMedication(tables,json);
                    } else if(tables=="Lab") {

                        $scope.filterLab(tables,json);
                    } else if(tables=="Medicare") {

                        $scope.filterMedicare(tables,json);

                    } else if(tables=="Clinicalpath") {

                        $scope.filterClinicalpath(tables,json);

                    } else if(tables==="Evidence") {

                        $scope.filterEvidence(tables,json);
                    } else if(tables === "Research") {

                        $scope.filterResearch(tables,json);
                    } else if(tables === "Clinicalg") {

                        $scope.filterClinicalg(tables,json);
                    } else if(tables === 'Video') {

                        $scope.filterVideo(tables,json);
                    } else if(tables === 'Otherres') {

                        $scope.filterOtherres(tables,json);
                    }

                });
            });
        }
    }

//////////////////  filter disease ///////////////////
    $scope.filterDisease = function(tables,json) {

        var Icd10=$("#ICD10").val();
        var Name=$("#名字").val();
        var Ename=$("#英文名").val();
        var Oname=$("#别名").val();
        var Dclass=$("#科室").val();
        // console.log(Icd10);
        $("#example1 thead tr th").each(function() {
            //     console.log(this);
            if($(this).attr("class").indexOf("click")>=0){

                // console.log($(this).attr("id"));
                if($(this).attr("class").indexOf("asc")>=0)
                {
                    json["Sort_item"]=$(this).attr("id");
                }else   if($(this).attr("class").indexOf("desc")>=0){
                    var sss=$(this).attr("id");
                    json["Sort_item"]="-"+sss;
                }

            }


        });
        var filter={};
        filter["Icd10"]=Icd10;
        filter["Name"]=Name;
        filter["Ename"]=Ename;
        filter["Oname"]=Oname;
        filter["Dclass"] = Dclass;
        json["Filter"]=filter;
        var jsonStr = JSON.stringify(json);
        var canshu={"q":jsonStr};
        //console.log(canshu);
        //console.log(this.value);
        $.ajax({
            type: "GET",
            url: urlfilter,
            data:canshu,
            dataType: "json",
            success: function(data){

                // console.log(data);

                var list="";
                var temp="";
                for(var i=0;i<data.Results.length;i++)
                {
                    temp=temp+ '<tr data-toggle="modal" class="dis_click myodd" id='+data.Results[i][0]+' data-target="#myModal"> ';
                    //    temp=temp+ '<td>'+data.Results[i][0]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][5]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][1]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][2]+'</td>';
                    var bieming=data.Results[i][3];
                    if(bieming.length<60){
                        temp=temp+ '<td title="'+bieming.substring(0,bieming.length-1)+'">'+bieming.substring(0,bieming.length-1)+'</td>';
                    }else{

                        temp=temp+ '<td title="'+bieming.substring(0,bieming.length-1)+'">'+bieming.substring(0,60)+'...'+'</td>';
                    }
                    //temp=temp+ '<td>'+data.Results[i][3].substring(0,40)+'...'+'</td>';
                    temp=temp+ '<td>'+data.Results[i][4]+'</td>';

                    temp=temp+'</tr>';
                }

                list=list+temp;
                $("tbody").html($compile(list)($scope));
                var pagenums=data.Total_Disease_Count/20;
                var pagelist="";
                var back="back";
                var forward="forward";
                if(json["Start"]==0){
                    pagelist+='<li><a href="javascript:void(0)" class="disabled" style="disabled:true;">&laquo;</a></li>';
                }else{
                    pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\',\''+back+'\')">&laquo;</a></li>';
                }
                for(var i=0;i<10&&i<pagenums;i++)
                {
                    if(i==0){
                        pagelist+='<li class="active"><a href="javascript:void(0)">'+(i+1)+'</a></li>';
                    }else{
                        pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\','+(i+1)+')">'+(i+1)+'</a></li>';
                    }

                }

                if(pagenums>1){
                    pagelist+= '<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\',\''+forward+'\')">&raquo;</a></li>';
                }
                $(".pagination").html($compile(pagelist)($scope));
                /* page end  */



                $scope.bindclick(tables);
            }

        });





    }


////////  filter symptom //////////////
    $scope.filterSymptom = function(tables,json) {

        var Name=$("#名称").val();
        var Yjks=$("#一级科室").val();
        var Ejks=$("#二级科室").val();
        var Yjbw=$("#一级部位").val();
        var Ejbw=$("#二级部位").val();
        $("#example1 thead tr th").each(function(){
            // console.log($(this).attr("class"));
            if($(this).attr("class").indexOf("click")>=0){

                // console.log($(this).attr("id"));
                if($(this).attr("class").indexOf("asc")>=0)
                {
                    json["Sort_item"]=$(this).attr("id");
                }else   if($(this).attr("class").indexOf("desc")>=0){
                    var sss=$(this).attr("id");
                    json["Sort_item"]="-"+sss;
                }

            }


        });
        var filter={};
        filter["Name"]=Name;
        filter["Yjks"]=Yjks;
        filter["Ejks"]=Ejks;
        filter["Yjbw"]=Yjbw;
        filter["Ejbw"]=Ejbw;
        json["Filter"]=filter;
        var jsonStr = JSON.stringify(json);
        var canshu={"q":jsonStr};
        // console.log(canshu);
        $.ajax({
            type: "GET",
            url: urlfilter,
            data:canshu,
            dataType: "json",
            success: function(data){

                // console.log(data);

                var list="";
                var temp="";
                for(var i=0;i<data.Results.length;i++)
                {
                    temp=temp+ '<tr data-toggle="modal" class="dis_click" id='+data.Results[i][0]+' data-target="#myModal"> ';
                    //  temp=temp+ '<td>'+data.Results[i][0]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][1]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][2]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][3]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][4]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][5]+'</td>';
                    temp=temp+'</tr>';
                }

                list=list+temp;
                $("tbody").html($compile(list)($scope));

                /*  page code  */
                var pagenums=data.Total_Symptom_Count/20;
                var pagelist="";
                var back="back";
                var forward="forward";
                if(json["Start"]==0){
                    pagelist+='<li><a href="javascript:void(0)" class="disabled" style="disabled:true;">&laquo;</a></li>';
                }else{
                    pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\',\''+back+'\')">&laquo;</a></li>';
                }
                for(var i=0;i<10&&i<pagenums;i++)
                {
                    if(i==0){
                        pagelist+='<li class="active"><a href="javascript:void(0)">'+(i+1)+'</a></li>';
                    }else{
                        pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\','+(i+1)+')">'+(i+1)+'</a></li>';
                    }

                }

                if(pagenums>1){
                    pagelist+= '<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\',\''+forward+'\')">&raquo;</a></li>';
                }
                $(".pagination").html($compile(pagelist)($scope));
                /* page end  */



                $scope.bindclick(tables);
            }

        });






    }




//////////////////////// fiter medication /////////////////////
    $scope.filterMedication = function(tables,json){

        var Name=$("#名字").val();
        var Ename=$("#英文名").val();
        var Oname=$("#别名").val();
        var Sclass=$("#类别").val();
        $("#example1 thead tr th").each(function(){
            // console.log($(this).attr("class"));
            if($(this).attr("class").indexOf("click")>=0){

                // console.log($(this).attr("id"));
                if($(this).attr("class").indexOf("asc")>=0)
                {
                    json["Sort_item"]=$(this).attr("id");
                }else   if($(this).attr("class").indexOf("desc")>=0){
                    var sss=$(this).attr("id");
                    json["Sort_item"]="-"+sss;
                }

            }


        });
        var filter={};
        filter["Name"]=Name;
        filter["Ename"]=Ename;
        filter["Oname"]=Oname;
        filter["Sclass"]=Sclass;
        json["Filter"]=filter;
        var jsonStr = JSON.stringify(json);
        var canshu={"q":jsonStr};
        $.ajax({
            type: "GET",
            url: urlfilter,
            data:canshu,
            dataType: "json",
            success: function(data){

                var list="";
                var temp="";
                for(var i=0;i<data.Results.length;i++)
                {
                    temp=temp+ '<tr data-toggle="modal" class="dis_click" id='+data.Results[i][0]+' data-target="#myModal"> ';

                    //  temp=temp+ '<td>'+data.Results[i][0]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][1]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][2]+'</td>';
                    var bieming=data.Results[i][3];
                    if(bieming.length<60){
                        temp=temp+ '<td title="'+bieming.substring(0,bieming.length-1)+'">'+bieming.substring(0,bieming.length-1)+'</td>';
                    }else{

                        temp=temp+ '<td title="'+bieming.substring(0,bieming.length-1)+'">'+bieming.substring(0,60)+'...'+'</td>';
                    }

                    temp=temp+ '<td>'+data.Results[i][5]+'</td>';

                    temp=temp+'</tr>';
                }

                list=list+temp;
                $("tbody").html($compile(list)($scope));

                // page code
                var pagenums=data.Total_Medication_Count/20;
                var pagelist="";
                var back="back";
                var forward="forward";
                if(json["Start"]==0){
                    pagelist+='<li><a href="javascript:void(0)" class="disabled" style="disabled:true;">&laquo;</a></li>';
                }else{
                    pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\',\''+back+'\')">&laquo;</a></li>';
                }
                for(var i=0;i<10&&i<pagenums;i++)
                {
                    if(i==0){
                        pagelist+='<li class="active"><a href="javascript:void(0)">'+(i+1)+'</a></li>';
                    }else{
                        pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\','+(i+1)+')">'+(i+1)+'</a></li>';
                    }

                }

                if(pagenums>1){
                    pagelist+= '<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\',\''+forward+'\')">&raquo;</a></li>';
                }
                $(".pagination").html($compile(pagelist)($scope));
                /* page end  */

                $scope.bindclick(tables);
            }

        });

    }

//////////////// filter lab ///////////////
    $scope.filterLab = function(tables,json) {

        var Name=$("#名字").val();
        var Ename=$("#英文名字").val();
        var Oname=$("#别名").val();
        var Fclass=$("#一级分类").val();
        var Sclass=$("#二级分类").val();
        $("#example1 thead tr th").each(function() {
            // console.log($(this).attr("class"));
            if($(this).attr("class").indexOf("click")>=0) {
                if($(this).attr("class").indexOf("asc")>=0) {

                    json["Sort_item"]=$(this).attr("id");
                } else   if($(this).attr("class").indexOf("desc")>=0) {

                    var sss=$(this).attr("id");
                    json["Sort_item"]="-"+sss;
                }

            }
        });
        var filter={};
        filter["Name"]=Name;
        filter["Ename"]=Ename;
        filter["Oname"]=Oname;
        filter["Sclass"]=Sclass;
        json["Filter"]=filter;
        var jsonStr = JSON.stringify(json);
        var canshu={"q":jsonStr};
        $.ajax({
            type: "GET",
            url: urlfilter,
            data:canshu,
            dataType: "json",
            success: function(data){

                var list="";
                var temp="";
                for(var i=0;i<data.Results.length;i++) {

                    temp=temp+ '<tr data-toggle="modal" class="dis_click" id='+data.Results[i][0]+' data-target="#myModal"> ';
                    temp=temp+ '<td>'+data.Results[i][1]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][2]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][3]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][4]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][5]+'</td>';
                    temp=temp+'</tr>';
                }
                list=list+temp;
                $("tbody").html($compile(list)($scope));
                /*  page code  */
                var pagenums=data.Total_Lab_Count/20;
                var pagelist="";
                var back="back";
                var forward="forward";
                if(json["Start"]==0){
                    pagelist+='<li><a href="javascript:void(0)" class="disabled" style="disabled:true;">&laquo;</a></li>';
                }else{
                    pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\',\''+back+'\')">&laquo;</a></li>';
                }
                for(var i=0;i<10&&i<pagenums;i++)
                {
                    if(i==0){
                        pagelist+='<li class="active"><a href="javascript:void(0)">'+(i+1)+'</a></li>';
                    }else{
                        pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\','+(i+1)+')">'+(i+1)+'</a></li>';
                    }

                }

                if(pagenums>1){
                    pagelist+= '<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\',\''+forward+'\')">&raquo;</a></li>';
                }
                $(".pagination").html($compile(pagelist)($scope));
                /* page end  */

                $scope.bindclick(tables);
            }

        });



    }

///////////// filter medicare ///////////////
    $scope.filterMedicare = function(tables,json){

        var Name=$("#名字").val();
        var Ename=$("#英文名").val();
        var Fclass=$("#分类").val();
        var Ybbxjx=$("#医保报销剂型").val();
        var Ybbxxzlb=$("#报销限制类别").val();
        $("#example1 thead tr th").each(function(){
            // console.log($(this).attr("class"));
            if($(this).attr("class").indexOf("click")>=0){

                // console.log($(this).attr("id"));
                if($(this).attr("class").indexOf("asc")>=0)
                {
                    json["Sort_item"]=$(this).attr("id");
                }else   if($(this).attr("class").indexOf("desc")>=0){
                    var sss=$(this).attr("id");
                    json["Sort_item"]="-"+sss;
                }

            }


        });
        var filter={};
        filter["Name"]=Name;
        filter["Ename"]=Ename;
        filter["Ybbxjx"]=Ybbxjx;
        filter["Fclass"]=Fclass;
        filter["Ybbxxzlb"]=Ybbxxzlb;
        json["Filter"]=filter;
        var jsonStr = JSON.stringify(json);
        var canshu={"q":jsonStr};
        $.ajax({
            type: "GET",
            url: urlfilter,
            data:canshu,
            dataType: "json",
            success: function(data) {

                var list="";
                var temp="";
                for(var i=0;i<data.Results.length;i++) {

                    temp=temp+ '<tr data-toggle="modal" class="dis_click" id='+data.Results[i][0]+' data-target="#myModal"> ';
                    temp=temp+ '<td>'+data.Results[i][1]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][2]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][3]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][4]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][5]+'</td>';
                    temp=temp+'</tr>';
                }

                list=list+temp;
                $("tbody").html($compile(list)($scope));

                /*  page code  */
                var pagenums=data.Total_Medicare_Count/20;
                var pagelist="";
                var back="back";
                var forward="forward";
                if(json["Start"]==0){
                    pagelist+='<li><a href="javascript:void(0)" class="disabled" style="disabled:true;">&laquo;</a></li>';
                }else{
                    pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\',\''+back+'\')">&laquo;</a></li>';
                }
                for(var i=0;i<10&&i<pagenums;i++)
                {
                    if(i==0){
                        pagelist+='<li class="active"><a href="javascript:void(0)">'+(i+1)+'</a></li>';
                    }else{
                        pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\','+(i+1)+')">'+(i+1)+'</a></li>';
                    }

                }

                if(pagenums>1){
                    pagelist+= '<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\',\''+forward+'\')">&raquo;</a></li>';
                }
                $(".pagination").html($compile(pagelist)($scope));
                /* page end  */

                $scope.bindclick(tables);
            }

        });


    }


/////// filter clinicalpathway ////////////////
    $scope.filterClinicalpath = function(tables,json){

        var Name=$("#名字").val();
        var Classs=$("#分类").val();
        var Year=$("#版本号").val();
        $("#example1 thead tr th").each(function(){
            // console.log($(this).attr("class"));
            if($(this).attr("class").indexOf("click")>=0){

                // console.log($(this).attr("id"));
                if($(this).attr("class").indexOf("asc")>=0)
                {
                    json["Sort_item"]=$(this).attr("id");
                }else   if($(this).attr("class").indexOf("desc")>=0){
                    var sss=$(this).attr("id");
                    json["Sort_item"]="-"+sss;
                }

            }


        });
        var filter={};
        filter["Name"]=Name;
        filter["Class"]=Classs;
        filter["Year"]=Year;
        json["Filter"]=filter;
        var jsonStr = JSON.stringify(json);
        var canshu={"q":jsonStr};
        $.ajax({
            type: "GET",
            url: urlfilter,
            data:canshu,
            dataType: "json",
            success: function(data){

                var list="";
                var temp="";
                for(var i=0;i<data.Results.length;i++)
                {
                    temp=temp+ '<tr data-toggle="modal" class="dis_click" id='+data.Results[i][0]+' data-target="#myModal"> ';
                    //  temp=temp+ '<td>'+data.Results[i][0]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][1]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][2]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][3]+'</td>';
                    temp=temp+'</tr>';
                }
                list=list+temp;
                $("tbody").html($compile(list)($scope));

                /*  page code  */
                var pagenums=data.Total_Clinicalpath_Count/20;
                var pagelist="";
                var back="back";
                var forward="forward";
                if(json["Start"]==0){
                    pagelist+='<li><a href="javascript:void(0)" class="disabled" style="disabled:true;">&laquo;</a></li>';
                }else{
                    pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\',\''+back+'\')">&laquo;</a></li>';
                }
                for(var i=0;i<10&&i<pagenums;i++)
                {
                    if(i==0){
                        pagelist+='<li class="active"><a href="javascript:void(0)">'+(i+1)+'</a></li>';
                    }else{
                        pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\','+(i+1)+')">'+(i+1)+'</a></li>';
                    }

                }

                if(pagenums>1){
                    pagelist+= '<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\',\''+forward+'\')">&raquo;</a></li>';
                }
                $(".pagination").html($compile(pagelist)($scope));
                /* page end  */

                $scope.bindclick(tables);
            }

        });

    }


    /////////// filter evidence ////////
    $scope.filterEvidence = function(tables,json) {

        var title=$("#题目").val();
        var type=$("#类型 ").val();
        var dis=$("#研究疾病").val();
        var author=$("#作者").val();
        var from=$("#出处").val();
        //  var download=$("#下载").val();
        $("#example1 thead tr th").each(function(){
            // console.log($(this).attr("class"));
            if($(this).attr("class").indexOf("click")>=0){

                // console.log($(this).attr("id"));
                if($(this).attr("class").indexOf("asc")>=0)
                {
                    json["Sort_item"]=$(this).attr("id");
                }else   if($(this).attr("class").indexOf("desc")>=0){
                    var sss=$(this).attr("id");
                    json["Sort_item"]="-"+sss;
                }

            }


        });
        var filter={};
        filter["Name"]=title;
        filter["Fclass"]=type;
        filter["Jbyj"]=dis;
        filter["Zz"]=author;
        filter["Cc"]=from;
        // filter["Pdf"]=download;
        json["Filter"] = filter;
        var jsonStr = JSON.stringify(json);
        var canshu={"q":jsonStr};
        $.ajax({
            type: "GET",
            url: urlfilter,
            data:canshu,
            dataType: "json",
            success: function(data){

                var list="";
                var temp="";
                for(var i=0;i<data.Results.length;i++)
                {
                    temp=temp+ '<tr data-toggle="modal" class="dis_click" id='+data.Results[i][0]+' data-target="#myModal"> ';
                    //  temp=temp+ '<td>'+data.Results[i][0]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][1]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][2]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][3]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][4]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][5]+'</td>';
                    //  temp=temp+ '<td>'+data.Results[i][6]+'</td>';
                    temp=temp+'</tr>';
                }
                list=list+temp;
                $("tbody").html($compile(list)($scope));

                /*  page code  */
                var pagenums=data.Total_Evidence_Count/20;
                var pagelist="";
                var back="back";
                var forward="forward";
                if(json["Start"]==0){
                    pagelist+='<li><a href="javascript:void(0)" class="disabled" style="disabled:true;">&laquo;</a></li>';
                }else{
                    pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\',\''+back+'\')">&laquo;</a></li>';
                }
                for(var i=0;i<10&&i<pagenums;i++)
                {
                    if(i==0){
                        pagelist+='<li class="active"><a href="javascript:void(0)">'+(i+1)+'</a></li>';
                    }else{
                        pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\','+(i+1)+')">'+(i+1)+'</a></li>';
                    }

                }

                if(pagenums>1){
                    pagelist+= '<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\',\''+forward+'\')">&raquo;</a></li>';
                }
                $(".pagination").html($compile(pagelist)($scope));
                /* page end  */

                $scope.bindclick(tables);
            }

        });
    }



/////////// filter research ////////
    $scope.filterResearch = function(tables,json) {

        var title=$("#疾病名称").val();
        var type=$("#英文名").val();
        var dis=$("#别名").val();
        var author=$("#疾病分类").val();
        var from=$("#ICD号").val();
        //var download=$("#下载").val();
        $("#example1 thead tr th").each(function(){
            // console.log($(this).attr("class"));
            if($(this).attr("class").indexOf("click")>=0){

                // console.log($(this).attr("id"));
                if($(this).attr("class").indexOf("asc")>=0)
                {
                    json["Sort_item"]=$(this).attr("id");
                }else   if($(this).attr("class").indexOf("desc")>=0){
                    var sss=$(this).attr("id");
                    json["Sort_item"]="-"+sss;
                }

            }


        });
        var filter={};
        filter["Name"]=title;
        filter["Ename"]=type;
        filter["Oname"]=dis;
        filter["Fclass"]=author;
        filter["Icd10"]=from;
        // filter["Pdf"]=download;
        json["Filter"] = filter;
        var jsonStr = JSON.stringify(json);
        var canshu={"q":jsonStr};
        $.ajax({
            type: "GET",
            url: urlfilter,
            data:canshu,
            dataType: "json",
            success: function(data){

                var list="";
                var temp="";
                for(var i=0;i<data.Results.length;i++)
                {
                    temp=temp+ '<tr data-toggle="modal" class="dis_click" id='+data.Results[i][0]+' data-target="#myModal"> ';
                    //  temp=temp+ '<td>'+data.Results[i][0]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][1]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][2]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][3]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][4]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][5]+'</td>';
                    // temp=temp+ '<td>'+data.Results[i][6]+'</td>';
                    temp=temp+'</tr>';
                }
                list=list+temp;
                $("tbody").html($compile(list)($scope));

                /*  page code  */
                var pagenums=data.Total_Research_Count/20;
                var pagelist="";
                var back="back";
                var forward="forward";
                if(json["Start"]==0){
                    pagelist+='<li><a href="javascript:void(0)" class="disabled" style="disabled:true;">&laquo;</a></li>';
                }else{
                    pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\',\''+back+'\')">&laquo;</a></li>';
                }
                for(var i=0;i<10&&i<pagenums;i++)
                {
                    if(i==0){
                        pagelist+='<li class="active"><a href="javascript:void(0)">'+(i+1)+'</a></li>';
                    }else{
                        pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\','+(i+1)+')">'+(i+1)+'</a></li>';
                    }

                }

                if(pagenums>1){
                    pagelist+= '<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\',\''+forward+'\')">&raquo;</a></li>';
                }
                $(".pagination").html($compile(pagelist)($scope));
                /* page end  */

                $scope.bindclick(tables);
            }

        });
    }


    /////////// filter Clinicalg ////////
    $scope.filterClinicalg = function(tables,json) {

        var title=$("#题目").val();
        var type=$("#分类").val();
        $("#example1 thead tr th").each(function(){
            // console.log($(this).attr("class"));
            if($(this).attr("class").indexOf("click")>=0){

                // console.log($(this).attr("id"));
                if($(this).attr("class").indexOf("asc")>=0)
                {
                    json["Sort_item"]=$(this).attr("id");
                }else   if($(this).attr("class").indexOf("desc")>=0){
                    var sss=$(this).attr("id");
                    json["Sort_item"]="-"+sss;
                }

            }
        });
        var filter={};
        filter["Name"]=title;
        filter["Fclass"]=type;
        json["Filter"] = filter;
        var jsonStr = JSON.stringify(json);
        var canshu={"q":jsonStr};
        $.ajax({
            type: "GET",
            url: urlfilter,
            data:canshu,
            dataType: "json",
            success: function(data){

                var list="";
                var temp="";
                for(var i=0;i<data.Results.length;i++)
                {
                    temp=temp+ '<tr data-toggle="modal" class="dis_click" id='+data.Results[i][0]+' data-target="#myModal"> ';
                    //  temp=temp+ '<td>'+data.Results[i][0]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][1]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][2]+'</td>';

                    temp=temp+'</tr>';
                }
                list=list+temp;
                $("tbody").html($compile(list)($scope));

                /*  page code  */
                var pagenums=data.Total_Clinicalg_Count/20;
                var pagelist="";
                var back="back";
                var forward="forward";
                if(json["Start"]==0){
                    pagelist+='<li><a href="javascript:void(0)" class="disabled" style="disabled:true;">&laquo;</a></li>';
                }else{
                    pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\',\''+back+'\')">&laquo;</a></li>';
                }
                for(var i=0;i<10&&i<pagenums;i++)
                {
                    if(i==0){
                        pagelist+='<li class="active"><a href="javascript:void(0)">'+(i+1)+'</a></li>';
                    }else{
                        pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\','+(i+1)+')">'+(i+1)+'</a></li>';
                    }

                }

                if(pagenums>1){
                    pagelist+= '<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\',\''+forward+'\')">&raquo;</a></li>';
                }
                $(".pagination").html($compile(pagelist)($scope));
                /* page end  */

                $scope.bindclick(tables);
            }

        });
    }




    /////////// filter Video ////////
    $scope.filterVideo = function(tables,json) {

        var title=$("#视频名").val();
        var type=$("#学科类别--学科--专业").val();
        $("#example1 thead tr th").each(function(){
            // console.log($(this).attr("class"));
            if($(this).attr("class").indexOf("click")>=0){

                // console.log($(this).attr("id"));
                if($(this).attr("class").indexOf("asc")>=0)
                {
                    json["Sort_item"]=$(this).attr("id");
                }else   if($(this).attr("class").indexOf("desc")>=0){
                    var sss=$(this).attr("id");
                    json["Sort_item"]="-"+sss;
                }

            }
        });
        var filter={};
        filter["Name"]=title;
        filter["Fclass"]=type;
        json["Filter"] = filter;
        var jsonStr = JSON.stringify(json);
        var canshu={"q":jsonStr};
        $.ajax({
            type: "GET",
            url: urlfilter,
            data:canshu,
            dataType: "json",
            success: function(data){

                var list="";
                var temp="";
                for(var i=0;i<data.Results.length;i++)
                {
                    temp=temp+ '<tr data-toggle="modal" class="dis_click" id='+data.Results[i][0]+' data-target="#myModal"> ';
                    //  temp=temp+ '<td>'+data.Results[i][0]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][1]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][2]+'</td>';

                    temp=temp+'</tr>';
                }
                list=list+temp;
                $("tbody").html($compile(list)($scope));

                /*  page code  */
                var pagenums=data.Total_Video_Count/20;
                var pagelist="";
                var back="back";
                var forward="forward";
                if(json["Start"]==0){
                    pagelist+='<li><a href="javascript:void(0)" class="disabled" style="disabled:true;">&laquo;</a></li>';
                }else{
                    pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\',\''+back+'\')">&laquo;</a></li>';
                }
                for(var i=0;i<10&&i<pagenums;i++)
                {
                    if(i==0){
                        pagelist+='<li class="active"><a href="javascript:void(0)">'+(i+1)+'</a></li>';
                    }else{
                        pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\','+(i+1)+')">'+(i+1)+'</a></li>';
                    }

                }

                if(pagenums>1){
                    pagelist+= '<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\',\''+forward+'\')">&raquo;</a></li>';
                }
                $(".pagination").html($compile(pagelist)($scope));
                /* page end  */

                $scope.bindclick(tables);
            }

        });
    }


    /////////// filter other resource ////////
    $scope.filterOtherres = function(tables,json) {

        var title=$("#题目").val();
        var type=$("#分类").val();
        $("#example1 thead tr th").each(function(){
            // console.log($(this).attr("class"));
            if($(this).attr("class").indexOf("click")>=0){

                // console.log($(this).attr("id"));
                if($(this).attr("class").indexOf("asc")>=0)
                {
                    json["Sort_item"]=$(this).attr("id");
                }else   if($(this).attr("class").indexOf("desc")>=0){
                    var sss=$(this).attr("id");
                    json["Sort_item"]="-"+sss;
                }

            }
        });
        var filter={};
        filter["Name"]=title;
        filter["Fclass"]=type;
        json["Filter"] = filter;
        var jsonStr = JSON.stringify(json);
        var canshu={"q":jsonStr};
        $.ajax({
            type: "GET",
            url: urlfilter,
            data:canshu,
            dataType: "json",
            success: function(data){

                var list="";
                var temp="";
                for(var i=0;i<data.Results.length;i++)
                {
                    temp=temp+ '<tr data-toggle="modal" class="dis_click" id='+data.Results[i][0]+' data-target="#myModal"> ';
                    //  temp=temp+ '<td>'+data.Results[i][0]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][1]+'</td>';
                    temp=temp+ '<td>'+data.Results[i][2]+'</td>';

                    temp=temp+'</tr>';
                }
                list=list+temp;
                $("tbody").html($compile(list)($scope));

                /*  page code  */
                var pagenums=data.Total_Video_Count/20;
                var pagelist="";
                var back="back";
                var forward="forward";
                if(json["Start"]==0){
                    pagelist+='<li><a href="javascript:void(0)" class="disabled" style="disabled:true;">&laquo;</a></li>';
                }else{
                    pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\',\''+back+'\')">&laquo;</a></li>';
                }
                for(var i=0;i<10&&i<pagenums;i++)
                {
                    if(i==0){
                        pagelist+='<li class="active"><a href="javascript:void(0)">'+(i+1)+'</a></li>';
                    }else{
                        pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\','+(i+1)+')">'+(i+1)+'</a></li>';
                    }

                }

                if(pagenums>1){
                    pagelist+= '<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\',\''+forward+'\')">&raquo;</a></li>';
                }
                $(".pagination").html($compile(pagelist)($scope));
                /* page end  */

                $scope.bindclick(tables);
            }

        });
    }

//////////// display data /////////
    $scope.displayDisease = function(data,tables,nums) {

        var orders=[];
        $('thead th').each(function (a,b) {

            if($(this).hasClass('asc'))
                orders.push('asc');
            else
                orders.push('desc');
        });
        if($scope.isInit === 1){
            orders = ['asc','asc','asc','asc','asc'];
            $scope.isInit = 0;
        };
        // console.log(orders);
        var list=' <thead>'+
            '<tr>'+
            '<th class="'+ orders[0] +' click" ng-click="changeasc(0,\''+tables+'\')" id="Icd10">ICD10</th>'+
            '<th class='+ orders[1] +' ng-click="changeasc(1,\''+tables+'\')" id="Name">名字</th>'+
            '<th class='+ orders[2] +' ng-click="changeasc(2,\''+tables+'\')" id="Ename">英文名</th>'+
            '<th class='+ orders[3] +' ng-click="changeasc(3,\''+tables+'\')" id="Oname">别名</th>'+
            '<th class='+ orders[4] +' ng-click="changeasc(4,\''+tables+'\')" id="Dclass">科室</th>'+
            '</tr>'+
            '</thead>'+
            ' <tfoot>'+
            '<tr>'+
            '<th>ICD10</th>'+
            '<th>名字</th>'+
            '<th>英文名</th>'+
            '<th>别名</th>'+
            '<th>科室</th>'+
            '</tr>'+
            '</tfoot>'+
            ' <tbody>';
        var temp="";
        for(var i=0;i<data.Results.length;i++)
        {
            temp=temp+ '<tr data-toggle="modal" class="dis_click" id='+data.Results[i][0]+' data-target="#myModal"> ';

            //    temp=temp+ '<td>'+data.Results[i][0]+'</td>';
            temp=temp+ '<td>'+data.Results[i][5]+'</td>';
            temp=temp+ '<td>'+data.Results[i][1]+'</td>';
            temp=temp+ '<td>'+data.Results[i][2]+'</td>';
            //var lis=data.Results[i][3];
            var bieming=data.Results[i][3];
            if(bieming.length<60){
                temp=temp+ '<td title="'+bieming.substring(0,bieming.length-1)+'">'+bieming.substring(0,bieming.length)+'</td>';
            }else{

                temp=temp+ '<td title="'+bieming.substring(0,bieming.length-1)+'">'+bieming.substring(0,60)+'...'+'</td>';
            }
            //temp=temp+ '<td>'+data.Results[i][3].substring(0,40)+'...'+'</td>';
            temp=temp+ '<td>'+data.Results[i][4]+'</td>';

            temp=temp+'</tr>';
        }

        list=list+temp+ ' </tbody>';
        $("#example1").html("");
        $("#example1").html($compile(list)($scope));
        $scope.table=$('#example1').dataTable( {
            "destroy":true,
            "ordering": false,
            "info":     false,
            "paging":   false
        } );
        $('#example1_wrapper .row .col-sm-6').remove();
        if(chance==0){
            var textCount = 0;
            $('#example1 tfoot th').each( function (a,b) {
                var title = $(this).text();
                if(!!$scope.filterText)
                    $(this).html( '<input type="text" placeholder="'+title+'过滤" id="'+title+'" value='+$scope.filterText[textCount] +'  >' );
                else
                    $(this).html( '<input type="text" id="'+title+'" value="" placeholder="'+title+'过滤" />' );
                textCount++;
            } );

        }


        $scope.filter($scope.table,tables);
        var pagenums=data.Total_Disease_Count/20;
        if(nums === "back" && parseInt($("#pagination .active").text())===1) nums = 1;
        $scope.page(pagenums,nums,tables);
        $scope.bindclick(tables);
    }

//////////////// display symptom //////////
    $scope.displaySymptom = function(data,tables,nums){
        var orders=[];
        $('thead th').each(function (a,b) {
            if($(this).hasClass('asc'))
                orders.push('asc');
            else
                orders.push('desc');
        });
        if($scope.isInit === 1){
            orders = ['asc','asc','asc','asc','asc'];
            $scope.isInit = 0;
        }
        // console.log(orders);
        var list=' <thead>'+
            '<tr>'+
            '<th class="'+ orders[0] +' click" ng-click="changeasc(0,\''+tables+'\')" id="Sid">名称</th>'+
            '<th class='+ orders[1] +' ng-click="changeasc(1,\''+tables+'\')" id="Yjks">一级科室</th>'+
            '<th class='+ orders[2] +' ng-click="changeasc(2,\''+tables+'\')" id="Ejks">二级科室</th>'+
            '<th class='+ orders[3] +' ng-click="changeasc(3,\''+tables+'\')" id="Yjbw">一级部位</th>'+
            '<th class='+ orders[4] +' ng-click="changeasc(4,\''+tables+'\')" id="Ejbw">二级部位</th>'+
            '</tr>'+
            '</thead>'+
            ' <tfoot>'+
            '<tr>'+
            '<th>名称</th>'+
            '<th>一级科室</th>'+
            '<th>二级科室</th>'+
            '<th>一级部位</th>'+
            '<th>二级部位</th>'+
            '</tr>'+
            '</tfoot>'+
            ' <tbody>';
        var temp="";
        for(var i=0;i<data.Results.length;i++)
        {
            temp=temp+ '<tr data-toggle="modal" class="dis_click" id='+data.Results[i][0]+' data-target="#myModal"> ';
            temp=temp+ '<td>'+data.Results[i][1]+'</td>';
            temp=temp+ '<td>'+data.Results[i][2]+'</td>';
            temp=temp+ '<td>'+data.Results[i][3]+'</td>';
            temp=temp+ '<td>'+data.Results[i][4]+'</td>';
            temp=temp+ '<td>'+data.Results[i][5]+'</td>';
            temp=temp+'</tr>';
        }

        list=list+temp+ ' </tbody>';
        $("#example1").html("");
        $("#example1").html($compile(list)($scope));
        $scope.table = $('#example1').dataTable( {
            "destroy":  true,
            "ordering": false,
            "info":     false,
            "paging":   false
        } );
        $('#example1_wrapper .row .col-sm-6').remove();
        if(chance==0){
            var textCount = 0;
            $('#example1 tfoot th').each( function (a,b) {
                var title = $(this).text();
                if(!!$scope.filterText)
                    $(this).html( '<input type="text" placeholder="'+title+'过滤" id="'+title+'" value='+$scope.filterText[textCount] +'  >' );
                else
                    $(this).html( '<input type="text" id="'+title+'" value="" placeholder="'+title+'过滤" />' );
                textCount++;
            } );
        }
        $scope.filter($scope.table,tables);
        var pagenums=data.Total_Symptom_Count/20;
        if(nums === "back" && parseInt($("#pagination .active").text())===1) nums = 1;
        $scope.page(pagenums,nums,tables);
        $scope.bindclick(tables);

    }

///// display medication ///////
    $scope.displayMedication = function(data,tables,nums){
        var orders=[];
        $('thead th').each(function (a,b) {
            if($(this).hasClass('asc'))
                orders.push('asc');
            else
                orders.push('desc');
        });
        if($scope.isInit === 1) {
            orders = ['asc','asc','asc','asc','asc'];
            $scope.isInit = 0;
        }
        // console.log(orders);
        var list=' <thead>'+
            '<tr>'+
            '<th class="'+ orders[0] +' click" ng-click="changeasc(0,\''+tables+'\')" id="Name">名字</th>'+
            '<th class='+ orders[1] +' ng-click="changeasc(1,\''+tables+'\')" id="Ename">英文名</th>'+
            '<th class='+ orders[2] +' ng-click="changeasc(2,\''+tables+'\')" id="Oname">别名</th>'+
            '<th class='+ orders[3] +' ng-click="changeasc(3,\''+tables+'\')" id="Sclass">类别</th>'+
            '</tr>'+
            '</thead>'+
            ' <tfoot>'+
            '<tr>'+
            '<th>名字</th>'+
            '<th>英文名</th>'+
            '<th>别名</th>'+
            '<th>类别</th>'+
            '</tr>'+
            '</tfoot>'+
            ' <tbody>';
        var temp="";
        for(var i=0;i<data.Results.length;i++)
        {
            temp=temp+ '<tr data-toggle="modal" class="dis_click" id='+data.Results[i][0]+' data-target="#myModal"> ';
            temp=temp+ '<td>'+data.Results[i][1]+'</td>';
            temp=temp+ '<td>'+data.Results[i][2]+'</td>';
            var bieming=data.Results[i][3];
            if(bieming.length<60){
                temp=temp+ '<td title="'+bieming.substring(0,bieming.length-1)+'">'+bieming.substring(0,bieming.length-1)+'</td>';
            }else{

                temp=temp+ '<td title="'+bieming.substring(0,bieming.length-1)+'">'+bieming.substring(0,60)+'...'+'</td>';
            }

            temp=temp+ '<td>'+data.Results[i][5]+'</td>';

            temp=temp+'</tr>';
        }

        list=list+temp+ ' </tbody>';
        $("#example1").html($compile(list)($scope));
        $scope.$apply();
        $scope.table=$('#example1').dataTable( {
            "destroy":true,
            "ordering": false,
            "info":     false,
            "paging":   false
        } );
        $('#example1_wrapper .row .col-sm-6').remove();
        if(chance==0){
            var textCount = 0;
            $('#example1 tfoot th').each( function (a,b) {
                var title = $(this).text();
                if(!!$scope.filterText)
                    $(this).html( '<input type="text" placeholder="'+title+'过滤" id="'+title+'" value='+$scope.filterText[textCount] +'  >' );
                else
                    $(this).html( '<input type="text" id="'+title+'" value="" placeholder="'+title+'过滤" />' );
                textCount++;
            } );
        }
        $scope.filter($scope.table,tables);
        var pagenums=data.Total_Medication_Count/20;
        if(nums === "back" && parseInt($("#pagination .active").text())===1) nums = 1;
        $scope.page(pagenums,nums,tables);
        $scope.bindclick(tables);


    }



////////// lab data display /////////
    $scope.displayLab = function(data,tables,nums){
        var orders=[];
        $('thead th').each(function (a,b) {
            if($(this).hasClass('asc'))
                orders.push('asc');
            else
                orders.push('desc');
        });
        if($scope.isInit === 1){
            orders = ['asc','asc','asc','asc','asc'];
            $scope.isInit = 0;
        }
        // console.log(orders);
        var list=' <thead>'+
            '<tr>'+
            '<th class="'+ orders[0] +' click" ng-click="changeasc(0,\''+tables+'\')" id="Name">名字</th>'+
            '<th class='+ orders[1] +' ng-click="changeasc(1,\''+tables+'\')" id="Ename">英文名</th>'+
            '<th class='+ orders[2] +' ng-click="changeasc(2,\''+tables+'\')" id="Oname">别名</th>'+
            '<th class='+ orders[3] +' ng-click="changeasc(3,\''+tables+'\')" id="Fclass">一级分类</th>'+
            '<th class='+ orders[4] +' ng-click="changeasc(4,\''+tables+'\')" id="Sclass">二级分类</th>'+
            '</tr>'+
            '</thead>'+
            ' <tfoot>'+
            '<tr>'+
            '<th>名字</th>'+
            '<th>英文名字</th>'+
            '<th>别名</th>'+
            '<th>一级分类</th>'+
            '<th>二级分类</th>'+
            '</tr>'+
            '</tfoot>'+
            ' <tbody>';
        var temp="";
        for(var i=0;i<data.Results.length;i++)
        {
            temp=temp+ '<tr data-toggle="modal" class="dis_click" id='+data.Results[i][0]+' data-target="#myModal"> ';
            temp=temp+ '<td>'+data.Results[i][1]+'</td>';
            temp=temp+ '<td>'+data.Results[i][2]+'</td>';
            temp=temp+ '<td>'+data.Results[i][3]+'</td>';
            temp=temp+ '<td>'+data.Results[i][4]+'</td>';
            temp=temp+ '<td>'+data.Results[i][5]+'</td>';
            temp=temp+'</tr>';
        }

        list=list+temp+ ' </tbody>';
        $("#example1").html($compile(list)($scope));
        $scope.$apply();
        $scope.table=$('#example1').dataTable( {
            "destroy":true,
            "ordering": false,
            "info":     false,
            "paging":   false
        } );
        $('#example1_wrapper .row .col-sm-6').remove();
        if(chance==0){
            var textCount = 0;
            $('#example1 tfoot th').each( function (a,b) {
                var title = $(this).text();
                if(!!$scope.filterText)
                    $(this).html( '<input type="text" placeholder="'+title+'过滤" id="'+title+'" value='+$scope.filterText[textCount] +'  >' );
                else
                    $(this).html( '<input type="text" id="'+title+'" value="" placeholder="'+title+'过滤" />' );
                textCount++;
            } );
        }
        $scope.filter($scope.table,tables);
        var pagenums=data.Total_Lab_Count/20;
        if(nums === "back" && parseInt($("#pagination .active").text())===1) nums = 1;
        $scope.page(pagenums,nums,tables);
        $scope.bindclick(tables);


    }

////// medicvare display ///////
    $scope.displayMedicare = function(data,tables,nums){
        var orders=[];
        $('thead th').each(function (a,b) {
            if($(this).hasClass('asc'))
                orders.push('asc');
            else
                orders.push('desc');
        });
        if($scope.isInit === 1){
            orders = ['asc','asc','asc','asc','asc'];
            $scope.isInit = 0;
        }
        var list=' <thead>'+
            '<tr>'+
            '<th class="'+ orders[0] +' click" ng-click="changeasc(0,\''+tables+'\')" id="Name">名字</th>'+
            '<th class='+ orders[1] +' ng-click="changeasc(1,\''+tables+'\')" id="Ename">英文名字</th>'+
            '<th class='+ orders[2] +' ng-click="changeasc(2,\''+tables+'\')" id="Class">分类</th>'+
            '<th class='+ orders[3] +' ng-click="changeasc(3,\''+tables+'\')" id="Ybbxjx">医保报销剂型</th>'+
            '<th class='+ orders[4] +' ng-click="changeasc(4,\''+tables+'\')" id="Ybbxxzlb">报销限制类别</th>'+
            '</tr>'+
            '</thead>'+
            ' <tfoot>'+
            '<tr>'+
            '<th>名字</th>'+
            '<th>英文名</th>'+
            '<th>分类</th>'+
            '<th>医保报销剂型</th>'+
            '<th>报销限制类别</th>'+
            '</tr>'+
            '</tfoot>'+
            ' <tbody>';
        var temp="";
        for(var i=0;i<data.Results.length;i++)
        {
            temp=temp+ '<tr data-toggle="modal" class="dis_click" id='+data.Results[i][0]+' data-target="#myModal"> ';
            temp=temp+ '<td>'+data.Results[i][1]+'</td>';
            temp=temp+ '<td>'+data.Results[i][2]+'</td>';
            temp=temp+ '<td>'+data.Results[i][3]+'</td>';
            temp=temp+ '<td>'+data.Results[i][4]+'</td>';
            temp=temp+ '<td>'+data.Results[i][5]+'</td>';
            temp=temp+'</tr>';
        }

        list=list+temp+ ' </tbody>';
        $("#example1").html($compile(list)($scope));
        $scope.$apply();
        $scope.table=$('#example1').dataTable( {
            "destroy":true,
            "ordering": false,
            "info":     false,
            "paging":   false
        } );
        $('#example1_wrapper .row .col-sm-6').remove();
        if(chance==0){
            var textCount = 0;
            $('#example1 tfoot th').each( function (a,b) {
                var title = $(this).text();
                if(!!$scope.filterText)
                    $(this).html( '<input type="text" placeholder="'+title+'过滤" id="'+title+'" value='+$scope.filterText[textCount] +'  >' );
                else
                    $(this).html( '<input type="text" id="'+title+'" value="" placeholder="'+title+'过滤" />' );
                textCount++;
            } );
        }
        $scope.filter($scope.table,tables);
        var pagenums=data.Total_Medicare_Count/20;
        if(nums === "back" && parseInt($("#pagination .active").text())===1) nums = 1;
        $scope.page(pagenums,nums,tables);
        $scope.bindclick(tables);


    }

///// display clinicalpath /////
    $scope.displayClinicalpath = function(data,tables,nums){

        var orders=[];
        $('thead th').each(function (a,b) {
            if($(this).hasClass('asc'))
                orders.push('asc');
            else
                orders.push('desc');
        });
        if($scope.isInit === 1){
            orders = ['asc','asc','asc','asc','asc'];
            $scope.isInit = 0;
        }
        var list=' <thead>'+
            '<tr>'+
            '<th class="'+ orders[0] +' click" ng-click="changeasc(0,\''+tables+'\')" id="Name">名字</th>'+
            '<th class='+ orders[1] +' ng-click="changeasc(1,\''+tables+'\')" id="Class">分类</th>'+
            '<th class='+ orders[2] +' ng-click="changeasc(2,\''+tables+'\')" id="Year">版本号</th>'+
            '</tr>'+
            '</thead>'+
            ' <tfoot>'+
            '<tr>'+
            '<th>名字</th>'+
            '<th>分类</th>'+
            '<th>版本号</th>'+
            '</tr>'+
            '</tfoot>'+
            ' <tbody>';
        var temp="";
        for(var i=0;i<data.Results.length;i++)
        {
            temp=temp+ '<tr data-toggle="modal" class="dis_click" id='+data.Results[i][0]+' data-target="#myModal"> ';
            temp=temp+ '<td>'+data.Results[i][1]+'</td>';
            temp=temp+ '<td>'+data.Results[i][2]+'</td>';
            temp=temp+ '<td>'+data.Results[i][3]+'</td>';
            temp=temp+'</tr>';
        }
        list=list+temp+ ' </tbody>';
        $("#example1").html($compile(list)($scope));
        $scope.$apply();
        $scope.table=$('#example1').dataTable( {
            "destroy":true,
            "ordering": false,
            "info":     false,
            "paging":   false
        } );
        $('#example1_wrapper .row .col-sm-6').remove();
        if(chance==0){
            var textCount = 0;
            $('#example1 tfoot th').each( function (a,b) {
                var title = $(this).text();
                if(!!$scope.filterText)
                    $(this).html( '<input type="text" placeholder="'+title+'过滤" id="'+title+'" value='+$scope.filterText[textCount] +'  >' );
                else
                    $(this).html( '<input type="text" id="'+title+'" value="" placeholder="'+title+'过滤" />' );
                textCount++;
            } );
        }
        $scope.filter($scope.table,tables);
        var pagenums=data.Total_Clinicalpath_Count/20;
        if(nums === "back" && parseInt($("#pagination .active").text())===1) nums = 1;
        $scope.page(pagenums,nums,tables);
        $scope.bindclick(tables);
    }

///// evidence display ///////
    $scope.displayEvidence = function(data,tables,nums){
        var orders=[];
        $('thead th').each(function (a,b) {
            if($(this).hasClass('asc'))
                orders.push('asc');
            else
                orders.push('desc');
        });
        if($scope.isInit === 1){
            orders = ['asc','asc','asc','asc','asc','asc'];
            $scope.isInit = 0;
        }
        var list=' <thead>'+
            '<tr>'+
            '<th class="'+ orders[0] +' click" ng-click="changeasc(0,\''+tables+'\')" id="Name">题目</th>'+
            '<th class='+ orders[1] +' ng-click="changeasc(1,\''+tables+'\')" id="FClass">类型</th>'+
            '<th class='+ orders[2] +' ng-click="changeasc(2,\''+tables+'\')" id="Jbyj">研究疾病</th>'+
            '<th class='+ orders[3] +' ng-click="changeasc(3,\''+tables+'\')" id="Zz">作者</th>'+
            '<th class='+ orders[4] +' ng-click="changeasc(4,\''+tables+'\')" id="Cc">出处</th>'+
            // '<th class='+ orders[5] +' ng-click="changeasc(5,\''+tables+'\')" id="Pdf">下载</th>'+
            '</tr>'+
            '</thead>'+
            ' <tfoot>'+
            '<tr>'+
            '<th>题目</th>'+
            '<th>类型</th>'+
            '<th>研究疾病</th>'+
            '<th>作者</th>'+
            '<th>出处</th>'+
            // '<th>下载</th>'+
            '</tr>'+
            '</tfoot>'+
            ' <tbody>';
        var temp="";
        for(var i=0;i<data.Results.length;i++)
        {
            temp=temp+ '<tr data-toggle="modal" class="dis_click" id='+data.Results[i][0]+' data-target="#myModal"> ';
            temp=temp+ '<td>'+data.Results[i][1]+'</td>';
            temp=temp+ '<td>'+data.Results[i][2]+'</td>';
            temp=temp+ '<td>'+data.Results[i][3]+'</td>';
            temp=temp+ '<td>'+data.Results[i][4]+'</td>';
            temp=temp+ '<td>'+data.Results[i][5]+'</td>';
            // temp=temp+ '<td>'+data.Results[i][6]+'</td>';
            temp=temp+'</tr>';
        }
        list=list+temp+ ' </tbody>';
        $("#example1").html($compile(list)($scope));
        $scope.$apply();
        $scope.table=$('#example1').dataTable( {
            "destroy":true,
            "ordering": false,
            "info":     false,
            "paging":   false
        } );
        $('#example1_wrapper .row .col-sm-6').remove();
        if(chance==0){
            var textCount = 0;
            $('#example1 tfoot th').each( function (a,b) {
                var title = $(this).text();
                if(!!$scope.filterText)
                    $(this).html( '<input type="text" placeholder="'+title+'过滤" id="'+title+'" value='+$scope.filterText[textCount] +'  >' );
                else
                    $(this).html( '<input type="text" id="'+title+'" value="" placeholder="'+title+'过滤" />' );
                textCount++;
            } );
        }
        $scope.filter($scope.table,tables);
        var pagenums=data.Total_Evidence_Count/20;
        if(nums === "back" && parseInt($("#pagination .active").text())===1) nums = 1;
        $scope.page(pagenums,nums,tables);
        $scope.bindclick(tables);
    }


/////////research display //////////
    $scope.displayResearch = function(data,tables,nums) {
        var orders=[];
        $('thead th').each(function (a,b) {
            if($(this).hasClass('asc'))
                orders.push('asc');
            else
                orders.push('desc');
        });
        if($scope.isInit === 1){
            orders = ['asc','asc','asc','asc','asc','asc'];
            $scope.isInit = 0;
        }
        var list=' <thead>'+
            '<tr>'+
            '<th class="'+ orders[0] +' click" ng-click="changeasc(0,\''+tables+'\')" id="Name">疾病名称</th>'+
            '<th class='+ orders[1] +' ng-click="changeasc(1,\''+tables+'\')" id="Ename">英文名</th>'+
            '<th class='+ orders[2] +' ng-click="changeasc(2,\''+tables+'\')" id="Oname">别名</th>'+
            '<th class='+ orders[3] +' ng-click="changeasc(3,\''+tables+'\')" id="Fclass">疾病分类</th>'+
            '<th class='+ orders[4] +' ng-click="changeasc(4,\''+tables+'\')" id="Icd10">Icd10</th>'+
            // '<th class='+ orders[5] +' ng-click="changeasc(5,\''+tables+'\')" id="Pdf">下载</th>'+
            '</tr>'+
            '</thead>'+
            ' <tfoot>'+
            '<tr>'+
            '<th>疾病名称</th>'+
            '<th>英文名</th>'+
            '<th>别名</th>'+
            '<th>疾病分类</th>'+
            '<th>ICD号</th>'+
            //  '<th>下载</th>'+
            '</tr>'+
            '</tfoot>'+
            ' <tbody>';
        var temp="";
        for(var i=0;i<data.Results.length;i++)
        {
            temp=temp+ '<tr data-toggle="modal" class="dis_click" id='+data.Results[i][0]+' data-target="#myModal"> ';
            temp=temp+ '<td>'+data.Results[i][1]+'</td>';
            temp=temp+ '<td>'+data.Results[i][2]+'</td>';
            temp=temp+ '<td>'+data.Results[i][3]+'</td>';
            temp=temp+ '<td>'+data.Results[i][4]+'</td>';
            temp=temp+ '<td>'+data.Results[i][5]+'</td>';
            //  temp=temp+ '<td>'+data.Results[i][6]+'</td>';
            temp=temp+'</tr>';
        }
        list=list+temp+ ' </tbody>';
        $("#example1").html($compile(list)($scope));
        $scope.$apply();
        $scope.table=$('#example1').dataTable( {
            "destroy":true,
            "ordering": false,
            "info":     false,
            "paging":   false
        } );
        $('#example1_wrapper .row .col-sm-6').remove();
        if(chance==0){
            var textCount = 0;
            $('#example1 tfoot th').each( function (a,b) {
                var title = $(this).text();
                if(!!$scope.filterText)
                    $(this).html( '<input type="text" placeholder="'+title+'过滤" id="'+title+'" value='+$scope.filterText[textCount] +'  >' );
                else
                    $(this).html( '<input type="text" id="'+title+'" value="" placeholder="'+title+'过滤" />' );
                textCount++;
            } );
        }
        $scope.filter($scope.table,tables);
        var pagenums=data.Total_Research_Count/20;
        if(nums === "back" && parseInt($("#pagination .active").text())===1) nums = 1;
        $scope.page(pagenums,nums,tables);
        $scope.bindclick(tables);
    }


/////////clinicalg display //////////
    $scope.displayClinicalg = function(data,tables,nums) {
        var orders=[];
        $('thead th').each(function (a,b) {
            if($(this).hasClass('asc'))
                orders.push('asc');
            else
                orders.push('desc');
        });
        if($scope.isInit === 1){
            orders = ['asc','asc','asc','asc','asc','asc'];
            $scope.isInit = 0;
        }
        var list=' <thead>'+
            '<tr>'+
            '<th class="'+ orders[0] +' click" ng-click="changeasc(0,\''+tables+'\')" id="Name">题目</th>'+
            '<th class='+ orders[1] +' ng-click="changeasc(1,\''+tables+'\')" id="Fclass">分类</th>'+
            '</tr>'+
            '</thead>'+
            ' <tfoot>'+
            '<tr>'+
            '<th>题目</th>'+
            '<th>分类</th>'+
            '</tr>'+
            '</tfoot>'+
            ' <tbody>';
        var temp="";
        for(var i=0;i<data.Results.length;i++)
        {
            temp=temp+ '<tr data-toggle="modal" class="dis_click" id='+data.Results[i][0]+' data-target="#myModal"> ';
            temp=temp+ '<td>'+data.Results[i][1]+'</td>';
            temp=temp+ '<td>'+data.Results[i][2]+'</td>';
            temp=temp+'</tr>';
        }
        list=list+temp+ ' </tbody>';
        $("#example1").html($compile(list)($scope));
        $scope.$apply();
        $scope.table=$('#example1').dataTable( {
            "destroy":true,
            "ordering": false,
            "info":     false,
            "paging":   false
        } );
        $('#example1_wrapper .row .col-sm-6').remove();
        if(chance==0){
            var textCount = 0;
            $('#example1 tfoot th').each( function (a,b) {
                var title = $(this).text();
                if(!!$scope.filterText)
                    $(this).html( '<input type="text" placeholder="'+title+'过滤" id="'+title+'" value='+$scope.filterText[textCount] +'  >' );
                else
                    $(this).html( '<input type="text" id="'+title+'" value="" placeholder="'+title+'过滤" />' );
                textCount++;
            } );
        }
        $scope.filter($scope.table,tables);
        var pagenums=data.Total_Clinicalg_Count/20;
        if(nums === "back" && parseInt($("#pagination .active").text())===1) nums = 1;
        $scope.page(pagenums,nums,tables);
        $scope.bindclick(tables);
    }



/////////video display //////////
    $scope.displayVideo = function(data,tables,nums) {
        var orders=[];
        $('thead th').each(function (a,b) {
            if($(this).hasClass('asc'))
                orders.push('asc');
            else
                orders.push('desc');
        });
        if($scope.isInit === 1){
            orders = ['asc','asc','asc','asc','asc','asc'];
            $scope.isInit = 0;
        }
        var list=' <thead>'+
            '<tr>'+
            '<th class="'+ orders[0] +' click" ng-click="changeasc(0,\''+tables+'\')" id="Name">视频名</th>'+
            '<th class='+ orders[1] +' ng-click="changeasc(1,\''+tables+'\')" id="Fclass">学科类别--学科--专业</th>'+
            '</tr>'+
            '</thead>'+
            ' <tfoot>'+
            '<tr>'+
            '<th>视频名</th>'+
            '<th>学科类别--学科--专业</th>'+
            '</tr>'+
            '</tfoot>'+
            ' <tbody>';
        var temp="";
        for(var i=0;i<data.Results.length;i++)
        {
            temp=temp+ '<tr data-toggle="modal" class="dis_click" id='+data.Results[i][0]+' data-target="#myModal"> ';
            temp=temp+ '<td>'+data.Results[i][1]+'</td>';
            temp=temp+ '<td>'+data.Results[i][2]+'</td>';
            temp=temp+'</tr>';
        }
        list=list+temp+ ' </tbody>';
        $("#example1").html($compile(list)($scope));
        $scope.$apply();
        $scope.table=$('#example1').dataTable( {
            "destroy":true,
            "ordering": false,
            "info":     false,
            "paging":   false
        } );
        $('#example1_wrapper .row .col-sm-6').remove();
        if(chance==0){
            var textCount = 0;
            $('#example1 tfoot th').each( function (a,b) {
                var title = $(this).text();
                if(!!$scope.filterText)
                    $(this).html( '<input type="text" placeholder="'+title+'过滤" id="'+title+'" value='+$scope.filterText[textCount] +'  >' );
                else
                    $(this).html( '<input type="text" id="'+title+'" value="" placeholder="'+title+'过滤" />' );
                textCount++;
            } );
        }
        $scope.filter($scope.table,tables);
        var pagenums=data.Total_Video_Count/20;
        if(nums === "back" && parseInt($("#pagination .active").text())===1) nums = 1;
        $scope.page(pagenums,nums,tables);
        $scope.bindclick(tables);
    }


    /////////other resource display //////////
    $scope.displayOtherres = function(data,tables,nums) {
        var orders=[];
        $('thead th').each(function (a,b) {
            if($(this).hasClass('asc'))
                orders.push('asc');
            else
                orders.push('desc');
        });
        if($scope.isInit === 1){
            orders = ['asc','asc','asc','asc','asc','asc'];
            $scope.isInit = 0;
        }
        var list=' <thead>'+
            '<tr>'+
            '<th class="'+ orders[0] +' click" ng-click="changeasc(0,\''+tables+'\')" id="Name">题目</th>'+
            '<th class='+ orders[1] +' ng-click="changeasc(1,\''+tables+'\')" id="Fclass">分类</th>'+
            '</tr>'+
            '</thead>'+
            ' <tfoot>'+
            '<tr>'+
            '<th>题目</th>'+
            '<th>分类</th>'+
            '</tr>'+
            '</tfoot>'+
            ' <tbody>';
        var temp="";
        for(var i=0;i<data.Results.length;i++)
        {
            temp=temp+ '<tr data-toggle="modal" class="dis_click" id='+data.Results[i][0]+' data-target="#myModal"> ';
            temp=temp+ '<td>'+data.Results[i][1]+'</td>';
            temp=temp+ '<td>'+data.Results[i][2]+'</td>';
            temp=temp+'</tr>';
        }
        list=list+temp+ ' </tbody>';
        $("#example1").html($compile(list)($scope));
        $scope.$apply();
        $scope.table=$('#example1').dataTable( {
            "destroy":true,
            "ordering": false,
            "info":     false,
            "paging":   false
        } );
        $('#example1_wrapper .row .col-sm-6').remove();
        if(chance==0){
            var textCount = 0;
            $('#example1 tfoot th').each( function (a,b) {
                var title = $(this).text();
                if(!!$scope.filterText)
                    $(this).html( '<input type="text" placeholder="'+title+'过滤" id="'+title+'" value='+$scope.filterText[textCount] +'  >' );
                else
                    $(this).html( '<input type="text" id="'+title+'" value="" placeholder="'+title+'过滤" />' );
                textCount++;
            } );
        }
        $scope.filter($scope.table,tables);
        var pagenums=data.Total_Video_Count/20;
        if(nums === "back" && parseInt($("#pagination .active").text())===1) nums = 1;
        $scope.page(pagenums,nums,tables);
        $scope.bindclick(tables);
    }





///// change asc or desc ///////////
    $scope.changeasc = function(num,tables){

        var colum=$("#example1 thead tr th:eq("+num+")");
        var ths=$("#example1 thead tr th:eq("+num+")").attr("class");
        $(".desc").removeClass('desc').addClass('asc');
        if(ths.indexOf("asc")>=0){

            colum.removeClass("asc").addClass("desc").addClass("click");
        }else   if(ths.indexOf("desc")>=0){

            colum.removeClass("desc").addClass("asc").addClass("click");
        }

        var colums=$("#example1 thead tr th");
        for(var i=0;i<colums.length;i++)
        {
            if(i!=num){

                var temp= $("#example1 thead tr th:eq("+i+")");
                temp.removeClass("click");

            }
        }

        $scope.filter($scope.table,tables,0);


    }


/////// paging //////////
    $scope.page = function(pagenums,pagenow,tables){

        var pagelist="";
        var forward="forward";
        var back="back";
        if(pagenow==1 || !pagenow){
            pagelist+='<li><a href="javascript:void(0)"  class="disabled" style="disabled:true;">&laquo;</a></li>';
        }else{
            pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\',\''+back+'\')">&laquo;</a></li>';
        }
        if(pagenow=="forward"){

            pagenow=parseInt($("#pagination .active").text());
            for(var i=pagenow;i<pagenow+10&&i<pagenums;i++)
            {
                if(i==(pagenow)){
                    pagelist+='<li class="active"><a href="javascript:void(0)">'+(i+1)+'</a></li>';
                }else{
                    pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\','+(i+1)+')">'+(i+1)+'</a></li>';
                }

            }

        }else if(pagenow=="back"){
            // console.log("pagenow is back");
            pagenow=parseInt($("#pagination .active").text());
            // console.log(pagenow);
            var pa=0;
            if(pagenow>10){
                pa=pagenow-10;
            }
            for(var i=pa;i<pa+10&&i<pagenums;i++)
            {
                if(i==(pagenow-2)){
                    pagelist+='<li class="active"><a href="javascript:void(0)">'+(i+1)+'</a></li>';
                }else{
                    pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\','+(i+1)+')">'+(i+1)+'</a></li>';
                }

            }



        }else{

            for(var i=pagenow-1;i<pagenow+9&&i<pagenums;i++)
            {
                if(i==(pagenow-1)){
                    pagelist+='<li class="active"><a href="javascript:void(0)">'+(i+1)+'</a></li>';
                }else{
                    pagelist+='<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\','+(i+1)+')">'+(i+1)+'</a></li>';
                }

            }

        }


        if(pagenow<pagenums){
            pagelist+= '<li><a href="javascript:void(0)" ng-click="displayData(\''+tables+'\',\''+forward+'\')">&raquo;</a></li>';
        }
        //    pagelist+= '<li><a href="javascript:void(0)" ng-click="pageforward()">&raquo;</a></li>';
        $(".pagination").html($compile(pagelist)($scope));
        /* page end  */


    }



/////// page search /////////
    $scope.page_search = function(pagenums,pagenow){
        var pagelist="";
        var forward="forward";
        var back="back";
        if(pagenow==1){
            pagelist+='<li><a href="javascript:void(0)" class="disabled" style="disabled:true;">&laquo;</a></li>';
        }else{
            pagelist+='<li><a href="javascript:void(0)" ng-click="searchs(\''+pagenums+'\',\''+back+'\')">&laquo;</a></li>';
        }
        if(pagenow=="forward"){
            pagenow=parseInt($("#pagination .active").text());
            for(var i=pagenow;i<pagenow+10&&i<pagenums;i++)
            {
                if(i==(pagenow)){
                    pagelist+='<li class="active"><a href="javascript:void(0)">'+(i+1)+'</a></li>';
                }else{
                    pagelist+='<li><a href="javascript:void(0)" ng-click="searchs(\''+pagenums+'\','+(i+1)+')">'+(i+1)+'</a></li>';
                }

            }

        }else if(pagenow=="back"){

            pagenow=parseInt($("#pagination .active").text());
            // console.log(pagenow);
            var pa=0;
            if(pagenow>10){
                pa=pagenow-10;
            }
            for(var i=pa;i<pa+10&&i<pagenums;i++)
            {
                if(i==(pagenow-2)){
                    pagelist+='<li class="active"><a href="javascript:void(0)">'+(i+1)+'</a></li>';
                }else{
                    pagelist+='<li><a href="javascript:void(0)" ng-click="searchs(\''+pagenums+'\','+(i+1)+')">'+(i+1)+'</a></li>';
                }

            }



        }else{

            for(var i=pagenow-1;i<pagenow+9&&i<pagenums;i++)
            {
                if(i==(pagenow-1)){
                    pagelist+='<li class="active"><a href="javascript:void(0)">'+(i+1)+'</a></li>';
                }else{
                    pagelist+='<li><a href="javascript:void(0)" ng-click="searchs(\''+pagenums+'\','+(i+1)+')">'+(i+1)+'</a></li>';
                }

            }

        }


        if(pagenow<pagenums){
            pagelist+= '<li><a href="javascript:void(0)" ng-click="searchs(\''+pagenums+'\',\''+forward+'\')">&raquo;</a></li>';
        }
        $(".pagination").html($compile(pagelist)($scope));
        /* page end  */


    }


//////////////// autocomplete /////////////
    if(store.has("rID")){

    }
    else store.set("rID",0);
    var searchMem=[],searchVal,recordID=store.get("rID");
    $('#search-wrapper').typeahead({
        highlight:true,
    },{
        name:'name',
        source:function(query,syncCallback,asyncCallback) {
            var json={};
            json["Query_string"]=query;
            var jsonStr=JSON.stringify(json);
            var canshu={"q":jsonStr};
            $.ajax({
                url:'http://1.85.37.136:9999/medknowledge/auto/',
                type:'GET',
                dataType:'json',
                data:canshu,
                error:function(){
                    console.log("search query ajax error!");
                },
                success:function(res){

                    var searchMem=[];
                    for(var k=4;k>=0;k--){
                        if(store.get((recordID+k)%5))
                            if(store.has((recordID+k)%5)&&store.get((recordID+k)%5).name.indexOf(query)>=0)
                                searchMem.push(store.get((recordID+k)%5));
                    };
                    // console.log(res);
                    if(typeof res.Results !== 'string')
                        res.Results.forEach(function(e){
                            //console.log(e);
                            searchMem.push({"id":e,"name":e});
                        });
                    // console.log(searchMem);
                    asyncCallback(searchMem);
                }
            })
        },
        display:'name',
        limit:8
    })


////////////// watch keyup or down buttern to refresh data //////////
    $(document).keyup(function(event){
        if(event.keyCode ==13){

            $('#search-wrapper').typeahead({
                highlight:true,
            },{
                name:'name',
                source:function(query,syncCallback,asyncCallback){
                    var json={};
                    json["Query_string"]=query;
                    var jsonStr=JSON.stringify(json);
                    var canshu={"q":jsonStr};
                    // console.log(canshu);
                    $.ajax({
                        url:'http://1.85.37.136:9999/medknowledge/auto/',
                        type:'GET',
                        dataType:'json',
                        data:canshu,
                        error:function(){
                            // console.log("search query ajax error!");
                        },
                        success:function(res){
                            var searchMem=[];
                            for(var k=4;k>=0;k--){
                                if(store.get((recordID+k)%5))
                                    if(store.has((recordID+k)%5)&&store.get((recordID+k)%5).name.indexOf(query)>=0)
                                        searchMem.push(store.get((recordID+k)%5));
                            };
                            // console.log(res);
                            if(typeof res.Results !== 'string')
                                res.Results.forEach(function(e){
                                    //console.log(e);
                                    searchMem.push({"id":e,"name":e});
                                });
                            // console.log(searchMem);
                            asyncCallback(searchMem);
                        }
                    })
                },
                display:'name',
                limit:0
            })





            $("#searchSubmit").trigger("click");

        }
    });


    var key_disease={"Gs":"概述" ,"Lxbx":"流行病学" ,"By":"病因" ,"Fbjz":"发病机制" ,"Lcbx":"临床表现" ,"Bfz":"并发症" ,"Sysjc":"实验室检查" ,"Qtfzjc":"其他辅助检查" ,"Zd":"诊断" ,"Jbzd":"鉴别诊断","Zl":"治疗","Yh":"预后" ,"Yf":"预防" };
    var key_medication= {"Ylzy":"药理作用","Yfyl":"用法用量", "Ydx":"药动学", "Zysx":"注意事项", "Zjdp":"专家点评", "Ywxhzy":"药物相互作用", "Jjz":"禁忌症", "Syz":"适应症", "Ywjx":"药物剂型", "Blfy":"不良反应"};
    var key_lab= {"Gs":"概述","Yl":"原理", "Sj":"试剂", "Zcz":"正常值","Lcyy":"临床意义","Czff":"操作方法","Fz":"附注"};
    var key_sym= {"Zs":"综述", "Zzxs":"症状详述", "Zzqy":"症状起因","Cyjc":"常用检查" ,"Knjb":"可能疾病" ,"Dzyp":"对症药品" , "Xszz":"相似症状"};
    var key_medicare={"Yfyl":"用法用量" ,"Blfy":"不良反应" ,"Ylzy":"药理作用" ,"Ywxyzy":"药物相互作用" ,"Syz":"适应症" ,"Zysx":"注意事项" ,"Jjz":"禁忌症"};
    var key_clinicpath={"Content":"内容" };
    var mainwords_dis={"Ename":"英文名字","Oname":"别名","Icd10":"Icd10"};
    var mainwords_med={"Ename":"英文名称","Oname":"别名","Sclass":"类别"};
    var mainwords_sym={"Yjks":"一级科室","Ejks":"二级科室","Yjbw":"一级部位","Ejbw":"二级部位"};
    var mainwords_lab={"Ename":"英文名字","Oname":"别名","Fclass":"Fclass","Sclass":"Sclass"};
    var mainwords_medicare={"Fclass":"一级类别","Sclass":"二级类别","Ybbxxzlb":"医保报销限制类别","Ybbh":"医保编号","Ybbxjx":"医保报销剂型"};
    var mainwords_clinicpath={"Name":"名字","Class":"类别","Year":"版本号"};
    var dkey={};



    ////////////////////  show detail information about each event ////////////////
    $scope.showdetails = function(ids){

        var json={};
        var id=ids.split("/");
        // console.log(id);
        if(id[0]=="disease"){
            json["Table"] = "Disease";
            json["Did"]=id[1];
            dkey=key_disease;
        }else if(id[0]=="medication"){
            json["Table"] = "Medication";
            json["Mid"]=id[1];
            dkey=key_medication;
        }else if(id[0]=="laboratory"){
            json["Table"] = "Lab";
            json["Lid"]=id[1];
            dkey=key_lab;
        }else if(id[0]=="symptom"){
            json["Table"] = "Symptom";
            json["Sid"]=id[1];
            dkey=key_sym;
        }else if(id[0]=="medicare"){
            json["Table"] = "Medicare";
            json["Mid"]=id[1];
            dkey=key_medicare;
        }else if(id[0]=="clinicalpath"){
            json["Table"] = "Clinicalpath";
            json["Cid"]=id[1];
            dkey=key_clinicpath;
        }

        var jsonStr = JSON.stringify(json);
        var canshu={"q":jsonStr};
        var temp=0;
        for(var t=0;t<urllist.length;t++){
            if(urllist[t]==ids)
            {

                temp=1;
                break;
            }

        }
        if(temp==0){
            urllist.push(ids);
            pointer++;
        }
        // console.log(urllist);
        $.getJSON(urlop, canshu, function(datas) {
            var details="";
            var flags=0;
            details=details+'<div class="modal-header">';
            details=details+'<button type="button" class="close"';
            details=details+' data-dismiss="modal" aria-hidden="true"> &times';
            details=details+'</button>';
            details=details+'<h2  style="color: #3c8dbc; text-align:center " class="modal-title" id="myModalLabel">';
            details=details+datas.Results["Name"];
            details=details+'</h2>';
            if(pointer<=1){
                details=details+'<div style="float:right" ><a href="javascript:void(0);" ng-click="showback()" style="display:none"><i class="fa fa-fw fa-arrow-left"></i>后退</a>';
            }else{
                details=details+'<div style="float:right"><a href="javascript:void(0);" ng-click="showback()"><i class="fa fa-fw fa-arrow-left"></i>后退</a>';
            }

            if(pointer==urllist.length){
                details=details+'<a href="javascript:void(0);" ng-click="showforward()" style="display:none"><i class="fa fa-fw fa-arrow-right"></i>前进</a> </div>';
            }else{

                details=details+'<a href="javascript:void(0);" ng-click="showforward()"><i class="fa fa-fw fa-arrow-right"></i>前进</a> </div>';
            }

            details=details+'</div><div class="modal-body" du-scroll-container>';
            details=details+'<div class="col-md-3" role="complementary">';
            // details=details+'<nav class="bs-docs-sidenav hidden-print hidden-xs hidden-sm affix-top" style="position:fixed;">';
            details=details+'<ul class="nav  nav-list bs-docs-sidenav affix" id="gundongtiao">';
            for(var j in dkey) {
                for(var i in datas.Results)
                {
                    if(i==j){
                        details=details+'<li>';
                        details=details+'<a href="#'+j+'" du-smooth-scroll du-scrollspy><i class="fa fa-fw fa-chevron-right iconss"></i>'+dkey[j]+'</a>';
                        details=details+'</li>';
                    }
                }
            }
            details=details+'</ul>';
            //   details=details+'</nav>';
            details=details+'</div>';
            details+='<div class="col-md-9">';
            var de="";


            if(json["Table"]=='Disease')
            {

                de='<table class="table table-bordered table-striped"><thead>'+
                    '<tr>'+
                    '<th>英文名称</th>'+
                    '<th>别名</th>'+
                    '<th>Icd10</th>'+

                    '</tr>'+
                    '</thead>'+
                    ' <tbody>'+
                    '<tr>';
                for(var m in mainwords_dis){
                    for(var n in datas.Results)
                    {
                        if(m==n) {

                            if(m!="Oname"){
                                de+='<td>';
                                de+=datas.Results[n];
                                de+='</td>';
                            }else{
                                de+='<td>';
                                de+=datas.Results[n];
                                de+='</td>';
                            }
                        }

                    }

                }
                de+='</tr>';
                de+='</tbody></table>';

            }else if(json["Table"]=='Medication')
            {

                de='<table class="table table-bordered table-striped"><thead>'+
                    '<tr>'+
                    '<th>英文名称</th>'+
                    '<th>别名</th>'+
                    '<th>类别</th>'+

                    '</tr>'+
                    '</thead>'+
                    ' <tbody>'+
                    '<tr>';
                for(var m in mainwords_med){
                    for(var n in datas.Results)
                    {
                        if(m==n)
                        {
                            if(m!="Oname"){
                                de+='<td>';
                                de+=datas.Results[n];
                                de+='</td>';
                            }else{
                                de+='<td>';
                                de+=datas.Results[n];
                                de+='</td>';
                            }
                        }

                    }

                }
                de+='</tr>';
                de+='</tbody></table>';

            }else if(json["Table"]=='Lab')
            {
                de='<table class="table table-bordered table-striped"><thead>'+
                    '<tr>'+
                    '<th>英文名称</th>'+
                    '<th>别名</th>'+
                    '<th>一级类别</th>'+
                    '<th>二级类别</th>'+
                    '</tr>'+
                    '</thead>'+
                    ' <tbody>'+
                    '<tr>';
                for(var m in mainwords_lab){
                    for(var n in datas.Results)
                    {
                        if(m==n)
                        {
                            if(m!="Oname"){
                                de+='<td>';
                                de+=datas.Results[n];
                                de+='</td>';
                            }else{
                                de+='<td>';
                                de+=datas.Results[n];
                                de+='</td>';
                            }
                        }

                    }

                }

                de+='</tr>';
                de+='</tbody></table>';

            }else if(json["Table"]=='Symptom')
            {

                var de='<table class="table table-bordered table-striped"><thead>'+
                    '<tr>'+
                    '<th>一级科室</th>'+
                    '<th>二级科室</th>'+
                    '<th>一级部位</th>'+
                    '<th>二级部位</th>'+
                    '</tr>'+
                    '</thead>'+
                    ' <tbody>'+
                    '<tr>';
                for(var m in mainwords_sym){
                    for(var n in datas.Results)
                    {
                        if(m==n)
                        {
                            var ts=datas.Results[n];
                            if(ts){
                                de+='<td>';
                                de+=datas.Results[n];
                                de+='</td>';
                            }
                        }

                    }

                }

                de+='</tr>';
                de+='</tbody></table>';
            }else if(json["Table"]=='Medicare'){
                flags=1;
                var de='<table class="table table-bordered table-striped"><thead>'+
                    '<tr>'+
                    '<th>一级类别</th>'+
                    '<th>二级类别</th>'+
                    '<th>医保报销限制类别</th>'+
                    '<th>医保编号</th>'+
                    '<th>医保报销剂型</th>'+
                    '</tr>'+
                    '</thead>'+
                    ' <tbody>'+
                    '<tr>';
                for(var m in mainwords_medicare){
                    for(var n in datas.Results)
                    {
                        if(m==n)
                        {
                            if(m=="Ybbxjx"||m=="Ybbxxzlb"){
                                de+='<td>';
                                de+=datas.Results[n];
                                de+='</td>';
                            }else{
                                de+='<td>';
                                de+=(datas.Results[n]);
                                de+='</td>';
                            }
                        }

                    }

                }
                de+='</tr>';
                de+='</tbody></table>';
                for(var j in dkey) {

                    for(var i in datas.Results)
                    {
                        var temp=0;
                        var title="";

                        if(i==j){
                            de=de+'<h3 style="color: #3c8dbc;" id="'+i+'">'+dkey[i]+'</h3>';
                            var rs=eval(datas.Results[i]);
                            de+=rs+'</br>';
                        }
                    }

                }


            }

            for(var j in dkey) {
                if(flags==1) break;
                for(var i in datas.Results)
                {
                    var temp=0;
                    var title="";

                    if(i==j){
                        de=de+'<h3 style="color: #3c8dbc;" id="'+i+'">'+dkey[i]+'</h3>';
                        var rs=eval(datas.Results[i]);

                        for(var m in rs )
                        {

                            if(rs[m][0]=='0'){
                                de=de+rs[m][1];
                            }else if(rs[m][0]=='1'){
                                de=de+"<a href='javascript:void(0);' ng-click=\"showdetails('"+rs[m][2]+"')\">"+rs[m][1]+"</a>";

                            }else if(rs[m][0]=='10'){
                                de=de+'</br>';
                            }else if(rs[m][0]=='2'){
                                de=de+'</br>';
                                var imagelist=rs[m][1].split("/");
                                if(imagelist[1]!=null){
                                    var height=200,width=100;
                                    if(rs[m][2]!=0){
                                        height=rs[m][2];
                                    }
                                    if(rs[m][3]!=0){
                                        width=rs[m][3];
                                    }
                                    var imageurl='http://1.85.37.136:9999/medknowledge/imageop/?q={"Iid":"'+imagelist[1]+'"}';
                                    de=de+'<div><img alt="User Image" src='+ imageurl+'  style="width:'+width+', height:'+height+'"/></div>';
                                    de=de+'</br>';
                                }
                            }

                        }

                    }
                }

            }
            details=details+de;
            details=details+'</div>';
            details=details+'</div>';
            $(".modal-content").html("");
            $(".modal-content").html($compile(details)($scope));
        });

    }



/////////////////// if click back button ////////////////
    $scope.showback = function(){
        var json={};
        var ll="";
        if(pointer<0)
        {
            return;
        }else{
            ll=urllist[pointer-2];
            pointer--;
        }
        var id=ll.split("/");
        if(id[0]=="disease"){
            json["Table"] = "Disease";
            json["Did"]=id[1];
            dkey=key_disease;
        }else if(id[0]=="medication"){
            json["Table"] = "Medication";
            json["Mid"]=id[1];
            dkey=key_medication;
        }else if(id[0]=="laboratory"){
            json["Table"] = "Lab";
            json["Lid"]=id[1];
            dkey=key_lab;
        }else if(id[0]=="symptom"){
            json["Table"] = "Symptom";
            json["Sid"]=id[1];
            dkey=key_sym;
        }else if(id[0]=="medicare"){
            json["Table"] = "Medicare";
            json["Mid"]=id[1];
            dkey=key_medicare;
        }else if(id[0]=="clinicalpath"){
            json["Table"] = "Clinicalpath";
            json["Cid"]=id[1];
            dkey=key_clinicpath;
        }
        var jsonStr = JSON.stringify(json);
        var canshu={"q":jsonStr};
        // console.log(canshu);

        $.getJSON(urlop, canshu,  function(datas) {

            var details="";
            var flags=0;
            details=details+'<div class="modal-header">';
            details=details+'<button type="button" class="close"';
            details=details+' data-dismiss="modal" aria-hidden="true"> &times';
            details=details+'</button>';
            details=details+'<h2  style="color: #3c8dbc;text-align:center " class="modal-title" id="myModalLabel">';
            details=details+datas.Results["Name"];
            details=details+'</h2>';
            if(pointer<=1){
                details=details+'<div style="float:right"><a href="javascript:void(0);" ng-click="showback()" style="display:none"><i class="fa fa-fw fa-arrow-left"></i>后退</a>';
            }else{
                details=details+'<div style="float:right"><a href="javascript:void(0);" ng-click="showback()"><i class="fa fa-fw fa-arrow-left"></i>后退</a>';
            }

            if(pointer==urllist.length){
                details=details+'<a href="javascript:void(0);" ng-click="showforward()" style="display:none"><i class="fa fa-fw fa-arrow-right"></i>前进</a> </div>';
            }else{

                details=details+'<a href="javascript:void(0);" ng-click="showforward()"><i class="fa fa-fw fa-arrow-right"></i>前进</a> </div>';
            }
            details=details+'</div><div class="modal-body">';
            details=details+'<div class="col-md-3" role="complementary">';
            //details=details+'<nav class="bs-docs-sidenav hidden-print hidden-xs hidden-sm affix-top" style="position:fixed;">';
            details=details+'<ul class="nav  nav-list bs-docs-sidenav affix" id="gundongtiao">';
            for(var j in dkey) {
                for(var i in datas.Results)
                {
                    if(i==j){
                        details=details+'<li>';
                        details=details+'<a href="#'+j+'">'+dkey[j]+'</a>';
                        details=details+'</li>';
                    }
                }
            }
            details=details+'</ul>';
            //   details=details+'</nav>';
            details=details+'</div>';


            details+='<div class="col-md-9">';
            var de="";

            if(json["Table"]=='Disease')
            {

                de='<table class="table table-bordered table-striped"><thead>'+
                    '<tr>'+
                    '<th>英文名称</th>'+
                    '<th>别名</th>'+
                    '<th>Icd10</th>'+

                    '</tr>'+
                    '</thead>'+
                    ' <tbody>'+
                    '<tr>';
                for(var m in mainwords_dis){
                    for(var n in datas.Results)
                    {
                        if(m==n)
                        {
                            //de+='<h3 style="color: #3c8dbc;"><b>'+mainwords_dis[m]+'</b></h3>';

                            if(m!="Oname"){
                                de+='<td>';
                                de+=datas.Results[n];
                                de+='</td>';
                            }else{
                                de+='<td>';
                                de+=datas.Results[n];
                                de+='</td>';
                            }
                        }

                    }

                }
                de+='</tr>';
                de+='</tbody></table>';

            }else if(json["Table"]=='Medication')
            {

                de='<table class="table table-bordered table-striped"><thead>'+
                    '<tr>'+
                    '<th>英文名称</th>'+
                    '<th>别名</th>'+
                    '<th>类别</th>'+

                    '</tr>'+
                    '</thead>'+
                    ' <tbody>'+
                    '<tr>';
                for(var m in mainwords_med){
                    for(var n in datas.Results)
                    {
                        if(m==n)
                        {
                            //   de+='<h3 style="color: #3c8dbc;"><b>'+mainwords_med[m]+'</b></h3>';
                            if(m!="Oname"){
                                de+='<td>';
                                de+=datas.Results[n];
                                de+='</td>';
                            }else{
                                de+='<td>';
                                de+=datas.Results[n];
                                de+='</td>';
                            }
                        }

                    }

                }
                de+='</tr>';
                de+='</tbody></table>';

            }else if(json["Table"]=='Lab')
            {
                de='<table class="table table-bordered table-striped"><thead>'+
                    '<tr>'+
                    '<th>英文名称</th>'+
                    '<th>别名</th>'+
                    '<th>一级类别</th>'+
                    '<th>二级类别</th>'+
                    '</tr>'+
                    '</thead>'+
                    ' <tbody>'+
                    '<tr>';
                for(var m in mainwords_lab){
                    for(var n in datas.Results)
                    {
                        if(m==n)
                        {
                            //   de+='<h3 style="color: #3c8dbc;"><b>'+mainwords_lab[m]+'</b></h3>';
                            if(m!="Oname"){
                                de+='<td>';
                                de+=datas.Results[n];
                                de+='</td>';
                            }else{
                                de+='<td>';
                                de+=datas.Results[n];
                                de+='</td>';
                            }
                        }

                    }

                }

                de+='</tr>';
                de+='</tbody></table>';

            }else if(json["Table"]=='Symptom')
            {

                var de='<table class="table table-bordered table-striped"><thead>'+
                    '<tr>'+
                    '<th>一级科室</th>'+
                    '<th>二级科室</th>'+
                    '<th>一级部位</th>'+
                    '<th>二级部位</th>'+
                    '</tr>'+
                    '</thead>'+
                    ' <tbody>'+
                    '<tr>';
                for(var m in mainwords_sym){
                    for(var n in datas.Results)
                    {
                        if(m==n)
                        {
                            var ts=datas.Results[n];
                            if(ts){
                                // de+='<h3 style="color: #3c8dbc;"><b>'+mainwords_sym[m]+'</b></h3>';
                                de+='<td>';
                                de+=datas.Results[n];
                                de+='</td>';
                            }
                        }

                    }

                }

                de+='</tr>';
                de+='</tbody></table>';
            }else if(json["Table"]=='Medicare'){
                flags=1;
                var de='<table class="table table-bordered table-striped"><thead>'+
                    '<tr>'+
                    '<th>一级类别</th>'+
                    '<th>二级类别</th>'+
                    '<th>医保报销限制类别</th>'+
                    '<th>医保编号</th>'+
                    '<th>医保报销剂型</th>'+
                    '</tr>'+
                    '</thead>'+
                    ' <tbody>'+
                    '<tr>';
                for(var m in mainwords_medicare){
                    for(var n in datas.Results)
                    {
                        if(m==n)
                        {
                            //de+='<h3 style="color: #3c8dbc;"><b>'+mainwords_dis[m]+'</b></h3>';

                            if(m=="Ybbxjx"||m=="Ybbxxzlb"){
                                de+='<td>';
                                de+=datas.Results[n];
                                de+='</td>';
                            }else{
                                de+='<td>';
                                de+=(datas.Results[n]);
                                de+='</td>';
                            }
                        }

                    }

                }
                de+='</tr>';
                de+='</tbody></table>';
                for(var j in dkey) {

                    for(var i in datas.Results)
                    {
                        var temp=0;
                        var title="";

                        if(i==j){
                            de=de+'<h3 style="color: #3c8dbc;" id="'+i+'">'+dkey[i]+'</h3>';
                            var rs=eval(datas.Results[i]);
                            de+=rs+'</br>';
                        }
                    }

                }



            }



            for(var j in dkey) {
                // console.log(flags);
                if(flags==1) break;

                for(var i in datas.Results)
                {
                    var temp=0;
                    var title="";

                    if(i==j){
                        de=de+'<h3 style="color: #3c8dbc;"  id="'+i+'">'+dkey[i]+'</h3>';
                        var rs=eval(datas.Results[i]);

                        for(var m in rs )
                        {

                            if(rs[m][0]=='0'){
                                de=de+rs[m][1];
                            }else if(rs[m][0]=='1'){
                                de=de+"<a href='javascript:void(0);' ng-click=\"showdetails('"+rs[m][2]+"')\">"+rs[m][1]+"</a>";

                            }else if(rs[m][0]=='10'){
                                de=de+'</br>';
                            }else if(rs[m][0]=='2'){
                                de=de+'</br>';
                                // console.log(rs[m][2]+rs[m][3]);

                                var imagelist=rs[m][1].split("/");
                                if(imagelist[1]!=null){
                                    var height=200,width=100;
                                    if(rs[m][2]!=0){
                                        height=rs[m][2];
                                    }
                                    if(rs[m][3]!=0){
                                        width=rs[m][3];
                                    }
                                    var imageurl='http://1.85.37.136:9999/medknowledge/imageop/?q={"Iid":"'+imagelist[1]+'"}';
                                    //var imageurl='http://1.85.37.136:9999/imageop/?q={"Iid":"i10109"}';
                                    de=de+'<div><img alt="User Image" src='+ imageurl+'  style="width:'+width+', height:'+height+'"/></div>';
                                    de=de+'</br>';
                                }
                            }

                        }

                    }
                }

            }
            details=details+de;
            details=details+'</div>';

            details=details+'</div>';

            $(".modal-content").html("");
            $(".modal-content").html($compile(details)($scope));

        });
    }




//////////////////////// if click forward button ///////////
    $scope.showforward = function(){

        var json={};
        var ll="";
        if(pointer>=urllist.length)
        {
            return;
        }else{
            ll=urllist[pointer];
            pointer++;
        }

        var id=ll.split("/");
        if(id[0]=="disease"){
            json["Table"] = "Disease";
            json["Did"]=id[1];
            dkey=key_disease;
        }else if(id[0]=="medication"){
            json["Table"] = "Medication";
            json["Mid"]=id[1];
            dkey=key_medication;
        }else if(id[0]=="laboratory"){
            json["Table"] = "Lab";
            json["Lid"]=id[1];
            dkey=key_lab;
        }else if(id[0]=="symptom"){
            json["Table"] = "Symptom";
            json["Sid"]=id[1];
            dkey=key_sym;
        }else if(id[0]=="medicare"){
            json["Table"] = "Medicare";
            json["Mid"]=id[1];
            dkey=key_medicare;
        }else if(id[0]=="clinicalpath"){
            json["Table"] = "Clinicalpath";
            json["Cid"]=id[1];
            dkey=key_clinicpath;
        }
        json["Did"]=id[1];
        var jsonStr = JSON.stringify(json);
        var canshu={"q":jsonStr};
        // console.log(canshu);
        $.getJSON(urlop,canshu, function(datas) {
            var flags=0;
            var details="";
            details=details+'<div class="modal-header">';
            details=details+'<button type="button" class="close"';
            details=details+' data-dismiss="modal" aria-hidden="true"> &times';
            details=details+'</button>';
            details=details+'<h2  style="color: #3c8dbc;text-align:center" class="modal-title" id="myModalLabel">';
            details=details+datas.Results["Name"];
            details=details+'</h2>';
            if(pointer<=1){
                details=details+'<div style="float:right"><a href="javascript:void(0);" ng-click="showback()" style="display:none"><i class="fa fa-fw fa-arrow-left"></i>后退</a>';
            }else{
                details=details+'<div style="float:right"><a href="javascript:void(0);" ng-click="showback()"><i class="fa fa-fw fa-arrow-left"></i>后退</a>';
            }

            if(pointer==urllist.length){
                details=details+'<a href="javascript:void(0);" ng-click="showforward()" style="display:none"><i class="fa fa-fw fa-arrow-right"></i>前进</a> </div>';
            }else{

                details=details+'<a href="javascript:void(0);" ng-click="showforward()"><i class="fa fa-fw fa-arrow-right"></i>前进</a> </div>';
            }
            details=details+'</div><div class="modal-body">';
            details=details+'<div class="col-md-3" role="complementary">';
            //   details=details+'<nav class="bs-docs-sidenav hidden-print hidden-xs hidden-sm affix-top" style="position:fixed;">';
            details=details+'<ul class="nav  nav-list bs-docs-sidenav affix" id="gundongtiao">';
            for(var j in dkey) {
                for(var i in datas.Results)
                {
                    if(i==j){
                        details=details+'<li>';
                        details=details+'<a href="#'+j+'">'+dkey[j]+'</a>';
                        details=details+'</li>';
                    }
                }
            }
            details=details+'</ul>';
            //   details=details+'</nav>';
            details=details+'</div>';




            details+='<div class="col-md-9">';
            var de="";

            if(json["Table"]=='Disease')
            {

                de='<table class="table table-bordered table-striped"><thead>'+
                    '<tr>'+
                    '<th>英文名称</th>'+
                    '<th>别名</th>'+
                    '<th>Icd10</th>'+

                    '</tr>'+
                    '</thead>'+
                    ' <tbody>'+
                    '<tr>';
                for(var m in mainwords_dis){
                    for(var n in datas.Results)
                    {
                        if(m==n)
                        {
                            //de+='<h3 style="color: #3c8dbc;"><b>'+mainwords_dis[m]+'</b></h3>';

                            if(m!="Oname"){
                                de+='<td>';
                                de+=datas.Results[n];
                                de+='</td>';
                            }else{
                                de+='<td>';
                                de+=datas.Results[n];
                                de+='</td>';
                            }
                        }

                    }

                }
                de+='</tr>';
                de+='</tbody></table>';

            }else if(json["Table"]=='Medication')
            {

                de='<table class="table table-bordered table-striped"><thead>'+
                    '<tr>'+
                    '<th>英文名称</th>'+
                    '<th>别名</th>'+
                    '<th>类别</th>'+

                    '</tr>'+
                    '</thead>'+
                    ' <tbody>'+
                    '<tr>';
                for(var m in mainwords_med){
                    for(var n in datas.Results)
                    {
                        if(m==n)
                        {
                            //   de+='<h3 style="color: #3c8dbc;"><b>'+mainwords_med[m]+'</b></h3>';
                            if(m!="Oname"){
                                de+='<td>';
                                de+=datas.Results[n];
                                de+='</td>';
                            }else{
                                de+='<td>';
                                de+=datas.Results[n];
                                de+='</td>';
                            }
                        }

                    }

                }
                de+='</tr>';
                de+='</tbody></table>';

            }else if(json["Table"]=='Lab')
            {
                de='<table class="table table-bordered table-striped"><thead>'+
                    '<tr>'+
                    '<th>英文名称</th>'+
                    '<th>别名</th>'+
                    '<th>一级类别</th>'+
                    '<th>二级类别</th>'+
                    '</tr>'+
                    '</thead>'+
                    ' <tbody>'+
                    '<tr>';
                for(var m in mainwords_lab){
                    for(var n in datas.Results)
                    {
                        if(m==n)
                        {
                            //   de+='<h3 style="color: #3c8dbc;"><b>'+mainwords_lab[m]+'</b></h3>';
                            if(m!="Oname"){
                                de+='<td>';
                                de+=datas.Results[n];
                                de+='</td>';
                            }else{
                                de+='<td>';
                                de+=datas.Results[n];
                                de+='</td>';
                            }
                        }

                    }

                }

                de+='</tr>';
                de+='</tbody></table>';

            }else if(json["Table"]=='Symptom')
            {

                var de='<table class="table table-bordered table-striped"><thead>'+
                    '<tr>'+
                    '<th>一级科室</th>'+
                    '<th>二级科室</th>'+
                    '<th>一级部位</th>'+
                    '<th>二级部位</th>'+
                    '</tr>'+
                    '</thead>'+
                    ' <tbody>'+
                    '<tr>';
                for(var m in mainwords_sym){
                    for(var n in datas.Results)
                    {
                        if(m==n)
                        {
                            var ts=datas.Results[n];
                            if(ts){
                                // de+='<h3 style="color: #3c8dbc;"><b>'+mainwords_sym[m]+'</b></h3>';
                                de+='<td>';
                                de+=datas.Results[n];
                                de+='</td>';
                            }
                        }

                    }

                }

                de+='</tr>';
                de+='</tbody></table>';

            }else if(json["Table"]=='Medicare'){
                flags=1;
                var de='<table class="table table-bordered table-striped"><thead>'+
                    '<tr>'+
                    '<th>一级类别</th>'+
                    '<th>二级类别</th>'+
                    '<th>医保报销限制类别</th>'+
                    '<th>医保编号</th>'+
                    '<th>医保报销剂型</th>'+
                    '</tr>'+
                    '</thead>'+
                    ' <tbody>'+
                    '<tr>';
                for(var m in mainwords_medicare){
                    for(var n in datas.Results)
                    {
                        if(m==n)
                        {
                            //de+='<h3 style="color: #3c8dbc;"><b>'+mainwords_dis[m]+'</b></h3>';

                            if(m=="Ybbxjx"||m=="Ybbxxzlb"){
                                de+='<td>';
                                de+=datas.Results[n];
                                de+='</td>';
                            }else{
                                de+='<td>';
                                de+=(datas.Results[n]);
                                de+='</td>';
                            }
                        }

                    }

                }
                de+='</tr>';
                de+='</tbody></table>';
                for(var j in dkey) {

                    for(var i in datas.Results)
                    {
                        var temp=0;
                        var title="";

                        if(i==j){
                            de=de+'<h3 style="color: #3c8dbc;" id="'+i+'">'+dkey[i]+'</h3>';
                            var rs=eval(datas.Results[i]);
                            de+=rs+'</br>';
                        }
                    }

                }


            }




            for(var j in dkey) {
                if(flags==1) break;
                for(var i in datas.Results)
                {
                    var temp=0;
                    var title="";

                    if(i==j){
                        de=de+'<h3 style="color: #3c8dbc;" id="'+i+'">'+dkey[i]+'</h3>';
                        var rs=eval(datas.Results[i]);

                        for(var m in rs )
                        {

                            if(rs[m][0]=='0'){
                                de=de+rs[m][1];
                            }else if(rs[m][0]=='1'){
                                de=de+"<a href='javascript:void(0);' ng-click=\"showdetails('"+rs[m][2]+"')\">"+rs[m][1]+"</a>";

                            }else if(rs[m][0]=='10'){
                                de=de+'</br>';
                            }else if(rs[m][0]=='2'){
                                de=de+'</br>';
                                // console.log(rs[m][2]+rs[m][3]);

                                var imagelist=rs[m][1].split("/");
                                if(imagelist[1]!=null){
                                    var height=200,width=100;
                                    if(rs[m][2]!=0){
                                        height=rs[m][2];
                                    }
                                    if(rs[m][3]!=0){
                                        width=rs[m][3];
                                    }
                                    var imageurl='http://1.85.37.136:9999/medknowledge/imageop/?q={"Iid":"'+imagelist[1]+'"}';
                                    //var imageurl='http://1.85.37.136:9999/imageop/?q={"Iid":"i10109"}';
                                    de=de+'<div><img alt="User Image" src='+ imageurl+'  style="width:'+width+', height:'+height+'"/></div>';
                                    de=de+'</br>';
                                }
                            }

                        }

                    }
                }

            }
            details=details+de;
            details=details+'</div>';

            details=details+'</div>';

            $(".modal-content").html("");
            $(".modal-content").html($compile(details)($scope));

        });


    }




//////////////////// get and show elastic search datas /////////////
    var itemNum=20;
    var pagenow=1;
    var pagenums;

/////////// search elastic datas////////
    $scope.searchs = function(pagenums,pagenow){
        urllist=[];
        pointer=0;
        if(pagenow == undefined){
            pagenow=1;
        }
        $(".treeview-menu li").removeAttr("class",".active");
        // console.log(store.getAll());
        var searchItem=$('#search-wrapper').typeahead('val');
        // console.log(searchItem);
        if(searchItem=="") return;
        var flag=1;
        for(var k=0;k<5;k++){
            if(store.get(k))
                if(store.get(k).name!=undefined&&store.get(k).name===searchItem)
                    flag=0;
        }
        if(flag) {//record item in history
            //console.log(store.has(searchItem));
            store.set(recordID,{"id":searchItem,"name":searchItem,"searched":1});
            recordID++;
            recordID%=5;
            store.set("rID",recordID);
        };

        var elasticData=getElasticData(searchItem,pagenums,pagenow);
        // console.log(elasticData);
        elasticData.success(function(res){
            pagenums = Math.ceil(res.Count/10);
            showElasicData(res.Results,pagenums,pagenow,searchItem);
        });
    };



//////////////// get elastic datas //////////////
    var getElasticData=function(query,pagenums,pagenow){
        if(pagenow=="back"){
            if(pagenow==1) return;
            pagenow=parseInt($("#pagination .active").text())-1;

        }else if(pagenow=="forward"){

            pagenow=parseInt($("#pagination .active").text());
        }
        var itemStart=(pagenow-1)*10,itemEnd=pagenow*10;
        var json={};
        json.Query_string=query;
        json.Start=itemStart;
        json.End=itemEnd;
        var param={'q':JSON.stringify(json)};
        // console.log(param);
        var result=$.ajax({
            method:'GET',
            url:'http://1.85.37.136:9999/medknowledge/search/',
            data:{'q':JSON.stringify(json)}
        }).error(function(e){
            // console.log("get elastic search data error!");
            //console.log(e);
        }).success(function(res){
            // console.log("get elastic search data success!");
            //	console.log(res);
        })
        return result;
    };



//////////// show elastic data ////////////////    
    var showElasicData=function(data,pagenums,pagenow,searchItem){
        var elasticDetails='',
            contentLength=$("#example1_wrapper").width()/12,nameLength=6;
        urllist=[];
        for(var i=0;i<data.length;i++){
            var contentDisplayId="contentDisplay"+i;
            var nameDisplayId="nameDisplay"+i;
            var ids="";
            if(data[i].Table==='Disease')
            {
                ids+='disease/'+data[i].Did;
            }else if(data[i].Table==='Symptom'){

                ids+='symptom/'+data[i].Sid;
            }else if(data[i].Table==='Medication'){
                ids+='medication/'+data[i].Mid;

            }else if(data[i].Table==='Lab'){
                ids+='laboratory/'+data[i].Lid;
            }else if(data[i].Table==='Medicare'){
                ids+='medicare/'+data[i].Mid;
            }else if(data[i].Table==='Clinicalpath'){
                ids+='clinicalpath/'+data[i].Cid;
            }

            elasticDetails+="<div id=\"content-round\" type=\"button\" ng-click=\"showdetails('"+ids+"')\" " +
                'class="btn  btn-lg content-block-my" data-toggle="modal" data-target="#myModal" style="background-color:#88c9f2;width: 100%"><li class="news-item"><div class="news-info">'
                +'<table title="'+data[i].Name+'"><tr style="background-color:#88c9f2" ><td width="30px"><div class="fl "><img class="type-logo" src="assets/img/medicalKnowledge/'
                +data[i].Table+'.png"></div></td><td width="150px"><div class="fl"><div  class="news-date" ><p class="data-first" id='+ nameDisplayId+' >'
                +data[i].Name.substring(0,5)+'...'+'</p></div></div></td><td width="">' +'<div id='+contentDisplayId+' >';
            if(data[i].Table==='Lab'){
                for(var j in data[i]){

                    if(j!=="Lid"&&j!="Table"&&j!="Name"){
                        elasticDetails+='<p class="info-content" displayLength="'
                            +contentLength+'">'
                            +data[i][j].replace(/^\s+|\s+$/g,"").substring(0,60)+'</p>';
                        elasticDetails+="</br>";
                    }
                }
            }else if(data[i].Table==='Disease'){

                for(var j in data[i]){

                    if(j!=="Did"&&j!="Table"&&j!="Name"){
                        elasticDetails+='<p class="info-content" displayLength="'
                            +contentLength+'">'
                            +data[i][j].replace(/^\s+|\s+$/g,"").substring(0,60)+'</p>';
                        elasticDetails+="</br>";
                    }
                }
                //console.log(data[i].Lcbx);
            }else if(data[i].Table==='Symptom'){
                for(var j in data[i]){

                    if(j!=="Sid"&&j!="Table"&&j!="Name"){
                        elasticDetails+='<p class="info-content" displayLength="'
                            +contentLength+'">'
                            +data[i][j].replace(/^\s+|\s+$/g,"").substring(0,60)+'</p>';
                        elasticDetails+="</br>";
                    }
                }
                //console.log('addSymptom');
            }else if(data[i].Table==='Medication'){
                for(var j in data[i]){

                    if(j!=="Mid"&&j!="Table"&&j!="Name"){
                        elasticDetails+='<p class="info-content" displayLength="'
                            +contentLength+'">'
                            +data[i][j].replace(/^\s+|\s+$/g,"").substring(0,60)+'</p>';
                        elasticDetails+="</br>";
                    }
                }
            }else  if(data[i].Table==='Medicare'){
                for(var j in data[i]){

                    if(j!=="Mid"&&j!="Table"&&j!="Name"){
                        elasticDetails+='<p class="info-content" displayLength="'
                            +contentLength+'">'
                            +data[i][j].replace(/^\s+|\s+$/g,"").substring(0,60)+'</p>';
                        elasticDetails+="</br>";
                    }
                }
            }else if(data[i].Table==='Clinicalpath'){
                for(var j in data[i]){

                    if(j!=="Cid"&&j!="Table"&&j!="Name"){
                        elasticDetails+='<p class="info-content" displayLength="'
                            +contentLength+'">'
                            +data[i][j].replace(/^\s+|\s+$/g,"").substring(0,60)+'</p>';
                        elasticDetails+="</br>";
                    }
                }
            }
            elasticDetails+='</div></td></tr></table></div></li></div>';

        }
        // $('#example1').html("");
        $('#example1').html($compile(elasticDetails)($scope));
        //分页技术
        // console.log(pagenums);
        $scope.page_search(pagenums,pagenow);


///////////////// cut string length //////////////////
        $.fn.extend({
            displayPart:function () {
                var displayLength = 100;
                displayLength = this.attr("displayLength") || displayLength;
                var text = this.text();
                //console.log(text);
                if (!text) return "";

                var result = "";
                var count = 0;
                for (var i = 0; i < displayLength; i++) {
                    var _char = text.charAt(i);
                    if (count >= displayLength)  break;
                    if (/[^x00-xff]/.test(_char))  count++;  //双字节字符，//[u4e00-u9fa5]中文

                    result += _char;
                    count++;
                }
                if (result.length < text.length) {
                    result += "...";
                }
                this.text(result);
            }
        });

        $(function () {

            for(var j=0;j<=itemNum;j++){
                //console.log($('#name-content'));
                $('#nameDisplay'+j).displayPart();
                var dis=$("#contentDisplay"+j).children().first();
                var i=1;
                while(dis.length!==0&&i<=2){

                    dis.displayPart();
                    dis.siblings("p").displayPart();
                    dis=dis.next("p");
                    i++;
                }
            }


        });
    };
    $rootScope.pageLoading = false;

}