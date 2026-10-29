/* ============================================================
   暮色档案 · Dusk Archive
   动效与交互层：GSAP + ScrollTrigger + SplitText
   所有动画都有动机：层级 / 叙事 / 反馈 / 状态切换
   ============================================================ */

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
CustomEase.create('paper', 'M0,0 C0.16,1 0.24,1 1,1');
CustomEase.create('curtain', 'M0,0 C0.62,0 0.24,1 1,1');

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const PARAMS = new URLSearchParams(location.search);
const FAST = PARAMS.has('skip-gate');
const STATIC = PARAMS.has('static');

/* ============================================================
   数据
   ============================================================ */
const STORE = 'dusk-archive-v1';

const SEED = [
  {
    id: 'p6', no: 'No.0412', title: '雨天的电车与二十分钟',
    body: '晚自习散场，雨还没停。车站的顶棚漏了一条线，正好打在我鞋尖前面。等了二十分钟车不来，我倒也不急。耳机里那首间奏循环了三十遍，忽然觉得这样站着也不算浪费。',
    time: '10月28日 21:47', tag: '#深夜', img: null, likes: 47,
    comments: [
      { name: '九月', text: '二十分钟已经很奢侈了，我连站台都待不住。', time: '22:03' },
      { name: '阿岩', text: '那条漏水的线，我也见过。城市里到处是这种缝。', time: '22:41' },
      { name: '喵帕斯', text: '下次带伞。', time: '23:10' }
    ]
  },
  {
    id: 'p5', no: 'No.0411', title: '重读第二章，还是被那句台词击中',
    body: '「我们不是在等世界变好，我们是在等自己变得能承受它。」第一次看只觉得酷，这次看，前面那句铺垫对上了，才明白作者埋了多久。',
    time: '10月27日 23:12', tag: '#重温', img: 'assets/ink-spring.jpg', likes: 132,
    comments: [
      { name: '九月', text: '这句我抄在本子上了，抄的时候手在抖。', time: '23:30' },
      { name: '老周', text: '铺垫这种东西，第一遍永远看不见。', time: '00:12' },
      { name: '阿岩', text: '水墨那张图你哪找的，我要当壁纸。', time: '07:44' },
      { name: '蓝', text: '回复 阿岩：官方海报，我裁了一下。', time: '08:20', mine: true },
      { name: '喵帕斯', text: '第二遍才是真正的第一遍。', time: '12:05' }
    ]
  },
  {
    id: 'p4', no: 'No.0409', title: '雪线以上的名字',
    body: '凌晨睡不着，把那张海报翻出来看。名字被刻在雪崖上，风一吹就淡一点。我想起小学时在课桌上刻的字，那张桌子现在大概已经不在了。',
    time: '10月26日 02:03', tag: '#深夜', img: 'assets/snow-paradise.jpg', likes: 88,
    comments: [
      { name: '阿岩', text: '刻在桌子上，老师罚站，值。', time: '02:40' },
      { name: '九月', text: 'PARADISE REGAINED 这几个字母，比画面还重。', time: '09:15' }
    ]
  },
  {
    id: 'p3', no: 'No.0407', title: '今晚的演出名单',
    body: '金色字写在深蓝的夜里，像有人举着灯在海底走。座位坐满了，没人说话，只有翻页声。散场后我在门口站了很久，不知道该往哪走。',
    time: '10月24日 19:30', tag: '#演出', img: 'assets/gold-concert.jpg', likes: 210,
    comments: [
      { name: '老周', text: '这场的返场我到现在还会哼。', time: '20:02' },
      { name: '九月', text: '散场那几分钟最好，也最难熬。', time: '21:18' },
      { name: '喵帕斯', text: '举着灯在海底走，这句写得真好。', time: '22:33' },
      { name: '阿岩', text: '下次带我。', time: '23:01' },
      { name: '蓝', text: '回复 阿岩：票不好抢，我帮你盯着。', time: '23:20', mine: true },
      { name: '老周', text: '盯票情谊，记住了。', time: '23:46' }
    ]
  },
  {
    id: 'p2', no: 'No.0405', title: '城市是暖黄色的',
    body: '下午四点的光从楼缝里漏下来，整条街像被泡在放旧了的照片里。我一边走一边想，要是我能一直这样走，什么都不用决定就好了。',
    time: '10月22日 16:40', tag: '#日常', img: 'assets/hero-city.jpg', likes: 301,
    comments: [
      { name: '喵帕斯', text: '什么都不用决定的下午，我一年也没几个。', time: '17:02' },
      { name: '九月', text: '左边那个抱着书跑的人好像我。', time: '17:55' },
      { name: '老周', text: '这不是 1999 的宣传图吗，你倒是会拍。', time: '18:20' },
      { name: '蓝', text: '回复 老周：拿来当今天的天气记录了。', time: '18:41', mine: true },
      { name: '阿岩', text: '暖黄这一年里最舒服的颜色。', time: '19:10' },
      { name: '九月', text: '这条我收藏了。', time: '20:04' },
      { name: '喵帕斯', text: '同收藏。', time: '20:11' },
      { name: '蓝', text: '谢谢你们来。', time: '21:30', mine: true }
    ]
  },
  {
    id: 'p1', no: 'No.0403', title: '翻到一张没寄出去的照片',
    body: '洗出来之后一直夹在册子里，本来想寄给一个人，后来觉得寄过去也没什么话说，就留着了。照片边角已经软了。',
    time: '10月20日 11:05', tag: '#手帐', img: 'assets/snow-panorama.jpg', likes: 64,
    comments: [
      { name: '九月', text: '没寄出去的东西最有分量。', time: '12:20' },
      { name: '老周', text: '夹在册子里就是寄出去了，收件人是你自己。', time: '15:07' }
    ]
  }
];

