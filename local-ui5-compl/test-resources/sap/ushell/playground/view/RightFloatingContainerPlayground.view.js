// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/View",
    "sap/ushell/ui/shell/RightFloatingContainer",
    "sap/ui/model/json/JSONModel",
    "sap/m/Label",
    "sap/m/Input",
    "sap/ui/model/type/String",
    "sap/m/Switch",
    "sap/ui/model/type/Boolean",
    "sap/m/Select",
    "sap/ui/core/Item",
    "sap/ui/core/library",
    "sap/m/Button",
    "sap/m/NotificationListItem",
    "sap/ui/layout/Grid",
    "sap/ui/layout/form/SimpleForm",
    "sap/m/Panel",
    "sap/m/Page"
], function (
    View,
    RightFloatingContainer,
    JSONModel,
    Label,
    Input,
    TypeString,
    Switch,
    TypeBoolean,
    Select,
    Item,
    coreLibrary,
    Button,
    NotificationListItem,
    Grid,
    SimpleForm,
    Panel,
    Page
) {
    "use strict";


    // shortcut for sap.ui.core.Priority
    var Priority = coreLibrary.Priority;

    return View.extend("sap.ushell.playground.view.RightFloatingContainerPlayground", {
        createContent: function (oController) {
            var oPage = this._createPage();
            return oPage;
        },

        _createPage: function () {
            var oData = {
                size: "56px",
                top: "0",
                right: "0",
                textVisible: true,
                hideItemsAfterPresentation: false,
                enableBounceAnimations: false,
                actAsPreviewContainer: false,
                floatingContainerItemCount: 0,
                description: "",
                hideShowMoreButton: false,
                truncate: false,
                authorName: "",
                authorPicture: "",
                datetime: "",
                priority: Priority.None,
                showButtons: true,
                showCloseButton: true,
                title: ""
            };

            var oModel = new JSONModel(oData);

            function addRightFloatingContainerControls (oForm) {
                oForm.addContent(new Label({
                    text: "Size"
                }));

                oForm.addContent(new Input({
                    placeholder: "Enter size ...",
                    value: {
                        path: "/size",
                        type: new TypeString()
                    },
                    liveChange: function (oEvt) {
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new Label({
                    text: "Top"
                }));

                oForm.addContent(new Input({
                    placeholder: "Enter top ...",
                    value: {
                        path: "/top",
                        type: new TypeString()
                    },
                    liveChange: function (oEvt) {
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new Label({
                    text: "Right"
                }));

                oForm.addContent(new Input({
                    placeholder: "Enter right ...",
                    value: {
                        path: "/right",
                        type: new TypeString()
                    },
                    liveChange: function (oEvt) {
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new Label({
                    text: "Text visible"
                }));

                oForm.addContent(new Switch({
                    state: {
                        path: "/textVisible",
                        type: new TypeBoolean()
                    }
                }));

                oForm.addContent(new Label({
                    text: "Hide items after presentation"
                }));

                oForm.addContent(new Switch("hideItemsAfterPresentation-switch", {
                    state: {
                        path: "/hideItemsAfterPresentation",
                        type: new TypeBoolean()
                    }
                }));

                oForm.addContent(new Label({
                    text: "Enable Bounce Animations"
                }));

                oForm.addContent(new Switch("enableBounceAnimations-switch", {
                    state: {
                        path: "/enableBounceAnimations",
                        type: new TypeBoolean()
                    }
                }));

                oForm.addContent(new Label({
                    text: "Act as previewcontainer"
                }));

                oForm.addContent(new Switch("actAsPreviewContainer-switch", {
                    state: {
                        path: "/actAsPreviewContainer",
                        type: new TypeBoolean()
                    }
                }));
            }

            function addItemControls (oForm) {
                oForm.addContent(new Label({
                    text: "Item Description"
                }));

                oForm.addContent(new Input({
                    placeholder: "Enter item description ...",
                    value: {
                        path: "/description",
                        type: new TypeString()
                    },
                    liveChange: function (oEvt) {
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new Label({
                    text: "Item hide 'showmore' button"
                }));

                oForm.addContent(new Switch("hideShowMoreButton-switch", {
                    state: {
                        path: "/hideShowMoreButton",
                        type: new TypeBoolean()
                    }
                }));

                oForm.addContent(new Label({
                    text: "Item truncate"
                }));

                oForm.addContent(new Switch("truncate-switch", {
                    state: {
                        path: "/truncate",
                        type: new TypeBoolean()
                    }
                }));

                oForm.addContent(new Label({
                    text: "Item Author name"
                }));

                oForm.addContent(new Input({
                    placeholder: "Enter item author name ...",
                    value: {
                        path: "/authorName",
                        type: new TypeString()
                    },
                    liveChange: function (oEvt) {
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new Label({
                    text: "Item set author picture"
                }));

                oForm.addContent(new Select("author-picture-select", {
                    items: [
                        new Item({
                            key: "",
                            text: "none"
                        }),
                        new Item({
                            key: "sap-icon://world",
                            text: "world"
                        }),
                        new Item({
                            key: "sap-icon://customer-financial-fact-sheet",
                            text: "customer-financial-fact-sheet"
                        }),
                        new Item({
                            key: "sap-icon://delete",
                            text: "delete"
                        }),
                        new Item("refresh-item", {
                            key: "sap-icon://refresh",
                            text: "refresh"
                        }),
                        new Item({
                            key: "sap-icon://email",
                            text: "email"
                        }),
                        new Item({
                            key: "sap-icon://hide",
                            text: "hide"
                        }),
                        new Item({
                            key: "sap-icon://home",
                            text: "home"
                        }),
                        new Item({
                            key: "sap-icon://documents",
                            text: "documents"
                        }),
                        new Item({
                            key: "sap-icon://copy",
                            text: "copy"
                        })
                    ],
                    change: function (oEvt) {
                        oData.authorPicture = oEvt.getParameter("selectedItem").getKey();
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new Label({
                    text: "Item set date"
                }));

                oForm.addContent(new Input({
                    placeholder: "Enter item date ...",
                    value: {
                        path: "/datetime",
                        type: new TypeString()
                    },
                    liveChange: function (oEvt) {
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new Label({
                    text: "Item set priority"
                }));

                oForm.addContent(new Select("priority-select", {
                    items: [
                        new Item({
                            key: Priority.None,
                            text: "none"
                        }),
                        new Item("low-item", {
                            key: Priority.Low,
                            text: "low"
                        }),
                        new Item({
                            key: Priority.Medium,
                            text: "medium"
                        }),
                        new Item({
                            key: Priority.High,
                            text: "high"
                        })
                    ],
                    change: function (oEvt) {
                        oData.priority = oEvt.getParameter("selectedItem").getKey();
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new Label({
                    text: "Item show buttons"
                }));

                oForm.addContent(new Switch("showButtons-switch", {
                    state: {
                        path: "/showButtons",
                        type: new TypeBoolean()
                    }
                }));

                oForm.addContent(new Label({
                    text: "Item show close button"
                }));

                oForm.addContent(new Switch("showCloseButton-switch", {
                    state: {
                        path: "/showCloseButton",
                        type: new TypeBoolean()
                    }
                }));

                oForm.addContent(new Label({
                    text: "Item title"
                }));

                oForm.addContent(new Input({
                    placeholder: "Enter item title ...",
                    value: {
                        path: "/title",
                        type: new TypeString()
                    },
                    liveChange: function (oEvt) {
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new Button({
                    text: "Add Item",
                    press: function (oEvt) {
                        oData.floatingContainerItemCount++;
                        oRightFloatingContainer.addFloatingContainerItem(new NotificationListItem({
                            description: oData.description,
                            hideShowMoreButton: oData.hideShowMoreButton,
                            truncate: oData.truncate,
                            authorName: oData.authorName,
                            authorPicture: oData.authorPicture,
                            datetime: oData.datetime,
                            priority: oData.priority,
                            showButtons: oData.showButtons,
                            showCloseButton: oData.showCloseButton,
                            title: oData.title
                        }));
                        oModel.checkUpdate();
                    }
                }));
            }

            var oRightFloatingContainer = new RightFloatingContainer({
                size: "{/size}",
                top: "{/top}",
                right: "{/right}",
                textVisible: "{/textVisible}",
                hideItemsAfterPresentation: "{/hideItemsAfterPresentation}",
                enableBounceAnimations: "{/enableBounceAnimations}",
                actAsPreviewContainer: "{/actAsPreviewContainer}",
                visible: true
            });

            var oGrid = new Grid({
                defaultSpan: "XL4 L4 M6 S12",
                content: [oRightFloatingContainer]
            });

            var oForm = new SimpleForm({
                layout: "ColumnLayout",
                title: "Modify Right Floating Container",
                editable: true
            });

            addRightFloatingContainerControls(oForm);
            addItemControls(oForm);

            var oControlPanel = new Panel({
                backgroundDesign: "Solid",
                content: oGrid,
                height: "400px"
            });

            var oPage = new Page("rightFloatingContainerPage", {
                title: "Right Floating Container Demo",
                content: [oControlPanel, oForm]
            }).setModel(oModel);

            return oPage;
        }
    });
});
