import { EventAggregator } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Router } from 'aurelia-router';
import * as _ from 'underscore';
import { AureliaGrid } from '../../components/aureliaGrid';
import { Constants } from '../../constants';
import { EntityService } from '../../services/entityService';
import { Messenger } from '../../services/messenger';
import { SearchField } from '../entity/search-field';
import { SearchParam } from '../entity/search-param';

/**
 * Entities class
 */
@inject(EventAggregator, EntityService, Messenger, Router, I18N)
export abstract class ListBase {
    protected entitiesGird: AureliaGrid;

    protected searchFields: SearchField[];

    protected searchField: string;

    protected searchValue: string;

    protected searched: boolean;

    protected isRegexSearch = false;

    protected abstract entityType: string;

    private currentPage: number;
    private totalPages: number;
    private pageSize: number;

    constructor(
        protected ea: EventAggregator,
        protected entityService: EntityService,
        protected messenger: Messenger,
        protected router: Router,
        protected i18n: I18N) {
        this.entitiesGird = new AureliaGrid();
        this.entitiesGird.gridOptions.suppressPaginationPanel = true;
        const routeOptions = { Organisation: Constants.VIEW_ORGANISATION, Person: Constants.VIEW_PERSON };
        this.entitiesGird.addCellClickWithRouter(router, routeOptions, 'legalEntityCode');
        this.setDefaultSearchValues();
        this.currentPage = 1;
        this.entityService.setCurrentPage(this.currentPage);
        this.pageSize = Constants.DEFAULT_PAGE_SIZE;
        this.entityService.setPageSize(this.pageSize);
    }

    public async attached() {
        await this.doSearch();
    }

    public async nextPage(event) {
        this.currentPage++;
        await this.doSearch();
    }

    public async prevPage(event) {
        if (this.currentPage > 0) {
            this.currentPage--;
            await this.doSearch();
        }
    }

    public async lastPage(event) {
        this.currentPage = this.totalPages;
        await this.doSearch();
    }

    public async firstPage(event) {
        this.currentPage = 1;
        await this.doSearch();
    }

    /**
     * Do the actual search
     */
    public async doSearch() {
        this.searched = true;
        try {
            const searchOptionList = new Array<SearchParam>();
            searchOptionList.push(new SearchParam('type', this.entityType, false));
            if (this.searchValue !== '') {
                searchOptionList.push(new SearchParam(
                    this.searchField, this.searchValue, this.isRegexSearch));
            }
            this.entityService.setCurrentPage(this.currentPage);
            this.totalPages = await this.entityService.pageCount(searchOptionList);
            const result = await this.entityService.advancedSearch(searchOptionList);
            this.entitiesGird.setRowData(result);
        } catch (error) {
            this.messenger.error(error);
        }
    }

    public async doSearchReset() {
        this.setDefaultSearchValues();
        await this.doSearch();
    }

    public setDefaultSearchValues() {
        this.searchFields = Constants.DEFAULT_SEARCH_FIELDS;
        this.searchField = Constants.DEFAULT_SEARCH_FIELDS[0].searchTerm;
        this.searchValue = '';
        this.searched = false;
    }

    public async getAllEntitiesBy(entityType: string) {
        try {
            const data = await this.entityService.search(Constants.TYPE, entityType);
            this.entitiesGird.setRowData(data);
        } catch (error) {
            this.messenger.error(error);
        }
    }
}
