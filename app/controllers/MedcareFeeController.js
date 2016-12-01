/**
 * Created by Wemakefocus on 2016/10/12.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('MedcareFeeController', MedcareFeeController);

    // ControllerName.$inject = ['dependency'];

    /* @ngInject */
    function MedcareFeeController($scope,$rootScope) {
        var vm = $scope.vm = {};
        $.get("http://1.85.37.136:9999/medcareFee/getUserItems/?q={%22PID%22:%22ZY010001102284%22}").success(function (res) {
            console.log(res);
			res = res.Patient;
            var data = [];
            for(var k in res.Items){
                if(res.Items.hasOwnProperty(k)){
                    res.Items[k].id = k;
                    if(res.Items[k].state === "Automatically approved"){
                        res.Items[k].stateClass = "itemApproved";
                    }else if(res.Items[k].state === "Accepted"){
                        res.Items[k].stateClass = "itemAccepted";
                    }else if(res.Items[k].state === "Pending"){
                        res.Items[k].stateClass = "itemPending";
                    }else if(res.Items[k].state === "Rejected"){
                        res.Items[k].stateClass = "itemRejected";
                    }
                    data.push(res.Items[k]);
                }
            }
            data.sort(function (a,b) {
                return a.score<b.score?1:-1;
            });
            console.log(data);
            // var itemsData = data.slice(0,30);
            // console.log(itemsData);
            vm.allMem = data;
            // drawTable(itemsData);
            $rootScope.pageLoading = false;
        });
        vm.isStateDic = ["否","是"];
        vm.columns = [
            {
                label:'ID',
                name:'id'
            },
            {
                label: '名称',
                name: 'item_name'
            },
            {
                label: '费用(元)',
                name: 'item_fee'
            },
            // {
            //     label: '使用率',
            //     name: 'adoption'
            // },
            // {
            //     label: '平均费用',
            //     name: 'cost_mean'
            // },
            // {
            //     label: '费用标准差',
            //     name: 'cost_std'
            // },
            {
                label:'得分',
                name:'score'
            },
            // {
            //     label: '在标准路径中',
            //     name: 'is_in_standard_path'
            // }
            {
                label: "状态",
                name: "state"
            },
            {
                label: "原因",
                name: "reason"
            },
            {
                label: "备注",
                name: "comment"
            }
        ];
        vm.itemStates = [
            {
                stateName: "Accepted",
                code: "accepted"
            },
            //{
              //  stateName: "待定",
              //  code: "pending"
            //},
            {
                stateName: "Rejected",
                code: "rejected"
            }
        ];
        // vm.stateCodeValue = ""
        // vm.itemSelected = function (state) {
        //     console.log(state);
        //     if(state !== null){
        //         vm.details.state = state;
        //     }else {
        //         vm.details.state = vm.detailsCopy.state;
        //     }
        //     console.log(vm.details);
        // };
        vm.cancel = function () {
            // console.log("cancel");
            // vm.details.state = vm.detailsCopy.state;
            // vm.details.comment = vm.detailsCopy.comment;
        }
        vm.sort = {
            column: 'score',
            direction: -1,
            toggle: function(column) {
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
        vm.page = {
            size: 10,
            index: 1
        };
        vm.comfirmedIds = [];
        vm.stateChangeDisable = false;
        vm.confirm = function (id) {
            // console.log("confirmed!");
            // console.log(vm.comfirmedIds.indexOf(id));
            if(vm.comfirmedIds.indexOf(id) === -1){
                vm.comfirmedIds.push(id);
            }
            // console.log(vm.stateChangeDisable);
            // console.log(vm.comfirmedIds);
            var confirmedData = {
                "PID": "ZY010001102284",
                "IID": vm.details.id,
                "Status": vm.details.state,
				"Comment": vm.details.comment
            };
            confirmedData.Status = vm.isAccepted === true ? "accepted" : "rejected";
            vm.details.state = vm.isAccepted === true ? "Accepted" : "Rejected";
            vm.details.stateClass = vm.isAccepted === true ? "itemAccepted" : "itemRejected";
            // vm.details.stateClass = "";
            // console.log(confirmedData);
            $.ajax({
                url:"http://1.85.37.136:9999/medcareFee/updateUserItems/",
                type: "POST",
                data: JSON.stringify(confirmedData),
                success: function (res) {
                    console.log("post confirmedData success");
                    console.log(res);
                }
            })
        };
        vm.getDetails = function (id) {
            if(vm.comfirmedIds.indexOf(id) > -1){
                vm.stateChangeDisable = true;
            }else {
                vm.stateChangeDisable = false;
            }
            vm.stateCodeValue = null;
            for(var i=0,l=vm.allMem.length;i<l;i++){
                if(vm.allMem[i].id === id){
                    vm.details = vm.allMem[i];
                    // vm.detailsCopy = $.extend({},vm.details);
                }
            }
            // vm.details.state = "accept";
            $("#itemDetails").modal("show");
            // console.log(vm.details);
        };
        vm.isAccepted = true;
        vm.toggleIsAccepted = function () {
            vm.isAccepted = !vm.isAccepted;
            // vm.details.state = "reject";
            // vm.details.state = vm.details.state === "Accept" ? "Reject":"Accept";
            // console.log(vm.allMem);
        }
    }

})();

