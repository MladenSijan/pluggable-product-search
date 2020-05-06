// var code = 'self.postMessage({text: "sandbox created"});';
// var url = window.URL.createObjectURL(
//   new Blob([code], {type: 'text/javascript'})
// );
//
// var worker = new Worker(url);
//
// // window.URL.revokeObjectURL(url);
//
// // forwarding messages to parent
// worker.addEventListener('message', function (m) {
//   parent.postMessage(m.data, '*');
// });

(function () {
  this.Plugin = function () {
    this.counter = 0;
    this.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 1)), center / cover no-repeat ';

    this.resultItem = null;
    this.overlay = null;
    this.downloadIcon = null;
    this.figure = null;
    this.figcaption = null;
    this.title = null;
    this.tags = null;
  };

  this.Plugin.prototype.render = function (item) {
    if (typeof item === 'object' && 'title' in item && 'imageUrl' in item && 'tags' in item) {
      this.overlay = document.createElement('div');
      this.downloadIcon = document.createElement('img');
      this.resultItem = document.createElement('div');
      this.figure = document.createElement('figure');
      this.figcaption = document.createElement('figcaption');
      this.title = document.createElement('div');
      this.tags = document.createElement('div');

      this.overlay.classList.add('overlay');
      this.overlay.appendChild(this.downloadIcon);
      this.overlay.addEventListener('click', onImageDownload(item.imageUrl));
      this.downloadIcon.setAttribute('src', './download.svg');

      this.resultItem.classList.add('result-item');
      this.figure.classList.add('img');
      this.figure.setAttribute('id', (++this.counter).toString());
      this.figure.style.background = this.backgroundImage + 'url("' + item.imageUrl + '")';
      this.title.classList.add('title');
      this.tags.classList.add('tags');

      this.figure.appendChild(this.figcaption);
      this.figcaption.appendChild(this.title);
      this.figcaption.appendChild(this.tags);

      this.title.textContent = item.title || 'untitled';
      this.tags.textContent = item.tags.length > 0 ? item.tags.join(' ') : null;

      this.resultItem.appendChild(this.overlay);
      this.resultItem.appendChild(this.figure);
      document.getElementById('results-container').appendChild(this.resultItem);
    }
  };

  function onImageDownload(url) {
    return function () {
      console.log(url);
      // send message with url
    }
  }
})();

var plugin = new Plugin();
var port2;

window.addEventListener('message', function (e) {
  port2 = e.ports[0];

  port2.onmessage = function(event) {
    var data = JSON.parse(event.data);
    switch (data.message) {
      case 'requestToRender': {
        var items = data.data;
        var length = items.length;

        document.getElementById('results-container').innerHTML = "";

        for (var i = 0; i < length; i++) {
          for (var j = 0; j < items[i].length; j++) {
            plugin.render(items[i][j]);
          }
        }

        e.ports[0].postMessage(JSON.stringify({message: 'renderingFinished'}));
        break;
      }
      case 'clean': {
        for (const category in this.categories) {
          if (this.categories.hasOwnProperty(category)) {
            this.categories[category] = [];
          }
        }
        if (this.worker) {
          this.worker.terminate();
        }
        break;
      }
    }
  }
}, false);
