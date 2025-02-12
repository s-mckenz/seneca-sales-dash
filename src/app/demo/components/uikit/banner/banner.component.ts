import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-banner',
  standalone: true,
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  imports: [CommonModule]
})
export class BannerComponent {
  @Input() width: string = '100%';
  @Input() height: string = '50px';
  @Input() minWidth: string = '150px';
  @Input() minHeight: string = '50px';
  @Input() backgroundColor: string = '#0066CC'; 
  @Input() textColor: string = '#FFFFFF'; 
  @Input() textSize: string = '18px'; 
  @Input() text: string = 'Default Banner Text';

  // Method to return the banner styles
  getBannerStyles(): { [key: string]: string } {
    return {
      width: this.width,
      height: this.height,
      'min-width': this.minWidth,
      'min-height': this.minHeight,
      'background-color': this.backgroundColor,
      color: this.textColor,
      'font-size': this.textSize,
    };
  }
}



// Example usage: 

// <app-banner
//   width="100%"
//   height="60px"
//   backgroundColor="#28A745"
//   textColor="#FFFFFF"
//   textSize="20px"
//   text="Sales Performance"
// ></app-banner>

// <app-banner
//   width="100%"
//   height="60px"
//   backgroundColor="#007BFF"
//   textColor="#FFFFFF"
//   textSize="20px"
//   text="Labor Productivity"
// ></app-banner>
