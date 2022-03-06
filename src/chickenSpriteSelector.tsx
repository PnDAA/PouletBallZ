import { RestRequestsService, SpriteInfoType } from './restRequestsService';
import { Grid } from "@mui/material";
import React from "react";
import { ChickenDisplayService, ISpriteInfo } from "./chickenDisplayService";
import SpriteInfoElementDisplay from "./spriteInfoElementDisplay";

type ChickenElementSelectorProps = {
    spriteType: SpriteInfoType;
    onChangeClick: (index: number) => void;
}

export default class ChickenSpriteSelector extends React.Component<ChickenElementSelectorProps> {
    // Copy pasted on ChickenAnimationSelector see there why
    private _defaultItems: ISpriteInfo[];
    private _unlockedItems: ISpriteInfo[];
    private _lockedItems: ISpriteInfo[];
    private _allItems: ISpriteInfo[];

    public constructor(props: ChickenElementSelectorProps) {
        super(props);

        this._defaultItems = ChickenDisplayService.getChickenDisplayInfo().UnlockedByDefaults[this.props.spriteType]
            .map(i => ChickenDisplayService.getSpritesInfo(this.props.spriteType)[i]);

        this._unlockedItems = RestRequestsService.getUnlockedSprites(this.props.spriteType)
            .map(i => i.Value)
            .map(i => ChickenDisplayService.getSpritesInfo(this.props.spriteType)[i]);

        this._lockedItems = ChickenDisplayService.getSpritesInfo(this.props.spriteType)
            .filter(s => s !== undefined)
            .filter(s => !this._defaultItems.some(i => i == s))
            .filter(s => !this._unlockedItems.some(i => i == s));

        this._allItems = this._defaultItems.concat(this._unlockedItems).concat(this._lockedItems);
    }

    onChangeClick(index: number) {
        RestRequestsService.setSpriteAsync(this.props.spriteType, index);
        this.props.onChangeClick(index);
    }

    get spriteInfos(): ISpriteInfo[] {
        return this._allItems;
    }

    isEnabled(spriteInfo: ISpriteInfo) {
        return !this._lockedItems.some(s => s.Index == spriteInfo.Index);
    }

    render() {
        return <>
            <Grid container spacing={2}>
                {
                    this.spriteInfos.map((spriteInfo: ISpriteInfo) =>
                        <SpriteInfoElementDisplay
                            key={spriteInfo.Name}
                            spriteInfo={spriteInfo}
                            onChangeClick={() => this.onChangeClick(spriteInfo.Index)}
                            enabled={this.isEnabled(spriteInfo)}
                        />
                    )
                }
            </Grid>
        </>
    }
}
