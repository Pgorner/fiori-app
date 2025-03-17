/* global QUnit, sinon */
/**
 * @deprecated As of version 1.120, together with the TinyMCE5 tests
 * @fileoverview
 */
sap.ui.define([
	"sap/base/i18n/Localization",
	"sap/ui/richtexteditor/RichTextEditor",
	"sap/m/Button",
	"sap/ui/Device",
	"sap/ui/core/Core",
	"sap/ui/core/InvisibleText"
], function(Localization, RichTextEditor, Button, Device, Core, InvisibleText) {
	"use strict";

	return function runRTECommonTranslations(sEditorType) {
		QUnit.module("Languages");

		function setLanguage(sLang) {
			Localization.setLanguage(sLang);
			Core.applyChanges();
		}

		var aLanguages = [
			"ar", "bg", "ca", "cs", "cy", "da", "de", "el", "en_GB", "es_MX", "es", "et", "fi", "fr_CA", "fr", "hi",
			"hr", "hu", "id", "it", "iw", "ja", "kk", "ko", "lt", "lv",
			/* "ms", */ // Malaysian is not supported by TinyMCE that is why we will not test it for now
			"nl", "no", "pl", "pt_PT", "pt", "ro", "ru",
			"sh", "sk", "sl", "sv", "th", "tr", "uk", "vi", "zh_CN", "zh_TW"
		];

		var fnLanguagesCheck = function (sLang, assert) {
			var done = assert.async();

			// Some of the language codes in TinyMCE are not the same as in UI5
			if (RichTextEditor.MAPPED_LANGUAGES_TINYMCE[sLang]) {
				sLang = RichTextEditor.MAPPED_LANGUAGES_TINYMCE[sLang];
			}

			setLanguage(sLang);

			var oRichTextEditor = new RichTextEditor("myRTELanguages-" + sLang, {
				editorType: sEditorType
			});
			var oSpy = sinon.spy(oRichTextEditor, "_getLanguageTinyMCE");

			oRichTextEditor.attachReady(function () {
				var sLangString = oSpy.returnValues[0];
				var bTinyMCE5 = sEditorType === "TinyMCE5";

				assert.strictEqual(sLangString.indexOf(sLang) === 0, true, sLang + " language should be set. " + sLangString + " is currently set.");
				assert.strictEqual(oRichTextEditor.getNativeApi().settings.language.indexOf(sLang) === 0, true, sLang + " The TinyMCE language should be set." + sLangString + " is currently set.");

				sap.ui.require(["sap/ui/richtexteditor/js/" + (bTinyMCE5 ? "tiny_mce5" : "tiny_mce4") + "/langs/" + sLangString],
					function () {
						assert.ok(true, "The language file was found.");
						oRichTextEditor.destroy();
						setTimeout(done);
					},
					function () {
						assert.notOk(true, "The language file was not found!");
						oRichTextEditor.destroy();
						setTimeout(done);
					}
				);
			});

			oRichTextEditor.placeAt("content");
			Core.applyChanges();
		};

		for (var i = 0; i < aLanguages.length; ++i) {
			var sLang = aLanguages[i];
			QUnit.test("Language - " + sLang, fnLanguagesCheck.bind(this, sLang));
		}
	};
});
