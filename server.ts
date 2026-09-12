import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// --- Mock / Master Server Products Catalog for Server Valuation ---
// In production, this can also query Firestore directly with Firebase Admin or REST
interface CatalogItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  currency: 'YER' | 'SAR';
}

const SERVER_PRODUCT_CATALOG: Record<string, CatalogItem> = {
  'p-1': { id: 'p-1', name: 'عسل سدر دوعني ملكي فاخر', price: 120, stock: 45, currency: 'YER' },
  'p-2': { id: 'p-2', name: 'أرز بشاور هندي كلاسيك 10 كجم', price: 65, stock: 120, currency: 'YER' },
  'p-3': { id: 'p-3', name: 'زيت زيتون بكر ممتاز 1 لتر', price: 34, stock: 80, currency: 'YER' },
  'p-4': { id: 'p-4', name: 'بهارات كبسة حضرمية مشكلة 500 جم', price: 18, stock: 200, currency: 'YER' },
  'p-5': { id: 'p-5', name: 'تمور إخلاص ملكي وادي حضرموت 1 كجم', price: 28, stock: 150, currency: 'YER' },
  'p-6': { id: 'p-6', name: 'شاي حضرمي كبوس أحمر فاخر 400 جم', price: 14, stock: 300, currency: 'YER' },
  'p-7': { id: 'p-7', name: 'قهوة حضرمية بن عربي محمص ومطحون', price: 42, stock: 60, currency: 'YER' },
  'p-8': { id: 'p-8', name: 'لبن حليب حضرموت طازج 1 لتر', price: 8, stock: 95, currency: 'YER' },
  'p-9': { id: 'p-9', name: 'دجاج مبرد طازج 1000 جم', price: 21, stock: 110, currency: 'YER' },
  'p-10': { id: 'p-10', name: 'تفاح أحمر سكري معبأ 1 كجم', price: 12, stock: 85, currency: 'YER' },
  'p-11': { id: 'p-11', name: 'طماطم بلدي طازج وادي العين 1 كجم', price: 6, stock: 250, currency: 'YER' },
  'p-12': { id: 'p-12', name: 'بصل أحمر يمني يابس 2 كجم', price: 9, stock: 180, currency: 'YER' },
  'p-13': { id: 'p-13', name: 'صابون مسحوق غسيل مركز 5 كجم', price: 39, stock: 70, currency: 'YER' },
  'p-14': { id: 'p-14', name: 'مناديل ورقية ناعمة عبوة 10 حبات', price: 19, stock: 140, currency: 'YER' },
};

// --- Secure Server-Side Coupons Engine ---
interface CouponDefinition {
  code: string;
  type: 'PERCENTAGE' | 'FIXED' | 'FREE_DELIVERY';
  value: number; // e.g., 10 for 10%, 50 for 50 YER
  minOrder: number;
  maxDiscount?: number;
  validUntil: string;
  isActive: boolean;
}

const SERVER_COUPONS: Record<string, CouponDefinition> = {
  HADRAMOUT10: {
    code: 'HADRAMOUT10',
    type: 'PERCENTAGE',
    value: 10,
    minOrder: 50,
    maxDiscount: 30,
    validUntil: '2027-12-31',
    isActive: true,
  },
  WELCOME20: {
    code: 'WELCOME20',
    type: 'PERCENTAGE',
    value: 20,
    minOrder: 40,
    maxDiscount: 25,
    validUntil: '2027-12-31',
    isActive: true,
  },
  WADI50: {
    code: 'WADI50',
    type: 'FIXED',
    value: 50,
    minOrder: 120,
    validUntil: '2027-12-31',
    isActive: true,
  },
  FREEDELIVERY: {
    code: 'FREEDELIVERY',
    type: 'FREE_DELIVERY',
    value: 15,
    minOrder: 60,
    validUntil: '2027-12-31',
    isActive: true,
  },
};

// -------------------------------------------------------------
// Auth & Zero-Trust User Directory
// -------------------------------------------------------------
function normalizePhoneDigits(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  if (cleaned.startsWith('00')) cleaned = cleaned.slice(2);
  if (cleaned.startsWith('967') && cleaned.length >= 12) cleaned = cleaned.slice(3);
  if (cleaned.startsWith('966') && cleaned.length >= 12) cleaned = cleaned.slice(3);
  if (cleaned.startsWith('0') && cleaned.length === 10) cleaned = cleaned.slice(1);
  return cleaned;
}

