/// <reference types="vite/client" />

// 解决新文件 Vue: Cannot find module ../views/ET.vue  or its corresponding type declarations.
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
