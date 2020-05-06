/// <reference lib="webworker" />
import {Product} from '../product-search/model/product';
import {ResultItem} from '../product-search/model/result-item';
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

      const resultItems = [];
      for (const category in categories) {
        if (categories.hasOwnProperty(category) && categories[category].length > 0) {
          resultItems.push(categories[category]);
        }
      }
      postMessage({message: 'resultHandled', resultItems});
      break;
    }
    case 'cleanExistingResult': {
      postMessage({message: 'resultCleaned'});
      break;
    }
  }
});
