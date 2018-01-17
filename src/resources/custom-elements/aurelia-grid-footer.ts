import { bindable, customAttribute, customElement, inject } from 'aurelia-framework';
import { DOM } from 'aurelia-pal';
import {AureliaGrid} from '../../components/aureliaGrid';
import { Constants } from '../../constants';

/**
 * The switch button
 */
@customElement('aurelia-grid-footer')
@bindable('grid')
export class AureliaGridFooter {
    private pageSize: number;
    private currentPage: number;
    private totalPages: number;

    public constructor(private grid: AureliaGrid) {
    }

    public attached() {
        this.pageSize = this.grid.gridOptions.paginationPageSize;
        this.setCurrentPage();
    }

    public setCurrentPage() {
        this.currentPage = this.grid.gridOptions.api.paginationGetCurrentPage();
        this.totalPages = this.grid.gridOptions.api.paginationGetTotalPages();
        if (this.totalPages > 0) {
            this.currentPage++;
        }
    }

    public firstPage() {
        this.grid.gridOptions.api.paginationGoToFirstPage();
        this.setCurrentPage();
    }

    public prevPage() {
        this.grid.gridOptions.api.paginationGoToPreviousPage();
        this.setCurrentPage();
    }

    public nextPage() {
        this.grid.gridOptions.api.paginationGoToNextPage();
        this.setCurrentPage();
    }

    public lastPage() {
        this.grid.gridOptions.api.paginationGoToLastPage();
        this.setCurrentPage();
    }

}
