/*global sap, QUnit, sinon*/
sap.ui.define([
    'sap/ui/model/json/JSONModel',
    "sap/ui/core/Core",
    "sap/ui/core/mvc/XMLView",
    "sap/insights/utils/UrlGenerateHelper",
    "sap/insights/utils/CardDndConfig",
    "sap/insights/utils/HttpClient",
    'sap/insights/utils/AppConstants'
], function(JSONModel, Core, XMLView, UrlGenerateHelper, CardDndConfig, HttpClient, AppConstants) {
    "use strict";
    var oMockedData = null;
    var insightsCardsModel = new JSONModel();
    var pMockedDataLoaded = insightsCardsModel.loadData(sap.ui.require.toUrl("test-resources/sap/insights/qunit/__mocks__/CardHelper.json")).then(function(){
        oMockedData = insightsCardsModel.getData();
    });
    /**
     * Asynchronously loads the module for the class with the given name and returns the export of that module
     * @param {string} sClassName name of the class to load
     */
     function loadClass(sClassName) {
        var sModuleName = sClassName.replace(/\./g, "/");
        return new Promise(function(resolve, reject) {
            sap.ui.require([sModuleName], function(FNClass) {
                resolve(FNClass);
            }, reject);
        });
    }
    function mockApiResponse(body) {
        return new window.Response(JSON.stringify(body), {
        status: 200,
        headers: { 'X-CSRF-Token': 'oxD7tpC02A4S7_fZEo8iYA==' }
        });
    }
    // function mockApiResponseNoCSRFToken(body) {
    //     return new window.Response(JSON.stringify(body), {
    //     status: 200
    //     });
    // }
    function mockApiResponseError(body) {
        return new window.Response(JSON.stringify(body), {
            status: 400
        });
    }
    QUnit.module("CardHelper basic cases for sap-ushell-config flags", {
        before: function() {
            // ensure that tests can safely access oMockedData
            return pMockedDataLoaded;
        },
        beforeEach: function () {
            this.oSandbox = sinon.sandbox.create();
            return loadClass("sap/insights/CardHelper").then(function(CardHelper) {
                this.oCardHelper = CardHelper;
            }.bind(this));
        },
        afterEach: function () {
            this.oSandbox.restore();
            this.oCardHelper = null;
            window["sap-ushell-config"] = null;
        }
    });
    /**
     * Test cases to verify the scenarios in isSupported function
     */
    QUnit.test("Card Helper failure case for insight supported no ushell config", function(assert) {
        var DISABLED_ERR_MSG = "sap.insights is not enabled for this system.";
        return this.oCardHelper.getServiceAsync().then(function() {
        }).catch(function (error){
            assert.equal(error.message, DISABLED_ERR_MSG, DISABLED_ERR_MSG);
        });
    });
    QUnit.test("Card Helper failure case for insight supported no ushell config incorrect component name", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfigCompName;
        return this.oCardHelper.getServiceAsync().then(function() {
        }).catch(function (error){
            assert.equal(error.message, "sap.insights is not enabled for this system.", "sap.insights is not enabled for this system.");
        });
    });
    QUnit.test("Card Helper failure case for insight supported no ushell config no component name", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfigNoCompName;
        return this.oCardHelper.getServiceAsync().then(function() {
        }).catch(function (error){
            assert.equal(error.message, "sap.insights is not enabled for this system.", "sap.insights is not enabled for this system.");
        });
    });
    QUnit.test("Card Helper failure case for insight supported no ushell config no component name and disabled space", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfigNoCompNameSpace;
        return this.oCardHelper.getServiceAsync().then(function() {
        }).catch(function (error){
            assert.equal(error.message, "sap.insights is not enabled for this system.", "sap.insights is not enabled for this system.");
        });
    });
    QUnit.test("Card Helper failure case for insight supported no ushell config no component name and disabled apps", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfigNoCompNameApps;
        return this.oCardHelper.getServiceAsync().then(function() {
        }).catch(function (error){
            assert.equal(error.message, "sap.insights is not enabled for this system.", "sap.insights is not enabled for this system.");
        });
    });
    QUnit.test("Card Helper failure case for insight supported no ushell config no space", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfigNoSpace;
        return this.oCardHelper.getServiceAsync().then(function() {
        }).catch(function (error){
            assert.equal(error.message, "sap.insights is not enabled for this system.", "sap.insights is not enabled for this system.");
        });
    });
    QUnit.test("Card Helper failure case for insight supported no ushell config no apps ", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfigNoApp;
        return this.oCardHelper.getServiceAsync().then(function() {
        }).catch(function (error){
            assert.equal(error.message, "sap.insights is not enabled for this system.", "sap.insights is not enabled for this system.");
        });
    });
    QUnit.test("Card Helper failure case for insight supported no ushell config incorrect component name and disabled space", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfigCompNameSpace;
        return this.oCardHelper.getServiceAsync().then(function() {
        }).catch(function (error){
            assert.equal(error.message, "sap.insights is not enabled for this system.", "sap.insights is not enabled for this system.");
        });
    });
    QUnit.test("Card Helper failure case for insight supported no ushell config incorrect component name and disabled apps", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfigCompNameApps;
        return this.oCardHelper.getServiceAsync().then(function() {
        }).catch(function (error){
            assert.equal(error.message, "sap.insights is not enabled for this system.", "sap.insights is not enabled for this system.");
        });
    });
    QUnit.test("Card Helper failure case for insight supported no ushell config disabled spaces", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfigSpaces;
        return this.oCardHelper.getServiceAsync().then(function() {
        }).catch(function (error){
            assert.equal(error.message, "sap.insights is not enabled for this system.", "sap.insights is not enabled for this system.");
        });
    });
    QUnit.test("Card Helper failure case for insight supported no ushell config ", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfigSpacesApps;
        return this.oCardHelper.getServiceAsync().then(function() {
        }).catch(function (error){
            assert.equal(error.message, "sap.insights is not enabled for this system.", "sap.insights is not enabled for this system.");
        });
    });
    QUnit.test("Card Helper failure case for insight supported no ushell config disabled space disabled apps", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfigApps;
        return this.oCardHelper.getServiceAsync().then(function() {
        }).catch(function (error){
            assert.equal(error.message, "sap.insights is not enabled for this system.", "sap.insights is not enabled for this system.");
        });
    });
    QUnit.test("Card Helper case for insight supported fetch X-CSRF-Token success", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            assert.equal(typeof oCardHelperServiceInstance, "object", "CardHelper service instance created");
        });
    });
    /**
     * Test cases for validateCardManifest
     */
    QUnit.test("Card Helper case for validateCardManifest error no sap app", function(assert) {
        sinon.stub(HttpClient, 'post');
        HttpClient.post.returns(Promise.resolve(mockApiResponse()));
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            return oCardHelperServiceInstance._mergeCard(oMockedData.validateCardNoSapApp, "POST").then(function (response) {
            }).catch(function(error) {
                assert.equal(error.message, "Invalid card manifest");
                HttpClient.post.restore();
            });
        });
    });
    QUnit.test("Card Helper case for validateCardManifest error no sap app id", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            return oCardHelperServiceInstance._mergeCard(oMockedData.validateCardNoSapAppId, "POST").then(function (response) {
            }).catch(function(error) {
                assert.equal(error.message, "Invalid card manifest");
            });
        });
    });
    QUnit.test("Card Helper case for validateCardManifest error no sap app type", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            return oCardHelperServiceInstance._mergeCard(oMockedData.validateCardNoSapAppType, "POST").then(function (response) {
            }).catch(function(error) {
                assert.equal(error.message, "Invalid card manifest");
            });
        });
    });
    QUnit.test("Card Helper case for validateCardManifest error invalid sap app type", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            return oCardHelperServiceInstance._mergeCard(oMockedData.validateCardSapAppType, "POST").then(function (response) {
            }).catch(function(error) {
                assert.equal(error.message, "Invalid card manifest");
            });
        });
    });
    QUnit.test("Card Helper case for validateCardManifest error no sap.card", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            return oCardHelperServiceInstance._mergeCard(oMockedData.validateCardNoSapCard, "POST").then(function (response) {
            }).catch(function(error) {
                assert.equal(error.message, "Invalid card manifest");
            });
        });
    });
    QUnit.test("Card Helper case for validateCardManifest error invalid sap.card.type", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            return oCardHelperServiceInstance._mergeCard(oMockedData.validateCardSapInvalidCardType, "POST").then(function (response) {
            }).catch(function(error) {
                assert.equal(error.message, "Invalid card manifest", "Invalid card manifest");
            });
        });
    });
    QUnit.test("Card Helper case for validateCardManifest error no sap.card.type", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            return oCardHelperServiceInstance._mergeCard(oMockedData.validateCardSapNoCardType, "POST").then(function (response) {
            }).catch(function(error) {
                assert.equal(error.message, "Invalid card manifest", "Invalid card manifest");
            });
        });
    });
    QUnit.test("Card Helper case for validateCardManifest error no sap.insights", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        var aErrorMsg = [
            "Invalid card manifest",
            "oCardManifest['sap.insights'] is undefined",
            "Cannot read properties of undefined (reading 'versions')",
            "undefined is not an object (evaluating 'oCardManifest[\"sap.insights\"].versions')"
        ];
        return this.oCardHelper.getServiceAsync().then(function (oCardHelperServiceInstance) {
            return oCardHelperServiceInstance._mergeCard(oMockedData.validateCardNoSapInsights, "POST").then(function (response) {
            }).catch(function (error) {
                assert.ok(aErrorMsg.includes(error.message), "Invalid card manifest");
            });
        });
    });
    QUnit.test("Card Helper case for validateCardManifest error ino sap.insights.parentAppId", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            return oCardHelperServiceInstance._mergeCard(oMockedData.validateCardNoSapInsightsParentAppId, "POST").then(function (response) {
            }).catch(function(error) {
                assert.equal(error.message, "Invalid card manifest", "Invalid card manifest");
            });
        });
    });
    QUnit.test("Card Helper case for validateCardManifest error no sap.insights.cardType", function(assert) {
        sinon.stub(HttpClient, 'post');
        HttpClient.post.returns(Promise.resolve(mockApiResponse()));
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            return oCardHelperServiceInstance._mergeCard(oMockedData.validateCardNoSapInsightsCardType, "POST").then(function (response) {
            }).catch(function(error) {
                assert.equal(error.message, "Invalid card manifest", "Invalid card manifest");
                HttpClient.post.restore();
            });
        });
    });
    QUnit.test("Card Helper case for validateCardManifest error sap.insights.cardType", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            return oCardHelperServiceInstance._mergeCard(oMockedData.validateCardSapInsightCardType, "POST").then(function (response) {
            }).catch(function(error) {
                assert.equal(error.message, "Invalid card manifest", "Invalid card manifest");
            });
        });
    });
    QUnit.test("Card Helper case for validateCardManifest error no sap.insights.versions", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            return oCardHelperServiceInstance._mergeCard(oMockedData.validateCardSapInsightNoVersion, "POST").then(function (response) {
            }).catch(function(error) {
                assert.equal(error.message, "Invalid card manifest", "Invalid card manifest");
            });
        });
    });
    QUnit.test("Card Helper case for validateCardManifest error no sap.insights.versions", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            return oCardHelperServiceInstance._mergeCard(oMockedData.validateCardSapInsightNoVersionui5, "POST").then(function (response) {
            }).catch(function(error) {
                assert.equal(error.message, "Invalid card manifest", "Invalid card manifest");
            });
        });
    });
    QUnit.test("Card Helper case for validateCardManifest error no sap.insights.cardType", function(assert) {
        sinon.stub(HttpClient, 'post');
        HttpClient.post.returns(Promise.resolve(mockApiResponseError()));
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        var aErrorMsg = [
            "Unexpected end of input",
            "unexpected error",
            "The string did not match the expected pattern."
        ];
        return this.oCardHelper.getServiceAsync().then(function (oCardHelperServiceInstance) {
            return oCardHelperServiceInstance._mergeCard(oMockedData.validateCardSapCardType, "POST").then(function (response) {
            }).catch(function (error) {
                assert.ok(aErrorMsg.includes(error.message), "Invalid card manifest");
                HttpClient.post.restore();
            });
        });
    });
    QUnit.test("Card Helper case for validateCardManifest error no sap.insights.cardType", function(assert) {
        sinon.stub(HttpClient, 'post');
        HttpClient.post.returns(Promise.resolve(mockApiResponseError()));
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        var aErrorMsg = [
            "Unexpected end of input",
            "unexpected error",
            "The string did not match the expected pattern."
        ];
        return this.oCardHelper.getServiceAsync().then(function (oCardHelperServiceInstance) {
            return oCardHelperServiceInstance._mergeCard(oMockedData.validateCardSapCardType, "PUT").then(function (response) {
            }).catch(function (error) {
                assert.ok(aErrorMsg.includes(error.message), "Invalid card manifest");
                HttpClient.post.restore();
            });
        });
    });
    QUnit.test("Card Helper case for validateCardManifest error no sap.insights.cardType", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            return oCardHelperServiceInstance._mergeCard(oMockedData.validateCardSapCardType, "GET").then(function (response) {
            }).catch(function(error) {
                assert.equal(error.message, "Method not supported.", "Method not supported.");
            });
        });
    });
    /**
     * Test cases for _mergeCard
     */
     QUnit.test("Card Helper case for _mergeCard invalid method get", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            return oCardHelperServiceInstance._mergeCard(oMockedData.validateCard, "GET").then(function (response) {
            }).catch(function(error) {
                assert.equal(error.message, "Method not supported.", "Get method is not supported.");
            });
        });
    });
    QUnit.test("Card Helper case for _mergeCard fetch failure", function(assert) {
        const stubedFetch = sinon.stub(HttpClient, 'post');
        stubedFetch.onFirstCall().returns(Promise.resolve(mockApiResponse()));
        stubedFetch.onSecondCall().returns(Promise.resolve(mockApiResponse()));
        window["sap-ushell-config"] = oMockedData.oUShellConfig;

        var aErrorMsg = [
            "Unexpected end of input",
            "unexpected error",
            "The string did not match the expected pattern."
        ];
        return this.oCardHelper.getServiceAsync().then(function (oCardHelperServiceInstance) {
            stubedFetch.onThirdCall().returns(Promise.resolve(mockApiResponseError({ error: { message: "Unable to fetch data." } })));
            return oCardHelperServiceInstance._mergeCard(oMockedData.validateCard, "POST").then(function (response) {
            }).catch(function (error) {
                assert.ok(aErrorMsg.includes(error.message), "Invalid card manifest");
                stubedFetch.restore();
            });
        });
    });
    /**
     * Test cases for _readCard
     */
    QUnit.test("Card Helper case for _readCard error for api response failure", function(assert) {
        const stubedFetch = sinon.stub(HttpClient, 'get');
        stubedFetch.returns(Promise.resolve(mockApiResponse()));
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            return oCardHelperServiceInstance._readCard("/sap/opu/odata4/ui2/insights_srv/srvd/ui2/insights_cards_read_srv/0001/INSIGHTS_CARDS?$orderby=rank").then(function (response) {
            }).catch(function(error) {
                assert.equal(error.message, "Cannot read user's suggested cards.", "Invalid card manifest");
                stubedFetch.restore();
            });
        });
    });
    QUnit.test("Card Helper case for _readCard error for api content has no values", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            sinon.stub(HttpClient, 'get');
            HttpClient.get.returns(Promise.resolve(oMockedData.readCardRespNoValue));
            return oCardHelperServiceInstance._readCard("/sap/opu/odata4/ui2/insights_srv/srvd/ui2/insights_cards_read_srv/0001/INSIGHTS_CARDS?$orderby=rank").then(function (response) {
                assert.strictEqual(response.length, 0, "Length of values array is 0");
                HttpClient.get.restore();
            });
        });
    });
    QUnit.test("Card Helper case for _readCard error for api content has no values", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            sinon.stub(HttpClient, 'get');
            HttpClient.get.returns(Promise.resolve(oMockedData.readCardNoDescriptorContent));
            return oCardHelperServiceInstance._readCard("/sap/opu/odata4/ui2/insights_srv/srvd/ui2/insights_cards_read_srv/0001/INSIGHTS_CARDS?$orderby=rank").then(function (response) {
                assert.strictEqual(response.length, 2, "Length of values array is 2");
                assert.strictEqual(response[0].descriptorContent, "", "No JSON parsing done in case of empty values");
                HttpClient.get.restore();
            });
        });
    });
    QUnit.test("Card Helper case for _readCard error for api content has no values with invalid descriptorContent", function(assert) {
        const stubedFetch = sinon.stub(HttpClient, 'get');
        stubedFetch.returns(Promise.resolve(mockApiResponse()));
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function (oCardHelperServiceInstance) {
            var aErrorMsg = [
                "Cannot read user's suggested cards.",
                "JSON.parse: unexpected character at line 1 column 1 of the JSON data",
                "JSON Parse error: Unexpected identifier \"somerandom\""
            ];
            return oCardHelperServiceInstance._readCard("/sap/opu/odata4/ui2/insights_srv/srvd/ui2/insights_cards_read_srv/0001/INSIGHTS_CARDS?$orderby=rank").then(function () {
            }).catch(function (error) {
                assert.ok(aErrorMsg.includes(error.message), "Invalid card manifest");
                stubedFetch.restore();
            });
        });
    });
    // QUnit.test("Card Helper case for _readCard success", function(assert) {
    //     window["sap-ushell-config"] = oMockedData.oUShellConfig;
    //     sinon.stub(HttpClient, 'get');
    //     HttpClient.get.returns(Promise.resolve(oMockedData.readCard));
    //     return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
    //         return oCardHelperServiceInstance._readCard("/sap/opu/odata4/ui2/insights_srv/srvd/ui2/insights_cards_read_srv/0001/INSIGHTS_CARDS?$orderby=rank").then(function (response) {
    //             assert.strictEqual(response.length, 2, "Received array of length 2");
    //             assert.strictEqual(response[0].descriptorContent["sap.app"].id, "F2601.user.cards.card01_CustomerReturns.1656946931683","Received correct id");
    //             HttpClient.get.restore();
    //         });
    //     });
    // });
    /**
     * Test case for createCard card
     */
    QUnit.test("CardHelper case for createCard", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            var stubMerge = sinon.stub(oCardHelperServiceInstance, "_mergeCard");
            stubMerge.returns();
            oCardHelperServiceInstance._createCard();
            assert.ok(stubMerge.called, "merge method is called");
            stubMerge.restore();
        });
    });

    /**
     * Test case for _createCards
     */
    QUnit.test("Card Helper case for _createCards with valid card manifest", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;

        var aCardManifest = oMockedData.validCard;
        var aValidCardManifest = [oMockedData.validCard];
        var aCards = [{ id: "user.F2601.cards.card01_CustomerReturns.1656946931683", descriptorContent: oMockedData.validCard }];
        var oResponse = { success: true };

        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            sinon.stub(oCardHelperServiceInstance, "_getValidCardManifests").returns(aValidCardManifest);
            sinon.stub(oCardHelperServiceInstance, "_updateMultipleCards").returns(Promise.resolve(oResponse));
            sinon.stub(oCardHelperServiceInstance, "_getCards").returns(aCards);
            return oCardHelperServiceInstance._createCards(aCardManifest).then(function(response) {
                assert.ok(oCardHelperServiceInstance._getValidCardManifests.calledWith(aCardManifest), "_getValidCardManifests called with correct arguments");
                assert.ok(oCardHelperServiceInstance._updateMultipleCards.calledWith(aCards, "POST"), "_updateMultipleCards called with correct arguments");
                assert.deepEqual(response, oResponse, "Response is correct");
                oCardHelperServiceInstance._getValidCardManifests.restore();
                oCardHelperServiceInstance._updateMultipleCards.restore();
                oCardHelperServiceInstance._getCards.restore();
            });
        });
    });

    /**
     * Test case for _getValidCardManifests
     */
    QUnit.test("Card Helper case for _getValidCardManifests", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        var aCardManifest = [oMockedData.validCard, oMockedData.validateCardSapInvalidCardType];
        var aExpectedValidCardManifests = [ oMockedData.validCard ];

        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            var aValidCardManifests = oCardHelperServiceInstance._getValidCardManifests(aCardManifest);
            assert.strictEqual(aValidCardManifests.length, 1, "Return only the valid manifest");
            assert.deepEqual(aValidCardManifests, aExpectedValidCardManifests, "Valid card manifests are filtered correctly");
        });
    });

    /**
     * Test case for _getCards
     */
    QUnit.test("Card Helper case for _getCards", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        var aCardManifest = [oMockedData.validCard];

        var aExpectedCards = [
            {
                id: "user.F2601.cards.card01_CustomerReturns.1656946931683",
                descriptorContent: JSON.stringify(oMockedData.validCard)
            }
        ];

        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            var aCards = oCardHelperServiceInstance._getCards(aCardManifest);
            assert.deepEqual(aCards, aExpectedCards, "Cards are generated correctly from the card manifest");
        });
    });

    /**
     * Test case for _updateCards
     */
    QUnit.test("Card Helper - _updateCards Success scenario with valid card manifests", function(assert) {
        var done = assert.async();
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        var aUpdatedCards = [oMockedData.validCard, oMockedData.validateCardSapInvalidCardType];

        var aValidCardManifest = [oMockedData.validCard];
        var aExpectedCards = [
            {
                id: "user.F2601.cards.card01_CustomerReturns.1656946931683",
                descriptorContent: JSON.stringify(oMockedData.validCard)
            }
        ];

        var oResponse = { success: true };

        this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            sinon.stub(oCardHelperServiceInstance, "_getValidCardManifests").returns(aValidCardManifest);
            sinon.stub(oCardHelperServiceInstance, "_updateMultipleCards").returns(Promise.resolve(oResponse));
            sinon.stub(oCardHelperServiceInstance.userVisibleCardModel, "setProperty");

            oCardHelperServiceInstance._updateCards(aUpdatedCards).then(function(result) {
                assert.deepEqual(result, oResponse, "The response is correct");
                assert.ok(oCardHelperServiceInstance._getValidCardManifests.called, "_getValidCardManifests was called");
                assert.ok(oCardHelperServiceInstance._updateMultipleCards.calledWith(aExpectedCards, "PUT"), "_updateMultipleCards was called with correct arguments");
                assert.ok(oCardHelperServiceInstance.userVisibleCardModel.setProperty.calledWith("/isLoading", true), "Loading state set to true");
                assert.ok(oCardHelperServiceInstance.userVisibleCardModel.setProperty.calledWith("/isLoading", false), "Loading state set to false");
                done();
            }).catch(function() {
                assert.ok(false, "Promise was rejected");
                done();
            }).finally(function(){
                oCardHelperServiceInstance._getValidCardManifests.restore();
                oCardHelperServiceInstance._updateMultipleCards.restore();
                oCardHelperServiceInstance.userVisibleCardModel.setProperty.restore();
            });

        });
    });

    QUnit.test("Card Helper - _updateCards Error scenario with update failure", function(assert) {
        var done = assert.async();
        window["sap-ushell-config"] = oMockedData.oUShellConfig;

        var aUpdatedCards = [oMockedData.validCard, oMockedData.validateCardSapInvalidCardType];

        var aValidCardManifest = [oMockedData.validCard];
        var aExpectedCards = [
            {
                id: "user.F2601.cards.card01_CustomerReturns.1656946931683",
                descriptorContent: JSON.stringify(oMockedData.validCard)
            }
        ];

        var oError = new Error("Update failed");

        this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            sinon.stub(oCardHelperServiceInstance, "_getValidCardManifests").returns(aValidCardManifest);
            sinon.stub(oCardHelperServiceInstance, "_getCards").returns(aExpectedCards);
            sinon.stub(oCardHelperServiceInstance, "_updateMultipleCards").returns(Promise.reject(oError));
            sinon.stub(oCardHelperServiceInstance.userVisibleCardModel, "setProperty");

            oCardHelperServiceInstance._updateCards(aUpdatedCards).then(function(result) {
                assert.ok(false, "Promise was resolved");
                done();
            }).catch(function(error) {
                assert.deepEqual(error, oError, "The error is correct");
                assert.ok(oCardHelperServiceInstance._getValidCardManifests.called, "_getValidCardManifests was called");
                assert.ok(oCardHelperServiceInstance._getCards.called, "_getCards was called");
                assert.ok(oCardHelperServiceInstance._updateMultipleCards.called, "_updateMultipleCards was called once");
                assert.ok(oCardHelperServiceInstance.userVisibleCardModel.setProperty.calledWith("/isLoading", true), "Loading state set to true");
                assert.ok(oCardHelperServiceInstance.userVisibleCardModel.setProperty.calledWith("/isLoading", false), "Loading state set to false");
                done();
            }).finally(function(){
                oCardHelperServiceInstance._getValidCardManifests.restore();
                oCardHelperServiceInstance._getCards.restore();
                oCardHelperServiceInstance._updateMultipleCards.restore();
                oCardHelperServiceInstance.userVisibleCardModel.setProperty.restore();
            });
        });
    });
    QUnit.test("processSemanticDate", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            var stubSemanticDateProcess = sinon.stub(UrlGenerateHelper, "semanticDateProcess");
            stubSemanticDateProcess.returns();
            oCardHelperServiceInstance.processSemanticDate({},{});
            assert.ok(stubSemanticDateProcess.called, "semanticDateProcess method is called");
            stubSemanticDateProcess.restore();
        });
    });

    QUnit.test("handleDndCardsRanking", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            var stubCardDnd = sinon.stub(CardDndConfig, "updateCardsRanking");
            stubCardDnd.returns();
            oCardHelperServiceInstance.handleDndCardsRanking(0,1,[{id:"test"}, {id:"test1"}]);
            assert.ok(stubCardDnd.called, "cards dnd method is called");
            stubCardDnd.restore();
        });
    });
    /**
     * Test cases for deleteCard
     */
    QUnit.test("Card Helper case for deleteCard success", function(assert) {
        var sValidCardId = "user.F2601.cards.card01_CustomerReturns.1656946931683";
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            var getUserCardStub = sinon.stub(oCardHelperServiceInstance, '_getUserAllCards');
            getUserCardStub.returns(Promise.resolve(oMockedData.userCardModel.cards));
            return oCardHelperServiceInstance._getUserAllCardModel().then(function() {
                sinon.stub(HttpClient, 'delete');
                HttpClient.delete.returns(Promise.resolve(sValidCardId));
                return oCardHelperServiceInstance._deleteCard(sValidCardId).then(function (response) {
                    assert.strictEqual(response, sValidCardId, "Received valid card id after delete");
                    getUserCardStub.restore();
                });
            });
        });
    });
    // QUnit.test("Card Helper case for deleteCard failure", function(assert) {
    //     var sValidCardId = "user.F2601.cards.card01_Custom_1656913";
    //     window["sap-ushell-config"] = oMockedData.oUShellConfig;
    //     return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
    //         var getUserCardStub = sinon.stub(oCardHelperServiceInstance, '_getUserAllCards');
    //         getUserCardStub.returns(Promise.resolve(oMockedData.readCard.value));
    //         return oCardHelperServiceInstance._getUserAllCardModel().then(function() {
    //             return oCardHelperServiceInstance._deleteCard(sValidCardId).then(function (response) {
    //             }).catch(function(error) {
    //                 assert.equal(error.message, "Failed to delete card", "Unable to delete cards");
    //                 getUserCardStub.restore();
    //             });
    //         });
    //     });
    // });
    QUnit.test("Card Helper case for deleteCard invalid cardid", function(assert) {
        var sValidCardId = "F2601.user.cards.card01_CustomerReturns.1656946931683";
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            var getUserCardStub = sinon.stub(oCardHelperServiceInstance, '_getUserAllCards');
            getUserCardStub.returns(Promise.resolve(oMockedData.readCard.value));
            return oCardHelperServiceInstance._getUserAllCardModel().then(function() {
                return oCardHelperServiceInstance._deleteCard(sValidCardId).then(function () {
                }).catch(function(error) {
                    assert.equal(error.message, "sap.app.id value should start with user.<id>.", "Unable to delete cards with invalid card id");
                    getUserCardStub.restore();
                });
            });
        });
    });
    /**
     * Test cases for _getUserVisibleCardModel
     */
     QUnit.test("Card Helper case for _getUserVisibleCardModel success", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            var getSuggestedCardsStub = sinon.stub(oCardHelperServiceInstance, '_getUserVisibleCards');
            getSuggestedCardsStub.returns(Promise.resolve(oMockedData.readCard.value));
            return oCardHelperServiceInstance._getUserVisibleCardModel().then(function(cardResp) {
                assert.equal(cardResp.getProperty("/cards").length, 2, "Received card response having two objects in array");
                getSuggestedCardsStub.restore();
            });
        });
    });
    /**
     * Test cases for _getUserVisibleCards
     */
    QUnit.test("Card Helper case for _getUserVisibleCards success", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            sinon.stub(HttpClient, 'get');
            HttpClient.get.returns(Promise.resolve(oMockedData.readCard));
            return oCardHelperServiceInstance._getUserVisibleCards().then(function(cardResp) {
                assert.equal(cardResp.length, 2, "Received card response having two objects in array");
                HttpClient.get.restore();
            });
        });
    });
    QUnit.test("Card Helper case for _getUserVisibleCards with preferred cards", function(assert) {
        var done = assert.async();
        window["sap-ushell-config"] = oMockedData.oUShellConfig;

        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            oCardHelperServiceInstance.localCardCache = {};
            var aPreferedCards = ["card1", "card2"];
            var expectedUrl = AppConstants.CARD_READ_URL + "?$filter=visibility eq true and (id eq 'card1' or id eq 'card2')" + AppConstants.CARD_SELECT_QUERY;

            // Stub HttpClient.get
            sinon.stub(HttpClient, 'get').returns(Promise.resolve(oMockedData.preferredCard));

            // Call the method with preferred cards
            return oCardHelperServiceInstance._getUserVisibleCards(aPreferedCards).then(function(cardResp) {
                // Assertions
                assert.equal(cardResp.length, 2, "Received card response having two objects in array");
                assert.ok(HttpClient.get.calledOnce, "HttpClient.get should be called once");
                assert.ok(HttpClient.get.calledWith(expectedUrl), "HttpClient.get should be called with the correct URL");

                // Restore the stub
                HttpClient.get.restore();
                done();
            });
        });
    });
    QUnit.test("CardHelper case for _getUserAllCardModel success", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            var getUserCardsStub = sinon.stub(oCardHelperServiceInstance, '_getUserAllCards');
            getUserCardsStub.returns(Promise.resolve(oMockedData.readCard.value));
            return oCardHelperServiceInstance._getUserAllCardModel().then(function(cardResp) {
                assert.equal(cardResp.getProperty("/cards").length, 2, "Received card response having two objects in array");
                getUserCardsStub.restore();
                sinon.restore();
            });
        });
    });
    /**
     * Test cases for getUserCard
     */
    QUnit.test("Card Helper case for _getUserAllCards success", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            const readCardstub = sinon.stub(oCardHelperServiceInstance, '_readCard');
            readCardstub.returns(Promise.resolve(oMockedData.readCard.value));
            sinon.stub(HttpClient, 'get');
            HttpClient.get.returns(Promise.resolve(oMockedData.readCard));
            return oCardHelperServiceInstance._getUserAllCards("/sap/opu/odata4/ui2/insights_srv/srvd/ui2/insights_cards_read_srv/0001/INSIGHTS_CARDS").then(function(cardResp) {
                assert.equal(cardResp.length, 2, "Received card response having two objects in array");
                HttpClient.get.restore();
            });
        });
    });
    // QUnit.test("_getUserAllCards should call _readCard only when there is change in cards data with update", function(assert) {
    //     window["sap-ushell-config"] = oMockedData.oUShellConfig;
    //     return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
    //         oCardHelperServiceInstance.localCardCache = {};
    //         let readCardstub = sinon.stub(oCardHelperServiceInstance, '_readCard');
    //         readCardstub.returns(Promise.resolve(oMockedData.readCard.value));
    //         return oCardHelperServiceInstance._getUserAllCards().then(function () {
    //             assert.ok(readCardstub.called, "'_readCard' method on CardHelperService called");
    //             readCardstub.restore();
    //             readCardstub = sinon.stub(oCardHelperServiceInstance, '_readCard');
    //             return oCardHelperServiceInstance._getUserAllCards().then(function () {
    //                 assert.ok(readCardstub.notCalled, "'_readCard' method on CardHelperService should not be called");
    //                 readCardstub.restore();
    //             });
    //         });
    //     });
    // });
    // QUnit.test("_getUserVisibleCards should call _readCard only when there is change in cards data with update", function(assert) {
    //     window["sap-ushell-config"] = oMockedData.oUShellConfig;
    //     return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
    //         var readCardstub = sinon.stub(oCardHelperServiceInstance, '_readCard');
    //         readCardstub.returns(Promise.resolve(oMockedData.readCard.value));
    //         oCardHelperServiceInstance.localCardCache = {};
    //         return oCardHelperServiceInstance._getUserVisibleCards("/sap/opu/odata4/ui2/insights_srv/srvd/ui2/insights_cards_read_srv/0001/INSIGHTS_CARDS").then(function () {
    //             assert.ok(readCardstub.called, "'_readCard' method on CardHelperService called");
    //             readCardstub.restore();
    //             readCardstub = sinon.spy(oCardHelperServiceInstance, '_readCard');
    //             return oCardHelperServiceInstance._getUserVisibleCards("").then(function () {
    //                 assert.ok(readCardstub.notCalled, "'_readCard' method on CardHelperService should not be called");
    //                 readCardstub.restore();
    //             });
    //         });
    //     });
    // });
    /**
     * CardUIHelper test cases
     */
    QUnit.test("getServiceAsync", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(cardUIHelperInstance) {
            assert.equal(typeof cardUIHelperInstance, 'object', "cardUIHelperInstance is created");
        });
    });
    QUnit.test("getServiceAsync cache handling", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync().then(function(cardUIHelperInstance) {
            assert.equal(typeof cardUIHelperInstance, 'object', "cardUIHelperInstance is created");
        });
    });
    QUnit.test("showCardPreview", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;
        return this.oCardHelper.getServiceAsync("UIService").then(function(cardUIHelperInstance) {
            return cardUIHelperInstance.showCardPreview(oMockedData.validateCard, true, {}, "confirm", {}, 'testTitle').then(function() {
                assert.equal(JSON.stringify(cardUIHelperInstance._oManagePreviewDialog.oManifest), JSON.stringify(oMockedData.validateCard),"_oManagePreviewDialog instance");
            });
        });
    });
    QUnit.test("getParentAppDetails", function(assert) {
        window["sap-ushell-config"] = oMockedData.oUShellConfig;

        return this.oCardHelper.getServiceAsync().then(function(oCardHelperServiceInstance) {
            var stubGetParent = sinon.stub(oCardHelperServiceInstance, "_getParentApp");
            stubGetParent.returns();
            oCardHelperServiceInstance.getParentAppDetails({descriptorContent:oMockedData.cardManifest});
            assert.ok(stubGetParent.called, "_getParentApp method is called");
            stubGetParent.restore();
        });
    });
});