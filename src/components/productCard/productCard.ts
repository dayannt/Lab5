import { ProductActions } from "../../flux/Actions";
import { State, store } from "../../flux/Store";

class ProductCard extends HTMLElement {
    connectedCallback() {
        store.subscribe((state: State) => {this.handleChange(state)});
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    handleChange(state: State) {
        this.render(state);
    }

    render(state = store.getState()) {
        if (!this.shadowRoot) return;

        const title = this.getAttribute('title') || 'Product Title'; 
        const price = this.getAttribute('price') || 0;
        const description = this.getAttribute('description') || 'Product Description';
        const image = this.getAttribute('image');
        this.shadowRoot.innerHTML = `
        <style>
          
            :host-context(.products-container) {
                display: flex;
                flex-direction: row;
                overflow-x: auto;
                gap: 16px;
                padding: 16px 0;
                scroll-snap-type: x mandatory;
                scrollbar-width: thin;
                scrollbar-color: #bbd0ff #f1f5ff;
            }
            
            /* Estilos para el scrollbar en WebKit browsers */
            :host-context(.products-container)::-webkit-scrollbar {
                height: 8px;
            }
            
            :host-context(.products-container)::-webkit-scrollbar-track {
                background: #f1f5ff;
                border-radius: 8px;
            }
            
            :host-context(.products-container)::-webkit-scrollbar-thumb {
                background: #bbd0ff;
                border-radius: 8px;
            }

            /* Tarjeta individual */
            :host {
                display: inline-block;
                min-width: 280px;
                max-width: 320px;
                margin: 0 8px;
                flex-shrink: 0;
                scroll-snap-align: start;
            }

            .product-card {
                background: white;
                border-radius: 12px;
                padding: 18px;
                text-align: center;
                box-shadow: 0 6px 16px rgba(0, 32, 128, 0.08);
                transition: all 0.25s ease;
                color: #2d3748;
                font-family: 'Poppins', sans-serif;
                border: 1px solid #e6effd;
                height: 100%;
                display: flex;
                flex-direction: column;
                width: 280px;
                box-sizing: border-box;
            }

            .product-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 12px 24px rgba(37, 99, 235, 0.12);
                border-color: #bdd6fe;
            }

            .product-image-container {
                overflow: hidden;
                border-radius: 8px;
                margin-bottom: 14px;
                flex: 0 0 auto;
            }

            .product-image {
                width: 150px;
                height: 200px;
                object-fit: cover;
                border-radius: 8px;
                transition: transform 0.3s ease;
            }

            .product-card:hover .product-image {
                transform: scale(1.05);
            }

            .product-title {
                font-size: 1.25em;
                margin: 0 0 8px 0;
                color: #1e40af;
                font-weight: 500;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .product-price {
                font-size: 1.2em;
                color: #3b82f6;
                margin: 8px 0;
                font-weight: 600;
            }

            .product-description {
                font-size: 0.9em;
                color: #64748b;
                margin-bottom: 16px;
                line-height: 1.4;
                flex-grow: 1;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            button {
                background-color: #2563eb;
                color: white;
                border: none;
                padding: 10px 16px;
                border-radius: 8px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                font-family: 'Poppins', sans-serif;
                box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
                width: 100%;
                margin-top: auto;
            }

            button:hover {
                background-color: #1d4ed8;
                box-shadow: 0 4px 12px rgba(29, 78, 216, 0.3);
            }
        </style>

        <div class="product-card">
            <div class="product-image-container">
                <img src="${image}" alt="${title}" class="product-image" />
            </div>
            <h3 class="product-title">${title}</h3>
            <p class="product-price">$${price}</p>
            <p class="product-description">${description}</p>
            <button id="add-to-cart">Agregar al carrito</button>
        </div>
        `;

        this.shadowRoot.querySelector('#add-to-cart')?.addEventListener('click', () => {
            const product = {
                id: state.cart.length + 1,
                title,
                price: Number(price),
                description,
                image: this.getAttribute('image') || '',
            };
            ProductActions.addToCart(product);
        });
    }
}

export default ProductCard;
