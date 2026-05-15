# GitHub Actions iOS 验证说明

## 目标

GitHub Actions 当前只负责验证仓库构建稳定性：

- Ubuntu runner 验证 Web 构建和 iOS Web 资源构建
- macOS runner 验证 Capacitor iOS 工程可以完成模拟器 Debug build

当前阶段不在 CI 中做真机签名、不生成可安装 IPA、不发布 TestFlight。真机测试请使用 [README_IOS_LOCAL.md](README_IOS_LOCAL.md) 中的本地 Xcode 流程。

## 已提供的工作流

- `.github/workflows/build-web.yml`
- `.github/workflows/ios-build-sync.yml`

## GitHub Secrets

需要配置：

- `IOS_API_BASE_URL`

可预留给后续登录链路扩展：

- `TEST_USERNAME`
- `TEST_PASSWORD`

说明：

- `IOS_API_BASE_URL` 会注入 `npm run build:ios`
- 当前 workflow 不会把测试账号写进公开仓库
- 当前 workflow 使用 Node.js 24 和 npm 官方 registry

## 建议操作顺序

1. 推送代码到 `main`
2. 在 GitHub 仓库进入 `Settings > Secrets and variables > Actions`
3. 新建 `IOS_API_BASE_URL`
4. 到 `Actions` 页面手动运行或等待 push 触发：
   - `Build Web Assets`
   - `iOS Build Sync`
5. 确认两个 workflow 都是 success
6. 本地真机测试前，先以最新 `main` 为准

## 当前成功标准

- `npm ci` 成功
- `npm run build:web` 成功
- `npm run build:ios` 成功
- `npm run sync:ios` 成功
- `xcodebuild` 在 iOS Simulator SDK 下 Debug build 成功

## 重要限制

- CI 构建使用 `CODE_SIGNING_ALLOWED=NO`，不能代表真机签名成功
- CI 目标是 iOS Simulator，不会安装到 iPhone 真机
- 免费 Apple ID 的 Personal Team 只适合本地 Xcode 自动签名，不适合放进公开仓库或 CI
- 后续如果要生成真机 IPA 或 TestFlight，需要改用付费 Apple Developer Program，并新增证书、profile 和 GitHub secrets