const state = {
  posts: [],
  tag: null,
  liked: new Set(),
  view: 'feed'
};

function load() {
  let mine = [];
  try {
    const raw = localStorage.getItem(STORE);
    if (raw) mine = JSON.parse(raw).posts || [];
  } catch (e) { /* 存储不可用时安静降级 */ }
  state.posts = [...mine, ...SEED];
  state.posts.forEach(p => { p.comments = p.comments || []; });
}
function save() {
  try {
    const mine = state.posts.filter(p => p.local);
    localStorage.setItem(STORE, JSON.stringify({ posts: mine }));
  } catch (e) { /* 忽略 */ }
}

/* ============================================================
   工具
   ============================================================ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  gsap.killTweensOf(el);
  gsap.timeline()
    .set(el, { pointerEvents: 'auto' })
    .to(el, { opacity: 1, y: 0, duration: .45, ease: 'power3.out' })
    .to(el, { opacity: 0, y: 12, duration: .4, ease: 'power2.in', delay: 1.7 })
    .set(el, { pointerEvents: 'none' });
}

/* ============================================================
   渲染
   ============================================================ */
function postHTML(p) {
  const liked = state.liked.has(p.id);
  return `
  <article class="post" data-id="${p.id}">
    <span class="post__tape" aria-hidden="true"></span>
    <span class="post__no">${esc(p.no)}</span>
    <header class="post__head">
      <span class="post__avatar">L</span>
      <span class="post__who">
        <span class="post__author">${esc(p.author || '蓝')}</span>
        <span class="post__time">${esc(p.time)}</span>
      </span>
      <span class="post__tag">${esc(p.tag)}</span>
    </header>
    <h3 class="post__title">${esc(p.title)}</h3>
    <p class="post__body">${esc(p.body)}</p>
    ${p.img ? `<figure class="post__figure"><span class="photo"><img src="${p.img}" alt="${esc(p.title)} 的配图" loading="lazy"></span></figure>` : ''}
    <footer class="post__foot">
      <button class="act act--like ${liked ? 'is-on' : ''}" data-act="like">
        <span class="act__word">${liked ? '已赞' : '赞'}</span><span data-like>${p.likes}</span>
      </button>
      <button class="act act--comment" data-act="comment">评论 <span>${p.comments.length}</span></button>
      <button class="act act--keep" data-act="keep">收藏</button>
    </footer>
    <div class="comments">
      <div class="comments__inner">
        ${p.comments.length ? p.comments.map(c => `
          <div class="cmt ${c.mine ? 'cmt--mine' : ''}">
            <span class="cmt__av">${esc(c.name.slice(0, 1))}</span>
            <div class="cmt__main">
              <div class="cmt__who"><span class="cmt__name">${esc(c.name)}</span><span class="cmt__time">${esc(c.time)}</span></div>
              <p class="cmt__text">${esc(c.text)}</p>
            </div>
          </div>`).join('') : '<p class="cmt__empty">还没有人说话。第一句留给你。</p>'}
        <form class="cmtform" data-cmtform>
          <input type="text" maxlength="120" placeholder="说一句放这里" aria-label="写一条评论">
          <button type="submit">回声</button>
        </form>
      </div>
    </div>
  </article>`;
}

function renderFeed(list) {
  $('#posts').innerHTML = list.map(postHTML).join('');
  bindPosts();
  if (!REDUCED) revealPosts();
}

function revealPosts() {
  if (STATIC) return;
  $$('.post').forEach((el, i) => {
    gsap.from(el, {
      y: 46, opacity: 0, duration: 1.05, ease: 'paper',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      delay: i < 2 ? i * .08 : 0
    });
  });
}

