// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.cepsearchresult.app.Component
 */
sap.ui.define([
  "sap/base/i18n/Localization",
  "sap/ui/integration/widgets/Card",
  "sap/ui/qunit/utils/nextUIUpdate",
  "sap/ushell/components/cepsearchresult/app/util/controls/Category",
  "sap/ushell/Container",
  "../../data/GetAppsResult",
  "sap/ushell/adapters/cep/SearchCEPAdapter"
], function (
  Localization,
  UIIntegrationCard,
  nextUIUpdate,
  Category,
  Container,
  getAppsResult,
  SearchCEPAdapter
) {

  "use strict";

  /* global sinon, QUnit */
  const sandbox = sinon.sandbox.create();

  // set the language to en/default
  Localization.setLanguage("en");
  Category.prototype._iTestFetchDelay = 0;

  QUnit.module("SearchResultWidget initialization - sap.ushell.components.cepsearchresult.cards.searchresultwidget", {
    beforeEach: function (assert) {
      let iTimeout;
      this.oCard = new UIIntegrationCard({
        dataMode: "Active",
        manifest: sap.ui.require.toUrl("sap/ushell/components/cepsearchresult/app/cards/searchresultwidget") + "/manifest.json"
      });
      this.oCard.setParameters({
        searchTerm: "",
        category: "app",
        edition: "standard",
        currentView: "tile",
        showHeader: true
      });
      const oDomRef = document.createElement("div");
      oDomRef.setAttribute("id", "cardInstance");
      document.body.appendChild(oDomRef);
      oDomRef.style.position = "absolute";
      oDomRef.style.top = "0px";
      oDomRef.style.left = "0px";
      oDomRef.style.width = "1000px";
      oDomRef.style.zIndex = "1000";

      this.oCard.placeAt(oDomRef);

      this.oCard.attachEvent("manifestApplied", function () {
        assert.ok(true, "Card created");
      });
      this.oCard.attachEvent("beforeSearch", async function () {
        await nextUIUpdate();
      });
      this.oCard.attachEvent("afterSearch", async function () {
        await nextUIUpdate();
      });
      this.oCard.attachEvent("afterRendering", function () {
        if (iTimeout) {
          clearTimeout(iTimeout);
        }
        iTimeout = setTimeout(this.testAfterRendering, 1000);
      }.bind(this));
      this.testAfterRendering = function () { };

      const oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
      oGetServiceAsyncStub.withArgs("SearchableContent").resolves({getApps: () => getAppsResult});

      oGetServiceAsyncStub.withArgs("SearchCEP").resolves(new SearchCEPAdapter());
    },
    afterEach: function () {
      this.oCard.destroy();
      document.body.removeChild(document.getElementById("cardInstance"));
      sandbox.restore();
    }
  });

  QUnit.test("Create with Standard Edition only app", function (assert) {
    const done = assert.async();
    const oCard = this.oCard;
    this.testAfterRendering = function () {
      const oCategory = oCard.getCardContent().getAggregation("_content").getComponentInstance()._oCategory;
      const oFooter = oCategory.getAggregation("_footer");
      const oPaginator = oFooter.getContent()[1];
      const oHeader = oCard.getCardHeader();

      assert.strictEqual(oHeader.getTitle(), "Applications (28)", "Card Header Title contains result count");
      assert.strictEqual(oHeader.getSubtitle(), "Results for ''", "Card Header Subtitle contains search term");
      assert.strictEqual(oPaginator.getPageSize(), 5, "Paginator Page Size is 5");
      assert.strictEqual(oPaginator.getCount(), 28, "Paginator Count 28");

      if (oPaginator.getCurrentPage() === 1) {
        assert.strictEqual(oHeader.getStatusText(), "1-5 of 28", "Card Header Status text is 1-5 of 28");
        assert.strictEqual(oPaginator.getCurrentPage(), 1, "Paginator Current Page 1");
        oPaginator._setCurrentPageWithEvent(2);
      } else if (oPaginator.getCurrentPage() === 2) {
        assert.strictEqual(oHeader.getStatusText(), "6-10 of 28", "Card Header Status text is 6-10 of 28");
        assert.strictEqual(oPaginator.getCurrentPage(), 2, "Paginator Current Page 2");
        oPaginator._setCurrentPageWithEvent(6);
      } else if (oPaginator.getCurrentPage() === 6) {
        assert.strictEqual(oHeader.getStatusText(), "26-28 of 28", "Card Header Status text is 26-28 of 28");
        assert.strictEqual(oPaginator.getCurrentPage(), 6, "Paginator Current Page 7");
        done();
      }
    };
    setTimeout(function () {

    }, 1000);
  });

  QUnit.test("Create with Standard Edition category app reduced page size, search for app", function (assert) {
    const done = assert.async();
    const oCard = this.oCard;
    this.oCard.setParameters({
      searchTerm: "app",
      category: "app",
      pageSize: 3
    });
    this.testAfterRendering = function () {

      const oCategory = oCard.getCardContent().getAggregation("_content").getComponentInstance()._oCategory;
      const oFooter = oCategory.getAggregation("_footer");
      const oPaginator = oFooter.getContent()[1];
      const oHeader = oCard.getCardHeader();

      assert.strictEqual(oHeader.getTitle(), "Applications (10)", "Card Header Title contains result count");
      assert.strictEqual(oHeader.getSubtitle(), "Results for 'app'", "Card Header Subtitle contains search term 'app'");
      assert.strictEqual(oPaginator.getPageSize(), 3, "Paginator Page Size is 3");
      assert.strictEqual(oPaginator.getCount(), 10, "Paginator Count 10");
      assert.strictEqual(oPaginator.getCurrentPage(), 1, "Paginator Current Page 1");
      done();
    };
  });

  QUnit.test("Create with Standard Edition only app searchTerm='co'", function (assert) {
    const done = assert.async();
    const oCard = this.oCard;
    oCard.setParameters({
      searchTerm: "co",
      category: "app"
    });
    this.testAfterRendering = function () {
      const oCategory = oCard.getCardContent().getAggregation("_content").getComponentInstance()._oCategory;
      const oFooter = oCategory.getAggregation("_footer");
      const oPaginator = oFooter.getContent()[1];
      const oHeader = oCard.getCardHeader();

      assert.strictEqual(oHeader.getTitle(), "Applications (5)", "Card Header Title contains result count");
      assert.strictEqual(oHeader.getSubtitle(), "Results for 'co'", "Card Header Subtitle contains search term 'co'");
      assert.strictEqual(oPaginator.getPageSize(), 5, "Paginator Page Size is 5");
      assert.strictEqual(oPaginator.getCount(), 5, "Paginator Count 5");
      assert.strictEqual(oPaginator.getCurrentPage(), 1, "Paginator Current Page 1");
      done();
    };
  });

  QUnit.test("Create with Standard Edition only app searchTerm='mmmmmmmm'", function (assert) {
    const done = assert.async();
    const oCard = this.oCard;
    oCard.setParameters({
      searchTerm: "mmmmmmmm",
      category: "app"
    });
    this.testAfterRendering = function () {
      const oCategory = oCard.getCardContent().getAggregation("_content").getComponentInstance()._oCategory;
      const oFooter = oCategory.getAggregation("_footer");
      const oPaginator = oFooter.getContent()[1];
      const oHeader = oCard.getCardHeader();

      assert.strictEqual(oHeader.getTitle(), "Applications (0)", "Card Header Title contains result count");
      assert.strictEqual(oHeader.getSubtitle(), "Results for 'mmmmmmmm'", "Card Header Subtitle contains search term 'mmmmmmmm'");
      assert.strictEqual(oPaginator.getPageSize(), 5, "Paginator Page Size is 5");
      assert.strictEqual(oPaginator.getCount(), 0, "Paginator Count 0");
      assert.strictEqual(oPaginator.getCurrentPage(), 1, "Paginator Current Page 1");
      done();
    };
  });

  QUnit.test("Check highlighting searchTerm='app', highlighting on", function (assert) {
    const done = assert.async();
    const oCard = this.oCard;
    oCard.setParameters({
      searchTerm: "app",
      categories: "app",
      highlightResult: true
    });
    this.testAfterRendering = function () {
      const oCategory = oCard.getCardContent().getAggregation("_content").getComponentInstance()._oCategory;
      const aRemovedHighlight = oCategory.getDomRef().querySelectorAll(".resetHighlight .defaultHighlightedText");

      assert.strictEqual(oCategory.getDomRef().querySelectorAll(".defaultHighlightedText").length - aRemovedHighlight.length, 10, "5 visually highlighted in list and 5 hidden on tile");
      done();
    };
  });

  QUnit.test("Check highlighting searchTerm='app', highlighting off", function (assert) {
    const done = assert.async();
    const oCard = this.oCard;
    oCard.setParameters({
      searchTerm: "app",
      categories: "app",
      highlightResult: false
    });
    this.testAfterRendering = function () {
      const oCategory = oCard.getCardContent().getAggregation("_content").getComponentInstance()._oCategory;

      assert.strictEqual(oCategory.getDomRef().querySelectorAll(".defaultHighlightedText").length, 0, "0 highlighted in list");
      done();
    };
  });

  QUnit.test("Check custom header", function (assert) {
    const done = assert.async();
    const oCard = this.oCard;
    oCard.setParameters({
      searchTerm: "app",
      categories: "app",
      highlightResult: false,
      header: "custom"
    });
    this.testAfterRendering = function () {
      assert.strictEqual(oCard.getCardHeader().getTitle(), "Custom Title (10)", "Custom Title is 'Custom Title (10)'");
      assert.strictEqual(oCard.getCardHeader().getSubtitle(), "Custom Subtitle 'app'", "Custom Subtitle is 'Custom Subtitle 'app''");
      assert.strictEqual(oCard.getCardHeader().getIconBackgroundColor(), "Accent10", "Custom IconBG is 'Accent10'");
      assert.strictEqual(oCard.getCardHeader().getIconSrc(), "sap-icon://search", "Custom IconSrc is 'sap-icon://search'");
      assert.strictEqual(oCard.getCardHeader().getStatusText(), "1-5 of 10", "Status Text is '1-5 of 10'");
      assert.strictEqual(oCard.getCardHeader().getVisible(), true, "Header is visible");
      done();
    };
  });

  QUnit.test("Check no header", function (assert) {
    const done = assert.async();
    const oCard = this.oCard;
    oCard.setParameters({
      searchTerm: "app",
      categories: "app",
      highlightResult: false,
      header: "none"
    });
    this.testAfterRendering = function () {
      assert.strictEqual(oCard.getCardHeader().getTitle(), "Custom Title (10)", "Custom Title is 'Custom Title (10)'");
      assert.strictEqual(oCard.getCardHeader().getSubtitle(), "Custom Subtitle 'app'", "Custom Subtitle is 'Custom Subtitle 'app''");
      assert.strictEqual(oCard.getCardHeader().getIconBackgroundColor(), "Accent10", "Custom IconBG is 'Accent10'");
      assert.strictEqual(oCard.getCardHeader().getIconSrc(), "sap-icon://search", "Custom IconSrc is 'sap-icon://search'");
      assert.strictEqual(oCard.getCardHeader().getStatusText(), "1-5 of 10", "Status Text is '1-5 of 10'");
      assert.strictEqual(oCard.getCardHeader().getVisible(), false, "Header is not visible");
      done();
    };
  });

  QUnit.test("Open Configuration Dialog", function (assert) {
    const done = assert.async();
    const oCard = this.oCard;
    oCard.setParameters({
      searchTerm: "app",
      categories: "app",
      highlightResult: false
    });
    sap.ui.require(["sap-ui-integration-card-editor"], function () {
      sap.ui.require(["sap/m/Button", "sap/m/Dialog", "sap/m/MessageToast", "sap/ui/integration/designtime/editor/CardEditor"], function (Button, Dialog, MessageToast, CardEditor) {
        var oEditor = new CardEditor({
          card: oCard,
          mode: "content"
        });
        var oDialog = new Dialog({
          title: "Configure Search Result Card",
          horizontalScrolling: false,
          content: oEditor,
          beginButton: new Button({
            type: "Emphasized",
            text: "OK",
            press: function () {
              MessageToast.show("Apply settings");
              oCard.setManifestChanges([oEditor.getCurrentSettings()]);
              oDialog.close();
            }
          }),
          endButton: new Button({
            text: "Close",
            press: function () {
              oDialog.close();
            }
          }),
          contentWidth: "45rem",
          contentHeight: "25rem"
        });
        oDialog.open();
        oEditor.attachReady(async function () {
          oEditor.invalidate();
          await nextUIUpdate();

          assert.strictEqual(oEditor.getDomRef().querySelectorAll(".sapUiIntegrationEditorEditor").length, 9, "Editor contains 9 fields");

          oDialog.close();
          oEditor.destroy();
          oDialog.destroy();
          done();
        });
      });
    });
  });
});

