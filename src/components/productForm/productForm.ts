import { ProductActions } from "../../flux/Actions";
import { State, store, Product } from "../../flux/Store";


class ProductForm extends HTMLElement {
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

    
        this.shadowRoot.innerHTML = `
            <style>
                .product-card {
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    padding: 16px;
                    text-align: center;
                    max-width: 300px;
                    margin: 16px auto;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .product-image {
                    max-width: 100%;
                    height: auto;
                }
                .product-title {
                    font-size: 1.5em;
                    color: #333;
                }
                .product-price {
                    font-size: 1.2em;
                    color: #007BFF;
                }
                .product-description {
                    color: #555;
                }
                button {
                    background-color: #007BFF;
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    margin-top: 10px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #0056b3;
                }
            </style>

               <form id="product-form">
                <input type="text" name="title" placeholder="Title" required />
                <input type="number" name="price" placeholder="Price" required />
                <textarea name="description" placeholder="Description" required></textarea>
                <input type="text" name="image" placeholder="Image URL" required />
                <button type="submit">Add Product</button>
            </form>
        `;

        const form = this.shadowRoot.querySelector('#product-form') as HTMLFormElement;
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            


            const formData = new FormData(form);
            const newProduct: Product = {
            
                id: state.products.length + 1,
                title: formData.get('title') as string,
                price: parseFloat(formData.get('price') as string),
                description: formData.get('description') as string,
                image: formData.get('image') as string,
            };

           
            console.log('Nuevo producto:', newProduct);

            ProductActions.createProduct(newProduct);
          

            form.reset(); 
        });
    }
}

customElements.define('product-form', ProductForm);
export default ProductForm;