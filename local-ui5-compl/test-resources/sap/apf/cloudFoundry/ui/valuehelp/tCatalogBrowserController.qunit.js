sap.ui.define([
	"sap/apf/cloudFoundry/ui/valuehelp/controller/CatalogBrowser.controller",
	"sap/apf/cloudFoundry/ui/utils/ODataServiceUtils",
	"sap/ui/core/mvc/View",
	"sap/ui/core/mvc/ViewType",
	"sap/ui/model/json/JSONModel",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (CatalogBrowser, ODataServiceUtils, View, ViewType, JSONModel, sinon) {
	"use strict";

	QUnit.module("Formatters", {
		beforeEach: function() {
			this.oCatalogBrowser = new CatalogBrowser();
			this.oCatalogBrowser.translate = function(t) {
				return t;
			};
		},
		afterEach: function() {
			this.oCatalogBrowser.destroy();
		}
	});
	QUnit.test("Analytical Service Information", function (assert) {
		assert.strictEqual(this.oCatalogBrowser.serviceStatusIcon(ODataServiceUtils.SERVICE_STATUS.ANALYTICAL_SERVICE), "sap-icon://status-positive", "Analytical Service icon is correct");
		assert.strictEqual(this.oCatalogBrowser.serviceStatusIcon(ODataServiceUtils.SERVICE_STATUS.NOT_ANALYTICAL_SERVICE), "sap-icon://status-critical", "Not Analytical Service icon is correct");
		assert.strictEqual(this.oCatalogBrowser.serviceStatusIcon(ODataServiceUtils.SERVICE_STATUS.WRONG_ODATA_VERSION), "sap-icon://status-error", "Wrong OData Version icon is correct");
		assert.strictEqual(this.oCatalogBrowser.serviceStatusIcon(ODataServiceUtils.SERVICE_STATUS.NOT_ACCESSIBLE), "sap-icon://status-error", "Service Not Accessible icon is correct");
		assert.strictEqual(this.oCatalogBrowser.serviceStatusIcon(""), "sap-icon://status-inactive", "Pending Analytical Service Information icon is correct");

		assert.strictEqual(this.oCatalogBrowser.serviceStatusState(ODataServiceUtils.SERVICE_STATUS.ANALYTICAL_SERVICE), "Success", "Analytical Service state is correct");
		assert.strictEqual(this.oCatalogBrowser.serviceStatusState(ODataServiceUtils.SERVICE_STATUS.NOT_ANALYTICAL_SERVICE), "Warning", "Not Analytical Service state is correct");
		assert.strictEqual(this.oCatalogBrowser.serviceStatusState(ODataServiceUtils.SERVICE_STATUS.WRONG_ODATA_VERSION), "Error", "Wrong OData Version state is correct");
		assert.strictEqual(this.oCatalogBrowser.serviceStatusState(ODataServiceUtils.SERVICE_STATUS.NOT_ACCESSIBLE), "Error", "Service Not Accessible state is correct");
		assert.strictEqual(this.oCatalogBrowser.serviceStatusState(""), "None", "Pending Analytical Service state is correct");

		assert.strictEqual(this.oCatalogBrowser.serviceStatusText(ODataServiceUtils.SERVICE_STATUS.ANALYTICAL_SERVICE), "analyticalService", "Analytical Service text is correct");
		assert.strictEqual(this.oCatalogBrowser.serviceStatusText(ODataServiceUtils.SERVICE_STATUS.NOT_ANALYTICAL_SERVICE), "nonAnalyticalService", "Not Analytical Service text is correct");
		assert.strictEqual(this.oCatalogBrowser.serviceStatusText(ODataServiceUtils.SERVICE_STATUS.WRONG_ODATA_VERSION), "wrongOdataVersion", "Wrong OData Version text is correct");
		assert.strictEqual(this.oCatalogBrowser.serviceStatusText(ODataServiceUtils.SERVICE_STATUS.NOT_ACCESSIBLE), "serviceNotAccessible", "Service Not Accessible text is correct");
		assert.strictEqual(this.oCatalogBrowser.serviceStatusText(""), "pending", "Pending Analytical Service text is correct");
	});
	QUnit.test("Proxy Type", function(assert) {
		assert.strictEqual(this.oCatalogBrowser.proxyTypeIcon("OnPremise"), "sap-icon://it-host", "OnPremise icon is correct");
		assert.strictEqual(this.oCatalogBrowser.proxyTypeIcon("Internet"), "sap-icon://cloud", "Cloud icon is correct");
		assert.strictEqual(this.oCatalogBrowser.proxyTypeIcon("None"), "sap-icon://cloud", "fallback icon is correct");

		assert.strictEqual(this.oCatalogBrowser.proxyTypeText("OnPremise"), "onPremise", "OnPremise text is correct");
		assert.strictEqual(this.oCatalogBrowser.proxyTypeText("Internet"), "cloud", "Cloud text is correct");
		assert.strictEqual(this.oCatalogBrowser.proxyTypeText("None"), "cloud", "fallback text is correct");
	});

	QUnit.module("Analytical Service Checks", {
		beforeEach: function() {
			var env = this;
			env.oCatalogBrowser = new CatalogBrowser();
			// stub getModel
			env.oUiModel = new JSONModel({
				Destination: "testDest",
				Service: "/testService",
				IsAnalyticalService: undefined
			});
			env.stubGetModel = sinon.stub();
			env.stubGetModel.withArgs("ui").returns(env.oUiModel);
			// stub getView
			env.stubGetView = sinon.stub(env.oCatalogBrowser, "getView");
			env.stubGetView.returns({
				getModel: env.stubGetModel
			});
			// create fake server
			env.server = sinon.fakeServer.create();
			// respondImmediately = true is not suitable, as this would create a synchronous response
			env.server.autoRespond  = true;
			env.server.autoRespondAfter = 0;
			// MockServer globally changes this from default (false) to true and sets its own filters. Make sure it's false here
			sinon.FakeXMLHttpRequest.useFilters = false;
		},
		afterEach: function() {
			this.stubGetView.restore();
			this.oCatalogBrowser.destroy();
			this.server.restore();
			sinon.FakeXMLHttpRequest.useFilters = true;
		}
	});
	QUnit.test("Service is an Analytical Service", function(assert) {
		this.oUiModel.setProperty("/Service", "/analyticalService");
		this.server.respondWith("GET", "/destination/testDest/analyticalService/$metadata", [200, { "Content-Type": "application/xml" }, '<?xml version="1.0" encoding="utf-8"?><edmx:Edmx Version="1.0" xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns:sap="http://www.sap.com/Protocols/SAPData"><edmx:Reference Uri="https://ldciuyr:44300/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName=\'%2FIWBEP%2FVOC_COMMON\',Version=\'0001\',SAP__Origin=\'QM7CLNT715\')/$value" xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx"><edmx:Include Namespace="com.sap.vocabularies.Common.v1" Alias="Common"/></edmx:Reference><edmx:DataServices m:DataServiceVersion="2.0"><Schema Namespace="CAPF_FLIGHT_CDS" xml:lang="en" sap:schema-version="1" xmlns="http://schemas.microsoft.com/ado/2008/09/edm"><EntityType Name="CAPF_FLIGHTType" sap:label="Test Content APF" sap:semantics="aggregate" sap:content-version="1"><Key><PropertyRef Name="ID"/></Key><Property Name="ID" Type="Edm.String" Nullable="false" sap:filterable="false" sap:updatable="false" sap:sortable="false"/><Property Name="TotaledProperties" Type="Edm.String" sap:aggregation-role="totaled-properties-list" sap:is-annotation="true" sap:updatable="false" sap:sortable="false"/><Property Name="AirlineCode" Type="Edm.String" MaxLength="3" sap:aggregation-role="dimension" sap:creatable="false" sap:text="AirlineName" sap:updatable="false" sap:label="Airline"/><Property Name="AirlineName" Type="Edm.String" MaxLength="1333" sap:creatable="false" sap:filterable="false" sap:updatable="false" sap:label="Airline (Description)"/><Property Name="Currency" Type="Edm.String" MaxLength="5" sap:aggregation-role="dimension" sap:creatable="false" sap:updatable="false" sap:label="Airline Currency" sap:semantics="currency-code"/><Property Name="FlightDate" Type="Edm.String" MaxLength="10" sap:aggregation-role="dimension" sap:creatable="false" sap:text="FlightDate_T" sap:updatable="false" sap:label="Flight Date" sap:semantics="yearmonthday"/><Property Name="FlightDate_T" Type="Edm.String" MaxLength="10" sap:creatable="false" sap:filterable="false" sap:updatable="false" sap:label="Flight Date (Description)"/><Property Name="FlightConnectionNumber" Type="Edm.String" MaxLength="4" sap:aggregation-role="dimension" sap:creatable="false" sap:updatable="false" sap:label="Connection Number"/><Property Name="Amount" Type="Edm.Decimal" Precision="42" Scale="2" sap:aggregation-role="measure" sap:creatable="false" sap:filterable="false" sap:text="Amount_F" sap:unit="Currency" sap:updatable="false" sap:label="Booking total"/><Property Name="Amount_F" Type="Edm.String" MaxLength="60" sap:creatable="false" sap:filterable="false" sap:updatable="false" sap:label="Booking total (Formatted)"/><Property Name="MaxCapacity" Type="Edm.Decimal" Precision="42" Scale="0" sap:aggregation-role="measure" sap:creatable="false" sap:filterable="false" sap:text="MaxCapacity_F" sap:updatable="false" sap:label="Max. capacity econ."/><Property Name="MaxCapacity_F" Type="Edm.String" MaxLength="60" sap:creatable="false" sap:filterable="false" sap:updatable="false" sap:label="Max. capacity econ. (Formatted)"/></EntityType><EntityType Name="AirlineCode" sap:label="Airline (Master Data)" sap:content-version="1"><Key><PropertyRef Name="AirlineCode_ID"/></Key><Property Name="AirlineCode_ID" Type="Edm.String" Nullable="false" MaxLength="3" sap:sortable="false" sap:text="AirlineCode_TEXT" sap:label="Airline" sap:creatable="false" sap:updatable="false"/><Property Name="AirlineCode_TEXT" Type="Edm.String" sap:sortable="false" sap:label="Airline (Description)" sap:creatable="false" sap:updatable="false" sap:filterable="false"/></EntityType><EntityType Name="Currency" sap:label="Airline Currency (Master Data)" sap:content-version="1"><Key><PropertyRef Name="Currency_ID"/></Key><Property Name="Currency_ID" Type="Edm.String" Nullable="false" MaxLength="5" sap:sortable="false" sap:text="Currency_TEXT" sap:label="Airline Currency" sap:creatable="false" sap:updatable="false"/><Property Name="Currency_TEXT" Type="Edm.String" sap:sortable="false" sap:label="Airline Currency (Description)" sap:creatable="false" sap:updatable="false" sap:filterable="false"/></EntityType><EntityType Name="FlightConnectionNumber" sap:label="Connection Number (Master Data)" sap:content-version="1"><Key><PropertyRef Name="FlightConnectionNumber_ID"/></Key><Property Name="FlightConnectionNumber_ID" Type="Edm.String" Nullable="false" MaxLength="4" sap:sortable="false" sap:text="FlightConnectionNumber_TEXT" sap:label="Connection Number" sap:creatable="false" sap:updatable="false"/><Property Name="FlightConnectionNumber_TEXT" Type="Edm.String" sap:sortable="false" sap:label="Connection Number (Description)" sap:creatable="false" sap:updatable="false" sap:filterable="false"/></EntityType><EntityType Name="ODataQueryAdditionalMetadata" sap:content-version="1"><Key><PropertyRef Name="ODataQueryMetadata"/></Key><Property Name="ODataQueryMetadata" Type="Edm.String" Nullable="false" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="ODataQueryMetadataValue_Current" Type="Edm.String" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="ODataQueryMetadataValueAtDefine" Type="Edm.String" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/></EntityType><EntityContainer Name="CAPF_FLIGHT_CDS_Entities" m:IsDefaultEntityContainer="true" sap:supported-formats="atom json xlsx"><EntitySet Name="CAPF_FLIGHT" EntityType="CAPF_FLIGHT_CDS.CAPF_FLIGHTType" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1"/><EntitySet Name="AirlineCode" EntityType="CAPF_FLIGHT_CDS.AirlineCode" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1"/><EntitySet Name="Currency" EntityType="CAPF_FLIGHT_CDS.Currency" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1"/><EntitySet Name="FlightConnectionNumber" EntityType="CAPF_FLIGHT_CDS.FlightConnectionNumber" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1"/><EntitySet Name="AdditionalMetadata" EntityType="CAPF_FLIGHT_CDS.ODataQueryAdditionalMetadata" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1"/></EntityContainer><Annotations Target="CAPF_FLIGHT_CDS.CAPF_FLIGHTType/AirlineCode" xmlns="http://docs.oasis-open.org/odata/ns/edm"><Annotation Term="Common.ValueList" Qualifier="MasterData"><Record><PropertyValue Property="Label" String="Airline"/><PropertyValue Property="CollectionPath" String="AirlineCode"/><PropertyValue Property="SearchSupported" Bool="false"/><PropertyValue Property="Parameters"><Collection><Record Type="Common.ValueListParameterInOut"><PropertyValue Property="LocalDataProperty" PropertyPath="AirlineCode"/><PropertyValue Property="ValueListProperty" String="AirlineCode_ID"/></Record><Record Type="Common.ValueListParameterDisplayOnly"><PropertyValue Property="ValueListProperty" String="AirlineCode_TEXT"/></Record></Collection></PropertyValue></Record></Annotation></Annotations><Annotations Target="CAPF_FLIGHT_CDS.CAPF_FLIGHTType/Currency" xmlns="http://docs.oasis-open.org/odata/ns/edm"><Annotation Term="Common.ValueList" Qualifier="MasterData"><Record><PropertyValue Property="Label" String="Airline Currency"/><PropertyValue Property="CollectionPath" String="Currency"/><PropertyValue Property="SearchSupported" Bool="false"/><PropertyValue Property="Parameters"><Collection><Record Type="Common.ValueListParameterInOut"><PropertyValue Property="LocalDataProperty" PropertyPath="Currency"/><PropertyValue Property="ValueListProperty" String="Currency_ID"/></Record></Collection></PropertyValue></Record></Annotation></Annotations><Annotations Target="CAPF_FLIGHT_CDS.CAPF_FLIGHTType/FlightConnectionNumber" xmlns="http://docs.oasis-open.org/odata/ns/edm"><Annotation Term="Common.ValueList" Qualifier="MasterData"><Record><PropertyValue Property="Label" String="Connection Number"/><PropertyValue Property="CollectionPath" String="FlightConnectionNumber"/><PropertyValue Property="SearchSupported" Bool="false"/><PropertyValue Property="Parameters"><Collection><Record Type="Common.ValueListParameterInOut"><PropertyValue Property="LocalDataProperty" PropertyPath="FlightConnectionNumber"/><PropertyValue Property="ValueListProperty" String="FlightConnectionNumber_ID"/></Record></Collection></PropertyValue></Record></Annotation></Annotations><atom:link rel="self" href="https://ldciuyr:44300/sap/opu/odata/sap/CAPF_FLIGHT_CDS/$metadata" xmlns:atom="http://www.w3.org/2005/Atom"/><atom:link rel="latest-version" href="https://ldciuyr:44300/sap/opu/odata/sap/CAPF_FLIGHT_CDS/$metadata" xmlns:atom="http://www.w3.org/2005/Atom"/></Schema></edmx:DataServices></edmx:Edmx>']);
		return this.oCatalogBrowser.setIsAnalyticalService().then(function() {
			assert.strictEqual(this.oUiModel.getProperty("/ServiceStatus"), ODataServiceUtils.SERVICE_STATUS.ANALYTICAL_SERVICE);
		}.bind(this));
	});
	QUnit.test("Service is not an Analytical Service", function(assert) {
		this.oUiModel.setProperty("/Service", "/notAnalyticalService");
		this.server.respondWith("GET", "/destination/testDest/notAnalyticalService/$metadata", [200, { "Content-Type": "application/xml" }, '<?xml version="1.0" encoding="utf-8"?><edmx:Edmx Version="1.0" xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns:sap="http://www.sap.com/Protocols/SAPData"><edmx:DataServices m:DataServiceVersion="2.0"><Schema Namespace="catalogservice" xml:lang="en" sap:schema-version="0" xmlns="http://schemas.microsoft.com/ado/2008/09/edm"><EntityType Name="Annotation" m:HasStream="true" sap:content-version="2"><Key><PropertyRef Name="TechnicalName"/><PropertyRef Name="Version"/></Key><Property Name="TechnicalName" Type="Edm.String" Nullable="false" MaxLength="35" sap:label="Annotation File Name" sap:creatable="false" sap:updatable="false" sap:filterable="false"/><Property Name="Version" Type="Edm.String" Nullable="false" MaxLength="4" sap:label="Annotation File Version" sap:creatable="false" sap:updatable="false" sap:filterable="false"/><Property Name="Description" Type="Edm.String" Nullable="false" MaxLength="60" sap:label="Description" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="MediaType" Type="Edm.String" Nullable="false" MaxLength="30" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><NavigationProperty Name="Services" Relationship="catalogservice.ServicesAnnotations" FromRole="ToRole_ServicesAnnotations" ToRole="FromRole_ServicesAnnotations"/></EntityType><EntityType Name="Vocabulary" m:HasStream="true" sap:content-version="2"><Key><PropertyRef Name="TechnicalName"/><PropertyRef Name="Version"/><PropertyRef Name="SAP__Origin"/></Key><Property Name="TechnicalName" Type="Edm.String" Nullable="false" MaxLength="32" sap:label="Vocabulary ID" sap:creatable="false" sap:updatable="false" sap:filterable="false"/><Property Name="Version" Type="Edm.String" Nullable="false" MaxLength="4" sap:label="Vocabulary Version" sap:creatable="false" sap:updatable="false" sap:filterable="false"/><Property Name="SAP__Origin" Type="Edm.String" Nullable="false" MaxLength="16" sap:label="System Alias" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Namespace" Type="Edm.String" Nullable="false" sap:label="Namespace" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Description" Type="Edm.String" Nullable="false" MaxLength="60" sap:label="Description" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="MediaType" Type="Edm.String" Nullable="false" MaxLength="30" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/></EntityType><EntityType Name="Service" sap:content-version="2"><Key><PropertyRef Name="ID"/></Key><Property Name="ID" Type="Edm.String" Nullable="false" MaxLength="40" sap:label="Identifier" sap:creatable="false" sap:updatable="false" sap:filterable="false"/><Property Name="Description" Type="Edm.String" Nullable="false" MaxLength="60" m:FC_KeepInContent="true" m:FC_TargetPath="SyndicationTitle" sap:label="Description" sap:creatable="false" sap:updatable="false" sap:filterable="false"/><Property Name="Title" Type="Edm.String" Nullable="false" MaxLength="40" sap:label="External Name" sap:creatable="false" sap:updatable="false"/><Property Name="Author" Type="Edm.String" Nullable="false" MaxLength="12" m:FC_KeepInContent="true" m:FC_TargetPath="SyndicationAuthorName" sap:label="User Name" sap:creatable="false" sap:updatable="false"/><Property Name="TechnicalServiceVersion" Type="Edm.Int16" Nullable="false" sap:label="Technical Service Version" sap:creatable="false"/><Property Name="MetadataUrl" Type="Edm.String" Nullable="false" sap:creatable="false" sap:updatable="false" sap:filterable="false" sap:semantics="url"/><Property Name="TechnicalServiceName" Type="Edm.String" Nullable="false" MaxLength="35" sap:label="Technical Service Name" sap:creatable="false"/><Property Name="ImageUrl" Type="Edm.String" Nullable="false" sap:creatable="false" sap:updatable="false" sap:filterable="false" sap:semantics="url"/><Property Name="ServiceUrl" Type="Edm.String" Nullable="false" sap:creatable="false" sap:updatable="false" sap:filterable="false" sap:semantics="url"/><Property Name="UpdatedDate" Type="Edm.DateTime" Nullable="false" Precision="0" m:FC_KeepInContent="true" m:FC_TargetPath="SyndicationUpdated" sap:label="Time Stamp" sap:creatable="false" sap:updatable="false" sap:filterable="false"/><Property Name="ReleaseStatus" Type="Edm.String" Nullable="false" sap:creatable="false" sap:updatable="false" sap:filterable="false"/><Property Name="IsSapService" Type="Edm.Boolean" Nullable="false" sap:creatable="false" sap:updatable="false" sap:filterable="false"/><NavigationProperty Name="EntitySets" Relationship="catalogservice.EntitySets" FromRole="FromRole_EntitySets" ToRole="ToRole_EntitySets"/><NavigationProperty Name="TagCollection" Relationship="catalogservice.TagsServices" FromRole="ToRole_TagsServices" ToRole="FromRole_TagsServices"/><NavigationProperty Name="Annotations" Relationship="catalogservice.ServicesAnnotations" FromRole="FromRole_ServicesAnnotations" ToRole="ToRole_ServicesAnnotations"/></EntityType><EntityType Name="Tag" sap:content-version="2"><Key><PropertyRef Name="ID"/></Key><Property Name="ID" Type="Edm.String" Nullable="false" sap:label="Identifier" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Text" Type="Edm.String" Nullable="false" sap:label="Text" sap:creatable="false"/><Property Name="Occurrence" Type="Edm.Int16" Nullable="false" sap:label="Description" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><NavigationProperty Name="Services" Relationship="catalogservice.TagsServices" FromRole="FromRole_TagsServices" ToRole="ToRole_TagsServices"/></EntityType><EntityType Name="EntitySet" sap:content-version="2"><Key><PropertyRef Name="ID"/><PropertyRef Name="SrvIdentifier"/></Key><Property Name="ID" Type="Edm.String" Nullable="false" m:FC_KeepInContent="true" m:FC_TargetPath="SyndicationTitle" sap:label="Identifier" sap:creatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="SrvIdentifier" Type="Edm.String" Nullable="false" sap:label="Service Identifier" sap:creatable="false" sap:updatable="false" sap:sortable="false"/><Property Name="Description" Type="Edm.String" Nullable="false" sap:label="Text" sap:creatable="false" sap:updatable="false"/><Property Name="TechnicalServiceName" Type="Edm.String" Nullable="false" sap:label="Technical Service Name" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="TechnicalServiceVersion" Type="Edm.String" Nullable="false" sap:label="Technical Service Version" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><NavigationProperty Name="Service" Relationship="catalogservice.EntitySets" FromRole="ToRole_EntitySets" ToRole="FromRole_EntitySets"/></EntityType><EntityType Name="Catalog" sap:content-version="2"><Key><PropertyRef Name="ID"/></Key><Property Name="ID" Type="Edm.String" Nullable="false" sap:creatable="false" sap:filterable="false"/><Property Name="Description" Type="Edm.String" Nullable="false" sap:creatable="false" sap:filterable="false"/><Property Name="ImageUrl" Type="Edm.String" Nullable="false" sap:creatable="false" sap:filterable="false"/><Property Name="Title" Type="Edm.String" Nullable="false" sap:creatable="false" sap:filterable="false"/><Property Name="UpdatedDate" Type="Edm.DateTime" Nullable="false" Precision="0" sap:creatable="false" sap:filterable="false"/><Property Name="Url" Type="Edm.String" Nullable="false" sap:creatable="false" sap:filterable="false"/><NavigationProperty Name="Services" Relationship="catalogservice.Services" FromRole="FromRole_Services" ToRole="ToRole_Services"/></EntityType><Association Name="TagsServices" sap:content-version="2"><End Type="catalogservice.Tag" Multiplicity="*" Role="FromRole_TagsServices"/><End Type="catalogservice.Service" Multiplicity="*" Role="ToRole_TagsServices"/></Association><Association Name="ServicesAnnotations" sap:content-version="2"><End Type="catalogservice.Service" Multiplicity="*" Role="FromRole_ServicesAnnotations"/><End Type="catalogservice.Annotation" Multiplicity="*" Role="ToRole_ServicesAnnotations"/></Association><Association Name="EntitySets" sap:content-version="2"><End Type="catalogservice.Service" Multiplicity="1" Role="FromRole_EntitySets"/><End Type="catalogservice.EntitySet" Multiplicity="*" Role="ToRole_EntitySets"/></Association><Association Name="Services" sap:content-version="2"><End Type="catalogservice.Catalog" Multiplicity="1" Role="FromRole_Services"/><End Type="catalogservice.Service" Multiplicity="*" Role="ToRole_Services"/></Association><EntityContainer Name="catalogservice_Entities" m:IsDefaultEntityContainer="true" sap:supported-formats="atom json xlsx"><EntitySet Name="Annotations" EntityType="catalogservice.Annotation" sap:updatable="false" sap:deletable="false" sap:content-version="2"/><EntitySet Name="Vocabularies" EntityType="catalogservice.Vocabulary" sap:updatable="false" sap:deletable="false" sap:addressable="false" sap:content-version="2"/><EntitySet Name="ServiceCollection" EntityType="catalogservice.Service" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:searchable="true" sap:content-version="2"/><EntitySet Name="TagCollection" EntityType="catalogservice.Tag" sap:creatable="false" sap:updatable="false" sap:content-version="2"/><EntitySet Name="EntitySetCollection" EntityType="catalogservice.EntitySet" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="2"/><EntitySet Name="CatalogCollection" EntityType="catalogservice.Catalog" sap:content-version="2"/><AssociationSet Name="AssocSet_Services" Association="catalogservice.Services" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="2"><End EntitySet="CatalogCollection" Role="FromRole_Services"/><End EntitySet="ServiceCollection" Role="ToRole_Services"/></AssociationSet><AssociationSet Name="AssocSet_ServicesAnnotations" Association="catalogservice.ServicesAnnotations" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="2"><End EntitySet="ServiceCollection" Role="FromRole_ServicesAnnotations"/><End EntitySet="Annotations" Role="ToRole_ServicesAnnotations"/></AssociationSet><AssociationSet Name="AssocSet_EntitySets" Association="catalogservice.EntitySets" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="2"><End EntitySet="ServiceCollection" Role="FromRole_EntitySets"/><End EntitySet="EntitySetCollection" Role="ToRole_EntitySets"/></AssociationSet><AssociationSet Name="AssocSet_TagsServices" Association="catalogservice.TagsServices" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="2"><End EntitySet="TagCollection" Role="FromRole_TagsServices"/><End EntitySet="ServiceCollection" Role="ToRole_TagsServices"/></AssociationSet><FunctionImport Name="BestMatchingService" ReturnType="catalogservice.Service" EntitySet="ServiceCollection" m:HttpMethod="GET"><Parameter Name="TechnicalServiceVersionMin" Type="Edm.Int16" Mode="In" Nullable="false"/><Parameter Name="TechnicalServiceName" Type="Edm.String" Mode="In" Nullable="false"/><Parameter Name="TechnicalServiceVersionMax" Type="Edm.Int16" Mode="In" Nullable="false"/></FunctionImport><FunctionImport Name="ClearMetadataCacheForService" ReturnType="catalogservice.Service" EntitySet="ServiceCollection" m:HttpMethod="GET"><Parameter Name="ServiceID" Type="Edm.String" Mode="In" Nullable="false"/></FunctionImport></EntityContainer><atom:link rel="self" href="https://ldciuyr:44300/sap/opu/odata/iwfnd/catalogservice;v=2/$metadata" xmlns:atom="http://www.w3.org/2005/Atom"/><atom:link rel="latest-version" href="https://ldciuyr:44300/sap/opu/odata/iwfnd/catalogservice;v=2/$metadata" xmlns:atom="http://www.w3.org/2005/Atom"/></Schema></edmx:DataServices></edmx:Edmx>']);
		return this.oCatalogBrowser.setIsAnalyticalService().then(function() {
			assert.strictEqual(this.oUiModel.getProperty("/ServiceStatus"), ODataServiceUtils.SERVICE_STATUS.NOT_ANALYTICAL_SERVICE);
		}.bind(this));
	});
	QUnit.test("Service has wrong OData version", function(assert) {
		this.oUiModel.setProperty("/Service", "/odataV4Service");
		this.server.respondWith("GET", "/destination/testDest/odataV4Service/$metadata", [200, { "Content-Type": "application/xml", "odata-version": "4.0" }, '<?xmlversion="1.0"encoding="utf-8"?><edmx:EdmxVersion="4.0"xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx"><edmx:ReferenceUri="https://oasis-tcs.github.io/odata-vocabularies/vocabularies/Org.OData.Capabilities.V1.xml"><edmx:IncludeAlias="Capabilities"Namespace="Org.OData.Capabilities.V1"/></edmx:Reference><edmx:DataServices><SchemaNamespace="CatalogService"xmlns="http://docs.oasis-open.org/odata/ns/edm"><EntityContainerName="EntityContainer"><EntitySetName="Books"EntityType="CatalogService.Books"/></EntityContainer><EntityTypeName="Books"><Key><PropertyRefName="ID"/></Key><PropertyName="ID"Type="Edm.Int32"Nullable="false"/><PropertyName="title"Type="Edm.String"/><PropertyName="stock"Type="Edm.Int32"/></EntityType><AnnotationsTarget="CatalogService.EntityContainer/Books"><AnnotationTerm="Capabilities.DeleteRestrictions"><RecordType="Capabilities.DeleteRestrictionsType"><PropertyValueProperty="Deletable"Bool="false"/></Record></Annotation><AnnotationTerm="Capabilities.InsertRestrictions"><RecordType="Capabilities.InsertRestrictionsType"><PropertyValueProperty="Insertable"Bool="false"/></Record></Annotation><AnnotationTerm="Capabilities.UpdateRestrictions"><RecordType="Capabilities.UpdateRestrictionsType"><PropertyValueProperty="Updatable"Bool="false"/></Record></Annotation></Annotations></Schema></edmx:DataServices></edmx:Edmx>']);
		return this.oCatalogBrowser.setIsAnalyticalService().then(function() {
			assert.strictEqual(this.oUiModel.getProperty("/ServiceStatus"), ODataServiceUtils.SERVICE_STATUS.WRONG_ODATA_VERSION);
		}.bind(this));
	});
	QUnit.test("Service cannot be reached for checks: HTTP-Errors", function(assert) {
		this.oUiModel.setProperty("/Service", "/notExistingService");
		this.server.respondWith("GET", "/destination/testDest/notExistingService/$metadata", [404, { }, '']);
		return this.oCatalogBrowser.setIsAnalyticalService().then(function() {
			assert.strictEqual(this.oUiModel.getProperty("/ServiceStatus"), ODataServiceUtils.SERVICE_STATUS.NOT_ACCESSIBLE);
		}.bind(this));
	});
	QUnit.test("Service cannot be reached for checks: No valid Metadata provided", function(assert) {
		this.oUiModel.setProperty("/Service", "/invalidMetadataService");
		this.server.respondWith("GET", "/destination/testDest/invalidMetadataService/$metadata", [200, { }, 'asdfjöaskdjflsa']);
		return this.oCatalogBrowser.setIsAnalyticalService().then(function() {
			assert.strictEqual(this.oUiModel.getProperty("/ServiceStatus"), ODataServiceUtils.SERVICE_STATUS.NOT_ACCESSIBLE);
		}.bind(this));
	});
	QUnit.test("setIsAnalyticalService sets status PENDING while performing its checks", function(assert) {
		this.oUiModel.setProperty("/Service", "/longRunningService");
		this.server.respondWith("GET", "/destination/testDest/longRunningService/$metadata", [200, { }, 'asdfjöaskdjflsa']);
		var oPromise = this.oCatalogBrowser.setIsAnalyticalService();
		assert.strictEqual(this.oUiModel.getProperty("/ServiceStatus"), ODataServiceUtils.SERVICE_STATUS.PENDING);
		return oPromise;
	});

	QUnit.module("Translate", {
		beforeEach: function() {
			var env = this;
			env.oCatalogBrowser = new CatalogBrowser();
			//stub getText
			var translations = {
				"key": "translation",
				"key_one": "trans{0}ion {0}",
				"key_mult": "{1}lat{2} {0}"
			};
			var fGetText = function(key, args) {
				if (!(key in translations)) {
					return undefined;
				}
				var translation = translations[key];
				try {
					for (var i = 0; i < args.length; i++) {
						translation = translation.replace(new RegExp("\\{" + i + "\\}", 'g'), args[i]);
					}
					return translation;
				} catch (e) {
					return undefined;
				}
			};
			//create coreApi
			env.oCatalogBrowser.oCoreApi = {
				getText: fGetText
			};
		},
		afterEach: function() {}
	});
	QUnit.test("Unknown Key", function(assert) {
		var result = this.oCatalogBrowser.translate("unknown");
		assert.strictEqual(result, undefined, "returns undefined");
	});
	QUnit.test("Valid Key", function(assert) {
		var result = this.oCatalogBrowser.translate("key");
		assert.strictEqual(result, "translation", "returns correct translation");
	});
	QUnit.test("Valid Key With One Argument", function(assert) {
		var result = this.oCatalogBrowser.translate("key_one", "lat");
		assert.strictEqual(result, "translation lat", "returns correct translation containing the argument");
	});
	QUnit.test("Valid Key With Multiple Arguments", function(assert) {
		var result = this.oCatalogBrowser.translate("key_mult", "mult", "trans", "ion");
		assert.strictEqual(result, "translation mult", "returns correct translation containing the arguments");
	});

	QUnit.module("Navigate", {
		beforeEach: function() {
			var env = this;
			env.oCatalogBrowser = new CatalogBrowser();
			//stub UiModel
			env.stubSetProperty = sinon.stub();
			env.oUiModel = {
				getProperty: function() {
					return "";
				},
				setProperty: env.stubSetProperty
			};
			env.stubGetModel = sinon.stub();
			env.stubGetModel.withArgs("ui").returns(env.oUiModel);
			//stub NavContainer
			env.stubNavigateTo = sinon.stub();
			env.oNavContainer = {
				getPreviousPage: function() {
					return null;
				},
				indexOfPage: function() {
					return -1;
				},
				back: function() { },
				getPages: function() {
					return ["page 0", "page 1", "page 2"];
				},
				to: env.stubNavigateTo
			};
			//stub byId
			env.stubById = sinon.stub();
			env.stubById.withArgs("navContainer").returns(env.oNavContainer);
			//stub View
			env.oView = {
				getModel: env.stubGetModel,
				byId: env.stubById
			};
			env.stubGetView = sinon.stub(env.oCatalogBrowser, "getView");
			env.stubGetView.returns(env.oView);
			//stub translate
			env.stubTranslate = sinon.stub(env.oCatalogBrowser, "translate");
			env.stubTranslate.withArgs("selectDestination").returns("translation: selectDestination");
		},
		afterEach: function() {
			this.stubGetView.restore();
			this.stubTranslate.restore();
		}
	});
	QUnit.test("Default Case", function(assert) {
		var env = this;
		var iDefault = env.oCatalogBrowser.navigate(17); //illegal index
		//navigate
		assert.ok(env.stubNavigateTo.calledOnce, "navContainer.to is called exactly once");
		assert.strictEqual(env.stubNavigateTo.getCalls()[0].args[0], "page 0", "navContainer.to is called with the default page");
		//reset properties
		assert.ok(env.stubSetProperty.withArgs("/Title", "translation: selectDestination").called, "title is reset");
		assert.ok(env.stubSetProperty.withArgs("/Destination", "").called, "destination is reset");
		assert.ok(env.stubSetProperty.withArgs("/Service", "").called, "service is reset");
		assert.ok(env.stubSetProperty.withArgs("/SearchEnabled", true).called, "searchEnabled is reset");
		assert.ok(env.stubSetProperty.withArgs("/ButtonOkEnabled", false).called, "buttonOkEnabled is reset");
		assert.ok(env.stubSetProperty.withArgs("/ButtonSelectEnabled", false).called, "buttonSelectEnabled is reset");
		assert.ok(env.stubSetProperty.withArgs("/ButtonBackEnabled", false).called, "buttonBackEnabled is reset");
		//return page index
		assert.strictEqual(iDefault, 0, "default page index is returned"); //0 == DIALOG_PAGES.DESTINATIONS (dialog start page)
	});

	QUnit.module("Dialog", {
		beforeEach: async function() {
			var env = this;
			env.oCatalogBrowser = new CatalogBrowser();
			sinon.spy(env.oCatalogBrowser, "initializeDialog");
			env.oCatalogBrowser.getOwnerComponent = function() {
				return {
					getManifestEntry: function() {
						return "";
					},
					getManifestObject: function() {
						return {
							resolveUri: function() {
								return "";
							}
						};
					},
					runAsOwner: function(callback) {
						return callback();
					},
					oCoreApi: {
						getText: function() {
							return "";
						}
					}
				};
			};
			env.oCatalogBrowserView = await View.create({
				type: ViewType.XML,
				viewName: "sap.apf.cloudFoundry.ui.valuehelp.view.CatalogBrowser",
				controller: env.oCatalogBrowser
			});
		},
		afterEach: function() {
			var env = this;
			env.oCatalogBrowser.initializeDialog.restore();
			env.oCatalogBrowserView.destroy();
		}
	});

	QUnit.test("is created together with view", async function(assert) {
		var env = this;
		assert.strictEqual(env.oCatalogBrowser.initializeDialog.callCount, 1, "initializeDialog is called once");
		await env.oCatalogBrowser.initializeDialog.returnValues[0]; // wait for the dialog to be loaded
		assert.ok(env.oCatalogBrowser.getDialog());
	});

});
