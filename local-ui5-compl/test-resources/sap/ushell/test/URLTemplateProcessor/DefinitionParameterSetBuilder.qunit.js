// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @file QUnit tests for "sap.ushell.DependencyGraph".
 */
sap.ui.define([
    "sap/base/util/deepExtend",
    "sap/ushell/URLTemplateProcessor/DefinitionParameterSetBuilder"
], function (
    deepExtend,
    _DefinitionParameterSetBuilder
) {
    "use strict";

    /* global QUnit */

    var S_DEFAULT_NAMESPACE = "startupParameters"; /* irrelevant for this test */

    QUnit.module("#buildDefinitionParameterSet", {
        beforeEach: function () { },
        afterEach: function () { }
    });

    QUnit.test("no mergeWith specified", function (assert) {
        var oDefs = {
            names: {
                p1: "v1",
                p2: "v2"
            }
        };
        var oSite = {};
        var oResult = _DefinitionParameterSetBuilder.buildDefinitionParameterSet(
            deepExtend({}, oDefs),
            deepExtend({}, oSite),
            S_DEFAULT_NAMESPACE
        );

        assert.deepEqual(oResult, oDefs.names, "got the expected result");
    });

    QUnit.test("mergeWith array specified", function (assert) {
        var oDefs = {
            mergeWith: [
                "/path/to/parameter/namesB",
                "/path/to/parameter/namesA"
            ],
            names: {
                p1: "v1",
                p2: "v2"
            }
        };
        var oSite = {
            path: {
                to: {
                    parameter: {
                        namesA: {
                            p1: "vA1",
                            p3: "vA2"
                        },
                        namesB: {
                            p1: "vB1",
                            p3: "vB2"
                        }
                    }
                }
            }
        };

        var oDefsOriginal = deepExtend({}, oDefs);
        var oSiteOriginal = deepExtend({}, oSite);

        var oResult = _DefinitionParameterSetBuilder.buildDefinitionParameterSet(
            oDefs,
            oSite,
            S_DEFAULT_NAMESPACE
        );

        var oExpected = {
            p1: "v1",
            p2: "v2",
            p3: "vB2"
        };

        assert.deepEqual(oResult, oExpected, "got the expected result");
        assert.deepEqual(oDefs, oDefsOriginal, "oParamDefs has not been modifed"); // BCP incident 2170100493
        assert.deepEqual(oSite, oSiteOriginal, "oSite has not been modifed");
    });

    QUnit.test("mergeWith string specified", function (assert) {
        var oDefs = {
            mergeWith: "/redTemplate",
            names: {
                p1: "v1",
                p2: "v2"
            }
        };
        var oSite = {
            baseTemplate: {
                payload: {
                    parameters: {
                        names: {
                            baseName: "{./properites/base}",
                            baseId: "DefaultID",
                            baseFullName: "{join &baseId,&baseName}"
                        }
                    }
                }
            },
            blueTemplate: {
                payload: {
                    parameters: {
                        mergeWith: "/baseTemplate",
                        names: {
                            name: "Blue",
                            baseId: "BL"
                        }
                    }
                }
            },
            redTemplate: {
                payload: {
                    parameters: {
                        mergeWith: "/blueTemplate",
                        names: {
                            red: "true"
                        }
                    }
                }
            }
        };

        var oResult = _DefinitionParameterSetBuilder.buildDefinitionParameterSet(
            deepExtend({}, oDefs),
            deepExtend({}, oSite),
            S_DEFAULT_NAMESPACE
        );

        var oExpected = {
            p1: "v1",
            p2: "v2",
            red: "true",
            name: "Blue",
            baseId: "BL",
            baseName: "{./properites/base}",
            baseFullName: "{join &baseId,&baseName}"
        };

        assert.deepEqual(oResult, oExpected, "got the expected result");
    });

    QUnit.test("mixed mergeWith specified (string/array)", function (assert) {
        var oDefs = {
            mergeWith: "/redTemplate",
            names: {
                p1: "v1",
                p2: "v2"
            }
        };
        var oSite = {
            baseTemplate: {
                payload: {
                    parameters: {
                        names: {
                            baseName: "{./properites/base}",
                            baseId: "DefaultID",
                            baseFullName: "{join &baseId,&baseName}"
                        }
                    }
                }
            },
            extraTemplate: {
                payload: {
                    parameters: {
                        names: {
                            extra: "true"
                        }
                    }
                }
            },
            extendedTemplate: {
                payload: {
                    parameters: {
                        mergeWith: "/extraTemplate",
                        names: {
                            baseName: "{./properites/extended}"
                        }
                    }
                }
            },
            blueTemplate: {
                payload: {
                    parameters: {
                        mergeWith: [ // this notation is not recursive; names are pulled in without following other mergeWith(s)
                            "/extendedTemplate/payload/parameters/names",
                            "/baseTemplate/payload/parameters/names"
                        ],
                        names: {
                            name: "Blue",
                            baseId: "BL"
                        }
                    }
                }
            },
            redTemplate: {
                payload: {
                    parameters: {
                        mergeWith: "/blueTemplate",
                        names: {
                            red: "true"
                        }
                    }
                }
            }
        };

        var oResult = _DefinitionParameterSetBuilder.buildDefinitionParameterSet(
            deepExtend({}, oDefs),
            deepExtend({}, oSite),
            S_DEFAULT_NAMESPACE
        );

        var oExpected = {
            p1: "v1",
            p2: "v2",
            red: "true",
            name: "Blue",
            baseId: "BL",
            baseFullName: "{join &baseId,&baseName}",
            baseName: "{./properites/extended}"
        };

        assert.deepEqual(oResult, oExpected, "got the expected result");
    });

    QUnit.test("mergeWith uses references", function (assert) {
        var oDefs = {
            mergeWith: "/redTemplate",
            names: {
                p1: "v1",
                p2: "v2"
            }
        };

        var oSite = {
            blueTemplate: {
                payload: {
                    parameters: {
                        mergeWith: [ // this notation is not recursive; names are pulled in without following other mergeWith(s)
                            "./nonsense/path1",
                            "./nonsense/path2"
                        ],
                        names: {
                            name: "Blue",
                            baseId: "BL"
                        }
                    }
                }
            },
            redTemplate: {
                payload: {
                    parameters: {
                        mergeWith: "/blueTemplate",
                        names: {
                            red: "true"
                        }
                    }
                }
            }
        };

        assert.throws(
            _DefinitionParameterSetBuilder.buildDefinitionParameterSet.bind(
                null,
                deepExtend({}, oDefs),
                deepExtend({}, oSite),
                S_DEFAULT_NAMESPACE
            ),
            /Please only specify absolute paths via mergeWith/,
            "throws an exception"
        );
    });

    QUnit.test("detects invalid template parameter structure", function (assert) {
        var oDefs = {
            mergeWith: "/redTemplate",
            names: {
                p1: "v1",
                p2: "v2"
            }
        };

        var oSite = {
            blueTemplate: {
                payload: {
                }
            },
            redTemplate: {
                payload: {
                    parameters: {
                        mergeWith: "/blueTemplate",
                        names: {
                            red: "true"
                        }
                    }
                }
            }
        };

        assert.throws(
            _DefinitionParameterSetBuilder.buildDefinitionParameterSet.bind(
                null,
                deepExtend({}, oDefs),
                deepExtend({}, oSite),
                S_DEFAULT_NAMESPACE
            ),
            /[/]blueTemplate does not contain .*[.] Please make sure [/]blueTemplate points to the root of a URL template./,
            "throws an exception"
        );
    });

    QUnit.test("mutually recursive mergeWith(s)", function (assert) {
        var oDefs = {
            mergeWith: "/redTemplate",
            names: {
                p1: "v1",
                p2: "v2"
            }
        };

        var oSite = {
            blueTemplate: {
                payload: {
                    parameters: {
                        mergeWith: "/redTemplate",
                        names: {
                            name: "Blue",
                            baseId: "BL"
                        }
                    }
                }
            },
            redTemplate: {
                payload: {
                    parameters: {
                        mergeWith: "/blueTemplate",
                        names: {
                            red: "true"
                        }
                    }
                }
            }
        };

        assert.throws(
            _DefinitionParameterSetBuilder.buildDefinitionParameterSet.bind(
                null,
                deepExtend({}, oDefs),
                deepExtend({}, oSite),
                S_DEFAULT_NAMESPACE
            ),
            Error("Detected circular dependency of templates caused by mergeWith statements: ensure the template merges its parameters with a base template."),
            "throws an exception"
        );
    });

    QUnit.test("mutually recursive mergeWith(s) - terminal node", function (assert) {
        var oDefs = {
            mergeWith: "/redTemplate",
            names: {
                p1: "v1",
                p2: "v2"
            }
        };

        var oSite = {
            blueTemplate: {
                payload: {
                    parameters: {
                        mergeWith: ["/redTemplate/payload/parameters/names"],
                        names: {
                            name: "Blue",
                            baseId: "BL"
                        }
                    }
                }
            },
            redTemplate: {
                payload: {
                    parameters: {
                        mergeWith: "/blueTemplate",
                        names: {
                            red: "true"
                        }
                    }
                }
            }
        };

        assert.deepEqual(
            _DefinitionParameterSetBuilder.buildDefinitionParameterSet(
                deepExtend({}, oDefs),
                deepExtend({}, oSite),
                S_DEFAULT_NAMESPACE
            ),
            {
                baseId: "BL",
                name: "Blue",
                p1: "v1",
                p2: "v2",
                red: "true"
            }
        );
    });
});
