import { getProducts } from '../services/productsApiService';
import { AppDispatcher } from './Dispatcher';
import { Product, State, store } from './Store';


// TYPES
export const ProductActionTypes = {
    GET_PRODUCTS: 'GET_PRODUCTS',
    ADD_TO_CART: 'ADD_TO_CART',
    REMOVE_FROM_CART: 'REMOVE_FROM_CART',
    CREATE_PRODUCT: 'CREATE_PRODUCT',
}

// ACTIONS
export const ProductActions = {
    getProducts: async () => {
        const products = await getProducts();
        AppDispatcher.dispatch({
            type: ProductActionTypes.GET_PRODUCTS,
            payload: products,
        });
    },
    addToCart: async(product: Product) => {
        const id = store.getState().cart.length + 1;
        const cartItem = {
            product,
            id,
        };
        AppDispatcher.dispatch({
            type: ProductActionTypes.ADD_TO_CART,
            payload: cartItem,
        });
    },
    removeFromCart: (id: string) => {
        AppDispatcher.dispatch({
            type: ProductActionTypes.REMOVE_FROM_CART,
            payload: Number(id),
        });
    },
    createProduct: (newProduct: Product) => {
       AppDispatcher.dispatch({
            type:ProductActionTypes.CREATE_PRODUCT,
            payload: newProduct,
       });
     

    }
}

export const StoreActionTypes = {
    LOAD_STATE: 'LOAD_STATE',
};

export const StoreActions = {
    loadState: (state: State) => {
        AppDispatcher.dispatch({
            type: StoreActionTypes.LOAD_STATE,
            payload: state,
        });
    },
}

