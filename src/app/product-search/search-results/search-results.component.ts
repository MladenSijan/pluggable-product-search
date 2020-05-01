import {Component, OnDestroy, OnInit} from '@angular/core';
import {SearchService} from '../search.service';
import {Subject} from 'rxjs';
import {concatMap, takeUntil} from 'rxjs/operators';
import {Product} from '../model/product';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject();

  constructor(
    private searchService: SearchService
  ) {
  }

  ngOnInit(): void {
    this.searchService.valueChange$.pipe(
      concatMap(value => this.searchService.searchProducts(value)),
      takeUntil(this.destroy$)).subscribe((resp: Product[]) => {

    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onRefresh() {

  }
}