function renderArchive() {
  const ratio = ['acard--wide', 'acard--narrow', 'acard--narrow', 'acard--wide', 'acard--half', 'acard--half'];
  const pos = {
    'assets/ink-spring.jpg': '85% 86%',
    'assets/snow-paradise.jpg': '50% 68%',
    'assets/snow-panorama.jpg': '50% 46%'
  };
  $('#archiveGrid').innerHTML = state.posts.map((p, i) => {
    let op = pos[p.img] || 'center';
    if (!pos[p.img] && p.img === 'assets/hero-city.jpg' && i > 0) op = '22% 45%';
    return `
    <button class="acard ${ratio[i % ratio.length]}" data-id="${p.id}">
      <span class="acard__img"><img src="${p.img || 'assets/hero-city.jpg'}" alt="" loading="lazy" style="object-position:${op}"></span>
      <span class="acard__txt">
        <span class="acard__no">${esc(p.no)} · ${esc(p.tag)}</span>
        <span class="acard__title">${esc(p.title)}</span>
        <span class="acard__meta"><span>${esc(p.time)}</span><span>·</span><span>${p.comments.length} 条回声</span></span>
      </span>
    </button>`;
  }).join('');
}

function renderRail() {
  const tally = {};
  state.posts.forEach(p => { tally[p.tag] = (tally[p.tag] || 0) + 1; });
  $('#tagCloud').innerHTML = Object.entries(tally)
    .sort((a, b) => b[1] - a[1])
    .map(([t, n]) => `<button data-tag="${esc(t)}">${esc(t)}<i>${n}</i></button>`).join('');

  const months = [
    ['十月', '2025', state.posts.length],
    ['九月', '2025', 0],
    ['八月', '2025', 0]
  ];
  $('#monthList').innerHTML = months.map(([m, y, n]) =>
    `<li><b>${m}</b><i></i><span>${n ? n + ' 篇' : '空页'}</span></li>`).join('');
}

/* ============================================================
   帖子交互
   ============================================================ */
function bindPosts() {
  $$('.post').forEach(card => {
    const id = card.dataset.id;
    const post = state.posts.find(p => p.id === id);

    card.addEventListener('click', e => {
      const likeBtn = e.target.closest('[data-act="like"]');
      const cmtBtn = e.target.closest('[data-act="comment"]');
      const keepBtn = e.target.closest('[data-act="keep"]');

      if (likeBtn) return doLike(card, post, likeBtn);
      if (cmtBtn) return toggleComments(card);
      if (keepBtn) {
        keepBtn.textContent = '已收进册子';
        keepBtn.style.color = 'var(--gold-deep)';
        toast('收进册子了，在归档里能翻到');
      }
    });

    const form = card.querySelector('[data-cmtform]');
    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const input = form.querySelector('input');
        const text = input.value.trim();
        if (!text) return;
        post.comments.push({ name: '蓝', text, time: nowHM(), mine: true });
        save();
        card.querySelector('.comments__inner').innerHTML = commentsInner(post);
        rebindForm(card, post);
        const cmtCount = card.querySelector('.act--comment span');
        if (cmtCount) cmtCount.textContent = post.comments.length;
        updateCommentsHeight(card);
        const cmts = card.querySelectorAll('.cmt');
        gsap.from(cmts[cmts.length - 1], { y: 14, opacity: 0, duration: .6, ease: 'paper' });
        toast('回声已贴好');
      });
    }
  });
}

function commentsInner(post) {
  const list = post.comments.length ? post.comments.map(c => `
    <div class="cmt ${c.mine ? 'cmt--mine' : ''}">
      <span class="cmt__av">${esc(c.name.slice(0, 1))}</span>
      <div class="cmt__main">
        <div class="cmt__who"><span class="cmt__name">${esc(c.name)}</span><span class="cmt__time">${esc(c.time)}</span></div>
        <p class="cmt__text">${esc(c.text)}</p>
      </div>
    </div>`).join('') : '<p class="cmt__empty">还没有人说话。第一句留给你。</p>';
  return list + `<form class="cmtform" data-cmtform>
      <input type="text" maxlength="120" placeholder="说一句放这里" aria-label="写一条评论">
      <button type="submit">回声</button></form>`;
}

function rebindForm(card, post) {
  const inner = card.querySelector('.comments__inner');
  const form = inner.querySelector('[data-cmtform]');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input');
    const text = input.value.trim();
    if (!text) return;
    post.comments.push({ name: '蓝', text, time: nowHM(), mine: true });
    save();
    inner.innerHTML = commentsInner(post);
    rebindForm(card, post);
    updateCommentsHeight(card);
    const cmts = card.querySelectorAll('.cmt');
    gsap.from(cmts[cmts.length - 1], { y: 14, opacity: 0, duration: .6, ease: 'paper' });
    toast('回声已贴好');
  });
}

