export default interface ApiProductDto {
    productId: number;
    title: string;
    description: string;
    categoryId: number;
    productMaterialId: number;
    pictures: {
        pictureId: number;
        imagePath: string;
    }[];
    productPrices: {
        productPriceId: number;
        price: number;
    }[];

    category?: {
        name: string;
    };

    productMaterial?: {
        materialName: string;
    };

    inStocks: {
        quantity: number;
        size: number;
        color: string;
    }[];
}