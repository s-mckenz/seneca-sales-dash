import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-placeholder-card',
  standalone: true,
  templateUrl: './placeholder-card.component.html',
  styleUrls: ['./placeholder-card.component.scss'],
  imports: [CommonModule]
})

export class PlaceholderCardComponent {
  @Input() width: string = '100%';
  @Input() height: string = '150px';
  @Input() borderRadius: string = '8px';
}
