# 動態問卷系統（Survey Project）

這是一個「前台填寫 + 後台管理」的問卷系統。  
後台可以新增問卷、設計題目、預覽與查看統計；前台可以填寫與送出。


前端http://localhost:4200
## Main Pages / Routes
### Admin
- `/admin/surveys` 後台問卷管理
- `/admin/surveys/new` 新增問卷（含題目）
- `/admin/surveys/:id/edit` 編輯基本資料
- `/admin/surveys/:id/questions` 編輯題目
- `/admin/surveys/:id/preview` 後台預覽

### User
- `/surveys` 問卷列表
- `/surveys/:id` 填寫問卷
- `/surveys/:id/confirm` 確認答案
- `/surveys/:id/done` 完成頁
- `/surveys/:id/results` 統計結果（admin 會帶 `?from=admin` 顯示回後台）

## Notes
- 為避免答案對不上題目，若問卷已有回覆，後台不允許更新題目/選項（full update 會被擋）。

### 前台（使用者）
- 問卷列表
- 填寫問卷 → 確認答案 → 送出
- 查看統計結果



## 使用技術
- 前端：Angular
- 後端：Spring Boot（REST API）
- 資料庫：MySQL
- 圖表：Chart.js



## 專案結構
- frontend/：前端（Angular）
- backend/：後端（Spring Boot）



## 如何在本機跑起來
### 1) MySQL
建立資料庫（schema）：
- dynamic_surveys

### 2) 後端設定（重要：密碼不上傳）
DB 密碼改成「只放本機」，不會 commit 到 GitHub。

請在 `backend/src/main/resources/` 自己建立：
- `application-local.properties`

範例
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/dynamic_surveys?useSSL=false&serverTimezone=Asia/Taipei&characterEncoding=utf8
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.profiles.active=local
