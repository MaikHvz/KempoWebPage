// Configuración de WhatsApp
const WHATSAPP_NUMBER = "56987654321" // Cambia este número por el tuyo

// DOM Elements
const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav-menu")
const scrollToTopBtn = document.getElementById("scrollToTop")
const header = document.querySelector(".header")

// Mobile Navigation Toggle
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active")
  navMenu.classList.toggle("active")
})

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active")
    navMenu.classList.remove("active")
  })
})

// Smooth scrolling function
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    const headerHeight = header.offsetHeight
    const elementPosition = element.offsetTop - headerHeight

    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    })
  }

  // Close mobile menu if open
  hamburger.classList.remove("active")
  navMenu.classList.remove("active")
}

// Smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const targetId = this.getAttribute("href").substring(1)
    scrollToSection(targetId)
  })
})

// Header background change on scroll
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    header.style.background = "rgba(0, 0, 0, 0.98)"
  } else {
    header.style.background = "rgba(0, 0, 0, 0.95)"
  }

  // Show/hide scroll to top button
  if (window.scrollY > 300) {
    scrollToTopBtn.classList.add("show")
  } else {
    scrollToTopBtn.classList.remove("show")
  }
})

// Scroll to top functionality
scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
})

// WhatsApp contact function
function contactWhatsApp(message) {
  const encodedMessage = encodeURIComponent(message)
  const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`
  window.open(whatsappURL, "_blank")
}

// Notification system
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => notification.remove())

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification ${type}`

  // Handle long messages
  const isLongMessage = message.length > 100

  notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-message ${isLongMessage ? "long-message" : ""}">${message.replace(/\n/g, "<br>")}</div>
            <button class="notification-close">&times;</button>
        </div>
    `

  // Add styles
  const backgroundColor = type === "success" ? "#10b981" : type === "info" ? "#3b82f6" : "#dc2626"
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 1.5rem;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: ${isLongMessage ? "500px" : "400px"};
        animation: slideInRight 0.3s ease;
        font-weight: 500;
        max-height: 80vh;
        overflow-y: auto;
    `

  // Add to DOM
  document.body.appendChild(notification)

  // Close button functionality
  const closeBtn = notification.querySelector(".notification-close")
  closeBtn.addEventListener("click", () => {
    notification.style.animation = "slideOutRight 0.3s ease"
    setTimeout(() => notification.remove(), 300)
  })

  // Auto remove after longer time for long messages
  const autoRemoveTime = isLongMessage ? 10000 : 6000
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideOutRight 0.3s ease"
      setTimeout(() => notification.remove(), 300)
    }
  }, autoRemoveTime)
}

// Add notification animations to CSS
const notificationStyles = document.createElement("style")
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
    }
    
    .notification-message {
        flex: 1;
        line-height: 1.5;
    }
    
    .notification-message.long-message {
        font-size: 0.9rem;
        white-space: pre-line;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.3s ease;
        flex-shrink: 0;
    }
    
    .notification-close:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
`
document.head.appendChild(notificationStyles)

// Counter animation for statistics
function animateCounter(element, target, duration = 2000) {
  let start = 0
  const increment = target / (duration / 16)

  const timer = setInterval(() => {
    start += increment
    element.textContent = Math.floor(start) + "+"

    if (start >= target) {
      element.textContent = target + "+"
      clearInterval(timer)
    }
  }, 16)
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"

      // Animate counters when stats section comes into view
      if (entry.target.classList.contains("stat-number")) {
        const target = Number.parseInt(entry.target.textContent)
        animateCounter(entry.target, target)
      }
    }
  })
}, observerOptions)

// Observe elements for scroll animations
document.addEventListener("DOMContentLoaded", () => {
  // Observe class cards
  document.querySelectorAll(".class-card").forEach((el, index) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`
    observer.observe(el)
  })

  // Observe tournament cards
  document.querySelectorAll(".tournament-card").forEach((el, index) => {
    el.style.opacity = "0"
    el.style.transform = "translateX(-30px)"
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`
    observer.observe(el)
  })

  // Observe specialty items
  document.querySelectorAll(".specialty-item").forEach((el, index) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(20px)"
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`
    observer.observe(el)
  })

  // Observe stat items and animate counters
  document.querySelectorAll(".stat-number").forEach((el) => {
    observer.observe(el)
  })

  // Observe ceremony info
  const ceremonyInfo = document.querySelector(".ceremony-info")
  if (ceremonyInfo) {
    ceremonyInfo.style.opacity = "0"
    ceremonyInfo.style.transform = "translateY(30px)"
    ceremonyInfo.style.transition = "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s"
    observer.observe(ceremonyInfo)
  }

  // Observe contact items
  document.querySelectorAll(".contact-item").forEach((el, index) => {
    el.style.opacity = "0"
    el.style.transform = "translateX(-30px)"
    el.style.transition = `opacity 0.6s ease ${(index + 1) * 0.1}s, transform 0.6s ease ${(index + 1) * 0.1}s`
    observer.observe(el)
  })

  // Observe inscription CTA
  const inscriptionCTA = document.querySelector(".inscription-cta")
  if (inscriptionCTA) {
    inscriptionCTA.style.opacity = "0"
    inscriptionCTA.style.transform = "translateX(30px)"
    inscriptionCTA.style.transition = "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s"
    observer.observe(inscriptionCTA)
  }
})

// Parallax effect for hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const heroImage = document.querySelector(".martial-arts-icon")
  if (heroImage) {
    heroImage.style.transform = `translateY(${scrolled * 0.3}px)`
  }
})

