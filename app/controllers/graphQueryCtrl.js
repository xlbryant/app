/**
 * Created by Wemakefocus on 2016/5/5.
 */
'use strict';

angular.module('app')
    .controller('GraphQueryController',GraphQueryController);
        function GraphQueryController($scope,diagnosisClassData,bodyData,diseaseClassData,labClassData,medicineClassData,Data,$rootScope){

        var realDiaClassData=diagnosisClassData;


        var realBodyData=bodyData;

        var types = ['dis','sym','lab','med'];
        var vm=$scope.vm={};
        vm.fclasses = realDiaClassData;
        vm.fbodies = realBodyData;
        vm.disClasses = diseaseClassData;
        vm.labClasses = labClassData;
        vm.medClasses = medicineClassData;
        vm.options = [{"label":"AND"},{"label":"NOT"}];
        for(var i=0;i<4;i++){
                vm[types[i]+"Option_0"] = {"label":"AND"};
        };
        //vm.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
        //vm.states=realBodyData;
        $scope.$watch('vm.fclass',function () {
            vm.sclass=null;
        });
        $scope.$watch('vm.fbody',function () {
            vm.sbody=null;
        });
        vm.isItemsLoading = {};
        vm.itemsReturn = {};
        vm.getStates=function (domain,num,item,fclass,sclass,fbody,sbody) {
            $rootScope.errorModal.unneededAPI.apiTimestamp = 0;
            vm.isItemsLoading[domain+'ItemsLoading_'+num]=true;
            vm.itemsReturn[domain+"_"+num] = [];
            // console.log(vm.itemsReturn[domain+"_"+num]);
             //console.log(vm);
            // var getHistory = function (type, item) {
            //     if(!item) {
            //         if (store.has("hID" + type)) {//get items from history
            //             // console.log("store has hID");
            //         } else store.set("hID" + type, 0);
            //         var historyID = store.get("hID" + type);
            //         vm.historyMem = [];
            //         for (var i = 9; i >-1; i--) {
            //             var hisItem = store.get("historyItem" + type + (historyID + i) % 10);
            //             if(!hisItem) continue;
            //             if (store.has("historyItem" + type + (historyID + i) % 10)) vm.itemsReturn[domain+"_"+num].push({"value":hisItem.id,"label":hisItem.name});
            //         }
            //         console.log(vm.itemsReturn[domain+"_"+num]);
            //         // navSearch.itemsReturn = itemReturn;
            //         return vm.itemsReturn[domain+"_"+num];
            //     }
            // }
            // var type = domain;
            // var typeName ="";
            // switch (type){
            //     case undefined:
            //         typeName = "";
            //         break;
            //     case "dis":
            //         typeName = "disease";
            //         break;
            //     case "sym":
            //         typeName = "symptom";
            //         break;
            //     case "med":
            //         typeName = "medicine";
            //         break;
            //     case "lab":
            //         typeName = "lab";
            //         break;
            //     default:
            //         alert("type error !");
            // }
            // console.log(type);
            // getHistory(typeName, item);

            var condition={
                "filterbydomain":domain,
                "filterbyfirst":item||"",
                "filterbyfclass":"",
                "filterbysclass":"",
                "filterbyfbody":"",
                "filterbysbody":"",
                "filterbynumber":"10"
            };
            if(!!fclass) condition.filterbyfclass=fclass.label;
            if(!!sclass) condition.filterbysclass=sclass.label;
            if(!!fbody) condition.filterbyfbody=fbody.label;
            if(!!sbody) condition.filterbysbody=sbody.label;
            // console.log(condition);
            var items=Data.getFilterData(condition).then(function (res) {
                // console.log( res.elements);
                var itemReturn=[];
                for(var i=0;i<res.elements.length;i++){
                    //itemReturn.push();
                    if(!!res.elements[i].ename)
                        vm.itemsReturn[domain+"_"+num].push({label:res.elements[i].name+'('+res.elements[i].ename+')',
                                    value:res.elements[i].value});
                    else vm.itemsReturn[domain+"_"+num].push({label:res.elements[i].name,value:res.elements[i].value});
                };
                // vm.itemsReturn[domain+"_"+num] = itemReturn;
                // store.set("item",itemReturn);
                // console.log(itemReturn);
                vm.isItemsLoading[domain+'ItemsLoading_'+num]=false;
                // console.log(vm.loading);
                vm.itemsReturn[domain+"_"+num];
                return vm.itemsReturn[domain+"_"+num];
            });

            // console.log(items);
            //
            // console.log("getStates!");
            // console.log(vm.selected);
            // console.log(item);
            // console.log($scope);
            return items;
        };
        vm.itemsOnceSelected = {};
        vm.recordItem = function (item,label) {
            // console.log(item);
            // console.log(label);
            vm.itemsOnceSelected[item.label] = item.value;
           // $scope.$broadcast("submitQuery",item.value);
        }
        // vm.itemSelected=function (item) {
        //     console.log(item);
        //     $scope.$emit("submitQuery",item.value);
        // };
        vm.currentSearchId = "";
        vm.isSingleShow = function () {
            var searchItemsNum = 0;
            for(var i=0;i<types.length;i++){
                if(!!vm[types[i]+"Selected_0"] && vm[types[i]+"Selected_0"] != ""){
                    vm.currentSearchId = vm.itemsOnceSelected[vm[types[i]+"Selected_0"]];
                    searchItemsNum++;
                    if(!!vm[types[i]+"Selected_1"] && vm[types[i]+"Selected_0"] != "")
                        searchItemsNum++;
                };
            }
            if(searchItemsNum >1) return 0;
            return 1;
        }
        vm.submitQuery=function (type) {
            // console.log("submitQuery!");
            // console.log(vm[type+"Selected_0"]);
            var searchId = vm.currentSearchId;
            if(!!!searchId) {
                console.log("search item is empty!");
                return 0;
            }
            // console.log(searchId);
            console.log(searchId);
            store.set("currentId",searchId);
            $scope.$emit("submitQuery",searchId);
        }
        //console.log(store);
       // store.clear();
        vm.historyMem=[];
        // console.log(vm.hasHistory(vm.historyMem));
        $scope.$on("historyUpdate",function (e,item) {
            console.log("history update!");
            vm.getHistoryMem();
            console.log(vm);
            // $scope.$apply();
        })
        vm.getHistoryMem=function () {
            if(store.has("hID")){
                // console.log("store has hID");
            }
            else store.set("hID",0);
            var historyID=store.get("hID");
            vm.historyMem=[];
            for(var i=0;i<10;i++){
                if(!store.get("historyItem"+(historyID+i)%10)) continue;
                if(store.has("historyItem"+(historyID+i)%10)) vm.historyMem.push(store.get("historyItem"+(historyID+i)%10));
            }
            // console.log(vm);
        }
        vm.getHistoryMem();
        vm.queryAgain=function (id) {
            $scope.$emit("submitQuery",id);
        };
        vm.disConditions = [{"num":0}];
        vm.symConditions = [{"num":0}];
        vm.medConditions = [{"num":0}];
        vm.labConditions = [{"num":0}];
        vm.addCondition = function (num, type) {
            $rootScope.errorModal.unneededAPI.apiTimestamp = 0;
            // console.log(num);
            vm[type+"Option_"+(num+1)] = {"label":"AND"};
            if(num<10) vm[type+"Conditions"].push({"num":num+1});
        };
        vm.removeCondition = function (num, type) {
            var arr = vm[type+"Conditions"];
            // console.log(arr);
            arr.splice(num,1);
            // console.log(arr);
            // console.log(num);
            if(num === arr.length){
                if(!!vm[type + 'Class_' + num]){
                     vm[type + 'Class_' + num] = {};
                };
                if(!!vm[type + 'Fclass_' + num]) {
                    vm[type + 'Fclass_' + num] = {};
                };
                if(!!vm[type + 'Sclass_' + num]) {
                    vm[type + 'Sclass_' + num] = {};
                };
                if(!!vm[type + 'Fbody_' + num]) {
                    vm[type + 'Fbody_' + num] = {};
                };
                if(!!vm[type + 'Sbody_' + num]) {
                    vm[type + 'Sbody_' + num] = {};
                };
                    vm[type + 'Selected_' + num ] = "";
            }else {
                for (var i = num; i < arr.length; i++) {
                    arr[i].num--;
                    if (i < arr.length) {
                        // console.log(vm);
                        // console.log(type + 'Class_' + i);
                        // console.log(vm[type + 'Class_' + i]);
                        if (!!vm[type + 'Class_' + i]) {
                            vm[type + 'Class_' + i] = vm[type + 'Class_' + (i + 1)];
                            if (i === arr.length - 1) vm[type + 'Class_' + (i + 1)] = {};
                        }
                        ;
                        if (!!vm[type + 'Fclass_' + i]) {
                            vm[type + 'Fclass_' + i] = vm[type + 'Fclass_' + (i + 1)];
                            if (i === arr.length - 1) vm[type + 'Fclass_' + (i + 1)] = {};
                        }
                        ;
                        if (!!vm[type + 'Sclass_' + i]) {
                            vm[type + 'Sclass_' + i] = vm[type + 'Sclass_' + (i + 1)];
                            if (i === arr.length - 1) vm[type + 'Sclass_' + (i + 1)] = {};
                        }
                        ;
                        if (!!vm[type + 'Fbody_' + i]) {
                            vm[type + 'Fbody_' + i] = vm[type + 'Fbody_' + (i + 1)];
                            if (i === arr.length - 1) vm[type + 'Fbody_' + (i + 1)] = {};
                        }
                        ;
                        if (!!vm[type + 'Sbody_' + i]) {
                            vm[type + 'Sbody_' + i] = vm[type + 'Sbody_' + (i + 1)];
                            vm[type + 'Sbody_' + (i + 1)] = {};
                        }
                        ;
                        vm[type + 'Selected_' + i] = vm[type + 'Selected_' + (i + 1)];
                        vm[type + 'Selected_' + (i + 1)] = "";
                    }
                }
            }
        };
        vm.isPlusShow = function (num,type) {
            return num < vm[type + "Conditions"].length - 1 ? 0 : 1;
        };
        vm.isMinusShow = function (num,type) {
            return num === 0 && vm[type+"Conditions"].length === 1 ? 0 : 1;
        };
        var getQueries = function () {
            var types2=['dids','sids','lids','mids'], queries = {"AND":[],"NOT":[]};
            //var test={"AND":["m12767"],"NOT":[""]};console.log("test");console.log(test);
            for(var i=0;i<4;i++){
                var num = vm[types[i]+"Conditions"].length;
                for(var j=0;j<num;j++){
                    //console.log(vm.itemsOnceSelected[vm[types[i]+"Selected_"+j]]);
                    // console.log(vm);
                    // console.log(types[i]+"Option_"+j);
                    // console.log(vm[types[i]+"Option_"+j]);
                    if(!!vm.itemsOnceSelected[vm[types[i]+"Selected_"+j]])
                        queries[vm[types[i]+"Option_"+j].label].push(vm.itemsOnceSelected[vm[types[i]+"Selected_"+j]]);
                }
            };
            if(queries.NOT.length == 0) {queries.NOT.push("");}
            if(queries.AND.length == 0) {queries.AND.push("");}
            return queries;
        };
        vm.searchDisease = function () {
             $rootScope.errorModal.unneededAPI.apiTimestamp = 0;
            // console.log(vm.itemsOnceSelected);
             //console.log(getQueries());
             Data.getDiseaseIds(getQueries()).then(function (res) {
                 // console.log(res);
                 var Dids = {"DIDS":res.elements};
                 $scope.$emit('getDiseaseIds',Dids);
             })
        };
        vm.searchMedicine = function () {
             //console.log(getQueries());
            $rootScope.errorModal.unneededAPI.apiTimestamp = 0;
            Data.getMedicineIds(getQueries()).then(function (res) {
                // console.log(res);
                var Mids = {"MIDS":res.elements};
                $scope.$emit('getMedicineIds',Mids);
            })
        };
    }