import { GridApi, GridOptions } from 'ag-grid';
import { Container } from 'aurelia-dependency-injection';
import { AureliaGrid } from '../../components/aureliaGrid';
import { AureliaGridFooter } from './aurelia-grid-footer';

describe('aurelia grid footer', () => {
    let footer;
    let grid;
    const data = [
        { id: 1 },
        { id: 2 },
        { id: 3 }
    ];

    beforeEach(() => {
        grid = new AureliaGrid();
        grid.setRowData(data);
        grid.setPageSize(1);
        grid.gridOptions.api = jest.fn();
        grid.gridOptions.api.paginationGetCurrentPage = jest.fn();
        grid.gridOptions.api.paginationGetTotalPages = jest.fn();
        grid.gridOptions.api.paginationGoToFirstPage = jest.fn();
        grid.gridOptions.api.paginationGoToPreviousPage = jest.fn();
        grid.gridOptions.api.paginationGoToNextPage = jest.fn();
        grid.gridOptions.api.paginationGoToLastPage = jest.fn();
        footer = new AureliaGridFooter(grid);
        footer.attached();
        grid.gridOptions.api.paginationGetTotalPages.mockReturnValueOnce(3);
    });

    it('should trigger next page event', () => {
        grid.gridOptions.api.paginationGetCurrentPage.mockReturnValueOnce(1);
        footer.nextPage();
        expect(footer.currentPage).toBe(2);
    });

    it('should trigger previous page event', () => {
        grid.gridOptions.api.paginationGetCurrentPage.mockReturnValueOnce(0);
        footer.prevPage();
        expect(footer.currentPage).toBe(1);
    });

    it('should trigger last page event', () => {
        grid.gridOptions.api.paginationGetCurrentPage.mockReturnValueOnce(2);
        footer.lastPage();
        expect(footer.currentPage).toBe(3);
    });

    it('should trigger first page event', () => {
        grid.gridOptions.api.paginationGetCurrentPage.mockReturnValueOnce(0);
        footer.firstPage();
        expect(footer.currentPage).toBe(1);
    });
});
