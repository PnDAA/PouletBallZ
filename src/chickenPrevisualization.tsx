import React from "react";
import "./utils.css";
import Vector2D from './vector2D';
import { spritesImages } from './Assets/UnityExport/sprites';
import { ChickenDisplayService, IChickenDisplayInfo, ISpriteInfo } from "./chickenDisplayService";
import { RestRequestsService } from "./restRequestsService";

export default class ChickenPrevisualization extends React.Component {
    canvasElement: HTMLCanvasElement | null | undefined;

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

        // Draw at 57 cause canvas is bigger in heigth than the image to be able to display hairs correctly. To put the image at the bottom of the canvas I've add the difference.
        await this.drawImageInCanvasAsync(context, require("./Assets/UnityExport/body.png"), new Vector2D(0, 57));

        let cdi:IChickenDisplayInfo = ChickenDisplayService.getChickenDisplayInfo();

        let position: Vector2D = new Vector2D();
        // Go to bottom cause unity coordinates start from bottom
        // (-151 cause base body image doesn't have the legs)
        let startPosition = Vector2D.add(position, new Vector2D(0, context.canvas.height - 151));

        // -y cause y is flipped. Pivot is set from bottom so it works.
        let bodyPosition = Vector2D.add(startPosition, new Vector2D(cdi.BodyPivot[0], -cdi.BodyPivot[1]));

        let chicken = RestRequestsService.getChicken();
        this.drawElementInCanvasAsync(context, bodyPosition, ChickenDisplayService.getEyeInfo(chicken.Eye), cdi.EyePosition);
        this.drawElementInCanvasAsync(context, bodyPosition, ChickenDisplayService.getArmInfo(chicken.Arm), cdi.ArmPosition);
        this.drawElementInCanvasAsync(context, bodyPosition, ChickenDisplayService.getHairInfo(chicken.Hair), cdi.HairPosition);
        this.drawElementInCanvasAsync(context, bodyPosition, ChickenDisplayService.getMouthInfo(chicken.Mouth), cdi.MouthPosition);
    }

    render() {
        return <>
            <div className='center'>
                <canvas width="356" height="600" ref={canvas => this.canvasElement = canvas} />
            </div>
        </>
    }
}