import {
  AfterViewInit,
  Component,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
  signal,
} from '@angular/core';
import { loadRemoteModule } from '@angular-architects/native-federation';

@Component({
  selector: 'app-dashboard',
  imports: [],
  styleUrl: './dashboard.css',
  template: `
    <div class="dashboard">

      <div class="panel">
        <div class="panel-header panel-header--athletes">Athletes</div>
        <div class="panel-body">
          @if (!athletesReady()) {
            <p class="loading">Chargement Athletes...</p>
          }
          <ng-container #athletesHost />
        </div>
      </div>

      <div class="panel-divider"></div>

      <div class="panel">
        <div class="panel-header panel-header--ranking">Ranking</div>
        <div class="panel-body">
          @if (!rankingReady()) {
            <p class="loading">Chargement Ranking...</p>
          }
          <ng-container #rankingHost />
        </div>
      </div>

    </div>
  `,
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('athletesHost', { read: ViewContainerRef }) athletesHost!: ViewContainerRef;
  @ViewChild('rankingHost',  { read: ViewContainerRef }) rankingHost!: ViewContainerRef;

  athletesReady = signal(false);
  rankingReady  = signal(false);

  private pendingAthletes: Type<unknown> | null = null;
  private pendingRanking:  Type<unknown> | null = null;

  async ngOnInit() {
    const [athletesMod, rankingMod] = await Promise.all([
      loadRemoteModule('athletes', './Component'),
      loadRemoteModule('ranking',  './Component'),
    ]);
    this.pendingAthletes = athletesMod.App;
    this.pendingRanking  = rankingMod.App;
    this.mountIfReady();
  }

  ngAfterViewInit() {
    this.mountIfReady();
  }

  private mountIfReady() {
    if (this.athletesHost && this.pendingAthletes) {
      this.athletesHost.createComponent(this.pendingAthletes);
      this.athletesReady.set(true);
      this.pendingAthletes = null;
    }
    if (this.rankingHost && this.pendingRanking) {
      this.rankingHost.createComponent(this.pendingRanking);
      this.rankingReady.set(true);
      this.pendingRanking = null;
    }
  }
}
