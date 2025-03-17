/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(
    [
        "sap/ui/base/Object"
    ],
    function (
        BaseObject
    ) {
        "use strict";
        var oCacheResponse = {};
        var oTempPromise =  {};
        var InstanceProvider = BaseObject.extend("sap.insights.base.CacheData", {});

        function setValues(oObj, sCardId, sPath, oValue) {
            if (!sCardId) {
                return new Error("Please provide valid card ID.");
            }

            if (oObj[sCardId] && sPath) {
                oObj[sCardId][sPath] = oValue;
            } else {
                oObj[sCardId] = oValue;
            }
            return oObj[sCardId];
        }

        InstanceProvider.prototype.getCacheResponse = function(sCardId) {
            if (sCardId) {
                return oCacheResponse[sCardId];
            }
            return oCacheResponse;
        };

        InstanceProvider.prototype.setCacheResponse = function(sCardId, sPath, oResponse) {
            return setValues(oCacheResponse, sCardId, sPath, oResponse);
        };

        InstanceProvider.prototype.getTempPromise = function(sCardId) {
            if (sCardId) {
                return oTempPromise[sCardId];
            }
            return oTempPromise;
        };

        InstanceProvider.prototype.setTempPromise = function(sCardId, sPath, oPromise) {
            return setValues(oTempPromise, sCardId, sPath, oPromise);
        };

        InstanceProvider.prototype.clearCache = function(sCardId) {
            if (sCardId) {
                oCacheResponse[sCardId] = oTempPromise[sCardId] = {};
            } else {
                oCacheResponse = oTempPromise = {};
            }
        };

        //singleton class implementation
        var cacheData;
        return {
            getInstance : function(){
                if (!cacheData) {
                    cacheData = new InstanceProvider();
                }
                return cacheData;
            }
        };
    }
);
