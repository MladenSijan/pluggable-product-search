/// <reference lib="webworker" />
import {Product} from '../product-search/model/product';
import {ProductHandler} from '../product-search/product-handler';
import {ResultItem} from '../product-search/model/result-item';

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

      for (const category in categories) {
        if (categories.hasOwnProperty(category) && categories[category].length > 0) {
          const items: ResultItem[] = categories[category];
          // send message to render each item
          // items.forEach(item => console.log(item));
        }
      }

      postMessage({message: 'resultHandled'});
      break;
    }
    case 'cleanExistingResult': {
      postMessage({message: 'resultCleaned'});
      break;
    }
  }
});
