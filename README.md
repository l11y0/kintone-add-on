# Kintone外掛程式 (Kintone Add-on)

## 目的

彙整所有部門 kintone 開發項目。

## 說明

以下列出需求部門的項目，並對該項目做簡短的功能說明。

## 修改現有應用程式SOP

1. 將 dev-tools/ 中的檔案拉進你要修改的專案資料夾中

2. 修改 scripts/.env.js 中的

   ```
   module.exports = {
   env: {
       baseurl: 'https://thn-buurtzorg.cybozu.com',
       username: 'kintone帳號',
       password: 'kintone帳號',
       appid: '應用程式id',
   },
   }
   ```

3. 在終端機下指令，下載專案所有依賴

   ```
   npm install
   ```

4. 注意 src/api/ 中的檔案的 token 以及 app 的 id 是否都正確

5. 在終端機下指令，並查看是否正常運行

   ```
   npm run start
   ```

6. 在終端機下指令，並查看 kintone 該應用程式，就可以開始測試

   ```
   npm run build
   ```

7. 測試完畢後，將自動產生出來的檔案「app.js」及「commons.js」
   上傳到「透過JavaScript/CSS自訂」

8. 回到該應用程式是否成功運行，完成

## 專案清單

### Admin 總務

#### adm-inventory (資產編碼管理)

- **表單**：[資產編碼管理]
- **功能需求**：
  - 即時驗證編碼格式，確保編碼第一碼為大寫英文字母且長度為3
  - 即時驗證序號格式，確保序號長度為3
  - 檢查代碼是否重複，避免重複輸入
  - 儲存驗證：所有欄位格式必須符合規定，且代碼不可重複
- **技術規格**：
  - 開發環境：Node.js v18.16.0
  - 瀏覽器支援：現代瀏覽器（市佔率 >0.5%、最新兩個版本），不支援 IE 11
  - 使用 Babel 與 Webpack 進行現代 JavaScript 轉換與打包
  - 使用 PostCSS 處理 CSS

### Institution 機構營運

#### inst-lock-effect-date (團隊增設/關閉申請)

- **表單**：[團隊增設/關閉申請]
- **功能需求**：
  - 「異動生效日」欄位鎖定功能：僅可填寫未來日期，不可填寫建立日以前之日期
  - 儲存驗證：若「異動生效日」欄位違反規則，則顯示錯誤並無法儲存紀錄
- **技術規格**：
  - 開發環境：Node.js v18.16.0
  - 瀏覽器支援：現代瀏覽器（市佔率 >0.5%、最新兩個版本），不支援 IE 11
  - 使用 Babel 與 Webpack 進行現代 JavaScript 轉換與打包
  - 使用 PostCSS 處理 CSS

## 開發注意事項

1. **依賴管理**：
   - 請確保 package.json 和 package-lock.json 都納入版本控制
   - 修改依賴後執行 `npm install` 重新生成 package-lock.json

2. **程式碼風格**：
   - 使用 Prettier 格式化程式碼 (`npm run format`)
   - 專案已配置 ESLint 與相關插件 (eslint-config-airbnb, eslint-config-prettier)
   - 建議在開發過程中遵循專案既有的程式碼風格

3. **瀏覽器相容性**：
   - 所有專案已設定不支援 IE 11
   - 使用 Babel 確保程式碼在目標瀏覽器中正常運作