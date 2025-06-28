// src/core/useRippleEffect.ts
import { useEffect, useRef } from "react";

// src/core/eventBus.ts
var eventBus = /* @__PURE__ */ new Map();
function emit(event, payload) {
  eventBus.get(event)?.forEach((fn) => fn(payload));
}
function on(event, handler) {
  if (!eventBus.has(event)) {
    eventBus.set(event, /* @__PURE__ */ new Set());
  }
  eventBus.get(event)?.add(handler);
  return () => {
    eventBus.get(event)?.delete(handler);
  };
}

// src/core/useRippleEffect.ts
function useRippleEffect(event, handler, options) {
  const stableHandler = useRef(handler);
  useEffect(() => {
    stableHandler.current = handler;
  }, [handler]);
  useEffect(() => {
    let cancelled = false;
    const tools = { aborted: () => cancelled };
    const wrapped = async (payload) => {
      if (cancelled) return;
      let loadingSignal;
      let errorSignal;
      if (options && typeof options === "object" && "value" in options && typeof options.value === "object") {
        const obj = options.value;
        if ("loading" in obj && typeof obj.loading === "boolean") {
          loadingSignal = {
            get value() {
              return options.value.loading;
            },
            set value(val) {
              options.value = { ...options.value, loading: val };
            }
          };
        }
        if ("error" in obj) {
          errorSignal = {
            get value() {
              return options.value.error;
            },
            set value(val) {
              options.value = { ...options.value, error: val };
            }
          };
        }
      } else {
        loadingSignal = options?.loadingSignal ?? options?.loading;
        errorSignal = options?.errorSignal ?? options?.error;
      }
      loadingSignal && (loadingSignal.value = true);
      errorSignal && (errorSignal.value = null);
      try {
        const result = stableHandler.current(payload, tools);
        if (result instanceof Promise) {
          const awaited = await result;
          if (awaited instanceof Response && !awaited.ok) {
            throw new Error(`HTTP ${awaited.status}: ${awaited.statusText}`);
          }
        }
      } catch (error) {
        if (errorSignal) {
          errorSignal.value = error;
        }
      } finally {
        if (loadingSignal) {
          loadingSignal.value = false;
        }
      }
    };
    const unsubscribe = on(event, wrapped);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [event]);
}

// node_modules/preact/dist/preact.mjs
var n;
var l;
var u;
var t;
var i;
var r;
var o;
var e;
var f;
var c;
var s;
var a;
var h;
var p = {};
var v = [];
var y = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
var w = Array.isArray;
function d(n3, l4) {
  for (var u4 in l4) n3[u4] = l4[u4];
  return n3;
}
function g(n3) {
  n3 && n3.parentNode && n3.parentNode.removeChild(n3);
}
function m(n3, t4, i4, r4, o4) {
  var e4 = { type: n3, props: t4, key: i4, ref: r4, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o4 ? ++u : o4, __i: -1, __u: 0 };
  return null == o4 && null != l.vnode && l.vnode(e4), e4;
}
function k(n3) {
  return n3.children;
}
function x(n3, l4) {
  this.props = n3, this.context = l4;
}
function S(n3, l4) {
  if (null == l4) return n3.__ ? S(n3.__, n3.__i + 1) : null;
  for (var u4; l4 < n3.__k.length; l4++) if (null != (u4 = n3.__k[l4]) && null != u4.__e) return u4.__e;
  return "function" == typeof n3.type ? S(n3) : null;
}
function C(n3) {
  var l4, u4;
  if (null != (n3 = n3.__) && null != n3.__c) {
    for (n3.__e = n3.__c.base = null, l4 = 0; l4 < n3.__k.length; l4++) if (null != (u4 = n3.__k[l4]) && null != u4.__e) {
      n3.__e = n3.__c.base = u4.__e;
      break;
    }
    return C(n3);
  }
}
function M(n3) {
  (!n3.__d && (n3.__d = true) && i.push(n3) && !$.__r++ || r != l.debounceRendering) && ((r = l.debounceRendering) || o)($);
}
function $() {
  for (var n3, u4, t4, r4, o4, f4, c4, s4 = 1; i.length; ) i.length > s4 && i.sort(e), n3 = i.shift(), s4 = i.length, n3.__d && (t4 = void 0, o4 = (r4 = (u4 = n3).__v).__e, f4 = [], c4 = [], u4.__P && ((t4 = d({}, r4)).__v = r4.__v + 1, l.vnode && l.vnode(t4), O(u4.__P, t4, r4, u4.__n, u4.__P.namespaceURI, 32 & r4.__u ? [o4] : null, f4, null == o4 ? S(r4) : o4, !!(32 & r4.__u), c4), t4.__v = r4.__v, t4.__.__k[t4.__i] = t4, z(f4, t4, c4), t4.__e != o4 && C(t4)));
  $.__r = 0;
}
function I(n3, l4, u4, t4, i4, r4, o4, e4, f4, c4, s4) {
  var a4, h4, y5, w4, d4, g4, _3 = t4 && t4.__k || v, m3 = l4.length;
  for (f4 = P(u4, l4, _3, f4, m3), a4 = 0; a4 < m3; a4++) null != (y5 = u4.__k[a4]) && (h4 = -1 == y5.__i ? p : _3[y5.__i] || p, y5.__i = a4, g4 = O(n3, y5, h4, i4, r4, o4, e4, f4, c4, s4), w4 = y5.__e, y5.ref && h4.ref != y5.ref && (h4.ref && q(h4.ref, null, y5), s4.push(y5.ref, y5.__c || w4, y5)), null == d4 && null != w4 && (d4 = w4), 4 & y5.__u || h4.__k === y5.__k ? f4 = A(y5, f4, n3) : "function" == typeof y5.type && void 0 !== g4 ? f4 = g4 : w4 && (f4 = w4.nextSibling), y5.__u &= -7);
  return u4.__e = d4, f4;
}
function P(n3, l4, u4, t4, i4) {
  var r4, o4, e4, f4, c4, s4 = u4.length, a4 = s4, h4 = 0;
  for (n3.__k = new Array(i4), r4 = 0; r4 < i4; r4++) null != (o4 = l4[r4]) && "boolean" != typeof o4 && "function" != typeof o4 ? (f4 = r4 + h4, (o4 = n3.__k[r4] = "string" == typeof o4 || "number" == typeof o4 || "bigint" == typeof o4 || o4.constructor == String ? m(null, o4, null, null, null) : w(o4) ? m(k, { children: o4 }, null, null, null) : null == o4.constructor && o4.__b > 0 ? m(o4.type, o4.props, o4.key, o4.ref ? o4.ref : null, o4.__v) : o4).__ = n3, o4.__b = n3.__b + 1, e4 = null, -1 != (c4 = o4.__i = L(o4, u4, f4, a4)) && (a4--, (e4 = u4[c4]) && (e4.__u |= 2)), null == e4 || null == e4.__v ? (-1 == c4 && (i4 > s4 ? h4-- : i4 < s4 && h4++), "function" != typeof o4.type && (o4.__u |= 4)) : c4 != f4 && (c4 == f4 - 1 ? h4-- : c4 == f4 + 1 ? h4++ : (c4 > f4 ? h4-- : h4++, o4.__u |= 4))) : n3.__k[r4] = null;
  if (a4) for (r4 = 0; r4 < s4; r4++) null != (e4 = u4[r4]) && 0 == (2 & e4.__u) && (e4.__e == t4 && (t4 = S(e4)), B(e4, e4));
  return t4;
}
function A(n3, l4, u4) {
  var t4, i4;
  if ("function" == typeof n3.type) {
    for (t4 = n3.__k, i4 = 0; t4 && i4 < t4.length; i4++) t4[i4] && (t4[i4].__ = n3, l4 = A(t4[i4], l4, u4));
    return l4;
  }
  n3.__e != l4 && (l4 && n3.type && !u4.contains(l4) && (l4 = S(n3)), u4.insertBefore(n3.__e, l4 || null), l4 = n3.__e);
  do {
    l4 = l4 && l4.nextSibling;
  } while (null != l4 && 8 == l4.nodeType);
  return l4;
}
function L(n3, l4, u4, t4) {
  var i4, r4, o4 = n3.key, e4 = n3.type, f4 = l4[u4];
  if (null === f4 && null == n3.key || f4 && o4 == f4.key && e4 == f4.type && 0 == (2 & f4.__u)) return u4;
  if (t4 > (null != f4 && 0 == (2 & f4.__u) ? 1 : 0)) for (i4 = u4 - 1, r4 = u4 + 1; i4 >= 0 || r4 < l4.length; ) {
    if (i4 >= 0) {
      if ((f4 = l4[i4]) && 0 == (2 & f4.__u) && o4 == f4.key && e4 == f4.type) return i4;
      i4--;
    }
    if (r4 < l4.length) {
      if ((f4 = l4[r4]) && 0 == (2 & f4.__u) && o4 == f4.key && e4 == f4.type) return r4;
      r4++;
    }
  }
  return -1;
}
function T(n3, l4, u4) {
  "-" == l4[0] ? n3.setProperty(l4, null == u4 ? "" : u4) : n3[l4] = null == u4 ? "" : "number" != typeof u4 || y.test(l4) ? u4 : u4 + "px";
}
function j(n3, l4, u4, t4, i4) {
  var r4, o4;
  n: if ("style" == l4) if ("string" == typeof u4) n3.style.cssText = u4;
  else {
    if ("string" == typeof t4 && (n3.style.cssText = t4 = ""), t4) for (l4 in t4) u4 && l4 in u4 || T(n3.style, l4, "");
    if (u4) for (l4 in u4) t4 && u4[l4] == t4[l4] || T(n3.style, l4, u4[l4]);
  }
  else if ("o" == l4[0] && "n" == l4[1]) r4 = l4 != (l4 = l4.replace(f, "$1")), o4 = l4.toLowerCase(), l4 = o4 in n3 || "onFocusOut" == l4 || "onFocusIn" == l4 ? o4.slice(2) : l4.slice(2), n3.l || (n3.l = {}), n3.l[l4 + r4] = u4, u4 ? t4 ? u4.u = t4.u : (u4.u = c, n3.addEventListener(l4, r4 ? a : s, r4)) : n3.removeEventListener(l4, r4 ? a : s, r4);
  else {
    if ("http://www.w3.org/2000/svg" == i4) l4 = l4.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if ("width" != l4 && "height" != l4 && "href" != l4 && "list" != l4 && "form" != l4 && "tabIndex" != l4 && "download" != l4 && "rowSpan" != l4 && "colSpan" != l4 && "role" != l4 && "popover" != l4 && l4 in n3) try {
      n3[l4] = null == u4 ? "" : u4;
      break n;
    } catch (n4) {
    }
    "function" == typeof u4 || (null == u4 || false === u4 && "-" != l4[4] ? n3.removeAttribute(l4) : n3.setAttribute(l4, "popover" == l4 && 1 == u4 ? "" : u4));
  }
}
function F(n3) {
  return function(u4) {
    if (this.l) {
      var t4 = this.l[u4.type + n3];
      if (null == u4.t) u4.t = c++;
      else if (u4.t < t4.u) return;
      return t4(l.event ? l.event(u4) : u4);
    }
  };
}
function O(n3, u4, t4, i4, r4, o4, e4, f4, c4, s4) {
  var a4, h4, p5, v5, y5, _3, m3, b3, S2, C3, M2, $2, P2, A3, H, L2, T4, j3 = u4.type;
  if (null != u4.constructor) return null;
  128 & t4.__u && (c4 = !!(32 & t4.__u), o4 = [f4 = u4.__e = t4.__e]), (a4 = l.__b) && a4(u4);
  n: if ("function" == typeof j3) try {
    if (b3 = u4.props, S2 = "prototype" in j3 && j3.prototype.render, C3 = (a4 = j3.contextType) && i4[a4.__c], M2 = a4 ? C3 ? C3.props.value : a4.__ : i4, t4.__c ? m3 = (h4 = u4.__c = t4.__c).__ = h4.__E : (S2 ? u4.__c = h4 = new j3(b3, M2) : (u4.__c = h4 = new x(b3, M2), h4.constructor = j3, h4.render = D), C3 && C3.sub(h4), h4.props = b3, h4.state || (h4.state = {}), h4.context = M2, h4.__n = i4, p5 = h4.__d = true, h4.__h = [], h4._sb = []), S2 && null == h4.__s && (h4.__s = h4.state), S2 && null != j3.getDerivedStateFromProps && (h4.__s == h4.state && (h4.__s = d({}, h4.__s)), d(h4.__s, j3.getDerivedStateFromProps(b3, h4.__s))), v5 = h4.props, y5 = h4.state, h4.__v = u4, p5) S2 && null == j3.getDerivedStateFromProps && null != h4.componentWillMount && h4.componentWillMount(), S2 && null != h4.componentDidMount && h4.__h.push(h4.componentDidMount);
    else {
      if (S2 && null == j3.getDerivedStateFromProps && b3 !== v5 && null != h4.componentWillReceiveProps && h4.componentWillReceiveProps(b3, M2), !h4.__e && null != h4.shouldComponentUpdate && false === h4.shouldComponentUpdate(b3, h4.__s, M2) || u4.__v == t4.__v) {
        for (u4.__v != t4.__v && (h4.props = b3, h4.state = h4.__s, h4.__d = false), u4.__e = t4.__e, u4.__k = t4.__k, u4.__k.some(function(n4) {
          n4 && (n4.__ = u4);
        }), $2 = 0; $2 < h4._sb.length; $2++) h4.__h.push(h4._sb[$2]);
        h4._sb = [], h4.__h.length && e4.push(h4);
        break n;
      }
      null != h4.componentWillUpdate && h4.componentWillUpdate(b3, h4.__s, M2), S2 && null != h4.componentDidUpdate && h4.__h.push(function() {
        h4.componentDidUpdate(v5, y5, _3);
      });
    }
    if (h4.context = M2, h4.props = b3, h4.__P = n3, h4.__e = false, P2 = l.__r, A3 = 0, S2) {
      for (h4.state = h4.__s, h4.__d = false, P2 && P2(u4), a4 = h4.render(h4.props, h4.state, h4.context), H = 0; H < h4._sb.length; H++) h4.__h.push(h4._sb[H]);
      h4._sb = [];
    } else do {
      h4.__d = false, P2 && P2(u4), a4 = h4.render(h4.props, h4.state, h4.context), h4.state = h4.__s;
    } while (h4.__d && ++A3 < 25);
    h4.state = h4.__s, null != h4.getChildContext && (i4 = d(d({}, i4), h4.getChildContext())), S2 && !p5 && null != h4.getSnapshotBeforeUpdate && (_3 = h4.getSnapshotBeforeUpdate(v5, y5)), L2 = a4, null != a4 && a4.type === k && null == a4.key && (L2 = N(a4.props.children)), f4 = I(n3, w(L2) ? L2 : [L2], u4, t4, i4, r4, o4, e4, f4, c4, s4), h4.base = u4.__e, u4.__u &= -161, h4.__h.length && e4.push(h4), m3 && (h4.__E = h4.__ = null);
  } catch (n4) {
    if (u4.__v = null, c4 || null != o4) if (n4.then) {
      for (u4.__u |= c4 ? 160 : 128; f4 && 8 == f4.nodeType && f4.nextSibling; ) f4 = f4.nextSibling;
      o4[o4.indexOf(f4)] = null, u4.__e = f4;
    } else for (T4 = o4.length; T4--; ) g(o4[T4]);
    else u4.__e = t4.__e, u4.__k = t4.__k;
    l.__e(n4, u4, t4);
  }
  else null == o4 && u4.__v == t4.__v ? (u4.__k = t4.__k, u4.__e = t4.__e) : f4 = u4.__e = V(t4.__e, u4, t4, i4, r4, o4, e4, c4, s4);
  return (a4 = l.diffed) && a4(u4), 128 & u4.__u ? void 0 : f4;
}
function z(n3, u4, t4) {
  for (var i4 = 0; i4 < t4.length; i4++) q(t4[i4], t4[++i4], t4[++i4]);
  l.__c && l.__c(u4, n3), n3.some(function(u5) {
    try {
      n3 = u5.__h, u5.__h = [], n3.some(function(n4) {
        n4.call(u5);
      });
    } catch (n4) {
      l.__e(n4, u5.__v);
    }
  });
}
function N(n3) {
  return "object" != typeof n3 || null == n3 || n3.__b && n3.__b > 0 ? n3 : w(n3) ? n3.map(N) : d({}, n3);
}
function V(u4, t4, i4, r4, o4, e4, f4, c4, s4) {
  var a4, h4, v5, y5, d4, _3, m3, b3 = i4.props, k3 = t4.props, x2 = t4.type;
  if ("svg" == x2 ? o4 = "http://www.w3.org/2000/svg" : "math" == x2 ? o4 = "http://www.w3.org/1998/Math/MathML" : o4 || (o4 = "http://www.w3.org/1999/xhtml"), null != e4) {
    for (a4 = 0; a4 < e4.length; a4++) if ((d4 = e4[a4]) && "setAttribute" in d4 == !!x2 && (x2 ? d4.localName == x2 : 3 == d4.nodeType)) {
      u4 = d4, e4[a4] = null;
      break;
    }
  }
  if (null == u4) {
    if (null == x2) return document.createTextNode(k3);
    u4 = document.createElementNS(o4, x2, k3.is && k3), c4 && (l.__m && l.__m(t4, e4), c4 = false), e4 = null;
  }
  if (null == x2) b3 === k3 || c4 && u4.data == k3 || (u4.data = k3);
  else {
    if (e4 = e4 && n.call(u4.childNodes), b3 = i4.props || p, !c4 && null != e4) for (b3 = {}, a4 = 0; a4 < u4.attributes.length; a4++) b3[(d4 = u4.attributes[a4]).name] = d4.value;
    for (a4 in b3) if (d4 = b3[a4], "children" == a4) ;
    else if ("dangerouslySetInnerHTML" == a4) v5 = d4;
    else if (!(a4 in k3)) {
      if ("value" == a4 && "defaultValue" in k3 || "checked" == a4 && "defaultChecked" in k3) continue;
      j(u4, a4, null, d4, o4);
    }
    for (a4 in k3) d4 = k3[a4], "children" == a4 ? y5 = d4 : "dangerouslySetInnerHTML" == a4 ? h4 = d4 : "value" == a4 ? _3 = d4 : "checked" == a4 ? m3 = d4 : c4 && "function" != typeof d4 || b3[a4] === d4 || j(u4, a4, d4, b3[a4], o4);
    if (h4) c4 || v5 && (h4.__html == v5.__html || h4.__html == u4.innerHTML) || (u4.innerHTML = h4.__html), t4.__k = [];
    else if (v5 && (u4.innerHTML = ""), I("template" == t4.type ? u4.content : u4, w(y5) ? y5 : [y5], t4, i4, r4, "foreignObject" == x2 ? "http://www.w3.org/1999/xhtml" : o4, e4, f4, e4 ? e4[0] : i4.__k && S(i4, 0), c4, s4), null != e4) for (a4 = e4.length; a4--; ) g(e4[a4]);
    c4 || (a4 = "value", "progress" == x2 && null == _3 ? u4.removeAttribute("value") : null != _3 && (_3 !== u4[a4] || "progress" == x2 && !_3 || "option" == x2 && _3 != b3[a4]) && j(u4, a4, _3, b3[a4], o4), a4 = "checked", null != m3 && m3 != u4[a4] && j(u4, a4, m3, b3[a4], o4));
  }
  return u4;
}
function q(n3, u4, t4) {
  try {
    if ("function" == typeof n3) {
      var i4 = "function" == typeof n3.__u;
      i4 && n3.__u(), i4 && null == u4 || (n3.__u = n3(u4));
    } else n3.current = u4;
  } catch (n4) {
    l.__e(n4, t4);
  }
}
function B(n3, u4, t4) {
  var i4, r4;
  if (l.unmount && l.unmount(n3), (i4 = n3.ref) && (i4.current && i4.current != n3.__e || q(i4, null, u4)), null != (i4 = n3.__c)) {
    if (i4.componentWillUnmount) try {
      i4.componentWillUnmount();
    } catch (n4) {
      l.__e(n4, u4);
    }
    i4.base = i4.__P = null;
  }
  if (i4 = n3.__k) for (r4 = 0; r4 < i4.length; r4++) i4[r4] && B(i4[r4], u4, t4 || "function" != typeof n3.type);
  t4 || g(n3.__e), n3.__c = n3.__ = n3.__e = void 0;
}
function D(n3, l4, u4) {
  return this.constructor(n3, u4);
}
n = v.slice, l = { __e: function(n3, l4, u4, t4) {
  for (var i4, r4, o4; l4 = l4.__; ) if ((i4 = l4.__c) && !i4.__) try {
    if ((r4 = i4.constructor) && null != r4.getDerivedStateFromError && (i4.setState(r4.getDerivedStateFromError(n3)), o4 = i4.__d), null != i4.componentDidCatch && (i4.componentDidCatch(n3, t4 || {}), o4 = i4.__d), o4) return i4.__E = i4;
  } catch (l5) {
    n3 = l5;
  }
  throw n3;
} }, u = 0, t = function(n3) {
  return null != n3 && null == n3.constructor;
}, x.prototype.setState = function(n3, l4) {
  var u4;
  u4 = null != this.__s && this.__s != this.state ? this.__s : this.__s = d({}, this.state), "function" == typeof n3 && (n3 = n3(d({}, u4), this.props)), n3 && d(u4, n3), null != n3 && this.__v && (l4 && this._sb.push(l4), M(this));
}, x.prototype.forceUpdate = function(n3) {
  this.__v && (this.__e = true, n3 && this.__h.push(n3), M(this));
}, x.prototype.render = k, i = [], o = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n3, l4) {
  return n3.__v.__b - l4.__v.__b;
}, $.__r = 0, f = /(PointerCapture)$|Capture$/i, c = 0, s = F(false), a = F(true), h = 0;

