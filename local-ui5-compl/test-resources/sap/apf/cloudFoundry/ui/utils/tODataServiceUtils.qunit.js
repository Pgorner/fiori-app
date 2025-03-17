sap.ui.define([
	"sap/apf/cloudFoundry/ui/utils/ODataServiceUtils",
	"sap/ui/thirdparty/jquery",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (ODataServiceUtils, jQuery, sinon) {
	"use strict";

	QUnit.module("URL parsing", {
		beforeEach: function() {},
		afterEach: function() {}
	});
	QUnit.test("getCatalogURL", function(assert) {
		assert.strictEqual(ODataServiceUtils.getCatalogURL("destinationName"), "/destination/destinationName/sap/opu/odata/iwfnd/catalogservice;v=2/", "concats destination prefix, destination name and catalog url");
	});
	QUnit.test("getRelativeServiceURL", function(assert) {
		assert.strictEqual(ODataServiceUtils.getRelativeServiceURL(), "", "Undefined URL will return empty string");
		assert.strictEqual(ODataServiceUtils.getRelativeServiceURL(""), "", "Empty URL will return empty string");
		assert.strictEqual(ODataServiceUtils.getRelativeServiceURL("https://approuter/url/otto"), "/url/otto", "getRelativeServiceUrl works on HTTPS");
		assert.strictEqual(ODataServiceUtils.getRelativeServiceURL("http://approuter/url/otto"), "/url/otto", "getRelativeServiceUrl works on HTTP");
		assert.strictEqual(ODataServiceUtils.getRelativeServiceURL("ftp://approuter/url/otto"), "", "getRelativeServiceUrl work on other protocols, i.e. ftp");
		assert.strictEqual(ODataServiceUtils.getRelativeServiceURL("http://approuter/url/otto?q=query&t=test"), "/url/otto?q=query&t=test", "getRelativeServiceUrl accepts also query strings");
		assert.strictEqual(ODataServiceUtils.getRelativeServiceURL("http://approuter/url/otto#fragment"), "/url/otto#fragment", "getRelativeServiceUrl accepts also query fragments");
	});
	QUnit.test("getRelativeURL", function(assert) {
		//invalid arguments
		assert.strictEqual(ODataServiceUtils.getRelativeURL(), undefined, "undefined arguments will return undefined");
		assert.strictEqual(ODataServiceUtils.getRelativeURL("https://destination.com/odata/v2/service/"), undefined, "undefined arguments will return undefined");
		assert.strictEqual(ODataServiceUtils.getRelativeURL(undefined, "https://destination.com/"), undefined, "undefined arguments will return undefined");
		assert.strictEqual(ODataServiceUtils.getRelativeURL("https://destination.com/odata/v2/service/", "/odata/v2/"), undefined, "relative base URL will return undefined");
		assert.strictEqual(ODataServiceUtils.getRelativeURL("https://other-destination.com/service/", "https://destination.com/"), undefined, "rejects absolute URLs without matching base URL");
		//correct behaviour
		assert.strictEqual(ODataServiceUtils.getRelativeURL("https://destination.com/odata/v2/service/", "https://destination.com/"), "/odata/v2/service/", "removes hostname");
		assert.strictEqual(ODataServiceUtils.getRelativeURL("https://destination.com/something/odata/v2/service/", "https://destination.com/something/"), "/odata/v2/service/", "removes base URL");
		assert.strictEqual(ODataServiceUtils.getRelativeURL("/odata/v2/service/", "https://destination.com/something/"), "/odata/v2/service/", "keeps relative URLs");
		assert.strictEqual(ODataServiceUtils.getRelativeURL("odata/v2/service/", "https://destination.com/something/"), "/odata/v2/service/", "adds leading backslash");
		assert.strictEqual(ODataServiceUtils.getRelativeURL("/something/odata/v2/service/", "https://destination.com/something/"), "/something/odata/v2/service/", "keeps relative URLs even if parts of the base URL are matching");
		assert.strictEqual(ODataServiceUtils.getRelativeURL("https://destination.com/odata/v2/service/", "https://destination.com"), "/odata/v2/service/", "removes hostname without trailing slash");
		assert.strictEqual(ODataServiceUtils.getRelativeURL("https://destination.com/something/odata/v2/service/", "https://destination.com/something"), "/odata/v2/service/", "removes base URL without trailing slash");
	});
	QUnit.test("getFullServiceURL", function(assert) {
		assert.strictEqual(ODataServiceUtils.getFullServiceURL("destinationName", "/relative/service/url"), "/destination/destinationName/relative/service/url", "concats destination prefix, destination name and service url");
	});

	QUnit.module("Is Analytical Service", {
		beforeEach: function() {
			var env = this;
			// create fake server
			env.server = sinon.fakeServer.create();
			// respondImmediately = true is not suitable, as this would create a synchronous response
			env.server.autoRespond  = true;
			env.server.autoRespondAfter = 0;
			// MockServer globally changes this from default (false) to true and sets its own filters. Make sure it's false here
			sinon.FakeXMLHttpRequest.useFilters = false;
		},
		afterEach: function() {
			this.server.restore();
			sinon.FakeXMLHttpRequest.useFilters = true;
		}
	});
	QUnit.test("Service is an Analytical Service", function(assert) {
		var done = assert.async();
		this.server.respondWith("GET", "/destination/testDest/analyticalService/$metadata", [200, { "Content-Type": "application/xml" }, '<?xml version="1.0" encoding="utf-8"?><edmx:Edmx Version="1.0" xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns:sap="http://www.sap.com/Protocols/SAPData"><edmx:Reference Uri="https://ldciuyr:44300/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/Vocabularies(TechnicalName=\'%2FIWBEP%2FVOC_COMMON\',Version=\'0001\',SAP__Origin=\'QM7CLNT715\')/$value" xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx"><edmx:Include Namespace="com.sap.vocabularies.Common.v1" Alias="Common"/></edmx:Reference><edmx:DataServices m:DataServiceVersion="2.0"><Schema Namespace="CAPF_FLIGHT_CDS" xml:lang="en" sap:schema-version="1" xmlns="http://schemas.microsoft.com/ado/2008/09/edm"><EntityType Name="CAPF_FLIGHTType" sap:label="Test Content APF" sap:semantics="aggregate" sap:content-version="1"><Key><PropertyRef Name="ID"/></Key><Property Name="ID" Type="Edm.String" Nullable="false" sap:filterable="false" sap:updatable="false" sap:sortable="false"/><Property Name="TotaledProperties" Type="Edm.String" sap:aggregation-role="totaled-properties-list" sap:is-annotation="true" sap:updatable="false" sap:sortable="false"/><Property Name="AirlineCode" Type="Edm.String" MaxLength="3" sap:aggregation-role="dimension" sap:creatable="false" sap:text="AirlineName" sap:updatable="false" sap:label="Airline"/><Property Name="AirlineName" Type="Edm.String" MaxLength="1333" sap:creatable="false" sap:filterable="false" sap:updatable="false" sap:label="Airline (Description)"/><Property Name="Currency" Type="Edm.String" MaxLength="5" sap:aggregation-role="dimension" sap:creatable="false" sap:updatable="false" sap:label="Airline Currency" sap:semantics="currency-code"/><Property Name="FlightDate" Type="Edm.String" MaxLength="10" sap:aggregation-role="dimension" sap:creatable="false" sap:text="FlightDate_T" sap:updatable="false" sap:label="Flight Date" sap:semantics="yearmonthday"/><Property Name="FlightDate_T" Type="Edm.String" MaxLength="10" sap:creatable="false" sap:filterable="false" sap:updatable="false" sap:label="Flight Date (Description)"/><Property Name="FlightConnectionNumber" Type="Edm.String" MaxLength="4" sap:aggregation-role="dimension" sap:creatable="false" sap:updatable="false" sap:label="Connection Number"/><Property Name="Amount" Type="Edm.Decimal" Precision="42" Scale="2" sap:aggregation-role="measure" sap:creatable="false" sap:filterable="false" sap:text="Amount_F" sap:unit="Currency" sap:updatable="false" sap:label="Booking total"/><Property Name="Amount_F" Type="Edm.String" MaxLength="60" sap:creatable="false" sap:filterable="false" sap:updatable="false" sap:label="Booking total (Formatted)"/><Property Name="MaxCapacity" Type="Edm.Decimal" Precision="42" Scale="0" sap:aggregation-role="measure" sap:creatable="false" sap:filterable="false" sap:text="MaxCapacity_F" sap:updatable="false" sap:label="Max. capacity econ."/><Property Name="MaxCapacity_F" Type="Edm.String" MaxLength="60" sap:creatable="false" sap:filterable="false" sap:updatable="false" sap:label="Max. capacity econ. (Formatted)"/></EntityType><EntityType Name="AirlineCode" sap:label="Airline (Master Data)" sap:content-version="1"><Key><PropertyRef Name="AirlineCode_ID"/></Key><Property Name="AirlineCode_ID" Type="Edm.String" Nullable="false" MaxLength="3" sap:sortable="false" sap:text="AirlineCode_TEXT" sap:label="Airline" sap:creatable="false" sap:updatable="false"/><Property Name="AirlineCode_TEXT" Type="Edm.String" sap:sortable="false" sap:label="Airline (Description)" sap:creatable="false" sap:updatable="false" sap:filterable="false"/></EntityType><EntityType Name="Currency" sap:label="Airline Currency (Master Data)" sap:content-version="1"><Key><PropertyRef Name="Currency_ID"/></Key><Property Name="Currency_ID" Type="Edm.String" Nullable="false" MaxLength="5" sap:sortable="false" sap:text="Currency_TEXT" sap:label="Airline Currency" sap:creatable="false" sap:updatable="false"/><Property Name="Currency_TEXT" Type="Edm.String" sap:sortable="false" sap:label="Airline Currency (Description)" sap:creatable="false" sap:updatable="false" sap:filterable="false"/></EntityType><EntityType Name="FlightConnectionNumber" sap:label="Connection Number (Master Data)" sap:content-version="1"><Key><PropertyRef Name="FlightConnectionNumber_ID"/></Key><Property Name="FlightConnectionNumber_ID" Type="Edm.String" Nullable="false" MaxLength="4" sap:sortable="false" sap:text="FlightConnectionNumber_TEXT" sap:label="Connection Number" sap:creatable="false" sap:updatable="false"/><Property Name="FlightConnectionNumber_TEXT" Type="Edm.String" sap:sortable="false" sap:label="Connection Number (Description)" sap:creatable="false" sap:updatable="false" sap:filterable="false"/></EntityType><EntityType Name="ODataQueryAdditionalMetadata" sap:content-version="1"><Key><PropertyRef Name="ODataQueryMetadata"/></Key><Property Name="ODataQueryMetadata" Type="Edm.String" Nullable="false" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="ODataQueryMetadataValue_Current" Type="Edm.String" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="ODataQueryMetadataValueAtDefine" Type="Edm.String" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/></EntityType><EntityContainer Name="CAPF_FLIGHT_CDS_Entities" m:IsDefaultEntityContainer="true" sap:supported-formats="atom json xlsx"><EntitySet Name="CAPF_FLIGHT" EntityType="CAPF_FLIGHT_CDS.CAPF_FLIGHTType" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1"/><EntitySet Name="AirlineCode" EntityType="CAPF_FLIGHT_CDS.AirlineCode" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1"/><EntitySet Name="Currency" EntityType="CAPF_FLIGHT_CDS.Currency" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1"/><EntitySet Name="FlightConnectionNumber" EntityType="CAPF_FLIGHT_CDS.FlightConnectionNumber" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1"/><EntitySet Name="AdditionalMetadata" EntityType="CAPF_FLIGHT_CDS.ODataQueryAdditionalMetadata" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="1"/></EntityContainer><Annotations Target="CAPF_FLIGHT_CDS.CAPF_FLIGHTType/AirlineCode" xmlns="http://docs.oasis-open.org/odata/ns/edm"><Annotation Term="Common.ValueList" Qualifier="MasterData"><Record><PropertyValue Property="Label" String="Airline"/><PropertyValue Property="CollectionPath" String="AirlineCode"/><PropertyValue Property="SearchSupported" Bool="false"/><PropertyValue Property="Parameters"><Collection><Record Type="Common.ValueListParameterInOut"><PropertyValue Property="LocalDataProperty" PropertyPath="AirlineCode"/><PropertyValue Property="ValueListProperty" String="AirlineCode_ID"/></Record><Record Type="Common.ValueListParameterDisplayOnly"><PropertyValue Property="ValueListProperty" String="AirlineCode_TEXT"/></Record></Collection></PropertyValue></Record></Annotation></Annotations><Annotations Target="CAPF_FLIGHT_CDS.CAPF_FLIGHTType/Currency" xmlns="http://docs.oasis-open.org/odata/ns/edm"><Annotation Term="Common.ValueList" Qualifier="MasterData"><Record><PropertyValue Property="Label" String="Airline Currency"/><PropertyValue Property="CollectionPath" String="Currency"/><PropertyValue Property="SearchSupported" Bool="false"/><PropertyValue Property="Parameters"><Collection><Record Type="Common.ValueListParameterInOut"><PropertyValue Property="LocalDataProperty" PropertyPath="Currency"/><PropertyValue Property="ValueListProperty" String="Currency_ID"/></Record></Collection></PropertyValue></Record></Annotation></Annotations><Annotations Target="CAPF_FLIGHT_CDS.CAPF_FLIGHTType/FlightConnectionNumber" xmlns="http://docs.oasis-open.org/odata/ns/edm"><Annotation Term="Common.ValueList" Qualifier="MasterData"><Record><PropertyValue Property="Label" String="Connection Number"/><PropertyValue Property="CollectionPath" String="FlightConnectionNumber"/><PropertyValue Property="SearchSupported" Bool="false"/><PropertyValue Property="Parameters"><Collection><Record Type="Common.ValueListParameterInOut"><PropertyValue Property="LocalDataProperty" PropertyPath="FlightConnectionNumber"/><PropertyValue Property="ValueListProperty" String="FlightConnectionNumber_ID"/></Record></Collection></PropertyValue></Record></Annotation></Annotations><atom:link rel="self" href="https://ldciuyr:44300/sap/opu/odata/sap/CAPF_FLIGHT_CDS/$metadata" xmlns:atom="http://www.w3.org/2005/Atom"/><atom:link rel="latest-version" href="https://ldciuyr:44300/sap/opu/odata/sap/CAPF_FLIGHT_CDS/$metadata" xmlns:atom="http://www.w3.org/2005/Atom"/></Schema></edmx:DataServices></edmx:Edmx>']);
		return ODataServiceUtils.isAnalyticalService("testDest", "/analyticalService").then(function(analyticalService) {
			assert.strictEqual(analyticalService, "ANALYTICAL_SERVICE", "service is an analytical service");
			done();
		}).catch(function() {
			assert.ok(false, "promise should not reject");
			done();
		});
	});
	QUnit.test("Service is not an Analytical Service", function(assert) {
		var done = assert.async();
		this.server.respondWith("GET", "/destination/testDest/notAnalyticalService/$metadata", [200, { "Content-Type": "application/xml" }, '<?xml version="1.0" encoding="utf-8"?><edmx:Edmx Version="1.0" xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns:sap="http://www.sap.com/Protocols/SAPData"><edmx:DataServices m:DataServiceVersion="2.0"><Schema Namespace="catalogservice" xml:lang="en" sap:schema-version="0" xmlns="http://schemas.microsoft.com/ado/2008/09/edm"><EntityType Name="Annotation" m:HasStream="true" sap:content-version="2"><Key><PropertyRef Name="TechnicalName"/><PropertyRef Name="Version"/></Key><Property Name="TechnicalName" Type="Edm.String" Nullable="false" MaxLength="35" sap:label="Annotation File Name" sap:creatable="false" sap:updatable="false" sap:filterable="false"/><Property Name="Version" Type="Edm.String" Nullable="false" MaxLength="4" sap:label="Annotation File Version" sap:creatable="false" sap:updatable="false" sap:filterable="false"/><Property Name="Description" Type="Edm.String" Nullable="false" MaxLength="60" sap:label="Description" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="MediaType" Type="Edm.String" Nullable="false" MaxLength="30" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><NavigationProperty Name="Services" Relationship="catalogservice.ServicesAnnotations" FromRole="ToRole_ServicesAnnotations" ToRole="FromRole_ServicesAnnotations"/></EntityType><EntityType Name="Vocabulary" m:HasStream="true" sap:content-version="2"><Key><PropertyRef Name="TechnicalName"/><PropertyRef Name="Version"/><PropertyRef Name="SAP__Origin"/></Key><Property Name="TechnicalName" Type="Edm.String" Nullable="false" MaxLength="32" sap:label="Vocabulary ID" sap:creatable="false" sap:updatable="false" sap:filterable="false"/><Property Name="Version" Type="Edm.String" Nullable="false" MaxLength="4" sap:label="Vocabulary Version" sap:creatable="false" sap:updatable="false" sap:filterable="false"/><Property Name="SAP__Origin" Type="Edm.String" Nullable="false" MaxLength="16" sap:label="System Alias" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Namespace" Type="Edm.String" Nullable="false" sap:label="Namespace" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Description" Type="Edm.String" Nullable="false" MaxLength="60" sap:label="Description" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="MediaType" Type="Edm.String" Nullable="false" MaxLength="30" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/></EntityType><EntityType Name="Service" sap:content-version="2"><Key><PropertyRef Name="ID"/></Key><Property Name="ID" Type="Edm.String" Nullable="false" MaxLength="40" sap:label="Identifier" sap:creatable="false" sap:updatable="false" sap:filterable="false"/><Property Name="Description" Type="Edm.String" Nullable="false" MaxLength="60" m:FC_KeepInContent="true" m:FC_TargetPath="SyndicationTitle" sap:label="Description" sap:creatable="false" sap:updatable="false" sap:filterable="false"/><Property Name="Title" Type="Edm.String" Nullable="false" MaxLength="40" sap:label="External Name" sap:creatable="false" sap:updatable="false"/><Property Name="Author" Type="Edm.String" Nullable="false" MaxLength="12" m:FC_KeepInContent="true" m:FC_TargetPath="SyndicationAuthorName" sap:label="User Name" sap:creatable="false" sap:updatable="false"/><Property Name="TechnicalServiceVersion" Type="Edm.Int16" Nullable="false" sap:label="Technical Service Version" sap:creatable="false"/><Property Name="MetadataUrl" Type="Edm.String" Nullable="false" sap:creatable="false" sap:updatable="false" sap:filterable="false" sap:semantics="url"/><Property Name="TechnicalServiceName" Type="Edm.String" Nullable="false" MaxLength="35" sap:label="Technical Service Name" sap:creatable="false"/><Property Name="ImageUrl" Type="Edm.String" Nullable="false" sap:creatable="false" sap:updatable="false" sap:filterable="false" sap:semantics="url"/><Property Name="ServiceUrl" Type="Edm.String" Nullable="false" sap:creatable="false" sap:updatable="false" sap:filterable="false" sap:semantics="url"/><Property Name="UpdatedDate" Type="Edm.DateTime" Nullable="false" Precision="0" m:FC_KeepInContent="true" m:FC_TargetPath="SyndicationUpdated" sap:label="Time Stamp" sap:creatable="false" sap:updatable="false" sap:filterable="false"/><Property Name="ReleaseStatus" Type="Edm.String" Nullable="false" sap:creatable="false" sap:updatable="false" sap:filterable="false"/><Property Name="IsSapService" Type="Edm.Boolean" Nullable="false" sap:creatable="false" sap:updatable="false" sap:filterable="false"/><NavigationProperty Name="EntitySets" Relationship="catalogservice.EntitySets" FromRole="FromRole_EntitySets" ToRole="ToRole_EntitySets"/><NavigationProperty Name="TagCollection" Relationship="catalogservice.TagsServices" FromRole="ToRole_TagsServices" ToRole="FromRole_TagsServices"/><NavigationProperty Name="Annotations" Relationship="catalogservice.ServicesAnnotations" FromRole="FromRole_ServicesAnnotations" ToRole="ToRole_ServicesAnnotations"/></EntityType><EntityType Name="Tag" sap:content-version="2"><Key><PropertyRef Name="ID"/></Key><Property Name="ID" Type="Edm.String" Nullable="false" sap:label="Identifier" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="Text" Type="Edm.String" Nullable="false" sap:label="Text" sap:creatable="false"/><Property Name="Occurrence" Type="Edm.Int16" Nullable="false" sap:label="Description" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><NavigationProperty Name="Services" Relationship="catalogservice.TagsServices" FromRole="FromRole_TagsServices" ToRole="ToRole_TagsServices"/></EntityType><EntityType Name="EntitySet" sap:content-version="2"><Key><PropertyRef Name="ID"/><PropertyRef Name="SrvIdentifier"/></Key><Property Name="ID" Type="Edm.String" Nullable="false" m:FC_KeepInContent="true" m:FC_TargetPath="SyndicationTitle" sap:label="Identifier" sap:creatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="SrvIdentifier" Type="Edm.String" Nullable="false" sap:label="Service Identifier" sap:creatable="false" sap:updatable="false" sap:sortable="false"/><Property Name="Description" Type="Edm.String" Nullable="false" sap:label="Text" sap:creatable="false" sap:updatable="false"/><Property Name="TechnicalServiceName" Type="Edm.String" Nullable="false" sap:label="Technical Service Name" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><Property Name="TechnicalServiceVersion" Type="Edm.String" Nullable="false" sap:label="Technical Service Version" sap:creatable="false" sap:updatable="false" sap:sortable="false" sap:filterable="false"/><NavigationProperty Name="Service" Relationship="catalogservice.EntitySets" FromRole="ToRole_EntitySets" ToRole="FromRole_EntitySets"/></EntityType><EntityType Name="Catalog" sap:content-version="2"><Key><PropertyRef Name="ID"/></Key><Property Name="ID" Type="Edm.String" Nullable="false" sap:creatable="false" sap:filterable="false"/><Property Name="Description" Type="Edm.String" Nullable="false" sap:creatable="false" sap:filterable="false"/><Property Name="ImageUrl" Type="Edm.String" Nullable="false" sap:creatable="false" sap:filterable="false"/><Property Name="Title" Type="Edm.String" Nullable="false" sap:creatable="false" sap:filterable="false"/><Property Name="UpdatedDate" Type="Edm.DateTime" Nullable="false" Precision="0" sap:creatable="false" sap:filterable="false"/><Property Name="Url" Type="Edm.String" Nullable="false" sap:creatable="false" sap:filterable="false"/><NavigationProperty Name="Services" Relationship="catalogservice.Services" FromRole="FromRole_Services" ToRole="ToRole_Services"/></EntityType><Association Name="TagsServices" sap:content-version="2"><End Type="catalogservice.Tag" Multiplicity="*" Role="FromRole_TagsServices"/><End Type="catalogservice.Service" Multiplicity="*" Role="ToRole_TagsServices"/></Association><Association Name="ServicesAnnotations" sap:content-version="2"><End Type="catalogservice.Service" Multiplicity="*" Role="FromRole_ServicesAnnotations"/><End Type="catalogservice.Annotation" Multiplicity="*" Role="ToRole_ServicesAnnotations"/></Association><Association Name="EntitySets" sap:content-version="2"><End Type="catalogservice.Service" Multiplicity="1" Role="FromRole_EntitySets"/><End Type="catalogservice.EntitySet" Multiplicity="*" Role="ToRole_EntitySets"/></Association><Association Name="Services" sap:content-version="2"><End Type="catalogservice.Catalog" Multiplicity="1" Role="FromRole_Services"/><End Type="catalogservice.Service" Multiplicity="*" Role="ToRole_Services"/></Association><EntityContainer Name="catalogservice_Entities" m:IsDefaultEntityContainer="true" sap:supported-formats="atom json xlsx"><EntitySet Name="Annotations" EntityType="catalogservice.Annotation" sap:updatable="false" sap:deletable="false" sap:content-version="2"/><EntitySet Name="Vocabularies" EntityType="catalogservice.Vocabulary" sap:updatable="false" sap:deletable="false" sap:addressable="false" sap:content-version="2"/><EntitySet Name="ServiceCollection" EntityType="catalogservice.Service" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:searchable="true" sap:content-version="2"/><EntitySet Name="TagCollection" EntityType="catalogservice.Tag" sap:creatable="false" sap:updatable="false" sap:content-version="2"/><EntitySet Name="EntitySetCollection" EntityType="catalogservice.EntitySet" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="2"/><EntitySet Name="CatalogCollection" EntityType="catalogservice.Catalog" sap:content-version="2"/><AssociationSet Name="AssocSet_Services" Association="catalogservice.Services" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="2"><End EntitySet="CatalogCollection" Role="FromRole_Services"/><End EntitySet="ServiceCollection" Role="ToRole_Services"/></AssociationSet><AssociationSet Name="AssocSet_ServicesAnnotations" Association="catalogservice.ServicesAnnotations" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="2"><End EntitySet="ServiceCollection" Role="FromRole_ServicesAnnotations"/><End EntitySet="Annotations" Role="ToRole_ServicesAnnotations"/></AssociationSet><AssociationSet Name="AssocSet_EntitySets" Association="catalogservice.EntitySets" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="2"><End EntitySet="ServiceCollection" Role="FromRole_EntitySets"/><End EntitySet="EntitySetCollection" Role="ToRole_EntitySets"/></AssociationSet><AssociationSet Name="AssocSet_TagsServices" Association="catalogservice.TagsServices" sap:creatable="false" sap:updatable="false" sap:deletable="false" sap:content-version="2"><End EntitySet="TagCollection" Role="FromRole_TagsServices"/><End EntitySet="ServiceCollection" Role="ToRole_TagsServices"/></AssociationSet><FunctionImport Name="BestMatchingService" ReturnType="catalogservice.Service" EntitySet="ServiceCollection" m:HttpMethod="GET"><Parameter Name="TechnicalServiceVersionMin" Type="Edm.Int16" Mode="In" Nullable="false"/><Parameter Name="TechnicalServiceName" Type="Edm.String" Mode="In" Nullable="false"/><Parameter Name="TechnicalServiceVersionMax" Type="Edm.Int16" Mode="In" Nullable="false"/></FunctionImport><FunctionImport Name="ClearMetadataCacheForService" ReturnType="catalogservice.Service" EntitySet="ServiceCollection" m:HttpMethod="GET"><Parameter Name="ServiceID" Type="Edm.String" Mode="In" Nullable="false"/></FunctionImport></EntityContainer><atom:link rel="self" href="https://ldciuyr:44300/sap/opu/odata/iwfnd/catalogservice;v=2/$metadata" xmlns:atom="http://www.w3.org/2005/Atom"/><atom:link rel="latest-version" href="https://ldciuyr:44300/sap/opu/odata/iwfnd/catalogservice;v=2/$metadata" xmlns:atom="http://www.w3.org/2005/Atom"/></Schema></edmx:DataServices></edmx:Edmx>']);
		return ODataServiceUtils.isAnalyticalService("testDest", "/notAnalyticalService").then(function(analyticalService) {
			assert.strictEqual(analyticalService, "NOT_ANALYTICAL_SERVICE", "service is not an analytical service");
			done();
		}).catch(function(error) {
			assert.ok(false, "promise should not reject");
			done();
		});
	});
	QUnit.test("Service has wrong OData version", function(assert) {
		var done = assert.async();
		this.server.respondWith("GET", "/destination/testDest/odataV4Service/$metadata", [200, { "Content-Type": "application/xml", "odata-version": "4.0" }, '<?xmlversion="1.0"encoding="utf-8"?><edmx:EdmxVersion="4.0"xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx"><edmx:ReferenceUri="https://oasis-tcs.github.io/odata-vocabularies/vocabularies/Org.OData.Capabilities.V1.xml"><edmx:IncludeAlias="Capabilities"Namespace="Org.OData.Capabilities.V1"/></edmx:Reference><edmx:DataServices><SchemaNamespace="CatalogService"xmlns="http://docs.oasis-open.org/odata/ns/edm"><EntityContainerName="EntityContainer"><EntitySetName="Books"EntityType="CatalogService.Books"/></EntityContainer><EntityTypeName="Books"><Key><PropertyRefName="ID"/></Key><PropertyName="ID"Type="Edm.Int32"Nullable="false"/><PropertyName="title"Type="Edm.String"/><PropertyName="stock"Type="Edm.Int32"/></EntityType><AnnotationsTarget="CatalogService.EntityContainer/Books"><AnnotationTerm="Capabilities.DeleteRestrictions"><RecordType="Capabilities.DeleteRestrictionsType"><PropertyValueProperty="Deletable"Bool="false"/></Record></Annotation><AnnotationTerm="Capabilities.InsertRestrictions"><RecordType="Capabilities.InsertRestrictionsType"><PropertyValueProperty="Insertable"Bool="false"/></Record></Annotation><AnnotationTerm="Capabilities.UpdateRestrictions"><RecordType="Capabilities.UpdateRestrictionsType"><PropertyValueProperty="Updatable"Bool="false"/></Record></Annotation></Annotations></Schema></edmx:DataServices></edmx:Edmx>']);
		return ODataServiceUtils.isAnalyticalService("testDest", "/odataV4Service").then(function(analyticalService) {
			assert.ok(false, "promise should not resolve");
			done();
		}).catch(function(error) {
			assert.strictEqual(error, "WRONG_ODATA_VERSION");
			done();
		});
	});
	QUnit.test("Service cannot be reached for checks: HTTP-Errors", function(assert) {
		var done = assert.async();
		this.server.respondWith("GET", "/destination/testDest/notExistingService/$metadata", [404, { }, '']);
		return ODataServiceUtils.isAnalyticalService("testDest", "/notExistingService").then(function(analyticalService) {
			assert.ok(false, "promise should not resolve");
			done();
		}).catch(function(error) {
			assert.strictEqual(error, "NOT_ACCESSIBLE");
			done();
		});
	});
	QUnit.test("Service cannot be reached for checks: No valid Metadata provided", function(assert) {
		var done = assert.async();
		this.server.respondWith("GET", "/destination/testDest/invalidMetadataService/$metadata", [200, { }, 'asdfjöaskdjflsa']);
		return ODataServiceUtils.isAnalyticalService("testDest", "/invalidMetadataService").then(function(analyticalService) {
			assert.ok(false, "promise should not resolve");
			done();
		}).catch(function(error) {
			assert.strictEqual(error, "NOT_ACCESSIBLE");
			done();
		});
	});

	/*eslint-disable new-cap*/
	QUnit.module("OData Services", {
		beforeEach: function() {
			var env = this;
			env.stubAjax = sinon.stub(jQuery, "ajax");
		},
		afterEach: function() {
			this.stubAjax.restore();
		}
	});
	QUnit.test("Ajax Call Fails", function(assert) {
		var env = this;
		var done = assert.async();
		env.stubAjax.returns(jQuery.Deferred().reject());
		ODataServiceUtils.discoverServices("myDestination").catch(function() {
			assert.ok(env.stubAjax.withArgs("/destination/myDestination/odata/v2/").calledOnce, "ajax is called once with the OData list endpoint");
			done();
		});
	});
	QUnit.test("Ajax Call Returns Unsuccessful Response", function(assert) {
		var env = this;
		var done = assert.async();
		env.stubAjax.returns(jQuery.Deferred().resolveWith(null, [undefined, undefined, {
			status: 404
		}]));
		ODataServiceUtils.discoverServices("myDestination").catch(function() {
			assert.ok(env.stubAjax.withArgs("/destination/myDestination/odata/v2/").calledOnce, "ajax is called once with the OData list endpoint");
			done();
		});
	});
	QUnit.test("Ajax Call Returns Empty Page", function(assert) {
		var env = this;
		var done = assert.async();
		env.stubAjax.returns(jQuery.Deferred().resolveWith(null, ["", undefined, {
			status: 200
		}]));
		ODataServiceUtils.discoverServices("myDestination").catch(function() {
			assert.ok(env.stubAjax.withArgs("/destination/myDestination/odata/v2/").calledOnce, "ajax is called once with the OData list endpoint");
			done();
		});
	});
	QUnit.test("Ajax Call Returns Some Page", function(assert) {
		var env = this;
		var done = assert.async();
		env.stubAjax.returns(jQuery.Deferred().resolveWith(null, ["<h1>Some Page</h1>\n<a href=\"https://my-link.com/\"></a>", undefined, {
			status: 200
		}]));
		ODataServiceUtils.discoverServices("myDestination").catch(function() {
			assert.ok(env.stubAjax.withArgs("/destination/myDestination/odata/v2/").calledOnce, "ajax is called once with the OData list endpoint");
			done();
		});
	});
	QUnit.test("Ajax Call Returns Empty OData List", function(assert) {
		var env = this;
		var done = assert.async();
		env.stubAjax.returns(jQuery.Deferred().resolveWith(null, ["<h1>OData endpoints:</h1>", undefined, {
			status: 200
		}]));
		ODataServiceUtils.discoverServices("myDestination").then(function(aEndpoints) {
			assert.ok(env.stubAjax.withArgs("/destination/myDestination/odata/v2/").calledOnce, "ajax is called once with the OData list endpoint");
			assert.deepEqual(aEndpoints, [], "no endpoints returned");
			done();
		});
	});
	QUnit.test("Ajax Call Returns OData List", function(assert) {
		var env = this;
		var done = assert.async();
		var expectedEndpoints = [{
				Url: "/odata/first-endpoint/"
			}, {
				Url: "/odata/second-endpoint/"
			}
		];
		env.stubAjax.returns(jQuery.Deferred().resolveWith(null, [
			"<h1>OData endpoints:</h1>\n\n" +
			"<a href=\"https://host.com/odata/first-endpoint/\"></a>\n" +
			"<br>\n" +
			"<a href=\"https://host.com/odata/second-endpoint/\"></a>\n" +
			"Some text ..",
			undefined, {
				status: 200
		}]));
		ODataServiceUtils.discoverServices("myDestination").then(function(aEndpoints) {
			assert.ok(env.stubAjax.withArgs("/destination/myDestination/odata/v2/").calledOnce, "ajax is called once with the OData list endpoint");
			assert.deepEqual(aEndpoints, expectedEndpoints, "returned correct endpoints");
			done();
		}).catch(function() {
			assert.ok(false, "promise should not reject");
			done();
		});
	});
	/*eslint-enable new-cap*/

});
