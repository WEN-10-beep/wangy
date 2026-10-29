# 把站放到网上，给别人一个链接

目标：拿到一个 `https://...` 的地址，任何人（包括手机）点开就能看。

准备好了 `dusk-archive-dist` 文件夹 —— **要传的是这个文件夹里的东西**，不是整个 `dusk-archive`（那个带着 6.8MB 截图，白占空间）。

---

## 方案 A · GitHub Pages（最标准，地址永久）

需要：一个 GitHub 账号（github.com 免费注册，用邮箱即可）。

### 第 1 步 · 建仓库

1. 登录后点右上角 `+` → **New repository**
2. **Repository name** 填 `dusk-archive`
3. 选 **Public**（Private 仓库不能用免费 Pages）
4. 不用勾任何初始化选项，直接 **Create repository**

### 第 2 步 · 上传文件

1. 在新仓库页面点 **uploading an existing file**（或 `Add file` → `Upload files`）
2. 打开电脑上的 `E:\总桌面软件\DK\dusk-archive-dist` 文件夹
3. **全选里面所有内容**（Ctrl+A），拖进网页那个虚线框
   - 注意：是拖**文件夹里面的内容**，不是拖 `dusk-archive-dist` 这个文件夹本身
   - 也可以直接把 `dusk-archive-dist` 文件夹拖进去，GitHub 会自动展开
4. 等下面的文件列表出现全部 21 个文件（`index.html`、`styles.css`、`app.js`、`assets/`、`vendor/`、`favicon.svg`、`og-image.jpg`、`robots.txt`、`.nojekyll`…）
5. 底部 **Commit changes**

### 第 3 步 · 开 Pages

1. 仓库顶部 **Settings**
2. 左侧菜单拉到最下面 **Pages**
3. **Source** 选 `Deploy from a branch`
4. **Branch** 选 `main`，右边文件夹选 `/ (root)`
5. **Save**
6. 等 1–2 分钟，刷新这个页面，顶部会出现绿色提示：
   `Your site is live at https://你的用户名.github.io/dusk-archive/`

### 第 4 步 · 改分享卡片地址

打开 `index.html`，把这两行改成你的真实地址（注意结尾斜杠和文件名）：

```html
<meta property="og:image" content="https://你的用户名.github.io/dusk-archive/og-image.jpg">
<meta property="og:url" content="https://你的用户名.github.io/dusk-archive/">
```

改完重新上传 `index.html`（Add file → Upload files → 覆盖同名文件 → Commit），等一分钟生效。

### 想要更短的地址

仓库名取 `你的用户名.github.io`，地址就变成 `https://你的用户名.github.io/`，没有子路径。**但一个人只能有一个**，且会占掉主页位置，新手建议先用子路径。

---

## 方案 B · Netlify（最快，30 秒，不用注册）

1. 打开 https://app.netlify.com/drop
2. 把 `dusk-archive-dist` 文件夹整个拖进虚线框
3. 等十几秒 → 得到 `https://随机名字.netlify.app`
4. 想要永久 + 好记名字：注册账号（邮箱即可）→ `Site configuration` → `Change site name` → 改成 `dusk-archive`

同一份文件也能拖到 https://vercel.com/new ，步骤一样。

---

## ⚠️ 国内访问这件事

- **GitHub Pages**（`github.io`）：国内经常打不开或很慢，因为域名被干扰。你自己能开，朋友不一定能开。
- **Netlify**：国内一般能开，偶尔慢，但比 github.io 稳。
- **Vercel**：国内时好时坏。

如果主要给国内朋友看，**用 Netlify**。图省心、想要永久稳定地址、以后还能改版本，**用 GitHub Pages**。两个都传也不冲突，一个当正经站，一个当备用。

---

## 以后更新内容怎么办

改了 `dusk-archive` 里的文件后，把改动同步到 `dusk-archive-dist`，再重新传一次：

- GitHub：`Add file` → `Upload files` → 拖新文件 → Commit（同名会覆盖）
- Netlify：重新拖一次文件夹，秒级更新

---

## 已经准备好的

`dusk-archive-dist` 里有一个 `.git` 目录（已初始化并提交过一次）。如果以后想用命令行而不是网页上传：

```
cd "E:\总桌面软件\DK\dusk-archive-dist"
git remote add origin https://github.com/你的用户名/dusk-archive.git
git push -u origin main
```

推送时会让你输入账号密码 —— GitHub 早就不能用密码了，要填 **Personal Access Token**（Settings → Developer settings → Personal access tokens → Generate new token，勾 `repo`）。嫌麻烦就用网页上传，效果一样。
