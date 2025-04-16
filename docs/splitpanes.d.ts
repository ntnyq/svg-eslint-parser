declare module 'splitpanes' {
  import type { DefineComponent } from 'vue'

  export interface SplitpanesProps {
    firstSplitter?: boolean
    horizontal?: boolean
    pushOtherPanes?: boolean
  }

  export interface PaneProps {
    maxSize?: number
    minSize?: number
    size?: number
  }

  export declare const Splitpanes: DefineComponent<SplitpanesProps, {}>

  export declare const Pane: DefineComponent<PaneProps, {}>
}
