import React from 'react';
import { AnimationInfoType, Chicken, SpriteInfoType } from './restRequestsService';
import "./utils.css";
import { Grid } from '@mui/material';
import { ChickenDisplayService, IAnimationInfo, IChickenDisplayInfo, ISpriteInfo } from './chickenDisplayService';
import SpriteInfoElementDisplay from './spriteInfoElementDisplay';
import AnimationInfoElementDisplay from './animationInfoElementDisplay';
import ColorElementDisplay from './colorElementDisplay';
import Vector2D from './vector2D';
import { resolve } from 'node:path/win32';
import { start } from 'node:repl';
import { spritesImages } from './Assets/UnityExport/sprites';

type ChickenDisplayProps = {
    chicken: Chicken;
    onClickSpriteChange?: (type: SpriteInfoType) => void;
    onClickAnimationChange?: (type: AnimationInfoType) => void;
}

export class ChickenDisplay extends React.Component<ChickenDisplayProps> {
    canvasElement: HTMLCanvasElement | null | undefined;

    // TODO utility functions
    private drawImageInCanvasAsync(context: CanvasRenderingContext2D, imageFile: any, position:Vector2D):Promise<void> {
        // Promise to wait for the image to be render to render the next one
        // https://stackoverflow.com/a/36050919
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.onload = function () {
                context.drawImage(image, position.x, position.y);
                resolve();
            }
            image.onerror = () => reject(new Error("Can't load image"));
            image.src = imageFile;
        });
    }

    private async drawElementInCanvasAsync(context: CanvasRenderingContext2D, bodyPosition:Vector2D, spriteInfo:ISpriteInfo, elementPosition: [number, number]):Promise<void> {
        let cdi:IChickenDisplayInfo = ChickenDisplayService.getChickenDisplayInfo();

        // Pivot is specified from bottom left (y reversed). So we need to remove the sprite height.
        let realPivot = new Vector2D(-spriteInfo.Pivot[0], spriteInfo.Pivot[1] - spriteInfo.Size[1]);
        let pivot = Vector2D.add(bodyPosition, realPivot);

        // Remove x cause prefab is flipped
        // Remove y cause y is reversed
        // *ratio to change coordinate from unity game coordinate to image
        let ratio:number = 57;
        let elementImagePosition = Vector2D.add(pivot, new Vector2D(-elementPosition[0] * ratio, -elementPosition[1] * ratio))

        await this.drawImageInCanvasAsync(context, spritesImages[spriteInfo.RequireKey], elementImagePosition);
    }

    public async componentDidMount() {
        let context: CanvasRenderingContext2D = this.canvasElement!.getContext("2d")!;

        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // in case of redraw
        await this.drawImageInCanvasAsync(context, require("./Assets/UnityExport/body.png"), new Vector2D(0, 57));

        let cdi:IChickenDisplayInfo = ChickenDisplayService.getChickenDisplayInfo();

        let position: Vector2D = new Vector2D();
        // Go to bottom cause unity coordinates start from bottom
        // (-151 cause base body image doesn't have the legs)
        let startPosition = Vector2D.add(position, new Vector2D(0, context.canvas.height - 151));

        // -y cause y is flipped. Pivot is set from bottom so it works.
        let bodyPosition = Vector2D.add(startPosition, new Vector2D(cdi.BodyPivot[0], -cdi.BodyPivot[1]));

        this.drawElementInCanvasAsync(context, bodyPosition, ChickenDisplayService.getEyeInfo(this.chicken.Eye), cdi.EyePosition);
        this.drawElementInCanvasAsync(context, bodyPosition, ChickenDisplayService.getArmInfo(this.chicken.Arm), cdi.ArmPosition);
        this.drawElementInCanvasAsync(context, bodyPosition, ChickenDisplayService.getHairInfo(this.chicken.Hair), cdi.HairPosition);
        this.drawElementInCanvasAsync(context, bodyPosition, ChickenDisplayService.getMouthInfo(this.chicken.Mouth), cdi.MouthPosition);
    }

    public get chicken(): Chicken {
        return this.props.chicken;
    }

    public get eyeInfo(): ISpriteInfo {
        return ChickenDisplayService.getEyeInfo(this.chicken.Eye);
    }

    public get armInfo(): ISpriteInfo {
        return ChickenDisplayService.getArmInfo(this.chicken.Arm);
    }

    public get hairInfo(): ISpriteInfo {
        return ChickenDisplayService.getHairInfo(this.chicken.Hair);
    }

    public get mouthInfo(): ISpriteInfo {
        return ChickenDisplayService.getMouthInfo(this.chicken.Mouth);
    }

    public get walkAnimationInfo(): IAnimationInfo {
        return ChickenDisplayService.getWalkAnimationInfo(this.chicken.WalkAnimation);
    }

    public get waitAnimationInfo(): IAnimationInfo {
        return ChickenDisplayService.getWaitAnimationInfo(this.chicken.WaitAnimation);
    }

    onChangeColorClick() {
        throw new Error('Method not implemented.');
    }

    onChange() {
    }

    render() {
        return <>
            <div className='center'>
                <canvas width="356" height="600" ref={canvas => this.canvasElement = canvas} />
            </div>

            <Grid container spacing={2}>
                <SpriteInfoElementDisplay spriteInfo={this.eyeInfo} onChangeClick={() => this.props.onClickSpriteChange?.("Eye")} />
                <SpriteInfoElementDisplay spriteInfo={this.armInfo} onChangeClick={() => this.props.onClickSpriteChange?.("Arm")} />
                <SpriteInfoElementDisplay spriteInfo={this.hairInfo} onChangeClick={() => this.props.onClickSpriteChange?.("Hair")} />
                <SpriteInfoElementDisplay spriteInfo={this.mouthInfo} onChangeClick={() => this.props.onClickSpriteChange?.("Mouth")} />
            </Grid>
            <br />
            <Grid container spacing={2}>
                <AnimationInfoElementDisplay animationInfo={this.walkAnimationInfo} onChangeClick={() => this.props.onClickAnimationChange?.("Walk")} />
                <AnimationInfoElementDisplay animationInfo={this.waitAnimationInfo} onChangeClick={() => this.props.onClickAnimationChange?.("Wait")} />
            </Grid>
            <br />
            <Grid container spacing={2}>
                <ColorElementDisplay colorType="Primary" />
                <ColorElementDisplay colorType="Secondary" />
            </Grid>
        </>
    }
}
