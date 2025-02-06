// Types and Interfaces
type Theme = 'light' | 'dark';

interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

interface ProjectCard {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
}

// Event Handlers Interface
interface EventHandlers {
    handleThemeToggle(): void;
    handleNavigation(e: Event): void;
    handleFormSubmit(e: SubmitEvent): Promise<void>;
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

// Theme Manager with better typing
class ThemeManager {
    private readonly themeToggle: HTMLElement;
    private readonly body: HTMLElement;
    private currentTheme: Theme;
    private readonly STORAGE_KEY = 'theme';

    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle') as HTMLElement;
        this.body = document.body;
        this.currentTheme = (localStorage.getItem(this.STORAGE_KEY) as Theme) || 'light';
        this.initialize();
    }

    private initialize(): void {
        this.setTheme(this.currentTheme);
        this.themeToggle.addEventListener('click', this.handleThemeToggle.bind(this));
    }

    private handleThemeToggle(): void {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(this.currentTheme);
    }

    private setTheme(theme: Theme): void {
        const icon = this.themeToggle.querySelector('i');
        if (theme === 'dark') {
            this.body.classList.add('dark-theme');
            icon?.classList.replace('fa-moon', 'fa-sun');
        } else {
            this.body.classList.remove('dark-theme');
            icon?.classList.replace('fa-sun', 'fa-moon');
        }
        localStorage.setItem(this.STORAGE_KEY, theme);
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

// Form Manager with async/await and better error handling
class FormManager {
    private readonly form: HTMLFormElement;
    private readonly emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    constructor() {
        const form = document.getElementById('contact-form');
        if (!form) throw new Error('Contact form not found');
        this.form = form as HTMLFormElement;
        this.initialize();
    }

    private initialize(): void {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    private async handleSubmit(e: SubmitEvent): Promise<void> {
        e.preventDefault();
        
        try {
            const formData = this.getFormData();
            if (!this.validateForm(formData)) return;
            
            await this.submitForm(formData);
            this.showSuccess('Message sent successfully!');
            this.form.reset();
        } catch (error) {
            this.showError(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    }

    private getFormData(): ContactFormData {
        const formElements = this.form.elements as HTMLFormControlsCollection & {
            name: HTMLInputElement;
            email: HTMLInputElement;
            message: HTMLTextAreaElement;
        };

        return {
            name: formElements.name.value.trim(),
            email: formElements.email.value.trim(),
            message: formElements.message.value.trim()
        };
    }

    private validateForm(data: ContactFormData): boolean {
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

    private async submitForm(data: ContactFormData): Promise<void> {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Form submitted:', data);
    }

    private showSuccess(message: string): void {
        alert(message); // In real app, use better UI feedback
    }

    private showError(message: string): void {
        alert(`Error: ${message}`); // In real app, use better UI feedback
    }
}

// Project Manager for handling project cards
class ProjectManager {
    private readonly projectContainer: HTMLElement;
    private projects: ProjectCard[] = [
        {
            id: 1,
            title: 'Goal 1',
            description: 'Making this website',
            imageUrl: 'https://via.placeholder.com/300x200'
        },
        // Add other projects...
    ];

    constructor() {
        const container = document.querySelector('.project-grid');
        if (!container) throw new Error('Project container not found');
        this.projectContainer = container as HTMLElement;
        this.initialize();
    }

    private initialize(): void {
        this.renderProjects();
    }

    private renderProjects(): void {
        this.projectContainer.innerHTML = this.projects
            .map(project => this.createProjectCard(project))
            .join('');
    }

    private createProjectCard(project: ProjectCard): string {
        return `
            <div class="project-card" data-project-id="${project.id}">
                <img src="${project.imageUrl}" alt="${project.title}">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
            </div>
        `;
    }
}

// App class with better error handling and initialization
class App {
    private themeManager?: ThemeManager;
    private formManager?: FormManager;
    private projectManager?: ProjectManager;

    constructor() {
        console.log('App initializing...');
        this.initialize();
    }

    private initialize(): void {
        try {
            this.themeManager = new ThemeManager();
            this.formManager = new FormManager();
            this.projectManager = new ProjectManager();
            console.log('App initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
}); 