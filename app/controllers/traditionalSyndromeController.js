"use strict";
angular.module("app")
  .controller("traditionalSyndromeController",["$scope","$rootScope","traMedical",
    "$state",function($scope,$rootScope,traMedical,$state){
  	console.log("traditionalSyndromeController start!!!");
  	$scope.name = "辨证论治";
  	$scope.medicalTree = {};
  	$scope.traSearchTree ={};
    $rootScope.pageLoading = true;
  	traMedical.getAllList().then(function(res) {
        $rootScope.pageLoading = false;
  			$scope.medicalTree  = res["Results"]["Main"];
  			$scope.traSearchTree = $scope.medicalTree["辨证论治"];
  			console.log($scope.traSearchTree);
  		});
  	$scope.showlevel4 = function(class2,class3,class4){
  		$state.go("app.traditionalSyndromeList",{"class2":class2,"class3":class3,"class4":class4});
  	};
}])
  .controller("traditionalSyndromeListController",["$scope","$rootScope","traMedical","$stateParams",function($scope,$rootScope,traMedical,$stateParams){
  	console.log("traditionalSyndromeListController start!!!");
    console.log($rootScope.bianzheng);
    $rootScope.bianzheng = "active";
    console.log($rootScope.bianzheng);
    $rootScope.pageLoading = true;
    $scope.class1 = "辨证论治";
    $scope.class2 = $stateParams.class2;
    $scope.class3 = $stateParams.class3;
    $scope.class4 = $stateParams.class4;
  	$scope.tableData = [];
	    $scope.gridOptions = { 
		        data: "tableData",
		        enableCellSelection: false,
		        columnDefs: [{field: "Zid", displayName: "ID"}, 
                     {field:"Name", displayName:"名称"},
                     {field:"Class1", displayName:"一级类别"},
                     {field:"Class2", displayName:"二级类别"},
                     {field:"Class3", displayName:"三级类别"}]

	    }; 
	$scope.gridOptions.afterSelectionChange= function(rowItem, event){
		traMedical.getDetails(rowItem.entity.Zid).then(function(res){
			$rootScope.pageLoading = false;
			// console.log(res);
			$scope.datails = res.Results.Main;
			$scope.Name = res.Results.Name;
			// console.log($scope.datails);
			// console.log($("#myModal"));
			$("#myModal").modal("show");
		});
      /*ngDialog.open(
        { 
         template: "views/tpl/myModalContent.html",
         className: "ngdialog-theme-default",
         width: "70%",
         height:700,
         controller: function($scope, $location, $anchorScroll){
            traMedical.getDetails(rowItem.entity.Zid).then(function(res){
               $rootScope.pageLoading = false;
               $scope.datails = res.Results.Main;
               $scope.Name = res.Results.Name;
            });
             //点击左侧导航的页面锚定
            $scope.scrollto = function(id) {
                console.log(id);
                $location.hash(id);
                $anchorScroll();
            };
         }
       });*/
	    };
  	traMedical.getZhongyilist("辨证论治",$stateParams.class2,$stateParams.class3,
      $stateParams.class4,"").then(function(res){
      console.log(res);
      $rootScope.pageLoading = false;
  		if(res.Results!=="" && res.Results!==undefined){
  			for(var i in res.Results) {
  				var data = {};
  				//console.log(res.Results[i]);
  				data["Zid"] = res.Results[i][0].Zid;
  				data["Name"] = res.Results[i][1].Name;
  				data["Class1"] = res.Results[i][2].Class1;
  				data["Class2"] = res.Results[i][3].Class2;
  				data["Class3"] = res.Results[i][4].Class3;
  				$scope.tableData.push(data);
  			}
  		}
  		else {
  			console.log("get data failer");
  		}
  	});
  }]);