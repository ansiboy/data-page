import * as React from "react";
import { PageProps } from "maishu-chitu-react";
import { strings } from "./strings";

export abstract class BasePage<P extends PageProps, S = {}> extends React.Component<P, S> {

    protected backButtonVisiable = false;
    protected title: string;

    constructor(props: P) {
        super(props);

        let render = this.render;
        this.render = () => {
            return <>
                {this.renderToolbar()}
                {render ? render.apply(this) : null}
            </>
        }
    }

    protected renderToolbar() {
        let toolbarLeft = this.renderToolbarLeft();
        let toolbarRight = this.renderToolbarRight();
        return <div className="tabbable">
            {this.title ? <h4 className="pull-left" style={{ margin: "2px 0 0 0" }}>{this.title}</h4> : null}
            <ul className="nav nav-tabs">
                {toolbarLeft.map((o, i) =>
                    <li key={i} className="pull-left">{o}</li>
                )}
                <li className="pull-right">
                    <button className="btn btn-primary btn-sm" style={{ display: this.backButtonVisiable ? "" : "none" }}
                        onClick={() => this.props.app.back()}>
                        <i className="fa fa-reply"></i>
                        <span>{strings.back}</span>
                    </button>
                </li>
                {toolbarRight.reverse().map((o, i) =>
                    <li key={i} className="pull-right">{o}</li>
                )}
            </ul>
        </div>
    }

    /** @deprecated use toolbarLeftCommands */
    protected renderToolbarLeft(): React.ReactElement<any, any>[] {
        return this.toolbarLeftCommands();
    }

    /** @deprecated use toolbarRightCommands */
    protected renderToolbarRight(): React.ReactElement<any, any>[] {
        return this.toolbarRightCommands();
    }

    protected toolbarLeftCommands(): React.ReactElement<any, any>[] {
        return [];
    }

    protected toolbarRightCommands(): React.ReactElement<any, any>[] {
        return [];
    }
}