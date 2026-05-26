import { Component, OnDestroy, signal, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

export interface Athlete {
  name: string;
  distance: number;
  finished: boolean;
}

const RACE_DISTANCE = 100;
const CHANNEL_NAME  = 'athletes-positions';

@Component({
  selector: 'app-race',
  imports: [RouterLink],
  templateUrl: './race.html',
  styleUrl: './race.css',
})
export class RaceComponent implements OnDestroy {
  readonly raceDistance = RACE_DISTANCE;

  private router = inject(Router);

  athletes = signal<Athlete[]>([
    { name: 'Alice', distance: 0, finished: false },
    { name: 'Bob',   distance: 0, finished: false },
  ]);

  raceFinished = computed(() => this.athletes().every((a) => a.finished));

  showListLink = computed(() => {
    const url = this.router.url;
    return url.startsWith('/athletes') || url === '/' || url === '/list' || url.startsWith('/detail');
  });

  private channel = new BroadcastChannel(CHANNEL_NAME);

  advance(name: string): void {
    this.athletes.update((list) =>
      list.map((a) => {
        if (a.name !== name || a.finished) return a;
        const step     = Math.floor(Math.random() * 10) + 1;
        const distance = Math.min(a.distance + step, RACE_DISTANCE);
        const finished = distance >= RACE_DISTANCE;
        const updated  = { ...a, distance, finished };
        this.channel.postMessage({ name: updated.name, distance: updated.distance, finished: updated.finished });
        return updated;
      })
    );
  }

  reset(): void {
    const reset = this.athletes().map((a) => ({ ...a, distance: 0, finished: false }));
    this.athletes.set(reset);
    reset.forEach((a) => this.channel.postMessage({ name: a.name, distance: 0, finished: false }));
  }

  progress(a: Athlete): number {
    return Math.round((a.distance / RACE_DISTANCE) * 100);
  }

  ngOnDestroy(): void {
    this.channel.close();
  }
}
