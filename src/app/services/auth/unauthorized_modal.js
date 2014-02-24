/*
 * Copyright (c) 2014 Mirantis Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

angular.module('sb.services')
    .factory('UnauthorizedModal', function ($modal, $log) {
        'use strict';

        return {
            showUnauthorizedModal: function () {

                var modalInstance = $modal.open(
                    {
                        templateUrl: 'app/templates/auth/unauthorized.html',
                        controller: 'UnauthorizedModalController'
                    }
                );

                modalInstance.result.then(function () {
                    // Do nothing
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            }
        };
    }
);

angular.module('sb.services').controller('UnauthorizedModalController',
    function ($location, $scope, $modalInstance) {
        'use strict';

        $scope.login = function () {
            $location.url('/auth/login').replace();
        };

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };
    });