function nowHM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function doLike(card, post, btn) {
  const on = !state.liked.has(post.id);
  if (on) { state.liked.add(post.id); post.likes++; }
  else { state.liked.delete(post.id); post.likes--; }
  btn.classList.toggle('is-on', on);
  btn.querySelector('.act__word').textContent = on ? '已赞' : '赞';
  const num = btn.querySelector('[data-like]');
  num.textContent = post.likes;
  gsap.fromTo(num, { scale: 1.5, color: on ? '#A8342A' : '#5B5344' },
    { scale: 1, color: on ? '#A8342A' : '#5B5344', duration: .55, ease: 'back.out(3)' });

  if (on) {
    const r = document.createElement('span');
    r.className = 'ripple';
    btn.appendChild(r);
    gsap.fromTo(r, { scale: .4, opacity: .95 }, {
      scale: 9, opacity: 0, duration: .9, ease: 'power2.out',
      onComplete: () => r.remove()
    });
  }
}

function updateCommentsHeight(card) {
  const box = card.querySelector('.comments');
  if (box.dataset.open !== '1') return;
  const h = box.querySelector('.comments__inner').offsetHeight;
  gsap.to(box, { height: h, duration: .3, ease: 'power2.out' });
}

function toggleComments(card) {
  const box = card.querySelector('.comments');
  const inner = box.querySelector('.comments__inner');
  const open = box.dataset.open === '1';
  if (open) {
    box.dataset.open = '0';
    gsap.to(box, { height: 0, opacity: 0, duration: .5, ease: 'power3.inOut' });
  } else {
    box.dataset.open = '1';
    const h = inner.offsetHeight;
    gsap.fromTo(box, { height: 0, opacity: 0 }, {
      height: h, opacity: 1, duration: .62, ease: 'paper',
      onComplete: () => {
        if (!REDUCED) {
          gsap.from(box.querySelectorAll('.cmt'), {
            y: 16, opacity: 0, duration: .5, stagger: .045, ease: 'power2.out'
          });
        }
      }
    });
  }
}

/* ============================================================
   发帖
   ============================================================ */
