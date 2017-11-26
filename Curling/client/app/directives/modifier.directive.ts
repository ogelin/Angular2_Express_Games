import { Directive, Input } from '@angular/core';
import { RenderService } from '../services/render.service';

@Directive({
    selector: 'modifier'
})
export class ModifierDirective {
    public scale = 1;
    constructor(private _renderService: RenderService) {
    }

    @Input()
    public set container(value: HTMLElement) {
        if (value) {
            if (this._renderService._scene === undefined) {
                this._renderService.init(value);
            }
            else {
                this._renderService.reinitializeNewGame();
                this._renderService.container = value;
            }
        }
    }

    @Input()
    public set webgltext(value: string) {
        if (!value) {
            value = '';
        }
        this._renderService.setText(value);
    }
    public addStars(stars: number) {
        //this._renderService.addStars(stars);
    }

    public updateScale(newScale: number) {
        //this._renderService.updateScale(newScale);
    }

    /*public printService(): void {
        this._renderService.print();
        if (true) {
            function s() {
                let x = '';
                return / <NBSP>regexp/;
            }
        }
    }*/

}
