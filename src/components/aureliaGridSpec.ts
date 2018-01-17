import { AureliaGrid } from './aureliaGrid';

describe('aurelia grid component', () => {
    let aureliaGrid;

    beforeEach(() => {
        aureliaGrid = new AureliaGrid();
    });

    it('aurelia grid with out router', () => {
        aureliaGrid.addCellClickWithoutRouter();
        expect(aureliaGrid.gridOptions.pagination).toBeTruthy();
    });

    it('aurelia grid with router', () => {
        const router = jest.fn();
        aureliaGrid.addCellClickWithRouter(router, 'view', 'legalEntityCode');
        expect(aureliaGrid.gridOptions.pagination).toBeTruthy();
    });

    it('name click route', () => {
        const router = jest.fn();
        router.navigateToRoute = jest.fn();
        const event = jest.fn();
        event.column = {};
        event.data = {};
        event.data.legalEntityCode = 'test';
        event.column.colId = 'legalEntityCode';
        aureliaGrid.onNameClicked(router, event, 'view', 'legalEntityCode');
    });

    it('not name click route', () => {
        const router = jest.fn();
        const event = jest.fn();
        event.column = {};
        event.data = {};
        event.data.legalEntityCode = 'test';
        event.column.colId = 'legalEntityCodes';
        aureliaGrid.onNameClicked(router, event, 'view', 'legalEntityCode');
    });

    it('check set row data', () => {
        const data = { id: 1 };
        aureliaGrid.setRowData(data);
        expect(aureliaGrid.gridOptions.rowData.id).toBe(data.id);
        aureliaGrid.gridOptions.api = undefined;
        aureliaGrid.setRowData(data);
        expect(aureliaGrid.gridOptions.rowData.id).toBe(data.id);
        aureliaGrid.gridOptions.api = null;
        aureliaGrid.setRowData(data);
        expect(aureliaGrid.gridOptions.rowData.id).toBe(data.id);
    });

    it('check set page size', () => {
        aureliaGrid.setPageSize(5);
        expect(aureliaGrid.gridOptions.paginationPageSize).toBe(5);
    });
});
