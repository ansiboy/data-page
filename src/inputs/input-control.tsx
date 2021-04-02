import * as React from "react";
// import { FieldValidate } from "maishu-wuzhui-helper";
import { BoundFieldParams } from "maishu-wuzhui-helper";

export interface InputControlProps<T> {
    dataField: keyof T,
    validation: BoundFieldParams<any>["validation"]
}

export interface InputControlState {
    // value?: any,
}

export interface ItemDialog {
    inputControls: InputControl<any>[]
}

export abstract class InputControl<T, P extends InputControlProps<T> = InputControlProps<T>,
    S extends InputControlState = InputControlState> extends React.Component<P, S> {

    static defaultProps: Pick<InputControlProps<any>, "validation"> = { validation: { rules: [] } };

    constructor(props: P) {
        super(props);

    }

    abstract get value(): any;
    abstract set value(value: any)
}
