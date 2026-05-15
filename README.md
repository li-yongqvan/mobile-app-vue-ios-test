# 警务实战系统移动端

Vue 3 + Vite + Capacitor 移动端工程，支持 Web 构建、iOS 本地构建和 GitHub Actions 构建验证。

## 常用命令

```bash
npm ci
npm run dev
npm run build:web
npm run prepare:ios
npm run open:ios
```

## iOS 真机测试

第一版真机测试优先走本地 Mac + Xcode 自动签名：

1. 在 Mac 上执行 `npm ci`
2. 执行 `npm run prepare:ios`
3. 执行 `npm run open:ios`
4. 在 Xcode 里选择 Personal Team 并连接 iPhone Run

完整步骤见 [README_IOS_LOCAL.md](README_IOS_LOCAL.md)。

## 相关文档

- [移动端技术说明](README_MOBILE.md)
- [iOS 本地真机测试](README_IOS_LOCAL.md)
- [GitHub Actions iOS 验证](README_GITHUB_ACTIONS_IOS.md)