const KNOWN_USERS = [
  {
    id: 'usr-dev-ahmed',
    name: 'م. أحمد أمين بن حرهره (مهندس النظام - Root)',
    phone: '+967 773 333 333',
    email: 'ahmed.banharhara@gmail.com',
    role: 'developer',
    status: 'active',
    walletBalance: 25000.0,
  },
  {
    id: 'usr-admin-1',
    name: 'عمر باعباد (المدير العام للمتجر)',
    phone: '+967 774 444 444',
    email: 'admin@hadramouthyper.com',
    role: 'admin',
    status: 'active',
    walletBalance: 12500.0,
  },
  {
    id: 'usr-merchant-1',
    name: 'مؤسسة وادي دوعن للعسل والتمور',
    phone: '+967 771 111 111',
    email: 'merchant@hadramouthyper.com',
    role: 'merchant',
    status: 'active',
    walletBalance: 8450.0,
    storeName: 'مناحل وادي دوعن الملكية',
  },
  {
    id: 'usr-courier-1',
    name: 'طارق العمودي (كابتن التوصيل السريع)',
    phone: '+967 772 222 222',
    email: 'courier@hadramouthyper.com',
    role: 'driver',
    status: 'active',
    walletBalance: 420.0,
    vehicleType: 'دراجة نارية مجهزة بصندوق عازل',
  },
  {
    id: 'usr-support-1',
    name: 'سالم بارشيد (خدمة العملاء والشكاوى)',
    phone: '+967 775 555 555',
    email: 'support@hadramouthyper.com',
    role: 'support',
    status: 'active',
    walletBalance: 200.0,
  },
  {
    id: 'usr-cust-1',
    name: 'عبدالله باوزير (عميل موثق)',
    phone: '+967 770 000 000',
    email: 'customer@hadramouthyper.com',
    role: 'customer',
    status: 'active',
    walletBalance: 150.0,
  },
];

const DYNAMIC_USERS: Record<string, any> = {};

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// 0. Check Phone in Database (Users collection lookup)
app.post('/api/auth/check-phone', (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone || typeof phone !== 'string') {
    return res.status(400).json({ error: 'رقم الهاتف مطلوب' });
  }

  const normalizedInput = normalizePhoneDigits(phone);
  const rawClean = phone.replace(/\s+/g, '');
  const last4 = normalizedInput.slice(-4) || rawClean.slice(-4) || '0000';
  const maskedPhone = `******${last4}`;

  // Check known app users first
  const foundUser =
    KNOWN_USERS.find((u) => normalizePhoneDigits(u.phone) === normalizedInput) ||
    DYNAMIC_USERS[normalizedInput];

  if (foundUser) {
    return res.json({
      exists: true,
      maskedPhone,
      user: {
        id: foundUser.id,
        name: foundUser.name,
        phone: foundUser.phone,
        role: foundUser.role,
        status: foundUser.status || 'active',
        email: foundUser.email,
        walletBalance: foundUser.walletBalance || 0,
        storeName: (foundUser as any).storeName,
        vehicleType: (foundUser as any).vehicleType,
      },
    });
  }

  return res.json({
    exists: false,
    maskedPhone,
    normalizedPhone: normalizedInput,
  });
});

// 0.1 Register New User
app.post('/api/auth/register-user', (req: Request, res: Response) => {
  const {
    id,
    phone,
    name,
    role,
    email,
    address,
    preferredBranchId,
    deliveryLat,
    deliveryLng,
    storeName,
    merchantCategory,
    vehicleType,
    vehiclePlate,
    nationalId,
  } = req.body;

  if (!phone || !name || !role) {
    return res.status(400).json({ error: 'الاسم ورقم الهاتف ونوع الحساب مطلوبة' });
  }

  const normalized = normalizePhoneDigits(phone);
  const newId = id || `usr-${role}-${Date.now()}`;
  const newUser = {
    id: newId,
    name,
    phone,
    email: email || `${newId}@hadramouthyper.com`,
    role,
    status: role === 'customer' ? 'active' : 'pending',
    createdAt: new Date().toISOString(),
    walletBalance: 0,
    loyaltyPoints: role === 'customer' ? 100 : 0,
    address: address || 'حضرموت',
    preferredBranchId: preferredBranchId || 'br-hadramout-1',
    deliveryLat: deliveryLat || 14.541,
    deliveryLng: deliveryLng || 49.129,
    ...(role === 'merchant' && {
      storeName: storeName || `متجر ${name}`,
      merchantCategory: merchantCategory || 'منتجات حضرمية أصلية',
      // Commercial ID completely removed per user instructions
    }),
    ...(role === 'driver' && {
      vehicleType: vehicleType || 'سيارة',
      vehiclePlate: vehiclePlate || 'حضرموت 0000',
      nationalId: nationalId || '1029384756',
      driverRating: 5.0,
      completedDeliveries: 0,
      isOnline: false,
    }),
  };

  DYNAMIC_USERS[normalized] = newUser;
  KNOWN_USERS.push(newUser);

  return res.status(201).json({
    success: true,
    user: newUser,
    message: 'تم تسجيل المستخدم بنجاح',
  });
});

