// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.cepsearchresult.util.controls.Paginator
 */
sap.ui.define([
  "sap/base/i18n/Localization",
  "sap/ui/core/Element",
  "sap/ushell/components/cepsearchresult/app/util/controls/Paginator",
  "sap/ui/core/Theming",
  "sap/ui/qunit/utils/nextUIUpdate"
], function (
  Localization,
  Element,
  Paginator,
  Theming,
  nextUIUpdate
) {
  "use strict";

  /* global QUnit */

  //set the language to en/default
  Localization.setLanguage("en");
  Theming.setTheme("sap_horizon");
  const coreLoaded = new Promise(function (resolve) {
    Theming.attachApplied(function () {
      resolve();
    });
  });

  const oDomRef = document.createElement("div");
  oDomRef.setAttribute("id", "paginatorInstance");
  document.body.appendChild(oDomRef);

  QUnit.module("sap.ushell.components.cepsearchresult.cards.searchresultwidget.controls.Paginator", {
    beforeEach: function (assert) {
    },
    afterEach: function () {
    }
  });

  QUnit.test("Create with default paginator", function (assert) {
    const done = assert.async();

    coreLoaded.then(async function () {
      const oPaginator = new Paginator();
      assert.strictEqual(oPaginator.getCount(), 0, "Default count is 0");
      assert.strictEqual(oPaginator.getSegmentSize(), 7, "Default segmentSize is 7");
      assert.strictEqual(oPaginator.getCurrentPage(), 1, "Default currentPage is 1");
      assert.strictEqual(oPaginator.getPageSize(), 5, "Default pageSize is 5");

      oPaginator.placeAt(oDomRef);
      await nextUIUpdate();

      assert.strictEqual(oPaginator.getDomRef().innerText, "", "No count no text rendering");

      oPaginator.destroy();
      done();
    });
  });

  QUnit.test("Create paginator 2 pages (pageSize=10, count=15)", function (assert) {
    const done = assert.async();

    coreLoaded.then(async function () {
      const oPaginator = new Paginator({
        pageSize: 10,
        count: 15
      });

      assert.strictEqual(oPaginator.getCount(), 15, "Count is 15");
      assert.strictEqual(oPaginator.getSegmentSize(), 7, "segmentSize is 7");
      assert.strictEqual(oPaginator.getCurrentPage(), 1, "currentPage is 1");
      assert.strictEqual(oPaginator.getPageSize(), 10, "pageSize is 10");

      oPaginator.placeAt(oDomRef);
      await nextUIUpdate();

      let aButtons = oPaginator.getDomRef().querySelectorAll(".sapMBtn");
      assert.strictEqual(aButtons.length, 4, "4 buttons");

      let oButton0 = Element.getElementById(aButtons[0].getAttribute("id"));
      let oButton1 = Element.getElementById(aButtons[1].getAttribute("id"));
      let oButton2 = Element.getElementById(aButtons[2].getAttribute("id"));
      let oButton3 = Element.getElementById(aButtons[3].getAttribute("id"));

      assert.strictEqual(oButton1.getText(), "1", "Button 1 text is 1");
      assert.strictEqual(oButton2.getText(), "2", "Button 2 text is 1");
      assert.strictEqual(oButton0.getEnabled(), false, "Button < is disabled");
      assert.strictEqual(oButton1.getEnabled(), false, "Button 1 is disabled");
      assert.strictEqual(oButton2.getEnabled(), true, "Button 2 is enabled");
      assert.strictEqual(oButton3.getEnabled(), true, "Button > is enabled");

      oButton2.firePress();
      await nextUIUpdate();

      aButtons = oPaginator.getDomRef().querySelectorAll(".sapMBtn");
      assert.strictEqual(aButtons.length, 4, "4 buttons");

      oButton0 = Element.getElementById(aButtons[0].getAttribute("id"));
      oButton1 = Element.getElementById(aButtons[1].getAttribute("id"));
      oButton2 = Element.getElementById(aButtons[2].getAttribute("id"));
      oButton3 = Element.getElementById(aButtons[3].getAttribute("id"));

      assert.strictEqual(oButton0.getEnabled(), true, "Button < is enabled");
      assert.strictEqual(oButton1.getEnabled(), true, "Button 1 is enabled");
      assert.strictEqual(oButton2.getEnabled(), false, "Button 2 is disabled");
      assert.strictEqual(oButton3.getEnabled(), false, "Button > is disabled");

      oButton0.firePress();
      await nextUIUpdate();

      aButtons = oPaginator.getDomRef().querySelectorAll(".sapMBtn");
      assert.strictEqual(aButtons.length, 4, "4 buttons");

      oButton0 = Element.getElementById(aButtons[0].getAttribute("id"));
      oButton1 = Element.getElementById(aButtons[1].getAttribute("id"));
      oButton2 = Element.getElementById(aButtons[2].getAttribute("id"));
      oButton3 = Element.getElementById(aButtons[3].getAttribute("id"));

      assert.strictEqual(oButton0.getEnabled(), false, "Button < is disabled");
      assert.strictEqual(oButton1.getEnabled(), false, "Button 1 is disabled");
      assert.strictEqual(oButton2.getEnabled(), true, "Button 2 is enabled");
      assert.strictEqual(oButton3.getEnabled(), true, "Button > is enabled");

      oButton3.firePress();
      await nextUIUpdate();

      aButtons = oPaginator.getDomRef().querySelectorAll(".sapMBtn");
      assert.strictEqual(aButtons.length, 4, "4 buttons");

      oButton0 = Element.getElementById(aButtons[0].getAttribute("id"));
      oButton1 = Element.getElementById(aButtons[1].getAttribute("id"));
      oButton2 = Element.getElementById(aButtons[2].getAttribute("id"));
      oButton3 = Element.getElementById(aButtons[3].getAttribute("id"));

      assert.strictEqual(oButton0.getEnabled(), true, "Button < is enabled");
      assert.strictEqual(oButton1.getEnabled(), true, "Button 1 is enabled");
      assert.strictEqual(oButton2.getEnabled(), false, "Button 2 is disabled");
      assert.strictEqual(oButton3.getEnabled(), false, "Button > is disabled");

      oPaginator.destroy();

      done();
    });
  });

  QUnit.test("Create paginator 2 pages (pageSize=10, count=15)", function (assert) {
    const done = assert.async();

    coreLoaded.then(async function () {
      const oPaginator = new Paginator({
        pageSize: 5,
        count: 100,
        currentPage: 10
      });

      assert.strictEqual(oPaginator.getCount(), 100, "Count is 100");
      assert.strictEqual(oPaginator.getSegmentSize(), 7, "segmentSize is 7");
      assert.strictEqual(oPaginator.getCurrentPage(), 10, "currentPage is 10");
      assert.strictEqual(oPaginator.getPageSize(), 5, "pageSize is 5");

      oPaginator.placeAt(oDomRef);
      await nextUIUpdate();

      let aButtons = oPaginator.getDomRef().querySelectorAll(".sapMBtn");
      assert.strictEqual(aButtons.length, 13, "13 buttons");

      let oButton0 = Element.getElementById(aButtons[0].getAttribute("id"));
      let oButton1 = Element.getElementById(aButtons[1].getAttribute("id"));
      let oButton2 = Element.getElementById(aButtons[2].getAttribute("id"));
      let oButton3 = Element.getElementById(aButtons[3].getAttribute("id"));
      let oButton6 = Element.getElementById(aButtons[6].getAttribute("id"));
      let oButton10 = Element.getElementById(aButtons[10].getAttribute("id"));
      let oButton11 = Element.getElementById(aButtons[11].getAttribute("id"));
      let oButton12 = Element.getElementById(aButtons[12].getAttribute("id"));

      assert.strictEqual(oButton1.getText(), "1", "Button 1 text is 1");
      assert.strictEqual(oButton2.getText(), "...", "Button 2 text is ...");
      assert.strictEqual(oButton3.getText(), "7", "Button 3 text is 7");
      assert.strictEqual(oButton6.getText(), "10", "Button 3 text is 10");
      assert.strictEqual(oButton10.getText(), "...", "Button 10 text is ...");
      assert.strictEqual(oButton11.getText(), "20", "Button 11 text is 20");
      assert.strictEqual(oButton0.getEnabled(), true, "Button < is enabled");
      assert.strictEqual(oButton1.getEnabled(), true, "Button 1 is enabled");
      assert.strictEqual(oButton2.getEnabled(), true, "Button 2 is enabled");
      assert.strictEqual(oButton6.getEnabled(), false, "Button 6 is disabled");
      assert.strictEqual(oButton11.getEnabled(), true, "Button 11 is enabled");
      assert.strictEqual(oButton12.getEnabled(), true, "Button > is enabled");

      oButton3.firePress();
      await nextUIUpdate();

      aButtons = oPaginator.getDomRef().querySelectorAll(".sapMBtn");
      oButton0 = Element.getElementById(aButtons[0].getAttribute("id"));
      oButton1 = Element.getElementById(aButtons[1].getAttribute("id"));
      oButton2 = Element.getElementById(aButtons[2].getAttribute("id"));
      oButton3 = Element.getElementById(aButtons[3].getAttribute("id"));
      oButton6 = Element.getElementById(aButtons[6].getAttribute("id"));
      oButton10 = Element.getElementById(aButtons[10].getAttribute("id"));
      oButton11 = Element.getElementById(aButtons[11].getAttribute("id"));
      oButton12 = Element.getElementById(aButtons[12].getAttribute("id"));

      assert.strictEqual(oButton1.getText(), "1", "Button 1 text is 1");
      assert.strictEqual(oButton2.getText(), "...", "Button 2 text is ...");
      assert.strictEqual(oButton3.getText(), "4", "Button 3 text is 4");
      assert.strictEqual(oButton6.getText(), "7", "Button 3 text is 7");
      assert.strictEqual(oButton10.getText(), "...", "Button 10 text is ...");
      assert.strictEqual(oButton11.getText(), "20", "Button 11 text is 20");
      assert.strictEqual(oButton0.getEnabled(), true, "Button < is enabled");
      assert.strictEqual(oButton1.getEnabled(), true, "Button 1 is enabled");
      assert.strictEqual(oButton2.getEnabled(), true, "Button 2 is enabled");
      assert.strictEqual(oButton6.getEnabled(), false, "Button 6 is disabled");
      assert.strictEqual(oButton11.getEnabled(), true, "Button 11 is enabled");
      assert.strictEqual(oButton12.getEnabled(), true, "Button > is enabled");

      oButton2.firePress();
      await nextUIUpdate();

      aButtons = oPaginator.getDomRef().querySelectorAll(".sapMBtn");
      oButton0 = Element.getElementById(aButtons[0].getAttribute("id"));
      oButton1 = Element.getElementById(aButtons[1].getAttribute("id"));
      oButton2 = Element.getElementById(aButtons[2].getAttribute("id"));
      oButton3 = Element.getElementById(aButtons[3].getAttribute("id"));
      oButton6 = Element.getElementById(aButtons[6].getAttribute("id"));
      const oButton8 = Element.getElementById(aButtons[8].getAttribute("id"));
      let oButton9 = Element.getElementById(aButtons[9].getAttribute("id"));
      oButton10 = Element.getElementById(aButtons[10].getAttribute("id"));

      assert.strictEqual(oButton1.getText(), "1", "Button 1 text is 1");
      assert.strictEqual(oButton2.getText(), "2", "Button 2 text is 2");
      assert.strictEqual(oButton3.getText(), "3", "Button 3 text is 3");
      assert.strictEqual(oButton8.getText(), "...", "Button 10 text is ...");
      assert.strictEqual(oButton9.getText(), "20", "Button 11 text is 20");
      assert.strictEqual(oButton0.getEnabled(), true, "Button < is enabled");
      assert.strictEqual(oButton1.getEnabled(), true, "Button 1 is enabled");
      assert.strictEqual(oButton2.getEnabled(), true, "Button 2 is enabled");
      assert.strictEqual(oButton3.getEnabled(), false, "Button 3 is disabled");
      assert.strictEqual(oButton9.getEnabled(), true, "Button 9 is enabled");
      assert.strictEqual(oButton10.getEnabled(), true, "Button > is enabled");

      oButton8.firePress();
      await nextUIUpdate();

      aButtons = oPaginator.getDomRef().querySelectorAll(".sapMBtn");
      oButton11 = Element.getElementById(aButtons[11].getAttribute("id"));
      assert.strictEqual(oButton11.getEnabled(), true, "Button > is enabled");

      oButton11.firePress();
      await nextUIUpdate();

      aButtons = oPaginator.getDomRef().querySelectorAll(".sapMBtn");
      oButton9 = Element.getElementById(aButtons[9].getAttribute("id"));
      oButton10 = Element.getElementById(aButtons[10].getAttribute("id"));

      assert.strictEqual(oButton9.getEnabled(), false, "Button 9 is disabled");
      assert.strictEqual(oButton10.getEnabled(), false, "Button > is disabled");

      oPaginator.destroy();

      done();
    });
  });
});

