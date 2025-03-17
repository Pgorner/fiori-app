sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/suite/ui/commons/UnifiedThingInspector",
    "sap/suite/ui/commons/ValueStatus",
    "sap/m/Button",
    "sap/m/MessageToast",
    "sap/m/Link",
    "sap/suite/ui/commons/KpiTile",
    "sap/m/ActionSheet",
    "sap/m/PlacementType",
    "sap/m/App",
    "sap/m/Shell",
    "sap/m/Page",
    "./GeneralFacet",
    "./ControllingDocsFacet",
    "./InternalOrderFacet",
    "./SalesFacet",
    "./ContactsFacet",
    "./AttachmentsFacet",
    "./RelatedArticlesFacet",
    "./StorageFacet",
    "./ActivityTypesFacet",
    "./SalesOrganizationFacet",
    "./ProductsFacet",
    "./Vizbiz",
], function(JSONModel, UnifiedThingInspector, ValueStatus, Button, MessageToast, Link, KpiTile, 
    ActionSheet, PlacementType, App, Shell, Page, GeneralFacet, ControllingDocsFacet, InternalOrderFacet,
    SalesFacet, ContactsFacet, AttachmentsFacet, RelatedArticlesFacet, StorageFacet,
    ActivityTypesFacet, SalesOrganizationFacet, ProductsFacet, Vizbiz
    ){

    'use strict';

    var oUnifiedThingInspectorMain = {
        
        init: function(){

            var oFacetData = {
                overview: GeneralFacet.oGeneralFacetGroup,
                controllingDocs: ControllingDocsFacet.oListControllingDocsGroup,
                orders: InternalOrderFacet.oListOrdersFormGroup,
                quotation: SalesFacet.oSalesQuotationFormGroup,
                contactsImages: ContactsFacet.oContactsWithImagesFormGroup,
                attachments: AttachmentsFacet.oAttachmentsContent,
                relatedArticles: RelatedArticlesFacet.oRelatedArticlesContent,
            };
            var setFacetContent = function(sKey){
                oUTI.navigateToDetailWithContent(oFacetData[sKey]);
            };
            var oData = {
                title: "Article",
                name: "Frozen Strawberries",
                //name: "FrozenStrawberries FrozenStrawberrie",
                description: "2901972",
                kpis: [{
                    id: "kpi0",
                    value: "In Approval",
                    description: "Status",
                    doubleFontSize: false,
                    valueStatus: ValueStatus.Critical
                }, {
                    id: "kpi1",
                    value: "32",
                    valueScale: "M",
                    valueUnit: "USD",
                    description: "Gross national program",
                    valueStatus: ValueStatus.Good
                }, {
                    id: "kpi2",
                    value: "Finished Product",
                    description: "Material Type",
                    doubleFontSize: false
                }],
                facets: [{
                    title: "General"
                }, {
                    title: "Contacts",
                    quantity: 17
                }, {
                    title: "Internal Orders",
                    quantity: 3
                }, {
                    title: "Controlling Documents",
                    quantity: 99
                }, {
                    title: "Invoices",
                    quantity: 14
                }, {
                    title: "Activity Types",
                    quantity: 8
                }],
                transactions : [
                    {
                        text:"Transaction 1"
                        },
                    {
                        text:"Transaction 2"
                    },
                    {
                        text : "sap.com",
                        href : "http://www.sap.com"
                    }
                ],
                actions : [
                    {
                        icon : "sap-icon://decline",
                        text : "Reject"
                   },
                   {
                       icon : "sap-icon://accept",
                       text : "Accept"
                   },
                   {
                       icon : "sap-icon://email",
                       text : "EMail"
                   },
                   {
                       icon : "sap-icon://forward",
                       text : "Forward"
                   },
                   {
                       icon : "sap-icon://delete",
                       text : "Delete"
                   }
                 ]
            };
            var oModel = new JSONModel();
            oModel.setData(oData);
            var oButtonTempl = new Button({
                icon : "{icon}",
                text : "{text}",
                press : function(oE) {
                    MessageToast.show(this.getText() +  " action pressed.")
                }
            });
            
            var oLinkTempl = new Link({
                text : "{text}",
                href : "{href}",
                press : function(oE) {
                    MessageToast.show(this.getText() +  " selected.")
                }
            });
            
            var fnKpiFactory = function(sId, oContext) {
                sId = oContext.getProperty("id");
                
                var oTemp = new KpiTile(sId, {
                    value: "{value}",
                    description: "{description}",
                    valueScale: "{valueScale}",
                    valueUnit: "{valueUnit}",
                    doubleFontSize: "{doubleFontSize}",
                    valueStatus: "{valueStatus}"
                });
                
                return oTemp;
            };
            
             var oActionSheet = new ActionSheet("unified-action-sheet-ext", {
                  showCancelButton: true,
                  placement: PlacementType.Top,
                    buttons : {
                    path: "/actions",
                    template : oButtonTempl
                }
            });
            oActionSheet.setModel(oModel);
             
            var oTransactionSheet = new sap.suite.ui.commons.LinkActionSheet("unified-transaction-sheet-ext", {
                showCancelButton: true,
                placement: PlacementType.Top,
                items : {
                    path:"/transactions", 
                    template : oLinkTempl
                }
            });
            oTransactionSheet.setModel(oModel);
            
            var oUTI = new UnifiedThingInspector({
                id : "unified",
                icon: "images/strawberries_frozen.jpg",
                //icon: "sap-icon://business-one",
                title : "{/title}",
                name : "{/name}",
                description : "{/description}",
                actionsVisible : true,
                transactionsVisible : true,
                kpis : {
                    path : "/kpis",
                    factory: fnKpiFactory
                },
                facets : [
                            GeneralFacet.oGeneralFacet(setFacetContent),
                            Vizbiz.ovizBizMapFacet(oUTI),
                            ProductsFacet.oProductsFacet,
                            SalesFacet.oSalesFacet,
                            InternalOrderFacet.oOrdersFacet(setFacetContent),
                            ActivityTypesFacet.oActivityTypesFacet(setFacetContent),
                            ControllingDocsFacet.oControllingDocsFacet(setFacetContent),
                            ContactsFacet.oContactsFacet(setFacetContent),
                            AttachmentsFacet.oAttachmentsFacet(setFacetContent),
                            StorageFacet.oStorageFacet,
                            RelatedArticlesFacet.oArticlesFacet(setFacetContent),
                            SalesOrganizationFacet.oSalesOrgFacet ],


                backAction : function() {
                    MessageToast.show("Back action pressed.")
                }
            });
        
            oUTI.attachConfigurationButtonPress(function(oE){
                MessageToast.show("Configuration button pressed.");
            });
            
            oUTI.attachActionsButtonPress(function(oE){
                oE.preventDefault();
                var oActionBtn = oE.getParameter("caller");
                oActionSheet.openBy(oActionBtn);
            });
            
            oUTI.attachTransactionsButtonPress(function(oE){
                oE.preventDefault();
                var oTransactionBtn = oE.getParameter("caller");
                oTransactionSheet.openBy(oTransactionBtn);
            });
            
            oUTI.setModel(oModel);
            
            var oApp = new App("myApp", {initialPage:"initial-page"});
            var oShell = new Shell();
            oShell.setApp(oApp);
            var oInitialPage = new Page("initial-page", {
                showHeader: false,
                enableScrolling: false,
                content:[ oUTI ]});
            oApp.addPage(oInitialPage);
            oShell.placeAt("sample1");
        },
        
    }

    oUnifiedThingInspectorMain.init();

});