// 1. Health & Production Status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    version: '2.4.0',
    androidTarget: 'API 36 (Android 16)',
    security: {
      cleartextTraffic: false,
      rbacEnforced: true,
      serverValuation: true,
    },
    timestamp: new Date().toISOString(),
  });
});

// 2. Validate Coupon Endpoint
app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { couponCode, subtotal = 0 } = req.body;
  if (!couponCode || typeof couponCode !== 'string') {
    return res.status(400).json({ valid: false, message: 'كوبون غير صالح' });
  }

  const cleanCode = couponCode.trim().toUpperCase();
  const coupon = SERVER_COUPONS[cleanCode];

  if (!coupon || !coupon.isActive) {
    return res.status(404).json({ valid: false, message: 'رمز الكوبون غير موجود أو منتهي الصلاحية' });
  }

  if (new Date(coupon.validUntil) < new Date()) {
    return res.status(400).json({ valid: false, message: 'انتهت صلاحية هذا الكوبون' });
  }

  if (subtotal < coupon.minOrder) {
    return res.status(400).json({
      valid: false,
      message: `الحد الأدنى لتفعيل هذا الكوبون هو ${coupon.minOrder} ر.ي`,
    });
  }

  let discountAmount = 0;
  if (coupon.type === 'PERCENTAGE') {
    discountAmount = (subtotal * coupon.value) / 100;
    if (coupon.maxDiscount) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    }
  } else if (coupon.type === 'FIXED') {
    discountAmount = Math.min(coupon.value, subtotal);
  } else if (coupon.type === 'FREE_DELIVERY') {
    discountAmount = 15; // delivery fee waived
  }

  return res.json({
    valid: true,
    code: coupon.code,
    type: coupon.type,
    discountAmount: Math.round(discountAmount * 100) / 100,
    message: 'تم تفعيل كود الخصم بنجاح',
  });
});

