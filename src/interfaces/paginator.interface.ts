export class IPaginator {
    length: number | undefined;
    pageSize: number | undefined;
    pageSizeOptions: Array<number>;
    pageIndex: number | undefined;
    filter: any;
    sort: ISort | undefined;
    queryIndex: string | undefined;
    exactFilter: any;

    constructor() {
        this.pageSizeOptions = [];
    }
}

export class ISort {
    field: string | undefined;
    way: string | undefined;
}
