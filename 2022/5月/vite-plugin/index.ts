import type { PluginOption } from 'vite';

export default function vitePluginTemplate(): PluginOption {
  return {
    // 插件名称
    name: 'vite-plugin-template',

    // pre 会较于 post 先执行
    enforce: 'pre', // post

    // 指明它们仅在 'build' 或 'serve' 模式时调用
    apply: 'build', // apply 亦可以是一个函数

    config(config, { command }) {
      console.log('这里是config钩子');
    },

    configResolved(resolvedConfig) {
      console.log('这里是configResolved钩子');
    },

    configureServer(server) {
      console.log('这里是configureServer钩子');
    },

    transformIndexHtml(html) {
      console.log('这里是transformIndexHtml钩子');
    },
  }
}