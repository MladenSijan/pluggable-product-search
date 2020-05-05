import {Injectable} from '@angular/core';
import {of, Subject} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Product} from './model/product';
import {ProductHandler} from './product-handler';
import {ResultItem} from './model/result-item';

@Injectable({providedIn: 'root'})
export class SearchService {
  public searchValue = '';
  private valueChangeSubject: Subject<string> = new Subject();
  public valueChange$ = this.valueChangeSubject.asObservable();

  isLoading = false;
  hasResults = false;
  categories: any = {};
  isSearchPerformed = false;
  url = 'https://pcsa57ebsj.execute-api.us-east-1.amazonaws.com/api/products';

  constructor(private http: HttpClient) {
  }

  emitValue(value: string) {
    this.searchValue = value;
    this.valueChangeSubject.next(value);
  }

  getCategories() {
    return this.http.get(`${this.url}/categories`).pipe(catchError(err => of([])));
  }

  searchProducts(value: string) {
    this.isLoading = true;

    if (value.length > 0) {
      const params = new HttpParams().set('query', value);
      return this.http.get(`${this.url}/search`, {params}).pipe(catchError(err => of([])));
    } else {
      this.hasResults = false;
      return of([]);
    }
  }

  handleResults(products: Product[]) {
    this.startWebWorker(products);
    const hasResults = products.length > 0;
    this.hasResults = hasResults;

    if (hasResults) {
      // this.worker.postMessage({
      //   command: 'handleResult',
      //   data: {categories: this.categories, products}
      // });
    } else {
      // this.worker.postMessage({command: 'cleanExistingResult'});
    }

    // this.worker.onmessage = (event) => {
    //   switch (event.data.message) {
    //     case 'resultCleaned': {
    //       for (const category in this.categories) {
    //         if (this.categories.hasOwnProperty(category)) {
    //           this.categories[category] = [];
    //         }
    //       }
    //       if (this.worker) {
    //         this.worker.terminate();
    //       }
    //       break;
    //     }
    //     case 'resultHandled': {
    //
    //       break;
    //     }
    //   }
    //   setTimeout(() => this.isLoading = false, 500);
    // };
    setTimeout(() => this.isLoading = false, 500);
  }

  requestToRender() {
    for (const category in this.categories) {
      if (this.categories.hasOwnProperty(category) && this.categories[category].length > 0) {
        const items: ResultItem[] = this.categories[category];
        // send message to render each item
        items.forEach(item => console.log(item));
      }
    }
  }

  startWebWorker(products) {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('../worker/products.worker', {type: 'module'});
      worker.onmessage = ({data}) => {
        console.log(`page got message: ${data}`);
      };
      worker.postMessage({
        command: 'handleResult',
        data: {categories: this.categories, products}
      });
    } else {
      console.log(`Web Workers are not supported in this environment.`);
    }
  }
}
