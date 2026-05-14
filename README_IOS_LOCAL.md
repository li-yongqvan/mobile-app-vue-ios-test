# iOS 本地联调说明

## 目标
- 先完成 iOS 本地联调
- 本地稳定后再上 iPhone 真机

## 当前仓库已完成
- 已接入 `@capacitor/ios`
- 已生成 `ios/` 原生工程
- 已添加 iOS 本地构建脚本
- 已为当前 HTTP 后端添加 iOS 联调阶段的 ATS 放行配置

## 本地联调顺序
1. 构建 iOS Web 资源：`npm run build:ios`
2. 同步到 iOS 工程：`npm run sync:ios`
3. 在 macOS 上打开工程：`npm run open:ios`
4. 先用模拟器完成登录、首页、题库、答题流程验证
5. 本地稳定后，再上 iPhone 真机测试

## 联调规则
- Web 本地开发继续使用 Vite 代理
- iOS 本地联调使用 `.env.ios` 中的完整后端地址
- iOS 阶段不单独维护一套页面逻辑，继续复用现有 Vue 业务代码

## 建议验收清单
- App 可以启动
- 登录成功
- 首页接口正常
- 题库接口正常
- 对战/排行榜接口正常
- 完成一轮答题并成功提交答案
