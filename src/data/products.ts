import { ProductsData } from '../types';

export const products: ProductsData = {
  main: [
    {id: "orden-costilla", name: "ORDEN DE COSTILLAS", price: 110, image: "https://raw.githubusercontent.com/vidif/Costipollos/refs/heads/main/public/images/1_orden_costilla.png?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"},
    {id: "pollo-entero", name: "POLLO ENTERO", price: 220, image: "https://raw.githubusercontent.com/vidif/Costipollos/refs/heads/main/public/images/pollo_entero.png?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"},
    {id: "medio-pollo", name: "1/2 MEDIO POLLO", price: 110, image: "https://raw.githubusercontent.com/vidif/Costipollos/refs/heads/main/public/images/medio_pollo.png?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"},
    {id: "pollo-y-medio", name: "POLLO Y 1/2 MEDIO", price: 310, image: "https://raw.githubusercontent.com/vidif/Costipollos/refs/heads/main/public/images/polloymedio.png?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
  ],
  mixed: [
    {id: "mixto-1", name: "MIXTO 1", price: 220, description: "1/2 Pollo, 1 Orden de Costillas", image: "https://raw.githubusercontent.com/vidif/Costipollos/refs/heads/main/public/images/mediopolloyorden.png?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"},
    {id: "mixto-2", name: "MIXTO 2", price: 310, description: "1 Pollo, 1 Orden de Costillas", image: "https://raw.githubusercontent.com/vidif/Costipollos/refs/heads/main/public/images/1polloyorden.png?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"},
    {id: "mixto-3", name: "MIXTO 3", price: 310, description: "1/2 Pollo, 2 Ordenes de Costillas", image: "https://raw.githubusercontent.com/vidif/Costipollos/refs/heads/main/public/images/mediopolloy2ocostillas.png?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"},
    {id: "mixto-4", name: "MIXTO 4", price: 410, description: "1 Pollo, 1/2 KG de Costillas", image: "https://raw.githubusercontent.com/vidif/Costipollos/refs/heads/main/public/images/1Polloy_mediokg_deCostillas.png?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
  ],
  fries: [
    {id: "orden-papas", name: "ORDEN DE PAPAS", price: 50, image: "https://raw.githubusercontent.com/vidif/Costipollos/refs/heads/main/public/images/orden_de_papas.png?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"},
    {id: "papas-chicas", name: "PAPAS CHICAS", price: 25, image: "https://raw.githubusercontent.com/vidif/Costipollos/refs/heads/main/public/images/_papas_chicas.png?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
  ],
  drinks: [
    {id: "jamaica", name: "JAMAICA 1 LT", price: 25, image: "https://raw.githubusercontent.com/vidif/Costipollos/refs/heads/main/public/images/Jamaica1lt.png?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
  ]
};