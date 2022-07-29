import {
  Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef
} from '@angular/core';


export interface SmartTableCellContext {
  columnDef: SmartTableColumnOptions,
  dataItem: any,
}

export interface SmartTableColumnOptions {
  columnName: string,
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
  columnOrderIndexOverrides: { [columnName in string]:  number } = {}) : SmartTableOptions {
  if (item) {
    const props = Object.getOwnPropertyNames(item)
      .filter(p => columnVisibilityOverrides[p] != 'hidden');
    const columns = props.map<SmartTableColumnOptions>((prop) => {
      const itemValue = item[prop];
      const searchable = itemValue != null && ValueTypes.includes(typeof(itemValue));
      const reference = itemValue == null || RefTypes.includes(typeof(itemValue))
      return {
        columnName: prop,
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

  displayItems: any[] = [];
  displayOptions: SmartTableOptions = {
    columnDefs: [],
    hideHeader: false
  };
  pageIndex = 1;
  pageSize = 10;
  readonly pageSizeChoices = [ 10, 25, 50, 100 ];

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

  protected rebuildCurrentPage(): void {
    const from = (this.pageIndex - 1) * this.pageSize;
    const to = this.pageIndex * this.pageSize;
    const total = this.items.length;
    console.warn(from, to);
    if (from <= total) {
      const diff = total - 1 - from;
      if (diff <= this.pageSize) {
        this.displayItems = this.items.slice(from, total)
      }
      else {
        this.displayItems = this.items.slice(from, from + this.pageSize);
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
          this.columnOrderIndexOverrides);
      }
    }
    this.items = items;
    this.rebuildCurrentPage();
  }
}
