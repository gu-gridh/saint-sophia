!(function (t, e) {
    "object" == typeof exports && "undefined" != typeof module
        ? e(exports)
        : "function" == typeof define && define.amd
        ? define(["exports"], e)
        : e(((t = "undefined" != typeof globalThis ? globalThis : t || self).OpenLIME = t.OpenLIME || {}));
})(this, function (t) {
    "use strict";
    window.structuredClone =
        "function" == typeof structuredClone
            ? structuredClone
            : function (t) {
                  return JSON.parse(JSON.stringify(t));
              };
    class e {
        static createSVGElement(t, e) {
            let i = document.createElementNS("http://www.w3.org/2000/svg", t);
            if (e) for (const [t, s] of Object.entries(e)) i.setAttribute(t, s);
            return i;
        }
        static SVGFromString(t) {
            return new DOMParser().parseFromString(t, "image/svg+xml").documentElement;
        }
        static async loadSVG(t) {
            let i = await fetch(t);
            if (!i.ok) {
                const t = `An error has occured: ${i.status}`;
                throw new Error(t);
            }
            let s = await i.text(),
                n = null;
            if (!e.isSVGString(s)) {
                throw new Error(`${t} is not an SVG file`);
            }
            return (n = e.SVGFromString(s)), n;
        }
        static async loadHTML(t) {
            let e = await fetch(t);
            if (!e.ok) {
                const t = `An error has occured: ${e.status}`;
                throw new Error(t);
            }
            return await e.text();
        }
        static async loadJSON(t) {
            let e = await fetch(t);
            if (!e.ok) {
                const t = `An error has occured: ${e.status}`;
                throw new Error(t);
            }
            return await e.json();
        }
        static async loadImage(t) {
            return new Promise((e, i) => {
                const s = new Image();
                s.addEventListener("load", () => e(s)), s.addEventListener("error", (t) => i(t)), (s.src = t);
            });
        }
        static async appendImg(t, i, s = null) {
            const n = await e.loadImage(i);
            s && n.classList.add(s), t.appendChild(n);
        }
        static async appendImgs(t, i, s = null) {
            for (const n of i) {
                const i = await e.loadImage(n);
                s && i.classList.add(s), t.appendChild(i);
            }
        }
        static isSVGString(t) {
            return (
                null != t &&
                null != t &&
                ((t = (t = t.toString().replace(/\s*<!Entity\s+\S*\s*(?:"|')[^"]+(?:"|')\s*>/gim, "")).replace(/<!--([\s\S]*?)-->/g, "")),
                Boolean(t) && /^\s*(?:<\?xml[^>]*>\s*)?(?:<!doctype svg[^>]*\s*(?:\[?(?:\s*<![^>]*>\s*)*\]?)*[^>]*>\s*)?(?:<svg[^>]*>[^]*<\/svg>|<svg[^/>]*\/\s*>)\s*$/i.test(t))
            );
        }
    }
    class i {
        constructor(t) {
            Object.assign(this, { xLow: 1e20, yLow: 1e20, xHigh: -1e20, yHigh: -1e20 }), Object.assign(this, t);
        }
        fromArray(t) {
            (this.xLow = t[0]), (this.yLow = t[1]), (this.xHigh = t[2]), (this.yHigh = t[3]);
        }
        toEmpty() {
            (this.xLow = 1e20), (this.yLow = 1e20), (this.xHigh = -1e20), (this.yHigh = -1e20);
        }
        isEmpty() {
            return this.xLow > this.xHigh || this.yLow > this.yHigh;
        }
        toArray() {
            return [this.xLow, this.yLow, this.xHigh, this.yHigh];
        }
        toString() {
            return this.xLow.toString() + " " + this.yLow.toString() + " " + this.xHigh.toString() + " " + this.yHigh.toString();
        }
        mergeBox(t) {
            null != t &&
                (this.isEmpty() ? Object.assign(this, t) : ((this.xLow = Math.min(this.xLow, t.xLow)), (this.yLow = Math.min(this.yLow, t.yLow)), (this.xHigh = Math.max(this.xHigh, t.xHigh)), (this.yHigh = Math.max(this.yHigh, t.yHigh))));
        }
        mergePoint(t) {
            (this.xLow = Math.min(this.xLow, t.x)), (this.yLow = Math.min(this.yLow, t.y)), (this.xHigh = Math.max(this.xHigh, t.x)), (this.yHigh = Math.max(this.yHigh, t.y));
        }
        shift(t, e) {
            (this.xLow += t), (this.yLow += e), (this.xHigh += t), (this.yHigh += e);
        }
        quantize(t) {
            (this.xLow = Math.floor(this.xLow / t)), (this.yLow = Math.floor(this.yLow / t)), (this.xHigh = Math.floor((this.xHigh - 1) / t) + 1), (this.yHigh = Math.floor((this.yHigh - 1) / t) + 1);
        }
        width() {
            return this.xHigh - this.xLow;
        }
        height() {
            return this.yHigh - this.yLow;
        }
        center() {
            return [(this.xLow + this.xHigh) / 2, (this.yLow + this.yHigh) / 2];
        }
        corner(t) {
            let e = this.toArray();
            return { x: e[(0 + (1 & t)) << 1], y: e[1 + (2 & t)] };
        }
        intersects(t) {
            return xLow <= t.xHigh && xHigh >= t.xLow && yLow <= t.yHigh && yHigh >= t.yLow;
        }
        print() {
            console.log("BOX=" + this.xLow.toFixed(2) + ", " + this.yLow.toFixed(2) + ", " + this.xHigh.toFixed(2) + ", " + this.yHigh.toFixed(2));
        }
    }
    class s {
        constructor(t) {
            Object.assign(this, { x: 0, y: 0, z: 1, a: 0, t: 0 }), this.t || (this.t = performance.now()), "object" == typeof t && Object.assign(this, t);
        }
        copy() {
            let t = new s();
            return Object.assign(t, this), t;
        }
        apply(t, e) {
            let i = s.rotate(t, e, this.a);
            return { x: i.x * this.z + this.x, y: i.y * this.z + this.y };
        }
        inverse() {
            let t = s.rotate(this.x / this.z, this.y / this.z, -this.a);
            return new s({ x: -t.x, y: -t.y, z: 1 / this.z, a: -this.a, t: this.t });
        }
        static normalizeAngle(t) {
            for (; t > 360; ) t -= 360;
            for (; t < 0; ) t += 360;
            return t;
        }
        static rotate(t, e, i) {
            return (i = Math.PI * (i / 180)), { x: Math.cos(i) * t - Math.sin(i) * e, y: Math.sin(i) * t + Math.cos(i) * e };
        }
        compose(t) {
            let e = this.copy(),
                i = t;
            (e.z *= i.z), (e.a += i.a);
            var n = s.rotate(e.x, e.y, i.a);
            return (e.x = n.x * i.z + i.x), (e.y = n.y * i.z + i.y), e;
        }
        transformBox(t) {
            let e = new i();
            for (let i = 0; i < 4; i++) {
                let s = t.corner(i),
                    n = this.apply(s.x, s.y);
                e.mergePoint(n);
            }
            return e;
        }
        getInverseBox(t) {
            let e = this.inverse(),
                s = [
                    { x: t.x, y: t.y },
                    { x: t.x + t.dx, y: t.y },
                    { x: t.x, y: t.y + t.dy },
                    { x: t.x + t.dx, y: t.y + t.dy },
                ],
                n = new i();
            for (let i of s) {
                let s = e.apply(i.x - t.w / 2, -i.y + t.h / 2);
                n.mergePoint(s);
            }
            return n;
        }
        static interpolate(t, e, i, n) {
            const r = new s();
            let o = e.t - t.t;
            if (i < t.t) Object.assign(r, t);
            else if (i > e.t || o < 0.001) Object.assign(r, e);
            else {
                let s = (i - t.t) / o;
                switch (n) {
                    case "ease-out":
                        s = 1 - Math.pow(1 - s, 2);
                        break;
                    case "ease-in-out":
                        s = s < 0.5 ? 2 * s * s : 1 - Math.pow(-2 * s + 2, 2) / 2;
                }
                let a = 1 - s;
                for (let i of ["x", "y", "z", "a"]) r[i] = a * t[i] + s * e[i];
            }
            return (r.t = i), r;
        }
        projectionMatrix(t) {
            let e = this.z,
                i = 2 / t.dx,
                s = 2 / t.dy,
                n = i * this.x + (2 / t.dx) * (t.w / 2 - t.x) - 1,
                r = s * this.y + (2 / t.dy) * (t.h / 2 - t.y) - 1,
                o = (Math.PI * this.a) / 180;
            return [Math.cos(o) * i * e, Math.sin(o) * s * e, 0, 0, -Math.sin(o) * i * e, Math.cos(o) * s * e, 0, 0, 0, 0, 1, 0, n, r, 0, 1];
        }
        sceneToViewportCoords(t, e) {
            return [e[0] * this.z + this.x - t.x + t.w / 2, e[1] * this.z - this.y + t.y + t.h / 2];
        }
        viewportToSceneCoords(t, e) {
            return [(e[0] + t.x - t.w / 2 - this.x) / this.z, (e[1] - t.y - t.h / 2 + this.y) / this.z];
        }
        print(t = "", e = 0) {
            const i = e;
            console.log(t + " x:" + this.x.toFixed(i) + ", y:" + this.y.toFixed(i) + ", z:" + this.z.toFixed(i) + ", a:" + this.a.toFixed(i) + ", t:" + this.t.toFixed(i));
        }
    }
    function n(t, ...e) {
        t.prototype.allSignals || (t.prototype.allSignals = []),
            (t.prototype.allSignals = [...t.prototype.allSignals, ...e]),
            (t.prototype.initSignals = function () {
                this.signals = Object.fromEntries(this.allSignals.map((t) => [t, []]));
            }),
            (t.prototype.addEvent = function (t, e) {
                this.signals || this.initSignals(), this.signals[t].push(e);
            }),
            (t.prototype.emit = function (t, ...e) {
                this.signals || this.initSignals();
                for (let i of this.signals[t]) i(...e);
            });
    }
    class r {
        constructor(t) {
            Object.assign(this, { viewport: null, bounded: !0, minScreenFraction: 1, maxFixedZoom: 2, maxZoom: 2, minZoom: 1, boundingBox: new i() }),
                Object.assign(this, t),
                (this.target = new s(this.target)),
                (this.source = this.target.copy()),
                (this.easing = "linear");
        }
        copy() {
            let t = new r();
            return Object.assign(t, this), t;
        }
        setViewport(t) {
            if (this.viewport) {
                let e = Math.sqrt((t.w / this.viewport.w) * (t.h / this.viewport.h));
                this.viewport = t;
                const { x: i, y: s, z: n, a: r } = this.target;
                this.setPosition(0, i, s, n * e, r);
            } else this.viewport = t;
        }
        glViewport() {
            let t = window.devicePixelRatio,
                e = {};
            for (let i in this.viewport) e[i] = this.viewport[i] * t;
            return e;
        }
        mapToScene(t, e, i) {
            (t -= this.viewport.w / 2), (e -= this.viewport.h / 2), (t -= i.x), (e -= i.y), (t /= i.z), (e /= i.z);
            let n = s.rotate(t, e, -i.a);
            return { x: n.x, y: n.y };
        }
        sceneToCanvas(t, e, i) {
            let n = s.rotate(t, e, i.a);
            return { x: (t = n.x * i.z + i.x - this.viewport.x + this.viewport.w / 2), y: (e = n.y * i.z - i.y + this.viewport.y + this.viewport.h / 2) };
        }
        setPosition(t, e, i, n, r, o) {
            if (((this.easing = o || this.easing), this.bounded)) {
                const t = this.viewport.dx,
                    o = this.viewport.dy;
                let a = new s({ x: e, y: i, z: n, a: r, t: 0 }).transformBox(this.boundingBox);
                const l = a.width(),
                    h = a.height(),
                    c = Math.abs(l - t) / 2;
                e = Math.min(Math.max(-c, e), c);
                const d = Math.abs(h - o) / 2;
                i = Math.min(Math.max(-d, i), d);
            }
            let a = performance.now();
            (this.source = this.getCurrentTransform(a)),
                (r = s.normalizeAngle(r)),
                (this.source.a = s.normalizeAngle(this.source.a)),
                r - this.source.a > 180 && (this.source.a += 360),
                this.source.a - r > 180 && (this.source.a -= 360),
                Object.assign(this.target, { x: e, y: i, z: n, a: r, t: a + t }),
                this.emit("update");
        }
        pan(t, e, i) {
            let s = performance.now(),
                n = this.getCurrentTransform(s);
            (n.x += e), (n.y += i), this.setPosition(t, n.x, n.y, n.z, n.a);
        }
        zoom(t, e, i, s) {
            i || (i = 0), s || (s = 0);
            let n = performance.now(),
                r = this.getCurrentTransform(n);
            this.bounded && (e = Math.min(Math.max(e, this.minZoom), this.maxZoom)), (r.x += ((r.x + i) * (r.z - e)) / r.z), (r.y += ((r.y + s) * (r.z - e)) / r.z), this.setPosition(t, r.x, r.y, e, r.a);
        }
        rotate(t, e) {
            let i = performance.now(),
                s = this.getCurrentTransform(i);
            this.setPosition(t, s.x, s.y, s.z, this.target.a + e);
        }
        deltaZoom(t, e, i = 0, n = 0) {
            let r = performance.now(),
                o = this.getCurrentTransform(r);
            (e *= this.target.z / o.z), this.bounded && (o.z * e < this.minZoom && (e = this.minZoom / o.z), o.z * e > this.maxZoom && (e = this.maxZoom / o.z));
            let a = s.rotate(i, n, o.a);
            (o.x += a.x * o.z * (1 - e)), (o.y += a.y * o.z * (1 - e)), this.setPosition(t, o.x, o.y, o.z * e, o.a);
        }
        getCurrentTransform(t) {
            return t > this.target.t && (this.easing = "linear"), s.interpolate(this.source, this.target, t, this.easing);
        }
        getGlCurrentTransform(t) {
            const e = this.getCurrentTransform(t);
            return (e.x *= window.devicePixelRatio), (e.y *= window.devicePixelRatio), (e.z *= window.devicePixelRatio), e;
        }
        fit(t, e) {
            if (t.isEmpty()) return;
            e || (e = 0);
            let i = this.viewport.dx,
                s = this.viewport.dy,
                n = t.width(),
                r = t.height(),
                o = t.center(),
                a = Math.min(i / n, s / r);
            this.setPosition(e, -o[0], -o[1], a, 0);
        }
        fitCameraBox(t) {
            this.fit(this.boundingBox, t);
        }
        updateBounds(t, e) {
            this.boundingBox = t;
            const i = this.viewport.dx,
                s = this.viewport.dy;
            let n = this.boundingBox.width(),
                r = this.boundingBox.height();
            (this.minZoom = Math.min(i / n, s / r) * this.minScreenFraction), (this.maxZoom = e > 0 ? this.maxFixedZoom / e : this.maxFixedZoom), (this.maxZoom = Math.max(this.minZoom, this.maxZoom));
        }
    }
    n(r, "update");
    class o {
        constructor() {
            Object.assign(this, { index: null, bbox: null, level: null, x: null, y: null, w: null, h: null, start: null, end: null, tex: [], missing: null, time: null, priority: null, size: null });
        }
    }
    class a {
        static fromViewportToCanvasHtml(t, e, i) {
            const s = this.getViewport(e, i);
            let n = this.invertY(t, s);
            return i ? this.scale(n, 1 / window.devicePixelRatio) : n;
        }
        static fromCanvasHtmlToViewport(t, e, i) {
            let s = i ? this.scale(t, window.devicePixelRatio) : t;
            const n = this.getViewport(e, i);
            return this.invertY(s, n);
        }
        static fromViewportToLayer(t, e, i, s) {
            const n = this.getCurrentTransform(e, s).inverse(),
                r = i.inverse();
            return this.getFromViewportToCenterTransform(e, s).compose(n.compose(r)).apply(t.x, t.y);
        }
        static fromLayerToViewport(t, e, i, s) {
            return this.getFromLayerToViewportTransform(e, i, s).apply(t.x, t.y);
        }
        static fromLayerToCenter(t, e, i, s) {
            const n = this.getCurrentTransform(e, s);
            return i.compose(n).apply(t.x, t.y);
        }
        static fromLayerToImage(t, e) {
            let i = { x: t.x + e.w / 2, y: t.y + e.h / 2 };
            return this.invertY(i, e);
        }
        static fromCanvasHtmlToScene(t, e, i) {
            let s = this.fromCanvasHtmlToViewport(t, e, i);
            const n = this.getFromViewportToCenterTransform(e, i),
                r = this.getCurrentTransform(e, i).inverse();
            return n.compose(r).apply(s.x, s.y);
        }
        static fromSceneToCanvasHtml(t, e, i) {
            let s = this.fromSceneToViewport(t, e, i);
            return this.fromViewportToCanvasHtml(s, e, i);
        }
        static fromSceneToViewport(t, e, i) {
            const s = this.getFromViewportToCenterTransform(e, i).inverse();
            return this.getCurrentTransform(e, i).compose(s).apply(t.x, t.y);
        }
        static fromSceneToViewportNoCamera(t, e, i) {
            const s = this.getFromViewportToCenterTransformNoCamera(i).inverse();
            return e.compose(s).apply(t.x, t.y);
        }
        static fromViewportToScene(t, e, i) {
            const s = this.getFromViewportToCenterTransform(e, i),
                n = this.getCurrentTransform(e, i).inverse();
            return s.compose(n).apply(t.x, t.y);
        }
        static fromViewportToSceneNoCamera(t, e, i) {
            const s = this.getFromViewportToCenterTransformNoCamera(i),
                n = e.inverse();
            return s.compose(n).apply(t.x, t.y);
        }
        static fromCanvasHtmlToImage(t, e, i, s, n) {
            let r = this.fromCanvasHtmlToScene(t, e, n);
            return (r = i.inverse().apply(r.x, r.y)), (r = this.fromLayerToImage(r, s)), r;
        }
        static fromViewportBoxToImageBox(t, e, n, r, o) {
            let l = new s({ x: -n.w / 2, y: -n.h / 2 }),
                h = e.inverse(),
                c = r.inverse(),
                d = new s({ x: o.w / 2, y: o.h / 2 }),
                u = l.compose(h.compose(c.compose(d))),
                p = new i();
            for (let e = 0; e < 4; ++e) {
                let i = t.corner(e);
                (i = u.apply(i.x, i.y)), (i = a.invertY(i, o)), p.mergePoint(i);
            }
            return p;
        }
        static fromLayerBoxToSceneBox(t, e) {
            return e.transformBox(t);
        }
        static fromSceneBoxToLayerBox(t, e) {
            return e.inverse().transformBox(t);
        }
        static fromLayerBoxToViewportBox(t, e, i, s) {
            return this.getFromLayerToViewportTransform(e, i, s).transformBox(t);
        }
        static fromViewportBoxToLayerBox(t, e, i, s) {
            return this.getFromLayerToViewportTransform(e, i, s).inverse().transformBox(t);
        }
        static getFromViewportToCenterTransform(t, e) {
            const i = this.getViewport(t, e);
            return this.getFromViewportToCenterTransformNoCamera(i);
        }
        static getFromViewportToCenterTransformNoCamera(t) {
            return new s({ x: t.x - t.w / 2, y: t.y - t.h / 2, z: 1, a: 0, t: 0 });
        }
        static reflectY(t) {
            return new s({ x: t.x, y: -t.y, z: t.z, a: t.a, t: t.t });
        }
        static getFromLayerToViewportTransform(t, e, i) {
            const s = this.getCurrentTransform(t, i),
                n = this.getFromViewportToCenterTransform(t, i).inverse();
            return e.compose(s.compose(n));
        }
        static getFromLayerToViewportTransformNoCamera(t, e, i) {
            const s = this.getFromViewportToCenterTransformNoCamera(e).inverse();
            return i.compose(t.compose(s));
        }
        static scale(t, e) {
            return { x: t.x * e, y: t.y * e };
        }
        static invertY(t, e) {
            return { x: t.x, y: e.h - t.y };
        }
        static getViewport(t, e) {
            return e ? t.glViewport() : t.viewport;
        }
        static getCurrentTransform(t, e) {
            return e ? t.getGlCurrentTransform(performance.now()) : t.getCurrentTransform(performance.now());
        }
    }
    class l {
        constructor(t, e, i) {
            if ("image" != e) {
                if (e in this.types) return this.types[e](t, e, i);
                if (null == e) return;
                throw "Layout type: " + e + " unknown, or module not loaded";
            }
            this.init(t, e, i), this.setDefaults(e);
        }
        setDefaults(t) {
            Object.assign(this, { type: t, width: 0, height: 0, suffix: "jpg", urls: [], status: null, subdomains: "abc" });
        }
        init(t, e, i) {
            i && Object.assign(this, i), "string" == typeof t && this.setUrls([t]);
        }
        setUrls(t) {
            (this.urls = t), (this.getTileURL = (t, e) => this.urls[t]), (this.status = "ready"), this.emit("ready");
        }
        getTileURL(t, e) {
            throw Error("Layout not defined or ready.");
        }
        boundingBox() {
            return new i({ xLow: -this.width / 2, yLow: -this.height / 2, xHigh: this.width / 2, yHigh: this.height / 2 });
        }
        tileCoords(t) {
            let e = this.width,
                i = this.height;
            var s = new Float32Array([0, 1, 0, 0, 1, 0, 1, 1]);
            return { coords: new Float32Array([-e / 2, -i / 2, 0, -e / 2, i / 2, 0, e / 2, i / 2, 0, e / 2, -i / 2, 0]), tcoords: s };
        }
        newTile(t) {
            let e = new o();
            return (e.index = t), e;
        }
        needed(t, e, i, s, n, r, o = 8) {
            let a = r.get(0) || this.newTile(0);
            return (a.time = performance.now()), (a.priority = 10), null === a.missing ? [a] : [];
        }
        available(t, e, i, s, n, r) {
            let o = {};
            return r.has(0) && 0 == r.get(0).missing && (o[0] = r.get(0)), o;
        }
        getViewportBox(t, e, s) {
            const n = new i({ xLow: t.x, yLow: t.y, xHigh: t.x + t.dx, yHigh: t.y + t.dy });
            return a.fromViewportBoxToImageBox(n, e, t, s, { w: this.width, h: this.height });
        }
    }
    (l.prototype.types = {}), n(l, "ready", "updateSize");
    let h = new (class {
        constructor(t) {
            Object.assign(this, { capacity: 536870912, size: 0, maxRequest: 6, requested: 0, maxPrefetch: 8388608, prefetched: 0 }), Object.assign(this, t), (this.layers = []);
        }
        setCandidates(t) {
            this.layers.includes(t) || this.layers.push(t),
                setTimeout(() => {
                    this.update();
                }, 0);
        }
        update() {
            if (this.requested > this.maxRequest) return;
            let t = this.findBestCandidate();
            if (t) {
                for (; this.size > this.capacity; ) {
                    let e = this.findWorstTile();
                    if (!e) {
                        console.log("BIG problem in the cache");
                        break;
                    }
                    if (!(e.tile.time < t.tile.time)) return;
                    this.dropTile(e.layer, e.tile);
                }
                console.assert(t != t.layer.queue[0]), t.layer.queue.shift(), this.loadTile(t.layer, t.tile);
            }
        }
        findBestCandidate() {
            let t = null;
            for (let e of this.layers) {
                for (; e.queue.length > 0 && e.tiles.has(e.queue[0].index); ) e.queue.shift();
                if (!e.queue.length) continue;
                let i = e.queue[0];
                (!t || i.time > t.tile.time + 1 || i.priority > t.tile.priority) && (t = { layer: e, tile: i });
            }
            return t;
        }
        findWorstTile() {
            let t = null;
            for (let e of this.layers) for (let i of e.tiles.values()) 0 == i.missing && (!t || i.time < t.tile.time || (i.time == t.tile.time && i.priority < t.tile.priority)) && (t = { layer: e, tile: i });
            return t;
        }
        loadTile(t, e) {
            this.requested++,
                (async () => {
                    t.loadTile(e, (t) => {
                        (this.size += t), this.requested--, this.update();
                    });
                })();
        }
        dropTile(t, e) {
            (this.size -= e.size), t.dropTile(e);
        }
        flushLayer(t) {
            if (this.layers.includes(t)) for (let e of t.tiles.values()) this.dropTile(t, e);
        }
    })();
    class c {
        constructor(t) {
            if (t.type) {
                let e = t.type;
                if ((delete t.type, e in this.types)) return this.types[e](t);
                throw "Layer type: " + e + "  module has not been loaded";
            }
            this.init(t);
        }
        init(t) {
            if (
                (Object.assign(this, {
                    transform: new s(),
                    viewport: null,
                    visible: !0,
                    zindex: 0,
                    overlay: !1,
                    rasters: [],
                    layers: [],
                    controls: {},
                    controllers: [],
                    shaders: {},
                    layout: "image",
                    shader: null,
                    gl: null,
                    width: 0,
                    height: 0,
                    prefetchBorder: 1,
                    mipmapBias: 0.4,
                    tiles: new Map(),
                    queue: [],
                    requested: {},
                }),
                Object.assign(this, t),
                this.sourceLayer && (this.tiles = this.sourceLayer.tiles),
                (this.transform = new s(this.transform)),
                "string" == typeof this.layout)
            ) {
                let t = { width: this.width, height: this.height };
                this.setLayout(new l(null, this.layout, t));
            } else this.setLayout(this.layout);
        }
        setViewport(t) {
            (this.viewport = t), this.emit("update");
        }
        setState(t, e, i = "linear") {
            if ("controls" in t) for (const [s, n] of Object.entries(t.controls)) this.setControl(s, n, e, i);
            "mode" in t && t.mode && this.setMode(t.mode);
        }
        getState(t = null) {
            const e = { controls: {} };
            for (const [i, s] of Object.entries(this.controls)) (!t || ("controls" in t && i in t.controls)) && (e.controls[i] = s.current.value);
            return (t && !("mode" in t)) || (this.getMode() && (e.mode = this.getMode())), e;
        }
        setLayout(t) {
            let e = () => {
                (this.status = "ready"), this.setupTiles(), this.emit("ready"), this.emit("update");
            };
            "ready" == t.status ? e() : t.addEvent("ready", e),
                (this.layout = t),
                this.layout.addEvent("updateSize", () => {
                    this.emit("updateSize");
                });
        }
        setTransform(t) {
            (this.transform = t), this.emit("updateSize");
        }
        setShader(t) {
            if (!t in this.shaders) throw "Unknown shader: " + t;
            (this.shader = this.shaders[t]),
                this.setupTiles(),
                this.shader.addEvent("update", () => {
                    this.emit("update");
                });
        }
        getMode() {
            return this.shader ? this.shader.mode : null;
        }
        getModes() {
            return this.shader ? this.shader.modes : [];
        }
        setMode(t) {
            this.shader.setMode(t), this.emit("update");
        }
        setVisible(t) {
            (this.visible = t), (this.previouslyNeeded = null), this.emit("update");
        }
        setZindex(t) {
            (this.zindex = t), this.emit("update");
        }
        static computeLayersMinScale(t, e) {
            if (null == t || null == t) return console.log("ASKING SCALE INFO ON NO LAYERS"), 1;
            let i = 1;
            for (let s of Object.values(t))
                if (!e || s.visible) {
                    let t = s.scale();
                    i = Math.min(i, t);
                }
            return i;
        }
        scale() {
            return this.transform.z;
        }
        boundingBox() {
            let t = this.layout.boundingBox();
            return null != this.transform && null != this.transform && (t = this.transform.transformBox(t)), t;
        }
        static computeLayersBBox(t, e) {
            if (null == t || null == t) {
                return console.log("ASKING BBOX INFO ON NO LAYERS"), new i();
            }
            let s = new i();
            for (let i of Object.values(t))
                if ((!e || i.visible) && i.layout.width) {
                    const t = i.boundingBox();
                    s.mergeBox(t);
                }
            return s;
        }
        getControl(t) {
            let e = this.controls[t] ? this.controls[t] : null;
            if (e) {
                let t = performance.now();
                this.interpolateControl(e, t);
            }
            return e;
        }
        addControl(t, e) {
            if (this.controls[t]) throw new Error('Control "$name" already exist!');
            let i = performance.now();
            this.controls[t] = { source: { value: e, t: i }, target: { value: e, t: i }, current: { value: e, t: i }, easing: "linear" };
        }
        setControl(t, e, i, s = "linear") {
            let n = performance.now(),
                r = this.controls[t];
            this.interpolateControl(r, n), (r.source.value = [...r.current.value]), (r.source.t = n), (r.target.value = [...e]), (r.target.t = n + i), (r.easing = s), this.emit("update");
        }
        interpolateControls() {
            let t = performance.now(),
                e = !0;
            for (let i of Object.values(this.controls)) e = this.interpolateControl(i, t) && e;
            return e;
        }
        interpolateControl(t, e) {
            let i = t.source,
                s = t.target,
                n = t.current;
            if (((n.t = e), e < i.t)) return (n.value = [...i.value]), !1;
            if (e > s.t - 1e-4) {
                let t = n.value.every((t, e) => t === s.value[e]);
                return (n.value = [...s.value]), t;
            }
            let r = s.t - i.t,
                o = (e - i.t) / r;
            switch (t.easing) {
                case "ease-out":
                    o = 1 - Math.pow(1 - o, 2);
                    break;
                case "ease-in-out":
                    o = o < 0.5 ? 2 * o * o : 1 - Math.pow(-2 * o + 2, 2) / 2;
            }
            let a = 1 - o;
            n.value = [];
            for (let t = 0; t < i.value.length; t++) n.value[t] = a * i.value[t] + o * s.value[t];
            return !1;
        }
        dropTile(t) {
            for (let e = 0; e < t.tex.length; e++) t.tex[e] && this.gl.deleteTexture(t.tex[e]);
            this.tiles.delete(t.index);
        }
        clear() {
            (this.ibuffer = this.vbuffer = null), h.flushLayer(this), (this.tiles = new Map()), this.setupTiles(), (this.queue = []), (this.previouslyNeeded = !1);
        }
        draw(t, e) {
            if ("ready" != this.status) return !0;
            if (!this.shader) throw "Shader not specified!";
            let i = this.interpolateControls(),
                s = e;
            this.viewport && ((e = this.viewport), this.gl.viewport(e.x, e.y, e.dx, e.dy)), this.prepareWebGL();
            let n = this.layout.available(e, t, this.transform, 0, this.mipmapBias, this.tiles),
                r = (t = this.transform.compose(t)).projectionMatrix(e);
            this.gl.uniformMatrix4fv(this.shader.matrixlocation, this.gl.FALSE, r), this.updateAllTileBuffers(n);
            let o = 0;
            for (let t of Object.values(n)) this.drawTile(t, o), ++o;
            return this.vieport && this.gl.viewport(s.x, s.y, s.dx, s.dy), i;
        }
        drawTile(t, e) {
            if (0 != t.missing) throw "Attempt to draw tile still missing textures";
            let i = this.gl;
            for (var s = 0; s < this.shader.samplers.length; s++) {
                let e = this.shader.samplers[s].id;
                i.uniform1i(this.shader.samplers[s].location, s), i.activeTexture(i.TEXTURE0 + s), i.bindTexture(i.TEXTURE_2D, t.tex[e]);
            }
            const n = this.getTileByteOffset(e);
            i.drawElements(i.TRIANGLES, 6, i.UNSIGNED_SHORT, n);
        }
        getTileByteOffset(t) {
            return 6 * t * 2;
        }
        updateTileBuffers(t, e) {
            let i = this.gl;
            i.bindBuffer(i.ARRAY_BUFFER, this.vbuffer),
                i.bufferData(i.ARRAY_BUFFER, t, i.STATIC_DRAW),
                i.vertexAttribPointer(this.shader.coordattrib, 3, i.FLOAT, !1, 0, 0),
                i.enableVertexAttribArray(this.shader.coordattrib),
                i.bindBuffer(i.ARRAY_BUFFER, this.tbuffer),
                i.bufferData(i.ARRAY_BUFFER, e, i.STATIC_DRAW),
                i.vertexAttribPointer(this.shader.texattrib, 2, i.FLOAT, !1, 0, 0),
                i.enableVertexAttribArray(this.shader.texattrib);
        }
        updateAllTileBuffers(t) {
            let e = this.gl,
                i = Object.values(t).length;
            if (0 == i) return;
            const s = new Uint16Array(6 * i),
                n = new Float32Array(12 * i),
                r = new Float32Array(8 * i);
            let o = 0;
            for (let e of Object.values(t)) {
                let t = this.layout.tileCoords(e);
                n.set(t.coords, 12 * o), r.set(t.tcoords, 8 * o);
                const i = 4 * o;
                (e.indexBufferByteOffset = 2 * o * 6), s.set([i + 3, i + 2, i + 1, i + 3, i + 1, i + 0], 6 * o), ++o;
            }
            e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, this.ibuffer),
                e.bufferData(e.ELEMENT_ARRAY_BUFFER, s, e.STATIC_DRAW),
                e.bindBuffer(e.ARRAY_BUFFER, this.vbuffer),
                e.bufferData(e.ARRAY_BUFFER, n, e.STATIC_DRAW),
                e.vertexAttribPointer(this.shader.coordattrib, 3, e.FLOAT, !1, 0, 0),
                e.enableVertexAttribArray(this.shader.coordattrib),
                e.bindBuffer(e.ARRAY_BUFFER, this.tbuffer),
                e.bufferData(e.ARRAY_BUFFER, r, e.STATIC_DRAW),
                e.vertexAttribPointer(this.shader.texattrib, 2, e.FLOAT, !1, 0, 0),
                e.enableVertexAttribArray(this.shader.texattrib);
        }
        setupTiles() {
            if (this.shader && this.layout && "ready" == this.layout.status)
                for (let t of this.tiles) {
                    t.missing = this.shader.samplers.length;
                    for (let e of this.shader.samplers) t.tex[e.id] && t.missing--;
                }
        }
        prepareWebGL() {
            let t = this.gl;
            this.ibuffer ||
                ((this.ibuffer = t.createBuffer()),
                t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, this.ibuffer),
                t.bufferData(t.ELEMENT_ARRAY_BUFFER, new Uint16Array([3, 2, 1, 3, 1, 0]), t.STATIC_DRAW),
                (this.vbuffer = t.createBuffer()),
                t.bindBuffer(t.ARRAY_BUFFER, this.vbuffer),
                t.bufferData(t.ARRAY_BUFFER, new Float32Array([0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0]), t.STATIC_DRAW),
                (this.tbuffer = t.createBuffer()),
                t.bindBuffer(t.ARRAY_BUFFER, this.tbuffer),
                t.bufferData(t.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 1, 1, 0]), t.STATIC_DRAW)),
                this.shader.needsUpdate && this.shader.createProgram(t),
                t.useProgram(this.shader.program),
                this.shader.updateUniforms(t, this.shader.program);
        }
        sameNeeded(t, e) {
            if (t.level != e.level) return !1;
            for (let i of ["xLow", "xHigh", "yLow", "yHigh"]) if (t.pyramid[t.level][i] != e.pyramid[t.level][i]) return !1;
            return !0;
        }
        prefetch(t, e) {
            if ((this.viewport && (e = this.viewport), 0 != this.layers.length)) for (let i of this.layers) i.prefetch(t, e);
            if (0 != this.rasters.length && "ready" == this.status) {
                if ("object" != typeof this.layout) throw "AH!";
                (this.queue = this.layout.needed(e, t, this.transform, this.prefetchBorder, this.mipmapBias, this.tiles)), h.setCandidates(this);
            }
        }
        async loadTile(t, e) {
            if (this.tiles.has(t.index)) throw "AAARRGGHHH double tile!";
            if ((this.requested[t.index] && console.log("Warning: double request!"), this.tiles.set(t.index, t), (this.requested[t.index] = !0), "itarzoom" == this.layout.type)) {
                t.url = this.layout.getTileURL(null, t);
                let s = {};
                t.end && (s.headers = { range: `bytes=${t.start}-${t.end}`, "Accept-Encoding": "indentity" });
                var i = await fetch(t.url, s);
                if (!i.ok) return void e("Failed loading " + t.url + ": " + i.statusText);
                let n = await i.blob(),
                    r = 0;
                for (let e of this.shader.samplers) {
                    let i = this.rasters[e.id],
                        s = n.slice(t.offsets[r], t.offsets[r + 1]);
                    const o = await i.blobToImage(s, this.gl);
                    let a = i.loadTexture(this.gl, o),
                        l = o.width * o.height * 3;
                    (t.size += l), (t.tex[e.id] = a), r++;
                }
                return (t.missing = 0), this.emit("update"), delete this.requested[t.index], void (e && e(t.size));
            }
            t.missing = this.shader.samplers.length;
            for (let i of this.shader.samplers) {
                let s = this.rasters[i.id];
                t.url = this.layout.getTileURL(i.id, t);
                const [n, r] = await s.loadImage(t, this.gl);
                "image" == this.layout.type && ((this.layout.width = s.width), (this.layout.height = s.height), this.layout.emit("updateSize")),
                    (t.size += r),
                    (t.tex[i.id] = n),
                    t.missing--,
                    t.missing <= 0 && (this.emit("update"), delete this.requested[t.index], e && e(r));
            }
        }
    }
    (c.prototype.types = {}),
        n(c, "update", "ready", "updateSize"),
        (window.structuredClone =
            "function" == typeof structuredClone
                ? structuredClone
                : function (t) {
                      return JSON.parse(JSON.stringify(t));
                  });
    class d {
        constructor(t, e, i, s) {
            Object.assign(this, { canvasElement: null, preserveDrawingBuffer: !1, gl: null, overlayElement: null, camera: i, layers: {}, signals: { update: [], updateSize: [], ready: [] } }), Object.assign(this, s), this.init(t, e);
            for (let t in this.layers) this.addLayer(t, new c(this.layers[t]));
            this.camera.addEvent("update", () => this.emit("update"));
        }
        init(t, e) {
            if (!t) throw "Missing element parameter";
            if ("string" == typeof t && !(t = document.querySelector(t))) throw "Could not find dom element.";
            if (!e) throw "Missing element parameter";
            if ("string" == typeof e && !(e = document.querySelector(e))) throw "Could not find dom element.";
            if (!t.tagName) throw "Element is not a DOM element";
            if ("CANVAS" != t.tagName) throw "Element is not a canvas element";
            (this.canvasElement = t), (this.overlayElement = e);
            let i = { antialias: !1, depth: !1, preserveDrawingBuffer: this.preserveDrawingBuffer };
            if (((this.gl = this.gl || t.getContext("webgl2", i) || t.getContext("webgl", i) || t.getContext("experimental-webgl", i)), !this.gl)) throw "Could not create a WebGL context";
            t.addEventListener(
                "webglcontextlost",
                (t) => {
                    console.log("Context lost."), t.preventDefault();
                },
                !1
            ),
                t.addEventListener(
                    "webglcontextrestored",
                    () => {
                        this.restoreWebGL();
                    },
                    !1
                ),
                document.addEventListener("visibilitychange", (t) => {
                    this.gl.isContextLost() && this.restoreWebGL();
                });
        }
        setState(t, e, i = "linear") {
            if ("camera" in t) {
                const s = t.camera;
                this.camera.setPosition(e, s.x, s.y, s.z, s.a, i);
            }
            if ("layers" in t)
                for (const [s, n] of Object.entries(t.layers))
                    if (s in this.layers) {
                        this.layers[s].setState(n, e, i);
                    }
        }
        getState(t = null) {
            let e = {};
            if (!t || t.camera) {
                let t = performance.now(),
                    i = this.camera.getCurrentTransform(t);
                e.camera = { x: i.x, y: i.y, z: i.z, a: i.a };
            }
            e.layers = {};
            for (let i of Object.values(this.layers)) {
                const s = window.structuredClone(t);
                t && t.layers && Object.assign(s, t.layers[i.id]), (e.layers[i.id] = i.getState(s));
            }
            return e;
        }
        restoreWebGL() {
            let t = { antialias: !1, depth: !1, preserveDrawingBuffer: this.preserveDrawingBuffer };
            this.gl = this.gl || this.canvasElement.getContext("webgl2", t) || this.canvasElement.getContext("webgl", t) || this.canvasElement.getContext("experimental-webgl", t);
            for (let t of Object.values(this.layers)) (t.gl = this.gl), t.clear(), t.shader && t.shader.restoreWebGL(this.gl);
            this.prefetch(), this.emit("update");
        }
        addLayer(t, e) {
            console.assert(!(t in this.layers), "Duplicated layer id"),
                (e.id = t),
                e.addEvent("ready", () => {
                    Object.values(this.layers).every((t) => "ready" == t.status) && this.emit("ready"), this.prefetch();
                }),
                e.addEvent("update", () => {
                    this.emit("update");
                }),
                e.addEvent("updateSize", () => {
                    this.updateSize();
                }),
                (e.gl = this.gl),
                (e.overlayElement = this.overlayElement),
                (this.layers[t] = e),
                this.prefetch();
        }
        removeLayer(t) {
            t.clear(), delete this.layers[t.id], delete h.layers[t], this.prefetch();
        }
        updateSize() {
            let t = c.computeLayersBBox(this.layers, true),
                e = c.computeLayersMinScale(this.layers, true);
            null != t && this.camera.updateBounds(t, e), this.emit("updateSize");
        }
        draw(t) {
            let e = this.gl,
                i = this.camera.glViewport();
            e.viewport(i.x, i.y, i.dx, i.dy);
            var s = [0, 0, 0, 0];
            e.clearColor(s[0], s[1], s[2], s[3], s[4]), e.clear(e.COLOR_BUFFER_BIT), e.blendFunc(e.SRC_ALPHA, e.ONE_MINUS_SRC_ALPHA), e.enable(e.BLEND);
            let n = this.camera.getGlCurrentTransform(t);
            this.prefetch(n);
            let r = Object.values(this.layers).sort((t, e) => t.zindex - e.zindex),
                o = !0;
            for (let t of r) t.visible && (o = t.draw(n, i) && o);
            return o && n.t >= this.camera.target.t;
        }
        prefetch(t) {
            t || (t = this.camera.getGlCurrentTransform(performance.now()));
            for (let e in this.layers) {
                let i = this.layers[e];
                i.visible && "ready" == i.status && i.prefetch(t, this.camera.glViewport());
            }
        }
    }
    n(d, "update", "updateSize", "ready");
    class p {
        constructor(t) {
            Object.assign(this, { format: "vec3" }), Object.assign(this, t);
        }
        async loadImage(t, e) {
            let i,
                s = new URL(t.url, window.location.href).origin !== window.location.origin;
            if (t.end || "undefined" == typeof createImageBitmap) {
                let n = {};
                n.headers = { range: `bytes=${t.start}-${t.end}`, "Accept-Encoding": "indentity", mode: s ? "cors" : "same-origin" };
                let r = await fetch(t.url, n);
                if (!r.ok) return void callback("Failed loading " + t.url + ": " + r.statusText);
                if (206 != r.status) throw "The server doesn't support partial content requests (206).";
                let o = await r.blob();
                i = await this.blobToImage(o, e);
            } else
                (i = document.createElement("img")),
                    s && (i.crossOrigin = ""),
                    (i.onerror = function (t) {
                        console.log("Texture loading error!");
                    }),
                    (i.src = t.url),
                    await new Promise((t, e) => {
                        i.onload = () => t();
                    });
            return [this.loadTexture(e, i), i.width * i.height * 3];
        }
        async blobToImage(t, e) {
            let i;
            if ("undefined" != typeof createImageBitmap) {
                var s = "undefined" != typeof InstallTrigger;
                i = s ? await createImageBitmap(t) : await createImageBitmap(t, { imageOrientation1: "flipY" });
            } else {
                let e = window.URL || window.webkitURL;
                (i = document.createElement("img")),
                    (i.onerror = function (t) {
                        console.log("Texture loading error!");
                    }),
                    (i.src = e.createObjectURL(t)),
                    await new Promise((t, e) => {
                        i.onload = () => t();
                    }),
                    e.revokeObjectURL(i.src);
            }
            return i;
        }
        loadTexture(t, e) {
            (this.width = e.width), (this.height = e.height);
            var i = t.createTexture();
            t.bindTexture(t.TEXTURE_2D, i),
                t.texParameterf(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR),
                t.texParameterf(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR),
                t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE),
                t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE);
            let s = t.RGBA;
            switch (this.format) {
                case "vec3":
                    s = t.RGB;
                    break;
                case "vec4":
                    s = t.RGBA;
                    break;
                case "float":
                    s = t.LUMINANCE;
            }
            return t.texImage2D(t.TEXTURE_2D, 0, s, s, t.UNSIGNED_BYTE, e), i;
        }
    }
    class m {
        constructor(t) {
            Object.assign(this, { version: 100, samplers: [], uniforms: {}, label: null, program: null, modes: [], mode: null, needsUpdate: !0 }), n(m, "update"), Object.assign(this, t);
        }
        setMode(t) {
            if (-1 == this.modes.indexOf(t)) throw Error("Unknown mode: " + t);
            (this.mode = t), (this.needsUpdate = !0);
        }
        restoreWebGL(t) {
            this.createProgram(t);
        }
        setUniform(t, e) {
            let i = this.uniforms[t];
            if (!i) throw new Error(`Unknown '${t}'. It is not a registered uniform.`);
            if (("number" != typeof e && "boolean" != typeof e) || i.value != e) {
                if (Array.isArray(e) && Array.isArray(i.value) && e.length == i.value.length) {
                    let t = !0;
                    for (let s = 0; s < e.length; s++)
                        if (e[s] != i.value[s]) {
                            t = !1;
                            break;
                        }
                    if (t) return;
                }
                (i.value = e), (i.needsUpdate = !0), this.emit("update");
            }
        }
        createProgram(t) {
            let e = t.createShader(t.VERTEX_SHADER);
            t.shaderSource(e, this.vertShaderSrc(t)), t.compileShader(e);
            let i = t.getShaderParameter(e, t.COMPILE_STATUS);
            if (!i) throw (console.log(t.getShaderInfoLog(e)), Error("Failed vertex shader compilation: see console log and ask for support."));
            let s = t.createShader(t.FRAGMENT_SHADER);
            t.shaderSource(s, this.fragShaderSrc(t)), t.compileShader(s), this.program && t.deleteProgram(this.program);
            let n = t.createProgram();
            if ((t.getShaderParameter(s, t.COMPILE_STATUS), (i = t.getShaderParameter(s, t.COMPILE_STATUS)), !i))
                throw (console.log(this.fragShaderSrc()), console.log(t.getShaderInfoLog(s)), Error("Failed fragment shader compilation: see console log and ask for support."));
            if ((t.attachShader(n, e), t.attachShader(n, s), t.linkProgram(n), !t.getProgramParameter(n, t.LINK_STATUS))) {
                var r = t.getProgramInfoLog(n);
                throw new Error("Could not compile WebGL program. \n\n" + r);
            }
            for (let e of this.samplers) e.location = t.getUniformLocation(n, e.name);
            (this.coordattrib = t.getAttribLocation(n, "a_position")),
                t.vertexAttribPointer(this.coordattrib, 3, t.FLOAT, !1, 0, 0),
                t.enableVertexAttribArray(this.coordattrib),
                (this.texattrib = t.getAttribLocation(n, "a_texcoord")),
                t.vertexAttribPointer(this.texattrib, 2, t.FLOAT, !1, 0, 0),
                t.enableVertexAttribArray(this.texattrib),
                (this.matrixlocation = t.getUniformLocation(n, "u_matrix")),
                (this.program = n),
                (this.needsUpdate = !1);
            for (let t of Object.values(this.uniforms)) (t.location = null), (t.needsUpdate = !0);
        }
        updateUniforms(t, e) {
            performance.now();
            for (const [i, s] of Object.entries(this.uniforms))
                if ((s.location || (s.location = t.getUniformLocation(e, i)), s.location && s.needsUpdate)) {
                    let e = s.value;
                    switch (s.type) {
                        case "vec4":
                            t.uniform4fv(s.location, e);
                            break;
                        case "vec3":
                            t.uniform3fv(s.location, e);
                            break;
                        case "vec2":
                            t.uniform2fv(s.location, e);
                            break;
                        case "float":
                            t.uniform1f(s.location, e);
                            break;
                        case "int":
                        case "bool":
                            t.uniform1i(s.location, e);
                            break;
                        case "mat3":
                            t.uniformMatrix3fv(s.location, !1, e);
                            break;
                        case "mat4":
                            t.uniformMatrix4fv(s.location, !1, e);
                            break;
                        default:
                            throw Error("Unknown uniform type: " + u.type);
                    }
                }
        }
        vertShaderSrc(t) {
            let e = !(t instanceof WebGLRenderingContext);
            return `${
                e ? "#version 300 es" : ""
            }\n\nprecision highp float; \nprecision highp int; \n\nuniform mat4 u_matrix;\n${e ? "in" : "attribute"} vec4 a_position;\n${e ? "in" : "attribute"} vec2 a_texcoord;\n\n${e ? "out" : "varying"} vec2 v_texcoord;\n\nvoid main() {\n\tgl_Position = u_matrix * a_position;\n\tv_texcoord = a_texcoord;\n}`;
        }
        fragShaderSrc(t) {
            throw "Unimplemented!";
        }
    }
    class g extends c {
        constructor(t) {
            if ((super(t), 0 != Object.keys(this.rasters).length)) throw "Rasters options should be empty!";
            if (this.url) this.layout.setUrls([this.url]);
            else if (0 == this.layout.urls.length) throw "Missing options.url parameter";
            const e = null != this.format ? this.format : "vec4";
            let i = new p({ format: e });
            this.rasters.push(i);
            let s = new m({ label: "Rgb", samplers: [{ id: 0, name: "kd", type: e }] });
            (s.fragShaderSrc = function (t) {
                let e = !(t instanceof WebGLRenderingContext);
                return `${e ? "#version 300 es" : ""}\n\nprecision highp float;\nprecision highp int;\n\nuniform sampler2D kd;\n\n${e ? "in" : "varying"} vec2 v_texcoord;\n${
                    e ? "out" : ""
                } vec4 color;\n\n\nvoid main() {\n\tcolor = texture${e ? "" : "2D"}(kd, v_texcoord);\n\t${e ? "" : "gl_FragColor = color;"}\n}\n`;
            }),
                (this.shaders = { standard: s }),
                this.setShader("standard");
        }
    }
    c.prototype.types.image = (t) => new g(t);
    class f extends c {
        constructor(t) {
            if ((super(t), 0 != Object.keys(this.rasters).length)) throw "Rasters options should be empty!";
            (this.textures = []), (this.framebuffers = []), (this.status = "ready");
        }
        draw(t, e) {
            for (let t of this.layers) if ("ready" != t.status) return;
            if (!this.shader) throw "Shader not specified!";
            let i = e.dx,
                s = e.dy;
            (this.framebuffers.length && this.layout.width == i && this.layout.height == s) || (this.deleteFramebuffers(), (this.layout.width = i), (this.layout.height = s), this.createFramebuffers());
            let n = this.gl;
            var r = [0, 0, 0, 0];
            n.clearColor(r[0], r[1], r[2], r[3]);
            for (let e = 0; e < this.layers.length; e++)
                n.bindFramebuffer(n.FRAMEBUFFER, this.framebuffers[e]), n.clear(n.COLOR_BUFFER_BIT), this.layers[e].draw(t, { x: 0, y: 0, dx: i, dy: s, w: i, h: s }), n.bindFramebuffer(n.FRAMEBUFFER, null);
            this.prepareWebGL();
            for (let t = 0; t < this.layers.length; t++) n.uniform1i(this.shader.samplers[t].location, t), n.activeTexture(n.TEXTURE0 + t), n.bindTexture(n.TEXTURE_2D, this.textures[t]);
            this.updateTileBuffers(new Float32Array([-1, -1, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0]), new Float32Array([0, 0, 0, 1, 1, 1, 1, 0])), n.drawElements(n.TRIANGLES, 6, n.UNSIGNED_SHORT, 0);
        }
        createFramebuffers() {
            let t = this.gl;
            for (let e = 0; e < this.layers.length; e++) {
                const i = t.createTexture();
                t.bindTexture(t.TEXTURE_2D, i);
                const s = 0,
                    n = t.RGBA,
                    r = 0,
                    o = t.RGBA,
                    a = t.UNSIGNED_BYTE;
                t.texImage2D(t.TEXTURE_2D, s, n, this.layout.width, this.layout.height, r, o, a, null),
                    t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR),
                    t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE),
                    t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE);
                const l = t.createFramebuffer();
                t.bindFramebuffer(t.FRAMEBUFFER, l), t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, i, 0), t.bindFramebuffer(t.FRAMEBUFFER, null), (this.textures[e] = i), (this.framebuffers[e] = l);
            }
        }
        deleteFramebuffers() {}
        boundingBox() {
            let t = c.computeLayersBBox(this.layers, !1);
            return null != this.transform && null != this.transform && (t = this.transform.transformBox(t)), t;
        }
        scale() {
            let t = c.computeLayersMinScale(this.layers, !1);
            return (t *= this.transform.z), t;
        }
    }
    c.prototype.types.combiner = (t) => new f(t);
    class y {
        constructor(t) {
            Object.assign(
                this,
                {
                    id: y.UUID(),
                    code: null,
                    label: null,
                    description: null,
                    class: null,
                    target: null,
                    svg: null,
                    image: null,
                    region: null,
                    data: {},
                    style: null,
                    bbox: null,
                    visible: !0,
                    state: null,
                    ready: !1,
                    needsUpdate: !0,
                    editing: !1,
                },
                t
            ),
                this.label || (this.label = ""),
                (this.elements = []);
        }
        static UUID() {
            return "axxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (t) {
                var e = (16 * Math.random()) | 0;
                return ("x" == t ? e : (3 & e) | 8).toString(16);
            });
        }
        getBBoxFromElements() {
            let t = null;
            if (this.elements.length) {
                let { x: e, y: s, width: n, height: r } = this.elements[0].getBBox();
                for (let t of this.elements) {
                    const { sx: i, sy: o, swidth: a, sheight: l } = t.getBBox();
                    (e = Math.min(e, i)), (s = Math.min(e, o)), (n = Math.max(n + e, i + a) - e), (r = Math.max(r + s, o + l) - s);
                }
                t = new i({ xLow: e, yLow: s, xHigh: e + n, yHigh: s + n });
            } else if (null == this.region) t = new i();
            else {
                const e = this.region;
                t = new i({ xLow: e.x, yLow: e.y, xHigh: e.x + e.w, yHigh: e.y + e.h });
            }
            return t;
        }
        static fromJsonLd(t) {
            if ("Annotation" != t.type) throw "Not a jsonld annotation.";
            let e = { id: t.id },
                i = { identifying: "code", identifying: "label", describing: "description", classifying: "class" };
            for (let s of t.body) {
                let t = i[s.purpose];
                t && (e[t] = s.value);
            }
            let s = t.target && t.target.selector;
            if (s) {
                if ("SvgSelector" !== s.type) throw "Unsupported selector: " + s.type;
                (e.svg = s.value), (e.elements = []);
            }
            return new y(e);
        }
        toJsonLd() {
            let t = [];
            (null !== this.code && t.push({ type: "TextualBody", value: this.code, purpose: "indentifying" }),
            null !== this.class && t.push({ type: "TextualBody", value: this.class, purpose: "classifying" }),
            null !== this.description && t.push({ type: "TextualBody", value: this.description, purpose: "describing" }),
            this.id,
            this.target && (target.selector.source = this.target),
            this.element) && new XMLSerializer().serializeToString(this.element);
        }
    }
    class v extends c {
        constructor(t) {
            super((t = Object.assign({ style: null, annotations: [], selected: new Set(), overlay: !0, annotationsListEntry: null }, t))),
                "string" == typeof this.annotations &&
                    (async () => {
                        await this.loadAnnotations(this.annotations);
                    })();
        }
        async loadAnnotations(t) {
            const e = new Headers();
            e.append("pragma", "no-cache"), e.append("cache-control", "no-cache");
            var i = await fetch(t, { method: "GET", headers: e });
            if (i.ok)
                if (((this.annotations = await i.json()), "error" != this.annotations.status)) {
                    this.annotations = this.annotations.map((t) => new y(t));
                    for (let t of this.annotations) 1 != t.publish && (t.visible = !1);
                    this.annotationsListEntry && this.createAnnotationsList(), this.emit("update"), this.emit("ready"), this.emit("loaded");
                } else alert("Failed to load annotations: " + this.annotations.msg);
            else this.status = "Failed loading " + this.url + ": " + i.statusText;
        }
        newAnnotation(t) {
            t || (t = new y()), this.annotations.push(t);
            let e = this.createAnnotationEntry(t),
                i = document.createElement("template");
            return (i.innerHTML = e.trim()), this.annotationsListEntry.element.parentElement.querySelector(".openlime-list").appendChild(i.content.firstChild), this.clearSelected(), t;
        }
        annotationsEntry() {
            return (this.annotationsListEntry = {
                html: "",
                list: [],
                classes: "openlime-annotations",
                status: () => "active",
                oncreate: () => {
                    Array.isArray(this.annotations) && this.createAnnotationsList();
                },
            });
        }
        createAnnotationsList() {
            let t = "";
            for (let e of this.annotations) t += this.createAnnotationEntry(e);
            let e = this.annotationsListEntry.element.parentElement.querySelector(".openlime-list");
            (e.innerHTML = t),
                e.addEventListener("click", (t) => {
                    let e = t.srcElement.closest("svg");
                    if (e) {
                        let t = e.closest("[data-annotation]");
                        t.classList.toggle("hidden");
                        let i = t.getAttribute("data-annotation"),
                            s = this.getAnnotationById(i);
                        (s.visible = !s.visible), (s.needsUpdate = !0), this.emit("update");
                    }
                    let i = t.srcElement.getAttribute("data-annotation");
                    if (i) {
                        this.clearSelected();
                        let t = this.getAnnotationById(i);
                        this.setSelected(t, !0);
                    }
                });
        }
        createAnnotationEntry(t) {
            return `<a href="#" data-annotation="${
                t.id
            }" class="openlime-entry ${0 == t.visible ? "hidden" : ""}">${t.label || ""}\n\t\t\t<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="openlime-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>\n\t\t\t<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="openlime-eye-off"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>\n\t\t\t</a>`;
        }
        getAnnotationById(t) {
            for (const e of this.annotations) if (e.id == t) return e;
            return null;
        }
        clearSelected() {
            this.annotationsListEntry.element.parentElement.querySelectorAll("[data-annotation]").forEach((t) => t.classList.remove("selected")), this.selected.clear();
        }
        setSelected(t, e = !0) {
            this.annotationsListEntry.element.parentElement.querySelector(`[data-annotation="${t.id}"]`).classList.toggle("selected", e), e ? this.selected.add(t.id) : this.selected.delete(t.id), this.emit("selected", t);
        }
    }
    n(v, "selected", "loaded");
    class x extends l {
        constructor(t, e, s) {
            super(t, null, s), this.setDefaults(e), this.init(t, e, s), (this.tileDescriptors = []), (this.box = new i()), null != t && this.loadDescriptors(t);
        }
        async loadDescriptors(t) {
            let e = await fetch(t);
            if (e.ok)
                if (((this.tileDescriptors = await e.json()), "error" != this.tileDescriptors.status)) {
                    this.tileDescriptors = this.tileDescriptors.map((t) => new y(t));
                    for (let t of this.tileDescriptors) 1 != t.publish && (t.visible = !1);
                    this.computeBoundingBox(), this.emit("updateSize"), null == this.path && this.setPathFromUrl(t), (this.status = "ready"), this.emit("ready");
                } else alert("Failed to load annotations: " + this.tileDescriptors.msg);
            else this.status = "Failed loading " + t + ": " + e.statusText;
        }
        computeBoundingBox() {
            this.box = new i();
            for (let t of this.tileDescriptors) {
                let e = t.region,
                    s = new i({ xLow: e.x, yLow: e.y, xHigh: e.x + e.w, yHigh: e.y + e.h });
                this.box.mergeBox(s);
            }
        }
        boundingBox() {
            return this.box;
        }
        setPathFromUrl(t) {
            const e = t.split("/"),
                i = e.length;
            this.path = "";
            for (let t = 0; t < i - 1; ++t) this.path += e[t] + "/";
            this.getTileURL = (t, e) => this.path + "/" + this.tileDescriptors[e.index].image;
        }
        setTileDescriptors(t) {
            (this.tileDescriptors = t), (this.status = "ready"), this.emit("ready");
        }
        getTileURL(t, e) {
            return this.path + "/" + this.tileDescriptors[t].image;
        }
        setTileVisible(t, e) {
            this.tileDescriptors[t].visible = e;
        }
        setAllTilesVisible(t) {
            const e = this.tileCount();
            for (let i = 0; i < e; ++i) this.tileDescriptors[i].visible = t;
        }
        index(t, e, i) {
            return e;
        }
        tileCoords(t) {
            const e = this.tileDescriptors[t.index].region,
                i = e.x,
                s = e.y,
                n = i + e.w,
                r = s + e.h;
            return { coords: new Float32Array([i, s, 0, i, r, 0, n, r, 0, n, s, 0]), tcoords: new Float32Array([0, 1, 0, 0, 1, 0, 1, 1]) };
        }
        needed(t, e, i, s, n, r, o = 8) {
            const a = this.getViewportBox(t, e, i);
            let l = [],
                h = performance.now();
            const c = this.tileCount();
            for (let t = 0; t < c; t++) {
                let e = this.index(0, t, 0),
                    i = r.get(e) || this.newTile(e);
                this.intersects(a, e, true) && ((i.time = h), (i.priority = this.tileDescriptors[e].visible ? 10 : 1), null === i.missing && l.push(i));
            }
            let d = a.center();
            return (
                l.sort(function (t, e) {
                    return Math.abs(t.x - d[0]) + Math.abs(t.y - d[1]) - Math.abs(e.x - d[0]) - Math.abs(e.y - d[1]);
                }),
                l
            );
        }
        available(t, e, i, s, n, r) {
            const o = this.getViewportBox(t, e, i);
            let a = [];
            const l = this.tileCount();
            for (let t = 0; t < l; t++) {
                let e = this.index(0, t, 0);
                if (this.tileDescriptors[e].visible && this.intersects(o, e, true) && r.has(e)) {
                    let t = r.get(e);
                    0 == t.missing && (a[e] = t);
                }
            }
            return a;
        }
        newTile(t) {
            let e = new o();
            e.index = t;
            let i = this.tileDescriptors[t];
            return (e.image = i.image), Object.assign(e, i.region), e;
        }
        intersects(t, e, i = !0) {
            const s = this.tileDescriptors[e].region,
                n = s.x,
                r = s.y,
                o = n + s.w,
                a = r + s.h,
                l = i ? -t.yHigh : t.yLow,
                h = i ? -t.yLow : t.yHigh;
            return n < t.xHigh && r < h && o > t.xLow && a > l;
        }
        tileCount() {
            return this.tileDescriptors.length;
        }
    }
    l.prototype.types.tile_images = (t, e, i) => new x(t, e, i);
    class w extends v {
        constructor(t) {
            const e = t.url;
            null == t.path && console.log("WARNING MISSING ANNOTATION PATH, SET TO ./annot/"), super(t);
            const i = null != this.format ? this.format : "vec4";
            this.addEvent("loaded", () => {
                t.path ? (this.layout.path = t.path) : null != e && this.layout.setPathFromUrl(path);
                for (let t of this.annotations) {
                    let t = new p({ format: i });
                    this.rasters.push(t);
                }
                console.log("Set " + this.annotations.length + " annotations into layout"), this.setupShader(i), this.layout.setTileDescriptors(this.annotations);
            });
        }
        length() {
            return this.annotations.length;
        }
        setTileVisible(t, e) {
            this.layout.setTileVisible(t, e);
        }
        setAllTilesVisible(t) {
            this.layout.setAllTilesVisible(t);
        }
        drawTile(t, e) {
            if (0 != t.missing) throw "Attempt to draw tile still missing textures";
            const i = t.index;
            let s = this.gl,
                n = this.shader.samplers[i].id;
            s.uniform1i(this.shader.samplers[i].location, i), s.activeTexture(s.TEXTURE0 + i), s.bindTexture(s.TEXTURE_2D, t.tex[n]);
            const r = this.getTileByteOffset(e);
            s.drawElements(s.TRIANGLES, 6, s.UNSIGNED_SHORT, r);
        }
        setupShader(t) {
            let e = [],
                i = this.rasters.length;
            for (let s = 0; s < i; ++s) e.push({ id: s, name: "kd", type: t });
            let s = new m({ label: "Rgb", samplers: e });
            (s.fragShaderSrc = function (t) {
                let e = !(t instanceof WebGLRenderingContext);
                return `${e ? "#version 300 es" : ""}\n\nprecision highp float;\nprecision highp int;\n\nuniform sampler2D kd;\n\n${e ? "in" : "varying"} vec2 v_texcoord;\n${
                    e ? "out" : ""
                } vec4 color;\n\n\nvoid main() {\n\tcolor = texture${e ? "" : "2D"}(kd, v_texcoord);\n\t${e ? "" : "gl_FragColor = color;"}\n}\n`;
            }),
                (this.shaders = { standard: s }),
                this.setShader("standard");
        }
    }
    c.prototype.types.annotation_image = (t) => new w(t);
    class b extends l {
        constructor(t, e, i) {
            super(t, null, i), this.setDefaults(e), this.init(t, e, i);
        }
        setDefaults(t) {
            super.setDefaults(t), Object.assign(this, { tilesize: 256, overlap: 0, nlevels: 1, qbox: [], bbox: [], urls: [] });
        }
        setUrls(t) {
            (this.urls = t),
                (async () => {
                    switch (this.type) {
                        case "google":
                            await this.initGoogle();
                            break;
                        case "deepzoom1px":
                            await this.initDeepzoom(!0);
                            break;
                        case "deepzoom":
                            await this.initDeepzoom(!1);
                            break;
                        case "zoomify":
                            await this.initZoomify();
                            break;
                        case "iiif":
                            await this.initIIIF();
                            break;
                        case "tarzoom":
                            await this.initTarzoom();
                            break;
                        case "itarzoom":
                            await this.initITarzoom();
                    }
                    this.initBoxes(), (this.status = "ready"), this.emit("ready");
                })().catch((t) => {
                    console.log(t), (this.status = t);
                });
        }
        index(t, e, i) {
            let s = 0;
            for (let e = 0; e < t; e++) s += this.qbox[e].xHigh * this.qbox[e].yHigh;
            return s + i * this.qbox[t].xHigh + e;
        }
        reverseIndex(t) {
            let e = t,
                i = 0;
            for (let e = 0; e < this.qbox.length; e++) {
                let s = this.qbox[e].xHigh * this.qbox[e].yHigh;
                if (t - s < 0) break;
                (t -= s), i++;
            }
            let s = this.qbox[i].xHigh,
                n = Math.floor(t / s),
                r = t % s;
            return console.assert(this.index(i, r, n) == e), { level: i, x: r, y: n };
        }
        initBoxes() {
            (this.qbox = []), (this.bbox = []);
            var t = this.width,
                e = this.height;
            if ("image" == this.type) return (this.qbox[0] = new i({ xLow: 0, yLow: 0, xHigh: 1, yHigh: 1 })), (this.bbox[0] = new i({ xLow: 0, yLow: 0, xHigh: t, yHigh: e })), this.emit("updateSize"), 1;
            for (let s = this.nlevels - 1; s >= 0; s--)
                (this.qbox[s] = new i({ xLow: 0, yLow: 0, xHigh: 0, yHigh: 0 })),
                    (this.bbox[s] = new i({ xLow: 0, yLow: 0, xHigh: t, yHigh: e })),
                    (this.qbox[s].yHigh = Math.ceil(e / this.tilesize)),
                    (this.qbox[s].xHigh = Math.ceil(t / this.tilesize)),
                    (t >>>= 1),
                    (e >>>= 1);
            this.emit("updateSize");
        }
        tileCoords(t) {
            let { level: e, x: i, y: s } = t;
            this.width, this.height;
            var n = new Float32Array([0, 1, 0, 0, 1, 0, 1, 1]);
            let r = new Float32Array([0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0]),
                o = this.nlevels - 1 - e,
                a = this.tilesize * (1 << o),
                l = a,
                h = a;
            a * (i + 1) > this.width && ((l = this.width - a * i), "google" == this.type && (n[4] = n[6] = l / a)), a * (s + 1) > this.height && ((h = this.height - a * s), "google" == this.type && (n[1] = n[7] = h / a));
            var c = this.qbox[e].xHigh - 1,
                d = this.qbox[e].yHigh - 1,
                u = this.overlap;
            if (u) {
                let t = u / (l / (1 << o) + (0 == i ? 0 : u) + (i == c ? 0 : u)),
                    e = u / (h / (1 << o) + (0 == s ? 0 : u) + (s == d ? 0 : u));
                (n[0] = n[2] = 0 == i ? 0 : t), (n[3] = n[5] = 0 == s ? 0 : e), (n[4] = n[6] = i == c ? 1 : 1 - t), (n[1] = n[7] = s == d ? 1 : 1 - e);
            }
            let p = n[1];
            (n[1] = n[7] = n[3]), (n[3] = n[5] = p);
            for (let t = 0; t < r.length; t += 3) (r[t] = r[t] * l + a * i - this.width / 2), (r[t + 1] = -r[t + 1] * h - a * s + this.height / 2);
            return { coords: r, tcoords: n };
        }
        newTile(t) {
            let e = super.newTile(t);
            return (e.index = t), Object.assign(e, this.reverseIndex(t)), e;
        }
        needed(t, e, i, s, n, r, o = 8) {
            let a = this.neededBox(t, e, i, 0, n),
                l = [],
                h = performance.now();
            for (let t = 0; t <= a.level; t++) {
                let e = a.pyramid[t],
                    i = [];
                for (let s = e.yLow; s < e.yHigh; s++)
                    for (let n = e.xLow; n < e.xHigh; n++) {
                        let e = this.index(t, n, s),
                            o = r.get(e) || this.newTile(e);
                        (o.time = h), (o.priority = a.level - t), null === o.missing && i.push(o);
                    }
                let s = e.center();
                i.sort(function (t, e) {
                    return Math.abs(t.x - s[0]) + Math.abs(t.y - s[1]) - Math.abs(e.x - s[0]) - Math.abs(e.y - s[1]);
                }),
                    (l = l.concat(i));
            }
            return l;
        }
        available(t, e, i, s, n, r) {
            let o = this.neededBox(t, e, i, 0, n),
                a = {},
                l = {},
                h = o.level,
                c = o.pyramid[h];
                
            for (let t = c.yLow; t < c.yHigh; t++)
                for (let e = c.xLow; e < c.xHigh; e++) {
                    let i = h;
                    for (; i >= 0; ) {
                        let s = h - i,
                            n = this.index(i, e >> s, t >> s);
                        if (r.has(n) && 0 == r.get(n).missing) {
                            a[n] = r.get(n);
                            break;
                        }
                        {
                            let n = (e >> (s + 1)) << 1,
                                r = (t >> (s + 1)) << 1;
                            (l[this.index(i, n, r)] = 1), (l[this.index(i, n + 1, r)] = 1), (l[this.index(i, n + 1, r + 1)] = 1), (l[this.index(i, n, r + 1)] = 1);
                        }
                        i--;
                    }
                }
            for (let t in l) t in a && (a[t].complete = !1);
            return a;
        }
        neededBox(t, e, s, n, r) {
            if ("image" == this.type) return { level: 0, pyramid: [new i({ xLow: 0, yLow: 0, xHigh: 1, yHigh: 1 })] };
            let o = Math.max(0, Math.min(Math.floor(-Math.log2(e.z) + r), this.nlevels - 1)),
                a = this.nlevels - 1 - o;
            const l = this.getViewportBox(t, e, s);
            let h = [];
            for (let t = 0; t <= a; t++) {
                let e = this.nlevels - 1 - t,
                    s = this.tilesize * Math.pow(2, e),
                    r = new i(l);
                r.quantize(s),
                    (r.xLow = Math.max(r.xLow - n, this.qbox[t].xLow)),
                    (r.yLow = Math.max(r.yLow - n, this.qbox[t].yLow)),
                    (r.xHigh = Math.min(r.xHigh + n, this.qbox[t].xHigh)),
                    (r.yHigh = Math.min(r.yHigh + n, this.qbox[t].yHigh)),
                    (h[t] = r);
            }
            return { level: a, pyramid: h };
        }
        getTileURL(t, e) {
            throw Error("Layout not defined or ready.");
        }
        async initImage() {
            (this.getTileURL = (t, e) => this.urls[t]), (this.nlevels = 1), (this.tilesize = 0);
        }
        async initGoogle() {
            if (!this.width || !this.height) throw "Google rasters require to specify width and height";
            (this.tilesize = 256), (this.overlap = 0);
            let t = Math.max(this.width, this.height) / this.tilesize;
            (this.nlevels = Math.ceil(Math.log(t) / Math.LN2) + 1),
                this.urls[0].includes("{")
                    ? (this.getTileURL = (t, e) => {
                          let i = { s: this.subdomains ? this.subdomains[Math.abs(e.x + e.y) % this.subdomains.length] : "", ...e, z: e.level };
                          return this.urls[t].replace(/{(.+?)}/g, (t, e) => i[e]);
                      })
                    : (this.getTileURL = (t, e) => this.urls[t] + "/" + e.level + "/" + e.y + "/" + e.x + "." + this.suffix);
        }
        async initDeepzoom(t) {
            let e = this.urls[0];
            var i = await fetch(e);
            if (!i.ok) throw ((this.status = "Failed loading " + e + ": " + i.statusText), new Error(this.status));
            let s = await i.text(),
                n = new window.DOMParser().parseFromString(s, "text/xml").documentElement;
            (this.suffix = n.getAttribute("Format")), (this.tilesize = parseInt(n.getAttribute("TileSize"))), (this.overlap = parseInt(n.getAttribute("Overlap")));
            let r = n.querySelector("Size");
            (this.width = parseInt(r.getAttribute("Width"))), (this.height = parseInt(r.getAttribute("Height")));
            let o = Math.max(this.width, this.height) / this.tilesize;
            (this.nlevels = Math.ceil(Math.log(o) / Math.LN2) + 1),
                (this.urls = this.urls.map((t) => t.substr(0, t.lastIndexOf(".")) + "_files/")),
                (this.skiplevels = 0),
                t && (this.skiplevels = Math.ceil(Math.log(this.tilesize) / Math.LN2)),
                (this.getTileURL = (t, e) => this.urls[t] + (e.level + this.skiplevels) + "/" + e.x + "_" + e.y + "." + this.suffix);
        }
        async initTarzoom() {
            this.tarzoom = [];
            for (let e of this.urls) {
                var t = await fetch(e);
                if (!t.ok) throw ((this.status = "Failed loading " + e + ": " + t.statusText), new Error(this.status));
                let i = await t.json();
                (i.url = e.substr(0, e.lastIndexOf(".")) + ".tzb"), Object.assign(this, i), this.tarzoom.push(i);
            }
            this.getTileURL = (t, e) => {
                const i = this.tarzoom[t];
                return (e.start = i.offsets[e.index]), (e.end = i.offsets[e.index + 1]), i.url;
            };
        }
        async initITarzoom() {
            const t = this.urls[0];
            var e = await fetch(t);
            if (!e.ok) throw ((this.status = "Failed loading " + t + ": " + e.statusText), new Error(this.status));
            let i = await e.json();
            Object.assign(this, i),
                (this.url = t.substr(0, t.lastIndexOf(".")) + ".tzb"),
                (this.getTileURL = (t, e) => {
                    let i = e.index * this.stride;
                    (e.start = this.offsets[i]), (e.end = this.offsets[i + this.stride]), (e.offsets = []);
                    for (let t = 0; t < this.stride + 1; t++) e.offsets.push(this.offsets[i + t] - e.start);
                    return this.url;
                });
        }
        async initZoomify() {
            const t = this.urls[0];
            this.overlap = 0;
            var e = await fetch(t);
            if (!e.ok) throw ((this.status = "Failed loading " + t + ": " + e.statusText), new Error(this.status));
            let i = await e.text(),
                s = new window.DOMParser().parseFromString(i, "text/xml").documentElement;
            if (((this.tilesize = parseInt(s.getAttribute("TILESIZE"))), (this.width = parseInt(s.getAttribute("WIDTH"))), (this.height = parseInt(s.getAttribute("HEIGHT"))), !this.tilesize || !this.height || !this.width))
                throw "Missing parameter files for zoomify!";
            let n = Math.max(this.width, this.height) / this.tilesize;
            (this.nlevels = Math.ceil(Math.log(n) / Math.LN2) + 1), (this.getTileURL = (e, i) => this.urls[e].substr(0, t.lastIndexOf("/")) + "/TileGroup" + (i.index >> 8) + "/" + i.level + "-" + i.x + "-" + i.y + "." + this.suffix);
        }
        async initIIIF() {
            const t = this.urls[0];
            this.overlap = 0;
            var e = await fetch(t);
            if (!e.ok) throw ((this.status = "Failed loading " + t + ": " + e.statusText), new Error(this.status));
            let i = await e.json();
            (this.width = i.width),
                (this.height = i.height),
                (this.nlevels = i.tiles[0].scaleFactors.length),
                (this.tilesize = i.tiles[0].width),
                (this.getTileURL = (e, i) => {
                    const s = this.urls[e].substr(0, t.lastIndexOf("/"));
                    let n = this.tilesize;
                    parseInt(this.nlevels - 1 - i.level);
                    let r = Math.pow(2, i.level),
                        o = i.x * n * r,
                        a = i.y * n * r,
                        l = Math.min(n * r, this.width - o),
                        h = Math.min(n * r, this.height - a),
                        c = n;
                    o + n * r > this.width && (c = (this.width - o + r - 1) / r);
                    let d = n;
                    return a + n * r > this.height && (d = (this.height - a + r - 1) / r), `${s}/${o},${a},${l},${h}/${c},${d}/0/default.jpg`;
                });
        }
    }
    let k = (t, e, i) => new b(t, e, i);
    for (let t of ["google", "deepzoom1px", "deepzoom", "zoomify", "iiif", "tarzoom", "itarzoom"]) l.prototype.types[t] = k;
    class E {
        constructor(t) {
            Object.assign(this, { active: !0, debug: !1, panDelay: 50, zoomDelay: 200, priority: 0, activeModifiers: [0] }), Object.assign(this, t);
        }
        modifierState(t) {
            let e = 0;
            return t.ctrlKey && (e += 1), t.shiftKey && (e += 2), t.altKey && (e += 4), e;
        }
        captureEvents() {
            this.capture = !0;
        }
        releaseEvents() {
            this.capture = !1;
        }
    }
    function T(t, e, i) {
        return Math.max(e, Math.min(i, t));
    }
    class S extends E {
        constructor(t, e) {
            super(e),
                Object.assign(this, { relative: !1, speed: 2, start_x: 0, start_y: 0, current_x: 0, current_y: 0, onPanStart: null, onPanEnd: null }, e),
                (this.callback = t),
                this.box || (this.box = new i({ xLow: -0.99, yLow: -0.99, xHigh: 0.99, yHigh: 0.99 })),
                (this.panning = !1);
        }
        setPosition(t, e) {
            (this.current_x = t), (this.current_y = e), this.callback(t, e);
        }
        project(t) {
            let e = t.target.getBoundingClientRect();
            return [(2 * t.offsetX) / e.width - 1, 2 * (1 - t.offsetY / e.height) - 1];
        }
        rangeCoords(t) {
            let [e, i] = this.project(t);
            return this.relative && ((e = T(this.speed * (e - this.start_x) + this.current_x, -1, 1)), (i = T(this.speed * (i - this.start_y) + this.current_y, -1, 1))), [e, i];
        }
        panStart(t) {
            if (this.active && this.activeModifiers.includes(this.modifierState(t))) {
                if (this.relative) {
                    let [e, i] = this.project(t);
                    (this.start_x = e), (this.start_y = i);
                }
                this.onPanStart && this.onPanStart(...this.rangeCoords(t)), this.callback(...this.rangeCoords(t)), (this.panning = !0), t.preventDefault();
            }
        }
        panMove(t) {
            if (!this.panning) return !1;
            this.callback(...this.rangeCoords(t));
        }
        panEnd(t) {
            if (!this.panning) return !1;
            if (((this.panning = !1), this.relative)) {
                let [e, i] = this.project(t);
                (this.current_x = T(this.speed * (e - this.start_x) + this.current_x, -1, 1)), (this.current_y = T(this.speed * (i - this.start_y) + this.current_y, -1, 1));
            }
            this.onPanEnd && this.onPanEnd(...this.rangeCoords(t));
        }
        fingerSingleTap(t) {
            this.active && this.activeModifiers.includes(this.modifierState(t)) && (this.relative || (this.callback(...this.rangeCoords(t)), t.preventDefault()));
        }
    }
    class L extends E {
        constructor(t, e) {
            super(e),
                (this.camera = t),
                (this.zoomAmount = 1.2),
                (this.controlZoom = !1),
                (this.panning = !1),
                (this.initialTransform = null),
                (this.startMouse = null),
                (this.zooming = !1),
                (this.initialDistance = 0),
                (this.useGLcoords = !1),
                e && Object.assign(this, e);
        }
        panStart(t) {
            if (!this.active || this.panning || !this.activeModifiers.includes(this.modifierState(t))) return;
            (this.panning = !0), (this.startMouse = a.fromCanvasHtmlToViewport({ x: t.offsetX, y: t.offsetY }, this.camera, this.useGLcoords));
            let e = performance.now();
            (this.initialTransform = this.camera.getCurrentTransform(e)), (this.camera.target = this.initialTransform.copy()), t.preventDefault();
        }
        panMove(t) {
            if (!this.panning) return;
            let e = this.initialTransform;
            const i = a.fromCanvasHtmlToViewport({ x: t.offsetX, y: t.offsetY }, this.camera, this.useGLcoords);
            let s = i.x - this.startMouse.x,
                n = i.y - this.startMouse.y;
            this.camera.setPosition(this.panDelay, e.x + s, e.y + n, e.z, e.a);
        }
        panEnd(t) {
            this.panning = !1;
        }
        distance(t, e) {
            return Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
        }
        pinchStart(t, e) {
            (this.zooming = !0), (this.initialDistance = Math.max(30, this.distance(t, e))), t.preventDefault();
        }
        pinchMove(t, e) {
            if (!this.zooming) return;
            let i = t.target.getBoundingClientRect(),
                s = t.clientX - i.left,
                n = t.clientY - i.top,
                r = e.target.getBoundingClientRect(),
                o = e.clientX - r.left,
                l = e.clientY - r.top;
            const h = this.distance(t, e),
                c = a.fromCanvasHtmlToScene({ x: (s + o) / 2, y: (n + l) / 2 }, this.camera, this.useGLcoords),
                d = h / this.initialDistance;
            this.camera.deltaZoom(this.zoomDelay, d, c.x, c.y), (this.initialDistance = h), t.preventDefault();
        }
        pinchEnd(t, e, i, s) {
            (this.zooming = !1), t.preventDefault();
        }
        mouseWheel(t) {
            if (this.controlZoom && !t.ctrlKey) return void this.emit("nowheel");
            let e = -t.deltaY / 53;
            const i = a.fromCanvasHtmlToScene({ x: t.offsetX, y: t.offsetY }, this.camera, this.useGLcoords),
                s = Math.pow(this.zoomAmount, e);
            this.camera.deltaZoom(this.zoomDelay, s, i.x, i.y), t.preventDefault();
        }
        fingerDoubleTap(t) {
            if (!this.active || !this.activeModifiers.includes(this.modifierState(t))) return;
            const e = a.fromCanvasHtmlToScene({ x: t.offsetX, y: t.offsetY }, this.camera, this.useGLcoords),
                i = this.zoomAmount;
            this.camera.deltaZoom(this.zoomDelay, i, e.x, e.y);
        }
    }
    n(L, "nowheel");
    class M {
        constructor(t, e) {
            (this.target = t),
                Object.assign(this, { diagonal: 27, pinchMaxInterval: 200 }),
                e && Object.assign(this, e),
                (this.idleTimeout = null),
                (this.idleTime = 60),
                (this.idling = !1),
                (this.currentPointers = []),
                (this.eventObservers = new Map()),
                (this.ppmm = M.getPPMM(this.diagonal)),
                (this.target.style.touchAction = "none"),
                this.target.addEventListener("pointerdown", (t) => this.handleEvent(t), !1),
                this.target.addEventListener("pointermove", (t) => this.handleEvent(t), !1),
                this.target.addEventListener("pointerup", (t) => this.handleEvent(t), !1),
                this.target.addEventListener("pointercancel", (t) => this.handleEvent(t), !1),
                this.target.addEventListener("wheel", (t) => this.handleEvent(t), !1);
        }
        static get ANYPOINTER() {
            return -1;
        }
        static splitStr(t) {
            return t.trim().split(/\s+/g);
        }
        static getPPMM(t) {
            return Math.round(Math.sqrt(screen.width ** 2 + screen.height ** 2) / t / 25.4);
        }
        on(t, e, i = M.ANYPOINTER) {
            return (
                (t = M.splitStr(t)),
                "function" == typeof e && ((e = Object.fromEntries(t.map((t) => [t, e]))).priority = -1e3),
                t.forEach((t) => {
                    if (i == M.ANYPOINTER) this.broadcastOn(t, e);
                    else {
                        const s = this.currentPointers[i];
                        if (!s) throw new Error("Bad Index");
                        s.on(t, e);
                    }
                }),
                e
            );
        }
        off(t, e, i = M.ANYPOINTER) {
            i == M.ANYPOINTER
                ? this.broadcastOff(t, e)
                : M.splitStr(t).forEach((t) => {
                      const s = this.currentPointers[i];
                      if (!s) throw new Error("Bad Index");
                      s.off(t, e);
                  });
        }
        onEvent(t) {
            const e = ["fingerHover", "fingerSingleTap", "fingerDoubleTap", "fingerHold", "mouseWheel", "wentIdle", "activeAgain"];
            if (!t.hasOwnProperty("priority")) throw new Error("Event handler has not priority property");
            if (!e.some((e) => "function" == typeof t[e])) throw new Error("Event handler properties are wrong or missing");
            for (let i of e) "function" == typeof t[i] && this.on(i, t);
            t.panStart && this.onPan(t), t.pinchStart && this.onPinch(t);
        }
        onPan(t) {
            if (!t.hasOwnProperty("priority")) throw new Error("Event handler has not priority property");
            if (!["panStart", "panMove", "panEnd"].every((e) => "function" == typeof t[e])) throw new Error("Pan handler is missing one of this functions: panStart, panMove or panEnd");
            (t.fingerMovingStart = (e) => {
                t.panStart(e),
                    e.defaultPrevented &&
                        (this.on(
                            "fingerMoving",
                            (e) => {
                                t.panMove(e);
                            },
                            e.idx
                        ),
                        this.on(
                            "fingerMovingEnd",
                            (e) => {
                                t.panEnd(e);
                            },
                            e.idx
                        ));
            }),
                this.on("fingerMovingStart", t);
        }
        onPinch(t) {
            if (!t.hasOwnProperty("priority")) throw new Error("Event handler has not priority property");
            if (!["pinchStart", "pinchMove", "pinchEnd"].every((e) => "function" == typeof t[e])) throw new Error("Pinch handler is missing one of this functions: pinchStart, pinchMove or pinchEnd");
            (t.fingerDown = (e) => {
                const i = this.currentPointers.filter((t) => t && t.idx != e.idx && t.status == t.stateEnum.DETECT);
                if (0 == i.length) return;
                const s = [];
                for (let t of i) {
                    let e = null;
                    for (let i of t.eventHistory.toArray()) "fingerDown" == i.fingerType && (e = i);
                    e && s.push(e);
                }
                s.sort((t, e) => e.timeStamp - t.timeStamp);
                for (let i of s) {
                    if (e.timeStamp - i.timeStamp > this.pinchMaxInterval) break;
                    if ((t.pinchStart(e, i), !e.defaultPrevented)) break;
                    clearTimeout(this.currentPointers[e.idx].timeout),
                        clearTimeout(this.currentPointers[i.idx].timeout),
                        this.on("fingerMovingStart", (t) => t.preventDefault(), e.idx),
                        this.on("fingerMovingStart", (t) => t.preventDefault(), i.idx),
                        this.on("fingerMoving", (s) => i && t.pinchMove((e = s), i), e.idx),
                        this.on("fingerMoving", (s) => e && t.pinchMove(e, (i = s)), i.idx),
                        this.on(
                            "fingerMovingEnd",
                            (s) => {
                                i && t.pinchEnd(s, i), (e = i = null);
                            },
                            e.idx
                        ),
                        this.on(
                            "fingerMovingEnd",
                            (s) => {
                                e && t.pinchEnd(e, s), (e = i = null);
                            },
                            i.idx
                        );
                    break;
                }
            }),
                this.on("fingerDown", t);
        }
        broadcastOn(t, e) {
            const i = this.eventObservers.get(t);
            i ? i.push(e) : this.eventObservers.set(t, [e]);
        }
        broadcastOff(t, e) {
            M.splitStr(t).forEach((t) => {
                if (this.eventObservers.has(t))
                    if (e) {
                        const i = this.eventObservers.get(t),
                            s = i.indexOf(e);
                        s > -1 && i.splice(s, 1), 0 == i.length && this.eventObservers.delete(t);
                    } else this.eventObservers.delete(t);
            });
        }
        broadcast(t) {
            this.eventObservers.has(t.fingerType) &&
                this.eventObservers
                    .get(t.fingerType)
                    .sort((t, e) => e.priority - t.priority)
                    .every((e) => (e[t.fingerType](t), !t.defaultPrevented));
        }
        addCurrPointer(t) {
            let e = -1;
            for (let t = 0; t < this.currentPointers.length && e < 0; t++) null == this.currentPointers[t] && (e = t);
            return e < 0 ? (this.currentPointers.push(t), (e = this.currentPointers.length - 1)) : (this.currentPointers[e] = t), e;
        }
        removeCurrPointer(t) {
            for (this.currentPointers[t] = null; this.currentPointers.length > 0 && null == this.currentPointers[this.currentPointers.length - 1]; ) this.currentPointers.pop();
        }
        handleEvent(t) {
            this.idling
                ? (this.broadcast({ fingerType: "activeAgain" }), (this.idling = !1))
                : (this.idleTimeout && clearTimeout(this.idleTimeout),
                  (this.idleTimeout = setTimeout(() => {
                      this.broadcast({ fingerType: "wentIdle" }), (this.idling = !0);
                  }, 1e3 * this.idleTime))),
                "pointerdown" == t.type && this.target.setPointerCapture(t.pointerId),
                "pointercancel" == t.type && console.log(t);
            let e = !1;
            for (let i = 0; i < this.currentPointers.length && !e; i++) {
                const s = this.currentPointers[i];
                s && ((e = s.handleEvent(t)), s.isDone() && this.removeCurrPointer(i));
            }
            if (!e) {
                e = new C(this, t.pointerId, { ppmm: this.ppmm }).handleEvent(t);
            }
        }
    }
    class C {
        constructor(t, e, i) {
            (this.parent = t),
                (this.pointerId = e),
                Object.assign(this, { ppmm: 3 }),
                i && Object.assign(this, i),
                (this.eventHistory = new A(10)),
                (this.isActive = !1),
                (this.startTap = 0),
                (this.threshold = 15),
                (this.eventObservers = new Map()),
                (this.isDown = !1),
                (this.done = !1),
                (this.stateEnum = { IDLE: 0, DETECT: 1, HOVER: 2, MOVING_START: 3, MOVING: 4, MOVING_END: 5, HOLD: 6, TAPS_DETECT: 7, SINGLE_TAP: 8, DOUBLE_TAP_DETECT: 9, DOUBLE_TAP: 10 }),
                (this.status = this.stateEnum.IDLE),
                (this.timeout = null),
                (this.holdTimeoutThreshold = 600),
                (this.tapTimeoutThreshold = 100),
                (this.oldDownPos = { clientX: 0, clientY: 0 }),
                (this.movingThreshold = 1),
                (this.idx = this.parent.addCurrPointer(this));
        }
        static distance(t, e, i, s) {
            return Math.sqrt((i - t) ** 2 + (s - e) ** 2);
        }
        distanceMM(t, e, i, s) {
            return C.distance(t, e, i, s) / this.ppmm;
        }
        on(t, e) {
            this.eventObservers.set(t, e);
        }
        off(t) {
            this.eventObservers.has(t) && this.eventObservers.delete(t);
        }
        addToHistory(t) {
            this.eventHistory.push(t);
        }
        prevPointerEvent() {
            return this.eventHistory.last();
        }
        handlePointerDown(t) {
            this.startTap = t.timeStamp;
        }
        handlePointerUp(t) {
            t.timeStamp, this.startTap;
        }
        isLikelySamePointer(t) {
            let e = this.pointerId == t.pointerId;
            if (!e && !this.isDown && "pointerdown" == t.type) {
                const i = this.prevPointerEvent();
                i && (e = t.pointerType == i.pointerType && this.distanceMM(t.clientX, t.clientY, i.clientX, i.clientY) < this.threshold);
            }
            return e;
        }
        emit(t) {
            (this.eventObservers.has(t.fingerType) && (this.eventObservers.get(t.fingerType)[t.fingerType](t), t.defaultPrevented)) || this.parent.broadcast(t);
        }
        createOutputEvent(t, e) {
            const i = t;
            (i.fingerType = e), (i.originSrc = this.originSrc), (i.speedX = 0), (i.speedY = 0), (i.idx = this.idx);
            const s = this.prevPointerEvent();
            if (s && "pointermove" == t.type) {
                const t = i.timeStamp - s.timeStamp;
                t > 0 && ((i.speedX = ((i.clientX - s.clientX) / t) * 1e3), (i.speedY = ((i.clientY - s.clientY) / t) * 1e3));
            }
            return i;
        }
        processEvent(t) {
            let e = 0;
            if (
                ("pointerdown" == t.type && ((this.oldDownPos.clientX = t.clientX), (this.oldDownPos.clientY = t.clientY), (this.isDown = !0)),
                ("pointerup" != t.type && "pointercancel" != t.type) || (this.isDown = !1),
                "pointermove" == t.type && this.isDown && (e = this.distanceMM(t.clientX, t.clientY, this.oldDownPos.clientX, this.oldDownPos.clientY)),
                "wheel" != t.type)
            ) {
                switch (this.status) {
                    case this.stateEnum.HOVER:
                    case this.stateEnum.IDLE:
                        if ("pointermove" == t.type) this.emit(this.createOutputEvent(t, "fingerHover")), (this.status = this.stateEnum.HOVER), (this.originSrc = t.composedPath()[0]);
                        else if ("pointerdown" == t.type) {
                            if (((this.status = this.stateEnum.DETECT), this.emit(this.createOutputEvent(t, "fingerDown")), t.defaultPrevented)) {
                                this.status = this.stateEnum.MOVING;
                                break;
                            }
                            (this.originSrc = t.composedPath()[0]),
                                (this.timeout = setTimeout(() => {
                                    this.emit(this.createOutputEvent(t, "fingerHold")), t.defaultPrevented && (this.status = this.stateEnum.IDLE);
                                }, this.holdTimeoutThreshold));
                        }
                        break;
                    case this.stateEnum.DETECT:
                        "pointercancel" == t.type
                            ? (clearTimeout(this.timeout), (this.status = this.stateEnum.IDLE), this.emit(this.createOutputEvent(t, "fingerHold")))
                            : "pointermove" == t.type && e > this.movingThreshold
                            ? (clearTimeout(this.timeout), (this.status = this.stateEnum.MOVING), this.emit(this.createOutputEvent(t, "fingerMovingStart")))
                            : "pointerup" == t.type &&
                              (clearTimeout(this.timeout),
                              (this.status = this.stateEnum.TAPS_DETECT),
                              (this.timeout = setTimeout(() => {
                                  (this.status = this.stateEnum.IDLE), this.emit(this.createOutputEvent(t, "fingerSingleTap"));
                              }, this.tapTimeoutThreshold)));
                        break;
                    case this.stateEnum.TAPS_DETECT:
                        "pointerdown" == t.type
                            ? (clearTimeout(this.timeout),
                              (this.status = this.stateEnum.DOUBLE_TAP_DETECT),
                              (this.timeout = setTimeout(() => {
                                  this.emit(this.createOutputEvent(t, "fingerHold")), t.defaultPrevented && (this.status = this.stateEnum.IDLE);
                              }, this.tapTimeoutThreshold)))
                            : "pointermove" == t.type && e > this.movingThreshold && (clearTimeout(this.timeout), (this.status = this.stateEnum.IDLE), this.emit(this.createOutputEvent(t, "fingerHover")));
                        break;
                    case this.stateEnum.DOUBLE_TAP_DETECT:
                        ("pointerup" != t.type && "pointercancel" != t.type) || (clearTimeout(this.timeout), (this.status = this.stateEnum.IDLE), this.emit(this.createOutputEvent(t, "fingerDoubleTap")));
                        break;
                    case this.stateEnum.DOUBLE_TAP_DETECT:
                        "pointermove" == t.type && e > this.movingThreshold && ((this.status = this.stateEnum.MOVING), this.emit(this.createOutputEvent(t, "fingerMovingStart")));
                        break;
                    case this.stateEnum.MOVING:
                        "pointermove" == t.type
                            ? this.emit(this.createOutputEvent(t, "fingerMoving"))
                            : ("pointerup" != t.type && "pointercancel" != t.type) || ((this.status = this.stateEnum.IDLE), this.emit(this.createOutputEvent(t, "fingerMovingEnd")));
                        break;
                    default:
                        console.log("ERROR " + this.status), console.log(t);
                }
                this.addToHistory(t);
            } else this.emit(this.createOutputEvent(t, "mouseWheel"));
        }
        handleEvent(t) {
            let e = !1;
            return this.isLikelySamePointer(t) && ((this.pointerId = t.pointerId), this.processEvent(t), (e = !0)), e;
        }
        isDone() {
            return this.status == this.stateEnum.IDLE;
        }
    }
    class A {
        constructor(t) {
            if ("number" != typeof t || !Number.isInteger(t) || t < 1) throw new TypeError("Invalid capacity");
            (this.buffer = new Array(t)), (this.capacity = t), (this.first = 0), (this.size = 0);
        }
        clear() {
            (this.first = 0), (this.size = 0);
        }
        empty() {
            return 0 == this.size;
        }
        size() {
            return this.size;
        }
        capacity() {
            return this.capacity;
        }
        first() {
            let t = null;
            return this.size > 0 && (t = this.buffer[this.first]), t;
        }
        last() {
            let t = null;
            return this.size > 0 && (t = this.buffer[(this.first + this.size - 1) % this.capacity]), t;
        }
        enqueue(t) {
            (this.first = this.first > 0 ? this.first - 1 : (this.first = this.capacity - 1)), (this.buffer[this.first] = t), this.size < this.capacity && this.size++;
        }
        push(t) {
            this.size == this.capacity ? ((this.buffer[this.first] = t), (this.first = (this.first + 1) % this.capacity)) : ((this.buffer[(this.first + this.size) % this.capacity] = t), this.size++);
        }
        dequeue() {
            if (0 == this.size) throw new RangeError("Dequeue on empty buffer");
            const t = this.buffer[(this.first + this.size - 1) % this.capacity];
            return this.size--, t;
        }
        pop() {
            return this.dequeue();
        }
        shift() {
            if (0 == this.size) throw new RangeError("Shift on empty buffer");
            const t = this.buffer[this.first];
            return this.first == this.capacity - 1 ? (this.first = 0) : this.first++, this.size--, t;
        }
        get(t, e) {
            if (0 == this.size && 0 == t && (null == e || 0 == e)) return [];
            if ("number" != typeof t || !Number.isInteger(t) || t < 0) throw new TypeError("Invalid start value");
            if (t >= this.size) throw new RangeError("Start index past end of buffer: " + t);
            if (null == e) return this.buffer[(this.first + t) % this.capacity];
            if ("number" != typeof e || !Number.isInteger(e) || e < 0) throw new TypeError("Invalid end value");
            if (e >= this.size) throw new RangeError("End index past end of buffer: " + e);
            return (
                this.first + t >= this.capacity && ((t -= this.capacity), (e -= this.capacity)),
                this.first + e < this.capacity ? this.buffer.slice(this.first + t, this.first + e + 1) : this.buffer.slice(this.first + t, this.capacity).concat(this.buffer.slice(0, this.first + e + 1 - this.capacity))
            );
        }
        toArray() {
            return 0 == this.size ? [] : this.get(0, this.size - 1);
        }
    }
    class z {
        constructor(t, e) {
            if ((Object.assign(this, { background: null, autofit: !0, canvas: {}, camera: new r() }), "string" == typeof t && (t = document.querySelector(t)), !t)) throw "Missing element parameter";
            Object.assign(this, e),
                this.background && (t.style.background = this.background),
                (this.containerElement = t),
                (this.canvasElement = t.querySelector("canvas")),
                this.canvasElement || ((this.canvasElement = document.createElement("canvas")), t.prepend(this.canvasElement)),
                (this.overlayElement = document.createElement("div")),
                this.overlayElement.classList.add("openlime-overlay"),
                this.containerElement.appendChild(this.overlayElement),
                (this.canvas = new d(this.canvasElement, this.overlayElement, this.camera, this.canvas)),
                this.canvas.addEvent("update", () => {
                    this.redraw();
                }),
                this.autofit && this.canvas.addEvent("updateSize", () => this.camera.fitCameraBox(0)),
                (this.pointerManager = new M(this.overlayElement)),
                this.canvasElement.addEventListener("contextmenu", (t) => (t.preventDefault(), !1)),
                new ResizeObserver((t) => {
                    for (let e of t) this.resize(e.contentRect.width, e.contentRect.height);
                }).observe(this.canvasElement),
                this.resize(this.canvasElement.clientWidth, this.canvasElement.clientHeight);
        }
        addController(t) {
            this.pointerManager.onEvent(t);
        }
        addLayer(t, e) {
            this.canvas.addLayer(t, e), this.redraw();
        }
        removeLayer(t) {
            "string" == typeof t && (t = this.canvas.layers[t]), t && (this.canvas.removeLayer(t), this.redraw());
        }
        resize(t, e) {
            (this.canvasElement.width = t * window.devicePixelRatio), (this.canvasElement.height = e * window.devicePixelRatio);
            let i = { x: 0, y: 0, dx: t, dy: e, w: t, h: e };
            this.camera.setViewport(i), this.emit("resize", i), this.canvas.prefetch(), this.redraw();
        }
        redraw() {
            this.animaterequest ||
                (this.animaterequest = requestAnimationFrame((t) => {
                    this.draw(t);
                }));
        }
        draw(t) {
            t || (t = performance.now()), (this.animaterequest = null), this.camera.viewport, this.camera.getCurrentTransform(t), this.canvas.draw(t) || this.redraw(), this.emit("draw");
        }
    }
    n(z, "draw"), n(z, "resize");
    let R = "skin/skin.svg",
        B = null;
    class O {
        static setUrl(t) {
            R = t;
        }
        static async loadSvg() {
            var t = await fetch(R);
            if (!t.ok) throw Error("Failed loading " + R + ": " + t.statusText);
            let e = await t.text(),
                i = new DOMParser();
            B = i.parseFromString(e, "image/svg+xml").documentElement;
        }
        static async getElement(t) {
            return B || (await O.loadSvg()), B.querySelector(t).cloneNode(!0);
        }
        static async appendIcon(t, e) {
            let i = null;
            if ("string" == typeof e) {
                (i = await O.getElement(e)), (e = document.createElementNS("http://www.w3.org/2000/svg", "svg")).appendChild(i), t.appendChild(e);
                let s = i.getBBox(),
                    n = i.transform.baseVal;
                0 == n.numberOfItems && n.appendItem(e.createSVGTransform()),
                    n.getItem(0).setTranslate(-s.x, -s.y),
                    e.setAttribute("viewBox", `-5 -5 ${s.width + 10} ${s.height + 10}`),
                    e.setAttribute("preserveAspectRatio", "xMidYMid meet");
            } else {
                t.appendChild(e);
                let i = e.getBBox();
                e.setAttribute("viewBox", `-5 -5 ${i.width + 10} ${i.height + 10}`), e.setAttribute("preserveAspectRatio", "xMidYMid meet");
            }
            return e;
        }
    }
    class _ {
        constructor(t) {
            (this.units = ["km", "m", "cm", "mm"]), (this.allUnits = { mm: 1, cm: 10, m: 1e3, km: 1e6, in: 254, ft: 3048 }), (this.precision = 2), t && Object.assign(t, this);
        }
        format(t, e) {
            if (0 == t) return "";
            if (e) return (t / this.allUnits[e]).toFixed(this.precision) + e;
            let i = null,
                s = 100;
            for (let e of this.units) {
                let n = this.allUnits[e],
                    r = t <= 0 ? 0 : Math.abs(Math.log10(t / n) - 1);
                r < s && ((i = e), (s = r));
            }
            return this.format(t, i);
        }
    }
    class D extends _ {
        constructor(t, i, s) {
            super(s),
                (s = Object.assign(this, { pixelSize: t, viewer: i, width: 200, fontSize: 24, precision: 0 }, s)),
                Object.assign(this, s),
                (this.svg = e.createSVGElement("svg", { viewBox: `0 0 ${this.width} 30` })),
                this.svg.classList.add("openlime-scale"),
                (this.line = e.createSVGElement("line", { x1: 5, y1: 26.5, x2: this.width - 5, y2: 26.5 })),
                (this.text = e.createSVGElement("text", { x: "50%", y: "16px", "dominant-basiline": "middle", "text-anchor": "middle" })),
                (this.text.textContent = ""),
                this.svg.appendChild(this.line),
                this.svg.appendChild(this.text),
                this.viewer.containerElement.appendChild(this.svg),
                this.viewer.addEvent("draw", () => {
                    this.updateScale();
                });
        }
        updateScale() {
            let t = this.viewer.camera.target.z;
            if (t == this.lastScaleZoom) return;
            this.lastScaleZoom = t;
            let e = this.bestLength(this.width / 2, this.width, this.pixelSize, t),
                i = this.width - e.length;
            this.line.setAttribute("x1", i / 2), this.line.setAttribute("x2", this.width - i / 2), (this.text.textContent = this.format(e.label));
        }
        bestLength(t, e, i, s) {
            i /= s;
            let n = Math.pow(10, Math.floor(Math.log(e * i) / Math.log(10))),
                r = n / i;
            if (r > t) return { length: r, label: n };
            let o = 2 * r;
            if (o > t) return { length: o, label: 2 * n };
            let a = 5 * r;
            return a > t ? { length: a, label: 5 * n } : { length: 0, label: 0 };
        }
    }
    class P extends _ {
        constructor(t, e, i) {
            super(i),
                Object.assign(this, {
                    viewer: t,
                    camera: t.camera,
                    overlay: t.overlayElement,
                    pixelSize: e,
                    enabled: !1,
                    priority: 100,
                    measure: null,
                    history: [],
                    fontSize: 18,
                    markerSize: 8,
                    cursor: "crosshair",
                    svg: null,
                    first: null,
                    second: null,
                }),
                i && Object.assign(this, i);
        }
        start() {
            (this.enabled = !0),
                (this.previousCursor = this.overlay.style.cursor),
                (this.overlay.style.cursor = this.cursor),
                this.svg ||
                    ((this.svg = e.createSVGElement("svg", { class: "openlime-ruler" })),
                    (this.svgGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")),
                    this.svg.append(this.svgGroup),
                    this.overlay.appendChild(this.svg),
                    this.viewer.addEvent("draw", () => this.update()),
                    this.update());
        }
        end() {
            (this.enabled = !1), (this.overlay.style.cursor = this.previousCursor), this.clear();
        }
        clear() {
            this.svgGroup.replaceChildren([]), (this.measure = null), (this.history = []);
        }
        update() {
            if (!this.history.length) return;
            let t = this.camera.getGlCurrentTransform(performance.now()),
                e = this.camera.glViewport();
            this.svg.setAttribute("viewBox", `${-e.w / 2} ${-e.h / 2} ${e.w} ${e.h}`);
            let i = 0,
                s = 0;
            this.svgGroup.setAttribute("transform", `translate(${t.x} ${t.y}) rotate(${-t.a} 0 0) scale(${t.z} ${t.z}) translate(${i} ${s})`);
            for (let e of this.history) this.updateMeasure(e, t);
        }
        createMarker(t, i) {
            let s = e.createSVGElement("path");
            return this.svgGroup.appendChild(s), s;
        }
        updateMarker(t, e, i, s) {
            let n = `M ${e - s} ${i} L ${e + s} ${i} M ${e} ${i - s} L ${e} ${i + s}`;
            t.setAttribute("d", n);
        }
        updateText(t, e) {
            t.text.setAttribute("font-size", e + "px");
            let i = t.x1 - t.x2,
                s = t.y1 - t.y2,
                n = Math.sqrt(i * i + s * s);
            n > 0 && ((i /= n), (s /= n)), i < 0 && ((i = -i), (s = -s));
            let r = (t.x1 + t.x2) / 2,
                o = (t.y1 + t.y2) / 2;
            s / i < 0 ? ((r -= 0.25 * s * e), (o += i * e)) : ((o -= 0.25 * e), (r += 0.25 * e)), t.text.setAttribute("x", r), t.text.setAttribute("y", o), (t.text.textContent = this.format(n * this.pixelSize));
        }
        createMeasure(t, i) {
            let s = { marker1: this.createMarker(t, i), x1: t, y1: i, marker2: this.createMarker(t, i), x2: t, y2: i };
            return (s.line = e.createSVGElement("line", { x1: s.x1, y1: s.y1, x2: s.x2, y2: s.y2 })), this.svgGroup.appendChild(s.line), (s.text = e.createSVGElement("text")), (s.text.textContent = ""), this.svgGroup.appendChild(s.text), s;
        }
        updateMeasure(t, e) {
            let i = (window.devicePixelRatio * this.markerSize) / e.z;
            this.updateMarker(t.marker1, t.x1, t.y1, i), this.updateMarker(t.marker2, t.x2, t.y2, i);
            let s = (window.devicePixelRatio * this.fontSize) / e.z;
            this.updateText(t, s);
            for (let e of ["x1", "y1", "x2", "y2"]) t.line.setAttribute(e, t[e]);
        }
        fingerSingleTap(t) {
            if (!this.enabled) return !1;
            let e = this.camera.getCurrentTransform(performance.now()),
                { x: i, y: s } = this.camera.mapToScene(t.layerX, t.layerY, e);
            this.measure ? ((this.measure.x2 = i), (this.measure.y2 = s), (this.measure = null)) : ((this.measure = this.createMeasure(i, s)), this.history.push(this.measure)), this.update(), t.preventDefault();
        }
        fingerHover(t) {
            if (!this.enabled || !this.measure) return !1;
            let e = this.camera.getCurrentTransform(performance.now()),
                { x: i, y: s } = this.camera.mapToScene(t.layerX, t.layerY, e);
            (this.measure.x2 = i), (this.measure.y2 = s), this.update(), t.preventDefault();
        }
    }
    class $ {
        constructor(t, e) {
            let i = t.camera;
            Object.assign(this, {
                viewer: t,
                camera: t.camera,
                skin: "skin/skin.svg",
                autoFit: !0,
                actions: {
                    home: {
                        title: "Home",
                        display: !0,
                        key: "Home",
                        task: (t) => {
                            i.boundingBox && i.fitCameraBox(250);
                        },
                    },
                    zoomin: {
                        title: "Zoom in",
                        display: !0,
                        key: "+",
                        task: (t) => {
                            i.deltaZoom(250, 1.25, 0, 0);
                        },
                    },
                    zoomout: {
                        title: "Zoom out",
                        display: !0,
                        key: "-",
                        task: (t) => {
                            i.deltaZoom(250, 0.8, 0, 0);
                        },
                    },
                  
                    layers: {
                        title: "Layers",
                        display: !0,
                        key: "Escape",
                        task: (t) => {
                            this.toggleLayers();
                        },
                    },
                 
                    rotate: {
                        title: "Rotate",
                        display: !1,
                        key: "r",
                        task: (t) => {
                            i.rotate(250, 90);
                        },
                    },
                
                    light: {
                        title: "light",
                        display: "auto",
                        key: "l",
                        task: (t) => {
                            this.toggleLightController();
                        },
                    },
                    ruler: {
                        title: "Draw",
                        display: !0,
                        task: (t) => {
                            this.toggleRuler();
                        },
                    },
                    fullscreen: {
                        title: "Fullscreen",
                        display: !0,
                        key: "f",
                        task: (t) => {
                            this.toggleFullscreen();
                        },
                    },
                    help: {
                        title: "Help",
                        display: !1,
                        key: "?",
                        task: (t) => {
                            this.toggleHelp(this.actions.help);
                        },
                        html: "<p>Help here!</p>",
                    },
                    snapshot: {
                        title: "Snapshot",
                        display: !1,
                        task: (t) => {
                            this.snapshot();
                        },
                    },
                },
                pixelSize: null,
                unit: null,
                attribution: null,
                lightcontroller: null,
                showLightDirections: !1,
                enableTooltip: !0,
                controlZoomMessage: null,
                menu: [],
            }),
                Object.assign(this, e),
                this.autoFit && this.viewer.canvas.addEvent("updateSize", () => this.viewer.camera.fitCameraBox(0)),
                (this.panzoom = new L(this.viewer.camera, { priority: -1e3, activeModifiers: [0, 1], controlZoom: null != this.controlZoomMessage })),
                this.controlZoomMessage &&
                    this.panzoom.addEvent("nowheel", () => {
                        this.showOverlayMessage(this.controlZoomMessage);
                    }),
                this.viewer.pointerManager.onEvent(this.panzoom),
                this.menu.push({ section: "Layers" });
                    for (let [t, e] of Object.entries(this.viewer.canvas.layers)) {
                        let i = [];
                        for (let s of e.getModes()) {
                            let displayName = s.charAt(0).toUpperCase() + s.slice(1); //capitalize the first letter
                            let n = {
                                button: displayName, 
                                mode: s, 
                                layer: t,
                                onclick: () => {
                                    e.setMode(s); 
                                },
                                status: () => (e.getMode() == s ? "active" : ""),
                            };
                            if ("Specular" == s && e.shader.setSpecularExp) {
                                n.list = [{
                                    slider: "",
                                    oninput: (t) => {
                                        e.shader.setSpecularExp(t.target.value);
                                    },
                                }];
                            }
                            i.push(n);
                        }
                        let s = {
                            button: e.label || t,
                            onclick: () => {
                                this.setLayer(e);
                            },
                            status: () => (e.visible ? "active" : ""),
                            list: i,
                            layer: t,
                        };
                        e.annotations && s.list.push(e.annotationsEntry()), this.menu.push(s);
                    }
            let s = new S(
                (t, e) => {
                    for (let i of n) i.setLight([t, e], 0);
                    this.showLightDirections && this.updateLightDirections(t, e), this.emit("lightdirection", [t, e, Math.sqrt(1 - t * t + e * e)]);
                },
                {
                    active: !1,
                    activeModifiers: [2, 4],
                    control: "light",
                    onPanStart: this.showLightDirections
                        ? () => {
                              Object.values(this.viewer.canvas.layers)
                                  .filter((t) => null != t.annotations)
                                  .forEach((t) => t.setVisible(!1)),
                                  this.enableLightDirections(!0);
                          }
                        : null,
                    onPanEnd: this.showLightDirections
                        ? () => {
                              Object.values(this.viewer.canvas.layers)
                                  .filter((t) => null != t.annotations)
                                  .forEach((t) => t.setVisible(!0)),
                                  this.enableLightDirections(!1);
                          }
                        : null,
                    relative: !0,
                }
            );
            (s.priority = 0), this.viewer.pointerManager.onEvent(s), (this.lightcontroller = s);
            let n = [];
            for (let [t, e] of Object.entries(this.viewer.canvas.layers)) e.controls.light && n.push(e);
            if (n.length) {
                this.createLightDirections();
                for (let t of n) s.setPosition(0.5, 0.5), t.controllers.push(s);
            }
            queueMicrotask
                ? queueMicrotask(() => {
                      this.init();
                  })
                : setTimeout(() => {
                      this.init();
                  }, 0);
        }
        showOverlayMessage(t, e = 2e3) {
            if (this.overlayMessage) return clearTimeout(this.overlayMessage.timeout), void (this.overlayMessage.timeout = setTimeout(() => this.destroyOverlayMessage(), e));
            let i = document.createElement("div");
            i.classList.add("openlime-overlaymsg"), (i.innerHTML = `<p>${t}</p>`), this.viewer.containerElement.appendChild(i), (this.overlayMessage = { background: i, timeout: setTimeout(() => this.destroyOverlayMessage(), e) });
        }
        destroyOverlayMessage() {
            this.overlayMessage.background.remove(), (this.overlayMessage = null);
        }
        getMenuLayerEntry(t) {
            return this.menu.find((e) => e.layer == t);
        }
        createLightDirections() {
            (this.lightDirections = document.createElementNS("http://www.w3.org/2000/svg", "svg")),
                this.lightDirections.setAttribute("viewBox", "-100, -100, 200 200"),
                this.lightDirections.setAttribute("preserveAspectRatio", "xMidYMid meet"),
                (this.lightDirections.style.display = "none"),
                this.lightDirections.classList.add("openlime-lightdir");
            for (let t = -1; t <= 1; t++)
                for (let e = -1; e <= 1; e++) {
                    let i = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    (i.pos = [35 * t, 35 * e]), this.lightDirections.appendChild(i);
                }
            this.viewer.containerElement.appendChild(this.lightDirections);
        }
        updateLightDirections(t, e) {
            let i = [...this.lightDirections.children];
            for (let s of i) {
                let i = s.pos[0],
                    n = s.pos[1];
                s.setAttribute("x1", 0.6 * i - 0 * t), s.setAttribute("y1", 0.6 * n + 0 * e), s.setAttribute("x2", i / 0.6 + 60 * t), s.setAttribute("y2", n / 0.6 - 60 * e);
            }
        }
        enableLightDirections(t) {
            this.lightDirections.style.display = t ? "block" : "none";
        }
        init() {
            (async () => {
                if (
                    (document.addEventListener("keydown", (t) => this.keyDown(t), !1),
                    document.addEventListener("keyup", (t) => this.keyUp(t), !1),
                    this.createMenu(),
                    this.updateMenu(),
                    this.viewer.canvas.addEvent("update", () => this.updateMenu()),
                    this.actions.light && "auto" === this.actions.light.display && (this.actions.light.display = !0),
                    this.skin && (await this.loadSkin()),
                    this.setupActions(),
                    this.pixelSize && (this.scalebar = new D(this.pixelSize, this.viewer)),
                    this.attribution)
                ) {
                    var t = document.createElement("p");
                    t.classList.add("openlime-attribution"), (t.innerHTML = this.attribution), this.viewer.containerElement.appendChild(t);
                }
                for (let t of Object.values(this.viewer.canvas.layers)) {
                    this.setLayer(t);
                    break;
                }
                this.actions.light && this.actions.light.active && this.toggleLightController(), this.actions.layers && this.actions.layers.active && this.toggleLayers();
            })().catch((t) => {
                throw (console.log(t), Error("Something failed"));
            });
        }
        keyDown(t) {}
        keyUp(t) {
            if ((t.target == document.body || null == t.target.closest("input, textarea")) && !t.defaultPrevented) for (const e of Object.values(this.actions)) if ("key" in e && e.key == t.key) return t.preventDefault(), void e.task(t);
        }
        async loadSkin() {
            let t = document.createElement("div");
            t.classList.add("openlime-toolbar"), this.viewer.containerElement.appendChild(t);
            for (let [i, s] of Object.entries(this.actions))
                if (
                    !0 === s.display &&
                    ("icon" in s ? "string" == typeof s.icon && (e.isSVGString(s.icon) ? (s.icon = e.SVGFromString(s.icon)) : (s.icon = await e.loadSVG(s.icon)), s.icon.classList.add("openlime-button")) : (s.icon = ".openlime-" + i),
                    (s.element = await O.appendIcon(t, s.icon)),
                    this.enableTooltip)
                ) {
                    let t = document.createElementNS("http://www.w3.org/2000/svg", "title");
                    (t.textContent = s.title), s.element.appendChild(t);
                }
        }
        setupActions() {
            for (let [t, e] of Object.entries(this.actions)) {
                let t = e.element;
                t &&
                    t.addEventListener("click", (t) => {
                        e.task(t), t.preventDefault();
                    });
            }
            let t = document.querySelectorAll(".openlime-layers-button");
            for (let e of t) {
                let t = e.getAttribute("data-layer");
                t &&
                    e.addEventListener("click", () => {
                        this.setLayer(this.viewer.layers[t]);
                    });
            }
        }
        toggleLightController(t) {
            let shouldActivate = t !== undefined ? t : !this.lightActive;
            this.viewer.containerElement.classList.toggle("openlime-light-active", shouldActivate);
            this.lightActive = shouldActivate;
        
            for (let layer of Object.values(this.viewer.canvas.layers)) {
                for (let controller of layer.controllers) {
                    if (controller.control === "light") {
                        controller.active = shouldActivate;
                        controller.activeModifiers = shouldActivate ? [0, 2, 4] : [2, 4];
                    }
                }
            }
        }
        toggleFullscreen() {
            // let t = this.viewer.canvasElement,
            //     e = this.viewer.containerElement;
            // e.classList.toggle("openlime-fullscreen-active")
            //     ? (e.requestFullscreen || e.webkitRequestFullscreen || e.mozRequestFullScreen || e.msRequestFullscreen).call(e)
            //     : ((document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen).call(document),
            //       document.querySelector(".openlime-scale > line"),
            //       this.viewer.resize(t.offsetWidth, t.offsetHeight));
            // this.viewer.resize(t.offsetWidth, t.offsetHeight);
            window.parent.postMessage({ type: 'togglePane' }, '*');
        }
        toggleRuler() {
            this.ruler || ((this.ruler = new P(this.viewer, this.pixelSize)), this.viewer.pointerManager.onEvent(this.ruler)), this.ruler.enabled ? this.ruler.end() : this.ruler.start();
        }
        toggleHelp(t, e) {
            t.dialog ? t.dialog.toggle(e) : ((t.dialog = new F(this.viewer.containerElement, { modal: !0, class: "openlime-help-dialog" })), t.dialog.setContent(t.html));
        }
        snapshot() {
            var t = document.createElement("a");
            t.setAttribute("href", this.viewer.canvas.canvasElement.toDataURL()), t.setAttribute("download", "snapshot.png"), (t.style.display = "none"), document.body.appendChild(t), t.click(), document.body.removeChild(t);
        }
        createEntry(t) {
            "id" in t || (t.id = "entry_" + this.entry_count++);
            let e = `id="${t.id}"`,
                i = "tooltip" in t ? `title="${t.tooltip}"` : "",
                s = "classes" in t ? t.classes : "",
                n = "";
            if ("title" in t) n += `<h2 ${e} class="openlime-title ${s}" ${i}>${t.title}</h2>`;
            else if ("section" in t) n += `<h3 ${e} class="openlime-section ${s}" ${i}>${t.section}</h3>`;
            else if ("html" in t) n += `<div ${e} class="${s}">${t.html}</div>`;
            else if ("button" in t) {
                n += `<a href="#" ${e} ${"group" in t ? `data-group="${t.group}"` : ""} ${"layer" in t ? `data-layer="${t.layer}"` : ""} ${"mode" in t ? `data-mode="${t.mode}"` : ""} ${i} class="openlime-entry ${s}">${t.button}</a>`;
            } else if ("slider" in t) {
                n += `<input type="range" min="1" max="100" value="${"value" in t ? t.value : 50}" class="openlime-slider ${s}" ${e}>`;
            }
            if ("list" in t) {
                let e = `<div class="openlime-list ${s}">`;
                for (let i of t.list) e += this.createEntry(i);
                (e += "</div>"), (n += e);
            }
            return n;
        }
        addEntryCallbacks(t) {
            if (
                ((t.element = this.layerMenu.querySelector("#" + t.id)),
                t.onclick &&
                    t.element.addEventListener("click", (e) => {
                        t.onclick();
                    }),
                t.oninput && t.element.addEventListener("input", t.oninput),
                t.oncreate && t.oncreate(),
                "list" in t)
            )
                for (let e of t.list) this.addEntryCallbacks(e);
        }
        updateEntry(t) {
            let e = t.status ? t.status() : "";
            if ((t.element.classList.toggle("active", "active" == e), "list" in t)) for (let e of t.list) this.updateEntry(e);
        }
        updateMenu() {
            for (let t of this.menu) this.updateEntry(t);
        }
        createMenu() {
            this.entry_count = 0;
            let t = '<div class="openlime-layers-menu">';
            for (let e of this.menu) t += this.createEntry(e);
            t += "</div>";
            let e = document.createElement("template");
            (e.innerHTML = t.trim()), (this.layerMenu = e.content.firstChild), this.viewer.containerElement.appendChild(this.layerMenu);
            for (let t of this.menu) this.addEntryCallbacks(t);
        }
        toggleLayers() {
            this.layerMenu.classList.toggle("open");
        }
        setLayer(t) {
            if (("string" == typeof t && (t = this.viewer.canvas.layers[t]), t.overlay)) t.setVisible(!t.visible);
            else
                for (let e of Object.values(this.viewer.canvas.layers))
                    if (!e.overlay) {
                        e.setVisible(e == t);
                        for (let i of e.controllers) "light" == i.control && (i.active = this.lightActive && e == t);
                    }
            this.updateMenu(), this.viewer.redraw();
        }
        closeLayersMenu() {
            this.layerMenu.style.display = "none";
        }
    }
    class F {
        constructor(t, e) {
            Object.assign(this, { dialog: null, content: null, container: t, modal: !1, class: null, visible: !1, backdropEvents: !0 }, e), this.create();
        }
        create() {
            let t = document.createElement("div");
            t.classList.add("openlime-dialog-background");
            let e = document.createElement("div");
            e.classList.add("openlime-dialog"),
                this.class && e.classList.add(this.class),
                (async () => {
                    let t = await O.appendIcon(e, ".openlime-close");
                    t.classList.add("openlime-close"), t.addEventListener("click", () => this.hide());
                })();
            let i = document.createElement("div");
            i.classList.add("openlime-dialog-content"),
                e.append(i),
                this.modal
                    ? (this.backdropEvents &&
                          t.addEventListener("click", (e) => {
                              e.target == t && this.hide();
                          }),
                      t.appendChild(e),
                      this.container.appendChild(t),
                      (this.element = t))
                    : (this.container.appendChild(e), (this.element = e)),
                (this.dialog = e),
                (this.content = i),
                this.hide();
        }
        setContent(t) {
            "string" == typeof t ? (this.content.innerHTML = t) : this.content.replaceChildren(t);
        }
        show() {
            this.element.classList.remove("hidden"), (this.visible = !0);
        }
        hide() {
            this.element.classList.add("hidden"), (this.visible = !1), this.emit("closed");
        }
        fade(t) {
            this.element.classList.toggle("fading");
        }
        toggle(t) {
            this.element.classList.toggle("hidden", t), (this.visible = !this.visible);
        }
    }
    n(F, "closed"), n($, "lightdirection");
    class I extends m {
        constructor(t) {
            super({}),
                Object.assign(this, {
                    modes: ["light", "Diffuse", "Specular"],
                    mode: "normal",
                    type: ["ptm", "hsh", "sh", "rbf", "bln"],
                    colorspaces: ["lrgb", "rgb", "mrgb", "mycc"],
                    nplanes: null,
                    yccplanes: null,
                    njpegs: null,
                    material: null,
                    lights: null,
                    sigma: null,
                    ndimensions: null,
                    scale: null,
                    bias: null,
                    basis: null,
                    lweights: null,
                }),
                Object.assign(this, t),
                this.relight && this.init(this.relight),
                this.setMode("light");
        }
        setMode(t) {
            if (!this.modes.includes(t)) throw Error("Unknown mode: " + t);
            (this.mode = t), "light" != t && (this.lightWeights([0.612, 0.354, 0.707], "base"), this.lightWeights([-0.612, 0.354, 0.707], "base1"), this.lightWeights([0, -0.707, 0.707], "base2")), (this.needsUpdate = !0);
        }
        setLight(t) {
            if (!this.uniforms.light) throw "Shader not initialized, wait on layer ready event for setLight.";
            let e = t[0],
                i = t[1],
                s = Math.sqrt(e * e + i * i);
            s > 1 && ((e /= s), (i /= s)), (t = [e, i, Math.sqrt(Math.max(0, 1 - e * e - i * i))]), "light" == this.mode && this.lightWeights(t, "base"), this.setUniform("light", t);
        }
        setSpecularExp(t) {
            this.setUniform("specular_exp", t);
        }
        init(t) {
            for (
                Object.assign(this, t), "mycc" == this.colorspace ? (this.nplanes = this.yccplanes[0] + this.yccplanes[1] + this.yccplanes[2]) : (this.yccplanes = [0, 0, 0]), this.planes = [], this.njpegs = 0;
                3 * this.njpegs < this.nplanes;

            )
                this.njpegs++;
            for (let t = 0; t < this.njpegs; t++) this.samplers.push({ id: t, name: "plane" + t, type: "vec3" });
            this.normals && this.samplers.push({ id: this.njpegs, name: "normals", type: "vec3" }),
                this.normals && this.samplers.push({ id: this.njpegs, name: "normals", type: "vec3" }),
                (this.material = this.materials[0]),
                this.lights && (this.lights, new Float32Array(this.lights)),
                "rbf" == this.type && (this.ndimensions = this.lights.length / 3),
                "bilinear" == this.type && ((this.ndimensions = this.resolution * this.resolution), (this.type = "bln")),
                (this.scale = this.material.scale),
                (this.bias = this.material.bias),
                ["mrgb", "mycc"].includes(this.colorspace) && this.loadBasis(this.basis),
                (this.uniforms = {
                    light: { type: "vec3", needsUpdate: !0, size: 3, value: [0, 0, 1] },
                    specular_exp: { type: "float", needsUpdate: !1, size: 1, value: 10 },
                    bias: { type: "vec3", needsUpdate: !0, size: this.nplanes / 3, value: this.bias },
                    scale: { type: "vec3", needsUpdate: !0, size: this.nplanes / 3, value: this.scale },
                    base: { type: "vec3", needsUpdate: !0, size: this.nplanes },
                    base1: { type: "vec3", needsUpdate: !1, size: this.nplanes },
                    base2: { type: "vec3", needsUpdate: !1, size: this.nplanes },
                }),
                this.lightWeights([0, 0, 1], "base");
        }
        lightWeights(t, e, i) {
            let s;
            switch (this.type) {
                case "ptm":
                    s = class {
                        static lightWeights(t) {
                            let e = [1, t[0], t[1], t[0] * t[0], t[0] * t[1], t[1] * t[1]],
                                i = new Float32Array(18);
                            for (let t = 0; t < 18; t++) i[3 * t] = i[3 * t + 1] = i[3 * t + 2] = e[t];
                            return i;
                        }
                    }.lightWeights(t);
                    break;
                case "hsh":
                    s = j.lightWeights(t);
                    break;
                case "sh":
                    s = class {
                        static lightWeights(t) {
                            let e = 3.1415,
                                i = 0.5 * Math.sqrt(3 / e),
                                s = 0.5 * Math.sqrt(15 / e),
                                n = [0.5 / Math.sqrt(e), i * t[0], i * t[2], i * t[1], s * t[0] * t[1], s * t[0] * t[2], 0.5 * Math.sqrt(5 / e) * (3 * t[2] * t[2] - 1), s * t[1] * t[2], 0.5 * s * (t[1] * t[1] - t[0] * t[0])],
                                r = new Float32Array(27);
                            for (let t = 0; t < 27; t++) r[3 * t] = r[3 * t + 1] = r[3 * t + 2] = n[t];
                            return r;
                        }
                    }.lightWeights(t);
                    break;
                case "rbf":
                    s = U.lightWeights(t, this);
                    break;
                case "bln":
                    s = class {
                        static lightWeights(t, e) {
                            let i = e.nplanes,
                                s = Math.abs(t[0]) + Math.abs(t[1]) + Math.abs(t[2]),
                                n = (t[0] + t[1]) / s,
                                r = (t[1] - t[0]) / s;
                            (n = (n + 1) / 2), (r = (r + 1) / 2), (n *= e.resolution - 1), (r *= e.resolution - 1);
                            let o = Math.min(e.resolution - 2, Math.max(0, Math.floor(n))),
                                a = Math.min(e.resolution - 2, Math.max(0, Math.floor(r))),
                                l = n - o,
                                h = r - a,
                                c = (1 - l) * (1 - h),
                                d = l * (1 - h),
                                u = (1 - l) * h,
                                p = l * h,
                                m = new Float32Array(3 * (i + 1));
                            for (let t = 0; t < i + 1; t++)
                                for (let i = 0; i < 3; i++) {
                                    let s = e.basePixelOffset(t, o, a, i),
                                        n = e.basePixelOffset(t, o + 1, a, i),
                                        r = e.basePixelOffset(t, o, a + 1, i),
                                        l = e.basePixelOffset(t, o + 1, a + 1, i);
                                    m[3 * t + i] = c * e.basis[s] + d * e.basis[n] + u * e.basis[r] + p * e.basis[l];
                                }
                            return m;
                        }
                    }.lightWeights(t, this);
            }
            this.setUniform(e, s, i);
        }
        baseLightOffset(t, e, i) {
            return 3 * (t * this.ndimensions + e) + i;
        }
        basePixelOffset(t, e, i, s) {
            return 3 * (t * this.resolution * this.resolution + (e + i * this.resolution)) + s;
        }
        loadBasis(t) {
            let e = new Uint8Array(t);
            (this.basis = new Float32Array(t.length)), new Float32Array(e.length);
            for (let t = 0; t < this.nplanes + 1; t++)
                for (let i = 0; i < this.ndimensions; i++)
                    for (let s = 0; s < 3; s++) {
                        let n = this.baseLightOffset(t, i, s);
                        this.basis[n] = 0 == t ? e[n] / 255 : (e[n] - 127) / this.material.range[t - 1];
                    }
        }
        fragShaderSrc(t) {
            let e = !(t instanceof WebGLRenderingContext),
                i = `${e ? "#version 300 es" : ""}\n\nprecision highp float; \nprecision highp int; \n\n#define np1 ${this.nplanes + 1}\n\n${e ? "in" : "varying"} vec2 v_texcoord;\n${
                    e ? "out" : ""
                } vec4 color;\n\nconst mat3 T = mat3(8.1650e-01, 4.7140e-01, 4.7140e-01,\n\t-8.1650e-01, 4.7140e-01,  4.7140e-01,\n\t-1.6222e-08, -9.4281e-01, 4.7140e-01);\n\nuniform vec3 light;\nuniform float specular_exp;\nuniform vec3 bias[np1];\nuniform vec3 scale[np1];\n\nuniform vec3 base[np1];\nuniform vec3 base1[np1];\nuniform vec3 base2[np1];\n`;
            for (let t = 0; t < this.njpegs; t++) i += `\nuniform sampler2D plane${t};\n`;
            switch ((this.normals && (i += "\nuniform sampler2D normals;\n"), "mycc" == this.colorspace && (i += `\n\nconst int ny0 = ${this.yccplanes[0]};\nconst int ny1 = ${this.yccplanes[1]};\n`), this.colorspace)) {
                case "lrgb":
                    i += class {
                        static render(t, e) {
                            let i = "\nvec4 render(vec3 base[np1]) {\n\tfloat l = 0.0;\n";
                            for (let s = 1, n = 0; s < t; s++, n += 3)
                                i += `\n\t{\n\t\tvec4 c = texture${e ? "" : "2D"}(plane${s}, v_texcoord);\n\t\tl += base[${n}].x*(c.x - bias[${s}].x)*scale[${s}].x;\n\t\tl += base[${
                                    n + 1
                                }].x*(c.y - bias[${s}].y)*scale[${s}].y;\n\t\tl += base[${n + 2}].x*(c.z - bias[${s}].z)*scale[${s}].z;\n\t}\n`;
                            return (i += `\n\tvec3 basecolor = (texture${e ? "" : "2D"}(plane0, v_texcoord).xyz - bias[0])*scale[0];\n\n\treturn l*vec4(basecolor, 1);\n}\n`), i;
                        }
                    }.render(this.njpegs, e);
                    break;
                case "rgb":
                    i += class {
                        static render(t, e) {
                            let i = "\nvec4 render(vec3 base[np1]) {\n\tvec4 rgb = vec4(0, 0, 0, 1);";
                            for (let s = 0; s < t; s++)
                                i += `\n\t{\n\t\tvec4 c = texture${
                                    e ? "" : "2D"
                                }(plane${s}, v_texcoord);\n\t\trgb.x += base[${s}].x*(c.x - bias[${s}].x)*scale[${s}].x;\n\t\trgb.y += base[${s}].y*(c.y - bias[${s}].y)*scale[${s}].y;\n\t\trgb.z += base[${s}].z*(c.z - bias[${s}].z)*scale[${s}].z;\n\t}\n`;
                            return (i += "\n\treturn rgb;\n}\n"), i;
                        }
                    }.render(this.njpegs, e);
                    break;
                case "mrgb":
                    i += class {
                        static render(t, e) {
                            let i = "\nvec4 render(vec3 base[np1]) {\n\tvec3 rgb = base[0];\n\tvec4 c;\n\tvec3 r;\n";
                            for (let s = 0; s < t; s++)
                                i += `\tc = texture${e ? "" : "2D"}(plane${s}, v_texcoord);\n\tr = (c.xyz - bias[${s}])* scale[${s}];\n\n\trgb += base[${s}*3+1]*r.x;\n\trgb += base[${s}*3+2]*r.y;\n\trgb += base[${s}*3+3]*r.z;\n`;
                            return (i += "\n\treturn vec4(rgb, 1);\n}\n"), i;
                        }
                    }.render(this.njpegs, e);
                    break;
                case "mycc":
                    i += class {
                        static render(t, e, i) {
                            let s =
                                "\nvec3 toRgb(vec3 ycc) {\n \tvec3 rgb;\n\trgb.g = ycc.r + ycc.b/2.0;\n\trgb.b = ycc.r - ycc.b/2.0 - ycc.g/2.0;\n\trgb.r = rgb.b + ycc.g;\n\treturn rgb;\n}\n\nvec4 render(vec3 base[np1]) {\n\tvec3 rgb = base[0];\n\tvec4 c;\n\tvec3 r;\n";
                            for (let n = 0; n < t; n++)
                                (s += `\n\n\tc = texture${i ? "" : "2D"}(plane${n}, v_texcoord);\n\n\tr = (c.xyz - bias[${n}])* scale[${n}];\n`),
                                    (s +=
                                        n < e
                                            ? `\n\trgb.x += base[${n}*3+1].x*r.x;\n\trgb.y += base[${n}*3+2].y*r.y;\n\trgb.z += base[${n}*3+3].z*r.z;\n`
                                            : `\n\trgb.x += base[${n}*3+1].x*r.x;\n\trgb.x += base[${n}*3+2].x*r.y;\n\trgb.x += base[${n}*3+3].x*r.z;\n`);
                            return (s += "\t\n\treturn vec4(toRgb(rgb), 1);\n}\n"), s;
                        }
                    }.render(this.njpegs, this.yccplanes[0], e);
            }
            if (((i += "\n\nvoid main(void) {\n\n"), "light" == this.mode)) i += "\n\tcolor = render(base);\n";
            else
                switch (
                    (this.normals
                        ? (i += `\n\tvec3 normal = (texture${e ? "" : "2D"}(normals, v_texcoord).zyx *2.0) - 1.0;\n\tnormal.z = sqrt(1.0 - normal.x*normal.x - normal.y*normal.y);\n`)
                        : (i += "\n\tvec3 normal;\n\tnormal.x = dot(render(base ).xyz, vec3(1));\n\tnormal.y = dot(render(base1).xyz, vec3(1));\n\tnormal.z = dot(render(base2).xyz, vec3(1));\n\tnormal = normalize(T * normal);\n"),
                    this.mode)
                ) {
                    case "normals":
                        i += "\n\tnormal = (normal + 1.0)/2.0;\n\tcolor = vec4(0.0, normal.xy, 1);\n";
                        break;
                    case "Diffuse":
                        i += "\n\tcolor = vec4(vec3(dot(light, normal)), 1);\n";
                        break;
                    default:
                        i += "\n\tfloat s = pow(dot(light, normal), specular_exp);\n\t//color = vec4(render(base).xyz*s, 1.0);\n\tcolor = vec4(s, s, s, 1.0);\n";
                }
            return (i += `\n\t${e ? "" : "gl_FragColor = color;"}\n}`), i;
        }
    }
    class j {
        static minElevation = 0.15;
        static lightWeights(t) {
            let e = 3.1415,
                i = Math.atan2(t[1], t[0]);
            i < 0 && (i = 2 * e + i);
            let s = Math.min(Math.acos(t[2]), e / 2 - this.minElevation),
                n = Math.cos(i),
                r = Math.cos(s),
                o = r * r,
                a = [
                    1 / Math.sqrt(2 * e),
                    Math.sqrt(6 / e) * (n * Math.sqrt(r - o)),
                    Math.sqrt(3 / (2 * e)) * (2 * r - 1),
                    Math.sqrt(6 / e) * (Math.sqrt(r - o) * Math.sin(i)),
                    Math.sqrt(30 / e) * (Math.cos(2 * i) * (-r + o)),
                    Math.sqrt(30 / e) * (n * (2 * r - 1) * Math.sqrt(r - o)),
                    Math.sqrt(5 / (2 * e)) * (1 - 6 * r + 6 * o),
                    Math.sqrt(30 / e) * ((2 * r - 1) * Math.sqrt(r - o) * Math.sin(i)),
                    Math.sqrt(30 / e) * ((-r + o) * Math.sin(2 * i)),
                ],
                l = new Float32Array(27);
            for (let t = 0; t < 27; t++) l[3 * t] = l[3 * t + 1] = l[3 * t + 2] = a[t];
            return l;
        }
    }
    class U {
        static lightWeights(t, e) {
            let i = U.rbf(t, e),
                s = e.nplanes,
                n = new Float32Array(3 * (s + 1));
            for (let t = 0; t < s + 1; t++)
                for (let s = 0; s < 3; s++)
                    for (let r = 0; r < i.length; r++) {
                        let o = e.baseLightOffset(t, i[r][0], s);
                        n[3 * t + s] += i[r][1] * e.basis[o];
                    }
            return n;
        }
        static rbf(t, e) {
            let i = 1 / (e.sigma * e.sigma),
                s = new Array(e.ndimensions),
                n = 0;
            for (let r = 0; r < s.length; r++) {
                let o = e.lights[3 * r + 0] - t[0],
                    a = e.lights[3 * r + 1] - t[1],
                    l = e.lights[3 * r + 2] - t[2],
                    h = o * o + a * a + l * l,
                    c = Math.exp(-i * h);
                (s[r] = [r, c]), (n += c);
            }
            for (let t = 0; t < s.length; t++) s[t][1] /= n;
            let r = 0;
            n = 0;
            for (let t = 0; t < s.length; t++) s[t][1] > 0.001 && ((s[r++] = s[t]), (n += s[t][1]));
            s = s.slice(0, r);
            for (let t = 0; t < s.length; t++) s[t][1] /= n;
            return s;
        }
    }
    class H extends c {
        constructor(t) {
            if ((super(t), 0 != Object.keys(this.rasters).length)) throw "Rasters options should be empty!";
            if (!this.url) throw "Url option is required";
            (this.shaders.rti = new I({ normals: this.normals })), this.setShader("rti"), this.addControl("light", [0, 0]), (this.worldRotation = 0), this.loadJson(this.url);
        }
        imageUrl(t, e) {
            let i = this.url.substring(0, this.url.lastIndexOf("/") + 1);
            switch (this.layout.type) {
                case "image":
                    return i + e + ".jpg";
                case "google":
                    return i + e;
                case "deepzoom":
                    return i + e + ".dzi";
                case "tarzoom":
                    return i + e + ".tzi";
                case "itarzoom":
                    return i + "planes.tzi";
                case "zoomify":
                    return i + e + "/ImageProperties.xml";
                case "iiif":
                    throw Error("Unimplemented");
                default:
                    throw Error("Unknown layout: " + layout.type);
            }
        }
        setLight(t, e) {
            this.setControl("light", t, e);
        }
        loadJson(t) {
            (async () => {
                var t = await fetch(this.url);
                if (!t.ok) return void (this.status = "Failed loading " + this.url + ": " + t.statusText);
                let e = await t.json();
                this.shader.init(e);
                let i = [];
                for (let t = 0; t < this.shader.njpegs; t++) {
                    let e = this.imageUrl(this.url, "plane_" + t);
                    i.push(e);
                    let s = new p({ format: "vec3" });
                    this.rasters.push(s);
                }
                if (this.normals) {
                    let t = this.imageUrl(this.url, "normals");
                    i.push(t);
                    let e = new p({ format: "vec3" });
                    this.rasters.push(e);
                }
                this.layout.setUrls(i);
            })().catch((t) => {
                console.log(t), (this.status = t);
            });
        }
        interpolateControls() {
            let t = super.interpolateControls();
            if (!t) {
                let t = this.controls.light.current.value,
                    e = s.rotate(t[0], t[1], this.worldRotation * Math.PI);
                this.shader.setLight([e.x, e.y]);
            }
            return t;
        }
        draw(t, e) {
            return (this.worldRotation = t.a + this.transform.a), super.draw(t, e);
        }
    }
    c.prototype.types.rti = (t) => new H(t);
    class q extends m {
        constructor(t) {
            super({}), (this.modes = ["color", "Diffuse", "Specular", "normals", "monochrome"]), (this.mode = "color"), Object.assign(this, t);
            const e = "linear" == this.colorspaces.kd ? 0 : 1,
                i = "linear" == this.colorspaces.ks ? 0 : 1,
                s = t.brightness ? t.brightness : 1,
                n = t.gamma ? t.gamma : 2.2,
                r = t.alphaLimits ? t.alphaLimits : [0.01, 0.5],
                o = t.monochromeMaterial ? t.monochromeMaterial : [0.8, 0.79, 0.75],
                a = t.kAmbient ? t.kAmbient : 0.02;
            (this.uniforms = {
                uLightInfo: { type: "vec4", needsUpdate: !0, size: 4, value: [0.1, 0.1, 0.9, 0] },
                uAlphaLimits: { type: "vec2", needsUpdate: !0, size: 2, value: r },
                uBrightnessGamma: { type: "vec2", needsUpdate: !0, size: 2, value: [s, n] },
                uInputColorSpaceKd: { type: "int", needsUpdate: !0, size: 1, value: e },
                uInputColorSpaceKs: { type: "int", needsUpdate: !0, size: 1, value: i },
                uMonochromeMaterial: { type: "vec3", needsUpdate: !0, size: 3, value: o },
                uKAmbient: { type: "float", needsUpdate: !0, size: 1, value: a },
            }),
                (this.innerCode = ""),
                this.setMode(this.mode);
        }
        setLight(t) {
            this.setUniform("uLightInfo", t);
        }
        setMode(t) {
            switch (((this.mode = t), t)) {
                case "color":
                    this.innerCode = "vec3 linearColor = (kd + ks * spec) * NdotL;\n\t\t\t\tlinearColor += kd * uKAmbient; // HACK! adding just a bit of ambient";
                    break;
                case "Diffuse":
                    this.innerCode = "vec3 linearColor = kd;";
                    break;
                case "Specular":
                    this.innerCode = "vec3 linearColor = clamp((ks * spec) * NdotL, 0.0, 1.0);";
                    break;
                case "normals":
                    this.innerCode = "vec3 linearColor = (N+vec3(1.))/2.;\n\t\t\t\tapplyGamma = false;";
                    break;
                case "monochrome":
                    this.innerCode = "vec3 linearColor = kd * NdotL + kd * uKAmbient;";
                    break;
                default:
                    throw (console.log("ShaderBRDF: Unknown mode: " + t), Error("ShaderBRDF: Unknown mode: " + t));
            }
            this.needsUpdate = !0;
        }
        fragShaderSrc(t) {
            let e = !(t instanceof WebGLRenderingContext),
                i = -1 != this.samplers.findIndex((t) => "uTexKd" == t.name) && "monochrome" != this.mode,
                s = -1 != this.samplers.findIndex((t) => "uTexGloss" == t.name) && "monochrome" != this.mode;
            return `${
                e ? "#version 300 es" : ""
            }\nprecision highp float; \nprecision highp int; \n\n#define NULL_NORMAL vec3(0,0,0)\n#define SQR(x) ((x)*(x))\n#define PI (3.14159265359)\n#define ISO_WARD_EXPONENT (4.0)\n\n${e ? "in" : "varying"} vec2 v_texcoord;\nuniform sampler2D uTexKd;\nuniform sampler2D uTexKs;\nuniform sampler2D uTexNormals;\nuniform sampler2D uTexGloss;\n\nuniform vec4 uLightInfo; // [x,y,z,w] (if .w==0 => Directional, if w==1 => Spot)\nuniform vec2 uAlphaLimits;\nuniform vec2 uBrightnessGamma;\nuniform vec3 uMonochromeMaterial;\nuniform float uKAmbient;\n\nuniform int uInputColorSpaceKd; // 0: Linear; 1: sRGB\nuniform int uInputColorSpaceKs; // 0: Linear; 1: sRGB\n\n${e ? "out" : ""}  vec4 color;\n\nvec3 getNormal(const in vec2 texCoord) {\n\tvec3 n = texture(uTexNormals, texCoord).xyz;\n\tn = 2. * n - vec3(1.);\n\tfloat norm = length(n);\n\tif(norm < 0.5) return NULL_NORMAL;\n\telse return n/norm;\n}\n\nvec3 linear2sRGB(vec3 linearRGB) {\n    bvec3 cutoff = lessThan(linearRGB, vec3(0.0031308));\n    vec3 higher = vec3(1.055)*pow(linearRGB, vec3(1.0/2.4)) - vec3(0.055);\n    vec3 lower = linearRGB * vec3(12.92);\n    return mix(higher, lower, cutoff);\n}\n\nvec3 sRGB2Linear(vec3 sRGB) {\n    bvec3 cutoff = lessThan(sRGB, vec3(0.04045));\n    vec3 higher = pow((sRGB + vec3(0.055))/vec3(1.055), vec3(2.4));\n    vec3 lower = sRGB/vec3(12.92);\n    return mix(higher, lower, cutoff);\n}\n\nfloat ward(in vec3 V, in vec3 L, in vec3 N, in vec3 X, in vec3 Y, in float alpha) {\n\n\tvec3 H = normalize(V + L);\n\n\tfloat H_dot_N = dot(H, N);\n\tfloat sqr_alpha_H_dot_N = SQR(alpha * H_dot_N);\n\n\tif(sqr_alpha_H_dot_N < 0.00001) return 0.0;\n\n\tfloat L_dot_N_mult_N_dot_V = dot(L,N) * dot(N,V);\n\tif(L_dot_N_mult_N_dot_V <= 0.0) return 0.0;\n\n\tfloat spec = 1.0 / (4.0 * PI * alpha * alpha * sqrt(L_dot_N_mult_N_dot_V));\n\t\n\t//float exponent = -(SQR(dot(H,X)) + SQR(dot(H,Y))) / sqr_alpha_H_dot_N; // Anisotropic\n\tfloat exponent = -SQR(tan(acos(H_dot_N))) / SQR(alpha); // Isotropic\n\t\n\tspec *= exp( exponent );\n\n\treturn spec;\n}\n\n\nvoid main() {\n\tvec3 N = getNormal(v_texcoord);\n\tif(N == NULL_NORMAL) {\n\t\tcolor = vec4(0.0);\n\t\treturn;\n\t}\n\n\tvec3 L = (uLightInfo.w == 0.0) ? normalize(uLightInfo.xyz) : normalize(uLightInfo.xyz - gl_FragCoord.xyz);\n\tvec3 V = vec3(0.0,0.0,1.0);\n    vec3 H = normalize(L + V);\n\tfloat NdotL = max(dot(N,L),0.0);\n\n\tvec3 kd = ${i ? "texture(uTexKd, v_texcoord).xyz" : "uMonochromeMaterial"};\n\tvec3 ks = ${-1 != this.samplers.findIndex((t) => "uTexKs" == t.name) ? "texture(uTexKs, v_texcoord).xyz" : "vec3(0.0, 0.0, 0.0)"};\n\tif(uInputColorSpaceKd == 1) {\n\t\tkd = sRGB2Linear(kd);\n\t}\n\tif(uInputColorSpaceKs == 1) {\n\t\tks = sRGB2Linear(ks);\n\t}\n\tkd /= PI;\n\n\tfloat gloss = ${s ? "texture(uTexGloss, v_texcoord).x" : "0.0"};\n\tfloat minGloss = 1.0 - pow(uAlphaLimits[1], 1.0 / ISO_WARD_EXPONENT);\n\tfloat maxGloss = 1.0 - pow(uAlphaLimits[0], 1.0 / ISO_WARD_EXPONENT);\n\n\tfloat alpha = pow(1.0 - gloss * (maxGloss - minGloss) - minGloss, ISO_WARD_EXPONENT);\n\t\n\t\n\tvec3 e = vec3(0.0,0.0,1.0);\n\tvec3 T = normalize(cross(N,e));\n\tvec3 B = normalize(cross(N,T));\n\tfloat spec = ward(V, L, N, T, B, alpha);\n\t\n\tbool applyGamma = true;\n\n\t${this.innerCode}\n\n\tvec3 finalColor = applyGamma ? pow(linearColor * uBrightnessGamma[0], vec3(1.0/uBrightnessGamma[1])) : linearColor;\n\tcolor = vec4(finalColor, 1.0);\n\t${e ? "" : "gl_FragColor = color;"}\n}\n`;
        }
    }
    class N extends c {
        constructor(t) {
            if ((super((t = Object.assign({ brightness: 1, gamma: 2.2, alphaLimits: [0.01, 0.5], monochromeMaterial: [0.8, 0.79, 0.75], kAmbient: 0.1 }, t))), 0 != Object.keys(this.rasters).length)) throw "Rasters options should be empty!";
            if (!this.channels) throw "channels option is required";
            if (!this.channels.kd || !this.channels.normals) throw "kd and normals channels are required";
            this.colorspaces || (console.log("LayerBRDF: missing colorspaces: force both to linear"), (this.colorspaces.kd = "linear"), (this.colorspaces.ks = "linear"));
            let e = 0,
                i = [],
                s = [],
                n = { kd: { format: "vec3", name: "uTexKd" }, ks: { format: "vec3", name: "uTexKs" }, normals: { format: "vec3", name: "uTexNormals" }, gloss: { format: "float", name: "uTexGloss" } };
            for (let t in this.channels) this.rasters.push(new p({ format: n[t].format })), s.push({ id: e, name: n[t].name }), (i[e] = this.channels[t]), e++;
            this.layout.setUrls(i), this.addControl("light", [0, 0]);
            let r = new q({ label: "Rgb", samplers: s, colorspaces: this.colorspaces, brightness: this.brightness, gamma: this.gamma, alphaLimits: this.alphaLimits, monochromeMaterial: this.monochromeMaterial, kAmbient: this.kAmbient });
            (this.shaders.brdf = r), this.setShader("brdf");
        }
        static projectToSphere(t) {
            let e = t[0],
                i = t[1],
                s = e * e + i * i;
            if (s > 1) {
                let t = Math.sqrt(s);
                (e /= t), (i /= t), (s = 1);
            }
            return [e, i, Math.sqrt(1 - s)];
        }
        static projectToFlattenedSphere(t) {
            const e = 0.8 * Math.SQRT1_2,
                i = e * e;
            let s = Math.min(Math.max(t[0], -1), 1),
                n = Math.min(Math.max(t[1], -1), 1),
                r = 0,
                o = s * s + n * n;
            r = o < i ? Math.sqrt(0.6400000000000001 - o) : i / Math.sqrt(o);
            let a = Math.sqrt(o + r * r);
            return [s / a, n / a, r / a];
        }
        setLight(t, e, i = "linear") {
            this.setControl("light", t, e, i);
        }
        interpolateControls() {
            let t = super.interpolateControls(),
                e = N.projectToFlattenedSphere(this.controls.light.current.value);
            return this.shader.setLight([e[0], e[1], e[2], 0]), t;
        }
    }
    c.prototype.types.brdf = (t) => new N(t);
    class G extends m {
        constructor(t) {
            super(t),
                (this.samplers = [
                    { id: 0, name: "source0" },
                    { id: 1, name: "source1" },
                ]),
                (this.uniforms = {
                    u_lens: { type: "vec4", needsUpdate: !0, size: 4, value: [0, 0, 100, 10] },
                    u_width_height: { type: "vec2", needsUpdate: !0, size: 2, value: [1, 1] },
                    u_border_color: { type: "vec4", needsUpdate: !0, size: 4, value: [0.8, 0.8, 0.8, 1] },
                    u_border_enable: { type: "bool", needsUpdate: !0, size: 1, value: !1 },
                }),
                (this.label = "ShaderLens"),
                (this.needsUpdate = !0),
                (this.overlayLayerEnabled = !1);
        }
        setOverlayLayerEnabled(t) {
            (this.overlayLayerEnabled = t), (this.needsUpdate = !0);
        }
        setLensUniforms(t, e, i, s) {
            this.setUniform("u_lens", t), this.setUniform("u_width_height", e), this.setUniform("u_border_color", i), this.setUniform("u_border_enable", s);
        }
        fragShaderSrc(t) {
            let e = !(t instanceof WebGLRenderingContext),
                i = "uniform sampler2D " + this.samplers[0].name + ";",
                s = "";
            return (
                this.overlayLayerEnabled &&
                    ((i += "uniform sampler2D " + this.samplers[1].name + ";"),
                    (s = `vec4 c1 = texture${
                        e ? "" : "2D"
                    }(source1, v_texcoord);\n            if (r > u_lens.z) {\n                float k = (c1.r + c1.g + c1.b) / 3.0;\n                c1 = vec4(k, k, k, c1.a);\n            } else if (u_border_enable && r > innerBorderRadius) {\n                // Preserve border keeping c1 alpha at zero\n                c1.a = 0.0; \n            }\n            color = color * (1.0 - c1.a) + c1 * c1.a;\n            `)),
                `${
                    e ? "#version 300 es" : ""
                }\n\n        precision highp float; \n        precision highp int; \n\n        ${i}\n        uniform vec4 u_lens; // [cx, cy, radius, border]\n        uniform vec2 u_width_height; // Keep wh to map to pixels. TexCoords cannot be integer unless using texture_rectangle\n        uniform vec4 u_border_color;\n        uniform bool u_border_enable;\n        ${
                    e ? "in" : "varying"
                } vec2 v_texcoord;\n        ${
                    e ? "out" : ""
                } vec4 color;\n\n        vec4 lensColor(in vec4 c_in, in vec4 c_border, in vec4 c_out,\n            float r, float R, float B) {\n            vec4 result;\n            if (u_border_enable) {\n                float B_SMOOTH = B < 8.0 ? B/8.0 : 1.0;\n                if (r<R-B+B_SMOOTH) {\n                    float t=smoothstep(R-B, R-B+B_SMOOTH, r);\n                    result = mix(c_in, c_border, t);\n                } else if (r<R-B_SMOOTH) {\n                    result = c_border;  \n                } else {\n                    float t=smoothstep(R-B_SMOOTH, R, r);\n                    result = mix(c_border, c_out, t);\n                }\n            } else {\n                result = (r<R) ? c_in : c_out;\n            }\n            return result;\n        }\n\n        void main() {\n            float innerBorderRadius = (u_lens.z - u_lens.w);\n            float dx = v_texcoord.x * u_width_height.x - u_lens.x;\n            float dy = v_texcoord.y * u_width_height.y - u_lens.y;\n            float r = sqrt(dx*dx + dy*dy);\n\n            vec4 c_in = texture${
                    e ? "" : "2D"
                }(source0, v_texcoord);\n            vec4 c_out = u_border_color; c_out.a=0.0;\n            \n            color = lensColor(c_in, u_border_color, c_out, r, u_lens.z, u_lens.w);\n\n            ${s}\n            ${
                    e ? "" : "gl_FragColor = color;"
                }\n        }\n        `
            );
        }
        vertShaderSrc(t) {
            let e = !(t instanceof WebGLRenderingContext);
            return `${
                e ? "#version 300 es" : ""
            }\n\nprecision highp float; \nprecision highp int; \n\n${e ? "in" : "attribute"} vec4 a_position;\n${e ? "in" : "attribute"} vec2 a_texcoord;\n\n${e ? "out" : "varying"} vec2 v_texcoord;\nvoid main() {\n\tgl_Position = a_position;\n    v_texcoord = a_texcoord;\n}`;
        }
    }
    class V extends f {
        constructor(t) {
            if ((super((t = Object.assign({ overlay: !0, radius: 100, borderColor: [0.078, 0.078, 0.078, 1], borderWidth: 12, borderEnable: !1, dashboard: null }, t))), !this.camera)) throw (console.log("Missing camera"), "Missing Camera");
            let e = new G();
            2 == this.layers.length && e.setOverlayLayerEnabled(!0),
                (this.shaders.lens = e),
                this.setShader("lens"),
                this.addControl("center", [0, 0]),
                this.addControl("radius", [this.radius, 0]),
                this.addControl("borderColor", this.borderColor),
                this.addControl("borderWidth", [this.borderWidth]),
                (this.oldRadius = -9999),
                (this.oldCenter = [-9999, -9999]),
                (this.useGL = !0),
                this.dashboard && (this.dashboard.lensLayer = this);
        }
        setVisible(t) {
            this.dashboard && (this.dashboard.container.style.display = t ? "block" : "none"), super.setVisible(t);
        }
        removeOverlayLayer() {
            (this.layers.length = 1), this.shader.setOverlayLayerEnabled(!1);
        }
        setBaseLayer(t) {
            (this.layers[0] = t), this.emit("update");
        }
        setOverlayLayer(t) {
            (this.layers[1] = t), this.layers[1].setVisible(!0), this.shader.setOverlayLayerEnabled(!0), this.regenerateFrameBuffers();
        }
        regenerateFrameBuffers() {
            const t = this.layout.width,
                e = this.layout.height;
            this.deleteFramebuffers(), (this.layout.width = t), (this.layout.height = e), this.createFramebuffers();
        }
        setRadius(t, e = 100, i = "linear") {
            this.setControl("radius", [t, 0], e, i);
        }
        getRadius() {
            return this.controls.radius.current.value[0];
        }
        setCenter(t, e, i = 100, s = "linear") {
            this.setControl("center", [t, e], i, s);
        }
        getCurrentCenter() {
            const t = this.controls.center.current.value;
            return { x: t[0], y: t[1] };
        }
        getTargetCenter() {
            const t = this.controls.center.target.value;
            return { x: t[0], y: t[1] };
        }
        getBorderColor() {
            return this.controls.borderColor.current.value;
        }
        getBorderWidth() {
            return this.controls.borderWidth.current.value[0];
        }
        draw(t, e) {
            let i = this.interpolateControls();
            if (this.dashboard) {
                const t = this.getCurrentCenter(),
                    e = this.getRadius();
                this.dashboard.update(t.x, t.y, e), (this.oldCenter = t), (this.oldRadius = e);
            }
            for (let t of this.layers) if ("ready" != t.status) return !1;
            if (!this.shader) throw "Shader not specified!";
            let s = this.gl,
                n = this.getLensViewport(t, e),
                r = this.getOverlayLayerViewport(t, e);
            null != r && (n = this.joinViewports(n, r)),
                s.viewport(n.x, n.y, n.dx, n.dy),
                (this.framebuffers.length && this.layout.width == e.w && this.layout.height == e.h) || (this.deleteFramebuffers(), (this.layout.width = e.w), (this.layout.height = e.h), this.createFramebuffers());
            var o = [0, 0, 0, 0];
            s.clearColor(o[0], o[1], o[2], o[3]);
            for (let e = 0; e < this.layers.length; e++) s.bindFramebuffer(s.FRAMEBUFFER, this.framebuffers[e]), s.clear(s.COLOR_BUFFER_BIT), this.layers[e].draw(t, n), s.bindFramebuffer(s.FRAMEBUFFER, null);
            const a = this.getLensInViewportCoords(t, e);
            this.shader.setLensUniforms(a, [e.w, e.h], this.getBorderColor(), this.borderEnable), this.prepareWebGL();
            for (let t = 0; t < this.layers.length; t++) s.uniform1i(this.shader.samplers[t].location, t), s.activeTexture(s.TEXTURE0 + t), s.bindTexture(s.TEXTURE_2D, this.textures[t]);
            const l = n.x / n.w,
                h = n.y / n.h,
                c = (n.x + n.dx) / n.w,
                d = (n.y + n.dy) / n.h;
            return this.updateTileBuffers(new Float32Array([-1, -1, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0]), new Float32Array([l, h, l, d, c, d, c, h])), s.drawElements(s.TRIANGLES, 6, s.UNSIGNED_SHORT, 0), s.viewport(e.x, e.x, e.dx, e.dy), i;
        }
        getLensViewport(t, e) {
            const i = this.getCurrentCenter(),
                s = a.fromSceneToViewport(i, this.camera, this.useGL),
                n = this.getRadius() * t.z;
            return { x: Math.floor(s.x - n) - 1, y: Math.floor(s.y - n) - 1, dx: Math.ceil(2 * n) + 2, dy: Math.ceil(2 * n) + 2, w: e.w, h: e.h };
        }
        getOverlayLayerViewport(t, e) {
            let i = null;
            if (2 == this.layers.length) {
                let t = this.layers[1].boundingBox();
                const s = a.fromSceneToViewport({ x: t.xLow, y: t.yLow }, this.camera, this.useGL),
                    n = a.fromSceneToViewport({ x: t.xHigh, y: t.yHigh }, this.camera, this.useGL),
                    r = Math.min(Math.max(0, Math.floor(s.x)), e.w),
                    o = Math.min(Math.max(0, Math.floor(s.y)), e.h);
                i = { x: r, y: o, dx: Math.min(Math.max(0, Math.ceil(n.x)), e.w) - r, dy: Math.min(Math.max(0, Math.ceil(n.y)), e.h) - o, w: e.w, h: e.h };
            }
            return i;
        }
        joinViewports(t, e) {
            const i = Math.min(t.x, e.x),
                s = Math.max(t.x + t.dx, e.x + e.dx),
                n = Math.min(t.y, e.y);
            return { x: i, y: n, dx: s - i, dy: Math.max(t.y + t.dy, e.y + e.dy) - n, w: t.w, h: t.h };
        }
        getLensInViewportCoords(t, e) {
            const i = this.getCurrentCenter(),
                s = a.fromSceneToViewport(i, this.camera, this.useGL),
                n = this.getRadius();
            return [s.x, s.y, n * t.z, this.getBorderWidth()];
        }
    }
    c.prototype.types.lens = (t) => new V(t);
    class W {
        static pan(t, e, i, s, n) {
            let r = this.getAmountOfFocusContext(t, e, i, s);
            const o = s.x * r.x,
                a = s.y * r.y,
                l = -o * i.z * 2 * (1 - r.x),
                h = -a * i.z * 2 * (1 - r.y);
            (i.x += l),
                (i.y += h),
                (e.position.x += o),
                (e.position.y += a),
                Math.abs(e.position.x) > n.w / 2 && (e.position.x = (n.w / 2) * Math.sign(e.position.x)),
                Math.abs(e.position.y) > n.h / 2 && (e.position.y = (n.h / 2) * Math.sign(e.position.y));
        }
        static scale(t, e, i, s) {
            const n = t.viewport,
                r = this.getRadiusRangeCanvas(n),
                o = e.radius * i.z,
                a = Math.max(0, Math.min(1, (o - r.min) / (r.max - r.min)));
            let l = 1;
            if (s > 1 && a > 0.5) {
                const t = 2 * (a - 0.5);
                l = 1 * (1 - t) + t / s;
            } else if (s < 1 && a < 0.5) {
                const t = 2 * a;
                l = (1 - t) / s + 1 * t;
            }
            let h = s;
            const c = o * h;
            c < r.min ? (h = r.min / o) : c > r.max && (h = r.max / o),
                i.z * l < t.minZoom ? (l = t.minZoom / i.z) : i.z * l > t.maxZoom && (l = t.maxZoom / i.z),
                (i.x += e.position.x * i.z * (1 - l)),
                (i.y += e.position.y * i.z * (1 - l)),
                (i.z = i.z * l),
                (e.radius *= h);
        }
        static adaptContext(t, e, i, s) {
            const n = a.fromSceneToViewportNoCamera(e.position, i, t, true);
            (i.z = s), W.adaptContextScale(t, e, i);
            const r = a.fromSceneToViewportNoCamera(e.position, i, t, true),
                o = [r.x - n.x, r.y - n.y];
            (i.x -= o.x), (i.y += o.y), W.adaptContextPosition(t, e, i);
        }
        static adaptContextScale(t, e, i) {
            i.z;
            const s = this.getRadiusRangeCanvas(t),
                n = e.radius * i.z;
            n < s.min ? (i.z = s.min / e.radius) : n > s.max && (i.z = s.max / e.radius);
        }
        static adaptContextPosition(t, e, i) {
            const s = this.getCanvasBorder(e, i);
            let n = this.getShrinkedBox(t, s);
            const r = a.fromSceneToViewportNoCamera(e.position, i, t, !0),
                o = Math.max(0, n.xLow - r.x),
                l = Math.min(0, n.xHigh - r.x);
            i.x += 0 != o ? o : l;
            const h = Math.max(0, n.yLow - r.y),
                c = Math.min(0, n.yHigh - r.y);
            i.y += 0 != h ? h : c;
        }
        static getAmountOfFocusContext(t, e, i, s) {
            const n = this.getCanvasBorder(e, i),
                r = this.getShrinkedBox(t, n),
                o = a.fromSceneToViewportNoCamera(e.position, i, t, !0),
                l = t.w / 2 - n,
                h = t.h / 2 - n;
            let c = s.x > 0 ? Math.max(0, Math.min(l, r.xHigh - o.x)) / l : Math.max(0, Math.min(l, o.x - r.xLow)) / l;
            c = this.smoothstep(c, 0, 0.75);
            let d = s.y > 0 ? Math.max(0, Math.min(h, r.yHigh - o.y)) / h : Math.max(0, Math.min(h, o.y - r.yLow)) / h;
            d = this.smoothstep(d, 0, 0.75);
            return { x: c / 2 + 0.5, y: d / 2 + 0.5 };
        }
        static getCanvasBorder(t, e) {
            return e.z * t.radius * 1.5;
        }
        static getShrinkedBox(t, e) {
            return { xLow: e, yLow: e, xHigh: t.w - e, yHigh: t.h - e };
        }
        static getRadiusRangeCanvas(t) {
            const e = 0.1 * Math.min(t.w, t.h);
            return { min: e, max: 3 * e };
        }
        static smoothstep(t, e, i) {
            if (t < e) return 0;
            if (t > i) return 1;
            {
                const s = (t - e) / (i - e);
                return s * s * (-2 * s + 3);
            }
        }
    }
    class Y extends E {
        constructor(t) {
            if ((super(t), !t.lensLayer)) throw (console.log("ControllerLens lensLayer option required"), "ControllerLens lensLayer option required");
            if (!t.camera) throw (console.log("ControllerLens camera option required"), "ControllerLens camera option required");
            (this.panning = !1), (this.zooming = !1), (this.initialDistance = 0), (this.startPos = { x: 0, y: 0 }), (this.oldCursorPos = { x: 0, y: 0 }), (this.useGL = !1);
        }
        panStart(t) {
            if (!this.active) return;
            const e = this.getScenePosition(t);
            this.panning = !1;
            const i = this.isInsideLens(e);
            this.lensLayer.visible && i.inside && ((this.panning = !0), (this.startPos = e), t.preventDefault());
        }
        panMove(t) {
            if ((this.getPixelPosition(t), !(Math.abs(t.offsetX) > 64e3 || Math.abs(t.offsetY) > 64e3) && this.panning)) {
                const e = this.getScenePosition(t),
                    i = e.x - this.startPos.x,
                    s = e.y - this.startPos.y,
                    n = this.lensLayer.getTargetCenter();
                this.lensLayer.setCenter(n.x + i, n.y + s), (this.startPos = e), t.preventDefault();
            }
        }
        panEnd(t) {
            (this.panning = !1), (this.zooming = !1);
        }
        pinchStart(t, e) {
            if (!this.active) return;
            const i = this.getScenePosition(t),
                s = this.getScenePosition(e),
                n = { x: 0.5 * (i.x + s.x), y: 0.5 * (i.y + s.y) };
            this.lensLayer.visible && this.isInsideLens(n).inside && ((this.zooming = !0), (this.initialDistance = this.distance(t, e)), (this.initialRadius = this.lensLayer.getRadius()), (this.startPos = n), t.preventDefault());
        }
        pinchMove(t, e) {
            if (!this.zooming) return;
            const i = (this.distance(t, e) / (this.initialDistance + 1e-5)) * this.initialRadius;
            this.lensLayer.setRadius(i);
        }
        pinchEnd(t, e, i, s) {
            this.zooming = !1;
        }
        mouseWheel(t) {
            const e = this.getScenePosition(t);
            let i = !1;
            if (this.lensLayer.visible && this.isInsideLens(e).inside) {
                const s = (t.deltaY > 0 ? 1 : -1) > 0 ? 1.2 : 1 / 1.2,
                    n = this.lensLayer.getRadius();
                this.lensLayer.setRadius(n * s), (this.startPos = e), (i = !0), t.preventDefault();
            }
            return i;
        }
        zoomStart(t) {
            if (!this.lensLayer.visible) return;
            (this.zooming = !0), (this.oldCursorPos = t);
            const e = this.getScenePosition(t),
                i = this.getFocus(),
                s = i.radius,
                n = i.position;
            let r = e.x - n.x,
                o = e.y - n.y,
                a = Math.sqrt(r * r + o * o);
            this.deltaR = a - s;
        }
        zoomMove(t) {
            if (this.zooming) {
                const e = this.getScenePosition(t),
                    i = this.getFocus().position;
                let s = { x: e.x - i.x, y: e.y - i.y },
                    n = Math.sqrt(s.x * s.x + s.y * s.y);
                const r = this.camera.getCurrentTransform(performance.now()).z,
                    o = W.getRadiusRangeCanvas(this.camera.viewport),
                    a = Math.max(o.min / r, n - this.deltaR);
                this.lensLayer.setRadius(a, this.zoomDelay);
            }
        }
        zoomEnd() {
            this.zooming = !1;
        }
        getFocus() {
            return { position: this.lensLayer.getCurrentCenter(), radius: this.lensLayer.getRadius() };
        }
        isInsideLens(t) {
            const e = this.lensLayer.getCurrentCenter(),
                i = t.x - e.x,
                s = t.y - e.y,
                n = Math.sqrt(i * i + s * s),
                r = this.lensLayer.getRadius(),
                o = n < r,
                a = this.camera.getCurrentTransform(performance.now()),
                l = this.lensLayer.getBorderWidth() / a.z;
            return { inside: o, border: o && n > r - l };
        }
        getPixelPosition(t) {
            const e = { x: t.offsetX, y: t.offsetY };
            return a.fromCanvasHtmlToViewport(e, this.camera, this.useGL);
        }
        getScenePosition(t) {
            const e = { x: t.offsetX, y: t.offsetY };
            return a.fromCanvasHtmlToScene(e, this.camera, this.useGL);
        }
        distance(t, e) {
            return Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
        }
    }
    class X {
        constructor(t, i) {
            (i = Object.assign({ containerSpace: 80, borderColor: [0.078, 0.078, 0.078, 1], borderWidth: 12, layerSvgAnnotation: null }, i)),
                Object.assign(this, i),
                (this.lensLayer = null),
                (this.viewer = t),
                (this.elements = []),
                (this.container = document.createElement("div")),
                (this.container.style = "position: absolute; width: 50px; height: 50px; background-color: rgb(200, 0, 0, 0.0); pointer-events: none"),
                this.container.classList.add("openlime-lens-dashboard"),
                this.viewer.containerElement.appendChild(this.container);
            const s = [255 * this.borderColor[0], 255 * this.borderColor[1], 255 * this.borderColor[2], 255 * this.borderColor[3]];
            this.lensElm = e.createSVGElement("svg", { viewBox: "0 0 100 100" });
            const n = e.createSVGElement("circle", { cx: 10, cy: 10, r: 50 });
            n.setAttributeNS(null, "style", `position:absolute; visibility: visible; fill: none; stroke: rgb(${s[0]},${s[1]},${s[2]},${s[3]}); stroke-width: ${this.borderWidth}px;`),
                n.setAttributeNS(null, "shape-rendering", "geometricPrecision"),
                this.lensElm.appendChild(n),
                this.container.appendChild(this.lensElm),
                this.setupCircleInteraction(n),
                (this.lensBox = { x: 0, y: 0, r: 0, w: 0, h: 0 }),
                (this.svgElement = null),
                (this.svgMaskId = "openlime-image-mask"),
                (this.svgMaskUrl = `url(#${this.svgMaskId})`),
                (this.noupdate = !1);
        }
        setupCircleInteraction(t) {
            function e(t, e) {
                return { offsetX: t.clientX - e.offsetLeft - e.clientLeft, offsetY: t.clientY - e.offsetTop - e.clientTop };
            }
            (t.style.pointerEvents = "auto"),
                (this.isCircleSelected = !1),
                this.viewer.containerElement.addEventListener("pointerdown", (i) => {
                    if (t == i.target) {
                        if (((this.isCircleSelected = !0), this.lensLayer.controllers[0])) {
                            const t = e(i, this.viewer.containerElement);
                            this.lensLayer.controllers[0].zoomStart(t);
                        }
                        i.preventDefault(), i.stopPropagation();
                    }
                }),
                this.viewer.containerElement.addEventListener("pointermove", (t) => {
                    if (this.isCircleSelected) {
                        if (this.lensLayer.controllers[0]) {
                            const i = e(t, this.viewer.containerElement);
                            this.lensLayer.controllers[0].zoomMove(i);
                        }
                        t.preventDefault(), t.stopPropagation();
                    }
                }),
                this.viewer.containerElement.addEventListener("pointerup", (t) => {
                    this.isCircleSelected && (this.lensLayer.controllers[0] && this.lensLayer.controllers[0].zoomEnd(), (this.isCircleSelected = !1), t.preventDefault(), t.stopPropagation());
                });
        }
        setLayerSvgAnnotation(t) {
            (this.layerSvgAnnotation = t), (this.svgElement = this.layerSvgAnnotation.svgElement);
        }
        createSvgLensMask() {
            if ((null == this.svgElement && this.setupSvgElement(), null == this.svgElement)) return;
            const t = 100;
            (this.svgMask = e.createSVGElement("mask", { id: this.svgMaskId })),
                (this.svgGroup = e.createSVGElement("g")),
                (this.outMask = e.createSVGElement("rect", { id: "outside-lens-mask", x: -50, y: -50, width: t, height: t, style: "fill:black;" })),
                (this.inMask = e.createSVGElement("circle", { id: "inside-lens-mask", cx: 0, cy: 0, r: 50, style: "fill:white;" })),
                this.svgGroup.appendChild(this.outMask),
                this.svgGroup.appendChild(this.inMask),
                this.svgMask.appendChild(this.svgGroup),
                this.svgElement.appendChild(this.svgMask);
        }
        setupSvgElement() {
            if (this.layerSvgAnnotation) null == this.svgElement && (this.svgElement = this.layerSvgAnnotation.svgElement);
            else {
                let t = this.viewer.canvas.overlayElement.shadowRoot;
                null == t && (t = this.viewer.canvas.overlayElement.attachShadow({ mode: "open" })),
                    (this.svgElement = t.querySelector("svg")),
                    null == this.svgElement &&
                        ((this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg")),
                        this.svgElement.classList.add("openlime-svgoverlay-mask"),
                        this.svgElement.setAttributeNS(null, "style", "pointer-events: none;"),
                        t.appendChild(this.svgElement));
            }
        }
        setMaskOnSvgLayer(t) {
            t.setAttributeNS(null, "mask", this.svgMaskUrl);
        }
        removeMaskFromSvgLayer(t) {
            t.removeAttribute("mask");
        }
        append(t) {
            this.container.appendChild(t);
        }
        setLensRenderingMode(t) {
            this.inMask.setAttributeNS(null, "style", t);
        }
        setBackgroundRenderingMode(t) {
            this.outMask.setAttributeNS(null, "style", t);
        }
        update(t, e, i) {
            const s = a.fromSceneToCanvasHtml({ x: t, y: e }, this.viewer.camera, !1),
                n = performance.now();
            let r = this.viewer.camera.getCurrentTransform(n);
            const o = i * r.z,
                l = 2 * o + 2 * this.containerSpace,
                h = 2 * o + 2 * this.containerSpace,
                c = { x: 0, y: 0 };
            if (
                ((c.x = s.x - o - this.containerSpace),
                (c.y = s.y - o - this.containerSpace),
                (this.container.style.left = `${c.x}px`),
                (this.container.style.top = `${c.y}px`),
                (this.container.style.width = `${l}px`),
                (this.container.style.height = `${h}px`),
                l != this.lensBox.w || h != this.lensBox.h)
            ) {
                const t = Math.ceil(0.5 * l),
                    e = Math.ceil(0.5 * h);
                this.lensElm.setAttributeNS(null, "viewBox", `0 0 ${l} ${h}`);
                const i = this.lensElm.querySelector("circle");
                i.setAttributeNS(null, "cx", t), i.setAttributeNS(null, "cy", e), i.setAttributeNS(null, "r", o - 0.5 * this.borderWidth);
            }
            this.updateMask(r, s, o), (this.lensBox = { x: s.x, y: s.y, r: o, w: l, h: h });
        }
        updateMask(t, e, i) {
            if ((null == this.svgElement && this.createSvgLensMask(), null == this.svgElement)) return;
            const s = this.viewer.camera.viewport;
            if (null != this.layerSvgAnnotation) {
                const e = !0,
                    i = this.layerSvgAnnotation.getSvgGroupTransform(t, e);
                this.svgGroup.setAttribute("transform", i);
            } else this.svgElement.setAttribute("viewBox", `${-s.w / 2} ${-s.h / 2} ${s.w} ${s.h}`);
            this.outMask.setAttribute("x", -s.w / 2),
                this.outMask.setAttribute("y", -s.h / 2),
                this.outMask.setAttribute("width", s.w),
                this.outMask.setAttribute("height", s.h),
                this.inMask.setAttributeNS(null, "cx", e.x - s.w / 2),
                this.inMask.setAttributeNS(null, "cy", e.y - s.h / 2),
                this.inMask.setAttributeNS(null, "r", i - this.borderWidth - 2);
        }
    }
    class Z extends X {
        constructor(t, i) {
            super(t, i),
                (i = Object.assign(
                    {
                        toolSize: 34,
                        toolPadding: 0,
                        group: [-65, 0],
                        actions: {
                            camera: {
                                label: "camera",
                                group: 0,
                                angle: -25,
                                task: (t) => {
                                    this.actions.camera.active || this.toggleLightController();
                                },
                            },
                            light: {
                                label: "light",
                                group: 0,
                                angle: 0,
                                task: (t) => {
                                    this.actions.light.active || this.toggleLightController();
                                },
                            },
                            annoswitch: { label: "annoswitch", group: 1, angle: 0, type: "toggle", toggleClass: ".openlime-lens-dashboard-annoswitch-bar", task: (t) => {} },
                            prev: { label: "prev", group: 1, angle: 25, task: (t) => {} },
                            down: { label: "down", group: 1, angle: 50, task: (t) => {} },
                            next: { label: "next", group: 1, angle: 75, task: (t) => {} },
                        },
                        updateCb: null,
                        updateEndCb: null,
                    },
                    i
                )),
                Object.assign(this, i),
                (this.moving = !1),
                (this.delay = 400),
                (this.timeout = null),
                (this.noupdate = !1);
            const s = [255 * this.borderColor[0], 255 * this.borderColor[1], 255 * this.borderColor[2], 255 * this.borderColor[3]];
            (s[3] = 0.4),
                (this.toolboxBkgSize = 56),
                (this.toolboxBkgPadding = 4),
                (this.toolboxBkg = new Object()),
                (this.toolboxBkg.svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n         <svg\n            viewBox="0 0 200 200"\n            fill="none"\n            version="1.1"\n            id="svg11"\n            xmlns="http://www.w3.org/2000/svg"\n            xmlns:svg="http://www.w3.org/2000/svg">\n           <path id="shape-dashboard-bkg" d="" stroke="none" fill="rgb(${s[0]},${s[1]},${s[2]},${s[3]})"/>\n         </svg>`),
                (this.toolboxBkg.element = e.SVGFromString(this.toolboxBkg.svg)),
                this.toolboxBkg.element.setAttributeNS(null, "style", "position: absolute; top: 0px; left:0px;"),
                this.container.appendChild(this.toolboxBkg.element),
                (this.actions.camera.svg =
                    '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n        \x3c!-- Created with Inkscape (http://www.inkscape.org/) --\x3e\n        \n        <svg\n           viewBox="0 0 83.319054 83.319054"\n           version="1.1"\n           id="svg2495"\n           xmlns="http://www.w3.org/2000/svg"\n           xmlns:svg="http://www.w3.org/2000/svg">\n          <defs\n             id="defs2492" />\n          <g\n             id="layer1"\n             transform="translate(-69.000668,-98.39946)">\n            <g\n               id="g2458"\n               transform="matrix(0.35277777,0,0,0.35277777,46.261671,-65.803422)"\n               class="openlime-lens-dashboard-camera">\n              <path class="openlime-lens-dashboard-button-bkg"\n                 d="m 300.637,583.547 c 0,65.219 -52.871,118.09 -118.09,118.09 -65.219,0 -118.09,-52.871 -118.09,-118.09 0,-65.219 52.871,-118.09 118.09,-118.09 65.219,0 118.09,52.871 118.09,118.09 z"\n                 style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none"\n                 id="path50" />\n              <g\n                 id="g52">\n                <path\n                   d="M 123.445,524.445 H 241.652 V 642.648 H 123.445 Z"\n                   style="fill:#ffffff;fill-opacity:0;fill-rule:nonzero;stroke:#000000;stroke-width:16.7936;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"\n                   id="path54" />\n              </g>\n              <g\n                 id="g56"\n                 transform="scale(1,0.946694)">\n                <path\n                   d="m 190.449,581.031 h -15.793 c -0.011,7.563 0,27.472 0,27.472 0,0 -17.133,0 -25.609,0.025 v 15.779 c 8.476,-0.009 25.609,-0.009 25.609,-0.009 0,0 0,19.881 -0.011,27.485 h 15.793 c 0.011,-7.604 0.011,-27.485 0.011,-27.485 0,0 17.125,0 25.598,0 v -15.795 c -8.473,0 -25.598,0 -25.598,0 0,0 -0.023,-19.904 0,-27.472"\n                   style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:#000000;stroke-width:0.52673;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"\n                   id="path58" />\n              </g>\n              <path\n                 d="m 269.254,557.93 22.332,21.437 c 2.098,2.071 2.195,5.344 0,7.504 l -22.332,21.008 c -1.25,1.25 -5.004,1.25 -6.254,-2.504 v -46.273 c 1.25,-3.672 5.004,-2.422 6.254,-1.172 z"\n                 style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none"\n                 id="path60" />\n              <path\n                 d="M 95.844,607.395 73.508,585.957 c -2.094,-2.07 -2.192,-5.34 0,-7.504 l 22.336,-21.008 c 1.25,-1.25 5,-1.25 6.254,2.504 v 46.274 c -1.254,3.672 -5.004,2.422 -6.254,1.172 z"\n                 style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none"\n                 id="path62" />\n              <path\n                 d="m 157.59,494.32 21.437,-22.332 c 2.071,-2.097 5.344,-2.191 7.504,0 l 21.008,22.332 c 1.25,1.254 1.25,5.004 -2.504,6.254 h -46.273 c -3.672,-1.25 -2.422,-5 -1.172,-6.254 z"\n                 style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none"\n                 id="path64" />\n              <path\n                 d="m 207.055,671.785 -21.438,22.336 c -2.07,2.094 -5.344,2.191 -7.504,0 l -21.008,-22.336 c -1.25,-1.25 -1.25,-5 2.504,-6.25 h 46.274 c 3.672,1.25 2.422,5 1.172,6.25 z"\n                 style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none"\n                 id="path66" />\n            </g>\n          </g>\n        </svg>'),
                (this.actions.light.svg =
                    '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n        \x3c!-- Created with Inkscape (http://www.inkscape.org/) --\x3e\n        \n        <svg\n           viewBox="0 0 83.319054 83.320114"\n           version="1.1"\n           id="svg5698"\n           xmlns="http://www.w3.org/2000/svg"\n           xmlns:svg="http://www.w3.org/2000/svg">\n          <defs\n             id="defs5695" />\n          <g\n             id="layer1"\n             transform="translate(-104.32352,-59.017909)">\n            <g\n               id="g2477"\n               transform="matrix(0.35277777,0,0,0.35277777,-16.220287,-105.16169)"\n               class="openlime-lens-dashboard-light">\n              <path class="openlime-lens-dashboard-button-bkg"\n                 d="m 577.879,583.484 c 0,65.219 -52.871,118.09 -118.09,118.09 -65.219,0 -118.09,-52.871 -118.09,-118.09 0,-65.222 52.871,-118.093 118.09,-118.093 65.219,0 118.09,52.871 118.09,118.093 z"\n                 style="fill:#fbfbfb;fill-opacity:1;fill-rule:nonzero;stroke:none"\n                 id="path74" />\n              <path\n                 d="m 546.496,558.359 22.332,21.438 c 2.098,2.066 2.192,5.34 0,7.504 l -22.332,21.004 c -1.25,1.254 -5.004,1.254 -6.254,-2.5 v -46.274 c 1.25,-3.672 5.004,-2.422 6.254,-1.172 z"\n                 style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none"\n                 id="path76" />\n              <path\n                 d="M 373.082,607.82 350.75,586.383 c -2.094,-2.067 -2.191,-5.34 0,-7.504 l 22.332,-21.004 c 1.254,-1.25 5.004,-1.25 6.254,2.5 v 46.277 c -1.25,3.672 -5,2.422 -6.254,1.168 z"\n                 style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none"\n                 id="path78" />\n              <path\n                 d="m 434.832,494.75 21.438,-22.332 c 2.07,-2.098 5.339,-2.195 7.503,0 l 21.008,22.332 c 1.25,1.25 1.25,5.004 -2.504,6.254 h -46.273 c -3.672,-1.25 -2.422,-5.004 -1.172,-6.254 z"\n                 style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none"\n                 id="path80" />\n              <path\n                 d="m 484.297,672.215 -21.438,22.332 c -2.07,2.098 -5.343,2.195 -7.507,0 l -21.004,-22.332 c -1.25,-1.25 -1.25,-5.004 2.504,-6.254 h 46.273 c 3.672,1.25 2.422,5.004 1.172,6.254 z"\n                 style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none"\n                 id="path82" />\n              <path\n                 d="m 438.223,599.988 c 0,0 -2.161,-0.535 -3.684,0.227 -1.523,0.762 -0.789,8.773 -0.789,8.773 l 16.305,-0.222 c 0,0 -14.071,3.597 -15.383,6.296 -1.317,2.7 1.672,6.786 4.34,7.426 2.136,0.516 45.793,-13.426 46.808,-14.625 0.883,-1.039 1.446,-6.75 0.528,-7.648 -0.922,-0.899 -4.602,-0.789 -4.602,-0.789 0,0 -1.449,0.113 -0.133,-3.934 1.317,-4.051 15.254,-20.137 18.672,-30.262 3.293,-9.753 1.387,-22.531 -2.367,-28.683 -3.965,-6.504 -9.598,-10.688 -17.356,-13.723 -7.789,-3.051 -22.191,-4.773 -33.664,-1.578 -11.425,3.188 -20.32,8.988 -25.507,16.649 -4.657,6.878 -4.473,20.699 -2.895,26.097 1.578,5.403 17.621,25.426 19.199,29.473 1.578,4.051 0.528,6.523 0.528,6.523 z"\n                 style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none"\n                 id="path84" />\n              <g\n                 id="g86"\n                 transform="scale(1,0.855493)">\n                <path\n                   d="m 438.223,701.337 c 0,0 -2.161,-0.626 -3.684,0.265 -1.523,0.89 -0.789,10.255 -0.789,10.255 l 16.305,-0.26 c 0,0 -14.071,4.205 -15.383,7.36 -1.317,3.155 1.672,7.931 4.34,8.68 2.136,0.603 45.793,-15.693 46.808,-17.095 0.883,-1.215 1.446,-7.89 0.528,-8.94 -0.922,-1.051 -4.602,-0.923 -4.602,-0.923 0,0 -1.449,0.133 -0.133,-4.598 1.317,-4.735 15.254,-23.538 18.672,-35.373 3.293,-11.402 1.387,-26.337 -2.367,-33.529 -3.965,-7.603 -9.598,-12.493 -17.356,-16.041 -7.789,-3.566 -22.191,-5.579 -33.664,-1.844 -11.425,3.725 -20.32,10.506 -25.507,19.46 -4.657,8.041 -4.473,24.196 -2.895,30.506 1.578,6.315 17.621,29.721 19.199,34.451 1.578,4.735 0.528,7.626 0.528,7.626 z"\n                   style="fill:none;stroke:#f8f8f8;stroke-width:8.1576;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.00677317"\n                   id="path88" />\n              </g>\n              <path\n                 d="m 435.59,631.598 c 0.394,3.714 14.992,14.851 20.91,15.414 5.914,0.562 5.125,0.898 9.336,-0.453 4.207,-1.348 17.617,-9.223 18.277,-10.571 1.68,-3.453 2.758,-6.976 1.313,-9.113 -1.449,-2.145 -3.946,-0.563 -6.574,0.227 -2.629,0.785 -13.805,5.734 -17.489,6.859 -2.89,0.883 -9.203,-0.563 -9.203,-0.563 0,0 32.012,-10.578 33.266,-12.933 1.316,-2.477 0.262,-6.977 -2.762,-7.539 -1.926,-0.36 -43.785,13.386 -44.836,15.074 -1.055,1.688 -2.238,3.598 -2.238,3.598 z"\n                 style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none"\n                 id="path90" />\n              <g\n                 id="g92"\n                 transform="scale(1,0.855493)">\n                <path\n                   d="m 435.59,738.285 c 0.394,4.343 14.992,17.361 20.91,18.018 5.914,0.658 5.125,1.05 9.336,-0.529 4.207,-1.576 17.617,-10.781 18.277,-12.356 1.68,-4.037 2.758,-8.155 1.313,-10.653 -1.449,-2.507 -3.946,-0.657 -6.574,0.265 -2.629,0.918 -13.805,6.703 -17.489,8.018 -2.89,1.032 -9.203,-0.658 -9.203,-0.658 0,0 32.012,-12.365 33.266,-15.118 1.316,-2.895 0.262,-8.155 -2.762,-8.812 -1.926,-0.421 -43.785,15.648 -44.836,17.62 -1.055,1.973 -2.238,4.205 -2.238,4.205 z"\n                   style="fill:none;stroke:#f8f8f8;stroke-width:8.1576;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.00677317"\n                   id="path94" />\n              </g>\n              <path\n                 d="m 438.223,599.988 c 0,0 -2.161,-0.535 -3.684,0.227 -1.523,0.762 -0.789,8.773 -0.789,8.773 l 16.305,-0.222 c 0,0 -14.071,3.597 -15.383,6.296 -1.317,2.7 1.672,6.786 4.34,7.426 2.136,0.516 45.793,-13.426 46.808,-14.625 0.883,-1.039 1.446,-6.75 0.528,-7.648 -0.922,-0.899 -4.602,-0.789 -4.602,-0.789 0,0 -1.449,0.113 -0.133,-3.934 1.317,-4.051 15.254,-20.137 18.672,-30.262 3.293,-9.753 1.387,-22.531 -2.367,-28.683 -3.965,-6.504 -9.598,-10.688 -17.356,-13.723 -7.789,-3.051 -22.191,-4.773 -33.664,-1.578 -11.425,3.188 -20.32,8.988 -25.507,16.649 -4.657,6.878 -4.473,20.699 -2.895,26.097 1.578,5.403 17.621,25.426 19.199,29.473 1.578,4.051 0.528,6.523 0.528,6.523 z"\n                 style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none"\n                 id="path96" />\n              <g\n                 id="g98"\n                 transform="scale(1,0.855493)">\n                <path\n                   d="m 438.223,701.337 c 0,0 -2.161,-0.626 -3.684,0.265 -1.523,0.89 -0.789,10.255 -0.789,10.255 l 16.305,-0.26 c 0,0 -14.071,4.205 -15.383,7.36 -1.317,3.155 1.672,7.931 4.34,8.68 2.136,0.603 45.793,-15.693 46.808,-17.095 0.883,-1.215 1.446,-7.89 0.528,-8.94 -0.922,-1.051 -4.602,-0.923 -4.602,-0.923 0,0 -1.449,0.133 -0.133,-4.598 1.317,-4.735 15.254,-23.538 18.672,-35.373 3.293,-11.402 1.387,-26.337 -2.367,-33.529 -3.965,-7.603 -9.598,-12.493 -17.356,-16.041 -7.789,-3.566 -22.191,-5.579 -33.664,-1.844 -11.425,3.725 -20.32,10.506 -25.507,19.46 -4.657,8.041 -4.473,24.196 -2.895,30.506 1.578,6.315 17.621,29.721 19.199,34.451 1.578,4.735 0.528,7.626 0.528,7.626 z"\n                   style="fill:none;stroke:#f8f8f8;stroke-width:8.1576;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.00677317"\n                   id="path100" />\n              </g>\n              <path\n                 d="m 435.59,631.598 c 0.394,3.714 14.992,14.851 20.91,15.414 5.914,0.562 5.125,0.898 9.336,-0.453 4.207,-1.348 17.617,-9.223 18.277,-10.571 1.68,-3.453 2.758,-6.976 1.313,-9.113 -1.449,-2.145 -3.946,-0.563 -6.574,0.227 -2.629,0.785 -13.805,5.734 -17.489,6.859 -2.89,0.883 -9.203,-0.563 -9.203,-0.563 0,0 32.012,-10.578 33.266,-12.933 1.316,-2.477 0.262,-6.977 -2.762,-7.539 -1.926,-0.36 -43.785,13.386 -44.836,15.074 -1.055,1.688 -2.238,3.598 -2.238,3.598 z"\n                 style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none"\n                 id="path102" />\n              <g\n                 id="g104"\n                 transform="scale(1,0.855493)">\n                <path\n                   d="m 435.59,738.285 c 0.394,4.343 14.992,17.361 20.91,18.018 5.914,0.658 5.125,1.05 9.336,-0.529 4.207,-1.576 17.617,-10.781 18.277,-12.356 1.68,-4.037 2.758,-8.155 1.313,-10.653 -1.449,-2.507 -3.946,-0.657 -6.574,0.265 -2.629,0.918 -13.805,6.703 -17.489,8.018 -2.89,1.032 -9.203,-0.658 -9.203,-0.658 0,0 32.012,-12.365 33.266,-15.118 1.316,-2.895 0.262,-8.155 -2.762,-8.812 -1.926,-0.421 -43.785,15.648 -44.836,17.62 -1.055,1.973 -2.238,4.205 -2.238,4.205 z"\n                   style="fill:none;stroke:#f8f8f8;stroke-width:8.1576;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.00677317"\n                   id="path106" />\n              </g>\n            </g>\n          </g>\n        </svg>'),
                (this.actions.annoswitch.svg =
                    '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n      \x3c!-- Created with Inkscape (http://www.inkscape.org/) --\x3e\n      \n      <svg\n         viewBox="0 0 83.319054 83.320114"\n         version="1.1"\n         id="svg11415"\n         xml:space="preserve"\n         xmlns="http://www.w3.org/2000/svg"\n         xmlns:svg="http://www.w3.org/2000/svg"><defs\n           id="defs11412"><marker\n             style="overflow:visible"\n             id="TriangleStart"\n             refX="0"\n             refY="0"\n             orient="auto-start-reverse"\n             markerWidth="5.3244081"\n             markerHeight="6.155385"\n             viewBox="0 0 5.3244081 6.1553851"\n             preserveAspectRatio="xMidYMid"><path\n               transform="scale(0.5)"\n               style="fill:context-stroke;fill-rule:evenodd;stroke:context-stroke;stroke-width:1pt"\n               d="M 5.77,0 -2.88,5 V -5 Z"\n               id="path135" /></marker><marker\n             style="overflow:visible"\n             id="TriangleStart-5"\n             refX="0"\n             refY="0"\n             orient="auto-start-reverse"\n             markerWidth="5.3244081"\n             markerHeight="6.155385"\n             viewBox="0 0 5.3244081 6.1553851"\n             preserveAspectRatio="xMidYMid"><path\n               transform="scale(0.5)"\n               style="fill:context-stroke;fill-rule:evenodd;stroke:context-stroke;stroke-width:1pt"\n               d="M 5.77,0 -2.88,5 V -5 Z"\n               id="path135-3" /></marker></defs><g\n           id="g327"\n           transform="translate(129.83427,13.264356)"><g\n             id="g346"><path\n               d="m -46.51522,28.396234 c 0,23.007813 -18.65172,41.659526 -41.65953,41.659526 -23.00782,0 -41.65952,-18.651713 -41.65952,-41.659526 0,-23.00887 18.6517,-41.66059 41.65952,-41.66059 23.00781,0 41.65953,18.65172 41.65953,41.66059 z"\n               style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.352778"\n               id="path68"\n               class="openlime-lens-dashboard-button-bkg" /><g\n               aria-label="i"\n               id="text430"\n               style="font-size:50.8px;line-height:1.25;font-family:\'Palace Script MT\';-inkscape-font-specification:\'Palace Script MT\';font-variant-ligatures:none;letter-spacing:0px;word-spacing:0px;stroke-width:0.264583"\n               transform="matrix(1.9896002,0,0,1.9896002,-378.32178,-41.782121)"><path\n                 d="m 149.74343,19.295724 c -1.4224,1.1176 -2.5908,2.032 -3.5052,2.6416 0.3556,1.0668 0.8128,1.9304 1.9304,3.556 1.4224,-1.27 1.5748,-1.4224 3.302,-2.7432 -0.1524,-0.3048 -0.254,-0.508 -0.6604,-1.1684 -0.3048,-0.6096 -0.3556,-0.6096 -0.762,-1.6256 z m 1.9304,25.4 -0.8636,0.4572 c -3.5052,1.9304 -4.1148,2.1844 -4.7244,2.1844 -0.5588,0 -0.9144,-0.5588 -0.9144,-1.4224 0,-0.8636 0,-0.8636 1.6764,-7.5692 1.8796,-7.7216 1.8796,-7.7216 1.8796,-8.128 0,-0.3048 -0.254,-0.508 -0.6096,-0.508 -0.8636,0 -3.8608,1.6764 -8.0264,4.4704 l -0.1016,1.4224 c 3.0988,-1.6764 3.2512,-1.7272 3.7084,-1.7272 0.4064,0 0.6096,0.3048 0.6096,0.8636 0,0.7112 -0.1524,1.4224 -0.9144,4.318 -2.3876,8.8392 -2.3876,8.8392 -2.3876,10.16 0,1.2192 0.4572,2.032 1.2192,2.032 0.8636,0 2.2352,-0.6604 4.9276,-2.3876 0.9652,-0.6096 1.9304,-1.2192 2.8956,-1.8796 0.4572,-0.254 0.8128,-0.508 1.4224,-0.8636 z"\n                 style="font-weight:bold;font-family:Z003;-inkscape-font-specification:\'Z003 Bold\'"\n                 id="path495" /></g><path\n               style="fill:none;stroke:#000000;stroke-width:17.09477;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"\n               d="M -66.121922,49.608737 -110.22757,7.1826674"\n               id="path465"\n               class="openlime-lens-dashboard-annoswitch-bar" /></g></g></svg>'),
                (this.actions.prev.svg =
                    '<svg\n      viewBox="0 0 83.319054 83.320114"\n      version="1.1"\n      id="svg11415"\n      xml:space="preserve"\n      xmlns="http://www.w3.org/2000/svg"\n      xmlns:svg="http://www.w3.org/2000/svg"><defs\n        id="defs11412"><marker\n          style="overflow:visible"\n          id="TriangleStart"\n          refX="0"\n          refY="0"\n          orient="auto-start-reverse"\n          markerWidth="5.3244081"\n          markerHeight="6.155385"\n          viewBox="0 0 5.3244081 6.1553851"\n          preserveAspectRatio="xMidYMid"><path\n            transform="scale(0.5)"\n            style="fill:context-stroke;fill-rule:evenodd;stroke:context-stroke;stroke-width:1pt"\n            d="M 5.77,0 -2.88,5 V -5 Z"\n            id="path135" /></marker><marker\n          style="overflow:visible"\n          id="TriangleStart-5"\n          refX="0"\n          refY="0"\n          orient="auto-start-reverse"\n          markerWidth="5.3244081"\n          markerHeight="6.155385"\n          viewBox="0 0 5.3244081 6.1553851"\n          preserveAspectRatio="xMidYMid"><path\n            transform="scale(0.5)"\n            style="fill:context-stroke;fill-rule:evenodd;stroke:context-stroke;stroke-width:1pt"\n            d="M 5.77,0 -2.88,5 V -5 Z"\n            id="path135-3" /></marker></defs><g\n        id="g417"\n        transform="matrix(3.3565779,0,0,3.3565779,129.92814,-51.220758)"><g\n          id="g335"><path\n            d="m -172.71351,100.60243 c 0,23.00781 -18.65172,41.65952 -41.65953,41.65952 -23.00782,0 -41.65952,-18.65171 -41.65952,-41.65952 0,-23.00887 18.6517,-41.66059 41.65952,-41.66059 23.00781,0 41.65953,18.65172 41.65953,41.66059 z"\n            style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.352778"\n            id="path68"\n            class="openlime-lens-dashboard-button-bkg"\n            transform="matrix(0.29792248,0,0,0.29792248,37.569341,-2.3002842)" /><path\n            style="fill:#030104"\n            d="m -35.494703,28.624414 c 0,-0.264 0.213,-0.474 0.475,-0.474 h 2.421 c 0.262,0 0.475,0.21 0.475,0.474 0,3.211 2.615,5.826 5.827,5.826 3.212,0 5.827,-2.615 5.827,-5.826 0,-3.214 -2.614,-5.826 -5.827,-5.826 -0.34,0 -0.68,0.028 -1.016,0.089 v 1.647 c 0,0.193 -0.116,0.367 -0.291,0.439 -0.181,0.073 -0.383,0.031 -0.521,-0.104 l -4.832,-3.273 c -0.184,-0.185 -0.184,-0.482 0,-0.667 l 4.833,-3.268 c 0.136,-0.136 0.338,-0.176 0.519,-0.104 0.175,0.074 0.291,0.246 0.291,0.438 v 1.487 c 0.34,-0.038 0.68,-0.057 1.016,-0.057 5.071,0 9.198,4.127 9.198,9.198 0,5.07 -4.127,9.197 -9.198,9.197 -5.07,10e-4 -9.197,-4.126 -9.197,-9.196 z"\n            id="path415" /></g></g></svg>'),
                (this.actions.down.svg =
                    '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n        \x3c!-- Created with Inkscape (http://www.inkscape.org/) --\x3e\n        \n        <svg\n           viewBox="0 0 83.319054 83.320114"\n           version="1.1"\n           id="svg11415"\n           xml:space="preserve"\n           xmlns="http://www.w3.org/2000/svg"\n           xmlns:svg="http://www.w3.org/2000/svg"><defs\n             id="defs11412"><marker\n               style="overflow:visible"\n               id="TriangleStart"\n               refX="0"\n               refY="0"\n               orient="auto-start-reverse"\n               markerWidth="5.3244081"\n               markerHeight="6.155385"\n               viewBox="0 0 5.3244081 6.1553851"\n               preserveAspectRatio="xMidYMid"><path\n                 transform="scale(0.5)"\n                 style="fill:context-stroke;fill-rule:evenodd;stroke:context-stroke;stroke-width:1pt"\n                 d="M 5.77,0 -2.88,5 V -5 Z"\n                 id="path135" /></marker><marker\n               style="overflow:visible"\n               id="TriangleStart-5"\n               refX="0"\n               refY="0"\n               orient="auto-start-reverse"\n               markerWidth="5.3244081"\n               markerHeight="6.155385"\n               viewBox="0 0 5.3244081 6.1553851"\n               preserveAspectRatio="xMidYMid"><path\n                 transform="scale(0.5)"\n                 style="fill:context-stroke;fill-rule:evenodd;stroke:context-stroke;stroke-width:1pt"\n                 d="M 5.77,0 -2.88,5 V -5 Z"\n                 id="path135-3" /></marker></defs><g\n             id="g4652"\n             transform="translate(145.46385,95.197966)"><g\n               id="g4846"\n               transform="translate(-126.60931,52.756264)"><path\n                 d="m 64.464511,-106.29364 c 0,23.007813 -18.65172,41.659526 -41.65953,41.659526 -23.0078196,0 -41.659526,-18.651713 -41.659526,-41.659526 0,-23.00887 18.6517064,-41.66059 41.659526,-41.66059 23.00781,0 41.65953,18.65172 41.65953,41.66059 z"\n                 style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.352778"\n                 id="path68"\n                 class="openlime-lens-dashboard-button-bkg" /><g\n                 id="g2392-5"\n                 transform="matrix(0.26458333,0,0,0.26458333,-283.58108,-263.57207)"><path\n                   style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:40;stroke-linecap:round;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"\n                   d="m 1072.4033,509.27736 h 171.1826"\n                   id="path351-6" /><path\n                   style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:30;stroke-linecap:round;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"\n                   d="m 1185.0215,568.3701 h 59.6026"\n                   id="path351-3-2" /><path\n                   style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:30;stroke-linecap:round;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"\n                   d="m 1184.2167,621.15576 h 59.6026"\n                   id="path351-3-2-0" /><path\n                   style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:40;stroke-linecap:round;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"\n                   d="m 1072.4033,679.59496 h 171.1826"\n                   id="path351-3-6-7-1" /><path\n                   style="display:inline;fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:11.4448;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1;marker-end:url(#TriangleStart-5)"\n                   d="m 1074.9115,570.87447 54.1203,-0.0275"\n                   id="path1366-2" /><path\n                   style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:14;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"\n                   d="m 1080.0425,521.28147 v 54.87857"\n                   id="path1402-7" /><path\n                   style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"\n                   d="m 1150.8866,623.00688 0.3956,-5.02729"\n                   id="path2545" /><path\n                   style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:30;stroke-linecap:round;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"\n                   d="m 1185.0215,567.71656 h 59.6026"\n                   id="path2720" /></g></g></g></svg>'),
                (this.actions.next.svg =
                    '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n      \x3c!-- Created with Inkscape (http://www.inkscape.org/) --\x3e\n      \n      <svg\n         viewBox="0 0 83.319054 83.320114"\n         version="1.1"\n         id="svg11415"\n         xml:space="preserve"\n         xmlns="http://www.w3.org/2000/svg"\n         xmlns:svg="http://www.w3.org/2000/svg"><defs\n           id="defs11412"><marker\n             style="overflow:visible"\n             id="TriangleStart"\n             refX="0"\n             refY="0"\n             orient="auto-start-reverse"\n             markerWidth="5.3244081"\n             markerHeight="6.155385"\n             viewBox="0 0 5.3244081 6.1553851"\n             preserveAspectRatio="xMidYMid"><path\n               transform="scale(0.5)"\n               style="fill:context-stroke;fill-rule:evenodd;stroke:context-stroke;stroke-width:1pt"\n               d="M 5.77,0 -2.88,5 V -5 Z"\n               id="path135" /></marker></defs><g\n           id="g4652"\n           transform="translate(-12.647874,74.762541)"><path\n             d="m 95.96693,-33.101955 c 0,23.007813 -18.65172,41.6595258 -41.65953,41.6595258 -23.00782,0 -41.659526,-18.6517128 -41.659526,-41.6595258 0,-23.008872 18.651706,-41.660586 41.659526,-41.660586 23.00781,0 41.65953,18.651714 41.65953,41.660586 z"\n             style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.352778"\n             id="path68"\n             class="openlime-lens-dashboard-button-bkg" /><g\n             id="g4636"\n             transform="translate(173.74831,-50.897484)"><path\n               style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:10.5833;stroke-linecap:round;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"\n               d="m -142.08694,-4.7366002 h 45.292059"\n               id="path351" /><path\n               style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:10.5833;stroke-linecap:round;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"\n               d="m -142.08694,40.326598 h 45.292059"\n               id="path351-3-6-7" /><path\n               style="display:inline;fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:3.20746;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1;marker-end:url(#TriangleStart)"\n               d="m -136.09942,8.7192481 0.008,14.9721889"\n               id="path1366" /><path\n               style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:3.70417;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"\n               d="M -136.07283,-1.5605128 V 24.204958"\n               id="path1402" /><path\n               style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:7.9375;stroke-linecap:round;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"\n               d="m -111.69142,24.864565 h 15.76985"\n               id="path351-3-2-0-3" /><path\n               style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:7.9375;stroke-linecap:round;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"\n               d="m -111.37623,10.725444 h 15.76986"\n               id="path2720-9" /></g></g></svg>'),
                queueMicrotask
                    ? queueMicrotask(() => {
                          this.init();
                      })
                    : setTimeout(() => {
                          this.init();
                      }, 0);
        }
        init() {
            (this.container.style.display = "block"), (this.container.style.margin = "0");
            for (let [t, e] of Object.entries(this.actions)) this.addAction(e);
            (this.actions.camera.active = this.actions.camera.element.classList.toggle("openlime-lens-dashboard-camera-active")),
                (this.actions.light.active = !1),
                this.setActionEnabled("camera"),
                this.setActionEnabled("light"),
                this.setActionEnabled("annoswitch"),
                this.setActionEnabled("next");
        }
        static degToRadians(t) {
            return t * (Math.PI / 180);
        }
        static polarToCartesian(t, e, i, s) {
            const n = ((s - 90) * Math.PI) / 180;
            return { x: t + i * Math.cos(n), y: e + i * Math.sin(n) };
        }
        static describeArc(t, e, i, s, n, r) {
            const o = Z.polarToCartesian(t, e, i + s, r),
                a = Z.polarToCartesian(t, e, i + s, n),
                l = Z.polarToCartesian(t, e, i, r),
                h = Z.polarToCartesian(t, e, i, n),
                c = r - n <= 180 ? "0" : "1";
            return ["M", o.x, o.y, "A", i + s, i + s, 0, c, 0, a.x, a.y, "L", h.x, h.y, "A", i, i, 1, c, 1, l.x, l.y].join(" ");
        }
        setToolboxBkg(t, e, i) {
            const s = this.toolboxBkg.element;
            s.setAttributeNS(null, "viewBox", `0 0 ${e} ${i}`);
            const n = s.querySelector("#shape-dashboard-bkg");
            this.containerSpace;
            const r = this.toolboxBkgSize,
                o = 0.5 * e,
                a = 0.5 * i;
            n.setAttributeNS(null, "d", Z.describeArc(o, a, t, r, -110, 110));
        }
        addAction(t) {
            if (((t.element = e.SVGFromString(t.svg)), (t.element.style = `position:absolute; height: ${this.toolSize}px; margin: 0`), t.element.classList.add("openlime-lens-dashboard-button"), "toggle" == t.type)) {
                (t.element.querySelector(t.toggleClass).style.visibility = "hidden"), (t.active = !1);
            }
            t.element.addEventListener("click", (e) => {
                if ("toggle" == t.type) {
                    t.active = !t.active;
                    const e = t.element.querySelector(t.toggleClass);
                    t.active ? (e.style.visibility = "visible") : (e.style.visibility = "hidden"), (this.noupdate = !0);
                }
                t.task(e), e.preventDefault();
            }),
                this.container.appendChild(t.element);
        }
        getAction(t) {
            let e = null;
            for (let [i, s] of Object.entries(this.actions))
                if (s.label === t) {
                    e = s;
                    break;
                }
            return e;
        }
        setActionEnabled(t, e = !0) {
            const i = this.getAction(t);
            i && i.element.classList.toggle("enabled", e);
        }
        toggleLightController() {
            let t = this.actions.light.element.classList.toggle("openlime-lens-dashboard-light-active");
            (this.actions.light.active = t), (this.actions.camera.active = this.actions.camera.element.classList.toggle("openlime-lens-dashboard-camera-active"));
            for (let e of Object.values(this.viewer.canvas.layers)) for (let i of e.controllers) "light" == i.control && ((i.active = !0), (i.activeModifiers = t ? [0, 2, 4] : [2, 4]));
        }
        setToggleClassVisibility(t) {
            for (let [e, i] of Object.entries(this.actions))
                if ("toggle" == i.type && i.active) {
                    const e = i.element.querySelector(i.toggleClass);
                    e.style.visibility = t ? "visible" : "hidden";
                }
        }
        toggle() {
            const t = this.container.classList.toggle("closed");
            this.setToggleClassVisibility(!t);
        }
        setToolboxElm(t, e, i) {
            this.setToolboxBkg(t - this.borderWidth - 2, e, i), (this.first = !1);
            const s = 2 * Math.asin((0.5 * this.toolSize + this.toolPadding) / t);
            for (let n = 0; n < this.group.length; n++) {
                const r = Object.entries(this.actions).filter(([t, e]) => e.group == n);
                Math.abs(this.group[n]) > 90 && r.reverse();
                let o = 0;
                for (let [a, l] of r) {
                    const r = this.toolSize,
                        a = this.toolSize,
                        h = Z.degToRadians(this.group[n]) + o * s;
                    let c = 0.5 * e + (t + 0.5 * this.toolSize + this.toolboxBkgPadding) * Math.sin(h) - a / 2,
                        d = 0.5 * i - (t + 0.5 * this.toolSize + this.toolboxBkgPadding) * Math.cos(h) - r / 2;
                    (l.element.style.left = `${c}px`), (l.element.style.top = `${d}px`), o++;
                }
            }
        }
        update(t, e, i) {
            if (this.noupdate) return void (this.noupdate = !1);
            super.update(t, e, i);
            const s = { x: this.lensBox.x, y: this.lensBox.y },
                n = this.lensBox.r,
                r = this.lensBox.w,
                o = this.lensBox.h;
            this.updateCb && this.updateCb(s.x, s.y, n, r, o, this.viewer.camera.viewport.w, this.viewer.camera.viewport.h),
                this.moving || (this.toggle(), (this.moving = !0)),
                this.timeout && clearTimeout(this.timeout),
                (this.timeout = setTimeout(() => {
                    this.toggle(), (this.moving = !1), this.setToolboxElm(n, r, o), this.updateEndCb && this.updateEndCb(s.x, s.y, n, r, o, this.viewer.camera.viewport.w, this.viewer.camera.viewport.h);
                }, this.delay));
        }
    }
    class K extends v {
        constructor(t) {
            super((t = Object.assign({ overlayElement: null, shadow: !0, svgElement: null, svgGroup: null, onClick: null, classes: { "": { style: { stroke: "#000" }, label: "" } }, annotationUpdate: null }, t)));
            for (const [t, e] of Object.entries(this.classes))
                this.style +=
                    `[data-class=${t}] { ` +
                    Object.entries(e.style)
                        .map((t) => `${t[0]}: ${t[1]};`)
                        .join("\n") +
                    "}";
        }
        createOverlaySVGElement() {
            (this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg")),
                this.svgElement.classList.add("openlime-svgoverlay"),
                (this.svgGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")),
                this.svgElement.append(this.svgGroup);
            let t = this.overlayElement;
            if ((this.shadow && (t = this.overlayElement.attachShadow({ mode: "open" })), this.style)) {
                const e = document.createElement("style");
                (e.textContent = this.style), t.append(e);
            }
            t.appendChild(this.svgElement);
        }
        setVisible(t) {
            this.svgElement && (this.svgElement.style.display = t ? "block" : "none"), super.setVisible(t);
        }
        clearSelected() {
            this.svgElement || this.createOverlaySVGElement(), this.svgGroup.querySelectorAll("[data-annotation]").forEach((t) => t.classList.remove("selected")), super.clearSelected();
        }
        setSelected(t, e = !0) {
            for (let i of this.svgElement.querySelectorAll(`[data-annotation="${t.id}"]`)) i.classList.toggle("selected", e);
            super.setSelected(t, e);
        }
        newAnnotation(t) {
            let i = e.createSVGElement("svg");
            return t || (t = new y({ element: i, selector_type: "SvgSelector" })), super.newAnnotation(t);
        }
        draw(t, e) {
            if (!this.svgElement) return !0;
            this.svgElement.setAttribute("viewBox", `${-e.w / 2} ${-e.h / 2} ${e.w} ${e.h}`);
            const i = this.getSvgGroupTransform(t);
            return this.svgGroup.setAttribute("transform", i), !0;
        }
        getSvgGroupTransform(t, e = !1) {
            let i = this.transform.compose(t),
                s = this.boundingBox().corner(0);
            return (
                (i = a.reflectY(i)), e ? `translate(${-s.x} ${-s.y})  scale(${1 / i.z} ${1 / i.z}) rotate(${i.a} 0 0) translate(${-i.x} ${-i.y})` : `translate(${i.x} ${i.y}) rotate(${-i.a} 0 0) scale(${i.z} ${i.z}) translate(${s.x} ${s.y})`
            );
        }
        prefetch(t) {
            if ((this.svgElement || this.createOverlaySVGElement(), !this.visible)) return;
            if ("ready" != this.status) return;
            if ("string" == typeof this.annotations) return;
            const e = this.boundingBox();
            this.svgElement.setAttribute("viewBox", `${e.xLow} ${e.yLow} ${e.xHigh - e.xLow} ${e.yHigh - e.yLow}`);
            for (let e of this.annotations) {
                if (!e.ready && "string" == typeof e.svg) {
                    let t = new DOMParser().parseFromString(e.svg, "image/svg+xml").documentElement;
                    (e.elements = [...t.children]), (e.ready = !0);
                }
                if ((this.annotationUpdate && this.annotationUpdate(e, t), e.needsUpdate)) {
                    e.needsUpdate = !1;
                    for (let t of this.svgGroup.querySelectorAll(`[data-annotation="${e.id}"]`)) t.remove();
                    if (e.visible)
                        for (let t of e.elements) {
                            let i = t;
                            i.setAttribute("data-annotation", e.id),
                                i.setAttribute("data-class", e.class),
                                i.classList.add("openlime-annotation"),
                                this.selected.has(e.id) && i.classList.add("selected"),
                                this.svgGroup.appendChild(i),
                                (i.onpointerdown = (t) => {
                                    if (0 == t.button) {
                                        if ((t.preventDefault(), t.stopPropagation(), this.onClick && this.onClick(e))) return;
                                        if (this.selected.has(e.id)) return;
                                        this.clearSelected(), this.setSelected(e, !0);
                                    }
                                });
                        }
                }
            }
        }
    }
    c.prototype.types.svg_annotations = (t) => new K(t);
    class J {
        tap(t) {
            let i = e.createSVGElement("circle", { cx: t.x, cy: t.y, r: 10, class: "point" });
            return this.annotation.elements.push(i), !0;
        }
    }
    class Q {
        constructor(t) {
            Object.assign(this, t);
        }
        tap(t) {
            const e = this.template(t.x, t.y);
            let i = new DOMParser().parseFromString(e, "image/svg+xml").documentElement;
            return (this.annotation.elements[0] = i), !0;
        }
    }
    class tt {
        constructor() {
            this.points = [];
        }
        create(t) {
            if ((this.points.push(t), 1 == this.points.length)) return saveCurrent, (this.path = e.createSVGElement("path", { d: `M${t.x} ${t.y}`, class: "line" })), this.path;
            let i = this.path.getAttribute("d");
            this.path.setAttribute("d", i + ` L${t.x} ${t.y}`), (this.path.points = this.points);
        }
        undo() {
            if (!this.points.length) return;
            this.points.pop();
            let t = this.points.map((t, e) => `${0 == e ? "M" : "L"}${t.x} ${t.y}`).join(" ");
            this.path.setAttribute("d", t), this.points.length < 2 && ((this.points = []), (this.annotation.elements = this.annotation.elements.filter((t) => t != this.path)));
        }
    }
    class et {
        constructor() {
            (this.origin = null), (this.box = null);
        }
        create(t) {
            return (this.origin = t), (this.box = e.createSVGElement("rect", { x: t.x, y: t.y, width: 0, height: 0, class: "rect" })), this.box;
        }
        adjust(t) {
            let e = this.origin;
            this.box.setAttribute("x", Math.min(e.x, t.x)), this.box.setAttribute("width", Math.abs(t.x - e.x)), this.box.setAttribute("y", Math.min(e.y, t.y)), this.box.setAttribute("height", Math.abs(t.y - e.y));
        }
        finish(t) {
            return this.box;
        }
    }
    class it {
        constructor() {
            (this.origin = null), (this.circle = null);
        }
        create(t) {
            return (this.origin = t), (this.circle = e.createSVGElement("circle", { cx: t.x, cy: t.y, r: 0, class: "circle" })), this.circle;
        }
        adjust(t) {
            let e = this.origin,
                i = Math.hypot(t.x - e.x, t.y - e.y);
            this.circle.setAttribute("r", i);
        }
        finish() {
            return this.circle;
        }
    }
    class st {
        constructor() {
            this.history = [];
        }
        create(t) {
            for (let e of this.annotation.elements)
                if (e.points && !(e.points.length < 2)) {
                    if (st.distance(e.points[0], t) * t.z < 5) return e.points.reverse(), (this.path = e), this.path.setAttribute("d", st.svgPath(e.points)), void (this.history = [this.path.points.length]);
                    if (st.distanceToLast(e.points, t) < 5) return (this.path = e), this.adjust(t), void (this.history = [this.path.points.length]);
                }
            (this.path = e.createSVGElement("path", { d: `M${t.x} ${t.y}`, class: "line" })), (this.path.points = [t]), (this.history = [this.path.points.length]), this.annotation.elements.push(this.path);
        }
        tap(t) {
            return this.path ? (this.adjust(t) && (this.history = [this.path.points.length - 1]), !0) : (this.create(t), !1);
        }
        doubleTap(t) {
            return !!this.path && (this.adjust(t) && ((this.history = [this.path.points.length - 1]), (this.path = null)), !1);
        }
        hover(t, e) {}
        quit() {}
        adjust(t) {
            return !(st.distanceToLast(this.path.points, t) * t.z < 4) && (this.path.points.push(t), this.path.getAttribute("d"), this.path.setAttribute("d", st.svgPath(this.path.points)), !0);
        }
        finish() {
            return this.path.setAttribute("d", st.svgPath(this.path.points)), !0;
        }
        undo() {
            return !(!this.path || !this.history.length) && ((this.path.points = this.path.points.slice(0, this.history.pop())), this.path.setAttribute("d", st.svgPath(this.path.points)), !0);
        }
        redo() {
            return !1;
        }
        static svgPath(t) {
            let e = (function (t, e) {
                    let i = Math.pow(e, 2);
                    var s = function (e, n) {
                            var o, a, l, h, c, d, u, p, m, g;
                            let f = t[e],
                                y = t[n];
                            (a = f.x), (l = f.y), (g = (d = y.x - a) * d + (u = y.y - l) * u);
                            let v = i;
                            for (var x = e + 1; x < n; x++) {
                                let e = t[x];
                                0 !== d || 0 !== u
                                    ? (p = ((e.x - a) * d + (e.y - l) * u) / g) > 1
                                        ? ((h = e.x - y.x), (c = e.y - y.y))
                                        : p > 0
                                        ? ((h = e.x - (a + d * p)), (c = e.y - (l + u * p)))
                                        : ((h = e.x - a), (c = e.y - l))
                                    : ((h = e.x - a), (c = e.y - l)),
                                    (m = h * h + c * c) > v && ((o = x), (v = m));
                            }
                            v > i && (o - e > 1 && s(e, o), r.push(t[o]), n - o > 1 && s(o, n));
                        },
                        n = t.length - 1,
                        r = [t[0]];
                    return s(0, n), r.push(t[n]), r;
                })(t, 1.5 / t[0].z),
                i = (function (t, e, i) {
                    e *= 3.1415 / 180;
                    let s,
                        n,
                        r,
                        o,
                        a,
                        l,
                        h = [];
                    if (t.length <= 2) return t.map((t) => [t.x, t.y]);
                    let c = t[0],
                        d = t[t.length - 1],
                        u = 0,
                        p = !1,
                        m = Math.hypot(c.x - d.x, c.y - d.y);
                    for (m < Math.SQRT2 && ((d = c), (u = 0), (c = t[t.length - 2]), (p = !0)), h.push([t[u].x, t[u].y]); u < t.length - 1; u++) {
                        let d = t[u],
                            p = t[u + 1],
                            w = Math.abs(
                                ((f = d.x - c.x),
                                (y = d.y - c.y),
                                (v = p.x - d.x),
                                (x = p.y - d.y),
                                (a = Math.sqrt(f * f + y * y)),
                                a > 0 ? ((s = f / a), (n = y / a)) : ((s = 1), (n = 0)),
                                (l = Math.sqrt(v * v + x * x)),
                                l > 0 ? ((r = v / l), (o = x / l)) : ((r = 1), (o = 0)),
                                Math.acos(s * r + n * o))
                            );
                        if (0 !== a)
                            if (w < e) {
                                i && ((a = Math.min(a, l)), (l = a));
                                let t = (s + r) / 2,
                                    e = (n + o) / 2;
                                if (((m = Math.sqrt(t * t + e * e)), 0 === m)) h.push([d.x, d.y]);
                                else {
                                    if (((t /= m), (e /= m), h.length > 0)) {
                                        var g = h[h.length - 1];
                                        g.push(d.x - t * a * 0.25), g.push(d.y - e * a * 0.25);
                                    }
                                    h.push([d.x, d.y, d.x + t * l * 0.25, d.y + e * l * 0.25]);
                                }
                            } else h.push([d.x, d.y]);
                        c = d;
                    }
                    var f, y, v, x;
                    if (p) {
                        for (c = [], u = 0; u < h[0].length; u++) c.push(h[0][u]);
                        h.push(c);
                    } else h.push([t[t.length - 1].x, t[t.length - 1].y]);
                    return h;
                })(e, 90, !0);
            return (function (t) {
                let e,
                    i = t[0],
                    s = [`M${i[0].toFixed(1)} ${i[1].toFixed(1)}`];
                for (let n = 0; n < t.length - 1; n++)
                    (i = t[n]),
                        (e = t[n + 1]),
                        2 == i.length
                            ? s.push(`l${(e[0] - i[0]).toFixed(1)} ${(e[1] - i[1]).toFixed(1)}`)
                            : 4 == i.length
                            ? s.push(`q${(i[2] - i[0]).toFixed(1)} ${(i[3] - i[1]).toFixed(1)} ${(e[0] - i[0]).toFixed(1)} ${(e[1] - i[1]).toFixed(1)}`)
                            : s.push(`c${(i[2] - i[0]).toFixed(1)} ${(i[3] - i[1]).toFixed(1)} ${(i[4] - i[0]).toFixed(1)} ${(i[5] - i[1]).toFixed(1)} ${(e[0] - i[0]).toFixed(1)} ${(e[1] - i[1]).toFixed(1)}`);
                return s.join(" ");
            })(i);
        }
        static distanceToLast(t, e) {
            let i = t[t.length - 1];
            return st.distance(i, e);
        }
        static distance(t, e) {
            let i = t.x - e.x,
                s = t.y - e.y;
            return Math.sqrt(i * i + s * s);
        }
    }
    class nt {
        create(t, e) {
            (this.erased = !1), this.erase(t, e);
        }
        adjust(t, e) {
            this.erase(t, e);
        }
        finish(t, e) {
            return this.erase(t, e);
        }
        tap(t, e) {
            return this.erase(t, e);
        }
        erase(t, e) {
            for (let i of this.annotation.elements) {
                if (i == e.originSrc) {
                    (i.points = []), (this.erased = !0);
                    continue;
                }
                let s = i.points;
                if (s && s.length) {
                    if (st.distanceToLast(s, t) < 10) (this.erased = !0), s.pop();
                    else {
                        if (!(st.distance(s[0], t) < 10)) continue;
                        (this.erased = !0), s.shift();
                    }
                    s.length <= 2 ? ((i.points = []), i.setAttribute("d", ""), (this.annotation.needsUpdate = !0), (this.erased = !0)) : i.setAttribute("d", st.svgPath(s));
                }
            }
            return (this.annotation.elements = this.annotation.elements.filter((t) => !t.points || t.points.length > 2)), this.erased;
        }
    }
    (t.BoundingBox = i),
        (t.Camera = r),
        (t.Canvas = d),
        (t.Controller = E),
        (t.Controller2D = S),
        (t.ControllerFocusContext = class extends Y {
            static callUpdate(t) {
                t.update();
            }
            constructor(t) {
                if ((super(t), Object.assign(this, { updateTimeInterval: 50, updateDelay: 100, zoomDelay: 150, zoomAmount: 1.5, priority: -100, enableDirectContextControl: !0 }, t), !t.lensLayer))
                    throw (console.log("ControllerFocusContext lensLayer option required"), "ControllerFocusContext lensLayer option required");
                if (!t.camera) throw (console.log("ControllerFocusContext camera option required"), "ControllerFocusContext camera option required");
                if (!t.canvas) throw (console.log("ControllerFocusContext canvas option required"), "ControllerFocusContext canvas option required");
                this.canvas.addEvent("updateSize", () => {
                    const t = this.camera.boundingBox;
                    (this.maxDatasetSize = Math.max(t.width(), t.height())), (this.minDatasetSize = Math.min(t.width(), t.height())), this.setDatasetDimensions(t.width(), t.height());
                }),
                    (this.imageSize = { w: 1, h: 1 }),
                    (this.FocusContextEnabled = !0),
                    (this.centerToClickOffset = { x: 0, y: 0 }),
                    (this.previousClickPos = { x: 0, y: 0 }),
                    (this.currentClickPos = { x: 0, y: 0 }),
                    (this.insideLens = { inside: !1, border: !1 }),
                    (this.panning = !1),
                    (this.zooming = !1),
                    (this.panningCamera = !1),
                    (this.startPos = { x: 0, y: 0 }),
                    (this.initialTransform = this.camera.getCurrentTransform(performance.now())),
                    (this.initialPinchDistance = 1),
                    (this.initialPinchRadius = 1),
                    (this.initialPinchPos = { x: 0, y: 0 });
            }
            panStart(t) {
                if (!this.active) return;
                const e = this.getScenePosition(t);
                (this.panning = !1), (this.insideLens = this.isInsideLens(e));
                const i = this.getPixelPosition(t);
                if (this.lensLayer.visible && this.insideLens.inside) {
                    const t = a.fromSceneToViewport(this.getFocus().position, this.camera, this.useGL);
                    (this.centerToClickOffset = { x: i.x - t.x, y: i.y - t.y }), (this.currentClickPos = { x: i.x, y: i.y }), (this.panning = !0);
                } else this.enableDirectContextControl && ((this.startPos = i), (this.initialTransform = this.camera.getCurrentTransform(performance.now())), (this.camera.target = this.initialTransform.copy()), (this.panningCamera = !0));
                t.preventDefault(), (this.timeOut = setInterval(this.update.bind(this), 50));
            }
            panMove(t) {
                if (!(Math.abs(t.offsetX) > 64e3 || Math.abs(t.offsetY) > 64e3))
                    if (((this.currentClickPos = this.getPixelPosition(t)), this.panning));
                    else if (this.panningCamera) {
                        let t = this.initialTransform,
                            e = this.currentClickPos.x - this.startPos.x,
                            i = this.currentClickPos.y - this.startPos.y;
                        this.camera.setPosition(this.updateDelay, t.x + e, t.y + i, t.z, t.a);
                    }
            }
            pinchStart(t, e) {
                if (!this.active) return;
                const i = this.getScenePosition(t),
                    s = this.getScenePosition(e),
                    n = { x: 0.5 * (i.x + s.x), y: 0.5 * (i.y + s.y) };
                (this.initialPinchPos = { x: 0.5 * (t.offsetX + e.offsetX), y: 0.5 * (t.offsetY + e.offsetY) }),
                    (this.insideLens = this.isInsideLens(n)),
                    (this.zooming = !0),
                    (this.initialPinchDistance = this.distance(t, e)),
                    (this.initialPinchRadius = this.lensLayer.getRadius()),
                    t.preventDefault();
            }
            pinchMove(t, e) {
                if (this.zooming) {
                    const i = this.distance(t, e),
                        s = i / (this.initialPinchDistance + 1e-5);
                    if (this.lensLayer.visible && this.insideLens.inside) {
                        const t = (s * this.initialPinchRadius) / this.lensLayer.getRadius();
                        this.updateRadiusAndScale(t);
                    } else this.enableDirectContextControl && (this.updateScale(this.initialPinchPos.x, this.initialPinchPos.y, s), (this.initialPinchDistance = i));
                }
            }
            pinchEnd(t, e, i, s) {
                this.zooming = !1;
            }
            zoomStart(t) {
                this.lensLayer.visible && (super.zoomStart(t), (this.timeOut = setInterval(this.zoomUpdate.bind(this), 50)));
            }
            zoomMove(t) {
                if (this.zooming) {
                    this.oldCursorPos = t;
                    let e = this.camera.getCurrentTransform(performance.now());
                    const i = this.getScenePosition(t),
                        s = this.getFocus(),
                        n = s.position;
                    let r = { x: i.x - n.x, y: i.y - n.y },
                        o = Math.sqrt(r.x * r.x + r.y * r.y);
                    const a = W.getRadiusRangeCanvas(this.camera.viewport),
                        l = Math.max(a.min / e.z, o - this.deltaR) / s.radius;
                    this.updateRadiusAndScale(l);
                }
            }
            zoomUpdate() {
                if (this.zooming) {
                    const t = this.getScenePosition(this.oldCursorPos),
                        e = this.getFocus(),
                        i = e.position;
                    let s = { x: t.x - i.x, y: t.y - i.y },
                        n = Math.sqrt(s.x * s.x + s.y * s.y);
                    const r = W.getRadiusRangeCanvas(this.camera.viewport);
                    let o = this.camera.getCurrentTransform(performance.now());
                    const a = Math.max(r.min / o.z, n - this.deltaR) / e.radius;
                    this.updateRadiusAndScale(a);
                }
            }
            zoomEnd() {
                this.lensLayer.visible && (super.zoomEnd(), clearTimeout(this.timeOut));
            }
            mouseWheel(t) {
                const e = this.getScenePosition(t);
                this.insideLens = this.isInsideLens(e);
                const i = t.deltaY > 0 ? this.zoomAmount : 1 / this.zoomAmount;
                if (this.lensLayer.visible && this.insideLens.inside) this.updateRadiusAndScale(i);
                else if (this.enableDirectContextControl) {
                    const e = this.getPixelPosition(t);
                    this.updateScale(e.x, e.y, 1 / i);
                }
                t.preventDefault();
            }
            updateRadiusAndScale(t) {
                let e = this.getFocus();
                const i = performance.now();
                let s = this.camera.getCurrentTransform(i);
                W.scale(this.camera, e, s, t), W.adaptContextPosition(this.camera.viewport, e, s), this.camera.setPosition(this.zoomDelay, s.x, s.y, s.z, s.a), this.lensLayer.setRadius(e.radius, this.zoomDelay);
            }
            updateScale(t, e, i) {
                const s = performance.now();
                let n = this.camera.getCurrentTransform(s);
                const r = this.camera.mapToScene(t, e, n),
                    o = this.camera.maxZoom / n.z,
                    a = this.camera.minZoom / n.z;
                (i = Math.min(o, Math.max(a, i))), this.camera.deltaZoom(this.updateDelay, i, r.x, r.y);
            }
            panEnd() {
                this.panning && clearTimeout(this.timeOut), (this.panning = !1), (this.panningCamera = !1), (this.zooming = !1);
            }
            update() {
                if (this.panning) {
                    let t = this.camera.getCurrentTransform(performance.now()),
                        e = this.lastInteractionDelta();
                    (e.x /= t.z), (e.y /= t.z);
                    let i = this.getFocus();
                    this.FocusContextEnabled ? (W.pan(this.camera.viewport, i, t, e, this.imageSize), this.camera.setPosition(this.updateDelay, t.x, t.y, t.z, t.a)) : ((i.position.x += e.x), (i.position.y += e.y)),
                        this.lensLayer.setCenter(i.position.x, i.position.y, this.updateDelay),
                        (this.previousClickPos = [this.currentClickPos.x, this.currentClickPos.y]);
                }
            }
            lastInteractionDelta() {
                let t = { x: 0, y: 0 };
                if (this.panning && this.insideLens.inside) {
                    const e = a.fromSceneToViewport(this.getFocus().position, this.camera, this.useGL);
                    t = { x: this.currentClickPos.x - e.x - this.centerToClickOffset.x, y: this.currentClickPos.y - e.y - this.centerToClickOffset.y };
                } else t = { x: this.currentClickPos.x - this.previousClickPos.x, y: this.currentClickPos.y - this.previousClickPos.y };
                return t;
            }
            setDatasetDimensions(t, e) {
                this.imageSize = { w: t, h: e };
            }
            initLens() {
                const t = 100 / this.camera.getCurrentTransform(performance.now()).z;
                this.lensLayer.setRadius(t), this.lensLayer.setCenter(0.5 * this.imageSize.w, 0.5 * this.imageSize.h);
            }
        }),
        (t.ControllerLens = Y),
        (t.ControllerPanZoom = L),
        (t.CoordinateSystem = a),
        (t.EditorSvgAnnotation = class {
            constructor(t, e, i) {
                (this.layer = e),
                    Object.assign(
                        this,
                        {
                            viewer: t,
                            panning: !1,
                            tool: null,
                            startPoint: null,
                            currentLine: [],
                            annotation: null,
                            priority: 2e4,
                            classes: {
                                "": { stroke: "#000", label: "" },
                                class1: { stroke: "#770", label: "" },
                                class2: { stroke: "#707", label: "" },
                                class3: { stroke: "#777", label: "" },
                                class4: { stroke: "#070", label: "" },
                                class5: { stroke: "#007", label: "" },
                                class6: { stroke: "#077", label: "" },
                            },
                            tools: {
                                point: { img: '<svg width=24 height=24><circle cx=12 cy=12 r=3 fill="red" stroke="gray"/></svg>', tooltip: "New point", tool: J },
                                pin: {
                                    template: (t, e) =>
                                        `<svg xmlns='http://www.w3.org/2000/svg' x='${t}' y='${e}' width='4%' height='4%' class='pin'\n\t\t\t\t\t\tviewBox='0 0 18 18'><path d='M 0,0 C 0,0 4,0 8,0 12,0 16,4 16,8 16,12 12,16 8,16 4,16 0,12 0,8 0,4 0,0 0,0 Z'/><text class='pin-text' x='7' y='8'>${this.annotation.idx}</text></svg>`,
                                    tooltip: "New pin",
                                    tool: Q,
                                },
                                pen: { img: '<svg width=24 height=24><circle cx=12 cy=12 r=3 fill="red" stroke="gray"/></svg>', tooltip: "New polyline", tool: tt },
                                line: {
                                    img:
                                        '<svg width=24 height=24>\n\t\t\t\t\t\t<path d="m 4.7,4.5 c 0.5,4.8 0.8,8.5 3.1,11 2.4,2.6 4.2,-4.8 6.3,-5 2.7,-0.3 5.1,9.3 5.1,9.3" stroke-width="3" fill="none" stroke="grey"/>\n\t\t\t\t\t\t<path d="m 4.7,4.5 c 0.5,4.8 0.8,8.5 3.1,11 2.4,2.6 4.2,-4.8 6.3,-5 2.7,-0.3 5.1,9.3 5.1,9.3" stroke-width="1" fill="none" stroke="red"/></svg>',
                                    tooltip: "New line",
                                    tool: st,
                                },
                                erase: { img: "", tooltip: "Erase lines", tool: nt },
                                box: { img: '<svg width=24 height=24><rect x=5 y=5 width=14 height=14 fill="red" stroke="gray"/></svg>', tooltip: "New box", tool: et },
                                circle: { img: '<svg width=24 height=24><circle cx=12 cy=12 r=7 fill="red" stroke="gray"/></svg>', tooltip: "New circle", tool: it },
                            },
                            annotation: null,
                            enableState: !1,
                            customState: null,
                            customData: null,
                            editWidget: null,
                            selectedCallback: null,
                            createCallback: null,
                            updateCallback: null,
                            deleteCallback: null,
                        },
                        i
                    ),
                    (e.style += Object.entries(this.classes)
                        .map((t) => `[data-class=${t[0]}] { stroke:${t[1].style.stroke}; }`)
                        .join("\n")),
                    t.pointerManager.onEvent(this),
                    document.addEventListener("keyup", (t) => this.keyUp(t), !1),
                    e.addEvent("selected", (t) => {
                        t && t != this.annotation && (this.selectedCallback && this.selectedCallback(t), this.showEditWidget(t));
                    }),
                    (e.annotationsEntry = () => {
                        let t = {
                            html: '<div class="openlime-tools"></div>',
                            list: [],
                            classes: "openlime-annotations",
                            status: () => "active",
                            oncreate: () => {
                                Array.isArray(e.annotations) && e.createAnnotationsList();
                                let i = {
                                    add: {
                                        action: () => {
                                            this.createAnnotation();
                                        },
                                        title: "New annotation",
                                    },
                                    edit: {
                                        action: () => {
                                            this.toggleEditWidget();
                                        },
                                        title: "Edit annotations",
                                    },
                                    export: {
                                        action: () => {
                                            this.exportAnnotations();
                                        },
                                        title: "Export annotations",
                                    },
                                    trash: {
                                        action: () => {
                                            this.deleteSelected();
                                        },
                                        title: "Delete selected annotations",
                                    },
                                };
                                (async () => {
                                    for (const [e, s] of Object.entries(i)) {
                                        let i = await O.appendIcon(t.element.firstChild, ".openlime-" + e);
                                        i.setAttribute("title", s.title), i.addEventListener("click", s.action);
                                    }
                                })();
                            },
                        };
                        return (e.annotationsListEntry = t), t;
                    });
            }
            createAnnotation() {
                let t = this.layer.newAnnotation();
                this.customData && this.customData(t), this.enableState && this.setAnnotationCurrentState(t), (t.idx = this.layer.annotations.length), (t.publish = 1), (t.label = t.description = t.class = "");
                let e = { id: t.id, idx: t.idx, label: t.label, description: t.description, class: t.class, svg: null, publish: t.publish, data: t.data };
                if ((this.enableState && (e = { ...e, state: t.state }), this.createCallback)) {
                    this.createCallback(e) || alert("Failed to create annotation!");
                }
                this.layer.setSelected(t);
            }
            toggleEditWidget() {
                if (this.annotation) return this.hideEditWidget();
                let t = this.layer.selected.values().next().value;
                if (!t) return;
                let e = this.layer.getAnnotationById(t);
                this.showEditWidget(e);
            }
            updateEditWidget() {
                let t = this.annotation,
                    e = this.editWidget;
                t.class || (t.class = ""),
                    (e.querySelector("[name=label]").value = t.label || ""),
                    (e.querySelector("[name=description]").value = t.description || ""),
                    (e.querySelector("[name=idx]").value = t.idx || ""),
                    Object.entries(t.data).map((t) => {
                        e.querySelector(`[name=data-data-${t[0]}]`).value = t[1] || "";
                    }),
                    (e.querySelector("[name=classes]").value = t.class),
                    (e.querySelector("[name=publish]").checked = 1 == t.publish),
                    e.classList.remove("hidden");
                let i = e.querySelector(".openlime-select-button");
                (i.textContent = this.classes[t.class].label), (i.style.background = this.classes[t.class].style.stroke);
            }
            showEditWidget(t) {
                (this.annotation = t),
                    this.setTool(null),
                    this.setActiveTool(),
                    this.layer.annotationsListEntry.element.querySelector(".openlime-edit").classList.add("active"),
                    (async () => {
                        await this.createEditWidget(), this.updateEditWidget();
                    })();
            }
            hideEditWidget() {
                (this.annotation = null), this.setTool(null), this.editWidget.classList.add("hidden"), this.layer.annotationsListEntry.element.querySelector(".openlime-edit").classList.remove("active");
            }
            async createEditWidget() {
                if (this.editWidget) return;
                let t = `\n\t\t\t\t<div class="openlime-annotation-edit">\n\t\t\t\t\t<label for="label">Title:</label> <input name="label" type="text"><br>\n\t\t\t\t\t<label for="description">Description:</label><br>\n\t\t\t\t\t<textarea name="description" cols="30" rows="5"></textarea><br>\n\t\t\t\t\t<span>Class:</span> \n\t\t\t\t\t<div class="openlime-select">\n\t\t\t\t\t\t<input type="hidden" name="classes" value=""/>\n\t\t\t\t\t\t<div class="openlime-select-button"></div>\n\t\t\t\t\t\t<ul class="openlime-select-menu">\n\t\t\t\t\t\t${Object.entries(
                        this.classes
                    )
                        .map((t) => `<li data-class="${t[0]}" style="background:${t[1].style.stroke};">${t[1].label}</li>`)
                        .join("\n")}\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t</div>\n\t\t\t\t\t<label for="idx">Index:</label> <input name="idx" type="text"><br>\t\n\t\t\t\t\t${Object.entries(this.annotation.data)
                        .map((t) => {
                            let e = t[0];
                            return `<label for="data-data-${t[0]}">${e}:</label> <input name="data-data-${t[0]}" type="text"><br>`;
                        })
                        .join(
                            "\n"
                        )}\n\t\t\t\t\t<br>\n\t\t\t\t\t<span><button class="openlime-state">SAVE</button></span>\n\t\t\t\t\t<span><input type="checkbox" name="publish" value=""> Publish</span><br>\n\t\t\t\t\t<div class="openlime-annotation-edit-tools"></div>\n\t\t\t\t</div>`,
                    e = document.createElement("template");
                e.innerHTML = t.trim();
                let i = e.content.firstChild,
                    s = i.querySelector(".openlime-select"),
                    n = i.querySelector(".openlime-select-button"),
                    r = i.querySelector("ul"),
                    o = i.querySelectorAll("li"),
                    a = i.querySelector("[name=classes]");
                i.querySelector(".openlime-state").addEventListener("click", (t) => {
                    this.enableState && this.setAnnotationCurrentState(this.annotation), this.saveCurrent(), this.saveAnnotation();
                }),
                    n.addEventListener("click", (t) => {
                        t.stopPropagation();
                        for (let t of o) t.classList.remove("selected");
                        s.classList.toggle("active");
                    }),
                    r.addEventListener("click", (t) => {
                        t.stopPropagation(),
                            (a.value = t.srcElement.getAttribute("data-class")),
                            a.dispatchEvent(new Event("change")),
                            (n.style.background = this.classes[a.value].style.stroke),
                            (n.textContent = t.srcElement.textContent),
                            s.classList.toggle("active");
                    }),
                    document.addEventListener("click", (t) => {
                        s.classList.remove("active");
                    }),
                    document.querySelector(".openlime-layers-menu").appendChild(i);
                let l = i.querySelector(".openlime-annotation-edit-tools"),
                    h = await O.appendIcon(l, ".openlime-pin");
                h.addEventListener("click", (t) => {
                    this.setTool("pin"), this.setActiveTool(h);
                });
                let c = await O.appendIcon(l, ".openlime-draw");
                c.addEventListener("click", (t) => {
                    this.setTool("line"), this.setActiveTool(c);
                });
                let d = await O.appendIcon(l, ".openlime-erase");
                d.addEventListener("click", (t) => {
                    this.setTool("erase"), this.setActiveTool(d);
                }),
                    (await O.appendIcon(l, ".openlime-undo")).addEventListener("click", (t) => {
                        this.undo();
                    }),
                    (await O.appendIcon(l, ".openlime-redo")).addEventListener("click", (t) => {
                        this.redo();
                    });
                let u = i.querySelector("[name=label]");
                u.addEventListener("blur", (t) => {
                    this.annotation.label != u.value && this.saveCurrent(), this.saveAnnotation();
                });
                let p = i.querySelector("[name=description]");
                p.addEventListener("blur", (t) => {
                    this.annotation.description != p.value && this.saveCurrent(), this.saveAnnotation();
                });
                let m = i.querySelector("[name=idx]");
                m.addEventListener("blur", (t) => {
                    if (this.annotation.idx != m.value) {
                        const t = this.annotation.elements[0];
                        if (t) {
                            const e = t.querySelector(".pin-text");
                            e && (e.textContent = m.value);
                        }
                        this.saveCurrent();
                    }
                    this.saveAnnotation();
                }),
                    Object.entries(this.annotation.data).map((t) => {
                        let e = i.querySelector(`[name=data-data-${t[0]}]`);
                        e.addEventListener("blur", (i) => {
                            this.annotation.data[t[0]] != e.value && this.saveCurrent(), this.saveAnnotation();
                        });
                    });
                let g = i.querySelector("[name=classes]");
                g.addEventListener("change", (t) => {
                    this.annotation.class != g.value && this.saveCurrent(), this.saveAnnotation();
                });
                let f = i.querySelector("[name=publish]");
                f.addEventListener("change", (t) => {
                    this.annotation.publish != f.value && this.saveCurrent(), this.saveAnnotation();
                }),
                    i.classList.add("hidden"),
                    (this.editWidget = i);
            }
            setAnnotationCurrentState(t) {
                (t.state = window.structuredClone(this.viewer.canvas.getState())), this.customState && this.customState(t);
            }
            saveAnnotation() {
                let t = this.editWidget,
                    e = this.annotation;
                (e.label = t.querySelector("[name=label]").value || ""),
                    (e.description = t.querySelector("[name=description]").value || ""),
                    (e.idx = t.querySelector("[name=idx]").value || "0"),
                    Object.entries(e.data).map((i) => {
                        e.data[i[0]] = t.querySelector(`[name=data-data-${i[0]}]`).value || "";
                    }),
                    (e.publish = t.querySelector("[name=publish]").checked ? 1 : 0);
                let i = t.querySelector("[name=classes]");
                (e.class = i.value || ""), (t.querySelector(".openlime-select-button").style.background = this.classes[e.class].style.stroke);
                for (let t of this.annotation.elements) t.setAttribute("data-class", e.class);
                let s = { id: e.id, idx: e.idx, label: e.label, description: e.description, class: e.class, publish: e.publish, data: e.data };
                this.enableState && (s = { ...s, state: e.state });
                let n = new XMLSerializer();
                if (((s.svg = `<svg xmlns="http://www.w3.org/2000/svg">\n\t\t\t\t${e.elements.map((t) => (t.classList.remove("selected"), n.serializeToString(t))).join("\n")}  \n\t\t\t\t</svg>`), this.updateCallback)) {
                    if (!this.updateCallback(s)) return void alert("Failed to update annotation");
                }
                let r = document.createElement("template");
                r.innerHTML = this.layer.createAnnotationEntry(e);
                let o = r.content.firstChild;
                this.layer.annotationsListEntry.element.parentElement.querySelector(`[data-annotation="${e.id}"]`).replaceWith(o), this.layer.setSelected(e);
            }
            deleteSelected() {
                let t = this.layer.selected.values().next().value;
                t && this.deleteAnnotation(t);
            }
            deleteAnnotation(t) {
                let e = this.layer.getAnnotationById(t);
                if (this.deleteCallback) {
                    if (!confirm(`Deleting annotation ${e.label}, are you sure?`)) return;
                    if (!this.deleteCallback(e)) return void alert("Failed to delete this annotation.");
                }
                this.layer.svgGroup.querySelectorAll(`[data-annotation="${e.id}"]`).forEach((t) => t.remove()),
                    this.layer.annotationsListEntry.element.parentElement
                        .querySelector(".openlime-list")
                        .querySelectorAll(`[data-annotation="${e.id}"]`)
                        .forEach((t) => t.remove()),
                    (this.layer.annotations = this.layer.annotations.filter((t) => t !== e)),
                    this.layer.clearSelected(),
                    this.hideEditWidget();
            }
            exportAnnotations() {
                let t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                const i = this.layer.boundingBox();
                t.setAttribute("viewBox", `0 0 ${i.xHigh - i.xLow} ${i.yHigh - i.yLow}`);
                let s = e.createSVGElement("style");
                (s.textContent = this.layer.style), t.appendChild(s);
                let n = new XMLSerializer();
                for (let e of this.layer.annotations)
                    for (let i of e.elements) {
                        if ("path" == i.tagName) {
                            let t = i.getAttribute("d");
                            i.setAttribute("d", t.replaceAll(",", " "));
                        }
                        t.appendChild(i.cloneNode());
                    }
                let r = n.serializeToString(t);
                var o = document.createElement("a");
                o.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(r)),
                    o.setAttribute("download", "annotations.svg"),
                    (o.style.display = "none"),
                    document.body.appendChild(o),
                    o.click(),
                    document.body.removeChild(o);
            }
            setActiveTool(t) {
                if (!this.editWidget) return;
                this.editWidget
                    .querySelector(".openlime-annotation-edit-tools")
                    .querySelectorAll("svg")
                    .forEach((t) => t.classList.remove("active")),
                    t && t.classList.add("active");
            }
            setTool(t) {
                if (((this.tool = t), this.factory && this.factory.quit && this.factory.quit(), t)) {
                    if (!t in this.tools) throw "Unknown editor tool: " + t;
                    (this.factory = new this.tools[t].tool(this.tools[t])), (this.factory.annotation = this.annotation), (this.factory.layer = this.layer);
                }
                document.querySelector(".openlime-overlay").classList.toggle("erase", "erase" == t), document.querySelector(".openlime-overlay").classList.toggle("crosshair", t && "erase" != t);
            }
            undo() {
                let t = this.annotation;
                if (t) {
                    if (this.factory && this.factory.undo && this.factory.undo()) return (t.needsUpdate = !0), void this.viewer.redraw();
                    if (t.history && t.history.length) {
                        t.future.push(this.annoToData(t));
                        let e = t.history.pop();
                        this.dataToAnno(e, t), (t.needsUpdate = !0), this.viewer.redraw(), this.updateEditWidget();
                    }
                }
            }
            redo() {
                let t = this.annotation;
                if (t) {
                    if (this.factory && this.factory.redo && this.factory.redo()) return (t.needsUpdate = !0), void this.viewer.redraw();
                    if (t.future && t.future.length) {
                        t.history.push(this.annoToData(t));
                        let e = t.future.pop();
                        this.dataToAnno(e, t), (t.needsUpdate = !0), this.viewer.redraw(), this.updateEditWidget();
                    }
                }
            }
            saveCurrent() {
                let t = this.annotation;
                t.history || (t.history = []), t.history.push(this.annoToData(t)), (t.future = []);
            }
            annoToData(t) {
                let e = {};
                for (let i of ["id", "label", "description", "class", "publish", "data"]) e[i] = `${t[i] || ""}`;
                return (
                    (e.elements = t.elements.map((t) => {
                        let e = t.cloneNode();
                        return (e.points = t.points), e;
                    })),
                    e
                );
            }
            dataToAnno(t, e) {
                for (let i of ["id", "label", "description", "class", "publish", "data"]) e[i] = `${t[i]}`;
                e.elements = t.elements.map((t) => {
                    let e = t.cloneNode();
                    return (e.points = t.points), e;
                });
            }
            keyUp(t) {
                if (!t.defaultPrevented)
                    switch (t.key) {
                        case "Escape":
                            this.tool && (this.setActiveTool(), this.setTool(null), t.preventDefault());
                            break;
                        case "Delete":
                            this.deleteSelected();
                            break;
                        case "Backspace":
                            break;
                        case "z":
                            t.ctrlKey && this.undo();
                            break;
                        case "Z":
                            t.ctrlKey && this.redo();
                    }
            }
            panStart(t) {
                if (1 != t.buttons || t.ctrlKey || t.altKey || t.shiftKey || t.metaKey) return;
                if (!["line", "erase", "box", "circle"].includes(this.tool)) return;
                (this.panning = !0), t.preventDefault(), this.saveCurrent();
                const e = this.mapToSvg(t);
                this.factory.create(e, t), (this.annotation.needsUpdate = !0), this.viewer.redraw();
            }
            panMove(t) {
                if (!this.panning) return !1;
                const e = this.mapToSvg(t);
                this.factory.adjust(e, t);
            }
            panEnd(t) {
                if (!this.panning) return !1;
                this.panning = !1;
                const e = this.mapToSvg(t);
                this.factory.finish(e, t) ? this.saveAnnotation() : this.annotation.history.pop(), (this.annotation.needsUpdate = !0), this.viewer.redraw();
            }
            fingerHover(t) {
                if ("line" != this.tool) return;
                t.preventDefault();
                const e = this.mapToSvg(t);
                this.factory.hover(e, t), (this.annotation.needsUpdate = !0), this.viewer.redraw();
            }
            fingerSingleTap(t) {
                if (!["point", "pin", "line", "erase"].includes(this.tool)) return;
                t.preventDefault(), this.saveCurrent();
                const e = this.mapToSvg(t);
                this.factory.tap(e, t) ? this.saveAnnotation() : this.annotation.history.pop(), (this.annotation.needsUpdate = !0), this.viewer.redraw();
            }
            fingerDoubleTap(t) {
                if (!["line"].includes(this.tool)) return;
                t.preventDefault(), this.saveCurrent();
                const e = this.mapToSvg(t);
                this.factory.doubleTap(e, t) ? this.saveAnnotation() : this.annotation.history.pop(), (this.annotation.needsUpdate = !0), this.viewer.redraw();
            }
            mapToSvg(t) {
                const e = { x: t.offsetX, y: t.offsetY },
                    i = this.layer.transform;
                console.log(i);
                const s = this.layer.boundingBox(),
                    n = { w: s.width(), h: s.height() };
                return a.fromCanvasHtmlToImage(e, this.viewer.camera, i, n, !1);
            }
        }),
        (t.FocusContext = W),
        (t.HSH = j),
        (t.Layer = c),
        (t.LayerAnnotation = v),
        (t.LayerAnnotationImage = w),
        (t.LayerBRDF = N),
        (t.LayerCombiner = f),
        (t.LayerImage = g),
        (t.LayerLens = V),
        (t.LayerRTI = H),
        (t.LayerSvgAnnotation = K),
        (t.Layout = l),
        (t.LayoutTileImages = x),
        (t.LayoutTiles = b),
        (t.LensDashboard = X),
        (t.LensDashboardNavigator = class extends X {
            constructor(t, i) {
                super(t, i),
                    (i = Object.assign(
                        {
                            toolboxHeight: 22,
                            actions: {
                                camera: {
                                    label: "camera",
                                    task: (t) => {
                                        this.actions.camera.active || this.toggleLightController();
                                    },
                                },
                                light: {
                                    label: "light",
                                    task: (t) => {
                                        this.actions.light.active || this.toggleLightController();
                                    },
                                },
                                annoswitch: { label: "annoswitch", type: "toggle", toggleClass: ".openlime-lens-dashboard-annoswitch-bar", task: (t) => {} },
                                prev: { label: "prev", task: (t) => {} },
                                down: { label: "down", task: (t) => {} },
                                next: { label: "next", task: (t) => {} },
                            },
                            updateCb: null,
                            updateEndCb: null,
                        },
                        i
                    )),
                    Object.assign(this, i),
                    (this.moving = !1),
                    (this.delay = 400),
                    (this.timeout = null),
                    (this.noupdate = !1),
                    (this.angleToolbar = (Math.PI / 180) * 30),
                    (this.container.style.display = "block"),
                    (this.container.style.margin = "0");
                const s = document.createElement("div");
                (s.style = "text-align: center; color: #fff"), s.classList.add("openlime-lens-dashboard-toolbox-header"), (s.innerHTML = "MOVE");
                const n = document.createElement("div");
                (n.style = "text-align: center; color: #fff"),
                    n.classList.add("openlime-lens-dashboard-toolbox-header"),
                    (n.innerHTML = "INFO"),
                    (this.toolbox1 = document.createElement("div")),
                    (this.toolbox1.style = "z-index: 10; position: absolute; padding: 4px; left: 0px; width: fit-content; background-color: rgb(20, 20, 20, 1.0); border-radius: 10px; gap: 8px"),
                    this.toolbox1.classList.add("openlime-lens-dashboard-toolbox"),
                    this.container.appendChild(this.toolbox1),
                    this.toolbox1.appendChild(s),
                    (this.toolbox2 = document.createElement("div")),
                    (this.toolbox2.style = "z-index: 10; position: absolute; padding: 4px; right: 0px; width: fit-content; background-color: rgb(20, 20, 20, 1.0); border-radius: 10px; gap: 8px"),
                    this.toolbox2.classList.add("openlime-lens-dashboard-toolbox"),
                    this.container.appendChild(this.toolbox2),
                    this.toolbox2.appendChild(n),
                    (this.tools1 = document.createElement("div")),
                    (this.tools1.style = `display: flex; justify-content: center; height: ${this.toolboxHeight}px`),
                    this.tools1.classList.add("openlime-lens-dashboard-toolbox-tools"),
                    this.toolbox1.appendChild(this.tools1),
                    (this.tools2 = document.createElement("div")),
                    (this.tools2.style = `display: flex; justify-content: center; height: ${this.toolboxHeight}px`),
                    this.tools2.classList.add("openlime-lens-dashboard-toolbox-tools"),
                    this.toolbox2.appendChild(this.tools2),
                    (this.actions.camera.svg =
                        '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n        \x3c!-- Created with Inkscape (http://www.inkscape.org/) --\x3e\n        \n        <svg\n           viewBox="0 0 83.319054 83.319054"\n           version="1.1"\n           id="svg2495"\n           xmlns="http://www.w3.org/2000/svg"\n           xmlns:svg="http://www.w3.org/2000/svg">\n          <defs\n             id="defs2492" />\n          <g\n             id="layer1"\n             transform="translate(-69.000668,-98.39946)">\n            <g\n               id="g2458"\n               transform="matrix(0.35277777,0,0,0.35277777,46.261671,-65.803422)"\n               class="openlime-lens-dashboard-camera">\n              <path class="openlime-lens-dashboard-button-bkg"\n                 d="m 300.637,583.547 c 0,65.219 -52.871,118.09 -118.09,118.09 -65.219,0 -118.09,-52.871 -118.09,-118.09 0,-65.219 52.871,-118.09 118.09,-118.09 65.219,0 118.09,52.871 118.09,118.09 z"\n                 style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none"\n                 id="path50" />\n              <g\n                 id="g52">\n                <path\n                   d="M 123.445,524.445 H 241.652 V 642.648 H 123.445 Z"\n                   style="fill:#ffffff;fill-opacity:0;fill-rule:nonzero;stroke:#000000;stroke-width:16.7936;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"\n                   id="path54" />\n              </g>\n              <g\n                 id="g56"\n                 transform="scale(1,0.946694)">\n                <path\n                   d="m 190.449,581.031 h -15.793 c -0.011,7.563 0,27.472 0,27.472 0,0 -17.133,0 -25.609,0.025 v 15.779 c 8.476,-0.009 25.609,-0.009 25.609,-0.009 0,0 0,19.881 -0.011,27.485 h 15.793 c 0.011,-7.604 0.011,-27.485 0.011,-27.485 0,0 17.125,0 25.598,0 v -15.795 c -8.473,0 -25.598,0 -25.598,0 0,0 -0.023,-19.904 0,-27.472"\n                   style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:#000000;stroke-width:0.52673;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"\n                   id="path58" />\n              </g>\n              <path\n                 d="m 269.254,557.93 22.332,21.437 c 2.098,2.071 2.195,5.344 0,7.504 l -22.332,21.008 c -1.25,1.25 -5.004,1.25 -6.254,-2.504 v -46.273 c 1.25,-3.672 5.004,-2.422 6.254,-1.172 z"\n                 style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none"\n                 id="path60" />\n              <path\n                 d="M 95.844,607.395 73.508,585.957 c -2.094,-2.07 -2.192,-5.34 0,-7.504 l 22.336,-21.008 c 1.25,-1.25 5,-1.25 6.254,2.504 v 46.274 c -1.254,3.672 -5.004,2.422 -6.254,1.172 z"\n                 style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none"\n                 id="path62" />\n              <path\n                 d="m 157.59,494.32 21.437,-22.332 c 2.071,-2.097 5.344,-2.191 7.504,0 l 21.008,22.332 c 1.25,1.254 1.25,5.004 -2.504,6.254 h -46.273 c -3.672,-1.25 -2.422,-5 -1.172,-6.254 z"\n                 style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none"\n                 id="path64" />\n              <path\n                 d="m 207.055,671.785 -21.438,22.336 c -2.07,2.094 -5.344,2.191 -7.504,0 l -21.008,-22.336 c -1.25,-1.25 -1.25,-5 2.504,-6.25 h 46.274 c 3.672,1.25 2.422,5 1.172,6.25 z"\n                 style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none"\n                 id="path66" />\n            </g>\n          </g>\n        </svg>'),
                    (this.actions.light.svg =
                        '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n        \x3c!-- Created with Inkscape (http://www.inkscape.org/) --\x3e\n        \n        <svg\n           viewBox="0 0 83.319054 83.320114"\n           version="1.1"\n           id="svg5698"\n           xmlns="http://www.w3.org/2000/svg"\n           xmlns:svg="http://www.w3.org/2000/svg">\n          <defs\n             id="defs5695" />\n          <g\n             id="layer1"\n             transform="translate(-104.32352,-59.017909)">\n            <g\n               id="g2477"\n               transform="matrix(0.35277777,0,0,0.35277777,-16.220287,-105.16169)"\n               class="openlime-lens-dashboard-light">\n              <path class="openlime-lens-dashboard-button-bkg"\n                 d="m 577.879,583.484 c 0,65.219 -52.871,118.09 -118.09,118.09 -65.219,0 -118.09,-52.871 -118.09,-118.09 0,-65.222 52.871,-118.093 118.09,-118.093 65.219,0 118.09,52.871 118.09,118.093 z"\n                 style="fill:#fbfbfb;fill-opacity:1;fill-rule:nonzero;stroke:none"\n                 id="path74" />\n              <path\n                 d="m 546.496,558.359 22.332,21.438 c 2.098,2.066 2.192,5.34 0,7.504 l -22.332,21.004 c -1.25,1.254 -5.004,1.254 -6.254,-2.5 v -46.274 c 1.25,-3.672 5.004,-2.422 6.254,-1.172 z"\n                 style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none"\n                 id="path76" />\n              <path\n                 d="M 373.082,607.82 350.75,586.383 c -2.094,-2.067 -2.191,-5.34 0,-7.504 l 22.332,-21.004 c 1.254,-1.25 5.004,-1.25 6.254,2.5 v 46.277 c -1.25,3.672 -5,2.422 -6.254,1.168 z"\n                 style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none"\n                 id="path78" />\n              <path\n                 d="m 434.832,494.75 21.438,-22.332 c 2.07,-2.098 5.339,-2.195 7.503,0 l 21.008,22.332 c 1.25,1.25 1.25,5.004 -2.504,6.254 h -46.273 c -3.672,-1.25 -2.422,-5.004 -1.172,-6.254 z"\n                 style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none"\n                 id="path80" />\n              <path\n                 d="m 484.297,672.215 -21.438,22.332 c -2.07,2.098 -5.343,2.195 -7.507,0 l -21.004,-22.332 c -1.25,-1.25 -1.25,-5.004 2.504,-6.254 h 46.273 c 3.672,1.25 2.422,5.004 1.172,6.254 z"\n                 style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none"\n                 id="path82" />\n              <path\n                 d="m 438.223,599.988 c 0,0 -2.161,-0.535 -3.684,0.227 -1.523,0.762 -0.789,8.773 -0.789,8.773 l 16.305,-0.222 c 0,0 -14.071,3.597 -15.383,6.296 -1.317,2.7 1.672,6.786 4.34,7.426 2.136,0.516 45.793,-13.426 46.808,-14.625 0.883,-1.039 1.446,-6.75 0.528,-7.648 -0.922,-0.899 -4.602,-0.789 -4.602,-0.789 0,0 -1.449,0.113 -0.133,-3.934 1.317,-4.051 15.254,-20.137 18.672,-30.262 3.293,-9.753 1.387,-22.531 -2.367,-28.683 -3.965,-6.504 -9.598,-10.688 -17.356,-13.723 -7.789,-3.051 -22.191,-4.773 -33.664,-1.578 -11.425,3.188 -20.32,8.988 -25.507,16.649 -4.657,6.878 -4.473,20.699 -2.895,26.097 1.578,5.403 17.621,25.426 19.199,29.473 1.578,4.051 0.528,6.523 0.528,6.523 z"\n                 style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none"\n                 id="path84" />\n              <g\n                 id="g86"\n                 transform="scale(1,0.855493)">\n                <path\n                   d="m 438.223,701.337 c 0,0 -2.161,-0.626 -3.684,0.265 -1.523,0.89 -0.789,10.255 -0.789,10.255 l 16.305,-0.26 c 0,0 -14.071,4.205 -15.383,7.36 -1.317,3.155 1.672,7.931 4.34,8.68 2.136,0.603 45.793,-15.693 46.808,-17.095 0.883,-1.215 1.446,-7.89 0.528,-8.94 -0.922,-1.051 -4.602,-0.923 -4.602,-0.923 0,0 -1.449,0.133 -0.133,-4.598 1.317,-4.735 15.254,-23.538 18.672,-35.373 3.293,-11.402 1.387,-26.337 -2.367,-33.529 -3.965,-7.603 -9.598,-12.493 -17.356,-16.041 -7.789,-3.566 -22.191,-5.579 -33.664,-1.844 -11.425,3.725 -20.32,10.506 -25.507,19.46 -4.657,8.041 -4.473,24.196 -2.895,30.506 1.578,6.315 17.621,29.721 19.199,34.451 1.578,4.735 0.528,7.626 0.528,7.626 z"\n                   style="fill:none;stroke:#f8f8f8;stroke-width:8.1576;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.00677317"\n                   id="path88" />\n              </g>\n              <path\n                 d="m 435.59,631.598 c 0.394,3.714 14.992,14.851 20.91,15.414 5.914,0.562 5.125,0.898 9.336,-0.453 4.207,-1.348 17.617,-9.223 18.277,-10.571 1.68,-3.453 2.758,-6.976 1.313,-9.113 -1.449,-2.145 -3.946,-0.563 -6.574,0.227 -2.629,0.785 -13.805,5.734 -17.489,6.859 -2.89,0.883 -9.203,-0.563 -9.203,-0.563 0,0 32.012,-10.578 33.266,-12.933 1.316,-2.477 0.262,-6.977 -2.762,-7.539 -1.926,-0.36 -43.785,13.386 -44.836,15.074 -1.055,1.688 -2.238,3.598 -2.238,3.598 z"\n                 style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none"\n                 id="path90" />\n              <g\n                 id="g92"\n                 transform="scale(1,0.855493)">\n                <path\n                   d="m 435.59,738.285 c 0.394,4.343 14.992,17.361 20.91,18.018 5.914,0.658 5.125,1.05 9.336,-0.529 4.207,-1.576 17.617,-10.781 18.277,-12.356 1.68,-4.037 2.758,-8.155 1.313,-10.653 -1.449,-2.507 -3.946,-0.657 -6.574,0.265 -2.629,0.918 -13.805,6.703 -17.489,8.018 -2.89,1.032 -9.203,-0.658 -9.203,-0.658 0,0 32.012,-12.365 33.266,-15.118 1.316,-2.895 0.262,-8.155 -2.762,-8.812 -1.926,-0.421 -43.785,15.648 -44.836,17.62 -1.055,1.973 -2.238,4.205 -2.238,4.205 z"\n                   style="fill:none;stroke:#f8f8f8;stroke-width:8.1576;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.00677317"\n                   id="path94" />\n              </g>\n              <path\n                 d="m 438.223,599.988 c 0,0 -2.161,-0.535 -3.684,0.227 -1.523,0.762 -0.789,8.773 -0.789,8.773 l 16.305,-0.222 c 0,0 -14.071,3.597 -15.383,6.296 -1.317,2.7 1.672,6.786 4.34,7.426 2.136,0.516 45.793,-13.426 46.808,-14.625 0.883,-1.039 1.446,-6.75 0.528,-7.648 -0.922,-0.899 -4.602,-0.789 -4.602,-0.789 0,0 -1.449,0.113 -0.133,-3.934 1.317,-4.051 15.254,-20.137 18.672,-30.262 3.293,-9.753 1.387,-22.531 -2.367,-28.683 -3.965,-6.504 -9.598,-10.688 -17.356,-13.723 -7.789,-3.051 -22.191,-4.773 -33.664,-1.578 -11.425,3.188 -20.32,8.988 -25.507,16.649 -4.657,6.878 -4.473,20.699 -2.895,26.097 1.578,5.403 17.621,25.426 19.199,29.473 1.578,4.051 0.528,6.523 0.528,6.523 z"\n                 style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none"\n                 id="path96" />\n              <g\n                 id="g98"\n                 transform="scale(1,0.855493)">\n                <path\n                   d="m 438.223,701.337 c 0,0 -2.161,-0.626 -3.684,0.265 -1.523,0.89 -0.789,10.255 -0.789,10.255 l 16.305,-0.26 c 0,0 -14.071,4.205 -15.383,7.36 -1.317,3.155 1.672,7.931 4.34,8.68 2.136,0.603 45.793,-15.693 46.808,-17.095 0.883,-1.215 1.446,-7.89 0.528,-8.94 -0.922,-1.051 -4.602,-0.923 -4.602,-0.923 0,0 -1.449,0.133 -0.133,-4.598 1.317,-4.735 15.254,-23.538 18.672,-35.373 3.293,-11.402 1.387,-26.337 -2.367,-33.529 -3.965,-7.603 -9.598,-12.493 -17.356,-16.041 -7.789,-3.566 -22.191,-5.579 -33.664,-1.844 -11.425,3.725 -20.32,10.506 -25.507,19.46 -4.657,8.041 -4.473,24.196 -2.895,30.506 1.578,6.315 17.621,29.721 19.199,34.451 1.578,4.735 0.528,7.626 0.528,7.626 z"\n                   style="fill:none;stroke:#f8f8f8;stroke-width:8.1576;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.00677317"\n                   id="path100" />\n              </g>\n              <path\n                 d="m 435.59,631.598 c 0.394,3.714 14.992,14.851 20.91,15.414 5.914,0.562 5.125,0.898 9.336,-0.453 4.207,-1.348 17.617,-9.223 18.277,-10.571 1.68,-3.453 2.758,-6.976 1.313,-9.113 -1.449,-2.145 -3.946,-0.563 -6.574,0.227 -2.629,0.785 -13.805,5.734 -17.489,6.859 -2.89,0.883 -9.203,-0.563 -9.203,-0.563 0,0 32.012,-10.578 33.266,-12.933 1.316,-2.477 0.262,-6.977 -2.762,-7.539 -1.926,-0.36 -43.785,13.386 -44.836,15.074 -1.055,1.688 -2.238,3.598 -2.238,3.598 z"\n                 style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:none"\n                 id="path102" />\n              <g\n                 id="g104"\n                 transform="scale(1,0.855493)">\n                <path\n                   d="m 435.59,738.285 c 0.394,4.343 14.992,17.361 20.91,18.018 5.914,0.658 5.125,1.05 9.336,-0.529 4.207,-1.576 17.617,-10.781 18.277,-12.356 1.68,-4.037 2.758,-8.155 1.313,-10.653 -1.449,-2.507 -3.946,-0.657 -6.574,0.265 -2.629,0.918 -13.805,6.703 -17.489,8.018 -2.89,1.032 -9.203,-0.658 -9.203,-0.658 0,0 32.012,-12.365 33.266,-15.118 1.316,-2.895 0.262,-8.155 -2.762,-8.812 -1.926,-0.421 -43.785,15.648 -44.836,17.62 -1.055,1.973 -2.238,4.205 -2.238,4.205 z"\n                   style="fill:none;stroke:#f8f8f8;stroke-width:8.1576;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.00677317"\n                   id="path106" />\n              </g>\n            </g>\n          </g>\n        </svg>'),
                    (this.actions.annoswitch.svg =
                        '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n      \x3c!-- Created with Inkscape (http://www.inkscape.org/) --\x3e\n      \n      <svg\n         viewBox="0 0 83.319054 83.320114"\n         version="1.1"\n         id="svg11415"\n         xml:space="preserve"\n         xmlns="http://www.w3.org/2000/svg"\n         xmlns:svg="http://www.w3.org/2000/svg"><defs\n           id="defs11412"><marker\n             style="overflow:visible"\n             id="TriangleStart"\n             refX="0"\n             refY="0"\n             orient="auto-start-reverse"\n             markerWidth="5.3244081"\n             markerHeight="6.155385"\n             viewBox="0 0 5.3244081 6.1553851"\n             preserveAspectRatio="xMidYMid"><path\n               transform="scale(0.5)"\n               style="fill:context-stroke;fill-rule:evenodd;stroke:context-stroke;stroke-width:1pt"\n               d="M 5.77,0 -2.88,5 V -5 Z"\n               id="path135" /></marker><marker\n             style="overflow:visible"\n             id="TriangleStart-5"\n             refX="0"\n             refY="0"\n             orient="auto-start-reverse"\n             markerWidth="5.3244081"\n             markerHeight="6.155385"\n             viewBox="0 0 5.3244081 6.1553851"\n             preserveAspectRatio="xMidYMid"><path\n               transform="scale(0.5)"\n               style="fill:context-stroke;fill-rule:evenodd;stroke:context-stroke;stroke-width:1pt"\n               d="M 5.77,0 -2.88,5 V -5 Z"\n               id="path135-3" /></marker></defs><g\n           id="g327"\n           transform="translate(129.83427,13.264356)"><g\n             id="g346"><path\n               d="m -46.51522,28.396234 c 0,23.007813 -18.65172,41.659526 -41.65953,41.659526 -23.00782,0 -41.65952,-18.651713 -41.65952,-41.659526 0,-23.00887 18.6517,-41.66059 41.65952,-41.66059 23.00781,0 41.65953,18.65172 41.65953,41.66059 z"\n               style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.352778"\n               id="path68"\n               class="openlime-lens-dashboard-button-bkg" /><g\n               aria-label="i"\n               id="text430"\n               style="font-size:50.8px;line-height:1.25;font-family:\'Palace Script MT\';-inkscape-font-specification:\'Palace Script MT\';font-variant-ligatures:none;letter-spacing:0px;word-spacing:0px;stroke-width:0.264583"\n               transform="matrix(1.9896002,0,0,1.9896002,-378.32178,-41.782121)"><path\n                 d="m 149.74343,19.295724 c -1.4224,1.1176 -2.5908,2.032 -3.5052,2.6416 0.3556,1.0668 0.8128,1.9304 1.9304,3.556 1.4224,-1.27 1.5748,-1.4224 3.302,-2.7432 -0.1524,-0.3048 -0.254,-0.508 -0.6604,-1.1684 -0.3048,-0.6096 -0.3556,-0.6096 -0.762,-1.6256 z m 1.9304,25.4 -0.8636,0.4572 c -3.5052,1.9304 -4.1148,2.1844 -4.7244,2.1844 -0.5588,0 -0.9144,-0.5588 -0.9144,-1.4224 0,-0.8636 0,-0.8636 1.6764,-7.5692 1.8796,-7.7216 1.8796,-7.7216 1.8796,-8.128 0,-0.3048 -0.254,-0.508 -0.6096,-0.508 -0.8636,0 -3.8608,1.6764 -8.0264,4.4704 l -0.1016,1.4224 c 3.0988,-1.6764 3.2512,-1.7272 3.7084,-1.7272 0.4064,0 0.6096,0.3048 0.6096,0.8636 0,0.7112 -0.1524,1.4224 -0.9144,4.318 -2.3876,8.8392 -2.3876,8.8392 -2.3876,10.16 0,1.2192 0.4572,2.032 1.2192,2.032 0.8636,0 2.2352,-0.6604 4.9276,-2.3876 0.9652,-0.6096 1.9304,-1.2192 2.8956,-1.8796 0.4572,-0.254 0.8128,-0.508 1.4224,-0.8636 z"\n                 style="font-weight:bold;font-family:Z003;-inkscape-font-specification:\'Z003 Bold\'"\n                 id="path495" /></g><path\n               style="fill:none;stroke:#000000;stroke-width:17.09477;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"\n               d="M -66.121922,49.608737 -110.22757,7.1826674"\n               id="path465"\n               class="openlime-lens-dashboard-annoswitch-bar" /></g></g></svg>'),
                    (this.actions.prev.svg =
                        '<svg\n               viewBox="0 0 83.319054 83.320114"\n               version="1.1"\n               id="svg11415"\n               xml:space="preserve"\n               xmlns="http://www.w3.org/2000/svg"\n               xmlns:svg="http://www.w3.org/2000/svg"><defs\n                 id="defs11412"><marker\n                   style="overflow:visible"\n                   id="TriangleStart"\n                   refX="0"\n                   refY="0"\n                   orient="auto-start-reverse"\n                   markerWidth="5.3244081"\n                   markerHeight="6.155385"\n                   viewBox="0 0 5.3244081 6.1553851"\n                   preserveAspectRatio="xMidYMid"><path\n                     transform="scale(0.5)"\n                     style="fill:context-stroke;fill-rule:evenodd;stroke:context-stroke;stroke-width:1pt"\n                     d="M 5.77,0 -2.88,5 V -5 Z"\n                     id="path135" /></marker><marker\n                   style="overflow:visible"\n                   id="TriangleStart-5"\n                   refX="0"\n                   refY="0"\n                   orient="auto-start-reverse"\n                   markerWidth="5.3244081"\n                   markerHeight="6.155385"\n                   viewBox="0 0 5.3244081 6.1553851"\n                   preserveAspectRatio="xMidYMid"><path\n                     transform="scale(0.5)"\n                     style="fill:context-stroke;fill-rule:evenodd;stroke:context-stroke;stroke-width:1pt"\n                     d="M 5.77,0 -2.88,5 V -5 Z"\n                     id="path135-3" /></marker></defs><g\n                 id="g417"\n                 transform="matrix(3.3565779,0,0,3.3565779,129.92814,-51.220758)"><g\n                   id="g335"><path\n                     d="m -172.71351,100.60243 c 0,23.00781 -18.65172,41.65952 -41.65953,41.65952 -23.00782,0 -41.65952,-18.65171 -41.65952,-41.65952 0,-23.00887 18.6517,-41.66059 41.65952,-41.66059 23.00781,0 41.65953,18.65172 41.65953,41.66059 z"\n                     style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.352778"\n                     id="path68"\n                     class="openlime-lens-dashboard-button-bkg"\n                     transform="matrix(0.29792248,0,0,0.29792248,37.569341,-2.3002842)" /><path\n                     style="fill:#030104"\n                     d="m -35.494703,28.624414 c 0,-0.264 0.213,-0.474 0.475,-0.474 h 2.421 c 0.262,0 0.475,0.21 0.475,0.474 0,3.211 2.615,5.826 5.827,5.826 3.212,0 5.827,-2.615 5.827,-5.826 0,-3.214 -2.614,-5.826 -5.827,-5.826 -0.34,0 -0.68,0.028 -1.016,0.089 v 1.647 c 0,0.193 -0.116,0.367 -0.291,0.439 -0.181,0.073 -0.383,0.031 -0.521,-0.104 l -4.832,-3.273 c -0.184,-0.185 -0.184,-0.482 0,-0.667 l 4.833,-3.268 c 0.136,-0.136 0.338,-0.176 0.519,-0.104 0.175,0.074 0.291,0.246 0.291,0.438 v 1.487 c 0.34,-0.038 0.68,-0.057 1.016,-0.057 5.071,0 9.198,4.127 9.198,9.198 0,5.07 -4.127,9.197 -9.198,9.197 -5.07,10e-4 -9.197,-4.126 -9.197,-9.196 z"\n                     id="path415" /></g></g></svg>'),
                    (this.actions.down.svg =
                        '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n        \x3c!-- Created with Inkscape (http://www.inkscape.org/) --\x3e\n        \n        <svg\n           viewBox="0 0 83.319054 83.320114"\n           version="1.1"\n           id="svg11415"\n           xml:space="preserve"\n           xmlns="http://www.w3.org/2000/svg"\n           xmlns:svg="http://www.w3.org/2000/svg"><defs\n             id="defs11412"><marker\n               style="overflow:visible"\n               id="TriangleStart"\n               refX="0"\n               refY="0"\n               orient="auto-start-reverse"\n               markerWidth="5.3244081"\n               markerHeight="6.155385"\n               viewBox="0 0 5.3244081 6.1553851"\n               preserveAspectRatio="xMidYMid"><path\n                 transform="scale(0.5)"\n                 style="fill:context-stroke;fill-rule:evenodd;stroke:context-stroke;stroke-width:1pt"\n                 d="M 5.77,0 -2.88,5 V -5 Z"\n                 id="path135" /></marker><marker\n               style="overflow:visible"\n               id="TriangleStart-5"\n               refX="0"\n               refY="0"\n               orient="auto-start-reverse"\n               markerWidth="5.3244081"\n               markerHeight="6.155385"\n               viewBox="0 0 5.3244081 6.1553851"\n               preserveAspectRatio="xMidYMid"><path\n                 transform="scale(0.5)"\n                 style="fill:context-stroke;fill-rule:evenodd;stroke:context-stroke;stroke-width:1pt"\n                 d="M 5.77,0 -2.88,5 V -5 Z"\n                 id="path135-3" /></marker></defs><g\n             id="g4652"\n             transform="translate(145.46385,95.197966)"><g\n               id="g4846"\n               transform="translate(-126.60931,52.756264)"><path\n                 d="m 64.464511,-106.29364 c 0,23.007813 -18.65172,41.659526 -41.65953,41.659526 -23.0078196,0 -41.659526,-18.651713 -41.659526,-41.659526 0,-23.00887 18.6517064,-41.66059 41.659526,-41.66059 23.00781,0 41.65953,18.65172 41.65953,41.66059 z"\n                 style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.352778"\n                 id="path68"\n                 class="openlime-lens-dashboard-button-bkg" /><g\n                 id="g2392-5"\n                 transform="matrix(0.26458333,0,0,0.26458333,-283.58108,-263.57207)"><path\n                   style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:40;stroke-linecap:round;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"\n                   d="m 1072.4033,509.27736 h 171.1826"\n                   id="path351-6" /><path\n                   style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:30;stroke-linecap:round;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"\n                   d="m 1185.0215,568.3701 h 59.6026"\n                   id="path351-3-2" /><path\n                   style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:30;stroke-linecap:round;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"\n                   d="m 1184.2167,621.15576 h 59.6026"\n                   id="path351-3-2-0" /><path\n                   style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:40;stroke-linecap:round;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"\n                   d="m 1072.4033,679.59496 h 171.1826"\n                   id="path351-3-6-7-1" /><path\n                   style="display:inline;fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:11.4448;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1;marker-end:url(#TriangleStart-5)"\n                   d="m 1074.9115,570.87447 54.1203,-0.0275"\n                   id="path1366-2" /><path\n                   style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:14;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"\n                   d="m 1080.0425,521.28147 v 54.87857"\n                   id="path1402-7" /><path\n                   style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"\n                   d="m 1150.8866,623.00688 0.3956,-5.02729"\n                   id="path2545" /><path\n                   style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:30;stroke-linecap:round;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"\n                   d="m 1185.0215,567.71656 h 59.6026"\n                   id="path2720" /></g></g></g></svg>'),
                    (this.actions.next.svg =
                        '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n      \x3c!-- Created with Inkscape (http://www.inkscape.org/) --\x3e\n      \n      <svg\n         viewBox="0 0 83.319054 83.320114"\n         version="1.1"\n         id="svg11415"\n         xml:space="preserve"\n         xmlns="http://www.w3.org/2000/svg"\n         xmlns:svg="http://www.w3.org/2000/svg"><defs\n           id="defs11412"><marker\n             style="overflow:visible"\n             id="TriangleStart"\n             refX="0"\n             refY="0"\n             orient="auto-start-reverse"\n             markerWidth="5.3244081"\n             markerHeight="6.155385"\n             viewBox="0 0 5.3244081 6.1553851"\n             preserveAspectRatio="xMidYMid"><path\n               transform="scale(0.5)"\n               style="fill:context-stroke;fill-rule:evenodd;stroke:context-stroke;stroke-width:1pt"\n               d="M 5.77,0 -2.88,5 V -5 Z"\n               id="path135" /></marker></defs><g\n           id="g4652"\n           transform="translate(-12.647874,74.762541)"><path\n             d="m 95.96693,-33.101955 c 0,23.007813 -18.65172,41.6595258 -41.65953,41.6595258 -23.00782,0 -41.659526,-18.6517128 -41.659526,-41.6595258 0,-23.008872 18.651706,-41.660586 41.659526,-41.660586 23.00781,0 41.65953,18.651714 41.65953,41.660586 z"\n             style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.352778"\n             id="path68"\n             class="openlime-lens-dashboard-button-bkg" /><g\n             id="g4636"\n             transform="translate(173.74831,-50.897484)"><path\n               style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:10.5833;stroke-linecap:round;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"\n               d="m -142.08694,-4.7366002 h 45.292059"\n               id="path351" /><path\n               style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:10.5833;stroke-linecap:round;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"\n               d="m -142.08694,40.326598 h 45.292059"\n               id="path351-3-6-7" /><path\n               style="display:inline;fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:3.20746;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1;marker-end:url(#TriangleStart)"\n               d="m -136.09942,8.7192481 0.008,14.9721889"\n               id="path1366" /><path\n               style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:3.70417;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"\n               d="M -136.07283,-1.5605128 V 24.204958"\n               id="path1402" /><path\n               style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:7.9375;stroke-linecap:round;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"\n               d="m -111.69142,24.864565 h 15.76985"\n               id="path351-3-2-0-3" /><path\n               style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:7.9375;stroke-linecap:round;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"\n               d="m -111.37623,10.725444 h 15.76986"\n               id="path2720-9" /></g></g></svg>');
                for (let [t, i] of Object.entries(this.actions)) {
                    if (((i.element = e.SVGFromString(i.svg)), (i.element.style = "height: 100%; margin: 0 5px"), i.element.classList.add("openlime-lens-dashboard-button"), "toggle" == i.type)) {
                        (i.element.querySelector(i.toggleClass).style.visibility = "hidden"), (i.active = !1);
                    }
                    i.element.addEventListener("click", (t) => {
                        if ("toggle" == i.type) {
                            i.active = !i.active;
                            const t = i.element.querySelector(i.toggleClass);
                            i.active ? (t.style.visibility = "visible") : (t.style.visibility = "hidden"), (this.noupdate = !0);
                        }
                        i.task(t), t.preventDefault();
                    });
                }
                this.tools1.appendChild(this.actions.camera.element),
                    this.tools1.appendChild(this.actions.light.element),
                    this.tools2.appendChild(this.actions.annoswitch.element),
                    this.tools2.appendChild(this.actions.prev.element),
                    this.tools2.appendChild(this.actions.down.element),
                    this.tools2.appendChild(this.actions.next.element),
                    (this.actions.camera.active = this.actions.camera.element.classList.toggle("openlime-lens-dashboard-camera-active")),
                    (this.actions.light.active = !1),
                    this.setActionEnabled("camera"),
                    this.setActionEnabled("light"),
                    this.setActionEnabled("annoswitch"),
                    this.setActionEnabled("next");
            }
            getAction(t) {
                let e = null;
                for (let [i, s] of Object.entries(this.actions))
                    if (s.label === t) {
                        e = s;
                        break;
                    }
                return e;
            }
            setActionEnabled(t, e = !0) {
                const i = this.getAction(t);
                i && i.element.classList.toggle("enabled", e);
            }
            toggleLightController() {
                let t = this.actions.light.element.classList.toggle("openlime-lens-dashboard-light-active");
                (this.actions.light.active = t), (this.actions.camera.active = this.actions.camera.element.classList.toggle("openlime-lens-dashboard-camera-active"));
                for (let e of Object.values(this.viewer.canvas.layers)) for (let i of e.controllers) "light" == i.control && ((i.active = !0), (i.activeModifiers = t ? [0, 2, 4] : [2, 4]));
            }
            toggle() {
                this.container.classList.toggle("closed");
            }
            update(t, e, i) {
                if (this.noupdate) return void (this.noupdate = !1);
                super.update(t, e, i);
                const s = { x: this.lensBox.x, y: this.lensBox.y },
                    n = this.lensBox.r,
                    r = this.lensBox.w,
                    o = this.lensBox.h,
                    a = this.toolbox1.clientWidth,
                    l = this.toolbox1.clientHeight,
                    h = this.toolbox2.clientWidth,
                    c = this.toolbox2.clientHeight;
                let d = n * Math.sin(this.angleToolbar),
                    u = n * Math.cos(this.angleToolbar),
                    p = this.containerSpace + n - d - a / 2,
                    m = this.containerSpace + n + u - l / 2;
                (this.toolbox1.style.left = `${p}px`), (this.toolbox1.style.top = `${m}px`);
                let g = this.containerSpace + n + d - h / 2,
                    f = this.containerSpace + n + u - c / 2;
                (this.toolbox2.style.left = `${g}px`),
                    (this.toolbox2.style.top = `${f}px`),
                    this.updateCb && this.updateCb(s.x, s.y, n, r, o, this.viewer.camera.viewport.w, this.viewer.camera.viewport.h),
                    this.moving || (this.toggle(), (this.moving = !0)),
                    this.timeout && clearTimeout(this.timeout),
                    (this.timeout = setTimeout(() => {
                        this.toggle(), (this.moving = !1), this.updateEndCb && this.updateEndCb(s.x, s.y, n, r, o, this.viewer.camera.viewport.w, this.viewer.camera.viewport.h);
                    }, this.delay));
            }
        }),
        (t.LensDashboardNavigatorRadial = Z),
        (t.PointerManager = M),
        (t.Raster = p),
        (t.RenderingMode = { draw: "fill:white;", hide: "fill:black;" }),
        (t.Ruler = P),
        (t.ScaleBar = D),
        (t.Shader = m),
        (t.ShaderBRDF = q),
        (t.ShaderCombiner = class extends m {
            constructor(t) {
                super(t),
                    (this.mode = "mean"),
                    (this.samplers = [
                        { id: 0, name: "source1", type: "vec3" },
                        { id: 1, name: "source2", type: "vec3" },
                    ]),
                    (this.modes = ["first", "second", "mean", "diff"]),
                    (this.operations = { first: "color = c1;", second: "color = c2;", mean: "color = (c1 + c2)/2.0;", diff: "color = vec4(c2.rgb - c1.rgb, c1.a);" });
            }
            fragShaderSrc(t) {
                let e = !(t instanceof WebGLRenderingContext);
                return `${e ? "#version 300 es" : ""}\n\nprecision highp float; \nprecision highp int; \n\n${e ? "in" : "varying"} vec2 v_texcoord;\n\nuniform sampler2D source1;\nuniform sampler2D source2;\n\n${
                    e ? "out" : ""
                } vec4 color;\n\nvoid main() {\n\tvec4 c1 = texture(source1, v_texcoord);\n\tvec4 c2 = texture(source2, v_texcoord);\n\t${this.operations[this.mode]};\n\t${e ? "" : "gl_FragColor = color;"}\n}\n`;
            }
            vertShaderSrc(t) {
                let e = !(t instanceof WebGLRenderingContext);
                return `${e ? "#version 300 es" : ""}\n\nprecision highp float; \nprecision highp int; \n\n${e ? "in" : "attribute"} vec4 a_position;\n${e ? "in" : "attribute"} vec2 a_texcoord;\n\n${
                    e ? "out" : "varying"
                } vec2 v_texcoord;\n\nvoid main() {\n\tgl_Position = a_position;\n\tv_texcoord = a_texcoord;\n}`;
            }
        }),
        (t.ShaderRTI = I),
        (t.Skin = O),
        (t.Tile = o),
        (t.Transform = s),
        (t.UIBasic = $),
        (t.UIDialog = F),
        (t.Units = _),
        (t.Util = e),
        (t.Viewer = z),
        Object.defineProperty(t, "__esModule", { value: !0 });
});
