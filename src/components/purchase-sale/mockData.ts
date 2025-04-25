import { Entity, InventoryItem, Transaction } from './types';

// Mock entities (vendors and customers)
export const mockEntities: Entity[] = [
  {
    id: 'VEN-10001',
    name: 'Vendor ABC',
    type: 'vendor'
  },
  {
    id: 'VEN-10002',
    name: 'Vendor DEF',
    type: 'vendor'
  },
  {
    id: 'VEN-10003',
    name: 'Vendor GHI',
    type: 'vendor'
  },
  {
    id: 'CUS-10001',
    name: 'Customer XYZ',
    type: 'customer'
  },
  {
    id: 'CUS-10002',
    name: 'Customer UVW',
    type: 'customer'
  },
  {
    id: 'CUS-10003',
    name: 'Customer RST',
    type: 'customer'
  }
];

// Mock inventory items (same as used in inventory module)
export const mockInventoryItems: InventoryItem[] = [
  {
    id: 'ITEM-10001',
    name: 'Raw Material A',
    category: 'Raw Material',
    baseUnit: 'KG',
    quantityAvailable: 1250,
    stockValue: 6250.00,
    currentRate: 5.00,
    multiUnits: [
      { name: 'Bag', factor: 25 }
    ]
  },
  {
    id: 'ITEM-10002',
    name: 'Raw Material B',
    category: 'Raw Material',
    baseUnit: 'KG',
    quantityAvailable: 320,
    stockValue: 3840.00,
    currentRate: 12.00,
    multiUnits: [
      { name: 'Bag', factor: 20 }
    ]
  },
  {
    id: 'ITEM-10003',
    name: 'Raw Material C',
    category: 'Raw Material',
    baseUnit: 'L',
    quantityAvailable: 500,
    stockValue: 7500.00,
    currentRate: 15.00,
    multiUnits: [
      { name: 'Drum', factor: 200 }
    ]
  },
  {
    id: 'ITEM-10004',
    name: 'Finished Product X',
    category: 'Finished Goods',
    baseUnit: 'PCS',
    quantityAvailable: 540,
    stockValue: 27000.00,
    currentRate: 50.00,
    multiUnits: [
      { name: 'Box', factor: 12 }
    ]
  },
  {
    id: 'ITEM-10005',
    name: 'Finished Product Y',
    category: 'Finished Goods',
    baseUnit: 'PCS',
    quantityAvailable: 85,
    stockValue: 5100.00,
    currentRate: 60.00,
    multiUnits: [
      { name: 'Box', factor: 10 }
    ]
  }
];

// Mock transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'PUR-10042',
    type: 'purchase',
    date: '2025-05-17',
    entity: mockEntities[0], // Vendor ABC
    items: [
      {
        id: 'PITEM-10001',
        productId: 'ITEM-10001',
        productName: 'Raw Material A',
        quantity: 10,
        unit: 'Bag',
        rate: 125.00,
        amount: 1250.00,
        unitConversionFactor: 25,
        baseQuantity: 250 // 10 bags * 25 kg = 250 kg
      },
      {
        id: 'PITEM-10002',
        productId: 'ITEM-10002',
        productName: 'Raw Material B',
        quantity: 20,
        unit: 'KG',
        rate: 12.00,
        amount: 240.00,
        unitConversionFactor: 1,
        baseQuantity: 20 // 20 kg * 1 = 20 kg
      }
    ],
    totalAmount: 1490.00,
    status: 'completed'
  },
  {
    id: 'PUR-10041',
    type: 'purchase',
    date: '2025-05-14',
    entity: mockEntities[1], // Vendor DEF
    items: [
      {
        id: 'PITEM-10003',
        productId: 'ITEM-10003',
        productName: 'Raw Material C',
        quantity: 1,
        unit: 'Drum',
        rate: 3000.00,
        amount: 3000.00,
        unitConversionFactor: 200,
        baseQuantity: 200 // 1 drum * 200 L = 200 L
      }
    ],
    totalAmount: 3000.00,
    status: 'completed'
  },
  {
    id: 'SALE-10128',
    type: 'sale',
    date: '2025-05-16',
    entity: mockEntities[3], // Customer XYZ
    items: [
      {
        id: 'SITEM-10001',
        productId: 'ITEM-10004',
        productName: 'Finished Product X',
        quantity: 5,
        unit: 'Box',
        rate: 600.00,
        amount: 3000.00,
        unitConversionFactor: 12,
        baseQuantity: 60 // 5 boxes * 12 pcs = 60 pcs
      }
    ],
    totalAmount: 3000.00,
    status: 'completed'
  },
  {
    id: 'SALE-10127',
    type: 'sale',
    date: '2025-05-13',
    entity: mockEntities[4], // Customer UVW
    items: [
      {
        id: 'SITEM-10002',
        productId: 'ITEM-10005',
        productName: 'Finished Product Y',
        quantity: 12,
        unit: 'PCS',
        rate: 60.00,
        amount: 720.00,
        unitConversionFactor: 1,
        baseQuantity: 12 // 12 pcs * 1 = 12 pcs
      },
      {
        id: 'SITEM-10003',
        productId: 'ITEM-10004',
        productName: 'Finished Product X',
        quantity: 24,
        unit: 'PCS',
        rate: 50.00,
        amount: 1200.00,
        unitConversionFactor: 1,
        baseQuantity: 24 // 24 pcs * 1 = 24 pcs
      }
    ],
    totalAmount: 1920.00,
    status: 'completed'
  }
];