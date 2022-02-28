import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import React from "react";
import { HexColorPicker } from "react-colorful";

export type ColorPickerProps = {
    onColorChange: (color: string) => void;
    color: string;
}

export class ColorPicker extends React.Component<ColorPickerProps> {
    private _color: string = "#FF0000";
    private _isOpen: boolean = false;

    constructor(props: ColorPickerProps) {
        super(props);
        this._color = props.color;
    }

    public open() {
        this._isOpen = true;
        this.setState({ open: true });
    }

    public close() {
        this._isOpen = false;
        this.setState({ open: false });
    }

    private onClose() {
        this.onCancel();
    }

    private onOk() {
        this.close();
        this.props.onColorChange(this._color);
    }

    private onCancel() {
        this.close();
        this._color = this.props.color; // reset color
    }

    render() {
        return <Dialog open={this._isOpen} onClose={() => this.onClose()}>
            <DialogContent>
                <HexColorPicker color={this._color} onChange={color => this._color = color} />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => this.onOk()}>OK</Button>
                <Button onClick={() => this.onCancel()}>Cancel</Button>
            </DialogActions>
        </Dialog>
    }
}