// node_modules/preact/hooks/dist/hooks.mjs
var t2;
var r2;
var u2;
var i2;
var o2 = 0;
var f2 = [];
var c2 = l;
var e2 = c2.__b;
var a2 = c2.__r;
var v2 = c2.diffed;
var l2 = c2.__c;
var m2 = c2.unmount;
var s2 = c2.__;
function p2(n3, t4) {
  c2.__h && c2.__h(r2, n3, o2 || t4), o2 = 0;
  var u4 = r2.__H || (r2.__H = { __: [], __h: [] });
  return n3 >= u4.__.length && u4.__.push({}), u4.__[n3];
}
function T2(n3, r4) {
  var u4 = p2(t2++, 7);
  return C2(u4.__H, r4) && (u4.__ = n3(), u4.__H = r4, u4.__h = n3), u4.__;
}
function j2() {
  for (var n3; n3 = f2.shift(); ) if (n3.__P && n3.__H) try {
    n3.__H.__h.forEach(z2), n3.__H.__h.forEach(B2), n3.__H.__h = [];
  } catch (t4) {
    n3.__H.__h = [], c2.__e(t4, n3.__v);
  }
}
c2.__b = function(n3) {
  r2 = null, e2 && e2(n3);
}, c2.__ = function(n3, t4) {
  n3 && t4.__k && t4.__k.__m && (n3.__m = t4.__k.__m), s2 && s2(n3, t4);
}, c2.__r = function(n3) {
  a2 && a2(n3), t2 = 0;
  var i4 = (r2 = n3.__c).__H;
  i4 && (u2 === r2 ? (i4.__h = [], r2.__h = [], i4.__.forEach(function(n4) {
    n4.__N && (n4.__ = n4.__N), n4.u = n4.__N = void 0;
  })) : (i4.__h.forEach(z2), i4.__h.forEach(B2), i4.__h = [], t2 = 0)), u2 = r2;
}, c2.diffed = function(n3) {
  v2 && v2(n3);
  var t4 = n3.__c;
  t4 && t4.__H && (t4.__H.__h.length && (1 !== f2.push(t4) && i2 === c2.requestAnimationFrame || ((i2 = c2.requestAnimationFrame) || w2)(j2)), t4.__H.__.forEach(function(n4) {
    n4.u && (n4.__H = n4.u), n4.u = void 0;
  })), u2 = r2 = null;
}, c2.__c = function(n3, t4) {
  t4.some(function(n4) {
    try {
      n4.__h.forEach(z2), n4.__h = n4.__h.filter(function(n5) {
        return !n5.__ || B2(n5);
      });
    } catch (r4) {
      t4.some(function(n5) {
        n5.__h && (n5.__h = []);
      }), t4 = [], c2.__e(r4, n4.__v);
    }
  }), l2 && l2(n3, t4);
}, c2.unmount = function(n3) {
  m2 && m2(n3);
  var t4, r4 = n3.__c;
  r4 && r4.__H && (r4.__H.__.forEach(function(n4) {
    try {
      z2(n4);
    } catch (n5) {
      t4 = n5;
    }
  }), r4.__H = void 0, t4 && c2.__e(t4, r4.__v));
};
var k2 = "function" == typeof requestAnimationFrame;
function w2(n3) {
  var t4, r4 = function() {
    clearTimeout(u4), k2 && cancelAnimationFrame(t4), setTimeout(n3);
  }, u4 = setTimeout(r4, 35);
  k2 && (t4 = requestAnimationFrame(r4));
}
function z2(n3) {
  var t4 = r2, u4 = n3.__c;
  "function" == typeof u4 && (n3.__c = void 0, u4()), r2 = t4;
}
function B2(n3) {
  var t4 = r2;
  n3.__c = n3.__(), r2 = t4;
}
function C2(n3, t4) {
  return !n3 || n3.length !== t4.length || t4.some(function(t5, r4) {
    return t5 !== n3[r4];
  });
}

