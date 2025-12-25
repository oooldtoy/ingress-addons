// ==UserScript==
// @name         Mobile phone optimization
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  增加专门的拖动条，按钮回归纯点击功能
// @match        https://opr.ingress.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 1. 样式表
    const style = document.createElement('style');
    style.innerHTML = `
        #wf-floating-panel {
            position: fixed;
            left: calc(100% - 75px);
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 10000;
            padding: 10px;
            touch-action: none;
            user-select: none;
            background: rgba(20, 20, 20, 0.4);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border-radius: 35px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        /* 拖动手柄 */
        .wf-drag-handle {
            width: 50px;
            height: 30px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: move;
            color: rgba(255, 255, 255, 0.5);
            font-size: 14px;
            margin-bottom: 5px;
        }
        .wf-btn {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: rgba(45, 45, 45, 0.8);
            color: #ffffff;
            font-size: 20px;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.1s;
            -webkit-tap-highlight-color: transparent;
        }
        .wf-btn:active {
            transform: scale(0.85);
            background: rgba(100, 100, 100, 0.9);
        }
        .wf-btn-enter {
            background: rgba(39, 174, 96, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
    `;
    document.head.appendChild(style);

    // 2. 创建主容器
    const panel = document.createElement('div');
    panel.id = 'wf-floating-panel';

    // 3. 创建移动手柄
    const handle = document.createElement('div');
    handle.className = 'wf-drag-handle';
    handle.innerHTML = '⠿'; // 使用符号表示可移动
    panel.appendChild(handle);

    // 4. 发送按键逻辑
    function sendKey(keyName) {
        const keyCode = keyName === 'Enter' ? 13 : 48 + parseInt(keyName);
        const config = {
            key: keyName,
            code: keyName === 'Enter' ? 'Enter' : 'Digit' + keyName,
            keyCode: keyCode,
            which: keyCode,
            bubbles: true,
            composed: true
        };
        document.dispatchEvent(new KeyboardEvent('keydown', config));
        // 增加一个小延迟发送 keyup，模拟真实点击
        setTimeout(() => {
            document.dispatchEvent(new KeyboardEvent('keyup', config));
        }, 50);
    }

    // 5. 创建功能按钮
    function createBtn(text, isEnter = false) {
        const btn = document.createElement('div');
        btn.className = isEnter ? 'wf-btn wf-btn-enter' : 'wf-btn';
        btn.textContent = isEnter ? '✓' : text;

        // 直接监听 click，不再受拖动逻辑干扰
        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            sendKey(text);
        };

        return btn;
    }

    ['1', '2', '3'].forEach(num => panel.appendChild(createBtn(num)));
    panel.appendChild(createBtn('Enter', true));

    document.body.appendChild(panel);

    // 6. 核心：仅限手柄的拖动逻辑
    let isDragging = false;
    let offsetX, offsetY;

    handle.onpointerdown = (e) => {
        isDragging = true;
        const rect = panel.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        handle.setPointerCapture(e.pointerId);
        handle.style.background = "rgba(255, 255, 255, 0.3)";
    };

    handle.onpointermove = (e) => {
        if (!isDragging) return;

        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;

        // 边界限制
        x = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, x));
        y = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, y));

        panel.style.left = x + 'px';
        panel.style.top = y + 'px';
        panel.style.transform = 'none';
    };

    handle.onpointerup = (e) => {
        isDragging = false;
        handle.releasePointerCapture(e.pointerId);
        handle.style.background = "rgba(255, 255, 255, 0.1)";
    };

})();
// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-12-20
// @description  try to take over the world!
// @author       You
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();