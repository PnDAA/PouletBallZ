import { Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material";
import React from "react";

type ElementDisplayProps = {
    name: string;
    description: string;
    image: string;
    imageHeight: number;
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

    render() {
        return <Grid item xs={4}>
            <Card style={{ backgroundColor: this.isEnabled ? "white" : "lightgray" }}>
                <CardActionArea onClick={() => this.onClick()} disabled={!this.isEnabled}>
                    <div className="center">
                        <img
                            src={this.props.image}
                            alt={this.props.name}
                            style={{
                                height: this.props.imageHeight,
                                opacity: this.isEnabled ? 1 : 0.4
                            }}
                        />
                    </div>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" style={{ opacity: this.isEnabled ?  1 : 0.4 }}>
                            {this.props.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" style={{ opacity: this.isEnabled ?  1 : 0.4 }}>
                            {this.props.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    }
}
