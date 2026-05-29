import { Component, inject, signal, computed } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private router = inject(Router);

  isSubRoute = signal(false);
  isDetailRoute = signal(false);

  private prefix = computed(() => {
    const url = this.router.url;
    return url.startsWith('/athletes') ? '/athletes' : '';
  });

  courseLink = computed(() => {
    return this.prefix() || '/';
  });

  listLink = computed(() => {
    const prefix = this.prefix();
    return prefix ? `${prefix}/list` : '/list';
  });

  constructor() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url;
        const onList = url.includes('/list');
        const onDetail = url.includes('/detail');
        this.isSubRoute.set(onList || onDetail);
        this.isDetailRoute.set(onDetail);
      });
  }
}
