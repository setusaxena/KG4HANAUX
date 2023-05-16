sap.ui.define([
	"sap/base/Log",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/format/DateFormat",
	"sap/m/ToolbarSpacer",
	"sap/ui/thirdparty/jquery",
	"sap/ui/core/date/UI5Date"
], function (Log, Controller, JSONModel, Filter, FilterOperator, DateFormat, ToolbarSpacer, jQuery, UI5Date) {
	"use strict";

	return Controller.extend("com.kg4hana.NavigationUI.controller.Home", {
		onInit: function () {
			this._oGlobalFilter = null;
			this._oPriceFilter = null;
			this._associationFilter = null;
		},
		onAfterRendering: function () {

			var jsonModelCDS = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("com/kg4hana/NavigationUI/model/cdsData.json"));
			//var jsonModel = new sap.ui.model.json.JSONModel(oData);
			this.getView().byId("table").setModel(jsonModelCDS);

			var jsomModelGraph = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("com/kg4hana/NavigationUI/model/cdsGraph.json"));
			this.getView().byId("pageGraph").setModel(jsomModelGraph);

			var jsomModelGraphEmp = new sap.ui.model.json.JSONModel(sap.ui.require.toUrl("com/kg4hana/NavigationUI/model/cdsGraph.json"));
			this.getView().byId("pageGraphEmp").setModel(jsomModelGraphEmp);

		},
		navigateToGraph: function (oEvent) {
			var app = this.getView().byId("app");
			var pageGraph = this.getView().byId("pageGraph");
			app.to(pageGraph);
		},

		navigateToGraphEmp: function (oEvent) {
			var app = this.getView().byId("app");
			var pageGraph = this.getView().byId("pageGraphEmp");
			app.to(pageGraph);
		},

		backToHome: function () {
			var app = this.getView().byId("app");
			app.back();
		},
		_filter: function () {
			var oFilter = null;

			if (this._oGlobalFilter && this._associationFilter) {
				oFilter = new Filter([this._oGlobalFilter, this._associationFilter], true);
			} else if (this._oGlobalFilter) {
				oFilter = this._oGlobalFilter;
			} else if (this._associationFilter) {
				oFilter = this._associationFilter;
			}

			this.byId("table").getBinding().filter(oFilter, "Application");
		},

		pressIncludeAssociation: function (oEvent) {
			var checkBox = oEvent.getSource();
			if (checkBox && checkBox.getSelected && (checkBox.getSelected() !== true)) {
				this._associationFilter = new Filter("isAssociation", FilterOperator.Contains, " "); 
			}
			else{
				this._associationFilter = null;
			}
			this._filter();
		},

		filterGlobally: function (oEvent) {
			var sQuery = oEvent.getParameter("query");
			this._oGlobalFilter = null;

			if (sQuery) {
				this._oGlobalFilter = new Filter([
					new Filter("Name", FilterOperator.Contains, sQuery),
					new Filter("Category", FilterOperator.Contains, sQuery)
				], false);
			}

			this._filter();
		},

		filterPrice: function (oEvent) {
			var oColumn = oEvent.getParameter("column");
			if (oColumn != this.byId("price")) {
				return;
			}

			oEvent.preventDefault();

			var sValue = oEvent.getParameter("value");

			function clear() {
				this._oPriceFilter = null;
				oColumn.setFiltered(false);
				this._filter();
			}

			if (!sValue) {
				clear.apply(this);
				return;
			}

			var fValue = null;
			try {
				fValue = parseFloat(sValue, 10);
			} catch (e) {
				// nothing
			}

			if (!isNaN(fValue)) {
				this._oPriceFilter = new Filter("Price", FilterOperator.BT, fValue - 20, fValue + 20);
				oColumn.setFiltered(true);
				this._filter();
			} else {
				clear.apply(this);
			}
		},

		clearAllFilters: function (oEvent) {
			var oTable = this.byId("table");

			var oUiModel = this.getView().getModel("ui");
			oUiModel.setProperty("/globalFilter", "");
			oUiModel.setProperty("/availabilityFilterOn", false);

			this._oGlobalFilter = null;
			this._oPriceFilter = null;
			this._filter();

			var aColumns = oTable.getColumns();
			for (var i = 0; i < aColumns.length; i++) {
				oTable.filter(aColumns[i], null);
			}
		},

		toggleAvailabilityFilter: function (oEvent) {
			this.byId("availability").filter(oEvent.getParameter("pressed") ? "X" : "");
		},

		formatAvailableToObjectState: function (bAvailable) {
			return bAvailable ? "Success" : "Error";
		}
	});
});