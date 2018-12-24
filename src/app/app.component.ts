import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Actions, ofActionDispatched, Store} from '@ngxs/store';
import {LoadingTrue} from './shared/state/loading.state';
import {Authenticated, CheckAuthState, LoginSuccessful} from './shared/actions/auth.actions';
import {MediaMatcher} from '@angular/cdk/layout';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  auth = false;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(private  store: Store, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private actions$: Actions) {
    this.store.dispatch([new LoadingTrue(), new CheckAuthState()]);
    this.actions$.pipe(ofActionDispatched(LoginSuccessful, Authenticated)).subscribe(() => this.auth = true);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener, false);
  }

  ngOnInit() {
  }


  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener, false);
  }

  toggle($event, snav) {
    if (this.mobileQuery.matches) {
      return snav.toggle();
    } else {
      return null;
    }
  }

  // installPwa(): void {
  //   this.Pwa.promptEvent.prompt();
  // }
}

