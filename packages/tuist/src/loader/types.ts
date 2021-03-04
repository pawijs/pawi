export interface Loader<T = any> {
  (path: string): Load<T>
}

export interface Load<T = any> {
  (name: string, raw?: boolean): Promise<T>
}

export interface MakeLoaderOpts {
  cache?: Map<string, string>
  observe?: (name: string, raw?: boolean) => void
}

export interface MakeLoader {
  loader: Loader
  close: () => void
}

export interface WatchLoaderObserver {
  contentChanged: (name: string, raw: boolean) => void
}

export interface WatchLoader extends MakeLoader {
  connect: (obs: WatchLoaderObserver) => void
  disconnect: (obs: WatchLoaderObserver) => void
}
