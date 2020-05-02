import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <main>
      <app-product-search></app-product-search>
    </main>
  `,
  styles: [`
    main {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class AppComponent {
}
