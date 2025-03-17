// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.cepsearchresult.app.Component
 */
sap.ui.define([
  "sap/base/i18n/Localization",
  "sap/ui/core/Component",
  "sap/ui/core/ComponentContainer",
  "sap/ui/qunit/utils/nextUIUpdate",
  "sap/m/library",
  "sap/ushell/ui/footerbar/AddBookmarkButton",
  "sap/ushell/EventHub",
  "sap/ushell/test/components/cepsearchresult/TestSupport",
  "sap/ushell/Container"
], function (
  Localization,
  Component,
  ComponentContainer,
  nextUIUpdate,
  mLib,
  AddBookmarkButton,
  EventHub,
  TestSupport,
  Container
) {
  "use strict";

  // set the language to en/default
  Localization.setLanguage("en");
  /* global sinon, QUnit */

  const sComponentName = "sap.ushell.components.cepsearchresult.app";
  let i = 0;

  function createComponent () {
    return Component.create({
      id: "sap.ushell.components.cepsearchresult.app.comp." + (i += 1),
      name: sComponentName
    });
  }

  function addUIComponent () {
    return new Promise(async function (resolve) {
      await Container.init("cdm");
      const oDomRef = document.createElement("div");

      createComponent().then(function (oComponent) {
        const oComponentContainer = new ComponentContainer({
          id: "sap.ushell.components.cepsearchresult.app.compcont." + (i += 1),
          component: oComponent.getId()
        });

        oDomRef.setAttribute("id", "componentInstance");
        document.body.appendChild(oDomRef);
        oDomRef.style.position = "absolute";
        oDomRef.style.top = "0px";
        oDomRef.style.width = "100%";
        oDomRef.style.zIndex = "1000";
        oComponentContainer.placeAt(oDomRef);

        resolve({
          component: oComponent,
          container: oComponentContainer,
          domRef: oDomRef,
          cleanup: function (o) {
            o.component.destroy();
            o.container.destroy();
            o.domRef.parentNode.removeChild(oDomRef);
          }
        });
      });
    });
  }

  QUnit.test("Standard Edition Test Tabs", function (assert) {
    const done = assert.async();

    addUIComponent().then(function (oTestContainer) {
      const oView = oTestContainer.component.getRootControl();
      const oController = oView.getController();

      oController._oEdition.loaded().then(async function () {
        await nextUIUpdate();
        const oTabs = oController._oTabBar;
        const aItems = oTabs.getItems();
        const oCategory = aItems[0]._getCategoryInstance();

        assert.strictEqual(oController._oEdition.getDefaultCategory().getKey(), "app", "Standard Edition default category is app");
        assert.strictEqual(aItems.length, 1, "Standard Edition has only 1 tab");
        assert.strictEqual(aItems[0].getVisible(), true, "Standard Edition has 1 visible tab");
        assert.strictEqual(oTabs.getVisible(), false, "Standard Edition tab bar is invisible");
        assert.ok(aItems[0].getText().startsWith(oCategory.translate("ShortTitle", [])), "Standard: Tab[0] text set correctly to " + aItems[0].getText());

        oTestContainer.cleanup(oTestContainer);
        done();
      });
    });
  });

  QUnit.test("Menu", function (assert) {
    const done = assert.async();
    const triggerEmailOrig = mLib.URLHelper.triggerEmail;
    const firePressOrig = AddBookmarkButton.prototype.firePress;

    mLib.URLHelper.triggerEmail = function (s, sSubject, sBody) {
      assert.ok(sSubject.startsWith("Search Results for"), "The mail subject is passed correctly");
      assert.strictEqual(sBody, document.location.href, "The mail body is the current url");
    };

    AddBookmarkButton.prototype.firePress = function () {
      assert.ok(this.getTitle().startsWith("Search for"), "Bookmark title set correctly");
      assert.strictEqual(this.getSubtitle(), "", "Bookmark subtitle set correctly");
      assert.strictEqual(this.getTileIcon(), "sap-icon://search", "Bookmark icon set correctly");
      assert.ok(this.getKeywords().startsWith("search,result,"), "Bookmark keywords set correctly");
      assert.strictEqual(this.getCustomUrl(), document.location.hash, "Bookmark custom url set correctly");
    };

    addUIComponent().then(function (oTestContainer) {
      const oView = oTestContainer.component.getRootControl();
      const oController = oView.getController();

      oController._oEdition.loaded().then(async function () {
        await nextUIUpdate();
        const oMenuButton = oController.byId("titleButton");
        oMenuButton.firePress();

        const oMenu = oController._oTitleMenu;
        const aItems = oMenu.getItems();

        assert.strictEqual(aItems.length, 2, "Standard Edition has 2 menu entries");
        assert.strictEqual(aItems[0].getVisible(), false, "The 'Save as Tile' item is currently hidden");
        assert.strictEqual(aItems[0].getBinding("text").getPath(), "SEARCHRESULTAPP.TitleMenu.SaveAsTile", "The 'Save as Tile' item has right text key");
        assert.strictEqual(aItems[1].getVisible(), true, "The 'Email' item is currently shown");
        assert.strictEqual(aItems[1].getBinding("text").getPath(), "SEARCHRESULTAPP.TitleMenu.Email", "The 'Email' item has right text key");

        aItems[0].firePress();
        aItems[1].firePress();

        mLib.URLHelper.triggerEmail = triggerEmailOrig;
        AddBookmarkButton.prototype.firePress = firePressOrig;
        oTestContainer.cleanup(oTestContainer);
        done();
      });
    });
  });

  QUnit.test("Standard Edition Routing", function (assert) {
    const done = assert.async();
    const oEventHubEmitSpy = sinon.spy(EventHub, "emit");

    addUIComponent().then(function (oTestContainer) {
      const oView = oTestContainer.component.getRootControl();
      const oController = oView.getController();

      oController.onRouteMatched({
        getParameter: function (s) {
          if (s === "arguments") {
            return {
              "?query": {
                searchTerm: "a",
                category: "app"
              }
            };
          }
        }
      });
      oController._oEdition.loaded().then(function () {
        assert.strictEqual(oController.getSearchTerm(), "a", "Search Term set via routing");
        assert.strictEqual(oController.getCategory(), "app", "Category set via routing");
        assert.strictEqual(oEventHubEmitSpy.withArgs("CloseFesrRecord").callCount, 1, "FESR Record was closed");

        oEventHubEmitSpy.restore();
        oTestContainer.cleanup(oTestContainer);
        done();
      });
    });
  });

  QUnit.test("Advanced Edition Test Tabs", function (assert) {
    const done = assert.async();

    addUIComponent().then(function (oTestContainer) {
      const oView = oTestContainer.component.getRootControl();
      const oController = oView.getController();
      oController.changeEdition("advanced");

      oController._oEdition.loaded().then(async function () {
        await nextUIUpdate();
        const oTabs = oController._oTabBar;
        const aItems = oTabs.getItems();

        assert.strictEqual(oController._oEdition.getDefaultCategory().getKey(), "all", "Advanced Edition default category is all");
        assert.strictEqual(aItems.length, 13, "Advanced Edition has 13 tab");
        assert.strictEqual(aItems.filter(function (o) {
          assert.ok(o.getText().startsWith(o._getCategoryInstance().translate("ShortTitle", [])), "Advanced Edition Tabs text set correctly to " + o.getText());
          assert.strictEqual(o.getIcon(), o._getCategoryInstance()._oCategoryConfig.icon.src, "Advanced Edition Tabs icon set correctly to " + o.getIcon());
          return o.getVisible();
        }).length, 13, "Advanced Edition has 13 visible tab");
        assert.strictEqual(oTabs.getVisible(), true, "Advanced Edition tab bar is visible");

        oTestContainer.cleanup(oTestContainer);
        done();
      });
    });
  });

  QUnit.test("Advanced Edition Routing", function (assert) {
    const done = assert.async();
    const oEventHubEmitSpy = sinon.spy(EventHub, "emit");

    addUIComponent().then(function (oTestContainer) {
      const oView = oTestContainer.component.getRootControl();
      const oController = oView.getController();

      oController.changeEdition("advanced").then(function () {
        assert.strictEqual(oController.getSearchTerm(), "", "Search Term is ''");
        assert.strictEqual(oController.getCategory(), "all", "Category is 'all'");

        oController.onRouteMatched({
          getParameter: function (s) {
            if (s === "arguments") {
              return {
                "?query": {
                  searchTerm: "a",
                  category: "app"
                }
              };
            }
          }
        });
        oController.changeEdition("advanced").then(function () {
          assert.strictEqual(oController.getSearchTerm(), "a", "Search Term 'a' via routing");
          assert.strictEqual(oController.getCategory(), "app", "Category 'app' via routing");
          assert.strictEqual(oEventHubEmitSpy.withArgs("CloseFesrRecord").callCount, 1, "FESR Record was closed");
          oEventHubEmitSpy.restore();
          oTestContainer.cleanup(oTestContainer);
          done();
        });
      });
    });
  });

});