function initComposer() {
  const ta = $('#composerBody');
  const count = $('#composerCount');
  let chosenTag = null;

  ta.addEventListener('input', () => {
    count.textContent = ta.value.length;
  });

  $$('#composerTags button').forEach(b => {
    b.addEventListener('click', () => {
      const on = b.classList.contains('is-on');
      $$('#composerTags button').forEach(x => x.classList.remove('is-on'));
      if (on) { chosenTag = null; }
      else { b.classList.add('is-on'); chosenTag = b.dataset.tag; }
    });
  });

  $('#composerSend').addEventListener('click', () => {
    const text = ta.value.trim();
    if (!text) {
      ta.focus();
      toast('先写点什么，一句话也行');
      return;
    }
    const post = {
      id: 'local-' + Date.now(),
      no: $('#composerNo').textContent,
      title: text.length > 26 ? text.slice(0, 26) + '…' : text,
      body: text,
      time: nowDateTime(),
      tag: chosenTag || '#随手记',
      img: null,
      likes: 0,
      comments: [],
      local: true
    };
    state.posts.unshift(post);
    save();

    const holder = document.createElement('div');
    holder.innerHTML = postHTML(post);
    const card = holder.firstElementChild;
    $('#posts').prepend(card);
    bindPosts();

    if (!REDUCED) {
      gsap.fromTo(card,
        { y: -18, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
        { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.05, ease: 'paper' });
    }

    ta.value = '';
    count.textContent = '0';
    $$('#composerTags button').forEach(x => x.classList.remove('is-on'));
    chosenTag = null;
    bumpComposerNo();
    renderRail();
    renderArchive();
    toast('贴进档案了');
  });
}

function bumpComposerNo() {
  const el = $('#composerNo');
  const n = parseInt(el.textContent.replace(/\D/g, ''), 10) + 1;
  el.textContent = 'No.' + String(n).padStart(4, '0');
}

function nowDateTime() {
  const d = new Date();
  return `${d.getMonth() + 1}月${d.getDate()}日 ${nowHM()}`;
}

/* ============================================================
   标签筛选
   ============================================================ */
function filterBy(tag) {
  state.tag = state.tag === tag ? null : tag;
  applyFilter();
}
function applyFilter() {
  const bar = $('#filterbar');
  if (!state.tag) {
    bar.hidden = true;
    renderFeed(state.posts);
    return;
  }
  bar.hidden = false;
  $('#filterName').textContent = state.tag;
  renderFeed(state.posts.filter(p => p.tag === state.tag));
  ensureVisible();
}

/* ============================================================
   视图切换（纸张转场）
   ============================================================ */
function playWipe(mid) {
  return new Promise(resolve => {
    if (REDUCED || STATIC) { mid && mid(); resolve(); return; }
    const cells = $$('.wipe__cells span');
    const seal = $('.wipe__seal');
    const line = $('.wipe__line');
    gsap.set(cells, { transformOrigin: '50% 100%' });
    const tl = gsap.timeline({ onComplete: resolve });
    tl.set('.wipe', { pointerEvents: 'auto' })
      .to(cells, { scaleY: 1, duration: .58, ease: 'power3.inOut', stagger: { each: .042, from: 'start' } })
      .to(seal, { opacity: 1, rotate: -4, scale: 1, duration: .52, ease: 'back.out(2.4)' }, '-=.42')
      .to(line, { opacity: 1, duration: .3 }, '-=.4')
      .add(() => { mid && mid(); })
      .to({}, { duration: .18 })
      .set(cells, { transformOrigin: '50% 0%' })
      .to(seal, { opacity: 0, scale: .82, duration: .34, ease: 'power2.in' }, '-=.1')
      .to(line, { opacity: 0, duration: .3 }, '-=.32')
      .to(cells, { scaleY: 0, duration: .66, ease: 'power3.inOut', stagger: { each: .038, from: 'end' } })
      .set('.wipe', { pointerEvents: 'none' });
  });
}

async function goView(name) {
  if (state.view === name) return;
  const panels = $$('[data-view-panel]');
  await playWipe(() => {
    panels.forEach(p => { p.hidden = p.dataset.viewPanel !== name; });
    window.scrollTo(0, 0);
    state.view = name;
    $$('.nav__links button').forEach(b => b.classList.toggle('is-active', b.dataset.view === name));
    moveInk();
    if (name === 'archive') animateArchive();
    if (name === 'about') animateAbout();
    ScrollTrigger.refresh();
  });
}

function animateArchive() {
  if (REDUCED || STATIC) return;
  gsap.from('.archive__head > *', { y: 26, opacity: 0, duration: .9, stagger: .1, ease: 'paper' });
  gsap.from('.acard', {
    y: 40, opacity: 0, duration: .9, stagger: .07, ease: 'paper', delay: .2
  });
}
function animateAbout() {
  if (REDUCED || STATIC) return;
  gsap.from('.about__side', { x: -24, opacity: 0, duration: 1, ease: 'paper' });
  gsap.from('.about__body > *', { y: 26, opacity: 0, duration: .9, stagger: .09, ease: 'paper', delay: .12 });
}

/* ============================================================
   导航下划线
   ============================================================ */
function moveInk() {
  const ink = $('.nav__ink');
  const active = $('.nav__links button.is-active');
  if (!ink || !active) return;
  const r = active.getBoundingClientRect();
  const p = active.parentElement.getBoundingClientRect();
  gsap.to(ink, {
    x: r.left - p.left, width: r.width, duration: .6, ease: 'paper'
  });
}

/* ============================================================
   入场
   ============================================================ */
function runGate() {
  const gate = $('#gate');
  const meter = $('[data-meter]');

  if (REDUCED || FAST) {
    gsap.set(gate, { autoAlpha: 0, pointerEvents: 'none' });
    document.body.classList.remove('is-locked');
    introHero(true);
    return;
  }

  document.body.classList.add('is-locked');
  gsap.set('.gate__sheets span', { scaleY: 0, transformOrigin: '50% 100%' });

  const chars = splitChars($('.gate__title'));

  const tl = gsap.timeline();
  tl.to('.gate__sheets span', { scaleY: 1, duration: .9, ease: 'power3.inOut', stagger: .05 })
    .from('.gate__seal', { scale: 1.9, opacity: 0, rotate: -22, filter: 'blur(6px)', duration: .9, ease: 'back.out(2)' }, '-=.5')
    .from('.gate__kicker', { opacity: 0, y: 10, duration: .7 }, '-=.5')
    .from(chars, { yPercent: 118, opacity: 0, duration: 1, stagger: .075, ease: 'paper' }, '-=.55')
    .from('.gate__script', { opacity: 0, y: 12, duration: .9 }, '-=.7')
    .to(meter, { scaleX: 1, duration: 1.5, ease: 'power1.inOut' }, '-=.6')
    .from('.gate__note', { opacity: 0, duration: .6 }, '-=.9');

  const out = () => {
    gsap.timeline()
      .set('.gate__sheets span', { transformOrigin: '50% 0%' })
      .to(['.gate__seal', '.gate__kicker', '.gate__title', '.gate__script', '.gate__meter', '.gate__note'],
        { opacity: 0, y: -18, duration: .45, ease: 'power2.in', stagger: .03 })
      .to('.gate__sheets span', { scaleY: 0, duration: .85, ease: 'power3.inOut', stagger: .05 }, '-=.3')
      .add(() => {
        gsap.set(gate, { autoAlpha: 0, pointerEvents: 'none' });
        document.body.classList.remove('is-locked');
        introHero();
      }, '-=.35');
  };

  tl.add(out, '+=.5');
  gate.addEventListener('click', () => { tl.progress(1); out(); }, { once: true });

  if (PARAMS.has('gp')) {
    tl.pause();
    tl.progress(Math.max(0, Math.min(1, parseFloat(PARAMS.get('gp')) || 0)));
  }
}

function splitChars(el) {
  if (!el) return [];
  const split = new SplitText(el, { type: 'chars' });
  return split.chars;
}

function introHero(quick) {
  if (REDUCED || quick) {
    /* 静态 / 低动效模式：直接落到最终状态，不建立任何 from 动画 */
    gsap.set(['.hero__frame img'], { scale: 1, yPercent: 0 });
    return;
  }
  const d = 1;

  const lines = $$('.hero__title [data-split]');
  lines.forEach(el => {
    const chars = splitChars(el);
    gsap.from(chars, {
      yPercent: 112, opacity: 0, rotate: 3, duration: 1.15 * d,
      stagger: .055, ease: 'paper', delay: .08
    });
  });

  gsap.from('.hero__kicker', { opacity: 0, y: 12, duration: .9 * d, delay: .1 });
  gsap.from('.hero__script', { opacity: 0, y: 14, duration: 1 * d, delay: .45 });
  gsap.from('.hero__lede', { opacity: 0, y: 18, duration: 1 * d, delay: .55 });
  gsap.from('.hero__acts > *', { opacity: 0, y: 16, duration: .9 * d, stagger: .1, delay: .68 });
  gsap.from('.hero__side', { opacity: 0, x: -14, duration: 1.1 * d, delay: .5 });
  gsap.from('.hero__stats > div', { opacity: 0, y: 16, duration: .9 * d, stagger: .09, delay: .8 });
  gsap.from('.marquee', { opacity: 0, duration: 1 * d, delay: .9 });
  gsap.from('.rail__card', { opacity: 0, x: 20, duration: .9 * d, stagger: .08, delay: .75 });

  /* 图片：像纸被揭开 */
  gsap.fromTo('.hero__frame', { clipPath: 'inset(0 0 100% 0)' },
    { clipPath: 'inset(0 0 0% 0)', duration: 1.5 * d, ease: 'curtain', delay: .25 });
  gsap.fromTo('.hero__frame img', { scale: 1.14 },
    { scale: 1, duration: 2.2 * d, ease: 'power2.out', delay: .3 });
  gsap.from('.hero__cap', { opacity: 0, y: 10, duration: .9 * d, delay: 1 });
  gsap.from('.hero__tape', { opacity: 0, scale: .85, rotate: -14, duration: .8 * d, delay: 1.1 });

  gsap.from('.hero__rings', { opacity: 0, scale: .82, duration: 2 * d, ease: 'power2.out' });
}

/* ============================================================
   滚动动效
   ============================================================ */
function initScroll() {
  if (REDUCED || STATIC) {
    $$('[data-count]').forEach(el => el.textContent = el.dataset.count);
    return;
  }

  /* 顶部进度 */
  gsap.to('#progressBar', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: .4 }
  });

  /* 导航吸顶 */
  ScrollTrigger.create({
    start: 'top -60', end: 99999,
    onUpdate: self => $('#nav').classList.toggle('is-stuck', self.scroll() > 60)
  });

  /* 首图视差 */
  gsap.to('.hero__frame img', {
    yPercent: 7, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 }
  });
  gsap.to('.hero__halftone', {
    yPercent: -16, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 }
  });
  gsap.to('.hero__copy', {
    yPercent: -8, opacity: .55, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 }
  });

  /* 圆环随滚动转 + 缓慢呼吸 */
  gsap.to('.ring', {
    rotate: 34, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.6 }
  });
  gsap.to('.hero__rings', {
    scale: 1.1, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 }
  });

  /* 数字 */
  $$('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 1.9, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 94%', once: true },
      onUpdate: () => { el.textContent = Math.round(obj.v); }
    });
  });

  /* 无限横条 */
  const track = $('[data-marquee]');
  if (track) {
    const loop = gsap.to(track, {
      xPercent: -50, duration: 26, ease: 'none', repeat: -1
    });
    ScrollTrigger.create({
      trigger: '.marquee', start: 'top bottom', end: 'bottom top',
      onUpdate: self => {
        const dir = self.direction === 1 ? 1 : -1;
        loop.timeScale(dir * (1 + Math.min(self.getVelocity() / 900, 4)));
      }
    });
  }

  /* 帖子以滚动方向轻微倾斜进入 */
  revealPosts();

  /* 章节标题 */
  gsap.from('.archive__head > *', {
    y: 30, opacity: 0, duration: 1, stagger: .1, ease: 'paper',
    scrollTrigger: { trigger: '.archive__head', start: 'top 85%', once: true }
  });
}

