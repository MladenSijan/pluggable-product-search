import {Component} from '@angular/core';

@Component({
  selector: 'app-product-search',
  template: `
    <section class="wrapper">
      <app-search-bar></app-search-bar>
      <app-search-results></app-search-results>
    </section>
  `,
  styles: [`
    .wrapper {
      border-radius: 8px;
      background-color: #fff;
      padding: 1.75rem 0 1.3rem;
      box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.18);
    }
  `]
})
export class ProductSearchComponent {
}
