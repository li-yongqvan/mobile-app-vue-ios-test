# iOS 真机测试说明

## 目标

在本地 Mac + Xcode 上，把当前 Capacitor/Vue App 安装到 iPhone 真机并完成基础功能验证。当前阶段使用免费 Apple ID 和 Xcode 自动签名，不配置 GitHub Actions 签名，也不接 TestFlight。

## 当前仓库状态

- 已接入 `@capacitor/ios`，iOS 工程位于 `ios/App/App.xcodeproj`
- 已提供 `npm run prepare:ios`，会依次执行 iOS Web 构建和 Capacitor 同步
- 当前 Bundle ID 是 `com.police.exam`
- Xcode 项目当前是 `Automatic` signing，但没有提交个人 `DEVELOPMENT_TEAM`
- iOS 环境变量来自 `.env.ios`，当前 API 地址是 `http://114.132.68.81:8000/api`
- `Info.plist` 已为 `114.132.68.81` 放行 HTTP 联调请求

## Mac 和 iPhone 准备

1. 在 Mac 上安装最新版 Xcode。
2. 用 USB 连接 iPhone，并在 iPhone 上点击信任此电脑。
3. 在 Xcode 登录 Apple ID：`Xcode > Settings > Accounts`。
4. 在 iPhone 打开开发者模式：`Settings > Privacy & Security > Developer Mode`，按提示重启。
5. 确认 Mac 能访问 `.env.ios` 中的后端地址。

## 构建并打开工程

在 Mac 的项目根目录执行：

```bash
npm ci
npm run prepare:ios
npm run open:ios
```

`prepare:ios` 等价于：

```bash
npm run build:ios
npm run sync:ios
```

## Xcode 签名配置

1. 在 Xcode 左侧选择 `App` project，再选择 `App` target。
2. 打开 `Signing & Capabilities`。
3. 勾选 `Automatically manage signing`。
4. `Team` 选择你的免费 Apple ID 的 Personal Team。
5. 保持 `Debug` 配置用于第一次真机测试。

如果 `com.police.exam` 无法签名或提示 Bundle ID 被占用，把 Bundle Identifier 改成唯一值，例如：

```text
com.liyongquan.policeexam
```

Bundle ID 改动可以先只在 Xcode 中验证；确认真机流程稳定后，再决定是否提交回仓库。

## 安装到 iPhone

1. 在 Xcode 顶部设备列表选择已连接的 iPhone。
2. 点击 Run。
3. 如果 iPhone 提示未信任开发者，进入 `Settings > General > VPN & Device Management`，信任该 Apple ID 开发者证书。
4. 回到 Xcode 再次点击 Run，直到 App 成功启动。

## 真机验收清单

- App 能启动，首页没有白屏
- 登录流程能完成
- 首页、题库、答题页面能正常打开
- API 请求能访问 `.env.ios` 配置的后端
- 一轮答题能提交成功
- 关闭 App 后重新打开仍正常
- 断网或弱网时不会卡死在不可恢复状态

## 常见问题

- `No profiles for ... were found`：确认 Xcode 已登录 Apple ID，并选择了 Personal Team。
- Bundle ID 被占用：改成唯一 Bundle ID，例如 `com.liyongquan.policeexam`。
- App 安装后打不开或白屏：重新执行 `npm run prepare:ios`，确认 `ios/App/App/public` 已同步最新构建产物。
- 真机请求接口失败：确认 iPhone 网络能访问 `114.132.68.81:8000`，并检查 `.env.ios` 的 `VITE_API_URL`。
- 免费 Apple ID 安装过期：重新连接 iPhone，在 Xcode 再次 Run。
