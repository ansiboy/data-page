import { DataSource } from "maishu-wuzhui";
import { DataListPage } from "../../out/index";
import { rules } from "maishu-dilu-react";
import { guid } from "maishu-toolkit";

interface Person {
    id: string,
    firstName: string,
    lastName: string,
}

let persons: Person[] = [
    { id: guid(), firstName: "shu", lastName: "mai" }
];

let dataSource = new DataSource<Person>({
    primaryKeys: ["id"],
    select: async () => {
        return { dataItems: persons, totalRowCount: persons.length };
    },
    insert: async (dataItem) => {
        dataItem.id = guid();
        persons.push(dataItem);
        return dataItem;
    },
    update: async (dataItem) => {
        return dataItem;
    },
    delete: async (dataItem) => {
        persons = persons.filter(o => o.id != dataItem.id);
        return dataItem;
    }
})

export default class extends DataListPage<Person> {
    dataSource = dataSource;
    columns = [
        this.boundField({
            dataField: "firstName", headerText: "名",
            validateRules: [rules.required("Please input first name.")]
        }),
        this.boundField({
            dataField: "lastName", headerText: "姓",
            validateRules: [rules.required("Please input last name.")]
        })
    ]

    constructor(props) {
        super(props);


    }
}

