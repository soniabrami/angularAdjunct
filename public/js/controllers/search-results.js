'use strict';

angular.module('adjunct.controllers')
    .controller('SearchResultsCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
        $scope.users = [];
        $scope.user = {};

        var searchTerm = $('#searchTerm').html();
        var all = $('#all').html();

        if (!searchTerm && !all) {
            return;
        }

        var url = all ? '/api/searchAll' : '/api/search';
        $http.post(url, JSON.stringify({'query': searchTerm})).then(function(response){
            if (response.data) {
                $scope.users = _.map(response.data.hits.hits, function(user) {
                    angular.extend(user, user._source);
                    return user;
                });

                $http.get('/api/institutions').then(function(response) {
                    var selected = $filter('filter')(response.data, {id: $scope.user.institution});
                    $scope.user.institutionName = selected && selected.length ? selected[0].text : null;
                });

                $http.get('/api/countries').then(function(response) {
                    var selected = $filter('filter')(response.data, {id: $scope.user.country});
                    $scope.user.countryName = selected && selected.length ? selected[0].text : null;
                });
            }
            else {
                $scope.message = "Search server is unreachable";
            }
        });
    }]);