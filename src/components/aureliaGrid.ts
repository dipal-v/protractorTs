import { GridApi, GridOptions } from 'ag-grid';
import { Router } from 'aurelia-router';
import { Constants } from '../constants';

/**
 * Aurelia Grid common component
 * @export
 * @class AureliaGrid
 */
export class AureliaGrid {
    /**
     * Grid options
     */
    public gridOptions: GridOptions;

    /**
     * Grid Api
     */
    public gridApi: GridApi;

    public data;

    /**
     * Creates an instance of AureliaGrid.
     * @memberof AureliaGrid
     */
    constructor() {
        this.gridOptions = {} as GridOptions;
        this.gridOptions.pagination = true;
        this.gridOptions.rowHeight = 30;
        this.gridOptions.headerHeight = 40;
        this.gridOptions.paginationPageSize = 25;
        this.gridOptions.suppressPaginationPanel = true;
        this.gridOptions.enableSorting = true;
        this.gridOptions.enableFilter = true;
        this.gridOptions.sortingOrder = ['desc', 'asc', null];
        this.gridOptions.rowData = [];
    }

    /**
     * Cell click without navigation
     * @memberof AureliaGrid
     */
    public addCellClickWithoutRouter() {
        this.gridOptions.onGridReady = () => {
            this.gridApi = this.gridOptions.api;
            this.gridApi.sizeColumnsToFit();
        };
    }

    /**
     * Cell click with navigation
     * @param {Router} router
     * @param {any} route
     * @param {any} routeObj
     * @memberof AureliaGrid
     */
    public addCellClickWithRouter(router: Router, route, routeObj) {
        this.gridOptions.onGridReady = () => {
            this.gridApi = this.gridOptions.api;
            this.gridApi.sizeColumnsToFit();
            this.gridApi.addEventListener('cellClicked', (event) => {
                this.onNameClicked(router, event, route, routeObj);
            });
        };
    }

    /**
     * View an entity
     * @param event
     */
    public onNameClicked(router, event, routeOptions, routeObj) {
        if (event.column.colId === routeObj) {
            const route = routeOptions[event.data[Constants.TYPE]];
            router.navigateToRoute(route, { id: event.data[routeObj] });
        }
    }

    public setRowData(data) {
        if (typeof this.gridOptions.api !== Constants.UNDEFINED && this.gridOptions.api !== null) {
            this.gridOptions.api.setRowData(data);
        } else {
            this.gridOptions.rowData = data;
        }
        this.data = data;
    }

    public setPageSize(pageSize: number) {
        this.gridOptions.paginationPageSize = pageSize;
    }
}
