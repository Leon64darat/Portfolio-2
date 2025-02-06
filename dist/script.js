"use strict";
class DOMSelectors {
    constructor() { }
    static getInstance() {
        if (!DOMSelectors.instance) {
            DOMSelectors.instance = new DOMSelectors();
        }
        return DOMSelectors.instance;
    }
    getElement(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            throw new Error(`Element with selector ${selector} not found`);
        }
        return element;
    }
    getElements(selector) {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
            throw new Error(`No elements found with selector ${selector}`);
        }
        return elements;
    }
}
class ThemeManager {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.body = document.body;
        this.isDark = localStorage.getItem('theme') === 'dark';
        this.initialize();
    }
    initialize() {
        this.setTheme(this.isDark);
        this.themeToggle.addEventListener('click', () => {
            this.isDark = !this.isDark;
            this.setTheme(this.isDark);
        });
    }
    setTheme(isDark) {
        if (isDark) {
            this.body.classList.add('dark-theme');
            this.themeToggle.querySelector('i')?.classList.replace('fa-moon', 'fa-sun');
        }
        else {
            this.body.classList.remove('dark-theme');
            this.themeToggle.querySelector('i')?.classList.replace('fa-sun', 'fa-moon');
        }
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
}
class NavigationManager {
    constructor() {
        this.dom = DOMSelectors.getInstance();
        this.hamburger = this.dom.getElement('.hamburger');
        this.navLinks = this.dom.getElement('.nav-links');
        this.bindEvents();
    }
    bindEvents() {
        this.hamburger.addEventListener('click', () => {
            this.navLinks.classList.toggle('active');
        });
        this.dom.getElements('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                this.navLinks.classList.remove('active');
            });
        });
    }
}
class FormManager {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.bindEvents();
    }
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    handleSubmit(e) {
        e.preventDefault();
        alert('Thank you for your message! I will get back to you soon.');
        this.form.reset();
    }
}
class SmoothScrollManager {
    constructor() {
        this.dom = DOMSelectors.getInstance();
        this.bindEvents();
    }
    bindEvents() {
        this.dom.getElements('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleClick(e, anchor));
        });
    }
    handleClick(e, anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        if (!targetId)
            return;
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
}
class App {
    constructor() {
        this.themeManager = new ThemeManager();
        this.navigationManager = new NavigationManager();
        this.formManager = new FormManager();
        this.smoothScrollManager = new SmoothScrollManager();
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
//# sourceMappingURL=script.js.map