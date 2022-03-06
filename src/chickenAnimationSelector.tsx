import { AnimationInfoType, RestRequestsService } from './restRequestsService';
import { Grid } from "@mui/material";
import React from "react";
import { ChickenDisplayService, IAnimationInfo } from "./chickenDisplayService";
import AnimationInfoElementDisplay from './animationInfoElementDisplay';

type ChickenAnimationSelectorProps = {
    animationType: AnimationInfoType;
    onChangeClick: (index: number) => void;
}

export default class ChickenAnimationSelector extends React.Component<ChickenAnimationSelectorProps> {
    // Copy past of ChickenSpriteSelector. Could be refactored if AnimationInfo and SpriteInfo are merged.
    private _defaultItems: IAnimationInfo[];
    private _unlockedItems: IAnimationInfo[];
    private _lockedItems: IAnimationInfo[];
    private _allItems: IAnimationInfo[];

    public constructor(props: ChickenAnimationSelectorProps) {
        super(props);

        this._defaultItems = ChickenDisplayService.getChickenDisplayInfo().UnlockedByDefaults[this.props.animationType]
            .map(i => ChickenDisplayService.getAnimationsInfo(this.props.animationType)[i]);

        this._unlockedItems = RestRequestsService.getUnlockedAnimations(this.props.animationType)
            .map(i => i.Value)
            .map(i => ChickenDisplayService.getAnimationsInfo(this.props.animationType)[i]);

        this._lockedItems = ChickenDisplayService.getAnimationsInfo(this.props.animationType)
            .filter(s => s !== undefined)
            .filter(s => !this._defaultItems.some(i => i == s))
            .filter(s => !this._unlockedItems.some(i => i == s));

        this._allItems = this._defaultItems.concat(this._unlockedItems).concat(this._lockedItems);
    }

    onChangeClick(index: number) {
        RestRequestsService.setAnimationAsync(this.props.animationType, index);
        this.props.onChangeClick(index);
    }

    get animationsInfo(): IAnimationInfo[] {
        return this._allItems;
    }

    isEnabled(spriteInfo: IAnimationInfo) {
        return !this._lockedItems.some(s => s.Index == spriteInfo.Index);
    }

    render() {
        return <>
            <Grid container spacing={2}>
                {
                    this.animationsInfo.map((animationInfo: IAnimationInfo) =>
                        <AnimationInfoElementDisplay
                            key={animationInfo.Name}
                            animationInfo={animationInfo}
                            onChangeClick={() => this.onChangeClick(animationInfo.Index)}
                            enabled={this.isEnabled(animationInfo)}
                        />
                    )
                }
            </Grid>
        </>
    }
}
