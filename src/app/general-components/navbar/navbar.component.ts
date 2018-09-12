import {Component, OnInit} from '@angular/core';
import { UserModel} from '../../shared/models/auth.model';
import {Actions, ofActionDispatched, Select, Store} from '@ngxs/store';
import {Logout} from '../../shared/actions/auth.actions';
import {LoadingTrue} from '../../shared/state/loading.state';
import {UserStoreState} from '../../shared/models/store.model';
import {Navigate} from '@ngxs/router-plugin';
import {EmptyLinkedStore} from '../../shared/actions/store.actions';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Select('user') user$;
  @Select('storeState') storeState$;
  user: UserModel;
  storeState: UserStoreState;
  linkedStoreEmpty: boolean;

  constructor(private  store: Store,  private actions$: Actions) {
  }

  ngOnInit() {
    this.linkedStoreEmpty = false;
    this.user$
      .subscribe((data) => {
        if (data !== null) {
          this.user = data.valueOf();
        }});
    this.actions$
      .pipe(ofActionDispatched(EmptyLinkedStore))
      .subscribe(() => this.linkedStoreEmpty = true );
    this.storeState$
      .subscribe((data) => this.storeState = new UserStoreState(data.valueOf()));

}

  navigateTo(path: string) {
    return this.store.dispatch([new Navigate([path])]);
  }
  logout() {
    return this.store.dispatch([new LoadingTrue(), new Logout()]);
  }
}