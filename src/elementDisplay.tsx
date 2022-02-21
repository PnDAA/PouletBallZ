import { Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material";
import React from "react";

type ElementDisplayProps = {
    name:string;
    description:string;
    image: string;
    imageHeight: number;
    onChangeClick?: ()=>void;
}

export default class ElementDisplay extends React.Component<ElementDisplayProps> {
    render() {
        return <Grid item xs={4}>
            <Card>
                <CardActionArea onClick={() => this.props.onChangeClick?.()}>
                    <div className="center">
                        <img src={this.props.image} alt={this.props.name} style={{height: this.props.imageHeight }} />
                    </div>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {this.props.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {this.props.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    }
}
