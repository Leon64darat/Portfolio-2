// Types
type Theme = 'light' | 'dark';

interface FormElements extends HTMLFormControlsCollection {
    name: HTMLInputElement;
    email: HTMLInputElement;
    message: HTMLTextAreaElement;
}

interface ContactForm extends HTMLFormElement {
    readonly elements: FormElements;
}

// DOM Element Selectors
class DOMSelectors {
    private static instance: DOMSelectors;
    private constructor() {}

    static getInstance(): DOMSelectors {
        if (!DOMSelectors.instance) {
            DOMSelectors.instance = new DOMSelectors();
        }
        return DOMSelectors.instance;
    }

    getElement<T extends HTMLElement>(selector: string): T {
        const element = document.querySelector<T>(selector);
        if (!element) {
            throw new Error(`Element with selector ${selector} not found`);
        }
        return element;
    }

    getElements<T extends HTMLElement>(selector: string): NodeListOf<T> {
        const elements = document.querySelectorAll<T>(selector);
        if (elements.length === 0) {
            throw new Error(`No elements found with selector ${selector}`);
        }
        return elements;
    }
}

// Theme Manager
class ThemeManager {
    private themeToggle: HTMLElement;
    private body: HTMLElement;
    private isDark: boolean;

    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle') as HTMLElement;
        this.body = document.body;
        this.isDark = localStorage.getItem('theme') === 'dark';
        this.initialize();
    }

    initialize(): void {
        // Set initial theme
        this.setTheme(this.isDark);

        // Add click event listener
        this.themeToggle.addEventListener('click', () => {
            this.isDark = !this.isDark;
            this.setTheme(this.isDark);
        });
    }

    private setTheme(isDark: boolean): void {
        if (isDark) {
            this.body.classList.add('dark-theme');
            this.themeToggle.querySelector('i')?.classList.replace('fa-moon', 'fa-sun');
        } else {
            this.body.classList.remove('dark-theme');
            this.themeToggle.querySelector('i')?.classList.replace('fa-sun', 'fa-moon');
        }
        // Save theme preference
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
}

// Navigation Manager
class NavigationManager {
    private readonly hamburger: HTMLElement;
    private readonly navLinks: HTMLElement;
    private readonly dom: DOMSelectors;

    constructor() {
        this.dom = DOMSelectors.getInstance();
        this.hamburger = this.dom.getElement<HTMLElement>('.hamburger');
        this.navLinks = this.dom.getElement<HTMLElement>('.nav-links');
        this.bindEvents();
    }

    private bindEvents(): void {
        this.hamburger.addEventListener('click', () => {
            this.navLinks.classList.toggle('active');
        });

        this.dom.getElements<HTMLAnchorElement>('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                this.navLinks.classList.remove('active');
            });
        });
    }
}

// Form Manager
class FormManager {
    private readonly form: ContactForm;
    
    constructor() {
        this.form = document.getElementById('contact-form') as ContactForm;
        this.bindEvents();
    }

    private bindEvents(): void {
        this.form.addEventListener('submit', (e: Event) => this.handleSubmit(e));
    }

    private handleSubmit(e: Event): void {
        e.preventDefault();
        
        // Here you would typically handle the form submission
        // For now, we'll just show an alert
        alert('Thank you for your message! I will get back to you soon.');
        this.form.reset();
    }
}

// Smooth Scroll Manager
class SmoothScrollManager {
    private readonly dom: DOMSelectors;

    constructor() {
        this.dom = DOMSelectors.getInstance();
        this.bindEvents();
    }

    private bindEvents(): void {
        this.dom.getElements<HTMLAnchorElement>('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e: Event) => this.handleClick(e, anchor));
        });
    }

    private handleClick(e: Event, anchor: HTMLAnchorElement): void {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        if (!targetId) return;

        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
}

// App Initialization
class App {
    private readonly themeManager: ThemeManager;
    private readonly navigationManager: NavigationManager;
    private readonly formManager: FormManager;
    private readonly smoothScrollManager: SmoothScrollManager;

    constructor() {
        // Initialize all managers
        this.themeManager = new ThemeManager();
        this.navigationManager = new NavigationManager();
        this.formManager = new FormManager();
        this.smoothScrollManager = new SmoothScrollManager();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
}); 