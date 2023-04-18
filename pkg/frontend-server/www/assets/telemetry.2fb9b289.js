import {
  c as qo,
  d as Ns,
  n as Jo,
  a as Qo,
  b as ta,
} from "./nats.7a9bc554.js";
import { u as ea } from "./index.ce1beb90.js";
import {
  d as ia,
  r as Cn,
  z as na,
  s as Gs,
  b as Xs,
  A as Ws,
  c as Rn,
  e as $,
  F as sa,
  B as ra,
  g as Tn,
  i as oa,
  t as jt,
  o as In,
} from "./vendor.3e0c1cd0.js";
class aa {
  constructor(t) {
    this.propagationStopped,
      this.defaultPrevented,
      (this.type = t),
      (this.target = null);
  }
  preventDefault() {
    this.defaultPrevented = !0;
  }
  stopPropagation() {
    this.propagationStopped = !0;
  }
}
const Bt = aa,
  We = { PROPERTYCHANGE: "propertychange" };
class la {
  constructor() {
    this.disposed = !1;
  }
  dispose() {
    this.disposed || ((this.disposed = !0), this.disposeInternal());
  }
  disposeInternal() {}
}
const Jn = la;
function ze(s, t) {
  return s > t ? 1 : s < t ? -1 : 0;
}
function Qn(s, t, e) {
  const i = s.length;
  if (s[0] <= t) return 0;
  if (t <= s[i - 1]) return i - 1;
  let n;
  if (e > 0) {
    for (n = 1; n < i; ++n) if (s[n] < t) return n - 1;
  } else if (e < 0) {
    for (n = 1; n < i; ++n) if (s[n] <= t) return n;
  } else
    for (n = 1; n < i; ++n) {
      if (s[n] == t) return n;
      if (s[n] < t)
        return typeof e == "function"
          ? e(t, s[n - 1], s[n]) > 0
            ? n - 1
            : n
          : s[n - 1] - t < t - s[n]
          ? n - 1
          : n;
    }
  return i - 1;
}
function ha(s, t, e) {
  for (; t < e; ) {
    const i = s[t];
    (s[t] = s[e]), (s[e] = i), ++t, --e;
  }
}
function Fr(s, t) {
  const e = Array.isArray(t) ? t : [t],
    i = e.length;
  for (let n = 0; n < i; n++) s[s.length] = e[n];
}
function oe(s, t) {
  const e = s.length;
  if (e !== t.length) return !1;
  for (let i = 0; i < e; i++) if (s[i] !== t[i]) return !1;
  return !0;
}
function ca(s, t, e) {
  const i = t || ze;
  return s.every(function (n, r) {
    if (r === 0) return !0;
    const o = i(s[r - 1], n);
    return !(o > 0 || (e && o === 0));
  });
}
function ni() {
  return !0;
}
function nn() {
  return !1;
}
function Ye() {}
function ua(s) {
  let t = !1,
    e,
    i,
    n;
  return function () {
    const r = Array.prototype.slice.call(arguments);
    return (
      (!t || this !== n || !oe(r, i)) &&
        ((t = !0), (n = this), (i = r), (e = s.apply(this, arguments))),
      e
    );
  };
}
function pi(s) {
  for (const t in s) delete s[t];
}
function si(s) {
  let t;
  for (t in s) return !1;
  return !t;
}
class da extends Jn {
  constructor(t) {
    super(),
      (this.eventTarget_ = t),
      (this.pendingRemovals_ = null),
      (this.dispatching_ = null),
      (this.listeners_ = null);
  }
  addEventListener(t, e) {
    if (!t || !e) return;
    const i = this.listeners_ || (this.listeners_ = {}),
      n = i[t] || (i[t] = []);
    n.includes(e) || n.push(e);
  }
  dispatchEvent(t) {
    const e = typeof t == "string",
      i = e ? t : t.type,
      n = this.listeners_ && this.listeners_[i];
    if (!n) return;
    const r = e ? new Bt(t) : t;
    r.target || (r.target = this.eventTarget_ || this);
    const o = this.dispatching_ || (this.dispatching_ = {}),
      a = this.pendingRemovals_ || (this.pendingRemovals_ = {});
    i in o || ((o[i] = 0), (a[i] = 0)), ++o[i];
    let l;
    for (let h = 0, c = n.length; h < c; ++h)
      if (
        ("handleEvent" in n[h]
          ? (l = n[h].handleEvent(r))
          : (l = n[h].call(this, r)),
        l === !1 || r.propagationStopped)
      ) {
        l = !1;
        break;
      }
    if (--o[i] === 0) {
      let h = a[i];
      for (delete a[i]; h--; ) this.removeEventListener(i, Ye);
      delete o[i];
    }
    return l;
  }
  disposeInternal() {
    this.listeners_ && pi(this.listeners_);
  }
  getListeners(t) {
    return (this.listeners_ && this.listeners_[t]) || void 0;
  }
  hasListener(t) {
    return this.listeners_
      ? t
        ? t in this.listeners_
        : Object.keys(this.listeners_).length > 0
      : !1;
  }
  removeEventListener(t, e) {
    const i = this.listeners_ && this.listeners_[t];
    if (i) {
      const n = i.indexOf(e);
      n !== -1 &&
        (this.pendingRemovals_ && t in this.pendingRemovals_
          ? ((i[n] = Ye), ++this.pendingRemovals_[t])
          : (i.splice(n, 1), i.length === 0 && delete this.listeners_[t]));
    }
  }
}
const sn = da,
  F = {
    CHANGE: "change",
    ERROR: "error",
    BLUR: "blur",
    CLEAR: "clear",
    CONTEXTMENU: "contextmenu",
    CLICK: "click",
    DBLCLICK: "dblclick",
    DRAGENTER: "dragenter",
    DRAGOVER: "dragover",
    DROP: "drop",
    FOCUS: "focus",
    KEYDOWN: "keydown",
    KEYPRESS: "keypress",
    LOAD: "load",
    RESIZE: "resize",
    TOUCHMOVE: "touchmove",
    WHEEL: "wheel",
  };
function W(s, t, e, i, n) {
  if ((i && i !== s && (e = e.bind(i)), n)) {
    const o = e;
    e = function () {
      s.removeEventListener(t, e), o.apply(this, arguments);
    };
  }
  const r = { target: s, type: t, listener: e };
  return s.addEventListener(t, e), r;
}
function Bi(s, t, e, i) {
  return W(s, t, e, i, !0);
}
function j(s) {
  s && s.target && (s.target.removeEventListener(s.type, s.listener), pi(s));
}
class rn extends sn {
  constructor() {
    super(),
      (this.on = this.onInternal),
      (this.once = this.onceInternal),
      (this.un = this.unInternal),
      (this.revision_ = 0);
  }
  changed() {
    ++this.revision_, this.dispatchEvent(F.CHANGE);
  }
  getRevision() {
    return this.revision_;
  }
  onInternal(t, e) {
    if (Array.isArray(t)) {
      const i = t.length,
        n = new Array(i);
      for (let r = 0; r < i; ++r) n[r] = W(this, t[r], e);
      return n;
    }
    return W(this, t, e);
  }
  onceInternal(t, e) {
    let i;
    if (Array.isArray(t)) {
      const n = t.length;
      i = new Array(n);
      for (let r = 0; r < n; ++r) i[r] = Bi(this, t[r], e);
    } else i = Bi(this, t, e);
    return (e.ol_key = i), i;
  }
  unInternal(t, e) {
    const i = e.ol_key;
    if (i) fa(i);
    else if (Array.isArray(t))
      for (let n = 0, r = t.length; n < r; ++n)
        this.removeEventListener(t[n], e);
    else this.removeEventListener(t, e);
  }
}
rn.prototype.on;
rn.prototype.once;
rn.prototype.un;
function fa(s) {
  if (Array.isArray(s)) for (let t = 0, e = s.length; t < e; ++t) j(s[t]);
  else j(s);
}
const kr = rn;
function X() {
  throw new Error("Unimplemented abstract method.");
}
let ga = 0;
function z(s) {
  return s.ol_uid || (s.ol_uid = String(++ga));
}
class zs extends Bt {
  constructor(t, e, i) {
    super(t), (this.key = e), (this.oldValue = i);
  }
}
class _a extends kr {
  constructor(t) {
    super(),
      this.on,
      this.once,
      this.un,
      z(this),
      (this.values_ = null),
      t !== void 0 && this.setProperties(t);
  }
  get(t) {
    let e;
    return (
      this.values_ && this.values_.hasOwnProperty(t) && (e = this.values_[t]), e
    );
  }
  getKeys() {
    return (this.values_ && Object.keys(this.values_)) || [];
  }
  getProperties() {
    return (this.values_ && Object.assign({}, this.values_)) || {};
  }
  hasProperties() {
    return !!this.values_;
  }
  notify(t, e) {
    let i;
    (i = `change:${t}`),
      this.hasListener(i) && this.dispatchEvent(new zs(i, t, e)),
      (i = We.PROPERTYCHANGE),
      this.hasListener(i) && this.dispatchEvent(new zs(i, t, e));
  }
  addChangeListener(t, e) {
    this.addEventListener(`change:${t}`, e);
  }
  removeChangeListener(t, e) {
    this.removeEventListener(`change:${t}`, e);
  }
  set(t, e, i) {
    const n = this.values_ || (this.values_ = {});
    if (i) n[t] = e;
    else {
      const r = n[t];
      (n[t] = e), r !== e && this.notify(t, r);
    }
  }
  setProperties(t, e) {
    for (const i in t) this.set(i, t[i], e);
  }
  applyProperties(t) {
    !t.values_ || Object.assign(this.values_ || (this.values_ = {}), t.values_);
  }
  unset(t, e) {
    if (this.values_ && t in this.values_) {
      const i = this.values_[t];
      delete this.values_[t],
        si(this.values_) && (this.values_ = null),
        e || this.notify(t, i);
    }
  }
}
const bt = _a,
  ma = {
    1: "The view center is not defined",
    2: "The view resolution is not defined",
    3: "The view rotation is not defined",
    4: "`image` and `src` cannot be provided at the same time",
    5: "`imgSize` must be set when `image` is provided",
    7: "`format` must be set when `url` is set",
    8: "Unknown `serverType` configured",
    9: "`url` must be configured or set using `#setUrl()`",
    10: "The default `geometryFunction` can only handle `Point` geometries",
    11: "`options.featureTypes` must be an Array",
    12: "`options.geometryName` must also be provided when `options.bbox` is set",
    13: "Invalid corner",
    14: "Invalid color",
    15: "Tried to get a value for a key that does not exist in the cache",
    16: "Tried to set a value for a key that is used already",
    17: "`resolutions` must be sorted in descending order",
    18: "Either `origin` or `origins` must be configured, never both",
    19: "Number of `tileSizes` and `resolutions` must be equal",
    20: "Number of `origins` and `resolutions` must be equal",
    22: "Either `tileSize` or `tileSizes` must be configured, never both",
    24: "Invalid extent or geometry provided as `geometry`",
    25: "Cannot fit empty extent provided as `geometry`",
    26: "Features must have an id set",
    27: "Features must have an id set",
    28: '`renderMode` must be `"hybrid"` or `"vector"`',
    30: "The passed `feature` was already added to the source",
    31: "Tried to enqueue an `element` that was already added to the queue",
    32: "Transformation matrix cannot be inverted",
    33: "Invalid units",
    34: "Invalid geometry layout",
    36: "Unknown SRS type",
    37: "Unknown geometry type found",
    38: "`styleMapValue` has an unknown type",
    39: "Unknown geometry type",
    40: "Expected `feature` to have a geometry",
    41: "Expected an `ol/style/Style` or an array of `ol/style/Style.js`",
    42: "Question unknown, the answer is 42",
    43: "Expected `layers` to be an array or a `Collection`",
    47: "Expected `controls` to be an array or an `ol/Collection`",
    48: "Expected `interactions` to be an array or an `ol/Collection`",
    49: "Expected `overlays` to be an array or an `ol/Collection`",
    50: "`options.featureTypes` should be an Array",
    51: "Either `url` or `tileJSON` options must be provided",
    52: "Unknown `serverType` configured",
    53: "Unknown `tierSizeCalculation` configured",
    55: "The {-y} placeholder requires a tile grid with extent",
    56: "mapBrowserEvent must originate from a pointer event",
    57: "At least 2 conditions are required",
    59: "Invalid command found in the PBF",
    60: "Missing or invalid `size`",
    61: "Cannot determine IIIF Image API version from provided image information JSON",
    62: "A `WebGLArrayBuffer` must either be of type `ELEMENT_ARRAY_BUFFER` or `ARRAY_BUFFER`",
    64: "Layer opacity must be a number",
    66: "`forEachFeatureAtCoordinate` cannot be used on a WebGL layer if the hit detection logic has not been enabled. This is done by providing adequate shaders using the `hitVertexShader` and `hitFragmentShader` properties of `WebGLPointsLayerRenderer`",
    67: "A layer can only be added to the map once. Use either `layer.setMap()` or `map.addLayer()`, not both",
    68: "A VectorTile source can only be rendered if it has a projection compatible with the view projection",
    69: "`width` or `height` cannot be provided together with `scale`",
  };
class pa extends Error {
  constructor(t) {
    const e = ma[t];
    super(e),
      (this.code = t),
      (this.name = "AssertionError"),
      (this.message = e);
  }
}
const Nr = pa;
function G(s, t) {
  if (!s) throw new Nr(t);
}
class ts extends bt {
  constructor(t) {
    if (
      (super(),
      this.on,
      this.once,
      this.un,
      (this.id_ = void 0),
      (this.geometryName_ = "geometry"),
      (this.style_ = null),
      (this.styleFunction_ = void 0),
      (this.geometryChangeKey_ = null),
      this.addChangeListener(this.geometryName_, this.handleGeometryChanged_),
      t)
    )
      if (typeof t.getSimplifiedGeometry == "function") {
        const e = t;
        this.setGeometry(e);
      } else {
        const e = t;
        this.setProperties(e);
      }
  }
  clone() {
    const t = new ts(this.hasProperties() ? this.getProperties() : null);
    t.setGeometryName(this.getGeometryName());
    const e = this.getGeometry();
    e && t.setGeometry(e.clone());
    const i = this.getStyle();
    return i && t.setStyle(i), t;
  }
  getGeometry() {
    return this.get(this.geometryName_);
  }
  getId() {
    return this.id_;
  }
  getGeometryName() {
    return this.geometryName_;
  }
  getStyle() {
    return this.style_;
  }
  getStyleFunction() {
    return this.styleFunction_;
  }
  handleGeometryChange_() {
    this.changed();
  }
  handleGeometryChanged_() {
    this.geometryChangeKey_ &&
      (j(this.geometryChangeKey_), (this.geometryChangeKey_ = null));
    const t = this.getGeometry();
    t &&
      (this.geometryChangeKey_ = W(
        t,
        F.CHANGE,
        this.handleGeometryChange_,
        this
      )),
      this.changed();
  }
  setGeometry(t) {
    this.set(this.geometryName_, t);
  }
  setStyle(t) {
    (this.style_ = t),
      (this.styleFunction_ = t ? ya(t) : void 0),
      this.changed();
  }
  setId(t) {
    (this.id_ = t), this.changed();
  }
  setGeometryName(t) {
    this.removeChangeListener(this.geometryName_, this.handleGeometryChanged_),
      (this.geometryName_ = t),
      this.addChangeListener(this.geometryName_, this.handleGeometryChanged_),
      this.handleGeometryChanged_();
  }
}
function ya(s) {
  if (typeof s == "function") return s;
  let t;
  return (
    Array.isArray(s)
      ? (t = s)
      : (G(typeof s.getZIndex == "function", 41), (t = [s])),
    function () {
      return t;
    }
  );
}
const xa = ts,
  se =
    typeof navigator < "u" && typeof navigator.userAgent < "u"
      ? navigator.userAgent.toLowerCase()
      : "",
  Ea = se.includes("firefox"),
  Ca = se.includes("safari") && !se.includes("chrom");
Ca &&
  (se.includes("version/15.4") ||
    /cpu (os|iphone os) 15_4 like mac os x/.test(se));
const Ra = se.includes("webkit") && !se.includes("edge"),
  Ta = se.includes("macintosh"),
  Gr = typeof devicePixelRatio < "u" ? devicePixelRatio : 1,
  es =
    typeof WorkerGlobalScope < "u" &&
    typeof OffscreenCanvas < "u" &&
    self instanceof WorkerGlobalScope,
  Ia = typeof Image < "u" && Image.prototype.decode,
  Xr = (function () {
    let s = !1;
    try {
      const t = Object.defineProperty({}, "passive", {
        get: function () {
          s = !0;
        },
      });
      window.addEventListener("_", null, t),
        window.removeEventListener("_", null, t);
    } catch {}
    return s;
  })();
new Array(6);
function Mt() {
  return [1, 0, 0, 1, 0, 0];
}
function Sa(s, t, e, i, n, r, o) {
  return (
    (s[0] = t), (s[1] = e), (s[2] = i), (s[3] = n), (s[4] = r), (s[5] = o), s
  );
}
function wa(s, t) {
  return (
    (s[0] = t[0]),
    (s[1] = t[1]),
    (s[2] = t[2]),
    (s[3] = t[3]),
    (s[4] = t[4]),
    (s[5] = t[5]),
    s
  );
}
function it(s, t) {
  const e = t[0],
    i = t[1];
  return (
    (t[0] = s[0] * e + s[2] * i + s[4]), (t[1] = s[1] * e + s[3] * i + s[5]), t
  );
}
function va(s, t, e) {
  return Sa(s, t, 0, 0, e, 0, 0);
}
function re(s, t, e, i, n, r, o, a) {
  const l = Math.sin(r),
    h = Math.cos(r);
  return (
    (s[0] = i * h),
    (s[1] = n * l),
    (s[2] = -i * l),
    (s[3] = n * h),
    (s[4] = o * i * h - a * i * l + t),
    (s[5] = o * n * l + a * n * h + e),
    s
  );
}
function is(s, t) {
  const e = La(t);
  G(e !== 0, 32);
  const i = t[0],
    n = t[1],
    r = t[2],
    o = t[3],
    a = t[4],
    l = t[5];
  return (
    (s[0] = o / e),
    (s[1] = -n / e),
    (s[2] = -r / e),
    (s[3] = i / e),
    (s[4] = (r * l - o * a) / e),
    (s[5] = -(i * l - n * a) / e),
    s
  );
}
function La(s) {
  return s[0] * s[3] - s[1] * s[2];
}
let Ys;
function Wr(s) {
  const t = "matrix(" + s.join(", ") + ")";
  if (es) return t;
  const e = Ys || (Ys = document.createElement("div"));
  return (e.style.transform = t), e.style.transform;
}
const et = {
  UNKNOWN: 0,
  INTERSECTING: 1,
  ABOVE: 2,
  RIGHT: 4,
  BELOW: 8,
  LEFT: 16,
};
function Bs(s) {
  const t = Tt();
  for (let e = 0, i = s.length; e < i; ++e) ti(t, s[e]);
  return t;
}
function ns(s, t, e) {
  return e
    ? ((e[0] = s[0] - t),
      (e[1] = s[1] - t),
      (e[2] = s[2] + t),
      (e[3] = s[3] + t),
      e)
    : [s[0] - t, s[1] - t, s[2] + t, s[3] + t];
}
function zr(s, t) {
  return t
    ? ((t[0] = s[0]), (t[1] = s[1]), (t[2] = s[2]), (t[3] = s[3]), t)
    : s.slice();
}
function Yr(s, t, e) {
  let i, n;
  return (
    t < s[0] ? (i = s[0] - t) : s[2] < t ? (i = t - s[2]) : (i = 0),
    e < s[1] ? (n = s[1] - e) : s[3] < e ? (n = e - s[3]) : (n = 0),
    i * i + n * n
  );
}
function on(s, t) {
  return Br(s, t[0], t[1]);
}
function Pe(s, t) {
  return s[0] <= t[0] && t[2] <= s[2] && s[1] <= t[1] && t[3] <= s[3];
}
function Br(s, t, e) {
  return s[0] <= t && t <= s[2] && s[1] <= e && e <= s[3];
}
function Gn(s, t) {
  const e = s[0],
    i = s[1],
    n = s[2],
    r = s[3],
    o = t[0],
    a = t[1];
  let l = et.UNKNOWN;
  return (
    o < e ? (l = l | et.LEFT) : o > n && (l = l | et.RIGHT),
    a < i ? (l = l | et.BELOW) : a > r && (l = l | et.ABOVE),
    l === et.UNKNOWN && (l = et.INTERSECTING),
    l
  );
}
function Tt() {
  return [1 / 0, 1 / 0, -1 / 0, -1 / 0];
}
function Yt(s, t, e, i, n) {
  return n ? ((n[0] = s), (n[1] = t), (n[2] = e), (n[3] = i), n) : [s, t, e, i];
}
function an(s) {
  return Yt(1 / 0, 1 / 0, -1 / 0, -1 / 0, s);
}
function Aa(s, t) {
  const e = s[0],
    i = s[1];
  return Yt(e, i, e, i, t);
}
function Ma(s, t, e, i, n) {
  const r = an(n);
  return Zr(r, s, t, e, i);
}
function ri(s, t) {
  return s[0] == t[0] && s[2] == t[2] && s[1] == t[1] && s[3] == t[3];
}
function Oa(s, t) {
  return (
    t[0] < s[0] && (s[0] = t[0]),
    t[2] > s[2] && (s[2] = t[2]),
    t[1] < s[1] && (s[1] = t[1]),
    t[3] > s[3] && (s[3] = t[3]),
    s
  );
}
function ti(s, t) {
  t[0] < s[0] && (s[0] = t[0]),
    t[0] > s[2] && (s[2] = t[0]),
    t[1] < s[1] && (s[1] = t[1]),
    t[1] > s[3] && (s[3] = t[1]);
}
function Zr(s, t, e, i, n) {
  for (; e < i; e += n) ba(s, t[e], t[e + 1]);
  return s;
}
function ba(s, t, e) {
  (s[0] = Math.min(s[0], t)),
    (s[1] = Math.min(s[1], e)),
    (s[2] = Math.max(s[2], t)),
    (s[3] = Math.max(s[3], e));
}
function Kr(s, t) {
  let e;
  return (
    (e = t(ln(s))),
    e || ((e = t(hn(s))), e) || ((e = t(cn(s))), e) || ((e = t(me(s))), e)
      ? e
      : !1
  );
}
function Xn(s) {
  let t = 0;
  return ss(s) || (t = U(s) * Ot(s)), t;
}
function ln(s) {
  return [s[0], s[1]];
}
function hn(s) {
  return [s[2], s[1]];
}
function Be(s) {
  return [(s[0] + s[2]) / 2, (s[1] + s[3]) / 2];
}
function Pa(s, t) {
  let e;
  return (
    t === "bottom-left"
      ? (e = ln(s))
      : t === "bottom-right"
      ? (e = hn(s))
      : t === "top-left"
      ? (e = me(s))
      : t === "top-right"
      ? (e = cn(s))
      : G(!1, 13),
    e
  );
}
function Wn(s, t, e, i, n) {
  const [r, o, a, l, h, c, u, d] = zn(s, t, e, i);
  return Yt(
    Math.min(r, a, h, u),
    Math.min(o, l, c, d),
    Math.max(r, a, h, u),
    Math.max(o, l, c, d),
    n
  );
}
function zn(s, t, e, i) {
  const n = (t * i[0]) / 2,
    r = (t * i[1]) / 2,
    o = Math.cos(e),
    a = Math.sin(e),
    l = n * o,
    h = n * a,
    c = r * o,
    u = r * a,
    d = s[0],
    f = s[1];
  return [
    d - l + u,
    f - h - c,
    d - l - u,
    f - h + c,
    d + l - u,
    f + h + c,
    d + l + u,
    f + h - c,
    d - l + u,
    f - h - c,
  ];
}
function Ot(s) {
  return s[3] - s[1];
}
function ei(s, t, e) {
  const i = e || Tt();
  return (
    at(s, t)
      ? (s[0] > t[0] ? (i[0] = s[0]) : (i[0] = t[0]),
        s[1] > t[1] ? (i[1] = s[1]) : (i[1] = t[1]),
        s[2] < t[2] ? (i[2] = s[2]) : (i[2] = t[2]),
        s[3] < t[3] ? (i[3] = s[3]) : (i[3] = t[3]))
      : an(i),
    i
  );
}
function me(s) {
  return [s[0], s[3]];
}
function cn(s) {
  return [s[2], s[3]];
}
function U(s) {
  return s[2] - s[0];
}
function at(s, t) {
  return s[0] <= t[2] && s[2] >= t[0] && s[1] <= t[3] && s[3] >= t[1];
}
function ss(s) {
  return s[2] < s[0] || s[3] < s[1];
}
function Da(s, t) {
  return t
    ? ((t[0] = s[0]), (t[1] = s[1]), (t[2] = s[2]), (t[3] = s[3]), t)
    : s;
}
function Fa(s, t, e) {
  let i = !1;
  const n = Gn(s, t),
    r = Gn(s, e);
  if (n === et.INTERSECTING || r === et.INTERSECTING) i = !0;
  else {
    const o = s[0],
      a = s[1],
      l = s[2],
      h = s[3],
      c = t[0],
      u = t[1],
      d = e[0],
      f = e[1],
      g = (f - u) / (d - c);
    let _, m;
    !!(r & et.ABOVE) &&
      !(n & et.ABOVE) &&
      ((_ = d - (f - h) / g), (i = _ >= o && _ <= l)),
      !i &&
        !!(r & et.RIGHT) &&
        !(n & et.RIGHT) &&
        ((m = f - (d - l) * g), (i = m >= a && m <= h)),
      !i &&
        !!(r & et.BELOW) &&
        !(n & et.BELOW) &&
        ((_ = d - (f - a) / g), (i = _ >= o && _ <= l)),
      !i &&
        !!(r & et.LEFT) &&
        !(n & et.LEFT) &&
        ((m = f - (d - o) * g), (i = m >= a && m <= h));
  }
  return i;
}
function Vr(s, t) {
  const e = t.getExtent(),
    i = Be(s);
  if (t.canWrapX() && (i[0] < e[0] || i[0] >= e[2])) {
    const n = U(e),
      o = Math.floor((i[0] - e[0]) / n) * n;
    (s[0] -= o), (s[2] -= o);
  }
  return s;
}
function ka(s, t) {
  if (t.canWrapX()) {
    const e = t.getExtent();
    if (!isFinite(s[0]) || !isFinite(s[2])) return [[e[0], s[1], e[2], s[3]]];
    Vr(s, t);
    const i = U(e);
    if (U(s) > i) return [[e[0], s[1], e[2], s[3]]];
    if (s[0] < e[0])
      return [
        [s[0] + i, s[1], e[2], s[3]],
        [e[0], s[1], s[2], s[3]],
      ];
    if (s[2] > e[2])
      return [
        [s[0], s[1], e[2], s[3]],
        [e[0], s[1], s[2] - i, s[3]],
      ];
  }
  return [s];
}
const oi = {
  radians: 6370997 / (2 * Math.PI),
  degrees: (2 * Math.PI * 6370997) / 360,
  ft: 0.3048,
  m: 1,
  "us-ft": 1200 / 3937,
};
class Na {
  constructor(t) {
    (this.code_ = t.code),
      (this.units_ = t.units),
      (this.extent_ = t.extent !== void 0 ? t.extent : null),
      (this.worldExtent_ = t.worldExtent !== void 0 ? t.worldExtent : null),
      (this.axisOrientation_ =
        t.axisOrientation !== void 0 ? t.axisOrientation : "enu"),
      (this.global_ = t.global !== void 0 ? t.global : !1),
      (this.canWrapX_ = !!(this.global_ && this.extent_)),
      (this.getPointResolutionFunc_ = t.getPointResolution),
      (this.defaultTileGrid_ = null),
      (this.metersPerUnit_ = t.metersPerUnit);
  }
  canWrapX() {
    return this.canWrapX_;
  }
  getCode() {
    return this.code_;
  }
  getExtent() {
    return this.extent_;
  }
  getUnits() {
    return this.units_;
  }
  getMetersPerUnit() {
    return this.metersPerUnit_ || oi[this.units_];
  }
  getWorldExtent() {
    return this.worldExtent_;
  }
  getAxisOrientation() {
    return this.axisOrientation_;
  }
  isGlobal() {
    return this.global_;
  }
  setGlobal(t) {
    (this.global_ = t), (this.canWrapX_ = !!(t && this.extent_));
  }
  getDefaultTileGrid() {
    return this.defaultTileGrid_;
  }
  setDefaultTileGrid(t) {
    this.defaultTileGrid_ = t;
  }
  setExtent(t) {
    (this.extent_ = t), (this.canWrapX_ = !!(this.global_ && t));
  }
  setWorldExtent(t) {
    this.worldExtent_ = t;
  }
  setGetPointResolution(t) {
    this.getPointResolutionFunc_ = t;
  }
  getPointResolutionFunc() {
    return this.getPointResolutionFunc_;
  }
}
const Ur = Na,
  yi = 6378137,
  De = Math.PI * yi,
  Ga = [-De, -De, De, De],
  Xa = [-180, -85, 180, 85],
  Oi = yi * Math.log(Math.tan(Math.PI / 2));
class Te extends Ur {
  constructor(t) {
    super({
      code: t,
      units: "m",
      extent: Ga,
      global: !0,
      worldExtent: Xa,
      getPointResolution: function (e, i) {
        return e / Math.cosh(i[1] / yi);
      },
    });
  }
}
const Zs = [
  new Te("EPSG:3857"),
  new Te("EPSG:102100"),
  new Te("EPSG:102113"),
  new Te("EPSG:900913"),
  new Te("http://www.opengis.net/def/crs/EPSG/0/3857"),
  new Te("http://www.opengis.net/gml/srs/epsg.xml#3857"),
];
function Wa(s, t, e) {
  const i = s.length;
  (e = e > 1 ? e : 2),
    t === void 0 && (e > 2 ? (t = s.slice()) : (t = new Array(i)));
  for (let n = 0; n < i; n += e) {
    t[n] = (De * s[n]) / 180;
    let r = yi * Math.log(Math.tan((Math.PI * (+s[n + 1] + 90)) / 360));
    r > Oi ? (r = Oi) : r < -Oi && (r = -Oi), (t[n + 1] = r);
  }
  return t;
}
function za(s, t, e) {
  const i = s.length;
  (e = e > 1 ? e : 2),
    t === void 0 && (e > 2 ? (t = s.slice()) : (t = new Array(i)));
  for (let n = 0; n < i; n += e)
    (t[n] = (180 * s[n]) / De),
      (t[n + 1] = (360 * Math.atan(Math.exp(s[n + 1] / yi))) / Math.PI - 90);
  return t;
}
const Ya = 6378137,
  Ks = [-180, -90, 180, 90],
  Ba = (Math.PI * Ya) / 180;
class le extends Ur {
  constructor(t, e) {
    super({
      code: t,
      units: "degrees",
      extent: Ks,
      axisOrientation: e,
      global: !0,
      metersPerUnit: Ba,
      worldExtent: Ks,
    });
  }
}
const Vs = [
  new le("CRS:84"),
  new le("EPSG:4326", "neu"),
  new le("urn:ogc:def:crs:OGC:1.3:CRS84"),
  new le("urn:ogc:def:crs:OGC:2:84"),
  new le("http://www.opengis.net/def/crs/OGC/1.3/CRS84"),
  new le("http://www.opengis.net/gml/srs/epsg.xml#4326", "neu"),
  new le("http://www.opengis.net/def/crs/EPSG/0/4326", "neu"),
];
let Yn = {};
function Za(s) {
  return (
    Yn[s] ||
    Yn[s.replace(/urn:(x-)?ogc:def:crs:EPSG:(.*:)?(\w+)$/, "EPSG:$3")] ||
    null
  );
}
function Ka(s, t) {
  Yn[s] = t;
}
let ke = {};
function Zi(s, t, e) {
  const i = s.getCode(),
    n = t.getCode();
  i in ke || (ke[i] = {}), (ke[i][n] = e);
}
function Va(s, t) {
  let e;
  return s in ke && t in ke[s] && (e = ke[s][t]), e;
}
function J(s, t, e) {
  return Math.min(Math.max(s, t), e);
}
function Ua(s, t, e, i, n, r) {
  const o = n - e,
    a = r - i;
  if (o !== 0 || a !== 0) {
    const l = ((s - e) * o + (t - i) * a) / (o * o + a * a);
    l > 1 ? ((e = n), (i = r)) : l > 0 && ((e += o * l), (i += a * l));
  }
  return Ne(s, t, e, i);
}
function Ne(s, t, e, i) {
  const n = e - s,
    r = i - t;
  return n * n + r * r;
}
function ja(s) {
  const t = s.length;
  for (let i = 0; i < t; i++) {
    let n = i,
      r = Math.abs(s[i][i]);
    for (let a = i + 1; a < t; a++) {
      const l = Math.abs(s[a][i]);
      l > r && ((r = l), (n = a));
    }
    if (r === 0) return null;
    const o = s[n];
    (s[n] = s[i]), (s[i] = o);
    for (let a = i + 1; a < t; a++) {
      const l = -s[a][i] / s[i][i];
      for (let h = i; h < t + 1; h++)
        i == h ? (s[a][h] = 0) : (s[a][h] += l * s[i][h]);
    }
  }
  const e = new Array(t);
  for (let i = t - 1; i >= 0; i--) {
    e[i] = s[i][t] / s[i][i];
    for (let n = i - 1; n >= 0; n--) s[n][t] -= s[n][i] * e[i];
  }
  return e;
}
function Yi(s) {
  return (s * Math.PI) / 180;
}
function Ge(s, t) {
  const e = s % t;
  return e * t < 0 ? e + t : e;
}
function Rt(s, t, e) {
  return s + e * (t - s);
}
function rs(s, t) {
  const e = Math.pow(10, t);
  return Math.round(s * e) / e;
}
function bi(s, t) {
  return Math.floor(rs(s, t));
}
function Pi(s, t) {
  return Math.ceil(rs(s, t));
}
function Ha(s, t) {
  return (s[0] += +t[0]), (s[1] += +t[1]), s;
}
function Ki(s, t) {
  let e = !0;
  for (let i = s.length - 1; i >= 0; --i)
    if (s[i] != t[i]) {
      e = !1;
      break;
    }
  return e;
}
function os(s, t) {
  const e = Math.cos(t),
    i = Math.sin(t),
    n = s[0] * e - s[1] * i,
    r = s[1] * e + s[0] * i;
  return (s[0] = n), (s[1] = r), s;
}
function $a(s, t) {
  return (s[0] *= t), (s[1] *= t), s;
}
function jr(s, t) {
  if (t.canWrapX()) {
    const e = U(t.getExtent()),
      i = qa(s, t, e);
    i && (s[0] -= i * e);
  }
  return s;
}
function qa(s, t, e) {
  const i = t.getExtent();
  let n = 0;
  return (
    t.canWrapX() &&
      (s[0] < i[0] || s[0] > i[2]) &&
      ((e = e || U(i)), (n = Math.floor((s[0] - i[0]) / e))),
    n
  );
}
const Ja = 63710088e-1;
function Us(s, t, e) {
  e = e || Ja;
  const i = Yi(s[1]),
    n = Yi(t[1]),
    r = (n - i) / 2,
    o = Yi(t[0] - s[0]) / 2,
    a =
      Math.sin(r) * Math.sin(r) +
      Math.sin(o) * Math.sin(o) * Math.cos(i) * Math.cos(n);
  return 2 * e * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
const Hr = { info: 1, warn: 2, error: 3, none: 4 };
let Qa = Hr.info;
function $r(...s) {
  Qa > Hr.warn || console.warn(...s);
}
let Bn = !0;
function qr(s) {
  Bn = !(s === void 0 ? !0 : s);
}
function as(s, t) {
  if (t !== void 0) {
    for (let e = 0, i = s.length; e < i; ++e) t[e] = s[e];
    t = t;
  } else t = s.slice();
  return t;
}
function Jr(s, t) {
  if (t !== void 0 && s !== t) {
    for (let e = 0, i = s.length; e < i; ++e) t[e] = s[e];
    s = t;
  }
  return s;
}
function tl(s) {
  Ka(s.getCode(), s), Zi(s, s, as);
}
function el(s) {
  s.forEach(tl);
}
function It(s) {
  return typeof s == "string" ? Za(s) : s || null;
}
function js(s, t, e, i) {
  s = It(s);
  let n;
  const r = s.getPointResolutionFunc();
  if (r) {
    if (((n = r(t, e)), i && i !== s.getUnits())) {
      const o = s.getMetersPerUnit();
      o && (n = (n * o) / oi[i]);
    }
  } else {
    const o = s.getUnits();
    if ((o == "degrees" && !i) || i == "degrees") n = t;
    else {
      const a = hs(s, It("EPSG:4326"));
      if (a === Jr && o !== "degrees") n = t * s.getMetersPerUnit();
      else {
        let h = [
          e[0] - t / 2,
          e[1],
          e[0] + t / 2,
          e[1],
          e[0],
          e[1] - t / 2,
          e[0],
          e[1] + t / 2,
        ];
        h = a(h, h, 2);
        const c = Us(h.slice(0, 2), h.slice(2, 4)),
          u = Us(h.slice(4, 6), h.slice(6, 8));
        n = (c + u) / 2;
      }
      const l = i ? oi[i] : s.getMetersPerUnit();
      l !== void 0 && (n /= l);
    }
  }
  return n;
}
function Hs(s) {
  el(s),
    s.forEach(function (t) {
      s.forEach(function (e) {
        t !== e && Zi(t, e, as);
      });
    });
}
function il(s, t, e, i) {
  s.forEach(function (n) {
    t.forEach(function (r) {
      Zi(n, r, e), Zi(r, n, i);
    });
  });
}
function ls(s, t) {
  if (s) {
    if (typeof s == "string") return It(s);
  } else return It(t);
  return s;
}
function $s(s, t) {
  return qr(), Qr(s, "EPSG:4326", t !== void 0 ? t : "EPSG:3857");
}
function Le(s, t) {
  if (s === t) return !0;
  const e = s.getUnits() === t.getUnits();
  return (s.getCode() === t.getCode() || hs(s, t) === as) && e;
}
function hs(s, t) {
  const e = s.getCode(),
    i = t.getCode();
  let n = Va(e, i);
  return n || (n = Jr), n;
}
function Vi(s, t) {
  const e = It(s),
    i = It(t);
  return hs(e, i);
}
function Qr(s, t, e) {
  return Vi(t, e)(s, void 0, s.length);
}
function Zn(s, t) {
  return s;
}
function Xt(s, t) {
  return (
    Bn &&
      !Ki(s, [0, 0]) &&
      s[0] >= -180 &&
      s[0] <= 180 &&
      s[1] >= -90 &&
      s[1] <= 90 &&
      ((Bn = !1),
      $r(
        "Call useGeographic() from ol/proj once to work with [longitude, latitude] coordinates."
      )),
    s
  );
}
function to(s, t) {
  return s;
}
function ue(s, t) {
  return s;
}
function nl() {
  Hs(Zs), Hs(Vs), il(Vs, Zs, Wa, za);
}
nl();
function _e(s, t, e, i, n, r) {
  r = r || [];
  let o = 0;
  for (let a = t; a < e; a += i) {
    const l = s[a],
      h = s[a + 1];
    (r[o++] = n[0] * l + n[2] * h + n[4]),
      (r[o++] = n[1] * l + n[3] * h + n[5]);
  }
  return r && r.length != o && (r.length = o), r;
}
function eo(s, t, e, i, n, r, o) {
  o = o || [];
  const a = Math.cos(n),
    l = Math.sin(n),
    h = r[0],
    c = r[1];
  let u = 0;
  for (let d = t; d < e; d += i) {
    const f = s[d] - h,
      g = s[d + 1] - c;
    (o[u++] = h + f * a - g * l), (o[u++] = c + f * l + g * a);
    for (let _ = d + 2; _ < d + i; ++_) o[u++] = s[_];
  }
  return o && o.length != u && (o.length = u), o;
}
function sl(s, t, e, i, n, r, o, a) {
  a = a || [];
  const l = o[0],
    h = o[1];
  let c = 0;
  for (let u = t; u < e; u += i) {
    const d = s[u] - l,
      f = s[u + 1] - h;
    (a[c++] = l + n * d), (a[c++] = h + r * f);
    for (let g = u + 2; g < u + i; ++g) a[c++] = s[g];
  }
  return a && a.length != c && (a.length = c), a;
}
function rl(s, t, e, i, n, r, o) {
  o = o || [];
  let a = 0;
  for (let l = t; l < e; l += i) {
    (o[a++] = s[l] + n), (o[a++] = s[l + 1] + r);
    for (let h = l + 2; h < l + i; ++h) o[a++] = s[h];
  }
  return o && o.length != a && (o.length = a), o;
}
const qs = Mt();
class ol extends bt {
  constructor() {
    super(),
      (this.extent_ = Tt()),
      (this.extentRevision_ = -1),
      (this.simplifiedGeometryMaxMinSquaredTolerance = 0),
      (this.simplifiedGeometryRevision = 0),
      (this.simplifyTransformedInternal = ua(function (t, e, i) {
        if (!i) return this.getSimplifiedGeometry(e);
        const n = this.clone();
        return n.applyTransform(i), n.getSimplifiedGeometry(e);
      }));
  }
  simplifyTransformed(t, e) {
    return this.simplifyTransformedInternal(this.getRevision(), t, e);
  }
  clone() {
    return X();
  }
  closestPointXY(t, e, i, n) {
    return X();
  }
  containsXY(t, e) {
    const i = this.getClosestPoint([t, e]);
    return i[0] === t && i[1] === e;
  }
  getClosestPoint(t, e) {
    return (e = e || [NaN, NaN]), this.closestPointXY(t[0], t[1], e, 1 / 0), e;
  }
  intersectsCoordinate(t) {
    return this.containsXY(t[0], t[1]);
  }
  computeExtent(t) {
    return X();
  }
  getExtent(t) {
    if (this.extentRevision_ != this.getRevision()) {
      const e = this.computeExtent(this.extent_);
      (isNaN(e[0]) || isNaN(e[1])) && an(e),
        (this.extentRevision_ = this.getRevision());
    }
    return Da(this.extent_, t);
  }
  rotate(t, e) {
    X();
  }
  scale(t, e, i) {
    X();
  }
  simplify(t) {
    return this.getSimplifiedGeometry(t * t);
  }
  getSimplifiedGeometry(t) {
    return X();
  }
  getType() {
    return X();
  }
  applyTransform(t) {
    X();
  }
  intersectsExtent(t) {
    return X();
  }
  translate(t, e) {
    X();
  }
  transform(t, e) {
    const i = It(t),
      n =
        i.getUnits() == "tile-pixels"
          ? function (r, o, a) {
              const l = i.getExtent(),
                h = i.getWorldExtent(),
                c = Ot(h) / Ot(l);
              return (
                re(qs, h[0], h[3], c, -c, 0, 0, 0),
                _e(r, 0, r.length, a, qs, o),
                Vi(i, e)(r, o, a)
              );
            }
          : Vi(i, e);
    return this.applyTransform(n), this;
  }
}
const al = ol;
class ll extends al {
  constructor() {
    super(),
      (this.layout = "XY"),
      (this.stride = 2),
      (this.flatCoordinates = null);
  }
  computeExtent(t) {
    return Ma(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t
    );
  }
  getCoordinates() {
    return X();
  }
  getFirstCoordinate() {
    return this.flatCoordinates.slice(0, this.stride);
  }
  getFlatCoordinates() {
    return this.flatCoordinates;
  }
  getLastCoordinate() {
    return this.flatCoordinates.slice(
      this.flatCoordinates.length - this.stride
    );
  }
  getLayout() {
    return this.layout;
  }
  getSimplifiedGeometry(t) {
    if (
      (this.simplifiedGeometryRevision !== this.getRevision() &&
        ((this.simplifiedGeometryMaxMinSquaredTolerance = 0),
        (this.simplifiedGeometryRevision = this.getRevision())),
      t < 0 ||
        (this.simplifiedGeometryMaxMinSquaredTolerance !== 0 &&
          t <= this.simplifiedGeometryMaxMinSquaredTolerance))
    )
      return this;
    const e = this.getSimplifiedGeometryInternal(t);
    return e.getFlatCoordinates().length < this.flatCoordinates.length
      ? e
      : ((this.simplifiedGeometryMaxMinSquaredTolerance = t), this);
  }
  getSimplifiedGeometryInternal(t) {
    return this;
  }
  getStride() {
    return this.stride;
  }
  setFlatCoordinates(t, e) {
    (this.stride = Js(t)), (this.layout = t), (this.flatCoordinates = e);
  }
  setCoordinates(t, e) {
    X();
  }
  setLayout(t, e, i) {
    let n;
    if (t) n = Js(t);
    else {
      for (let r = 0; r < i; ++r) {
        if (e.length === 0) {
          (this.layout = "XY"), (this.stride = 2);
          return;
        }
        e = e[0];
      }
      (n = e.length), (t = hl(n));
    }
    (this.layout = t), (this.stride = n);
  }
  applyTransform(t) {
    this.flatCoordinates &&
      (t(this.flatCoordinates, this.flatCoordinates, this.stride),
      this.changed());
  }
  rotate(t, e) {
    const i = this.getFlatCoordinates();
    if (i) {
      const n = this.getStride();
      eo(i, 0, i.length, n, t, e, i), this.changed();
    }
  }
  scale(t, e, i) {
    e === void 0 && (e = t), i || (i = Be(this.getExtent()));
    const n = this.getFlatCoordinates();
    if (n) {
      const r = this.getStride();
      sl(n, 0, n.length, r, t, e, i, n), this.changed();
    }
  }
  translate(t, e) {
    const i = this.getFlatCoordinates();
    if (i) {
      const n = this.getStride();
      rl(i, 0, i.length, n, t, e, i), this.changed();
    }
  }
}
function hl(s) {
  let t;
  return s == 2 ? (t = "XY") : s == 3 ? (t = "XYZ") : s == 4 && (t = "XYZM"), t;
}
function Js(s) {
  let t;
  return (
    s == "XY"
      ? (t = 2)
      : s == "XYZ" || s == "XYM"
      ? (t = 3)
      : s == "XYZM" && (t = 4),
    t
  );
}
function cl(s, t, e) {
  const i = s.getFlatCoordinates();
  if (!i) return null;
  const n = s.getStride();
  return _e(i, 0, i.length, n, t, e);
}
const cs = ll;
function ul(s, t, e, i) {
  for (let n = 0, r = e.length; n < r; ++n) s[t++] = e[n];
  return t;
}
function io(s, t, e, i) {
  for (let n = 0, r = e.length; n < r; ++n) {
    const o = e[n];
    for (let a = 0; a < i; ++a) s[t++] = o[a];
  }
  return t;
}
function dl(s, t, e, i, n) {
  n = n || [];
  let r = 0;
  for (let o = 0, a = e.length; o < a; ++o) {
    const l = io(s, t, e[o], i);
    (n[r++] = l), (t = l);
  }
  return (n.length = r), n;
}
function Qs(s, t, e, i, n, r, o) {
  const a = s[t],
    l = s[t + 1],
    h = s[e] - a,
    c = s[e + 1] - l;
  let u;
  if (h === 0 && c === 0) u = t;
  else {
    const d = ((n - a) * h + (r - l) * c) / (h * h + c * c);
    if (d > 1) u = e;
    else if (d > 0) {
      for (let f = 0; f < i; ++f) o[f] = Rt(s[t + f], s[e + f], d);
      o.length = i;
      return;
    } else u = t;
  }
  for (let d = 0; d < i; ++d) o[d] = s[u + d];
  o.length = i;
}
function no(s, t, e, i, n) {
  let r = s[t],
    o = s[t + 1];
  for (t += i; t < e; t += i) {
    const a = s[t],
      l = s[t + 1],
      h = Ne(r, o, a, l);
    h > n && (n = h), (r = a), (o = l);
  }
  return n;
}
function fl(s, t, e, i, n) {
  for (let r = 0, o = e.length; r < o; ++r) {
    const a = e[r];
    (n = no(s, t, a, i, n)), (t = a);
  }
  return n;
}
function so(s, t, e, i, n, r, o, a, l, h, c) {
  if (t == e) return h;
  let u, d;
  if (n === 0) {
    if (((d = Ne(o, a, s[t], s[t + 1])), d < h)) {
      for (u = 0; u < i; ++u) l[u] = s[t + u];
      return (l.length = i), d;
    }
    return h;
  }
  c = c || [NaN, NaN];
  let f = t + i;
  for (; f < e; )
    if ((Qs(s, f - i, f, i, o, a, c), (d = Ne(o, a, c[0], c[1])), d < h)) {
      for (h = d, u = 0; u < i; ++u) l[u] = c[u];
      (l.length = i), (f += i);
    } else f += i * Math.max(((Math.sqrt(d) - Math.sqrt(h)) / n) | 0, 1);
  if (r && (Qs(s, e - i, t, i, o, a, c), (d = Ne(o, a, c[0], c[1])), d < h)) {
    for (h = d, u = 0; u < i; ++u) l[u] = c[u];
    l.length = i;
  }
  return h;
}
function gl(s, t, e, i, n, r, o, a, l, h, c) {
  c = c || [NaN, NaN];
  for (let u = 0, d = e.length; u < d; ++u) {
    const f = e[u];
    (h = so(s, t, f, i, n, r, o, a, l, h, c)), (t = f);
  }
  return h;
}
function _l(s, t, e, i, n, r, o) {
  const a = (e - t) / i;
  if (a < 3) {
    for (; t < e; t += i) (r[o++] = s[t]), (r[o++] = s[t + 1]);
    return o;
  }
  const l = new Array(a);
  (l[0] = 1), (l[a - 1] = 1);
  const h = [t, e - i];
  let c = 0;
  for (; h.length > 0; ) {
    const u = h.pop(),
      d = h.pop();
    let f = 0;
    const g = s[d],
      _ = s[d + 1],
      m = s[u],
      p = s[u + 1];
    for (let y = d + i; y < u; y += i) {
      const x = s[y],
        E = s[y + 1],
        C = Ua(x, E, g, _, m, p);
      C > f && ((c = y), (f = C));
    }
    f > n &&
      ((l[(c - t) / i] = 1),
      d + i < c && h.push(d, c),
      c + i < u && h.push(c, u));
  }
  for (let u = 0; u < a; ++u)
    l[u] && ((r[o++] = s[t + u * i]), (r[o++] = s[t + u * i + 1]));
  return o;
}
function ce(s, t) {
  return t * Math.round(s / t);
}
function ml(s, t, e, i, n, r, o) {
  if (t == e) return o;
  let a = ce(s[t], n),
    l = ce(s[t + 1], n);
  (t += i), (r[o++] = a), (r[o++] = l);
  let h, c;
  do
    if (((h = ce(s[t], n)), (c = ce(s[t + 1], n)), (t += i), t == e))
      return (r[o++] = h), (r[o++] = c), o;
  while (h == a && c == l);
  for (; t < e; ) {
    const u = ce(s[t], n),
      d = ce(s[t + 1], n);
    if (((t += i), u == h && d == c)) continue;
    const f = h - a,
      g = c - l,
      _ = u - a,
      m = d - l;
    if (
      f * m == g * _ &&
      ((f < 0 && _ < f) || f == _ || (f > 0 && _ > f)) &&
      ((g < 0 && m < g) || g == m || (g > 0 && m > g))
    ) {
      (h = u), (c = d);
      continue;
    }
    (r[o++] = h), (r[o++] = c), (a = h), (l = c), (h = u), (c = d);
  }
  return (r[o++] = h), (r[o++] = c), o;
}
function pl(s, t, e, i, n, r, o, a) {
  for (let l = 0, h = e.length; l < h; ++l) {
    const c = e[l];
    (o = ml(s, t, c, i, n, r, o)), a.push(o), (t = c);
  }
  return o;
}
function Fe(s, t, e, i, n) {
  n = n !== void 0 ? n : [];
  let r = 0;
  for (let o = t; o < e; o += i) n[r++] = s.slice(o, o + i);
  return (n.length = r), n;
}
function Ui(s, t, e, i, n) {
  n = n !== void 0 ? n : [];
  let r = 0;
  for (let o = 0, a = e.length; o < a; ++o) {
    const l = e[o];
    (n[r++] = Fe(s, t, l, i, n[r])), (t = l);
  }
  return (n.length = r), n;
}
function tr(s, t, e, i, n) {
  n = n !== void 0 ? n : [];
  let r = 0;
  for (let o = 0, a = e.length; o < a; ++o) {
    const l = e[o];
    (n[r++] = l.length === 1 && l[0] === t ? [] : Ui(s, t, l, i, n[r])),
      (t = l[l.length - 1]);
  }
  return (n.length = r), n;
}
function ro(s, t, e, i) {
  let n = 0,
    r = s[e - i],
    o = s[e - i + 1];
  for (; t < e; t += i) {
    const a = s[t],
      l = s[t + 1];
    (n += o * a - r * l), (r = a), (o = l);
  }
  return n / 2;
}
function yl(s, t, e, i) {
  let n = 0;
  for (let r = 0, o = e.length; r < o; ++r) {
    const a = e[r];
    (n += ro(s, t, a, i)), (t = a);
  }
  return n;
}
class ji extends cs {
  constructor(t, e) {
    super(),
      (this.maxDelta_ = -1),
      (this.maxDeltaRevision_ = -1),
      e !== void 0 && !Array.isArray(t[0])
        ? this.setFlatCoordinates(e, t)
        : this.setCoordinates(t, e);
  }
  clone() {
    return new ji(this.flatCoordinates.slice(), this.layout);
  }
  closestPointXY(t, e, i, n) {
    return n < Yr(this.getExtent(), t, e)
      ? n
      : (this.maxDeltaRevision_ != this.getRevision() &&
          ((this.maxDelta_ = Math.sqrt(
            no(
              this.flatCoordinates,
              0,
              this.flatCoordinates.length,
              this.stride,
              0
            )
          )),
          (this.maxDeltaRevision_ = this.getRevision())),
        so(
          this.flatCoordinates,
          0,
          this.flatCoordinates.length,
          this.stride,
          this.maxDelta_,
          !0,
          t,
          e,
          i,
          n
        ));
  }
  getArea() {
    return ro(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride
    );
  }
  getCoordinates() {
    return Fe(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride
    );
  }
  getSimplifiedGeometryInternal(t) {
    const e = [];
    return (
      (e.length = _l(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        t,
        e,
        0
      )),
      new ji(e, "XY")
    );
  }
  getType() {
    return "LinearRing";
  }
  intersectsExtent(t) {
    return !1;
  }
  setCoordinates(t, e) {
    this.setLayout(e, t, 1),
      this.flatCoordinates || (this.flatCoordinates = []),
      (this.flatCoordinates.length = io(
        this.flatCoordinates,
        0,
        t,
        this.stride
      )),
      this.changed();
  }
}
const er = ji;
function xl(s, t, e, i, n) {
  let r;
  for (t += i; t < e; t += i)
    if (((r = n(s.slice(t - i, t), s.slice(t, t + i))), r)) return r;
  return !1;
}
function El(s, t, e, i, n) {
  return !Kr(n, function (o) {
    return !de(s, t, e, i, o[0], o[1]);
  });
}
function de(s, t, e, i, n, r) {
  let o = 0,
    a = s[e - i],
    l = s[e - i + 1];
  for (; t < e; t += i) {
    const h = s[t],
      c = s[t + 1];
    l <= r
      ? c > r && (h - a) * (r - l) - (n - a) * (c - l) > 0 && o++
      : c <= r && (h - a) * (r - l) - (n - a) * (c - l) < 0 && o--,
      (a = h),
      (l = c);
  }
  return o !== 0;
}
function oo(s, t, e, i, n, r) {
  if (e.length === 0 || !de(s, t, e[0], i, n, r)) return !1;
  for (let o = 1, a = e.length; o < a; ++o)
    if (de(s, e[o - 1], e[o], i, n, r)) return !1;
  return !0;
}
function ao(s, t, e, i, n) {
  const r = Zr(Tt(), s, t, e, i);
  return at(n, r)
    ? Pe(n, r) ||
      (r[0] >= n[0] && r[2] <= n[2]) ||
      (r[1] >= n[1] && r[3] <= n[3])
      ? !0
      : xl(s, t, e, i, function (o, a) {
          return Fa(n, o, a);
        })
    : !1;
}
function lo(s, t, e, i, n) {
  return !!(
    ao(s, t, e, i, n) ||
    de(s, t, e, i, n[0], n[1]) ||
    de(s, t, e, i, n[0], n[3]) ||
    de(s, t, e, i, n[2], n[1]) ||
    de(s, t, e, i, n[2], n[3])
  );
}
function Cl(s, t, e, i, n) {
  if (!lo(s, t, e[0], i, n)) return !1;
  if (e.length === 1) return !0;
  for (let r = 1, o = e.length; r < o; ++r)
    if (El(s, e[r - 1], e[r], i, n) && !ao(s, e[r - 1], e[r], i, n)) return !1;
  return !0;
}
function Rl(s, t, e, i) {
  let n = s[t],
    r = s[t + 1],
    o = 0;
  for (let a = t + i; a < e; a += i) {
    const l = s[a],
      h = s[a + 1];
    (o += Math.sqrt((l - n) * (l - n) + (h - r) * (h - r))), (n = l), (r = h);
  }
  return o;
}
class us extends cs {
  constructor(t, e) {
    super(), this.setCoordinates(t, e);
  }
  clone() {
    const t = new us(this.flatCoordinates.slice(), this.layout);
    return t.applyProperties(this), t;
  }
  closestPointXY(t, e, i, n) {
    const r = this.flatCoordinates,
      o = Ne(t, e, r[0], r[1]);
    if (o < n) {
      const a = this.stride;
      for (let l = 0; l < a; ++l) i[l] = r[l];
      return (i.length = a), o;
    }
    return n;
  }
  getCoordinates() {
    return this.flatCoordinates ? this.flatCoordinates.slice() : [];
  }
  computeExtent(t) {
    return Aa(this.flatCoordinates, t);
  }
  getType() {
    return "Point";
  }
  intersectsExtent(t) {
    return Br(t, this.flatCoordinates[0], this.flatCoordinates[1]);
  }
  setCoordinates(t, e) {
    this.setLayout(e, t, 0),
      this.flatCoordinates || (this.flatCoordinates = []),
      (this.flatCoordinates.length = ul(
        this.flatCoordinates,
        0,
        t,
        this.stride
      )),
      this.changed();
  }
}
const ho = us;
function Tl(s, t, e, i, n, r, o) {
  let a, l, h, c, u, d, f;
  const g = n[r + 1],
    _ = [];
  for (let y = 0, x = e.length; y < x; ++y) {
    const E = e[y];
    for (c = s[E - i], d = s[E - i + 1], a = t; a < E; a += i)
      (u = s[a]),
        (f = s[a + 1]),
        ((g <= d && f <= g) || (d <= g && g <= f)) &&
          ((h = ((g - d) / (f - d)) * (u - c) + c), _.push(h)),
        (c = u),
        (d = f);
  }
  let m = NaN,
    p = -1 / 0;
  for (_.sort(ze), c = _[0], a = 1, l = _.length; a < l; ++a) {
    u = _[a];
    const y = Math.abs(u - c);
    y > p && ((h = (c + u) / 2), oo(s, t, e, i, h, g) && ((m = h), (p = y))),
      (c = u);
  }
  return isNaN(m) && (m = n[r]), o ? (o.push(m, g, p), o) : [m, g, p];
}
function Il(s, t, e, i) {
  for (; t < e - i; ) {
    for (let n = 0; n < i; ++n) {
      const r = s[t + n];
      (s[t + n] = s[e - i + n]), (s[e - i + n] = r);
    }
    (t += i), (e -= i);
  }
}
function co(s, t, e, i) {
  let n = 0,
    r = s[e - i],
    o = s[e - i + 1];
  for (; t < e; t += i) {
    const a = s[t],
      l = s[t + 1];
    (n += (a - r) * (l + o)), (r = a), (o = l);
  }
  return n === 0 ? void 0 : n > 0;
}
function Sl(s, t, e, i, n) {
  n = n !== void 0 ? n : !1;
  for (let r = 0, o = e.length; r < o; ++r) {
    const a = e[r],
      l = co(s, t, a, i);
    if (r === 0) {
      if ((n && l) || (!n && !l)) return !1;
    } else if ((n && !l) || (!n && l)) return !1;
    t = a;
  }
  return !0;
}
function ir(s, t, e, i, n) {
  n = n !== void 0 ? n : !1;
  for (let r = 0, o = e.length; r < o; ++r) {
    const a = e[r],
      l = co(s, t, a, i);
    (r === 0 ? (n && l) || (!n && !l) : (n && !l) || (!n && l)) &&
      Il(s, t, a, i),
      (t = a);
  }
  return t;
}
class ai extends cs {
  constructor(t, e, i) {
    super(),
      (this.ends_ = []),
      (this.flatInteriorPointRevision_ = -1),
      (this.flatInteriorPoint_ = null),
      (this.maxDelta_ = -1),
      (this.maxDeltaRevision_ = -1),
      (this.orientedRevision_ = -1),
      (this.orientedFlatCoordinates_ = null),
      e !== void 0 && i
        ? (this.setFlatCoordinates(e, t), (this.ends_ = i))
        : this.setCoordinates(t, e);
  }
  appendLinearRing(t) {
    this.flatCoordinates
      ? Fr(this.flatCoordinates, t.getFlatCoordinates())
      : (this.flatCoordinates = t.getFlatCoordinates().slice()),
      this.ends_.push(this.flatCoordinates.length),
      this.changed();
  }
  clone() {
    const t = new ai(
      this.flatCoordinates.slice(),
      this.layout,
      this.ends_.slice()
    );
    return t.applyProperties(this), t;
  }
  closestPointXY(t, e, i, n) {
    return n < Yr(this.getExtent(), t, e)
      ? n
      : (this.maxDeltaRevision_ != this.getRevision() &&
          ((this.maxDelta_ = Math.sqrt(
            fl(this.flatCoordinates, 0, this.ends_, this.stride, 0)
          )),
          (this.maxDeltaRevision_ = this.getRevision())),
        gl(
          this.flatCoordinates,
          0,
          this.ends_,
          this.stride,
          this.maxDelta_,
          !0,
          t,
          e,
          i,
          n
        ));
  }
  containsXY(t, e) {
    return oo(
      this.getOrientedFlatCoordinates(),
      0,
      this.ends_,
      this.stride,
      t,
      e
    );
  }
  getArea() {
    return yl(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride);
  }
  getCoordinates(t) {
    let e;
    return (
      t !== void 0
        ? ((e = this.getOrientedFlatCoordinates().slice()),
          ir(e, 0, this.ends_, this.stride, t))
        : (e = this.flatCoordinates),
      Ui(e, 0, this.ends_, this.stride)
    );
  }
  getEnds() {
    return this.ends_;
  }
  getFlatInteriorPoint() {
    if (this.flatInteriorPointRevision_ != this.getRevision()) {
      const t = Be(this.getExtent());
      (this.flatInteriorPoint_ = Tl(
        this.getOrientedFlatCoordinates(),
        0,
        this.ends_,
        this.stride,
        t,
        0
      )),
        (this.flatInteriorPointRevision_ = this.getRevision());
    }
    return this.flatInteriorPoint_;
  }
  getInteriorPoint() {
    return new ho(this.getFlatInteriorPoint(), "XYM");
  }
  getLinearRingCount() {
    return this.ends_.length;
  }
  getLinearRing(t) {
    return t < 0 || this.ends_.length <= t
      ? null
      : new er(
          this.flatCoordinates.slice(
            t === 0 ? 0 : this.ends_[t - 1],
            this.ends_[t]
          ),
          this.layout
        );
  }
  getLinearRings() {
    const t = this.layout,
      e = this.flatCoordinates,
      i = this.ends_,
      n = [];
    let r = 0;
    for (let o = 0, a = i.length; o < a; ++o) {
      const l = i[o],
        h = new er(e.slice(r, l), t);
      n.push(h), (r = l);
    }
    return n;
  }
  getOrientedFlatCoordinates() {
    if (this.orientedRevision_ != this.getRevision()) {
      const t = this.flatCoordinates;
      Sl(t, 0, this.ends_, this.stride)
        ? (this.orientedFlatCoordinates_ = t)
        : ((this.orientedFlatCoordinates_ = t.slice()),
          (this.orientedFlatCoordinates_.length = ir(
            this.orientedFlatCoordinates_,
            0,
            this.ends_,
            this.stride
          ))),
        (this.orientedRevision_ = this.getRevision());
    }
    return this.orientedFlatCoordinates_;
  }
  getSimplifiedGeometryInternal(t) {
    const e = [],
      i = [];
    return (
      (e.length = pl(
        this.flatCoordinates,
        0,
        this.ends_,
        this.stride,
        Math.sqrt(t),
        e,
        0,
        i
      )),
      new ai(e, "XY", i)
    );
  }
  getType() {
    return "Polygon";
  }
  intersectsExtent(t) {
    return Cl(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride, t);
  }
  setCoordinates(t, e) {
    this.setLayout(e, t, 2),
      this.flatCoordinates || (this.flatCoordinates = []);
    const i = dl(this.flatCoordinates, 0, t, this.stride, this.ends_);
    (this.flatCoordinates.length = i.length === 0 ? 0 : i[i.length - 1]),
      this.changed();
  }
}
function nr(s) {
  const t = s[0],
    e = s[1],
    i = s[2],
    n = s[3],
    r = [t, e, t, n, i, n, i, e, t, e];
  return new ai(r, "XY", [r.length]);
}
const Z = {
  OPACITY: "opacity",
  VISIBLE: "visible",
  EXTENT: "extent",
  Z_INDEX: "zIndex",
  MAX_RESOLUTION: "maxResolution",
  MIN_RESOLUTION: "minResolution",
  MAX_ZOOM: "maxZoom",
  MIN_ZOOM: "minZoom",
  SOURCE: "source",
  MAP: "map",
};
class wl extends bt {
  constructor(t) {
    super(), this.on, this.once, this.un, (this.background_ = t.background);
    const e = Object.assign({}, t);
    typeof t.properties == "object" &&
      (delete e.properties, Object.assign(e, t.properties)),
      (e[Z.OPACITY] = t.opacity !== void 0 ? t.opacity : 1),
      G(typeof e[Z.OPACITY] == "number", 64),
      (e[Z.VISIBLE] = t.visible !== void 0 ? t.visible : !0),
      (e[Z.Z_INDEX] = t.zIndex),
      (e[Z.MAX_RESOLUTION] =
        t.maxResolution !== void 0 ? t.maxResolution : 1 / 0),
      (e[Z.MIN_RESOLUTION] = t.minResolution !== void 0 ? t.minResolution : 0),
      (e[Z.MIN_ZOOM] = t.minZoom !== void 0 ? t.minZoom : -1 / 0),
      (e[Z.MAX_ZOOM] = t.maxZoom !== void 0 ? t.maxZoom : 1 / 0),
      (this.className_ = e.className !== void 0 ? e.className : "ol-layer"),
      delete e.className,
      this.setProperties(e),
      (this.state_ = null);
  }
  getBackground() {
    return this.background_;
  }
  getClassName() {
    return this.className_;
  }
  getLayerState(t) {
    const e = this.state_ || { layer: this, managed: t === void 0 ? !0 : t },
      i = this.getZIndex();
    return (
      (e.opacity = J(Math.round(this.getOpacity() * 100) / 100, 0, 1)),
      (e.visible = this.getVisible()),
      (e.extent = this.getExtent()),
      (e.zIndex = i === void 0 && !e.managed ? 1 / 0 : i),
      (e.maxResolution = this.getMaxResolution()),
      (e.minResolution = Math.max(this.getMinResolution(), 0)),
      (e.minZoom = this.getMinZoom()),
      (e.maxZoom = this.getMaxZoom()),
      (this.state_ = e),
      e
    );
  }
  getLayersArray(t) {
    return X();
  }
  getLayerStatesArray(t) {
    return X();
  }
  getExtent() {
    return this.get(Z.EXTENT);
  }
  getMaxResolution() {
    return this.get(Z.MAX_RESOLUTION);
  }
  getMinResolution() {
    return this.get(Z.MIN_RESOLUTION);
  }
  getMinZoom() {
    return this.get(Z.MIN_ZOOM);
  }
  getMaxZoom() {
    return this.get(Z.MAX_ZOOM);
  }
  getOpacity() {
    return this.get(Z.OPACITY);
  }
  getSourceState() {
    return X();
  }
  getVisible() {
    return this.get(Z.VISIBLE);
  }
  getZIndex() {
    return this.get(Z.Z_INDEX);
  }
  setBackground(t) {
    (this.background_ = t), this.changed();
  }
  setExtent(t) {
    this.set(Z.EXTENT, t);
  }
  setMaxResolution(t) {
    this.set(Z.MAX_RESOLUTION, t);
  }
  setMinResolution(t) {
    this.set(Z.MIN_RESOLUTION, t);
  }
  setMaxZoom(t) {
    this.set(Z.MAX_ZOOM, t);
  }
  setMinZoom(t) {
    this.set(Z.MIN_ZOOM, t);
  }
  setOpacity(t) {
    G(typeof t == "number", 64), this.set(Z.OPACITY, t);
  }
  setVisible(t) {
    this.set(Z.VISIBLE, t);
  }
  setZIndex(t) {
    this.set(Z.Z_INDEX, t);
  }
  disposeInternal() {
    this.state_ && ((this.state_.layer = null), (this.state_ = null)),
      super.disposeInternal();
  }
}
const uo = wl,
  ne = {
    PRERENDER: "prerender",
    POSTRENDER: "postrender",
    PRECOMPOSE: "precompose",
    POSTCOMPOSE: "postcompose",
    RENDERCOMPLETE: "rendercomplete",
  },
  rt = { ANIMATING: 0, INTERACTING: 1 },
  Et = { CENTER: "center", RESOLUTION: "resolution", ROTATION: "rotation" },
  vl = 42,
  ds = 256;
function sr(s, t, e) {
  return function (i, n, r, o, a) {
    if (!i) return;
    if (!n && !t) return i;
    const l = t ? 0 : r[0] * n,
      h = t ? 0 : r[1] * n,
      c = a ? a[0] : 0,
      u = a ? a[1] : 0;
    let d = s[0] + l / 2 + c,
      f = s[2] - l / 2 + c,
      g = s[1] + h / 2 + u,
      _ = s[3] - h / 2 + u;
    d > f && ((d = (f + d) / 2), (f = d)),
      g > _ && ((g = (_ + g) / 2), (_ = g));
    let m = J(i[0], d, f),
      p = J(i[1], g, _);
    if (o && e && n) {
      const y = 30 * n;
      (m +=
        -y * Math.log(1 + Math.max(0, d - i[0]) / y) +
        y * Math.log(1 + Math.max(0, i[0] - f) / y)),
        (p +=
          -y * Math.log(1 + Math.max(0, g - i[1]) / y) +
          y * Math.log(1 + Math.max(0, i[1] - _) / y));
    }
    return [m, p];
  };
}
function Ll(s) {
  return s;
}
function fs(s, t, e, i) {
  const n = U(t) / e[0],
    r = Ot(t) / e[1];
  return i ? Math.min(s, Math.max(n, r)) : Math.min(s, Math.min(n, r));
}
function gs(s, t, e) {
  let i = Math.min(s, t);
  const n = 50;
  return (
    (i *= Math.log(1 + n * Math.max(0, s / t - 1)) / n + 1),
    e &&
      ((i = Math.max(i, e)),
      (i /= Math.log(1 + n * Math.max(0, e / s - 1)) / n + 1)),
    J(i, e / 2, t * 2)
  );
}
function Al(s, t, e, i) {
  return (
    (t = t !== void 0 ? t : !0),
    function (n, r, o, a) {
      if (n !== void 0) {
        const l = s[0],
          h = s[s.length - 1],
          c = e ? fs(l, e, o, i) : l;
        if (a) return t ? gs(n, c, h) : J(n, h, c);
        const u = Math.min(c, n),
          d = Math.floor(Qn(s, u, r));
        return s[d] > c && d < s.length - 1 ? s[d + 1] : s[d];
      }
    }
  );
}
function Ml(s, t, e, i, n, r) {
  return (
    (i = i !== void 0 ? i : !0),
    (e = e !== void 0 ? e : 0),
    function (o, a, l, h) {
      if (o !== void 0) {
        const c = n ? fs(t, n, l, r) : t;
        if (h) return i ? gs(o, c, e) : J(o, e, c);
        const u = 1e-9,
          d = Math.ceil(Math.log(t / c) / Math.log(s) - u),
          f = -a * (0.5 - u) + 0.5,
          g = Math.min(c, o),
          _ = Math.floor(Math.log(t / g) / Math.log(s) + f),
          m = Math.max(d, _),
          p = t / Math.pow(s, m);
        return J(p, e, c);
      }
    }
  );
}
function rr(s, t, e, i, n) {
  return (
    (e = e !== void 0 ? e : !0),
    function (r, o, a, l) {
      if (r !== void 0) {
        const h = i ? fs(s, i, a, n) : s;
        return !e || !l ? J(r, t, h) : gs(r, h, t);
      }
    }
  );
}
function _s(s) {
  if (s !== void 0) return 0;
}
function or(s) {
  if (s !== void 0) return s;
}
function Ol(s) {
  const t = (2 * Math.PI) / s;
  return function (e, i) {
    if (i) return e;
    if (e !== void 0) return (e = Math.floor(e / t + 0.5) * t), e;
  };
}
function bl(s) {
  return (
    (s = s || Yi(5)),
    function (t, e) {
      if (e) return t;
      if (t !== void 0) return Math.abs(t) <= s ? 0 : t;
    }
  );
}
function fo(s) {
  return Math.pow(s, 3);
}
function Ke(s) {
  return 1 - fo(1 - s);
}
function Pl(s) {
  return 3 * s * s - 2 * s * s * s;
}
function Dl(s) {
  return s;
}
const Sn = 0;
class Fl extends bt {
  constructor(t) {
    super(),
      this.on,
      this.once,
      this.un,
      (t = Object.assign({}, t)),
      (this.hints_ = [0, 0]),
      (this.animations_ = []),
      this.updateAnimationKey_,
      (this.projection_ = ls(t.projection, "EPSG:3857")),
      (this.viewportSize_ = [100, 100]),
      (this.targetCenter_ = null),
      this.targetResolution_,
      this.targetRotation_,
      (this.nextCenter_ = null),
      this.nextResolution_,
      this.nextRotation_,
      (this.cancelAnchor_ = void 0),
      t.projection && qr(),
      t.center && (t.center = Xt(t.center, this.projection_)),
      t.extent && (t.extent = ue(t.extent, this.projection_)),
      this.applyOptions_(t);
  }
  applyOptions_(t) {
    const e = Object.assign({}, t);
    for (const a in Et) delete e[a];
    this.setProperties(e, !0);
    const i = Nl(t);
    (this.maxResolution_ = i.maxResolution),
      (this.minResolution_ = i.minResolution),
      (this.zoomFactor_ = i.zoomFactor),
      (this.resolutions_ = t.resolutions),
      (this.padding_ = t.padding),
      (this.minZoom_ = i.minZoom);
    const n = kl(t),
      r = i.constraint,
      o = Gl(t);
    (this.constraints_ = { center: n, resolution: r, rotation: o }),
      this.setRotation(t.rotation !== void 0 ? t.rotation : 0),
      this.setCenterInternal(t.center !== void 0 ? t.center : null),
      t.resolution !== void 0
        ? this.setResolution(t.resolution)
        : t.zoom !== void 0 && this.setZoom(t.zoom);
  }
  get padding() {
    return this.padding_;
  }
  set padding(t) {
    let e = this.padding_;
    this.padding_ = t;
    const i = this.getCenterInternal();
    if (i) {
      const n = t || [0, 0, 0, 0];
      e = e || [0, 0, 0, 0];
      const r = this.getResolution(),
        o = (r / 2) * (n[3] - e[3] + e[1] - n[1]),
        a = (r / 2) * (n[0] - e[0] + e[2] - n[2]);
      this.setCenterInternal([i[0] + o, i[1] - a]);
    }
  }
  getUpdatedOptions_(t) {
    const e = this.getProperties();
    return (
      e.resolution !== void 0
        ? (e.resolution = this.getResolution())
        : (e.zoom = this.getZoom()),
      (e.center = this.getCenterInternal()),
      (e.rotation = this.getRotation()),
      Object.assign({}, e, t)
    );
  }
  animate(t) {
    this.isDef() && !this.getAnimating() && this.resolveConstraints(0);
    const e = new Array(arguments.length);
    for (let i = 0; i < e.length; ++i) {
      let n = arguments[i];
      n.center &&
        ((n = Object.assign({}, n)),
        (n.center = Xt(n.center, this.getProjection()))),
        n.anchor &&
          ((n = Object.assign({}, n)),
          (n.anchor = Xt(n.anchor, this.getProjection()))),
        (e[i] = n);
    }
    this.animateInternal.apply(this, e);
  }
  animateInternal(t) {
    let e = arguments.length,
      i;
    e > 1 &&
      typeof arguments[e - 1] == "function" &&
      ((i = arguments[e - 1]), --e);
    let n = 0;
    for (; n < e && !this.isDef(); ++n) {
      const c = arguments[n];
      c.center && this.setCenterInternal(c.center),
        c.zoom !== void 0
          ? this.setZoom(c.zoom)
          : c.resolution && this.setResolution(c.resolution),
        c.rotation !== void 0 && this.setRotation(c.rotation);
    }
    if (n === e) {
      i && Di(i, !0);
      return;
    }
    let r = Date.now(),
      o = this.targetCenter_.slice(),
      a = this.targetResolution_,
      l = this.targetRotation_;
    const h = [];
    for (; n < e; ++n) {
      const c = arguments[n],
        u = {
          start: r,
          complete: !1,
          anchor: c.anchor,
          duration: c.duration !== void 0 ? c.duration : 1e3,
          easing: c.easing || Pl,
          callback: i,
        };
      if (
        (c.center &&
          ((u.sourceCenter = o),
          (u.targetCenter = c.center.slice()),
          (o = u.targetCenter)),
        c.zoom !== void 0
          ? ((u.sourceResolution = a),
            (u.targetResolution = this.getResolutionForZoom(c.zoom)),
            (a = u.targetResolution))
          : c.resolution &&
            ((u.sourceResolution = a),
            (u.targetResolution = c.resolution),
            (a = u.targetResolution)),
        c.rotation !== void 0)
      ) {
        u.sourceRotation = l;
        const d = Ge(c.rotation - l + Math.PI, 2 * Math.PI) - Math.PI;
        (u.targetRotation = l + d), (l = u.targetRotation);
      }
      Xl(u) ? (u.complete = !0) : (r += u.duration), h.push(u);
    }
    this.animations_.push(h),
      this.setHint(rt.ANIMATING, 1),
      this.updateAnimations_();
  }
  getAnimating() {
    return this.hints_[rt.ANIMATING] > 0;
  }
  getInteracting() {
    return this.hints_[rt.INTERACTING] > 0;
  }
  cancelAnimations() {
    this.setHint(rt.ANIMATING, -this.hints_[rt.ANIMATING]);
    let t;
    for (let e = 0, i = this.animations_.length; e < i; ++e) {
      const n = this.animations_[e];
      if ((n[0].callback && Di(n[0].callback, !1), !t))
        for (let r = 0, o = n.length; r < o; ++r) {
          const a = n[r];
          if (!a.complete) {
            t = a.anchor;
            break;
          }
        }
    }
    (this.animations_.length = 0),
      (this.cancelAnchor_ = t),
      (this.nextCenter_ = null),
      (this.nextResolution_ = NaN),
      (this.nextRotation_ = NaN);
  }
  updateAnimations_() {
    if (
      (this.updateAnimationKey_ !== void 0 &&
        (cancelAnimationFrame(this.updateAnimationKey_),
        (this.updateAnimationKey_ = void 0)),
      !this.getAnimating())
    )
      return;
    const t = Date.now();
    let e = !1;
    for (let i = this.animations_.length - 1; i >= 0; --i) {
      const n = this.animations_[i];
      let r = !0;
      for (let o = 0, a = n.length; o < a; ++o) {
        const l = n[o];
        if (l.complete) continue;
        const h = t - l.start;
        let c = l.duration > 0 ? h / l.duration : 1;
        c >= 1 ? ((l.complete = !0), (c = 1)) : (r = !1);
        const u = l.easing(c);
        if (l.sourceCenter) {
          const d = l.sourceCenter[0],
            f = l.sourceCenter[1],
            g = l.targetCenter[0],
            _ = l.targetCenter[1];
          this.nextCenter_ = l.targetCenter;
          const m = d + u * (g - d),
            p = f + u * (_ - f);
          this.targetCenter_ = [m, p];
        }
        if (l.sourceResolution && l.targetResolution) {
          const d =
            u === 1
              ? l.targetResolution
              : l.sourceResolution +
                u * (l.targetResolution - l.sourceResolution);
          if (l.anchor) {
            const f = this.getViewportSize_(this.getRotation()),
              g = this.constraints_.resolution(d, 0, f, !0);
            this.targetCenter_ = this.calculateCenterZoom(g, l.anchor);
          }
          (this.nextResolution_ = l.targetResolution),
            (this.targetResolution_ = d),
            this.applyTargetState_(!0);
        }
        if (l.sourceRotation !== void 0 && l.targetRotation !== void 0) {
          const d =
            u === 1
              ? Ge(l.targetRotation + Math.PI, 2 * Math.PI) - Math.PI
              : l.sourceRotation + u * (l.targetRotation - l.sourceRotation);
          if (l.anchor) {
            const f = this.constraints_.rotation(d, !0);
            this.targetCenter_ = this.calculateCenterRotate(f, l.anchor);
          }
          (this.nextRotation_ = l.targetRotation), (this.targetRotation_ = d);
        }
        if ((this.applyTargetState_(!0), (e = !0), !l.complete)) break;
      }
      if (r) {
        (this.animations_[i] = null),
          this.setHint(rt.ANIMATING, -1),
          (this.nextCenter_ = null),
          (this.nextResolution_ = NaN),
          (this.nextRotation_ = NaN);
        const o = n[0].callback;
        o && Di(o, !0);
      }
    }
    (this.animations_ = this.animations_.filter(Boolean)),
      e &&
        this.updateAnimationKey_ === void 0 &&
        (this.updateAnimationKey_ = requestAnimationFrame(
          this.updateAnimations_.bind(this)
        ));
  }
  calculateCenterRotate(t, e) {
    let i;
    const n = this.getCenterInternal();
    return (
      n !== void 0 &&
        ((i = [n[0] - e[0], n[1] - e[1]]),
        os(i, t - this.getRotation()),
        Ha(i, e)),
      i
    );
  }
  calculateCenterZoom(t, e) {
    let i;
    const n = this.getCenterInternal(),
      r = this.getResolution();
    if (n !== void 0 && r !== void 0) {
      const o = e[0] - (t * (e[0] - n[0])) / r,
        a = e[1] - (t * (e[1] - n[1])) / r;
      i = [o, a];
    }
    return i;
  }
  getViewportSize_(t) {
    const e = this.viewportSize_;
    if (t) {
      const i = e[0],
        n = e[1];
      return [
        Math.abs(i * Math.cos(t)) + Math.abs(n * Math.sin(t)),
        Math.abs(i * Math.sin(t)) + Math.abs(n * Math.cos(t)),
      ];
    }
    return e;
  }
  setViewportSize(t) {
    (this.viewportSize_ = Array.isArray(t) ? t.slice() : [100, 100]),
      this.getAnimating() || this.resolveConstraints(0);
  }
  getCenter() {
    const t = this.getCenterInternal();
    return t && Zn(t, this.getProjection());
  }
  getCenterInternal() {
    return this.get(Et.CENTER);
  }
  getConstraints() {
    return this.constraints_;
  }
  getConstrainResolution() {
    return this.get("constrainResolution");
  }
  getHints(t) {
    return t !== void 0
      ? ((t[0] = this.hints_[0]), (t[1] = this.hints_[1]), t)
      : this.hints_.slice();
  }
  calculateExtent(t) {
    const e = this.calculateExtentInternal(t);
    return to(e, this.getProjection());
  }
  calculateExtentInternal(t) {
    t = t || this.getViewportSizeMinusPadding_();
    const e = this.getCenterInternal();
    G(e, 1);
    const i = this.getResolution();
    G(i !== void 0, 2);
    const n = this.getRotation();
    return G(n !== void 0, 3), Wn(e, i, n, t);
  }
  getMaxResolution() {
    return this.maxResolution_;
  }
  getMinResolution() {
    return this.minResolution_;
  }
  getMaxZoom() {
    return this.getZoomForResolution(this.minResolution_);
  }
  setMaxZoom(t) {
    this.applyOptions_(this.getUpdatedOptions_({ maxZoom: t }));
  }
  getMinZoom() {
    return this.getZoomForResolution(this.maxResolution_);
  }
  setMinZoom(t) {
    this.applyOptions_(this.getUpdatedOptions_({ minZoom: t }));
  }
  setConstrainResolution(t) {
    this.applyOptions_(this.getUpdatedOptions_({ constrainResolution: t }));
  }
  getProjection() {
    return this.projection_;
  }
  getResolution() {
    return this.get(Et.RESOLUTION);
  }
  getResolutions() {
    return this.resolutions_;
  }
  getResolutionForExtent(t, e) {
    return this.getResolutionForExtentInternal(ue(t, this.getProjection()), e);
  }
  getResolutionForExtentInternal(t, e) {
    e = e || this.getViewportSizeMinusPadding_();
    const i = U(t) / e[0],
      n = Ot(t) / e[1];
    return Math.max(i, n);
  }
  getResolutionForValueFunction(t) {
    t = t || 2;
    const e = this.getConstrainedResolution(this.maxResolution_),
      i = this.minResolution_,
      n = Math.log(e / i) / Math.log(t);
    return function (r) {
      return e / Math.pow(t, r * n);
    };
  }
  getRotation() {
    return this.get(Et.ROTATION);
  }
  getValueForResolutionFunction(t) {
    const e = Math.log(t || 2),
      i = this.getConstrainedResolution(this.maxResolution_),
      n = this.minResolution_,
      r = Math.log(i / n) / e;
    return function (o) {
      return Math.log(i / o) / e / r;
    };
  }
  getViewportSizeMinusPadding_(t) {
    let e = this.getViewportSize_(t);
    const i = this.padding_;
    return i && (e = [e[0] - i[1] - i[3], e[1] - i[0] - i[2]]), e;
  }
  getState() {
    const t = this.getProjection(),
      e = this.getResolution(),
      i = this.getRotation();
    let n = this.getCenterInternal();
    const r = this.padding_;
    if (r) {
      const o = this.getViewportSizeMinusPadding_();
      n = wn(
        n,
        this.getViewportSize_(),
        [o[0] / 2 + r[3], o[1] / 2 + r[0]],
        e,
        i
      );
    }
    return {
      center: n.slice(0),
      projection: t !== void 0 ? t : null,
      resolution: e,
      nextCenter: this.nextCenter_,
      nextResolution: this.nextResolution_,
      nextRotation: this.nextRotation_,
      rotation: i,
      zoom: this.getZoom(),
    };
  }
  getViewStateAndExtent() {
    return { viewState: this.getState(), extent: this.calculateExtent() };
  }
  getZoom() {
    let t;
    const e = this.getResolution();
    return e !== void 0 && (t = this.getZoomForResolution(e)), t;
  }
  getZoomForResolution(t) {
    let e = this.minZoom_ || 0,
      i,
      n;
    if (this.resolutions_) {
      const r = Qn(this.resolutions_, t, 1);
      (e = r),
        (i = this.resolutions_[r]),
        r == this.resolutions_.length - 1
          ? (n = 2)
          : (n = i / this.resolutions_[r + 1]);
    } else (i = this.maxResolution_), (n = this.zoomFactor_);
    return e + Math.log(i / t) / Math.log(n);
  }
  getResolutionForZoom(t) {
    if (this.resolutions_) {
      if (this.resolutions_.length <= 1) return 0;
      const e = J(Math.floor(t), 0, this.resolutions_.length - 2),
        i = this.resolutions_[e] / this.resolutions_[e + 1];
      return this.resolutions_[e] / Math.pow(i, J(t - e, 0, 1));
    }
    return this.maxResolution_ / Math.pow(this.zoomFactor_, t - this.minZoom_);
  }
  fit(t, e) {
    let i;
    if (
      (G(Array.isArray(t) || typeof t.getSimplifiedGeometry == "function", 24),
      Array.isArray(t))
    ) {
      G(!ss(t), 25);
      const n = ue(t, this.getProjection());
      i = nr(n);
    } else if (t.getType() === "Circle") {
      const n = ue(t.getExtent(), this.getProjection());
      (i = nr(n)), i.rotate(this.getRotation(), Be(n));
    } else i = t;
    this.fitInternal(i, e);
  }
  rotatedExtentForGeometry(t) {
    const e = this.getRotation(),
      i = Math.cos(e),
      n = Math.sin(-e),
      r = t.getFlatCoordinates(),
      o = t.getStride();
    let a = 1 / 0,
      l = 1 / 0,
      h = -1 / 0,
      c = -1 / 0;
    for (let u = 0, d = r.length; u < d; u += o) {
      const f = r[u] * i - r[u + 1] * n,
        g = r[u] * n + r[u + 1] * i;
      (a = Math.min(a, f)),
        (l = Math.min(l, g)),
        (h = Math.max(h, f)),
        (c = Math.max(c, g));
    }
    return [a, l, h, c];
  }
  fitInternal(t, e) {
    e = e || {};
    let i = e.size;
    i || (i = this.getViewportSizeMinusPadding_());
    const n = e.padding !== void 0 ? e.padding : [0, 0, 0, 0],
      r = e.nearest !== void 0 ? e.nearest : !1;
    let o;
    e.minResolution !== void 0
      ? (o = e.minResolution)
      : e.maxZoom !== void 0
      ? (o = this.getResolutionForZoom(e.maxZoom))
      : (o = 0);
    const a = this.rotatedExtentForGeometry(t);
    let l = this.getResolutionForExtentInternal(a, [
      i[0] - n[1] - n[3],
      i[1] - n[0] - n[2],
    ]);
    (l = isNaN(l) ? o : Math.max(l, o)),
      (l = this.getConstrainedResolution(l, r ? 0 : 1));
    const h = this.getRotation(),
      c = Math.sin(h),
      u = Math.cos(h),
      d = Be(a);
    (d[0] += ((n[1] - n[3]) / 2) * l), (d[1] += ((n[0] - n[2]) / 2) * l);
    const f = d[0] * u - d[1] * c,
      g = d[1] * u + d[0] * c,
      _ = this.getConstrainedCenter([f, g], l),
      m = e.callback ? e.callback : Ye;
    e.duration !== void 0
      ? this.animateInternal(
          { resolution: l, center: _, duration: e.duration, easing: e.easing },
          m
        )
      : ((this.targetResolution_ = l),
        (this.targetCenter_ = _),
        this.applyTargetState_(!1, !0),
        Di(m, !0));
  }
  centerOn(t, e, i) {
    this.centerOnInternal(Xt(t, this.getProjection()), e, i);
  }
  centerOnInternal(t, e, i) {
    this.setCenterInternal(
      wn(t, e, i, this.getResolution(), this.getRotation())
    );
  }
  calculateCenterShift(t, e, i, n) {
    let r;
    const o = this.padding_;
    if (o && t) {
      const a = this.getViewportSizeMinusPadding_(-i),
        l = wn(t, n, [a[0] / 2 + o[3], a[1] / 2 + o[0]], e, i);
      r = [t[0] - l[0], t[1] - l[1]];
    }
    return r;
  }
  isDef() {
    return !!this.getCenterInternal() && this.getResolution() !== void 0;
  }
  adjustCenter(t) {
    const e = Zn(this.targetCenter_, this.getProjection());
    this.setCenter([e[0] + t[0], e[1] + t[1]]);
  }
  adjustCenterInternal(t) {
    const e = this.targetCenter_;
    this.setCenterInternal([e[0] + t[0], e[1] + t[1]]);
  }
  adjustResolution(t, e) {
    (e = e && Xt(e, this.getProjection())), this.adjustResolutionInternal(t, e);
  }
  adjustResolutionInternal(t, e) {
    const i = this.getAnimating() || this.getInteracting(),
      n = this.getViewportSize_(this.getRotation()),
      r = this.constraints_.resolution(this.targetResolution_ * t, 0, n, i);
    e && (this.targetCenter_ = this.calculateCenterZoom(r, e)),
      (this.targetResolution_ *= t),
      this.applyTargetState_();
  }
  adjustZoom(t, e) {
    this.adjustResolution(Math.pow(this.zoomFactor_, -t), e);
  }
  adjustRotation(t, e) {
    e && (e = Xt(e, this.getProjection())), this.adjustRotationInternal(t, e);
  }
  adjustRotationInternal(t, e) {
    const i = this.getAnimating() || this.getInteracting(),
      n = this.constraints_.rotation(this.targetRotation_ + t, i);
    e && (this.targetCenter_ = this.calculateCenterRotate(n, e)),
      (this.targetRotation_ += t),
      this.applyTargetState_();
  }
  setCenter(t) {
    this.setCenterInternal(t && Xt(t, this.getProjection()));
  }
  setCenterInternal(t) {
    (this.targetCenter_ = t), this.applyTargetState_();
  }
  setHint(t, e) {
    return (this.hints_[t] += e), this.changed(), this.hints_[t];
  }
  setResolution(t) {
    (this.targetResolution_ = t), this.applyTargetState_();
  }
  setRotation(t) {
    (this.targetRotation_ = t), this.applyTargetState_();
  }
  setZoom(t) {
    this.setResolution(this.getResolutionForZoom(t));
  }
  applyTargetState_(t, e) {
    const i = this.getAnimating() || this.getInteracting() || e,
      n = this.constraints_.rotation(this.targetRotation_, i),
      r = this.getViewportSize_(n),
      o = this.constraints_.resolution(this.targetResolution_, 0, r, i),
      a = this.constraints_.center(
        this.targetCenter_,
        o,
        r,
        i,
        this.calculateCenterShift(this.targetCenter_, o, n, r)
      );
    this.get(Et.ROTATION) !== n && this.set(Et.ROTATION, n),
      this.get(Et.RESOLUTION) !== o &&
        (this.set(Et.RESOLUTION, o), this.set("zoom", this.getZoom(), !0)),
      (!a || !this.get(Et.CENTER) || !Ki(this.get(Et.CENTER), a)) &&
        this.set(Et.CENTER, a),
      this.getAnimating() && !t && this.cancelAnimations(),
      (this.cancelAnchor_ = void 0);
  }
  resolveConstraints(t, e, i) {
    t = t !== void 0 ? t : 200;
    const n = e || 0,
      r = this.constraints_.rotation(this.targetRotation_),
      o = this.getViewportSize_(r),
      a = this.constraints_.resolution(this.targetResolution_, n, o),
      l = this.constraints_.center(
        this.targetCenter_,
        a,
        o,
        !1,
        this.calculateCenterShift(this.targetCenter_, a, r, o)
      );
    if (t === 0 && !this.cancelAnchor_) {
      (this.targetResolution_ = a),
        (this.targetRotation_ = r),
        (this.targetCenter_ = l),
        this.applyTargetState_();
      return;
    }
    (i = i || (t === 0 ? this.cancelAnchor_ : void 0)),
      (this.cancelAnchor_ = void 0),
      (this.getResolution() !== a ||
        this.getRotation() !== r ||
        !this.getCenterInternal() ||
        !Ki(this.getCenterInternal(), l)) &&
        (this.getAnimating() && this.cancelAnimations(),
        this.animateInternal({
          rotation: r,
          center: l,
          resolution: a,
          duration: t,
          easing: Ke,
          anchor: i,
        }));
  }
  beginInteraction() {
    this.resolveConstraints(0), this.setHint(rt.INTERACTING, 1);
  }
  endInteraction(t, e, i) {
    (i = i && Xt(i, this.getProjection())),
      this.endInteractionInternal(t, e, i);
  }
  endInteractionInternal(t, e, i) {
    !this.getInteracting() ||
      (this.setHint(rt.INTERACTING, -1), this.resolveConstraints(t, e, i));
  }
  getConstrainedCenter(t, e) {
    const i = this.getViewportSize_(this.getRotation());
    return this.constraints_.center(t, e || this.getResolution(), i);
  }
  getConstrainedZoom(t, e) {
    const i = this.getResolutionForZoom(t);
    return this.getZoomForResolution(this.getConstrainedResolution(i, e));
  }
  getConstrainedResolution(t, e) {
    e = e || 0;
    const i = this.getViewportSize_(this.getRotation());
    return this.constraints_.resolution(t, e, i);
  }
}
function Di(s, t) {
  setTimeout(function () {
    s(t);
  }, 0);
}
function kl(s) {
  if (s.extent !== void 0) {
    const e =
      s.smoothExtentConstraint !== void 0 ? s.smoothExtentConstraint : !0;
    return sr(s.extent, s.constrainOnlyCenter, e);
  }
  const t = ls(s.projection, "EPSG:3857");
  if (s.multiWorld !== !0 && t.isGlobal()) {
    const e = t.getExtent().slice();
    return (e[0] = -1 / 0), (e[2] = 1 / 0), sr(e, !1, !1);
  }
  return Ll;
}
function Nl(s) {
  let t,
    e,
    i,
    o = s.minZoom !== void 0 ? s.minZoom : Sn,
    a = s.maxZoom !== void 0 ? s.maxZoom : 28;
  const l = s.zoomFactor !== void 0 ? s.zoomFactor : 2,
    h = s.multiWorld !== void 0 ? s.multiWorld : !1,
    c =
      s.smoothResolutionConstraint !== void 0
        ? s.smoothResolutionConstraint
        : !0,
    u = s.showFullExtent !== void 0 ? s.showFullExtent : !1,
    d = ls(s.projection, "EPSG:3857"),
    f = d.getExtent();
  let g = s.constrainOnlyCenter,
    _ = s.extent;
  if (
    (!h && !_ && d.isGlobal() && ((g = !1), (_ = f)), s.resolutions !== void 0)
  ) {
    const m = s.resolutions;
    (e = m[o]),
      (i = m[a] !== void 0 ? m[a] : m[m.length - 1]),
      s.constrainResolution
        ? (t = Al(m, c, !g && _, u))
        : (t = rr(e, i, c, !g && _, u));
  } else {
    const p =
        (f
          ? Math.max(U(f), Ot(f))
          : (360 * oi.degrees) / d.getMetersPerUnit()) /
        ds /
        Math.pow(2, Sn),
      y = p / Math.pow(2, 28 - Sn);
    (e = s.maxResolution),
      e !== void 0 ? (o = 0) : (e = p / Math.pow(l, o)),
      (i = s.minResolution),
      i === void 0 &&
        (s.maxZoom !== void 0
          ? s.maxResolution !== void 0
            ? (i = e / Math.pow(l, a))
            : (i = p / Math.pow(l, a))
          : (i = y)),
      (a = o + Math.floor(Math.log(e / i) / Math.log(l))),
      (i = e / Math.pow(l, a - o)),
      s.constrainResolution
        ? (t = Ml(l, e, i, c, !g && _, u))
        : (t = rr(e, i, c, !g && _, u));
  }
  return {
    constraint: t,
    maxResolution: e,
    minResolution: i,
    minZoom: o,
    zoomFactor: l,
  };
}
function Gl(s) {
  if (s.enableRotation !== void 0 ? s.enableRotation : !0) {
    const e = s.constrainRotation;
    return e === void 0 || e === !0
      ? bl()
      : e === !1
      ? or
      : typeof e == "number"
      ? Ol(e)
      : or;
  }
  return _s;
}
function Xl(s) {
  return !(
    (s.sourceCenter && s.targetCenter && !Ki(s.sourceCenter, s.targetCenter)) ||
    s.sourceResolution !== s.targetResolution ||
    s.sourceRotation !== s.targetRotation
  );
}
function wn(s, t, e, i, n) {
  const r = Math.cos(-n);
  let o = Math.sin(-n),
    a = s[0] * r - s[1] * o,
    l = s[1] * r + s[0] * o;
  (a += (t[0] / 2 - e[0]) * i), (l += (e[1] - t[1] / 2) * i), (o = -o);
  const h = a * r - l * o,
    c = l * r + a * o;
  return [h, c];
}
const wt = Fl;
class Wl extends uo {
  constructor(t) {
    const e = Object.assign({}, t);
    delete e.source,
      super(e),
      this.on,
      this.once,
      this.un,
      (this.mapPrecomposeKey_ = null),
      (this.mapRenderKey_ = null),
      (this.sourceChangeKey_ = null),
      (this.renderer_ = null),
      (this.sourceReady_ = !1),
      (this.rendered = !1),
      t.render && (this.render = t.render),
      t.map && this.setMap(t.map),
      this.addChangeListener(Z.SOURCE, this.handleSourcePropertyChange_);
    const i = t.source ? t.source : null;
    this.setSource(i);
  }
  getLayersArray(t) {
    return (t = t || []), t.push(this), t;
  }
  getLayerStatesArray(t) {
    return (t = t || []), t.push(this.getLayerState()), t;
  }
  getSource() {
    return this.get(Z.SOURCE) || null;
  }
  getRenderSource() {
    return this.getSource();
  }
  getSourceState() {
    const t = this.getSource();
    return t ? t.getState() : "undefined";
  }
  handleSourceChange_() {
    this.changed(),
      !(this.sourceReady_ || this.getSource().getState() !== "ready") &&
        ((this.sourceReady_ = !0), this.dispatchEvent("sourceready"));
  }
  handleSourcePropertyChange_() {
    this.sourceChangeKey_ &&
      (j(this.sourceChangeKey_), (this.sourceChangeKey_ = null)),
      (this.sourceReady_ = !1);
    const t = this.getSource();
    t &&
      ((this.sourceChangeKey_ = W(t, F.CHANGE, this.handleSourceChange_, this)),
      t.getState() === "ready" &&
        ((this.sourceReady_ = !0),
        setTimeout(() => {
          this.dispatchEvent("sourceready");
        }, 0))),
      this.changed();
  }
  getFeatures(t) {
    return this.renderer_ ? this.renderer_.getFeatures(t) : Promise.resolve([]);
  }
  getData(t) {
    return !this.renderer_ || !this.rendered ? null : this.renderer_.getData(t);
  }
  isVisible(t) {
    let e;
    t instanceof wt
      ? (e = { viewState: t.getState(), extent: t.calculateExtent() })
      : (e = t);
    const i = this.getExtent();
    return (
      this.getVisible() &&
      ms(this.getLayerState(), e.viewState) &&
      (!i || at(i, e.extent))
    );
  }
  getAttributions(t) {
    if (!this.isVisible(t)) return [];
    let e;
    const i = this.getSource();
    if ((i && (e = i.getAttributions()), !e)) return [];
    const n = t instanceof wt ? t.getViewStateAndExtent() : t;
    let r = e(n);
    return Array.isArray(r) || (r = [r]), r;
  }
  render(t, e) {
    const i = this.getRenderer();
    if (i.prepareFrame(t)) return (this.rendered = !0), i.renderFrame(t, e);
  }
  unrender() {
    this.rendered = !1;
  }
  setMapInternal(t) {
    t || this.unrender(), this.set(Z.MAP, t);
  }
  getMapInternal() {
    return this.get(Z.MAP);
  }
  setMap(t) {
    this.mapPrecomposeKey_ &&
      (j(this.mapPrecomposeKey_), (this.mapPrecomposeKey_ = null)),
      t || this.changed(),
      this.mapRenderKey_ &&
        (j(this.mapRenderKey_), (this.mapRenderKey_ = null)),
      t &&
        ((this.mapPrecomposeKey_ = W(
          t,
          ne.PRECOMPOSE,
          function (e) {
            const n = e.frameState.layerStatesArray,
              r = this.getLayerState(!1);
            G(
              !n.some(function (o) {
                return o.layer === r.layer;
              }),
              67
            ),
              n.push(r);
          },
          this
        )),
        (this.mapRenderKey_ = W(this, F.CHANGE, t.render, t)),
        this.changed());
  }
  setSource(t) {
    this.set(Z.SOURCE, t);
  }
  getRenderer() {
    return (
      this.renderer_ || (this.renderer_ = this.createRenderer()), this.renderer_
    );
  }
  hasRenderer() {
    return !!this.renderer_;
  }
  createRenderer() {
    return null;
  }
  disposeInternal() {
    this.renderer_ && (this.renderer_.dispose(), delete this.renderer_),
      this.setSource(null),
      super.disposeInternal();
  }
}
function ms(s, t) {
  if (!s.visible) return !1;
  const e = t.resolution;
  if (e < s.minResolution || e >= s.maxResolution) return !1;
  const i = t.zoom;
  return i > s.minZoom && i <= s.maxZoom;
}
const un = Wl,
  Fi = {
    PRELOAD: "preload",
    USE_INTERIM_TILES_ON_ERROR: "useInterimTilesOnError",
  };
class zl extends un {
  constructor(t) {
    t = t || {};
    const e = Object.assign({}, t);
    delete e.preload,
      delete e.useInterimTilesOnError,
      super(e),
      this.on,
      this.once,
      this.un,
      this.setPreload(t.preload !== void 0 ? t.preload : 0),
      this.setUseInterimTilesOnError(
        t.useInterimTilesOnError !== void 0 ? t.useInterimTilesOnError : !0
      );
  }
  getPreload() {
    return this.get(Fi.PRELOAD);
  }
  setPreload(t) {
    this.set(Fi.PRELOAD, t);
  }
  getUseInterimTilesOnError() {
    return this.get(Fi.USE_INTERIM_TILES_ON_ERROR);
  }
  setUseInterimTilesOnError(t) {
    this.set(Fi.USE_INTERIM_TILES_ON_ERROR, t);
  }
  getData(t) {
    return super.getData(t);
  }
}
const Yl = zl,
  Q = { IDLE: 0, LOADING: 1, LOADED: 2, ERROR: 3, EMPTY: 4 };
class Bl extends kr {
  constructor(t) {
    super(),
      (this.ready = !0),
      (this.boundHandleImageChange_ = this.handleImageChange_.bind(this)),
      (this.layer_ = t),
      (this.declutterExecutorGroup = null);
  }
  getFeatures(t) {
    return X();
  }
  getData(t) {
    return null;
  }
  prepareFrame(t) {
    return X();
  }
  renderFrame(t, e) {
    return X();
  }
  loadedTileCallback(t, e, i) {
    t[e] || (t[e] = {}), (t[e][i.tileCoord.toString()] = i);
  }
  createLoadedTileFinder(t, e, i) {
    return (n, r) => {
      const o = this.loadedTileCallback.bind(this, i, n);
      return t.forEachLoadedTile(e, n, r, o);
    };
  }
  forEachFeatureAtCoordinate(t, e, i, n, r) {}
  getLayer() {
    return this.layer_;
  }
  handleFontsChanged() {}
  handleImageChange_(t) {
    t.target.getState() === Q.LOADED && this.renderIfReadyAndVisible();
  }
  loadImage(t) {
    let e = t.getState();
    return (
      e != Q.LOADED &&
        e != Q.ERROR &&
        t.addEventListener(F.CHANGE, this.boundHandleImageChange_),
      e == Q.IDLE && (t.load(), (e = t.getState())),
      e == Q.LOADED
    );
  }
  renderIfReadyAndVisible() {
    const t = this.getLayer();
    t && t.getVisible() && t.getSourceState() === "ready" && t.changed();
  }
  disposeInternal() {
    delete this.layer_, super.disposeInternal();
  }
}
const Zl = Bl;
class Kl extends Bt {
  constructor(t, e, i, n) {
    super(t),
      (this.inversePixelTransform = e),
      (this.frameState = i),
      (this.context = n);
  }
}
const go = Kl,
  Vl = /^#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})$/i,
  Ul = /^([a-z]*)$|^hsla?\(.*\)$/i;
function _o(s) {
  return typeof s == "string" ? s : mo(s);
}
function jl(s) {
  const t = document.createElement("div");
  if (((t.style.color = s), t.style.color !== "")) {
    document.body.appendChild(t);
    const e = getComputedStyle(t).color;
    return document.body.removeChild(t), e;
  }
  return "";
}
const Hl = (function () {
  const t = {};
  let e = 0;
  return function (i) {
    let n;
    if (t.hasOwnProperty(i)) n = t[i];
    else {
      if (e >= 1024) {
        let r = 0;
        for (const o in t) (r++ & 3) === 0 && (delete t[o], --e);
      }
      (n = $l(i)), (t[i] = n), ++e;
    }
    return n;
  };
})();
function Hi(s) {
  return Array.isArray(s) ? s : Hl(s);
}
function $l(s) {
  let t, e, i, n, r;
  if ((Ul.exec(s) && (s = jl(s)), Vl.exec(s))) {
    const o = s.length - 1;
    let a;
    o <= 4 ? (a = 1) : (a = 2);
    const l = o === 4 || o === 8;
    (t = parseInt(s.substr(1 + 0 * a, a), 16)),
      (e = parseInt(s.substr(1 + 1 * a, a), 16)),
      (i = parseInt(s.substr(1 + 2 * a, a), 16)),
      l ? (n = parseInt(s.substr(1 + 3 * a, a), 16)) : (n = 255),
      a == 1 &&
        ((t = (t << 4) + t),
        (e = (e << 4) + e),
        (i = (i << 4) + i),
        l && (n = (n << 4) + n)),
      (r = [t, e, i, n / 255]);
  } else
    s.startsWith("rgba(")
      ? ((r = s.slice(5, -1).split(",").map(Number)), ar(r))
      : s.startsWith("rgb(")
      ? ((r = s.slice(4, -1).split(",").map(Number)), r.push(1), ar(r))
      : G(!1, 14);
  return r;
}
function ar(s) {
  return (
    (s[0] = J((s[0] + 0.5) | 0, 0, 255)),
    (s[1] = J((s[1] + 0.5) | 0, 0, 255)),
    (s[2] = J((s[2] + 0.5) | 0, 0, 255)),
    (s[3] = J(s[3], 0, 1)),
    s
  );
}
function mo(s) {
  let t = s[0];
  t != (t | 0) && (t = (t + 0.5) | 0);
  let e = s[1];
  e != (e | 0) && (e = (e + 0.5) | 0);
  let i = s[2];
  i != (i | 0) && (i = (i + 0.5) | 0);
  const n = s[3] === void 0 ? 1 : Math.round(s[3] * 100) / 100;
  return "rgba(" + t + "," + e + "," + i + "," + n + ")";
}
function lt(s, t, e, i) {
  let n;
  return (
    e && e.length
      ? (n = e.shift())
      : es
      ? (n = new OffscreenCanvas(s || 300, t || 300))
      : (n = document.createElement("canvas")),
    s && (n.width = s),
    t && (n.height = t),
    n.getContext("2d", i)
  );
}
function dn(s) {
  const t = s.canvas;
  (t.width = 1), (t.height = 1), s.clearRect(0, 0, 1, 1);
}
function lr(s, t) {
  const e = t.parentNode;
  e && e.replaceChild(s, t);
}
function Kn(s) {
  return s && s.parentNode ? s.parentNode.removeChild(s) : null;
}
function ql(s) {
  for (; s.lastChild; ) s.removeChild(s.lastChild);
}
function Jl(s, t) {
  const e = s.childNodes;
  for (let i = 0; ; ++i) {
    const n = e[i],
      r = t[i];
    if (!n && !r) break;
    if (n !== r) {
      if (!n) {
        s.appendChild(r);
        continue;
      }
      if (!r) {
        s.removeChild(n), --i;
        continue;
      }
      s.insertBefore(r, n);
    }
  }
}
const hr = [];
let Ae = null;
function Ql() {
  Ae = lt(1, 1, void 0, { willReadFrequently: !0 });
}
class th extends Zl {
  constructor(t) {
    super(t),
      (this.container = null),
      this.renderedResolution,
      (this.tempTransform = Mt()),
      (this.pixelTransform = Mt()),
      (this.inversePixelTransform = Mt()),
      (this.context = null),
      (this.containerReused = !1),
      (this.pixelContext_ = null),
      (this.frameState = null);
  }
  getImageData(t, e, i) {
    Ae || Ql(), Ae.clearRect(0, 0, 1, 1);
    let n;
    try {
      Ae.drawImage(t, e, i, 1, 1, 0, 0, 1, 1),
        (n = Ae.getImageData(0, 0, 1, 1).data);
    } catch {
      return (Ae = null), null;
    }
    return n;
  }
  getBackground(t) {
    let i = this.getLayer().getBackground();
    return (
      typeof i == "function" && (i = i(t.viewState.resolution)), i || void 0
    );
  }
  useContainer(t, e, i) {
    const n = this.getLayer().getClassName();
    let r, o;
    if (
      t &&
      t.className === n &&
      (!i ||
        (t &&
          t.style.backgroundColor &&
          oe(Hi(t.style.backgroundColor), Hi(i))))
    ) {
      const a = t.firstElementChild;
      a instanceof HTMLCanvasElement && (o = a.getContext("2d"));
    }
    if (
      (o && o.canvas.style.transform === e
        ? ((this.container = t),
          (this.context = o),
          (this.containerReused = !0))
        : this.containerReused &&
          ((this.container = null),
          (this.context = null),
          (this.containerReused = !1)),
      !this.container)
    ) {
      (r = document.createElement("div")), (r.className = n);
      let a = r.style;
      (a.position = "absolute"),
        (a.width = "100%"),
        (a.height = "100%"),
        (o = lt());
      const l = o.canvas;
      r.appendChild(l),
        (a = l.style),
        (a.position = "absolute"),
        (a.left = "0"),
        (a.transformOrigin = "top left"),
        (this.container = r),
        (this.context = o);
    }
    !this.containerReused &&
      i &&
      !this.container.style.backgroundColor &&
      (this.container.style.backgroundColor = i);
  }
  clipUnrotated(t, e, i) {
    const n = me(i),
      r = cn(i),
      o = hn(i),
      a = ln(i);
    it(e.coordinateToPixelTransform, n),
      it(e.coordinateToPixelTransform, r),
      it(e.coordinateToPixelTransform, o),
      it(e.coordinateToPixelTransform, a);
    const l = this.inversePixelTransform;
    it(l, n),
      it(l, r),
      it(l, o),
      it(l, a),
      t.save(),
      t.beginPath(),
      t.moveTo(Math.round(n[0]), Math.round(n[1])),
      t.lineTo(Math.round(r[0]), Math.round(r[1])),
      t.lineTo(Math.round(o[0]), Math.round(o[1])),
      t.lineTo(Math.round(a[0]), Math.round(a[1])),
      t.clip();
  }
  dispatchRenderEvent_(t, e, i) {
    const n = this.getLayer();
    if (n.hasListener(t)) {
      const r = new go(t, this.inversePixelTransform, i, e);
      n.dispatchEvent(r);
    }
  }
  preRender(t, e) {
    (this.frameState = e), this.dispatchRenderEvent_(ne.PRERENDER, t, e);
  }
  postRender(t, e) {
    this.dispatchRenderEvent_(ne.POSTRENDER, t, e);
  }
  getRenderTransform(t, e, i, n, r, o, a) {
    const l = r / 2,
      h = o / 2,
      c = n / e,
      u = -c,
      d = -t[0] + a,
      f = -t[1];
    return re(this.tempTransform, l, h, c, u, -i, d, f);
  }
  disposeInternal() {
    delete this.frameState, super.disposeInternal();
  }
}
const po = th,
  A = { IDLE: 0, LOADING: 1, LOADED: 2, ERROR: 3, EMPTY: 4 };
class eh extends sn {
  constructor(t, e, i) {
    super(),
      (i = i || {}),
      (this.tileCoord = t),
      (this.state = e),
      (this.interimTile = null),
      (this.key = ""),
      (this.transition_ = i.transition === void 0 ? 250 : i.transition),
      (this.transitionStarts_ = {}),
      (this.interpolate = !!i.interpolate);
  }
  changed() {
    this.dispatchEvent(F.CHANGE);
  }
  release() {
    this.state === A.ERROR && this.setState(A.EMPTY);
  }
  getKey() {
    return this.key + "/" + this.tileCoord;
  }
  getInterimTile() {
    if (!this.interimTile) return this;
    let t = this.interimTile;
    do {
      if (t.getState() == A.LOADED) return (this.transition_ = 0), t;
      t = t.interimTile;
    } while (t);
    return this;
  }
  refreshInterimChain() {
    if (!this.interimTile) return;
    let t = this.interimTile,
      e = this;
    do {
      if (t.getState() == A.LOADED) {
        t.interimTile = null;
        break;
      } else
        t.getState() == A.LOADING
          ? (e = t)
          : t.getState() == A.IDLE
          ? (e.interimTile = t.interimTile)
          : (e = t);
      t = e.interimTile;
    } while (t);
  }
  getTileCoord() {
    return this.tileCoord;
  }
  getState() {
    return this.state;
  }
  setState(t) {
    if (this.state !== A.ERROR && this.state > t)
      throw new Error("Tile load sequence violation");
    (this.state = t), this.changed();
  }
  load() {
    X();
  }
  getAlpha(t, e) {
    if (!this.transition_) return 1;
    let i = this.transitionStarts_[t];
    if (!i) (i = e), (this.transitionStarts_[t] = i);
    else if (i === -1) return 1;
    const n = e - i + 1e3 / 60;
    return n >= this.transition_ ? 1 : fo(n / this.transition_);
  }
  inTransition(t) {
    return this.transition_ ? this.transitionStarts_[t] !== -1 : !1;
  }
  endTransition(t) {
    this.transition_ && (this.transitionStarts_[t] = -1);
  }
}
const yo = eh;
function xo(s, t, e) {
  const i = s;
  let n = !0,
    r = !1,
    o = !1;
  const a = [
    Bi(i, F.LOAD, function () {
      (o = !0), r || t();
    }),
  ];
  return (
    i.src && Ia
      ? ((r = !0),
        i
          .decode()
          .then(function () {
            n && t();
          })
          .catch(function (l) {
            n && (o ? t() : e());
          }))
      : a.push(Bi(i, F.ERROR, e)),
    function () {
      (n = !1), a.forEach(j);
    }
  );
}
class ih extends yo {
  constructor(t, e, i, n, r, o) {
    super(t, e, o),
      (this.crossOrigin_ = n),
      (this.src_ = i),
      (this.key = i),
      (this.image_ = new Image()),
      n !== null && (this.image_.crossOrigin = n),
      (this.unlisten_ = null),
      (this.tileLoadFunction_ = r);
  }
  getImage() {
    return this.image_;
  }
  setImage(t) {
    (this.image_ = t),
      (this.state = A.LOADED),
      this.unlistenImage_(),
      this.changed();
  }
  handleImageError_() {
    (this.state = A.ERROR),
      this.unlistenImage_(),
      (this.image_ = nh()),
      this.changed();
  }
  handleImageLoad_() {
    const t = this.image_;
    t.naturalWidth && t.naturalHeight
      ? (this.state = A.LOADED)
      : (this.state = A.EMPTY),
      this.unlistenImage_(),
      this.changed();
  }
  load() {
    this.state == A.ERROR &&
      ((this.state = A.IDLE),
      (this.image_ = new Image()),
      this.crossOrigin_ !== null &&
        (this.image_.crossOrigin = this.crossOrigin_)),
      this.state == A.IDLE &&
        ((this.state = A.LOADING),
        this.changed(),
        this.tileLoadFunction_(this, this.src_),
        (this.unlisten_ = xo(
          this.image_,
          this.handleImageLoad_.bind(this),
          this.handleImageError_.bind(this)
        )));
  }
  unlistenImage_() {
    this.unlisten_ && (this.unlisten_(), (this.unlisten_ = null));
  }
}
function nh() {
  const s = lt(1, 1);
  return (s.fillStyle = "rgba(0,0,0,0)"), s.fillRect(0, 0, 1, 1), s.canvas;
}
const Eo = ih,
  sh = 0.5,
  rh = 10,
  cr = 0.25;
class oh {
  constructor(t, e, i, n, r, o) {
    (this.sourceProj_ = t), (this.targetProj_ = e);
    let a = {};
    const l = Vi(this.targetProj_, this.sourceProj_);
    (this.transformInv_ = function (y) {
      const x = y[0] + "/" + y[1];
      return a[x] || (a[x] = l(y)), a[x];
    }),
      (this.maxSourceExtent_ = n),
      (this.errorThresholdSquared_ = r * r),
      (this.triangles_ = []),
      (this.wrapsXInSource_ = !1),
      (this.canWrapXInSource_ =
        this.sourceProj_.canWrapX() &&
        !!n &&
        !!this.sourceProj_.getExtent() &&
        U(n) == U(this.sourceProj_.getExtent())),
      (this.sourceWorldWidth_ = this.sourceProj_.getExtent()
        ? U(this.sourceProj_.getExtent())
        : null),
      (this.targetWorldWidth_ = this.targetProj_.getExtent()
        ? U(this.targetProj_.getExtent())
        : null);
    const h = me(i),
      c = cn(i),
      u = hn(i),
      d = ln(i),
      f = this.transformInv_(h),
      g = this.transformInv_(c),
      _ = this.transformInv_(u),
      m = this.transformInv_(d),
      p =
        rh +
        (o
          ? Math.max(0, Math.ceil(Math.log2(Xn(i) / (o * o * 256 * 256))))
          : 0);
    if ((this.addQuad_(h, c, u, d, f, g, _, m, p), this.wrapsXInSource_)) {
      let y = 1 / 0;
      this.triangles_.forEach(function (x, E, C) {
        y = Math.min(y, x.source[0][0], x.source[1][0], x.source[2][0]);
      }),
        this.triangles_.forEach((x) => {
          if (
            Math.max(x.source[0][0], x.source[1][0], x.source[2][0]) - y >
            this.sourceWorldWidth_ / 2
          ) {
            const E = [
              [x.source[0][0], x.source[0][1]],
              [x.source[1][0], x.source[1][1]],
              [x.source[2][0], x.source[2][1]],
            ];
            E[0][0] - y > this.sourceWorldWidth_ / 2 &&
              (E[0][0] -= this.sourceWorldWidth_),
              E[1][0] - y > this.sourceWorldWidth_ / 2 &&
                (E[1][0] -= this.sourceWorldWidth_),
              E[2][0] - y > this.sourceWorldWidth_ / 2 &&
                (E[2][0] -= this.sourceWorldWidth_);
            const C = Math.min(E[0][0], E[1][0], E[2][0]);
            Math.max(E[0][0], E[1][0], E[2][0]) - C <
              this.sourceWorldWidth_ / 2 && (x.source = E);
          }
        });
    }
    a = {};
  }
  addTriangle_(t, e, i, n, r, o) {
    this.triangles_.push({ source: [n, r, o], target: [t, e, i] });
  }
  addQuad_(t, e, i, n, r, o, a, l, h) {
    const c = Bs([r, o, a, l]),
      u = this.sourceWorldWidth_ ? U(c) / this.sourceWorldWidth_ : null,
      d = this.sourceWorldWidth_,
      f = this.sourceProj_.canWrapX() && u > 0.5 && u < 1;
    let g = !1;
    if (h > 0) {
      if (this.targetProj_.isGlobal() && this.targetWorldWidth_) {
        const m = Bs([t, e, i, n]);
        g = U(m) / this.targetWorldWidth_ > cr || g;
      }
      !f && this.sourceProj_.isGlobal() && u && (g = u > cr || g);
    }
    if (
      !g &&
      this.maxSourceExtent_ &&
      isFinite(c[0]) &&
      isFinite(c[1]) &&
      isFinite(c[2]) &&
      isFinite(c[3]) &&
      !at(c, this.maxSourceExtent_)
    )
      return;
    let _ = 0;
    if (
      !g &&
      (!isFinite(r[0]) ||
        !isFinite(r[1]) ||
        !isFinite(o[0]) ||
        !isFinite(o[1]) ||
        !isFinite(a[0]) ||
        !isFinite(a[1]) ||
        !isFinite(l[0]) ||
        !isFinite(l[1]))
    ) {
      if (h > 0) g = !0;
      else if (
        ((_ =
          (!isFinite(r[0]) || !isFinite(r[1]) ? 8 : 0) +
          (!isFinite(o[0]) || !isFinite(o[1]) ? 4 : 0) +
          (!isFinite(a[0]) || !isFinite(a[1]) ? 2 : 0) +
          (!isFinite(l[0]) || !isFinite(l[1]) ? 1 : 0)),
        _ != 1 && _ != 2 && _ != 4 && _ != 8)
      )
        return;
    }
    if (h > 0) {
      if (!g) {
        const m = [(t[0] + i[0]) / 2, (t[1] + i[1]) / 2],
          p = this.transformInv_(m);
        let y;
        f
          ? (y = (Ge(r[0], d) + Ge(a[0], d)) / 2 - Ge(p[0], d))
          : (y = (r[0] + a[0]) / 2 - p[0]);
        const x = (r[1] + a[1]) / 2 - p[1];
        g = y * y + x * x > this.errorThresholdSquared_;
      }
      if (g) {
        if (Math.abs(t[0] - i[0]) <= Math.abs(t[1] - i[1])) {
          const m = [(e[0] + i[0]) / 2, (e[1] + i[1]) / 2],
            p = this.transformInv_(m),
            y = [(n[0] + t[0]) / 2, (n[1] + t[1]) / 2],
            x = this.transformInv_(y);
          this.addQuad_(t, e, m, y, r, o, p, x, h - 1),
            this.addQuad_(y, m, i, n, x, p, a, l, h - 1);
        } else {
          const m = [(t[0] + e[0]) / 2, (t[1] + e[1]) / 2],
            p = this.transformInv_(m),
            y = [(i[0] + n[0]) / 2, (i[1] + n[1]) / 2],
            x = this.transformInv_(y);
          this.addQuad_(t, m, y, n, r, p, x, l, h - 1),
            this.addQuad_(m, e, i, y, p, o, a, x, h - 1);
        }
        return;
      }
    }
    if (f) {
      if (!this.canWrapXInSource_) return;
      this.wrapsXInSource_ = !0;
    }
    (_ & 11) == 0 && this.addTriangle_(t, i, n, r, a, l),
      (_ & 14) == 0 && this.addTriangle_(t, i, e, r, a, o),
      _ &&
        ((_ & 13) == 0 && this.addTriangle_(e, n, t, o, l, r),
        (_ & 7) == 0 && this.addTriangle_(e, n, i, o, l, a));
  }
  calculateSourceExtent() {
    const t = Tt();
    return (
      this.triangles_.forEach(function (e, i, n) {
        const r = e.source;
        ti(t, r[0]), ti(t, r[1]), ti(t, r[2]);
      }),
      t
    );
  }
  getTriangles() {
    return this.triangles_;
  }
}
const ah = oh;
let vn;
const Xe = [];
function ur(s, t, e, i, n) {
  s.beginPath(),
    s.moveTo(0, 0),
    s.lineTo(t, e),
    s.lineTo(i, n),
    s.closePath(),
    s.save(),
    s.clip(),
    s.fillRect(0, 0, Math.max(t, i) + 1, Math.max(e, n)),
    s.restore();
}
function Ln(s, t) {
  return (
    Math.abs(s[t * 4] - 210) > 2 || Math.abs(s[t * 4 + 3] - 0.75 * 255) > 2
  );
}
function lh() {
  if (vn === void 0) {
    const s = lt(6, 6, Xe);
    (s.globalCompositeOperation = "lighter"),
      (s.fillStyle = "rgba(210, 0, 0, 0.75)"),
      ur(s, 4, 5, 4, 0),
      ur(s, 4, 5, 0, 5);
    const t = s.getImageData(0, 0, 3, 3).data;
    (vn = Ln(t, 0) || Ln(t, 4) || Ln(t, 8)), dn(s), Xe.push(s.canvas);
  }
  return vn;
}
function dr(s, t, e, i) {
  const n = Qr(e, t, s);
  let r = js(t, i, e);
  const o = t.getMetersPerUnit();
  o !== void 0 && (r *= o);
  const a = s.getMetersPerUnit();
  a !== void 0 && (r /= a);
  const l = s.getExtent();
  if (!l || on(l, n)) {
    const h = js(s, r, n) / r;
    isFinite(h) && h > 0 && (r /= h);
  }
  return r;
}
function hh(s, t, e, i) {
  const n = Be(e);
  let r = dr(s, t, n, i);
  return (
    (!isFinite(r) || r <= 0) &&
      Kr(e, function (o) {
        return (r = dr(s, t, o, i)), isFinite(r) && r > 0;
      }),
    r
  );
}
function ch(s, t, e, i, n, r, o, a, l, h, c, u) {
  const d = lt(Math.round(e * s), Math.round(e * t), Xe);
  if ((u || (d.imageSmoothingEnabled = !1), l.length === 0)) return d.canvas;
  d.scale(e, e);
  function f(E) {
    return Math.round(E * e) / e;
  }
  d.globalCompositeOperation = "lighter";
  const g = Tt();
  l.forEach(function (E, C, T) {
    Oa(g, E.extent);
  });
  const _ = U(g),
    m = Ot(g),
    p = lt(Math.round((e * _) / i), Math.round((e * m) / i), Xe);
  u || (p.imageSmoothingEnabled = !1);
  const y = e / i;
  l.forEach(function (E, C, T) {
    const w = E.extent[0] - g[0],
      S = -(E.extent[3] - g[3]),
      v = U(E.extent),
      M = Ot(E.extent);
    E.image.width > 0 &&
      E.image.height > 0 &&
      p.drawImage(
        E.image,
        h,
        h,
        E.image.width - 2 * h,
        E.image.height - 2 * h,
        w * y,
        S * y,
        v * y,
        M * y
      );
  });
  const x = me(o);
  return (
    a.getTriangles().forEach(function (E, C, T) {
      const w = E.source,
        S = E.target;
      let v = w[0][0],
        M = w[0][1],
        N = w[1][0],
        k = w[1][1],
        P = w[2][0],
        q = w[2][1];
      const L = f((S[0][0] - x[0]) / r),
        b = f(-(S[0][1] - x[1]) / r),
        I = f((S[1][0] - x[0]) / r),
        D = f(-(S[1][1] - x[1]) / r),
        K = f((S[2][0] - x[0]) / r),
        B = f(-(S[2][1] - x[1]) / r),
        tt = v,
        R = M;
      (v = 0), (M = 0), (N -= tt), (k -= R), (P -= tt), (q -= R);
      const dt = [
          [N, k, 0, 0, I - L],
          [P, q, 0, 0, K - L],
          [0, 0, N, k, D - b],
          [0, 0, P, q, B - b],
        ],
        Y = ja(dt);
      if (!!Y) {
        if ((d.save(), d.beginPath(), lh() || !u)) {
          d.moveTo(I, D);
          const V = 4,
            Zt = L - I,
            St = b - D;
          for (let nt = 0; nt < V; nt++)
            d.lineTo(I + f(((nt + 1) * Zt) / V), D + f((nt * St) / (V - 1))),
              nt != V - 1 &&
                d.lineTo(
                  I + f(((nt + 1) * Zt) / V),
                  D + f(((nt + 1) * St) / (V - 1))
                );
          d.lineTo(K, B);
        } else d.moveTo(I, D), d.lineTo(L, b), d.lineTo(K, B);
        d.clip(),
          d.transform(Y[0], Y[2], Y[1], Y[3], L, b),
          d.translate(g[0] - tt, g[3] - R),
          d.scale(i / e, -i / e),
          d.drawImage(p.canvas, 0, 0),
          d.restore();
      }
    }),
    dn(p),
    Xe.push(p.canvas),
    c &&
      (d.save(),
      (d.globalCompositeOperation = "source-over"),
      (d.strokeStyle = "black"),
      (d.lineWidth = 1),
      a.getTriangles().forEach(function (E, C, T) {
        const w = E.target,
          S = (w[0][0] - x[0]) / r,
          v = -(w[0][1] - x[1]) / r,
          M = (w[1][0] - x[0]) / r,
          N = -(w[1][1] - x[1]) / r,
          k = (w[2][0] - x[0]) / r,
          P = -(w[2][1] - x[1]) / r;
        d.beginPath(),
          d.moveTo(M, N),
          d.lineTo(S, v),
          d.lineTo(k, P),
          d.closePath(),
          d.stroke();
      }),
      d.restore()),
    d.canvas
  );
}
class uh extends yo {
  constructor(t, e, i, n, r, o, a, l, h, c, u, d) {
    super(r, A.IDLE, { interpolate: !!d }),
      (this.renderEdges_ = u !== void 0 ? u : !1),
      (this.pixelRatio_ = a),
      (this.gutter_ = l),
      (this.canvas_ = null),
      (this.sourceTileGrid_ = e),
      (this.targetTileGrid_ = n),
      (this.wrappedTileCoord_ = o || r),
      (this.sourceTiles_ = []),
      (this.sourcesListenerKeys_ = null),
      (this.sourceZ_ = 0);
    const f = n.getTileCoordExtent(this.wrappedTileCoord_),
      g = this.targetTileGrid_.getExtent();
    let _ = this.sourceTileGrid_.getExtent();
    const m = g ? ei(f, g) : f;
    if (Xn(m) === 0) {
      this.state = A.EMPTY;
      return;
    }
    const p = t.getExtent();
    p && (_ ? (_ = ei(_, p)) : (_ = p));
    const y = n.getResolution(this.wrappedTileCoord_[0]),
      x = hh(t, i, m, y);
    if (!isFinite(x) || x <= 0) {
      this.state = A.EMPTY;
      return;
    }
    const E = c !== void 0 ? c : sh;
    if (
      ((this.triangulation_ = new ah(t, i, m, _, x * E, y)),
      this.triangulation_.getTriangles().length === 0)
    ) {
      this.state = A.EMPTY;
      return;
    }
    this.sourceZ_ = e.getZForResolution(x);
    let C = this.triangulation_.calculateSourceExtent();
    if (
      (_ &&
        (t.canWrapX()
          ? ((C[1] = J(C[1], _[1], _[3])), (C[3] = J(C[3], _[1], _[3])))
          : (C = ei(C, _))),
      !Xn(C))
    )
      this.state = A.EMPTY;
    else {
      const T = e.getTileRangeForExtentAndZ(C, this.sourceZ_);
      for (let w = T.minX; w <= T.maxX; w++)
        for (let S = T.minY; S <= T.maxY; S++) {
          const v = h(this.sourceZ_, w, S, a);
          v && this.sourceTiles_.push(v);
        }
      this.sourceTiles_.length === 0 && (this.state = A.EMPTY);
    }
  }
  getImage() {
    return this.canvas_;
  }
  reproject_() {
    const t = [];
    if (
      (this.sourceTiles_.forEach((e) => {
        e &&
          e.getState() == A.LOADED &&
          t.push({
            extent: this.sourceTileGrid_.getTileCoordExtent(e.tileCoord),
            image: e.getImage(),
          });
      }),
      (this.sourceTiles_.length = 0),
      t.length === 0)
    )
      this.state = A.ERROR;
    else {
      const e = this.wrappedTileCoord_[0],
        i = this.targetTileGrid_.getTileSize(e),
        n = typeof i == "number" ? i : i[0],
        r = typeof i == "number" ? i : i[1],
        o = this.targetTileGrid_.getResolution(e),
        a = this.sourceTileGrid_.getResolution(this.sourceZ_),
        l = this.targetTileGrid_.getTileCoordExtent(this.wrappedTileCoord_);
      (this.canvas_ = ch(
        n,
        r,
        this.pixelRatio_,
        a,
        this.sourceTileGrid_.getExtent(),
        o,
        l,
        this.triangulation_,
        t,
        this.gutter_,
        this.renderEdges_,
        this.interpolate
      )),
        (this.state = A.LOADED);
    }
    this.changed();
  }
  load() {
    if (this.state == A.IDLE) {
      (this.state = A.LOADING), this.changed();
      let t = 0;
      (this.sourcesListenerKeys_ = []),
        this.sourceTiles_.forEach((e) => {
          const i = e.getState();
          if (i == A.IDLE || i == A.LOADING) {
            t++;
            const n = W(
              e,
              F.CHANGE,
              function (r) {
                const o = e.getState();
                (o == A.LOADED || o == A.ERROR || o == A.EMPTY) &&
                  (j(n),
                  t--,
                  t === 0 && (this.unlistenSources_(), this.reproject_()));
              },
              this
            );
            this.sourcesListenerKeys_.push(n);
          }
        }),
        t === 0
          ? setTimeout(this.reproject_.bind(this), 0)
          : this.sourceTiles_.forEach(function (e, i, n) {
              e.getState() == A.IDLE && e.load();
            });
    }
  }
  unlistenSources_() {
    this.sourcesListenerKeys_.forEach(j), (this.sourcesListenerKeys_ = null);
  }
  release() {
    this.canvas_ &&
      (dn(this.canvas_.getContext("2d")),
      Xe.push(this.canvas_),
      (this.canvas_ = null)),
      super.release();
  }
}
const Vn = uh;
class Co {
  constructor(t, e, i, n) {
    (this.minX = t), (this.maxX = e), (this.minY = i), (this.maxY = n);
  }
  contains(t) {
    return this.containsXY(t[1], t[2]);
  }
  containsTileRange(t) {
    return (
      this.minX <= t.minX &&
      t.maxX <= this.maxX &&
      this.minY <= t.minY &&
      t.maxY <= this.maxY
    );
  }
  containsXY(t, e) {
    return this.minX <= t && t <= this.maxX && this.minY <= e && e <= this.maxY;
  }
  equals(t) {
    return (
      this.minX == t.minX &&
      this.minY == t.minY &&
      this.maxX == t.maxX &&
      this.maxY == t.maxY
    );
  }
  extend(t) {
    t.minX < this.minX && (this.minX = t.minX),
      t.maxX > this.maxX && (this.maxX = t.maxX),
      t.minY < this.minY && (this.minY = t.minY),
      t.maxY > this.maxY && (this.maxY = t.maxY);
  }
  getHeight() {
    return this.maxY - this.minY + 1;
  }
  getSize() {
    return [this.getWidth(), this.getHeight()];
  }
  getWidth() {
    return this.maxX - this.minX + 1;
  }
  intersects(t) {
    return (
      this.minX <= t.maxX &&
      this.maxX >= t.minX &&
      this.minY <= t.maxY &&
      this.maxY >= t.minY
    );
  }
}
function Ie(s, t, e, i, n) {
  return n !== void 0
    ? ((n.minX = s), (n.maxX = t), (n.minY = e), (n.maxY = i), n)
    : new Co(s, t, e, i);
}
const Ro = Co;
function fr(s) {
  return s[0] > 0 && s[1] > 0;
}
function dh(s, t, e) {
  return (
    e === void 0 && (e = [0, 0]),
    (e[0] = (s[0] * t + 0.5) | 0),
    (e[1] = (s[1] * t + 0.5) | 0),
    e
  );
}
function _t(s, t) {
  return Array.isArray(s)
    ? s
    : (t === void 0 ? (t = [s, s]) : ((t[0] = s), (t[1] = s)), t);
}
class fh extends po {
  constructor(t) {
    super(t),
      (this.extentChanged = !0),
      (this.renderedExtent_ = null),
      this.renderedPixelRatio,
      (this.renderedProjection = null),
      this.renderedRevision,
      (this.renderedTiles = []),
      (this.newTiles_ = !1),
      (this.tmpExtent = Tt()),
      (this.tmpTileRange_ = new Ro(0, 0, 0, 0));
  }
  isDrawableTile(t) {
    const e = this.getLayer(),
      i = t.getState(),
      n = e.getUseInterimTilesOnError();
    return i == A.LOADED || i == A.EMPTY || (i == A.ERROR && !n);
  }
  getTile(t, e, i, n) {
    const r = n.pixelRatio,
      o = n.viewState.projection,
      a = this.getLayer();
    let h = a.getSource().getTile(t, e, i, r, o);
    return (
      h.getState() == A.ERROR &&
        a.getUseInterimTilesOnError() &&
        a.getPreload() > 0 &&
        (this.newTiles_ = !0),
      this.isDrawableTile(h) || (h = h.getInterimTile()),
      h
    );
  }
  getData(t) {
    const e = this.frameState;
    if (!e) return null;
    const i = this.getLayer(),
      n = it(e.pixelToCoordinateTransform, t.slice()),
      r = i.getExtent();
    if (r && !on(r, n)) return null;
    const o = e.pixelRatio,
      a = e.viewState.projection,
      l = e.viewState,
      h = i.getRenderSource(),
      c = h.getTileGridForProjection(l.projection),
      u = h.getTilePixelRatio(e.pixelRatio);
    for (let d = c.getZForResolution(l.resolution); d >= c.getMinZoom(); --d) {
      const f = c.getTileCoordForCoordAndZ(n, d),
        g = h.getTile(d, f[1], f[2], o, a);
      if (
        !(g instanceof Eo || g instanceof Vn) ||
        (g instanceof Vn && g.getState() === A.EMPTY)
      )
        return null;
      if (g.getState() !== A.LOADED) continue;
      const _ = c.getOrigin(d),
        m = _t(c.getTileSize(d)),
        p = c.getResolution(d),
        y = Math.floor(u * ((n[0] - _[0]) / p - f[1] * m[0])),
        x = Math.floor(u * ((_[1] - n[1]) / p - f[2] * m[1])),
        E = Math.round(u * h.getGutterForProjection(l.projection));
      return this.getImageData(g.getImage(), y + E, x + E);
    }
    return null;
  }
  loadedTileCallback(t, e, i) {
    return this.isDrawableTile(i) ? super.loadedTileCallback(t, e, i) : !1;
  }
  prepareFrame(t) {
    return !!this.getLayer().getSource();
  }
  renderFrame(t, e) {
    const i = t.layerStatesArray[t.layerIndex],
      n = t.viewState,
      r = n.projection,
      o = n.resolution,
      a = n.center,
      l = n.rotation,
      h = t.pixelRatio,
      c = this.getLayer(),
      u = c.getSource(),
      d = u.getRevision(),
      f = u.getTileGridForProjection(r),
      g = f.getZForResolution(o, u.zDirection),
      _ = f.getResolution(g);
    let m = t.extent;
    const p = t.viewState.resolution,
      y = u.getTilePixelRatio(h),
      x = Math.round((U(m) / p) * h),
      E = Math.round((Ot(m) / p) * h),
      C = i.extent && ue(i.extent);
    C && (m = ei(m, ue(i.extent)));
    const T = (_ * x) / 2 / y,
      w = (_ * E) / 2 / y,
      S = [a[0] - T, a[1] - w, a[0] + T, a[1] + w],
      v = f.getTileRangeForExtentAndZ(m, g),
      M = {};
    M[g] = {};
    const N = this.createLoadedTileFinder(u, r, M),
      k = this.tmpExtent,
      P = this.tmpTileRange_;
    this.newTiles_ = !1;
    const q = l ? zn(n.center, p, l, t.size) : void 0;
    for (let dt = v.minX; dt <= v.maxX; ++dt)
      for (let Y = v.minY; Y <= v.maxY; ++Y) {
        if (l && !f.tileCoordIntersectsViewport([g, dt, Y], q)) continue;
        const V = this.getTile(g, dt, Y, t);
        if (this.isDrawableTile(V)) {
          const nt = z(this);
          if (V.getState() == A.LOADED) {
            M[g][V.tileCoord.toString()] = V;
            let Pt = V.inTransition(nt);
            Pt && i.opacity !== 1 && (V.endTransition(nt), (Pt = !1)),
              !this.newTiles_ &&
                (Pt || !this.renderedTiles.includes(V)) &&
                (this.newTiles_ = !0);
          }
          if (V.getAlpha(nt, t.time) === 1) continue;
        }
        const Zt = f.getTileCoordChildTileRange(V.tileCoord, P, k);
        let St = !1;
        Zt && (St = N(g + 1, Zt)),
          St || f.forEachTileCoordParentTileRange(V.tileCoord, N, P, k);
      }
    const L = ((_ / o) * h) / y;
    re(
      this.pixelTransform,
      t.size[0] / 2,
      t.size[1] / 2,
      1 / h,
      1 / h,
      l,
      -x / 2,
      -E / 2
    );
    const b = Wr(this.pixelTransform);
    this.useContainer(e, b, this.getBackground(t));
    const I = this.context,
      D = I.canvas;
    is(this.inversePixelTransform, this.pixelTransform),
      re(this.tempTransform, x / 2, E / 2, L, L, 0, -x / 2, -E / 2),
      D.width != x || D.height != E
        ? ((D.width = x), (D.height = E))
        : this.containerReused || I.clearRect(0, 0, x, E),
      C && this.clipUnrotated(I, t, C),
      u.getInterpolate() || (I.imageSmoothingEnabled = !1),
      this.preRender(I, t),
      (this.renderedTiles.length = 0);
    let K = Object.keys(M).map(Number);
    K.sort(ze);
    let B, tt, R;
    i.opacity === 1 &&
    (!this.containerReused || u.getOpaque(t.viewState.projection))
      ? (K = K.reverse())
      : ((B = []), (tt = []));
    for (let dt = K.length - 1; dt >= 0; --dt) {
      const Y = K[dt],
        V = u.getTilePixelSize(Y, h, r),
        St = f.getResolution(Y) / _,
        nt = V[0] * St * L,
        Pt = V[1] * St * L,
        pe = f.getTileCoordForCoordAndZ(me(S), Y),
        Ti = f.getTileCoordExtent(pe),
        ye = it(this.tempTransform, [
          (y * (Ti[0] - S[0])) / _,
          (y * (S[3] - Ti[3])) / _,
        ]),
        Ii = y * u.getGutterForProjection(r),
        Kt = M[Y];
      for (const Ve in Kt) {
        const Vt = Kt[Ve],
          Si = Vt.tileCoord,
          wi = pe[1] - Si[1],
          vi = Math.round(ye[0] - (wi - 1) * nt),
          xe = pe[2] - Si[2],
          pn = Math.round(ye[1] - (xe - 1) * Pt),
          ht = Math.round(ye[0] - wi * nt),
          mt = Math.round(ye[1] - xe * Pt),
          xt = vi - ht,
          Dt = pn - mt,
          Ee = g === Y,
          ae = Ee && Vt.getAlpha(z(this), t.time) !== 1;
        let Ut = !1;
        if (!ae)
          if (B) {
            R = [ht, mt, ht + xt, mt, ht + xt, mt + Dt, ht, mt + Dt];
            for (let Ce = 0, Li = B.length; Ce < Li; ++Ce)
              if (g !== Y && Y < tt[Ce]) {
                const ot = B[Ce];
                at([ht, mt, ht + xt, mt + Dt], [ot[0], ot[3], ot[4], ot[7]]) &&
                  (Ut || (I.save(), (Ut = !0)),
                  I.beginPath(),
                  I.moveTo(R[0], R[1]),
                  I.lineTo(R[2], R[3]),
                  I.lineTo(R[4], R[5]),
                  I.lineTo(R[6], R[7]),
                  I.moveTo(ot[6], ot[7]),
                  I.lineTo(ot[4], ot[5]),
                  I.lineTo(ot[2], ot[3]),
                  I.lineTo(ot[0], ot[1]),
                  I.clip());
              }
            B.push(R), tt.push(Y);
          } else I.clearRect(ht, mt, xt, Dt);
        this.drawTileImage(Vt, t, ht, mt, xt, Dt, Ii, Ee),
          B && !ae
            ? (Ut && I.restore(), this.renderedTiles.unshift(Vt))
            : this.renderedTiles.push(Vt),
          this.updateUsedTiles(t.usedTiles, u, Vt);
      }
    }
    return (
      (this.renderedRevision = d),
      (this.renderedResolution = _),
      (this.extentChanged =
        !this.renderedExtent_ || !ri(this.renderedExtent_, S)),
      (this.renderedExtent_ = S),
      (this.renderedPixelRatio = h),
      (this.renderedProjection = r),
      this.manageTilePyramid(t, u, f, h, r, m, g, c.getPreload()),
      this.scheduleExpireCache(t, u),
      this.postRender(I, t),
      i.extent && I.restore(),
      (I.imageSmoothingEnabled = !0),
      b !== D.style.transform && (D.style.transform = b),
      this.container
    );
  }
  drawTileImage(t, e, i, n, r, o, a, l) {
    const h = this.getTileImage(t);
    if (!h) return;
    const c = z(this),
      u = e.layerStatesArray[e.layerIndex],
      d = u.opacity * (l ? t.getAlpha(c, e.time) : 1),
      f = d !== this.context.globalAlpha;
    f && (this.context.save(), (this.context.globalAlpha = d)),
      this.context.drawImage(
        h,
        a,
        a,
        h.width - 2 * a,
        h.height - 2 * a,
        i,
        n,
        r,
        o
      ),
      f && this.context.restore(),
      d !== u.opacity ? (e.animate = !0) : l && t.endTransition(c);
  }
  getImage() {
    const t = this.context;
    return t ? t.canvas : null;
  }
  getTileImage(t) {
    return t.getImage();
  }
  scheduleExpireCache(t, e) {
    if (e.canExpireCache()) {
      const i = function (n, r, o) {
        const a = z(n);
        a in o.usedTiles &&
          n.expireCache(o.viewState.projection, o.usedTiles[a]);
      }.bind(null, e);
      t.postRenderFunctions.push(i);
    }
  }
  updateUsedTiles(t, e, i) {
    const n = z(e);
    n in t || (t[n] = {}), (t[n][i.getKey()] = !0);
  }
  manageTilePyramid(t, e, i, n, r, o, a, l, h) {
    const c = z(e);
    c in t.wantedTiles || (t.wantedTiles[c] = {});
    const u = t.wantedTiles[c],
      d = t.tileQueue,
      f = i.getMinZoom(),
      g = t.viewState.rotation,
      _ = g
        ? zn(t.viewState.center, t.viewState.resolution, g, t.size)
        : void 0;
    let m = 0,
      p,
      y,
      x,
      E,
      C,
      T;
    for (T = f; T <= a; ++T)
      for (
        y = i.getTileRangeForExtentAndZ(o, T, y),
          x = i.getResolution(T),
          E = y.minX;
        E <= y.maxX;
        ++E
      )
        for (C = y.minY; C <= y.maxY; ++C)
          (g && !i.tileCoordIntersectsViewport([T, E, C], _)) ||
            (a - T <= l
              ? (++m,
                (p = e.getTile(T, E, C, n, r)),
                p.getState() == A.IDLE &&
                  ((u[p.getKey()] = !0),
                  d.isKeyQueued(p.getKey()) ||
                    d.enqueue([p, c, i.getTileCoordCenter(p.tileCoord), x])),
                h !== void 0 && h(p))
              : e.useTile(T, E, C, r));
    e.updateCacheSize(m, r);
  }
}
const gh = fh;
class _h extends Yl {
  constructor(t) {
    super(t);
  }
  createRenderer() {
    return new gh(this);
  }
}
const mh = _h;
function ph(s, t, e, i, n) {
  To(s, t, e || 0, i || s.length - 1, n || yh);
}
function To(s, t, e, i, n) {
  for (; i > e; ) {
    if (i - e > 600) {
      var r = i - e + 1,
        o = t - e + 1,
        a = Math.log(r),
        l = 0.5 * Math.exp((2 * a) / 3),
        h = 0.5 * Math.sqrt((a * l * (r - l)) / r) * (o - r / 2 < 0 ? -1 : 1),
        c = Math.max(e, Math.floor(t - (o * l) / r + h)),
        u = Math.min(i, Math.floor(t + ((r - o) * l) / r + h));
      To(s, t, c, u, n);
    }
    var d = s[t],
      f = e,
      g = i;
    for ($e(s, e, t), n(s[i], d) > 0 && $e(s, e, i); f < g; ) {
      for ($e(s, f, g), f++, g--; n(s[f], d) < 0; ) f++;
      for (; n(s[g], d) > 0; ) g--;
    }
    n(s[e], d) === 0 ? $e(s, e, g) : (g++, $e(s, g, i)),
      g <= t && (e = g + 1),
      t <= g && (i = g - 1);
  }
}
function $e(s, t, e) {
  var i = s[t];
  (s[t] = s[e]), (s[e] = i);
}
function yh(s, t) {
  return s < t ? -1 : s > t ? 1 : 0;
}
class Io {
  constructor(t = 9) {
    (this._maxEntries = Math.max(4, t)),
      (this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4))),
      this.clear();
  }
  all() {
    return this._all(this.data, []);
  }
  search(t) {
    let e = this.data;
    const i = [];
    if (!Ni(t, e)) return i;
    const n = this.toBBox,
      r = [];
    for (; e; ) {
      for (let o = 0; o < e.children.length; o++) {
        const a = e.children[o],
          l = e.leaf ? n(a) : a;
        Ni(t, l) &&
          (e.leaf ? i.push(a) : Mn(t, l) ? this._all(a, i) : r.push(a));
      }
      e = r.pop();
    }
    return i;
  }
  collides(t) {
    let e = this.data;
    if (!Ni(t, e)) return !1;
    const i = [];
    for (; e; ) {
      for (let n = 0; n < e.children.length; n++) {
        const r = e.children[n],
          o = e.leaf ? this.toBBox(r) : r;
        if (Ni(t, o)) {
          if (e.leaf || Mn(t, o)) return !0;
          i.push(r);
        }
      }
      e = i.pop();
    }
    return !1;
  }
  load(t) {
    if (!(t && t.length)) return this;
    if (t.length < this._minEntries) {
      for (let i = 0; i < t.length; i++) this.insert(t[i]);
      return this;
    }
    let e = this._build(t.slice(), 0, t.length - 1, 0);
    if (!this.data.children.length) this.data = e;
    else if (this.data.height === e.height) this._splitRoot(this.data, e);
    else {
      if (this.data.height < e.height) {
        const i = this.data;
        (this.data = e), (e = i);
      }
      this._insert(e, this.data.height - e.height - 1, !0);
    }
    return this;
  }
  insert(t) {
    return t && this._insert(t, this.data.height - 1), this;
  }
  clear() {
    return (this.data = Me([])), this;
  }
  remove(t, e) {
    if (!t) return this;
    let i = this.data;
    const n = this.toBBox(t),
      r = [],
      o = [];
    let a, l, h;
    for (; i || r.length; ) {
      if (
        (i || ((i = r.pop()), (l = r[r.length - 1]), (a = o.pop()), (h = !0)),
        i.leaf)
      ) {
        const c = xh(t, i.children, e);
        if (c !== -1)
          return i.children.splice(c, 1), r.push(i), this._condense(r), this;
      }
      !h && !i.leaf && Mn(i, n)
        ? (r.push(i), o.push(a), (a = 0), (l = i), (i = i.children[0]))
        : l
        ? (a++, (i = l.children[a]), (h = !1))
        : (i = null);
    }
    return this;
  }
  toBBox(t) {
    return t;
  }
  compareMinX(t, e) {
    return t.minX - e.minX;
  }
  compareMinY(t, e) {
    return t.minY - e.minY;
  }
  toJSON() {
    return this.data;
  }
  fromJSON(t) {
    return (this.data = t), this;
  }
  _all(t, e) {
    const i = [];
    for (; t; )
      t.leaf ? e.push(...t.children) : i.push(...t.children), (t = i.pop());
    return e;
  }
  _build(t, e, i, n) {
    const r = i - e + 1;
    let o = this._maxEntries,
      a;
    if (r <= o) return (a = Me(t.slice(e, i + 1))), Se(a, this.toBBox), a;
    n ||
      ((n = Math.ceil(Math.log(r) / Math.log(o))),
      (o = Math.ceil(r / Math.pow(o, n - 1)))),
      (a = Me([])),
      (a.leaf = !1),
      (a.height = n);
    const l = Math.ceil(r / o),
      h = l * Math.ceil(Math.sqrt(o));
    gr(t, e, i, h, this.compareMinX);
    for (let c = e; c <= i; c += h) {
      const u = Math.min(c + h - 1, i);
      gr(t, c, u, l, this.compareMinY);
      for (let d = c; d <= u; d += l) {
        const f = Math.min(d + l - 1, u);
        a.children.push(this._build(t, d, f, n - 1));
      }
    }
    return Se(a, this.toBBox), a;
  }
  _chooseSubtree(t, e, i, n) {
    for (; n.push(e), !(e.leaf || n.length - 1 === i); ) {
      let r = 1 / 0,
        o = 1 / 0,
        a;
      for (let l = 0; l < e.children.length; l++) {
        const h = e.children[l],
          c = An(h),
          u = Rh(t, h) - c;
        u < o
          ? ((o = u), (r = c < r ? c : r), (a = h))
          : u === o && c < r && ((r = c), (a = h));
      }
      e = a || e.children[0];
    }
    return e;
  }
  _insert(t, e, i) {
    const n = i ? t : this.toBBox(t),
      r = [],
      o = this._chooseSubtree(n, this.data, e, r);
    for (
      o.children.push(t), Qe(o, n);
      e >= 0 && r[e].children.length > this._maxEntries;

    )
      this._split(r, e), e--;
    this._adjustParentBBoxes(n, r, e);
  }
  _split(t, e) {
    const i = t[e],
      n = i.children.length,
      r = this._minEntries;
    this._chooseSplitAxis(i, r, n);
    const o = this._chooseSplitIndex(i, r, n),
      a = Me(i.children.splice(o, i.children.length - o));
    (a.height = i.height),
      (a.leaf = i.leaf),
      Se(i, this.toBBox),
      Se(a, this.toBBox),
      e ? t[e - 1].children.push(a) : this._splitRoot(i, a);
  }
  _splitRoot(t, e) {
    (this.data = Me([t, e])),
      (this.data.height = t.height + 1),
      (this.data.leaf = !1),
      Se(this.data, this.toBBox);
  }
  _chooseSplitIndex(t, e, i) {
    let n,
      r = 1 / 0,
      o = 1 / 0;
    for (let a = e; a <= i - e; a++) {
      const l = Je(t, 0, a, this.toBBox),
        h = Je(t, a, i, this.toBBox),
        c = Th(l, h),
        u = An(l) + An(h);
      c < r
        ? ((r = c), (n = a), (o = u < o ? u : o))
        : c === r && u < o && ((o = u), (n = a));
    }
    return n || i - e;
  }
  _chooseSplitAxis(t, e, i) {
    const n = t.leaf ? this.compareMinX : Eh,
      r = t.leaf ? this.compareMinY : Ch,
      o = this._allDistMargin(t, e, i, n),
      a = this._allDistMargin(t, e, i, r);
    o < a && t.children.sort(n);
  }
  _allDistMargin(t, e, i, n) {
    t.children.sort(n);
    const r = this.toBBox,
      o = Je(t, 0, e, r),
      a = Je(t, i - e, i, r);
    let l = ki(o) + ki(a);
    for (let h = e; h < i - e; h++) {
      const c = t.children[h];
      Qe(o, t.leaf ? r(c) : c), (l += ki(o));
    }
    for (let h = i - e - 1; h >= e; h--) {
      const c = t.children[h];
      Qe(a, t.leaf ? r(c) : c), (l += ki(a));
    }
    return l;
  }
  _adjustParentBBoxes(t, e, i) {
    for (let n = i; n >= 0; n--) Qe(e[n], t);
  }
  _condense(t) {
    for (let e = t.length - 1, i; e >= 0; e--)
      t[e].children.length === 0
        ? e > 0
          ? ((i = t[e - 1].children), i.splice(i.indexOf(t[e]), 1))
          : this.clear()
        : Se(t[e], this.toBBox);
  }
}
function xh(s, t, e) {
  if (!e) return t.indexOf(s);
  for (let i = 0; i < t.length; i++) if (e(s, t[i])) return i;
  return -1;
}
function Se(s, t) {
  Je(s, 0, s.children.length, t, s);
}
function Je(s, t, e, i, n) {
  n || (n = Me(null)),
    (n.minX = 1 / 0),
    (n.minY = 1 / 0),
    (n.maxX = -1 / 0),
    (n.maxY = -1 / 0);
  for (let r = t; r < e; r++) {
    const o = s.children[r];
    Qe(n, s.leaf ? i(o) : o);
  }
  return n;
}
function Qe(s, t) {
  return (
    (s.minX = Math.min(s.minX, t.minX)),
    (s.minY = Math.min(s.minY, t.minY)),
    (s.maxX = Math.max(s.maxX, t.maxX)),
    (s.maxY = Math.max(s.maxY, t.maxY)),
    s
  );
}
function Eh(s, t) {
  return s.minX - t.minX;
}
function Ch(s, t) {
  return s.minY - t.minY;
}
function An(s) {
  return (s.maxX - s.minX) * (s.maxY - s.minY);
}
function ki(s) {
  return s.maxX - s.minX + (s.maxY - s.minY);
}
function Rh(s, t) {
  return (
    (Math.max(t.maxX, s.maxX) - Math.min(t.minX, s.minX)) *
    (Math.max(t.maxY, s.maxY) - Math.min(t.minY, s.minY))
  );
}
function Th(s, t) {
  const e = Math.max(s.minX, t.minX),
    i = Math.max(s.minY, t.minY),
    n = Math.min(s.maxX, t.maxX),
    r = Math.min(s.maxY, t.maxY);
  return Math.max(0, n - e) * Math.max(0, r - i);
}
function Mn(s, t) {
  return (
    s.minX <= t.minX && s.minY <= t.minY && t.maxX <= s.maxX && t.maxY <= s.maxY
  );
}
function Ni(s, t) {
  return (
    t.minX <= s.maxX && t.minY <= s.maxY && t.maxX >= s.minX && t.maxY >= s.minY
  );
}
function Me(s) {
  return {
    children: s,
    height: 1,
    leaf: !0,
    minX: 1 / 0,
    minY: 1 / 0,
    maxX: -1 / 0,
    maxY: -1 / 0,
  };
}
function gr(s, t, e, i, n) {
  const r = [t, e];
  for (; r.length; ) {
    if (((e = r.pop()), (t = r.pop()), e - t <= i)) continue;
    const o = t + Math.ceil((e - t) / i / 2) * i;
    ph(s, o, t, e, n), r.push(t, o, o, e);
  }
}
class ps {
  constructor(t) {
    (this.opacity_ = t.opacity),
      (this.rotateWithView_ = t.rotateWithView),
      (this.rotation_ = t.rotation),
      (this.scale_ = t.scale),
      (this.scaleArray_ = _t(t.scale)),
      (this.displacement_ = t.displacement),
      (this.declutterMode_ = t.declutterMode);
  }
  clone() {
    const t = this.getScale();
    return new ps({
      opacity: this.getOpacity(),
      scale: Array.isArray(t) ? t.slice() : t,
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
      displacement: this.getDisplacement().slice(),
      declutterMode: this.getDeclutterMode(),
    });
  }
  getOpacity() {
    return this.opacity_;
  }
  getRotateWithView() {
    return this.rotateWithView_;
  }
  getRotation() {
    return this.rotation_;
  }
  getScale() {
    return this.scale_;
  }
  getScaleArray() {
    return this.scaleArray_;
  }
  getDisplacement() {
    return this.displacement_;
  }
  getDeclutterMode() {
    return this.declutterMode_;
  }
  getAnchor() {
    return X();
  }
  getImage(t) {
    return X();
  }
  getHitDetectionImage() {
    return X();
  }
  getPixelRatio(t) {
    return 1;
  }
  getImageState() {
    return X();
  }
  getImageSize() {
    return X();
  }
  getOrigin() {
    return X();
  }
  getSize() {
    return X();
  }
  setDisplacement(t) {
    this.displacement_ = t;
  }
  setOpacity(t) {
    this.opacity_ = t;
  }
  setRotateWithView(t) {
    this.rotateWithView_ = t;
  }
  setRotation(t) {
    this.rotation_ = t;
  }
  setScale(t) {
    (this.scale_ = t), (this.scaleArray_ = _t(t));
  }
  listenImageChange(t) {
    X();
  }
  load() {
    X();
  }
  unlistenImageChange(t) {
    X();
  }
}
const So = ps;
function Lt(s) {
  return Array.isArray(s) ? mo(s) : s;
}
const Gi = "ol-hidden",
  fn = "ol-unselectable",
  ys = "ol-control",
  _r = "ol-collapsed",
  Ih = new RegExp(
    [
      "^\\s*(?=(?:(?:[-a-z]+\\s*){0,2}(italic|oblique))?)",
      "(?=(?:(?:[-a-z]+\\s*){0,2}(small-caps))?)",
      "(?=(?:(?:[-a-z]+\\s*){0,2}(bold(?:er)?|lighter|[1-9]00 ))?)",
      "(?:(?:normal|\\1|\\2|\\3)\\s*){0,3}((?:xx?-)?",
      "(?:small|large)|medium|smaller|larger|[\\.\\d]+(?:\\%|in|[cem]m|ex|p[ctx]))",
      "(?:\\s*\\/\\s*(normal|[\\.\\d]+(?:\\%|in|[cem]m|ex|p[ctx])?))",
      `?\\s*([-,\\"\\'\\sa-z]+?)\\s*$`,
    ].join(""),
    "i"
  ),
  mr = ["style", "variant", "weight", "size", "lineHeight", "family"],
  wo = function (s) {
    const t = s.match(Ih);
    if (!t) return null;
    const e = {
      lineHeight: "normal",
      size: "1.2em",
      style: "normal",
      weight: "normal",
      variant: "normal",
    };
    for (let i = 0, n = mr.length; i < n; ++i) {
      const r = t[i + 1];
      r !== void 0 && (e[mr[i]] = r);
    }
    return (e.families = e.family.split(/,\s?/)), e;
  },
  vo = "10px sans-serif",
  zt = "#000",
  $i = "round",
  li = [],
  hi = 0,
  Ze = "round",
  ci = 10,
  ui = "#000",
  di = "center",
  qi = "middle",
  fe = [0, 0, 0, 0],
  fi = 1,
  Wt = new bt();
let Oe = null,
  Un;
const jn = {},
  Sh = (function () {
    const t = "32px ",
      e = ["monospace", "serif"],
      i = e.length,
      n = "wmytzilWMYTZIL@#/&?$%10\uF013";
    let r, o;
    function a(h, c, u) {
      let d = !0;
      for (let f = 0; f < i; ++f) {
        const g = e[f];
        if (((o = Ji(h + " " + c + " " + t + g, n)), u != g)) {
          const _ = Ji(h + " " + c + " " + t + u + "," + g, n);
          d = d && _ != o;
        }
      }
      return !!d;
    }
    function l() {
      let h = !0;
      const c = Wt.getKeys();
      for (let u = 0, d = c.length; u < d; ++u) {
        const f = c[u];
        Wt.get(f) < 100 &&
          (a.apply(
            this,
            f.split(`
`)
          )
            ? (pi(jn), (Oe = null), (Un = void 0), Wt.set(f, 100))
            : (Wt.set(f, Wt.get(f) + 1, !0), (h = !1)));
      }
      h && (clearInterval(r), (r = void 0));
    }
    return function (h) {
      const c = wo(h);
      if (!c) return;
      const u = c.families;
      for (let d = 0, f = u.length; d < f; ++d) {
        const g = u[d],
          _ =
            c.style +
            `
` +
            c.weight +
            `
` +
            g;
        Wt.get(_) === void 0 &&
          (Wt.set(_, 100, !0),
          a(c.style, c.weight, g) ||
            (Wt.set(_, 0, !0), r === void 0 && (r = setInterval(l, 32))));
      }
    };
  })(),
  wh = (function () {
    let s;
    return function (t) {
      let e = jn[t];
      if (e == null) {
        if (es) {
          const i = wo(t),
            n = Lo(t, "\u017Dg");
          e =
            (isNaN(Number(i.lineHeight)) ? 1.2 : Number(i.lineHeight)) *
            (n.actualBoundingBoxAscent + n.actualBoundingBoxDescent);
        } else
          s ||
            ((s = document.createElement("div")),
            (s.innerHTML = "M"),
            (s.style.minHeight = "0"),
            (s.style.maxHeight = "none"),
            (s.style.height = "auto"),
            (s.style.padding = "0"),
            (s.style.border = "none"),
            (s.style.position = "absolute"),
            (s.style.display = "block"),
            (s.style.left = "-99999px")),
            (s.style.font = t),
            document.body.appendChild(s),
            (e = s.offsetHeight),
            document.body.removeChild(s);
        jn[t] = e;
      }
      return e;
    };
  })();
function Lo(s, t) {
  return (
    Oe || (Oe = lt(1, 1)),
    s != Un && ((Oe.font = s), (Un = Oe.font)),
    Oe.measureText(t)
  );
}
function Ji(s, t) {
  return Lo(s, t).width;
}
function pr(s, t, e) {
  if (t in e) return e[t];
  const i = t
    .split(
      `
`
    )
    .reduce((n, r) => Math.max(n, Ji(s, r)), 0);
  return (e[t] = i), i;
}
function vh(s, t) {
  const e = [],
    i = [],
    n = [];
  let r = 0,
    o = 0,
    a = 0,
    l = 0;
  for (let h = 0, c = t.length; h <= c; h += 2) {
    const u = t[h];
    if (
      u ===
        `
` ||
      h === c
    ) {
      (r = Math.max(r, o)), n.push(o), (o = 0), (a += l);
      continue;
    }
    const d = t[h + 1] || s.font,
      f = Ji(d, u);
    e.push(f), (o += f);
    const g = wh(d);
    i.push(g), (l = Math.max(l, g));
  }
  return { width: r, height: a, widths: e, heights: i, lineWidths: n };
}
function Lh(s, t, e, i, n, r, o, a, l, h, c) {
  s.save(),
    e !== 1 && (s.globalAlpha *= e),
    t && s.setTransform.apply(s, t),
    i.contextInstructions
      ? (s.translate(l, h), s.scale(c[0], c[1]), Ah(i, s))
      : c[0] < 0 || c[1] < 0
      ? (s.translate(l, h),
        s.scale(c[0], c[1]),
        s.drawImage(i, n, r, o, a, 0, 0, o, a))
      : s.drawImage(i, n, r, o, a, l, h, o * c[0], a * c[1]),
    s.restore();
}
function Ah(s, t) {
  const e = s.contextInstructions;
  for (let i = 0, n = e.length; i < n; i += 2)
    Array.isArray(e[i + 1]) ? t[e[i]].apply(t, e[i + 1]) : (t[e[i]] = e[i + 1]);
}
class xs extends So {
  constructor(t) {
    const e = t.rotateWithView !== void 0 ? t.rotateWithView : !1;
    super({
      opacity: 1,
      rotateWithView: e,
      rotation: t.rotation !== void 0 ? t.rotation : 0,
      scale: t.scale !== void 0 ? t.scale : 1,
      displacement: t.displacement !== void 0 ? t.displacement : [0, 0],
      declutterMode: t.declutterMode,
    }),
      (this.canvas_ = void 0),
      (this.hitDetectionCanvas_ = null),
      (this.fill_ = t.fill !== void 0 ? t.fill : null),
      (this.origin_ = [0, 0]),
      (this.points_ = t.points),
      (this.radius_ = t.radius !== void 0 ? t.radius : t.radius1),
      (this.radius2_ = t.radius2),
      (this.angle_ = t.angle !== void 0 ? t.angle : 0),
      (this.stroke_ = t.stroke !== void 0 ? t.stroke : null),
      (this.size_ = null),
      (this.renderOptions_ = null),
      this.render();
  }
  clone() {
    const t = this.getScale(),
      e = new xs({
        fill: this.getFill() ? this.getFill().clone() : void 0,
        points: this.getPoints(),
        radius: this.getRadius(),
        radius2: this.getRadius2(),
        angle: this.getAngle(),
        stroke: this.getStroke() ? this.getStroke().clone() : void 0,
        rotation: this.getRotation(),
        rotateWithView: this.getRotateWithView(),
        scale: Array.isArray(t) ? t.slice() : t,
        displacement: this.getDisplacement().slice(),
        declutterMode: this.getDeclutterMode(),
      });
    return e.setOpacity(this.getOpacity()), e;
  }
  getAnchor() {
    const t = this.size_;
    if (!t) return null;
    const e = this.getDisplacement(),
      i = this.getScaleArray();
    return [t[0] / 2 - e[0] / i[0], t[1] / 2 + e[1] / i[1]];
  }
  getAngle() {
    return this.angle_;
  }
  getFill() {
    return this.fill_;
  }
  setFill(t) {
    (this.fill_ = t), this.render();
  }
  getHitDetectionImage() {
    return (
      this.hitDetectionCanvas_ ||
        this.createHitDetectionCanvas_(this.renderOptions_),
      this.hitDetectionCanvas_
    );
  }
  getImage(t) {
    let e = this.canvas_[t];
    if (!e) {
      const i = this.renderOptions_,
        n = lt(i.size * t, i.size * t);
      this.draw_(i, n, t), (e = n.canvas), (this.canvas_[t] = e);
    }
    return e;
  }
  getPixelRatio(t) {
    return t;
  }
  getImageSize() {
    return this.size_;
  }
  getImageState() {
    return Q.LOADED;
  }
  getOrigin() {
    return this.origin_;
  }
  getPoints() {
    return this.points_;
  }
  getRadius() {
    return this.radius_;
  }
  getRadius2() {
    return this.radius2_;
  }
  getSize() {
    return this.size_;
  }
  getStroke() {
    return this.stroke_;
  }
  setStroke(t) {
    (this.stroke_ = t), this.render();
  }
  listenImageChange(t) {}
  load() {}
  unlistenImageChange(t) {}
  calculateLineJoinSize_(t, e, i) {
    if (e === 0 || this.points_ === 1 / 0 || (t !== "bevel" && t !== "miter"))
      return e;
    let n = this.radius_,
      r = this.radius2_ === void 0 ? n : this.radius2_;
    if (n < r) {
      const T = n;
      (n = r), (r = T);
    }
    const o = this.radius2_ === void 0 ? this.points_ : this.points_ * 2,
      a = (2 * Math.PI) / o,
      l = r * Math.sin(a),
      h = Math.sqrt(r * r - l * l),
      c = n - h,
      u = Math.sqrt(l * l + c * c),
      d = u / l;
    if (t === "miter" && d <= i) return d * e;
    const f = e / 2 / d,
      g = (e / 2) * (c / u),
      m = Math.sqrt((n + f) * (n + f) + g * g) - n;
    if (this.radius2_ === void 0 || t === "bevel") return m * 2;
    const p = n * Math.sin(a),
      y = Math.sqrt(n * n - p * p),
      x = r - y,
      C = Math.sqrt(p * p + x * x) / p;
    if (C <= i) {
      const T = (C * e) / 2 - r - n;
      return 2 * Math.max(m, T);
    }
    return m * 2;
  }
  createRenderOptions() {
    let t = Ze,
      e = 0,
      i = null,
      n = 0,
      r,
      o = 0;
    this.stroke_ &&
      ((r = this.stroke_.getColor()),
      r === null && (r = ui),
      (r = Lt(r)),
      (o = this.stroke_.getWidth()),
      o === void 0 && (o = fi),
      (i = this.stroke_.getLineDash()),
      (n = this.stroke_.getLineDashOffset()),
      (t = this.stroke_.getLineJoin()),
      t === void 0 && (t = Ze),
      (e = this.stroke_.getMiterLimit()),
      e === void 0 && (e = ci));
    const a = this.calculateLineJoinSize_(t, o, e),
      l = Math.max(this.radius_, this.radius2_ || 0),
      h = Math.ceil(2 * l + a);
    return {
      strokeStyle: r,
      strokeWidth: o,
      size: h,
      lineDash: i,
      lineDashOffset: n,
      lineJoin: t,
      miterLimit: e,
    };
  }
  render() {
    this.renderOptions_ = this.createRenderOptions();
    const t = this.renderOptions_.size;
    (this.canvas_ = {}), (this.size_ = [t, t]);
  }
  draw_(t, e, i) {
    if (
      (e.scale(i, i),
      e.translate(t.size / 2, t.size / 2),
      this.createPath_(e),
      this.fill_)
    ) {
      let n = this.fill_.getColor();
      n === null && (n = zt), (e.fillStyle = Lt(n)), e.fill();
    }
    this.stroke_ &&
      ((e.strokeStyle = t.strokeStyle),
      (e.lineWidth = t.strokeWidth),
      t.lineDash &&
        (e.setLineDash(t.lineDash), (e.lineDashOffset = t.lineDashOffset)),
      (e.lineJoin = t.lineJoin),
      (e.miterLimit = t.miterLimit),
      e.stroke());
  }
  createHitDetectionCanvas_(t) {
    if (this.fill_) {
      let e = this.fill_.getColor(),
        i = 0;
      if (
        (typeof e == "string" && (e = Hi(e)),
        e === null
          ? (i = 1)
          : Array.isArray(e) && (i = e.length === 4 ? e[3] : 1),
        i === 0)
      ) {
        const n = lt(t.size, t.size);
        (this.hitDetectionCanvas_ = n.canvas),
          this.drawHitDetectionCanvas_(t, n);
      }
    }
    this.hitDetectionCanvas_ || (this.hitDetectionCanvas_ = this.getImage(1));
  }
  createPath_(t) {
    let e = this.points_;
    const i = this.radius_;
    if (e === 1 / 0) t.arc(0, 0, i, 0, 2 * Math.PI);
    else {
      const n = this.radius2_ === void 0 ? i : this.radius2_;
      this.radius2_ !== void 0 && (e *= 2);
      const r = this.angle_ - Math.PI / 2,
        o = (2 * Math.PI) / e;
      for (let a = 0; a < e; a++) {
        const l = r + a * o,
          h = a % 2 === 0 ? i : n;
        t.lineTo(h * Math.cos(l), h * Math.sin(l));
      }
      t.closePath();
    }
  }
  drawHitDetectionCanvas_(t, e) {
    e.translate(t.size / 2, t.size / 2),
      this.createPath_(e),
      (e.fillStyle = zt),
      e.fill(),
      this.stroke_ &&
        ((e.strokeStyle = t.strokeStyle),
        (e.lineWidth = t.strokeWidth),
        t.lineDash &&
          (e.setLineDash(t.lineDash), (e.lineDashOffset = t.lineDashOffset)),
        (e.lineJoin = t.lineJoin),
        (e.miterLimit = t.miterLimit),
        e.stroke());
  }
}
const Ao = xs;
class Es extends Ao {
  constructor(t) {
    (t = t || { radius: 5 }),
      super({
        points: 1 / 0,
        fill: t.fill,
        radius: t.radius,
        stroke: t.stroke,
        scale: t.scale !== void 0 ? t.scale : 1,
        rotation: t.rotation !== void 0 ? t.rotation : 0,
        rotateWithView: t.rotateWithView !== void 0 ? t.rotateWithView : !1,
        displacement: t.displacement !== void 0 ? t.displacement : [0, 0],
        declutterMode: t.declutterMode,
      });
  }
  clone() {
    const t = this.getScale(),
      e = new Es({
        fill: this.getFill() ? this.getFill().clone() : void 0,
        stroke: this.getStroke() ? this.getStroke().clone() : void 0,
        radius: this.getRadius(),
        scale: Array.isArray(t) ? t.slice() : t,
        rotation: this.getRotation(),
        rotateWithView: this.getRotateWithView(),
        displacement: this.getDisplacement().slice(),
        declutterMode: this.getDeclutterMode(),
      });
    return e.setOpacity(this.getOpacity()), e;
  }
  setRadius(t) {
    (this.radius_ = t), this.render();
  }
}
const Cs = Es;
class Rs {
  constructor(t) {
    (t = t || {}), (this.color_ = t.color !== void 0 ? t.color : null);
  }
  clone() {
    const t = this.getColor();
    return new Rs({ color: Array.isArray(t) ? t.slice() : t || void 0 });
  }
  getColor() {
    return this.color_;
  }
  setColor(t) {
    this.color_ = t;
  }
}
const gi = Rs;
class Ts {
  constructor(t) {
    (t = t || {}),
      (this.color_ = t.color !== void 0 ? t.color : null),
      (this.lineCap_ = t.lineCap),
      (this.lineDash_ = t.lineDash !== void 0 ? t.lineDash : null),
      (this.lineDashOffset_ = t.lineDashOffset),
      (this.lineJoin_ = t.lineJoin),
      (this.miterLimit_ = t.miterLimit),
      (this.width_ = t.width);
  }
  clone() {
    const t = this.getColor();
    return new Ts({
      color: Array.isArray(t) ? t.slice() : t || void 0,
      lineCap: this.getLineCap(),
      lineDash: this.getLineDash() ? this.getLineDash().slice() : void 0,
      lineDashOffset: this.getLineDashOffset(),
      lineJoin: this.getLineJoin(),
      miterLimit: this.getMiterLimit(),
      width: this.getWidth(),
    });
  }
  getColor() {
    return this.color_;
  }
  getLineCap() {
    return this.lineCap_;
  }
  getLineDash() {
    return this.lineDash_;
  }
  getLineDashOffset() {
    return this.lineDashOffset_;
  }
  getLineJoin() {
    return this.lineJoin_;
  }
  getMiterLimit() {
    return this.miterLimit_;
  }
  getWidth() {
    return this.width_;
  }
  setColor(t) {
    this.color_ = t;
  }
  setLineCap(t) {
    this.lineCap_ = t;
  }
  setLineDash(t) {
    this.lineDash_ = t;
  }
  setLineDashOffset(t) {
    this.lineDashOffset_ = t;
  }
  setLineJoin(t) {
    this.lineJoin_ = t;
  }
  setMiterLimit(t) {
    this.miterLimit_ = t;
  }
  setWidth(t) {
    this.width_ = t;
  }
}
const Mo = Ts;
class gn {
  constructor(t) {
    (t = t || {}),
      (this.geometry_ = null),
      (this.geometryFunction_ = yr),
      t.geometry !== void 0 && this.setGeometry(t.geometry),
      (this.fill_ = t.fill !== void 0 ? t.fill : null),
      (this.image_ = t.image !== void 0 ? t.image : null),
      (this.renderer_ = t.renderer !== void 0 ? t.renderer : null),
      (this.hitDetectionRenderer_ =
        t.hitDetectionRenderer !== void 0 ? t.hitDetectionRenderer : null),
      (this.stroke_ = t.stroke !== void 0 ? t.stroke : null),
      (this.text_ = t.text !== void 0 ? t.text : null),
      (this.zIndex_ = t.zIndex);
  }
  clone() {
    let t = this.getGeometry();
    return (
      t && typeof t == "object" && (t = t.clone()),
      new gn({
        geometry: t,
        fill: this.getFill() ? this.getFill().clone() : void 0,
        image: this.getImage() ? this.getImage().clone() : void 0,
        renderer: this.getRenderer(),
        stroke: this.getStroke() ? this.getStroke().clone() : void 0,
        text: this.getText() ? this.getText().clone() : void 0,
        zIndex: this.getZIndex(),
      })
    );
  }
  getRenderer() {
    return this.renderer_;
  }
  setRenderer(t) {
    this.renderer_ = t;
  }
  setHitDetectionRenderer(t) {
    this.hitDetectionRenderer_ = t;
  }
  getHitDetectionRenderer() {
    return this.hitDetectionRenderer_;
  }
  getGeometry() {
    return this.geometry_;
  }
  getGeometryFunction() {
    return this.geometryFunction_;
  }
  getFill() {
    return this.fill_;
  }
  setFill(t) {
    this.fill_ = t;
  }
  getImage() {
    return this.image_;
  }
  setImage(t) {
    this.image_ = t;
  }
  getStroke() {
    return this.stroke_;
  }
  setStroke(t) {
    this.stroke_ = t;
  }
  getText() {
    return this.text_;
  }
  setText(t) {
    this.text_ = t;
  }
  getZIndex() {
    return this.zIndex_;
  }
  setGeometry(t) {
    typeof t == "function"
      ? (this.geometryFunction_ = t)
      : typeof t == "string"
      ? (this.geometryFunction_ = function (e) {
          return e.get(t);
        })
      : t
      ? t !== void 0 &&
        (this.geometryFunction_ = function () {
          return t;
        })
      : (this.geometryFunction_ = yr),
      (this.geometry_ = t);
  }
  setZIndex(t) {
    this.zIndex_ = t;
  }
}
function Mh(s) {
  let t;
  if (typeof s == "function") t = s;
  else {
    let e;
    Array.isArray(s)
      ? (e = s)
      : (G(typeof s.getZIndex == "function", 41), (e = [s])),
      (t = function () {
        return e;
      });
  }
  return t;
}
let On = null;
function Oh(s, t) {
  if (!On) {
    const e = new gi({ color: "rgba(255,255,255,0.4)" }),
      i = new Mo({ color: "#3399CC", width: 1.25 });
    On = [
      new gn({
        image: new Cs({ fill: e, stroke: i, radius: 5 }),
        fill: e,
        stroke: i,
      }),
    ];
  }
  return On;
}
function yr(s) {
  return s.getGeometry();
}
const Qi = gn;
class bh {
  constructor() {
    (this.cache_ = {}), (this.cacheSize_ = 0), (this.maxCacheSize_ = 32);
  }
  clear() {
    (this.cache_ = {}), (this.cacheSize_ = 0);
  }
  canExpireCache() {
    return this.cacheSize_ > this.maxCacheSize_;
  }
  expire() {
    if (this.canExpireCache()) {
      let t = 0;
      for (const e in this.cache_) {
        const i = this.cache_[e];
        (t++ & 3) === 0 &&
          !i.hasListener() &&
          (delete this.cache_[e], --this.cacheSize_);
      }
    }
  }
  get(t, e, i) {
    const n = xr(t, e, i);
    return n in this.cache_ ? this.cache_[n] : null;
  }
  set(t, e, i, n) {
    const r = xr(t, e, i);
    (this.cache_[r] = n), ++this.cacheSize_;
  }
  setSize(t) {
    (this.maxCacheSize_ = t), this.expire();
  }
}
function xr(s, t, e) {
  const i = e ? _o(e) : "null";
  return t + ":" + s + ":" + i;
}
const tn = new bh();
let qe = null;
class Ph extends sn {
  constructor(t, e, i, n, r, o) {
    super(),
      (this.hitDetectionImage_ = null),
      (this.image_ = t),
      (this.crossOrigin_ = n),
      (this.canvas_ = {}),
      (this.color_ = o),
      (this.unlisten_ = null),
      (this.imageState_ = r),
      (this.size_ = i),
      (this.src_ = e),
      this.tainted_;
  }
  initializeImage_() {
    (this.image_ = new Image()),
      this.crossOrigin_ !== null &&
        (this.image_.crossOrigin = this.crossOrigin_);
  }
  isTainted_() {
    if (this.tainted_ === void 0 && this.imageState_ === Q.LOADED) {
      qe || (qe = lt(1, 1, void 0, { willReadFrequently: !0 })),
        qe.drawImage(this.image_, 0, 0);
      try {
        qe.getImageData(0, 0, 1, 1), (this.tainted_ = !1);
      } catch {
        (qe = null), (this.tainted_ = !0);
      }
    }
    return this.tainted_ === !0;
  }
  dispatchChangeEvent_() {
    this.dispatchEvent(F.CHANGE);
  }
  handleImageError_() {
    (this.imageState_ = Q.ERROR),
      this.unlistenImage_(),
      this.dispatchChangeEvent_();
  }
  handleImageLoad_() {
    (this.imageState_ = Q.LOADED),
      this.size_
        ? ((this.image_.width = this.size_[0]),
          (this.image_.height = this.size_[1]))
        : (this.size_ = [this.image_.width, this.image_.height]),
      this.unlistenImage_(),
      this.dispatchChangeEvent_();
  }
  getImage(t) {
    return (
      this.image_ || this.initializeImage_(),
      this.replaceColor_(t),
      this.canvas_[t] ? this.canvas_[t] : this.image_
    );
  }
  getPixelRatio(t) {
    return this.replaceColor_(t), this.canvas_[t] ? t : 1;
  }
  getImageState() {
    return this.imageState_;
  }
  getHitDetectionImage() {
    if ((this.image_ || this.initializeImage_(), !this.hitDetectionImage_))
      if (this.isTainted_()) {
        const t = this.size_[0],
          e = this.size_[1],
          i = lt(t, e);
        i.fillRect(0, 0, t, e), (this.hitDetectionImage_ = i.canvas);
      } else this.hitDetectionImage_ = this.image_;
    return this.hitDetectionImage_;
  }
  getSize() {
    return this.size_;
  }
  getSrc() {
    return this.src_;
  }
  load() {
    if (this.imageState_ === Q.IDLE) {
      this.image_ || this.initializeImage_(), (this.imageState_ = Q.LOADING);
      try {
        this.image_.src = this.src_;
      } catch {
        this.handleImageError_();
      }
      this.unlisten_ = xo(
        this.image_,
        this.handleImageLoad_.bind(this),
        this.handleImageError_.bind(this)
      );
    }
  }
  replaceColor_(t) {
    if (!this.color_ || this.canvas_[t] || this.imageState_ !== Q.LOADED)
      return;
    const e = this.image_,
      i = document.createElement("canvas");
    (i.width = Math.ceil(e.width * t)), (i.height = Math.ceil(e.height * t));
    const n = i.getContext("2d");
    n.scale(t, t),
      n.drawImage(e, 0, 0),
      (n.globalCompositeOperation = "multiply"),
      (n.fillStyle = _o(this.color_)),
      n.fillRect(0, 0, i.width / t, i.height / t),
      (n.globalCompositeOperation = "destination-in"),
      n.drawImage(e, 0, 0),
      (this.canvas_[t] = i);
  }
  unlistenImage_() {
    this.unlisten_ && (this.unlisten_(), (this.unlisten_ = null));
  }
}
function Dh(s, t, e, i, n, r) {
  let o = tn.get(t, i, r);
  return o || ((o = new Ph(s, t, e, i, n, r)), tn.set(t, i, r, o)), o;
}
class Is extends So {
  constructor(t) {
    t = t || {};
    const e = t.opacity !== void 0 ? t.opacity : 1,
      i = t.rotation !== void 0 ? t.rotation : 0,
      n = t.scale !== void 0 ? t.scale : 1,
      r = t.rotateWithView !== void 0 ? t.rotateWithView : !1;
    super({
      opacity: e,
      rotation: i,
      scale: n,
      displacement: t.displacement !== void 0 ? t.displacement : [0, 0],
      rotateWithView: r,
      declutterMode: t.declutterMode,
    }),
      (this.anchor_ = t.anchor !== void 0 ? t.anchor : [0.5, 0.5]),
      (this.normalizedAnchor_ = null),
      (this.anchorOrigin_ =
        t.anchorOrigin !== void 0 ? t.anchorOrigin : "top-left"),
      (this.anchorXUnits_ =
        t.anchorXUnits !== void 0 ? t.anchorXUnits : "fraction"),
      (this.anchorYUnits_ =
        t.anchorYUnits !== void 0 ? t.anchorYUnits : "fraction"),
      (this.crossOrigin_ = t.crossOrigin !== void 0 ? t.crossOrigin : null);
    const o = t.img !== void 0 ? t.img : null;
    this.imgSize_ = t.imgSize;
    let a = t.src;
    G(!(a !== void 0 && o), 4),
      G(!o || (o && this.imgSize_), 5),
      (a === void 0 || a.length === 0) && o && (a = o.src || z(o)),
      G(a !== void 0 && a.length > 0, 6),
      G(
        !((t.width !== void 0 || t.height !== void 0) && t.scale !== void 0),
        69
      );
    const l = t.src !== void 0 ? Q.IDLE : Q.LOADED;
    if (
      ((this.color_ = t.color !== void 0 ? Hi(t.color) : null),
      (this.iconImage_ = Dh(
        o,
        a,
        this.imgSize_ !== void 0 ? this.imgSize_ : null,
        this.crossOrigin_,
        l,
        this.color_
      )),
      (this.offset_ = t.offset !== void 0 ? t.offset : [0, 0]),
      (this.offsetOrigin_ =
        t.offsetOrigin !== void 0 ? t.offsetOrigin : "top-left"),
      (this.origin_ = null),
      (this.size_ = t.size !== void 0 ? t.size : null),
      (this.width_ = t.width),
      (this.height_ = t.height),
      this.width_ !== void 0 || this.height_ !== void 0)
    ) {
      const h = this.getImage(1),
        c = () => {
          this.updateScaleFromWidthAndHeight(this.width_, this.height_);
        };
      h.width > 0
        ? this.updateScaleFromWidthAndHeight(this.width_, this.height_)
        : h.addEventListener("load", c);
    }
  }
  clone() {
    let t = this.getScale();
    return (
      (t = Array.isArray(t) ? t.slice() : t),
      (this.width_ !== void 0 || this.height_ !== void 0) && (t = void 0),
      new Is({
        anchor: this.anchor_.slice(),
        anchorOrigin: this.anchorOrigin_,
        anchorXUnits: this.anchorXUnits_,
        anchorYUnits: this.anchorYUnits_,
        color:
          this.color_ && this.color_.slice
            ? this.color_.slice()
            : this.color_ || void 0,
        crossOrigin: this.crossOrigin_,
        imgSize: this.imgSize_,
        offset: this.offset_.slice(),
        offsetOrigin: this.offsetOrigin_,
        opacity: this.getOpacity(),
        rotateWithView: this.getRotateWithView(),
        rotation: this.getRotation(),
        scale: t,
        size: this.size_ !== null ? this.size_.slice() : void 0,
        src: this.getSrc(),
        displacement: this.getDisplacement().slice(),
        declutterMode: this.getDeclutterMode(),
        width: this.width_,
        height: this.height_,
      })
    );
  }
  updateScaleFromWidthAndHeight(t, e) {
    const i = this.getImage(1);
    t !== void 0 && e !== void 0
      ? super.setScale([t / i.width, e / i.height])
      : t !== void 0
      ? super.setScale([t / i.width, t / i.width])
      : e !== void 0
      ? super.setScale([e / i.height, e / i.height])
      : super.setScale([1, 1]);
  }
  getAnchor() {
    let t = this.normalizedAnchor_;
    if (!t) {
      t = this.anchor_;
      const n = this.getSize();
      if (
        this.anchorXUnits_ == "fraction" ||
        this.anchorYUnits_ == "fraction"
      ) {
        if (!n) return null;
        (t = this.anchor_.slice()),
          this.anchorXUnits_ == "fraction" && (t[0] *= n[0]),
          this.anchorYUnits_ == "fraction" && (t[1] *= n[1]);
      }
      if (this.anchorOrigin_ != "top-left") {
        if (!n) return null;
        t === this.anchor_ && (t = this.anchor_.slice()),
          (this.anchorOrigin_ == "top-right" ||
            this.anchorOrigin_ == "bottom-right") &&
            (t[0] = -t[0] + n[0]),
          (this.anchorOrigin_ == "bottom-left" ||
            this.anchorOrigin_ == "bottom-right") &&
            (t[1] = -t[1] + n[1]);
      }
      this.normalizedAnchor_ = t;
    }
    const e = this.getDisplacement(),
      i = this.getScaleArray();
    return [t[0] - e[0] / i[0], t[1] + e[1] / i[1]];
  }
  setAnchor(t) {
    (this.anchor_ = t), (this.normalizedAnchor_ = null);
  }
  getColor() {
    return this.color_;
  }
  getImage(t) {
    return this.iconImage_.getImage(t);
  }
  getPixelRatio(t) {
    return this.iconImage_.getPixelRatio(t);
  }
  getImageSize() {
    return this.iconImage_.getSize();
  }
  getImageState() {
    return this.iconImage_.getImageState();
  }
  getHitDetectionImage() {
    return this.iconImage_.getHitDetectionImage();
  }
  getOrigin() {
    if (this.origin_) return this.origin_;
    let t = this.offset_;
    if (this.offsetOrigin_ != "top-left") {
      const e = this.getSize(),
        i = this.iconImage_.getSize();
      if (!e || !i) return null;
      (t = t.slice()),
        (this.offsetOrigin_ == "top-right" ||
          this.offsetOrigin_ == "bottom-right") &&
          (t[0] = i[0] - e[0] - t[0]),
        (this.offsetOrigin_ == "bottom-left" ||
          this.offsetOrigin_ == "bottom-right") &&
          (t[1] = i[1] - e[1] - t[1]);
    }
    return (this.origin_ = t), this.origin_;
  }
  getSrc() {
    return this.iconImage_.getSrc();
  }
  getSize() {
    return this.size_ ? this.size_ : this.iconImage_.getSize();
  }
  getWidth() {
    return this.width_;
  }
  getHeight() {
    return this.height_;
  }
  setWidth(t) {
    (this.width_ = t), this.updateScaleFromWidthAndHeight(t, this.height_);
  }
  setHeight(t) {
    (this.height_ = t), this.updateScaleFromWidthAndHeight(this.width_, t);
  }
  setScale(t) {
    super.setScale(t);
    const e = this.getImage(1);
    if (e) {
      const i = Array.isArray(t) ? t[0] : t;
      i !== void 0 && (this.width_ = i * e.width);
      const n = Array.isArray(t) ? t[1] : t;
      n !== void 0 && (this.height_ = n * e.height);
    }
  }
  listenImageChange(t) {
    this.iconImage_.addEventListener(F.CHANGE, t);
  }
  load() {
    this.iconImage_.load();
  }
  unlistenImageChange(t) {
    this.iconImage_.removeEventListener(F.CHANGE, t);
  }
}
const Oo = Is,
  Fh = "#333";
class Ss {
  constructor(t) {
    (t = t || {}),
      (this.font_ = t.font),
      (this.rotation_ = t.rotation),
      (this.rotateWithView_ = t.rotateWithView),
      (this.scale_ = t.scale),
      (this.scaleArray_ = _t(t.scale !== void 0 ? t.scale : 1)),
      (this.text_ = t.text),
      (this.textAlign_ = t.textAlign),
      (this.justify_ = t.justify),
      (this.repeat_ = t.repeat),
      (this.textBaseline_ = t.textBaseline),
      (this.fill_ = t.fill !== void 0 ? t.fill : new gi({ color: Fh })),
      (this.maxAngle_ = t.maxAngle !== void 0 ? t.maxAngle : Math.PI / 4),
      (this.placement_ = t.placement !== void 0 ? t.placement : "point"),
      (this.overflow_ = !!t.overflow),
      (this.stroke_ = t.stroke !== void 0 ? t.stroke : null),
      (this.offsetX_ = t.offsetX !== void 0 ? t.offsetX : 0),
      (this.offsetY_ = t.offsetY !== void 0 ? t.offsetY : 0),
      (this.backgroundFill_ = t.backgroundFill ? t.backgroundFill : null),
      (this.backgroundStroke_ = t.backgroundStroke ? t.backgroundStroke : null),
      (this.padding_ = t.padding === void 0 ? null : t.padding);
  }
  clone() {
    const t = this.getScale();
    return new Ss({
      font: this.getFont(),
      placement: this.getPlacement(),
      repeat: this.getRepeat(),
      maxAngle: this.getMaxAngle(),
      overflow: this.getOverflow(),
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
      scale: Array.isArray(t) ? t.slice() : t,
      text: this.getText(),
      textAlign: this.getTextAlign(),
      justify: this.getJustify(),
      textBaseline: this.getTextBaseline(),
      fill: this.getFill() ? this.getFill().clone() : void 0,
      stroke: this.getStroke() ? this.getStroke().clone() : void 0,
      offsetX: this.getOffsetX(),
      offsetY: this.getOffsetY(),
      backgroundFill: this.getBackgroundFill()
        ? this.getBackgroundFill().clone()
        : void 0,
      backgroundStroke: this.getBackgroundStroke()
        ? this.getBackgroundStroke().clone()
        : void 0,
      padding: this.getPadding() || void 0,
    });
  }
  getOverflow() {
    return this.overflow_;
  }
  getFont() {
    return this.font_;
  }
  getMaxAngle() {
    return this.maxAngle_;
  }
  getPlacement() {
    return this.placement_;
  }
  getRepeat() {
    return this.repeat_;
  }
  getOffsetX() {
    return this.offsetX_;
  }
  getOffsetY() {
    return this.offsetY_;
  }
  getFill() {
    return this.fill_;
  }
  getRotateWithView() {
    return this.rotateWithView_;
  }
  getRotation() {
    return this.rotation_;
  }
  getScale() {
    return this.scale_;
  }
  getScaleArray() {
    return this.scaleArray_;
  }
  getStroke() {
    return this.stroke_;
  }
  getText() {
    return this.text_;
  }
  getTextAlign() {
    return this.textAlign_;
  }
  getJustify() {
    return this.justify_;
  }
  getTextBaseline() {
    return this.textBaseline_;
  }
  getBackgroundFill() {
    return this.backgroundFill_;
  }
  getBackgroundStroke() {
    return this.backgroundStroke_;
  }
  getPadding() {
    return this.padding_;
  }
  setOverflow(t) {
    this.overflow_ = t;
  }
  setFont(t) {
    this.font_ = t;
  }
  setMaxAngle(t) {
    this.maxAngle_ = t;
  }
  setOffsetX(t) {
    this.offsetX_ = t;
  }
  setOffsetY(t) {
    this.offsetY_ = t;
  }
  setPlacement(t) {
    this.placement_ = t;
  }
  setRepeat(t) {
    this.repeat_ = t;
  }
  setRotateWithView(t) {
    this.rotateWithView_ = t;
  }
  setFill(t) {
    this.fill_ = t;
  }
  setRotation(t) {
    this.rotation_ = t;
  }
  setScale(t) {
    (this.scale_ = t), (this.scaleArray_ = _t(t !== void 0 ? t : 1));
  }
  setStroke(t) {
    this.stroke_ = t;
  }
  setText(t) {
    this.text_ = t;
  }
  setTextAlign(t) {
    this.textAlign_ = t;
  }
  setJustify(t) {
    this.justify_ = t;
  }
  setTextBaseline(t) {
    this.textBaseline_ = t;
  }
  setBackgroundFill(t) {
    this.backgroundFill_ = t;
  }
  setBackgroundStroke(t) {
    this.backgroundStroke_ = t;
  }
  setPadding(t) {
    this.padding_ = t;
  }
}
const bo = Ss;
function Er(s) {
  return new Qi({
    fill: _i(s, ""),
    stroke: mi(s, ""),
    text: kh(s),
    image: Nh(s),
  });
}
function _i(s, t) {
  const e = s[t + "fill-color"];
  if (!!e) return new gi({ color: e });
}
function mi(s, t) {
  const e = s[t + "stroke-width"],
    i = s[t + "stroke-color"];
  if (!(!e && !i))
    return new Mo({
      width: e,
      color: i,
      lineCap: s[t + "stroke-line-cap"],
      lineJoin: s[t + "stroke-line-join"],
      lineDash: s[t + "stroke-line-dash"],
      lineDashOffset: s[t + "stroke-line-dash-offset"],
      miterLimit: s[t + "stroke-miter-limit"],
    });
}
function kh(s) {
  const t = s["text-value"];
  return t
    ? new bo({
        text: t,
        font: s["text-font"],
        maxAngle: s["text-max-angle"],
        offsetX: s["text-offset-x"],
        offsetY: s["text-offset-y"],
        overflow: s["text-overflow"],
        placement: s["text-placement"],
        repeat: s["text-repeat"],
        scale: s["text-scale"],
        rotateWithView: s["text-rotate-with-view"],
        rotation: s["text-rotation"],
        textAlign: s["text-align"],
        justify: s["text-justify"],
        textBaseline: s["text-baseline"],
        padding: s["text-padding"],
        fill: _i(s, "text-"),
        backgroundFill: _i(s, "text-background-"),
        stroke: mi(s, "text-"),
        backgroundStroke: mi(s, "text-background-"),
      })
    : void 0;
}
function Nh(s) {
  const t = s["icon-src"],
    e = s["icon-img"];
  if (t || e)
    return new Oo({
      src: t,
      img: e,
      imgSize: s["icon-img-size"],
      anchor: s["icon-anchor"],
      anchorOrigin: s["icon-anchor-origin"],
      anchorXUnits: s["icon-anchor-x-units"],
      anchorYUnits: s["icon-anchor-y-units"],
      color: s["icon-color"],
      crossOrigin: s["icon-cross-origin"],
      offset: s["icon-offset"],
      displacement: s["icon-displacement"],
      opacity: s["icon-opacity"],
      scale: s["icon-scale"],
      rotation: s["icon-rotation"],
      rotateWithView: s["icon-rotate-with-view"],
      size: s["icon-size"],
      declutterMode: s["icon-declutter-mode"],
    });
  const i = s["shape-points"];
  if (i) {
    const r = "shape-";
    return new Ao({
      points: i,
      fill: _i(s, r),
      stroke: mi(s, r),
      radius: s["shape-radius"],
      radius1: s["shape-radius1"],
      radius2: s["shape-radius2"],
      angle: s["shape-angle"],
      displacement: s["shape-displacement"],
      rotation: s["shape-rotation"],
      rotateWithView: s["shape-rotate-with-view"],
      scale: s["shape-scale"],
      declutterMode: s["shape-declutter-mode"],
    });
  }
  const n = s["circle-radius"];
  if (n) {
    const r = "circle-";
    return new Cs({
      radius: n,
      fill: _i(s, r),
      stroke: mi(s, r),
      displacement: s["circle-displacement"],
      scale: s["circle-scale"],
      rotation: s["circle-rotation"],
      rotateWithView: s["circle-rotate-with-view"],
      declutterMode: s["circle-declutter-mode"],
    });
  }
}
const Cr = { RENDER_ORDER: "renderOrder" };
class Gh extends un {
  constructor(t) {
    t = t || {};
    const e = Object.assign({}, t);
    delete e.style,
      delete e.renderBuffer,
      delete e.updateWhileAnimating,
      delete e.updateWhileInteracting,
      super(e),
      (this.declutter_ = t.declutter !== void 0 ? t.declutter : !1),
      (this.renderBuffer_ = t.renderBuffer !== void 0 ? t.renderBuffer : 100),
      (this.style_ = null),
      (this.styleFunction_ = void 0),
      this.setStyle(t.style),
      (this.updateWhileAnimating_ =
        t.updateWhileAnimating !== void 0 ? t.updateWhileAnimating : !1),
      (this.updateWhileInteracting_ =
        t.updateWhileInteracting !== void 0 ? t.updateWhileInteracting : !1);
  }
  getDeclutter() {
    return this.declutter_;
  }
  getFeatures(t) {
    return super.getFeatures(t);
  }
  getRenderBuffer() {
    return this.renderBuffer_;
  }
  getRenderOrder() {
    return this.get(Cr.RENDER_ORDER);
  }
  getStyle() {
    return this.style_;
  }
  getStyleFunction() {
    return this.styleFunction_;
  }
  getUpdateWhileAnimating() {
    return this.updateWhileAnimating_;
  }
  getUpdateWhileInteracting() {
    return this.updateWhileInteracting_;
  }
  renderDeclutter(t) {
    t.declutterTree || (t.declutterTree = new Io(9)),
      this.getRenderer().renderDeclutter(t);
  }
  setRenderOrder(t) {
    this.set(Cr.RENDER_ORDER, t);
  }
  setStyle(t) {
    let e;
    if (t === void 0) e = Oh;
    else if (t === null) e = null;
    else if (typeof t == "function") e = t;
    else if (t instanceof Qi) e = t;
    else if (Array.isArray(t)) {
      const i = t.length,
        n = new Array(i);
      for (let r = 0; r < i; ++r) {
        const o = t[r];
        o instanceof Qi ? (n[r] = o) : (n[r] = Er(o));
      }
      e = n;
    } else e = Er(t);
    (this.style_ = e),
      (this.styleFunction_ = t === null ? void 0 : Mh(this.style_)),
      this.changed();
  }
}
const Xh = Gh,
  xi = {
    BEGIN_GEOMETRY: 0,
    BEGIN_PATH: 1,
    CIRCLE: 2,
    CLOSE_PATH: 3,
    CUSTOM: 4,
    DRAW_CHARS: 5,
    DRAW_IMAGE: 6,
    END_GEOMETRY: 7,
    FILL: 8,
    MOVE_TO_LINE_TO: 9,
    SET_FILL_STYLE: 10,
    SET_STROKE_STYLE: 11,
    STROKE: 12,
  },
  Xi = [xi.FILL],
  ie = [xi.STROKE],
  ge = [xi.BEGIN_PATH],
  Rr = [xi.CLOSE_PATH],
  O = xi;
class Wh {
  drawCustom(t, e, i, n) {}
  drawGeometry(t) {}
  setStyle(t) {}
  drawCircle(t, e) {}
  drawFeature(t, e) {}
  drawGeometryCollection(t, e) {}
  drawLineString(t, e) {}
  drawMultiLineString(t, e) {}
  drawMultiPoint(t, e) {}
  drawMultiPolygon(t, e) {}
  drawPoint(t, e) {}
  drawPolygon(t, e) {}
  drawText(t, e) {}
  setFillStrokeStyle(t, e) {}
  setImageStyle(t, e) {}
  setTextStyle(t, e) {}
}
const Po = Wh;
class zh extends Po {
  constructor(t, e, i, n) {
    super(),
      (this.tolerance = t),
      (this.maxExtent = e),
      (this.pixelRatio = n),
      (this.maxLineWidth = 0),
      (this.resolution = i),
      (this.beginGeometryInstruction1_ = null),
      (this.beginGeometryInstruction2_ = null),
      (this.bufferedMaxExtent_ = null),
      (this.instructions = []),
      (this.coordinates = []),
      (this.tmpCoordinate_ = []),
      (this.hitDetectionInstructions = []),
      (this.state = {});
  }
  applyPixelRatio(t) {
    const e = this.pixelRatio;
    return e == 1
      ? t
      : t.map(function (i) {
          return i * e;
        });
  }
  appendFlatPointCoordinates(t, e) {
    const i = this.getBufferedMaxExtent(),
      n = this.tmpCoordinate_,
      r = this.coordinates;
    let o = r.length;
    for (let a = 0, l = t.length; a < l; a += e)
      (n[0] = t[a]),
        (n[1] = t[a + 1]),
        on(i, n) && ((r[o++] = n[0]), (r[o++] = n[1]));
    return o;
  }
  appendFlatLineCoordinates(t, e, i, n, r, o) {
    const a = this.coordinates;
    let l = a.length;
    const h = this.getBufferedMaxExtent();
    o && (e += n);
    let c = t[e],
      u = t[e + 1];
    const d = this.tmpCoordinate_;
    let f = !0,
      g,
      _,
      m;
    for (g = e + n; g < i; g += n)
      (d[0] = t[g]),
        (d[1] = t[g + 1]),
        (m = Gn(h, d)),
        m !== _
          ? (f && ((a[l++] = c), (a[l++] = u), (f = !1)),
            (a[l++] = d[0]),
            (a[l++] = d[1]))
          : m === et.INTERSECTING
          ? ((a[l++] = d[0]), (a[l++] = d[1]), (f = !1))
          : (f = !0),
        (c = d[0]),
        (u = d[1]),
        (_ = m);
    return ((r && f) || g === e + n) && ((a[l++] = c), (a[l++] = u)), l;
  }
  drawCustomCoordinates_(t, e, i, n, r) {
    for (let o = 0, a = i.length; o < a; ++o) {
      const l = i[o],
        h = this.appendFlatLineCoordinates(t, e, l, n, !1, !1);
      r.push(h), (e = l);
    }
    return e;
  }
  drawCustom(t, e, i, n) {
    this.beginGeometry(t, e);
    const r = t.getType(),
      o = t.getStride(),
      a = this.coordinates.length;
    let l, h, c, u, d;
    switch (r) {
      case "MultiPolygon":
        (l = t.getOrientedFlatCoordinates()), (u = []);
        const f = t.getEndss();
        d = 0;
        for (let g = 0, _ = f.length; g < _; ++g) {
          const m = [];
          (d = this.drawCustomCoordinates_(l, d, f[g], o, m)), u.push(m);
        }
        this.instructions.push([O.CUSTOM, a, u, t, i, tr]),
          this.hitDetectionInstructions.push([O.CUSTOM, a, u, t, n || i, tr]);
        break;
      case "Polygon":
      case "MultiLineString":
        (c = []),
          (l =
            r == "Polygon"
              ? t.getOrientedFlatCoordinates()
              : t.getFlatCoordinates()),
          (d = this.drawCustomCoordinates_(l, 0, t.getEnds(), o, c)),
          this.instructions.push([O.CUSTOM, a, c, t, i, Ui]),
          this.hitDetectionInstructions.push([O.CUSTOM, a, c, t, n || i, Ui]);
        break;
      case "LineString":
      case "Circle":
        (l = t.getFlatCoordinates()),
          (h = this.appendFlatLineCoordinates(l, 0, l.length, o, !1, !1)),
          this.instructions.push([O.CUSTOM, a, h, t, i, Fe]),
          this.hitDetectionInstructions.push([O.CUSTOM, a, h, t, n || i, Fe]);
        break;
      case "MultiPoint":
        (l = t.getFlatCoordinates()),
          (h = this.appendFlatPointCoordinates(l, o)),
          h > a &&
            (this.instructions.push([O.CUSTOM, a, h, t, i, Fe]),
            this.hitDetectionInstructions.push([
              O.CUSTOM,
              a,
              h,
              t,
              n || i,
              Fe,
            ]));
        break;
      case "Point":
        (l = t.getFlatCoordinates()),
          this.coordinates.push(l[0], l[1]),
          (h = this.coordinates.length),
          this.instructions.push([O.CUSTOM, a, h, t, i]),
          this.hitDetectionInstructions.push([O.CUSTOM, a, h, t, n || i]);
        break;
    }
    this.endGeometry(e);
  }
  beginGeometry(t, e) {
    (this.beginGeometryInstruction1_ = [O.BEGIN_GEOMETRY, e, 0, t]),
      this.instructions.push(this.beginGeometryInstruction1_),
      (this.beginGeometryInstruction2_ = [O.BEGIN_GEOMETRY, e, 0, t]),
      this.hitDetectionInstructions.push(this.beginGeometryInstruction2_);
  }
  finish() {
    return {
      instructions: this.instructions,
      hitDetectionInstructions: this.hitDetectionInstructions,
      coordinates: this.coordinates,
    };
  }
  reverseHitDetectionInstructions() {
    const t = this.hitDetectionInstructions;
    t.reverse();
    let e;
    const i = t.length;
    let n,
      r,
      o = -1;
    for (e = 0; e < i; ++e)
      (n = t[e]),
        (r = n[0]),
        r == O.END_GEOMETRY
          ? (o = e)
          : r == O.BEGIN_GEOMETRY &&
            ((n[2] = e), ha(this.hitDetectionInstructions, o, e), (o = -1));
  }
  setFillStrokeStyle(t, e) {
    const i = this.state;
    if (t) {
      const n = t.getColor();
      i.fillStyle = Lt(n || zt);
    } else i.fillStyle = void 0;
    if (e) {
      const n = e.getColor();
      i.strokeStyle = Lt(n || ui);
      const r = e.getLineCap();
      i.lineCap = r !== void 0 ? r : $i;
      const o = e.getLineDash();
      i.lineDash = o ? o.slice() : li;
      const a = e.getLineDashOffset();
      i.lineDashOffset = a || hi;
      const l = e.getLineJoin();
      i.lineJoin = l !== void 0 ? l : Ze;
      const h = e.getWidth();
      i.lineWidth = h !== void 0 ? h : fi;
      const c = e.getMiterLimit();
      (i.miterLimit = c !== void 0 ? c : ci),
        i.lineWidth > this.maxLineWidth &&
          ((this.maxLineWidth = i.lineWidth), (this.bufferedMaxExtent_ = null));
    } else
      (i.strokeStyle = void 0),
        (i.lineCap = void 0),
        (i.lineDash = null),
        (i.lineDashOffset = void 0),
        (i.lineJoin = void 0),
        (i.lineWidth = void 0),
        (i.miterLimit = void 0);
  }
  createFill(t) {
    const e = t.fillStyle,
      i = [O.SET_FILL_STYLE, e];
    return typeof e != "string" && i.push(!0), i;
  }
  applyStroke(t) {
    this.instructions.push(this.createStroke(t));
  }
  createStroke(t) {
    return [
      O.SET_STROKE_STYLE,
      t.strokeStyle,
      t.lineWidth * this.pixelRatio,
      t.lineCap,
      t.lineJoin,
      t.miterLimit,
      this.applyPixelRatio(t.lineDash),
      t.lineDashOffset * this.pixelRatio,
    ];
  }
  updateFillStyle(t, e) {
    const i = t.fillStyle;
    (typeof i != "string" || t.currentFillStyle != i) &&
      (i !== void 0 && this.instructions.push(e.call(this, t)),
      (t.currentFillStyle = i));
  }
  updateStrokeStyle(t, e) {
    const i = t.strokeStyle,
      n = t.lineCap,
      r = t.lineDash,
      o = t.lineDashOffset,
      a = t.lineJoin,
      l = t.lineWidth,
      h = t.miterLimit;
    (t.currentStrokeStyle != i ||
      t.currentLineCap != n ||
      (r != t.currentLineDash && !oe(t.currentLineDash, r)) ||
      t.currentLineDashOffset != o ||
      t.currentLineJoin != a ||
      t.currentLineWidth != l ||
      t.currentMiterLimit != h) &&
      (i !== void 0 && e.call(this, t),
      (t.currentStrokeStyle = i),
      (t.currentLineCap = n),
      (t.currentLineDash = r),
      (t.currentLineDashOffset = o),
      (t.currentLineJoin = a),
      (t.currentLineWidth = l),
      (t.currentMiterLimit = h));
  }
  endGeometry(t) {
    (this.beginGeometryInstruction1_[2] = this.instructions.length),
      (this.beginGeometryInstruction1_ = null),
      (this.beginGeometryInstruction2_[2] =
        this.hitDetectionInstructions.length),
      (this.beginGeometryInstruction2_ = null);
    const e = [O.END_GEOMETRY, t];
    this.instructions.push(e), this.hitDetectionInstructions.push(e);
  }
  getBufferedMaxExtent() {
    if (
      !this.bufferedMaxExtent_ &&
      ((this.bufferedMaxExtent_ = zr(this.maxExtent)), this.maxLineWidth > 0)
    ) {
      const t = (this.resolution * (this.maxLineWidth + 1)) / 2;
      ns(this.bufferedMaxExtent_, t, this.bufferedMaxExtent_);
    }
    return this.bufferedMaxExtent_;
  }
}
const Ei = zh;
class Yh extends Ei {
  constructor(t, e, i, n) {
    super(t, e, i, n),
      (this.hitDetectionImage_ = null),
      (this.image_ = null),
      (this.imagePixelRatio_ = void 0),
      (this.anchorX_ = void 0),
      (this.anchorY_ = void 0),
      (this.height_ = void 0),
      (this.opacity_ = void 0),
      (this.originX_ = void 0),
      (this.originY_ = void 0),
      (this.rotateWithView_ = void 0),
      (this.rotation_ = void 0),
      (this.scale_ = void 0),
      (this.width_ = void 0),
      (this.declutterMode_ = void 0),
      (this.declutterImageWithText_ = void 0);
  }
  drawPoint(t, e) {
    if (!this.image_) return;
    this.beginGeometry(t, e);
    const i = t.getFlatCoordinates(),
      n = t.getStride(),
      r = this.coordinates.length,
      o = this.appendFlatPointCoordinates(i, n);
    this.instructions.push([
      O.DRAW_IMAGE,
      r,
      o,
      this.image_,
      this.anchorX_ * this.imagePixelRatio_,
      this.anchorY_ * this.imagePixelRatio_,
      Math.ceil(this.height_ * this.imagePixelRatio_),
      this.opacity_,
      this.originX_ * this.imagePixelRatio_,
      this.originY_ * this.imagePixelRatio_,
      this.rotateWithView_,
      this.rotation_,
      [
        (this.scale_[0] * this.pixelRatio) / this.imagePixelRatio_,
        (this.scale_[1] * this.pixelRatio) / this.imagePixelRatio_,
      ],
      Math.ceil(this.width_ * this.imagePixelRatio_),
      this.declutterMode_,
      this.declutterImageWithText_,
    ]),
      this.hitDetectionInstructions.push([
        O.DRAW_IMAGE,
        r,
        o,
        this.hitDetectionImage_,
        this.anchorX_,
        this.anchorY_,
        this.height_,
        this.opacity_,
        this.originX_,
        this.originY_,
        this.rotateWithView_,
        this.rotation_,
        this.scale_,
        this.width_,
        this.declutterMode_,
        this.declutterImageWithText_,
      ]),
      this.endGeometry(e);
  }
  drawMultiPoint(t, e) {
    if (!this.image_) return;
    this.beginGeometry(t, e);
    const i = t.getFlatCoordinates(),
      n = t.getStride(),
      r = this.coordinates.length,
      o = this.appendFlatPointCoordinates(i, n);
    this.instructions.push([
      O.DRAW_IMAGE,
      r,
      o,
      this.image_,
      this.anchorX_ * this.imagePixelRatio_,
      this.anchorY_ * this.imagePixelRatio_,
      Math.ceil(this.height_ * this.imagePixelRatio_),
      this.opacity_,
      this.originX_ * this.imagePixelRatio_,
      this.originY_ * this.imagePixelRatio_,
      this.rotateWithView_,
      this.rotation_,
      [
        (this.scale_[0] * this.pixelRatio) / this.imagePixelRatio_,
        (this.scale_[1] * this.pixelRatio) / this.imagePixelRatio_,
      ],
      Math.ceil(this.width_ * this.imagePixelRatio_),
      this.declutterMode_,
      this.declutterImageWithText_,
    ]),
      this.hitDetectionInstructions.push([
        O.DRAW_IMAGE,
        r,
        o,
        this.hitDetectionImage_,
        this.anchorX_,
        this.anchorY_,
        this.height_,
        this.opacity_,
        this.originX_,
        this.originY_,
        this.rotateWithView_,
        this.rotation_,
        this.scale_,
        this.width_,
        this.declutterMode_,
        this.declutterImageWithText_,
      ]),
      this.endGeometry(e);
  }
  finish() {
    return (
      this.reverseHitDetectionInstructions(),
      (this.anchorX_ = void 0),
      (this.anchorY_ = void 0),
      (this.hitDetectionImage_ = null),
      (this.image_ = null),
      (this.imagePixelRatio_ = void 0),
      (this.height_ = void 0),
      (this.scale_ = void 0),
      (this.opacity_ = void 0),
      (this.originX_ = void 0),
      (this.originY_ = void 0),
      (this.rotateWithView_ = void 0),
      (this.rotation_ = void 0),
      (this.width_ = void 0),
      super.finish()
    );
  }
  setImageStyle(t, e) {
    const i = t.getAnchor(),
      n = t.getSize(),
      r = t.getOrigin();
    (this.imagePixelRatio_ = t.getPixelRatio(this.pixelRatio)),
      (this.anchorX_ = i[0]),
      (this.anchorY_ = i[1]),
      (this.hitDetectionImage_ = t.getHitDetectionImage()),
      (this.image_ = t.getImage(this.pixelRatio)),
      (this.height_ = n[1]),
      (this.opacity_ = t.getOpacity()),
      (this.originX_ = r[0]),
      (this.originY_ = r[1]),
      (this.rotateWithView_ = t.getRotateWithView()),
      (this.rotation_ = t.getRotation()),
      (this.scale_ = t.getScaleArray()),
      (this.width_ = n[0]),
      (this.declutterMode_ = t.getDeclutterMode()),
      (this.declutterImageWithText_ = e);
  }
}
const Bh = Yh;
class Zh extends Ei {
  constructor(t, e, i, n) {
    super(t, e, i, n);
  }
  drawFlatCoordinates_(t, e, i, n) {
    const r = this.coordinates.length,
      o = this.appendFlatLineCoordinates(t, e, i, n, !1, !1),
      a = [O.MOVE_TO_LINE_TO, r, o];
    return this.instructions.push(a), this.hitDetectionInstructions.push(a), i;
  }
  drawLineString(t, e) {
    const i = this.state,
      n = i.strokeStyle,
      r = i.lineWidth;
    if (n === void 0 || r === void 0) return;
    this.updateStrokeStyle(i, this.applyStroke),
      this.beginGeometry(t, e),
      this.hitDetectionInstructions.push(
        [
          O.SET_STROKE_STYLE,
          i.strokeStyle,
          i.lineWidth,
          i.lineCap,
          i.lineJoin,
          i.miterLimit,
          li,
          hi,
        ],
        ge
      );
    const o = t.getFlatCoordinates(),
      a = t.getStride();
    this.drawFlatCoordinates_(o, 0, o.length, a),
      this.hitDetectionInstructions.push(ie),
      this.endGeometry(e);
  }
  drawMultiLineString(t, e) {
    const i = this.state,
      n = i.strokeStyle,
      r = i.lineWidth;
    if (n === void 0 || r === void 0) return;
    this.updateStrokeStyle(i, this.applyStroke),
      this.beginGeometry(t, e),
      this.hitDetectionInstructions.push(
        [
          O.SET_STROKE_STYLE,
          i.strokeStyle,
          i.lineWidth,
          i.lineCap,
          i.lineJoin,
          i.miterLimit,
          i.lineDash,
          i.lineDashOffset,
        ],
        ge
      );
    const o = t.getEnds(),
      a = t.getFlatCoordinates(),
      l = t.getStride();
    let h = 0;
    for (let c = 0, u = o.length; c < u; ++c)
      h = this.drawFlatCoordinates_(a, h, o[c], l);
    this.hitDetectionInstructions.push(ie), this.endGeometry(e);
  }
  finish() {
    const t = this.state;
    return (
      t.lastStroke != null &&
        t.lastStroke != this.coordinates.length &&
        this.instructions.push(ie),
      this.reverseHitDetectionInstructions(),
      (this.state = null),
      super.finish()
    );
  }
  applyStroke(t) {
    t.lastStroke != null &&
      t.lastStroke != this.coordinates.length &&
      (this.instructions.push(ie), (t.lastStroke = this.coordinates.length)),
      (t.lastStroke = 0),
      super.applyStroke(t),
      this.instructions.push(ge);
  }
}
const Kh = Zh;
class Vh extends Ei {
  constructor(t, e, i, n) {
    super(t, e, i, n);
  }
  drawFlatCoordinatess_(t, e, i, n) {
    const r = this.state,
      o = r.fillStyle !== void 0,
      a = r.strokeStyle !== void 0,
      l = i.length;
    this.instructions.push(ge), this.hitDetectionInstructions.push(ge);
    for (let h = 0; h < l; ++h) {
      const c = i[h],
        u = this.coordinates.length,
        d = this.appendFlatLineCoordinates(t, e, c, n, !0, !a),
        f = [O.MOVE_TO_LINE_TO, u, d];
      this.instructions.push(f),
        this.hitDetectionInstructions.push(f),
        a &&
          (this.instructions.push(Rr), this.hitDetectionInstructions.push(Rr)),
        (e = c);
    }
    return (
      o && (this.instructions.push(Xi), this.hitDetectionInstructions.push(Xi)),
      a && (this.instructions.push(ie), this.hitDetectionInstructions.push(ie)),
      e
    );
  }
  drawCircle(t, e) {
    const i = this.state,
      n = i.fillStyle,
      r = i.strokeStyle;
    if (n === void 0 && r === void 0) return;
    this.setFillStrokeStyles_(),
      this.beginGeometry(t, e),
      i.fillStyle !== void 0 &&
        this.hitDetectionInstructions.push([O.SET_FILL_STYLE, zt]),
      i.strokeStyle !== void 0 &&
        this.hitDetectionInstructions.push([
          O.SET_STROKE_STYLE,
          i.strokeStyle,
          i.lineWidth,
          i.lineCap,
          i.lineJoin,
          i.miterLimit,
          i.lineDash,
          i.lineDashOffset,
        ]);
    const o = t.getFlatCoordinates(),
      a = t.getStride(),
      l = this.coordinates.length;
    this.appendFlatLineCoordinates(o, 0, o.length, a, !1, !1);
    const h = [O.CIRCLE, l];
    this.instructions.push(ge, h),
      this.hitDetectionInstructions.push(ge, h),
      i.fillStyle !== void 0 &&
        (this.instructions.push(Xi), this.hitDetectionInstructions.push(Xi)),
      i.strokeStyle !== void 0 &&
        (this.instructions.push(ie), this.hitDetectionInstructions.push(ie)),
      this.endGeometry(e);
  }
  drawPolygon(t, e) {
    const i = this.state,
      n = i.fillStyle,
      r = i.strokeStyle;
    if (n === void 0 && r === void 0) return;
    this.setFillStrokeStyles_(),
      this.beginGeometry(t, e),
      i.fillStyle !== void 0 &&
        this.hitDetectionInstructions.push([O.SET_FILL_STYLE, zt]),
      i.strokeStyle !== void 0 &&
        this.hitDetectionInstructions.push([
          O.SET_STROKE_STYLE,
          i.strokeStyle,
          i.lineWidth,
          i.lineCap,
          i.lineJoin,
          i.miterLimit,
          i.lineDash,
          i.lineDashOffset,
        ]);
    const o = t.getEnds(),
      a = t.getOrientedFlatCoordinates(),
      l = t.getStride();
    this.drawFlatCoordinatess_(a, 0, o, l), this.endGeometry(e);
  }
  drawMultiPolygon(t, e) {
    const i = this.state,
      n = i.fillStyle,
      r = i.strokeStyle;
    if (n === void 0 && r === void 0) return;
    this.setFillStrokeStyles_(),
      this.beginGeometry(t, e),
      i.fillStyle !== void 0 &&
        this.hitDetectionInstructions.push([O.SET_FILL_STYLE, zt]),
      i.strokeStyle !== void 0 &&
        this.hitDetectionInstructions.push([
          O.SET_STROKE_STYLE,
          i.strokeStyle,
          i.lineWidth,
          i.lineCap,
          i.lineJoin,
          i.miterLimit,
          i.lineDash,
          i.lineDashOffset,
        ]);
    const o = t.getEndss(),
      a = t.getOrientedFlatCoordinates(),
      l = t.getStride();
    let h = 0;
    for (let c = 0, u = o.length; c < u; ++c)
      h = this.drawFlatCoordinatess_(a, h, o[c], l);
    this.endGeometry(e);
  }
  finish() {
    this.reverseHitDetectionInstructions(), (this.state = null);
    const t = this.tolerance;
    if (t !== 0) {
      const e = this.coordinates;
      for (let i = 0, n = e.length; i < n; ++i) e[i] = ce(e[i], t);
    }
    return super.finish();
  }
  setFillStrokeStyles_() {
    const t = this.state;
    t.fillStyle !== void 0 && this.updateFillStyle(t, this.createFill),
      t.strokeStyle !== void 0 && this.updateStrokeStyle(t, this.applyStroke);
  }
}
const Tr = Vh;
function Uh(s, t, e, i, n) {
  const r = [];
  let o = e,
    a = 0,
    l = t.slice(e, 2);
  for (; a < s && o + n < i; ) {
    const [h, c] = l.slice(-2),
      u = t[o + n],
      d = t[o + n + 1],
      f = Math.sqrt((u - h) * (u - h) + (d - c) * (d - c));
    if (((a += f), a >= s)) {
      const g = (s - a + f) / f,
        _ = Rt(h, u, g),
        m = Rt(c, d, g);
      l.push(_, m), r.push(l), (l = [_, m]), a == s && (o += n), (a = 0);
    } else if (a < s) l.push(t[o + n], t[o + n + 1]), (o += n);
    else {
      const g = f - a,
        _ = Rt(h, u, g / f),
        m = Rt(c, d, g / f);
      l.push(_, m), r.push(l), (l = [_, m]), (a = 0), (o += n);
    }
  }
  return a > 0 && r.push(l), r;
}
function jh(s, t, e, i, n) {
  let r = e,
    o = e,
    a = 0,
    l = 0,
    h = e,
    c,
    u,
    d,
    f,
    g,
    _,
    m,
    p,
    y,
    x;
  for (u = e; u < i; u += n) {
    const E = t[u],
      C = t[u + 1];
    g !== void 0 &&
      ((y = E - g),
      (x = C - _),
      (f = Math.sqrt(y * y + x * x)),
      m !== void 0 &&
        ((l += d),
        (c = Math.acos((m * y + p * x) / (d * f))),
        c > s && (l > a && ((a = l), (r = h), (o = u)), (l = 0), (h = u - n))),
      (d = f),
      (m = y),
      (p = x)),
      (g = E),
      (_ = C);
  }
  return (l += f), l > a ? [h, u] : [r, o];
}
const ii = {
  left: 0,
  end: 0,
  center: 0.5,
  right: 1,
  start: 1,
  top: 0,
  middle: 0.5,
  hanging: 0.2,
  alphabetic: 0.8,
  ideographic: 0.8,
  bottom: 1,
};
class Hh extends Ei {
  constructor(t, e, i, n) {
    super(t, e, i, n),
      (this.labels_ = null),
      (this.text_ = ""),
      (this.textOffsetX_ = 0),
      (this.textOffsetY_ = 0),
      (this.textRotateWithView_ = void 0),
      (this.textRotation_ = 0),
      (this.textFillState_ = null),
      (this.fillStates = {}),
      (this.textStrokeState_ = null),
      (this.strokeStates = {}),
      (this.textState_ = {}),
      (this.textStates = {}),
      (this.textKey_ = ""),
      (this.fillKey_ = ""),
      (this.strokeKey_ = ""),
      (this.declutterImageWithText_ = void 0);
  }
  finish() {
    const t = super.finish();
    return (
      (t.textStates = this.textStates),
      (t.fillStates = this.fillStates),
      (t.strokeStates = this.strokeStates),
      t
    );
  }
  drawText(t, e) {
    const i = this.textFillState_,
      n = this.textStrokeState_,
      r = this.textState_;
    if (this.text_ === "" || !r || (!i && !n)) return;
    const o = this.coordinates;
    let a = o.length;
    const l = t.getType();
    let h = null,
      c = t.getStride();
    if (
      r.placement === "line" &&
      (l == "LineString" ||
        l == "MultiLineString" ||
        l == "Polygon" ||
        l == "MultiPolygon")
    ) {
      if (!at(this.getBufferedMaxExtent(), t.getExtent())) return;
      let u;
      if (((h = t.getFlatCoordinates()), l == "LineString")) u = [h.length];
      else if (l == "MultiLineString") u = t.getEnds();
      else if (l == "Polygon") u = t.getEnds().slice(0, 1);
      else if (l == "MultiPolygon") {
        const _ = t.getEndss();
        u = [];
        for (let m = 0, p = _.length; m < p; ++m) u.push(_[m][0]);
      }
      this.beginGeometry(t, e);
      const d = r.repeat,
        f = d ? void 0 : r.textAlign;
      let g = 0;
      for (let _ = 0, m = u.length; _ < m; ++_) {
        let p;
        d
          ? (p = Uh(d * this.resolution, h, g, u[_], c))
          : (p = [h.slice(g, u[_])]);
        for (let y = 0, x = p.length; y < x; ++y) {
          const E = p[y];
          let C = 0,
            T = E.length;
          if (f == null) {
            const S = jh(r.maxAngle, E, 0, E.length, 2);
            (C = S[0]), (T = S[1]);
          }
          for (let S = C; S < T; S += c) o.push(E[S], E[S + 1]);
          const w = o.length;
          (g = u[_]), this.drawChars_(a, w), (a = w);
        }
      }
      this.endGeometry(e);
    } else {
      let u = r.overflow ? null : [];
      switch (l) {
        case "Point":
        case "MultiPoint":
          h = t.getFlatCoordinates();
          break;
        case "LineString":
          h = t.getFlatMidpoint();
          break;
        case "Circle":
          h = t.getCenter();
          break;
        case "MultiLineString":
          (h = t.getFlatMidpoints()), (c = 2);
          break;
        case "Polygon":
          (h = t.getFlatInteriorPoint()),
            r.overflow || u.push(h[2] / this.resolution),
            (c = 3);
          break;
        case "MultiPolygon":
          const m = t.getFlatInteriorPoints();
          h = [];
          for (let p = 0, y = m.length; p < y; p += 3)
            r.overflow || u.push(m[p + 2] / this.resolution),
              h.push(m[p], m[p + 1]);
          if (h.length === 0) return;
          c = 2;
          break;
      }
      const d = this.appendFlatPointCoordinates(h, c);
      if (d === a) return;
      if (u && (d - a) / 2 !== h.length / c) {
        let m = a / 2;
        u = u.filter((p, y) => {
          const x =
            o[(m + y) * 2] === h[y * c] && o[(m + y) * 2 + 1] === h[y * c + 1];
          return x || --m, x;
        });
      }
      this.saveTextStates_(),
        (r.backgroundFill || r.backgroundStroke) &&
          (this.setFillStrokeStyle(r.backgroundFill, r.backgroundStroke),
          r.backgroundFill &&
            (this.updateFillStyle(this.state, this.createFill),
            this.hitDetectionInstructions.push(this.createFill(this.state))),
          r.backgroundStroke &&
            (this.updateStrokeStyle(this.state, this.applyStroke),
            this.hitDetectionInstructions.push(this.createStroke(this.state)))),
        this.beginGeometry(t, e);
      let f = r.padding;
      if (f != fe && (r.scale[0] < 0 || r.scale[1] < 0)) {
        let m = r.padding[0],
          p = r.padding[1],
          y = r.padding[2],
          x = r.padding[3];
        r.scale[0] < 0 && ((p = -p), (x = -x)),
          r.scale[1] < 0 && ((m = -m), (y = -y)),
          (f = [m, p, y, x]);
      }
      const g = this.pixelRatio;
      this.instructions.push([
        O.DRAW_IMAGE,
        a,
        d,
        null,
        NaN,
        NaN,
        NaN,
        1,
        0,
        0,
        this.textRotateWithView_,
        this.textRotation_,
        [1, 1],
        NaN,
        void 0,
        this.declutterImageWithText_,
        f == fe
          ? fe
          : f.map(function (m) {
              return m * g;
            }),
        !!r.backgroundFill,
        !!r.backgroundStroke,
        this.text_,
        this.textKey_,
        this.strokeKey_,
        this.fillKey_,
        this.textOffsetX_,
        this.textOffsetY_,
        u,
      ]);
      const _ = 1 / g;
      this.hitDetectionInstructions.push([
        O.DRAW_IMAGE,
        a,
        d,
        null,
        NaN,
        NaN,
        NaN,
        1,
        0,
        0,
        this.textRotateWithView_,
        this.textRotation_,
        [_, _],
        NaN,
        void 0,
        this.declutterImageWithText_,
        f,
        !!r.backgroundFill,
        !!r.backgroundStroke,
        this.text_,
        this.textKey_,
        this.strokeKey_,
        this.fillKey_,
        this.textOffsetX_,
        this.textOffsetY_,
        u,
      ]),
        this.endGeometry(e);
    }
  }
  saveTextStates_() {
    const t = this.textStrokeState_,
      e = this.textState_,
      i = this.textFillState_,
      n = this.strokeKey_;
    t &&
      (n in this.strokeStates ||
        (this.strokeStates[n] = {
          strokeStyle: t.strokeStyle,
          lineCap: t.lineCap,
          lineDashOffset: t.lineDashOffset,
          lineWidth: t.lineWidth,
          lineJoin: t.lineJoin,
          miterLimit: t.miterLimit,
          lineDash: t.lineDash,
        }));
    const r = this.textKey_;
    r in this.textStates ||
      (this.textStates[r] = {
        font: e.font,
        textAlign: e.textAlign || di,
        justify: e.justify,
        textBaseline: e.textBaseline || qi,
        scale: e.scale,
      });
    const o = this.fillKey_;
    i &&
      (o in this.fillStates ||
        (this.fillStates[o] = { fillStyle: i.fillStyle }));
  }
  drawChars_(t, e) {
    const i = this.textStrokeState_,
      n = this.textState_,
      r = this.strokeKey_,
      o = this.textKey_,
      a = this.fillKey_;
    this.saveTextStates_();
    const l = this.pixelRatio,
      h = ii[n.textBaseline],
      c = this.textOffsetY_ * l,
      u = this.text_,
      d = i ? (i.lineWidth * Math.abs(n.scale[0])) / 2 : 0;
    this.instructions.push([
      O.DRAW_CHARS,
      t,
      e,
      h,
      n.overflow,
      a,
      n.maxAngle,
      l,
      c,
      r,
      d * l,
      u,
      o,
      1,
    ]),
      this.hitDetectionInstructions.push([
        O.DRAW_CHARS,
        t,
        e,
        h,
        n.overflow,
        a,
        n.maxAngle,
        1,
        c,
        r,
        d,
        u,
        o,
        1 / l,
      ]);
  }
  setTextStyle(t, e) {
    let i, n, r;
    if (!t) this.text_ = "";
    else {
      const o = t.getFill();
      o
        ? ((n = this.textFillState_),
          n || ((n = {}), (this.textFillState_ = n)),
          (n.fillStyle = Lt(o.getColor() || zt)))
        : ((n = null), (this.textFillState_ = n));
      const a = t.getStroke();
      if (!a) (r = null), (this.textStrokeState_ = r);
      else {
        (r = this.textStrokeState_),
          r || ((r = {}), (this.textStrokeState_ = r));
        const g = a.getLineDash(),
          _ = a.getLineDashOffset(),
          m = a.getWidth(),
          p = a.getMiterLimit();
        (r.lineCap = a.getLineCap() || $i),
          (r.lineDash = g ? g.slice() : li),
          (r.lineDashOffset = _ === void 0 ? hi : _),
          (r.lineJoin = a.getLineJoin() || Ze),
          (r.lineWidth = m === void 0 ? fi : m),
          (r.miterLimit = p === void 0 ? ci : p),
          (r.strokeStyle = Lt(a.getColor() || ui));
      }
      i = this.textState_;
      const l = t.getFont() || vo;
      Sh(l);
      const h = t.getScaleArray();
      (i.overflow = t.getOverflow()),
        (i.font = l),
        (i.maxAngle = t.getMaxAngle()),
        (i.placement = t.getPlacement()),
        (i.textAlign = t.getTextAlign()),
        (i.repeat = t.getRepeat()),
        (i.justify = t.getJustify()),
        (i.textBaseline = t.getTextBaseline() || qi),
        (i.backgroundFill = t.getBackgroundFill()),
        (i.backgroundStroke = t.getBackgroundStroke()),
        (i.padding = t.getPadding() || fe),
        (i.scale = h === void 0 ? [1, 1] : h);
      const c = t.getOffsetX(),
        u = t.getOffsetY(),
        d = t.getRotateWithView(),
        f = t.getRotation();
      (this.text_ = t.getText() || ""),
        (this.textOffsetX_ = c === void 0 ? 0 : c),
        (this.textOffsetY_ = u === void 0 ? 0 : u),
        (this.textRotateWithView_ = d === void 0 ? !1 : d),
        (this.textRotation_ = f === void 0 ? 0 : f),
        (this.strokeKey_ = r
          ? (typeof r.strokeStyle == "string"
              ? r.strokeStyle
              : z(r.strokeStyle)) +
            r.lineCap +
            r.lineDashOffset +
            "|" +
            r.lineWidth +
            r.lineJoin +
            r.miterLimit +
            "[" +
            r.lineDash.join() +
            "]"
          : ""),
        (this.textKey_ =
          i.font +
          i.scale +
          (i.textAlign || "?") +
          (i.repeat || "?") +
          (i.justify || "?") +
          (i.textBaseline || "?")),
        (this.fillKey_ = n
          ? typeof n.fillStyle == "string"
            ? n.fillStyle
            : "|" + z(n.fillStyle)
          : "");
    }
    this.declutterImageWithText_ = e;
  }
}
const $h = {
  Circle: Tr,
  Default: Ei,
  Image: Bh,
  LineString: Kh,
  Polygon: Tr,
  Text: Hh,
};
class qh {
  constructor(t, e, i, n) {
    (this.tolerance_ = t),
      (this.maxExtent_ = e),
      (this.pixelRatio_ = n),
      (this.resolution_ = i),
      (this.buildersByZIndex_ = {});
  }
  finish() {
    const t = {};
    for (const e in this.buildersByZIndex_) {
      t[e] = t[e] || {};
      const i = this.buildersByZIndex_[e];
      for (const n in i) {
        const r = i[n].finish();
        t[e][n] = r;
      }
    }
    return t;
  }
  getBuilder(t, e) {
    const i = t !== void 0 ? t.toString() : "0";
    let n = this.buildersByZIndex_[i];
    n === void 0 && ((n = {}), (this.buildersByZIndex_[i] = n));
    let r = n[e];
    if (r === void 0) {
      const o = $h[e];
      (r = new o(
        this.tolerance_,
        this.maxExtent_,
        this.resolution_,
        this.pixelRatio_
      )),
        (n[e] = r);
    }
    return r;
  }
}
const Ir = qh;
function Jh(s, t, e, i, n, r, o, a, l, h, c, u) {
  let d = s[t],
    f = s[t + 1],
    g = 0,
    _ = 0,
    m = 0,
    p = 0;
  function y() {
    (g = d),
      (_ = f),
      (t += i),
      (d = s[t]),
      (f = s[t + 1]),
      (p += m),
      (m = Math.sqrt((d - g) * (d - g) + (f - _) * (f - _)));
  }
  do y();
  while (t < e - i && p + m < r);
  let x = m === 0 ? 0 : (r - p) / m;
  const E = Rt(g, d, x),
    C = Rt(_, f, x),
    T = t - i,
    w = p,
    S = r + a * l(h, n, c);
  for (; t < e - i && p + m < S; ) y();
  x = m === 0 ? 0 : (S - p) / m;
  const v = Rt(g, d, x),
    M = Rt(_, f, x);
  let N;
  if (u) {
    const b = [E, C, v, M];
    eo(b, 0, 4, 2, u, b, b), (N = b[0] > b[2]);
  } else N = E > v;
  const k = Math.PI,
    P = [],
    q = T + i === t;
  (t = T), (m = 0), (p = w), (d = s[t]), (f = s[t + 1]);
  let L;
  if (q) {
    y(), (L = Math.atan2(f - _, d - g)), N && (L += L > 0 ? -k : k);
    const b = (v + E) / 2,
      I = (M + C) / 2;
    return (P[0] = [b, I, (S - r) / 2, L, n]), P;
  }
  n = n.replace(/\n/g, " ");
  for (let b = 0, I = n.length; b < I; ) {
    y();
    let D = Math.atan2(f - _, d - g);
    if ((N && (D += D > 0 ? -k : k), L !== void 0)) {
      let Y = D - L;
      if (((Y += Y > k ? -2 * k : Y < -k ? 2 * k : 0), Math.abs(Y) > o))
        return null;
    }
    L = D;
    const K = b;
    let B = 0;
    for (; b < I; ++b) {
      const Y = N ? I - b - 1 : b,
        V = a * l(h, n[Y], c);
      if (t + i < e && p + m < r + B + V / 2) break;
      B += V;
    }
    if (b === K) continue;
    const tt = N ? n.substring(I - K, I - b) : n.substring(K, b);
    x = m === 0 ? 0 : (r + B / 2 - p) / m;
    const R = Rt(g, d, x),
      dt = Rt(_, f, x);
    P.push([R, dt, B / 2, D, tt]), (r += B);
  }
  return P;
}
const we = Tt(),
  Ht = [],
  Nt = [],
  Gt = [],
  $t = [];
function Sr(s) {
  return s[3].declutterBox;
}
const Qh = new RegExp(
  "[" +
    String.fromCharCode(1425) +
    "-" +
    String.fromCharCode(2303) +
    String.fromCharCode(64285) +
    "-" +
    String.fromCharCode(65023) +
    String.fromCharCode(65136) +
    "-" +
    String.fromCharCode(65276) +
    String.fromCharCode(67584) +
    "-" +
    String.fromCharCode(69631) +
    String.fromCharCode(124928) +
    "-" +
    String.fromCharCode(126975) +
    "]"
);
function wr(s, t) {
  return (
    (t === "start" || t === "end") &&
      !Qh.test(s) &&
      (t = t === "start" ? "left" : "right"),
    ii[t]
  );
}
function tc(s, t, e) {
  return (
    e > 0 &&
      s.push(
        `
`,
        ""
      ),
    s.push(t, ""),
    s
  );
}
class ec {
  constructor(t, e, i, n) {
    (this.overlaps = i),
      (this.pixelRatio = e),
      (this.resolution = t),
      this.alignFill_,
      (this.instructions = n.instructions),
      (this.coordinates = n.coordinates),
      (this.coordinateCache_ = {}),
      (this.renderedTransform_ = Mt()),
      (this.hitDetectionInstructions = n.hitDetectionInstructions),
      (this.pixelCoordinates_ = null),
      (this.viewRotation_ = 0),
      (this.fillStates = n.fillStates || {}),
      (this.strokeStates = n.strokeStates || {}),
      (this.textStates = n.textStates || {}),
      (this.widths_ = {}),
      (this.labels_ = {});
  }
  createLabel(t, e, i, n) {
    const r = t + e + i + n;
    if (this.labels_[r]) return this.labels_[r];
    const o = n ? this.strokeStates[n] : null,
      a = i ? this.fillStates[i] : null,
      l = this.textStates[e],
      h = this.pixelRatio,
      c = [l.scale[0] * h, l.scale[1] * h],
      u = Array.isArray(t),
      d = l.justify
        ? ii[l.justify]
        : wr(Array.isArray(t) ? t[0] : t, l.textAlign || di),
      f = n && o.lineWidth ? o.lineWidth : 0,
      g = u
        ? t
        : t
            .split(
              `
`
            )
            .reduce(tc, []),
      { width: _, height: m, widths: p, heights: y, lineWidths: x } = vh(l, g),
      E = _ + f,
      C = [],
      T = (E + 2) * c[0],
      w = (m + f) * c[1],
      S = {
        width: T < 0 ? Math.floor(T) : Math.ceil(T),
        height: w < 0 ? Math.floor(w) : Math.ceil(w),
        contextInstructions: C,
      };
    (c[0] != 1 || c[1] != 1) && C.push("scale", c),
      n &&
        (C.push("strokeStyle", o.strokeStyle),
        C.push("lineWidth", f),
        C.push("lineCap", o.lineCap),
        C.push("lineJoin", o.lineJoin),
        C.push("miterLimit", o.miterLimit),
        C.push("setLineDash", [o.lineDash]),
        C.push("lineDashOffset", o.lineDashOffset)),
      i && C.push("fillStyle", a.fillStyle),
      C.push("textBaseline", "middle"),
      C.push("textAlign", "center");
    const v = 0.5 - d;
    let M = d * E + v * f;
    const N = [],
      k = [];
    let P = 0,
      q = 0,
      L = 0,
      b = 0,
      I;
    for (let D = 0, K = g.length; D < K; D += 2) {
      const B = g[D];
      if (
        B ===
        `
`
      ) {
        (q += P), (P = 0), (M = d * E + v * f), ++b;
        continue;
      }
      const tt = g[D + 1] || l.font;
      tt !== I && (n && N.push("font", tt), i && k.push("font", tt), (I = tt)),
        (P = Math.max(P, y[L]));
      const R = [B, M + v * p[L] + d * (p[L] - x[b]), 0.5 * (f + P) + q];
      (M += p[L]),
        n && N.push("strokeText", R),
        i && k.push("fillText", R),
        ++L;
    }
    return (
      Array.prototype.push.apply(C, N),
      Array.prototype.push.apply(C, k),
      (this.labels_[r] = S),
      S
    );
  }
  replayTextBackground_(t, e, i, n, r, o, a) {
    t.beginPath(),
      t.moveTo.apply(t, e),
      t.lineTo.apply(t, i),
      t.lineTo.apply(t, n),
      t.lineTo.apply(t, r),
      t.lineTo.apply(t, e),
      o && ((this.alignFill_ = o[2]), this.fill_(t)),
      a && (this.setStrokeStyle_(t, a), t.stroke());
  }
  calculateImageOrLabelDimensions_(
    t,
    e,
    i,
    n,
    r,
    o,
    a,
    l,
    h,
    c,
    u,
    d,
    f,
    g,
    _,
    m
  ) {
    (a *= d[0]), (l *= d[1]);
    let p = i - a,
      y = n - l;
    const x = r + h > t ? t - h : r,
      E = o + c > e ? e - c : o,
      C = g[3] + x * d[0] + g[1],
      T = g[0] + E * d[1] + g[2],
      w = p - g[3],
      S = y - g[0];
    (_ || u !== 0) &&
      ((Ht[0] = w),
      ($t[0] = w),
      (Ht[1] = S),
      (Nt[1] = S),
      (Nt[0] = w + C),
      (Gt[0] = Nt[0]),
      (Gt[1] = S + T),
      ($t[1] = Gt[1]));
    let v;
    return (
      u !== 0
        ? ((v = re(Mt(), i, n, 1, 1, u, -i, -n)),
          it(v, Ht),
          it(v, Nt),
          it(v, Gt),
          it(v, $t),
          Yt(
            Math.min(Ht[0], Nt[0], Gt[0], $t[0]),
            Math.min(Ht[1], Nt[1], Gt[1], $t[1]),
            Math.max(Ht[0], Nt[0], Gt[0], $t[0]),
            Math.max(Ht[1], Nt[1], Gt[1], $t[1]),
            we
          ))
        : Yt(
            Math.min(w, w + C),
            Math.min(S, S + T),
            Math.max(w, w + C),
            Math.max(S, S + T),
            we
          ),
      f && ((p = Math.round(p)), (y = Math.round(y))),
      {
        drawImageX: p,
        drawImageY: y,
        drawImageW: x,
        drawImageH: E,
        originX: h,
        originY: c,
        declutterBox: {
          minX: we[0],
          minY: we[1],
          maxX: we[2],
          maxY: we[3],
          value: m,
        },
        canvasTransform: v,
        scale: d,
      }
    );
  }
  replayImageOrLabel_(t, e, i, n, r, o, a) {
    const l = !!(o || a),
      h = n.declutterBox,
      c = t.canvas,
      u = a ? (a[2] * n.scale[0]) / 2 : 0;
    return (
      h.minX - u <= c.width / e &&
        h.maxX + u >= 0 &&
        h.minY - u <= c.height / e &&
        h.maxY + u >= 0 &&
        (l && this.replayTextBackground_(t, Ht, Nt, Gt, $t, o, a),
        Lh(
          t,
          n.canvasTransform,
          r,
          i,
          n.originX,
          n.originY,
          n.drawImageW,
          n.drawImageH,
          n.drawImageX,
          n.drawImageY,
          n.scale
        )),
      !0
    );
  }
  fill_(t) {
    if (this.alignFill_) {
      const e = it(this.renderedTransform_, [0, 0]),
        i = 512 * this.pixelRatio;
      t.save(), t.translate(e[0] % i, e[1] % i), t.rotate(this.viewRotation_);
    }
    t.fill(), this.alignFill_ && t.restore();
  }
  setStrokeStyle_(t, e) {
    (t.strokeStyle = e[1]),
      (t.lineWidth = e[2]),
      (t.lineCap = e[3]),
      (t.lineJoin = e[4]),
      (t.miterLimit = e[5]),
      (t.lineDashOffset = e[7]),
      t.setLineDash(e[6]);
  }
  drawLabelWithPointPlacement_(t, e, i, n) {
    const r = this.textStates[e],
      o = this.createLabel(t, e, n, i),
      a = this.strokeStates[i],
      l = this.pixelRatio,
      h = wr(Array.isArray(t) ? t[0] : t, r.textAlign || di),
      c = ii[r.textBaseline || qi],
      u = a && a.lineWidth ? a.lineWidth : 0,
      d = o.width / l - 2 * r.scale[0],
      f = h * d + 2 * (0.5 - h) * u,
      g = (c * o.height) / l + 2 * (0.5 - c) * u;
    return { label: o, anchorX: f, anchorY: g };
  }
  execute_(t, e, i, n, r, o, a, l) {
    let h;
    this.pixelCoordinates_ && oe(i, this.renderedTransform_)
      ? (h = this.pixelCoordinates_)
      : (this.pixelCoordinates_ || (this.pixelCoordinates_ = []),
        (h = _e(
          this.coordinates,
          0,
          this.coordinates.length,
          2,
          i,
          this.pixelCoordinates_
        )),
        wa(this.renderedTransform_, i));
    let c = 0;
    const u = n.length;
    let d = 0,
      f,
      g,
      _,
      m,
      p,
      y,
      x,
      E,
      C,
      T,
      w,
      S,
      v = 0,
      M = 0,
      N = null,
      k = null;
    const P = this.coordinateCache_,
      q = this.viewRotation_,
      L = Math.round(Math.atan2(-i[1], i[0]) * 1e12) / 1e12,
      b = {
        context: t,
        pixelRatio: this.pixelRatio,
        resolution: this.resolution,
        rotation: q,
      },
      I = this.instructions != n || this.overlaps ? 0 : 200;
    let D, K, B, tt;
    for (; c < u; ) {
      const R = n[c];
      switch (R[0]) {
        case O.BEGIN_GEOMETRY:
          (D = R[1]),
            (tt = R[3]),
            D.getGeometry()
              ? a !== void 0 && !at(a, tt.getExtent())
                ? (c = R[2] + 1)
                : ++c
              : (c = R[2]);
          break;
        case O.BEGIN_PATH:
          v > I && (this.fill_(t), (v = 0)),
            M > I && (t.stroke(), (M = 0)),
            !v && !M && (t.beginPath(), (m = NaN), (p = NaN)),
            ++c;
          break;
        case O.CIRCLE:
          d = R[1];
          const Y = h[d],
            V = h[d + 1],
            Zt = h[d + 2],
            St = h[d + 3],
            nt = Zt - Y,
            Pt = St - V,
            pe = Math.sqrt(nt * nt + Pt * Pt);
          t.moveTo(Y + pe, V), t.arc(Y, V, pe, 0, 2 * Math.PI, !0), ++c;
          break;
        case O.CLOSE_PATH:
          t.closePath(), ++c;
          break;
        case O.CUSTOM:
          (d = R[1]), (f = R[2]);
          const Ti = R[3],
            ye = R[4],
            Ii = R.length == 6 ? R[5] : void 0;
          (b.geometry = Ti), (b.feature = D), c in P || (P[c] = []);
          const Kt = P[c];
          Ii
            ? Ii(h, d, f, 2, Kt)
            : ((Kt[0] = h[d]), (Kt[1] = h[d + 1]), (Kt.length = 2)),
            ye(Kt, b),
            ++c;
          break;
        case O.DRAW_IMAGE:
          (d = R[1]), (f = R[2]), (E = R[3]), (g = R[4]), (_ = R[5]);
          let Ve = R[6];
          const Vt = R[7],
            Si = R[8],
            wi = R[9],
            vi = R[10];
          let xe = R[11];
          const pn = R[12];
          let ht = R[13];
          const mt = R[14],
            xt = R[15];
          if (!E && R.length >= 20) {
            (C = R[19]), (T = R[20]), (w = R[21]), (S = R[22]);
            const ft = this.drawLabelWithPointPlacement_(C, T, w, S);
            (E = ft.label), (R[3] = E);
            const Re = R[23];
            (g = (ft.anchorX - Re) * this.pixelRatio), (R[4] = g);
            const pt = R[24];
            (_ = (ft.anchorY - pt) * this.pixelRatio),
              (R[5] = _),
              (Ve = E.height),
              (R[6] = Ve),
              (ht = E.width),
              (R[13] = ht);
          }
          let Dt;
          R.length > 25 && (Dt = R[25]);
          let Ee, ae, Ut;
          R.length > 17
            ? ((Ee = R[16]), (ae = R[17]), (Ut = R[18]))
            : ((Ee = fe), (ae = !1), (Ut = !1)),
            vi && L ? (xe += q) : !vi && !L && (xe -= q);
          let Ce = 0;
          for (; d < f; d += 2) {
            if (Dt && Dt[Ce++] < ht / this.pixelRatio) continue;
            const ft = this.calculateImageOrLabelDimensions_(
                E.width,
                E.height,
                h[d],
                h[d + 1],
                ht,
                Ve,
                g,
                _,
                Si,
                wi,
                xe,
                pn,
                r,
                Ee,
                ae || Ut,
                D
              ),
              Re = [t, e, E, ft, Vt, ae ? N : null, Ut ? k : null];
            if (l) {
              if (mt === "none") continue;
              if (mt === "obstacle") {
                l.insert(ft.declutterBox);
                continue;
              } else {
                let pt, Ft;
                if (xt) {
                  const gt = f - d;
                  if (!xt[gt]) {
                    xt[gt] = Re;
                    continue;
                  }
                  if (
                    ((pt = xt[gt]),
                    delete xt[gt],
                    (Ft = Sr(pt)),
                    l.collides(Ft))
                  )
                    continue;
                }
                if (l.collides(ft.declutterBox)) continue;
                pt && (l.insert(Ft), this.replayImageOrLabel_.apply(this, pt)),
                  l.insert(ft.declutterBox);
              }
            }
            this.replayImageOrLabel_.apply(this, Re);
          }
          ++c;
          break;
        case O.DRAW_CHARS:
          const Li = R[1],
            ot = R[2],
            yn = R[3],
            jo = R[4];
          S = R[5];
          const Ho = R[6],
            bs = R[7],
            Ps = R[8];
          w = R[9];
          const xn = R[10];
          (C = R[11]), (T = R[12]);
          const Ds = [R[13], R[13]],
            En = this.textStates[T],
            Ue = En.font,
            je = [En.scale[0] * bs, En.scale[1] * bs];
          let He;
          Ue in this.widths_
            ? (He = this.widths_[Ue])
            : ((He = {}), (this.widths_[Ue] = He));
          const Fs = Rl(h, Li, ot, 2),
            ks = Math.abs(je[0]) * pr(Ue, C, He);
          if (jo || ks <= Fs) {
            const ft = this.textStates[T].textAlign,
              Re = (Fs - ks) * ii[ft],
              pt = Jh(
                h,
                Li,
                ot,
                2,
                C,
                Re,
                Ho,
                Math.abs(je[0]),
                pr,
                Ue,
                He,
                L ? 0 : this.viewRotation_
              );
            t: if (pt) {
              const Ft = [];
              let gt, Ai, Mi, ct, yt;
              if (w)
                for (gt = 0, Ai = pt.length; gt < Ai; ++gt) {
                  (yt = pt[gt]),
                    (Mi = yt[4]),
                    (ct = this.createLabel(Mi, T, "", w)),
                    (g = yt[2] + (je[0] < 0 ? -xn : xn)),
                    (_ =
                      yn * ct.height +
                      ((0.5 - yn) * 2 * xn * je[1]) / je[0] -
                      Ps);
                  const kt = this.calculateImageOrLabelDimensions_(
                    ct.width,
                    ct.height,
                    yt[0],
                    yt[1],
                    ct.width,
                    ct.height,
                    g,
                    _,
                    0,
                    0,
                    yt[3],
                    Ds,
                    !1,
                    fe,
                    !1,
                    D
                  );
                  if (l && l.collides(kt.declutterBox)) break t;
                  Ft.push([t, e, ct, kt, 1, null, null]);
                }
              if (S)
                for (gt = 0, Ai = pt.length; gt < Ai; ++gt) {
                  (yt = pt[gt]),
                    (Mi = yt[4]),
                    (ct = this.createLabel(Mi, T, S, "")),
                    (g = yt[2]),
                    (_ = yn * ct.height - Ps);
                  const kt = this.calculateImageOrLabelDimensions_(
                    ct.width,
                    ct.height,
                    yt[0],
                    yt[1],
                    ct.width,
                    ct.height,
                    g,
                    _,
                    0,
                    0,
                    yt[3],
                    Ds,
                    !1,
                    fe,
                    !1,
                    D
                  );
                  if (l && l.collides(kt.declutterBox)) break t;
                  Ft.push([t, e, ct, kt, 1, null, null]);
                }
              l && l.load(Ft.map(Sr));
              for (let kt = 0, $o = Ft.length; kt < $o; ++kt)
                this.replayImageOrLabel_.apply(this, Ft[kt]);
            }
          }
          ++c;
          break;
        case O.END_GEOMETRY:
          if (o !== void 0) {
            D = R[1];
            const ft = o(D, tt);
            if (ft) return ft;
          }
          ++c;
          break;
        case O.FILL:
          I ? v++ : this.fill_(t), ++c;
          break;
        case O.MOVE_TO_LINE_TO:
          for (
            d = R[1],
              f = R[2],
              K = h[d],
              B = h[d + 1],
              y = (K + 0.5) | 0,
              x = (B + 0.5) | 0,
              (y !== m || x !== p) && (t.moveTo(K, B), (m = y), (p = x)),
              d += 2;
            d < f;
            d += 2
          )
            (K = h[d]),
              (B = h[d + 1]),
              (y = (K + 0.5) | 0),
              (x = (B + 0.5) | 0),
              (d == f - 2 || y !== m || x !== p) &&
                (t.lineTo(K, B), (m = y), (p = x));
          ++c;
          break;
        case O.SET_FILL_STYLE:
          (N = R),
            (this.alignFill_ = R[2]),
            v && (this.fill_(t), (v = 0), M && (t.stroke(), (M = 0))),
            (t.fillStyle = R[1]),
            ++c;
          break;
        case O.SET_STROKE_STYLE:
          (k = R), M && (t.stroke(), (M = 0)), this.setStrokeStyle_(t, R), ++c;
          break;
        case O.STROKE:
          I ? M++ : t.stroke(), ++c;
          break;
        default:
          ++c;
          break;
      }
    }
    v && this.fill_(t), M && t.stroke();
  }
  execute(t, e, i, n, r, o) {
    (this.viewRotation_ = n),
      this.execute_(t, e, i, this.instructions, r, void 0, void 0, o);
  }
  executeHitDetection(t, e, i, n, r) {
    return (
      (this.viewRotation_ = i),
      this.execute_(t, 1, e, this.hitDetectionInstructions, !0, n, r)
    );
  }
}
const ic = ec,
  bn = ["Polygon", "Circle", "LineString", "Image", "Text", "Default"];
class nc {
  constructor(t, e, i, n, r, o) {
    (this.maxExtent_ = t),
      (this.overlaps_ = n),
      (this.pixelRatio_ = i),
      (this.resolution_ = e),
      (this.renderBuffer_ = o),
      (this.executorsByZIndex_ = {}),
      (this.hitDetectionContext_ = null),
      (this.hitDetectionTransform_ = Mt()),
      this.createExecutors_(r);
  }
  clip(t, e) {
    const i = this.getClipCoords(e);
    t.beginPath(),
      t.moveTo(i[0], i[1]),
      t.lineTo(i[2], i[3]),
      t.lineTo(i[4], i[5]),
      t.lineTo(i[6], i[7]),
      t.clip();
  }
  createExecutors_(t) {
    for (const e in t) {
      let i = this.executorsByZIndex_[e];
      i === void 0 && ((i = {}), (this.executorsByZIndex_[e] = i));
      const n = t[e];
      for (const r in n) {
        const o = n[r];
        i[r] = new ic(this.resolution_, this.pixelRatio_, this.overlaps_, o);
      }
    }
  }
  hasExecutors(t) {
    for (const e in this.executorsByZIndex_) {
      const i = this.executorsByZIndex_[e];
      for (let n = 0, r = t.length; n < r; ++n) if (t[n] in i) return !0;
    }
    return !1;
  }
  forEachFeatureAtCoordinate(t, e, i, n, r, o) {
    n = Math.round(n);
    const a = n * 2 + 1,
      l = re(
        this.hitDetectionTransform_,
        n + 0.5,
        n + 0.5,
        1 / e,
        -1 / e,
        -i,
        -t[0],
        -t[1]
      ),
      h = !this.hitDetectionContext_;
    h &&
      (this.hitDetectionContext_ = lt(a, a, void 0, {
        willReadFrequently: !0,
      }));
    const c = this.hitDetectionContext_;
    c.canvas.width !== a || c.canvas.height !== a
      ? ((c.canvas.width = a), (c.canvas.height = a))
      : h || c.clearRect(0, 0, a, a);
    let u;
    this.renderBuffer_ !== void 0 &&
      ((u = Tt()), ti(u, t), ns(u, e * (this.renderBuffer_ + n), u));
    const d = sc(n);
    let f;
    function g(C, T) {
      const w = c.getImageData(0, 0, a, a).data;
      for (let S = 0, v = d.length; S < v; S++)
        if (w[d[S]] > 0) {
          if (!o || (f !== "Image" && f !== "Text") || o.includes(C)) {
            const M = (d[S] - 3) / 4,
              N = n - (M % a),
              k = n - ((M / a) | 0),
              P = r(C, T, N * N + k * k);
            if (P) return P;
          }
          c.clearRect(0, 0, a, a);
          break;
        }
    }
    const _ = Object.keys(this.executorsByZIndex_).map(Number);
    _.sort(ze);
    let m, p, y, x, E;
    for (m = _.length - 1; m >= 0; --m) {
      const C = _[m].toString();
      for (y = this.executorsByZIndex_[C], p = bn.length - 1; p >= 0; --p)
        if (
          ((f = bn[p]),
          (x = y[f]),
          x !== void 0 && ((E = x.executeHitDetection(c, l, i, g, u)), E))
        )
          return E;
    }
  }
  getClipCoords(t) {
    const e = this.maxExtent_;
    if (!e) return null;
    const i = e[0],
      n = e[1],
      r = e[2],
      o = e[3],
      a = [i, n, i, o, r, o, r, n];
    return _e(a, 0, 8, 2, t, a), a;
  }
  isEmpty() {
    return si(this.executorsByZIndex_);
  }
  execute(t, e, i, n, r, o, a) {
    const l = Object.keys(this.executorsByZIndex_).map(Number);
    l.sort(ze), this.maxExtent_ && (t.save(), this.clip(t, i)), (o = o || bn);
    let h, c, u, d, f, g;
    for (a && l.reverse(), h = 0, c = l.length; h < c; ++h) {
      const _ = l[h].toString();
      for (f = this.executorsByZIndex_[_], u = 0, d = o.length; u < d; ++u) {
        const m = o[u];
        (g = f[m]), g !== void 0 && g.execute(t, e, i, n, r, a);
      }
    }
    this.maxExtent_ && t.restore();
  }
}
const Pn = {};
function sc(s) {
  if (Pn[s] !== void 0) return Pn[s];
  const t = s * 2 + 1,
    e = s * s,
    i = new Array(e + 1);
  for (let r = 0; r <= s; ++r)
    for (let o = 0; o <= s; ++o) {
      const a = r * r + o * o;
      if (a > e) break;
      let l = i[a];
      l || ((l = []), (i[a] = l)),
        l.push(((s + r) * t + (s + o)) * 4 + 3),
        r > 0 && l.push(((s - r) * t + (s + o)) * 4 + 3),
        o > 0 &&
          (l.push(((s + r) * t + (s - o)) * 4 + 3),
          r > 0 && l.push(((s - r) * t + (s - o)) * 4 + 3));
    }
  const n = [];
  for (let r = 0, o = i.length; r < o; ++r) i[r] && n.push(...i[r]);
  return (Pn[s] = n), n;
}
const vr = nc;
class rc extends Po {
  constructor(t, e, i, n, r, o, a) {
    super(),
      (this.context_ = t),
      (this.pixelRatio_ = e),
      (this.extent_ = i),
      (this.transform_ = n),
      (this.transformRotation_ = n ? rs(Math.atan2(n[1], n[0]), 10) : 0),
      (this.viewRotation_ = r),
      (this.squaredTolerance_ = o),
      (this.userTransform_ = a),
      (this.contextFillState_ = null),
      (this.contextStrokeState_ = null),
      (this.contextTextState_ = null),
      (this.fillState_ = null),
      (this.strokeState_ = null),
      (this.image_ = null),
      (this.imageAnchorX_ = 0),
      (this.imageAnchorY_ = 0),
      (this.imageHeight_ = 0),
      (this.imageOpacity_ = 0),
      (this.imageOriginX_ = 0),
      (this.imageOriginY_ = 0),
      (this.imageRotateWithView_ = !1),
      (this.imageRotation_ = 0),
      (this.imageScale_ = [0, 0]),
      (this.imageWidth_ = 0),
      (this.text_ = ""),
      (this.textOffsetX_ = 0),
      (this.textOffsetY_ = 0),
      (this.textRotateWithView_ = !1),
      (this.textRotation_ = 0),
      (this.textScale_ = [0, 0]),
      (this.textFillState_ = null),
      (this.textStrokeState_ = null),
      (this.textState_ = null),
      (this.pixelCoordinates_ = []),
      (this.tmpLocalTransform_ = Mt());
  }
  drawImages_(t, e, i, n) {
    if (!this.image_) return;
    const r = _e(t, e, i, n, this.transform_, this.pixelCoordinates_),
      o = this.context_,
      a = this.tmpLocalTransform_,
      l = o.globalAlpha;
    this.imageOpacity_ != 1 && (o.globalAlpha = l * this.imageOpacity_);
    let h = this.imageRotation_;
    this.transformRotation_ === 0 && (h -= this.viewRotation_),
      this.imageRotateWithView_ && (h += this.viewRotation_);
    for (let c = 0, u = r.length; c < u; c += 2) {
      const d = r[c] - this.imageAnchorX_,
        f = r[c + 1] - this.imageAnchorY_;
      if (h !== 0 || this.imageScale_[0] != 1 || this.imageScale_[1] != 1) {
        const g = d + this.imageAnchorX_,
          _ = f + this.imageAnchorY_;
        re(a, g, _, 1, 1, h, -g, -_),
          o.setTransform.apply(o, a),
          o.translate(g, _),
          o.scale(this.imageScale_[0], this.imageScale_[1]),
          o.drawImage(
            this.image_,
            this.imageOriginX_,
            this.imageOriginY_,
            this.imageWidth_,
            this.imageHeight_,
            -this.imageAnchorX_,
            -this.imageAnchorY_,
            this.imageWidth_,
            this.imageHeight_
          ),
          o.setTransform(1, 0, 0, 1, 0, 0);
      } else
        o.drawImage(
          this.image_,
          this.imageOriginX_,
          this.imageOriginY_,
          this.imageWidth_,
          this.imageHeight_,
          d,
          f,
          this.imageWidth_,
          this.imageHeight_
        );
    }
    this.imageOpacity_ != 1 && (o.globalAlpha = l);
  }
  drawText_(t, e, i, n) {
    if (!this.textState_ || this.text_ === "") return;
    this.textFillState_ && this.setContextFillState_(this.textFillState_),
      this.textStrokeState_ &&
        this.setContextStrokeState_(this.textStrokeState_),
      this.setContextTextState_(this.textState_);
    const r = _e(t, e, i, n, this.transform_, this.pixelCoordinates_),
      o = this.context_;
    let a = this.textRotation_;
    for (
      this.transformRotation_ === 0 && (a -= this.viewRotation_),
        this.textRotateWithView_ && (a += this.viewRotation_);
      e < i;
      e += n
    ) {
      const l = r[e] + this.textOffsetX_,
        h = r[e + 1] + this.textOffsetY_;
      a !== 0 || this.textScale_[0] != 1 || this.textScale_[1] != 1
        ? (o.translate(l - this.textOffsetX_, h - this.textOffsetY_),
          o.rotate(a),
          o.translate(this.textOffsetX_, this.textOffsetY_),
          o.scale(this.textScale_[0], this.textScale_[1]),
          this.textStrokeState_ && o.strokeText(this.text_, 0, 0),
          this.textFillState_ && o.fillText(this.text_, 0, 0),
          o.setTransform(1, 0, 0, 1, 0, 0))
        : (this.textStrokeState_ && o.strokeText(this.text_, l, h),
          this.textFillState_ && o.fillText(this.text_, l, h));
    }
  }
  moveToLineTo_(t, e, i, n, r) {
    const o = this.context_,
      a = _e(t, e, i, n, this.transform_, this.pixelCoordinates_);
    o.moveTo(a[0], a[1]);
    let l = a.length;
    r && (l -= 2);
    for (let h = 2; h < l; h += 2) o.lineTo(a[h], a[h + 1]);
    return r && o.closePath(), i;
  }
  drawRings_(t, e, i, n) {
    for (let r = 0, o = i.length; r < o; ++r)
      e = this.moveToLineTo_(t, e, i[r], n, !0);
    return e;
  }
  drawCircle(t) {
    if (!!at(this.extent_, t.getExtent())) {
      if (this.fillState_ || this.strokeState_) {
        this.fillState_ && this.setContextFillState_(this.fillState_),
          this.strokeState_ && this.setContextStrokeState_(this.strokeState_);
        const e = cl(t, this.transform_, this.pixelCoordinates_),
          i = e[2] - e[0],
          n = e[3] - e[1],
          r = Math.sqrt(i * i + n * n),
          o = this.context_;
        o.beginPath(),
          o.arc(e[0], e[1], r, 0, 2 * Math.PI),
          this.fillState_ && o.fill(),
          this.strokeState_ && o.stroke();
      }
      this.text_ !== "" && this.drawText_(t.getCenter(), 0, 2, 2);
    }
  }
  setStyle(t) {
    this.setFillStrokeStyle(t.getFill(), t.getStroke()),
      this.setImageStyle(t.getImage()),
      this.setTextStyle(t.getText());
  }
  setTransform(t) {
    this.transform_ = t;
  }
  drawGeometry(t) {
    switch (t.getType()) {
      case "Point":
        this.drawPoint(t);
        break;
      case "LineString":
        this.drawLineString(t);
        break;
      case "Polygon":
        this.drawPolygon(t);
        break;
      case "MultiPoint":
        this.drawMultiPoint(t);
        break;
      case "MultiLineString":
        this.drawMultiLineString(t);
        break;
      case "MultiPolygon":
        this.drawMultiPolygon(t);
        break;
      case "GeometryCollection":
        this.drawGeometryCollection(t);
        break;
      case "Circle":
        this.drawCircle(t);
        break;
    }
  }
  drawFeature(t, e) {
    const i = e.getGeometryFunction()(t);
    !i ||
      !at(this.extent_, i.getExtent()) ||
      (this.setStyle(e), this.drawGeometry(i));
  }
  drawGeometryCollection(t) {
    const e = t.getGeometriesArray();
    for (let i = 0, n = e.length; i < n; ++i) this.drawGeometry(e[i]);
  }
  drawPoint(t) {
    this.squaredTolerance_ &&
      (t = t.simplifyTransformed(this.squaredTolerance_, this.userTransform_));
    const e = t.getFlatCoordinates(),
      i = t.getStride();
    this.image_ && this.drawImages_(e, 0, e.length, i),
      this.text_ !== "" && this.drawText_(e, 0, e.length, i);
  }
  drawMultiPoint(t) {
    this.squaredTolerance_ &&
      (t = t.simplifyTransformed(this.squaredTolerance_, this.userTransform_));
    const e = t.getFlatCoordinates(),
      i = t.getStride();
    this.image_ && this.drawImages_(e, 0, e.length, i),
      this.text_ !== "" && this.drawText_(e, 0, e.length, i);
  }
  drawLineString(t) {
    if (
      (this.squaredTolerance_ &&
        (t = t.simplifyTransformed(
          this.squaredTolerance_,
          this.userTransform_
        )),
      !!at(this.extent_, t.getExtent()))
    ) {
      if (this.strokeState_) {
        this.setContextStrokeState_(this.strokeState_);
        const e = this.context_,
          i = t.getFlatCoordinates();
        e.beginPath(),
          this.moveToLineTo_(i, 0, i.length, t.getStride(), !1),
          e.stroke();
      }
      if (this.text_ !== "") {
        const e = t.getFlatMidpoint();
        this.drawText_(e, 0, 2, 2);
      }
    }
  }
  drawMultiLineString(t) {
    this.squaredTolerance_ &&
      (t = t.simplifyTransformed(this.squaredTolerance_, this.userTransform_));
    const e = t.getExtent();
    if (!!at(this.extent_, e)) {
      if (this.strokeState_) {
        this.setContextStrokeState_(this.strokeState_);
        const i = this.context_,
          n = t.getFlatCoordinates();
        let r = 0;
        const o = t.getEnds(),
          a = t.getStride();
        i.beginPath();
        for (let l = 0, h = o.length; l < h; ++l)
          r = this.moveToLineTo_(n, r, o[l], a, !1);
        i.stroke();
      }
      if (this.text_ !== "") {
        const i = t.getFlatMidpoints();
        this.drawText_(i, 0, i.length, 2);
      }
    }
  }
  drawPolygon(t) {
    if (
      (this.squaredTolerance_ &&
        (t = t.simplifyTransformed(
          this.squaredTolerance_,
          this.userTransform_
        )),
      !!at(this.extent_, t.getExtent()))
    ) {
      if (this.strokeState_ || this.fillState_) {
        this.fillState_ && this.setContextFillState_(this.fillState_),
          this.strokeState_ && this.setContextStrokeState_(this.strokeState_);
        const e = this.context_;
        e.beginPath(),
          this.drawRings_(
            t.getOrientedFlatCoordinates(),
            0,
            t.getEnds(),
            t.getStride()
          ),
          this.fillState_ && e.fill(),
          this.strokeState_ && e.stroke();
      }
      if (this.text_ !== "") {
        const e = t.getFlatInteriorPoint();
        this.drawText_(e, 0, 2, 2);
      }
    }
  }
  drawMultiPolygon(t) {
    if (
      (this.squaredTolerance_ &&
        (t = t.simplifyTransformed(
          this.squaredTolerance_,
          this.userTransform_
        )),
      !!at(this.extent_, t.getExtent()))
    ) {
      if (this.strokeState_ || this.fillState_) {
        this.fillState_ && this.setContextFillState_(this.fillState_),
          this.strokeState_ && this.setContextStrokeState_(this.strokeState_);
        const e = this.context_,
          i = t.getOrientedFlatCoordinates();
        let n = 0;
        const r = t.getEndss(),
          o = t.getStride();
        e.beginPath();
        for (let a = 0, l = r.length; a < l; ++a) {
          const h = r[a];
          n = this.drawRings_(i, n, h, o);
        }
        this.fillState_ && e.fill(), this.strokeState_ && e.stroke();
      }
      if (this.text_ !== "") {
        const e = t.getFlatInteriorPoints();
        this.drawText_(e, 0, e.length, 2);
      }
    }
  }
  setContextFillState_(t) {
    const e = this.context_,
      i = this.contextFillState_;
    i
      ? i.fillStyle != t.fillStyle &&
        ((i.fillStyle = t.fillStyle), (e.fillStyle = t.fillStyle))
      : ((e.fillStyle = t.fillStyle),
        (this.contextFillState_ = { fillStyle: t.fillStyle }));
  }
  setContextStrokeState_(t) {
    const e = this.context_,
      i = this.contextStrokeState_;
    i
      ? (i.lineCap != t.lineCap &&
          ((i.lineCap = t.lineCap), (e.lineCap = t.lineCap)),
        oe(i.lineDash, t.lineDash) || e.setLineDash((i.lineDash = t.lineDash)),
        i.lineDashOffset != t.lineDashOffset &&
          ((i.lineDashOffset = t.lineDashOffset),
          (e.lineDashOffset = t.lineDashOffset)),
        i.lineJoin != t.lineJoin &&
          ((i.lineJoin = t.lineJoin), (e.lineJoin = t.lineJoin)),
        i.lineWidth != t.lineWidth &&
          ((i.lineWidth = t.lineWidth), (e.lineWidth = t.lineWidth)),
        i.miterLimit != t.miterLimit &&
          ((i.miterLimit = t.miterLimit), (e.miterLimit = t.miterLimit)),
        i.strokeStyle != t.strokeStyle &&
          ((i.strokeStyle = t.strokeStyle), (e.strokeStyle = t.strokeStyle)))
      : ((e.lineCap = t.lineCap),
        e.setLineDash(t.lineDash),
        (e.lineDashOffset = t.lineDashOffset),
        (e.lineJoin = t.lineJoin),
        (e.lineWidth = t.lineWidth),
        (e.miterLimit = t.miterLimit),
        (e.strokeStyle = t.strokeStyle),
        (this.contextStrokeState_ = {
          lineCap: t.lineCap,
          lineDash: t.lineDash,
          lineDashOffset: t.lineDashOffset,
          lineJoin: t.lineJoin,
          lineWidth: t.lineWidth,
          miterLimit: t.miterLimit,
          strokeStyle: t.strokeStyle,
        }));
  }
  setContextTextState_(t) {
    const e = this.context_,
      i = this.contextTextState_,
      n = t.textAlign ? t.textAlign : di;
    i
      ? (i.font != t.font && ((i.font = t.font), (e.font = t.font)),
        i.textAlign != n && ((i.textAlign = n), (e.textAlign = n)),
        i.textBaseline != t.textBaseline &&
          ((i.textBaseline = t.textBaseline),
          (e.textBaseline = t.textBaseline)))
      : ((e.font = t.font),
        (e.textAlign = n),
        (e.textBaseline = t.textBaseline),
        (this.contextTextState_ = {
          font: t.font,
          textAlign: n,
          textBaseline: t.textBaseline,
        }));
  }
  setFillStrokeStyle(t, e) {
    if (!t) this.fillState_ = null;
    else {
      const i = t.getColor();
      this.fillState_ = { fillStyle: Lt(i || zt) };
    }
    if (!e) this.strokeState_ = null;
    else {
      const i = e.getColor(),
        n = e.getLineCap(),
        r = e.getLineDash(),
        o = e.getLineDashOffset(),
        a = e.getLineJoin(),
        l = e.getWidth(),
        h = e.getMiterLimit(),
        c = r || li;
      this.strokeState_ = {
        lineCap: n !== void 0 ? n : $i,
        lineDash:
          this.pixelRatio_ === 1 ? c : c.map((u) => u * this.pixelRatio_),
        lineDashOffset: (o || hi) * this.pixelRatio_,
        lineJoin: a !== void 0 ? a : Ze,
        lineWidth: (l !== void 0 ? l : fi) * this.pixelRatio_,
        miterLimit: h !== void 0 ? h : ci,
        strokeStyle: Lt(i || ui),
      };
    }
  }
  setImageStyle(t) {
    let e;
    if (!t || !(e = t.getSize())) {
      this.image_ = null;
      return;
    }
    const i = t.getPixelRatio(this.pixelRatio_),
      n = t.getAnchor(),
      r = t.getOrigin();
    (this.image_ = t.getImage(this.pixelRatio_)),
      (this.imageAnchorX_ = n[0] * i),
      (this.imageAnchorY_ = n[1] * i),
      (this.imageHeight_ = e[1] * i),
      (this.imageOpacity_ = t.getOpacity()),
      (this.imageOriginX_ = r[0]),
      (this.imageOriginY_ = r[1]),
      (this.imageRotateWithView_ = t.getRotateWithView()),
      (this.imageRotation_ = t.getRotation());
    const o = t.getScaleArray();
    (this.imageScale_ = [
      (o[0] * this.pixelRatio_) / i,
      (o[1] * this.pixelRatio_) / i,
    ]),
      (this.imageWidth_ = e[0] * i);
  }
  setTextStyle(t) {
    if (!t) this.text_ = "";
    else {
      const e = t.getFill();
      if (!e) this.textFillState_ = null;
      else {
        const f = e.getColor();
        this.textFillState_ = { fillStyle: Lt(f || zt) };
      }
      const i = t.getStroke();
      if (!i) this.textStrokeState_ = null;
      else {
        const f = i.getColor(),
          g = i.getLineCap(),
          _ = i.getLineDash(),
          m = i.getLineDashOffset(),
          p = i.getLineJoin(),
          y = i.getWidth(),
          x = i.getMiterLimit();
        this.textStrokeState_ = {
          lineCap: g !== void 0 ? g : $i,
          lineDash: _ || li,
          lineDashOffset: m || hi,
          lineJoin: p !== void 0 ? p : Ze,
          lineWidth: y !== void 0 ? y : fi,
          miterLimit: x !== void 0 ? x : ci,
          strokeStyle: Lt(f || ui),
        };
      }
      const n = t.getFont(),
        r = t.getOffsetX(),
        o = t.getOffsetY(),
        a = t.getRotateWithView(),
        l = t.getRotation(),
        h = t.getScaleArray(),
        c = t.getText(),
        u = t.getTextAlign(),
        d = t.getTextBaseline();
      (this.textState_ = {
        font: n !== void 0 ? n : vo,
        textAlign: u !== void 0 ? u : di,
        textBaseline: d !== void 0 ? d : qi,
      }),
        (this.text_ =
          c !== void 0
            ? Array.isArray(c)
              ? c.reduce((f, g, _) => (f += _ % 2 ? " " : g), "")
              : c
            : ""),
        (this.textOffsetX_ = r !== void 0 ? this.pixelRatio_ * r : 0),
        (this.textOffsetY_ = o !== void 0 ? this.pixelRatio_ * o : 0),
        (this.textRotateWithView_ = a !== void 0 ? a : !1),
        (this.textRotation_ = l !== void 0 ? l : 0),
        (this.textScale_ = [this.pixelRatio_ * h[0], this.pixelRatio_ * h[1]]);
    }
  }
}
const oc = rc,
  vt = 0.5;
function ac(s, t, e, i, n, r, o) {
  const a = s[0] * vt,
    l = s[1] * vt,
    h = lt(a, l);
  h.imageSmoothingEnabled = !1;
  const c = h.canvas,
    u = new oc(h, vt, n, null, o),
    d = e.length,
    f = Math.floor((256 * 256 * 256 - 1) / d),
    g = {};
  for (let m = 1; m <= d; ++m) {
    const p = e[m - 1],
      y = p.getStyleFunction() || i;
    if (!i) continue;
    let x = y(p, r);
    if (!x) continue;
    Array.isArray(x) || (x = [x]);
    const C = (m * f).toString(16).padStart(7, "#00000");
    for (let T = 0, w = x.length; T < w; ++T) {
      const S = x[T],
        v = S.getGeometryFunction()(p);
      if (!v || !at(n, v.getExtent())) continue;
      const M = S.clone(),
        N = M.getFill();
      N && N.setColor(C);
      const k = M.getStroke();
      k && (k.setColor(C), k.setLineDash(null)), M.setText(void 0);
      const P = S.getImage();
      if (P && P.getOpacity() !== 0) {
        const I = P.getImageSize();
        if (!I) continue;
        const D = lt(I[0], I[1], void 0, { alpha: !1 }),
          K = D.canvas;
        (D.fillStyle = C),
          D.fillRect(0, 0, K.width, K.height),
          M.setImage(
            new Oo({
              img: K,
              imgSize: I,
              anchor: P.getAnchor(),
              anchorXUnits: "pixels",
              anchorYUnits: "pixels",
              offset: P.getOrigin(),
              opacity: 1,
              size: P.getSize(),
              scale: P.getScale(),
              rotation: P.getRotation(),
              rotateWithView: P.getRotateWithView(),
            })
          );
      }
      const q = M.getZIndex() || 0;
      let L = g[q];
      L ||
        ((L = {}),
        (g[q] = L),
        (L.Polygon = []),
        (L.Circle = []),
        (L.LineString = []),
        (L.Point = []));
      const b = v.getType();
      if (b === "GeometryCollection") {
        const I = v.getGeometriesArrayRecursive();
        for (let D = 0, K = I.length; D < K; ++D) {
          const B = I[D];
          L[B.getType().replace("Multi", "")].push(B, M);
        }
      } else L[b.replace("Multi", "")].push(v, M);
    }
  }
  const _ = Object.keys(g).map(Number).sort(ze);
  for (let m = 0, p = _.length; m < p; ++m) {
    const y = g[_[m]];
    for (const x in y) {
      const E = y[x];
      for (let C = 0, T = E.length; C < T; C += 2) {
        u.setStyle(E[C + 1]);
        for (let w = 0, S = t.length; w < S; ++w)
          u.setTransform(t[w]), u.drawGeometry(E[C]);
      }
    }
  }
  return h.getImageData(0, 0, c.width, c.height);
}
function lc(s, t, e) {
  const i = [];
  if (e) {
    const n = Math.floor(Math.round(s[0]) * vt),
      r = Math.floor(Math.round(s[1]) * vt),
      o = (J(n, 0, e.width - 1) + J(r, 0, e.height - 1) * e.width) * 4,
      a = e.data[o],
      l = e.data[o + 1],
      c = e.data[o + 2] + 256 * (l + 256 * a),
      u = Math.floor((256 * 256 * 256 - 1) / t.length);
    c && c % u === 0 && i.push(t[c / u - 1]);
  }
  return i;
}
const hc = 0.5,
  Do = {
    Point: yc,
    LineString: _c,
    Polygon: Ec,
    MultiPoint: xc,
    MultiLineString: mc,
    MultiPolygon: pc,
    GeometryCollection: gc,
    Circle: dc,
  };
function cc(s, t) {
  return parseInt(z(s), 10) - parseInt(z(t), 10);
}
function uc(s, t) {
  const e = Hn(s, t);
  return e * e;
}
function Hn(s, t) {
  return (hc * s) / t;
}
function dc(s, t, e, i, n) {
  const r = e.getFill(),
    o = e.getStroke();
  if (r || o) {
    const l = s.getBuilder(e.getZIndex(), "Circle");
    l.setFillStrokeStyle(r, o), l.drawCircle(t, i);
  }
  const a = e.getText();
  if (a && a.getText()) {
    const l = (n || s).getBuilder(e.getZIndex(), "Text");
    l.setTextStyle(a), l.drawText(t, i);
  }
}
function Lr(s, t, e, i, n, r, o) {
  let a = !1;
  const l = e.getImage();
  if (l) {
    const h = l.getImageState();
    h == Q.LOADED || h == Q.ERROR
      ? l.unlistenImageChange(n)
      : (h == Q.IDLE && l.load(), l.listenImageChange(n), (a = !0));
  }
  return fc(s, t, e, i, r, o), a;
}
function fc(s, t, e, i, n, r) {
  const o = e.getGeometryFunction()(t);
  if (!o) return;
  const a = o.simplifyTransformed(i, n);
  if (e.getRenderer()) Fo(s, a, e, t);
  else {
    const h = Do[a.getType()];
    h(s, a, e, t, r);
  }
}
function Fo(s, t, e, i) {
  if (t.getType() == "GeometryCollection") {
    const r = t.getGeometries();
    for (let o = 0, a = r.length; o < a; ++o) Fo(s, r[o], e, i);
    return;
  }
  s.getBuilder(e.getZIndex(), "Default").drawCustom(
    t,
    i,
    e.getRenderer(),
    e.getHitDetectionRenderer()
  );
}
function gc(s, t, e, i, n) {
  const r = t.getGeometriesArray();
  let o, a;
  for (o = 0, a = r.length; o < a; ++o) {
    const l = Do[r[o].getType()];
    l(s, r[o], e, i, n);
  }
}
function _c(s, t, e, i, n) {
  const r = e.getStroke();
  if (r) {
    const a = s.getBuilder(e.getZIndex(), "LineString");
    a.setFillStrokeStyle(null, r), a.drawLineString(t, i);
  }
  const o = e.getText();
  if (o && o.getText()) {
    const a = (n || s).getBuilder(e.getZIndex(), "Text");
    a.setTextStyle(o), a.drawText(t, i);
  }
}
function mc(s, t, e, i, n) {
  const r = e.getStroke();
  if (r) {
    const a = s.getBuilder(e.getZIndex(), "LineString");
    a.setFillStrokeStyle(null, r), a.drawMultiLineString(t, i);
  }
  const o = e.getText();
  if (o && o.getText()) {
    const a = (n || s).getBuilder(e.getZIndex(), "Text");
    a.setTextStyle(o), a.drawText(t, i);
  }
}
function pc(s, t, e, i, n) {
  const r = e.getFill(),
    o = e.getStroke();
  if (o || r) {
    const l = s.getBuilder(e.getZIndex(), "Polygon");
    l.setFillStrokeStyle(r, o), l.drawMultiPolygon(t, i);
  }
  const a = e.getText();
  if (a && a.getText()) {
    const l = (n || s).getBuilder(e.getZIndex(), "Text");
    l.setTextStyle(a), l.drawText(t, i);
  }
}
function yc(s, t, e, i, n) {
  const r = e.getImage(),
    o = e.getText();
  let a;
  if (r) {
    if (r.getImageState() != Q.LOADED) return;
    let l = s;
    if (n) {
      const c = r.getDeclutterMode();
      if (c !== "none")
        if (((l = n), c === "obstacle")) {
          const u = s.getBuilder(e.getZIndex(), "Image");
          u.setImageStyle(r, a), u.drawPoint(t, i);
        } else o && o.getText() && (a = {});
    }
    const h = l.getBuilder(e.getZIndex(), "Image");
    h.setImageStyle(r, a), h.drawPoint(t, i);
  }
  if (o && o.getText()) {
    let l = s;
    n && (l = n);
    const h = l.getBuilder(e.getZIndex(), "Text");
    h.setTextStyle(o, a), h.drawText(t, i);
  }
}
function xc(s, t, e, i, n) {
  const r = e.getImage(),
    o = e.getText();
  let a;
  if (r) {
    if (r.getImageState() != Q.LOADED) return;
    let l = s;
    if (n) {
      const c = r.getDeclutterMode();
      if (c !== "none")
        if (((l = n), c === "obstacle")) {
          const u = s.getBuilder(e.getZIndex(), "Image");
          u.setImageStyle(r, a), u.drawMultiPoint(t, i);
        } else o && o.getText() && (a = {});
    }
    const h = l.getBuilder(e.getZIndex(), "Image");
    h.setImageStyle(r, a), h.drawMultiPoint(t, i);
  }
  if (o && o.getText()) {
    let l = s;
    n && (l = n);
    const h = l.getBuilder(e.getZIndex(), "Text");
    h.setTextStyle(o, a), h.drawText(t, i);
  }
}
function Ec(s, t, e, i, n) {
  const r = e.getFill(),
    o = e.getStroke();
  if (r || o) {
    const l = s.getBuilder(e.getZIndex(), "Polygon");
    l.setFillStrokeStyle(r, o), l.drawPolygon(t, i);
  }
  const a = e.getText();
  if (a && a.getText()) {
    const l = (n || s).getBuilder(e.getZIndex(), "Text");
    l.setTextStyle(a), l.drawText(t, i);
  }
}
class Cc extends po {
  constructor(t) {
    super(t),
      (this.boundHandleStyleImageChange_ =
        this.handleStyleImageChange_.bind(this)),
      this.animatingOrInteracting_,
      (this.hitDetectionImageData_ = null),
      (this.renderedFeatures_ = null),
      (this.renderedRevision_ = -1),
      (this.renderedResolution_ = NaN),
      (this.renderedExtent_ = Tt()),
      (this.wrappedRenderedExtent_ = Tt()),
      this.renderedRotation_,
      (this.renderedCenter_ = null),
      (this.renderedProjection_ = null),
      (this.renderedRenderOrder_ = null),
      (this.replayGroup_ = null),
      (this.replayGroupChanged = !0),
      (this.declutterExecutorGroup = null),
      (this.clipping = !0),
      (this.compositionContext_ = null),
      (this.opacity_ = 1);
  }
  renderWorlds(t, e, i) {
    const n = e.extent,
      r = e.viewState,
      o = r.center,
      a = r.resolution,
      l = r.projection,
      h = r.rotation,
      c = l.getExtent(),
      u = this.getLayer().getSource(),
      d = e.pixelRatio,
      f = e.viewHints,
      g = !(f[rt.ANIMATING] || f[rt.INTERACTING]),
      _ = this.compositionContext_,
      m = Math.round(e.size[0] * d),
      p = Math.round(e.size[1] * d),
      y = u.getWrapX() && l.canWrapX(),
      x = y ? U(c) : null,
      E = y ? Math.ceil((n[2] - c[2]) / x) + 1 : 1;
    let C = y ? Math.floor((n[0] - c[0]) / x) : 0;
    do {
      const T = this.getRenderTransform(o, a, h, d, m, p, C * x);
      t.execute(_, 1, T, h, g, void 0, i);
    } while (++C < E);
  }
  setupCompositionContext_() {
    if (this.opacity_ !== 1) {
      const t = lt(this.context.canvas.width, this.context.canvas.height, hr);
      this.compositionContext_ = t;
    } else this.compositionContext_ = this.context;
  }
  releaseCompositionContext_() {
    if (this.opacity_ !== 1) {
      const t = this.context.globalAlpha;
      (this.context.globalAlpha = this.opacity_),
        this.context.drawImage(this.compositionContext_.canvas, 0, 0),
        (this.context.globalAlpha = t),
        dn(this.compositionContext_),
        hr.push(this.compositionContext_.canvas),
        (this.compositionContext_ = null);
    }
  }
  renderDeclutter(t) {
    this.declutterExecutorGroup &&
      (this.setupCompositionContext_(),
      this.renderWorlds(this.declutterExecutorGroup, t, t.declutterTree),
      this.releaseCompositionContext_());
  }
  renderFrame(t, e) {
    const i = t.pixelRatio,
      n = t.layerStatesArray[t.layerIndex];
    va(this.pixelTransform, 1 / i, 1 / i),
      is(this.inversePixelTransform, this.pixelTransform);
    const r = Wr(this.pixelTransform);
    this.useContainer(e, r, this.getBackground(t));
    const o = this.context,
      a = o.canvas,
      l = this.replayGroup_,
      h = this.declutterExecutorGroup;
    if ((!l || l.isEmpty()) && (!h || h.isEmpty())) return null;
    const c = Math.round(t.size[0] * i),
      u = Math.round(t.size[1] * i);
    a.width != c || a.height != u
      ? ((a.width = c),
        (a.height = u),
        a.style.transform !== r && (a.style.transform = r))
      : this.containerReused || o.clearRect(0, 0, c, u),
      this.preRender(o, t);
    const d = t.viewState;
    d.projection, (this.opacity_ = n.opacity), this.setupCompositionContext_();
    let f = !1,
      g = !0;
    if (n.extent && this.clipping) {
      const _ = ue(n.extent);
      (g = at(_, t.extent)),
        (f = g && !Pe(_, t.extent)),
        f && this.clipUnrotated(this.compositionContext_, t, _);
    }
    return (
      g && this.renderWorlds(l, t),
      f && this.compositionContext_.restore(),
      this.releaseCompositionContext_(),
      this.postRender(o, t),
      this.renderedRotation_ !== d.rotation &&
        ((this.renderedRotation_ = d.rotation),
        (this.hitDetectionImageData_ = null)),
      this.container
    );
  }
  getFeatures(t) {
    return new Promise((e) => {
      if (!this.hitDetectionImageData_ && !this.animatingOrInteracting_) {
        const i = [this.context.canvas.width, this.context.canvas.height];
        it(this.pixelTransform, i);
        const n = this.renderedCenter_,
          r = this.renderedResolution_,
          o = this.renderedRotation_,
          a = this.renderedProjection_,
          l = this.wrappedRenderedExtent_,
          h = this.getLayer(),
          c = [],
          u = i[0] * vt,
          d = i[1] * vt;
        c.push(this.getRenderTransform(n, r, o, vt, u, d, 0).slice());
        const f = h.getSource(),
          g = a.getExtent();
        if (f.getWrapX() && a.canWrapX() && !Pe(g, l)) {
          let _ = l[0];
          const m = U(g);
          let p = 0,
            y;
          for (; _ < g[0]; )
            --p,
              (y = m * p),
              c.push(this.getRenderTransform(n, r, o, vt, u, d, y).slice()),
              (_ += m);
          for (p = 0, _ = l[2]; _ > g[2]; )
            ++p,
              (y = m * p),
              c.push(this.getRenderTransform(n, r, o, vt, u, d, y).slice()),
              (_ -= m);
        }
        this.hitDetectionImageData_ = ac(
          i,
          c,
          this.renderedFeatures_,
          h.getStyleFunction(),
          l,
          r,
          o
        );
      }
      e(lc(t, this.renderedFeatures_, this.hitDetectionImageData_));
    });
  }
  forEachFeatureAtCoordinate(t, e, i, n, r) {
    if (!this.replayGroup_) return;
    const o = e.viewState.resolution,
      a = e.viewState.rotation,
      l = this.getLayer(),
      h = {},
      c = function (f, g, _) {
        const m = z(f),
          p = h[m];
        if (p) {
          if (p !== !0 && _ < p.distanceSq) {
            if (_ === 0)
              return (h[m] = !0), r.splice(r.lastIndexOf(p), 1), n(f, l, g);
            (p.geometry = g), (p.distanceSq = _);
          }
        } else {
          if (_ === 0) return (h[m] = !0), n(f, l, g);
          r.push(
            (h[m] = {
              feature: f,
              layer: l,
              geometry: g,
              distanceSq: _,
              callback: n,
            })
          );
        }
      };
    let u;
    const d = [this.replayGroup_];
    return (
      this.declutterExecutorGroup && d.push(this.declutterExecutorGroup),
      d.some(
        (f) =>
          (u = f.forEachFeatureAtCoordinate(
            t,
            o,
            a,
            i,
            c,
            f === this.declutterExecutorGroup && e.declutterTree
              ? e.declutterTree.all().map((g) => g.value)
              : null
          ))
      ),
      u
    );
  }
  handleFontsChanged() {
    const t = this.getLayer();
    t.getVisible() && this.replayGroup_ && t.changed();
  }
  handleStyleImageChange_(t) {
    this.renderIfReadyAndVisible();
  }
  prepareFrame(t) {
    const e = this.getLayer(),
      i = e.getSource();
    if (!i) return !1;
    const n = t.viewHints[rt.ANIMATING],
      r = t.viewHints[rt.INTERACTING],
      o = e.getUpdateWhileAnimating(),
      a = e.getUpdateWhileInteracting();
    if ((this.ready && !o && n) || (!a && r))
      return (this.animatingOrInteracting_ = !0), !0;
    this.animatingOrInteracting_ = !1;
    const l = t.extent,
      h = t.viewState,
      c = h.projection,
      u = h.resolution,
      d = t.pixelRatio,
      f = e.getRevision(),
      g = e.getRenderBuffer();
    let _ = e.getRenderOrder();
    _ === void 0 && (_ = cc);
    const m = h.center.slice(),
      p = ns(l, g * u),
      y = p.slice(),
      x = [p.slice()],
      E = c.getExtent();
    if (i.getWrapX() && c.canWrapX() && !Pe(E, t.extent)) {
      const L = U(E),
        b = Math.max(U(p) / 2, L);
      (p[0] = E[0] - b), (p[2] = E[2] + b), jr(m, c);
      const I = Vr(x[0], c);
      I[0] < E[0] && I[2] < E[2]
        ? x.push([I[0] + L, I[1], I[2] + L, I[3]])
        : I[0] > E[0] &&
          I[2] > E[2] &&
          x.push([I[0] - L, I[1], I[2] - L, I[3]]);
    }
    if (
      this.ready &&
      this.renderedResolution_ == u &&
      this.renderedRevision_ == f &&
      this.renderedRenderOrder_ == _ &&
      Pe(this.wrappedRenderedExtent_, p)
    )
      return (
        oe(this.renderedExtent_, y) ||
          ((this.hitDetectionImageData_ = null), (this.renderedExtent_ = y)),
        (this.renderedCenter_ = m),
        (this.replayGroupChanged = !1),
        !0
      );
    this.replayGroup_ = null;
    const C = new Ir(Hn(u, d), p, u, d);
    let T;
    this.getLayer().getDeclutter() && (T = new Ir(Hn(u, d), p, u, d));
    let w;
    for (let L = 0, b = x.length; L < b; ++L) i.loadFeatures(x[L], u, c);
    const S = uc(u, d);
    let v = !0;
    const M = (L) => {
        let b;
        const I = L.getStyleFunction() || e.getStyleFunction();
        if ((I && (b = I(L, u)), b)) {
          const D = this.renderFeature(L, S, b, C, w, T);
          v = v && !D;
        }
      },
      N = to(p),
      k = i.getFeaturesInExtent(N);
    _ && k.sort(_);
    for (let L = 0, b = k.length; L < b; ++L) M(k[L]);
    (this.renderedFeatures_ = k), (this.ready = v);
    const P = C.finish(),
      q = new vr(p, u, d, i.getOverlaps(), P, e.getRenderBuffer());
    return (
      T &&
        (this.declutterExecutorGroup = new vr(
          p,
          u,
          d,
          i.getOverlaps(),
          T.finish(),
          e.getRenderBuffer()
        )),
      (this.renderedResolution_ = u),
      (this.renderedRevision_ = f),
      (this.renderedRenderOrder_ = _),
      (this.renderedExtent_ = y),
      (this.wrappedRenderedExtent_ = p),
      (this.renderedCenter_ = m),
      (this.renderedProjection_ = c),
      (this.replayGroup_ = q),
      (this.hitDetectionImageData_ = null),
      (this.replayGroupChanged = !0),
      !0
    );
  }
  renderFeature(t, e, i, n, r, o) {
    if (!i) return !1;
    let a = !1;
    if (Array.isArray(i))
      for (let l = 0, h = i.length; l < h; ++l)
        a = Lr(n, t, i[l], e, this.boundHandleStyleImageChange_, r, o) || a;
    else a = Lr(n, t, i, e, this.boundHandleStyleImageChange_, r, o);
    return a;
  }
}
const Rc = Cc;
class Tc extends Xh {
  constructor(t) {
    super(t);
  }
  createRenderer() {
    return new Rc(this);
  }
}
const Ic = Tc,
  ut = { ADD: "add", REMOVE: "remove" },
  Ar = { LENGTH: "length" };
class Wi extends Bt {
  constructor(t, e, i) {
    super(t), (this.element = e), (this.index = i);
  }
}
class Sc extends bt {
  constructor(t, e) {
    if (
      (super(),
      this.on,
      this.once,
      this.un,
      (e = e || {}),
      (this.unique_ = !!e.unique),
      (this.array_ = t || []),
      this.unique_)
    )
      for (let i = 0, n = this.array_.length; i < n; ++i)
        this.assertUnique_(this.array_[i], i);
    this.updateLength_();
  }
  clear() {
    for (; this.getLength() > 0; ) this.pop();
  }
  extend(t) {
    for (let e = 0, i = t.length; e < i; ++e) this.push(t[e]);
    return this;
  }
  forEach(t) {
    const e = this.array_;
    for (let i = 0, n = e.length; i < n; ++i) t(e[i], i, e);
  }
  getArray() {
    return this.array_;
  }
  item(t) {
    return this.array_[t];
  }
  getLength() {
    return this.get(Ar.LENGTH);
  }
  insertAt(t, e) {
    if (t < 0 || t > this.getLength())
      throw new Error("Index out of bounds: " + t);
    this.unique_ && this.assertUnique_(e),
      this.array_.splice(t, 0, e),
      this.updateLength_(),
      this.dispatchEvent(new Wi(ut.ADD, e, t));
  }
  pop() {
    return this.removeAt(this.getLength() - 1);
  }
  push(t) {
    this.unique_ && this.assertUnique_(t);
    const e = this.getLength();
    return this.insertAt(e, t), this.getLength();
  }
  remove(t) {
    const e = this.array_;
    for (let i = 0, n = e.length; i < n; ++i)
      if (e[i] === t) return this.removeAt(i);
  }
  removeAt(t) {
    if (t < 0 || t >= this.getLength()) return;
    const e = this.array_[t];
    return (
      this.array_.splice(t, 1),
      this.updateLength_(),
      this.dispatchEvent(new Wi(ut.REMOVE, e, t)),
      e
    );
  }
  setAt(t, e) {
    const i = this.getLength();
    if (t >= i) {
      this.insertAt(t, e);
      return;
    }
    if (t < 0) throw new Error("Index out of bounds: " + t);
    this.unique_ && this.assertUnique_(e, t);
    const n = this.array_[t];
    (this.array_[t] = e),
      this.dispatchEvent(new Wi(ut.REMOVE, n, t)),
      this.dispatchEvent(new Wi(ut.ADD, e, t));
  }
  updateLength_() {
    this.set(Ar.LENGTH, this.array_.length);
  }
  assertUnique_(t, e) {
    for (let i = 0, n = this.array_.length; i < n; ++i)
      if (this.array_[i] === t && i !== e) throw new Nr(58);
  }
}
const At = Sc;
class wc extends Jn {
  constructor(t) {
    super(), (this.map_ = t);
  }
  dispatchRenderEvent(t, e) {
    X();
  }
  calculateMatrices2D(t) {
    const e = t.viewState,
      i = t.coordinateToPixelTransform,
      n = t.pixelToCoordinateTransform;
    re(
      i,
      t.size[0] / 2,
      t.size[1] / 2,
      1 / e.resolution,
      -1 / e.resolution,
      -e.rotation,
      -e.center[0],
      -e.center[1]
    ),
      is(n, i);
  }
  forEachFeatureAtCoordinate(t, e, i, n, r, o, a, l) {
    let h;
    const c = e.viewState;
    function u(E, C, T, w) {
      return r.call(o, C, E ? T : null, w);
    }
    const d = c.projection,
      f = jr(t.slice(), d),
      g = [[0, 0]];
    if (d.canWrapX() && n) {
      const E = d.getExtent(),
        C = U(E);
      g.push([-C, 0], [C, 0]);
    }
    const _ = e.layerStatesArray,
      m = _.length,
      p = [],
      y = [];
    for (let E = 0; E < g.length; E++)
      for (let C = m - 1; C >= 0; --C) {
        const T = _[C],
          w = T.layer;
        if (w.hasRenderer() && ms(T, c) && a.call(l, w)) {
          const S = w.getRenderer(),
            v = w.getSource();
          if (S && v) {
            const M = v.getWrapX() ? f : t,
              N = u.bind(null, T.managed);
            (y[0] = M[0] + g[E][0]),
              (y[1] = M[1] + g[E][1]),
              (h = S.forEachFeatureAtCoordinate(y, e, i, N, p));
          }
          if (h) return h;
        }
      }
    if (p.length === 0) return;
    const x = 1 / p.length;
    return (
      p.forEach((E, C) => (E.distanceSq += C * x)),
      p.sort((E, C) => E.distanceSq - C.distanceSq),
      p.some((E) => (h = E.callback(E.feature, E.layer, E.geometry))),
      h
    );
  }
  hasFeatureAtCoordinate(t, e, i, n, r, o) {
    return (
      this.forEachFeatureAtCoordinate(t, e, i, n, ni, this, r, o) !== void 0
    );
  }
  getMap() {
    return this.map_;
  }
  renderFrame(t) {
    X();
  }
  scheduleExpireIconCache(t) {
    tn.canExpireCache() && t.postRenderFunctions.push(vc);
  }
}
function vc(s, t) {
  tn.expire();
}
const Lc = wc;
class Ac extends Lc {
  constructor(t) {
    super(t),
      (this.fontChangeListenerKey_ = W(
        Wt,
        We.PROPERTYCHANGE,
        t.redrawText.bind(t)
      )),
      (this.element_ = document.createElement("div"));
    const e = this.element_.style;
    (e.position = "absolute"),
      (e.width = "100%"),
      (e.height = "100%"),
      (e.zIndex = "0"),
      (this.element_.className = fn + " ol-layers");
    const i = t.getViewport();
    i.insertBefore(this.element_, i.firstChild || null),
      (this.children_ = []),
      (this.renderedVisible_ = !0);
  }
  dispatchRenderEvent(t, e) {
    const i = this.getMap();
    if (i.hasListener(t)) {
      const n = new go(t, void 0, e);
      i.dispatchEvent(n);
    }
  }
  disposeInternal() {
    j(this.fontChangeListenerKey_),
      this.element_.parentNode.removeChild(this.element_),
      super.disposeInternal();
  }
  renderFrame(t) {
    if (!t) {
      this.renderedVisible_ &&
        ((this.element_.style.display = "none"), (this.renderedVisible_ = !1));
      return;
    }
    this.calculateMatrices2D(t), this.dispatchRenderEvent(ne.PRECOMPOSE, t);
    const e = t.layerStatesArray.sort(function (o, a) {
        return o.zIndex - a.zIndex;
      }),
      i = t.viewState;
    this.children_.length = 0;
    const n = [];
    let r = null;
    for (let o = 0, a = e.length; o < a; ++o) {
      const l = e[o];
      t.layerIndex = o;
      const h = l.layer,
        c = h.getSourceState();
      if (!ms(l, i) || (c != "ready" && c != "undefined")) {
        h.unrender();
        continue;
      }
      const u = h.render(t, r);
      !u ||
        (u !== r && (this.children_.push(u), (r = u)),
        "getDeclutter" in h && n.push(h));
    }
    for (let o = n.length - 1; o >= 0; --o) n[o].renderDeclutter(t);
    Jl(this.element_, this.children_),
      this.dispatchRenderEvent(ne.POSTCOMPOSE, t),
      this.renderedVisible_ ||
        ((this.element_.style.display = ""), (this.renderedVisible_ = !0)),
      this.scheduleExpireIconCache(t);
  }
}
const Mc = Ac;
class ee extends Bt {
  constructor(t, e) {
    super(t), (this.layer = e);
  }
}
const Dn = { LAYERS: "layers" };
class ws extends uo {
  constructor(t) {
    t = t || {};
    const e = Object.assign({}, t);
    delete e.layers;
    let i = t.layers;
    super(e),
      this.on,
      this.once,
      this.un,
      (this.layersListenerKeys_ = []),
      (this.listenerKeys_ = {}),
      this.addChangeListener(Dn.LAYERS, this.handleLayersChanged_),
      i
        ? Array.isArray(i)
          ? (i = new At(i.slice(), { unique: !0 }))
          : G(typeof i.getArray == "function", 43)
        : (i = new At(void 0, { unique: !0 })),
      this.setLayers(i);
  }
  handleLayerChange_() {
    this.changed();
  }
  handleLayersChanged_() {
    this.layersListenerKeys_.forEach(j), (this.layersListenerKeys_.length = 0);
    const t = this.getLayers();
    this.layersListenerKeys_.push(
      W(t, ut.ADD, this.handleLayersAdd_, this),
      W(t, ut.REMOVE, this.handleLayersRemove_, this)
    );
    for (const i in this.listenerKeys_) this.listenerKeys_[i].forEach(j);
    pi(this.listenerKeys_);
    const e = t.getArray();
    for (let i = 0, n = e.length; i < n; i++) {
      const r = e[i];
      this.registerLayerListeners_(r),
        this.dispatchEvent(new ee("addlayer", r));
    }
    this.changed();
  }
  registerLayerListeners_(t) {
    const e = [
      W(t, We.PROPERTYCHANGE, this.handleLayerChange_, this),
      W(t, F.CHANGE, this.handleLayerChange_, this),
    ];
    t instanceof ws &&
      e.push(
        W(t, "addlayer", this.handleLayerGroupAdd_, this),
        W(t, "removelayer", this.handleLayerGroupRemove_, this)
      ),
      (this.listenerKeys_[z(t)] = e);
  }
  handleLayerGroupAdd_(t) {
    this.dispatchEvent(new ee("addlayer", t.layer));
  }
  handleLayerGroupRemove_(t) {
    this.dispatchEvent(new ee("removelayer", t.layer));
  }
  handleLayersAdd_(t) {
    const e = t.element;
    this.registerLayerListeners_(e),
      this.dispatchEvent(new ee("addlayer", e)),
      this.changed();
  }
  handleLayersRemove_(t) {
    const e = t.element,
      i = z(e);
    this.listenerKeys_[i].forEach(j),
      delete this.listenerKeys_[i],
      this.dispatchEvent(new ee("removelayer", e)),
      this.changed();
  }
  getLayers() {
    return this.get(Dn.LAYERS);
  }
  setLayers(t) {
    const e = this.getLayers();
    if (e) {
      const i = e.getArray();
      for (let n = 0, r = i.length; n < r; ++n)
        this.dispatchEvent(new ee("removelayer", i[n]));
    }
    this.set(Dn.LAYERS, t);
  }
  getLayersArray(t) {
    return (
      (t = t !== void 0 ? t : []),
      this.getLayers().forEach(function (e) {
        e.getLayersArray(t);
      }),
      t
    );
  }
  getLayerStatesArray(t) {
    const e = t !== void 0 ? t : [],
      i = e.length;
    this.getLayers().forEach(function (o) {
      o.getLayerStatesArray(e);
    });
    const n = this.getLayerState();
    let r = n.zIndex;
    !t && n.zIndex === void 0 && (r = 0);
    for (let o = i, a = e.length; o < a; o++) {
      const l = e[o];
      (l.opacity *= n.opacity),
        (l.visible = l.visible && n.visible),
        (l.maxResolution = Math.min(l.maxResolution, n.maxResolution)),
        (l.minResolution = Math.max(l.minResolution, n.minResolution)),
        (l.minZoom = Math.max(l.minZoom, n.minZoom)),
        (l.maxZoom = Math.min(l.maxZoom, n.maxZoom)),
        n.extent !== void 0 &&
          (l.extent !== void 0
            ? (l.extent = ei(l.extent, n.extent))
            : (l.extent = n.extent)),
        l.zIndex === void 0 && (l.zIndex = r);
    }
    return e;
  }
  getSourceState() {
    return "ready";
  }
}
const _n = ws;
class Oc extends Bt {
  constructor(t, e, i) {
    super(t), (this.map = e), (this.frameState = i !== void 0 ? i : null);
  }
}
const be = Oc;
class bc extends be {
  constructor(t, e, i, n, r, o) {
    super(t, e, r),
      (this.originalEvent = i),
      (this.pixel_ = null),
      (this.coordinate_ = null),
      (this.dragging = n !== void 0 ? n : !1),
      (this.activePointers = o);
  }
  get pixel() {
    return (
      this.pixel_ || (this.pixel_ = this.map.getEventPixel(this.originalEvent)),
      this.pixel_
    );
  }
  set pixel(t) {
    this.pixel_ = t;
  }
  get coordinate() {
    return (
      this.coordinate_ ||
        (this.coordinate_ = this.map.getCoordinateFromPixel(this.pixel)),
      this.coordinate_
    );
  }
  set coordinate(t) {
    this.coordinate_ = t;
  }
  preventDefault() {
    super.preventDefault(),
      "preventDefault" in this.originalEvent &&
        this.originalEvent.preventDefault();
  }
  stopPropagation() {
    super.stopPropagation(),
      "stopPropagation" in this.originalEvent &&
        this.originalEvent.stopPropagation();
  }
}
const Qt = bc,
  H = {
    SINGLECLICK: "singleclick",
    CLICK: F.CLICK,
    DBLCLICK: F.DBLCLICK,
    POINTERDRAG: "pointerdrag",
    POINTERMOVE: "pointermove",
    POINTERDOWN: "pointerdown",
    POINTERUP: "pointerup",
    POINTEROVER: "pointerover",
    POINTEROUT: "pointerout",
    POINTERENTER: "pointerenter",
    POINTERLEAVE: "pointerleave",
    POINTERCANCEL: "pointercancel",
  },
  $n = {
    POINTERMOVE: "pointermove",
    POINTERDOWN: "pointerdown",
    POINTERUP: "pointerup",
    POINTEROVER: "pointerover",
    POINTEROUT: "pointerout",
    POINTERENTER: "pointerenter",
    POINTERLEAVE: "pointerleave",
    POINTERCANCEL: "pointercancel",
  };
class Pc extends sn {
  constructor(t, e) {
    super(t),
      (this.map_ = t),
      this.clickTimeoutId_,
      (this.emulateClicks_ = !1),
      (this.dragging_ = !1),
      (this.dragListenerKeys_ = []),
      (this.moveTolerance_ = e === void 0 ? 1 : e),
      (this.down_ = null);
    const i = this.map_.getViewport();
    (this.activePointers_ = []),
      (this.trackedTouches_ = {}),
      (this.element_ = i),
      (this.pointerdownListenerKey_ = W(
        i,
        $n.POINTERDOWN,
        this.handlePointerDown_,
        this
      )),
      this.originalPointerMoveEvent_,
      (this.relayedListenerKey_ = W(
        i,
        $n.POINTERMOVE,
        this.relayMoveEvent_,
        this
      )),
      (this.boundHandleTouchMove_ = this.handleTouchMove_.bind(this)),
      this.element_.addEventListener(
        F.TOUCHMOVE,
        this.boundHandleTouchMove_,
        Xr ? { passive: !1 } : !1
      );
  }
  emulateClick_(t) {
    let e = new Qt(H.CLICK, this.map_, t);
    this.dispatchEvent(e),
      this.clickTimeoutId_ !== void 0
        ? (clearTimeout(this.clickTimeoutId_),
          (this.clickTimeoutId_ = void 0),
          (e = new Qt(H.DBLCLICK, this.map_, t)),
          this.dispatchEvent(e))
        : (this.clickTimeoutId_ = setTimeout(() => {
            this.clickTimeoutId_ = void 0;
            const i = new Qt(H.SINGLECLICK, this.map_, t);
            this.dispatchEvent(i);
          }, 250));
  }
  updateActivePointers_(t) {
    const e = t,
      i = e.pointerId;
    if (e.type == H.POINTERUP || e.type == H.POINTERCANCEL) {
      delete this.trackedTouches_[i];
      for (const n in this.trackedTouches_)
        if (this.trackedTouches_[n].target !== e.target) {
          delete this.trackedTouches_[n];
          break;
        }
    } else
      (e.type == H.POINTERDOWN || e.type == H.POINTERMOVE) &&
        (this.trackedTouches_[i] = e);
    this.activePointers_ = Object.values(this.trackedTouches_);
  }
  handlePointerUp_(t) {
    this.updateActivePointers_(t);
    const e = new Qt(
      H.POINTERUP,
      this.map_,
      t,
      void 0,
      void 0,
      this.activePointers_
    );
    this.dispatchEvent(e),
      this.emulateClicks_ &&
        !e.defaultPrevented &&
        !this.dragging_ &&
        this.isMouseActionButton_(t) &&
        this.emulateClick_(this.down_),
      this.activePointers_.length === 0 &&
        (this.dragListenerKeys_.forEach(j),
        (this.dragListenerKeys_.length = 0),
        (this.dragging_ = !1),
        (this.down_ = null));
  }
  isMouseActionButton_(t) {
    return t.button === 0;
  }
  handlePointerDown_(t) {
    (this.emulateClicks_ = this.activePointers_.length === 0),
      this.updateActivePointers_(t);
    const e = new Qt(
      H.POINTERDOWN,
      this.map_,
      t,
      void 0,
      void 0,
      this.activePointers_
    );
    if (
      (this.dispatchEvent(e),
      (this.down_ = new PointerEvent(t.type, t)),
      Object.defineProperty(this.down_, "target", {
        writable: !1,
        value: t.target,
      }),
      this.dragListenerKeys_.length === 0)
    ) {
      const i = this.map_.getOwnerDocument();
      this.dragListenerKeys_.push(
        W(i, H.POINTERMOVE, this.handlePointerMove_, this),
        W(i, H.POINTERUP, this.handlePointerUp_, this),
        W(this.element_, H.POINTERCANCEL, this.handlePointerUp_, this)
      ),
        this.element_.getRootNode &&
          this.element_.getRootNode() !== i &&
          this.dragListenerKeys_.push(
            W(
              this.element_.getRootNode(),
              H.POINTERUP,
              this.handlePointerUp_,
              this
            )
          );
    }
  }
  handlePointerMove_(t) {
    if (this.isMoving_(t)) {
      this.updateActivePointers_(t), (this.dragging_ = !0);
      const e = new Qt(
        H.POINTERDRAG,
        this.map_,
        t,
        this.dragging_,
        void 0,
        this.activePointers_
      );
      this.dispatchEvent(e);
    }
  }
  relayMoveEvent_(t) {
    this.originalPointerMoveEvent_ = t;
    const e = !!(this.down_ && this.isMoving_(t));
    this.dispatchEvent(new Qt(H.POINTERMOVE, this.map_, t, e));
  }
  handleTouchMove_(t) {
    const e = this.originalPointerMoveEvent_;
    (!e || e.defaultPrevented) &&
      (typeof t.cancelable != "boolean" || t.cancelable === !0) &&
      t.preventDefault();
  }
  isMoving_(t) {
    return (
      this.dragging_ ||
      Math.abs(t.clientX - this.down_.clientX) > this.moveTolerance_ ||
      Math.abs(t.clientY - this.down_.clientY) > this.moveTolerance_
    );
  }
  disposeInternal() {
    this.relayedListenerKey_ &&
      (j(this.relayedListenerKey_), (this.relayedListenerKey_ = null)),
      this.element_.removeEventListener(
        F.TOUCHMOVE,
        this.boundHandleTouchMove_
      ),
      this.pointerdownListenerKey_ &&
        (j(this.pointerdownListenerKey_),
        (this.pointerdownListenerKey_ = null)),
      this.dragListenerKeys_.forEach(j),
      (this.dragListenerKeys_.length = 0),
      (this.element_ = null),
      super.disposeInternal();
  }
}
const Dc = Pc,
  te = {
    POSTRENDER: "postrender",
    MOVESTART: "movestart",
    MOVEEND: "moveend",
    LOADSTART: "loadstart",
    LOADEND: "loadend",
  },
  st = {
    LAYERGROUP: "layergroup",
    SIZE: "size",
    TARGET: "target",
    VIEW: "view",
  },
  en = 1 / 0;
class Fc {
  constructor(t, e) {
    (this.priorityFunction_ = t),
      (this.keyFunction_ = e),
      (this.elements_ = []),
      (this.priorities_ = []),
      (this.queuedElements_ = {});
  }
  clear() {
    (this.elements_.length = 0),
      (this.priorities_.length = 0),
      pi(this.queuedElements_);
  }
  dequeue() {
    const t = this.elements_,
      e = this.priorities_,
      i = t[0];
    t.length == 1
      ? ((t.length = 0), (e.length = 0))
      : ((t[0] = t.pop()), (e[0] = e.pop()), this.siftUp_(0));
    const n = this.keyFunction_(i);
    return delete this.queuedElements_[n], i;
  }
  enqueue(t) {
    G(!(this.keyFunction_(t) in this.queuedElements_), 31);
    const e = this.priorityFunction_(t);
    return e != en
      ? (this.elements_.push(t),
        this.priorities_.push(e),
        (this.queuedElements_[this.keyFunction_(t)] = !0),
        this.siftDown_(0, this.elements_.length - 1),
        !0)
      : !1;
  }
  getCount() {
    return this.elements_.length;
  }
  getLeftChildIndex_(t) {
    return t * 2 + 1;
  }
  getRightChildIndex_(t) {
    return t * 2 + 2;
  }
  getParentIndex_(t) {
    return (t - 1) >> 1;
  }
  heapify_() {
    let t;
    for (t = (this.elements_.length >> 1) - 1; t >= 0; t--) this.siftUp_(t);
  }
  isEmpty() {
    return this.elements_.length === 0;
  }
  isKeyQueued(t) {
    return t in this.queuedElements_;
  }
  isQueued(t) {
    return this.isKeyQueued(this.keyFunction_(t));
  }
  siftUp_(t) {
    const e = this.elements_,
      i = this.priorities_,
      n = e.length,
      r = e[t],
      o = i[t],
      a = t;
    for (; t < n >> 1; ) {
      const l = this.getLeftChildIndex_(t),
        h = this.getRightChildIndex_(t),
        c = h < n && i[h] < i[l] ? h : l;
      (e[t] = e[c]), (i[t] = i[c]), (t = c);
    }
    (e[t] = r), (i[t] = o), this.siftDown_(a, t);
  }
  siftDown_(t, e) {
    const i = this.elements_,
      n = this.priorities_,
      r = i[e],
      o = n[e];
    for (; e > t; ) {
      const a = this.getParentIndex_(e);
      if (n[a] > o) (i[e] = i[a]), (n[e] = n[a]), (e = a);
      else break;
    }
    (i[e] = r), (n[e] = o);
  }
  reprioritize() {
    const t = this.priorityFunction_,
      e = this.elements_,
      i = this.priorities_;
    let n = 0;
    const r = e.length;
    let o, a, l;
    for (a = 0; a < r; ++a)
      (o = e[a]),
        (l = t(o)),
        l == en
          ? delete this.queuedElements_[this.keyFunction_(o)]
          : ((i[n] = l), (e[n++] = o));
    (e.length = n), (i.length = n), this.heapify_();
  }
}
const kc = Fc;
class Nc extends kc {
  constructor(t, e) {
    super(
      function (i) {
        return t.apply(null, i);
      },
      function (i) {
        return i[0].getKey();
      }
    ),
      (this.boundHandleTileChange_ = this.handleTileChange.bind(this)),
      (this.tileChangeCallback_ = e),
      (this.tilesLoading_ = 0),
      (this.tilesLoadingKeys_ = {});
  }
  enqueue(t) {
    const e = super.enqueue(t);
    return e && t[0].addEventListener(F.CHANGE, this.boundHandleTileChange_), e;
  }
  getTilesLoading() {
    return this.tilesLoading_;
  }
  handleTileChange(t) {
    const e = t.target,
      i = e.getState();
    if (i === A.LOADED || i === A.ERROR || i === A.EMPTY) {
      i !== A.ERROR &&
        e.removeEventListener(F.CHANGE, this.boundHandleTileChange_);
      const n = e.getKey();
      n in this.tilesLoadingKeys_ &&
        (delete this.tilesLoadingKeys_[n], --this.tilesLoading_),
        this.tileChangeCallback_();
    }
  }
  loadMoreTiles(t, e) {
    let i = 0,
      n,
      r,
      o;
    for (; this.tilesLoading_ < t && i < e && this.getCount() > 0; )
      (r = this.dequeue()[0]),
        (o = r.getKey()),
        (n = r.getState()),
        n === A.IDLE &&
          !(o in this.tilesLoadingKeys_) &&
          ((this.tilesLoadingKeys_[o] = !0),
          ++this.tilesLoading_,
          ++i,
          r.load());
  }
}
const Gc = Nc;
function Xc(s, t, e, i, n) {
  if (!s || !(e in s.wantedTiles) || !s.wantedTiles[e][t.getKey()]) return en;
  const r = s.viewState.center,
    o = i[0] - r[0],
    a = i[1] - r[1];
  return 65536 * Math.log(n) + Math.sqrt(o * o + a * a) / n;
}
class Wc extends bt {
  constructor(t) {
    super();
    const e = t.element;
    e &&
      !t.target &&
      !e.style.pointerEvents &&
      (e.style.pointerEvents = "auto"),
      (this.element = e || null),
      (this.target_ = null),
      (this.map_ = null),
      (this.listenerKeys = []),
      t.render && (this.render = t.render),
      t.target && this.setTarget(t.target);
  }
  disposeInternal() {
    Kn(this.element), super.disposeInternal();
  }
  getMap() {
    return this.map_;
  }
  setMap(t) {
    this.map_ && Kn(this.element);
    for (let e = 0, i = this.listenerKeys.length; e < i; ++e)
      j(this.listenerKeys[e]);
    (this.listenerKeys.length = 0),
      (this.map_ = t),
      t &&
        ((this.target_
          ? this.target_
          : t.getOverlayContainerStopEvent()
        ).appendChild(this.element),
        this.render !== Ye &&
          this.listenerKeys.push(W(t, te.POSTRENDER, this.render, this)),
        t.render());
  }
  render(t) {}
  setTarget(t) {
    this.target_ = typeof t == "string" ? document.getElementById(t) : t;
  }
}
const vs = Wc;
class zc extends vs {
  constructor(t) {
    (t = t || {}),
      super({
        element: document.createElement("div"),
        render: t.render,
        target: t.target,
      }),
      (this.ulElement_ = document.createElement("ul")),
      (this.collapsed_ = t.collapsed !== void 0 ? t.collapsed : !0),
      (this.userCollapsed_ = this.collapsed_),
      (this.overrideCollapsible_ = t.collapsible !== void 0),
      (this.collapsible_ = t.collapsible !== void 0 ? t.collapsible : !0),
      this.collapsible_ || (this.collapsed_ = !1);
    const e = t.className !== void 0 ? t.className : "ol-attribution",
      i = t.tipLabel !== void 0 ? t.tipLabel : "Attributions",
      n = t.expandClassName !== void 0 ? t.expandClassName : e + "-expand",
      r = t.collapseLabel !== void 0 ? t.collapseLabel : "\u203A",
      o =
        t.collapseClassName !== void 0 ? t.collapseClassName : e + "-collapse";
    typeof r == "string"
      ? ((this.collapseLabel_ = document.createElement("span")),
        (this.collapseLabel_.textContent = r),
        (this.collapseLabel_.className = o))
      : (this.collapseLabel_ = r);
    const a = t.label !== void 0 ? t.label : "i";
    typeof a == "string"
      ? ((this.label_ = document.createElement("span")),
        (this.label_.textContent = a),
        (this.label_.className = n))
      : (this.label_ = a);
    const l =
      this.collapsible_ && !this.collapsed_ ? this.collapseLabel_ : this.label_;
    (this.toggleButton_ = document.createElement("button")),
      this.toggleButton_.setAttribute("type", "button"),
      this.toggleButton_.setAttribute(
        "aria-expanded",
        String(!this.collapsed_)
      ),
      (this.toggleButton_.title = i),
      this.toggleButton_.appendChild(l),
      this.toggleButton_.addEventListener(
        F.CLICK,
        this.handleClick_.bind(this),
        !1
      );
    const h =
        e +
        " " +
        fn +
        " " +
        ys +
        (this.collapsed_ && this.collapsible_ ? " " + _r : "") +
        (this.collapsible_ ? "" : " ol-uncollapsible"),
      c = this.element;
    (c.className = h),
      c.appendChild(this.toggleButton_),
      c.appendChild(this.ulElement_),
      (this.renderedAttributions_ = []),
      (this.renderedVisible_ = !0);
  }
  collectSourceAttributions_(t) {
    const e = Array.from(
        new Set(
          this.getMap()
            .getAllLayers()
            .flatMap((n) => n.getAttributions(t))
        )
      ),
      i = !this.getMap()
        .getAllLayers()
        .some(
          (n) =>
            n.getSource() && n.getSource().getAttributionsCollapsible() === !1
        );
    return this.overrideCollapsible_ || this.setCollapsible(i), e;
  }
  updateElement_(t) {
    if (!t) {
      this.renderedVisible_ &&
        ((this.element.style.display = "none"), (this.renderedVisible_ = !1));
      return;
    }
    const e = this.collectSourceAttributions_(t),
      i = e.length > 0;
    if (
      (this.renderedVisible_ != i &&
        ((this.element.style.display = i ? "" : "none"),
        (this.renderedVisible_ = i)),
      !oe(e, this.renderedAttributions_))
    ) {
      ql(this.ulElement_);
      for (let n = 0, r = e.length; n < r; ++n) {
        const o = document.createElement("li");
        (o.innerHTML = e[n]), this.ulElement_.appendChild(o);
      }
      this.renderedAttributions_ = e;
    }
  }
  handleClick_(t) {
    t.preventDefault(),
      this.handleToggle_(),
      (this.userCollapsed_ = this.collapsed_);
  }
  handleToggle_() {
    this.element.classList.toggle(_r),
      this.collapsed_
        ? lr(this.collapseLabel_, this.label_)
        : lr(this.label_, this.collapseLabel_),
      (this.collapsed_ = !this.collapsed_),
      this.toggleButton_.setAttribute(
        "aria-expanded",
        String(!this.collapsed_)
      );
  }
  getCollapsible() {
    return this.collapsible_;
  }
  setCollapsible(t) {
    this.collapsible_ !== t &&
      ((this.collapsible_ = t),
      this.element.classList.toggle("ol-uncollapsible"),
      this.userCollapsed_ && this.handleToggle_());
  }
  setCollapsed(t) {
    (this.userCollapsed_ = t),
      !(!this.collapsible_ || this.collapsed_ === t) && this.handleToggle_();
  }
  getCollapsed() {
    return this.collapsed_;
  }
  render(t) {
    this.updateElement_(t.frameState);
  }
}
const Yc = zc;
class Bc extends vs {
  constructor(t) {
    (t = t || {}),
      super({
        element: document.createElement("div"),
        render: t.render,
        target: t.target,
      });
    const e = t.className !== void 0 ? t.className : "ol-rotate",
      i = t.label !== void 0 ? t.label : "\u21E7",
      n = t.compassClassName !== void 0 ? t.compassClassName : "ol-compass";
    (this.label_ = null),
      typeof i == "string"
        ? ((this.label_ = document.createElement("span")),
          (this.label_.className = n),
          (this.label_.textContent = i))
        : ((this.label_ = i), this.label_.classList.add(n));
    const r = t.tipLabel ? t.tipLabel : "Reset rotation",
      o = document.createElement("button");
    (o.className = e + "-reset"),
      o.setAttribute("type", "button"),
      (o.title = r),
      o.appendChild(this.label_),
      o.addEventListener(F.CLICK, this.handleClick_.bind(this), !1);
    const a = e + " " + fn + " " + ys,
      l = this.element;
    (l.className = a),
      l.appendChild(o),
      (this.callResetNorth_ = t.resetNorth ? t.resetNorth : void 0),
      (this.duration_ = t.duration !== void 0 ? t.duration : 250),
      (this.autoHide_ = t.autoHide !== void 0 ? t.autoHide : !0),
      (this.rotation_ = void 0),
      this.autoHide_ && this.element.classList.add(Gi);
  }
  handleClick_(t) {
    t.preventDefault(),
      this.callResetNorth_ !== void 0
        ? this.callResetNorth_()
        : this.resetNorth_();
  }
  resetNorth_() {
    const e = this.getMap().getView();
    if (!e) return;
    const i = e.getRotation();
    i !== void 0 &&
      (this.duration_ > 0 && i % (2 * Math.PI) !== 0
        ? e.animate({ rotation: 0, duration: this.duration_, easing: Ke })
        : e.setRotation(0));
  }
  render(t) {
    const e = t.frameState;
    if (!e) return;
    const i = e.viewState.rotation;
    if (i != this.rotation_) {
      const n = "rotate(" + i + "rad)";
      if (this.autoHide_) {
        const r = this.element.classList.contains(Gi);
        !r && i === 0
          ? this.element.classList.add(Gi)
          : r && i !== 0 && this.element.classList.remove(Gi);
      }
      this.label_.style.transform = n;
    }
    this.rotation_ = i;
  }
}
const Zc = Bc;
class Kc extends vs {
  constructor(t) {
    (t = t || {}),
      super({ element: document.createElement("div"), target: t.target });
    const e = t.className !== void 0 ? t.className : "ol-zoom",
      i = t.delta !== void 0 ? t.delta : 1,
      n = t.zoomInClassName !== void 0 ? t.zoomInClassName : e + "-in",
      r = t.zoomOutClassName !== void 0 ? t.zoomOutClassName : e + "-out",
      o = t.zoomInLabel !== void 0 ? t.zoomInLabel : "+",
      a = t.zoomOutLabel !== void 0 ? t.zoomOutLabel : "\u2013",
      l = t.zoomInTipLabel !== void 0 ? t.zoomInTipLabel : "Zoom in",
      h = t.zoomOutTipLabel !== void 0 ? t.zoomOutTipLabel : "Zoom out",
      c = document.createElement("button");
    (c.className = n),
      c.setAttribute("type", "button"),
      (c.title = l),
      c.appendChild(typeof o == "string" ? document.createTextNode(o) : o),
      c.addEventListener(F.CLICK, this.handleClick_.bind(this, i), !1);
    const u = document.createElement("button");
    (u.className = r),
      u.setAttribute("type", "button"),
      (u.title = h),
      u.appendChild(typeof a == "string" ? document.createTextNode(a) : a),
      u.addEventListener(F.CLICK, this.handleClick_.bind(this, -i), !1);
    const d = e + " " + fn + " " + ys,
      f = this.element;
    (f.className = d),
      f.appendChild(c),
      f.appendChild(u),
      (this.duration_ = t.duration !== void 0 ? t.duration : 250);
  }
  handleClick_(t, e) {
    e.preventDefault(), this.zoomByDelta_(t);
  }
  zoomByDelta_(t) {
    const i = this.getMap().getView();
    if (!i) return;
    const n = i.getZoom();
    if (n !== void 0) {
      const r = i.getConstrainedZoom(n + t);
      this.duration_ > 0
        ? (i.getAnimating() && i.cancelAnimations(),
          i.animate({ zoom: r, duration: this.duration_, easing: Ke }))
        : i.setZoom(r);
    }
  }
}
const Vc = Kc;
function Uc(s) {
  s = s || {};
  const t = new At();
  return (
    (s.zoom !== void 0 ? s.zoom : !0) && t.push(new Vc(s.zoomOptions)),
    (s.rotate !== void 0 ? s.rotate : !0) && t.push(new Zc(s.rotateOptions)),
    (s.attribution !== void 0 ? s.attribution : !0) &&
      t.push(new Yc(s.attributionOptions)),
    t
  );
}
const Mr = { ACTIVE: "active" };
class jc extends bt {
  constructor(t) {
    super(),
      this.on,
      this.once,
      this.un,
      t && t.handleEvent && (this.handleEvent = t.handleEvent),
      (this.map_ = null),
      this.setActive(!0);
  }
  getActive() {
    return this.get(Mr.ACTIVE);
  }
  getMap() {
    return this.map_;
  }
  handleEvent(t) {
    return !0;
  }
  setActive(t) {
    this.set(Mr.ACTIVE, t);
  }
  setMap(t) {
    this.map_ = t;
  }
}
function Hc(s, t, e) {
  const i = s.getCenterInternal();
  if (i) {
    const n = [i[0] + t[0], i[1] + t[1]];
    s.animateInternal({
      duration: e !== void 0 ? e : 250,
      easing: Dl,
      center: s.getConstrainedCenter(n),
    });
  }
}
function Ls(s, t, e, i) {
  const n = s.getZoom();
  if (n === void 0) return;
  const r = s.getConstrainedZoom(n + t),
    o = s.getResolutionForZoom(r);
  s.getAnimating() && s.cancelAnimations(),
    s.animate({
      resolution: o,
      anchor: e,
      duration: i !== void 0 ? i : 250,
      easing: Ke,
    });
}
const Ci = jc;
class $c extends Ci {
  constructor(t) {
    super(),
      (t = t || {}),
      (this.delta_ = t.delta ? t.delta : 1),
      (this.duration_ = t.duration !== void 0 ? t.duration : 250);
  }
  handleEvent(t) {
    let e = !1;
    if (t.type == H.DBLCLICK) {
      const i = t.originalEvent,
        n = t.map,
        r = t.coordinate,
        o = i.shiftKey ? -this.delta_ : this.delta_,
        a = n.getView();
      Ls(a, o, r, this.duration_), i.preventDefault(), (e = !0);
    }
    return !e;
  }
}
const qc = $c;
class Jc extends Ci {
  constructor(t) {
    (t = t || {}),
      super(t),
      t.handleDownEvent && (this.handleDownEvent = t.handleDownEvent),
      t.handleDragEvent && (this.handleDragEvent = t.handleDragEvent),
      t.handleMoveEvent && (this.handleMoveEvent = t.handleMoveEvent),
      t.handleUpEvent && (this.handleUpEvent = t.handleUpEvent),
      t.stopDown && (this.stopDown = t.stopDown),
      (this.handlingDownUpSequence = !1),
      (this.targetPointers = []);
  }
  getPointerCount() {
    return this.targetPointers.length;
  }
  handleDownEvent(t) {
    return !1;
  }
  handleDragEvent(t) {}
  handleEvent(t) {
    if (!t.originalEvent) return !0;
    let e = !1;
    if ((this.updateTrackedPointers_(t), this.handlingDownUpSequence)) {
      if (t.type == H.POINTERDRAG)
        this.handleDragEvent(t), t.originalEvent.preventDefault();
      else if (t.type == H.POINTERUP) {
        const i = this.handleUpEvent(t);
        this.handlingDownUpSequence = i && this.targetPointers.length > 0;
      }
    } else if (t.type == H.POINTERDOWN) {
      const i = this.handleDownEvent(t);
      (this.handlingDownUpSequence = i), (e = this.stopDown(i));
    } else t.type == H.POINTERMOVE && this.handleMoveEvent(t);
    return !e;
  }
  handleMoveEvent(t) {}
  handleUpEvent(t) {
    return !1;
  }
  stopDown(t) {
    return t;
  }
  updateTrackedPointers_(t) {
    t.activePointers && (this.targetPointers = t.activePointers);
  }
}
function As(s) {
  const t = s.length;
  let e = 0,
    i = 0;
  for (let n = 0; n < t; n++) (e += s[n].clientX), (i += s[n].clientY);
  return { clientX: e / t, clientY: i / t };
}
const Ri = Jc;
function qn(s) {
  const t = arguments;
  return function (e) {
    let i = !0;
    for (let n = 0, r = t.length; n < r && ((i = i && t[n](e)), !!i); ++n);
    return i;
  };
}
const Qc = function (s) {
    const t = s.originalEvent;
    return t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
  },
  tu = function (s) {
    const t = s.map.getTargetElement(),
      e = s.map.getOwnerDocument().activeElement;
    return t.contains(e);
  },
  ko = function (s) {
    return s.map.getTargetElement().hasAttribute("tabindex") ? tu(s) : !0;
  },
  eu = ni,
  No = function (s) {
    const t = s.originalEvent;
    return t.button == 0 && !(Ra && Ta && t.ctrlKey);
  },
  Go = function (s) {
    const t = s.originalEvent;
    return !t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey;
  },
  iu = function (s) {
    const t = s.originalEvent;
    return !t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
  },
  Xo = function (s) {
    const t = s.originalEvent,
      e = t.target.tagName;
    return (
      e !== "INPUT" &&
      e !== "SELECT" &&
      e !== "TEXTAREA" &&
      !t.target.isContentEditable
    );
  },
  Fn = function (s) {
    const t = s.originalEvent;
    return G(t !== void 0, 56), t.pointerType == "mouse";
  },
  nu = function (s) {
    const t = s.originalEvent;
    return G(t !== void 0, 56), t.isPrimary && t.button === 0;
  };
class su extends Ri {
  constructor(t) {
    super({ stopDown: nn }),
      (t = t || {}),
      (this.kinetic_ = t.kinetic),
      (this.lastCentroid = null),
      this.lastPointersCount_,
      (this.panning_ = !1);
    const e = t.condition ? t.condition : qn(Go, nu);
    (this.condition_ = t.onFocusOnly ? qn(ko, e) : e), (this.noKinetic_ = !1);
  }
  handleDragEvent(t) {
    const e = t.map;
    this.panning_ || ((this.panning_ = !0), e.getView().beginInteraction());
    const i = this.targetPointers,
      n = e.getEventPixel(As(i));
    if (i.length == this.lastPointersCount_) {
      if (
        (this.kinetic_ && this.kinetic_.update(n[0], n[1]), this.lastCentroid)
      ) {
        const r = [this.lastCentroid[0] - n[0], n[1] - this.lastCentroid[1]],
          a = t.map.getView();
        $a(r, a.getResolution()),
          os(r, a.getRotation()),
          a.adjustCenterInternal(r);
      }
    } else this.kinetic_ && this.kinetic_.begin();
    (this.lastCentroid = n),
      (this.lastPointersCount_ = i.length),
      t.originalEvent.preventDefault();
  }
  handleUpEvent(t) {
    const e = t.map,
      i = e.getView();
    if (this.targetPointers.length === 0) {
      if (!this.noKinetic_ && this.kinetic_ && this.kinetic_.end()) {
        const n = this.kinetic_.getDistance(),
          r = this.kinetic_.getAngle(),
          o = i.getCenterInternal(),
          a = e.getPixelFromCoordinateInternal(o),
          l = e.getCoordinateFromPixelInternal([
            a[0] - n * Math.cos(r),
            a[1] - n * Math.sin(r),
          ]);
        i.animateInternal({
          center: i.getConstrainedCenter(l),
          duration: 500,
          easing: Ke,
        });
      }
      return this.panning_ && ((this.panning_ = !1), i.endInteraction()), !1;
    }
    return (
      this.kinetic_ && this.kinetic_.begin(), (this.lastCentroid = null), !0
    );
  }
  handleDownEvent(t) {
    if (this.targetPointers.length > 0 && this.condition_(t)) {
      const i = t.map.getView();
      return (
        (this.lastCentroid = null),
        i.getAnimating() && i.cancelAnimations(),
        this.kinetic_ && this.kinetic_.begin(),
        (this.noKinetic_ = this.targetPointers.length > 1),
        !0
      );
    }
    return !1;
  }
}
const ru = su;
class ou extends Ri {
  constructor(t) {
    (t = t || {}),
      super({ stopDown: nn }),
      (this.condition_ = t.condition ? t.condition : Qc),
      (this.lastAngle_ = void 0),
      (this.duration_ = t.duration !== void 0 ? t.duration : 250);
  }
  handleDragEvent(t) {
    if (!Fn(t)) return;
    const e = t.map,
      i = e.getView();
    if (i.getConstraints().rotation === _s) return;
    const n = e.getSize(),
      r = t.pixel,
      o = Math.atan2(n[1] / 2 - r[1], r[0] - n[0] / 2);
    if (this.lastAngle_ !== void 0) {
      const a = o - this.lastAngle_;
      i.adjustRotationInternal(-a);
    }
    this.lastAngle_ = o;
  }
  handleUpEvent(t) {
    return Fn(t) ? (t.map.getView().endInteraction(this.duration_), !1) : !0;
  }
  handleDownEvent(t) {
    return Fn(t) && No(t) && this.condition_(t)
      ? (t.map.getView().beginInteraction(), (this.lastAngle_ = void 0), !0)
      : !1;
  }
}
const au = ou;
class lu extends Jn {
  constructor(t) {
    super(),
      (this.geometry_ = null),
      (this.element_ = document.createElement("div")),
      (this.element_.style.position = "absolute"),
      (this.element_.style.pointerEvents = "auto"),
      (this.element_.className = "ol-box " + t),
      (this.map_ = null),
      (this.startPixel_ = null),
      (this.endPixel_ = null);
  }
  disposeInternal() {
    this.setMap(null);
  }
  render_() {
    const t = this.startPixel_,
      e = this.endPixel_,
      i = "px",
      n = this.element_.style;
    (n.left = Math.min(t[0], e[0]) + i),
      (n.top = Math.min(t[1], e[1]) + i),
      (n.width = Math.abs(e[0] - t[0]) + i),
      (n.height = Math.abs(e[1] - t[1]) + i);
  }
  setMap(t) {
    if (this.map_) {
      this.map_.getOverlayContainer().removeChild(this.element_);
      const e = this.element_.style;
      (e.left = "inherit"),
        (e.top = "inherit"),
        (e.width = "inherit"),
        (e.height = "inherit");
    }
    (this.map_ = t),
      this.map_ && this.map_.getOverlayContainer().appendChild(this.element_);
  }
  setPixels(t, e) {
    (this.startPixel_ = t),
      (this.endPixel_ = e),
      this.createOrUpdateGeometry(),
      this.render_();
  }
  createOrUpdateGeometry() {
    const t = this.startPixel_,
      e = this.endPixel_,
      n = [t, [t[0], e[1]], e, [e[0], t[1]]].map(
        this.map_.getCoordinateFromPixelInternal,
        this.map_
      );
    (n[4] = n[0].slice()),
      this.geometry_
        ? this.geometry_.setCoordinates([n])
        : (this.geometry_ = new ai([n]));
  }
  getGeometry() {
    return this.geometry_;
  }
}
const hu = lu,
  zi = {
    BOXSTART: "boxstart",
    BOXDRAG: "boxdrag",
    BOXEND: "boxend",
    BOXCANCEL: "boxcancel",
  };
class kn extends Bt {
  constructor(t, e, i) {
    super(t), (this.coordinate = e), (this.mapBrowserEvent = i);
  }
}
class cu extends Ri {
  constructor(t) {
    super(),
      this.on,
      this.once,
      this.un,
      (t = t || {}),
      (this.box_ = new hu(t.className || "ol-dragbox")),
      (this.minArea_ = t.minArea !== void 0 ? t.minArea : 64),
      t.onBoxEnd && (this.onBoxEnd = t.onBoxEnd),
      (this.startPixel_ = null),
      (this.condition_ = t.condition ? t.condition : No),
      (this.boxEndCondition_ = t.boxEndCondition
        ? t.boxEndCondition
        : this.defaultBoxEndCondition);
  }
  defaultBoxEndCondition(t, e, i) {
    const n = i[0] - e[0],
      r = i[1] - e[1];
    return n * n + r * r >= this.minArea_;
  }
  getGeometry() {
    return this.box_.getGeometry();
  }
  handleDragEvent(t) {
    this.box_.setPixels(this.startPixel_, t.pixel),
      this.dispatchEvent(new kn(zi.BOXDRAG, t.coordinate, t));
  }
  handleUpEvent(t) {
    this.box_.setMap(null);
    const e = this.boxEndCondition_(t, this.startPixel_, t.pixel);
    return (
      e && this.onBoxEnd(t),
      this.dispatchEvent(new kn(e ? zi.BOXEND : zi.BOXCANCEL, t.coordinate, t)),
      !1
    );
  }
  handleDownEvent(t) {
    return this.condition_(t)
      ? ((this.startPixel_ = t.pixel),
        this.box_.setMap(t.map),
        this.box_.setPixels(this.startPixel_, this.startPixel_),
        this.dispatchEvent(new kn(zi.BOXSTART, t.coordinate, t)),
        !0)
      : !1;
  }
  onBoxEnd(t) {}
}
const uu = cu;
class du extends uu {
  constructor(t) {
    t = t || {};
    const e = t.condition ? t.condition : iu;
    super({
      condition: e,
      className: t.className || "ol-dragzoom",
      minArea: t.minArea,
    }),
      (this.duration_ = t.duration !== void 0 ? t.duration : 200),
      (this.out_ = t.out !== void 0 ? t.out : !1);
  }
  onBoxEnd(t) {
    const i = this.getMap().getView();
    let n = this.getGeometry();
    if (this.out_) {
      const r = i.rotatedExtentForGeometry(n),
        o = i.getResolutionForExtentInternal(r),
        a = i.getResolution() / o;
      (n = n.clone()), n.scale(a * a);
    }
    i.fitInternal(n, { duration: this.duration_, easing: Ke });
  }
}
const fu = du,
  he = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };
class gu extends Ci {
  constructor(t) {
    super(),
      (t = t || {}),
      (this.defaultCondition_ = function (e) {
        return Go(e) && Xo(e);
      }),
      (this.condition_ =
        t.condition !== void 0 ? t.condition : this.defaultCondition_),
      (this.duration_ = t.duration !== void 0 ? t.duration : 100),
      (this.pixelDelta_ = t.pixelDelta !== void 0 ? t.pixelDelta : 128);
  }
  handleEvent(t) {
    let e = !1;
    if (t.type == F.KEYDOWN) {
      const i = t.originalEvent,
        n = i.keyCode;
      if (
        this.condition_(t) &&
        (n == he.DOWN || n == he.LEFT || n == he.RIGHT || n == he.UP)
      ) {
        const o = t.map.getView(),
          a = o.getResolution() * this.pixelDelta_;
        let l = 0,
          h = 0;
        n == he.DOWN
          ? (h = -a)
          : n == he.LEFT
          ? (l = -a)
          : n == he.RIGHT
          ? (l = a)
          : (h = a);
        const c = [l, h];
        os(c, o.getRotation()),
          Hc(o, c, this.duration_),
          i.preventDefault(),
          (e = !0);
      }
    }
    return !e;
  }
}
const _u = gu;
class mu extends Ci {
  constructor(t) {
    super(),
      (t = t || {}),
      (this.condition_ = t.condition ? t.condition : Xo),
      (this.delta_ = t.delta ? t.delta : 1),
      (this.duration_ = t.duration !== void 0 ? t.duration : 100);
  }
  handleEvent(t) {
    let e = !1;
    if (t.type == F.KEYDOWN || t.type == F.KEYPRESS) {
      const i = t.originalEvent,
        n = i.key;
      if (this.condition_(t) && (n === "+" || n === "-")) {
        const r = t.map,
          o = n === "+" ? this.delta_ : -this.delta_,
          a = r.getView();
        Ls(a, o, void 0, this.duration_), i.preventDefault(), (e = !0);
      }
    }
    return !e;
  }
}
const pu = mu;
class yu {
  constructor(t, e, i) {
    (this.decay_ = t),
      (this.minVelocity_ = e),
      (this.delay_ = i),
      (this.points_ = []),
      (this.angle_ = 0),
      (this.initialVelocity_ = 0);
  }
  begin() {
    (this.points_.length = 0), (this.angle_ = 0), (this.initialVelocity_ = 0);
  }
  update(t, e) {
    this.points_.push(t, e, Date.now());
  }
  end() {
    if (this.points_.length < 6) return !1;
    const t = Date.now() - this.delay_,
      e = this.points_.length - 3;
    if (this.points_[e + 2] < t) return !1;
    let i = e - 3;
    for (; i > 0 && this.points_[i + 2] > t; ) i -= 3;
    const n = this.points_[e + 2] - this.points_[i + 2];
    if (n < 1e3 / 60) return !1;
    const r = this.points_[e] - this.points_[i],
      o = this.points_[e + 1] - this.points_[i + 1];
    return (
      (this.angle_ = Math.atan2(o, r)),
      (this.initialVelocity_ = Math.sqrt(r * r + o * o) / n),
      this.initialVelocity_ > this.minVelocity_
    );
  }
  getDistance() {
    return (this.minVelocity_ - this.initialVelocity_) / this.decay_;
  }
  getAngle() {
    return this.angle_;
  }
}
const xu = yu;
class Eu extends Ci {
  constructor(t) {
    (t = t || {}),
      super(t),
      (this.totalDelta_ = 0),
      (this.lastDelta_ = 0),
      (this.maxDelta_ = t.maxDelta !== void 0 ? t.maxDelta : 1),
      (this.duration_ = t.duration !== void 0 ? t.duration : 250),
      (this.timeout_ = t.timeout !== void 0 ? t.timeout : 80),
      (this.useAnchor_ = t.useAnchor !== void 0 ? t.useAnchor : !0),
      (this.constrainResolution_ =
        t.constrainResolution !== void 0 ? t.constrainResolution : !1);
    const e = t.condition ? t.condition : eu;
    (this.condition_ = t.onFocusOnly ? qn(ko, e) : e),
      (this.lastAnchor_ = null),
      (this.startTime_ = void 0),
      this.timeoutId_,
      (this.mode_ = void 0),
      (this.trackpadEventGap_ = 400),
      this.trackpadTimeoutId_,
      (this.deltaPerZoom_ = 300);
  }
  endInteraction_() {
    this.trackpadTimeoutId_ = void 0;
    const t = this.getMap();
    if (!t) return;
    t.getView().endInteraction(
      void 0,
      this.lastDelta_ ? (this.lastDelta_ > 0 ? 1 : -1) : 0,
      this.lastAnchor_
    );
  }
  handleEvent(t) {
    if (!this.condition_(t) || t.type !== F.WHEEL) return !0;
    const i = t.map,
      n = t.originalEvent;
    n.preventDefault(), this.useAnchor_ && (this.lastAnchor_ = t.coordinate);
    let r;
    if (
      (t.type == F.WHEEL &&
        ((r = n.deltaY),
        Ea && n.deltaMode === WheelEvent.DOM_DELTA_PIXEL && (r /= Gr),
        n.deltaMode === WheelEvent.DOM_DELTA_LINE && (r *= 40)),
      r === 0)
    )
      return !1;
    this.lastDelta_ = r;
    const o = Date.now();
    this.startTime_ === void 0 && (this.startTime_ = o),
      (!this.mode_ || o - this.startTime_ > this.trackpadEventGap_) &&
        (this.mode_ = Math.abs(r) < 4 ? "trackpad" : "wheel");
    const a = i.getView();
    if (
      this.mode_ === "trackpad" &&
      !(a.getConstrainResolution() || this.constrainResolution_)
    )
      return (
        this.trackpadTimeoutId_
          ? clearTimeout(this.trackpadTimeoutId_)
          : (a.getAnimating() && a.cancelAnimations(), a.beginInteraction()),
        (this.trackpadTimeoutId_ = setTimeout(
          this.endInteraction_.bind(this),
          this.timeout_
        )),
        a.adjustZoom(-r / this.deltaPerZoom_, this.lastAnchor_),
        (this.startTime_ = o),
        !1
      );
    this.totalDelta_ += r;
    const l = Math.max(this.timeout_ - (o - this.startTime_), 0);
    return (
      clearTimeout(this.timeoutId_),
      (this.timeoutId_ = setTimeout(this.handleWheelZoom_.bind(this, i), l)),
      !1
    );
  }
  handleWheelZoom_(t) {
    const e = t.getView();
    e.getAnimating() && e.cancelAnimations();
    let i =
      -J(
        this.totalDelta_,
        -this.maxDelta_ * this.deltaPerZoom_,
        this.maxDelta_ * this.deltaPerZoom_
      ) / this.deltaPerZoom_;
    (e.getConstrainResolution() || this.constrainResolution_) &&
      (i = i ? (i > 0 ? 1 : -1) : 0),
      Ls(e, i, this.lastAnchor_, this.duration_),
      (this.mode_ = void 0),
      (this.totalDelta_ = 0),
      (this.lastAnchor_ = null),
      (this.startTime_ = void 0),
      (this.timeoutId_ = void 0);
  }
  setMouseAnchor(t) {
    (this.useAnchor_ = t), t || (this.lastAnchor_ = null);
  }
}
const Cu = Eu;
class Ru extends Ri {
  constructor(t) {
    t = t || {};
    const e = t;
    e.stopDown || (e.stopDown = nn),
      super(e),
      (this.anchor_ = null),
      (this.lastAngle_ = void 0),
      (this.rotating_ = !1),
      (this.rotationDelta_ = 0),
      (this.threshold_ = t.threshold !== void 0 ? t.threshold : 0.3),
      (this.duration_ = t.duration !== void 0 ? t.duration : 250);
  }
  handleDragEvent(t) {
    let e = 0;
    const i = this.targetPointers[0],
      n = this.targetPointers[1],
      r = Math.atan2(n.clientY - i.clientY, n.clientX - i.clientX);
    if (this.lastAngle_ !== void 0) {
      const l = r - this.lastAngle_;
      (this.rotationDelta_ += l),
        !this.rotating_ &&
          Math.abs(this.rotationDelta_) > this.threshold_ &&
          (this.rotating_ = !0),
        (e = l);
    }
    this.lastAngle_ = r;
    const o = t.map,
      a = o.getView();
    a.getConstraints().rotation !== _s &&
      ((this.anchor_ = o.getCoordinateFromPixelInternal(
        o.getEventPixel(As(this.targetPointers))
      )),
      this.rotating_ &&
        (o.render(), a.adjustRotationInternal(e, this.anchor_)));
  }
  handleUpEvent(t) {
    return this.targetPointers.length < 2
      ? (t.map.getView().endInteraction(this.duration_), !1)
      : !0;
  }
  handleDownEvent(t) {
    if (this.targetPointers.length >= 2) {
      const e = t.map;
      return (
        (this.anchor_ = null),
        (this.lastAngle_ = void 0),
        (this.rotating_ = !1),
        (this.rotationDelta_ = 0),
        this.handlingDownUpSequence || e.getView().beginInteraction(),
        !0
      );
    }
    return !1;
  }
}
const Tu = Ru;
class Iu extends Ri {
  constructor(t) {
    t = t || {};
    const e = t;
    e.stopDown || (e.stopDown = nn),
      super(e),
      (this.anchor_ = null),
      (this.duration_ = t.duration !== void 0 ? t.duration : 400),
      (this.lastDistance_ = void 0),
      (this.lastScaleDelta_ = 1);
  }
  handleDragEvent(t) {
    let e = 1;
    const i = this.targetPointers[0],
      n = this.targetPointers[1],
      r = i.clientX - n.clientX,
      o = i.clientY - n.clientY,
      a = Math.sqrt(r * r + o * o);
    this.lastDistance_ !== void 0 && (e = this.lastDistance_ / a),
      (this.lastDistance_ = a);
    const l = t.map,
      h = l.getView();
    e != 1 && (this.lastScaleDelta_ = e),
      (this.anchor_ = l.getCoordinateFromPixelInternal(
        l.getEventPixel(As(this.targetPointers))
      )),
      l.render(),
      h.adjustResolutionInternal(e, this.anchor_);
  }
  handleUpEvent(t) {
    if (this.targetPointers.length < 2) {
      const i = t.map.getView(),
        n = this.lastScaleDelta_ > 1 ? 1 : -1;
      return i.endInteraction(this.duration_, n), !1;
    }
    return !0;
  }
  handleDownEvent(t) {
    if (this.targetPointers.length >= 2) {
      const e = t.map;
      return (
        (this.anchor_ = null),
        (this.lastDistance_ = void 0),
        (this.lastScaleDelta_ = 1),
        this.handlingDownUpSequence || e.getView().beginInteraction(),
        !0
      );
    }
    return !1;
  }
}
const Su = Iu;
function wu(s) {
  s = s || {};
  const t = new At(),
    e = new xu(-0.005, 0.05, 100);
  return (
    (s.altShiftDragRotate !== void 0 ? s.altShiftDragRotate : !0) &&
      t.push(new au()),
    (s.doubleClickZoom !== void 0 ? s.doubleClickZoom : !0) &&
      t.push(new qc({ delta: s.zoomDelta, duration: s.zoomDuration })),
    (s.dragPan !== void 0 ? s.dragPan : !0) &&
      t.push(new ru({ onFocusOnly: s.onFocusOnly, kinetic: e })),
    (s.pinchRotate !== void 0 ? s.pinchRotate : !0) && t.push(new Tu()),
    (s.pinchZoom !== void 0 ? s.pinchZoom : !0) &&
      t.push(new Su({ duration: s.zoomDuration })),
    (s.keyboard !== void 0 ? s.keyboard : !0) &&
      (t.push(new _u()),
      t.push(new pu({ delta: s.zoomDelta, duration: s.zoomDuration }))),
    (s.mouseWheelZoom !== void 0 ? s.mouseWheelZoom : !0) &&
      t.push(new Cu({ onFocusOnly: s.onFocusOnly, duration: s.zoomDuration })),
    (s.shiftDragZoom !== void 0 ? s.shiftDragZoom : !0) &&
      t.push(new fu({ duration: s.zoomDuration })),
    t
  );
}
function Wo(s) {
  if (s instanceof un) {
    s.setMapInternal(null);
    return;
  }
  s instanceof _n && s.getLayers().forEach(Wo);
}
function zo(s, t) {
  if (s instanceof un) {
    s.setMapInternal(t);
    return;
  }
  if (s instanceof _n) {
    const e = s.getLayers().getArray();
    for (let i = 0, n = e.length; i < n; ++i) zo(e[i], t);
  }
}
class vu extends bt {
  constructor(t) {
    super(), (t = t || {}), this.on, this.once, this.un;
    const e = Lu(t);
    this.renderComplete_,
      (this.loaded_ = !0),
      (this.boundHandleBrowserEvent_ = this.handleBrowserEvent.bind(this)),
      (this.maxTilesLoading_ =
        t.maxTilesLoading !== void 0 ? t.maxTilesLoading : 16),
      (this.pixelRatio_ = t.pixelRatio !== void 0 ? t.pixelRatio : Gr),
      this.postRenderTimeoutHandle_,
      this.animationDelayKey_,
      (this.animationDelay_ = this.animationDelay_.bind(this)),
      (this.coordinateToPixelTransform_ = Mt()),
      (this.pixelToCoordinateTransform_ = Mt()),
      (this.frameIndex_ = 0),
      (this.frameState_ = null),
      (this.previousExtent_ = null),
      (this.viewPropertyListenerKey_ = null),
      (this.viewChangeListenerKey_ = null),
      (this.layerGroupPropertyListenerKeys_ = null),
      (this.viewport_ = document.createElement("div")),
      (this.viewport_.className =
        "ol-viewport" + ("ontouchstart" in window ? " ol-touch" : "")),
      (this.viewport_.style.position = "relative"),
      (this.viewport_.style.overflow = "hidden"),
      (this.viewport_.style.width = "100%"),
      (this.viewport_.style.height = "100%"),
      (this.overlayContainer_ = document.createElement("div")),
      (this.overlayContainer_.style.position = "absolute"),
      (this.overlayContainer_.style.zIndex = "0"),
      (this.overlayContainer_.style.width = "100%"),
      (this.overlayContainer_.style.height = "100%"),
      (this.overlayContainer_.style.pointerEvents = "none"),
      (this.overlayContainer_.className = "ol-overlaycontainer"),
      this.viewport_.appendChild(this.overlayContainer_),
      (this.overlayContainerStopEvent_ = document.createElement("div")),
      (this.overlayContainerStopEvent_.style.position = "absolute"),
      (this.overlayContainerStopEvent_.style.zIndex = "0"),
      (this.overlayContainerStopEvent_.style.width = "100%"),
      (this.overlayContainerStopEvent_.style.height = "100%"),
      (this.overlayContainerStopEvent_.style.pointerEvents = "none"),
      (this.overlayContainerStopEvent_.className =
        "ol-overlaycontainer-stopevent"),
      this.viewport_.appendChild(this.overlayContainerStopEvent_),
      (this.mapBrowserEventHandler_ = null),
      (this.moveTolerance_ = t.moveTolerance),
      (this.keyboardEventTarget_ = e.keyboardEventTarget),
      (this.targetChangeHandlerKeys_ = null),
      (this.targetElement_ = null),
      (this.resizeObserver_ = new ResizeObserver(() => this.updateSize())),
      (this.controls = e.controls || Uc()),
      (this.interactions = e.interactions || wu({ onFocusOnly: !0 })),
      (this.overlays_ = e.overlays),
      (this.overlayIdIndex_ = {}),
      (this.renderer_ = null),
      (this.postRenderFunctions_ = []),
      (this.tileQueue_ = new Gc(
        this.getTilePriority.bind(this),
        this.handleTileChange_.bind(this)
      )),
      this.addChangeListener(st.LAYERGROUP, this.handleLayerGroupChanged_),
      this.addChangeListener(st.VIEW, this.handleViewChanged_),
      this.addChangeListener(st.SIZE, this.handleSizeChanged_),
      this.addChangeListener(st.TARGET, this.handleTargetChanged_),
      this.setProperties(e.values);
    const i = this;
    t.view &&
      !(t.view instanceof wt) &&
      t.view.then(function (n) {
        i.setView(new wt(n));
      }),
      this.controls.addEventListener(ut.ADD, (n) => {
        n.element.setMap(this);
      }),
      this.controls.addEventListener(ut.REMOVE, (n) => {
        n.element.setMap(null);
      }),
      this.interactions.addEventListener(ut.ADD, (n) => {
        n.element.setMap(this);
      }),
      this.interactions.addEventListener(ut.REMOVE, (n) => {
        n.element.setMap(null);
      }),
      this.overlays_.addEventListener(ut.ADD, (n) => {
        this.addOverlayInternal_(n.element);
      }),
      this.overlays_.addEventListener(ut.REMOVE, (n) => {
        const r = n.element.getId();
        r !== void 0 && delete this.overlayIdIndex_[r.toString()],
          n.element.setMap(null);
      }),
      this.controls.forEach((n) => {
        n.setMap(this);
      }),
      this.interactions.forEach((n) => {
        n.setMap(this);
      }),
      this.overlays_.forEach(this.addOverlayInternal_.bind(this));
  }
  addControl(t) {
    this.getControls().push(t);
  }
  addInteraction(t) {
    this.getInteractions().push(t);
  }
  addLayer(t) {
    this.getLayerGroup().getLayers().push(t);
  }
  handleLayerAdd_(t) {
    zo(t.layer, this);
  }
  addOverlay(t) {
    this.getOverlays().push(t);
  }
  addOverlayInternal_(t) {
    const e = t.getId();
    e !== void 0 && (this.overlayIdIndex_[e.toString()] = t), t.setMap(this);
  }
  disposeInternal() {
    this.controls.clear(),
      this.interactions.clear(),
      this.overlays_.clear(),
      this.resizeObserver_.disconnect(),
      this.setTarget(null),
      super.disposeInternal();
  }
  forEachFeatureAtPixel(t, e, i) {
    if (!this.frameState_ || !this.renderer_) return;
    const n = this.getCoordinateFromPixelInternal(t);
    i = i !== void 0 ? i : {};
    const r = i.hitTolerance !== void 0 ? i.hitTolerance : 0,
      o = i.layerFilter !== void 0 ? i.layerFilter : ni,
      a = i.checkWrapped !== !1;
    return this.renderer_.forEachFeatureAtCoordinate(
      n,
      this.frameState_,
      r,
      a,
      e,
      null,
      o,
      null
    );
  }
  getFeaturesAtPixel(t, e) {
    const i = [];
    return (
      this.forEachFeatureAtPixel(
        t,
        function (n) {
          i.push(n);
        },
        e
      ),
      i
    );
  }
  getAllLayers() {
    const t = [];
    function e(i) {
      i.forEach(function (n) {
        n instanceof _n ? e(n.getLayers()) : t.push(n);
      });
    }
    return e(this.getLayers()), t;
  }
  hasFeatureAtPixel(t, e) {
    if (!this.frameState_ || !this.renderer_) return !1;
    const i = this.getCoordinateFromPixelInternal(t);
    e = e !== void 0 ? e : {};
    const n = e.layerFilter !== void 0 ? e.layerFilter : ni,
      r = e.hitTolerance !== void 0 ? e.hitTolerance : 0,
      o = e.checkWrapped !== !1;
    return this.renderer_.hasFeatureAtCoordinate(
      i,
      this.frameState_,
      r,
      o,
      n,
      null
    );
  }
  getEventCoordinate(t) {
    return this.getCoordinateFromPixel(this.getEventPixel(t));
  }
  getEventCoordinateInternal(t) {
    return this.getCoordinateFromPixelInternal(this.getEventPixel(t));
  }
  getEventPixel(t) {
    const i = this.viewport_.getBoundingClientRect(),
      n = this.getSize(),
      r = i.width / n[0],
      o = i.height / n[1],
      a = "changedTouches" in t ? t.changedTouches[0] : t;
    return [(a.clientX - i.left) / r, (a.clientY - i.top) / o];
  }
  getTarget() {
    return this.get(st.TARGET);
  }
  getTargetElement() {
    return this.targetElement_;
  }
  getCoordinateFromPixel(t) {
    return Zn(
      this.getCoordinateFromPixelInternal(t),
      this.getView().getProjection()
    );
  }
  getCoordinateFromPixelInternal(t) {
    const e = this.frameState_;
    return e ? it(e.pixelToCoordinateTransform, t.slice()) : null;
  }
  getControls() {
    return this.controls;
  }
  getOverlays() {
    return this.overlays_;
  }
  getOverlayById(t) {
    const e = this.overlayIdIndex_[t.toString()];
    return e !== void 0 ? e : null;
  }
  getInteractions() {
    return this.interactions;
  }
  getLayerGroup() {
    return this.get(st.LAYERGROUP);
  }
  setLayers(t) {
    const e = this.getLayerGroup();
    if (t instanceof At) {
      e.setLayers(t);
      return;
    }
    const i = e.getLayers();
    i.clear(), i.extend(t);
  }
  getLayers() {
    return this.getLayerGroup().getLayers();
  }
  getLoadingOrNotReady() {
    const t = this.getLayerGroup().getLayerStatesArray();
    for (let e = 0, i = t.length; e < i; ++e) {
      const n = t[e];
      if (!n.visible) continue;
      const r = n.layer.getRenderer();
      if (r && !r.ready) return !0;
      const o = n.layer.getSource();
      if (o && o.loading) return !0;
    }
    return !1;
  }
  getPixelFromCoordinate(t) {
    const e = Xt(t, this.getView().getProjection());
    return this.getPixelFromCoordinateInternal(e);
  }
  getPixelFromCoordinateInternal(t) {
    const e = this.frameState_;
    return e ? it(e.coordinateToPixelTransform, t.slice(0, 2)) : null;
  }
  getRenderer() {
    return this.renderer_;
  }
  getSize() {
    return this.get(st.SIZE);
  }
  getView() {
    return this.get(st.VIEW);
  }
  getViewport() {
    return this.viewport_;
  }
  getOverlayContainer() {
    return this.overlayContainer_;
  }
  getOverlayContainerStopEvent() {
    return this.overlayContainerStopEvent_;
  }
  getOwnerDocument() {
    const t = this.getTargetElement();
    return t ? t.ownerDocument : document;
  }
  getTilePriority(t, e, i, n) {
    return Xc(this.frameState_, t, e, i, n);
  }
  handleBrowserEvent(t, e) {
    e = e || t.type;
    const i = new Qt(e, this, t);
    this.handleMapBrowserEvent(i);
  }
  handleMapBrowserEvent(t) {
    if (!this.frameState_) return;
    const e = t.originalEvent,
      i = e.type;
    if (i === $n.POINTERDOWN || i === F.WHEEL || i === F.KEYDOWN) {
      const n = this.getOwnerDocument(),
        r = this.viewport_.getRootNode ? this.viewport_.getRootNode() : n,
        o = e.target;
      if (
        this.overlayContainerStopEvent_.contains(o) ||
        !(r === n ? n.documentElement : r).contains(o)
      )
        return;
    }
    if (((t.frameState = this.frameState_), this.dispatchEvent(t) !== !1)) {
      const n = this.getInteractions().getArray().slice();
      for (let r = n.length - 1; r >= 0; r--) {
        const o = n[r];
        if (o.getMap() !== this || !o.getActive() || !this.getTargetElement())
          continue;
        if (!o.handleEvent(t) || t.propagationStopped) break;
      }
    }
  }
  handlePostRender() {
    const t = this.frameState_,
      e = this.tileQueue_;
    if (!e.isEmpty()) {
      let n = this.maxTilesLoading_,
        r = n;
      if (t) {
        const o = t.viewHints;
        if (o[rt.ANIMATING] || o[rt.INTERACTING]) {
          const a = Date.now() - t.time > 8;
          (n = a ? 0 : 8), (r = a ? 0 : 2);
        }
      }
      e.getTilesLoading() < n && (e.reprioritize(), e.loadMoreTiles(n, r));
    }
    t &&
      this.renderer_ &&
      !t.animate &&
      (this.renderComplete_ === !0
        ? (this.hasListener(ne.RENDERCOMPLETE) &&
            this.renderer_.dispatchRenderEvent(ne.RENDERCOMPLETE, t),
          this.loaded_ === !1 &&
            ((this.loaded_ = !0),
            this.dispatchEvent(new be(te.LOADEND, this, t))))
        : this.loaded_ === !0 &&
          ((this.loaded_ = !1),
          this.dispatchEvent(new be(te.LOADSTART, this, t))));
    const i = this.postRenderFunctions_;
    for (let n = 0, r = i.length; n < r; ++n) i[n](this, t);
    i.length = 0;
  }
  handleSizeChanged_() {
    this.getView() &&
      !this.getView().getAnimating() &&
      this.getView().resolveConstraints(0),
      this.render();
  }
  handleTargetChanged_() {
    if (this.mapBrowserEventHandler_) {
      for (let i = 0, n = this.targetChangeHandlerKeys_.length; i < n; ++i)
        j(this.targetChangeHandlerKeys_[i]);
      (this.targetChangeHandlerKeys_ = null),
        this.viewport_.removeEventListener(
          F.CONTEXTMENU,
          this.boundHandleBrowserEvent_
        ),
        this.viewport_.removeEventListener(
          F.WHEEL,
          this.boundHandleBrowserEvent_
        ),
        this.mapBrowserEventHandler_.dispose(),
        (this.mapBrowserEventHandler_ = null),
        Kn(this.viewport_);
    }
    if (this.targetElement_) {
      this.resizeObserver_.unobserve(this.targetElement_);
      const i = this.targetElement_.getRootNode();
      i instanceof ShadowRoot && this.resizeObserver_.unobserve(i.host);
    }
    const t = this.getTarget(),
      e = typeof t == "string" ? document.getElementById(t) : t;
    if (((this.targetElement_ = e), !e))
      this.renderer_ &&
        (clearTimeout(this.postRenderTimeoutHandle_),
        (this.postRenderTimeoutHandle_ = void 0),
        (this.postRenderFunctions_.length = 0),
        this.renderer_.dispose(),
        (this.renderer_ = null)),
        this.animationDelayKey_ &&
          (cancelAnimationFrame(this.animationDelayKey_),
          (this.animationDelayKey_ = void 0));
    else {
      e.appendChild(this.viewport_),
        this.renderer_ || (this.renderer_ = new Mc(this)),
        (this.mapBrowserEventHandler_ = new Dc(this, this.moveTolerance_));
      for (const r in H)
        this.mapBrowserEventHandler_.addEventListener(
          H[r],
          this.handleMapBrowserEvent.bind(this)
        );
      this.viewport_.addEventListener(
        F.CONTEXTMENU,
        this.boundHandleBrowserEvent_,
        !1
      ),
        this.viewport_.addEventListener(
          F.WHEEL,
          this.boundHandleBrowserEvent_,
          Xr ? { passive: !1 } : !1
        );
      const i = this.keyboardEventTarget_ ? this.keyboardEventTarget_ : e;
      this.targetChangeHandlerKeys_ = [
        W(i, F.KEYDOWN, this.handleBrowserEvent, this),
        W(i, F.KEYPRESS, this.handleBrowserEvent, this),
      ];
      const n = e.getRootNode();
      n instanceof ShadowRoot && this.resizeObserver_.observe(n.host),
        this.resizeObserver_.observe(e);
    }
    this.updateSize();
  }
  handleTileChange_() {
    this.render();
  }
  handleViewPropertyChanged_() {
    this.render();
  }
  handleViewChanged_() {
    this.viewPropertyListenerKey_ &&
      (j(this.viewPropertyListenerKey_),
      (this.viewPropertyListenerKey_ = null)),
      this.viewChangeListenerKey_ &&
        (j(this.viewChangeListenerKey_), (this.viewChangeListenerKey_ = null));
    const t = this.getView();
    t &&
      (this.updateViewportSize_(),
      (this.viewPropertyListenerKey_ = W(
        t,
        We.PROPERTYCHANGE,
        this.handleViewPropertyChanged_,
        this
      )),
      (this.viewChangeListenerKey_ = W(
        t,
        F.CHANGE,
        this.handleViewPropertyChanged_,
        this
      )),
      t.resolveConstraints(0)),
      this.render();
  }
  handleLayerGroupChanged_() {
    this.layerGroupPropertyListenerKeys_ &&
      (this.layerGroupPropertyListenerKeys_.forEach(j),
      (this.layerGroupPropertyListenerKeys_ = null));
    const t = this.getLayerGroup();
    t &&
      (this.handleLayerAdd_(new ee("addlayer", t)),
      (this.layerGroupPropertyListenerKeys_ = [
        W(t, We.PROPERTYCHANGE, this.render, this),
        W(t, F.CHANGE, this.render, this),
        W(t, "addlayer", this.handleLayerAdd_, this),
        W(t, "removelayer", this.handleLayerRemove_, this),
      ])),
      this.render();
  }
  isRendered() {
    return !!this.frameState_;
  }
  animationDelay_() {
    (this.animationDelayKey_ = void 0), this.renderFrame_(Date.now());
  }
  renderSync() {
    this.animationDelayKey_ && cancelAnimationFrame(this.animationDelayKey_),
      this.animationDelay_();
  }
  redrawText() {
    const t = this.getLayerGroup().getLayerStatesArray();
    for (let e = 0, i = t.length; e < i; ++e) {
      const n = t[e].layer;
      n.hasRenderer() && n.getRenderer().handleFontsChanged();
    }
  }
  render() {
    this.renderer_ &&
      this.animationDelayKey_ === void 0 &&
      (this.animationDelayKey_ = requestAnimationFrame(this.animationDelay_));
  }
  removeControl(t) {
    return this.getControls().remove(t);
  }
  removeInteraction(t) {
    return this.getInteractions().remove(t);
  }
  removeLayer(t) {
    return this.getLayerGroup().getLayers().remove(t);
  }
  handleLayerRemove_(t) {
    Wo(t.layer);
  }
  removeOverlay(t) {
    return this.getOverlays().remove(t);
  }
  renderFrame_(t) {
    const e = this.getSize(),
      i = this.getView(),
      n = this.frameState_;
    let r = null;
    if (e !== void 0 && fr(e) && i && i.isDef()) {
      const o = i.getHints(
          this.frameState_ ? this.frameState_.viewHints : void 0
        ),
        a = i.getState();
      if (
        ((r = {
          animate: !1,
          coordinateToPixelTransform: this.coordinateToPixelTransform_,
          declutterTree: null,
          extent: Wn(a.center, a.resolution, a.rotation, e),
          index: this.frameIndex_++,
          layerIndex: 0,
          layerStatesArray: this.getLayerGroup().getLayerStatesArray(),
          pixelRatio: this.pixelRatio_,
          pixelToCoordinateTransform: this.pixelToCoordinateTransform_,
          postRenderFunctions: [],
          size: e,
          tileQueue: this.tileQueue_,
          time: t,
          usedTiles: {},
          viewState: a,
          viewHints: o,
          wantedTiles: {},
          mapId: z(this),
          renderTargets: {},
        }),
        a.nextCenter && a.nextResolution)
      ) {
        const l = isNaN(a.nextRotation) ? a.rotation : a.nextRotation;
        r.nextExtent = Wn(a.nextCenter, a.nextResolution, l, e);
      }
    }
    (this.frameState_ = r),
      this.renderer_.renderFrame(r),
      r &&
        (r.animate && this.render(),
        Array.prototype.push.apply(
          this.postRenderFunctions_,
          r.postRenderFunctions
        ),
        n &&
          (!this.previousExtent_ ||
            (!ss(this.previousExtent_) &&
              !ri(r.extent, this.previousExtent_))) &&
          (this.dispatchEvent(new be(te.MOVESTART, this, n)),
          (this.previousExtent_ = an(this.previousExtent_))),
        this.previousExtent_ &&
          !r.viewHints[rt.ANIMATING] &&
          !r.viewHints[rt.INTERACTING] &&
          !ri(r.extent, this.previousExtent_) &&
          (this.dispatchEvent(new be(te.MOVEEND, this, r)),
          zr(r.extent, this.previousExtent_))),
      this.dispatchEvent(new be(te.POSTRENDER, this, r)),
      (this.renderComplete_ =
        this.hasListener(te.LOADSTART) ||
        this.hasListener(te.LOADEND) ||
        this.hasListener(ne.RENDERCOMPLETE)
          ? !this.tileQueue_.getTilesLoading() &&
            !this.tileQueue_.getCount() &&
            !this.getLoadingOrNotReady()
          : void 0),
      this.postRenderTimeoutHandle_ ||
        (this.postRenderTimeoutHandle_ = setTimeout(() => {
          (this.postRenderTimeoutHandle_ = void 0), this.handlePostRender();
        }, 0));
  }
  setLayerGroup(t) {
    const e = this.getLayerGroup();
    e && this.handleLayerRemove_(new ee("removelayer", e)),
      this.set(st.LAYERGROUP, t);
  }
  setSize(t) {
    this.set(st.SIZE, t);
  }
  setTarget(t) {
    this.set(st.TARGET, t);
  }
  setView(t) {
    if (!t || t instanceof wt) {
      this.set(st.VIEW, t);
      return;
    }
    this.set(st.VIEW, new wt());
    const e = this;
    t.then(function (i) {
      e.setView(new wt(i));
    });
  }
  updateSize() {
    const t = this.getTargetElement();
    let e;
    if (t) {
      const n = getComputedStyle(t),
        r =
          t.offsetWidth -
          parseFloat(n.borderLeftWidth) -
          parseFloat(n.paddingLeft) -
          parseFloat(n.paddingRight) -
          parseFloat(n.borderRightWidth),
        o =
          t.offsetHeight -
          parseFloat(n.borderTopWidth) -
          parseFloat(n.paddingTop) -
          parseFloat(n.paddingBottom) -
          parseFloat(n.borderBottomWidth);
      !isNaN(r) &&
        !isNaN(o) &&
        ((e = [r, o]),
        !fr(e) &&
          !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length) &&
          $r(
            "No map visible because the map container's width or height are 0."
          ));
    }
    const i = this.getSize();
    e && (!i || !oe(e, i)) && (this.setSize(e), this.updateViewportSize_());
  }
  updateViewportSize_() {
    const t = this.getView();
    if (t) {
      let e;
      const i = getComputedStyle(this.viewport_);
      i.width &&
        i.height &&
        (e = [parseInt(i.width, 10), parseInt(i.height, 10)]),
        t.setViewportSize(e);
    }
  }
}
function Lu(s) {
  let t = null;
  s.keyboardEventTarget !== void 0 &&
    (t =
      typeof s.keyboardEventTarget == "string"
        ? document.getElementById(s.keyboardEventTarget)
        : s.keyboardEventTarget);
  const e = {},
    i =
      s.layers && typeof s.layers.getLayers == "function"
        ? s.layers
        : new _n({ layers: s.layers });
  (e[st.LAYERGROUP] = i),
    (e[st.TARGET] = s.target),
    (e[st.VIEW] = s.view instanceof wt ? s.view : new wt());
  let n;
  s.controls !== void 0 &&
    (Array.isArray(s.controls)
      ? (n = new At(s.controls.slice()))
      : (G(typeof s.controls.getArray == "function", 47), (n = s.controls)));
  let r;
  s.interactions !== void 0 &&
    (Array.isArray(s.interactions)
      ? (r = new At(s.interactions.slice()))
      : (G(typeof s.interactions.getArray == "function", 48),
        (r = s.interactions)));
  let o;
  return (
    s.overlays !== void 0
      ? Array.isArray(s.overlays)
        ? (o = new At(s.overlays.slice()))
        : (G(typeof s.overlays.getArray == "function", 49), (o = s.overlays))
      : (o = new At()),
    {
      controls: n,
      interactions: r,
      keyboardEventTarget: t,
      overlays: o,
      values: e,
    }
  );
}
const Au = vu;
class Mu {
  constructor(t) {
    (this.rbush_ = new Io(t)), (this.items_ = {});
  }
  insert(t, e) {
    const i = { minX: t[0], minY: t[1], maxX: t[2], maxY: t[3], value: e };
    this.rbush_.insert(i), (this.items_[z(e)] = i);
  }
  load(t, e) {
    const i = new Array(e.length);
    for (let n = 0, r = e.length; n < r; n++) {
      const o = t[n],
        a = e[n],
        l = { minX: o[0], minY: o[1], maxX: o[2], maxY: o[3], value: a };
      (i[n] = l), (this.items_[z(a)] = l);
    }
    this.rbush_.load(i);
  }
  remove(t) {
    const e = z(t),
      i = this.items_[e];
    return delete this.items_[e], this.rbush_.remove(i) !== null;
  }
  update(t, e) {
    const i = this.items_[z(e)],
      n = [i.minX, i.minY, i.maxX, i.maxY];
    ri(n, t) || (this.remove(e), this.insert(t, e));
  }
  getAll() {
    return this.rbush_.all().map(function (e) {
      return e.value;
    });
  }
  getInExtent(t) {
    const e = { minX: t[0], minY: t[1], maxX: t[2], maxY: t[3] };
    return this.rbush_.search(e).map(function (n) {
      return n.value;
    });
  }
  forEach(t) {
    return this.forEach_(this.getAll(), t);
  }
  forEachInExtent(t, e) {
    return this.forEach_(this.getInExtent(t), e);
  }
  forEach_(t, e) {
    let i;
    for (let n = 0, r = t.length; n < r; n++) if (((i = e(t[n])), i)) return i;
    return i;
  }
  isEmpty() {
    return si(this.items_);
  }
  clear() {
    this.rbush_.clear(), (this.items_ = {});
  }
  getExtent(t) {
    const e = this.rbush_.toJSON();
    return Yt(e.minX, e.minY, e.maxX, e.maxY, t);
  }
  concat(t) {
    this.rbush_.load(t.rbush_.all());
    for (const e in t.items_) this.items_[e] = t.items_[e];
  }
}
const Or = Mu;
class Ou extends bt {
  constructor(t) {
    super(),
      (this.projection = It(t.projection)),
      (this.attributions_ = br(t.attributions)),
      (this.attributionsCollapsible_ =
        t.attributionsCollapsible !== void 0 ? t.attributionsCollapsible : !0),
      (this.loading = !1),
      (this.state_ = t.state !== void 0 ? t.state : "ready"),
      (this.wrapX_ = t.wrapX !== void 0 ? t.wrapX : !1),
      (this.interpolate_ = !!t.interpolate),
      (this.viewResolver = null),
      (this.viewRejector = null);
    const e = this;
    this.viewPromise_ = new Promise(function (i, n) {
      (e.viewResolver = i), (e.viewRejector = n);
    });
  }
  getAttributions() {
    return this.attributions_;
  }
  getAttributionsCollapsible() {
    return this.attributionsCollapsible_;
  }
  getProjection() {
    return this.projection;
  }
  getResolutions(t) {
    return null;
  }
  getView() {
    return this.viewPromise_;
  }
  getState() {
    return this.state_;
  }
  getWrapX() {
    return this.wrapX_;
  }
  getInterpolate() {
    return this.interpolate_;
  }
  refresh() {
    this.changed();
  }
  setAttributions(t) {
    (this.attributions_ = br(t)), this.changed();
  }
  setState(t) {
    (this.state_ = t), this.changed();
  }
}
function br(s) {
  return s
    ? Array.isArray(s)
      ? function (t) {
          return s;
        }
      : typeof s == "function"
      ? s
      : function (t) {
          return [s];
        }
    : null;
}
const Yo = Ou,
  Ct = {
    ADDFEATURE: "addfeature",
    CHANGEFEATURE: "changefeature",
    CLEAR: "clear",
    REMOVEFEATURE: "removefeature",
    FEATURESLOADSTART: "featuresloadstart",
    FEATURESLOADEND: "featuresloadend",
    FEATURESLOADERROR: "featuresloaderror",
  };
function bu(s, t) {
  return [[-1 / 0, -1 / 0, 1 / 0, 1 / 0]];
}
let Pu = !1;
function Du(s, t, e, i, n, r, o) {
  const a = new XMLHttpRequest();
  a.open("GET", typeof s == "function" ? s(e, i, n) : s, !0),
    t.getType() == "arraybuffer" && (a.responseType = "arraybuffer"),
    (a.withCredentials = Pu),
    (a.onload = function (l) {
      if (!a.status || (a.status >= 200 && a.status < 300)) {
        const h = t.getType();
        let c;
        h == "json" || h == "text"
          ? (c = a.responseText)
          : h == "xml"
          ? ((c = a.responseXML),
            c ||
              (c = new DOMParser().parseFromString(
                a.responseText,
                "application/xml"
              )))
          : h == "arraybuffer" && (c = a.response),
          c
            ? r(
                t.readFeatures(c, { extent: e, featureProjection: n }),
                t.readProjection(c)
              )
            : o();
      } else o();
    }),
    (a.onerror = o),
    a.send();
}
function Pr(s, t) {
  return function (e, i, n, r, o) {
    const a = this;
    Du(
      s,
      t,
      e,
      i,
      n,
      function (l, h) {
        a.addFeatures(l), r !== void 0 && r(l);
      },
      o || Ye
    );
  };
}
class qt extends Bt {
  constructor(t, e, i) {
    super(t), (this.feature = e), (this.features = i);
  }
}
class Fu extends Yo {
  constructor(t) {
    (t = t || {}),
      super({
        attributions: t.attributions,
        interpolate: !0,
        projection: void 0,
        state: "ready",
        wrapX: t.wrapX !== void 0 ? t.wrapX : !0,
      }),
      this.on,
      this.once,
      this.un,
      (this.loader_ = Ye),
      (this.format_ = t.format),
      (this.overlaps_ = t.overlaps === void 0 ? !0 : t.overlaps),
      (this.url_ = t.url),
      t.loader !== void 0
        ? (this.loader_ = t.loader)
        : this.url_ !== void 0 &&
          (G(this.format_, 7), (this.loader_ = Pr(this.url_, this.format_))),
      (this.strategy_ = t.strategy !== void 0 ? t.strategy : bu);
    const e = t.useSpatialIndex !== void 0 ? t.useSpatialIndex : !0;
    (this.featuresRtree_ = e ? new Or() : null),
      (this.loadedExtentsRtree_ = new Or()),
      (this.loadingExtentsCount_ = 0),
      (this.nullGeometryFeatures_ = {}),
      (this.idIndex_ = {}),
      (this.uidIndex_ = {}),
      (this.featureChangeKeys_ = {}),
      (this.featuresCollection_ = null);
    let i, n;
    Array.isArray(t.features)
      ? (n = t.features)
      : t.features && ((i = t.features), (n = i.getArray())),
      !e && i === void 0 && (i = new At(n)),
      n !== void 0 && this.addFeaturesInternal(n),
      i !== void 0 && this.bindFeaturesCollection_(i);
  }
  addFeature(t) {
    this.addFeatureInternal(t), this.changed();
  }
  addFeatureInternal(t) {
    const e = z(t);
    if (!this.addToIndex_(e, t)) {
      this.featuresCollection_ && this.featuresCollection_.remove(t);
      return;
    }
    this.setupChangeEvents_(e, t);
    const i = t.getGeometry();
    if (i) {
      const n = i.getExtent();
      this.featuresRtree_ && this.featuresRtree_.insert(n, t);
    } else this.nullGeometryFeatures_[e] = t;
    this.dispatchEvent(new qt(Ct.ADDFEATURE, t));
  }
  setupChangeEvents_(t, e) {
    this.featureChangeKeys_[t] = [
      W(e, F.CHANGE, this.handleFeatureChange_, this),
      W(e, We.PROPERTYCHANGE, this.handleFeatureChange_, this),
    ];
  }
  addToIndex_(t, e) {
    let i = !0;
    const n = e.getId();
    return (
      n !== void 0 &&
        (n.toString() in this.idIndex_
          ? (i = !1)
          : (this.idIndex_[n.toString()] = e)),
      i && (G(!(t in this.uidIndex_), 30), (this.uidIndex_[t] = e)),
      i
    );
  }
  addFeatures(t) {
    this.addFeaturesInternal(t), this.changed();
  }
  addFeaturesInternal(t) {
    const e = [],
      i = [],
      n = [];
    for (let r = 0, o = t.length; r < o; r++) {
      const a = t[r],
        l = z(a);
      this.addToIndex_(l, a) && i.push(a);
    }
    for (let r = 0, o = i.length; r < o; r++) {
      const a = i[r],
        l = z(a);
      this.setupChangeEvents_(l, a);
      const h = a.getGeometry();
      if (h) {
        const c = h.getExtent();
        e.push(c), n.push(a);
      } else this.nullGeometryFeatures_[l] = a;
    }
    if (
      (this.featuresRtree_ && this.featuresRtree_.load(e, n),
      this.hasListener(Ct.ADDFEATURE))
    )
      for (let r = 0, o = i.length; r < o; r++)
        this.dispatchEvent(new qt(Ct.ADDFEATURE, i[r]));
  }
  bindFeaturesCollection_(t) {
    let e = !1;
    this.addEventListener(Ct.ADDFEATURE, function (i) {
      e || ((e = !0), t.push(i.feature), (e = !1));
    }),
      this.addEventListener(Ct.REMOVEFEATURE, function (i) {
        e || ((e = !0), t.remove(i.feature), (e = !1));
      }),
      t.addEventListener(ut.ADD, (i) => {
        e || ((e = !0), this.addFeature(i.element), (e = !1));
      }),
      t.addEventListener(ut.REMOVE, (i) => {
        e || ((e = !0), this.removeFeature(i.element), (e = !1));
      }),
      (this.featuresCollection_ = t);
  }
  clear(t) {
    if (t) {
      for (const i in this.featureChangeKeys_)
        this.featureChangeKeys_[i].forEach(j);
      this.featuresCollection_ ||
        ((this.featureChangeKeys_ = {}),
        (this.idIndex_ = {}),
        (this.uidIndex_ = {}));
    } else if (this.featuresRtree_) {
      const i = (n) => {
        this.removeFeatureInternal(n);
      };
      this.featuresRtree_.forEach(i);
      for (const n in this.nullGeometryFeatures_)
        this.removeFeatureInternal(this.nullGeometryFeatures_[n]);
    }
    this.featuresCollection_ && this.featuresCollection_.clear(),
      this.featuresRtree_ && this.featuresRtree_.clear(),
      (this.nullGeometryFeatures_ = {});
    const e = new qt(Ct.CLEAR);
    this.dispatchEvent(e), this.changed();
  }
  forEachFeature(t) {
    if (this.featuresRtree_) return this.featuresRtree_.forEach(t);
    this.featuresCollection_ && this.featuresCollection_.forEach(t);
  }
  forEachFeatureAtCoordinateDirect(t, e) {
    const i = [t[0], t[1], t[0], t[1]];
    return this.forEachFeatureInExtent(i, function (n) {
      if (n.getGeometry().intersectsCoordinate(t)) return e(n);
    });
  }
  forEachFeatureInExtent(t, e) {
    if (this.featuresRtree_) return this.featuresRtree_.forEachInExtent(t, e);
    this.featuresCollection_ && this.featuresCollection_.forEach(e);
  }
  forEachFeatureIntersectingExtent(t, e) {
    return this.forEachFeatureInExtent(t, function (i) {
      if (i.getGeometry().intersectsExtent(t)) {
        const r = e(i);
        if (r) return r;
      }
    });
  }
  getFeaturesCollection() {
    return this.featuresCollection_;
  }
  getFeatures() {
    let t;
    return (
      this.featuresCollection_
        ? (t = this.featuresCollection_.getArray().slice(0))
        : this.featuresRtree_ &&
          ((t = this.featuresRtree_.getAll()),
          si(this.nullGeometryFeatures_) ||
            Fr(t, Object.values(this.nullGeometryFeatures_))),
      t
    );
  }
  getFeaturesAtCoordinate(t) {
    const e = [];
    return (
      this.forEachFeatureAtCoordinateDirect(t, function (i) {
        e.push(i);
      }),
      e
    );
  }
  getFeaturesInExtent(t, e) {
    if (this.featuresRtree_) {
      if (!(e && e.canWrapX() && this.getWrapX()))
        return this.featuresRtree_.getInExtent(t);
      const n = ka(t, e);
      return [].concat(...n.map((r) => this.featuresRtree_.getInExtent(r)));
    } else if (this.featuresCollection_)
      return this.featuresCollection_.getArray().slice(0);
    return [];
  }
  getClosestFeatureToCoordinate(t, e) {
    const i = t[0],
      n = t[1];
    let r = null;
    const o = [NaN, NaN];
    let a = 1 / 0;
    const l = [-1 / 0, -1 / 0, 1 / 0, 1 / 0];
    return (
      (e = e || ni),
      this.featuresRtree_.forEachInExtent(l, function (h) {
        if (e(h)) {
          const c = h.getGeometry(),
            u = a;
          if (((a = c.closestPointXY(i, n, o, a)), a < u)) {
            r = h;
            const d = Math.sqrt(a);
            (l[0] = i - d), (l[1] = n - d), (l[2] = i + d), (l[3] = n + d);
          }
        }
      }),
      r
    );
  }
  getExtent(t) {
    return this.featuresRtree_.getExtent(t);
  }
  getFeatureById(t) {
    const e = this.idIndex_[t.toString()];
    return e !== void 0 ? e : null;
  }
  getFeatureByUid(t) {
    const e = this.uidIndex_[t];
    return e !== void 0 ? e : null;
  }
  getFormat() {
    return this.format_;
  }
  getOverlaps() {
    return this.overlaps_;
  }
  getUrl() {
    return this.url_;
  }
  handleFeatureChange_(t) {
    const e = t.target,
      i = z(e),
      n = e.getGeometry();
    if (!n)
      i in this.nullGeometryFeatures_ ||
        (this.featuresRtree_ && this.featuresRtree_.remove(e),
        (this.nullGeometryFeatures_[i] = e));
    else {
      const o = n.getExtent();
      i in this.nullGeometryFeatures_
        ? (delete this.nullGeometryFeatures_[i],
          this.featuresRtree_ && this.featuresRtree_.insert(o, e))
        : this.featuresRtree_ && this.featuresRtree_.update(o, e);
    }
    const r = e.getId();
    if (r !== void 0) {
      const o = r.toString();
      this.idIndex_[o] !== e &&
        (this.removeFromIdIndex_(e), (this.idIndex_[o] = e));
    } else this.removeFromIdIndex_(e), (this.uidIndex_[i] = e);
    this.changed(), this.dispatchEvent(new qt(Ct.CHANGEFEATURE, e));
  }
  hasFeature(t) {
    const e = t.getId();
    return e !== void 0 ? e in this.idIndex_ : z(t) in this.uidIndex_;
  }
  isEmpty() {
    return this.featuresRtree_
      ? this.featuresRtree_.isEmpty() && si(this.nullGeometryFeatures_)
      : this.featuresCollection_
      ? this.featuresCollection_.getLength() === 0
      : !0;
  }
  loadFeatures(t, e, i) {
    const n = this.loadedExtentsRtree_,
      r = this.strategy_(t, e, i);
    for (let o = 0, a = r.length; o < a; ++o) {
      const l = r[o];
      n.forEachInExtent(l, function (c) {
        return Pe(c.extent, l);
      }) ||
        (++this.loadingExtentsCount_,
        this.dispatchEvent(new qt(Ct.FEATURESLOADSTART)),
        this.loader_.call(
          this,
          l,
          e,
          i,
          (c) => {
            --this.loadingExtentsCount_,
              this.dispatchEvent(new qt(Ct.FEATURESLOADEND, void 0, c));
          },
          () => {
            --this.loadingExtentsCount_,
              this.dispatchEvent(new qt(Ct.FEATURESLOADERROR));
          }
        ),
        n.insert(l, { extent: l.slice() }));
    }
    this.loading = this.loader_.length < 4 ? !1 : this.loadingExtentsCount_ > 0;
  }
  refresh() {
    this.clear(!0), this.loadedExtentsRtree_.clear(), super.refresh();
  }
  removeLoadedExtent(t) {
    const e = this.loadedExtentsRtree_;
    let i;
    e.forEachInExtent(t, function (n) {
      if (ri(n.extent, t)) return (i = n), !0;
    }),
      i && e.remove(i);
  }
  removeFeature(t) {
    if (!t) return;
    const e = z(t);
    e in this.nullGeometryFeatures_
      ? delete this.nullGeometryFeatures_[e]
      : this.featuresRtree_ && this.featuresRtree_.remove(t),
      this.removeFeatureInternal(t) && this.changed();
  }
  removeFeatureInternal(t) {
    const e = z(t),
      i = this.featureChangeKeys_[e];
    if (!i) return;
    i.forEach(j), delete this.featureChangeKeys_[e];
    const n = t.getId();
    return (
      n !== void 0 && delete this.idIndex_[n.toString()],
      delete this.uidIndex_[e],
      this.dispatchEvent(new qt(Ct.REMOVEFEATURE, t)),
      t
    );
  }
  removeFromIdIndex_(t) {
    let e = !1;
    for (const i in this.idIndex_)
      if (this.idIndex_[i] === t) {
        delete this.idIndex_[i], (e = !0);
        break;
      }
    return e;
  }
  setLoader(t) {
    this.loader_ = t;
  }
  setUrl(t) {
    G(this.format_, 7), (this.url_ = t), this.setLoader(Pr(t, this.format_));
  }
}
const ku = Fu;
class Nu {
  constructor(t) {
    (this.highWaterMark = t !== void 0 ? t : 2048),
      (this.count_ = 0),
      (this.entries_ = {}),
      (this.oldest_ = null),
      (this.newest_ = null);
  }
  canExpireCache() {
    return this.highWaterMark > 0 && this.getCount() > this.highWaterMark;
  }
  expireCache(t) {
    for (; this.canExpireCache(); ) this.pop();
  }
  clear() {
    (this.count_ = 0),
      (this.entries_ = {}),
      (this.oldest_ = null),
      (this.newest_ = null);
  }
  containsKey(t) {
    return this.entries_.hasOwnProperty(t);
  }
  forEach(t) {
    let e = this.oldest_;
    for (; e; ) t(e.value_, e.key_, this), (e = e.newer);
  }
  get(t, e) {
    const i = this.entries_[t];
    return (
      G(i !== void 0, 15),
      i === this.newest_ ||
        (i === this.oldest_
          ? ((this.oldest_ = this.oldest_.newer), (this.oldest_.older = null))
          : ((i.newer.older = i.older), (i.older.newer = i.newer)),
        (i.newer = null),
        (i.older = this.newest_),
        (this.newest_.newer = i),
        (this.newest_ = i)),
      i.value_
    );
  }
  remove(t) {
    const e = this.entries_[t];
    return (
      G(e !== void 0, 15),
      e === this.newest_
        ? ((this.newest_ = e.older),
          this.newest_ && (this.newest_.newer = null))
        : e === this.oldest_
        ? ((this.oldest_ = e.newer),
          this.oldest_ && (this.oldest_.older = null))
        : ((e.newer.older = e.older), (e.older.newer = e.newer)),
      delete this.entries_[t],
      --this.count_,
      e.value_
    );
  }
  getCount() {
    return this.count_;
  }
  getKeys() {
    const t = new Array(this.count_);
    let e = 0,
      i;
    for (i = this.newest_; i; i = i.older) t[e++] = i.key_;
    return t;
  }
  getValues() {
    const t = new Array(this.count_);
    let e = 0,
      i;
    for (i = this.newest_; i; i = i.older) t[e++] = i.value_;
    return t;
  }
  peekLast() {
    return this.oldest_.value_;
  }
  peekLastKey() {
    return this.oldest_.key_;
  }
  peekFirstKey() {
    return this.newest_.key_;
  }
  peek(t) {
    if (!!this.containsKey(t)) return this.entries_[t].value_;
  }
  pop() {
    const t = this.oldest_;
    return (
      delete this.entries_[t.key_],
      t.newer && (t.newer.older = null),
      (this.oldest_ = t.newer),
      this.oldest_ || (this.newest_ = null),
      --this.count_,
      t.value_
    );
  }
  replace(t, e) {
    this.get(t), (this.entries_[t].value_ = e);
  }
  set(t, e) {
    G(!(t in this.entries_), 16);
    const i = { key_: t, newer: null, older: this.newest_, value_: e };
    this.newest_ ? (this.newest_.newer = i) : (this.oldest_ = i),
      (this.newest_ = i),
      (this.entries_[t] = i),
      ++this.count_;
  }
  setSize(t) {
    this.highWaterMark = t;
  }
}
const Gu = Nu;
function Dr(s, t, e, i) {
  return i !== void 0 ? ((i[0] = s), (i[1] = t), (i[2] = e), i) : [s, t, e];
}
function mn(s, t, e) {
  return s + "/" + t + "/" + e;
}
function Bo(s) {
  return mn(s[0], s[1], s[2]);
}
function Xu(s) {
  return s.split("/").map(Number);
}
function Wu(s) {
  return (s[1] << s[0]) + s[2];
}
function zu(s, t) {
  const e = s[0],
    i = s[1],
    n = s[2];
  if (t.getMinZoom() > e || e > t.getMaxZoom()) return !1;
  const r = t.getFullTileRange(e);
  return r ? r.containsXY(i, n) : !0;
}
class Yu extends Gu {
  clear() {
    for (; this.getCount() > 0; ) this.pop().release();
    super.clear();
  }
  expireCache(t) {
    for (; this.canExpireCache() && !(this.peekLast().getKey() in t); )
      this.pop().release();
  }
  pruneExceptNewestZ() {
    if (this.getCount() === 0) return;
    const t = this.peekFirstKey(),
      i = Xu(t)[0];
    this.forEach((n) => {
      n.tileCoord[0] !== i && (this.remove(Bo(n.tileCoord)), n.release());
    });
  }
}
const Zo = Yu,
  Nn = {
    TILELOADSTART: "tileloadstart",
    TILELOADEND: "tileloadend",
    TILELOADERROR: "tileloaderror",
  },
  ve = [0, 0, 0],
  Jt = 5;
class Bu {
  constructor(t) {
    (this.minZoom = t.minZoom !== void 0 ? t.minZoom : 0),
      (this.resolutions_ = t.resolutions),
      G(
        ca(
          this.resolutions_,
          function (n, r) {
            return r - n;
          },
          !0
        ),
        17
      );
    let e;
    if (!t.origins) {
      for (let n = 0, r = this.resolutions_.length - 1; n < r; ++n)
        if (!e) e = this.resolutions_[n] / this.resolutions_[n + 1];
        else if (this.resolutions_[n] / this.resolutions_[n + 1] !== e) {
          e = void 0;
          break;
        }
    }
    (this.zoomFactor_ = e),
      (this.maxZoom = this.resolutions_.length - 1),
      (this.origin_ = t.origin !== void 0 ? t.origin : null),
      (this.origins_ = null),
      t.origins !== void 0 &&
        ((this.origins_ = t.origins),
        G(this.origins_.length == this.resolutions_.length, 20));
    const i = t.extent;
    i !== void 0 && !this.origin_ && !this.origins_ && (this.origin_ = me(i)),
      G(
        (!this.origin_ && this.origins_) || (this.origin_ && !this.origins_),
        18
      ),
      (this.tileSizes_ = null),
      t.tileSizes !== void 0 &&
        ((this.tileSizes_ = t.tileSizes),
        G(this.tileSizes_.length == this.resolutions_.length, 19)),
      (this.tileSize_ =
        t.tileSize !== void 0 ? t.tileSize : this.tileSizes_ ? null : ds),
      G(
        (!this.tileSize_ && this.tileSizes_) ||
          (this.tileSize_ && !this.tileSizes_),
        22
      ),
      (this.extent_ = i !== void 0 ? i : null),
      (this.fullTileRanges_ = null),
      (this.tmpSize_ = [0, 0]),
      (this.tmpExtent_ = [0, 0, 0, 0]),
      t.sizes !== void 0
        ? (this.fullTileRanges_ = t.sizes.map(function (n, r) {
            const o = new Ro(
              Math.min(0, n[0]),
              Math.max(n[0] - 1, -1),
              Math.min(0, n[1]),
              Math.max(n[1] - 1, -1)
            );
            if (i) {
              const a = this.getTileRangeForExtentAndZ(i, r);
              (o.minX = Math.max(a.minX, o.minX)),
                (o.maxX = Math.min(a.maxX, o.maxX)),
                (o.minY = Math.max(a.minY, o.minY)),
                (o.maxY = Math.min(a.maxY, o.maxY));
            }
            return o;
          }, this))
        : i && this.calculateTileRanges_(i);
  }
  forEachTileCoord(t, e, i) {
    const n = this.getTileRangeForExtentAndZ(t, e);
    for (let r = n.minX, o = n.maxX; r <= o; ++r)
      for (let a = n.minY, l = n.maxY; a <= l; ++a) i([e, r, a]);
  }
  forEachTileCoordParentTileRange(t, e, i, n) {
    let r,
      o,
      a,
      l = null,
      h = t[0] - 1;
    for (
      this.zoomFactor_ === 2
        ? ((o = t[1]), (a = t[2]))
        : (l = this.getTileCoordExtent(t, n));
      h >= this.minZoom;

    ) {
      if (
        (this.zoomFactor_ === 2
          ? ((o = Math.floor(o / 2)),
            (a = Math.floor(a / 2)),
            (r = Ie(o, o, a, a, i)))
          : (r = this.getTileRangeForExtentAndZ(l, h, i)),
        e(h, r))
      )
        return !0;
      --h;
    }
    return !1;
  }
  getExtent() {
    return this.extent_;
  }
  getMaxZoom() {
    return this.maxZoom;
  }
  getMinZoom() {
    return this.minZoom;
  }
  getOrigin(t) {
    return this.origin_ ? this.origin_ : this.origins_[t];
  }
  getResolution(t) {
    return this.resolutions_[t];
  }
  getResolutions() {
    return this.resolutions_;
  }
  getTileCoordChildTileRange(t, e, i) {
    if (t[0] < this.maxZoom) {
      if (this.zoomFactor_ === 2) {
        const r = t[1] * 2,
          o = t[2] * 2;
        return Ie(r, r + 1, o, o + 1, e);
      }
      const n = this.getTileCoordExtent(t, i || this.tmpExtent_);
      return this.getTileRangeForExtentAndZ(n, t[0] + 1, e);
    }
    return null;
  }
  getTileRangeForTileCoordAndZ(t, e, i) {
    if (e > this.maxZoom || e < this.minZoom) return null;
    const n = t[0],
      r = t[1],
      o = t[2];
    if (e === n) return Ie(r, o, r, o, i);
    if (this.zoomFactor_) {
      const l = Math.pow(this.zoomFactor_, e - n),
        h = Math.floor(r * l),
        c = Math.floor(o * l);
      if (e < n) return Ie(h, h, c, c, i);
      const u = Math.floor(l * (r + 1)) - 1,
        d = Math.floor(l * (o + 1)) - 1;
      return Ie(h, u, c, d, i);
    }
    const a = this.getTileCoordExtent(t, this.tmpExtent_);
    return this.getTileRangeForExtentAndZ(a, e, i);
  }
  getTileRangeExtent(t, e, i) {
    const n = this.getOrigin(t),
      r = this.getResolution(t),
      o = _t(this.getTileSize(t), this.tmpSize_),
      a = n[0] + e.minX * o[0] * r,
      l = n[0] + (e.maxX + 1) * o[0] * r,
      h = n[1] + e.minY * o[1] * r,
      c = n[1] + (e.maxY + 1) * o[1] * r;
    return Yt(a, h, l, c, i);
  }
  getTileRangeForExtentAndZ(t, e, i) {
    this.getTileCoordForXYAndZ_(t[0], t[3], e, !1, ve);
    const n = ve[1],
      r = ve[2];
    this.getTileCoordForXYAndZ_(t[2], t[1], e, !0, ve);
    const o = ve[1],
      a = ve[2];
    return Ie(n, o, r, a, i);
  }
  getTileCoordCenter(t) {
    const e = this.getOrigin(t[0]),
      i = this.getResolution(t[0]),
      n = _t(this.getTileSize(t[0]), this.tmpSize_);
    return [e[0] + (t[1] + 0.5) * n[0] * i, e[1] - (t[2] + 0.5) * n[1] * i];
  }
  getTileCoordExtent(t, e) {
    const i = this.getOrigin(t[0]),
      n = this.getResolution(t[0]),
      r = _t(this.getTileSize(t[0]), this.tmpSize_),
      o = i[0] + t[1] * r[0] * n,
      a = i[1] - (t[2] + 1) * r[1] * n,
      l = o + r[0] * n,
      h = a + r[1] * n;
    return Yt(o, a, l, h, e);
  }
  getTileCoordForCoordAndResolution(t, e, i) {
    return this.getTileCoordForXYAndResolution_(t[0], t[1], e, !1, i);
  }
  getTileCoordForXYAndResolution_(t, e, i, n, r) {
    const o = this.getZForResolution(i),
      a = i / this.getResolution(o),
      l = this.getOrigin(o),
      h = _t(this.getTileSize(o), this.tmpSize_);
    let c = (a * (t - l[0])) / i / h[0],
      u = (a * (l[1] - e)) / i / h[1];
    return (
      n
        ? ((c = Pi(c, Jt) - 1), (u = Pi(u, Jt) - 1))
        : ((c = bi(c, Jt)), (u = bi(u, Jt))),
      Dr(o, c, u, r)
    );
  }
  getTileCoordForXYAndZ_(t, e, i, n, r) {
    const o = this.getOrigin(i),
      a = this.getResolution(i),
      l = _t(this.getTileSize(i), this.tmpSize_);
    let h = (t - o[0]) / a / l[0],
      c = (o[1] - e) / a / l[1];
    return (
      n
        ? ((h = Pi(h, Jt) - 1), (c = Pi(c, Jt) - 1))
        : ((h = bi(h, Jt)), (c = bi(c, Jt))),
      Dr(i, h, c, r)
    );
  }
  getTileCoordForCoordAndZ(t, e, i) {
    return this.getTileCoordForXYAndZ_(t[0], t[1], e, !1, i);
  }
  getTileCoordResolution(t) {
    return this.resolutions_[t[0]];
  }
  getTileSize(t) {
    return this.tileSize_ ? this.tileSize_ : this.tileSizes_[t];
  }
  getFullTileRange(t) {
    return this.fullTileRanges_
      ? this.fullTileRanges_[t]
      : this.extent_
      ? this.getTileRangeForExtentAndZ(this.extent_, t)
      : null;
  }
  getZForResolution(t, e) {
    const i = Qn(this.resolutions_, t, e || 0);
    return J(i, this.minZoom, this.maxZoom);
  }
  tileCoordIntersectsViewport(t, e) {
    return lo(e, 0, e.length, 2, this.getTileCoordExtent(t));
  }
  calculateTileRanges_(t) {
    const e = this.resolutions_.length,
      i = new Array(e);
    for (let n = this.minZoom; n < e; ++n)
      i[n] = this.getTileRangeForExtentAndZ(t, n);
    this.fullTileRanges_ = i;
  }
}
const Ko = Bu;
function Vo(s) {
  let t = s.getDefaultTileGrid();
  return t || ((t = Uu(s)), s.setDefaultTileGrid(t)), t;
}
function Zu(s, t, e) {
  const i = t[0],
    n = s.getTileCoordCenter(t),
    r = Ms(e);
  if (!on(r, n)) {
    const o = U(r),
      a = Math.ceil((r[0] - n[0]) / o);
    return (n[0] += o * a), s.getTileCoordForCoordAndZ(n, i);
  }
  return t;
}
function Ku(s, t, e, i) {
  i = i !== void 0 ? i : "top-left";
  const n = Uo(s, t, e);
  return new Ko({ extent: s, origin: Pa(s, i), resolutions: n, tileSize: e });
}
function Vu(s) {
  const t = s || {},
    e = t.extent || It("EPSG:3857").getExtent(),
    i = {
      extent: e,
      minZoom: t.minZoom,
      tileSize: t.tileSize,
      resolutions: Uo(e, t.maxZoom, t.tileSize, t.maxResolution),
    };
  return new Ko(i);
}
function Uo(s, t, e, i) {
  (t = t !== void 0 ? t : vl), (e = _t(e !== void 0 ? e : ds));
  const n = Ot(s),
    r = U(s);
  i = i > 0 ? i : Math.max(r / e[0], n / e[1]);
  const o = t + 1,
    a = new Array(o);
  for (let l = 0; l < o; ++l) a[l] = i / Math.pow(2, l);
  return a;
}
function Uu(s, t, e, i) {
  const n = Ms(s);
  return Ku(n, t, e, i);
}
function Ms(s) {
  s = It(s);
  let t = s.getExtent();
  if (!t) {
    const e = (180 * oi.degrees) / s.getMetersPerUnit();
    t = Yt(-e, -e, e, e);
  }
  return t;
}
class ju extends Yo {
  constructor(t) {
    super({
      attributions: t.attributions,
      attributionsCollapsible: t.attributionsCollapsible,
      projection: t.projection,
      state: t.state,
      wrapX: t.wrapX,
      interpolate: t.interpolate,
    }),
      this.on,
      this.once,
      this.un,
      (this.opaque_ = t.opaque !== void 0 ? t.opaque : !1),
      (this.tilePixelRatio_ =
        t.tilePixelRatio !== void 0 ? t.tilePixelRatio : 1),
      (this.tileGrid = t.tileGrid !== void 0 ? t.tileGrid : null);
    const e = [256, 256];
    this.tileGrid &&
      _t(this.tileGrid.getTileSize(this.tileGrid.getMinZoom()), e),
      (this.tileCache = new Zo(t.cacheSize || 0)),
      (this.tmpSize = [0, 0]),
      (this.key_ = t.key || ""),
      (this.tileOptions = {
        transition: t.transition,
        interpolate: t.interpolate,
      }),
      (this.zDirection = t.zDirection ? t.zDirection : 0);
  }
  canExpireCache() {
    return this.tileCache.canExpireCache();
  }
  expireCache(t, e) {
    const i = this.getTileCacheForProjection(t);
    i && i.expireCache(e);
  }
  forEachLoadedTile(t, e, i, n) {
    const r = this.getTileCacheForProjection(t);
    if (!r) return !1;
    let o = !0,
      a,
      l,
      h;
    for (let c = i.minX; c <= i.maxX; ++c)
      for (let u = i.minY; u <= i.maxY; ++u)
        (l = mn(e, c, u)),
          (h = !1),
          r.containsKey(l) &&
            ((a = r.get(l)),
            (h = a.getState() === A.LOADED),
            h && (h = n(a) !== !1)),
          h || (o = !1);
    return o;
  }
  getGutterForProjection(t) {
    return 0;
  }
  getKey() {
    return this.key_;
  }
  setKey(t) {
    this.key_ !== t && ((this.key_ = t), this.changed());
  }
  getOpaque(t) {
    return this.opaque_;
  }
  getResolutions(t) {
    const e = t ? this.getTileGridForProjection(t) : this.tileGrid;
    return e ? e.getResolutions() : null;
  }
  getTile(t, e, i, n, r) {
    return X();
  }
  getTileGrid() {
    return this.tileGrid;
  }
  getTileGridForProjection(t) {
    return this.tileGrid ? this.tileGrid : Vo(t);
  }
  getTileCacheForProjection(t) {
    const e = this.getProjection();
    return G(e === null || Le(e, t), 68), this.tileCache;
  }
  getTilePixelRatio(t) {
    return this.tilePixelRatio_;
  }
  getTilePixelSize(t, e, i) {
    const n = this.getTileGridForProjection(i),
      r = this.getTilePixelRatio(e),
      o = _t(n.getTileSize(t), this.tmpSize);
    return r == 1 ? o : dh(o, r, this.tmpSize);
  }
  getTileCoordForTileUrlFunction(t, e) {
    e = e !== void 0 ? e : this.getProjection();
    const i = this.getTileGridForProjection(e);
    return (
      this.getWrapX() && e.isGlobal() && (t = Zu(i, t, e)), zu(t, i) ? t : null
    );
  }
  clear() {
    this.tileCache.clear();
  }
  refresh() {
    this.clear(), super.refresh();
  }
  updateCacheSize(t, e) {
    const i = this.getTileCacheForProjection(e);
    t > i.highWaterMark && (i.highWaterMark = t);
  }
  useTile(t, e, i, n) {}
}
class Hu extends Bt {
  constructor(t, e) {
    super(t), (this.tile = e);
  }
}
const $u = ju;
function qu(s, t) {
  const e = /\{z\}/g,
    i = /\{x\}/g,
    n = /\{y\}/g,
    r = /\{-y\}/g;
  return function (o, a, l) {
    if (!!o)
      return s
        .replace(e, o[0].toString())
        .replace(i, o[1].toString())
        .replace(n, o[2].toString())
        .replace(r, function () {
          const h = o[0],
            c = t.getFullTileRange(h);
          return G(c, 55), (c.getHeight() - o[2] - 1).toString();
        });
  };
}
function Ju(s, t) {
  const e = s.length,
    i = new Array(e);
  for (let n = 0; n < e; ++n) i[n] = qu(s[n], t);
  return Qu(i);
}
function Qu(s) {
  return s.length === 1
    ? s[0]
    : function (t, e, i) {
        if (!t) return;
        const n = Wu(t),
          r = Ge(n, s.length);
        return s[r](t, e, i);
      };
}
function td(s) {
  const t = [];
  let e = /\{([a-z])-([a-z])\}/.exec(s);
  if (e) {
    const i = e[1].charCodeAt(0),
      n = e[2].charCodeAt(0);
    let r;
    for (r = i; r <= n; ++r) t.push(s.replace(e[0], String.fromCharCode(r)));
    return t;
  }
  if (((e = /\{(\d+)-(\d+)\}/.exec(s)), e)) {
    const i = parseInt(e[2], 10);
    for (let n = parseInt(e[1], 10); n <= i; n++)
      t.push(s.replace(e[0], n.toString()));
    return t;
  }
  return t.push(s), t;
}
class Os extends $u {
  constructor(t) {
    super({
      attributions: t.attributions,
      cacheSize: t.cacheSize,
      opaque: t.opaque,
      projection: t.projection,
      state: t.state,
      tileGrid: t.tileGrid,
      tilePixelRatio: t.tilePixelRatio,
      wrapX: t.wrapX,
      transition: t.transition,
      interpolate: t.interpolate,
      key: t.key,
      attributionsCollapsible: t.attributionsCollapsible,
      zDirection: t.zDirection,
    }),
      (this.generateTileUrlFunction_ =
        this.tileUrlFunction === Os.prototype.tileUrlFunction),
      (this.tileLoadFunction = t.tileLoadFunction),
      t.tileUrlFunction && (this.tileUrlFunction = t.tileUrlFunction),
      (this.urls = null),
      t.urls ? this.setUrls(t.urls) : t.url && this.setUrl(t.url),
      (this.tileLoadingKeys_ = {});
  }
  getTileLoadFunction() {
    return this.tileLoadFunction;
  }
  getTileUrlFunction() {
    return Object.getPrototypeOf(this).tileUrlFunction === this.tileUrlFunction
      ? this.tileUrlFunction.bind(this)
      : this.tileUrlFunction;
  }
  getUrls() {
    return this.urls;
  }
  handleTileChange(t) {
    const e = t.target,
      i = z(e),
      n = e.getState();
    let r;
    n == A.LOADING
      ? ((this.tileLoadingKeys_[i] = !0), (r = Nn.TILELOADSTART))
      : i in this.tileLoadingKeys_ &&
        (delete this.tileLoadingKeys_[i],
        (r =
          n == A.ERROR
            ? Nn.TILELOADERROR
            : n == A.LOADED
            ? Nn.TILELOADEND
            : void 0)),
      r != null && this.dispatchEvent(new Hu(r, e));
  }
  setTileLoadFunction(t) {
    this.tileCache.clear(), (this.tileLoadFunction = t), this.changed();
  }
  setTileUrlFunction(t, e) {
    (this.tileUrlFunction = t),
      this.tileCache.pruneExceptNewestZ(),
      typeof e < "u" ? this.setKey(e) : this.changed();
  }
  setUrl(t) {
    const e = td(t);
    (this.urls = e), this.setUrls(e);
  }
  setUrls(t) {
    this.urls = t;
    const e = t.join(`
`);
    this.generateTileUrlFunction_
      ? this.setTileUrlFunction(Ju(t, this.tileGrid), e)
      : this.setKey(e);
  }
  tileUrlFunction(t, e, i) {}
  useTile(t, e, i) {
    const n = mn(t, e, i);
    this.tileCache.containsKey(n) && this.tileCache.get(n);
  }
}
const ed = Os;
class id extends ed {
  constructor(t) {
    super({
      attributions: t.attributions,
      cacheSize: t.cacheSize,
      opaque: t.opaque,
      projection: t.projection,
      state: t.state,
      tileGrid: t.tileGrid,
      tileLoadFunction: t.tileLoadFunction ? t.tileLoadFunction : nd,
      tilePixelRatio: t.tilePixelRatio,
      tileUrlFunction: t.tileUrlFunction,
      url: t.url,
      urls: t.urls,
      wrapX: t.wrapX,
      transition: t.transition,
      interpolate: t.interpolate !== void 0 ? t.interpolate : !0,
      key: t.key,
      attributionsCollapsible: t.attributionsCollapsible,
      zDirection: t.zDirection,
    }),
      (this.crossOrigin = t.crossOrigin !== void 0 ? t.crossOrigin : null),
      (this.tileClass = t.tileClass !== void 0 ? t.tileClass : Eo),
      (this.tileCacheForProjection = {}),
      (this.tileGridForProjection = {}),
      (this.reprojectionErrorThreshold_ = t.reprojectionErrorThreshold),
      (this.renderReprojectionEdges_ = !1);
  }
  canExpireCache() {
    if (this.tileCache.canExpireCache()) return !0;
    for (const t in this.tileCacheForProjection)
      if (this.tileCacheForProjection[t].canExpireCache()) return !0;
    return !1;
  }
  expireCache(t, e) {
    const i = this.getTileCacheForProjection(t);
    this.tileCache.expireCache(this.tileCache == i ? e : {});
    for (const n in this.tileCacheForProjection) {
      const r = this.tileCacheForProjection[n];
      r.expireCache(r == i ? e : {});
    }
  }
  getGutterForProjection(t) {
    return this.getProjection() && t && !Le(this.getProjection(), t)
      ? 0
      : this.getGutter();
  }
  getGutter() {
    return 0;
  }
  getKey() {
    let t = super.getKey();
    return this.getInterpolate() || (t += ":disable-interpolation"), t;
  }
  getOpaque(t) {
    return this.getProjection() && t && !Le(this.getProjection(), t)
      ? !1
      : super.getOpaque(t);
  }
  getTileGridForProjection(t) {
    const e = this.getProjection();
    if (this.tileGrid && (!e || Le(e, t))) return this.tileGrid;
    const i = z(t);
    return (
      i in this.tileGridForProjection ||
        (this.tileGridForProjection[i] = Vo(t)),
      this.tileGridForProjection[i]
    );
  }
  getTileCacheForProjection(t) {
    const e = this.getProjection();
    if (!e || Le(e, t)) return this.tileCache;
    const i = z(t);
    return (
      i in this.tileCacheForProjection ||
        (this.tileCacheForProjection[i] = new Zo(this.tileCache.highWaterMark)),
      this.tileCacheForProjection[i]
    );
  }
  createTile_(t, e, i, n, r, o) {
    const a = [t, e, i],
      l = this.getTileCoordForTileUrlFunction(a, r),
      h = l ? this.tileUrlFunction(l, n, r) : void 0,
      c = new this.tileClass(
        a,
        h !== void 0 ? A.IDLE : A.EMPTY,
        h !== void 0 ? h : "",
        this.crossOrigin,
        this.tileLoadFunction,
        this.tileOptions
      );
    return (
      (c.key = o),
      c.addEventListener(F.CHANGE, this.handleTileChange.bind(this)),
      c
    );
  }
  getTile(t, e, i, n, r) {
    const o = this.getProjection();
    if (!o || !r || Le(o, r)) return this.getTileInternal(t, e, i, n, o || r);
    const a = this.getTileCacheForProjection(r),
      l = [t, e, i];
    let h;
    const c = Bo(l);
    a.containsKey(c) && (h = a.get(c));
    const u = this.getKey();
    if (h && h.key == u) return h;
    const d = this.getTileGridForProjection(o),
      f = this.getTileGridForProjection(r),
      g = this.getTileCoordForTileUrlFunction(l, r),
      _ = new Vn(
        o,
        d,
        r,
        f,
        l,
        g,
        this.getTilePixelRatio(n),
        this.getGutter(),
        (m, p, y, x) => this.getTileInternal(m, p, y, x, o),
        this.reprojectionErrorThreshold_,
        this.renderReprojectionEdges_,
        this.getInterpolate()
      );
    return (
      (_.key = u),
      h
        ? ((_.interimTile = h), _.refreshInterimChain(), a.replace(c, _))
        : a.set(c, _),
      _
    );
  }
  getTileInternal(t, e, i, n, r) {
    let o = null;
    const a = mn(t, e, i),
      l = this.getKey();
    if (!this.tileCache.containsKey(a))
      (o = this.createTile_(t, e, i, n, r, l)), this.tileCache.set(a, o);
    else if (((o = this.tileCache.get(a)), o.key != l)) {
      const h = o;
      (o = this.createTile_(t, e, i, n, r, l)),
        h.getState() == A.IDLE
          ? (o.interimTile = h.interimTile)
          : (o.interimTile = h),
        o.refreshInterimChain(),
        this.tileCache.replace(a, o);
    }
    return o;
  }
  setRenderReprojectionEdges(t) {
    if (this.renderReprojectionEdges_ != t) {
      this.renderReprojectionEdges_ = t;
      for (const e in this.tileCacheForProjection)
        this.tileCacheForProjection[e].clear();
      this.changed();
    }
  }
  setTileGridForProjection(t, e) {
    const i = It(t);
    if (i) {
      const n = z(i);
      n in this.tileGridForProjection || (this.tileGridForProjection[n] = e);
    }
  }
  clear() {
    super.clear();
    for (const t in this.tileCacheForProjection)
      this.tileCacheForProjection[t].clear();
  }
}
function nd(s, t) {
  s.getImage().src = t;
}
const sd = id;
class rd extends sd {
  constructor(t) {
    t = t || {};
    const e = t.projection !== void 0 ? t.projection : "EPSG:3857",
      i =
        t.tileGrid !== void 0
          ? t.tileGrid
          : Vu({
              extent: Ms(e),
              maxResolution: t.maxResolution,
              maxZoom: t.maxZoom,
              minZoom: t.minZoom,
              tileSize: t.tileSize,
            });
    super({
      attributions: t.attributions,
      cacheSize: t.cacheSize,
      crossOrigin: t.crossOrigin,
      interpolate: t.interpolate,
      opaque: t.opaque,
      projection: e,
      reprojectionErrorThreshold: t.reprojectionErrorThreshold,
      tileGrid: i,
      tileLoadFunction: t.tileLoadFunction,
      tilePixelRatio: t.tilePixelRatio,
      tileUrlFunction: t.tileUrlFunction,
      url: t.url,
      urls: t.urls,
      wrapX: t.wrapX !== void 0 ? t.wrapX : !0,
      transition: t.transition,
      attributionsCollapsible: t.attributionsCollapsible,
      zDirection: t.zDirection,
    }),
      (this.gutter_ = t.gutter !== void 0 ? t.gutter : 0);
  }
  getGutter() {
    return this.gutter_;
  }
}
const od = rd,
  ad = { class: "grid h-full grid-rows-2 gap-6" },
  ld = { class: "rounded-2xl" },
  hd = { class: "table w-full" },
  cd = $("caption", null, " Satellites ", -1),
  ud = $(
    "thead",
    null,
    [
      $("tr", null, [
        $("th", { scope: "col" }, "ID"),
        $("th", { scope: "col" }, "Name"),
        $("th", { scope: "col" }, "Longitude"),
        $("th", { scope: "col" }, "Latitude"),
        $("th", { scope: "col" }, "Epoch"),
        $("th", { scope: "col" }, "Inclination"),
        $("th", { scope: "col" }, "Mean Anomaly"),
      ]),
    ],
    -1
  ),
  _d = ia({
    __name: "telemetry",
    async setup(s) {
      let t, e;
      const i = Cn(),
        [n, r, o] =
          (([t, e] = na(() =>
            Promise.all([Jo(), Qo(), ta("SatelliteTrackingMetadata")])
          )),
          (t = await t),
          e(),
          t),
        a = Cn(new Map()),
        l = Gs(() => {
          const p = [...a.value.values()];
          return (
            p.sort((y, x) =>
              y.OBJECT_NAME && !x.OBJECT_NAME
                ? -1
                : !y.OBJECT_NAME && x.OBJECT_NAME
                ? 1
                : y.OBJECT_NAME && x.OBJECT_NAME
                ? y.OBJECT_NAME.localeCompare(x.OBJECT_NAME)
                : 0
            ),
            p
          );
        }),
        h = new Qi({
          image: new Cs({ radius: 15, fill: new gi({ color: "#444" }) }),
          text: new bo({ overflow: !0, fill: new gi({ color: "white" }) }),
        }),
        c = Cn(new Map()),
        u = new Map(),
        d = Gs(() => {
          const p = { longitudeDeg: 0, latitudeDeg: 0, altitudeKm: 0 };
          return l.value.map((y) => {
            if (!y.OBJECT_NAME) return p;
            const x = u.get(y.OBJECT_NAME);
            if (!x) return p;
            const E = c.value.get(x);
            return E || p;
          });
        });
      let f;
      Xs(async () => {
        f = new Au({
          target: i.value,
          layers: [
            new mh({
              source: new od({
                url: "https://cartodb-basemaps-1.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
              }),
            }),
          ],
          view: new wt({ center: [0, 0], zoom: 2 }),
        });
        const p = new ku({ features: [] }),
          y = new Ic({
            source: p,
            style: (T) => (h.getText().setText(T.get("name")), h),
          });
        f.addLayer(y);
        const x = qo();
        x.deliverLastPerSubject(), x.deliverTo(m);
        const E = await r.subscribe("sat.tracking.>", x),
          C = new Map();
        for await (const T of E) {
          if (g) break;
          const { subject: w, data: S } = T,
            v = w.split(".").slice(-1)[0],
            M = Ns(S);
          let N = C.get(v);
          if (!N) {
            N = new ho($s([0, 0]));
            const k = await o.get(v);
            if (!k) return;
            const P = Ns(k.value);
            if (!P.OBJECT_NAME) return;
            a.value.set(w, P);
            const q = new xa({ name: P.OBJECT_NAME, geometry: N });
            p.addFeature(q), C.set(v, N), u.set(P.OBJECT_NAME, v);
          }
          c.value.set(v, M),
            N.setCoordinates($s([M.longitudeDeg, M.latitudeDeg]));
        }
        ea(() => {
          f.render();
        });
      }),
        Ws(() => {
          f?.dispose();
        });
      let g = !1;
      function _() {
        return window.crypto
          .getRandomValues(new Uint32Array(1))[0]
          .toString(16);
      }
      const m = _();
      return (
        Xs(async () => {}),
        Ws(() => {
          g = !0;
        }),
        (p, y) => (
          In(),
          Rn("div", ad, [
            $("div", ld, [
              $(
                "div",
                { ref_key: "mapRef", ref: i, class: "h-full" },
                null,
                512
              ),
            ]),
            $("div", null, [
              $("table", hd, [
                cd,
                ud,
                $("tbody", null, [
                  (In(!0),
                  Rn(
                    sa,
                    null,
                    ra(
                      Tn(l),
                      (x, E) => (
                        In(),
                        Rn("tr", null, [
                          $("td", null, jt(x.OBJECT_ID), 1),
                          $("td", null, jt(x.OBJECT_NAME), 1),
                          $(
                            "td",
                            null,
                            jt(Tn(d)[E].longitudeDeg.toFixed(2)),
                            1
                          ),
                          $("td", null, jt(Tn(d)[E].latitudeDeg.toFixed(2)), 1),
                          $("td", null, jt(x.EPOCH), 1),
                          $("td", null, jt(x.INCLINATION), 1),
                          $("td", null, jt(x.MEAN_ANOMALY), 1),
                        ])
                      )
                    ),
                    256
                  )),
                ]),
              ]),
              oa(" " + jt(), 1),
            ]),
          ])
        )
      );
    },
  });
export { _d as default };
