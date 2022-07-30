import {
  Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef
} from '@angular/core';


export type FilterType =
  'none' |
  'match' |
  'contains' |
  'choice';

export interface ColumnFilterDef {
  type: FilterType,
}

export interface SmartTableFilter {
  columnName: string,
  filterType: FilterType,
  filterArg1?: any;
}

export interface SmartTableCellContext {
  columnDef: SmartTableColumnOptions,
  dataItem: any,
}

export interface SmartTableColumnOptions {
  columnName: string,
  filter: ColumnFilterDef,
  searchable?: boolean,
  isReference?: boolean,
  type?: string,
  templateRef?: TemplateRef<SmartTableCellContext>,
  cssClass?: string,
  orderIndex?: number
}

export const ValueTypes = [
  'boolean',
  'number',
  'string',
]

export const RefTypes = [
  'function',
  'array',
  'object',
]

export interface SmartTableOptions {
  columnDefs?: SmartTableColumnOptions[],
  hideHeader?: boolean
}

export function BuildTableOptions(
  item: any,
  hideHeader: boolean = false,
  columnVisibilityOverrides: { [columnName in string]:  'hidden' | 'visible' } = {},
  columnCssOverrides: { [columnName in string]:  string } = {},
  columnOrderIndexOverrides: { [columnName in string]:  number } = {},
  columnFilterOverrides: { [columnName in string]:  ColumnFilterDef } = {}) : SmartTableOptions {
  if (item) {
    const props = Object.getOwnPropertyNames(item)
      .filter(p => columnVisibilityOverrides[p] != 'hidden');
    const columns = props.map<SmartTableColumnOptions>((prop) => {
      const itemValue = item[prop];
      const searchable = itemValue != null && ValueTypes.includes(typeof(itemValue));
      const reference = itemValue == null || RefTypes.includes(typeof(itemValue))
      return {
        columnName: prop,
        filter: columnFilterOverrides[prop] ?? {
          type: "contains",
        },
        searchable: searchable,
        isReference: reference,
        type: Array.isArray(itemValue) ? 'array' : typeof itemValue,
        cssClass: columnCssOverrides[prop],
        orderIndex: columnOrderIndexOverrides[prop]
      }
    })
      .sort((a, b) => {
        if (!a.orderIndex && !b.orderIndex) return 0;
        if (!a.orderIndex) return 1;
        if (!b.orderIndex) return -1;
        return a.orderIndex - b.orderIndex;
      });
    return {
      columnDefs: columns,
      hideHeader: hideHeader,
    };
  }
  throw new Error("Cannot build smart table options, the source argument 'item' is NULL.");
}


@Component({
  selector: 'app-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.sass']
})
export class SmartTableComponent implements OnInit, OnChanges {

  @Input() items: any[] = []
  @Input() options?: SmartTableOptions;
  @Input() columnTemplateOverrides: { [columnName in string]: TemplateRef<SmartTableCellContext>} = {};
  @Input() columnVisibilityOverrides: { [columnName in string]:  'hidden' | 'visible' } = {};
  @Input() columnLabelOverrides: { [columnName in string]:  string } = {};
  @Input() columnCssOverrides: { [columnName in string]:  string } = {};
  @Input() columnOrderIndexOverrides: { [columnName in string]:  number } = {};
  @Input() columnFilterOverrides: { [columnName in string]:  ColumnFilterDef } = {};

  filteredItems: any[] = [];
  filterTimeout?: number;
  displayItems: any[] = [];
  displayOptions: SmartTableOptions = {
    columnDefs: [],
    hideHeader: false
  };
  pageIndex = 1;
  pageSize = 10;
  readonly pageSizeChoices = [ 10, 25, 50, 100 ];
  readonly activeFilters: SmartTableFilter[] = [];

  constructor(
  ) { }

  ngOnInit(): void {
    this.rebuildTable(this.items);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.rebuildTable(changes['items'].currentValue);
    }
  }


  changePageSize(event: any): void {
    this.pageSize = parseInt(event.target.value);
    this.rebuildCurrentPage();
  }

  changePageIndex(_: number): void {
    this.rebuildCurrentPage();
  }

  getColumnHeader(columnName: string): string {
    return this.columnLabelOverrides[columnName] ?? columnName;
  }

  containsSearchOnKeyUp(columnDef: SmartTableColumnOptions, event: any): void {
    const columnName = columnDef.columnName;
    const filterArg = event?.target.value.trim().toLowerCase();
    const existingFilterIndex = this.activeFilters.findIndex(
      f => f.columnName === columnName && f.filterType === 'contains');
    if (filterArg && filterArg.length) {
      if (existingFilterIndex === -1) {
        this.activeFilters.push({
          columnName: columnName,
          filterType: 'contains',
          filterArg1: filterArg,
        });
      }
      else {
        this.activeFilters[existingFilterIndex].filterArg1 = filterArg;
      }
    }
    else if (existingFilterIndex >= 0) {
      this.activeFilters.splice(existingFilterIndex, 1);
    }

    clearTimeout(this.filterTimeout);
    this.filterTimeout = setTimeout(() => {
      this.rebuildFilteredItems();
      this.rebuildCurrentPage();
    }, 500);
  }

  protected rebuildFilteredItems(): void {
    const numberOfFilters = this.activeFilters.length;
    if (numberOfFilters && this.items.length) {
      let filterResults: any[] = [];
      this.items.forEach(item => {
        for (let index = 0; index < numberOfFilters; index++) {
          const filter = this.activeFilters[index];
          const match = this.matcherContains(item, filter.columnName, filter.filterArg1);
          console.info('matcher = ', match, item, filter.columnName, filter.filterArg1);
          if (!match) {
            break;
          }
          else {
            filterResults.push(item);
          }
        }
      });
      this.filteredItems = filterResults;
    }
    else {
      this.filteredItems = this.items;
    }
  }

  protected matcherContains(item: any, property: string, searchKey: string): boolean {
    const itemValue = item[property]!.toLowerCase();
    return itemValue && itemValue.includes(searchKey);
  }

  protected rebuildCurrentPage(): void {
    const items = this.filteredItems ?? this.items;
    const from = (this.pageIndex - 1) * this.pageSize;
    const to = this.pageIndex * this.pageSize;
    const total = items.length;
    if (from <= total) {
      const diff = total - 1 - from;
      if (diff <= this.pageSize) {
        this.displayItems = items.slice(from, total)
      }
      else {
        this.displayItems = items.slice(from, from + this.pageSize);
      }
    }
  }

  protected rebuildTable(items: any[]): void {
    if (!this.options || !this.options.columnDefs) {
      if (items.length) {
        this.displayOptions = BuildTableOptions(
          items[0],
          this.options?.hideHeader || false,
          this.columnVisibilityOverrides,
          this.columnCssOverrides,
          this.columnOrderIndexOverrides,
          this.columnFilterOverrides);
      }
    }
    this.items = items;
    this.rebuildFilteredItems();
    this.rebuildCurrentPage();
  }
}
