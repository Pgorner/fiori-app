// Transformer using sap ui define and the VBI namespace
/**
 * JSON FORMAT
 * [
 *  {MapProvider},
 *  {GeoJSON},
 *  {Events}
 * ]
 * 
 */

sap.ui.define([
    "../lib/sapvbi",
    "./MapRenderer",
    "./VectorUtils",
    "sap/ui/unified/Menu",
    "sap/ui/unified/MenuItem",
], function (vb, MapRenderer, VectorUtils, Menu, MenuItem) {
    'use strict';

    VBI.VBITransformer = {};

    VBI.vectorFlag = false;

    VBI.TransformedJSON = [];

    var featureCollection = [];
    var mapProvider = {};

    var spot_id = 0;
    var route_id = 0;

    var ind_del;
    var legend;
    var resources;
    var resourceMap;
    var menus;
    var defaultbase64 = 'iVBORw0KGgoAAAANSUhEUgAAABcAAAAfCAYAAAAMeVbNAAADGUlEQVRIia3WW2xMQRjA8f+Z3bWru622ulhVWtpQlzbFhrq1UQmpy4O+IO6C4kki4VHcIx5RJO7iSXgRSpG6e6hbo7WJRrShFVLqTtX5POxO1Wa3u9Z+ySTfnNn5zZyzc+aMISJEiDnApEDJBJ4CN4HqQAkfIhKubBORGuk+qkVkbTjDCDHzacAeIB/A9/IdN+pe8aSpldfvvzDInUR+lpuS/Aw8KU7d5zKwEmjqCgXjB4FVAHVNrRyuquPxi7ch71gpg+KRA1hWMoL+qU6ANqAEeBAKrwDKTVM4Wf2UU9d9mGbE/4MEu431cwqYmpehL43RA2h8NHBfBHafreHyo8aIaHCsK81nbmE2QD2QB/xSgbatAOfuNcQEA1RU1upHOBzYC6CAcUDpx6/tHL1aHxMMYJrC/gu1BJ5yOWBR+Ncxlx428vXHz5hxgIaWNmobOxfAbAVMBrjja/4vWMddX4tOJyugAOBZc1tc8IaWTqdAAa7v7R18a++IC9766btOPQqgvcOMCxxk2RWA02GLG+76Y31QQJNFGfRNTogLHtgKAJ4roAZgaHpKXPAcT7JOHyj8ezPenL5xwb05/XR6UwGVABNz+2O1qLCdoglPipPsPzO/pQAfcK1Xgp2iEen/hc/yZmEYAJwATD3VMwALi3OxKCMm2OWwMds7WFcPgX/jAv9eXj3Qncj0gsyY8PlThuolfR643RUHOAawtGQ4CXbrP8EZaYmUFebo6i6ddMWPAxd7JzpYPSMvatiiDDaWjcVmVQBH9KyDcYANADPHZDFhmCcqfEHRMHIHpIL/01betS0YrwcOGAZsKvOS3tvVLTx6SB8WF+fq6ibgrw9CqIW9BjjtdNjYuXhi2H1noDuRzfPGo/yr6xBQFfybcG/NcqAqPdXF9oUTsNssfzW6k3qyY1HnwKeB1aGQcPgPYAXwZNSgNLYsKKSH1T9AqsvBnmVT9IHoErAkjNHtcQ4RGSwiDSIij56/kVX7rkjzu8/6KHdFRJK76x8JR0SyRaReRMQ0O8+IlSKSFqlvNDgiYhWRigBcEWUffgN+ZuQK2lE/1gAAAABJRU5ErkJggg==';
    // var Events

    // Needs to be triggerd only for initial load
    // Gets the map provider url if the payload has it
    // center: [0, 0], // starting position [lng, lat]
    // zoom: 1,

    // Get data from config - > 

    VBI.VBITransformer.init = function () {
        // event handlers from actions and automations
        this._eventHandlers = [];
        this._actions = [];

        //initialize section
        this._mapConfiguration = {};
        this._clusterVOs = new Map();

        //Dictionary for Data Attributes
        this._dataTypes = {};
        this._data = {};
        this._idKeyMap = {};

        //Properties in VBI JSON that need special handling
        this._propsAnomalies = new Map();
    }

    VBI.VBITransformer._extractMapProvider = (obj) => {
        if (!this.mVBIContext) {
            // just create the context.............................................//
            this.mVBIContext = new VBI.VBIContext(this);
        }
        var currRefMap = "DEFAULT";
        var initialStartPosition = [12.980846657174002, 77.7154284936771];
        var initialZoom = "0";
        var scaleType = "metric";
        var language = "EN";

        if (obj.SAPVB.Scenes) {
            if (obj.SAPVB.Scenes.Set.SceneGeo.refMapLayerStack) {
                currRefMap = obj.SAPVB.Scenes.Set.SceneGeo.refMapLayerStack;
                console.log(currRefMap);
                if (obj.SAPVB.Scenes.Set.SceneGeo.initialStartPosition) {
                    // 0.0 scenario must be handled
                    initialStartPosition[0] = Number(obj.SAPVB.Scenes.Set.SceneGeo.initialStartPosition.split(";")[0]);
                    initialStartPosition[1] = Number(obj.SAPVB.Scenes.Set.SceneGeo.initialStartPosition.split(";")[1]);
                    // initialStartPosition ="["+obj.SAPVB.Scenes.Set.SceneGeo.initialStartPosition.split(";")[0]+","+obj.SAPVB.Scenes.Set.SceneGeo.initialStartPosition.split(";")[1]+"]";
                }
                if (obj.SAPVB.Scenes.Set.SceneGeo.initialZoom) {
                    // 0.0 scenario must be handled
                    initialZoom = obj.SAPVB.Scenes.Set.SceneGeo.initialZoom[0];
                }
            }
            // Scale Control in Maplibre
            // metric  -> m,km
            // imperial -> ft,mi
            // nautical -> nm

            //in VBI 
            // nm
            // mi
            // km

            if (obj.SAPVB.Config) {
                if (obj.SAPVB.Config.Set) {
                    let config = obj.SAPVB.Config.Set;
                    if (Array.isArray(config.P)) {
                        for (const conf in config.P) {
                            if (config.P.hasOwnProperty(conf)) {
                                let currConf = config.P[conf];
                                switch (currConf.name) {
                                    case "UnitOfLength":
                                        if (currConf.value == "nm") {
                                            scaleType = "nautical";
                                        } else if (currConf.value == "mi") {
                                            scaleType = "imperial";
                                        } else {
                                            scaleType = "metric"
                                        }
                                        break;
                                    case "language":
                                        language = "EN"
                                        // Language needs to be handled
                                        break;
                                    default:
                                    // code block
                                }

                            }
                        }
                    } else {
                        switch (config.P.name) {
                            case "UnitOfLength":
                                if (config.P.value == "nm") {
                                    scaleType = "nautical";
                                } else if (config.P.value == "mi") {
                                    scaleType = "imperial";
                                } else {
                                    scaleType = "metric"
                                }
                                break;
                            case "language":
                                language = "EN"
                                // Language needs to be handled
                                break;
                            default:
                            // code block
                        }
                    }
                }
            }

            if (obj.SAPVB.MapProviders.Set.MapProvider) {
                let MapProvidersArray = obj.SAPVB.MapProviders.Set.MapProvider;

                for (const MapProvider in MapProvidersArray) {
                    if (MapProvidersArray.hasOwnProperty(MapProvider)) {
                        let Provider = MapProvidersArray[MapProvider];
                        if (Provider.name == currRefMap && Provider.type == "vector") {
                            mapProvider = {
                                "type": "MapProvider",
                                "provider": Provider.Source[0].url,
                                "center": initialStartPosition,
                                "zoom": Number(initialZoom),
                                "copyright": Provider.copyright,
                                "scaleType": scaleType ? scaleType : "metric",
                                "language": language ? language : "EN",
                                "header": Array.isArray(Provider.Header) ? Provider.Header.reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {}) : {}
                            }
                        }
                    }
                }
            }
        }
    }

    //DATA
    //Gets the spots and its properties
    VBI.VBITransformer._extractSpotsData = (spots) => {
        // var spot_id = 0;
        //E can be a single object too..
        // For each spot
        if (Array.isArray(spots.E)) {
            // console.log(spots.E.length);
            for (const spot in spots.E) {
                if (spots.E.hasOwnProperty(spot)) {
                    // console.log(spots.E[spot]);
                    let currSpot = spots.E[spot];

                    let spotProperties = {
                        "GeoPosition": currSpot.A ? currSpot.A : "",
                        "ToolTip": currSpot.B ? currSpot.B : "",
                        "Label": currSpot.L ? currSpot.L : "",
                        "LabelBGColor": currSpot.LC ? currSpot.LC : "",
                        "LabelAlignment": currSpot.LA ? currSpot.LA : "",
                        "Color": currSpot.C ? currSpot.C : "",
                        "HotColor": currSpot.HC ? currSpot.HC : "",
                        "SelectColor": currSpot.SC ? currSpot.SC : "",
                        "Transformation": currSpot.D ? currSpot.D : "",
                        "FixDir": currSpot.E ? currSpot.E : "",
                        "FixSize": currSpot.F ? currSpot.F : "",
                        "Icon": currSpot.G ? currSpot.G : "",
                        "Image": currSpot.I ? currSpot.I : "",
                        "base64": resources.find(resource => resource.name === currSpot.I)?.value || defaultbase64,
                        "Key": currSpot.K ? currSpot.K : "",
                        "Scale": currSpot.S ? currSpot.S : "",
                        "DisplayRole": currSpot.R ? currSpot.R : "",
                        "DragData": currSpot.DD ? currSpot.DD : "",
                        "Alignment": currSpot.AL ? currSpot.AL : "",
                        "height": resources.find(resource => resource.name === currSpot.I) ? '45px' : '30px',
                        "width": resources.find(resource => resource.name === currSpot.I) ? '45px' : '24px',
                        "menu": menus
                    };

                    let coord_array = currSpot.A.split(";");

                    let geometry = {
                        "coordinates": [
                            Number(coord_array[0]),
                            Number(coord_array[1])
                        ],
                        "type": "Point"
                    };


                    let spot_data = {
                        "type": "Feature",
                        "properties": spotProperties,
                        "geometry": geometry,
                        "id": spot_id++,
                    };

                    featureCollection.push(spot_data);
                }
            }
        } else {

            let currSpot = spots.E;
            if (currSpot) {
                let spotProperties = {
                    "GeoPosition": currSpot.A ? currSpot.A : "",
                    "ToolTip": currSpot.B ? currSpot.B : "",
                    "Label": currSpot.L ? currSpot.L : "",
                    "LabelBGColor": currSpot.LC ? currSpot.LC : "",
                    "LabelAlignment": currSpot.LA ? currSpot.LA : "",
                    "Color": currSpot.C ? currSpot.C : "",
                    "HotColor": currSpot.HC ? currSpot.HC : "",
                    "SelectColor": currSpot.SC ? currSpot.SC : "",
                    "Transformation": currSpot.D ? currSpot.D : "",
                    "FixDir": currSpot.E ? currSpot.E : "",
                    "FixSize": currSpot.F ? currSpot.F : "",
                    "Icon": currSpot.G ? currSpot.G : "",
                    "Image": currSpot.I ? currSpot.I : "",
                    "base64": resources.find(resource => resource.name === currSpot.I)?.value || defaultbase64,
                    "Key": currSpot.K ? currSpot.K : "",
                    "Scale": currSpot.S ? currSpot.S : "",
                    "DisplayRole": currSpot.R ? currSpot.R : "",
                    "DragData": currSpot.DD ? currSpot.DD : "",
                    "Alignment": currSpot.AL ? currSpot.AL : "",
                    "height": resources.find(resource => resource.name === currSpot.I) ? '45px' : '30px',
                    "width": resources.find(resource => resource.name === currSpot.I) ? '45px' : '24px'

                };

                let coord_array = currSpot.A.split(";");

                let geometry = {
                    "coordinates": [
                        Number(coord_array[0]),
                        Number(coord_array[1])
                    ],
                    "type": "Point"
                };

                let spot_data = {
                    "type": "Feature",
                    "properties": spotProperties,
                    "geometry": geometry,
                    "id": spot_id++,
                };

                featureCollection.push(spot_data);
            }
        }
    }

    //Gets the routes, links and its properties
    VBI.VBITransformer._extractRoutesData = (routes) => {

        //E can be a single object too..
        // For each spot
        if (Array.isArray(routes.E)) {
            // console.log(spots.E.length);
            for (const route in routes.E) {
                if (routes.E.hasOwnProperty(route)) {
                    // console.log(spots.E[spot]);
                    let currRoute = routes.E[route];
                    //A5 is an vector array with all coordinates.
                    let routeProperties = {
                        "GeoPosition": currRoute.A ? currRoute.A : "",
                        "ToolTip": currRoute.B ? currRoute.B : "",
                        "Label": currRoute.L ? currRoute.L : "",
                        "LabelBGColor": currRoute.LC ? currRoute.LC : "",
                        "LabelAlignment": currRoute.LA ? currRoute.LA : "",
                        "Color": currRoute.C ? VectorUtils.argbToRgba(currRoute.C) : "",
                        "BorderColor": currRoute.D ? VectorUtils.argbToRgba(currRoute.D) : "",
                        "HotColor": currRoute.HC ? currRoute.HC : "",
                        "SelectColor": currRoute.SC ? currRoute.SC : "",
                        "PosList": currRoute.H ? currRoute.H : "",
                        "StartStyle": currRoute.Y ? currRoute.Y : "",
                        "EndStyle": currRoute.Z ? currRoute.Z : "",
                        "Key": currRoute.K ? currRoute.K : "",
                        "DisplayRole": currRoute.R ? currRoute.R : "",
                        "LineWidth": currRoute.LW ? currRoute.LW * 1.5 : "",
                        "BorderWidth": currRoute.LW ? currRoute.LW * 1.5 + 2 : "",
                        "DotWidth": currRoute.DW ? currRoute.DW : "",
                        "DotColor": currRoute.DC ? currRoute.DC : "",
                        "LineDash": currRoute.LD ? currRoute.LD : "",
                        "DirectionIndicator": currRoute.DI ? currRoute.DI : "",
                        "DragData": currRoute.DD ? currRoute.DD : ""
                    };

                    //itearate through the route points and add the coordinates to the GeoJSON
                    let coord_array = currRoute.H.split(";");
                    let coord_collection = [];

                    for (let i = 0; i < coord_array.length; i = i + 3) {
                        coord_collection.push([Number(coord_array[i]), Number(coord_array[i + 1])])
                    }

                    let geometry = {
                        "coordinates": coord_collection,
                        "type": "LineString"
                    };

                    let route_data = {
                        "type": "Feature",
                        "properties": routeProperties,
                        "geometry": geometry,
                        // "id"           :  currRoute['VB:ix'],
                        "id": route_id++,
                    };

                    featureCollection.push(route_data);
                }
            }
        } else {

            let currRoute = routes.E;
            if (currRoute) {
                let routeProperties = {
                    "GeoPosition": currRoute.A ? currRoute.A : "",
                    "ToolTip": currRoute.B ? currRoute.B : "",
                    "Label": currRoute.L ? currRoute.L : "",
                    "LabelBGColor": currRoute.LC ? currRoute.LC : "",
                    "LabelAlignment": currRoute.LA ? currRoute.LA : "",
                    "Color": currRoute.C ? VectorUtils.argbToRgba(currRoute.C) : "",
                    "BorderColor": currRoute.D ? VectorUtils.argbToRgba(currRoute.D) : "",
                    "HotColor": currRoute.HC ? currRoute.HC : "",
                    "SelectColor": currRoute.SC ? currRoute.SC : "",
                    "PosList": currRoute.H ? currRoute.H : "",
                    "StartStyle": currRoute.Y ? currRoute.Y : "",
                    "EndStyle": currRoute.Z ? currRoute.Z : "",
                    "Key": currRoute.K ? currRoute.K : "",
                    "DisplayRole": currRoute.R ? currRoute.R : "",
                    "LineWidth": currRoute.LW ? currRoute.LW * 1.5 : "",
                    "BorderWidth": currRoute.LW ? currRoute.LW * 1.5 + 2 : "",
                    "DotWidth": currRoute.DW ? currRoute.DW : "",
                    "DotColor": currRoute.DC ? currRoute.DC : "",
                    "LineDash": currRoute.LD ? currRoute.LD : "",
                    "DirectionIndicator": currRoute.DI ? currRoute.DI : "",
                    "DragData": currRoute.DD ? currRoute.DD : ""

                };

                //itearate through the route points and add the coordinates to the GeoJSON
                let coord_array = currRoute.H.split(";");
                let coord_collection = [];

                for (let i = 0; i < coord_array.length; i = i + 3) {
                    coord_collection.push([Number(coord_array[i]), Number(coord_array[i + 1])])
                }

                let geometry = {
                    "coordinates": coord_collection,
                    "type": "LineString"
                };

                let route_data = {
                    "type": "Feature",
                    "properties": routeProperties,
                    "geometry": geometry,
                    // "id"           :  currRoute['VB:ix'],
                    "id": route_id++,
                };
                featureCollection.push(route_data);
            }
        }
    }

    VBI.VBITransformer._deleteSpotsData = (spots) => {

        if (Array.isArray(spots.E)) {
            // console.log(spots.E.length);
            for (const spot in spots.E) {
                //          if (spots.E.hasOwnProperty(spot)) {
                let currSpot = spots.E[spot];
                for (const index in featureCollection) {
                    if (featureCollection[index].properties.Key == currSpot.K) {
                        //  ind_del = featureCollection[index].id;
                        ind_del = index;
                        featureCollection.splice(ind_del, 1);
                    }
                    else {
                        console.log("error");
                    }
                }
            }
        }

        else {
            let currSpot = spots.E;

            for (const index in featureCollection) {
                if (featureCollection[index].properties.Key == currSpot.K) {
                    //  ind_del = featureCollection[index].id;
                    ind_del = index;
                }
                else {
                    console.log("error");
                }
            }

            featureCollection.splice(ind_del, 1);
        }
    }


    VBI.VBITransformer._deleteRoutesData = (routes) => {

        //E can be a single object too..
        // For each spot
        if (Array.isArray(routes.E)) {
            // console.log(spots.E.length);
            for (const route in routes.E) {
                //  if (routes.E.hasOwnProperty(route)) {
                // console.log(spots.E[spot]);
                let currRoute = routes.E[route];
                for (const index in featureCollection) {
                    if (featureCollection[index].properties.Key == currRoute.K) {
                        //  ind_del = featureCollection[index].id;
                        ind_del = index;
                        featureCollection.splice(ind_del, 1);
                    }
                    else {
                        console.log("error");
                    }
                }
            }
        }
        else {

            let currRoute = routes.E;

            for (const index in featureCollection) {
                if (featureCollection[index].properties.Key == currRoute.K) {
                    ind_del = [index];
                }
                else {
                    console.log("error");
                }
            }

            featureCollection.splice(ind_del, 1);
        }
    }
    VBI.VBITransformer._processAutomation = function (Menus, data) {
        const menusip = data.SAPVB.Automation?.Menus ? data.SAPVB.Automation.Menus : data.SAPVB?.Menus;
        if (menusip || menusip != null) {
            const menus = new VBI.Menus();
            menus.load(menusip, data.SAPVB.Automation.Call);
            VBI.MapRenderer.createMenu(menus, Menus.Call);
        }
    }

    VBI.VBITransformer._createLegend = (target) => {
        if (legend.m_DataSource && legend.LegendChanged()) {
            legend.m_Data = [];

            if (legend.m_oLegend && legend.m_oLegend.m_Table) {
                while (legend.m_oLegend.m_Table.rows.length > 0) {
                    legend.m_oLegend.m_Table.deleteRow(-1);
                }
                legend.ApplyData();
                legend.FillContent();
            }
        }
        //       var bClickRow = (this.mVBIContext.m_Actions.findAction("Click", hs, legend.m_ID)) ? true : false;
        if (target && legend.m_oLegend == null) {
            legend.m_oLegend = VBI.Utilities.CreateLegend(target + "-" + legend.m_ID, 0, legend.m_Caption, 5, false);
            legend.RegisterEvents();
            legend.m_Expanded = true;
            legend.ApplyData();
            legend.FillContent();
        }
        var map_container1 = document.getElementById(target)
        map_container1.appendChild(legend.m_oLegend.m_Div);
    }

    VBI.VBITransformer._extractDetailWindow = (jsonData) => {
        // Extract data from the JSON
        const { Windows } = jsonData.SAPVB;
        const windowDetails = Windows.Set.Window;
        const pos = Windows.Set.Window["pos.bind"];
        const posArray = pos.split(".");

        const data = jsonData.SAPVB.Data.Set.N.E[0].N.E; // Extract data from DetailData
        const scene = jsonData.SAPVB.Scenes.Set.Scene.VO; // Extract scene details
        const actions = jsonData.SAPVB.Actions.Set; // Extract actions

        // Create the popup window with its caption and other details
        const windowContainer = VectorUtils.createDetailWindowContainer(windowDetails);
        // Create popup container
        const popupContainer = document.createElement('div');
        // Add popup container as a child of the window container
        windowContainer.appendChild(popupContainer);

        scene.forEach(item => {
            let obj;
            switch (item.type) {
                case "{00100000-2013-1000-1100-50059A6A47FA}": // Sub Caption
                    obj = VectorUtils.createSubCaption(item);
                    popupContainer.appendChild(obj);
                    break;

                case "{00100000-2013-1000-3700-AD84DDBBB31B}": // Label
                    obj = VectorUtils.createLabel(item, data);
                    popupContainer.appendChild(obj);
                    break;

                case "{00100000-2013-1000-2400-D305F7942B98}": // Link 
                    obj = VectorUtils.createLink(item);
                    popupContainer.appendChild(obj);
                    break;

                case "{00100000-2013-1000-2200-6B060A330B2C}": // Image
                    obj = VectorUtils.createImage(item, defaultbase64, resourceMap);
                    popupContainer.appendChild(obj);
                    break;

                case "{00100000-2013-1000-2400-D305F7942B98}": // Button
                    obj = VectorUtils.createButton(item, actions);
                    popupContainer.appendChild(obj);
                    break;

                default:
                    console.error("Unknown element type:", item.type);
                    break;
            }
        });

        VBI.MapRenderer.createPopup(windowContainer, posArray);

    }
    VBI.VBITransformer._processDetailWindows = (obj) => {
        if (!this.mVBIContext.m_Windows) {
            this.mVBIContext.m_Windows = new VBI.Windows();
            // this.mVBIContext.m_Windows.load(obj.SAPVB.Windows, this.mVBIContext);
        }
        legend = new VBI.LegendWindow();
        if (Array.isArray(obj.SAPVB.Windows.Set.Window)) {
            legend.load(obj.SAPVB.Windows.Set.Window.find(window => window.id === "LEGEND"), this.mVBIContext);
        }
    }

    VBI.VBITransformer._extractData = (obj) => {
        if (!this.mVBIContext.m_DataProvider) {
            this.mVBIContext.m_DataProvider = new VBI.DataProvider();
        }

        this.mVBIContext.m_DataProvider.load(obj.SAPVB.Data, this.mVBIContext);
        // Set
        if (obj.SAPVB.Data.Set) {

            let set = obj.SAPVB.Data.Set;

            // if Set is an array
            // Set:[]
            if (Array.isArray(set)) {
                for (const vo in set) {
                    if (set.hasOwnProperty(vo)) {
                        let currItm = set[vo];
                        // N->E->[]
                        switch (currItm.name) {
                            case "Spots":
                                VBI.VBITransformer._extractSpotsData(currItm.N);
                                break;
                            case "Links":
                                VBI.VBITransformer._extractRoutesData(currItm.N)
                                break;
                            case "DetailData":
                                VBI.VBITransformer._extractDetailWindow(obj);
                                break;
                            default:
                            // code block
                        }

                    }
                }
            } else {
                // if Set is not an array; Set:{}
                // N[] -> E[]
                // N {} -> E[]
                // N{} -> E {}
                if (obj.SAPVB.Data.Set.N) {
                    // E or A within each array object. ***************
                    let C = obj.SAPVB.Data.Set.N;
                    // let C = obj.SAPVB.Data.Set.A;
                    if (Array.isArray(C)) {
                        for (const item in C) {
                            if (C.hasOwnProperty(item)) {
                                let currVO = C[item];
                                switch (currVO.name) {
                                    case "Spots":
                                        VBI.VBITransformer._extractSpotsData(currVO);
                                        break;
                                    case "Links":
                                        VBI.VBITransformer._extractRoutesData(currVO)
                                        break;
                                    case "DetailData":
                                        VBI.VBITransformer._extractDetailWindow(obj);
                                        break;
                                    case "KeyPress":
                                        if (this._target !== this._adapter._map()) { // only map supports key events
                                            return false;
                                        }
                                        this._event = "keyDown";
                                        this._target.setKeyEventDelay(250);
                                        this._target.setAllowKeyEventRepeat(false);
                                        this._handler = this._adapter._getKeyboardHandler(this.name);
                                        break;
                                    default:
                                    // code block
                                }
                            }
                        }
                    } else {
                        switch (C.name) {
                            case "Spots":
                                VBI.VBITransformer._extractSpotsData(C);
                                break;
                            case "Links":
                                VBI.VBITransformer._extractRoutesData(C);
                                break;
                            case "DetailData":
                                VBI.VBITransformer._extractDetailWindow(obj);
                                break;
                            default:
                            // code block
                        }
                    }

                }
            }
        }


        else {
            if (obj.SAPVB.Data.Remove) {

                let del = obj.SAPVB.Data.Remove;

                if (Array.isArray(del)) {
                    for (const vo in del) {
                        if (del.hasOwnProperty(vo)) {
                            let currItm = del[vo];
                            // N->E->[]
                            switch (currItm.name) {
                                case "Spo  ts":
                                    VBI.VBITransformer._deleteSpotsData(currItm.N);
                                case "Links":
                                    VBI.VBITransformer._deleteRoutesData(currItm.N);
                                    break;
                                default:

                            }
                        }
                    }
                }
                else {
                    if (obj.SAPVB.Data.Remove.N) {
                        // E or A within each array object. ***************
                        let D = obj.SAPVB.Data.Remove.N;
                        // let C = obj.SAPVB.Data.Set.A;
                        if (Array.isArray(D)) {
                            for (const item in D) {
                                if (D.hasOwnProperty(item)) {
                                    let currVO = D[item];
                                    switch (currVO.name) {
                                        case "Spots":
                                            VBI.VBITransformer._deleteSpotsData(currVO);
                                            break;
                                        case "Links":
                                            VBI.VBITransformer._deleteRoutesData(currVO);
                                            break;

                                        default:

                                    }
                                }
                            }
                        } else {
                            switch (D.name) {
                                case "Spots":
                                    VBI.VBITransformer._deleteSpotsData(D);
                                    break;
                                case "Links":
                                    VBI.VBITransformer._deleteRoutesData(D);
                                    break;


                                default:
                                // code block
                            }
                        }
                    }

                }
            }
        }
    }


    // Get the datatypes 
    // Run on initial load, if the datatypes are provided
    VBI.VBITransformer._extractDataTypes = (obj) => {
        //check if the datatypes are provided in the obj
        //If else check if the mappings are stored (from the initial load.)
        // load the datatype provider....................................//


    }

    VBI.VBITransformer._buildTransformedJSON = (featureCollection) => {

        VBI.TransformedJSON = [
            mapProvider ? mapProvider : {},
            {
                "type": "FeatureCollection",
                "features": featureCollection
            }
        ]

    }


    VBI.VBITransformer.parseVBI = (obj) => {
        VBI.vectorFlag = true;
        if (obj.SAPVB) {
            // initial load 
            if (obj.SAPVB.MapProviders && obj.SAPVB.MapLayerStacks && obj.SAPVB.Scenes) {
                VBI.VBITransformer._extractMapProvider(obj);
            }
            if (obj?.SAPVB?.Scenes?.Merge?.SceneGeo?.refMapLayerStack) {
                const refMapLayerStack = obj.SAPVB.Scenes.Merge.SceneGeo.refMapLayerStack;
                const provider = this._adapter._mapConfiguration.MapProvider.find(provider => provider.name === refMapLayerStack);
                const style = provider.Source[0].url;
                mapProvider.provider = style;
                mapProvider.header = Array.isArray(provider.Header) ? provider.Header.reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {}) : {}
                VBI.MapRenderer.setRefMapLayerStack(style, mapProvider.header);
            }
            if (obj.SAPVB.DataTypes) {
                if (!this.mVBIContext.m_DataTypeProvider) {
                    this.mVBIContext.m_DataTypeProvider = new VBI.DataTypeProvider();
                }
                this.mVBIContext.m_DataTypeProvider.load(obj.SAPVB.DataTypes, this.mVBIContext);
            }

            if (obj.SAPVB.Resources) {
                resources = obj.SAPVB.Resources.Set.Resource;
                // Convert Array to a Map
                resourceMap = new Map(resources.map(item => [item.name, item.value]));
            }

            if (obj.SAPVB.Automation && obj.SAPVB.Automation.Call) {
                VBI.VBITransformer._processAutomation(obj.SAPVB.Automation, obj);
            }

            if (obj.SAPVB.Menus && Object.keys(obj.SAPVB.Menus).length != 0) {
                menus = obj.SAPVB.Menus.Set.Menu;
            }

            if (obj.SAPVB.Data) {
                VBI.VBITransformer._extractData(obj);
            }

            if (obj.SAPVB.Actions) {
                VBI.MapRenderer.actionName(obj);
            }

            // if(obj.SAPVB.Data.Remove){
            //     VBI.VBITransformer._deleteData(obj);
            // }


            if (obj.SAPVB.Windows) {
                VBI.VBITransformer._processDetailWindows(obj);
            }

            // if(obj.SAPVB.Actions){

            // }

            // if(obj.SAPVB.Menus){

            // }

            if (obj.SAPVB.Automation) {
                // fly to handler
            }

            return VBI.VBITransformer._buildTransformedJSON(featureCollection);
        }
    }

    VBI.VBITransformer.getTransformedJSON = () => {
        return VBI.TransformedJSON;
    }

    VBI.VBITransformer.clearTransformedJSON = () => {

        VBI.TransformedJSON = [];
        featureCollection = [];

    }


    VBI.VBITransformer.getVectorFlag = () => {
        return VBI.vectorFlag;
    }

    VBI.VBITransformer._map = function () {
        return sap.ui.getCore().byId(_adapter.getMap());
    };
    /**
         * Attaches the specified event handler to the specified event with the provided listener.
         * Mainly used for custom events - FCODE_SELECT & DETAILS_FCODE_SELECT
         *
         *
         * @param {string} eventName The name of the event on 'this' to which the handler needs to be attached. <br/>
         * @param {function} handler The handler needs to be attached. <br/>
         * @param {object} listener The listener - would turn out to be value of 'this' inside the event handler. <br/>
         * @returns {sap.ui.vbm.Adapter} <code>this</code> to allow method chaining.
         * @private
         */
    VBI.VBITransformer._attachHandler = function (eventName, handler, listener) {
        if ((eventName in this.mEventRegistry) && (this.mEventRegistry[eventName].length > 0)) {
            return this;
        } else {
            if (!listener._eventHandlers.some(function (eh) { return eh === handler; })) {
                listener._eventHandlers.push(handler);
            }
            this.attachEvent(eventName, handler, listener);
            return this;
        }
    };
}
);

