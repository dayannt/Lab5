import Root from "./Root/Root";

customElements.define('root-element', Root);

import ProductCard from "./components/productCard/productCard";
import CartItems from "./components/cartItem/cartItem";
import ProductForm from "./components/productForm/productForm";

customElements.define('product-card', ProductCard);
customElements.define('cart-items', CartItems);
customElements.define('product-form', ProductForm);