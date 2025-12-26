import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface YoutubeVideo {
  title: string;
  urlImage: string;
  urlVideo: string;
}

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  latestVideos = httpResource<YoutubeVideo[]>(() => '/api/youtube')
}