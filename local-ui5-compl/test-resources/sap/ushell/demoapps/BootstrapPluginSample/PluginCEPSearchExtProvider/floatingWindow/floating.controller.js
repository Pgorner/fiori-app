// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Core",
    "sap/ui/model/json/JSONModel",
    "sap/ui/util/openWindow",
    "sap/ushell/Container"
], function (Controller, Core, JSONModel, openWindow, Container) {
    "use strict";

    return Controller.extend("sap.ushell.demo.PluginCEPSearchExtProvider.floating.controller", {
        onInit: function (oEvent) {
            this.oModel = new JSONModel();
            this.oModel.setData({message: ""});
            this.getView().setModel(this.oModel, "displayModel");
            this.pSearchCEPService = Container.getServiceAsync("SearchCEP");
        },

        onClose: function () {
            var oRenderer = Container.getRendererInternal("fiori2");
            oRenderer.setFloatingContainerVisibility(false);
            this.oModel.setProperty("/message", "");
        },

        onButtonPress: function (sParamString) {
            var aParams = sParamString.split("_"),
                sAction = aParams[0],
                sListName = aParams[1];

            this.pSearchCEPService.then(function (oSearchCEPService) {
                var fnGetConfig = this._getProviderConfig.bind(this),
                    oProvider = fnGetConfig(sListName),
                    fnHandleProvider = sAction + "ExternalSearchProvider",
                    oOptions = {
                        register: {
                            message: "added",
                            parameter: oProvider
                        },
                        unregister: {
                            message: "removed",
                            parameter: oProvider.id
                        }
                    };

                oSearchCEPService[fnHandleProvider](oOptions[sAction].parameter).then(function () {
                    this.oModel.setProperty("/message", "New list " + oOptions[sAction].message + "!");
                    setTimeout(function () {
                        this.oModel.setProperty("/message", "");
                    }.bind(this), 1500);
                }.bind(this));
            }.bind(this));
        },

        _navigateToUrl: function (sUrl) {
            openWindow(sUrl);
        },

        _getProviderConfig: function (sListName) {

            var that = this,
                oListConfig = {
                    travel: {
                        minQueryLength: 0,
                        maxQueryLength: 0,
                        items: [{
                            icon: "sap-icon://flight",
                            text: "Check popular destinations",
                            press: function () {
                                that._navigateToUrl("https://www.tripadvisor.com/TravelersChoice-Destinations-cPopular-g1");
                            }
                        }, {
                            icon: "sap-icon://suitcase",
                            text: "Book flights & hotels",
                            closePopover: false,
                            press: function () {
                                that._navigateToUrl("https://booking.com/");
                            }
                        }, {
                            icon: "sap-icon://employee-lookup",
                            text: "Hire local guides",
                            press: function () {
                                that._navigateToUrl("https://toursbylocals.com/");
                            }
                        }, {
                            icon: "sap-icon://business-card",
                            text: "Travel related blogs",
                            press: function () {
                                that._navigateToUrl("https://detailed.com/travel-blogs/");
                            }
                        }],
                        id: "travelAppsList",
                        title: "Your travel assistant"
                    },
                    course: {
                        minQueryLength: 1,
                        maxQueryLength: 100,
                        closePopover: false,
                        items: [{
                            icon: "sap-icon://e-learning",
                            text: "Top online courses for 2023",
                            press: function () {
                                that._navigateToUrl("https://nypost.com/article/best-online-classes/");
                            }
                        }, {
                            icon: "sap-icon://desktop-mobile",
                            text: "Study on the go",
                            closePopover: true,
                            press: function () {
                                that._navigateToUrl("https://elearningindustry.com/top-mobile-learning-platforms-lms-list");
                            }
                        }, {
                            icon: "sap-icon://accounting-document-verification",
                            text: "Get certified by universities",
                            press: function  () {
                                that._navigateToUrl("https://www.coursera.org/degrees");
                            }
                        }, {
                            icon: "sap-icon://business-card",
                            text: "Education related blogs",
                            press: function () {
                                that._navigateToUrl("https://detailed.com/education-blogs/");
                            }
                        }, {
                            icon: "sap-icon://badge",
                            text: "Free online courses",
                            press: function () {
                                that._navigateToUrl("https://www.coursera.org/courses?query=free");
                            }
                        }, {
                            icon: "sap-icon://study-leave",
                            text: "Education vs. Experience",
                            press: function () {
                                that._navigateToUrl("https://www.investopedia.com/financial-edge/0511/work-experience-vs.-education-which-lands-you-the-best-job.aspx");
                            }
                        }, {
                            icon: "sap-icon://work-history",
                            text: "Managing a successful career",
                            press: function () {
                                that._navigateToUrl("https://www.indeed.com/career-advice/career-development/managing-a-career");
                            }
                        }, {
                            icon: "sap-icon://compare",
                            text: "Balancing work and study",
                            press: function () {
                                that._navigateToUrl("https://ici.net.au/blog/7-tips-for-balancing-work-and-study/");
                            }
                        }],
                        id: "studyCourseList",
                        title: "Explore online courses"
                    }
                };

            var oList = {
                id: oListConfig[sListName].id,
                entryType: "app",
                title: oListConfig[sListName].title,
                titleVisible: true,
                minQueryLength: oListConfig[sListName].minQueryLength,
                maxQueryLength: oListConfig[sListName].maxQueryLength,
                defaultItemCount: 3,
                maxItemCount: 10,
                priority: 10,

                execSearch: function (sQuery) {

                    var aListItems = oListConfig[sListName].items;
                    if (sQuery) {
                        sQuery = sQuery.toLowerCase();

                        that.oModel.setProperty("/message", "Searching for '" + sQuery.toUpperCase() + "' ...");
                        setTimeout(function () {
                            that.oModel.setProperty("/message", "");
                        }.bind(that), 10000);
                        aListItems = aListItems.filter(function (oListItem) {
                            var sItemText = oListItem.text.toLowerCase();
                            return sItemText.indexOf(sQuery) > -1;
                        });
                    }

                    return Promise.resolve(aListItems);
                },

                itemPress: function (oEvent) {
                    that.oModel.setProperty("/message", "List item pressed!");
                    setTimeout(function () {
                        that.oModel.setProperty("/message", "");
                    }.bind(that), 1500);
                },

                popoverClosed: function () {
                    that.oModel.setProperty("/message", "Popover closed!");
                    setTimeout(function () {
                        that.oModel.setProperty("/message", "");
                    }.bind(that), 2500);
                }
            };

            if (oListConfig[sListName].hasOwnProperty("closePopover")) {
                oList.closePopover = oListConfig[sListName].closePopover;
            }
            return oList;
        }
    });
});
