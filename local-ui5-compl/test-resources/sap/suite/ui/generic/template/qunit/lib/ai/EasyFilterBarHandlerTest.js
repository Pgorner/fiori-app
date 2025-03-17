/**
 *Tests for sap.suite.ui.generic.template.lib.ai.EasyFilterBarHandler
 */
 sap.ui.define(
    [ "sap/suite/ui/generic/template/lib/ai/EasyFilterBarHandler",
    "testUtils/sinonEnhanced",
    "sap/suite/ui/generic/template/genericUtilities/testableHelper"],
    function(EasyFilterBarHandler, sinon, testableHelper) {
        "use strict";
        QUnit.dump.maxDepth = 20;
        var oSandbox;
        var oState = {}, oController= {};
        var sQueryString = "";

        // Required for easy filter metadata preparation
        var sEntitySet = "Products"
        // Adding properties to the entity type of different types to test the metadata preparation
        var oEntityType = {
            property : [{
                name : "Product",
                type : "Edm.String"
            },
            {
                name : "Price",
                type : "Edm.Decimal"
            },
            {
                name : "ProductPrice",
                type : "Edm.Decimal",
                "sap:unit" : "Currency"
            },
            {
                name : "DeliveryDate",
                type : "Edm.DateTime",
                "sap:display-format" : "Date"
            }]
        };
        var sEasyFilterMetadataSample = '{"version":1,"entitySet":"Products","fields":[{"name":"Product","dataType":"Edm.String","defaultValue":[{"operator":"EQ","selectedValues":["HT-1000"]}],"filterable":true,"sortable":false,"type":"ValueHelp","unit":"","required":false,"label":"Product Name"},{"name":"Price","dataType":"Edm.Decimal","defaultValue":[{"operator":"EQ","selectedValues":["1000"]}],"filterable":true,"sortable":false,"type":"ValueHelp","unit":"","required":false,"label":"Price"},{"name":"ProductPrice","dataType":"Edm.Decimal","defaultValue":[{"operator":"EQ","selectedValues":[{"value":"1000"}]}],"filterable":true,"sortable":false,"type":"ValueHelp","unit":"Currency","required":false,"label":"Product Price"},{"name":"DeliveryDate","dataType":"Edm.DateTime","defaultValue":[{"operator":"EQ","selectedValues":[{"value":"2021-01-01"}]}],"filterable":true,"sortable":false,"type":"Calendar","unit":"","required":false,"label":"Delivery Date"}]}';
        class SFBFilterItem  {
            filterName;
            label;
            constructor (name, label) {
                this.filterName = name;
                this.label = label;
            }
            getName() {
                return this.filterName;    
            }
            getLabel() {
                return this.label;
            }
        };
        oState.oSmartFilterbar = {
            getId : function() {
                return "template::SmartFilterBar";
            },
            getSmartVariant : function() {
                return {
                    currentVariantSetModified : Function.prototype
                }
            },
            search : Function.prototype,
            getAllFilterItems : function() {
                var aSFBFilterItems = [];
                aSFBFilterItems.push(new SFBFilterItem("Product", "Product Name"));
                aSFBFilterItems.push(new SFBFilterItem("Price", "Price"));
                aSFBFilterItems.push(new SFBFilterItem("ProductPrice", "Product Price"));
                aSFBFilterItems.push(new SFBFilterItem("DeliveryDate", "Delivery Date"));
                return aSFBFilterItems;
            },
            isInitialised : function() {
                return true;
            },
            getModel : function (){
                return {
                    getMetaModel : function() {
                        return {
                            getODataProperty : Function.prototype,
                            createBindingContext : Function.prototype,
                            getODataValueLists : function() {
                               return Promise.resolve();
                            }
                        };
                    }
                };
            },
            getFilterData : function() {
                return {
                    Product : {
                        items : [{
                            key : "HT-1000"
                        }]
                    },
                    Price : {
                        ranges : [
                            {
                                exclude : false,
                                operation : "EQ",
                                value1 : "1000"
                            }
                        ]
                    },
                    ProductPrice : {
                        value : "1000"
                    },
                    DeliveryDate : {
                        value : "2021-01-01"
                    }
                }
            }
        };

        var oEasyFilter = {
            setContextPath : Function.prototype,
            setAppId : Function.prototype,
            setFilterBarMetadata : Function.prototype
        };

        oState.oIappStateHandler = {
            onFEStartupInitialized : function() {
                return Promise.resolve();
            }
        };

        var oSmartFilterBarWrapper = {
            getState : function() {
                var customFilters = {
                    appExtension : {

                    },
                    editState : {

                    }
                };
                return {customFilters};
            },
            setState : function() {

            }
        };

        var oFilterControl = {
            getValue : function() {
                return sQueryString;
            },
            setValueState : Function.prototype,
            setValueStateText : Function.prototype
        };


        // Queries and relevant AI filter samples
        var mAIQueries = {
            Q1 : "Show me products HT-1000 and HT-2000",
            Q2 : "Show me products HT-1000 and Supplier SAP"
        };
        // EasyFilterTokenChangeEvent from the fe easy filter control
        // This event is triggered after a token change and the event parameter contains the token
        var oEasyFilterTokenChangeEvent = {
            getParameter : function() {
                return mQueryAndFilterMapTokens[sQueryString];
            }
        };
        var mQueryAndFilterMapTokens = {
            [mAIQueries.Q1] : [
                {
                    key : "Product",
                    keySpecificSelectedValues : [{
                        operator : "EQ",
                        selectedValues : [
                            "HT-1000"
                        ]
                    }]
                },
                {
                    key : "Product",
                    keySpecificSelectedValues : [{
                        operator : "EQ",
                        selectedValues : [
                            "HT-2000"
                        ]
                    }]
                }
            ],
            [mAIQueries.Q2] : [
                {
                    key : "Product",
                    keySpecificSelectedValues : [{
                        operator : "EQ",
                        selectedValues : [
                            "HT-1000"
                        ]
                    }]
                },
                {
                    key : "Supplier",
                    keySpecificSelectedValues : [{
                        operator : "EQ",
                        selectedValues : [
                            "SAP"
                        ]
                    }]
                }
            ]
        };
        // Sample of FE created select option
        var mQueryAndFESelectOptionMap = {
            [mAIQueries.Q1] : [
                {
                    PropertyName : "Product",
                    Ranges: [{
                        High : "",
                        Low : "HT-1000",
                        Option : "EQ",
                        Sign : "I"
                    }]
                },{
                    PropertyName : "Product",
                    Ranges: [{
                        High : "",
                        Low : "HT-2000",
                        Option : "EQ",
                        Sign : "I" 
                    }]
                }
            ],
            [mAIQueries.Q2] : [
                {
                    PropertyName : "Product",
                    Ranges: [{
                        High : "",
                        Low : "HT-1000",
                        Option : "EQ",
                        Sign : "I" 
                    }]
                },{
                    PropertyName : "Supplier",
                    Ranges: [{
                        High : "",
                        Low : "SAP",
                        Option : "EQ",
                        Sign : "I"
                    }]
                }
            ]
        };

        oController = {
            byId : function(sID) {
                switch(sID) {
                    case "template::SmartFilterBar":
                        return oState.oSmartFilterbar;
                    case "template::easyFilterContainer":
                        return oEasyFilter;
                }
            },
            getOwnerComponent : function() {
                return {
                    getEntitySet : function () {
                        return sEntitySet;
                    },
                    getAppComponent : function() {
                        return {
                            getManifestEntry : function() {
                                return {
                                    id : "test"
                                }
                            }
                        }
                    }
                }
            }
        };
        var oTemplateUtils = {
            oServices : {
                oFioriAIHandler : {
                    fioriaiLib : {
                        EasyFilter : {
                            easyFilter : function(sEasyFilterQuery) {
                                return Promise.resolve({
                                    success : true,
                                    data : {
                                        version : 1,
                                        filter : mQueryAndFilterMapTokens[sEasyFilterQuery]
                                    }
                                }); 
                            }
                        }
                    }
                }
            },
            oCommonUtils : {
                getMetaModelEntityType : function() {
                    return oEntityType;
                },
                getControlStateWrapperById : function() {
                    return oSmartFilterBarWrapper;
                }
            },
            oComponentUtils : {
                isDraftEnabled : function() {
                    return true;
                }
            }
        };

       
        function fnGeneralTeardown(){
			oSandbox.restore();
	    }
        function fnGeneralSetup(){
            oSandbox = sinon.sandbox.create();
        }
        QUnit.module("Easyfilter", {
            beforeEach: fnGeneralSetup,
            afterEach: fnGeneralTeardown
        });

        QUnit.test("Initialize EasyFilter", function(assert) {
            var done = assert.async();
            var oSetContextPathSpy = oSandbox.spy(oEasyFilter, "setContextPath");
            var oSetAppIdSpy = oSandbox.spy(oEasyFilter, "setAppId");
            var oSetFilterBarMetadataSpy = oSandbox.spy(oEasyFilter, "setFilterBarMetadata");
            var oEasyFilterBarHandler = new EasyFilterBarHandler(oState, oController, oTemplateUtils);
            oEasyFilterBarHandler.initialiseEasyFilterBar();
            oEasyFilterBarHandler.getEasyFilterSearchMetadata().then(function() {
                assert.ok(oSetContextPathSpy.calledOnce, "EasyFilter control setContextPath was called during the EasyFilter initialization");
                assert.ok(oSetAppIdSpy.calledOnce, "EasyFilter control setAppId was called during the EasyFilter initialization");
                assert.ok(oSetFilterBarMetadataSpy.calledOnce, "EasyFilter control setFilterBarMetadata was called during the EasyFilter initialization");
                done();
            });
        });
        QUnit.test("Prepare Easyfilter metadata", function(assert) {
            var done = assert.async();
            var oEasyFilterBarHandler = new EasyFilterBarHandler(oState, oController, oTemplateUtils);
            var oEasyFilterMetadataPromise = oEasyFilterBarHandler.getEasyFilterSearchMetadata();
            oEasyFilterMetadataPromise.then(function(oEasyFilterMetadata) {
                assert.ok(oEasyFilterMetadata, "EasyFilter metadata is prepared");
                // when the sample metadata is stringified the "codeList" is removed if is undefined, but the actual metadata has it. So to compare the metadata, we need to remove the codeList by stringifying and parsing it again
                oEasyFilterMetadata = JSON.parse(JSON.stringify(oEasyFilterMetadata));
                var sEasyFilterMetadata = JSON.parse(sEasyFilterMetadataSample);
                assert.deepEqual(oEasyFilterMetadata, sEasyFilterMetadata, "EasyFilter metadata is as expected");
                done();
            });
        });
        QUnit.test("Trigger FilterQuery in AI filter for Query Q1", function(assert) {
            var done = assert.async();
            // this is used to return the correct tokens
            sQueryString = mAIQueries.Q1;
            var oEasyFilterBarHandler = new EasyFilterBarHandler(oState, oController, oTemplateUtils);
            oEasyFilterBarHandler.onTokensChanged(oEasyFilterTokenChangeEvent);
            var oAIFilters = oEasyFilterTokenChangeEvent.getParameter("tokens");
            assert.ok(oAIFilters, "Filter results from AI recieved");
            var aSelectOptions = oEasyFilterBarHandler.getSFBVariantData(oAIFilters).aSelectOptions;
            assert.deepEqual( mQueryAndFESelectOptionMap[mAIQueries.Q1] , aSelectOptions, "Expected select option is created from AI response");
            done();

        });
        QUnit.test("Trigger FilterQuery in AI filter for Query Q2", function(assert) {
            var done = assert.async();
            sQueryString = mAIQueries.Q2;
            var oEasyFilterBarHandler = new EasyFilterBarHandler(oState, oController, oTemplateUtils);
            var oAIFilters = oEasyFilterTokenChangeEvent.getParameter("tokens");
            assert.ok(oAIFilters, "Filter results from AI recieved");
            var aSelectOptions = oEasyFilterBarHandler.getSFBVariantData(oAIFilters).aSelectOptions;
            assert.deepEqual( mQueryAndFESelectOptionMap[mAIQueries.Q2] , aSelectOptions, "Expected select option is created from AI response");
            done();
        });
    }
);