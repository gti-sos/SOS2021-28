
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
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
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
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
            update: noop,
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
            this.$destroy = noop;
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

    /* node_modules\sveltestrap\src\Table.svelte generated by Svelte v3.37.0 */
    const file$4 = "node_modules\\sveltestrap\\src\\Table.svelte";

    // (35:0) {:else}
    function create_else_block(ctx) {
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
    			add_location(table, file$4, 35, 2, 861);
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
    		id: create_else_block.name,
    		type: "else",
    		source: "(35:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (29:0) {#if responsive}
    function create_if_block(ctx) {
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
    			add_location(table, file$4, 30, 4, 773);
    			attr_dev(div, "class", /*responsiveClassName*/ ctx[2]);
    			add_location(div, file$4, 29, 2, 735);
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
    		id: create_if_block.name,
    		type: "if",
    		source: "(29:0) {#if responsive}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
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
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
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
    			id: create_fragment$4.name
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

    /* src\TableGames.svelte generated by Svelte v3.37.0 */

    const { console: console_1$2 } = globals;
    const file$3 = "src\\TableGames.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (50:12) {#each games as data}
    function create_each_block$2(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*data*/ ctx[2].country + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*data*/ ctx[2].game + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*data*/ ctx[2].year + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*data*/ ctx[2]["sold-unit"] + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*data*/ ctx[2].company + "";
    	let t8;
    	let t9;

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
    			add_location(td0, file$3, 51, 20, 1187);
    			add_location(td1, file$3, 52, 20, 1232);
    			add_location(td2, file$3, 53, 20, 1274);
    			add_location(td3, file$3, 54, 20, 1316);
    			add_location(td4, file$3, 55, 20, 1366);
    			add_location(tr, file$3, 50, 16, 1161);
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
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*games*/ 1 && t0_value !== (t0_value = /*data*/ ctx[2].country + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*games*/ 1 && t2_value !== (t2_value = /*data*/ ctx[2].game + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*games*/ 1 && t4_value !== (t4_value = /*data*/ ctx[2].year + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*games*/ 1 && t6_value !== (t6_value = /*data*/ ctx[2]["sold-unit"] + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*games*/ 1 && t8_value !== (t8_value = /*data*/ ctx[2].company + "")) set_data_dev(t8, t8_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(50:12) {#each games as data}",
    		ctx
    	});

    	return block;
    }

    // (38:4) <Table bordered>
    function create_default_slot$2(ctx) {
    	let thead;
    	let tr;
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
    	let tbody;
    	let each_value = /*games*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr = element("tr");
    			td0 = element("td");
    			td0.textContent = "country";
    			t1 = space();
    			td1 = element("td");
    			td1.textContent = "game";
    			t3 = space();
    			td2 = element("td");
    			td2.textContent = "year";
    			t5 = space();
    			td3 = element("td");
    			td3.textContent = "sold-unit";
    			t7 = space();
    			td4 = element("td");
    			td4.textContent = "company";
    			t9 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(td0, file$3, 40, 16, 888);
    			add_location(td1, file$3, 41, 16, 922);
    			add_location(td2, file$3, 42, 16, 953);
    			add_location(td3, file$3, 43, 16, 984);
    			add_location(td4, file$3, 44, 16, 1020);
    			add_location(tr, file$3, 39, 12, 866);
    			add_location(thead, file$3, 38, 8, 845);
    			add_location(tbody, file$3, 48, 8, 1101);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr);
    			append_dev(tr, td0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*games*/ 1) {
    				each_value = /*games*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(38:4) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let main;
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(table.$$.fragment);
    			add_location(main, file$3, 29, 0, 702);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(table, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const table_changes = {};

    			if (dirty & /*$$scope, games*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(table);
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
    	validate_slots("TableGames", slots, []);
    	let games = [];

    	async function getGames() {
    		console.log("Fetching games ...");
    		const res = await fetch("/api/v1/games/");

    		if (res.ok) {
    			console.log("Ok.");
    			const json = await res.json();
    			$$invalidate(0, games = json);
    			console.log(`We have received ${games.length} games.`);
    		} else {
    			console.log("Error!");
    		}
    	} /*
    console.log(`Before getGames.`);
    getGames();
    console.log(`After getGames.`);
    */

    	onMount(getGames);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<TableGames> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ onMount, Table, games, getGames });

    	$$self.$inject_state = $$props => {
    		if ("games" in $$props) $$invalidate(0, games = $$props.games);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [games];
    }

    class TableGames extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableGames",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\TablePlatforms.svelte generated by Svelte v3.37.0 */

    const { console: console_1$1 } = globals;
    const file$2 = "src\\TablePlatforms.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (50:12) {#each platforms as data}
    function create_each_block$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*data*/ ctx[2].country + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*data*/ ctx[2].platform + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*data*/ ctx[2].year + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*data*/ ctx[2]["sold-unit"] + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*data*/ ctx[2].generation + "";
    	let t8;
    	let t9;

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
    			add_location(td0, file$2, 51, 20, 1242);
    			add_location(td1, file$2, 52, 20, 1287);
    			add_location(td2, file$2, 53, 20, 1333);
    			add_location(td3, file$2, 54, 20, 1375);
    			add_location(td4, file$2, 55, 20, 1425);
    			add_location(tr, file$2, 50, 16, 1216);
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
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*platforms*/ 1 && t0_value !== (t0_value = /*data*/ ctx[2].country + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*platforms*/ 1 && t2_value !== (t2_value = /*data*/ ctx[2].platform + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*platforms*/ 1 && t4_value !== (t4_value = /*data*/ ctx[2].year + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*platforms*/ 1 && t6_value !== (t6_value = /*data*/ ctx[2]["sold-unit"] + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*platforms*/ 1 && t8_value !== (t8_value = /*data*/ ctx[2].generation + "")) set_data_dev(t8, t8_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(50:12) {#each platforms as data}",
    		ctx
    	});

    	return block;
    }

    // (38:4) <Table bordered>
    function create_default_slot$1(ctx) {
    	let thead;
    	let tr;
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
    	let tbody;
    	let each_value = /*platforms*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr = element("tr");
    			td0 = element("td");
    			td0.textContent = "country";
    			t1 = space();
    			td1 = element("td");
    			td1.textContent = "platform";
    			t3 = space();
    			td2 = element("td");
    			td2.textContent = "year";
    			t5 = space();
    			td3 = element("td");
    			td3.textContent = "sold-unit";
    			t7 = space();
    			td4 = element("td");
    			td4.textContent = "generation";
    			t9 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(td0, file$2, 40, 16, 932);
    			add_location(td1, file$2, 41, 16, 966);
    			add_location(td2, file$2, 42, 16, 1001);
    			add_location(td3, file$2, 43, 16, 1032);
    			add_location(td4, file$2, 44, 16, 1068);
    			add_location(tr, file$2, 39, 12, 910);
    			add_location(thead, file$2, 38, 8, 889);
    			add_location(tbody, file$2, 48, 8, 1152);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr);
    			append_dev(tr, td0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*platforms*/ 1) {
    				each_value = /*platforms*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(38:4) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let main;
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(table.$$.fragment);
    			add_location(main, file$2, 29, 0, 746);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(table, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const table_changes = {};

    			if (dirty & /*$$scope, platforms*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(table);
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
    	validate_slots("TablePlatforms", slots, []);
    	let platforms = [];

    	async function getPlatforms() {
    		console.log("Fetching platforms ...");
    		const res = await fetch("/api/v1/platforms/");

    		if (res.ok) {
    			console.log("Ok.");
    			const json = await res.json();
    			$$invalidate(0, platforms = json);
    			console.log(`We have received ${platforms.length} platforms.`);
    		} else {
    			console.log("Error!");
    		}
    	} /*
    console.log(`Before getPlatforms.`);
    getPlatforms();
    console.log(`After getPlatforms.`);
    */

    	onMount(getPlatforms);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<TablePlatforms> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ onMount, Table, platforms, getPlatforms });

    	$$self.$inject_state = $$props => {
    		if ("platforms" in $$props) $$invalidate(0, platforms = $$props.platforms);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [platforms];
    }

    class TablePlatforms extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TablePlatforms",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\TableAwards.svelte generated by Svelte v3.37.0 */

    const { console: console_1 } = globals;
    const file$1 = "src\\TableAwards.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (39:12) {#each awards as data}
    function create_each_block(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*data*/ ctx[2].country + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*data*/ ctx[2].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*data*/ ctx[2].gala + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*data*/ ctx[2].winner + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*data*/ ctx[2]["n-platform"] + "";
    	let t8;
    	let t9;
    	let td5;
    	let t10_value = /*data*/ ctx[2]["n-award"] + "";
    	let t10;
    	let t11;

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
    			t10 = text(t10_value);
    			t11 = space();
    			add_location(td0, file$1, 40, 20, 1023);
    			add_location(td1, file$1, 41, 20, 1068);
    			add_location(td2, file$1, 42, 20, 1110);
    			add_location(td3, file$1, 43, 20, 1152);
    			add_location(td4, file$1, 44, 20, 1196);
    			add_location(td5, file$1, 45, 20, 1247);
    			add_location(tr, file$1, 39, 16, 997);
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
    			append_dev(td5, t10);
    			append_dev(tr, t11);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*awards*/ 1 && t0_value !== (t0_value = /*data*/ ctx[2].country + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*awards*/ 1 && t2_value !== (t2_value = /*data*/ ctx[2].year + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*awards*/ 1 && t4_value !== (t4_value = /*data*/ ctx[2].gala + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*awards*/ 1 && t6_value !== (t6_value = /*data*/ ctx[2].winner + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*awards*/ 1 && t8_value !== (t8_value = /*data*/ ctx[2]["n-platform"] + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*awards*/ 1 && t10_value !== (t10_value = /*data*/ ctx[2]["n-award"] + "")) set_data_dev(t10, t10_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(39:12) {#each awards as data}",
    		ctx
    	});

    	return block;
    }

    // (26:4) <Table bordered>
    function create_default_slot(ctx) {
    	let thead;
    	let tr;
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
    	let each_value = /*awards*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr = element("tr");
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

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(td0, file$1, 28, 16, 663);
    			add_location(td1, file$1, 29, 16, 694);
    			add_location(td2, file$1, 30, 16, 724);
    			add_location(td3, file$1, 31, 16, 755);
    			add_location(td4, file$1, 32, 16, 789);
    			add_location(td5, file$1, 33, 16, 837);
    			add_location(tr, file$1, 27, 12, 641);
    			add_location(thead, file$1, 26, 8, 620);
    			add_location(tbody, file$1, 37, 8, 936);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr);
    			append_dev(tr, td0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*awards*/ 1) {
    				each_value = /*awards*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(26:4) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(table.$$.fragment);
    			add_location(main, file$1, 24, 0, 582);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(table, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const table_changes = {};

    			if (dirty & /*$$scope, awards*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(table);
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
    	validate_slots("TableAwards", slots, []);
    	let awards = [];

    	async function getAwards() {
    		console.log("Fetching awards ...");
    		const res = await fetch("/api/v1/awards/");

    		if (res.ok) {
    			console.log("Ok.");
    			const json = await res.json();
    			$$invalidate(0, awards = json);
    			console.log(`We have received ${awards.length} awards.`);
    		} else {
    			console.log("Error!");
    		}
    	}

    	onMount(getAwards);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<TableAwards> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ onMount, Table, awards, getAwards });

    	$$self.$inject_state = $$props => {
    		if ("awards" in $$props) $$invalidate(0, awards = $$props.awards);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [awards];
    }

    class TableAwards extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableAwards",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.37.0 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let h10;
    	let t1;
    	let head;
    	let meta0;
    	let t2;
    	let meta1;
    	let t3;
    	let meta2;
    	let t4;
    	let title;
    	let t6;
    	let body;
    	let ul3;
    	let li3;
    	let b0;
    	let t8;
    	let ul0;
    	let li0;
    	let a0;
    	let t10;
    	let li1;
    	let a1;
    	let t12;
    	let li2;
    	let a2;
    	let t14;
    	let li4;
    	let b1;
    	let t16;
    	let t17;
    	let li5;
    	let b2;
    	let t19;
    	let a3;
    	let t21;
    	let li6;
    	let b3;
    	let t23;
    	let a4;
    	let t25;
    	let li13;
    	let b4;
    	let t27;
    	let ul1;
    	let li7;
    	let a5;
    	let t29;
    	let a6;
    	let t31;
    	let t32;
    	let li8;
    	let a7;
    	let t34;
    	let a8;
    	let t36;
    	let t37;
    	let li9;
    	let a9;
    	let t39;
    	let a10;
    	let t41;
    	let t42;
    	let b5;
    	let t44;
    	let ul2;
    	let li10;
    	let a11;
    	let t46;
    	let a12;
    	let t48;
    	let t49;
    	let li11;
    	let a13;
    	let t51;
    	let a14;
    	let t53;
    	let t54;
    	let li12;
    	let a15;
    	let t56;
    	let a16;
    	let t58;
    	let t59;
    	let h11;
    	let t61;
    	let input0;
    	let t62;
    	let input1;
    	let t63;
    	let div0;
    	let tablegames;
    	let t64;
    	let h12;
    	let t65;
    	let br;
    	let t66;
    	let input2;
    	let t67;
    	let input3;
    	let t68;
    	let div1;
    	let tableplatforms;
    	let t69;
    	let h13;
    	let t70;
    	let input4;
    	let t71;
    	let input5;
    	let t72;
    	let div2;
    	let tableawards;
    	let current;
    	tablegames = new TableGames({ $$inline: true });
    	tableplatforms = new TablePlatforms({ $$inline: true });
    	tableawards = new TableAwards({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			h10 = element("h1");
    			h10.textContent = "SOS2021-28";
    			t1 = space();
    			head = element("head");
    			meta0 = element("meta");
    			t2 = space();
    			meta1 = element("meta");
    			t3 = space();
    			meta2 = element("meta");
    			t4 = space();
    			title = element("title");
    			title.textContent = "SOS2021-28";
    			t6 = space();
    			body = element("body");
    			ul3 = element("ul");
    			li3 = element("li");
    			b0 = element("b");
    			b0.textContent = "Team";
    			t8 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "José Manuel Martín de los Santos";
    			t10 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Marina Barragán Candel";
    			t12 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Fernando Olmedo Delgado";
    			t14 = space();
    			li4 = element("li");
    			b1 = element("b");
    			b1.textContent = "Project description:";
    			t16 = text(" Investigación y Analisis de las ventas de videojuegos y su relacion con la cantidad de consolas vendidas y los premios que haya obtenido dicho videojuego.");
    			t17 = space();
    			li5 = element("li");
    			b2 = element("b");
    			b2.textContent = "Repository:";
    			t19 = space();
    			a3 = element("a");
    			a3.textContent = "http://github.com/gti-sos/SOS2021-28";
    			t21 = space();
    			li6 = element("li");
    			b3 = element("b");
    			b3.textContent = "URL";
    			t23 = text(": ");
    			a4 = element("a");
    			a4.textContent = "http://sos2021-28.herokuapp.com";
    			t25 = space();
    			li13 = element("li");
    			b4 = element("b");
    			b4.textContent = "APIs:";
    			t27 = space();
    			ul1 = element("ul");
    			li7 = element("li");
    			a5 = element("a");
    			a5.textContent = "https://sos2021-28.herokuapp.com/api/v1/awards";
    			t29 = text(" \r\n                    (developed by ");
    			a6 = element("a");
    			a6.textContent = "José Manuel Martín de los Santos";
    			t31 = text(")");
    			t32 = space();
    			li8 = element("li");
    			a7 = element("a");
    			a7.textContent = "https://sos2021-28.herokuapp.com/api/v1/platforms";
    			t34 = text(" \r\n                    (developed by ");
    			a8 = element("a");
    			a8.textContent = "Marina Barragán Candel";
    			t36 = text(")");
    			t37 = space();
    			li9 = element("li");
    			a9 = element("a");
    			a9.textContent = "https://sos2021-28.herokuapp.com/api/v1/games";
    			t39 = text(" \r\n                    (developed by ");
    			a10 = element("a");
    			a10.textContent = "Fernando Olmedo Delgado";
    			t41 = text(")");
    			t42 = space();
    			b5 = element("b");
    			b5.textContent = "Postman documentation:";
    			t44 = space();
    			ul2 = element("ul");
    			li10 = element("li");
    			a11 = element("a");
    			a11.textContent = "postman sobre awards";
    			t46 = text(" \r\n                    (developed by ");
    			a12 = element("a");
    			a12.textContent = "José Manuel Martín de los Santos";
    			t48 = text(")");
    			t49 = space();
    			li11 = element("li");
    			a13 = element("a");
    			a13.textContent = "postman sobre platforms";
    			t51 = text(" \r\n                    (developed by ");
    			a14 = element("a");
    			a14.textContent = "Marina Barragán Candel";
    			t53 = text(")");
    			t54 = space();
    			li12 = element("li");
    			a15 = element("a");
    			a15.textContent = "postman sobre games";
    			t56 = text(" \r\n                    (developed by ");
    			a16 = element("a");
    			a16.textContent = "Fernando Olmedo Delgado";
    			t58 = text(")");
    			t59 = space();
    			h11 = element("h1");
    			h11.textContent = "Front-end";
    			t61 = space();
    			input0 = element("input");
    			t62 = space();
    			input1 = element("input");
    			t63 = space();
    			div0 = element("div");
    			create_component(tablegames.$$.fragment);
    			t64 = space();
    			h12 = element("h1");
    			t65 = space();
    			br = element("br");
    			t66 = space();
    			input2 = element("input");
    			t67 = space();
    			input3 = element("input");
    			t68 = space();
    			div1 = element("div");
    			create_component(tableplatforms.$$.fragment);
    			t69 = space();
    			h13 = element("h1");
    			t70 = space();
    			input4 = element("input");
    			t71 = space();
    			input5 = element("input");
    			t72 = space();
    			div2 = element("div");
    			create_component(tableawards.$$.fragment);
    			attr_dev(h10, "class", "svelte-1tky8bj");
    			add_location(h10, file, 9, 1, 210);
    			attr_dev(meta0, "charset", "UTF-8");
    			add_location(meta0, file, 21, 4, 434);
    			attr_dev(meta1, "http-equiv", "X-UA-Compatible");
    			attr_dev(meta1, "content", "IE=edge");
    			add_location(meta1, file, 22, 4, 462);
    			attr_dev(meta2, "name", "viewport");
    			attr_dev(meta2, "content", "width=device-width, initial-scale=1.0");
    			add_location(meta2, file, 23, 4, 521);
    			add_location(title, file, 24, 4, 597);
    			add_location(head, file, 20, 0, 422);
    			add_location(b0, file, 30, 12, 683);
    			attr_dev(a0, "href", "https://github.com/spartano27");
    			add_location(a0, file, 32, 20, 734);
    			add_location(li0, file, 32, 16, 730);
    			attr_dev(a1, "href", "https://github.com/MarinaBC");
    			add_location(a1, file, 33, 20, 837);
    			add_location(li1, file, 33, 16, 833);
    			attr_dev(a2, "href", "https://github.com/Fernasilver");
    			add_location(a2, file, 34, 20, 928);
    			add_location(li2, file, 34, 16, 924);
    			add_location(ul0, file, 31, 12, 708);
    			add_location(li3, file, 29, 8, 665);
    			add_location(b1, file, 38, 12, 1063);
    			add_location(li4, file, 37, 8, 1045);
    			add_location(b2, file, 41, 12, 1289);
    			attr_dev(a3, "href", "https://github.com/gti-sos/SOS2021-28");
    			add_location(a3, file, 41, 31, 1308);
    			add_location(li5, file, 40, 8, 1271);
    			add_location(b3, file, 44, 12, 1439);
    			attr_dev(a4, "href", "http://sos2021-28.herokuapp.com");
    			add_location(a4, file, 44, 24, 1451);
    			add_location(li6, file, 43, 8, 1421);
    			add_location(b4, file, 47, 12, 1571);
    			attr_dev(a5, "href", "https://sos2021-28.herokuapp.com/api/v1/awards");
    			add_location(a5, file, 50, 20, 1645);
    			attr_dev(a6, "href", "https://github.com/spartano27");
    			add_location(a6, file, 51, 34, 1789);
    			add_location(li7, file, 49, 16, 1619);
    			attr_dev(a7, "href", "https://sos2021-28.herokuapp.com/api/v1/platforms");
    			add_location(a7, file, 54, 20, 1933);
    			attr_dev(a8, "href", "https://github.com/MarinaBC");
    			add_location(a8, file, 55, 34, 2083);
    			add_location(li8, file, 53, 16, 1907);
    			attr_dev(a9, "href", "https://sos2021-28.herokuapp.com/api/v1/games");
    			add_location(a9, file, 58, 20, 2215);
    			attr_dev(a10, "href", "https://github.com/Fernasilver");
    			add_location(a10, file, 59, 34, 2357);
    			add_location(li9, file, 57, 16, 2189);
    			add_location(ul1, file, 48, 12, 1597);
    			add_location(b5, file, 62, 12, 2482);
    			attr_dev(a11, "href", "https://documenter.getpostman.com/view/14941757/TzJoE12q");
    			add_location(a11, file, 65, 20, 2573);
    			attr_dev(a12, "href", "https://github.com/spartano27");
    			add_location(a12, file, 66, 34, 2701);
    			add_location(li10, file, 64, 16, 2547);
    			attr_dev(a13, "href", "https://documenter.getpostman.com/view/14944973/TzJsexb1");
    			add_location(a13, file, 71, 20, 2865);
    			attr_dev(a14, "href", "https://github.com/MarinaBC");
    			add_location(a14, file, 72, 34, 2996);
    			add_location(li11, file, 70, 16, 2839);
    			attr_dev(a15, "href", "https://documenter.getpostman.com/view/14967482/TzJu8cmV");
    			add_location(a15, file, 77, 20, 3124);
    			attr_dev(a16, "href", "https://github.com/Fernasilver");
    			add_location(a16, file, 78, 34, 3251);
    			add_location(li12, file, 76, 4, 3098);
    			add_location(ul2, file, 63, 12, 2525);
    			add_location(li13, file, 46, 8, 1553);
    			add_location(ul3, file, 28, 4, 651);
    			add_location(body, file, 26, 0, 633);
    			attr_dev(h11, "class", "svelte-1tky8bj");
    			add_location(h11, file, 91, 1, 3415);
    			attr_dev(input0, "type", "button");
    			input0.value = "Games";
    			attr_dev(input0, "onclick", "document.getElementById('oculto').style.visibility='visible'");
    			add_location(input0, file, 99, 1, 3457);
    			attr_dev(input1, "type", "button");
    			input1.value = "Ocultar";
    			attr_dev(input1, "onclick", "document.getElementById('oculto').style.visibility='hidden'");
    			add_location(input1, file, 100, 1, 3566);
    			attr_dev(div0, "id", "oculto");
    			set_style(div0, "visibility", "hidden");
    			add_location(div0, file, 102, 1, 3679);
    			attr_dev(h12, "class", "svelte-1tky8bj");
    			add_location(h12, file, 107, 1, 3757);
    			add_location(br, file, 108, 1, 3769);
    			attr_dev(input2, "type", "button");
    			input2.value = "Platforms";
    			attr_dev(input2, "onclick", "document.getElementById('noculto').style.visibility='visible'");
    			add_location(input2, file, 109, 1, 3776);
    			attr_dev(input3, "type", "button");
    			input3.value = "Ocultar";
    			attr_dev(input3, "onclick", "document.getElementById('noculto').style.visibility='hidden'");
    			add_location(input3, file, 110, 1, 3890);
    			attr_dev(div1, "id", "noculto");
    			set_style(div1, "visibility", "hidden");
    			add_location(div1, file, 112, 1, 4004);
    			attr_dev(h13, "class", "svelte-1tky8bj");
    			add_location(h13, file, 115, 4, 4084);
    			attr_dev(input4, "type", "button");
    			input4.value = "Awards";
    			attr_dev(input4, "onclick", "document.getElementById('ocultoAwards').style.visibility='visible'");
    			add_location(input4, file, 117, 4, 4101);
    			attr_dev(input5, "type", "button");
    			input5.value = "Ocultar";
    			attr_dev(input5, "onclick", "document.getElementById('ocultoAwards').style.visibility='hidden'");
    			add_location(input5, file, 118, 1, 4217);
    			attr_dev(div2, "id", "ocultoAwards");
    			set_style(div2, "visibility", "hidden");
    			add_location(div2, file, 120, 1, 4336);
    			attr_dev(main, "class", "svelte-1tky8bj");
    			add_location(main, file, 8, 0, 201);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h10);
    			append_dev(main, t1);
    			append_dev(main, head);
    			append_dev(head, meta0);
    			append_dev(head, t2);
    			append_dev(head, meta1);
    			append_dev(head, t3);
    			append_dev(head, meta2);
    			append_dev(head, t4);
    			append_dev(head, title);
    			append_dev(main, t6);
    			append_dev(main, body);
    			append_dev(body, ul3);
    			append_dev(ul3, li3);
    			append_dev(li3, b0);
    			append_dev(li3, t8);
    			append_dev(li3, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, a0);
    			append_dev(ul0, t10);
    			append_dev(ul0, li1);
    			append_dev(li1, a1);
    			append_dev(ul0, t12);
    			append_dev(ul0, li2);
    			append_dev(li2, a2);
    			append_dev(ul3, t14);
    			append_dev(ul3, li4);
    			append_dev(li4, b1);
    			append_dev(li4, t16);
    			append_dev(ul3, t17);
    			append_dev(ul3, li5);
    			append_dev(li5, b2);
    			append_dev(li5, t19);
    			append_dev(li5, a3);
    			append_dev(ul3, t21);
    			append_dev(ul3, li6);
    			append_dev(li6, b3);
    			append_dev(li6, t23);
    			append_dev(li6, a4);
    			append_dev(ul3, t25);
    			append_dev(ul3, li13);
    			append_dev(li13, b4);
    			append_dev(li13, t27);
    			append_dev(li13, ul1);
    			append_dev(ul1, li7);
    			append_dev(li7, a5);
    			append_dev(li7, t29);
    			append_dev(li7, a6);
    			append_dev(li7, t31);
    			append_dev(ul1, t32);
    			append_dev(ul1, li8);
    			append_dev(li8, a7);
    			append_dev(li8, t34);
    			append_dev(li8, a8);
    			append_dev(li8, t36);
    			append_dev(ul1, t37);
    			append_dev(ul1, li9);
    			append_dev(li9, a9);
    			append_dev(li9, t39);
    			append_dev(li9, a10);
    			append_dev(li9, t41);
    			append_dev(li13, t42);
    			append_dev(li13, b5);
    			append_dev(li13, t44);
    			append_dev(li13, ul2);
    			append_dev(ul2, li10);
    			append_dev(li10, a11);
    			append_dev(li10, t46);
    			append_dev(li10, a12);
    			append_dev(li10, t48);
    			append_dev(ul2, t49);
    			append_dev(ul2, li11);
    			append_dev(li11, a13);
    			append_dev(li11, t51);
    			append_dev(li11, a14);
    			append_dev(li11, t53);
    			append_dev(ul2, t54);
    			append_dev(ul2, li12);
    			append_dev(li12, a15);
    			append_dev(li12, t56);
    			append_dev(li12, a16);
    			append_dev(li12, t58);
    			append_dev(main, t59);
    			append_dev(main, h11);
    			append_dev(main, t61);
    			append_dev(main, input0);
    			append_dev(main, t62);
    			append_dev(main, input1);
    			append_dev(main, t63);
    			append_dev(main, div0);
    			mount_component(tablegames, div0, null);
    			append_dev(main, t64);
    			append_dev(main, h12);
    			append_dev(main, t65);
    			append_dev(main, br);
    			append_dev(main, t66);
    			append_dev(main, input2);
    			append_dev(main, t67);
    			append_dev(main, input3);
    			append_dev(main, t68);
    			append_dev(main, div1);
    			mount_component(tableplatforms, div1, null);
    			append_dev(main, t69);
    			append_dev(main, h13);
    			append_dev(main, t70);
    			append_dev(main, input4);
    			append_dev(main, t71);
    			append_dev(main, input5);
    			append_dev(main, t72);
    			append_dev(main, div2);
    			mount_component(tableawards, div2, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tablegames.$$.fragment, local);
    			transition_in(tableplatforms.$$.fragment, local);
    			transition_in(tableawards.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tablegames.$$.fragment, local);
    			transition_out(tableplatforms.$$.fragment, local);
    			transition_out(tableawards.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(tablegames);
    			destroy_component(tableplatforms);
    			destroy_component(tableawards);
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
    	let { name } = $$props;
    	const writable_props = ["name"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({
    		TableGames,
    		TablePlatforms,
    		TableAwards,
    		name
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !("name" in props)) {
    			console.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
