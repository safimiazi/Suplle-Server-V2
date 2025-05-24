export interface ISubscriptionPlan {
    name: string;
    price: number;
    maxRestaurants: number;
    features: string[];
    mostPopular: boolean;
    billingCycle: 'monthly'| 'yearly'
}