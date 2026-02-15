import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Button } from "../button/button";
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, Button, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  onLogin() {
    console.log('Login clicked');
  }
}
