/*global QUnit */
sap.ui.define([
	"sap/gantt/def/pattern/SlashPattern",
	"sap/gantt/def/pattern/BackSlashPattern",
	"sap/ui/core/Core",
	"sap/gantt/utils/GanttChartConfigurationUtils"
], function (SlashPattern, BackSlashPattern, Core, GanttChartConfigurationUtils) {
	"use strict";

	QUnit.module("Create SlashPattern.", {
		beforeEach: function () {
			this.slashPatternGrey = new SlashPattern("pattern_slash_grey", {
				stroke: "#CAC7BA"
			});
			this.slashPatternBlue = new SlashPattern("pattern_slash_blue", {
				stroke: "#008FD3"
			});
			this.slashPatternGreen = new SlashPattern("pattern_slash_green", {
				stroke: "#99D101",
				backgroundColor: "#F2F2F2",
				backgroundFillOpacity: 0.4

			});
			this.slashPatternOrange = new SlashPattern("pattern_slash_orange", {
				stroke: "#F39B02"
			});
			this.slashPatternLightBlue = new SlashPattern("pattern_slash_lightblue", {
				stroke: "#9FCFEB"
			});

		},
		afterEach: function () {
			this.slashPatternGrey = undefined;
			this.slashPatternBlue = undefined;
			this.slashPatternGreen = undefined;
			this.slashPatternOrange = undefined;
			this.slashPatternLightBlue = undefined;
		}
	});

	QUnit.test("SlashPattern methods.", function (assert) {
		assert.ok(this.slashPatternGrey.getDefString().length > 5, "SlashPattern grey  getDefString number succeeds");
		assert.equal(this.slashPatternGrey.getId(), "pattern_slash_grey", "SlashPattern grey  getId succeeds");
		assert.equal(this.slashPatternGrey.getRefString(), "url(#pattern_slash_grey)", "SlashPattern grey  getRefString succeeds");
		assert.equal(this.slashPatternGrey.getStroke(), "#CAC7BA", "SlashPattern grey  getStroke succeeds");
		assert.equal(this.slashPatternGrey.getStrokeWidth(), "2", "SlashPattern grey  getStrokeWidth succeeds");

		assert.ok(this.slashPatternBlue.getDefString().length > 5, "slashPatternBlue  getDefString number succeeds");
		assert.equal(this.slashPatternBlue.getId(), "pattern_slash_blue", "slashPatternBlue  getId succeeds");
		assert.equal(this.slashPatternBlue.getRefString(), "url(#pattern_slash_blue)", "slashPatternBlue  getRefString succeeds");
		assert.equal(this.slashPatternBlue.getStroke(), "#008FD3", "slashPatternBlue  getStroke succeeds");
		assert.equal(this.slashPatternBlue.getStrokeWidth(), "2", "slashPatternBlue  getStrokeWidth succeeds");

		assert.ok(this.slashPatternGreen.getDefString().length > 5, "slashPatternGreen  getDefString number succeeds");
		assert.equal(this.slashPatternGreen.getId(), "pattern_slash_green", "slashPatternGreen  getId succeeds");
		assert.equal(this.slashPatternGreen.getRefString(), "url(#pattern_slash_green)", "slashPatternGreen  getRefString succeeds");
		assert.equal(this.slashPatternGreen.getStroke(), "#99D101", "slashPatternGreen  getStroke succeeds");
		assert.equal(this.slashPatternGreen.getStrokeWidth(), "2", "slashPatternGreen  getStrokeWidth succeeds");
		assert.equal(this.slashPatternGreen.getBackgroundColor(), "#F2F2F2", "slashPatternGreen  getBackgroundColor succeeds");
		assert.equal(this.slashPatternGreen.getBackgroundFillOpacity(), 0.4, "slashPatternGreen  getBackgroundFillOpacity succeeds");

		assert.ok(this.slashPatternOrange.getDefString().length > 5, "slashPatternOrange  getDefString number succeeds");
		assert.equal(this.slashPatternOrange.getId(), "pattern_slash_orange", "slashPatternOrange  getId succeeds");
		assert.equal(this.slashPatternOrange.getRefString(), "url(#pattern_slash_orange)", "slashPatternOrange  getRefString succeeds");
		assert.equal(this.slashPatternOrange.getStroke(), "#F39B02", "slashPatternOrange  getStroke succeeds");
		assert.equal(this.slashPatternOrange.getStrokeWidth(), "2", "slashPatternOrange  getStrokeWidth succeeds");

		assert.ok(this.slashPatternLightBlue.getDefString().length > 5, "slashPatternLightBlue  getDefString number succeeds");
		assert.equal(this.slashPatternLightBlue.getId(), "pattern_slash_lightblue", "slashPatternLightBlue  getId succeeds");
		assert.equal(this.slashPatternLightBlue.getRefString(), "url(#pattern_slash_lightblue)", "slashPatternLightBlue  getRefString succeeds");
		assert.equal(this.slashPatternLightBlue.getStroke(), "#9FCFEB", "slashPatternLightBlue  getStroke succeeds");
		assert.equal(this.slashPatternLightBlue.getStrokeWidth(), "2", "slashPatternLightBlue  getStrokeWidth succeeds");
	});

	/**
	 * @deprecated since 1.120.0
	 */
	QUnit.module("Create SlashPattern for HCB.", {
		beforeEach: function () {
			this.sOriginalTheme = GanttChartConfigurationUtils.getTheme();
			this.sRequiredTheme = null;
			this.applyTheme = function(sTheme, fnCallback) {
				this.sRequiredTheme = sTheme;
				if (GanttChartConfigurationUtils.getTheme() === this.sRequiredTheme && Core.isThemeApplied()) {
					if (jQuery.isFunction(fnCallback)) {
						fnCallback.bind(this)();
						fnCallback = undefined;
					}
				} else {
					Core.attachThemeChanged(fnThemeApplied.bind(this));
					Core.applyTheme(sTheme);
				}

				function fnThemeApplied(oEvent) {
					Core.detachThemeChanged(fnThemeApplied);
					if (GanttChartConfigurationUtils.getTheme() === this.sRequiredTheme && Core.isThemeApplied()) {
						if (jQuery.isFunction(fnCallback)) {
							fnCallback.bind(this)();
							fnCallback = undefined;
						}
					} else {
						window.setTimeout(fnThemeApplied.bind(this), 1500, oEvent);
					}
				}
			};
		},
		afterEach: function (assert) {
			this.slashPatternGrey1 = undefined;
			this.slashPatternGrey2 = undefined;
			this.slashPatternGrey3 = undefined;
			this.slashPatternGrey4 = undefined;
			this.slashPatternGrey5 = undefined;

			var done = assert.async();
			this.applyTheme(this.sOriginalTheme, done);
		}
	});

	QUnit.test("SlashPattern for HCB Theme with semantic color", function (assert) {
		var done = assert.async();
		this.applyTheme("sap_belize_hcb", function() {

			this.slashPatternGrey1 = new SlashPattern("pattern_slash_grey1", {
				stroke: "@sapUiChartPaletteSemanticNeutralLight1"
			});

			this.slashPatternGrey2 = new SlashPattern("pattern_slash_grey2", {
				stroke: "@sapUiChartPaletteSemanticNeutralLight1",
				backgroundColor: "red"
			});

			this.slashPatternGrey3 = new SlashPattern("pattern_slash_grey3", {
				stroke: "@sapUiChartPaletteSemanticNeutral"
			});

			this.slashPatternGrey4 = new SlashPattern("pattern_slash_grey4", {
				stroke: "@sapUiChartPaletteSemanticNeutralDark1",
				backgroundColor: "#fff"
			});

			this.slashPatternGrey5 = new SlashPattern("pattern_slash_grey5", {
				stroke: "@sapUiChartPaletteSemanticNeutralDark2"
			});

			assert.ok(this.slashPatternGrey1.getDefString().length > 5, "SlashPattern grey  getDefString number succeeds");
			assert.equal(this.slashPatternGrey1.getId(), "pattern_slash_grey1", "SlashPattern grey  getId succeeds");
			assert.equal(this.slashPatternGrey1.getRefString(), "url(#pattern_slash_grey1)", "SlashPattern grey  getRefString succeeds");
			assert.ok(this.slashPatternGrey1.getStroke().includes("#afafaf"), "SlashPattern grey  getStroke succeeds");
			assert.equal(this.slashPatternGrey1.getStrokeWidth(), "2", "SlashPattern grey  getStrokeWidth succeeds");
			assert.equal(this.slashPatternGrey1.getBackgroundColor(), "#000", "SlashPattern grey  getBackgroundColor succeeds and should be black");

			assert.ok(this.slashPatternGrey2.getDefString().length > 5, "SlashPattern grey  getDefString number succeeds");
			assert.equal(this.slashPatternGrey2.getId(), "pattern_slash_grey2", "SlashPattern grey  getId succeeds");
			assert.equal(this.slashPatternGrey2.getRefString(), "url(#pattern_slash_grey2)", "SlashPattern grey  getRefString succeeds");
			assert.ok(this.slashPatternGrey2.getStroke().includes("#afafaf"), "SlashPattern grey  getStroke succeeds");
			assert.equal(this.slashPatternGrey2.getStrokeWidth(), "2", "SlashPattern grey  getStrokeWidth succeeds");
			assert.equal(this.slashPatternGrey2.getBackgroundColor(), "red", "SlashPattern grey  getBackgroundColor succeeds and should be red");

			assert.ok(this.slashPatternGrey3.getDefString().length > 5, "SlashPattern grey  getDefString number succeeds");
			assert.equal(this.slashPatternGrey3.getId(), "pattern_slash_grey3", "SlashPattern grey  getId succeeds");
			assert.equal(this.slashPatternGrey3.getRefString(), "url(#pattern_slash_grey3)", "SlashPattern grey  getRefString succeeds");
			assert.ok(this.slashPatternGrey3.getStroke().includes("#afafaf"), "SlashPattern grey  getStroke succeeds");
			assert.equal(this.slashPatternGrey3.getStrokeWidth(), "2", "SlashPattern grey  getStrokeWidth succeeds");
			assert.equal(this.slashPatternGrey3.getBackgroundColor(), "#000", "SlashPattern grey  getBackgroundColor succeeds and should be black");

			assert.ok(this.slashPatternGrey4.getDefString().length > 5, "SlashPattern grey  getDefString number succeeds");
			assert.equal(this.slashPatternGrey4.getId(), "pattern_slash_grey4", "SlashPattern grey  getId succeeds");
			assert.equal(this.slashPatternGrey4.getRefString(), "url(#pattern_slash_grey4)", "SlashPattern grey  getRefString succeeds");
			assert.ok(this.slashPatternGrey4.getStroke().includes("#afafaf"), "SlashPattern grey  getStroke succeeds");
			assert.equal(this.slashPatternGrey4.getStrokeWidth(), "2", "SlashPattern grey  getStrokeWidth succeeds");
			assert.equal(this.slashPatternGrey4.getBackgroundColor(), "#fff", "SlashPattern grey  getBackgroundColor succeeds and should be White");

			assert.ok(this.slashPatternGrey5.getDefString().length > 5, "SlashPattern grey  getDefString number succeeds");
			assert.equal(this.slashPatternGrey5.getId(), "pattern_slash_grey5", "SlashPattern grey  getId succeeds");
			assert.equal(this.slashPatternGrey5.getRefString(), "url(#pattern_slash_grey5)", "SlashPattern grey  getRefString succeeds");
			assert.ok(this.slashPatternGrey5.getStroke().includes("#afafaf"), "SlashPattern grey  getStroke succeeds");
			assert.equal(this.slashPatternGrey5.getStrokeWidth(), "2", "SlashPattern grey  getStrokeWidth succeeds");
			assert.equal(this.slashPatternGrey5.getBackgroundColor(), "#000", "SlashPattern grey  getBackgroundColor succeeds and should be black");

			done();
		}.bind(this));
	});

	QUnit.module("Create BackSlashPattern.", {
		beforeEach: function () {
			this.backslashPatternA = new BackSlashPattern("pattern_backslashFilled_F2F2F2", {
				stroke: "#F2F2F2",
				strokeWidth: 1,
				backgroundColor: "none"
			});
			this.backslashPatternB = new BackSlashPattern("pattern_backslash_grey", {
				stroke: "#CAC7BA"
			});
		},
		afterEach: function () {
			this.backslashPatternA = undefined;
			this.backslashPatternB = undefined;
		}
	});

	QUnit.test("BackSlashPattern methods.", function (assert) {
		assert.ok(this.backslashPatternA.getDefString().length > 5, "backslashPatternA  getDefString number succeeds");
		assert.equal(this.backslashPatternA.getId(), "pattern_backslashFilled_F2F2F2", "backslashPatternA  getId succeeds");
		assert.equal(this.backslashPatternA.getRefString(), "url(#pattern_backslashFilled_F2F2F2)", "backslashPatternA  getRefString succeeds");
		assert.equal(this.backslashPatternA.getStroke(), "#F2F2F2", "backslashPatternA  getStroke succeeds");
		assert.equal(this.backslashPatternA.getStrokeWidth(), "1", "backslashPatternA  getStrokeWidth succeeds");
		assert.equal(this.backslashPatternA.getBackgroundFillOpacity(), 1, "backslashPatternA  getBackgroundFillOpacity succeeds");

		assert.ok(this.backslashPatternB.getDefString().length > 5, "backslashPatternB  getDefString number succeeds");
		assert.equal(this.backslashPatternB.getId(), "pattern_backslash_grey", "backslashPatternB  getId succeeds");
		assert.equal(this.backslashPatternB.getRefString(), "url(#pattern_backslash_grey)", "backslashPatternB  getRefString succeeds");
		assert.equal(this.backslashPatternB.getStroke(), "#CAC7BA", "backslashPatternB  getStroke succeeds");
		assert.equal(this.backslashPatternB.getStrokeWidth(), "2", "backslashPatternB  getStrokeWidth succeeds");

	});
});
