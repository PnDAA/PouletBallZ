import React from 'react';
import { Chicken } from './restRequestsService';
import "./utils.css";
import { Grid } from '@mui/material';
import { ChickenDisplayService, ElementInfo } from './chickenDisplayService';
import ColorElementDisplay from './colorElementDisplay';
import ChickenPrevisualization from './chickenPrevisualization';
import ElementDisplay from './elementDisplay';
import { ElementInfoType } from './Assets/UnityExport/chickenElements';

type ChickenDisplayProps = {
    chicken: Chicken;
    onClickElementChange?: (type: ElementInfoType) => void;
}

export class ChickenDisplay extends React.Component<ChickenDisplayProps> {
    public get chicken(): Chicken {
        return this.props.chicken;
    }

    public get eyeInfo(): ElementInfo {
        return ChickenDisplayService.getEyeInfo(this.chicken.Eye);
    }

    public get armInfo(): ElementInfo {
        return ChickenDisplayService.getArmInfo(this.chicken.Arm);
    }

    public get hairInfo(): ElementInfo {
        return ChickenDisplayService.getHairInfo(this.chicken.Hair);
    }

    public get mouthInfo(): ElementInfo {
        return ChickenDisplayService.getMouthInfo(this.chicken.Mouth);
    }

    public get eggInfo(): ElementInfo {
        return ChickenDisplayService.getEggInfo(this.chicken.Egg);
    }

    public get walkAnimationInfo(): ElementInfo {
        return ChickenDisplayService.getWalkAnimationInfo(this.chicken.WalkAnimation);
    }

    public get waitAnimationInfo(): ElementInfo {
        return ChickenDisplayService.getWaitAnimationInfo(this.chicken.WaitAnimation);
    }

    onChangeColorClick() {
        throw new Error('Method not implemented.');
    }

    onChange() {
    }

    render() {
        return <>
            <ChickenPrevisualization />
            <br />
            <Grid container spacing={2}>
                <ElementDisplay elementInfo={this.eyeInfo} onChangeClick={() => this.props.onClickElementChange?.("Eye")} />
                <ElementDisplay elementInfo={this.armInfo} onChangeClick={() => this.props.onClickElementChange?.("Arm")} />
                <ElementDisplay elementInfo={this.hairInfo} onChangeClick={() => this.props.onClickElementChange?.("Hair")} />
                <ElementDisplay elementInfo={this.mouthInfo} onChangeClick={() => this.props.onClickElementChange?.("Mouth")} />

                {
                    // Check this.eggInfo cause Egg could be not defined in the DB if the user didn't login after the drop update.
                    this.eggInfo && <ElementDisplay elementInfo={this.eggInfo} onChangeClick={() => this.props.onClickElementChange?.("Egg")} />
                }
            </Grid>
            <br />
            <Grid container spacing={2}>
                <ElementDisplay elementInfo={this.walkAnimationInfo} onChangeClick={() => this.props.onClickElementChange?.("Walk")} />
                <ElementDisplay elementInfo={this.waitAnimationInfo} onChangeClick={() => this.props.onClickElementChange?.("Wait")} />
            </Grid>
            <br />
            <Grid container spacing={2}>
                <ColorElementDisplay colorType="Primary" />
                <ColorElementDisplay colorType="Secondary" />
            </Grid>
        </>
    }
}
