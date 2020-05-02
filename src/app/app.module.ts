import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import { LoaderComponent } from './loader/loader.component';
import {ProductSearchComponent} from './product-search/product-search.component';
import {SearchBarComponent} from './product-search/search-bar/search-bar.component';
import {SearchResultsComponent} from './product-search/search-results/search-results.component';

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    SearchBarComponent,
    SearchResultsComponent,
    ProductSearchComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
