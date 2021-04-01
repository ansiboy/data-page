import { DataListPage } from "../../out/index";
import { rules } from "maishu-dilu-react";
import { createDataSource, Person } from "../data-source";

export default class extends DataListPage<Person>{
    dataSource = createDataSource();
    itemName = "人员";
    columns = [
        this.boundField({
            dataField: "firstName", headerText: "名",
            // itemStyle: { width: "200px" },
            validateRules: [rules.required("Please input first name.")]
        }),
        this.boundField({
            dataField: "lastName", headerText: "姓",
            validateRules: [rules.required("Please input last name.")]
        })
    ]
}