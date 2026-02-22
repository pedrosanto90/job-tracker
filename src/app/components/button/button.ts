import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() label?: string;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
}
