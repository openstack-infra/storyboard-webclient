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
angular.module('sb.worklist').controller('WorklistEditController',
    function ($scope, $modalInstance, $state, worklist, board, Worklist, $q) {
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
            Worklist.update($scope.worklist, function (result) {
                $scope.isSaving = false;
                $modalInstance.dismiss('success');
            });
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
            var idx = $scope.worklist.filters.indexOf(filter);
            Worklist.Filters.delete({
                id: $scope.worklist.id,
                filter_id: filter.id
            });
            $scope.worklist.filters.splice(idx, 1);
        };

        $scope.saveNewFilter = function() {
            var added = angular.copy($scope.newFilter);
            Worklist.Filters.create(
                {id: $scope.worklist.id}, added, function(result) {
                    $scope.worklist.filters.push(result);
                }
            );
            $scope.showAddFilter = false;
            $scope.newFilter = angular.copy(blankFilter);
        };

        $scope.isSaving = false;
        $scope.worklist = worklist;
        $scope.resourceTypes = ['Story'];
        $scope.showAddFilter = false;
        $scope.newFilter = angular.copy(blankFilter);
        $scope.modalTitle = 'Edit Worklist';
    });
