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
    document.body.style.overflow = "hidden"
  })
}

if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu")
    document.body.style.overflow = "auto"
  })
}

// Fechar menu ao clicar em um link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show-menu")
    document.body.style.overflow = "auto"
  })
})

// Header com scroll
window.addEventListener("scroll", () => {
  if (window.scrollY >= 50) {
    header.style.background = "rgba(255, 255, 255, 0.98)"
    header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)"
  } else {
    header.style.background = "rgba(255, 255, 255, 0.95)"
    header.style.boxShadow = "none"
  }
})

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const headerHeight = header.offsetHeight
      const targetPosition = target.offsetTop - headerHeight

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  })
})

// Formulário de Newsletter
if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault()

    const formData = new FormData(this)
    const inputs = this.querySelectorAll("input")
    const name = inputs[0].value
    const email = inputs[1].value

    // Validação
    if (!name.trim() || !email.trim()) {
      showMessage("Por favor, preencha todos os campos!", "error")
      return
    }

    if (!validateEmail(email)) {
      showMessage("Por favor, insira um e-mail válido!", "error")
      return
    }

    // Simular envio
    const button = this.querySelector('button[type="submit"]')
    const originalText = button.innerHTML

    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...'
    button.disabled = true

    setTimeout(() => {
      showMessage(`Obrigado, ${name}! Você foi cadastrado com sucesso!`, "success")
      this.reset()
      button.innerHTML = originalText
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

    // Animação do botão
    const originalContent = this.innerHTML
    this.innerHTML = '<i class="fas fa-check"></i> Adicionado!'
    this.style.background = "var(--success-color)"
    this.disabled = true

    setTimeout(() => {
      this.innerHTML = originalContent
      this.style.background = ""
      this.disabled = false
    }, 2000)

    showMessage(`${productTitle} foi adicionado ao seu pedido por ${productPrice}!`, "success")

    // Simular adição ao carrinho
    updateCartCount()
  })
})

// Contador de carrinho (simulado)
let cartCount = 0

function updateCartCount() {
  cartCount++
  // Aqui você pode atualizar um badge de carrinho se existir
  console.log(`Itens no carrinho: ${cartCount}`)
}

// Função para mostrar mensagens
function showMessage(message, type = "success") {
  // Remover mensagem existente
  const existingMessage = document.querySelector(".toast-message")
  if (existingMessage) {
    existingMessage.remove()
  }

  // Criar nova mensagem
  const messageDiv = document.createElement("div")
  messageDiv.className = `toast-message ${type}-message`
  messageDiv.innerHTML = `
    <div class="toast-content">
      <i class="fas fa-${type === "success" ? "check-circle" : "exclamation-circle"}"></i>
      <span>${message}</span>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `

  // Adicionar ao body
  document.body.appendChild(messageDiv)

  // Animar entrada
  setTimeout(() => {
    messageDiv.classList.add("show")
  }, 100)

  // Remover após 5 segundos
  setTimeout(() => {
    messageDiv.classList.remove("show")
    setTimeout(() => {
      if (messageDiv.parentElement) {
        messageDiv.remove()
      }
    }, 300)
  }, 5000)
}

// Função para validar email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
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

      // Animar números/estatísticas
      if (
        entry.target.classList.contains("stat__number") ||
        entry.target.classList.contains("stats__number") ||
        entry.target.classList.contains("experience__number")
      ) {
        animateNumber(entry.target)
      }
    }
  })
}, observerOptions)

// Observar elementos para animação
document
  .querySelectorAll(`
  .product__card, 
  .benefit__card, 
  .testimonial__card, 
  .stat__number,
  .stats__number,
  .experience__number,
  .feature,
  .hero__floating-card
`)
  .forEach((el) => {
    observer.observe(el)
  })

// Animação de números
function animateNumber(element) {
  const target = Number.parseInt(element.textContent.replace(/\D/g, ""))
  const duration = 2000
  const step = target / (duration / 16)
  let current = 0

  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      current = target
      clearInterval(timer)
    }

    // Manter o formato original (com + ou %)
    const originalText = element.textContent
    if (originalText.includes("+")) {
      element.textContent = Math.floor(current) + "+"
    } else if (originalText.includes("%")) {
      element.textContent = Math.floor(current) + "%"
    } else {
      element.textContent = Math.floor(current)
    }
  }, 16)
}

