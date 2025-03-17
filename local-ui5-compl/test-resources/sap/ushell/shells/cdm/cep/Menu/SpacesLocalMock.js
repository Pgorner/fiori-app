// Copyright (c) 2009-2023 SAP SE, All Rights Reserved


sap.ui.define([], function () {
    "use strict";

    return {
        spaces: {
            nodes: [
                {
                    id: "test-space-3",
                    descriptor: {
                        value: {
                            title: "Space 3"
                        }
                    },
                    workPages: {
                        nodes: [
                            {
                                id: "test-page-4",
                                contents: {
                                    descriptor: {
                                        value: {
                                            title: "Page 4"
                                        }
                                    }
                                }
                            }
                        ]
                    }
                },
                {
                    id: "test-space-1",
                    descriptor: {
                        value: {
                            title: "Space 1"
                        }
                    },
                    workPages: {
                        nodes: [
                            {
                                id: "page1",
                                contents: {
                                    descriptor: {
                                        value: {
                                            title: "Page 1",
                                            pageType: "page",
                                            description: "Page for SuccessFactors content"
                                        }
                                    }
                                }
                            },
                            {
                                id: "test-page-2",
                                contents: {
                                    descriptor: {
                                        value: {
                                            title: "Page 2"
                                        }
                                    }
                                }
                            }
                        ]
                    }
                },
                {
                    id: "test-space-2",
                    descriptor: {
                        value: {
                            title: "Space 2"
                        }
                    },
                    workPages: {
                        nodes: [
                            {
                                id: "page3",
                                contents: {
                                    descriptor: {
                                        value: {
                                            title: "Page 3",
                                            pageType: "page",
                                            description: "Home Page"
                                        }
                                    }
                                }
                            }
                        ]
                    }
                },
                {
                    id: "test-space-4",
                    descriptor: {
                        value: {
                            title: "Space 4"
                        }
                    },
                    workPages: {
                        nodes: [
                            {
                                id: "test-page-5",
                                contents: {
                                    descriptor: {
                                        value: {
                                            title: "Page 5"
                                        }
                                    }
                                }
                            },
                            {
                                id: "test-page-6",
                                contents: {
                                    descriptor: {
                                        value: {
                                            title: "Error Page"
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
});
