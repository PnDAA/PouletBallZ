import { AnimationInfoType, SpriteInfoType } from './restRequestsService';
import chickenJson from './Assets/UnityExport/chicken.json';
import { spritesImages, spritesJsons } from './Assets/UnityExport/sprites';
import { animationGifs, animationsJsons } from './Assets/UnityExport/animations';

/*
    Files are in src and not in public to be usable in production + it is good practice:
        https://create-react-app.dev/docs/using-the-public-folder/#when-to-use-the-public-folder
        https://stackoverflow.com/a/45300180
*/

export interface IChickenDisplayInfo {
    BodyPosition: [number, number];
    BodyPivot: [number, number];
    ArmPosition: [number, number];
    HairPosition: [number, number];
    MouthPosition: [number, number];
    EyePosition: [number, number];

    WaitAnimationsMapping: string[];
    WalkAnimationsMapping: string[];
    ArmMapping: string[];
    HairMapping: string[];
    MouthMapping: string[];
    EyeMapping: string[];

    UnlockedByDefaults: { [key: string]: number[] }
}

export interface IAnimationInfo {
    RequireKey: string;
    Index: number;
    Name: string;
    FriendlyName: string;
    Description: string;
    Gif: string;
}

export interface ISpriteInfo {
    RequireKey: string;
    Index: number;
    Name: string;
    FriendlyName: string;
    Description: string;
    Image: string;
    Size: [number, number];
    Pivot: [number, number];
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
    private _armsInfo: ISpriteInfo[] | undefined;
    private _hairsInfo: ISpriteInfo[] | undefined;
    private _eyesInfo: ISpriteInfo[] | undefined;
    private _mouthsInfo: ISpriteInfo[] | undefined;
    private _walkAnimationInfo: IAnimationInfo[] | undefined;
    private _waitAnimationInfo: IAnimationInfo[] | undefined;

    public async initializeAsync() {
        this._chickenDisplayInfo = chickenJson as unknown as IChickenDisplayInfo; // compiled doesn't like [number, number] :(, so have to cast to unknown first.

        // TODO Could change the exporter to automatically create that structure instead of writting jsons
        // TODO Could change the exporter to declare the spriteTypes, animationTypes and IpPriteInfo / IAnimationInfo
        /* Sprites */
        this._armsInfo = [];
        for (let armName of this._chickenDisplayInfo!.ArmMapping) {
            this._armsInfo.push(spritesJsons[`Arms.${armName}`]);
        }

        this._hairsInfo = [];
        for (let hairName of this._chickenDisplayInfo!.HairMapping) {
            this._hairsInfo.push(spritesJsons[`Hairs.${hairName}`]);
        }

        this._eyesInfo = [];
        for (let eyeName of this._chickenDisplayInfo!.EyeMapping) {
            this._eyesInfo.push(spritesJsons[`Eyes.${eyeName}`]);
        }

        this._mouthsInfo = [];
        for (let mouthName of this._chickenDisplayInfo!.MouthMapping) {
            this._mouthsInfo.push(spritesJsons[`Mouths.${mouthName}`]);
        }

        /* Animations */
        this._waitAnimationInfo = [];
        for (let waitName of this._chickenDisplayInfo!.WaitAnimationsMapping) {
            this._waitAnimationInfo.push(animationsJsons[`WaitAnimations.${waitName}`]);
        }

        this._walkAnimationInfo = [];
        for (let walkName of this._chickenDisplayInfo!.WalkAnimationsMapping) {
            this._walkAnimationInfo.push(animationsJsons[`WalkAnimations.${walkName}`]);
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

    public getArmInfo(index: number): ISpriteInfo {
        this.checkIsInitialized();
        return this._armsInfo![index];
    }

    public getEyeInfo(index: number): ISpriteInfo {
        this.checkIsInitialized();
        return this._eyesInfo![index];
    }

    public getMouthInfo(index: number): ISpriteInfo {
        this.checkIsInitialized();
        return this._mouthsInfo![index];
    }

    public getHairInfo(index: number): ISpriteInfo {
        this.checkIsInitialized();
        return this._hairsInfo![index];
    }

    public getWalkAnimationInfo(index: number): IAnimationInfo {
        this.checkIsInitialized();
        return this._walkAnimationInfo![index];
    }

    public getWaitAnimationInfo(index: number): IAnimationInfo {
        this.checkIsInitialized();
        return this._waitAnimationInfo![index];
    }

    public getArmImage(index: number): any {
        this.checkIsInitialized();
        return spritesImages[this._armsInfo![index].RequireKey];
    }

    public getEyeImage(index: number): ISpriteInfo {
        this.checkIsInitialized();
        return spritesImages[this._eyesInfo![index].RequireKey];
    }

    public getMouthImage(index: number): ISpriteInfo {
        this.checkIsInitialized();
        return spritesImages[this._mouthsInfo![index].RequireKey];
    }

    public getHairImage(index: number): ISpriteInfo {
        this.checkIsInitialized();
        return spritesImages[this._hairsInfo![index].RequireKey];
    }

    public getWalkAnimationImage(index: number): IAnimationInfo {
        this.checkIsInitialized();
        return animationGifs[this._walkAnimationInfo![index].RequireKey];
    }

    public getWaitAnimationImage(index: number): IAnimationInfo {
        this.checkIsInitialized();
        return animationGifs[this._waitAnimationInfo![index].RequireKey];
    }

    public getSpritesInfo(spriteType: SpriteInfoType): ISpriteInfo[] {
        switch (spriteType) {
            case "Arm": return this.armsInfo;
            case "Eye": return this.eyesInfo;
            case "Hair": return this.hairsInfo;
            case "Mouth": return this.mouthsInfo;
            default: throw new Error("Not implemented");
        }
    }

    public getAnimationsInfo(animationType: AnimationInfoType): IAnimationInfo[] {
        switch (animationType) {
            case "Walk": return this.walkAnimationInfo;
            case "Wait": return this.waitAnimationInfo;
            default: throw new Error("Not implemented");
        }
    }

    private isUnlockedByDefault(key: string, index: number): boolean {
        return this._chickenDisplayInfo?.UnlockedByDefaults[key].find(i => i === index) !== undefined;
    }

    public isSpriteUnlockedByDefault(spriteType: SpriteInfoType, index: number): boolean {
        return this.isUnlockedByDefault(spriteType, index);
    }

    public isAnimationUnlockedByDefault(animationType: AnimationInfoType, index: number): boolean {
        return this.isUnlockedByDefault(animationType, index);
    }

    public get eyesInfo(): ISpriteInfo[] { return this._eyesInfo!; }
    public get hairsInfo(): ISpriteInfo[] { return this._hairsInfo!; }
    public get mouthsInfo(): ISpriteInfo[] { return this._mouthsInfo!; }
    public get armsInfo(): ISpriteInfo[] { return this._armsInfo!; }
    public get walkAnimationInfo(): IAnimationInfo[] { return this._walkAnimationInfo!; }
    public get waitAnimationInfo(): IAnimationInfo[] { return this._waitAnimationInfo!; }
}

export const ChickenDisplayService = ChickenDisplayServiceClass.getInstanceAsync();
