import { ProductActions } from "../../flux/Actions";
import { CartItem, State, store } from "../../flux/Store";

class CartItems extends HTMLElement {
    private unsubscribe?: () => void;

    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.render();

        this.unsubscribe = store.subscribe((state: State) => { 
            this.handleChange(state);
        });
    }

    disconnectedCallback() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    handleChange(state: State) {
        this.render(state);
    }

    render(state = store.getState()) {
        if (!this.shadowRoot) return;

        const totalPrice = state.cart.reduce((sum, item) => sum + item.product.price, 0).toFixed(2);

        this.shadowRoot.innerHTML = `
<style>
    .cart-container {
        background: #f8faff;
        border: 1px solid #e0e7ff;
        border-radius: 16px;
        padding: 1.8rem;
        margin-bottom: 2.5rem;
        max-width: 500px;
        margin: 0 auto;
        box-shadow: 0 8px 24px rgba(0, 20, 80, 0.06);
        font-family: 'Poppins', sans-serif;
    }

    .cart-title {
        font-size: 1.25rem;
        font-weight: 500;
        margin-bottom: 0.75rem;
        color: #1a56db;
        letter-spacing: 0.02em;
    }

    .total-price {
        font-size: 1.1rem;
        color: #3b82f6;
        margin-bottom: 1.5rem;
        font-weight: 600;
    }

    .cart-items {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-height: 400px;
        overflow-y: auto;
        padding-right: 0.5rem;
    }

    .cart-items::-webkit-scrollbar {
        width: 5px;
    }

    .cart-items::-webkit-scrollbar-track {
        background: #f1f5ff;
        border-radius: 10px;
    }

    .cart-items::-webkit-scrollbar-thumb {
        background: #bbd0ff;
        border-radius: 10px;
    }

    .cart-item {
        display: flex;
        align-items: center;
        gap: 1.2rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 36, 128, 0.04);
        padding: 1.2rem;
        transition: all 0.2s ease-in-out;
        border: 1px solid rgba(226, 232, 255, 0.6);
    }

    .cart-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 16px rgba(0, 43, 152, 0.07);
    }

    .cart-item img {
        width: 90px;
        height: 90px;
        object-fit: cover;
        border-radius: 10px;
        flex-shrink: 0;
        box-shadow: 0 3px 10px rgba(0, 48, 170, 0.08);
    }

    .info {
        flex-grow: 1;
    }

    .info h2 {
        margin: 0;
        font-size: 1.05rem;
        color: #1e3a8a;
        font-weight: 500;
    }

    .info p {
        margin: 0.5rem 0;
        font-size: 0.85rem;
        color: #64748b;
        line-height: 1.4;
    }

    .info h3 {
        margin: 0.5rem 0 0 0;
        font-size: 1rem;
        color: #3b82f6;
        font-weight: 600;
    }

    .remove {
        background-color: #2563eb;
        border: none;
        padding: 0.6rem 1.2rem;
        border-radius: 8px;
        color: white;
        cursor: pointer;
        font-weight: 500;
        font-size: 0.85rem;
        transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
    }

    .remove:hover {
        background-color: #1d4ed8;
        box-shadow: 0 4px 12px rgba(29, 78, 216, 0.3);
    }
</style>

<div class="cart-container">
    <div class="cart-title">Productos en el carrito</div>
    <div class="total-price">Total: $${totalPrice}</div>
    <ul class="cart-items">
        ${state.cart.map((cartItem: CartItem) => {
            return `
                <li class="cart-item">
                    <img src="${cartItem.product.image}" alt="${cartItem.product.title}" />
                    <div class="info">
                        <h2>${cartItem.product.title}</h2>
                        <p>${cartItem.product.description}</p>
                        <h3>$${cartItem.product.price}</h3>
                    </div>
                    <button class="remove" id="${cartItem.id}">Eliminar</button>
                </li>
            `;
        }).join("")}
    </ul>
</div>
        `;

        const removeButtons = this.shadowRoot.querySelectorAll('.remove');
        removeButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('id');
                if (id) {
                    ProductActions.removeFromCart(id);
                }
            });
        });
    }
}

export default CartItems;