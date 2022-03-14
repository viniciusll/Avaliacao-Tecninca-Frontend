import { createContext, useState, useContext } from "react";

import { ProductModel } from "../../domain/models/product-model";
import CartStorage from '../../infra/cache/cartStorage';

interface Props {
    children: React.ReactNode;
};

type CartProps = {
    cartProducts: ProductModel[];
    handleSetProducts: (products: ProductModel[]) => void;
};

export const CartContext = createContext({} as CartProps);

export default function CartProvider({ children }: Props) {
    const [cartProducts, setCartProducts] = useState<ProductModel[]>([]);
    
    function handleSetProducts(products: ProductModel[]) {
        const isSomeRepeated = products.some((product: ProductModel) => {
            const productInCart = cartProducts.find((cartProduct: ProductModel) => cartProduct.id === product.id);
            return productInCart !== undefined;
        });

        if (isSomeRepeated) return;

        setCartProducts(products);
        CartStorage.setProductsToCart(products);
    };

    return (
        <CartContext.Provider value={{ cartProducts, handleSetProducts}}>
            {children}
        </CartContext.Provider>
    );
};

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    };

    const { cartProducts, handleSetProducts } = context;

    const getProducts = cartProducts.length > 0 ? cartProducts: CartStorage.getProductsCart();

    return {getProducts, handleSetProducts};
};

export function getTotal() {
    const { getProducts } = useCart();
    const total = getProducts.reduce((accumulator: number, product: ProductModel) => {
        return accumulator + product.price;
    }, 0);

    return total;
};