import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

export interface Athlete {
  name: string;
  distance: number;
  finished: boolean;
}

export interface RaceResult {
  name: string;
  date: string;
  position: number;
  time: string;
}

export interface AthleteProfile {
  firstName: string;
  lastName: string;
  birthDate: string;
  recentRaces: RaceResult[];
}

function generateProfile(name: string): AthleteProfile {
  if (name === 'Alice') {
    return {
      firstName: 'Alice',
      lastName: 'Martin',
      birthDate: '15/03/1995',
      recentRaces: [
        { name: 'Marathon de Paris', date: '02/04/2024', position: 1, time: '2h15min' },
        { name: '10km de Lyon', date: '18/06/2024', position: 3, time: '32min' },
        { name: 'Semi de Marseille', date: '24/09/2024', position: 2, time: '1h05min' },
      ],
    };
  }

  if (name === 'Bob') {
    return {
      firstName: 'Bob',
      lastName: 'Dubois',
      birthDate: '22/07/1998',
      recentRaces: [
        { name: 'Marathon de Paris', date: '02/04/2024', position: 5, time: '2h25min' },
        { name: '10km de Lyon', date: '18/06/2024', position: 1, time: '30min' },
        { name: 'Semi de Marseille', date: '24/09/2024', position: 4, time: '1h10min' },
      ],
    };
  }

  // Fallback pour tout autre nom
  return {
    firstName: name,
    lastName: 'Inconnu',
    birthDate: '01/01/2000',
    recentRaces: [
      { name: 'Course régionale', date: '01/01/2024', position: 1, time: '45min' },
    ],
  };
}

@Component({
  selector: 'app-athlete-detail',
  imports: [RouterLink],
  templateUrl: './athlete-detail.html',
  styleUrl: './athlete-detail.css',
})
export class AthleteDetailComponent implements OnInit {
  athleteName = '';
  distance = 0;
  finished = false;

  profile!: AthleteProfile;

  private channel!: BroadcastChannel;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.athleteName = this.route.snapshot.paramMap.get('id') ?? '';
    this.profile = generateProfile(this.athleteName);

    this.channel = new BroadcastChannel('athletes-positions');
    this.channel.onmessage = ({ data }: MessageEvent<{ name: string; distance: number; finished: boolean }>) => {
      if (data.name === this.athleteName) {
        this.distance = data.distance;
        this.finished = data.finished;
      }
    };
  }

  progress(): number {
    return Math.round((this.distance / 100) * 100);
  }
}
