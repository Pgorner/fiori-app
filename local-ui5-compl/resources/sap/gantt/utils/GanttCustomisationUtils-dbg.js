/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/ui/comp/smartform/SmartForm",
    "sap/ui/comp/smartform/Group",
    "sap/ui/comp/smartform/GroupElement",
    "sap/m/SelectDialog",
    "sap/m/CustomListItem",
    "sap/m/Input",
    "sap/ui/core/theming/Parameters",
    "sap/ui/core/Icon",
    "sap/m/HBox",
    "sap/m/Text",
    "sap/m/DateRangeSelection",
    "sap/gantt/misc/Format",
    "sap/gantt/library",
	"sap/ui/core/Lib"
],  function (
    JSONModel,
    Button,
    Dialog,
    SmartForm,
    Group,
    GroupElement,
    SelectDialog,
    CustomListItem,
    Input,
    Parameters,
    Icon,
    HBox,
    Text,
    DateRangeSelection,
    Format,
    library,
    Lib) {
    'use strict';


	var oResourceBundle = Lib.getResourceBundleFor("sap.gantt");
    var oPalette = library.palette;
    var aColors = oPalette.SemanticColors
        .concat(oPalette.LegendColors)
        .concat(oPalette.AccentColors);
    var colorPalette = function () {
        var aColorsList = aColors.map(function (color) {
            return { color: color };
        });
        return new JSONModel({
            colors: aColorsList
        });
    };

    var GanttCustomisationUtils = {
        dialogBox: function (oControl, isDeltaline) {
            return new Promise(function (resolve, reject) {
                var timeStamp = "";
                if (isDeltaline) {
                    timeStamp = new DateRangeSelection({
                        dateValue: Format.abapTimestampToDate(oControl.getTimeStamp()),
                        secondDateValue: Format.abapTimestampToDate(oControl.getEndTimeStamp()),
                        minDate: (new Date(1900, 0, 1)),
                        maxDate: (new Date(2100, 12, 31))
                    });
                } else {
                    timeStamp = new Input({
                        placeholder: oResourceBundle.getText("TXT_CH_AL_PH_TIMESTAMP"),
                        value: oControl.getTimeStamp()
                    });
                }

                var oSF = new SmartForm({
                    editable: true,
                    useHorizontalLayout: false,
                    groups: [
                        new Group({
                            groupElements: [
                                new GroupElement({
                                    label: oResourceBundle.getText("TXT_CH_AL_STROKE"),
                                    elements: [
                                        new Input({
                                            type: "Text",
                                            value: {
                                                path: 'colors',
                                                formatter: function (aColorsList) {
                                                    aColorsList = aColors;
                                                    for (var i = 0; i < aColorsList.length; i++) {
                                                        if (oControl.getStroke() === Parameters.get(aColorsList[i])) {
                                                            return aColorsList[i];
                                                        }
                                                    }
                                                }
                                            },
                                            placeholder: oResourceBundle.getText("TXT_CH_AL_PH_STROKE_VALUE"),
                                            showValueHelp: true,
                                            valueHelpOnly: true,
                                            valueHelpRequest: function () {
                                                if (this.oSelectDialog) {
                                                    this.oSelectDialog.open();
                                                    return;
                                                }
                                                this.oSelectDialog = new SelectDialog({
                                                    title: oResourceBundle.getText("TXT_CH_AL_DIALOG_COLOR_SELECTOR"),
                                                    confirm: function (oEvent) {
                                                        oSF.getGroups()[0].getGroupElements()[0].getElements()[0].setValue(oEvent.getParameter("selectedItem").getContent()[0].getItems()[1].getText());
                                                    },
                                                    items: {
                                                        growing: false,
                                                        path: "colors>/colors",
                                                        template: new CustomListItem({
                                                            content: [
                                                                new HBox({
                                                                    alignItems: "Center",
                                                                    items: [
                                                                        new Icon({
                                                                            src: "sap-icon://color-fill",
                                                                            color: {
                                                                                path: 'colors>color',
                                                                                formatter: function (sColor) {
                                                                                    return Parameters.get(sColor);
                                                                                }
                                                                            }
                                                                        }).addStyleClass("sapUiTinyMargin"),
                                                                        new Text({
                                                                            text: {
                                                                                path: 'colors>color',
                                                                                formatter: function (sColor) {
                                                                                    return sColor;
                                                                                }
                                                                            }
                                                                        })
                                                                    ]
                                                                })
                                                            ]
                                                        }),
                                                        templateShareable: false,
                                                        showSecondaryValues: true
                                                    }
                                                });
                                                this.oSelectDialog.setModel(colorPalette(), "colors");
                                                this.oSelectDialog.open();
                                            }
                                        })
                                    ]
                                }),
                                new GroupElement({
                                    label: oResourceBundle.getText("TXT_CH_AL_STROKE_DASHARRAY"),
                                    elements: [
                                        new Input({
                                            placeholder: oResourceBundle.getText("TXT_CH_AL_PH_STROKE_DASHARRAY"),
                                            value: oControl.getStrokeDasharray()
                                        })
                                    ]
                                }),
                                new GroupElement({
                                    label: oResourceBundle.getText("TXT_CH_AL_STROKE_OPACITY"),
                                    elements: [
                                        new Input({
                                            placeholder: oResourceBundle.getText("TXT_CH_AL_PH_STROKE_OPACITY"),
                                            value: oControl.getStrokeOpacity()
                                        })
                                    ]
                                }),
                                new GroupElement({
                                    label: oResourceBundle.getText("TXT_CH_AL_TIMESTAMP"),
                                    elements: [
                                        timeStamp
                                    ]
                                }),
                                new GroupElement({
                                    label: oResourceBundle.getText("TXT_CH_AL_DESCRIPTION"),
                                    elements: [
                                        new Input({
                                            placeholder: oResourceBundle.getText("TXT_CH_AL_PH_DESCRIPTION"),
                                            value: oControl.getDescription()
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                });
                oSF.getGroups()[0].getGroupElements()[0].getElements()[0].setModel(colorPalette());

                var oSaveButton = new Button({
                    text: oResourceBundle.getText("SAVE_BUTTON"),
                    type: "Emphasized"
                }),
                    oCancelButton = new Button({
                        text: oResourceBundle.getText("CANCEL_BUTTON")
                    });
                var linesDialogBox = new Dialog({
                    title: isDeltaline ? oResourceBundle.getText("TXT_CH_DL_DIALOG_TITLE") : oResourceBundle.getText("TXT_CH_AL_DIALOG_TITLE"),
                    buttons: [oSaveButton, oCancelButton],
                    content: [oSF]
                });

                oCancelButton.attachPress(function (oEvent) {
                    linesDialogBox.close();
                });
                oSaveButton.attachPress(function (oEvent) {
                    var aDialogContent = linesDialogBox.getContent()[0].getGroups()[0].getGroupElements(),
                        mChangeContent = {
                            newChange: {
                                stroke: Parameters.get(aDialogContent[0].getElements()[0].getValue()),
                                strokeDasharray: aDialogContent[1].getElements()[0].getValue(),
                                strokeOpacity: parseFloat(aDialogContent[2].getElements()[0].getValue()),
                                description: aDialogContent[4].getElements()[0].getValue()
                            },
                            oldChange: {
                                stroke: oControl.getStroke(),
                                strokeDasharray: oControl.getStrokeDasharray(),
                                strokeOpacity: oControl.getStrokeOpacity(),
                                description: oControl.getDescription()
                            }
                        };
                    if (isDeltaline) {
                        mChangeContent.newChange["timeStamp"] = Format.dateToAbapTimestamp(aDialogContent[3].getElements()[0].getDateValue());
                        mChangeContent.newChange["endTimeStamp"] = Format.dateToAbapTimestamp(aDialogContent[3].getElements()[0].getSecondDateValue());
                        mChangeContent.oldChange["timeStamp"] = oControl.getTimeStamp();
                        mChangeContent.oldChange["endTimeStamp"] = oControl.getEndTimeStamp();
                    } else {
                        mChangeContent.newChange["timeStamp"] = aDialogContent[3].getElements()[0].getValue();
                        mChangeContent.oldChange["timeStamp"] = oControl.getTimeStamp();
                    }
                    linesDialogBox.close();
                    resolve(mChangeContent);
                });
                linesDialogBox.open();
            });
        },
        designTimeSettings: function (transalteKey, fnChangeHandler) {
            return {
                icon: "sap-icon://edit",
                name: oResourceBundle.getText(transalteKey),
                isEnabled: true,
                handler: fnChangeHandler
            };
        }
    };

    return GanttCustomisationUtils;
}, /* bExport= */true);
