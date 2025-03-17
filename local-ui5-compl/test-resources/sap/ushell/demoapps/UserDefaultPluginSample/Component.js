// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/base/util/isEmptyObject",
    "sap/ui/core/Component",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container"
], function (Log, isEmptyObject, Component, ODataModel, jQuery, Container) {
    "use strict";

    /**
     * A unified shell plugin to support the UserDefaultParameter mechanism.
     *
     * By contributing plugins to the unified shell's UserDefaultParameter, an
     * application can provide a retrieval mechanism to e.g. initially migrate
     * SU01 set/get parameter settings configured on a back-end server to the
     * front-end server
     *
     * These components are shipped similarly compared to configuring them as UI5
     * applications with the intent "Shell-plugin".
     * Assigning this intent to a user will ensure that the plugin is instantiated
     * by the unified shell.
     *
     * Per configured target mapping, a single instance of the component is
     * instantiated. The plugin receives startupParameters configured in the
     * intent.
     *
     * The component instance exists as long as the unified shell is instantiated.
     *
     * Thus a plugin may store its internal state (e.g. results of a
     * previous request) within the instance to avoid repetitive round trips.
     */
    var UserDefaultPluginSample = Component.extend("sap.ushell.demo.UserDefaultPluginSample.Component", {
        metadata: {
            manifest: "json"
        }
    });

    UserDefaultPluginSample.prototype.init = function () {
        this.bLocalMode = this.oComponentData.config.localMode === "true";
        this.oPromises = {};

        if (this.bLocalMode) {
            this._setupTestData();
        } else {
            this.oModels = {};
            this.oChangedUserDefaults = {};
            this._setupKnownParametersConstant();
        }
        // Registers this plugin at the user default service.
        this.oInitPromise = Container.getServiceAsync("UserDefaultParameters").then(function (oUserDefaultParametersService) {
            oUserDefaultParametersService.registerPlugin(this);

            if (!this.bLocalMode) {
                oUserDefaultParametersService.attachValueStored(this.storeUserDefaults.bind(this));
            }
        }.bind(this));
    };

    /**
     * This function is invoked by the service to allow a plugin
     * to retrieve or alter a value of the unified shell to use for
     * a parameter.
     *
     * The parameter currentParameter is always provided, it could be either an object
     * like this: <code>{ value: undefined }</code>, indicating an initial state,
     * or a value read from the front-end server storage,
     * or a value already determined by another plugin in the invocation sequence.
     *
     * This function should return a resolved jQuery promise with a new object
     * containing the altered property values.
     * Currently relevant property values are: <code>value, noStore</code>.
     *
     * The plugin should first test whether the parameterName is relevant for it.
     * If not, it should return a resolved jQuery promise with the passed currentParameter object.
     *
     * If the plugin should only provide a value if none is provided yet, but the currentParameter contains
     * a "value" property with something other than "undefined", a resolved jQuery promise
     * with the same currentParameter object should be returned without any modification.
     * This way, any previously set value is prioritized.
     *
     * If an initial state is detected, (indicated by "value ===
     * undefined"), a plugin responsible for the parameter may attempt to
     * retrieve a value from e.g. a backend persistence and set it.
     *
     * This function is used in the runtime scenario.
     * It will be exclusively invoked by the unified shell's services.
     * It is of utmost importance that the promise be resolved quickly,
     * esp. if the parameter is not relevant for this plugin,
     * as it is frequently invoked (potentially before initial navigation
     * or tile display)
     *
     * If the plugin detects a fatal error during processing, it should
     * log relevant information as detailed as possible using sap.base.Log.error
     * and subsequently return a rejected jQuery promise.
     * In case a rejected promise is encountered, the unified shell will <b>not</b> continue processing.
     *
     * @param {string} parameterName Name of the user default to be retrieved.
     * @param {object} currentParameter Object to be modified with current values and returned.
     * @param {object} systemContext The system context object.
     * @returns {jQuery.Promise}
     *     A jQuery promise that is resolved with either a new object or a modified currentParameter object.
     *     If an error is encountered, the promise should be rejected with a descriptive error message.
     */
    UserDefaultPluginSample.prototype.getUserDefault = function (parameterName, currentParameter, systemContext) {
        var oDeferred = new jQuery.Deferred();
        // Resolve immediately if parameterName is not managed by this plugin or
        // if a value for parameterName was previously determined.
        if (!this.oManagedParameters.hasOwnProperty(parameterName) || currentParameter && currentParameter.value !== undefined) {
            return oDeferred.resolve(currentParameter).promise();
        }

        this._getUserDefaultsPromise(systemContext)
            .then(function (oUserDefaults) {
                if (!oUserDefaults.hasOwnProperty(parameterName)) {
                    oDeferred.resolve(currentParameter);
                } else {
                    var oValueObject = oUserDefaults[parameterName].value;
                    oDeferred.resolve(oValueObject);
                }
            })
            .catch(function (sReason) {
                // Deep trouble. Reject and tell unified shell to terminate.
                Log.error("unable to resolve parameter" + parameterName, this.getMetadata().getName());
                oDeferred.reject(sReason);
            }.bind(this));

        return oDeferred.promise();
    };

    /**
     * Amends an object pre-filled with user default values (possibly from
     * other plugins) with the default values served by this plugin.
     *
     * The data can either be obtained from a set of test data if the plugin is started in
     * local mode, or from the server of the provided system context using the
     * "FIN_USER_DEFAULTPARAMETER_SRV" service
     *
     *
     * @param {object} editorMetadata The editor metadata object to be amended default values.
     * @param {object} systemContext The system context object.
     *
     * @returns {jQuery.promise}
     *    A jQuery promise that is resolved with the amended editor
     *    metadata object.
     *
     * Reject or throw only in exceptional cases after exhaustive console logging
     * indicating serious trouble and terminate ushell processing.
     *
     * <pre>
     *     {
     *     "UshellSampleCostCenter": {
     *         "value" : {
     *             "value": "1000"
     *         },
     *         "editorMetadata" : {
     *             // metadata request only
     *             "displayText" : "Cost center",
     *             "description": "This is the cost center",
     *             "groupId": "EXAMPLE-FIN-GRP1",
     *             "groupTitle" : "FIN User Defaults (UShell examples)",
     *             "parameterIndex" : 2,
     *             "editorInfo" : {
     *                 // this info is opaque between editor and plugin
     *                 // assumption is that the editor attempts to bind a smart control to
     *                 // the given OData service and url
     *                 "odataURL" : "/sap/opu/odata/sap/ZFIN_USER_DEFAULTPARAMETER_SRV",
     *                 "entityName" : "Defaultparameter",
     *                 "propertyName" : "CostCenter",
     *                 "bindingPath" : "/Defaultparameters('FIN')"
     *             }
     *         }
     *     },
     *     "UshellSampleControllingArea": {
     *         "value" : {
     *             "value": "0010"
     *         },
     *         "editorMetadata" : {
     *             // metadata request only
     *             "displayText" : "Controlling Area",
     *             "description": "This is the controlling Area",
     *             "groupId": "EXAMPLE-FIN-GRP1",
     *             "groupTitle" : "FIN User Defaults (UShell examples)",
     *             "parameterIndex" : 3,
     *             "editorInfo" : {
     *                 // this info is opaque between editor and plugin
     *                 // assumption is that the editor attempts to bind a smart control to
     *                 // the given OData service and url
     *                 "odataURL" : "/sap/opu/odata/sap/ZFIN_USER_DEFAULTPARAMETER_SRV",
     *                 "entityName" : "Defaultparameter",
     *                 "propertyName" : "ControllingArea",
     *                 "bindingPath" : "/Defaultparameters('FIN')"
     *             }
     *         }
     *      }
     *     }
     * </pre>
     */
    UserDefaultPluginSample.prototype.getEditorMetadata = function (editorMetadata, systemContext) {
        var oDeferred = new jQuery.Deferred();

        if (this.bLocalMode) {
            this._getUserDefaultsPromise(systemContext)
                .then(function (oUserDefaults) {
                    // Add an editorMetadata section for managed parameters
                    Object.keys(this.oManagedParameters).forEach(function (sPropertyName) {
                        if (editorMetadata.hasOwnProperty(sPropertyName) && oUserDefaults.hasOwnProperty(sPropertyName)) {
                            editorMetadata[sPropertyName].editorMetadata = oUserDefaults[sPropertyName].editorMetadata;
                        }
                    });

                    oDeferred.resolve(editorMetadata);
                }.bind(this))
                .catch(function (sReason) {
                    Log.error("Fatal error obtaining metadata for editing,", "sap.ushell.demo.UserDefaultPluginSample.Component ");
                    oDeferred.reject(sReason);
                });
        } else {
            for (var sParameterName in this.oManagedParameters) {
                if (editorMetadata.hasOwnProperty(sParameterName)) {
                    var sGroupId = this.oManagedParameters[sParameterName].groupId;
                    editorMetadata[sParameterName].editorMetadata = {
                        groupId: sGroupId,
                        groupTitle: sGroupId,
                        parameterIndex: this.oManagedParameters[sParameterName].parameterIndex,
                        editorInfo: {
                            odataURL: systemContext.getFullyQualifiedXhrUrl("/sap/opu/odata/sap/FIN_USER_DEFAULTPARAMETER_SRV"),
                            entityName: "Defaultparameter",
                            propertyName: sParameterName,
                            bindingPath: "/Defaultparameters('FIN')"
                        }
                    };
                }
            }
            oDeferred.resolve(editorMetadata);
        }

        return oDeferred.promise();
    };

    /**
     * Simulates an OData request that retrieves the data from a backend
     * server when the plugin was configured to run in local mode.
     * Otherwise performs an OData request that retrieves the data from a backend
     * server indicated by the provided system context.
     *
     * @param {string} systemContext The systemContext to fetch the data.
     * @returns {Promise<object>} The requested user defaults object.
     * @private
     */
    UserDefaultPluginSample.prototype._retrieveUserDefaults = function (systemContext) {
        return new Promise(function (resolve, reject) {
            if (this.bLocalMode) {
                var oData = this.oTestData[systemContext.id];
                // Default to the local system if undefined
                if (oData === undefined) {
                    oData = this.oTestData[""] || {};
                }
                oData = JSON.parse(JSON.stringify(oData));

                resolve(oData);
            } else {
                this._getUserDefaultsModel(systemContext).read("/Defaultparameters(Template='FIN')", {
                    success: function (oDefaultParameters) {
                        for (var sDefaultParameterName in oDefaultParameters) {
                            if (this.oManagedParameters[sDefaultParameterName]) {
                                this.oManagedParameters[sDefaultParameterName].value = oDefaultParameters[sDefaultParameterName];
                            }
                        }
                        resolve(this.oManagedParameters);
                    }.bind(this),
                    error: function (error) {
                        reject(error.message);
                    }
                });
            }
        }.bind(this));
    };

    /**
     * Retrieves the user defaults object (calling the OData service if
     * necessary).
     *
     * @param {object} systemContext The system context object.
     *
     * @returns {Promise<object>}
     *     A promise that is resolved with an object containing the user
     *     default parameters, or rejected with an error message. The object
     *     this promise resolves with is in the following format:
     *
     * <pre>
     *    {
     *        "<nameOfDefaultValue>": {
     *          "value"       : "<any value>",
     *          "noStore"     : "<boolean>",
     *          "noEdit"      : "<boolean>",
     *          "description" : "<string>",
     *          "sortOrder"   : "<sortOrderString>"
     *        }
     *    }
     * </pre>
     *
     * @private
     */
    UserDefaultPluginSample.prototype._getUserDefaultsPromise = function (systemContext) {
        var sSystemID = systemContext.id;

        if (!this.oPromises[sSystemID]) {
            this.oPromises[sSystemID] = this._retrieveUserDefaults(systemContext);
        }

        return this.oPromises[sSystemID];
    };

    /**
     * Triggers a write operation on the model of the specified system context
     *
     * @param {object} event The event object provided by the UserDefaultParameters service
     * @returns {Promise<undefined>} A promise that resolves as soon as the values were stored or immediately if none need to be stored
     *
     * @private
     */
    UserDefaultPluginSample.prototype.storeUserDefaults = function (event) {
        return new Promise(function (resolve, reject) {
            var sParameterName = event.getParameters().parameterName,
                oParameterValue = event.getParameters().parameterValue,
                oSystemContext = event.getParameters().systemContext,
                bResolveImmediately = true;

            if (this.oManagedParameters.hasOwnProperty(sParameterName) && (!oParameterValue.value || this.oManagedParameters[sParameterName].value !== oParameterValue.value)) {
                if (isEmptyObject(this.oChangedUserDefaults)) {
                    bResolveImmediately = false;
                    window.setTimeout(function () {
                        this._getUserDefaultsModel(oSystemContext).update("/Defaultparameters('FIN')", this.oChangedUserDefaults);
                        this.oChangedUserDefaults = {};
                        resolve();
                    }.bind(this), 2000);
                }
                this.oChangedUserDefaults[sParameterName] = oParameterValue.value || "";
                this.oManagedParameters[sParameterName].value = oParameterValue.value;
            }

            if (bResolveImmediately) {
                resolve();
            }
        }.bind(this));
    };

    /**
     * Retrieves the odata model of the UserDefaults set for the specified system context
     * If no model was created for this system context yet a new one will be created instead
     *
     * @param {object} systemContext The system context of the required UserDefaults set
     * @returns {object} The model of the system contexts UserDefaults set
     *
     * @private
     */
    UserDefaultPluginSample.prototype._getUserDefaultsModel = function (systemContext) {
        if (!this.oModels[systemContext.id]) {
            var sServiceUrl = systemContext.getFullyQualifiedXhrUrl("/sap/opu/odata/sap/FIN_USER_DEFAULTPARAMETER_SRV/");
            var oRequestParams = {
                metadataUrlParams: {
                    "sap-documentation": "heading,quickinfo",
                    "sap-value-list": "none"
                }
            };
            this.oModels[systemContext.id] = new ODataModel(sServiceUrl, oRequestParams);
        }
        return this.oModels[systemContext.id];
    };

    /**
     * Sets up some test data for the local scenario
     */
    UserDefaultPluginSample.prototype._setupTestData = function () {
        this.oManagedParameters = {
            UshellSampleCompanyCode: true,
            UshellSamplePlant: true,
            UshellTest1: true,
            UshellTest2: true,
            UshellTest3: true,
            CommunityActivity: true,
            UshellSampleControllingArea: true,
            UshellSampleCostCenter: true,
            FirstName: true,
            LastName: true,
            ExtendedUserDefaultWithPlugin: true
        };
        this.oTestData = {
            demoContentProvider1: {
                UshellTest1: {
                    value: {
                        value: "Default Value for demoContentProvider1"
                    },
                    editorMetadata: {
                        displayText: "Test Default 1 (in demoContentProvider1)",
                        description: "Description of the test default 1",
                        groupId: "EXAMPLE-FIN-GRP1",
                        groupTitle: "FIN User Defaults (UShell examples)",
                        parameterIndex: 1
                    }
                },
                UshellSampleCostCenter: {
                    value: {
                        value: "1001"
                    },
                    editorMetadata: {
                        displayText: "Cost center (in demoContentProvider1)",
                        description: "This is the cost center",
                        groupId: "EXAMPLE-FIN-GRP1",
                        groupTitle: "FIN User Defaults (UShell examples)",
                        parameterIndex: 2
                    }
                }
            },
            demoContentProvider2: {
                UshellSampleCostCenter: {
                    value: {
                        value: "1002"
                    },
                    editorMetadata: {
                        displayText: "Cost center (in demoContentProvider2)",
                        description: "This is the cost center",
                        groupId: "EXAMPLE-FIN-GRP1",
                        groupTitle: "FIN User Defaults (UShell examples)",
                        parameterIndex: 2
                    }
                }
            },
            //This content provider is for the cflp integration tests
            contentProviderUserDefaultsFirstSystem: {
                FirstName: {
                    value: {
                        value: "John"
                    },
                    editorMetadata: {
                        displayText: "First Name",
                        description: "First Name",
                        groupId: "EXAMPLE-FIN-GRP1",
                        groupTitle: "FIN User Defaults (UShell examples)",
                        parameterIndex: 1
                    }
                }
            },
            "": {
                // Typical "former set/get parameter", stored on front-end server
                // Subsequently maintained there via UserDefault editor
                UshellSampleCompanyCode: {
                    value: {
                        value: "0815"
                    },
                    editorMetadata: {
                        // Metadata request only
                        displayText: "Company code",
                        description: "This is the company code",
                        groupId: "EXAMPLE-FIN-GRP1",
                        groupTitle: "FIN User Defaults (UShell examples)",
                        parameterIndex: 4,
                        editorInfo: {
                            // This info is opaque between editor and plugin.
                            // The assumption is that the editor attempts to bind a smart control to
                            // the given OData service and url.
                            odataURL: "/sap/opu/odata/sap/ZFIN_USER_DEFAULTPARAMETER_SRV",
                            entityName: "Defaultparameter",
                            propertyName: "CompanyCode",
                            bindingPath: "/Defaultparameters('FIN')"
                        }
                    }
                },
                UshellSampleCostCenter: {
                    value: {
                        value: "1000"
                    },
                    editorMetadata: {
                        displayText: "Cost center",
                        description: "This is the cost center",
                        groupId: "EXAMPLE-FIN-GRP1",
                        groupTitle: "FIN User Defaults (UShell examples)",
                        parameterIndex: 2,
                        editorInfo: {
                            odataURL: "/sap/opu/odata/sap/ZFIN_USER_DEFAULTPARAMETER_SRV",
                            entityName: "Defaultparameter",
                            propertyName: "CostCenter",
                            bindingPath: "/Defaultparameters('FIN')"
                        }
                    }
                },
                UshellSampleControllingArea: {
                    value: {
                        value: "0010"
                    },
                    editorMetadata: {
                        displayText: "Controlling Area",
                        description: "This is the controlling Area",
                        groupId: "EXAMPLE-FIN-GRP1",
                        groupTitle: "FIN User Defaults (UShell examples)",
                        parameterIndex: 3,
                        editorInfo: {
                            odataURL: "/sap/opu/odata/sap/ZFIN_USER_DEFAULTPARAMETER_SRV",
                            entityName: "Defaultparameter",
                            propertyName: "ControllingArea",
                            bindingPath: "/Defaultparameters('FIN')"
                        }
                    }
                },
                UshellTest1: {
                    value: {
                        value: "InitialFromPlugin"
                    },
                    editorMetadata: {
                        displayText: "Test Default 1",
                        description: "Description of the test default 1",
                        groupId: "EXAMPLE-FIN-GRP1",
                        groupTitle: "FIN User Defaults (UShell examples)",
                        parameterIndex: 1
                    }
                },
                UshellTest2: {
                    value: {
                        value: undefined
                    },
                    editorMetadata: {
                        displayText: "Test Default 2 ( no value)",
                        description: "Description of the test default 2",
                        groupId: "EXAMPLE-FIN-GRP1",
                        groupTitle: "FIN User Defaults (UShell examples)",
                        parameterIndex: 2
                    }
                },
                UshellTest3: {
                    value: {},
                    editorMetadata: {
                        displayText: "Test Default 3 (extended and simple value)",
                        description: "Description of the test default 3",
                        groupId: "EXAMPLE-FIN-GRP1",
                        groupTitle: "FIN User Defaults (UShell examples)",
                        parameterIndex: 3
                    }
                },
                CommunityActivity: {
                    value: {},
                    editorMetadata: {
                        displayText: "Community Activity",
                        description: "Describes how active you are on JAM",
                        groupId: "EXAMPLE-FIN-GRP1",
                        groupTitle: "FIN User Defaults (UShell examples)",
                        parameterIndex: 10
                    }
                },
                FirstName: {
                    value: { value: "John" },
                    editorMetadata: {
                        displayText: "First Name",
                        description: "Describes your first name",
                        groupId: "EXAMPLE-FIN-GRP1",
                        groupTitle: "FIN User Defaults (UShell examples)",
                        parameterIndex: 11
                    }
                },
                LastName: {
                    value: {},
                    editorMetadata: {
                        displayText: "Last Name",
                        description: "Describes your last name",
                        groupId: "EXAMPLE-FIN-GRP1",
                        groupTitle: "FIN User Defaults (UShell examples)",
                        parameterIndex: 12
                    }
                },
                ExtendedUserDefaultWithPlugin: {
                    value: {
                        value: "1000",
                        extendedValue: {
                            Ranges: [
                                {
                                    Sign: "I",
                                    Option: "BT",
                                    Low: "0",
                                    High: "4000"
                                }
                            ]
                        }
                    },
                    editorMetadata: {
                        displayText: "ExtendedUserDefaultWithPlugin",
                        description: "Describes the value for ExtendedUserDefaultWithPlugin",
                        groupId: "EXAMPLE-FIN-GRP1",
                        groupTitle: "FIN User Defaults (UShell examples)",
                        parameterIndex: 13
                    }
                },
                UshellSamplePlant: {
                    value: {
                        value: "Plant1000",
                        noStore: true,
                        noEdit: true
                    },
                    editorMetadata: {
                        displayText: "Plant",
                        description: "This is the plant code",
                        groupTitle: "UserDefaultSamplePlugin group2",
                        groupId: "SamplePlugin-GRP2",
                        parameterIndex: 1,
                        editorInfo: {
                            odataURL: "/sap/opu/odata/sap/ZMM_USER_DEFAULTPARAMETER_SRV",
                            entityName: "Defaultparameter",
                            propertyName: "Plant",
                            bindingPath: "/Defaultparameters('MM')"
                        }
                    }
                }
            }
        };
    };

    /**
     * Sets up a constant containing all known parameters. Others will be filtered after retrieval
     */
    UserDefaultPluginSample.prototype._setupKnownParametersConstant = function () {
        this.oManagedParameters = {
            CompanyCode: {
                groupId: "FI",
                parameterIndex: 1
            },
            ControllingArea: {
                groupId: "CO",
                parameterIndex: 2
            },
            CollectionGroup: {
                groupId: "FSCM",
                parameterIndex: 3
            },
            CollectionSegment: {
                groupId: "FSCM",
                parameterIndex: 4
            },
            CollectionSpecialist: {
                groupId: "FSCM",
                parameterIndex: 5
            },
            ActivityType: {
                groupId: "CO",
                parameterIndex: 6
            },
            ActivityTypeGroup: {
                groupId: "CO",
                parameterIndex: 7
            },
            AssetDepreciationArea: {
                groupId: "FI",
                parameterIndex: 8
            },
            AssetClass: {
                groupId: "FI",
                parameterIndex: 9
            },
            MasterFixedAsset: {
                groupId: "FI",
                parameterIndex: 10
            },
            FixedAsset: {
                groupId: "FI",
                parameterIndex: 11
            },
            BusinessArea: {
                groupId: "FI",
                parameterIndex: 12
            },
            BusinessProcess: {
                groupId: "CO",
                parameterIndex: 13
            },
            ChartOfAccounts: {
                groupId: "FI",
                parameterIndex: 14
            },
            CostCenter: {
                groupId: "CO",
                parameterIndex: 15
            },
            CostCenterGroup: {
                groupId: "CO",
                parameterIndex: 16
            },
            CostElement: {
                groupId: "CO",
                parameterIndex: 17
            },
            CostElementGroup: {
                groupId: "CO",
                parameterIndex: 18
            },
            CostObject: {
                groupId: "CO",
                parameterIndex: 19
            },
            CreditSegment: {
                groupId: "FSCM",
                parameterIndex: 20
            },
            Customer: {
                groupId: "SD",
                parameterIndex: 21
            },
            CustomerGroup: {
                groupId: "SD",
                parameterIndex: 22
            },
            AccountingDocumentType: {
                groupId: "FI",
                parameterIndex: 23
            },
            ExchangeRateType: {
                groupId: "FI",
                parameterIndex: 24
            },
            FinancialStatementVariant: {
                groupId: "FI",
                parameterIndex: 25
            },
            FiscalYear: {
                groupId: "FI",
                parameterIndex: 26
            },
            LedgerFiscalYear: {
                groupId: "FI",
                parameterIndex: 27
            },
            FunctionalArea: {
                groupId: "CO",
                parameterIndex: 28
            },
            GLAccount: {
                groupId: "FI",
                parameterIndex: 29
            },
            GLAccountGroup: {
                groupId: "FI",
                parameterIndex: 30
            },
            Ledger: {
                groupId: "FI",
                parameterIndex: 31
            },
            LedgerGroup: {
                groupId: "FI",
                parameterIndex: 32
            },
            InternalOrder: {
                groupId: "CO",
                parameterIndex: 33
            },
            Material: {
                groupId: "MM",
                parameterIndex: 34
            },
            MaterialType: {
                groupId: "MM",
                parameterIndex: 35
            },
            MaterialGroup: {
                groupId: "MM",
                parameterIndex: 36
            },
            Plant: {
                groupId: "MM",
                parameterIndex: 37
            },
            ProfitCenter: {
                groupId: "CO",
                parameterIndex: 38
            },
            StatisticalKeyFigure: {
                groupId: "CO",
                parameterIndex: 39
            },
            StatisticalKeyFigureGroup: {
                groupId: "CO",
                parameterIndex: 40
            },
            TaxIsCalculatedAutomatically: {
                groupId: "FI",
                parameterIndex: 41
            },
            ControlllingValuationType: {
                groupId: "CO",
                parameterIndex: 42
            },
            Supplier: {
                groupId: "MM",
                parameterIndex: 43
            },
            WBSElement: {
                groupId: "CO",
                parameterIndex: 44
            },
            BankCountry: {
                groupId: "FSCM",
                parameterIndex: 45
            },
            Bank: {
                groupId: "FSCM",
                parameterIndex: 46
            },
            BankAccount: {
                groupId: "FSCM",
                parameterIndex: 47
            },
            HouseBank: {
                groupId: "FSCM",
                parameterIndex: 48
            },
            HouseBankAccount: {
                groupId: "FSCM",
                parameterIndex: 49
            },
            Segment: {
                groupId: "FI",
                parameterIndex: 50
            },
            Project: {
                groupId: "CO",
                parameterIndex: 51
            },
            SalesOrder: {
                groupId: "SD",
                parameterIndex: 52
            },
            SalesDocumentType: {
                groupId: "SD",
                parameterIndex: 53
            },
            SalesOrderType: {
                groupId: "SD",
                parameterIndex: 54
            },
            SalesOrganization: {
                groupId: "SD",
                parameterIndex: 55
            },
            DistributionChannel: {
                groupId: "SD",
                parameterIndex: 56
            },
            Division: {
                groupId: "SD",
                parameterIndex: 57
            },
            SalesOffice: {
                groupId: "SD",
                parameterIndex: 58
            },
            SalesGroup: {
                groupId: "SD",
                parameterIndex: 59
            },
            DisplayCurrency: {
                groupId: "FI",
                parameterIndex: 60
            },
            AssetAccountingKeyFigureSet: {
                groupId: "FI",
                parameterIndex: 61
            },
            BillOfMaterialVariantUsage: {
                groupId: "PLM",
                parameterIndex: 62
            },
            ChangeNumber: {
                groupId: "PLM",
                parameterIndex: 63
            },
            SoldToParty: {
                groupId: "SD",
                parameterIndex: 64
            },
            ShipToParty: {
                groupId: "SD",
                parameterIndex: 65
            },
            BillToParty: {
                groupId: "SD",
                parameterIndex: 66
            },
            PayerParty: {
                groupId: "SD",
                parameterIndex: 67
            },
            ShippingPoint: {
                groupId: "LO",
                parameterIndex: 68
            },
            StorageLocation: {
                groupId: "MM",
                parameterIndex: 69
            },
            FinancialManagementArea: {
                groupId: "PSM",
                parameterIndex: 70
            },
            Fund: {
                groupId: "PSM",
                parameterIndex: 71
            },
            FundsCenter: {
                groupId: "PSM",
                parameterIndex: 72
            },
            CommitmentItem: {
                groupId: "PSM",
                parameterIndex: 73
            },
            FundedProgram: {
                groupId: "PSM",
                parameterIndex: 74
            },
            BudgetPeriod: {
                groupId: "PSM",
                parameterIndex: 75
            },
            BudgetEntryDocumentType: {
                groupId: "PSM",
                parameterIndex: 76
            },
            BudgetVersion: {
                groupId: "PSM",
                parameterIndex: 77
            },
            WorkCenter: {
                groupId: "MM",
                parameterIndex: 78
            },
            PurchasingOrganization: {
                groupId: "MM",
                parameterIndex: 79
            },
            PurchasingGroup: {
                groupId: "MM",
                parameterIndex: 80
            },
            AccountAssignmentCategory: {
                groupId: "MM",
                parameterIndex: 81
            },
            BOMExplosionApplication: {
                groupId: "PLM",
                parameterIndex: 82
            },
            ResponsibleCostCenter: {
                groupId: "EPPM",
                parameterIndex: 83
            },
            ProjectProfileCode: {
                groupId: "EPPM",
                parameterIndex: 84
            },
            IsPeriodBasedBalanceReporting: {
                groupId: "FI",
                parameterIndex: 85
            },
            Warehouse: {
                groupId: "MM",
                parameterIndex: 86
            },
            WarehouseWorkCenter: {
                groupId: "MM",
                parameterIndex: 87
            },
            LglCntntMContext: {
                groupId: "LCM",
                parameterIndex: 88
            },
            LglCntntMLanguage: {
                groupId: "LCM",
                parameterIndex: 89
            },
            LglCntntMGovLaw: {
                groupId: "LCM",
                parameterIndex: 90
            },
            LglCntntMMainOrgCoCode: {
                groupId: "LCM",
                parameterIndex: 91
            },
            LglCntntMMainOrgSalesOrg: {
                groupId: "LCM",
                parameterIndex: 92
            },
            LglCntntMMainOrgPurOrg: {
                groupId: "LCM",
                parameterIndex: 93
            },
            TreasuryValuationArea: {
                groupId: "FSCM",
                parameterIndex: 94
            },
            AccountingPrinciple: {
                groupId: "FI",
                parameterIndex: 95
            },
            OperatingConcern: {
                groupId: "CO",
                parameterIndex: 96
            },
            ServiceDocumentType: {
                groupId: "CRM",
                parameterIndex: 97
            },
            GLAccountHierarchy: {
                groupId: "FI",
                parameterIndex: 98
            },
            PlanningCategory: {
                groupId: "CO",
                parameterIndex: 99
            },
            GrantID: {
                groupId: "PSM",
                parameterIndex: 100
            },
            TechnicalObject: {
                groupId: "PLM",
                parameterIndex: 101
            },
            NotificationType: {
                groupId: "PLM",
                parameterIndex: 102
            },
            OrderType: {
                groupId: "PLM",
                parameterIndex: 103
            },
            MaintenancePlanningPlant: {
                groupId: "PLM",
                parameterIndex: 104
            },
            MaintenancePlant: {
                groupId: "PLM",
                parameterIndex: 105
            }
        };
    };

    return UserDefaultPluginSample;
});
