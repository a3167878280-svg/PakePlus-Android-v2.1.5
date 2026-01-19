// 粒子类定义
class Particle {
    // 粒子构造函数
    constructor(x, y, radius, color, velocity, decay, gravity) {
        this.x = x; // 粒子的x坐标
        this.y = y; // 粒子的y坐标
        this.radius = radius; // 粒子的半径
        this.color = color; // 粒子的颜色
        this.velocity = velocity; // 粒子的速度对象，包含x和y方向的速度
        this.decay = decay || 0.015; // 粒子的衰减速率，默认值为0.015
        this.alpha = 1; // 粒子的透明度，初始值为1
        this.gravity = gravity || 0.05; // 粒子受到的重力加速度，默认值为0.05
    }
    // 绘制粒子的方法
    draw() {
        ctx.save(); // 保存当前绘图状态
        ctx.globalAlpha = this.alpha; // 设置绘图透明度
        ctx.beginPath(); // 开始绘制
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); // 绘制圆形粒子
        ctx.fillStyle = this.color; // 设置填充颜色
        ctx.fill(); // 填充颜色
        ctx.restore(); // 恢复之前保存的绘图状态
    }
    // 更新粒子状态的方法
    update() {
        this.velocity.y += this.gravity; // 应用重力，使粒子下降
        this.x += this.velocity.x; // 更新粒子的x坐标
        this.y += this.velocity.y; // 更新粒子的y坐标
        this.alpha -= this.decay; // 更新粒子的透明度
        if (this.alpha <= this.decay) {
            this.alpha = 0; // 当透明度小于衰减速率时，将透明度设置为0
        }
        this.draw(); // 绘制更新后的粒子
    }
    // 判断粒子是否仍然存活（透明度大于0）
    isAlive() {
        return this.alpha > 0;
    }
}
// 烟花类定义
class Firework {
    // 烟花构造函数
    constructor(x, y, color, riseSpeed = -1, particleSize = 2) {
        this.x = x; // 烟花的x坐标
        this.y = y; // 烟花的y坐标
        this.color = color; // 烟花的颜色
        this.riseSpeed = riseSpeed; // 烟花上升速度
        this.particleSize = particleSize; // 爆炸后生成的粒子大小
        this.particles = []; // 存储爆炸后生成的粒子数组
        this.exploded = false; // 标记烟花是否已经爆炸
        this.velocity = { x: Math.random() * 2 - 1, y: this.riseSpeed }; // 烟花的速度，x轴速度模拟风
    }
    // 烟花爆炸方法
explode() {
    const pattern = Math.floor(Math.random() * 5); // 随机选择爆炸图案类型
const particleCount = 100 + Math.random() * 1000; // 确定爆炸生成的粒子数量
for (let i = 0; i < particleCount; i++) {
    let speed, angle;
    // 根据图案类型生成粒子速度和角度
    switch(pattern) {
        case 0: // 圆形
            speed = Math.random() * 5 + 2; // 粒子速度
            angle = Math.PI * 2 * i / particleCount; // 角度
            break;
        case 1: // 星星
            speed = Math.random() * 5 + 2; // 粒子速度
            angle = Math.PI * 2 * i / particleCount + Math.PI / 5; // 角度
            break;
        case 2: // 爱心
            speed = Math.random() * 3 + 1; // 粒子速度
            angle = Math.PI * 2 * i / particleCount; // 角度
            break;
        case 3: // 散射
            speed = Math.random() * 5 + 2; // 粒子速度
            angle = Math.PI * 2 * i / particleCount + Math.random() * Math.PI / 2 - Math.PI / 4; // 角度
            break;
        case 4: // 螺旋
            speed = Math.random() * 5 + 2; // 粒子速度
            angle = Math.PI * 2 * i / particleCount + Math.PI * 5 / 4 * Math.sin(Math.PI * 2 * i / particleCount); // 角度
            break;
        default:
            speed = Math.random() * 5 + 2; // 粒子速度
            angle = Math.PI * 2 * i / particleCount; // 默认角度
    }
    const decay = Math.random() * 0.04 + 0.01; // 粒子衰减速率
    const gravity = Math.random() * 0.05 + 0.03; // 粒子重力加速度
    // 创建新粒子并添加到粒子数组中
    this.particles.push(new Particle(this.x, this.y, this.particleSize, `hsl(${Math.random() * 360}, 100%, 50%)`, {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
    }, decay, gravity));
}
}

