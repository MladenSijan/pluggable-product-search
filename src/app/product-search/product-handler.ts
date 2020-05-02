import {Handler} from './model/handler';
import {Product} from './model/product';
import {ResultItem} from './model/result-item';

export class ProductHandler implements Handler {
  handle(product: Product): ResultItem {
    return {
      title: product.title,
      imageUrl: product.imageUrl,
      tags: [`category: ${product.categoy}`, `price: ${product.price}`, `stock: ${product.stock}`],
    };
  }
}