/* ============================================================
   鼠标光晕
   ============================================================ */
function initAura() {
  const aura = $('#aura');
  if (!aura || REDUCED || window.matchMedia('(pointer: coarse)').matches) return;
  const xTo = gsap.quickTo(aura, 'x', { duration: .9, ease: 'power3' });
  const yTo = gsap.quickTo(aura, 'y', { duration: .9, ease: 'power3' });
  let shown = false;
  window.addEventListener('pointermove', e => {
    if (!shown) { gsap.to(aura, { opacity: 1, duration: .8 }); shown = true; }
    xTo(e.clientX - 310);
    yTo(e.clientY - 310);
  }, { passive: true });
  window.addEventListener('pointerleave', () => gsap.to(aura, { opacity: 0, duration: .5 }));
}

/* ============================================================
   滚动到发帖框
   ============================================================ */
function ensureVisible() {
  const el = $('#filterbar');
  if (el && !el.hidden) {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
  }
}

/* ============================================================
   绑定
   ============================================================ */
function bindGlobal() {
  document.addEventListener('click', e => {
    const viewBtn = e.target.closest('[data-view]');
    if (viewBtn) {
      e.preventDefault();
      goView(viewBtn.dataset.view);
      return;
    }
    const tagBtn = e.target.closest('[data-tag]');
    if (tagBtn && tagBtn.closest('#tagCloud')) {
      filterBy(tagBtn.dataset.tag);
      return;
    }
    const composeBtn = e.target.closest('[data-action="compose"]');
    if (composeBtn) {
      if (state.view !== 'feed') { goView('feed').then(focusComposer); }
      else focusComposer();
      return;
    }
    const card = e.target.closest('.acard');
    if (card) {
      const tag = state.posts.find(p => p.id === card.dataset.id);
      state.tag = tag ? tag.tag : null;
      goView('feed').then(() => applyFilter());
    }
  });

  $('#filterClear').addEventListener('click', () => {
    state.tag = null;
    applyFilter();
  });

  $('#loadMore').addEventListener('click', () => {
    $('#loadMore').classList.add('is-done');
    $('#loadMore span').textContent = '册子只写到这一页';
    toast('更早的纸张还在柜子里，慢慢翻');
  });

  window.addEventListener('resize', () => {
    moveInk();
    ScrollTrigger.refresh();
  });

  document.fonts && document.fonts.ready.then(() => {
    moveInk();
    ScrollTrigger.refresh();
  });
}

