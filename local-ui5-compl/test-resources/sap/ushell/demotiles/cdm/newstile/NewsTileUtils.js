// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/util/extend"
], function (extend) {
    "use strict";

    // ===========================================================================================
    //       This demo tile is only used for test content and shall not be used productively!
    // ===========================================================================================
    // The demo version does only support a limited set of features in comparison to the original news tile

    var NewsTileUtils = {
        fetchRssFeeds: function (aFeedLinks) {
            return Promise.all(aFeedLinks.map(function (sFeedLink) {
                return fetch(sFeedLink)
                    .then(function (oResponse) {
                        return oResponse.text();
                    })
                    .then(function (sText) {
                        var document = new window.DOMParser().parseFromString(sText, "text/xml");
                        return Array.from(document.querySelectorAll("item"))
                            .map(function (oItemNode) {
                                var oItem = [
                                    "guid",
                                    "title",
                                    "description",
                                    "source",
                                    "link",
                                    "pubDate"
                                ]
                                    .reduce(function (oItem, sField) {
                                        var oSubNode = oItemNode.querySelector(sField);
                                        oItem[sField] = oSubNode ? oSubNode.innerHTML : "";
                                        return oItem;
                                    }, {});

                                oItem.pubDate = oItem.pubDate ? new Date(oItem.pubDate) : new Date();
                                return oItem;
                            });
                    })
                    .catch(function () {
                        return [];
                    });
            }))
                .then(function (aFeeds) {
                    return aFeeds.reduce(function (aAcc, aCurrentFeed) {
                        return aAcc.concat(aCurrentFeed);
                    }, []);
                });
        },

        _isValidDate (dDate) {
            return !(Object.prototype.toString.call(dDate) !== "[object Date]" || isNaN(dDate.getTime()));
        },

        _getSafeTileConfiguration: function (oConfig, oTileProperties) {
            if (typeof oConfig !== "object" && typeof oTileProperties !== "object") {
                // clone oTileProperties as it will be modified
                return {};
            }

            // personalization overwrites configuration
            var oMergedConfig = extend(
                oConfig || {},
                oTileProperties && oTileProperties.tilePersonalization || {}
            );

            return oMergedConfig;
        },

        getDefaultImageConfig: function (oConfig, oTileProperties) {
            this._getSafeTileConfiguration(oConfig, oTileProperties).defaultImage; // eslint-disable-line no-unused-expressions
        },

        getFinalDefaultImageForDrillDown: function (oChipApi) {
            return "../../../../sap/ushell/demotiles/cdm/newstile/NewsImage1.png";
        },

        getFinalDefaultImages: function () {
            var sBasePath = "../../../../sap/ushell/demotiles/cdm/newstile/";
            var oNamesOfImagesList = ["NewsImage1.png", "NewsImage2.png", "NewsImage3.png", "NewsImage4.png"];
            var oImagesList = [];

            for (var i = 0; i < oNamesOfImagesList.length; i++) {
                var oImage = sBasePath + oNamesOfImagesList[i];
                oImagesList.push(oImage);
            }

            return oImagesList;
        },

        getUseDefaultImageConfig: function (oConfig, oTileProperties) {
            return !!this._getSafeTileConfiguration(oConfig, oTileProperties).useDefaultImage;
        },

        getCycleIntervalConfig: function (oConfig, oTileProperties) {
            return this._getSafeTileConfiguration(oConfig, oTileProperties).cycleInterval || 10;
        },

        getFeedConfiguration: function (oConfig, oTileProperties) {
            var oSafeConfig = this._getSafeTileConfiguration(oConfig, oTileProperties);
            var aFeeds = [];

            for (var i = 1; i <= 10; i++) {
                var oCurrentFeed = oSafeConfig["feed" + i];
                if (typeof oCurrentFeed === "string" && oCurrentFeed !== "") {
                    aFeeds.push(oCurrentFeed);
                }
            }

            for (var x in aFeeds) {
                if (XMLHttpRequest.channelFactory) {
                    XMLHttpRequest.channelFactory.ignore.add(aFeeds[x] + "");
                }
            }

            return aFeeds;
        },

        calculateFeedItemAge: function (dPublicationDate, oResBundle) {
            var sAgo = "";
            if (typeof dPublicationDate === "undefined") { return sAgo; } else if (!this._isValidDate(dPublicationDate)) {
                return sAgo;
            }

            var dNow = new Date();

            // ignore milliseconds
            dPublicationDate.setMilliseconds(0);
            dNow.setMilliseconds(0);

            var nMilliSecondsInOneMinute = 60000;
            var nMilliSecondsInOneHour = nMilliSecondsInOneMinute * 60;
            var nMilliSecondsInOneDay = nMilliSecondsInOneHour * 24;

            if ((dNow.getTime() - dPublicationDate.getTime()) >= nMilliSecondsInOneDay) {
                var nNumberOfDays = parseInt((dNow.getTime() - dPublicationDate.getTime()) / nMilliSecondsInOneDay, 10);
                if (nNumberOfDays === 1) {
                    sAgo = oResBundle.getText("FEEDTILE_DAY_AGO", [nNumberOfDays]);
                } else {
                    sAgo = oResBundle.getText("FEEDTILE_DAYS_AGO", [nNumberOfDays]);
                }
            } else if ((dNow.getTime() - dPublicationDate.getTime()) >= nMilliSecondsInOneHour) {
                var nNumberOfHours = parseInt((dNow.getTime() - dPublicationDate.getTime()) / nMilliSecondsInOneHour, 10);

                if (nNumberOfHours === 1) {
                    sAgo = oResBundle.getText("FEEDTILE_HOUR_AGO", [nNumberOfHours]);
                } else {
                    sAgo = oResBundle.getText("FEEDTILE_HOURS_AGO", [nNumberOfHours]);
                }
            } else {
                var nNumberOfMins = parseInt((dNow.getTime() - dPublicationDate.getTime()) / nMilliSecondsInOneMinute, 10);

                if (nNumberOfMins === 1) {
                    sAgo = oResBundle.getText("FEEDTILE_MINUTE_AGO", [nNumberOfMins]);
                } else {
                    sAgo = oResBundle.getText("FEEDTILE_MINUTES_AGO", [nNumberOfMins]);
                }
            }

            return sAgo;
        },

        getDefaultImage: function (oDefaultImages, _defaultImageIndex) {
            var oDefaultImage;

            if (oDefaultImages && oDefaultImages.length > 0) {
                var iLength = oDefaultImages.length;
                if (_defaultImageIndex === -1) {
                    var iRandom = Math.floor(Math.random() * iLength);
                    oDefaultImage = oDefaultImages[iRandom];
                } else {
                    //this is not the first time, get the next image from list
                    var iIndex = (_defaultImageIndex) > iLength ? 0 + (_defaultImageIndex - iLength) : _defaultImageIndex;
                    _defaultImageIndex = iIndex;
                    oDefaultImage = oDefaultImages[iIndex];
                }
            }

            return oDefaultImage;
        }
    };

    return NewsTileUtils;
});
