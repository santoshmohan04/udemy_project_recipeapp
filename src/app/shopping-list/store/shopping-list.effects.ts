import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import * as fromApp from '../../store/app.reducer';
import * as ShoppingListActions from './shopping-list.actions';
import { environment } from 'src/environments/environment';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { switchMap, map, withLatestFrom } from 'rxjs';

@Injectable()
export class ShoppingListEffects {
  shoppinglistUrl = environment.firebaseShoppingListUrl;

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}

  fetchIngredients = createEffect(() =>
    this.actions$.pipe(
      ofType(ShoppingListActions.FETCH_INGREDIENTS),
      switchMap(() => {
        return this.http.get<Ingredient[]>(this.shoppinglistUrl);
      }),
      map((ingredients) => {
        console.log('ingredients >>>> ', ingredients);
        return ingredients;
      }),
      map((ingredients) => {
        return new ShoppingListActions.SetIngredients(ingredients);
      })
    )
  );

  storeIngredients = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ShoppingListActions.STORE_INGREDIENTS),
        withLatestFrom(this.store.select('shoppingList')),
        switchMap(([actionData, ingredientsState]) => {
          return this.http.put(
            this.shoppinglistUrl,
            ingredientsState.ingredients
          );
        })
      ),
    { dispatch: false }
  );
}
