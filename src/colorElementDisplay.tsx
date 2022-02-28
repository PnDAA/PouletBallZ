import { Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import React from "react";
import { ColorPicker } from './colorPicker';
import { hexToRgb } from './colorUtils';
import { Color, ColorType, RestRequestsService } from './restRequestsService';

type ColorElementProps = {
    colorType: ColorType
}

export default class ColorElementDisplay extends React.Component<ColorElementProps> {
    colorPickerElement: ColorPicker | null | undefined = undefined;

    colorHexString: string;

    constructor(props: ColorElementProps) {
        super(props);
        this.colorHexString = RestRequestsService.getHexColorAsync(this.props.colorType);
    }

    setHexColor(hexColor: string) {
        // page
        this.colorHexString = hexColor;
        this.setState({ color: this.colorHexString });

        // backend
        let color: Color = hexToRgb(hexColor)!;
        color.r /= 255;
        color.g /= 255;
        color.b /= 255;
        RestRequestsService.setColorAsync(this.props.colorType, color);
    }

    render() {
        return <>
            <Grid item xs={6}>
                <Card style={{ backgroundColor: this.colorHexString }}>
                    <CardActionArea onClick={() => this.colorPickerElement!.open()}>
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

            <ColorPicker
                ref={colorPicker => this.colorPickerElement = colorPicker}
                color='this.colorHexString'
                onColorChange={(color) => this.setHexColor(color)}>
            </ColorPicker>
        </>
    }
}
