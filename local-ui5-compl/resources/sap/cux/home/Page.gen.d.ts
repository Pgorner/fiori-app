declare module "sap/cux/home/Page" {
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import Event from "sap/ui/base/Event";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ElementSettings } from "sap/ui/core/Element";

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $PageSettings extends $ElementSettings {

        /**
         * Title for the  page
         *
         * @since 1.120
         */
        title?: string | PropertyBindingInfo;

        /**
         * Icon for the  page
         *
         * @since 1.120
         */
        icon?: string | PropertyBindingInfo;

        /**
         * Subtitle for the  page
         *
         * @since 1.120
         */
        subTitle?: string | PropertyBindingInfo;

        /**
         * Background color for the  page
         *
         * @since 1.120
         */
        bgColor?: string | PropertyBindingInfo;

        /**
         * Id for the corresponding page
         *
         * @since 1.120
         * @experimental Since 1.120
         */
        pageId?: string | PropertyBindingInfo;

        /**
         * Space id for the corresponding page
         *
         * @since 1.120
         * @experimental Since 1.120
         */
        spaceId?: string | PropertyBindingInfo;

        /**
         * Space title for the corresponding page
         *
         * @since 1.120
         * @experimental Since 1.120
         */
        spaceTitle?: string | PropertyBindingInfo;

        /**
         * Url to be launched for the corresponding page
         *
         * @since 1.120
         * @experimental Since 1.120
         */
        url?: string | PropertyBindingInfo;

        /**
         * Press event for the page
         */
        press?: (event: Page$PressEvent) => void;
    }

    export default interface Page {

        // property: title

        /**
         * Gets current value of property "title".
         *
         * Title for the  page
         *
         * @since 1.120
         * Default value is: ""
         * @returns Value of property "title"
         */
        getTitle(): string;

        /**
         * Sets a new value for property "title".
         *
         * Title for the  page
         *
         * @since 1.120
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [title=""] New value for property "title"
         * @returns Reference to "this" in order to allow method chaining
         */
        setTitle(title: string): this;

        // property: icon

        /**
         * Gets current value of property "icon".
         *
         * Icon for the  page
         *
         * @since 1.120
         * Default value is: ""
         * @returns Value of property "icon"
         */
        getIcon(): string;

        /**
         * Sets a new value for property "icon".
         *
         * Icon for the  page
         *
         * @since 1.120
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [icon=""] New value for property "icon"
         * @returns Reference to "this" in order to allow method chaining
         */
        setIcon(icon: string): this;

        // property: subTitle

        /**
         * Gets current value of property "subTitle".
         *
         * Subtitle for the  page
         *
         * @since 1.120
         * Default value is: ""
         * @returns Value of property "subTitle"
         */
        getSubTitle(): string;

        /**
         * Sets a new value for property "subTitle".
         *
         * Subtitle for the  page
         *
         * @since 1.120
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [subTitle=""] New value for property "subTitle"
         * @returns Reference to "this" in order to allow method chaining
         */
        setSubTitle(subTitle: string): this;

        // property: bgColor

        /**
         * Gets current value of property "bgColor".
         *
         * Background color for the  page
         *
         * @since 1.120
         * Default value is: ""
         * @returns Value of property "bgColor"
         */
        getBgColor(): string;

        /**
         * Sets a new value for property "bgColor".
         *
         * Background color for the  page
         *
         * @since 1.120
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [bgColor=""] New value for property "bgColor"
         * @returns Reference to "this" in order to allow method chaining
         */
        setBgColor(bgColor: string): this;

        // property: pageId

        /**
         * Gets current value of property "pageId".
         *
         * Id for the corresponding page
         *
         * @since 1.120
         * @experimental Since 1.120
         * Default value is: ""
         * @returns Value of property "pageId"
         */
        getPageId(): string;

        /**
         * Sets a new value for property "pageId".
         *
         * Id for the corresponding page
         *
         * @since 1.120
         * @experimental Since 1.120
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [pageId=""] New value for property "pageId"
         * @returns Reference to "this" in order to allow method chaining
         */
        setPageId(pageId: string): this;

        // property: spaceId

        /**
         * Gets current value of property "spaceId".
         *
         * Space id for the corresponding page
         *
         * @since 1.120
         * @experimental Since 1.120
         * Default value is: ""
         * @returns Value of property "spaceId"
         */
        getSpaceId(): string;

        /**
         * Sets a new value for property "spaceId".
         *
         * Space id for the corresponding page
         *
         * @since 1.120
         * @experimental Since 1.120
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [spaceId=""] New value for property "spaceId"
         * @returns Reference to "this" in order to allow method chaining
         */
        setSpaceId(spaceId: string): this;

        // property: spaceTitle

        /**
         * Gets current value of property "spaceTitle".
         *
         * Space title for the corresponding page
         *
         * @since 1.120
         * @experimental Since 1.120
         * Default value is: ""
         * @returns Value of property "spaceTitle"
         */
        getSpaceTitle(): string;

        /**
         * Sets a new value for property "spaceTitle".
         *
         * Space title for the corresponding page
         *
         * @since 1.120
         * @experimental Since 1.120
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [spaceTitle=""] New value for property "spaceTitle"
         * @returns Reference to "this" in order to allow method chaining
         */
        setSpaceTitle(spaceTitle: string): this;

        // property: url

        /**
         * Gets current value of property "url".
         *
         * Url to be launched for the corresponding page
         *
         * @since 1.120
         * @experimental Since 1.120
         * Default value is: ""
         * @returns Value of property "url"
         */
        getUrl(): string;

        /**
         * Sets a new value for property "url".
         *
         * Url to be launched for the corresponding page
         *
         * @since 1.120
         * @experimental Since 1.120
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [url=""] New value for property "url"
         * @returns Reference to "this" in order to allow method chaining
         */
        setUrl(url: string): this;

        // event: press

        /**
         * Attaches event handler "fn" to the "press" event of this "Page".
         *
         * Press event for the page
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "Page" itself.
         *
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "Page" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachPress(fn: (event: Page$PressEvent) => void, listener?: object): this;

        /**
         * Attaches event handler "fn" to the "press" event of this "Page".
         *
         * Press event for the page
         *
         * When called, the context of the event handler (its "this") will be bound to "oListener" if specified,
         * otherwise it will be bound to this "Page" itself.
         *
         * @param data An application-specific payload object that will be passed to the event handler along with the event object when firing the event
         * @param fn The function to be called when the event occurs
         * @param listener Context object to call the event handler with. Defaults to this "Page" itself
         *
         * @returns Reference to "this" in order to allow method chaining
         */
        attachPress<CustomDataType extends object>(data: CustomDataType, fn: (event: Page$PressEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Detaches event handler "fn" from the "press" event of this "Page".
         *
         * Press event for the page
         *
         * The passed function and listener object must match the ones used for event registration.
         *
         * @param fn The function to be called, when the event occurs
         * @param listener Context object on which the given function had to be called
         * @returns Reference to "this" in order to allow method chaining
         */
        detachPress(fn: (event: Page$PressEvent) => void, listener?: object): this;

        /**
         * Fires event "press" to attached listeners.
         *
         * Press event for the page
         *
         * @param parameters Parameters to pass along with the event
         * @returns Reference to "this" in order to allow method chaining
         */
        firePress(parameters?: Page$PressEventParameters): this;
    }

    /**
     * Interface describing the parameters of Page's 'press' event.
     * Press event for the page
     */
    // eslint-disable-next-line
    export interface Page$PressEventParameters {
    }

    /**
     * Type describing the Page's 'press' event.
     * Press event for the page
     */
    export type Page$PressEvent = Event<Page$PressEventParameters>;
}
