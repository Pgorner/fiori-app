/**
 * tests for the sap.suite.ui.generic.template.ListReport.AnnotationHelper.js and in particular for the SmartChart in multi-tab mode
 */
sap.ui.define([ "sap/suite/ui/generic/template/ListReport/AnnotationHelper",], 
function(AnnotationHelper){
	"use strict";

	var oItabItem = {};
	var aSubPages = [];
	var sChartEntitySet;
	var oQuickVariantSelectionX = {};
	
	QUnit.module("test checkIfChartNavigationIsEnabled", {
		beforeEach : fnCommonSetUp,
		afterEach: fnCommonTeardown
	});

	function fnCommonSetUp() {
		this.oAnnotationHelper = AnnotationHelper;
	}

	function fnCommonTeardown() {
		this.oAnnotationHelper = null;
		oItabItem = {};
		aSubPages = [];
		oQuickVariantSelectionX = {};
	}

	function fnPrepareTestDataForChartNavi(bDifferentEntitySets, bTestExternalNavi) {
		oItabItem.entitySet = "entitySetTab1";
		oItabItem.showItemNavigationOnChart = true;
		var oSubPageExtNavi1 = {
			entitySet : "entitySetTab1",
			navigation: {
				display: {
					path: "somePath",
					target: "someTarget"
				}
			}
		};

		var oSubPageExtNavi2 = {
				entitySet : "entitySetTab2",
				navigation: {
					display: {
						path: "somePath",
						target: "someTarget"
					}
				}
			};

		var oSubPageIntNavi1 = {
				entitySet : "entitySetTab1",
				navigation: {
					create: {
						path: "somePath",
						target: "someTarget"
					}
				}
			};

		var oSubPageIntNavi2 = {
				entitySet : "entitySetTab2"
			};

		if (bTestExternalNavi) {
			aSubPages.push(oSubPageExtNavi1);
			aSubPages.push(oSubPageExtNavi2);
		} else {
			aSubPages.push(oSubPageIntNavi1);
			aSubPages.push(oSubPageIntNavi2);
		}

		sChartEntitySet = "ChartEntitySet";
		oQuickVariantSelectionX.variants = {
			1: {
				key: "1",
				annotationPath: "someSelectionVariantPath"
			},
			2: {
				key: "2",
				annotationPath: "someSelectionVariantPath"
			}
		};

		if (bDifferentEntitySets) {
			oQuickVariantSelectionX.variants[1].entitySet = "entitySetTab1";
			oQuickVariantSelectionX.variants[2].entitySet = "entitySetTab2";
		}
	}

	QUnit.test("test with showItemNavigationOnChart = false, one entitySet, internal navigation", function(assert) {
		fnPrepareTestDataForChartNavi(false, false);
		oItabItem.showItemNavigationOnChart = false;
		var bNaviEnabled = this.oAnnotationHelper.checkIfChartNavigationIsEnabled(oItabItem, aSubPages, sChartEntitySet, oQuickVariantSelectionX);
		assert.ok(!bNaviEnabled, "Navi should be disabled for showItemNavigationOnChart = false with one entitySet");
	});

	QUnit.test("test with showItemNavigationOnChart = false, one entitySet, external navigation", function(assert) {
		fnPrepareTestDataForChartNavi(false, true);
		oItabItem.showItemNavigationOnChart = false;
		var bNaviEnabled = this.oAnnotationHelper.checkIfChartNavigationIsEnabled(oItabItem, aSubPages, sChartEntitySet, oQuickVariantSelectionX);
		assert.ok(!bNaviEnabled, "Navi should be disabled for showItemNavigationOnChart = false with one entitySet");
	});

	QUnit.test("test with showItemNavigationOnChart = false, different entitySets, internal navigation", function(assert) {
		fnPrepareTestDataForChartNavi(true, false);
		oItabItem.showItemNavigationOnChart = false;
		var bNaviEnabled = this.oAnnotationHelper.checkIfChartNavigationIsEnabled(oItabItem, aSubPages, sChartEntitySet, oQuickVariantSelectionX);
		assert.ok(!bNaviEnabled, "Navi should be disabled for showItemNavigationOnChart = false with different entitySets");
	});

	QUnit.test("test with showItemNavigationOnChart = false, different entitySets, external navigation", function(assert) {
		fnPrepareTestDataForChartNavi(true, true);
		oItabItem.showItemNavigationOnChart = false;
		var bNaviEnabled = this.oAnnotationHelper.checkIfChartNavigationIsEnabled(oItabItem, aSubPages, sChartEntitySet, oQuickVariantSelectionX);
		assert.ok(!bNaviEnabled, "Navi should be disabled for showItemNavigationOnChart = false with different entitySets");
	});

	QUnit.test("test external navigation with one entitySet", function (assert) {
		fnPrepareTestDataForChartNavi(false, true);
		oItabItem.showItemNavigationOnChart = true;
		var bNaviEnabled = this.oAnnotationHelper.checkIfChartNavigationIsEnabled(oItabItem, aSubPages, sChartEntitySet, oQuickVariantSelectionX);
		assert.ok(bNaviEnabled, "external navi should be supported ");
	});

	QUnit.test("test external navigation with different entitySets", function(assert) {
		fnPrepareTestDataForChartNavi(true, true);
		oItabItem.showItemNavigationOnChart = true;
		var bNaviEnabled = this.oAnnotationHelper.checkIfChartNavigationIsEnabled(oItabItem, aSubPages, sChartEntitySet, oQuickVariantSelectionX);
		assert.ok(bNaviEnabled, "external navi should be supported ");
	});

	QUnit.test("test internal navigation with one entitySet", function(assert) {
		fnPrepareTestDataForChartNavi(false, false);
		oItabItem.showItemNavigationOnChart = true;
		var bNaviEnabled = this.oAnnotationHelper.checkIfChartNavigationIsEnabled(oItabItem, aSubPages, sChartEntitySet, oQuickVariantSelectionX);
		assert.ok(bNaviEnabled, "internal navi should be supported ");
	});

	QUnit.test("test internal navigation with different entitySets", function(assert) {
		fnPrepareTestDataForChartNavi(false, false);
		oItabItem.showItemNavigationOnChart = true;
		var bNaviEnabled = this.oAnnotationHelper.checkIfChartNavigationIsEnabled(oItabItem, aSubPages, sChartEntitySet, oQuickVariantSelectionX);
		assert.ok(bNaviEnabled, "internal navi should be not supported with different entitySets ");
	});

});
