/**
 * Created by Wemakefocus on 2016/10/13.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .filter('paging', paging);

    function paging() {
        return function (items, index, pageSize) {
            if (!items){
                return [];
            }
            var offset = (index - 1) * pageSize;
            var t = items.slice(offset, offset + pageSize);
            // console.log(t);
            return t;
        }
    }

})();

