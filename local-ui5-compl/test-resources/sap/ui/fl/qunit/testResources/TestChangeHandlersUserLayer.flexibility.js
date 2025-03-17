/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([], function() {
	"use strict";

	return {
		doSomething: {
			changeHandler: {
				applyChange() {
				},
				completeChangeContent() {
				},
				revertChange() {
				},
				dummyId: "testChangeHandler-doSomething"
			},
			layers: {
				USER: true,
				CUSTOMER: false
			}
		},
		doSomethingElse: {
			changeHandler: {
				applyChange() {
				},
				completeChangeContent() {
				},
				revertChange() {
				}
			},
			layers: {
				USER: true,
				CUSTOMER: false
			}
		}
	};
}, /* bExport= */true);