function focusComposer() {
  setTimeout(() => {
    const el = $('#composer');
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top: y, behavior: 'smooth' });
    gsap.fromTo(el, { boxShadow: '0 0 0 0 rgba(201,161,85,0)' },
      { boxShadow: '0 0 0 3px rgba(201,161,85,.35)', duration: .6, yoyo: true, repeat: 1, delay: .45 });
    setTimeout(() => $('#composerBody').focus({ preventScroll: true }), 620);
  }, 260);
}

/* ============================================================
   启动
   ============================================================ */
function boot() {
  load();
  renderFeed(state.posts);
  renderArchive();
  renderRail();
  initComposer();
  bindGlobal();
  bindPosts();
  runGate();
  if (document.fonts) document.fonts.ready.then(() => { initScroll(); moveInk(); });
  else initScroll();
  initAura();
  requestAnimationFrame(moveInk);

  /* deep link: ?view=archive|about, ?open=1 */
  const v = PARAMS.get('view');
  if (v === 'archive' || v === 'about') goView(v);
  if (PARAMS.has('open')) {
    const first = $('.post');
    if (first) {
      const box = first.querySelector('.comments');
      box.dataset.open = '1';
      gsap.set(box, { height: 'auto', opacity: 1 });
    }
  }
  const at = parseInt(PARAMS.get('at'), 10);
  if (!isNaN(at)) requestAnimationFrame(() => window.scrollTo(0, at));
  if (PARAMS.has('selftest')) runSelfTest();
}

