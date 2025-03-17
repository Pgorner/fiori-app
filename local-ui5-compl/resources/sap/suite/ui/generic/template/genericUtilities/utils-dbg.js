// This static class contains generic utilities which do not find into any of the specialized helper utility classes
sap.ui.define([], function() {
	"use strict";

	// If images are included in the UI app they need to specify the path relatively (e.g. images/image.jpg) to support
	// different platforms like ABAP and HCP. The relative path has to be used because the absolute paths differ from platform
	// to platform. The rule is if the image url doesn't start with a / or sap-icon:// or http(s):// then it's a relative url and the absolute
	// path has to be added by the framework. This path can be retrieved with sap.ui.require.toUrl and the component name.
	function fnAdjustImageUrlPath(sImageUrl, sAppComponentName, bSuppressIcons) {
		if (!sImageUrl) {
			return "";
		}
		var bIsIcon = sImageUrl.startsWith("sap-icon://");
		if (bSuppressIcons && bIsIcon) {
			return "";
		}
		if (bIsIcon || sImageUrl.startsWith("/") || sImageUrl.startsWith("http://") || sImageUrl.startsWith("https://")) {
			return sImageUrl; // Absolute URL, nothing has to be changed
		} 
		// Relative URL, has to be adjusted
		return sap.ui.require.toUrl(sAppComponentName.replace(/\./g, "/")) + "/" + sImageUrl; //replacing dots by slashes before calling sap.ui.require.toUrl method. com.xyz.abc to com/xyz/abc
	}

	// Function check is B array values is a subset of A array values.
	// A = [], B = ["1", "2", "3"] -> true
	// A = ["4"], B = ["1", "2", "3"] -> false
	// A = ["1"], B = ["1", "2", "3"] -> true
	// A = ["1", "3"], B = ["1", "2", "3"] -> true
	// A = ["3", "2", "1"], B = ["1", "2", "3"] -> true
	// A = ["1", "4"], B = ["1", "2", "3"] -> false
	// A = ["1", "2", "3", "4"], B = ["1", "2", "3"] -> false
	function fnIsASubsetOfB(a, b) {
		if (a === b) {
			return true;
		}
		if (!a || !b) {
			return false;
		}
		if (a.length > b.length) {
			return false;
		}
		return a.every(function(entry) {
			return b.includes(entry);
		});
	}

	// Function to check if a string contains only ASCII characters only. Regular expression 
	// used consider [SPACE] to ~ (ASCII 32 to 126) printable ASCII characters. Control characters 
	// (ASCII 0 to 31) and DEL character (ASCII 127) are not considered as they could not be part 
	// of the string. Method returns true if the string contains only ASCII characters else false.
	function fnIsASCII(sString) {
		return /^[\x20-\x7E]*$/.test(sString);
	}

	return {
		adjustImageUrlPath: fnAdjustImageUrlPath,
		isASubsetOfB: fnIsASubsetOfB,
		isASCII: fnIsASCII
	};
});
