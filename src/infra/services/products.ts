import { ProductModel } from '../../domain/models/product-model';

import api from '../http';

export async function GetAllProducts() {
    const response = await api.get('/products');
    const products = response.data as ProductModel[];

    return products;
};

export async function GetProductLimitResults(limit: number) {
    const response = await api.get(`/products?limit=${limit}`);
    const products = response.data as ProductModel[];

    return products;
};