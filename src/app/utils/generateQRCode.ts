import config from "../config";
import QRCode from "qrcode";


export const generateTableQRCode = async (tableId : string, restaurantId : string) => {
    const tableUrl = `${config.FRONTEND_URL}/restaurant/${restaurantId}/table/${tableId}`;
    return await QRCode.toDataURL(tableUrl, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 1,
        width: 300,
        color: {
            dark: '#000000', // QR code color
            light: '#FFFFFF' // Background color
        }
    });
};