// node_modules/@preact/signals-core/dist/signals-core.mjs
var i3 = Symbol.for("preact-signals");
function t3() {
  if (r3 > 1) {
    r3--;
    return;
  }
  let i4, t4 = false;
  while (void 0 !== s3) {
    let o4 = s3;
    s3 = void 0;
    f3++;
    while (void 0 !== o4) {
      const n3 = o4.o;
      o4.o = void 0;
      o4.f &= -3;
      if (!(8 & o4.f) && v3(o4)) try {
        o4.c();
      } catch (o5) {
        if (!t4) {
          i4 = o5;
          t4 = true;
        }
      }
      o4 = n3;
    }
  }
  f3 = 0;
  r3--;
  if (t4) throw i4;
}
function o3(i4) {
  if (r3 > 0) return i4();
  r3++;
  try {
    return i4();
  } finally {
    t3();
  }
}
var n2;
var s3;
function h2(i4) {
  const t4 = n2;
  n2 = void 0;
  try {
    return i4();
  } finally {
    n2 = t4;
  }
}
var r3 = 0;
var f3 = 0;
var e3 = 0;
function c3(i4) {
  if (void 0 === n2) return;
  let t4 = i4.n;
  if (void 0 === t4 || t4.t !== n2) {
    t4 = { i: 0, S: i4, p: n2.s, n: void 0, t: n2, e: void 0, x: void 0, r: t4 };
    if (void 0 !== n2.s) n2.s.n = t4;
    n2.s = t4;
    i4.n = t4;
    if (32 & n2.f) i4.S(t4);
    return t4;
  } else if (-1 === t4.i) {
    t4.i = 0;
    if (void 0 !== t4.n) {
      t4.n.p = t4.p;
      if (void 0 !== t4.p) t4.p.n = t4.n;
      t4.p = n2.s;
      t4.n = void 0;
      n2.s.n = t4;
      n2.s = t4;
    }
    return t4;
  }
}
function u3(i4, t4) {
  this.v = i4;
  this.i = 0;
  this.n = void 0;
  this.t = void 0;
  this.W = null == t4 ? void 0 : t4.watched;
  this.Z = null == t4 ? void 0 : t4.unwatched;
}
u3.prototype.brand = i3;
u3.prototype.h = function() {
  return true;
};
u3.prototype.S = function(i4) {
  const t4 = this.t;
  if (t4 !== i4 && void 0 === i4.e) {
    i4.x = t4;
    this.t = i4;
    if (void 0 !== t4) t4.e = i4;
    else h2(() => {
      var i5;
      null == (i5 = this.W) || i5.call(this);
    });
  }
};
u3.prototype.U = function(i4) {
  if (void 0 !== this.t) {
    const t4 = i4.e, o4 = i4.x;
    if (void 0 !== t4) {
      t4.x = o4;
      i4.e = void 0;
    }
    if (void 0 !== o4) {
      o4.e = t4;
      i4.x = void 0;
    }
    if (i4 === this.t) {
      this.t = o4;
      if (void 0 === o4) h2(() => {
        var i5;
        null == (i5 = this.Z) || i5.call(this);
      });
    }
  }
};
u3.prototype.subscribe = function(i4) {
  return E(() => {
    const t4 = this.value, o4 = n2;
    n2 = void 0;
    try {
      i4(t4);
    } finally {
      n2 = o4;
    }
  });
};
u3.prototype.valueOf = function() {
  return this.value;
};
u3.prototype.toString = function() {
  return this.value + "";
};
u3.prototype.toJSON = function() {
  return this.value;
};
u3.prototype.peek = function() {
  const i4 = n2;
  n2 = void 0;
  try {
    return this.value;
  } finally {
    n2 = i4;
  }
};
Object.defineProperty(u3.prototype, "value", { get() {
  const i4 = c3(this);
  if (void 0 !== i4) i4.i = this.i;
  return this.v;
}, set(i4) {
  if (i4 !== this.v) {
    if (f3 > 100) throw new Error("Cycle detected");
    this.v = i4;
    this.i++;
    e3++;
    r3++;
    try {
      for (let i5 = this.t; void 0 !== i5; i5 = i5.x) i5.t.N();
    } finally {
      t3();
    }
  }
} });
function d2(i4, t4) {
  return new u3(i4, t4);
}
function v3(i4) {
  for (let t4 = i4.s; void 0 !== t4; t4 = t4.n) if (t4.S.i !== t4.i || !t4.S.h() || t4.S.i !== t4.i) return true;
  return false;
}
function l3(i4) {
  for (let t4 = i4.s; void 0 !== t4; t4 = t4.n) {
    const o4 = t4.S.n;
    if (void 0 !== o4) t4.r = o4;
    t4.S.n = t4;
    t4.i = -1;
    if (void 0 === t4.n) {
      i4.s = t4;
      break;
    }
  }
}
function y2(i4) {
  let t4, o4 = i4.s;
  while (void 0 !== o4) {
    const i5 = o4.p;
    if (-1 === o4.i) {
      o4.S.U(o4);
      if (void 0 !== i5) i5.n = o4.n;
      if (void 0 !== o4.n) o4.n.p = i5;
    } else t4 = o4;
    o4.S.n = o4.r;
    if (void 0 !== o4.r) o4.r = void 0;
    o4 = i5;
  }
  i4.s = t4;
}
function a3(i4, t4) {
  u3.call(this, void 0);
  this.x = i4;
  this.s = void 0;
  this.g = e3 - 1;
  this.f = 4;
  this.W = null == t4 ? void 0 : t4.watched;
  this.Z = null == t4 ? void 0 : t4.unwatched;
}
a3.prototype = new u3();
a3.prototype.h = function() {
  this.f &= -3;
  if (1 & this.f) return false;
  if (32 == (36 & this.f)) return true;
  this.f &= -5;
  if (this.g === e3) return true;
  this.g = e3;
  this.f |= 1;
  if (this.i > 0 && !v3(this)) {
    this.f &= -2;
    return true;
  }
  const i4 = n2;
  try {
    l3(this);
    n2 = this;
    const i5 = this.x();
    if (16 & this.f || this.v !== i5 || 0 === this.i) {
      this.v = i5;
      this.f &= -17;
      this.i++;
    }
  } catch (i5) {
    this.v = i5;
    this.f |= 16;
    this.i++;
  }
  n2 = i4;
  y2(this);
  this.f &= -2;
  return true;
};
a3.prototype.S = function(i4) {
  if (void 0 === this.t) {
    this.f |= 36;
    for (let i5 = this.s; void 0 !== i5; i5 = i5.n) i5.S.S(i5);
  }
  u3.prototype.S.call(this, i4);
};
a3.prototype.U = function(i4) {
  if (void 0 !== this.t) {
    u3.prototype.U.call(this, i4);
    if (void 0 === this.t) {
      this.f &= -33;
      for (let i5 = this.s; void 0 !== i5; i5 = i5.n) i5.S.U(i5);
    }
  }
};
a3.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 6;
    for (let i4 = this.t; void 0 !== i4; i4 = i4.x) i4.t.N();
  }
};
Object.defineProperty(a3.prototype, "value", { get() {
  if (1 & this.f) throw new Error("Cycle detected");
  const i4 = c3(this);
  this.h();
  if (void 0 !== i4) i4.i = this.i;
  if (16 & this.f) throw this.v;
  return this.v;
} });
function w3(i4, t4) {
  return new a3(i4, t4);
}
function _(i4) {
  const o4 = i4.u;
  i4.u = void 0;
  if ("function" == typeof o4) {
    r3++;
    const s4 = n2;
    n2 = void 0;
    try {
      o4();
    } catch (t4) {
      i4.f &= -2;
      i4.f |= 8;
      g2(i4);
      throw t4;
    } finally {
      n2 = s4;
      t3();
    }
  }
}
function g2(i4) {
  for (let t4 = i4.s; void 0 !== t4; t4 = t4.n) t4.S.U(t4);
  i4.x = void 0;
  i4.s = void 0;
  _(i4);
}
function p3(i4) {
  if (n2 !== this) throw new Error("Out-of-order effect");
  y2(this);
  n2 = i4;
  this.f &= -2;
  if (8 & this.f) g2(this);
  t3();
}
function b(i4) {
  this.x = i4;
  this.u = void 0;
  this.s = void 0;
  this.o = void 0;
  this.f = 32;
}
b.prototype.c = function() {
  const i4 = this.S();
  try {
    if (8 & this.f) return;
    if (void 0 === this.x) return;
    const t4 = this.x();
    if ("function" == typeof t4) this.u = t4;
  } finally {
    i4();
  }
};
b.prototype.S = function() {
  if (1 & this.f) throw new Error("Cycle detected");
  this.f |= 1;
  this.f &= -9;
  _(this);
  l3(this);
  r3++;
  const i4 = n2;
  n2 = this;
  return p3.bind(this, i4);
};
b.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 2;
    this.o = s3;
    s3 = this;
  }
};
b.prototype.d = function() {
  this.f |= 8;
  if (!(1 & this.f)) g2(this);
};
b.prototype.dispose = function() {
  this.d();
};
function E(i4) {
  const t4 = new b(i4);
  try {
    t4.c();
  } catch (i5) {
    t4.d();
    throw i5;
  }
  return t4.d.bind(t4);
}