    // 更新烟花状态的方法
    update() {
        if (!this.exploded) {
            this.y += this.velocity.y; // 更新烟花的y坐标，使其上升
            this.x += this.velocity.x; // 更新烟花的x坐标，模拟风效果
            this.draw(); // 绘制上升中的烟花
            // 判断烟花是否达到爆炸高度
            if (this.y < canvas.height * (0.18 + Math.random() * 0.22)) {
                this.exploded = true; // 标记烟花为已爆炸
                this.explode(); // 触发烟花爆炸
            }
        } else {
            // 更新所有粒子的状态，并移除已经“死亡”的粒子
            this.particles = this.particles.filter(p => p.isAlive());
            this.particles.forEach(p => p.update());
        }
    }
    // 绘制上升中的烟花方法
    draw() {
        ctx.save(); // 保存当前绘图状态
        ctx.globalAlpha = 1; // 设置绘图透明度为不透明
        ctx.beginPath(); // 开始绘制
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2, false); // 绘制表示烟花的小圆点
        ctx.fillStyle = this.color; // 设置填充颜色
        ctx.fill(); // 填充颜色
        ctx.restore(); // 恢复之前保存的绘图状态
    }
}
// 获取canvas元素并设置其宽高
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

function resizeHiDPICanvas(c, context) {
    if (!c || !context) return;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const cssW = window.innerWidth;
    const cssH = window.innerHeight;
    c.style.width = `${cssW}px`;
    c.style.height = `${cssH}px`;
    c.width = Math.floor(cssW * dpr);
    c.height = Math.floor(cssH * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
}

resizeHiDPICanvas(canvas, ctx);
let fireworks = []; // 存储所有烟花的数组

let fireworksActive = false;
let fireworksSpawnIntervalId = null;

/** @type {Record<string, boolean>} */
const celebrationDismissedByEventId = {};
let isCelebrationVisible = false;

window.addEventListener('resize', () => {
    resizeHiDPICanvas(canvas, ctx);
});
// 动画循环函数，用于不断更新画布上的内容
function animate() {
    requestAnimationFrame(animate); // 请求下一帧动画
    // 倒计时阶段：不要用半透明黑色覆盖，否则会把屏幕“越盖越黑”
    if (!fireworksActive) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.18)'; // 烟花阶段才使用尾迹
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }
    // 遍历所有烟花，更新它们的状态，并在必要时将它们从数组中移除
    fireworks.forEach((firework, index) => {
        firework.update();
        if (firework.exploded && firework.particles.length === 0) {
            fireworks.splice(index, 1); // 移除已经爆炸且粒子消失的烟花
        }
    });
}
// 创建新烟花的函数，用于在画布上添加新的烟花
function createFirework() {
    const x = Math.random() * canvas.width; // 在画布宽度范围内随机选择x坐标
    const y = canvas.height; // y坐标设置为画布底部
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`; // 随机选择颜色
    const riseSpeed = -Math.random() * 8 + 1; // 随机生成上升速度
    const particleSize = Math.random() * 3 + 2; // 随机生成粒子大小
    // 创建新的烟花并添加到烟花数组中
    fireworks.push(new Firework(x, y, color, riseSpeed, particleSize));
}
function launchFireworks() {
    fireworksActive = true;

    if (fireworksSpawnIntervalId !== null) {
        clearInterval(fireworksSpawnIntervalId);
        fireworksSpawnIntervalId = null;
    }

    const initialFireworks = 30; // 第一次触发时的烟花数量
    // 立即生成初始数量的烟花粒子
    for (let i = 0; i < initialFireworks; i++) {
        createFirework();
    }
    // 定时生成新的烟花粒子
    fireworksSpawnIntervalId = setInterval(() => {
        createFirework();
        // 可以在这里添加逻辑来停止生成新的烟花粒子，例如设置一个生成烟花的总数限制
    }, 200); // 每隔1秒生成一个新的烟花粒子
}

function stopFireworks() {
    fireworksActive = false;
    fireworks.length = 0;
    if (fireworksSpawnIntervalId !== null) {
        clearInterval(fireworksSpawnIntervalId);
        fireworksSpawnIntervalId = null;
    }
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

// 触发烟花效果的函数，用于在特定条件下（如倒计时结束）启动一系列烟花
function triggerFireworks() {
    fireworksActive = true;
    const fireworksCount = 5; // 定义触发的烟花数量
    for (let i = 0; i < fireworksCount; i++) {
        // 每隔一秒触发一个烟花，创建连续的烟花效果
        setTimeout(createFirework, i * 1000);
    }
}

// 倒计时逻辑，假设倒计时结束后触发烟花
const appElement = document.getElementById('app');
const countdownTitleElement = document.getElementById('countdownTitle');
const cdDaysElement = document.getElementById('cdDays');
const cdHoursElement = document.getElementById('cdHours');
const cdMinutesElement = document.getElementById('cdMinutes');
const cdSecondsElement = document.getElementById('cdSeconds');
const eventDateLineElement = document.getElementById('eventDateLine');
const todayLineElement = document.getElementById('todayLine');
const weatherLineElement = document.getElementById('weatherLine');
const illustrationFrameElement = document.querySelector('.illustration-frame');
const globalSparklesElement = document.getElementById('globalSparkles');
const forecastListElement = document.getElementById('forecastList');
const forecastSubElement = document.getElementById('forecastSub');
const manageButtonElement = document.getElementById('manageButton');
const eventSelectElement = document.getElementById('eventSelect');
const eventPanelElement = document.getElementById('eventPanel');
const newEventNameElement = document.getElementById('newEventName');
const newEventTimeElement = document.getElementById('newEventTime');
const addEventButtonElement = document.getElementById('addEventButton');
const eventListElement = document.getElementById('eventList');
const greetingsElement = document.getElementById('greetings');
const backButtonElement = document.getElementById('backButton');
const selectAllEventsElement = document.getElementById('selectAllEvents');
const deleteSelectedButtonElement = document.getElementById('deleteSelectedButton');

// 目标时间：本地时区的 2026-02-16 23:59:59（除夕）
const EVENT = {
    label: '2026年除夕',
    // JS 的 month 是 0-11
    target: new Date(2026, 1, 16, 23, 59, 59, 0),
    dateText: '除夕时间：2026年02月16日（马年）',
};

const STORAGE_KEY = 'countdowns.v1';

/** @type {{ id: string, name: string, targetISO: string }[]} */
let countdownEvents = [];
/** @type {string} */
let selectedEventId = '';

/** @type {Set<string>} */
let selectedForDeletion = new Set();

function pickDefaultEventId(nowMs) {
    if (!countdownEvents.length) return '';

    const upcoming = countdownEvents
        .map((ev) => ({ id: ev.id, ms: new Date(ev.targetISO).getTime() }))
        .filter((x) => Number.isFinite(x.ms) && x.ms > nowMs)
        .sort((a, b) => a.ms - b.ms);

    if (upcoming.length) return upcoming[0].id;
    return countdownEvents[0].id;
}

function makeId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadEvents() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed?.events)) countdownEvents = parsed.events;
            if (typeof parsed?.selectedId === 'string') selectedEventId = parsed.selectedId;
        }
    } catch (e) {
        // ignore
    }

    if (!countdownEvents.length) {
        countdownEvents = [
            { id: 'cny-2026-eve', name: EVENT.label, targetISO: EVENT.target.toISOString() },
        ];
        selectedEventId = 'cny-2026-eve';
        saveEvents();
    }

    const nowMs = Date.now();
    const selected = countdownEvents.find((e) => e.id === selectedEventId);
    const selectedMs = selected ? new Date(selected.targetISO).getTime() : NaN;

    // 默认选择：最近一个“还没结束”的倒数日（未来时间）
    // 如果本地记录的 selectedId 不存在/已过期，则自动切到下一个未到的
    if (!selected || !Number.isFinite(selectedMs) || selectedMs <= nowMs) {
        const best = pickDefaultEventId(nowMs);
        if (best) selectedEventId = best;
        saveEvents();
    }
}

function saveEvents() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ events: countdownEvents, selectedId: selectedEventId }));
    } catch (e) {
        // ignore
    }
}

function getSelectedEvent() {
    return countdownEvents.find((e) => e.id === selectedEventId) || countdownEvents[0];
}

function formatEventDateLine(ev) {
    const d = new Date(ev.targetISO);
    const yyyy = d.getFullYear();
    const mm = format2(d.getMonth() + 1);
    const dd = format2(d.getDate());
    const hh = format2(d.getHours());
    const mi = format2(d.getMinutes());
    return `倒数日：${ev.name}\n时间：${yyyy}年${mm}月${dd}日 ${hh}:${mi}`;
}

function setSelectedEvent(id) {
    selectedEventId = id;
    celebrationDismissedByEventId[id] = false;
    saveEvents();
    renderEventSelect();
    renderEventList();

    // 切换倒数日时，回到倒计时界面
    hideCelebration();
    updateCountdown();
}

function updateDeleteToolbar() {
    if (!deleteSelectedButtonElement || !selectAllEventsElement) return;
    const total = countdownEvents.length;
    const selectedCount = selectedForDeletion.size;

    deleteSelectedButtonElement.disabled = selectedCount === 0;

    const allSelected = total > 0 && selectedCount === total;
    const noneSelected = selectedCount === 0;
    selectAllEventsElement.checked = allSelected;
    selectAllEventsElement.indeterminate = !noneSelected && !allSelected;
}

function deleteEventsByIds(ids) {
    const idSet = new Set(ids);
    if (!idSet.size) return;

    const removedSelected = idSet.has(selectedEventId);
    countdownEvents = countdownEvents.filter((e) => !idSet.has(e.id));
    for (const id of idSet) {
        selectedForDeletion.delete(id);
        delete celebrationDismissedByEventId[id];
    }

    const nowMs = Date.now();

    if (!countdownEvents.length) {
        countdownEvents = [
            { id: 'cny-2026-eve', name: EVENT.label, targetISO: EVENT.target.toISOString() },
        ];
        selectedEventId = 'cny-2026-eve';
    } else if (removedSelected) {
        selectedEventId = pickDefaultEventId(nowMs);
    }

    saveEvents();
    renderEventSelect();
    renderEventList();
    hideCelebration();
    updateCountdown();
}

function renderEventSelect() {
    if (!eventSelectElement) return;
    eventSelectElement.innerHTML = '';

    for (const ev of countdownEvents) {
        const opt = document.createElement('option');
        opt.value = ev.id;
        opt.textContent = ev.name;
        if (ev.id === selectedEventId) opt.selected = true;
        eventSelectElement.appendChild(opt);
    }
}

function formatRemaining(ms) {
    const safe = Math.max(0, ms);
    const days = Math.floor(safe / (1000 * 60 * 60 * 24));
    const hours = Math.floor((safe % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((safe % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((safe % (1000 * 60)) / 1000);
    return `${days}天${format2(hours)}时${format2(minutes)}分${format2(seconds)}秒`;
}

function renderEventList() {
    if (!eventListElement) return;
    eventListElement.innerHTML = '';

    const now = Date.now();
    for (const ev of countdownEvents) {
        const row = document.createElement('div');
        row.className = `event-row${ev.id === selectedEventId ? ' is-active' : ''}`;
        const targetMs = new Date(ev.targetISO).getTime();
        const remain = formatRemaining(targetMs - now);

        const left = document.createElement('div');
        left.className = 'left';

        const pick = document.createElement('input');
        pick.className = 'pick';
        pick.type = 'checkbox';
        pick.checked = selectedForDeletion.has(ev.id);
        pick.addEventListener('click', (e) => e.stopPropagation());
        pick.addEventListener('change', () => {
            if (pick.checked) selectedForDeletion.add(ev.id);
            else selectedForDeletion.delete(ev.id);
            updateDeleteToolbar();
        });

        const nameEl = document.createElement('span');
        nameEl.className = 'name';
        nameEl.textContent = ev.name;

        left.appendChild(pick);
        left.appendChild(nameEl);

        const right = document.createElement('div');
        right.className = 'right';

        const remainEl = document.createElement('span');
        remainEl.className = 'remain';
        remainEl.textContent = remain;

        const delBtn = document.createElement('button');
        delBtn.className = 'btn btn-small';
        delBtn.type = 'button';
        delBtn.textContent = '删除';
        delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const ok = confirm(`确定删除「${ev.name}」这个倒数日吗？`);
            if (!ok) return;
            deleteEventsByIds([ev.id]);
        });

        right.appendChild(remainEl);
        right.appendChild(delBtn);

        row.appendChild(left);
        row.appendChild(right);

        row.addEventListener('click', () => setSelectedEvent(ev.id));
        eventListElement.appendChild(row);
    }

    // 渲染后同步一下“全选/删除所选”状态
    // 同时移除已经不存在的勾选项
    selectedForDeletion = new Set([...selectedForDeletion].filter((id) => countdownEvents.some((e) => e.id === id)));
    updateDeleteToolbar();
}

function attachEventManager() {
    if (manageButtonElement && eventPanelElement) {
        manageButtonElement.addEventListener('click', () => {
            eventPanelElement.hidden = !eventPanelElement.hidden;
        });
    }

    if (eventSelectElement) {
        eventSelectElement.addEventListener('change', () => {
            setSelectedEvent(eventSelectElement.value);
        });
    }

    if (addEventButtonElement) {
        addEventButtonElement.addEventListener('click', () => {
            const name = (newEventNameElement?.value || '').trim();
            const dt = (newEventTimeElement?.value || '').trim();
            if (!name) {
                alert('请输入新倒数日名称');
                return;
            }
            if (!dt) {
                alert('请选择时间');
                return;
            }
            const target = new Date(dt);
            if (!Number.isFinite(target.getTime())) {
                alert('时间格式不正确');
                return;
            }

            const ev = { id: makeId(), name, targetISO: target.toISOString() };
            countdownEvents.unshift(ev);
            setSelectedEvent(ev.id);
            saveEvents();
            renderEventSelect();
            renderEventList();

            if (newEventNameElement) newEventNameElement.value = '';
            // 保留时间，方便连建
        });
    }

    if (selectAllEventsElement) {
        selectAllEventsElement.addEventListener('change', () => {
            if (selectAllEventsElement.checked) {
                selectedForDeletion = new Set(countdownEvents.map((e) => e.id));
            } else {
                selectedForDeletion = new Set();
            }
            renderEventList();
        });
    }

    if (deleteSelectedButtonElement) {
        deleteSelectedButtonElement.addEventListener('click', () => {
            const ids = [...selectedForDeletion];
            if (!ids.length) return;
            const ok = confirm(`确定删除所选的 ${ids.length} 个倒数日吗？`);
            if (!ok) return;
            deleteEventsByIds(ids);
        });
    }
}

let targetDate = 0;
let countdownIntervalId = null;

// 祝福语滚动播放：每次出现一个四字成语，最多保留4个，最上面依次消失
const BLESSINGS = [
    '祝您在2026年：',
    '万事如意',
    '心想事成',
    '阖家幸福',
    '岁岁平安',
    '福星高照',
    '鸿运当头',
    '财源广进',
    '大吉大利',
    '身体健康',
    '前程似锦',
    '学业有成',
    '事业腾达',
    '喜气盈门',
    '鹏程万里',
    '龙马精神',
    '年年有余',
    '最后祝您新年快乐！',
];

let blessingsIntervalId = null;
let hasStartedBlessings = false;

function resetBlessings() {
    if (blessingsIntervalId !== null) {
        clearInterval(blessingsIntervalId);
        blessingsIntervalId = null;
    }
    hasStartedBlessings = false;
    if (greetingsElement) greetingsElement.innerHTML = '';
}

function showCelebration() {
    if (isCelebrationVisible) return;
    isCelebrationVisible = true;

    if (appElement) appElement.style.display = 'none';
    if (greetingsElement) greetingsElement.style.display = 'block';
    if (backButtonElement) backButtonElement.style.display = 'inline-flex';

    resetBlessings();
    startBlessingsRoll();
    launchFireworks();
}

function hideCelebration() {
    if (!isCelebrationVisible) return;
    isCelebrationVisible = false;

    if (greetingsElement) greetingsElement.style.display = 'none';
    if (backButtonElement) backButtonElement.style.display = 'none';
    if (appElement) appElement.style.display = '';

    resetBlessings();
    stopFireworks();
}

function attachBackButton() {
    if (!backButtonElement) return;
    backButtonElement.addEventListener('click', () => {
        const selected = getSelectedEvent();
        if (selected?.id) celebrationDismissedByEventId[selected.id] = true;
        hideCelebration();
    });
}

function startBlessingsRoll() {
    if (hasStartedBlessings) return;
    hasStartedBlessings = true;

    greetingsElement.innerHTML = '';

    const fontSizePx = parseFloat(getComputedStyle(greetingsElement).fontSize) || 36;
    const lineHeightPx = fontSizePx * 1.6;
    const transitionMs = 450;
    const tickMs = 1000;

    /** @type {{ el: HTMLDivElement, pos: number, removing: boolean }[]} */
    let activeItems = [];
    let blessingIndex = 0;
    let flushSteps = 0;

    const removeItem = (item) => {
        if (item.removing) return;
        item.removing = true;
        item.el.style.opacity = '0';
        setTimeout(() => {
            item.el.remove();
            activeItems = activeItems.filter((x) => x !== item);
        }, transitionMs);
    };

    const setTransformForPos = (item) => {
        item.el.style.transform = `translateY(${-item.pos * lineHeightPx}px)`;
    };

    const tick = () => {
        // 先把现有条目整体上移一行
        activeItems.forEach((item) => {
            item.pos += 1;
            setTransformForPos(item);
        });

        // 添加新祝福，或者在末尾做“清场滚动”
        if (blessingIndex < BLESSINGS.length) {
            const el = document.createElement('div');
            el.className = 'blessing-item';
            el.textContent = BLESSINGS[blessingIndex];
            greetingsElement.appendChild(el);

            const item = { el, pos: 0, removing: false };
            // 从下方出现
            el.style.transform = `translateY(${lineHeightPx}px)`;
            activeItems.push(item);
            requestAnimationFrame(() => {
                setTransformForPos(item);
            });

            blessingIndex += 1;
        } else {
            flushSteps += 1;
        }

        // 超过4条的最上方淡出移除
        activeItems.forEach((item) => {
            if (item.pos >= 4) {
                removeItem(item);
            }
        });

        // 全部播完后，再滚动4步把剩余条目顶出去
        const shouldStop = blessingIndex >= BLESSINGS.length && flushSteps >= 4 && activeItems.length === 0;
        if (shouldStop && blessingsIntervalId !== null) {
            clearInterval(blessingsIntervalId);
            blessingsIntervalId = null;
        }
    };

    tick();
    blessingsIntervalId = setInterval(tick, tickMs);
}

function format2(n) {
    return String(n).padStart(2, '0');
}

function formatTodayLine(now) {
    const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][now.getDay()];

    const greg = `${now.getFullYear()}年${format2(now.getMonth() + 1)}月${format2(now.getDate())}日`;

    // 优先使用浏览器内建的农历（中国历）显示；不支持时给一个降级文案
    let lunar = '';
    try {
        const lunarFmt = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        lunar = lunarFmt.format(now);
    } catch (e) {
        lunar = '农历日期（当前浏览器不支持自动显示）';
    }

    return `今天是${greg}  ${weekday}\n农历：${lunar}`;
}

function weatherKindForCode(weatherCode, isDay) {
    // Open-Meteo weather_code: https://open-meteo.com/en/docs
    if (weatherCode === 0) return { kind: isDay ? 'sunny' : 'clear-night', label: isDay ? '晴' : '晴夜' };
    if (weatherCode >= 1 && weatherCode <= 3) return { kind: 'cloudy', label: '多云/阴' };
    if (weatherCode === 45 || weatherCode === 48) return { kind: 'fog', label: '雾' };
    if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) return { kind: 'rain', label: '下雨' };
    if ((weatherCode >= 71 && weatherCode <= 77) || weatherCode === 85 || weatherCode === 86) return { kind: 'snow', label: '下雪' };
    if (weatherCode >= 95 && weatherCode <= 99) return { kind: 'thunder', label: '雷雨' };
    return { kind: 'cloudy', label: '多云/阴' };
}

function setWeatherKind(kind) {
    document.body.dataset.weather = kind;
}

function setWeatherLineText(text) {
    if (!weatherLineElement) return;
    weatherLineElement.textContent = text;
}

function createSparklesAt(clientX, clientY) {
    if (!globalSparklesElement) return;
    const x = clientX;
    const y = clientY;

    const count = 18;
    for (let i = 0; i < count; i++) {
        const s = document.createElement('span');
        s.className = 'sparkle';
        s.style.left = `${x}px`;
        s.style.top = `${y}px`;

        const angle = Math.random() * Math.PI * 2;
        const radius = 40 + Math.random() * 90;
        const dx = Math.cos(angle) * radius;
        const dy = Math.sin(angle) * radius;
        s.style.setProperty('--dx', `${dx.toFixed(1)}px`);
        s.style.setProperty('--dy', `${dy.toFixed(1)}px`);
        s.style.animationDelay = `${(Math.random() * 80).toFixed(0)}ms`;

        globalSparklesElement.appendChild(s);
        const removeAfter = 820;
        setTimeout(() => s.remove(), removeAfter);
    }
}

function toggleForecastFlip(clientX, clientY) {
    if (!illustrationFrameElement) return;
    if (typeof clientX === 'number' && typeof clientY === 'number') {
        createSparklesAt(clientX, clientY);
    }
    illustrationFrameElement.classList.toggle('is-flipped');
}

function attachIllustrationInteractions() {
    if (!illustrationFrameElement) return;
    illustrationFrameElement.addEventListener('click', (e) => {
        toggleForecastFlip(e.clientX, e.clientY);
    });

    // 键盘可用：回车/空格翻转
    illustrationFrameElement.tabIndex = 0;
    illustrationFrameElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleForecastFlip();
        }
    });
}

function attachGlobalSparkles() {
    // 单击任意位置都出金光（不受插画框裁剪限制）
    document.addEventListener('click', (e) => {
        // 如果点击的是输入框/下拉框，也允许出光（按你的要求“其他地方也要可以”）
        createSparklesAt(e.clientX, e.clientY);
    });
}

function weatherDescForCode(weatherCode) {
    if (weatherCode === 0) return '晴';
    if (weatherCode === 1) return '大部晴朗';
    if (weatherCode === 2) return '多云';
    if (weatherCode === 3) return '阴';
    if (weatherCode === 45 || weatherCode === 48) return '雾';
    if (weatherCode >= 51 && weatherCode <= 57) return '毛毛雨';
    if (weatherCode >= 61 && weatherCode <= 67) return '雨';
    if (weatherCode >= 71 && weatherCode <= 77) return '雪';
    if (weatherCode >= 80 && weatherCode <= 82) return '阵雨';
    if (weatherCode === 85 || weatherCode === 86) return '阵雪';
    if (weatherCode >= 95 && weatherCode <= 99) return '雷雨';
    return '天气';
}

function renderForecast(daily) {
    if (!forecastListElement) return;
    forecastListElement.innerHTML = '';

    const times = daily?.time || [];
    const codes = daily?.weather_code || [];
    const tMax = daily?.temperature_2m_max || [];
    const tMin = daily?.temperature_2m_min || [];

    if (!times.length) {
        forecastListElement.textContent = '暂无预报（需要定位/网络）';
        return;
    }

    const weekday = ['日', '一', '二', '三', '四', '五', '六'];
    for (let i = 0; i < Math.min(7, times.length); i++) {
        const d = new Date(times[i]);
        const label = `${d.getMonth() + 1}/${d.getDate()} 周${weekday[d.getDay()]}`;
        const desc = weatherDescForCode(Number(codes[i]));
        const max = Number.isFinite(tMax[i]) ? Math.round(tMax[i]) : '--';
        const min = Number.isFinite(tMin[i]) ? Math.round(tMin[i]) : '--';

        const item = document.createElement('div');
        item.className = 'forecast-item';
        item.innerHTML = `
            <div class="left">
                <span class="date">${label}</span>
                <span class="desc">${desc}</span>
            </div>
            <div class="temp">${min}° ~ ${max}°</div>
        `;
        forecastListElement.appendChild(item);
    }
}

async function fetchForecastByCoords(latitude, longitude) {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', String(latitude));
    url.searchParams.set('longitude', String(longitude));
    url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min');
    url.searchParams.set('forecast_days', '7');
    url.searchParams.set('timezone', 'auto');

    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) throw new Error(`forecast http ${res.status}`);
    return await res.json();
}

async function fetchWeatherByCoords(latitude, longitude) {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', String(latitude));
    url.searchParams.set('longitude', String(longitude));
    url.searchParams.set('current', 'weather_code,is_day');
    url.searchParams.set('timezone', 'auto');

    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) throw new Error(`weather http ${res.status}`);
    const data = await res.json();
    const weatherCode = data?.current?.weather_code;
    const isDay = data?.current?.is_day === 1;
    if (typeof weatherCode !== 'number') throw new Error('weather_code missing');
    return { weatherCode, isDay };
}

function initWeatherEffects() {
    // 默认：阴（插画背景）
    setWeatherKind('cloudy');
    setWeatherLineText('天气：未获取（可允许定位后自动显示）');
    if (forecastListElement) forecastListElement.textContent = '暂无预报（需要定位/网络）';

    // 使用定位拿到经纬度（需要 https/localhost；file:// 通常会被浏览器拒绝）
    if (!('geolocation' in navigator)) return;

    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            try {
                const { latitude, longitude } = pos.coords;
                const { weatherCode, isDay } = await fetchWeatherByCoords(latitude, longitude);
                const { kind, label } = weatherKindForCode(weatherCode, isDay);
                setWeatherKind(kind);
                setWeatherLineText(`天气：${label}（自动）`);

                try {
                    const forecast = await fetchForecastByCoords(latitude, longitude);
                    if (forecastSubElement) {
                        forecastSubElement.textContent = `（自动定位：${latitude.toFixed(2)}, ${longitude.toFixed(2)}；点击可翻回）`;
                    }
                    renderForecast(forecast?.daily);
                } catch (e) {
                    // 预报失败就保留占位
                }
            } catch (e) {
                setWeatherLineText('天气：获取失败（已使用默认阴天插画）');
            }
        },
        () => {
            setWeatherLineText('天气：未授权定位（已使用默认阴天插画）');
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 30 * 60 * 1000 }
    );
}

// 倒计时更新函数，用于显示距离目标日期的时间并在到达时触发烟花
function updateCountdown() {
    const selected = getSelectedEvent();
    targetDate = new Date(selected.targetISO).getTime();

    const now = Date.now(); // 获取当前时间（毫秒）
    const distance = targetDate - now; // 计算距离目标日期的时间差
    // 计算天、小时、分钟和秒
    const safeDistance = Math.max(0, distance);
    const days = Math.floor(safeDistance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((safeDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((safeDistance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((safeDistance % (1000 * 60)) / 1000);

    // 更新倒计时显示（新 UI）
    if (countdownTitleElement) countdownTitleElement.textContent = `距离${selected.name}还有`;
    if (cdDaysElement) cdDaysElement.textContent = String(days);
    if (cdHoursElement) cdHoursElement.textContent = format2(hours);
    if (cdMinutesElement) cdMinutesElement.textContent = format2(minutes);
    if (cdSecondsElement) cdSecondsElement.textContent = format2(seconds);

    if (eventDateLineElement) eventDateLineElement.textContent = formatEventDateLine(selected);
    if (todayLineElement) todayLineElement.textContent = formatTodayLine(new Date());

    // 菜单里展示所有倒数日剩余时间（每秒刷新）
    if (eventPanelElement && !eventPanelElement.hidden) {
        renderEventList();
    }

    // 到达目标时间：显示祝福并启动烟花（用户点“返回倒计时”后，不再对同一事件自动弹出）
    const dismissed = Boolean(celebrationDismissedByEventId[selected.id]);
    if (distance <= 0 && !dismissed) {
        showCelebration();
    }

    // 如果切回未来时间：允许再次进入结束页，同时确保在倒计时界面
    if (distance > 0) {
        celebrationDismissedByEventId[selected.id] = false;
        hideCelebration();
    }
}

initWeatherEffects();
attachIllustrationInteractions();
attachGlobalSparkles();

loadEvents();
renderEventSelect();
renderEventList();
attachEventManager();
attachBackButton();

updateCountdown();
countdownIntervalId = setInterval(updateCountdown, 1000); // 每秒更新倒计时

animate(); // 开始动画循环