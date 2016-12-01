'use strict';

angular.module('app')
  .controller('mainController',function($scope,Data,$interval,$location,$rootScope){
      // console.log('it is mainController!');
      var navSearch = $scope.navSearch = {};
      navSearch.types =[
          {
              label:'疾病',
              value:'dis'
          },
          {
              label:'症状',
              value:'sym'
          },
          {
              label:'辅助检查',
              value:'lab'
          },
          {
              label:'药品',
              value:'med'
          }
      ];
      navSearch.getStates = function (type, item) {
          $rootScope.errorModal.unneededAPI.apiTimestamp = 0;
          navSearch.isItemsLoading = true;
          // console.log(type);
          // console.log(item);
          // console.log(store.getAll());
          // console.log(navSearch);
          navSearch.itemsReturn = [];
          // var itemReturn=[];
          //     console.log(type);
          // var getHistory = function (type, item) {
          //     if(!item) {
          //         if (store.has("hID" + type)) {//get items from history
          //         // console.log("store has hID");
          //     } else store.set("hID" + type, 0);
          //     var historyID = store.get("hID" + type);
          //         navSearch.historyMem = [];
          //         for (var i = 9; i >-1; i--) {
          //             var hisItem = store.get("historyItem" + type + (historyID + i) % 10);
          //             if(!hisItem) continue;
          //             if (store.has("historyItem" + type + (historyID + i) % 10)) navSearch.itemsReturn.push({"value":hisItem.id,"label":hisItem.name});
          //         }
          //         console.log(itemReturn);
          //         // navSearch.itemsReturn = itemReturn;
          //         return itemReturn;
          //     }
          // }
          // var typeName ="";
          //     switch (type){
          //         case undefined:
          //             typeName = "";
          //             break;
          //         case "dis":
          //             typeName = "disease";
          //             break;
          //         case "sym":
          //             typeName = "symptom";
          //             break;
          //         case "med":
          //             typeName = "medicine";
          //             break;
          //         case "lab":
          //             typeName = "lab";
          //             break;
          //         default:
          //             alert("type error !");
          //     }
          //     console.log(type);
          // getHistory(typeName, item);
          // if(typeName == "" && !item){
          //     console.log(navSearch.itemsReturn);
          //     navSearch.isItemsLoading = false;
          //     return navSearch.itemsReturn;
          // };
// console.log(store.getAll());
          var condition={
              "filterbydomain":type||"",
              "filterbyfirst":item||"",
              "filterbyfclass":"",
              "filterbysclass":"",
              "filterbyfbody":"",
              "filterbysbody":"",
              "filterbynumber":"10"
          };
          // console.log(condition);
          var items=Data.getFilterData(condition).then(function (res) {
              // console.log( res.elements);
              for(var i=0;i<res.elements.length;i++){
                  //itemReturn.push();
                  if(!!res.elements[i].ename)
                      navSearch.itemsReturn.push({label:res.elements[i].name+'('+res.elements[i].ename+')',
                          value:res.elements[i].value});
                  else navSearch.itemsReturn.push({label:res.elements[i].name,value:res.elements[i].value});
              };


              // navSearch.itemsReturn = itemReturn;
              // store.set("item",itemReturn);
              // console.log(itemReturn);
              // console.log(navSearch.itemsReturn);
              navSearch.isItemsLoading = false;
              // console.log(vm.loading);
              return navSearch.itemsReturn;
          });

          // console.log(items);
          //
          // console.log("getStates!");
          // console.log(vm.selected);
          // console.log(item);
          // console.log($scope);
          return items;
      };
      navSearch.recordItem = function (item,label) {
          // console.log(item);
          // console.log(label);
          // vm.itemsOnceSelected[item.label] = item.value;
          $scope.$emit("submitQuery",item.value);
      };
      navSearch.submitQuery=function (item) {
           console.log("submitQuery!");
           console.log(navSearch.itemSelected);
          var searchId;
          for(var i =0;i<navSearch.itemsReturn.length;i++){
              if(navSearch.itemsReturn[i].label == item)
                  searchId = navSearch.itemsReturn[i].value;
          };
          if(!!!searchId) {
              console.log("search item is empty!");
              return 0;
          }
          // console.log(searchId);
          // console.log(searchId);
          store.set("currentId",searchId);
          $scope.$emit("submitQuery",searchId);
      };
      // console.log(navSearch);
    })
  /*      $scope.isCollapsed = true;
    //  console.log("in crl!!");
     //   console.log($);
    //  console.log(Data);
    //  console.log($scope);

      $scope.showMe=function(key){
    //    console.log("it is showMe!");
    //    console.log(key);
        $scope.gridKey=key.entity.number;
     //   console.log($scope);
        $rootScope.gridKey=$scope.gridKey;
     //   console.log($rootScope);
        $rootScope.$broadcast("gridKey",$scope.gridKey);
        $location.path("/detail");
      }
        $scope.highlightFilterHeader = function(row,rowRanderIndex,col,colRenderIndex){
            if(col.filters[0].term){
                return 'header-filtered';
            }else{
                return '';
            }
        };

      $scope.gridOptions = {
          enableRowSelection: true,
          enableRowHeaderSelection: false,
          modifierKeysToMultiSelect:false,
          multiSelect:true,
          noUnselect:true,
        paginationPageSizes: [25, 50, 75],
          enableFiltering:false,
        columnDefs: [
            { field: 'number'},
            { field: 'state'
              //filter:{
                //term:'1',
                //type:uiGridConstants.filter.SELECT,
                //selectOptions:[{value:'1',label:'a'},{value:'2',label:'b'},{value:'3',label:'c'}]

            },
            { field: 'name' },
            { field: 'sex',filter:{
                term:'1',
                type:uiGridConstants.filter.SELECT,
                selectOptions:[{value:'1',label:'male'},{value:'2',label:'female'}]
            },cellFilter:'mapSex',headerCellClass:$scope.highlightFilterHeader},
            //cellFilter:'mapSex',headerCellClass:$scope.highlightFilterHeader},
            { field: 'age',filters:[
                {
                    condition:uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                    placeholder:'>='
                },
                {
                    condition:uiGridConstants.filter.LESS_THAN,
                    placeholder:'<'
                }
            ],headerCellClass: $scope.highlightFilteredHeader },
            { field: 'last_diagnosis' },
            { field: 'diagnosis_time' },
            { field: 'main_doctor' },
          { field: 'Details',
            cellTemplate:'<a href="javascript:void(0)" ng-click="grid.appScope.showMe(row)">更多..</a>'
            
            }
        ]
      };
        $scope.gridOptions.onRegisterApi = function( gridApi ) {
            $scope.gridApi = gridApi;
        };
        Data.getFirData().then(function(response) {
           // console.log('gridApi!');
          //  console.log($scope.gridApi);
           // console.log($scope);

            $scope.gridOptions.data = response;
            response.forEach(function filterChange(row,index){
                row.sex = row.sex==='male'?'1':'2';
            });
            $scope.toggleFiltering=function(){
                $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
                $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN);
            };
            if($scope.gridApi){
          //  $interval(function(){$scope.gridApi.selection.selectRow($scope.gridOptions.data[0]);},0,1);
            };
        });

        // $http.get('data/firGrid.json')
      //    .success(function (data) {
      //      $scope.gridOptions.data = data;
      //    });
    }).filter('mapSex',function(){
        var sexHash={
            1:'male',
            2:'female'
        };
        return function(input){
            if(!input){
                return '';
            }else{
                return sexHash[input];
            }
        }
    });

/*
    function ($scope, Data) {
    var dateRange = ['20040101','20150101'];
    $scope.wait = false;
  	$scope.dataFilter = {
      'date': dateRange,
      'reaction':[],
      'source':[],
      'drugClass':[],
      'indication':[],
      'event':[]
  	};
  	$scope.data = {
      totalCount: 0,
      byField:{
        'date':[],
        'reaction':[],
        'source':[],        
        'drugClass':[],
        'indication':[],
        'event':[]
      }		
  	};



    $scope.loadData = function () {
      $scope.loadCounts();
      $scope.loadTotalCount();     
    };

    $scope.loadCounts = function (exceptField) {
      //for each key in $scope.data we get corresponding results from the Data service
      //(would be nice to do this in only one call to the API, but it's not possible at the moment)
      angular.forEach($scope.data.byField, function(value, key){
        if(key !== exceptField){
          //we ignore filter conditions on the field we are counting, to keep on displaying other values for that field
          var filter = angular.copy($scope.dataFilter);
          if (key !== 'date') {
            delete filter[key];
          } else {
            filter[key] = dateRange;
          }

          Data.getEventData().then(function(response){
            $scope.data.byField['event']=response;
            //console.log("!!!!!!!");
            //console.log($scope.data.byField['event']);
          })

          Data.getCounts(filter, key).then(function (response) {
            console.log("response");
            console.log(response);
            $scope.data.byField[key] = response.results;
          });
        }        
      });
    };

    $scope.loadTotalCount = function () {      
      //get count of all AEs within current filter
      Data.getTotalCount($scope.dataFilter).then(function (response) {
          $scope.data.totalCount = response;          
      });
    };

    $scope.filterChanged = function (field) {
      $scope.loadCounts(field);
      $scope.loadTotalCount();
    };

    //kick off visualizations - the directives will respond to the data change
    $scope.loadData();
console.log($scope);
  });
*/