/* ============================================================
   自检（仅 ?selftest 时运行，结果写进 DOM 供 --dump-dom 抓取）
   ============================================================ */
function runSelfTest() {
  const out = [];
  const ok = (name, cond, extra) => out.push((cond ? 'PASS' : 'FAIL') + ' | ' + name + (extra ? ' | ' + extra : ''));

  try {
    /* 横向溢出诊断 */
    const vw = window.innerWidth;
    const over = $$('body *').filter(el => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.right > vw + 1;
    }).slice(0, 14).map(el => {
      const r = el.getBoundingClientRect();
      return el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '') + '@' + Math.round(r.right);
    });
    out.push('OVERFLOW | vw=' + vw + ' scrollW=' + document.documentElement.scrollWidth + ' | ' + (over.join(' ; ') || 'none'));

    ok('初始帖子数=6', $$('.post').length === 6, 'got ' + $$('.post').length);
    ok('归档卡片数=6', $$('.acard').length === 6, 'got ' + $$('.acard').length);
    ok('标签云非空', $$('#tagCloud button').length > 0, $$('#tagCloud button').length + ' tags');

    /* 发帖 */
    const ta = $('#composerBody');
    ta.value = '自检用的测试纸片';
    ta.dispatchEvent(new Event('input'));
    $('#composerSend').click();
    ok('发帖后帖子数=7', $$('.post').length === 7, 'got ' + $$('.post').length);
    ok('发帖后首条是新帖', ($('.post .post__title') || {}).textContent === '自检用的测试纸片',
      ($('.post .post__title') || {}).textContent);
    const stored = JSON.parse(localStorage.getItem('dusk-archive-v1') || '{"posts":[]}').posts;
    ok('localStorage 只持久化自己发的帖', stored.length === 1 && stored[0].title === '自检用的测试纸片',
      'stored ' + stored.length);

    /* 点赞 */
    const likeBtn = $('.post .act--like');
    const likeNum = likeBtn.querySelector('[data-like]');
    const before = parseInt(likeNum.textContent, 10);
    likeBtn.click();
    ok('点赞数字+1', parseInt(likeNum.textContent, 10) === before + 1,
      before + ' -> ' + likeNum.textContent);
    ok('点赞按钮进入已赞态', likeBtn.classList.contains('is-on'));
    likeBtn.click();
    ok('再点取消点赞', parseInt(likeNum.textContent, 10) === before, 'back to ' + likeNum.textContent);

    /* 评论 */
    const firstPost = $('.post');
    firstPost.querySelector('[data-act="comment"]').click();
    const form = firstPost.querySelector('[data-cmtform]');
    const input = form.querySelector('input');
    input.value = '这是一条自检评论';
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    const mine = firstPost.querySelectorAll('.cmt--mine').length;
    ok('评论写入并标记为我的', mine === 1, 'mine=' + mine);

    /* 筛选 */
    const tagBtn = $('#tagCloud button');
    if (tagBtn) {
      const tag = tagBtn.dataset.tag;
      filterBy(tag);
      const n = $$('.post').length;
      ok('按标签筛选生效', n >= 1 && n < 7, tag + ' -> ' + n + ' 条');
      if ($('#filterClear')) $('#filterClear').click();
      ok('清除筛选恢复7条', $$('.post').length === 7, 'got ' + $$('.post').length);
    } else {
      ok('筛选', false, '无标签按钮');
    }

    /* 视图切换 */
    goView('archive');
    ok('切到归档视图', $('#view-archive').classList.contains('is-on') || !$('#view-archive').hasAttribute('hidden'));
    goView('about');
    ok('切到关于视图', !$('#view-about').hasAttribute('hidden'));
    goView('feed');
    ok('切回时间流', !$('#view-feed').hasAttribute('hidden'));

    /* 判定 */
    const fails = out.filter(l => l.startsWith('FAIL')).length;
    out.push('SUMMARY | ' + (out.length - 1 - fails) + ' passed / ' + fails + ' failed');
  } catch (err) {
    out.push('EXCEPTION | ' + err.message + ' @ ' + (err.stack || '').split('\n')[1]);
  }

  const box = document.createElement('pre');
  box.id = 'selftest';
  box.style.cssText = 'position:fixed;left:0;right:0;top:0;z-index:99999;background:#000;color:#0f0;font:11px monospace;padding:8px;max-height:100vh;overflow:auto;white-space:pre-wrap';
  box.textContent = 'SELFTEST\n' + out.join('\n');
  document.body.appendChild(box);
  document.title = 'SELFTEST ' + (out.some(l => l.startsWith('FAIL') || l.startsWith('EXCEPTION')) ? 'FAIL' : 'OK');
}

boot();
