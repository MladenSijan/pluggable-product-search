import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {fromEvent, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {SearchService} from '../search.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements AfterViewInit, OnDestroy {
  searchControl: FormControl = new FormControl('');
  @ViewChild('searchInput', {static: true}) searchInput: ElementRef;

  destroy$: Subject<boolean> = new Subject();

  constructor(private searchService: SearchService) {
  }

  ngAfterViewInit(): void {
    this.searchInput.nativeElement.focus();

    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((ev: any) => this.searchService.emitValue(ev.target.value));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onReset() {
    this.searchControl.reset();
    this.searchControl.setValue('');
    this.searchService.emitValue('');
  }
}
