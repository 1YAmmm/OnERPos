import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  X,
  ShoppingBag,
  CheckCircle2,
  Printer,
  ShoppingCart,
} from "lucide-react";
import { PRODUCTS } from "../../data/mockData";
import { Badge } from "../common/Badge";

const CATEGORIES = ["All", "Beverages", "Furniture", "Electronics"];
const TAX_RATE = 0.08;

export function UiPOSPage() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [discount, setDiscount] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const filtered = PRODUCTS.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists)
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i,
        );
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0),
    );
  };

  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmt = Math.min(parseFloat(discount) || 0, subtotal);
  const taxable = subtotal - discountAmt;
  const tax = taxable * TAX_RATE;
  const total = taxable + tax;

  const handleCheckout = () => {
    setShowCheckout(false);
    setShowReceipt(true);
  };

  const handleNewSale = () => {
    setCart([]);
    setDiscount("");
    setShowReceipt(false);
    setShowCart(false);
  };

  const CartPanel = (
    <div className="w-full h-full flex flex-col glass lg:rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/8">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-semibold text-white/80">Cart</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/35">{cart.length} items</span>
          <button
            onClick={() => setShowCart(false)}
            className="lg:hidden text-white/30 hover:text-white/60 ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cart items */}
      <div
        className="flex-1 overflow-y-auto px-3 py-3 space-y-2
                   [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <AnimatePresence>
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-white/20">
              <ShoppingBag className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">Cart is empty</p>
              <p className="text-xs mt-0.5">Tap a product to add</p>
            </div>
          ) : (
            cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 group"
              >
                <span className="text-xl shrink-0">{item.image}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white/75 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-indigo-300">
                    ${(item.price * item.qty).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="w-6 h-6 glass rounded-lg flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-white/8 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-medium text-white/75">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="w-6 h-6 glass rounded-lg flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-white/8 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-6 h-6 ml-1 rounded-lg flex items-center justify-center text-white/20 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Totals */}
      <div className="border-t border-white/8 px-4 py-4 space-y-3">
        <div>
          <label className="text-xs text-white/35 block mb-1.5">
            Discount ($)
          </label>
          <input
            type="number"
            min="0"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="0.00"
            className="w-full glass rounded-lg px-3 py-1.5 text-sm text-white/75 placeholder:text-white/20 outline-none"
          />
        </div>
        <div className="space-y-1.5">
          {[
            { label: "Subtotal", val: `$${subtotal.toFixed(2)}` },
            {
              label: "Discount",
              val: discountAmt > 0 ? `-$${discountAmt.toFixed(2)}` : "—",
            },
            {
              label: `Tax (${(TAX_RATE * 100).toFixed(0)}%)`,
              val: `$${tax.toFixed(2)}`,
            },
          ].map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-white/35">{r.label}</span>
              <span className="text-white/60">{r.val}</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-2 border-t border-white/8">
            <span className="text-sm font-semibold text-white/80">Total</span>
            <span className="text-xl font-bold text-indigo-300">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={cart.length === 0}
          onClick={() => setShowCheckout(true)}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
        >
          Checkout — ${total.toFixed(2)}
        </motion.button>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 overflow-hidden relative">
      {/* LEFT: Product Grid */}
      <div className="flex-1 flex flex-col gap-3 min-w-0 overflow-hidden">
        {/* Search + Categories */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 flex-1">
            <Search className="w-4 h-4 text-white/30 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="flex-1 bg-transparent text-sm text-white/80 placeholder:text-white/25 outline-none"
            />
          </div>

          {/* Categories — horizontal scroll on mobile */}
          <div
            className="flex gap-2 overflow-x-auto pb-0.5
                       [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
                  category === c
                    ? "bg-indigo-600 text-white"
                    : "glass text-white/50 hover:bg-white/6"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Product cards */}
        <div
          className="flex-1 overflow-y-auto
                     [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 pb-24 lg:pb-4">
            {filtered.map((product, i) => (
              <motion.button
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => addToCart(product)}
                className="glass rounded-xl p-3 sm:p-4 text-left hover:bg-white/6 transition-colors active:bg-indigo-500/10"
              >
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">
                  {product.image}
                </div>
                <p className="text-xs sm:text-sm font-medium text-white/80 leading-tight mb-1 truncate">
                  {product.name}
                </p>
                <p className="text-[10px] sm:text-xs text-white/35 mb-2">
                  {product.sku}
                </p>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-sm sm:text-base font-bold text-indigo-300">
                    ${product.price.toFixed(2)}
                  </span>
                  <span
                    className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full border shrink-0 ${
                      product.stock <= product.reorderPoint
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    }`}
                  >
                    {product.stock} left
                  </span>
                </div>
              </motion.button>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-2 sm:col-span-3 flex items-center justify-center py-16 text-white/25 text-sm">
                No products found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Cart — desktop sidebar */}
      <div className="hidden lg:flex w-80 xl:w-88 flex-col shrink-0">
        {CartPanel}
      </div>

      {/* MOBILE: Floating cart button */}
      <AnimatePresence>
        {!showCart && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setShowCart(true)}
            className="lg:hidden fixed bottom-6 right-4 z-40
                       flex items-center gap-2
                       bg-indigo-600 hover:bg-indigo-500 text-white
                       px-4 py-3 rounded-2xl shadow-xl shadow-indigo-500/30
                       font-medium text-sm transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            {cart.length > 0 && (
              <span className="bg-white text-indigo-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
            <span>${total.toFixed(2)}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* MOBILE: Cart slide-up drawer */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowCart(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="lg:hidden fixed inset-x-0 bottom-0 z-50 h-[85vh] rounded-t-3xl overflow-hidden"
            >
              {CartPanel}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowCheckout(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto glass-strong rounded-2xl p-6 z-50 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-white/85">
                  Payment
                </h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-white/30 hover:text-white/60"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Order total</span>
                  <span className="text-2xl font-bold text-indigo-300">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <div>
                  <label className="text-xs text-white/40 block mb-2">
                    Payment method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Cash", "Card", "QR"].map((m) => (
                      <button
                        key={m}
                        onClick={() => setPaymentMethod(m)}
                        className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                          paymentMethod === m
                            ? "bg-indigo-600 text-white"
                            : "glass text-white/50 hover:bg-white/6"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirm Payment
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Receipt Modal */}
      <AnimatePresence>
        {showReceipt && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto glass-strong rounded-2xl p-6 z-50 shadow-2xl"
            >
              <div className="text-center mb-5">
                <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500/25 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-base font-semibold text-white/85">
                  Sale Complete
                </h2>
                <p className="text-xs text-white/35 mt-1">
                  Transaction processed successfully
                </p>
              </div>
              <div
                className="glass rounded-xl p-4 mb-4 space-y-2 max-h-48 overflow-y-auto
                           [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs">
                    <span className="text-white/55">
                      {item.name} × {item.qty}
                    </span>
                    <span className="text-white/70">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-white/8 pt-2 flex justify-between text-sm font-semibold">
                  <span className="text-white/70">Total paid</span>
                  <span className="text-indigo-300">${total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-white/30 text-center pt-1">
                  {paymentMethod} · {new Date().toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 glass hover:bg-white/8 text-white/55 text-sm py-2.5 rounded-xl transition-colors">
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button
                  onClick={handleNewSale}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-2.5 rounded-xl transition-colors font-medium"
                >
                  New Sale
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
