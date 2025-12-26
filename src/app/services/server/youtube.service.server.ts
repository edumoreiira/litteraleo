import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

// interface for the expected json output
export interface VideoInfo {
  title: string;
  urlImage: string;
}

export class YoutubeServerService {
  private readonly channelId = 'UCxojmSZM9cnxcEpzwNIRw6g';
  private readonly youtubeUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${this.channelId}`;

  async getLastVideos(count: number = 5): Promise<VideoInfo[]> {
    try {
      // fetching the xml feed from youtube server-side
      const response = await axios.get(this.youtubeUrl);
      const xmlData = response.data;

      // parsing xml to json using fast-xml-parser
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
      });
      const parsedData = parser.parse(xmlData);

      // safely accessing the entry array
      // the structure depends on the feed, usually feed.entry is an array
      const entries = parsedData.feed?.entry || [];
      
      // ensuring entries is an array (it might be a single object if only 1 video exists)
      const entriesArray = Array.isArray(entries) ? entries : [entries];

      // mapping to simplified json structure
      return entriesArray.slice(0, count).map((entry: any) => {
        const title = entry.title || '';
        
        // extracting video id to construct the high-res image url
        const videoId = entry['yt:videoId'];

        // accessing thumbnail from media:group -> media:thumbnail
        // note: fast-xml-parser handles namespaced tags like 'media:group'
        // usually as 'media:group' key in the object
        const mediaGroup = entry['media:group'];
        const thumbnail = mediaGroup ? mediaGroup['media:thumbnail'] : null;
        
        // thumbnail might be an attribute 'url' inside the object
        // we prefer constructing the maxresdefault url using the video id to avoid black bars
        // if video id is missing, we fallback to the default thumbnail url provided in xml
        const urlImage = videoId 
          ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` 
          : (thumbnail ? thumbnail.url : '');

        return {
          title,
          urlImage,
        };
      });

    } catch (error) {
      console.error('error fetching youtube feed:', error);
      throw new Error('failed to fetch videos from youtube');
    }
  }
}