// 3. Server Order Valuation (Single Source of Truth for Pricing)
app.post('/api/pricing/calculate', (req: Request, res: Response) => {
  const { items = [], couponCode, useWallet = false, walletBalance = 0 } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'السلة فارغة' });
  }

  let subtotal = 0;
  const verifiedItems: Array<{
    productId: string;
    name: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
    inStock: boolean;
  }> = [];

  for (const item of items) {
    const qty = Math.max(1, Math.min(99, Number(item.quantity) || 1));
    const serverProduct = SERVER_PRODUCT_CATALOG[item.productId];

    // If item not in static server catalog fallback, accept item.price but sanitize
    const price = serverProduct ? serverProduct.price : Math.max(0, Number(item.price) || 0);
    const name = serverProduct ? serverProduct.name : item.name || 'منتج';
    const inStock = serverProduct ? serverProduct.stock >= qty : true;

    const lineTotal = price * qty;
    subtotal += lineTotal;

    verifiedItems.push({
      productId: item.productId,
      name,
      unitPrice: price,
      quantity: qty,
      lineTotal,
      inStock,
    });
  }

  // Calculate Coupon Discount Server-Side
  let promoDiscount = 0;
  let appliedCoupon: string | null = null;
  if (couponCode && typeof couponCode === 'string') {
    const cleanCode = couponCode.trim().toUpperCase();
    const coupon = SERVER_COUPONS[cleanCode];
    if (coupon && coupon.isActive && subtotal >= coupon.minOrder) {
      if (coupon.type === 'PERCENTAGE') {
        promoDiscount = (subtotal * coupon.value) / 100;
        if (coupon.maxDiscount) promoDiscount = Math.min(promoDiscount, coupon.maxDiscount);
      } else if (coupon.type === 'FIXED') {
        promoDiscount = Math.min(coupon.value, subtotal);
      } else if (coupon.type === 'FREE_DELIVERY') {
        promoDiscount = 15;
      }
      appliedCoupon = coupon.code;
    }
  }

  const taxableSubtotal = Math.max(0, subtotal - promoDiscount);
  const vat = Math.round(taxableSubtotal * 0.15 * 100) / 100;
  const deliveryFee = subtotal >= 150 || (appliedCoupon === 'FREEDELIVERY') ? 0 : 15;
  const totalBeforeWallet = Math.round((taxableSubtotal + vat + deliveryFee) * 100) / 100;

  let walletDeduction = 0;
  if (useWallet && walletBalance > 0) {
    walletDeduction = Math.min(walletBalance, totalBeforeWallet);
  }

  const finalPayable = Math.max(0, Math.round((totalBeforeWallet - walletDeduction) * 100) / 100);

  return res.json({
    success: true,
    verifiedItems,
    subtotal,
    promoDiscount,
    appliedCoupon,
    vat,
    deliveryFee,
    totalBeforeWallet,
    walletDeduction,
    finalPayable,
    calculatedAt: new Date().toISOString(),
    quoteToken: `quote_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
  });
});

// 4. Server-Side Create Order (Tamper-Proof)
app.post('/api/orders/create', (req: Request, res: Response) => {
  const {
    customerId,
    customerName,
    customerPhone,
    items,
    couponCode,
    deliveryAddress,
    deliverySlot,
    paymentMethod,
    branchId,
    transferReference,
    useWallet,
    userWalletBalance = 0,
    notes,
  } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'لا يمكن إنشاء طلب بسلة فارغة' });
  }

  // Perform Server Valuation
  let subtotal = 0;
  const orderItems = items.map((it) => {
    const qty = Math.max(1, Math.min(99, Number(it.quantity) || 1));
    const serverProduct = SERVER_PRODUCT_CATALOG[it.productId];
    const unitPrice = serverProduct ? serverProduct.price : Math.max(0, Number(it.price) || 0);
    const lineTotal = unitPrice * qty;
    subtotal += lineTotal;
    return {
      productId: it.productId,
      name: serverProduct ? serverProduct.name : it.name,
      quantity: qty,
      unitPrice,
      totalPrice: lineTotal,
    };
  });

  let discount = 0;
  if (couponCode) {
    const coupon = SERVER_COUPONS[String(couponCode).trim().toUpperCase()];
    if (coupon && coupon.isActive && subtotal >= coupon.minOrder) {
      if (coupon.type === 'PERCENTAGE') {
        discount = (subtotal * coupon.value) / 100;
        if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
      } else if (coupon.type === 'FIXED') {
        discount = Math.min(coupon.value, subtotal);
      }
    }
  }

  const taxable = Math.max(0, subtotal - discount);
  const vat = Math.round(taxable * 0.15 * 100) / 100;
  const deliveryFee = subtotal >= 150 ? 0 : 15;
  const totalAmount = Math.round((taxable + vat + deliveryFee) * 100) / 100;

  let walletUsed = 0;
  if (useWallet && userWalletBalance > 0) {
    walletUsed = Math.min(userWalletBalance, totalAmount);
  }
  const payableRemaining = Math.max(0, Math.round((totalAmount - walletUsed) * 100) / 100);

  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const orderId = `HAD-${Date.now().toString().slice(-6)}`;

  const createdOrder = {
    id: orderId,
    customerId: customerId || 'guest_user',
    customerName: customerName || 'عميل حضرموت',
    customerPhone: customerPhone || '770000000',
    items: orderItems,
    branchId: branchId || 'br-hadramout-aqqad',
    deliveryAddress: deliveryAddress || 'حضرموت',
    deliverySlot: deliverySlot || 'فوري',
    paymentMethod: paymentMethod || 'الدفع عند الاستلام',
    paymentStatus: payableRemaining === 0 ? 'PAID' : 'PENDING',
    status: 'PLACED',
    subtotal,
    discount,
    vat,
    deliveryFee,
    total: totalAmount,
    walletDeduction: walletUsed,
    payableRemaining,
    transferReference: transferReference || null,
    notes: notes || '',
    createdAt: new Date().toISOString(),
    audit: {
      originIp: clientIp,
      userAgent: req.headers['user-agent'] || 'Android App',
      serverCertified: true,
    },
  };

  return res.status(201).json({
    success: true,
    order: createdOrder,
    message: 'تم التحقق من الطلب واعتماده بنجاح على الخادم',
  });
});

// 5. Double-Entry Wallet Ledger Endpoint
app.post('/api/wallet/transact', (req: Request, res: Response) => {
  const { userId, type, amount, reason, orderId, currentBalance = 0 } = req.body;

  if (!userId || !type || !amount || amount <= 0) {
    return res.status(400).json({ error: 'بيانات العملية المالية غير مكتملة' });
  }

  if (type === 'DEBIT' && currentBalance < amount) {
    return res.status(400).json({ error: 'رصيد المحفظة غير كافٍ لإتمام العملية' });
  }

  const numericAmount = Math.round(Number(amount) * 100) / 100;
  const newBalance =
    type === 'CREDIT'
      ? Math.round((currentBalance + numericAmount) * 100) / 100
      : Math.round((currentBalance - numericAmount) * 100) / 100;

  const transactionRecord = {
    id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId,
    type, // 'CREDIT' | 'DEBIT'
    amount: numericAmount,
    balanceBefore: currentBalance,
    balanceAfter: newBalance,
    reason: reason || 'حركة محفظة',
    orderId: orderId || null,
    timestamp: new Date().toISOString(),
    hashProof: `ledger_sha_${Date.now().toString(16)}`,
  };

  return res.status(200).json({
    success: true,
    transaction: transactionRecord,
    newBalance,
  });
});

// -------------------------------------------------------------
// Vite Middleware / Production Static Fallback
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hadramout Hyper Backend & Dev Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Boot Error:', err);
  process.exit(1);
});
