import { BasePage } from "./base-page";
import {
    DataSource, DataControlField, CustomField, GridViewCell, GridViewEditableCell,
    BoundField, GridViewCellControl, createGridView, boundField, BoundFieldParams,
    dateTimeField, CheckboxListFieldParams, checkboxListField, GridView, customDataField, DataControlFieldParams,
} from "maishu-wuzhui-helper";
import * as React from "react";
import { createItemDialog, Dialog, DialogTitles } from "./item-dialog";
import * as ReactDOM from "react-dom";
import { InputControl, InputControlProps } from "./inputs/input-control";
import { PageDataSource } from "./page-data-source";
import { PageProps } from "maishu-chitu-react";
import { buttonOnClick, confirm } from "maishu-ui-toolkit";
import { classNames } from "./style";
import { strings } from "./strings";
import { Callback, errors } from "maishu-toolkit";

interface BoundInputControlProps<T> extends InputControlProps<T> {
    boundField: BoundField<T>
}

/** 数据绑定列控件 */
class BoundFieldControl<T> extends InputControl<T, BoundInputControlProps<T>>{
    control: GridViewCellControl;
    cell: GridViewEditableCell<T>;

    private _value: any;
    constructor(props: BoundFieldControl<T>["props"]) {
        super(props);

        this.state = {};
    }

    get value() {
        if (this.control != null)
            return this.control.value;
        else
            return this._value;
    }

    set value(value) {
        if (this.control != null)
            this.control.value = value;
        else
            this._value = value;
    }

    render() {
        console.assert(this.state != null);

        return <span ref={e => {
            if (this.control != null || e == null) {
                return;
            }

            this.control = this.props.boundField.createControl();
            this.control.element.setAttribute("name", this.props.dataField as string);
            this.control.value = this._value;
            if (this.props.emptyText)
                (this.control.element as HTMLInputElement).placeholder = this.props.emptyText;

            this.control.element.onchange = () => {
                this._value = this.control.value;
            }

            e.appendChild(this.control.element);
        }}>

        </span>
    }
}


class SelectItemCell<T> extends GridViewCell {

    changed = Callback.create<{ sender: SelectItemCell<T> }>();
    dataItem: T;
    #input: HTMLInputElement;

    constructor(element: HTMLElement, dataItem: T) {
        super(element)

        this.dataItem = dataItem;
        ReactDOM.render(<input type="checkbox" style={{ cursor: "pointer" }}
            ref={e => this.#input = e || this.#input}
            onChange={e => {
                this.changed.fire({ sender: this });

            }} />, element);
    }

    get checked() {
        return this.#input.checked;
    }
    set checked(value: boolean) {
        if (value == this.#input.checked) {
            return;
        }

        this.#input.checked = value;
        this.changed.fire({ sender: this });
    }

}

class SelectItemColumn<T> extends DataControlField<T> {

    itemSelected = Callback.create<{ dataItem: T, selectedItems: T[] }>();
    itemUnselected = Callback.create<{ dataItem: T, selectedItems: T[] }>();

    #dataSource: DataSource<T>;
    #cells: SelectItemCell<T>[] = [];
    #allCheckbox: HTMLInputElement;

    constructor(params: DataControlFieldParams & { dataSource: DataSource<T> }) {
        super(params);

        this.#dataSource = params.dataSource;
        this.#dataSource.selected.add(() => {
            this.#cells = [];
        })
    }

    get selectedItems(): T[] {
        let selectedItems = this.#cells.filter(o => o.checked).map(o => o.dataItem);
        return selectedItems;
    }

    get cells() {
        return this.#cells;
    }

    createItemCell(dataItem: T, cellElement: HTMLElement) {
        let cell = new SelectItemCell(cellElement, dataItem);
        cell.style(this.itemStyle);
        cell.changed.add(e => {
            if (e.sender.checked) {
                this.itemSelected.fire({ dataItem, selectedItems: this.selectedItems });
            }
            else {
                this.itemUnselected.fire({ dataItem, selectedItems: this.selectedItems });
            }

            let isAllChecked = this.#cells.filter(o => o.checked).length == this.#cells.length;
            this.#allCheckbox.checked = isAllChecked;
        })
        this.#cells.push(cell);
        this.#allCheckbox.checked = false;
        return cell;
    }

    createHeaderCell(cellElement: HTMLElement) {
        let cell = super.createHeaderCell(cellElement);

        ReactDOM.render(<><input type="checkbox" style={{ cursor: "pointer" }}
            ref={e => this.#allCheckbox = e || this.#allCheckbox}
            onChange={e => {
                let checked = e.target.checked;
                this.#cells.forEach(c => {
                    c.checked = checked;
                })

            }} /></>, cellElement);
        return cell;
    }

}


export interface DataListPageState {
    tableSize?: { width: number, height: number }
}


export abstract class DataListPage<T, P extends PageProps = PageProps, S extends DataListPageState = DataListPageState> extends BasePage<P, S> {

    #itemTable: HTMLTableElement;
    #dialog: Dialog<T>;
    #commandColumn: CustomField<T>;
    #selectItemColumn: SelectItemColumn<T>;

