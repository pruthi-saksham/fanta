export interface Flavour {
  id: string;
  name: string;
  gradient: [string, string];
  blobColor: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
