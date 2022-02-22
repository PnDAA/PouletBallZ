import React from "react";
import "./utils.css";
import Vector2D from './vector2D';
import { spritesImages } from './Assets/UnityExport/sprites';
import { ChickenDisplayService, IChickenDisplayInfo, ISpriteInfo } from "./chickenDisplayService";
import { RestRequestsService } from "./restRequestsService";

export default class ChickenPrevisualization extends React.Component {
    canvasElement: HTMLCanvasElement | undefined;
    spriteCanvasElement: HTMLCanvasElement | undefined;
    coloringCanvasElement: HTMLCanvasElement | undefined;

    private async drawImageInCanvasAsync(context: CanvasRenderingContext2D, imageFile: any, position: Vector2D): Promise<void> {
        // Promise to wait for the image to be render to render the next one
        // https://stackoverflow.com/a/36050919
        return new Promise<void>((resolve, reject) => {
            let image = new Image();
            image.onload = function () {
                context.drawImage(image, position.x, position.y);
                resolve();
            }
            image.onerror = () => reject(new Error("Can't load image"));
            image.src = imageFile;
        });
    }

    private async drawImageInCanvasWithColorAsync(imageFile: any, position: Vector2D, color?: string): Promise<void> {
        let mainContext = this.canvasElement!.getContext("2d")!;
        if (color === undefined)
            return this.drawImageInCanvasAsync(mainContext, imageFile, position);

        /*
            If color is specified, to combine multiple globalCompositeOperation we:
            - draw the image in the sprite context
            - draw that same image in the coloring context
            - apply color on that image with source-atop to have only the image colored
            - draw the coloring canvas on sprite canvas on multiply to have the color applied to that sprite (only)
            - draw the sprite canvas in the maincanvas.

            More about globalCompositeOperation: https://developer.mozilla.org/fr/docs/Web/API/Canvas_API/Tutorial/Compositing/Example
        */
        let spriteContext = this.spriteCanvasElement!.getContext("2d")!;
        let coloringContext = this.coloringCanvasElement!.getContext("2d")!;

        /*
            We change the globalCompositeOperation to source-over to something else, so need to be put back like it was. Plus any other transformations that we could have done.
        */
        coloringContext.save();
        spriteContext.save();

        await this.drawImageInCanvasAsync(spriteContext, imageFile, position);

        coloringContext.drawImage(this.spriteCanvasElement!, 0, 0);
        coloringContext.globalCompositeOperation = "source-atop";
        coloringContext.fillStyle = color;
        coloringContext.fillRect(0, 0, coloringContext.canvas.width, coloringContext.canvas.height);

        spriteContext.globalCompositeOperation = "multiply";
        spriteContext.drawImage(this.coloringCanvasElement!, 0, 0);

        mainContext.drawImage(this.spriteCanvasElement!, 0, 0);

        coloringContext.clearRect(0, 0, this.coloringCanvasElement!.width, this.coloringCanvasElement!.height);
        spriteContext.clearRect(0, 0, this.spriteCanvasElement!.width, this.spriteCanvasElement!.height);
        coloringContext.restore();
        spriteContext.restore();
    }

    private async drawElementAsync(bodyPosition: Vector2D, spriteInfo: ISpriteInfo, elementPosition: [number, number], color?: string): Promise<void> {
        let cdi: IChickenDisplayInfo = ChickenDisplayService.getChickenDisplayInfo();

        // Pivot is specified from bottom left (y reversed). So we need to remove the sprite height.
        let realPivot = new Vector2D(-spriteInfo.Pivot[0], spriteInfo.Pivot[1] - spriteInfo.Size[1]);
        let pivot = Vector2D.add(bodyPosition, realPivot);

        // Remove x cause prefab is flipped
        // Remove y cause y is reversed
        // *ratio to change coordinate from unity game coordinate to image
        let ratio: number = 57;
        let elementImagePosition = Vector2D.add(pivot, new Vector2D(-elementPosition[0] * ratio, -elementPosition[1] * ratio))
        await this.drawImageInCanvasWithColorAsync(spritesImages[spriteInfo.RequireKey], elementImagePosition, color);
    }

    public async DrawAsync() {
        let primaryColor: string = RestRequestsService.getHexColorAsync("Primary");
        let secondaryColor: string = RestRequestsService.getHexColorAsync("Secondary");

        let context: CanvasRenderingContext2D = this.canvasElement!.getContext("2d")!;

        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // in case of redraw

        // Draw at 57 cause canvas is bigger in heigth than the image to be able to display hairs correctly. To put the image at the bottom of the canvas I've add the difference.
        await this.drawImageInCanvasWithColorAsync(require("./Assets/UnityExport/body.png"), new Vector2D(0, 57), primaryColor);

        let cdi: IChickenDisplayInfo = ChickenDisplayService.getChickenDisplayInfo();

        let position: Vector2D = new Vector2D();
        // Go to bottom cause unity coordinates start from bottom
        // (-151 cause base body image doesn't have the legs)
        let startPosition = Vector2D.add(position, new Vector2D(0, context.canvas.height - 151));

        // -y cause y is flipped. Pivot is set from bottom so it works.
        let bodyPosition = Vector2D.add(startPosition, new Vector2D(cdi.BodyPivot[0], -cdi.BodyPivot[1]));

        let chicken = RestRequestsService.getChicken();
        await this.drawElementAsync(bodyPosition, ChickenDisplayService.getEyeInfo(chicken.Eye), cdi.EyePosition);
        await this.drawElementAsync(bodyPosition, ChickenDisplayService.getArmInfo(chicken.Arm), cdi.ArmPosition, secondaryColor);
        await this.drawElementAsync(bodyPosition, ChickenDisplayService.getHairInfo(chicken.Hair), cdi.HairPosition, secondaryColor);
        await this.drawElementAsync(bodyPosition, ChickenDisplayService.getMouthInfo(chicken.Mouth), cdi.MouthPosition);
    }

    public async componentDidMount() {
        await this.DrawAsync();
        RestRequestsService.onColorChanged.on((_, __) => this.DrawAsync());
    }

    // position absolute to not change the center
    // multiple canvas to be able to multiply color to sprite elements
    render() {
        return <>
            <canvas width="356" height="600" ref={canvas => this.coloringCanvasElement = canvas!} style={{ position: "absolute" }} />
            <canvas width="356" height="600" ref={canvas => this.spriteCanvasElement = canvas!} style={{ position: "absolute" }} />
            <div className='center'>
                <canvas width="356" height="600" ref={canvas => this.canvasElement = canvas!} />
            </div>
        </>
    }
}