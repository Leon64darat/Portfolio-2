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
        this.STORAGE_KEY = 'theme';
        this.themeToggle = document.querySelector('.theme-toggle');
        this.body = document.body;
        this.currentTheme = localStorage.getItem(this.STORAGE_KEY) || 'light';
        this.initialize();
    }
    initialize() {
        this.setTheme(this.currentTheme);
        this.themeToggle.addEventListener('click', this.handleThemeToggle.bind(this));
    }
    handleThemeToggle() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(this.currentTheme);
    }
    setTheme(theme) {
        const icon = this.themeToggle.querySelector('i');
        if (theme === 'dark') {
            this.body.classList.add('dark-theme');
            icon?.classList.replace('fa-moon', 'fa-sun');
        }
        else {
            this.body.classList.remove('dark-theme');
            icon?.classList.replace('fa-sun', 'fa-moon');
        }
        localStorage.setItem(this.STORAGE_KEY, theme);
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
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const form = document.getElementById('contact-form');
        if (!form)
            throw new Error('Contact form not found');
        this.form = form;
        this.initialize();
    }
    initialize() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }
    async handleSubmit(e) {
        e.preventDefault();
        try {
            const formData = this.getFormData();
            if (!this.validateForm(formData))
                return;
            await this.submitForm(formData);
            this.showSuccess('Message sent successfully!');
            this.form.reset();
        }
        catch (error) {
            this.showError(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    }
    getFormData() {
        const formElements = this.form.elements;
        return {
            name: formElements.name.value.trim(),
            email: formElements.email.value.trim(),
            message: formElements.message.value.trim()
        };
    }
    validateForm(data) {
        if (!data.name) {
            this.showError('Please enter your name');
            return false;
        }
        if (!this.emailRegex.test(data.email)) {
            this.showError('Please enter a valid email');
            return false;
        }
        if (!data.message) {
            this.showError('Please enter a message');
            return false;
        }
        return true;
    }
    async submitForm(data) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Form submitted:', data);
    }
    showSuccess(message) {
        alert(message);
    }
    showError(message) {
        alert(`Error: ${message}`);
    }
}
class ProjectManager {
    constructor() {
        this.projects = [
            {
                id: 1,
                title: 'Goal 1',
                description: 'Making this website',
                imageUrl: 'https://via.placeholder.com/300x200'
            },
            {
                id: 2,
                title: 'Goal 2',
                description: 'Learning TypeScript',
                imageUrl: 'https://via.placeholder.com/300x200'
            },
            {
                id: 3,
                title: 'Goal 3',
                description: 'Building a portfolio',
                imageUrl: 'https://via.placeholder.com/300x200'
            },
        ];
        const container = document.querySelector('.project-grid');
        if (!container)
            throw new Error('Project container not found');
        this.projectContainer = container;
        this.initialize();
    }
    initialize() {
        this.renderProjects();
    }
    renderProjects() {
        this.projectContainer.innerHTML = this.projects
            .map(project => this.createProjectCard(project))
            .join('');
    }
    createProjectCard(project) {
        return `
            <div class="project-card" data-project-id="${project.id}">
                <img src="${project.imageUrl}" alt="${project.title}">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
            </div>
        `;
    }
}
class App {
    constructor() {
        console.log('App initializing...');
        this.initialize();
    }
    initialize() {
        try {
            this.themeManager = new ThemeManager();
            this.formManager = new FormManager();
            this.projectManager = new ProjectManager();
            console.log('App initialized successfully');
        }
        catch (error) {
            console.error('Failed to initialize app:', error);
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
//# sourceMappingURL=script.js.map