// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.cepsearchresult.app.Component
 */
sap.ui.define([
  "sap/base/i18n/Localization",
  "sap/ui/core/Element",
  "sap/ui/core/Theming",
  "sap/ushell/Container",
  "../../data/GetAppsResult",
  "sap/ushell/adapters/cep/SearchCEPAdapter"
], function (
  Localization,
  Element,
  Theming,
  Container,
  getAppsResult,
  SearchCEPAdapter
) {
  "use strict";

  /* global sinon, QUnit */
  const sandbox = sinon.sandbox.create();
  //set the language to en/default
  Localization.setLanguage("en");

  Theming.setTheme("sap_horizon");
  const coreLoaded = new Promise(function (resolve) {
    Theming.attachApplied(function () {
      resolve();
    });
  });

  const oDomRef = document.createElement("div");
  oDomRef.setAttribute("id", "categoryInstance");
  oDomRef.style.cssText = "position:absolute;top:0;right:0;width:700px";
  document.body.appendChild(oDomRef);

  function createCategory (oEdition, sKey) {
    return oEdition.createCategoryInstance(sKey);
  }

  QUnit.module("sap.ushell.components.cepsearchresult.app.util.controls.Category", {
    beforeEach: function (assert) {
      const done = assert.async();
      const oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
      oGetServiceAsyncStub.resolves({});

      this.oNavigationMock = {
        navigate: sandbox.stub()
      };

      oGetServiceAsyncStub.withArgs("Navigation").resolves(this.oNavigationMock);
      oGetServiceAsyncStub.withArgs("SearchableContent").resolves({
        getApps: () => {
          return getAppsResult;
        }
      });
      oGetServiceAsyncStub.withArgs("SearchCEP").resolves(new SearchCEPAdapter());

      coreLoaded.then(function () {
        sap.ui.require(["sap/ushell/components/cepsearchresult/app/util/Edition", "sap/ushell/test/components/cepsearchresult/TestSupport"], function (Edition) {
          this.oEdition = new Edition("advanced");
          this.oEdition.loaded().then(function () {
            done();
          });
        }.bind(this));
      }.bind(this));
    },
    afterEach: function () {
      sandbox.restore();
    }
  });

  QUnit.test("Create all category", function (assert) {
    const done = assert.async();
    const oCategory = createCategory(this.oEdition, "all");
    let bSearched = false;

    oCategory.attachAfterSearch(function (oEvent) {
      bSearched = true;
    });
    oCategory.attachAfterRendering(function () {
      if (!bSearched) {
        return;
      }
      oCategory.destroy();
      done();
    });
    oCategory.placeAt(oDomRef);

    assert.strictEqual(oCategory.getKey(), "all", "All category: test");

    oCategory._iAfterRenderingEventDelay = 2000;
    oCategory._iTestFetchDelay = 0;
    oCategory.search("e");
  });

  QUnit.test("Create app category, tile view", function (assert) {
    const done = assert.async();
    const oCategory = createCategory(this.oEdition, "app");
    let bSearched = false;
    oCategory.attachAfterSearch(function (oEvent) {
      bSearched = true;
      assert.strictEqual(oCategory._iCurrentCount, 10, "App category: _iCurrentCount: 10 after search");
    });
    oCategory.attachAfterRendering(function () {
      if (!bSearched) {
        return;
      }
      assert.strictEqual(oCategory._iCurrentCount, 10, "App category: _iCurrentCount: 10 after result rendering");
      assert.strictEqual(oCategory._oList.getItems().length, 10, "App category: _oList: 10 items");
      oCategory.destroy();
      done();
    });
    oCategory.placeAt(oDomRef);

    assert.strictEqual(oCategory.getPageSize(), 10, "App category: initial pageSize: 10");
    assert.strictEqual(oCategory.getShowHeader(), true, "App category: initial showHeader: true");
    assert.strictEqual(oCategory.getShowFooter(), true, "App category: initial showFooter: true");
    assert.strictEqual(oCategory.getHighlightResult(), true, "App category: initial highlightResult: true");
    assert.strictEqual(oCategory.getAllowViewSwitch(), true, "App category: initial allowViewSwitch: true");
    assert.strictEqual(oCategory.getCurrentView(), "tile", "App category: initial currentView: 'tile'");
    assert.strictEqual(oCategory._iCurrentCount, 0, "App category: _iCurrentCount: 0 before search");

    oCategory._iAfterRenderingEventDelay = 2000;
    oCategory.search("app");
  });

  QUnit.test("Create app category, list view", function (assert) {
    const done = assert.async();
    const oCategory = createCategory(this.oEdition, "app");
    let bSearched = false;
    oCategory.attachAfterSearch(function (oEvent) {
      bSearched = true;
    });
    oCategory.attachAfterRendering(() => {
      if (!bSearched) {
        return;
      }
      assert.strictEqual(oCategory._iCurrentCount, 28, "App category: _iCurrentCount: 28 after result rendering");
      assert.strictEqual(oCategory._oList.getItems().length, 5, "App category: _oList: 5 items");

      const oItem = oCategory._oList.getItems()[0];
      const oItemWithDescription = oCategory._oList.getItems()[3];
      const oItemWithKeywords = oCategory._oList.getItems()[2];
      const oViz = oItem.getContent()[0];
      const oVizWithDescription = oItemWithDescription.getContent()[0];
      const oVizWithKeywords = oItemWithKeywords.getContent()[0];
      const oKeyword1 = oViz.getItems()[2].getItems()[0];
      const oKeyword1of2 = oVizWithKeywords.getItems()[2].getItems()[0];
      const oKeyword2of2 = oVizWithKeywords.getItems()[2].getItems()[1];
      const oDescription1 = oViz.getItems()[1];
      const oDescription3 = oVizWithDescription.getItems()[1];
      oViz.getItems()[0].getItems()[2].setPreview();

      assert.strictEqual(oKeyword1.getText(), "Action", "Keyword of item 1 is 'Action'");
      assert.strictEqual(oViz.getItems()[2].getItems().length, 1, "Only 1 Keyword is displayed");
      assert.strictEqual(oKeyword1of2.getText(), "Keyword1", "Keyword1 of item 2 is 'Keyword1'");
      assert.strictEqual(oKeyword2of2.getText(), "Tag Keyword", "Keyword2 of item 2 is 'Keyword1'");
      assert.strictEqual(oDescription1.getText(), "", "Description of item 1 is ''");
      assert.strictEqual(oDescription3.getText(),
        "App State form sample description with a very long descrption for this application that can be displayed in the search result application with a list.",
        "Description of item 1 is 'App State form sample description with a very long descrption for this application that can be displayed in the search result application with a list.'");
      assert.strictEqual(oViz.getItems()[2].getItems().length, 1, "Only 1 Keyword is displayed");

      // click item
      oItem.firePress();

      setTimeout(()=>{
        assert.strictEqual(this.oNavigationMock.navigate.callCount, 1, "navigation service was called");
        oCategory.destroy();
        done();
      }, 0);
    });
    oCategory.setPageSize(5);
    oCategory.setCurrentView("list");
    oCategory.placeAt(oDomRef);

    assert.strictEqual(oCategory.getPageSize(), 5, "App category: initial pageSize: 5");
    assert.strictEqual(oCategory.getShowHeader(), true, "App category: initial showHeader: true");
    assert.strictEqual(oCategory.getShowFooter(), true, "App category: initial showFooter: true");
    assert.strictEqual(oCategory.getHighlightResult(), true, "App category: initial highlightResult: true");
    assert.strictEqual(oCategory.getAllowViewSwitch(), true, "App category: initial allowViewSwitch: true");
    assert.strictEqual(oCategory.getCurrentView(), "list", "App category: initial currentView: 'tile'");
    assert.strictEqual(oCategory._iCurrentCount, 0, "App category: _iCurrentCount: 0 before search");
    oCategory._iAfterRenderingEventDelay = 2000;
    oCategory.search("a");
  });

  QUnit.test("Create app category, list view, empty search", function (assert) {
    const done = assert.async(2);
    const oCategory = createCategory(this.oEdition, "app");
    let bSearched = false;
    oCategory.attachAfterSearch(function (oEvent) {
      bSearched = true;
      assert.strictEqual(oCategory._iCurrentCount, 28, "App category: _iCurrentCount: 28 after search");
      done();
    });
    oCategory.attachAfterRendering(function () {
      if (!bSearched) {
        return;
      }
      assert.strictEqual(oCategory._iCurrentCount, 28, "App category: _iCurrentCount: 28 after result rendering");
      oCategory.destroy();
      done();
    });
    oCategory.placeAt(oDomRef);
    oCategory.search("");
  });

  QUnit.test("Create event category, list view, illustrations", function (assert) {
    const done = assert.async();
    const oCategory = createCategory(this.oEdition, "event");
    oCategory.attachAfterRendering(function () {
      console.error("FOOOOOOOOOOOO");
      oCategory._oViewSwitch.getItems()[1].getDomRef().click();
      oCategory.refreshData();

      assert.strictEqual(oCategory.getResultCount(), 12, "Event category: resultCount: 0 after refresh");

      oCategory.destroy();
      done();
    });
    oCategory.placeAt(oDomRef);

    assert.strictEqual(oCategory.getPageSize(), 10, "Event category: initial pageSize: 10");
    assert.strictEqual(oCategory.getShowHeader(), true, "Event category: initial showHeader: true");
    assert.strictEqual(oCategory.getShowFooter(), true, "Event category: initial showFooter: true");
    assert.strictEqual(oCategory.getHighlightResult(), true, "Event category: initial highlightResult: true");
    assert.strictEqual(oCategory.getAllowViewSwitch(), true, "Event category: initial allowViewSwitch: true");
    assert.strictEqual(oCategory.getCurrentView(), "list", "Event category: initial currentView: 'list'");
    assert.strictEqual(oCategory._iCurrentCount, 0, "Event category: _iCurrentCount: 0 before search");

    oCategory._iAfterRenderingEventDelay = 2000;
    oCategory.setUseIllustrations(true);
    oCategory.search("E");
  });

});

