/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import GridContainer from "sap/f/GridContainer";
import FlexBox from "sap/m/FlexBox";
import Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
import Element from "sap/ui/core/Element";
import { dnd } from "sap/ui/core/library";

/**
 * Handles keyboard events for navigation and drag and drop functionality.
 * @param {KeyboardEvent} event - The keyboard event object.
 * @param {boolean} disablenavigation - Whether navigation is allowed.
 * @param {Function} callback - The callback function to execute when a drag and drop event occurs.
 * @returns {Promise<void>} A Promise that resolves when the handling is complete.
 */

export async function attachKeyboardHandler(
	event: KeyboardEvent,
	disablenavigation: boolean,
	callback?: (dragDropEvent: Event) => Promise<void> | void
) {
	const draggedControl = Element.closestTo((event.target as HTMLElement).firstElementChild as HTMLElement) as Control;
	const container = draggedControl.getParent() as GridContainer | FlexBox;
	const isMetaKey = event.metaKey || event.ctrlKey;
	const items = container.getItems();
	const currentIndex = items.findIndex((item) => document.activeElement === item.getDomRef());
	setTabIndexForItems(
		items.map((item) => item.getDomRef() as HTMLElement),
		currentIndex
	);

	if (
		!draggedControl ||
		!container ||
		!(disablenavigation && ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key))
	) {
		return;
	}

	event.preventDefault();
	event.stopPropagation();

	let currentItemIndex = container.indexOfItem(draggedControl);
	const reverseItems = [...items].reverse();
	switch (event.key) {
		case "ArrowRight":
			currentItemIndex += 1;
			break;
		case "ArrowLeft":
			currentItemIndex -= 1;
			break;
		case "ArrowUp":
		case "ArrowDown":
			currentItemIndex = _getClosestElementYIndex(container, currentItemIndex, event.key);
			break;
		case "Home":
			currentItemIndex = draggedControl.data("groupId")
				? items.findIndex((item) => item.data("groupId"))
				: items.findIndex((item) => !item.data("groupId"));
			break;
		case "End":
			currentItemIndex =
				items.length -
				1 -
				(draggedControl.data("groupId")
					? reverseItems.findIndex((item) => item.data("groupId"))
					: reverseItems.findIndex((item) => !item.data("groupId")));
			break;
	}
	const droppedControl = currentItemIndex > -1 && currentItemIndex < items.length ? items[currentItemIndex] : null;
	if (draggedControl && droppedControl) {
		const dragDropEvent = new Event("keyboardDragDropEvent", container, {
			draggedControl,
			droppedControl,
			dropPosition: ["ArrowLeft", "ArrowUp", "Home"].includes(event.key)
				? dnd.RelativeDropPosition.Before
				: dnd.RelativeDropPosition.After
		});
		setTabIndexForItems(
			items.map((item) => item.getDomRef() as HTMLElement),
			currentItemIndex
		);
		if (callback && isMetaKey) {
			await callback(dragDropEvent);
		}
		focusDraggedItem(container, currentItemIndex);
	}
}

/**
 * Gathers all DOM elements representing individual tiles in the grid container
 * that have the "sapFGridContainerItemWrapper" class, stores them in an array,
 * and then focuses the DOM element corresponding to the card that was just moved
 * during a drag-and-drop operation by setting its "tabindex" to "0" for
 * accessibility and navigation purposes.
 * @param {GridContainer | FlexBox} container - The container containing the items.
 * @param {number} dropItemIndex - The index of the item to focus after drag-and-drop.
 */
const focusDraggedItem = (container: GridContainer | FlexBox, dropItemIndex: number): void => {
	let draggedItemDomRef: HTMLElement | null = null;
	if (container instanceof GridContainer) {
		const aWrapperItemsDomRef: HTMLElement[] = [];
		container
			.$("listUl")
			.children()
			.each(function (iIndex, oWrapperItem) {
				if (oWrapperItem.classList.contains("sapFGridContainerItemWrapper")) {
					aWrapperItemsDomRef.push(oWrapperItem);
				}
			});
		draggedItemDomRef = aWrapperItemsDomRef[dropItemIndex];
	} else if (container instanceof FlexBox) {
		draggedItemDomRef = container.getItems()[dropItemIndex].getDomRef() as HTMLElement;
	}
	if (draggedItemDomRef) {
		draggedItemDomRef.setAttribute("tabindex", "0");
		draggedItemDomRef.focus();
	}
};

/**
 * Gets the index of the closest element in the Y direction within a grid container.
 * @param {GridContainer | FlexBox} container - The container (either GridContainer or FlexBox).
 * @param {number} currentIndex - The index of the current element.
 * @param {string} keyCode - The key code representing the direction (ArrowUp or ArrowDown).
 * @returns {number} The index of the closest element in the Y direction.
 */

const _getClosestElementYIndex = (container: GridContainer | FlexBox, currentIndex: number, keyCode: string) => {
	const fnElementPositionX = function (element: HTMLElement) {
		return element.getBoundingClientRect().x;
	};

	const fnElementPositionY = function (element: HTMLElement) {
		return element.getBoundingClientRect().y;
	};

	let minIndex = currentIndex;
	let minDistance = Number.MAX_SAFE_INTEGER;
	const items = container.getItems().map((item) => item.getDomRef()) as HTMLElement[];
	items.forEach(function (item, index) {
		const currentDist = Math.sqrt(
			Math.pow(fnElementPositionX(items[currentIndex]) - fnElementPositionX(item), 2) +
				Math.pow(fnElementPositionY(items[currentIndex]) - fnElementPositionY(item), 2)
		);
		const isAllowed = (keyCode === "ArrowDown" && index > currentIndex) || (keyCode === "ArrowUp" && index < currentIndex);
		if (isAllowed && currentDist < minDistance && fnElementPositionY(item) !== fnElementPositionY(items[currentIndex])) {
			minDistance = currentDist;
			minIndex = index;
		}
	});
	return minIndex;
};

const setTabIndexForItems = (aItems: HTMLElement[], currentIndex: number) => {
	aItems.forEach((x, index) => {
		x.tabIndex = index === currentIndex ? 0 : -1;
	});
};
