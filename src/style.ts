export let classNames = {
    tableWrapper: "table-wrapper"
};

let elementId = "maishu-data-page-style";
if (!document.getElementById(elementId) && document.head != null) {

    let element = document.createElement('style');
    element.type = 'text/css';
    element.id = elementId;
    document.head.appendChild(element);

    element.innerHTML = `
.${classNames.tableWrapper} {
    overflow-y: scroll;
    overflow-x: hidden;
    border: solid 1px #cccccc;
    border-top: none;
}
.${classNames.tableWrapper} table tbody tr td:first-child {
    border-left-color: white;
}
.${classNames.tableWrapper} table tbody tr td:last-child {
    border-right-color: white;
}
.${classNames.tableWrapper} .table-bordered {
    border: none;
}
`;

}