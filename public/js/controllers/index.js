'use strict';

angular.module('adjunct.controllers')
    .controller('IndexCtrl', ['$scope', '$http', '$cookies', '$popover', function ($scope, $http, $cookies, $popover) {
        $('.navbar-collapse ul li:not(.navigation-dropdown) a').click(function(){
            console.log('hello!!');
            $('.navbar-toggle:visible').click();
        });

        $scope.isSignedIn = $cookies._id != null;
        $scope.signinPopover = {title: 'Title', content: 'Hello Popover<br />This is a multiline message!'};

        if ($scope.isSignedIn) {
            $http.get('/api/get-adjuncts-profile/' + $cookies._id).then(function(response) { $scope.user = response.data; });
        }

        $scope.signout = function() {
            window.location.replace('/signout');
        }

        $scope.index = 0;

        $scope.profileDropdown = [
            {
                "text": "Edit Profile",
                "href": "/profile"
            },
            {
                "text": "Saved Jobs",
                "href": "/profile/saved-jobs"
            }
        ];

        $scope.jobsDropdown = [
            {
                "text": "View jobs",
                "href": "/jobs"
            },
            {
                "text": "Post a new job",
                "href": "/job-profile/add"
            },
            {
                "text": "View institutions",
                "href": "/institutions-profile"
            }

        ];

        $scope.openSignInModal = function () {
            if(!$scope.isSignedIn){
                $('#signin-modal').modal();
                $('.modal-backdrop').css({'background-color': '', 'opacity': '0'});
            }
        }

        $scope.openSignUpModal = function () {
                $('#signup-modal').modal();
                $('.modal-backdrop').css({'background-color': '#8b8bac', 'opacity': '0'});
        }
    }]);