/*global QUnit*/

sap.ui.define([
	"sap/ui/core/theming/Parameters",
	"sap/ui/qunit/utils/nextUIUpdate"
], function (Parameters, nextUIUpdate) {
	"use strict";
	return {
		initSizeModule: function(MicroChartClass, sSizeBaseClass) {
			QUnit.module("Sizes", {
				beforeEach: async function() {
					this.oChart = new MicroChartClass();
					this.oChart.placeAt("qunit-fixture");
					await nextUIUpdate();
				},
				afterEach: function() {
					this.oChart.destroy();
					this.oChart = null;
				}
			});

			QUnit.test("Default size", function(assert) {
				var oSize = this.oChart.getSize();
				var $Chart = this.oChart.$();

				assert.equal(oSize, "Auto", "Default size set to auto");
				assert.ok($Chart.hasClass(sSizeBaseClass + "Auto"), "Size class <Auto> is active");
			});

			QUnit.test("Size M", async function(assert) {
				this.oChart.setSize("M");
				await nextUIUpdate();
				var oSize = this.oChart.getSize();
				var $Chart = this.oChart.$();

				assert.equal(oSize, "M", "Size <M> was set");
				assert.ok($Chart.hasClass(sSizeBaseClass + "M"), "Size class <M> is active");
			});

			QUnit.test("Size L", async function(assert) {
				this.oChart.setSize("L");
				await nextUIUpdate();
				var oSize = this.oChart.getSize();
				var $Chart = this.oChart.$();

				assert.equal(oSize, "L", "Size <L> was set");
				assert.ok($Chart.hasClass(sSizeBaseClass + "L"), "Size class <L> is active");
			});

			QUnit.test("Width and height can be overriden", async function(assert) {
				this.oChart.setSize("L");
				this.oChart.setWidth("500px");
				this.oChart.setHeight("500px");

				await nextUIUpdate();

				var $Chart = this.oChart.$();

				assert.equal($Chart.width(), 500, "width is changed");
				assert.equal($Chart.height(), 500, "height is changed");
			});

			QUnit.test("Width and height changed when using size Responsive", async function(assert) {
				this.oChart.setSize("Responsive");
				this.oChart.setWidth("500px");
				this.oChart.setHeight("500px");

				await nextUIUpdate();

				var $Chart = this.oChart.$();

				assert.equal($Chart.width(), 500, "width is changed");
				assert.equal($Chart.height(), 500, "height is changed");
			});

		},
		getThemeColor: function(sCssParameter) {
			return new Promise(function(resolve) {
				var sSyncResult = Parameters.get({
					name: sCssParameter,
					callback: function(sAsyncResult) {
						resolve(sAsyncResult);
					}
				});
				if ( sSyncResult != null ) {
					resolve(sSyncResult);
				}
			}).then(function(sValue) {
				// normalize color (e.g. #hex to rgb())
				var div = document.createElement("div");
				div.style.color = sValue;
				return div.style.color;
			});
		}
	};
});


