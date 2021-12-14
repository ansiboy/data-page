import { DataListPage } from "../../out/index";
import { rules } from "maishu-dilu-react";
import { createDataSource, Person } from "../data-source";
import { DataSource } from "maishu-toolkit";

export default class extends DataListPage<Person> {
    private _dataSource: DataSource<Person>;
    get dataSource() {
        if (this._dataSource == null) {
            this._dataSource = createDataSource();
        }
        return this._dataSource;
    }
    columns = [
        this.boundField({
            dataField: "firstName", headerText: "名",
            // itemStyle: { width: "200px" },
            validation: {
                rules: [rules.required("Please input first name.")]
            }
        }),
        this.boundField({
            dataField: "lastName", headerText: "姓",
            validation: {
                rules: [rules.required("Please input last name.")]
            }
        })
    ]

    constructor(props: DataListPage<Person>["props"]) {
        super(props);
    }
}



