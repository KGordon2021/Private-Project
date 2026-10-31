// scripts/inventory.js
const exportInventory = [
    {
      category: "Ground Provisions & Tubers",
      items: [
        {
          title: "Yellow Yams",
          desc: "Brushed, graded, and packed securely to manage moisture control during flight.",
          images: ["images/yellow_yam.jpg", "images/yellow_yam_1.jpg"]
        },
         {
          title: "White Yams",
          desc: "Brushed, graded, and packed securely to manage moisture control during flight.",
          images: ["images/white_yam.jpg"]
        },
        {
          title: "Sweet Potatoes",
          desc: "Cured at source and systematically sorted by size for uniform wholesale delivery.",
          images: ["images/sweet_potato.jpg", "images/sweet_potato_1.jpg"]
        },
        {
          title: "Dasheen",
          desc: "Firm, pristine roots harvested precisely to order for extended market shelf-life.",
          images: ["images/dasheen.jpg", "images/dasheen_1.jpg"]
        }
      ]
    },
    {
      category: "Tree Crops, Tropical Fruits & Vegetables",
      items: [
        {
          title: "Breadfruit",
          desc: "High-urgency air freight item handled under rapid temperature-regulated cold lines.",
          images: ["images/breadfruit.jpg"]
        },
        {
          title: "East Indian Mangoes",
          desc: "Sourced at optimal pre-ripeness window and cushioned carefully to prevent bruising.",
          images: ["images/east_indian_mangoes.jpg", "images/east_indian_mangoes_1.jpg"] 
        },
        {
          title: "Julie Mangoes",
          desc: "Sourced at optimal pre-ripeness window and cushioned carefully to prevent bruising.",
          images: ["images/julie_mangoes.jpg"] 
        },
        {
          title: "Starapple",
          desc: "Carefully nested inside single-layer ventilated packaging optimized for altitude pressure.",
          images: ["images/starapple.jpg", "images/starapple_1.jpg"]
        },
        {
          title: "Naseberry",
          desc: "Carefully nested inside single-layer ventilated packaging optimized for altitude pressure.",
          images: ["images/naseberry.jpg"]
        },
        {
          title: "Callaloo",
          desc: "Carefully nested inside single-layer ventilated packaging optimized for altitude pressure.",
          images: ["images/callaloo.jpg", "images/callaloo_1.jpg"]
        }
      ]
    },
    {
      category: "Herbs, Spices & Aromatics",
      items: [
        {
          title: "Sorrel",
          desc: "Sorted meticulously by clean color consistency and uniform heat index parameters.",
          images: ["images/sorrel_3.jpg", "images/sorrel.jpg", "images/sorrel_2.jpg"]
        },
        {
          title: "Escallions",
          desc: "Hydro-cooled post-harvest to preserve native aromatic oils and maximum freshness.",
          images: ["images/escallion.jpg", "images/escallion_1.jpg"]
        },
        {
          title: "Escallions",
          desc: "Hydro-cooled post-harvest to preserve native aromatic oils and maximum freshness.",
          images: ["images/escallion.jpg", "images/escallion_1.jpg"]
        }
      ]
    }
  ];
