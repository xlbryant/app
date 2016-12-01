"use strict";

angular.module("app").controller("traditionalSearchController",["traMedical","$scope","$rootScope","$state",function(
	traMedical,$scope,$rootScope,$state){
		console.log("traditionalSearchController start!!!");
		$scope.name = "中药检索";
		$scope.medicalTree = {};
		$scope.traSearchTree ={};
    $rootScope.pageLoading = true;
		traMedical.getAllList().then(function(res) {
			$scope.medicalTree  = res["Results"]["Main"];
			$scope.traSearchTree = $scope.medicalTree["中药检索"];
      $rootScope.pageLoading = false;
		});
		$scope.showlevel3 = function (class2,class3) {
			//console.log(names);
			$state.go("app.traditionalSearchList",{"class2":class2,"class3":class3});
		};
}])
  .controller("traditionalSearchListController",["$scope","$rootScope","traMedical","$stateParams",
   function($scope, $rootScope,traMedical,$stateParams){
  		console.log("traditionalSearchListController!!!");
      $scope.class1 = "中药检索";
  		$scope.class3 = $stateParams.class3;
  		$scope.class2 = $stateParams.class2;
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
			console.log(rowItem);
			console.log(event);
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
      $rootScope.pageLoading = true;
  		traMedical.getZhongyilist("中药检索",$scope.class2,$scope.class3,"","").then(function(res) {
        $rootScope.pageLoading = false;
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
  			//console.log($scope.tableData);  
  		});
  }]);
