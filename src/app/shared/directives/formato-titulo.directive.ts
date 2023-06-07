import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFormatoTitulo]'
})
export class FormatoTituloDirective {

   constructor(private elementRef: ElementRef, private renderer: Renderer2) { 
    this.renderer.setStyle(this.elementRef.nativeElement, 'font-weight', 'bold');
    this.renderer.setStyle(this.elementRef.nativeElement, 'color', '#333333');
    this.renderer.setStyle(this.elementRef.nativeElement, 'text-decoration', 'underline');
    this.renderer.setStyle(this.elementRef.nativeElement, 'font-family', 'Cutive Mono, monospace');
    // que tenga alfa el background color
    this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', 'rgba(0,0,0,0.1)');
    
    this.renderer.setStyle(this.elementRef.nativeElement, 'padding', '5px');
    this.renderer.setStyle(this.elementRef.nativeElement, 'border-radius', '5px');
    // que el texto este en el medio
    this.renderer.setStyle(this.elementRef.nativeElement, 'text-align', 'center');
  }

}
