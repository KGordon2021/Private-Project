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
      category: "Tree Crops & Tropical Fruits",
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
          title: "Papayas & Avocados",
          desc: "Carefully nested inside single-layer ventilated packaging optimized for altitude pressure.",
          images: ["images/papayas_avocados.jpg"]
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
        }
      ]
    }
  ];
  
  /* ---------- Dynamic catalog renderer ---------- */

function renderCatalog() {
  const catalogRoot = document.getElementById(
    'dynamic-catalog-container'
  );

  const cardTemplate = document.getElementById(
    'product-card-template'
  );

  const sourcingTemplate = document.getElementById(
    'custom-sourcing-template'
  );

  if (!catalogRoot || !cardTemplate) return;

  // Clear existing cards before rendering again
  catalogRoot.replaceChildren();

  exportInventory.forEach(catBlock => {
    // Create category
    const catSection = document.createElement('div');
    catSection.className = 'catalog-category';

    const catHeader = document.createElement('h3');
    catHeader.className = 'h-md';
    catHeader.textContent = catBlock.category;

    catHeader.style.cssText = `
      border-bottom: 2px solid var(--steel, #e2e8f0);
      padding-bottom: 10px;
      margin-bottom: 24px;
      font-weight: 400;
    `;

    const gridContainer = document.createElement('div');
    gridContainer.className = 'catalog-grid';

    // Create each product from the inventory
    catBlock.items.forEach(product => {
      const card = cardTemplate.content
        .firstElementChild.cloneNode(true);

      const slider = card.querySelector('.slider');
      const track = card.querySelector('.slider-track');
      const nav = card.querySelector('.slider-nav');
      const title = card.querySelector('.card-title');
      const description = card.querySelector('.card-description');
      const placeholder = card.querySelector('.image-placeholder');

      title.textContent = product.title;
      description.textContent = product.desc;
      placeholder.textContent = `[Photo: ${product.title}]`;

      // Build slides from the product's image array
      const images = Array.isArray(product.images)
        ? product.images
        : [];

      images.forEach(imgUrl => {
        const slide = document.createElement('div');
        slide.className = 'slide';

        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = product.title;
        img.loading = 'lazy';

        slide.appendChild(img);
        track.appendChild(slide);
      });

      // No images: show placeholder and remove slider
      if (images.length === 0) {
        slider.remove();
        placeholder.style.display = 'flex';
      }

      // One image: keep the image, hide navigation
      if (images.length <= 1) {
        nav.remove();
      }

      gridContainer.appendChild(card);
    });

    // Add custom sourcing card to the relevant category
    if (
      catBlock.category === 'Hot Peppers & Aromatics' &&
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

  // Initialize sliders and image fallbacks AFTER rendering
  initializeCatalogSliders(catalogRoot);
  initializeCatalogImageFallbacks(catalogRoot);
}

document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();
});