// node_modules/@preact/signals/dist/signals.mjs
var h3;
var d3;
var p4;
var _2 = [];
E(function() {
  h3 = this.N;
})();
function v4(t4, e4) {
  l[t4] = e4.bind(null, l[t4] || (() => {
  }));
}
function g3(t4) {
  if (p4) p4();
  p4 = t4 && t4.S();
}
function b2({ data: t4 }) {
  const i4 = useSignal(t4);
  i4.value = t4;
  const [n3, f4] = T2(() => {
    let t5 = this, n4 = this.__v;
    while (n4 = n4.__) if (n4.__c) {
      n4.__c.__$f |= 4;
      break;
    }
    const o4 = w3(() => {
      let t6 = i4.value.value;
      return 0 === t6 ? 0 : true === t6 ? "" : t6 || "";
    }), f5 = w3(() => !Array.isArray(o4.value) && !t(o4.value)), r4 = E(function() {
      this.N = T3;
      if (f5.value) {
        const i5 = o4.value;
        if (t5.__v && t5.__v.__e && 3 === t5.__v.__e.nodeType) t5.__v.__e.data = i5;
      }
    }), u4 = this.__$u.d;
    this.__$u.d = function() {
      r4();
      u4.call(this);
    };
    return [f5, o4];
  }, []);
  return n3.value ? f4.peek() : f4.value;
}
b2.displayName = "_st";
Object.defineProperties(u3.prototype, { constructor: { configurable: true, value: void 0 }, type: { configurable: true, value: b2 }, props: { configurable: true, get() {
  return { data: this };
} }, __b: { configurable: true, value: 1 } });
v4("__b", (t4, i4) => {
  if ("string" == typeof i4.type) {
    let t5, e4 = i4.props;
    for (let n3 in e4) {
      if ("children" === n3) continue;
      let o4 = e4[n3];
      if (o4 instanceof u3) {
        if (!t5) i4.__np = t5 = {};
        t5[n3] = o4;
        e4[n3] = o4.peek();
      }
    }
  }
  t4(i4);
});
v4("__r", (t4, i4) => {
  if (i4.type !== k) {
    g3();
    let t5, e4 = i4.__c;
    if (e4) {
      e4.__$f &= -2;
      t5 = e4.__$u;
      if (void 0 === t5) e4.__$u = t5 = function(t6) {
        let i5;
        E(function() {
          i5 = this;
        });
        i5.c = () => {
          e4.__$f |= 1;
          e4.setState({});
        };
        return i5;
      }();
    }
    d3 = e4;
    g3(t5);
  }
  t4(i4);
});
v4("__e", (t4, i4, e4, n3) => {
  g3();
  d3 = void 0;
  t4(i4, e4, n3);
});
v4("diffed", (t4, i4) => {
  g3();
  d3 = void 0;
  let e4;
  if ("string" == typeof i4.type && (e4 = i4.__e)) {
    let t5 = i4.__np, n3 = i4.props;
    if (t5) {
      let i5 = e4.U;
      if (i5) for (let e5 in i5) {
        let n4 = i5[e5];
        if (void 0 !== n4 && !(e5 in t5)) {
          n4.d();
          i5[e5] = void 0;
        }
      }
      else {
        i5 = {};
        e4.U = i5;
      }
      for (let o4 in t5) {
        let f4 = i5[o4], r4 = t5[o4];
        if (void 0 === f4) {
          f4 = y4(e4, o4, r4, n3);
          i5[o4] = f4;
        } else f4.o(r4, n3);
      }
    }
  }
  t4(i4);
});
function y4(t4, i4, e4, n3) {
  const o4 = i4 in t4 && void 0 === t4.ownerSVGElement, f4 = d2(e4);
  return { o: (t5, i5) => {
    f4.value = t5;
    n3 = i5;
  }, d: E(function() {
    this.N = T3;
    const e5 = f4.value.value;
    if (n3[i4] !== e5) {
      n3[i4] = e5;
      if (o4) t4[i4] = e5;
      else if (e5) t4.setAttribute(i4, e5);
      else t4.removeAttribute(i4);
    }
  }) };
}
v4("unmount", (t4, i4) => {
  if ("string" == typeof i4.type) {
    let t5 = i4.__e;
    if (t5) {
      const i5 = t5.U;
      if (i5) {
        t5.U = void 0;
        for (let t6 in i5) {
          let e4 = i5[t6];
          if (e4) e4.d();
        }
      }
    }
  } else {
    let t5 = i4.__c;
    if (t5) {
      const i5 = t5.__$u;
      if (i5) {
        t5.__$u = void 0;
        i5.d();
      }
    }
  }
  t4(i4);
});
v4("__h", (t4, i4, e4, n3) => {
  if (n3 < 3 || 9 === n3) i4.__$f |= 2;
  t4(i4, e4, n3);
});
x.prototype.shouldComponentUpdate = function(t4, i4) {
  const e4 = this.__$u, n3 = e4 && void 0 !== e4.s;
  for (let t5 in i4) return true;
  if (this.__f || "boolean" == typeof this.u && true === this.u) {
    const t5 = 2 & this.__$f;
    if (!(n3 || t5 || 4 & this.__$f)) return true;
    if (1 & this.__$f) return true;
  } else {
    if (!(n3 || 4 & this.__$f)) return true;
    if (3 & this.__$f) return true;
  }
  for (let i5 in t4) if ("__source" !== i5 && t4[i5] !== this.props[i5]) return true;
  for (let i5 in this.props) if (!(i5 in t4)) return true;
  return false;
};
function useSignal(t4, i4) {
  return T2(() => d2(t4, i4), []);
}
var q2 = (t4) => {
  queueMicrotask(() => {
    queueMicrotask(t4);
  });
};
function F2() {
  o3(() => {
    let t4;
    while (t4 = _2.shift()) h3.call(t4);
  });
}
function T3() {
  if (1 === _2.push(this)) (l.requestAnimationFrame || q2)(F2);
}

