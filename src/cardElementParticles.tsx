import React, { CSSProperties } from "react";
import Particles from "react-tsparticles";

type CardElementParticlesProps = {
    id: string;
    style: CSSProperties | undefined;
    backgroundColor: string;
    particleColor: string;
    opacity: number;
    shape: string;
    linkRange: number;
    count: number;
}

export default class CardElementParticles extends React.Component<CardElementParticlesProps> {
    public render() {
        return <div style={this.props.style}>
            <Particles
                id={`tsparticles ${this.props.id}`}
                height="300px"
                options={{
                    background: {
                        color: {
                            value: this.props.backgroundColor,
                        },
                        opacity: this.props.opacity,
                    },
                    fpsLimit: 120,
                    interactivity: {
                        events: {
                            resize: true,
                        },
                    },
                    particles: {
                        color: {
                            value: this.props.particleColor,
                        },
                        links: {
                            color: this.props.particleColor,
                            distance: this.props.linkRange,
                            enable: true,
                            opacity: 0.5,
                            width: 1,
                        },
                        collisions: {
                            enable: false,
                        },
                        move: {
                            direction: "none",
                            enable: true,
                            outMode: "bounce",
                            random: false,
                            speed: 6,
                            straight: false,
                        },
                        number: {
                            density: {
                                enable: true,
                                area: 800,
                            },
                            value: this.props.count,
                        },
                        opacity: {
                            value: 0.5,
                        },
                        shape: {
                            type: this.props.shape
                        },
                        size: {
                            random: true,
                            value: {
                                min: 3,
                                max: 7
                            }
                        },
                    },
                    detectRetina: false,
                    fullScreen: false,
                }}
            />
        </div>
    }
}
