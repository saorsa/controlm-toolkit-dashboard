import {
  Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef
} from '@angular/core';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";


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
  columns: SmartTableColumnOptions[],
  hideHeader?: boolean
}

export function BuildTableOptions(
  item: any,
  columnVisibilityOverrides: { [columnName in string]:  'hidden' | 'visible' } = {},
  columnCssOverrides: { [columnName in string]:  string } = {},
  columnOrderIndexOverrides: { [columnName in string]:  number } = {}) {
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
  @Input() columnCssOverrides: { [columnName in string]:  string } = {};
  @Input() columnOrderIndexOverrides: { [columnName in string]:  number } = {};

  displayItems: any[] = [];
  displayOptions: SmartTableOptions = { columns: [] };
  pageIndex = 1;
  pageSize = 10;
  dialogCloseResult = '';
  dialogRef?: NgbModalRef;
  dialogColumnDef?: SmartTableColumnOptions;
  dialogDataItem?: any;
  readonly pageSizeChoices = [ 10, 25, 50, 100 ];

  constructor(
    readonly modal: NgbModal
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

  openReferenceDetails(
    content: TemplateRef<any>,
    columnDef: SmartTableColumnOptions,
    dataItem: any): void {
    this.dialogColumnDef = columnDef;
    this.dialogDataItem = dataItem;
    this.dialogRef = this.modal.open(content);
    this.dialogRef.result.then((result) => {
      this.dialogCloseResult = `Closed with: ${result}`;
    }, (reason) => {
      this.dialogCloseResult = `Dismissed ${reason}`;
    });
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
        this.displayOptions = BuildTableOptions(
          items[0],
          this.columnVisibilityOverrides,
          this.columnCssOverrides,
          this.columnOrderIndexOverrides);
      }
    }
    this.items = items;
    this.rebuildCurrentPage();
  }
}
