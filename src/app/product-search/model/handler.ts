import {Product} from './product';
import {ResultItem} from './result-item';

interface Handler {
  handle(product: Product): ResultItem;
}
