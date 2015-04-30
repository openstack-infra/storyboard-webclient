/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * A service that may be used to show a 'Please Contribute' modal.
 */
angular.module('sb.util').factory('ContributeModal',
    function ($modal, $sce) {
        'use strict';

        return {

            /**
             * Display the contributor modal with a provided message.
             */
            show: function (message) {
                $modal.open({
                    templateUrl: 'app/util/template/contribute.html',
                    controller: function ($modalInstance, $scope) {
                        $scope.message = $sce.trustAsHtml(message);
                        $scope.close = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    }
                });
            }
        };
    });
