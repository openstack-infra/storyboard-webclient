angular.module('sb.services').factory('SubscriptionList',
    function (Subscription, CurrentUser) {
        'use strict';

        //GET list of subscriptions for resource specified
        return {
            subsList: function (resource) {
                return Subscription.browse({
                user_id: CurrentUser.id,
                target_type: resource,
                limit: 100
            });
            }
        };
    });
