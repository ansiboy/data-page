import { DataSource, guid } from "maishu-toolkit";

export interface Person {
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


export function createDataSource(): DataSource<Person> {
    return dataSource;
}