// src/utils/constants.ts
var RIPPLE_BRAND = Symbol("signal");
var isBatching = false;
var dirtyStores = /* @__PURE__ */ new Set();
var proxyCache = /* @__PURE__ */ new WeakMap();
var IS_RIPPLE_PROXY = Symbol("isRippleProxy");

// src/utils/ripplePrimitive.ts
function ripplePrimitive(initial) {
  let _value = initial;
  const subscribers = /* @__PURE__ */ new Set();
  const subscribe = (callback, selector = (v5) => v5) => {
    const sub = { callback, selector, prevValue: selector(_value) };
    subscribers.add(sub);
    return () => subscribers.delete(sub);
  };
  return {
    get value() {
      return _value;
    },
    set value(val) {
      if (Object.is(_value, val)) return;
      _value = val;
      for (const sub of subscribers) {
        const next = sub.selector(_value);
        if (!Object.is(next, sub.prevValue)) {
          sub.prevValue = next;
          sub.callback();
        }
      }
    },
    subscribe,
    peek: () => _value,
    brand: RIPPLE_BRAND
  };
}

// src/utils/createProxy.ts
function isObject(value) {
  return typeof value === "object" && value !== null;
}
function createProxy(target, notify) {
  if (target[IS_RIPPLE_PROXY]) return target;
  const cached = proxyCache.get(target);
  if (cached) return cached;
  const proxy = new Proxy(target, {
    get(obj, key, receiver) {
      const val = Reflect.get(obj, key, receiver);
      if (isObject(val) && !(RIPPLE_BRAND in val)) {
        if (!proxyCache.has(val)) {
          const nestedProxy = createProxy(val, notify);
          proxyCache.set(val, nestedProxy);
          return nestedProxy;
        }
        return proxyCache.get(val);
      }
      return val;
    },
    set(obj, key, value) {
      const old = obj[key];
      const newVal = isObject(value) && !(RIPPLE_BRAND in value) ? createProxy(value, notify) : value;
      const res = Reflect.set(obj, key, newVal);
      if (!Object.is(old, newVal)) notify();
      return res;
    },
    deleteProperty(obj, key) {
      const res = Reflect.deleteProperty(obj, key);
      notify();
      return res;
    }
  });
  Object.defineProperty(proxy, IS_RIPPLE_PROXY, {
    value: true,
    enumerable: false
  });
  proxyCache.set(target, proxy);
  return proxy;
}

