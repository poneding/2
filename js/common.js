// 通用JavaScript功能

// 工具配置
const tools = {
  newline: {
    title: '换行工具',
    description: '在文本换行符和转义序列之间进行转换'
  },
  json: {
    title: 'JSON 工具',
    description: '格式化和压缩 JSON 数据，支持验证和美化显示'
  },
  base64: {
    title: 'Base64 工具',
    description: 'Base64 编码和解码，支持文本和二进制数据'
  },
  url: {
    title: 'URL 工具',
    description: 'URL 编码和解码，处理特殊字符和查询参数'
  },
  diff: {
    title: '文本对比',
    description: '实时文本差异比较工具，支持直接编辑和语法高亮'
  }
};

// 通知系统
function showNotification(message, type = 'success') {
  // 创建通知元素
  const notification = document.createElement('div');
  notification.className = 'notification show';
  notification.textContent = message;
  notification.style.background = type === 'success' ? 'var(--success-color)' : '#da3633';

  document.body.appendChild(notification);

  // 2秒后移除通知
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 200);
  }, 2000);
}

function showSuccess(message) {
  showNotification(message, 'success');
}

function showError(message) {
  showNotification(message, 'error');
}

// 剪贴板功能
function copyToClipboard(elementId) {
  const output = document.getElementById(elementId);

  if (!output.value.trim()) {
    showError('没有内容可复制');
    return;
  }

  // 现代方法
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(output.value).then(() => {
      showSuccess('已复制到剪贴板');
    }).catch(() => {
      fallbackCopyToClipboard(output);
    });
  } else {
    // 回退方法
    fallbackCopyToClipboard(output);
  }
}

function fallbackCopyToClipboard(output) {
  output.select();
  output.setSelectionRange(0, 99999);

  try {
    document.execCommand("copy");
    showSuccess('已复制到剪贴板');
  } catch (err) {
    showError('复制失败，请手动复制');
  }
}

// 页面导航功能
function navigateToPage(page) {
  // 隐藏所有页面
  const pages = document.querySelectorAll('.page-container');
  pages.forEach(p => p.classList.remove('active'));

  // 显示目标页面
  const targetPage = document.getElementById(page + 'Page');
  if (targetPage) {
    targetPage.classList.add('active');
  }

  // 更新导航按钮状态
  const navButtons = document.querySelectorAll('.nav-button');
  navButtons.forEach(btn => btn.classList.remove('active'));

  const activeButton = document.querySelector(`[onclick*="${page}"]`);
  if (activeButton) {
    activeButton.classList.add('active');
  }

  // 更新内容头部
  updateContentHeader(page);
}

function updateContentHeader(page) {
  const tool = tools[page];
  if (tool) {
    const titleElement = document.getElementById("currentToolTitle");
    const descElement = document.getElementById("currentToolDesc");

    if (titleElement) titleElement.textContent = tool.title;
    if (descElement) descElement.textContent = tool.description;
  }
}

// 返回首页
function goHome() {
  navigateToPage('home');
}

