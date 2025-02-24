export interface IMediaVideoDataList {
    video:Array<Record<string,string>>;
    thumb: string;
    title: string;
  }

  export interface IMediaVideoDataResponse {
    videos:Array<IMediaVideoDataList>;
  }