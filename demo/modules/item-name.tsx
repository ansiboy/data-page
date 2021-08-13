import { DataListPage } from "../../out/index";
import { rules } from "maishu-dilu-react";
import { createDataSource, Person } from "../data-source";
import { DataSource } from "maishu-toolkit";

export default class extends DataListPage<Person>{
    _dataSource: DataSource<Person>;
    get dataSource() {
        if (this._dataSource == null)
            this._dataSource = createDataSource();
            
        return this._dataSource;
    }

    itemName = "人员";
    columns = [
        this.boundField({
            dataField: "firstName", headerText: "名",
            // itemStyle: { width: "200px" },
        }),
        this.boundField({
            dataField: "lastName", headerText: "姓",
        })
    ]
}