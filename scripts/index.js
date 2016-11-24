/**
 * @author Batch Themes Ltd.
 */
(function() {
    'use strict';

    $(function() {

        var config = $.localStorage.get('config');
        $('body').attr('data-layout', config.layout);
        $('body').attr('data-palette', config.theme);

        var colors = config.colors;
        var palette = config.palette;

        worldMap('analytics-vector-map', colors, palette);
        //easyPieChart('.analytics-easy-pie-chart-1', 100, colors.warning, palette.oddColor);
        //easyPieChart('.analytics-easy-pie-chart-2', 100, colors.success, palette.oddColor);
        //easyPieChart('.analytics-easy-pie-chart-3', 100, colors.danger, palette.oddColor);
        //easyPieChart('.analytics-easy-pie-chart-4', 100, colors.info, palette.oddColor);

        //chartistLineChart('#analytics-line-chart-1');
        //chartistPieChart4('#analytics-pie-chart-4');
        //chartJsAreaChart('analytics-area-chart', colors, palette);
        //chartJsBarChart('analytics-bar-chart', colors, palette);

//        setTimeout(function() {
//            //notify('You have 5 unread messages', 'info');
//        }, 2000);
//
//        setTimeout(function() {
//            //notify('Someone posted something on facebook', 'danger');
//        }, 30000);

        $('button[data-animate]').on('click', function() {
            var id = $(this).data('animate');
            animateButton('#' + id);
        });

    });

    
    function worldMap(element, colors, palette) {

//    var bubbleMap = new Datamap({
//        element: document.getElementById(element),
//        scope: 'world',
//        projection: 'mercator',
//        responsive: true,
//        fills: {
//            defaultFill: palette.vectorMapBackgroundColor
//        },
//        geographyConfig: {
//            popupOnHover: false,
//            highlightOnHover: false,
//            borderWidth: 1,
//            borderOpacity: 1,
//            borderColor: palette.vectorMapHoverBackgroundColor,
//            highlightOnHover: true,
//            highlightFillColor: palette.vectorMapHoverBackgroundColor,
//            highlightBorderColor: palette.vectorMapHoverBackgroundColor,
//            highlightBorderWidth: 1,
//            highlightBorderOpacity: 1,
//            popupTemplate: function(geography, data) {
//                return '<div class="hoverinfo">' + geography.properties.name + '</div>';
//            },
//            data: {
//                GHA:{
//                    fillKey: "successFill"
//                }
//            }
//        }
//    });
        
        var world = new Datamap({
            element: document.getElementById(element),
            responsive: true,
            projection: 'mercator',
        
            fills: {
                defaultFill: palette.oddColor,
                altFill: palette.evenColor,
                dangerFill: colors.danger,
                warningFill: colors.warning,
                infoFill: colors.info,
                successFill: colors.success
            },
            geographyConfig: {
                borderWidth: 1,
                borderOpacity: 1,
                borderColor: palette.borderColor,
                highlightOnHover: true,
                highlightFillColor: palette.hoverColor,
                highlightBorderColor: palette.borderColor,
                highlightBorderWidth: 1,
                highlightBorderOpacity: 1,
                popupTemplate: function(geography, data) {
                    return '<div class="hoverinfo">' + geography.properties.name + '</div>';
                }
            },
            labels: {
                labelColor: 'blue',
                fontSize: 12
            },
            data: {
                GHA:{
                    fillKey: "infoFill"
                }
            }
        });

//    var bubbles = [{
//        name: 'Africa',
//        radius: 25,
//        latitude: 0,
//        longitude: 0
//    } ];

//    bubbleMap.bubbles(bubbles, {
//        borderWidth: 1,
//        borderOpacity: 1,
//        borderColor: colors.warning,
//        highlightFillColor: colors.warning,
//        highlightBorderColor: colors.warning,
//        popupTemplate: function(geo, data) {
//            return ['<div class="hoverinfo">' + data.name,
//                '</div>'
//            ].join('');
//        }
//    });

    window.addEventListener('resize', function() {
        world.resize();
    });

}
    
})();
