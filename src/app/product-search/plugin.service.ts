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
      switch (data.message) {
        case 'downloadImage': {
          this.downloadImage(data.data);
          break;
        }
        default:
          return;
      }
    };

    this.plugin.contentWindow.postMessage('init', '*', [this.channel.port2]);
  }

  sendMessage(message: string) {
    this.channel.port1.postMessage(message);
  }

  downloadImage(data: { title: string, downloadUrl: string }) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', data.downloadUrl);
    xhr.responseType = 'blob';
    xhr.onload = (e) => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const urlCreator = window.URL || window.webkitURL;
        const url = urlCreator.createObjectURL(xhr.response);
        const link = document.createElement('a') as HTMLAnchorElement;
        link.download = `${data.title.split(' ').join('-')}.jpg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(link.href);
      }
    };
    xhr.send();
  }
}
