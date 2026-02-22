import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule,Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly router = inject(Router);
  protected readonly title = signal('job-tracker');
  protected readonly showFooter = signal(this.shouldShowFooter(this.router.url));

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.showFooter.set(this.shouldShowFooter(event.urlAfterRedirects));
      });
  }

  private shouldShowFooter(url: string): boolean {
    const path = url.split('?')[0].split('#')[0];
    return path === '' || path === '/' || path === '/login' || path === '/create-account';
  }
}
