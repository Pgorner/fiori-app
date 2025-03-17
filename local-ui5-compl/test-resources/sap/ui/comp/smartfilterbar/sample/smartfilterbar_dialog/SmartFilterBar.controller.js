sap.ui.define([
	"sap/base/i18n/Localization",
	"sap/ui/core/Element",
	"sap/ui/thirdparty/jquery",
	'sap/ui/model/odata/ODataUtils',
	'sap/ui/core/mvc/Controller',
	"sap/ui/rta/api/startKeyUserAdaptation",
	'sap/m/Button',
	'sap/m/MessageToast',
	'sap/m/SegmentedButtonItem',
	'sap/m/Toolbar',
	'sap/ui/layout/form/Form',
	'sap/ui/layout/form/FormContainer',
	'sap/ui/layout/form/FormElement',
	'sap/ui/layout/form/ResponsiveGridLayout',
	'sap/ui/core/util/MockServer',
	"./SelectionVariant",
	'sap/ui/comp/state/UIState',
	'sap/ui/comp/filterbar/VariantConverterFrom',
	'sap/ui/model/resource/ResourceModel',
	'sap/ui/model/odata/v2/ODataModel'
], function(Localization, Element, jQuery, ODataUtils, Controller, startKeyUserAdaptation, Button, MessageToast, SegmentedButtonItem, Toolbar, Form, FormContainer, FormElement, ResponsiveGridLayout, MockServer, SelectionVariant, UIState, VariantConverterFrom, ResourceModel, ODataModel) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartfilterbar_dialog.SmartFilterBar", {

		onInit: function() {
			var oModel, oView;

			var sResourceUrl;
			sResourceUrl = "smartfilterbar_dialog/i18n/i18n.properties";
			var sLocale = Localization.getLanguage();
			var oResourceModel = new ResourceModel({
				bundleUrl: sResourceUrl,
				bundleLocale: sLocale
			});
			this.getView().setModel(oResourceModel, "@i18n");

			var oMockServer = new MockServer({
				rootUri: "/foo/"
			});
			this._oMockServer = oMockServer;
			var sMockdataUrl = sap.ui.require.toUrl("sap/ui/comp/sample/smartfilterbar_dialog/mockserver");
			var sMetadataUrl = sMockdataUrl + "/metadata.xml";
			oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sMockdataUrl,
				aEntitySetsNames: [
					"ZEPM_C_SALESORDERITEMQUERYResults", "ZEPM_C_SALESORDERITEMQUERY", "VL_FV_XFELD", "VL_SH_H_T001", "VL_SH_H_CATEGORY"
				]
			});
			oMockServer.start();

			oModel = new ODataModel("/foo", {
				json: true,
				annotationURI: sap.ui.require.toUrl("sap/ui/comp/sample/smartfilterbar_dialog/mockserver") + "/annotations.xml"
			});

			// oModel.setCountSupported(false);
			oView = this.getView();
			// oView.setModel(oModel);

			var oComp = this.getOwnerComponent();
			oComp.setModel(oModel);

			this._oFilterBar = Element.getElementById(oView.getId() + "--smartFilterBar");

			this._oOutputParam = Element.getElementById(oView.getId() + "--outputAreaParam");
			this._oOutputFilters = Element.getElementById(oView.getId() + "--outputAreaFilters");

			this._oOutputDataSuite = Element.getElementById(oView.getId() + "--outputAreaDataSuite");
			this._oOutputValueTexts = Element.getElementById(oView.getId() + "--outputAreaValueTexts");

			this._outputAreaToSelectionVariant = Element.getElementById(oView.getId() + "--outputAreaToSelectionVariant");
			this._outputAreaFromSelectionVariant = Element.getElementById(oView.getId() + "--outputAreaFromSelectionVariant");

			this._oStatusText = Element.getElementById(oView.getId() + "--statusText");

			this._sApiLevel = null;
			this._bStrictMode = true;
		},

		switchToAdaptionMode: function () {
			startKeyUserAdaptation({rootControl: this.getOwnerComponent()});
		},

		onDialogCancel: function(oEvent) {
			this._doOutput("Cancel pressed!");
		},
		onDialogSearch: function(oEvent) {
			this._doOutput("Search pressed!");
		},
		onDialogClosed: function(oEvent) {
			this._doOutput(oEvent.getParameter("context"));
		},

		onDialogOpened: function(oEvent) {
			if (!oEvent.getParameter("newDialog")) {
				this.onOldDialogOpened(oEvent);
			} else {
				this.onNewDialogOpened(oEvent);
			}
		},
		onNewDialogOpened: function(oEvent) {

			var oForm = new Form({
				layout: new ResponsiveGridLayout({
					columnsL: 1,
					columnsM: 1
				})
			});

			var fSearchCallBack = function(oEvent) {
				MessageToast.show("Search executed");
			};

			var fSelectCallBack = function(oEvent) {
				MessageToast.show("View switched");
			};

			var fDropDownCallBack = function(sKey) {
				MessageToast.show("Dropdown changed to: " + sKey);
			};

			var oFormContainer = new FormContainer({
				title: "Different Content"
			});
			var oFormElement = new FormElement({
				label: "Test",
				fields: [
					new Button({
						text: "Simulate LiveMode change",
						press: function() {
							this._oFilterBar.search();
						}.bind(this)
					})
				]
			});
			oFormContainer.addFormElement(oFormElement);

			oForm.addFormContainer(oFormContainer);

			this._oFilterBar.addAdaptFilterDialogCustomContent({
				item: new SegmentedButtonItem({icon:"sap-icon://filter-analytics", key:"customView", tooltip:"Custom View"}),
				search: fSearchCallBack,
				selectionChange: fSelectCallBack,
				filterSelect: fDropDownCallBack,
				content: oForm
			});
		},

		/**
		 * @deprecated As of version 1.84
		 */
		onOldDialogOpened: function(oEvent) {
			var aContent = this._oFilterBar.getFilterDialogContent();
			if (!aContent) {
				return;
			}

			var oToolbar = new Toolbar();
			oToolbar.addContent(new Button({
				text: "Switch",
				press: function() {
					this._toggle();
				}.bind(this)
			}));

			var oForm = new Form({
				layout: new ResponsiveGridLayout({
					columnsL: 1,
					columnsM: 1
				})
			});
			oForm.setToolbar(oToolbar);
			var oFormContainer = new FormContainer({
				title: "Different Content"
			});
			var oFormElement = new FormElement({
				label: "Test",
				fields: [
					new Button({
						text: "Simulate LiveMode change",
						press: function() {
							this._oFilterBar.search();
						}.bind(this)
					})
				]
			});
			oFormContainer.addFormElement(oFormElement);

			oForm.addFormContainer(oFormContainer);

			this._oFilterBar.addFilterDialogContent(oForm);

			aContent[0].setToolbar(oToolbar.clone());

			/*
			 * this._oFilterBar.setContentWidth(600); this._oFilterBar.setContentHeight(360); this._oFilterBar.addFilterDialogContent(aContent[1]);
			 */
			this._oFilterBar.addFilterDialogContent(aContent[0]);
		},

		/**
		 * @deprecated As of version 1.84
		 */
		_toggle: function() {
			var aContent = this._oFilterBar.getFilterDialogContent();
			if (aContent && (aContent.length === 2)) {
				if (aContent[0].getVisible()) {
					aContent[0].setVisible(false);
					aContent[1].setVisible(true);
				} else {
					aContent[0].setVisible(true);
					aContent[1].setVisible(false);
				}
			}
		},

		_getDataSuiteFormat: function() {
			var oUIState = this._oFilterBar.getUiState();
			var oDataSuite = oUIState.getSelectionVariant();
			var oValueTexts = oUIState.getValueTexts();

			return {
				selectionVariant: JSON.stringify(oDataSuite),
				valueTexts: JSON.stringify(oValueTexts)
			};
		},

		_setDataSuiteFormat: function(oData, sValueTexts) {

			var oUiState = new UIState({
				selectionVariant: oData,
				valueTexts: sValueTexts ? JSON.parse(sValueTexts) : null
			});

			var oObj = {
				strictMode: this._bStrictMode,
				replace: true
			};

			this._oFilterBar.setUiState(oUiState, oObj);
		},

		onSearchForFilters: function(oEvent) {
			this._doOutput("Search triggered with filters: '" + oEvent.getParameters().newValue);
		},

		printFilters: function(aFilters) {
			var oFilterProvider = this._oFilterBar._oFilterProvider;

			var sText = ODataUtils._createFilterParams(aFilters, oFilterProvider._oParentODataModel.oMetadata, oFilterProvider._oMetadataAnalyser._getEntityDefinition(oFilterProvider.sEntityType));

			return decodeURI(sText);

		},

		onSearch: function(oEvent) {

			this._doOutput("Search triggered");

//			var sParamBinding = this._oFilterBar.getAnalyticBindingPath();
//			this._oOutputParam.setValue(sParamBinding);

//			var sFilters = this.printFilters(this._oFilterBar.getFilters());
//			this._oOutputFilters.setValue(sFilters);

//			var oDataSuite = this._getDataSuiteFormat();
//			this._oOutputDataSuite.setValue(oDataSuite.selectionVariant);
//			this._oOutputValueTexts.setValue(oDataSuite.valueTexts);
//
//			this._outputAreaToSelectionVariant.setValue("");
		},

		onClear: function(oEvent) {
			this._doOutput("Clear pressed!");
		},

		onRestore: function(oEvent) {
			this._doOutput("Restore pressed!");
		},

		onCancel: function(oEvent) {
			this._doOutput("Cancel pressed!");
		},

		onExit: function() {
			this._oMockServer.stop();
		},

		onBeforeRebindTable: function(oEvent) {

			var oAnalyticalBinding = this._oFilterBar.getAnalyticBindingPath();
			this._oTable.setTableBindingPath(oAnalyticalBinding);
		},

		toggleAPILevel: function(oEvent) {

			var sText, oButton = this.getView().byId("toggleAPILevel");

			if (!oButton) {
				return;
			}

			if (this._sApiLevel === "13.0") {
				this._sApiLevel = null;
				sText = "Current: Parameter Only";
			} else {
				this._sApiLevel = "13.0";
				sText = "Current: Single Value Filters";
			}

			oButton.setText(sText);

		},

		toggleStrictMode: function() {
			var oButton = this.getView().byId("toggleStrictMode");

			if (!oButton) {
				return;
			}

			if (this._bStrictMode) {
				oButton.setText("Mode: non strict");
			} else {
				oButton.setText("Mode: strict");
			}

			this._bStrictMode = !this._bStrictMode;

		},

		toggleErrorMode: function() {
			var oVM = this.getView().byId("__SVM01");

			if (!oVM) {
				return;
			}

			oVM.setInErrorState(!oVM.getInErrorState());

		},

		toggleShowGoOnFB: function() {

			this._oFilterBar.setShowGoOnFB(!this._oFilterBar.getShowGoOnFB());

		},

		toggleFIVisibility: function(oEvent) {

			var oItem, bFlag;
			if (oEvent.oSource.isA("sap.m.MultiComboBox")) {

				var oChangedItem = oEvent.getParameter("changedItem");
				if (oChangedItem.getKey() === "2") {
					oItem = this._oFilterBar._determineItemByName("CustomerCountry", "fin.ar.lineitems.display.CustomerGroup");
				}

			} else {
				oItem = this._oFilterBar._determineItemByName("Bukrs", "__$INTERNAL$");
			}

			if (oItem) {
				bFlag = oItem.filterItem.getVisible();

				oItem.filterItem.setVisible(!bFlag);
			}


		},

		onCustomerControlChanged: function(oEvent) {
			this.toggleFIVisibility(oEvent);
		},

		toggleUseToolbar: function() {

			this._oFilterBar.setUseToolbar(!this._oFilterBar.getUseToolbar());

		},

		toggleUpdateMode: function() {
			var oButton = this.getView().byId("toggleUpdateMode");

			if (!oButton) {
				return;
			}

			var bLiveMode = this._oFilterBar.getLiveMode();
			if (bLiveMode) {
				oButton.setText("Change to 'LiveMode'");
			} else {
				oButton.setText("Change to 'ManualMode'");
			}

			this._oFilterBar.setLiveMode(!bLiveMode);
		},

		onCreateToSelectionVariant: function() {

			var sTextAreaText = this._oOutputDataSuite.getValue();

			this._outputAreaToSelectionVariant.setValue("");
			this._outputAreaFromSelectionVariant.setValue("");
			if (sTextAreaText) {
				var oSelVariant = new SelectionVariant(sTextAreaText);

				this._outputAreaToSelectionVariant.setValue(oSelVariant.toJSONString());
			}
		},

		onCreatedFromSelectionVariant: function() {
			var sPayload, oDataSuite = {}, sTextAreaText = this._outputAreaToSelectionVariant.getValue();
			this._outputAreaFromSelectionVariant.setValue("");
			if (sTextAreaText) {
				var oSelVariant = JSON.parse(sTextAreaText);

				oDataSuite.SelectionVariant = oSelVariant;
				if (oSelVariant.Parameters) {
					oDataSuite.Parameters = oSelVariant.Parameters;
				}
				if (oSelVariant.SelectOptions) {
					oDataSuite.SelectOptions = oSelVariant.SelectOptions;
				}

				this._setDataSuiteFormat(oDataSuite.SelectionVariant, this._oOutputValueTexts.getValue());

				oDataSuite = this._getDataSuiteFormat();

				var oConverter = new VariantConverterFrom();
				var oContent = oConverter.convert(oDataSuite.selectionVariant, this._oFilterBar, this._bStrictMode);
				if (oContent && oContent.payload) {
					sPayload = UIState.enrichWithValueTexts(oContent.payload, oDataSuite.sValueTexts);
				}

				this._outputAreaFromSelectionVariant.setValue(sPayload);

				if (oDataSuite.selectionVariant !== this._oOutputDataSuite.getValue()) {
					this._outputAreaFromSelectionVariant.setValueState("Error");
				} else {
					this._outputAreaFromSelectionVariant.setValueState("None");
				}

			}
		},

		onAssignedFiltersChanged: function(oEvent) {
			if (this._oFilterBar) {
				var sText = this._oFilterBar.retrieveFiltersWithValuesAsText();
				this._oStatusText.setText(sText);
			}
		},

		_doOutput: function(sText) {
			try {
				MessageToast.show(sText);
			} catch (ex) {
				// Do Nothing...
			}
		},

		onAfterVariantLoad: function(oEvent) {
			if (this._oFilterBar) {
				var oControl = this.getView().byId("multiComboBox");
				if (oControl) {
					var mData = this._oFilterBar.getFilterData();
					if (mData._CUSTOM) {
						if (!mData._CUSTOM.hasOwnProperty("CustomFilterField")) {
							mData._CUSTOM.CustomFilterField = [];
						}

						oControl.removeAllSelectedItems();
						var aKeys = [];
						for (var i = 0; i < mData._CUSTOM.CustomFilterField.length; i++) {
							aKeys.push(mData._CUSTOM.CustomFilterField[i]);
						}

						oControl.setSelectedKeys(aKeys);
					}
				}
			}
		},

		onBeforeVariantFetch: function(oEvent) {
			if (this._oFilterBar) {
				var oControl = this.getView().byId("multiComboBox");
				if (oControl) {

					var bModified = false;
					var oVM = this.getView().byId("__SVM01");
					if (oVM) {
						bModified = oVM.currentVariantGetModified();
					}
					var mData = this._oFilterBar.getFilterData(true);
					if (!mData._CUSTOM) {
						mData._CUSTOM = {};
					}

					mData._CUSTOM.CustomFilterField = [];

					var aKeys = oControl.getSelectedKeys();
					for (var i = 0; i < aKeys.length; i++) {
						mData._CUSTOM.CustomFilterField.push(aKeys[i]);
					}

					this._oFilterBar.setFilterData(mData, true);


					if (oVM && !bModified) {
					   oVM.currentVariantSetModified(false);
					}
				}
			}
		}

	});
});
