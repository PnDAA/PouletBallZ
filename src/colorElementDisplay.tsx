import { Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import React from "react";
import { rgbToHex, hexToRgb } from './colorUtils';
import { Chicken, Color, ColorType, RestRequestsService } from './restRequestsService';

type ColorElementProps = {
    colorType: ColorType
}

export default class ColorElementDisplay extends React.Component<ColorElementProps> {
    inputColorElement: HTMLInputElement | null | undefined;

    _timeoutId: NodeJS.Timeout | undefined;

    colorHexString:string;

    constructor(props: ColorElementProps) {
        super(props);
        const chicken: Chicken = RestRequestsService.getChicken();

        let color: Color | undefined;
        switch (this.props.colorType) {
            case "Primary": color = chicken.PrimaryColor; break;
            case "Secondary": color = chicken.SecondaryColor; break;
            default: throw new Error("Not impl");
        }
        this.colorHexString = rgbToHex(
            Math.round(color.r * 255),
            Math.round(color.g * 255),
            Math.round(color.b * 255)
        );
    }

    setHexColor(hexColor: string) {
        this.colorHexString = hexColor;
        this.setState({ color: this.colorHexString });

        // Need to handle the fact that it is always changing with the change event (https://github.com/facebook/react/issues/6308)
        if (this._timeoutId !== undefined) {
            clearTimeout(this._timeoutId);
            this._timeoutId = undefined;
        }
        this._timeoutId = setTimeout(() => {
            let color: Color = hexToRgb(hexColor)!;
            color.r /= 255;
            color.g /= 255;
            color.b /= 255;
            RestRequestsService.setColorAsync(this.props.colorType, color);
        }, 2000);
    }

    render() {
        return <>
            <Grid item xs={6}>
                <Card style={{ backgroundColor: this.colorHexString }}>
                    <CardActionArea onClick={() => this.inputColorElement!.click()}>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {this.props.colorType} Color
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {this.colorHexString}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>

            <input
                ref={input => this.inputColorElement = input}
                type="color"
                style={{ display: "None" }}
                value={this.colorHexString}
                onChange={() => this.setHexColor(this.inputColorElement!.value)}
            />
        </>
    }
}
