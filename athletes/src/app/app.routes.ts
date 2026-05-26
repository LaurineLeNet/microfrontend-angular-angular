import { Routes } from '@angular/router';
import { RaceComponent } from './race/race';
import { AthleteListComponent } from './athlete-list/athlete-list';
import { AthleteDetailComponent } from './athlete-detail/athlete-detail';

export const routes: Routes = [
  { path: '',        component: RaceComponent },
  { path: 'list',    component: AthleteListComponent },
  { path: 'detail/:id', component: AthleteDetailComponent },
];
