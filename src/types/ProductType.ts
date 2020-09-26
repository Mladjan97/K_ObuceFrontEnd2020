export default class ProductType {
    productId?: number;
    title?: string;
    description?: string;
    imageUrl?: string;
    price?: number;

    categoryId?: number;
    productMaterialId?: number;
    pictures?: {
        pictureId: number;
        imagePath: string;
    }[];
    productPrices?: {
        productPriceId: number;
        price: number;
    }[];

    category?: {
        name: string;
    };
    
    productMaterial?: {
        materialName: string;
    };

    inStocks?: {
        quantity: number;
        size: number;
        color: string;
    }[];
}