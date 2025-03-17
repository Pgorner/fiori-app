// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview
 *
 * This serves as a mockserver for the CEP Content API.
 * The data is returned in the identical format that is expected from the backend.
 *
 */

(function () {
    "use strict";

    window["sap.ushell.bootstrap.callback"] = function () {
        sap.ui.require([
            "sap/ui/core/util/MockServer",
            "sap/ushell/shells/cdm/cep/WorkPages/WorkPageLocalMock",
            "sap/ushell/shells/cdm/cep/WorkPages/WorkPageLocalMock2",
            "sap/ushell/shells/cdm/cep/WorkPages/ErrorResponse",
            "sap/ushell/shells/cdm/cep/Menu/MenuLocalMock",
            "sap/ushell/shells/cdm/cep/Menu/SpacesLocalMock",
            "sap/ushell/shells/cdm/cep/Visualizations/VisualizationResponse",
            "sap/ushell/Config",
            "sap/ushell/Container"
        ], function (
            MockServer,
            WorkPageLocalMock,
            WorkPageLocalMock2,
            ErrorResponse,
            MenuLocalMock,
            SpacesLocalMock,
            VisualizationResponse,
            Config,
            Container
        ) {

            function _getUsedVisualizations(oWorkPageContents, limit, endCursor = null) {
                let aAllUsedViz = [];

                const fnFind = function (sVizId) {
                    return function (oViz) {
                        return oViz.id === sVizId;
                    };
                };

                oWorkPageContents.rows.forEach(function (oRow) {
                    oRow.columns.forEach(function (oColumn) {
                        oColumn.cells.forEach(function (oCell) {
                            oCell.widgets.forEach(function (oWidget) {
                                const oUsedViz = VisualizationResponse.data.visualizations.nodes.find(fnFind(oWidget.visualization.id));
                                if (!oUsedViz) { return; }
                                aAllUsedViz.push(oUsedViz);
                            });
                        });
                    });
                });

                let firstIndex = aAllUsedViz.findIndex((item) => item.id === endCursor);
                let nextNodes = aAllUsedViz.slice(firstIndex + 1, firstIndex + 1 + limit);

                return {
                    nodes: nextNodes,
                    pageInfo: {
                        endCursor: nextNodes[nextNodes.length - 1]?.id,
                        hasNextPage: firstIndex + limit <= aAllUsedViz.length - 1
                    }
                };
            }


            function _getFilterParamsFromUrl (sUrl) {
                const aSplitUrl = sUrl.split("?");
                if (aSplitUrl.length !== 2) { return; }

                const sQueryParams = aSplitUrl[1];
                if (!sQueryParams) { return; }

                const oSearchParams = new URLSearchParams(sQueryParams);
                if (oSearchParams.size !== 2) { return; }

                const oQueryInput = JSON.parse(oSearchParams.get("variables"));
                return oQueryInput?.queryInput;
            }

            function _getFilteredVisualizationResponse (oVariables) {
                let aVisualizations = VisualizationResponse.data.visualizations.nodes;
                const iTop = oVariables?.top || aVisualizations.length;
                const iSkip = oVariables?.skip || 0;
                const oTypeFilter = oVariables.filter.find((oFilter) => { return oFilter.hasOwnProperty("type"); })?.type;
                const oIdFilter = oVariables.filter.find((oFilter) => { return oFilter.hasOwnProperty("id"); })?.id.in;
                const oDescriptorFilters = oVariables.filter.find((oFilter) => { return oFilter.hasOwnProperty("descriptor"); })?.descriptor;
                const oDescriptorTitleFilter = oDescriptorFilters?.find((oFilter) => oFilter.conditions[0].propertyPath === "/sap.app/title")?.conditions[0];
                const sSearchTerm = oDescriptorTitleFilter?.stringFilter[0] && oDescriptorTitleFilter?.stringFilter && oDescriptorTitleFilter?.stringFilter[0]?.containsIgnoreCase;

                // Fake the type filter
                if (oTypeFilter) {
                    const aTypes = oTypeFilter.map((oFilter) => oFilter.eq);

                    if (aTypes.length > 0) {
                        aVisualizations = aVisualizations.filter(function (oViz) {
                            return aTypes.indexOf(oViz.type) > -1;
                        });
                    }
                }

                // Fake the id filter
                if (oIdFilter) {
                    aVisualizations = aVisualizations.filter(function (oViz) {
                        return oViz.id?.indexOf(oIdFilter[0]) > -1;
                    });
                }

                // Fake the search filter
                if (sSearchTerm) {
                    aVisualizations = aVisualizations.filter(function (oViz) {
                        return oViz.descriptor.value["sap.app"]?.title?.indexOf(sSearchTerm) > -1 ||
                            oViz.descriptor.value["sap.app"]?.subTitle?.indexOf(sSearchTerm) > -1 ||
                            oViz.descriptor.value["sap.app"]?.info?.indexOf(sSearchTerm) > -1;
                    });
                }

                return {
                    data: {
                        visualizations: {
                            totalCount: aVisualizations.length,
                            nodes: aVisualizations.slice(iSkip, iSkip + iTop)
                        }
                    }
                };
            }

            /**
             * WorkPage with local mock data
             */
            var oWorkPageLocalMock = {
                data: {
                    workPage: {
                        id: "6a559319-8878-40a9-b8b7-22dd81f3c209",
                        editable: true,
                        contents: WorkPageLocalMock
                    }
                }
            };

            var oSpacesLocalMock = {
                data: SpacesLocalMock
            };
            var oMenuLocalMock = {
                data: MenuLocalMock
            };

            function getLocalWorkPageMockWithUsedViz1(endCursor) {
                return {
                    data: {
                        workPage: {
                            id: "6a559319-8878-40a9-b8b7-22dd81f3c209",
                            editable: true,
                            contents: WorkPageLocalMock,
                            usedVisualizations: _getUsedVisualizations(WorkPageLocalMock, 10, endCursor)
                        }
                    }
                };
            }

            function getLocalWorkPageMockWithUsedViz2(endCursor) {
                return {
                    data: {
                        workPage: {
                            id: "6a559319-8878-40a9-b8b7-22dd81f3c205",
                            editable: false,
                            contents: WorkPageLocalMock2,
                            usedVisualizations: _getUsedVisualizations(WorkPageLocalMock2, 10, endCursor)
                        }
                    }
                };
            }

            function getRandomDynamicTileCount() {
                return (Math.floor(Math.random() * 100) + 1).toString();
            }

            var oMockServer = new MockServer({
                rootUri: "/",
                requests: [{
                    method: "GET",
                    path: new RegExp("(.*\\/content\\/v1\\?query=.*)|(.*\\/mockbackend\\/dynamictile.*)|(.*\\/\\$count.*)"),
                    response: function (oXhr) {
                        if (oXhr.url.indexOf("visualizations(") > -1) {
                            const oFilterParams = _getFilterParamsFromUrl(oXhr.url);

                            if (oFilterParams) {
                                oXhr.respond(
                                    200,
                                    {"Content-Type": "application/json;charset=utf-8"},
                                    JSON.stringify(_getFilteredVisualizationResponse(oFilterParams))
                                );
                                return;
                            }

                            oXhr.respond(
                                200,
                                { "Content-Type": "application/json;charset=utf-8" },
                                JSON.stringify(VisualizationResponse)
                            );
                        } else if (oXhr.url.indexOf("workPage(") > -1 && oXhr.url.indexOf("usedVisualizations") > -1) {

                            const after = oXhr.url.match(/after:"([^"]+)"/gm);
                            const endCursor = after && after.length > 0 ? after[0].slice(7, after[0].length - 1) : null;

                            if (oXhr.url.indexOf("test-page-4") > -1) {
                                oXhr.respond(
                                    200,
                                    { "Content-Type": "application/json;charset=utf-8" },
                                    JSON.stringify(getLocalWorkPageMockWithUsedViz1(endCursor))
                                );
                                return true;
                            }
                            if (oXhr.url.indexOf("test-page-5") > -1) {
                                oXhr.respond(
                                    200,
                                    { "Content-Type": "application/json;charset=utf-8" },
                                    JSON.stringify(getLocalWorkPageMockWithUsedViz2(endCursor))
                                );
                                return true;
                            }
                            oXhr.respond(
                                200,
                                { "Content-Type": "application/json;charset=utf-8" },
                                JSON.stringify(getLocalWorkPageMockWithUsedViz2(endCursor))
                            );
                        } else if (oXhr.url.indexOf("spaces(") > -1) {
                                oXhr.respond(
                                    200,
                                    { "Content-Type": "application/json;charset=utf-8" },
                                    JSON.stringify(oSpacesLocalMock)
                                );
                        } else if (oXhr.url.indexOf("menu(") > -1) {
                            oXhr.respond(
                                200,
                                { "Content-Type": "application/json;charset=utf-8" },
                                JSON.stringify(oMenuLocalMock)
                            );
                        } else if (oXhr.url.indexOf("workPage(") > -1) {
                            oXhr.respond(
                                200,
                                { "Content-Type": "application/json;charset=utf-8" },
                                JSON.stringify(oWorkPageLocalMock)
                            );
                        } else if (oXhr.url.indexOf("/mockbackend/dynamictile") > -1 || oXhr.url.indexOf("/$count") > -1) {
                            oXhr.respond(
                                200,
                                { "Content-Type": "text/plain;charset=utf-8" },
                                getRandomDynamicTileCount()
                            );
                        } else {
                            oXhr.respond(400);
                        }

                        return true;
                    }
                }, {
                    method: "POST",
                    path: new RegExp("(.)*\\/content/v1"),
                    response: function (oXhr) {
                        var oRequestVars = JSON.parse(oXhr.requestBody).variables;
                        var oResponseData = {
                            data: {
                                updateWorkPage: {
                                    contents: oRequestVars.contents,
                                    editable: true,
                                    id: oRequestVars.workPageId,
                                    usedVisualizations: _getUsedVisualizations(oRequestVars.contents)
                                }
                            }
                        };
                        var bIsAdminUser = Container.getUser().isAdminUser();
                        if (bIsAdminUser) {
                            oXhr.respond(
                                200,
                                { "Content-Type": "application/json;charset=utf-8" },
                                JSON.stringify(oResponseData)
                            );
                        } else {
                            oXhr.respond(
                                403,
                                { "Content-Type": "text/plain" },
                                "You are not authorized to save Work Pages"
                            );
                        }

                        return true;
                    }
                }, {
                    method: "HEAD",
                    path: new RegExp("(.)*\\/content/v1"),
                    response: function (oXhr) {
                        oXhr.respond(
                            200,
                            { "x-csrf-token": "csrf-token-by-mockserver" },
                            "{}"
                        );
                    }
                }]
            });
            oMockServer.start();
        });
    };
}());



