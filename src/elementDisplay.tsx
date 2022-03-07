import { Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import { elementsImages } from "./Assets/UnityExport/chickenElements";
import { ElementInfo, RarityLevel } from "./chickenDisplayService";

type ElementDisplayProps = {
    elementInfo: ElementInfo;
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

    public get imageHeight(): number {
        // for animation we want taller images.
        return this.props.elementInfo.Pivot === null ? 150 : 50;
    }

    public getRarityColor(opacity:number): string {
        switch (this.props.elementInfo.Rarity) {
            case RarityLevel.Junk:
                return `rgba(0, 0, 0, ${opacity})`;
            case RarityLevel.Normal:
                return `rgba(0, 255, 0, ${opacity})`;
            case RarityLevel.Rare:
                return `rgba(255, 0, 255, ${opacity})`;
            case RarityLevel.Legendary:
                return `rgba(255, 127, 0, ${opacity})`;
        }
        return "";
    }

    public getCardColor(opacity:number): string {
        if (this.isEnabled) {
            return this.getRarityColor(opacity);
        } else {
            return `rgba(127, 127, 127, ${opacity})`;
        }
    }

    render() {
        return <Grid item xs={4}>
            <Card style={{
                backgroundColor: this.getCardColor(0.2),
                opacity: this.isEnabled ? 1.0 : 0.4,
            }}>
                <CardActionArea onClick={() => this.onClick()} disabled={!this.isEnabled}>
                    <div className="center">
                        <img
                            src={elementsImages[this.props.elementInfo.RequireKey]}
                            alt={this.props.elementInfo.Name}
                            style={{
                                height: this.imageHeight,
                            }}
                        />
                    </div>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" style={{color: this.getCardColor(1.0)}}>
                            {this.props.elementInfo.FriendlyName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {this.props.elementInfo.Description}
                            {!this.isEnabled && <><br /><br /><i>{this.props.elementInfo.HowToUnlock}</i></>}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    }
}
