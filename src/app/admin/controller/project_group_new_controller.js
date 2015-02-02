/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * New Project Group modal controller.
 */
angular.module('sb.admin').controller('ProjectGroupNewController',
    function ($q, $log, $scope, $modalInstance, ProjectGroup, ProjectGroupItem,
              Project) {
        'use strict';

        /**
         * Flag for the UI to indicate that we're saving.
         *
         * @type {boolean}
         */
        $scope.isSaving = false;

        /**
         * The list of projects.
         *
         * @type {{}[]}
         */
        $scope.projects = [{}];

        /**
         * The new project group.
         *
         * @type {ProjectGroup}
         */
        $scope.projectGroup = new ProjectGroup();

        /**
         * Project typeahead search method.
         */
        $scope.searchProjects = function (value) {
            var deferred = $q.defer();
            Project.browse({name: value, limit: 10},
                function (results) {
                    // Dedupe the results.
                    var idxList = [];
                    for (var i = 0; i < $scope.projects.length; i++) {
                        var project = $scope.projects[i];
                        if (!!project) {
                            idxList.push(project.id);
                        }
                    }

                    for (var j = results.length - 1; j >= 0; j--) {
                        var resultId = results[j].id;
                        if (idxList.indexOf(resultId) > -1) {
                            results.splice(j, 1);
                        }
                    }

                    deferred.resolve(results);
                },
                function (error) {
                    $log.error(error);
                    deferred.resolve([]);
                });
            return deferred.promise;
        };

        /**
         * Formats the project name.
         */
        $scope.formatProjectName = function (model) {
            if (!!model) {
                return model.name;
            }
            return '';
        };

        /**
         * Add project.
         */
        $scope.addProject = function () {
            $scope.projects.push({});
        };

        /**
         * Insert item into the project list.
         */
        $scope.selectNewProject = function (index, model) {
            // Put our model into the array
            $scope.projects[index] = model;
        };

        /**
         * Remove a project from the list.
         */
        $scope.removeProject = function (index) {
            $scope.projects.splice(index, 1);
        };

        /**
         * Saves the project group
         */
        $scope.save = function () {
            $scope.isSaving = true;

            // Create a new project group
            $scope.projectGroup.$save(function (projectGroup) {
                var promises = [];
                $scope.projects.forEach(
                    function (project) {
                        // Get a deferred promise...
                        var deferred = $q.defer();

                        // Construct the item.
                        var item = new ProjectGroupItem({
                            id: project.id,
                            projectGroupId: projectGroup.id
                        });

                        // Create the item.
                        item.$create(function (result) {
                                deferred.resolve(result);
                            },
                            function (error) {
                                deferred.reject(error);
                            }
                        );

                        promises.push(deferred.promise);
                    }
                );

                // Wait for all the promises to finish.
                $q.all(promises).then(function () {
                    $modalInstance.close(projectGroup);
                }, function (error) {
                    $log.error(error);
                    $modalInstance.dismiss(error);
                });


            }, function (error) {
                $scope.isSaving = false;
                $log.error(error);
            });
        };

        /**
         * Close this modal without saving.
         */
        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };

        /**
         * Check that we have valid projects on the list
         */
        $scope.checkValidProjects = function() {
            if ($scope.projects.length === 0) {
                return false;
            }

            // check if projects contain a valid project_id
            for (var i = 0; i < $scope.projects.length ; i++) {
                var project = $scope.projects[i];
                if ( !project.id ) {
                    return false;
                }
            }
            return true;
        };

    });
