export default interface IOrderDetails {
  id: number;
  orderId: number;
  orderIdGenerated: string;
  payer: object;
  create_time: Date;
  intent: string;
  links: any[];
  purchase_units: any[];
}