    /** 操作列宽度 */
    protected CommandColumnWidth = 140;
    protected ScrollBarWidth = 18;

    abstract columns: DataControlField<T>[];

    get dialogTitles(): DialogTitles {
        return {
            add: strings.add,
            edit: strings.modify,
        }
    }

    get dataSource(): DataSource<T> {
        return null as any;
    }

    //============================================
    // protected
    protected pageSize?: number = 15;
    protected headerFixed = false;

    /** 是否显示命令字段 */
    get showCommandColumn() {
        return true;
    }

    get showSelectItemColumn() {
        return false;
    }

    get selectItemColumn() {
        return this.#selectItemColumn;
    }

    /** 对显示的数据进行转换 */
    protected translate?: (items: T[]) => T[];
    //============================================

    protected deleteConfirmText: (dataItem: T) => string;
    protected gridView: GridView<T>;

    constructor(props: P) {
        super(props);

        if (this.dataSource == null)
            throw new Error(`Data source is null.`);

        if (this.showCommandColumn) {
            let it = this;
            this.#commandColumn = new CustomField<T>({
                headerText: "操作",
                headerStyle: { textAlign: "center", width: `${this.CommandColumnWidth}px` },
                itemStyle: { textAlign: "center", width: `${this.CommandColumnWidth}px` },
                createItemCell(dataItem: T, cellElement) {
                    let cell = new GridViewCell(cellElement);
                    ReactDOM.render(<>
                        {it.leftCommands(dataItem)}
                        {it.editButton(dataItem)}
                        {it.deleteButton(dataItem)}
                        {it.rightCommands(dataItem)}
                    </>, cell.element);
                    return cell;
                }
            });
        }

        if (this.showSelectItemColumn) {
            this.#selectItemColumn = new SelectItemColumn<T>({
                headerStyle: { width: "40px" },
                itemStyle: { textAlign: "center", },
                dataSource: this.dataSource,
            });
        }

        window.addEventListener("resize", () => {
            let height = window.innerHeight - 160;
            let width = window.innerWidth - 80;
            let firstMenuPanel = document.getElementsByClassName("first")[0] as HTMLElement;
            let secondMenuPanel = document.getElementsByClassName("second")[0] as HTMLElement;
            if (firstMenuPanel) {
                width = width - firstMenuPanel.offsetWidth;
            }
            if (secondMenuPanel) {
                width = width - secondMenuPanel.offsetWidth;
            }

            let tableSize: DataListPageState["tableSize"];
            if (this.state != null) {
                tableSize = this.state.tableSize;
            }
            if (tableSize == null || tableSize.height != height || tableSize.width != width) {
                this.setState({ tableSize: { width, height } });
            }
        })
    }

    calcTableSize() {
        let height = window.innerHeight - 160;
        let width = window.innerWidth - 40;
        let firstMenuPanel = document.getElementsByClassName("first")[0] as HTMLElement;
        let secondMenuPanel = document.getElementsByClassName("second")[0] as HTMLElement;
        if (firstMenuPanel) {
            width = width - firstMenuPanel.offsetWidth;
        }
        if (secondMenuPanel) {
            width = width - secondMenuPanel.offsetWidth;
        }

        return { width, height };
    }

    renderEditor(): React.ReactElement<any, any> {
        return <>
            {this.columns.filter(o => o instanceof BoundField && o.readOnly != true).map((col, i) =>
                <div key={i} className="form-group clearfix input-control">
                    <label>{col.headerText}</label>
                    <BoundFieldControl boundField={col as BoundField<any>} dataField={(col as BoundField<any>).dataField}
                        validation={(col as BoundField<T>).validation} emptyText={(col as BoundField<any>).emptyText} />
                </div>
            )}
        </>
    }

    protected toolbarRightCommands(): React.ReactElement<any, any>[] {
        let editor = this.renderEditor();
        if (editor == null) {
            return [];
        }

        this.#dialog = createItemDialog(this.dataSource, this.dialogTitles, editor);
        let addButton = this.addButton();
        let searchInput = this.searchControl();
        let r: JSX.Element[] = [];

        if (searchInput)
            r.push(searchInput);

        if (addButton)
            r.push(addButton);

        return r;
    }

    /** 获取页面添加按钮 */
    protected addButton() {
        let button = this.dataSource.canInsert ? <button key="btnAdd" className="btn btn-primary btn-sm"
            onClick={() => this.#dialog.show({} as T)}>
            <i className="fa fa-plus"></i>
            <span>{strings.add}</span>
        </button> : null;

        return button;
    }

    /** 获取页面编辑按钮 */
    protected editButton(dataItem: T) {
        if (!this.dataSource.canUpdate)
            return null;

        let ps = this.dataSource as PageDataSource<T>;
        let options = ps.options || {} as typeof ps.options;
        let itemCanUpdate = options.itemCanUpdate || (() => true);
        return <button className="btn btn-minier btn-info"
            onClick={() => this.executeEdit(dataItem)}
            disabled={!itemCanUpdate(dataItem)}>
            <i className="fa fa-pencil"></i>
        </button>
    }

    /** 获取页面删除按钮 */
    protected deleteButton(dataItem: T) {
        if (!this.dataSource.canDelete)
            return;

        let ps = this.dataSource as PageDataSource<T>;
        let options = ps.options || {} as typeof ps.options;
        let itemCanDelete = options.itemCanDelete || (() => true);
        return <button className="btn btn-minier btn-danger"
            disabled={!itemCanDelete(dataItem)}
            ref={e => {
                if (!e) return;
                if (e.getAttribute("button-on-click")) {
                    return;
                }

                e.setAttribute("button-on-click", "true");
                buttonOnClick(e, () => this.executeDelete(dataItem));
            }}>
            <i className="fa fa-trash"></i>
        </button>
    }

    /** 执行编辑操作 */
    protected executeEdit(dataItem: T) {
        this.#dialog.show(dataItem);
    }

    /** 执行删除操作 */
    protected executeDelete(dataItem: T) {
        if (this.deleteConfirmText) {
            let message = this.deleteConfirmText(dataItem);
            return new Promise<any>((resolve, reject) => {
                confirm({
                    title: "请确认", message,
                    confirm: async () => {
                        return this.dataSource.delete(dataItem)
                            .then(r => resolve(r))
                            .catch(err => reject(err))
                    },
                    cancle: async () => {
                        resolve({});
                    }
                })
            })
        }
        return this.dataSource.delete(dataItem);
    }

    /** 获取页面搜索栏 */
    protected searchControl() {
        let dataSource = this.dataSource as PageDataSource<T>;
        let search = dataSource.options ? dataSource.options.search : null;
        let searchInput = search ? <>
            <input type="text" className="form-control pull-left input-sm" placeholder={search.placeholder || ""} style={{ width: 300 }}></input>
            <button className="btn btn-primary btn-sm">
                <i className="fa fa-search"></i>
                <span>{strings.search}</span>
            </button>
        </> : null;

        return searchInput;
    }

    /** @deprecated use itemRightCommands */
    protected rightCommands(dataItem: T): JSX.Element[] {
        return this.itemRightCommands(dataItem);
    }

    /** @deprecated use itemLeftCommands */
    protected leftCommands(dataItem: T): JSX.Element[] {
        return this.itemLeftCommands(dataItem);
    }

    protected itemRightCommands(dataItem: T): JSX.Element[] {
        return [];
    }

    protected itemLeftCommands(dataItem: T): JSX.Element[] {
        return [];
    }

    private tableRef(element: HTMLTableElement) {
        if (element == null || this.#itemTable != null)
            return;

        this.#itemTable = element || this.#itemTable;


        let columns = [...this.columns || []];
        if (this.#selectItemColumn) {
            columns.unshift(this.#selectItemColumn);
        }

        if (this.#commandColumn) {
            columns.push(this.#commandColumn);
        }

        this.gridView = createGridView({
            element: this.#itemTable,
            dataSource: this.dataSource,
            columns,
            pageSize: this.pageSize,
            translate: this.translate,
            showHeader: this.headerFixed != true,
        })
    }

    render() {
        let tableSize = (this.state?.tableSize || this.calcTableSize()) as ReturnType<DataListPage<any, any>["calcTableSize"]>;
        if (this.headerFixed) {
            let columns = (this.columns || []).filter(o => o.visible);
            return <>
                <table className="table table-striped table-bordered table-hover" style={{ margin: 0 }}    >
                    <thead>
                        <tr>
                            {columns.map((col, i) =>
                                <th key={i} ref={e => {
                                    if (!e) return;
                                    if (!col.itemStyle)
                                        return;

                                    e.style.width = col.itemStyle["width"] || "";
                                    if (this.#commandColumn == null && i == columns.length - 1) {
                                        e.style.width = `calc(${e.style.width} + ${this.ScrollBarWidth}px)`
                                    }

                                }}>{col.headerText}</th>
                            )}
                            {this.#commandColumn ? <th style={{ width: this.CommandColumnWidth + this.ScrollBarWidth }}>
                                {this.#commandColumn.headerText}
                            </th> : null}
                        </tr>
                    </thead>
                </table>
                <div className={classNames.tableWrapper} style={{ height: `${tableSize.height}px`, width: `${tableSize.width}px` }}>
                    <table ref={(e: HTMLTableElement) => this.tableRef(e)}>
                    </table>
                </div>
            </>
        }

        return <table ref={(e: HTMLTableElement) => this.tableRef(e)} >

        </table>
    }

    boundField(params: BoundFieldParams<T>) {
        return boundField(params);
    }

    dateTimeField(params: BoundFieldParams<T>) {
        return dateTimeField(params);
    }

    checkboxListField<S>(params: CheckboxListFieldParams<T, S>): BoundField<T> {
        return checkboxListField(params)
    }

    customDataField(params: CustomeDataFieldParams<T>) {
        return customDataField<T>(params)
    }



}

type CustomeDataFieldParams<T> = Parameters<typeof customDataField>[0];


