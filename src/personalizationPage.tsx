import { CircularProgress } from "@mui/material";
import React from "react";
import ChickenAnimationSelector from "./chickenAnimationSelector";
import { ChickenDisplay } from "./chickenDisplay";
import { ChickenDisplayService } from "./chickenDisplayService";
import ChickenSpriteSelector from "./chickenSpriteSelector";
import { AnimationInfoType, Chicken, RestRequestsService, SpriteInfoType } from "./restRequestsService";

export default class PersonalizationPage extends React.Component {
    private _chicken: Chicken | null | undefined = undefined;

    private _selectedSpriteToChange?: SpriteInfoType;
    private _selectedAnimationToChange?: AnimationInfoType;

    async componentDidMount() {
        this._chicken = await RestRequestsService.getChickenAsync();
        if (this._chicken === null)
            this.setState({ chicken: "null" });
        await ChickenDisplayService.initializeAsync(); // use this spinner page for all loading
        this.setState({ chicken: this._chicken });
    }

    onWantSpriteChange(name: SpriteInfoType): void {
        this._selectedSpriteToChange = name;
        this.setState({ selectedSpriteToChange: this._selectedSpriteToChange });
    }

    onWantAnimationChange(name: AnimationInfoType): void {
        this._selectedAnimationToChange = name;
        this.setState({ selectedAnimationToChange: this._selectedAnimationToChange });
    }

    displayChickenDisplay() {
        this._selectedAnimationToChange = this._selectedSpriteToChange = undefined;
        this.setState({ chicken: this._chicken });
    }

    render() {
        if (this._chicken === undefined) {
            return <CircularProgress color="secondary" />;
        } else if (this._chicken === null) {
            return <h1>Vous n'avez pas de poulet. Faites !poulet sur le stream de <a href="https://www.twitch.tv/nikoballz">NikoBallZ</a>!</h1>
        } else if (this._selectedSpriteToChange !== undefined) {
            return <ChickenSpriteSelector
                spriteType={this._selectedSpriteToChange}
                onChangeClick={() => this.displayChickenDisplay()}
            />
        } else if (this._selectedAnimationToChange !== undefined) {
            return <ChickenAnimationSelector
                animationType={this._selectedAnimationToChange}
                onChangeClick={() => this.displayChickenDisplay()}
            />
        } else {
            return <>
                <ChickenDisplay
                    chicken={this._chicken}
                    onClickAnimationChange={(name) => this.onWantAnimationChange(name)}
                    onClickSpriteChange={(name) => this.onWantSpriteChange(name)}
                />
            </>
        }
    }
}
