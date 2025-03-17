sap.ui.define([
    'sap/viz/ui5/data/FlattenedDataset',
    'sap/ui/model/json/JSONModel',
    'sap/viz/ui5/Bar',
    'sap/viz/ui5/Bubble',
    'sap/viz/ui5/Line',
    'sap/viz/ui5/Combination',
    'sap/viz/ui5/Pie',
    'sap/viz/ui5/Donut',
    'sap/viz/ui5/Scatter',
    'sap/viz/ui5/StackedColumn',
    'sap/viz/ui5/StackedColumn100',
    'sap/viz/ui5/Column',
    'sap/viz/ui5/DualBar',
    'sap/viz/ui5/DualLine',
    'sap/viz/ui5/DualCombination',
    'sap/viz/ui5/DualStackedColumn',
    'sap/viz/ui5/DualStackedColumn100',
    'sap/viz/ui5/DualColumn',
    'sap/ui/thirdparty/jquery',
    './items_push'
], function (
    FlattenedDataset,
    JSONModel,
    Bar,
    Bubble,
    Line,
    Combination,
    Pie,
    Donut,
    Scatter,
    StackedColumn,
    StackedColumn100,
    Column,
    DualBar,
    DualLine,
    DualCombination,
    DualStackedColumn,
    DualStackedColumn100,
    DualColumn,
    jQuery
) {
    'use strict';
    var oChart, oDataset, oModel;
    function getChart(tag, key) {

        if (key == "wi_home_bar") {
            var BarModel = {
                data: [
                    { product: "Car", country: "China", year: "2001", profit: 25, revenue: 50 },
                    { product: "Truck", country: "China", year: "2001", profit: 136, revenue: 236 },
                    { product: "Motorcycle", country: "China", year: "2001", profit: 23, revenue: 43 },
                    { product: "Bicycle", country: "China", year: "2001", profit: 116, revenue: 126 },
                    { product: "Car", country: "USA", year: "2001", profit: 58, revenue: 158 },
                    { product: "Truck", country: "USA", year: "2001", profit: 128, revenue: 228 },
                    { product: "Motorcycle", country: "USA", year: "2001", profit: 43, revenue: 143 },
                    { product: "Bicycle", country: "USA", year: "2001", profit: 73, revenue: 183 },
                ]
            };
            var BarData = {
                dimensions: [
                    { axis: 1, name: 'Product', value: "{product}" },
                    { axis: 2, name: 'Country', value: "{country}" },
                    { axis: 2, name: 'Year', value: "{year}" }
                ],
                measures: [
                    { name: "Profit", value: "{profit}" },
                    { name: "Revenue", value: "{revenue}" },
                ],
                data: {
                    path: "/data"
                }
            };
            oDataset = new FlattenedDataset(BarData);
            oModel = new JSONModel(BarModel);
            oDataset.setModel(oModel);
            oChart = new Bar({
                width: "100%",
                height: "100%",
                dataset: oDataset
            });
        } else if (key == "wi_home_bubble") {
            var BubbleModel = {
                data: [
                    { region: 'Asia', company: 'FJ', revenue: 4.6, countrynum: 3, planenum: 18 },
                    { region: 'Asia', company: 'JL', revenue: 18.5, countrynum: 18, planenum: 98 },
                    { region: 'Asia', company: 'MU', revenue: 14.2, countrynum: 7, planenum: 30 },
                    { region: 'Asia', company: 'NG', revenue: 10.1, countrynum: 10, planenum: 46 },
                    { region: 'Asia', company: 'SQ', revenue: 21.3, countrynum: 15, planenum: 100 },
                    { region: 'Europe', company: 'AB', revenue: 13.5, countrynum: 12, planenum: 103 },
                    { region: 'Europe', company: 'AF', revenue: 10.1, countrynum: 16, planenum: 102 },
                    { region: 'Europe', company: 'AZ', revenue: 32.8, countrynum: 32, planenum: 150 },
                    { region: 'Europe', company: 'BA', revenue: 8.7, countrynum: 5, planenum: 73 },
                    { region: 'Europe', company: 'LH', revenue: 27.8, countrynum: 20, planenum: 100 },
                    { region: 'North America', company: 'AA', revenue: 20.3, countrynum: 21, planenum: 97 },
                    { region: 'North America', company: 'AC', revenue: 10.9, countrynum: 3, planenum: 20 },
                    { region: 'North America', company: 'DL', revenue: 13.2, countrynum: 18, planenum: 119 },
                    { region: 'North America', company: 'NW', revenue: 7.3, countrynum: 4, planenum: 30 },
                    { region: 'North America', company: 'UA', revenue: 22.1, countrynum: 21, planenum: 129 },
                    { region: 'Others', company: 'CO', revenue: 5.2, countrynum: 8, planenum: 60 },
                    { region: 'Others', company: 'MO', revenue: 7.6, countrynum: 2, planenum: 30 },
                    { region: 'Others', company: 'QF', revenue: 19, countrynum: 15, planenum: 98 },
                    { region: 'Others', company: 'SA', revenue: 2.5, countrynum: 3, planenum: 19 },
                ]
            };
            var BubbleData = {
                dimensions: [
                    { axis: 1, name: 'Region', value: "{region}" },
                    { axis: 1, name: 'Company', value: "{company}" },
                ],
                measures: [
                    { group: 1, name: "Revenue", value: "{revenue}" },
                    { group: 2, name: "Number of Countries", value: "{countrynum}" },
                    { group: 3, name: "Number of Planes", value: "{planenum}" },
                ],
                data: {
                    path: "/data"
                }
            };
            oDataset = new FlattenedDataset(BubbleData);
            oModel = new JSONModel(BubbleModel);
            oDataset.setModel(oModel);
            oChart = new Bubble({
                width: "100%",
                height: "100%",
                dataset: oDataset
            });
        } else if (key == "wi_home_line" || key == "wi_home_combi") {
            var LineModel = {
                data: [
                    { country: 'China', year: '2001', product: 'Car', profit: 25, revenue: 50 },
                    { country: 'China', year: '2002', product: 'Car', profit: 136, revenue: 272 },
                    { country: 'USA', year: '2001', product: 'Car', profit: 58, revenue: 116 },
                    { country: 'USA', year: '2002', product: 'Car', profit: 128, revenue: 256 },
                    { country: 'Canada', year: '2001', product: 'Car', profit: 58, revenue: 116 },
                    { country: 'Canada', year: '2002', product: 'Car', profit: 24, revenue: 48 },
                    { country: 'China', year: '2001', product: 'Truck', profit: 159, revenue: 300 },
                    { country: 'China', year: '2002', product: 'Truck', profit: 147, revenue: 247 },
                    { country: 'USA', year: '2001', product: 'Truck', profit: 149, revenue: 249 },
                    { country: 'USA', year: '2002', product: 'Truck', profit: 269, revenue: 369 },
                    { country: 'Canada', year: '2001', product: 'Truck', profit: 38, revenue: 68 },
                    { country: 'Canada', year: '2002', product: 'Truck', profit: 97, revenue: 197 },
                    { country: 'China', year: '2001', product: 'Motorcycle', profit: 129, revenue: 229 },
                    { country: 'China', year: '2002', product: 'Motorcycle', profit: 47, revenue: 147 },
                    { country: 'USA', year: '2001', product: 'Motorcycle', profit: 49, revenue: 149 },
                    { country: 'USA', year: '2002', product: 'Motorcycle', profit: 69, revenue: 169 },
                    { country: 'Canada', year: '2001', product: 'Motorcycle', profit: 33, revenue: 133 },
                    { country: 'Canada', year: '2002', product: 'Motorcycle', profit: 47, revenue: 147 },
                ]
            };
            var LineData = {
                dimensions: [
                    { axis: 1, name: 'Country', value: "{country}" },
                    { axis: 1, name: 'Year', value: "{year}" },
                    { axis: 2, name: 'Product', value: "{product}" },
                ],
                measures: [
                    { name: "Profit", value: "{profit}" },
                    { name: "Revenue", value: "{revenue}" },
                ],
                data: {
                    path: "/data"
                }
            };

            oDataset = new FlattenedDataset(LineData);
            oModel = new JSONModel(LineModel);
            oDataset.setModel(oModel);

            switch (key) {
                case 'wi_home_line':
                    oChart = new Line({
                        width: "100%",
                        height: "100%",
                        dataset: oDataset
                    });
                    break;
                case 'wi_home_combi':
                    oChart = new Combination({
                        width: "100%",
                        height: "100%",
                        dataset: oDataset
                    });
                    break;
            }
        } else if (key == "wi_home_pie" || key == "wi_home_donut") {
            var PieModel = {
                data: [
                    { country: 'China', year: '2001', profit: 25 },
                    { country: 'China', year: '2002', profit: 58 },
                    { country: 'USA', year: '2001', profit: 58 },
                    { country: 'USA', year: '2002', profit: 159 },
                    { country: 'Canada', year: '2001', profit: 149 },
                    { country: 'Canada', year: '2002', profit: 38 },
                ]
            };
            var PieData = {
                dimensions: [
                    { axis: 1, name: 'Country', value: "{country}" },
                    { axis: 1, name: 'Year', value: "{year}" },
                ],
                measures: [
                    { name: "Profit", value: "{profit}" },
                ],
                data: {
                    path: "/data"
                }
            };
            oDataset = new FlattenedDataset(PieData);
            oModel = new JSONModel(PieModel);
            oDataset.setModel(oModel);
            switch (key) {
                case 'wi_home_pie':
                    oChart = new Pie({
                        width: "100%",
                        height: "100%",
                        dataset: oDataset
                    });
                    break;
                case 'wi_home_donut':
                    oChart = new Donut({
                        width: "100%",
                        height: "100%",
                        dataset: oDataset
                    });
                    break;
            }
        } else if (key == "wi_home_scatter") {
            var ScatterModel = {
                data: [
                    { country: 'China', airline: '1', discount: 18.18, fullload: 3.15 },
                    { country: 'China', airline: '2', discount: 4.575, fullload: 28.095 },
                    { country: 'China', airline: '3', discount: 15.525, fullload: 49.17 },
                    { country: 'China', airline: '4', discount: 24.615, fullload: 45.315 },
                    { country: 'China', airline: '5', discount: 40.005, fullload: 45.45 },
                    { country: 'China', airline: '6', discount: 61.665, fullload: 45.765 },
                    { country: 'China', airline: '7', discount: 37.05, fullload: 55.125 },
                    { country: 'China', airline: '8', discount: 25.425, fullload: 57.72 },
                    { country: 'China', airline: '9', discount: 19.17, fullload: 57.81 },
                    { country: 'China', airline: '10', discount: 43.59, fullload: 50.625 },
                    { country: 'China', airline: '11', discount: 48.255, fullload: 51.06 },
                    { country: 'China', airline: '12', discount: 45, fullload: 53.085 },
                    { country: 'China', airline: '13', discount: 51.66, fullload: 52.98 },
                    { country: 'China', airline: '14', discount: 48.18, fullload: 52.11 },
                    { country: 'China', airline: '15', discount: 51.33, fullload: 51.015 },
                    { country: 'China', airline: '16', discount: 40.995, fullload: 55.695 },
                    { country: 'China', airline: '17', discount: 40.59, fullload: 56.055 },
                    { country: 'China', airline: '18', discount: 42.975, fullload: 58.65 },
                    { country: 'China', airline: '19', discount: 33.33, fullload: 54.15 },
                    { country: 'China', airline: '20', discount: 46.59, fullload: 51.72 },
                    { country: 'China', airline: '21', discount: 42.675, fullload: 54.15 },
                    { country: 'China', airline: '22', discount: 56.67, fullload: 55.95 },
                    { country: 'China', airline: '23', discount: 60, fullload: 59.01 },
                    { country: 'China', airline: '24', discount: 60, fullload: 18.54 },
                    { country: 'China', airline: '25', discount: 50.115, fullload: 53.205 },
                    { country: 'China', airline: '26', discount: 49.725, fullload: 56.97 },
                    { country: 'China', airline: '27', discount: 50.205, fullload: 29.1 },
                    { country: 'China', airline: '28', discount: 49.725, fullload: 57.825 },
                    { country: 'China', airline: '29', discount: 50.205, fullload: 33.33 },
                    { country: 'China', airline: '30', discount: 49.725, fullload: 19.755 },
                    { country: 'China', airline: '31', discount: 50.175, fullload: 53.175 },
                    { country: 'China', airline: '32', discount: 49.86, fullload: 56.67 },
                    { country: 'China', airline: '33', discount: 50.265, fullload: 36.9 },
                    { country: 'China', airline: '34', discount: 49.86, fullload: 58.935 },
                    { country: 'China', airline: '35', discount: 50.265, fullload: 44.775 },
                    { country: 'China', airline: '36', discount: 49.86, fullload: 14.58 },
                    { country: 'China', airline: '37', discount: 43.59, fullload: 50.295 },
                    { country: 'China', airline: '38', discount: 33.945, fullload: 50.67 },
                    { country: 'China', airline: '39', discount: 28.5, fullload: 50.46 },
                    { country: 'China', airline: '40', discount: 37.995, fullload: 48.63 },
                    { country: 'China', airline: '41', discount: 60, fullload: 46.71 },
                    { country: 'China', airline: '42', discount: 48.33, fullload: 35.76 },
                    { country: 'China', airline: '43', discount: 48.975, fullload: 47.97 },
                    { country: 'China', airline: '44', discount: 35.685, fullload: 58.38 },
                    { country: 'China', airline: '45', discount: 37.14, fullload: 53.175 },
                    { country: 'China', airline: '46', discount: 49.17, fullload: 45.45 },
                    { country: 'China', airline: '47', discount: 55.5, fullload: 42.27 },
                    { country: 'China', airline: '48', discount: 48.675, fullload: 49.17 },
                    { country: 'China', airline: '49', discount: 43.365, fullload: 51.915 },
                    { country: 'China', airline: '50', discount: 31.935, fullload: 51.9 },
                    { country: 'China', airline: '51', discount: 34.125, fullload: 53.295 },
                    { country: 'China', airline: '52', discount: 48.93, fullload: 50.67 },
                    { country: 'China', airline: '53', discount: 49.365, fullload: 53.145 },
                    { country: 'China', airline: '54', discount: 52.455, fullload: 50.85 },
                    { country: 'China', airline: '55', discount: 45.93, fullload: 46.455 },
                    { country: 'China', airline: '56', discount: 37.455, fullload: 53.445 },
                    { country: 'China', airline: '57', discount: 28.455, fullload: 53.31 },
                    { country: 'China', airline: '58', discount: 28.29, fullload: 59.4 },
                    { country: 'China', airline: '59', discount: 33.705, fullload: 55.98 },
                    { country: 'China', airline: '60', discount: 53.295, fullload: 50.775 },
                    { country: 'China', airline: '61', discount: 28.185, fullload: 57.675 },
                    { country: 'China', airline: '62', discount: 32.925, fullload: 56.415 },
                    { country: 'China', airline: '63', discount: 44.745, fullload: 50.31 },
                    { country: 'China', airline: '64', discount: 39.63, fullload: 51.09 },
                    { country: 'China', airline: '65', discount: 43.335, fullload: 48.285 },
                    { country: 'China', airline: '66', discount: 55.965, fullload: 45 },
                    { country: 'China', airline: '67', discount: 48.48, fullload: 50.925 },
                    { country: 'China', airline: '68', discount: 31.26, fullload: 56.835 },
                    { country: 'China', airline: '69', discount: 39.63, fullload: 54.585 },
                    { country: 'China', airline: '70', discount: 46.155, fullload: 53.895 },
                    { country: 'China', airline: '71', discount: 39.75, fullload: 38.115 },
                    { country: 'China', airline: '72', discount: 44.745, fullload: 56.265 },
                    { country: 'China', airline: '73', discount: 33.735, fullload: 57.63 },
                    { country: 'China', airline: '74', discount: 24.735, fullload: 59.805 },
                    { country: 'China', airline: '75', discount: 39.15, fullload: 56.775 },
                    { country: 'China', airline: '76', discount: 46.395, fullload: 53.895 },
                    { country: 'China', airline: '77', discount: 49.98, fullload: 53.505 },
                    { country: 'China', airline: '78', discount: 52.47, fullload: 54.3 },
                    { country: 'China', airline: '79', discount: 52.785, fullload: 53.175 },
                    { country: 'China', airline: '80', discount: 43.92, fullload: 52.95 },
                    { country: 'China', airline: '81', discount: 51.285, fullload: 52.215 },
                    { country: 'China', airline: '82', discount: 46.95, fullload: 51.99 },
                    { country: 'China', airline: '83', discount: 51.285, fullload: 52.215 },
                    { country: 'China', airline: '84', discount: 72.33, fullload: 49.92 },
                ]
            };
            var ScatterData = {
                dimensions: [
                    { axis: 1, name: 'Country', value: "{country}" },
                    { axis: 1, name: 'Airline', value: "{airline}" },
                ],
                measures: [
                    { group: 1, name: "Discount", value: "{discount}" },
                    { group: 2, name: "Full-load", value: "{fullload}" },
                ],
                data: {
                    path: "/data"
                }
            };
            oDataset = new FlattenedDataset(ScatterData);
            oModel = new JSONModel(ScatterModel);
            oDataset.setModel(oModel);
            oChart = new Scatter({
                width: "100%",
                height: "100%",
                dataset: oDataset
            });
        } else if (key == "wi_home_stvbar" || key == "wi_home_pstvbar" || key == 'wi_home_custstvbar') {
            var StackedColumnModel = {
                data: [
                    { product: "Car", country: "China", year: "2001", profit: 25, revenue: 50 },
                    { product: "Truck", country: "China", year: "2001", profit: 236, revenue: 86 },
                    { product: "Motorcycle", country: "China", year: "2001", profit: 23, revenue: 43 },
                    { product: "Bicycle", country: "China", year: "2001", profit: 116, revenue: 146 },
                    { product: "Car", country: "USA", year: "2001", profit: 58, revenue: 158 },
                    { product: "Truck", country: "USA", year: "2001", profit: 128, revenue: 88 },
                    { product: "Motorcycle", country: "USA", year: "2001", profit: 43, revenue: 143 },
                    { product: "Bicycle", country: "USA", year: "2001", profit: 73, revenue: 183 },
                ]
            };
            var StackedColumnData = {
                dimensions: [
                    { axis: 1, name: 'Product', value: "{product}" },
                    { axis: 2, name: 'Country', value: "{country}" },
                    { axis: 2, name: 'Year', value: "{year}" }
                ],
                measures: [
                    { name: "Profit", value: "{profit}" },
                    { name: "Revenue", value: "{revenue}" },
                ],
                data: {
                    path: "/data"
                }
            };
            oDataset = new FlattenedDataset(StackedColumnData);
            oModel = new JSONModel(StackedColumnModel);
            oDataset.setModel(oModel);
            switch (key) {
                case 'wi_home_stvbar':
                    oChart = new StackedColumn({
                        width: "100%",
                        height: "100%",
                        dataset: oDataset
                    });
                    break;
                case 'wi_home_pstvbar':
                    oChart = new StackedColumn100({
                        width: "100%",
                        height: "100%",
                        dataset: oDataset
                    });
                    break;
                case 'wi_home_custstvbar':
                    oChart = new StackedColumn({
                        width: "100%",
                        height: "100%",
                        dataset: oDataset
                    });
                    oChart.attachBeforeCreateViz(function (e) {
                        var usrOptions = e.getParameter("usrOptions");
                        // make the vertical stacked bar a horizontal stacked bar
                        usrOptions.type = "viz/stacked_bar";
                        // add a feeding definition to show MND
                        usrOptions.feeding = [{
                            "feedId": "axisLabels",
                            "binding": [{
                                "type": "measureNamesDimension"
                            }, {
                                "type": "analysisAxis",
                                "index": 1
                            }]
                        }, {
                            "feedId": "regionColor",
                            "binding": [{
                                "type": "analysisAxis",
                                "index": 2
                            }]
                        }, {
                            "feedId": "primaryValues",
                            "binding": [{
                                "type": "measureValuesGroup",
                                "index": 1
                            }]
                        }];

                    });
                    break;
            }
        } else if (key == "wi_home_column") {
            var ColumnModel = {
                data: [
                    { country: 'China', year: '2001', product: 'Car', profit: 25, revenue: 199, tax: 99 },
                    { country: 'China', year: '2002', product: 'Car', profit: 136, revenue: 136, tax: 36 },
                    { country: 'USA', year: '2001', product: 'Car', profit: 58, revenue: 58, tax: 8 },
                    { country: 'USA', year: '2002', product: 'Car', profit: 128, revenue: 128, tax: 28 },
                    { country: 'Canada', year: '2001', product: 'Car', profit: 58, revenue: 127, tax: 27 },
                    { country: 'Canada', year: '2002', product: 'Car', profit: 24, revenue: 97, tax: 7 },
                    { country: 'China', year: '2001', product: 'Truck', profit: 159, revenue: 25, tax: 5 },
                    { country: 'China', year: '2002', product: 'Truck', profit: 147, revenue: 269, tax: 69 },
                    { country: 'USA', year: '2001', product: 'Truck', profit: 149, revenue: 38, tax: 8 },
                    { country: 'USA', year: '2002', product: 'Truck', profit: 269, revenue: 58, tax: 8 },
                    { country: 'Canada', year: '2001', product: 'Truck', profit: 38, revenue: 149, tax: 9 },
                    { country: 'Canada', year: '2002', product: 'Truck', profit: 97, revenue: 24, tax: 4 },
                ]
            };
            var ColumnData = {
                dimensions: [
                    { axis: 1, name: 'Country', value: "{country}" },
                    { axis: 1, name: 'Year', value: "{year}" },
                    { axis: 2, name: 'Product', value: "{product}" },
                ],
                measures: [
                    { name: "Profit", value: "{profit}" },
                    { name: "Revenue", value: "{revenue}" },
                    { name: "Tax", value: "{tax}" },
                ],
                data: {
                    path: "/data"
                }
            };
            oDataset = new FlattenedDataset(ColumnData);
            oModel = new JSONModel(ColumnModel);
            oDataset.setModel(oModel);
            oChart = new Column({
                width: "100%",
                height: "100%",
                dataset: oDataset
            });
        } else if (key == "wi_home_dualbar") {
            var DualBarModel = {
                data: [
                    { product: "Car", country: "China", year: "2001", profit: 25, revenue: 50 },
                    { product: "Truck", country: "China", year: "2001", profit: 136, revenue: 236 },
                    { product: "Motorcycle", country: "China", year: "2001", profit: 23, revenue: 43 },
                    { product: "Bicycle", country: "China", year: "2001", profit: 116, revenue: 126 },
                    { product: "Car", country: "USA", year: "2001", profit: 58, revenue: 158 },
                    { product: "Truck", country: "USA", year: "2001", profit: 128, revenue: 228 },
                    { product: "Motorcycle", country: "USA", year: "2001", profit: 43, revenue: 143 },
                    { product: "Bicycle", country: "USA", year: "2001", profit: 73, revenue: 183 },
                ]
            };
            var DualBarData = {
                dimensions: [
                    { axis: 1, name: 'Product', value: "{product}" },
                    { axis: 2, name: 'Country', value: "{country}" },
                    { axis: 2, name: 'Year', value: "{year}" }
                ],
                measures: [
                    { group: 1, name: "Profit", value: "{profit}" },
                    { group: 2, name: "Revenue", value: "{revenue}" },
                ],
                data: {
                    path: "/data"
                }
            };
            oDataset = new FlattenedDataset(DualBarData);
            oModel = new JSONModel(DualBarModel);
            oDataset.setModel(oModel);
            oChart = new DualBar({
                width: "100%",
                height: "100%",
                dataset: oDataset
            });
        } else if (key == "wi_home_dualline" || key == "wi_home_dualcombination") {
            var DualLineModel = {
                data: [
                    { country: 'China', year: '2001', product: 'Car', profit: 25, revenue: 50 },
                    { country: 'China', year: '2002', product: 'Car', profit: 136, revenue: 272 },
                    { country: 'USA', year: '2001', product: 'Car', profit: 58, revenue: 116 },
                    { country: 'USA', year: '2002', product: 'Car', profit: 128, revenue: 256 },
                    { country: 'Canada', year: '2001', product: 'Car', profit: 58, revenue: 116 },
                    { country: 'Canada', year: '2002', product: 'Car', profit: 24, revenue: 48 },
                    { country: 'China', year: '2001', product: 'Truck', profit: 159, revenue: 300 },
                    { country: 'China', year: '2002', product: 'Truck', profit: 147, revenue: 247 },
                    { country: 'USA', year: '2001', product: 'Truck', profit: 149, revenue: 249 },
                    { country: 'USA', year: '2002', product: 'Truck', profit: 269, revenue: 369 },
                    { country: 'Canada', year: '2001', product: 'Truck', profit: 38, revenue: 68 },
                    { country: 'Canada', year: '2002', product: 'Truck', profit: 97, revenue: 197 },
                    { country: 'China', year: '2001', product: 'Motorcycle', profit: 129, revenue: 229 },
                    { country: 'China', year: '2002', product: 'Motorcycle', profit: 47, revenue: 147 },
                    { country: 'USA', year: '2001', product: 'Motorcycle', profit: 49, revenue: 149 },
                    { country: 'USA', year: '2002', product: 'Motorcycle', profit: 69, revenue: 169 },
                    { country: 'Canada', year: '2001', product: 'Motorcycle', profit: 33, revenue: 133 },
                    { country: 'Canada', year: '2002', product: 'Motorcycle', profit: 47, revenue: 147 },
                ]
            };
            var DualLineData = {
                dimensions: [
                    { axis: 1, name: 'Country', value: "{country}" },
                    { axis: 1, name: 'Year', value: "{year}" },
                    { axis: 2, name: 'Product', value: "{product}" },
                ],
                measures: [
                    { group: 1, name: "Profit", value: "{profit}" },
                    { group: 2, name: "Revenue", value: "{revenue}" },
                ],
                data: {
                    path: "/data"
                }
            };
            oDataset = new FlattenedDataset(DualLineData);
            oModel = new JSONModel(DualLineModel);
            oDataset.setModel(oModel);
            switch (key) {
                case 'wi_home_dualline':
                    oChart = new DualLine({
                        width: "100%",
                        height: "100%",
                        dataset: oDataset
                    });
                    break;
                case 'wi_home_dualcombination':
                    oChart = new DualCombination({
                        width: "100%",
                        height: "100%",
                        dataset: oDataset
                    });
                    break;
            }
        } else if (key == "wi_home_dualstvbar" || key == "wi_home_dualpstvbar") {
            var DualStackedColumnModel = {
                data: [
                    { product: "Car", country: "China", year: "2001", profit: 25, revenue: 50, cost: 25 },
                    { product: "Truck", country: "China", year: "2001", profit: 236, revenue: 86, cost: 236 },
                    { product: "Motorcycle", country: "China", year: "2001", profit: 23, revenue: 43, cost: 23 },
                    { product: "Bicycle", country: "China", year: "2001", profit: 116, revenue: 146, cost: 116 },
                    { product: "Car", country: "USA", year: "2001", profit: 58, revenue: 158, cost: 58 },
                    { product: "Truck", country: "USA", year: "2001", profit: 128, revenue: 88, cost: 128 },
                    { product: "Motorcycle", country: "USA", year: "2001", profit: 43, revenue: 143, cost: 43 },
                    { product: "Bicycle", country: "USA", year: "2001", profit: 73, revenue: 183, cost: 73 },
                ]
            };
            var DualStackedColumnData = {
                dimensions: [
                    { axis: 1, name: 'Product', value: "{product}" },
                    { axis: 2, name: 'Country', value: "{country}" },
                    { axis: 2, name: 'Year', value: "{year}" }
                ],
                measures: [
                    { group: 1, name: "Profit", value: "{profit}" },
                    { group: 1, name: "Revenue", value: "{revenue}" },
                    { group: 2, name: "Cost", value: "{cost}" },
                ],
                data: {
                    path: "/data"
                }
            };
            oDataset = new FlattenedDataset(DualStackedColumnData);
            oModel = new JSONModel(DualStackedColumnModel);
            oDataset.setModel(oModel);
            switch (key) {
                case 'wi_home_dualstvbar':
                    oChart = new DualStackedColumn({
                        width: "100%",
                        height: "100%",
                        dataset: oDataset
                    });
                    break;
                case 'wi_home_dualpstvbar':
                    oChart = new DualStackedColumn100({
                        width: "100%",
                        height: "100%",
                        dataset: oDataset
                    });
                    break;
            }
        } else if (key == "wi_home_dualvbar") {
            var DualColumnModel = {
                data: [
                    { country: 'China', year: '2001', product: 'Car', profit: 25, revenue: 199, tax: 99 },
                    { country: 'China', year: '2002', product: 'Car', profit: 136, revenue: 136, tax: 36 },
                    { country: 'USA', year: '2001', product: 'Car', profit: 58, revenue: 58, tax: 8 },
                    { country: 'USA', year: '2002', product: 'Car', profit: 128, revenue: 128, tax: 28 },
                    { country: 'Canada', year: '2001', product: 'Car', profit: 58, revenue: 127, tax: 27 },
                    { country: 'Canada', year: '2002', product: 'Car', profit: 24, revenue: 97, tax: 7 },
                    { country: 'China', year: '2001', product: 'Truck', profit: 159, revenue: 25, tax: 5 },
                    { country: 'China', year: '2002', product: 'Truck', profit: 147, revenue: 269, tax: 69 },
                    { country: 'USA', year: '2001', product: 'Truck', profit: 149, revenue: 38, tax: 8 },
                    { country: 'USA', year: '2002', product: 'Truck', profit: 269, revenue: 58, tax: 8 },
                    { country: 'Canada', year: '2001', product: 'Truck', profit: 38, revenue: 149, tax: 9 },
                    { country: 'Canada', year: '2002', product: 'Truck', profit: 97, revenue: 24, tax: 4 },
                ]
            };
            var DualColumnData = {
                dimensions: [
                    { axis: 1, name: 'Country', value: "{country}" },
                    { axis: 1, name: 'Year', value: "{year}" },
                    { axis: 2, name: 'Product', value: "{product}" },
                ],
                measures: [
                    { group: 1, name: "Profit", value: "{profit}" },
                    { group: 1, name: "Revenue", value: "{revenue}" },
                    { group: 2, name: "Tax", value: "{tax}" },
                ],
                data: {
                    path: "/data"
                }
            };
            oDataset = new FlattenedDataset(DualColumnData);
            oModel = new JSONModel(DualColumnModel);
            oDataset.setModel(oModel);
            oChart = new DualColumn({
                width: "100%",
                height: "100%",
                dataset: oDataset
            });
        }
        //return oChart;
        oChart.placeAt(tag);
    }

    //listen for a click event on a chart element
    const clickElements = [
        {
            name: 'bar',
            tag: 'showChart_bar',
            str: 'wi_home_bar'
        },
        {
            name: 'column',
            tag: 'showChart_bar',
            str: 'wi_home_column'
        },
        {
            name: 'dual_column',
            tag: 'showChart_bar',
            str: 'wi_home_dualvbar'
        },
        {
            name: 'dual_bar',
            tag: 'showChart_bar',
            str: 'wi_home_dualbar'
        },
        {
            name: 'stacked_column',
            tag: 'showChart_bar',
            str: 'wi_home_stvbar'
        },
        {
            name: 'dual_stacked_column',
            tag: 'showChart_bar',
            str: 'wi_home_dualstvbar'
        },
        {
            name: '100_stacked_column',
            tag: 'showChart_bar',
            str: 'wi_home_pstvbar'
        },
        {
            name: '100_dual_stacked_column',
            tag: 'showChart_bar',
            str: 'wi_home_dualpstvbar'
        },
        {
            name: 'line',
            tag: 'showChart_line',
            str: 'wi_home_line'
        },
        {
            name: 'dual_line',
            tag: 'showChart_line',
            str: 'wi_home_dualline'
        },
        {
            name: 'combination',
            tag: 'showChart_combination',
            str: 'wi_home_combi'
        },
        {
            name: 'dual_combination',
            tag: 'showChart_combination',
            str: 'wi_home_combi'
        },
        {
            name: 'pie',
            tag: 'showChart_pie',
            str: 'wi_home_pie'
        },
        {
            name: 'donut',
            tag: 'showChart_pie',
            str: 'wi_home_donut'
        },
        {
            name: 'scatter',
            tag: 'showChart_scatter',
            str: 'wi_home_scatter'
        },
        {
            name: 'bubble',
            tag: 'showChart_scatter',
            str: 'wi_home_bubble'
        }
    ];
    clickElements.forEach((el) => {
        jQuery(`#${el.name}`).on('click', function () {
            showChart(el.tag, el.str)
        })
    })

    function showChart(tag, str) {
        if (oChart) {
            oChart.destroy();
        }

        jQuery('.showChart').css('display', 'none');

        var item = '#' + tag;
        jQuery(item).empty();
        jQuery(item).css('display', 'inline-block');

        jQuery(item).css('height', '300px');
        //jQuery(item).css('width','90%');
        getChart(tag, str);
        jQuery(item).slideDown('slow');
    }

});



