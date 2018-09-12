import {Component, OnDestroy, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Actions, ofActionDispatched, Select, Store} from '@ngxs/store';
import {UserStoreState} from '../shared/models/store.model';
import {Observable, Subscription} from 'rxjs';
import {GetAllProducts, ProductFounded, SearchForProduct} from '../shared/actions/product.actions';
import {SingleProductModel} from '../shared/models/product.model';
import {Navigate} from '@ngxs/router-plugin';
import {Params} from '@angular/router';

@Component({
  selector: 'app-store-page',
  templateUrl: './store-page.component.html',
  styleUrls: ['./store-page.component.css']
})
export class StorePageComponent implements OnInit, OnDestroy {
  @Select('storeState') storeState$: Observable<object>;
  @Select('allProducts') allProducts$: Observable<SingleProductModel[]>;
  storeDataSubscription: Subscription;
  storeState: UserStoreState;
  currentStore;
  allProducts: any[];
  resultProduct: any[];
  searchKeyword = '';
  searchOptions = ['Tags', 'Description', 'Product name', 'Product id'];
  selectedSearchOption = 3;
  isWhitespace = true;

  constructor(private store: Store, private actions$: Actions) {

  }

  ngOnInit() {

    this.storeDataSubscription = this.storeState$.subscribe((data) => {
      this.storeState = new UserStoreState(data.valueOf());
      this.currentStore = this.storeState.linkedStores[this.storeState.selectedStore];
      this.store.dispatch([new GetAllProducts(this.currentStore['storeUid'])]);
    });
    this.allProducts$.subscribe((data: any[]) => {
      this.allProducts = data;
    });
  }

  ngOnDestroy() {
    this.storeDataSubscription.unsubscribe();
  }

  navigateToProduct(productId: Params) {
    this.store.dispatch([new Navigate(['store/product'], productId)]);
  }

  navigateToAddProduct() {
    this.store.dispatch([new Navigate(['add/product'])]);
  }

  selectSearchOption(index) {
    this.selectedSearchOption = index;
  }

  onChange() {
    this.resultProduct = [];
  }

  search() {
    this.isWhitespace = (this.searchKeyword || '').trim().length === 0;
    if (!this.isWhitespace) {
      this.store
        .dispatch([new SearchForProduct(this.currentStore['storeUid'], this.searchKeyword, this.searchOptions[this.selectedSearchOption])]);
      this.actions$
        .pipe(ofActionDispatched(ProductFounded))
        .subscribe(({resultProducts}) => this.resultProduct = resultProducts);
    } else {
      return console.log('we cant search empty field');
    }
  }
}