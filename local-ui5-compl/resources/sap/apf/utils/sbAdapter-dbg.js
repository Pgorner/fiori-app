/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
sap.ui.define([
      "sap/apf/abap/LrepConnector",
      "sap/base/Log",
      "sap/base/util/deepExtend",
      "sap/ui/thirdparty/jquery",
      "sap/ui/thirdparty/datajs"
], function(LrepConnector, Log, deepExtend, jQuery, OData){
      'use strict';
      var suiteOnHanaIntentRT = {
                  semanticObject: "FioriApplication",
                  action: "executeAPFConfiguration"
      };
      var suiteOnHanaIntentDT = {
                  semanticObject: "FioriApplication",
                  action: "editAPFConfiguration"
      };
      var s4IntentRT = {
                  semanticObject: "FioriApplication",
                  action: "executeAPFConfigurationS4HANA"
      };

      var s4IntentDT = {
                  semanticObject: "FioriApplication",
                  action: "editAPFConfigurationS4HANA"
      };
      var hanaRequestUri = "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata/AnalyticalConfigurationQueryResults";

      var oChip = undefined;

      var sbAdapter = {};
      sbAdapter._hanaConfigurations = undefined;
      sbAdapter._lrepConfigurations = undefined;
      /**
      * @public
      * @name sap.apf.utils.sbAdapter.getConfigurations
      * @description An APF adapter for SmartBusiness. Can be called to get all configurations that are stored in either LREP(S4HANA)
      * or in HANA tables (Suite on HANA)
      * @param {String} semanticObject Custom semantic object. Will be returned as runtimeIntent if both parameters are filled
      * @param {String} action Custom action. Will be returned as runtimeIntent if both parameters are filled
      * @returns {jQuery.Deferred} Returns a promise that will be resolved with an Array of configurations
       * Sample Configuration:
      * {
      *          title: "Configuration Title"
      *          id: "2135213123241"
      *          runtimeIntent: {
      *                semanticObject: "FioriApplication",
      *                action: "executeAPFConfiguration"
      *          },
      *          modelerIntent: {
      *                semanticObject: "FioriApplication",
      *                action: "editAPFConfiguration"
      *          }
      * }
      */
      sbAdapter.getConfigurations = function (semanticObject, action) {
            var deferred = jQuery.Deferred();
            var configurations = [];
            jQuery.when(readLrepConfigurations(), readHanaConfigurations()).then(function(lrepConfigurations, hanaConfigurations){
                  configurations = hanaConfigurations.concat(lrepConfigurations);
                  var customIntent = getCustomIntent(semanticObject, action);
                  if (customIntent && !intentsAreEqual(customIntent, suiteOnHanaIntentRT) && !intentsAreEqual(customIntent, s4IntentRT)) {
                        configurations.forEach(function(configuration){
                              configuration.runtimeIntent = customIntent;
                        });
                  }
                  deferred.resolve(configurations);
            });
            return deferred.promise();
      };
      /**
      * @public
      * @name sap.apf.utils.sbAdapter.getTargetMappingInstaceIDsWithConfiguration
      * @description An APF adapter for SmartBusiness. Can be called to get all configurations that are stored in either LREP(S4HANA)
      * or in HANA tables (Suite on HANA)
      * @param {String} semanticObject Custom semantic object. Will be returned as runtimeIntent if both parameters are filled
      * @param {String} action Custom action. Will be returned as runtimeIntent if both parameters are filled
      * @param {String} landscape. Will be either "S" SAP landscape or "C" Customer landscape
      * @param {String} Catalog will be Fiori UI2 Catalog ID. Format : X-SAP-UI2-CATALOGPAGE:<CATALOGID>.
      * @returns {jQuery.Deferred} Returns a promise that will be resolved with an Array of configurations
      * Sample Configuration:
      * {
      *          applicationId: "552F1C7BAD102904E10000000A445EC1"
      *          configurationId: "15078955987181557025743154170095"
      *          title: "Configuration Title"
      *          id: "552F1C7BAD102904E10000000A445EC1.15078955987181557025743154170095"
      *          runtimeIntent: {
      *                semanticObject: "FioriApplication",
      *                action: "executeAPFConfiguration"
      *          },
      *          modelerIntent: {
      *                semanticObject: "FioriApplication",
      *                action: "editAPFConfiguration"
      *          },
      *      targetMappingInstanceIDs: [{
      *          instanceID: "ET091VRSCA1TJZWPCK722YBWV"
      *                semanticAction: "showSpainSIILog"
      *                semanticObject: "FinanceApplicationLog"
      *                semanticParameters: {LogObjectId: {…}, LogObjectSubId: {…}, LogExternalId: {…}, PersKey: {…}, DateFrom: {…}, …}
      *                title: "Application Logs for eDocuments"
      *      }]
      * }
      */
      /*eslint max-depth: [2, 6]*/
      /*eslint-env es6*/
      sbAdapter.getTargetMappingInstaceIDsWithConfigurations = function (semanticObject, action, landscape, catalogId){
          var deferred = jQuery.Deferred();
          var configurations = [];
          var targetConfiguration = [];
          jQuery.when(readLrepConfigurations(), readHanaConfigurations()).then(function(lrepConfigurations, hanaConfigurations){
              getTargetMappingInstanceIDsFromCatalogID(landscape,catalogId).then(function(targetMappingIds){
              return delay(1000).then(function(){
                configurations = hanaConfigurations.concat(lrepConfigurations);
                var customIntent = getCustomIntent(semanticObject, action);
                targetMappingIds.forEach(function(targetMappingId){
                if(targetMappingId.semanticParameters["sap-apf-configuration-id"]){
                var confID = targetMappingId.semanticParameters["sap-apf-configuration-id"].defaultValue;
                configurations.forEach(function(configuration){
                      if(confID.value === configuration.id){
                      configuration.targetMappingInstanceId = targetMappingId;
                      if (customIntent && !intentsAreEqual(customIntent, suiteOnHanaIntentRT) && !intentsAreEqual(customIntent, s4IntentRT)) {
                          configuration.runtimeIntent = customIntent;
                      }
                      targetConfiguration.push(configuration);
                      }
                });
                }
                });
                deferred.resolve(targetConfiguration);
              });
            });
          });
          return deferred.promise();

          function delay(t, v) {
            return new Promise(function(resolve) {
               setTimeout(resolve.bind(null, v), t)
            });
          }
      }

      /**
      * @public
      * @name sap.apf.utils.sbAdapter.getConfigurationNameById
      * @description An APF adapter for SmartBusiness. Can be called to get a configurationName with a given configurationId
      * If the configurationId contains a "." then the Lrep is read, otherwise the HANA tables will be queried.
      * @param {String} configurationId
      * @returns {jQuery.Deferred} Returns a promise that will be resolved with a String
      */
      sbAdapter.getConfigurationNameById = function (configurationId) {
            var deferred = jQuery.Deferred();
            if(!configurationId){
                  return deferred.resolve("");
            }
            if(configurationId.indexOf(".") > -1){
                  readLrepConfigurations().done(getConfigurationNameById);
            } else {
                  readHanaConfigurations().done(getConfigurationNameById);
            }
            return deferred.promise();

            function getConfigurationNameById (configurations){
                  configurations.forEach(function(configuration){
                        if(configuration.id === configurationId){
                              deferred.resolve(configuration.title);
                        }
                  });
                  if (deferred.state !== "resolved"){
                        deferred.resolve("");
                  }
            }
      };
      function readHanaConfigurations(){
            var deferred = jQuery.Deferred();
            if(!sbAdapter._hanaConfigurations){
                  var request = {
                              requestUri : hanaRequestUri + "?$select=AnalyticalConfiguration,AnalyticalConfigurationName,Application",
                              async : true,
                              method : "GET"
                  };
                  OData.request(request, success, fail);
            } else {
                  deferred.resolve(deepExtend([], sbAdapter._hanaConfigurations));
            }
            return deferred.promise();

            function success (response){
                  var hanaConfigurations = [];
                  response.results.forEach(function(configuration){
                        hanaConfigurations.push({
                              title: configuration.AnalyticalConfigurationName,
                              id: configuration.AnalyticalConfiguration,
                              runtimeIntent: suiteOnHanaIntentRT,
                              modelerIntent: suiteOnHanaIntentDT,
                              configurationId: configuration.AnalyticalConfiguration,
                              applicationId: configuration.Application
                        });
                  });
                  sbAdapter._hanaConfigurations = deepExtend([], hanaConfigurations);
                  deferred.resolve(hanaConfigurations);
            }
            function fail (){
                  sbAdapter._hanaConfigurations = [];
                  deferred.resolve([]);
            }
      }
      function readLrepConfigurations(){
            var deferred = jQuery.Deferred();
            if(!sbAdapter._lrepConfigurations){
                  sendLrepRequest().then(function(lrepResponse){
                        var lrepConfigurations = [];
                        lrepResponse.response.forEach(function(data){
                              var applicationId;
                              var configurationId;
                              if (data.fileType && data.fileType === "apfconfiguration") {
                                    applicationId = getApplicationId(data);
                                    configurationId = data.name;
                                    lrepConfigurations.push({
                                          title: getElementValueFromMetadata(data, 'apfdt-configname'),
                                          id: applicationId + "." + configurationId,
                                          runtimeIntent: s4IntentRT,
                                          modelerIntent: s4IntentDT,
                                          configurationId: configurationId,
                                          applicationId: applicationId
                                    });
                              }
                        });
                        sbAdapter._lrepConfigurations = deepExtend([], lrepConfigurations);
                        deferred.resolve(lrepConfigurations);
                  }, function (){
                        deferred.resolve([]);
                        sbAdapter._lrepConfigurations = [];
                  });
            } else {
                  deferred.resolve(deepExtend([], sbAdapter._lrepConfigurations));
            }
            return deferred.promise();
      }
      function getPageBuilderFactory(landscape) {
            var oPageBuilderFactory;
            if (sap.ushell.Container && sap.ushell.Container.getService) {
                  if (landscape == "S")
                        oPageBuilderFactory = sap.ushell.Container.getService("PageBuilding", "CONF").getFactory();
                  else if (landscape == "C")
                        oPageBuilderFactory = sap.ushell.Container.getService("PageBuilding", "CUST").getFactory();
                  else
                        oPageBuilderFactory = sap.ushell.Container.getService("PageBuilding", "PERS").getFactory();
                  return oPageBuilderFactory;
            }
      }
      /*eslint max-depth: [2, 8]*/
      /*eslint-env es6*/
     function getTargetMappingInstanceIDsFromCatalogID(landscape, catalog) {
            var oDeferred = jQuery.Deferred();
            var sCatalogId = catalog;
            // X-SAP-UI2-CATALOGPAGE:SAP_SD_BC_SALES_PROC_PERF
            var aTargetMappings = [];
            var oPageBuilderFactory = getPageBuilderFactory(landscape);
            var oPageBuilderService = oPageBuilderFactory.getPageBuildingService();

            oPageBuilderService.readCatalog(sCatalogId, jQuery.proxy(function(oCatalog) {

                  if (oCatalog && oCatalog.Chips && oCatalog.Chips.results instanceof Array) {

                        jQuery.each(oCatalog.Chips.results, jQuery.proxy(function(iChipIndex, oChipConf) {
                              try {
                                    if (oChipConf && oChipConf.baseChipId === "X-SAP-UI2-CHIP:/UI2/ACTION") {
                                          oChip = oChipConf;
                                          // Read the target mapping configuration for semantic object, action & parameters.
                                          var oConfiguration = JSON.parse(oChip.configuration);
                                          var oTileConfiguration = JSON.parse(oConfiguration.tileConfiguration);
			                              var ui5Component = oTileConfiguration.ui5_component;
			                              var oSmart = "smartbusiness";
			                              var apf = "sap.apf";
			                              if (ui5Component && ui5Component.indexOf(oSmart) === -1){
			                                  sendLrepDescriptorRequest(ui5Component).then(function(LrepResponse){
                                              jQuery.each(LrepResponse.response.results, jQuery.proxy(function(iLibIndex, oLib) {
                                              if (oLib && oLib["sap.ui5/dependencies/libs"]){
                                                  if(oLib["sap.ui5/dependencies/libs"].indexOf(apf) !== -1){
                                                  // Read the chip bag for title.
                                                      var sTitle;
                                                      var oConfiguration = JSON.parse(oChip.configuration);
                                                      var oTileConfiguration = JSON.parse(oConfiguration.tileConfiguration);
                                                      var oParameters = oTileConfiguration.signature && oTileConfiguration.signature.parameters;
                                                      if (oChip.ChipBags && oChip.ChipBags.results instanceof Array) {
                                                            jQuery.each(oChip.ChipBags.results, jQuery.proxy(function(iBagIndex, oBag) {
                                                                  if (oBag && oBag.id === "tileProperties") {
                                                                        if (oBag.ChipProperties && oBag.ChipProperties.results instanceof Array) {
                                                                              jQuery.each(oBag.ChipProperties.results, jQuery.proxy(function(iPropertyIndex, oProperty) {
                                                                                    if (oProperty && oProperty.name === "display_title_text") {
                                                                                          sTitle = oProperty.value;
                                                                                          return false;
                                                                                    }
                                                                              }, this));
                                                                        } else {
                                                                        Log.error("sbAdapter/getTargetMappingInstanceIDsFromCatalogID",
                                                                                          "Unable to read the properties inside the chip bag 'tileProperties' for "
                                                                                          + oChip.catalogPageChipInstanceId);
                                                                        }
                                                                        return false;
                                                                  }
                                                            }, this));
                                                      } else {
                                                      Log.error("sbAdapter/getTargetMappingInstanceIDsFromCatalogID",
                                                                        "Unable to read the chip bags for " + oChip.catalogPageChipInstanceId);
                                                      }
                                                      aTargetMappings.push({
                                                            instanceID : oChip.catalogPageChipInstanceId || "",
                                                            title : sTitle || "",
                                                            semanticObject : oTileConfiguration.semantic_object || "",
                                                            semanticAction : oTileConfiguration.semantic_action || "",
                                                            ui5Component   : oTileConfiguration.ui5_component || "",
                                                            semanticParameters : oParameters || {}
                                                      });
                                                      window.TargetMapping = aTargetMappings;
                                        }
                                          }
                                    }, this));
                              }, function (){
                                   oDeferred.resolve([]);
                              });
                                          }
                                    }
                              } catch(oException) {
                              Log.error("sbAdapter/getTargetMappingInstanceIDsFromCatalogID",
                                                oException && oException.message);
                              }
                        }, this));
                        oDeferred.resolve(aTargetMappings);
                  } else {
                  Log.error("sbAdapter/getTargetMappingInstanceIDsFromCatalogID", "Invalid catalog object");
                        oDeferred.reject();
                  }
            }, this), jQuery.proxy(function(sResponseMessage, oResponse) {
                  oDeferred.reject(oResponse);
            }, this));

            return oDeferred.promise();
      }
      function sendLrepRequest() {
            var connector = LrepConnector.createConnector();
            var mOptions = {
                        async : true,
                        contentType : 'application/json'
            };
            var aParams = [];
            aParams.push({ name : "deep-read", value : true});
            aParams.push({ name : "metadata", value : true});
            aParams.push({ name : "layer", value : "CUSTOMER"});
            var sRequestPath = "/sap/bc/lrep/content/sap/apf/dt/";
            sRequestPath += connector._buildParams(aParams);
            return connector.send(sRequestPath, 'GET', {}, mOptions);
      }

      function sendLrepDescriptorRequest (ui5Component){
            var connector = LrepConnector.createConnector();
            var mOptions = {
                        async : true,
                        contentType : 'application/json'
            };
            var aParams = [];
            aParams.push({ name : "sap.app/id", value : ui5Component});
            aParams.push({ name : "fields", value : "sap.ui5/dependencies/libs"});
            var sRequestPath = "/sap/bc/ui2/app_index";
            sRequestPath += connector._buildParams(aParams);
            return connector.send(sRequestPath, 'GET', {}, mOptions); 
      }
      function getApplicationId(data) {
            var namespace = data.ns.split('/');
            return namespace[namespace.length - 2];
      }
      function getElementValueFromMetadata(data, elementName) {
            var value;
            data.metadata.forEach(function(element) {
                  if (element.name === elementName) {
                        value = element.value;
                  }
            });
            return value;
      }
      function intentsAreEqual(intent1, intent2){
            if(intent1.semanticObject === intent2.semanticObject && intent1.action === intent2.action){
                  return true;
            }
            return false;
      }
      function getCustomIntent (semanticObject, action) {
            if (semanticObject && action) {
                  return {
                        semanticObject: semanticObject,
                        action: action
                  };
            }
      }
      return sbAdapter;
}, true /*Global_Export*/);