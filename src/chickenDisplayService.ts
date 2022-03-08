import chickenJson from './Assets/UnityExport/chicken.json';
import { ElementInfoType, elementsImages, elementsJsons } from './Assets/UnityExport/chickenElements';

/*
    Files are in src and not in public to be usable in production + it is good practice:
        https://create-react-app.dev/docs/using-the-public-folder/#when-to-use-the-public-folder
        https://stackoverflow.com/a/45300180
*/

export interface IChickenDisplayInfo {
    BodyPosition: [number, number];
    BodyPivot: [number, number];
    LeftArmPosition: [number, number];
    RightArmPosition: [number, number];
    HairPosition: [number, number];
    MouthPosition: [number, number];
    EyePosition: [number, number];

    Mapping: { [key:string]: string[] };
    UnlockedByDefault: { [key: string]: number[] };
    ChickenElementKinds: string[];
}

export enum RarityLevel
{
    Junk,
    Normal,
    Rare,
    Legendary,
}

export enum ElementColor
{
    Primary,
    Secondary,
    None,
}

export type ImageInfo = {
    RequireKey:string;
    Path:string;
    Name:string;
    Size:number[] | null;
    Pivot:number[] | null;
}

export type ElementInfo = {
    RequireKey: string;
    Index: number;
    Name: string;
    FriendlyName: string;
    Description: string;
    HowToUnlock: string,
    Rarity: RarityLevel,
    Color: ElementColor,
    Images: ImageInfo[]
}

export class ChickenDisplayServiceClass {
    private static instance: ChickenDisplayServiceClass | undefined;

    static getInstanceAsync(): ChickenDisplayServiceClass {
        if (!ChickenDisplayServiceClass.instance)
            ChickenDisplayServiceClass.instance = new ChickenDisplayServiceClass();
        return ChickenDisplayServiceClass.instance;
    }

    private _initialized: boolean = false;
    private _chickenDisplayInfo: IChickenDisplayInfo | undefined;
    private _elementsInfo: { [key:string]: ElementInfo[] } | undefined;

    public async initializeAsync() {
        this._chickenDisplayInfo = chickenJson as unknown as IChickenDisplayInfo; // compiled doesn't like [number, number] :(, so have to cast to unknown first.

        /* Elements */
        this._elementsInfo = {};
        for (let key of this._chickenDisplayInfo.ChickenElementKinds)
        {
            this._elementsInfo[key] = [];
            for (let elementName of this._chickenDisplayInfo.Mapping[key])
            {
                let elementInfo:ElementInfo = elementsJsons[`${key}.${elementName}`];
                this._elementsInfo[key].push(elementInfo);
            }
        }

        /**/
        this._initialized = true;
    }

    private checkIsInitialized() {
        if (!this._initialized)
            throw new Error("Service not initialized");
    }

    public get isInitialized() {
        return this._initialized;
    }

    public getChickenDisplayInfo(): IChickenDisplayInfo {
        this.checkIsInitialized();
        return this._chickenDisplayInfo!;
    }

    public getElementInfo(elementType: ElementInfoType, index: number): ElementInfo {
        this.checkIsInitialized();
        return this._elementsInfo![elementType][index];
    }

    public getArmInfo(index: number): ElementInfo {
        return this.getElementInfo("Arm", index);
    }

    public getEyeInfo(index: number): ElementInfo {
        return this.getElementInfo("Eye", index);
    }

    public getMouthInfo(index: number): ElementInfo {
        return this.getElementInfo("Mouth", index);
    }

    public getHairInfo(index: number): ElementInfo {
        return this.getElementInfo("Hair", index);
    }

    public getWalkAnimationInfo(index: number): ElementInfo {
        return this.getElementInfo("Walk", index);
    }

    public getWaitAnimationInfo(index: number): ElementInfo {
        return this.getElementInfo("Wait", index);
    }

    public getElementImage(elementType: ElementInfoType, index: number): any {
        return elementsImages[this.getElementInfo(elementType, index).Images[0].RequireKey];
    }

    public getArmImage(index: number): any {
        return this.getElementImage("Arm", index);
    }

    public getEyeImage(index: number): any {
        return this.getElementImage("Eye", index);
    }

    public getMouthImage(index: number): any {
        return this.getElementImage("Mouth", index);
    }

    public getHairImage(index: number): any {
        return this.getElementImage("Hair", index);
    }

    public getWalkAnimationImage(index: number): any {
        return this.getElementImage("Walk", index);
    }

    public getWaitAnimationImage(index: number): any {
        return this.getElementImage("Wait", index);
    }

    public getElementsInfo(spriteType: ElementInfoType): ElementInfo[] {
        this.checkIsInitialized();
        return this._elementsInfo![spriteType];
    }

    private isUnlockedByDefault(key: string, index: number): boolean {
        return this._chickenDisplayInfo?.UnlockedByDefault[key].find(i => i === index) !== undefined;
    }

    public isElementUnlockedByDefault(elementInfoType: ElementInfoType, index: number): boolean {
        return this.isUnlockedByDefault(elementInfoType, index);
    }

    public get eyesInfo(): ElementInfo[] { return this.getElementsInfo("Eye"); }
    public get hairsInfo(): ElementInfo[] { return this.getElementsInfo("Hair"); }
    public get mouthsInfo(): ElementInfo[] { return this.getElementsInfo("Mouth"); }
    public get armsInfo(): ElementInfo[] { return this.getElementsInfo("Arm"); }
    public get walkAnimationInfo(): ElementInfo[] { return this.getElementsInfo("Walk"); }
    public get waitAnimationInfo(): ElementInfo[] { return this.getElementsInfo("Wait"); }
}

export const ChickenDisplayService = ChickenDisplayServiceClass.getInstanceAsync();
