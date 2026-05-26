import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'athletes',
    loadChildren: () =>
      loadRemoteModule('athletes', './Routes').then((m) => m.routes),
  },
  {
    path: 'ranking',
    loadComponent: () =>
      loadRemoteModule('ranking', './Component').then((m) => m.App),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
