import { inject } from 'aurelia-framework';
import * as _ from 'underscore';
import { Constants } from '../constants';
import { Entity } from '../models/entity';
import { SearchParam } from '../pages/entity/search-param';
import { LegalEntityApi } from '../services/legalEntityApi';
import { ServiceConfig } from '../services/serviceConfig';

/**
 * Entity API call class
 */
@inject(LegalEntityApi, ServiceConfig)
export class EntityService {
    /**
     * API call end point
     */
    private endPoint: string;
    private pageSize: number;
    private currentPage: number;

    /**
     * Entity Service constructor
     * @param api
     */
    constructor(private legalEntityApi: LegalEntityApi, private serviceConfig: ServiceConfig) {
        this.endPoint = this.serviceConfig.legalEntityEndPoint;
    }

    /**
     * Search Entity API
     * @param field
     * @param value
     */
    public search(key, value): Promise<Entity[]> {
        return new Promise((resolve, reject) => {
            let values;
            let searchParams;
            const template = _.template(this.serviceConfig.searchParamsTemplateString);
            values = { key, value };
            searchParams = template(values);

            this.legalEntityApi.get(`${this.endPoint}?${searchParams}&partialMatch`)
                .then((entities) => {
                    resolve(Array.from((entities), (e) => new Entity(e)));
                })
                .catch((error) => reject(error));
        });
    }

    /**
     * Search Entity API
     * @param searchOptionList a list of SearchParam objects
     */
    public async advancedSearch(searchOptionList: SearchParam[]): Promise<Entity[]> {
        let values;
        const searchParams = [];
        let containRegex = false;
        const template = _.template(this.serviceConfig.searchParamsTemplateString);
        searchOptionList.forEach((searchParam) => {
            if (searchParam.isRegex) {
                const encodedValue = encodeURIComponent(searchParam.value);

                values = { key: searchParam.field, value: encodedValue };
                searchParams.push(template(values));
                containRegex = true;
            } else {
                values = { key: searchParam.field, value: searchParam.value };
                searchParams.push(template(values));
            }
        });
        let searchQuery = searchParams.join('&');
        if (!containRegex) {
            searchQuery = searchQuery + '&partialMatch';
        }
        const entities = await this.legalEntityApi.get(
            `${this.endPoint}?${searchQuery}&page=${this.currentPage}&pageSize=${this.pageSize}`);
        return Array.from((entities), (e) => new Entity(e));
    }

    public async pageCount(searchOptionList: SearchParam[]): Promise<number> {
        let values;
        const searchParams = [];
        let containRegex = false;
        const template = _.template(this.serviceConfig.searchParamsTemplateString);
        searchOptionList.forEach((searchParam) => {
            if (searchParam.isRegex) {
                const encodedValue = encodeURIComponent(searchParam.value);

                values = { key: searchParam.field, value: encodedValue };
                searchParams.push(template(values));
                containRegex = true;
            } else {
                values = { key: searchParam.field, value: searchParam.value };
                searchParams.push(template(values));
            }
        });
        let searchQuery = searchParams.join('&');
        if (!containRegex) {
            searchQuery = searchQuery + '&partialMatch';
        }
        const count = await this.legalEntityApi.get(`${this.endPoint}?${searchQuery}&pageCount`);
        return count[Constants.PAGES_STR];
    }

    /**
     * Get All Entities
     */
    public getAll(): Promise<Entity[]> {
        return new Promise((resolve, reject) => {
            this.legalEntityApi.get(this.endPoint)
                .then((entities) => {
                    resolve(Array.from((entities), (e) => new Entity(e)));
                })
                .catch((error) => reject(error));
        });
    }

    /**
     * Get the Entity by Id
     * @param id
     */
    public getById(id: string): Promise<Entity> {
        return new Promise((resolve, reject) => {
            this.legalEntityApi.get(`${this.endPoint}/${id}`)
                .then((entity) => {
                    resolve(new Entity(entity));
                })
                .catch((error) => reject(error));
        });
    }

    /**
     * Save the entity
     * @param entity
     */
    public save(entity: Entity): Promise<Entity> {
        return new Promise((resolve, reject) => {
            this.legalEntityApi.post(this.endPoint, entity)
                .then((entityResponse) => resolve(new Entity(entityResponse)))
                .catch((error) => reject(error));
        });
    }

    /**
     * Update the entity
     * @param entity
     */
    public update(entity: {}): Promise<Entity> {
        return new Promise((resolve, reject) => {
            const legalEntityCode = entity[Constants.LEGAL_ENTITY_CODE];
            const patchBody = JSON.parse(JSON.stringify(entity));
            delete patchBody.legalEntityCode;
            this.legalEntityApi.patch(`${this.endPoint}/${legalEntityCode}`, patchBody)
                .then((entityResponse) => resolve(new Entity(entityResponse)))
                .catch((error) => reject(error));
        });
    }

    public setPageSize(size: number) {
        this.pageSize = size;
    }

    public setCurrentPage(page: number) {
        this.currentPage = page - 1;
    }

}
