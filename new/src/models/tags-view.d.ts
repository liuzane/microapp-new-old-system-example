export interface TagsViewState {
  visitedViews: TagView[];
}

export interface TagView {
  path: string;
  name: string;
  meta: {
    title?: string;
    closeable?: boolean; // tags-view 中是否可关闭标签, 默认 true
    cache?: boolean; // keep-alive 缓存页面, 默认 true
  };
}
