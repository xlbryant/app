'use strict';
angular.module('app')
    .run(
        [
            '$rootScope', '$state', '$stateParams',
            function($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
                // console.log($rootScope);
            }
        ]
    )
    .config(
        [
            '$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {

                $urlRouterProvider
                    .otherwise('/app/mkdisease');
                $stateProvider
                    .state('app', {
                        abstract: true,
                        url: '/app',
                        templateUrl: 'views/layout.html'
                    })
                    .state('app.knowledgeGraph', {
                        url: '/knowledgeGraph',
                        template:"<network-graph></network-graph>",
                        ncyBreadcrumb: {
                            label: '知识图谱',
                            description: ''
                        }
                    })
                    .state('app.patientClinicalPathway', {
                        url: '/patientClinicalPathway',
                        templateUrl:'views/tpl/patientClinicalPathway.html',
                        ncyBreadcrumb: {
                            label: '患者信息展示',
                            description: ''
                        }
                    })
                    .state('app.similarPatientsDia', {
                        url: '/similarPatientsDia',
                        templateUrl:'views/tpl/similarPatientsDia.html',
                        ncyBreadcrumb: {
                            label: '相似患者诊断分析',
                            description: ''
                        }
                    })
                    .state('app.similarPatientsMed', {
                        url: '/similarPatientsMed',
                        templateUrl:'views/tpl/similarPatientsMed.html',
                        ncyBreadcrumb: {
                            label: '相似患者用药分析',
                            description: ''
                        }
                    })
                    .state('app.diseaseCause', {
                        url: '/diseaseCause',
                        templateUrl:'views/tpl/diseaseCause.html',
                        ncyBreadcrumb: {
                            label: '疾病风险预测',
                            description: ''
                        }
                    })
                    .state('app.mkdisease', {
                        url: '/mkdisease',
                        templateUrl:'views/tpl/medicalKnowledge.html',
                        ncyBreadcrumb: {
                            label: '疾病',
                            description: ''
                        }
                    })
                    .state('app.mksymptom', {
                        url: '/mksymptom',
                        templateUrl:'views/tpl/medicalKnowledge.html',
                        ncyBreadcrumb: {
                            label: '症状',
                            description: ''
                        }
                    })
                    .state('app.mkmedication', {
                        url: '/mkmedication',
                        templateUrl:'views/tpl/medicalKnowledge.html',
                        ncyBreadcrumb: {
                            label: '药品',
                            description: ''
                        }
                    })
                    .state('app.mklab', {
                        url: '/mklab',
                        templateUrl:'views/tpl/medicalKnowledge.html',
                        ncyBreadcrumb: {
                            label: '辅助检查',
                            description: ''
                        }
                    })
                    .state('app.mkmedicare', {
                        url: '/mkmedicare',
                        templateUrl:'views/tpl/medicalKnowledge.html',
                        ncyBreadcrumb: {
                            label: '医保药品',
                            description: ''
                        }
                    })
                    .state('app.mkclinicalpathway', {
                        url: '/mkclinicalpathway',
                        templateUrl:'views/tpl/medicalKnowledge.html',
                        ncyBreadcrumb: {
                            label: '临床路径',
                            description: ''
                        }
                    })
                    .state('app.mkevidence', {
                        url: '/mkevidence',
                        templateUrl:'views/tpl/medicalKnowledge.html',
                        ncyBreadcrumb: {
                            label: '循证医学',
                            description: ''
                        }
                    })
                    .state('app.mkresearch', {
                        url: '/mkresearch',
                        templateUrl:'views/tpl/medicalKnowledge.html',
                        ncyBreadcrumb: {
                            label: '疾病研究',
                            description: ''
                        }
                    })
                    .state('app.mkclinicalg', {
                        url: '/mkclinicalg',
                        templateUrl:'views/tpl/medicalKnowledge.html',
                        ncyBreadcrumb: {
                            label: '临床指南',
                            description: ''
                        }
                    })
                    .state('app.mkvideo', {
                        url: '/mkvideo',
                        templateUrl:'views/tpl/medicalKnowledge.html',
                        ncyBreadcrumb: {
                            label: '视频库',
                            description: ''
                        }
                    })
                    .state('app.mkotherres', {
                        url: '/mkotherres',
                        templateUrl:'views/tpl/medicalKnowledge.html',
                        ncyBreadcrumb: {
                            label: '其他资源',
                            description: ''
                        }
                    })
                    .state('app.traditionalSyndrome',{
                        url: '/mktraditionalSyndrome',
                        templateUrl:'views/tpl/bianzhenglunzhi.html',
                        controller: "traditionalSyndromeController",
                        ncyBreadcrumb: {
                            label:'辨证论治',
                            description:''
                        }
                    })
                    .state('app.traditionalSyndromeList',{
                        url: '/mktraditionalSyndromeList/:class2&:class3&:class4',
                        templateUrl:'views/tpl/traditionalSearchList.html',
                        controller: "traditionalSyndromeListController",
                        ncyBreadcrumb: {
                            label:'辨证论治列表',
                            description:''
                        }
                    })
                    .state('app.traditionalTuinan',{
                        url: '/mktraditionalTuinan',
                        templateUrl:'views/tpl/traditionalTuinan.html',
                        controller:'traditionalTuinanController',
                        ncyBreadcrumb: {
                            label:'针灸推拿',
                            description:''
                        }
                    })
                    .state('app.traditionalTuinanList',{
                        url: '/mktraditionalTuinanList/:class1&:class2&:class3&:class4&:class5',
                        templateUrl:'views/tpl/traditionalSearchList.html',
                        controller:'traditionalTuinanListController',
                        ncyBreadcrumb: {
                            label:'针灸推拿列表',
                            description:''
                        }
                    })
                    .state('app.traditionalShiliao',{
                        url: '/mktraditionalShiliao',
                        templateUrl:'views/tpl/traditionalShiliao.html',
                        controller:"traditionalShiliaoController",
                        ncyBreadcrumb: {
                            label:'药膳食疗',
                            description:''
                        }
                    })
                    .state('app.traditionalShiliaoList',{
                        url: '/mktraditionalShiliaoList/:class1&:class2&:class3&:class4&:class5',
                        templateUrl:'views/tpl/traditionalSearchList.html',
                        controller:"traditionalShiliaoListController",
                        ncyBreadcrumb: {
                            label:'药膳食疗列表',
                            description:''
                        }
                    })
                    .state('app.traditionalSearch',{
                        url: '/mktraditionalSearch',
                        templateUrl:'views/tpl/traditionalSearch.html',
                        controller: "traditionalSearchController",
                        ncyBreadcrumb: {
                            label:'中药检索',
                            description:''
                        }
                    })
                    .state('app.traditionalSearchList',{
                        url: '/mktraditionalSearchList/:class2&:class3',
                        templateUrl:'views/tpl/traditionalSearchList.html',
                        controller: "traditionalSearchListController",
                        ncyBreadcrumb: {
                            label:'中药检索列表',
                            description:''
                        }
                    })
                    .state('app.cohortComparsion',{
                        url: '/cohortComparsion/',
                        templateUrl:'views/tpl/cohortComparsion.html',
                        controller: "cohortComparsionController",
                        ncyBreadcrumb: {
                            label:'cohort comparsion',
                            description:''
                        }
                    })
                    .state('app.details',{
                        url: '/details/:zid',
                        templateUrl:'views/tpl/myModalContent.html',
                        controller: "ModalInstanceCtrl",
                        ncyBreadcrumb: {
                            label:'details',
                            description:''
                        }
                    })
                    .state('app.clinicPath', {
                        url: '/clinicPath',
                        templateUrl: 'views/tpl/clinicPath.html',
                        ncyBreadcrumb: {
                            label: '临床路径比较',
                            description: ''
                        }
                    })
                    .state('app.medcareFee', {
                        url: '/medcareFee',
                        templateUrl: 'views/tpl/medcareFee.html',
                        ncyBreadcrumb: {
                            label: '医保控费',
                            description: ''
                        }
                    })
                    .state('app.AdvReaction1', {
                        url: '/AdvReaction_1',
                        templateUrl: 'views/tpl/AdvReaction_1.html',
                        ncyBreadcrumb: {
                            label: '不良反应信息查询',
                            description: ''
                        }
                    })
                    .state('app.AdvReaction2', {
                        url: '/AdvReaction_2',
                        templateUrl: 'views/tpl/AdvReaction_2.html',
                        ncyBreadcrumb: {
                            label: '患者不良反应信息',
                            description: ''
                        }
                    })
            }
        ]
    );