// Elementos do DOM
const navMenu = document.getElementById("nav-menu")
const navToggle = document.getElementById("nav-toggle")
const navClose = document.getElementById("nav-close")
const navLinks = document.querySelectorAll(".nav__link")
const header = document.getElementById("header")
const newsletterForm = document.getElementById("newsletter-form")
const productButtons = document.querySelectorAll(".product__btn")

// Menu Mobile
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu")
  })
}

if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu")
  })
}

// Fechar menu ao clicar em um link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show-menu")
  })
})

// Header com scroll
window.addEventListener("scroll", () => {
  if (window.scrollY >= 50) {
    header.classList.add("scroll-header")
  } else {
    header.classList.remove("scroll-header")
  }
})

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Formulário de Newsletter
if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault()

    const formData = new FormData(this)
    const name = formData.get("name") || this.querySelector('input[type="text"]').value
    const email = formData.get("email") || this.querySelector('input[type="email"]').value

    // Simular envio
    const button = this.querySelector('button[type="submit"]')
    const originalText = button.textContent

    button.textContent = "Enviando..."
    button.disabled = true

    setTimeout(() => {
      // Simular sucesso
      showMessage("Obrigado! Você foi cadastrado com sucesso!", "success")
      this.reset()
      button.textContent = originalText
      button.disabled = false
    }, 2000)
  })
}

// Botões de produtos
productButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const productCard = this.closest(".product__card")
    const productTitle = productCard.querySelector(".product__title").textContent
    const productPrice = productCard.querySelector(".product__price").textContent

    // Simular adição ao carrinho
    this.textContent = "Adicionado!"
    this.style.background = "#27ae60"

    setTimeout(() => {
      this.textContent = "Peça Agora"
      this.style.background = ""
    }, 2000)

    showMessage(`${productTitle} foi adicionado ao seu pedido!`, "success")
  })
})

// Função para mostrar mensagens
function showMessage(message, type = "success") {
  // Remover mensagem existente
  const existingMessage = document.querySelector(".message")
  if (existingMessage) {
    existingMessage.remove()
  }

  // Criar nova mensagem
  const messageDiv = document.createElement("div")
  messageDiv.className = `message ${type}-message`
  messageDiv.textContent = message

  // Adicionar ao body
  document.body.appendChild(messageDiv)

  // Remover após 5 segundos
  setTimeout(() => {
    messageDiv.remove()
  }, 5000)
}

// Animação de elementos ao scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in-up")
    }
  })
}, observerOptions)

// Observar elementos para animação
document.querySelectorAll(".product__card, .benefit__card, .testimonial__card").forEach((el) => {
  observer.observe(el)
})

// Contador de produtos no carrinho (simulado)
const cartCount = 0

function updateCartCount() {
  const cartBadge = document.querySelector(".cart-badge")
  if (cartBadge) {
    cartBadge.textContent = cartCount
    cartBadge.style.display = cartCount > 0 ? "block" : "none"
  }
}

// Lazy loading para imagens
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src || img.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img)
  })
}

// Função para validar email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Função para validar formulários
function validateForm(form) {
  const inputs = form.querySelectorAll("input[required]")
  let isValid = true

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      isValid = false
      input.classList.add("error")
    } else {
      input.classList.remove("error")
    }

    if (input.type === "email" && !validateEmail(input.value)) {
      isValid = false
      input.classList.add("error")
    }
  })

  return isValid
}

// Adicionar estilos de erro via JavaScript
const style = document.createElement("style")
style.textContent = `
    .message {
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    }
    
    .success-message {
        background: #27ae60;
    }
    
    .error-message {
        background: #e74c3c;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .input.error {
        border-color: #e74c3c !important;
        box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2) !important;
    }
    
    .scroll-header {
        box-shadow: 0 2px 20px rgba(0,0,0,0.15) !important;
    }
`
document.head.appendChild(style)

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  // Adicionar classe de carregamento concluído
  document.body.classList.add("loaded")

  // Inicializar animações
  setTimeout(() => {
    document.querySelectorAll(".hero__content > *").forEach((el, index) => {
      setTimeout(() => {
        el.classList.add("fade-in-up")
      }, index * 200)
    })
  }, 500)
})

// Performance: Debounce para scroll
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Aplicar debounce ao scroll
const debouncedScroll = debounce(() => {
  if (window.scrollY >= 50) {
    header.classList.add("scroll-header")
  } else {
    header.classList.remove("scroll-header")
  }
}, 10)

window.addEventListener("scroll", debouncedScroll)
