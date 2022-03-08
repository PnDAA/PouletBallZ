import React from "react";
import "./utils.css";
import Vector2D from './vector2D';
import { ChickenDisplayService, ElementColor, ElementInfo, IChickenDisplayInfo, ImageInfo } from "./chickenDisplayService";
import { RestRequestsService } from "./restRequestsService";
import { elementsImages } from "./Assets/UnityExport/chickenElements";

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

    private async drawElementAsync(bodyPosition: Vector2D, elementInfo: ElementInfo, elementPosition: [number, number], imageIndex:number = 0): Promise<void> {
        let imageInfo: ImageInfo = elementInfo.Images[imageIndex];
        // Pivot is specified from bottom left (y reversed). So we need to remove the sprite height.
        let imagePivot: number[] = imageInfo.Pivot!;
        let imageSize: number[] = imageInfo.Size!;
        let realPivot = new Vector2D(-imagePivot[0], imagePivot[1] - imageSize[1]);

        let pivot = Vector2D.add(bodyPosition, realPivot);

        // Remove x cause prefab is flipped
        // Remove y cause y is reversed
        // *ratio to change coordinate from unity game coordinate to image
        let ratio: number = 57;
        let elementImagePosition = Vector2D.add(pivot, new Vector2D(-elementPosition[0] * ratio, -elementPosition[1] * ratio))

        // Get color
        let color: string | undefined = undefined;
        switch (elementInfo.Color) {
            case ElementColor.None:
                color = undefined;
                break;
            case ElementColor.Primary:
                color = RestRequestsService.getHexColorAsync("Primary");
                break;
            case ElementColor.Secondary:
                color = RestRequestsService.getHexColorAsync("Secondary");
                break;
        }
        await this.drawImageInCanvasWithColorAsync(elementsImages[imageInfo.RequireKey], elementImagePosition, color);
    }

    public async DrawAsync() {
        let primaryColor: string = RestRequestsService.getHexColorAsync("Primary");

        let context: CanvasRenderingContext2D = this.canvasElement!.getContext("2d")!;

        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // in case of redraw

        let startX = 40; // To have some space at the left of the chicken
        let startY = 57; // Draw at 57 cause canvas is bigger in heigth than the image to be able to display hairs correctly. To put the image at the bottom of the canvas I've add the difference.

        await this.drawImageInCanvasWithColorAsync(require("./Assets/UnityExport/body.png"), new Vector2D(startX, startY), primaryColor);

        let cdi: IChickenDisplayInfo = ChickenDisplayService.getChickenDisplayInfo();

        let position: Vector2D = new Vector2D();
        // Go to bottom cause unity coordinates start from bottom
        // (-151 cause base body image doesn't have the legs)
        let startPosition = Vector2D.add(position, new Vector2D(startX, context.canvas.height - 151));

        // -y cause y is flipped. Pivot is set from bottom so it works.
        let bodyPosition = Vector2D.add(startPosition, new Vector2D(cdi.BodyPivot[0], -cdi.BodyPivot[1]));

        let chicken = RestRequestsService.getChicken();
        let armInfo = ChickenDisplayService.getArmInfo(chicken.Arm);
        let eyeInfo = ChickenDisplayService.getEyeInfo(chicken.Eye);
        let hairInfo = ChickenDisplayService.getHairInfo(chicken.Hair);
        let mouthInfo = ChickenDisplayService.getMouthInfo(chicken.Mouth);

        await this.drawElementAsync(bodyPosition, armInfo, cdi.LeftArmPosition, 1);
        await this.drawElementAsync(bodyPosition, eyeInfo, cdi.EyePosition);
        await this.drawElementAsync(bodyPosition, mouthInfo, cdi.MouthPosition);
        await this.drawElementAsync(bodyPosition, armInfo, cdi.RightArmPosition, 2);
        await this.drawElementAsync(bodyPosition, hairInfo, cdi.HairPosition);
    }

    public async componentDidMount() {
        await this.DrawAsync();
        RestRequestsService.onColorChanged.on((_, __) => this.DrawAsync());
    }

    // position absolute to not change the center
    // multiple canvas to be able to multiply color to sprite elements
    render() {
        return <>
            <canvas width="400" height="600" ref={canvas => this.coloringCanvasElement = canvas!} style={{ position: "absolute" }} />
            <canvas width="400" height="600" ref={canvas => this.spriteCanvasElement = canvas!} style={{ position: "absolute" }} />
            <div className='center'>
                <canvas width="400" height="600" ref={canvas => this.canvasElement = canvas!} />
            </div>
        </>
    }
}