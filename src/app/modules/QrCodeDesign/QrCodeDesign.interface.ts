export interface IQrCodeDesign {
    name: string;
    category: string // classic, modern, custom
    description: string;
    price: number;
    status: 'Available' | 'ComingSoon' | 'Unavailable';
    image: string;  // image url
    createdBy: string // admin id will be link

}