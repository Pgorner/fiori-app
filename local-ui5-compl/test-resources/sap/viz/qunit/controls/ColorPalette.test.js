/*global QUnit */
sap.ui.define([
	"sap/ui/core/Theming",
	"sap/ui/core/theming/Parameters",
	"../js/ColorPaletteParameters",
	"./CommonUtil"
], function(Theming, Parameters, ColorPaletteParameters, CommonUtil) {

QUnit.module("Semantic Color Palette check");

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

async function check(palette, theme) {
  for (var key in palette) {
    if (Object.hasOwn(palette, key)) {
      const sValue = await Parameters_getAsync(key);
      QUnit.assert.deepEqual(
        CommonUtil.unifyHexNotation(sValue.toLowerCase()), palette[key].toLowerCase(),
        "color of " + key + " should be correct in " + theme);
    }
  }
}

[
    /** @deprecated */
    "sap_belize",
    /** @deprecated */
    "sap_belize_plus",
    /** @deprecated */
    "sap_belize_hcb",
    /** @deprecated */
    "sap_belize_hcw",
    /*
    "sap_fiori_3",
    "sap_fiori_3_dark",
    "sap_fiori_3_hcb",
    "sap_fiori_3_hcw",
    "sap_horizon",
    "sap_horizon_dark",
    "sap_horizon_hcb",
    "sap_horizon_hcw"
    */
].forEach((sTheme) => {
    QUnit.test(`check parameters in ${sTheme}`, (assert) => {
        var done = assert.async();

        Theming.setTheme(sTheme);
        Theming.attachApplied(onThemeApplied);
        async function onThemeApplied() {
            await check(ColorPaletteParameters.QUALITATIVE_PALETTE[sTheme], sTheme);
            await check(ColorPaletteParameters.SEMANTIC_PALETTE[sTheme], sTheme);
            await check(ColorPaletteParameters.SEQUENTIAL_PALETTE[sTheme], sTheme);
            done();
        }
    });
});
});
