# electron-modules

一些关于 electron 的便捷工具类库。每个包只做一件事，互不依赖，按需取用。

## Packages

| 包                                                | 运行环境 | 说明                                                           |
| ------------------------------------------------- | -------- | -------------------------------------------------------------- |
| [@quiteer/electron-ipc](./packages/ipc)           | 主进程   | 开箱即用的 IPC 通道（窗口控制 / 路径处理），附带渲染层类型增强 |
| [@quiteer/electron-preload](./packages/preload)   | 预加载   | 预加载脚本桥接封装，一行接入 `webPreferences.preload`          |
| [@quiteer/electron-browser](./packages/browser)   | 主进程   | 窗口创建与统一管理，随时按名取窗                               |
| [@quiteer/electron-menu](./packages/menu)         | 主进程   | 菜单创建与统一管理，按点分路径定位菜单项                       |
| [@quiteer/electron-tray](./packages/tray)         | 主进程   | 系统托盘创建与统一管理，图标状态切换                           |
| [@quiteer/electron-shortcut](./packages/shortcut) | 主进程   | 全局快捷键按名注册，冲突检测，按窗口焦点启停                   |
| [@quiteer/electron-app](./packages/app)           | 主进程   | 应用生命周期：单实例、deep link、activate 重建、优雅退出       |

## 共同约定

几个管理器类的包（browser / menu / tray / shortcut）写法一致，学会一个就够：

- **按名注册，随处取用**：创建时给个 `name`，之后任意模块里按名取回，不用自己传实例、存全局变量。
- **响应式句柄**：返回的句柄在原生对象之上补了可直接读写的属性，`win.title = 'x'`、`tray.state = 'busy'` 都会同步到真实对象。
- **仓库持有引用**：`Tray` / `Menu` 一旦被 GC 就会失效（图标消失、快捷键失灵），仓库会一直持有它们，并在销毁时自动摘除。
- **类型安全**：`createXxxManager<'main' | 'settings'>()` 可把名称锁成字面量联合，写错即报错。
- **ESM-only**：主进程侧的产物统一为 ES Module，最终编译交给应用构建；`preload` 是唯一的例外，受 `sandbox` 限制必须输出 CommonJS。

## 组合示例

```ts
import { setupApp } from '@quiteer/electron-app';
import { windows } from '@quiteer/electron-browser';
import { menus } from '@quiteer/electron-menu';
import { shortcuts } from '@quiteer/electron-shortcut';
import { trays } from '@quiteer/electron-tray';

const lifecycle = setupApp({
  windows,
  mainWindow: 'main',
  createMainWindow: () =>
    windows.create({ name: 'main', width: 1200, height: 800, url: 'https://example.com' }),
  onReady: () => {
    menus.create({
      name: 'app',
      template: [
        { id: 'file', label: '文件', submenu: [{ id: 'file.quit', label: '退出', role: 'quit' }] },
      ],
    });

    trays.create({
      name: 'main',
      icon: { idle: 'resources/tray.png', syncing: 'resources/tray-syncing.png' },
      tooltip: '我的应用',
      contextMenu: [
        { label: '显示主窗口', click: () => lifecycle.focusMainWindow() },
        { label: '退出', click: () => lifecycle.quit() },
      ],
    });

    shortcuts.register({
      name: 'toggle',
      accelerator: 'CmdOrCtrl+Shift+K',
      handler: () => lifecycle.focusMainWindow(),
    });
  },
  beforeQuit: [() => trays.destroyAll(), () => windows.closeAll()],
});
```

## 开发

```bash
pnpm install
pnpm build   # 构建全部包
pnpm test    # 运行测试
pnpm check   # 格式 + lint + 类型检查 (CI 同款)
pnpm lint    # 仅 lint
```

每个包的测试都在 `test/` 下, 打包时把 `electron` 替换为 `test/stubs/electron.ts` 里的替身, 无需真实 Electron 环境。
