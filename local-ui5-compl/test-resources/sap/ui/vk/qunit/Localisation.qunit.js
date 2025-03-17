/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/base/i18n/Localization",
	"sap/ui/vk/ContentConnector",
	"sap/ui/vk/ContentResource"
], function(
	jQuery,
	Localization,
	ContentConnector,
	ContentResource
) {
	"use strict";

	function generateTest(language, procedureName, stepName) {
		QUnit.test(language, function(assert) {
			var done = assert.async();
			Localization.setLanguage(language);
			var contentConnector = new ContentConnector({
				contentResources: [
					new ContentResource({
						source: "test-resources/sap/ui/vk/qunit/media/localised.vds",
						sourceType: "vds4",
						sourceId: "abc"
					})
				]
			});
			contentConnector.attachEventOnce("contentReplaced",
				function(event) {
					var scene = event.getParameter("newContent");
					var procedures = scene.getViewGroups();
					assert.equal(procedures[0].getName(), procedureName, "Procedure names are equal. Locale: " + language);
					assert.equal(procedures[0].getViews()[0].getName(), stepName, "Step names are equal. Locale: " + language);
					// Delayed destruction of contentConnector.
					Promise.resolve(function() { contentConnector.destroy(); });
					done();
				}
			);
		});
	}

	generateTest("en_US", "Procedure 1", "ABC");
	generateTest("ru_RU", "Процедура 1", "АБВ");

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
