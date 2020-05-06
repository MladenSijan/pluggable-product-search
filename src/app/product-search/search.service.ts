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

  worker: Worker;
  channel: MessageChannel = new MessageChannel();
  plugin: HTMLIFrameElement;

  private messageSubject: Subject<string> = new Subject();
  messageEmit$ = this.messageSubject.asObservable();

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

  handleResult(products: Product[]) {
    if (this.worker) {
      this.worker.terminate();
    }
    this.startWebWorker();

    const hasResults = products.length > 0;
    this.hasResults = hasResults;

    if (hasResults) {
      this.worker.postMessage({
        command: 'handleResult',
        data: {categories: this.categories, products}
      });
    } else {
      this.worker.postMessage({command: 'cleanExistingResult'});
    }

    setTimeout(() => this.isLoading = false, 500);
  }

  startWebWorker() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker('../worker/products.worker', {type: 'module'});

      this.worker.onmessage = ({data}) => {
        switch (data.message) {
          case 'resultHandled': {
            this.emitMessage(JSON.stringify({message: 'requestToRender', data}));
            break;
          }
          case 'resultCleaned': {
            for (const category in this.categories) {
              if (this.categories.hasOwnProperty(category)) {
                this.categories[category] = [];
              }
            }
            if (this.worker) {
              this.worker.terminate();
            }
            break;
          }
        }
      };
    } else {
      console.log(`Web Workers are not supported in this environment.`);
    }
  }

  setPlugin(plugin: HTMLIFrameElement) {
    this.plugin = plugin;
  }

  listenForPluginChanges() {
    this.channel.port1.onmessage = ({data}) => {
      const result = JSON.parse(data);
      switch (result.message) {
        case 'renderingFinished': {

          break;
        }
      }
    };
  }

  emitMessage(message: string) {
    this.messageSubject.next(message);
  }

  sendMessageToPlugin(message: string) {
    this.plugin.contentWindow.postMessage(message, '*', [this.channel.port2]);
  }
}
