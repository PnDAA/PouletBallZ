import { CircularProgress } from "@mui/material";
import React from "react";
import { ElementInfoType } from "./Assets/UnityExport/chickenElements";
import { ChickenDisplay } from "./chickenDisplay";
import { ChickenDisplayService } from "./chickenDisplayService";
import ChickenElementSelector from "./chickenElementSelector";
import { Chicken, RestRequestsService } from "./restRequestsService";

export default class PersonalizationPage extends React.Component {
    private _chicken: Chicken | null | undefined = undefined;

    private _selectedElementToChange?: ElementInfoType;

    async componentDidMount() {
        this._chicken = await RestRequestsService.getChickenAsync();
        if (this._chicken === null)
            this.setState({ chicken: "null" });
        await ChickenDisplayService.initializeAsync(); // use this spinner page for all loading
        this.setState({ chicken: this._chicken });
    }

    onWantElementChange(name: ElementInfoType): void {
        this._selectedElementToChange = name;
        this.setState({ selectedElementToChange: this._selectedElementToChange });
    }

    displayChickenDisplay() {
        this._selectedElementToChange = undefined;
        this.setState({ chicken: this._chicken });
    }

    render() {
        if (this._chicken === undefined) {
            return <CircularProgress color="secondary" />;
        } else if (this._chicken === null) {
            return <h1>Vous n'avez pas de poulet. Faites !poulet sur le stream de <a href="https://www.twitch.tv/nikoballz">NikoBallZ</a>!</h1>
        } else if (this._selectedElementToChange !== undefined) {
            return <ChickenElementSelector
                elementType={this._selectedElementToChange}
                onChangeClick={() => this.displayChickenDisplay()}
            />
        } else {
            return <>
                <ChickenDisplay
                    chicken={this._chicken}
                    onClickElementChange={(name) => this.onWantElementChange(name)}
                />
            </>
        }
    }
}
