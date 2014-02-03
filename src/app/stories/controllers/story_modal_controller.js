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
 * Controller for the "new story" modal popup.
 */
angular.module('sb.story').controller('StoryModalController',
    function ($scope, $modalInstance, params, Project, Story) {
        'use strict';

        $scope.story = new Story();
        $scope.project = null;
        $scope.projects = Project.query({},
            function (results) {
                if (params.projectId !== null) {
                    for (var i = 0; i < results.length; i++) {
                        var project = results[i];
                        if (project.id === params.projectId) {
                            $scope.project = project;
                            return;
                        }
                    }
                }
            });

        $scope.save = function () {
            $scope.story.project = $scope.project.id;
            $scope.story.$create(function () {
                $modalInstance.dismiss('success');
            });
        };

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };
    });
