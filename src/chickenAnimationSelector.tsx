import { AnimationInfoType, RestRequestsService } from './restRequestsService';
import { Grid } from "@mui/material";
import React from "react";
import { ChickenDisplayService, IAnimationInfo } from "./chickenDisplayService";
import AnimationInfoElementDisplay from './animationInfoElementDisplay';

type ChickenAnimationSelectorProps = {
    animationType:AnimationInfoType;
    onChangeClick:(index:number)=>void;
}

export default class ChickenAnimationSelector extends React.Component<ChickenAnimationSelectorProps> {
    onChangeClick(index:number) {
        RestRequestsService.setAnimationAsync(this.props.animationType, index);
        this.props.onChangeClick(index);
    }

    get animationsInfo():IAnimationInfo[] {
        return ChickenDisplayService
            .getAnimationsInfo(this.props.animationType)
            .filter(s => s !== undefined);
    }

    render() {
        return <>
            <Grid container spacing={2}>
            {
                this.animationsInfo.map((animationInfo:IAnimationInfo) =>
                    <AnimationInfoElementDisplay key={animationInfo.Name} animationInfo={animationInfo} onChangeClick={() => this.onChangeClick(animationInfo.Index)} />
                )
            }
            </Grid>
        </>
    }
}
