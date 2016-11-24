/**
 * @author Batch Themes Ltd.
 */
(function() {
    'use strict';

    $(function() {

        var config = {
            name: 'Marino',
            theme: 'palette-8',
            palette: getPalette('palette-8'),
            layout: 'horizontal-navigation-2',
            colors: getColors()
        };

        //$.removeAllStorages();
        if ($.localStorage.isEmpty('config') || !($.localStorage.get('config'))) {
            $.removeAllStorages();
            $.localStorage.set('config', config);
        }
        var config = $.localStorage.get('config');

        //detect IE
        var isIE = detectIE();
        if (isIE) {
            $('body').addClass('ie-' + isIE);
        }

    });
})();
