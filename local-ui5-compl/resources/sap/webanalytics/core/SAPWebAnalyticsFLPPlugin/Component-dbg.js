/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/Component",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/thirdparty/jquery"
], function(Component, ResourceModel, jQuery) {
	"use strict";

	var SWAComponent = Component.extend("sap.webanalytics.core.SAPWebAnalyticsFLPPlugin.Component", {

		metadata: {
			manifest: "json",
			i18n: "./i18n/i18n.properties",
			includes: ["./css/style.css"]
		},
        /*global window, sap , document*/
		// Init function called on initialization
		init: function () {
			var oPluginParameters = this.getComponentData().config; // obtain plugin parameters
			var SWA_PUB_TOKEN = "", TRACKING_URL = "", USR = "",ANONYMOUS_TRACKING_CONSENT="",LANGUAGE_CONSENT_CODE="",CONSENT_STYLE="",PRIVACY_LINK="",APP_NAME="", COOKIE_STATEMENT="";
			//Read the variables and pass them
			SWA_PUB_TOKEN = oPluginParameters.SWA_PUB_TOKEN;
			TRACKING_URL = oPluginParameters.SWA_BASE_URL;
			ANONYMOUS_TRACKING_CONSENT = oPluginParameters.ANON_TRK_ON_DENY;	
			LANGUAGE_CONSENT_CODE = oPluginParameters.SWA_CONSENT_LANGUAGE;
            CONSENT_STYLE = oPluginParameters.SWA_CONSENT_STYLE;
			PRIVACY_LINK = oPluginParameters.SWA_PRIVACY_LINK;	
			APP_NAME =	oPluginParameters.SWA_APP_NAME;
			COOKIE_STATEMENT = oPluginParameters.COOKIE_STATEMENT;
			if (oPluginParameters.SWA_USER === 'true')
                        USR = sap.ushell.Container.getUser().getEmail();
			if(SWA_PUB_TOKEN !== "" && 	TRACKING_URL !== ""){	
			var snippetVariables = [SWA_PUB_TOKEN,TRACKING_URL,USR,ANONYMOUS_TRACKING_CONSENT,LANGUAGE_CONSENT_CODE,CONSENT_STYLE,PRIVACY_LINK,APP_NAME,COOKIE_STATEMENT];
			//Load i18n file
			this.setModel(new ResourceModel({
				bundleName: "sap.webanalytics.core.SAPWebAnalyticsFLPPlugin.i18n.i18n"
            }), "i18n");
			this.loadSWAObject(snippetVariables);	
			this.loadConsentTextOnDemand();		
			this._subscribeEvents();
			this.loadWebGUI();
			}
		},
		/*Subscribing to App Opened Event */
		_subscribeEvents:function(){
			sap.ui.getCore().getEventBus().subscribe("sap.ushell","appOpened",this.appOpened,this);
			},
			appOpened:function(e1,e2,appMeta){
				if(appMeta.navigationMode == "newWindow") {
					window.swa.pageTitle =appMeta.text;
					}
					window.swa.trackLoad();
					window.swa.pageTitle="";
			},
		loadConsentTextOnDemand: function () {
			var that = this;
			var rendererPromise = this._getRenderer();
			var oEntry = {
				title: that.getModel("i18n").getProperty("CUSTOM_CONSENT_OPTION"),
				icon: "sap-icon://approvals",
				value: function () {
					return jQuery.Deferred().resolve("");
				},
				content: function () {
					var swaConsent = that.createContent(window.swa.isConsentBannerEnabled());
					return jQuery.Deferred().resolve(swaConsent);
				},
				onSave: function () {
					//Settings can be changed only when SWA default consent banner is used.
					if(window.swa.isConsentBannerEnabled()){
						//If the settings dialog is opened for the first time and user clicks on save without changing checkbox state, swaConsentDecision value is undefined
						if (window.swaConsentDecision === undefined)
							window.swaConsentDecision = window.sap.ui.getCore().getControl("swaConsentCheckBox").getSelected();

						//If anonymous tracking is ON and "Allow" is checked, identified tracking should begin
						if (window.swa.anonymousTrackingConsent && window.swaConsentDecision) {
							window.swa.saveConsentDecision(true);
						}
						//If identified tracking is ON and user unchecks the checkbox, anonymous tracking should start
						else if (!window.swaConsentDecision && window.swa.anonymousTrackingConsent) {
							window.swa.saveConsentDecision(false);
						}
						//When anonymous tracking is OFF - if tracking is ON already, do nothing. If not, start tracking and store the tracking decision
						else if (!window.swa.anonymousTrackingConsent && window.swaConsentDecision && !window.swa.getTrackingStatus()) {
							window.swa.saveConsentDecision(true);
						}
						//If the decision is to stop tracking, we honour the decision for 7 days. Do nothing if tracking is already stopped (case when user opens settings and simply clicks on Save)
						else if (!window.swa.anonymousTrackingConsent && !window.swaConsentDecision && window.swa.getTrackingStatus()) {
							window.swa.saveConsentDecision(false);
						}
					}

					return jQuery.Deferred().resolve("");
				},
				onCancel: function () {
					//If the consent setting is changed and not saved, undo the change - only when banner is enabled
					if (window.swa.isConsentBannerEnabled()) {
						if (window.swa.getTrackingStatus() === true)
							sap.ui.getCore().getControl("swaConsentCheckBox").setSelected(true);
						else
							sap.ui.getCore().getControl("swaConsentCheckBox").setSelected(false);
					}
				}
			};

			rendererPromise.then(function (oRenderer) {
				oRenderer.addUserPreferencesEntry(oEntry);
			}, true, false, [sap.ushell.renderers.fiori2.RendererExtensions.LaunchpadState.Home]);
		},

		createContent: function (isConsentBannerEnabled) {
			//Consent text is set based on banner and anonymousTracking properties && default status is shown based on tracking status when banner isn't used
			var swaConsent = new sap.m.Page("swaConsent", {
				content: "",
				showHeader: false
			});
			if (!isConsentBannerEnabled) {
				var hbox = new sap.m.HBox("status", {});
				var statusLabel = new sap.m.Label("trackStatus", {
					text: window.swa.trackingStatusText
				});
				statusLabel.addStyleClass("statusLabel");
				hbox.addItem(statusLabel);
				var trackStatus = (window.swa.getTrackingStatus() === false) ? window.swa.trackOffStatus : (window.swa.getTrackingStatus() ===
					true) ? window.swa.trackOnStatus : window.swa.trackAnonymousStatus;
				var statusText = new sap.m.Text("swaStatusText", {
					text: trackStatus
				});
				statusText.addStyleClass("trackStatus");
				hbox.addItem(statusText);
				swaConsent.addContent(hbox);
			} else {
				var consentText = (window.swa.anonymousTrackingConsent) ? window.swa.anonymousConsentText : window.swa.consentOptInText;
				var appNamesuffix = "";
				var appNameprefix = "";
				if (window.swa.appName !== null && window.swa.appName !== undefined && window.swa.appName !== "") {
					appNamesuffix = window.swa.appBannerSuffixText != null && window.swa.appBannerSuffixText != undefined ? window.swa.appBannerSuffixText.replace("{appName}", window.swa.appName) : "";
					if (window.swa.privacyLink === null || window.swa.privacyLink === "" || window.swa.privacyLink === undefined) {
						appNamesuffix = appNamesuffix.replace("{privacyLink}", "");

					}
					else {
						appNamesuffix = appNamesuffix.replace("{privacyLink}", window.swa.privacyLinkText);
					}
					if(window.swa.cookieStatementLink !==null && window.swa.cookieStatementLink !== undefined )
					appNameprefix = window.swa.appBannerPrefixText.replace("{cookieStatementLink}", " <a href=" + window.swa.cookieStatementLink + ">" + window.swa.cookieStatementText + "</a>");
					
					if (window.swa.anonymousTrackingConsent)
						consentText = window.swa.appBannerPrefixText != null && window.swa.appBannerPrefixText != undefined ? appNameprefix.replace("{appName}", window.swa.appName) + window.swa.appBannerOptinAnonymisedtext + appNamesuffix.replace("{appName}", window.swa.appName) : "";
					else
					consentText = window.swa.appBannerPrefixText != null && window.swa.appBannerPrefixText != undefined ? appNameprefix.replace("{appName}", window.swa.appName) + window.swa.appBannerOptInText.replace("{appName}", window.swa.appName) + " " + appNamesuffix.replace("{appName}", window.swa.appName) : "";
				}
				//Extracting only the text without privacy link's anchor tag, if privacy link is provided
				if(consentText.indexOf("<a") !== -1)
					consentText = consentText.substring(0, consentText.indexOf("<a") - 1);
				var consentBannerText = new sap.m.Text("swaConsentOptInOutText", {
					text: consentText
				});
				swaConsent.addContent(consentBannerText);
				consentBannerText.addStyleClass("text");
				if (window.swa.privacyLink !== null) {
					var link = new sap.m.Link("swaPrivacyLink", {
						href: window.swa.privacyLink,
						target: "_blank",
						text: window.swa.privacyLinkText
					});
					link.addStyleClass("link");
					swaConsent.addContent(link);
				}
				//Check box will be un-checked for anonymous tracking as well
				var checkBox = new sap.m.CheckBox("swaConsentCheckBox", {
					text: window.swa.consentAllowButton,
					select: this.onConsentChange,
					selected: (window.swa.getTrackingStatus() === true) ? true : false
				});
				checkBox.addStyleClass("checkBox");
				swaConsent.addContent(checkBox);
			}
			return swaConsent;
		},

		onConsentChange: function (oEvent) {
			window.swaConsentDecision = (oEvent.getSource().getSelected()) ? true : false;
		},

		_getRenderer: function () {
			var that = this,
				oDeferred = new jQuery.Deferred(),
				oRenderer;

			that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
			if (!that._oShellContainer) {
				oDeferred.reject(
					"Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");
			} else {
				oRenderer = that._oShellContainer.getRenderer();
				if (oRenderer) {
					oDeferred.resolve(oRenderer);
				} else {
					// renderer not initialized yet, listen to rendererCreated event
					that._onRendererCreated = function (oEvent) {
						oRenderer = oEvent.getParameter("renderer");
						if (oRenderer) {
							oDeferred.resolve(oRenderer);
						} else {
							oDeferred.reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.");
						}
					};
					that._oShellContainer.attachRendererCreatedEvent(that._onRendererCreated);
				}
			}
			return oDeferred.promise();
		},

		// create SWA object and load track.js
		loadSWAObject: function(snippetVariables) {
			window.swa = {
				pubToken: snippetVariables[0],
				baseUrl: snippetVariables[1],
				subSiteId: this.setSubSiteId,
				owner: snippetVariables[2],
				anonymousTrackingConsent:(snippetVariables[3]  === 'true')?1:0,
				custom1: {ref: this.getCustomAttributes(snippetVariables[2])[0]},
				custom2: {ref: this.getCustomAttributes(snippetVariables[2])[1]},
				custom3: {ref: this.getCustomAttributes(snippetVariables[2])[2]},
				custom4: {ref: this.getCustomAttributes(snippetVariables[2])[3]},
				custom5: {ref: this.getCustomAttributes(snippetVariables[2])[4] },
				dataAnonymiseCallback:this.anonymiseCallBack
			};
			if(snippetVariables[4] !== "" && snippetVariables[4] !== undefined)
			window.swa.consentFormLanguage=snippetVariables[4];
				if(snippetVariables[5] !== "" && snippetVariables[5] !== undefined)
			window.swa.consentStyle=snippetVariables[5];
				if(snippetVariables[6] !== "" && snippetVariables[6] !== undefined)
			window.swa.privacyLink=snippetVariables[6];
			if(snippetVariables[7] !== "" && snippetVariables[7] !== undefined)
			window.swa.appName=snippetVariables[7];
			window.swa.cookieStatementLink=snippetVariables[8];
			window.swa.disableRouteMatched=true;
			var d = document, g = d.createElement("script"), s = d.getElementsByTagName("script")[0];
			g.type = "text/javascript";
			g.defer = true;
			g.async = true;
			g.src = sap.ui.require.toUrl("sap/webanalytics/core/tracker/js/track.js");
			s.parentNode.insertBefore(g, s);

			window.onhashchange = function () {
				var hashVal=window.location.hash;
				var sOldShellHashLowerCase = hashVal.toLowerCase();
					//All option to verify that we're navigating from the home page
				var bNavigateToHomepage = sOldShellHashLowerCase.indexOf("shell-home") >= 0 ||
				sOldShellHashLowerCase.indexOf("launchpad-openflppage") >= 0 ||
				sOldShellHashLowerCase.indexOf("shell-appfinder") >= 0;
				if (bNavigateToHomepage){
					if( sOldShellHashLowerCase.indexOf("shell-appfinder") >= 0)
		window.swa.pageTitle = "App Finder";
			window.swa.trackLoad();
				window.swa.pageTitle ="";
					}
			};
		},
//callback function to set pagetitle
anonymiseCallBack: function(){
	var anonymisedObject = {};
	if(window.swa.pageTitle != undefined && window.swa.pageTitle !="")
	anonymisedObject.pageTitle=window.swa.pageTitle;
		return anonymisedObject;
   },



    /*Method which returns custom attributes to SWA object */	 
	getCustomAttributes: function(usr) {
		var customAttributes=[];
		if(typeof sap !== "undefined" )
      {
         if(usr !== '')
         customAttributes[0]=sap.ushell.Container.getUser().getId();
         else
         customAttributes[0]="";
         customAttributes[1]= sap.ushell.Container.getLogonSystem().getClient();
         customAttributes[2] = sap.ushell.Container.getLogonSystem().getName();
         customAttributes[3] = (sap.ushell.services.AppConfiguration.getCurrentApplication() !== null)? sap.ushell.services.AppConfiguration.getCurrentApplication().inboundPermanentKey : "";
customAttributes[4] = (sap.ushell.services.AppConfiguration.getCurrentApplication() !== null)? sap.ushell.services.AppConfiguration.getCurrentApplication().ui5ComponentName : "";
}
return customAttributes;
		},
		
		/*Method which listens to web gui announce event and then send the postmessage with baseurl,pubtoken and type as request*/
		loadWebGUI: function () {
			var trackingResourceUrl = sap.ui.require.toUrl("sap/webanalytics/core/tracker/js/track.js");
			if (window.addEventListener) {
				window.addEventListener("message", function (e) {
					var guiresponse = JSON.parse(e.data);
					if (guiresponse.service === "sap.its.readyToListen" && guiresponse.type === "announce") {
						var swaCookies = escape(window.parent.document.cookie);                         
                   var body = {
                   "type": "request",
                   "service": "sap.its.trackSWA",
			"pubToken": window.swa.pubToken,
			"owner": window.swa.owner,
			"baseUrl": window.swa.baseUrl,
			"trackAnonymous": window.swa.anonymousTrackingConsent,
                   "message": "Response from SWA",
                   "isConsentGiven": true,
                   "cookieVal": swaCookies,
                   "trackingResourceUrl": trackingResourceUrl				   
                   };
						//post the message with pub token and base url
						e.source.postMessage(JSON.stringify(body), e.origin);
					}
				});
			}
		},

		
		
		//Set the subsiteid as each FLP tile where a system acts as a site
		setSubSiteId: function() {
			var subSite = "";

			if (window.location.href.substring(window.location.href.indexOf("#")) !== -1) {
				subSite = window.location.href.substring(window.location.href.indexOf("#") + 1);
			}
			if (subSite.indexOf("&") !== -1) {
				subSite = subSite.substring(0, subSite.indexOf("&"));
			}

			return (subSite !== "") ? subSite : undefined;
		}

	});

	return SWAComponent;

});