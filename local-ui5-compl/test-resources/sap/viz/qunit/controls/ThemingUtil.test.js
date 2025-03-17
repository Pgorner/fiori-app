/*global QUnit */
sap.ui.define([
	"sap/ui/core/Core",
	"sap/viz/ui5/theming/Util",
	"sap/ui/core/theming/Parameters",
	"../js/data"
], function(Core, Util, Parameters) {

QUnit.module("Theming Util");

QUnit.test("read CSS parameters", function(assert){
    Util._mapping = {
            "sapUiChartBackgroundColor" : ["general.background.color",
                                           "plotArea.background.color"],
            "sapUiChartCategoryAxisLineColor" : "categoryAxis.color",
            "sapUiChartValueAxisLineColor" : "valueAxis.color"
    };
    var done = assert.async();

    async function Parameters_getAsync(name) {
        return new Promise((resolve) => {
            const result = Parameters.get({
                name,
                callback(result) {
                    resolve(result);
                }
            });
            if ( result !== undefined ) {
                resolve(result);
            }
        });
    }

    Core.ready().then(async function() {
        var expected = {
            "general" : {
                "background" : {
                    "color" : await Parameters_getAsync("sapUiChartBackgroundColor")
                }
            },
            "plotArea" : {
                "background" : {
                    "color" : await Parameters_getAsync("sapUiChartBackgroundColor")
                }
            },
            "categoryAxis" : {
                "color" : await Parameters_getAsync("sapUiChartCategoryAxisLineColor")
            },
            "valueAxis" : {
                "color" : await Parameters_getAsync("sapUiChartValueAxisLineColor")
            }

        };

        var expected_excluded = {
            "general" : {
                "background" : {
                    "color" : await Parameters_getAsync("sapUiChartBackgroundColor")
                }
            },
            "plotArea" : {
                "background" : {
                    "color" : await Parameters_getAsync("sapUiChartBackgroundColor")
                }
            },
            "categoryAxis" : {
                "color" : await Parameters_getAsync("sapUiChartCategoryAxisLineColor")
            }
        };
        assert.deepEqual(Util.readCSSParameters("info/line"), expected, true, "The mapping from css parameter to properties should be corrected");
        assert.deepEqual(Util.readCSSParameters("info/dual_line"), expected_excluded, true, "The mapping from css parameter to properties should be corrected");
        done();
    });

});

});
