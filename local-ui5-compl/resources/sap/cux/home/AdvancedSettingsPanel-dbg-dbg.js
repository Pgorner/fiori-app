/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/Log", "sap/insights/CardHelper", "sap/m/Button", "sap/m/CheckBox", "sap/m/CustomListItem", "sap/m/HBox", "sap/m/IconTabBar", "sap/m/IconTabFilter", "sap/m/Input", "sap/m/Label", "sap/m/library", "sap/m/List", "sap/m/MessageStrip", "sap/m/MessageToast", "sap/m/ObjectStatus", "sap/m/OverflowToolbar", "sap/m/Panel", "sap/m/Text", "sap/m/Title", "sap/m/Toolbar", "sap/m/ToolbarSpacer", "sap/m/VBox", "sap/ui/core/Element", "sap/ui/core/EventBus", "sap/ui/core/library", "sap/ui/layout/form/SimpleForm", "sap/ui/model/json/JSONModel", "sap/ui/unified/FileUploader", "sap/ushell/Container", "./BaseSettingsPanel", "./utils/AppManager", "./utils/Constants", "./utils/FESRUtil", "./utils/HttpHelper", "./utils/PageManager", "./utils/PersonalisationUtils", "./utils/UshellPersonalizer"], function (Log, CardHelper, Button, CheckBox, CustomListItem, HBox, IconTabBar, IconTabFilter, Input, Label, sap_m_library, List, MessageStrip, MessageToast, ObjectStatus, OverflowToolbar, Panel, Text, Title, Toolbar, ToolbarSpacer, VBox, Element, EventBus, sap_ui_core_library, SimpleForm, JSONModel, FileUploader, Container, __BaseSettingsPanel, __AppManager, ___utils_Constants, ___utils_FESRUtil, __HttpHelper, __PageManager, __PersonalisationUtils, __UShellPersonalizer) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  function _catch(body, recover) {
    try {
      var result = body();
    } catch (e) {
      return recover(e);
    }
    if (result && result.then) {
      return result.then(void 0, recover);
    }
    return result;
  }
  const FlexAlignItems = sap_m_library["FlexAlignItems"];
  const ToolbarStyle = sap_m_library["ToolbarStyle"];
  const ValueState = sap_ui_core_library["ValueState"];
  const BaseSettingsPanel = _interopRequireDefault(__BaseSettingsPanel);
  const AppManager = _interopRequireDefault(__AppManager);
  const FEATURE_TOGGLES = ___utils_Constants["FEATURE_TOGGLES"];
  const SETTINGS_PANELS_KEYS = ___utils_Constants["SETTINGS_PANELS_KEYS"];
  const addFESRSemanticStepName = ___utils_FESRUtil["addFESRSemanticStepName"];
  const FESR_EVENTS = ___utils_FESRUtil["FESR_EVENTS"];
  const HttpHelper = _interopRequireDefault(__HttpHelper);
  const PageManager = _interopRequireDefault(__PageManager);
  const PersonalisationUtils = _interopRequireDefault(__PersonalisationUtils);
  const UShellPersonalizer = _interopRequireDefault(__UShellPersonalizer);
  var ImportExportType = /*#__PURE__*/function (ImportExportType) {
    ImportExportType["IMPORT"] = "import";
    ImportExportType["EXPORT"] = "export";
    return ImportExportType;
  }(ImportExportType || {});
  const BASE_URL = "/sap/opu/odata4/ui2/insights_srv/srvd/ui2/";
  const REPO_BASE_URL = BASE_URL + "insights_cards_repo_srv/0001/";
  const EXPORT_API = REPO_BASE_URL + "INSIGHTS_CARDS/com.sap.gateway.srvd.ui2.insights_cards_repo_srv.v0001.importExport?";
  const MYINSIGHT_SECTION_ID = "AZHJGRIT78TG7Y65RF6EPFJ9U";

  /**
   *
   * Class for My Home Advanced Settings Panel.
   *
   * @extends BaseSettingsPanel
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121
   *
   * @internal
   * @experimental Since 1.121
   * @private
   *
   * @alias sap.cux.home.AdvancedSettingsPanel
   */
  const AdvancedSettingsPanel = BaseSettingsPanel.extend("sap.cux.home.AdvancedSettingsPanel", {
    metadata: {
      events: {
        sectionsImported: {}
      }
    },
    /**
     * Init lifecycle method
     *
     * @public
     * @override
     */
    init: function _init() {
      BaseSettingsPanel.prototype.init.call(this);

      //setup panel
      this.setProperty("key", SETTINGS_PANELS_KEYS.ADVANCED);
      this.setProperty("title", this._i18nBundle.getText("advancedSettings"));
      this.setProperty("icon", "sap-icon://grid");
      this.oEventBus = EventBus.getInstance();
      this.oAppManagerInstance = AppManager.getInstance();
      this.oSectionsImported = {};
      this.oUserPersonalization = {
        export: {
          sections: [],
          fileName: "MY_HOME",
          sectionsSelected: false,
          error: false
        },
        import: {
          sections: [],
          sectionsSelected: false,
          error: false
        },
        selectedTab: "export",
        showNoImport: false
      };
      this.oControlModel = new JSONModel(this.oUserPersonalization);
      //setup layout content
      this.addAggregation("content", this.getContent());
      this.addInnerContent();
      //fired every time on panel navigation
      this.attachPanelNavigated(() => {
        const _this = this;
        void function () {
          try {
            if (!_this.oPageManagerInstance) {
              _this.oPageManagerInstance = PageManager.getInstance(PersonalisationUtils.getPersContainerId(_this._getPanel()), PersonalisationUtils.getOwnerComponent(_this._getPanel()));
            }

            // subscribe to all import events for all sections
            _this.oEventBus.subscribe("importChannel", "tilesImported", (channelId, eventId, data) => {
              const customData = data.status;
              //errorstate is false when import is successful
              _this.updateImportStatus("insightsTiles", !customData);
            }, _this);
            _this.oEventBus.subscribe("importChannel", "appsImported", (channelId, eventId, data) => {
              const customData = data.status;
              //errorstate is false when import is successful
              _this.updateImportStatus("favApps", !customData);
            }, _this);
            _this.oEventBus.subscribe("importChannel", "favPagesImported", (channelId, eventId, data) => {
              const customData = data.status;
              //errorstate is false when import is successful
              _this.updateImportStatus("pages", !customData);
            }, _this);
            _this.oEventBus.subscribe("importChannel", "cardsImported", (channelId, eventId, data) => {
              const customData = data.status;
              //errorstate is false when import is successful
              _this.updateImportStatus("insightsCards", !customData);
            }, _this);

            //get the detailPage of advanced settingspanel
            _this.oDetailPage = Element.getElementById(_this.getProperty("key") + "-detail-page");
            void _this._setRecommendationSettingsPanel();

            //load user personalization data
            return Promise.resolve(_this.loadUserPersonalizationData()).then(function () {
              //import button set enabled/disabled based on sections selected
              _this.oImportBtn.setEnabled(_this.oUserPersonalization.import.sectionsSelected);
              _this.enableDisableActions(_this.oUserPersonalization.selectedTab);

              //set export and import list
              _this.setImportExportList();
              _this.oExportMessage.setText(_this.oUserPersonalization.export.errorMessage ? String(_this.oUserPersonalization.export.errorMessage) : "");
              _this.oExportMessage.setType(_this.oUserPersonalization.export.errorType);
              _this.oExportMessage.setProperty("visible", _this.oUserPersonalization.export.error, true);
              _this.oFileNameInput.setValue(String(_this.oUserPersonalization.export.fileName));
              _this.oImportMessage.setText(_this.oUserPersonalization.import.errorMessage ? String(_this.oUserPersonalization.import.errorMessage) : "");
              _this.oImportMessage.setType(_this.oUserPersonalization.import.errorType);
              _this.oImportMessage.setProperty("visible", _this.oUserPersonalization.import.error, true);
            });
          } catch (e) {
            return Promise.reject(e);
          }
        }();
      });
    },
    setImportExportList: function _setImportExportList() {
      if (!this.oExportList) {
        this.oExportList = this.setExportSectionList();
        this._importExportPanel.addContent(this.oExportList);
      } else {
        this.oExportList.invalidate();
      }
      if (!this.oImportList) {
        this.oImportList = this.setImportSectionList();
        this._importExportPanel.addContent(this.oImportList);
      } else {
        this.oImportList.invalidate();
      }
    },
    /**
     *
     * @param sType selected tab type
     * Set import / export button enable property and selectedkey of importexport tab
     */
    enableDisableActions: function _enableDisableActions(sType) {
      this.oImportExportTab?.setSelectedKey(sType);
      this.oImportBtn?.setVisible(sType === ImportExportType.IMPORT);
      this.oExportBtn?.setVisible(sType === ImportExportType.EXPORT);
      if (this.oUserPersonalization.import.sectionsSelected && sType === ImportExportType.IMPORT) {
        this.oImportBtn.setEnabled(true);
      } else {
        this.oImportBtn.setEnabled(false);
      }
      if (sType === ImportExportType.EXPORT && this.oUserPersonalization.export.fileName && this.oUserPersonalization.export.sections?.length && this.oUserPersonalization.export.sectionsSelected) {
        this.oExportBtn.setEnabled(true);
      } else {
        this.oExportBtn.setEnabled(false);
      }
    },
    /**
     *
     * @param sType selected tab type
     * Set import/ export message values
     */
    setExportImportValues: function _setExportImportValues(sType) {
      if (sType === ImportExportType.EXPORT) {
        this.oExportMessage.setText(this.oUserPersonalization.export.errorMessage ? String(this.oUserPersonalization.export.errorMessage) : "");
        this.oExportMessage.setType(this.oUserPersonalization.export.errorType);
        this.oExportMessage.setProperty("visible", this.oUserPersonalization.export.error, true);
      } else if (sType === ImportExportType.IMPORT) {
        this.oImportMessage.setText(this.oUserPersonalization.import.errorMessage ? String(this.oUserPersonalization.export.errorMessage) : "");
        this.oImportMessage.setType(this.oUserPersonalization.import.errorType);
        this.oImportMessage.setProperty("visible", this.oUserPersonalization.import.error, true);
      }
    },
    /**
     * Sets the outer content VBox for the Advanced Settings Panel.
     * @returns VBox
     */
    getContent: function _getContent() {
      if (!this.oContentVBox) {
        this.oContentVBox = new VBox(this.getId() + "--idAdvancedVBox", {
          items: [new Text(this.getId() + "--idPersonalizationSubheader", {
            text: this._i18nBundle.getText("advancedSettingsSubheader")
          }).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginTop"), this._getImportExportPanel()]
        });
      }
      return this.oContentVBox;
    },
    /**
     * Returns the import/export panel.
     *
     * @private
     * @returns {Panel} The import/export panel.
     */
    _getImportExportPanel: function _getImportExportPanel() {
      if (!this._importExportPanel) {
        this._importExportPanel = new Panel(`${this.getId()}-importExportPanel`, {
          headerToolbar: new OverflowToolbar(`${this.getId()}-importExportPanelToolbar`, {
            style: ToolbarStyle.Clear,
            content: [new Text(`${this.getId()}-importExportPanelToolbarText`, {
              text: this._i18nBundle.getText("importAndExportPanelHeader")
            }), new ToolbarSpacer(`${this.getId()}-importExportPanelToolbarSpacer`), this._getImportButton(), this._getExportButton()]
          }),
          headerText: this._i18nBundle.getText("importAndExportPanelHeader"),
          expanded: true,
          expandable: true,
          content: []
        }).addStyleClass("sapUiSmallMarginTop");
      }
      return this._importExportPanel;
    },
    /**
     * Returns the import button.
     *
     * @private
     * @returns {Button} import button.
     */
    _getImportButton: function _getImportButton() {
      if (!this.oImportBtn) {
        this.oImportBtn = new Button({
          id: `${this.getId()}-importBtn`,
          text: this._i18nBundle.getText("import"),
          type: "Transparent",
          press: () => {
            void this.onImportPress();
          },
          visible: false
        });
        addFESRSemanticStepName(this._getExportButton(), FESR_EVENTS.PRESS, "importBtn");
      }
      return this.oImportBtn;
    },
    /**
     * Returns the export button.
     *
     * @private
     * @returns {Button} export button.
     */
    _getExportButton: function _getExportButton() {
      if (!this.oExportBtn) {
        this.oExportBtn = new Button({
          id: `${this.getId()}-exportBtn`,
          text: this._i18nBundle.getText("export"),
          type: "Transparent",
          press: this.onExportPress.bind(this),
          visible: true
        });
        addFESRSemanticStepName(this.oExportBtn, FESR_EVENTS.PRESS, "exportBtn");
      }
      return this.oExportBtn;
    },
    /**
     * Returns the inner content for the Advanced Settings Panel.
     *
     * @private
     * @returns {Control} The control containing the Advanced Settings Panel content.
     */
    addInnerContent: function _addInnerContent() {
      //if not already initialised, create the import/export tab and inner controls
      if (!this.oImportExportTab) {
        this.oImportExportTab = new IconTabBar(this.getId() + "--idImportExportTab", {
          expandable: false,
          backgroundDesign: "Transparent",
          selectedKey: this.oSelectedTab ? this.oSelectedTab : "export",
          select: this.onImportExportTabSelect.bind(this)
        });
        const exportTab = new IconTabFilter(this.getId() + "--idExportTab", {
          key: "export",
          text: this._i18nBundle.getText("exportFile")
        });
        // Add FESR for export tab
        addFESRSemanticStepName(exportTab, FESR_EVENTS.SELECT, "exportTab");

        //export tab content
        this.oExportMessage = new MessageStrip(this.getId() + "--idExportMessageStrip", {
          showIcon: true,
          visible: false
        }).addStyleClass("sapUiNoMarginBegin sapUiTinyMarginBottom");
        const exportText = new Text(this.getId() + "--idExportText", {
          text: this._i18nBundle.getText("exportText")
        }).addStyleClass("advancePadding");
        const fileInputContainer = new HBox(this.getId() + "--idFileInputContainer", {
          alignItems: "Center"
        }).addStyleClass("sapUiSmallMargin");
        const filenameLabel = new Label(this.getId() + "--idFilenameLabel", {
          text: this._i18nBundle.getText("exportFileNameLabel"),
          labelFor: "idTitleFilenameInput",
          required: true,
          showColon: true
        }).addStyleClass("sapUiSmallMarginEnd");
        this.oFileNameInput = new Input(this.getId() + "--idFileNameInput", {
          ariaLabelledBy: ["idExportText", "idFilenameLabel"],
          required: true,
          width: "13rem",
          liveChange: this.onFileNameInputChange.bind(this),
          value: ""
        });
        fileInputContainer.addItem(filenameLabel);
        fileInputContainer.addItem(this.oFileNameInput);
        exportTab.addContent(this.oExportMessage);
        exportTab.addContent(exportText);
        exportTab.addContent(fileInputContainer);

        //import tab
        const importTab = new IconTabFilter(this.getId() + "--idImportTab", {
          key: "import",
          text: this._i18nBundle.getText("importFile")
        });
        // Add FESR for import tab
        addFESRSemanticStepName(importTab, FESR_EVENTS.SELECT, "importTab");

        //import tab content
        this.oImportMessage = new MessageStrip(this.getId() + "--idImportMessageStrip", {
          text: "{advsettings>/import/errorMessage}",
          type: "{advsettings>/import/errorType}",
          showIcon: true,
          visible: false
        }).addStyleClass("sapUiNoMarginBegin sapUiTinyMarginBottom");
        const importText = new Text(this.getId() + "--idImportText", {
          text: this._i18nBundle.getText("importText")
        }).addStyleClass("advancePadding");
        const importSimpleForm = new SimpleForm(this.getId() + "--idImportSimpleForm", {
          editable: true,
          layout: "ResponsiveGridLayout",
          labelSpanS: 4,
          labelSpanM: 4
        });
        const fileUploader = new FileUploader(this.getId() + "--idImportFileUploader", {
          tooltip: this._i18nBundle.getText("uploadImportFile"),
          fileType: ["txt"],
          change: oEvent => {
            void this.onFileImport(oEvent);
          },
          maximumFileSize: 25,
          sameFilenameAllowed: true,
          width: "80%",
          ariaLabelledBy: ["idImportText"],
          buttonText: this._i18nBundle.getText("importFileUploaderButton")
        });
        importSimpleForm.addContent(fileUploader);
        importTab.addContent(this.oImportMessage);
        importTab.addContent(importText);
        importTab.addContent(importSimpleForm);
        const classicImportTab = new IconTabFilter(this.getId() + "--idClassicImportTab", {
          key: "classicImport",
          text: this._i18nBundle.getText("classicImport")
        });
        // Add FESR for classic import tab
        addFESRSemanticStepName(classicImportTab, FESR_EVENTS.SELECT, "classicImportTab");
        const classicText = new Text(this.getId() + "--idClassicImportText", {
          text: this._i18nBundle.getText("classicImportText")
        }).addStyleClass("sapUiSmallMarginBottom advancePadding");
        const resetImportAppsNow = new Button(this.getId() + "--resetImportAppsNow", {
          text: this._i18nBundle.getText("resetButton"),
          press: this.onResetImportApps.bind(this)
        }).addStyleClass("resetButtonPadding");
        addFESRSemanticStepName(resetImportAppsNow, FESR_EVENTS.PRESS, "resetImportApps");
        classicImportTab.addContent(classicText);
        classicImportTab.addContent(resetImportAppsNow);
        this.oImportExportTab.addItem(exportTab);
        this.oImportExportTab.addItem(importTab);
        this.oImportExportTab.addItem(classicImportTab);
        this._importExportPanel.addContent(this.oImportExportTab);
        this._importExportPanel.addContent(this.setExportSectionList());
      }
    },
    /**
     *
     * @returns {List} export section list
     */
    setExportSectionList: function _setExportSectionList() {
      const exportSectionsList = new List(this.getId() + "--idExportSectionsList", {
        width: "calc(100% - 2rem)",
        growingThreshold: 50,
        includeItemInSelection: true,
        visible: "{= ${advsettings>/selectedTab} === 'export'}"
      }).addStyleClass("sapUiSmallMarginBegin");
      const headerToolbar = new Toolbar(this.getId() + "--idExportSectionsListToolbar", {
        content: [new Title(this.getId() + "--idExportSectionsListHeaderText", {
          text: this._i18nBundle.getText("sectionExportListHeader")
        }).addStyleClass("sectionTitle")]
      });
      exportSectionsList.setHeaderToolbar(headerToolbar);
      //set model for the list and bind items to path advsettings>/export/sections
      exportSectionsList.setModel(this.oControlModel, "advsettings");
      exportSectionsList.bindItems({
        path: "advsettings>/export/sections",
        template: new CustomListItem({
          content: [new HBox({
            alignItems: "Center",
            items: [new CheckBox(this.getId() + "--idExportListItemCheck", {
              select: this.onSectionsSelectionChange.bind(this, false),
              selected: "{advsettings>selected}",
              enabled: "{advsettings>enabled}"
            }), new Text(this.getId() + "--idExportListItemText", {
              text: "{advsettings>title}"
            }).addStyleClass("sapUiTinyMarginTop")],
            width: "100%"
          })]
        })
      });
      this.oExportList = exportSectionsList;
      return exportSectionsList;
    },
    /**
     *
     * @returns {List} import section list
     */
    setImportSectionList: function _setImportSectionList() {
      const importSectionsList = new List(this.getId() + "--idImportSectionsList", {
        width: "calc(100% - 2rem)",
        growingThreshold: 50,
        includeItemInSelection: true,
        visible: "{= ${advsettings>/selectedTab} === 'import' && (${advsettings>/import/sections/length} > 0 || ${advsettings>/showNoImport})}"
      }).addStyleClass("sapUiSmallMarginBegin");
      const headerToolbar = new Toolbar(this.getId() + "--idImportSectionsListToolbar", {
        content: [new Title(this.getId() + "--idImportSectionsListHeaderText", {
          text: this._i18nBundle.getText("sectionImportListHeader")
        }).addStyleClass("sectionTitle")]
      });
      importSectionsList.setHeaderToolbar(headerToolbar);
      //set model for the list and bind items to path advsettings>/import/sections
      importSectionsList.setModel(this.oControlModel, "advsettings");
      importSectionsList.bindItems({
        path: "advsettings>/import/sections",
        template: new CustomListItem({
          content: [new HBox({
            justifyContent: "SpaceBetween",
            items: [new HBox({
              items: [new CheckBox(this.getId() + "--idImportListItemCheck", {
                select: this.onSectionsSelectionChange.bind(this, true),
                selected: "{advsettings>selected}",
                enabled: "{advsettings>enabled}"
              }), new Text(this.getId() + "--idImportListItemText", {
                text: "{advsettings>title}"
              }).addStyleClass("sapUiTinyMarginTop")]
            }), new HBox({
              items: [new ObjectStatus(this.getId() + "--idImportItemStatus", {
                icon: "{= ${advsettings>status} === 'Success' ? 'sap-icon://status-positive' : 'sap-icon://status-negative' }",
                state: "{advsettings>status}",
                visible: "{= ${advsettings>status} !== 'None'}"
              }).addStyleClass("sapUiSmallMarginEnd sapUiTinyMarginTop")]
            })],
            width: "100%"
          })]
        })
      });
      return importSectionsList;
    },
    /**
     * Selection change event handler for export and import sections
     * @param isImport boolean value to check if import or export tab is selected
     */
    onSectionsSelectionChange: function _onSectionsSelectionChange(isImport) {
      const allSections = isImport ? this.oImportList.getItems() : this.oExportList.getItems();
      let isSelected = false;
      let content, innerCheckbox;
      const isSectionSelected = allSections.some(function (oSection) {
        if (!isImport) {
          content = oSection.getAggregation("content");
          innerCheckbox = content[0].getItems()[0];
          isSelected = innerCheckbox.getSelected();
        } else {
          content = oSection.getAggregation("content");
          const innerHbox = content[0].getItems()[0];
          innerCheckbox = innerHbox.getItems()[0];
          isSelected = innerCheckbox.getSelected();
        }
        return isSelected;
      });
      this.oControlModel.setProperty((isImport ? "/import" : "/export") + "/sectionsSelected", isSectionSelected);
      this.enableDisableActions(isImport ? "import" : "export");
    },
    /**
     * Handler for import button press
     *
     */
    onImportPress: function _onImportPress() {
      try {
        const _this2 = this;
        _this2.attachEvent("sectionsImported", () => {
          _this2.oDetailPage.setBusy(false);
          _this2.oControlModel.setProperty("/import/sectionsSelected", false);
        });
        _this2.oImportBtn.setEnabled(false);
        _this2.oDetailPage.setBusy(true);
        _this2.handleUserPersonalizationError(ImportExportType.IMPORT, false, "", "");
        const oExportData = _this2.oUserPersonalization.import.data;
        const _temp = _catch(function () {
          return Promise.resolve(_this2.importSections(oExportData)).then(function (aSelectedSections) {
            const bShowError = aSelectedSections.some(oSection => {
              return oSection.status === ValueState.Error;
            });
            if (bShowError) {
              _this2.handleUserPersonalizationError(ImportExportType.IMPORT, true, String(_this2._i18nBundle.getText("userPersonalizationImportError")), "Warning");
            }
            _this2.oControlModel.setProperty("/import/sections", aSelectedSections);
          });
        }, function (oErr) {
          Log.error("importpress", String(oErr));
          _this2.handleUserPersonalizationError(ImportExportType.IMPORT, true, String(_this2._i18nBundle.getText("userPersonalizationImportError")), "Error");
        });
        return Promise.resolve(_temp && _temp.then ? _temp.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Invokes import of apps,tiles,pages and cards data
     * @param oImportData import data
     * @returns Promise<IExportSections[]>
     */
    importSections: function _importSections(oImportData) {
      const sectionImportChain = [];
      const aPromise = [];
      const oSelectedSections = this.oControlModel.getProperty("/import/sections");
      sectionImportChain.push(() => this.importApps(oImportData));
      sectionImportChain.push(() => this.importTiles(oImportData));
      sectionImportChain.push(() => this.importFavPages(oImportData));

      // Execute apps, tiles, and pages sequentially
      aPromise.push(sectionImportChain.reduce((chain, current) => {
        return chain.then(() => current());
      }, Promise.resolve()));
      aPromise.push(this.importCards(oImportData));
      return Promise.all(aPromise).then(() => {
        return oSelectedSections;
      }).catch(oError => {
        Log.error("import failed", String(oError));
        return [];
      });
    },
    importApps: function _importApps(oImportData) {
      return new Promise(resolve => {
        const oSelectedSections = this.oControlModel.getProperty("/import/sections");
        if (oImportData?.apps && oImportData?.apps.length > 0 && this.isSectionSelected(oSelectedSections, String(this._i18nBundle.getText("favApps")))) {
          this.oSectionsImported[String(this._i18nBundle.getText("favApps"))] = false;
          this.oEventBus.publish("importChannel", "appsImport", oImportData.apps);
          resolve();
        } else {
          // if no apps / apps selected then resolve the promise and mark the section as imported
          this.oSectionsImported[String(this._i18nBundle.getText("favApps"))] = true;
          this.updateImportStatus("favApps");
          resolve(); // Resolve the promise if condition doesn't meet
        }
      });
    },
    importTiles: function _importTiles(oImportData) {
      return new Promise(resolve => {
        const oSelectedSections = this.oControlModel.getProperty("/import/sections");
        if (oImportData?.tiles && oImportData.tiles.length > 0 && this.isSectionSelected(oSelectedSections, String(this._i18nBundle.getText("insightsTiles")))) {
          this.oSectionsImported[String(this._i18nBundle.getText("insightsTiles"))] = false;
          this.oEventBus.publish("importChannel", "tilesImport", oImportData.tiles);
          resolve();
        } else {
          // if no tiles / tiles section not selected then resolve the promise and mark the section as imported
          this.oSectionsImported[String(this._i18nBundle.getText("insightsTiles"))] = true;
          this.updateImportStatus("insightsTiles");
          resolve(); // Resolve the promise if condition doesn't meet
        }
      });
    },
    importFavPages: function _importFavPages(oImportData) {
      return new Promise(resolve => {
        const oSelectedSections = this.oControlModel.getProperty("/import/sections");
        if (oImportData?.favouritePages && oImportData.favouritePages.length > 0 && this.isSectionSelected(oSelectedSections, String(this._i18nBundle.getText("pages")))) {
          this.oSectionsImported[String(this._i18nBundle.getText("pages"))] = false;
          this.oEventBus.publish("importChannel", "favPagesImport", oImportData.favouritePages);
          resolve();
        } else {
          // if no tiles / tiles section not selected then resolve the promise and mark the section as imported
          this.oSectionsImported[String(this._i18nBundle.getText("pages"))] = true;
          this.updateImportStatus("pages");
          resolve(); // Resolve the promise if condition doesn't meet
        }
      });
    },
    importCards: function _importCards(oImportData) {
      return new Promise(resolve => {
        const oSelectedSections = this.oControlModel.getProperty("/import/sections");
        if (oImportData?.cards && oImportData.cards.length > 0 && this.isSectionSelected(oSelectedSections, String(this._i18nBundle.getText("insightsCards")))) {
          this.oSectionsImported[String(this._i18nBundle.getText("insightsCards"))] = false;
          this.oEventBus.publish("importChannel", "cardsImport", oImportData.cards);
          resolve();
        } else {
          // if no tiles / tiles section not selected then resolve the promise and mark the section as imported
          this.oSectionsImported[String(this._i18nBundle.getText("insightsCards"))] = true;
          this.updateImportStatus("insightsCards");
          resolve(); // Resolve the promise if condition doesn't meet
        }
      });
    },
    /**
     *  Updates status of sections being imported
     *	@param {string} sSectionTitle - section title
     * 	@param {boolean} errorState - error state
     * 	@returns {void}
     */
    updateImportStatus: function _updateImportStatus(sSectionTitle, errorState) {
      const sSectionId = String(this._i18nBundle.getText(sSectionTitle));
      const oSelectedSections = this.oControlModel.getProperty("/import/sections");
      const oSection = oSelectedSections.find(function (oSec) {
        return oSec.title === sSectionId;
      });
      if (oSection) {
        if (errorState !== undefined) {
          oSection.status = errorState ? ValueState.Error : ValueState.Success;
        } else {
          oSection.status = ValueState.None;
        }
        //if a section's status has become success then disable that particular section
        if (oSection.status === ValueState.Success) {
          oSection.enabled = false;
        }
      }
      this.oSectionsImported[sSectionId] = true;
      const sectionTitles = Object.keys(this.oSectionsImported);
      // if every section has been imported successfully then fire sectionsimported
      const imported = sectionTitles.every(sTitle => {
        return this.oSectionsImported[sTitle];
      });
      if (imported) {
        this.fireEvent("sectionsImported");
      }
    },
    /**
     *  Resets the import model values
     *  @param {boolean} onOpen - value to show if the reset call is happening while opening the dialog for the first time
     * 	@private
     */
    resetImportModel: function _resetImportModel(onOpen) {
      this.oControlModel.setProperty("/import/sections", []);
      this.oControlModel.setProperty("/import/sectionsSelected", false);
      this.oControlModel.setProperty("/import/error", false);
      // if called on settingsdialog open , reset value of selectedtab and fileUploader value
      if (onOpen) {
        this.oControlModel.setProperty("/selectedTab", "export");
        Element.getElementById(this.getId() + "--idImportFileUploader")?.setValue("");
      }
    },
    /**
     * 	Find visualizations that are not already present in the favsections
     * @param aImportedSections
     * @returns {Promise<ISection[] | []>} aImportedSections
     */
    getDeltaSectionViz: function _getDeltaSectionViz(aImportedSections) {
      try {
        const _this3 = this;
        return Promise.resolve(_catch(function () {
          return Promise.resolve(_this3.oAppManagerInstance._getSections(true)).then(function (favSections) {
            aImportedSections.forEach(oImportedSection => {
              let oSection;
              if (oImportedSection.default) {
                oSection = favSections.find(oSec => oSec.default);
              } else {
                oSection = favSections.find(oSec => oSec.id === oImportedSection.id);
              }
              if (oSection) {
                // find visualizations that are not already present in the favsections
                const aDelta = oImportedSection.visualizations?.filter(oImportViz => {
                  return oSection.visualizations?.every(oViz => oViz.isBookmark ? oViz.targetURL !== oImportViz.targetURL : oViz.vizId !== oImportViz.vizId);
                });
                oImportedSection.visualizations = aDelta;
              }
            });
            return aImportedSections;
          });
        }, function (error) {
          Log.error("Error occurred while fetching delta section visualizations:" + String(error));
          return []; // Return an empty array in case of error
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    getDeltaAuthSectionViz: function _getDeltaAuthSectionViz(aImportedSections) {
      // Get delta visualization
      if (aImportedSections && aImportedSections.length) {
        return this.getDeltaSectionViz(aImportedSections).then(aDeltaSections => {
          // Filter authorized section visualizations
          return this.filterAuthSectionViz(aDeltaSections);
        }).catch(oError => {
          Log.error(String(oError));
          return [];
        });
      }
      return Promise.resolve([]); // Return a promise resolving to void
    },
    filterAuthSectionViz: function _filterAuthSectionViz(aSections) {
      try {
        const _getCatalogApps = function () {
          return Container.getServiceAsync("SearchableContent").then(function (SearchableContent) {
            return SearchableContent.getApps({
              includeAppsWithoutVisualizations: false
            });
          });
        };
        const _filterAuthViz = function (aAppCatalog, aViz) {
          const aSectionViz = [];
          aViz?.forEach(function (oViz) {
            for (let appCatalog of aAppCatalog) {
              const oAppCatalog = appCatalog;
              const oSectionViz = oAppCatalog.visualizations.find(function (oCatalogViz) {
                return oCatalogViz.vizId === oViz.vizId || oViz.isBookmark && oCatalogViz.target && oViz.target?.action === oCatalogViz.target.action && oViz.target?.semanticObject === oCatalogViz.target.semanticObject;
              });
              if (oSectionViz) {
                oSectionViz.displayFormatHint = oViz.displayFormatHint !== "standard" ? String(oViz.displayFormatHint) : String(oSectionViz.displayFormatHint);
                aSectionViz.push(oViz.isBookmark ? oViz : oSectionViz);
                break;
              }
            }
          });
          return aSectionViz;
        };
        return Promise.resolve(_getCatalogApps().then(function (aAppCatalog) {
          return aSections.map(function (oSection) {
            oSection.visualizations = _filterAuthViz(aAppCatalog, oSection.visualizations);
            return oSection;
          });
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Filter authorized favorite pages
     *
     * @param {Array} aFavPages - array of favorite pages
     * @returns {Promise} resolves to an array of authorized pages
     */
    filterAuthFavPages: function _filterAuthFavPages(aFavPages) {
      try {
        let _exit = false;
        const _this4 = this;
        function _temp3(_result) {
          return _exit ? _result : Promise.resolve([]);
        }
        const _temp2 = function () {
          if (aFavPages && aFavPages.length > 0) {
            return Promise.resolve(_this4.oPageManagerInstance.fetchAllAvailablePages().then(function (aAvailablePages) {
              return aFavPages.filter(function (oimportedPage) {
                return aAvailablePages.filter(function (oAvailabePage) {
                  return oAvailabePage.pageId === oimportedPage.pageId && oAvailabePage.spaceId === oimportedPage.spaceId;
                }).length;
              });
            })).then(function (_await$_this4$oPageMa) {
              _exit = true;
              return _await$_this4$oPageMa;
            });
          }
        }();
        return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(_temp3) : _temp3(_temp2));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Filter authorized cards
     *
     * @param {Array} aCards - array of cards
     * @returns {Promise} resolves to an array of authorized cards
     */
    filterAuthCards: function _filterAuthCards(aCards) {
      try {
        let _exit2 = false;
        function _temp5(_result2) {
          return _exit2 ? _result2 : Promise.resolve([]);
        }
        const _getParentApp = function (aAvailableApps, oCard) {
          return aAvailableApps.find(function (oApp) {
            return oApp.resolutionResult && oApp.resolutionResult.applicationDependencies && oCard["sap.insights"] && oApp.resolutionResult.applicationDependencies.name === oCard["sap.insights"].parentAppId;
          });
        };
        const _isNavigationSupported = function (oService, oParentApp) {
          if (oParentApp) {
            return oService.isNavigationSupported([{
              target: {
                semanticObject: oParentApp.semanticObject,
                action: oParentApp.action
              }
            }]).then(function (aResponses) {
              return aResponses[0].supported || false;
            });
          }
          return Promise.resolve(false);
        };
        const _temp4 = function () {
          if (aCards && aCards.length > 0) {
            return Promise.resolve(Promise.all([Container.getServiceAsync("ClientSideTargetResolution"), Container.getServiceAsync("Navigation")]).then(function (aServices) {
              const clientSideTargetResolution = aServices[0];
              const Navigation = aServices[1];
              const aAvailableApps = clientSideTargetResolution._oAdapter._aInbounds || [];
              return aCards.reduce(function (promise, oCard) {
                return Promise.resolve(promise).then(function (aAuthCards) {
                  const oParentApp = _getParentApp(aAvailableApps, oCard);
                  return Promise.resolve(_isNavigationSupported(Navigation, oParentApp)).then(function (bIsNavigationSupported) {
                    if (bIsNavigationSupported) {
                      aAuthCards.push(oCard);
                    }
                    return aAuthCards;
                  });
                });
              }, Promise.resolve([]));
            })).then(function (_await$Promise$all$th) {
              _exit2 = true;
              return _await$Promise$all$th;
            });
          }
        }();
        return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp5) : _temp5(_temp4));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Handles change event for fileuploader on import file
     *
     * @returns {Promise} resolves to available import sections being shown
     */
    onFileImport: function _onFileImport(oEvent) {
      this.handleUserPersonalizationError(ImportExportType.IMPORT, false, "", "");
      this.resetImportModel();
      this.oDetailPage.setBusy(true);
      const files = oEvent.getParameter("files");
      const oFile = files && files[0];
      return this.readFileContent(oFile).then(oFileContent => {
        // btoa doesn't support the characters outside latin-1 range, so first encode to utf-8
        const oEncodedFileContent = window.btoa(encodeURIComponent(oFileContent).replace(/%([0-9A-F]{2})/g, function (match, p1) {
          return String.fromCharCode(parseInt(p1, 16)); // Convert p1 to a number using parseInt //String.fromCharCode("0x" + p1);
        }));
        return HttpHelper.Post(EXPORT_API, {
          fileContent: oEncodedFileContent
        }).then(oResponse => {
          if (oResponse && oResponse.error) {
            throw new Error(oResponse.error);
          }
          if (oResponse && oResponse.value && oResponse.value.length) {
            const oImportDataString = oResponse.value[0].fileContent;

            // Parse the stringified JSON into the defined type
            const oImportData = JSON.parse(oImportDataString);
            if (oImportData.host === window.location.host) {
              const aImportedSections = oImportData.sections || [];
              aImportedSections.push({
                id: MYINSIGHT_SECTION_ID,
                visualizations: oImportData.tiles || []
              });
              //filter authorized data
              return this.filterAuthorizedImportData(aImportedSections, oImportData);
            } else {
              this.handleUserPersonalizationError(ImportExportType.IMPORT, true, String(this._i18nBundle.getText("importSourceErrorMessage")), "");
              return Promise.resolve();
            }
          }
        });
      }).catch(oError => {
        Log.error(String(oError));
        this.handleUserPersonalizationError(ImportExportType.IMPORT, true, "", "");
      }).finally(() => {
        this.oDetailPage.setBusy(false);
        this.enableDisableActions(ImportExportType.IMPORT);
      });
    },
    filterAuthorizedImportData: function _filterAuthorizedImportData(aImportedSections, oImportData) {
      return Promise.all([this.getDeltaAuthSectionViz(aImportedSections), this.filterAuthFavPages(oImportData.favouritePages), this.filterAuthCards(oImportData.cards), this.getInsightCards() // check : send only cards count here as all cards are not required
      ]).then(aResponse => {
        const aAuthSections = aResponse[0];
        const aAuthFavPages = aResponse[1];
        const aAuthCards = aResponse[2];
        const iInsightCardsCount = aResponse[3].getProperty("/cardCount");
        oImportData.apps = aAuthSections.filter(function (oSection) {
          return oSection.id !== MYINSIGHT_SECTION_ID;
        });
        oImportData.tiles = (aAuthSections.find(function (oSection) {
          return oSection.id === MYINSIGHT_SECTION_ID;
        }) || {}).visualizations || [];
        oImportData.favouritePages = aAuthFavPages;
        oImportData.cards = aAuthCards || [];
        const iTotalCardCount = iInsightCardsCount + Number(aAuthCards?.length);
        if (iTotalCardCount > 99) {
          this.handleUserPersonalizationError(ImportExportType.IMPORT, true, String(this._i18nBundle.getText("importCardCountErrorMessage")), "");
        }
        let aSections = this.getImportedSections(oImportData, ImportExportType.IMPORT, iInsightCardsCount);
        aSections = aSections.map(function (oSection) {
          oSection.status = ValueState.None;
          return oSection;
        });
        this.oUserPersonalization.import.data = oImportData;
        this.oControlModel.setProperty("/import/sections", aSections);
        this.oControlModel.setProperty("/import/sectionsSelected", this.getSelectedSections(aSections).length > 0);
        this.oControlModel.setProperty("/showNoImport", aSections.length === 0);
      });
    },
    readFileContent: function _readFileContent(oFile) {
      return new Promise(function (resolve, reject) {
        if (oFile && window.FileReader) {
          const reader = new FileReader();
          reader.onload = function (event) {
            const target = event.target;
            resolve(target?.result);
          };
          // Convert oFile to Blob
          const blob = oFile;
          reader.readAsText(blob);
        } else {
          reject(new Error("Error"));
        }
      });
    },
    _getPersonalizationData: function _getPersonalizationData() {
      try {
        const _this5 = this;
        function _temp7() {
          return Promise.resolve(_this5.oPersonalizerInstance.read()).then(function (_this5$oPersonalizerI) {
            _this5.persData = _this5$oPersonalizerI || {};
            return _this5.persData;
          });
        }
        const _temp6 = function () {
          if (!_this5.oPersonalizerInstance) {
            return Promise.resolve(UShellPersonalizer.getInstance(PersonalisationUtils.getPersContainerId(_this5._getPanel()), PersonalisationUtils.getOwnerComponent(_this5._getPanel()))).then(function (_UShellPersonalizer$g) {
              _this5.oPersonalizerInstance = _UShellPersonalizer$g;
            });
          }
        }();
        return Promise.resolve(_temp6 && _temp6.then ? _temp6.then(_temp7) : _temp7(_temp6));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    loadUserPersonalizationData: function _loadUserPersonalizationData() {
      try {
        const _this6 = this;
        _this6.oExportList.setBusy(true);
        return Promise.resolve(_this6._getPersonalizationData()).then(function (persData) {
          // load all sections, insight apps and cards
          return Promise.resolve(Promise.all([_this6.oAppManagerInstance._getSections(true), _this6.oAppManagerInstance.fetchInsightApps(true, _this6._i18nBundle.getText("insights")), _this6.getInsightCards()])).then(function (_ref) {
            let [favSections, insightTiles, insightModel] = _ref;
            const aSections = favSections,
              favApps = aSections.filter(function (oSection) {
                return oSection.id !== MYINSIGHT_SECTION_ID && oSection.visualizations?.length;
              });
            const insightCards = insightModel && insightModel.getProperty("/visibleCards") ? insightModel.getProperty("/visibleCards").map(oCard => {
              return oCard.descriptorContent;
            }) : [];
            const oExportData = {
              apps: favApps,
              tiles: insightTiles,
              favouritePages: persData.favouritePages,
              cards: insightCards,
              personalization: persData
            };
            const aExportSections = _this6.getImportedSections(oExportData, ImportExportType.EXPORT, 0);
            _this6.oUserPersonalization.export.data = oExportData;
            _this6.oUserPersonalization.export.sections = aExportSections;
            _this6.oUserPersonalization.export.sectionsSelected = _this6.getSelectedSections(aExportSections).length > 0;
            _this6.oControlModel.refresh();
            _this6.oExportList.setBusy(false);
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Returns selected sections out of provided sections
     *
     * @param {Array} aSections - array of sections to show in import/export
     * @returns {Array} array of selected sections
     */
    getSelectedSections: function _getSelectedSections(aSections) {
      return aSections.filter(function (oSection) {
        return oSection.selected && oSection.enabled;
      }) || [];
    },
    /**
     * Returns if section is selected
     *
     * @param {Array} oSections - import/export sections
     * @param {String} sSectionId - import/export section id
     * @returns {boolean} returns true if section is selected
     */
    isSectionSelected: function _isSectionSelected(sections, sectionId) {
      const section = sections.find(function (sec) {
        return sec.title === sectionId;
      });
      return !!(section && section.selected && section.enabled);
    },
    /**
     * Returns import/export sections
     *
     * @param {object} oData - export/import data
     * @param {ImportExportType} sType - export/import type
     * @param {number} iInsightCardsCount - cards count
     * @returns {Array} array of import/export sections
     */
    getImportedSections: function _getImportedSections(oData, sType, iInsightCardsCount) {
      const aFavPages = (sType === ImportExportType.IMPORT ? this.getDeltaFavPages(oData.favouritePages) : oData.favouritePages) || [],
        isAppViz = oData.apps && oData.apps.some(function (oSections) {
          return oSections && oSections.visualizations && oSections.visualizations.length > 0;
        });
      return [{
        title: this._i18nBundle.getText("favApps"),
        selected: isAppViz,
        enabled: isAppViz
      }, {
        title: this._i18nBundle.getText("pages"),
        selected: aFavPages.length > 0,
        enabled: aFavPages.length > 0
      }, {
        title: this._i18nBundle.getText("insightsTiles"),
        selected: oData.tiles && oData.tiles.length > 0,
        enabled: oData.tiles && oData.tiles.length > 0
      }, {
        title: this._i18nBundle.getText("insightsCards"),
        selected: oData.cards && oData.cards.length > 0 && oData.cards.length + iInsightCardsCount <= 99,
        enabled: oData.cards && oData.cards.length > 0 && oData.cards.length + iInsightCardsCount <= 99
      }];
    },
    getDeltaFavPages: function _getDeltaFavPages(aImportedFavPages) {
      const aFavPages = this.persData.favouritePages || [];
      if (aFavPages.length !== aImportedFavPages.length) {
        return aImportedFavPages;
      }
      return aImportedFavPages.filter(function (oImportedPage) {
        return !aFavPages.find(function (oFavPage) {
          return oImportedPage.pageId === oFavPage.pageId && oImportedPage.spaceId === oFavPage.spaceId;
        });
      });
    },
    getInsightCards: function _getInsightCards() {
      try {
        const _this7 = this;
        return Promise.resolve(_catch(function () {
          return Promise.resolve(CardHelper.getServiceAsync()).then(function (_getServiceAsync) {
            _this7.cardHelperInstance = _getServiceAsync;
            return Promise.resolve(_this7.cardHelperInstance._getUserAllCardModel()).then(function (oUserVisibleCardModel) {
              const aCards = oUserVisibleCardModel.getProperty("/cards");
              const aVisibleCards = aCards.filter(function (oCard) {
                return oCard.visibility;
              });
              oUserVisibleCardModel.setProperty("/visibleCards", aVisibleCards);
              return oUserVisibleCardModel;
            });
          });
        }, function (error) {
          // Handle any errors

          throw error; // Re-throw the error to be handled by the caller
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Handles export button press
     */
    onExportPress: function _onExportPress() {
      this.handleUserPersonalizationError(ImportExportType.EXPORT, false, "", "");
      const oExportFileName = this.oControlModel.getProperty("/export/fileName"),
        aExportSections = this.oControlModel.getProperty("/export/sections"),
        oExportData = this.oUserPersonalization.export.data;
      const oExportFileContent = this.getExportFileContent(oExportData, aExportSections);
      sap.ui.require(["sap/ui/core/util/File"], File => {
        try {
          File.save(JSON.stringify(oExportFileContent), oExportFileName, "txt", "text/plain", "utf-8");
          MessageToast.show(String(this._i18nBundle.getText("userPersonalizationExportSuccess")));
        } catch (error) {
          Log.error(error instanceof Error ? error.message : String(error));
          if (error instanceof Error && error?.name !== undefined && error.name !== "AbortError") {
            // Handle the error appropriately
            this.handleUserPersonalizationError(ImportExportType.EXPORT, true, "", "");
          }
        }
      });
    },
    getExportFileContent: function _getExportFileContent(exportData, exportSections) {
      const oPersonalization = exportData?.personalization,
        oExportFileContent = {
          host: window.location.host,
          createdDate: new Date(),
          sections: [],
          groupInfo: [],
          tiles: [],
          cards: [],
          favouritePages: []
        };
      if (this.isSectionSelected(exportSections, this._i18nBundle.getText("favApps"))) {
        oExportFileContent.sections = exportData?.apps || [];
        oExportFileContent.groupInfo = oPersonalization?.favoriteApps || [];
      }
      if (this.isSectionSelected(exportSections, this._i18nBundle.getText("pages"))) {
        oExportFileContent.favouritePages = oPersonalization?.favouritePages || [];
      }
      if (this.isSectionSelected(exportSections, this._i18nBundle.getText("insightsTiles"))) {
        oExportFileContent.tiles = exportData?.tiles || [];
      }
      return oExportFileContent;
    },
    /**
     * Handles user personalization error, shows the error msg and reset values
     *
     * @param {string} sType - type of import/export
     * @param {boolean} bShowError - flag to show or hide error msg
     * @param {string} sErrorMsg - error msg text
     * @param {string} sErrorType - error msg type
     */
    handleUserPersonalizationError: function _handleUserPersonalizationError(sType, bShowError, sErrorMsg, sErrorType) {
      const sDefaultErrorMsg = this._i18nBundle.getText(sType === ImportExportType.IMPORT ? "importErrorMessage" : "exportErrorMessage");
      this.oControlModel.setProperty("/" + sType + "/error", bShowError, undefined, true);
      this.oControlModel.setProperty("/" + sType + "/errorMessage", sErrorMsg || sDefaultErrorMsg, undefined, true);
      this.oControlModel.setProperty("/" + sType + "/errorType", sErrorType || "Error", undefined, true);
      this.setExportImportValues(sType);
    },
    /**
     * Handles import/export tab select
     *
     * @param {object} oEvent - IconTabBarSeelect event
     */
    onImportExportTabSelect: function _onImportExportTabSelect(oEvent) {
      const selectedKey = oEvent.getParameter("selectedKey");
      this.oSelectedTab = selectedKey;
      this.oControlModel.setProperty("/selectedTab", selectedKey);
      this.oExportList.setVisible(selectedKey === "export");
      this.oImportBtn.setVisible(selectedKey === "import");
      this.oExportBtn.setVisible(selectedKey === "export");
      this.oImportBtn.setEnabled(this.oUserPersonalization.import.sectionsSelected);
      this.oExportBtn.setEnabled(this.oUserPersonalization.export.sectionsSelected);
      this.oExportBtn.setEnabled(!!(this.oUserPersonalization.export.fileName && this.oUserPersonalization.export.sections && this.oUserPersonalization.export.sections.length > 0 && this.oUserPersonalization.export.sectionsSelected));
    },
    /**
     * Handles export file name input change
     *
     * @param {object} oEvent - event
     */
    onFileNameInputChange: function _onFileNameInputChange(oEvent) {
      const sInputValue = oEvent.getParameter("value")?.trim();
      const oInput = oEvent.getSource();
      let sValueState = ValueState.None; // Initialize with ValueState.None
      let sValueStateText = "";

      // Validate based on constraints provided at input
      if (!sInputValue || !sInputValue.length) {
        sValueState = ValueState.Error;
        sValueStateText = String(this._i18nBundle.getText("invalidExportFileName"));
      }

      //update value state
      oInput.setValueState(sValueState);
      oInput.setValueStateText(sValueStateText);
      this.oControlModel.setProperty("/export/fileName", sInputValue);
      this.enableDisableActions(ImportExportType.EXPORT);
    },
    onResetImportApps: function _onResetImportApps() {
      this.oEventBus.publish("importChannel", "resetImported");
    },
    /**
     * Generates the recommendation settings panel
     * @returns {Panel} recommendation settings panel
     * @private
     */
    _getRecommendationSettingsPanel: function _getRecommendationSettingsPanel() {
      try {
        const _this8 = this;
        return Promise.resolve(_this8._getPersonalizationData()).then(function (persData) {
          if (!_this8._recommendationSettingsPanel) {
            const panelId = _this8.getId() + "--recommendationSettingsPanel";
            _this8._recommendationSettingsPanel = new Panel(panelId, {
              headerText: _this8._i18nBundle.getText("recommendationSettingsHeader"),
              expanded: true,
              expandable: true,
              content: [new Text({
                id: `${panelId}-container-subHeader`,
                text: _this8._i18nBundle.getText("recommendationSettingsSubHeader")
              }), new HBox({
                id: `${panelId}-container`,
                items: [new CheckBox({
                  id: `${panelId}-container-checkBox`,
                  selected: persData.showRecommendation ?? true,
                  select: event => _this8.onRecommendationSettingChange(event)
                }), new Text({
                  id: `${panelId}-container-label`,
                  text: _this8._i18nBundle.getText("recommendationSettingsCheckboxLabel")
                })],
                alignItems: FlexAlignItems.Center
              }).addStyleClass("sapUiSmallMarginTop")]
            }).addStyleClass("sapUiSmallMarginTop");
          }
          return _this8._recommendationSettingsPanel;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Adds recommendation settings panel to the content vbox, if recommendation feature is enabled
     * @returns {Promise<void>}
     * @private
     */
    _setRecommendationSettingsPanel: function _setRecommendationSettingsPanel() {
      try {
        const _this9 = this;
        _this9.oDetailPage.setBusy(true);
        return Promise.resolve(_this9.oAppManagerInstance.isFeatureEnabled(FEATURE_TOGGLES.RECOMMENDATION)).then(function (isRecommendationEnabled) {
          function _temp9() {
            _this9.oDetailPage.setBusy(false);
          }
          const _temp8 = function () {
            if (isRecommendationEnabled) {
              return Promise.resolve(_this9._getRecommendationSettingsPanel()).then(function (recommendationSettingsPanel) {
                _this9.oContentVBox.addItem(recommendationSettingsPanel);
              });
            }
          }();
          return _temp8 && _temp8.then ? _temp8.then(_temp9) : _temp9(_temp8);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Handles recommendation setting change
     *
     * @param {CheckBox$SelectEvent} event - checkbox select event
     * @private
     */
    onRecommendationSettingChange: function _onRecommendationSettingChange(event) {
      try {
        const _this10 = this;
        const showRecommendation = event.getParameter("selected");
        _this10.oEventBus.publish("importChannel", "recommendationSettingChanged", {
          showRecommendation
        });
        return Promise.resolve(_this10._getPersonalizationData()).then(function (oPersData) {
          void _this10.oPersonalizerInstance.write({
            ...oPersData,
            showRecommendation
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
  });
  AdvancedSettingsPanel.ImportExportType = ImportExportType;
  return AdvancedSettingsPanel;
});
//# sourceMappingURL=AdvancedSettingsPanel-dbg-dbg.js.map
