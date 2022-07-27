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
  columns: SmartTableColumnOptions[],
}

export function BuildTableOptions(
  item: any,
  columnVisibilityOverrides: { [columnName in string]:  'hidden' | 'visible' } = {},
  columnLabelOverrides: { [columnName in string]:  string } = {}) {
  if (item) {
    const props = Object.getOwnPropertyNames(item)
      .filter(p => columnVisibilityOverrides[p] != 'hidden');
    const columns = props.map<SmartTableColumnOptions>((prop) => {
      const itemValue = item[prop];
      const searchable = itemValue != null && ValueTypes.includes(typeof(itemValue));
      const reference = itemValue == null || RefTypes.includes(typeof(itemValue))
      return {
        columnName: prop, searchable: searchable, isReference: reference,
        type: Array.isArray(itemValue) ? 'array' : typeof itemValue,
      }
    });
    return {
      columns: columns
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

  displayItems: any[] = [];
  displayOptions: SmartTableOptions = { columns: [] };
  pageIndex = 1;
  pageSize = 10;
  readonly pageSizeChoices = [ 10, 25, 50, 100 ];

  constructor() { }

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
    if (!this.options) {
      if (items.length) {
        this.displayOptions = BuildTableOptions(items[0], this.columnVisibilityOverrides);
      }
    }
    this.items = items;
    this.rebuildCurrentPage();
  }
}
