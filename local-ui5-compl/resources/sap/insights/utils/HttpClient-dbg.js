/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
    "./AppConstants"
], function (AppConstants) {
    "use strict";

    const HttpClient = {};

    HttpClient._fetchCSRFToken = function(){
        return this._executeRequest(AppConstants.REPO_BASE_URL, AppConstants.HEAD, {});
    };

    HttpClient.delete = function(sUrl){
        return this._executeRequest(sUrl, AppConstants.DELETE, {});
    };

    HttpClient.get = function (sUrl) {
        return this._executeRequest(sUrl, AppConstants.GET, {});
    };

    HttpClient.put = function (sUrl, oBody) {
        return this._executeRequest(sUrl, AppConstants.PUT, {}, oBody);
    };

    HttpClient.post = function (sUrl, oBody) {
        return this._executeRequest(sUrl, AppConstants.POST, {}, oBody);
    };

    HttpClient._executeRequest = async function (sUrl, sMethod, oHeaders, oBody) {
        let sCsrfToken;
        if (sMethod !== AppConstants.GET && sMethod !== AppConstants.HEAD) {
            sCsrfToken = await HttpClient._fetchCSRFToken();
        }
        return new Promise((resolve, reject) => {
            const oXhr = new XMLHttpRequest();
            const headers = {...oHeaders};
            if (sMethod === AppConstants.HEAD) {
                headers["X-CSRF-Token"] = "Fetch";
            }
            if (sMethod !== AppConstants.GET && sMethod !== AppConstants.HEAD) {
                headers["X-CSRF-Token"] = sCsrfToken;
            }
            if (sMethod === AppConstants.POST || sMethod === AppConstants.PUT) {
                headers["content-type"] = "application/json;odata.metadata=minimal;charset=utf-8";
            }
            oXhr.open(sMethod, sUrl, true);
            Object.keys(headers).forEach((header) => {
                oXhr.setRequestHeader(header, headers[header]);
            });

            oXhr.onreadystatechange = this._onReadyStateChange.bind(this, oXhr, sMethod, resolve, reject);
            if (oBody) {
                oXhr.send(oBody);
            } else {
                oXhr.send();
            }
        });
    };

    HttpClient._onReadyStateChange = (oXhr, sMethod, fnResolve, fnReject) => {
        if (oXhr.readyState === 4) {
            if (oXhr.status >= 200 && oXhr.status < 300) {
                if (sMethod === AppConstants.HEAD) {
                    const sCsrfToken = oXhr.getResponseHeader("x-csrf-token");
                    if (sCsrfToken) {
                        fnResolve(sCsrfToken);
                    } else {
                        fnReject("No CSRF token found in response header");
                    }
                } else if (sMethod === AppConstants.DELETE) {
                    fnResolve();
                }
                fnResolve(JSON.parse(oXhr.responseText));
            } else {
                fnReject({error: oXhr?.error || true, message: "unexpected error"});
            }
        }
    };

    return HttpClient;

}, true);
