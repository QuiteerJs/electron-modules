# electron-modules
一些关于electron的便捷工具类库。

## Packages

| 包 | 说明 |
| --- | --- |
| [@quiteer/electron-ipc](./packages/ipc) | 主进程 ipc 事件总线，附带渲染层类型增强 |
| [@quiteer/electron-preload](./packages/preload) | 预加载脚本桥接封装，一行接入 `webPreferences.preload` |
| [@quiteer/electron-browser](./packages/browser) | 窗口创建与统一管理，随时按名取窗 |
| [@quiteer/electron-menu](./packages/menu) | 菜单创建与统一管理，按点分路径定位菜单项 |
| [@quiteer/electron-tray](./packages/tray) | 系统托盘创建与统一管理，图标状态切换 |

## 开发

```bash
pnpm install
pnpm build   # 构建全部包
pnpm test    # 运行测试
pnpm lint    # 代码检查
```
