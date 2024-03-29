import { ElementInfoType } from './Assets/UnityExport/chickenElements';
import AuthenticationService from './authenticationService';
import { rgbToHex } from './colorUtils';
import { EnvironmentInfo } from './environmentInfo';
import { Signal } from './signal';

export type Color = {
    r: number,
    g: number,
    b: number
};

export type UnlockedElementInfo = {
    Value: number,
    Reason: string,
    UnlockedDate: number
}

export interface Chicken {
    Arm: number;
    Eye: number;
    Hair: number;
    Mouth: number;
    Egg: number;
    WaitAnimation: number;
    WalkAnimation: number;
    PrimaryColor: Color;
    SecondaryColor: Color;
    UnlockedElements: { [type: string]: UnlockedElementInfo[] } | undefined;
    /* other fields are not necessary for now */
}

export type ColorType = "Primary" | "Secondary";

class RestRequestsServiceClass {
    public onColorChanged: Signal<RestRequestsServiceClass, string> = new Signal<RestRequestsServiceClass, string>();

    private static instance: RestRequestsServiceClass | undefined;
    static getInstance(): RestRequestsServiceClass {
        if (!RestRequestsServiceClass.instance)
            RestRequestsServiceClass.instance = new RestRequestsServiceClass();
        return RestRequestsServiceClass.instance;
    }

    private getHeaders() {
        return new Headers({
            "Authorization": "Bearer " + AuthenticationService.getToken()
        });
    }

    private disconectIf401(response: Response) {
        if (response.status === 401)
            AuthenticationService.disconnect();
    }

    private async sendRequest(api: string, requestInit: RequestInit = {}): Promise<Response> {
        requestInit.headers = this.getHeaders();
        return fetch(`${EnvironmentInfo.endpointUri}/${api}`, requestInit)
            .then((resp: Response) => {
                this.disconectIf401(resp);
                return resp;
            });
    }

    private _chicken: Chicken | null | undefined;

    public async getChickenAsync(): Promise<Chicken | null> {
        this._chicken = await this.sendRequest("GetChicken")
            .then<Chicken | null>(response => {
                if (response.status === 204) // No content => no chicken => null
                    return null;
                return response.json()
            });
        return this._chicken;
    }

    public getChicken(): Chicken {
        if (this._chicken === undefined)
            throw new Error("Not initialized");
        return this._chicken!;
    }

    public setElementAsync(elementInfoType: ElementInfoType, index: number): Promise<Response> {
        // Update local object
        switch (elementInfoType) {
            case "Arm": this._chicken!.Arm = index; break;
            case "Hair": this._chicken!.Hair = index; break;
            case "Eye": this._chicken!.Eye = index; break;
            case "Mouth": this._chicken!.Mouth = index; break;
            case "Egg": this._chicken!.Egg = index; break;
            case "Wait": this._chicken!.WaitAnimation = index; break;
            case "Walk": this._chicken!.WalkAnimation = index; break;
            default: throw new Error("Not implemented");
        }

        // Update database
        return this.sendRequest("SetElement", {
            method: "POST",
            body: JSON.stringify({ index: index, type: elementInfoType }),
        });
    }

    public getHexColorAsync(colorType: ColorType): string {
        let color: Color | undefined;
        switch (colorType) {
            case "Primary": color = this._chicken!.PrimaryColor; break;
            case "Secondary": color = this._chicken!.SecondaryColor; break;
            default: throw new Error("Not impl");
        }
        return rgbToHex(
            Math.round(color.r * 255),
            Math.round(color.g * 255),
            Math.round(color.b * 255)
        );
    }

    public setColorAsync(colorType: ColorType, color: Color): Promise<Response> {
        // Update local object
        switch (colorType) {
            case "Primary": this._chicken!.PrimaryColor = color; break;
            case "Secondary": this._chicken!.SecondaryColor = color; break;
            default: throw new Error("Not implemented");
        }

        // Send event
        this.onColorChanged.trigger(this, colorType);

        // Update database
        return this.sendRequest("SetColor", {
            method: "POST",
            body: JSON.stringify({ color: color, type: colorType }),
        });
    }

    private getUnlockedItem(key:string):UnlockedElementInfo[] {
        let unlockedElements:{[type:string]:UnlockedElementInfo[]} | undefined = this.getChicken().UnlockedElements;
        if (unlockedElements === undefined)
            return [];
        let typeUnlocked:UnlockedElementInfo[] | undefined = unlockedElements[key];
        if (typeUnlocked === undefined)
            return [];
        return typeUnlocked;
    }

    public getUnlockedElements(elementInfoType:ElementInfoType):UnlockedElementInfo[] {
        return this.getUnlockedItem(elementInfoType);
    }

    private isUnlocked(key:string, index:number): boolean {
        let unlockedElements:UnlockedElementInfo[] = this.getUnlockedItem(key);
        return unlockedElements.find(u => u.Value === index) !== undefined;
    }

    public isElementUnlocked(elementInfoType:ElementInfoType, index:number):boolean {
        return this.isUnlocked(elementInfoType, index);
    }
}

export const RestRequestsService = RestRequestsServiceClass.getInstance();
