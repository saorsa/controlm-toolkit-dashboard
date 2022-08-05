import {
  Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";


export type FilterType =
  'none' |
  'contains' |
  'equalTo' |
  'greaterThan' |
  'greaterThanOrEqual' |
  'lessThan' |
  'lessThanOrEqual';

export const FilterTypeDisplayLabelsMap: { [key in FilterType]: string} = {
  'none': 'No Filter',
  'contains': 'Contains',
  'equalTo': 'Is Equal To',
  'greaterThan': 'Is Greater Than (>)',
  'greaterThanOrEqual': 'Is Greater Than Or Equal (>=)',
  'lessThan': 'Is Less Than (<)',
  'lessThanOrEqual': 'Is Less Than Or Equal (<=)',
}

export interface ColumnFilterDef {
  type: FilterType,
  filterFunc? (item: any, property: string, value: any): boolean
}

export interface SmartTableFilter {
  columnName: string,
  filterType: FilterType,
  filterArg1?: any;
  filterFunc? (item: any, property: string, value: any): boolean;
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

export const ValueTypes: string[] = [
  'boolean',
  'number',
  'string',
]

export const RefTypes: string[] = [
  'function',
  'array',
  'object',
]

export const TypeToFilterTypeMap: { [key in string]: FilterType[]} = {
  'undefined' : [
    'none'
  ],
  'boolean': [
    'none',
    'equalTo'
  ],
  'number': [
    'none',
    'equalTo',
    'greaterThan',
    'greaterThanOrEqual',
    'lessThan',
    'lessThanOrEqual',
  ],
  'string': [
    'none',
    'contains',
    'equalTo',
  ],
  'function' : [ 'none' ],
  'array' : [ 'none' ],
  'object': [ 'none' ],
}


export interface SmartTableOptions {
  columnDefs?: SmartTableColumnOptions[],
  hideHeader?: boolean,
  hideFilters?: boolean,
}

export function BuildTableOptions(
  item: any,
  hideHeader: boolean = false,
  hideFilters: boolean = false,
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
          type: typeof itemValue === 'string' ? 'contains' : 'none',
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
      hideFilters: hideFilters,
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

  filterForm?: FormGroup;
  filteredItems: any[] = [];
  filterTimeout?: number;
  displayItems: any[] = [];
  displayOptions: SmartTableOptions = {
    columnDefs: [],
    hideHeader: false,
    hideFilters: false,
  };
  pageIndex = 1;
  pageSize = 10;
  readonly pageSizeChoices = [ 10, 25, 50, 100 ];
  readonly activeFilters: SmartTableFilter[] = [];

  constructor(
    private readonly fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.rebuildTable(this.items);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.rebuildTable(changes['items'].currentValue);
    }
  }

  resetFilters(): void {
    if (this.activeFilters.length > 0) {
      if (this.filterForm?.controls) {
        for (let key in this.filterForm!.controls!) {
          const control = this.filterForm.get(key);
          if (control instanceof FormGroup) {
            control.get('filterArgument')?.setValue(null);
          }
        }
      }
      this.activeFilters.splice(0, this.activeFilters.length);
      this.rebuildFilteredItems();
      this.rebuildCurrentPage();
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

  getColumnFilterInputType(columnDef: SmartTableColumnOptions): string {
    if (!columnDef.type) {
      return 'text';
    }
    if (columnDef.type == 'number') {
      return 'number'
    }
    return 'text'
  }

  columnFilterChange(columnDef: SmartTableColumnOptions, eventTarget: any): void {
    if (eventTarget instanceof HTMLSelectElement){
      //const filterType = eventTarget.value as FilterType;
      const columnName = columnDef.columnName;
      const existingFilterIndex = this.activeFilters.findIndex(
        f => f.columnName === columnName);
      if (existingFilterIndex === -1) {
        this.getFilterArgumentControl(columnDef).setValue(null);
      }
      else {
        this.getFilterArgumentControl(columnDef).setValue(null);
        this.activeFilters.splice(existingFilterIndex, 1);
      }

      this.rebuildFilteredItems();
      this.rebuildCurrentPage();
    }
  }

  containsSearchOnKeyUp(columnDef: SmartTableColumnOptions, filterType: FilterType, event: any): any {
    const columnName = columnDef.columnName;
    const filterArgType = columnDef.type;
    const filterArg = filterArgType === 'string' ?
      event?.target.value.trim().toLowerCase() :
      event?.target.value;
    const existingFilterIndex = this.activeFilters.findIndex(
      f => f.columnName === columnName && f.filterType === filterType);
    if (filterArg && filterArg.length) {
      if (existingFilterIndex === -1) {
        this.activeFilters.push({
          columnName: columnName,
          filterType: filterType,
          filterArg1: filterArg,
          filterFunc: columnDef.filter.filterFunc,
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
        let itemMatchesFilters: boolean = false;
        for (let index = 0; index < numberOfFilters; index++) {
          const filter = this.activeFilters[index];
          if (filter.filterType === 'contains') {
            const matcher = filter.filterFunc ?? this.matcherContains;
            itemMatchesFilters = matcher(item, filter.columnName, filter.filterArg1);
          }
          else if (filter.filterType === 'equalTo') {
            const matcher = filter.filterFunc ?? this.matcherEquals;
            itemMatchesFilters = matcher(item, filter.columnName, filter.filterArg1);
          }
          else if (filter.filterType === 'greaterThan') {
            const matcher = filter.filterFunc ?? this.matcherGreaterThan;
            itemMatchesFilters = matcher(item, filter.columnName, filter.filterArg1);
          }
          else if (filter.filterType === 'greaterThanOrEqual') {
            const matcher = filter.filterFunc ?? this.matcherGreaterThanOrEqual;
            itemMatchesFilters = matcher(item, filter.columnName, filter.filterArg1);
          }
          else if (filter.filterType === 'lessThan') {
            const matcher = filter.filterFunc ?? this.matcherLessThan;
            itemMatchesFilters = matcher(item, filter.columnName, filter.filterArg1);
          }
          else if (filter.filterType === 'lessThanOrEqual') {
            const matcher = filter.filterFunc ?? this.matcherLessThanOrEqual;
            itemMatchesFilters = matcher(item, filter.columnName, filter.filterArg1);
          }
          if (!itemMatchesFilters) {
            break;
          }
        }
        if (itemMatchesFilters) {
          filterResults.push(item);
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

  protected matcherEquals(item: any, property: string, value: any): boolean {
    const itemValue = item[property];
    return itemValue != null && itemValue == value;
  }

  protected matcherGreaterThan(item: any, property: string, value: any): boolean {
    const num: number = +value;
    const itemValue = item[property];
    return itemValue != null && itemValue > num;
  }

  protected matcherGreaterThanOrEqual(item: any, property: string, value: any): boolean {
    const num: number = +value;
    const itemValue = item[property];
    return itemValue != null && itemValue >= num;
  }

  protected matcherLessThan(item: any, property: string, value: any): boolean {
    const num: number = +value;
    const itemValue = item[property];
    return itemValue != null && itemValue < num;
  }

  protected matcherLessThanOrEqual(item: any, property: string, value: any): boolean {
    const num: number = +value;
    const itemValue = item[property];
    return itemValue != null && itemValue <= num;
  }

  protected rebuildCurrentPage(): void {
    const items = this.filteredItems ?? this.items;
    const from = (this.pageIndex - 1) * this.pageSize;
    //  const to = this.pageIndex * this.pageSize;
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
          this.options?.hideFilters || false,
          this.columnVisibilityOverrides,
          this.columnCssOverrides,
          this.columnOrderIndexOverrides,
          this.columnFilterOverrides);
      }
    }

    this.filterForm = this.fb.group({});
    this.displayOptions.columnDefs?.forEach(columnDef => {
      const nested: FormGroup = this.fb.group({
        'filterType': [ columnDef.filter.type ],
        'filterArgument': [],
      });
      this.filterForm?.addControl(columnDef.columnName, nested);
    });

    this.items = items;
    this.rebuildFilteredItems();
    this.rebuildCurrentPage();
  }

  getAllowedFilterTypes(columnDef: SmartTableColumnOptions): string[] {
    let results = TypeToFilterTypeMap[columnDef.type ?? 'undefined'];
    const override = this.columnFilterOverrides[columnDef.columnName];
    if (override) {
      if (!results.includes(override.type)) {
        results.push(override.type);
      }
    }
    return results;
  }

  getFilterTypeControl(columnDef: SmartTableColumnOptions): FormControl {
    return this.filterForm!.get(columnDef.columnName)!.get('filterType') as FormControl;
  }

  getFilterTypeDisplayLabel(ft: string): string {
    return FilterTypeDisplayLabelsMap[ft as FilterType];
  }

  getFilterArgumentControl(columnDef: SmartTableColumnOptions): FormControl {
    return this.filterForm!.get(columnDef.columnName)!.get('filterArgument') as FormControl;
  }
}
