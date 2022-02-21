import { Buffer } from 'buffer';
import { EnvironmentInfo } from './environmentInfo';

function makeid(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

let stateKey = "authentication_state";
let authenticationResultKey = "authentication_result";

enum AuthenticationState {
    Disconected, OnGoing, Connected
}

class AuthenticationService {
    private static instance: AuthenticationService | undefined;
    static getInstance(): AuthenticationService {
        if (!AuthenticationService.instance)
            AuthenticationService.instance = new AuthenticationService();
        return AuthenticationService.instance;
    }

    private _authenticationState: AuthenticationState;
    private _token: string | undefined;
    private _profilePicture: string | undefined;
    private _pseudo: string | undefined;

    public onAuthenticated: Promise<boolean>;

    constructor() {
        this._authenticationState = AuthenticationState.Disconected;

        this.onAuthenticated = new Promise((resolve, reject) => {
            // Authentication information are in the sessionStorage => we are connected
            let authenticationResult = sessionStorage.getItem(authenticationResultKey)
            if (authenticationResult) {
                console.log("Found authentication result...");
                try {
                    this.readAuthenticationResultStringified(authenticationResult);
                    resolve(true);
                }
                catch (e: any) { }
                return;
            }

            // Redirect uri => got the code in the query. Need to send a request to our backend to finalize authentication.
            let locationSearch = document.location.search;
            let storedState = sessionStorage.getItem(stateKey);
            sessionStorage.removeItem(stateKey);
            if (locationSearch && storedState) {
                console.log("Found location search...");
                let locationSearchParams = new URLSearchParams(locationSearch);
                let locationState = locationSearchParams.get('state');
                if (locationState === storedState) {
                    console.log("Good state...");
                    this._authenticationState = AuthenticationState.OnGoing;
                    let authCode = locationSearchParams.get('code');
                    if (authCode) {
                        fetch(`${EnvironmentInfo.endpointUri}/authenticate?code=${authCode}`)
                            .then(res => res.json(), (error) => { console.error(error); reject(); })
                            .then((result) => {
                                console.log("Authenticated !");

                                // Save result in sessionStorage to keep the token
                                sessionStorage.setItem(authenticationResultKey, JSON.stringify(result));

                                // Read result for current session
                                this.readAuthenticationResult(result);

                                // Remove the code from the query
                                window.history.pushState({}, document.title, window.location.pathname);

                                // ~ refresh current page with request's result
                                resolve(true);
                            }, (error) => {
                                console.error(error);
                                reject();
                            });
                        return; // don't resolve or reject, wait the request.
                    }
                } else {
                    console.log("Wrong state !");
                }
            }

            // Not connected
            resolve(false);
        });
    }

    // Go to twitch to retrieve the code. It will put the code in the query.
    authenticate(forceVerify: boolean = true) {
        // About state security: https://auth0.com/docs/secure/attack-protection/state-parameters
        // https://dev.twitch.tv/docs/authentication/getting-tokens-oidc/
        let publicClientId = "5t95de0nzyqvi58sssmurtc8tbdhrj";
        let redirectUrl = window.location.origin;
        let scope = "openid user:read:email";
        let claims = JSON.stringify({ "id_token": { "email": null }, "userinfo": { "picture": null } });
        let state = makeid(10);
        sessionStorage.setItem(stateKey, state);
        let connectUri = `https://id.twitch.tv/oauth2/authorize?client_id=${publicClientId}&redirect_uri=${redirectUrl}&response_type=code&scope=${scope}&state=${state}&force_verify=${forceVerify}&claims=${claims}`;

        window.location.href = connectUri;
    }

    disconnect() {
        console.log("Disconnecting...")
        sessionStorage.removeItem("authentication_result")
        window.location.href = window.location.origin;
    }

    readAuthenticationResultStringified(result: string) {
        try {
            this.readAuthenticationResult(JSON.parse(result));
        } catch {
            this.disconnect();
        }
    }

    _reauthenticateTimeoutId: NodeJS.Timeout | undefined;
    readAuthenticationResult(result: { token: string, user_info: { profile_image_url: string, display_name: string }, expires_in: number }) {
        this._token = result.token;
        this._profilePicture = result.user_info.profile_image_url;
        this._pseudo = result.user_info.display_name;
        this._authenticationState = AuthenticationState.Connected;

        const token: any = JSON.parse(Buffer.from(this._token.split(".")[1], 'base64').toString());
        const expiration: number = token["exp"] * 1000;

        // Automatically disconnect if come in the website after a long time.
        const now = Date.now();
        if (now > expiration)
            this.disconnect();

        if (this._reauthenticateTimeoutId !== undefined)
            clearTimeout(this._reauthenticateTimeoutId);
        this._reauthenticateTimeoutId = setTimeout(() => {
            // "refresh token": ask for a new code and get an id_token again. Can't use a refresh_token.
            this.disconnect(); // reset all variables
            this.authenticate(false);
        }, (expiration - now) * 0.8); // TODO won't work cause if reload the page expires_in is dumb
    }

    getPseudo(): string {
        return this._pseudo!;
    }

    getProfilePicture(): string {
        return this._profilePicture!;
    }

    getToken(): string {
        return this._token!;
    }

    isConnected(): boolean {
        return this._authenticationState === AuthenticationState.Connected;
    }

    isConnectionOnGoing(): boolean {
        return this._authenticationState === AuthenticationState.OnGoing;
    }

    isDisconnected(): boolean {
        return this._authenticationState === AuthenticationState.Disconected;
    }
}

export default AuthenticationService.getInstance();