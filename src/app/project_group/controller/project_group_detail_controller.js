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
 * Project group detail controller, for general user use of project groups.
 * From a feature standpoint this really just means viewing the group, member
 * projects, and any stories that belong under this project group.
 */
angular.module('sb.project_group').controller('ProjectGroupDetailController',
    function ($scope, $stateParams, projectGroup, Story, Project,
              Preference, SubscriptionList, CurrentUser, Subscription,
              $q, ProjectGroupItem, ArrayUtil, $log) {
        'use strict';

        var projectPageSize = Preference.get(
            'project_group_detail_projects_page_size') || 0;
        var storyPageSize = Preference.get(
            'project_group_detail_stories_page_size') || 0;

        /**
         * The project group we're viewing right now.
         *
         * @type ProjectGroup
         */
        $scope.projectGroup = projectGroup;

        /**
         * The list of projects in this group
         *
         * @type [Project]
         */
        $scope.projects = [];
        $scope.isSearchingProjects = false;

        $scope.editMode = false;

        $scope.toggleEdit = function() {
            $scope.editMode = !$scope.editMode;
        };

        /**
         * List the projects in this Project Group
         */
        $scope.listProjects = function () {
            $scope.isSearchingProjects = true;
            Project.browse({
                    project_group_id: projectGroup.id,
                    offset: $scope.projectSearchOffset,
                    limit: projectPageSize,
                    sort_dir: 'desc'
                },
                function (result, headers) {
                    // Successful search results, apply the results to the
                    // scope and unset our progress flag.
                    $scope.projectCount =
                        parseInt(headers('X-Total')) || result.length;
                    $scope.projectSearchOffset =
                        parseInt(headers('X-Offset')) || 0;
                    $scope.projectSearchLimit =
                        parseInt(headers('X-Limit')) || 0;
                    $scope.projects = result;
                    $scope.isSearchingProjects = false;
                },
                function (error) {
                    // Error search results, show the error in the UI and
                    // unset our progress flag.
                    $scope.error = error;
                    $scope.isSearchingProjects = false;
                }
            );
        };

        /**
         * The list of stories in this project group
         *
         * @type [Story]
         */
        $scope.stories = [];

        /**
         * Filter the stories.
         */
        $scope.showActive = true;
        $scope.showMerged = false;
        $scope.showInvalid = false;

        /**
         * Reload the stories in this view based on user selected filters.
         */
        $scope.filterStories = function (A, M, I) {
            var status = [];
            if (A){
                status.push('active');
            }
            if (M){
                status.push('merged');
            }
            if (I){
                status.push('invalid');
            }

            // If we're asking for nothing, just return a [];
            if (status.length === 0) {
                $scope.stories = [];
                return;
            }

            Story.browse({
                    project_group_id: projectGroup.id,
                    sort_field: 'id',
                    sort_dir: 'desc',
                    status: status,
                    offset: $scope.storySearchOffset,
                    limit: storyPageSize
                },
                function (result, headers) {
                    // Successful search results, apply the results to the
                    // scope and unset our progress flag.
                    $scope.storyCount =
                        parseInt(headers('X-Total')) || result.length;
                    $scope.storySearchOffset =
                        parseInt(headers('X-Offset')) || 0;
                    $scope.storySearchLimit =
                        parseInt(headers('X-Limit')) || 0;
                    $scope.stories = result;
                    $scope.isSearchingStories = false;
                },
                function (error) {
                    // Error search results, show the error in the UI and
                    // unset our progress flag.
                    $scope.error = error;
                    $scope.isSearchingStories = false;
                }
            );
        };

        /**
         * Filter stories once initially to show Active stories
         */
        $scope.filterStories(true, false, false);

        /**
         * Next page of the results.
         *
         * @param type The name of the result set to be paged,
         * expects 'stories' or 'projects'.
         */
        $scope.nextPage = function (type) {
            if (type === 'stories') {
                $scope.storySearchOffset += storyPageSize;
                $scope.filterStories();
            } else if (type === 'projects') {
                $scope.projectSearchOffset += projectPageSize;
                $scope.listProjects();
            }
        };

        /**
         * Previous page of the results.
         *
         * @param type The name of the result set to be paged,
         * expects 'stories' or 'projects'.
         */
        $scope.previousPage = function (type) {
            if (type === 'stories') {
                $scope.storySearchOffset -= storyPageSize;
                if ($scope.storySearchOffset < 0) {
                    $scope.storySearchOffset = 0;
                }
                $scope.filterStories();
            } else if (type === 'projects') {
                $scope.projectSearchOffset -= projectPageSize;
                if ($scope.projectSearchOffset < 0) {
                    $scope.projectSearchOffset = 0;
                }
                $scope.listProjects();
            }
        };

        /**
         * Update the page size preference and re-search.
         *
         * @param type The name of the result set to change the page
         * size for, expects 'stories' or 'projects'.
         * @param value The value to set the page size preference to.
         */
        $scope.updatePageSize = function (type, value) {
            if (type === 'stories') {
                Preference.set(
                    'project_group_detail_stories_page_size', value).then(
                        function () {
                            storyPageSize = value;
                            $scope.filterStories();
                        }
                    );
            } else if (type === 'projects') {
                Preference.set(
                    'project_group_detail_projects_page_size', value).then(
                        function () {
                            projectPageSize = value;
                            $scope.listProjects();
                        }
                    );
            }
        };


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

            ProjectGroupItem.browse({projectGroupId: $scope.projectGroup.id},
                function(results) {
                    var loadedIds = [];
                    results.forEach(function (project) {
                        loadedIds.push(project.id);
                    });
                    var promises = [];

                    // Get the desired ID's.
                    var desiredIds = [];
                    $scope.projects.forEach(function (project) {
                        desiredIds.push(project.id);
                    });

                    // Intersect loaded vs. current to get a list of project
                    // reference to delete.
                    var idsToDelete = ArrayUtil.difference(
                        loadedIds, desiredIds);
                    idsToDelete.forEach(function (id) {

                        // Get a deferred promise...
                        var removeProjectDeferred = $q.defer();

                        // Construct the item.
                        var item = new ProjectGroupItem({
                            id: id,
                            projectGroupId: projectGroup.id
                        });

                        // Delete the item.
                        item.$delete(function (result) {
                                removeProjectDeferred.resolve(result);
                            },
                            function (error) {
                                removeProjectDeferred.reject(error);
                            }
                        );

                        promises.push(removeProjectDeferred.promise);
                    });

                    // Intersect current vs. loaded to get a list of project
                    // reference to add.
                    var idsToAdd = ArrayUtil.difference(desiredIds, loadedIds);
                    idsToAdd.forEach(function (id) {

                        // Get a deferred promise...
                        var addProjectDeferred = $q.defer();

                        // Construct the item.
                        var item = new ProjectGroupItem({
                            id: id,
                            projectGroupId: projectGroup.id
                        });

                        // Delete the item.
                        item.$create(function (result) {
                                addProjectDeferred.resolve(result);
                            },
                            function (error) {
                                addProjectDeferred.reject(error);
                            }
                        );

                        promises.push(addProjectDeferred.promise);
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
                            $scope.editMode = false;
                            $scope.isSaving = false;
                        },
                        function (error) {
                            $log.error(error);
                        }
                    );
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

        /**
         * Check that we have valid projects on the list
         */
        $scope.checkValidProjects = function () {
            if ($scope.projects.length === 0) {
                return false;
            }

            // check if projects contain a valid project_id
            for (var i = 0; i < $scope.projects.length; i++) {
                var project = $scope.projects[i];
                if (!project.id) {
                    return false;
                }
            }
            return true;
        };


        $scope.listProjects();
        $scope.filterStories();

        //GET subscriptions
        var cuPromise = CurrentUser.resolve();

        $scope.resolvedUser = false;
        cuPromise.then(function(user){
            $scope.projectSubscriptions = SubscriptionList.subsList(
                'project', user);
            $scope.storySubscriptions = SubscriptionList.subsList(
                'story', user);
            $scope.projectGroupSubscription = Subscription.browse({
                target_type: 'project_group',
                target_id: $scope.projectGroup.id,
                user_id: user.id
            });
            $scope.resolvedUser = true;
        });
    });
