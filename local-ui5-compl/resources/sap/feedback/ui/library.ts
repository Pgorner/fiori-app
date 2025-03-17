/*!
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library sap.feedback.ui.
 */
// import the library dependencies
import 'sap/ui/core/library';

import Lib from 'sap/ui/core/Lib';

// delegate further initialization of this library to the Core

const thisLib = Lib.init({
	apiVersion: 2,
	name: 'sap.feedback.ui',
	dependencies: ['sap.ui.core'],
	interfaces: [],
	elements: [],
	noLibraryCSS: true,
	version: '1.132.0'
});

export default thisLib;
