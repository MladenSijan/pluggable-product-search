import {Injectable} from '@angular/core';
import {of, Subject} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class SearchService {
  private valueChangeSubject: Subject<string> = new Subject();
  public valueChange$ = this.valueChangeSubject.asObservable();

  constructor(
    private http: HttpClient
  ) {
  }

  emitValue(value: string) {
    this.valueChangeSubject.next(value);
  }

  getCategories() {
    return this.http.get('').pipe(catchError(err => of([])));
  }

  searchProducts(value: string) {
    const params = new HttpParams().set('search', value);
    return this.http.get('', {params}).pipe(catchError(err => of([])));
  }
}
