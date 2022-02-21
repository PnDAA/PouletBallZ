import Button from '@mui/material/Button';
import React from 'react';
import "./utils.css";

declare global {
    interface Window {
        Twitch: any;
    }
}

export default class TwitchPlayer extends React.Component {
    private _displayStream: boolean;
    private _twitchPlayerIsDisplayed: boolean; // To avoid to reopen the twitch stream on each update.

    private twitchPlayerOption: any;

    constructor(props: any) {
        super(props);
        this._displayStream = false;
        this._twitchPlayerIsDisplayed = false;
    }

    private openTwitchPlayerIfAsked() {
        if (this._displayStream && !this._twitchPlayerIsDisplayed) {
            this.twitchPlayerOption = {
                width: 854,
                height: 480,
                channel: "nikoballz",
                autoplay: true,
                muted: false
            }
            new window.Twitch.Embed("twitch-embed", this.twitchPlayerOption);
            this._twitchPlayerIsDisplayed = true;
        }
        if (!this._displayStream)
            this._twitchPlayerIsDisplayed = false;
    }

    componentDidUpdate() {
        this.openTwitchPlayerIfAsked();
    }

    componentDidMount() {
        this.openTwitchPlayerIfAsked();
    }

    public setDisplayStream(open: boolean): void {
        this._displayStream = open;
        this.setState({ displayStream: open });
    }

    render() {
        // To embed twitch stream (https://dev.twitch.tv/docs/embed/everything)
        return <>
            <div className="center" style={{ border: "1px solid purple" }}>
                {this._displayStream ? (
                    <>
                        <div id="twitch-embed"></div>
                        <Button  color="secondary" variant="text" onClick={() => this.setDisplayStream(false)}>Hide stream</Button>
                    </>
                ) : (
                    <Button color="secondary" variant="text" onClick={() => this.setDisplayStream(true)}>Open stream</Button>
                )}
            </div>
        </>
    }
}
