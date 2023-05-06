import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { DataStorageService } from '../shared/data-storage.service';
import { AlertMessageService } from '../alerts/alertmsg.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private subscription: Subscription;
  isLoading = false;

  constructor(
    private slService: ShoppingListService,
    private ds: DataStorageService,
    private alertMsg: AlertMessageService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.ds.fetchShoppingList().subscribe({
      next: (res) => {
        this.ingredients = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.alertMsg.alertDanger(err);
      },
    });
    this.subscription = this.slService.ingredientsChanged.subscribe(
      (ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
      }
    );
  }

  onEditItem(index: number) {
    this.slService.startedEditing.next(index);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
