import { DataListPage } from "../../out/index";
import { rules } from "maishu-dilu";
import { createDataSource, Person } from "../data-source";
import * as React from "react";
import { DataSource } from "maishu-toolkit";

export default class extends DataListPage<Person> {

    _dataSource: DataSource<Person>;

    get dataSource() {
        if (this._dataSource == null)
            this._dataSource = createDataSource();

        return this._dataSource;
    }

    get showSelectItemColumn() {
        return true;
    }
    columns = [
        this.boundField({
            dataField: "firstName", headerText: "名",
            emptyText: "Please input first name.",
            validation: {
                rules: [rules.required("Please input first name.")],
                condition: (input, form, validator) => {
                    return false;
                }
            }
        }),
        this.boundField({
            dataField: "lastName", headerText: "姓",
            emptyText: "Please input last name.",
            validation: {
                rules: [rules.required("Please input last name.")]
            }
        })
    ]
    protected toolbarRightCommands() {
        let r = super.toolbarRightCommands();
        r.unshift(...[
            <button key="btnTest" className="btn btn-primary"
                onClick={() => this.test()}>
                <i className="fa fa-plus"></i>
                <span>TEST</span>
            </button>
        ])
        return r;
    }

    test() {
        alert(this.selectItemColumn.selectedItems.length);
    }
}