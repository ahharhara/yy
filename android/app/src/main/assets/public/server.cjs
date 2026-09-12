var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var SERVER_PRODUCT_CATALOG = {
  "p-1": { id: "p-1", name: "\u0639\u0633\u0644 \u0633\u062F\u0631 \u062F\u0648\u0639\u0646\u064A \u0645\u0644\u0643\u064A \u0641\u0627\u062E\u0631", price: 120, stock: 45, currency: "YER" },
  "p-2": { id: "p-2", name: "\u0623\u0631\u0632 \u0628\u0634\u0627\u0648\u0631 \u0647\u0646\u062F\u064A \u0643\u0644\u0627\u0633\u064A\u0643 10 \u0643\u062C\u0645", price: 65, stock: 120, currency: "YER" },
  "p-3": { id: "p-3", name: "\u0632\u064A\u062A \u0632\u064A\u062A\u0648\u0646 \u0628\u0643\u0631 \u0645\u0645\u062A\u0627\u0632 1 \u0644\u062A\u0631", price: 34, stock: 80, currency: "YER" },
  "p-4": { id: "p-4", name: "\u0628\u0647\u0627\u0631\u0627\u062A \u0643\u0628\u0633\u0629 \u062D\u0636\u0631\u0645\u064A\u0629 \u0645\u0634\u0643\u0644\u0629 500 \u062C\u0645", price: 18, stock: 200, currency: "YER" },
  "p-5": { id: "p-5", name: "\u062A\u0645\u0648\u0631 \u0625\u062E\u0644\u0627\u0635 \u0645\u0644\u0643\u064A \u0648\u0627\u062F\u064A \u062D\u0636\u0631\u0645\u0648\u062A 1 \u0643\u062C\u0645", price: 28, stock: 150, currency: "YER" },
  "p-6": { id: "p-6", name: "\u0634\u0627\u064A \u062D\u0636\u0631\u0645\u064A \u0643\u0628\u0648\u0633 \u0623\u062D\u0645\u0631 \u0641\u0627\u062E\u0631 400 \u062C\u0645", price: 14, stock: 300, currency: "YER" },
  "p-7": { id: "p-7", name: "\u0642\u0647\u0648\u0629 \u062D\u0636\u0631\u0645\u064A\u0629 \u0628\u0646 \u0639\u0631\u0628\u064A \u0645\u062D\u0645\u0635 \u0648\u0645\u0637\u062D\u0648\u0646", price: 42, stock: 60, currency: "YER" },
  "p-8": { id: "p-8", name: "\u0644\u0628\u0646 \u062D\u0644\u064A\u0628 \u062D\u0636\u0631\u0645\u0648\u062A \u0637\u0627\u0632\u062C 1 \u0644\u062A\u0631", price: 8, stock: 95, currency: "YER" },
  "p-9": { id: "p-9", name: "\u062F\u062C\u0627\u062C \u0645\u0628\u0631\u062F \u0637\u0627\u0632\u062C 1000 \u062C\u0645", price: 21, stock: 110, currency: "YER" },
  "p-10": { id: "p-10", name: "\u062A\u0641\u0627\u062D \u0623\u062D\u0645\u0631 \u0633\u0643\u0631\u064A \u0645\u0639\u0628\u0623 1 \u0643\u062C\u0645", price: 12, stock: 85, currency: "YER" },
  "p-11": { id: "p-11", name: "\u0637\u0645\u0627\u0637\u0645 \u0628\u0644\u062F\u064A \u0637\u0627\u0632\u062C \u0648\u0627\u062F\u064A \u0627\u0644\u0639\u064A\u0646 1 \u0643\u062C\u0645", price: 6, stock: 250, currency: "YER" },
  "p-12": { id: "p-12", name: "\u0628\u0635\u0644 \u0623\u062D\u0645\u0631 \u064A\u0645\u0646\u064A \u064A\u0627\u0628\u0633 2 \u0643\u062C\u0645", price: 9, stock: 180, currency: "YER" },
  "p-13": { id: "p-13", name: "\u0635\u0627\u0628\u0648\u0646 \u0645\u0633\u062D\u0648\u0642 \u063A\u0633\u064A\u0644 \u0645\u0631\u0643\u0632 5 \u0643\u062C\u0645", price: 39, stock: 70, currency: "YER" },
  "p-14": { id: "p-14", name: "\u0645\u0646\u0627\u062F\u064A\u0644 \u0648\u0631\u0642\u064A\u0629 \u0646\u0627\u0639\u0645\u0629 \u0639\u0628\u0648\u0629 10 \u062D\u0628\u0627\u062A", price: 19, stock: 140, currency: "YER" }
};
var SERVER_COUPONS = {
  HADRAMOUT10: {
    code: "HADRAMOUT10",
    type: "PERCENTAGE",
    value: 10,
    minOrder: 50,
    maxDiscount: 30,
    validUntil: "2027-12-31",
    isActive: true
  },
  WELCOME20: {
    code: "WELCOME20",
    type: "PERCENTAGE",
    value: 20,
    minOrder: 40,
    maxDiscount: 25,
    validUntil: "2027-12-31",
    isActive: true
  },
  WADI50: {
    code: "WADI50",
    type: "FIXED",
    value: 50,
    minOrder: 120,
    validUntil: "2027-12-31",
    isActive: true
  },
  FREEDELIVERY: {
    code: "FREEDELIVERY",
    type: "FREE_DELIVERY",
    value: 15,
    minOrder: 60,
    validUntil: "2027-12-31",
    isActive: true
  }
};
function normalizePhoneDigits(phone) {
  if (!phone) return "";
  let cleaned = phone.replace(/[\s\-\(\)\+]/g, "");
  if (cleaned.startsWith("00")) cleaned = cleaned.slice(2);
  if (cleaned.startsWith("967") && cleaned.length >= 12) cleaned = cleaned.slice(3);
  if (cleaned.startsWith("966") && cleaned.length >= 12) cleaned = cleaned.slice(3);
  if (cleaned.startsWith("0") && cleaned.length === 10) cleaned = cleaned.slice(1);
  return cleaned;
}
var KNOWN_USERS = [
  {
    id: "usr-dev-ahmed",
    name: "\u0645. \u0623\u062D\u0645\u062F \u0623\u0645\u064A\u0646 \u0628\u0646 \u062D\u0631\u0647\u0631\u0647 (\u0645\u0647\u0646\u062F\u0633 \u0627\u0644\u0646\u0638\u0627\u0645 - Root)",
    phone: "+967 773 333 333",
    email: "ahmed.banharhara@gmail.com",
    role: "developer",
    status: "active",
    walletBalance: 25e3
  },
  {
    id: "usr-admin-1",
    name: "\u0639\u0645\u0631 \u0628\u0627\u0639\u0628\u0627\u062F (\u0627\u0644\u0645\u062F\u064A\u0631 \u0627\u0644\u0639\u0627\u0645 \u0644\u0644\u0645\u062A\u062C\u0631)",
    phone: "+967 774 444 444",
    email: "admin@hadramouthyper.com",
    role: "admin",
    status: "active",
    walletBalance: 12500
  },
  {
    id: "usr-merchant-1",
    name: "\u0645\u0624\u0633\u0633\u0629 \u0648\u0627\u062F\u064A \u062F\u0648\u0639\u0646 \u0644\u0644\u0639\u0633\u0644 \u0648\u0627\u0644\u062A\u0645\u0648\u0631",
    phone: "+967 771 111 111",
    email: "merchant@hadramouthyper.com",
    role: "merchant",
    status: "active",
    walletBalance: 8450,
    storeName: "\u0645\u0646\u0627\u062D\u0644 \u0648\u0627\u062F\u064A \u062F\u0648\u0639\u0646 \u0627\u0644\u0645\u0644\u0643\u064A\u0629"
  },
  {
    id: "usr-courier-1",
    name: "\u0637\u0627\u0631\u0642 \u0627\u0644\u0639\u0645\u0648\u062F\u064A (\u0643\u0627\u0628\u062A\u0646 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0633\u0631\u064A\u0639)",
    phone: "+967 772 222 222",
    email: "courier@hadramouthyper.com",
    role: "driver",
    status: "active",
    walletBalance: 420,
    vehicleType: "\u062F\u0631\u0627\u062C\u0629 \u0646\u0627\u0631\u064A\u0629 \u0645\u062C\u0647\u0632\u0629 \u0628\u0635\u0646\u062F\u0648\u0642 \u0639\u0627\u0632\u0644"
  },
  {
    id: "usr-support-1",
    name: "\u0633\u0627\u0644\u0645 \u0628\u0627\u0631\u0634\u064A\u062F (\u062E\u062F\u0645\u0629 \u0627\u0644\u0639\u0645\u0644\u0627\u0621 \u0648\u0627\u0644\u0634\u0643\u0627\u0648\u0649)",
    phone: "+967 775 555 555",
    email: "support@hadramouthyper.com",
    role: "support",
    status: "active",
    walletBalance: 200
  },
  {
    id: "usr-cust-1",
    name: "\u0639\u0628\u062F\u0627\u0644\u0644\u0647 \u0628\u0627\u0648\u0632\u064A\u0631 (\u0639\u0645\u064A\u0644 \u0645\u0648\u062B\u0642)",
    phone: "+967 770 000 000",
    email: "customer@hadramouthyper.com",
    role: "customer",
    status: "active",
    walletBalance: 150
  }
];
var DYNAMIC_USERS = {};
app.post("/api/auth/check-phone", (req, res) => {
  const { phone } = req.body;
  if (!phone || typeof phone !== "string") {
    return res.status(400).json({ error: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641 \u0645\u0637\u0644\u0648\u0628" });
  }
  const normalizedInput = normalizePhoneDigits(phone);
  const rawClean = phone.replace(/\s+/g, "");
  const last4 = normalizedInput.slice(-4) || rawClean.slice(-4) || "0000";
  const maskedPhone = `******${last4}`;
  const foundUser = KNOWN_USERS.find((u) => normalizePhoneDigits(u.phone) === normalizedInput) || DYNAMIC_USERS[normalizedInput];
  if (foundUser) {
    return res.json({
      exists: true,
      maskedPhone,
      user: {
        id: foundUser.id,
        name: foundUser.name,
        phone: foundUser.phone,
        role: foundUser.role,
        status: foundUser.status || "active",
        email: foundUser.email,
        walletBalance: foundUser.walletBalance || 0,
        storeName: foundUser.storeName,
        vehicleType: foundUser.vehicleType
      }
    });
  }
  return res.json({
    exists: false,
    maskedPhone,
    normalizedPhone: normalizedInput
  });
});
app.post("/api/auth/register-user", (req, res) => {
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
    nationalId
  } = req.body;
  if (!phone || !name || !role) {
    return res.status(400).json({ error: "\u0627\u0644\u0627\u0633\u0645 \u0648\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641 \u0648\u0646\u0648\u0639 \u0627\u0644\u062D\u0633\u0627\u0628 \u0645\u0637\u0644\u0648\u0628\u0629" });
  }
  const normalized = normalizePhoneDigits(phone);
  const newId = id || `usr-${role}-${Date.now()}`;
  const newUser = {
    id: newId,
    name,
    phone,
    email: email || `${newId}@hadramouthyper.com`,
    role,
    status: role === "customer" ? "active" : "pending",
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    walletBalance: 0,
    loyaltyPoints: role === "customer" ? 100 : 0,
    address: address || "\u062D\u0636\u0631\u0645\u0648\u062A",
    preferredBranchId: preferredBranchId || "br-hadramout-1",
    deliveryLat: deliveryLat || 14.541,
    deliveryLng: deliveryLng || 49.129,
    ...role === "merchant" && {
      storeName: storeName || `\u0645\u062A\u062C\u0631 ${name}`,
      merchantCategory: merchantCategory || "\u0645\u0646\u062A\u062C\u0627\u062A \u062D\u0636\u0631\u0645\u064A\u0629 \u0623\u0635\u0644\u064A\u0629"
      // Commercial ID completely removed per user instructions
    },
    ...role === "driver" && {
      vehicleType: vehicleType || "\u0633\u064A\u0627\u0631\u0629",
      vehiclePlate: vehiclePlate || "\u062D\u0636\u0631\u0645\u0648\u062A 0000",
      nationalId: nationalId || "1029384756",
      driverRating: 5,
      completedDeliveries: 0,
      isOnline: false
    }
  };
  DYNAMIC_USERS[normalized] = newUser;
  KNOWN_USERS.push(newUser);
  return res.status(201).json({
    success: true,
    user: newUser,
    message: "\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0628\u0646\u062C\u0627\u062D"
  });
});
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    version: "2.4.0",
    androidTarget: "API 36 (Android 16)",
    security: {
      cleartextTraffic: false,
      rbacEnforced: true,
      serverValuation: true
    },
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.post("/api/coupons/validate", (req, res) => {
  const { couponCode, subtotal = 0 } = req.body;
  if (!couponCode || typeof couponCode !== "string") {
    return res.status(400).json({ valid: false, message: "\u0643\u0648\u0628\u0648\u0646 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D" });
  }
  const cleanCode = couponCode.trim().toUpperCase();
  const coupon = SERVER_COUPONS[cleanCode];
  if (!coupon || !coupon.isActive) {
    return res.status(404).json({ valid: false, message: "\u0631\u0645\u0632 \u0627\u0644\u0643\u0648\u0628\u0648\u0646 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F \u0623\u0648 \u0645\u0646\u062A\u0647\u064A \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629" });
  }
  if (new Date(coupon.validUntil) < /* @__PURE__ */ new Date()) {
    return res.status(400).json({ valid: false, message: "\u0627\u0646\u062A\u0647\u062A \u0635\u0644\u0627\u062D\u064A\u0629 \u0647\u0630\u0627 \u0627\u0644\u0643\u0648\u0628\u0648\u0646" });
  }
  if (subtotal < coupon.minOrder) {
    return res.status(400).json({
      valid: false,
      message: `\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 \u0644\u062A\u0641\u0639\u064A\u0644 \u0647\u0630\u0627 \u0627\u0644\u0643\u0648\u0628\u0648\u0646 \u0647\u0648 ${coupon.minOrder} \u0631.\u064A`
    });
  }
  let discountAmount = 0;
  if (coupon.type === "PERCENTAGE") {
    discountAmount = subtotal * coupon.value / 100;
    if (coupon.maxDiscount) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    }
  } else if (coupon.type === "FIXED") {
    discountAmount = Math.min(coupon.value, subtotal);
  } else if (coupon.type === "FREE_DELIVERY") {
    discountAmount = 15;
  }
  return res.json({
    valid: true,
    code: coupon.code,
    type: coupon.type,
    discountAmount: Math.round(discountAmount * 100) / 100,
    message: "\u062A\u0645 \u062A\u0641\u0639\u064A\u0644 \u0643\u0648\u062F \u0627\u0644\u062E\u0635\u0645 \u0628\u0646\u062C\u0627\u062D"
  });
});
app.post("/api/pricing/calculate", (req, res) => {
  const { items = [], couponCode, useWallet = false, walletBalance = 0 } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "\u0627\u0644\u0633\u0644\u0629 \u0641\u0627\u0631\u063A\u0629" });
  }
  let subtotal = 0;
  const verifiedItems = [];
  for (const item of items) {
    const qty = Math.max(1, Math.min(99, Number(item.quantity) || 1));
    const serverProduct = SERVER_PRODUCT_CATALOG[item.productId];
    const price = serverProduct ? serverProduct.price : Math.max(0, Number(item.price) || 0);
    const name = serverProduct ? serverProduct.name : item.name || "\u0645\u0646\u062A\u062C";
    const inStock = serverProduct ? serverProduct.stock >= qty : true;
    const lineTotal = price * qty;
    subtotal += lineTotal;
    verifiedItems.push({
      productId: item.productId,
      name,
      unitPrice: price,
      quantity: qty,
      lineTotal,
      inStock
    });
  }
  let promoDiscount = 0;
  let appliedCoupon = null;
  if (couponCode && typeof couponCode === "string") {
    const cleanCode = couponCode.trim().toUpperCase();
    const coupon = SERVER_COUPONS[cleanCode];
    if (coupon && coupon.isActive && subtotal >= coupon.minOrder) {
      if (coupon.type === "PERCENTAGE") {
        promoDiscount = subtotal * coupon.value / 100;
        if (coupon.maxDiscount) promoDiscount = Math.min(promoDiscount, coupon.maxDiscount);
      } else if (coupon.type === "FIXED") {
        promoDiscount = Math.min(coupon.value, subtotal);
      } else if (coupon.type === "FREE_DELIVERY") {
        promoDiscount = 15;
      }
      appliedCoupon = coupon.code;
    }
  }
  const taxableSubtotal = Math.max(0, subtotal - promoDiscount);
  const vat = Math.round(taxableSubtotal * 0.15 * 100) / 100;
  const deliveryFee = subtotal >= 150 || appliedCoupon === "FREEDELIVERY" ? 0 : 15;
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
    calculatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    quoteToken: `quote_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
  });
});
app.post("/api/orders/create", (req, res) => {
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
    notes
  } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "\u0644\u0627 \u064A\u0645\u0643\u0646 \u0625\u0646\u0634\u0627\u0621 \u0637\u0644\u0628 \u0628\u0633\u0644\u0629 \u0641\u0627\u0631\u063A\u0629" });
  }
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
      totalPrice: lineTotal
    };
  });
  let discount = 0;
  if (couponCode) {
    const coupon = SERVER_COUPONS[String(couponCode).trim().toUpperCase()];
    if (coupon && coupon.isActive && subtotal >= coupon.minOrder) {
      if (coupon.type === "PERCENTAGE") {
        discount = subtotal * coupon.value / 100;
        if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
      } else if (coupon.type === "FIXED") {
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
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
  const orderId = `HAD-${Date.now().toString().slice(-6)}`;
  const createdOrder = {
    id: orderId,
    customerId: customerId || "guest_user",
    customerName: customerName || "\u0639\u0645\u064A\u0644 \u062D\u0636\u0631\u0645\u0648\u062A",
    customerPhone: customerPhone || "770000000",
    items: orderItems,
    branchId: branchId || "br-hadramout-aqqad",
    deliveryAddress: deliveryAddress || "\u062D\u0636\u0631\u0645\u0648\u062A",
    deliverySlot: deliverySlot || "\u0641\u0648\u0631\u064A",
    paymentMethod: paymentMethod || "\u0627\u0644\u062F\u0641\u0639 \u0639\u0646\u062F \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645",
    paymentStatus: payableRemaining === 0 ? "PAID" : "PENDING",
    status: "PLACED",
    subtotal,
    discount,
    vat,
    deliveryFee,
    total: totalAmount,
    walletDeduction: walletUsed,
    payableRemaining,
    transferReference: transferReference || null,
    notes: notes || "",
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    audit: {
      originIp: clientIp,
      userAgent: req.headers["user-agent"] || "Android App",
      serverCertified: true
    }
  };
  return res.status(201).json({
    success: true,
    order: createdOrder,
    message: "\u062A\u0645 \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0637\u0644\u0628 \u0648\u0627\u0639\u062A\u0645\u0627\u062F\u0647 \u0628\u0646\u062C\u0627\u062D \u0639\u0644\u0649 \u0627\u0644\u062E\u0627\u062F\u0645"
  });
});
app.post("/api/wallet/transact", (req, res) => {
  const { userId, type, amount, reason, orderId, currentBalance = 0 } = req.body;
  if (!userId || !type || !amount || amount <= 0) {
    return res.status(400).json({ error: "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0639\u0645\u0644\u064A\u0629 \u0627\u0644\u0645\u0627\u0644\u064A\u0629 \u063A\u064A\u0631 \u0645\u0643\u062A\u0645\u0644\u0629" });
  }
  if (type === "DEBIT" && currentBalance < amount) {
    return res.status(400).json({ error: "\u0631\u0635\u064A\u062F \u0627\u0644\u0645\u062D\u0641\u0638\u0629 \u063A\u064A\u0631 \u0643\u0627\u0641\u064D \u0644\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0639\u0645\u0644\u064A\u0629" });
  }
  const numericAmount = Math.round(Number(amount) * 100) / 100;
  const newBalance = type === "CREDIT" ? Math.round((currentBalance + numericAmount) * 100) / 100 : Math.round((currentBalance - numericAmount) * 100) / 100;
  const transactionRecord = {
    id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId,
    type,
    // 'CREDIT' | 'DEBIT'
    amount: numericAmount,
    balanceBefore: currentBalance,
    balanceAfter: newBalance,
    reason: reason || "\u062D\u0631\u0643\u0629 \u0645\u062D\u0641\u0638\u0629",
    orderId: orderId || null,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    hashProof: `ledger_sha_${Date.now().toString(16)}`
  };
  return res.status(200).json({
    success: true,
    transaction: transactionRecord,
    newBalance
  });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Hadramout Hyper Backend & Dev Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Fatal Server Boot Error:", err);
  process.exit(1);
});
//# sourceMappingURL=server.cjs.map
