
/*!
 * SAP Web Analytics - Tracking Script
 *
 * Version: 0.1.3f
 *
 * (C) 2013-2015 SAP SE. All rights reserved.
 */

(function() {
  /*global window, document, event, navigator, jQuery, parent, console, CustomEvent, Promise*/
  //Exposing only sap,swa,_paq as global variables for IIFE scope
  if (typeof window.swa === "undefined") {
    window.swa = {};
  }
  var swa = window.swa;
  var lastSeenHash = "lastSeenHash";
  if (typeof window._paq === "undefined") {
    window._paq = [];
  }
  var _paq = window._paq;

  if (typeof window.sap === "undefined") {
    window.sap = {};
  }
  var sap = window.sap;

  var siteProperties = siteProperties || {};
  swa.logger = true;
  var loggingEnabled = "N";
  var AnonymizationConfigurations = {};
  var isHeartBeatEnabled = false;
  var isLanguageConsent = false;
  var heartBeatInterval = 30;
  var currentPageUrl = "";
  var UI5EVENTS_WHITELIST = {
    routeMatched: true
  };
  var loggedUrl = "";
  var routeMatchedDisabled = false;
  var consentTextPresent = false;
  var count = 0;
  var varlength = 225;
  var previous = {};
  previous.timeStamp = 0;
  var i18nValues = [],
    defaultConsentValues = [];
  var preferencesLoaded = false;
  var prefMap = {
    visitorUUIDAnonymity: 131072,
    clientPrefAnonymity: 65536,
    clientSpecsAnonymity: 32768,
    createdTimeAnonymity: 16384,
    locationAnonymity: 8192,
    overrideClientPrefAnonymity: 4096,
    overrideClientSpecsAnonymity: 2048,
    overrideCreatedTimeAnonymity: 1024,
    overrideLocationAnonymity: 512,
    heartBeat: 256,
    ui5Events: 128,
    internalApplicationUser: 64,
    hasCustomFields: 32,
    hasPersonalData: 16,
    bannerEnabled: 8,
    globalBannerEnabled: 4,
    languageConsent: 2,
    honorDNT: 1
  };


  //Set swa default values for config variables not yet set
  swa.variableInit = function() {
    var url = swa.baseUrl;
    //removing trailing slash
    swa.discoveryBaseURL = url.substring(
      0,
      url.charAt(url.length - 1) == "/" ? url.length - 1 : url.length
    );
    swa.discoveryBaseURL += "/public/site";

    if (typeof swa.cookiesEnabled === "undefined") {swa.cookiesEnabled = true;}
    if (typeof swa.loggingUrl === "undefined") {swa.loggingUrl = swa.baseUrl;}
    if (typeof swa.pageLoadEnabled === "undefined") {swa.pageLoadEnabled = true;}
    if (typeof swa.clicksEnabled === "undefined") {swa.clicksEnabled = true;}
    if (typeof swa.customEventsEnabled === "undefined") {swa.customEventsEnabled = true;}
    if (typeof swa.hotkeysEnabled === "undefined") {swa.hotkeysEnabled = false;}

    if (typeof swa.consentStyle === "undefined") {swa.consentStyle = "banner";}
    if (typeof swa.consentOnLoad === "undefined") {swa.consentOnLoad = "true";}
    if (typeof swa.isConsentGiven === "undefined") {swa.isConsentGiven = false;}
    if (typeof swa.parentCookies === "undefined") {swa.parentCookies = "";}

    if (typeof swa.sessionCookieTimeout === "undefined") {
      //30 min in s (Piwik: _swa_ses cookie)
      swa.sessionCookieTimeout = 1800;
    }

    if (typeof swa.referralCookieTimeout === "undefined") {
      //6 months in s (Piwik: _swa_ref cookie)
      swa.referralCookieTimeout = 15778463;
    }
    if (typeof swa.frameExclusionSelector === "undefined") {
      //jQuery selector to exclude matching iframes from tracking when swa.trackFrames = true
      swa.frameExclusionSelector = ".swa_ignore"; //class="swa_ignore ..."
    }
    if (typeof swa.textExclusionSelector === "undefined") {
      swa.textExclusionSelector = "";
    }
    if (typeof swa.referrerOfTop === "undefined") {
      swa.referrerOfTop = false;
    }

    swa.currentEvent = "";

    //Set clientSideAnonymization values if they are provided in snippet

    if (typeof swa.clientPrefAnonymityEnabled !== "undefined") {
      swa.clientPrefAnonymityEnabledVal =
        typeof swa.clientPrefAnonymityEnabled == "function"
          ? swa.clientPrefAnonymityEnabled()
          : swa.clientPrefAnonymityEnabled;
    }

    if (typeof swa.clientSpecsAnonymityEnabled !== "undefined") {
      swa.clientSpecsAnonymityEnabledVal =
        typeof swa.clientSpecsAnonymityEnabled == "function"
          ? swa.clientSpecsAnonymityEnabled()
          : swa.clientSpecsAnonymityEnabled;
    }

    if (typeof swa.createdTimeAnonymityEnabled !== "undefined") {
      swa.createdTimeAnonymityEnabledVal =
        typeof swa.createdTimeAnonymityEnabled == "function"
          ? swa.createdTimeAnonymityEnabled()
          : swa.createdTimeAnonymityEnabled;
    }

    if (typeof swa.locationAnonymityEnabled !== "undefined") {
      swa.locationAnonymityEnabledVal =
        typeof swa.locationAnonymityEnabled == "function"
          ? swa.locationAnonymityEnabled()
          : swa.locationAnonymityEnabled;
    }

    //By default, xhr request tracking is disabled
    if (typeof swa.xhrEnabled === undefined) {swa.xhrEnabled = false;}

    if(!isTrackingAllowedBasedOnDNTSetting(siteProperties.honorDNT, (window.navigator.doNotTrack == "1" ? 1 : 0)))  {
      loggingEnabled = "N";

      //If XHR tracking is enabled, disable it explicitly when browser DNT settings are ON
      swa.xhrEnabled = false;
    }
    if (typeof swa.consentFormLanguage === "undefined") {swa.consentFormLanguage = getUserLanguage();}
    swa.consentFormLanguage = convertLocaleToDesiredFormat(swa.consentFormLanguage);
    if (typeof swa.appName === "undefined" || swa.appName == "") {
      swa.appName = null;
    }
    
    if (!(swa.appName === null) && !(swa.appName === undefined) && !(swa.appBannerSuffixText === undefined) && !(swa.appBannerPrefixText === undefined) && !(swa.appName.replace(/^\s+|\s+$/gm,'') === "") ) {
      if (swa.privacyLink === null || swa.privacyLink === "" || swa.privacyLink === undefined || swa.cookieStatementLink === null || swa.cookieStatementLink === undefined ) {
       console.error("The consent does not include a Privacy statement/cookie statement. Please make sure you have configured swa.cookieStatementLink and swa.privacyLink to display consent form");
        swa.disable();
        return;
      }

    }

    if (typeof swa.cookieStatementLink === "undefined" || swa.cookieStatementLink == "") {
      swa.cookieStatementLink = null;
    }
    //New property to include a privacy link in consent form/banner.
    if (typeof swa.privacyLink === "undefined") {
      swa.privacyLink = null;
    }
    // If provided, validate the URL
    else if (swa.privacyLink !== null && !isURLValid(swa.privacyLink)) {
      console.error("URL Validation failed for privacy link.");
      swa.privacyLink = null;
    }
    //New property to for anonymous tracking enablement.
    if(typeof swa.anonymousTrackingConsent === "undefined"){
      swa.anonymousTrackingConsent = false;
    }
    //include the external css to load banner/consent form
swa.addCss();
  };

  function canSessionIncrement(){
    /**Check if session cookie exists. If yes, then do nothing. Else, check if visit counter exists. If not, do nothing. If yes, increment it
     * All this makes sense only when tracking is ON - increment the session only if the visitor cookie exists
    **/
    if(document.cookie.indexOf("_swa_ses." + swa.pubToken) == -1 && document.cookie.indexOf("_swa_id." + swa.pubToken) !== -1 && window.localStorage.getItem("id_vc." + swa.pubToken) !== undefined){
      window.localStorage.setItem('id_vc.' + swa.pubToken, parseInt(window.localStorage.getItem('id_vc.' + swa.pubToken)) + 1);
    } else if(document.cookie.indexOf("_swa_ses." + swa.pubToken) == -1 && document.cookie.indexOf("_swa_id." + swa.pubToken) == -1) {window.localStorage.setItem('id_vc.' + swa.pubToken, 1);} //Create the first session of the user if no cookies exist
  }

  //Called to load the external stylesheet for banner and consent form
swa.addCss = function(){
  var cssurl = swa.baseUrl+ "js/css/style.css";
  if(window.sap.ui !== undefined && parseFloat(sap.ui.version) >= 1.94 ) {
    cssurl = sap.ui.require.toUrl(
      "sap/webanalytics/core/SAPWebAnalyticsFLPPlugin/css/style.css"
    );
  }
  var d = document,
        g = d.createElement("link");
        g.rel  = 'stylesheet';
        g.type = 'text/css';
        g.href = cssurl;
      if (d.body) {
        d.body.appendChild(g);
      } else {
        var ss = d.getElementsByTagName("link"),
          s = ss[ss.length - 1];
        s.parentNode.insertBefore(g, s.nextSibling);
      }	
  };
  //Called to init SWA after we made sure jQuery exists
  swa.documentReady = function() {
    //Init variables
    swa.variableInit();
    //call anonymous Tracking even before preferences if anonymous flag is set
    if(swa.anonymousTrackingConsent && siteProperties.bannerEnabled){
      //track anonymously after the preferneces done
       window.addEventListener("swaLoadSuccess", function(){
        swa.enable();
    });
    }
    fallback();
    localizeText();
    //Starts tracking based on Site preferences.
    getPreferences();

    if (swa.jQuery) {
      //Add click functions to hide / show license elements
      swa.jQuery("#swa_background, .close_license").click(function(event) {
        swa.jQuery("#swa_background").fadeOut(500);
        swa.jQuery("#swa_license").fadeOut(500);
        event.preventDefault();
      });

      window.setTimeout(function() {
        swa.jQuery(".showlicense").click(function(event) {
          var wheight = swa.jQuery(window).height();
          var wwidth = swa.jQuery(window).width();
          var mheight = swa.jQuery("#swa_license").outerHeight();
          var mwidth = swa.jQuery("#swa_license").outerWidth();
          var top = (wheight - mheight) / 2;
          var left = (wwidth - mwidth) / 2;
          swa.jQuery("#swa_license").css({ top: top, left: left });
          swa.jQuery("#swa_background").css({ display: "block", opacity: 0 });
          swa.jQuery("#swa_background").fadeTo(500, 0.8);
          swa.jQuery("#swa_license").fadeIn(500);
          event.preventDefault();
        });
      }, 1000);
    }
    //Enable UI5 events
    if (swa._isUI5()) {
      swa._enableUI5Events();
    } else {
      window.setTimeout(function() {
        if (swa._isUI5()) {swa._enableUI5Events();}
      }, 5000);
    }
  };

  //function to check if the browser's do not track setting should be honored
  function isTrackingAllowedBasedOnDNTSetting(siteHonorDNT, browserDNT) {
    //If honorDNT for site is set to 0, do not look at the browser setting. Allow tracking
    if(siteHonorDNT == 0) {return true;}
    //If honorDNT = 1, allow tracking ony when browser do not track setting is off
    if(browserDNT == 0) {return true;}
    return false;
  }

  //Creates SWA Banner to get visitor cookie consent from user
  function addBanner() {
    //check both site and browser settings
    if(!isTrackingAllowedBasedOnDNTSetting(siteProperties.honorDNT, (window.navigator.doNotTrack == "1" ? 1 : 0))) {
      console.error(
        "You've enabled the 'Do Not Track' option. This allows you to request websites not to collect or track your browsing data. By default, SAP Web Analytics respects the browser's Do Not Track setting."
      );
      return;
    }
    //Get the swa.consentStyle and swa.consentOnLoad, if consentStyle popup, show pop up on load is true, show banner and pop up if tracking status is off
    if (loggingEnabled == "N" || loggingEnabled == "A") {
      if (swa.consentStyle == "popup" && swa.consentOnLoad) {
        //show consent pop up
        showConsentForm(false);
      } else if (swa.consentOnLoad) {

        var consentText = swa.anonymousTrackingConsent?swa.anonymousConsentText:swa.consentOptInText;
       
        if (!(swa.appName === null) && !(swa.appName === undefined) && !(swa.appBannerSuffixText === undefined) && !(swa.appBannerPrefixText === undefined) && !(swa.appBannerPrefixText === "APP_BANNER_PREFIX_TEXT") && !(swa.appName.replace(/^\s+|\s+$/gm,'') === "") ) {
          if (swa.privacyLink === null || swa.privacyLink === "" || swa.privacyLink === undefined || swa.cookieStatementLink === null || swa.cookieStatementLink === undefined ) {
            console.error("The consent does not include a Privacy statement/cookie statement. Please make sure you have configured swa.cookieStatementLink and swa.privacyLink to display consent form");
             swa.disable();
             return;
           }
          if (swa.anonymousTrackingConsent)
            consentText = getAppNameConsentText(swa.appBannerOptinAnonymisedtext);
          else
            consentText = getAppNameConsentText(swa.appBannerOptInText);
       
   }
        

        if (swa.jQuery(".swa_banner").length === 0) {
          if (swa.consentStyle == "bannerbottom") {
swa
              .jQuery("body")
              .append(
                '<div id="swa_banner "  class="swa_banner bannerbottom"><p><strong>' +
                consentText +
                  '</strong></p></br><hr><div id="buttonsDiv" ><button type="button" id="yesButton" title=' +
                  swa.consentAllowButton +
                  ' class = "bannerButton" >' +
                  swa.consentAllowButton +
                  '</button><button type="button" class = "bannerButton" title=' +
                  swa.consentDenyButton +
                  ' id="noButton" >' +
                  swa.consentDenyButton +
                  '</button><a href="#" title=' +
                  swa.consentCloseButton +
                  ' class="consentCloseButton" ><img id="closeButton"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAACIiIhaeOqmAAAAAXRSTlMAQObYZgAAAC9JREFUaN5jYGBgEOBgsJBhqLFjsKthkP/BwP+Bgf0BCAEZQC5QECgFVABUxsAAAOcxCbuaDAybAAAAAElFTkSuQmCC" /></a></div>'
              );
} else {
swa
              .jQuery("body")
              .append(
                '<div id="swa_banner"  class="swa_banner bannertop"><p><strong>' +
                  consentText +
                  '</strong></p></br><hr><div id="buttonsDiv" ><button type="button" id="yesButton" title=' +
                  swa.consentAllowButton +
                  ' class = "bannerButton" >' +
                  swa.consentAllowButton +
                  '</button><button type="button" class = "bannerButton" title=' +
                  swa.consentDenyButton +
                  ' id="noButton" >' +
                  swa.consentDenyButton +
                  '</button><a href="#" title=' +
                  swa.consentCloseButton +
                  ' class="consentCloseButton" ><img id="closeButton"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAACIiIhaeOqmAAAAAXRSTlMAQObYZgAAAC9JREFUaN5jYGBgEOBgsJBhqLFjsKthkP/BwP+Bgf0BCAEZQC5QECgFVABUxsAAAOcxCbuaDAybAAAAAElFTkSuQmCC" /></a></div>'
              );
}
          swa.jQuery("#yesButton,#noButton,#closeButton").click(function() {
            banner_save(event);
            return false;
          });
        }
        swa.jQuery(".swa_banner").hide();
      }
    } else {
      console.log("Enabled only if tracking is off.");
    }
  }

  //Function to save cookie consent decision
  function banner_save(event) {
    //Close the banner
    if (swa.consentStyle == "banner" || swa.consentStyle == "bannerbottom") {swa.jQuery(".swa_banner").slideUp();} else {
      swa.jQuery("#swa_consentform").slideUp();
      removeConsentForm();
    }
    //event.preventDefault();

    var buttonId = event.target.id || event.srcElement.id;

    /**
     * Based on the consent, create a cookie with appropriate values 1 - Accept,
     * 0 - Deny, 2 - Defer decision
     */

    if (buttonId === "yesButton") {
      createSWACookie("tracking_consent", 1);
      swa.enable();
      if(swa.anonymousTrackingConsent) {swa.trackLoad();}
    } else if(buttonId === "noButton"){
      //check the anonymousTrackingConsent flag value and perform the action
      if(!swa.anonymousTrackingConsent) {createSWACookie("tracking_consent", 0);} else {
        createSWACookie("tracking_consent", 0);
        swa.enable();
      }
    } else if (buttonId === "closeButton"){
      //check the anonymousTrackingConsent flag value and perform the action
      if(!swa.anonymousTrackingConsent) {createSWACookie("tracking_consent", 2);}
      //When anonymousTrackingConsent is true and identified tracking is ON, do nothing on close button
      else if(swa.anonymousTrackingConsent  && loggingEnabled !== "I") {
        createSWACookie("tracking_consent", 2);
        swa.enable();
      }
    }else if(buttonId === "swaconsent_notnow_modal"){
      //check the anonymousTrackingConsent flag value and perform the action
      if(!swa.anonymousTrackingConsent) {createSWACookie("tracking_consent", 0);} else {
        createSWACookie("tracking_consent", 0);
        swa.enable();
      }
    } else if (buttonId === "swaconsent_allow_modal") {
      createSWACookie("tracking_consent", 1);
      swa.enable();
      if(swa.anonymousTrackingConsent) {swa.trackLoad();}
    }
  }

  //Exposing function to save consent decision from FLP Settings dialog
  swa.saveConsentDecision = function(consentDecision){
    if(consentDecision){
      createSWACookie("tracking_consent", 1);
      swa.enable();
    } else{
      stopTracking(false);
    }
  };

  //Exposing function to fetch the banner setting of the site
  swa.isConsentBannerEnabled = function(){
    return (siteProperties.bannerEnabled) !== undefined ? siteProperties.bannerEnabled : false;
  };

  //Handles consent
  function getPreferences() {
    if (swa._isUI5() && parseFloat(sap.ui.version) >= 1.86 && swa.getCookieValue("_swa_pref." + swa.pubToken)) {
      var pref = JSON.parse(
        decodeURIComponent(swa.getCookieValue("_swa_pref." + swa.pubToken))
      );
      preferencesDone(pref);
    } else {
      var url = swa.discoveryBaseURL + "/preferences?siteId=" + swa.pubToken;
      if(swa._isUI5() && parseFloat(sap.ui.version) >= 1.86){
        url += "&minified=true";
      }
      var promisePref = swa.ajaxRequest(url, "GET");
      promisePref.then(preferencesDone);
    }
  }

  function isSWACookiePresent(cookies) {
    var swaCookies = cookies.split(";");
    for (var i = 0; i < swaCookies.length; i++) {
      var cookie = swaCookies[i].trim();
      if (cookie.indexOf("_swa") == 0) {
        return true;
      }
    }
    return false;
  }

  function getSWACookieValue(cookies) {
    var cookiesArr = [],
      name = "_swa",
      j = 0,
      swaCookies = [];
    if (!cookies) {
      return null;
    }
    cookies = unescape(cookies);
    swaCookies = cookies.split(";");
    for (var i = 0; i < swaCookies.length; i++) {
      var cookie = swaCookies[i].trim();
      if (cookie.indexOf(name) == 0) {
        cookiesArr[j++] = cookie;
      }
    }
    return cookiesArr;
  }

  function decodePref(oPref) {
    var decodedPref = {};
    decodedPref.pubToken = swa.pubToken;
    decodedPref.cookieTimeOut = oPref.ct;
    decodedPref.globalCookieTimeout = oPref.gct;
    decodedPref.heartBeatInterval = oPref.hbt;
    var p;
    for (p in prefMap) {
      decodedPref[p] = (prefMap[p] & oPref.afb) == prefMap[p] ? 1 : 0;
    }
    return decodedPref;
  }

  function preferencesDone(pubTokenAttributes) {
    var pref;

    //Indicating that the preferences API returned 200 response
	preferencesLoaded = true;

    if(swa._isUI5() && parseFloat(sap.ui.version) >= 1.86){
      pref = pubTokenAttributes;
      pubTokenAttributes = decodePref(pubTokenAttributes);
    }
    //Get Server side anonymization settings
    AnonymizationConfigurations.clientPrefAnonymityServerVal =
      pubTokenAttributes.clientPrefAnonymity;
    AnonymizationConfigurations.clientSpecsAnonymityServerVal =
      pubTokenAttributes.clientSpecsAnonymity;
    AnonymizationConfigurations.createdTimeAnonymityServerVal =
      pubTokenAttributes.createdTimeAnonymity;
    AnonymizationConfigurations.locationAnonymityServerVal =
      pubTokenAttributes.locationAnonymity;
    //Get Client side anonymization override decision settings
    AnonymizationConfigurations.overrideClientPrefAnonymity =
      pubTokenAttributes.overrideClientPrefAnonymity;
    AnonymizationConfigurations.overrideClientSpecsAnonymity =
      pubTokenAttributes.overrideClientSpecsAnonymity;
    AnonymizationConfigurations.overrideCreatedTimeAnonymity =
      pubTokenAttributes.overrideCreatedTimeAnonymity;
    AnonymizationConfigurations.overrideLocationAnonymity =
      pubTokenAttributes.overrideLocationAnonymity;
    //Atleast one server side property should be anonymized and atleast one should be overridden in cient side
    if (
      (AnonymizationConfigurations.clientPrefAnonymityServerVal &&
        AnonymizationConfigurations.overrideClientPrefAnonymity) ||
      (AnonymizationConfigurations.clientSpecsAnonymityServerVal &&
        AnonymizationConfigurations.overrideClientSpecsAnonymity) ||
      (AnonymizationConfigurations.createdTimeAnonymityServerVal &&
        AnonymizationConfigurations.overrideCreatedTimeAnonymity) ||
      (AnonymizationConfigurations.locationAnonymityServerVal &&
        AnonymizationConfigurations.overrideLocationAnonymity)
    ) {
      swa.overrideServerAnonymization = true;
    }
    isHeartBeatEnabled = pubTokenAttributes.heartBeat;
    heartBeatInterval = pubTokenAttributes.heartBeatInterval;
    isLanguageConsent = pubTokenAttributes.languageConsent;

    //verify if languageConsent is ON then use the changes else english
    if(!isLanguageConsent && (consentTextPresent) ){
      swa.consentOptInText = i18nValues[0];
      swa.consentOptOutText = i18nValues[1];
      swa.consentAllowButton = i18nValues[2];
      swa.consentDenyButton = i18nValues[3];
      swa.consentStopButton = i18nValues[4];
      swa.consentCloseButton = i18nValues[5];
      swa.privacyLinkText = i18nValues[6];
      swa.anonymousConsentText = i18nValues[7];
      swa.anonymousConsentOptOutText = i18nValues[8];
      swa.anonymizeButtonText = i18nValues[9];
      swa.customConsentOptionText = i18nValues[10];
      swa.trackOnStatus = i18nValues[11];
      swa.trackOffStatus = i18nValues[12];
      swa.trackAnonymousStatus = i18nValues[13];
      swa.trackingStatusText = i18nValues[14];
      swa.appBannerPrefixText =  i18nValues[15] ; 
      swa.appBannerSuffixText = i18nValues[16];
      swa.appBannerOptInText = i18nValues[17];
      swa.appbannerOptoutText = i18nValues[18];
      swa.appBannerOptinAnonymisedtext = i18nValues[19];
      swa.appBannerOptoutAonymisedtext = i18nValues[20];
      swa.cookieStatementText = i18nValues[21];
      
      swa.appNameNonAnonymousConsentOptInText =  i18nValues[15] + i18nValues[17] + i18nValues[16];
      swa.appNameNonanonymousConsentOptOutText =  i18nValues[15] + i18nValues[18] + i18nValues[16];
      swa.appNameAnonymousConsentOptInText =  i18nValues[15] + i18nValues[19] + i18nValues[16];
      swa.appNameAnonymousConsentOptOutText =  i18nValues[15] + i18nValues[20] + i18nValues[16];
    }else{
      getDefaultTextForConsent();
    }

    //Get GDPR related site & space settings
    siteProperties.hasCustomFields = pubTokenAttributes.hasCustomFields;
    siteProperties.hasPersonalData = pubTokenAttributes.hasPersonalData;
    siteProperties.internalApplicationUser =
      pubTokenAttributes.internalApplicationUser;
    siteProperties.visitorUUIDAnonymity =
      pubTokenAttributes.visitorUUIDAnonymity;
    siteProperties.globalCookieTimeout = pubTokenAttributes.globalCookieTimeout;
    siteProperties.globalBannerEnabled = pubTokenAttributes.globalBannerEnabled;
    siteProperties.cookieTimeOut = pubTokenAttributes.cookieTimeOut;
    siteProperties.honorDNT = pubTokenAttributes.honorDNT;

    //Set default visitor anonymity setting as OFF
    if (typeof siteProperties.visitorUUIDAnonymity === "undefined") {
      siteProperties.visitorUUIDAnonymity = 0;
    }

    //if undefined setting honorDNT to true
    if(siteProperties.honorDNT === undefined) {
      siteProperties.honorDNT = 1;
    }

    //Delete all the existing cookies if anonymity is ON
    if (siteProperties.visitorUUIDAnonymity) {swa.deleteCookies();}

    //Set owner property based on it's type - function or attribute
    if (typeof swa.owner == "function") {swa.siteOwner = swa.owner();} else {swa.siteOwner = swa.owner;}

    //For internal users whose visitor anonymity setting is off, cookie timeout is the minimum of customer set timeout and space admin set timeout
    if (
      !siteProperties.visitorUUIDAnonymity &&
      siteProperties.internalApplicationUser
    ) {
      swa.cookieTimeoutForVisitor =
        siteProperties.cookieTimeOut <=
        siteProperties.globalCookieTimeout * 86400
          ? siteProperties.cookieTimeOut
          : siteProperties.globalCookieTimeout * 86400;
    } else {
      swa.cookieTimeoutForVisitor = siteProperties.cookieTimeOut;
    }

    //Banner property
    siteProperties.bannerEnabled = pubTokenAttributes.bannerEnabled;

    //Session timeout cannot be more than 24 hours
    if (swa.sessionCookieTimeout > 24 * 60 * 60) {
      console.warn(
        "Resetting session timeout to 1 day. Session timeout cannot be more than 1 day."
      );
      swa.sessionCookieTimeout = 24 * 60 * 60;
    }

    //If set as session is used, set cookie timeout as 30 mins
    if (swa.cookieTimeoutForVisitor / 86400 === -1 && swa.sessionCookieTimeout > 1800) {
      swa.sessionCookieTimeout = 1800;
      swa.cookieTimeoutForVisitor = (new Date("2099-12-31 23:59:59") - new Date()) / 1000; //Set cookie timeout as some future value as it is not relevant and visitor is reset for every new session,here, 31st Dec 2099
      swa.setAsSession = 1;
      console.warn("Resetting session timeout to 30 minutes. Session timeout cannot be more than 30 minutes if Set as Session in Site Management is turned on.");
    } else if (swa.cookieTimeoutForVisitor / 86400 === -1 && swa.sessionCookieTimeout <= 1800) {
      swa.setAsSession = 1;
      swa.cookieTimeoutForVisitor = (new Date("2099-12-31 23:59:59") - new Date()) / 1000; //Set timeout as some future value as it is not relevant and visitor is reset for every new session,here,31st Dec,2099
    }

    /**
     * Tracking is OFF by default except in some cases Case 1 - when anonymity
     * is off and banner is disabled by customer for internal users Case 2 -
     * when anonymity is ON Case 3 - If banner is used and consent is already
     * given
     */
    loggingEnabled = "N";

    //Web Gui Integration Scenario
    if (swa.isConsentGiven) {
      //check if cookies are present if present do not create just change the _swa_tracking_consent cookie value if changed
      var isswaCookieStored = isSWACookiePresent(document.cookie);
      var swaCookies = [];
      if (!isswaCookieStored) {
        swaCookies = getSWACookieValue(swa.parentCookies);
        //read and save the cookievalues
        var validUntil, expiryDate, i;
        for (i = 0; i < swaCookies.length; i++) {
          if (swaCookies[i].indexOf("_swa_tracking_consent") == 0) {
            validUntil = Date.now() + swa.cookieTimeoutForVisitor * 1000;
            expiryDate = new Date(parseInt(validUntil, 10));
            //If URL is secure, create secure cookies
            if (window.location.protocol === "https:") {
document.cookie =
                swaCookies[i] +
                "; expires=" +
                expiryDate.toUTCString() +
                "; path=/; secure";
} else {
document.cookie =
                swaCookies[i] +
                "; expires=" +
                expiryDate.toUTCString() +
                "; path=/;";
}
            document.cookie =
              "trackingConsentExpiry=" + expiryDate.toUTCString();
          }
        }
      } else {
        //modify tracking consent value
        swaCookies = getSWACookieValue(swa.parentCookies);
        deleteSWACookies("_swa_tracking_consent");
        for (i = 0; i < swaCookies.length; i++) {
          if (swaCookies[i].indexOf("_swa_tracking_consent") == 0) {
            //If URL is secure, create secure cookies
            if (window.location.protocol === "https:") {
document.cookie =
                swaCookies[i] +
                "; expires=" +
                swa.getCookieValue("trackingConsentExpiry") +
                "; path=/; secure";
} else {
document.cookie =
                swaCookies[i] +
                "; expires=" +
                swa.getCookieValue("trackingConsentExpiry") +
                "; path=/;";
}
          }
        }
      }
    }

    if (
      !siteProperties.visitorUUIDAnonymity &&
      !siteProperties.bannerEnabled &&
      !siteProperties.globalBannerEnabled &&
      siteProperties.internalApplicationUser &&
      !siteProperties.hasPersonalData
    ) {loggingEnabled = "I";} else if (siteProperties.visitorUUIDAnonymity) {loggingEnabled = "I";} else if (
      siteProperties.bannerEnabled &&
      swa.getCookieValue("_swa_tracking_consent." + swa.pubToken) == 1 &&
      !siteProperties.hasPersonalData
    ) {loggingEnabled = "I";} else if(swa.anonymousTrackingConsent ){
		loggingEnabled = "A";
		}

    //If banner is disabled, clear tracking cookie if any
    if (
      !siteProperties.bannerEnabled &&
      swa.getCookieValue("_swa_tracking_consent." + swa.pubToken) != null
    ) {
      deleteSWACookies("_swa_tracking_consent");
    }

    //Trigger an event when SWA Consent mechanism isn't used
    if ((siteProperties.internalApplicationUser && !siteProperties.bannerEnabled && siteProperties.globalBannerEnabled) || (!siteProperties.internalApplicationUser && !siteProperties.bannerEnabled)) {
      swa.triggerEvent("swaLoadSuccess", {});
    }

    if (typeof swa.dntLevel !== "undefined") {swa.swaDntLevel = swa.dntLevel;} else {swa.swaDntLevel = 1;}

    if (pubTokenAttributes.ui5Events == 1) {whiteListUI5Events();}

    if (siteProperties.bannerEnabled && !siteProperties.visitorUUIDAnonymity && !siteProperties.hasPersonalData) {
      //If cookie consent exists, do not show the banner
      if (swa.getCookieValue("_swa_tracking_consent." + swa.pubToken) == null && swa.consentOnLoad && !swa.isConsentGiven) {
        //Delete existing cookies if any
        swa.deleteCookies();
        //Show the banner to get cookie consent
        if (swa.consentOnLoad) {
          //Delay banner/popup display for 5 seconds
          if (
            swa.consentStyle == "banner" ||
            swa.consentStyle == "bannerbottom"
          ) {
            window.setTimeout(function() {
              addBanner();
              swa.jQuery(".swa_banner").slideDown();
            }, 5000);
          } else {
            window.setTimeout(function() {
              addBanner();
              swa.jQuery("#swa_background").fadeTo(500, 0.8);
              swa.jQuery("#swa_consentform").fadeIn(500);
            }, 5000);
          }
        }
      } else if (swa.setAsSession) {
          //If set as session is ON, banner is enabled and tracking decision is deny/defer, show banner every 24 hours or on browser close, whichever is earlier
          if (siteProperties.bannerEnabled && swa.getCookieValue("_swa_tracking_consent." + swa.pubToken) != "1" && swa.consentOnLoad && !swa.isConsentGiven) {
            //Show banner if 24 hours have passed from the time the last tracking consent was given
            var createdTime = swa.getCookieValue("_swa_tracking_consent." + swa.pubToken).slice(2);
            if (new Date() / 1000 - createdTime >= 86400) {
              //Delete existing cookies if any
              swa.deleteCookies();
              //Delay banner display by 5 seconds to handle applications which take time to load
              window.setTimeout(function() {
                //Show the banner to get cookie consent
                addBanner();
                swa.jQuery(".swa_banner").slideDown();
              }, 5000);
            }
          }
        }
    }

    if (swa._isUI5() && parseFloat(sap.ui.version) >= 1.86 && !swa.getCookieValue("_swa_pref." + swa.pubToken)) {
      if(pref.cri && pref.cri != 0){
        var validity = Date.now() + (pref.cri * 24 * 60 * 60 * 1000);
        var expDate = new Date(parseInt(validity, 10));
        delete pref.pt;
        var cookie = "_swa_" + "pref." + swa.pubToken + "=" + encodeURIComponent(JSON.stringify(pref)) + "; expires=" + expDate.toUTCString();

        cookie += window.location.protocol === "https:" ? "; path=/; secure" : "; path=/;";
        document.cookie = cookie;
      }
    }
    swa.tracker_init();
  }

  swa.triggerEvent = function(eventName, params) {
    //Non-IE Browsers
    var customEvent;
    if (typeof window.CustomEvent === "function") {
      customEvent = new CustomEvent(eventName, params);
      window.dispatchEvent(customEvent);
    } else {
      customEvent = document.createEvent("CustomEvent");
      customEvent.initCustomEvent(eventName, false, false, params);
      window.dispatchEvent(customEvent);
    }
  };

  swa.ajaxRequest = function(URL, method) {
    var requestPromise = new Promise(function(resolve) {
      if (swa.jQuery) {
        swa.jQuery.ajax({
          url: URL,
          type: method,
          cache: false,
          success: function(response) {
            resolve(response);
          },
          error: function(response) {
            console.log("Error" + JSON.stringify(response));
          }
        });
      }
    });

    return requestPromise;
  };

  /**
   * Called in case of No-No. Handles various scenarios like browser dnt, banner &
   * cookie
   */
  swa.tracker_init = function() {
    if ((loggingEnabled == "I" || loggingEnabled == "A") && !swa.loggerLoaded) {
      swa.loadLogger();
    }
  };

  function enableHeartbeat() {
    if (isHeartBeatEnabled) {
      window.addEventListener("focus", _swaAppOnFocus);
      _paq.push(["enableHeartBeatTimer", heartBeatInterval]);
    }
  }

  /*window.postload = function(){
	//Send Custom Event on XHR Request completion - only if tracking is enabled
		var params = {detail: {"requestUrl": window.sUrl, "requestMethod": window.sMethod, "responseTime": new Date().getTime() - window.startTime, "responseStatus": this.status}};
		//Non-IE Browsers
		var xhrEvent = "";
		if (typeof window.CustomEvent === "function" ){
			xhrEvent = new CustomEvent('xhr', params);
			window.dispatchEvent(xhrEvent);
		}
		else{
			xhrEvent = document.createEvent('CustomEvent');
			xhrEvent.initCustomEvent('xhr', false, false, params.detail);
			window.dispatchEvent(xhrEvent);
		}
}*/

  swa.loadLogger = function() {
    //If piwik is loaded already, return
    if (swa.loggerLoaded) {return;}

    var u = swa.baseUrl,
      l = swa._addScript;
    _paq.push(["setSiteId", swa.pubToken]);
    _paq.push(["setTrackerUrl", swa.loggingUrl + "bulkEventsPosting"]);
    _paq.push(["setDoNotTrack", !isTrackingAllowedBasedOnDNTSetting(siteProperties.honorDNT, (window.navigator.doNotTrack == "1" ? 1 : 0))]);
    _paq.push(["setCookieNamePrefix", "_swa_"]);
    _paq.push(["alwaysUseSendBeacon", true]);
    _paq.push(["setRequestMethod", "POST"]);
    //If URL is secure, create secure cookies
    if (window.location.protocol === "https:") {_paq.push(["setSecureCookie", true]);}

    //iFrame handling
    if(window.self !== window.top) {_paq.push(["setCookieSameSite", "None"]);}

    enableHeartbeat();
    _paq.push([
      "setCustomRequestProcessing",
      function(data) {
        //Check the request string already prepared by Piwik for this event, if we need to manually do some adjustments. Adjustments will be made in these cases:
        //1) page title reported by Piwik does not match the current title
        //2) URL reported by Piwik does not match the current URL or the URL needs change by a defined swa.urlFormatterCallback function.
        //3) Referrer reported by Piwik does not match the current referrer or the referrer needs change by a defined swa.urlFormatterCallback function. If correction is needed, we will have to rebuild the request stringand replace URL set by Piwik.
        if (data) {
          if(loggingEnabled == "A") {deleteSWACookies("_swa_id");}

          //Parse key value pairs from Piwik's request string (should contain
          //param with key "url" and "pageTitle")
          var reportedParams = {};
          var reportedParamPairs = data.split("&");
          for (var i = 0; i < reportedParamPairs.length; i++) {
            var reportedParamPair = reportedParamPairs[i].split("=");
            if(reportedParamPair[0] !== undefined && reportedParamPair[0] !== "" && reportedParamPair[1] !== undefined && reportedParamPair[1] !== "") {reportedParams[decodeURIComponent(reportedParamPair[0].replace(/\+/g, "%20"))] = decodeURIComponent(reportedParamPair[1].replace(/\+/g, "%20"));}
          }
          //for (var paramName in reportedParams) {
          //console.log("setCustomRequestProcessing - reportedParams: " +
          //paramName + "=" + reportedParams[paramName]);
          //}

          //Do we need to rebuild query string?
          var rebuildData = false;

          //Check URL
          if (window && window.location) {
            //Get the current URL as reported by the browser
            var currentURL = window.location.href;
            //console.log("setCustomRequestProcessing - currentURL: " +currentURL);
            //If swa.urlFormatterCallback is defined, call it with current URL and signal it's the URL of the page
            if (typeof swa.urlFormatterCallback === "function") {
              //console.log("setCustomRequestProcessing - calling swa.urlFormatterCallback for page URL");
              currentURL = swa.urlFormatterCallback(currentURL, "page");
              //console.log("setCustomRequestProcessing - page URL received from callback: " + currentURL);
            }
            //Check if param "url" exists and if it has the same value asthe current (or changed) URL
            if ("url" in reportedParams) {
              //console.log("setCustomRequestProcessing - Piwik's reported URL: " + reportedParams.url);
              if (reportedParams.url != currentURL) {
                //console.log("setCustomRequestProcessing - mismatch: Reported URL does not match current URL!!!");Obviously Piwik is wrong about the current URL. So first we update current URL in Piwik.
                if (typeof Piwik !== "undefined")
                  /* global Piwik */
                  {Piwik.getAsyncTracker().setCustomUrl(currentURL);}
                //Second, we correct the URL in the current event
                reportedParams.url = currentURL;
                //And we signal that query string needs to be rebuild
                rebuildData = true;
              }
            }
          }

          //Check referrer
          var currentReferrer = "";

          if (currentPageUrl != "" && currentPageUrl != reportedParams.url) {
            currentReferrer = currentPageUrl;
            currentPageUrl = reportedParams.url;
          } else {
            currentPageUrl = reportedParams.url;
          }

          if (swa.referrerOfTop) {
            //console.log("setCustomRequestProcessing - swa.referrerOfTopis true");Get the current referrer the same way as Piwik tries to get it
            try {
              currentReferrer = window.top.document.referrer;
              //console.log("setCustomRequestProcessing - window.top.document.referrer: " + currentReferrer);
            } catch (e) {
              //Ignore
            }
            if (currentReferrer === "") {
              try {
                currentReferrer = window.parent.document.referrer;
                //console.log("setCustomRequestProcessing -window.parent.document.referrer: " +currentReferrer);
              } catch (e) {
                //Ignore
              }
            }
          }
          if (currentReferrer === "" && document) {
            currentReferrer = document.referrer;
            //console.log("setCustomRequestProcessing - document.referrer:" + currentReferrer);
          }
          //console.log("setCustomRequestProcessing - currentReferrer: " +currentReferrer);If swa.urlFormatterCallback is defined, call it with current referrer and signal it's the URL of the referrer
          if (typeof swa.urlFormatterCallback === "function") {
            //console.log("setCustomRequestProcessing - calling swa.urlFormatterCallback for referrer URL");
            currentReferrer = swa.urlFormatterCallback(
              currentReferrer,
              "referrer"
            );
            //console.log("setCustomRequestProcessing - referrer URL received from callback: " + currentReferrer);
          }
          //Check if param "urlref" exists and if it has the same value as the current (or changed) referrer
          if ("urlref" in reportedParams) {
            //console.log("setCustomRequestProcessing - Piwik's reported referrer: " + reportedParams.urlref);
            if (reportedParams.urlref != currentReferrer) {
              //console.log("setCustomRequestProcessing - mismatch: Reported referrer does not match current referrer!!!"); Obviously Piwik is wrong about the current referrer. So first we update current referrer in Piwik.
              if (typeof Piwik !== "undefined") {Piwik.getAsyncTracker().setReferrerUrl(currentReferrer);}
              //Second, we correct the referrer in the current event
              reportedParams.urlref = currentReferrer;
              //And we signal that query string needs to be rebuild
              rebuildData = true;
            }
          } else if (currentReferrer != "") {
              reportedParams.urlref = currentReferrer;
            }

          //Check page title
          if (document) {
            //Note: This also works if document.title is dynamically changed
            var titleTags = document.getElementsByTagName("title");
            if (titleTags.length > 0) {
              var currentPageTitle = titleTags[0].innerHTML;
              //console.log("setCustomRequestProcessing - currentPageTitle: " + currentPageTitle); Check if param "pageTitle" exists and if it has the same value as the current page title
              if ("pageTitle" in reportedParams) {
                //console.log("setCustomRequestProcessing - Piwik's reported page title: " + reportedParams.pageTitle);
                if (reportedParams.pageTitle != currentPageTitle) {
                  //Obviously Piwik is wrong about the current page title, so first we update current title in Piwik.
                  if (typeof Piwik !== "undefined") {Piwik.getAsyncTracker().setDocumentTitle(currentPageTitle);}
                  //console.log("setCustomRequestProcessing - mismatch: Reported page title does not match current page title!!!"); Second, we correct the page title in the current event
                  reportedParams.pageTitle = currentPageTitle;
                  //And we signal that query string needs to be rebuild
                  rebuildData = true;
                }
              }
            }
          }

          //Delete visitor info if tracking is done anonymously
          if(siteProperties.visitorUUIDAnonymity || (swa.anonymousTrackingConsent &&  loggingEnabled == 'A' && (swa.getCookieValue("_swa_tracking_consent." + swa.pubToken) == null || swa.getCookieValue("_swa_tracking_consent." + swa.pubToken) != 1) )){
            delete reportedParams._id;
            //Signal that query string needs to be rebuild
            rebuildData = true;
          }

          if (!siteProperties.hasCustomFields) {
            reportedParams = removeCustomFields(reportedParams);
            rebuildData = true;
          }

          //If visitor anonymity if OFF and visitor cookie timeout is set as session, reset visitor for every session
          if((!siteProperties.visitorUUIDAnonymity && swa.setAsSession && window.localStorage.getItem('id_vc.' + swa.pubToken) > "1") || (loggingEnabled == 'A' && window.localStorage.getItem('id_vc.' + swa.pubToken) > "1") ){
            resetVisitor(); //Create a new visitor
            rebuildData = true;
            window.localStorage.setItem('id_vc.' + swa.pubToken, 1); //Setting current event's visit count to 1
          }

          //If banner is enabled, show banner on every session increment
          if (!swa.anonymousTrackingConsent && !siteProperties.visitorUUIDAnonymity && siteProperties.bannerEnabled && swa.getCookieValue("_swa_tracking_consent." + swa.pubToken) == null && !siteProperties.hasPersonalData && swa.consentOnLoad && !swa.isConsentGiven) {
            loggingEnabled = "N";
            if (window.cXMLHttpRequest) {window.cXMLHttpRequest.enableTracking = false;}

            window.setTimeout(function() {
              addBanner();
              swa.jQuery(".swa_banner").slideDown();
            });
            return;
          }

          //Check for the dataAnonymiseCallback existence
          if (typeof swa.dataAnonymiseCallback === "function") {
            var anonymCollection;
            anonymCollection = swa.dataAnonymiseCallback(reportedParams);

            //If customer anonymized any properties, update them to parameter list
            if (
              typeof anonymCollection === "object" &&
              Object.keys(anonymCollection).length > 0
            ) {
              swa.anonymization(anonymCollection, reportedParams);
              rebuildData = true;
            }
          }

          //Add query params to Override Server side anonymization
          if (swa.overrideServerAnonymization) {
            if (
              AnonymizationConfigurations.overrideClientPrefAnonymity &&
              AnonymizationConfigurations.clientPrefAnonymityServerVal &&
              typeof swa.clientPrefAnonymityEnabled !== "undefined"
            ) {
              reportedParams["clientPrefAnonymity"] =
                swa.clientPrefAnonymityEnabledVal;
            }

            if (
              AnonymizationConfigurations.overrideClientSpecsAnonymity &&
              AnonymizationConfigurations.clientSpecsAnonymityServerVal &&
              typeof swa.clientSpecsAnonymityEnabled !== "undefined"
            ) {
              reportedParams["clientSpecsAnonymity"] =
                swa.clientSpecsAnonymityEnabledVal;
            }

            if (
              AnonymizationConfigurations.overrideCreatedTimeAnonymity &&
              AnonymizationConfigurations.createdTimeAnonymityServerVal &&
              typeof swa.createdTimeAnonymityEnabled !== "undefined"
            ) {
              reportedParams["createdTimeAnonymity"] =
                swa.createdTimeAnonymityEnabledVal;
            }

            if (
              AnonymizationConfigurations.overrideLocationAnonymity &&
              AnonymizationConfigurations.locationAnonymityServerVal &&
              typeof swa.locationAnonymityEnabled !== "undefined"
            ) {
              reportedParams["locationAnonymity"] =
                swa.locationAnonymityEnabledVal;
            }

            rebuildData = true;
          }

          //If we did any corrections to the parameters, we need to rebuild the query string
          if (rebuildData === true) {
            var newReportedParams = [];
            for (var paramName in reportedParams) {
              if (Object.prototype.hasOwnProperty.call(reportedParams, paramName)) {
                newReportedParams.push(
                  encodeURIComponent(paramName) +
                    "=" +
                    encodeURIComponent(reportedParams[paramName])
                );
              }
            }
            data = newReportedParams.join("&");
          }

          //Send id_vc as part of the request when anonymity is OFF
          if(loggingEnabled !== "A") {data = data.concat("&" + encodeURIComponent("_idvc") + "=" + encodeURIComponent(parseInt(window.localStorage.getItem('id_vc.' + swa.pubToken))));}

          //send owner as part of ping
          if(Object.prototype.hasOwnProperty.call(reportedParams, "ping")){
            data = data.concat("&user=" + swa.siteOwner);
          }
          //Pass query string back to Piwik, which will then send it to the server
          return data;
        }
      }
    ]);

    if (typeof swa.sessionCookieTimeout !== "undefined") {
      _paq.push(["setSessionCookieTimeout", swa.sessionCookieTimeout]);
    }
    //Commenting this code to stop visitor timeout from updating on every library load (if timeout is changed)
    // if (typeof swa.cookieTimeoutForVisitor !== "undefined") {
    //   _paq.push(["setVisitorCookieTimeout", swa.cookieTimeoutForVisitor]);
    // }
    if (typeof swa.referralCookieTimeout !== "undefined") {
      _paq.push(["setReferralCookieTimeout", swa.referralCookieTimeout]);
    }

    if (!swa.cookiesEnabled) {_paq.push(["disableCookies"]);}
    if (!window.Piwik) {
      u = loadPiwikUrl();
      l(u, function() {
        loadSWAPiwikPlugin(u);
      });
    } else {
      loadSWAPiwikPlugin();
    }
    swa.loggerLoaded = true;
  };

  //Function delete custom fields
  function removeCustomFields(params) {
    for (var i = 1; i <= 10; i++) {
      if (params["custom" + i] != undefined) {delete params["custom" + i];}
    }
    return params;
  }

  //Function to retrieve cookie value
  swa.getCookieValue = function(cookie_name) {
    var c_value = document.cookie;
    var c_end, c_start;
    if(cookie_name.indexOf("_swa_id") !== -1) {c_start = c_value.indexOf(cookie_name);} else {c_start = c_value.indexOf(" " + cookie_name + "=");}
    if (c_start == -1) {c_start = c_value.indexOf(cookie_name + "=");}
    if (c_start == -1) {
      c_value = null;
    } else {
      c_start = c_value.indexOf("=", c_start) + 1;
      c_end = c_value.indexOf(";", c_start);
      if (c_end == -1) {c_end = c_value.length;}
      c_value = unescape(c_value.substring(c_start, c_end));
    }

    return c_value;
  };

  function createSWACookie(cookieName, cookieVal) {
    /**
     * If it is a consent cookie and the user accepts/denies giving the consent,
     * create the cookie with user defined expiry. If the user defers the
     * decision, cookie is created with default expiry, (i.e) the validity of
     * the cookie will be the session. Cookie value 1 means user has consented
     * to store cookie, 0 means user has denied and 2 means user has deferred
     * the decision until the next session
     */
    var validUntil, expiryDate;
    if (cookieName == "tracking_consent") {
      //If visitor cookie timeout is set as session, create a cookie with session expiry
      if (swa.setAsSession == 1) {
        if (cookieVal == 0 || cookieVal == 2) {
cookie =
            "_swa_" +
            cookieName +
            "." +
            swa.pubToken +
            "=" +
            cookieVal +
            "." +
            new Date() / 1000;
} else {cookie = "_swa_" + cookieName + "." + swa.pubToken + "=" + cookieVal;}
      } else if (cookieVal == 1) {
          validUntil = Date.now() + swa.cookieTimeoutForVisitor * 1000;
          expiryDate = new Date(parseInt(validUntil, 10));

          cookie =
            "_swa_" +
            cookieName +
            "." +
            swa.pubToken +
            "=" +
            cookieVal +
            "; expires=" +
            expiryDate.toUTCString();
        }
        //Create a cookie with expiry as defer cookie timeout(if any) provided the user has denied giving consent
        else if (cookieVal == 0 && swa.deferCookieTimeout != undefined) {
          validUntil = Date.now() + swa.deferCookieTimeout * 1000;
          expiryDate = new Date(parseInt(validUntil, 10));
          cookie =
            "_swa_" +
            cookieName +
            "." +
            swa.pubToken +
            "=" +
            cookieVal +
            "; expires=" +
            expiryDate.toUTCString();
        } else {cookie = "_swa_" + cookieName + "." + swa.pubToken + "=" + cookieVal;}

      //If URL is secure, create secure cookies
      cookie += (window.location.protocol === "https:") ? "; path=/; secure" : "; path=/;";

      if(window.self !== window.top) {cookie = cookie.replace("secure","SameSite=None;secure");}

      document.cookie = cookie;
    } else {
      var cookie =
        "_swa_" +
        cookieName +
        "." +
        swa.pubToken +
        "=" +
        cookieVal +
        "; path=/;";
      //If URL is secure, create secure cookies
      if (window.location.protocol === "https:") {cookie += " secure";}

      document.cookie = cookie;
    }
  }

  function resetVisitor() {
    _paq.push(["deleteCookies"]); //Reset visitor cookie
    swa.deleteCookies(); //Deletes rest of the cookies
  }

  function loadSWAPiwikPlugin() {

    loadPlugin(function() {
      Piwik.addPlugin("swa", swa.plugin);
      if (swa.logger) {
        if(siteProperties.visitorUUIDAnonymity){
          Piwik.getAsyncTracker().disableCookies(); //No cookies stored when anonymity is ON
          loggingEnabled = "A";
        } else if(swa.anonymousTrackingConsent && (swa.getCookieValue("_swa_tracking_consent." + swa.pubToken) == null || swa.getCookieValue("_swa_tracking_consent." + swa.pubToken) != 1)){
          loggingEnabled = "A";
        } else{
          loggingEnabled = "I";
        }
        swa.trackLoad();

        swa.logger = false;

        if (swa._isUI5()) {
          loggedUrl = window.location.href;

        //Setting this flag to true so that the first RouteMatched event will be ignored
          routeMatchedDisabled = true;
        }
      }

      //Trigger callback for "everything for tracking is loaded now - tracker ready" (if it exists). Check if swa object has a function in property "trackerReadyCallback" - if yes, call it.
      if (typeof swa.trackerReadyCallback === "function") {
        try {
          swa.trackerReadyCallback();
        } catch (ex) {
          //Ignore exceptions
        }
      }
    });
  }

  function loadPlugin(callback) {
    addPluginContextToSWA();

    addPluginEventHandlers();

    callback();
  }

  function addPluginEventHandlers() {
    //Attach event handler to automatically send click events
    var elements = swa.jQuery("*");
    if (swa.trackFrames === true) {
      //Add the root HTML elements within iframes that don't match the frameExclusionSelector.
      swa.jQuery.each(
        swa.jQuery("iframe:not('" + swa.frameExclusionSelector + "')"),
        function(name, frame) {
          try {
            elements.push(
              swa
                .jQuery(frame)
                .contents()
                .find("html")[0]
            );
          } catch (err) {
            //Accessing the contents of an iframe that is not from the same origin (cross-origin frame) throws a SecurityError.See https://en.wikipedia.org/wiki/Same-origin_policy We cannot register tracking event handlers to cross-origin frames.
          }
        }
      );
    }

    var elementSelector = ":not('.swa_ignore')"; //ignore elements with class='swa_ignore'
    swa.jQuery(elements).on("click.swa", elementSelector, function(event) {
      //This function is only triggered by elements matching the elementSelector.
      if ((loggingEnabled == "I" || loggingEnabled == "A") && swa.clicksEnabled) {
        //Ensure that the DOM element that triggers the event is the one that has been clicked,i.e. not an ancestor, in case the clicked element does not match the elementSelector.
        if (this === event.target) {
          //Ensure we do not track events more than once, if the click event bubbles
          if (previous.timeStamp !== event.timeStamp) {
            previous.timeStamp = event.timeStamp;
            //save element to the queue for later use in the plugin code
            swa.plugin.clickedElements.push(event);
            canSessionIncrement(); //Check if visit count should be incremented
            batchRequests(event); //Add event to the batch
          }
        }
      }
    });

    //Attach event handler to automatically send keypress/hotkey events
    swa.jQuery(window).keydown(function(e) {
      if (swa.hotkeysEnabled && (e.ctrlKey || e.altKey) && (e.keyCode !== 17 && e.keyCode !== 18)) {
        //Ensure key is not ctrl or alt
        swa.plugin.clickedElements.push(e);
        canSessionIncrement(); //Check if visit count should be incremented
        batchRequests(e, "keypress", false);
      }
    });
  }

  function batchRequests(data, eventType, isCustom){
    var type = (eventType !== undefined && eventType !== "") ? eventType : "click"; //If no type is specified, default is click
    var request = (isCustom ? "e_c=" + type + "&e_a=" + data : "event_type=" + type).concat(isCustom ? swa.plugin.event() : swa.plugin.link()); //Because some data is appended twice to the request
    Piwik.getAsyncTracker().queueRequest(request);
  }

  function addPluginContextToSWA() {
    swa.plugin = {
      //The log function is called when a page load event is logged.
      log: function() {
        swa.currentEvent = "load";
        var result = swa.plugin._getCommons();
        result["element_type"] = "page";
        result["event_type"] = "load";
        result["page_load_time"] = swa.plugin._getPageLoadTime();
        result["page_content_time"] = swa.plugin._getPageContentTime();
        //FOR TESTING PURPOSES. DO NOT MODIFY COMMENT/DELETE WHEN NOT IN  TEST MODE @@@___@@@
        if (swa.test && typeof parent.window.swa_tests === "function") {parent.window.swa_tests("load", result);}
        //@@@___@@@
        //END OF TEST STATEMENT
        return "&" + swa.jQuery.param(result);
      },

      //The link function is called if a click or hotkey event is logged.
      link: function() {
        swa.currentEvent = "click";
        var pl = swa.plugin;
        //get element from the queue that was inserted in the logging code
        var event = pl.clickedElements.shift();
        var element = swa._isUI5() ? event.target : event.currentTarget;
        var result = pl._getCommons();
        //Experimental feature for key strokes
        if (event.ctrlKey || event.altKey) {
          result["element_id"] = String.fromCharCode(event.keyCode);
          result["element_type"] = "Hotkey press";
          result["element_text"] = event.ctrlKey
            ? "Ctrl + " + String.fromCharCode(event.keyCode)
            : "Alt + " + String.fromCharCode(event.keyCode);
          result["xpath"] = "";
          result["clickX"] = 0;
          result["clickY"] = 0;
          result["elementX"] = 0;
          result["elementY"] = 0;
          result["clickTime"] = Math.round(+new Date() / 1000);
          result["elementWidth"] = 0;
          result["elementHeight"] = 0;
        } else if (typeof element !== "undefined") {
            var type = element.tagName.toLowerCase();
            result["element_id"] = element.id;
            result["element_type"] = type;
            if (
              element.type !== "password" &&
              !swa.jQuery(element).is(swa.textExclusionSelector)
            ) {
              result["element_text"] = pl
                ._getElementText(element)
                .substring(0, varlength);
            }
            result["xpath"] = pl._getXpath(element);
            result["clickX"] = Math.round(event.pageX);
            result["clickY"] = Math.round(event.pageY);
            result["elementX"] = Math.round(swa.jQuery(element).offset().left);
            result["elementY"] = Math.round(swa.jQuery(element).offset().top);
            result["clickTime"] = Math.round(+new Date() / 1000);
            result["elementWidth"] = Math.round(
              swa.jQuery(element).outerWidth()
            );
            result["elementHeight"] = Math.round(
              swa.jQuery(element).outerHeight()
            );
          //check if not same domain
            if (type == "a" && element.href && isLinkBelongToSameDomain(element.href)) {result["target_url"] = element.href;}
          }
        //FOR TESTING PURPOSES. DO NOT MODIFY COMMENT/DELETE WHEN NOT IN
        //TEST MODE
        //@@@___@@@
        if (swa.test && typeof parent.window.swa_tests === "function") {parent.window.swa_tests("click", result);}
        //@@@___@@@
        //END OF TEST STATEMENT
        return "&" + swa.jQuery.param(result);
      },

      //The event function is called if a custom event has manually been triggered that should be logged.
      event: function() {
        swa.currentEvent = "custom";
        var i,
          tmpString,
          result = swa.plugin._getCommons();
        result["event_type"] = "custom";
        result["element_type"] = "event";
        //The function "swa.trackCustomEvent" will store the additional
        //values for a custom event
        // as an array (0 to 29 elements) in the
        // swa.plugin.customEventAddValues array when called.
        // So here we take the first element from that array and loop its
        // elements.
        var additionalValues = swa.plugin.customEventAddValues.shift();
        // Under normal circumstances "additionalValues" should never be
        // undefined, but if someone
        // used Piwik's "trackEvent" function manually instead of SWA's
        // "trackCustomEvent" function,
        // then there might be no array in swa.plugin.customEventAddValues,
        // and "additionalValues"
        // would be "undefined". So we just check...
        if (typeof additionalValues !== "undefined") {
          for (i = 0; i < additionalValues.length; i++) {
            //Strip out undefined, null or empty strings
            if (
              typeof additionalValues[i] !== "undefined" &&
              additionalValues[i] !== null
            ) {
              tmpString = String(additionalValues[i]).trim();
              if (tmpString.length > 0) {
                // "customEventValue2" is sumbitted in URL param
                // "e_2", "customEventValue3" is sumbitted in URL
                // param "e_3", etc. pp.
                result["e_" + (i + 2)] = tmpString;
              }
            }
          }
        }

        //update additional integer custom event values
        var additionalIntegerValues = swa.plugin.customEventIntAddValues.shift();
        if (typeof additionalIntegerValues !== "undefined") {
          for (i = 0; i < additionalIntegerValues.length; i++) {
            // Strip out undefined, null or empty strings
            if (
              typeof additionalIntegerValues[i] !== "undefined" &&
              additionalIntegerValues[i] !== null
            ) {
              tmpString = String(additionalIntegerValues[i]).trim();
              if (tmpString.length > 0) {
                // "customEventIntValue2" is sumbitted in URL param
                // "e_int_2", "customEventIntValue3" is sumbitted in
                // URL param "e_int_3", etc. pp.
                result["e_int_" + (i + 1)] = tmpString;
              }
            }
          }
        }

        //Update ajax event values to the event
        var ajaxEventValues = swa.plugin.ajaxEventValues;
        if (typeof ajaxEventValues !== undefined) {
          var isDocumentMode = !!document.documentMode;
          if (isDocumentMode) {
            // IE Support
            //Strip out undefined, null or empty strings
            Object.keys(ajaxEventValues).map(function(e) {
              if (
                ajaxEventValues[e] !== undefined &&
                ajaxEventValues[e] !== null
              ) {
                tmpString = String(ajaxEventValues[e]).trim();
                if (tmpString.length > 0) {
                  result[e] = tmpString;
                }
              }
            });
          } else {
            //Non-IE Browsers
            for (i = 0; i < Object.keys(ajaxEventValues).length; i++) {
              //Strip out undefined, null or empty strings
              if (
                typeof Object.values(ajaxEventValues)[i] !== "undefined" &&
                Object.values(ajaxEventValues)[i] !== null
              ) {
                tmpString = String(Object.values(ajaxEventValues)[i]).trim();
                if (tmpString.length > 0) {
                  result[Object.keys(ajaxEventValues)[i]] = tmpString;
                }
              }
            }
          }
        }

        // FOR TESTING PURPOSES. DO NOT MODIFY COMMENT/DELETE WHEN NOT IN
        // TEST MODE
        // @@@___@@@
        if (swa.test && typeof parent.window.swa_tests === "function") {parent.window.swa_tests("custom", result);}
        // @@@___@@@
        //END OF TEST STATEMENT
        return "&" + swa.jQuery.param(result);
      },

      _getXpath: function(element) {
        var xpath = "";
        var el = element;
        for (; el && el.nodeType == 1; el = el.parentNode) {
          var id =
            swa
              .jQuery(el.parentNode)
              .children(el.tagName)
              .index(el) + 1;
          id = id > 1 ? "[" + id + "]" : "";
          xpath = "/" + el.tagName.toLowerCase() + id + xpath;
        }
        return xpath;
      },

      //Build the URL parameters that should occur in any request.
      _getCommons: function() {
	//these fields cannot be undefined so added no check
        var result = {
          timezone: new Date().getTimezoneOffset(),
          locale: navigator.language
            ? navigator.language
            : navigator.browserLanguage,
          pageTitle: document.title,
          pageWidth: swa.jQuery(window).width(),
          pageHeight: swa.jQuery(window).height()
        };

        // Append owner information if owner is not undefined
         if(swa.siteOwner != undefined) {result.user = swa.siteOwner;}

        //If swa object has a value for "subSiteId" then include this as param "idsitesub"
        if (typeof swa.subSiteId !== "undefined") {result.idsitesub = swa.subSiteId;}
        //Fetch custom field values 1-10
        for (var i = 0; i < 10; i++) {
          var customid = "custom" + String(i + 1); //Get name of costom field -"customX"
          var func = swa.plugin._getCustomvalues(i + 1); //Get array [swa.customX.ref,swa.customX.params,swa.customX.isStatic]
          if (func === null)
            // If nothing declared for swa.customX, go to next loop iteration
            {continue;}
          if (typeof func[0] === "function") {
            //ref passed is a function, we pass it on in the result array.result[customid] = func[0];
            result[customid] = func[0].apply(null, func[1]);
          } else {
            //Only try to convert customX.ref to a function, if customX.isStatic is false or not set
            if (!func[2]) {
              //If ref is not a function, check if window scope has a function with the name provided
              var fn = window[func[0]];
              if (typeof fn === "function") {
                result[customid] = fn.apply(null, func[1]);
              } else {
                //We got neither a function, nor the name of a function in scope windows, so just pass on whatever it is (e.g. static string).
                result[customid] = func[0];
              }
            } else {
              //If customX.isStatic is true, don't try to convert func[0] to a function, but just pass it on
              result[customid] = func[0];
            }
          }
        }
        return result;
      },

      _getPageLoadTime: function() {
        var timing;

        if (!window.performance) {return null;}

        timing = window.performance.timing;

        if (!timing) {return null;}

        return timing.loadEventEnd - timing.requestStart;
      },

      _getPageContentTime: function() {
        var timing;

        if (!window.performance) {return null;}

        timing = window.performance.timing;

        if (!timing) {return null;}

        return timing.domContentLoadedEventEnd - timing.requestStart;
      },

      //Check if the element has TEXT content, otherwise it checks for a title or a VALUE attribute.
      _getElementText: function(element) {
        var el = swa.jQuery(element);
        if (el.text().length > 0) {return el.text();}
        return el.attr("title") ? el.attr("title") : el.val();
      },

      _getCustomvalues: function(id) {
        switch (id) {
          case 1:
            if (typeof swa.custom1 === "undefined") {break;}
            return [swa.custom1.ref, swa.custom1.params, swa.custom1.isStatic];
          case 2:
            if (typeof swa.custom2 === "undefined") {break;}
            return [swa.custom2.ref, swa.custom2.params, swa.custom2.isStatic];
          case 3:
            if (typeof swa.custom3 === "undefined") {break;}
            return [swa.custom3.ref, swa.custom3.params, swa.custom3.isStatic];
          case 4:
            if (typeof swa.custom4 === "undefined") {break;}
            return [swa.custom4.ref, swa.custom4.params, swa.custom4.isStatic];
          case 5:
            if (typeof swa.custom5 === "undefined") {break;}
            return [swa.custom5.ref, swa.custom5.params, swa.custom5.isStatic];
          case 6:
            if (typeof swa.custom6 === "undefined") {break;}
            return [swa.custom6.ref, swa.custom6.params, swa.custom6.isStatic];
          case 7:
            if (typeof swa.custom7 === "undefined") {break;}
            return [swa.custom7.ref, swa.custom7.params, swa.custom7.isStatic];
          case 8:
            if (typeof swa.custom8 === "undefined") {break;}
            return [swa.custom8.ref, swa.custom8.params, swa.custom8.isStatic];
          case 9:
            if (typeof swa.custom9 === "undefined") {break;}
            return [swa.custom9.ref, swa.custom9.params, swa.custom9.isStatic];
          case 10:
            if (typeof swa.custom10 === "undefined") {break;}
            return [
              swa.custom10.ref,
              swa.custom10.params,
              swa.custom10.isStatic
            ];
          default:
            return null;
        }
        return null;
      },

      //for event targets
      clickedElements: [],

      //for additional custom event values
      customEventAddValues: [],

      //for additional customer event values with Integer type
      customEventIntAddValues: [],

      //For AJAX events
      ajaxEventValues: {}
    };
  }

  //Anonymize given list of properties
  swa.anonymization = function(anonymCollection, reportedParams) {
    var eventMapper = getEventMapper();
    for (var prop in anonymCollection) {
      var propName = eventMapper[prop];
      if (propName != undefined) {reportedParams[propName] = anonymCollection[prop];}
    }
  };

  function _swaAppOnFocus() {
    swa.__validateVisitorCookie();
  }

  swa.__validateVisitorCookie = function() {
    if (siteProperties.visitorUUIDAnonymity) {
      var visitorInfo = Piwik.getAsyncTracker().getVisitorInfo();
      if (visitorInfo) {
        var lastVisitTimeStamp = new Date(parseInt(visitorInfo[5] + "000"));
        var createdTimeStamp = new Date(parseInt(visitorInfo[2] + "000"));
        var idleTime = (new Date() - lastVisitTimeStamp) / 1000;
        var durationSinceCreated = (new Date() - createdTimeStamp) / 1000;

        if (
          idleTime >= swa.sessionCookieTimeout - 5 ||
          durationSinceCreated >= 86400
        ) {
          _paq.push(["deleteCookies"]); //deletes existing tracking cookies to start the new visit
        }
      }
    }
  };

  function getEventMapper() {
    var mapper = {};

    //Clientside properties
    mapper.eventType = "event_type";
    mapper.locale = "locale";
    mapper.pageTitle = "pageTitle";
    mapper.pageUrl = "url";
    mapper.referrer = "urlref";

    mapper.xpath = "xpath";
    mapper.domElementTag = "element_type";

    //Remove special characters from text of clicked DOM element (if there is any text)
    mapper.domElementText = "element_text";

    mapper.domElementId = "element_id";
    mapper.domElementTargetUrl = "target_url";

    //this is derived from referrer & same will be handled in server side
    //referrerDomain: String(255);*/

    //handle with "res" parameter. Format ex: 1920x1028
    //for screenWidth & screenHeight, res value should be updated. Format
    //screenWidthxscreenHeight
    mapper.res = "res";

    //localTime is handled by h,m,s values of client
    //localTime: String(255);

    //Integer validation
    mapper.pageWidth = "pageWidth";
    mapper.pageHeight = "pageHeight";
    mapper.timezone = "timezone";
    mapper.localTimeHour = "h"; //localTime is handled by h,m,s values of client
    mapper.localTimeMinute = "m";
    mapper.localTimeSecond = "s";
    mapper.pageGenerationTime = "gt_ms";
    mapper.visitCount = "_idvc";
    mapper.clickX = "clickX";
    mapper.clickY = "clickY";
    mapper.domElementX = "elementX";
    mapper.domElementY = "elementY";
    mapper.domElementWidth = "elementWidth";
    mapper.domElementHeight = "elementHeight";
    mapper.clickTime = "clickTime"; //Validate long type

    //Boolean validation
    mapper.supportedSilverLight = "ag";
    mapper.supportedGears = "gears";
    mapper.supportedJava = "java";
    mapper.supportedFlash = "fla";
    mapper.supportedPdf = "pdf";
    mapper.supportedQt = "qt";
    mapper.supportedRealPlayer = "realp";
    mapper.supportedWma = "wma";
    mapper.supportedDirector = "dir";
    mapper.cookieEnabled = "cookie";

    return mapper;
  }

  swa.enable = function() {
    //Check if preferences call was successful
    if(!preferencesLoaded){
		console.error("The given pubtoken is invalid. Cannot invoke this function");
		return;
    }

    //check both site and browser's DNT settings
    if(!isTrackingAllowedBasedOnDNTSetting(siteProperties.honorDNT, (window.navigator.doNotTrack == "1" ? 1 : 0))) {
      console.error("You've enabled the 'Do Not Track' option. This allows you to request websites not to collect or track your browsing data. By default, SAP Web Analytics respects the browser's Do Not Track setting.");
      return;
    }
    //Do not track if tracking consent is not given
    if(!swa.anonymousTrackingConsent && !siteProperties.visitorUUIDAnonymity && siteProperties.bannerEnabled && !siteProperties.hasPersonalData && (swa.getCookieValue("_swa_tracking_consent." + swa.pubToken) == null || swa.getCookieValue("_swa_tracking_consent." + swa.pubToken) != 1)){
      console.error("Visitor yet to provide tracking consent. Cannot invoke swa.enable()");
      return;
    }
    if(loggingEnabled == "A" && !siteProperties.bannerEnabled){
      //call explicit load
      loggingEnabled = "I";
      swa.trackLoad();
    }
    if(siteProperties.visitorUUIDAnonymity){
      loggingEnabled = "A";
    } else if(swa.anonymousTrackingConsent && siteProperties.bannerEnabled && (swa.getCookieValue("_swa_tracking_consent." + swa.pubToken) == null || swa.getCookieValue("_swa_tracking_consent." + swa.pubToken) != 1)){
      loggingEnabled = "A";
    } else{
      loggingEnabled = "I";
    }

    //Check if session should be set/incremented whenever enable is called - handles both banner enabled and disabled cases.
    canSessionIncrement();

    if(window.cXMLHttpRequest) {window.cXMLHttpRequest.enableTracking = true;} //Enable XHR Tracking if XMLHttpRequest is loaded and initialized (case when banner is shown and consent is given but XML File isn't loaded
    enableHeartbeat();

    //Checking if piwik has been loaded.
    if (!swa.loggerLoaded) {
      swa.loadLogger();
    } else {Piwik.getAsyncTracker().setDoNotTrack(!isTrackingAllowedBasedOnDNTSetting(siteProperties.honorDNT, (window.navigator.doNotTrack == "1" ? 1 : 0)));}

    //FLP case, when enable is called, change the "Allow" check box state in user preferences area or if banner isn't used, set the text to Enabled/Disabled - based on tracking status
    if(window.sap.ui !== undefined){
      if(window.sap.ui.getCore().getControl("swaConsentCheckBox") !== undefined) {swa.getTrackingStatus() === true ? window.sap.ui.getCore().getControl("swaConsentCheckBox").setSelected(true) : window.sap.ui.getCore().getControl("swaConsentCheckBox").setSelected(false);} else if(window.sap.ui.getCore().getControl("swaStatusText") !== undefined) {swa.getTrackingStatus() === true ? window.sap.ui.getCore().getControl("swaStatusText").setText(swa.trackOnStatus) : (swa.getTrackingStatus() === false) ? window.sap.ui.getCore().getControl("swaStatusText").setText(swa.trackOffStatus) : window.sap.ui.getCore().getControl("swaStatusText").setText(swa.trackAnonymousStatus);}
    }
  };

  swa.disable = function() {
    loggingEnabled = "N";

    if(swa.anonymousTrackingConsent && !siteProperties.visitorUUIDAnonymity){
      loggingEnabled = "A";
}

    if(window.cXMLHttpRequest) {window.cXMLHttpRequest.enableTracking = false;} //Disable XHR Requests' tracking
    if(isHeartBeatEnabled){
      disableHeartbeat();
    }


    //FLP case, when disable is called, change the "Allow" check box state in user preferences area or if banner isn't used, set the text to Enabled/Disabled - based on tracking status
    if(window.sap.ui !== undefined){
      if(window.sap.ui.getCore().getControl("swaConsentCheckBox") !== undefined) {swa.getTrackingStatus() === true ? window.sap.ui.getCore().getControl("swaConsentCheckBox").setSelected(true) : window.sap.ui.getCore().getControl("swaConsentCheckBox").setSelected(false);} else if(window.sap.ui.getCore().getControl("swaStatusText") !== undefined) {swa.getTrackingStatus() === true ? window.sap.ui.getCore().getControl("swaStatusText").setText(swa.trackOnStatus) : (swa.getTrackingStatus() === false) ? window.sap.ui.getCore().getControl("swaStatusText").setText(swa.trackOffStatus) : window.sap.ui.getCore().getControl("swaStatusText").setText(swa.trackAnonymousStatus);}
    }
  };

  function disableHeartbeat() {
    window.removeEventListener("focus", _swaAppOnFocus);
    _paq.push(["enableHeartBeatTimer", 1800000]);
  }

  swa.trackLoad = function() {
    if ((loggingEnabled == "A" || loggingEnabled == "I") && swa.pageLoadEnabled && typeof Piwik !== "undefined"){
      var data = swa.plugin.log();
      data = data.slice(data.indexOf("&") + 1); //Remove additional "&" from data
      canSessionIncrement(); //Check if visit count should increment
      Piwik.getAsyncTracker().queueRequest(data);
    }
  };

  //Old manual click tracking function using (real) events
  swa.trackLink = function(event) {
    if (
      (loggingEnabled == "A" || loggingEnabled == "I") &&
      swa.clicksEnabled &&
      typeof Piwik !== "undefined"
    ) {
      swa.plugin.clickedElements.push(event);
      canSessionIncrement(); //Check if visit count should be incremented
      Piwik.getAsyncTracker().trackLink("click", "event_type", "", batchRequests);
    }
  };

  //New manual click tracking function using domElement and click coordinates
  swa.trackClick = function(element, x, y) {
    if (
      (loggingEnabled == "A" || loggingEnabled == "I") &&
      swa.clicksEnabled &&
      typeof Piwik !== "undefined"
    ) {
      var eventObj = {};
      if (typeof element !== "undefined") {
        if (swa._isUI5()) {
          eventObj.target = element;
        } else {
          eventObj.currentTarget = element;
        }
        if (typeof x !== "undefined") {
          eventObj.pageX = x;
        }
        if (typeof y !== "undefined") {
          eventObj.pageY = y;
        }
        swa.plugin.clickedElements.push(eventObj);
        Piwik.getAsyncTracker().trackLink("click", "event_type", "", batchRequests);
      }
    }
  };

  swa.trackCustomEvent = function(eventType, eventValue) {
    if (
      eventType == undefined ||
      String(eventType).length === 0 ||
      eventValue == undefined ||
      String(eventValue).length === 0
    ) {
      console.log("trackCustomEvent function call has invalid parameters list");
      return;
    }

    //If custom fields is OFF, clear the custom event values
    if (!siteProperties.hasCustomFields) {
      arguments[1] = clearCustomEventValues(arguments[1]);
      arguments[2] = clearCustomEventValues(arguments[2]);
    }

    if (
      (Array.isArray(arguments[1]) && arguments[1].length > 0) ||
      (Array.isArray(arguments[2]) && arguments[2].length > 0)
    ) {
      if (
        (loggingEnabled == "A" || loggingEnabled == "I") &&
        swa.customEventsEnabled &&
        typeof Piwik !== "undefined"
      ) {
        var additionalStringValues = [],
          additionalIntValues = [],
          isInvalidFormat = false;

        //More than 3 arguments in trackCustomEvent function are being
        //discarded if 2nd & 3rd parameters are array
        var maxStringArgs = arguments[1].length > 10 ? 10 : arguments[1].length;
        var maxIntegersArgs =
          arguments[2].length > 10 ? 10 : arguments[2].length;

        //update the string custom event values
        var stringCustomEventvalues = arguments[1];
        for (var i = 1; i < maxStringArgs; i++) {additionalStringValues.push(stringCustomEventvalues[i]);}

        //update the integer custom event values
        var integerCustomEventvalues = arguments[2];
        for (i = 0; i < maxIntegersArgs; i++) {
          if (
            Number.isInteger(integerCustomEventvalues[i]) ||
            !isNaN(parseInt(integerCustomEventvalues[i], 10))
          ) {
            additionalIntValues.push(parseInt(integerCustomEventvalues[i], 10));
          } else {
            isInvalidFormat = true;
            break;
          }
        }

        //Add the array "additionalStringValues" to the array "customEventAddValues" of our piwik plugin. When processing the custom event in the plugin, we will add the additional values to the request.
        swa.plugin.customEventAddValues.push(additionalStringValues);

        //Add the array "additionalIntValues" to the array "customEventIntAddValues" of our piwik plugin. When processing the custom event in the plugin, we will add the additional values to the request.
        swa.plugin.customEventIntAddValues.push(additionalIntValues);

        // Now send custom event using standard function "trackEvent" of
        // Piwik.
        // if string custom values array is empty, send an event with empty
        // string, so that if integer array exist those values will be
        // filled without fail
        if (!isInvalidFormat && !(stringCustomEventvalues.length < 1 || stringCustomEventvalues[0] == null || stringCustomEventvalues[0] == undefined)){
          canSessionIncrement(); //Check if visit count should be incremented
          batchRequests(stringCustomEventvalues[0], eventType, true);
        } else {console.log("Bad usage of swa.trackCustomEvent() api.  Invalid parameters used in the API");}
      }
    } else if (
        (loggingEnabled == "A" || loggingEnabled == "I") &&
        swa.customEventsEnabled &&
        typeof Piwik !== "undefined"
      ) {
        // In each function the "arguments" array always exists - even if no arguments are given (in this case arguments.length is 0). If provided, eventType is arguments[0] and eventValue is arguments[1].
        // If provided, store (up to 29) additional parameters in array  "additionalValues".
        // If no additional values are provided, array "additionalValues" will remain empty.
        var additionalValues = [];
        if (arguments.length > 2) {
          var maxArg = arguments.length;
          if (arguments.length > 31) {maxArg = 31;}
          for (i = 2; i < maxArg; i++) {additionalValues.push(arguments[i]);}
        }
        //Add the array "additionalValues" to the array "customEventAddValues" of our piwik plugin.When processing the custom event in the plugin, we will add the additional values to the request.
        swa.plugin.customEventAddValues.push(additionalValues);
        //Now send custom event using standard function "trackEvent" of Piwik.
        canSessionIncrement(); //Check if visit count should be incremented
        batchRequests(eventValue, eventType, true);
      }
  };

  function clearCustomEventValues(args) {
    for (var i = 0; i < args.length; i++) {
      //For integer custom events, clear the integer value and make it zero
      if (Number.isInteger(args[i])) {args[i] = 0;} else {args[i] = "undefined";}
    }
    return args;
  }

  swa.getEvent = function() {
    return swa.currentEvent;
  };

  swa.deleteCookies = function() {
    if (typeof Piwik !== "undefined") {Piwik.getAsyncTracker().deleteCookies();}
    // This deletes Piwik set cookies
    else {
      //Case when piwik is not loaded yet (banner is ON and set as session is ON - this stores visitor cookie with future date and doesn't delete when a new session occurs)
      //Manually delete each cookie
      deleteSWACookies("_swa_id");
      deleteSWACookies("_swa_ref");
      deleteSWACookies("_swa_ses");
    }

    //Manually delete cookies set by SWA
    deleteSWACookies("_swa_tracking_consent");
    //Since Piwik doesn't delete _pk_id cookie, manually deleting the same
    deleteSWACookies("_pk_id");
  };

  function deleteSWACookies(cookieName) {
    var validTo, exdate, cookie;
    validTo = Date.now() - swa.cookieTimeoutForVisitor * 1000;
    exdate = new Date(parseInt(validTo, 10));

    //Delete cookie if exists
    if (swa.getCookieValue(cookieName + "." + swa.pubToken) !== null) {
      cookie =
        cookieName + "." + swa.pubToken + "=; expires=" + exdate.toUTCString();
      cookie += "; path=/";
      document.cookie = cookie;
    }
  }

  swa._addScript = function(url, callback) {
    callback = callback || function() {};
    var d = document,
      g = d.createElement("script");
    g.type = "text/javascript";
    g.defer = true;
    g.async = true;
    //onload() is called by Chrome, Firefox, Safari 8, Opera 30 and IE 9+
    g.onload = function() {
      try {
        callback();
      } catch (ignore) {
        return;
      }
    };

    //Required for supporting IE 8 and below.onreadystatechange() is called by IE 5-10. Support has been removed in IE11.
    g.onreadystatechange = function() {
      var userAgent = navigator.userAgent.toLowerCase();
      //IE 9 and 10 call onload(): ensure callback() is not executed twice in
      //IE 9 and 10
      if (
        userAgent &&
        userAgent.indexOf("msie 9") === -1 &&
        userAgent.indexOf("msie 10") === -1
      ) {
        var rs = this.readyState;
        if (rs && rs === "loaded") {
          //In IE, 'loaded' seems to be the last state, called after multiple 'complete' states.This behavior is not consistent with https://msdn.microsoft.com/en-us/library/ms534359(v=vs.85).aspx

          try {
            callback();
          } catch (ignore) {
            return;
          }
        }
      }
    };
    g.src = url;
    if (d.body) {
      d.body.appendChild(g);
      /*g.onerror = function() {
			fallback();
		};*/
    } else {
      var ss = d.getElementsByTagName("script"),
        s = ss[ss.length - 1];
      s.parentNode.insertBefore(g, s.nextSibling);
    }
  };

  swa._isUI5 = function() {
    return !(typeof sap == "undefined" || typeof sap.ui == "undefined");
  };

  /**
   * Load eventBroadcaster for UI5 Apps and attach event listener for the same
   * @returns {void}
   */
  swa._enableUI5Events = function() {
    var requestOnePixel = function() {
      // Create the image
      var oCore = sap.ui.getCore();
      var oImg = document.createElement("img");
      oImg.src = sap.ui.require.toUrl("sap/ui/core/themes/base/img/1x1.gif");

      // Register into the static area
      try {
        oCore.getStaticAreaRef().insertAdjacentElement("beforeend", oImg);
      } catch (e) {
        document
          .getElementById("sap-ui-static")
          .insertAdjacentElement("beforeend", oImg);
        console.warn(
          "Static area not found. Falling back to DOM representation."
        );
      }
    };

    if (sap && sap.ui && sap.ui.core) {
      if (sap.ui.version >= "1.65.0") {
        sap.ui.getCore().attachInit(function() {
          sap.ui.require(
            ["sap/ui/core/support/usage/EventBroadcaster"],
            function(EventBroadcaster) {
              EventBroadcaster.enable();
            }
          );
          requestOnePixel();
        });

        attachSWAListener();
      }
    }
  };

  // -----------------------------------------------------------------------------
  // Init
  // -----------------------------------------------------------------------------

  //This function is called after we're sure jQuery exists and we can go on with the init process.
  swa._bootstrap = function() {
    //If someone uses old name "clickstream" instead of "swa",then use jQuery to copy clickstream into swa.
    /*global clickstream*/
    if (typeof clickstream !== "undefined") {
      swa.jQuery.extend(swa, clickstream);
    }

    if (swa.jQuery) {
      swa.jQuery.support.cors = true;
    }

    //Initialize swa
    swa.documentReady();
  };

  //look for Promise and load if not found
  if (typeof Promise == "undefined") {
    loadPromise(checkJQuery);
  } else {
    checkJQuery();
  }
  function checkJQuery() {
    //Add jQuery to swa.jQuery
    if (typeof jQuery == "undefined") {
      //Load jQuery into swa.jQuery
      loadJQuery(swa._bootstrap);
    } else {
      //global jQuery
      var jqVersion = jQuery.fn.jquery.split('.');
       if ((jqVersion[0] == 1 && jqVersion[1] < 7)) {
        //Load jQuery into swa.jQuery if existing jQuery version is 2.x or below 1.7
        loadJQuery(swa._bootstrap);
      } else {
        //use existing jQuery
        swa.jQuery = jQuery;
        swa._bootstrap();
      }
    }
  }

  function loadPromise(callback) {
    //Load the ui5 es6 promise polyfill for IE promise issues
    swa._addScript(
      "https://sapui5.hana.ondemand.com/1.88.0/resources/sap/ui/thirdparty/es6-promise.js",
      function() {
        callback();
      }
    );
  }

  function loadJQuery(callback) {
    //Load UI5 jquery
    swa._addScript(
      "https://sapui5.hana.ondemand.com/resources/sap/ui/thirdparty/jquery.js",
      function() {
        swa.jQuery = jQuery.noConflict(true);
        callback();
      }
    );
  }

  /**
   * EventHandler for UI5 events
   * @returns {void}
   */
  function attachSWAListener() {
    window.addEventListener("UI5Event", function(oData) {
      var detail, aArgs, aTempArray,hasher = window.hasher;

      if (!oData) {return;}

      detail = oData.detail;

      if (!isUI5EventWhitelisted(detail.eventName)) {return;}

      if (detail.eventName == "routeMatched" && !swa.disableRouteMatched) {
        //Handling duplicate loads
        if (window.location.href == loggedUrl && routeMatchedDisabled) {
          //Setting this flag to false so the next routeMatched events will be tracked
          routeMatchedDisabled = false;
        }
        //Avoid triggering load events for all page navigations in FLP Applications
        else if(window.sap !== undefined && window.sap.ushell !== undefined && window.sap.ushell.services !== undefined) {
          if (hasher.getHash() && hasher.getHash().includes(lastSeenHash)) {
            return;
          } else {
            lastSeenHash = hasher.getHash();
          }
          swa.trackLoad();
        } else{
          swa.trackLoad();
        }
        return;
      }

      if (!validateUI5Event(detail.eventName, detail.targetType)) {return;}

      aArgs = [
        "UI5Event",
        detail.eventName,
        detail.targetId,
        detail.targetType
      ];

      aTempArray = getUI5ControlAdditionalAttributes(
        detail.eventName,
        detail.additionalAttributes
      );

      aArgs = aArgs.concat(aTempArray);

      if (window.swa) {
        window.swa.trackCustomEvent.apply(window.swa, aArgs);
      } else {
        jQuery.sap.log.warning("SWABootsrap: SWA object is not defined");
      }
    });
  }

  /**
   * Validating whitelisted UI5 events
   * @param {string}eventName - Event Name
   * @returns {boolean}
   */
  function isUI5EventWhitelisted(eventName) {
    return UI5EVENTS_WHITELIST[eventName];
  }

  /**
   * Additional values for specific control
   * @param {string} eventName - Event Name
   * @param {object} additionalProperties
   * @returns {Array}
   */
  function getUI5ControlAdditionalAttributes(eventName, additionalProperties) {
    switch (eventName) {
      case "selectionChange":
      case "change":
        return getSelectProperties(additionalProperties);
      case "search":
        return getSearchEventProperties(additionalProperties);
      default:
        return [];
    }
  }

  /**
   * Get selected item properties
   * @param {object} additionalProperties
   * @returns {Array}
   */
  function getSelectProperties(additionalProperties) {
    if (additionalProperties.selectedItem) {
      return [
        additionalProperties.selectedItem.getKey(),
        additionalProperties.selectedItem.getText()
      ];
    }
  }

  function getSearchEventProperties(additionalProperties) {
    if (additionalProperties.query) {
      return [additionalProperties.query];
    }
  }

  /**
   * Whitelisting specified events
   * @returns {void}
   */
  function whiteListUI5Events() {
    UI5EVENTS_WHITELIST.selectionChange = ["sap.m.ComboBox"];
    UI5EVENTS_WHITELIST.change = ["sap.m.Select"];
    UI5EVENTS_WHITELIST.search = ["sap.m.SearchField"];
  }

  /**
   * Validating event type
   * @param {string} eventName - Event Name
   * @param {string} control - Event Control
   * @returns {boolean}
   */
  function validateUI5Event(eventName, control) {
    var i,
      controls = UI5EVENTS_WHITELIST[eventName];

    for (i in controls) {
      if (controls[i] == control) {return true;}
    }

    return false;
  }
  /**
   * Function to get the tracking status
   */
  swa.getTrackingStatus = function() {
    if(loggingEnabled == "I") {return true;} else if(loggingEnabled == "A") {return "Anonymous Tracking";} else {return false;}
  };

  function addConsentForm() {

    var consentText = swa.anonymousTrackingConsent?swa.anonymousConsentText:swa.consentOptInText;
   
    if (!(swa.appName === null) && !(swa.appName === undefined) && !(swa.appBannerSuffixText === undefined) && !(swa.appBannerPrefixText === undefined) && !(swa.appBannerPrefixText === "APP_BANNER_PREFIX_TEXT") && !(swa.appName.replace(/^\s+|\s+$/gm,'') === "") ) {
      if (swa.privacyLink === null || swa.privacyLink === "" || swa.privacyLink === undefined || swa.cookieStatementLink === null || swa.cookieStatementLink === undefined ) {
        console.error("The consent does not include a Privacy statement/cookie statement. Please make sure you have configured swa.cookieStatementLink and swa.privacyLink to display consent form");
         swa.disable();
         return;
       }
      if (swa.anonymousTrackingConsent)
        consentText = getAppNameConsentText(swa.appBannerOptinAnonymisedtext);
      else
        consentText = getAppNameConsentText(swa.appBannerOptInText);
       
   }
	if (swa.jQuery('#swa_consentform').length === 0) {	
    swa.jQuery('body').append('<div id="swa_background"></div>  <div id="swa_consentform" class="consentFormTop">         <a  href="#" title='+swa.consentCloseButton+'> <img id="closeButton" class="close_swaconsent"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAACIiIhaeOqmAAAAAXRSTlMAQObYZgAAAC9JREFUaN5jYGBgEOBgsJBhqLFjsKthkP/BwP+Bgf0BCAEZQC5QECgFVABUxsAAAOcxCbuaDAybAAAAAElFTkSuQmCC" /><hr />   </a> 	<div id="swa_consent_text_window" class="swalicensetxt" ><div> 	<p> <strong>'+consentText+'</strong></p>	</div>    <div id="swa_form">	        <button class="swaconsentbutton" type="button" title='+swa.consentDenyButton+' id="swaconsent_notnow_modal"  >'+swa.consentDenyButton+'</Button>  <button class="swaconsentbutton" type="button" title='+swa.consentAllowButton+'  id="swaconsent_allow_modal"  >'+swa.consentAllowButton+'</button> </div></div></div>');
		swa.jQuery('#swaconsent_allow_modal,#swaconsent_notnow_modal,#closeButton').click(function() {
    banner_save(event);
	return false;
 });
		swa.jQuery('#swa_background, .close_swaconsent').click(function (event) {
			removeConsentForm();
			event.preventDefault();
		});
	}
  }

  function removeConsentForm() {
    swa.jQuery("#swa_background").fadeOut(500);
    swa.jQuery("#swa_consentform").fadeOut(500);
  }

  function removeOptoutConsentForm() {
    swa.jQuery("#swa_background_optout").fadeOut(500);
    swa.jQuery("#swa_optout_consentform").fadeOut(500);
  }

  function showConsentForm(calledOnDemand) {
    //swa.clearConsentDeferDecision();

    addConsentForm();

    /* Attaching a listener on esc key press to close the consent form Creates
     * consent_defer cookie so the form is not shown until next session
     */

    document.onkeydown = function(event) {
      if (event.keyCode == 27) {
        swa.jQuery("#swa_background").fadeOut(500);
        swa.jQuery("#swa_consentform").fadeOut(500);
      }
    };

    var wheight = swa.jQuery(window).height();
    var wwidth = swa.jQuery(window).width();
    var mheight = swa.jQuery("#swa_consentform").outerHeight();
    var mwidth = swa.jQuery("#swa_consentform").outerWidth();
    swa.jQuery("#swa_consentform").css({ top: top, left: left });
    swa.jQuery("#swa_background").css({ display: "block", opacity: 0 });
    var top = (wheight - mheight) / 2;
    var left = (wwidth - mwidth) / 2;

    //Show pop up when called on demand
    if (!calledOnDemand) {
      swa.jQuery("#swa_consentform").hide();
      swa.jQuery("#swa_background").hide();
    } else {
      swa.jQuery("#swa_background").fadeTo(500, 0.8);
      swa.jQuery("#swa_consentform").fadeIn(500);
    }
  }

  swa.showConsentFormOnDemand = function() {
    if(!isTrackingAllowedBasedOnDNTSetting(siteProperties.honorDNT, (window.navigator.doNotTrack == "1" ? 1 : 0))) {
      console.error("You've enabled the 'Do Not Track' option. This allows you to request websites not to collect or track your browsing data. By default, SAP Web Analytics respects the browser's Do Not Track setting.");
      return;
    }

    if( swa.isConsentGiven){
      console.error("Consent is already given hence function cannot be called");
    }else{
    //sites using SWA banner are only allowed to use this
    if(siteProperties.bannerEnabled && !swa.isConsentGiven){
    //check the client side consentStyle and on load properties
    getDefaultTextForConsent();
     if(  loggingEnabled == "I" ){
      //Show Consent Opt out
      showOptoutConsentForm();
    }else if(loggingEnabled == "N" || loggingEnabled == "A"){

    loadOnDemandOptInConsentForm();
    }
  }else{
    console.error("Can only be used for sites using Web analytics banner");
  }
    }
  };
  function showOptoutConsentForm(){
    if(swa.consentStyle == "popup" ){
      //show opt out consent pop up
      addOptOutConsentForm();
    }else {
      var consentText = swa.anonymousTrackingConsent ? swa.anonymousConsentOptOutText : swa.consentOptOutText;

      if (!(swa.appName === null) && !(swa.appName === undefined) && !(swa.appBannerSuffixText === undefined) && !(swa.appBannerPrefixText === undefined) && !(swa.appBannerPrefixText === "APP_BANNER_PREFIX_TEXT") && !(swa.appName.replace(/^\s+|\s+$/gm,'') === "") ) {
        if (swa.privacyLink === null || swa.privacyLink === "" || swa.privacyLink === undefined || swa.cookieStatementLink === null || swa.cookieStatementLink === undefined ) {
          console.error("The consent does not include a Privacy statement/cookie statement. Please make sure you have configured swa.cookieStatementLink and swa.privacyLink to display consent form");
           swa.disable();
           return;
         }
        if (swa.anonymousTrackingConsent)
          consentText = getAppNameConsentText(swa.appBannerOptoutAonymisedtext);
        else
          consentText = getAppNameConsentText(swa.appbannerOptoutText);
       
   }
      var consentStopButton = swa.anonymousTrackingConsent?swa.anonymizeButtonText:swa.consentStopButton;
    if (swa.jQuery('.optoutbanner').length === 0) {
        if(swa.consentStyle =="bannerbottom")
        swa.jQuery('body').append('<div id="swa_optout_banner" class="optoutbanner bannerbottom"><p><strong>'+consentText+'</strong> </p></br><hr><div id="buttonsDiv" ><button type="button" class = "bannerButton" title='+consentStopButton+' id="noButton" >'+consentStopButton+'</button><a href="#" title='+swa.consentCloseButton+' class="consentCloseButton" ><img id="closeButton"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAACIiIhaeOqmAAAAAXRSTlMAQObYZgAAAC9JREFUaN5jYGBgEOBgsJBhqLFjsKthkP/BwP+Bgf0BCAEZQC5QECgFVABUxsAAAOcxCbuaDAybAAAAAElFTkSuQmCC" /></a></div>');
      //swa.jQuery(".optoutbanner").css(swa.consentStyle =="bannerbottom"?'bottom:0;':'top:0;');
         else
         swa.jQuery('body').append('<div id="swa_optout_banner" class="optoutbanner bannertop"><p><strong>'+consentText+'</strong> </p></br><hr><div id="buttonsDiv" ><button type="button" class = "bannerButton" title='+consentStopButton+' id="noButton" >'+consentStopButton+'</button><a href="#" title='+swa.consentCloseButton+' class="consentCloseButton" ><img id="closeButton"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAACIiIhaeOqmAAAAAXRSTlMAQObYZgAAAC9JREFUaN5jYGBgEOBgsJBhqLFjsKthkP/BwP+Bgf0BCAEZQC5QECgFVABUxsAAAOcxCbuaDAybAAAAAElFTkSuQmCC" /></a></div>');

    }else{
      //display the loaded one
      swa.jQuery('.optoutbanner').css("display","block");
    }
    swa.jQuery('.optoutbanner #noButton').click(function () {
      swa.jQuery('.optoutbanner').css("display","none");
      stopTracking(true);
      });
    swa.jQuery('.optoutbanner #closeButton').click(function () {
      closeForm();
      });

    }
  }
  function closeForm(){

    //Close the banner or pop up
    if(swa.consentStyle == "banner" || swa.consentStyle == "bannerbottom") {swa.jQuery(".optoutbanner").slideUp();} else{
      swa.jQuery('#swa_optout_consentform').slideUp();
      removeOptoutConsentForm();
    }
  }
  function addOptOutConsentForm() {

    var consentText = swa.anonymousTrackingConsent?swa.anonymousConsentOptOutText:swa.consentOptOutText;
    
    if (!(swa.appName === null) && !(swa.appName === undefined) && !(swa.appBannerSuffixText === undefined) && !(swa.appBannerPrefixText === undefined) && !(swa.appBannerPrefixText === "APP_BANNER_PREFIX_TEXT") && !(swa.appName.replace(/^\s+|\s+$/gm,'') === "") ) {
      if (swa.privacyLink === null || swa.privacyLink === "" || swa.privacyLink === undefined || swa.cookieStatementLink === null || swa.cookieStatementLink === undefined ) {
        console.error("The consent does not include a Privacy statement/cookie statement. Please make sure you have configured swa.cookieStatementLink and swa.privacyLink to display consent form");
         swa.disable();
         return;
       }
      if (swa.anonymousTrackingConsent)
        consentText = getAppNameConsentText(swa.appBannerOptoutAonymisedtext);
      else
        consentText = getAppNameConsentText(swa.appbannerOptoutText);
    }
	var consentStopButton = swa.anonymousTrackingConsent?swa.anonymizeButtonText:swa.consentStopButton;
    if (swa.jQuery('#swa_optout_consentform').length === 0) {	
  
      swa.jQuery('body').append('<div id="swa_background_optout"></div>  <div id="swa_optout_consentform">        <a title='+swa.consentCloseButton+' class="close_swaopoutconsent" href="#"> <img id="closeButton" class="close_swaoptoutconsent"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAACIiIhaeOqmAAAAAXRSTlMAQObYZgAAAC9JREFUaN5jYGBgEOBgsJBhqLFjsKthkP/BwP+Bgf0BCAEZQC5QECgFVABUxsAAAOcxCbuaDAybAAAAAElFTkSuQmCC" /><hr />  </a>  	<div id="swa_consent_text_window1" class="swalicensetxt" >	<div> 	<p><strong>'+consentText+'</strong></p>	</div>    <div id="swa_form1">	   <button class="swaconsentbutton" type="button" title='+consentStopButton+' id="swaconsent_notnow_modal"  >'+consentStopButton+'</Button>        </div></div></div>');
    }
    
    swa.jQuery('#swa_optout_consentform #swaconsent_notnow_modal').click(function () {	

      stopTracking(true);
      });
    swa.jQuery('#swa_optout_consentform #closeButton').click(function () {
      closeForm();
      });


    swa.jQuery('#swa_background_optout, .close_swaconsent').click(function (event) {
      removeOptoutConsentForm();
      event.preventDefault();
    });
    document.onkeydown = function(event){
      if(event.keyCode == 27){
        swa.jQuery('#swa_background_optout').fadeOut(500);
        swa.jQuery('#swa_optout_consentform').fadeOut(500);
      }
    };
    var wheight = swa.jQuery(window).height();
    var wwidth = swa.jQuery(window).width();
    var mheight = swa.jQuery('#swa_optout_consentform').outerHeight();
    var mwidth = swa.jQuery('#swa_optout_consentform').outerWidth();
    var top = (wheight - mheight) / 2;
    var left = (wwidth - mwidth) / 2;
    swa.jQuery('#swa_optout_consentform').css({ 'top': top, 'left': left });
    swa.jQuery('#swa_background_optout').css({ 'display': 'block', opacity: 0 });
    swa.jQuery('#swa_background_optout').fadeTo(500, 0.8);
    swa.jQuery('#swa_optout_consentform').fadeIn(500);

  }
  function loadOnDemandOptInConsentForm(){
		//show consent optin form
		if(swa.consentStyle == "popup" ){

			//show consent pop up
			showConsentForm(true);

		}else if(swa.consentStyle =="banner" || swa.consentStyle =="bannerbottom"){
			var consentText = swa.anonymousTrackingConsent?swa.anonymousConsentText:swa.consentOptInText;
      
      if (!(swa.appName === null) && !(swa.appName === undefined) && !(swa.appBannerSuffixText === undefined) && !(swa.appBannerPrefixText === undefined) && !(swa.appBannerPrefixText === "APP_BANNER_PREFIX_TEXT") && !(swa.appName.replace(/^\s+|\s+$/gm,'') === "") ) {
        if (swa.privacyLink === null || swa.privacyLink === "" || swa.privacyLink === undefined || swa.cookieStatementLink === null || swa.cookieStatementLink === undefined ) {
          console.error("The consent does not include a Privacy statement/cookie statement. Please make sure you have configured swa.cookieStatementLink and swa.privacyLink to display consent form");
           swa.disable();
           return;
         }
        if (swa.anonymousTrackingConsent)
          consentText = getAppNameConsentText(swa.appBannerOptinAnonymisedtext);
        else
          consentText = getAppNameConsentText(swa.appBannerOptInText);
      }
		if (swa.jQuery('div[swa_banner=1]').length === 0) {
            if(swa.consentStyle =="bannerbottom")
            swa.jQuery('body').append('<div id="swa_banner" class="swa_banner bannerbottom"><p><strong>'+consentText+'</strong></p></br><hr><div id="buttonsDiv" ><button type="button" id="yesButton" title='+swa.consentAllowButton+' class = "bannerButton" >'+swa.consentAllowButton+'</button><button type="button" class = "bannerButton" title='+swa.consentDenyButton+' id="noButton" >'+swa.consentDenyButton+'</button><a href="#" title='+swa.consentCloseButton+' class="consentCloseButton" ><img id="closeButton"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAACIiIhaeOqmAAAAAXRSTlMAQObYZgAAAC9JREFUaN5jYGBgEOBgsJBhqLFjsKthkP/BwP+Bgf0BCAEZQC5QECgFVABUxsAAAOcxCbuaDAybAAAAAElFTkSuQmCC" /></a></div>');
			//swa.jQuery(".swa_banner").css(swa.consentStyle =="bannerbottom"?'bottom:0;':'top:0;') 
            else
            swa.jQuery('body').append('<div id="swa_banner" class="swa_banner bannertop"><p><strong>'+consentText+'</strong></p></br><hr><div id="buttonsDiv" ><button type="button" id="yesButton" title='+swa.consentAllowButton+' class = "bannerButton" >'+swa.consentAllowButton+'</button><button type="button" class = "bannerButton" title='+swa.consentDenyButton+' id="noButton" >'+swa.consentDenyButton+'</button><a href="#" title='+swa.consentCloseButton+' class="consentCloseButton" ><img id="closeButton"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAACIiIhaeOqmAAAAAXRSTlMAQObYZgAAAC9JREFUaN5jYGBgEOBgsJBhqLFjsKthkP/BwP+Bgf0BCAEZQC5QECgFVABUxsAAAOcxCbuaDAybAAAAAElFTkSuQmCC" /></a></div>');

			swa.jQuery('#yesButton,#noButton,#closeButton').click(function() {
banner_save(event);
 return false;
  });
		}
		}
}


  function stopTracking(isFormOpen){
    swa.disable();
    createSWACookie("tracking_consent", 0);
    //If form is open, close it
    if(isFormOpen) {closeForm();}
  }

  function loadPiwikUrl() {
    //Added a check to bypass loading piwik from UI5 Server if open UI5 Library is used
    if (window.sap.ui !== undefined && parseFloat(sap.ui.version) > 1.8) {
      return sap.ui.require.toUrl("sap/webanalytics/core/tracker/js/piwik.js");
    } else {
      return swa.baseUrl + "js/piwik.js";
    }
  }

  function getUserLanguage() {
    var locale = "en";
    if (window.sap.ui !== undefined) {
      locale = sap.ui
        .getCore()
        .getConfiguration()
        .getLanguage();
    } else {
      locale = navigator.languages
        ? navigator.languages[0]
        : navigator.language;
      locale.substr(0, 2);
    }
    return locale;
  }

  function localizeText() {
    var isUI5 = false;
    var i18nurl = "";
    if (
      (swa.consentOptInText !== undefined ||
        swa.consentOptOutText !== undefined || swa.anonymousConsentText !== undefined || swa.anonymousConsentOptOutText !== undefined) &&
      count < 1
    ) {
      consentTextPresent = true;
    }
    count++;
    if(window.sap.ui !== undefined && parseFloat(sap.ui.version) > 1.8 ) {
      i18nurl = sap.ui.require.toUrl(
        "sap/webanalytics/core/SAPWebAnalyticsFLPPlugin/i18n/i18n.properties"
      );
     //since sap.jQuery.require is deprecated replaced with ResourceBundle
     sap.ui.require(["sap/base/i18n/ResourceBundle"], function(ResourceBundle){
      ResourceBundle.create({
     url : i18nurl,
     async : true,
     locale: swa.consentFormLanguage,
     fallbackLocale: "en"
 }).then(function(oBundle){
     // now you can access the bundle
isUI5 = true;
getTranslatedText(oBundle, isUI5);
 });
});
    } else {
      i18nurl =
        swa.baseUrl +
        "js/i18n/i18n" +
        (swa.consentFormLanguage === "" || swa.consentFormLanguage === undefined
          ? ""
          : "_" + swa.consentFormLanguage) +
        ".json";
      swa._addScript(i18nurl, function() {
        getTranslatedText(window.data[0], isUI5);
      });
    
  }
}

  function getTranslatedText(oBundle, isUI5) {
    if (consentTextPresent) {
      i18nValues[0] = isUI5
        ? oBundle.getText("CONSENT_OPT_IN_TEXT")
        : decodeURIComponent(JSON.parse('"' + oBundle.CONSENT_OPT_IN_TEXT.replace(/\"/g, '\\"') + '"'));
      i18nValues[1] = isUI5
        ? oBundle.getText("CONSENT_OPT_OUT_TEXT")
        : decodeURIComponent(JSON.parse('"' + oBundle.CONSENT_OPT_OUT_TEXT.replace(/\"/g, '\\"') + '"'));
      i18nValues[2] = isUI5
        ? oBundle.getText("CONSENT_BUTTON_ALLOW")
        : decodeURIComponent(JSON.parse('"' +  oBundle.CONSENT_BUTTON_ALLOW.replace(/\"/g, '\\"') + '"'));
      i18nValues[3] = isUI5
        ? oBundle.getText("CONSENT_BUTTON_DENY")
        : decodeURIComponent(JSON.parse('"' +  oBundle.CONSENT_BUTTON_DENY.replace(/\"/g, '\\"') + '"'));
      i18nValues[4] = isUI5
        ? oBundle.getText("CONSENT_BUTTON_STOP_TRACKING")
        : decodeURIComponent(JSON.parse('"' +  oBundle.CONSENT_BUTTON_STOP_TRACKING.replace(/\"/g, '\\"') + '"'));
      i18nValues[5] = isUI5
        ? oBundle.getText("CONSENT_TOOLTIP_CLOSE")
        : decodeURIComponent(JSON.parse('"' +  oBundle.CONSENT_TOOLTIP_CLOSE.replace(/\"/g, '\\"') + '"'));
      i18nValues[6] = isUI5
        ? oBundle.getText("PRIVACY_LINK_TEXT")
        : decodeURIComponent(JSON.parse('"' +  oBundle.PRIVACY_LINK_TEXT.replace(/\"/g, '\\"') + '"'));
      i18nValues[7] = isUI5
        ? oBundle.getText('ANONYMOUS_CONSENT_OPT_IN_TEXT')
        : decodeURIComponent(JSON.parse('"' +  oBundle.ANONYMOUS_CONSENT_OPT_IN_TEXT.replace(/\"/g, '\\"') + '"'));
      i18nValues[8] = isUI5
        ? oBundle.getText('ANONYMOUS_CONSENT_OPT_OUT_TEXT')
        : decodeURIComponent(JSON.parse('"' +  oBundle.ANONYMOUS_CONSENT_OPT_OUT_TEXT.replace(/\"/g, '\\"') + '"'));
      i18nValues[9] = isUI5
        ? oBundle.getText('ANON_TRK_BUTTON_TEXT')
        : decodeURIComponent(JSON.parse('"' +  oBundle.ANON_TRK_BUTTON_TEXT.replace(/\"/g, '\\"') + '"'));
      i18nValues[10] = isUI5
        ? oBundle.getText('CUSTOM_CONSENT_OPTION')
        : decodeURIComponent(JSON.parse('"' +  oBundle.CUSTOM_CONSENT_OPTION.replace(/\"/g, '\\"') + '"'));
      i18nValues[11] = isUI5
        ? oBundle.getText('TRACKING_ON_STATUS')
        : decodeURIComponent(JSON.parse('"' +  oBundle.TRACKING_ON_STATUS.replace(/\"/g, '\\"') + '"'));
      i18nValues[12] = isUI5
        ? oBundle.getText('TRACKING_OFF_STATUS')
        : decodeURIComponent(JSON.parse('"' +  oBundle.TRACKING_OFF_STATUS.replace(/\"/g, '\\"') + '"'));
      i18nValues[13] = isUI5
     ? oBundle.getText('TRACKING_ANON_STATUS')
   : decodeURIComponent(JSON.parse('"' +  oBundle.TRACKING_ANON_STATUS.replace(/\"/g, '\\"') + '"'));
      i18nValues[14] = isUI5
        ? oBundle.getText('TRACKING_STATUS_TEXT')
        : decodeURIComponent(JSON.parse('"' +  oBundle.TRACKING_STATUS_TEXT.replace(/\"/g, '\\"') + '"'));
      i18nValues[15] = isUI5
        ? oBundle.getText('APP_BANNER_PREFIX_TEXT')
        : decodeURIComponent(JSON.parse('"' +  oBundle.APP_BANNER_PREFIX_TEXT.replace(/\"/g, '\\"') + '"'));
        i18nValues[16] = isUI5
        ? oBundle.getText('APP_BANNER_SUFFIX_TEXT')
        : decodeURIComponent(JSON.parse('"' +  oBundle.APP_BANNER_SUFFIX_TEXT.replace(/\"/g, '\\"') + '"'));  
        i18nValues[17] = isUI5
        ? oBundle.getText('APP_BANNER_OPTIN_TEXT')
        : decodeURIComponent(JSON.parse('"' +  oBundle.APP_BANNER_OPTIN_TEXT.replace(/\"/g, '\\"') + '"'));  
        i18nValues[18] = isUI5
        ? oBundle.getText('APP_BANNER_OPTOUT_TEXT')
        : decodeURIComponent(JSON.parse('"' +  oBundle.APP_BANNER_OPTOUT_TEXT.replace(/\"/g, '\\"') + '"'));   
        i18nValues[19] = isUI5
        ? oBundle.getText('APP_BANNER_OPTIN_TEXT_ANONYMISED')
        : decodeURIComponent(JSON.parse('"' +  oBundle.APP_BANNER_OPTIN_TEXT_ANONYMISED.replace(/\"/g, '\\"') + '"')); 
        i18nValues[20] = isUI5
        ? oBundle.getText('APP_BANNER_OPTOUT_TEXT_ANONYMISED')
        : decodeURIComponent(JSON.parse('"' +  oBundle.APP_BANNER_OPTOUT_TEXT_ANONYMISED.replace(/\"/g, '\\"') + '"'));
        i18nValues[21] = isUI5
        ? oBundle.getText('COOKIE_STATEMENT_TEXT')
        : decodeURIComponent(JSON.parse('"' +  oBundle.COOKIE_STATEMENT_TEXT.replace(/\"/g, '\\"') + '"'));
        COOKIE_STATEMENT_TEXT
    }

    if (swa.consentOptInText === undefined) {
swa.consentOptInText = isUI5
        ? oBundle.getText("CONSENT_OPT_IN_TEXT")
        : decodeURIComponent(JSON.parse('"' +  oBundle.CONSENT_OPT_IN_TEXT.replace(/\"/g, '\\"') + '"'));
}

    if ( swa.consentOptOutText === undefined) {
swa.consentOptOutText = isUI5
        ? oBundle.getText("CONSENT_OPT_OUT_TEXT")
        : decodeURIComponent(JSON.parse('"' +  oBundle.CONSENT_OPT_OUT_TEXT.replace(/\"/g, '\\"') + '"'));
}

    if ( swa.anonymousConsentText === undefined) {
swa.anonymousConsentText = isUI5
      ? oBundle.getText('ANONYMOUS_CONSENT_OPT_IN_TEXT')
      : decodeURIComponent(JSON.parse('"' +  oBundle.ANONYMOUS_CONSENT_OPT_IN_TEXT.replace(/\"/g, '\\"') + '"'));
}

    if ( swa.anonymousConsentOptOutText === undefined) {
swa.anonymousConsentOptOutText = isUI5
      ? oBundle.getText('ANONYMOUS_CONSENT_OPT_OUT_TEXT')
      : decodeURIComponent(JSON.parse('"' +  oBundle.ANONYMOUS_CONSENT_OPT_OUT_TEXT.replace(/\"/g, '\\"') + '"'));
    }
    
      swa.appBannerPrefixText = isUI5
      ? oBundle.getText('APP_BANNER_PREFIX_TEXT')
      : decodeURIComponent(JSON.parse('"' +  oBundle.APP_BANNER_PREFIX_TEXT.replace(/\"/g, '\\"') + '"'));
      swa.appBannerSuffixText = isUI5
      ? oBundle.getText('APP_BANNER_SUFFIX_TEXT')
      : decodeURIComponent(JSON.parse('"' +  oBundle.APP_BANNER_SUFFIX_TEXT.replace(/\"/g, '\\"') + '"'));  
      swa.appBannerOptInText = isUI5
      ? oBundle.getText('APP_BANNER_OPTIN_TEXT')
      : decodeURIComponent(JSON.parse('"' +  oBundle.APP_BANNER_OPTIN_TEXT.replace(/\"/g, '\\"') + '"'));  
      swa.appbannerOptoutText = isUI5
      ? oBundle.getText('APP_BANNER_OPTOUT_TEXT')
      : decodeURIComponent(JSON.parse('"' +  oBundle.APP_BANNER_OPTOUT_TEXT.replace(/\"/g, '\\"') + '"'));   
      swa.appBannerOptinAnonymisedtext= isUI5
      ? oBundle.getText('APP_BANNER_OPTIN_TEXT_ANONYMISED')
      : decodeURIComponent(JSON.parse('"' +  oBundle.APP_BANNER_OPTIN_TEXT_ANONYMISED.replace(/\"/g, '\\"') + '"')); 
      swa.appBannerOptoutAonymisedtext = isUI5
      ? oBundle.getText('APP_BANNER_OPTOUT_TEXT_ANONYMISED')
      : decodeURIComponent(JSON.parse('"' +  oBundle.APP_BANNER_OPTOUT_TEXT_ANONYMISED.replace(/\"/g, '\\"') + '"'));  
      swa.cookieStatementText = isUI5
          ? oBundle.getText('COOKIE_STATEMENT_TEXT')
      : decodeURIComponent(JSON.parse('"' +  oBundle.COOKIE_STATEMENT_TEXT.replace(/\"/g, '\\"') + '"')); 

    swa.consentAllowButton = isUI5
      ? oBundle.getText("CONSENT_BUTTON_ALLOW")
      : decodeURIComponent(JSON.parse('"' +  oBundle.CONSENT_BUTTON_ALLOW.replace(/\"/g, '\\"') + '"'));
    swa.consentDenyButton = isUI5
      ? oBundle.getText("CONSENT_BUTTON_DENY")
      : decodeURIComponent(JSON.parse('"' +  oBundle.CONSENT_BUTTON_DENY.replace(/\"/g, '\\"') + '"'));
    swa.consentStopButton = isUI5
      ? oBundle.getText("CONSENT_BUTTON_STOP_TRACKING")
      : decodeURIComponent(JSON.parse('"' +  oBundle.CONSENT_BUTTON_STOP_TRACKING.replace(/\"/g, '\\"') + '"'));
    swa.consentCloseButton = isUI5
      ? oBundle.getText("CONSENT_TOOLTIP_CLOSE")
      : decodeURIComponent(JSON.parse('"' +  oBundle.CONSENT_TOOLTIP_CLOSE.replace(/\"/g, '\\"') + '"'));
    swa.privacyLinkText = isUI5
      ? oBundle.getText("PRIVACY_LINK_TEXT")
      : decodeURIComponent(JSON.parse('"' +  oBundle.PRIVACY_LINK_TEXT.replace(/\"/g, '\\"') + '"'));
    swa.anonymizeButtonText = isUI5
      ? oBundle.getText("ANON_TRK_BUTTON_TEXT")
      : decodeURIComponent(JSON.parse('"' +  oBundle.ANON_TRK_BUTTON_TEXT.replace(/\"/g, '\\"') + '"'));
    swa.customConsentOptionText = isUI5
      ? oBundle.getText('CUSTOM_CONSENT_OPTION')
      : decodeURIComponent(JSON.parse('"' +  oBundle.CUSTOM_CONSENT_OPTION.replace(/\"/g, '\\"') + '"'));
    swa.trackOnStatus = isUI5
      ? oBundle.getText('TRACKING_ON_STATUS')
      : decodeURIComponent(JSON.parse('"' +  oBundle.TRACKING_ON_STATUS.replace(/\"/g, '\\"') + '"'));
    swa.trackOffStatus = isUI5
      ? oBundle.getText('TRACKING_OFF_STATUS')
      : decodeURIComponent(JSON.parse('"' +  oBundle.TRACKING_OFF_STATUS.replace(/\"/g, '\\"') + '"'));
    swa.trackAnonymousStatus = isUI5
      ? oBundle.getText('TRACKING_ANON_STATUS')
      : decodeURIComponent(JSON.parse('"' +  oBundle.TRACKING_ANON_STATUS.replace(/\"/g, '\\"') + '"'));
    swa.trackingStatusText = isUI5
      ? oBundle.getText('TRACKING_STATUS_TEXT')
      : decodeURIComponent(JSON.parse('"' +  oBundle.TRACKING_STATUS_TEXT.replace(/\"/g, '\\"') + '"'));

    //Add the privacy link to the "consentOptInText", if any. Handling cases where optIn banner has a link but when opting out, link is added again
    if(swa.privacyLink !== null && swa.consentOptInText !== undefined && swa.consentOptOutText !== undefined && swa.anonymousConsentText !== undefined && swa.anonymousConsentOptOutText !== undefined && swa.consentOptInText.indexOf("href") === -1 && swa.consentOptOutText.indexOf("href") === -1 && swa.anonymousConsentText.indexOf("href") === -1 && swa.anonymousConsentOptOutText.indexOf("href") === -1){
      swa.consentOptInText = swa.consentOptInText.concat(" <a href=" + swa.privacyLink + " target=\"_blank\">" + swa.privacyLinkText + "</a>");
      swa.consentOptOutText = swa.consentOptOutText.concat(" <a href=" + swa.privacyLink + " target=\"_blank\">" + swa.privacyLinkText + "</a>");
      swa.anonymousConsentText = swa.anonymousConsentText.concat(" <a href=" + swa.privacyLink + " target=\"_blank\">" + swa.privacyLinkText + "</a>");
      swa.anonymousConsentOptOutText = swa.anonymousConsentOptOutText.concat(" <a href=" + swa.privacyLink + " target=\"_blank\">" + swa.privacyLinkText + "</a>");
    }
  }

  function isURLValid(url) {
    var urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (urlRegex.test(url)) {return true;} else {return false;}
  }

  function fallback() {
    if (!(window.sap.ui !== undefined && parseFloat(sap.ui.version) > 1.8)) {
      var i18nurl = swa.baseUrl + "js/i18n/i18n.json";
      swa._addScript(i18nurl, function() {
        defaultConsentValues[0] = window.data[0].CONSENT_OPT_IN_TEXT;
        defaultConsentValues[1] = window.data[0].CONSENT_OPT_OUT_TEXT;
        defaultConsentValues[2] = window.data[0].CONSENT_BUTTON_ALLOW;
        defaultConsentValues[3] = window.data[0].CONSENT_BUTTON_DENY;
        defaultConsentValues[4] = window.data[0].CONSENT_BUTTON_STOP_TRACKING;
        defaultConsentValues[5] = window.data[0].CONSENT_TOOLTIP_CLOSE;
        defaultConsentValues[6] = window.data[0].PRIVACY_LINK_TEXT;
        defaultConsentValues[7] = window.data[0].ANONYMOUS_CONSENT_OPT_IN_TEXT;
        defaultConsentValues[8] = window.data[0].ANONYMOUS_CONSENT_OPT_OUT_TEXT;
        defaultConsentValues[9] = window.data[0].ANON_TRK_BUTTON_TEXT;
        defaultConsentValues[10] = window.data[0].CUSTOM_CONSENT_OPTION;
        defaultConsentValues[11] = window.data[0].TRACKING_ON_STATUS;
        defaultConsentValues[12] = window.data[0].TRACKING_OFF_STATUS;
        defaultConsentValues[13] = window.data[0].TRACKING_ANON_STATUS;
        defaultConsentValues[14] = window.data[0].TRACKING_STATUS_TEXT;
        defaultConsentValues[15] = window.data[0].APP_BANNER_PREFIX_TEXT;
        defaultConsentValues[16] = window.data[0].APP_BANNER_SUFFIX_TEXT;
        defaultConsentValues[17] = window.data[0].APP_BANNER_OPTIN_TEXT;
        defaultConsentValues[18] = window.data[0].APP_BANNER_OPTOUT_TEXT;
        defaultConsentValues[19] = window.data[0].APP_BANNER_OPTIN_TEXT_ANONYMISED;
        defaultConsentValues[20] = window.data[0].APP_BANNER_OPTOUT_TEXT_ANONYMISED;
        defaultConsentValues[21] = window.data[0].COOKIE_STATEMENT_TEXT;
        
      });
    }
  }

  function getDefaultTextForConsent() {

      swa.consentOptInText = (swa.consentOptInText === undefined)?(i18nValues[0] == undefined ?defaultConsentValues[0]:i18nValues[0]):swa.consentOptInText;
      swa.consentOptOutText = (swa.consentOptOutText === undefined)?(i18nValues[1] == undefined ?defaultConsentValues[1]:i18nValues[1]):swa.consentOptOutText;
      swa.anonymousConsentText = (swa.anonymousConsentText === undefined)?(i18nValues[7] == undefined ?defaultConsentValues[7]:i18nValues[7]):swa.anonymousConsentText;
      swa.anonymousConsentOptOutText = (swa.anonymousConsentOptOutText === undefined)?(i18nValues[8] == undefined ?defaultConsentValues[8]:i18nValues[8]):swa.anonymousConsentOptOutText;     
      swa.consentAllowButton =(swa.consentAllowButton === undefined)? (i18nValues[2] == undefined ?defaultConsentValues[2]:i18nValues[2]):swa.consentAllowButton;
      swa.consentDenyButton = (swa.consentDenyButton === undefined)? (i18nValues[3] == undefined ?defaultConsentValues[3]:i18nValues[3]):swa.consentDenyButton;
      swa.consentStopButton = (swa.consentStopButton === undefined)? (i18nValues[4] == undefined ?defaultConsentValues[4]:i18nValues[4]):swa.consentStopButton;
      swa.consentCloseButton = (swa.consentCloseButton === undefined)? (i18nValues[5] == undefined ?defaultConsentValues[5]:i18nValues[5]):swa.consentCloseButton;
      swa.privacyLinkText = (swa.privacyLinkText === undefined)? (i18nValues[6] == undefined ?defaultConsentValues[6]:i18nValues[6]):swa.privacyLinkText;
      swa.anonymizeButtonText = (swa.anonymizeButtonText === undefined)? (i18nValues[9] == undefined ?defaultConsentValues[9]:i18nValues[9]):swa.anonymizeButtonText;
      swa.customConsentOptionText = (swa.customConsentOptionText === undefined)? (i18nValues[10] == undefined ?defaultConsentValues[10]:i18nValues[10]):swa.customConsentOptionText;
      swa.trackOnStatus = (swa.trackOnStatus === undefined)? (i18nValues[11] == undefined ?defaultConsentValues[11]:i18nValues[11]):swa.trackOnStatus;
      swa.trackOffStatus = (swa.trackOffStatus === undefined)? (i18nValues[12] == undefined ?defaultConsentValues[12]:i18nValues[12]):swa.trackOffStatus;
      swa.trackAnonymousStatus = (swa.trackAnonymousStatus === undefined)? (i18nValues[13] == undefined ?defaultConsentValues[13]:i18nValues[13]):swa.trackAnonymousStatus;
      swa.trackingStatusText = (swa.trackingStatusText === undefined)? (i18nValues[14] == undefined ?defaultConsentValues[14]:i18nValues[14]): swa.trackingStatusText;
      swa.appBannerPrefixText = (swa.appBannerPrefixText === undefined)? (i18nValues[15] == undefined ?defaultConsentValues[15]:i18nValues[15]): swa.appBannerPrefixText;
      swa.appBannerSuffixText = (swa.appBannerSuffixText === undefined)? (i18nValues[16] == undefined ?defaultConsentValues[16]:i18nValues[16]): swa.appBannerSuffixText;
      swa.appBannerOptInText = (swa.appBannerOptInText === undefined)? (i18nValues[17] == undefined ?defaultConsentValues[17]:i18nValues[17]): swa.appBannerOptInText;
      swa.appbannerOptoutText = (swa.appbannerOptoutText === undefined)? (i18nValues[18] == undefined ?defaultConsentValues[18]:i18nValues[18]): swa.appbannerOptoutText;
      swa.appBannerOptinAnonymisedtext = (swa.appBannerOptinAnonymisedtext === undefined)? (i18nValues[19] == undefined ?defaultConsentValues[19]:i18nValues[19]): swa.appBannerOptinAnonymisedtext;
      swa.appBannerOptoutAonymisedtext = (swa.appBannerOptoutAonymisedtext === undefined)? (i18nValues[20] == undefined ?defaultConsentValues[20]:i18nValues[20]): swa.appBannerOptoutAonymisedtext;
      swa.cookieStatementText = (swa.cookieStatementText === undefined)? (i18nValues[21] == undefined ?defaultConsentValues[21]:i18nValues[21]): swa.cookieStatementText;
     
    //Add the privacy link to the "consentOptInText", if any. Handling cases where optIn banner has a link but when opting out, link is added again
    if(swa.privacyLink !== null && swa.consentOptInText !== undefined && swa.consentOptOutText !== undefined && swa.anonymousConsentText !== undefined && swa.anonymousConsentOptOutText !== undefined && swa.consentOptInText.indexOf("href") === -1 && swa.consentOptOutText.indexOf("href") === -1 && swa.anonymousConsentText.indexOf("href") === -1 && swa.anonymousConsentOptOutText.indexOf("href") === -1){
      swa.consentOptInText = swa.consentOptInText.concat(" <a href=" + swa.privacyLink + " target=\"_blank\">" + swa.privacyLinkText + "</a>");
      swa.consentOptOutText = swa.consentOptOutText.concat(" <a href=" + swa.privacyLink + " target=\"_blank\">" + swa.privacyLinkText + "</a>");
      swa.anonymousConsentText = swa.anonymousConsentText.concat(" <a href=" + swa.privacyLink + " target=\"_blank\">" + swa.privacyLinkText + "</a>");
      swa.anonymousConsentOptOutText = swa.anonymousConsentOptOutText.concat(" <a href=" + swa.privacyLink + " target=\"_blank\">" + swa.privacyLinkText + "</a>");
    }
  }


function isLinkBelongToSameDomain(domainVal){
  var clickedDomain = (domainVal.indexOf("//") != -1) ? domainVal.split("//") : domainVal;
		var link = (domainVal.indexOf("//") != -1) ? clickedDomain[1].split("/") : domainVal.split("/");
		if(window.location.hostname != link[0]) {return true;}
		return false;
}
function convertLocaleToDesiredFormat(locale) {
            var locale_reg;
            var regExp = /^((?:[A-Z]{2,3}(?:-[A-Z]{3}){0,3})|[A-Z]{4}|[A-Z]{5,8})(?:-([A-Z]{4}))?(?:-([A-Z]{2}|[0-9]{3}))?((?:-[0-9A-Z]{5,8}|-[0-9][0-9A-Z]{3})*)((?:-[0-9A-WYZ](?:-[0-9A-Z]{2,8})+)*)(?:-(X(?:-[0-9A-Z]{1,8})+))?$/i;
            if (typeof locale === 'string' && (locale_reg = regExp.exec(locale.replace(/_/g, '-')))) {
                var initialLocaleCode = locale_reg[1].toLowerCase();
                var specialCode = locale_reg[2] ? locale_reg[2].toLowerCase() : undefined;
                var langCode = locale_reg[3] ? locale_reg[3].toUpperCase() : undefined;
                var localeCode = locale_reg[4] ? locale_reg[4].slice(1) : undefined;
                if (initialLocaleCode === "zh" && !langCode) {
                    if (specialCode === "hans") {
                        langCode = "CN";
                    } else if (specialCode === "hant") {
                        langCode = "TW";
                    }
                }
                return initialLocaleCode + (langCode ? "_" + langCode + (localeCode ? "_" + localeCode.replace("-", "_") : "") : "");
            }
return "en";
  }

  function getAppNameConsentText(textType) {

    var appNamesuffix = "";
    var consentText = "";
    var appNameprefix = "";
    
    appNamesuffix = swa.appBannerSuffixText.replace("{appName}", swa.appName);
    if (swa.privacyLink === null || swa.privacyLink === "" || swa.privacyLink === undefined || swa.cookieStatementLink === null || swa.cookieStatementLink === undefined ) {
      console.error("The consent does not include a Privacy statement/cookie statement. Please make sure you have configured swa.cookieStatementLink and swa.privacyLink to display consent form");
      swa.disable();
      return;
    }
    else {
      appNamesuffix = appNamesuffix.replace("{privacyLink}", " <a href=" + swa.privacyLink + " target=\"_blank\">" + swa.privacyLinkText + "</a>");
    }
    if(swa.cookieStatementLink !==null && swa.cookieStatementLink !== undefined )
    appNameprefix = swa.appBannerPrefixText.replace("{cookieStatementLink}", " <a href=" + swa.cookieStatementLink + " target=\"_blank\">" + swa.cookieStatementText + "</a>");
    if (swa.anonymousTrackingConsent)
      consentText = appNameprefix.replace("{appName}", swa.appName) + textType.replace("{appName}", swa.appName) + " " + appNamesuffix.replace("{appName}", swa.appName);
    else
      consentText = appNameprefix.replace("{appName}", swa.appName) + textType.replace("{appName}", swa.appName) + " " + appNamesuffix.replace("{appName}", swa.appName);

    return consentText

  }

})();