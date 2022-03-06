import React from "react";
import { spritesImages } from "./Assets/UnityExport/sprites";
import { ISpriteInfo } from "./chickenDisplayService";
import ElementDisplay from "./elementDisplay";

type SpriteInfoElementDisplayProps = {
    spriteInfo: ISpriteInfo;
    onChangeClick?: () => void;
    enabled?: boolean;
}

export default class SpriteInfoElementDisplay extends React.Component<SpriteInfoElementDisplayProps> {
    render() {
        return <ElementDisplay
            image={spritesImages[this.props.spriteInfo.RequireKey]}
            name={this.props.spriteInfo.FriendlyName}
            description={this.props.spriteInfo.Description}
            onChangeClick={this.props.onChangeClick}
            imageHeight={50}
            enabled={ this.props.enabled }
        />
    }
}
