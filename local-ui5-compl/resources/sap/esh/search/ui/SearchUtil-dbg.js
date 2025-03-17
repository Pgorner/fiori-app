/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define([], function () {
  "use strict";

  // =======================================================================
  // emphasize whyfound in case of ellipsis
  // =======================================================================
  const SAP_ELISA_CLASSNAME_FORWARD_ELLIPSIS = "sapElisaSearchResultForwardEllipsis";
  function forwardEllipsis4Whyfound(domref) {
    const classNameForwardEllipsis = SAP_ELISA_CLASSNAME_FORWARD_ELLIPSIS;
    // If forward ellipsis already applied, restore the original element html,
    // so that the necessity of forward ellipsis can be rechecked again.
    // This is required because the scale of the container could be changed in the meantime.
    if (domref.textContent?.substring(0, 3) === "..." && domref.classList.contains(classNameForwardEllipsis) && domref.dataset?.originalcontent?.substring(0, 3) !== "...") {
      restoreElement(domref, classNameForwardEllipsis);
    }
    const firstBElement = domref?.querySelector("b");
    // No <b> element
    if (!firstBElement) {
      return;
    }
    const isFirstBElementVisible = isElementVisible(firstBElement);
    if (isFirstBElementVisible) {
      removePreservedData(domref, classNameForwardEllipsis);
      return;
    } else {
      //Cut off the text until the first <b> element is visible
      // There could be nested layers of elements between <b> elements and domref
      // So, we need to find the direct parent of <b> elements
      const directParentOfBElement = firstBElement.parentElement;
      const range = document.createRange();
      range.setStartBefore(directParentOfBElement.firstChild);
      range.setEndBefore(firstBElement);
      const textBeforeFirstB = range.toString().trim();
      if (textBeforeFirstB.length > 0) {
        // Preserve the original text for the tooltip to be used in SearchHelper attachEventHandlersForTooltip
        // and innerhtml for the case of restore the original content for new check
        preserveElement(domref, classNameForwardEllipsis);
        // Replace text before the first <b> element with "..."
        const newTextNode = document.createTextNode("... ");
        range.deleteContents();
        range.insertNode(newTextNode);
      } else {
        removePreservedData(domref, classNameForwardEllipsis);
      }
    }
  }
  function isElementVisible(el) {
    if (!el) {
      return false;
    }

    // Get the bounding rectangle of the element
    const elementRect = el.getBoundingClientRect();

    // Default parent is the direct parent element
    // In case of SearchLink and SearchText, traverse up the DOM tree to find the parent element with corresponding class
    const classNames = ["sapUshellSearchLinkLink", "sapUshellSearchTextText"];
    let parentElement = findParentWithClass(el, classNames);
    if (!parentElement) {
      parentElement = el.parentElement;
    }

    // Get the bounding rectangle of the parent container
    const parentRect = parentElement.getBoundingClientRect();

    // Check if the element's rectangle is within the parent's rectangle
    const isVisible = elementRect.top <= parentRect.top + 1 &&
    // +1 to avoid rounding errors and padding/margin interference
    elementRect.left >= parentRect.left && elementRect.bottom <= parentRect.bottom && elementRect.right <= parentRect.right + 1; // +1 to avoid rounding errors and padding/margin interference

    return isVisible;
  }
  function findParentWithClass(el, classNames) {
    let currentElement = el;
    while (currentElement) {
      for (const className of classNames) {
        if (currentElement.classList.contains(className)) {
          return currentElement;
        }
      }
      currentElement = currentElement.parentElement;
    }
    return null;
  }

  // Add the class to the element and store the original content and innerhtml in the dataset
  function preserveElement(element, className) {
    // Don't overwrite the original content if the element is already preserved
    if (!className || element.classList.contains(className)) {
      return;
    }
    element.classList.add(className);
    // Store the original text content and innerHTML in the dataset
    element.dataset.originalcontent = element.textContent;
    element.dataset.originalcontenthtml = element.innerHTML;
  }

  // Restore the original content of the element and remove the preserved data including class name
  function restoreElement(element, className) {
    if (element.dataset.originalcontenthtml) {
      // Restore the original content
      element.innerHTML = element.dataset.originalcontenthtml;
    }
    removePreservedData(element, className);
  }

  // Remove the preserved data including class name from the element
  function removePreservedData(element, className) {
    delete element.dataset.originalcontent;
    delete element.dataset.originalcontenthtml;
    if (className) {
      element.classList.remove(className);
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.SAP_ELISA_CLASSNAME_FORWARD_ELLIPSIS = SAP_ELISA_CLASSNAME_FORWARD_ELLIPSIS;
  __exports.forwardEllipsis4Whyfound = forwardEllipsis4Whyfound;
  __exports.isElementVisible = isElementVisible;
  __exports.findParentWithClass = findParentWithClass;
  __exports.preserveElement = preserveElement;
  __exports.restoreElement = restoreElement;
  __exports.removePreservedData = removePreservedData;
  return __exports;
});
})();