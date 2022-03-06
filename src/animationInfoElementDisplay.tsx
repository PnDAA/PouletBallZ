import React from "react";
import { animationGifs } from "./Assets/UnityExport/animations";
import { IAnimationInfo } from "./chickenDisplayService";
import ElementDisplay from "./elementDisplay";

type AnimationInfoElementDisplayProps = {
    animationInfo: IAnimationInfo;
    onChangeClick?: () => void;
    enabled?: boolean;
}

export default class AnimationInfoElementDisplay extends React.Component<AnimationInfoElementDisplayProps> {
    render() {
        return <ElementDisplay
            image={animationGifs[this.props.animationInfo.RequireKey]}
            name={this.props.animationInfo.FriendlyName}
            description={this.props.animationInfo.Description}
            onChangeClick={this.props.onChangeClick}
            imageHeight={150}
            enabled={this.props.enabled}
        />
    }
}
