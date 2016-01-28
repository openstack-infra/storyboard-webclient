/*
 * Copyright (c) 2015 Codethink Limited
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
 * A service to help with use of a kanban board.
 */
angular.module('sb.board').factory('BoardHelper',
    function($document, $window, Worklist) {
        'use strict';

        /**
         * Return a function which scrolls the element with id="elementID"
         * horizontally when an as-sortable-item is being dragged to the left
         * or right.
         */
        function scrollFunction(elementID) {
            return function(itemPosition, containment, eventObj) {
                if (eventObj) {
                    var container = document.getElementById(elementID);
                    var offsetX = ($window.pageXOffset ||
                                   $document[0].documentElement.scrollLeft);
                    var targetX = eventObj.pageX - offsetX;

                    var leftBound = container.clientLeft + container.offsetLeft;
                    var parent = container.offsetParent;
                    while (parent) {
                        leftBound += parent.offsetLeft;
                        parent = parent.offsetParent;
                    }

                    var rightBound = leftBound + container.clientWidth;

                    if (targetX < leftBound) {
                        container.scrollLeft -= 10;
                    } else if (targetX > rightBound) {
                        container.scrollLeft += 10;
                    }
                }
            };
        }

        /**
         * ng-sortable callback for orderChanged and itemMoved events.
         *
         * This is called when a card has changed position or moved between
         * two different lanes. It updates the WorklistItem which represents
         * the card.
         */
        function moveCard(result) {
            var list = result.dest.sortableScope.$parent.lane.worklist;
            var position = result.dest.index;
            var item = list.items[position];

            item.list_position = position;
            Worklist.ItemsController.update({
                id: list.id,
                item_id: item.id,
                list_position: item.list_position,
                list_id: list.id
            });
        }

        return {
            maybeScrollContainer: scrollFunction,
            moveCard: moveCard
        };
    }
);
