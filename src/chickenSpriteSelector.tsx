import { RestRequestsService, SpriteInfoType } from './restRequestsService';
import { Grid } from "@mui/material";
import React from "react";
import { ChickenDisplayService, ISpriteInfo } from "./chickenDisplayService";
import SpriteInfoElementDisplay from "./spriteInfoElementDisplay";

type ChickenElementSelectorProps = {
    spriteType:SpriteInfoType;
    onChangeClick:(index:number)=>void;
}

export default class ChickenSpriteSelector extends React.Component<ChickenElementSelectorProps> {
    onChangeClick(index:number) {
        RestRequestsService.setSpriteAsync(this.props.spriteType, index);
        this.props.onChangeClick(index);
    }

    get spritesInfo():ISpriteInfo[] {
        return ChickenDisplayService
            .getSpritesInfo(this.props.spriteType)
            .filter(s => s !== undefined);
    }

    render() {
        return <>
            <Grid container spacing={2}>
            {
                this.spritesInfo.map((spriteInfo:ISpriteInfo) =>
                    <SpriteInfoElementDisplay key={spriteInfo.Name} spriteInfo={spriteInfo} onChangeClick={() => this.onChangeClick(spriteInfo.Index)} />
                )
            }
            </Grid>
        </>
    }
}
