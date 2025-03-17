/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
sap.ui.define(
	[
		"sap/ui/core/Control",
		"sap/ui/core/ListItem",
		"sap/ui/model/json/JSONModel",
		"sap/m/CustomListItem",
		"sap/m/Text",
		"sap/m/HBox",
		"sap/m/VBox",
		"sap/m/List",
		"sap/m/ComboBox",
		"sap/m/Button",
		"sap/ui/model/Filter",
		"sap/ui/model/Sorter",
		"sap/m/Input"
	],
	function (Control, ListItem, JSONModel, CustomListItem, Text, HBox, VBox, List, ComboBox, Button, Filter, Sorter, Input) {
		"use strict";

		return Control.extend("sap.cards.ap.generator.app.controls.CriticalityEditor", {
			metadata: {
				properties: {
					selectionKeys: { type: "object", defaultValue: {} },
					items: { type: "object", defaultValue: {} },
					type: { type: "string", defaultValue: "" }
				},
				aggregations: {
					_list: { type: "sap.m.List", multiple: false, visibility: "hidden" }
				},
				events: {
					change: {
						parameters: {
							value: { type: "object" },
							isCalcuationType: { type: "boolean" }
						}
					}
				}
			},

			_isPotentialCriticality: function (oProperty) {
				switch (oProperty.type) {
					case "Edm.Date":
					case "Edm.Boolean":
					case "Edm.Guid":
					case "Edm.DateTimeOffset":
						return false;
					case "Edm.Decimal":
					case "Edm.Byte":
					case "Edm.Int32":
						if (oProperty.value > -2 && oProperty.value < 6) {
							return true;
						}
						return false;
					case "Edm.String":
						switch (oProperty.value) {
							case null:
							// case "":
							case "-1":
							case "0":
							case "1":
							case "2":
							case "2":
							case "3":
							case "4":
							case "5":
							case "Positive":
							case "Neative":
							case "Neutral":
							case "Critical":
							case "VeryNegative":
							case "VeryPositive":
							case "Information":
								return true;
							default:
								return false;
						}
					default:
						return false;
				}
			},

			constructor: function () {
				Control.apply(this, arguments);
			},

			onAfterRendering: function () {
				var that = this;
				var aEntityData = JSON.parse(JSON.stringify(this.getSelectionKeys()));
				aEntityData.forEach(function (oEntity) {
					if (that._isPotentialCriticality(oEntity)) {
						oEntity.category = that.getModel("i18n").getObject("CRITICALITY_CONTROL_SELECT_PROP");
					} else {
						oEntity.category = that.getModel("i18n").getObject("CRITICALITY_CONTROL_SELECT_OTHERS");
					}
					oEntity.name = "{" + oEntity[that._setSelectionKeysMap.name] + "}";
					oEntity.label = oEntity[that._setSelectionKeysMap.label];
					//TODO: oCopyEntityData should have filtered data to allow criticality value entity only.
				});
				this.aStaticCriticality = [
					{
						name: "Neutral",
						label: "Neutral",
						category: this.getModel("i18n").getObject("CRITICALITY_CONTROL_SELECT_CRITICALITY")
					},
					{
						name: "Good",
						label: "Positive",
						category: this.getModel("i18n").getObject("CRITICALITY_CONTROL_SELECT_CRITICALITY")
					},
					{
						name: "Critical",
						label: "Critical",
						category: this.getModel("i18n").getObject("CRITICALITY_CONTROL_SELECT_CRITICALITY")
					},
					{
						name: "Error",
						label: "Negative",
						category: this.getModel("i18n").getObject("CRITICALITY_CONTROL_SELECT_CRITICALITY")
					},
					{
						name: "Calculation",
						label: this.getModel("i18n").getObject("CRITICALITY_CONTROL_CREATE_CALC"),
						category: "Calculation:"
					}
				];
				var oMergedEntityData = aEntityData.concat(this.aStaticCriticality);
				var _oCriticalityComboBoxModel = this._oCriticalityComboBox.getModel("internal");
				_oCriticalityComboBoxModel.setData(oMergedEntityData, true);
				_oCriticalityComboBoxModel.refresh();
			},

			setItems: function (aValue) {
				var that = this;
				this.setProperty("items", aValue, true);
				this._itemsMap = this.getBindingInfo("items").parameters;
				this._oPropertyComboBox.bindProperty("selectedKey", this._itemsMap.name);
				this._oCriticalityComboBox.bindProperty("selectedKey", this._itemsMap.value);
				if (this.getType() === "COMPACT") {
					this._oCriticalityComboBox.setWidth("300px");
					const iLength = this.oCricitalityCalculator.getItems()?.length;
					if (iLength > 0) {
						this.oCricitalityCalculator.getItems()[iLength - 1].setVisible(false);
					}
				}
				this._oList.bindItems(
					this.getBindingPath("items"),
					new CustomListItem({
						content: [
							new HBox({
								justifyContent: this.getType() === "COMPACT" ? "Start" : "SpaceAround",
								items:
									this.getType() === "COMPACT"
										? [this._oCriticalityComboBox]
										: [this._oPropertyComboBox, this._separatorColon, this._oCriticalityComboBox, this._deleteButton]
							}),
							new HBox({
								justifyContent: this.getType() === "COMPACT" ? "Start" : "SpaceAround",
								items: [this.oCricitalityCalculator]
							})
						]
					})
				);
			},

			_getCriticalityModel: function () {
				return new JSONModel(this.aStaticCriticality);
			},

			setSelectionKeys: function (aValue) {
				var that = this;
				this.setProperty("selectionKeys", aValue);
				this._setSelectionKeysMap = this.getBindingInfo("selectionKeys").parameters;
				this._oPropertyFilter = new Filter({
					path: that._setSelectionKeysMap.name
				});
				this._oPropertyComboBox.bindAggregation("items", {
					path: this.getBindingPath("selectionKeys"),
					length: 500,
					filters: this._oPropertyFilter,
					factory: function () {
						return new ListItem({
							key: "{" + that._setSelectionKeysMap.name + "}",
							text: "{" + that._setSelectionKeysMap.label + "}"
						});
					}
				});
				this._oCriticalityComboBox.setModel(this._getCriticalityModel(), "internal");
				this._oCriticalityComboBox.bindAggregation("items", {
					path: "internal>/",
					sorter: new Sorter("category", true, true),
					length: 500,
					factory: function () {
						return new ListItem({
							key: "{internal>name}",
							text: "{internal>label}"
						});
					}
				});
			},
			getItems: function () {
				return this.getModel().getProperty(this.getBindingPath("items"));
			},

			init: function () {
				var that = this;
				this._oList = new List();
				this.setAggregation("_list", this._oList);
				this._oPropertyComboBox = new ComboBox({
					change: function (oEvent) {
						var sPath = oEvent.getSource().getBindingContext().getPath();
						that.fireEvent("change", {
							value: that.getItems(),
							isCalcuationType: that.getModel().getProperty(sPath).activeCalculation
						});
					}
				});
				this._separatorColon = new Text({ text: ":" }).addStyleClass("sapUiTinyMarginTop");
				this._oCriticalityComboBox = new ComboBox({
					change: function (oEvent) {
						var bindingContext = oEvent.getSource().getBindingContext();
						var sPath = bindingContext.getPath();
						var oModel = this.getModel();
						var selectedKey = oEvent.getSource().getSelectedKey();
						if (that.getType() === "COMPACT") {
							var sourceCriticalityCalculationPath =
								"/configuration/advancedFormattingOptions/sourceCriticalityProperty/0/activeCalculation";
							oModel.setProperty(
								sourceCriticalityCalculationPath,
								bindingContext.getObject("hostCriticality") === "Calculation"
							);
							oModel.setProperty("/configuration/advancedFormattingOptions/selectedKeyCriticality", selectedKey);
						} else {
							oModel.getProperty(sPath).activeCalculation = bindingContext.getObject("criticality") === "Calculation";
							oModel.setProperty(
								"/configuration/advancedFormattingOptions/sourceCriticalityProperty/0/hostCriticality",
								selectedKey
							);
						}

						const isSelectedKey = selectedKey ? true : false;
						oModel.setProperty("/configuration/advancedFormattingOptions/isCriticalityApplied", isSelectedKey);

						that.fireEvent("change", {
							value: that.getItems(),
							isCalcuationType: that.getModel().getProperty(sPath).activeCalculation
						});
					}
				});

				this._deleteButton = new Button({
					icon: "sap-icon://delete",
					type: "Transparent",
					press: this._onDeleteButtonClicked.bind(this)
				});

				this.oCricitalityCalculator = new VBox({
					visible: "{= !!${activeCalculation} }",
					items: [
						new HBox({
							justifyContent: "SpaceAround",
							items: [
								new Text({ textAlign: "End", width: "150px", text: "{i18n>CRITICALITY_CONTROL_TOL_RANGE}" }).addStyleClass(
									"sapUiTinyMarginTop"
								),
								new Input({
									value: "{toleranceRangeLowValue}",
									placeholder: "{i18n>CRITICALITY_CONTROL_LOW}",
									width: "80px"
								}).addStyleClass("sapUiTinyMarginBeginEnd"),
								new Input({
									value: "{toleranceRangeHighValue}",
									placeholder: "{i18n>CRITICALITY_CONTROL_HIGH}",
									width: "80px"
								}).addStyleClass("sapUiTinyMarginBeginEnd")
							]
						}),
						new HBox({
							justifyContent: "SpaceAround",
							items: [
								new Text({ textAlign: "End", width: "150px", text: "{i18n>CRITICALITY_CONTROL_DEV_RANGE}" }).addStyleClass(
									"sapUiTinyMarginTop"
								),
								new Input({
									value: "{deviationRangeLowValue}",
									placeholder: "{i18n>CRITICALITY_CONTROL_LOW}",
									width: "80px"
								}).addStyleClass("sapUiTinyMarginBeginEnd"),
								new Input({
									value: "{deviationRangeHighValue}",
									placeholder: "{i18n>CRITICALITY_CONTROL_HIGH}",
									width: "80px"
								}).addStyleClass("sapUiTinyMarginBeginEnd")
							]
						}),
						new HBox({
							justifyContent: "SpaceAround",
							items: [
								new Text({
									textAlign: "End",
									width: "150px",
									text: "{i18n>CRITICALITY_CONTROL_IMP_DIRECTION}"
								}).addStyleClass("sapUiTinyMarginTop"),
								new ComboBox({
									value: "{improvementDirection}",
									width: "176px",
									items: [
										new ListItem({ key: "{i18n>CRITICALITY_CONTROL_MINIMIZE}", text: "Minimize" }),
										new ListItem({ key: "{i18n>CRITICALITY_CONTROL_TARGET}", text: "Target" }),
										new ListItem({ key: "{i18n>CRITICALITY_CONTROL_MAXIMIZE}", text: "Maximize" })
									]
								}).addStyleClass("sapUiTinyMarginBeginEnd")
							]
						}),
						new HBox({
							justifyContent: "End",
							items: [
								new Button({
									text: "{i18n>CRITICALITY_CONTROL_APPLY}",
									width: "176px",
									type: "Ghost",
									press: function (oEvent) {
										var sPath = oEvent.getSource().getBindingContext().getPath();
										that.fireEvent("change", {
											value: that.getItems(),
											isCalcuationType: that.getModel().getProperty(sPath).activeCalculation
										});
									}
								}).addStyleClass("sapUiTinyMarginBeginEnd")
							]
						})
					]
				}).addStyleClass("sapUiTinyMarginBottom");

				this._addButton = new Button({
					icon: "sap-icon://add",
					type: "Transparent",
					press: this._onAddButtonClicked.bind(this)
				});
			},

			_onAddButtonClicked: function () {
				var oModel = this.getModel();
				if (oModel) {
					var aBoundData = oModel.getProperty(this.getBindingPath("items"));
					if (!aBoundData) {
						aBoundData = [];
					}
					aBoundData.push({});
					oModel.refresh();
				}
			},

			_onDeleteButtonClicked: function (oEvent) {
				var that = this,
					sItemBindingPath = this.getBindingPath("items"),
					oModel = this.getModel(),
					sourceCriticalityProperty =
						oModel.getProperty("/configuration/advancedFormattingOptions/sourceCriticalityProperty") || [],
					aCriticalityData = oModel.getProperty("/configuration/mainIndicatorOptions/criticality"),
					sPath;

				if (this.getType() === "COMPACT") {
					var index;

					if (sourceCriticalityProperty && sourceCriticalityProperty.length === 1) {
						sourceCriticalityProperty = sourceCriticalityProperty[0];
						for (var i = 0; i < aCriticalityData.length; i++) {
							if (
								(aCriticalityData[i] && aCriticalityData[i].name) ===
								(sourceCriticalityProperty && sourceCriticalityProperty.name)
							) {
								index = i;
							}
						}

						sPath = index !== undefined ? "/configuration/mainIndicatorOptions/criticality/" + index : "";
						oModel.setProperty("/configuration/advancedFormattingOptions/sourceCriticalityProperty", []);
						sItemBindingPath = "/configuration/mainIndicatorOptions/criticality";
					}
				} else {
					sPath = oEvent.getSource().getBindingContext().getPath();
					var sPropertyName = oModel.getProperty(sPath) && oModel.getProperty(sPath).name,
						sSourcePropertyName =
							sourceCriticalityProperty && sourceCriticalityProperty[0] && sourceCriticalityProperty[0].name;

					if (sPropertyName === sSourcePropertyName) {
						oModel.setProperty("/configuration/advancedFormattingOptions/sourceCriticalityProperty", []);
					}
				}

				if (sPath && sItemBindingPath) {
					oModel.getProperty(sItemBindingPath).splice(sPath.slice(sPath.length - 1), 1);
					oModel.refresh();
					this.fireEvent("change", {
						value: that.getItems()
					});
				}
			},
			renderer: {
				// apiVersion: 2, // TODO: convert to semantic rendering
				render: function (oRM, oControl) {
					if (oControl.getType() === "COMPACT") {
						oControl._addButton.setVisible(false);
						oControl._oList.addStyleClass("sapUiTinyMarginBegin");
					}
					oRM.write("<div");
					oRM.writeControlData(oControl);
					oRM.writeClasses();
					oRM.write(">");
					oRM.renderControl(oControl._oList);
					oRM.renderControl(oControl._addButton);
					oRM.write("</div>");
				}
			}
		});
	}
);
