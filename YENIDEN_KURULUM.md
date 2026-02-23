# Node_modules yeniden kurulum (PowerShell)

PowerShell'de şu komutları **ayrı ayrı** çalıştırın:

```powershell
Remove-Item -Recurse -Force node_modules
```

```powershell
Remove-Item -Force package-lock.json
```
*(Dosya yoksa hata verir, yok sayın.)*

```powershell
npm install
```

---

**Not:** `rmdir /s /q` ve `del` komutları **CMD** (Eski Komut İstemi) sözdizimidir. Cursor/VSCode terminali PowerShell ise yukarıdakileri kullanın.
