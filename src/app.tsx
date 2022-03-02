import React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import AuthenticationService from './authenticationService';
import Container from '@mui/material/Container';
import Topbar from './topBar';
import TwitchPlayer from './twitchPlayer';
import PersonalizationPage from './personalizationPage';
import { Typography } from '@mui/material';

export default class App extends React.Component {
    // TODO handle token expiration

    componentDidMount() {
        AuthenticationService.onAuthenticated.then((state) => {
            console.log(`Authentication change to ${state}`);
            console.log(AuthenticationService.isConnected());
            this.setState({ state });
        });
    }

    render() {
        if (AuthenticationService.isDisconnected()) {
            return (
                <div className='center'>
                    <div style={{paddingBottom: "70px"}}>
                        <img src={require("./Assets/Logo.png")} alt="logo"></img>
                    </div>
                    <Button variant="contained" onClick={() => AuthenticationService.authenticate()}>
                        Connexion avec Twitch
                    </Button>
                </div>
            );
        } else if (AuthenticationService.isConnectionOnGoing()) {
            return (
                <div className="center">
                    <CircularProgress color="secondary" />
                    <Typography>Connexion en cours...</Typography>
                </div>
            );
        } else if (AuthenticationService.isConnected()) {
            return (
                <>
                    <Topbar />
                    <TwitchPlayer />

                    <br />

                    <Container maxWidth="lg">
                        <PersonalizationPage />
                    </Container>
                </>
            );
        } else {
            <p>Unknown state</p>
        }
    }
}
