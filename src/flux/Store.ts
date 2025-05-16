import { AppDispatcher, Action } from './Dispatcher';
import { ProductActionTypes } from './Actions';
import { getProducts } from '../services/productsApiService';

export type User = {
    name: string;
    age: number;
};

export type Product = {
    id: number;
    title: string;
    price: number;
    description: string;
    image: string;
};

export type CartItem = {
    product: Product;
    id: number;
};

export type State = {
    products: Product[];
    cart: CartItem[];
};

type Listener = (state: State) => void;

class Store {
    private _myState: State = {
        products: [],
        cart: [],
    };

    private _listeners: Listener[] = [];

    constructor() {
        AppDispatcher.register(this._handleActions.bind(this));
        this.load(); 
    }

    getState() {
        return this._myState;
    }

    _handleActions(action: Action): void {
        switch (action.type) {
            case ProductActionTypes.GET_PRODUCTS:
                if (Array.isArray(action.payload)) {
                    this._myState = {
                        ...this._myState,
                        products: action.payload as Product[],
                    };
                }
                this._emitChange();
                break;

            case ProductActionTypes.ADD_TO_CART:
                if (typeof action.payload === 'object') {
                    this._myState = {
                        ...this._myState,
                        cart: [...this._myState.cart, action.payload as CartItem],
                    };
                }
                this._emitChange();
                break;

            case ProductActionTypes.REMOVE_FROM_CART:
                if (typeof action.payload === 'number') {
                    this._myState = {
                        ...this._myState,
                        cart: this._myState.cart.filter((item) => item.id !== action.payload),
                    };
                }
                this._emitChange();
                break;

            case ProductActionTypes.CREATE_PRODUCT:
                if (typeof action.payload === 'object') {
                    this._myState = {
                        ...this._myState,
                        products: [...this._myState.products, action.payload as Product],
                    };
                }
                this._emitChange();
                break;
        }

        this.persist();
    }

    private _emitChange(): void {
        const state = this.getState();
        for (const listener of this._listeners) {
            listener(state);
        }
    }

    subscribe(listener: Listener): () => void {
        this._listeners.push(listener);
        listener(this.getState());

        return () => {
            this.unsubscribe(listener);
        };
    }

    unsubscribe(listener: Listener): void {
        this._listeners = this._listeners.filter((l) => l !== listener);
    }

    persist(): void {
        localStorage.setItem('flux:state', JSON.stringify({
            cart: this._myState.cart,
        }));
    }

    async load(): Promise<void> {
        
        const persistedState = localStorage.getItem('flux:state');
        if (persistedState) {
            const parsed = JSON.parse(persistedState);
            if (Array.isArray(parsed.cart)) {
                this._myState.cart = parsed.cart;
            }
        }

        try {
            const products = await getProducts();
            this._myState.products = products;
        } catch (error) {
            console.error("Error al cargar productos desde la red :ccc", error);
        }

        this._emitChange();
    }
}

export const store = new Store();
