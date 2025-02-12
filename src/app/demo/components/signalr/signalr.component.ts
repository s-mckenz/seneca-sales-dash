//Note: This component is for demonstration purposes and requires a dotnet SignalR server 

import { ChangeDetectorRef } from '@angular/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { SignalRService } from 'src/app/demo/service/signalr.service';
import { Product } from '../../../models/product.model';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-signalr',
  standalone: true,
  imports: [],
  templateUrl: './signalr.component.html',
  styleUrl: './signalr.component.scss'
})

export class SignalrComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  cols: any[] = [];
  globalFilterFields: string[] = [];
  private subscriptions: Subscription = new Subscription();
  

  constructor(
    private signalRService: SignalRService,
    private layoutService: LayoutService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Subscribe to SignalRService for real-time updates
    const signalRSubscription = this.signalRService.dataReceived.subscribe(
      (newProduct: Product) => this.handleNewProduct(newProduct)
    );
    this.subscriptions.add(signalRSubscription);

    // Subscribe to layout configuration updates
    const layoutSubscription = this.layoutService.configUpdate$
      .pipe(/* Add any necessary operators, e.g., debounceTime */)
      .subscribe(() => {
        this.initCharts();
      });
    this.subscriptions.add(layoutSubscription);
  }

  private handleNewProduct(newProduct: Product): void {
    console.log('New product received via SignalR:', newProduct);
  
    // Find the index of the existing product
    const existingProductIndex = this.products.findIndex((product) => product.id === newProduct.id);
  
    if (existingProductIndex > -1) {
      // Update the existing product with the new fields
      this.products[existingProductIndex] = {
        ...this.products[existingProductIndex],
        ...newProduct, // Merge the updated fields
      };
      console.log('Updated existing product:', this.products[existingProductIndex]);
    } else {
      // If columns are not initialized, initialize them based on the first product
      if (this.cols.length === 0) {
        this.initializeTableColumns(newProduct);
      } else {
        // Check for new fields and update columns if necessary
        const newFields = Object.keys(newProduct).filter(
          (key) => !this.cols.some((col) => col.field === key)
        );
  
        if (newFields.length > 0) {
          newFields.forEach((field) => {
            this.cols.push({
              header: this.capitalizeFirstLetter(field),
              field: field,
            });
            this.globalFilterFields.push(field);
          });
        }
      }
  
      // Add the new product to the products array
      this.products.push(newProduct);
      console.log('Added new product:', newProduct);
    }
  
    // Trigger Angular's Change Detection to update the view
    this.cdr.detectChanges();
  }
  
  private initializeTableColumns(product: Product): void {
    this.cols = Object.keys(product).map((key) => ({
      header: this.capitalizeFirstLetter(key),
      field: key,
    }));

    // Precompute global filterable fields
    this.globalFilterFields = this.cols.map((col) => col.field);
  }

  private capitalizeFirstLetter(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }


  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }


  initCharts(): void {

  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