// src/utils/rippleObject.ts
function rippleObject(initial) {
  let raw = initial;
  let proxyValue = createProxy(initial, notify);
  const subs = /* @__PURE__ */ new Set();
  function notify() {
    if (isBatching) {
      dirtyStores.add(notify);
      return;
    }
    for (const s4 of subs) {
      const next = s4.sel(proxyValue);
      if (!Object.is(next, s4.prev)) {
        s4.prev = next;
        s4.cb();
      }
    }
  }
  const subscribe = (cb, sel = (v5) => v5) => {
    const sub = { cb, sel, prev: sel(proxyValue) };
    subs.add(sub);
    return () => subs.delete(sub);
  };
  return {
    get value() {
      return proxyValue;
    },
    set value(v5) {
      if (Object.is(raw, v5)) return;
      raw = v5;
      proxyValue = createProxy(v5, notify);
      notify();
    },
    subscribe,
    peek: () => proxyValue,
    brand: RIPPLE_BRAND
  };
}

// src/utils/rippleProxy.ts
function rippleProxy(target) {
  const listeners = /* @__PURE__ */ new Set();
  const notify = () => {
    if (isBatching) dirtyStores.add(notify);
    else listeners.forEach((l4) => l4());
  };
  const proxy = createProxy(target, notify);
  return {
    value: proxy,
    peek: () => proxy,
    subscribe: (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    brand: RIPPLE_BRAND
  };
}

// src/core/ripple.ts
var ripple = function(initial) {
  return isObject2(initial) ? rippleObject(initial) : ripplePrimitive(initial);
};
function isObject2(value) {
  return typeof value === "object" && value !== null || Array.isArray(value);
}
Object.assign(ripple, {
  proxy: rippleProxy,
  primitive: ripplePrimitive,
  object: rippleObject
});

// src/core/useRipple.ts
import { useSyncExternalStore } from "react";
function useRipple(ripple2, selector = (v5) => v5) {
  return useSyncExternalStore(
    (cb) => ripple2.subscribe(cb, selector),
    () => selector(ripple2.value),
    () => selector(ripple2.peek())
  );
}
export {
  emit,
  on,
  ripple,
  useRipple,
  useRippleEffect
};
