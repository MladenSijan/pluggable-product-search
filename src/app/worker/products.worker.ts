/// <reference lib="webworker" />
import {Product} from '../product-search/model/product';
import {ProductHandler} from '../product-search/product-handler';

addEventListener('message', ({data}) => {
  switch (data.command) {
    case 'handleResult': {
      const handler = new ProductHandler();
      const categories = data.data.categories;
      const products: Product[] = data.data.products;

      products.forEach((product: Product) => {
        if (product.categoryId in categories) {
          categories[product.categoryId].push(handler.handle(product));
        }
      });

      console.log(categories);
      postMessage('results handled');
      break;
    }
    case 'cleanExistingResult': {
      postMessage('results cleaned');
      break;
    }
  }
});
