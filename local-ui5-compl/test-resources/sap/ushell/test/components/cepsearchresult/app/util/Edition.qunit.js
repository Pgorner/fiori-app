// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.cepsearchresult.app.Component
 */
sap.ui.define([
  "sap/base/i18n/Localization",
  "sap/ushell/components/cepsearchresult/app/util/Edition"
], function (
  Localization,
  Edition
) {
  "use strict";

  /* global QUnit */

  //set the language to en/default
  Localization.setLanguage("en");

  QUnit.test("Create with Standard Edition", function (assert) {
    const done = assert.async();
    const oEdition = new Edition("standard");

    oEdition.loaded().then(function () {
      assert.notStrictEqual(oEdition, null, "Standard Edition loaded");
      done();
    });
  });

  QUnit.test("Testing API Standard Edition", function (assert) {
    const done = assert.async();
    const oEdition = new Edition("standard");

    oEdition.loaded().then(function () {
      const oConfig = oEdition.getConfiguration();
      const oResourceModel = oEdition.getResourceModel();
      const oAppCategory = oEdition.getCategoryInstance("app");
      const oNewAppCategory = oEdition.createCategoryInstance("app");

      const oAllCategory = oEdition.getCategoryInstance("all");
      const oUnknownCategory = oEdition.getCategoryInstance("unknown");

      assert.strictEqual(oEdition.getDefaultCategory().getKey(), "app", "Standard Edition Default Category is 'app'");
      assert.strictEqual(oEdition.getDefaultCategory(), oAppCategory, "Standard Edition Default Category is same instance as getCategoryInstance('app')");
      assert.notStrictEqual(oEdition.getDefaultCategory(), oNewAppCategory, "Standard Edition Default Category is same instance as createCategoryInstance('app')");

      assert.notStrictEqual(oConfig, null, "Standard Edition Configuration available");
      assert.ok(Array.isArray(oConfig.categories), "Standard Edition Configuration contains categories");
      assert.strictEqual(oConfig.categories.length, 2, "Standard Edition Configuration contains 2 categories");
      assert.strictEqual(oConfig.categories[0].name, "all", "Standard Edition Configuration has first category 'all'");
      assert.strictEqual(oConfig.categories[1].name, "app", "Standard Edition Configuration has second category 'app'");

      assert.notStrictEqual(oResourceModel, null,
        "Standard Edition ResourceModel available");
      assert.strictEqual(oResourceModel.getMetadata().getName(), "sap.ui.model.resource.ResourceModel",
        "Standard Edition ResourceModel is a ResourceModel");
      assert.strictEqual(oResourceModel.getResourceBundle().getText("CATEGORIES.App.ShortTitle"), "Apps",
        "Standard Edition ResourceBundle contains 'CATEGORIES.App.ShortTitle' 'Apps'");

      assert.notStrictEqual(oAppCategory, null,
        "Standard Edition app Category available");
      assert.strictEqual(oAppCategory.getMetadata().getName(), "sap.ushell.components.cepsearchresult.app.util.controls.categories.Application",
        "Standard Edition app Category is a 'sap.ushell.components.cepsearchresult.app.util.controls.categories.Application'");

      assert.notStrictEqual(oAllCategory, null,
        "Standard Edition all Category available");
      assert.strictEqual(oAllCategory.getMetadata().getName(), "sap.ushell.components.cepsearchresult.app.util.controls.categories.All",
        "Standard Edition all Category is a 'sap.ushell.components.cepsearchresult.app.util.controls.categories.All'");

      assert.strictEqual(oUnknownCategory, null,
        "Standard Edition unknown Category is null");

      done();
    });
  });

  QUnit.test("Create Menu Items for Standard Edition", function (assert) {
    const done = assert.async();
    const oEdition = new Edition("standard");

    oEdition.loaded().then(function () {
      const aMenuItems = oEdition.getAppMenuItems();
      const oAppCategory = oEdition.getCategoryInstance("app");

      assert.ok(Array.isArray(aMenuItems), "Standard Edition has array of menu items");
      assert.strictEqual(aMenuItems.length, 1, "Standard Edition has one menu item");
      assert.strictEqual(aMenuItems[0].getBindingInfo("text").parts[0].path, "CATEGORIES.App.ShortTitle",
        "Standard Edition menu item text is bound to 'CATEGORIES.App.ShortTitle'");
      assert.strictEqual(aMenuItems[0].getIcon(), "sap-icon://header",
        "Standard Edition menu item icon is 'sap-icon://header'");
      assert.strictEqual(aMenuItems[0].getKey(), "app",
        "Standard Edition menu item key is 'app'");
      assert.strictEqual(aMenuItems[0]._getCategoryInstance(), oAppCategory,
        "Standard Edition menu item is connected to app category");

      assert.strictEqual(oEdition.createMenuItem(), null, "Menu item with no category");

      done();
    });
  });

  QUnit.test("Create with Advanced Edition", function (assert) {
    const done = assert.async();
    const oEdition = new Edition("advanced");

    oEdition.loaded().then(function () {
      assert.notStrictEqual(oEdition, null, "Advanced Edition loaded");
      done();
    });
  });

  QUnit.test("Testing API Advanced Edition", function (assert) {
    const done = assert.async();
    const oEdition = new Edition("advanced");

    oEdition.loaded().then(function () {
      const oConfig = oEdition.getConfiguration();
      const oResourceModel = oEdition.getResourceModel();
      const oAppCategory = oEdition.getCategoryInstance("app");
      const oNewAllCategory = oEdition.createCategoryInstance("all");

      const oAllCategory = oEdition.getCategoryInstance("all");
      const oUnknownCategory = oEdition.getCategoryInstance("unknown");

      assert.strictEqual(oEdition.getDefaultCategory().getKey(), "all", "Advanced Edition Default Category is 'app'");
      assert.strictEqual(oEdition.getDefaultCategory(), oAllCategory, "Advanced Edition Default Category is same instance as getCategoryInstance('all')");
      assert.notStrictEqual(oEdition.getDefaultCategory(), oNewAllCategory, "Advanced Edition Default Category is same instance as createCategoryInstance('all')");

      assert.notStrictEqual(oConfig, null, "Advanced Edition Configuration available");
      assert.ok(Array.isArray(oConfig.categories), "Advanced Edition Configuration contains categories");
      assert.strictEqual(oConfig.categories.length, 15, "Advanced Edition Configuration contains 2 categories");
      assert.strictEqual(oConfig.categories[0].name, "all", "Advanced Edition Configuration has first category 'all'");
      assert.strictEqual(oConfig.categories[1].name, "app", "Advanced Edition Configuration has second category 'app'");

      assert.notStrictEqual(oResourceModel, null,
        "Advanced Edition ResourceModel available");
      assert.strictEqual(oResourceModel.getMetadata().getName(), "sap.ui.model.resource.ResourceModel",
        "Advanced Edition ResourceModel is a ResourceModel");
      assert.strictEqual(oResourceModel.getResourceBundle().getText("CATEGORIES.App.ShortTitle"), "Apps",
        "Advanced Edition ResourceBundle contains 'CATEGORIES.App.ShortTitle' 'Apps'");

      assert.notStrictEqual(oAppCategory, null,
        "Advanced Edition app Category available");
      assert.strictEqual(oAppCategory.getMetadata().getName(), "sap.ushell.components.cepsearchresult.app.util.controls.categories.Application",
        "Advanced Edition app Category is a 'sap.ushell.components.cepsearchresult.app.util.controls.categories.Application'");

      assert.notStrictEqual(oAllCategory, null,
        "Advanced Edition all Category available");
      assert.strictEqual(oAllCategory.getMetadata().getName(), "sap.ushell.components.cepsearchresult.app.util.controls.categories.All",
        "Advanced Edition all Category is a 'sap.ushell.components.cepsearchresult.app.util.controls.categories.All'");

      assert.strictEqual(oUnknownCategory, null,
        "Advanced Edition unknown Category is null");

      done();
    });
  });

  QUnit.test("Create Menu Items for Advanced Edition", function (assert) {
    const done = assert.async();
    const oEdition = new Edition("advanced");

    oEdition.loaded().then(function () {
      const aMenuItems = oEdition.getAppMenuItems();
      const oAllCategory = oEdition.getCategoryInstance("all");
      const oContentCategory = oEdition.getCategoryInstance("content");

      assert.ok(Array.isArray(aMenuItems), "Advanced Edition has array of menu items");
      assert.strictEqual(aMenuItems.length, 13, "Advanced Edition has one menu item");

      assert.strictEqual(aMenuItems[0].getBindingInfo("text").parts[0].path, "CATEGORIES.All.ShortTitle",
        "Advanced Edition menu item text is bound to 'CATEGORIES.All.ShortTitle'");
      assert.strictEqual(aMenuItems[0].getIcon(), "sap-icon://search",
        "Advanced Edition menu item icon is 'sap-icon://search'");
      assert.strictEqual(aMenuItems[0].getKey(), "all",
        "Advanced Edition menu item key is 'all'");
      assert.strictEqual(aMenuItems[0]._getCategoryInstance(), oAllCategory,
        "Advanced Edition menu item is connected to all category");

      let oContentItem = null;
      aMenuItems.filter(function (oItem) {
        if (oItem.getKey() === "content") {
          oContentItem = oItem;
        }
      });
      assert.strictEqual(oContentItem.getIcon(), "sap-icon://document",
        "Advanced Edition content menu item icon is 'sap-icon://document'");
      assert.strictEqual(oContentItem._getCategoryInstance(), oContentCategory,
        "Advanced Edition content menu item is connected to content category");
      assert.strictEqual(oContentItem.getItems().length, 2,
        "Advanced Edition content menu item has 2 sub menu items");
      assert.strictEqual(oContentItem.getItems()[0].getKey(), "document",
        "Advanced Edition content menu item has sub menu item 'document'");
      assert.strictEqual(oContentItem.getItems()[1].getKey(), "video",
        "Advanced Edition content menu item has sub menu item 'video'");

      done();
    });
  });

  QUnit.test("Create with unknown Edition", function (assert) {
    const done = assert.async();
    const oEdition = new Edition("unknown");

    oEdition.loaded().catch(function () {
      assert.notStrictEqual(oEdition, null, "unknown Edition failed");
      assert.ok(Array.isArray(oEdition.getAppMenuItems()), "Empty array for menu items of unknown Edition");
      done();
    });
  });

  QUnit.test("Read Edition from Configuration", function (assert) {
    const done = assert.async();

    assert.strictEqual(Edition.getEditionName(), "standard", "Fallback without edition config is 'standard'");
    window["sap-ushell-config"] = {
      ushell: {
        cepSearchConfig: "advanced"
      }
    };
    assert.strictEqual(Edition.getEditionName(), "advanced", "Configuration on window is 'advanced'");

    done();
  });



});
