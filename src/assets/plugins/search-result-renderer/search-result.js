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
    this.label = null;
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
      this.label = document.createElement('div');

      this.overlay.classList.add('overlay');
      this.overlay.appendChild(this.downloadIcon);
      this.overlay.addEventListener('click', onImageDownload(item.title, item.imageUrl));
      this.downloadIcon.setAttribute('src', './download.svg');

      this.resultItem.classList.add('result-item');
      this.figure.classList.add('img');
      this.figure.setAttribute('id', (++this.counter).toString());
      this.figure.style.background = this.backgroundImage + 'url("' + item.imageUrl + '")';
      this.title.classList.add('title');
      this.tags.classList.add('tags');
      this.label.classList.add('label');

      this.figure.appendChild(this.label);
      this.figure.appendChild(this.figcaption);
      this.figcaption.appendChild(this.title);
      this.figcaption.appendChild(this.tags);

      this.title.textContent = item.title || 'untitled';
      this.label.textContent = item.tags.length > 0 ? item.tags[0] : '';
      this.tags.textContent = item.tags.length > 0 ? item.tags.slice(1, 3).join(' ') : null;

      this.resultItem.appendChild(this.overlay);
      this.resultItem.appendChild(this.figure);
      document.getElementById('results-container').appendChild(this.resultItem);
    }
  };

  function onImageDownload(title, url) {
    return function () {
      port2.postMessage(JSON.stringify({message: 'downloadImage', data: {title, downloadUrl: url}}));
    }
  }
})();

var plugin = new Plugin();
var port2;

window.addEventListener('message', function (e) {
  port2 = e.ports[0];

  port2.onmessage = function (event) {
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

        port2.postMessage(JSON.stringify({message: 'renderingFinished'}));
        break;
      }
      case 'clean': {

        break;
      }
    }
  }
}, false);