// Lazy loading para imagens
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        if (img.dataset.src) {
          img.src = img.dataset.src
          img.classList.remove("lazy")
        }
        imageObserver.unobserve(img)
      }
    })
  })

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img)
  })
}

// Parallax suave para hero
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const hero = document.querySelector(".hero")
  const heroHeight = hero.offsetHeight

  if (scrolled < heroHeight) {
    const heroContent = hero.querySelector(".hero__content")
    const heroImage = hero.querySelector(".hero__image")

    if (heroContent) {
      heroContent.style.transform = `translateY(${scrolled * 0.1}px)`
    }
    if (heroImage) {
      heroImage.style.transform = `translateY(${scrolled * 0.05}px)`
    }
  }
})

// Adicionar estilos dinâmicos
const dynamicStyles = document.createElement("style")
dynamicStyles.textContent = `
  .toast-message {
    position: fixed;
    top: 120px;
    right: 24px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    z-index: 10000;
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    max-width: 400px;
    border-left: 4px solid var(--success-color);
  }
  
  .toast-message.show {
    transform: translateX(0);
    opacity: 1;
  }
  
  .toast-message.error-message {
    border-left-color: var(--primary-color);
  }
  
  .toast-content {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }
  
  .toast-content i {
    font-size: 20px;
    color: var(--success-color);
  }
  
  .error-message .toast-content i {
    color: var(--primary-color);
  }
  
  .toast-close {
    background: none;
    border: none;
    color: var(--text-light);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: var(--transition);
  }
  
  .toast-close:hover {
    background: var(--bg-light);
    color: var(--text-color);
  }
  
  @media (max-width: 768px) {
    .toast-message {
      right: 16px;
      left: 16px;
      max-width: none;
    }
  }
`
document.head.appendChild(dynamicStyles)

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  // Adicionar classe de carregamento concluído
  document.body.classList.add("loaded")

  // Inicializar animações do hero com delay
  setTimeout(() => {
    const heroElements = document.querySelectorAll(
      ".hero__badge, .hero__title, .hero__description, .hero__buttons, .hero__stats",
    )
    heroElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add("fade-in-up")
      }, index * 200)
    })
  }, 300)

  // Preload de imagens críticas
  const criticalImages = ["/placeholder.svg?height=600&width=500", "/placeholder.svg?height=500&width=600"]

  criticalImages.forEach((src) => {
    const img = new Image()
    img.src = src
  })
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

// Aplicar debounce ao scroll do header
const debouncedHeaderScroll = debounce(() => {
  if (window.scrollY >= 50) {
    header.style.background = "rgba(255, 255, 255, 0.98)"
    header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)"
  } else {
    header.style.background = "rgba(255, 255, 255, 0.95)"
    header.style.boxShadow = "none"
  }
}, 10)

// Substituir o listener de scroll do header
window.removeEventListener("scroll", () => {})
window.addEventListener("scroll", debouncedHeaderScroll)

// Adicionar funcionalidade de busca (simulada)
function searchProducts(query) {
  const products = document.querySelectorAll(".product__card")
  const searchTerm = query.toLowerCase()

  products.forEach((product) => {
    const title = product.querySelector(".product__title").textContent.toLowerCase()
    const description = product.querySelector(".product__description").textContent.toLowerCase()

    if (title.includes(searchTerm) || description.includes(searchTerm)) {
      product.style.display = "block"
    } else {
      product.style.display = searchTerm === "" ? "block" : "none"
    }
  })
}

// Adicionar funcionalidade de filtro por categoria
function filterByCategory(category) {
  const products = document.querySelectorAll(".product__card")

  products.forEach((product) => {
    const productCategory = product.querySelector(".product__category").textContent.toLowerCase()

    if (category === "all" || productCategory === category.toLowerCase()) {
      product.style.display = "block"
    } else {
      product.style.display = "none"
    }
  })
}

console.log("🌱 NaturalFresh - Landing Page carregada com sucesso!")
