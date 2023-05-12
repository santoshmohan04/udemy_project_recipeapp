import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable, map } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from '../shared/ingredient.model';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private subscription: Subscription;
  isLoading = false;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.isLoading = true;
    this.store.dispatch(new ShoppingListActions.FetchIngredients());
    this.subscription = this.store
      .select('shoppingList')
      .pipe(map((ingredientsState) => ingredientsState.ingredients))
      .subscribe((ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
        this.isLoading = false;
      });
  }

  onEditItem(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
