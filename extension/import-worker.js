(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
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

  // node_modules/sql.js/dist/sql-wasm-browser.js
  var require_sql_wasm_browser = __commonJS({
    "node_modules/sql.js/dist/sql-wasm-browser.js"(exports, module) {
      var initSqlJsPromise = void 0;
      var initSqlJs2 = function(moduleConfig) {
        if (initSqlJsPromise) {
          return initSqlJsPromise;
        }
        initSqlJsPromise = new Promise(function(resolveModule, reject) {
          var Module = typeof moduleConfig !== "undefined" ? moduleConfig : {};
          var originalOnAbortFunction = Module["onAbort"];
          Module["onAbort"] = function(errorThatCausedAbort) {
            reject(new Error(errorThatCausedAbort));
            if (originalOnAbortFunction) {
              originalOnAbortFunction(errorThatCausedAbort);
            }
          };
          Module["postRun"] = Module["postRun"] || [];
          Module["postRun"].push(function() {
            resolveModule(Module);
          });
          module = void 0;
          var k;
          k ||= typeof Module != "undefined" ? Module : {};
          var aa = !!globalThis.window, ba = !!globalThis.WorkerGlobalScope;
          k.onRuntimeInitialized = function() {
            function a(f, l) {
              switch (typeof l) {
                case "boolean":
                  bc(f, l ? 1 : 0);
                  break;
                case "number":
                  cc(f, l);
                  break;
                case "string":
                  dc(f, l, -1, -1);
                  break;
                case "object":
                  if (null === l) eb(f);
                  else if (null != l.length) {
                    var n = ca(l.length);
                    m.set(l, n);
                    ec3(f, n, l.length, -1);
                    da(n);
                  } else ua(f, "Wrong API use : tried to return a value of an unknown type (" + l + ").", -1);
                  break;
                default:
                  eb(f);
              }
            }
            function b(f, l) {
              for (var n = [], p = 0; p < f; p += 1) {
                var r = t(l + 4 * p, "i32"), v = fc(r);
                if (1 === v || 2 === v) r = gc(r);
                else if (3 === v) r = hc(r);
                else if (4 === v) {
                  v = r;
                  r = ic(v);
                  v = jc(v);
                  for (var J = new Uint8Array(r), I = 0; I < r; I += 1) J[I] = m[v + I];
                  r = J;
                } else r = null;
                n.push(r);
              }
              return n;
            }
            function c(f, l) {
              this.Qa = f;
              this.db = l;
              this.Oa = 1;
              this.yb = [];
            }
            function d(f, l) {
              this.db = l;
              this.ob = ea(f);
              if (null === this.ob) throw Error("Unable to allocate memory for the SQL string");
              this.ub = this.ob;
              this.gb = this.Fb = null;
            }
            function e(f) {
              this.filename = "dbfile_" + (4294967295 * Math.random() >>> 0);
              if (null != f) {
                var l = this.filename, n = "/", p = l;
                n && (n = "string" == typeof n ? n : fa(n), p = l ? ha(n + "/" + l) : n);
                l = ia(true, true);
                p = ja(
                  p,
                  l
                );
                if (f) {
                  if ("string" == typeof f) {
                    n = Array(f.length);
                    for (var r = 0, v = f.length; r < v; ++r) n[r] = f.charCodeAt(r);
                    f = n;
                  }
                  ka(p, l | 146);
                  n = ma(p, 577);
                  na(n, f, 0, f.length, 0);
                  oa(n);
                  ka(p, l);
                }
              }
              this.handleError(q(this.filename, g));
              this.db = t(g, "i32");
              hb(this.db);
              this.pb = {};
              this.Sa = {};
            }
            var g = y(4), h = k.cwrap, q = h("sqlite3_open", "number", ["string", "number"]), w = h("sqlite3_close_v2", "number", ["number"]), u = h("sqlite3_exec", "number", ["number", "string", "number", "number", "number"]), x2 = h("sqlite3_changes", "number", ["number"]), D = h(
              "sqlite3_prepare_v2",
              "number",
              ["number", "string", "number", "number", "number"]
            ), ib = h("sqlite3_sql", "string", ["number"]), lc = h("sqlite3_normalized_sql", "string", ["number"]), jb = h("sqlite3_prepare_v2", "number", ["number", "number", "number", "number", "number"]), mc = h("sqlite3_bind_text", "number", ["number", "number", "number", "number", "number"]), kb = h("sqlite3_bind_blob", "number", ["number", "number", "number", "number", "number"]), nc = h("sqlite3_bind_double", "number", ["number", "number", "number"]), oc = h("sqlite3_bind_int", "number", [
              "number",
              "number",
              "number"
            ]), pc = h("sqlite3_bind_parameter_index", "number", ["number", "string"]), qc = h("sqlite3_step", "number", ["number"]), rc = h("sqlite3_errmsg", "string", ["number"]), sc = h("sqlite3_column_count", "number", ["number"]), tc = h("sqlite3_data_count", "number", ["number"]), uc = h("sqlite3_column_double", "number", ["number", "number"]), lb = h("sqlite3_column_text", "string", ["number", "number"]), vc = h("sqlite3_column_blob", "number", ["number", "number"]), wc = h("sqlite3_column_bytes", "number", ["number", "number"]), xc = h(
              "sqlite3_column_type",
              "number",
              ["number", "number"]
            ), yc = h("sqlite3_column_name", "string", ["number", "number"]), zc = h("sqlite3_reset", "number", ["number"]), Ac = h("sqlite3_clear_bindings", "number", ["number"]), Bc = h("sqlite3_finalize", "number", ["number"]), mb = h("sqlite3_create_function_v2", "number", "number string number number number number number number number".split(" ")), fc = h("sqlite3_value_type", "number", ["number"]), ic = h("sqlite3_value_bytes", "number", ["number"]), hc = h("sqlite3_value_text", "string", ["number"]), jc = h(
              "sqlite3_value_blob",
              "number",
              ["number"]
            ), gc = h("sqlite3_value_double", "number", ["number"]), cc = h("sqlite3_result_double", "", ["number", "number"]), eb = h("sqlite3_result_null", "", ["number"]), dc = h("sqlite3_result_text", "", ["number", "string", "number", "number"]), ec3 = h("sqlite3_result_blob", "", ["number", "number", "number", "number"]), bc = h("sqlite3_result_int", "", ["number", "number"]), ua = h("sqlite3_result_error", "", ["number", "string", "number"]), nb = h("sqlite3_aggregate_context", "number", ["number", "number"]), hb = h(
              "RegisterExtensionFunctions",
              "number",
              ["number"]
            ), ob = h("sqlite3_update_hook", "number", ["number", "number", "number"]);
            c.prototype.bind = function(f) {
              if (!this.Qa) throw "Statement closed";
              this.reset();
              return Array.isArray(f) ? this.Wb(f) : null != f && "object" === typeof f ? this.Xb(f) : true;
            };
            c.prototype.step = function() {
              if (!this.Qa) throw "Statement closed";
              this.Oa = 1;
              var f = qc(this.Qa);
              switch (f) {
                case 100:
                  return true;
                case 101:
                  return false;
                default:
                  throw this.db.handleError(f);
              }
            };
            c.prototype.Pb = function(f) {
              null == f && (f = this.Oa, this.Oa += 1);
              return uc(this.Qa, f);
            };
            c.prototype.hc = function(f) {
              null == f && (f = this.Oa, this.Oa += 1);
              f = lb(this.Qa, f);
              if ("function" !== typeof BigInt) throw Error("BigInt is not supported");
              return BigInt(f);
            };
            c.prototype.mc = function(f) {
              null == f && (f = this.Oa, this.Oa += 1);
              return lb(this.Qa, f);
            };
            c.prototype.getBlob = function(f) {
              null == f && (f = this.Oa, this.Oa += 1);
              var l = wc(this.Qa, f);
              f = vc(this.Qa, f);
              for (var n = new Uint8Array(l), p = 0; p < l; p += 1) n[p] = m[f + p];
              return n;
            };
            c.prototype.get = function(f, l) {
              l = l || {};
              null != f && this.bind(f) && this.step();
              f = [];
              for (var n = tc(this.Qa), p = 0; p < n; p += 1) switch (xc(this.Qa, p)) {
                case 1:
                  var r = l.useBigInt ? this.hc(p) : this.Pb(p);
                  f.push(r);
                  break;
                case 2:
                  f.push(this.Pb(p));
                  break;
                case 3:
                  f.push(this.mc(p));
                  break;
                case 4:
                  f.push(this.getBlob(p));
                  break;
                default:
                  f.push(null);
              }
              return f;
            };
            c.prototype.Db = function() {
              for (var f = [], l = sc(this.Qa), n = 0; n < l; n += 1) f.push(yc(this.Qa, n));
              return f;
            };
            c.prototype.Ob = function(f, l) {
              f = this.get(f, l);
              l = this.Db();
              for (var n = {}, p = 0; p < l.length; p += 1) n[l[p]] = f[p];
              return n;
            };
            c.prototype.lc = function() {
              return ib(this.Qa);
            };
            c.prototype.ic = function() {
              return lc(this.Qa);
            };
            c.prototype.Jb = function(f) {
              null != f && this.bind(f);
              this.step();
              return this.reset();
            };
            c.prototype.Lb = function(f, l) {
              null == l && (l = this.Oa, this.Oa += 1);
              f = ea(f);
              this.yb.push(f);
              this.db.handleError(mc(this.Qa, l, f, -1, 0));
            };
            c.prototype.Vb = function(f, l) {
              null == l && (l = this.Oa, this.Oa += 1);
              var n = ca(f.length);
              m.set(f, n);
              this.yb.push(n);
              this.db.handleError(kb(this.Qa, l, n, f.length, 0));
            };
            c.prototype.Kb = function(f, l) {
              null == l && (l = this.Oa, this.Oa += 1);
              this.db.handleError((f === (f | 0) ? oc : nc)(
                this.Qa,
                l,
                f
              ));
            };
            c.prototype.Yb = function(f) {
              null == f && (f = this.Oa, this.Oa += 1);
              kb(this.Qa, f, 0, 0, 0);
            };
            c.prototype.Mb = function(f, l) {
              null == l && (l = this.Oa, this.Oa += 1);
              switch (typeof f) {
                case "string":
                  this.Lb(f, l);
                  return;
                case "number":
                  this.Kb(f, l);
                  return;
                case "bigint":
                  this.Lb(f.toString(), l);
                  return;
                case "boolean":
                  this.Kb(f + 0, l);
                  return;
                case "object":
                  if (null === f) {
                    this.Yb(l);
                    return;
                  }
                  if (null != f.length) {
                    this.Vb(f, l);
                    return;
                  }
              }
              throw "Wrong API use : tried to bind a value of an unknown type (" + f + ").";
            };
            c.prototype.Xb = function(f) {
              var l = this;
              Object.keys(f).forEach(function(n) {
                var p = pc(l.Qa, n);
                0 !== p && l.Mb(f[n], p);
              });
              return true;
            };
            c.prototype.Wb = function(f) {
              for (var l = 0; l < f.length; l += 1) this.Mb(f[l], l + 1);
              return true;
            };
            c.prototype.reset = function() {
              this.Cb();
              return 0 === Ac(this.Qa) && 0 === zc(this.Qa);
            };
            c.prototype.Cb = function() {
              for (var f; void 0 !== (f = this.yb.pop()); ) da(f);
            };
            c.prototype.cb = function() {
              this.Cb();
              var f = 0 === Bc(this.Qa);
              delete this.db.pb[this.Qa];
              this.Qa = 0;
              return f;
            };
            d.prototype.next = function() {
              if (null === this.ob) return { done: true };
              null !== this.gb && (this.gb.cb(), this.gb = null);
              if (!this.db.db) throw this.Ab(), Error("Database closed");
              var f = pa(), l = y(4);
              qa(g);
              qa(l);
              try {
                this.db.handleError(jb(this.db.db, this.ub, -1, g, l));
                this.ub = t(l, "i32");
                var n = t(g, "i32");
                if (0 === n) return this.Ab(), { done: true };
                this.gb = new c(n, this.db);
                this.db.pb[n] = this.gb;
                return { value: this.gb, done: false };
              } catch (p) {
                throw this.Fb = z(this.ub), this.Ab(), p;
              } finally {
                ra(f);
              }
            };
            d.prototype.Ab = function() {
              da(this.ob);
              this.ob = null;
            };
            d.prototype.jc = function() {
              return null !== this.Fb ? this.Fb : z(this.ub);
            };
            "function" === typeof Symbol && "symbol" === typeof Symbol.iterator && (d.prototype[Symbol.iterator] = function() {
              return this;
            });
            e.prototype.Jb = function(f, l) {
              if (!this.db) throw "Database closed";
              if (l) {
                f = this.Gb(f, l);
                try {
                  f.step();
                } finally {
                  f.cb();
                }
              } else this.handleError(u(this.db, f, 0, 0, g));
              return this;
            };
            e.prototype.exec = function(f, l, n) {
              if (!this.db) throw "Database closed";
              var p = pa(), r = null, v = null, J = null;
              try {
                J = v = ea(f);
                var I = y(4);
                for (f = []; 0 !== t(J, "i8"); ) {
                  qa(g);
                  qa(I);
                  this.handleError(jb(this.db, J, -1, g, I));
                  var L = t(g, "i32");
                  J = t(I, "i32");
                  if (0 !== L) {
                    var G = null;
                    r = new c(L, this);
                    for (null != l && r.bind(l); r.step(); ) null === G && (G = { columns: r.Db(), values: [] }, f.push(G)), G.values.push(r.get(null, n));
                    r.cb();
                  }
                }
                return f;
              } catch (la) {
                throw r && r.cb(), la;
              } finally {
                v && da(v), ra(p);
              }
            };
            e.prototype.ec = function(f, l, n, p, r) {
              "function" === typeof l && (p = n, n = l, l = void 0);
              f = this.Gb(f, l);
              try {
                for (; f.step(); ) n(f.Ob(null, r));
              } finally {
                f.cb();
              }
              if ("function" === typeof p) return p();
            };
            e.prototype.Gb = function(f, l) {
              qa(g);
              this.handleError(D(this.db, f, -1, g, 0));
              f = t(g, "i32");
              if (0 === f) throw "Nothing to prepare";
              var n = new c(f, this);
              null != l && n.bind(l);
              return this.pb[f] = n;
            };
            e.prototype.pc = function(f) {
              return new d(f, this);
            };
            e.prototype.fc = function() {
              Object.values(this.pb).forEach(function(l) {
                l.cb();
              });
              Object.values(this.Sa).forEach(A);
              this.Sa = {};
              this.handleError(w(this.db));
              var f = sa(this.filename);
              this.handleError(q(this.filename, g));
              this.db = t(g, "i32");
              hb(this.db);
              return f;
            };
            e.prototype.close = function() {
              null !== this.db && (Object.values(this.pb).forEach(function(f) {
                f.cb();
              }), Object.values(this.Sa).forEach(A), this.Sa = {}, this.fb && (A(this.fb), this.fb = void 0), this.handleError(w(this.db)), ta("/" + this.filename), this.db = null);
            };
            e.prototype.handleError = function(f) {
              if (0 === f) return null;
              f = rc(this.db);
              throw Error(f);
            };
            e.prototype.kc = function() {
              return x2(this.db);
            };
            e.prototype.bc = function(f, l) {
              Object.prototype.hasOwnProperty.call(this.Sa, f) && (A(this.Sa[f]), delete this.Sa[f]);
              var n = va(function(p, r, v) {
                r = b(r, v);
                try {
                  var J = l.apply(null, r);
                } catch (I) {
                  ua(p, I, -1);
                  return;
                }
                a(p, J);
              }, "viii");
              this.Sa[f] = n;
              this.handleError(mb(
                this.db,
                f,
                l.length,
                1,
                0,
                n,
                0,
                0,
                0
              ));
              return this;
            };
            e.prototype.ac = function(f, l) {
              var n = l.init || function() {
                return null;
              }, p = l.finalize || function(L) {
                return L;
              }, r = l.step;
              if (!r) throw "An aggregate function must have a step function in " + f;
              var v = {};
              Object.hasOwnProperty.call(this.Sa, f) && (A(this.Sa[f]), delete this.Sa[f]);
              l = f + "__finalize";
              Object.hasOwnProperty.call(this.Sa, l) && (A(this.Sa[l]), delete this.Sa[l]);
              var J = va(function(L, G, la) {
                var V = nb(L, 1);
                Object.hasOwnProperty.call(v, V) || (v[V] = n());
                G = b(G, la);
                G = [v[V]].concat(G);
                try {
                  v[V] = r.apply(null, G);
                } catch (Dc) {
                  delete v[V], ua(L, Dc, -1);
                }
              }, "viii"), I = va(function(L) {
                var G = nb(L, 1);
                try {
                  var la = p(v[G]);
                } catch (V) {
                  delete v[G];
                  ua(L, V, -1);
                  return;
                }
                a(L, la);
                delete v[G];
              }, "vi");
              this.Sa[f] = J;
              this.Sa[l] = I;
              this.handleError(mb(this.db, f, r.length - 1, 1, 0, 0, J, I, 0));
              return this;
            };
            e.prototype.vc = function(f) {
              this.fb && (ob(this.db, 0, 0), A(this.fb), this.fb = void 0);
              if (!f) return this;
              this.fb = va(function(l, n, p, r, v) {
                switch (n) {
                  case 18:
                    l = "insert";
                    break;
                  case 23:
                    l = "update";
                    break;
                  case 9:
                    l = "delete";
                    break;
                  default:
                    throw "unknown operationCode in updateHook callback: " + n;
                }
                p = z(p);
                r = z(r);
                if (v > Number.MAX_SAFE_INTEGER) throw "rowId too big to fit inside a Number";
                f(l, p, r, Number(v));
              }, "viiiij");
              ob(this.db, this.fb, 0);
              return this;
            };
            c.prototype.bind = c.prototype.bind;
            c.prototype.step = c.prototype.step;
            c.prototype.get = c.prototype.get;
            c.prototype.getColumnNames = c.prototype.Db;
            c.prototype.getAsObject = c.prototype.Ob;
            c.prototype.getSQL = c.prototype.lc;
            c.prototype.getNormalizedSQL = c.prototype.ic;
            c.prototype.run = c.prototype.Jb;
            c.prototype.reset = c.prototype.reset;
            c.prototype.freemem = c.prototype.Cb;
            c.prototype.free = c.prototype.cb;
            d.prototype.next = d.prototype.next;
            d.prototype.getRemainingSQL = d.prototype.jc;
            e.prototype.run = e.prototype.Jb;
            e.prototype.exec = e.prototype.exec;
            e.prototype.each = e.prototype.ec;
            e.prototype.prepare = e.prototype.Gb;
            e.prototype.iterateStatements = e.prototype.pc;
            e.prototype["export"] = e.prototype.fc;
            e.prototype.close = e.prototype.close;
            e.prototype.handleError = e.prototype.handleError;
            e.prototype.getRowsModified = e.prototype.kc;
            e.prototype.create_function = e.prototype.bc;
            e.prototype.create_aggregate = e.prototype.ac;
            e.prototype.updateHook = e.prototype.vc;
            k.Database = e;
          };
          var wa = "./this.program", xa = globalThis.document?.currentScript?.src;
          ba && (xa = self.location.href);
          var ya = "", za, Aa;
          if (aa || ba) {
            try {
              ya = new URL(".", xa).href;
            } catch {
            }
            ba && (Aa = (a) => {
              var b = new XMLHttpRequest();
              b.open("GET", a, false);
              b.responseType = "arraybuffer";
              b.send(null);
              return new Uint8Array(b.response);
            });
            za = async (a) => {
              a = await fetch(a, { credentials: "same-origin" });
              if (a.ok) return a.arrayBuffer();
              throw Error(a.status + " : " + a.url);
            };
          }
          var Ba = console.log.bind(console), B = console.error.bind(console), Ca, Da = false, Ea, m, C, Fa, E, F, Ga, Ha, H;
          function Ia() {
            var a = Ja.buffer;
            m = new Int8Array(a);
            Fa = new Int16Array(a);
            C = new Uint8Array(a);
            new Uint16Array(a);
            E = new Int32Array(a);
            F = new Uint32Array(a);
            Ga = new Float32Array(a);
            Ha = new Float64Array(a);
            H = new BigInt64Array(a);
            new BigUint64Array(a);
          }
          function Ka(a) {
            k.onAbort?.(a);
            a = "Aborted(" + a + ")";
            B(a);
            Da = true;
            throw new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info.");
          }
          var La;
          async function Ma(a) {
            if (!Ca) try {
              var b = await za(a);
              return new Uint8Array(b);
            } catch {
            }
            if (a == La && Ca) a = new Uint8Array(Ca);
            else if (Aa) a = Aa(a);
            else throw "both async and sync fetching of the wasm failed";
            return a;
          }
          async function Na(a, b) {
            try {
              var c = await Ma(a);
              return await WebAssembly.instantiate(c, b);
            } catch (d) {
              B(`failed to asynchronously prepare wasm: ${d}`), Ka(d);
            }
          }
          async function Oa(a) {
            var b = La;
            if (!Ca) try {
              var c = fetch(b, { credentials: "same-origin" });
              return await WebAssembly.instantiateStreaming(c, a);
            } catch (d) {
              B(`wasm streaming compile failed: ${d}`), B("falling back to ArrayBuffer instantiation");
            }
            return Na(b, a);
          }
          class Pa {
            name = "ExitStatus";
            constructor(a) {
              this.message = `Program terminated with exit(${a})`;
              this.status = a;
            }
          }
          var Qa = (a) => {
            for (; 0 < a.length; ) a.shift()(k);
          }, Ra = [], Sa = [], Ta = () => {
            var a = k.preRun.shift();
            Sa.push(a);
          }, K = 0, Ua = null;
          function t(a, b = "i8") {
            b.endsWith("*") && (b = "*");
            switch (b) {
              case "i1":
                return m[a];
              case "i8":
                return m[a];
              case "i16":
                return Fa[a >> 1];
              case "i32":
                return E[a >> 2];
              case "i64":
                return H[a >> 3];
              case "float":
                return Ga[a >> 2];
              case "double":
                return Ha[a >> 3];
              case "*":
                return F[a >> 2];
              default:
                Ka(`invalid type for getValue: ${b}`);
            }
          }
          var Va = true;
          function qa(a) {
            var b = "i32";
            b.endsWith("*") && (b = "*");
            switch (b) {
              case "i1":
                m[a] = 0;
                break;
              case "i8":
                m[a] = 0;
                break;
              case "i16":
                Fa[a >> 1] = 0;
                break;
              case "i32":
                E[a >> 2] = 0;
                break;
              case "i64":
                H[a >> 3] = BigInt(0);
                break;
              case "float":
                Ga[a >> 2] = 0;
                break;
              case "double":
                Ha[a >> 3] = 0;
                break;
              case "*":
                F[a >> 2] = 0;
                break;
              default:
                Ka(`invalid type for setValue: ${b}`);
            }
          }
          var Wa = new TextDecoder(), Xa = (a, b, c, d) => {
            c = b + c;
            if (d) return c;
            for (; a[b] && !(b >= c); ) ++b;
            return b;
          }, z = (a, b, c) => a ? Wa.decode(C.subarray(a, Xa(C, a, b, c))) : "", Ya = (a, b) => {
            for (var c = 0, d = a.length - 1; 0 <= d; d--) {
              var e = a[d];
              "." === e ? a.splice(d, 1) : ".." === e ? (a.splice(d, 1), c++) : c && (a.splice(d, 1), c--);
            }
            if (b) for (; c; c--) a.unshift("..");
            return a;
          }, ha = (a) => {
            var b = "/" === a.charAt(0), c = "/" === a.slice(-1);
            (a = Ya(a.split("/").filter((d) => !!d), !b).join("/")) || b || (a = ".");
            a && c && (a += "/");
            return (b ? "/" : "") + a;
          }, Za = (a) => {
            var b = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);
            a = b[0];
            b = b[1];
            if (!a && !b) return ".";
            b &&= b.slice(0, -1);
            return a + b;
          }, $a = (a) => a && a.match(/([^\/]+|\/)\/*$/)[1], ab2 = () => (a) => crypto.getRandomValues(a), bb = (a) => {
            (bb = ab2())(a);
          }, cb = (...a) => {
            for (var b = "", c = false, d = a.length - 1; -1 <= d && !c; d--) {
              c = 0 <= d ? a[d] : "/";
              if ("string" != typeof c) throw new TypeError("Arguments to path.resolve must be strings");
              if (!c) return "";
              b = c + "/" + b;
              c = "/" === c.charAt(0);
            }
            b = Ya(b.split("/").filter((e) => !!e), !c).join("/");
            return (c ? "/" : "") + b || ".";
          }, db = (a) => {
            var b = Xa(a, 0);
            return Wa.decode(a.buffer ? a.subarray(0, b) : new Uint8Array(a.slice(0, b)));
          }, fb = [], gb = (a) => {
            for (var b = 0, c = 0; c < a.length; ++c) {
              var d = a.charCodeAt(c);
              127 >= d ? b++ : 2047 >= d ? b += 2 : 55296 <= d && 57343 >= d ? (b += 4, ++c) : b += 3;
            }
            return b;
          }, M = (a, b, c, d) => {
            if (!(0 < d)) return 0;
            var e = c;
            d = c + d - 1;
            for (var g = 0; g < a.length; ++g) {
              var h = a.codePointAt(g);
              if (127 >= h) {
                if (c >= d) break;
                b[c++] = h;
              } else if (2047 >= h) {
                if (c + 1 >= d) break;
                b[c++] = 192 | h >> 6;
                b[c++] = 128 | h & 63;
              } else if (65535 >= h) {
                if (c + 2 >= d) break;
                b[c++] = 224 | h >> 12;
                b[c++] = 128 | h >> 6 & 63;
                b[c++] = 128 | h & 63;
              } else {
                if (c + 3 >= d) break;
                b[c++] = 240 | h >> 18;
                b[c++] = 128 | h >> 12 & 63;
                b[c++] = 128 | h >> 6 & 63;
                b[c++] = 128 | h & 63;
                g++;
              }
            }
            b[c] = 0;
            return c - e;
          }, pb = [];
          function qb(a, b) {
            pb[a] = { input: [], output: [], kb: b };
            rb2(a, sb);
          }
          var sb = { open(a) {
            var b = pb[a.node.nb];
            if (!b) throw new N(43);
            a.Va = b;
            a.seekable = false;
          }, close(a) {
            a.Va.kb.lb(a.Va);
          }, lb(a) {
            a.Va.kb.lb(a.Va);
          }, read(a, b, c, d) {
            if (!a.Va || !a.Va.kb.Qb) throw new N(60);
            for (var e = 0, g = 0; g < d; g++) {
              try {
                var h = a.Va.kb.Qb(a.Va);
              } catch (q) {
                throw new N(29);
              }
              if (void 0 === h && 0 === e) throw new N(6);
              if (null === h || void 0 === h) break;
              e++;
              b[c + g] = h;
            }
            e && (a.node.$a = Date.now());
            return e;
          }, write(a, b, c, d) {
            if (!a.Va || !a.Va.kb.Hb) throw new N(60);
            try {
              for (var e = 0; e < d; e++) a.Va.kb.Hb(a.Va, b[c + e]);
            } catch (g) {
              throw new N(29);
            }
            d && (a.node.Ua = a.node.Ta = Date.now());
            return e;
          } }, tb = { Qb() {
            a: {
              if (!fb.length) {
                var a = null;
                globalThis.window?.prompt && (a = window.prompt("Input: "), null !== a && (a += "\n"));
                if (!a) {
                  var b = null;
                  break a;
                }
                b = Array(gb(a) + 1);
                a = M(a, b, 0, b.length);
                b.length = a;
                fb = b;
              }
              b = fb.shift();
            }
            return b;
          }, Hb(a, b) {
            null === b || 10 === b ? (Ba(db(a.output)), a.output = []) : 0 != b && a.output.push(b);
          }, lb(a) {
            0 < a.output?.length && (Ba(db(a.output)), a.output = []);
          }, Dc() {
            return { yc: 25856, Ac: 5, xc: 191, zc: 35387, wc: [
              3,
              28,
              127,
              21,
              4,
              0,
              1,
              0,
              17,
              19,
              26,
              0,
              18,
              15,
              23,
              22,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ] };
          }, Ec() {
            return 0;
          }, Fc() {
            return [24, 80];
          } }, ub = { Hb(a, b) {
            null === b || 10 === b ? (B(db(a.output)), a.output = []) : 0 != b && a.output.push(b);
          }, lb(a) {
            0 < a.output?.length && (B(db(a.output)), a.output = []);
          } }, O = { Za: null, ab() {
            return O.createNode(null, "/", 16895, 0);
          }, createNode(a, b, c, d) {
            if (24576 === (c & 61440) || 4096 === (c & 61440)) throw new N(63);
            O.Za || (O.Za = { dir: { node: { Wa: O.La.Wa, Xa: O.La.Xa, mb: O.La.mb, rb: O.La.rb, Tb: O.La.Tb, xb: O.La.xb, vb: O.La.vb, Ib: O.La.Ib, wb: O.La.wb }, stream: { Ya: O.Ma.Ya } }, file: {
              node: { Wa: O.La.Wa, Xa: O.La.Xa },
              stream: { Ya: O.Ma.Ya, read: O.Ma.read, write: O.Ma.write, sb: O.Ma.sb, tb: O.Ma.tb }
            }, link: { node: { Wa: O.La.Wa, Xa: O.La.Xa, eb: O.La.eb }, stream: {} }, Nb: { node: { Wa: O.La.Wa, Xa: O.La.Xa }, stream: vb } });
            c = wb(a, b, c, d);
            P(c.mode) ? (c.La = O.Za.dir.node, c.Ma = O.Za.dir.stream, c.Na = {}) : 32768 === (c.mode & 61440) ? (c.La = O.Za.file.node, c.Ma = O.Za.file.stream, c.Ra = 0, c.Na = null) : 40960 === (c.mode & 61440) ? (c.La = O.Za.link.node, c.Ma = O.Za.link.stream) : 8192 === (c.mode & 61440) && (c.La = O.Za.Nb.node, c.Ma = O.Za.Nb.stream);
            c.$a = c.Ua = c.Ta = Date.now();
            a && (a.Na[b] = c, a.$a = a.Ua = a.Ta = c.$a);
            return c;
          }, Cc(a) {
            return a.Na ? a.Na.subarray ? a.Na.subarray(0, a.Ra) : new Uint8Array(a.Na) : new Uint8Array(0);
          }, La: { Wa(a) {
            var b = {};
            b.cc = 8192 === (a.mode & 61440) ? a.id : 1;
            b.oc = a.id;
            b.mode = a.mode;
            b.rc = 1;
            b.uid = 0;
            b.nc = 0;
            b.nb = a.nb;
            P(a.mode) ? b.size = 4096 : 32768 === (a.mode & 61440) ? b.size = a.Ra : 40960 === (a.mode & 61440) ? b.size = a.link.length : b.size = 0;
            b.$a = new Date(a.$a);
            b.Ua = new Date(a.Ua);
            b.Ta = new Date(a.Ta);
            b.Zb = 4096;
            b.$b = Math.ceil(b.size / b.Zb);
            return b;
          }, Xa(a, b) {
            for (var c of ["mode", "atime", "mtime", "ctime"]) null != b[c] && (a[c] = b[c]);
            void 0 !== b.size && (b = b.size, a.Ra != b && (0 == b ? (a.Na = null, a.Ra = 0) : (c = a.Na, a.Na = new Uint8Array(b), c && a.Na.set(c.subarray(0, Math.min(b, a.Ra))), a.Ra = b)));
          }, mb() {
            O.zb || (O.zb = new N(44), O.zb.stack = "<generic error, no stack>");
            throw O.zb;
          }, rb(a, b, c, d) {
            return O.createNode(a, b, c, d);
          }, Tb(a, b, c) {
            try {
              var d = Q(b, c);
            } catch (g) {
            }
            if (d) {
              if (P(a.mode)) for (var e in d.Na) throw new N(55);
              xb(d);
            }
            delete a.parent.Na[a.name];
            b.Na[c] = a;
            a.name = c;
            b.Ta = b.Ua = a.parent.Ta = a.parent.Ua = Date.now();
          }, xb(a, b) {
            delete a.Na[b];
            a.Ta = a.Ua = Date.now();
          }, vb(a, b) {
            var c = Q(a, b), d;
            for (d in c.Na) throw new N(55);
            delete a.Na[b];
            a.Ta = a.Ua = Date.now();
          }, Ib(a) {
            return [".", "..", ...Object.keys(a.Na)];
          }, wb(a, b, c) {
            a = O.createNode(a, b, 41471, 0);
            a.link = c;
            return a;
          }, eb(a) {
            if (40960 !== (a.mode & 61440)) throw new N(28);
            return a.link;
          } }, Ma: { read(a, b, c, d, e) {
            var g = a.node.Na;
            if (e >= a.node.Ra) return 0;
            a = Math.min(a.node.Ra - e, d);
            if (8 < a && g.subarray) b.set(g.subarray(e, e + a), c);
            else for (d = 0; d < a; d++) b[c + d] = g[e + d];
            return a;
          }, write(a, b, c, d, e, g) {
            b.buffer === m.buffer && (g = false);
            if (!d) return 0;
            a = a.node;
            a.Ua = a.Ta = Date.now();
            if (b.subarray && (!a.Na || a.Na.subarray)) {
              if (g) return a.Na = b.subarray(c, c + d), a.Ra = d;
              if (0 === a.Ra && 0 === e) return a.Na = b.slice(c, c + d), a.Ra = d;
              if (e + d <= a.Ra) return a.Na.set(b.subarray(c, c + d), e), d;
            }
            g = e + d;
            var h = a.Na ? a.Na.length : 0;
            h >= g || (g = Math.max(g, h * (1048576 > h ? 2 : 1.125) >>> 0), 0 != h && (g = Math.max(g, 256)), h = a.Na, a.Na = new Uint8Array(g), 0 < a.Ra && a.Na.set(h.subarray(0, a.Ra), 0));
            if (a.Na.subarray && b.subarray) a.Na.set(b.subarray(c, c + d), e);
            else for (g = 0; g < d; g++) a.Na[e + g] = b[c + g];
            a.Ra = Math.max(
              a.Ra,
              e + d
            );
            return d;
          }, Ya(a, b, c) {
            1 === c ? b += a.position : 2 === c && 32768 === (a.node.mode & 61440) && (b += a.node.Ra);
            if (0 > b) throw new N(28);
            return b;
          }, sb(a, b, c, d, e) {
            if (32768 !== (a.node.mode & 61440)) throw new N(43);
            a = a.node.Na;
            if (e & 2 || !a || a.buffer !== m.buffer) {
              e = true;
              d = 65536 * Math.ceil(b / 65536);
              var g = yb(65536, d);
              g && C.fill(0, g, g + d);
              d = g;
              if (!d) throw new N(48);
              if (a) {
                if (0 < c || c + b < a.length) a.subarray ? a = a.subarray(c, c + b) : a = Array.prototype.slice.call(a, c, c + b);
                m.set(a, d);
              }
            } else e = false, d = a.byteOffset;
            return { tc: d, Ub: e };
          }, tb(a, b, c, d) {
            O.Ma.write(
              a,
              b,
              0,
              d,
              c,
              false
            );
            return 0;
          } } }, ia = (a, b) => {
            var c = 0;
            a && (c |= 365);
            b && (c |= 146);
            return c;
          }, zb = null, Ab = {}, Bb = [], Cb = 1, R = null, Db = false, Eb = true, Fb = {}, N = class {
            name = "ErrnoError";
            constructor(a) {
              this.Pa = a;
            }
          }, Gb = class {
            qb = {};
            node = null;
            get flags() {
              return this.qb.flags;
            }
            set flags(a) {
              this.qb.flags = a;
            }
            get position() {
              return this.qb.position;
            }
            set position(a) {
              this.qb.position = a;
            }
          }, Hb = class {
            La = {};
            Ma = {};
            ib = null;
            constructor(a, b, c, d) {
              a ||= this;
              this.parent = a;
              this.ab = a.ab;
              this.id = Cb++;
              this.name = b;
              this.mode = c;
              this.nb = d;
              this.$a = this.Ua = this.Ta = Date.now();
            }
            get read() {
              return 365 === (this.mode & 365);
            }
            set read(a) {
              a ? this.mode |= 365 : this.mode &= -366;
            }
            get write() {
              return 146 === (this.mode & 146);
            }
            set write(a) {
              a ? this.mode |= 146 : this.mode &= -147;
            }
          };
          function S(a, b = {}) {
            if (!a) throw new N(44);
            b.Bb ?? (b.Bb = true);
            "/" === a.charAt(0) || (a = "//" + a);
            var c = 0;
            a: for (; 40 > c; c++) {
              a = a.split("/").filter((q) => !!q);
              for (var d = zb, e = "/", g = 0; g < a.length; g++) {
                var h = g === a.length - 1;
                if (h && b.parent) break;
                if ("." !== a[g]) if (".." === a[g]) if (e = Za(e), d === d.parent) {
                  a = e + "/" + a.slice(g + 1).join("/");
                  c--;
                  continue a;
                } else d = d.parent;
                else {
                  e = ha(e + "/" + a[g]);
                  try {
                    d = Q(d, a[g]);
                  } catch (q) {
                    if (44 === q?.Pa && h && b.sc) return { path: e };
                    throw q;
                  }
                  !d.ib || h && !b.Bb || (d = d.ib.root);
                  if (40960 === (d.mode & 61440) && (!h || b.hb)) {
                    if (!d.La.eb) throw new N(52);
                    d = d.La.eb(d);
                    "/" === d.charAt(0) || (d = Za(e) + "/" + d);
                    a = d + "/" + a.slice(g + 1).join("/");
                    continue a;
                  }
                }
              }
              return { path: e, node: d };
            }
            throw new N(32);
          }
          function fa(a) {
            for (var b; ; ) {
              if (a === a.parent) return a = a.ab.Sb, b ? "/" !== a[a.length - 1] ? `${a}/${b}` : a + b : a;
              b = b ? `${a.name}/${b}` : a.name;
              a = a.parent;
            }
          }
          function Ib(a, b) {
            for (var c = 0, d = 0; d < b.length; d++) c = (c << 5) - c + b.charCodeAt(d) | 0;
            return (a + c >>> 0) % R.length;
          }
          function xb(a) {
            var b = Ib(a.parent.id, a.name);
            if (R[b] === a) R[b] = a.jb;
            else for (b = R[b]; b; ) {
              if (b.jb === a) {
                b.jb = a.jb;
                break;
              }
              b = b.jb;
            }
          }
          function Q(a, b) {
            var c = P(a.mode) ? (c = Jb(a, "x")) ? c : a.La.mb ? 0 : 2 : 54;
            if (c) throw new N(c);
            for (c = R[Ib(a.id, b)]; c; c = c.jb) {
              var d = c.name;
              if (c.parent.id === a.id && d === b) return c;
            }
            return a.La.mb(a, b);
          }
          function wb(a, b, c, d) {
            a = new Hb(a, b, c, d);
            b = Ib(a.parent.id, a.name);
            a.jb = R[b];
            return R[b] = a;
          }
          function P(a) {
            return 16384 === (a & 61440);
          }
          function Kb(a) {
            var b = ["r", "w", "rw"][a & 3];
            a & 512 && (b += "w");
            return b;
          }
          function Jb(a, b) {
            if (Eb) return 0;
            if (!b.includes("r") || a.mode & 292) {
              if (b.includes("w") && !(a.mode & 146) || b.includes("x") && !(a.mode & 73)) return 2;
            } else return 2;
            return 0;
          }
          function Lb(a, b) {
            if (!P(a.mode)) return 54;
            try {
              return Q(a, b), 20;
            } catch (c) {
            }
            return Jb(a, "wx");
          }
          function Mb(a, b, c) {
            try {
              var d = Q(a, b);
            } catch (e) {
              return e.Pa;
            }
            if (a = Jb(a, "wx")) return a;
            if (c) {
              if (!P(d.mode)) return 54;
              if (d === d.parent || "/" === fa(d)) return 10;
            } else if (P(d.mode)) return 31;
            return 0;
          }
          function Nb(a) {
            if (!a) throw new N(63);
            return a;
          }
          function T(a) {
            a = Bb[a];
            if (!a) throw new N(8);
            return a;
          }
          function Ob(a, b = -1) {
            a = Object.assign(new Gb(), a);
            if (-1 == b) a: {
              for (b = 0; 4096 >= b; b++) if (!Bb[b]) break a;
              throw new N(33);
            }
            a.bb = b;
            return Bb[b] = a;
          }
          function Pb(a, b = -1) {
            a = Ob(a, b);
            a.Ma?.Bc?.(a);
            return a;
          }
          function Qb(a, b, c) {
            var d = a?.Ma.Xa;
            a = d ? a : b;
            d ??= b.La.Xa;
            Nb(d);
            d(a, c);
          }
          var vb = { open(a) {
            a.Ma = Ab[a.node.nb].Ma;
            a.Ma.open?.(a);
          }, Ya() {
            throw new N(70);
          } };
          function rb2(a, b) {
            Ab[a] = { Ma: b };
          }
          function Rb(a, b) {
            var c = "/" === b;
            if (c && zb) throw new N(10);
            if (!c && b) {
              var d = S(b, { Bb: false });
              b = d.path;
              d = d.node;
              if (d.ib) throw new N(10);
              if (!P(d.mode)) throw new N(54);
            }
            b = { type: a, Gc: {}, Sb: b, qc: [] };
            a = a.ab(b);
            a.ab = b;
            b.root = a;
            c ? zb = a : d && (d.ib = b, d.ab && d.ab.qc.push(b));
          }
          function Sb(a, b, c) {
            var d = S(a, { parent: true }).node;
            a = $a(a);
            if (!a) throw new N(28);
            if ("." === a || ".." === a) throw new N(20);
            var e = Lb(d, a);
            if (e) throw new N(e);
            if (!d.La.rb) throw new N(63);
            return d.La.rb(d, a, b, c);
          }
          function ja(a, b = 438) {
            return Sb(a, b & 4095 | 32768, 0);
          }
          function U(a, b = 511) {
            return Sb(a, b & 1023 | 16384, 0);
          }
          function Tb(a, b, c) {
            "undefined" == typeof c && (c = b, b = 438);
            Sb(a, b | 8192, c);
          }
          function Ub(a, b) {
            if (!cb(a)) throw new N(44);
            var c = S(b, { parent: true }).node;
            if (!c) throw new N(44);
            b = $a(b);
            var d = Lb(c, b);
            if (d) throw new N(d);
            if (!c.La.wb) throw new N(63);
            c.La.wb(c, b, a);
          }
          function Vb(a) {
            var b = S(a, { parent: true }).node;
            a = $a(a);
            var c = Q(b, a), d = Mb(b, a, true);
            if (d) throw new N(d);
            if (!b.La.vb) throw new N(63);
            if (c.ib) throw new N(10);
            b.La.vb(b, a);
            xb(c);
          }
          function ta(a) {
            var b = S(a, { parent: true }).node;
            if (!b) throw new N(44);
            a = $a(a);
            var c = Q(b, a), d = Mb(b, a, false);
            if (d) throw new N(d);
            if (!b.La.xb) throw new N(63);
            if (c.ib) throw new N(10);
            b.La.xb(b, a);
            xb(c);
          }
          function Wb(a, b) {
            a = S(a, { hb: !b }).node;
            return Nb(a.La.Wa)(a);
          }
          function Xb(a, b, c, d) {
            Qb(a, b, { mode: c & 4095 | b.mode & -4096, Ta: Date.now(), dc: d });
          }
          function ka(a, b) {
            a = "string" == typeof a ? S(a, { hb: true }).node : a;
            Xb(null, a, b);
          }
          function Yb(a, b, c) {
            if (P(b.mode)) throw new N(31);
            if (32768 !== (b.mode & 61440)) throw new N(28);
            var d = Jb(b, "w");
            if (d) throw new N(d);
            Qb(a, b, { size: c, timestamp: Date.now() });
          }
          function ma(a, b, c = 438) {
            if ("" === a) throw new N(44);
            if ("string" == typeof b) {
              var d = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }[b];
              if ("undefined" == typeof d) throw Error(`Unknown file open mode: ${b}`);
              b = d;
            }
            c = b & 64 ? c & 4095 | 32768 : 0;
            if ("object" == typeof a) d = a;
            else {
              var e = a.endsWith("/");
              a = S(a, { hb: !(b & 131072), sc: true });
              d = a.node;
              a = a.path;
            }
            var g = false;
            if (b & 64) if (d) {
              if (b & 128) throw new N(20);
            } else {
              if (e) throw new N(31);
              d = Sb(a, c | 511, 0);
              g = true;
            }
            if (!d) throw new N(44);
            8192 === (d.mode & 61440) && (b &= -513);
            if (b & 65536 && !P(d.mode)) throw new N(54);
            if (!g && (e = d ? 40960 === (d.mode & 61440) ? 32 : P(d.mode) && ("r" !== Kb(b) || b & 576) ? 31 : Jb(d, Kb(b)) : 44)) throw new N(e);
            b & 512 && !g && (e = d, e = "string" == typeof e ? S(e, { hb: true }).node : e, Yb(null, e, 0));
            b &= -131713;
            e = Ob({ node: d, path: fa(d), flags: b, seekable: true, position: 0, Ma: d.Ma, uc: [], error: false });
            e.Ma.open && e.Ma.open(e);
            g && ka(d, c & 511);
            !k.logReadFiles || b & 1 || a in Fb || (Fb[a] = 1);
            return e;
          }
          function oa(a) {
            if (null === a.bb) throw new N(8);
            a.Eb && (a.Eb = null);
            try {
              a.Ma.close && a.Ma.close(a);
            } catch (b) {
              throw b;
            } finally {
              Bb[a.bb] = null;
            }
            a.bb = null;
          }
          function Zb(a, b, c) {
            if (null === a.bb) throw new N(8);
            if (!a.seekable || !a.Ma.Ya) throw new N(70);
            if (0 != c && 1 != c && 2 != c) throw new N(28);
            a.position = a.Ma.Ya(a, b, c);
            a.uc = [];
          }
          function $b(a, b, c, d, e) {
            if (0 > d || 0 > e) throw new N(28);
            if (null === a.bb) throw new N(8);
            if (1 === (a.flags & 2097155)) throw new N(8);
            if (P(a.node.mode)) throw new N(31);
            if (!a.Ma.read) throw new N(28);
            var g = "undefined" != typeof e;
            if (!g) e = a.position;
            else if (!a.seekable) throw new N(70);
            b = a.Ma.read(a, b, c, d, e);
            g || (a.position += b);
            return b;
          }
          function na(a, b, c, d, e) {
            if (0 > d || 0 > e) throw new N(28);
            if (null === a.bb) throw new N(8);
            if (0 === (a.flags & 2097155)) throw new N(8);
            if (P(a.node.mode)) throw new N(31);
            if (!a.Ma.write) throw new N(28);
            a.seekable && a.flags & 1024 && Zb(a, 0, 2);
            var g = "undefined" != typeof e;
            if (!g) e = a.position;
            else if (!a.seekable) throw new N(70);
            b = a.Ma.write(a, b, c, d, e, void 0);
            g || (a.position += b);
            return b;
          }
          function sa(a) {
            var b = b || 0;
            var c = "binary";
            "utf8" !== c && "binary" !== c && Ka(`Invalid encoding type "${c}"`);
            b = ma(a, b);
            a = Wb(a).size;
            var d = new Uint8Array(a);
            $b(b, d, 0, a, 0);
            "utf8" === c && (d = db(d));
            oa(b);
            return d;
          }
          function W(a, b, c) {
            a = ha("/dev/" + a);
            var d = ia(!!b, !!c);
            W.Rb ?? (W.Rb = 64);
            var e = W.Rb++ << 8 | 0;
            rb2(e, { open(g) {
              g.seekable = false;
            }, close() {
              c?.buffer?.length && c(10);
            }, read(g, h, q, w) {
              for (var u = 0, x2 = 0; x2 < w; x2++) {
                try {
                  var D = b();
                } catch (ib) {
                  throw new N(29);
                }
                if (void 0 === D && 0 === u) throw new N(6);
                if (null === D || void 0 === D) break;
                u++;
                h[q + x2] = D;
              }
              u && (g.node.$a = Date.now());
              return u;
            }, write(g, h, q, w) {
              for (var u = 0; u < w; u++) try {
                c(h[q + u]);
              } catch (x2) {
                throw new N(29);
              }
              w && (g.node.Ua = g.node.Ta = Date.now());
              return u;
            } });
            Tb(a, d, e);
          }
          var X = {};
          function Y(a, b, c) {
            if ("/" === b.charAt(0)) return b;
            a = -100 === a ? "/" : T(a).path;
            if (0 == b.length) {
              if (!c) throw new N(44);
              return a;
            }
            return a + "/" + b;
          }
          function ac(a, b) {
            F[a >> 2] = b.cc;
            F[a + 4 >> 2] = b.mode;
            F[a + 8 >> 2] = b.rc;
            F[a + 12 >> 2] = b.uid;
            F[a + 16 >> 2] = b.nc;
            F[a + 20 >> 2] = b.nb;
            H[a + 24 >> 3] = BigInt(b.size);
            E[a + 32 >> 2] = 4096;
            E[a + 36 >> 2] = b.$b;
            var c = b.$a.getTime(), d = b.Ua.getTime(), e = b.Ta.getTime();
            H[a + 40 >> 3] = BigInt(Math.floor(c / 1e3));
            F[a + 48 >> 2] = c % 1e3 * 1e6;
            H[a + 56 >> 3] = BigInt(Math.floor(d / 1e3));
            F[a + 64 >> 2] = d % 1e3 * 1e6;
            H[a + 72 >> 3] = BigInt(Math.floor(e / 1e3));
            F[a + 80 >> 2] = e % 1e3 * 1e6;
            H[a + 88 >> 3] = BigInt(b.oc);
            return 0;
          }
          var kc = void 0, Cc = () => {
            var a = E[+kc >> 2];
            kc += 4;
            return a;
          }, Ec = 0, Fc = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], Gc = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], Hc = {}, Ic = (a) => {
            if (!(a instanceof Pa || "unwind" == a)) throw a;
          }, Jc = (a) => {
            Ea = a;
            Va || 0 < Ec || (k.onExit?.(a), Da = true);
            throw new Pa(a);
          }, Kc = (a) => {
            if (!Da) try {
              a();
            } catch (b) {
              Ic(b);
            } finally {
              if (!(Va || 0 < Ec)) try {
                Ea = a = Ea, Jc(a);
              } catch (b) {
                Ic(b);
              }
            }
          }, Lc = {}, Nc = () => {
            if (!Mc) {
              var a = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: (globalThis.navigator?.language ?? "C").replace("-", "_") + ".UTF-8", _: wa || "./this.program" }, b;
              for (b in Lc) void 0 === Lc[b] ? delete a[b] : a[b] = Lc[b];
              var c = [];
              for (b in a) c.push(`${b}=${a[b]}`);
              Mc = c;
            }
            return Mc;
          }, Mc, Oc = (a, b, c, d) => {
            var e = { string: (u) => {
              var x2 = 0;
              if (null !== u && void 0 !== u && 0 !== u) {
                x2 = gb(u) + 1;
                var D = y(x2);
                M(u, C, D, x2);
                x2 = D;
              }
              return x2;
            }, array: (u) => {
              var x2 = y(u.length);
              m.set(u, x2);
              return x2;
            } };
            a = k["_" + a];
            var g = [], h = 0;
            if (d) for (var q = 0; q < d.length; q++) {
              var w = e[c[q]];
              w ? (0 === h && (h = pa()), g[q] = w(d[q])) : g[q] = d[q];
            }
            c = a(...g);
            return c = (function(u) {
              0 !== h && ra(h);
              return "string" === b ? z(u) : "boolean" === b ? !!u : u;
            })(c);
          }, ea = (a) => {
            var b = gb(a) + 1, c = ca(b);
            c && M(a, C, c, b);
            return c;
          }, Pc, Qc = [], A = (a) => {
            Pc.delete(Z.get(a));
            Z.set(a, null);
            Qc.push(a);
          }, Rc = (a) => {
            const b = a.length;
            return [b % 128 | 128, b >> 7, ...a];
          }, Sc = { i: 127, p: 127, j: 126, f: 125, d: 124, e: 111 }, Tc = (a) => Rc(Array.from(a, (b) => Sc[b])), va = (a, b) => {
            if (!Pc) {
              Pc = /* @__PURE__ */ new WeakMap();
              var c = Z.length;
              if (Pc) for (var d = 0; d < 0 + c; d++) {
                var e = Z.get(d);
                e && Pc.set(e, d);
              }
            }
            if (c = Pc.get(a) || 0) return c;
            c = Qc.length ? Qc.pop() : Z.grow(1);
            try {
              Z.set(c, a);
            } catch (g) {
              if (!(g instanceof TypeError)) throw g;
              b = Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0, 1, ...Rc([1, 96, ...Tc(b.slice(1)), ...Tc("v" === b[0] ? "" : b[0])]), 2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0);
              b = new WebAssembly.Module(b);
              b = new WebAssembly.Instance(b, { e: { f: a } }).exports.f;
              Z.set(c, b);
            }
            Pc.set(a, c);
            return c;
          };
          R = Array(4096);
          Rb(O, "/");
          U("/tmp");
          U("/home");
          U("/home/web_user");
          (function() {
            U("/dev");
            rb2(259, { read: () => 0, write: (d, e, g, h) => h, Ya: () => 0 });
            Tb("/dev/null", 259);
            qb(1280, tb);
            qb(1536, ub);
            Tb("/dev/tty", 1280);
            Tb("/dev/tty1", 1536);
            var a = new Uint8Array(1024), b = 0, c = () => {
              0 === b && (bb(a), b = a.byteLength);
              return a[--b];
            };
            W("random", c);
            W("urandom", c);
            U("/dev/shm");
            U("/dev/shm/tmp");
          })();
          (function() {
            U("/proc");
            var a = U("/proc/self");
            U("/proc/self/fd");
            Rb({ ab() {
              var b = wb(a, "fd", 16895, 73);
              b.Ma = { Ya: O.Ma.Ya };
              b.La = { mb(c, d) {
                c = +d;
                var e = T(c);
                c = { parent: null, ab: { Sb: "fake" }, La: { eb: () => e.path }, id: c + 1 };
                return c.parent = c;
              }, Ib() {
                return Array.from(Bb.entries()).filter(([, c]) => c).map(([c]) => c.toString());
              } };
              return b;
            } }, "/proc/self/fd");
          })();
          k.noExitRuntime && (Va = k.noExitRuntime);
          k.print && (Ba = k.print);
          k.printErr && (B = k.printErr);
          k.wasmBinary && (Ca = k.wasmBinary);
          k.thisProgram && (wa = k.thisProgram);
          if (k.preInit) for ("function" == typeof k.preInit && (k.preInit = [k.preInit]); 0 < k.preInit.length; ) k.preInit.shift()();
          k.stackSave = () => pa();
          k.stackRestore = (a) => ra(a);
          k.stackAlloc = (a) => y(a);
          k.cwrap = (a, b, c, d) => {
            var e = !c || c.every((g) => "number" === g || "boolean" === g);
            return "string" !== b && e && !d ? k["_" + a] : (...g) => Oc(a, b, c, g);
          };
          k.addFunction = va;
          k.removeFunction = A;
          k.UTF8ToString = z;
          k.stringToNewUTF8 = ea;
          k.writeArrayToMemory = (a, b) => {
            m.set(a, b);
          };
          var ca, da, yb, Uc, ra, y, pa, Ja, Z, Vc = {
            a: (a, b, c, d) => Ka(`Assertion failed: ${z(a)}, at: ` + [b ? z(b) : "unknown filename", c, d ? z(d) : "unknown function"]),
            i: function(a, b) {
              try {
                return a = z(a), ka(a, b), 0;
              } catch (c) {
                if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
                return -c.Pa;
              }
            },
            L: function(a, b, c) {
              try {
                b = z(b);
                b = Y(a, b);
                if (c & -8) return -28;
                var d = S(b, { hb: true }).node;
                if (!d) return -44;
                a = "";
                c & 4 && (a += "r");
                c & 2 && (a += "w");
                c & 1 && (a += "x");
                return a && Jb(d, a) ? -2 : 0;
              } catch (e) {
                if ("undefined" == typeof X || "ErrnoError" !== e.name) throw e;
                return -e.Pa;
              }
            },
            j: function(a, b) {
              try {
                var c = T(a);
                Xb(c, c.node, b, false);
                return 0;
              } catch (d) {
                if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
                return -d.Pa;
              }
            },
            h: function(a) {
              try {
                var b = T(a);
                Qb(b, b.node, { timestamp: Date.now(), dc: false });
                return 0;
              } catch (c) {
                if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
                return -c.Pa;
              }
            },
            b: function(a, b, c) {
              kc = c;
              try {
                var d = T(a);
                switch (b) {
                  case 0:
                    var e = Cc();
                    if (0 > e) break;
                    for (; Bb[e]; ) e++;
                    return Pb(d, e).bb;
                  case 1:
                  case 2:
                    return 0;
                  case 3:
                    return d.flags;
                  case 4:
                    return e = Cc(), d.flags |= e, 0;
                  case 12:
                    return e = Cc(), Fa[e + 0 >> 1] = 2, 0;
                  case 13:
                  case 14:
                    return 0;
                }
                return -28;
              } catch (g) {
                if ("undefined" == typeof X || "ErrnoError" !== g.name) throw g;
                return -g.Pa;
              }
            },
            g: function(a, b) {
              try {
                var c = T(a), d = c.node, e = c.Ma.Wa;
                a = e ? c : d;
                e ??= d.La.Wa;
                Nb(e);
                var g = e(a);
                return ac(b, g);
              } catch (h) {
                if ("undefined" == typeof X || "ErrnoError" !== h.name) throw h;
                return -h.Pa;
              }
            },
            H: function(a, b) {
              b = -9007199254740992 > b || 9007199254740992 < b ? NaN : Number(b);
              try {
                if (isNaN(b)) return -61;
                var c = T(a);
                if (0 > b || 0 === (c.flags & 2097155)) throw new N(28);
                Yb(c, c.node, b);
                return 0;
              } catch (d) {
                if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
                return -d.Pa;
              }
            },
            G: function(a, b) {
              try {
                if (0 === b) return -28;
                var c = gb("/") + 1;
                if (b < c) return -68;
                M("/", C, a, b);
                return c;
              } catch (d) {
                if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
                return -d.Pa;
              }
            },
            K: function(a, b) {
              try {
                return a = z(a), ac(b, Wb(a, true));
              } catch (c) {
                if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
                return -c.Pa;
              }
            },
            C: function(a, b, c) {
              try {
                return b = z(b), b = Y(a, b), U(b, c), 0;
              } catch (d) {
                if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
                return -d.Pa;
              }
            },
            J: function(a, b, c, d) {
              try {
                b = z(b);
                var e = d & 256;
                b = Y(a, b, d & 4096);
                return ac(c, e ? Wb(b, true) : Wb(b));
              } catch (g) {
                if ("undefined" == typeof X || "ErrnoError" !== g.name) throw g;
                return -g.Pa;
              }
            },
            x: function(a, b, c, d) {
              kc = d;
              try {
                b = z(b);
                b = Y(a, b);
                var e = d ? Cc() : 0;
                return ma(b, c, e).bb;
              } catch (g) {
                if ("undefined" == typeof X || "ErrnoError" !== g.name) throw g;
                return -g.Pa;
              }
            },
            v: function(a, b, c, d) {
              try {
                b = z(b);
                b = Y(a, b);
                if (0 >= d) return -28;
                var e = S(b).node;
                if (!e) throw new N(44);
                if (!e.La.eb) throw new N(28);
                var g = e.La.eb(e);
                var h = Math.min(d, gb(g)), q = m[c + h];
                M(g, C, c, d + 1);
                m[c + h] = q;
                return h;
              } catch (w) {
                if ("undefined" == typeof X || "ErrnoError" !== w.name) throw w;
                return -w.Pa;
              }
            },
            u: function(a) {
              try {
                return a = z(a), Vb(a), 0;
              } catch (b) {
                if ("undefined" == typeof X || "ErrnoError" !== b.name) throw b;
                return -b.Pa;
              }
            },
            f: function(a, b) {
              try {
                return a = z(a), ac(b, Wb(a));
              } catch (c) {
                if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
                return -c.Pa;
              }
            },
            r: function(a, b, c) {
              try {
                b = z(b);
                b = Y(a, b);
                if (c) if (512 === c) Vb(b);
                else return -28;
                else ta(b);
                return 0;
              } catch (d) {
                if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
                return -d.Pa;
              }
            },
            q: function(a, b, c) {
              try {
                b = z(b);
                b = Y(a, b, true);
                var d = Date.now(), e, g;
                if (c) {
                  var h = F[c >> 2] + 4294967296 * E[c + 4 >> 2], q = E[c + 8 >> 2];
                  1073741823 == q ? e = d : 1073741822 == q ? e = null : e = 1e3 * h + q / 1e6;
                  c += 16;
                  h = F[c >> 2] + 4294967296 * E[c + 4 >> 2];
                  q = E[c + 8 >> 2];
                  1073741823 == q ? g = d : 1073741822 == q ? g = null : g = 1e3 * h + q / 1e6;
                } else g = e = d;
                if (null !== (g ?? e)) {
                  a = e;
                  var w = S(b, { hb: true }).node;
                  Nb(w.La.Xa)(w, { $a: a, Ua: g });
                }
                return 0;
              } catch (u) {
                if ("undefined" == typeof X || "ErrnoError" !== u.name) throw u;
                return -u.Pa;
              }
            },
            m: () => Ka(""),
            l: () => {
              Va = false;
              Ec = 0;
            },
            A: function(a, b) {
              a = -9007199254740992 > a || 9007199254740992 < a ? NaN : Number(a);
              a = new Date(1e3 * a);
              E[b >> 2] = a.getSeconds();
              E[b + 4 >> 2] = a.getMinutes();
              E[b + 8 >> 2] = a.getHours();
              E[b + 12 >> 2] = a.getDate();
              E[b + 16 >> 2] = a.getMonth();
              E[b + 20 >> 2] = a.getFullYear() - 1900;
              E[b + 24 >> 2] = a.getDay();
              var c = a.getFullYear();
              E[b + 28 >> 2] = (0 !== c % 4 || 0 === c % 100 && 0 !== c % 400 ? Gc : Fc)[a.getMonth()] + a.getDate() - 1 | 0;
              E[b + 36 >> 2] = -(60 * a.getTimezoneOffset());
              c = new Date(a.getFullYear(), 6, 1).getTimezoneOffset();
              var d = new Date(a.getFullYear(), 0, 1).getTimezoneOffset();
              E[b + 32 >> 2] = (c != d && a.getTimezoneOffset() == Math.min(d, c)) | 0;
            },
            y: function(a, b, c, d, e, g, h) {
              e = -9007199254740992 > e || 9007199254740992 < e ? NaN : Number(e);
              try {
                var q = T(d);
                if (0 !== (b & 2) && 0 === (c & 2) && 2 !== (q.flags & 2097155)) throw new N(2);
                if (1 === (q.flags & 2097155)) throw new N(2);
                if (!q.Ma.sb) throw new N(43);
                if (!a) throw new N(28);
                var w = q.Ma.sb(q, a, e, b, c);
                var u = w.tc;
                E[g >> 2] = w.Ub;
                F[h >> 2] = u;
                return 0;
              } catch (x2) {
                if ("undefined" == typeof X || "ErrnoError" !== x2.name) throw x2;
                return -x2.Pa;
              }
            },
            z: function(a, b, c, d, e, g) {
              g = -9007199254740992 > g || 9007199254740992 < g ? NaN : Number(g);
              try {
                var h = T(e);
                if (c & 2) {
                  if (32768 !== (h.node.mode & 61440)) throw new N(43);
                  d & 2 || h.Ma.tb && h.Ma.tb(h, C.slice(a, a + b), g, b, d);
                }
              } catch (q) {
                if ("undefined" == typeof X || "ErrnoError" !== q.name) throw q;
                return -q.Pa;
              }
            },
            n: (a, b) => {
              Hc[a] && (clearTimeout(Hc[a].id), delete Hc[a]);
              if (!b) return 0;
              var c = setTimeout(() => {
                delete Hc[a];
                Kc(() => Uc(a, performance.now()));
              }, b);
              Hc[a] = { id: c, Hc: b };
              return 0;
            },
            B: (a, b, c, d) => {
              var e = (/* @__PURE__ */ new Date()).getFullYear(), g = new Date(e, 0, 1).getTimezoneOffset();
              e = new Date(e, 6, 1).getTimezoneOffset();
              F[a >> 2] = 60 * Math.max(g, e);
              E[b >> 2] = Number(g != e);
              b = (h) => {
                var q = Math.abs(h);
                return `UTC${0 <= h ? "-" : "+"}${String(Math.floor(q / 60)).padStart(2, "0")}${String(q % 60).padStart(2, "0")}`;
              };
              a = b(g);
              b = b(e);
              e < g ? (M(a, C, c, 17), M(b, C, d, 17)) : (M(a, C, d, 17), M(b, C, c, 17));
            },
            d: () => Date.now(),
            s: () => 2147483648,
            c: () => performance.now(),
            o: (a) => {
              var b = C.length;
              a >>>= 0;
              if (2147483648 < a) return false;
              for (var c = 1; 4 >= c; c *= 2) {
                var d = b * (1 + 0.2 / c);
                d = Math.min(d, a + 100663296);
                a: {
                  d = (Math.min(2147483648, 65536 * Math.ceil(Math.max(a, d) / 65536)) - Ja.buffer.byteLength + 65535) / 65536 | 0;
                  try {
                    Ja.grow(d);
                    Ia();
                    var e = 1;
                    break a;
                  } catch (g) {
                  }
                  e = void 0;
                }
                if (e) return true;
              }
              return false;
            },
            E: (a, b) => {
              var c = 0, d = 0, e;
              for (e of Nc()) {
                var g = b + c;
                F[a + d >> 2] = g;
                c += M(e, C, g, Infinity) + 1;
                d += 4;
              }
              return 0;
            },
            F: (a, b) => {
              var c = Nc();
              F[a >> 2] = c.length;
              a = 0;
              for (var d of c) a += gb(d) + 1;
              F[b >> 2] = a;
              return 0;
            },
            e: function(a) {
              try {
                var b = T(a);
                oa(b);
                return 0;
              } catch (c) {
                if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
                return c.Pa;
              }
            },
            p: function(a, b) {
              try {
                var c = T(a);
                m[b] = c.Va ? 2 : P(c.mode) ? 3 : 40960 === (c.mode & 61440) ? 7 : 4;
                Fa[b + 2 >> 1] = 0;
                H[b + 8 >> 3] = BigInt(0);
                H[b + 16 >> 3] = BigInt(0);
                return 0;
              } catch (d) {
                if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
                return d.Pa;
              }
            },
            w: function(a, b, c, d) {
              try {
                a: {
                  var e = T(a);
                  a = b;
                  for (var g, h = b = 0; h < c; h++) {
                    var q = F[a >> 2], w = F[a + 4 >> 2];
                    a += 8;
                    var u = $b(e, m, q, w, g);
                    if (0 > u) {
                      var x2 = -1;
                      break a;
                    }
                    b += u;
                    if (u < w) break;
                    "undefined" != typeof g && (g += u);
                  }
                  x2 = b;
                }
                F[d >> 2] = x2;
                return 0;
              } catch (D) {
                if ("undefined" == typeof X || "ErrnoError" !== D.name) throw D;
                return D.Pa;
              }
            },
            D: function(a, b, c, d) {
              b = -9007199254740992 > b || 9007199254740992 < b ? NaN : Number(b);
              try {
                if (isNaN(b)) return 61;
                var e = T(a);
                Zb(e, b, c);
                H[d >> 3] = BigInt(e.position);
                e.Eb && 0 === b && 0 === c && (e.Eb = null);
                return 0;
              } catch (g) {
                if ("undefined" == typeof X || "ErrnoError" !== g.name) throw g;
                return g.Pa;
              }
            },
            I: function(a) {
              try {
                var b = T(a);
                return b.Ma?.lb?.(b);
              } catch (c) {
                if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
                return c.Pa;
              }
            },
            t: function(a, b, c, d) {
              try {
                a: {
                  var e = T(a);
                  a = b;
                  for (var g, h = b = 0; h < c; h++) {
                    var q = F[a >> 2], w = F[a + 4 >> 2];
                    a += 8;
                    var u = na(e, m, q, w, g);
                    if (0 > u) {
                      var x2 = -1;
                      break a;
                    }
                    b += u;
                    if (u < w) break;
                    "undefined" != typeof g && (g += u);
                  }
                  x2 = b;
                }
                F[d >> 2] = x2;
                return 0;
              } catch (D) {
                if ("undefined" == typeof X || "ErrnoError" !== D.name) throw D;
                return D.Pa;
              }
            },
            k: Jc
          };
          function Wc() {
            function a() {
              k.calledRun = true;
              if (!Da) {
                if (!k.noFSInit && !Db) {
                  var b, c;
                  Db = true;
                  b ??= k.stdin;
                  c ??= k.stdout;
                  d ??= k.stderr;
                  b ? W("stdin", b) : Ub("/dev/tty", "/dev/stdin");
                  c ? W("stdout", null, c) : Ub("/dev/tty", "/dev/stdout");
                  d ? W("stderr", null, d) : Ub("/dev/tty1", "/dev/stderr");
                  ma("/dev/stdin", 0);
                  ma("/dev/stdout", 1);
                  ma("/dev/stderr", 1);
                }
                Xc.N();
                Eb = false;
                k.onRuntimeInitialized?.();
                if (k.postRun) for ("function" == typeof k.postRun && (k.postRun = [k.postRun]); k.postRun.length; ) {
                  var d = k.postRun.shift();
                  Ra.push(d);
                }
                Qa(Ra);
              }
            }
            if (0 < K) Ua = Wc;
            else {
              if (k.preRun) for ("function" == typeof k.preRun && (k.preRun = [k.preRun]); k.preRun.length; ) Ta();
              Qa(Sa);
              0 < K ? Ua = Wc : k.setStatus ? (k.setStatus("Running..."), setTimeout(() => {
                setTimeout(() => k.setStatus(""), 1);
                a();
              }, 1)) : a();
            }
          }
          var Xc;
          (async function() {
            function a(c) {
              c = Xc = c.exports;
              k._sqlite3_free = c.P;
              k._sqlite3_value_text = c.Q;
              k._sqlite3_prepare_v2 = c.R;
              k._sqlite3_step = c.S;
              k._sqlite3_reset = c.T;
              k._sqlite3_exec = c.U;
              k._sqlite3_finalize = c.V;
              k._sqlite3_column_name = c.W;
              k._sqlite3_column_text = c.X;
              k._sqlite3_column_type = c.Y;
              k._sqlite3_errmsg = c.Z;
              k._sqlite3_clear_bindings = c._;
              k._sqlite3_value_blob = c.$;
              k._sqlite3_value_bytes = c.aa;
              k._sqlite3_value_double = c.ba;
              k._sqlite3_value_int = c.ca;
              k._sqlite3_value_type = c.da;
              k._sqlite3_result_blob = c.ea;
              k._sqlite3_result_double = c.fa;
              k._sqlite3_result_error = c.ga;
              k._sqlite3_result_int = c.ha;
              k._sqlite3_result_int64 = c.ia;
              k._sqlite3_result_null = c.ja;
              k._sqlite3_result_text = c.ka;
              k._sqlite3_aggregate_context = c.la;
              k._sqlite3_column_count = c.ma;
              k._sqlite3_data_count = c.na;
              k._sqlite3_column_blob = c.oa;
              k._sqlite3_column_bytes = c.pa;
              k._sqlite3_column_double = c.qa;
              k._sqlite3_bind_blob = c.ra;
              k._sqlite3_bind_double = c.sa;
              k._sqlite3_bind_int = c.ta;
              k._sqlite3_bind_text = c.ua;
              k._sqlite3_bind_parameter_index = c.va;
              k._sqlite3_sql = c.wa;
              k._sqlite3_normalized_sql = c.xa;
              k._sqlite3_changes = c.ya;
              k._sqlite3_close_v2 = c.za;
              k._sqlite3_create_function_v2 = c.Aa;
              k._sqlite3_update_hook = c.Ba;
              k._sqlite3_open = c.Ca;
              ca = k._malloc = c.Da;
              da = k._free = c.Ea;
              k._RegisterExtensionFunctions = c.Fa;
              yb = c.Ga;
              Uc = c.Ha;
              ra = c.Ia;
              y = c.Ja;
              pa = c.Ka;
              Ja = c.M;
              Z = c.O;
              Ia();
              K--;
              k.monitorRunDependencies?.(K);
              0 == K && Ua && (c = Ua, Ua = null, c());
              return Xc;
            }
            K++;
            k.monitorRunDependencies?.(K);
            var b = { a: Vc };
            if (k.instantiateWasm) return new Promise((c) => {
              k.instantiateWasm(b, (d, e) => {
                c(a(d, e));
              });
            });
            La ??= k.locateFile ? k.locateFile("sql-wasm-browser.wasm", ya) : ya + "sql-wasm-browser.wasm";
            return a((await Oa(b)).instance);
          })();
          Wc();
          return Module;
        });
        return initSqlJsPromise;
      };
      if (typeof exports === "object" && typeof module === "object") {
        module.exports = initSqlJs2;
        module.exports.default = initSqlJs2;
      } else if (typeof define === "function" && define["amd"]) {
        define([], function() {
          return initSqlJs2;
        });
      } else if (typeof exports === "object") {
        exports["Module"] = initSqlJs2;
      }
    }
  });

  // src/import-worker.js
  var import_sql_wasm_browser = __toESM(require_sql_wasm_browser(), 1);

  // node_modules/fflate/esm/browser.js
  var u8 = Uint8Array;
  var u16 = Uint16Array;
  var i32 = Int32Array;
  var fleb = new u8([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    4,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    0,
    /* unused */
    0,
    0,
    /* impossible */
    0
  ]);
  var fdeb = new u8([
    0,
    0,
    0,
    0,
    1,
    1,
    2,
    2,
    3,
    3,
    4,
    4,
    5,
    5,
    6,
    6,
    7,
    7,
    8,
    8,
    9,
    9,
    10,
    10,
    11,
    11,
    12,
    12,
    13,
    13,
    /* unused */
    0,
    0
  ]);
  var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
  var freb = function(eb, start) {
    var b = new u16(31);
    for (var i2 = 0; i2 < 31; ++i2) {
      b[i2] = start += 1 << eb[i2 - 1];
    }
    var r = new i32(b[30]);
    for (var i2 = 1; i2 < 30; ++i2) {
      for (var j = b[i2]; j < b[i2 + 1]; ++j) {
        r[j] = j - b[i2] << 5 | i2;
      }
    }
    return { b, r };
  };
  var _a = freb(fleb, 2);
  var fl = _a.b;
  var revfl = _a.r;
  fl[28] = 258, revfl[258] = 28;
  var _b = freb(fdeb, 0);
  var fd = _b.b;
  var revfd = _b.r;
  var rev = new u16(32768);
  for (i = 0; i < 32768; ++i) {
    x = (i & 43690) >> 1 | (i & 21845) << 1;
    x = (x & 52428) >> 2 | (x & 13107) << 2;
    x = (x & 61680) >> 4 | (x & 3855) << 4;
    rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
  }
  var x;
  var i;
  var hMap = (function(cd, mb, r) {
    var s = cd.length;
    var i2 = 0;
    var l = new u16(mb);
    for (; i2 < s; ++i2) {
      if (cd[i2])
        ++l[cd[i2] - 1];
    }
    var le = new u16(mb);
    for (i2 = 1; i2 < mb; ++i2) {
      le[i2] = le[i2 - 1] + l[i2 - 1] << 1;
    }
    var co;
    if (r) {
      co = new u16(1 << mb);
      var rvb = 15 - mb;
      for (i2 = 0; i2 < s; ++i2) {
        if (cd[i2]) {
          var sv = i2 << 4 | cd[i2];
          var r_1 = mb - cd[i2];
          var v = le[cd[i2] - 1]++ << r_1;
          for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
            co[rev[v] >> rvb] = sv;
          }
        }
      }
    } else {
      co = new u16(s);
      for (i2 = 0; i2 < s; ++i2) {
        if (cd[i2]) {
          co[i2] = rev[le[cd[i2] - 1]++] >> 15 - cd[i2];
        }
      }
    }
    return co;
  });
  var flt = new u8(288);
  for (i = 0; i < 144; ++i)
    flt[i] = 8;
  var i;
  for (i = 144; i < 256; ++i)
    flt[i] = 9;
  var i;
  for (i = 256; i < 280; ++i)
    flt[i] = 7;
  var i;
  for (i = 280; i < 288; ++i)
    flt[i] = 8;
  var i;
  var fdt = new u8(32);
  for (i = 0; i < 32; ++i)
    fdt[i] = 5;
  var i;
  var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
  var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
  var max = function(a) {
    var m = a[0];
    for (var i2 = 1; i2 < a.length; ++i2) {
      if (a[i2] > m)
        m = a[i2];
    }
    return m;
  };
  var bits = function(d, p, m) {
    var o = p / 8 | 0;
    return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
  };
  var bits16 = function(d, p) {
    var o = p / 8 | 0;
    return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
  };
  var shft = function(p) {
    return (p + 7) / 8 | 0;
  };
  var slc = function(v, s, e) {
    if (s == null || s < 0)
      s = 0;
    if (e == null || e > v.length)
      e = v.length;
    return new u8(v.subarray(s, e));
  };
  var ec = [
    "unexpected EOF",
    "invalid block type",
    "invalid length/literal",
    "invalid distance",
    "stream finished",
    "no stream handler",
    ,
    // determined by compression function
    "no callback",
    "invalid UTF-8 data",
    "extra field too long",
    "date not in range 1980-2099",
    "filename too long",
    "stream finishing",
    "invalid zip data"
    // determined by unknown compression method
  ];
  var err = function(ind, msg, nt) {
    var e = new Error(msg || ec[ind]);
    e.code = ind;
    if (Error.captureStackTrace)
      Error.captureStackTrace(e, err);
    if (!nt)
      throw e;
    return e;
  };
  var inflt = function(dat, st, buf, dict) {
    var sl = dat.length, dl = dict ? dict.length : 0;
    if (!sl || st.f && !st.l)
      return buf || new u8(0);
    var noBuf = !buf;
    var resize = noBuf || st.i != 2;
    var noSt = st.i;
    if (noBuf)
      buf = new u8(sl * 3);
    var cbuf = function(l2) {
      var bl = buf.length;
      if (l2 > bl) {
        var nbuf = new u8(Math.max(bl * 2, l2));
        nbuf.set(buf);
        buf = nbuf;
      }
    };
    var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
    var tbts = sl * 8;
    do {
      if (!lm) {
        final = bits(dat, pos, 1);
        var type = bits(dat, pos + 1, 3);
        pos += 3;
        if (!type) {
          var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
          if (t > sl) {
            if (noSt)
              err(0);
            break;
          }
          if (resize)
            cbuf(bt + l);
          buf.set(dat.subarray(s, t), bt);
          st.b = bt += l, st.p = pos = t * 8, st.f = final;
          continue;
        } else if (type == 1)
          lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
        else if (type == 2) {
          var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
          var tl = hLit + bits(dat, pos + 5, 31) + 1;
          pos += 14;
          var ldt = new u8(tl);
          var clt = new u8(19);
          for (var i2 = 0; i2 < hcLen; ++i2) {
            clt[clim[i2]] = bits(dat, pos + i2 * 3, 7);
          }
          pos += hcLen * 3;
          var clb = max(clt), clbmsk = (1 << clb) - 1;
          var clm = hMap(clt, clb, 1);
          for (var i2 = 0; i2 < tl; ) {
            var r = clm[bits(dat, pos, clbmsk)];
            pos += r & 15;
            var s = r >> 4;
            if (s < 16) {
              ldt[i2++] = s;
            } else {
              var c = 0, n = 0;
              if (s == 16)
                n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i2 - 1];
              else if (s == 17)
                n = 3 + bits(dat, pos, 7), pos += 3;
              else if (s == 18)
                n = 11 + bits(dat, pos, 127), pos += 7;
              while (n--)
                ldt[i2++] = c;
            }
          }
          var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
          lbt = max(lt);
          dbt = max(dt);
          lm = hMap(lt, lbt, 1);
          dm = hMap(dt, dbt, 1);
        } else
          err(1);
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
      }
      if (resize)
        cbuf(bt + 131072);
      var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
      var lpos = pos;
      for (; ; lpos = pos) {
        var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
        pos += c & 15;
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (!c)
          err(2);
        if (sym < 256)
          buf[bt++] = sym;
        else if (sym == 256) {
          lpos = pos, lm = null;
          break;
        } else {
          var add = sym - 254;
          if (sym > 264) {
            var i2 = sym - 257, b = fleb[i2];
            add = bits(dat, pos, (1 << b) - 1) + fl[i2];
            pos += b;
          }
          var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
          if (!d)
            err(3);
          pos += d & 15;
          var dt = fd[dsym];
          if (dsym > 3) {
            var b = fdeb[dsym];
            dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
          }
          if (pos > tbts) {
            if (noSt)
              err(0);
            break;
          }
          if (resize)
            cbuf(bt + 131072);
          var end = bt + add;
          if (bt < dt) {
            var shift = dl - dt, dend = Math.min(dt, end);
            if (shift + bt < 0)
              err(3);
            for (; bt < dend; ++bt)
              buf[bt] = dict[shift + bt];
          }
          for (; bt < end; ++bt)
            buf[bt] = buf[bt - dt];
        }
      }
      st.l = lm, st.p = lpos, st.b = bt, st.f = final;
      if (lm)
        final = 1, st.m = lbt, st.d = dm, st.n = dbt;
    } while (!final);
    return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
  };
  var et = /* @__PURE__ */ new u8(0);
  var b2 = function(d, b) {
    return d[b] | d[b + 1] << 8;
  };
  var b4 = function(d, b) {
    return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
  };
  var b8 = function(d, b) {
    return b4(d, b) + b4(d, b + 4) * 4294967296;
  };
  function inflateSync(data, opts) {
    return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
  }
  var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
  var tds = 0;
  try {
    td.decode(et, { stream: true });
    tds = 1;
  } catch (e) {
  }
  var dutf8 = function(d) {
    for (var r = "", i2 = 0; ; ) {
      var c = d[i2++];
      var eb = (c > 127) + (c > 223) + (c > 239);
      if (i2 + eb > d.length)
        return { s: r, r: slc(d, i2 - 1) };
      if (!eb)
        r += String.fromCharCode(c);
      else if (eb == 3) {
        c = ((c & 15) << 18 | (d[i2++] & 63) << 12 | (d[i2++] & 63) << 6 | d[i2++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
      } else if (eb & 1)
        r += String.fromCharCode((c & 31) << 6 | d[i2++] & 63);
      else
        r += String.fromCharCode((c & 15) << 12 | (d[i2++] & 63) << 6 | d[i2++] & 63);
    }
  };
  function strFromU8(dat, latin1) {
    if (latin1) {
      var r = "";
      for (var i2 = 0; i2 < dat.length; i2 += 16384)
        r += String.fromCharCode.apply(null, dat.subarray(i2, i2 + 16384));
      return r;
    } else if (td) {
      return td.decode(dat);
    } else {
      var _a2 = dutf8(dat), s = _a2.s, r = _a2.r;
      if (r.length)
        err(8);
      return s;
    }
  }
  var slzh = function(d, b) {
    return b + 30 + b2(d, b + 26) + b2(d, b + 28);
  };
  var zh = function(d, b, z) {
    var fnl = b2(d, b + 28), efl = b2(d, b + 30), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl;
    var _a2 = z64hs(d, es, efl, z, b4(d, b + 20), b4(d, b + 24), b4(d, b + 42)), sc = _a2[0], su = _a2[1], off = _a2[2];
    return [b2(d, b + 10), sc, su, fn, es + efl + b2(d, b + 32), off];
  };
  var z64hs = function(d, b, l, z, sc, su, off) {
    var nsc = sc == 4294967295, nsu = su == 4294967295, noff = off == 4294967295, e = b + l;
    var nf = nsc + nsu + noff;
    if (z && nf) {
      for (; b + 4 < e; b += 4 + b2(d, b + 2)) {
        if (b2(d, b) == 1) {
          return [
            nsc ? b8(d, b + 4 + 8 * nsu) : sc,
            nsu ? b8(d, b + 4) : su,
            noff ? b8(d, b + 4 + 8 * (nsu + nsc)) : off,
            1
          ];
        }
      }
      if (z < 2)
        err(13);
    }
    return [sc, su, off, 0];
  };
  function unzipSync(data, opts) {
    var files = {};
    var e = data.length - 22;
    for (; b4(data, e) != 101010256; --e) {
      if (!e || data.length - e > 65558)
        err(13);
    }
    ;
    var c = b2(data, e + 8);
    if (!c)
      return {};
    var o = b4(data, e + 16);
    var z = b4(data, e - 20) == 117853008;
    if (z) {
      var ze = b4(data, e - 12);
      z = b4(data, ze) == 101075792;
      if (z) {
        c = b4(data, ze + 32);
        o = b4(data, ze + 48);
      }
    }
    var fltr = opts && opts.filter;
    for (var i2 = 0; i2 < c; ++i2) {
      var _a2 = zh(data, o, z), c_2 = _a2[0], sc = _a2[1], su = _a2[2], fn = _a2[3], no = _a2[4], off = _a2[5], b = slzh(data, off);
      o = no;
      if (!fltr || fltr({
        name: fn,
        size: sc,
        originalSize: su,
        compression: c_2
      })) {
        if (!c_2)
          files[fn] = slc(data, b, b + sc);
        else if (c_2 == 8)
          files[fn] = inflateSync(data.subarray(b, b + sc), { out: new u8(su) });
        else
          err(14, "unknown compression type " + c_2);
      }
    }
    return files;
  }

  // node_modules/fzstd/esm/index.mjs
  var ab = ArrayBuffer;
  var u82 = Uint8Array;
  var u162 = Uint16Array;
  var i16 = Int16Array;
  var i322 = Int32Array;
  var slc2 = function(v, s, e) {
    if (u82.prototype.slice)
      return u82.prototype.slice.call(v, s, e);
    if (s == null || s < 0)
      s = 0;
    if (e == null || e > v.length)
      e = v.length;
    var n = new u82(e - s);
    n.set(v.subarray(s, e));
    return n;
  };
  var fill = function(v, n, s, e) {
    if (u82.prototype.fill)
      return u82.prototype.fill.call(v, n, s, e);
    if (s == null || s < 0)
      s = 0;
    if (e == null || e > v.length)
      e = v.length;
    for (; s < e; ++s)
      v[s] = n;
    return v;
  };
  var cpw = function(v, t, s, e) {
    if (u82.prototype.copyWithin)
      return u82.prototype.copyWithin.call(v, t, s, e);
    if (s == null || s < 0)
      s = 0;
    if (e == null || e > v.length)
      e = v.length;
    while (s < e) {
      v[t++] = v[s++];
    }
  };
  var ec2 = [
    "invalid zstd data",
    "window size too large (>2046MB)",
    "invalid block type",
    "FSE accuracy too high",
    "match distance too far back",
    "unexpected EOF"
  ];
  var err2 = function(ind, msg, nt) {
    var e = new Error(msg || ec2[ind]);
    e.code = ind;
    if (Error.captureStackTrace)
      Error.captureStackTrace(e, err2);
    if (!nt)
      throw e;
    return e;
  };
  var rb = function(d, b, n) {
    var i2 = 0, o = 0;
    for (; i2 < n; ++i2)
      o |= d[b++] << (i2 << 3);
    return o;
  };
  var b42 = function(d, b) {
    return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
  };
  var rzfh = function(dat, w) {
    var n3 = dat[0] | dat[1] << 8 | dat[2] << 16;
    if (n3 == 3126568 && dat[3] == 253) {
      var flg = dat[4];
      var ss = flg >> 5 & 1, cc = flg >> 2 & 1, df = flg & 3, fcf = flg >> 6;
      if (flg & 8)
        err2(0);
      var bt = 6 - ss;
      var db = df == 3 ? 4 : df;
      var di = rb(dat, bt, db);
      bt += db;
      var fsb = fcf ? 1 << fcf : ss;
      var fss = rb(dat, bt, fsb) + (fcf == 1 && 256);
      var ws = fss;
      if (!ss) {
        var wb = 1 << 10 + (dat[5] >> 3);
        ws = wb + (wb >> 3) * (dat[5] & 7);
      }
      if (ws > 2145386496)
        err2(1);
      var buf = new u82((w == 1 ? fss || ws : w ? 0 : ws) + 12);
      buf[0] = 1, buf[4] = 4, buf[8] = 8;
      return {
        b: bt + fsb,
        y: 0,
        l: 0,
        d: di,
        w: w && w != 1 ? w : buf.subarray(12),
        e: ws,
        o: new i322(buf.buffer, 0, 3),
        u: fss,
        c: cc,
        m: Math.min(131072, ws)
      };
    } else if ((n3 >> 4 | dat[3] << 20) == 25481893) {
      return b42(dat, 4) + 8;
    }
    err2(0);
  };
  var msb = function(val) {
    var bits2 = 0;
    for (; 1 << bits2 <= val; ++bits2)
      ;
    return bits2 - 1;
  };
  var rfse = function(dat, bt, mal) {
    var tpos = (bt << 3) + 4;
    var al = (dat[bt] & 15) + 5;
    if (al > mal)
      err2(3);
    var sz = 1 << al;
    var probs = sz, sym = -1, re = -1, i2 = -1, ht = sz;
    var buf = new ab(512 + (sz << 2));
    var freq = new i16(buf, 0, 256);
    var dstate = new u162(buf, 0, 256);
    var nstate = new u162(buf, 512, sz);
    var bb1 = 512 + (sz << 1);
    var syms = new u82(buf, bb1, sz);
    var nbits = new u82(buf, bb1 + sz);
    while (sym < 255 && probs > 0) {
      var bits2 = msb(probs + 1);
      var cbt = tpos >> 3;
      var msk = (1 << bits2 + 1) - 1;
      var val = (dat[cbt] | dat[cbt + 1] << 8 | dat[cbt + 2] << 16) >> (tpos & 7) & msk;
      var msk1fb = (1 << bits2) - 1;
      var msv = msk - probs - 1;
      var sval = val & msk1fb;
      if (sval < msv)
        tpos += bits2, val = sval;
      else {
        tpos += bits2 + 1;
        if (val > msk1fb)
          val -= msv;
      }
      freq[++sym] = --val;
      if (val == -1) {
        probs += val;
        syms[--ht] = sym;
      } else
        probs -= val;
      if (!val) {
        do {
          var rbt = tpos >> 3;
          re = (dat[rbt] | dat[rbt + 1] << 8) >> (tpos & 7) & 3;
          tpos += 2;
          sym += re;
        } while (re == 3);
      }
    }
    if (sym > 255 || probs)
      err2(0);
    var sympos = 0;
    var sstep = (sz >> 1) + (sz >> 3) + 3;
    var smask = sz - 1;
    for (var s = 0; s <= sym; ++s) {
      var sf = freq[s];
      if (sf < 1) {
        dstate[s] = -sf;
        continue;
      }
      for (i2 = 0; i2 < sf; ++i2) {
        syms[sympos] = s;
        do {
          sympos = sympos + sstep & smask;
        } while (sympos >= ht);
      }
    }
    if (sympos)
      err2(0);
    for (i2 = 0; i2 < sz; ++i2) {
      var ns = dstate[syms[i2]]++;
      var nb = nbits[i2] = al - msb(ns);
      nstate[i2] = (ns << nb) - sz;
    }
    return [tpos + 7 >> 3, {
      b: al,
      s: syms,
      n: nbits,
      t: nstate
    }];
  };
  var rhu = function(dat, bt) {
    var i2 = 0, wc = -1;
    var buf = new u82(292), hb = dat[bt];
    var hw = buf.subarray(0, 256);
    var rc = buf.subarray(256, 268);
    var ri = new u162(buf.buffer, 268);
    if (hb < 128) {
      var _a2 = rfse(dat, bt + 1, 6), ebt = _a2[0], fdt2 = _a2[1];
      bt += hb;
      var epos = ebt << 3;
      var lb = dat[bt];
      if (!lb)
        err2(0);
      var st1 = 0, st2 = 0, btr1 = fdt2.b, btr2 = btr1;
      var fpos = (++bt << 3) - 8 + msb(lb);
      for (; ; ) {
        fpos -= btr1;
        if (fpos < epos)
          break;
        var cbt = fpos >> 3;
        st1 += (dat[cbt] | dat[cbt + 1] << 8) >> (fpos & 7) & (1 << btr1) - 1;
        hw[++wc] = fdt2.s[st1];
        fpos -= btr2;
        if (fpos < epos)
          break;
        cbt = fpos >> 3;
        st2 += (dat[cbt] | dat[cbt + 1] << 8) >> (fpos & 7) & (1 << btr2) - 1;
        hw[++wc] = fdt2.s[st2];
        btr1 = fdt2.n[st1];
        st1 = fdt2.t[st1];
        btr2 = fdt2.n[st2];
        st2 = fdt2.t[st2];
      }
      if (++wc > 255)
        err2(0);
    } else {
      wc = hb - 127;
      for (; i2 < wc; i2 += 2) {
        var byte = dat[++bt];
        hw[i2] = byte >> 4;
        hw[i2 + 1] = byte & 15;
      }
      ++bt;
    }
    var wes = 0;
    for (i2 = 0; i2 < wc; ++i2) {
      var wt = hw[i2];
      if (wt > 11)
        err2(0);
      wes += wt && 1 << wt - 1;
    }
    var mb = msb(wes) + 1;
    var ts = 1 << mb;
    var rem = ts - wes;
    if (rem & rem - 1)
      err2(0);
    hw[wc++] = msb(rem) + 1;
    for (i2 = 0; i2 < wc; ++i2) {
      var wt = hw[i2];
      ++rc[hw[i2] = wt && mb + 1 - wt];
    }
    var hbuf = new u82(ts << 1);
    var syms = hbuf.subarray(0, ts), nb = hbuf.subarray(ts);
    ri[mb] = 0;
    for (i2 = mb; i2 > 0; --i2) {
      var pv = ri[i2];
      fill(nb, i2, pv, ri[i2 - 1] = pv + rc[i2] * (1 << mb - i2));
    }
    if (ri[0] != ts)
      err2(0);
    for (i2 = 0; i2 < wc; ++i2) {
      var bits2 = hw[i2];
      if (bits2) {
        var code = ri[bits2];
        fill(syms, i2, code, ri[bits2] = code + (1 << mb - bits2));
      }
    }
    return [bt, {
      n: nb,
      b: mb,
      s: syms
    }];
  };
  var dllt = rfse(/* @__PURE__ */ new u82([
    81,
    16,
    99,
    140,
    49,
    198,
    24,
    99,
    12,
    33,
    196,
    24,
    99,
    102,
    102,
    134,
    70,
    146,
    4
  ]), 0, 6)[1];
  var dmlt = rfse(/* @__PURE__ */ new u82([
    33,
    20,
    196,
    24,
    99,
    140,
    33,
    132,
    16,
    66,
    8,
    33,
    132,
    16,
    66,
    8,
    33,
    68,
    68,
    68,
    68,
    68,
    68,
    68,
    68,
    36,
    9
  ]), 0, 6)[1];
  var doct = rfse(/* @__PURE__ */ new u82([
    32,
    132,
    16,
    66,
    102,
    70,
    68,
    68,
    68,
    68,
    36,
    73,
    2
  ]), 0, 5)[1];
  var b2bl = function(b, s) {
    var len = b.length, bl = new i322(len);
    for (var i2 = 0; i2 < len; ++i2) {
      bl[i2] = s;
      s += 1 << b[i2];
    }
    return bl;
  };
  var llb = /* @__PURE__ */ new u82((/* @__PURE__ */ new i322([
    0,
    0,
    0,
    0,
    16843009,
    50528770,
    134678020,
    202050057,
    269422093
  ])).buffer, 0, 36);
  var llbl = /* @__PURE__ */ b2bl(llb, 0);
  var mlb = /* @__PURE__ */ new u82((/* @__PURE__ */ new i322([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    16843009,
    50528770,
    117769220,
    185207048,
    252579084,
    16
  ])).buffer, 0, 53);
  var mlbl = /* @__PURE__ */ b2bl(mlb, 3);
  var dhu = function(dat, out, hu) {
    var len = dat.length, ss = out.length, lb = dat[len - 1], msk = (1 << hu.b) - 1, eb = -hu.b;
    if (!lb)
      err2(0);
    var st = 0, btr = hu.b, pos = (len << 3) - 8 + msb(lb) - btr, i2 = -1;
    for (; pos > eb && i2 < ss; ) {
      var cbt = pos >> 3;
      var val = (dat[cbt] | dat[cbt + 1] << 8 | dat[cbt + 2] << 16) >> (pos & 7);
      st = (st << btr | val) & msk;
      out[++i2] = hu.s[st];
      pos -= btr = hu.n[st];
    }
    if (pos != eb || i2 + 1 != ss)
      err2(0);
  };
  var dhu4 = function(dat, out, hu) {
    var bt = 6;
    var ss = out.length, sz1 = ss + 3 >> 2, sz2 = sz1 << 1, sz3 = sz1 + sz2;
    dhu(dat.subarray(bt, bt += dat[0] | dat[1] << 8), out.subarray(0, sz1), hu);
    dhu(dat.subarray(bt, bt += dat[2] | dat[3] << 8), out.subarray(sz1, sz2), hu);
    dhu(dat.subarray(bt, bt += dat[4] | dat[5] << 8), out.subarray(sz2, sz3), hu);
    dhu(dat.subarray(bt), out.subarray(sz3), hu);
  };
  var rzb = function(dat, st, out) {
    var _a2;
    var bt = st.b;
    var b0 = dat[bt], btype = b0 >> 1 & 3;
    st.l = b0 & 1;
    var sz = b0 >> 3 | dat[bt + 1] << 5 | dat[bt + 2] << 13;
    var ebt = (bt += 3) + sz;
    if (btype == 1) {
      if (bt >= dat.length)
        return;
      st.b = bt + 1;
      if (out) {
        fill(out, dat[bt], st.y, st.y += sz);
        return out;
      }
      return fill(new u82(sz), dat[bt]);
    }
    if (ebt > dat.length)
      return;
    if (btype == 0) {
      st.b = ebt;
      if (out) {
        out.set(dat.subarray(bt, ebt), st.y);
        st.y += sz;
        return out;
      }
      return slc2(dat, bt, ebt);
    }
    if (btype == 2) {
      var b3 = dat[bt], lbt = b3 & 3, sf = b3 >> 2 & 3;
      var lss = b3 >> 4, lcs = 0, s4 = 0;
      if (lbt < 2) {
        if (sf & 1)
          lss |= dat[++bt] << 4 | (sf & 2 && dat[++bt] << 12);
        else
          lss = b3 >> 3;
      } else {
        s4 = sf;
        if (sf < 2)
          lss |= (dat[++bt] & 63) << 4, lcs = dat[bt] >> 6 | dat[++bt] << 2;
        else if (sf == 2)
          lss |= dat[++bt] << 4 | (dat[++bt] & 3) << 12, lcs = dat[bt] >> 2 | dat[++bt] << 6;
        else
          lss |= dat[++bt] << 4 | (dat[++bt] & 63) << 12, lcs = dat[bt] >> 6 | dat[++bt] << 2 | dat[++bt] << 10;
      }
      ++bt;
      var buf = out ? out.subarray(st.y, st.y + st.m) : new u82(st.m);
      var spl = buf.length - lss;
      if (lbt == 0)
        buf.set(dat.subarray(bt, bt += lss), spl);
      else if (lbt == 1)
        fill(buf, dat[bt++], spl);
      else {
        var hu = st.h;
        if (lbt == 2) {
          var hud = rhu(dat, bt);
          lcs += bt - (bt = hud[0]);
          st.h = hu = hud[1];
        } else if (!hu)
          err2(0);
        (s4 ? dhu4 : dhu)(dat.subarray(bt, bt += lcs), buf.subarray(spl), hu);
      }
      var ns = dat[bt++];
      if (ns) {
        if (ns == 255)
          ns = (dat[bt++] | dat[bt++] << 8) + 32512;
        else if (ns > 127)
          ns = ns - 128 << 8 | dat[bt++];
        var scm = dat[bt++];
        if (scm & 3)
          err2(0);
        var dts = [dmlt, doct, dllt];
        for (var i2 = 2; i2 > -1; --i2) {
          var md = scm >> (i2 << 1) + 2 & 3;
          if (md == 1) {
            var rbuf = new u82([0, 0, dat[bt++]]);
            dts[i2] = {
              s: rbuf.subarray(2, 3),
              n: rbuf.subarray(0, 1),
              t: new u162(rbuf.buffer, 0, 1),
              b: 0
            };
          } else if (md == 2) {
            _a2 = rfse(dat, bt, 9 - (i2 & 1)), bt = _a2[0], dts[i2] = _a2[1];
          } else if (md == 3) {
            if (!st.t)
              err2(0);
            dts[i2] = st.t[i2];
          }
        }
        var _b2 = st.t = dts, mlt = _b2[0], oct = _b2[1], llt = _b2[2];
        var lb = dat[ebt - 1];
        if (!lb)
          err2(0);
        var spos = (ebt << 3) - 8 + msb(lb) - llt.b, cbt = spos >> 3, oubt = 0;
        var lst = (dat[cbt] | dat[cbt + 1] << 8) >> (spos & 7) & (1 << llt.b) - 1;
        cbt = (spos -= oct.b) >> 3;
        var ost = (dat[cbt] | dat[cbt + 1] << 8) >> (spos & 7) & (1 << oct.b) - 1;
        cbt = (spos -= mlt.b) >> 3;
        var mst = (dat[cbt] | dat[cbt + 1] << 8) >> (spos & 7) & (1 << mlt.b) - 1;
        for (++ns; --ns; ) {
          var llc = llt.s[lst];
          var lbtr = llt.n[lst];
          var mlc = mlt.s[mst];
          var mbtr = mlt.n[mst];
          var ofc = oct.s[ost];
          var obtr = oct.n[ost];
          cbt = (spos -= ofc) >> 3;
          var ofp = 1 << ofc;
          var off = ofp + ((dat[cbt] | dat[cbt + 1] << 8 | dat[cbt + 2] << 16 | dat[cbt + 3] << 24) >>> (spos & 7) & ofp - 1);
          cbt = (spos -= mlb[mlc]) >> 3;
          var ml = mlbl[mlc] + ((dat[cbt] | dat[cbt + 1] << 8 | dat[cbt + 2] << 16) >> (spos & 7) & (1 << mlb[mlc]) - 1);
          cbt = (spos -= llb[llc]) >> 3;
          var ll = llbl[llc] + ((dat[cbt] | dat[cbt + 1] << 8 | dat[cbt + 2] << 16) >> (spos & 7) & (1 << llb[llc]) - 1);
          cbt = (spos -= lbtr) >> 3;
          lst = llt.t[lst] + ((dat[cbt] | dat[cbt + 1] << 8) >> (spos & 7) & (1 << lbtr) - 1);
          cbt = (spos -= mbtr) >> 3;
          mst = mlt.t[mst] + ((dat[cbt] | dat[cbt + 1] << 8) >> (spos & 7) & (1 << mbtr) - 1);
          cbt = (spos -= obtr) >> 3;
          ost = oct.t[ost] + ((dat[cbt] | dat[cbt + 1] << 8) >> (spos & 7) & (1 << obtr) - 1);
          if (off > 3) {
            st.o[2] = st.o[1];
            st.o[1] = st.o[0];
            st.o[0] = off -= 3;
          } else {
            var idx = off - (ll != 0);
            if (idx) {
              off = idx == 3 ? st.o[0] - 1 : st.o[idx];
              if (idx > 1)
                st.o[2] = st.o[1];
              st.o[1] = st.o[0];
              st.o[0] = off;
            } else
              off = st.o[0];
          }
          for (var i2 = 0; i2 < ll; ++i2) {
            buf[oubt + i2] = buf[spl + i2];
          }
          oubt += ll, spl += ll;
          var stin = oubt - off;
          if (stin < 0) {
            var len = -stin;
            var bs = st.e + stin;
            if (len > ml)
              len = ml;
            for (var i2 = 0; i2 < len; ++i2) {
              buf[oubt + i2] = st.w[bs + i2];
            }
            oubt += len, ml -= len, stin = 0;
          }
          for (var i2 = 0; i2 < ml; ++i2) {
            buf[oubt + i2] = buf[stin + i2];
          }
          oubt += ml;
        }
        if (oubt != spl) {
          while (spl < buf.length) {
            buf[oubt++] = buf[spl++];
          }
        } else
          oubt = buf.length;
        if (out)
          st.y += oubt;
        else
          buf = slc2(buf, 0, oubt);
      } else if (out) {
        st.y += lss;
        if (spl) {
          for (var i2 = 0; i2 < lss; ++i2) {
            buf[i2] = buf[spl + i2];
          }
        }
      } else if (spl)
        buf = slc2(buf, spl);
      st.b = ebt;
      return buf;
    }
    err2(2);
  };
  var cct = function(bufs, ol) {
    if (bufs.length == 1)
      return bufs[0];
    var buf = new u82(ol);
    for (var i2 = 0, b = 0; i2 < bufs.length; ++i2) {
      var chk = bufs[i2];
      buf.set(chk, b);
      b += chk.length;
    }
    return buf;
  };
  var Decompress = /* @__PURE__ */ (function() {
    function Decompress2(ondata) {
      this.ondata = ondata;
      this.c = [];
      this.l = 0;
      this.z = 0;
    }
    Decompress2.prototype.push = function(chunk, final) {
      if (typeof this.s == "number") {
        var sub = Math.min(chunk.length, this.s);
        chunk = chunk.subarray(sub);
        this.s -= sub;
      }
      var sl = chunk.length;
      var ncs = sl + this.l;
      if (!this.s) {
        if (final) {
          if (!ncs) {
            this.ondata(new u82(0), true);
            return;
          }
          if (ncs < 5)
            err2(5);
        } else if (ncs < 18) {
          this.c.push(chunk);
          this.l = ncs;
          return;
        }
        if (this.l) {
          this.c.push(chunk);
          chunk = cct(this.c, ncs);
          this.c = [];
          this.l = 0;
        }
        if (typeof (this.s = rzfh(chunk)) == "number")
          return this.push(chunk, final);
      }
      if (typeof this.s != "number") {
        if (ncs < (this.z || 3)) {
          if (final)
            err2(5);
          this.c.push(chunk);
          this.l = ncs;
          return;
        }
        if (this.l) {
          this.c.push(chunk);
          chunk = cct(this.c, ncs);
          this.c = [];
          this.l = 0;
        }
        if (!this.z && ncs < (this.z = chunk[this.s.b] & 2 ? 4 : 3 + (chunk[this.s.b] >> 3 | chunk[this.s.b + 1] << 5 | chunk[this.s.b + 2] << 13))) {
          if (final)
            err2(5);
          this.c.push(chunk);
          this.l = ncs;
          return;
        } else
          this.z = 0;
        for (; ; ) {
          var blk = rzb(chunk, this.s);
          if (!blk) {
            if (final)
              err2(5);
            var adc = chunk.subarray(this.s.b);
            this.s.b = 0;
            this.c.push(adc), this.l += adc.length;
            return;
          } else {
            this.ondata(blk, false);
            cpw(this.s.w, 0, blk.length);
            this.s.w.set(blk, this.s.w.length - blk.length);
          }
          if (this.s.l) {
            var rest = chunk.subarray(this.s.b);
            this.s = this.s.c * 4;
            this.push(rest, final);
            return;
          }
        }
      } else if (final)
        err2(5);
    };
    return Decompress2;
  })();

  // node_modules/ts-fsrs/dist/index.mjs
  var FSRSError = class _FSRSError extends Error {
    constructor(message = "FSRS Error") {
      super(message);
      this.name = "FSRSError";
      Error.captureStackTrace?.(this, _FSRSError);
    }
  };
  var FSRSValidationError = class _FSRSValidationError extends FSRSError {
    constructor(message) {
      super(message);
      this.name = "FSRSValidationError";
      Error.captureStackTrace?.(this, _FSRSValidationError);
    }
  };
  var State = /* @__PURE__ */ ((State2) => {
    State2[State2["New"] = 0] = "New";
    State2[State2["Learning"] = 1] = "Learning";
    State2[State2["Review"] = 2] = "Review";
    State2[State2["Relearning"] = 3] = "Relearning";
    return State2;
  })(State || {});
  var Rating = /* @__PURE__ */ ((Rating2) => {
    Rating2[Rating2["Manual"] = 0] = "Manual";
    Rating2[Rating2["Again"] = 1] = "Again";
    Rating2[Rating2["Hard"] = 2] = "Hard";
    Rating2[Rating2["Good"] = 3] = "Good";
    Rating2[Rating2["Easy"] = 4] = "Easy";
    return Rating2;
  })(Rating || {});
  var TypeConvert = class _TypeConvert {
    static card(card) {
      return {
        ...card,
        state: _TypeConvert.state(card.state),
        due: _TypeConvert.time(card.due),
        last_review: card.last_review ? _TypeConvert.time(card.last_review) : void 0
      };
    }
    static rating(value) {
      if (typeof value === "string") {
        const firstLetter = value.charAt(0).toUpperCase();
        const restOfString = value.slice(1).toLowerCase();
        const ret = Rating[`${firstLetter}${restOfString}`];
        if (ret === void 0) {
          throw new FSRSValidationError(`Invalid rating:[${value}]`);
        }
        return ret;
      } else if (typeof value === "number") {
        return value;
      }
      throw new FSRSValidationError(`Invalid rating:[${value}]`);
    }
    static state(value) {
      if (typeof value === "string") {
        const firstLetter = value.charAt(0).toUpperCase();
        const restOfString = value.slice(1).toLowerCase();
        const ret = State[`${firstLetter}${restOfString}`];
        if (ret === void 0) {
          throw new FSRSValidationError(`Invalid state:[${value}]`);
        }
        return ret;
      } else if (typeof value === "number") {
        return value;
      }
      throw new FSRSValidationError(`Invalid state:[${value}]`);
    }
    static time(value) {
      if (value instanceof Date) {
        return value;
      }
      const date = new Date(value);
      if (typeof value === "object" && value !== null && !Number.isNaN(Date.parse(value) || +date)) {
        return date;
      } else if (typeof value === "string") {
        const timestamp = Date.parse(value);
        if (!Number.isNaN(timestamp)) {
          return new Date(timestamp);
        } else {
          throw new FSRSValidationError(`Invalid date:[${value}]`);
        }
      } else if (typeof value === "number") {
        return new Date(value);
      }
      throw new FSRSValidationError(`Invalid date:[${value}]`);
    }
    static review_log(log) {
      return {
        ...log,
        due: _TypeConvert.time(log.due),
        rating: _TypeConvert.rating(log.rating),
        state: _TypeConvert.state(log.state),
        review: _TypeConvert.time(log.review)
      };
    }
  };
  Date.prototype.scheduler = function(t, isDay) {
    return date_scheduler(this, t, isDay);
  };
  Date.prototype.diff = function(pre, unit) {
    return date_diff(this, pre, unit);
  };
  Date.prototype.format = function() {
    return formatDate(this);
  };
  Date.prototype.dueFormat = function(last_review, unit, timeUnit) {
    return show_diff_message(this, last_review, unit, timeUnit);
  };
  function date_scheduler(now, t, isDay) {
    return new Date(
      isDay ? TypeConvert.time(now).getTime() + t * 24 * 60 * 60 * 1e3 : TypeConvert.time(now).getTime() + t * 60 * 1e3
    );
  }
  function date_diff(now, pre, unit) {
    if (!now || !pre) {
      throw new FSRSValidationError("Invalid date");
    }
    const diff = TypeConvert.time(now).getTime() - TypeConvert.time(pre).getTime();
    let r = 0;
    switch (unit) {
      case "days":
        r = Math.floor(diff / (24 * 60 * 60 * 1e3));
        break;
      case "minutes":
        r = Math.floor(diff / (60 * 1e3));
        break;
    }
    return r;
  }
  function formatDate(dateInput) {
    const date = TypeConvert.time(dateInput);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${year}-${padZero(month)}-${padZero(day)} ${padZero(hours)}:${padZero(
      minutes
    )}:${padZero(seconds)}`;
  }
  function padZero(num) {
    return num < 10 ? `0${num}` : `${num}`;
  }
  var TIMEUNIT = [60, 60, 24, 31, 12];
  var TIMEUNITFORMAT = ["second", "min", "hour", "day", "month", "year"];
  function show_diff_message(due, last_review, unit, timeUnit = TIMEUNITFORMAT) {
    due = TypeConvert.time(due);
    last_review = TypeConvert.time(last_review);
    if (timeUnit.length !== TIMEUNITFORMAT.length) {
      timeUnit = TIMEUNITFORMAT;
    }
    let diff = due.getTime() - last_review.getTime();
    let i2 = 0;
    diff /= 1e3;
    for (i2 = 0; i2 < TIMEUNIT.length; i2++) {
      if (diff < TIMEUNIT[i2]) {
        break;
      } else {
        diff /= TIMEUNIT[i2];
      }
    }
    return `${Math.floor(diff)}${unit ? timeUnit[i2] : ""}`;
  }
  var Grades = Object.freeze([
    Rating.Again,
    Rating.Hard,
    Rating.Good,
    Rating.Easy
  ]);
  var FUZZ_RANGES = [
    {
      start: 2.5,
      end: 7,
      factor: 0.15
    },
    {
      start: 7,
      end: 20,
      factor: 0.1
    },
    {
      start: 20,
      end: Infinity,
      factor: 0.05
    }
  ];
  function get_fuzz_range(interval, elapsed_days, maximum_interval) {
    let delta = 1;
    for (const range of FUZZ_RANGES) {
      delta += range.factor * Math.max(Math.min(interval, range.end) - range.start, 0);
    }
    interval = Math.min(interval, maximum_interval);
    let min_ivl = Math.max(2, Math.round(interval - delta));
    const max_ivl = Math.min(Math.round(interval + delta), maximum_interval);
    if (interval > elapsed_days) {
      min_ivl = Math.max(min_ivl, elapsed_days + 1);
    }
    min_ivl = Math.min(min_ivl, max_ivl);
    return { min_ivl, max_ivl };
  }
  function clamp(value, min, max2) {
    return Math.min(Math.max(value, min), max2);
  }
  function roundTo(num, decimals) {
    const factor = 10 ** decimals;
    return Math.round(num * factor) / factor;
  }
  function dateDiffInDays(last, cur) {
    const utc1 = Date.UTC(
      last.getUTCFullYear(),
      last.getUTCMonth(),
      last.getUTCDate()
    );
    const utc2 = Date.UTC(
      cur.getUTCFullYear(),
      cur.getUTCMonth(),
      cur.getUTCDate()
    );
    return Math.floor(
      (utc2 - utc1) / 864e5
      /** 1000 * 60 * 60 * 24*/
    );
  }
  var ConvertStepUnitToMinutes = (step) => {
    const unit = step.slice(-1);
    const value = parseInt(step.slice(0, -1), 10);
    if (Number.isNaN(value) || !Number.isFinite(value) || value < 0) {
      throw new FSRSValidationError(`Invalid step value: ${step}`);
    }
    switch (unit) {
      case "m":
        return value;
      case "h":
        return value * 60;
      case "d":
        return value * 1440;
      default:
        throw new FSRSValidationError(
          `Invalid step unit: ${step}, expected m/h/d`
        );
    }
  };
  var BasicLearningStepsStrategy = (params, state, cur_step) => {
    const learning_steps = state === State.Relearning || state === State.Review ? params.relearning_steps : params.learning_steps;
    const steps_length = learning_steps.length;
    if (steps_length === 0 || cur_step >= steps_length) return {};
    const firstStep = learning_steps[0];
    const toMinutes = ConvertStepUnitToMinutes;
    const getAgainInterval = () => {
      return toMinutes(firstStep);
    };
    const getHardInterval = () => {
      if (steps_length === 1) return Math.round(toMinutes(firstStep) * 1.5);
      const nextStep = learning_steps[1];
      return Math.round((toMinutes(firstStep) + toMinutes(nextStep)) / 2);
    };
    const getStepInfo = (index) => {
      if (index < 0 || index >= steps_length) {
        return null;
      } else {
        return learning_steps[index];
      }
    };
    const getGoodMinutes = (step) => {
      return toMinutes(step);
    };
    const result = {};
    const step_info = getStepInfo(Math.max(0, cur_step));
    if (state === State.Review) {
      result[Rating.Again] = {
        scheduled_minutes: toMinutes(step_info),
        next_step: 0
      };
      return result;
    } else {
      result[Rating.Again] = {
        scheduled_minutes: getAgainInterval(),
        next_step: 0
      };
      result[Rating.Hard] = {
        scheduled_minutes: getHardInterval(),
        next_step: cur_step
      };
      const next_info = getStepInfo(cur_step + 1);
      if (next_info) {
        const nextMin = getGoodMinutes(next_info);
        if (nextMin) {
          result[Rating.Good] = {
            scheduled_minutes: Math.round(nextMin),
            next_step: cur_step + 1
          };
        }
      }
    }
    return result;
  };
  function DefaultInitSeedStrategy() {
    const time = this.review_time.getTime();
    const reps = this.current.reps;
    const mul = this.current.difficulty * this.current.stability;
    return `${time}_${reps}_${mul}`;
  }
  var StrategyMode = /* @__PURE__ */ ((StrategyMode2) => {
    StrategyMode2["SCHEDULER"] = "Scheduler";
    StrategyMode2["LEARNING_STEPS"] = "LearningSteps";
    StrategyMode2["SEED"] = "Seed";
    return StrategyMode2;
  })(StrategyMode || {});
  var AbstractScheduler = class {
    last;
    current;
    review_time;
    next = /* @__PURE__ */ new Map();
    algorithm;
    strategies;
    elapsed_days = 0;
    // init
    constructor(card, now, algorithm, strategies) {
      this.algorithm = algorithm;
      this.last = TypeConvert.card(card);
      this.current = TypeConvert.card(card);
      this.review_time = TypeConvert.time(now);
      this.strategies = strategies;
      this.init();
    }
    checkGrade(grade) {
      if (!Number.isFinite(grade) || grade < 1 || grade > 4) {
        throw new FSRSValidationError(`Invalid grade "${grade}",expected 1-4`);
      }
    }
    init() {
      const { state, last_review } = this.current;
      let interval = 0;
      if (state !== State.New && last_review) {
        interval = dateDiffInDays(last_review, this.review_time);
      }
      this.current.last_review = this.review_time;
      this.elapsed_days = interval;
      this.current.elapsed_days = interval;
      this.current.reps += 1;
      let seed_strategy = DefaultInitSeedStrategy;
      if (this.strategies) {
        const custom_strategy = this.strategies.get(StrategyMode.SEED);
        if (custom_strategy) {
          seed_strategy = custom_strategy;
        }
      }
      this.algorithm.seed = seed_strategy.call(this);
    }
    preview() {
      return {
        [Rating.Again]: this.review(Rating.Again),
        [Rating.Hard]: this.review(Rating.Hard),
        [Rating.Good]: this.review(Rating.Good),
        [Rating.Easy]: this.review(Rating.Easy),
        [Symbol.iterator]: this.previewIterator.bind(this)
      };
    }
    *previewIterator() {
      for (const grade of Grades) {
        yield this.review(grade);
      }
    }
    review(grade) {
      const { state } = this.last;
      let item;
      this.checkGrade(grade);
      switch (state) {
        case State.New:
          item = this.newState(grade);
          break;
        case State.Learning:
        case State.Relearning:
          item = this.learningState(grade);
          break;
        case State.Review:
          item = this.reviewState(grade);
          break;
      }
      return item;
    }
    buildLog(rating) {
      const { last_review, due, elapsed_days } = this.last;
      return {
        rating,
        state: this.current.state,
        due: last_review || due,
        stability: this.current.stability,
        difficulty: this.current.difficulty,
        elapsed_days: this.elapsed_days,
        last_elapsed_days: elapsed_days,
        scheduled_days: this.current.scheduled_days,
        learning_steps: this.current.learning_steps,
        review: this.review_time
      };
    }
  };
  var Alea = class {
    c;
    s0;
    s1;
    s2;
    constructor(seed) {
      const mash = Mash();
      this.c = 1;
      this.s0 = mash(" ");
      this.s1 = mash(" ");
      this.s2 = mash(" ");
      if (seed == null) seed = Date.now();
      this.s0 -= mash(seed);
      if (this.s0 < 0) this.s0 += 1;
      this.s1 -= mash(seed);
      if (this.s1 < 0) this.s1 += 1;
      this.s2 -= mash(seed);
      if (this.s2 < 0) this.s2 += 1;
    }
    next() {
      const t = 2091639 * this.s0 + this.c * 23283064365386963e-26;
      this.s0 = this.s1;
      this.s1 = this.s2;
      this.c = t | 0;
      this.s2 = t - this.c;
      return this.s2;
    }
    set state(state) {
      this.c = state.c;
      this.s0 = state.s0;
      this.s1 = state.s1;
      this.s2 = state.s2;
    }
    get state() {
      return {
        c: this.c,
        s0: this.s0,
        s1: this.s1,
        s2: this.s2
      };
    }
  };
  function Mash() {
    let n = 4022871197;
    return function mash(data) {
      data = String(data);
      for (let i2 = 0; i2 < data.length; i2++) {
        n += data.charCodeAt(i2);
        let h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 4294967296;
      }
      return (n >>> 0) * 23283064365386963e-26;
    };
  }
  function alea(seed) {
    const xg = new Alea(seed);
    const prng = () => xg.next();
    prng.int32 = () => xg.next() * 4294967296 | 0;
    prng.double = () => prng() + (prng() * 2097152 | 0) * 11102230246251565e-32;
    prng.state = () => xg.state;
    prng.importState = (state) => {
      xg.state = state;
      return prng;
    };
    return prng;
  }
  var version = "5.4.2";
  var default_request_retention = 0.9;
  var default_maximum_interval = 36500;
  var default_enable_fuzz = false;
  var default_enable_short_term = true;
  var default_learning_steps = Object.freeze([
    "1m",
    "10m"
  ]);
  var default_relearning_steps = Object.freeze([
    "10m"
  ]);
  var FSRSVersion = `v${version} using FSRS-6.0`;
  var S_MIN = 1e-3;
  var INIT_S_MAX = 100;
  var FSRS5_DEFAULT_DECAY = 0.5;
  var FSRS6_DEFAULT_DECAY = 0.1542;
  var default_w = Object.freeze([
    0.212,
    1.2931,
    2.3065,
    8.2956,
    6.4133,
    0.8334,
    3.0194,
    1e-3,
    1.8722,
    0.1666,
    0.796,
    1.4835,
    0.0614,
    0.2629,
    1.6483,
    0.6014,
    1.8729,
    0.5425,
    0.0912,
    0.0658,
    FSRS6_DEFAULT_DECAY
  ]);
  var W17_W18_Ceiling = 2;
  var CLAMP_PARAMETERS = (w17_w18_ceiling, enable_short_term = default_enable_short_term) => [
    [S_MIN, INIT_S_MAX],
    [S_MIN, INIT_S_MAX],
    [S_MIN, INIT_S_MAX],
    [S_MIN, INIT_S_MAX],
    [1, 10],
    [1e-3, 4],
    [1e-3, 4],
    [1e-3, 0.75],
    [0, 4.5],
    [0, 0.8],
    [1e-3, 3.5],
    [1e-3, 5],
    [1e-3, 0.25],
    [1e-3, 0.9],
    [0, 4],
    [0, 1],
    [1, 6],
    [0, w17_w18_ceiling],
    [0, w17_w18_ceiling],
    [
      enable_short_term ? 0.01 : 0,
      0.8
    ],
    [0.1, 0.8]
  ];
  var clipParameters = (parameters, numRelearningSteps, enableShortTerm = default_enable_short_term) => {
    const clip = CLAMP_PARAMETERS(W17_W18_Ceiling, enableShortTerm).slice(
      0,
      parameters.length
    );
    if (Math.max(0, numRelearningSteps) > 1) {
      const w11 = clamp(parameters[11] || 0, clip[11][0], clip[11][1]);
      const w13 = clamp(parameters[13] || 0, clip[13][0], clip[13][1]);
      const w14 = clamp(parameters[14] || 0, clip[14][0], clip[14][1]);
      const value = -(Math.log(w11) + Math.log(Math.pow(2, w13) - 1) + w14 * 0.3) / numRelearningSteps;
      const w17_w18_ceiling = clamp(
        roundTo(Math.sqrt(Math.max(value, 0)), 8),
        0.01,
        W17_W18_Ceiling
      );
      if (clip[17]) clip[17] = [clip[17][0], w17_w18_ceiling];
      if (clip[18]) clip[18] = [clip[18][0], w17_w18_ceiling];
    }
    return clip.map(
      ([min, max2], index) => clamp(parameters[index] || 0, min, max2)
    );
  };
  var migrateParameters = (parameters, numRelearningSteps = 0, enableShortTerm = default_enable_short_term) => {
    if (parameters === void 0) {
      return [...default_w];
    }
    switch (parameters.length) {
      case 21:
        return clipParameters(
          Array.from(parameters),
          numRelearningSteps,
          enableShortTerm
        );
      case 19:
        console.debug("[FSRS-6]auto fill w from 19 to 21 length");
        return clipParameters(
          Array.from(parameters),
          numRelearningSteps,
          enableShortTerm
        ).concat([0, FSRS5_DEFAULT_DECAY]);
      case 17: {
        const w = clipParameters(
          Array.from(parameters),
          numRelearningSteps,
          enableShortTerm
        );
        w[4] = +(w[5] * 2 + w[4]).toFixed(8);
        w[5] = +(Math.log(w[5] * 3 + 1) / 3).toFixed(8);
        w[6] = +(w[6] + 0.5).toFixed(8);
        console.debug("[FSRS-6]auto fill w from 17 to 21 length");
        return w.concat([0, 0, 0, FSRS5_DEFAULT_DECAY]);
      }
      default:
        console.warn("[FSRS]Invalid parameters length, using default parameters");
        return [...default_w];
    }
  };
  var generatorParameters = (props) => {
    const learning_steps = Array.isArray(props?.learning_steps) ? props.learning_steps : default_learning_steps;
    const relearning_steps = Array.isArray(props?.relearning_steps) ? props.relearning_steps : default_relearning_steps;
    const enable_short_term = props?.enable_short_term ?? default_enable_short_term;
    const w = migrateParameters(
      props?.w,
      relearning_steps.length,
      enable_short_term
    );
    return {
      request_retention: props?.request_retention || default_request_retention,
      maximum_interval: props?.maximum_interval || default_maximum_interval,
      w,
      enable_fuzz: props?.enable_fuzz ?? default_enable_fuzz,
      enable_short_term,
      learning_steps,
      relearning_steps
    };
  };
  function createEmptyCard(now, afterHandler) {
    const emptyCard = {
      due: now ? TypeConvert.time(now) : /* @__PURE__ */ new Date(),
      stability: 0,
      difficulty: 0,
      elapsed_days: 0,
      scheduled_days: 0,
      reps: 0,
      lapses: 0,
      learning_steps: 0,
      state: State.New,
      last_review: void 0
    };
    if (afterHandler && typeof afterHandler === "function") {
      return afterHandler(emptyCard);
    } else {
      return emptyCard;
    }
  }
  var computeDecayFactor = (decayOrParams) => {
    const decay = typeof decayOrParams === "number" ? -decayOrParams : -decayOrParams[20];
    const factor = Math.exp(Math.pow(decay, -1) * Math.log(0.9)) - 1;
    return { decay, factor: roundTo(factor, 8) };
  };
  function forgetting_curve(decayOrParams, elapsed_days, stability) {
    const { decay, factor } = computeDecayFactor(decayOrParams);
    return roundTo(Math.pow(1 + factor * elapsed_days / stability, decay), 8);
  }
  var FSRSAlgorithm = class {
    param;
    intervalModifier;
    _seed;
    constructor(params) {
      this.param = new Proxy(
        this.prepare_parameters(params),
        this.params_handler_proxy()
      );
      this.intervalModifier = this.calculate_interval_modifier(
        this.param.request_retention
      );
      this.forgetting_curve = forgetting_curve.bind(this, this.param.w);
    }
    get interval_modifier() {
      return this.intervalModifier;
    }
    set seed(seed) {
      this._seed = seed;
    }
    /**
     * @see https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm#fsrs-5
     *
     * The formula used is: $$I(r,s) = (r^{\frac{1}{DECAY}} - 1) / FACTOR \times s$$
     * @param request_retention 0<request_retention<=1,Requested retention rate
     * @throws {Error} Requested retention rate should be in the range (0,1]
     */
    calculate_interval_modifier(request_retention) {
      if (request_retention <= 0 || request_retention > 1) {
        throw new FSRSValidationError(
          "Requested retention rate should be in the range (0,1]"
        );
      }
      const { decay, factor } = computeDecayFactor(this.param.w);
      return roundTo((Math.pow(request_retention, 1 / decay) - 1) / factor, 8);
    }
    /**
     * Get the parameters of the algorithm.
     */
    get parameters() {
      return this.param;
    }
    /**
     * Set the parameters of the algorithm.
     * @param params Partial<FSRSParameters>
     */
    set parameters(params) {
      this.update_parameters(params);
    }
    params_handler_proxy() {
      const _this = this;
      return {
        set: function(target, prop, value) {
          if (prop === "request_retention" && Number.isFinite(value)) {
            _this.intervalModifier = _this.calculate_interval_modifier(
              Number(value)
            );
          } else if (prop === "w") {
            value = migrateParameters(
              value,
              target.relearning_steps.length,
              target.enable_short_term
            );
            value = clipParameters(
              Array.from(value),
              target.relearning_steps.length,
              target.enable_short_term
            );
            _this.forgetting_curve = forgetting_curve.bind(this, value);
            _this.intervalModifier = _this.calculate_interval_modifier(
              Number(target.request_retention)
            );
          }
          Reflect.set(target, prop, value);
          return true;
        }
      };
    }
    update_parameters(params) {
      const _params = this.prepare_parameters(params);
      for (const key in _params) {
        const paramKey = key;
        this.param[paramKey] = _params[paramKey];
      }
    }
    prepare_parameters = (params) => {
      const generated = generatorParameters(params);
      generated.w = clipParameters(
        Array.from(generated.w),
        generated.relearning_steps.length,
        generated.enable_short_term
      );
      return generated;
    };
    /**
       * The formula used is :
       * $$ S_0(G) = w_{G-1}$$
       * $$S_0 = \max \lbrace S_0,0.1\rbrace $$
    
       * @param g Grade (rating at Anki) [1.again,2.hard,3.good,4.easy]
       * @return Stability (interval when R=90%)
       */
    init_stability(g) {
      return Math.max(this.param.w[g - 1], 0.1);
    }
    /**
     * The formula used is :
     * $$D_0(G) = w_4 - e^{(G-1) \cdot w_5} + 1 $$
     * $$D_0 = \min \lbrace \max \lbrace D_0(G),1 \rbrace,10 \rbrace$$
     * where the $$D_0(1)=w_4$$ when the first rating is good.
     *
     * @param {Grade} g Grade (rating at Anki) [1.again,2.hard,3.good,4.easy]
     * @return {number} Difficulty $$D \in [1,10]$$
     */
    init_difficulty(g) {
      const w = this.param.w;
      const d = w[4] - Math.exp((g - 1) * w[5]) + 1;
      return roundTo(d, 8);
    }
    /**
     * If fuzzing is disabled or ivl is less than 2.5, it returns the original interval.
     * @param {number} ivl - The interval to be fuzzed.
     * @param {number} elapsed_days t days since the last review
     * @return {number} - The fuzzed interval.
     **/
    apply_fuzz(ivl, elapsed_days) {
      if (!this.param.enable_fuzz || ivl < 2.5) return Math.round(ivl);
      const generator = alea(this._seed);
      const fuzz_factor = generator();
      const { min_ivl, max_ivl } = get_fuzz_range(
        ivl,
        elapsed_days,
        this.param.maximum_interval
      );
      return Math.floor(fuzz_factor * (max_ivl - min_ivl + 1) + min_ivl);
    }
    /**
     *   @see The formula used is : {@link FSRSAlgorithm.calculate_interval_modifier}
     *   @param {number} s - Stability (interval when R=90%)
     *   @param {number} elapsed_days t days since the last review
     */
    next_interval(s, elapsed_days) {
      const newInterval = Math.min(
        Math.max(1, Math.round(s * this.intervalModifier)),
        this.param.maximum_interval
      );
      return this.apply_fuzz(newInterval, elapsed_days);
    }
    /**
     * @see https://github.com/open-spaced-repetition/fsrs4anki/issues/697
     */
    linear_damping(delta_d, old_d) {
      return roundTo(delta_d * (10 - old_d) / 9, 8);
    }
    /**
     * The formula used is :
     * $$\text{delta}_d = -w_6 \cdot (g - 3)$$
     * $$\text{next}_d = D + \text{linear damping}(\text{delta}_d , D)$$
     * $$D^\prime(D,R) = w_7 \cdot D_0(4) +(1 - w_7) \cdot \text{next}_d$$
     * @param {number} d Difficulty $$D \in [1,10]$$
     * @param {Grade} g Grade (rating at Anki) [1.again,2.hard,3.good,4.easy]
     * @return {number} $$\text{next}_D$$
     */
    next_difficulty(d, g) {
      const delta_d = -this.param.w[6] * (g - 3);
      const next_d = d + this.linear_damping(delta_d, d);
      return clamp(
        this.mean_reversion(this.init_difficulty(Rating.Easy), next_d),
        1,
        10
      );
    }
    /**
     * The formula used is :
     * $$w_7 \cdot \text{init} +(1 - w_7) \cdot \text{current}$$
     * @param {number} init $$w_2 : D_0(3) = w_2 + (R-2) \cdot w_3= w_2$$
     * @param {number} current $$D - w_6 \cdot (R - 2)$$
     * @return {number} difficulty
     */
    mean_reversion(init, current) {
      const w = this.param.w;
      return roundTo(w[7] * init + (1 - w[7]) * current, 8);
    }
    /**
     * The formula used is :
     * $$S^\prime_r(D,S,R,G) = S\cdot(e^{w_8}\cdot (11-D)\cdot S^{-w_9}\cdot(e^{w_{10}\cdot(1-R)}-1)\cdot w_{15}(\text{if} G=2) \cdot w_{16}(\text{if} G=4)+1)$$
     * @param {number} d Difficulty D \in [1,10]
     * @param {number} s Stability (interval when R=90%)
     * @param {number} r Retrievability (probability of recall)
     * @param {Grade} g Grade (Rating[0.again,1.hard,2.good,3.easy])
     * @return {number} S^\prime_r new stability after recall
     */
    next_recall_stability(d, s, r, g) {
      const w = this.param.w;
      const hard_penalty = Rating.Hard === g ? w[15] : 1;
      const easy_bound = Rating.Easy === g ? w[16] : 1;
      return roundTo(
        clamp(
          s * (1 + Math.exp(w[8]) * (11 - d) * Math.pow(s, -w[9]) * (Math.exp((1 - r) * w[10]) - 1) * hard_penalty * easy_bound),
          S_MIN,
          36500
        ),
        8
      );
    }
    /**
     * The formula used is :
     * $$S^\prime_f(D,S,R) = w_{11}\cdot D^{-w_{12}}\cdot ((S+1)^{w_{13}}-1) \cdot e^{w_{14}\cdot(1-R)}$$
     * enable_short_term = true : $$S^\prime_f \in \min \lbrace \max \lbrace S^\prime_f,0.01\rbrace, \frac{S}{e^{w_{17} \cdot w_{18}}} \rbrace$$
     * enable_short_term = false : $$S^\prime_f \in \min \lbrace \max \lbrace S^\prime_f,0.01\rbrace, S \rbrace$$
     * @param {number} d Difficulty D \in [1,10]
     * @param {number} s Stability (interval when R=90%)
     * @param {number} r Retrievability (probability of recall)
     * @return {number} S^\prime_f new stability after forgetting
     */
    next_forget_stability(d, s, r) {
      const w = this.param.w;
      return roundTo(
        clamp(
          w[11] * Math.pow(d, -w[12]) * (Math.pow(s + 1, w[13]) - 1) * Math.exp((1 - r) * w[14]),
          S_MIN,
          36500
        ),
        8
      );
    }
    /**
     * The formula used is :
     * $$S^\prime_s(S,G) = S \cdot e^{w_{17} \cdot (G-3+w_{18})}$$
     * @param {number} s Stability (interval when R=90%)
     * @param {Grade} g Grade (Rating[0.again,1.hard,2.good,3.easy])
     */
    next_short_term_stability(s, g) {
      const w = this.param.w;
      const sinc = Math.pow(s, -w[19]) * Math.exp(w[17] * (g - 3 + w[18]));
      const maskedSinc = g >= Rating.Hard ? Math.max(sinc, 1) : sinc;
      return roundTo(clamp(s * maskedSinc, S_MIN, 36500), 8);
    }
    /**
     * The formula used is :
     * $$R(t,S) = (1 + \text{FACTOR} \times \frac{t}{9 \cdot S})^{\text{DECAY}}$$
     * @param {number} elapsed_days t days since the last review
     * @param {number} stability Stability (interval when R=90%)
     * @return {number} r Retrievability (probability of recall)
     */
    forgetting_curve;
    /**
     * Calculates the next state of memory based on the current state, time elapsed, and grade.
     *
     * @param memory_state - The current state of memory, which can be null.
     * @param t - The time elapsed since the last review.
     * @param {Rating} g Grade (Rating[0.Manual,1.Again,2.Hard,3.Good,4.Easy])
     * @param r - Optional retrievability value. If not provided, it will be calculated.
     * @returns The next state of memory with updated difficulty and stability.
     */
    next_state(memory_state, t, g, r) {
      const { difficulty: d, stability: s } = memory_state ?? {
        difficulty: 0,
        stability: 0
      };
      if (t < 0) {
        throw new FSRSValidationError(`Invalid delta_t "${t}"`);
      }
      if (g < 0 || g > 4) {
        throw new FSRSValidationError(`Invalid grade "${g}"`);
      }
      if (d === 0 && s === 0) {
        return {
          difficulty: clamp(this.init_difficulty(g), 1, 10),
          stability: this.init_stability(g)
        };
      }
      if (g === 0) {
        return {
          difficulty: d,
          stability: s
        };
      }
      if (d < 1 || s < S_MIN) {
        throw new FSRSValidationError(
          `Invalid memory state { difficulty: ${d}, stability: ${s} }`
        );
      }
      const w = this.param.w;
      r = typeof r === "number" ? r : this.forgetting_curve(t, s);
      let new_s;
      if (t === 0 && this.param.enable_short_term) {
        new_s = this.next_short_term_stability(s, g);
      } else if (g === 1) {
        const s_after_fail = this.next_forget_stability(d, s, r);
        let [w_17, w_18] = [0, 0];
        if (this.param.enable_short_term) {
          w_17 = w[17];
          w_18 = w[18];
        }
        const next_s_min = s / Math.exp(w_17 * w_18);
        new_s = clamp(roundTo(next_s_min, 8), S_MIN, s_after_fail);
      } else {
        new_s = this.next_recall_stability(d, s, r, g);
      }
      const new_d = this.next_difficulty(d, g);
      return { difficulty: new_d, stability: new_s };
    }
  };
  var BasicScheduler = class extends AbstractScheduler {
    learningStepsStrategy;
    constructor(card, now, algorithm, strategies) {
      super(card, now, algorithm, strategies);
      let learningStepStrategy = BasicLearningStepsStrategy;
      if (this.strategies) {
        const custom_strategy = this.strategies.get(StrategyMode.LEARNING_STEPS);
        if (custom_strategy) {
          learningStepStrategy = custom_strategy;
        }
      }
      this.learningStepsStrategy = learningStepStrategy;
    }
    getLearningInfo(card, grade) {
      const parameters = this.algorithm.parameters;
      card.learning_steps = card.learning_steps || 0;
      const steps_strategy = this.learningStepsStrategy(
        parameters,
        card.state,
        card.learning_steps
      );
      const scheduled_minutes = Math.max(
        0,
        steps_strategy[grade]?.scheduled_minutes ?? 0
      );
      const next_steps = Math.max(0, steps_strategy[grade]?.next_step ?? 0);
      return {
        scheduled_minutes,
        next_steps
      };
    }
    /**
     * @description This function applies the learning steps based on the current card's state and grade.
     */
    applyLearningSteps(nextCard, grade, to_state) {
      const { scheduled_minutes, next_steps } = this.getLearningInfo(
        this.current,
        grade
      );
      if (scheduled_minutes > 0 && scheduled_minutes < 1440) {
        nextCard.learning_steps = next_steps;
        nextCard.scheduled_days = 0;
        nextCard.state = to_state;
        nextCard.due = date_scheduler(
          this.review_time,
          Math.round(scheduled_minutes),
          false
          /** true:days false: minute */
        );
      } else {
        nextCard.state = State.Review;
        if (scheduled_minutes >= 1440) {
          nextCard.learning_steps = next_steps;
          nextCard.due = date_scheduler(
            this.review_time,
            Math.round(scheduled_minutes),
            false
            /** true:days false: minute */
          );
          nextCard.scheduled_days = Math.floor(scheduled_minutes / 1440);
        } else {
          nextCard.learning_steps = 0;
          const interval = this.algorithm.next_interval(
            nextCard.stability,
            this.elapsed_days
          );
          nextCard.scheduled_days = interval;
          nextCard.due = date_scheduler(this.review_time, interval, true);
        }
      }
    }
    newState(grade) {
      const exist = this.next.get(grade);
      if (exist) {
        return exist;
      }
      const next = this.next_ds(this.elapsed_days, grade);
      this.applyLearningSteps(next, grade, State.Learning);
      const item = {
        card: next,
        log: this.buildLog(grade)
      };
      this.next.set(grade, item);
      return item;
    }
    learningState(grade) {
      const exist = this.next.get(grade);
      if (exist) {
        return exist;
      }
      const next = this.next_ds(this.elapsed_days, grade);
      this.applyLearningSteps(
        next,
        grade,
        this.last.state
        /** Learning or Relearning */
      );
      const item = {
        card: next,
        log: this.buildLog(grade)
      };
      this.next.set(grade, item);
      return item;
    }
    reviewState(grade) {
      const exist = this.next.get(grade);
      if (exist) {
        return exist;
      }
      const interval = this.elapsed_days;
      const retrievability = this.algorithm.forgetting_curve(
        interval,
        this.current.stability
      );
      const next_again = this.next_ds(interval, Rating.Again, retrievability);
      const next_hard = this.next_ds(interval, Rating.Hard, retrievability);
      const next_good = this.next_ds(interval, Rating.Good, retrievability);
      const next_easy = this.next_ds(interval, Rating.Easy, retrievability);
      this.next_interval(next_hard, next_good, next_easy, interval);
      this.next_state(next_hard, next_good, next_easy);
      this.applyLearningSteps(next_again, Rating.Again, State.Relearning);
      next_again.lapses += 1;
      const item_again = {
        card: next_again,
        log: this.buildLog(Rating.Again)
      };
      const item_hard = {
        card: next_hard,
        log: super.buildLog(Rating.Hard)
      };
      const item_good = {
        card: next_good,
        log: super.buildLog(Rating.Good)
      };
      const item_easy = {
        card: next_easy,
        log: super.buildLog(Rating.Easy)
      };
      this.next.set(Rating.Again, item_again);
      this.next.set(Rating.Hard, item_hard);
      this.next.set(Rating.Good, item_good);
      this.next.set(Rating.Easy, item_easy);
      return this.next.get(grade);
    }
    /**
     * Review next_ds
     */
    next_ds(t, g, r) {
      const next_state = this.algorithm.next_state(
        {
          difficulty: this.current.difficulty,
          stability: this.current.stability
        },
        t,
        g,
        r
      );
      const card = TypeConvert.card(this.current);
      card.difficulty = next_state.difficulty;
      card.stability = next_state.stability;
      return card;
    }
    /**
     * Review next_interval
     */
    next_interval(next_hard, next_good, next_easy, interval) {
      let hard_interval, good_interval;
      hard_interval = this.algorithm.next_interval(next_hard.stability, interval);
      good_interval = this.algorithm.next_interval(next_good.stability, interval);
      hard_interval = Math.min(hard_interval, good_interval);
      good_interval = Math.max(good_interval, hard_interval + 1);
      const easy_interval = Math.max(
        this.algorithm.next_interval(next_easy.stability, interval),
        good_interval + 1
      );
      next_hard.scheduled_days = hard_interval;
      next_hard.due = date_scheduler(this.review_time, hard_interval, true);
      next_good.scheduled_days = good_interval;
      next_good.due = date_scheduler(this.review_time, good_interval, true);
      next_easy.scheduled_days = easy_interval;
      next_easy.due = date_scheduler(this.review_time, easy_interval, true);
    }
    /**
     * Review next_state
     */
    next_state(next_hard, next_good, next_easy) {
      next_hard.state = State.Review;
      next_hard.learning_steps = 0;
      next_good.state = State.Review;
      next_good.learning_steps = 0;
      next_easy.state = State.Review;
      next_easy.learning_steps = 0;
    }
  };
  var LongTermScheduler = class extends AbstractScheduler {
    newState(grade) {
      const exist = this.next.get(grade);
      if (exist) {
        return exist;
      }
      this.current.scheduled_days = 0;
      this.current.elapsed_days = 0;
      const first_interval = 0;
      const next_again = this.next_ds(first_interval, Rating.Again);
      const next_hard = this.next_ds(first_interval, Rating.Hard);
      const next_good = this.next_ds(first_interval, Rating.Good);
      const next_easy = this.next_ds(first_interval, Rating.Easy);
      this.next_interval(
        next_again,
        next_hard,
        next_good,
        next_easy,
        first_interval
      );
      this.next_state(next_again, next_hard, next_good, next_easy);
      this.update_next(next_again, next_hard, next_good, next_easy);
      return this.next.get(grade);
    }
    next_ds(t, g, r) {
      const next_state = this.algorithm.next_state(
        {
          difficulty: this.current.difficulty,
          stability: this.current.stability
        },
        t,
        g,
        r
      );
      const card = TypeConvert.card(this.current);
      card.difficulty = next_state.difficulty;
      card.stability = next_state.stability;
      return card;
    }
    /**
     * @see https://github.com/open-spaced-repetition/ts-fsrs/issues/98#issuecomment-2241923194
     */
    learningState(grade) {
      return this.reviewState(grade);
    }
    reviewState(grade) {
      const exist = this.next.get(grade);
      if (exist) {
        return exist;
      }
      const interval = this.elapsed_days;
      const retrievability = this.algorithm.forgetting_curve(
        interval,
        this.current.stability
      );
      const next_again = this.next_ds(interval, Rating.Again, retrievability);
      const next_hard = this.next_ds(interval, Rating.Hard, retrievability);
      const next_good = this.next_ds(interval, Rating.Good, retrievability);
      const next_easy = this.next_ds(interval, Rating.Easy, retrievability);
      this.next_interval(next_again, next_hard, next_good, next_easy, interval);
      this.next_state(next_again, next_hard, next_good, next_easy);
      next_again.lapses += 1;
      this.update_next(next_again, next_hard, next_good, next_easy);
      return this.next.get(grade);
    }
    /**
     * Review/New next_interval
     */
    next_interval(next_again, next_hard, next_good, next_easy, interval) {
      let again_interval, hard_interval, good_interval, easy_interval;
      again_interval = this.algorithm.next_interval(
        next_again.stability,
        interval
      );
      hard_interval = this.algorithm.next_interval(next_hard.stability, interval);
      good_interval = this.algorithm.next_interval(next_good.stability, interval);
      easy_interval = this.algorithm.next_interval(next_easy.stability, interval);
      again_interval = Math.min(again_interval, hard_interval);
      hard_interval = Math.max(hard_interval, again_interval + 1);
      good_interval = Math.max(good_interval, hard_interval + 1);
      easy_interval = Math.max(easy_interval, good_interval + 1);
      next_again.scheduled_days = again_interval;
      next_again.due = date_scheduler(this.review_time, again_interval, true);
      next_hard.scheduled_days = hard_interval;
      next_hard.due = date_scheduler(this.review_time, hard_interval, true);
      next_good.scheduled_days = good_interval;
      next_good.due = date_scheduler(this.review_time, good_interval, true);
      next_easy.scheduled_days = easy_interval;
      next_easy.due = date_scheduler(this.review_time, easy_interval, true);
    }
    /**
     * Review/New next_state
     */
    next_state(next_again, next_hard, next_good, next_easy) {
      next_again.state = State.Review;
      next_again.learning_steps = 0;
      next_hard.state = State.Review;
      next_hard.learning_steps = 0;
      next_good.state = State.Review;
      next_good.learning_steps = 0;
      next_easy.state = State.Review;
      next_easy.learning_steps = 0;
    }
    update_next(next_again, next_hard, next_good, next_easy) {
      const item_again = {
        card: next_again,
        log: this.buildLog(Rating.Again)
      };
      const item_hard = {
        card: next_hard,
        log: super.buildLog(Rating.Hard)
      };
      const item_good = {
        card: next_good,
        log: super.buildLog(Rating.Good)
      };
      const item_easy = {
        card: next_easy,
        log: super.buildLog(Rating.Easy)
      };
      this.next.set(Rating.Again, item_again);
      this.next.set(Rating.Hard, item_hard);
      this.next.set(Rating.Good, item_good);
      this.next.set(Rating.Easy, item_easy);
    }
  };
  var Reschedule = class {
    fsrs;
    /**
     * Creates an instance of the `Reschedule` class.
     * @param fsrs - An instance of the FSRS class used for scheduling.
     */
    constructor(fsrs2) {
      this.fsrs = fsrs2;
    }
    /**
     * Replays a review for a card and determines the next review date based on the given rating.
     * @param card - The card being reviewed.
     * @param reviewed - The date the card was reviewed.
     * @param rating - The grade given to the card during the review.
     * @returns A `RecordLogItem` containing the updated card and review log.
     */
    replay(card, reviewed, rating) {
      return this.fsrs.next(card, reviewed, rating);
    }
    /**
     * Processes a manual review for a card, allowing for custom state, stability, difficulty, and due date.
     * @param card - The card being reviewed.
     * @param state - The state of the card after the review.
     * @param reviewed - The date the card was reviewed.
     * @param elapsed_days - The number of days since the last review.
     * @param stability - (Optional) The stability of the card.
     * @param difficulty - (Optional) The difficulty of the card.
     * @param due - (Optional) The due date for the next review.
     * @returns A `RecordLogItem` containing the updated card and review log.
     * @throws Will throw an error if the state or due date is not provided when required.
     */
    handleManualRating(card, state, reviewed, elapsed_days, stability, difficulty, due) {
      if (typeof state === "undefined") {
        throw new FSRSValidationError(
          "reschedule: state is required for manual rating"
        );
      }
      let log;
      let next_card;
      if (state === State.New) {
        log = {
          rating: Rating.Manual,
          state,
          due: due ?? reviewed,
          stability: card.stability,
          difficulty: card.difficulty,
          elapsed_days,
          last_elapsed_days: card.elapsed_days,
          scheduled_days: card.scheduled_days,
          learning_steps: card.learning_steps,
          review: reviewed
        };
        next_card = createEmptyCard(reviewed);
        next_card.last_review = reviewed;
      } else {
        if (typeof due === "undefined") {
          throw new FSRSValidationError(
            "reschedule: due is required for manual rating"
          );
        }
        const scheduled_days = date_diff(due, reviewed, "days");
        log = {
          rating: Rating.Manual,
          state: card.state,
          due: card.last_review || card.due,
          stability: card.stability,
          difficulty: card.difficulty,
          elapsed_days,
          last_elapsed_days: card.elapsed_days,
          scheduled_days: card.scheduled_days,
          learning_steps: card.learning_steps,
          review: reviewed
        };
        next_card = {
          ...card,
          state,
          due,
          last_review: reviewed,
          stability: stability || card.stability,
          difficulty: difficulty || card.difficulty,
          elapsed_days,
          scheduled_days,
          reps: card.reps + 1
        };
      }
      return { card: next_card, log };
    }
    /**
     * Reschedules a card based on its review history.
     *
     * @param current_card - The card to be rescheduled.
     * @param reviews - An array of review history objects.
     * @returns An array of record log items representing the rescheduling process.
     */
    reschedule(current_card, reviews) {
      const collections = [];
      let cur_card = createEmptyCard(current_card.due);
      for (const review of reviews) {
        let item;
        review.review = TypeConvert.time(review.review);
        if (review.rating === Rating.Manual) {
          let interval = 0;
          if (cur_card.state !== State.New && cur_card.last_review) {
            interval = date_diff(review.review, cur_card.last_review, "days");
          }
          item = this.handleManualRating(
            cur_card,
            review.state,
            review.review,
            interval,
            review.stability,
            review.difficulty,
            review.due ? TypeConvert.time(review.due) : void 0
          );
        } else {
          item = this.replay(cur_card, review.review, review.rating);
        }
        collections.push(item);
        cur_card = item.card;
      }
      return collections;
    }
    calculateManualRecord(current_card, now, record_log_item, update_memory) {
      if (!record_log_item) {
        return null;
      }
      const { card: reschedule_card, log } = record_log_item;
      const cur_card = TypeConvert.card(current_card);
      if (cur_card.due.getTime() === reschedule_card.due.getTime()) {
        return null;
      }
      cur_card.scheduled_days = date_diff(
        reschedule_card.due,
        cur_card.due,
        "days"
      );
      return this.handleManualRating(
        cur_card,
        reschedule_card.state,
        TypeConvert.time(now),
        log.elapsed_days,
        update_memory ? reschedule_card.stability : void 0,
        update_memory ? reschedule_card.difficulty : void 0,
        reschedule_card.due
      );
    }
  };
  function applyAfterHandler(value, afterHandler) {
    return typeof afterHandler === "function" ? afterHandler(value) : value;
  }
  var FSRS = class extends FSRSAlgorithm {
    strategyHandler = /* @__PURE__ */ new Map();
    Scheduler;
    constructor(param) {
      super(param);
      const { enable_short_term } = this.parameters;
      this.Scheduler = enable_short_term ? BasicScheduler : LongTermScheduler;
    }
    params_handler_proxy() {
      const _this = this;
      return {
        set: function(target, prop, value) {
          if (prop === "request_retention" && Number.isFinite(value)) {
            _this.intervalModifier = _this.calculate_interval_modifier(
              Number(value)
            );
          } else if (prop === "enable_short_term") {
            _this.Scheduler = value === true ? BasicScheduler : LongTermScheduler;
          } else if (prop === "w") {
            value = migrateParameters(
              value,
              target.relearning_steps.length,
              target.enable_short_term
            );
            value = clipParameters(
              Array.from(value),
              target.relearning_steps.length,
              target.enable_short_term
            );
            _this.forgetting_curve = forgetting_curve.bind(this, value);
            _this.intervalModifier = _this.calculate_interval_modifier(
              Number(target.request_retention)
            );
          }
          Reflect.set(target, prop, value);
          return true;
        }
      };
    }
    useStrategy(mode, handler) {
      this.strategyHandler.set(mode, handler);
      return this;
    }
    clearStrategy(mode) {
      if (mode) {
        this.strategyHandler.delete(mode);
      } else {
        this.strategyHandler.clear();
      }
      return this;
    }
    getScheduler(card, now) {
      const schedulerStrategy = this.strategyHandler.get(
        StrategyMode.SCHEDULER
      );
      const Scheduler = schedulerStrategy || this.Scheduler;
      const instance = new Scheduler(card, now, this, this.strategyHandler);
      return instance;
    }
    /**
     * Display the collection of cards and logs for the four scenarios after scheduling the card at the current time.
     * @param card Card to be processed
     * @param now Current time or scheduled time
     * @param afterHandler Convert the result to another type. (Optional)
     * @example
     * ```typescript
     * const card: Card = createEmptyCard(new Date());
     * const f = fsrs();
     * const recordLog = f.repeat(card, new Date());
     * ```
     * @example
     * ```typescript
     * interface RevLogUnchecked
     *   extends Omit<ReviewLog, "due" | "review" | "state" | "rating"> {
     *   cid: string;
     *   due: Date | number;
     *   state: StateType;
     *   review: Date | number;
     *   rating: RatingType;
     * }
     *
     * interface RepeatRecordLog {
     *   card: CardUnChecked; //see method: createEmptyCard
     *   log: RevLogUnchecked;
     * }
     *
     * function repeatAfterHandler(recordLog: RecordLog) {
     *     const record: { [key in Grade]: RepeatRecordLog } = {} as {
     *       [key in Grade]: RepeatRecordLog;
     *     };
     *     for (const grade of Grades) {
     *       record[grade] = {
     *         card: {
     *           ...(recordLog[grade].card as Card & { cid: string }),
     *           due: recordLog[grade].card.due.getTime(),
     *           state: State[recordLog[grade].card.state] as StateType,
     *           last_review: recordLog[grade].card.last_review
     *             ? recordLog[grade].card.last_review!.getTime()
     *             : null,
     *         },
     *         log: {
     *           ...recordLog[grade].log,
     *           cid: (recordLog[grade].card as Card & { cid: string }).cid,
     *           due: recordLog[grade].log.due.getTime(),
     *           review: recordLog[grade].log.review.getTime(),
     *           state: State[recordLog[grade].log.state] as StateType,
     *           rating: Rating[recordLog[grade].log.rating] as RatingType,
     *         },
     *       };
     *     }
     *     return record;
     * }
     * const card: Card = createEmptyCard(new Date(), cardAfterHandler); //see method:  createEmptyCard
     * const f = fsrs();
     * const recordLog = f.repeat(card, new Date(), repeatAfterHandler);
     * ```
     */
    repeat(card, now, afterHandler) {
      const instance = this.getScheduler(card, now);
      const recordLog = instance.preview();
      return applyAfterHandler(recordLog, afterHandler);
    }
    /**
     * Display the collection of cards and logs for the card scheduled at the current time, after applying a specific grade rating.
     * @param card Card to be processed
     * @param now Current time or scheduled time
     * @param grade Rating of the review (Again, Hard, Good, Easy)
     * @param afterHandler Convert the result to another type. (Optional)
     * @example
     * ```typescript
     * const card: Card = createEmptyCard(new Date());
     * const f = fsrs();
     * const recordLogItem = f.next(card, new Date(), Rating.Again);
     * ```
     * @example
     * ```typescript
     * interface RevLogUnchecked
     *   extends Omit<ReviewLog, "due" | "review" | "state" | "rating"> {
     *   cid: string;
     *   due: Date | number;
     *   state: StateType;
     *   review: Date | number;
     *   rating: RatingType;
     * }
     *
     * interface NextRecordLog {
     *   card: CardUnChecked; //see method: createEmptyCard
     *   log: RevLogUnchecked;
     * }
     *
    function nextAfterHandler(recordLogItem: RecordLogItem) {
      const recordItem = {
        card: {
          ...(recordLogItem.card as Card & { cid: string }),
          due: recordLogItem.card.due.getTime(),
          state: State[recordLogItem.card.state] as StateType,
          last_review: recordLogItem.card.last_review
            ? recordLogItem.card.last_review!.getTime()
            : null,
        },
        log: {
          ...recordLogItem.log,
          cid: (recordLogItem.card as Card & { cid: string }).cid,
          due: recordLogItem.log.due.getTime(),
          review: recordLogItem.log.review.getTime(),
          state: State[recordLogItem.log.state] as StateType,
          rating: Rating[recordLogItem.log.rating] as RatingType,
        },
      };
      return recordItem
    }
     * const card: Card = createEmptyCard(new Date(), cardAfterHandler); //see method:  createEmptyCard
     * const f = fsrs();
     * const recordLogItem = f.repeat(card, new Date(), Rating.Again, nextAfterHandler);
     * ```
     */
    next(card, now, grade, afterHandler) {
      const instance = this.getScheduler(card, now);
      const g = TypeConvert.rating(grade);
      if (g === Rating.Manual) {
        throw new FSRSValidationError("Cannot review a manual rating");
      }
      const recordLogItem = instance.review(g);
      return applyAfterHandler(recordLogItem, afterHandler);
    }
    /**
     * Get the retrievability of the card
     * @param card  Card to be processed
     * @param now  Current time or scheduled time
     * @param format  default:true , Convert the result to another type. (Optional)
     * @returns  The retrievability of the card,if format is true, the result is a string, otherwise it is a number
     */
    get_retrievability(card, now, format = true) {
      const processedCard = TypeConvert.card(card);
      now = now ? TypeConvert.time(now) : /* @__PURE__ */ new Date();
      const t = processedCard.state !== State.New ? Math.max(date_diff(now, processedCard.last_review, "days"), 0) : 0;
      const r = processedCard.state !== State.New ? this.forgetting_curve(t, +processedCard.stability.toFixed(8)) : 0;
      return format ? `${(r * 100).toFixed(2)}%` : r;
    }
    /**
     *
     * @param card Card to be processed
     * @param log last review log
     * @param afterHandler Convert the result to another type. (Optional)
     * @example
     * ```typescript
     * const now = new Date();
     * const f = fsrs();
     * const emptyCardFormAfterHandler = createEmptyCard(now);
     * const repeatFormAfterHandler = f.repeat(emptyCardFormAfterHandler, now);
     * const { card, log } = repeatFormAfterHandler[Rating.Hard];
     * const rollbackFromAfterHandler = f.rollback(card, log);
     * ```
     *
     * @example
     * ```typescript
     * const now = new Date();
     * const f = fsrs();
     * const emptyCardFormAfterHandler = createEmptyCard(now, cardAfterHandler);  //see method: createEmptyCard
     * const repeatFormAfterHandler = f.repeat(emptyCardFormAfterHandler, now, repeatAfterHandler); //see method: fsrs.repeat()
     * const { card, log } = repeatFormAfterHandler[Rating.Hard];
     * const rollbackFromAfterHandler = f.rollback(card, log, cardAfterHandler);
     * ```
     */
    rollback(card, log, afterHandler) {
      const processedCard = TypeConvert.card(card);
      const processedLog = TypeConvert.review_log(log);
      if (processedLog.rating === Rating.Manual) {
        throw new FSRSValidationError("Cannot rollback a manual rating");
      }
      let last_due;
      let last_review;
      let last_lapses;
      switch (processedLog.state) {
        case State.New:
          last_due = processedLog.due;
          last_review = void 0;
          last_lapses = 0;
          break;
        case State.Learning:
        case State.Relearning:
        case State.Review:
          last_due = processedLog.review;
          last_review = processedLog.due;
          last_lapses = processedCard.lapses - (processedLog.rating === Rating.Again && processedLog.state === State.Review ? 1 : 0);
          break;
      }
      const prevCard = {
        ...processedCard,
        due: last_due,
        stability: processedLog.stability,
        difficulty: processedLog.difficulty,
        elapsed_days: processedLog.last_elapsed_days,
        scheduled_days: processedLog.scheduled_days,
        reps: Math.max(0, processedCard.reps - 1),
        lapses: Math.max(0, last_lapses),
        learning_steps: processedLog.learning_steps,
        state: processedLog.state,
        last_review
      };
      return applyAfterHandler(prevCard, afterHandler);
    }
    /**
     *
     * @param card Card to be processed
     * @param now Current time or scheduled time
     * @param reset_count Should the review count information(reps,lapses) be reset. (Optional)
     * @param afterHandler Convert the result to another type. (Optional)
     * @example
     * ```typescript
     * const now = new Date();
     * const f = fsrs();
     * const emptyCard = createEmptyCard(now);
     * const scheduling_cards = f.repeat(emptyCard, now);
     * const { card, log } = scheduling_cards[Rating.Hard];
     * const forgetCard = f.forget(card, new Date(), true);
     * ```
     *
     * @example
     * ```typescript
     * interface RepeatRecordLog {
     *   card: CardUnChecked; //see method: createEmptyCard
     *   log: RevLogUnchecked; //see method: fsrs.repeat()
     * }
     *
     * function forgetAfterHandler(recordLogItem: RecordLogItem): RepeatRecordLog {
     *     return {
     *       card: {
     *         ...(recordLogItem.card as Card & { cid: string }),
     *         due: recordLogItem.card.due.getTime(),
     *         state: State[recordLogItem.card.state] as StateType,
     *         last_review: recordLogItem.card.last_review
     *           ? recordLogItem.card.last_review!.getTime()
     *           : null,
     *       },
     *       log: {
     *         ...recordLogItem.log,
     *         cid: (recordLogItem.card as Card & { cid: string }).cid,
     *         due: recordLogItem.log.due.getTime(),
     *         review: recordLogItem.log.review.getTime(),
     *         state: State[recordLogItem.log.state] as StateType,
     *         rating: Rating[recordLogItem.log.rating] as RatingType,
     *       },
     *     };
     * }
     * const now = new Date();
     * const f = fsrs();
     * const emptyCardFormAfterHandler = createEmptyCard(now, cardAfterHandler); //see method:  createEmptyCard
     * const repeatFormAfterHandler = f.repeat(emptyCardFormAfterHandler, now, repeatAfterHandler); //see method: fsrs.repeat()
     * const { card } = repeatFormAfterHandler[Rating.Hard];
     * const forgetFromAfterHandler = f.forget(card, date_scheduler(now, 1, true), false, forgetAfterHandler);
     * ```
     */
    forget(card, now, reset_count = false, afterHandler) {
      const processedCard = TypeConvert.card(card);
      now = TypeConvert.time(now);
      const scheduled_days = processedCard.state === State.New ? 0 : date_diff(now, processedCard.due, "days");
      const forget_log = {
        rating: Rating.Manual,
        state: processedCard.state,
        due: processedCard.due,
        stability: processedCard.stability,
        difficulty: processedCard.difficulty,
        elapsed_days: 0,
        last_elapsed_days: processedCard.elapsed_days,
        scheduled_days,
        learning_steps: processedCard.learning_steps,
        review: now
      };
      const forget_card = {
        ...processedCard,
        due: now,
        stability: 0,
        difficulty: 0,
        elapsed_days: 0,
        scheduled_days: 0,
        reps: reset_count ? 0 : processedCard.reps,
        lapses: reset_count ? 0 : processedCard.lapses,
        learning_steps: 0,
        state: State.New,
        last_review: processedCard.last_review
      };
      const recordLogItem = { card: forget_card, log: forget_log };
      return applyAfterHandler(recordLogItem, afterHandler);
    }
    /**
     * Reschedules the current card and returns the rescheduled collections and reschedule item.
     *
     * @template T - The type of the record log item.
     * @param {CardInput | Card} current_card - The current card to be rescheduled.
     * @param {Array<FSRSHistory>} reviews - The array of FSRSHistory objects representing the reviews.
     * @param {Partial<RescheduleOptions<T>>} options - The optional reschedule options.
     * @returns {IReschedule<T>} - The rescheduled collections and reschedule item.
     *
     * @example
     * ```typescript
     * const f = fsrs()
     * const grades: Grade[] = [Rating.Good, Rating.Good, Rating.Good, Rating.Good]
     * const reviews_at = [
     *   new Date(2024, 8, 13),
     *   new Date(2024, 8, 13),
     *   new Date(2024, 8, 17),
     *   new Date(2024, 8, 28),
     * ]
     *
     * const reviews: FSRSHistory[] = []
     * for (let i = 0; i < grades.length; i++) {
     *   reviews.push({
     *     rating: grades[i],
     *     review: reviews_at[i],
     *   })
     * }
     *
     * const results_short = scheduler.reschedule(
     *   createEmptyCard(),
     *   reviews,
     *   {
     *     skipManual: false,
     *   }
     * )
     * console.log(results_short)
     * ```
     */
    reschedule(current_card, reviews = [], options = {}) {
      const {
        recordLogHandler,
        reviewsOrderBy,
        skipManual = true,
        now = /* @__PURE__ */ new Date(),
        update_memory_state: updateMemoryState = false
      } = options;
      if (reviewsOrderBy && typeof reviewsOrderBy === "function") {
        reviews.sort(reviewsOrderBy);
      }
      if (skipManual) {
        reviews = reviews.filter((review) => review.rating !== Rating.Manual);
      }
      const rescheduleSvc = new Reschedule(this);
      const collections = rescheduleSvc.reschedule(
        options.first_card || createEmptyCard(),
        reviews
      );
      const len = collections.length;
      const cur_card = TypeConvert.card(current_card);
      const manual_item = rescheduleSvc.calculateManualRecord(
        cur_card,
        now,
        len ? collections[len - 1] : void 0,
        updateMemoryState
      );
      return {
        collections: typeof recordLogHandler === "function" ? collections.map(recordLogHandler) : collections,
        reschedule_item: manual_item ? applyAfterHandler(manual_item, recordLogHandler) : null
      };
    }
  };
  var fsrs = (params) => {
    return new FSRS(params || {});
  };

  // src/model.js
  var scheduler = fsrs();
  function hydrate(card) {
    return {
      ...card,
      due: new Date(card.due),
      ...card.last_review ? { last_review: new Date(card.last_review) } : {}
    };
  }

  // src/import-data.js
  var MAX_WORDS = 5e4;
  var dateOK = (v) => typeof v === "string" && Number.isFinite(Date.parse(v));
  function validateBackup(input) {
    if (input?.version !== 1 || !Array.isArray(input.lists) || !input.lists.length || !Array.isArray(input.words) || !Array.isArray(input.reviews))
      throw new Error(
        "Choose a abhyas - language learner JSON export (version 1)."
      );
    if (input.words.length > MAX_WORDS)
      throw new Error("Import up to 50,000 words at a time.");
    const listIds = /* @__PURE__ */ new Set(), wordIds = /* @__PURE__ */ new Set();
    for (const l of input.lists) {
      if (typeof l.id !== "string" || listIds.has(l.id) || typeof l.name !== "string" || !l.name.trim())
        throw new Error("Invalid or duplicate list in backup.");
      listIds.add(l.id);
    }
    for (const w of input.words) {
      if (typeof w.id !== "string" || wordIds.has(w.id) || !listIds.has(w.listId) || typeof w.word !== "string" || !w.word.trim() || typeof w.translation !== "string" || !w.translation.trim() || typeof w.details !== "string")
        throw new Error("Invalid word in backup.");
      wordIds.add(w.id);
      const c = w.card;
      if (!c || !dateOK(c.due) || ![0, 1, 2, 3].includes(c.state) || ![
        "stability",
        "difficulty",
        "elapsed_days",
        "scheduled_days",
        "reps",
        "lapses"
      ].every((k) => Number.isFinite(c[k]) && c[k] >= 0) || !Number.isInteger(c.reps) || !Number.isInteger(c.lapses) || c.last_review && !dateOK(c.last_review) || c.reps > 0 && !c.last_review)
        throw new Error("Invalid practice schedule in backup.");
      try {
        scheduler.repeat(hydrate(c), /* @__PURE__ */ new Date());
      } catch {
        throw new Error("Invalid FSRS card in backup.");
      }
    }
    for (const r of input.reviews) {
      if (!dateOK(r.at) || ![1, 2, 3, 4].includes(r.rating) || typeof r.wordId !== "string" || typeof r.listId !== "string")
        throw new Error("Invalid review history in backup.");
    }
    return input;
  }
  function parseDelimited(text, delimiter = ",") {
    const rows = [];
    let row = [], cell = "", quoted = false, closed = false;
    text = text.replace(/^\uFEFF/, "");
    for (let i2 = 0; i2 < text.length; i2++) {
      const c = text[i2];
      if (quoted) {
        if (c === '"') {
          if (text[i2 + 1] === '"') {
            cell += '"';
            i2++;
          } else {
            quoted = false;
            closed = true;
          }
        } else cell += c;
        continue;
      }
      if (c === '"' && !cell && !closed) {
        quoted = true;
        continue;
      }
      if (c === delimiter) {
        row.push(cell);
        cell = "";
        closed = false;
        continue;
      }
      if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i2 + 1] === "\n") i2++;
        row.push(cell);
        if (row.some((v) => v !== "")) rows.push(row);
        row = [];
        cell = "";
        closed = false;
        continue;
      }
      if (closed) throw new Error("Unexpected text after a quoted field.");
      cell += c;
    }
    if (quoted) throw new Error("Unclosed quote in import file.");
    row.push(cell);
    if (row.some((v) => v !== "")) rows.push(row);
    if (rows.length > MAX_WORDS + 1)
      throw new Error("Import up to 50,000 words at a time.");
    return rows;
  }
  function parseText(text, filename) {
    const csv = /\.csv$/i.test(filename);
    let fields, html = false, delimiter = csv ? "," : "	";
    text = text.replace(/^\uFEFF/, "");
    if (!csv) {
      const lines = text.split(/\r?\n/);
      while (lines[0]?.startsWith("#")) {
        const line = lines.shift();
        if (line.startsWith("#separator:")) {
          const value = line.slice(11).trim().toLowerCase();
          delimiter = { tab: "	", comma: ",", semicolon: ";", pipe: "|" }[value];
          if (!delimiter) throw new Error("Unsupported Anki separator.");
        }
        if (line.startsWith("#columns:")) fields = line.slice(9).split(delimiter);
        if (line.toLowerCase() === "#html:true") html = true;
      }
      text = lines.join("\n");
    }
    const rows = parseDelimited(text, delimiter);
    if (csv) fields = rows.shift();
    if (!fields)
      fields = Array.from(
        { length: Math.max(0, ...rows.map((r) => r.length)) },
        (_, i2) => ["Front", "Back"][i2] || `Field ${i2 + 1}`
      );
    if (!fields?.length || !rows.length)
      throw new Error("No words found in this file.");
    if (rows.some((r) => r.length !== fields.length))
      throw new Error(
        "Rows have different numbers of fields. Check the delimiter and header."
      );
    if (csv && fields.join("|") === "Word|English translation|Details|List") {
      for (const row of rows)
        for (let i2 = 0; i2 < row.length; i2++)
          if (/^'['=+@\-\t\r]/.test(row[i2])) row[i2] = row[i2].slice(1);
    }
    const listIndex = csv ? fields.indexOf("List") : -1, groups = /* @__PURE__ */ new Map();
    for (const values of rows) {
      const name = listIndex >= 0 ? values[listIndex] || "Imported words" : filename.replace(/\.[^.]+$/, "");
      if (!groups.has(name)) groups.set(name, { name, fields, rows: [], html });
      groups.get(name).rows.push(values);
    }
    return { groups: [...groups.values()] };
  }

  // src/apkg.js
  var MAX_FILE_BYTES = 128 * 1024 * 1024;
  var MAX_DB_BYTES = 128 * 1024 * 1024;
  function extractCollection(bytes) {
    if (bytes.length > MAX_FILE_BYTES)
      throw new Error("Choose an APKG smaller than 128 MB.");
    const entries = unzipSync(bytes, {
      filter: (entry) => {
        if (![
          "collection.anki21b",
          "collection.anki21",
          "collection.anki2"
        ].includes(entry.name))
          return false;
        if (entry.originalSize > MAX_DB_BYTES)
          throw new Error("Anki collection exceeds the 128 MB import limit.");
        return true;
      }
    });
    const name = [
      "collection.anki21b",
      "collection.anki21",
      "collection.anki2"
    ].find((n) => entries[n]);
    if (!name) throw new Error("This APKG contains no Anki collection.");
    let result = entries[name];
    if (name.endsWith("b")) {
      const chunks = [];
      let size = 0;
      const decoder = new Decompress((chunk) => {
        size += chunk.length;
        if (size > MAX_DB_BYTES)
          throw new Error("Decompressed Anki collection exceeds 128 MB.");
        chunks.push(chunk.slice());
      });
      decoder.push(result, true);
      result = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }
    }
    if (new TextDecoder().decode(result.subarray(0, 16)) !== "SQLite format 3\0")
      throw new Error("The Anki collection is not a supported SQLite database.");
    return result;
  }
  function readCollection(db) {
    const query = (sql) => db.exec(sql)[0]?.values || [];
    const tables = new Set(
      query("SELECT name FROM sqlite_master WHERE type='table'").map((r) => r[0])
    );
    if (!tables.has("notes") || !tables.has("cards"))
      throw new Error("Anki notes or cards are missing.");
    const models = /* @__PURE__ */ new Map(), decks = /* @__PURE__ */ new Map();
    if (tables.has("notetypes") && tables.has("fields")) {
      for (const [id, name] of query("SELECT id,name FROM notetypes"))
        models.set(String(id), { name, fields: [] });
      for (const [id, ord, name] of query(
        "SELECT ntid,ord,name FROM fields ORDER BY ntid,ord"
      )) {
        const model = models.get(String(id));
        if (model) model.fields[ord] = name;
      }
      for (const [id, name] of query("SELECT id,name FROM decks"))
        decks.set(String(id), name.replaceAll("", "::"));
    } else {
      const col = query("SELECT models,decks FROM col")[0];
      if (!col) throw new Error("Anki metadata is missing.");
      for (const [id, m] of Object.entries(JSON.parse(col[0])))
        models.set(id, {
          name: m.name,
          fields: [...m.flds].sort((a, b) => a.ord - b.ord).map((f) => f.name)
        });
      for (const [id, d] of Object.entries(JSON.parse(col[1])))
        decks.set(id, d.name);
    }
    const count = query("SELECT count(*) FROM notes")[0][0];
    if (count > MAX_WORDS)
      throw new Error(
        "Import up to 50,000 Anki notes at a time. Export a smaller deck from Anki."
      );
    const groups = /* @__PURE__ */ new Map();
    for (const [mid, did, flds] of query(
      "SELECT DISTINCT n.id,n.mid,CASE WHEN c.odid != 0 THEN c.odid ELSE c.did END,n.flds FROM notes n JOIN cards c ON c.nid=n.id ORDER BY n.id"
    ).map((r) => r.slice(1))) {
      const model = models.get(String(mid));
      if (!model) throw new Error("Anki note type metadata is missing.");
      const key = `${did}:${mid}`;
      if (!groups.has(key))
        groups.set(key, {
          name: `${decks.get(String(did)) || "Anki deck"} \xB7 ${model.name}`,
          fields: model.fields,
          rows: [],
          html: true
        });
      const values = flds.split("");
      if (values.length !== model.fields.length)
        throw new Error("Anki note fields do not match their note type.");
      groups.get(key).rows.push(values);
    }
    if (!groups.size) throw new Error("No notes found in this Anki deck.");
    return { groups: [...groups.values()] };
  }

  // src/import-worker.js
  self.onmessage = async ({ data: { buffer, name } }) => {
    try {
      let result;
      if (/\.apkg$/i.test(name)) {
        const SQL = await (0, import_sql_wasm_browser.default)({
          locateFile: (file) => new URL(file, self.location.href).href
        });
        const db = new SQL.Database(extractCollection(new Uint8Array(buffer)));
        try {
          result = readCollection(db);
        } finally {
          db.close();
        }
      } else {
        const text = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
        result = /\.json$/i.test(name) ? { backup: validateBackup(JSON.parse(text)) } : parseText(text, name);
      }
      self.postMessage({ result });
    } catch (error) {
      self.postMessage({ error: error.message || "Could not read this file." });
    }
  };
})();
/*! Bundled license information:

ts-fsrs/dist/index.mjs:
ts-fsrs/dist/index.mjs:
ts-fsrs/dist/index.mjs:
  (* istanbul ignore next -- @preserve *)
*/
