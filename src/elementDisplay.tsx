import { Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import { elementsImages } from "./Assets/UnityExport/chickenElements";
import { ElementInfo } from "./chickenDisplayService";

type ElementDisplayProps = {
    elementInfo:ElementInfo;
    onChangeClick?: () => void;
    enabled?: boolean;
}

export default class ElementDisplay extends React.Component<ElementDisplayProps> {
    public get isEnabled(): boolean {
        return this.props.enabled === undefined || this.props.enabled === true;
    }

    public onClick() {
        if (this.isEnabled)
            this.props.onChangeClick?.();
    }

    public get imageHeight() {
        // for animation we want taller images.
        return this.props.elementInfo.Pivot === null ? 150 : 50;
    }

    render() {
        return <Grid item xs={4}>
            <Card style={{ backgroundColor: this.isEnabled ? "white" : "lightgray" }}>
                <CardActionArea onClick={() => this.onClick()} disabled={!this.isEnabled}>
                    <div className="center">
                        <img
                            src={elementsImages[this.props.elementInfo.RequireKey]}
                            alt={this.props.elementInfo.Name}
                            style={{
                                height: this.imageHeight,
                                opacity: this.isEnabled ? 1 : 0.4
                            }}
                        />
                    </div>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" style={{ opacity: this.isEnabled ?  1 : 0.4 }}>
                            {this.props.elementInfo.FriendlyName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" style={{ opacity: this.isEnabled ?  1 : 0.4 }}>
                            {this.props.elementInfo.Description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    }
}
