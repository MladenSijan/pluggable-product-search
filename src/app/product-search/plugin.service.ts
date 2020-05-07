import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class PluginService {
  plugin: HTMLIFrameElement;
  channel: MessageChannel = new MessageChannel();

  constructor() {
  }

  setPlugin(plugin: HTMLIFrameElement) {
    this.plugin = plugin;
  }

  listenForChanges() {
    this.channel.port1.onmessage = ({data}) => {
      const result = JSON.parse(data);
      switch (result.message) {
        case 'renderingFinished': {
          break;
        }
        case 'downloadImage': {
          this.downloadImage(result.data.title, result.data.downloadUrl);
          break;
        }
      }
    };

    this.plugin.contentWindow.postMessage('init', '*', [this.channel.port2]);
  }

  sendMessage(message: string) {
    try {
      this.channel.port1.postMessage(message);
    } catch (e) {
      console.log('Error: ', e);
    }
  }

  downloadImage(title: string, resourceUrl: string) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', resourceUrl);
    xhr.responseType = 'blob';
    xhr.onload = (e) => {
      const urlCreator = window.URL || window.webkitURL;
      const url = urlCreator.createObjectURL(xhr.response);
      const link = document.createElement('a') as HTMLAnchorElement;
      link.download = `${title.split(' ').join('-')}.jpg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(link.href);
    };
    xhr.send();
  }
}