// Add hover effects to cards
document.querySelectorAll(".class-card, .tournament-card, .specialty-item").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    if (card.classList.contains("class-card") && card.classList.contains("featured")) {
      card.style.transform = "scale(1.07) translateY(-10px)"
    } else if (card.classList.contains("class-card")) {
      card.style.transform = "translateY(-10px) scale(1.02)"
    } else if (card.classList.contains("tournament-card")) {
      card.style.transform = "translateX(15px) scale(1.02)"
    } else {
      card.style.transform = "translateY(-5px) scale(1.02)"
    }
  })

  card.addEventListener("mouseleave", () => {
    if (card.classList.contains("class-card") && card.classList.contains("featured")) {
      card.style.transform = "scale(1.05) translateY(0)"
    } else if (card.classList.contains("class-card")) {
      card.style.transform = "translateY(0) scale(1)"
    } else if (card.classList.contains("tournament-card")) {
      card.style.transform = "translateX(0) scale(1)"
    } else {
      card.style.transform = "translateY(0) scale(1)"
    }
  })
})

// Loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded")

  // Animate hero elements with delay
  const heroTitle = document.querySelector(".hero-title")
  const heroSubtitle = document.querySelector(".hero-subtitle")
  const heroButtons = document.querySelector(".hero-buttons")

  if (heroTitle) {
    setTimeout(() => {
      heroTitle.style.opacity = "1"
      heroTitle.style.transform = "translateY(0)"
    }, 300)
  }

  if (heroSubtitle) {
    setTimeout(() => {
      heroSubtitle.style.opacity = "1"
      heroSubtitle.style.transform = "translateY(0)"
    }, 600)
  }

  if (heroButtons) {
    setTimeout(() => {
      heroButtons.style.opacity = "1"
      heroButtons.style.transform = "translateY(0)"
    }, 900)
  }
})

// Add loading styles
const loadingStyles = document.createElement("style")
loadingStyles.textContent = `
    .hero-title,
    .hero-subtitle,
    .hero-buttons {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
`
document.head.appendChild(loadingStyles)

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  // ESC key closes mobile menu
  if (e.key === "Escape") {
    hamburger.classList.remove("active")
    navMenu.classList.remove("active")
  }

  // Enter key on buttons
  if (e.key === "Enter" && e.target.classList.contains("btn")) {
    e.target.click()
  }
})

// Add focus styles for accessibility
const accessibilityStyles = document.createElement("style")
accessibilityStyles.textContent = `
    .btn:focus,
    .nav-link:focus,
    input:focus,
    select:focus,
    textarea:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
    }
    
    .hamburger:focus {
        outline: 2px solid var(--accent-color);
        outline-offset: 2px;
    }
`
document.head.appendChild(accessibilityStyles)

// Welcome message on page load
setTimeout(() => {
  showNotification(
    "¡Bienvenido al Dojo Valenzuela! 🥋 Tradición familiar en Kempo Karate desde 1990. ¡Contáctanos por WhatsApp para tu clase de prueba gratuita!",
    "info",
  )
}, 2000)

// Gallery functionality
document.addEventListener("DOMContentLoaded", () => {
  // Gallery filter functionality
  const filterBtns = document.querySelectorAll(".filter-btn")
  const galleryItems = document.querySelectorAll(".gallery-item")

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      filterBtns.forEach((b) => b.classList.remove("active"))
      // Add active class to clicked button
      btn.classList.add("active")

      const filter = btn.getAttribute("data-filter")

      galleryItems.forEach((item) => {
        if (filter === "all" || item.getAttribute("data-category") === filter) {
          item.classList.remove("hidden")
        } else {
          item.classList.add("hidden")
        }
      })
    })
  })
})

// Image modal functionality
function openImageModal(button) {
  const galleryItem = button.closest(".gallery-item")
  const img = galleryItem.querySelector("img")
  const title = galleryItem.querySelector(".gallery-info h4").textContent
  const description = galleryItem.querySelector(".gallery-info p").textContent

  const modal = document.getElementById("imageModal")
  const modalImg = document.getElementById("modalImage")
  const modalTitle = document.getElementById("modalTitle")
  const modalDescription = document.getElementById("modalDescription")

  modal.style.display = "block"
  modalImg.src = img.src
  modalImg.alt = img.alt
  modalTitle.textContent = title
  modalDescription.textContent = description

  // Prevent body scroll when modal is open
  document.body.style.overflow = "hidden"
}

function closeImageModal() {
  const modal = document.getElementById("imageModal")
  modal.style.display = "none"

  // Restore body scroll
  document.body.style.overflow = "auto"
}

// Close modal when clicking outside the image
document.getElementById("imageModal").addEventListener("click", (e) => {
  if (e.target.id === "imageModal") {
    closeImageModal()
  }
})

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeImageModal()
  }
})

// Observe master cards for animations
document.querySelectorAll(".master-card").forEach((el, index) => {
  el.style.opacity = "0"
  el.style.transform = "translateY(30px)"
  el.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`
  observer.observe(el)
})

// Observe gallery items for animations
document.querySelectorAll(".gallery-item").forEach((el, index) => {
  el.style.opacity = "0"
  el.style.transform = "translateY(20px)"
  el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`
  observer.observe(el)
})

// Observe certification items
document.querySelectorAll(".certification-item").forEach((el, index) => {
  el.style.opacity = "0"
  el.style.transform = "translateX(-30px)"
  el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`
  observer.observe(el)
})

console.log("🥋 Dojo Valenzuela - Website loaded successfully! Tradición familiar en Kempo Karate.")
