(() => {
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
    let i = 0;
    diff /= 1e3;
    for (i = 0; i < TIMEUNIT.length; i++) {
      if (diff < TIMEUNIT[i]) {
        break;
      } else {
        diff /= TIMEUNIT[i];
      }
    }
    return `${Math.floor(diff)}${unit ? timeUnit[i] : ""}`;
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
  function get_fuzz_range(interval2, elapsed_days, maximum_interval) {
    let delta = 1;
    for (const range of FUZZ_RANGES) {
      delta += range.factor * Math.max(Math.min(interval2, range.end) - range.start, 0);
    }
    interval2 = Math.min(interval2, maximum_interval);
    let min_ivl = Math.max(2, Math.round(interval2 - delta));
    const max_ivl = Math.min(Math.round(interval2 + delta), maximum_interval);
    if (interval2 > elapsed_days) {
      min_ivl = Math.max(min_ivl, elapsed_days + 1);
    }
    min_ivl = Math.min(min_ivl, max_ivl);
    return { min_ivl, max_ivl };
  }
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
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
  var BasicLearningStepsStrategy = (params2, state, cur_step) => {
    const learning_steps = state === State.Relearning || state === State.Review ? params2.relearning_steps : params2.learning_steps;
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
      let interval2 = 0;
      if (state !== State.New && last_review) {
        interval2 = dateDiffInDays(last_review, this.review_time);
      }
      this.current.last_review = this.review_time;
      this.elapsed_days = interval2;
      this.current.elapsed_days = interval2;
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
    return function mash(data2) {
      data2 = String(data2);
      for (let i = 0; i < data2.length; i++) {
        n += data2.charCodeAt(i);
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
      ([min, max], index) => clamp(parameters[index] || 0, min, max)
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
    constructor(params2) {
      this.param = new Proxy(
        this.prepare_parameters(params2),
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
    set parameters(params2) {
      this.update_parameters(params2);
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
    update_parameters(params2) {
      const _params = this.prepare_parameters(params2);
      for (const key in _params) {
        const paramKey = key;
        this.param[paramKey] = _params[paramKey];
      }
    }
    prepare_parameters = (params2) => {
      const generated = generatorParameters(params2);
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
    mean_reversion(init, current2) {
      const w = this.param.w;
      return roundTo(w[7] * init + (1 - w[7]) * current2, 8);
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
          const interval2 = this.algorithm.next_interval(
            nextCard.stability,
            this.elapsed_days
          );
          nextCard.scheduled_days = interval2;
          nextCard.due = date_scheduler(this.review_time, interval2, true);
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
      const interval2 = this.elapsed_days;
      const retrievability = this.algorithm.forgetting_curve(
        interval2,
        this.current.stability
      );
      const next_again = this.next_ds(interval2, Rating.Again, retrievability);
      const next_hard = this.next_ds(interval2, Rating.Hard, retrievability);
      const next_good = this.next_ds(interval2, Rating.Good, retrievability);
      const next_easy = this.next_ds(interval2, Rating.Easy, retrievability);
      this.next_interval(next_hard, next_good, next_easy, interval2);
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
    next_interval(next_hard, next_good, next_easy, interval2) {
      let hard_interval, good_interval;
      hard_interval = this.algorithm.next_interval(next_hard.stability, interval2);
      good_interval = this.algorithm.next_interval(next_good.stability, interval2);
      hard_interval = Math.min(hard_interval, good_interval);
      good_interval = Math.max(good_interval, hard_interval + 1);
      const easy_interval = Math.max(
        this.algorithm.next_interval(next_easy.stability, interval2),
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
      const interval2 = this.elapsed_days;
      const retrievability = this.algorithm.forgetting_curve(
        interval2,
        this.current.stability
      );
      const next_again = this.next_ds(interval2, Rating.Again, retrievability);
      const next_hard = this.next_ds(interval2, Rating.Hard, retrievability);
      const next_good = this.next_ds(interval2, Rating.Good, retrievability);
      const next_easy = this.next_ds(interval2, Rating.Easy, retrievability);
      this.next_interval(next_again, next_hard, next_good, next_easy, interval2);
      this.next_state(next_again, next_hard, next_good, next_easy);
      next_again.lapses += 1;
      this.update_next(next_again, next_hard, next_good, next_easy);
      return this.next.get(grade);
    }
    /**
     * Review/New next_interval
     */
    next_interval(next_again, next_hard, next_good, next_easy, interval2) {
      let again_interval, hard_interval, good_interval, easy_interval;
      again_interval = this.algorithm.next_interval(
        next_again.stability,
        interval2
      );
      hard_interval = this.algorithm.next_interval(next_hard.stability, interval2);
      good_interval = this.algorithm.next_interval(next_good.stability, interval2);
      easy_interval = this.algorithm.next_interval(next_easy.stability, interval2);
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
          let interval2 = 0;
          if (cur_card.state !== State.New && cur_card.last_review) {
            interval2 = date_diff(review.review, cur_card.last_review, "days");
          }
          item = this.handleManualRating(
            cur_card,
            review.state,
            review.review,
            interval2,
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
    reschedule(current_card, reviews = [], options2 = {}) {
      const {
        recordLogHandler,
        reviewsOrderBy,
        skipManual = true,
        now = /* @__PURE__ */ new Date(),
        update_memory_state: updateMemoryState = false
      } = options2;
      if (reviewsOrderBy && typeof reviewsOrderBy === "function") {
        reviews.sort(reviewsOrderBy);
      }
      if (skipManual) {
        reviews = reviews.filter((review) => review.rating !== Rating.Manual);
      }
      const rescheduleSvc = new Reschedule(this);
      const collections = rescheduleSvc.reschedule(
        options2.first_card || createEmptyCard(),
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
  var fsrs = (params2) => {
    return new FSRS(params2 || {});
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
  var safeCell = (value) => /^['=+@\-\t\r]/.test(value) ? "'" + value : value;
  function exportWords(state, listId, format) {
    const words = state.words.filter((w) => !listId || w.listId === listId);
    if (format === "json")
      return JSON.stringify(
        {
          ...state,
          lists: state.lists.filter((l) => !listId || l.id === listId),
          words,
          reviews: state.reviews.filter((r) => !listId || r.listId === listId)
        },
        null,
        2
      );
    if (format === "anki")
      return "#separator:Tab\n#html:false\n#columns:Front	Back	Details\n" + words.map(
        (w) => [w.word, w.translation, w.details].map((v) => '"' + v.replaceAll('"', '""') + '"').join("	")
      ).join("\n");
    return "\uFEFF" + [
      ["Word", "English translation", "Details", "List"],
      ...words.map((w) => [
        w.word,
        w.translation,
        w.details,
        state.lists.find((l) => l.id === w.listId)?.name || ""
      ])
    ].map(
      (row) => row.map((v) => '"' + safeCell(v).replaceAll('"', '""') + '"').join(",")
    ).join("\r\n");
  }

  // src/import-data.js
  function mapRows(group, mapping, clean = (v) => v) {
    const { word, translation, details } = mapping;
    if (!Number.isInteger(word) || !Number.isInteger(translation) || word === translation || [word, translation, ...details].some(
      (i) => !Number.isInteger(i) || i < 0 || i >= group.fields.length
    ))
      throw new Error("Choose different fields for word and translation.");
    const result = [], seen = /* @__PURE__ */ new Set();
    let blank = 0, duplicates = 0;
    for (const cells of group.rows) {
      const row = {
        word: clean(cells[word] || "").trim(),
        translation: clean(cells[translation] || "").trim(),
        details: details.map((i) => {
          const v = clean(cells[i] || "").trim();
          return v;
        }).filter(Boolean).join("\n\n")
      };
      if (!row.word || !row.translation) {
        blank++;
        continue;
      }
      const key = JSON.stringify(row);
      if (seen.has(key)) {
        duplicates++;
        continue;
      }
      seen.add(key);
      result.push(row);
    }
    return { rows: result, blank, duplicates };
  }

  // src/sync.js
  function validateConfig(url, key) {
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      throw new Error("Enter your Supabase project URL.");
    }
    if (parsed.protocol !== "https:" || !/^([a-z0-9-]+)\.supabase\.co$/.test(parsed.hostname) || parsed.username || parsed.password || parsed.port || parsed.search || parsed.hash || !["", "/"].includes(parsed.pathname))
      throw new Error(
        "Use an HTTPS project URL such as https://your-project.supabase.co."
      );
    if (!key.startsWith("sb_publishable_")) {
      try {
        const role = JSON.parse(
          atob(key.split(".")[1].replaceAll("-", "+").replaceAll("_", "/"))
        ).role;
        if (role !== "anon") throw new Error();
      } catch {
        throw new Error(
          "Use a publishable key or legacy anon key, never a secret/service-role key."
        );
      }
    }
    return { url: parsed.origin, key };
  }
  function generateSyncToken() {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
  }
  function validateSyncToken(token) {
    const value = token.trim();
    if (!/^[A-Za-z0-9_-]{43,128}$/.test(value))
      throw new Error(
        "Use a generated sync token, or enter a 43\u2013128 character token containing only letters, numbers, - and _."
      );
    return value;
  }

  // src/sync-ui.js
  var $ = (s) => document.querySelector(s);
  function setupSyncUI() {
    function render2(info) {
      if (!info) return;
      $("#sync-status").textContent = info.message + (info.lastSync ? ` Last synced: ${new Date(info.lastSync).toLocaleString()}` : "");
      $("#sync-status").classList.toggle("error", !!info.error);
      $("#sync-connected").hidden = !info.connected;
      $("#sync-login").hidden = !!info.connected || !new URLSearchParams(location.search).has("full");
      $("#sync-setup-tab").hidden = !!info.connected || new URLSearchParams(location.search).has("full");
      $("#sync-account").textContent = info.tokenHint ? `Connected \xB7 token ending ${info.tokenHint}` : "";
    }
    async function send2(message) {
      const r = await browser.runtime.sendMessage(message);
      if (r.error) throw new Error(r.error);
      render2(r.syncStatus);
      return r;
    }
    $("#sync-setup-tab").onclick = () => browser.tabs.create({
      url: browser.runtime.getURL("index.html") + "?full=1&settings=1"
    });
    $("#sync-generate").onclick = () => {
      $("#sync-token").value = generateSyncToken();
      $("#sync-token").type = "text";
      $("#sync-status").textContent = "Token generated. Save it in a password manager before connecting.";
    };
    $("#sync-token-toggle").onclick = () => {
      const input = $("#sync-token");
      input.type = input.type === "password" ? "text" : "password";
    };
    $("#sync-token-copy").onclick = async () => {
      try {
        const token = validateSyncToken($("#sync-token").value);
        await navigator.clipboard.writeText(token);
        $("#sync-status").textContent = "Sync token copied.";
      } catch (e) {
        $("#sync-status").textContent = e.message;
      }
    };
    $("#sync-form").onsubmit = async (e) => {
      e.preventDefault();
      const button = $("#sync-connect");
      button.disabled = true;
      try {
        const config = validateConfig(
          $("#sync-url").value.trim(),
          $("#sync-key").value.trim()
        );
        const token = validateSyncToken($("#sync-token").value);
        const allowed = await browser.permissions.request({
          origins: [config.url + "/*"],
          data_collection: ["authenticationInfo", "websiteContent"]
        });
        if (!allowed)
          throw new Error("Permission was not granted. Sync remains off.");
        await send2({
          type: "syncConnect",
          ...config,
          token
        });
        $("#sync-token").value = "";
      } catch (e2) {
        $("#sync-status").textContent = e2.message;
      } finally {
        button.disabled = false;
      }
    };
    $("#sync-now").onclick = async () => {
      const b = $("#sync-now");
      b.disabled = true;
      try {
        await send2({ type: "syncNow" });
      } catch (e) {
        $("#sync-status").textContent = e.message;
      } finally {
        b.disabled = false;
      }
    };
    $("#sync-show-saved").onclick = async () => {
      try {
        const { token } = await send2({ type: "syncCredentials" });
        if (!token) throw new Error("No saved sync token was found.");
        $("#sync-saved-token").value = token;
        $("#sync-saved-token").type = "text";
      } catch (e) {
        $("#sync-status").textContent = e.message;
      }
    };
    $("#sync-copy-saved").onclick = async () => {
      try {
        const { token } = await send2({ type: "syncCredentials" });
        if (!token) throw new Error("No saved sync token was found.");
        await navigator.clipboard.writeText(token);
        $("#sync-status").textContent = "Saved sync token copied.";
      } catch (e) {
        $("#sync-status").textContent = e.message;
      }
    };
    $("#sync-disconnect").onclick = () => send2({ type: "syncDisconnect" }).catch(
      (e) => $("#sync-status").textContent = e.message
    );
    $("#sync-recovery").onclick = async () => {
      try {
        const { backup } = await send2({ type: "syncBackup" });
        if (!backup) throw new Error("No remote replacement has occurred yet.");
        const url = URL.createObjectURL(
          new Blob([JSON.stringify(backup.data, null, 2)], {
            type: "application/json"
          })
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = "abhyas-before-sync.json";
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1e4);
      } catch (e) {
        $("#sync-status").textContent = e.message;
      }
    };
    browser.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes.syncStatus)
        render2(changes.syncStatus.newValue);
    });
    send2({ type: "syncInfo" }).catch(
      (e) => $("#sync-status").textContent = e.message
    );
  }

  // src/practice-order.js
  function shuffleNewWords(words, random = Math.random) {
    const fresh = words.filter((word) => word.card.state === 0);
    for (let i = fresh.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [fresh[i], fresh[j]] = [fresh[j], fresh[i]];
    }
    let index = 0;
    return words.map((word) => word.card.state === 0 ? fresh[index++] : word);
  }

  // src/metrics.js
  function practiceMetrics(state, listId = "", now = /* @__PURE__ */ new Date()) {
    const words = state.words.filter((w) => !listId || w.listId === listId), reviews = state.reviews.filter(
      (r) => (!listId || r.listId === listId) && new Date(r.at) <= now
    );
    const dayKey = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const counts = /* @__PURE__ */ new Map(), ratings = [0, 0, 0, 0];
    for (const r of reviews) {
      const key = dayKey(new Date(r.at));
      counts.set(key, (counts.get(key) || 0) + 1);
      ratings[r.rating - 1]++;
    }
    const days = Array.from({ length: 14 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - 13 + i);
      return {
        label: date.toLocaleDateString(void 0, {
          month: "short",
          day: "numeric"
        }),
        count: counts.get(dayKey(date)) || 0
      };
    });
    let streak = 0, cursor = new Date(now);
    if (!counts.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    while (counts.has(dayKey(cursor))) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return {
      total: reviews.length,
      recall: reviews.length ? Math.round(100 * (reviews.length - ratings[0]) / reviews.length) : null,
      streak,
      ratings,
      days,
      new: words.filter((w) => w.card.state === 0).length,
      learning: words.filter((w) => [1, 3].includes(w.card.state)).length,
      review: words.filter((w) => w.card.state === 2).length
    };
  }

  // src/import-ui.js
  var $2 = (s) => document.querySelector(s);
  function plainAnki(value) {
    const safe = value.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "").replace(/<br\s*\/?\s*>|<\/(div|p|li|tr)>/gi, "\n").replace(/<img\b[^>]*>/gi, "[image]").replace(/\[sound:([^\]]+)\]/g, "[audio: $1]");
    return new DOMParser().parseFromString(safe, "text/html").body.textContent.replace(/\{\{c\d+::(.*?)(?:::[\s\S]*?)?\}\}/g, "$1").replace(/\u00a0/g, " ").trim();
  }
  function setupImport({ commit, onSuccess }) {
    let parsed = null, worker = null, token = 0, preview = null;
    const dialog = $2("#import-dialog");
    function clear() {
      parsed = null;
      preview = null;
      $2("#import-mapping").hidden = true;
      $2("#import-backup").hidden = true;
      $2("#import-confirm").disabled = true;
      $2("#import-error").textContent = "";
      $2("#import-preview").replaceChildren();
    }
    function cancel() {
      token++;
      worker?.terminate();
      worker = null;
    }
    $2("#import-open").onclick = async () => {
      if (!new URLSearchParams(location.search).has("full")) {
        try {
          await browser.tabs.create({
            url: browser.runtime.getURL("index.html") + "?full=1&import=1"
          });
        } catch (error) {
          document.querySelector("#status").textContent = `Could not open import tab: ${error.message}`;
        }
        return;
      }
      cancel();
      clear();
      $2("#import-file").value = "";
      $2("#import-info").textContent = "Choose a file to preview. Everything is processed on this device.";
      dialog.showModal();
    };
    $2("#import-close").onclick = () => dialog.close();
    dialog.addEventListener("close", () => {
      cancel();
      parsed = null;
      preview = null;
    });
    $2("#import-file").onchange = async () => {
      cancel();
      clear();
      const file = $2("#import-file").files[0];
      if (!file) return;
      if (file.size > 128 * 1024 * 1024) {
        $2("#import-error").textContent = "Choose a file smaller than 128 MB.";
        return;
      }
      if (!/\.(json|csv|txt|tsv|apkg)$/i.test(file.name)) {
        $2("#import-error").textContent = "Choose JSON, CSV, Anki text, TSV, or APKG.";
        return;
      }
      const currentToken = token;
      $2("#import-info").textContent = "Reading file\u2026";
      try {
        const buffer = await file.arrayBuffer();
        if (currentToken !== token) return;
        const result = await new Promise((resolve, reject) => {
          worker = new Worker(browser.runtime.getURL("import-worker.js"));
          worker.onmessage = ({ data: data2 }) => data2.error ? reject(new Error(data2.error)) : resolve(data2.result);
          worker.onerror = (e) => reject(new Error(e.message || "Could not read the file."));
          worker.postMessage({ name: file.name, buffer }, [buffer]);
        });
        if (currentToken !== token) return;
        worker.terminate();
        worker = null;
        parsed = result;
        if (parsed.backup) {
          $2("#import-backup").hidden = false;
          $2("#import-info").textContent = `${parsed.backup.lists.length} lists \xB7 ${parsed.backup.words.length} words \xB7 ${parsed.backup.reviews.length} reviews`;
          $2("#import-confirm").disabled = false;
        } else {
          $2("#import-mapping").hidden = false;
          $2("#import-group").replaceChildren(
            ...parsed.groups.map(
              (g, i) => new Option(`${g.name} (${g.rows.length} notes)`, String(i))
            )
          );
          $2("#import-info").textContent = "Choose a group and map its fields. Repeat the import for other groups.";
          selectGroup();
        }
      } catch (e) {
        if (currentToken === token) {
          worker?.terminate();
          worker = null;
          $2("#import-info").textContent = "Nothing has been imported.";
          $2("#import-error").textContent = e.message;
        }
      }
    };
    function selectGroup() {
      const g = parsed.groups[Number($2("#import-group").value)];
      $2("#import-name").value = g.name;
      for (const id of ["#map-word", "#map-translation"])
        $2(id).replaceChildren(
          ...g.fields.map((f, i) => new Option(f, String(i)))
        );
      const word = g.fields.findIndex(
        (f) => /^(word|front|expression|term)$/i.test(f)
      ), translation = g.fields.findIndex(
        (f) => /^(english translation|translation|back|meaning)$/i.test(f)
      );
      $2("#map-word").value = String(word >= 0 ? word : 0);
      $2("#map-translation").value = String(
        translation >= 0 ? translation : Math.min(1, g.fields.length - 1)
      );
      $2("#map-details").replaceChildren();
      g.fields.forEach((field, i) => {
        const label = document.createElement("label");
        label.className = "check";
        const input = document.createElement("input");
        input.type = "checkbox";
        input.value = String(i);
        input.checked = /^details$/i.test(field);
        input.onchange = updatePreview;
        label.append(input, document.createTextNode(field));
        $2("#map-details").append(label);
      });
      $2("#import-html").checked = g.html;
      updatePreview();
    }
    function updatePreview() {
      try {
        const group = parsed.groups[Number($2("#import-group").value)];
        preview = mapRows(
          group,
          {
            word: Number($2("#map-word").value),
            translation: Number($2("#map-translation").value),
            details: [...$2("#map-details").querySelectorAll("input:checked")].map(
              (n) => Number(n.value)
            )
          },
          $2("#import-html").checked ? plainAnki : (v) => v
        );
        $2("#import-error").textContent = "";
        $2("#import-summary").textContent = `${preview.rows.length} words to import \xB7 ${preview.blank} blank notes skipped \xB7 ${preview.duplicates} exact duplicates skipped`;
        const host = $2("#import-preview");
        host.replaceChildren();
        for (const row of preview.rows.slice(0, 3)) {
          const article = document.createElement("article");
          article.className = "word-card";
          const copy = document.createElement("div");
          copy.className = "word-copy";
          for (const [tag, value] of [
            ["strong", row.word],
            ["p", row.translation],
            ["pre", row.details]
          ]) {
            const n = document.createElement(tag);
            n.textContent = value;
            copy.append(n);
          }
          article.append(copy);
          host.append(article);
        }
        $2("#import-confirm").disabled = !preview.rows.length;
      } catch (e) {
        preview = null;
        $2("#import-error").textContent = e.message;
        $2("#import-confirm").disabled = true;
        $2("#import-preview").replaceChildren();
      }
    }
    $2("#import-group").onchange = selectGroup;
    $2("#map-word").onchange = updatePreview;
    $2("#map-translation").onchange = updatePreview;
    $2("#import-html").onchange = updatePreview;
    $2("#import-form").onsubmit = async (e) => {
      e.preventDefault();
      if (!parsed) return;
      $2("#import-confirm").disabled = true;
      $2("#import-file").disabled = true;
      try {
        const result = await commit(
          parsed.backup ? { type: "importBackup", backup: parsed.backup } : {
            type: "importRows",
            name: $2("#import-name").value,
            rows: preview?.rows
          }
        );
        dialog.close();
        onSuccess(result);
      } catch (err) {
        $2("#import-error").textContent = err.message;
      } finally {
        $2("#import-confirm").disabled = false;
        $2("#import-file").disabled = false;
      }
    };
  }

  // src/app.js
  var $3 = (s) => document.querySelector(s);
  var el = (tag, text, cls) => {
    const n = document.createElement(tag);
    if (text !== void 0) n.textContent = text;
    if (cls) n.className = cls;
    return n;
  };
  var data;
  var selected = "";
  var current = null;
  var revealed = false;
  var sessionCount = 0;
  var view = "library";
  var busy = false;
  var session = null;
  var visibleWords = 20;
  var params = new URLSearchParams(location.search);
  if (location.search || window.innerWidth > 600)
    document.body.classList.add("full");
  function status(text, error = false) {
    $3("#status").textContent = text;
    $3("#status").classList.toggle("error", error);
  }
  async function send(message) {
    const result = await browser.runtime.sendMessage(message);
    if (result.error) throw new Error(result.error);
    data = result.data;
    return data;
  }
  async function action(message, success) {
    try {
      await send(message);
      render();
      if (success) status(success);
      return true;
    } catch (e) {
      status(e.message, true);
      return false;
    }
  }
  function options(select, all = false, value = select.value) {
    select.replaceChildren();
    if (all) select.add(new Option("All lists", ""));
    data.lists.forEach((l) => select.add(new Option(l.name, l.id)));
    if ([...select.options].some((o) => o.value === value)) select.value = value;
  }
  function show(name) {
    view = name;
    document.body.classList.toggle(
      "practicing",
      name === "practice" && !!session
    );
    document.querySelectorAll(".view").forEach((n) => n.hidden = n.id !== name);
    document.querySelectorAll("nav button").forEach((n) => n.classList.toggle("active", n.dataset.view === name));
    if (name === "practice") renderReview();
  }
  function render() {
    if (!data.lists.some((l) => l.id === selected)) selected = data.lists[0].id;
    options($3("#list"), false, selected);
    options($3("#practice-list"), true);
    if (document.activeElement !== $3("#practice-size"))
      $3("#practice-size").value = data.settings.practiceSize || 10;
    $3("#total").textContent = data.words.length;
    $3("#due").textContent = data.words.filter(
      (w) => new Date(w.card.due) <= /* @__PURE__ */ new Date()
    ).length;
    $3("#today").textContent = data.reviews.filter(
      (r) => new Date(r.at).toDateString() === (/* @__PURE__ */ new Date()).toDateString()
    ).length;
    if (document.activeElement !== $3("#time"))
      $3("#time").value = data.settings.time;
    if (document.activeElement !== $3("#reminders"))
      $3("#reminders").checked = data.settings.reminders;
    $3("#reminder-status").textContent = data.settings.notificationError ? `Notification error: ${data.settings.notificationError}` : data.settings.reminders && data.settings.reminderAt ? `Next browser reminder: ${new Date(data.settings.reminderAt).toLocaleString()}` : "Daily reminders are off.";
    renderWords();
    if (view === "practice") renderReview();
  }
  function renderWords() {
    const query = $3("#search").value.toLocaleLowerCase();
    const words = data.words.filter(
      (w) => w.listId === selected && [w.word, w.translation, w.details].join(" ").toLocaleLowerCase().includes(query)
    );
    const container = $3("#words");
    container.replaceChildren();
    if (!words.length) {
      const empty = el("div", void 0, "empty");
      empty.append(
        el("h2", query ? "No matching words" : "Your next word belongs here"),
        el(
          "p",
          query ? "Try another search." : "Add a word, or select text on a page and right-click to capture it."
        )
      );
      container.append(empty);
      return;
    }
    for (const w of words.slice(0, visibleWords)) {
      const card = el("article", void 0, "word-card"), copy = el("div", void 0, "word-copy");
      copy.append(el("h3", w.word), el("p", w.translation, "translation"));
      if (w.details) copy.append(el("p", w.details, "details"));
      copy.append(
        el(
          "span",
          w.card.reps === 0 ? "New word" : new Date(w.card.due) <= /* @__PURE__ */ new Date() ? "Ready to review" : "Next: " + new Date(w.card.due).toLocaleDateString(),
          "badge"
        )
      );
      const actions = el("div", void 0, "card-actions");
      for (const [text, fn] of [
        ["Edit", () => openWord(w)],
        [
          "Delete",
          async () => {
            if (confirm(`Delete \u201C${w.word}\u201D?`))
              await action({ type: "deleteWord", id: w.id }, "Word deleted.");
          }
        ]
      ]) {
        const b = el("button", text, "quiet");
        b.addEventListener("click", fn);
        actions.append(b);
      }
      card.append(copy, actions);
      container.append(card);
    }
    if (words.length > visibleWords) {
      const more = el(
        "button",
        `Show more (${visibleWords} of ${words.length})`,
        "quiet"
      );
      more.onclick = () => {
        visibleWords += 20;
        renderWords();
      };
      container.append(more);
    }
  }
  function openWord(w = {}) {
    $3("#word-id").value = w.id || "";
    $3("#word").value = w.word || "";
    $3("#translation").value = w.translation || "";
    $3("#details").value = w.details || "";
    options($3("#word-list"), false, w.listId || selected);
    $3("#form-title").textContent = w.id ? "Edit word" : "Plant a new word";
    $3("#form-error").textContent = "";
    $3("#word-dialog").showModal();
    (w.word && !w.id ? $3("#translation") : $3("#word")).focus();
  }
  function interval(date) {
    const minutes = Math.max(1, Math.round((date - /* @__PURE__ */ new Date()) / 6e4));
    return minutes < 60 ? `${minutes}m` : minutes < 1440 ? `${Math.round(minutes / 60)}h` : `${Math.round(minutes / 1440)}d`;
  }
  function renderReview() {
    const list = $3("#practice-list").value;
    renderMetrics(list);
    document.body.classList.toggle("practicing", !!session);
    $3("#practice-setup").hidden = !!session;
    $3("#practice-metrics").hidden = !!session;
    $3("#session-toolbar").hidden = !session;
    const host = $3("#review");
    host.replaceChildren();
    if (!session) return;
    session.queue = session.queue.filter(
      (entry) => data.words.some((w) => w.id === entry.id && w.card.reps === entry.reps)
    );
    const old = current;
    current = data.words.find((w) => w.id === session.queue[0]?.id) || null;
    if (current?.id !== old?.id) revealed = false;
    $3("#session-count").textContent = `${sessionCount} reviewed \xB7 ${session.queue.length} remaining \xB7 ${session.total} words in session`;
    if (!current) {
      const done = el("div", void 0, "review-card");
      done.append(
        el("h2", session.total ? "Session complete" : "You\u2019re all caught up"),
        el("p", `${sessionCount} words reviewed. Your progress is saved.`)
      );
      const skipped = session.total - sessionCount;
      if (skipped)
        done.append(
          el(
            "p",
            `${skipped} words were removed or reviewed in another window.`,
            "muted"
          )
        );
      const back = el("button", "Back to home");
      back.onclick = () => endSession();
      done.append(back);
      host.append(done);
      return;
    }
    const card = el("div", void 0, "review-card");
    card.append(
      el("span", "RECALL THE ENGLISH TRANSLATION", "eyebrow"),
      el("h2", current.word)
    );
    if (!revealed) {
      const b = el("button", "Show answer");
      b.onclick = () => {
        revealed = true;
        renderReview();
      };
      card.append(b);
    } else {
      const answer = el("div", void 0, "answer");
      answer.append(el("strong", current.translation));
      if (current.details) answer.append(el("p", current.details, "muted"));
      card.append(answer);
      const ratings = el("div", void 0, "ratings");
      const preview = scheduler.repeat(hydrate(current.card), /* @__PURE__ */ new Date());
      ["Again", "Hard", "Good", "Easy"].forEach((label, i) => {
        const b = el("button", label);
        b.append(el("small", interval(preview[i + 1].card.due)));
        b.disabled = busy;
        b.onclick = async () => {
          if (busy) return;
          busy = true;
          const id = current.id, expectedReps = current.card.reps;
          ratings.querySelectorAll("button").forEach((n) => n.disabled = true);
          try {
            await send({ type: "review", id, rating: i + 1, expectedReps });
            sessionCount++;
            session.queue = session.queue.filter((entry) => entry.id !== id);
            current = null;
            revealed = false;
            render();
          } catch (e) {
            status(e.message, true);
            await action({ type: "get" });
          } finally {
            busy = false;
            renderReview();
          }
        };
        ratings.append(b);
      });
      card.append(ratings);
    }
    host.append(card);
  }
  function download(format, all = false) {
    const content = exportWords(data, all ? "" : selected, format);
    const blob = new Blob([content], {
      type: format === "json" ? "application/json" : format === "csv" ? "text/csv;charset=utf-8" : "text/plain;charset=utf-8"
    }), url = URL.createObjectURL(blob);
    const a = el("a");
    a.href = url;
    a.download = `abhyas-language-learner-${all ? "backup" : data.lists.find((l) => l.id === selected).name.replace(/[^a-z0-9_-]/gi, "_")}.${format === "anki" ? "txt" : format}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1e4);
    status("Export downloaded.");
  }
  $3("#list").onchange = () => {
    selected = $3("#list").value;
    visibleWords = 20;
    renderWords();
  };
  $3("#search").oninput = () => {
    visibleWords = 20;
    renderWords();
  };
  $3("#practice-list").onchange = () => {
    current = null;
    revealed = false;
    renderReview();
  };
  $3("nav").onclick = (e) => {
    if (e.target.dataset.view) show(e.target.dataset.view);
  };
  $3("#add").onclick = () => openWord();
  $3("#close-dialog").onclick = () => $3("#word-dialog").close();
  $3("#word-form").onsubmit = async (e) => {
    e.preventDefault();
    const button = e.submitter;
    button.disabled = true;
    try {
      await send({
        type: "saveWord",
        word: {
          id: $3("#word-id").value,
          word: $3("#word").value,
          translation: $3("#translation").value,
          details: $3("#details").value,
          listId: $3("#word-list").value
        }
      });
      selected = $3("#word-list").value;
      $3("#word-dialog").close();
      render();
      status("Word saved.");
    } catch (err) {
      $3("#form-error").textContent = err.message;
    } finally {
      button.disabled = false;
    }
  };
  $3("#new-list").onclick = async () => {
    const name = prompt("Name your new word list:");
    if (name && await action({ type: "saveList", name })) {
      selected = data.lists.at(-1).id;
      render();
    }
  };
  $3("#rename-list").onclick = () => {
    const name = prompt(
      "Rename this list:",
      data.lists.find((l) => l.id === selected).name
    );
    if (name) action({ type: "saveList", id: selected, name });
  };
  $3("#delete-list").onclick = () => {
    if (confirm("Delete this list and every word in it? This cannot be undone."))
      action({ type: "deleteList", id: selected });
  };
  $3("#settings-form").onsubmit = (e) => {
    e.preventDefault();
    action(
      {
        type: "settings",
        reminders: $3("#reminders").checked,
        time: $3("#time").value
      },
      "Preferences saved."
    );
  };
  $3("#test-notification").onclick = async () => {
    const button = $3("#test-notification");
    button.disabled = true;
    await action(
      { type: "testNotification" },
      "Notification requested from Firefox. If it is not visible, check Firefox notifications in your system settings and Do Not Disturb."
    );
    setTimeout(() => {
      button.disabled = false;
    }, 5e3);
  };
  $3("#export").onclick = () => download($3("#format").value);
  $3("#backup").onclick = () => download("json", true);
  $3("#expand").onclick = () => browser.tabs.create({
    url: browser.runtime.getURL("index.html") + "?full=1"
  });
  browser.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.data?.newValue) {
      data = changes.data.newValue;
      render();
    }
  });
  (async () => {
    try {
      await send({ type: "get" });
      render();
      if (params.has("capture")) openWord({ word: params.get("capture") });
      if (params.has("practice")) show("practice");
      if (params.has("settings")) show("settings");
      if (params.has("import")) $3("#import-open").click();
    } catch (e) {
      status("Could not load your words: " + e.message, true);
    }
  })();
  setInterval(() => {
    if (data && !busy && !$3("#word-dialog").open) render();
  }, 3e4);
  function renderMetrics(list) {
    const m = practiceMetrics(data, list), host = $3("#practice-metrics");
    host.replaceChildren();
    const stats = el("div", void 0, "metric-grid");
    for (const [value, label] of [
      [m.total, "total reviews"],
      [m.recall === null ? "\u2014" : m.recall + "%", "recall rate"],
      [m.streak, "day streak"]
    ]) {
      const item = el("div");
      item.append(el("strong", String(value)), el("span", label));
      stats.append(item);
    }
    host.append(
      stats,
      el(
        "p",
        "Recall rate = Hard, Good, or Easy ratings as a share of all reviews in this selection.",
        "muted"
      )
    );
    const ratings = el("div", void 0, "rating-summary");
    ["Again", "Hard", "Good", "Easy"].forEach(
      (name, i) => ratings.append(el("span", `${name}: ${m.ratings[i]}`))
    );
    host.append(ratings);
    const chart = el("div", void 0, "activity-chart");
    chart.setAttribute("aria-label", "Review activity over the last 14 days");
    const max = Math.max(1, ...m.days.map((d) => d.count));
    for (const day of m.days) {
      const col = el("div", void 0, "activity-day");
      col.title = `${day.label}: ${day.count} reviews`;
      col.setAttribute("aria-label", col.title);
      const bar = el("div", void 0, "activity-bar");
      bar.style.height = `${Math.max(3, day.count / max * 60)}px`;
      col.append(el("small", String(day.count)), bar);
      chart.append(col);
    }
    host.append(
      el("h3", "Last 14 days"),
      chart,
      el("p", `${m.days[0].label} \u2013 ${m.days.at(-1).label}`, "muted"),
      el(
        "p",
        `${m.new} new \xB7 ${m.learning} learning / relearning \xB7 ${m.review} in review`,
        "muted"
      )
    );
  }
  setupImport({
    commit: async (message) => {
      const result = await browser.runtime.sendMessage(message);
      if (result.error) throw new Error(result.error);
      data = result.data;
      return result.imported;
    },
    onSuccess: (result) => {
      selected = result.listId;
      visibleWords = 20;
      $3("#search").value = "";
      render();
      show("library");
      status(`${result.added} words imported and saved in browser storage.`);
    }
  });
  setupSyncUI();
  function endSession() {
    if (busy) return;
    session = null;
    current = null;
    revealed = false;
    document.body.classList.remove("practicing");
    show("library");
  }
  $3("#end-practice").onclick = endSession;
  $3("#home-practice").onclick = () => show("practice");
  $3("#begin-practice").onclick = async () => {
    const input = $3("#practice-size");
    if (!input.reportValidity()) return;
    const button = $3("#begin-practice");
    button.disabled = true;
    try {
      await send({ type: "practiceSize", size: Number(input.value) });
      const list = $3("#practice-list").value;
      const words = shuffleNewWords(
        data.words.filter(
          (w) => (!list || w.listId === list) && new Date(w.card.due) <= /* @__PURE__ */ new Date()
        ).sort((a, b) => new Date(a.card.due) - new Date(b.card.due))
      ).slice(0, Number(input.value));
      session = {
        queue: words.map((w) => ({ id: w.id, reps: w.card.reps })),
        total: words.length
      };
      sessionCount = 0;
      current = null;
      revealed = false;
      renderReview();
      window.scrollTo(0, 0);
    } catch (e) {
      status(e.message, true);
    } finally {
      button.disabled = false;
    }
  };
})();
/*! Bundled license information:

ts-fsrs/dist/index.mjs:
ts-fsrs/dist/index.mjs:
ts-fsrs/dist/index.mjs:
  (* istanbul ignore next -- @preserve *)
*/
