import {Product} from './product';
import {ResultItem} from './result-item';

export interface Handler {
  handle(product: Product): ResultItem;
}
