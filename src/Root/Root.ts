import { ProductActions } from '../flux/Actions';
import { Product, store } from '../flux/Store';
import { getProducts } from '../services/productsApiService';

class Root extends HTMLElement {
    products: Product[] = []; 
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        store.load();
        await ProductActions.getProducts();
        this.products = await getProducts();
        this.render();
    }

    async render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                div {
                    display: flex;
                }

                #product-list {
                    width: 60vw;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    list-style-type: none;
                    padding: 0;
                }

                cart-items {
                    width: 40vw;
                }   
            </style>
            <div>
                <ul id="product-list"></ul>
                <cart-items></cart-items>
            </div>
        `;

        const productList = this.shadowRoot.querySelector('#product-list');
        store.getState().products.forEach((product: Product) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <product-card title="${product.title}" price="${product.price}" description="${product.description}" image="${product.image}"></product-card>
            `;
            productList?.appendChild(li);
        });
    }
}

export default Root;