import { Component, OnDestroy, OnInit, signal, computed } from '@angular/core';

export interface RankEntry {
  rank: number;
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
export class App implements OnInit, OnDestroy {
  readonly raceDistance = RACE_DISTANCE;

  private positions = signal<Map<string, { distance: number; finished: boolean }>>(new Map());

  rankings = computed<RankEntry[]>(() => {
    const entries = Array.from(this.positions().entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.distance - a.distance);

    return entries.map((e, i) => ({ rank: i + 1, name: e.name, distance: e.distance, finished: e.finished }));
  });

  hasData = computed(() => this.positions().size > 0);

  progress(distance: number): number {
    return Math.round((distance / RACE_DISTANCE) * 100);
  }

  private channel!: BroadcastChannel;

  ngOnInit(): void {
    this.channel = new BroadcastChannel(CHANNEL_NAME);
    this.channel.onmessage = ({ data }: MessageEvent<{ name: string; distance: number; finished: boolean }>) => {
      this.positions.update((map) => {
        const next = new Map(map);
        next.set(data.name, { distance: data.distance, finished: data.finished });
        return next;
      });
    };
  }

  ngOnDestroy(): void {
    this.channel.close();
  }
}
