import React from 'react';
import { AnimationInfoType, Chicken, SpriteInfoType } from './restRequestsService';
import "./utils.css";
import { Grid } from '@mui/material';
import { ChickenDisplayService, IAnimationInfo, ISpriteInfo } from './chickenDisplayService';
import SpriteInfoElementDisplay from './spriteInfoElementDisplay';
import AnimationInfoElementDisplay from './animationInfoElementDisplay';
import ColorElementDisplay from './colorElementDisplay';

type ChickenDisplayProps = {
    chicken: Chicken;
    onClickSpriteChange?: (type: SpriteInfoType) => void;
    onClickAnimationChange?: (type: AnimationInfoType) => void;
}

export class ChickenDisplay extends React.Component<ChickenDisplayProps> {
    public get chicken() {
        return this.props.chicken;
    }

    public get eyeInfo(): ISpriteInfo {
        return ChickenDisplayService.getEyeInfo(this.chicken.Eye);
    }

    public get armInfo(): ISpriteInfo {
        return ChickenDisplayService.getArmInfo(this.chicken.Arm);
    }

    public get hairInfo(): ISpriteInfo {
        return ChickenDisplayService.getHairInfo(this.chicken.Hair);
    }

    public get mouthInfo(): ISpriteInfo {
        return ChickenDisplayService.getMouthInfo(this.chicken.Mouth);
    }

    public get walkAnimationInfo(): IAnimationInfo {
        return ChickenDisplayService.getWalkAnimationInfo(this.chicken.WalkAnimation);
    }

    public get waitAnimationInfo(): IAnimationInfo {
        return ChickenDisplayService.getWaitAnimationInfo(this.chicken.WaitAnimation);
    }

    onChangeColorClick() {
        throw new Error('Method not implemented.');
    }

    onChange() {
    }

    render() {
        return <>
            <Grid container spacing={2}>
                <SpriteInfoElementDisplay spriteInfo={this.eyeInfo} onChangeClick={() => this.props.onClickSpriteChange?.("Eye")} />
                <SpriteInfoElementDisplay spriteInfo={this.armInfo} onChangeClick={() => this.props.onClickSpriteChange?.("Arm")} />
                <SpriteInfoElementDisplay spriteInfo={this.hairInfo} onChangeClick={() => this.props.onClickSpriteChange?.("Hair")} />
                <SpriteInfoElementDisplay spriteInfo={this.mouthInfo} onChangeClick={() => this.props.onClickSpriteChange?.("Mouth")} />
            </Grid>
            <br />
            <Grid container spacing={2}>
                <AnimationInfoElementDisplay animationInfo={this.walkAnimationInfo} onChangeClick={() => this.props.onClickAnimationChange?.("Walk")} />
                <AnimationInfoElementDisplay animationInfo={this.waitAnimationInfo} onChangeClick={() => this.props.onClickAnimationChange?.("Wait")} />
            </Grid>
            <br />
            <Grid container spacing={2}>
                <ColorElementDisplay colorType="Primary" />
                <ColorElementDisplay colorType="Secondary" />
            </Grid>
        </>
    }
}
