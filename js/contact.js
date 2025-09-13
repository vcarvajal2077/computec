/* ===== COMPUTEC PLATFORM - CONTACTO ===== */

class ContactPage {
    constructor() {
        this.init();
    }

    init() {
        this.bindElements();
        this.bindEvents();
        this.handleURLParams();
    }

    bindElements() {
        this.contactForm = document.getElementById('contact-form');
        this.faqItems = document.querySelectorAll('.faq-item');
    }

    bindEvents() {
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => this.toggleFAQ(item));
            }
        });
    }

    handleURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const service = urlParams.get('service');
        
        if (service && this.contactForm) {
            const serviceSelect = this.contactForm.querySelector('#contact-service');
            if (serviceSelect) {
                serviceSelect.value = service;
            }
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            service: formData.get('service'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            newsletter: formData.get('newsletter') === 'on'
        };

        try {
            this.showFormLoading();
            
            // Simular envío (en producción sería una llamada a la API)
            await this.simulateFormSubmission(data);
            
            this.showSuccessMessage();
            e.target.reset();
            
        } catch (error) {
            console.error('Error submitting form:', error);
            this.showErrorMessage();
        } finally {
            this.hideFormLoading();
        }
    }

    async simulateFormSubmission(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simular éxito/error aleatorio
                if (Math.random() > 0.1) {
                    resolve(data);
                } else {
                    reject(new Error('Simulated error'));
                }
            }, 2000);
        });
    }

    showFormLoading() {
        const submitBtn = this.contactForm.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <div class="loading-spinner"></div>
                <span>Enviando...</span>
            `;
        }
    }

    hideFormLoading() {
        const submitBtn = this.contactForm.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <i class="fas fa-paper-plane"></i>
                <span>Enviar Mensaje</span>
            `;
        }
    }

    showSuccessMessage() {
        this.showNotification('¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.', 'success');
    }

    showErrorMessage() {
        this.showNotification('Error al enviar el mensaje. Por favor, inténtalo de nuevo.', 'error');
    }

    toggleFAQ(item) {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        this.faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
}

// Initialize contact page when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('contact-form')) {
        window.contactPage = new ContactPage();
    }
});
