import { ChangeDetectorRef, Component } from '@angular/core';
import { StateService } from './modules/services/state.service';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  Event,
  NavigationError,
  NavigationCancel,
} from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'panel';
  public showLoading: boolean;
  optionsHeart:AnimationOptions = {
    path: '/assets/loading.json',
  };
  constructor(
    private stateService: StateService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.checkLoading();
    this.checkRoute();
  }

  checkRoute() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.stateService.startLoading();
      }
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationError ||
        event instanceof NavigationCancel
      ) {
        this.stateService.endLoading();
      }
    });
  }

  checkLoading() {
    this.stateService.getLoadingStatus().subscribe((loadingStatus) => {
      this.showLoading = loadingStatus;
      this.cdr.detectChanges();
    });
  }

}
