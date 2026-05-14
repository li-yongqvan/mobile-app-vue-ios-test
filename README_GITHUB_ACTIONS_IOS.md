# GitHub Actions iOS 验证说明

## 目标
- 在公开 GitHub 仓库中验证 Web 构建稳定
- 在 `macos-latest` runner 上验证 iOS 工程可构建
- 在 iOS Simulator 中拉起 App，并保留截图与日志

## 已提供的工作流
- `.github/workflows/build-web.yml`
- `.github/workflows/ios-smoke-test.yml`

## 你需要在 GitHub 仓库里配置的 Secrets
- `IOS_API_BASE_URL`
- `TEST_USERNAME`
- `TEST_PASSWORD`

说明：
- 当前工作流已经会使用 `IOS_API_BASE_URL`
- `TEST_USERNAME` 和 `TEST_PASSWORD` 先保留给后续登录链路扩展
- 目前不会把测试账号写进公开仓库

## 建议操作顺序
1. 把当前项目内容推到公开仓库
2. 在 GitHub 网页里进入仓库的 `Settings > Secrets and variables > Actions`
3. 新建 `IOS_API_BASE_URL`
4. 可同时创建 `TEST_USERNAME` 和 `TEST_PASSWORD`
5. 在仓库 `Actions` 页面启用 workflow
6. 先手动运行：
   - `Build Web Assets`
   - `iOS Simulator Smoke`
7. 先看 `ios-build-logs`、`ios-simulator-screenshot`、`ios-simulator-logs`
8. 首轮稳定后再保留定时运行

## 当前触发方式
- `workflow_dispatch`
- `push` 到 `main` 或 `master`
- `schedule`：每天两次

## 当前稳定性证明标准
- iOS 构建成功
- 模拟器可启动
- App 可安装并拉起
- 有截图
- 有构建日志
- 有模拟器运行日志

## 重要限制
- 这是 GitHub-hosted runners 上的模拟器验证，不是真机验证
- 当前阶段不包含完整 UI 自动化点击登录
- 如果后续要补登录流，可以在现有工作流基础上继续扩展
