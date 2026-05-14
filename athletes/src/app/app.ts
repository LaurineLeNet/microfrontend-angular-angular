import { Component, OnDestroy, signal, computed } from '@angular/core';

export interface Athlete {
  name: string;
  distance: number;
  finished: boolean;
}

const RACE_DISTANCE = 100;
const CHANNEL_NAME  = 'athletes-positions';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnDestroy {
  readonly raceDistance = RACE_DISTANCE;

  athletes = signal<Athlete[]>([
    { name: 'Alice', distance: 0, finished: false },
    { name: 'Bob',   distance: 0, finished: false },
  ]);

  raceFinished = computed(() => this.athletes().every((a) => a.finished));

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
