import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, Renderer2 } from '@angular/core';

interface LoaderStyle {
  width?: string;
  height?: string;
  background?: string;
  'border-radius'?: string;
}

@Component({
  selector: 'app-linear-loader',
  imports: [CommonModule],
  templateUrl: './linear-loader.component.html'
})
export class LinearLoaderComponent {
  @Input() dot: boolean = true
  @Input() count: number = 10
  @Input() width: number = 25
  @Input() height: number = 10
  @Input() color: string = ''
  @Input() class: string = ''

  style: LoaderStyle = {};

  constructor(
    private elementRef: ElementRef,
    private render: Renderer2,
  ) { }
    
  ngOnInit() {
    this.setStyle()
    //this.style['width'] = this.width + 'px'
    //this.style['height'] = this.width + 'px'
    //if (this.dot) {
    //  this.style['border-radius'] = '50%'
    //}
    //console.log('test')
    //this.render.addClass(this.elementRef.nativeElement, 'bubbles')
    //this.createBuble()
  }

  private setStyle(): void {
    const w = this.width + 'px';
    const h = this.dot ? this.width + 'px' : this.height + 'px';

    this.style.width = w;
    this.style.height = h;

    if (this.dot) {
      this.style['border-radius'] = '50%';
    }

    if (this.color) {
      this.style.background = this.color;
    }
  }


  ngAfterViewInit(){
    
  }

  createRange(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i + 1);
  }

// createRange(number){
//   let items: number[] = [];
//   for(let i = 1; i <= number; i++){
//      items.push(i);
//   }
//   return items;
// }

  createBuble() {
    let i: number;
    for (i = this.count; i > 0; i--) {
      let buble = this.render.createElement('div')
      this.render.addClass(buble, 'bubbles')

      let circle = this.render.createElement('div')
      this.render.addClass(circle, 'circle')
      this.render.setStyle(circle, 'width', this.width + 'px')
      this.render.setStyle(circle, 'height', this.width + 'px')
      if (this.dot) {
        this.render.setStyle(circle, 'borderRadius', '50%')
      }
      if (this.color) {
        this.render.addClass(circle, this.color)
      }

      this.render.appendChild(buble, circle)

      this.render.appendChild(this.elementRef.nativeElement, buble)
    }   
  }
}
