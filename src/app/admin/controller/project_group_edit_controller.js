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
 * New Project Group edit controller.
 */
angular.module('sb.admin').controller('ProjectGroupEditController',
    function ($q, $log, $scope, $state, projectGroup, projects, Project,
              ProjectGroupItem, ArrayUtil) {
        'use strict';

        /**
         * The project group we're editing. Resolved by the route.
         */
        $scope.projectGroup = projectGroup;

        /**
         * The list of projects in this group (Resolved by the route).
         */
        $scope.projects = projects;

        /**
         * A collection of all project ID's that have been loaded on
         * initialization. This list is used to determine the project member
         * diff.
         */
        var loadedIds = [];
        $scope.projects.forEach(function (project) {
            loadedIds.push(project.id);
        });

        /**
         * UI flag, are we saving?
         *
         * @type {boolean}
         */
        $scope.isSaving = false;

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
         * Remove a project from the list
         */
        $scope.removeProject = function (index) {
            $scope.projects.splice(index, 1);
        };

        /**
         * Save the project and the associated groups
         */
        $scope.save = function () {
            $scope.isSaving = true;

            var promises = [];

            // Get the desired ID's.
            var desiredIds = [];
            $scope.projects.forEach(function (project) {
                desiredIds.push(project.id);
            });

            // Intersect loaded vs. current to get a list of project
            // reference to delete.
            var idsToDelete = ArrayUtil.difference(loadedIds, desiredIds);
            idsToDelete.forEach(function (id) {

                // Get a deferred promise...
                var deferred = $q.defer();

                // Construct the item.
                var item = new ProjectGroupItem({
                    id: id,
                    projectGroupId: projectGroup.id
                });

                // Delete the item.
                item.$delete(function (result) {
                        deferred.resolve(result);
                    },
                    function (error) {
                        deferred.reject(error);
                    }
                );

                promises.push(deferred.promise);
            });

            // Intersect current vs. loaded to get a list of project
            // reference to delete.
            var idsToAdd = ArrayUtil.difference(desiredIds, loadedIds);
            idsToAdd.forEach(function (id) {

                // Get a deferred promise...
                var deferred = $q.defer();

                // Construct the item.
                var item = new ProjectGroupItem({
                    id: id,
                    projectGroupId: projectGroup.id
                });

                // Delete the item.
                item.$create(function (result) {
                        deferred.resolve(result);
                    },
                    function (error) {
                        deferred.reject(error);
                    }
                );

                promises.push(deferred.promise);
            });


            // Save the project group itself.
            var deferred = $q.defer();
            promises.push(deferred.promise);
            $scope.projectGroup.$update(function (success) {
                deferred.resolve(success);
            }, function (error) {
                $log.error(error);
                deferred.reject(error);
            });

            // Roll all the promises into one big happy promise.
            $q.all(promises).then(
                function () {
                    $state.go('admin.project_group', {});
                },
                function (error) {
                    $log.error(error);
                }
            );
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
    });