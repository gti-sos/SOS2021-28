
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop$1;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$1;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop$1,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.37.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$1) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop$1;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop$1;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop$1;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function regexparam (str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.37.0 */

    const { Error: Error_1, Object: Object_1$3, console: console_1$6 } = globals;

    // (209:0) {:else}
    function create_else_block$7(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(209:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (202:0) {#if componentParams}
    function create_if_block$c(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(202:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$x(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$c, create_else_block$7];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn("Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading");

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf("#/");

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: "/";

    	// Check if there's a querystring
    	const qsPosition = location.indexOf("?");

    	let querystring = "";

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener("hashchange", update, false);

    	return function stop() {
    		window.removeEventListener("hashchange", update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			scrollX: window.scrollX,
    			scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == "#" ? "" : "#") + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == "#" ? "" : "#") + location;

    	try {
    		window.history.replaceState(undefined, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn("Caught exception while replacing the current page. If you're running this in the Svelte REPL, please note that the `replace` method might not work in this environment.");
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event("hashchange"));
    }

    function link(node, hrefVar) {
    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != "a") {
    		throw Error("Action \"link\" can only be used with <a> tags");
    	}

    	updateLink(node, hrefVar || node.getAttribute("href"));

    	return {
    		update(updated) {
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, href) {
    	// Destination must start with '/'
    	if (!href || href.length < 1 || href.charAt(0) != "/") {
    		throw Error("Invalid value for \"href\" attribute: " + href);
    	}

    	// Add # to the href attribute
    	node.setAttribute("href", "#" + href);

    	node.addEventListener("click", scrollstateHistoryHandler);
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {HTMLElementEventMap} event - an onclick event attached to an anchor tag
     */
    function scrollstateHistoryHandler(event) {
    	// Prevent default anchor onclick behaviour
    	event.preventDefault();

    	const href = event.currentTarget.getAttribute("href");

    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			scrollX: window.scrollX,
    			scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Router", slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = "" } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != "function" && (typeof component != "object" || component._sveltesparouter !== true)) {
    				throw Error("Invalid component object");
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == "string" && (path.length < 1 || path.charAt(0) != "/" && path.charAt(0) != "*") || typeof path == "object" && !(path instanceof RegExp)) {
    				throw Error("Invalid value for \"path\" argument - strings must start with / or *");
    			}

    			const { pattern, keys } = regexparam(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == "object" && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == "string") {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || "/";
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || "/";
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || "") || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {bool} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	if (restoreScrollState) {
    		window.addEventListener("popstate", event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && event.state.scrollY) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		});

    		afterUpdate(() => {
    			// If this exists, then this is a back navigation: restore the scroll position
    			if (previousScrollState) {
    				window.scrollTo(previousScrollState.scrollX, previousScrollState.scrollY);
    			} else {
    				// Otherwise this is a forward navigation: scroll to top
    				window.scrollTo(0, 0);
    			}
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick("conditionsFailed", detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick("routeLoading", Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick("routeLoaded", Object.assign({}, detail, { component, name: component.name }));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == "object" && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick("routeLoaded", Object.assign({}, detail, { component, name: component.name }));

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    	});

    	const writable_props = ["routes", "prefix", "restoreScrollState"];

    	Object_1$3.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$6.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble($$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ("routes" in $$props) $$invalidate(3, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ("restoreScrollState" in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		scrollstateHistoryHandler,
    		createEventDispatcher,
    		afterUpdate,
    		regexparam,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		lastLoc,
    		componentObj
    	});

    	$$self.$inject_state = $$props => {
    		if ("routes" in $$props) $$invalidate(3, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ("restoreScrollState" in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ("component" in $$props) $$invalidate(0, component = $$props.component);
    		if ("componentParams" in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ("props" in $$props) $$invalidate(2, props = $$props.props);
    		if ("previousScrollState" in $$props) previousScrollState = $$props.previousScrollState;
    		if ("lastLoc" in $$props) lastLoc = $$props.lastLoc;
    		if ("componentObj" in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? "manual" : "auto";
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$x, create_fragment$x, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$x.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    function getOriginalBodyPadding() {
      const style = window ? window.getComputedStyle(document.body, null) : {};

      return parseInt((style && style.getPropertyValue('padding-right')) || 0, 10);
    }

    function getScrollbarWidth() {
      let scrollDiv = document.createElement('div');
      // .modal-scrollbar-measure styles // https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.4/scss/_modal.scss#L106-L113
      scrollDiv.style.position = 'absolute';
      scrollDiv.style.top = '-9999px';
      scrollDiv.style.width = '50px';
      scrollDiv.style.height = '50px';
      scrollDiv.style.overflow = 'scroll';
      document.body.appendChild(scrollDiv);
      const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      return scrollbarWidth;
    }

    function setScrollbarWidth(padding) {
      document.body.style.paddingRight = padding > 0 ? `${padding}px` : null;
    }

    function isBodyOverflowing() {
      return window ? document.body.clientWidth < window.innerWidth : false;
    }

    function isObject(value) {
      const type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    function conditionallyUpdateScrollbar() {
      const scrollbarWidth = getScrollbarWidth();
      // https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.6/js/src/modal.js#L433
      const fixedContent = document.querySelectorAll(
        '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top'
      )[0];
      const bodyPadding = fixedContent
        ? parseInt(fixedContent.style.paddingRight || 0, 10)
        : 0;

      if (isBodyOverflowing()) {
        setScrollbarWidth(bodyPadding + scrollbarWidth);
      }
    }

    function getColumnSizeClass(isXs, colWidth, colSize) {
      if (colSize === true || colSize === '') {
        return isXs ? 'col' : `col-${colWidth}`;
      } else if (colSize === 'auto') {
        return isXs ? 'col-auto' : `col-${colWidth}-auto`;
      }

      return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
    }

    function browserEvent(target, ...args) {
      target.addEventListener(...args);

      return () => target.removeEventListener(...args);
    }

    function toClassName(value) {
      let result = '';

      if (typeof value === 'string' || typeof value === 'number') {
        result += value;
      } else if (typeof value === 'object') {
        if (Array.isArray(value)) {
          result = value.map(toClassName).filter(Boolean).join(' ');
        } else {
          for (let key in value) {
            if (value[key]) {
              result && (result += ' ');
              result += key;
            }
          }
        }
      }

      return result;
    }

    function classnames(...args) {
      return args.map(toClassName).filter(Boolean).join(' ');
    }

    /* node_modules/sveltestrap/src/Button.svelte generated by Svelte v3.37.0 */
    const file$w = "node_modules/sveltestrap/src/Button.svelte";

    // (48:0) {:else}
    function create_else_block_1$2(ctx) {
    	let button;
    	let button_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);
    	const default_slot_or_fallback = default_slot || fallback_block$2(ctx);

    	let button_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ value: /*value*/ ctx[5] },
    		{
    			"aria-label": button_aria_label_value = /*ariaLabel*/ ctx[6] || /*defaultAriaLabel*/ ctx[8]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(button, button_data);
    			add_location(button, file$w, 48, 2, 985);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[19], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 65536) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[16], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*close, children, $$scope*/ 65539) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*value*/ 32) && { value: /*value*/ ctx[5] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && button_aria_label_value !== (button_aria_label_value = /*ariaLabel*/ ctx[6] || /*defaultAriaLabel*/ ctx[8])) && { "aria-label": button_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_1$2.name,
    		type: "else",
    		source: "(48:0) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (33:0) {#if href}
    function create_if_block$b(ctx) {
    	let a;
    	let current_block_type_index;
    	let if_block;
    	let a_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$8, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*children*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let a_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ href: /*href*/ ctx[3] },
    		{
    			"aria-label": a_aria_label_value = /*ariaLabel*/ ctx[6] || /*defaultAriaLabel*/ ctx[8]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			a = element("a");
    			if_block.c();
    			set_attributes(a, a_data);
    			add_location(a, file$w, 33, 2, 752);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			if_blocks[current_block_type_index].m(a, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[18], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(a, null);
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*href*/ 8) && { href: /*href*/ ctx[3] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && a_aria_label_value !== (a_aria_label_value = /*ariaLabel*/ ctx[6] || /*defaultAriaLabel*/ ctx[8])) && { "aria-label": a_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(33:0) {#if href}",
    		ctx
    	});

    	return block_1;
    }

    // (62:6) {:else}
    function create_else_block_2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 65536) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[16], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(62:6) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (60:25) 
    function create_if_block_3$2(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(60:25) ",
    		ctx
    	});

    	return block_1;
    }

    // (58:6) {#if close}
    function create_if_block_2$3(ctx) {
    	let span;

    	const block_1 = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "×";
    			attr_dev(span, "aria-hidden", "true");
    			add_location(span, file$w, 58, 8, 1171);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(58:6) {#if close}",
    		ctx
    	});

    	return block_1;
    }

    // (57:10)        
    function fallback_block$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$3, create_if_block_3$2, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*close*/ ctx[1]) return 0;
    		if (/*children*/ ctx[0]) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: fallback_block$2.name,
    		type: "fallback",
    		source: "(57:10)        ",
    		ctx
    	});

    	return block_1;
    }

    // (44:4) {:else}
    function create_else_block$6(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 65536) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[16], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(44:4) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (42:4) {#if children}
    function create_if_block_1$8(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(42:4) {#if children}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$w(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$b, create_else_block_1$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let classes;
    	let defaultAriaLabel;

    	const omit_props_names = [
    		"class","active","block","children","close","color","disabled","href","outline","size","style","value"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Button", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { active = false } = $$props;
    	let { block = false } = $$props;
    	let { children = undefined } = $$props;
    	let { close = false } = $$props;
    	let { color = "secondary" } = $$props;
    	let { disabled = false } = $$props;
    	let { href = "" } = $$props;
    	let { outline = false } = $$props;
    	let { size = null } = $$props;
    	let { style = "" } = $$props;
    	let { value = "" } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function click_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(20, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(10, className = $$new_props.class);
    		if ("active" in $$new_props) $$invalidate(11, active = $$new_props.active);
    		if ("block" in $$new_props) $$invalidate(12, block = $$new_props.block);
    		if ("children" in $$new_props) $$invalidate(0, children = $$new_props.children);
    		if ("close" in $$new_props) $$invalidate(1, close = $$new_props.close);
    		if ("color" in $$new_props) $$invalidate(13, color = $$new_props.color);
    		if ("disabled" in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ("href" in $$new_props) $$invalidate(3, href = $$new_props.href);
    		if ("outline" in $$new_props) $$invalidate(14, outline = $$new_props.outline);
    		if ("size" in $$new_props) $$invalidate(15, size = $$new_props.size);
    		if ("style" in $$new_props) $$invalidate(4, style = $$new_props.style);
    		if ("value" in $$new_props) $$invalidate(5, value = $$new_props.value);
    		if ("$$scope" in $$new_props) $$invalidate(16, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		active,
    		block,
    		children,
    		close,
    		color,
    		disabled,
    		href,
    		outline,
    		size,
    		style,
    		value,
    		ariaLabel,
    		classes,
    		defaultAriaLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(20, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(10, className = $$new_props.className);
    		if ("active" in $$props) $$invalidate(11, active = $$new_props.active);
    		if ("block" in $$props) $$invalidate(12, block = $$new_props.block);
    		if ("children" in $$props) $$invalidate(0, children = $$new_props.children);
    		if ("close" in $$props) $$invalidate(1, close = $$new_props.close);
    		if ("color" in $$props) $$invalidate(13, color = $$new_props.color);
    		if ("disabled" in $$props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ("href" in $$props) $$invalidate(3, href = $$new_props.href);
    		if ("outline" in $$props) $$invalidate(14, outline = $$new_props.outline);
    		if ("size" in $$props) $$invalidate(15, size = $$new_props.size);
    		if ("style" in $$props) $$invalidate(4, style = $$new_props.style);
    		if ("value" in $$props) $$invalidate(5, value = $$new_props.value);
    		if ("ariaLabel" in $$props) $$invalidate(6, ariaLabel = $$new_props.ariaLabel);
    		if ("classes" in $$props) $$invalidate(7, classes = $$new_props.classes);
    		if ("defaultAriaLabel" in $$props) $$invalidate(8, defaultAriaLabel = $$new_props.defaultAriaLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(6, ariaLabel = $$props["aria-label"]);

    		if ($$self.$$.dirty & /*className, close, outline, color, size, block, active*/ 64514) {
    			$$invalidate(7, classes = classnames(className, { close }, close || "btn", close || `btn${outline ? "-outline" : ""}-${color}`, size ? `btn-${size}` : false, block ? "btn-block" : false, { active }));
    		}

    		if ($$self.$$.dirty & /*close*/ 2) {
    			$$invalidate(8, defaultAriaLabel = close ? "Close" : null);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		children,
    		close,
    		disabled,
    		href,
    		style,
    		value,
    		ariaLabel,
    		classes,
    		defaultAriaLabel,
    		$$restProps,
    		className,
    		active,
    		block,
    		color,
    		outline,
    		size,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$w, create_fragment$w, safe_not_equal, {
    			class: 10,
    			active: 11,
    			block: 12,
    			children: 0,
    			close: 1,
    			color: 13,
    			disabled: 2,
    			href: 3,
    			outline: 14,
    			size: 15,
    			style: 4,
    			value: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$w.name
    		});
    	}

    	get class() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get close() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set close(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outline() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outline(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Card.svelte generated by Svelte v3.37.0 */
    const file$v = "node_modules/sveltestrap/src/Card.svelte";

    function create_fragment$v(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let div_levels = [
    		/*$$restProps*/ ctx[2],
    		{ class: /*classes*/ ctx[1] },
    		{ style: /*style*/ ctx[0] }
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$v, 20, 0, 437);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[10], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 256) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] },
    				(!current || dirty & /*style*/ 1) && { style: /*style*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","body","color","inverse","outline","style"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Card", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { body = false } = $$props;
    	let { color = "" } = $$props;
    	let { inverse = false } = $$props;
    	let { outline = false } = $$props;
    	let { style = "" } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ("body" in $$new_props) $$invalidate(4, body = $$new_props.body);
    		if ("color" in $$new_props) $$invalidate(5, color = $$new_props.color);
    		if ("inverse" in $$new_props) $$invalidate(6, inverse = $$new_props.inverse);
    		if ("outline" in $$new_props) $$invalidate(7, outline = $$new_props.outline);
    		if ("style" in $$new_props) $$invalidate(0, style = $$new_props.style);
    		if ("$$scope" in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		body,
    		color,
    		inverse,
    		outline,
    		style,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(3, className = $$new_props.className);
    		if ("body" in $$props) $$invalidate(4, body = $$new_props.body);
    		if ("color" in $$props) $$invalidate(5, color = $$new_props.color);
    		if ("inverse" in $$props) $$invalidate(6, inverse = $$new_props.inverse);
    		if ("outline" in $$props) $$invalidate(7, outline = $$new_props.outline);
    		if ("style" in $$props) $$invalidate(0, style = $$new_props.style);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, inverse, body, color, outline*/ 248) {
    			$$invalidate(1, classes = classnames(className, "card", inverse ? "text-white" : false, body ? "card-body" : false, color ? `${outline ? "border" : "bg"}-${color}` : false));
    		}
    	};

    	return [
    		style,
    		classes,
    		$$restProps,
    		className,
    		body,
    		color,
    		inverse,
    		outline,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {
    			class: 3,
    			body: 4,
    			color: 5,
    			inverse: 6,
    			outline: 7,
    			style: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$v.name
    		});
    	}

    	get class() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get body() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set body(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inverse() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inverse(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outline() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outline(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/CardBody.svelte generated by Svelte v3.37.0 */
    const file$u = "node_modules/sveltestrap/src/CardBody.svelte";

    function create_fragment$u(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$u, 9, 0, 164);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CardBody", slots, ['default']);
    	let { class: className = "" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("$$scope" in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 4) {
    			$$invalidate(0, classes = classnames(className, "card-body"));
    		}
    	};

    	return [classes, $$restProps, className, $$scope, slots];
    }

    class CardBody extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, { class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardBody",
    			options,
    			id: create_fragment$u.name
    		});
    	}

    	get class() {
    		throw new Error("<CardBody>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CardBody>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/CardFooter.svelte generated by Svelte v3.37.0 */
    const file$t = "node_modules/sveltestrap/src/CardFooter.svelte";

    function create_fragment$t(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$t, 9, 0, 166);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CardFooter", slots, ['default']);
    	let { class: className = "" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("$$scope" in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 4) {
    			$$invalidate(0, classes = classnames(className, "card-footer"));
    		}
    	};

    	return [classes, $$restProps, className, $$scope, slots];
    }

    class CardFooter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, { class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardFooter",
    			options,
    			id: create_fragment$t.name
    		});
    	}

    	get class() {
    		throw new Error("<CardFooter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CardFooter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/CardHeader.svelte generated by Svelte v3.37.0 */
    const file$s = "node_modules/sveltestrap/src/CardHeader.svelte";

    // (15:0) {:else}
    function create_else_block$5(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	let div_levels = [/*$$restProps*/ ctx[2], { class: /*classes*/ ctx[1] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$s, 15, 2, 291);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler_1*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(15:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (11:0) {#if tag === 'h3'}
    function create_if_block$a(ctx) {
    	let h3;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	let h3_levels = [/*$$restProps*/ ctx[2], { class: /*classes*/ ctx[1] }];
    	let h3_data = {};

    	for (let i = 0; i < h3_levels.length; i += 1) {
    		h3_data = assign(h3_data, h3_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			if (default_slot) default_slot.c();
    			set_attributes(h3, h3_data);
    			add_location(h3, file$s, 11, 2, 213);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);

    			if (default_slot) {
    				default_slot.m(h3, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(h3, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}

    			set_attributes(h3, h3_data = get_spread_update(h3_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(11:0) {#if tag === 'h3'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$a, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tag*/ ctx[0] === "h3") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","tag"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CardHeader", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { tag = "div" } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function click_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ("tag" in $$new_props) $$invalidate(0, tag = $$new_props.tag);
    		if ("$$scope" in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, tag, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(3, className = $$new_props.className);
    		if ("tag" in $$props) $$invalidate(0, tag = $$new_props.tag);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 8) {
    			$$invalidate(1, classes = classnames(className, "card-header"));
    		}
    	};

    	return [
    		tag,
    		classes,
    		$$restProps,
    		className,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1
    	];
    }

    class CardHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { class: 3, tag: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardHeader",
    			options,
    			id: create_fragment$s.name
    		});
    	}

    	get class() {
    		throw new Error("<CardHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CardHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tag() {
    		throw new Error("<CardHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tag(value) {
    		throw new Error("<CardHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/CardSubtitle.svelte generated by Svelte v3.37.0 */
    const file$r = "node_modules/sveltestrap/src/CardSubtitle.svelte";

    function create_fragment$r(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$r, 9, 0, 168);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CardSubtitle", slots, ['default']);
    	let { class: className = "" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("$$scope" in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 4) {
    			$$invalidate(0, classes = classnames(className, "card-subtitle"));
    		}
    	};

    	return [classes, $$restProps, className, $$scope, slots];
    }

    class CardSubtitle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, { class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardSubtitle",
    			options,
    			id: create_fragment$r.name
    		});
    	}

    	get class() {
    		throw new Error("<CardSubtitle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CardSubtitle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/CardText.svelte generated by Svelte v3.37.0 */
    const file$q = "node_modules/sveltestrap/src/CardText.svelte";

    function create_fragment$q(ctx) {
    	let p;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	let p_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let p_data = {};

    	for (let i = 0; i < p_levels.length; i += 1) {
    		p_data = assign(p_data, p_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			if (default_slot) default_slot.c();
    			set_attributes(p, p_data);
    			add_location(p, file$q, 9, 0, 164);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);

    			if (default_slot) {
    				default_slot.m(p, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			set_attributes(p, p_data = get_spread_update(p_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CardText", slots, ['default']);
    	let { class: className = "" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("$$scope" in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 4) {
    			$$invalidate(0, classes = classnames(className, "card-text"));
    		}
    	};

    	return [classes, $$restProps, className, $$scope, slots];
    }

    class CardText extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardText",
    			options,
    			id: create_fragment$q.name
    		});
    	}

    	get class() {
    		throw new Error("<CardText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CardText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/CardTitle.svelte generated by Svelte v3.37.0 */
    const file$p = "node_modules/sveltestrap/src/CardTitle.svelte";

    function create_fragment$p(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$p, 9, 0, 165);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CardTitle", slots, ['default']);
    	let { class: className = "" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("$$scope" in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 4) {
    			$$invalidate(0, classes = classnames(className, "card-title"));
    		}
    	};

    	return [classes, $$restProps, className, $$scope, slots];
    }

    class CardTitle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardTitle",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get class() {
    		throw new Error("<CardTitle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CardTitle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Col.svelte generated by Svelte v3.37.0 */
    const file$o = "node_modules/sveltestrap/src/Col.svelte";

    function create_fragment$o(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let div_levels = [
    		/*$$restProps*/ ctx[1],
    		{
    			class: div_class_value = /*colClasses*/ ctx[0].join(" ")
    		}
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$o, 58, 0, 1388);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 256) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				{ class: div_class_value }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	const omit_props_names = ["class","xs","sm","md","lg","xl"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Col", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { xs = undefined } = $$props;
    	let { sm = undefined } = $$props;
    	let { md = undefined } = $$props;
    	let { lg = undefined } = $$props;
    	let { xl = undefined } = $$props;
    	const colClasses = [];
    	const lookup = { xs, sm, md, lg, xl };

    	Object.keys(lookup).forEach(colWidth => {
    		const columnProp = lookup[colWidth];

    		if (!columnProp && columnProp !== "") {
    			return; //no value for this width
    		}

    		const isXs = colWidth === "xs";

    		if (isObject(columnProp)) {
    			const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
    			const colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);

    			if (columnProp.size || columnProp.size === "") {
    				colClasses.push(colClass);
    			}

    			if (columnProp.push) {
    				colClasses.push(`push${colSizeInterfix}${columnProp.push}`);
    			}

    			if (columnProp.pull) {
    				colClasses.push(`pull${colSizeInterfix}${columnProp.pull}`);
    			}

    			if (columnProp.offset) {
    				colClasses.push(`offset${colSizeInterfix}${columnProp.offset}`);
    			}
    		} else {
    			colClasses.push(getColumnSizeClass(isXs, colWidth, columnProp));
    		}
    	});

    	if (!colClasses.length) {
    		colClasses.push("col");
    	}

    	if (className) {
    		colClasses.push(className);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("xs" in $$new_props) $$invalidate(3, xs = $$new_props.xs);
    		if ("sm" in $$new_props) $$invalidate(4, sm = $$new_props.sm);
    		if ("md" in $$new_props) $$invalidate(5, md = $$new_props.md);
    		if ("lg" in $$new_props) $$invalidate(6, lg = $$new_props.lg);
    		if ("xl" in $$new_props) $$invalidate(7, xl = $$new_props.xl);
    		if ("$$scope" in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getColumnSizeClass,
    		isObject,
    		className,
    		xs,
    		sm,
    		md,
    		lg,
    		xl,
    		colClasses,
    		lookup
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("xs" in $$props) $$invalidate(3, xs = $$new_props.xs);
    		if ("sm" in $$props) $$invalidate(4, sm = $$new_props.sm);
    		if ("md" in $$props) $$invalidate(5, md = $$new_props.md);
    		if ("lg" in $$props) $$invalidate(6, lg = $$new_props.lg);
    		if ("xl" in $$props) $$invalidate(7, xl = $$new_props.xl);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [colClasses, $$restProps, className, xs, sm, md, lg, xl, $$scope, slots];
    }

    class Col extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {
    			class: 2,
    			xs: 3,
    			sm: 4,
    			md: 5,
    			lg: 6,
    			xl: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Col",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get class() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xs() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xs(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sm() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sm(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get md() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set md(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lg() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lg(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xl() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xl(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Container.svelte generated by Svelte v3.37.0 */
    const file$n = "node_modules/sveltestrap/src/Container.svelte";

    function create_fragment$n(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$n, 10, 0, 220);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","fluid"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Container", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { fluid = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("fluid" in $$new_props) $$invalidate(3, fluid = $$new_props.fluid);
    		if ("$$scope" in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, fluid, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("fluid" in $$props) $$invalidate(3, fluid = $$new_props.fluid);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, fluid*/ 12) {
    			$$invalidate(0, classes = classnames(className, fluid ? "container-fluid" : "container"));
    		}
    	};

    	return [classes, $$restProps, className, fluid, $$scope, slots];
    }

    class Container extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { class: 2, fluid: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Container",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get class() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fluid() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fluid(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Icon.svelte generated by Svelte v3.37.0 */
    const file$m = "node_modules/sveltestrap/src/Icon.svelte";

    function create_fragment$m(ctx) {
    	let i;
    	let i_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let i_data = {};

    	for (let i = 0; i < i_levels.length; i += 1) {
    		i_data = assign(i_data, i_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			i = element("i");
    			set_attributes(i, i_data);
    			add_location(i, file$m, 14, 0, 301);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(i, i_data = get_spread_update(i_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				dirty & /*classes*/ 1 && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","name"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Icon", slots, []);
    	let { class: className = "" } = $$props;
    	let { name = "" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("name" in $$new_props) $$invalidate(3, name = $$new_props.name);
    	};

    	$$self.$capture_state = () => ({ classnames, className, name, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("name" in $$props) $$invalidate(3, name = $$new_props.name);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, name*/ 12) {
    			$$invalidate(0, classes = classnames(className, `bi-${name}`));
    		}
    	};

    	return [classes, $$restProps, className, name];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { class: 2, name: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get class() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Modal.svelte generated by Svelte v3.37.0 */

    const file$l = "node_modules/sveltestrap/src/Modal.svelte";
    const get_external_slot_changes = dirty => ({});
    const get_external_slot_context = ctx => ({});

    // (217:0) {#if _isMounted}
    function create_if_block$9(ctx) {
    	let div;
    	let current;
    	let if_block = /*isOpen*/ ctx[1] && create_if_block_1$7(ctx);

    	let div_levels = [
    		{ class: /*wrapClassName*/ ctx[4] },
    		{ tabindex: "-1" },
    		/*$$restProps*/ ctx[18]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			set_attributes(div, div_data);
    			add_location(div, file$l, 217, 2, 4706);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*isOpen*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*isOpen*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty[0] & /*wrapClassName*/ 16) && { class: /*wrapClassName*/ ctx[4] },
    				{ tabindex: "-1" },
    				dirty[0] & /*$$restProps*/ 262144 && /*$$restProps*/ ctx[18]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(217:0) {#if _isMounted}",
    		ctx
    	});

    	return block;
    }

    // (222:4) {#if isOpen}
    function create_if_block_1$7(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t0;
    	let div0_class_value;
    	let div2_class_value;
    	let div2_transition;
    	let t1;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const external_slot_template = /*#slots*/ ctx[33].external;
    	const external_slot = create_slot(external_slot_template, ctx, /*$$scope*/ ctx[32], get_external_slot_context);
    	const default_slot_template = /*#slots*/ ctx[33].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[32], null);
    	let if_block = /*backdrop*/ ctx[3] && !/*staticModal*/ ctx[0] && create_if_block_2$2(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (external_slot) external_slot.c();
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div0, "class", div0_class_value = classnames("modal-content", /*contentClassName*/ ctx[7]));
    			add_location(div0, file$l, 237, 10, 5340);
    			attr_dev(div1, "class", /*classes*/ ctx[13]);
    			attr_dev(div1, "role", "document");
    			add_location(div1, file$l, 236, 8, 5272);
    			attr_dev(div2, "arialabelledby", /*labelledBy*/ ctx[2]);

    			attr_dev(div2, "class", div2_class_value = classnames("modal", /*modalClassName*/ ctx[5], {
    				show: /*isOpen*/ ctx[1],
    				"d-block": /*isOpen*/ ctx[1],
    				"d-none": !/*isOpen*/ ctx[1],
    				"position-static": /*staticModal*/ ctx[0]
    			}));

    			attr_dev(div2, "role", "dialog");
    			add_location(div2, file$l, 222, 6, 4800);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			if (external_slot) {
    				external_slot.m(div0, null);
    			}

    			append_dev(div0, t0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			/*div1_binding*/ ctx[34](div1);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div2, "introend", /*onModalOpened*/ ctx[15], false, false, false),
    					listen_dev(div2, "outroend", /*onModalClosed*/ ctx[16], false, false, false),
    					listen_dev(div2, "click", /*handleBackdropClick*/ ctx[14], false, false, false),
    					listen_dev(div2, "mousedown", /*handleBackdropMouseDown*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (external_slot) {
    				if (external_slot.p && dirty[1] & /*$$scope*/ 2) {
    					update_slot(external_slot, external_slot_template, ctx, /*$$scope*/ ctx[32], dirty, get_external_slot_changes, get_external_slot_context);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty[1] & /*$$scope*/ 2) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[32], dirty, null, null);
    				}
    			}

    			if (!current || dirty[0] & /*contentClassName*/ 128 && div0_class_value !== (div0_class_value = classnames("modal-content", /*contentClassName*/ ctx[7]))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty[0] & /*classes*/ 8192) {
    				attr_dev(div1, "class", /*classes*/ ctx[13]);
    			}

    			if (!current || dirty[0] & /*labelledBy*/ 4) {
    				attr_dev(div2, "arialabelledby", /*labelledBy*/ ctx[2]);
    			}

    			if (!current || dirty[0] & /*modalClassName, isOpen, staticModal*/ 35 && div2_class_value !== (div2_class_value = classnames("modal", /*modalClassName*/ ctx[5], {
    				show: /*isOpen*/ ctx[1],
    				"d-block": /*isOpen*/ ctx[1],
    				"d-none": !/*isOpen*/ ctx[1],
    				"position-static": /*staticModal*/ ctx[0]
    			}))) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (/*backdrop*/ ctx[3] && !/*staticModal*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*backdrop, staticModal*/ 9) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(external_slot, local);
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (!div2_transition) div2_transition = create_bidirectional_transition(div2, /*transitionType*/ ctx[9], /*transitionOptions*/ ctx[10], true);
    				div2_transition.run(1);
    			});

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(external_slot, local);
    			transition_out(default_slot, local);
    			if (!div2_transition) div2_transition = create_bidirectional_transition(div2, /*transitionType*/ ctx[9], /*transitionOptions*/ ctx[10], false);
    			div2_transition.run(0);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (external_slot) external_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			/*div1_binding*/ ctx[34](null);
    			if (detaching && div2_transition) div2_transition.end();
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(222:4) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    // (244:6) {#if backdrop && !staticModal}
    function create_if_block_2$2(ctx) {
    	let div;
    	let div_class_value;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", div_class_value = classnames("modal-backdrop", "show", /*backdropClassName*/ ctx[6]));
    			add_location(div, file$l, 244, 8, 5548);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty[0] & /*backdropClassName*/ 64 && div_class_value !== (div_class_value = classnames("modal-backdrop", "show", /*backdropClassName*/ ctx[6]))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: /*backdropDuration*/ ctx[8] }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: /*backdropDuration*/ ctx[8] }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(244:6) {#if backdrop && !staticModal}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*_isMounted*/ ctx[11] && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*_isMounted*/ ctx[11]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*_isMounted*/ 2048) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$9(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    let openCount = 0;
    const dialogBaseClass = "modal-dialog";

    function noop() {
    	
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let classes;

    	const omit_props_names = [
    		"class","static","isOpen","autoFocus","centered","scrollable","size","toggle","labelledBy","backdrop","onEnter","onExit","onOpened","onClosed","wrapClassName","modalClassName","backdropClassName","contentClassName","fade","backdropDuration","unmountOnClose","returnFocusAfterClose","transitionType","transitionOptions"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Modal", slots, ['external','default']);
    	let { class: className = "" } = $$props;
    	let { static: staticModal = false } = $$props;
    	let { isOpen = false } = $$props;
    	let { autoFocus = true } = $$props;
    	let { centered = false } = $$props;
    	let { scrollable = false } = $$props;
    	let { size = "" } = $$props;
    	let { toggle = undefined } = $$props;
    	let { labelledBy = "" } = $$props;
    	let { backdrop = true } = $$props;
    	let { onEnter = undefined } = $$props;
    	let { onExit = undefined } = $$props;
    	let { onOpened = noop } = $$props;
    	let { onClosed = noop } = $$props;
    	let { wrapClassName = "" } = $$props;
    	let { modalClassName = "" } = $$props;
    	let { backdropClassName = "" } = $$props;
    	let { contentClassName = "" } = $$props;
    	let { fade: fade$1 = true } = $$props;
    	let { backdropDuration = fade$1 ? 150 : 0 } = $$props;
    	let { unmountOnClose = true } = $$props;
    	let { returnFocusAfterClose = true } = $$props;
    	let { transitionType = fade } = $$props;
    	let { transitionOptions = { duration: fade$1 ? 300 : 0 } } = $$props;
    	let hasOpened = false;
    	let _isMounted = false;
    	let _triggeringElement;
    	let _originalBodyPadding;
    	let _lastIsOpen = isOpen;
    	let _lastHasOpened = hasOpened;
    	let _dialog;
    	let _mouseDownElement;
    	let _removeEscListener;

    	onMount(() => {
    		if (isOpen) {
    			init();
    			hasOpened = true;
    		}

    		if (typeof onEnter === "function") {
    			onEnter();
    		}

    		if (hasOpened && autoFocus) {
    			setFocus();
    		}
    	});

    	onDestroy(() => {
    		if (typeof onExit === "function") {
    			onExit();
    		}

    		destroy();

    		if (hasOpened) {
    			close();
    		}
    	});

    	afterUpdate(() => {
    		if (isOpen && !_lastIsOpen) {
    			init();
    			hasOpened = true;
    		}

    		if (autoFocus && hasOpened && !_lastHasOpened) {
    			setFocus();
    		}

    		_lastIsOpen = isOpen;
    		_lastHasOpened = hasOpened;
    	});

    	function setFocus() {
    		if (_dialog && _dialog.parentNode && typeof _dialog.parentNode.focus === "function") {
    			_dialog.parentNode.focus();
    		}
    	}

    	function init() {
    		try {
    			_triggeringElement = document.activeElement;
    		} catch(err) {
    			_triggeringElement = null;
    		}

    		if (!staticModal) {
    			_originalBodyPadding = getOriginalBodyPadding();
    			conditionallyUpdateScrollbar();

    			if (openCount === 0) {
    				document.body.className = classnames(document.body.className, "modal-open");
    			}

    			++openCount;
    		}

    		$$invalidate(11, _isMounted = true);
    	}

    	function manageFocusAfterClose() {
    		if (_triggeringElement) {
    			if (typeof _triggeringElement.focus === "function" && returnFocusAfterClose) {
    				_triggeringElement.focus();
    			}

    			_triggeringElement = null;
    		}
    	}

    	function destroy() {
    		manageFocusAfterClose();
    	}

    	function close() {
    		if (openCount <= 1) {
    			const modalOpenClassName = "modal-open";
    			const modalOpenClassNameRegex = new RegExp(`(^| )${modalOpenClassName}( |$)`);
    			document.body.className = document.body.className.replace(modalOpenClassNameRegex, " ").trim();
    		}

    		manageFocusAfterClose();
    		openCount = Math.max(0, openCount - 1);
    		setScrollbarWidth(_originalBodyPadding);
    	}

    	function handleBackdropClick(e) {
    		if (e.target === _mouseDownElement) {
    			e.stopPropagation();

    			if (!isOpen || !backdrop) {
    				return;
    			}

    			const backdropElem = _dialog ? _dialog.parentNode : null;

    			if (backdropElem && e.target === backdropElem && toggle) {
    				toggle(e);
    			}
    		}
    	}

    	function onModalOpened() {
    		_removeEscListener = browserEvent(document, "keydown", event => {
    			if (event.key && event.key === "Escape") {
    				toggle(event);
    			}
    		});

    		onOpened();
    	}

    	function onModalClosed() {
    		onClosed();

    		if (_removeEscListener) {
    			_removeEscListener();
    		}

    		if (unmountOnClose) {
    			destroy();
    		}

    		close();

    		if (_isMounted) {
    			hasOpened = false;
    		}

    		$$invalidate(11, _isMounted = false);
    	}

    	function handleBackdropMouseDown(e) {
    		_mouseDownElement = e.target;
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			_dialog = $$value;
    			$$invalidate(12, _dialog);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(18, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(19, className = $$new_props.class);
    		if ("static" in $$new_props) $$invalidate(0, staticModal = $$new_props.static);
    		if ("isOpen" in $$new_props) $$invalidate(1, isOpen = $$new_props.isOpen);
    		if ("autoFocus" in $$new_props) $$invalidate(20, autoFocus = $$new_props.autoFocus);
    		if ("centered" in $$new_props) $$invalidate(21, centered = $$new_props.centered);
    		if ("scrollable" in $$new_props) $$invalidate(22, scrollable = $$new_props.scrollable);
    		if ("size" in $$new_props) $$invalidate(23, size = $$new_props.size);
    		if ("toggle" in $$new_props) $$invalidate(24, toggle = $$new_props.toggle);
    		if ("labelledBy" in $$new_props) $$invalidate(2, labelledBy = $$new_props.labelledBy);
    		if ("backdrop" in $$new_props) $$invalidate(3, backdrop = $$new_props.backdrop);
    		if ("onEnter" in $$new_props) $$invalidate(25, onEnter = $$new_props.onEnter);
    		if ("onExit" in $$new_props) $$invalidate(26, onExit = $$new_props.onExit);
    		if ("onOpened" in $$new_props) $$invalidate(27, onOpened = $$new_props.onOpened);
    		if ("onClosed" in $$new_props) $$invalidate(28, onClosed = $$new_props.onClosed);
    		if ("wrapClassName" in $$new_props) $$invalidate(4, wrapClassName = $$new_props.wrapClassName);
    		if ("modalClassName" in $$new_props) $$invalidate(5, modalClassName = $$new_props.modalClassName);
    		if ("backdropClassName" in $$new_props) $$invalidate(6, backdropClassName = $$new_props.backdropClassName);
    		if ("contentClassName" in $$new_props) $$invalidate(7, contentClassName = $$new_props.contentClassName);
    		if ("fade" in $$new_props) $$invalidate(29, fade$1 = $$new_props.fade);
    		if ("backdropDuration" in $$new_props) $$invalidate(8, backdropDuration = $$new_props.backdropDuration);
    		if ("unmountOnClose" in $$new_props) $$invalidate(30, unmountOnClose = $$new_props.unmountOnClose);
    		if ("returnFocusAfterClose" in $$new_props) $$invalidate(31, returnFocusAfterClose = $$new_props.returnFocusAfterClose);
    		if ("transitionType" in $$new_props) $$invalidate(9, transitionType = $$new_props.transitionType);
    		if ("transitionOptions" in $$new_props) $$invalidate(10, transitionOptions = $$new_props.transitionOptions);
    		if ("$$scope" in $$new_props) $$invalidate(32, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		openCount,
    		classnames,
    		browserEvent,
    		onDestroy,
    		onMount,
    		afterUpdate,
    		fadeTransition: fade,
    		conditionallyUpdateScrollbar,
    		getOriginalBodyPadding,
    		setScrollbarWidth,
    		noop,
    		className,
    		staticModal,
    		isOpen,
    		autoFocus,
    		centered,
    		scrollable,
    		size,
    		toggle,
    		labelledBy,
    		backdrop,
    		onEnter,
    		onExit,
    		onOpened,
    		onClosed,
    		wrapClassName,
    		modalClassName,
    		backdropClassName,
    		contentClassName,
    		fade: fade$1,
    		backdropDuration,
    		unmountOnClose,
    		returnFocusAfterClose,
    		transitionType,
    		transitionOptions,
    		hasOpened,
    		_isMounted,
    		_triggeringElement,
    		_originalBodyPadding,
    		_lastIsOpen,
    		_lastHasOpened,
    		_dialog,
    		_mouseDownElement,
    		_removeEscListener,
    		setFocus,
    		init,
    		manageFocusAfterClose,
    		destroy,
    		close,
    		handleBackdropClick,
    		onModalOpened,
    		onModalClosed,
    		handleBackdropMouseDown,
    		dialogBaseClass,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(19, className = $$new_props.className);
    		if ("staticModal" in $$props) $$invalidate(0, staticModal = $$new_props.staticModal);
    		if ("isOpen" in $$props) $$invalidate(1, isOpen = $$new_props.isOpen);
    		if ("autoFocus" in $$props) $$invalidate(20, autoFocus = $$new_props.autoFocus);
    		if ("centered" in $$props) $$invalidate(21, centered = $$new_props.centered);
    		if ("scrollable" in $$props) $$invalidate(22, scrollable = $$new_props.scrollable);
    		if ("size" in $$props) $$invalidate(23, size = $$new_props.size);
    		if ("toggle" in $$props) $$invalidate(24, toggle = $$new_props.toggle);
    		if ("labelledBy" in $$props) $$invalidate(2, labelledBy = $$new_props.labelledBy);
    		if ("backdrop" in $$props) $$invalidate(3, backdrop = $$new_props.backdrop);
    		if ("onEnter" in $$props) $$invalidate(25, onEnter = $$new_props.onEnter);
    		if ("onExit" in $$props) $$invalidate(26, onExit = $$new_props.onExit);
    		if ("onOpened" in $$props) $$invalidate(27, onOpened = $$new_props.onOpened);
    		if ("onClosed" in $$props) $$invalidate(28, onClosed = $$new_props.onClosed);
    		if ("wrapClassName" in $$props) $$invalidate(4, wrapClassName = $$new_props.wrapClassName);
    		if ("modalClassName" in $$props) $$invalidate(5, modalClassName = $$new_props.modalClassName);
    		if ("backdropClassName" in $$props) $$invalidate(6, backdropClassName = $$new_props.backdropClassName);
    		if ("contentClassName" in $$props) $$invalidate(7, contentClassName = $$new_props.contentClassName);
    		if ("fade" in $$props) $$invalidate(29, fade$1 = $$new_props.fade);
    		if ("backdropDuration" in $$props) $$invalidate(8, backdropDuration = $$new_props.backdropDuration);
    		if ("unmountOnClose" in $$props) $$invalidate(30, unmountOnClose = $$new_props.unmountOnClose);
    		if ("returnFocusAfterClose" in $$props) $$invalidate(31, returnFocusAfterClose = $$new_props.returnFocusAfterClose);
    		if ("transitionType" in $$props) $$invalidate(9, transitionType = $$new_props.transitionType);
    		if ("transitionOptions" in $$props) $$invalidate(10, transitionOptions = $$new_props.transitionOptions);
    		if ("hasOpened" in $$props) hasOpened = $$new_props.hasOpened;
    		if ("_isMounted" in $$props) $$invalidate(11, _isMounted = $$new_props._isMounted);
    		if ("_triggeringElement" in $$props) _triggeringElement = $$new_props._triggeringElement;
    		if ("_originalBodyPadding" in $$props) _originalBodyPadding = $$new_props._originalBodyPadding;
    		if ("_lastIsOpen" in $$props) _lastIsOpen = $$new_props._lastIsOpen;
    		if ("_lastHasOpened" in $$props) _lastHasOpened = $$new_props._lastHasOpened;
    		if ("_dialog" in $$props) $$invalidate(12, _dialog = $$new_props._dialog);
    		if ("_mouseDownElement" in $$props) _mouseDownElement = $$new_props._mouseDownElement;
    		if ("_removeEscListener" in $$props) _removeEscListener = $$new_props._removeEscListener;
    		if ("classes" in $$props) $$invalidate(13, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*className, size, centered, scrollable*/ 15204352) {
    			$$invalidate(13, classes = classnames(dialogBaseClass, className, {
    				[`modal-${size}`]: size,
    				[`${dialogBaseClass}-centered`]: centered,
    				[`${dialogBaseClass}-scrollable`]: scrollable
    			}));
    		}
    	};

    	return [
    		staticModal,
    		isOpen,
    		labelledBy,
    		backdrop,
    		wrapClassName,
    		modalClassName,
    		backdropClassName,
    		contentClassName,
    		backdropDuration,
    		transitionType,
    		transitionOptions,
    		_isMounted,
    		_dialog,
    		classes,
    		handleBackdropClick,
    		onModalOpened,
    		onModalClosed,
    		handleBackdropMouseDown,
    		$$restProps,
    		className,
    		autoFocus,
    		centered,
    		scrollable,
    		size,
    		toggle,
    		onEnter,
    		onExit,
    		onOpened,
    		onClosed,
    		fade$1,
    		unmountOnClose,
    		returnFocusAfterClose,
    		$$scope,
    		slots,
    		div1_binding
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$l,
    			create_fragment$l,
    			safe_not_equal,
    			{
    				class: 19,
    				static: 0,
    				isOpen: 1,
    				autoFocus: 20,
    				centered: 21,
    				scrollable: 22,
    				size: 23,
    				toggle: 24,
    				labelledBy: 2,
    				backdrop: 3,
    				onEnter: 25,
    				onExit: 26,
    				onOpened: 27,
    				onClosed: 28,
    				wrapClassName: 4,
    				modalClassName: 5,
    				backdropClassName: 6,
    				contentClassName: 7,
    				fade: 29,
    				backdropDuration: 8,
    				unmountOnClose: 30,
    				returnFocusAfterClose: 31,
    				transitionType: 9,
    				transitionOptions: 10
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get class() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get static() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set static(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoFocus() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoFocus(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get centered() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set centered(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollable() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollable(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggle() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggle(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelledBy() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelledBy(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backdrop() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backdrop(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onEnter() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onEnter(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onExit() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onExit(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onOpened() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onOpened(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClosed() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClosed(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get wrapClassName() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set wrapClassName(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get modalClassName() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modalClassName(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backdropClassName() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backdropClassName(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get contentClassName() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set contentClassName(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fade() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fade(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backdropDuration() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backdropDuration(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unmountOnClose() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unmountOnClose(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get returnFocusAfterClose() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set returnFocusAfterClose(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionType() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionType(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionOptions() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionOptions(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/ModalBody.svelte generated by Svelte v3.37.0 */
    const file$k = "node_modules/sveltestrap/src/ModalBody.svelte";

    function create_fragment$k(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$k, 9, 0, 165);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ModalBody", slots, ['default']);
    	let { class: className = "" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("$$scope" in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 4) {
    			$$invalidate(0, classes = classnames(className, "modal-body"));
    		}
    	};

    	return [classes, $$restProps, className, $$scope, slots];
    }

    class ModalBody extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModalBody",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get class() {
    		throw new Error("<ModalBody>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ModalBody>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/ModalFooter.svelte generated by Svelte v3.37.0 */
    const file$j = "node_modules/sveltestrap/src/ModalFooter.svelte";

    function create_fragment$j(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$j, 9, 0, 167);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ModalFooter", slots, ['default']);
    	let { class: className = "" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("$$scope" in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 4) {
    			$$invalidate(0, classes = classnames(className, "modal-footer"));
    		}
    	};

    	return [classes, $$restProps, className, $$scope, slots];
    }

    class ModalFooter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModalFooter",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get class() {
    		throw new Error("<ModalFooter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ModalFooter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/ModalHeader.svelte generated by Svelte v3.37.0 */
    const file$i = "node_modules/sveltestrap/src/ModalHeader.svelte";
    const get_close_slot_changes = dirty => ({});
    const get_close_slot_context = ctx => ({});

    // (21:4) {:else}
    function create_else_block$4(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 256) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(21:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (19:4) {#if children}
    function create_if_block_1$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*children*/ ctx[2]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 4) set_data_dev(t, /*children*/ ctx[2]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(19:4) {#if children}",
    		ctx
    	});

    	return block;
    }

    // (26:4) {#if typeof toggle === 'function'}
    function create_if_block$8(ctx) {
    	let button;
    	let span;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			span = element("span");
    			t = text(/*closeIcon*/ ctx[3]);
    			attr_dev(span, "aria-hidden", "true");
    			add_location(span, file$i, 31, 8, 735);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "close");
    			attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[1]);
    			add_location(button, file$i, 26, 6, 612);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, span);
    			append_dev(span, t);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*toggle*/ ctx[0])) /*toggle*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*closeIcon*/ 8) set_data_dev(t, /*closeIcon*/ ctx[3]);

    			if (dirty & /*closeAriaLabel*/ 2) {
    				attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(26:4) {#if typeof toggle === 'function'}",
    		ctx
    	});

    	return block;
    }

    // (25:21)      
    function fallback_block$1(ctx) {
    	let if_block_anchor;
    	let if_block = typeof /*toggle*/ ctx[0] === "function" && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (typeof /*toggle*/ ctx[0] === "function") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(25:21)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let div;
    	let h5;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let current;
    	const if_block_creators = [create_if_block_1$6, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*children*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const close_slot_template = /*#slots*/ ctx[9].close;
    	const close_slot = create_slot(close_slot_template, ctx, /*$$scope*/ ctx[8], get_close_slot_context);
    	const close_slot_or_fallback = close_slot || fallback_block$1(ctx);
    	let div_levels = [/*$$restProps*/ ctx[5], { class: /*classes*/ ctx[4] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h5 = element("h5");
    			if_block.c();
    			t = space();
    			if (close_slot_or_fallback) close_slot_or_fallback.c();
    			attr_dev(h5, "class", "modal-title");
    			add_location(h5, file$i, 17, 2, 439);
    			set_attributes(div, div_data);
    			add_location(div, file$i, 16, 0, 398);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h5);
    			if_blocks[current_block_type_index].m(h5, null);
    			append_dev(div, t);

    			if (close_slot_or_fallback) {
    				close_slot_or_fallback.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(h5, null);
    			}

    			if (close_slot) {
    				if (close_slot.p && dirty & /*$$scope*/ 256) {
    					update_slot(close_slot, close_slot_template, ctx, /*$$scope*/ ctx[8], dirty, get_close_slot_changes, get_close_slot_context);
    				}
    			} else {
    				if (close_slot_or_fallback && close_slot_or_fallback.p && dirty & /*closeAriaLabel, toggle, closeIcon*/ 11) {
    					close_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5],
    				(!current || dirty & /*classes*/ 16) && { class: /*classes*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(close_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(close_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			if (close_slot_or_fallback) close_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let closeIcon;
    	let classes;
    	const omit_props_names = ["class","toggle","closeAriaLabel","charCode","children"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ModalHeader", slots, ['default','close']);
    	let { class: className = "" } = $$props;
    	let { toggle = undefined } = $$props;
    	let { closeAriaLabel = "Close" } = $$props;
    	let { charCode = 215 } = $$props;
    	let { children = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(6, className = $$new_props.class);
    		if ("toggle" in $$new_props) $$invalidate(0, toggle = $$new_props.toggle);
    		if ("closeAriaLabel" in $$new_props) $$invalidate(1, closeAriaLabel = $$new_props.closeAriaLabel);
    		if ("charCode" in $$new_props) $$invalidate(7, charCode = $$new_props.charCode);
    		if ("children" in $$new_props) $$invalidate(2, children = $$new_props.children);
    		if ("$$scope" in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		toggle,
    		closeAriaLabel,
    		charCode,
    		children,
    		closeIcon,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(6, className = $$new_props.className);
    		if ("toggle" in $$props) $$invalidate(0, toggle = $$new_props.toggle);
    		if ("closeAriaLabel" in $$props) $$invalidate(1, closeAriaLabel = $$new_props.closeAriaLabel);
    		if ("charCode" in $$props) $$invalidate(7, charCode = $$new_props.charCode);
    		if ("children" in $$props) $$invalidate(2, children = $$new_props.children);
    		if ("closeIcon" in $$props) $$invalidate(3, closeIcon = $$new_props.closeIcon);
    		if ("classes" in $$props) $$invalidate(4, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*charCode*/ 128) {
    			$$invalidate(3, closeIcon = typeof charCode === "number"
    			? String.fromCharCode(charCode)
    			: charCode);
    		}

    		if ($$self.$$.dirty & /*className*/ 64) {
    			$$invalidate(4, classes = classnames(className, "modal-header"));
    		}
    	};

    	return [
    		toggle,
    		closeAriaLabel,
    		children,
    		closeIcon,
    		classes,
    		$$restProps,
    		className,
    		charCode,
    		$$scope,
    		slots
    	];
    }

    class ModalHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			class: 6,
    			toggle: 0,
    			closeAriaLabel: 1,
    			charCode: 7,
    			children: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModalHeader",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get class() {
    		throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggle() {
    		throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggle(value) {
    		throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeAriaLabel() {
    		throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeAriaLabel(value) {
    		throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get charCode() {
    		throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set charCode(value) {
    		throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Nav.svelte generated by Svelte v3.37.0 */
    const file$h = "node_modules/sveltestrap/src/Nav.svelte";

    function create_fragment$h(ctx) {
    	let ul;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let ul_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let ul_data = {};

    	for (let i = 0; i < ul_levels.length; i += 1) {
    		ul_data = assign(ul_data, ul_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			set_attributes(ul, ul_data);
    			add_location(ul, file$h, 39, 0, 941);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2048) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[11], dirty, null, null);
    				}
    			}

    			set_attributes(ul, ul_data = get_spread_update(ul_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getVerticalClass(vertical) {
    	if (vertical === false) {
    		return false;
    	} else if (vertical === true || vertical === "xs") {
    		return "flex-column";
    	}

    	return `flex-${vertical}-column`;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let classes;

    	const omit_props_names = [
    		"class","tabs","pills","vertical","horizontal","justified","fill","navbar","card"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Nav", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { tabs = false } = $$props;
    	let { pills = false } = $$props;
    	let { vertical = false } = $$props;
    	let { horizontal = "" } = $$props;
    	let { justified = false } = $$props;
    	let { fill = false } = $$props;
    	let { navbar = false } = $$props;
    	let { card = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("tabs" in $$new_props) $$invalidate(3, tabs = $$new_props.tabs);
    		if ("pills" in $$new_props) $$invalidate(4, pills = $$new_props.pills);
    		if ("vertical" in $$new_props) $$invalidate(5, vertical = $$new_props.vertical);
    		if ("horizontal" in $$new_props) $$invalidate(6, horizontal = $$new_props.horizontal);
    		if ("justified" in $$new_props) $$invalidate(7, justified = $$new_props.justified);
    		if ("fill" in $$new_props) $$invalidate(8, fill = $$new_props.fill);
    		if ("navbar" in $$new_props) $$invalidate(9, navbar = $$new_props.navbar);
    		if ("card" in $$new_props) $$invalidate(10, card = $$new_props.card);
    		if ("$$scope" in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		tabs,
    		pills,
    		vertical,
    		horizontal,
    		justified,
    		fill,
    		navbar,
    		card,
    		getVerticalClass,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("tabs" in $$props) $$invalidate(3, tabs = $$new_props.tabs);
    		if ("pills" in $$props) $$invalidate(4, pills = $$new_props.pills);
    		if ("vertical" in $$props) $$invalidate(5, vertical = $$new_props.vertical);
    		if ("horizontal" in $$props) $$invalidate(6, horizontal = $$new_props.horizontal);
    		if ("justified" in $$props) $$invalidate(7, justified = $$new_props.justified);
    		if ("fill" in $$props) $$invalidate(8, fill = $$new_props.fill);
    		if ("navbar" in $$props) $$invalidate(9, navbar = $$new_props.navbar);
    		if ("card" in $$props) $$invalidate(10, card = $$new_props.card);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, navbar, horizontal, vertical, tabs, card, pills, justified, fill*/ 2044) {
    			$$invalidate(0, classes = classnames(className, navbar ? "navbar-nav" : "nav", horizontal ? `justify-content-${horizontal}` : false, getVerticalClass(vertical), {
    				"nav-tabs": tabs,
    				"card-header-tabs": card && tabs,
    				"nav-pills": pills,
    				"card-header-pills": card && pills,
    				"nav-justified": justified,
    				"nav-fill": fill
    			}));
    		}
    	};

    	return [
    		classes,
    		$$restProps,
    		className,
    		tabs,
    		pills,
    		vertical,
    		horizontal,
    		justified,
    		fill,
    		navbar,
    		card,
    		$$scope,
    		slots
    	];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
    			class: 2,
    			tabs: 3,
    			pills: 4,
    			vertical: 5,
    			horizontal: 6,
    			justified: 7,
    			fill: 8,
    			navbar: 9,
    			card: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get class() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabs() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabs(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pills() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pills(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vertical() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vertical(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get horizontal() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set horizontal(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get justified() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set justified(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get navbar() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set navbar(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get card() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set card(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/NavItem.svelte generated by Svelte v3.37.0 */
    const file$g = "node_modules/sveltestrap/src/NavItem.svelte";

    function create_fragment$g(ctx) {
    	let li;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	let li_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (default_slot) default_slot.c();
    			set_attributes(li, li_data);
    			add_location(li, file$g, 10, 0, 219);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (default_slot) {
    				default_slot.m(li, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}

    			set_attributes(li, li_data = get_spread_update(li_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","active"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("NavItem", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { active = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("active" in $$new_props) $$invalidate(3, active = $$new_props.active);
    		if ("$$scope" in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, active, classes });

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("active" in $$props) $$invalidate(3, active = $$new_props.active);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, active*/ 12) {
    			$$invalidate(0, classes = classnames(className, "nav-item", active ? "active" : false));
    		}
    	};

    	return [classes, $$restProps, className, active, $$scope, slots];
    }

    class NavItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { class: 2, active: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavItem",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get class() {
    		throw new Error("<NavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<NavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<NavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/NavLink.svelte generated by Svelte v3.37.0 */
    const file$f = "node_modules/sveltestrap/src/NavLink.svelte";

    function create_fragment$f(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	let a_levels = [
    		/*$$restProps*/ ctx[3],
    		{ href: /*href*/ ctx[0] },
    		{ class: /*classes*/ ctx[1] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$f, 27, 0, 472);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler*/ ctx[9], false, false, false),
    					listen_dev(a, "click", /*handleClick*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 128) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[7], dirty, null, null);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","disabled","active","href"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("NavLink", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { disabled = false } = $$props;
    	let { active = false } = $$props;
    	let { href = "#" } = $$props;

    	function handleClick(e) {
    		if (disabled) {
    			e.preventDefault();
    			e.stopImmediatePropagation();
    			return;
    		}

    		if (href === "#") {
    			e.preventDefault();
    		}
    	}

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ("disabled" in $$new_props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ("active" in $$new_props) $$invalidate(6, active = $$new_props.active);
    		if ("href" in $$new_props) $$invalidate(0, href = $$new_props.href);
    		if ("$$scope" in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		disabled,
    		active,
    		href,
    		handleClick,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
    		if ("disabled" in $$props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ("active" in $$props) $$invalidate(6, active = $$new_props.active);
    		if ("href" in $$props) $$invalidate(0, href = $$new_props.href);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, disabled, active*/ 112) {
    			$$invalidate(1, classes = classnames(className, "nav-link", { disabled, active }));
    		}
    	};

    	return [
    		href,
    		classes,
    		handleClick,
    		$$restProps,
    		className,
    		disabled,
    		active,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class NavLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			class: 4,
    			disabled: 5,
    			active: 6,
    			href: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavLink",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get class() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Pagination.svelte generated by Svelte v3.37.0 */
    const file$e = "node_modules/sveltestrap/src/Pagination.svelte";

    function create_fragment$e(ctx) {
    	let nav;
    	let ul;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	let nav_levels = [
    		/*$$restProps*/ ctx[3],
    		{ class: /*classes*/ ctx[1] },
    		{ "aria-label": /*ariaLabel*/ ctx[0] }
    	];

    	let nav_data = {};

    	for (let i = 0; i < nav_levels.length; i += 1) {
    		nav_data = assign(nav_data, nav_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			attr_dev(ul, "class", /*listClasses*/ ctx[2]);
    			add_location(ul, file$e, 17, 2, 414);
    			set_attributes(nav, nav_data);
    			add_location(nav, file$e, 16, 0, 350);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ul);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 128) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[7], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*listClasses*/ 4) {
    				attr_dev(ul, "class", /*listClasses*/ ctx[2]);
    			}

    			set_attributes(nav, nav_data = get_spread_update(nav_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] },
    				(!current || dirty & /*ariaLabel*/ 1) && { "aria-label": /*ariaLabel*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let classes;
    	let listClasses;
    	const omit_props_names = ["class","listClassName","size","ariaLabel"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Pagination", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { listClassName = "" } = $$props;
    	let { size = "" } = $$props;
    	let { ariaLabel = "pagination" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ("listClassName" in $$new_props) $$invalidate(5, listClassName = $$new_props.listClassName);
    		if ("size" in $$new_props) $$invalidate(6, size = $$new_props.size);
    		if ("ariaLabel" in $$new_props) $$invalidate(0, ariaLabel = $$new_props.ariaLabel);
    		if ("$$scope" in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		listClassName,
    		size,
    		ariaLabel,
    		classes,
    		listClasses
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
    		if ("listClassName" in $$props) $$invalidate(5, listClassName = $$new_props.listClassName);
    		if ("size" in $$props) $$invalidate(6, size = $$new_props.size);
    		if ("ariaLabel" in $$props) $$invalidate(0, ariaLabel = $$new_props.ariaLabel);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    		if ("listClasses" in $$props) $$invalidate(2, listClasses = $$new_props.listClasses);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 16) {
    			$$invalidate(1, classes = classnames(className));
    		}

    		if ($$self.$$.dirty & /*listClassName, size*/ 96) {
    			$$invalidate(2, listClasses = classnames(listClassName, "pagination", { [`pagination-${size}`]: !!size }));
    		}
    	};

    	return [
    		ariaLabel,
    		classes,
    		listClasses,
    		$$restProps,
    		className,
    		listClassName,
    		size,
    		$$scope,
    		slots
    	];
    }

    class Pagination extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			class: 4,
    			listClassName: 5,
    			size: 6,
    			ariaLabel: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pagination",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get class() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listClassName() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listClassName(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/PaginationItem.svelte generated by Svelte v3.37.0 */
    const file$d = "node_modules/sveltestrap/src/PaginationItem.svelte";

    function create_fragment$d(ctx) {
    	let li;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let li_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (default_slot) default_slot.c();
    			set_attributes(li, li_data);
    			add_location(li, file$d, 14, 0, 256);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (default_slot) {
    				default_slot.m(li, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], dirty, null, null);
    				}
    			}

    			set_attributes(li, li_data = get_spread_update(li_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","active","disabled"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PaginationItem", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { active = false } = $$props;
    	let { disabled = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("active" in $$new_props) $$invalidate(3, active = $$new_props.active);
    		if ("disabled" in $$new_props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ("$$scope" in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		active,
    		disabled,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("active" in $$props) $$invalidate(3, active = $$new_props.active);
    		if ("disabled" in $$props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, active, disabled*/ 28) {
    			$$invalidate(0, classes = classnames(className, "page-item", { active, disabled }));
    		}
    	};

    	return [classes, $$restProps, className, active, disabled, $$scope, slots];
    }

    class PaginationItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { class: 2, active: 3, disabled: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationItem",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get class() {
    		throw new Error("<PaginationItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<PaginationItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<PaginationItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<PaginationItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<PaginationItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<PaginationItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/PaginationLink.svelte generated by Svelte v3.37.0 */
    const file$c = "node_modules/sveltestrap/src/PaginationLink.svelte";

    // (47:2) {:else}
    function create_else_block$3(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4096) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[12], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(47:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (42:2) {#if previous || next || first || last}
    function create_if_block$7(ctx) {
    	let span0;
    	let t0;
    	let span1;
    	let t1;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			t0 = space();
    			span1 = element("span");
    			t1 = text(/*realLabel*/ ctx[7]);
    			attr_dev(span0, "aria-hidden", "true");
    			add_location(span0, file$c, 42, 4, 948);
    			attr_dev(span1, "class", "sr-only");
    			add_location(span1, file$c, 45, 4, 1024);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(span0, null);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, span1, anchor);
    			append_dev(span1, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4096) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[12], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*defaultCaret*/ 32) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			if (!current || dirty & /*realLabel*/ 128) set_data_dev(t1, /*realLabel*/ ctx[7]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span0);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(span1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(42:2) {#if previous || next || first || last}",
    		ctx
    	});

    	return block;
    }

    // (44:12) {defaultCaret}
    function fallback_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*defaultCaret*/ ctx[5]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*defaultCaret*/ 32) set_data_dev(t, /*defaultCaret*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(44:12) {defaultCaret}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let a;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$7, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*previous*/ ctx[1] || /*next*/ ctx[0] || /*first*/ ctx[2] || /*last*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let a_levels = [
    		/*$$restProps*/ ctx[8],
    		{ class: /*classes*/ ctx[6] },
    		{ href: /*href*/ ctx[4] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if_block.c();
    			set_attributes(a, a_data);
    			add_location(a, file$c, 40, 0, 849);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			if_blocks[current_block_type_index].m(a, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[14], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(a, null);
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 256 && /*$$restProps*/ ctx[8],
    				(!current || dirty & /*classes*/ 64) && { class: /*classes*/ ctx[6] },
    				(!current || dirty & /*href*/ 16) && { href: /*href*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let classes;
    	let realLabel;
    	const omit_props_names = ["class","next","previous","first","last","ariaLabel","href"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PaginationLink", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { next = false } = $$props;
    	let { previous = false } = $$props;
    	let { first = false } = $$props;
    	let { last = false } = $$props;
    	let { ariaLabel = "" } = $$props;
    	let { href = "" } = $$props;
    	let defaultAriaLabel;
    	let defaultCaret;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(9, className = $$new_props.class);
    		if ("next" in $$new_props) $$invalidate(0, next = $$new_props.next);
    		if ("previous" in $$new_props) $$invalidate(1, previous = $$new_props.previous);
    		if ("first" in $$new_props) $$invalidate(2, first = $$new_props.first);
    		if ("last" in $$new_props) $$invalidate(3, last = $$new_props.last);
    		if ("ariaLabel" in $$new_props) $$invalidate(10, ariaLabel = $$new_props.ariaLabel);
    		if ("href" in $$new_props) $$invalidate(4, href = $$new_props.href);
    		if ("$$scope" in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		next,
    		previous,
    		first,
    		last,
    		ariaLabel,
    		href,
    		defaultAriaLabel,
    		defaultCaret,
    		classes,
    		realLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(9, className = $$new_props.className);
    		if ("next" in $$props) $$invalidate(0, next = $$new_props.next);
    		if ("previous" in $$props) $$invalidate(1, previous = $$new_props.previous);
    		if ("first" in $$props) $$invalidate(2, first = $$new_props.first);
    		if ("last" in $$props) $$invalidate(3, last = $$new_props.last);
    		if ("ariaLabel" in $$props) $$invalidate(10, ariaLabel = $$new_props.ariaLabel);
    		if ("href" in $$props) $$invalidate(4, href = $$new_props.href);
    		if ("defaultAriaLabel" in $$props) $$invalidate(11, defaultAriaLabel = $$new_props.defaultAriaLabel);
    		if ("defaultCaret" in $$props) $$invalidate(5, defaultCaret = $$new_props.defaultCaret);
    		if ("classes" in $$props) $$invalidate(6, classes = $$new_props.classes);
    		if ("realLabel" in $$props) $$invalidate(7, realLabel = $$new_props.realLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 512) {
    			$$invalidate(6, classes = classnames(className, "page-link"));
    		}

    		if ($$self.$$.dirty & /*previous, next, first, last*/ 15) {
    			if (previous) {
    				$$invalidate(11, defaultAriaLabel = "Previous");
    			} else if (next) {
    				$$invalidate(11, defaultAriaLabel = "Next");
    			} else if (first) {
    				$$invalidate(11, defaultAriaLabel = "First");
    			} else if (last) {
    				$$invalidate(11, defaultAriaLabel = "Last");
    			}
    		}

    		if ($$self.$$.dirty & /*ariaLabel, defaultAriaLabel*/ 3072) {
    			$$invalidate(7, realLabel = ariaLabel || defaultAriaLabel);
    		}

    		if ($$self.$$.dirty & /*previous, next, first, last*/ 15) {
    			if (previous) {
    				$$invalidate(5, defaultCaret = "‹");
    			} else if (next) {
    				$$invalidate(5, defaultCaret = "›");
    			} else if (first) {
    				$$invalidate(5, defaultCaret = "«");
    			} else if (last) {
    				$$invalidate(5, defaultCaret = "»");
    			}
    		}
    	};

    	return [
    		next,
    		previous,
    		first,
    		last,
    		href,
    		defaultCaret,
    		classes,
    		realLabel,
    		$$restProps,
    		className,
    		ariaLabel,
    		defaultAriaLabel,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class PaginationLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			class: 9,
    			next: 0,
    			previous: 1,
    			first: 2,
    			last: 3,
    			ariaLabel: 10,
    			href: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationLink",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get class() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get next() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set next(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get previous() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set previous(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get first() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set first(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get last() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set last(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Row.svelte generated by Svelte v3.37.0 */
    const file$b = "node_modules/sveltestrap/src/Row.svelte";

    function create_fragment$b(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$b, 38, 0, 957);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 64) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[6], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getCols(cols) {
    	const colsValue = parseInt(cols);

    	if (!isNaN(colsValue)) {
    		if (colsValue > 0) {
    			return [`row-cols-${colsValue}`];
    		}
    	} else if (typeof cols === "object") {
    		return ["xs", "sm", "md", "lg", "xl"].map(colWidth => {
    			const isXs = colWidth === "xs";
    			const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
    			const value = cols[colWidth];

    			if (typeof value === "number" && value > 0) {
    				return `row-cols${colSizeInterfix}${value}`;
    			}

    			return null;
    		}).filter(value => !!value);
    	}

    	return [];
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","noGutters","form","cols"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Row", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { noGutters = false } = $$props;
    	let { form = false } = $$props;
    	let { cols = 0 } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("noGutters" in $$new_props) $$invalidate(3, noGutters = $$new_props.noGutters);
    		if ("form" in $$new_props) $$invalidate(4, form = $$new_props.form);
    		if ("cols" in $$new_props) $$invalidate(5, cols = $$new_props.cols);
    		if ("$$scope" in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		noGutters,
    		form,
    		cols,
    		getCols,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("noGutters" in $$props) $$invalidate(3, noGutters = $$new_props.noGutters);
    		if ("form" in $$props) $$invalidate(4, form = $$new_props.form);
    		if ("cols" in $$props) $$invalidate(5, cols = $$new_props.cols);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, noGutters, form, cols*/ 60) {
    			$$invalidate(0, classes = classnames(className, noGutters ? "no-gutters" : null, form ? "form-row" : "row", ...getCols(cols)));
    		}
    	};

    	return [classes, $$restProps, className, noGutters, form, cols, $$scope, slots];
    }

    class Row extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { class: 2, noGutters: 3, form: 4, cols: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Row",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get class() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutters() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutters(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get form() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set form(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cols() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cols(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Table.svelte generated by Svelte v3.37.0 */
    const file$a = "node_modules/sveltestrap/src/Table.svelte";

    // (35:0) {:else}
    function create_else_block$2(ctx) {
    	let table;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let table_levels = [/*$$restProps*/ ctx[3], { class: /*classes*/ ctx[1] }];
    	let table_data = {};

    	for (let i = 0; i < table_levels.length; i += 1) {
    		table_data = assign(table_data, table_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			if (default_slot) default_slot.c();
    			set_attributes(table, table_data);
    			add_location(table, file$a, 35, 2, 861);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);

    			if (default_slot) {
    				default_slot.m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2048) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[11], dirty, null, null);
    				}
    			}

    			set_attributes(table, table_data = get_spread_update(table_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(35:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (29:0) {#if responsive}
    function create_if_block$6(ctx) {
    	let div;
    	let table;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let table_levels = [/*$$restProps*/ ctx[3], { class: /*classes*/ ctx[1] }];
    	let table_data = {};

    	for (let i = 0; i < table_levels.length; i += 1) {
    		table_data = assign(table_data, table_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			if (default_slot) default_slot.c();
    			set_attributes(table, table_data);
    			add_location(table, file$a, 30, 4, 773);
    			attr_dev(div, "class", /*responsiveClassName*/ ctx[2]);
    			add_location(div, file$a, 29, 2, 735);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);

    			if (default_slot) {
    				default_slot.m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 2048) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[11], dirty, null, null);
    				}
    			}

    			set_attributes(table, table_data = get_spread_update(table_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));

    			if (!current || dirty & /*responsiveClassName*/ 4) {
    				attr_dev(div, "class", /*responsiveClassName*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(29:0) {#if responsive}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$6, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*responsive*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let classes;
    	let responsiveClassName;
    	const omit_props_names = ["class","size","bordered","borderless","striped","dark","hover","responsive"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Table", slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { size = "" } = $$props;
    	let { bordered = false } = $$props;
    	let { borderless = false } = $$props;
    	let { striped = false } = $$props;
    	let { dark = false } = $$props;
    	let { hover = false } = $$props;
    	let { responsive = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ("size" in $$new_props) $$invalidate(5, size = $$new_props.size);
    		if ("bordered" in $$new_props) $$invalidate(6, bordered = $$new_props.bordered);
    		if ("borderless" in $$new_props) $$invalidate(7, borderless = $$new_props.borderless);
    		if ("striped" in $$new_props) $$invalidate(8, striped = $$new_props.striped);
    		if ("dark" in $$new_props) $$invalidate(9, dark = $$new_props.dark);
    		if ("hover" in $$new_props) $$invalidate(10, hover = $$new_props.hover);
    		if ("responsive" in $$new_props) $$invalidate(0, responsive = $$new_props.responsive);
    		if ("$$scope" in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		size,
    		bordered,
    		borderless,
    		striped,
    		dark,
    		hover,
    		responsive,
    		classes,
    		responsiveClassName
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
    		if ("size" in $$props) $$invalidate(5, size = $$new_props.size);
    		if ("bordered" in $$props) $$invalidate(6, bordered = $$new_props.bordered);
    		if ("borderless" in $$props) $$invalidate(7, borderless = $$new_props.borderless);
    		if ("striped" in $$props) $$invalidate(8, striped = $$new_props.striped);
    		if ("dark" in $$props) $$invalidate(9, dark = $$new_props.dark);
    		if ("hover" in $$props) $$invalidate(10, hover = $$new_props.hover);
    		if ("responsive" in $$props) $$invalidate(0, responsive = $$new_props.responsive);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    		if ("responsiveClassName" in $$props) $$invalidate(2, responsiveClassName = $$new_props.responsiveClassName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, size, bordered, borderless, striped, dark, hover*/ 2032) {
    			$$invalidate(1, classes = classnames(className, "table", size ? "table-" + size : false, bordered ? "table-bordered" : false, borderless ? "table-borderless" : false, striped ? "table-striped" : false, dark ? "table-dark" : false, hover ? "table-hover" : false));
    		}

    		if ($$self.$$.dirty & /*responsive*/ 1) {
    			$$invalidate(2, responsiveClassName = responsive === true
    			? "table-responsive"
    			: `table-responsive-${responsive}`);
    		}
    	};

    	return [
    		responsive,
    		classes,
    		responsiveClassName,
    		$$restProps,
    		className,
    		size,
    		bordered,
    		borderless,
    		striped,
    		dark,
    		hover,
    		$$scope,
    		slots
    	];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			class: 4,
    			size: 5,
    			bordered: 6,
    			borderless: 7,
    			striped: 8,
    			dark: 9,
    			hover: 10,
    			responsive: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get class() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bordered() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bordered(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get borderless() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set borderless(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get striped() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set striped(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dark() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dark(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get responsive() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set responsive(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/front/AwardsAPI/TableAwards.svelte generated by Svelte v3.37.0 */

    const { Object: Object_1$2, console: console_1$5 } = globals;

    const file$9 = "src/front/AwardsAPI/TableAwards.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[35] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[38] = list[i];
    	return child_ctx;
    }

    // (298:4) {#if errorMsg}
    function create_if_block_1$5(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("ERROR: ");
    			t1 = text(/*errorMsg*/ ctx[6]);
    			set_style(p, "color", "red");
    			add_location(p, file$9, 298, 4, 8306);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*errorMsg*/ 64) set_data_dev(t1, /*errorMsg*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(298:4) {#if errorMsg}",
    		ctx
    	});

    	return block;
    }

    // (301:4) {#if okMsg}
    function create_if_block$5(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*okMsg*/ ctx[7]);
    			set_style(p, "color", "green");
    			add_location(p, file$9, 301, 4, 8380);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*okMsg*/ 128) set_data_dev(t, /*okMsg*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(301:4) {#if okMsg}",
    		ctx
    	});

    	return block;
    }

    // (323:20) <Button on:click={insertAwards}>
    function create_default_slot_10$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("insertar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$4.name,
    		type: "slot",
    		source: "(323:20) <Button on:click={insertAwards}>",
    		ctx
    	});

    	return block;
    }

    // (335:20) <Button color="secondary" on:click={searchAward}>
    function create_default_slot_9$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Buscar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$4.name,
    		type: "slot",
    		source: "(335:20) <Button color=\\\"secondary\\\" on:click={searchAward}>",
    		ctx
    	});

    	return block;
    }

    // (346:24) <Button on:click={deleteAwards(data.country,data.year)}>
    function create_default_slot_8$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$4.name,
    		type: "slot",
    		source: "(346:24) <Button on:click={deleteAwards(data.country,data.year)}>",
    		ctx
    	});

    	return block;
    }

    // (338:12) {#each awards as data}
    function create_each_block_1$2(ctx) {
    	let tr;
    	let td0;
    	let a;
    	let t0_value = /*data*/ ctx[38].country + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let td1;
    	let t2_value = /*data*/ ctx[38].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*data*/ ctx[38].gala + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*data*/ ctx[38].winner + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*data*/ ctx[38]["n-platform"] + "";
    	let t8;
    	let t9;
    	let td5;
    	let t10_value = /*data*/ ctx[38]["n-award"] + "";
    	let t10;
    	let t11;
    	let td6;
    	let button;
    	let t12;
    	let current;

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_8$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*deleteAwards*/ ctx[10](/*data*/ ctx[38].country, /*data*/ ctx[38].year))) /*deleteAwards*/ ctx[10](/*data*/ ctx[38].country, /*data*/ ctx[38].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			td6 = element("td");
    			create_component(button.$$.fragment);
    			t12 = space();
    			attr_dev(a, "href", a_href_value = "#/awards/" + /*data*/ ctx[38].country + "/" + /*data*/ ctx[38].year);
    			add_location(a, file$9, 339, 24, 9962);
    			add_location(td0, file$9, 339, 20, 9958);
    			add_location(td1, file$9, 340, 20, 10052);
    			add_location(td2, file$9, 341, 20, 10093);
    			add_location(td3, file$9, 342, 20, 10134);
    			add_location(td4, file$9, 343, 20, 10177);
    			add_location(td5, file$9, 344, 20, 10227);
    			add_location(td6, file$9, 345, 20, 10274);
    			add_location(tr, file$9, 338, 16, 9933);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, a);
    			append_dev(a, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, t10);
    			append_dev(tr, t11);
    			append_dev(tr, td6);
    			mount_component(button, td6, null);
    			append_dev(tr, t12);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*awards*/ 1) && t0_value !== (t0_value = /*data*/ ctx[38].country + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty[0] & /*awards*/ 1 && a_href_value !== (a_href_value = "#/awards/" + /*data*/ ctx[38].country + "/" + /*data*/ ctx[38].year)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((!current || dirty[0] & /*awards*/ 1) && t2_value !== (t2_value = /*data*/ ctx[38].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*awards*/ 1) && t4_value !== (t4_value = /*data*/ ctx[38].gala + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*awards*/ 1) && t6_value !== (t6_value = /*data*/ ctx[38].winner + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*awards*/ 1) && t8_value !== (t8_value = /*data*/ ctx[38]["n-platform"] + "")) set_data_dev(t8, t8_value);
    			if ((!current || dirty[0] & /*awards*/ 1) && t10_value !== (t10_value = /*data*/ ctx[38]["n-award"] + "")) set_data_dev(t10, t10_value);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 1024) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(338:12) {#each awards as data}",
    		ctx
    	});

    	return block;
    }

    // (304:4) <Table bordered>
    function create_default_slot_7$4(ctx) {
    	let thead;
    	let tr0;
    	let td0;
    	let t1;
    	let td1;
    	let t3;
    	let td2;
    	let t5;
    	let td3;
    	let t7;
    	let td4;
    	let t9;
    	let td5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td6;
    	let input0;
    	let t12;
    	let td7;
    	let input1;
    	let t13;
    	let td8;
    	let input2;
    	let t14;
    	let td9;
    	let input3;
    	let t15;
    	let td10;
    	let input4;
    	let t16;
    	let td11;
    	let input5;
    	let t17;
    	let td12;
    	let button0;
    	let t18;
    	let tr2;
    	let td13;
    	let input6;
    	let t19;
    	let td14;
    	let input7;
    	let t20;
    	let td15;
    	let input8;
    	let t21;
    	let td16;
    	let input9;
    	let t22;
    	let td17;
    	let input10;
    	let t23;
    	let td18;
    	let input11;
    	let t24;
    	let td19;
    	let button1;
    	let t25;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_10$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*insertAwards*/ ctx[9]);

    	button1 = new Button({
    			props: {
    				color: "secondary",
    				$$slots: { default: [create_default_slot_9$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*searchAward*/ ctx[12]);
    	let each_value_1 = /*awards*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			td0 = element("td");
    			td0.textContent = "pais";
    			t1 = space();
    			td1 = element("td");
    			td1.textContent = "año";
    			t3 = space();
    			td2 = element("td");
    			td2.textContent = "gala";
    			t5 = space();
    			td3 = element("td");
    			td3.textContent = "ganador";
    			t7 = space();
    			td4 = element("td");
    			td4.textContent = "numero de plataformas";
    			t9 = space();
    			td5 = element("td");
    			td5.textContent = "numero de premios ganados";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td6 = element("td");
    			input0 = element("input");
    			t12 = space();
    			td7 = element("td");
    			input1 = element("input");
    			t13 = space();
    			td8 = element("td");
    			input2 = element("input");
    			t14 = space();
    			td9 = element("td");
    			input3 = element("input");
    			t15 = space();
    			td10 = element("td");
    			input4 = element("input");
    			t16 = space();
    			td11 = element("td");
    			input5 = element("input");
    			t17 = space();
    			td12 = element("td");
    			create_component(button0.$$.fragment);
    			t18 = space();
    			tr2 = element("tr");
    			td13 = element("td");
    			input6 = element("input");
    			t19 = space();
    			td14 = element("td");
    			input7 = element("input");
    			t20 = space();
    			td15 = element("td");
    			input8 = element("input");
    			t21 = space();
    			td16 = element("td");
    			input9 = element("input");
    			t22 = space();
    			td17 = element("td");
    			input10 = element("input");
    			t23 = space();
    			td18 = element("td");
    			input11 = element("input");
    			t24 = space();
    			td19 = element("td");
    			create_component(button1.$$.fragment);
    			t25 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(td0, file$9, 306, 16, 8496);
    			add_location(td1, file$9, 307, 16, 8526);
    			add_location(td2, file$9, 308, 16, 8555);
    			add_location(td3, file$9, 309, 16, 8585);
    			add_location(td4, file$9, 310, 16, 8618);
    			add_location(td5, file$9, 311, 16, 8665);
    			add_location(tr0, file$9, 305, 12, 8475);
    			add_location(thead, file$9, 304, 8, 8455);
    			add_location(input0, file$9, 316, 20, 8788);
    			add_location(td6, file$9, 316, 16, 8784);
    			attr_dev(input1, "type", "number");
    			add_location(input1, file$9, 317, 20, 8851);
    			add_location(td7, file$9, 317, 16, 8847);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$9, 318, 20, 8923);
    			add_location(td8, file$9, 318, 16, 8919);
    			add_location(input3, file$9, 319, 20, 8995);
    			add_location(td9, file$9, 319, 16, 8991);
    			attr_dev(input4, "type", "number");
    			add_location(input4, file$9, 320, 20, 9057);
    			add_location(td10, file$9, 320, 16, 9053);
    			attr_dev(input5, "type", "number");
    			add_location(input5, file$9, 321, 20, 9138);
    			add_location(td11, file$9, 321, 16, 9134);
    			add_location(td12, file$9, 322, 16, 9212);
    			add_location(tr1, file$9, 315, 12, 8763);
    			add_location(input6, file$9, 327, 20, 9344);
    			add_location(td13, file$9, 327, 16, 9340);
    			attr_dev(input7, "type", "number");
    			add_location(input7, file$9, 328, 20, 9407);
    			add_location(td14, file$9, 328, 16, 9403);
    			attr_dev(input8, "type", "number");
    			add_location(input8, file$9, 329, 20, 9479);
    			add_location(td15, file$9, 329, 16, 9475);
    			add_location(input9, file$9, 330, 20, 9551);
    			add_location(td16, file$9, 330, 16, 9547);
    			attr_dev(input10, "type", "number");
    			add_location(input10, file$9, 331, 20, 9613);
    			add_location(td17, file$9, 331, 16, 9609);
    			attr_dev(input11, "type", "number");
    			add_location(input11, file$9, 332, 20, 9690);
    			add_location(td18, file$9, 332, 16, 9686);
    			add_location(td19, file$9, 334, 16, 9777);
    			add_location(tr2, file$9, 326, 12, 9319);
    			add_location(tbody, file$9, 314, 8, 8743);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, t1);
    			append_dev(tr0, td1);
    			append_dev(tr0, t3);
    			append_dev(tr0, td2);
    			append_dev(tr0, t5);
    			append_dev(tr0, td3);
    			append_dev(tr0, t7);
    			append_dev(tr0, td4);
    			append_dev(tr0, t9);
    			append_dev(tr0, td5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td6);
    			append_dev(td6, input0);
    			set_input_value(input0, /*newAward*/ ctx[1].country);
    			append_dev(tr1, t12);
    			append_dev(tr1, td7);
    			append_dev(td7, input1);
    			set_input_value(input1, /*newAward*/ ctx[1].year);
    			append_dev(tr1, t13);
    			append_dev(tr1, td8);
    			append_dev(td8, input2);
    			set_input_value(input2, /*newAward*/ ctx[1].gala);
    			append_dev(tr1, t14);
    			append_dev(tr1, td9);
    			append_dev(td9, input3);
    			set_input_value(input3, /*newAward*/ ctx[1].winner);
    			append_dev(tr1, t15);
    			append_dev(tr1, td10);
    			append_dev(td10, input4);
    			set_input_value(input4, /*newAward*/ ctx[1]["n-platform"]);
    			append_dev(tr1, t16);
    			append_dev(tr1, td11);
    			append_dev(td11, input5);
    			set_input_value(input5, /*newAward*/ ctx[1]["n-award"]);
    			append_dev(tr1, t17);
    			append_dev(tr1, td12);
    			mount_component(button0, td12, null);
    			append_dev(tbody, t18);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td13);
    			append_dev(td13, input6);
    			set_input_value(input6, /*busqueda*/ ctx[2].country);
    			append_dev(tr2, t19);
    			append_dev(tr2, td14);
    			append_dev(td14, input7);
    			set_input_value(input7, /*busqueda*/ ctx[2].year);
    			append_dev(tr2, t20);
    			append_dev(tr2, td15);
    			append_dev(td15, input8);
    			set_input_value(input8, /*busqueda*/ ctx[2].gala);
    			append_dev(tr2, t21);
    			append_dev(tr2, td16);
    			append_dev(td16, input9);
    			set_input_value(input9, /*busqueda*/ ctx[2].winner);
    			append_dev(tr2, t22);
    			append_dev(tr2, td17);
    			append_dev(td17, input10);
    			set_input_value(input10, /*busqueda*/ ctx[2].nplatform);
    			append_dev(tr2, t23);
    			append_dev(tr2, td18);
    			append_dev(td18, input11);
    			set_input_value(input11, /*busqueda*/ ctx[2].naward);
    			append_dev(tr2, t24);
    			append_dev(tr2, td19);
    			mount_component(button1, td19, null);
    			append_dev(tbody, t25);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[14]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[15]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[16]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[17]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[18]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[19]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[20]),
    					listen_dev(input7, "input", /*input7_input_handler*/ ctx[21]),
    					listen_dev(input8, "input", /*input8_input_handler*/ ctx[22]),
    					listen_dev(input9, "input", /*input9_input_handler*/ ctx[23]),
    					listen_dev(input10, "input", /*input10_input_handler*/ ctx[24]),
    					listen_dev(input11, "input", /*input11_input_handler*/ ctx[25])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*newAward*/ 2 && input0.value !== /*newAward*/ ctx[1].country) {
    				set_input_value(input0, /*newAward*/ ctx[1].country);
    			}

    			if (dirty[0] & /*newAward*/ 2 && to_number(input1.value) !== /*newAward*/ ctx[1].year) {
    				set_input_value(input1, /*newAward*/ ctx[1].year);
    			}

    			if (dirty[0] & /*newAward*/ 2 && to_number(input2.value) !== /*newAward*/ ctx[1].gala) {
    				set_input_value(input2, /*newAward*/ ctx[1].gala);
    			}

    			if (dirty[0] & /*newAward*/ 2 && input3.value !== /*newAward*/ ctx[1].winner) {
    				set_input_value(input3, /*newAward*/ ctx[1].winner);
    			}

    			if (dirty[0] & /*newAward*/ 2 && to_number(input4.value) !== /*newAward*/ ctx[1]["n-platform"]) {
    				set_input_value(input4, /*newAward*/ ctx[1]["n-platform"]);
    			}

    			if (dirty[0] & /*newAward*/ 2 && to_number(input5.value) !== /*newAward*/ ctx[1]["n-award"]) {
    				set_input_value(input5, /*newAward*/ ctx[1]["n-award"]);
    			}

    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 1024) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);

    			if (dirty[0] & /*busqueda*/ 4 && input6.value !== /*busqueda*/ ctx[2].country) {
    				set_input_value(input6, /*busqueda*/ ctx[2].country);
    			}

    			if (dirty[0] & /*busqueda*/ 4 && to_number(input7.value) !== /*busqueda*/ ctx[2].year) {
    				set_input_value(input7, /*busqueda*/ ctx[2].year);
    			}

    			if (dirty[0] & /*busqueda*/ 4 && to_number(input8.value) !== /*busqueda*/ ctx[2].gala) {
    				set_input_value(input8, /*busqueda*/ ctx[2].gala);
    			}

    			if (dirty[0] & /*busqueda*/ 4 && input9.value !== /*busqueda*/ ctx[2].winner) {
    				set_input_value(input9, /*busqueda*/ ctx[2].winner);
    			}

    			if (dirty[0] & /*busqueda*/ 4 && to_number(input10.value) !== /*busqueda*/ ctx[2].nplatform) {
    				set_input_value(input10, /*busqueda*/ ctx[2].nplatform);
    			}

    			if (dirty[0] & /*busqueda*/ 4 && to_number(input11.value) !== /*busqueda*/ ctx[2].naward) {
    				set_input_value(input11, /*busqueda*/ ctx[2].naward);
    			}

    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 1024) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);

    			if (dirty[0] & /*deleteAwards, awards*/ 1025) {
    				each_value_1 = /*awards*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button0);
    			destroy_component(button1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$4.name,
    		type: "slot",
    		source: "(304:4) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (358:13) <Button on:click={deleteAllAwards}>
    function create_default_slot_6$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar Todo");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$4.name,
    		type: "slot",
    		source: "(358:13) <Button on:click={deleteAllAwards}>",
    		ctx
    	});

    	return block;
    }

    // (359:13) <Button on:click={getLoadAwards}>
    function create_default_slot_5$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar Valores Iniciales");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$4.name,
    		type: "slot",
    		source: "(359:13) <Button on:click={getLoadAwards}>",
    		ctx
    	});

    	return block;
    }

    // (364:4) <PaginationItem class={current_page === 1 ? "disabled" : ""}>
    function create_default_slot_4$6(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: { previous: true, href: "#/awards" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler*/ ctx[26]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$6.name,
    		type: "slot",
    		source: "(364:4) <PaginationItem class={current_page === 1 ? \\\"disabled\\\" : \\\"\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (373:8) <PaginationLink           previous           href="#/awards"           on:click={() => changePage(page, (page - 1) * 10)}           >
    function create_default_slot_3$6(ctx) {
    	let t_value = /*page*/ ctx[35] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*last_page*/ 32 && t_value !== (t_value = /*page*/ ctx[35] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$6.name,
    		type: "slot",
    		source: "(373:8) <PaginationLink           previous           href=\\\"#/awards\\\"           on:click={() => changePage(page, (page - 1) * 10)}           >",
    		ctx
    	});

    	return block;
    }

    // (372:6) <PaginationItem class={current_page === page ? "active" : ""}>
    function create_default_slot_2$7(ctx) {
    	let paginationlink;
    	let current;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[27](/*page*/ ctx[35]);
    	}

    	paginationlink = new PaginationLink({
    			props: {
    				previous: true,
    				href: "#/awards",
    				$$slots: { default: [create_default_slot_3$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", click_handler_1);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const paginationlink_changes = {};

    			if (dirty[0] & /*last_page*/ 32 | dirty[1] & /*$$scope*/ 1024) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$7.name,
    		type: "slot",
    		source: "(372:6) <PaginationItem class={current_page === page ? \\\"active\\\" : \\\"\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (371:4) {#each range(last_page, 1) as page}
    function create_each_block$2(ctx) {
    	let paginationitem;
    	let current;

    	paginationitem = new PaginationItem({
    			props: {
    				class: /*current_page*/ ctx[4] === /*page*/ ctx[35]
    				? "active"
    				: "",
    				$$slots: { default: [create_default_slot_2$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*current_page, last_page*/ 48) paginationitem_changes.class = /*current_page*/ ctx[4] === /*page*/ ctx[35]
    			? "active"
    			: "";

    			if (dirty[0] & /*last_page*/ 32 | dirty[1] & /*$$scope*/ 1024) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(371:4) {#each range(last_page, 1) as page}",
    		ctx
    	});

    	return block;
    }

    // (381:4) <PaginationItem class={current_page === last_page ? "disabled" : ""}>
    function create_default_slot_1$7(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: { next: true, href: "#/awards" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_2*/ ctx[28]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$7.name,
    		type: "slot",
    		source: "(381:4) <PaginationItem class={current_page === last_page ? \\\"disabled\\\" : \\\"\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (363:2) <Pagination ariaLabel="Web pagination">
    function create_default_slot$8(ctx) {
    	let paginationitem0;
    	let t0;
    	let t1;
    	let paginationitem1;
    	let current;

    	paginationitem0 = new PaginationItem({
    			props: {
    				class: /*current_page*/ ctx[4] === 1 ? "disabled" : "",
    				$$slots: { default: [create_default_slot_4$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value = range$2(/*last_page*/ ctx[5], 1);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	paginationitem1 = new PaginationItem({
    			props: {
    				class: /*current_page*/ ctx[4] === /*last_page*/ ctx[5]
    				? "disabled"
    				: "",
    				$$slots: { default: [create_default_slot_1$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem0.$$.fragment);
    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			create_component(paginationitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem0, target, anchor);
    			insert_dev(target, t0, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			mount_component(paginationitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem0_changes = {};
    			if (dirty[0] & /*current_page*/ 16) paginationitem0_changes.class = /*current_page*/ ctx[4] === 1 ? "disabled" : "";

    			if (dirty[0] & /*current_page, current_offset*/ 24 | dirty[1] & /*$$scope*/ 1024) {
    				paginationitem0_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem0.$set(paginationitem0_changes);

    			if (dirty[0] & /*current_page, last_page, changePage*/ 8240) {
    				each_value = range$2(/*last_page*/ ctx[5], 1);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t1.parentNode, t1);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const paginationitem1_changes = {};

    			if (dirty[0] & /*current_page, last_page*/ 48) paginationitem1_changes.class = /*current_page*/ ctx[4] === /*last_page*/ ctx[5]
    			? "disabled"
    			: "";

    			if (dirty[0] & /*current_page, current_offset*/ 24 | dirty[1] & /*$$scope*/ 1024) {
    				paginationitem1_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem1.$set(paginationitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem0.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(paginationitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem0.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(paginationitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(paginationitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(363:2) <Pagination ariaLabel=\\\"Web pagination\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let t2;
    	let t3;
    	let table;
    	let t4;
    	let tr;
    	let td0;
    	let button0;
    	let t5;
    	let td1;
    	let button1;
    	let t6;
    	let pagination;
    	let current;
    	let if_block0 = /*errorMsg*/ ctx[6] && create_if_block_1$5(ctx);
    	let if_block1 = /*okMsg*/ ctx[7] && create_if_block$5(ctx);

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_7$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_6$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*deleteAllAwards*/ ctx[11]);

    	button1 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_5$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*getLoadAwards*/ ctx[8]);

    	pagination = new Pagination({
    			props: {
    				ariaLabel: "Web pagination",
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Tabla relacionada con los premios a videojuegos";
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			create_component(table.$$.fragment);
    			t4 = space();
    			tr = element("tr");
    			td0 = element("td");
    			create_component(button0.$$.fragment);
    			t5 = space();
    			td1 = element("td");
    			create_component(button1.$$.fragment);
    			t6 = space();
    			create_component(pagination.$$.fragment);
    			attr_dev(h1, "class", "svelte-ltgkn4");
    			add_location(h1, file$9, 296, 4, 8226);
    			add_location(td0, file$9, 357, 8, 10541);
    			add_location(td1, file$9, 358, 8, 10616);
    			add_location(tr, file$9, 356, 4, 10528);
    			attr_dev(main, "class", "svelte-ltgkn4");
    			add_location(main, file$9, 295, 0, 8215);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t2);
    			if (if_block1) if_block1.m(main, null);
    			append_dev(main, t3);
    			mount_component(table, main, null);
    			append_dev(main, t4);
    			append_dev(main, tr);
    			append_dev(tr, td0);
    			mount_component(button0, td0, null);
    			append_dev(tr, t5);
    			append_dev(tr, td1);
    			mount_component(button1, td1, null);
    			append_dev(main, t6);
    			mount_component(pagination, main, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*errorMsg*/ ctx[6]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$5(ctx);
    					if_block0.c();
    					if_block0.m(main, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*okMsg*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$5(ctx);
    					if_block1.c();
    					if_block1.m(main, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			const table_changes = {};

    			if (dirty[0] & /*awards, busqueda, newAward*/ 7 | dirty[1] & /*$$scope*/ 1024) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 1024) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 1024) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const pagination_changes = {};

    			if (dirty[0] & /*current_page, last_page, current_offset*/ 56 | dirty[1] & /*$$scope*/ 1024) {
    				pagination_changes.$$scope = { dirty, ctx };
    			}

    			pagination.$set(pagination_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(table);
    			destroy_component(button0);
    			destroy_component(button1);
    			destroy_component(pagination);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const BASE = "/api/v1";

    //Calcula el rango entre ods valores
    function range$2(size, startAt = 0) {
    	return [...Array(size).keys()].map(i => i + startAt);
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TableAwards", slots, []);
    	let awards = [];

    	let newAward = {
    		"country": "",
    		"year": 0,
    		"gala": 0,
    		"winner": "",
    		"n-platform": 0,
    		"n-award": 0
    	};

    	let busqueda = {
    		"country": "",
    		"year": "",
    		"gala": "",
    		"winner": "",
    		"nplatform": "",
    		"naward": ""
    	};

    	let fullQuery = "";

    	//Pagination
    	let current_offset = 0;

    	let limit = 10;
    	let current_page = 1;
    	let last_page = 1;
    	let total = 0;
    	let errorMsg = "";
    	let okMsg = "";
    	let errorStatus = 0;

    	async function getAwards() {
    		console.log("Fetching awards ...");
    		const res = await fetch(BASE + "/awards?limit=" + limit + "&offset=" + current_offset);

    		if (res.ok) {
    			console.log("Ok");
    			const json = await res.json();
    			$$invalidate(0, awards = json);
    			console.log(`We have received ${awards.length} __.`);
    			$$invalidate(6, errorMsg = "");
    			getNumTotal();
    		} else {
    			if (awards.length === 0) {
    				$$invalidate(6, errorMsg = "No hay datos disponibles");
    				console.log("ERROR!");
    			}

    			if (res.status === 500) {
    				$$invalidate(6, errorMsg = "No se han podido acceder a la base de datos");
    			} else if (res.status === 404) {
    				$$invalidate(6, errorMsg = "No se han encontrado datos");
    			}

    			$$invalidate(7, okMsg = "");
    			console.log("ERROR!" + errorMsg);
    		}
    	}

    	async function getLoadAwards() {
    		console.log("Fetching awards ...");

    		await fetch(BASE + "/awards/LoadInitialData").then(res => {
    			if (res.ok) {
    				console.log("Ok.");
    				getAwards();
    				$$invalidate(6, errorMsg = "");
    				errorStatus = 0;
    				$$invalidate(7, okMsg = "Datos cargados correctamente");
    			} else {
    				if (res.status === 500) {
    					$$invalidate(6, errorMsg = "No se han podido acceder a la base de datos");
    				}

    				$$invalidate(7, okMsg = "");
    				console.log("ERROR!" + errorMsg);
    			}
    		});
    	}

    	async function insertAwards() {
    		console.log("Inserting award " + JSON.stringify(newAward));

    		if (newAward.country === "" || newAward.year === 0) {
    			$$invalidate(6, errorMsg = "debe introducir pais y año");
    			$$invalidate(7, okMsg = "");
    			console.log("ERROR!" + errorMsg);
    		} else {
    			await fetch(BASE + "/awards", {
    				method: "POST",
    				body: JSON.stringify(newAward),
    				headers: { "Content-Type": "application/json" }
    			}).then(res => {
    				if (res.ok) {
    					console.log("Ok.");
    					getAwards();
    					$$invalidate(6, errorMsg = "");
    					errorStatus = 0;
    					$$invalidate(7, okMsg = "Dato cargado correctamente");
    				} else {
    					if (res.status === 500) {
    						$$invalidate(6, errorMsg = "No se han podido acceder a la base de datos");
    					} else if (res.status === 409) {
    						$$invalidate(6, errorMsg = "ya existe el recurso dado");
    					} else if (res.status === 400) {
    						$$invalidate(6, errorMsg = "se han introducido datos erroneos");
    					}

    					$$invalidate(7, okMsg = "");
    					console.log("ERROR!" + errorMsg);
    				}
    			});
    		}
    	}

    	async function deleteAwards(AwardCountry, AwardYear) {
    		console.log("Deleting contact with name " + AwardCountry + "/" + AwardYear);

    		await fetch(BASE + "/awards/" + AwardCountry + "/" + AwardYear, { method: "DELETE" }).then(function (res) {
    			if (res.ok) {
    				console.log("OK");

    				if (awards.length === 1) {
    					$$invalidate(0, awards = []);
    					currentPage = 1;
    				}

    				$$invalidate(6, errorMsg = "");
    				$$invalidate(7, okMsg = "Operación realizada correctamente");
    				getAwards();
    			} else {
    				if (res.status === 404) {
    					$$invalidate(6, errorMsg = "No existe el dato a borrar");
    				} else if (res.status === 500) {
    					$$invalidate(6, errorMsg = "No se han podido acceder a la base de datos");
    				}

    				$$invalidate(7, okMsg = "");
    				console.log("ERROR!" + errorMsg);
    			}
    		});
    	}

    	async function deleteAllAwards() {
    		console.log("Deleting awards");

    		await fetch(BASE + "/awards/", { method: "DELETE" }).then(function (res) {
    			if (res.ok) {
    				console.log("OK");
    				$$invalidate(0, awards = []);
    				$$invalidate(6, errorMsg = "");
    				$$invalidate(7, okMsg = "Operación realizada correctamente");
    			} else {
    				if (res.status === 404) {
    					$$invalidate(6, errorMsg = "No existen datos que borrar");
    				} else if (res.status === 500) {
    					$$invalidate(6, errorMsg = "No se han podido acceder a la base de datos");
    				}

    				$$invalidate(7, okMsg = "");
    				console.log("ERROR!" + errorMsg);
    			}
    		});
    	}

    	async function searchAward() {
    		console.log("Searching award...");
    		var campos = new Map(Object.entries(busqueda));
    		let querySymbol = "?";

    		for (var [clave, valor] of campos.entries()) {
    			if (valor != "") {
    				querySymbol += clave + "=" + valor + "&";
    			}
    		}

    		fullQuery = querySymbol.slice(0, -1);
    		console.log("la query es " + fullQuery);

    		if (fullQuery != "") {
    			const res = await fetch(BASE + "/awards/" + fullQuery);

    			if (res.ok) {
    				console.log("OK");
    				const json = await res.json();
    				$$invalidate(0, awards = json);
    				$$invalidate(7, okMsg = "Búsqueda realizada correctamente");
    			} else {
    				$$invalidate(0, awards = []);

    				if (res.status === 404) {
    					$$invalidate(6, errorMsg = "No se encuentra el dato solicitado");
    				} else if (res.status === 500) {
    					$$invalidate(6, errorMsg = "No se han podido acceder a la base de datos");
    				}

    				$$invalidate(7, okMsg = "");
    				console.log("ERROR!" + errorMsg);
    			}
    		} else {
    			$$invalidate(6, errorMsg = "No se encuentra el dato solicitado");
    			$$invalidate(7, okMsg = "");
    			console.log("ERROR!" + errorMsg);
    		}
    	}

    	//Total de datos en la BD
    	async function getNumTotal() {
    		const res = await fetch(BASE + "/awards");

    		if (res.ok) {
    			const json = await res.json();
    			total = json.length;
    			console.log("getTOTAL: " + total);
    			changePage(current_page, current_offset);
    		} else {
    			$$invalidate(6, errorMsg = "No se han encontrado datos.");
    		}
    	}

    	//Cambio de pagina
    	function changePage(page, offset) {
    		console.log("------Change page------");
    		console.log("Params page: " + page + " offset: " + offset);
    		$$invalidate(5, last_page = Math.ceil(total / 10));
    		console.log("new last page: " + last_page);

    		if (page !== current_page) {
    			console.log("enter if");
    			$$invalidate(3, current_offset = offset);
    			$$invalidate(4, current_page = page);
    			console.log("page: " + page);
    			console.log("current_offset: " + current_offset);
    			console.log("current_page: " + current_page);
    			getAwards();
    		}

    		console.log("---------Exit change page-------");
    	}

    	onMount(getAwards);
    	const writable_props = [];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$5.warn(`<TableAwards> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		newAward.country = this.value;
    		$$invalidate(1, newAward);
    	}

    	function input1_input_handler() {
    		newAward.year = to_number(this.value);
    		$$invalidate(1, newAward);
    	}

    	function input2_input_handler() {
    		newAward.gala = to_number(this.value);
    		$$invalidate(1, newAward);
    	}

    	function input3_input_handler() {
    		newAward.winner = this.value;
    		$$invalidate(1, newAward);
    	}

    	function input4_input_handler() {
    		newAward["n-platform"] = to_number(this.value);
    		$$invalidate(1, newAward);
    	}

    	function input5_input_handler() {
    		newAward["n-award"] = to_number(this.value);
    		$$invalidate(1, newAward);
    	}

    	function input6_input_handler() {
    		busqueda.country = this.value;
    		$$invalidate(2, busqueda);
    	}

    	function input7_input_handler() {
    		busqueda.year = to_number(this.value);
    		$$invalidate(2, busqueda);
    	}

    	function input8_input_handler() {
    		busqueda.gala = to_number(this.value);
    		$$invalidate(2, busqueda);
    	}

    	function input9_input_handler() {
    		busqueda.winner = this.value;
    		$$invalidate(2, busqueda);
    	}

    	function input10_input_handler() {
    		busqueda.nplatform = to_number(this.value);
    		$$invalidate(2, busqueda);
    	}

    	function input11_input_handler() {
    		busqueda.naward = to_number(this.value);
    		$$invalidate(2, busqueda);
    	}

    	const click_handler = () => changePage(current_page - 1, current_offset - 10);
    	const click_handler_1 = page => changePage(page, (page - 1) * 10);
    	const click_handler_2 = () => changePage(current_page + 1, current_offset + 10);

    	$$self.$capture_state = () => ({
    		onMount,
    		Button,
    		Table,
    		Pagination,
    		PaginationItem,
    		PaginationLink,
    		awards,
    		newAward,
    		busqueda,
    		fullQuery,
    		current_offset,
    		limit,
    		current_page,
    		last_page,
    		total,
    		BASE,
    		errorMsg,
    		okMsg,
    		errorStatus,
    		getAwards,
    		getLoadAwards,
    		insertAwards,
    		deleteAwards,
    		deleteAllAwards,
    		searchAward,
    		getNumTotal,
    		range: range$2,
    		changePage
    	});

    	$$self.$inject_state = $$props => {
    		if ("awards" in $$props) $$invalidate(0, awards = $$props.awards);
    		if ("newAward" in $$props) $$invalidate(1, newAward = $$props.newAward);
    		if ("busqueda" in $$props) $$invalidate(2, busqueda = $$props.busqueda);
    		if ("fullQuery" in $$props) fullQuery = $$props.fullQuery;
    		if ("current_offset" in $$props) $$invalidate(3, current_offset = $$props.current_offset);
    		if ("limit" in $$props) limit = $$props.limit;
    		if ("current_page" in $$props) $$invalidate(4, current_page = $$props.current_page);
    		if ("last_page" in $$props) $$invalidate(5, last_page = $$props.last_page);
    		if ("total" in $$props) total = $$props.total;
    		if ("errorMsg" in $$props) $$invalidate(6, errorMsg = $$props.errorMsg);
    		if ("okMsg" in $$props) $$invalidate(7, okMsg = $$props.okMsg);
    		if ("errorStatus" in $$props) errorStatus = $$props.errorStatus;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		awards,
    		newAward,
    		busqueda,
    		current_offset,
    		current_page,
    		last_page,
    		errorMsg,
    		okMsg,
    		getLoadAwards,
    		insertAwards,
    		deleteAwards,
    		deleteAllAwards,
    		searchAward,
    		changePage,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		input6_input_handler,
    		input7_input_handler,
    		input8_input_handler,
    		input9_input_handler,
    		input10_input_handler,
    		input11_input_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class TableAwards extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableAwards",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/front/AwardsAPI/TableAwardsEdit.svelte generated by Svelte v3.37.0 */

    const { console: console_1$4 } = globals;
    const file$8 = "src/front/AwardsAPI/TableAwardsEdit.svelte";

    // (113:21) <Button outline  color="primary" on:click={updateAward}>
    function create_default_slot_2$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Actualizar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$6.name,
    		type: "slot",
    		source: "(113:21) <Button outline  color=\\\"primary\\\" on:click={updateAward}>",
    		ctx
    	});

    	return block;
    }

    // (93:4) <Table bordered>
    function create_default_slot_1$6(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let t12_value = /*params*/ ctx[0].country + "";
    	let t12;
    	let t13;
    	let td1;
    	let t14;
    	let t15;
    	let td2;
    	let input0;
    	let t16;
    	let td3;
    	let input1;
    	let t17;
    	let td4;
    	let input2;
    	let t18;
    	let td5;
    	let input3;
    	let t19;
    	let td6;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_2$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*updateAward*/ ctx[8]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "pais";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "gala";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "ganador";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "numero de plataformas";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "numero de premios ganados";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			t12 = text(t12_value);
    			t13 = space();
    			td1 = element("td");
    			t14 = text(/*updatedYear*/ ctx[1]);
    			t15 = space();
    			td2 = element("td");
    			input0 = element("input");
    			t16 = space();
    			td3 = element("td");
    			input1 = element("input");
    			t17 = space();
    			td4 = element("td");
    			input2 = element("input");
    			t18 = space();
    			td5 = element("td");
    			input3 = element("input");
    			t19 = space();
    			td6 = element("td");
    			create_component(button.$$.fragment);
    			add_location(th0, file$8, 95, 16, 2752);
    			add_location(th1, file$8, 96, 16, 2782);
    			add_location(th2, file$8, 97, 16, 2811);
    			add_location(th3, file$8, 98, 16, 2841);
    			add_location(th4, file$8, 99, 16, 2874);
    			add_location(th5, file$8, 100, 16, 2921);
    			add_location(tr0, file$8, 94, 12, 2731);
    			add_location(thead, file$8, 93, 8, 2711);
    			add_location(td0, file$8, 106, 16, 3057);
    			add_location(td1, file$8, 107, 16, 3099);
    			attr_dev(input0, "type", "number");
    			add_location(input0, file$8, 108, 20, 3144);
    			add_location(td2, file$8, 108, 16, 3140);
    			add_location(input1, file$8, 109, 20, 3216);
    			add_location(td3, file$8, 109, 16, 3212);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$8, 110, 20, 3278);
    			add_location(td4, file$8, 110, 16, 3274);
    			attr_dev(input3, "type", "number");
    			add_location(input3, file$8, 111, 20, 3356);
    			add_location(td5, file$8, 111, 16, 3352);
    			add_location(td6, file$8, 112, 16, 3427);
    			add_location(tr1, file$8, 104, 12, 3019);
    			add_location(tbody, file$8, 103, 8, 2999);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, t12);
    			append_dev(tr1, t13);
    			append_dev(tr1, td1);
    			append_dev(td1, t14);
    			append_dev(tr1, t15);
    			append_dev(tr1, td2);
    			append_dev(td2, input0);
    			set_input_value(input0, /*updatedGala*/ ctx[2]);
    			append_dev(tr1, t16);
    			append_dev(tr1, td3);
    			append_dev(td3, input1);
    			set_input_value(input1, /*updatedWinner*/ ctx[3]);
    			append_dev(tr1, t17);
    			append_dev(tr1, td4);
    			append_dev(td4, input2);
    			set_input_value(input2, /*updatedNPlatforms*/ ctx[4]);
    			append_dev(tr1, t18);
    			append_dev(tr1, td5);
    			append_dev(td5, input3);
    			set_input_value(input3, /*updatedNAwards*/ ctx[5]);
    			append_dev(tr1, t19);
    			append_dev(tr1, td6);
    			mount_component(button, td6, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[10]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[11]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[12])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*params*/ 1) && t12_value !== (t12_value = /*params*/ ctx[0].country + "")) set_data_dev(t12, t12_value);
    			if (!current || dirty & /*updatedYear*/ 2) set_data_dev(t14, /*updatedYear*/ ctx[1]);

    			if (dirty & /*updatedGala*/ 4 && to_number(input0.value) !== /*updatedGala*/ ctx[2]) {
    				set_input_value(input0, /*updatedGala*/ ctx[2]);
    			}

    			if (dirty & /*updatedWinner*/ 8 && input1.value !== /*updatedWinner*/ ctx[3]) {
    				set_input_value(input1, /*updatedWinner*/ ctx[3]);
    			}

    			if (dirty & /*updatedNPlatforms*/ 16 && to_number(input2.value) !== /*updatedNPlatforms*/ ctx[4]) {
    				set_input_value(input2, /*updatedNPlatforms*/ ctx[4]);
    			}

    			if (dirty & /*updatedNAwards*/ 32 && to_number(input3.value) !== /*updatedNAwards*/ ctx[5]) {
    				set_input_value(input3, /*updatedNAwards*/ ctx[5]);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(93:4) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (117:4) {#if errorMsg}
    function create_if_block_1$4(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("ERROR: ");
    			t1 = text(/*errorMsg*/ ctx[6]);
    			set_style(p, "color", "red");
    			add_location(p, file$8, 117, 8, 3585);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*errorMsg*/ 64) set_data_dev(t1, /*errorMsg*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(117:4) {#if errorMsg}",
    		ctx
    	});

    	return block;
    }

    // (120:4) {#if okMsg}
    function create_if_block$4(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*okMsg*/ ctx[7]);
    			set_style(p, "color", "green");
    			add_location(p, file$8, 120, 8, 3663);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*okMsg*/ 128) set_data_dev(t, /*okMsg*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(120:4) {#if okMsg}",
    		ctx
    	});

    	return block;
    }

    // (123:0) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Atras");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(123:0) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let main;
    	let h3;
    	let t0;
    	let strong;
    	let t1_value = /*params*/ ctx[0].country + "";
    	let t1;
    	let t2;
    	let table;
    	let t3;
    	let t4;
    	let t5;
    	let button;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*errorMsg*/ ctx[6] && create_if_block_1$4(ctx);
    	let if_block1 = /*okMsg*/ ctx[7] && create_if_block$4(ctx);

    	button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h3 = element("h3");
    			t0 = text("Editar contacto ");
    			strong = element("strong");
    			t1 = text(t1_value);
    			t2 = space();
    			create_component(table.$$.fragment);
    			t3 = space();
    			if (if_block0) if_block0.c();
    			t4 = space();
    			if (if_block1) if_block1.c();
    			t5 = space();
    			create_component(button.$$.fragment);
    			add_location(strong, file$8, 91, 24, 2643);
    			add_location(h3, file$8, 91, 4, 2623);
    			attr_dev(main, "class", "svelte-1c5583h");
    			add_location(main, file$8, 90, 0, 2612);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h3);
    			append_dev(h3, t0);
    			append_dev(h3, strong);
    			append_dev(strong, t1);
    			append_dev(main, t2);
    			mount_component(table, main, null);
    			append_dev(main, t3);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t4);
    			if (if_block1) if_block1.m(main, null);
    			append_dev(main, t5);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*params*/ 1) && t1_value !== (t1_value = /*params*/ ctx[0].country + "")) set_data_dev(t1, t1_value);
    			const table_changes = {};

    			if (dirty & /*$$scope, updatedNAwards, updatedNPlatforms, updatedWinner, updatedGala, updatedYear, params*/ 65599) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);

    			if (/*errorMsg*/ ctx[6]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$4(ctx);
    					if_block0.c();
    					if_block0.m(main, t4);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*okMsg*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$4(ctx);
    					if_block1.c();
    					if_block1.m(main, t5);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(table);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TableAwardsEdit", slots, []);
    	let { params = {} } = $$props;
    	let award = {};
    	let updatedCountry = "XXXX";
    	let updatedYear = 0;
    	let updatedGala = 0;
    	let updatedWinner = "XXXX";
    	let updatedNPlatforms = 0;
    	let updatedNAwards = 0;
    	let errorMsg = "";
    	let okMsg = "";
    	onMount(getAward);

    	async function getAward() {
    		console.log("Fetching award...");
    		const res = await fetch("/api/v1/awards/" + params.country + "/" + params.year);

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			award = json;
    			updatedCountry = award.country;
    			$$invalidate(1, updatedYear = award.year);
    			$$invalidate(2, updatedGala = award.gala);
    			$$invalidate(3, updatedWinner = award.winner);
    			$$invalidate(4, updatedNPlatforms = award["n-platform"]);
    			$$invalidate(5, updatedNAwards = award["n-award"]);
    			console.log("Received contact.");
    		} else {
    			if (res.status === 404) {
    				$$invalidate(6, errorMsg = "No se encuentra el dato solicitado");
    			} else if (res.status === 500) {
    				$$invalidate(6, errorMsg = "No se han podido acceder a la base de datos");
    			}

    			$$invalidate(7, okMsg = "");
    			console.log("ERROR!" + errorMsg);
    		}
    	}

    	async function updateAward() {
    		console.log("Updating award..." + JSON.stringify(params.country));

    		await fetch("/api/v1/awards/" + params.country + "/" + params.year, {
    			method: "PUT",
    			body: JSON.stringify({
    				"country": params.country,
    				"year": parseInt(params.year),
    				"gala": updatedGala,
    				"winner": updatedWinner,
    				"n-platform": updatedNPlatforms,
    				"n-award": updatedNAwards
    			}),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			if (res.ok) {
    				console.log("OK");
    				getAward();
    				$$invalidate(7, okMsg = "Operación realizada correctamente, vuelva atras para ver todos los datos en la tabla");
    			} else {
    				if (res.status === 404) {
    					$$invalidate(6, errorMsg = "No se encuentra el dato a editar");
    				} else if (res.status === 500) {
    					$$invalidate(6, errorMsg = "No se han podido acceder a la base de datos");
    				} else if (res.status === 400) {
    					$$invalidate(6, errorMsg = "se han introducido datos erroneos");
    				}

    				$$invalidate(7, okMsg = "");
    				console.log("ERROR!" + errorMsg);
    			}
    		});
    	}

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$4.warn(`<TableAwardsEdit> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		updatedGala = to_number(this.value);
    		$$invalidate(2, updatedGala);
    	}

    	function input1_input_handler() {
    		updatedWinner = this.value;
    		$$invalidate(3, updatedWinner);
    	}

    	function input2_input_handler() {
    		updatedNPlatforms = to_number(this.value);
    		$$invalidate(4, updatedNPlatforms);
    	}

    	function input3_input_handler() {
    		updatedNAwards = to_number(this.value);
    		$$invalidate(5, updatedNAwards);
    	}

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		pop,
    		Table,
    		Button,
    		params,
    		award,
    		updatedCountry,
    		updatedYear,
    		updatedGala,
    		updatedWinner,
    		updatedNPlatforms,
    		updatedNAwards,
    		errorMsg,
    		okMsg,
    		getAward,
    		updateAward
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    		if ("award" in $$props) award = $$props.award;
    		if ("updatedCountry" in $$props) updatedCountry = $$props.updatedCountry;
    		if ("updatedYear" in $$props) $$invalidate(1, updatedYear = $$props.updatedYear);
    		if ("updatedGala" in $$props) $$invalidate(2, updatedGala = $$props.updatedGala);
    		if ("updatedWinner" in $$props) $$invalidate(3, updatedWinner = $$props.updatedWinner);
    		if ("updatedNPlatforms" in $$props) $$invalidate(4, updatedNPlatforms = $$props.updatedNPlatforms);
    		if ("updatedNAwards" in $$props) $$invalidate(5, updatedNAwards = $$props.updatedNAwards);
    		if ("errorMsg" in $$props) $$invalidate(6, errorMsg = $$props.errorMsg);
    		if ("okMsg" in $$props) $$invalidate(7, okMsg = $$props.okMsg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		updatedYear,
    		updatedGala,
    		updatedWinner,
    		updatedNPlatforms,
    		updatedNAwards,
    		errorMsg,
    		okMsg,
    		updateAward,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler
    	];
    }

    class TableAwardsEdit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableAwardsEdit",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get params() {
    		throw new Error("<TableAwardsEdit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<TableAwardsEdit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/front/PlatformsAPI/PlatformsAPI.svelte generated by Svelte v3.37.0 */

    const { Object: Object_1$1, console: console_1$3 } = globals;
    const file$7 = "src/front/PlatformsAPI/PlatformsAPI.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[44] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[47] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[47] = list[i];
    	return child_ctx;
    }

    // (347:6) <NavLink href="/">
    function create_default_slot_33$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_33$3.name,
    		type: "slot",
    		source: "(347:6) <NavLink href=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (346:4) <NavItem>
    function create_default_slot_32$3(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "/",
    				$$slots: { default: [create_default_slot_33$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_32$3.name,
    		type: "slot",
    		source: "(346:4) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (350:6) <NavLink href="#" on:click={toggle1}>
    function create_default_slot_31$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar datos inciales");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_31$3.name,
    		type: "slot",
    		source: "(350:6) <NavLink href=\\\"#\\\" on:click={toggle1}>",
    		ctx
    	});

    	return block;
    }

    // (352:8) <ModalHeader {toggle1}>
    function create_default_slot_30$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("¿Cargar los datos iniciales?");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_30$3.name,
    		type: "slot",
    		source: "(352:8) <ModalHeader {toggle1}>",
    		ctx
    	});

    	return block;
    }

    // (353:8) <ModalBody>
    function create_default_slot_29$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Esta acción cargará los datos siempre y cuando no existan previamente.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_29$3.name,
    		type: "slot",
    		source: "(353:8) <ModalBody>",
    		ctx
    	});

    	return block;
    }

    // (357:10) <Button color="primary" on:click={toggle1P}>
    function create_default_slot_28$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_28$3.name,
    		type: "slot",
    		source: "(357:10) <Button color=\\\"primary\\\" on:click={toggle1P}>",
    		ctx
    	});

    	return block;
    }

    // (358:10) <Button color="secondary" on:click={toggle1}>
    function create_default_slot_27$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cancelar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_27$3.name,
    		type: "slot",
    		source: "(358:10) <Button color=\\\"secondary\\\" on:click={toggle1}>",
    		ctx
    	});

    	return block;
    }

    // (356:8) <ModalFooter>
    function create_default_slot_26$3(ctx) {
    	let button0;
    	let t;
    	let button1;
    	let current;

    	button0 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_28$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*toggle1P*/ ctx[13]);

    	button1 = new Button({
    			props: {
    				color: "secondary",
    				$$slots: { default: [create_default_slot_27$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*toggle1*/ ctx[12]);

    	const block = {
    		c: function create() {
    			create_component(button0.$$.fragment);
    			t = space();
    			create_component(button1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(button1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(button1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_26$3.name,
    		type: "slot",
    		source: "(356:8) <ModalFooter>",
    		ctx
    	});

    	return block;
    }

    // (351:6) <Modal isOpen={open1} {toggle1}>
    function create_default_slot_25$3(ctx) {
    	let modalheader;
    	let t0;
    	let modalbody;
    	let t1;
    	let modalfooter;
    	let current;

    	modalheader = new ModalHeader({
    			props: {
    				toggle1: /*toggle1*/ ctx[12],
    				$$slots: { default: [create_default_slot_30$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modalbody = new ModalBody({
    			props: {
    				$$slots: { default: [create_default_slot_29$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modalfooter = new ModalFooter({
    			props: {
    				$$slots: { default: [create_default_slot_26$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modalheader.$$.fragment);
    			t0 = space();
    			create_component(modalbody.$$.fragment);
    			t1 = space();
    			create_component(modalfooter.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modalheader, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(modalbody, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(modalfooter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modalheader_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				modalheader_changes.$$scope = { dirty, ctx };
    			}

    			modalheader.$set(modalheader_changes);
    			const modalbody_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				modalbody_changes.$$scope = { dirty, ctx };
    			}

    			modalbody.$set(modalbody_changes);
    			const modalfooter_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				modalfooter_changes.$$scope = { dirty, ctx };
    			}

    			modalfooter.$set(modalfooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modalheader.$$.fragment, local);
    			transition_in(modalbody.$$.fragment, local);
    			transition_in(modalfooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modalheader.$$.fragment, local);
    			transition_out(modalbody.$$.fragment, local);
    			transition_out(modalfooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modalheader, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(modalbody, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(modalfooter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_25$3.name,
    		type: "slot",
    		source: "(351:6) <Modal isOpen={open1} {toggle1}>",
    		ctx
    	});

    	return block;
    }

    // (349:4) <NavItem>
    function create_default_slot_24$3(ctx) {
    	let navlink;
    	let t;
    	let modal;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "#",
    				$$slots: { default: [create_default_slot_31$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navlink.$on("click", /*toggle1*/ ctx[12]);

    	modal = new Modal({
    			props: {
    				isOpen: /*open1*/ ctx[0],
    				toggle1: /*toggle1*/ ctx[12],
    				$$slots: { default: [create_default_slot_25$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    			t = space();
    			create_component(modal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    			const modal_changes = {};
    			if (dirty[0] & /*open1*/ 1) modal_changes.isOpen = /*open1*/ ctx[0];

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_24$3.name,
    		type: "slot",
    		source: "(349:4) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (367:6) {:else}
    function create_else_block_1$1(ctx) {
    	let navlink;
    	let t;
    	let modal;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "#",
    				$$slots: { default: [create_default_slot_23$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navlink.$on("click", /*toggle2*/ ctx[14]);

    	modal = new Modal({
    			props: {
    				isOpen: /*open2*/ ctx[1],
    				toggle2: /*toggle2*/ ctx[14],
    				$$slots: { default: [create_default_slot_17$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    			t = space();
    			create_component(modal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    			const modal_changes = {};
    			if (dirty[0] & /*open2*/ 2) modal_changes.isOpen = /*open2*/ ctx[1];

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(367:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (363:6) {#if platformsStats.length === 0}
    function create_if_block_3$1(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				disabled: true,
    				href: "#",
    				$$slots: { default: [create_default_slot_16$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navlink.$on("click", /*toggle2*/ ctx[14]);

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(363:6) {#if platformsStats.length === 0}",
    		ctx
    	});

    	return block;
    }

    // (368:8) <NavLink href="#" on:click={toggle2}>
    function create_default_slot_23$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar todos los datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_23$3.name,
    		type: "slot",
    		source: "(368:8) <NavLink href=\\\"#\\\" on:click={toggle2}>",
    		ctx
    	});

    	return block;
    }

    // (370:10) <ModalHeader {toggle2}>
    function create_default_slot_22$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("¿Borrar todos los datos?");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_22$3.name,
    		type: "slot",
    		source: "(370:10) <ModalHeader {toggle2}>",
    		ctx
    	});

    	return block;
    }

    // (371:10) <ModalBody>
    function create_default_slot_21$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Esta acción no se puede deshacer.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_21$3.name,
    		type: "slot",
    		source: "(371:10) <ModalBody>",
    		ctx
    	});

    	return block;
    }

    // (373:12) <Button color="danger" on:click={toggle2P}>
    function create_default_slot_20$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20$3.name,
    		type: "slot",
    		source: "(373:12) <Button color=\\\"danger\\\" on:click={toggle2P}>",
    		ctx
    	});

    	return block;
    }

    // (374:12) <Button color="secondary" on:click={toggle2}>
    function create_default_slot_19$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cancelar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19$3.name,
    		type: "slot",
    		source: "(374:12) <Button color=\\\"secondary\\\" on:click={toggle2}>",
    		ctx
    	});

    	return block;
    }

    // (372:10) <ModalFooter>
    function create_default_slot_18$3(ctx) {
    	let button0;
    	let t;
    	let button1;
    	let current;

    	button0 = new Button({
    			props: {
    				color: "danger",
    				$$slots: { default: [create_default_slot_20$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*toggle2P*/ ctx[15]);

    	button1 = new Button({
    			props: {
    				color: "secondary",
    				$$slots: { default: [create_default_slot_19$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*toggle2*/ ctx[14]);

    	const block = {
    		c: function create() {
    			create_component(button0.$$.fragment);
    			t = space();
    			create_component(button1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(button1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(button1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18$3.name,
    		type: "slot",
    		source: "(372:10) <ModalFooter>",
    		ctx
    	});

    	return block;
    }

    // (369:8) <Modal isOpen={open2} {toggle2}>
    function create_default_slot_17$3(ctx) {
    	let modalheader;
    	let t0;
    	let modalbody;
    	let t1;
    	let modalfooter;
    	let current;

    	modalheader = new ModalHeader({
    			props: {
    				toggle2: /*toggle2*/ ctx[14],
    				$$slots: { default: [create_default_slot_22$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modalbody = new ModalBody({
    			props: {
    				$$slots: { default: [create_default_slot_21$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modalfooter = new ModalFooter({
    			props: {
    				$$slots: { default: [create_default_slot_18$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modalheader.$$.fragment);
    			t0 = space();
    			create_component(modalbody.$$.fragment);
    			t1 = space();
    			create_component(modalfooter.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modalheader, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(modalbody, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(modalfooter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modalheader_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				modalheader_changes.$$scope = { dirty, ctx };
    			}

    			modalheader.$set(modalheader_changes);
    			const modalbody_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				modalbody_changes.$$scope = { dirty, ctx };
    			}

    			modalbody.$set(modalbody_changes);
    			const modalfooter_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				modalfooter_changes.$$scope = { dirty, ctx };
    			}

    			modalfooter.$set(modalfooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modalheader.$$.fragment, local);
    			transition_in(modalbody.$$.fragment, local);
    			transition_in(modalfooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modalheader.$$.fragment, local);
    			transition_out(modalbody.$$.fragment, local);
    			transition_out(modalfooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modalheader, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(modalbody, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(modalfooter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17$3.name,
    		type: "slot",
    		source: "(369:8) <Modal isOpen={open2} {toggle2}>",
    		ctx
    	});

    	return block;
    }

    // (364:8) <NavLink disabled href="#" on:click={toggle2}           >
    function create_default_slot_16$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar todos los datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16$3.name,
    		type: "slot",
    		source: "(364:8) <NavLink disabled href=\\\"#\\\" on:click={toggle2}           >",
    		ctx
    	});

    	return block;
    }

    // (362:4) <NavItem>
    function create_default_slot_15$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_3$1, create_else_block_1$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*platformsStats*/ ctx[2].length === 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15$3.name,
    		type: "slot",
    		source: "(362:4) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (345:2) <Nav>
    function create_default_slot_14$3(ctx) {
    	let navitem0;
    	let t0;
    	let navitem1;
    	let t1;
    	let navitem2;
    	let current;

    	navitem0 = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_32$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navitem1 = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_24$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navitem2 = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_15$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navitem0.$$.fragment);
    			t0 = space();
    			create_component(navitem1.$$.fragment);
    			t1 = space();
    			create_component(navitem2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(navitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(navitem2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navitem0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				navitem0_changes.$$scope = { dirty, ctx };
    			}

    			navitem0.$set(navitem0_changes);
    			const navitem1_changes = {};

    			if (dirty[0] & /*open1*/ 1 | dirty[1] & /*$$scope*/ 2097152) {
    				navitem1_changes.$$scope = { dirty, ctx };
    			}

    			navitem1.$set(navitem1_changes);
    			const navitem2_changes = {};

    			if (dirty[0] & /*platformsStats, open2*/ 6 | dirty[1] & /*$$scope*/ 2097152) {
    				navitem2_changes.$$scope = { dirty, ctx };
    			}

    			navitem2.$set(navitem2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navitem0.$$.fragment, local);
    			transition_in(navitem1.$$.fragment, local);
    			transition_in(navitem2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navitem0.$$.fragment, local);
    			transition_out(navitem1.$$.fragment, local);
    			transition_out(navitem2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navitem0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(navitem1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(navitem2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14$3.name,
    		type: "slot",
    		source: "(345:2) <Nav>",
    		ctx
    	});

    	return block;
    }

    // (385:2) {#if errorMsg}
    function create_if_block_2$1(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("ERROR: ");
    			t1 = text(/*errorMsg*/ ctx[6]);
    			set_style(p, "color", "red");
    			add_location(p, file$7, 385, 4, 9758);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*errorMsg*/ 64) set_data_dev(t1, /*errorMsg*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(385:2) {#if errorMsg}",
    		ctx
    	});

    	return block;
    }

    // (388:2) {#if okMsg}
    function create_if_block_1$3(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*okMsg*/ ctx[7]);
    			set_style(p, "color", "green");
    			add_location(p, file$7, 388, 4, 9828);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*okMsg*/ 128) set_data_dev(t, /*okMsg*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(388:2) {#if okMsg}",
    		ctx
    	});

    	return block;
    }

    // (414:12) <Button color="primary" on:click={searchStat}>
    function create_default_slot_13$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Buscar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13$3.name,
    		type: "slot",
    		source: "(414:12) <Button color=\\\"primary\\\" on:click={searchStat}>",
    		ctx
    	});

    	return block;
    }

    // (415:6) <Button color="secondary" on:click={restore}>
    function create_default_slot_12$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Restaurar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12$3.name,
    		type: "slot",
    		source: "(415:6) <Button color=\\\"secondary\\\" on:click={restore}>",
    		ctx
    	});

    	return block;
    }

    // (394:2) <Table borderer>
    function create_default_slot_11$3(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let th6;
    	let t13;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t14;
    	let td1;
    	let input1;
    	let t15;
    	let td2;
    	let input2;
    	let t16;
    	let td3;
    	let input3;
    	let t17;
    	let td4;
    	let input4;
    	let t18;
    	let td5;
    	let button0;
    	let t19;
    	let td6;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_13$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*searchStat*/ ctx[16]);

    	button1 = new Button({
    			props: {
    				color: "secondary",
    				$$slots: { default: [create_default_slot_12$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*restore*/ ctx[17]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Plataforma";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Año";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Unidades vendidas";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Generacion";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t11 = space();
    			th6 = element("th");
    			th6.textContent = "Acciones";
    			t13 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t14 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t15 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t16 = space();
    			td3 = element("td");
    			input3 = element("input");
    			t17 = space();
    			td4 = element("td");
    			input4 = element("input");
    			t18 = space();
    			td5 = element("td");
    			create_component(button0.$$.fragment);
    			t19 = space();
    			td6 = element("td");
    			create_component(button1.$$.fragment);
    			add_location(th0, file$7, 396, 8, 9964);
    			add_location(th1, file$7, 397, 8, 9988);
    			add_location(th2, file$7, 398, 8, 10018);
    			add_location(th3, file$7, 399, 8, 10041);
    			add_location(th4, file$7, 400, 8, 10078);
    			add_location(th5, file$7, 401, 8, 10108);
    			add_location(th6, file$7, 402, 2, 10128);
    			add_location(tr0, file$7, 395, 6, 9951);
    			add_location(thead, file$7, 394, 4, 9937);
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$7, 407, 12, 10206);
    			add_location(td0, file$7, 407, 8, 10202);
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$7, 408, 12, 10275);
    			add_location(td1, file$7, 408, 8, 10271);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$7, 409, 12, 10345);
    			add_location(td2, file$7, 409, 8, 10341);
    			attr_dev(input3, "type", "number");
    			add_location(input3, file$7, 410, 12, 10413);
    			add_location(td3, file$7, 410, 8, 10409);
    			attr_dev(input4, "type", "number");
    			add_location(input4, file$7, 411, 6, 10483);
    			add_location(td4, file$7, 411, 2, 10479);
    			add_location(td5, file$7, 413, 8, 10562);
    			add_location(td6, file$7, 414, 2, 10635);
    			add_location(tr1, file$7, 406, 6, 10189);
    			add_location(tbody, file$7, 405, 4, 10175);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			append_dev(tr0, t11);
    			append_dev(tr0, th6);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*queryStat*/ ctx[5].country);
    			append_dev(tr1, t14);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*queryStat*/ ctx[5].platform);
    			append_dev(tr1, t15);
    			append_dev(tr1, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*queryStat*/ ctx[5].year);
    			append_dev(tr1, t16);
    			append_dev(tr1, td3);
    			append_dev(td3, input3);
    			set_input_value(input3, /*queryStat*/ ctx[5]["sold-unit"]);
    			append_dev(tr1, t17);
    			append_dev(tr1, td4);
    			append_dev(td4, input4);
    			set_input_value(input4, /*queryStat*/ ctx[5].generation);
    			append_dev(tr1, t18);
    			append_dev(tr1, td5);
    			mount_component(button0, td5, null);
    			append_dev(tr1, t19);
    			append_dev(tr1, td6);
    			mount_component(button1, td6, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[21]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[22]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[23]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[24]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[25])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*queryStat*/ 32 && input0.value !== /*queryStat*/ ctx[5].country) {
    				set_input_value(input0, /*queryStat*/ ctx[5].country);
    			}

    			if (dirty[0] & /*queryStat*/ 32 && input1.value !== /*queryStat*/ ctx[5].platform) {
    				set_input_value(input1, /*queryStat*/ ctx[5].platform);
    			}

    			if (dirty[0] & /*queryStat*/ 32 && to_number(input2.value) !== /*queryStat*/ ctx[5].year) {
    				set_input_value(input2, /*queryStat*/ ctx[5].year);
    			}

    			if (dirty[0] & /*queryStat*/ 32 && to_number(input3.value) !== /*queryStat*/ ctx[5]["sold-unit"]) {
    				set_input_value(input3, /*queryStat*/ ctx[5]["sold-unit"]);
    			}

    			if (dirty[0] & /*queryStat*/ 32 && to_number(input4.value) !== /*queryStat*/ ctx[5].generation) {
    				set_input_value(input4, /*queryStat*/ ctx[5].generation);
    			}

    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button0);
    			destroy_component(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11$3.name,
    		type: "slot",
    		source: "(394:2) <Table borderer>",
    		ctx
    	});

    	return block;
    }

    // (443:12) <Button color="primary" on:click={insertStat}>
    function create_default_slot_10$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Insertar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$3.name,
    		type: "slot",
    		source: "(443:12) <Button color=\\\"primary\\\" on:click={insertStat}>",
    		ctx
    	});

    	return block;
    }

    // (461:6) {:else}
    function create_else_block$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_2 = /*platformsStats*/ ctx[2];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*deleteStat, platformsStats*/ 524292) {
    				each_value_2 = /*platformsStats*/ ctx[2];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_2$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(461:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (446:6) {#if isASearch==true}
    function create_if_block$3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*resultQuery*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*deleteStat, resultQuery*/ 524296) {
    				each_value_1 = /*resultQuery*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(446:6) {#if isASearch==true}",
    		ctx
    	});

    	return block;
    }

    // (471:16) <Button color="primary">
    function create_default_slot_9$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Editar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$3.name,
    		type: "slot",
    		source: "(471:16) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (473:16) <Button color="secondary" on:click={deleteStat(stat.country, stat.year)}>
    function create_default_slot_8$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$3.name,
    		type: "slot",
    		source: "(473:16) <Button color=\\\"secondary\\\" on:click={deleteStat(stat.country, stat.year)}>",
    		ctx
    	});

    	return block;
    }

    // (462:8) {#each platformsStats as stat}
    function create_each_block_2$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*stat*/ ctx[47].country + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*stat*/ ctx[47].platform + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*stat*/ ctx[47].year + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*stat*/ ctx[47]["sold-unit"] + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*stat*/ ctx[47].generation + "";
    	let t8;
    	let t9;
    	let td5;
    	let a;
    	let button0;
    	let a_href_value;
    	let t10;
    	let td6;
    	let button1;
    	let t11;
    	let current;

    	button0 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_9$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				color: "secondary",
    				$$slots: { default: [create_default_slot_8$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", function () {
    		if (is_function(/*deleteStat*/ ctx[19](/*stat*/ ctx[47].country, /*stat*/ ctx[47].year))) /*deleteStat*/ ctx[19](/*stat*/ ctx[47].country, /*stat*/ ctx[47].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			a = element("a");
    			create_component(button0.$$.fragment);
    			t10 = space();
    			td6 = element("td");
    			create_component(button1.$$.fragment);
    			t11 = space();
    			add_location(td0, file$7, 463, 12, 12168);
    			add_location(td1, file$7, 464, 12, 12204);
    			add_location(td2, file$7, 465, 12, 12241);
    			add_location(td3, file$7, 466, 12, 12274);
    			add_location(td4, file$7, 467, 3, 12306);
    			attr_dev(a, "href", a_href_value = "#/platforms/" + /*stat*/ ctx[47].country + "/" + /*stat*/ ctx[47].year);
    			add_location(a, file$7, 469, 14, 12364);
    			add_location(td5, file$7, 468, 12, 12345);
    			add_location(td6, file$7, 472, 12, 12506);
    			add_location(tr, file$7, 462, 10, 12151);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, a);
    			mount_component(button0, a, null);
    			append_dev(tr, t10);
    			append_dev(tr, td6);
    			mount_component(button1, td6, null);
    			append_dev(tr, t11);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*platformsStats*/ 4) && t0_value !== (t0_value = /*stat*/ ctx[47].country + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty[0] & /*platformsStats*/ 4) && t2_value !== (t2_value = /*stat*/ ctx[47].platform + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*platformsStats*/ 4) && t4_value !== (t4_value = /*stat*/ ctx[47].year + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*platformsStats*/ 4) && t6_value !== (t6_value = /*stat*/ ctx[47]["sold-unit"] + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*platformsStats*/ 4) && t8_value !== (t8_value = /*stat*/ ctx[47].generation + "")) set_data_dev(t8, t8_value);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);

    			if (!current || dirty[0] & /*platformsStats*/ 4 && a_href_value !== (a_href_value = "#/platforms/" + /*stat*/ ctx[47].country + "/" + /*stat*/ ctx[47].year)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(462:8) {#each platformsStats as stat}",
    		ctx
    	});

    	return block;
    }

    // (456:16) <Button color="primary">
    function create_default_slot_7$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Editar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$3.name,
    		type: "slot",
    		source: "(456:16) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (458:16) <Button color="secondary" on:click={deleteStat(stat.country, stat.year)}>
    function create_default_slot_6$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$3.name,
    		type: "slot",
    		source: "(458:16) <Button color=\\\"secondary\\\" on:click={deleteStat(stat.country, stat.year)}>",
    		ctx
    	});

    	return block;
    }

    // (447:8) {#each resultQuery as stat}
    function create_each_block_1$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*stat*/ ctx[47].country + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*stat*/ ctx[47].platform + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*stat*/ ctx[47].year + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*stat*/ ctx[47]["sold-unit"] + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*stat*/ ctx[47].generation + "";
    	let t8;
    	let t9;
    	let td5;
    	let a;
    	let button0;
    	let a_href_value;
    	let t10;
    	let td6;
    	let button1;
    	let t11;
    	let current;

    	button0 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_7$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				color: "secondary",
    				$$slots: { default: [create_default_slot_6$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", function () {
    		if (is_function(/*deleteStat*/ ctx[19](/*stat*/ ctx[47].country, /*stat*/ ctx[47].year))) /*deleteStat*/ ctx[19](/*stat*/ ctx[47].country, /*stat*/ ctx[47].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			a = element("a");
    			create_component(button0.$$.fragment);
    			t10 = space();
    			td6 = element("td");
    			create_component(button1.$$.fragment);
    			t11 = space();
    			add_location(td0, file$7, 448, 12, 11611);
    			add_location(td1, file$7, 449, 12, 11647);
    			add_location(td2, file$7, 450, 12, 11684);
    			add_location(td3, file$7, 451, 12, 11717);
    			add_location(td4, file$7, 452, 12, 11758);
    			attr_dev(a, "href", a_href_value = "#/platforms/" + /*stat*/ ctx[47].country + "/" + /*stat*/ ctx[47].year);
    			add_location(a, file$7, 454, 14, 11816);
    			add_location(td5, file$7, 453, 12, 11797);
    			add_location(td6, file$7, 457, 12, 11958);
    			add_location(tr, file$7, 447, 10, 11594);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, a);
    			mount_component(button0, a, null);
    			append_dev(tr, t10);
    			append_dev(tr, td6);
    			mount_component(button1, td6, null);
    			append_dev(tr, t11);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*resultQuery*/ 8) && t0_value !== (t0_value = /*stat*/ ctx[47].country + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty[0] & /*resultQuery*/ 8) && t2_value !== (t2_value = /*stat*/ ctx[47].platform + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*resultQuery*/ 8) && t4_value !== (t4_value = /*stat*/ ctx[47].year + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*resultQuery*/ 8) && t6_value !== (t6_value = /*stat*/ ctx[47]["sold-unit"] + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*resultQuery*/ 8) && t8_value !== (t8_value = /*stat*/ ctx[47].generation + "")) set_data_dev(t8, t8_value);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);

    			if (!current || dirty[0] & /*resultQuery*/ 8 && a_href_value !== (a_href_value = "#/platforms/" + /*stat*/ ctx[47].country + "/" + /*stat*/ ctx[47].year)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(447:8) {#each resultQuery as stat}",
    		ctx
    	});

    	return block;
    }

    // (423:2) <Table borderer>
    function create_default_slot_5$3(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let th6;
    	let t13;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t14;
    	let td1;
    	let input1;
    	let t15;
    	let td2;
    	let input2;
    	let t16;
    	let td3;
    	let input3;
    	let t17;
    	let td4;
    	let input4;
    	let t18;
    	let td5;
    	let button;
    	let t19;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_10$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*insertStat*/ ctx[20]);
    	const if_block_creators = [create_if_block$3, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*isASearch*/ ctx[11] == true) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Plataforma";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Año";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Unidades vendidas";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Generación";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t11 = space();
    			th6 = element("th");
    			th6.textContent = "Acciones";
    			t13 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t14 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t15 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t16 = space();
    			td3 = element("td");
    			input3 = element("input");
    			t17 = space();
    			td4 = element("td");
    			input4 = element("input");
    			t18 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			t19 = space();
    			if_block.c();
    			add_location(th0, file$7, 425, 8, 10846);
    			add_location(th1, file$7, 426, 8, 10870);
    			add_location(th2, file$7, 427, 8, 10900);
    			add_location(th3, file$7, 428, 8, 10923);
    			add_location(th4, file$7, 429, 8, 10960);
    			add_location(th5, file$7, 430, 8, 10990);
    			add_location(th6, file$7, 431, 2, 11010);
    			add_location(tr0, file$7, 424, 6, 10833);
    			add_location(thead, file$7, 423, 4, 10819);
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$7, 436, 12, 11088);
    			add_location(td0, file$7, 436, 8, 11084);
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$7, 437, 12, 11155);
    			add_location(td1, file$7, 437, 8, 11151);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$7, 438, 12, 11223);
    			add_location(td2, file$7, 438, 8, 11219);
    			attr_dev(input3, "type", "number");
    			add_location(input3, file$7, 439, 12, 11289);
    			add_location(td3, file$7, 439, 8, 11285);
    			attr_dev(input4, "type", "number");
    			add_location(input4, file$7, 440, 12, 11363);
    			add_location(td4, file$7, 440, 8, 11359);
    			add_location(td5, file$7, 442, 8, 11434);
    			add_location(tr1, file$7, 435, 6, 11071);
    			add_location(tbody, file$7, 434, 4, 11057);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			append_dev(tr0, t11);
    			append_dev(tr0, th6);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*newStat*/ ctx[4].country);
    			append_dev(tr1, t14);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*newStat*/ ctx[4].platform);
    			append_dev(tr1, t15);
    			append_dev(tr1, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*newStat*/ ctx[4].year);
    			append_dev(tr1, t16);
    			append_dev(tr1, td3);
    			append_dev(td3, input3);
    			set_input_value(input3, /*newStat*/ ctx[4]["sold-unit"]);
    			append_dev(tr1, t17);
    			append_dev(tr1, td4);
    			append_dev(td4, input4);
    			set_input_value(input4, /*newStat*/ ctx[4].generation);
    			append_dev(tr1, t18);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			append_dev(tbody, t19);
    			if_blocks[current_block_type_index].m(tbody, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[26]),
    					listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[27]),
    					listen_dev(input2, "input", /*input2_input_handler_1*/ ctx[28]),
    					listen_dev(input3, "input", /*input3_input_handler_1*/ ctx[29]),
    					listen_dev(input4, "input", /*input4_input_handler_1*/ ctx[30])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*newStat*/ 16 && input0.value !== /*newStat*/ ctx[4].country) {
    				set_input_value(input0, /*newStat*/ ctx[4].country);
    			}

    			if (dirty[0] & /*newStat*/ 16 && input1.value !== /*newStat*/ ctx[4].platform) {
    				set_input_value(input1, /*newStat*/ ctx[4].platform);
    			}

    			if (dirty[0] & /*newStat*/ 16 && to_number(input2.value) !== /*newStat*/ ctx[4].year) {
    				set_input_value(input2, /*newStat*/ ctx[4].year);
    			}

    			if (dirty[0] & /*newStat*/ 16 && to_number(input3.value) !== /*newStat*/ ctx[4]["sold-unit"]) {
    				set_input_value(input3, /*newStat*/ ctx[4]["sold-unit"]);
    			}

    			if (dirty[0] & /*newStat*/ 16 && to_number(input4.value) !== /*newStat*/ ctx[4].generation) {
    				set_input_value(input4, /*newStat*/ ctx[4].generation);
    			}

    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(tbody, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$3.name,
    		type: "slot",
    		source: "(423:2) <Table borderer>",
    		ctx
    	});

    	return block;
    }

    // (484:4) <PaginationItem class={current_page === 1 ? "disabled" : ""}>
    function create_default_slot_4$5(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: { previous: true, href: "#/platforms" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler*/ ctx[31]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$5.name,
    		type: "slot",
    		source: "(484:4) <PaginationItem class={current_page === 1 ? \\\"disabled\\\" : \\\"\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (493:8) <PaginationLink           previous           href="#/platforms"           on:click={() => changePage(page, (page - 1) * 10)}           >
    function create_default_slot_3$5(ctx) {
    	let t_value = /*page*/ ctx[44] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*last_page*/ 1024 && t_value !== (t_value = /*page*/ ctx[44] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$5.name,
    		type: "slot",
    		source: "(493:8) <PaginationLink           previous           href=\\\"#/platforms\\\"           on:click={() => changePage(page, (page - 1) * 10)}           >",
    		ctx
    	});

    	return block;
    }

    // (492:6) <PaginationItem class={current_page === page ? "active" : ""}>
    function create_default_slot_2$5(ctx) {
    	let paginationlink;
    	let current;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[32](/*page*/ ctx[44]);
    	}

    	paginationlink = new PaginationLink({
    			props: {
    				previous: true,
    				href: "#/platforms",
    				$$slots: { default: [create_default_slot_3$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", click_handler_1);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const paginationlink_changes = {};

    			if (dirty[0] & /*last_page*/ 1024 | dirty[1] & /*$$scope*/ 2097152) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$5.name,
    		type: "slot",
    		source: "(492:6) <PaginationItem class={current_page === page ? \\\"active\\\" : \\\"\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (491:4) {#each range(last_page, 1) as page}
    function create_each_block$1(ctx) {
    	let paginationitem;
    	let current;

    	paginationitem = new PaginationItem({
    			props: {
    				class: /*current_page*/ ctx[9] === /*page*/ ctx[44]
    				? "active"
    				: "",
    				$$slots: { default: [create_default_slot_2$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*current_page, last_page*/ 1536) paginationitem_changes.class = /*current_page*/ ctx[9] === /*page*/ ctx[44]
    			? "active"
    			: "";

    			if (dirty[0] & /*last_page*/ 1024 | dirty[1] & /*$$scope*/ 2097152) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(491:4) {#each range(last_page, 1) as page}",
    		ctx
    	});

    	return block;
    }

    // (501:4) <PaginationItem class={current_page === last_page ? "disabled" : ""}>
    function create_default_slot_1$5(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: { next: true, href: "#/platforms" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_2*/ ctx[33]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(501:4) <PaginationItem class={current_page === last_page ? \\\"disabled\\\" : \\\"\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (483:2) <Pagination ariaLabel="Web pagination">
    function create_default_slot$6(ctx) {
    	let paginationitem0;
    	let t0;
    	let t1;
    	let paginationitem1;
    	let current;

    	paginationitem0 = new PaginationItem({
    			props: {
    				class: /*current_page*/ ctx[9] === 1 ? "disabled" : "",
    				$$slots: { default: [create_default_slot_4$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value = range$1(/*last_page*/ ctx[10], 1);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	paginationitem1 = new PaginationItem({
    			props: {
    				class: /*current_page*/ ctx[9] === /*last_page*/ ctx[10]
    				? "disabled"
    				: "",
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem0.$$.fragment);
    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			create_component(paginationitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem0, target, anchor);
    			insert_dev(target, t0, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			mount_component(paginationitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem0_changes = {};
    			if (dirty[0] & /*current_page*/ 512) paginationitem0_changes.class = /*current_page*/ ctx[9] === 1 ? "disabled" : "";

    			if (dirty[0] & /*current_page, current_offset*/ 768 | dirty[1] & /*$$scope*/ 2097152) {
    				paginationitem0_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem0.$set(paginationitem0_changes);

    			if (dirty[0] & /*current_page, last_page, changePage*/ 263680) {
    				each_value = range$1(/*last_page*/ ctx[10], 1);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t1.parentNode, t1);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const paginationitem1_changes = {};

    			if (dirty[0] & /*current_page, last_page*/ 1536) paginationitem1_changes.class = /*current_page*/ ctx[9] === /*last_page*/ ctx[10]
    			? "disabled"
    			: "";

    			if (dirty[0] & /*current_page, current_offset*/ 768 | dirty[1] & /*$$scope*/ 2097152) {
    				paginationitem1_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem1.$set(paginationitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem0.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(paginationitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem0.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(paginationitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(paginationitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(483:2) <Pagination ariaLabel=\\\"Web pagination\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let main;
    	let nav;
    	let t0;
    	let p0;
    	let t1;
    	let p1;
    	let t2;
    	let t3;
    	let t4;
    	let h4;
    	let t6;
    	let table0;
    	let t7;
    	let h3;
    	let t9;
    	let table1;
    	let t10;
    	let pagination;
    	let current;

    	nav = new Nav({
    			props: {
    				$$slots: { default: [create_default_slot_14$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*errorMsg*/ ctx[6] && create_if_block_2$1(ctx);
    	let if_block1 = /*okMsg*/ ctx[7] && create_if_block_1$3(ctx);

    	table0 = new Table({
    			props: {
    				borderer: true,
    				$$slots: { default: [create_default_slot_11$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table1 = new Table({
    			props: {
    				borderer: true,
    				$$slots: { default: [create_default_slot_5$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	pagination = new Pagination({
    			props: {
    				ariaLabel: "Web pagination",
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(nav.$$.fragment);
    			t0 = space();
    			p0 = element("p");
    			t1 = space();
    			p1 = element("p");
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			if (if_block1) if_block1.c();
    			t4 = space();
    			h4 = element("h4");
    			h4.textContent = "Buscador";
    			t6 = space();
    			create_component(table0.$$.fragment);
    			t7 = space();
    			h3 = element("h3");
    			h3.textContent = "Plataformas";
    			t9 = space();
    			create_component(table1.$$.fragment);
    			t10 = space();
    			create_component(pagination.$$.fragment);
    			add_location(p0, file$7, 381, 2, 9722);
    			add_location(p1, file$7, 383, 2, 9731);
    			add_location(h4, file$7, 392, 2, 9896);
    			add_location(h3, file$7, 420, 2, 10756);
    			attr_dev(main, "class", "svelte-1uggtpz");
    			add_location(main, file$7, 343, 0, 8408);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(nav, main, null);
    			append_dev(main, t0);
    			append_dev(main, p0);
    			append_dev(main, t1);
    			append_dev(main, p1);
    			append_dev(main, t2);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t3);
    			if (if_block1) if_block1.m(main, null);
    			append_dev(main, t4);
    			append_dev(main, h4);
    			append_dev(main, t6);
    			mount_component(table0, main, null);
    			append_dev(main, t7);
    			append_dev(main, h3);
    			append_dev(main, t9);
    			mount_component(table1, main, null);
    			append_dev(main, t10);
    			mount_component(pagination, main, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const nav_changes = {};

    			if (dirty[0] & /*platformsStats, open2, open1*/ 7 | dirty[1] & /*$$scope*/ 2097152) {
    				nav_changes.$$scope = { dirty, ctx };
    			}

    			nav.$set(nav_changes);

    			if (/*errorMsg*/ ctx[6]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					if_block0.m(main, t3);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*okMsg*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$3(ctx);
    					if_block1.c();
    					if_block1.m(main, t4);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			const table0_changes = {};

    			if (dirty[0] & /*queryStat*/ 32 | dirty[1] & /*$$scope*/ 2097152) {
    				table0_changes.$$scope = { dirty, ctx };
    			}

    			table0.$set(table0_changes);
    			const table1_changes = {};

    			if (dirty[0] & /*resultQuery, isASearch, platformsStats, newStat*/ 2076 | dirty[1] & /*$$scope*/ 2097152) {
    				table1_changes.$$scope = { dirty, ctx };
    			}

    			table1.$set(table1_changes);
    			const pagination_changes = {};

    			if (dirty[0] & /*current_page, last_page, current_offset*/ 1792 | dirty[1] & /*$$scope*/ 2097152) {
    				pagination_changes.$$scope = { dirty, ctx };
    			}

    			pagination.$set(pagination_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(table0.$$.fragment, local);
    			transition_in(table1.$$.fragment, local);
    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(table0.$$.fragment, local);
    			transition_out(table1.$$.fragment, local);
    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(nav);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(table0);
    			destroy_component(table1);
    			destroy_component(pagination);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const BASE_CONTACT_API_PATH$3 = "/api/v1";

    //Calcula el rango entre ods valores
    function range$1(size, startAt = 0) {
    	return [...Array(size).keys()].map(i => i + startAt);
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PlatformsAPI", slots, []);
    	let open1 = false;
    	const toggle1 = () => $$invalidate(0, open1 = !open1);

    	const toggle1P = () => {
    		$$invalidate(0, open1 = !open1);
    		loadStats();
    	};

    	//Delete all stats
    	let open2 = false;

    	const toggle2 = () => $$invalidate(1, open2 = !open2);

    	const toggle2P = () => {
    		$$invalidate(1, open2 = !open2);
    		deleteAllStats();
    	};

    	let platformsStats = [];
    	let resultQuery = [];

    	let newStat = {
    		"country": "",
    		"platform": "",
    		"year": 0,
    		"sold-unit": 0,
    		"generation": 0
    	};

    	let queryStat = {
    		country: "",
    		platform: "",
    		year: "",
    		"sold-unit": "",
    		generation: ""
    	};

    	//Alertas
    	let errorMsg = "";

    	let okMsg = "";
    	let errorStatus = 0;
    	let fullQuery = "";

    	//Pagination
    	let current_offset = 0;

    	let limit = 10;
    	let current_page = 1;
    	let last_page = 1;
    	let total = 0;
    	let isASearch = false;

    	// Functiones de ayuda
    	function resetInputs(flag) {
    		console.log("Reseting inputs: " + flag);

    		let resetStat = {
    			country: "",
    			platform: "",
    			year: "",
    			"sold-unit": "",
    			generation: ""
    		};

    		if (flag == 1) {
    			$$invalidate(5, queryStat = resetStat);
    			$$invalidate(9, current_page = 1);
    			$$invalidate(8, current_offset = 0);
    		} else {
    			$$invalidate(4, newStat = resetStat);
    		}
    	}

    	//Functions
    	async function loadStats() {
    		console.log("Loading data...");

    		await fetch(BASE_CONTACT_API_PATH$3 + "/platforms/loadInitialData").then(function (res) {
    			if (res.ok) {
    				console.log("OK");
    				getStats();

    				//Alertas
    				$$invalidate(6, errorMsg = "");

    				errorStatus = 0;
    				$$invalidate(7, okMsg = "Datos cargados correctamente");
    			} else {
    				if (res.status === 409) {
    					$$invalidate(6, errorMsg = "Alguno de los datos ya se encuentra cargado");
    				} else if (res.status === 500) {
    					$$invalidate(6, errorMsg = "No se han podido acceder a la base de datos");
    				}

    				$$invalidate(7, okMsg = "");
    				console.log("ERROR!" + errorMsg);
    			}
    		});
    	}

    	async function searchStat() {
    		console.log("Searching stat...");
    		var msg = "";

    		if (isASearch == false) {
    			$$invalidate(8, current_offset = 0);
    			$$invalidate(9, current_page = 1);
    		}

    		var campos = new Map(Object.entries(queryStat).filter(o => {
    				return o[1] != "";
    			}));

    		let querySymbol = "?";

    		for (var [clave, valor] of campos.entries()) {
    			msg += clave + "=" + valor + " ";
    			querySymbol += clave + "=" + valor + "&";
    		}

    		fullQuery = querySymbol.slice(0, -1);

    		if (fullQuery != "") {
    			const res = await fetch(BASE_CONTACT_API_PATH$3 + "/platforms/" + fullQuery + "&limit=" + limit + "&offset=" + current_offset);

    			if (res.ok) {
    				console.log("OK");
    				const json = await res.json();
    				$$invalidate(3, resultQuery = json);
    				$$invalidate(7, okMsg = "Resultado de la busqueda con " + msg);
    				$$invalidate(11, isASearch = true);
    				getNumTotalQuery();
    			} else {
    				$$invalidate(3, resultQuery = []);

    				if (res.status === 404) {
    					$$invalidate(6, errorMsg = "No existe un dato con " + msg);
    				} else if (res.status === 500) {
    					$$invalidate(6, errorMsg = "No se ha podido acceder a la base de datos");
    				}

    				$$invalidate(7, okMsg = "");
    				console.log("ERROR!" + errorMsg);
    			}
    		} else {
    			$$invalidate(6, errorMsg = "Se necesita un campo a buscar");
    			$$invalidate(7, okMsg = "");
    		}
    	}

    	//Total de datos de una query en la BD
    	async function getNumTotalQuery() {
    		console.log("Total entities of query");
    		const res = await fetch(BASE_CONTACT_API_PATH$3 + "/platforms" + fullQuery);

    		if (res.ok) {
    			const json = await res.json();
    			total = json.length;
    			console.log("getTotal: " + total);
    			changePage(current_page, current_offset);
    		} else {
    			$$invalidate(6, errorMsg = "No se ha encontrado datos.");
    		}
    	}

    	function restore() {
    		if (isASearch == true) {
    			resetInputs(1);
    			$$invalidate(11, isASearch = false);
    		}

    		$$invalidate(8, current_offset = 0);
    		$$invalidate(9, current_page = 1);
    		getNumTotal();
    	}

    	//Total de datos en la BD
    	async function getNumTotal() {
    		const res = await fetch(BASE_CONTACT_API_PATH$3 + "/platforms");

    		if (res.ok) {
    			const json = await res.json();
    			total = json.length;
    			console.log("getTOAL: " + total);
    			changePage(current_page, current_offset);
    		} else {
    			$$invalidate(6, errorMsg = "No se han encontrado datos.");
    		}
    	}

    	//Cambio de pagina
    	function changePage(page, offset) {
    		console.log("------Change page------");
    		console.log("Params page: " + page + " offset: " + offset);
    		$$invalidate(10, last_page = Math.ceil(total / 10));
    		console.log("new last page: " + last_page);

    		if (page !== current_page) {
    			console.log("enter if");
    			$$invalidate(8, current_offset = offset);
    			$$invalidate(9, current_page = page);
    			console.log("page: " + page);
    			console.log("current_offset: " + current_offset);
    			console.log("current_page: " + current_page);
    			getStats();
    		}

    		console.log("---------Exit change page-------");
    	}

    	async function getStats() {
    		console.log("Fetching data...");
    		const res = await fetch(BASE_CONTACT_API_PATH$3 + "/platforms?limit=" + limit + "&offset=" + current_offset);

    		if (res.ok) {
    			console.log("Ok");
    			const json = await res.json();
    			$$invalidate(2, platformsStats = json);
    			console.log(`We have received ${platformsStats.length} __.`);
    			$$invalidate(6, errorMsg = "");
    			getNumTotal();
    		} else {
    			if (platformsStats.length != 0) {
    				$$invalidate(6, errorMsg = "No hay datos disponibles");
    				console.log("ERROR!");
    			}

    			if (res.status === 500) {
    				$$invalidate(6, errorMsg = "No se han podido acceder a la base de datos");
    			}

    			$$invalidate(7, okMsg = "");
    			console.log("ERROR!" + errorMsg);
    		}
    	}

    	async function deleteAllStats() {
    		console.log("Deleting data...");

    		await fetch(BASE_CONTACT_API_PATH$3 + "/platforms/", { method: "DELETE" }).then(function (res) {
    			if (res.ok) {
    				console.log("OK");
    				$$invalidate(2, platformsStats = []);
    				$$invalidate(6, errorMsg = "");
    				$$invalidate(7, okMsg = "Operación realizada correctamente");
    			} else {
    				if (res.status === 404) {
    					$$invalidate(6, errorMsg = "No existen datos que borrar");
    				} else if (res.status === 500) {
    					$$invalidate(6, errorMsg = "No se han podido acceder a la base de datos");
    				}

    				$$invalidate(7, okMsg = "");
    				console.log("ERROR!" + errorMsg);
    			}
    		});
    	}

    	async function deleteStat(country, year) {
    		console.log(`Deleting data with name ${country} and year ${year}`);

    		await fetch(BASE_CONTACT_API_PATH$3 + "/platforms/" + country + "/" + year, { method: "DELETE" }).then(function (res) {
    			if (res.ok) {
    				console.log("OK");

    				if (platformsStats.length === 1) {
    					$$invalidate(2, platformsStats = []);
    					currentPage = 1;
    				}

    				$$invalidate(6, errorMsg = "");
    				$$invalidate(7, okMsg = "Operación realizada correctamente");
    				getStats();
    			} else {
    				if (res.status === 404) {
    					$$invalidate(6, errorMsg = "No existe el dato a borrar");
    				} else if (res.status === 500) {
    					$$invalidate(6, errorMsg = "No se han podido acceder a la base de datos");
    				}

    				$$invalidate(7, okMsg = "");
    				console.log("ERROR!" + errorMsg);
    			}
    		});
    	}

    	async function insertStat() {
    		console.log("Inserting platform " + JSON.stringify(newStat));

    		await fetch(BASE_CONTACT_API_PATH$3 + "/platforms", {
    			method: "POST",
    			body: JSON.stringify(newStat),
    			headers: { "Content-Type": "application/json" }
    		}).then(res => {
    			getStats();
    		});
    	}

    	onMount(getStats);
    	getNumTotal();
    	const writable_props = [];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$3.warn(`<PlatformsAPI> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		queryStat.country = this.value;
    		$$invalidate(5, queryStat);
    	}

    	function input1_input_handler() {
    		queryStat.platform = this.value;
    		$$invalidate(5, queryStat);
    	}

    	function input2_input_handler() {
    		queryStat.year = to_number(this.value);
    		$$invalidate(5, queryStat);
    	}

    	function input3_input_handler() {
    		queryStat["sold-unit"] = to_number(this.value);
    		$$invalidate(5, queryStat);
    	}

    	function input4_input_handler() {
    		queryStat.generation = to_number(this.value);
    		$$invalidate(5, queryStat);
    	}

    	function input0_input_handler_1() {
    		newStat.country = this.value;
    		$$invalidate(4, newStat);
    	}

    	function input1_input_handler_1() {
    		newStat.platform = this.value;
    		$$invalidate(4, newStat);
    	}

    	function input2_input_handler_1() {
    		newStat.year = to_number(this.value);
    		$$invalidate(4, newStat);
    	}

    	function input3_input_handler_1() {
    		newStat["sold-unit"] = to_number(this.value);
    		$$invalidate(4, newStat);
    	}

    	function input4_input_handler_1() {
    		newStat.generation = to_number(this.value);
    		$$invalidate(4, newStat);
    	}

    	const click_handler = () => changePage(current_page - 1, current_offset - 10);
    	const click_handler_1 = page => changePage(page, (page - 1) * 10);
    	const click_handler_2 = () => changePage(current_page + 1, current_offset + 10);

    	$$self.$capture_state = () => ({
    		Nav,
    		Modal,
    		ModalBody,
    		ModalFooter,
    		ModalHeader,
    		NavItem,
    		NavLink,
    		Button,
    		Table,
    		Pagination,
    		PaginationItem,
    		PaginationLink,
    		onMount,
    		open1,
    		toggle1,
    		toggle1P,
    		open2,
    		toggle2,
    		toggle2P,
    		BASE_CONTACT_API_PATH: BASE_CONTACT_API_PATH$3,
    		platformsStats,
    		resultQuery,
    		newStat,
    		queryStat,
    		errorMsg,
    		okMsg,
    		errorStatus,
    		fullQuery,
    		current_offset,
    		limit,
    		current_page,
    		last_page,
    		total,
    		isASearch,
    		resetInputs,
    		loadStats,
    		searchStat,
    		getNumTotalQuery,
    		restore,
    		getNumTotal,
    		range: range$1,
    		changePage,
    		getStats,
    		deleteAllStats,
    		deleteStat,
    		insertStat
    	});

    	$$self.$inject_state = $$props => {
    		if ("open1" in $$props) $$invalidate(0, open1 = $$props.open1);
    		if ("open2" in $$props) $$invalidate(1, open2 = $$props.open2);
    		if ("platformsStats" in $$props) $$invalidate(2, platformsStats = $$props.platformsStats);
    		if ("resultQuery" in $$props) $$invalidate(3, resultQuery = $$props.resultQuery);
    		if ("newStat" in $$props) $$invalidate(4, newStat = $$props.newStat);
    		if ("queryStat" in $$props) $$invalidate(5, queryStat = $$props.queryStat);
    		if ("errorMsg" in $$props) $$invalidate(6, errorMsg = $$props.errorMsg);
    		if ("okMsg" in $$props) $$invalidate(7, okMsg = $$props.okMsg);
    		if ("errorStatus" in $$props) errorStatus = $$props.errorStatus;
    		if ("fullQuery" in $$props) fullQuery = $$props.fullQuery;
    		if ("current_offset" in $$props) $$invalidate(8, current_offset = $$props.current_offset);
    		if ("limit" in $$props) limit = $$props.limit;
    		if ("current_page" in $$props) $$invalidate(9, current_page = $$props.current_page);
    		if ("last_page" in $$props) $$invalidate(10, last_page = $$props.last_page);
    		if ("total" in $$props) total = $$props.total;
    		if ("isASearch" in $$props) $$invalidate(11, isASearch = $$props.isASearch);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		open1,
    		open2,
    		platformsStats,
    		resultQuery,
    		newStat,
    		queryStat,
    		errorMsg,
    		okMsg,
    		current_offset,
    		current_page,
    		last_page,
    		isASearch,
    		toggle1,
    		toggle1P,
    		toggle2,
    		toggle2P,
    		searchStat,
    		restore,
    		changePage,
    		deleteStat,
    		insertStat,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input0_input_handler_1,
    		input1_input_handler_1,
    		input2_input_handler_1,
    		input3_input_handler_1,
    		input4_input_handler_1,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class PlatformsAPI extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlatformsAPI",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/front/PlatformsAPI/EditPlatforms.svelte generated by Svelte v3.37.0 */

    const { console: console_1$2 } = globals;
    const file$6 = "src/front/PlatformsAPI/EditPlatforms.svelte";

    // (89:6) <NavLink href="#/platforms">
    function create_default_slot_4$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$4.name,
    		type: "slot",
    		source: "(89:6) <NavLink href=\\\"#/platforms\\\">",
    		ctx
    	});

    	return block;
    }

    // (88:4) <NavItem>
    function create_default_slot_3$4(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "#/platforms",
    				$$slots: { default: [create_default_slot_4$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$4.name,
    		type: "slot",
    		source: "(88:4) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (87:2) <Nav>
    function create_default_slot_2$4(ctx) {
    	let navitem;
    	let current;

    	navitem = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_3$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navitem_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				navitem_changes.$$scope = { dirty, ctx };
    			}

    			navitem.$set(navitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(87:2) <Nav>",
    		ctx
    	});

    	return block;
    }

    // (118:10) <Button outline color="primary" on:click={updatePlatformsss}>
    function create_default_slot_1$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Actualizar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(118:10) <Button outline color=\\\"primary\\\" on:click={updatePlatformsss}>",
    		ctx
    	});

    	return block;
    }

    // (99:2) <Table bordered>
    function create_default_slot$5(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let t12_value = /*params*/ ctx[0].country + "";
    	let t12;
    	let t13;
    	let td1;
    	let input0;
    	let t14;
    	let td2;
    	let t15_value = /*params*/ ctx[0].year + "";
    	let t15;
    	let t16;
    	let td3;
    	let input1;
    	let t17;
    	let td4;
    	let input2;
    	let t18;
    	let td5;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*updatePlatformsss*/ ctx[6]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Plataforma";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Año";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Unidades vendidas";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Generación";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			t12 = text(t12_value);
    			t13 = space();
    			td1 = element("td");
    			input0 = element("input");
    			t14 = space();
    			td2 = element("td");
    			t15 = text(t15_value);
    			t16 = space();
    			td3 = element("td");
    			input1 = element("input");
    			t17 = space();
    			td4 = element("td");
    			input2 = element("input");
    			t18 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			add_location(th0, file$6, 101, 8, 2725);
    			add_location(th1, file$6, 102, 8, 2749);
    			add_location(th2, file$6, 103, 8, 2779);
    			add_location(th3, file$6, 104, 8, 2802);
    			add_location(th4, file$6, 105, 8, 2839);
    			add_location(th5, file$6, 106, 8, 2869);
    			add_location(tr0, file$6, 100, 6, 2712);
    			add_location(thead, file$6, 99, 4, 2698);
    			add_location(td0, file$6, 111, 8, 2943);
    			add_location(input0, file$6, 112, 6, 2975);
    			add_location(td1, file$6, 112, 2, 2971);
    			add_location(td2, file$6, 113, 8, 3026);
    			attr_dev(input1, "type", "number");
    			add_location(input1, file$6, 114, 12, 3061);
    			add_location(td3, file$6, 114, 8, 3057);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$6, 115, 12, 3126);
    			add_location(td4, file$6, 115, 8, 3122);
    			add_location(td5, file$6, 116, 8, 3193);
    			add_location(tr1, file$6, 110, 6, 2930);
    			add_location(tbody, file$6, 109, 4, 2916);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, t12);
    			append_dev(tr1, t13);
    			append_dev(tr1, td1);
    			append_dev(td1, input0);
    			set_input_value(input0, /*updatePlatform*/ ctx[1]);
    			append_dev(tr1, t14);
    			append_dev(tr1, td2);
    			append_dev(td2, t15);
    			append_dev(tr1, t16);
    			append_dev(tr1, td3);
    			append_dev(td3, input1);
    			set_input_value(input1, /*updateSold*/ ctx[2]);
    			append_dev(tr1, t17);
    			append_dev(tr1, td4);
    			append_dev(td4, input2);
    			set_input_value(input2, /*updateGeneration*/ ctx[3]);
    			append_dev(tr1, t18);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[7]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[8]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[9])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*params*/ 1) && t12_value !== (t12_value = /*params*/ ctx[0].country + "")) set_data_dev(t12, t12_value);

    			if (dirty & /*updatePlatform*/ 2 && input0.value !== /*updatePlatform*/ ctx[1]) {
    				set_input_value(input0, /*updatePlatform*/ ctx[1]);
    			}

    			if ((!current || dirty & /*params*/ 1) && t15_value !== (t15_value = /*params*/ ctx[0].year + "")) set_data_dev(t15, t15_value);

    			if (dirty & /*updateSold*/ 4 && to_number(input1.value) !== /*updateSold*/ ctx[2]) {
    				set_input_value(input1, /*updateSold*/ ctx[2]);
    			}

    			if (dirty & /*updateGeneration*/ 8 && to_number(input2.value) !== /*updateGeneration*/ ctx[3]) {
    				set_input_value(input2, /*updateGeneration*/ ctx[3]);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(99:2) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (123:2) {#if errorMsg}
    function create_if_block_1$2(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("ERROR: ");
    			t1 = text(/*errorMsg*/ ctx[4]);
    			set_style(p, "color", "red");
    			add_location(p, file$6, 123, 4, 3360);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*errorMsg*/ 16) set_data_dev(t1, /*errorMsg*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(123:2) {#if errorMsg}",
    		ctx
    	});

    	return block;
    }

    // (126:2) {#if okMsg}
    function create_if_block$2(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*okMsg*/ ctx[5]);
    			set_style(p, "color", "green");
    			add_location(p, file$6, 126, 2, 3428);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*okMsg*/ 32) set_data_dev(t, /*okMsg*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(126:2) {#if okMsg}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let main;
    	let nav;
    	let t0;
    	let h2;
    	let t1;
    	let strong0;
    	let t2_value = /*params*/ ctx[0].country + "";
    	let t2;
    	let t3;
    	let strong1;
    	let t4_value = /*params*/ ctx[0].year + "";
    	let t4;
    	let t5;
    	let table;
    	let t6;
    	let t7;
    	let current;

    	nav = new Nav({
    			props: {
    				$$slots: { default: [create_default_slot_2$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*errorMsg*/ ctx[4] && create_if_block_1$2(ctx);
    	let if_block1 = /*okMsg*/ ctx[5] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(nav.$$.fragment);
    			t0 = space();
    			h2 = element("h2");
    			t1 = text("Editar campo \n\t");
    			strong0 = element("strong");
    			t2 = text(t2_value);
    			t3 = space();
    			strong1 = element("strong");
    			t4 = text(t4_value);
    			t5 = space();
    			create_component(table.$$.fragment);
    			t6 = space();
    			if (if_block0) if_block0.c();
    			t7 = space();
    			if (if_block1) if_block1.c();
    			add_location(strong0, file$6, 94, 1, 2596);
    			add_location(strong1, file$6, 96, 4, 2636);
    			add_location(h2, file$6, 92, 2, 2572);
    			attr_dev(main, "class", "svelte-qkkln6");
    			add_location(main, file$6, 85, 0, 2465);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(nav, main, null);
    			append_dev(main, t0);
    			append_dev(main, h2);
    			append_dev(h2, t1);
    			append_dev(h2, strong0);
    			append_dev(strong0, t2);
    			append_dev(h2, t3);
    			append_dev(h2, strong1);
    			append_dev(strong1, t4);
    			append_dev(main, t5);
    			mount_component(table, main, null);
    			append_dev(main, t6);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t7);
    			if (if_block1) if_block1.m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const nav_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				nav_changes.$$scope = { dirty, ctx };
    			}

    			nav.$set(nav_changes);
    			if ((!current || dirty & /*params*/ 1) && t2_value !== (t2_value = /*params*/ ctx[0].country + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*params*/ 1) && t4_value !== (t4_value = /*params*/ ctx[0].year + "")) set_data_dev(t4, t4_value);
    			const table_changes = {};

    			if (dirty & /*$$scope, updateGeneration, updateSold, params, updatePlatform*/ 16399) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);

    			if (/*errorMsg*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					if_block0.m(main, t7);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*okMsg*/ ctx[5]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					if_block1.m(main, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(nav);
    			destroy_component(table);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const BASE_CONTACT_API_PATH$2 = "/api/v1";

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("EditPlatforms", slots, []);
    	let { params = {} } = $$props;
    	let stat = {};
    	let updateCountry = "XXXX";
    	let updatePlatform = "XXXX";
    	let updateYear = 1999;
    	let updateSold = 999999;
    	let updateGeneration = 99;
    	let errorMsg = "";
    	let okMsg = "";

    	async function getStat() {
    		console.log("Fetching stat..." + params.country + " " + params.year);
    		const res = await fetch(BASE_CONTACT_API_PATH$2 + "/platforms/" + params.country + "/" + params.year);

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			stat = json;
    			updateCountry = stat.country;
    			$$invalidate(1, updatePlatform = stat.platform);
    			updateYear = stat.year;
    			$$invalidate(2, updateSold = stat["sold-unit"]);
    			$$invalidate(3, updateGeneration = stat.generation);
    			console.log("Received stat.");
    		} else {
    			if (res.status === 404) {
    				$$invalidate(4, errorMsg = "No se encuentra el dato solicitado");
    			} else if (res.status === 500) {
    				$$invalidate(4, errorMsg = "No se han podido acceder a la base de datos");
    			}

    			$$invalidate(5, okMsg = "");
    			console.log("ERROR!" + errorMsg);
    		}
    	}

    	async function updatePlatformsss() {
    		console.log("Updating platform..." + JSON.stringify(params.country));

    		await fetch("/api/v1/platforms/" + params.country + "/" + params.year, {
    			method: "PUT",
    			body: JSON.stringify({
    				"country": params.country,
    				"platform": updatePlatform,
    				"year": params.year,
    				"sold-unit": updateSold,
    				"generation": updateGeneration
    			}),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			$$invalidate(5, okMsg = "Operación realizada correctamente, vuelva atras para ver todos los datos en la tabla");

    			//getStat();
    			if (res.ok) {
    				console.log("OK");
    				getAward();
    				$$invalidate(5, okMsg = "Operación realizada correctamente, vuelva atras para ver todos los datos en la tabla");
    			} else {
    				if (res.status === 404) {
    					$$invalidate(4, errorMsg = "No se encuentra el dato a editar");
    				} else if (res.status === 500) {
    					$$invalidate(4, errorMsg = "No se han podido acceder a la base de datos");
    				} else if (res.status === 400) {
    					$$invalidate(4, errorMsg = "se han introducido datos erroneos");
    				}

    				$$invalidate(5, okMsg = "");
    				console.log("ERROR!" + errorMsg);
    			}
    		});
    	}

    	onMount(getStat);
    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<EditPlatforms> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		updatePlatform = this.value;
    		$$invalidate(1, updatePlatform);
    	}

    	function input1_input_handler() {
    		updateSold = to_number(this.value);
    		$$invalidate(2, updateSold);
    	}

    	function input2_input_handler() {
    		updateGeneration = to_number(this.value);
    		$$invalidate(3, updateGeneration);
    	}

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		Nav,
    		NavItem,
    		NavLink,
    		BASE_CONTACT_API_PATH: BASE_CONTACT_API_PATH$2,
    		params,
    		stat,
    		updateCountry,
    		updatePlatform,
    		updateYear,
    		updateSold,
    		updateGeneration,
    		errorMsg,
    		okMsg,
    		getStat,
    		updatePlatformsss
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    		if ("stat" in $$props) stat = $$props.stat;
    		if ("updateCountry" in $$props) updateCountry = $$props.updateCountry;
    		if ("updatePlatform" in $$props) $$invalidate(1, updatePlatform = $$props.updatePlatform);
    		if ("updateYear" in $$props) updateYear = $$props.updateYear;
    		if ("updateSold" in $$props) $$invalidate(2, updateSold = $$props.updateSold);
    		if ("updateGeneration" in $$props) $$invalidate(3, updateGeneration = $$props.updateGeneration);
    		if ("errorMsg" in $$props) $$invalidate(4, errorMsg = $$props.errorMsg);
    		if ("okMsg" in $$props) $$invalidate(5, okMsg = $$props.okMsg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		updatePlatform,
    		updateSold,
    		updateGeneration,
    		errorMsg,
    		okMsg,
    		updatePlatformsss,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class EditPlatforms extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditPlatforms",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get params() {
    		throw new Error("<EditPlatforms>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<EditPlatforms>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/front/GamesAPI/GamesAPI.svelte generated by Svelte v3.37.0 */

    const { Object: Object_1, console: console_1$1 } = globals;
    const file$5 = "src/front/GamesAPI/GamesAPI.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[44] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[47] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[47] = list[i];
    	return child_ctx;
    }

    // (382:8) <NavLink href="/">
    function create_default_slot_33$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_33$2.name,
    		type: "slot",
    		source: "(382:8) <NavLink href=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (381:6) <NavItem>
    function create_default_slot_32$2(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "/",
    				$$slots: { default: [create_default_slot_33$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_32$2.name,
    		type: "slot",
    		source: "(381:6) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (385:8) <NavLink href="#" on:click={toggle1}>
    function create_default_slot_31$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar datos inciales");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_31$2.name,
    		type: "slot",
    		source: "(385:8) <NavLink href=\\\"#\\\" on:click={toggle1}>",
    		ctx
    	});

    	return block;
    }

    // (387:10) <ModalHeader {toggle1}>
    function create_default_slot_30$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("¿Cargar los datos iniciales?");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_30$2.name,
    		type: "slot",
    		source: "(387:10) <ModalHeader {toggle1}>",
    		ctx
    	});

    	return block;
    }

    // (388:10) <ModalBody>
    function create_default_slot_29$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Esta acción cargará los datos siempre y cuando no existan previamente.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_29$2.name,
    		type: "slot",
    		source: "(388:10) <ModalBody>",
    		ctx
    	});

    	return block;
    }

    // (392:12) <Button color="primary" on:click={toggle1P}>
    function create_default_slot_28$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cargar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_28$2.name,
    		type: "slot",
    		source: "(392:12) <Button color=\\\"primary\\\" on:click={toggle1P}>",
    		ctx
    	});

    	return block;
    }

    // (393:12) <Button color="secondary" on:click={toggle1}>
    function create_default_slot_27$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cancelar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_27$2.name,
    		type: "slot",
    		source: "(393:12) <Button color=\\\"secondary\\\" on:click={toggle1}>",
    		ctx
    	});

    	return block;
    }

    // (391:10) <ModalFooter>
    function create_default_slot_26$2(ctx) {
    	let button0;
    	let t;
    	let button1;
    	let current;

    	button0 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_28$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*toggle1P*/ ctx[13]);

    	button1 = new Button({
    			props: {
    				color: "secondary",
    				$$slots: { default: [create_default_slot_27$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*toggle1*/ ctx[12]);

    	const block = {
    		c: function create() {
    			create_component(button0.$$.fragment);
    			t = space();
    			create_component(button1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(button1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(button1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_26$2.name,
    		type: "slot",
    		source: "(391:10) <ModalFooter>",
    		ctx
    	});

    	return block;
    }

    // (386:8) <Modal isOpen={open1} {toggle1}>
    function create_default_slot_25$2(ctx) {
    	let modalheader;
    	let t0;
    	let modalbody;
    	let t1;
    	let modalfooter;
    	let current;

    	modalheader = new ModalHeader({
    			props: {
    				toggle1: /*toggle1*/ ctx[12],
    				$$slots: { default: [create_default_slot_30$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modalbody = new ModalBody({
    			props: {
    				$$slots: { default: [create_default_slot_29$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modalfooter = new ModalFooter({
    			props: {
    				$$slots: { default: [create_default_slot_26$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modalheader.$$.fragment);
    			t0 = space();
    			create_component(modalbody.$$.fragment);
    			t1 = space();
    			create_component(modalfooter.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modalheader, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(modalbody, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(modalfooter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modalheader_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				modalheader_changes.$$scope = { dirty, ctx };
    			}

    			modalheader.$set(modalheader_changes);
    			const modalbody_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				modalbody_changes.$$scope = { dirty, ctx };
    			}

    			modalbody.$set(modalbody_changes);
    			const modalfooter_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				modalfooter_changes.$$scope = { dirty, ctx };
    			}

    			modalfooter.$set(modalfooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modalheader.$$.fragment, local);
    			transition_in(modalbody.$$.fragment, local);
    			transition_in(modalfooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modalheader.$$.fragment, local);
    			transition_out(modalbody.$$.fragment, local);
    			transition_out(modalfooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modalheader, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(modalbody, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(modalfooter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_25$2.name,
    		type: "slot",
    		source: "(386:8) <Modal isOpen={open1} {toggle1}>",
    		ctx
    	});

    	return block;
    }

    // (384:6) <NavItem>
    function create_default_slot_24$2(ctx) {
    	let navlink;
    	let t;
    	let modal;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "#",
    				$$slots: { default: [create_default_slot_31$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navlink.$on("click", /*toggle1*/ ctx[12]);

    	modal = new Modal({
    			props: {
    				isOpen: /*open1*/ ctx[0],
    				toggle1: /*toggle1*/ ctx[12],
    				$$slots: { default: [create_default_slot_25$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    			t = space();
    			create_component(modal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    			const modal_changes = {};
    			if (dirty[0] & /*open1*/ 1) modal_changes.isOpen = /*open1*/ ctx[0];

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_24$2.name,
    		type: "slot",
    		source: "(384:6) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (402:8) {:else}
    function create_else_block_1(ctx) {
    	let navlink;
    	let t;
    	let modal;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "#",
    				$$slots: { default: [create_default_slot_23$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navlink.$on("click", /*toggle2*/ ctx[14]);

    	modal = new Modal({
    			props: {
    				isOpen: /*open2*/ ctx[1],
    				toggle2: /*toggle2*/ ctx[14],
    				$$slots: { default: [create_default_slot_17$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    			t = space();
    			create_component(modal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    			const modal_changes = {};
    			if (dirty[0] & /*open2*/ 2) modal_changes.isOpen = /*open2*/ ctx[1];

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(402:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (398:8) {#if gamesStats.length === 0}
    function create_if_block_3(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				disabled: true,
    				href: "#",
    				$$slots: { default: [create_default_slot_16$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navlink.$on("click", /*toggle2*/ ctx[14]);

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(398:8) {#if gamesStats.length === 0}",
    		ctx
    	});

    	return block;
    }

    // (403:10) <NavLink href="#" on:click={toggle2}>
    function create_default_slot_23$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar todos los datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_23$2.name,
    		type: "slot",
    		source: "(403:10) <NavLink href=\\\"#\\\" on:click={toggle2}>",
    		ctx
    	});

    	return block;
    }

    // (405:12) <ModalHeader {toggle2}>
    function create_default_slot_22$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("¿Borrar todos los datos?");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_22$2.name,
    		type: "slot",
    		source: "(405:12) <ModalHeader {toggle2}>",
    		ctx
    	});

    	return block;
    }

    // (406:12) <ModalBody>
    function create_default_slot_21$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Esta acción no se puede deshacer.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_21$2.name,
    		type: "slot",
    		source: "(406:12) <ModalBody>",
    		ctx
    	});

    	return block;
    }

    // (408:14) <Button color="danger" on:click={toggle2P}>
    function create_default_slot_20$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20$2.name,
    		type: "slot",
    		source: "(408:14) <Button color=\\\"danger\\\" on:click={toggle2P}>",
    		ctx
    	});

    	return block;
    }

    // (409:14) <Button color="secondary" on:click={toggle2}>
    function create_default_slot_19$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cancelar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19$2.name,
    		type: "slot",
    		source: "(409:14) <Button color=\\\"secondary\\\" on:click={toggle2}>",
    		ctx
    	});

    	return block;
    }

    // (407:12) <ModalFooter>
    function create_default_slot_18$2(ctx) {
    	let button0;
    	let t;
    	let button1;
    	let current;

    	button0 = new Button({
    			props: {
    				color: "danger",
    				$$slots: { default: [create_default_slot_20$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*toggle2P*/ ctx[15]);

    	button1 = new Button({
    			props: {
    				color: "secondary",
    				$$slots: { default: [create_default_slot_19$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*toggle2*/ ctx[14]);

    	const block = {
    		c: function create() {
    			create_component(button0.$$.fragment);
    			t = space();
    			create_component(button1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(button1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(button1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18$2.name,
    		type: "slot",
    		source: "(407:12) <ModalFooter>",
    		ctx
    	});

    	return block;
    }

    // (404:10) <Modal isOpen={open2} {toggle2}>
    function create_default_slot_17$2(ctx) {
    	let modalheader;
    	let t0;
    	let modalbody;
    	let t1;
    	let modalfooter;
    	let current;

    	modalheader = new ModalHeader({
    			props: {
    				toggle2: /*toggle2*/ ctx[14],
    				$$slots: { default: [create_default_slot_22$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modalbody = new ModalBody({
    			props: {
    				$$slots: { default: [create_default_slot_21$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modalfooter = new ModalFooter({
    			props: {
    				$$slots: { default: [create_default_slot_18$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modalheader.$$.fragment);
    			t0 = space();
    			create_component(modalbody.$$.fragment);
    			t1 = space();
    			create_component(modalfooter.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modalheader, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(modalbody, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(modalfooter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modalheader_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				modalheader_changes.$$scope = { dirty, ctx };
    			}

    			modalheader.$set(modalheader_changes);
    			const modalbody_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				modalbody_changes.$$scope = { dirty, ctx };
    			}

    			modalbody.$set(modalbody_changes);
    			const modalfooter_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				modalfooter_changes.$$scope = { dirty, ctx };
    			}

    			modalfooter.$set(modalfooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modalheader.$$.fragment, local);
    			transition_in(modalbody.$$.fragment, local);
    			transition_in(modalfooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modalheader.$$.fragment, local);
    			transition_out(modalbody.$$.fragment, local);
    			transition_out(modalfooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modalheader, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(modalbody, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(modalfooter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17$2.name,
    		type: "slot",
    		source: "(404:10) <Modal isOpen={open2} {toggle2}>",
    		ctx
    	});

    	return block;
    }

    // (399:10) <NavLink disabled href="#" on:click={toggle2}             >
    function create_default_slot_16$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar todos los datos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16$2.name,
    		type: "slot",
    		source: "(399:10) <NavLink disabled href=\\\"#\\\" on:click={toggle2}             >",
    		ctx
    	});

    	return block;
    }

    // (397:6) <NavItem>
    function create_default_slot_15$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_3, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*gamesStats*/ ctx[2].length === 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15$2.name,
    		type: "slot",
    		source: "(397:6) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (380:4) <Nav>
    function create_default_slot_14$2(ctx) {
    	let navitem0;
    	let t0;
    	let navitem1;
    	let t1;
    	let navitem2;
    	let current;

    	navitem0 = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_32$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navitem1 = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_24$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navitem2 = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_15$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navitem0.$$.fragment);
    			t0 = space();
    			create_component(navitem1.$$.fragment);
    			t1 = space();
    			create_component(navitem2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(navitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(navitem2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navitem0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				navitem0_changes.$$scope = { dirty, ctx };
    			}

    			navitem0.$set(navitem0_changes);
    			const navitem1_changes = {};

    			if (dirty[0] & /*open1*/ 1 | dirty[1] & /*$$scope*/ 2097152) {
    				navitem1_changes.$$scope = { dirty, ctx };
    			}

    			navitem1.$set(navitem1_changes);
    			const navitem2_changes = {};

    			if (dirty[0] & /*gamesStats, open2*/ 6 | dirty[1] & /*$$scope*/ 2097152) {
    				navitem2_changes.$$scope = { dirty, ctx };
    			}

    			navitem2.$set(navitem2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navitem0.$$.fragment, local);
    			transition_in(navitem1.$$.fragment, local);
    			transition_in(navitem2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navitem0.$$.fragment, local);
    			transition_out(navitem1.$$.fragment, local);
    			transition_out(navitem2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navitem0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(navitem1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(navitem2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14$2.name,
    		type: "slot",
    		source: "(380:4) <Nav>",
    		ctx
    	});

    	return block;
    }

    // (420:4) {#if errorMsg}
    function create_if_block_2(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("ERROR: ");
    			t1 = text(/*errorMsg*/ ctx[6]);
    			set_style(p, "color", "red");
    			add_location(p, file$5, 420, 6, 11918);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*errorMsg*/ 64) set_data_dev(t1, /*errorMsg*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(420:4) {#if errorMsg}",
    		ctx
    	});

    	return block;
    }

    // (423:4) {#if okMsg}
    function create_if_block_1$1(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*okMsg*/ ctx[7]);
    			set_style(p, "color", "green");
    			add_location(p, file$5, 423, 6, 11994);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*okMsg*/ 128) set_data_dev(t, /*okMsg*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(423:4) {#if okMsg}",
    		ctx
    	});

    	return block;
    }

    // (449:12) <Button color="primary" on:click={searchStat}>
    function create_default_slot_13$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Buscar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13$2.name,
    		type: "slot",
    		source: "(449:12) <Button color=\\\"primary\\\" on:click={searchStat}>",
    		ctx
    	});

    	return block;
    }

    // (450:6) <Button color="secondary" on:click={restore}>
    function create_default_slot_12$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Restaurar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12$2.name,
    		type: "slot",
    		source: "(450:6) <Button color=\\\"secondary\\\" on:click={restore}>",
    		ctx
    	});

    	return block;
    }

    // (429:2) <Table borderer>
    function create_default_slot_11$2(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let th6;
    	let t13;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t14;
    	let td1;
    	let input1;
    	let t15;
    	let td2;
    	let input2;
    	let t16;
    	let td3;
    	let input3;
    	let t17;
    	let td4;
    	let input4;
    	let t18;
    	let td5;
    	let button0;
    	let t19;
    	let td6;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_13$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*searchStat*/ ctx[16]);

    	button1 = new Button({
    			props: {
    				color: "secondary",
    				$$slots: { default: [create_default_slot_12$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*restore*/ ctx[17]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Juego";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Año";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Unidades vendidas";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Compañia";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t11 = space();
    			th6 = element("th");
    			th6.textContent = "Acciones";
    			t13 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t14 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t15 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t16 = space();
    			td3 = element("td");
    			input3 = element("input");
    			t17 = space();
    			td4 = element("td");
    			input4 = element("input");
    			t18 = space();
    			td5 = element("td");
    			create_component(button0.$$.fragment);
    			t19 = space();
    			td6 = element("td");
    			create_component(button1.$$.fragment);
    			add_location(th0, file$5, 431, 8, 12134);
    			add_location(th1, file$5, 432, 8, 12158);
    			add_location(th2, file$5, 433, 8, 12183);
    			add_location(th3, file$5, 434, 8, 12206);
    			add_location(th4, file$5, 435, 8, 12243);
    			add_location(th5, file$5, 436, 8, 12271);
    			add_location(th6, file$5, 437, 2, 12291);
    			add_location(tr0, file$5, 430, 6, 12121);
    			add_location(thead, file$5, 429, 4, 12107);
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$5, 442, 12, 12369);
    			add_location(td0, file$5, 442, 8, 12365);
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$5, 443, 12, 12438);
    			add_location(td1, file$5, 443, 8, 12434);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$5, 444, 12, 12504);
    			add_location(td2, file$5, 444, 8, 12500);
    			attr_dev(input3, "type", "number");
    			add_location(input3, file$5, 445, 12, 12572);
    			add_location(td3, file$5, 445, 8, 12568);
    			attr_dev(input4, "type", "text");
    			add_location(input4, file$5, 446, 6, 12642);
    			add_location(td4, file$5, 446, 2, 12638);
    			add_location(td5, file$5, 448, 8, 12716);
    			add_location(td6, file$5, 449, 2, 12789);
    			add_location(tr1, file$5, 441, 6, 12352);
    			add_location(tbody, file$5, 440, 4, 12338);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			append_dev(tr0, t11);
    			append_dev(tr0, th6);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*queryStat*/ ctx[5].country);
    			append_dev(tr1, t14);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*queryStat*/ ctx[5].game);
    			append_dev(tr1, t15);
    			append_dev(tr1, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*queryStat*/ ctx[5].year);
    			append_dev(tr1, t16);
    			append_dev(tr1, td3);
    			append_dev(td3, input3);
    			set_input_value(input3, /*queryStat*/ ctx[5]["sold-unit"]);
    			append_dev(tr1, t17);
    			append_dev(tr1, td4);
    			append_dev(td4, input4);
    			set_input_value(input4, /*queryStat*/ ctx[5].company);
    			append_dev(tr1, t18);
    			append_dev(tr1, td5);
    			mount_component(button0, td5, null);
    			append_dev(tr1, t19);
    			append_dev(tr1, td6);
    			mount_component(button1, td6, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[21]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[22]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[23]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[24]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[25])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*queryStat*/ 32 && input0.value !== /*queryStat*/ ctx[5].country) {
    				set_input_value(input0, /*queryStat*/ ctx[5].country);
    			}

    			if (dirty[0] & /*queryStat*/ 32 && input1.value !== /*queryStat*/ ctx[5].game) {
    				set_input_value(input1, /*queryStat*/ ctx[5].game);
    			}

    			if (dirty[0] & /*queryStat*/ 32 && to_number(input2.value) !== /*queryStat*/ ctx[5].year) {
    				set_input_value(input2, /*queryStat*/ ctx[5].year);
    			}

    			if (dirty[0] & /*queryStat*/ 32 && to_number(input3.value) !== /*queryStat*/ ctx[5]["sold-unit"]) {
    				set_input_value(input3, /*queryStat*/ ctx[5]["sold-unit"]);
    			}

    			if (dirty[0] & /*queryStat*/ 32 && input4.value !== /*queryStat*/ ctx[5].company) {
    				set_input_value(input4, /*queryStat*/ ctx[5].company);
    			}

    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button0);
    			destroy_component(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11$2.name,
    		type: "slot",
    		source: "(429:2) <Table borderer>",
    		ctx
    	});

    	return block;
    }

    // (477:22) <Button on:click={insertStat}>
    function create_default_slot_10$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("insertar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$2.name,
    		type: "slot",
    		source: "(477:22) <Button on:click={insertStat}>",
    		ctx
    	});

    	return block;
    }

    // (494:6) {:else}
    function create_else_block(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_2 = /*gamesStats*/ ctx[2];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*deleteStat, gamesStats*/ 524292) {
    				each_value_2 = /*gamesStats*/ ctx[2];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(494:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (479:14) {#if isASearch==true}
    function create_if_block$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*resultQuery*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*deleteStat, resultQuery*/ 524296) {
    				each_value_1 = /*resultQuery*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(479:14) {#if isASearch==true}",
    		ctx
    	});

    	return block;
    }

    // (504:16) <Button color="primary">
    function create_default_slot_9$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Editar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$2.name,
    		type: "slot",
    		source: "(504:16) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (506:16) <Button color="secondary" on:click={deleteStat(stat.country, stat.year)}>
    function create_default_slot_8$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$2.name,
    		type: "slot",
    		source: "(506:16) <Button color=\\\"secondary\\\" on:click={deleteStat(stat.country, stat.year)}>",
    		ctx
    	});

    	return block;
    }

    // (495:8) {#each gamesStats as stat}
    function create_each_block_2(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*stat*/ ctx[47].country + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*stat*/ ctx[47].game + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*stat*/ ctx[47].year + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*stat*/ ctx[47]["sold-unit"] + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*stat*/ ctx[47].company + "";
    	let t8;
    	let t9;
    	let td5;
    	let a;
    	let button0;
    	let a_href_value;
    	let t10;
    	let td6;
    	let button1;
    	let t11;
    	let current;

    	button0 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_9$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				color: "secondary",
    				$$slots: { default: [create_default_slot_8$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", function () {
    		if (is_function(/*deleteStat*/ ctx[19](/*stat*/ ctx[47].country, /*stat*/ ctx[47].year))) /*deleteStat*/ ctx[19](/*stat*/ ctx[47].country, /*stat*/ ctx[47].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			a = element("a");
    			create_component(button0.$$.fragment);
    			t10 = space();
    			td6 = element("td");
    			create_component(button1.$$.fragment);
    			t11 = space();
    			add_location(td0, file$5, 496, 12, 14318);
    			add_location(td1, file$5, 497, 12, 14354);
    			add_location(td2, file$5, 498, 12, 14387);
    			add_location(td3, file$5, 499, 12, 14420);
    			add_location(td4, file$5, 500, 3, 14452);
    			attr_dev(a, "href", a_href_value = "#/games/" + /*stat*/ ctx[47].country + "/" + /*stat*/ ctx[47].year);
    			add_location(a, file$5, 502, 14, 14507);
    			add_location(td5, file$5, 501, 12, 14488);
    			add_location(td6, file$5, 505, 12, 14645);
    			add_location(tr, file$5, 495, 10, 14301);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, a);
    			mount_component(button0, a, null);
    			append_dev(tr, t10);
    			append_dev(tr, td6);
    			mount_component(button1, td6, null);
    			append_dev(tr, t11);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*gamesStats*/ 4) && t0_value !== (t0_value = /*stat*/ ctx[47].country + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty[0] & /*gamesStats*/ 4) && t2_value !== (t2_value = /*stat*/ ctx[47].game + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*gamesStats*/ 4) && t4_value !== (t4_value = /*stat*/ ctx[47].year + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*gamesStats*/ 4) && t6_value !== (t6_value = /*stat*/ ctx[47]["sold-unit"] + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*gamesStats*/ 4) && t8_value !== (t8_value = /*stat*/ ctx[47].company + "")) set_data_dev(t8, t8_value);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);

    			if (!current || dirty[0] & /*gamesStats*/ 4 && a_href_value !== (a_href_value = "#/games/" + /*stat*/ ctx[47].country + "/" + /*stat*/ ctx[47].year)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(495:8) {#each gamesStats as stat}",
    		ctx
    	});

    	return block;
    }

    // (489:16) <Button color="primary">
    function create_default_slot_7$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Editar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$2.name,
    		type: "slot",
    		source: "(489:16) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (491:16) <Button color="secondary" on:click={deleteStat(stat.country, stat.year)}>
    function create_default_slot_6$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Borrar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$2.name,
    		type: "slot",
    		source: "(491:16) <Button color=\\\"secondary\\\" on:click={deleteStat(stat.country, stat.year)}>",
    		ctx
    	});

    	return block;
    }

    // (480:8) {#each resultQuery as stat}
    function create_each_block_1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*stat*/ ctx[47].country + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*stat*/ ctx[47].game + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*stat*/ ctx[47].year + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*stat*/ ctx[47]["sold-unit"] + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*stat*/ ctx[47].company + "";
    	let t8;
    	let t9;
    	let td5;
    	let a;
    	let button0;
    	let a_href_value;
    	let t10;
    	let td6;
    	let button1;
    	let t11;
    	let current;

    	button0 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_7$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				color: "secondary",
    				$$slots: { default: [create_default_slot_6$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", function () {
    		if (is_function(/*deleteStat*/ ctx[19](/*stat*/ ctx[47].country, /*stat*/ ctx[47].year))) /*deleteStat*/ ctx[19](/*stat*/ ctx[47].country, /*stat*/ ctx[47].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			a = element("a");
    			create_component(button0.$$.fragment);
    			t10 = space();
    			td6 = element("td");
    			create_component(button1.$$.fragment);
    			t11 = space();
    			add_location(td0, file$5, 481, 12, 13776);
    			add_location(td1, file$5, 482, 12, 13812);
    			add_location(td2, file$5, 483, 12, 13845);
    			add_location(td3, file$5, 484, 12, 13878);
    			add_location(td4, file$5, 485, 12, 13919);
    			attr_dev(a, "href", a_href_value = "#/games/" + /*stat*/ ctx[47].country + "/" + /*stat*/ ctx[47].year);
    			add_location(a, file$5, 487, 14, 13974);
    			add_location(td5, file$5, 486, 12, 13955);
    			add_location(td6, file$5, 490, 12, 14112);
    			add_location(tr, file$5, 480, 10, 13759);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, a);
    			mount_component(button0, a, null);
    			append_dev(tr, t10);
    			append_dev(tr, td6);
    			mount_component(button1, td6, null);
    			append_dev(tr, t11);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*resultQuery*/ 8) && t0_value !== (t0_value = /*stat*/ ctx[47].country + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty[0] & /*resultQuery*/ 8) && t2_value !== (t2_value = /*stat*/ ctx[47].game + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*resultQuery*/ 8) && t4_value !== (t4_value = /*stat*/ ctx[47].year + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*resultQuery*/ 8) && t6_value !== (t6_value = /*stat*/ ctx[47]["sold-unit"] + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*resultQuery*/ 8) && t8_value !== (t8_value = /*stat*/ ctx[47].company + "")) set_data_dev(t8, t8_value);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);

    			if (!current || dirty[0] & /*resultQuery*/ 8 && a_href_value !== (a_href_value = "#/games/" + /*stat*/ ctx[47].country + "/" + /*stat*/ ctx[47].year)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(480:8) {#each resultQuery as stat}",
    		ctx
    	});

    	return block;
    }

    // (457:4) <Table borderer>
    function create_default_slot_5$2(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let input0;
    	let t12;
    	let td1;
    	let input1;
    	let t13;
    	let td2;
    	let input2;
    	let t14;
    	let td3;
    	let input3;
    	let t15;
    	let td4;
    	let input4;
    	let t16;
    	let td5;
    	let button;
    	let t17;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_10$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*insertStat*/ ctx[20]);
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*isASearch*/ ctx[11] == true) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Juego";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Año";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Unidades vendidas";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Compañia";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			input0 = element("input");
    			t12 = space();
    			td1 = element("td");
    			input1 = element("input");
    			t13 = space();
    			td2 = element("td");
    			input2 = element("input");
    			t14 = space();
    			td3 = element("td");
    			input3 = element("input");
    			t15 = space();
    			td4 = element("td");
    			input4 = element("input");
    			t16 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			t17 = space();
    			if_block.c();
    			add_location(th0, file$5, 459, 10, 12986);
    			add_location(th1, file$5, 460, 10, 13012);
    			add_location(th2, file$5, 461, 10, 13039);
    			add_location(th3, file$5, 462, 10, 13064);
    			add_location(th4, file$5, 463, 10, 13103);
    			add_location(th5, file$5, 464, 10, 13133);
    			add_location(tr0, file$5, 458, 8, 12971);
    			add_location(thead, file$5, 457, 6, 12955);
    			add_location(input0, file$5, 470, 22, 13242);
    			add_location(td0, file$5, 470, 18, 13238);
    			add_location(input1, file$5, 471, 22, 13306);
    			add_location(td1, file$5, 471, 18, 13302);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$5, 472, 22, 13367);
    			add_location(td2, file$5, 472, 18, 13363);
    			attr_dev(input3, "type", "number");
    			add_location(input3, file$5, 473, 22, 13440);
    			add_location(td3, file$5, 473, 18, 13436);
    			add_location(input4, file$5, 474, 22, 13521);
    			add_location(td4, file$5, 474, 18, 13517);
    			add_location(td5, file$5, 476, 18, 13600);
    			add_location(tr1, file$5, 469, 14, 13215);
    			add_location(tbody, file$5, 468, 6, 13193);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, input0);
    			set_input_value(input0, /*newStat*/ ctx[4].country);
    			append_dev(tr1, t12);
    			append_dev(tr1, td1);
    			append_dev(td1, input1);
    			set_input_value(input1, /*newStat*/ ctx[4].game);
    			append_dev(tr1, t13);
    			append_dev(tr1, td2);
    			append_dev(td2, input2);
    			set_input_value(input2, /*newStat*/ ctx[4].year);
    			append_dev(tr1, t14);
    			append_dev(tr1, td3);
    			append_dev(td3, input3);
    			set_input_value(input3, /*newStat*/ ctx[4]["sold-unit"]);
    			append_dev(tr1, t15);
    			append_dev(tr1, td4);
    			append_dev(td4, input4);
    			set_input_value(input4, /*newStat*/ ctx[4].company);
    			append_dev(tr1, t16);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			append_dev(tbody, t17);
    			if_blocks[current_block_type_index].m(tbody, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler_1*/ ctx[26]),
    					listen_dev(input1, "input", /*input1_input_handler_1*/ ctx[27]),
    					listen_dev(input2, "input", /*input2_input_handler_1*/ ctx[28]),
    					listen_dev(input3, "input", /*input3_input_handler_1*/ ctx[29]),
    					listen_dev(input4, "input", /*input4_input_handler_1*/ ctx[30])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*newStat*/ 16 && input0.value !== /*newStat*/ ctx[4].country) {
    				set_input_value(input0, /*newStat*/ ctx[4].country);
    			}

    			if (dirty[0] & /*newStat*/ 16 && input1.value !== /*newStat*/ ctx[4].game) {
    				set_input_value(input1, /*newStat*/ ctx[4].game);
    			}

    			if (dirty[0] & /*newStat*/ 16 && to_number(input2.value) !== /*newStat*/ ctx[4].year) {
    				set_input_value(input2, /*newStat*/ ctx[4].year);
    			}

    			if (dirty[0] & /*newStat*/ 16 && to_number(input3.value) !== /*newStat*/ ctx[4]["sold-unit"]) {
    				set_input_value(input3, /*newStat*/ ctx[4]["sold-unit"]);
    			}

    			if (dirty[0] & /*newStat*/ 16 && input4.value !== /*newStat*/ ctx[4].company) {
    				set_input_value(input4, /*newStat*/ ctx[4].company);
    			}

    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 2097152) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(tbody, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$2.name,
    		type: "slot",
    		source: "(457:4) <Table borderer>",
    		ctx
    	});

    	return block;
    }

    // (537:6) <PaginationItem class={current_page === 1 ? "disabled" : ""}>
    function create_default_slot_4$3(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: { previous: true, href: "#/games" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler*/ ctx[31]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$3.name,
    		type: "slot",
    		source: "(537:6) <PaginationItem class={current_page === 1 ? \\\"disabled\\\" : \\\"\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (546:10) <PaginationLink             previous             href="#/games"             on:click={() => changePage(page, (page - 1) * 10)}             >
    function create_default_slot_3$3(ctx) {
    	let t_value = /*page*/ ctx[44] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*last_page*/ 1024 && t_value !== (t_value = /*page*/ ctx[44] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$3.name,
    		type: "slot",
    		source: "(546:10) <PaginationLink             previous             href=\\\"#/games\\\"             on:click={() => changePage(page, (page - 1) * 10)}             >",
    		ctx
    	});

    	return block;
    }

    // (545:8) <PaginationItem class={current_page === page ? "active" : ""}>
    function create_default_slot_2$3(ctx) {
    	let paginationlink;
    	let current;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[32](/*page*/ ctx[44]);
    	}

    	paginationlink = new PaginationLink({
    			props: {
    				previous: true,
    				href: "#/games",
    				$$slots: { default: [create_default_slot_3$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", click_handler_1);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const paginationlink_changes = {};

    			if (dirty[0] & /*last_page*/ 1024 | dirty[1] & /*$$scope*/ 2097152) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(545:8) <PaginationItem class={current_page === page ? \\\"active\\\" : \\\"\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (544:6) {#each range(last_page, 1) as page}
    function create_each_block(ctx) {
    	let paginationitem;
    	let current;

    	paginationitem = new PaginationItem({
    			props: {
    				class: /*current_page*/ ctx[9] === /*page*/ ctx[44]
    				? "active"
    				: "",
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*current_page, last_page*/ 1536) paginationitem_changes.class = /*current_page*/ ctx[9] === /*page*/ ctx[44]
    			? "active"
    			: "";

    			if (dirty[0] & /*last_page*/ 1024 | dirty[1] & /*$$scope*/ 2097152) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(544:6) {#each range(last_page, 1) as page}",
    		ctx
    	});

    	return block;
    }

    // (554:6) <PaginationItem class={current_page === last_page ? "disabled" : ""}>
    function create_default_slot_1$3(ctx) {
    	let paginationlink;
    	let current;

    	paginationlink = new PaginationLink({
    			props: { next: true, href: "#/games" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_2*/ ctx[33]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(554:6) <PaginationItem class={current_page === last_page ? \\\"disabled\\\" : \\\"\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (536:4) <Pagination ariaLabel="Web pagination">
    function create_default_slot$4(ctx) {
    	let paginationitem0;
    	let t0;
    	let t1;
    	let paginationitem1;
    	let current;

    	paginationitem0 = new PaginationItem({
    			props: {
    				class: /*current_page*/ ctx[9] === 1 ? "disabled" : "",
    				$$slots: { default: [create_default_slot_4$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value = range(/*last_page*/ ctx[10], 1);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	paginationitem1 = new PaginationItem({
    			props: {
    				class: /*current_page*/ ctx[9] === /*last_page*/ ctx[10]
    				? "disabled"
    				: "",
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem0.$$.fragment);
    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			create_component(paginationitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem0, target, anchor);
    			insert_dev(target, t0, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			mount_component(paginationitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem0_changes = {};
    			if (dirty[0] & /*current_page*/ 512) paginationitem0_changes.class = /*current_page*/ ctx[9] === 1 ? "disabled" : "";

    			if (dirty[0] & /*current_page, current_offset*/ 768 | dirty[1] & /*$$scope*/ 2097152) {
    				paginationitem0_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem0.$set(paginationitem0_changes);

    			if (dirty[0] & /*current_page, last_page, changePage*/ 263680) {
    				each_value = range(/*last_page*/ ctx[10], 1);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t1.parentNode, t1);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const paginationitem1_changes = {};

    			if (dirty[0] & /*current_page, last_page*/ 1536) paginationitem1_changes.class = /*current_page*/ ctx[9] === /*last_page*/ ctx[10]
    			? "disabled"
    			: "";

    			if (dirty[0] & /*current_page, current_offset*/ 768 | dirty[1] & /*$$scope*/ 2097152) {
    				paginationitem1_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem1.$set(paginationitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem0.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(paginationitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem0.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(paginationitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(paginationitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(536:4) <Pagination ariaLabel=\\\"Web pagination\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let main;
    	let nav;
    	let t0;
    	let h2;
    	let t2;
    	let p0;
    	let t3;
    	let p1;
    	let t4;
    	let t5;
    	let t6;
    	let h4;
    	let t8;
    	let table0;
    	let t9;
    	let h3;
    	let t11;
    	let table1;
    	let t12;
    	let pagination;
    	let current;

    	nav = new Nav({
    			props: {
    				$$slots: { default: [create_default_slot_14$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*errorMsg*/ ctx[6] && create_if_block_2(ctx);
    	let if_block1 = /*okMsg*/ ctx[7] && create_if_block_1$1(ctx);

    	table0 = new Table({
    			props: {
    				borderer: true,
    				$$slots: { default: [create_default_slot_11$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table1 = new Table({
    			props: {
    				borderer: true,
    				$$slots: { default: [create_default_slot_5$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	pagination = new Pagination({
    			props: {
    				ariaLabel: "Web pagination",
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(nav.$$.fragment);
    			t0 = space();
    			h2 = element("h2");
    			h2.textContent = "Juegos";
    			t2 = space();
    			p0 = element("p");
    			t3 = space();
    			p1 = element("p");
    			t4 = space();
    			if (if_block0) if_block0.c();
    			t5 = space();
    			if (if_block1) if_block1.c();
    			t6 = space();
    			h4 = element("h4");
    			h4.textContent = "Buscador";
    			t8 = space();
    			create_component(table0.$$.fragment);
    			t9 = space();
    			h3 = element("h3");
    			h3.textContent = "Juegos";
    			t11 = space();
    			create_component(table1.$$.fragment);
    			t12 = space();
    			create_component(pagination.$$.fragment);
    			attr_dev(h2, "class", "svelte-x1papj");
    			add_location(h2, file$5, 414, 4, 11851);
    			add_location(p0, file$5, 416, 4, 11874);
    			add_location(p1, file$5, 418, 4, 11887);
    			add_location(h4, file$5, 427, 4, 12066);
    			add_location(h3, file$5, 455, 2, 12910);
    			attr_dev(main, "class", "svelte-x1papj");
    			add_location(main, file$5, 378, 2, 10473);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(nav, main, null);
    			append_dev(main, t0);
    			append_dev(main, h2);
    			append_dev(main, t2);
    			append_dev(main, p0);
    			append_dev(main, t3);
    			append_dev(main, p1);
    			append_dev(main, t4);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t5);
    			if (if_block1) if_block1.m(main, null);
    			append_dev(main, t6);
    			append_dev(main, h4);
    			append_dev(main, t8);
    			mount_component(table0, main, null);
    			append_dev(main, t9);
    			append_dev(main, h3);
    			append_dev(main, t11);
    			mount_component(table1, main, null);
    			append_dev(main, t12);
    			mount_component(pagination, main, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const nav_changes = {};

    			if (dirty[0] & /*gamesStats, open2, open1*/ 7 | dirty[1] & /*$$scope*/ 2097152) {
    				nav_changes.$$scope = { dirty, ctx };
    			}

    			nav.$set(nav_changes);

    			if (/*errorMsg*/ ctx[6]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(main, t5);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*okMsg*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					if_block1.m(main, t6);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			const table0_changes = {};

    			if (dirty[0] & /*queryStat*/ 32 | dirty[1] & /*$$scope*/ 2097152) {
    				table0_changes.$$scope = { dirty, ctx };
    			}

    			table0.$set(table0_changes);
    			const table1_changes = {};

    			if (dirty[0] & /*resultQuery, isASearch, gamesStats, newStat*/ 2076 | dirty[1] & /*$$scope*/ 2097152) {
    				table1_changes.$$scope = { dirty, ctx };
    			}

    			table1.$set(table1_changes);
    			const pagination_changes = {};

    			if (dirty[0] & /*current_page, last_page, current_offset*/ 1792 | dirty[1] & /*$$scope*/ 2097152) {
    				pagination_changes.$$scope = { dirty, ctx };
    			}

    			pagination.$set(pagination_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(table0.$$.fragment, local);
    			transition_in(table1.$$.fragment, local);
    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(table0.$$.fragment, local);
    			transition_out(table1.$$.fragment, local);
    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(nav);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(table0);
    			destroy_component(table1);
    			destroy_component(pagination);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const BASE_CONTACT_API_PATH$1 = "/api/v1";

    //Calcula el rango entre ods valores
    function range(size, startAt = 0) {
    	return [...Array(size).keys()].map(i => i + startAt);
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("GamesAPI", slots, []);
    	let open1 = false;
    	const toggle1 = () => $$invalidate(0, open1 = !open1);

    	const toggle1P = () => {
    		$$invalidate(0, open1 = !open1);
    		loadStats();
    	};

    	//Delete all stats
    	let open2 = false;

    	const toggle2 = () => $$invalidate(1, open2 = !open2);

    	const toggle2P = () => {
    		$$invalidate(1, open2 = !open2);
    		deleteAllStats();
    	};

    	let gamesStats = [];
    	let resultQuery = [];

    	let newStat = {
    		"country": "",
    		"game": "",
    		"year": 0,
    		"sold-unit": 0,
    		"company": ""
    	};

    	let queryStat = {
    		country: "",
    		game: "",
    		year: "",
    		"sold-unit": "",
    		company: ""
    	};

    	//Alertas
    	let errorMsg = "";

    	let okMsg = "";
    	let errorStatus = 0;
    	let fullQuery = "";

    	//Pagination
    	let current_offset = 0;

    	let limit = 10;
    	let current_page = 1;
    	let last_page = 1;
    	let total = 0;
    	let isASearch = false;

    	// Functiones de ayuda
    	function resetInputs(flag) {
    		console.log("Reseting inputs: " + flag);

    		let resetStat = {
    			country: "",
    			game: "",
    			year: "",
    			"sold-unit": "",
    			company: ""
    		};

    		if (flag == 1) {
    			$$invalidate(5, queryStat = resetStat);
    			$$invalidate(9, current_page = 1);
    			$$invalidate(8, current_offset = 0);
    		} else {
    			$$invalidate(4, newStat = resetStat);
    		}
    	}

    	//Functions
    	async function loadStats() {
    		console.log("Loading data...");

    		await fetch(BASE_CONTACT_API_PATH$1 + "/games/loadInitialData").then(function (res) {
    			if (res.ok) {
    				console.log("OK");
    				getStats();
    				$$invalidate(6, errorMsg = "");
    				errorStatus = 0;
    				$$invalidate(7, okMsg = "Datos cargados correctamente");
    			} else {
    				if (res.status === 409) {
    					$$invalidate(6, errorMsg = "Alguno de los datos ya se encuentra cargado");
    				} else if (res.status === 500) {
    					$$invalidate(6, errorMsg = "No se han podido acceder a la base de datos");
    				}

    				$$invalidate(7, okMsg = "");
    				console.log("ERROR!" + errorMsg);
    			}
    		});
    	}

    	async function searchStat() {
    		console.log("Searching stat...");
    		var msg = "";

    		if (isASearch == false) {
    			$$invalidate(8, current_offset = 0);
    			$$invalidate(9, current_page = 1);
    		}

    		var campos = new Map(Object.entries(queryStat).filter(o => {
    				return o[1] != "";
    			}));

    		let querySymbol = "?";

    		for (var [clave, valor] of campos.entries()) {
    			msg += clave + "=" + valor + " ";
    			querySymbol += clave + "=" + valor + "&";
    		}

    		fullQuery = querySymbol.slice(0, -1);

    		if (fullQuery != "") {
    			const res = await fetch(BASE_CONTACT_API_PATH$1 + "/games/" + fullQuery + "&limit=" + limit + "&offset=" + current_offset);

    			if (res.ok) {
    				console.log("OK");
    				const json = await res.json();
    				$$invalidate(3, resultQuery = json);
    				$$invalidate(7, okMsg = "Resultado de la busqueda con " + msg);
    				$$invalidate(11, isASearch = true);
    				getNumTotalQuery();
    			} else {
    				$$invalidate(3, resultQuery = []);

    				if (res.status === 404) {
    					$$invalidate(6, errorMsg = "No existe un dato con " + msg);
    				} else if (res.status === 500) {
    					$$invalidate(6, errorMsg = "No se ha podido acceder a la base de datos");
    				}

    				$$invalidate(7, okMsg = "");
    				console.log("ERROR!" + errorMsg);
    			}
    		} else {
    			$$invalidate(6, errorMsg = "Se necesita un campo a buscar");
    			$$invalidate(7, okMsg = "");
    		}
    	} /*
    if (res.ok) {
      console.log("OK");
      const json = await res.json();
      gamesStats = json;
      okMsg="Búsqueda realizada correctamente"
    } else {
        gamesStats = [];
      if (res.status === 404) {
        errorMsg = "No se encuentra el dato solicitado";
      } else if (res.status === 500) {
        errorMsg = "No se han podido acceder a la base de datos";
      }
      okMsg = "";
      console.log("ERROR!" + errorMsg);
    }
          } else {
    errorMsg = "";
    okMsg = "Búsqueda realizada correctamente";
    getStats();
          }
          */

    	async function getNumTotalQuery() {
    		console.log("Total entities of query");
    		const res = await fetch(BASE_CONTACT_API_PATH$1 + "/games" + fullQuery);

    		if (res.ok) {
    			const json = await res.json();
    			total = json.length;
    			console.log("getTotal: " + total);
    			changePage(current_page, current_offset);
    		} else {
    			$$invalidate(6, errorMsg = "No se ha encontrado datos.");
    		}
    	}

    	function restore() {
    		if (isASearch == true) {
    			resetInputs(1);
    			$$invalidate(11, isASearch = false);
    		}

    		$$invalidate(8, current_offset = 0);
    		$$invalidate(9, current_page = 1);
    		getNumTotal();
    	}

    	//Total de datos en la BD
    	async function getNumTotal() {
    		const res = await fetch(BASE_CONTACT_API_PATH$1 + "/games");

    		if (res.ok) {
    			const json = await res.json();
    			total = json.length;
    			console.log("getTOTAL: " + total);
    			changePage(current_page, current_offset);
    		} else {
    			$$invalidate(6, errorMsg = "No se han encontrado datos.");
    		}
    	}

    	//Cambio de pagina
    	function changePage(page, offset) {
    		console.log("------Change page------");
    		console.log("Params page: " + page + " offset: " + offset);
    		$$invalidate(10, last_page = Math.ceil(total / 10));
    		console.log("new last page: " + last_page);

    		if (page !== current_page) {
    			console.log("enter if");
    			$$invalidate(8, current_offset = offset);
    			$$invalidate(9, current_page = page);
    			console.log("page: " + page);
    			console.log("current_offset: " + current_offset);
    			console.log("current_page: " + current_page);
    			getStats();
    		}

    		console.log("---------Exit change page-------");
    	}

    	async function getStats() {
    		console.log("Fetching data...");
    		const res = await fetch(BASE_CONTACT_API_PATH$1 + "/games?limit=" + limit + "&offset=" + current_offset);

    		if (res.ok) {
    			console.log("Ok");
    			const json = await res.json();
    			$$invalidate(2, gamesStats = json);
    			console.log(`We have received ${gamesStats.length} __.`);
    			$$invalidate(6, errorMsg = "");
    			getNumTotal();
    		} else {
    			if (gamesStats.length != 0) {
    				$$invalidate(6, errorMsg = "No hay datos disponibles");
    				console.log("ERROR!");
    			}

    			if (res.status === 500) {
    				$$invalidate(6, errorMsg = "No se han podido acceder a la base de datos");
    			}

    			$$invalidate(7, okMsg = "");
    			console.log("ERROR!" + errorMsg);
    		}
    	}

    	async function deleteAllStats() {
    		console.log("Deleting games...");

    		await fetch(BASE_CONTACT_API_PATH$1 + "/games/", { method: "DELETE" }).then(function (res) {
    			if (res.ok) {
    				console.log("OK");
    				$$invalidate(2, gamesStats = []);
    				$$invalidate(6, errorMsg = "");
    				$$invalidate(7, okMsg = "Operación realizada correctamente");
    			} else {
    				if (res.status === 404) {
    					$$invalidate(6, errorMsg = "No existen datos que borrar");
    				} else if (res.status === 500) {
    					$$invalidate(6, errorMsg = "No se han podido acceder a la base de datos");
    				}

    				$$invalidate(7, okMsg = "");
    				console.log("ERROR!" + errorMsg);
    			}
    		});
    	}

    	async function deleteStat(country, year) {
    		console.log(`Deleting data with name ${country} and year ${year}`);

    		await fetch(BASE_CONTACT_API_PATH$1 + "/games/" + country + "/" + year, { method: "DELETE" }).then(function (res) {
    			if (res.ok) {
    				console.log("OK");

    				if (gamesStats.length === 1) {
    					$$invalidate(2, gamesStats = []);
    					currentPage = 1;
    				}

    				$$invalidate(6, errorMsg = "");
    				$$invalidate(7, okMsg = "Operación realizada correctamente");
    				getStats();
    			} else {
    				if (res.status === 404) {
    					$$invalidate(6, errorMsg = "No existe el dato a borrar");
    				} else if (res.status === 500) {
    					$$invalidate(6, errorMsg = "No se han podido acceder a la base de datos");
    				}

    				$$invalidate(7, okMsg = "");
    				console.log("ERROR!" + errorMsg);
    			}
    		});
    	}

    	async function insertStat() {
    		console.log("Inserting game " + JSON.stringify(newStat));

    		await fetch(BASE_CONTACT_API_PATH$1 + "/games", {
    			method: "POST",
    			body: JSON.stringify(newStat),
    			headers: { "Content-Type": "application/json" }
    		}).then(res => {
    			//getStats();
    			if (res.ok) {
    				console.log("Ok.");
    				getStats();
    				$$invalidate(6, errorMsg = "");
    				errorStatus = 0;
    				$$invalidate(7, okMsg = "Dato cargado correctamente");
    			} else {
    				if (res.status === 500) {
    					$$invalidate(6, errorMsg = "No se han podido acceder a la base de datos");
    				} else if (res.status === 409) {
    					$$invalidate(6, errorMsg = "ya existe el recurso dado");
    				} else if (res.status === 400) {
    					$$invalidate(6, errorMsg = "se han introducido datos erroneos");
    				}

    				$$invalidate(7, okMsg = "");
    				console.log("ERROR!" + errorMsg);
    			}
    		});
    	}

    	onMount(getStats);
    	getNumTotal();
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<GamesAPI> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		queryStat.country = this.value;
    		$$invalidate(5, queryStat);
    	}

    	function input1_input_handler() {
    		queryStat.game = this.value;
    		$$invalidate(5, queryStat);
    	}

    	function input2_input_handler() {
    		queryStat.year = to_number(this.value);
    		$$invalidate(5, queryStat);
    	}

    	function input3_input_handler() {
    		queryStat["sold-unit"] = to_number(this.value);
    		$$invalidate(5, queryStat);
    	}

    	function input4_input_handler() {
    		queryStat.company = this.value;
    		$$invalidate(5, queryStat);
    	}

    	function input0_input_handler_1() {
    		newStat.country = this.value;
    		$$invalidate(4, newStat);
    	}

    	function input1_input_handler_1() {
    		newStat.game = this.value;
    		$$invalidate(4, newStat);
    	}

    	function input2_input_handler_1() {
    		newStat.year = to_number(this.value);
    		$$invalidate(4, newStat);
    	}

    	function input3_input_handler_1() {
    		newStat["sold-unit"] = to_number(this.value);
    		$$invalidate(4, newStat);
    	}

    	function input4_input_handler_1() {
    		newStat.company = this.value;
    		$$invalidate(4, newStat);
    	}

    	const click_handler = () => changePage(current_page - 1, current_offset - 10);
    	const click_handler_1 = page => changePage(page, (page - 1) * 10);
    	const click_handler_2 = () => changePage(current_page + 1, current_offset + 10);

    	$$self.$capture_state = () => ({
    		Nav,
    		Modal,
    		ModalBody,
    		ModalFooter,
    		ModalHeader,
    		NavItem,
    		NavLink,
    		Button,
    		Table,
    		Pagination,
    		PaginationItem,
    		PaginationLink,
    		onMount,
    		open1,
    		toggle1,
    		toggle1P,
    		open2,
    		toggle2,
    		toggle2P,
    		BASE_CONTACT_API_PATH: BASE_CONTACT_API_PATH$1,
    		gamesStats,
    		resultQuery,
    		newStat,
    		queryStat,
    		errorMsg,
    		okMsg,
    		errorStatus,
    		fullQuery,
    		current_offset,
    		limit,
    		current_page,
    		last_page,
    		total,
    		isASearch,
    		resetInputs,
    		loadStats,
    		searchStat,
    		getNumTotalQuery,
    		restore,
    		getNumTotal,
    		range,
    		changePage,
    		getStats,
    		deleteAllStats,
    		deleteStat,
    		insertStat
    	});

    	$$self.$inject_state = $$props => {
    		if ("open1" in $$props) $$invalidate(0, open1 = $$props.open1);
    		if ("open2" in $$props) $$invalidate(1, open2 = $$props.open2);
    		if ("gamesStats" in $$props) $$invalidate(2, gamesStats = $$props.gamesStats);
    		if ("resultQuery" in $$props) $$invalidate(3, resultQuery = $$props.resultQuery);
    		if ("newStat" in $$props) $$invalidate(4, newStat = $$props.newStat);
    		if ("queryStat" in $$props) $$invalidate(5, queryStat = $$props.queryStat);
    		if ("errorMsg" in $$props) $$invalidate(6, errorMsg = $$props.errorMsg);
    		if ("okMsg" in $$props) $$invalidate(7, okMsg = $$props.okMsg);
    		if ("errorStatus" in $$props) errorStatus = $$props.errorStatus;
    		if ("fullQuery" in $$props) fullQuery = $$props.fullQuery;
    		if ("current_offset" in $$props) $$invalidate(8, current_offset = $$props.current_offset);
    		if ("limit" in $$props) limit = $$props.limit;
    		if ("current_page" in $$props) $$invalidate(9, current_page = $$props.current_page);
    		if ("last_page" in $$props) $$invalidate(10, last_page = $$props.last_page);
    		if ("total" in $$props) total = $$props.total;
    		if ("isASearch" in $$props) $$invalidate(11, isASearch = $$props.isASearch);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		open1,
    		open2,
    		gamesStats,
    		resultQuery,
    		newStat,
    		queryStat,
    		errorMsg,
    		okMsg,
    		current_offset,
    		current_page,
    		last_page,
    		isASearch,
    		toggle1,
    		toggle1P,
    		toggle2,
    		toggle2P,
    		searchStat,
    		restore,
    		changePage,
    		deleteStat,
    		insertStat,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input0_input_handler_1,
    		input1_input_handler_1,
    		input2_input_handler_1,
    		input3_input_handler_1,
    		input4_input_handler_1,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class GamesAPI extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GamesAPI",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/front/GamesAPI/EditGames.svelte generated by Svelte v3.37.0 */

    const { console: console_1 } = globals;
    const file$4 = "src/front/GamesAPI/EditGames.svelte";

    // (87:8) <NavLink href="#/games">
    function create_default_slot_4$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(87:8) <NavLink href=\\\"#/games\\\">",
    		ctx
    	});

    	return block;
    }

    // (86:6) <NavItem>
    function create_default_slot_3$2(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "#/games",
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(86:6) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (85:4) <Nav>
    function create_default_slot_2$2(ctx) {
    	let navitem;
    	let current;

    	navitem = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navitem_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				navitem_changes.$$scope = { dirty, ctx };
    			}

    			navitem.$set(navitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(85:4) <Nav>",
    		ctx
    	});

    	return block;
    }

    // (124:12) <Button outline  color="primary" on:click={updateGames}>
    function create_default_slot_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Actualizar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(124:12) <Button outline  color=\\\"primary\\\" on:click={updateGames}>",
    		ctx
    	});

    	return block;
    }

    // (95:4) <Table bordered>
    function create_default_slot$3(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let t12_value = /*params*/ ctx[0].country + "";
    	let t12;
    	let t13;
    	let td1;
    	let input0;
    	let t14;
    	let td2;
    	let t15_value = /*params*/ ctx[0].year + "";
    	let t15;
    	let t16;
    	let td3;
    	let input1;
    	let t17;
    	let td4;
    	let input2;
    	let t18;
    	let td5;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*updateGames*/ ctx[6]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Juego";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Año";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Unidades vendidas";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Compañia";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			t12 = text(t12_value);
    			t13 = space();
    			td1 = element("td");
    			input0 = element("input");
    			t14 = space();
    			td2 = element("td");
    			t15 = text(t15_value);
    			t16 = space();
    			td3 = element("td");
    			input1 = element("input");
    			t17 = space();
    			td4 = element("td");
    			input2 = element("input");
    			t18 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			add_location(th0, file$4, 97, 10, 2724);
    			add_location(th1, file$4, 98, 10, 2750);
    			add_location(th2, file$4, 99, 10, 2777);
    			add_location(th3, file$4, 100, 10, 2802);
    			add_location(th4, file$4, 101, 10, 2841);
    			add_location(th5, file$4, 102, 10, 2871);
    			add_location(tr0, file$4, 96, 8, 2709);
    			add_location(thead, file$4, 95, 6, 2693);
    			add_location(td0, file$4, 117, 10, 3336);
    			add_location(input0, file$4, 118, 14, 3376);
    			add_location(td1, file$4, 118, 10, 3372);
    			add_location(td2, file$4, 119, 10, 3425);
    			attr_dev(input1, "type", "number");
    			add_location(input1, file$4, 120, 14, 3462);
    			add_location(td3, file$4, 120, 10, 3458);
    			add_location(input2, file$4, 121, 14, 3531);
    			add_location(td4, file$4, 121, 10, 3527);
    			add_location(td5, file$4, 122, 10, 3583);
    			add_location(tr1, file$4, 106, 8, 2940);
    			add_location(tbody, file$4, 105, 6, 2924);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, t12);
    			append_dev(tr1, t13);
    			append_dev(tr1, td1);
    			append_dev(td1, input0);
    			set_input_value(input0, /*updateGame*/ ctx[1]);
    			append_dev(tr1, t14);
    			append_dev(tr1, td2);
    			append_dev(td2, t15);
    			append_dev(tr1, t16);
    			append_dev(tr1, td3);
    			append_dev(td3, input1);
    			set_input_value(input1, /*updateSoldUnit*/ ctx[2]);
    			append_dev(tr1, t17);
    			append_dev(tr1, td4);
    			append_dev(td4, input2);
    			set_input_value(input2, /*updateCompany*/ ctx[3]);
    			append_dev(tr1, t18);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[7]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[8]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[9])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*params*/ 1) && t12_value !== (t12_value = /*params*/ ctx[0].country + "")) set_data_dev(t12, t12_value);

    			if (dirty & /*updateGame*/ 2 && input0.value !== /*updateGame*/ ctx[1]) {
    				set_input_value(input0, /*updateGame*/ ctx[1]);
    			}

    			if ((!current || dirty & /*params*/ 1) && t15_value !== (t15_value = /*params*/ ctx[0].year + "")) set_data_dev(t15, t15_value);

    			if (dirty & /*updateSoldUnit*/ 4 && to_number(input1.value) !== /*updateSoldUnit*/ ctx[2]) {
    				set_input_value(input1, /*updateSoldUnit*/ ctx[2]);
    			}

    			if (dirty & /*updateCompany*/ 8 && input2.value !== /*updateCompany*/ ctx[3]) {
    				set_input_value(input2, /*updateCompany*/ ctx[3]);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(95:4) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (129:4) {#if errorMsg}
    function create_if_block_1(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("ERROR: ");
    			t1 = text(/*errorMsg*/ ctx[4]);
    			set_style(p, "color", "red");
    			add_location(p, file$4, 129, 6, 3761);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*errorMsg*/ 16) set_data_dev(t1, /*errorMsg*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(129:4) {#if errorMsg}",
    		ctx
    	});

    	return block;
    }

    // (132:4) {#if okMsg}
    function create_if_block(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*okMsg*/ ctx[5]);
    			set_style(p, "color", "green");
    			add_location(p, file$4, 132, 4, 3835);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*okMsg*/ 32) set_data_dev(t, /*okMsg*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(132:4) {#if okMsg}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let main;
    	let nav;
    	let t0;
    	let h2;
    	let t1;
    	let strong;
    	let t2_value = /*params*/ ctx[0].country + "";
    	let t2;
    	let t3;
    	let table;
    	let t4;
    	let t5;
    	let current;

    	nav = new Nav({
    			props: {
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*errorMsg*/ ctx[4] && create_if_block_1(ctx);
    	let if_block1 = /*okMsg*/ ctx[5] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(nav.$$.fragment);
    			t0 = space();
    			h2 = element("h2");
    			t1 = text("Editar campo \n      ");
    			strong = element("strong");
    			t2 = text(t2_value);
    			t3 = space();
    			create_component(table.$$.fragment);
    			t4 = space();
    			if (if_block0) if_block0.c();
    			t5 = space();
    			if (if_block1) if_block1.c();
    			add_location(strong, file$4, 92, 6, 2622);
    			add_location(h2, file$4, 90, 4, 2591);
    			attr_dev(main, "class", "svelte-1d1hksy");
    			add_location(main, file$4, 83, 2, 2474);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(nav, main, null);
    			append_dev(main, t0);
    			append_dev(main, h2);
    			append_dev(h2, t1);
    			append_dev(h2, strong);
    			append_dev(strong, t2);
    			append_dev(main, t3);
    			mount_component(table, main, null);
    			append_dev(main, t4);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t5);
    			if (if_block1) if_block1.m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const nav_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				nav_changes.$$scope = { dirty, ctx };
    			}

    			nav.$set(nav_changes);
    			if ((!current || dirty & /*params*/ 1) && t2_value !== (t2_value = /*params*/ ctx[0].country + "")) set_data_dev(t2, t2_value);
    			const table_changes = {};

    			if (dirty & /*$$scope, updateCompany, updateSoldUnit, params, updateGame*/ 16399) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);

    			if (/*errorMsg*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(main, t5);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*okMsg*/ ctx[5]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(main, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(nav);
    			destroy_component(table);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const BASE_CONTACT_API_PATH = "/api/v1";

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("EditGames", slots, []);
    	let { params = {} } = $$props;
    	let stat = {};
    	let updateCountry = "XXXX";
    	let updateGame = "XXXX";
    	let updateYear = 1999;
    	let updateSoldUnit = 999999;
    	let updateCompany = "XXXX";
    	let errorMsg = "";
    	let okMsg = "";

    	async function getStat() {
    		console.log("Fetching stat..." + params.country + " " + params.year);
    		const res = await fetch(BASE_CONTACT_API_PATH + "/games/" + params.country + "/" + params.year);

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			stat = json;
    			updateCountry = stat.country;
    			$$invalidate(1, updateGame = stat.game);
    			updateYear = stat.year;
    			$$invalidate(2, updateSoldUnit = stat["sold-unit"]);
    			$$invalidate(3, updateCompany = stat.company);
    			console.log("Received stat.");
    		} else {
    			if (res.status === 404) {
    				$$invalidate(4, errorMsg = "No se encuentra el dato solicitado");
    			} else if (res.status === 500) {
    				$$invalidate(4, errorMsg = "No se han podido acceder a la base de datos");
    			}

    			$$invalidate(5, okMsg = "");
    			console.log("ERROR!" + errorMsg);
    		}
    	}

    	async function updateGames() {
    		console.log("Updating games..." + JSON.stringify(params.country));

    		await fetch("/api/v1/games/" + params.country + "/" + params.year, {
    			method: "PUT",
    			body: JSON.stringify({
    				"country": params.country,
    				"game": updateGame,
    				"year": parseInt(params.year),
    				"sold-unit": updateSoldUnit,
    				"company": updateCompany
    			}),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			//getStat();
    			if (res.ok) {
    				console.log("OK");
    				getAward();
    				$$invalidate(5, okMsg = "Operación realizada correctamente, vuelva atras para ver todos los datos en la tabla");
    			} else {
    				if (res.status === 404) {
    					$$invalidate(4, errorMsg = "No se encuentra el dato a editar");
    				} else if (res.status === 500) {
    					$$invalidate(4, errorMsg = "No se han podido acceder a la base de datos");
    				} else if (res.status === 400) {
    					$$invalidate(4, errorMsg = "se han introducido datos erroneos");
    				}

    				$$invalidate(5, okMsg = "");
    				console.log("ERROR!" + errorMsg);
    			}
    		});
    	}

    	onMount(getStat);
    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<EditGames> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		updateGame = this.value;
    		$$invalidate(1, updateGame);
    	}

    	function input1_input_handler() {
    		updateSoldUnit = to_number(this.value);
    		$$invalidate(2, updateSoldUnit);
    	}

    	function input2_input_handler() {
    		updateCompany = this.value;
    		$$invalidate(3, updateCompany);
    	}

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		Nav,
    		NavItem,
    		NavLink,
    		BASE_CONTACT_API_PATH,
    		params,
    		stat,
    		updateCountry,
    		updateGame,
    		updateYear,
    		updateSoldUnit,
    		updateCompany,
    		errorMsg,
    		okMsg,
    		getStat,
    		updateGames
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    		if ("stat" in $$props) stat = $$props.stat;
    		if ("updateCountry" in $$props) updateCountry = $$props.updateCountry;
    		if ("updateGame" in $$props) $$invalidate(1, updateGame = $$props.updateGame);
    		if ("updateYear" in $$props) updateYear = $$props.updateYear;
    		if ("updateSoldUnit" in $$props) $$invalidate(2, updateSoldUnit = $$props.updateSoldUnit);
    		if ("updateCompany" in $$props) $$invalidate(3, updateCompany = $$props.updateCompany);
    		if ("errorMsg" in $$props) $$invalidate(4, errorMsg = $$props.errorMsg);
    		if ("okMsg" in $$props) $$invalidate(5, okMsg = $$props.okMsg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		updateGame,
    		updateSoldUnit,
    		updateCompany,
    		errorMsg,
    		okMsg,
    		updateGames,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class EditGames extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditGames",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get params() {
    		throw new Error("<EditGames>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<EditGames>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Pages/Home.svelte generated by Svelte v3.37.0 */

    const file$3 = "src/Pages/Home.svelte";

    // (23:4) <Col>
    function create_default_slot_35$1(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "José Manuel Martín de los Santos";
    			attr_dev(a, "href", "https://github.com/spartano27");
    			add_location(a, file$3, 23, 6, 297);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_35$1.name,
    		type: "slot",
    		source: "(23:4) <Col>",
    		ctx
    	});

    	return block;
    }

    // (26:4) <Col>
    function create_default_slot_34$1(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Marina Barragán Candel";
    			attr_dev(a, "href", "https://github.com/MarinaBC");
    			add_location(a, file$3, 26, 6, 401);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_34$1.name,
    		type: "slot",
    		source: "(26:4) <Col>",
    		ctx
    	});

    	return block;
    }

    // (29:4) <Col>
    function create_default_slot_33$1(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Fernando Olmedo Delgado";
    			attr_dev(a, "href", "https://github.com/Fernasilver");
    			add_location(a, file$3, 29, 6, 493);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_33$1.name,
    		type: "slot",
    		source: "(29:4) <Col>",
    		ctx
    	});

    	return block;
    }

    // (22:2) <Container>
    function create_default_slot_32$1(ctx) {
    	let col0;
    	let t0;
    	let col1;
    	let t1;
    	let col2;
    	let current;

    	col0 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_35$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col1 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_34$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col2 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_33$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t0 = space();
    			create_component(col1.$$.fragment);
    			t1 = space();
    			create_component(col2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(col1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(col2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    			const col2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col2_changes.$$scope = { dirty, ctx };
    			}

    			col2.$set(col2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			transition_in(col2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			transition_out(col2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(col1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(col2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_32$1.name,
    		type: "slot",
    		source: "(22:2) <Container>",
    		ctx
    	});

    	return block;
    }

    // (41:4) <Col>
    function create_default_slot_31$1(ctx) {
    	let a;
    	let b;
    	let t1;

    	const block = {
    		c: function create() {
    			a = element("a");
    			b = element("b");
    			b.textContent = "Repositorio: ";
    			t1 = text("http://github.com/gti-sos/SOS2021-28");
    			attr_dev(b, "class", "svelte-il7l6l");
    			add_location(b, file$3, 42, 9, 894);
    			attr_dev(a, "href", "http://github.com/gti-sos/SOS2021-28");
    			add_location(a, file$3, 41, 6, 838);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, b);
    			append_dev(a, t1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_31$1.name,
    		type: "slot",
    		source: "(41:4) <Col>",
    		ctx
    	});

    	return block;
    }

    // (46:4) <Col>
    function create_default_slot_30$1(ctx) {
    	let a;
    	let b;
    	let t1;

    	const block = {
    		c: function create() {
    			a = element("a");
    			b = element("b");
    			b.textContent = "Enlace: ";
    			t1 = text("http://sos2021-28.herokuapp.com");
    			attr_dev(b, "class", "svelte-il7l6l");
    			add_location(b, file$3, 47, 9, 1040);
    			attr_dev(a, "href", "http://sos2021-28.herokuapp.com");
    			add_location(a, file$3, 46, 6, 989);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, b);
    			append_dev(a, t1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_30$1.name,
    		type: "slot",
    		source: "(46:4) <Col>",
    		ctx
    	});

    	return block;
    }

    // (40:2) <Container>
    function create_default_slot_29$1(ctx) {
    	let col0;
    	let t;
    	let col1;
    	let current;

    	col0 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_31$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col1 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_30$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t = space();
    			create_component(col1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(col1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(col1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_29$1.name,
    		type: "slot",
    		source: "(40:2) <Container>",
    		ctx
    	});

    	return block;
    }

    // (55:4) <Button color="primary">
    function create_default_slot_28$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Info");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_28$1.name,
    		type: "slot",
    		source: "(55:4) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (65:10) <CardTitle>
    function create_default_slot_27$1(ctx) {
    	let h5;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			h5.textContent = "Awards";
    			add_location(h5, file$3, 64, 21, 1331);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_27$1.name,
    		type: "slot",
    		source: "(65:10) <CardTitle>",
    		ctx
    	});

    	return block;
    }

    // (64:8) <CardHeader>
    function create_default_slot_26$1(ctx) {
    	let cardtitle;
    	let current;

    	cardtitle = new CardTitle({
    			props: {
    				$$slots: { default: [create_default_slot_27$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardtitle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardtitle, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardtitle_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardtitle_changes.$$scope = { dirty, ctx };
    			}

    			cardtitle.$set(cardtitle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardtitle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardtitle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardtitle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_26$1.name,
    		type: "slot",
    		source: "(64:8) <CardHeader>",
    		ctx
    	});

    	return block;
    }

    // (71:12) <Button color="primary">
    function create_default_slot_25$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("API");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_25$1.name,
    		type: "slot",
    		source: "(71:12) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (74:12) <Button color="primary">
    function create_default_slot_24$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Interfaz");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_24$1.name,
    		type: "slot",
    		source: "(74:12) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (77:13) <Button color="info">
    function create_default_slot_23$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Documentación de Postman");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_23$1.name,
    		type: "slot",
    		source: "(77:13) <Button color=\\\"info\\\">",
    		ctx
    	});

    	return block;
    }

    // (67:8) <CardBody>
    function create_default_slot_22$1(ctx) {
    	let cardsubtitle;
    	let t0;
    	let a0;
    	let button0;
    	let t1;
    	let a1;
    	let button1;
    	let t2;
    	let a2;
    	let button2;
    	let current;
    	cardsubtitle = new CardSubtitle({ $$inline: true });

    	button0 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_25$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_24$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2 = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_23$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardsubtitle.$$.fragment);
    			t0 = space();
    			a0 = element("a");
    			create_component(button0.$$.fragment);
    			t1 = space();
    			a1 = element("a");
    			create_component(button1.$$.fragment);
    			t2 = space();
    			a2 = element("a");
    			create_component(button2.$$.fragment);
    			attr_dev(a0, "href", "https://sos2021-28.herokuapp.com/api/v1/awards");
    			add_location(a0, file$3, 69, 10, 1448);
    			attr_dev(a1, "href", "/#/awards");
    			add_location(a1, file$3, 72, 10, 1580);
    			attr_dev(a2, "href", "https://documenter.getpostman.com/view/14941757/TzJoE12q");
    			add_location(a2, file$3, 75, 10, 1680);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardsubtitle, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, a0, anchor);
    			mount_component(button0, a0, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, a1, anchor);
    			mount_component(button1, a1, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, a2, anchor);
    			mount_component(button2, a2, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardsubtitle.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardsubtitle.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardsubtitle, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(a0);
    			destroy_component(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(a1);
    			destroy_component(button1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(a2);
    			destroy_component(button2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_22$1.name,
    		type: "slot",
    		source: "(67:8) <CardBody>",
    		ctx
    	});

    	return block;
    }

    // (80:8) <CardFooter           >
    function create_default_slot_21$1(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "José Manuel Martín de los Santos";
    			attr_dev(a, "href", "https://github.com/spartano27");
    			add_location(a, file$3, 81, 10, 1892);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_21$1.name,
    		type: "slot",
    		source: "(80:8) <CardFooter           >",
    		ctx
    	});

    	return block;
    }

    // (63:6) <Card class="mb-3">
    function create_default_slot_20$1(ctx) {
    	let cardheader;
    	let t0;
    	let cardbody;
    	let t1;
    	let cardfooter;
    	let current;

    	cardheader = new CardHeader({
    			props: {
    				$$slots: { default: [create_default_slot_26$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	cardbody = new CardBody({
    			props: {
    				$$slots: { default: [create_default_slot_22$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	cardfooter = new CardFooter({
    			props: {
    				$$slots: { default: [create_default_slot_21$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardheader.$$.fragment);
    			t0 = space();
    			create_component(cardbody.$$.fragment);
    			t1 = space();
    			create_component(cardfooter.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardheader, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(cardbody, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(cardfooter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardheader_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardheader_changes.$$scope = { dirty, ctx };
    			}

    			cardheader.$set(cardheader_changes);
    			const cardbody_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardbody_changes.$$scope = { dirty, ctx };
    			}

    			cardbody.$set(cardbody_changes);
    			const cardfooter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardfooter_changes.$$scope = { dirty, ctx };
    			}

    			cardfooter.$set(cardfooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardheader.$$.fragment, local);
    			transition_in(cardbody.$$.fragment, local);
    			transition_in(cardfooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardheader.$$.fragment, local);
    			transition_out(cardbody.$$.fragment, local);
    			transition_out(cardfooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardheader, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(cardbody, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(cardfooter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20$1.name,
    		type: "slot",
    		source: "(63:6) <Card class=\\\"mb-3\\\">",
    		ctx
    	});

    	return block;
    }

    // (62:4) <Col xs="auto">
    function create_default_slot_19$1(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				class: "mb-3",
    				$$slots: { default: [create_default_slot_20$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19$1.name,
    		type: "slot",
    		source: "(62:4) <Col xs=\\\"auto\\\">",
    		ctx
    	});

    	return block;
    }

    // (92:10) <CardTitle>
    function create_default_slot_18$1(ctx) {
    	let h5;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			h5.textContent = "Platforms";
    			add_location(h5, file$3, 91, 21, 2106);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18$1.name,
    		type: "slot",
    		source: "(92:10) <CardTitle>",
    		ctx
    	});

    	return block;
    }

    // (91:8) <CardHeader>
    function create_default_slot_17$1(ctx) {
    	let cardtitle;
    	let current;

    	cardtitle = new CardTitle({
    			props: {
    				$$slots: { default: [create_default_slot_18$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardtitle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardtitle, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardtitle_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardtitle_changes.$$scope = { dirty, ctx };
    			}

    			cardtitle.$set(cardtitle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardtitle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardtitle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardtitle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17$1.name,
    		type: "slot",
    		source: "(91:8) <CardHeader>",
    		ctx
    	});

    	return block;
    }

    // (98:12) <Button color="primary">
    function create_default_slot_16$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("API");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16$1.name,
    		type: "slot",
    		source: "(98:12) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (101:12) <Button color="primary">
    function create_default_slot_15$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Interfaz");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15$1.name,
    		type: "slot",
    		source: "(101:12) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (104:12) <Button color="info">
    function create_default_slot_14$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Documentación de Postman");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14$1.name,
    		type: "slot",
    		source: "(104:12) <Button color=\\\"info\\\">",
    		ctx
    	});

    	return block;
    }

    // (94:8) <CardBody>
    function create_default_slot_13$1(ctx) {
    	let cardsubtitle;
    	let t0;
    	let a0;
    	let button0;
    	let t1;
    	let a1;
    	let button1;
    	let t2;
    	let a2;
    	let button2;
    	let current;
    	cardsubtitle = new CardSubtitle({ $$inline: true });

    	button0 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_16$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_15$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2 = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_14$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardsubtitle.$$.fragment);
    			t0 = space();
    			a0 = element("a");
    			create_component(button0.$$.fragment);
    			t1 = space();
    			a1 = element("a");
    			create_component(button1.$$.fragment);
    			t2 = space();
    			a2 = element("a");
    			create_component(button2.$$.fragment);
    			attr_dev(a0, "href", "https://sos2021-28.herokuapp.com/api/v1/platforms");
    			add_location(a0, file$3, 96, 10, 2226);
    			attr_dev(a1, "href", "/#/platforms");
    			add_location(a1, file$3, 99, 10, 2361);
    			attr_dev(a2, "href", "https://documenter.getpostman.com/view/14944973/TzJsexb1");
    			add_location(a2, file$3, 102, 10, 2464);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardsubtitle, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, a0, anchor);
    			mount_component(button0, a0, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, a1, anchor);
    			mount_component(button1, a1, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, a2, anchor);
    			mount_component(button2, a2, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardsubtitle.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardsubtitle.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardsubtitle, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(a0);
    			destroy_component(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(a1);
    			destroy_component(button1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(a2);
    			destroy_component(button2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13$1.name,
    		type: "slot",
    		source: "(94:8) <CardBody>",
    		ctx
    	});

    	return block;
    }

    // (107:8) <CardFooter           >
    function create_default_slot_12$1(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Marina Barragán Candel";
    			attr_dev(a, "href", "https://github.com/MarinaBC");
    			add_location(a, file$3, 108, 10, 2676);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12$1.name,
    		type: "slot",
    		source: "(107:8) <CardFooter           >",
    		ctx
    	});

    	return block;
    }

    // (90:6) <Card class="mb-3">
    function create_default_slot_11$1(ctx) {
    	let cardheader;
    	let t0;
    	let cardbody;
    	let t1;
    	let cardfooter;
    	let current;

    	cardheader = new CardHeader({
    			props: {
    				$$slots: { default: [create_default_slot_17$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	cardbody = new CardBody({
    			props: {
    				$$slots: { default: [create_default_slot_13$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	cardfooter = new CardFooter({
    			props: {
    				$$slots: { default: [create_default_slot_12$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardheader.$$.fragment);
    			t0 = space();
    			create_component(cardbody.$$.fragment);
    			t1 = space();
    			create_component(cardfooter.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardheader, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(cardbody, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(cardfooter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardheader_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardheader_changes.$$scope = { dirty, ctx };
    			}

    			cardheader.$set(cardheader_changes);
    			const cardbody_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardbody_changes.$$scope = { dirty, ctx };
    			}

    			cardbody.$set(cardbody_changes);
    			const cardfooter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardfooter_changes.$$scope = { dirty, ctx };
    			}

    			cardfooter.$set(cardfooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardheader.$$.fragment, local);
    			transition_in(cardbody.$$.fragment, local);
    			transition_in(cardfooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardheader.$$.fragment, local);
    			transition_out(cardbody.$$.fragment, local);
    			transition_out(cardfooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardheader, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(cardbody, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(cardfooter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11$1.name,
    		type: "slot",
    		source: "(90:6) <Card class=\\\"mb-3\\\">",
    		ctx
    	});

    	return block;
    }

    // (89:4) <Col xs="auto">
    function create_default_slot_10$1(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				class: "mb-3",
    				$$slots: { default: [create_default_slot_11$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$1.name,
    		type: "slot",
    		source: "(89:4) <Col xs=\\\"auto\\\">",
    		ctx
    	});

    	return block;
    }

    // (118:10) <CardTitle>
    function create_default_slot_9$1(ctx) {
    	let h5;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			h5.textContent = "Games";
    			add_location(h5, file$3, 117, 21, 2877);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$1.name,
    		type: "slot",
    		source: "(118:10) <CardTitle>",
    		ctx
    	});

    	return block;
    }

    // (117:8) <CardHeader>
    function create_default_slot_8$1(ctx) {
    	let cardtitle;
    	let current;

    	cardtitle = new CardTitle({
    			props: {
    				$$slots: { default: [create_default_slot_9$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardtitle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardtitle, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardtitle_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardtitle_changes.$$scope = { dirty, ctx };
    			}

    			cardtitle.$set(cardtitle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardtitle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardtitle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardtitle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(117:8) <CardHeader>",
    		ctx
    	});

    	return block;
    }

    // (124:12) <Button color="primary">
    function create_default_slot_7$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("API");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(124:12) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (127:12) <Button color="primary">
    function create_default_slot_6$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Interfaz");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(127:12) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (130:12) <Button color="info">
    function create_default_slot_5$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Documentación de Postman");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(130:12) <Button color=\\\"info\\\">",
    		ctx
    	});

    	return block;
    }

    // (120:8) <CardBody>
    function create_default_slot_4$1(ctx) {
    	let cardsubtitle;
    	let t0;
    	let a0;
    	let button0;
    	let t1;
    	let a1;
    	let button1;
    	let t2;
    	let a2;
    	let button2;
    	let current;
    	cardsubtitle = new CardSubtitle({ $$inline: true });

    	button0 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2 = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardsubtitle.$$.fragment);
    			t0 = space();
    			a0 = element("a");
    			create_component(button0.$$.fragment);
    			t1 = space();
    			a1 = element("a");
    			create_component(button1.$$.fragment);
    			t2 = space();
    			a2 = element("a");
    			create_component(button2.$$.fragment);
    			attr_dev(a0, "href", "https://sos2021-28.herokuapp.com/api/v1/games");
    			add_location(a0, file$3, 122, 10, 2993);
    			attr_dev(a1, "href", "/#/games");
    			add_location(a1, file$3, 125, 10, 3124);
    			attr_dev(a2, "href", "https://documenter.getpostman.com/view/14967482/TzJu8cmV");
    			add_location(a2, file$3, 128, 10, 3223);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardsubtitle, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, a0, anchor);
    			mount_component(button0, a0, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, a1, anchor);
    			mount_component(button1, a1, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, a2, anchor);
    			mount_component(button2, a2, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardsubtitle.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardsubtitle.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardsubtitle, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(a0);
    			destroy_component(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(a1);
    			destroy_component(button1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(a2);
    			destroy_component(button2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(120:8) <CardBody>",
    		ctx
    	});

    	return block;
    }

    // (133:8) <CardFooter           >
    function create_default_slot_3$1(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Fernando Olmedo Delgado";
    			attr_dev(a, "href", "https://github.com/Fernasilver");
    			add_location(a, file$3, 134, 10, 3435);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(133:8) <CardFooter           >",
    		ctx
    	});

    	return block;
    }

    // (116:6) <Card class="mb-3">
    function create_default_slot_2$1(ctx) {
    	let cardheader;
    	let t0;
    	let cardbody;
    	let t1;
    	let cardfooter;
    	let current;

    	cardheader = new CardHeader({
    			props: {
    				$$slots: { default: [create_default_slot_8$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	cardbody = new CardBody({
    			props: {
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	cardfooter = new CardFooter({
    			props: {
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardheader.$$.fragment);
    			t0 = space();
    			create_component(cardbody.$$.fragment);
    			t1 = space();
    			create_component(cardfooter.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardheader, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(cardbody, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(cardfooter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardheader_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardheader_changes.$$scope = { dirty, ctx };
    			}

    			cardheader.$set(cardheader_changes);
    			const cardbody_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardbody_changes.$$scope = { dirty, ctx };
    			}

    			cardbody.$set(cardbody_changes);
    			const cardfooter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardfooter_changes.$$scope = { dirty, ctx };
    			}

    			cardfooter.$set(cardfooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardheader.$$.fragment, local);
    			transition_in(cardbody.$$.fragment, local);
    			transition_in(cardfooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardheader.$$.fragment, local);
    			transition_out(cardbody.$$.fragment, local);
    			transition_out(cardfooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardheader, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(cardbody, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(cardfooter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(116:6) <Card class=\\\"mb-3\\\">",
    		ctx
    	});

    	return block;
    }

    // (115:1) <Col xs="auto">
    function create_default_slot_1$1(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				class: "mb-3",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(115:1) <Col xs=\\\"auto\\\">",
    		ctx
    	});

    	return block;
    }

    // (61:2) <Container>
    function create_default_slot$2(ctx) {
    	let col0;
    	let t0;
    	let col1;
    	let t1;
    	let col2;
    	let current;

    	col0 = new Col({
    			props: {
    				xs: "auto",
    				$$slots: { default: [create_default_slot_19$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col1 = new Col({
    			props: {
    				xs: "auto",
    				$$slots: { default: [create_default_slot_10$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col2 = new Col({
    			props: {
    				xs: "auto",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t0 = space();
    			create_component(col1.$$.fragment);
    			t1 = space();
    			create_component(col2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(col1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(col2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    			const col2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col2_changes.$$scope = { dirty, ctx };
    			}

    			col2.$set(col2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			transition_in(col2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			transition_out(col2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(col1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(col2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(61:2) <Container>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let h20;
    	let t3;
    	let container0;
    	let t4;
    	let p0;
    	let t5;
    	let h21;
    	let t7;
    	let p1;
    	let t9;
    	let container1;
    	let t10;
    	let p2;
    	let t11;
    	let a;
    	let button;
    	let t12;
    	let p3;
    	let t13;
    	let h22;
    	let t15;
    	let container2;
    	let current;

    	container0 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot_32$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	container1 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot_29$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_28$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	container2 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "SOS2021-28";
    			t1 = space();
    			h20 = element("h2");
    			h20.textContent = "Integrantes:";
    			t3 = space();
    			create_component(container0.$$.fragment);
    			t4 = space();
    			p0 = element("p");
    			t5 = space();
    			h21 = element("h2");
    			h21.textContent = "Descripción del proyecto:";
    			t7 = space();
    			p1 = element("p");
    			p1.textContent = "Investigación y Analisis de las ventas de videojuegos y su relacion con la cantidad de consolas vendidas\n\ty los premios que haya obtenido dicho videojuego.";
    			t9 = space();
    			create_component(container1.$$.fragment);
    			t10 = space();
    			p2 = element("p");
    			t11 = space();
    			a = element("a");
    			create_component(button.$$.fragment);
    			t12 = space();
    			p3 = element("p");
    			t13 = space();
    			h22 = element("h2");
    			h22.textContent = "APIs";
    			t15 = space();
    			create_component(container2.$$.fragment);
    			attr_dev(h1, "class", "svelte-il7l6l");
    			add_location(h1, file$3, 18, 2, 222);
    			add_location(h20, file$3, 20, 2, 245);
    			add_location(p0, file$3, 32, 2, 590);
    			add_location(h21, file$3, 33, 2, 598);
    			add_location(p1, file$3, 34, 2, 636);
    			add_location(p2, file$3, 51, 2, 1126);
    			attr_dev(a, "href", "/#/info");
    			add_location(a, file$3, 53, 2, 1135);
    			add_location(p3, file$3, 57, 2, 1206);
    			add_location(h22, file$3, 59, 2, 1215);
    			attr_dev(main, "class", "svelte-il7l6l");
    			add_location(main, file$3, 17, 0, 213);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, h20);
    			append_dev(main, t3);
    			mount_component(container0, main, null);
    			append_dev(main, t4);
    			append_dev(main, p0);
    			append_dev(main, t5);
    			append_dev(main, h21);
    			append_dev(main, t7);
    			append_dev(main, p1);
    			append_dev(main, t9);
    			mount_component(container1, main, null);
    			append_dev(main, t10);
    			append_dev(main, p2);
    			append_dev(main, t11);
    			append_dev(main, a);
    			mount_component(button, a, null);
    			append_dev(main, t12);
    			append_dev(main, p3);
    			append_dev(main, t13);
    			append_dev(main, h22);
    			append_dev(main, t15);
    			mount_component(container2, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const container0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container0_changes.$$scope = { dirty, ctx };
    			}

    			container0.$set(container0_changes);
    			const container1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container1_changes.$$scope = { dirty, ctx };
    			}

    			container1.$set(container1_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			const container2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container2_changes.$$scope = { dirty, ctx };
    			}

    			container2.$set(container2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container0.$$.fragment, local);
    			transition_in(container1.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			transition_in(container2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container0.$$.fragment, local);
    			transition_out(container1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(container2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(container0);
    			destroy_component(container1);
    			destroy_component(button);
    			destroy_component(container2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Home", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Button,
    		Icon,
    		Card,
    		CardBody,
    		CardFooter,
    		CardHeader,
    		CardSubtitle,
    		CardText,
    		CardTitle,
    		Col,
    		Container,
    		Row
    	});

    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Pages/NotFound.svelte generated by Svelte v3.37.0 */
    const file$2 = "src/Pages/NotFound.svelte";

    // (13:4) <Button color="primary">
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver a la página principal");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(13:4) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let main;
    	let h2;
    	let t1;
    	let h4;
    	let t3;
    	let p;
    	let t5;
    	let a;
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			h2 = element("h2");
    			h2.textContent = "404";
    			t1 = space();
    			h4 = element("h4");
    			h4.textContent = "Página no encontrada";
    			t3 = space();
    			p = element("p");
    			p.textContent = "La página que estabas buscando no existe. Tal vez hallas escrito \n  mal la dirección o esta ha cambiado.";
    			t5 = space();
    			a = element("a");
    			create_component(button.$$.fragment);
    			attr_dev(h2, "class", "svelte-x3yptu");
    			add_location(h2, file$2, 7, 2, 73);
    			attr_dev(h4, "class", "svelte-x3yptu");
    			add_location(h4, file$2, 8, 0, 86);
    			add_location(p, file$2, 9, 0, 116);
    			attr_dev(a, "href", "/");
    			add_location(a, file$2, 11, 2, 230);
    			attr_dev(main, "class", "svelte-x3yptu");
    			add_location(main, file$2, 6, 0, 64);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h2);
    			append_dev(main, t1);
    			append_dev(main, h4);
    			append_dev(main, t3);
    			append_dev(main, p);
    			append_dev(main, t5);
    			append_dev(main, a);
    			mount_component(button, a, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("NotFound", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NotFound> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Button });
    	return [];
    }

    class NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotFound",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Pages/Info.svelte generated by Svelte v3.37.0 */

    const file$1 = "src/Pages/Info.svelte";

    // (27:6) <NavLink href="/">
    function create_default_slot_38(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Volver");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_38.name,
    		type: "slot",
    		source: "(27:6) <NavLink href=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (26:4) <NavItem>
    function create_default_slot_37(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "/",
    				$$slots: { default: [create_default_slot_38] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_37.name,
    		type: "slot",
    		source: "(26:4) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (25:2) <Nav>
    function create_default_slot_36(ctx) {
    	let navitem;
    	let current;

    	navitem = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_37] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navitem_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				navitem_changes.$$scope = { dirty, ctx };
    			}

    			navitem.$set(navitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_36.name,
    		type: "slot",
    		source: "(25:2) <Nav>",
    		ctx
    	});

    	return block;
    }

    // (39:4) <Col>
    function create_default_slot_35(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "José Manuel Martín de los Santos";
    			attr_dev(a, "href", "https://github.com/spartano27");
    			add_location(a, file$1, 39, 6, 423);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_35.name,
    		type: "slot",
    		source: "(39:4) <Col>",
    		ctx
    	});

    	return block;
    }

    // (43:4) <Col>
    function create_default_slot_34(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Marina Barragán Candel";
    			attr_dev(a, "href", "https://github.com/MarinaBC");
    			add_location(a, file$1, 43, 6, 529);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_34.name,
    		type: "slot",
    		source: "(43:4) <Col>",
    		ctx
    	});

    	return block;
    }

    // (47:4) <Col>
    function create_default_slot_33(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Fernando Olmedo Delgado";
    			attr_dev(a, "href", "https://github.com/Fernasilver");
    			add_location(a, file$1, 47, 6, 623);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_33.name,
    		type: "slot",
    		source: "(47:4) <Col>",
    		ctx
    	});

    	return block;
    }

    // (37:2) <Container>
    function create_default_slot_32(ctx) {
    	let col0;
    	let t0;
    	let col1;
    	let t1;
    	let col2;
    	let current;

    	col0 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_35] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col1 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_34] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col2 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_33] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t0 = space();
    			create_component(col1.$$.fragment);
    			t1 = space();
    			create_component(col2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(col1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(col2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    			const col2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col2_changes.$$scope = { dirty, ctx };
    			}

    			col2.$set(col2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			transition_in(col2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			transition_out(col2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(col1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(col2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_32.name,
    		type: "slot",
    		source: "(37:2) <Container>",
    		ctx
    	});

    	return block;
    }

    // (57:10) <Button color="primary">
    function create_default_slot_31(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("GitHub");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_31.name,
    		type: "slot",
    		source: "(57:10) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (55:6) <Col>
    function create_default_slot_30(ctx) {
    	let a;
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_31] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			a = element("a");
    			create_component(button.$$.fragment);
    			attr_dev(a, "href", "http://github.com/gti-sos/SOS2021-28");
    			add_location(a, file$1, 55, 8, 772);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			mount_component(button, a, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_30.name,
    		type: "slot",
    		source: "(55:6) <Col>",
    		ctx
    	});

    	return block;
    }

    // (54:4) <Row>
    function create_default_slot_29(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_30] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_29.name,
    		type: "slot",
    		source: "(54:4) <Row>",
    		ctx
    	});

    	return block;
    }

    // (53:2) <Container>
    function create_default_slot_28(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_29] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_28.name,
    		type: "slot",
    		source: "(53:2) <Container>",
    		ctx
    	});

    	return block;
    }

    // (67:10) <CardTitle>
    function create_default_slot_27(ctx) {
    	let h5;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			h5.textContent = "Premios";
    			add_location(h5, file$1, 66, 21, 1039);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_27.name,
    		type: "slot",
    		source: "(67:10) <CardTitle>",
    		ctx
    	});

    	return block;
    }

    // (66:8) <CardHeader>
    function create_default_slot_26(ctx) {
    	let cardtitle;
    	let current;

    	cardtitle = new CardTitle({
    			props: {
    				$$slots: { default: [create_default_slot_27] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardtitle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardtitle, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardtitle_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardtitle_changes.$$scope = { dirty, ctx };
    			}

    			cardtitle.$set(cardtitle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardtitle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardtitle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardtitle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_26.name,
    		type: "slot",
    		source: "(66:8) <CardHeader>",
    		ctx
    	});

    	return block;
    }

    // (73:12) <Button color="primary">
    function create_default_slot_25(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("API");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_25.name,
    		type: "slot",
    		source: "(73:12) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (75:12) <Button color="primary">
    function create_default_slot_24(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Interfaz");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_24.name,
    		type: "slot",
    		source: "(75:12) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (79:4) <Button color="info">
    function create_default_slot_23(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Documentacion de Postman");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_23.name,
    		type: "slot",
    		source: "(79:4) <Button color=\\\"info\\\">",
    		ctx
    	});

    	return block;
    }

    // (69:8) <CardBody>
    function create_default_slot_22(ctx) {
    	let cardsubtitle;
    	let t0;
    	let a0;
    	let button0;
    	let t1;
    	let a1;
    	let button1;
    	let t2;
    	let a2;
    	let button2;
    	let current;
    	cardsubtitle = new CardSubtitle({ $$inline: true });

    	button0 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_25] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_24] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2 = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_23] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardsubtitle.$$.fragment);
    			t0 = space();
    			a0 = element("a");
    			create_component(button0.$$.fragment);
    			t1 = space();
    			a1 = element("a");
    			create_component(button1.$$.fragment);
    			t2 = space();
    			a2 = element("a");
    			create_component(button2.$$.fragment);
    			attr_dev(a0, "href", "https://sos2021-28.herokuapp.com/api/v1/awards");
    			add_location(a0, file$1, 71, 10, 1157);
    			attr_dev(a1, "href", "/#/awards");
    			add_location(a1, file$1, 73, 10, 1278);
    			attr_dev(a2, "href", "https://documenter.getpostman.com/view/14941757/TzJoE12q");
    			add_location(a2, file$1, 77, 10, 1383);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardsubtitle, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, a0, anchor);
    			mount_component(button0, a0, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, a1, anchor);
    			mount_component(button1, a1, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, a2, anchor);
    			mount_component(button2, a2, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardsubtitle.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardsubtitle.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardsubtitle, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(a0);
    			destroy_component(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(a1);
    			destroy_component(button1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(a2);
    			destroy_component(button2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_22.name,
    		type: "slot",
    		source: "(69:8) <CardBody>",
    		ctx
    	});

    	return block;
    }

    // (81:8) <CardFooter>
    function create_default_slot_21(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "José Manuel Martín de los Santos";
    			attr_dev(a, "href", "https://github.com/spartano27");
    			add_location(a, file$1, 81, 10, 1565);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_21.name,
    		type: "slot",
    		source: "(81:8) <CardFooter>",
    		ctx
    	});

    	return block;
    }

    // (65:6) <Card class="mb-3">
    function create_default_slot_20(ctx) {
    	let cardheader;
    	let t0;
    	let cardbody;
    	let t1;
    	let cardfooter;
    	let current;

    	cardheader = new CardHeader({
    			props: {
    				$$slots: { default: [create_default_slot_26] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	cardbody = new CardBody({
    			props: {
    				$$slots: { default: [create_default_slot_22] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	cardfooter = new CardFooter({
    			props: {
    				$$slots: { default: [create_default_slot_21] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardheader.$$.fragment);
    			t0 = space();
    			create_component(cardbody.$$.fragment);
    			t1 = space();
    			create_component(cardfooter.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardheader, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(cardbody, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(cardfooter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardheader_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardheader_changes.$$scope = { dirty, ctx };
    			}

    			cardheader.$set(cardheader_changes);
    			const cardbody_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardbody_changes.$$scope = { dirty, ctx };
    			}

    			cardbody.$set(cardbody_changes);
    			const cardfooter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardfooter_changes.$$scope = { dirty, ctx };
    			}

    			cardfooter.$set(cardfooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardheader.$$.fragment, local);
    			transition_in(cardbody.$$.fragment, local);
    			transition_in(cardfooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardheader.$$.fragment, local);
    			transition_out(cardbody.$$.fragment, local);
    			transition_out(cardfooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardheader, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(cardbody, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(cardfooter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20.name,
    		type: "slot",
    		source: "(65:6) <Card class=\\\"mb-3\\\">",
    		ctx
    	});

    	return block;
    }

    // (64:4) <Col xs="auto">
    function create_default_slot_19(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				class: "mb-3",
    				$$slots: { default: [create_default_slot_20] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19.name,
    		type: "slot",
    		source: "(64:4) <Col xs=\\\"auto\\\">",
    		ctx
    	});

    	return block;
    }

    // (94:10) <CardTitle>
    function create_default_slot_18(ctx) {
    	let h5;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			h5.textContent = "Plataformas";
    			add_location(h5, file$1, 93, 21, 1783);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18.name,
    		type: "slot",
    		source: "(94:10) <CardTitle>",
    		ctx
    	});

    	return block;
    }

    // (93:8) <CardHeader>
    function create_default_slot_17(ctx) {
    	let cardtitle;
    	let current;

    	cardtitle = new CardTitle({
    			props: {
    				$$slots: { default: [create_default_slot_18] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardtitle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardtitle, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardtitle_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardtitle_changes.$$scope = { dirty, ctx };
    			}

    			cardtitle.$set(cardtitle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardtitle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardtitle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardtitle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17.name,
    		type: "slot",
    		source: "(93:8) <CardHeader>",
    		ctx
    	});

    	return block;
    }

    // (100:12) <Button color="primary">
    function create_default_slot_16(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("API");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16.name,
    		type: "slot",
    		source: "(100:12) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (103:12) <Button color="primary">
    function create_default_slot_15(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Interfaz");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(103:12) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (106:12) <Button color="info">
    function create_default_slot_14(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Documentacion de Postman");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(106:12) <Button color=\\\"info\\\">",
    		ctx
    	});

    	return block;
    }

    // (96:8) <CardBody>
    function create_default_slot_13(ctx) {
    	let cardsubtitle;
    	let t0;
    	let a0;
    	let button0;
    	let t1;
    	let a1;
    	let button1;
    	let t2;
    	let a2;
    	let button2;
    	let current;
    	cardsubtitle = new CardSubtitle({ $$inline: true });

    	button0 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_16] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2 = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardsubtitle.$$.fragment);
    			t0 = space();
    			a0 = element("a");
    			create_component(button0.$$.fragment);
    			t1 = space();
    			a1 = element("a");
    			create_component(button1.$$.fragment);
    			t2 = space();
    			a2 = element("a");
    			create_component(button2.$$.fragment);
    			attr_dev(a0, "href", "https://sos2021-28.herokuapp.com/api/v1/platforms");
    			add_location(a0, file$1, 98, 10, 1904);
    			attr_dev(a1, "href", "/#/platforms");
    			add_location(a1, file$1, 101, 10, 2039);
    			attr_dev(a2, "href", "https://documenter.getpostman.com/view/14944973/TzJsexb1");
    			add_location(a2, file$1, 104, 10, 2142);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardsubtitle, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, a0, anchor);
    			mount_component(button0, a0, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, a1, anchor);
    			mount_component(button1, a1, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, a2, anchor);
    			mount_component(button2, a2, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardsubtitle.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardsubtitle.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardsubtitle, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(a0);
    			destroy_component(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(a1);
    			destroy_component(button1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(a2);
    			destroy_component(button2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(96:8) <CardBody>",
    		ctx
    	});

    	return block;
    }

    // (109:8) <CardFooter>
    function create_default_slot_12(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Marina Barragán Candel";
    			attr_dev(a, "href", "https://github.com/MarinaBC");
    			add_location(a, file$1, 109, 10, 2343);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(109:8) <CardFooter>",
    		ctx
    	});

    	return block;
    }

    // (92:6) <Card class="mb-3">
    function create_default_slot_11(ctx) {
    	let cardheader;
    	let t0;
    	let cardbody;
    	let t1;
    	let cardfooter;
    	let current;

    	cardheader = new CardHeader({
    			props: {
    				$$slots: { default: [create_default_slot_17] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	cardbody = new CardBody({
    			props: {
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	cardfooter = new CardFooter({
    			props: {
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardheader.$$.fragment);
    			t0 = space();
    			create_component(cardbody.$$.fragment);
    			t1 = space();
    			create_component(cardfooter.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardheader, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(cardbody, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(cardfooter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardheader_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardheader_changes.$$scope = { dirty, ctx };
    			}

    			cardheader.$set(cardheader_changes);
    			const cardbody_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardbody_changes.$$scope = { dirty, ctx };
    			}

    			cardbody.$set(cardbody_changes);
    			const cardfooter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardfooter_changes.$$scope = { dirty, ctx };
    			}

    			cardfooter.$set(cardfooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardheader.$$.fragment, local);
    			transition_in(cardbody.$$.fragment, local);
    			transition_in(cardfooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardheader.$$.fragment, local);
    			transition_out(cardbody.$$.fragment, local);
    			transition_out(cardfooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardheader, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(cardbody, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(cardfooter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(92:6) <Card class=\\\"mb-3\\\">",
    		ctx
    	});

    	return block;
    }

    // (91:4) <Col xs="auto">
    function create_default_slot_10(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				class: "mb-3",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(91:4) <Col xs=\\\"auto\\\">",
    		ctx
    	});

    	return block;
    }

    // (122:10) <CardTitle>
    function create_default_slot_9(ctx) {
    	let h5;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			h5.textContent = "Juegos";
    			add_location(h5, file$1, 121, 21, 2553);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(122:10) <CardTitle>",
    		ctx
    	});

    	return block;
    }

    // (121:8) <CardHeader>
    function create_default_slot_8(ctx) {
    	let cardtitle;
    	let current;

    	cardtitle = new CardTitle({
    			props: {
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardtitle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardtitle, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardtitle_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardtitle_changes.$$scope = { dirty, ctx };
    			}

    			cardtitle.$set(cardtitle_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardtitle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardtitle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardtitle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(121:8) <CardHeader>",
    		ctx
    	});

    	return block;
    }

    // (128:12) <Button color="primary">
    function create_default_slot_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("API");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(128:12) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (130:4) <Button color="primary">
    function create_default_slot_6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Interfaz");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(130:4) <Button color=\\\"primary\\\">",
    		ctx
    	});

    	return block;
    }

    // (132:4) <Button color="info">
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Documentacion de Postman");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(132:4) <Button color=\\\"info\\\">",
    		ctx
    	});

    	return block;
    }

    // (124:8) <CardBody>
    function create_default_slot_4(ctx) {
    	let cardsubtitle;
    	let t0;
    	let a0;
    	let button0;
    	let t1;
    	let a1;
    	let button1;
    	let t2;
    	let a2;
    	let button2;
    	let current;
    	cardsubtitle = new CardSubtitle({ $$inline: true });

    	button0 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				color: "primary",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2 = new Button({
    			props: {
    				color: "info",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardsubtitle.$$.fragment);
    			t0 = space();
    			a0 = element("a");
    			create_component(button0.$$.fragment);
    			t1 = space();
    			a1 = element("a");
    			create_component(button1.$$.fragment);
    			t2 = space();
    			a2 = element("a");
    			create_component(button2.$$.fragment);
    			attr_dev(a0, "href", "https://sos2021-28.herokuapp.com/api/v1/games");
    			add_location(a0, file$1, 126, 10, 2670);
    			attr_dev(a1, "href", "/#/games");
    			add_location(a1, file$1, 128, 10, 2790);
    			attr_dev(a2, "href", "https://documenter.getpostman.com/view/14967482/TzJu8cmV");
    			add_location(a2, file$1, 130, 10, 2870);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardsubtitle, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, a0, anchor);
    			mount_component(button0, a0, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, a1, anchor);
    			mount_component(button1, a1, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, a2, anchor);
    			mount_component(button2, a2, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardsubtitle.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardsubtitle.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardsubtitle, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(a0);
    			destroy_component(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(a1);
    			destroy_component(button1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(a2);
    			destroy_component(button2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(124:8) <CardBody>",
    		ctx
    	});

    	return block;
    }

    // (134:8) <CardFooter>
    function create_default_slot_3(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Fernando Olmedo Delgado";
    			attr_dev(a, "href", "https://github.com/Fernasilver");
    			add_location(a, file$1, 134, 10, 3052);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(134:8) <CardFooter>",
    		ctx
    	});

    	return block;
    }

    // (120:6) <Card class="mb-3">
    function create_default_slot_2(ctx) {
    	let cardheader;
    	let t0;
    	let cardbody;
    	let t1;
    	let cardfooter;
    	let current;

    	cardheader = new CardHeader({
    			props: {
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	cardbody = new CardBody({
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	cardfooter = new CardFooter({
    			props: {
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardheader.$$.fragment);
    			t0 = space();
    			create_component(cardbody.$$.fragment);
    			t1 = space();
    			create_component(cardfooter.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardheader, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(cardbody, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(cardfooter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardheader_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardheader_changes.$$scope = { dirty, ctx };
    			}

    			cardheader.$set(cardheader_changes);
    			const cardbody_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardbody_changes.$$scope = { dirty, ctx };
    			}

    			cardbody.$set(cardbody_changes);
    			const cardfooter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				cardfooter_changes.$$scope = { dirty, ctx };
    			}

    			cardfooter.$set(cardfooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardheader.$$.fragment, local);
    			transition_in(cardbody.$$.fragment, local);
    			transition_in(cardfooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardheader.$$.fragment, local);
    			transition_out(cardbody.$$.fragment, local);
    			transition_out(cardfooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardheader, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(cardbody, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(cardfooter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(120:6) <Card class=\\\"mb-3\\\">",
    		ctx
    	});

    	return block;
    }

    // (119:4) <Col xs="auto">
    function create_default_slot_1(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				class: "mb-3",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const card_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(119:4) <Col xs=\\\"auto\\\">",
    		ctx
    	});

    	return block;
    }

    // (63:2) <Container>
    function create_default_slot(ctx) {
    	let col0;
    	let t0;
    	let col1;
    	let t1;
    	let col2;
    	let current;

    	col0 = new Col({
    			props: {
    				xs: "auto",
    				$$slots: { default: [create_default_slot_19] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col1 = new Col({
    			props: {
    				xs: "auto",
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col2 = new Col({
    			props: {
    				xs: "auto",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t0 = space();
    			create_component(col1.$$.fragment);
    			t1 = space();
    			create_component(col2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(col1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(col2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    			const col2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col2_changes.$$scope = { dirty, ctx };
    			}

    			col2.$set(col2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			transition_in(col2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			transition_out(col2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(col1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(col2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(63:2) <Container>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let nav;
    	let t0;
    	let h1;
    	let t2;
    	let h20;
    	let t4;
    	let container0;
    	let t5;
    	let p0;
    	let t6;
    	let container1;
    	let t7;
    	let p1;
    	let t8;
    	let h21;
    	let t10;
    	let container2;
    	let current;

    	nav = new Nav({
    			props: {
    				$$slots: { default: [create_default_slot_36] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	container0 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot_32] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	container1 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot_28] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	container2 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(nav.$$.fragment);
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "SOS2021-28";
    			t2 = space();
    			h20 = element("h2");
    			h20.textContent = "Equipo";
    			t4 = space();
    			create_component(container0.$$.fragment);
    			t5 = space();
    			p0 = element("p");
    			t6 = space();
    			create_component(container1.$$.fragment);
    			t7 = space();
    			p1 = element("p");
    			t8 = space();
    			h21 = element("h2");
    			h21.textContent = "APIs";
    			t10 = space();
    			create_component(container2.$$.fragment);
    			attr_dev(h1, "class", "svelte-1cp0utu");
    			add_location(h1, file$1, 33, 2, 351);
    			add_location(h20, file$1, 35, 2, 374);
    			add_location(p0, file$1, 51, 2, 722);
    			add_location(p1, file$1, 60, 2, 915);
    			add_location(h21, file$1, 61, 2, 923);
    			attr_dev(main, "class", "svelte-1cp0utu");
    			add_location(main, file$1, 23, 0, 251);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(nav, main, null);
    			append_dev(main, t0);
    			append_dev(main, h1);
    			append_dev(main, t2);
    			append_dev(main, h20);
    			append_dev(main, t4);
    			mount_component(container0, main, null);
    			append_dev(main, t5);
    			append_dev(main, p0);
    			append_dev(main, t6);
    			mount_component(container1, main, null);
    			append_dev(main, t7);
    			append_dev(main, p1);
    			append_dev(main, t8);
    			append_dev(main, h21);
    			append_dev(main, t10);
    			mount_component(container2, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const nav_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				nav_changes.$$scope = { dirty, ctx };
    			}

    			nav.$set(nav_changes);
    			const container0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container0_changes.$$scope = { dirty, ctx };
    			}

    			container0.$set(container0_changes);
    			const container1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container1_changes.$$scope = { dirty, ctx };
    			}

    			container1.$set(container1_changes);
    			const container2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container2_changes.$$scope = { dirty, ctx };
    			}

    			container2.$set(container2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(container0.$$.fragment, local);
    			transition_in(container1.$$.fragment, local);
    			transition_in(container2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(container0.$$.fragment, local);
    			transition_out(container1.$$.fragment, local);
    			transition_out(container2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(nav);
    			destroy_component(container0);
    			destroy_component(container1);
    			destroy_component(container2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Info", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Info> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Button,
    		Icon,
    		Card,
    		CardBody,
    		CardFooter,
    		CardHeader,
    		CardSubtitle,
    		CardText,
    		CardTitle,
    		Col,
    		Container,
    		Nav,
    		NavItem,
    		NavLink,
    		Row
    	});

    	return [];
    }

    class Info extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Info",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.37.0 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let router;
    	let current;

    	router = new Router({
    			props: { routes: /*routes*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(router.$$.fragment);
    			attr_dev(main, "class", "svelte-1tky8bj");
    			add_location(main, file, 38, 0, 935);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(router, main, null);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);

    	const routes = {
    		"/": Home,
    		"/info": Info,
    		"/awards": TableAwards,
    		"/awards/:country/:year": TableAwardsEdit,
    		"/platforms": PlatformsAPI,
    		"/platforms/:country/:year": EditPlatforms,
    		"/games": GamesAPI,
    		"/games/:country/:year": EditGames,
    		"*": NotFound
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router,
    		Awards: TableAwards,
    		AwardsPUT: TableAwardsEdit,
    		PlatformsAPI,
    		EditPlatformsAPI: EditPlatforms,
    		GamesAPI,
    		EditGames,
    		Home,
    		NotFound,
    		Info,
    		routes
    	});

    	return [routes];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
