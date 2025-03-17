/*
* SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
*/
/*global sap*/
sap.ui.define(
[
"jquery.sap.global",
"sap/zen/dsh/firefly/ff8310.zen.buddha",
"jquery.sap.resources"
],
function( jQuery ){
"use strict";
(function(oFF, sap_zen) {
sap.zen.DesignStudio = function() {};
sap.zen.DesignStudio.prototype = new oFF.XObject();
sap.zen.DesignStudio.prototype._ff_c = "DesignStudio";

sap.zen.DesignStudio.prototype.mApplicationName = null;
sap.zen.DesignStudio.prototype.mBIAppPath = null;
sap.zen.DesignStudio.prototype.mClient = null;
sap.zen.DesignStudio.prototype.mDesignMode = false;
sap.zen.DesignStudio.prototype.mDshControlId = null;
sap.zen.DesignStudio.prototype.mHanaMode = false;
sap.zen.DesignStudio.prototype.mHost = null;
sap.zen.DesignStudio.prototype.mLanguage = null;
sap.zen.DesignStudio.prototype.mLocaleString = null;
sap.zen.DesignStudio.prototype.mNewBW = false;
sap.zen.DesignStudio.prototype.mOptimizeDSRequests = false;
sap.zen.DesignStudio.prototype.mPageId = null;
sap.zen.DesignStudio.prototype.mPassword = null;
sap.zen.DesignStudio.prototype.mPort = 0;
sap.zen.DesignStudio.prototype.mProtocol = null;
sap.zen.DesignStudio.prototype.mRepositoryUrl = null;
sap.zen.DesignStudio.prototype.mRightToLeft = false;
sap.zen.DesignStudio.prototype.mSDKLoaderPath = null;
sap.zen.DesignStudio.prototype.mStaticMimesRootPath = null;
sap.zen.DesignStudio.prototype.mSystemAlias = null;
sap.zen.DesignStudio.prototype.mUser = null;
sap.zen.DesignStudio.prototype.mUserAgent = null;
sap.zen.DesignStudio.prototype.moBookmarkRequestHandler = null;
sap.zen.DesignStudio.prototype.moBookmarkService = null;
sap.zen.DesignStudio.prototype.moLandscapeUtils = null;
sap.zen.DesignStudio.prototype.moLocalization = null;
sap.zen.DesignStudio.prototype.moLogging = null;
sap.zen.DesignStudio.prototype.moSDKLoader = null;
sap.zen.DesignStudio.prototype.moTemplateLoader = null;
sap.zen.DesignStudio.prototype.moWindow = null;
sap.zen.DesignStudio.prototype.mtUrlParameters = null;
sap.zen.DesignStudio.prototype.adaptFFForWebDispatcher = function(oLocalHost)
{
	if (!oLocalHost.getSystemType().isTypeOf(oFF.SystemType.BW))
	{
		let loUri = oFF.XUri.create();
		loUri.setProtocolType(oLocalHost.getProtocolType());
		let loHttpClient = oFF.HttpClientFactory.newInstanceByConnection(this.moLandscapeUtils.getApplication().getSession(), loUri);
		let loRequest = loHttpClient.getRequest();
		loRequest.setFromConnectionInfo(oLocalHost);
		loRequest.setPath(oFF.SystemType.BW.getServerInfoPath());
		loRequest.setMethod(oFF.HttpRequestMethod.HTTP_GET);
		loRequest.setAcceptContentType(oFF.ContentType.APPLICATION_JSON);
		let loResponse = loHttpClient.processHttpRequest(oFF.SyncType.BLOCKING, null, null);
		if (!loResponse.hasErrors() && loResponse.getData() !== null && loResponse.getData().getStatusCode() < 400)
		{
			let loJsonContent = loResponse.getData().getJsonContent();
			if (oFF.notNull(loJsonContent) && loJsonContent.isStructure())
			{
				let loRootStructure = loJsonContent.asStructure();
				let loJsonServerInfo = loRootStructure.getStructureByKey("ServerInfo");
				if (oFF.notNull(loJsonServerInfo))
				{
					let lClient = loJsonServerInfo.getStringByKey("Client");
					if (oFF.notNull(lClient))
					{
						this.mClient = lClient;
						oLocalHost.setClient(lClient);
					}
				}
			}
		}
	}
};
sap.zen.DesignStudio.prototype.createPage = function()
{
	if (oFF.isNull(this.moSDKLoader))
	{
		this.moSDKLoader = new sap.zen.SDKLoader();
	}
	if (oFF.isNull(this.moLogging))
	{
		this.moLogging = sap.buddha.XLogging.create();
	}
	if (oFF.isNull(this.moLocalization))
	{
		this.moLocalization = sap.buddha.XLocalization.create();
	}
	this.moSDKLoader.setRelativePath(this.mSDKLoaderPath);
	this.moSDKLoader.setRuntimePath(this.mStaticMimesRootPath);
	if (oFF.isNull(this.moLandscapeUtils))
	{
		this.moLandscapeUtils = new sap.zen.LandscapeUtils();
	}
	if (oFF.isNull(this.mLanguage) || oFF.XString.size(this.mLanguage) === 0)
	{
		this.mLanguage = "EN";
	}
	this.moLandscapeUtils.doInit(this.mLanguage);
	if (oFF.isNull(this.moWindow))
	{
		this.moWindow = sap.buddha.XWindow.create();
	}
	if (oFF.isNull(this.mHost) || oFF.XString.size(this.mHost) === 0)
	{
		this.mHost = "localhost";
	}
	if (!oFF.XString.endsWith(this.mBIAppPath, "/"))
	{
		this.mBIAppPath = oFF.XStringUtils.concatenate2(this.mBIAppPath, "/");
	}
	this.moWindow.setLocale(this.mLocaleString);
	let loSelfSystem = this.moLandscapeUtils.getSelf();
	if (oFF.isNull(loSelfSystem))
	{
		if (this.mNewBW || oFF.XStringUtils.isNotNullAndNotEmpty(this.mClient))
		{
			loSelfSystem = this.moLandscapeUtils.addSelfBW(this.mHost, this.mPort, this.mProtocol, this.mClient, this.mSystemAlias, this.mNewBW);
		}
		else
		{
			loSelfSystem = this.moLandscapeUtils.addSelf(this.mHost, this.mPort, this.mProtocol);
		}
		if (oFF.notNull(this.mUser) && oFF.XString.size(this.mUser) > 0)
		{
			loSelfSystem.setUser(this.mUser);
		}
		if (oFF.notNull(this.mPassword) && oFF.XString.size(this.mPassword) > 0)
		{
			loSelfSystem.setPassword(this.mPassword);
		}
		if (oFF.isNull(this.moTemplateLoader) && oFF.isNull(this.moBookmarkRequestHandler))
		{
			this.moTemplateLoader = new sap.zen.TemplateLoader();
			this.moBookmarkRequestHandler = new sap.zen.BookmarkRequestHandler();
			let lSystemType = loSelfSystem.getSystemType();
			if (lSystemType.isTypeOf(oFF.SystemType.ABAP))
			{
				this.adaptFFForWebDispatcher(loSelfSystem);
				this.moTemplateLoader.initBaseBW(this.moLandscapeUtils.getApplication(), loSelfSystem, this.mApplicationName, this.mRepositoryUrl);
				this.moBookmarkRequestHandler.initBaseBW(this.moLandscapeUtils.getApplication(), loSelfSystem);
			}
			else
			{
				let s = this.mBIAppPath;
				if (oFF.XString.startsWith(s, "http://"))
				{
					s = oFF.XString.substring(s, 7, -1);
					let ix = oFF.XString.indexOf(s, "/");
					s = oFF.XString.substring(s, ix, -1);
				}
				else if (oFF.XString.startsWith(s, "https://"))
				{
					s = oFF.XString.substring(s, 8, -1);
					let ix2 = oFF.XString.indexOf(s, "/");
					s = oFF.XString.substring(s, ix2, -1);
				}
				s = oFF.XStringUtils.concatenate2(s, "content.biapp");
				this.moTemplateLoader.initBase(this.moLandscapeUtils.getApplication(), loSelfSystem, s);
				this.moBookmarkRequestHandler.initBase(this.moLandscapeUtils.getApplication(), loSelfSystem, s);
			}
		}
	}
	if (oFF.isNull(this.moBookmarkService))
	{
		this.moBookmarkService = new sap.zen.BookmarkService();
		this.moBookmarkService.setup();
	}
	if (oFF.isNull(this.mDshControlId))
	{
		this.mDshControlId = "";
	}
	let loTemplateService = new sap.zen.ZenTemplateService();
	let loPage = loTemplateService.createPage(this.moLandscapeUtils.getApplication(), this.moWindow, this.mApplicationName, this.mBIAppPath, this.mHanaMode, this.mtUrlParameters, this.mDesignMode, this.mDshControlId, this.moSDKLoader, this.mPageId, this.moTemplateLoader, this.mUserAgent, this.moBookmarkService, this.moBookmarkRequestHandler, this.mOptimizeDSRequests, this.moLogging, this.moLocalization, this.mRightToLeft);
	loPage.setLocalPort(this.mPort);
	return loPage;
};
sap.zen.DesignStudio.prototype.setApplicationName = function(applicationName)
{
	this.mApplicationName = applicationName;
};
sap.zen.DesignStudio.prototype.setApplicationPath = function(biappPath)
{
	this.mBIAppPath = biappPath;
};
sap.zen.DesignStudio.prototype.setBookmarkRequestHandler = function(oBookmarkRequestHandler)
{
	this.moBookmarkRequestHandler = oBookmarkRequestHandler;
};
sap.zen.DesignStudio.prototype.setBookmarkService = function(oBookmarkService)
{
	this.moBookmarkService = oBookmarkService;
};
sap.zen.DesignStudio.prototype.setClient = function(client)
{
	this.mClient = client;
};
sap.zen.DesignStudio.prototype.setDesignMode = function(designMode)
{
	this.mDesignMode = designMode;
};
sap.zen.DesignStudio.prototype.setDshControlId = function(dshControlId)
{
	this.mDshControlId = dshControlId;
};
sap.zen.DesignStudio.prototype.setHanaMode = function(hanaMode)
{
	this.mHanaMode = hanaMode;
};
sap.zen.DesignStudio.prototype.setHost = function(host)
{
	this.mHost = host;
};
sap.zen.DesignStudio.prototype.setLandscapeUtils = function(oLandscapeUtils)
{
	this.moLandscapeUtils = oLandscapeUtils;
};
sap.zen.DesignStudio.prototype.setLanguage = function(language)
{
	this.mLanguage = language;
};
sap.zen.DesignStudio.prototype.setLocaleString = function(localeString)
{
	this.mLocaleString = localeString;
};
sap.zen.DesignStudio.prototype.setLocalization = function(oLocalization)
{
	this.moLocalization = oLocalization;
};
sap.zen.DesignStudio.prototype.setLogging = function(oLogging)
{
	this.moLogging = oLogging;
};
sap.zen.DesignStudio.prototype.setNewBW = function(newBW)
{
	this.mNewBW = newBW;
};
sap.zen.DesignStudio.prototype.setOptimizeDSRequests = function(optimizeDSRequests)
{
	this.mOptimizeDSRequests = optimizeDSRequests;
};
sap.zen.DesignStudio.prototype.setPageId = function(pageId)
{
	this.mPageId = pageId;
};
sap.zen.DesignStudio.prototype.setPassword = function(password)
{
	this.mPassword = password;
};
sap.zen.DesignStudio.prototype.setPort = function(port)
{
	this.mPort = port;
};
sap.zen.DesignStudio.prototype.setProtocol = function(protocol)
{
	this.mProtocol = protocol;
};
sap.zen.DesignStudio.prototype.setRepositoryUrl = function(url)
{
	this.mRepositoryUrl = url;
};
sap.zen.DesignStudio.prototype.setRightToLeft = function(rightToLeft)
{
	this.mRightToLeft = rightToLeft;
};
sap.zen.DesignStudio.prototype.setSdkLoader = function(oSDKLoader)
{
	this.moSDKLoader = oSDKLoader;
};
sap.zen.DesignStudio.prototype.setSdkLoaderPath = function(SDKLoaderPath)
{
	this.mSDKLoaderPath = SDKLoaderPath;
};
sap.zen.DesignStudio.prototype.setStaticMimesRootPath = function(path)
{
	this.mStaticMimesRootPath = path;
};
sap.zen.DesignStudio.prototype.setSystemAlias = function(alias)
{
	this.mSystemAlias = alias;
};
sap.zen.DesignStudio.prototype.setTemplateLoader = function(oTemplateLoader)
{
	this.moTemplateLoader = oTemplateLoader;
};
sap.zen.DesignStudio.prototype.setUrlParameter = function(tUrlParameters)
{
	this.mtUrlParameters = tUrlParameters;
};
sap.zen.DesignStudio.prototype.setUser = function(name)
{
	this.mUser = name;
};
sap.zen.DesignStudio.prototype.setUserAgent = function(userAgent)
{
	this.mUserAgent = userAgent;
};
sap.zen.DesignStudio.prototype.setXWindow = function(oWindow)
{
	this.moWindow = oWindow;
};

sap.zen.LandscapeUtils = function() {};
sap.zen.LandscapeUtils.prototype = new oFF.XObject();
sap.zen.LandscapeUtils.prototype._ff_c = "LandscapeUtils";

sap.zen.LandscapeUtils.registerComponentFactory = function(componentName, oPageFactory)
{
	sap.zen.ZenTemplateService.soFactory.registerFactory(componentName, oPageFactory);
};
sap.zen.LandscapeUtils.prototype.mInitialized = false;
sap.zen.LandscapeUtils.prototype.mLanguage = null;
sap.zen.LandscapeUtils.prototype.moApplication = null;
sap.zen.LandscapeUtils.prototype.moLandscape = null;
sap.zen.LandscapeUtils.prototype.addSelf = function(host, port, protocol)
{
	let loSystem = this.moLandscape.createSystem();
	loSystem.setLanguage(this.mLanguage);
	loSystem.setSystemType(oFF.SystemType.HANA);
	loSystem.setName("self");
	loSystem.setText("self");
	loSystem.setHost(host);
	loSystem.setPort(port);
	loSystem.setAuthenticationType(oFF.AuthenticationType.BASIC);
	loSystem.setProtocolType(oFF.XString.isEqual("https", protocol) ? oFF.ProtocolType.HTTPS : oFF.ProtocolType.HTTP);
	this.moLandscape.setSystemByDescription(loSystem);
	return loSystem;
};
sap.zen.LandscapeUtils.prototype.addSelfBW = function(host, port, protocol, client, systemAlias, newBW)
{
	let loSystem = this.moLandscape.createSystem();
	loSystem.setLanguage(this.mLanguage);
	loSystem.setSystemType(newBW ? oFF.SystemType.BW : oFF.SystemType.ABAP);
	loSystem.setName("self");
	loSystem.setText("self");
	loSystem.setHost(host);
	loSystem.setPort(port);
	if (oFF.XStringUtils.isNotNullAndNotEmpty(client))
	{
		loSystem.setClient(client);
	}
	loSystem.setTimeout(60000);
	loSystem.setAuthenticationType(oFF.AuthenticationType.BASIC);
	loSystem.setProtocolType(oFF.XString.isEqual("https", protocol) ? oFF.ProtocolType.HTTPS : oFF.ProtocolType.HTTP);
	loSystem.setAlias(systemAlias);
	this.moLandscape.setSystemByDescription(loSystem);
	return loSystem;
};
sap.zen.LandscapeUtils.prototype.doInit = function(language)
{
	if (this.mInitialized)
	{
		return;
	}
	this.mInitialized = true;
	oFF.IpProviderModule.getInstance();
	sap.zen.BuddhaModule.getInstance();
	this.moApplication = oFF.ApplicationFactory.createDefaultApplicationWithVersion(oFF.XVersion.DEFAULT_VALUE);
	this.moLandscape = oFF.StandaloneSystemLandscape.create(this.getApplication());
	this.mLanguage = language;
	this.getApplication().setSystemLandscape(this.moLandscape);
};
sap.zen.LandscapeUtils.prototype.getApplication = function()
{
	return this.moApplication;
};
sap.zen.LandscapeUtils.prototype.getSelf = function()
{
	return this.moLandscape.getSystemDescription("self");
};
sap.zen.LandscapeUtils.prototype.getSystem = function(name)
{
	return this.moLandscape.getSystemDescription(name);
};
}
 )(sap.firefly, sap.zen);
}
);