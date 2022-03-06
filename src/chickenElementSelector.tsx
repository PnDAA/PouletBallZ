import { RestRequestsService } from './restRequestsService';
import { Grid } from "@mui/material";
import React from "react";
import { ChickenDisplayService, ElementInfo } from "./chickenDisplayService";
import { ElementInfoType } from './Assets/UnityExport/chickenElements';
import ElementDisplay from './elementDisplay';

type ChickenElementSelectorProps = {
    elementType: ElementInfoType;
    onChangeClick: (index: number) => void;
}

export default class ChickenElementSelector extends React.Component<ChickenElementSelectorProps> {
    // Copy pasted on ChickenAnimationSelector see there why
    private _defaultItems: ElementInfo[];
    private _unlockedItems: ElementInfo[];
    private _lockedItems: ElementInfo[];
    private _allItems: ElementInfo[];

    public constructor(props: ChickenElementSelectorProps) {
        super(props);

        let elementInfos = ChickenDisplayService.getElementsInfo(this.props.elementType);

        this._defaultItems = ChickenDisplayService.getChickenDisplayInfo().UnlockedByDefault[this.props.elementType]
            .map(i => elementInfos[i]);

        this._unlockedItems = RestRequestsService.getUnlockedElements(this.props.elementType)
            .map(i => i.Value)
            .map(i => elementInfos[i]);

        this._lockedItems = elementInfos
            .filter(s => s !== undefined)
            .filter(s => !this._defaultItems.some(i => i === s))
            .filter(s => !this._unlockedItems.some(i => i === s));

        this._allItems = this._defaultItems.concat(this._unlockedItems).concat(this._lockedItems);
    }

    onChangeClick(index: number) {
        RestRequestsService.setElementAsync(this.props.elementType, index);
        this.props.onChangeClick(index);
    }

    get spriteInfos(): ElementInfo[] {
        return this._allItems;
    }

    isEnabled(elementInfo: ElementInfo) {
        return !this._lockedItems.some(s => s.Index === elementInfo.Index);
    }

    render() {
        return <>
            <Grid container spacing={2}>
                {
                    this.spriteInfos.map((elementInfo: ElementInfo) =>
                        <ElementDisplay
                            key={elementInfo.Name}
                            onChangeClick={() => this.onChangeClick(elementInfo.Index)}
                            elementInfo={elementInfo}
                            enabled={this.isEnabled(elementInfo)}
                        />
                    )
                }
            </Grid>
        </>
    }
}
