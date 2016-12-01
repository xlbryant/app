/**
 * Created by think on 2016/11/3.
 */

'use strict';
angular.module('app').controller('AdvReaction2',AdvReaction2 );


    function AdvReaction2($scope,$http) {
    var vm = $scope.vm = {};
    // 供页面中使用的函数
    //$http.get("http://202.117.54.88:9999/adr/getDrug/?q={%22Disease%22:%22%E6%84%9F%E5%86%92%22,%22Pid%22:6}")



    vm.IdForSelect=["1","2","3","4","5","6"];
    vm.PatientId=[];
    vm.items=[];
    vm.Info=[];
    vm.DisplayedItems=[];
    vm.WaitingForDelete=[];

    vm.Select=function(){
        if (vm.value!=null)
        {
            $http.get("http://202.117.54.88:9999/adr/getDrug/?q={%22Disease%22:%22%E6%84%9F%E5%86%92%22,%22Pid%22:"+vm.value+"}"
            )
                .success(function(response){
                    console.log(response);
                    vm.patient=response.Results;
                    console.log(vm.patient);


                    /* for (var i=0;i<vm.Allpatient.length;i++)
                     {
                     vm.PatientId.push(vm.Allpatient[i].Results.PatientInfo);
                     console.log(vm.Allpatient[i]);
                     }

                     vm.click=function(){console.log( vm.value)};*/


                    // 构建模拟数据
                    vm.columns = [

                        {
                            label: '药品名',
                            name: 'name',
                            type: 'string'
                        },
                        {
                            label: '生产厂商',
                            name: 'manufacturer',
                            type: 'string'
                        },
                        {
                            label: '适应症',
                            name: 'indication',
                            type: 'string'
                        },
                        {
                            label: '禁忌',
                            name: 'taboo',
                            type: 'string'
                        },
                        {
                            label: '查看详情',
                            name: 'actions',
                            sortable: false
                        }

                    ];

                    //此函数用于判断是否展示患者信息
                    vm.Display=function()
                    {
                        if(vm.value==null)
                        {return false;}
                        else
                        {return true;}
                    };

                    //此函数用于判断病人的选择




                    //根据选择病人不同，加载不同数据
                    vm.Change=function(){
                        console.log(vm.value);
                        vm.DisplayedItems=[];
                        vm.WaitingForDelete=[];
                        vm.items=vm.patient.Drugs;
                        vm.Info=vm.patient.PatientInfo;};

                    vm.Change();


                        //对条目颜色进行赋值
                        for (var i=0;i<vm.items.length;i++)
                        {
                            if(vm.items[i].Selectable===-1)
                            {vm.items[i].color="#FFB5B5";}
                            else if(vm.items[i].Selectable===0)
                            {vm.items[i].color="#BEBEBE";}
                            else
                            {vm.items[i].color="#ffffff";}
                        }

                        //通过这个过程，对条目增加一个熟悉model，来决定是否出现警告弹窗
                        for (var i=0;i<vm.items.length;i++)
                        {
                            if(vm.items[i].Selectable===1)
                            {vm.items[i].model=null;}
                            else
                            {vm.items[i].model=vm.items[i].Xid;}
                        }

                        console.log(vm.items);


                        //$scope.$apply();

                        //实现全选
                        vm.checkAll = function(checked) {
                            angular.forEach(vm.items, function(item) {
                                item.$checked = checked;
                            });};

                        //对所有安全的可用于替代的药品的全选
                        vm.SafecheckAll = function(checked) {
                            angular.forEach(vm.items, function(item) {
                                item.$Safechecked = checked;
                            });};

                        //展示选择的药品
                        vm.selection = function() {
                            return _.where(vm.items, {$checked: true});
                        };

                        //这个函数用来记录我试图替代哪个药品
                        vm.getIndex=function(line){
                            vm.WaitingForDelete=[];
                            vm.WaitingForDelete.push(line);
                        };

                        //这个函数可以在我确定替代方案后，删除原本的会引起不良反应的药品
                        /* vm.DeleteThis=function(){
                         vm.removeFromList(vm.WaitingForDelete[0]);
                         };*/

                        //这个函数用于格式转换，它将得到的对象数组进行一些处理，包括对selectable的判断，以及条目的查重等
                        vm.Fixed = function(Itemlist,Dislist){
                            for (var i=0;i<Itemlist.length;i++)
                            {
                                var objforDis={};
                                objforDis.Xid=Itemlist[i].Xid;
                                objforDis.Name=Itemlist[i].Name;

                                if(Itemlist[i].Selectable===1)
                                {objforDis.Selectable="安全药品，推荐";
                                    objforDis.color="#003D79";}
                                else if(Itemlist[i].Selectable===0)
                                {objforDis.Selectable="不确定安全性";
                                    objforDis.color="#5B5B5B";}
                                else
                                {objforDis.Selectable="不安全,不推荐";
                                    objforDis.color="#AE0000";}

                                objforDis.Reason=Itemlist[i].Reason;
                                objforDis.Num=1;
                                if(Itemlist[i].Reason===[])
                                { objforDis.Reason="无";}
                                else
                                {objforDis.Reason=Itemlist[i].Reason;}

                                if(Dislist.length===0)
                                {Dislist.push(objforDis);}
                                else{
                                    for(var j=0;j<Dislist.length;j++)
                                    {
                                        if(Dislist[j].Xid!==objforDis.Xid)
                                        {continue;}
                                        else
                                        {Dislist[j].Num++;break;}
                                    }
                                    if (j===Dislist.length)
                                    {Dislist.push(objforDis);}
                                }
                                console.log(Dislist);
                            }};

                        //这个函数是重新生成病人药品清单的，会清除目前的药品清单，重新展示已选择的药品条目
                        /*       vm.Add =function(){
                         vm.DisplayedItems=[];
                         vm.SelectedItems=_.where(vm.items, {$checked: true});
                         angular.forEach(vm.items,function(item){item.$checked = false;});
                         vm.Fixed(vm.SelectedItems,vm.DisplayedItems);
                         console.log(vm.DisplayedItems);
                         console.log(vm.filter.$);
                         };*/

                        //这个函数用来添加这一行药品
                        vm.AddLine=function(line)
                        {
                            vm.Line=[];
                            vm.Line.push(line);
                            vm.Fixed(vm.Line,vm.DisplayedItems);
                        };


                        //这是一个判断函数，决定了是否可以直接将药品加入清单，而不产生弹窗
                        vm.AddAdjust=function(line){
                            vm.Line=[];
                            vm.Line.push(line);
                            if (line.model==null)
                            {vm.Fixed(vm.Line,vm.DisplayedItems);}
                        };
                        //这个函数是仅仅将选择的条目加入到病人药品清单中，而不清除原有的条目，和上面的vm.Add有一点区别
                        /*       vm.JustAdd=function(){
                         vm.SelectedItems=_.where(vm.items, {$checked: true});
                         angular.forEach(vm.items,function(item){item.$checked = false;});
                         vm.Fixed(vm.SelectedItems,vm.DisplayedItems);
                         console.log(vm.DisplayedItems);
                         };*/

                        //删除条目
                        vm.removeFromList = function(line) {
                            vm.DisplayedItems = _.reject(vm.DisplayedItems, function(item){ return line.Xid === item.Xid;});
                        };

                        //这个函数用于展示所有安全的药品
                        vm.WishSub=function()
                        {
                            vm.SafeItems= _.filter(vm.items,function(item){return item.Selectable===1;});
                        };

                        //这个是用于生成替代方案的
                        vm.Switch=function(){
                            vm.SubItems= _.where(vm.SafeItems, {$Safechecked: true});
                            if(vm.SubItems!==[])
                            {angular.forEach(vm.SafeItems,function(item){item.$Safechecked = false;});
                                vm.Fixed(vm.SubItems,vm.DisplayedItems);
                                vm.removeFromList(vm.WaitingForDelete[0]);}
                        };

                        //减少药品数目
                        vm.decrementQuantity=function(line)
                        {line.Num--;
                            if(line.Num===0)
                            {vm.removeFromList(line);}
                        };

                        //增加药品数目
                        vm.incrementQuantity=function(line)
                        {line.Num++;};

                        //确定初始备选药品清单的规格
                        vm.page = {
                            size: 5,
                            index: 1
                        };

                        vm.sort = {
                            column: 'id',
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
                        };});
                    //console.log(vm.items);
                    //console.log(vm.patient);


        }
        else
        {
            vm.filter.$=null;
            vm.items=[];
            vm.Info=[];
            vm.DisplayedItems=[];
            vm.WaitingForDelete=[];
        }
    };

    }



