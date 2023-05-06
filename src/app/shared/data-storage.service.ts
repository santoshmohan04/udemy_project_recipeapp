import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { environment } from 'src/environments/environment';
import { Ingredient } from './ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  recipeUrl = environment.firebaseRecipesUrl;
  shoppinglistUrl = environment.firebaseShoppingListUrl;
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private shopping: ShoppingListService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put(this.recipeUrl, recipes).subscribe((response) => {
      console.log(response);
    });
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(this.recipeUrl).pipe(
      map((recipes) => {
        return recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      tap((recipes) => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }

  fetchShoppingList() {
    return this.http.get<Ingredient[]>(this.shoppinglistUrl).pipe(
      map((Ingredients) => {
        return Ingredients;
      }),
      tap((Ingredients) => {
        this.shopping.setIngredients(Ingredients);
      })
    );
  }

  updateShoppingList() {
    const shoppinglist = this.shopping.getIngredients();
    this.http.put(this.shoppinglistUrl, shoppinglist).subscribe((response) => {
      console.log(response);
    });
  }
}
