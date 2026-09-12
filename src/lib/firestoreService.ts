import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  query, 
  orderBy,
  FirestoreError 
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, CategoryConfig, PaymentMethodConfig, AppUser, Order } from '../types';
import { PRODUCTS, CATEGORIES, APP_USERS } from '../data/initialCatalog';
import { INITIAL_PAYMENT_METHODS } from '../data/paymentMethodsData';

// Firestore collections references
export const PRODUCTS_COLLECTION = 'products';
export const CATEGORIES_COLLECTION = 'categories';
export const PAYMENT_METHODS_COLLECTION = 'payment_methods';
export const USERS_COLLECTION = 'users';
export const ORDERS_COLLECTION = 'orders';
export const WALLET_TRANSACTIONS_COLLECTION = 'wallet_transactions';

/**
 * Seed initial data to Firestore if collection is empty
 */
export async function seedInitialFirestoreData() {
  try {
    // Seed Products
    const prodSnap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (prodSnap.empty) {
      for (const p of PRODUCTS) {
        await setDoc(doc(db, PRODUCTS_COLLECTION, p.id), p);
      }
      console.log('Seeded initial products to Firestore');
    }

    // Seed Categories
    const catSnap = await getDocs(collection(db, CATEGORIES_COLLECTION));
    if (catSnap.empty) {
      for (let i = 0; i < CATEGORIES.length; i++) {
        const cat = { ...CATEGORIES[i], order: i, isVisible: true };
        await setDoc(doc(db, CATEGORIES_COLLECTION, cat.id), cat);
      }
      console.log('Seeded initial categories to Firestore');
    }

    // Seed Payment Methods
    const pmSnap = await getDocs(collection(db, PAYMENT_METHODS_COLLECTION));
    if (pmSnap.empty) {
      for (const pm of INITIAL_PAYMENT_METHODS) {
        await setDoc(doc(db, PAYMENT_METHODS_COLLECTION, pm.id), pm);
      }
      console.log('Seeded initial payment methods to Firestore');
    }

    // Seed Users
    const userSnap = await getDocs(collection(db, USERS_COLLECTION));
    if (userSnap.empty) {
      for (const u of APP_USERS) {
        await setDoc(doc(db, USERS_COLLECTION, u.id), u);
      }
      console.log('Seeded initial users to Firestore');
    }
  } catch (err) {
    console.warn('Firestore auto-seed notice (running in local-first sync mode):', (err as Error).message);
  }
}

/**
 * Subscribe to Products real-time updates
 */
export function subscribeToProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (error: FirestoreError) => void
) {
  const colRef = collection(db, PRODUCTS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const items: Product[] = [];
        snapshot.forEach((d) => items.push(d.data() as Product));
        onUpdate(items);
      }
    },
    (error) => {
      console.warn('Products live listener fallback:', error.message);
      if (onError) onError(error);
    }
  );
}

/**
 * Subscribe to Categories real-time updates
 */
export function subscribeToCategories(
  onUpdate: (categories: CategoryConfig[]) => void,
  onError?: (error: FirestoreError) => void
) {
  const colRef = collection(db, CATEGORIES_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const items: CategoryConfig[] = [];
        snapshot.forEach((d) => items.push(d.data() as CategoryConfig));
        items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        onUpdate(items);
      }
    },
    (error) => {
      console.warn('Categories live listener fallback:', error.message);
      if (onError) onError(error);
    }
  );
}

/**
 * Subscribe to Payment Methods real-time updates
 */
export function subscribeToPaymentMethods(
  onUpdate: (methods: PaymentMethodConfig[]) => void,
  onError?: (error: FirestoreError) => void
) {
  const colRef = collection(db, PAYMENT_METHODS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const items: PaymentMethodConfig[] = [];
        snapshot.forEach((d) => items.push(d.data() as PaymentMethodConfig));
        items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        onUpdate(items);
      }
    },
    (error) => {
      console.warn('Payment methods live listener fallback:', error.message);
      if (onError) onError(error);
    }
  );
}

/**
 * Real-time CRUD Helpers for Products
 */
export async function dbSaveProduct(product: Product) {
  try {
    await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), product);
  } catch (err) {
    console.warn('Error saving product to Firestore:', err);
  }
}

export async function dbDeleteProduct(productId: string) {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
  } catch (err) {
    console.warn('Error deleting product from Firestore:', err);
  }
}

/**
 * Real-time CRUD Helpers for Categories
 */
export async function dbSaveCategories(categories: CategoryConfig[]) {
  try {
    for (const cat of categories) {
      await setDoc(doc(db, CATEGORIES_COLLECTION, cat.id), cat);
    }
  } catch (err) {
    console.warn('Error saving categories to Firestore:', err);
  }
}

/**
 * Real-time CRUD Helpers for Payment Methods
 */
export async function dbSavePaymentMethods(methods: PaymentMethodConfig[]) {
  try {
    for (const m of methods) {
      await setDoc(doc(db, PAYMENT_METHODS_COLLECTION, m.id), m);
    }
  } catch (err) {
    console.warn('Error saving payment methods to Firestore:', err);
  }
}

export async function dbDeletePaymentMethod(methodId: string) {
  try {
    await deleteDoc(doc(db, PAYMENT_METHODS_COLLECTION, methodId));
  } catch (err) {
    console.warn('Error deleting payment method from Firestore:', err);
  }
}

/**
 * Persist an Order to Firestore
 */
export async function dbSaveOrder(order: Order) {
  try {
    await setDoc(doc(db, ORDERS_COLLECTION, order.id), {
      ...order,
      syncedAt: new Date().toISOString(),
    });
    console.log(`Order ${order.id} persisted to Firestore successfully`);
  } catch (err) {
    console.warn('Error saving order to Firestore:', err);
  }
}

/**
 * Real-time listener for Orders
 */
export function subscribeToOrders(
  onUpdate: (orders: Order[]) => void,
  onError?: (error: FirestoreError) => void
) {
  const colRef = collection(db, ORDERS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const list: Order[] = [];
        snapshot.forEach((d) => list.push(d.data() as Order));
        onUpdate(list);
      }
    },
    (error) => {
      console.warn('Orders live listener error:', error.message);
      if (onError) onError(error);
    }
  );
}

/**
 * Record an immutable Double-Entry Wallet Ledger transaction
 */
export async function dbRecordWalletTransaction(tx: {
  id?: string;
  userId: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  reason: string;
  orderId?: string;
  balanceAfter: number;
}) {
  try {
    const txId = tx.id || `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const txDoc = {
      ...tx,
      id: txId,
      createdAt: new Date().toISOString(),
      immutable: true,
    };
    await setDoc(doc(db, WALLET_TRANSACTIONS_COLLECTION, txId), txDoc);
    console.log(`Wallet ledger transaction ${txId} recorded.`);
    return txDoc;
  } catch (err) {
    console.warn('Error recording wallet transaction:', err);
    return null;
  }
}
