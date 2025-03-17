/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/m/p13n/modification/ModificationHandler"
], function(ModificationHandler) {
	"use strict";

	/**
	 *  @class Flex specific modification handler implementation
	 *
	 *
	 * @author SAP SE
	 * @public
	 * @since 1.104.0
	 * @alias sap.m.p13n.modification.TestModificationHandler
	 */
	var TestModificationHandler = ModificationHandler.extend("sap.m.p13n.modification.TestModificationHandler");

	TestModificationHandler.getInstance = function() {
		return new TestModificationHandler();
	};

	TestModificationHandler.processChanges = function(aChanges){
		return Promise.resolve(aChanges);
	};

	return TestModificationHandler;
});