// 外部链接处理
function openInNewTab(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

// Monaco Editor 相关
let monacoLoaded = false;

function loadMonaco() {
  if (monacoLoaded) return Promise.resolve();

  return new Promise((resolve, reject) => {
    // 检查是否已经加载
    if (window.monaco) {
      monacoLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs/loader.js';
    script.onload = () => {
      require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs' } });
      require(['vs/editor/editor.main'], function () {
        monacoLoaded = true;
        resolve();
      });
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// 语言检测
function detectLanguage(text1, text2) {
  const combinedText = text1 + '\n' + text2;

  // 检测JavaScript
  if (combinedText.includes('function') || combinedText.includes('const ') || combinedText.includes('let ') || combinedText.includes('=>')) {
    return 'javascript';
  }

  // 检测JSON
  try {
    JSON.parse(text1);
    return 'json';
  } catch {
    try {
      JSON.parse(text2);
      return 'json';
    } catch {
      // 不是JSON
    }
  }

  // 检测HTML
  if (combinedText.includes('<') && combinedText.includes('>') && combinedText.includes('</')) {
    return 'html';
  }

  // 检测CSS
  if (combinedText.includes('{') && combinedText.includes(':') && combinedText.includes(';')) {
    return 'css';
  }

  // 检测Python
  if (combinedText.includes('def ') || combinedText.includes('import ') || combinedText.includes('print(') || combinedText.includes('#')) {
    return 'python';
  }

  // 检测TypeScript
  if (combinedText.includes('interface ') || combinedText.includes('type ') || combinedText.includes(': string')) {
    return 'typescript';
  }

  // 检测Markdown
  if (combinedText.includes('#') || combinedText.includes('**') || combinedText.includes('```')) {
    return 'markdown';
  }

  // 检测XML
  if (combinedText.includes('<?xml') || (combinedText.includes('<') && combinedText.includes('</') && !combinedText.includes('<!DOCTYPE'))) {
    return 'xml';
  }

  // 检测YAML
  if (combinedText.includes(':') && !combinedText.includes('{') && !combinedText.includes('<')) {
    return 'yaml';
  }

  // 默认为纯文本
  return 'plaintext';
}

// 动态菜单生成系统
function createSidebar() {
  const sidebar = document.createElement('div');
  sidebar.className = 'sidebar';

  // 构建菜单HTML
  const navItems = [
    {
      href: '../index.html',
      icon: `<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`,
      label: '首页'
    }
  ];

  // 添加工具到菜单
  Object.entries(tools).forEach(([key, tool]) => {
    let icon = '';

    switch(key) {
      case 'newline':
        icon = `
          <rect x="3" y="4" width="18" height="16" rx="2" fill="#f8f9fa" stroke="#6c757d" stroke-width="1" />
          <rect x="5" y="7" width="8" height="2" rx="1" fill="#495057" />
          <rect x="14" y="7" width="5" height="2" rx="1" fill="#495057" />
          <rect x="5" y="11" width="10" height="2" rx="1" fill="#495057" />
          <path d="M16 12h2v-1h-1v-1h-1v2z" fill="#28a745" />
          <text x="17" y="12" font-size="8" fill="#28a745" font-weight="bold">↵</text>
          <rect x="5" y="15" width="14" height="2" rx="1" fill="#495057" />`;
        break;
      case 'json':
        icon = `
          <rect x="3" y="4" width="18" height="16" rx="2" fill="#f8f9fa" stroke="#6c757d" stroke-width="1" />
          <text x="4" y="9" font-size="6" fill="#dc3545" font-weight="bold">{</text>
          <text x="8" y="12" font-size="5" fill="#6f42c1">"name"</text>
          <text x="13" y="12" font-size="5" fill="#28a745">:</text>
          <text x="15" y="12" font-size="5" fill="#fd7e14">"value"</text>
          <text x="4" y="16" font-size="5" fill="#6f42c1">"count"</text>
          <text x="11" y="16" font-size="5" fill="#28a745">:</text>
          <text x="13" y="16" font-size="5" fill="#007bff">42</text>
          <text x="17" y="12" font-size="5" fill="#6c757d">,</text>`;
        break;
      case 'base64':
        icon = `
          <rect x="3" y="5" width="7" height="14" rx="1" fill="#e3f2fd" stroke="#1976d2" stroke-width="1.5" />
          <rect x="14" y="5" width="7" height="14" rx="1" fill="#f3e5f5" stroke="#7b1fa2" stroke-width="1.5" />
          <rect x="8.5" y="5" width="7" height="14" rx="1" fill="#e8f5e8" stroke="#388e3c" stroke-width="1.5" />
          <circle cx="6.5" cy="8.5" r="1" fill="#1976d2" />
          <circle cx="12" cy="8.5" r="1" fill="#388e3c" />
          <circle cx="17.5" cy="8.5" r="1" fill="#7b1fa2" />
          <path d="M10 12h4M10 15h4" stroke="#666" stroke-width="1" stroke-dasharray="2 2" />`;
        break;
      case 'url':
        icon = `
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.71 1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />`;
        break;
      case 'diff':
        icon = `
          <rect x="3" y="4" width="18" height="16" rx="2" fill="#f8f9fa" stroke="#6c757d" stroke-width="1" />
          <path d="M6 8h4M6 11h2M14 8h4M14 11h2M6 14h6M12 14h6" stroke="#dc3545" stroke-width="2" stroke-linecap="round" />
          <path d="M6 17h12" stroke="#28a745" stroke-width="2" stroke-linecap="round" />
          <text x="7" y="16" font-size="6" fill="#dc3545" font-weight="bold">-</text>
          <text x="15" y="16" font-size="6" fill="#28a745" font-weight="bold">+</text>`;
        break;
    }

    navItems.push({
      href: `${key}.html`,
      icon: icon,
      label: tool.title
    });
  });

  const navHTML = navItems.map(item => `
    <a href="${item.href}" class="nav-button nav-link">
      <svg class="tool-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        ${item.icon}
      </svg>
      <span>${item.label}</span>
    </a>
  `).join('');

  sidebar.innerHTML = `
    <div class="sidebar-header">
      <h2 onclick="location.href='../index.html'" style="cursor: pointer;">
        <svg class="logo" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" fill="currentColor" />
          <path d="M14 2l-1 1 8 8 1-1-8-8zM6 14l-1 1 8 8 1-1-8-8z" fill="currentColor" opacity="0.7" />
        </svg>
        <span>DevTools</span>
      </h2>
    </div>
    <nav class="sidebar-nav">
      ${navHTML}
    </nav>
  `;

  return sidebar;
}

function createGitHubLink() {
  const githubLink = document.createElement('a');
  githubLink.href = 'https://github.com/poneding/2';
  githubLink.target = '_blank';
  githubLink.rel = 'noopener noreferrer';
  githubLink.className = 'github-link';
  githubLink.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill="currentColor" />
    </svg>
  `;
  return githubLink;
}

function initializeSidebar() {
  // 检查是否已经存在sidebar
  if (document.querySelector('.sidebar')) {
    return; // 已存在，不需要重复创建
  }

  // 创建并添加GitHub链接
  const githubLink = createGitHubLink();
  document.body.appendChild(githubLink);

  // 创建并添加侧边栏到body的开头（在现有内容之前）
  const sidebar = createSidebar();
  const content = document.querySelector('.content');
  if (content) {
    document.body.insertBefore(sidebar, content);
  } else {
    document.body.insertBefore(sidebar, document.body.firstChild);
  }

  // 设置当前页面的活动状态
  setActiveNavigation();
}

// DOM 加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
  // 初始化侧边栏（如果在工具页面）
  if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
    initializeSidebar();
  }

  // 检测当前页面并设置导航状态
  setActiveNavigation();

  // 添加键盘快捷键
  document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K 快速搜索 (未来功能)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      // TODO: 实现快速搜索功能
    }

    // ESC 返回首页
    if (e.key === 'Escape') {
      if (window.location.pathname !== '/' && !window.location.pathname.endsWith('index.html')) {
        window.location.href = '../index.html';
      }
    }
  });
});

// 设置活动导航状态
function setActiveNavigation() {
  const currentPath = window.location.pathname;
  const navButtons = document.querySelectorAll('.nav-button');

  // 移除所有活动状态
  navButtons.forEach(btn => btn.classList.remove('active'));

  // 根据当前路径设置活动状态
  if (currentPath.endsWith('newline.html')) {
    setActiveNavButton('newline');
  } else if (currentPath.endsWith('json.html')) {
    setActiveNavButton('json');
  } else if (currentPath.endsWith('base64.html')) {
    setActiveNavButton('base64');
  } else if (currentPath.endsWith('url.html')) {
    setActiveNavButton('url');
  } else if (currentPath.endsWith('diff.html')) {
    setActiveNavButton('diff');
  } else if (currentPath.endsWith('index.html') || currentPath === '/') {
    // 首页不需要设置活动状态
  }
}

function setActiveNavButton(toolName) {
  const navButton = document.querySelector(`[href*="${toolName}.html"]`);
  if (navButton) {
    navButton.classList.add('active');
  }
}

// 主题切换监听
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // 通知各个页面主题已变化
    const themeChangeEvent = new CustomEvent('themechange', {
      detail: { isDark: e.matches }
    });
    document.dispatchEvent(themeChangeEvent);
  });
}

// 工具页面基类
class ToolPage {
  constructor(toolId) {
    this.toolId = toolId;
    this.init();
  }

  init() {
    // 子类可以重写此方法
  }

  onActivate() {
    // 页面激活时调用
    updateContentHeader(this.toolId);
  }

  onDeactivate() {
    // 页面停用时调用
  }

  showSuccess(message) {
    showSuccess(message);
  }

  showError(message) {
    showError(message);
  }

  copyToClipboard(elementId) {
    copyToClipboard(elementId);
  }
}