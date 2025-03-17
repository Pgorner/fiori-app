// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.cepsearchresult.app.Component
 */
sap.ui.define([
  "sap/ushell/components/cepsearchresult/app/util/appendStyleVars",
  "sap/ui/core/Theming"
], function (
  appendStyleVars,
  Theming
) {
  "use strict";


  /* global QUnit */

  QUnit.test("appendStyleVars", function (assert) {
    const done = assert.async();

    function themeChangedHandler () {
      appendStyleVars([
        "sapUiBaseText",
        "sapUiButtonBackground"
      ]);
      assert.notStrictEqual(document.body.style.getPropertyValue("--sapUiBaseText"), "", "sapUiBaseText css vars added to body");
      assert.notStrictEqual(document.body.style.getPropertyValue("--sapUiButtonBackground"), "", "sapUiButtonBackground css vars added to body");

      appendStyleVars([
        "sapMFontMediumSize"
      ]);

      assert.notStrictEqual(document.body.style.getPropertyValue("--sapMFontMediumSize"), "", "sapMFontMediumSize css vars added to body");
      assert.notStrictEqual(document.body.style.getPropertyValue("--sapUiBaseText"), "", "sapUiBaseText css vars added to body");
      assert.notStrictEqual(document.body.style.getPropertyValue("--sapUiButtonBackground"), "", "sapUiButtonBackground css vars added to body");
      Theming.detachApplied(themeChangedHandler);
      done();
    }
    Theming.setTheme("sap_fiori_3");
    Theming.attachApplied(themeChangedHandler);

  });

  QUnit.test("appendStyleVars change theme", function (assert) {
    const done = assert.async();
    let sColor;

    function themeChangedHandler () {
      assert.notStrictEqual(document.body.style.getPropertyValue("--sapUiButtonBackground"), sColor, "sapUiButtonBackground css changed for theme");
      Theming.detachApplied(themeChangedHandler);
      Theming.setTheme("sap_fiori_3");
      done();
    }
    appendStyleVars([
      "sapUiButtonBackground"
    ]);
    sColor = document.body.style.getPropertyValue("--sapUiButtonBackground");
    // trigger theme changed
    Theming.setTheme("sap_fiori_3_dark");
    Theming.attachApplied(themeChangedHandler);
  });

});
