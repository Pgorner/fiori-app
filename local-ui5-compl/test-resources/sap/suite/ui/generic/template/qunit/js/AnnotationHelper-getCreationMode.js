sap.ui.define(["sap/suite/ui/generic/template/js/AnnotationHelper"],
	function (AnnotationHelper) {
		QUnit.module("AnnotationHelper.getCreationMode", {
			beforeEach: function() {
				sandbox = sinon.sandbox.create();
			},
			afterEach: function() {
				sandbox.restore();
			}
		});

		[
			{
				oGlobalSettings: undefined,
				oAppSettings: undefined,
				result: ""
			},
			{
				oGlobalSettings: {},
				oAppSettings: undefined,
				result: ""
			},
			{
				oGlobalSettings: {sections: {}},
				oAppSettings: undefined,
				result: ""
			},
			{
				oGlobalSettings: {sections: {id001: {}}},
				oAppSettings: undefined,
				result: ""
			},
			{
				oGlobalSettings: {sections: {id001: {}}},
				oAppSettings: undefined,
				result: ""
			},
			{
				oGlobalSettings: {tableSettings: {}, sections: {id001: {}}},
				oAppSettings: undefined,
				result: ""
			},
			{
				oGlobalSettings: {tableSettings: {}, sections: {id001: {createMode: "sectionsCreateMode"}}},
				oAppSettings: undefined,
				result: "sectionsCreateMode"
			},
			{
				oGlobalSettings: {createMode: 'globalCreateMode', sections: {id001: {createMode: undefined}}},
				oAppSettings: undefined,
				result: "globalCreateMode"
			},
			{
				oGlobalSettings: {tableSettings: {}, createMode: 'globalCreateMode', sections: {id001: {createMode: undefined}}},
				oAppSettings: undefined,
				result: "globalCreateMode"
			},
			{
				oGlobalSettings: {tableSettings: {createMode: 'tableSettings.globalCreateMode'}, createMode: undefined, sections: {id001: {createMode: undefined}}},
				oAppSettings: undefined,
				result: "tableSettings.globalCreateMode"
			},
			{
				oGlobalSettings: {tableSettings: {createMode: 'tableSettings.globalCreateMode'}, createMode: 'globalCreateMode', sections: {id001: {createMode: undefined}}},
				oAppSettings: undefined,
				result: "globalCreateMode"
			},
			{
				oGlobalSettings: {tableSettings: {createMode: undefined}, createMode: undefined, sections: {id001: {createMode: undefined}}},
				oAppSettings: {createMode: undefined},
				result: ""
			},
			{
				oGlobalSettings: {tableSettings: {createMode: undefined}, createMode: undefined, sections: {id001: {createMode: undefined}}},
				oAppSettings: {createMode: "appCreateMode"},
				result: "appCreateMode"
			},
			{
				oGlobalSettings: {tableSettings: {createMode: 'tableSettings.globalCreateMode'}, createMode: undefined, sections: {id001: {createMode: undefined}}},
				oAppSettings: {createMode: "appCreateMode"},
				result: "tableSettings.globalCreateMode"
			},
			{
				oGlobalSettings: {tableSettings: {createMode: 'tableSettings.globalCreateMode'}, createMode: 'globalCreateMode', sections: {id001: {createMode: undefined}}},
				oAppSettings: {createMode: "appCreateMode"},
				result: "globalCreateMode"
			},
			{
				oGlobalSettings: {tableSettings: {createMode: 'tableSettings.globalCreateMode'}, createMode: 'globalCreateMode', sections: {id001: {createMode: 'sectionsCreateMode'}}},
				oAppSettings: {createMode: "appCreateMode"},
				result: "sectionsCreateMode"
			},
			{
				oGlobalSettings: {tableSettings: {createMode: 'tableSettings.globalCreateMode'}, createMode: 'globalCreateMode', sections: {id001: {createMode: 'newPage'}}},
				oAppSettings: {createMode: "appCreateMode"},
				result: ""
			},
			{
				oGlobalSettings: {tableSettings: {createMode: undefined}, createMode: undefined, sections: {id001: {createMode: undefined}}},
				oAppSettings: {createMode: 'newPage'},
				result: ""
			},
		].forEach(function(data) {
			var sAppSettings = data.oAppSettings !== undefined ? `{getTableSettings(): ${JSON.stringify(data.oAppSettings)}}` : "undefined";
			QUnit.test(`oGlobalSettings - ${JSON.stringify(data.oGlobalSettings)}, oAppSettings - ${sAppSettings} -> '${data.result}'`, function (assert) {
				sandbox.stub(AnnotationHelper, "getStableIdPartFromFacet", function() {
					return "id001";
				});

				var oFacet = "oFacet";
				data.oAppSettings = data.oAppSettings !== undefined ? {getTableSettings: sinon.stub().returns(data.oAppSettings)}: undefined;

				assert.ok(AnnotationHelper.getCreationMode(oFacet, data.oGlobalSettings, data.oAppSettings) === data.result, "AnnotationHelper.getCreationMode(oFacet, oGlobalSettings, oAppSettings) === '" + data.result + "'");
				if(data.oGlobalSettings && data.oGlobalSettings.sections) {
					assert.ok(AnnotationHelper.getStableIdPartFromFacet.calledOnce, "AnnotationHelper.getStableIdPartFromFacet had been called");
					assert.ok(AnnotationHelper.getStableIdPartFromFacet.calledWithExactly(oFacet), "AnnotationHelper.getStableIdPartFromFacet had been called with correct parameters");
				} else {
					assert.ok(AnnotationHelper.getStableIdPartFromFacet.notCalled, "AnnotationHelper.getStableIdPartFromFacet had been not called");
				}
			});
		})

});
