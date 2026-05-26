import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Athlete {
  name: string;
  distance: number;
  finished: boolean;
}

@Component({
  selector: 'app-athlete-list',
  imports: [RouterLink],
  templateUrl: './athlete-list.html',
  styleUrl: './athlete-list.css',
})
export class AthleteListComponent {
  athletes: Athlete[] = [
    { name: 'Alice', distance: 0, finished: false },
    { name: 'Bob',   distance: 0, finished: false },
  ];
}
