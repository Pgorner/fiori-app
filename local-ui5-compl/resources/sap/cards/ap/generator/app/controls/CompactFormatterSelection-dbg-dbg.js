/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/base/util/deepClone", "sap/m/Button", "sap/m/CheckBox", "sap/m/ComboBox", "sap/m/CustomListItem", "sap/m/FlexBox", "sap/m/HBox", "sap/m/Input", "sap/m/List", "sap/m/Select", "sap/m/StepInput", "sap/m/Text", "sap/m/VBox", "sap/ui/core/Control", "sap/ui/core/Item", "sap/ui/core/ListItem", "sap/ui/model/json/JSONModel", "../../config/FormatterOptions", "../../odata/ODataUtils"], function (deepClone, Button, CheckBox, ComboBox, CustomListItem, FlexBox, HBox, Input, List, Select, StepInput, Text, VBox, Control, Item, ListItem, JSONModel, ____config_FormatterOptions, ODataUtils) {
  "use strict";

  const getFormatterConfiguration = ____config_FormatterOptions["getFormatterConfiguration"];
  /**
   * @namespace sap.cards.ap.generator.app.controls
   */
  const CompactFormatterSelection = Control.extend("sap.cards.ap.generator.app.controls.CompactFormatterSelection", {
    renderer: {
      apiVersion: 2,
      render: function (rm, control) {
        if (control.getType() === "COMPACT") {
          control._deleteButton.setVisible(false);
          control._applyButton.setVisible(false);
        }
        rm.openStart("div", control);
        rm.openEnd();
        rm.renderControl(control._selectorControl);
        rm.renderControl(control._deleteButton);
        rm.renderControl(control._List);
        rm.renderControl(control._applyButton);
        rm.close("div");
      }
    },
    metadata: {
      properties: {
        type: "string",
        formatters: "object"
      },
      aggregations: {
        _list: {
          type: "sap.m.List",
          multiple: false,
          visibility: "hidden"
        }
      },
      events: {
        change: {
          parameters: {
            value: {
              type: "object"
            }
          }
        }
      }
    },
    constructor: function _constructor(settings) {
      Control.prototype.constructor.call(this, settings);
    },
    /**
     * Initializes the component
     * This method creates a new List control (_List) and calls the superclass's init method
     *
     * @returns {void}
     */
    init: function _init() {
      this._List = new List();
      Control.prototype.init.call(this);
    },
    /**
     * Sets the formatters for the control
     *
     * @param {FormatterConfigurationMap} formatters - An array of Formatter objects representing the formatters to be set.
     * @returns {void}
     */
    setFormatters: function _setFormatters(formatters) {
      this.setAggregation("_list", this._List);
      this.setProperty("formatters", formatters, true);
      const model = this.getModel();
      const selectedProperty = model.getProperty("/configuration/advancedFormattingOptions/targetFormatterProperty");
      const emptyObj = {};
      let selectedFormatter = formatters.find(formatter => formatter.property === selectedProperty) || emptyObj;
      const properties = model.getData().configuration.properties;
      const type = properties.find(property => property.name === selectedProperty)?.type || "";
      this.createControl(type);
      if (selectedFormatter.formatterName === "format.unit" && typeof selectedFormatter.parameters?.[1].properties?.[0].value === "number") {
        const i18nModel = this.getModel("i18n");
        selectedFormatter.formatterName = "format.float";
        selectedFormatter.displayName = i18nModel.getObject("FORMAT_FLOAT");
        if (selectedFormatter.parameters) {
          selectedFormatter.parameters[0] = selectedFormatter.parameters[1];
        }
        selectedFormatter.parameters?.splice(1, 1);
      } else if (selectedFormatter.formatterName === "format.unit") {
        selectedFormatter = emptyObj;
      }
      this._refreshControl(selectedFormatter);
      if (selectedFormatter.formatterName) {
        this._selectorControl.setSelectedKey(selectedFormatter.formatterName);
      }
    },
    /**
     * Refreshes the control with the provided formatter
     * @param {FormatterConfiguration} formatter - The formatter to be used for refreshing the control
     * @returns {void}
     * @private
     */
    _refreshControl: function _refreshControl(formatter) {
      const listModel = new JSONModel({
        listItems: [formatter]
      });
      this._List.bindItems({
        path: "/listItems",
        template: new CustomListItem({
          content: [new VBox({
            justifyContent: "SpaceAround"
          }).bindAggregation("items", {
            path: "parameters",
            factory: this._createParametersControl.bind(this)
          })]
        })
      }).setModel(listModel);
    },
    /**
     * Creates a select control with the formatter list based on the provided type
     *
     * @param {string} type - The type of the control to be created
     * @returns {void}
     */
    createControl: function _createControl(type) {
      const i18nModel = this.getModel("i18n");
      let formatterConfigList = deepClone(getFormatterConfiguration());
      const isDateType = ODataUtils.isPropertyTypeDate(type);
      const isNumberType = type === "Edm.Decimal" || type === "Edm.Int16" || type === "Edm.Int32" || type === "Edm.Double";
      formatterConfigList = formatterConfigList.filter(formatterConfig => formatterConfig.visible === true);
      if (isDateType) {
        formatterConfigList = formatterConfigList.filter(formatterConfig => formatterConfig.type === "Date");
      } else if (isNumberType) {
        formatterConfigList = formatterConfigList.filter(formatterConfig => formatterConfig.type === "numeric" || formatterConfig.type === "string | numeric");
      } else {
        formatterConfigList = formatterConfigList.filter(formatterConfig => formatterConfig.type === "string" || formatterConfig.type === "string | numeric");
      }
      const formatterListModel = new JSONModel({
        formattersList: formatterConfigList
      });
      this._selectorControl = new ComboBox({
        width: "80%",
        items: {
          path: "/formattersList",
          template: new ListItem({
            key: "{formatterName}",
            text: "{displayName}"
          })
        },
        change: this.onFormatterSelected.bind(this)
      }).addStyleClass("sapUiTinyMarginBegin").setModel(formatterListModel);
      this._deleteButton = new Button({
        icon: "sap-icon://delete",
        type: "Transparent",
        press: this.deleteFormatter.bind(this)
      });
      this._applyButton = new Button({
        text: i18nModel.getObject("FORMATTER_CONTROL_APPLY"),
        type: "Ghost",
        press: this.applyFormatter.bind(this)
      });
    },
    /**
     * Creates a control for displaying and editing parameters based on the provided property type
     *
     * @param {string} id - ID of the control
     * @param {*} context - context object containing information about the property
     * @returns {sap.ui.core.Control} A control for displaying and editing parameters
     * @private
     */
    _createParametersControl: function _createParametersControl(id, context) {
      const property = context.getProperty();
      const propertyType = property.type;
      let inputControl,
        hBoxItems = [];
      if (propertyType !== "object") {
        hBoxItems = [new Text({
          width: "200px",
          text: "{displayName} : "
        }).addStyleClass("sapUiTinyMarginTop sapUiTinyMarginBegin")];
      }
      switch (propertyType) {
        case "boolean":
          inputControl = new CheckBox({
            width: "116px",
            selected: "{selected}"
          });
          break;
        case "enum":
          inputControl = this._createSelectControl("{selectedKey}", property.options);
          break;
        case "object":
          {
            const flexBoxItems = [];
            for (let i = 0; i < property.properties.length; i++) {
              const currentProperty = property.properties[i];
              if (currentProperty && typeof currentProperty.value !== "object") {
                const rowItem = [];
                const displayName = currentProperty.displayName;
                const propertyType = currentProperty.type;
                switch (propertyType) {
                  case "boolean":
                    inputControl = new CheckBox({
                      width: "116px",
                      selected: {
                        path: "properties/" + i + "/selected/"
                      }
                    });
                    break;
                  case "enum":
                    inputControl = this._createSelectControl("{properties/" + i + "/selectedKey}", currentProperty.options);
                    break;
                  case "number":
                    this.setDefaultStepInputValue(currentProperty);
                    const bindingInfo = {
                      path: `properties/${i}/value`
                    };
                    inputControl = new StepInput({
                      width: "116px",
                      min: 0,
                      max: 2,
                      value: bindingInfo
                    });
                    break;
                  default:
                    inputControl = new Input({
                      width: "176px",
                      value: "{properties/" + i + "/value}"
                    });
                }
                rowItem.push(new Text({
                  width: "200px",
                  text: displayName + " : "
                }).addStyleClass("sapUiTinyMarginTop sapUiTinyMarginBegin"));
                rowItem.push(inputControl);
                const hBox = new HBox({
                  justifyContent: "Start",
                  items: rowItem
                });
                flexBoxItems.push(hBox);
              }
            }
            return new FlexBox({
              items: flexBoxItems,
              direction: "Column"
            });
          }
        default:
          inputControl = new Input({
            width: "108px",
            value: "{value}"
          });
          break;
      }
      hBoxItems.push(inputControl);
      return new HBox({
        justifyContent: "Start",
        items: hBoxItems
      });
    },
    setDefaultStepInputValue: function _setDefaultStepInputValue(prop) {
      prop.value = prop.value >= 0 ? prop.value : prop.defaultValue;
      return prop;
    },
    /**
     * Creates a select control based on the provided selected key and property options
     *
     * @param {string} selectedKey - The selected key for the select control
     * @param {Array<PropertyOptions>} propertyOptions - An array of propertyOptions representing the options for the select control
     * @returns {sap.m.Select} Select control populated with the provided property options
     * @private
     */
    _createSelectControl: function _createSelectControl(selectedKey, propertyOptions) {
      const inputControl = new Select({
        width: "108px",
        selectedKey: selectedKey
      });
      for (const item of propertyOptions) {
        inputControl.addItem(new Item({
          text: item.name,
          key: item.value
        }));
      }
      return inputControl;
    },
    /**
     * Handles the event when a formatter is selected
     *
     * @param {Event} event - The event object representing the selection event
     * @returns {void}
     */
    onFormatterSelected: function _onFormatterSelected(event) {
      const model = this.getModel();
      const targetProperty = model.getProperty("/configuration/advancedFormattingOptions/targetFormatterProperty");
      const source = event.getSource();
      const selectedKey = source.getSelectedKey();
      const formatterConfig = getFormatterConfiguration().find(formatter => {
        return formatter.formatterName === selectedKey;
      });
      const isSelectedKey = selectedKey && formatterConfig ? true : false;
      model.setProperty("/configuration/advancedFormattingOptions/isFormatterApplied", isSelectedKey);
      this._refreshControl(Object.assign({
        property: targetProperty
      }, deepClone(formatterConfig)));
    },
    /**
     * Applies the selected formatter to the control, fires the change event with the updated propertyValueFormatters
     *
     * @returns {void}
     */
    applyFormatter: function _applyFormatter() {
      const listItemsData = this._List.getModel().getProperty("/listItems");
      this._updatePropertyValueFormatters(listItemsData[0]);
      const propertyValueFormatters = this.getModel().getProperty("/configuration/advancedFormattingOptions/propertyValueFormatters");
      this.fireEvent("change", {
        value: propertyValueFormatters
      });
    },
    /**
     * Deletes the selected formatter from the control, fires the change event with the updated propertyValueFormatters
     *
     * @returns {void}
     */
    deleteFormatter: function _deleteFormatter() {
      const model = this.getModel();
      const targetProperty = model.getProperty("/configuration/advancedFormattingOptions/targetFormatterProperty");
      const propertyValueFormatters = this.getFormatters();
      let index = -1;
      propertyValueFormatters.forEach((propertyValueFormatter, i) => {
        if (propertyValueFormatter.property === targetProperty) {
          index = i;
        }
      });
      if (index !== -1) {
        propertyValueFormatters.splice(index, 1);
      }
      model.setProperty("/configuration/advancedFormattingOptions/propertyValueFormatters", propertyValueFormatters);
      const emptyObj = {};
      this._refreshControl(emptyObj);
      this.fireEvent("change", {
        value: propertyValueFormatters
      });
      this._selectorControl.setSelectedKey("");
    },
    /**
     * Updates the propertyValueFormatters model with the provided formatter configuration
     *
     * @param formatterConfig - The formatter configuration to be updated
     * @returns {void}
     * @private
     */
    _updatePropertyValueFormatters: function _updatePropertyValueFormatters(formatterConfig) {
      if (formatterConfig.parameters) {
        const parameterLength = formatterConfig.parameters.length;
        for (let i = 0; i < parameterLength; i++) {
          if (formatterConfig.parameters[i].type === "string") {
            // If a parameter is of type string, set the value to an empty string if it is undefined
            formatterConfig.parameters[i].value = formatterConfig.parameters[i].value || formatterConfig.parameters[i].defaultValue;
          }
        }
      }
      const targetProperty = formatterConfig.property;
      const propertyValueFormatters = this.getFormatters();
      let index = -1;
      propertyValueFormatters.forEach((propertyValueFormatter, i) => {
        if (propertyValueFormatter.property === targetProperty) {
          index = i;
        }
      });
      if (index !== -1) {
        propertyValueFormatters[index] = formatterConfig;
      } else {
        propertyValueFormatters.push(formatterConfig);
      }
      this.getModel().setProperty("/configuration/advancedFormattingOptions/propertyValueFormatters", propertyValueFormatters);
    }
  });
  return CompactFormatterSelection;
});
//# sourceMappingURL=CompactFormatterSelection-dbg-dbg.js.map
