'use strict';

angular.module('app')
	   .service("traMedical",function traMedical($q,$http){
	   
	    return{
            getAllList:function(){
                var defer=$q.defer();  //声明延后执行
                var json = {"Table": "Zhongyi","Id":"z0000000" };
                $http({method:'GET',
                	   url:'http://1.85.37.136:9999/medknowledge/zhongyiop/',
                	   params:{"q" : JSON.stringify(json)}
                	 }).
                success(function(data,status,headers,config){
                    defer.resolve(data);  //声明执行成功
                    console.log('traditional medical data success!!!');
                }).
                error(function(data,status,headers,config){
                    defer.reject();      //声明执行失败
                });
                                 
                return defer.promise; //返回承诺，返回获取数据的API
            },
            getZhongyilist:function(class1,class2,class3,class4,class5){
                var defer=$q.defer();  //声明延后执行
                var json = {"Table": "Zhongyi","Id":"z0000000","Start": 0, "End": 1000, "Sort_item":"Name"};
                var filter = {"class1":class1,"class2":class2,"class3":class3,"class4":class4,"class5":class5};
                json.Filter = filter;
                $http({method:"GET",
                       url:"http://1.85.37.136:9999/medknowledge/zhongyilist/",
                       params:{"q" : JSON.stringify(json)}
                     }).
                success(function(data,status,headers,config){
                    defer.resolve(data);  //声明执行成功
                    console.log('traditional medical data success!!!');
                }).
                error(function(data,status,headers,config){
                    defer.reject();      //声明执行失败
                });
                                 
                return defer.promise; //返回承诺，返回获取数据的API
            },
            getDetails:function (Zid) {
                var defer=$q.defer();  //声明延后执行
                var json = {"Table": "Zhongyi","Id":Zid};
                $http({method:"GET",
                       url:"http://1.85.37.136:9999/medknowledge/zhongyiop/",
                       params:{"q" : JSON.stringify(json)}
                     }).
                success(function(data,status,headers,config){
                    defer.resolve(data);  //声明执行成功
                    console.log('traditional medical detail success!!!');
                }).
                error(function(data,status,headers,config){
                    defer.reject();      //声明执行失败
                });
                                 
                return defer.promise; //返回承诺，返回获取数据的API
            }

        };

	   });