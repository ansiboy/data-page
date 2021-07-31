import { DataListPage } from "../../out/index";
import { rules } from "maishu-dilu";
import { createDataSource, Person } from "../data-source";
import * as React from "react";

export default class extends DataListPage<Person> {
    dataSource = createDataSource();
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
    renderToolbarRight() {
        let r = super.renderToolbarRight();
        r.unshift(...[
            <button key="btnTest" className="btn btn-primary btn-sm"
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