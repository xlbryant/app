/**
 * Created by Wemakefocus on 2016/4/28.
 */
'use strict';

angular.module('app')
    .controller('tableTestController',function ($scope,$document,$sce) {
        var vm = $scope.vm = {};

        // $scope.$on('submitQuery', function (e, item) {
        //     console.log(vm.isGraphLoading);
        //     vm.isGraphLoading = true;
        //     console.log(vm.isGraphLoading);
        //     console.log("!!");
        // });
        // $scope.$on('graphLoaded', function (e, item) {
        //     console.log(vm.isGraphLoading);
        //     vm.isGraphLoading = false;
        //     console.log(vm.isGraphLoading);
        //     console.log("!!");
        // });
        // $scope.$on('graphLoading', function (e, item) {
        //     console.log(vm.isGraphLoading);
        //     vm.isGraphLoading = true;
        //     console.log(vm.isGraphLoading);
        //     console.log("!!");
        // });
        $scope.gridMouseover=function (e) {
            //console.log("mouseover!");
            $scope.$emit("nodeMouseover",e);
        };
        $scope.gridMouseleave=function (e) {
            // console.log("mouseleave!");
            $scope.$emit("nodeMouseleave",e);
        };
        $scope.gridMouseClick=function (id,type) {
            if(event.ctrlKey){
                // console.log("ctrl pressed!");
                if(type=="disease"||type=="medicine"||type=="symptom"||type=="lab")
                $scope.$emit("submitQuery",id);
            }
            else {
                $scope.$emit("nodeMouseclick",[id,type]);
                // console.log("mouseclick!");
                // console.log(id,type);
                //showItemDetails(id,type);
                // console.log("showed!");
            };
        };
        $scope.$on("graphElements",function (e,item) {
            vm.items=[];
            // console.log("it is tableTestCtrl!");
            // console.log(item);
            // console.log(e);
            // console.log(vm);
            for(var i=0;i<item.nodes.length;i++) {
                var node = item.nodes[i].data;
                vm.items.push({
                    id: node.id,
                    name: node.name, // 字符串类型
                    type: node.type
                });
            }
            // console.log(vm);
        })
        $scope.$on("nodeHovered",function (e,item) {
            // console.log($document);
            // console.log($('#myDetailsTable'));
            // console.log(item);
            $('#'+item).addClass("my-table-hovered");
            var ele=angular.element(document.getElementById(item));
            $('#myDetailsTable').scrollToElementAnimated(ele,300);
            //console.log(anchorScroll);
            //console.log(anchorScroll.toView);
            //console.log(item);
            //anchorScroll.toView('#'+item,true,'#myDetailsTable',350);
        });
        $scope.$on("nodeNotHovered",function (e,item) {
            // console.log(item);
            $('#'+item).removeClass("my-table-hovered");
        });

        vm.page = {
            size: 1000,
            index: 1
        };
        vm.sort = {
            column: 'id',
            direction: -1,
            toggle: function(column) {
                if(column.name === 'name') return;
                if (column.sortable === false)
                    return;

                if (this.column === column.name) {
                    this.direction = -this.direction || -1;
                } else {
                    this.column = column.name;
                    this.direction = -1;
                }
            }
        };
        // 构建模拟数据
        vm.columns = [
            {
                label: 'ID',
                name: 'id',
                type: 'string'
            },
            {
                label: '名字',
                name: 'name',
                type: 'string'
            },
            {
                label: '类型',
                name: 'type',
                type: 'string'
            }
        ];
    });
    // .value('duScrollActiveClass', '.my-table-hovered');
//.value('duScrollOffset', 300);
//tableTest.$inject=['$scope','anchorScroll'];
//function tableTest($scope,anchorScroll) {





    //

  //  vm.items = [];
  //   var MAX_NUM = 10 * 1000;
  //   function rand(min, max) {
  //       return min + Math.round(Math.random() * (max-min));
  //   }
  //   for (var i = 0; i < MAX_NUM; ++i) {
  //       var id = rand(0, MAX_NUM);
  //       vm.items.push({
  //           id: i + 1,
  //           name: 'Name' + id, // 字符串类型
  //           followers: rand(0, 100 * 1000 * 1000), // 数字类型
  //           birthday: moment().subtract('day', rand(365, 365 * 50)).toDate(), // 日期类型
  //           summary: '这是一个测试' + i,
  //           income: rand(1000, 100000) // 金额类型
  //       });
  //   }
//}