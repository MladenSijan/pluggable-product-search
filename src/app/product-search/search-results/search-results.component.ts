import {Component, OnDestroy, OnInit} from '@angular/core';
import {SearchService} from '../search.service';
import {Subject} from 'rxjs';
import {concatMap, take, takeUntil} from 'rxjs/operators';
import {Product} from '../model/product';
import {ResultItem} from '../model/result-item';
import {PluginService} from '../plugin.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject();

  constructor(
    public searchService: SearchService,
    public pluginService: PluginService
  ) {
  }

  ngOnInit(): void {
    this.searchService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: any[]) => {
        resp.forEach((category: any) => this.searchService.categories[category.id] = [] as ResultItem[]);
      });

    this.searchService.valueChange$
      .pipe(take(1)).subscribe(() => this.searchService.isSearchPerformed = true);

    this.searchService.valueChange$
      .pipe(concatMap(value => this.searchService.searchProducts(value)), takeUntil(this.destroy$))
      .subscribe((products: Product[]) => this.searchService.handleResult(products));

    this.pluginService.setPlugin(document.getElementById('plugin') as HTMLIFrameElement);

    this.pluginService.plugin.addEventListener('load', () => {
      this.pluginService.listenForChanges();
      this.searchService.messageEmit$
        .pipe(takeUntil(this.destroy$))
        .subscribe(message => this.pluginService.sendMessage(message));
    }, false);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onRefresh() {
    this.searchService.emitValue(this.searchService.searchValue);
  }
}
