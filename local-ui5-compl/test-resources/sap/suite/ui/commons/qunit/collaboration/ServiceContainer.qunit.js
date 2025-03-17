/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/suite/ui/commons/collaboration/ServiceContainer",
	"sap/suite/ui/commons/collaboration/BaseHelperService",
	"sap/suite/ui/commons/collaboration/TeamsHelperService",
	"sap/suite/ui/commons/collaboration/CollaborationHelper"
], function (ServiceContainer,BaseHelperService, TeamsHelperService, CollaborationHelper){
    QUnit.module("ServiceContainer", {
		beforeEach: function() {
			var oMockContainer =  {
				getServiceAsync: function (params) {
						return Promise.resolve({
							parseParameters: function() {
								return {
									"sap-collaboration-teams":["true"],
									"sap-ushell-config": ["lean"]
								};
							},
							parseShellHash: function() {
								return {
									contextRaw:'contextRaw',
									semanticObject:'semanticObject',
									action:'action',
									params: {}
								};
							},
							constructShellHash: function() {
								return "semanticObject-action";
							}
						});
				},
				inAppRuntime: function() {
					return false;
				}
			};
			this.oSandbox = sinon.sandbox.create();
			this.oRequireStub = this.oSandbox.stub(sap.ui, "require");
            this.oRequireStub.withArgs('sap/ushell/Container').returns(oMockContainer);
			this.oIsTeamsModeActiveStub = sinon.stub(CollaborationHelper, "isTeamsModeActive", function() {
				return Promise.resolve(true);
			});
		},
		afterEach: function() {
			this.oSandbox.restore();
			this.oRequireStub.restore();
			this.oIsTeamsModeActiveStub.restore();
		}
	});
    QUnit.test("getServiceAsync when provider is not COLLABORATION_MSTEAMS", function(assert) {
		return ServiceContainer.getServiceAsync().then(function(oCollabType){
			assert.equal(oCollabType instanceof BaseHelperService,true, "Instance of BaseHelperService returned");
		});
	});
	QUnit.test("getServiceAsync when provider is COLLABORATION_MSTEAMS", function(assert){
		ServiceContainer.setCollaborationType("COLLABORATION_MSTEAMS", {});
		return ServiceContainer.getServiceAsync().then(function(oCollabType){
			assert.equal(oCollabType instanceof TeamsHelperService,true, "Instance of TeamsHelperService returned");
		});
	});
});