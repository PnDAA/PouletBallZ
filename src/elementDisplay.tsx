import { Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import { elementsImages } from "./Assets/UnityExport/chickenElements";
import CardElementParticles from "./cardElementParticles";
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

    public getRarityColor(opacity: number): string {
        switch (this.props.elementInfo.Rarity) {
            case RarityLevel.Junk:
                return `rgba(255, 255, 255, ${opacity})`;
            case RarityLevel.Normal:
                return `rgba(0, 255, 0, ${opacity})`;
            case RarityLevel.Rare:
                return `rgba(255, 0, 255, ${opacity})`;
            case RarityLevel.Legendary:
                return `rgba(255, 127, 0, ${opacity})`;
        }
        return "";
    }

    public getTextColor(): string {
        switch (this.props.elementInfo.Rarity) {
            case RarityLevel.Junk:
                return `rgb(0, 0, 0)`;
        }
        return this.getRarityColor(1);
    }

    public getParticleColor(opacity:number): string {
        switch (this.props.elementInfo.Rarity) {
            case RarityLevel.Junk:
                return `rgba(0, 0, 0, ${opacity})`;
        }
        return this.getRarityColor(opacity);
    }

    public getParticleLinkRange(): number {
        switch (this.props.elementInfo.Rarity) {
            case RarityLevel.Junk:
                return 0;
            case RarityLevel.Normal:
                return 50;
            case RarityLevel.Rare:
                return 100;
            case RarityLevel.Legendary:
                return 150;
        }
        return 0;
    }

    public getParticleShape(): string {
        switch (this.props.elementInfo.Rarity) {
            case RarityLevel.Junk:
                return "circle";
            case RarityLevel.Normal:
                return "square";
            case RarityLevel.Rare:
                return "triangle";
            case RarityLevel.Legendary:
                return "star";
        }
        return "square";
    }

    public getParticleCount(): number {
        switch (this.props.elementInfo.Rarity) {
            case RarityLevel.Junk:
                return 10;
            case RarityLevel.Normal:
                return 80;
            case RarityLevel.Rare:
                return 100;
            case RarityLevel.Legendary:
                return 130;
        }
        return 10;
    }

    public getCardColor(opacity: number): string {
        if (this.isEnabled) {
            return this.getRarityColor(opacity);
        } else {
            return `rgba(127, 127, 127, ${opacity})`;
        }
    }

    public get isParticleActivated(): boolean {
        return this.isEnabled && this.props.elementInfo.Rarity !== RarityLevel.Junk;
    }

    render() {
        return <Grid item xs={4}>
            <Card style={{
                backgroundColor: this.getCardColor(0.2),
                opacity: this.isEnabled ? 1.0 : 0.4,
                position: "relative"
            }}>
                {
                    this.isParticleActivated && <CardElementParticles
                        id={this.props.elementInfo.RequireKey}
                        backgroundColor={this.getCardColor(1)}
                        particleColor={this.getParticleColor(1)}
                        opacity={0.2}
                        shape={this.getParticleShape()}
                        linkRange={this.getParticleLinkRange()}
                        count={this.getParticleCount()}
                        style={{
                            position: "absolute",
                            left: "0px",
                            top: "0px",
                            right: "0px",
                            bottom: "0px"
                        }}
                    />
                }

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
                        <Typography gutterBottom variant="h5" component="div" style={{ color: this.getTextColor() }}>
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
