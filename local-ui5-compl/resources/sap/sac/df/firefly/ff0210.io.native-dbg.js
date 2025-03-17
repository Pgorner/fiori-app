/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff0200.io"
],
function(oFF)
{
"use strict";
oFF.NativeDispatcher = function()
{
	oFF.DfDispatcher.call( this );
	this._ff_c = "NativeDispatcher";
};
oFF.NativeDispatcher.prototype = new oFF.DfDispatcher();

oFF.NativeDispatcher.staticSetup = function()
{
	oFF.Dispatcher.replaceInstance( new oFF.NativeDispatcher() );
};

oFF.NativeDispatcher.prototype.registerInterval = function( milliseconds, listener, customIdentifier )
{
	var timerItem = new oFF.JsTimerHandle( milliseconds, listener, customIdentifier, true );
	timerItem.jsHandle = setInterval( function()
	{
		timerItem.execute();
	}, milliseconds );
	
	return timerItem;
};

oFF.NativeDispatcher.prototype.unregisterInterval = function( handle )
{
	clearInterval( handle.jsHandle );
};

oFF.NativeDispatcher.prototype.registerTimer = function( milliseconds, listener, customIdentifier )
{
	var timerItem = new oFF.JsTimerHandle( milliseconds, listener, customIdentifier, false );
	timerItem.jsHandle = setTimeout( function()
	{
		timerItem.execute();
	}, milliseconds );
	
	return timerItem;
};

oFF.NativeDispatcher.prototype.unregisterTimer = function( handle )
{
	clearTimeout( handle.jsHandle );
};

oFF.NativeDispatcher.prototype.getProcessingTimeReceiverCount = function()
{
	return -1;
};

oFF.NativeDispatcher.prototype.registerProcessingTimeReceiver = function( processingTimeReceiver )
{
	return;
};

oFF.NativeDispatcher.prototype.unregisterProcessingTimeReceiver = function( processingTimeReceiver )
{
	return;
};

oFF.NativeDispatcher.prototype.shutdown = function()
{
	return;
};

oFF.NativeDispatcher.prototype.process = function()
{
	return;
};

oFF.NativeDispatcher.prototype.getSyncState = function()
{
	return oFF.SyncState.IN_SYNC;
};

oFF.JsTimerHandle = function( milliseconds, listener, customIdentifier, isInterval )
{
	oFF.TimerItem.call( this );
	oFF.TimerItem.prototype.setupExt.call( this, milliseconds, listener, customIdentifier, isInterval );
	this._ff_c = "JsTimerHandle";
};

oFF.JsTimerHandle.prototype = new oFF.TimerItem();

oFF.NativeHttpClient = function(session) {
   oFF.DfHttpClient.call(this);
  this.m_xmlHttpRequest = null;
  this.m_isOnAjaxEventExecuted = false;
  oFF.DfHttpClient.prototype.setupHttpClient.call(this, session);
  this._ff_c = "NativeHttpClient";
};
oFF.NativeHttpClient.prototype = new oFF.DfHttpClient();

oFF.NativeHttpClient.parseResponseHeaders = function(headerStr, headerFields) {
   if (headerStr !== null) {
    if (oFF.XSystemUtils.isGoogleAppsScript()) {
      for (var h in headerStr) {
        if (h !== oFF.HttpConstants.HD_SET_COOKIE) {
          headerFields.put(h, headerStr[h]);
        }
      }
    } else {
      var headerPairs = headerStr.split("\u000d\u000a");
      var headerLength = headerPairs.length;
      var oHttpConstants = oFF.HttpConstants;
      for (var i = 0; i < headerLength; i++) {
        var headerPair = headerPairs[i];
        // Can't use split() here because it does the wrong thing
        // if the header value has the string ": " in it.
        var index = headerPair.indexOf("\u003a\u0020");
        if (index > 0) {
          // need to clean the key from "\r\n" and "\n" due to a bug in IE 10
          // eslint-disable-next-line no-control-regex
          var key = headerPair.substring(0, index).replace(/(^\u000d\u000a?)|(^\u000a?)/, "");
          var value = headerPair.substring(index + 2);

          headerFields.put(oHttpConstants.lookupCamelCase(key), value);
        }
      }
    }
  }
};

oFF.NativeHttpClient.prototype.abort = function() {
   this.m_xmlHttpRequest.abort();
};

oFF.NativeHttpClient.prototype.releaseObject = function() {
   this.m_xmlHttpRequest = null;
  this.m_response = oFF.XObjectExt.release(this.m_response);
  this.m_isOnAjaxEventExecuted = null;

  oFF.DfHttpClient.prototype.releaseObject.call(this);
};

oFF.NativeHttpClient.prototype.onAjaxEvent = function() {
   var xmlHttpRequest = this.m_xmlHttpRequest;
  if (xmlHttpRequest !== null && xmlHttpRequest.readyState === 4) {
    this.addProfileStep("Receive http response");
    this.m_response = oFF.HttpResponse.createResponse(this.getRequest());
    this.m_isOnAjaxEventExecuted = true;

    if (oFF.isNode() || oFF.XSystemUtils.isGoogleAppsScript()) {
      // Node.js cookies
      var cookies = oFF.HttpCookies.create();
      var cookiesResponseHeaders = xmlHttpRequest.getResponseHeader(oFF.HttpConstants.HD_SET_COOKIE);
      for (var h in cookiesResponseHeaders) {
        if (cookiesResponseHeaders.hasOwnProperty(h)) {
          cookies.addByHttpServerResponseValue(cookiesResponseHeaders[h]);
        }
      }
      this.m_response.setCookies(cookies);
      this.m_response.setCookiesMasterStore(this.getRequest().getCookiesMasterStore());
      this.m_response.applyCookiesToMasterStorage();
    }

    this.m_response.setStatusCode(xmlHttpRequest.status);
    this.m_response.setStatusCodeDetails(xmlHttpRequest.statusText);

    var allResponseHeaders = xmlHttpRequest.getAllResponseHeaders();
    var headerFields = this.m_response.getHeaderFieldsBase();
    oFF.NativeHttpClient.parseResponseHeaders(allResponseHeaders, headerFields);

    var contentTypeValue = headerFields.getByKey(oFF.HttpConstants.HD_CONTENT_TYPE);
    if (contentTypeValue !== null) {
      contentTypeValue = contentTypeValue.toLowerCase();
      var delimiter = contentTypeValue.indexOf(";");
      if (delimiter !== -1) {
        contentTypeValue = contentTypeValue.substring(0, delimiter);
      }
    }

    var contentType = oFF.ContentType.lookup(contentTypeValue);
    if (contentType === null) {
      this.m_response.setContentTypeValue(contentTypeValue);
    } else {
      this.m_response.setContentType(contentType);

      // process the response data
      let ffByteArray;
      let stringContent;

      if (xmlHttpRequest.responseType === "arraybuffer") {
        let responseArrayBuffer = xmlHttpRequest.response;
        ffByteArray = oFF.XByteArray.create(responseArrayBuffer, responseArrayBuffer.length);
      } else {
        stringContent = xmlHttpRequest.responseText;
      }

      if (contentType.isText()) {
        if (!stringContent && ffByteArray) {
          stringContent = oFF.XByteArray.convertToString(ffByteArray);
        }

        this.m_response.setString(stringContent);

        if (contentType === oFF.ContentType.APPLICATION_JSON) {
          if (stringContent !== null && stringContent.length > 0) {
            try {
              this.addProfileStep("Parse json");
              var jsonRootElement = JSON.parse(stringContent);
              var ocpRootElement = new oFF.NativeJsonProxyElement(jsonRootElement);
              this.m_response.setJsonObject(ocpRootElement);
            } catch (e) {
              this.addError(oFF.JsonParserErrorCode.JSON_PARSER_ILLEGAL_STATE, e.message);
            }
          }
        }
      } else if (ffByteArray) {
        this.m_response.setByteArray(ffByteArray);
      }
    }


    if (xmlHttpRequest.status === 0) {
      this.addError(oFF.ErrorCodes.HOST_UNREACHABLE, "Destination host is unreachable!");
    }

    this.setData(this.m_response);
    this.endSync();

    this.m_xmlHttpRequest = null;
  }
};

oFF.NativeHttpClient.prototype.processSynchronization = function(syncType) {
   var oHttpConstants = oFF.HttpConstants;
  var oHttpRequestMethod = oFF.HttpRequestMethod;

  var request = this.prepareRequest();
  var url = request.getUrlWithoutAuthentication();

  // see http://www.w3.org/TR/2006/WD-XMLHttpRequest-20060405
  this.m_xmlHttpRequest = null;

  if (oFF.isXs()) {
    this.m_xmlHttpRequest = new $Global.XMLHttpRequest();
  } else if (oFF.isNode()) {
    // Node.js
    this.m_xmlHttpRequest = new oFF.NodeJsXMLHttpRequest();
    var cookies;

    if (typeof window !== "undefined" && window && window.options && window.options.isMobile && oFF.userSession) {
      // set cookies for mobile running in node
      cookies = oFF.HttpCookies.create();
      cookies.addByHttpClientRequestValue(oFF.userSession.cookies);
    } else {
      cookies = this.getRequest().getCookies();
    }

    this.m_xmlHttpRequest.setCookies(cookies);
  } else if (oFF.XSystemUtils.isGoogleAppsScript()) {
    this.m_xmlHttpRequest = new oFF.NativeGoogleHttpRequest();
    this.m_xmlHttpRequest.setCookies(this.getRequest().getCookies());
  } else if (oFF.XSystemUtils.isBrowser() && request.isLogoff() && typeof navigator.sendBeacon !== "undefined") {
    navigator.sendBeacon(url);
    return true;
  } else {
    this.m_xmlHttpRequest = new XMLHttpRequest();
  }

  if (this.m_xmlHttpRequest !== null) {
    var xmlHttpRequest = this.m_xmlHttpRequest;
    var isAsync = syncType === oFF.SyncType.NON_BLOCKING;
    var oRequestMethod = request.getMethod();
    var oRequestContentType = request.getContentType();

    if (oRequestContentType != null && oRequestContentType.isBinary()) {
      xmlHttpRequest.responseType = "arraybuffer";
    }

    xmlHttpRequest.open(oRequestMethod.getName(), url, isAsync);

    if (oRequestMethod === oHttpRequestMethod.HTTP_POST || oRequestMethod === oHttpRequestMethod.HTTP_PUT) {
      var requestContentType = oRequestContentType.getName() + ";charset=UTF-8";
      xmlHttpRequest.setRequestHeader(oHttpConstants.HD_CONTENT_TYPE, requestContentType);
    }

    xmlHttpRequest.setRequestHeader(oHttpConstants.HD_ACCEPT, request.getAcceptContentType().getName());

    // we are not allowed to set HD_ACCEPT_CHARSET due to security reasons
    var authType = request.getAuthenticationType();

    // Do not set authorization header if both user and password are null as that will set it to null:null
    if (authType === oFF.AuthenticationType.BASIC && (request.getUser() !== null || request.getPassword() !== null)) {
      var valueUnencoded = request.getUser() + ":" + request.getPassword();
      var valueEncoded = oHttpConstants.VA_AUTHORIZATION_BASIC + " " + oFF.XBase64.getInstance().encodeFromString(valueUnencoded);
      xmlHttpRequest.setRequestHeader(oHttpConstants.HD_AUTHORIZATION, valueEncoded);

      if (request.isXAuthorizationRequired()) {
        xmlHttpRequest.setRequestHeader(oHttpConstants.HD_X_AUTHORIZATION, valueEncoded);
      }
    } else if (authType === oFF.AuthenticationType.BEARER) {
      var bearer = request.getAccessToken();

      if (bearer === null) {
        bearer = request.getAuthenticationToken().getAccessToken();
      }

      if (bearer !== null) {
        xmlHttpRequest.setRequestHeader(oHttpConstants.HD_AUTHORIZATION, oHttpConstants.VA_AUTHORIZATION_BEARER + " " + bearer);
      }
    } else if (authType === oFF.AuthenticationType.SCP_OPEN_CONNECTORS) {
      // user, organization and element can either be defined on connection or query level
      var user = request.getUser();
      var organization = request.getOrganization();
      var element = request.getElement();

      var authentication = oFF.XStringBuffer.create();
      authentication.append(oHttpConstants.HD_USER).append(" ").append(user);
      authentication.append(", ");
      authentication.append(oHttpConstants.HD_ORGANIZATION).append(" ").append(organization);
      authentication.append(", ");
      authentication.append(oHttpConstants.HD_ELEMENT).append(" ").append(element);
      xmlHttpRequest.setRequestHeader(oHttpConstants.HD_AUTHORIZATION, authentication.toString());
    }

    var lang = request.getLanguage();

    if (lang && lang.length > 0) {
      lang = oFF.HttpCoreUtils.normalizeLanguage(lang);
      xmlHttpRequest.setRequestHeader(oHttpConstants.HD_ACCEPT_LANGUAGE, lang);
    }


    var headerFields = request.getHeaderFields();
    var headerKeys = headerFields.getKeysAsIterator();

    while (headerKeys.hasNext()) {
      var currentKey = headerKeys.next();
      xmlHttpRequest.setRequestHeader(currentKey, headerFields.getByKey(currentKey));
    }

    xmlHttpRequest.onreadystatechange = this.onAjaxEvent.bind(this);
    if (isAsync) {
        xmlHttpRequest.timeout = request.m_timeout;
    }
    if (this._sendInternal(request) === false) {
      return false;
    }

    if (!isAsync) {
      // is in blocking mode
      // check now if onreadystatechange was executed
      if (!this.m_isOnAjaxEventExecuted) {
        // probably a browser-bug, onreadystatechange was not executed
        this.onAjaxEvent();
        this.m_xmlHttpRequest = null;
      }
    }

    return true;
  }
  this.addError(oFF.HttpErrorCode.HTTP_MISSING_NATIVE_DRIVER, "XMLHttpRequest not supported");
  return false;
};

oFF.NativeHttpClient.prototype._sendInternal = function(request) {
   var oHttpRequestMethod = oFF.HttpRequestMethod;
  try {
    this.m_isOnAjaxEventExecuted = false;
    this.addProfileStep("### SERVER ###");

    if (request.isCorsSecured()) {
      // enable cors: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
      this.m_xmlHttpRequest.withCredentials = true;
    }

    if (request.getMethod() === oHttpRequestMethod.HTTP_POST || request.getMethod() === oHttpRequestMethod.HTTP_PUT) {
      this.m_xmlHttpRequest.send(request.getString());
    } else {
      this.m_xmlHttpRequest.send(null);
    }
    return true;
  } catch (e) {
    this.addError(oFF.HttpErrorCode.HTTP_IO_EXCEPTION, e.message);
    return false;
  }
};

oFF.NativeHttpClientFactory = function() {
       oFF.HttpClientFactory.call(this);
    this._ff_c = "NativeHttpClientFactory";
};
oFF.NativeHttpClientFactory.prototype = new oFF.HttpClientFactory();

oFF.NativeHttpClientFactory.staticSetup = function()
{
       var factory = new oFF.NativeHttpClientFactory();
    oFF.HttpClientFactory.setHttpClientFactoryForProtocol( oFF.ProtocolType.HTTPS, factory );
    oFF.HttpClientFactory.setHttpClientFactoryForProtocol( oFF.ProtocolType.HTTP, factory );
	oFF.HttpClientFactory.setHttpClientFactoryForProtocol( oFF.ProtocolType.WEBWORKER, factory );
};

oFF.NativeHttpClientFactory.prototype.newHttpClientInstance = function(session, connection)
{
   	if (connection.getProtocolType().getName() === "webworker")
    {
		return new oFF.NativeHttpWebWorkerClient(session);
	}
    return new oFF.NativeHttpClient( session );
};

oFF.NativeNetworkEnv = function() {
   oFF.NetworkEnv.call(this);
  this._ff_c = "NativeNetworkEnv";
};

oFF.NativeNetworkEnv.prototype = new oFF.NetworkEnv();

oFF.NativeNetworkEnv.staticSetup = function() {
   oFF.NetworkEnv.setNative(new oFF.NativeNetworkEnv());
};

/// <summary>Get the location of this environment or <code>null</code> if no one is available.</summary>
/// <returns>the uri or <code>null</code> if no location is available.</returns>
oFF.NativeNetworkEnv.prototype.getNativeLocation = function() {
   // var oNetworkEnv = oFF.NetworkEnv;
  var oUri = oFF.XUri.create();

  if (oFF.XSystemUtils.isBrowser()) {
    var location = window.location;
    var protocol = location.protocol;
    var index = protocol.indexOf(":");

    if (index !== -1) {
      protocol = protocol.substring(0, index);
    }

    oUri.setScheme(protocol);
    oUri.setHost(location.hostname);

    var port = 0;

    if (location.port !== null && location.port !== "") {
      port = parseInt(location.port);

      if (isNaN(port)) {
        port = 0;
      }
    }

    oUri.setPort(port);
    oUri.setPath(location.pathname);

    var hash = location.hash;

    if (hash !== null && hash !== "") {
      if (hash.indexOf("#") === 0) {
        hash = hash.substring(1);
      }

      hash = decodeURIComponent(hash);
      oUri.setFragment(hash);
    }

    var search = location.search;

    if (search !== null && search !== "") {
      search = decodeURIComponent(search);
      oUri.setQuery(search);
    }
  }

  return oUri;
};

oFF.NativeNetworkEnv.prototype.getNativeFragment = function() {
   return this.getNativeLocation().getFragment();
};

oFF.NativeNetworkEnv.prototype.setNativeFragment = function(fragment) {
   if (oFF.XSystemUtils.isBrowser()) {
    if (fragment === null) {
      var uri = window.location.toString();

      if (uri.indexOf("#") > 0) {
        uri = uri.substring(0, uri.indexOf("#"));
      }

      window.history.pushState({}, document.title, uri);
    } else {
      window.location.hash = fragment;
    }
  }
};

oFF.NativeNetworkEnv.prototype.setNativeDomain = function(domain) {
   if (oFF.XSystemUtils.isBrowser()) {
    document.domain = domain;
  }
};

oFF.NativeSamlUtils = function () {
       oFF.SamlUtils.call(this);
    this._ff_c = "NativeSamlUtils";
}

oFF.NativeSamlUtils.prototype = new oFF.SamlUtils();
oFF.NativeSamlUtils.WINDOW_WIDTH = 800;
oFF.NativeSamlUtils.WINDOW_HEIGHT = 520;
oFF.NativeSamlUtils.DEFAULT_AUTH_TIMEOUT = 31000;

oFF.NativeSamlUtils.staticSetup = function () {
       oFF.SamlUtils.setNative(new oFF.NativeSamlUtils());
};

oFF.NativeSamlUtils.prototype.openNativeWindow = function (authUrl, listener, useMessageListener, isWindowCloseSupported) {
       const authWindow = window.open(authUrl, "_blank", `width=${oFF.NativeSamlUtils.WINDOW_WIDTH},height=${oFF.NativeSamlUtils.WINDOW_HEIGHT}`);

    if (!authWindow) {
        return false;
    }

    const authInterval = setInterval(() => {
        if (authWindow && authWindow.closed && isWindowCloseSupported) {
            clearInterval(authInterval);
            listener.onWindowClose();
        }
    }, 100);

    const handleMessageFetched = (event) => {
        if (event && event.origin !== null) {
            clearInterval(authInterval);
            if (authWindow.opener) {
                authWindow.opener.removeEventListener("message", handleMessageFetched);
            }
            authWindow.close();
            listener.onWindowClose();
        }
    };

    if (useMessageListener && authWindow.opener) {
        authWindow.opener.addEventListener("message", handleMessageFetched, false);
    }

    setTimeout(() => {
        if (authWindow && (!authWindow.closed || !isWindowCloseSupported)) {
            clearInterval(authInterval);
            authWindow.close();
            listener.onAuthenticationTimeout();
        }
    }, oFF.NativeSamlUtils.DEFAULT_AUTH_TIMEOUT);

    return true;
}

oFF.NativeSamlUtils.prototype.createInvisibleIframe = function (authUrl, getServerInfoUrl, listener) {
   
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = authUrl;
    iframe.sandbox.add('allow-forms');
    iframe.sandbox.add('allow-scripts');
    iframe.sandbox.add('allow-same-origin');
    document.body.appendChild(iframe);

    const intervalLoop = setInterval(function () {
        fetch(getServerInfoUrl, {credentials: "include"})
            .then((resp) => {
                if (resp.ok && resp.headers.get("Content-Type").includes("json")) {
                    document.body.removeChild(iframe);
                    clearInterval(intervalLoop);
                    listener.onWindowClose();
                }
            })
            .catch(() => {
                // Before user login, we will keep hitting this block for permissions error.
            });
    }, 5000);

    setTimeout(() => {
        if (iframe && document.body.contains(iframe)) {
            document.body.removeChild(iframe);
            clearInterval(intervalLoop);
            listener.onAuthenticationTimeout();
        }
    }, oFF.NativeSamlUtils.DEFAULT_AUTH_TIMEOUT);
}

oFF.NativeSamlUtils.prototype.getPlatform = function (){
       return window.navigator.platform;
}

oFF.NativeOAuthUtils = function () {
       oFF.OAuthUtils.call(this);
    this._ff_c = "NativeOAuthUtils";
};

oFF.NativeOAuthUtils.prototype = new oFF.OAuthUtils();

oFF.NativeOAuthUtils.staticSetup = function () {
       oFF.OAuthUtils.setNative(new oFF.NativeOAuthUtils());
};

oFF.NativeOAuthUtils.prototype.generateCodeVerifier = function () {
       const sMask =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~";
    const aRandom = window.crypto.getRandomValues(new Uint8Array(43));
    const iLen = sMask.length;
    return Array.from(aRandom, (iNum) => sMask[iNum % iLen]).join("");
};

oFF.NativeOAuthUtils.prototype.generateCodeChallenge = function (
    sVerifier
) {
       return oFF.XPromise.create((resolve, reject) => {
        try {
            window.crypto.subtle
                .digest("SHA-256", new TextEncoder().encode(sVerifier))
                .then((sHash) => {
                    const sChallenge = btoa(
                        Array.from(new Uint8Array(sHash), (byte) =>
                            String.fromCharCode(byte)
                        ).join("")
                    )
                        .replace(/\//g, "_")
                        .replace(/\+/g, "-")
                        .replace(/=/g, "");
                    resolve(sChallenge);
                }, reject);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Native javascript implementation of the IframeHandler interface.
 * This is used by UI5 and other JS consumers, it is not used directly in SAC.
 * Keep this in sync with the TS implementation: NativeIframeHandler.ts
 */
oFF.NativeIframeHandler = function () {
       oFF.IframeHandler.call(this);
    this._ff_c = "NativeIframeHandler";
};

oFF.NativeIframeHandler.prototype = new oFF.IframeHandler();
oFF.NativeIframeHandler.DEFAULT_AUTH_TIMEOUT = 31000;
oFF.NativeIframeHandler.FILE_CHECK_TIMEOUT = 2000;
oFF.NativeIframeHandler.GET_SERVER_INFO_INTERVAL = 2000;
oFF.NativeIframeHandler.SUPPORT_DOCUMENTATION_URL_CONFIGURE_HELP =
    'https://help.sap.com/docs/SAP_ANALYTICS_CLOUD/00f68c2e08b941f081002fd3691d86a7/955edc49e709457ea4a1fec042da3339.html';
oFF.NativeIframeHandler.SUPPORT_DOCUMENTATION_URL_NO_FILES =
    'https://help.sap.com/docs/SAP_ANALYTICS_CLOUD/00f68c2e08b941f081002fd3691d86a7/2480f6941d9c4227b64f6b7730ef087d.html';
oFF.NativeIframeHandler.supportedThemes = [
    "sap_belize",
    "sap_belize_hcb",
    "sap_belize_hcw",
    "sap_horizon",
    "sap_horizon_dark",
    "sap_horizon_hcb",
    "sap_horizon_hcw",
];
oFF.NativeIframeHandler.messageBoxState = {
    WARNING: "warning",
    ERROR: "error"
};

oFF.NativeIframeHandler.staticSetup = function () {
       oFF.IframeHandler.setNative(new oFF.NativeIframeHandler());
};

oFF.NativeIframeHandler.prototype.openStorageAccessDialog = function (url, interactUrl, listener, appearingDelay, theme, areFilesAccessible, localizedStrings, messageBoxStyle) {
       const warningTitle = localizedStrings.getByKey("TITLE_WARNING");
    const errorTitle = localizedStrings.getByKey("TITLE_ERROR");
    const warningMessage = localizedStrings.getByKey("WARNING_MESSAGE");

    // Validate there's no existing dialog
    if (document.querySelector('.ff-3pc-message-box')) {
        return;
    }

    const appendErrorMessage = (paragraphElement) => {
        const errorBlockedOrNeverOpenedMessage = localizedStrings.getByKey("ERROR_MESSAGE_BLOCK_ACCESS");
        const errorInaccessibleMessage = localizedStrings.getByKey("ERROR_MESSAGE_RESOURCE_NOT_FOUND");
        const errorSupportDocMessage = localizedStrings.getByKey("ERROR_MESSAGE_SUPPORT_DOCUMENT");

        const interactButton = document.createElement('button');
        interactButton.className = 'ff-3pc-message-box-anchor-style';
        interactButton.addEventListener("click", function () {
            const interactWindow = window.open(interactUrl, "_blank");
            // Check if the interact window is closed, if so switch to warning state and enable the iframe button
            const interactWindowCheckInInterval = setInterval(() => {
                if (interactWindow && interactWindow.closed) {
                    clearInterval(interactWindowCheckInInterval);
                    const iframeElement = document.querySelector(".ff-3pc-iframe");
                    if (iframeElement && iframeElement.contentWindow) {
                        const iframeWindow = iframeElement.contentWindow;
                        iframeWindow.postMessage({ enableButton: true }, url);
                    }
                    updateDialogState(oFF.NativeIframeHandler.messageBoxState.WARNING);
                }
            }, 100);
        });

        const supportLink = document.createElement('a');
        supportLink.href = areFilesAccessible ?
            oFF.NativeIframeHandler.SUPPORT_DOCUMENTATION_URL_CONFIGURE_HELP :
            oFF.NativeIframeHandler.SUPPORT_DOCUMENTATION_URL_NO_FILES;
        supportLink.target = '_blank';

        interactButton.textContent = localizedStrings.getByKey("CONTINUE_ACCESS");
        supportLink.textContent = localizedStrings.getByKey("LEARN_MORE");

        const EMPTY_SPACE = " "; // for formatting
        const errorReasonMessage = document.createTextNode((areFilesAccessible ? errorBlockedOrNeverOpenedMessage : errorInaccessibleMessage) + EMPTY_SPACE);
        const errorSupportMessage = document.createTextNode(errorSupportDocMessage);
        const emptyParagraph = document.createElement("p");
        const lineBreak = document.createElement("br");

        paragraphElement.innerHTML = ""; // clears the existing content
        paragraphElement.appendChild(errorReasonMessage);
        if (areFilesAccessible) {
            paragraphElement.appendChild(interactButton);
            paragraphElement.appendChild(emptyParagraph);
            paragraphElement.appendChild(errorSupportMessage);
            paragraphElement.appendChild(lineBreak);
        }
        paragraphElement.appendChild(supportLink);
    };

    const currentTheme = oFF.NativeIframeHandler.supportedThemes.includes(theme) ? theme : 'sap_belize';
    const currentState = areFilesAccessible ? oFF.NativeIframeHandler.messageBoxState.WARNING : oFF.NativeIframeHandler.messageBoxState.ERROR;

    let previousZIndex;
    const defaultUi5BackgroundDimClass = 'sap-ui-blocklayer-popup';
    const customBackgroundDimClass = 'ff-3pc-background-overlay';

    function isOverlayLayerDisplayed() {
        if (document.getElementById(defaultUi5BackgroundDimClass)) {
            const blocklayerStyle = window.getComputedStyle(document.getElementById(defaultUi5BackgroundDimClass));
            return (blocklayerStyle.getPropertyValue("visibility") !== "hidden"
                && blocklayerStyle.getPropertyValue("display") !== "none");
        } else {
            return false;
        }
    }

    function calculateHighestZIndex() {
        let topIndex = 0;
        document.querySelectorAll('*').forEach(function (node) {
            const zIndex = window.getComputedStyle(node, null).getPropertyValue("z-index");
            if (zIndex !== null && zIndex !== "auto" && Number(zIndex) > topIndex) {
                topIndex = Number(zIndex);
            }
        });
        return topIndex;
    }

    function setOverlayDiv(zIndex) {
        let overlayLayer;
        if (isOverlayLayerDisplayed()) {
            overlayLayer = document.getElementById(defaultUi5BackgroundDimClass);
            // save previous z index to restore to it when popup is gone
            previousZIndex = parseInt(window.getComputedStyle(overlayLayer).getPropertyValue('z-index'));
        } else {
            overlayLayer = document.createElement('div');
            overlayLayer.className = `${customBackgroundDimClass} ${currentTheme}`;
            document.body.appendChild(overlayLayer);
        }
        overlayLayer.style.setProperty('z-index', (zIndex + 1).toString());
    }

    function removeOverlay() {
        let manualOverlay;
        if (isOverlayLayerDisplayed() && previousZIndex !== undefined) {
            const overlayLayer = document.getElementById(defaultUi5BackgroundDimClass);
            // only apply if previous zIndex value is below current
            if (previousZIndex < parseInt(overlayLayer.style.getPropertyValue('z-index'))) {
                overlayLayer.style.setProperty('z-index', previousZIndex.toString());
            }
        } else if ((manualOverlay = document.querySelector(".ff-3pc-background-overlay")) !== null) {
            document.body.removeChild(manualOverlay);
        }
    }

    // Create and append the message box style
    const style = document.createElement('style');
    style.textContent = messageBoxStyle;
    document.head.appendChild(style);

    // Create and append the message box dialog
    const msgBox = document.createElement('dialog');
    msgBox.className = `ff-3pc-message-box ${currentTheme}`;
    document.body.appendChild(msgBox);

    // Create and append the message box header
    const header = document.createElement('header');
    header.className = 'ff-3pc-message-box__header';
    const headerBarCenter = document.createElement('div');
    headerBarCenter.className = 'ff-3pc-bar__header';
    const headerIcon = document.createElement('span');
    headerIcon.className = 'ff-3pc-header-icon';
    const headerTitle = document.createElement('h1');
    headerTitle.className = 'ff-3pc-title';
    headerTitle.textContent = warningTitle;

    headerBarCenter.appendChild(headerIcon);
    headerBarCenter.appendChild(headerTitle);
    header.appendChild(headerBarCenter);
    msgBox.appendChild(header);

    // Create and append the message box body
    const body = document.createElement('div');
    body.className = 'ff-3pc-message-box__body';
    const bodyContent = document.createElement('p');
    bodyContent.className = 'ff-3pc-text';
    bodyContent.innerHTML = warningMessage;

    body.appendChild(bodyContent);
    msgBox.appendChild(body);

    // Create the message box footer
    const footer = document.createElement('footer');
    footer.className = 'ff-3pc-message-box__footer';
    const footerBarRight = document.createElement('div');
    footerBarRight.className = 'ff-3pc-bar__footer';

    const iframeFragment = document.createElement('iframe');
    iframeFragment.className = 'ff-3pc-iframe';
    iframeFragment.src = `${url}`;
    iframeFragment.sandbox.add("allow-forms");
    iframeFragment.sandbox.add("allow-scripts");
    iframeFragment.sandbox.add("allow-same-origin");
    iframeFragment.sandbox.add("allow-storage-access-by-user-activation");
    iframeFragment.sandbox.add("allow-popups");
    iframeFragment.style.display = 'none';
    // create a busy loader while the iframe is loading
    const loader = document.createElement('div');
    loader.className = 'ff-3pc-message-box-loader';
    const circle1 = document.createElement('div');
    circle1.className = 'ff-3pc-message-box-loader-circle';
    const circle2 = document.createElement('div');
    circle2.className = 'ff-3pc-message-box-loader-circle';
    const circle3 = document.createElement('div');
    circle3.className = 'ff-3pc-message-box-loader-circle';
    loader.appendChild(circle1);
    loader.appendChild(circle2);
    loader.appendChild(circle3);

    const closeFragment = document.createElement('button');
    closeFragment.className = 'ff-3pc-message-box-button';
    closeFragment.onclick = function () {
        cleanupIframe();
        listener.onIframeClose();
    };
    const buttonFragmentContent = document.createElement('span');
    buttonFragmentContent.className = 'ff-3pc-message-box-button-content';
    buttonFragmentContent.textContent = localizedStrings.getByKey("CLOSE_BUTTON");
    closeFragment.appendChild(buttonFragmentContent);

    const updateFooter = (state) => {
        if (areFilesAccessible && state === oFF.NativeIframeHandler.messageBoxState.WARNING) {
            if (!footerBarRight.contains(iframeFragment)) {
                footerBarRight.appendChild(iframeFragment);
                // add loader for first time, which renders button visible aster load
                footerBarRight.appendChild(loader);
            } else {
                iframeFragment.style.display = 'block';
                closeFragment.style.display = 'none';
            }
        }
        else {
            if (!footerBarRight.contains(closeFragment)) {
                footerBarRight.appendChild(closeFragment);
            }
            iframeFragment.style.display = 'none';
            closeFragment.style.display = 'block';
        }
    }

    //update the dialog title message content and footer based on the state
    const updateDialogState = (state) => {
        if (state === oFF.NativeIframeHandler.messageBoxState.WARNING) {
            msgBox.classList.remove(oFF.NativeIframeHandler.messageBoxState.ERROR);
            msgBox.classList.add(oFF.NativeIframeHandler.messageBoxState.WARNING);
            headerTitle.textContent = warningTitle;
            bodyContent.textContent = warningMessage;
        } else {
            msgBox.classList.remove(oFF.NativeIframeHandler.messageBoxState.WARNING);
            msgBox.classList.add(oFF.NativeIframeHandler.messageBoxState.ERROR);
            headerTitle.textContent = errorTitle;
            appendErrorMessage(bodyContent);
        }
        updateFooter(state);
    };
    updateDialogState(currentState);
    footer.appendChild(footerBarRight);
    msgBox.appendChild(footer);

    // Make background dim
    setOverlayDiv(calculateHighestZIndex());

    // Show dialog with a specified delay
    const dialogDisplayTimeout = setTimeout(function () {
        if (document.body.contains(msgBox)) {
            msgBox.showModal();
        }
    }, appearingDelay);

    function cleanupIframe() {
        removeOverlay();
        if (document.body.contains(msgBox)) {
            document.body.removeChild(msgBox);
        }
        if (document.head.contains(style)) {
            document.head.removeChild(style);
        }
        window.removeEventListener("message", handleMessageFetched);
    }

    const handleMessageFetched = (event) => {
        if (event && event.data) {
            if (typeof (event.data.hasCookieAccess) !== "undefined" && event.data.hasCookieAccess) {
                clearTimeout(dialogDisplayTimeout);
                cleanupIframe();
                listener.onIframeClose();
            } else if (typeof (event.data.hasCookieAccess) !== "undefined" && !event.data.hasCookieAccess) {
                updateDialogState(oFF.NativeIframeHandler.messageBoxState.ERROR);
            } else if (typeof (event.data.iframeIsLoaded) !== "undefined" && event.data.iframeIsLoaded) {
                footerBarRight.removeChild(loader);
                iframeFragment.style.display = 'block';
            }
        }
    };

    window.addEventListener("message", handleMessageFetched, false);

    document.body.addEventListener('keydown', function(e) {
        if (e.key == "Escape") {
            cleanupIframe();
            listener.onIframeClose();
        }
    });

    // Set timeout for authentication
    setTimeout(() => {
        if (iframeFragment.style.display === 'visible' && document.body.contains(msgBox) && areFilesAccessible) {
            clearTimeout(dialogDisplayTimeout);
            cleanupIframe();
            listener.onAuthenticationTimeout();
        }
    }, oFF.NativeIframeHandler.DEFAULT_AUTH_TIMEOUT);
};

oFF.NativeIframeHandler.prototype.openIframe = function (url, getServerInfoUrl, listener) {
   
    // Create dialog
    const dialog = document.createElement("dialog");
    dialog.style.width = "500px";
    dialog.style.height = "650px";
    dialog.style.border = "none";
    dialog.style.margin = "0";
    dialog.style.overflow = "hidden";
    dialog.style.position = "fixed";
    dialog.style.top = "50%";
    dialog.style.left = "50%";
    dialog.style.transform = "translate(-50%, -50%)";

    // Create iframe
    const iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.src = url;
    iframe.sandbox.add("allow-forms");
    iframe.sandbox.add("allow-scripts");
    iframe.sandbox.add("allow-same-origin");
    iframe.sandbox.add("allow-storage-access-by-user-activation");
    iframe.sandbox.add("allow-popups");
    dialog.appendChild(iframe);
    document.body.appendChild(dialog);

    function cleanupIframe() {
        clearInterval(intervalLoop);
        window.removeEventListener("message", handleEvent);
        document.body.removeChild(dialog);
    }

    const intervalLoop = setInterval(function () {
        fetch(getServerInfoUrl, { credentials: "include" })
            .then((resp) => {
                if (resp.ok && resp.headers.get("Content-Type").includes("json")) {
                    cleanupIframe();
                    listener.onIframeClose();
                }
            })
            .catch(() => {
                // Before user login, we will keep hitting this block for permissions error.
            });
    }, oFF.NativeIframeHandler.GET_SERVER_INFO_INTERVAL);

    const handleEvent = (event) => {
        if (event && event.data && event.data.isClosed) {
            cleanupIframe();
            listener.onIframeClose();
        }
    }
    window.addEventListener("message", handleEvent, false);

    // Show dialog
    dialog.showModal();

    // Set timeout for authentication
    setTimeout(() => {
        if (iframe && document.body.contains(dialog)) {
            cleanupIframe();
            listener.onAuthenticationTimeout();
        }
    }, oFF.NativeIframeHandler.DEFAULT_AUTH_TIMEOUT);
};

oFF.NativeIframeHandler.prototype.openMessageIframe = function (url, listener, option) {

       const iframeName = Math.random().toString(32) + "_FF_Message_Iframe";
    const iframe = document.createElement("iframe");
    iframe.name = iframeName;
    iframe.style.display = "none";
    iframe.src = url;
    const state = Math.random().toString(32);
    if (option == oFF.MessageIframeOption.OPEN_ID) {
        iframe.src += "&state=" + state;
    }
    iframe.sandbox.add("allow-forms");
    iframe.sandbox.add("allow-scripts");
    iframe.sandbox.add("allow-same-origin");

    function getQueryParams(queryString) {
        return queryString.substr(1).split("&")
            .reduce((queryParams, param) => {
                const keyValue = param.split("=");
                const key = keyValue[0];
                const value = keyValue[1];
                queryParams[key] = value;
                return queryParams;
            }, {});
    }

    function validateMessage(event) {
        const eventData = JSON.parse(event && event.data || null);
        if (event.origin === null && !event.source && !eventData) {
            return false;
        }
        const location = event.source.location;
        const params = getQueryParams(location.search);
        return params.state === state && iframeName === event.source.name;
    }

    function cleanupIframe() {
        window.removeEventListener("message", handleMessageFetched);
        iframe.remove();
    }

    const handleMessageFetched = (event) => {
        if (option == oFF.MessageIframeOption.STORAGE_ACCESS_FILES_CHECK && event && event.data) {
            if (event.data.isExists) {
                cleanupIframe();
                listener.onMessageReceived();
            }
        } else if (option == oFF.MessageIframeOption.OPEN_ID && validateMessage(event)) {
            cleanupIframe();
            const params = getQueryParams(location.search);
            const message = {
                queryParams: params
            };

            const ffMessage = new oFF.NativeJsonProxyElement(message);
            listener.onMessageReceived(ffMessage);
        }
    };

    window.addEventListener("message", handleMessageFetched, false);

    document.body.appendChild(iframe);

    setTimeout(() => {
        if (iframe && document.body.contains(iframe)) {
            cleanupIframe();
            listener.onMessageTimeout();
        }
    }, option == oFF.MessageIframeOption.OPEN_ID ?
        oFF.NativeIframeHandler.DEFAULT_AUTH_TIMEOUT :
        oFF.NativeIframeHandler.FILE_CHECK_TIMEOUT);
};
/**
 * Native javascript implementation of the PopupHandler interface.
 * Keep this in sync with the TS implementation: NativePopupHandler.ts
 */
oFF.NativePopupHandler = function () {
       oFF.PopupHandler.call(this);
    this._ff_c = "NativePopupHandler";
};

oFF.NativePopupHandler.prototype = new oFF.PopupHandler();
oFF.NativePopupHandler.WINDOW_WIDTH = 400;
oFF.NativePopupHandler.WINDOW_HEIGHT = 520;
oFF.NativePopupHandler.DEFAULT_AUTH_TIMEOUT = 31000;

oFF.NativePopupHandler.staticSetup = function () {
       oFF.PopupHandler.setNative(new oFF.NativePopupHandler());
};

oFF.NativePopupHandler.prototype.openPopup = function (url, listener) {

       const state = Math.random().toString(32);
    const windowUrl = url + "&state=" + state;
    const authWindow = window.open(windowUrl, "_blank", `width=${oFF.NativePopupHandler.WINDOW_WIDTH},height=${oFF.NativePopupHandler.WINDOW_HEIGHT}`);

    if (!authWindow) {
        return false;
    }

    const authInterval = setInterval(() => {
        if (authWindow && authWindow.closed) {
            clearInterval(authInterval);
            listener.onMessageTimeout(); // window closed by user
        }
    }, 100);

    function getQueryParams(queryString) {
         return queryString.substr(1).split("&")
         .reduce((queryParams, param) => {
            const keyValue = param.split("=");
            const key = keyValue[0];
            const value = keyValue[1];
            queryParams[key] = value;
            return queryParams;
         }, {});
    }

    function getEventData(event) {
        let eventData;
        try {
            eventData = JSON.parse(event && event.data || null);
        } catch (e) {
            eventData = event.data;
        }
        return eventData;
    }

    function validateMessage(event) {
       const eventData = getEventData(event);

        if (event.origin === null && !event.source && !eventData) {
            return false;
        }

        if (eventData.isOpenIdSuccessful) {
            const location = event.source.location;
            const params = getQueryParams(location.search);
            return params.state === state;
        } else {
            return eventData.state === state;
        }

    }

    const handleMessageFetched = (event) => {
        if (validateMessage(event)) {
            clearInterval(authInterval);
            authWindow.close();

            const eventData = getEventData(event);

            let message = {};
            if (eventData.isOpenIdSuccessful) {
                const params = getQueryParams(event.source.location.search);
                message = {
                    queryParams: params
                };
            } else {
                message = event.data;
            }

            const ffMessage = new oFF.NativeJsonProxyElement(message);
            listener.onMessageReceived(ffMessage);
        }
    };

    authWindow.opener.addEventListener("message", handleMessageFetched, false);

    setTimeout(() => {
        if (authWindow && !authWindow.closed) {
            clearInterval(authInterval);
            authWindow.close();
            listener.onMessageTimeout();
        }
    }, oFF.NativeSamlUtils.DEFAULT_AUTH_TIMEOUT);

    return true;
};
oFF.NativeDocumentEnv = function() 
{
       oFF.DocumentEnv.call(this);
    this._ff_c = "NativeDocumentEnv";
};

oFF.NativeDocumentEnv.prototype = new oFF.DocumentEnv();

oFF.NativeDocumentEnv.staticSetup = function()
{
       oFF.DocumentEnv.setNative( new oFF.NativeDocumentEnv() );
};

oFF.NativeDocumentEnv.prototype.setNativeStringAtId = function( id, value )
{
   
    if( oFF.XSystemUtils.isBrowser() )
    {
    	var docElement = document.getElementById( id );
    	
    	if( docElement !== null && docElement !== undefined )
    	{
    		docElement.innerHTML = value;
    	}
	}
};

oFF.NativeXLocalStorage = function(session) {
   oFF.XLocalStorage.call(this);
  this._ff_c = "NativeXLocalStorage";
};
oFF.NativeXLocalStorage.prototype = new oFF.XLocalStorage();

oFF.NativeXLocalStorage.staticSetup = function() {
   if (oFF.XSystemUtils.isBrowser()) { //localStorage only available in browser
    oFF.XLocalStorage.setInstance(new oFF.NativeXLocalStorage());
  }
};

oFF.NativeXLocalStorage.releaseObject = function() {
   oFF.XLocalStorage.prototype.releaseObject.call(this);
};
//==============================================================

oFF.NativeXLocalStorage.prototype.getStringByKey = function(name) {
   return localStorage.getItem(name);
};

oFF.NativeXLocalStorage.prototype.getStringByKeyExt = function(name, defaultValue) {
   if (!this.containsKey(name)) {
    return defaultValue;
  }

  return this.getStringByKey(name);
};

oFF.NativeXLocalStorage.prototype.putString = function(name, value) {
   localStorage.setItem(name, value);
};
//==============================================================

oFF.NativeXLocalStorage.prototype.getBooleanByKey = function(name) {
   return localStorage.getItem(name) === "true";
};

oFF.NativeXLocalStorage.prototype.getBooleanByKeyExt = function(name, defaultValue) {
   if (!this.containsKey(name)) {
    return defaultValue;
  }

  return this.getBooleanByKey(name);
};

oFF.NativeXLocalStorage.prototype.putBoolean = function(name, value) {
   localStorage.setItem(name, value);
};
//==============================================================

oFF.NativeXLocalStorage.prototype.getLongByKey = function(name) {
   return parseInt(localStorage.getItem(name));
};

oFF.NativeXLocalStorage.prototype.getLongByKeyExt = function(name, defaultValue) {
   if (!this.containsKey(name)) {
    return defaultValue;
  }

  return this.getLongByKey(name);
};

oFF.NativeXLocalStorage.prototype.putLong = function(name, value) {
   localStorage.setItem(name, value);
};
//==============================================================

oFF.NativeXLocalStorage.prototype.getIntegerByKey = function(name) {
   return parseInt(localStorage.getItem(name), 10);
};

oFF.NativeXLocalStorage.prototype.getIntegerByKeyExt = function(name, defaultValue) {
   if (!this.containsKey(name)) {
    return defaultValue;
  }

  return this.getIntegerByKey(name);
};

oFF.NativeXLocalStorage.prototype.putInteger = function(name, value) {
   localStorage.setItem(name, value);
};


oFF.NativeXLocalStorage.prototype.getDoubleByKey = function(name) {
   return parseFloat(localStorage.getItem(name));
};

oFF.NativeXLocalStorage.prototype.getDoubleByKeyExt = function(name, defaultValue) {
   if (!this.containsKey(name)) {
    return defaultValue;
  }

  return this.getDoubleByKey(name);
};

oFF.NativeXLocalStorage.prototype.putDouble = function(name, value) {
   localStorage.setItem(name, value);
};
//==============================================================

oFF.NativeXLocalStorage.prototype.removeKey = function(key) {
   localStorage.removeItem(key);
};

oFF.NativeXLocalStorage.prototype.containsKey = function(key) {
   return localStorage.getItem(key) !== null && localStorage.getItem(key) !== undefined;
};

oFF.NativeXLocalStorage.prototype.clear = function() {
   localStorage.clear();
};

oFF.NativeXLocalStorage.prototype.getAllKeys = function() {
   var keyList = oFF.XList.create();
  for (var key in localStorage) {
    keyList.add(key);
  }
  return keyList;
};


oFF.NativeXCacheProviderIdbOpenAction = function() {};
oFF.NativeXCacheProviderIdbOpenAction.prototype = new oFF.SyncAction();
oFF.NativeXCacheProviderIdbOpenAction.prototype._ff_c = "NativeXCacheProviderIdbOpenAction";

oFF.NativeXCacheProviderIdbOpenAction.m_openReq = null;

oFF.NativeXCacheProviderIdbOpenAction.createAndRun = function(syncType, listener, customIdentifier, cacheProvider)
{
	var object = new oFF.NativeXCacheProviderIdbOpenAction();
	object.setupActionAndRun(syncType, listener, customIdentifier, cacheProvider);
	return object;
};
oFF.NativeXCacheProviderIdbOpenAction.prototype.releaseObjectInternal = function() {
};
oFF.NativeXCacheProviderIdbOpenAction.prototype.processSynchronization = function(syncType)
{
	
	var myself = this;
	var cp = this.getActionContext();
	this.setData( cp );
	var indexedDB = cp.getIDB();
	
	var openReq = indexedDB.open( "ff_cache25", 25 );
	
	openReq.onerror = function(event) 
	{
		// console.log( "[ERROR] Firefly: Cannot open IndexedDB");
	};
	
	openReq.onupgradeneeded = function( event ) 
	{
		// console.log("[INFO] onupgradeneeded");
		var dbChange = event.target.result;
	
		if( dbChange !== null )
		{
			if( dbChange.objectStoreNames.contains("main") === false ) 
			{
				var os = dbChange.createObjectStore( "main", { keyPath:  ["namespace", "name"] } );
				os.createIndex( "namespace", "namespace", {unique: false} );
				os.createIndex( "name", "name", {unique: false} );
				os.createIndex( "value", "value", {unique: false} );
			}
		}
	};
	
	openReq.onsuccess = function(event) 
	{
		// console.log("[info] onsuccess");
		var activeDb = event.target.result;
		cp.setActiveDb( activeDb );
		myself.endSync();
	};
	
	return true;
};

oFF.NativeXCacheProviderIdbOpenAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onCacheProviderOpen(extResult, data, customIdentifier);
};


oFF.NativeXCacheProviderIdbWriteAction = function() {};
oFF.NativeXCacheProviderIdbWriteAction.prototype = new oFF.SyncAction();
oFF.NativeXCacheProviderIdbWriteAction.prototype._ff_c = "NativeXCacheProviderIdbWriteAction";

oFF.NativeXCacheProviderIdbWriteAction.prototype.m_namespace = null;
oFF.NativeXCacheProviderIdbWriteAction.prototype.m_name = null;
oFF.NativeXCacheProviderIdbWriteAction.prototype.m_content = null;
oFF.NativeXCacheProviderIdbWriteAction.prototype.m_maxCount = 0;

oFF.NativeXCacheProviderIdbWriteAction.createAndRun = function(syncType, listener, customIdentifier, cacheProvider, namespace, name, content, maxCount)
{
	var object = new oFF.NativeXCacheProviderIdbWriteAction();
	object.m_namespace = namespace;
	object.m_name = name;
	object.m_content = content;
	object.setData( content );
	object.m_maxCount = maxCount;
	object.setupActionAndRun(syncType, listener, customIdentifier, cacheProvider);
	return object;
};
oFF.NativeXCacheProviderIdbWriteAction.prototype.releaseObjectInternal = function() {
};
oFF.NativeXCacheProviderIdbWriteAction.prototype.processSynchronization = function(syncType)
{

	var myself = this;

	var value = this.m_content.isBinaryContentSet() ? this.m_content.getByteArray().getNative() : this.m_content.getString();
	
	var cacheProvider = this.getActionContext();
	var activeDb = cacheProvider.getActiveDb();
	var transaction = activeDb.transaction( ["main"], "readwrite" );
	var store = transaction.objectStore("main");

	var request = store.put( { namespace: this.m_namespace, name: this.m_name, value: value } );

	request.onsuccess = function( event ) 
	{
		console.log("The data has been written successfully");
		cacheProvider.incWriteHit( myself.m_namespace );
		myself.endSync();
	};
	
	request.onerror = function( event ) 
	{
		console.log("The data has been written failed");
		myself.endSync();
	};
	
	return true;
};

oFF.NativeXCacheProviderIdbWriteAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onCacheWrite(extResult, data, customIdentifier);
};


oFF.NativeXCacheProviderIdbReadAction = function() {};
oFF.NativeXCacheProviderIdbReadAction.prototype = new oFF.SyncAction();
oFF.NativeXCacheProviderIdbReadAction.prototype._ff_c = "NativeXCacheProviderIdbReadAction";

oFF.NativeXCacheProviderIdbReadAction.prototype.m_namespace = null;
oFF.NativeXCacheProviderIdbReadAction.prototype.m_name = null;
oFF.NativeXCacheProviderIdbReadAction.prototype.m_validityTime = 0;

oFF.NativeXCacheProviderIdbReadAction.createAndRun = function(syncType, listener, customIdentifier, cacheProvider, namespace, name, validityTime)
{
	var object = new oFF.NativeXCacheProviderIdbReadAction();
	object.m_namespace = namespace;
	object.m_name = name;
	object.m_validityTime = validityTime;
	object.setupActionAndRun(syncType, listener, customIdentifier, cacheProvider);
	return object;
};
oFF.NativeXCacheProviderIdbReadAction.prototype.releaseObjectInternal = function() {
};
oFF.NativeXCacheProviderIdbReadAction.prototype.processSynchronization = function(syncType)
{
	
	var myself = this;
	
	var cacheProvider = this.getActionContext();
	var activeDb = cacheProvider.getActiveDb();
	var transaction = activeDb.transaction( ["main"], "readwrite" );
	var store = transaction.objectStore("main");

	var request = store.get( [ this.m_namespace, this.m_name ] );

	request.onsuccess = function( event ) 
	{
		var result = event.target.result;
		
		if( result !== undefined )
		{
			var value = result.value;
			console.log("The data has been read successfully");
			cacheProvider.incHit( myself.m_namespace );
			var content = value instanceof Uint8Array || value instanceof Array ? oFF.XContent.createByteArrayContent(oFF.ContentType.APPLICATION_OCTETSTREAM, new oFF.XByteArray(value)) : oFF.XContent.createStringContent(oFF.ContentType.TEXT, value);
			myself.setData(content);
		}
		else
		{
			cacheProvider.incMissedHit( myself.m_namespace );
			myself.addError("The data read has been failed");
		}
				
		myself.endSync();
	};
	
	request.onerror = function( event ) 
	{
		cacheProvider.incMissedHit( myself.m_namespace );
		myself.addError("The data read has been failed");
		myself.endSync();
	};
	
	return true;
};

oFF.NativeXCacheProviderIdbReadAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onCacheRead(extResult, data, customIdentifier);
};


oFF.NativeXCacheProviderIdbDeleteAction = function() {};
oFF.NativeXCacheProviderIdbDeleteAction.prototype = new oFF.SyncAction();
oFF.NativeXCacheProviderIdbDeleteAction.prototype._ff_c = "NativeXCacheProviderIdbDeleteAction";

oFF.NativeXCacheProviderIdbDeleteAction.prototype.m_namespace = null;
oFF.NativeXCacheProviderIdbDeleteAction.prototype.m_name = null;
oFF.NativeXCacheProviderIdbDeleteAction.prototype.m_content = null;
oFF.NativeXCacheProviderIdbDeleteAction.prototype.m_maxCount = 0;

oFF.NativeXCacheProviderIdbDeleteAction.createAndRun = function(syncType, listener, customIdentifier, cacheProvider, namespace, name, content, maxCount)
{
	var object = new oFF.NativeXCacheProviderIdbDeleteAction();
	object.m_namespace = namespace;
	object.m_name = name;
	object.m_content = content;
	object.setData( oFF.XBooleanValue.create(false) );
	object.setupActionAndRun(syncType, listener, customIdentifier, cacheProvider);
	return object;
};
oFF.NativeXCacheProviderIdbDeleteAction.prototype.releaseObjectInternal = function() {
};
oFF.NativeXCacheProviderIdbDeleteAction.prototype.processSynchronization = function(syncType)
{

	var myself = this;
	
	var cacheProvider = this.getActionContext();
	var activeDb = cacheProvider.getActiveDb();
	var transaction = activeDb.transaction( ["main"], "readwrite" );
	var store = transaction.objectStore("main");

	var request = store.delete( [ this.m_namespace, this.m_name ] );
	 
	request.onsuccess = function( event )
	{
		console.log("The data has been deleted successfully");
		cacheProvider.incDelete( myself.m_namespace );
		myself.endSync();
	};
	
	request.onerror = function( event )
	{
		console.log("Failed to delete the data");
		myself.endSync();
	};
	
	return true;
};

oFF.NativeXCacheProviderIdbDeleteAction.prototype.callListener = function(extResult, listener, data, customIdentifier)
{
	listener.onCacheDelete(extResult, data.getBoolean(), customIdentifier);
};

oFF.NativeXCacheProviderIdb = function() {
       oFF.DfXCacheProvider.call(this);
    this._ff_c = "NativeXCacheProviderIdb";
};

oFF.NativeXCacheProviderIdb.prototype = new oFF.DfXCacheProvider();
oFF.NativeXCacheProviderIdb.m_indexedDB = null;
oFF.NativeXCacheProviderIdb.m_activeDb = null;

oFF.NativeXCacheProviderIdb.create = function( session )
{
       var fs = new oFF.NativeXCacheProviderIdb();
    fs.setupSessionContext( session );
    return fs;
};

oFF.NativeXCacheProviderIdb.prototype.setupSessionContext = function( session )
{
	oFF.DfXCacheProvider.prototype.setupSessionContext.call(this, session );
    
    var win = (typeof window !== "undefined") ? window : {};
	this.m_indexedDB = win.indexedDB || win.mozIndexedDB || win.webkitIndexedDB || win.msIndexedDB;
};

oFF.NativeXCacheProviderIdb.prototype.processOpen = function( syncType, listener, customIdentifier )
{
	return oFF.NativeXCacheProviderIdbOpenAction.createAndRun( syncType, listener, customIdentifier, this );
};

oFF.NativeXCacheProviderIdb.prototype.getPrefix = function()
{
       return "";
};

oFF.NativeXCacheProviderIdb.prototype.writeStringToCache = function( namespace, name, stringValue, maxCount )
{
   	
	// this.s_writeCounter++;
	
	var request = this.m_activeDb.transaction(["main"], "readwrite")
		.objectStore("main")
		.add({ namespace: namespace, name: name, value: stringValue });
	
	request.onsuccess = function (event) 
	{
		console.log("The data has been written successfully");
	};
	
	request.onerror = function (event) 
	{
		console.log("The data has been written failed");
	};
};

oFF.NativeXCacheProviderIdb.prototype.getStringByKey = function( name )
{
   	// return window.localStorage.getItem( name );
	return null;
};

oFF.NativeXCacheProviderIdb.prototype.clearCacheInternal = function( namespace )
{
   	// window.localStorage.clear();
};

oFF.NativeXCacheProviderIdb.prototype.getIDB = function()
{
   	return this.m_indexedDB;
};

oFF.NativeXCacheProviderIdb.prototype.setActiveDb = function( activeDb )
{
   	this.m_activeDb = activeDb;
};

oFF.NativeXCacheProviderIdb.prototype.getActiveDb = function()
{
   	return this.m_activeDb;
};

oFF.NativeXCacheProviderIdb.prototype.processWrite = function(syncType, listener, customIdentifier, namespace, name, content, maxCount)
{
	return oFF.NativeXCacheProviderIdbWriteAction.createAndRun(syncType, listener, customIdentifier, this, namespace, name, content, maxCount);
};

oFF.NativeXCacheProviderIdb.prototype.processRead = function(syncType, listener, customIdentifier, namespace, name, validityTime)
{
	return oFF.NativeXCacheProviderIdbReadAction.createAndRun(syncType, listener, customIdentifier, this, namespace, name, validityTime);
};

oFF.NativeXCacheProviderIdb.prototype.processDelete = function(syncType, listener, customIdentifier, namespace, name)
{
	return oFF.NativeXCacheProviderIdbDeleteAction.createAndRun(syncType, listener, customIdentifier, this, namespace, name);
};

oFF.NativeXCacheProviderLs = function() {
       oFF.DfXCacheProvider.call(this);
    this._ff_c = "NativeXCacheProviderLs";
};

oFF.NativeXCacheProviderLs.prototype = new oFF.DfXCacheProvider();

oFF.NativeXCacheProviderLs.create = function( session )
{
       var fs = new oFF.NativeXCacheProviderLs();
    fs.setupSessionContext( session );
    return fs;
};

oFF.NativeXCacheProviderLs.prototype.getPrefix = function()
{
       return "sap.ff";
};

oFF.NativeXCacheProviderLs.prototype.putString = function( name, stringValue )
{
       
    try
 	{   
		window.localStorage.setItem( name, stringValue );
	}
	catch( e )
	{
		this.logError2( "Error occured during cache writing: ", e.message ); 		
	}
};

oFF.NativeXCacheProviderLs.prototype.getStringByKey = function( name )
{
   	return window.localStorage.getItem( name );
};

oFF.NativeXCacheProviderLs.prototype.clearCacheInternal = function( namespace )
{
   	window.localStorage.clear();
};

oFF.NativeXCacheProviderFactory = function()
{
	oFF.XCacheProviderFactory.call( this );
	this._ff_c = "NativeXCacheProviderFactory";
};

oFF.NativeXCacheProviderFactory.prototype = new oFF.XCacheProviderFactory();

oFF.NativeXCacheProviderFactory.staticSetup = function()
{
	
	var win = (typeof window !== "undefined") ? window : {};
	
	if( typeof(win.localStorage) !== "undefined" ) 
	{
		var factory = new oFF.NativeXCacheProviderFactory();
		oFF.XCacheProviderFactory.registerFactory( oFF.XCacheProviderFactory.DRIVER_LOCAL_STORAGE, factory );
	}
	
	var indexedDB = win.indexedDB || win.mozIndexedDB || win.webkitIndexedDB || win.msIndexedDB;
	
	if( indexedDB !== "undefined" && indexedDB !== null )
	{ 
		oFF.XCacheProviderFactory.registerFactory( oFF.XCacheProviderFactory.DRIVER_INDEX_DB, factory );
	}
};

oFF.NativeXCacheProviderFactory.prototype.newDeviceCacheAccess = function( session, driverName )
{
	var provider = null;
	
	if( driverName == oFF.XCacheProviderFactory.DRIVER_LOCAL_STORAGE )
	{ 
		provider = new oFF.NativeXCacheProviderLs.create( session );
	}
	else if( driverName == oFF.XCacheProviderFactory.DRIVER_INDEX_DB )
	{
		provider = new oFF.NativeXCacheProviderIdb.create( session );
	} 
		
	return provider;
};

oFF.NativeXPeek = function () {
       oFF.XPeek.call(this);
    this._ff_c = "NativeXPeek";
};

oFF.NativeXPeek.prototype = new oFF.XPeek();

oFF.NativeXPeek.staticSetup = function () {
   
    if (typeof document !== "undefined") {
        const factory = new oFF.NativeXPeek();
        oFF.XPeek.setInstance(factory);
    }
};

oFF.NativeXPeek.prototype.retrieveContent = function (storage, key) {
       let content = null; // IXContent
    const iframe = document.getElementById(key);
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    // Check if loading is complete
    if (iframeDoc.readyState === "complete") {
        const theText = iframeDoc.body.innerText;
        content = oFF.XContent.createStringContent(oFF.ContentType.TEXT, theText);
    }

    return content;
};

/// <summary>Initializer for static constants.</summary>
oFF.IoNativeModule = function () {
       oFF.DfModule.call(this);
    this._ff_c = "IoNativeModule";
};

oFF.IoNativeModule.prototype = new oFF.DfModule();
oFF.IoNativeModule.s_module = null;

oFF.IoNativeModule.getInstance = function () {
       var oNativeModule = oFF.IoNativeModule;

    if (oNativeModule.s_module === null) {
        if (oFF.IoModule.getInstance() === null) {
            throw new Error("Initialization Exception");
        }

        oNativeModule.s_module = oFF.DfModule.startExt(new oFF.IoNativeModule());

        oFF.NativeNetworkEnv.staticSetup();
        oFF.NativeDispatcher.staticSetup();
        oFF.NativeHttpClientFactory.staticSetup();
        oFF.NativeXLocalStorage.staticSetup();
        oFF.NativeXCacheProviderFactory.staticSetup();

        oFF.NativeDocumentEnv.staticSetup();
        oFF.NativeXPeek.staticSetup();
        oFF.NativeSamlUtils.staticSetup();
        oFF.NativeOAuthUtils.staticSetup();
        oFF.NativeIframeHandler.staticSetup();
        oFF.NativePopupHandler.staticSetup();

        if (oFF.isNode()) {
            oFF.userSession = {};
            oFF.NativeXFileSystem.staticSetup();
            oFF.NativeXFileSystemOSFactory.staticSetup();
        }
        if (!oFF.isUi5() && !oFF.isXs()) {
            oFF.NativeSqlDriverFactory.staticSetup();
        }

        oFF.DfModule.stopExt(oNativeModule.s_module);
    }

    return oNativeModule.s_module;
};

oFF.IoNativeModule.prototype.getName = function () {
       return "ff0210.io.native";
};

oFF.IoNativeModule.getInstance();


return oFF;
} );