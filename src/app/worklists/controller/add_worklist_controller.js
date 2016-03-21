/*
 * Copyright (c) 2015-2016 Codethink Limited
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
 * Controller for the "new worklist" modal popup.
 */
angular.module('sb.worklist').controller('AddWorklistController',
    function ($scope, $modalInstance, $state, params, Worklist) {
        'use strict';

        var blankFilter = {
            type: 'Story',
            filter_criteria: [{
                negative: false,
                field: null,
                value: null,
                title: null
            }]
        };

        /**
         * Saves the worklist.
         */
        $scope.save = function () {
            $scope.isSaving = true;
            $scope.worklist.$create(
                function (result) {
                    $scope.isSaving = false;
                    $modalInstance.dismiss('success');
                    $state.go('sb.worklist.detail', {worklistID: result.id});
                }
            );
        };

        /**
         * Close this modal without saving.
         */
        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.setType = function(type) {
            $scope.newFilter.type = type;
            $scope.resourceTypes = [type];
            $scope.$broadcast('refresh-types');
        };

        $scope.setCriterion = function(criterion, tag) {
            criterion.field = tag.type;
            criterion.value = tag.value.toString();
            criterion.title = tag.title;
        };

        $scope.addCriterion = function(filter) {
            filter.filter_criteria.push({
                negative: false,
                field: null,
                value: null,
                title: null
            });
        };

        $scope.removeTag = function(criterion) {
            if ($scope.newFilter.filter_criteria.length > 1) {
                var idx = $scope.newFilter.filter_criteria.indexOf(criterion);
                $scope.newFilter.filter_criteria.splice(idx, 1);
            } else {
                criterion.field = null;
                criterion.value = null;
                criterion.title = null;
            }
        };

        $scope.checkNewFilter = function() {
            var valid = true;
            angular.forEach(
                $scope.newFilter.filter_criteria,
                function(criterion) {
                    if (criterion.field == null ||
                        criterion.value == null ||
                        criterion.title == null) {
                        valid = false;
                    }
                }
            );
            return valid;
        };

        $scope.remove = function(filter) {
            var idx = $scope.worklist.criteria.indexOf(filter);
            $scope.worklist.criteria.splice(idx, 1);
        };

        $scope.saveNewFilter = function() {
            var added = angular.copy($scope.newFilter);
            $scope.worklist.filters.push(added);
            $scope.showAddFilter = false;
            $scope.newFilter = angular.copy(blankFilter);
        };

        $scope.isSaving = false;
        $scope.worklist = new Worklist({title: '', filters: []});
        $scope.resourceTypes = ['Story'];
        $scope.showAddFilter = true;
        $scope.newFilter = angular.copy(blankFilter);
    });
