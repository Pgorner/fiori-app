/**
 * tests for the sap.suite.ui.generic.template.ListReport.controller.LegacyStateHandler.js
 */
sap.ui.define([ "testUtils/sinonEnhanced", "sap/suite/ui/generic/template/genericUtilities/testableHelper", "sap/suite/ui/generic/template/ListReport/controller/LegacyStateHandler", "sap/base/util/deepExtend",
	"sap/base/util/extend", "sap/base/util/Version"], function(sinon, testableHelper, LegacyStateHandler, deepExtend, extend, Version){
	"use strict";

	var oSandbox;
	var oStubForPrivate;
	var oLegacyStateHandler;
	var oController = Object.create(null);

	
	// The following 2-dimensional map contains different states that could possibly be created in specific releases
	// - First key is a name, typically indicating some information stored in iAppState for which in some release the way to be stored was changed.
	// 	A special name is "empty": This is the minimal state that could be created in the corresponding release, or in other ways, the state an empty object would have been 
	//		mapped to in that release (implicitly before the introduction of legacyStateHandler)
	//		To increase readability, all states with other names are reduced to the information relevant to the given information. For testing, these states are enhanced with all
	//		additional information - do be able to do that, the "empty" state is used.
	// - Second key is the version this state could be created with. The first version typically is not the first possible version, but rather the last one before the (first)
	//		change to the way the corresponding information is stored occurred. (Figuring out the real first version in many cases would be quite high effort.) Since 1.90.0, the
	//		creation version is stored in the state; in some (older) cases the first possible creation version is mentioned as comment in a similar way. 
	//		Only versions with a change in the way the relevant information is stored are explicitly provided here. 
	// - Value (i.e. from 3rd level) is an iAppState (JSON object) 
	
	var mState = {
			empty: {
				"1.34.0": {},
				"1.36.0": {
					customData: {
						"sap.suite.ui.generic.template.customData": {},
						"sap.suite.ui.generic.template.genericData": {}
					}
				},
				"1.44.7": {
					customData: {
						"sap.suite.ui.generic.template.customData": {},
						"sap.suite.ui.generic.template.genericData": {
							visibleCustomFields: []
						}
					}
				},
				"1.60.1": {
					customData: {
						"sap.suite.ui.generic.template.customData": {},
						"sap.suite.ui.generic.template.genericData": {
							activeStateFilter: false,
							visibleCustomFields: []
						}
					}
				},
				"1.86.0": {
					customData: {
						"sap.suite.ui.generic.template.customData": {},
						"sap.suite.ui.generic.template.genericData": {
							activeStateFilter: false,
							variantDirty: true,
							visibleCustomFields: []
						}
					}
				},
				"1.90.0": {
					version: "1.90.0",
					controlStates: {},
					customData: {
						"sap.suite.ui.generic.template.customData": {},
						"sap.suite.ui.generic.template.genericData": {
							visibleCustomFields: [],
							activeStateFilter: false,
							variantDirty: true
						}
					}
				},
				"1.94.0": {
					version: "1.94.0",
					controlStates: {
						"template::PageVariant": {
							modified: true,
							variantId: ""
						}
					},
					customData: {
						"sap.suite.ui.generic.template.customData": {},
						"sap.suite.ui.generic.template.genericData": {
							visibleCustomFields: [],
							activeStateFilter: false
						}
					}
				},
				"1.99.0": {
					version: "1.99.0",
					customData: {
						"sap.suite.ui.generic.template.customData": {},
						"sap.suite.ui.generic.template.genericData": {
							visibleCustomFields: [],
							activeStateFilter: false
						}
					},
					controlStates: {
						"template::PageVariant": {
							managedControlStates: {},
							modified: true,
							variantId: "",
						}
					}
				},
				"1.100.0": {
					version: "1.100.0",
					customData: {
						"sap.suite.ui.generic.template.customData": {},
						"sap.suite.ui.generic.template.genericData": {
							visibleCustomFields: [],
							activeStateFilter: false
						}
					},
					controlStates: {
						"template::PageVariant": {
							managedControlStates: {
								listReportFilter: {
									addedFilterItems: [],
									removedFilterItems: []
								}
							},
							modified: true,
							variantId: ""
						}
					}
				},
				"1.102.0": {
					version: "1.102.0",
					customData: {
						"sap.suite.ui.generic.template.customData": {},
						"sap.suite.ui.generic.template.genericData": {
							visibleCustomFields: []
						}
					},
					controlStates: {
						"template::PageVariant": {
							modified: true,
							variantId: "",
							managedControlStates: {
								listReportFilter: {
									addedFilterItems: [],
									removedFilterItems: []
								}
							}
						}
					}
				},
				"1.103.0": {
					version: "1.103.0",
					controlStates: {
						"template::PageVariant": {
							modified: true,
							variantId: "",
							managedControlStates: {
								listReportFilter: {
									addedFilterItems: [],
									removedFilterItems: [],
									customFilters: {
										appExtension: {}
									} 
								}
							}
						}
					}
				},
				"1.105.0": {
					version: "1.103.0",
					controlStates: {
						"$dataLoaded": true,
						"template::PageVariant": {
							modified: true,
							variantId: "",
							managedControlStates: {
								listReportFilter: {
									addedFilterItems: [],
									removedFilterItems: [],
									customFilters: {
										appExtension: {}
									} 
								}
							}
						}
					}
				}
			},
			editState: {
				"1.34.0": {
					customData: {
						_editStateFilter: "edit state"
					}
				},
				"1.36.0": {
					customData: {
						"sap.suite.ui.generic.template.genericData": {
							editStateFilter: "edit state"
						}
					}
				},
				"1.103.0": {
					controlStates: {
						"template::PageVariant": {
							managedControlStates: {
								listReportFilter: {
									customFilters: {
										editState: "edit state" 
									}
								}
							}
						}
					}
				}
			},
			appExtension: {
				"1.34.0": {
					customData: {
						someCustomFilter: "custom filter value"
					}
				},
				"1.36.0": {
					customData: {
						"sap.suite.ui.generic.template.customData": {
							someCustomFilter: "custom filter value"
						}
					}
				},
				"1.103.0": {
					controlStates: {
						"template::PageVariant": {
							managedControlStates: {
								listReportFilter: {
									customFilters: {
										appExtension: {
											someCustomFilter: "custom filter value"
										} 
									}
								}
							}
						}
					}
				}
			},
			dataLoaded: {	// rather "no data loaded", as the default behavior (if no information in appState found) is to load data
				"1.44.7": {
					customData: {
						"sap.suite.ui.generic.template.genericData": {
							suppressDataSelection: true
						}
					}
				},
				"1.105.0": {
					controlStates: {
						"$dataLoaded": false
					}
				}
			},
			activeStateFilterSingleTab: {
				"1.97.0": {
					customData: {
						"sap.suite.ui.generic.template.genericData": {
							editStateFilter: "0",
							activeStateFilter: true
						}
					}
				},
				"1.98.0": {
					version: "1.98.0",
					customData: {
						"sap.suite.ui.generic.template.genericData": {
							editStateFilter: "5",
							activeStateFilter: true
						}
					}
				},
				"1.102.0": {
					version: "1.102.0",
					customData: {
						"sap.suite.ui.generic.template.genericData": {
							editStateFilter: "5"
						}
					}
				},
				"1.103.0": {
					version: "1.103.0",
					controlStates: {
						"template::PageVariant": {
							managedControlStates: {
								listReportFilter: {
									customFilters: {
										editState: "5" 
									}
								}
							}
						}
					}
				}
			},
			activeStateFilterMultiTab: {
				"1.97.0": {
//					version: "1.74.0",
					customData: {
						"sap.suite.ui.generic.template.genericData": {
							tableTabData: {
								selectedTab: "tabkey",
								mEditButtonState: "mEditButtonState"
							},
							editStateFilter: "0",
							activeStateFilter: true
						}
					}
				},
				"1.98.0": {
					version: "1.98.0",
					customData: {
						"sap.suite.ui.generic.template.genericData": {
							tableTabData: {
								selectedTab: "tabkey",
								mEditButtonState: "mEditButtonState"
							},
							editStateFilter: "5",
							activeStateFilter: true
						}
					}
				},
				"1.102.0": {
					version: "1.102.0",
					customData: {
						"sap.suite.ui.generic.template.genericData": {
							tableTabData: {
								selectedTab: "tabkey"
							},
							editStateFilter: "5"
						}
					}
				},
				"1.103.0": {
					version: "1.103.0",
					controlStates: {
						"template::PageVariant": {
							managedControlStates: {
								listReportFilter: {
									customFilters: {
										editState: "5" 
									}
								}
							}
						}
					},
					customData: {
						"sap.suite.ui.generic.template.genericData": {
							tableTabData: {
								selectedTab: "tabkey"
							}
						}
					}
				}
			},
			variantClean: {
				"1.93.0": {
//					version: "1.86.0",
					customData: {
						"sap.suite.ui.generic.template.genericData": {
							variantDirty: false,
						}
					}
				},
				"1.94.0": {
					version: "1.94.0",
					controlStates: {
						"template::PageVariant": {
							modified: false
						}
					}
				},
				"1.99.0": {
					version: "1.99.0",
					controlStates: {
						"template::PageVariant": {
							modified: false
						}
					}
				}
			},
			tableVariantId: {
				"1.89.0": {
					tableVariantId: "table variant"
				},
				"1.90.0": {
					version: "1.90.0",
					controlStates: {
						"ViewId--listReport": {
							sVariantId: "table variant"
						}
					}
				},
				"1.94.0": {
					version: "1.94.0",
					controlStates: {
						"listReport": {
							sVariantId: "table variant"
						}
					}
				},
				"1.99.0": {
					version: "1.99.0",
					controlStates: {
						"template::PageVariant": {
							managedControlStates: {
								"listReport": {
									sVariantId: "table variant"
								}
							}
						},
						"listReport": {
							sVariantId: "table variant"
						}
					}
				}
			},
			worklistSingleTab: {
				"1.94.0": {
					customData: {
						"sap.suite.ui.generic.template.genericData": {
							Worklist: {
								searchString: "searchString"
							}
						} 
					}
				},
				"1.95.0": {
					version: "1.95.0",
					controlStates: {
						"Table::Toolbar::SearchField": {
							searchString: "searchString"
						}
					}
				}
			},
			worklistMultiTab: {
				"1.94.0": {
					customData: {
						"sap.suite.ui.generic.template.genericData": {
							tableTabData: {
								selectedTab: "tabkey",
							},
							Worklist: {
								searchString: "searchString"
							}
						} 
					}
				},
				"1.95.0": {
					version: "1.95.0",
					customData: {
						"sap.suite.ui.generic.template.genericData": {
							tableTabData: {
								selectedTab: "tabkey",
								controlStates: {
									"Table::Toolbar::SearchField-tabkey": {
										searchString: "searchString"
									}
								}
							}
						}
					}
				}
			},
			semanticDates: {
				"1.99.0": {
//					version: "1.84.0",
					selectionVariant: JSON.stringify({
						SelectionVariantID: "selection variant id",
						SelectOptions: [],
						Parameters: []
					}),
					semanticDates: "semantic dates"
				},
				"1.100.0": {
					version: "1.100.0",
					controlStates: {
						"template::PageVariant": {
							managedControlStates: {
								listReportFilter: {
									selectOptions: [],
									parameters: [],
									semanticDates: "semantic dates",
									removedFilterItems: []
								}
							}
						}
					}
				} 
			},
			adaptationExtension: {
				"1.102.0": {
//					version: "1.58.0",
					customData: {
						"sap.suite.ui.generic.template.extensionData": {
							adaptationExtensionId: "adaptation extension state value"
						}
					}
				},
				"1.103.0": {
					controlStates: {
						"template::PageVariant": {
							managedControlStates: {
								listReportFilter: {
									customFilters: {
										adaptationExtensions: {
											adaptationExtensionId: "adaptation extension state value"
										} 
									}
								}
							}
						}
					}
				}
			}
	};


	function getSortedVersions(mVersionToState){
		return Object.keys(mVersionToState).sort(function(sVersion1, sVersion2){
			return Version(sVersion1).compareTo(sVersion2);
		});
	}

	function getAllVersions(mNameAndVersionToState){
		var mStateEmptyAllVersions = {};
		for (var sName in mNameAndVersionToState){
			for (var sVersion in mNameAndVersionToState[sName]){
				mStateEmptyAllVersions[sVersion] = {};
			}
		}
		return getSortedVersions(mStateEmptyAllVersions);
	}
	
	var aAllVersions = getAllVersions(mState); 

	function getPreviousVersion(sVersion){
		return aAllVersions[aAllVersions.indexOf(sVersion) - 1];
	}
	
	// returns enhanced state adding all versions (later then the first mentioned one) and all information already been added in empty state per version 
	function getFullState(mNameAndVersionToState){
		
		function getFirstVersion(mVersionToState){
			return getSortedVersions(mVersionToState)[0];
		}
		
		var mFullState = {};
		for (var sName in mNameAndVersionToState){
			// be aware, that "empty" is the first name. This is necessary to enhance all states with the information already provided to the empty state even in the versions not
			// explicitly added in the empty state.
			mFullState[sName] = {};
			var oStatePreviousVersion;
			aAllVersions.forEach(function(sVersion){
				// add all missing versions to each state, but starting only from the first one provided
				if (Version(sVersion).compareTo(getFirstVersion(mNameAndVersionToState[sName])) < 0){
					return;
				}
				// Remember the state provided for the given version to be able to take a copy for the next version if no state provided for that one. (This is also relevant for 
				// "empty" state, as also there not a versions are provided explicitly.)
				oStatePreviousVersion = mNameAndVersionToState[sName][sVersion] || oStatePreviousVersion;
				// Add all information from "empty" state for that version. (This is of course irrelevant for "empty" state itself.) Information is not added to the state remembered
				// for the next loop to allow also testing removal of information (typically moved to a different place).
				mFullState[sName][sVersion] = deepExtend({}, mFullState.empty[sVersion], oStatePreviousVersion);
				// Correct version info if provided in state (esp. if taken over from previous loop). Note: Shortening with && is not possible here, as this would create a explicit
				// undefined property in old states, which is not accepted by assert.deepEqual.
				if (mFullState[sName][sVersion].version){
					mFullState[sName][sVersion].version = sVersion;
				}
			});
		}
	
		// Add a special version "current" pointing to the newest one to avoid the need to adapt (the expected result in) all existing (full) tests when a new change (in a new 
		// version) is needed
		// better: 
		// - sCurrentVerions as a pointer
		// - don't mix namespaces (tbd)
		aAllVersions.forEach(function(sVersion){
			for (var sKey in mFullState){
				if (mFullState[sKey][sVersion]){
					mFullState[sKey].current = mFullState[sKey][sVersion];
					mFullState[sKey].sCurrentVersion = sVersion;
				}
			}
		})
		
		return mFullState;
	};
	
	// use enhanced state for tests
	var mFullState = getFullState(mState);
	
	QUnit.module("Legacy states tests - single step tests (using private methods)", {
		beforeEach: function() {
			oSandbox = sinon.sandbox.create();
			oStubForPrivate = testableHelper.startTest();
			oLegacyStateHandler = new LegacyStateHandler(oController);
			oSandbox.stub(oController, "getView", function(){
				return {
					getId: function(){
						return "ViewId";
					},
					getLocalId: function(sGlobalId){
						var aParts = sGlobalId.split("--");
						return aParts[0] === "ViewId" && aParts[1];
					}
				};
			});
		},
		afterEach: function() {
			testableHelper.endTest();
			oSandbox.restore();
		}
	}, function(){

		QUnit.test("Empty state created with version 1.34 or earlier", function(assert){
			var oLegacyState = mFullState.empty["1.34.0"];
			var oExpected = mFullState.empty["1.36.0"];

			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_34(deepExtend({}, oLegacyState)));

			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})

		QUnit.test("Empty state created with version 1.44.6 or earlier", function(assert){
			var oLegacyState = mFullState.empty["1.36.0"];
			var oExpected = mFullState.empty["1.44.7"];

			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_44_6(deepExtend({}, oLegacyState)));

			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})

		QUnit.test("Empty state created with version 1.60.0 or earlier", function(assert){
			var oLegacyState = mFullState.empty["1.44.7"];
			var oExpected = mFullState.empty["1.60.1"];

			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_60_0(deepExtend({}, oLegacyState)));

			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})

		QUnit.test("Empty state created with version 1.85 or earlier", function(assert){
			var oLegacyState = mFullState.empty["1.60.1"];
			var oExpected = mFullState.empty["1.86.0"];

			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_85(deepExtend({}, oLegacyState)));

			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})

		QUnit.test("Empty state created with version 1.89 or earlier", function(assert){
			var oLegacyState = mFullState.empty["1.86.0"];
			var oExpected = mFullState.empty["1.90.0"];

			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_89(deepExtend({}, oLegacyState)));

			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})

		QUnit.test("Empty state created with version 1.93 or earlier", function(assert){
			var oLegacyState = mFullState.empty["1.90.0"];
			var oExpected = mFullState.empty["1.94.0"];
			
			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_93(deepExtend({}, oLegacyState)));
			
			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})

		QUnit.test("Empty state created with version 1.98 or earlier", function(assert){
			var oLegacyState = mFullState.empty["1.94.0"];
			var oExpected = mFullState.empty["1.99.0"];
			
			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_98(deepExtend({}, oLegacyState)));
			
			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})

		QUnit.test("Empty state created with version 1.99 or earlier", function(assert){
			var oLegacyState = mFullState.empty["1.99.0"];
			var oExpected = mFullState.empty["1.100.0"];
			
			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_99(deepExtend({}, oLegacyState)));
			
			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})

		QUnit.test("Empty state created with version 1.101 or earlier", function(assert){
			var oLegacyState = mFullState.empty["1.100.0"];
			var oExpected = mFullState.empty["1.102.0"];
			
			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_101(deepExtend({}, oLegacyState)));
			
			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})

		QUnit.test("Empty state created with version 1.102 or earlier", function(assert){
			var oLegacyState = mFullState.empty["1.102.0"];
			var oExpected = mFullState.empty["1.103.0"];
			
			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_102(deepExtend({}, oLegacyState)));
			
			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})

		QUnit.test("Empty state created with version 1.104 or earlier", function(assert){
			var oLegacyState = mFullState.empty["1.103.0"];
			var oExpected = mFullState.empty["1.105.0"];
			
			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_104(deepExtend({}, oLegacyState)));
			
			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})


		QUnit.test("State created with version 1.104 or earlier containing information whether to load data", function(assert){
			var oLegacyState = mFullState.dataLoaded["1.103.0"];
			var oExpected = mFullState.dataLoaded["1.105.0"];
			
			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_104(deepExtend({}, oLegacyState)));
			
			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		});


		QUnit.test("State created with version 1.34 or earlier containing draft edit state filter", function(assert){
			var oLegacyState = mFullState.editState["1.34.0"];
			var oExpected = mFullState.editState["1.36.0"];
			
			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_34(deepExtend({}, oLegacyState)));
			
			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		});

		QUnit.test("State created with version 1.102 or earlier containing draft edit state filter", function(assert){
			var oLegacyState = mFullState.editState["1.102.0"];
			var oExpected = mFullState.editState["1.103.0"];
			
			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_102(deepExtend({}, oLegacyState)));
			
			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		});
		
		QUnit.test("State created with version 1.34 or earlier containing app extension state", function(assert){
			var oLegacyState = mFullState.appExtension["1.34.0"];
			var oExpected = mFullState.appExtension["1.36.0"];
			
			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_34(deepExtend({}, oLegacyState)));
			
			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})

		QUnit.test("State created with version 1.102 or earlier containing app extension state", function(assert){
			var oLegacyState = mFullState.appExtension["1.102.0"];
			var oExpected = mFullState.appExtension["1.103.0"];
			
			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_102(deepExtend({}, oLegacyState)));
			
			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})
		
		QUnit.test("State created with version 1.89 or earlier containing table variant id", function(assert){
			var oLegacyState = mFullState.tableVariantId["1.89.0"];
			var oExpected = mFullState.tableVariantId["1.90.0"];

			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_89(deepExtend({}, oLegacyState)));

			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})

		QUnit.test("State created with version 1.93 or earlier containing table variant id", function(assert){
			var oLegacyState = mFullState.tableVariantId["1.90.0"];
			var oExpected = mFullState.tableVariantId["1.94.0"];

			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_93(deepExtend({}, oLegacyState)));

			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})

		QUnit.test("State created with version 1.98 or earlier containing table variant id", function(assert){
			var oLegacyState = mFullState.tableVariantId["1.94.0"];
			var oExpected = mFullState.tableVariantId["1.99.0"];

			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_98(deepExtend({}, oLegacyState)));

			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})

		QUnit.test("State created with version 1.93 or earlier containing selection variant modified state information", function(assert){
			var oLegacyState = mFullState.variantClean["1.93.0"];
			var oExpected = mFullState.variantClean["1.94.0"];

			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_93(deepExtend({}, oLegacyState)));

			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})

		QUnit.test("State created with version 1.98 or earlier containing selection variant modified state information", function(assert){
			var oLegacyState = mFullState.variantClean["1.94.0"];
			var oExpected = mFullState.variantClean["1.99.0"];

			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_98(deepExtend({}, oLegacyState)));

			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})

		QUnit.test("State created with version 1.94 or earlier containing worklist information (single table)", function(assert){
			var oLegacyState = mFullState.worklistSingleTab["1.94.0"];
			var oExpected = mFullState.worklistSingleTab["1.95.0"];

			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_94(deepExtend({}, oLegacyState)));

			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})

		QUnit.test("State created with version 1.94 or earlier containing worklist information (multiple views with multiple tables)", function(assert){
			var oLegacyState = mFullState.worklistMultiTab["1.94.0"];
			var oExpected = mFullState.worklistMultiTab["1.95.0"];

			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_94(deepExtend({}, oLegacyState)));

			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})

		QUnit.test("State created with version 1.97 or earlier containing active state filter (single table)", function(assert){
			var oLegacyState = mFullState.activeStateFilterSingleTab["1.97.0"];
			var oExpected = mFullState.activeStateFilterSingleTab["1.98.0"];

			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_97(deepExtend({}, oLegacyState)));

			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})

		QUnit.test("State created with version 1.101 or earlier containing active state filter (single table)", function(assert){
			var oLegacyState = mFullState.activeStateFilterSingleTab["1.100.0"];
			var oExpected = mFullState.activeStateFilterSingleTab["1.102.0"];

			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_101(deepExtend({}, oLegacyState)));

			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})

		QUnit.test("State created with version 1.102 or earlier containing active state filter (single table)", function(assert){
			var oLegacyState = mFullState.activeStateFilterSingleTab["1.102.0"];
			var oExpected = mFullState.activeStateFilterSingleTab["1.103.0"];
			
			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_102(deepExtend({}, oLegacyState)));
			
			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})
		
		QUnit.test("State created with version 1.97 or earlier containing active state filter (multiple views with multiple tables)", function(assert){
			var oLegacyState = mFullState.activeStateFilterMultiTab["1.97.0"];
			var oExpected = mFullState.activeStateFilterMultiTab["1.98.0"];
			
			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_97(deepExtend({}, oLegacyState)));
			
			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})

		QUnit.test("State created with version 1.101 or earlier containing active state filter (multiple views with multiple tables)", function(assert){
			var oLegacyState = mFullState.activeStateFilterMultiTab["1.100.0"];
			var oExpected = mFullState.activeStateFilterMultiTab["1.102.0"];
			
			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_101(deepExtend({}, oLegacyState)));
			
			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})

		QUnit.test("State created with version 1.102 or earlier containing active state filter (multiple views with multiple tables)", function(assert){
			var oLegacyState = mFullState.activeStateFilterMultiTab["1.102.0"];
			var oExpected = mFullState.activeStateFilterMultiTab["1.103.0"];
			
			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_102(deepExtend({}, oLegacyState)));
			
			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})

		QUnit.test("State created with version 1.99 or earlier containing semantic Date range filter information", function(assert){
			var oLegacyState = mFullState.semanticDates["1.99.0"];
			var oExpected = mFullState.semanticDates["1.100.0"];

			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_99(deepExtend({}, oLegacyState)));

			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})

		QUnit.test("State created with version 1.102 or earlier containing adaptation extension state", function(assert){
			var oLegacyState = mFullState.adaptationExtension["1.102.0"];
			var oExpected = mFullState.adaptationExtension["1.103.0"];
			
			var oResult = deepExtend({}, oStubForPrivate.mapFrom1_102(deepExtend({}, oLegacyState)));
			
			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		})

	});

	QUnit.module("Legacy states tests - full tests mapping to most current step (using public method only)", {
		beforeEach: function() {
			oSandbox = sinon.sandbox.create();
			oStubForPrivate = testableHelper.startTest();
			oLegacyStateHandler = new LegacyStateHandler(oController);
			oSandbox.stub(oController, "getView", function(){
				return {
					getId: function(){
						return "ViewId";
					},
					getLocalId: function(sGlobalId){
						var aParts = sGlobalId.split("--");
						return aParts[0] === "ViewId" && aParts[1];
					}
				};
			});
		},
		afterEach: function() {
			testableHelper.endTest();
			oSandbox.restore();
		}
	}, function(){

		function fnTestFunction(sName, sVersion, sTestVersion, assert){
			var oLegacyState = extend({},mFullState[sName][sVersion]);
			if (oLegacyState.version){
				oLegacyState.version = sTestVersion;
			}
			var oExpected = mFullState[sName][mFullState[sName].sCurrentVersion];

			var oResult = deepExtend({}, oLegacyStateHandler.getStateInCurrentFormat(oLegacyState));

			assert.deepEqual(oResult, oExpected, "state mapped correctly");
		}
		

//		testing only those versions actually provided in mState, i.e. with structural change related to the name (mFullState only needed for correct comparison due to other changes)
		for(var sName in mState){
			for(var sVersion in mState[sName]){
				// test mapping for released version
				// remark: description changed - if we introduced in version 1, changed in vesion 3 in the manual test we wrote 2 or earlier - now just 1
				QUnit.test("State '" + sName + "' created with version " + sVersion + " mapped correctly", 
					fnTestFunction.bind(null, sName, sVersion, sVersion));

				// test mapping for states created with snapshot versions (i.e. in development/test systems)
				// if the change changing the app state structure was already available when the state was created, version in state looks like x-SNAPSHOT, with structure like x
				var sTestVersion = sVersion + "-SNAPSHOT;"
				QUnit.test("State '" + sName + "' created with version " + sTestVersion + " (after structure change) mapped correctly", 
						fnTestFunction.bind(null, sName, sVersion, sTestVersion));
				
				// if the change changing the app state structure was not yet available when the state was created, version in state looks like x-SNAPSHOT, with previous structure 
				var sPreviousVersion = getPreviousVersion(sVersion);
				if (sPreviousVersion && mFullState[sName][sPreviousVersion]){
					QUnit.test("State '" + sName + "' created with version " + sTestVersion + " (before structure change) mapped correctly", 
							fnTestFunction.bind(null, sName, sPreviousVersion, sTestVersion));
				}
			}
		}

	});

});
