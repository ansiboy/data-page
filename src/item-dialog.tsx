import * as React from "react";
import { hideDialog, showDialog } from "maishu-ui-toolkit";
import * as ReactDOM from "react-dom";
import { DataSource } from "maishu-wuzhui-helper";
import { FormValidator } from "maishu-dilu";
import { InputControl, ItemDialog as IItemDialog } from "./inputs/input-control";
import { strings } from "./strings";

type BeforeSave<T> = (dataItem: T) => Promise<any>

export interface Dialog<T> {
    show: (args: T) => void
}

export function createItemDialog<T>
    (dataSource: DataSource<T>, name: string, child: React.ReactElement, beforeSave?: BeforeSave<T>): Dialog<T> {

    class ItemDialog extends React.Component<{}, { title?: string }> implements IItemDialog {

        private static instance: ItemDialog;
        private dialogElement: HTMLElement;

        private validator: FormValidator;
        private beforeSaves: BeforeSave<T>[];
        private fieldsConatiner: HTMLElement;

        inputControls: InputControl<{}>[];
        private dataItem: T;

        constructor(props: ItemDialog["props"]) {
            super(props);
            this.state = {};

            this.beforeSaves = [];
            this.inputControls = [];

            child = this.cloneElement(child);
        }

        /**
         * 克隆元素，并找出 InputControl
         * @param element 要克隆的元素
         */
        private cloneElement(element: React.ReactElement): any {
            if (element == null)
                return null;

            if (typeof element == "string")
                return element;

            if (Array.isArray(element)) {
                return element.map(o => this.cloneElement(o));
            }

            let elementType = element["type"];
            console.assert(elementType != null);

            let props: React.ReactElement["props"];
            let it = this;
            if (typeof elementType == "function") {
                if (elementType.constructor == InputControl.constructor) {
                    let ref: Function = element.props.ref;
                    props = Object.assign({}, element.props, {
                        ref(e: any) {
                            if (!e) return;
                            it.inputControls.push(e);

                            if (ref)
                                ref.apply(this);
                        }
                    });
                }
            }

            props = props || element.props;

            let newChildren = this.cloneElement(element.props.children);
            let newElement: React.ReactElement;
            if (Array.isArray(newChildren)) {
                newElement = React.createElement(elementType, props, ...newChildren);
            }
            else {
                newElement = React.createElement(elementType, props, newChildren);
            }
            return newElement;
        }

        private async onSaveButtonClick() {
            this.validator.clearErrors()
            if (!this.validator.check()) {
                return Promise.reject('validate fail')
            }

            await this.save();
            hideDialog(this.dialogElement);
        }

        setDataItem(dataItem: T) {
            this.dataItem = dataItem;
            let primaryValues = (dataSource.primaryKeys || []).map(key => dataItem[key]).filter(o => o);
            let title = primaryValues.length > 0 ? `修改${name}` : `添加${name}`;

            this.inputControls.forEach(c => {
                let value = dataItem[c.props.dataField];
                c.value = value;
            })

            this.setState({ title })
        }

        async save() {
            let dataItem = this.dataItem;
            this.inputControls.forEach(c => {
                (dataItem as any)[c.props.dataField] = c.value;
            })

            if (beforeSave) {
                await beforeSave(dataItem);
            }

            if (this.beforeSaves.length > 0) {
                await Promise.all(this.beforeSaves.map(m => m(dataItem)));
            }

            let primaryValues = dataSource.primaryKeys.map(o => dataItem[o]).filter(v => v != null);
            if (primaryValues.length > 0) {
                await dataSource.update(dataItem);
            }
            else {
                await dataSource.insert(dataItem);
            }
        }

        componentDidMount() {
            let ctrls = this.inputControls;
            let validateFields = ctrls.filter(o => o.props.validateRules).map(o => ({ name: o.props.dataField as string, rules: o.props.validateRules || [] }));
            this.validator = new FormValidator(this.fieldsConatiner, ...validateFields);
        }

        render() {
            let { title } = this.state;
            return <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 className="modal-title">{title}</h4>
                    </div>
                    <div className="modal-body well" style={{ paddingLeft: 20, paddingRight: 20 }}
                        ref={e => this.fieldsConatiner = e || this.fieldsConatiner}>
                        {child}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-default" onClick={() => { hideDialog(this.dialogElement) }}>
                            <i className="fa fa-reply" />
                            <span>{strings.cancel}</span>
                        </button>
                        <button className="btn btn-primary" onClick={() => this.onSaveButtonClick()}>
                            <i className="fa fa-save" />
                            <span>{strings.ok}</span>
                        </button>
                    </div>
                </div>
            </div>
        }

        static show(dataItem?: T) {
            dataItem = dataItem || {} as T;
            if (!ItemDialog.instance) {
                let dialogElement = document.createElement("div");
                dialogElement.className = "modal fade-in";
                document.body.appendChild(dialogElement);
                ItemDialog.instance = ReactDOM.render(<ItemDialog />, dialogElement) as any;
                ItemDialog.instance.dialogElement = dialogElement;
            }

            if (ItemDialog.instance.validator)
                ItemDialog.instance.validator.clearErrors();

            ItemDialog.instance.setDataItem(dataItem);
            showDialog(ItemDialog.instance.dialogElement);
        }
    }

    return ItemDialog;
}
