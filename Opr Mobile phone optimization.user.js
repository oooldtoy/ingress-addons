// ==UserScript==
// @name         opr 触屏助手
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  按钮自下而上排列：Enter, 1, 2, 3，顶部为拖动手柄
// @author       Gemini
// @match        https://opr.ingress.com/*
// @match        https://wayfarer.nianticlabs.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        #wf-floating-panel {
            position: fixed;
            left: calc(100% - 75px);
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column-reverse; /* 关键：反向排列，让新加入的元素在上方 */
            gap: 12px;
            z-index: 10000;
            padding: 12px;
            touch-action: none;
            user-select: none;
            background: rgba(25, 25, 25, 0.5);
            backdrop-filter: blur(15px) saturate(160%);
            -webkit-backdrop-filter: blur(15px) saturate(160%);
            border-radius: 40px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        }
        /* 拖动手柄放在最上方 */
        .wf-drag-handle {
            width: 50px;
            height: 24px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: move;
            color: rgba(255, 255, 255, 0.4);
            font-size: 16px;
            margin-top: 5px; /* 因为是反向排列，这里变成间距 */
        }
        .wf-btn {
            width: 54px;
            height: 54px;
            border-radius: 50%;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: rgba(50, 50, 50, 0.85);
            color: #ffffff;
            font-size: 22px;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.1s, background 0.2s;
            -webkit-tap-highlight-color: transparent;
        }
        .wf-btn:active {
            transform: scale(0.8);
            background: rgba(120, 120, 120, 0.9);
        }
        .wf-btn-enter {
            background: rgba(46, 204, 113, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
    `;
    document.head.appendChild(style);

    const panel = document.createElement('div');
    panel.id = 'wf-floating-panel';

    // 发送按键逻辑
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
        setTimeout(() => document.dispatchEvent(new KeyboardEvent('keyup', config)), 50);
    }

    // 创建按钮函数
    function createBtn(text, isEnter = false) {
        const btn = document.createElement('div');
        btn.className = isEnter ? 'wf-btn wf-btn-enter' : 'wf-btn';
        btn.textContent = isEnter ? '✓' : text;
        btn.onclick = (e) => {
            e.preventDefault();
            sendKey(text);
        };
        return btn;
    }

    // --- 按照从下到上的逻辑添加元素 ---
    // 1. 最底部的确认键
    panel.appendChild(createBtn('Enter', true));
    
    // 2. 数字键 1, 2, 3
    ['1', '2', '3'].forEach(num => panel.appendChild(createBtn(num)));

    // 3. 最顶部的拖动手柄
    const handle = document.createElement('div');
    handle.className = 'wf-drag-handle';
    handle.innerHTML = '⠿';
    panel.appendChild(handle);

    document.body.appendChild(panel);

    // 拖动逻辑
    let isDragging = false;
    let offsetX, offsetY;

    handle.onpointerdown = (e) => {
        isDragging = true;
        const rect = panel.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        handle.setPointerCapture(e.pointerId);
    };

    handle.onpointermove = (e) => {
        if (!isDragging) return;
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;
        x = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, x));
        y = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, y));
        panel.style.left = x + 'px';
        panel.style.top = y + 'px';
        panel.style.transform = 'none';
    };

    handle.onpointerup = (e) => {
        isDragging = false;
        handle.releasePointerCapture(e.pointerId);
    };

})();
