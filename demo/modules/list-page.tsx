import { DataListPage } from "../../out/index";
import { rules } from "maishu-dilu-react";
import { createDataSource, Person } from "../data-source";

export default class extends DataListPage<Person> {
    dataSource = createDataSource();
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



