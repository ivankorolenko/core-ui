/**
 * Developer: Stepan Burguchev
 * Date: 5/22/2015
 * Copyright: 2009-2015 ComindwareŽ
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Comindware
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* global define, require, Handlebars, Backbone, Marionette, $, _ */

define([
        './comparators',
        './helpers',
        './htmlHelpers',
        './dateHelpers',
        './keyCode'
    ],
    function (
        comparators,
        helpers,
        htmlHelpers,
        dateHelpers,
        keyCode
    ) {
        'use strict';

        return {
            comparators: comparators,
            helpers: helpers,
            htmlHelpers: htmlHelpers,
            dateHelpers: dateHelpers,
            keyCode: keyCode
        };
    });