function renderCatalog() {
  const cardTemplate = document.getElementById('product-card-template');
  const catalogRoot = document.getElementById('dynamic-catalog-container');
  const sourcingTemplate = document.getElementById('custom-sourcing-template');

  if (!catalogRoot || !cardTemplate) return;

  // Clear existing cards before rendering again
  catalogRoot.replaceChildren();

  if (typeof exportInventory === 'undefined' || !Array.isArray(exportInventory)) return;

  exportInventory.forEach(catBlock => {
    // Create category
    const catSection = document.createElement('div');
    catSection.className = 'catalog-category';
    
    const catHeader = document.createElement('h3');
    catHeader.className = 'h-md';
    catHeader.textContent = catBlock.category || "Uncategorized";
    catHeader.style.cssText = `
      border-bottom: 2px solid var(--steel, #e2e8f0);
      padding-bottom: 10px;
      margin-bottom: 24px;
      font-weight: 400;
    `;

    const gridContainer = document.createElement('div');
    gridContainer.className = 'catalog-grid';

    const items = Array.isArray(catBlock.items) ? catBlock.items : [];

    items.forEach(product => {
      const card = cardTemplate.content.firstElementChild.cloneNode(true);
      const slider = card.querySelector('.slider');
      const track = card.querySelector('.slider-track');
      const nav = card.querySelector('.slider-nav');
      const dotsContainer = card.querySelector('.slider-dots');
      
      // Remove arrows completely right away
      const prevArrow = card.querySelector('.slider-arrow.prev');
      const nextArrow = card.querySelector('.slider-arrow.next');
      if (prevArrow) prevArrow.remove();
      if (nextArrow) nextArrow.remove();

      const title = card.querySelector('.card-title');
      const description = card.querySelector('.card-description');
      const placeholder = card.querySelector('.image-placeholder');

      if (title) title.textContent = product.title || "";
      if (description) description.textContent = product.desc || "";
      if (placeholder) placeholder.textContent = `[Photo: ${product.title || 'Product'}]`;

      const images = Array.isArray(product.images) ? product.images : [];
      const imageCount = images.length;
      
      images.forEach((imgUrl, index) => {
        if (!track) return;
        const slide = document.createElement('div');
        slide.className = 'slide';
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = product.title || "Product Image";
        img.loading = 'lazy';
        slide.appendChild(img);
        track.appendChild(slide);

        // Dynamically create dots
        if (imageCount > 1 && dotsContainer) {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
          dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
          dotsContainer.appendChild(dot);
        }
      });

      // Handle structural visibility flags
      if (imageCount === 0) {
        if (slider) slider.remove();
        if (nav) nav.remove();
        if (placeholder) placeholder.style.display = 'flex';
      } else if (imageCount === 1) {
        if (nav) nav.remove();
        if (placeholder) placeholder.style.display = 'none';
      } else {
        if (placeholder) placeholder.style.display = 'none';
      }

      gridContainer.appendChild(card);
    });

    if (catBlock.category === 'Hot Peppers & Aromatics' &&
       sourcingTemplate
      ) {
      const customCard = sourcingTemplate.content
        .firstElementChild.cloneNode(true);
      gridContainer.appendChild(customCard);
    }

    catSection.appendChild(catHeader);
    catSection.appendChild(gridContainer);
    catalogRoot.appendChild(catSection);
  });

  initializeCatalogSliders(catalogRoot);
  if (typeof initializeCatalogImageFallbacks === 'function') {
    initializeCatalogImageFallbacks(catalogRoot);
  }
}


//Buttons and arrows script
function initializeCatalogSliders(container) {
  if (!container) return;
  const cards = container.querySelectorAll('.gallery-card');

  cards.forEach(card => {
    const track = card.querySelector('.slider-track');
    const dots = card.querySelectorAll('.slider-dot');
    
    if (!track || dots.length <= 1) return;

    let currentIndex = 0;
    const maxIndex = track.children.length - 1;
    let autoSlideInterval = null;

    function updateSlider(index) {
      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }

    function nextSlide() {
      let targetIndex = currentIndex + 1;
      if (targetIndex > maxIndex) targetIndex = 0; // Loop back to the start
      updateSlider(targetIndex);
    }

    // Start the automatic rotation (3000ms = 3 seconds)
    function startAutoSlide() {
      stopAutoSlide(); // Safety reset
      autoSlideInterval = setInterval(nextSlide, 3000);
    }

    function stopAutoSlide() {
      if (autoSlideInterval) clearInterval(autoSlideInterval);
    }

    // Dot click controls
    dots.forEach((dot, idx) => {
      dot.onclick = (e) => {
        e.preventDefault();
        updateSlider(idx);
        startAutoSlide(); // Reset timer on manual selection
      };
    });

    // Run auto-sliding routine right away
    startAutoSlide();

    // Optional: Pause loop when user rests cursor over a product card
    card.addEventListener('mouseenter', stopAutoSlide);
    card.addEventListener('mouseleave', startAutoSlide);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();
});
