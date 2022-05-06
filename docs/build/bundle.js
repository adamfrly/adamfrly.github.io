
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
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
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
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
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
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
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
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
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
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
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
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
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
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
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
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
        seen_callbacks.clear();
        set_current_component(saved_component);
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

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

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
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
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
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.3' }, detail), true));
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

    function styleInject(css, ref) {
      if ( ref === void 0 ) ref = {};
      var insertAt = ref.insertAt;

      if (!css || typeof document === 'undefined') { return; }

      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';

      if (insertAt === 'top') {
        if (head.firstChild) {
          head.insertBefore(style, head.firstChild);
        } else {
          head.appendChild(style);
        }
      } else {
        head.appendChild(style);
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
    }

    var css_248z$1 = "";
    styleInject(css_248z$1);

    /* src\Gallery.svelte generated by Svelte v3.46.3 */
    const file$6 = "src\\Gallery.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	return child_ctx;
    }

    // (56:0) {#if columns}
    function create_if_block$1(ctx) {
    	let div;
    	let div_resize_listener;
    	let each_value = /*columns*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "id", "gallery");
    			attr_dev(div, "style", /*galleryStyle*/ ctx[5]);
    			attr_dev(div, "class", "svelte-1aiohow");
    			add_render_callback(() => /*div_elementresize_handler*/ ctx[14].call(div));
    			add_location(div, file$6, 56, 4, 1549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[14].bind(div));
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*columns, hover, loading, HandleClick*/ 83) {
    				each_value = /*columns*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*galleryStyle*/ 32) {
    				attr_dev(div, "style", /*galleryStyle*/ ctx[5]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			div_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(56:0) {#if columns}",
    		ctx
    	});

    	return block;
    }

    // (60:16) {#each column as img}
    function create_each_block_1(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let img_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*img*/ ctx[19].src)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*img*/ ctx[19].alt);
    			attr_dev(img, "class", img_class_value = "" + ((/*hover*/ ctx[0] === true ? "img-hover" : "") + " " + /*img*/ ctx[19].class + " svelte-1aiohow"));
    			attr_dev(img, "loading", /*loading*/ ctx[1]);
    			add_location(img, file$6, 60, 20, 1750);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*HandleClick*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*columns*/ 16 && !src_url_equal(img.src, img_src_value = /*img*/ ctx[19].src)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*columns*/ 16 && img_alt_value !== (img_alt_value = /*img*/ ctx[19].alt)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*hover, columns*/ 17 && img_class_value !== (img_class_value = "" + ((/*hover*/ ctx[0] === true ? "img-hover" : "") + " " + /*img*/ ctx[19].class + " svelte-1aiohow"))) {
    				attr_dev(img, "class", img_class_value);
    			}

    			if (dirty & /*loading*/ 2) {
    				attr_dev(img, "loading", /*loading*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(60:16) {#each column as img}",
    		ctx
    	});

    	return block;
    }

    // (58:8) {#each columns as column}
    function create_each_block$1(ctx) {
    	let div;
    	let t;
    	let each_value_1 = /*column*/ ctx[16];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr_dev(div, "class", "column svelte-1aiohow");
    			add_location(div, file$6, 58, 12, 1669);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*columns, hover, loading, HandleClick*/ 83) {
    				each_value_1 = /*column*/ ctx[16];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(58:8) {#each columns as column}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div;
    	let t;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let if_block = /*columns*/ ctx[4] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div, "id", "slotHolder");
    			attr_dev(div, "class", "svelte-1aiohow");
    			add_location(div, file$6, 46, 0, 1387);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[13](div);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "DOMNodeInserted", /*Draw*/ ctx[7], false, false, false),
    					listen_dev(div, "DOMNodeRemoved", /*Draw*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*columns*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
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
    			/*div_binding*/ ctx[13](null);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
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

    function instance$7($$self, $$props, $$invalidate) {
    	let galleryStyle;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Gallery', slots, ['default']);
    	let { gap = 10 } = $$props;
    	let { maxColumnWidth = 250 } = $$props;
    	let { hover = false } = $$props;
    	let { loading } = $$props;
    	const dispatch = createEventDispatcher();
    	let slotHolder = null;
    	let columns = [];
    	let galleryWidth = 0;
    	let columnCount = 0;
    	onMount(Draw);

    	function HandleClick(e) {
    		dispatch("click", {
    			src: e.target.src,
    			alt: e.target.alt,
    			loading: e.target.loading,
    			class: e.target.className
    		});
    	}

    	async function Draw() {
    		await tick();

    		if (!slotHolder) {
    			return;
    		}

    		const images = Array.from(slotHolder.childNodes).filter(child => child.tagName === "IMG");
    		$$invalidate(4, columns = []);

    		// Fill the columns with image URLs
    		for (let i = 0; i < images.length; i++) {
    			const idx = i % columnCount;

    			$$invalidate(
    				4,
    				columns[idx] = [
    					...columns[idx] || [],
    					{
    						src: images[i].src,
    						alt: images[i].alt,
    						class: images[i].className
    					}
    				],
    				columns
    			);
    		}
    	}

    	const writable_props = ['gap', 'maxColumnWidth', 'hover', 'loading'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Gallery> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			slotHolder = $$value;
    			$$invalidate(3, slotHolder);
    		});
    	}

    	function div_elementresize_handler() {
    		galleryWidth = this.clientWidth;
    		$$invalidate(2, galleryWidth);
    	}

    	$$self.$$set = $$props => {
    		if ('gap' in $$props) $$invalidate(8, gap = $$props.gap);
    		if ('maxColumnWidth' in $$props) $$invalidate(9, maxColumnWidth = $$props.maxColumnWidth);
    		if ('hover' in $$props) $$invalidate(0, hover = $$props.hover);
    		if ('loading' in $$props) $$invalidate(1, loading = $$props.loading);
    		if ('$$scope' in $$props) $$invalidate(11, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		createEventDispatcher,
    		tick,
    		gap,
    		maxColumnWidth,
    		hover,
    		loading,
    		dispatch,
    		slotHolder,
    		columns,
    		galleryWidth,
    		columnCount,
    		HandleClick,
    		Draw,
    		galleryStyle
    	});

    	$$self.$inject_state = $$props => {
    		if ('gap' in $$props) $$invalidate(8, gap = $$props.gap);
    		if ('maxColumnWidth' in $$props) $$invalidate(9, maxColumnWidth = $$props.maxColumnWidth);
    		if ('hover' in $$props) $$invalidate(0, hover = $$props.hover);
    		if ('loading' in $$props) $$invalidate(1, loading = $$props.loading);
    		if ('slotHolder' in $$props) $$invalidate(3, slotHolder = $$props.slotHolder);
    		if ('columns' in $$props) $$invalidate(4, columns = $$props.columns);
    		if ('galleryWidth' in $$props) $$invalidate(2, galleryWidth = $$props.galleryWidth);
    		if ('columnCount' in $$props) $$invalidate(10, columnCount = $$props.columnCount);
    		if ('galleryStyle' in $$props) $$invalidate(5, galleryStyle = $$props.galleryStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*galleryWidth, maxColumnWidth*/ 516) {
    			$$invalidate(10, columnCount = parseInt(galleryWidth / maxColumnWidth) || 1);
    		}

    		if ($$self.$$.dirty & /*columnCount*/ 1024) {
    			columnCount && Draw();
    		}

    		if ($$self.$$.dirty & /*columnCount, gap*/ 1280) {
    			$$invalidate(5, galleryStyle = `grid-template-columns: repeat(${columnCount}, 1fr); --gap: ${gap}px`);
    		}
    	};

    	return [
    		hover,
    		loading,
    		galleryWidth,
    		slotHolder,
    		columns,
    		galleryStyle,
    		HandleClick,
    		Draw,
    		gap,
    		maxColumnWidth,
    		columnCount,
    		$$scope,
    		slots,
    		div_binding,
    		div_elementresize_handler
    	];
    }

    class Gallery extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			gap: 8,
    			maxColumnWidth: 9,
    			hover: 0,
    			loading: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Gallery",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*loading*/ ctx[1] === undefined && !('loading' in props)) {
    			console.warn("<Gallery> was created without expected prop 'loading'");
    		}
    	}

    	get gap() {
    		throw new Error("<Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gap(value) {
    		throw new Error("<Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxColumnWidth() {
    		throw new Error("<Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxColumnWidth(value) {
    		throw new Error("<Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loading() {
    		throw new Error("<Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loading(value) {
    		throw new Error("<Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function classMap(classObj) {
        return Object.entries(classObj)
            .filter(([name, value]) => name !== '' && value)
            .map(([name]) => name)
            .join(' ');
    }

    // Match old modifiers. (only works on DOM events)
    const oldModifierRegex = /^[a-z]+(?::(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
    // Match new modifiers.
    const newModifierRegex = /^[^$]+(?:\$(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
    function forwardEventsBuilder(component) {
        // This is our pseudo $on function. It is defined on component mount.
        let $on;
        // This is a list of events bound before mount.
        let events = [];
        // And we override the $on function to forward all bound events.
        component.$on = (fullEventType, callback) => {
            let eventType = fullEventType;
            let destructor = () => { };
            if ($on) {
                // The event was bound programmatically.
                destructor = $on(eventType, callback);
            }
            else {
                // The event was bound before mount by Svelte.
                events.push([eventType, callback]);
            }
            const oldModifierMatch = eventType.match(oldModifierRegex);
            if (oldModifierMatch && console) {
                console.warn('Event modifiers in SMUI now use "$" instead of ":", so that ' +
                    'all events can be bound with modifiers. Please update your ' +
                    'event binding: ', eventType);
            }
            return () => {
                destructor();
            };
        };
        function forward(e) {
            // Internally bubble the event up from Svelte components.
            bubble(component, e);
        }
        return (node) => {
            const destructors = [];
            const forwardDestructors = {};
            // This function is responsible for listening and forwarding
            // all bound events.
            $on = (fullEventType, callback) => {
                let eventType = fullEventType;
                let handler = callback;
                // DOM addEventListener options argument.
                let options = false;
                const oldModifierMatch = eventType.match(oldModifierRegex);
                const newModifierMatch = eventType.match(newModifierRegex);
                const modifierMatch = oldModifierMatch || newModifierMatch;
                if (eventType.match(/^SMUI:\w+:/)) {
                    const newEventTypeParts = eventType.split(':');
                    let newEventType = '';
                    for (let i = 0; i < newEventTypeParts.length; i++) {
                        newEventType +=
                            i === newEventTypeParts.length - 1
                                ? ':' + newEventTypeParts[i]
                                : newEventTypeParts[i]
                                    .split('-')
                                    .map((value) => value.slice(0, 1).toUpperCase() + value.slice(1))
                                    .join('');
                    }
                    console.warn(`The event ${eventType.split('$')[0]} has been renamed to ${newEventType.split('$')[0]}.`);
                    eventType = newEventType;
                }
                if (modifierMatch) {
                    // Parse the event modifiers.
                    // Supported modifiers:
                    // - preventDefault
                    // - stopPropagation
                    // - passive
                    // - nonpassive
                    // - capture
                    // - once
                    const parts = eventType.split(oldModifierMatch ? ':' : '$');
                    eventType = parts[0];
                    const eventOptions = Object.fromEntries(parts.slice(1).map((mod) => [mod, true]));
                    if (eventOptions.passive) {
                        options = options || {};
                        options.passive = true;
                    }
                    if (eventOptions.nonpassive) {
                        options = options || {};
                        options.passive = false;
                    }
                    if (eventOptions.capture) {
                        options = options || {};
                        options.capture = true;
                    }
                    if (eventOptions.once) {
                        options = options || {};
                        options.once = true;
                    }
                    if (eventOptions.preventDefault) {
                        handler = prevent_default(handler);
                    }
                    if (eventOptions.stopPropagation) {
                        handler = stop_propagation(handler);
                    }
                }
                // Listen for the event directly, with the given options.
                const off = listen(node, eventType, handler, options);
                const destructor = () => {
                    off();
                    const idx = destructors.indexOf(destructor);
                    if (idx > -1) {
                        destructors.splice(idx, 1);
                    }
                };
                destructors.push(destructor);
                // Forward the event from Svelte.
                if (!(eventType in forwardDestructors)) {
                    forwardDestructors[eventType] = listen(node, eventType, forward);
                }
                return destructor;
            };
            for (let i = 0; i < events.length; i++) {
                // Listen to all the events added before mount.
                $on(events[i][0], events[i][1]);
            }
            return {
                destroy: () => {
                    // Remove all event listeners.
                    for (let i = 0; i < destructors.length; i++) {
                        destructors[i]();
                    }
                    // Remove all event forwarders.
                    for (let entry of Object.entries(forwardDestructors)) {
                        entry[1]();
                    }
                },
            };
        };
    }

    function useActions(node, actions) {
        let actionReturns = [];
        if (actions) {
            for (let i = 0; i < actions.length; i++) {
                const actionEntry = actions[i];
                const action = Array.isArray(actionEntry) ? actionEntry[0] : actionEntry;
                if (Array.isArray(actionEntry) && actionEntry.length > 1) {
                    actionReturns.push(action(node, actionEntry[1]));
                }
                else {
                    actionReturns.push(action(node));
                }
            }
        }
        return {
            update(actions) {
                if (((actions && actions.length) || 0) != actionReturns.length) {
                    throw new Error('You must not change the length of an actions array.');
                }
                if (actions) {
                    for (let i = 0; i < actions.length; i++) {
                        const returnEntry = actionReturns[i];
                        if (returnEntry && returnEntry.update) {
                            const actionEntry = actions[i];
                            if (Array.isArray(actionEntry) && actionEntry.length > 1) {
                                returnEntry.update(actionEntry[1]);
                            }
                            else {
                                returnEntry.update();
                            }
                        }
                    }
                }
            },
            destroy() {
                for (let i = 0; i < actionReturns.length; i++) {
                    const returnEntry = actionReturns[i];
                    if (returnEntry && returnEntry.destroy) {
                        returnEntry.destroy();
                    }
                }
            },
        };
    }

    /* node_modules\@smui\card\dist\Card.svelte generated by Svelte v3.46.3 */
    const file$5 = "node_modules\\@smui\\card\\dist\\Card.svelte";

    function create_fragment$6(ctx) {
    	let div;
    	let div_class_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let div_levels = [
    		{
    			class: div_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-card': true,
    				'mdc-card--outlined': /*variant*/ ctx[2] === 'outlined',
    				'smui-card--padded': /*padded*/ ctx[3]
    			})
    		},
    		/*$$restProps*/ ctx[6]
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
    			add_location(div, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[10](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[5].call(null, div))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty & /*className, variant, padded*/ 14 && div_class_value !== (div_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					'mdc-card': true,
    					'mdc-card--outlined': /*variant*/ ctx[2] === 'outlined',
    					'smui-card--padded': /*padded*/ ctx[3]
    				}))) && { class: div_class_value },
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
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
    			/*div_binding*/ ctx[10](null);
    			mounted = false;
    			run_all(dispose);
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

    function instance$6($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","variant","padded","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { variant = 'raised' } = $$props;
    	let { padded = false } = $$props;
    	let element;

    	function getElement() {
    		return element;
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(4, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('variant' in $$new_props) $$invalidate(2, variant = $$new_props.variant);
    		if ('padded' in $$new_props) $$invalidate(3, padded = $$new_props.padded);
    		if ('$$scope' in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		forwardEvents,
    		use,
    		className,
    		variant,
    		padded,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('variant' in $$props) $$invalidate(2, variant = $$new_props.variant);
    		if ('padded' in $$props) $$invalidate(3, padded = $$new_props.padded);
    		if ('element' in $$props) $$invalidate(4, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		variant,
    		padded,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			use: 0,
    			class: 1,
    			variant: 2,
    			padded: 3,
    			getElement: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get use() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get variant() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variant(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padded() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padded(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[7];
    	}

    	set getElement(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\common\dist\elements\Div.svelte generated by Svelte v3.46.3 */
    const file$4 = "node_modules\\@smui\\common\\dist\\elements\\Div.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let div_levels = [/*$$restProps*/ ctx[3]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[7](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[2].call(null, div))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
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
    			/*div_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
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

    function instance$5($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Div', slots, ['default']);
    	let { use = [] } = $$props;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let element;

    	function getElement() {
    		return element;
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(1, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		useActions,
    		use,
    		forwardEvents,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(1, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class Div$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { use: 0, getElement: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Div",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get use() {
    		throw new Error("<Div>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Div>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[4];
    	}

    	set getElement(value) {
    		throw new Error("<Div>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\common\dist\classadder\ClassAdder.svelte generated by Svelte v3.46.3 */

    // (1:0) <svelte:component   this={component}   bind:this={element}   use={[forwardEvents, ...use]}   class={classMap({     [className]: true,     [smuiClass]: true,     ...smuiClassMap,   })}   {...props}   {...$$restProps}>
    function create_default_slot$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
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
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
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
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(1:0) <svelte:component   this={component}   bind:this={element}   use={[forwardEvents, ...use]}   class={classMap({     [className]: true,     [smuiClass]: true,     ...smuiClassMap,   })}   {...props}   {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{
    			use: [/*forwardEvents*/ ctx[7], .../*use*/ ctx[0]]
    		},
    		{
    			class: classMap({
    				[/*className*/ ctx[1]]: true,
    				[/*smuiClass*/ ctx[5]]: true,
    				.../*smuiClassMap*/ ctx[4]
    			})
    		},
    		/*props*/ ctx[6],
    		/*$$restProps*/ ctx[8]
    	];

    	var switch_value = /*component*/ ctx[2];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot$1] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		/*switch_instance_binding*/ ctx[11](switch_instance);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = (dirty & /*forwardEvents, use, classMap, className, smuiClass, smuiClassMap, props, $$restProps*/ 499)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*forwardEvents, use*/ 129 && {
    						use: [/*forwardEvents*/ ctx[7], .../*use*/ ctx[0]]
    					},
    					dirty & /*classMap, className, smuiClass, smuiClassMap*/ 50 && {
    						class: classMap({
    							[/*className*/ ctx[1]]: true,
    							[/*smuiClass*/ ctx[5]]: true,
    							.../*smuiClassMap*/ ctx[4]
    						})
    					},
    					dirty & /*props*/ 64 && get_spread_object(/*props*/ ctx[6]),
    					dirty & /*$$restProps*/ 256 && get_spread_object(/*$$restProps*/ ctx[8])
    				])
    			: {};

    			if (dirty & /*$$scope*/ 4096) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*component*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					/*switch_instance_binding*/ ctx[11](switch_instance);
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
    			/*switch_instance_binding*/ ctx[11](null);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
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

    const internals = {
    	component: Div$1,
    	class: '',
    	classMap: {},
    	contexts: {},
    	props: {}
    };

    function instance$4($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","component","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ClassAdder', slots, ['default']);
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let element;
    	const smuiClass = internals.class;
    	const smuiClassMap = {};
    	const smuiClassUnsubscribes = [];
    	const contexts = internals.contexts;
    	const props = internals.props;
    	let { component = internals.component } = $$props;

    	Object.entries(internals.classMap).forEach(([name, context]) => {
    		const store = getContext(context);

    		if (store && 'subscribe' in store) {
    			smuiClassUnsubscribes.push(store.subscribe(value => {
    				$$invalidate(4, smuiClassMap[name] = value, smuiClassMap);
    			}));
    		}
    	});

    	const forwardEvents = forwardEventsBuilder(get_current_component());

    	for (let context in contexts) {
    		if (contexts.hasOwnProperty(context)) {
    			setContext(context, contexts[context]);
    		}
    	}

    	onDestroy(() => {
    		for (const unsubscribe of smuiClassUnsubscribes) {
    			unsubscribe();
    		}
    	});

    	function getElement() {
    		return element.getElement();
    	}

    	function switch_instance_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(3, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('component' in $$new_props) $$invalidate(2, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Div: Div$1,
    		internals,
    		onDestroy,
    		getContext,
    		setContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		use,
    		className,
    		element,
    		smuiClass,
    		smuiClassMap,
    		smuiClassUnsubscribes,
    		contexts,
    		props,
    		component,
    		forwardEvents,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(3, element = $$new_props.element);
    		if ('component' in $$props) $$invalidate(2, component = $$new_props.component);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		component,
    		element,
    		smuiClassMap,
    		smuiClass,
    		props,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		slots,
    		switch_instance_binding,
    		$$scope
    	];
    }

    class ClassAdder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			use: 0,
    			class: 1,
    			component: 2,
    			getElement: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClassAdder",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get use() {
    		throw new Error("<ClassAdder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<ClassAdder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<ClassAdder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ClassAdder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<ClassAdder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<ClassAdder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[9];
    	}

    	set getElement(value) {
    		throw new Error("<ClassAdder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // @ts-ignore: Internals is exported... argh.
    const defaults = Object.assign({}, internals);
    function classAdderBuilder(props) {
        return new Proxy(ClassAdder, {
            construct: function (target, args) {
                Object.assign(internals, defaults, props);
                // @ts-ignore: Need spread arg.
                return new target(...args);
            },
            get: function (target, prop) {
                Object.assign(internals, defaults, props);
                return target[prop];
            },
        });
    }

    const Div = Div$1;

    var Content = classAdderBuilder({
        class: 'smui-card__content',
        component: Div,
    });

    /**
     * Stores result from supportsCssVariables to avoid redundant processing to
     * detect CSS custom variable support.
     */
    var supportsCssVariables_;
    function supportsCssVariables(windowObj, forceRefresh) {
        if (forceRefresh === void 0) { forceRefresh = false; }
        var CSS = windowObj.CSS;
        var supportsCssVars = supportsCssVariables_;
        if (typeof supportsCssVariables_ === 'boolean' && !forceRefresh) {
            return supportsCssVariables_;
        }
        var supportsFunctionPresent = CSS && typeof CSS.supports === 'function';
        if (!supportsFunctionPresent) {
            return false;
        }
        var explicitlySupportsCssVars = CSS.supports('--css-vars', 'yes');
        // See: https://bugs.webkit.org/show_bug.cgi?id=154669
        // See: README section on Safari
        var weAreFeatureDetectingSafari10plus = (CSS.supports('(--css-vars: yes)') &&
            CSS.supports('color', '#00000000'));
        supportsCssVars =
            explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus;
        if (!forceRefresh) {
            supportsCssVariables_ = supportsCssVars;
        }
        return supportsCssVars;
    }
    function getNormalizedEventCoords(evt, pageOffset, clientRect) {
        if (!evt) {
            return { x: 0, y: 0 };
        }
        var x = pageOffset.x, y = pageOffset.y;
        var documentX = x + clientRect.left;
        var documentY = y + clientRect.top;
        var normalizedX;
        var normalizedY;
        // Determine touch point relative to the ripple container.
        if (evt.type === 'touchstart') {
            var touchEvent = evt;
            normalizedX = touchEvent.changedTouches[0].pageX - documentX;
            normalizedY = touchEvent.changedTouches[0].pageY - documentY;
        }
        else {
            var mouseEvent = evt;
            normalizedX = mouseEvent.pageX - documentX;
            normalizedY = mouseEvent.pageY - documentY;
        }
        return { x: normalizedX, y: normalizedY };
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics$3 = function(d, b) {
        extendStatics$3 = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics$3(d, b);
    };

    function __extends$3(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics$3(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign$3 = function() {
        __assign$3 = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign$3.apply(this, arguments);
    };

    function __values$1(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCFoundation = /** @class */ (function () {
        function MDCFoundation(adapter) {
            if (adapter === void 0) { adapter = {}; }
            this.adapter = adapter;
        }
        Object.defineProperty(MDCFoundation, "cssClasses", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports every
                // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "strings", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "numbers", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "defaultAdapter", {
            get: function () {
                // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient
                // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter
                // validation.
                return {};
            },
            enumerable: false,
            configurable: true
        });
        MDCFoundation.prototype.init = function () {
            // Subclasses should override this method to perform initialization routines (registering events, etc.)
        };
        MDCFoundation.prototype.destroy = function () {
            // Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)
        };
        return MDCFoundation;
    }());

    /**
     * @license
     * Copyright 2019 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * Determine whether the current browser supports passive event listeners, and
     * if so, use them.
     */
    function applyPassive$1(globalObj) {
        if (globalObj === void 0) { globalObj = window; }
        return supportsPassiveOption(globalObj) ?
            { passive: true } :
            false;
    }
    function supportsPassiveOption(globalObj) {
        if (globalObj === void 0) { globalObj = window; }
        // See
        // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
        var passiveSupported = false;
        try {
            var options = {
                // This function will be called when the browser
                // attempts to access the passive property.
                get passive() {
                    passiveSupported = true;
                    return false;
                }
            };
            var handler = function () { };
            globalObj.document.addEventListener('test', handler, options);
            globalObj.document.removeEventListener('test', handler, options);
        }
        catch (err) {
            passiveSupported = false;
        }
        return passiveSupported;
    }

    var events = /*#__PURE__*/Object.freeze({
        __proto__: null,
        applyPassive: applyPassive$1
    });

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * @fileoverview A "ponyfill" is a polyfill that doesn't modify the global prototype chain.
     * This makes ponyfills safer than traditional polyfills, especially for libraries like MDC.
     */
    function closest(element, selector) {
        if (element.closest) {
            return element.closest(selector);
        }
        var el = element;
        while (el) {
            if (matches$1(el, selector)) {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    }
    function matches$1(element, selector) {
        var nativeMatches = element.matches
            || element.webkitMatchesSelector
            || element.msMatchesSelector;
        return nativeMatches.call(element, selector);
    }
    /**
     * Used to compute the estimated scroll width of elements. When an element is
     * hidden due to display: none; being applied to a parent element, the width is
     * returned as 0. However, the element will have a true width once no longer
     * inside a display: none context. This method computes an estimated width when
     * the element is hidden or returns the true width when the element is visble.
     * @param {Element} element the element whose width to estimate
     */
    function estimateScrollWidth(element) {
        // Check the offsetParent. If the element inherits display: none from any
        // parent, the offsetParent property will be null (see
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent).
        // This check ensures we only clone the node when necessary.
        var htmlEl = element;
        if (htmlEl.offsetParent !== null) {
            return htmlEl.scrollWidth;
        }
        var clone = htmlEl.cloneNode(true);
        clone.style.setProperty('position', 'absolute');
        clone.style.setProperty('transform', 'translate(-9999px, -9999px)');
        document.documentElement.appendChild(clone);
        var scrollWidth = clone.scrollWidth;
        document.documentElement.removeChild(clone);
        return scrollWidth;
    }

    var ponyfill = /*#__PURE__*/Object.freeze({
        __proto__: null,
        closest: closest,
        matches: matches$1,
        estimateScrollWidth: estimateScrollWidth
    });

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses = {
        // Ripple is a special case where the "root" component is really a "mixin" of sorts,
        // given that it's an 'upgrade' to an existing component. That being said it is the root
        // CSS class that all other CSS classes derive from.
        BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',
        FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',
        FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation',
        ROOT: 'mdc-ripple-upgraded',
        UNBOUNDED: 'mdc-ripple-upgraded--unbounded',
    };
    var strings = {
        VAR_FG_SCALE: '--mdc-ripple-fg-scale',
        VAR_FG_SIZE: '--mdc-ripple-fg-size',
        VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end',
        VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',
        VAR_LEFT: '--mdc-ripple-left',
        VAR_TOP: '--mdc-ripple-top',
    };
    var numbers = {
        DEACTIVATION_TIMEOUT_MS: 225,
        FG_DEACTIVATION_MS: 150,
        INITIAL_ORIGIN_SCALE: 0.6,
        PADDING: 10,
        TAP_DELAY_MS: 300, // Delay between touch and simulated mouse events on touch devices
    };

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    // Activation events registered on the root element of each instance for activation
    var ACTIVATION_EVENT_TYPES = [
        'touchstart', 'pointerdown', 'mousedown', 'keydown',
    ];
    // Deactivation events registered on documentElement when a pointer-related down event occurs
    var POINTER_DEACTIVATION_EVENT_TYPES = [
        'touchend', 'pointerup', 'mouseup', 'contextmenu',
    ];
    // simultaneous nested activations
    var activatedTargets = [];
    var MDCRippleFoundation = /** @class */ (function (_super) {
        __extends$3(MDCRippleFoundation, _super);
        function MDCRippleFoundation(adapter) {
            var _this = _super.call(this, __assign$3(__assign$3({}, MDCRippleFoundation.defaultAdapter), adapter)) || this;
            _this.activationAnimationHasEnded = false;
            _this.activationTimer = 0;
            _this.fgDeactivationRemovalTimer = 0;
            _this.fgScale = '0';
            _this.frame = { width: 0, height: 0 };
            _this.initialSize = 0;
            _this.layoutFrame = 0;
            _this.maxRadius = 0;
            _this.unboundedCoords = { left: 0, top: 0 };
            _this.activationState = _this.defaultActivationState();
            _this.activationTimerCallback = function () {
                _this.activationAnimationHasEnded = true;
                _this.runDeactivationUXLogicIfReady();
            };
            _this.activateHandler = function (e) {
                _this.activateImpl(e);
            };
            _this.deactivateHandler = function () {
                _this.deactivateImpl();
            };
            _this.focusHandler = function () {
                _this.handleFocus();
            };
            _this.blurHandler = function () {
                _this.handleBlur();
            };
            _this.resizeHandler = function () {
                _this.layout();
            };
            return _this;
        }
        Object.defineProperty(MDCRippleFoundation, "cssClasses", {
            get: function () {
                return cssClasses;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "strings", {
            get: function () {
                return strings;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "numbers", {
            get: function () {
                return numbers;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "defaultAdapter", {
            get: function () {
                return {
                    addClass: function () { return undefined; },
                    browserSupportsCssVars: function () { return true; },
                    computeBoundingRect: function () {
                        return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 });
                    },
                    containsEventTarget: function () { return true; },
                    deregisterDocumentInteractionHandler: function () { return undefined; },
                    deregisterInteractionHandler: function () { return undefined; },
                    deregisterResizeHandler: function () { return undefined; },
                    getWindowPageOffset: function () { return ({ x: 0, y: 0 }); },
                    isSurfaceActive: function () { return true; },
                    isSurfaceDisabled: function () { return true; },
                    isUnbounded: function () { return true; },
                    registerDocumentInteractionHandler: function () { return undefined; },
                    registerInteractionHandler: function () { return undefined; },
                    registerResizeHandler: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    updateCssVariable: function () { return undefined; },
                };
            },
            enumerable: false,
            configurable: true
        });
        MDCRippleFoundation.prototype.init = function () {
            var _this = this;
            var supportsPressRipple = this.supportsPressRipple();
            this.registerRootHandlers(supportsPressRipple);
            if (supportsPressRipple) {
                var _a = MDCRippleFoundation.cssClasses, ROOT_1 = _a.ROOT, UNBOUNDED_1 = _a.UNBOUNDED;
                requestAnimationFrame(function () {
                    _this.adapter.addClass(ROOT_1);
                    if (_this.adapter.isUnbounded()) {
                        _this.adapter.addClass(UNBOUNDED_1);
                        // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple
                        _this.layoutInternal();
                    }
                });
            }
        };
        MDCRippleFoundation.prototype.destroy = function () {
            var _this = this;
            if (this.supportsPressRipple()) {
                if (this.activationTimer) {
                    clearTimeout(this.activationTimer);
                    this.activationTimer = 0;
                    this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_ACTIVATION);
                }
                if (this.fgDeactivationRemovalTimer) {
                    clearTimeout(this.fgDeactivationRemovalTimer);
                    this.fgDeactivationRemovalTimer = 0;
                    this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_DEACTIVATION);
                }
                var _a = MDCRippleFoundation.cssClasses, ROOT_2 = _a.ROOT, UNBOUNDED_2 = _a.UNBOUNDED;
                requestAnimationFrame(function () {
                    _this.adapter.removeClass(ROOT_2);
                    _this.adapter.removeClass(UNBOUNDED_2);
                    _this.removeCssVars();
                });
            }
            this.deregisterRootHandlers();
            this.deregisterDeactivationHandlers();
        };
        /**
         * @param evt Optional event containing position information.
         */
        MDCRippleFoundation.prototype.activate = function (evt) {
            this.activateImpl(evt);
        };
        MDCRippleFoundation.prototype.deactivate = function () {
            this.deactivateImpl();
        };
        MDCRippleFoundation.prototype.layout = function () {
            var _this = this;
            if (this.layoutFrame) {
                cancelAnimationFrame(this.layoutFrame);
            }
            this.layoutFrame = requestAnimationFrame(function () {
                _this.layoutInternal();
                _this.layoutFrame = 0;
            });
        };
        MDCRippleFoundation.prototype.setUnbounded = function (unbounded) {
            var UNBOUNDED = MDCRippleFoundation.cssClasses.UNBOUNDED;
            if (unbounded) {
                this.adapter.addClass(UNBOUNDED);
            }
            else {
                this.adapter.removeClass(UNBOUNDED);
            }
        };
        MDCRippleFoundation.prototype.handleFocus = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.adapter.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
        };
        MDCRippleFoundation.prototype.handleBlur = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.adapter.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
        };
        /**
         * We compute this property so that we are not querying information about the client
         * until the point in time where the foundation requests it. This prevents scenarios where
         * client-side feature-detection may happen too early, such as when components are rendered on the server
         * and then initialized at mount time on the client.
         */
        MDCRippleFoundation.prototype.supportsPressRipple = function () {
            return this.adapter.browserSupportsCssVars();
        };
        MDCRippleFoundation.prototype.defaultActivationState = function () {
            return {
                activationEvent: undefined,
                hasDeactivationUXRun: false,
                isActivated: false,
                isProgrammatic: false,
                wasActivatedByPointer: false,
                wasElementMadeActive: false,
            };
        };
        /**
         * supportsPressRipple Passed from init to save a redundant function call
         */
        MDCRippleFoundation.prototype.registerRootHandlers = function (supportsPressRipple) {
            var e_1, _a;
            if (supportsPressRipple) {
                try {
                    for (var ACTIVATION_EVENT_TYPES_1 = __values$1(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next(); !ACTIVATION_EVENT_TYPES_1_1.done; ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next()) {
                        var evtType = ACTIVATION_EVENT_TYPES_1_1.value;
                        this.adapter.registerInteractionHandler(evtType, this.activateHandler);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (ACTIVATION_EVENT_TYPES_1_1 && !ACTIVATION_EVENT_TYPES_1_1.done && (_a = ACTIVATION_EVENT_TYPES_1.return)) _a.call(ACTIVATION_EVENT_TYPES_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                if (this.adapter.isUnbounded()) {
                    this.adapter.registerResizeHandler(this.resizeHandler);
                }
            }
            this.adapter.registerInteractionHandler('focus', this.focusHandler);
            this.adapter.registerInteractionHandler('blur', this.blurHandler);
        };
        MDCRippleFoundation.prototype.registerDeactivationHandlers = function (evt) {
            var e_2, _a;
            if (evt.type === 'keydown') {
                this.adapter.registerInteractionHandler('keyup', this.deactivateHandler);
            }
            else {
                try {
                    for (var POINTER_DEACTIVATION_EVENT_TYPES_1 = __values$1(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next(); !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done; POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next()) {
                        var evtType = POINTER_DEACTIVATION_EVENT_TYPES_1_1.value;
                        this.adapter.registerDocumentInteractionHandler(evtType, this.deactivateHandler);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (POINTER_DEACTIVATION_EVENT_TYPES_1_1 && !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_1.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        };
        MDCRippleFoundation.prototype.deregisterRootHandlers = function () {
            var e_3, _a;
            try {
                for (var ACTIVATION_EVENT_TYPES_2 = __values$1(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next(); !ACTIVATION_EVENT_TYPES_2_1.done; ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next()) {
                    var evtType = ACTIVATION_EVENT_TYPES_2_1.value;
                    this.adapter.deregisterInteractionHandler(evtType, this.activateHandler);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (ACTIVATION_EVENT_TYPES_2_1 && !ACTIVATION_EVENT_TYPES_2_1.done && (_a = ACTIVATION_EVENT_TYPES_2.return)) _a.call(ACTIVATION_EVENT_TYPES_2);
                }
                finally { if (e_3) throw e_3.error; }
            }
            this.adapter.deregisterInteractionHandler('focus', this.focusHandler);
            this.adapter.deregisterInteractionHandler('blur', this.blurHandler);
            if (this.adapter.isUnbounded()) {
                this.adapter.deregisterResizeHandler(this.resizeHandler);
            }
        };
        MDCRippleFoundation.prototype.deregisterDeactivationHandlers = function () {
            var e_4, _a;
            this.adapter.deregisterInteractionHandler('keyup', this.deactivateHandler);
            try {
                for (var POINTER_DEACTIVATION_EVENT_TYPES_2 = __values$1(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next(); !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done; POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next()) {
                    var evtType = POINTER_DEACTIVATION_EVENT_TYPES_2_1.value;
                    this.adapter.deregisterDocumentInteractionHandler(evtType, this.deactivateHandler);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (POINTER_DEACTIVATION_EVENT_TYPES_2_1 && !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_2.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_2);
                }
                finally { if (e_4) throw e_4.error; }
            }
        };
        MDCRippleFoundation.prototype.removeCssVars = function () {
            var _this = this;
            var rippleStrings = MDCRippleFoundation.strings;
            var keys = Object.keys(rippleStrings);
            keys.forEach(function (key) {
                if (key.indexOf('VAR_') === 0) {
                    _this.adapter.updateCssVariable(rippleStrings[key], null);
                }
            });
        };
        MDCRippleFoundation.prototype.activateImpl = function (evt) {
            var _this = this;
            if (this.adapter.isSurfaceDisabled()) {
                return;
            }
            var activationState = this.activationState;
            if (activationState.isActivated) {
                return;
            }
            // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction
            var previousActivationEvent = this.previousActivationEvent;
            var isSameInteraction = previousActivationEvent && evt !== undefined && previousActivationEvent.type !== evt.type;
            if (isSameInteraction) {
                return;
            }
            activationState.isActivated = true;
            activationState.isProgrammatic = evt === undefined;
            activationState.activationEvent = evt;
            activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : evt !== undefined && (evt.type === 'mousedown' || evt.type === 'touchstart' || evt.type === 'pointerdown');
            var hasActivatedChild = evt !== undefined &&
                activatedTargets.length > 0 &&
                activatedTargets.some(function (target) { return _this.adapter.containsEventTarget(target); });
            if (hasActivatedChild) {
                // Immediately reset activation state, while preserving logic that prevents touch follow-on events
                this.resetActivationState();
                return;
            }
            if (evt !== undefined) {
                activatedTargets.push(evt.target);
                this.registerDeactivationHandlers(evt);
            }
            activationState.wasElementMadeActive = this.checkElementMadeActive(evt);
            if (activationState.wasElementMadeActive) {
                this.animateActivation();
            }
            requestAnimationFrame(function () {
                // Reset array on next frame after the current event has had a chance to bubble to prevent ancestor ripples
                activatedTargets = [];
                if (!activationState.wasElementMadeActive
                    && evt !== undefined
                    && (evt.key === ' ' || evt.keyCode === 32)) {
                    // If space was pressed, try again within an rAF call to detect :active, because different UAs report
                    // active states inconsistently when they're called within event handling code:
                    // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971
                    // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741
                    // We try first outside rAF to support Edge, which does not exhibit this problem, but will crash if a CSS
                    // variable is set within a rAF callback for a submit button interaction (#2241).
                    activationState.wasElementMadeActive = _this.checkElementMadeActive(evt);
                    if (activationState.wasElementMadeActive) {
                        _this.animateActivation();
                    }
                }
                if (!activationState.wasElementMadeActive) {
                    // Reset activation state immediately if element was not made active.
                    _this.activationState = _this.defaultActivationState();
                }
            });
        };
        MDCRippleFoundation.prototype.checkElementMadeActive = function (evt) {
            return (evt !== undefined && evt.type === 'keydown') ?
                this.adapter.isSurfaceActive() :
                true;
        };
        MDCRippleFoundation.prototype.animateActivation = function () {
            var _this = this;
            var _a = MDCRippleFoundation.strings, VAR_FG_TRANSLATE_START = _a.VAR_FG_TRANSLATE_START, VAR_FG_TRANSLATE_END = _a.VAR_FG_TRANSLATE_END;
            var _b = MDCRippleFoundation.cssClasses, FG_DEACTIVATION = _b.FG_DEACTIVATION, FG_ACTIVATION = _b.FG_ACTIVATION;
            var DEACTIVATION_TIMEOUT_MS = MDCRippleFoundation.numbers.DEACTIVATION_TIMEOUT_MS;
            this.layoutInternal();
            var translateStart = '';
            var translateEnd = '';
            if (!this.adapter.isUnbounded()) {
                var _c = this.getFgTranslationCoordinates(), startPoint = _c.startPoint, endPoint = _c.endPoint;
                translateStart = startPoint.x + "px, " + startPoint.y + "px";
                translateEnd = endPoint.x + "px, " + endPoint.y + "px";
            }
            this.adapter.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
            this.adapter.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd);
            // Cancel any ongoing activation/deactivation animations
            clearTimeout(this.activationTimer);
            clearTimeout(this.fgDeactivationRemovalTimer);
            this.rmBoundedActivationClasses();
            this.adapter.removeClass(FG_DEACTIVATION);
            // Force layout in order to re-trigger the animation.
            this.adapter.computeBoundingRect();
            this.adapter.addClass(FG_ACTIVATION);
            this.activationTimer = setTimeout(function () {
                _this.activationTimerCallback();
            }, DEACTIVATION_TIMEOUT_MS);
        };
        MDCRippleFoundation.prototype.getFgTranslationCoordinates = function () {
            var _a = this.activationState, activationEvent = _a.activationEvent, wasActivatedByPointer = _a.wasActivatedByPointer;
            var startPoint;
            if (wasActivatedByPointer) {
                startPoint = getNormalizedEventCoords(activationEvent, this.adapter.getWindowPageOffset(), this.adapter.computeBoundingRect());
            }
            else {
                startPoint = {
                    x: this.frame.width / 2,
                    y: this.frame.height / 2,
                };
            }
            // Center the element around the start point.
            startPoint = {
                x: startPoint.x - (this.initialSize / 2),
                y: startPoint.y - (this.initialSize / 2),
            };
            var endPoint = {
                x: (this.frame.width / 2) - (this.initialSize / 2),
                y: (this.frame.height / 2) - (this.initialSize / 2),
            };
            return { startPoint: startPoint, endPoint: endPoint };
        };
        MDCRippleFoundation.prototype.runDeactivationUXLogicIfReady = function () {
            var _this = this;
            // This method is called both when a pointing device is released, and when the activation animation ends.
            // The deactivation animation should only run after both of those occur.
            var FG_DEACTIVATION = MDCRippleFoundation.cssClasses.FG_DEACTIVATION;
            var _a = this.activationState, hasDeactivationUXRun = _a.hasDeactivationUXRun, isActivated = _a.isActivated;
            var activationHasEnded = hasDeactivationUXRun || !isActivated;
            if (activationHasEnded && this.activationAnimationHasEnded) {
                this.rmBoundedActivationClasses();
                this.adapter.addClass(FG_DEACTIVATION);
                this.fgDeactivationRemovalTimer = setTimeout(function () {
                    _this.adapter.removeClass(FG_DEACTIVATION);
                }, numbers.FG_DEACTIVATION_MS);
            }
        };
        MDCRippleFoundation.prototype.rmBoundedActivationClasses = function () {
            var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;
            this.adapter.removeClass(FG_ACTIVATION);
            this.activationAnimationHasEnded = false;
            this.adapter.computeBoundingRect();
        };
        MDCRippleFoundation.prototype.resetActivationState = function () {
            var _this = this;
            this.previousActivationEvent = this.activationState.activationEvent;
            this.activationState = this.defaultActivationState();
            // Touch devices may fire additional events for the same interaction within a short time.
            // Store the previous event until it's safe to assume that subsequent events are for new interactions.
            setTimeout(function () { return _this.previousActivationEvent = undefined; }, MDCRippleFoundation.numbers.TAP_DELAY_MS);
        };
        MDCRippleFoundation.prototype.deactivateImpl = function () {
            var _this = this;
            var activationState = this.activationState;
            // This can happen in scenarios such as when you have a keyup event that blurs the element.
            if (!activationState.isActivated) {
                return;
            }
            var state = __assign$3({}, activationState);
            if (activationState.isProgrammatic) {
                requestAnimationFrame(function () {
                    _this.animateDeactivation(state);
                });
                this.resetActivationState();
            }
            else {
                this.deregisterDeactivationHandlers();
                requestAnimationFrame(function () {
                    _this.activationState.hasDeactivationUXRun = true;
                    _this.animateDeactivation(state);
                    _this.resetActivationState();
                });
            }
        };
        MDCRippleFoundation.prototype.animateDeactivation = function (_a) {
            var wasActivatedByPointer = _a.wasActivatedByPointer, wasElementMadeActive = _a.wasElementMadeActive;
            if (wasActivatedByPointer || wasElementMadeActive) {
                this.runDeactivationUXLogicIfReady();
            }
        };
        MDCRippleFoundation.prototype.layoutInternal = function () {
            var _this = this;
            this.frame = this.adapter.computeBoundingRect();
            var maxDim = Math.max(this.frame.height, this.frame.width);
            // Surface diameter is treated differently for unbounded vs. bounded ripples.
            // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately
            // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically
            // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter
            // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via
            // `overflow: hidden`.
            var getBoundedRadius = function () {
                var hypotenuse = Math.sqrt(Math.pow(_this.frame.width, 2) + Math.pow(_this.frame.height, 2));
                return hypotenuse + MDCRippleFoundation.numbers.PADDING;
            };
            this.maxRadius = this.adapter.isUnbounded() ? maxDim : getBoundedRadius();
            // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform
            var initialSize = Math.floor(maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE);
            // Unbounded ripple size should always be even number to equally center align.
            if (this.adapter.isUnbounded() && initialSize % 2 !== 0) {
                this.initialSize = initialSize - 1;
            }
            else {
                this.initialSize = initialSize;
            }
            this.fgScale = "" + this.maxRadius / this.initialSize;
            this.updateLayoutCssVars();
        };
        MDCRippleFoundation.prototype.updateLayoutCssVars = function () {
            var _a = MDCRippleFoundation.strings, VAR_FG_SIZE = _a.VAR_FG_SIZE, VAR_LEFT = _a.VAR_LEFT, VAR_TOP = _a.VAR_TOP, VAR_FG_SCALE = _a.VAR_FG_SCALE;
            this.adapter.updateCssVariable(VAR_FG_SIZE, this.initialSize + "px");
            this.adapter.updateCssVariable(VAR_FG_SCALE, this.fgScale);
            if (this.adapter.isUnbounded()) {
                this.unboundedCoords = {
                    left: Math.round((this.frame.width / 2) - (this.initialSize / 2)),
                    top: Math.round((this.frame.height / 2) - (this.initialSize / 2)),
                };
                this.adapter.updateCssVariable(VAR_LEFT, this.unboundedCoords.left + "px");
                this.adapter.updateCssVariable(VAR_TOP, this.unboundedCoords.top + "px");
            }
        };
        return MDCRippleFoundation;
    }(MDCFoundation));

    const { applyPassive } = events;
    const { matches } = ponyfill;
    function Ripple(node, { ripple = true, surface = false, unbounded = false, disabled = false, color, active, rippleElement, eventTarget, activeTarget, addClass = (className) => node.classList.add(className), removeClass = (className) => node.classList.remove(className), addStyle = (name, value) => node.style.setProperty(name, value), initPromise = Promise.resolve(), } = {}) {
        let instance;
        let addLayoutListener = getContext('SMUI:addLayoutListener');
        let removeLayoutListener;
        let oldActive = active;
        let oldEventTarget = eventTarget;
        let oldActiveTarget = activeTarget;
        function handleProps() {
            if (surface) {
                addClass('mdc-ripple-surface');
                if (color === 'primary') {
                    addClass('smui-ripple-surface--primary');
                    removeClass('smui-ripple-surface--secondary');
                }
                else if (color === 'secondary') {
                    removeClass('smui-ripple-surface--primary');
                    addClass('smui-ripple-surface--secondary');
                }
                else {
                    removeClass('smui-ripple-surface--primary');
                    removeClass('smui-ripple-surface--secondary');
                }
            }
            else {
                removeClass('mdc-ripple-surface');
                removeClass('smui-ripple-surface--primary');
                removeClass('smui-ripple-surface--secondary');
            }
            // Handle activation first.
            if (instance && oldActive !== active) {
                oldActive = active;
                if (active) {
                    instance.activate();
                }
                else if (active === false) {
                    instance.deactivate();
                }
            }
            // Then create/destroy an instance.
            if (ripple && !instance) {
                instance = new MDCRippleFoundation({
                    addClass,
                    browserSupportsCssVars: () => supportsCssVariables(window),
                    computeBoundingRect: () => (rippleElement || node).getBoundingClientRect(),
                    containsEventTarget: (target) => node.contains(target),
                    deregisterDocumentInteractionHandler: (evtType, handler) => document.documentElement.removeEventListener(evtType, handler, applyPassive()),
                    deregisterInteractionHandler: (evtType, handler) => (eventTarget || node).removeEventListener(evtType, handler, applyPassive()),
                    deregisterResizeHandler: (handler) => window.removeEventListener('resize', handler),
                    getWindowPageOffset: () => ({
                        x: window.pageXOffset,
                        y: window.pageYOffset,
                    }),
                    isSurfaceActive: () => active == null ? matches(activeTarget || node, ':active') : active,
                    isSurfaceDisabled: () => !!disabled,
                    isUnbounded: () => !!unbounded,
                    registerDocumentInteractionHandler: (evtType, handler) => document.documentElement.addEventListener(evtType, handler, applyPassive()),
                    registerInteractionHandler: (evtType, handler) => (eventTarget || node).addEventListener(evtType, handler, applyPassive()),
                    registerResizeHandler: (handler) => window.addEventListener('resize', handler),
                    removeClass,
                    updateCssVariable: addStyle,
                });
                initPromise.then(() => {
                    if (instance) {
                        instance.init();
                        instance.setUnbounded(unbounded);
                    }
                });
            }
            else if (instance && !ripple) {
                initPromise.then(() => {
                    if (instance) {
                        instance.destroy();
                        instance = undefined;
                    }
                });
            }
            // Now handle event/active targets
            if (instance &&
                (oldEventTarget !== eventTarget || oldActiveTarget !== activeTarget)) {
                oldEventTarget = eventTarget;
                oldActiveTarget = activeTarget;
                instance.destroy();
                requestAnimationFrame(() => {
                    if (instance) {
                        instance.init();
                        instance.setUnbounded(unbounded);
                    }
                });
            }
            if (!ripple && unbounded) {
                addClass('mdc-ripple-upgraded--unbounded');
            }
        }
        handleProps();
        if (addLayoutListener) {
            removeLayoutListener = addLayoutListener(layout);
        }
        function layout() {
            if (instance) {
                instance.layout();
            }
        }
        return {
            update(props) {
                ({
                    ripple,
                    surface,
                    unbounded,
                    disabled,
                    color,
                    active,
                    rippleElement,
                    eventTarget,
                    activeTarget,
                    addClass,
                    removeClass,
                    addStyle,
                    initPromise,
                } = Object.assign({ ripple: true, surface: false, unbounded: false, disabled: false, color: undefined, active: undefined, rippleElement: undefined, eventTarget: undefined, activeTarget: undefined, addClass: (className) => node.classList.add(className), removeClass: (className) => node.classList.remove(className), addStyle: (name, value) => node.style.setProperty(name, value), initPromise: Promise.resolve() }, props));
                handleProps();
            },
            destroy() {
                if (instance) {
                    instance.destroy();
                    instance = undefined;
                    removeClass('mdc-ripple-surface');
                    removeClass('smui-ripple-surface--primary');
                    removeClass('smui-ripple-surface--secondary');
                }
                if (removeLayoutListener) {
                    removeLayoutListener();
                }
            },
        };
    }

    /* node_modules\@smui\card\dist\PrimaryAction.svelte generated by Svelte v3.46.3 */
    const file$3 = "node_modules\\@smui\\card\\dist\\PrimaryAction.svelte";

    function create_fragment$3(ctx) {
    	let div1;
    	let div0;
    	let t;
    	let div1_class_value;
    	let div1_style_value;
    	let useActions_action;
    	let Ripple_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);

    	let div1_levels = [
    		{
    			class: div1_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-card__primary-action': true,
    				'smui-card__primary-action--padded': /*padded*/ ctx[5],
    				.../*internalClasses*/ ctx[8]
    			})
    		},
    		{
    			style: div1_style_value = Object.entries(/*internalStyles*/ ctx[9]).map(func).concat([/*style*/ ctx[2]]).join(' ')
    		},
    		{ tabindex: /*tabindex*/ ctx[6] },
    		/*$$restProps*/ ctx[14]
    	];

    	let div1_data = {};

    	for (let i = 0; i < div1_levels.length; i += 1) {
    		div1_data = assign(div1_data, div1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "mdc-card__ripple");
    			add_location(div0, file$3, 25, 2, 504);
    			set_attributes(div1, div1_data);
    			add_location(div1, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			/*div1_binding*/ ctx[18](div1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div1, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[10].call(null, div1)),
    					action_destroyer(Ripple_action = Ripple.call(null, div1, {
    						ripple: /*ripple*/ ctx[3],
    						unbounded: false,
    						color: /*color*/ ctx[4],
    						addClass: /*addClass*/ ctx[11],
    						removeClass: /*removeClass*/ ctx[12],
    						addStyle: /*addStyle*/ ctx[13]
    					}))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 65536)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[16],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[16])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[16], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div1, div1_data = get_spread_update(div1_levels, [
    				(!current || dirty & /*className, padded, internalClasses*/ 290 && div1_class_value !== (div1_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					'mdc-card__primary-action': true,
    					'smui-card__primary-action--padded': /*padded*/ ctx[5],
    					.../*internalClasses*/ ctx[8]
    				}))) && { class: div1_class_value },
    				(!current || dirty & /*internalStyles, style*/ 516 && div1_style_value !== (div1_style_value = Object.entries(/*internalStyles*/ ctx[9]).map(func).concat([/*style*/ ctx[2]]).join(' '))) && { style: div1_style_value },
    				(!current || dirty & /*tabindex*/ 64) && { tabindex: /*tabindex*/ ctx[6] },
    				dirty & /*$$restProps*/ 16384 && /*$$restProps*/ ctx[14]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);

    			if (Ripple_action && is_function(Ripple_action.update) && dirty & /*ripple, color*/ 24) Ripple_action.update.call(null, {
    				ripple: /*ripple*/ ctx[3],
    				unbounded: false,
    				color: /*color*/ ctx[4],
    				addClass: /*addClass*/ ctx[11],
    				removeClass: /*removeClass*/ ctx[12],
    				addStyle: /*addStyle*/ ctx[13]
    			});
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
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			/*div1_binding*/ ctx[18](null);
    			mounted = false;
    			run_all(dispose);
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

    const func = ([name, value]) => `${name}: ${value};`;

    function instance$3($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","style","ripple","color","padded","tabindex","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PrimaryAction', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { style = '' } = $$props;
    	let { ripple = true } = $$props;
    	let { color = undefined } = $$props;
    	let { padded = false } = $$props;
    	let { tabindex = 0 } = $$props;
    	let element;
    	let internalClasses = {};
    	let internalStyles = {};

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(8, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(8, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addStyle(name, value) {
    		if (internalStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete internalStyles[name];
    				$$invalidate(9, internalStyles);
    			} else {
    				$$invalidate(9, internalStyles[name] = value, internalStyles);
    			}
    		}
    	}

    	function getElement() {
    		return element;
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(7, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(14, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('style' in $$new_props) $$invalidate(2, style = $$new_props.style);
    		if ('ripple' in $$new_props) $$invalidate(3, ripple = $$new_props.ripple);
    		if ('color' in $$new_props) $$invalidate(4, color = $$new_props.color);
    		if ('padded' in $$new_props) $$invalidate(5, padded = $$new_props.padded);
    		if ('tabindex' in $$new_props) $$invalidate(6, tabindex = $$new_props.tabindex);
    		if ('$$scope' in $$new_props) $$invalidate(16, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		Ripple,
    		forwardEvents,
    		use,
    		className,
    		style,
    		ripple,
    		color,
    		padded,
    		tabindex,
    		element,
    		internalClasses,
    		internalStyles,
    		addClass,
    		removeClass,
    		addStyle,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('style' in $$props) $$invalidate(2, style = $$new_props.style);
    		if ('ripple' in $$props) $$invalidate(3, ripple = $$new_props.ripple);
    		if ('color' in $$props) $$invalidate(4, color = $$new_props.color);
    		if ('padded' in $$props) $$invalidate(5, padded = $$new_props.padded);
    		if ('tabindex' in $$props) $$invalidate(6, tabindex = $$new_props.tabindex);
    		if ('element' in $$props) $$invalidate(7, element = $$new_props.element);
    		if ('internalClasses' in $$props) $$invalidate(8, internalClasses = $$new_props.internalClasses);
    		if ('internalStyles' in $$props) $$invalidate(9, internalStyles = $$new_props.internalStyles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		style,
    		ripple,
    		color,
    		padded,
    		tabindex,
    		element,
    		internalClasses,
    		internalStyles,
    		forwardEvents,
    		addClass,
    		removeClass,
    		addStyle,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		div1_binding
    	];
    }

    class PrimaryAction$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			use: 0,
    			class: 1,
    			style: 2,
    			ripple: 3,
    			color: 4,
    			padded: 5,
    			tabindex: 6,
    			getElement: 15
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PrimaryAction",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get use() {
    		throw new Error("<PrimaryAction>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<PrimaryAction>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<PrimaryAction>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<PrimaryAction>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<PrimaryAction>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<PrimaryAction>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ripple() {
    		throw new Error("<PrimaryAction>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ripple(value) {
    		throw new Error("<PrimaryAction>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<PrimaryAction>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<PrimaryAction>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padded() {
    		throw new Error("<PrimaryAction>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padded(value) {
    		throw new Error("<PrimaryAction>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<PrimaryAction>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<PrimaryAction>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[15];
    	}

    	set getElement(value) {
    		throw new Error("<PrimaryAction>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\card\dist\Media.svelte generated by Svelte v3.46.3 */
    const file$2 = "node_modules\\@smui\\card\\dist\\Media.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let div_class_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	let div_levels = [
    		{
    			class: div_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-card__media': true,
    				'mdc-card__media--square': /*aspectRatio*/ ctx[2] === 'square',
    				'mdc-card__media--16-9': /*aspectRatio*/ ctx[2] === '16x9'
    			})
    		},
    		/*$$restProps*/ ctx[5]
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
    			add_location(div, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[9](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[4].call(null, div))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty & /*className, aspectRatio*/ 6 && div_class_value !== (div_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					'mdc-card__media': true,
    					'mdc-card__media--square': /*aspectRatio*/ ctx[2] === 'square',
    					'mdc-card__media--16-9': /*aspectRatio*/ ctx[2] === '16x9'
    				}))) && { class: div_class_value },
    				dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
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
    			/*div_binding*/ ctx[9](null);
    			mounted = false;
    			run_all(dispose);
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
    	const omit_props_names = ["use","class","aspectRatio","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Media', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { aspectRatio = undefined } = $$props;
    	let element;

    	function getElement() {
    		return element;
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(3, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('aspectRatio' in $$new_props) $$invalidate(2, aspectRatio = $$new_props.aspectRatio);
    		if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		forwardEvents,
    		use,
    		className,
    		aspectRatio,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('aspectRatio' in $$props) $$invalidate(2, aspectRatio = $$new_props.aspectRatio);
    		if ('element' in $$props) $$invalidate(3, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		aspectRatio,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class Media$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			use: 0,
    			class: 1,
    			aspectRatio: 2,
    			getElement: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Media",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get use() {
    		throw new Error("<Media>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Media>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Media>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Media>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get aspectRatio() {
    		throw new Error("<Media>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set aspectRatio(value) {
    		throw new Error("<Media>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[6];
    	}

    	set getElement(value) {
    		throw new Error("<Media>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var MediaContent = classAdderBuilder({
        class: 'mdc-card__media-content',
        component: Div,
    });

    classAdderBuilder({
        class: 'mdc-card__action-buttons',
        component: Div,
    });

    classAdderBuilder({
        class: 'mdc-card__action-icons',
        component: Div,
    });

    const PrimaryAction = PrimaryAction$1;
    const Media = Media$1;

    /*
    Copyright (c) NAVER Corp.
    name: @egjs/component
    license: MIT
    author: NAVER Corp.
    repository: https://github.com/naver/egjs-component
    version: 3.0.2
    */
    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    function __values(o) {
      var s = typeof Symbol === "function" && Symbol.iterator,
          m = s && o[s],
          i = 0;
      if (m) return m.call(o);
      if (o && typeof o.length === "number") return {
        next: function () {
          if (o && i >= o.length) o = void 0;
          return {
            value: o && o[i++],
            done: !o
          };
        }
      };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o),
          r,
          ar = [],
          e;

      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
      } catch (error) {
        e = {
          error: error
        };
      } finally {
        try {
          if (r && !r.done && (m = i["return"])) m.call(i);
        } finally {
          if (e) throw e.error;
        }
      }

      return ar;
    }
    function __spread() {
      for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));

      return ar;
    }

    /*
     * Copyright (c) 2015 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    var isUndefined = function (value) {
      return typeof value === "undefined";
    };

    /**
     * Event class to provide additional properties
     * @ko Component에서 추가적인 프로퍼티를 제공하는 이벤트 클래스
     */

    var ComponentEvent =
    /*#__PURE__*/
    function () {
      /**
       * Create a new instance of ComponentEvent.
       * @ko ComponentEvent의 새로운 인스턴스를 생성한다.
       * @param eventType The name of the event.<ko>이벤트 이름.</ko>
       * @param props An object that contains additional event properties.<ko>추가적인 이벤트 프로퍼티 오브젝트.</ko>
       */
      function ComponentEvent(eventType, props) {
        var e_1, _a;

        this._canceled = false;

        if (props) {
          try {
            for (var _b = __values(Object.keys(props)), _c = _b.next(); !_c.done; _c = _b.next()) {
              var key = _c.value; // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

              this[key] = props[key];
            }
          } catch (e_1_1) {
            e_1 = {
              error: e_1_1
            };
          } finally {
            try {
              if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            } finally {
              if (e_1) throw e_1.error;
            }
          }
        }

        this.eventType = eventType;
      }
      /**
       * Stop the event. {@link ComponentEvent#isCanceled} will return `true` after.
       * @ko 이벤트를 중단한다. 이후 {@link ComponentEvent#isCanceled}가 `true`를 반환한다.
       */


      var __proto = ComponentEvent.prototype;

      __proto.stop = function () {
        this._canceled = true;
      };
      /**
       * Returns a boolean value that indicates whether {@link ComponentEvent#stop} is called before.
       * @ko {@link ComponentEvent#stop}이 호출되었는지 여부를 반환한다.
       * @return {boolean} A boolean value that indicates whether {@link ComponentEvent#stop} is called before.<ko>이전에 {@link ComponentEvent#stop}이 불려졌는지 여부를 반환한다.</ko>
       */


      __proto.isCanceled = function () {
        return this._canceled;
      };

      return ComponentEvent;
    }();

    /**
     * A class used to manage events in a component
     * @ko 컴포넌트의 이벤트을 관리할 수 있게 하는 클래스
     */

    var Component =
    /*#__PURE__*/
    function () {
      /**
       * @support {"ie": "7+", "ch" : "latest", "ff" : "latest",  "sf" : "latest", "edge" : "latest", "ios" : "7+", "an" : "2.1+ (except 3.x)"}
       */
      function Component() {
        this._eventHandler = {};
      }
      /**
       * Trigger a custom event.
       * @ko 커스텀 이벤트를 발생시킨다
       * @param {string | ComponentEvent} event The name of the custom event to be triggered or an instance of the ComponentEvent<ko>발생할 커스텀 이벤트의 이름 또는 ComponentEvent의 인스턴스</ko>
       * @param {any[]} params Event data to be sent when triggering a custom event <ko>커스텀 이벤트가 발생할 때 전달할 데이터</ko>
       * @return An instance of the component itself<ko>컴포넌트 자신의 인스턴스</ko>
       * @example
       * ```ts
       * import Component, { ComponentEvent } from "@egjs/component";
       *
       * class Some extends Component<{
       *   beforeHi: ComponentEvent<{ foo: number; bar: string }>;
       *   hi: { foo: { a: number; b: boolean } };
       *   someEvent: (foo: number, bar: string) => void;
       *   someOtherEvent: void; // When there's no event argument
       * }> {
       *   some(){
       *     if(this.trigger("beforeHi")){ // When event call to stop return false.
       *       this.trigger("hi");// fire hi event.
       *     }
       *   }
       * }
       *
       * const some = new Some();
       * some.on("beforeHi", e => {
       *   if(condition){
       *     e.stop(); // When event call to stop, `hi` event not call.
       *   }
       *   // `currentTarget` is component instance.
       *   console.log(some === e.currentTarget); // true
       *
       *   typeof e.foo; // number
       *   typeof e.bar; // string
       * });
       * some.on("hi", e => {
       *   typeof e.foo.b; // boolean
       * });
       * // If you want to more know event design. You can see article.
       * // https://github.com/naver/egjs-component/wiki/How-to-make-Component-event-design%3F
       * ```
       */


      var __proto = Component.prototype;

      __proto.trigger = function (event) {
        var params = [];

        for (var _i = 1; _i < arguments.length; _i++) {
          params[_i - 1] = arguments[_i];
        }

        var eventName = event instanceof ComponentEvent ? event.eventType : event;

        var handlers = __spread(this._eventHandler[eventName] || []);

        if (handlers.length <= 0) {
          return this;
        }

        if (event instanceof ComponentEvent) {
          event.currentTarget = this;
          handlers.forEach(function (handler) {
            handler(event);
          });
        } else {
          handlers.forEach(function (handler) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            handler.apply(void 0, __spread(params));
          });
        }

        return this;
      };
      /**
       * Executed event just one time.
       * @ko 이벤트가 한번만 실행된다.
       * @param {string} eventName The name of the event to be attached or an event name - event handler mapped object.<ko>등록할 이벤트의 이름 또는 이벤트 이름-핸들러 오브젝트</ko>
       * @param {function} handlerToAttach The handler function of the event to be attached <ko>등록할 이벤트의 핸들러 함수</ko>
       * @return An instance of the component itself<ko>컴포넌트 자신의 인스턴스</ko>
       * @example
       * ```ts
       * import Component, { ComponentEvent } from "@egjs/component";
       *
       * class Some extends Component<{
       *   hi: ComponentEvent;
       * }> {
       *   hi() {
       *     alert("hi");
       *   }
       *   thing() {
       *     this.once("hi", this.hi);
       *   }
       * }
       *
       * var some = new Some();
       * some.thing();
       * some.trigger(new ComponentEvent("hi"));
       * // fire alert("hi");
       * some.trigger(new ComponentEvent("hi"));
       * // Nothing happens
       * ```
       */


      __proto.once = function (eventName, handlerToAttach) {
        var _this = this;

        if (typeof eventName === "object" && isUndefined(handlerToAttach)) {
          var eventHash = eventName;

          for (var key in eventHash) {
            this.once(key, eventHash[key]);
          }

          return this;
        } else if (typeof eventName === "string" && typeof handlerToAttach === "function") {
          var listener_1 = function () {
            var args = [];

            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            } // eslint-disable-next-line @typescript-eslint/no-unsafe-call


            handlerToAttach.apply(void 0, __spread(args));

            _this.off(eventName, listener_1);
          };

          this.on(eventName, listener_1);
        }

        return this;
      };
      /**
       * Checks whether an event has been attached to a component.
       * @ko 컴포넌트에 이벤트가 등록됐는지 확인한다.
       * @param {string} eventName The name of the event to be attached <ko>등록 여부를 확인할 이벤트의 이름</ko>
       * @return {boolean} Indicates whether the event is attached. <ko>이벤트 등록 여부</ko>
       * @example
       * ```ts
       * import Component from "@egjs/component";
       *
       * class Some extends Component<{
       *   hi: void;
       * }> {
       *   some() {
       *     this.hasOn("hi");// check hi event.
       *   }
       * }
       * ```
       */


      __proto.hasOn = function (eventName) {
        return !!this._eventHandler[eventName];
      };
      /**
       * Attaches an event to a component.
       * @ko 컴포넌트에 이벤트를 등록한다.
       * @param {string} eventName The name of the event to be attached or an event name - event handler mapped object.<ko>등록할 이벤트의 이름 또는 이벤트 이름-핸들러 오브젝트</ko>
       * @param {function} handlerToAttach The handler function of the event to be attached <ko>등록할 이벤트의 핸들러 함수</ko>
       * @return An instance of a component itself<ko>컴포넌트 자신의 인스턴스</ko>
       * @example
       * ```ts
       * import Component, { ComponentEvent } from "@egjs/component";
       *
       * class Some extends Component<{
       *   hi: void;
       * }> {
       *   hi() {
       *     console.log("hi");
       *   }
       *   some() {
       *     this.on("hi",this.hi); //attach event
       *   }
       * }
       * ```
       */


      __proto.on = function (eventName, handlerToAttach) {
        if (typeof eventName === "object" && isUndefined(handlerToAttach)) {
          var eventHash = eventName;

          for (var name in eventHash) {
            this.on(name, eventHash[name]);
          }

          return this;
        } else if (typeof eventName === "string" && typeof handlerToAttach === "function") {
          var handlerList = this._eventHandler[eventName];

          if (isUndefined(handlerList)) {
            this._eventHandler[eventName] = [];
            handlerList = this._eventHandler[eventName];
          }

          handlerList.push(handlerToAttach);
        }

        return this;
      };
      /**
       * Detaches an event from the component.<br/>If the `eventName` is not given this will detach all event handlers attached.<br/>If the `handlerToDetach` is not given, this will detach all event handlers for `eventName`.
       * @ko 컴포넌트에 등록된 이벤트를 해제한다.<br/>`eventName`이 주어지지 않았을 경우 모든 이벤트 핸들러를 제거한다.<br/>`handlerToAttach`가 주어지지 않았을 경우 `eventName`에 해당하는 모든 이벤트 핸들러를 제거한다.
       * @param {string?} eventName The name of the event to be detached <ko>해제할 이벤트의 이름</ko>
       * @param {function?} handlerToDetach The handler function of the event to be detached <ko>해제할 이벤트의 핸들러 함수</ko>
       * @return An instance of a component itself <ko>컴포넌트 자신의 인스턴스</ko>
       * @example
       * ```ts
       * import Component, { ComponentEvent } from "@egjs/component";
       *
       * class Some extends Component<{
       *   hi: void;
       * }> {
       *   hi() {
       *     console.log("hi");
       *   }
       *   some() {
       *     this.off("hi",this.hi); //detach event
       *   }
       * }
       * ```
       */


      __proto.off = function (eventName, handlerToDetach) {
        var e_1, _a; // Detach all event handlers.


        if (isUndefined(eventName)) {
          this._eventHandler = {};
          return this;
        } // Detach all handlers for eventname or detach event handlers by object.


        if (isUndefined(handlerToDetach)) {
          if (typeof eventName === "string") {
            delete this._eventHandler[eventName];
            return this;
          } else {
            var eventHash = eventName;

            for (var name in eventHash) {
              this.off(name, eventHash[name]);
            }

            return this;
          }
        } // Detach single event handler


        var handlerList = this._eventHandler[eventName];

        if (handlerList) {
          var idx = 0;

          try {
            for (var handlerList_1 = __values(handlerList), handlerList_1_1 = handlerList_1.next(); !handlerList_1_1.done; handlerList_1_1 = handlerList_1.next()) {
              var handlerFunction = handlerList_1_1.value;

              if (handlerFunction === handlerToDetach) {
                handlerList.splice(idx, 1);

                if (handlerList.length <= 0) {
                  delete this._eventHandler[eventName];
                }

                break;
              }

              idx++;
            }
          } catch (e_1_1) {
            e_1 = {
              error: e_1_1
            };
          } finally {
            try {
              if (handlerList_1_1 && !handlerList_1_1.done && (_a = handlerList_1.return)) _a.call(handlerList_1);
            } finally {
              if (e_1) throw e_1.error;
            }
          }
        }

        return this;
      };
      /**
       * Version info string
       * @ko 버전정보 문자열
       * @name VERSION
       * @static
       * @example
       * Component.VERSION;  // ex) 3.0.0
       * @memberof Component
       */


      Component.VERSION = "3.0.2";
      return Component;
    }();

    /*
     * Copyright (c) 2015 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */

    var ComponentEvent$1 = ComponentEvent;

    /*
    Copyright (c) 2020-present NAVER Corp.
    name: @egjs/imready
    license: MIT
    author: NAVER Corp.
    repository: https://github.com/naver/egjs-imready
    version: 1.3.0
    */

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    /* global Reflect, Promise */
    var extendStatics$2 = function (d, b) {
      extendStatics$2 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      };

      return extendStatics$2(d, b);
    };

    function __extends$2(d, b) {
      extendStatics$2(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign$2 = function () {
      __assign$2 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }

        return t;
      };

      return __assign$2.apply(this, arguments);
    };
    function __spreadArrays$2() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

      for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

      return r;
    }

    /*
    egjs-imready
    Copyright (c) 2020-present NAVER Corp.
    MIT license
    */
    var isWindow$1 = typeof window !== "undefined";
    var ua$1 = isWindow$1 ? window.navigator.userAgent : "";
    var SUPPORT_COMPUTEDSTYLE = isWindow$1 ? !!("getComputedStyle" in window) : false;
    var IS_IE = /MSIE|Trident|Windows Phone|Edge/.test(ua$1);
    var SUPPORT_ADDEVENTLISTENER = isWindow$1 ? !!("addEventListener" in document) : false;
    var WIDTH = "width";
    var HEIGHT = "height";

    function getAttribute(el, name) {
      return el.getAttribute(name) || "";
    }
    function toArray$1(arr) {
      return [].slice.call(arr);
    }
    function hasSizeAttribute(target, prefix) {
      if (prefix === void 0) {
        prefix = "data-";
      }

      return !!target.getAttribute(prefix + "width");
    }
    function hasLoadingAttribute(target, prefix) {
      if (prefix === void 0) {
        prefix = "data-";
      }

      return "loading" in target && target.getAttribute("loading") === "lazy" || !!target.getAttribute(prefix + "lazy");
    }
    function hasSkipAttribute(target, prefix) {
      if (prefix === void 0) {
        prefix = "data-";
      }

      return !!target.getAttribute(prefix + "skip");
    }
    function addEvent(element, type, handler) {
      if (SUPPORT_ADDEVENTLISTENER) {
        element.addEventListener(type, handler, false);
      } else if (element.attachEvent) {
        element.attachEvent("on" + type, handler);
      } else {
        element["on" + type] = handler;
      }
    }
    function removeEvent(element, type, handler) {
      if (element.removeEventListener) {
        element.removeEventListener(type, handler, false);
      } else if (element.detachEvent) {
        element.detachEvent("on" + type, handler);
      } else {
        element["on" + type] = null;
      }
    }
    function innerWidth(el) {
      return getSize(el, "Width");
    }
    function innerHeight(el) {
      return getSize(el, "Height");
    }
    function getStyles(el) {
      return (SUPPORT_COMPUTEDSTYLE ? window.getComputedStyle(el) : el.currentStyle) || {};
    }

    function getSize(el, name) {
      var size = el["client" + name] || el["offset" + name];
      return parseFloat(size || getStyles(el)[name.toLowerCase()]) || 0;
    }

    function getContentElements(element, tags, prefix) {
      var skipElements = toArray$1(element.querySelectorAll(__spreadArrays$2(["[" + prefix + "skip] [" + prefix + "width]"], tags.map(function (tag) {
        return ["[" + prefix + "skip] " + tag, tag + "[" + prefix + "skip]", "[" + prefix + "width] " + tag].join(", ");
      })).join(", ")));
      return toArray$1(element.querySelectorAll("[" + prefix + "width], " + tags.join(", "))).filter(function (el) {
        return skipElements.indexOf(el) === -1;
      });
    }

    /*
    egjs-imready
    Copyright (c) 2020-present NAVER Corp.
    MIT license
    */
    var elements = [];
    function addAutoSizer(element, prefix) {
      !elements.length && addEvent(window, "resize", resizeAllAutoSizers);
      element.__PREFIX__ = prefix;
      elements.push(element);
      resize(element);
    }
    function removeAutoSizer(element, prefix) {
      var index = elements.indexOf(element);

      if (index < 0) {
        return;
      }

      var fixed = getAttribute(element, prefix + "fixed");
      delete element.__PREFIX__;
      element.style[fixed === HEIGHT ? WIDTH : HEIGHT] = "";
      elements.splice(index, 1);
      !elements.length && removeEvent(window, "resize", resizeAllAutoSizers);
    }

    function resize(element, prefix) {
      if (prefix === void 0) {
        prefix = "data-";
      }

      var elementPrefix = element.__PREFIX__ || prefix;
      var dataWidth = parseInt(getAttribute(element, "" + elementPrefix + WIDTH), 10) || 0;
      var dataHeight = parseInt(getAttribute(element, "" + elementPrefix + HEIGHT), 10) || 0;
      var fixed = getAttribute(element, elementPrefix + "fixed");

      if (fixed === HEIGHT) {
        var size = innerHeight(element) || dataHeight;
        element.style[WIDTH] = dataWidth / dataHeight * size + "px";
      } else {
        var size = innerWidth(element) || dataWidth;
        element.style[HEIGHT] = dataHeight / dataWidth * size + "px";
      }
    }

    function resizeAllAutoSizers() {
      elements.forEach(function (element) {
        resize(element);
      });
    }

    var Loader =
    /*#__PURE__*/
    function (_super) {
      __extends$2(Loader, _super);

      function Loader(element, options) {
        if (options === void 0) {
          options = {};
        }

        var _this = _super.call(this) || this;

        _this.isReady = false;
        _this.isPreReady = false;
        _this.hasDataSize = false;
        _this.hasLoading = false;
        _this.isSkip = false;

        _this.onCheck = function (e) {
          _this.clear();

          if (e && e.type === "error") {
            _this.onError(_this.element);
          }

          if (_this.hasLoading && _this.checkElement()) {
            // I'm not ready
            return;
          } // I'm pre-ready and ready!


          var withPreReady = !_this.hasDataSize && !_this.hasLoading;

          _this.onReady(withPreReady);
        };

        _this.options = __assign$2({
          prefix: "data-"
        }, options);
        _this.element = element;
        var prefix = _this.options.prefix;
        _this.hasDataSize = hasSizeAttribute(element, prefix);
        _this.isSkip = hasSkipAttribute(element, prefix);
        _this.hasLoading = hasLoadingAttribute(element, prefix);
        return _this;
      }

      var __proto = Loader.prototype;

      __proto.check = function () {
        if (this.isSkip || !this.checkElement()) {
          // I'm Ready
          this.onAlreadyReady(true);
          return false;
        }

        if (this.hasDataSize) {
          addAutoSizer(this.element, this.options.prefix);
        }

        if (this.hasDataSize || this.hasLoading) {
          // I'm Pre Ready
          this.onAlreadyPreReady();
        } // Wati Pre Ready, Ready


        return true;
      };

      __proto.addEvents = function () {
        var _this = this;

        var element = this.element;
        this.constructor.EVENTS.forEach(function (name) {
          addEvent(element, name, _this.onCheck);
        });
      };

      __proto.clear = function () {
        var _this = this;

        var element = this.element;
        this.constructor.EVENTS.forEach(function (name) {
          removeEvent(element, name, _this.onCheck);
        });
        this.removeAutoSizer();
      };

      __proto.destroy = function () {
        this.clear();
        this.off();
      };

      __proto.removeAutoSizer = function () {
        if (this.hasDataSize) {
          // I'm already ready.
          var prefix = this.options.prefix;
          removeAutoSizer(this.element, prefix);
        }
      };

      __proto.onError = function (target) {
        this.trigger("error", {
          element: this.element,
          target: target
        });
      };

      __proto.onPreReady = function () {
        if (this.isPreReady) {
          return;
        }

        this.isPreReady = true;
        this.trigger("preReady", {
          element: this.element,
          hasLoading: this.hasLoading,
          isSkip: this.isSkip
        });
      };

      __proto.onReady = function (withPreReady) {
        if (this.isReady) {
          return;
        }

        withPreReady = !this.isPreReady && withPreReady;

        if (withPreReady) {
          this.isPreReady = true;
        }

        this.removeAutoSizer();
        this.isReady = true;
        this.trigger("ready", {
          element: this.element,
          withPreReady: withPreReady,
          hasLoading: this.hasLoading,
          isSkip: this.isSkip
        });
      };

      __proto.onAlreadyError = function (target) {
        var _this = this;

        setTimeout(function () {
          _this.onError(target);
        });
      };

      __proto.onAlreadyPreReady = function () {
        var _this = this;

        setTimeout(function () {
          _this.onPreReady();
        });
      };

      __proto.onAlreadyReady = function (withPreReady) {
        var _this = this;

        setTimeout(function () {
          _this.onReady(withPreReady);
        });
      };

      Loader.EVENTS = [];
      return Loader;
    }(Component);

    var ElementLoader =
    /*#__PURE__*/
    function (_super) {
      __extends$2(ElementLoader, _super);

      function ElementLoader() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = ElementLoader.prototype;

      __proto.setHasLoading = function (hasLoading) {
        this.hasLoading = hasLoading;
      };

      __proto.check = function () {
        if (this.isSkip) {
          // I'm Ready
          this.onAlreadyReady(true);
          return false;
        }

        if (this.hasDataSize) {
          addAutoSizer(this.element, this.options.prefix);
          this.onAlreadyPreReady();
        } else {
          // has not data size
          this.trigger("requestChildren");
        }

        return true;
      };

      __proto.checkElement = function () {
        return true;
      };

      __proto.destroy = function () {
        this.clear();
        this.trigger("requestDestroy");
        this.off();
      };

      __proto.onAlreadyPreReady = function () {
        // has data size
        _super.prototype.onAlreadyPreReady.call(this);

        this.trigger("reqeustReadyChildren");
      };

      ElementLoader.EVENTS = [];
      return ElementLoader;
    }(Loader);

    /**
     * @alias eg.ImReady
     * @extends eg.Component
     */

    var ImReadyManager =
    /*#__PURE__*/
    function (_super) {
      __extends$2(ImReadyManager, _super);
      /**
       * @param - ImReady's options
       */


      function ImReadyManager(options) {
        if (options === void 0) {
          options = {};
        }

        var _this = _super.call(this) || this;

        _this.readyCount = 0;
        _this.preReadyCount = 0;
        _this.totalCount = 0;
        _this.totalErrorCount = 0;
        _this.isPreReadyOver = true;
        _this.elementInfos = [];
        _this.options = __assign$2({
          loaders: {},
          prefix: "data-"
        }, options);
        return _this;
      }
      /**
       * Checks whether elements are in the ready state.
       * @ko 엘리먼트가 준비 상태인지 체크한다.
       * @elements - Elements to check ready status. <ko> 준비 상태를 체크할 엘리먼트들.</ko>
       * @example
         * ```html
         * <div>
         *    <img src="./1.jpg" data-width="1280" data-height="853" style="width:100%"/>
         *    <img src="./2.jpg" data-width="1280" data-height="853"/>
         *    <img src="ERR" data-width="1280" data-height="853"/>
         * </div>
         * ```
         * ## Javascript
         * ```js
         * import ImReady from "@egjs/imready";
         *
         * const im = new ImReady(); // umd: eg.ImReady
         * im.check(document.querySelectorAll("img")).on({
         *   preReadyElement: e => {
         *     // 1, 3
         *     // 2, 3
         *     // 3, 3
         *     console.log(e.preReadyCount, e.totalCount),
         *   },
         * });
         * ```
       */


      var __proto = ImReadyManager.prototype;

      __proto.check = function (elements) {
        var _this = this;

        var prefix = this.options.prefix;
        this.clear();
        this.elementInfos = toArray$1(elements).map(function (element, index) {
          var loader = _this.getLoader(element, {
            prefix: prefix
          });

          loader.check();
          loader.on("error", function (e) {
            _this.onError(index, e.target);
          }).on("preReady", function (e) {
            var info = _this.elementInfos[index];
            info.hasLoading = e.hasLoading;
            info.isSkip = e.isSkip;

            var isPreReady = _this.checkPreReady(index);

            _this.onPreReadyElement(index);

            isPreReady && _this.onPreReady();
          }).on("ready", function (_a) {
            var withPreReady = _a.withPreReady,
                hasLoading = _a.hasLoading,
                isSkip = _a.isSkip;
            var info = _this.elementInfos[index];
            info.hasLoading = hasLoading;
            info.isSkip = isSkip;

            var isPreReady = withPreReady && _this.checkPreReady(index);

            var isReady = _this.checkReady(index); // Pre-ready and ready occur simultaneously


            withPreReady && _this.onPreReadyElement(index);

            _this.onReadyElement(index);

            isPreReady && _this.onPreReady();
            isReady && _this.onReady();
          });
          return {
            loader: loader,
            element: element,
            hasLoading: false,
            hasError: false,
            isPreReady: false,
            isReady: false,
            isSkip: false
          };
        });
        var length = this.elementInfos.length;
        this.totalCount = length;

        if (!length) {
          setTimeout(function () {
            _this.onPreReady();

            _this.onReady();
          });
        }

        return this;
      };
      /**
       * Gets the total count of elements to be checked.
       * @ko 체크하는 element의 총 개수를 가져온다.
       */


      __proto.getTotalCount = function () {
        return this.totalCount;
      };
      /**
       * Whether the elements are all pre-ready. (all sizes are known)
       * @ko 엘리먼트들이 모두 사전 준비가 됐는지 (사이즈를 전부 알 수 있는지) 여부.
       */


      __proto.isPreReady = function () {
        return this.elementInfos.every(function (info) {
          return info.isPreReady;
        });
      };
      /**
       * Whether the elements are all ready.
       * @ko 엘리먼트들이 모두 준비가 됐는지 여부.
       */


      __proto.isReady = function () {
        return this.elementInfos.every(function (info) {
          return info.isReady;
        });
      };
      /**
       * Whether an error has occurred in the elements in the current state.
       * @ko 현재 상태에서 엘리먼트들이 에러가 발생했는지 여부.
       */


      __proto.hasError = function () {
        return this.totalErrorCount > 0;
      };
      /**
       * Clears events of elements being checked.
       * @ko 체크 중인 엘리먼트들의 이벤트를 해제 한다.
       */


      __proto.clear = function () {
        this.isPreReadyOver = false;
        this.totalCount = 0;
        this.preReadyCount = 0;
        this.readyCount = 0;
        this.totalErrorCount = 0;
        this.elementInfos.forEach(function (info) {
          if (!info.isReady && info.loader) {
            info.loader.destroy();
          }
        });
        this.elementInfos = [];
      };
      /**
       * Destory all events.
       * @ko 모든 이벤트를 해제 한다.
       */


      __proto.destroy = function () {
        this.clear();
        this.off();
      };

      __proto.getLoader = function (element, options) {
        var _this = this;

        var tagName = element.tagName.toLowerCase();
        var loaders = this.options.loaders;
        var prefix = options.prefix;
        var tags = Object.keys(loaders);

        if (loaders[tagName]) {
          return new loaders[tagName](element, options);
        }

        var loader = new ElementLoader(element, options);
        var children = toArray$1(element.querySelectorAll(tags.join(", ")));
        loader.setHasLoading(children.some(function (el) {
          return hasLoadingAttribute(el, prefix);
        }));
        var withPreReady = false;
        var childrenImReady = this.clone().on("error", function (e) {
          loader.onError(e.target);
        }).on("ready", function () {
          loader.onReady(withPreReady);
        });
        loader.on("requestChildren", function () {
          // has not data size
          var contentElements = getContentElements(element, tags, _this.options.prefix);
          childrenImReady.check(contentElements).on("preReady", function (e) {
            withPreReady = e.isReady;

            if (!withPreReady) {
              loader.onPreReady();
            }
          });
        }).on("reqeustReadyChildren", function () {
          // has data size
          // loader call preReady
          // check only video, image elements
          childrenImReady.check(children);
        }).on("requestDestroy", function () {
          childrenImReady.destroy();
        });
        return loader;
      };

      __proto.clone = function () {
        return new ImReadyManager(__assign$2({}, this.options));
      };

      __proto.checkPreReady = function (index) {
        this.elementInfos[index].isPreReady = true;
        ++this.preReadyCount;

        if (this.preReadyCount < this.totalCount) {
          return false;
        }

        return true;
      };

      __proto.checkReady = function (index) {
        this.elementInfos[index].isReady = true;
        ++this.readyCount;

        if (this.readyCount < this.totalCount) {
          return false;
        }

        return true;
      };

      __proto.onError = function (index, target) {
        var info = this.elementInfos[index];
        info.hasError = true;
        /**
         * An event occurs if the image, video fails to load.
         * @ko 이미지, 비디오가 로딩에 실패하면 이벤트가 발생한다.
         * @event eg.ImReady#error
         * @param {eg.ImReady.OnError} e - The object of data to be sent to an event <ko>이벤트에 전달되는 데이터 객체</ko>
         * @example
         * ```html
         * <div>
         *    <img src="./1.jpg" data-width="1280" data-height="853" style="width:100%"/>
         *    <img src="./2.jpg"/>
         *    <img src="ERR"/>
         * </div>
         * ```
         * ## Javascript
         * ```js
         * import ImReady from "@egjs/imready";
         *
         * const im = new ImReady(); // umd: eg.ImReady
         * im.check([document.querySelector("div")]).on({
         *   error: e => {
         *     // <div>...</div>, 0, <img src="ERR"/>
         *     console.log(e.element, e.index, e.target),
         *   },
         * });
         * ```
         */

        this.trigger(new ComponentEvent$1("error", {
          element: info.element,
          index: index,
          target: target,
          errorCount: this.getErrorCount(),
          totalErrorCount: ++this.totalErrorCount
        }));
      };

      __proto.onPreReadyElement = function (index) {
        var info = this.elementInfos[index];
        /**
         * An event occurs when the element is pre-ready (when the loading attribute is applied or the size is known)
         * @ko 해당 엘리먼트가 사전 준비되었을 때(loading 속성이 적용되었거나 사이즈를 알 수 있을 때) 이벤트가 발생한다.
         * @event eg.ImReady#preReadyElement
         * @param {eg.ImReady.OnPreReadyElement} e - The object of data to be sent to an event <ko>이벤트에 전달되는 데이터 객체</ko>
         * @example
         * ```html
         * <div>
         *    <img src="./1.jpg" data-width="1280" data-height="853" style="width:100%"/>
         *    <img src="./2.jpg" data-width="1280" data-height="853"/>
         *    <img src="ERR" data-width="1280" data-height="853"/>
         * </div>
         * ```
         * ## Javascript
         * ```js
         * import ImReady from "@egjs/imready";
         *
         * const im = new ImReady(); // umd: eg.ImReady
         * im.check(document.querySelectorAll("img")).on({
         *   preReadyElement: e => {
         *     // 1, 3
         *     // 2, 3
         *     // 3, 3
         *     console.log(e.preReadyCount, e.totalCount),
         *   },
         * });
         * ```
         */

        this.trigger(new ComponentEvent$1("preReadyElement", {
          element: info.element,
          index: index,
          preReadyCount: this.preReadyCount,
          readyCount: this.readyCount,
          totalCount: this.totalCount,
          isPreReady: this.isPreReady(),
          isReady: this.isReady(),
          hasLoading: info.hasLoading,
          isSkip: info.isSkip
        }));
      };

      __proto.onPreReady = function () {
        this.isPreReadyOver = true;
        /**
         * An event occurs when all element are pre-ready (When all elements have the loading attribute applied or the size is known)
         * @ko 모든 엘리먼트들이 사전 준비된 경우 (모든 엘리먼트들이 loading 속성이 적용되었거나 사이즈를 알 수 있는 경우) 이벤트가 발생한다.
         * @event eg.ImReady#preReady
         * @param {eg.ImReady.OnPreReady} e - The object of data to be sent to an event <ko>이벤트에 전달되는 데이터 객체</ko>
         * @example
         * ```html
         * <div>
         *    <img src="./1.jpg" data-width="1280" data-height="853" style="width:100%"/>
         *    <img src="./2.jpg" data-width="1280" data-height="853"/>
         *    <img src="ERR" data-width="1280" data-height="853"/>
         * </div>
         * ```
         * ## Javascript
         * ```js
         * import ImReady from "@egjs/imready";
         *
         * const im = new ImReady(); // umd: eg.ImReady
         * im.check(document.querySelectorAll("img")).on({
         *   preReady: e => {
         *     // 0, 3
         *     console.log(e.readyCount, e.totalCount),
         *   },
         * });
         * ```
         */

        this.trigger(new ComponentEvent$1("preReady", {
          readyCount: this.readyCount,
          totalCount: this.totalCount,
          isReady: this.isReady(),
          hasLoading: this.hasLoading()
        }));
      };

      __proto.onReadyElement = function (index) {
        var info = this.elementInfos[index];
        /**
         * An event occurs when the element is ready
         * @ko 해당 엘리먼트가 준비가 되었을 때 이벤트가 발생한다.
         * @event eg.ImReady#readyElement
         * @param {eg.ImReady.OnReadyElement} e - The object of data to be sent to an event <ko>이벤트에 전달되는 데이터 객체</ko>
         * @example
         * ```html
         * <div>
         *    <img src="./1.jpg" data-width="1280" data-height="853" style="width:100%"/>
         *    <img src="./2.jpg" data-width="1280" data-height="853"/>
         *    <img src="ERR" data-width="1280" data-height="853"/>
         * </div>
         * ```
         * ## Javascript
         * ```js
         * import ImReady from "@egjs/imready";
         *
         * const im = new ImReady(); // umd: eg.ImReady
         * im.check(document.querySelectorAll("img")).on({
         *   readyElement: e => {
         *     // 1, 0, false, 3
         *     // 2, 1, false, 3
         *     // 3, 2, true, 3
         *     console.log(e.readyCount, e.index, e.hasError, e.totalCount),
         *   },
         * });
         * ```
         */

        this.trigger(new ComponentEvent$1("readyElement", {
          index: index,
          element: info.element,
          hasError: info.hasError,
          errorCount: this.getErrorCount(),
          totalErrorCount: this.totalErrorCount,
          preReadyCount: this.preReadyCount,
          readyCount: this.readyCount,
          totalCount: this.totalCount,
          isPreReady: this.isPreReady(),
          isReady: this.isReady(),
          hasLoading: info.hasLoading,
          isPreReadyOver: this.isPreReadyOver,
          isSkip: info.isSkip
        }));
      };

      __proto.onReady = function () {
        /**
         * An event occurs when all element are ready
         * @ko 모든 엘리먼트들이 준비된 경우 이벤트가 발생한다.
         * @event eg.ImReady#ready
         * @param {eg.ImReady.OnReady} e - The object of data to be sent to an event <ko>이벤트에 전달되는 데이터 객체</ko>
         * @example
         * ```html
         * <div>
         *    <img src="./1.jpg" data-width="1280" data-height="853" style="width:100%"/>
         *    <img src="./2.jpg" data-width="1280" data-height="853"/>
         *    <img src="ERR" data-width="1280" data-height="853"/>
         * </div>
         * ```
         * ## Javascript
         * ```js
         * import ImReady from "@egjs/imready";
         *
         * const im = new ImReady(); // umd: eg.ImReady
         * im.check(document.querySelectorAll("img")).on({
         *   preReady: e => {
         *     // 0, 3
         *     console.log(e.readyCount, e.totalCount),
         *   },
         *   ready: e => {
         *     // 1, 3
         *     console.log(e.errorCount, e.totalCount),
         *   },
         * });
         * ```
         */
        this.trigger(new ComponentEvent$1("ready", {
          errorCount: this.getErrorCount(),
          totalErrorCount: this.totalErrorCount,
          totalCount: this.totalCount
        }));
      };

      __proto.getErrorCount = function () {
        return this.elementInfos.filter(function (info) {
          return info.hasError;
        }).length;
      };

      __proto.hasLoading = function () {
        return this.elementInfos.some(function (info) {
          return info.hasLoading;
        });
      };

      return ImReadyManager;
    }(Component);

    var ImageLoader =
    /*#__PURE__*/
    function (_super) {
      __extends$2(ImageLoader, _super);

      function ImageLoader() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = ImageLoader.prototype;

      __proto.checkElement = function () {
        var element = this.element;
        var src = element.getAttribute("src");

        if (element.complete) {
          if (src) {
            // complete
            if (!element.naturalWidth) {
              this.onAlreadyError(element);
            }

            return false;
          } else {
            // Using an external lazy loading module
            this.onAlreadyPreReady();
          }
        }

        this.addEvents();
        IS_IE && element.setAttribute("src", src);
        return true;
      };

      ImageLoader.EVENTS = ["load", "error"];
      return ImageLoader;
    }(Loader);

    var VideoLoader =
    /*#__PURE__*/
    function (_super) {
      __extends$2(VideoLoader, _super);

      function VideoLoader() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = VideoLoader.prototype;

      __proto.checkElement = function () {
        var element = this.element; // HAVE_NOTHING: 0, no information whether or not the audio/video is ready
        // HAVE_METADATA: 1, HAVE_METADATA - metadata for the audio/video is ready
        // HAVE_CURRENT_DATA: 2, data for the current playback position is available, but not enough data to play next frame/millisecond
        // HAVE_FUTURE_DATA: 3, data for the current and at least the next frame is available
        // HAVE_ENOUGH_DATA: 4, enough data available to start playing

        if (element.readyState >= 1) {
          return false;
        }

        if (element.error) {
          this.onAlreadyError(element);
          return false;
        }

        this.addEvents();
        return true;
      };

      VideoLoader.EVENTS = ["loadedmetadata", "error"];
      return VideoLoader;
    }(Loader);

    var ImReady =
    /*#__PURE__*/
    function (_super) {
      __extends$2(ImReady, _super);

      function ImReady(options) {
        if (options === void 0) {
          options = {};
        }

        return _super.call(this, __assign$2({
          loaders: {
            img: ImageLoader,
            video: VideoLoader
          }
        }, options)) || this;
      }

      return ImReady;
    }(ImReadyManager);

    /*
    egjs-imready
    Copyright (c) 2020-present NAVER Corp.
    MIT license
    */

    var ImReady$1 = ImReady;

    /*
    Copyright (c) 2019-present NAVER Corp.
    name: @egjs/list-differ
    license: MIT
    author: NAVER Corp.
    repository: https://github.com/naver/egjs-list-differ
    version: 1.0.0
    */
    /*
    egjs-list-differ
    Copyright (c) 2019-present NAVER Corp.
    MIT license
    */
    var PolyMap =
    /*#__PURE__*/
    function () {
      function PolyMap() {
        this.keys = [];
        this.values = [];
      }

      var __proto = PolyMap.prototype;

      __proto.get = function (key) {
        return this.values[this.keys.indexOf(key)];
      };

      __proto.set = function (key, value) {
        var keys = this.keys;
        var values = this.values;
        var prevIndex = keys.indexOf(key);
        var index = prevIndex === -1 ? keys.length : prevIndex;
        keys[index] = key;
        values[index] = value;
      };

      return PolyMap;
    }();

    /*
    egjs-list-differ
    Copyright (c) 2019-present NAVER Corp.
    MIT license
    */
    var HashMap =
    /*#__PURE__*/
    function () {
      function HashMap() {
        this.object = {};
      }

      var __proto = HashMap.prototype;

      __proto.get = function (key) {
        return this.object[key];
      };

      __proto.set = function (key, value) {
        this.object[key] = value;
      };

      return HashMap;
    }();

    /*
    egjs-list-differ
    Copyright (c) 2019-present NAVER Corp.
    MIT license
    */
    var SUPPORT_MAP = typeof Map === "function";

    /*
    egjs-list-differ
    Copyright (c) 2019-present NAVER Corp.
    MIT license
    */
    var Link =
    /*#__PURE__*/
    function () {
      function Link() {}

      var __proto = Link.prototype;

      __proto.connect = function (prevLink, nextLink) {
        this.prev = prevLink;
        this.next = nextLink;
        prevLink && (prevLink.next = this);
        nextLink && (nextLink.prev = this);
      };

      __proto.disconnect = function () {
        // In double linked list, diconnect the interconnected relationship.
        var prevLink = this.prev;
        var nextLink = this.next;
        prevLink && (prevLink.next = nextLink);
        nextLink && (nextLink.prev = prevLink);
      };

      __proto.getIndex = function () {
        var link = this;
        var index = -1;

        while (link) {
          link = link.prev;
          ++index;
        }

        return index;
      };

      return Link;
    }();

    /*
    egjs-list-differ
    Copyright (c) 2019-present NAVER Corp.
    MIT license
    */

    function orderChanged(changed, fixed) {
      // It is roughly in the order of these examples.
      // 4, 6, 0, 2, 1, 3, 5, 7
      var fromLinks = []; // 0, 1, 2, 3, 4, 5, 6, 7

      var toLinks = [];
      changed.forEach(function (_a) {
        var from = _a[0],
            to = _a[1];
        var link = new Link();
        fromLinks[from] = link;
        toLinks[to] = link;
      }); // `fromLinks` are connected to each other by double linked list.

      fromLinks.forEach(function (link, i) {
        link.connect(fromLinks[i - 1]);
      });
      return changed.filter(function (_, i) {
        return !fixed[i];
      }).map(function (_a, i) {
        var from = _a[0],
            to = _a[1];

        if (from === to) {
          return [0, 0];
        }

        var fromLink = fromLinks[from];
        var toLink = toLinks[to - 1];
        var fromIndex = fromLink.getIndex(); // Disconnect the link connected to `fromLink`.

        fromLink.disconnect(); // Connect `fromLink` to the right of `toLink`.

        if (!toLink) {
          fromLink.connect(undefined, fromLinks[0]);
        } else {
          fromLink.connect(toLink, toLink.next);
        }

        var toIndex = fromLink.getIndex();
        return [fromIndex, toIndex];
      });
    }

    var Result =
    /*#__PURE__*/
    function () {
      function Result(prevList, list, added, removed, changed, maintained, changedBeforeAdded, fixed) {
        this.prevList = prevList;
        this.list = list;
        this.added = added;
        this.removed = removed;
        this.changed = changed;
        this.maintained = maintained;
        this.changedBeforeAdded = changedBeforeAdded;
        this.fixed = fixed;
      }

      var __proto = Result.prototype;
      Object.defineProperty(__proto, "ordered", {
        get: function () {
          if (!this.cacheOrdered) {
            this.caculateOrdered();
          }

          return this.cacheOrdered;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(__proto, "pureChanged", {
        get: function () {
          if (!this.cachePureChanged) {
            this.caculateOrdered();
          }

          return this.cachePureChanged;
        },
        enumerable: true,
        configurable: true
      });

      __proto.caculateOrdered = function () {
        var ordered = orderChanged(this.changedBeforeAdded, this.fixed);
        var changed = this.changed;
        var pureChanged = [];
        this.cacheOrdered = ordered.filter(function (_a, i) {
          var from = _a[0],
              to = _a[1];
          var _b = changed[i],
              fromBefore = _b[0],
              toBefore = _b[1];

          if (from !== to) {
            pureChanged.push([fromBefore, toBefore]);
            return true;
          }
        });
        this.cachePureChanged = pureChanged;
      };

      return Result;
    }();

    /**
     *
     * @memberof eg.ListDiffer
     * @static
     * @function
     * @param - Previous List <ko> 이전 목록 </ko>
     * @param - List to Update <ko> 업데이트 할 목록 </ko>
     * @param - This callback function returns the key of the item. <ko> 아이템의 키를 반환하는 콜백 함수입니다.</ko>
     * @return - Returns the diff between `prevList` and `list` <ko> `prevList`와 `list`의 다른 점을 반환한다.</ko>
     * @example
     * import { diff } from "@egjs/list-differ";
     * // script => eg.ListDiffer.diff
     * const result = diff([0, 1, 2, 3, 4, 5], [7, 8, 0, 4, 3, 6, 2, 1], e => e);
     * // List before update
     * // [1, 2, 3, 4, 5]
     * console.log(result.prevList);
     * // Updated list
     * // [4, 3, 6, 2, 1]
     * console.log(result.list);
     * // Index array of values added to `list`
     * // [0, 1, 5]
     * console.log(result.added);
     * // Index array of values removed in `prevList`
     * // [5]
     * console.log(result.removed);
     * // An array of index pairs of `prevList` and `list` with different indexes from `prevList` and `list`
     * // [[0, 2], [4, 3], [3, 4], [2, 6], [1, 7]]
     * console.log(result.changed);
     * // The subset of `changed` and an array of index pairs that moved data directly. Indicate an array of absolute index pairs of `ordered`.(Formatted by: Array<[index of prevList, index of list]>)
     * // [[4, 3], [3, 4], [2, 6]]
     * console.log(result.pureChanged);
     * // An array of index pairs to be `ordered` that can synchronize `list` before adding data. (Formatted by: Array<[prevIndex, nextIndex]>)
     * // [[4, 1], [4, 2], [4, 3]]
     * console.log(result.ordered);
     * // An array of index pairs of `prevList` and `list` that have not been added/removed so data is preserved
     * // [[0, 2], [4, 3], [3, 4], [2, 6], [1, 7]]
     * console.log(result.maintained);
     */

    function diff$1(prevList, list, findKeyCallback) {
      var mapClass = SUPPORT_MAP ? Map : findKeyCallback ? HashMap : PolyMap;

      var callback = findKeyCallback || function (e) {
        return e;
      };

      var added = [];
      var removed = [];
      var maintained = [];
      var prevKeys = prevList.map(callback);
      var keys = list.map(callback);
      var prevKeyMap = new mapClass();
      var keyMap = new mapClass();
      var changedBeforeAdded = [];
      var fixed = [];
      var removedMap = {};
      var changed = [];
      var addedCount = 0;
      var removedCount = 0; // Add prevKeys and keys to the hashmap.

      prevKeys.forEach(function (key, prevListIndex) {
        prevKeyMap.set(key, prevListIndex);
      });
      keys.forEach(function (key, listIndex) {
        keyMap.set(key, listIndex);
      }); // Compare `prevKeys` and `keys` and add them to `removed` if they are not in `keys`.

      prevKeys.forEach(function (key, prevListIndex) {
        var listIndex = keyMap.get(key); // In prevList, but not in list, it is removed.

        if (typeof listIndex === "undefined") {
          ++removedCount;
          removed.push(prevListIndex);
        } else {
          removedMap[listIndex] = removedCount;
        }
      }); // Compare `prevKeys` and `keys` and add them to `added` if they are not in `prevKeys`.

      keys.forEach(function (key, listIndex) {
        var prevListIndex = prevKeyMap.get(key); // In list, but not in prevList, it is added.

        if (typeof prevListIndex === "undefined") {
          added.push(listIndex);
          ++addedCount;
        } else {
          maintained.push([prevListIndex, listIndex]);
          removedCount = removedMap[listIndex] || 0;
          changedBeforeAdded.push([prevListIndex - removedCount, listIndex - addedCount]);
          fixed.push(listIndex === prevListIndex);

          if (prevListIndex !== listIndex) {
            changed.push([prevListIndex, listIndex]);
          }
        }
      }); // Sort by ascending order of 'to(list's index).

      removed.reverse();
      return new Result(prevList, list, added, removed, changed, maintained, changedBeforeAdded, fixed);
    }

    /*
    Copyright (c) 2019-present NAVER Corp.
    name: @egjs/children-differ
    license: MIT
    author: NAVER Corp.
    repository: https://github.com/naver/egjs-children-differ
    version: 1.0.1
    */

    /*
    egjs-children-differ
    Copyright (c) 2019-present NAVER Corp.
    MIT license
    */
    var findKeyCallback = typeof Map === "function" ? undefined : function () {
      var childrenCount = 0;
      return function (el) {
        return el.__DIFF_KEY__ || (el.__DIFF_KEY__ = ++childrenCount);
      };
    }();

    /*
    egjs-children-differ
    Copyright (c) 2019-present NAVER Corp.
    MIT license
    */
    /**
     *
     * @memberof eg.ChildrenDiffer
     * @static
     * @function
     * @param - Previous List <ko> 이전 목록 </ko>
     * @param - List to Update <ko> 업데이트 할 목록 </ko>
     * @return - Returns the diff between `prevList` and `list` <ko> `prevList`와 `list`의 다른 점을 반환한다.</ko>
     * @example
     * import { diff } from "@egjs/children-differ";
     * // script => eg.ChildrenDiffer.diff
     * const result = diff([0, 1, 2, 3, 4, 5], [7, 8, 0, 4, 3, 6, 2, 1]);
     * // List before update
     * // [1, 2, 3, 4, 5]
     * console.log(result.prevList);
     * // Updated list
     * // [4, 3, 6, 2, 1]
     * console.log(result.list);
     * // Index array of values added to `list`
     * // [0, 1, 5]
     * console.log(result.added);
     * // Index array of values removed in `prevList`
     * // [5]
     * console.log(result.removed);
     * // An array of index pairs of `prevList` and `list` with different indexes from `prevList` and `list`
     * // [[0, 2], [4, 3], [3, 4], [2, 6], [1, 7]]
     * console.log(result.changed);
     * // The subset of `changed` and an array of index pairs that moved data directly. Indicate an array of absolute index pairs of `ordered`.(Formatted by: Array<[index of prevList, index of list]>)
     * // [[4, 3], [3, 4], [2, 6]]
     * console.log(result.pureChanged);
     * // An array of index pairs to be `ordered` that can synchronize `list` before adding data. (Formatted by: Array<[prevIndex, nextIndex]>)
     * // [[4, 1], [4, 2], [4, 3]]
     * console.log(result.ordered);
     * // An array of index pairs of `prevList` and `list` that have not been added/removed so data is preserved
     * // [[0, 2], [4, 3], [3, 4], [2, 6], [1, 7]]
     * console.log(result.maintained);
     */

    function diff(prevList, list) {
      return diff$1(prevList, list, findKeyCallback);
    }

    /*
    Copyright (c) 2021-present NAVER Corp.
    name: @egjs/grid
    license: MIT
    author: NAVER Corp.
    repository: https://github.com/naver/egjs-grid
    version: 1.8.0
    */

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    /* global Reflect, Promise */
    var extendStatics$1 = function (d, b) {
      extendStatics$1 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      };

      return extendStatics$1(d, b);
    };

    function __extends$1(d, b) {
      if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics$1(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign$1 = function () {
      __assign$1 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }

        return t;
      };

      return __assign$1.apply(this, arguments);
    };
    function __decorate$1(decorators, target, key, desc) {
      var c = arguments.length,
          r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
          d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    /** @deprecated */

    function __spreadArrays$1() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

      for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

      return r;
    }

    var DEFAULT_GRID_OPTIONS = {
      horizontal: false,
      useTransform: false,
      percentage: false,
      isEqualSize: false,
      isConstantSize: false,
      gap: 0,
      attributePrefix: "data-grid-",
      resizeDebounce: 100,
      maxResizeDebounce: 0,
      autoResize: true,
      preserveUIOnDestroy: false,
      defaultDirection: "end",
      externalContainerManager: null,
      externalItemRenderer: null,
      renderOnPropertyChange: true,
      useFit: true,
      outlineLength: 0,
      outlineSize: 0,
      useRoundedSize: true
    };
    var PROPERTY_TYPE;

    (function (PROPERTY_TYPE) {
      PROPERTY_TYPE[PROPERTY_TYPE["PROPERTY"] = 1] = "PROPERTY";
      PROPERTY_TYPE[PROPERTY_TYPE["RENDER_PROPERTY"] = 2] = "RENDER_PROPERTY";
    })(PROPERTY_TYPE || (PROPERTY_TYPE = {}));

    var MOUNT_STATE;

    (function (MOUNT_STATE) {
      MOUNT_STATE[MOUNT_STATE["UNCHECKED"] = 1] = "UNCHECKED";
      MOUNT_STATE[MOUNT_STATE["UNMOUNTED"] = 2] = "UNMOUNTED";
      MOUNT_STATE[MOUNT_STATE["MOUNTED"] = 3] = "MOUNTED";
    })(MOUNT_STATE || (MOUNT_STATE = {}));

    var UPDATE_STATE;

    (function (UPDATE_STATE) {
      UPDATE_STATE[UPDATE_STATE["NEED_UPDATE"] = 1] = "NEED_UPDATE";
      UPDATE_STATE[UPDATE_STATE["WAIT_LOADING"] = 2] = "WAIT_LOADING";
      UPDATE_STATE[UPDATE_STATE["UPDATED"] = 3] = "UPDATED";
    })(UPDATE_STATE || (UPDATE_STATE = {}));

    var GRID_PROPERTY_TYPES = {
      gap: PROPERTY_TYPE.RENDER_PROPERTY,
      defaultDirection: PROPERTY_TYPE.PROPERTY,
      renderOnPropertyChange: PROPERTY_TYPE.PROPERTY,
      preserveUIOnDestroy: PROPERTY_TYPE.PROPERTY,
      useFit: PROPERTY_TYPE.PROPERTY,
      outlineSize: PROPERTY_TYPE.RENDER_PROPERTY,
      outlineLength: PROPERTY_TYPE.RENDER_PROPERTY
    };
    var RECT_NAMES = {
      horizontal: {
        inlinePos: "top",
        contentPos: "left",
        inlineSize: "height",
        contentSize: "width"
      },
      vertical: {
        inlinePos: "left",
        contentPos: "top",
        inlineSize: "width",
        contentSize: "height"
      }
    };

    var ContainerManager =
    /*#__PURE__*/
    function (_super) {
      __extends$1(ContainerManager, _super);

      function ContainerManager(container, options) {
        var _this = _super.call(this) || this;

        _this.container = container;
        _this._resizeTimer = 0;
        _this._maxResizeDebounceTimer = 0;

        _this._onResize = function () {
          clearTimeout(_this._resizeTimer);
          clearTimeout(_this._maxResizeDebounceTimer);
          _this._maxResizeDebounceTimer = 0;
          _this._resizeTimer = 0;

          _this.trigger("resize");
        };

        _this._scheduleResize = function () {
          var _a = _this.options,
              resizeDebounce = _a.resizeDebounce,
              maxResizeDebounce = _a.maxResizeDebounce;

          if (!_this._maxResizeDebounceTimer && maxResizeDebounce >= resizeDebounce) {
            _this._maxResizeDebounceTimer = window.setTimeout(_this._onResize, maxResizeDebounce);
          }

          if (_this._resizeTimer) {
            clearTimeout(_this._resizeTimer);
            _this._resizeTimer = 0;
          }

          _this._resizeTimer = window.setTimeout(_this._onResize, resizeDebounce);
        };

        _this.options = __assign$1({
          horizontal: DEFAULT_GRID_OPTIONS.horizontal,
          autoResize: DEFAULT_GRID_OPTIONS.autoResize,
          resizeDebounce: DEFAULT_GRID_OPTIONS.resizeDebounce,
          maxResizeDebounce: DEFAULT_GRID_OPTIONS.maxResizeDebounce
        }, options);

        _this._init();

        return _this;
      }

      var __proto = ContainerManager.prototype;

      __proto.resize = function () {
        var container = this.container;
        this.setRect({
          width: container.clientWidth,
          height: container.clientHeight
        });
      };

      __proto.getRect = function () {
        return this.rect;
      };

      __proto.setRect = function (rect) {
        this.rect = __assign$1({}, rect);
      };

      __proto.getInlineSize = function () {
        return this.rect[this.options.horizontal ? "height" : "width"];
      };

      __proto.getContentSize = function () {
        return this.rect[this.options.horizontal ? "width" : "height"];
      };

      __proto.getStatus = function () {
        return {
          rect: __assign$1({}, this.rect)
        };
      };

      __proto.setStatus = function (status) {
        this.rect = __assign$1({}, status.rect);
        this.setContentSize(this.getContentSize());
      };

      __proto.setContentSize = function (size) {
        var sizeName = this.options.horizontal ? "width" : "height";
        this.rect[sizeName] = size;
        this.container.style[sizeName] = size + "px";
      };

      __proto.destroy = function (options) {
        if (options === void 0) {
          options = {};
        }

        window.removeEventListener("resize", this._scheduleResize);

        if (!options.preserveUI) {
          this.container.style.cssText = this.orgCSSText;
        }
      };

      __proto._init = function () {
        var container = this.container;
        var style = window.getComputedStyle(container);
        this.orgCSSText = container.style.cssText;

        if (style.position === "static") {
          container.style.position = "relative";
        }

        if (this.options.autoResize) {
          window.addEventListener("resize", this._scheduleResize);
        }
      };

      return ContainerManager;
    }(Component);

    function getKeys(obj) {
      return Object.keys(obj);
    }
    function isString$1(val) {
      return typeof val === "string";
    }
    function isNumber$1(val) {
      return typeof val === "number";
    }
    function camelize(str) {
      return str.replace(/[\s-_]([a-z])/g, function (all, letter) {
        return letter.toUpperCase();
      });
    }
    function getDataAttributes(element, attributePrefix) {
      var dataAttributes = {};
      var attributes = element.attributes;
      var length = attributes.length;

      for (var i = 0; i < length; ++i) {
        var attribute = attributes[i];
        var name = attribute.name,
            value = attribute.value;

        if (name.indexOf(attributePrefix) === -1) {
          continue;
        }

        dataAttributes[camelize(name.replace(attributePrefix, ""))] = value;
      }

      return dataAttributes;
    }
    /* Class Decorator */

    function GetterSetter(component) {
      var prototype = component.prototype,
          propertyTypes = component.propertyTypes;

      var _loop_1 = function (name) {
        var shouldRender = propertyTypes[name] === PROPERTY_TYPE.RENDER_PROPERTY;
        var descriptor = Object.getOwnPropertyDescriptor(prototype, name) || {};

        var getter = descriptor.get || function get() {
          return this.options[name];
        };

        var setter = descriptor.set || function set(value) {
          var options = this.options;
          var prevValue = options[name];

          if (prevValue === value) {
            return;
          }

          options[name] = value;

          if (shouldRender && options.renderOnPropertyChange) {
            this.scheduleRender();
          }
        };

        var attributes = {
          enumerable: true,
          configurable: true,
          get: getter,
          set: setter
        };
        Object.defineProperty(prototype, name, attributes);
      };

      for (var name in propertyTypes) {
        _loop_1(name);
      }
    }
    function range$1(length) {
      var arr = [];

      for (var i = 0; i < length; ++i) {
        arr.push(i);
      }

      return arr;
    }

    var ItemRenderer =
    /*#__PURE__*/
    function () {
      function ItemRenderer(options) {
        this.initialRect = null;
        this.sizePercetage = false;
        this.posPercetage = false;
        this.options = __assign$1({
          attributePrefix: DEFAULT_GRID_OPTIONS.attributePrefix,
          useTransform: DEFAULT_GRID_OPTIONS.useTransform,
          horizontal: DEFAULT_GRID_OPTIONS.horizontal,
          percentage: DEFAULT_GRID_OPTIONS.percentage,
          isEqualSize: DEFAULT_GRID_OPTIONS.isEqualSize,
          isConstantSize: DEFAULT_GRID_OPTIONS.isConstantSize,
          useRoundedSize: DEFAULT_GRID_OPTIONS.useRoundedSize
        }, options);

        this._init();
      }

      var __proto = ItemRenderer.prototype;

      __proto.resize = function () {
        this.initialRect = null;
      };

      __proto.renderItems = function (items) {
        var _this = this;

        items.forEach(function (item) {
          _this._renderItem(item);
        });
      };

      __proto.getInlineSize = function () {
        return this.containerRect[this.options.horizontal ? "height" : "width"];
      };

      __proto.setContainerRect = function (rect) {
        this.containerRect = rect;
      };

      __proto.updateItems = function (items) {
        var _this = this;

        items.forEach(function (item) {
          _this._updateItem(item);
        });
      };

      __proto.getStatus = function () {
        return {
          initialRect: this.initialRect
        };
      };

      __proto.setStatus = function (status) {
        this.initialRect = status.initialRect;
      };

      __proto._init = function () {
        var percentage = this.options.percentage;
        var sizePercentage = false;
        var posPercentage = false;

        if (percentage === true) {
          sizePercentage = true;
          posPercentage = true;
        } else if (percentage) {
          if (percentage.indexOf("position") > -1) {
            posPercentage = true;
          }

          if (percentage.indexOf("size") > -1) {
            sizePercentage = true;
          }
        }

        this.posPercetage = posPercentage;
        this.sizePercetage = sizePercentage;
      };

      __proto._updateItem = function (item) {
        var _a = this.options,
            isEqualSize = _a.isEqualSize,
            isConstantSize = _a.isConstantSize,
            useRoundedSize = _a.useRoundedSize;
        var initialRect = this.initialRect;
        var orgRect = item.orgRect,
            element = item.element;
        var isLoading = item.updateState === UPDATE_STATE.WAIT_LOADING;
        var hasOrgSize = orgRect && orgRect.width && orgRect.height;
        var rect;

        if (isEqualSize && initialRect) {
          rect = initialRect;
        } else if (isConstantSize && hasOrgSize && !isLoading) {
          rect = orgRect;
        } else if (!element) {
          return;
        } else {
          rect = {
            left: element.offsetLeft,
            top: element.offsetTop,
            width: 0,
            height: 0
          };

          if (useRoundedSize) {
            rect.width = element.offsetWidth;
            rect.height = element.offsetHeight;
          } else {
            var clientRect = element.getBoundingClientRect();
            rect.width = clientRect.width;
            rect.height = clientRect.height;
          }
        }

        if (!item.isFirstUpdate || !hasOrgSize) {
          item.orgRect = __assign$1({}, rect);
        }

        item.rect = __assign$1({}, rect);

        if (item.element) {
          item.mountState = MOUNT_STATE.MOUNTED;
        }

        if (item.updateState === UPDATE_STATE.NEED_UPDATE) {
          item.updateState = UPDATE_STATE.UPDATED;
          item.isFirstUpdate = true;
        }

        item.attributes = element ? getDataAttributes(element, this.options.attributePrefix) : {};

        if (!isLoading) {
          this.initialRect = __assign$1({}, rect);
        }

        return rect;
      };

      __proto._renderItem = function (item) {
        var element = item.element;
        var cssRect = item.cssRect;

        if (!element || !cssRect) {
          return;
        }

        var _a = this.options,
            horizontal = _a.horizontal,
            useTransform = _a.useTransform;
        var posPercentage = this.posPercetage;
        var sizePercentage = this.sizePercetage;
        var cssTexts = ["position: absolute;"];
        var _b = RECT_NAMES[horizontal ? "horizontal" : "vertical"],
            sizeName = _b.inlineSize,
            posName = _b.inlinePos;
        var inlineSize = this.getInlineSize();
        var keys = getKeys(cssRect);

        if (useTransform) {
          keys = keys.filter(function (key) {
            return key !== "top" && key !== "left";
          });
          cssTexts.push("transform: " + ("translate(" + (cssRect.left || 0) + "px, " + (cssRect.top || 0) + "px);"));
        }

        cssTexts.push.apply(cssTexts, keys.map(function (name) {
          var value = cssRect[name];

          if (name === sizeName && sizePercentage || name === posName && posPercentage) {
            return name + ": " + value / inlineSize * 100 + "%;";
          }

          return name + ": " + value + "px;";
        }));
        element.style.cssText += cssTexts.join("");
      };

      return ItemRenderer;
    }();

    /**
     * @memberof Grid
     * @implements Grid.GridItem.GridItemStatus
     */

    var GridItem =
    /*#__PURE__*/
    function () {
      /**
       * @constructor
       * @param horizontal - Direction of the scroll movement. (true: horizontal, false: vertical) <ko>스크롤 이동 방향. (true: 가로방향, false: 세로방향)</ko>
       * @param itemStatus - Default status object of GridItem module. <ko>GridItem 모듈의 기본 status 객체.</ko>
       */
      function GridItem(horizontal, itemStatus) {
        if (itemStatus === void 0) {
          itemStatus = {};
        }

        var _a;

        this.horizontal = horizontal;
        this.isUpdate = false;
        this.hasTransition = false;
        this.transitionDuration = "";
        var element = itemStatus.element;

        var status = __assign$1({
          key: "",
          orgRect: {
            left: 0,
            top: 0,
            width: 0,
            height: 0
          },
          rect: {
            left: 0,
            top: 0,
            width: 0,
            height: 0
          },
          cssRect: {},
          attributes: {},
          data: {},
          isFirstUpdate: false,
          mountState: MOUNT_STATE.UNCHECKED,
          updateState: UPDATE_STATE.NEED_UPDATE,
          element: element || null,
          orgCSSText: (_a = element === null || element === void 0 ? void 0 : element.style.cssText) !== null && _a !== void 0 ? _a : "",
          gridData: {}
        }, itemStatus);

        for (var name in status) {
          this[name] = status[name];
        }
      }

      var __proto = GridItem.prototype;
      Object.defineProperty(__proto, "orgInlineSize", {
        /**
         * The size in inline direction before first rendering. "width" if horizontal is false, "height" otherwise.
         * @ko 첫 렌더링 되기 전의 inline 방향의 사이즈. horizontal이 false면 "width", 아니면 "height".
         * @member Grid.GridItem#orgInlineSize
         */
        get: function () {
          var name = this._names.inlineSize;
          return this.orgRect[name] || this.rect[name];
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(__proto, "orgContentSize", {
        /**
         * The size in content direction before first rendering. "height" if horizontal is false, "width" otherwise.
         * @ko 첫 렌더링 되기 전의 content 방향의 사이즈. horizontal이 false면 "height", 아니면 "width".
         * @member Grid.GridItem#orgContentSize
         */
        get: function () {
          var name = this._names.contentSize;
          return this.orgRect[name] || this.rect[name];
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(__proto, "inlineSize", {
        /**
         * The size in inline direction. "width" if horizontal is false, "height" otherwise.
         * @ko inline 방향의 사이즈. horizontal이 false면 "width", 아니면 "height".
         * @member Grid.GridItem#inlineSize
         */
        get: function () {
          return this.rect[this._names.inlineSize];
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(__proto, "contentSize", {
        /**
         * The size in content direction. "height" if horizontal is false, "width" otherwise.
         * @ko content 방향의 사이즈. horizontal이 false면 "height", 아니면 "width".
         * @member Grid.GridItem#contentSize
         */
        get: function () {
          return this.rect[this._names.contentSize];
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(__proto, "cssInlineSize", {
        /**
         * The CSS size in inline direction applied to the Grid. "width" if horizontal is false, "height" otherwise.
         * @ko Grid에 적용된 inline 방향의 CSS 사이즈. horizontal이 false면 "width", 아니면 "height".
         * @member Grid.GridItem#cssInlineSize
         */
        get: function () {
          return this.cssRect[this._names.inlineSize];
        },
        set: function (inlineSize) {
          this.cssRect[this._names.inlineSize] = inlineSize;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(__proto, "cssContentSize", {
        /**
         * The CSS size in content direction applied to the Grid. "height" if horizontal is false, "width" otherwise.
         * @ko Grid에 적용된 content 방향의 CSS 사이즈. horizontal이 false면 "height", 아니면 "width".
         * @member Grid.GridItem#cssContentSize
         */
        get: function () {
          return this.cssRect[this._names.contentSize];
        },
        set: function (contentSize) {
          this.cssRect[this._names.contentSize] = contentSize;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(__proto, "cssInlinePos", {
        /**
         * The CSS pos in inline direction applied to the Grid. "left" if horizontal is false, "top" otherwise.
         * @ko Grid에 적용된 inline 방향의 CSS 포지션. horizontal이 false면 "left", 아니면 "top".
         * @member Grid.GridItem#cssInlinePos
         */
        get: function () {
          return this.cssRect[this._names.inlinePos];
        },
        set: function (inlinePos) {
          this.cssRect[this._names.inlinePos] = inlinePos;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(__proto, "cssContentPos", {
        /**
         * The CSS pos in content direction applied to the Grid. "top" if horizontal is false, "left" otherwise.
         * @ko Grid에 적용된 content 방향의 CSS 포지션. horizontal이 false면 "top", 아니면 "left".
         * @member Grid.GridItem#cssContentPos
         */
        get: function () {
          return this.cssRect[this._names.contentPos];
        },
        set: function (contentPos) {
          this.cssRect[this._names.contentPos] = contentPos;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(__proto, "computedInlineSize", {
        /**
         * Calculated size in the direction of the inline applied to the grid. "width" if horizontal is false, "height" otherwise.
         * @ko Grid에 적용된 inline 방향의 계산된 사이즈. horizontal이 false면 "width", 아니면 "height".
         * @member Grid.GridItem#computedInlineSize
         */
        get: function () {
          var name = this._names.inlineSize;
          return this.cssRect[name] || this.rect[name] || this.orgRect[name];
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(__proto, "computedContentSize", {
        /**
         * Calculated size in the direction of the content applied to the grid. "height" if horizontal is false, "width" otherwise.
         * @ko Grid에 적용된 content 방향의 계산된 사이즈. horizontal이 false면 "height", 아니면 "width".
         * @member Grid.GridItem#computedContentSize
         */
        get: function () {
          var name = this._names.contentSize;
          return this.cssRect[name] || this.rect[name] || this.orgRect[name];
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(__proto, "computedInlinePos", {
        /**
         * Calculated position in the direction of the inline applied to the grid. "left" if horizontal is false, "top" otherwise.
         * @ko Grid에 적용된 content 방향의 계산된 포지션. horizontal이 false면 "left", 아니면 "top".
         * @member Grid.GridItem#computedInlinePos
         */
        get: function () {
          var _a;

          var name = this._names.inlinePos;
          return (_a = this.cssRect[name]) !== null && _a !== void 0 ? _a : this.rect[name];
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(__proto, "computedContentPos", {
        /**
         * Calculated position in the direction of the content applied to the grid. "top" if horizontal is false, "left" otherwise.
         * @ko Grid에 적용된 content 방향의 계산된 포지션. horizontal이 false면 "top", 아니면 "left".
         * @member Grid.GridItem#computedContentPos
         */
        get: function () {
          var _a;

          var name = this._names.contentPos;
          return (_a = this.cssRect[name]) !== null && _a !== void 0 ? _a : this.rect[name];
        },
        enumerable: false,
        configurable: true
      });
      /**
       * Set CSS Rect through GridRect.
       * @ko GridRect을 통해 CSS Rect를 설정한다.
       * @param - The style for setting CSS rect. <ko>CSS rect를 설정하기 위한 스타일.</ko>
       */

      __proto.setCSSGridRect = function (gridRect) {
        var names = RECT_NAMES[this.horizontal ? "horizontal" : "vertical"];
        var rect = {};

        for (var name in gridRect) {
          rect[names[name]] = gridRect[name];
        }

        this.cssRect = rect;
      };
      /**
       * Returns the status of the item.
       * @ko 아이템의 상태를 반환한다.
       */


      __proto.getStatus = function () {
        return {
          mountState: this.mountState,
          updateState: this.updateState,
          attributes: this.attributes,
          orgCSSText: this.orgCSSText,
          isFirstUpdate: this.isFirstUpdate,
          element: null,
          key: this.key,
          orgRect: this.orgRect,
          rect: this.rect,
          cssRect: this.cssRect,
          gridData: this.gridData,
          data: this.data
        };
      };
      /**
       * Returns minimized status of the item.
       * @ko 아이템의 간소화된 상태를 반환한다.
       */


      __proto.getMinimizedStatus = function () {
        var status = {
          orgRect: this.orgRect,
          rect: this.rect,
          cssRect: this.cssRect,
          attributes: this.attributes,
          gridData: this.gridData
        };

        var _a = this,
            key = _a.key,
            mountState = _a.mountState,
            updateState = _a.updateState,
            isFirstUpdate = _a.isFirstUpdate,
            orgCSSText = _a.orgCSSText;

        if (typeof key !== "undefined") {
          status.key = key;
        }

        if (mountState !== MOUNT_STATE.UNCHECKED) {
          status.mountState = mountState;
        }

        if (updateState !== UPDATE_STATE.NEED_UPDATE) {
          status.updateState = updateState;
        }

        if (isFirstUpdate) {
          status.isFirstUpdate = true;
        }

        if (orgCSSText) {
          status.orgCSSText = orgCSSText;
        }

        return status;
      };

      Object.defineProperty(__proto, "_names", {
        get: function () {
          return this.horizontal ? RECT_NAMES.horizontal : RECT_NAMES.vertical;
        },
        enumerable: false,
        configurable: true
      });
      return GridItem;
    }();

    /**
     * @extends eg.Component
     */

    var Grid =
    /*#__PURE__*/
    function (_super) {
      __extends$1(Grid, _super);
      /**
       * @param - A base element for a module <ko>모듈을 적용할 기준 엘리먼트</ko>
       * @param - The option object of the Grid module <ko>Grid 모듈의 옵션 객체</ko>
       */


      function Grid(containerElement, options) {
        if (options === void 0) {
          options = {};
        }

        var _this = _super.call(this) || this;

        _this.items = [];
        _this.outlines = {
          start: [],
          end: []
        };
        _this._renderTimer = 0;

        _this._onResize = function () {
          _this.renderItems({
            useResize: true
          });
        };

        _this.options = __assign$1(__assign$1({}, _this.constructor.defaultOptions), options);
        _this.containerElement = isString$1(containerElement) ? document.querySelector(containerElement) : containerElement;
        var _a = _this.options,
            isEqualSize = _a.isEqualSize,
            isConstantSize = _a.isConstantSize,
            useTransform = _a.useTransform,
            horizontal = _a.horizontal,
            percentage = _a.percentage,
            externalContainerManager = _a.externalContainerManager,
            externalItemRenderer = _a.externalItemRenderer,
            resizeDebounce = _a.resizeDebounce,
            maxResizeDebounce = _a.maxResizeDebounce,
            autoResize = _a.autoResize,
            useRoundedSize = _a.useRoundedSize; // TODO: 테스트용 설정

        _this.containerManager = externalContainerManager || new ContainerManager(_this.containerElement, {
          horizontal: horizontal,
          resizeDebounce: resizeDebounce,
          maxResizeDebounce: maxResizeDebounce,
          autoResize: autoResize
        }).on("resize", _this._onResize);
        _this.itemRenderer = externalItemRenderer || new ItemRenderer({
          useTransform: useTransform,
          isEqualSize: isEqualSize,
          isConstantSize: isConstantSize,
          percentage: percentage,
          useRoundedSize: useRoundedSize
        });

        _this._init();

        return _this;
      }

      var __proto = Grid.prototype;
      /**
       * Return Container Element.
       * @ko 컨테이너 엘리먼트를 반환한다.
       */

      __proto.getContainerElement = function () {
        return this.containerElement;
      };
      /**
       * Return items.
       * @ko 아이템들을 반환한다.
       */


      __proto.getItems = function () {
        return this.items;
      };
      /**
       * Returns the children of the container element.
       * @ko 컨테이너 엘리먼트의 children을 반환한다.
       */


      __proto.getChildren = function () {
        return [].slice.call(this.containerElement.children);
      };
      /**
       * Set items.
       * @ko 아이템들을 설정한다.
       * @param items - The items to set. <ko>설정할 아이템들</ko>
       */


      __proto.setItems = function (items) {
        this.items = items;
        return this;
      };
      /**
       * Gets the container's inline size. ("width" if horizontal is false, otherwise "height")
       * @ko container의 inline 사이즈를 가져온다. (horizontal이 false면 "width", 아니면 "height")
       */


      __proto.getContainerInlineSize = function () {
        return this.containerManager.getInlineSize();
      };
      /**
       * Returns the outlines of the start and end of the Grid.
       * @ko Grid의 처음과 끝의 outline을 반환한다.
       */


      __proto.getOutlines = function () {
        return this.outlines;
      };
      /**
       * Set outlines.
       * @ko 아웃라인을 설정한다.
       * @param outlines - The outlines to set. <ko>설정할 아웃라인.</ko>
       */


      __proto.setOutlines = function (outlines) {
        this.outlines = outlines;
        return this;
      };
      /**
       * When elements change, it synchronizes and renders items.
       * @ko elements가 바뀐 경우 동기화를 하고 렌더링을 한다.
       * @param - Options for rendering. <ko>렌더링을 하기 위한 옵션.</ko>
       */


      __proto.syncElements = function (options) {
        if (options === void 0) {
          options = {};
        }

        var items = this.items;
        var horizontal = this.options.horizontal;
        var elements = this.getChildren();

        var _a = diff(this.items.map(function (item) {
          return item.element;
        }), elements),
            added = _a.added,
            maintained = _a.maintained,
            changed = _a.changed,
            removed = _a.removed;

        var nextItems = [];
        maintained.forEach(function (_a) {
          var beforeIndex = _a[0],
              afterIndex = _a[1];
          nextItems[afterIndex] = items[beforeIndex];
        });
        added.forEach(function (index) {
          nextItems[index] = new GridItem(horizontal, {
            element: elements[index]
          });
        });
        this.setItems(nextItems);

        if (added.length || removed.length || changed.length) {
          this.renderItems(options);
        }

        return this;
      };
      /**
       * Update the size of the items and render them.
       * @ko 아이템들의 사이즈를 업데이트하고 렌더링을 한다.
       * @param - Items to be updated. <ko>업데이트할 아이템들.</ko>
       * @param - Options for rendering. <ko>렌더링을 하기 위한 옵션.</ko>
       */


      __proto.updateItems = function (items, options) {
        if (items === void 0) {
          items = this.items;
        }

        if (options === void 0) {
          options = {};
        }

        var useOrgResize = options.useOrgResize;
        items.forEach(function (item) {
          if (useOrgResize) {
            var orgRect = item.orgRect;
            orgRect.width = 0;
            orgRect.height = 0;
          }

          item.updateState = UPDATE_STATE.NEED_UPDATE;
        });
        this.checkReady(options);
        return this;
      };
      /**
       * Rearrange items to fit the grid and render them. When rearrange is complete, the `renderComplete` event is fired.
       * @ko grid에 맞게 아이템을 재배치하고 렌더링을 한다. 배치가 완료되면 `renderComplete` 이벤트가 발생한다.
       * @param - Options for rendering. <ko>렌더링을 하기 위한 옵션.</ko>
       * @example
       * ```js
       * import { MasonryGrid } from "@egjs/grid";
       * const grid = new MasonryGrid();
       *
       * grid.on("renderComplete", e => {
       *   console.log(e);
       * });
       * grid.renderItems();
       * ```
       */


      __proto.renderItems = function (options) {
        if (options === void 0) {
          options = {};
        }

        this._clearRenderTimer();

        if (!this.getItems().length && this.getChildren().length) {
          this.syncElements(options);
        } else if (options.useResize || options.useOrgResize) {
          // Resize container and Update all items
          this._resizeContainer();

          this.updateItems(this.items, options);
        } else {
          // Update only items that need to be updated.
          this.checkReady(options);
        }

        return this;
      };
      /**
       * Returns current status such as item's position, size. The returned status can be restored with the setStatus() method.
       * @ko 아이템의 위치, 사이즈 등 현재 상태를 반환한다. 반환한 상태는 setStatus() 메서드로 복원할 수 있다.
       * @param - Whether to minimize the status of the item. (default: false) <ko>item의 status를 최소화할지 여부. (default: false)</ko>
       */


      __proto.getStatus = function (minimize) {
        return {
          outlines: this.outlines,
          items: this.items.map(function (item) {
            return minimize ? item.getMinimizedStatus() : item.getStatus();
          }),
          containerManager: this.containerManager.getStatus(),
          itemRenderer: this.itemRenderer.getStatus()
        };
      };
      /**
       * Set status of the Grid module with the status returned through a call to the getStatus() method.
       * @ko getStatus() 메서드에 대한 호출을 통해 반환된 상태로 Grid 모듈의 상태를 설정한다.
       */


      __proto.setStatus = function (status) {
        var _this = this;

        var horizontal = this.options.horizontal;
        var containerManager = this.containerManager;
        var prevInlineSize = containerManager.getInlineSize();
        var children = this.getChildren();
        this.itemRenderer.setStatus(status.itemRenderer);
        containerManager.setStatus(status.containerManager);
        this.outlines = status.outlines;
        this.items = status.items.map(function (item, i) {
          return new GridItem(horizontal, __assign$1(__assign$1({}, item), {
            element: children[i]
          }));
        });
        this.itemRenderer.renderItems(this.items);

        if (prevInlineSize !== containerManager.getInlineSize()) {
          this.renderItems({
            useResize: true
          });
        } else {
          window.setTimeout(function () {
            _this._renderComplete({
              direction: _this.defaultDirection,
              mounted: _this.items,
              updated: [],
              isResize: false
            });
          });
        }

        return this;
      };
      /**
       * Get the inline size corresponding to outline.
       * @ko outline에 해당하는 inline 사이즈를 구한다.
       * @param items - Items to get outline size. <ko>outline 사이즈를 구하기 위한 아이템들.</ko>
       */
      // eslint-disable-next-line @typescript-eslint/no-unused-vars


      __proto.getComputedOutlineSize = function (items) {

        return this.options.outlineSize || this.getContainerInlineSize();
      };
      /**
       * Get the length corresponding to outline.
       * @ko outline에 해당하는 length를 가져온다.
       * @param items - Items to get outline length. <ko>outline length를 구하기 위한 아이템들.</ko>
       */
      // eslint-disable-next-line @typescript-eslint/no-unused-vars


      __proto.getComputedOutlineLength = function (items) {

        return this.options.outlineLength || 1;
      };
      /**
       * Releases the instnace and events and returns the CSS of the container and elements.
       * @ko 인스턴스와 이벤트를 해제하고 컨테이너와 엘리먼트들의 CSS를 되돌린다.
       * @param Options for destroy. <ko>destory()를 위한 옵션</ko>
       */


      __proto.destroy = function (options) {
        var _a;

        if (options === void 0) {
          options = {};
        }

        var _b = options.preserveUI,
            preserveUI = _b === void 0 ? this.options.preserveUIOnDestroy : _b;
        this.containerManager.destroy({
          preserveUI: preserveUI
        });

        if (!preserveUI) {
          this.items.forEach(function (_a) {
            var element = _a.element,
                orgCSSText = _a.orgCSSText;

            if (element) {
              element.style.cssText = orgCSSText;
            }
          });
        }

        (_a = this._im) === null || _a === void 0 ? void 0 : _a.destroy();
      };

      __proto.checkReady = function (options) {
        var _this = this;

        var _a;

        if (options === void 0) {
          options = {};
        } // Grid: renderItems => checkReady => readyItems => applyGrid


        var items = this.items;
        var updated = items.filter(function (item) {
          var _a;

          return ((_a = item.element) === null || _a === void 0 ? void 0 : _a.parentNode) && item.updateState !== UPDATE_STATE.UPDATED;
        });
        var mounted = updated.filter(function (item) {
          return item.mountState !== MOUNT_STATE.MOUNTED;
        });
        var moreUpdated = [];
        mounted.filter(function (item) {
          if (item.hasTransition) {
            return true;
          } else {
            var element = item.element;
            var transitionDuration = parseFloat(getComputedStyle(element).transitionDuration);

            if (transitionDuration > 0) {
              item.hasTransition = true;
              item.transitionDuration = element.style.transitionDuration;
              return true;
            }
          }

          return false;
        }).forEach(function (item) {
          item.element.style.transitionDuration = "0s";
        });
        (_a = this._im) === null || _a === void 0 ? void 0 : _a.destroy();
        this._im = new ImReady$1({
          prefix: this.options.attributePrefix
        }).on("preReadyElement", function (e) {
          updated[e.index].updateState = UPDATE_STATE.WAIT_LOADING;
        }).on("preReady", function () {
          // reset org size
          updated.forEach(function (item) {
            var hasOrgSize = item.orgRect.width && item.orgRect.height;
            var hasCSSSize = item.cssRect.width || item.cssRect.height;

            if (!hasOrgSize && hasCSSSize) {
              item.element.style.cssText = item.orgCSSText;
            }
          });

          _this.itemRenderer.updateItems(updated);

          _this.readyItems(mounted, updated, options);
        }).on("readyElement", function (e) {
          var item = updated[e.index];
          item.updateState = UPDATE_STATE.NEED_UPDATE; // after preReady

          if (e.isPreReadyOver) {
            item.element.style.cssText = item.orgCSSText;

            _this.itemRenderer.updateItems([item]);

            _this.readyItems([], [item], options);
          }
        }).on("error", function (e) {
          var item = items[e.index];
          /**
           * This event is fired when an error occurs in the content.
           * @ko 콘텐츠 로드에 에러가 날 때 발생하는 이벤트.
           * @event Grid#contentError
           * @param {Grid.OnContentError} e - The object of data to be sent to an event <ko>이벤트에 전달되는 데이터 객체</ko>
           * @example
           * ```js
           * grid.on("contentError", e => {
           *   e.update();
           * });
           * ```
          */

          _this.trigger("contentError", {
            element: e.element,
            target: e.target,
            item: item,
            update: function () {
              moreUpdated.push(item);
            }
          });
        }).on("ready", function () {
          if (moreUpdated.length) {
            _this.updateItems(moreUpdated);
          }
        }).check(updated.map(function (item) {
          return item.element;
        }));
      };

      __proto.scheduleRender = function () {
        var _this = this;

        this._clearRenderTimer();

        this._renderTimer = window.setTimeout(function () {
          _this.renderItems();
        });
      };

      __proto.fitOutlines = function (useFit) {
        if (useFit === void 0) {
          useFit = this.useFit;
        }

        var outlines = this.outlines;
        var startOutline = outlines.start;
        var endOutline = outlines.end;
        var outlineOffset = startOutline.length ? Math.min.apply(Math, startOutline) : 0; // If the outline is less than 0, a fit occurs forcibly.

        if (!useFit && outlineOffset > 0) {
          return;
        }

        outlines.start = startOutline.map(function (point) {
          return point - outlineOffset;
        });
        outlines.end = endOutline.map(function (point) {
          return point - outlineOffset;
        });
        this.items.forEach(function (item) {
          var contentPos = item.cssContentPos;

          if (!isNumber$1(contentPos)) {
            return;
          }

          item.cssContentPos = contentPos - outlineOffset;
        });
      };

      __proto.readyItems = function (mounted, updated, options) {
        var prevOutlines = this.outlines;
        var direction = options.direction || this.options.defaultDirection;
        var prevOutline = options.outline || prevOutlines[direction === "end" ? "start" : "end"];
        var items = this.items;
        var nextOutlines = {
          start: __spreadArrays$1(prevOutline),
          end: __spreadArrays$1(prevOutline)
        };
        updated.forEach(function (item) {
          item.isUpdate = true;
        });

        if (items.length) {
          nextOutlines = this.applyGrid(this.items, direction, prevOutline);
        }

        updated.forEach(function (item) {
          item.isUpdate = false;
        });
        this.setOutlines(nextOutlines);
        this.fitOutlines();
        this.itemRenderer.renderItems(this.items);

        this._refreshContainerContentSize();

        var transitionMounted = mounted.filter(function (item) {
          return item.hasTransition;
        });

        if (transitionMounted.length) {
          this.containerManager.resize();
          transitionMounted.forEach(function (item) {
            var element = item.element;
            element.style.transitionDuration = item.transitionDuration;
          });
        }

        this._renderComplete({
          direction: direction,
          mounted: mounted,
          updated: updated,
          isResize: !!options.useResize
        });
      };

      __proto._renderComplete = function (e) {
        /**
         * This event is fired when the Grid has completed rendering.
         * @ko Grid가 렌더링이 완료됐을 때  발생하는 이벤트이다.
         * @event Grid#renderComplete
         * @param {Grid.OnRenderComplete} e - The object of data to be sent to an event <ko>이벤트에 전달되는 데이터 객체</ko>
         * @example
         * ```js
         * grid.on("renderComplete", e => {
         *   console.log(e.mounted, e.updated, e.useResize);
         * });
         * ```
         */
        this.trigger("renderComplete", e);
      };

      __proto._clearRenderTimer = function () {
        clearTimeout(this._renderTimer);
        this._renderTimer = 0;
      };

      __proto._refreshContainerContentSize = function () {
        var _a = this.outlines,
            startOutline = _a.start,
            endOutline = _a.end;
        var gap = this.options.gap;
        var endPoint = endOutline.length ? Math.max.apply(Math, endOutline) : 0;
        var startPoint = startOutline.length ? Math.max.apply(Math, startOutline) : 0;
        var contentSize = Math.max(startPoint, endPoint - gap);
        this.containerManager.setContentSize(contentSize);
      };

      __proto._resizeContainer = function () {
        this.containerManager.resize();
        this.itemRenderer.setContainerRect(this.containerManager.getRect());
      };

      __proto._init = function () {
        this._resizeContainer();
      };
      Grid.defaultOptions = DEFAULT_GRID_OPTIONS;
      Grid.propertyTypes = GRID_PROPERTY_TYPES;
      Grid = __decorate$1([GetterSetter], Grid);
      return Grid;
    }(Component);
    /**
     * Gap used to create space around items.
     * @ko 아이템들 사이의 공간.
     * @name Grid#gap
     * @type {$ts:Grid.GridOptions["gap"]}
     * @default 0
     * @example
     * ```js
     * import { MasonryGrid } from "@egjs/grid";
     *
     * const grid = new MasonryGrid(container, {
     *   gap: 0,
     * });
     *
     * grid.gap = 5;
     * ```
     */

    /**
     * The default direction value when direction is not set in the render option.
     * @ko render옵션에서 direction을 미설정시의 기본 방향값.
     * @name Grid#defaultDirection
     * @type {$ts:Grid.GridOptions["defaultDirection"]}
     * @default "end"
     * @example
     * ```js
     * import { MasonryGrid } from "@egjs/grid";
     *
     * const grid = new MasonryGrid(container, {
     *   defaultDirection: "end",
     * });
     *
     * grid.defaultDirection = "start";
     * ```
     */

    /**
     * Whether to move the outline to 0 when the top is empty when rendering. However, if it overflows above the top, the outline is forced to 0. (default: true)
     * @ko 렌더링시 상단이 비어있을 때 아웃라인을 0으로 이동시킬지 여부. 하지만 상단보다 넘치는 경우 아웃라인을 0으로 강제 이동한다. (default: true)
     * @name Grid#useFit
     * @type {$ts:Grid.GridOptions["useFit"]}
     * @default true
     * @example
     * ```js
     * import { MasonryGrid } from "@egjs/grid";
     *
     * const grid = new MasonryGrid(container, {
     *   useFit: true,
     * });
     *
     * grid.useFit = false;
     * ```
     */

    /**
     * Whether to preserve the UI of the existing container or item when destroying.
     * @ko destroy 시 기존 컨테이너, 아이템의 UI를 보존할지 여부.
     * @name Grid#preserveUIOnDestroy
     * @type {$ts:Grid.GridOptions["preserveUIOnDestroy"]}
     * @default false
     * @example
     * ```js
     * import { MasonryGrid } from "@egjs/grid";
     *
     * const grid = new MasonryGrid(container, {
     *   preserveUIOnDestroy: false,
     * });
     *
     * grid.preserveUIOnDestroy = true;
     * ```
     */

    /**
     * The number of outlines. If the number of outlines is 0, it is calculated according to the type of grid.
     * @ko outline의 개수. 아웃라인의 개수가 0이라면 grid의 종류에 따라 계산이 된다.
     * @name Grid#outlineLength
     * @type {$ts:Grid.GridOptions["outlineLength"]}
     * @default 0
     * @example
     * ```js
     * import { MasonryGrid } from "@egjs/grid";
     *
     * const grid = new MasonryGrid(container, {
     *   outlineLength: 0,
     *   outlineSize: 0,
     * });
     *
     * grid.outlineLength = 3;
     * ```
     */

    /**
     * The size of the outline. If the outline size is 0, it is calculated according to the grid type.
     * @ko outline의 사이즈. 만약 outline의 사이즈가 0이면, grid의 종류에 따라 계산이 된다.
     * @name Grid#outlineSize
     * @type {$ts:Grid.GridOptions["outlineSize"]}
     * @default 0
     * @example
     * ```js
     * import { MasonryGrid } from "@egjs/grid";
     *
     * const grid = new MasonryGrid(container, {
     *   outlineLength: 0,
     *   outlineSize: 0,
     * });
     *
     * grid.outlineSize = 300;
     * ```
     */

    function getColumnPoint(outline, columnIndex, columnCount, pointCaculationName) {
      return Math[pointCaculationName].apply(Math, outline.slice(columnIndex, columnIndex + columnCount));
    }

    function getColumnIndex(outline, columnCount, nearestCalculationName) {
      var length = outline.length - columnCount + 1;
      var pointCaculationName = nearestCalculationName === "max" ? "min" : "max";
      var indexCaculationName = nearestCalculationName === "max" ? "lastIndexOf" : "indexOf";
      var points = range$1(length).map(function (index) {
        return getColumnPoint(outline, index, columnCount, pointCaculationName);
      });
      return points[indexCaculationName](Math[nearestCalculationName].apply(Math, points));
    }
    /**
     * MasonryGrid is a grid that stacks items with the same width as a stack of bricks. Adjust the width of all images to the same size, find the lowest height column, and insert a new item.
     * @ko MasonryGrid는 벽돌을 쌓아 올린 모양처럼 동일한 너비를 가진 아이템를 쌓는 레이아웃이다. 모든 이미지의 너비를 동일한 크기로 조정하고, 가장 높이가 낮은 열을 찾아 새로운 이미지를 삽입한다. 따라서 배치된 아이템 사이에 빈 공간이 생기지는 않지만 배치된 레이아웃의 아래쪽은 울퉁불퉁해진다.
     * @memberof Grid
     * @param {HTMLElement | string} container - A base element for a module <ko>모듈을 적용할 기준 엘리먼트</ko>
     * @param {Grid.MasonryGrid.MasonryGridOptions} options - The option object of the MasonryGrid module <ko>MasonryGrid 모듈의 옵션 객체</ko>
     */


    var MasonryGrid =
    /*#__PURE__*/
    function (_super) {
      __extends$1(MasonryGrid, _super);

      function MasonryGrid() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = MasonryGrid.prototype;

      __proto.applyGrid = function (items, direction, outline) {
        var columnSize = this.getComputedOutlineSize(items);
        var column = this.getComputedOutlineLength(items);
        var _a = this.options,
            gap = _a.gap,
            align = _a.align,
            columnSizeRatio = _a.columnSizeRatio;
        var outlineLength = outline.length;
        var itemsLength = items.length;

        var alignPoses = this._getAlignPoses(column, columnSize);

        var isEndDirection = direction === "end";
        var nearestCalculationName = isEndDirection ? "min" : "max";
        var pointCalculationName = isEndDirection ? "max" : "min";
        var startOutline = [0];

        if (outlineLength === column) {
          startOutline = outline.slice();
        } else {
          var point_1 = outlineLength ? Math[pointCalculationName].apply(Math, outline) : 0;
          startOutline = range$1(column).map(function () {
            return point_1;
          });
        }

        var endOutline = startOutline.slice();
        var columnDist = column > 1 ? alignPoses[1] - alignPoses[0] : 0;
        var isStretch = align === "stretch";

        var _loop_1 = function (i) {
          var item = items[isEndDirection ? i : itemsLength - 1 - i];
          var columnAttribute = parseInt(item.attributes.column || "1", 10);
          var maxColumnAttribute = parseInt(item.attributes.maxColumn || "1", 10);
          var contentSize = item.contentSize;
          var columnCount = Math.min(column, columnAttribute || Math.max(1, Math.ceil((item.inlineSize + gap) / columnDist)));
          var maxColumnCount = Math.min(column, Math.max(columnCount, maxColumnAttribute));
          var columnIndex = getColumnIndex(endOutline, columnCount, nearestCalculationName);
          var contentPos = getColumnPoint(endOutline, columnIndex, columnCount, pointCalculationName);

          while (columnCount < maxColumnCount) {
            var nextEndColumnIndex = columnIndex + columnCount;
            var nextColumnIndex = columnIndex - 1;

            if (isEndDirection && (nextEndColumnIndex >= column || endOutline[nextEndColumnIndex] > contentPos)) {
              break;
            }

            if (!isEndDirection && (nextColumnIndex < 0 || endOutline[nextColumnIndex]) < contentPos) {
              break;
            }

            if (!isEndDirection) {
              --columnIndex;
            }

            ++columnCount;
          }

          columnIndex = Math.max(0, columnIndex);
          columnCount = Math.min(column - columnIndex, columnCount); // stretch mode or data-grid-column > "1"

          if (columnAttribute > 0 && columnCount > 1 || isStretch) {
            item.cssInlineSize = (columnCount - 1) * columnDist + columnSize;
          }

          if (columnSizeRatio > 0) {
            contentSize = item.computedInlineSize / columnSizeRatio;
            item.cssContentSize = contentSize;
          }

          var inlinePos = alignPoses[columnIndex];
          contentPos = isEndDirection ? contentPos : contentPos - gap - contentSize;
          item.cssInlinePos = inlinePos;
          item.cssContentPos = contentPos;
          var nextOutlinePoint = isEndDirection ? contentPos + contentSize + gap : contentPos;
          range$1(columnCount).forEach(function (indexOffset) {
            endOutline[columnIndex + indexOffset] = nextOutlinePoint;
          });
        };

        for (var i = 0; i < itemsLength; ++i) {
          _loop_1(i);
        } // if end items, startOutline is low, endOutline is high
        // if start items, startOutline is high, endOutline is low


        return {
          start: isEndDirection ? startOutline : endOutline,
          end: isEndDirection ? endOutline : startOutline
        };
      };

      __proto.getComputedOutlineSize = function (items) {
        if (items === void 0) {
          items = this.items;
        }

        var _a = this.options,
            gap = _a.gap,
            align = _a.align;
        var columnSizeOption = this.columnSize || this.outlineSize;
        var column = this.column || this.outlineLength || 1;
        var columnSize = 0;

        if (align === "stretch") {
          columnSize = (this.getContainerInlineSize() + gap) / (column || 1) - gap;
        } else if (columnSizeOption) {
          columnSize = columnSizeOption;
        } else if (items.length) {
          var checkedItem = items[0];

          for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            var attributes = item.attributes;

            if (item.updateState !== UPDATE_STATE.UPDATED || !item.inlineSize || attributes.column || attributes.maxColumnCount) {
              continue;
            }

            checkedItem = item;
            break;
          }

          var inlineSize = checkedItem.inlineSize || 0;
          columnSize = inlineSize;
        } else {
          columnSize = this.getContainerInlineSize();
        }

        return columnSize || 0;
      };

      __proto.getComputedOutlineLength = function (items) {
        if (items === void 0) {
          items = this.items;
        }

        var gap = this.gap;
        var columnOption = this.column || this.outlineLength;
        var columnCalculationThreshold = this.columnCalculationThreshold;
        var column = 1;

        if (columnOption) {
          column = columnOption;
        } else {
          var columnSize = this.getComputedOutlineSize(items);
          column = Math.min(items.length, Math.max(1, Math.floor((this.getContainerInlineSize() + gap) / (columnSize - columnCalculationThreshold + gap))));
        }

        return column;
      };

      __proto._getAlignPoses = function (column, columnSize) {
        var _a = this.options,
            align = _a.align,
            gap = _a.gap;
        var containerSize = this.getContainerInlineSize();
        var indexes = range$1(column);
        var offset = 0;
        var dist = 0;

        if (align === "justify" || align === "stretch") {
          var countDist = column - 1;
          dist = countDist ? Math.max((containerSize - columnSize) / countDist, columnSize + gap) : 0;
          offset = Math.min(0, containerSize / 2 - (countDist * dist + columnSize) / 2);
        } else {
          dist = columnSize + gap;
          var totalColumnSize = (column - 1) * dist + columnSize;

          if (align === "center") {
            offset = (containerSize - totalColumnSize) / 2;
          } else if (align === "end") {
            offset = containerSize - totalColumnSize;
          }
        }

        return indexes.map(function (i) {
          return offset + i * dist;
        });
      };

      MasonryGrid.propertyTypes = __assign$1(__assign$1({}, Grid.propertyTypes), {
        column: PROPERTY_TYPE.RENDER_PROPERTY,
        columnSize: PROPERTY_TYPE.RENDER_PROPERTY,
        columnSizeRatio: PROPERTY_TYPE.RENDER_PROPERTY,
        align: PROPERTY_TYPE.RENDER_PROPERTY,
        columnCalculationThreshold: PROPERTY_TYPE.RENDER_PROPERTY
      });
      MasonryGrid.defaultOptions = __assign$1(__assign$1({}, Grid.defaultOptions), {
        align: "justify",
        column: 0,
        columnSize: 0,
        columnSizeRatio: 0,
        columnCalculationThreshold: 0.5
      });
      MasonryGrid = __decorate$1([GetterSetter], MasonryGrid);
      return MasonryGrid;
    }(Grid);

    /*
    Copyright (c) 2015 NAVER Corp.
    name: @egjs/infinitegrid
    license: MIT
    author: NAVER Corp.
    repository: https://github.com/naver/egjs-infinitegrid
    version: 4.1.1
    */

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
      extendStatics = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      };

      return extendStatics(d, b);
    };

    function __extends(d, b) {
      if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
      __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }

        return t;
      };

      return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
      var t = {};

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

      if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
      }
      return t;
    }
    function __decorate(decorators, target, key, desc) {
      var c = arguments.length,
          r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
          d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    /** @deprecated */

    function __spreadArrays() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

      for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

      return r;
    }

    var ua = typeof window !== "undefined" ? window.navigator.userAgent : "";
    var IS_IOS = /iPhone|iPad/.test(ua);
    var CONTAINER_CLASS_NAME = "infinitegrid-container";
    var IGNORE_PROPERITES_MAP = {
      renderOnPropertyChange: true,
      useFit: true,
      autoResize: true
    };
    var INFINITEGRID_PROPERTY_TYPES = __assign({}, GRID_PROPERTY_TYPES);
    var DIRECTION = {
      START: "start",
      END: "end",
      NONE: ""
    };
    var INFINITEGRID_EVENTS = {
      CHANGE_SCROLL: "changeScroll",
      REQUEST_APPEND: "requestAppend",
      REQUEST_PREPEND: "requestPrepend",
      RENDER_COMPLETE: "renderComplete",
      CONTENT_ERROR: "contentError"
    }; // type?: ITEM_TYPE;
    // groupKey?: string | number;
    // key?: string | number;
    // element?: HTMLElement | null;
    // html?: string;
    // data?: Record<string, any>;

    var ITEM_INFO_PROPERTIES = {
      type: true,
      groupKey: true,
      key: true,
      element: true,
      html: true,
      data: true
    };
    var GROUP_TYPE;

    (function (GROUP_TYPE) {
      GROUP_TYPE[GROUP_TYPE["NORMAL"] = 0] = "NORMAL";
      GROUP_TYPE[GROUP_TYPE["VIRTUAL"] = 1] = "VIRTUAL";
      GROUP_TYPE[GROUP_TYPE["LOADING"] = 2] = "LOADING";
    })(GROUP_TYPE || (GROUP_TYPE = {}));

    var ITEM_TYPE;

    (function (ITEM_TYPE) {
      ITEM_TYPE[ITEM_TYPE["NORMAL"] = 0] = "NORMAL";
      ITEM_TYPE[ITEM_TYPE["VIRTUAL"] = 1] = "VIRTUAL";
      ITEM_TYPE[ITEM_TYPE["LOADING"] = 2] = "LOADING";
    })(ITEM_TYPE || (ITEM_TYPE = {}));

    var STATUS_TYPE;

    (function (STATUS_TYPE) {
      // does not remove anything.
      STATUS_TYPE[STATUS_TYPE["NOT_REMOVE"] = 0] = "NOT_REMOVE"; // Minimize information on invisible items

      STATUS_TYPE[STATUS_TYPE["MINIMIZE_INVISIBLE_ITEMS"] = 1] = "MINIMIZE_INVISIBLE_ITEMS"; // Minimize information on invisible groups

      STATUS_TYPE[STATUS_TYPE["MINIMIZE_INVISIBLE_GROUPS"] = 2] = "MINIMIZE_INVISIBLE_GROUPS"; // remove invisible groups

      STATUS_TYPE[STATUS_TYPE["REMOVE_INVISIBLE_GROUPS"] = 3] = "REMOVE_INVISIBLE_GROUPS";
    })(STATUS_TYPE || (STATUS_TYPE = {}));

    var INVISIBLE_POS = -9999;

    /**
     * @extends Grid.GridItem
     */

    var InfiniteGridItem =
    /*#__PURE__*/
    function (_super) {
      __extends(InfiniteGridItem, _super);

      function InfiniteGridItem(horizontal, itemStatus) {
        var _this = _super.call(this, horizontal, __assign({
          html: "",
          type: ITEM_TYPE.NORMAL,
          cssRect: {
            top: INVISIBLE_POS,
            left: INVISIBLE_POS
          }
        }, itemStatus)) || this;

        if (_this.type === ITEM_TYPE.VIRTUAL) {
          if (_this.rect.width || _this.rect.height) {
            _this.mountState = MOUNT_STATE.UNMOUNTED;
          }

          var orgRect = _this.orgRect;
          var rect = _this.rect;
          var cssRect = _this.cssRect;

          if (cssRect.width) {
            rect.width = cssRect.width;
          } else if (orgRect.width) {
            rect.width = orgRect.width;
          }

          if (cssRect.height) {
            rect.height = cssRect.height;
          } else if (orgRect.height) {
            rect.height = orgRect.height;
          }
        }

        return _this;
      }

      var __proto = InfiniteGridItem.prototype;

      __proto.getVirtualStatus = function () {
        return {
          type: ITEM_TYPE.VIRTUAL,
          groupKey: this.groupKey,
          key: this.key,
          orgRect: this.orgRect,
          rect: this.rect,
          cssRect: this.cssRect,
          attributes: this.attributes
        };
      };

      __proto.getMinimizedStatus = function () {
        var status = __assign(__assign({}, _super.prototype.getStatus.call(this)), {
          type: ITEM_TYPE.NORMAL,
          groupKey: this.groupKey
        });

        if (this.html) {
          status.html = this.html;
        }

        return status;
      };

      return InfiniteGridItem;
    }(GridItem);

    var LOADING_GROUP_KEY = "__INFINITEGRID__LOADING_GRID";
    var LOADING_ITEM_KEY = "__INFINITEGRID__LOADING_ITEM";

    var LoadingGrid =
    /*#__PURE__*/
    function (_super) {
      __extends(LoadingGrid, _super);

      function LoadingGrid() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.type = "";
        return _this;
      }

      var __proto = LoadingGrid.prototype;

      __proto.getLoadingItem = function () {
        return this.items[0] || null;
      };

      __proto.setLoadingItem = function (item) {
        if (item) {
          var loadingItem = this.getLoadingItem();

          if (!loadingItem) {
            this.items = [new InfiniteGridItem(this.options.horizontal, __assign(__assign({}, item), {
              type: ITEM_TYPE.LOADING,
              key: LOADING_ITEM_KEY
            }))];
          } else {
            for (var name in item) {
              loadingItem[name] = item[name];
            }
          }
        } else {
          this.items = [];
        }
      };

      __proto.applyGrid = function (items, direction, outline) {
        if (!items.length) {
          return {
            start: outline,
            end: outline
          };
        }

        var nextOutline = outline.length ? __spreadArrays(outline) : [0];
        var item = items[0];
        var offset = item.contentSize + this.gap;
        item.cssInlinePos = this.getContainerInlineSize() / 2 - item.inlineSize / 2;

        if (direction === "end") {
          var maxPos = Math.max.apply(Math, nextOutline);
          item.cssContentPos = maxPos;
          return {
            start: nextOutline,
            end: nextOutline.map(function (pos) {
              return pos + offset;
            })
          };
        } else {
          var minPos = Math.min.apply(Math, nextOutline);
          item.cssContentPos = minPos - offset;
          return {
            start: nextOutline.map(function (pos) {
              return pos - offset;
            }),
            end: nextOutline
          };
        }
      };

      return LoadingGrid;
    }(Grid);

    function isWindow(el) {
      return el === window;
    }
    function isNumber(val) {
      return typeof val === "number";
    }
    function isString(val) {
      return typeof val === "string";
    }
    function isObject(val) {
      return typeof val === "object";
    }
    function flat(arr) {
      return arr.reduce(function (prev, cur) {
        return __spreadArrays(prev, cur);
      }, []);
    }
    function splitOptions(options) {
      var gridOptions = options.gridOptions,
          otherOptions = __rest(options, ["gridOptions"]);

      return __assign(__assign({}, splitGridOptions(gridOptions)), otherOptions);
    }
    function splitGridOptions(options) {
      var nextOptions = {};
      var gridOptions = {};
      var defaultOptions = Grid.defaultOptions;

      for (var name in options) {
        var value = options[name];

        if (!(name in IGNORE_PROPERITES_MAP)) {
          gridOptions[name] = value;
        }

        if (name in defaultOptions) {
          nextOptions[name] = value;
        }
      }

      return __assign(__assign({}, nextOptions), {
        gridOptions: gridOptions
      });
    }
    function categorize(items) {
      var groups = [];
      var groupKeys = {};
      var registeredGroupKeys = {};
      items.filter(function (item) {
        return item.groupKey != null;
      }).forEach(function (_a) {
        var groupKey = _a.groupKey;
        registeredGroupKeys[groupKey] = true;
      });
      var generatedGroupKey;
      var isContinuousGroupKey = false;
      items.forEach(function (item) {
        if (item.groupKey != null) {
          isContinuousGroupKey = false;
        } else {
          if (!isContinuousGroupKey) {
            generatedGroupKey = makeKey(registeredGroupKeys);
            isContinuousGroupKey = true;
            registeredGroupKeys[generatedGroupKey] = true;
          }

          item.groupKey = generatedGroupKey;
        }

        var groupKey = item.groupKey;
        var group = groupKeys[groupKey];

        if (!group) {
          group = {
            groupKey: groupKey,
            items: []
          };
          groupKeys[groupKey] = group;
          groups.push(group);
        }

        group.items.push(item);
      });
      return groups;
    }
    function getNextCursors(prevKeys, nextKeys, prevStartCursor, prevEndCursor) {
      var result = diff$1(prevKeys, nextKeys, function (key) {
        return key;
      });
      var nextStartCursor = -1;
      var nextEndCursor = -1; // sync cursors

      result.maintained.forEach(function (_a) {
        var prevIndex = _a[0],
            nextIndex = _a[1];

        if (prevStartCursor <= prevIndex && prevIndex <= prevEndCursor) {
          if (nextStartCursor === -1) {
            nextStartCursor = nextIndex;
            nextEndCursor = nextIndex;
          } else {
            nextStartCursor = Math.min(nextStartCursor, nextIndex);
            nextEndCursor = Math.max(nextEndCursor, nextIndex);
          }
        }
      });
      return {
        startCursor: nextStartCursor,
        endCursor: nextEndCursor
      };
    }
    function splitVirtualGroups(groups, direction, nextGroups) {
      var virtualGroups = [];

      if (direction === "start") {
        var index = findIndex(groups, function (group) {
          return group.type === GROUP_TYPE.NORMAL;
        });

        if (index === -1) {
          return [];
        }

        virtualGroups = groups.slice(0, index);
      } else {
        var index = findLastIndex(groups, function (group) {
          return group.type === GROUP_TYPE.NORMAL;
        });

        if (index === -1) {
          return [];
        }

        virtualGroups = groups.slice(index + 1);
      }

      var nextVirtualGroups = diff$1(virtualGroups, nextGroups, function (_a) {
        var groupKey = _a.groupKey;
        return groupKey;
      }).removed.map(function (index) {
        return virtualGroups[index];
      }).reverse();
      return nextVirtualGroups;
    }
    function getFirstRenderingItems(nextItems, horizontal) {
      var groups = categorize(nextItems);

      if (!groups[0]) {
        return [];
      }

      return groups[0].items.map(function (item) {
        return new InfiniteGridItem(horizontal, __assign({}, item));
      });
    }
    function getRenderingItemsByStatus(groupManagerStatus, nextItems, usePlaceholder, horizontal) {
      var prevGroups = groupManagerStatus.groups;
      var groups = categorize(nextItems);
      var startVirtualGroups = splitVirtualGroups(prevGroups, "start", groups);
      var endVirtualGroups = splitVirtualGroups(prevGroups, "end", groups);

      var nextGroups = __spreadArrays(startVirtualGroups, groups, endVirtualGroups);

      var _a = getNextCursors(prevGroups.map(function (group) {
        return group.groupKey;
      }), nextGroups.map(function (group) {
        return group.groupKey;
      }), groupManagerStatus.cursors[0], groupManagerStatus.cursors[1]),
          startCursor = _a.startCursor,
          endCursor = _a.endCursor;

      var nextVisibleItems = flat(nextGroups.slice(startCursor, endCursor + 1).map(function (group) {
        return group.items.map(function (item) {
          return new InfiniteGridItem(horizontal, __assign({}, item));
        });
      }));

      if (!usePlaceholder) {
        nextVisibleItems = nextVisibleItems.filter(function (item) {
          return item.type !== ITEM_TYPE.VIRTUAL;
        });
      }

      return nextVisibleItems;
    }
    function mountRenderingItems(items, options) {
      var grid = options.grid,
          usePlaceholder = options.usePlaceholder,
          useLoading = options.useLoading,
          useFirstRender = options.useFirstRender,
          status = options.status;

      if (!grid) {
        return;
      }

      if (usePlaceholder) {
        grid.setPlaceholder({});
      }

      if (useLoading) {
        grid.setLoading({});
      }

      if (status) {
        grid.setStatus(status, true);
      }

      grid.syncItems(items);

      if (useFirstRender && !status && grid.getGroups().length) {
        grid.setCursors(0, 0, true);
      }
    }
    function getRenderingItems(items, options) {
      var status = options.status,
          usePlaceholder = options.usePlaceholder,
          useLoading = options.useLoading,
          horizontal = options.horizontal,
          useFirstRender = options.useFirstRender,
          grid = options.grid;
      var visibleItems = [];

      if (grid) {
        grid.setPlaceholder(usePlaceholder ? {} : null);
        grid.setLoading(useLoading ? {} : null);
        grid.syncItems(items);
        visibleItems = grid.getRenderingItems();
      } else if (status) {
        visibleItems = getRenderingItemsByStatus(status.groupManager, items, !!usePlaceholder, !!horizontal);
      } else if (useFirstRender) {
        visibleItems = getFirstRenderingItems(items, !!horizontal);
      }

      return visibleItems;
    }
    /* Class Decorator */

    function InfiniteGridGetterSetter(component) {
      var prototype = component.prototype,
          propertyTypes = component.propertyTypes;

      var _loop_1 = function (name) {
        var attributes = {
          enumerable: true,
          configurable: true,
          get: function () {
            var options = this.groupManager.options;

            if (name in options) {
              return options[name];
            } else {
              return options.gridOptions[name];
            }
          },
          set: function (value) {
            var _a;

            var prevValue = this.groupManager[name];

            if (prevValue === value) {
              return;
            }

            this.groupManager.gridOptions = (_a = {}, _a[name] = value, _a);
          }
        };
        Object.defineProperty(prototype, name, attributes);
      };

      for (var name in propertyTypes) {
        _loop_1(name);
      }
    }
    function makeKey(registeredKeys) {
      var index = 0; // eslint-disable-next-line no-constant-condition

      while (true) {
        var key = "infinitegrid_" + index++;

        if (!(key in registeredKeys)) {
          return key;
        }
      }
    }
    function convertHTMLtoElement(html) {
      var dummy = document.createElement("div");
      dummy.innerHTML = html;
      return toArray(dummy.children);
    }
    function convertInsertedItems(items, groupKey) {
      var insertedItems;

      if (isString(items)) {
        insertedItems = convertHTMLtoElement(items);
      } else {
        insertedItems = items;
      }

      return insertedItems.map(function (item) {
        var element;
        var html = "";
        var key;

        if (isString(item)) {
          html = item;
        } else if ("parentNode" in item) {
          element = item;
          html = item.outerHTML;
        } else {
          return __assign({
            groupKey: groupKey
          }, item);
        }

        return {
          key: key,
          groupKey: groupKey,
          html: html,
          element: element
        };
      });
    }
    function toArray(nodes) {
      var array = [];

      if (nodes) {
        var length = nodes.length;

        for (var i = 0; i < length; i++) {
          array.push(nodes[i]);
        }
      }

      return array;
    }
    function findIndex(arr, callback) {
      var length = arr.length;

      for (var i = 0; i < length; ++i) {
        if (callback(arr[i], i)) {
          return i;
        }
      }

      return -1;
    }
    function findLastIndex(arr, callback) {
      var length = arr.length;

      for (var i = length - 1; i >= 0; --i) {
        if (callback(arr[i], i)) {
          return i;
        }
      }

      return -1;
    }
    function getItemInfo(info) {
      var nextInfo = {};

      for (var name in info) {
        if (name in ITEM_INFO_PROPERTIES) {
          nextInfo[name] = info[name];
        }
      }

      return nextInfo;
    }
    function setPlaceholder(item, info) {
      for (var name in info) {
        var value = info[name];

        if (isObject(value)) {
          item[name] = __assign(__assign({}, item[name]), value);
        } else {
          item[name] = info[name];
        }
      }
    }
    function isFlatOutline(start, end) {
      return start.length === end.length && start.every(function (pos, i) {
        return end[i] === pos;
      });
    }
    function range(length) {
      var arr = [];

      for (var i = 0; i < length; ++i) {
        arr.push(i);
      }

      return arr;
    }
    function flatGroups(groups) {
      return flat(groups.map(function (_a) {
        var grid = _a.grid;
        return grid.getItems();
      }));
    }
    function filterVirtuals(items, includePlaceholders) {
      if (includePlaceholders) {
        return items;
      } else {
        return items.filter(function (item) {
          return item.type !== ITEM_TYPE.VIRTUAL;
        });
      }
    }

    var GroupManager =
    /*#__PURE__*/
    function (_super) {
      __extends(GroupManager, _super);

      function GroupManager(container, options) {
        var _this = _super.call(this, container, splitOptions(options)) || this;

        _this.groupItems = [];
        _this.groups = [];
        _this.itemKeys = {};
        _this.groupKeys = {};
        _this.startCursor = 0;
        _this.endCursor = 0;
        _this._placeholder = null;
        _this._loadingGrid = new LoadingGrid(container, {
          externalContainerManager: _this.containerManager,
          useFit: false,
          autoResize: false,
          renderOnPropertyChange: false,
          gap: _this.gap
        });
        return _this;
      }

      var __proto = GroupManager.prototype;
      Object.defineProperty(__proto, "gridOptions", {
        set: function (options) {
          var _a = splitGridOptions(options),
              gridOptions = _a.gridOptions,
              otherOptions = __rest(_a, ["gridOptions"]);

          var shouldRender = this._checkShouldRender(options);

          this.options.gridOptions = __assign(__assign({}, this.options.gridOptions), gridOptions);
          this.groups.forEach(function (_a) {
            var grid = _a.grid;

            for (var name in options) {
              grid[name] = options[name];
            }
          });

          for (var name in otherOptions) {
            this[name] = otherOptions[name];
          }

          this._loadingGrid.gap = this.gap;

          if (shouldRender) {
            this.scheduleRender();
          }
        },
        enumerable: false,
        configurable: true
      });

      __proto.getItemByKey = function (key) {
        return this.itemKeys[key] || null;
      };

      __proto.getGroupItems = function (includePlaceholders) {
        return filterVirtuals(this.groupItems, includePlaceholders);
      };

      __proto.getVisibleItems = function (includePlaceholders) {
        return filterVirtuals(this.items, includePlaceholders);
      };

      __proto.getRenderingItems = function () {
        if (this.hasPlaceholder()) {
          return this.items;
        } else {
          return this.items.filter(function (item) {
            return item.type !== ITEM_TYPE.VIRTUAL;
          });
        }
      };

      __proto.getGroups = function (includePlaceholders) {
        return filterVirtuals(this.groups, includePlaceholders);
      };

      __proto.hasVisibleVirtualGroups = function () {
        return this.getVisibleGroups(true).some(function (group) {
          return group.type === GROUP_TYPE.VIRTUAL;
        });
      };

      __proto.hasPlaceholder = function () {
        return !!this._placeholder;
      };

      __proto.hasLoadingItem = function () {
        return !!this._getLoadingItem();
      };

      __proto.setPlaceholder = function (placeholder) {
        this._placeholder = placeholder;

        this._updatePlaceholder();
      };

      __proto.getLoadingType = function () {
        return this._loadingGrid.type;
      };

      __proto.startLoading = function (type) {
        this._loadingGrid.type = type;
        this.items = this._getRenderingItems();
        return true;
      };

      __proto.endLoading = function () {
        var prevType = this._loadingGrid.type;
        this._loadingGrid.type = "";
        this.items = this._getRenderingItems();
        return !!prevType;
      };

      __proto.setLoading = function (loading) {
        this._loadingGrid.setLoadingItem(loading);

        this.items = this._getRenderingItems();
      };

      __proto.getVisibleGroups = function (includePlaceholders) {
        var groups = this.groups.slice(this.startCursor, this.endCursor + 1);
        return filterVirtuals(groups, includePlaceholders);
      };

      __proto.applyGrid = function (items, direction, outline) {
        var _this = this;

        items.forEach(function (item) {
          item.mountState = MOUNT_STATE.MOUNTED;
        });
        var renderingGroups = this.groups.slice();

        if (!renderingGroups.length) {
          return {
            start: [],
            end: []
          };
        }

        var loadingGrid = this._loadingGrid;

        if (loadingGrid.getLoadingItem()) {
          if (loadingGrid.type === "start") {
            renderingGroups.unshift(this._getLoadingGroup());
          } else if (loadingGrid.type === "end") {
            renderingGroups.push(this._getLoadingGroup());
          }
        }

        var groups = renderingGroups.slice();
        var nextOutline = outline;

        if (direction === "start") {
          groups.reverse();
        }

        groups.forEach(function (group) {
          var grid = group.grid;
          var gridItems = grid.getItems();
          var isVirtual = group.type === GROUP_TYPE.VIRTUAL && !gridItems[0];
          var appliedItems = gridItems.filter(function (item) {
            return item.mountState !== MOUNT_STATE.UNCHECKED && item.rect.width;
          });
          var gridOutlines;

          if (isVirtual) {
            gridOutlines = _this._applyVirtualGrid(grid, direction, nextOutline);
          } else if (appliedItems.length) {
            gridOutlines = grid.applyGrid(appliedItems, direction, nextOutline);
          } else {
            gridOutlines = {
              start: __spreadArrays(nextOutline),
              end: __spreadArrays(nextOutline)
            };
          }

          grid.setOutlines(gridOutlines);
          nextOutline = gridOutlines[direction];
        });
        return {
          start: renderingGroups[0].grid.getOutlines().start,
          end: renderingGroups[renderingGroups.length - 1].grid.getOutlines().end
        };
      };

      __proto.syncItems = function (nextItemInfos) {
        var _this = this;

        var prevItemKeys = this.itemKeys;
        this.itemKeys = {};

        var nextItems = this._syncItemInfos(nextItemInfos.map(function (info) {
          return getItemInfo(info);
        }), prevItemKeys);

        var prevGroupKeys = this.groupKeys;
        var nextManagerGroups = categorize(nextItems);

        var startVirtualGroups = this._splitVirtualGroups("start", nextManagerGroups);

        var endVirtualGroups = this._splitVirtualGroups("end", nextManagerGroups);

        nextManagerGroups = __spreadArrays(startVirtualGroups, this._mergeVirtualGroups(nextManagerGroups), endVirtualGroups);
        var nextGroups = nextManagerGroups.map(function (_a) {
          var _b, _c;

          var groupKey = _a.groupKey,
              items = _a.items;
          var isVirtual = !items[0] || items[0].type === ITEM_TYPE.VIRTUAL;
          var grid = (_c = (_b = prevGroupKeys[groupKey]) === null || _b === void 0 ? void 0 : _b.grid) !== null && _c !== void 0 ? _c : _this._makeGrid();
          var gridItems = isVirtual ? items : items.filter(function (_a) {
            var type = _a.type;
            return type === ITEM_TYPE.NORMAL;
          });
          grid.setItems(gridItems);
          return {
            type: isVirtual ? GROUP_TYPE.VIRTUAL : GROUP_TYPE.NORMAL,
            groupKey: groupKey,
            grid: grid,
            items: gridItems,
            renderItems: items
          };
        });

        this._registerGroups(nextGroups);
      };

      __proto.renderItems = function (options) {
        if (options === void 0) {
          options = {};
        }

        if (options.useResize) {
          this.groupItems.forEach(function (item) {
            item.updateState = UPDATE_STATE.NEED_UPDATE;
          });

          var loadingItem = this._getLoadingItem();

          if (loadingItem) {
            loadingItem.updateState = UPDATE_STATE.NEED_UPDATE;
          }
        }

        return _super.prototype.renderItems.call(this, options);
      };

      __proto.setCursors = function (startCursor, endCursor) {
        this.startCursor = startCursor;
        this.endCursor = endCursor;
        this.items = this._getRenderingItems();
      };

      __proto.getStartCursor = function () {
        return this.startCursor;
      };

      __proto.getEndCursor = function () {
        return this.endCursor;
      };

      __proto.getGroupStatus = function (type) {
        var orgStartCursor = this.startCursor;
        var orgEndCursor = this.endCursor;
        var orgGroups = this.groups;
        var startCursor = orgStartCursor;
        var endCursor = orgEndCursor;
        var isMinimizeItems = type === STATUS_TYPE.MINIMIZE_INVISIBLE_ITEMS;
        var isMinimizeGroups = type === STATUS_TYPE.MINIMIZE_INVISIBLE_GROUPS;
        var groups;

        if (type === STATUS_TYPE.REMOVE_INVISIBLE_GROUPS) {
          groups = this.getVisibleGroups();
          endCursor -= startCursor;
          startCursor = 0;
        } else {
          groups = this.getGroups();
        }

        var groupStatus = groups.map(function (_a, i) {
          var grid = _a.grid,
              groupKey = _a.groupKey;
          var isOutsideCursor = i < startCursor || endCursor < i;
          var isVirtualItems = isMinimizeItems && isOutsideCursor;
          var isVirtualGroup = isMinimizeGroups && isOutsideCursor;
          var gridItems = grid.getItems();
          var items = isVirtualGroup ? [] : gridItems.map(function (item) {
            return isVirtualItems ? item.getVirtualStatus() : item.getMinimizedStatus();
          });
          return {
            type: isVirtualGroup || isVirtualItems ? GROUP_TYPE.VIRTUAL : GROUP_TYPE.NORMAL,
            groupKey: groupKey,
            outlines: grid.getOutlines(),
            items: items
          };
        });
        var startGroup = orgGroups[orgStartCursor];
        var endGroup = orgGroups[orgEndCursor];
        var totalItems = this.getGroupItems();
        var itemStartCursor = totalItems.indexOf(startGroup === null || startGroup === void 0 ? void 0 : startGroup.items[0]);
        var itemEndCursor = totalItems.indexOf(endGroup === null || endGroup === void 0 ? void 0 : endGroup.items.slice().reverse()[0]);
        return {
          cursors: [startCursor, endCursor],
          orgCursors: [orgStartCursor, orgEndCursor],
          itemCursors: [itemStartCursor, itemEndCursor],
          startGroupKey: startGroup === null || startGroup === void 0 ? void 0 : startGroup.groupKey,
          endGroupKey: endGroup === null || endGroup === void 0 ? void 0 : endGroup.groupKey,
          groups: groupStatus,
          outlines: this.outlines
        };
      };

      __proto.setGroupStatus = function (status) {
        var _this = this;

        this.itemKeys = {};
        this.groupItems = [];
        this.items = [];
        var prevGroupKeys = this.groupKeys;
        var nextGroups = status.groups.map(function (_a) {
          var _b, _c;

          var type = _a.type,
              groupKey = _a.groupKey,
              items = _a.items,
              outlines = _a.outlines;

          var nextItems = _this._syncItemInfos(items);

          var grid = (_c = (_b = prevGroupKeys[groupKey]) === null || _b === void 0 ? void 0 : _b.grid) !== null && _c !== void 0 ? _c : _this._makeGrid();
          grid.setOutlines(outlines);
          grid.setItems(nextItems);
          return {
            type: type,
            groupKey: groupKey,
            grid: grid,
            items: nextItems,
            renderItems: nextItems
          };
        });
        this.setOutlines(status.outlines);

        this._registerGroups(nextGroups);

        this._updatePlaceholder();

        this.setCursors(status.cursors[0], status.cursors[1]);
      };

      __proto.appendPlaceholders = function (items, groupKey) {
        return this.insertPlaceholders("end", items, groupKey);
      };

      __proto.prependPlaceholders = function (items, groupKey) {
        return this.insertPlaceholders("start", items, groupKey);
      };

      __proto.removePlaceholders = function (type) {
        var groups = this.groups;
        var length = groups.length;

        if (type === "start") {
          var index = findIndex(groups, function (group) {
            return group.type === GROUP_TYPE.NORMAL;
          });
          groups.splice(0, index);
        } else if (type === "end") {
          var index = findLastIndex(groups, function (group) {
            return group.type === GROUP_TYPE.NORMAL;
          });
          groups.splice(index + 1, length - index - 1);
        } else {
          var groupKey_1 = type.groupKey;
          var index = findIndex(groups, function (group) {
            return group.groupKey === groupKey_1;
          });

          if (index > -1) {
            groups.splice(index, 1);
          }
        }

        this.syncItems(flatGroups(this.getGroups()));
      };

      __proto.insertPlaceholders = function (direction, items, groupKey) {
        var _a, _b;

        if (groupKey === void 0) {
          groupKey = makeKey(this.groupKeys);
        }

        var infos = [];

        if (isNumber(items)) {
          infos = range(items).map(function () {
            return {
              type: ITEM_TYPE.VIRTUAL,
              groupKey: groupKey
            };
          });
        } else if (Array.isArray(items)) {
          infos = items.map(function (status) {
            return __assign(__assign({
              groupKey: groupKey
            }, status), {
              type: ITEM_TYPE.VIRTUAL
            });
          });
        }

        var grid = this._makeGrid();

        var nextItems = this._syncItemInfos(infos, this.itemKeys);

        this._updatePlaceholder(nextItems);

        grid.setItems(nextItems);
        var group = {
          type: GROUP_TYPE.VIRTUAL,
          groupKey: groupKey,
          grid: grid,
          items: nextItems,
          renderItems: nextItems
        };
        this.groupKeys[groupKey] = group;

        if (direction === "end") {
          this.groups.push(group);

          (_a = this.groupItems).push.apply(_a, nextItems);
        } else {
          this.groups.splice(0, 0, group);

          (_b = this.groupItems).splice.apply(_b, __spreadArrays([0, 0], nextItems));

          if (this.startCursor > -1) {
            ++this.startCursor;
            ++this.endCursor;
          }
        }

        return {
          group: group,
          items: nextItems
        };
      };

      __proto.shouldRerenderItems = function () {
        var isRerender = false;
        this.getVisibleGroups().forEach(function (group) {
          var items = group.items;

          if (items.length === group.renderItems.length || items.every(function (item) {
            return item.mountState === MOUNT_STATE.UNCHECKED;
          })) {
            return;
          }

          isRerender = true;
          group.renderItems = __spreadArrays(items);
        });

        if (isRerender) {
          this.items = this._getRenderingItems();
        }

        return isRerender;
      };

      __proto._getGroupItems = function () {
        return flatGroups(this.getGroups(true));
      };

      __proto._getRenderingItems = function () {
        var items = flat(this.getVisibleGroups(true).map(function (item) {
          return item.renderItems;
        }));
        var loadingGrid = this._loadingGrid;
        var loadingItem = loadingGrid.getLoadingItem();

        if (loadingItem) {
          if (loadingGrid.type === "end") {
            items.push(loadingItem);
          } else if (loadingGrid.type === "start") {
            items.unshift(loadingItem);
          }
        }

        return items;
      };

      __proto._checkShouldRender = function (options) {
        var GridConstructor = this.options.gridConstructor;
        var prevOptions = this.gridOptions;
        var propertyTypes = GridConstructor.propertyTypes;

        for (var name in prevOptions) {
          if (!(name in options) && propertyTypes[name] === PROPERTY_TYPE.RENDER_PROPERTY) {
            return true;
          }
        }

        for (var name in options) {
          if (prevOptions[name] !== options[name] && propertyTypes[name] === PROPERTY_TYPE.RENDER_PROPERTY) {
            return true;
          }
        }

        return false;
      };

      __proto._applyVirtualGrid = function (grid, direction, outline) {
        var startOutline = outline.length ? __spreadArrays(outline) : [0];
        var prevOutlines = grid.getOutlines();
        var prevOutline = prevOutlines[direction === "end" ? "start" : "end"];

        if (prevOutline.length !== startOutline.length || prevOutline.some(function (value, i) {
          return value !== startOutline[i];
        })) {
          return {
            start: __spreadArrays(startOutline),
            end: __spreadArrays(startOutline)
          };
        }

        return prevOutlines;
      };

      __proto._syncItemInfos = function (nextItemInfos, prevItemKeys) {
        if (prevItemKeys === void 0) {
          prevItemKeys = {};
        }

        var horizontal = this.options.horizontal;
        var nextItemKeys = this.itemKeys;
        nextItemInfos.filter(function (info) {
          return info.key != null;
        }).forEach(function (info) {
          var key = info.key;
          var prevItem = prevItemKeys[key];

          if (!prevItem) {
            nextItemKeys[key] = new InfiniteGridItem(horizontal, __assign({}, info));
          } else if (prevItem.type === ITEM_TYPE.VIRTUAL && info.type !== ITEM_TYPE.VIRTUAL) {
            nextItemKeys[key] = new InfiniteGridItem(horizontal, __assign({
              orgRect: prevItem.orgRect,
              rect: prevItem.rect
            }, info));
          } else {
            if (info.data) {
              prevItem.data = info.data;
            }

            nextItemKeys[key] = prevItem;
          }
        });
        var nextItems = nextItemInfos.map(function (info) {
          var key = info.key;

          if (info.key == null) {
            key = makeKey(nextItemKeys);
          }

          var item = nextItemKeys[key];

          if (!item) {
            var prevItem = prevItemKeys[key];

            if (prevItem) {
              item = prevItem;

              if (info.data) {
                item.data = info.data;
              }
            } else {
              item = new InfiniteGridItem(horizontal, __assign(__assign({}, info), {
                key: key
              }));
            }

            nextItemKeys[key] = item;
          }

          return item;
        });
        return nextItems;
      };

      __proto._registerGroups = function (groups) {
        var nextGroupKeys = {};
        groups.forEach(function (group) {
          nextGroupKeys[group.groupKey] = group;
        });
        this.groups = groups;
        this.groupKeys = nextGroupKeys;
        this.groupItems = this._getGroupItems();
      };

      __proto._splitVirtualGroups = function (direction, nextGroups) {
        var groups = splitVirtualGroups(this.groups, direction, nextGroups);
        var itemKeys = this.itemKeys;
        groups.forEach(function (_a) {
          var renderItems = _a.renderItems;
          renderItems.forEach(function (item) {
            itemKeys[item.key] = item;
          });
        });
        return groups;
      };

      __proto._mergeVirtualGroups = function (groups) {
        var itemKeys = this.itemKeys;
        var groupKeys = this.groupKeys;
        groups.forEach(function (group) {
          var prevGroup = groupKeys[group.groupKey];

          if (!prevGroup) {
            return;
          }

          var items = group.items;

          if (items.every(function (item) {
            return item.mountState === MOUNT_STATE.UNCHECKED;
          })) {
            prevGroup.renderItems.forEach(function (item) {
              if (item.type === ITEM_TYPE.VIRTUAL && !itemKeys[item.key]) {
                items.push(item);
                itemKeys[item.key] = item;
              }
            });
          }
        });
        return groups;
      };

      __proto._updatePlaceholder = function (items) {
        if (items === void 0) {
          items = this.groupItems;
        }

        var placeholder = this._placeholder;

        if (!placeholder) {
          return;
        }

        items.filter(function (item) {
          return item.type === ITEM_TYPE.VIRTUAL;
        }).forEach(function (item) {
          setPlaceholder(item, placeholder);
        });
      };

      __proto._makeGrid = function () {
        var GridConstructor = this.options.gridConstructor;
        var gridOptions = this.gridOptions;
        var container = this.containerElement;
        return new GridConstructor(container, __assign(__assign({}, gridOptions), {
          useFit: false,
          autoResize: false,
          renderOnPropertyChange: false,
          externalContainerManager: this.containerManager,
          externalItemRenderer: this.itemRenderer
        }));
      };

      __proto._getLoadingGroup = function () {
        var loadingGrid = this._loadingGrid;
        var items = loadingGrid.getItems();
        return {
          groupKey: LOADING_GROUP_KEY,
          type: GROUP_TYPE.NORMAL,
          grid: loadingGrid,
          items: items,
          renderItems: items
        };
      };

      __proto._getLoadingItem = function () {
        return this._loadingGrid.getLoadingItem();
      };

      GroupManager.defaultOptions = __assign(__assign({}, Grid.defaultOptions), {
        gridConstructor: null,
        gridOptions: {}
      });
      GroupManager.propertyTypes = __assign(__assign({}, Grid.propertyTypes), {
        gridConstructor: PROPERTY_TYPE.PROPERTY,
        gridOptions: PROPERTY_TYPE.PROPERTY
      });
      GroupManager = __decorate([GetterSetter], GroupManager);
      return GroupManager;
    }(Grid);

    var Infinite =
    /*#__PURE__*/
    function (_super) {
      __extends(Infinite, _super);

      function Infinite(options) {
        var _this = _super.call(this) || this;

        _this.startCursor = -1;
        _this.endCursor = -1;
        _this.size = 0;
        _this.items = [];
        _this.itemKeys = {};
        _this.options = __assign({
          threshold: 0,
          useRecycle: true,
          defaultDirection: "end"
        }, options);
        return _this;
      }

      var __proto = Infinite.prototype;

      __proto.scroll = function (scrollPos) {
        var prevStartCursor = this.startCursor;
        var prevEndCursor = this.endCursor;
        var items = this.items;
        var length = items.length;
        var size = this.size;
        var _a = this.options,
            defaultDirection = _a.defaultDirection,
            threshold = _a.threshold,
            useRecycle = _a.useRecycle;
        var isDirectionEnd = defaultDirection === "end";

        if (!length) {
          this.trigger(isDirectionEnd ? "requestAppend" : "requestPrepend", {
            key: undefined,
            isVirtual: false
          });
          return;
        } else if (prevStartCursor === -1 || prevEndCursor === -1) {
          var nextCursor = isDirectionEnd ? 0 : length - 1;
          this.trigger("change", {
            prevStartCursor: prevStartCursor,
            prevEndCursor: prevEndCursor,
            nextStartCursor: nextCursor,
            nextEndCursor: nextCursor
          });
          return;
        }

        var endScrollPos = scrollPos + size;
        var startEdgePos = Math.max.apply(Math, items[prevStartCursor].startOutline);
        var endEdgePos = Math.min.apply(Math, items[prevEndCursor].endOutline);
        var visibles = items.map(function (item) {
          var startOutline = item.startOutline,
              endOutline = item.endOutline;

          if (!startOutline.length || !endOutline.length) {
            return false;
          }

          var startPos = Math.min.apply(Math, startOutline);
          var endPos = Math.max.apply(Math, endOutline);

          if (startPos - threshold <= endScrollPos && scrollPos <= endPos + threshold) {
            return true;
          }

          return false;
        });
        var hasStartItems = 0 < prevStartCursor;
        var hasEndItems = prevEndCursor < length - 1;
        var isStart = scrollPos <= startEdgePos + threshold;
        var isEnd = endScrollPos >= endEdgePos - threshold;
        var nextStartCursor = visibles.indexOf(true);
        var nextEndCursor = visibles.lastIndexOf(true);

        if (nextStartCursor === -1) {
          nextStartCursor = prevStartCursor;
          nextEndCursor = prevEndCursor;
        }

        if (!useRecycle) {
          nextStartCursor = Math.min(nextStartCursor, prevStartCursor);
          nextEndCursor = Math.max(nextEndCursor, prevEndCursor);
        }

        if (nextStartCursor === prevStartCursor && hasStartItems && isStart) {
          nextStartCursor -= 1;
        }

        if (nextEndCursor === prevEndCursor && hasEndItems && isEnd) {
          nextEndCursor += 1;
        }

        if (prevStartCursor !== nextStartCursor || prevEndCursor !== nextEndCursor) {
          this.trigger("change", {
            prevStartCursor: prevStartCursor,
            prevEndCursor: prevEndCursor,
            nextStartCursor: nextStartCursor,
            nextEndCursor: nextEndCursor
          });
          return;
        } else if (this._requestVirtualItems()) {
          return;
        } else if ((!isDirectionEnd || !isEnd) && isStart) {
          this.trigger("requestPrepend", {
            key: items[prevStartCursor].key,
            isVirtual: false
          });
        } else if ((isDirectionEnd || !isStart) && isEnd) {
          this.trigger("requestAppend", {
            key: items[prevEndCursor].key,
            isVirtual: false
          });
        }
      };
      /**
       * @private
       * Call the requestAppend or requestPrepend event to fill the virtual items.
       * @ko virtual item을 채우기 위해 requestAppend 또는 requestPrepend 이벤트를 호출합니다.
       * @return - Whether the event is called. <ko>이벤트를 호출했는지 여부.</ko>
       */


      __proto._requestVirtualItems = function () {
        var isDirectionEnd = this.options.defaultDirection === "end";
        var items = this.items;
        var totalVisibleItems = this.getVisibleItems();
        var visibleItems = totalVisibleItems.filter(function (item) {
          return !item.isVirtual;
        });
        var totalVisibleLength = totalVisibleItems.length;
        var visibleLength = visibleItems.length;
        var startCursor = this.getStartCursor();
        var endCursor = this.getEndCursor();

        if (visibleLength === totalVisibleLength) {
          return false;
        } else if (visibleLength) {
          var startKey_1 = visibleItems[0].key;
          var endKey_1 = visibleItems[visibleLength - 1].key;
          var startIndex = findIndex(items, function (item) {
            return item.key === startKey_1;
          }) - 1;
          var endIndex = findIndex(items, function (item) {
            return item.key === endKey_1;
          }) + 1;
          var isEnd = endIndex <= endCursor;
          var isStart = startIndex >= startCursor; // Fill the placeholder with the original item.

          if ((isDirectionEnd || !isStart) && isEnd) {
            this.trigger("requestAppend", {
              key: endKey_1,
              nextKey: items[endIndex].key,
              isVirtual: true
            });
            return true;
          } else if ((!isDirectionEnd || !isEnd) && isStart) {
            this.trigger("requestPrepend", {
              key: startKey_1,
              nextKey: items[startIndex].key,
              isVirtual: true
            });
            return true;
          }
        } else if (totalVisibleLength) {
          var lastItem = totalVisibleItems[totalVisibleLength - 1];

          if (isDirectionEnd) {
            this.trigger("requestAppend", {
              nextKey: totalVisibleItems[0].key,
              isVirtual: true
            });
          } else {
            this.trigger("requestPrepend", {
              nextKey: lastItem.key,
              isVirtual: true
            });
          }

          return true;
        }

        return false;
      };

      __proto.setCursors = function (startCursor, endCursor) {
        this.startCursor = startCursor;
        this.endCursor = endCursor;
      };

      __proto.setSize = function (size) {
        this.size = size;
      };

      __proto.getStartCursor = function () {
        return this.startCursor;
      };

      __proto.getEndCursor = function () {
        return this.endCursor;
      };

      __proto.isLoading = function (direction) {
        var startCursor = this.startCursor;
        var endCursor = this.endCursor;
        var items = this.items;
        var firstItem = items[startCursor];
        var lastItem = items[endCursor];
        var length = items.length;

        if (direction === DIRECTION.END && endCursor > -1 && endCursor < length - 1 && !lastItem.isVirtual && !isFlatOutline(lastItem.startOutline, lastItem.endOutline)) {
          return false;
        }

        if (direction === DIRECTION.START && startCursor > 0 && !firstItem.isVirtual && !isFlatOutline(firstItem.startOutline, firstItem.endOutline)) {
          return false;
        }

        return true;
      };

      __proto.setItems = function (nextItems) {
        this.items = nextItems;
        var itemKeys = {};
        nextItems.forEach(function (item) {
          itemKeys[item.key] = item;
        });
        this.itemKeys = itemKeys;
      };

      __proto.syncItems = function (nextItems) {
        var prevItems = this.items;
        var prevStartCursor = this.startCursor;
        var prevEndCursor = this.endCursor;

        var _a = getNextCursors(this.items.map(function (item) {
          return item.key;
        }), nextItems.map(function (item) {
          return item.key;
        }), prevStartCursor, prevEndCursor),
            nextStartCursor = _a.startCursor,
            nextEndCursor = _a.endCursor; // sync items between cursors


        var isChange = nextEndCursor - nextStartCursor !== prevEndCursor - prevStartCursor || prevStartCursor === -1 || nextStartCursor === -1;

        if (!isChange) {
          var prevVisibleItems = prevItems.slice(prevStartCursor, prevEndCursor + 1);
          var nextVisibleItems = nextItems.slice(nextStartCursor, nextEndCursor + 1);
          var visibleResult = diff$1(prevVisibleItems, nextVisibleItems, function (item) {
            return item.key;
          });
          isChange = visibleResult.added.length > 0 || visibleResult.removed.length > 0 || visibleResult.changed.length > 0;
        }

        this.setItems(nextItems);
        this.setCursors(nextStartCursor, nextEndCursor);
        return isChange;
      };

      __proto.getItems = function () {
        return this.items;
      };

      __proto.getVisibleItems = function () {
        var startCursor = this.startCursor;
        var endCursor = this.endCursor;

        if (startCursor === -1) {
          return [];
        }

        return this.items.slice(startCursor, endCursor + 1);
      };

      __proto.getItemByKey = function (key) {
        return this.itemKeys[key];
      };

      __proto.getRenderedVisibleItems = function () {
        var items = this.getVisibleItems();
        var rendered = items.map(function (_a) {
          var startOutline = _a.startOutline,
              endOutline = _a.endOutline;
          var length = startOutline.length;

          if (length === 0 || length !== endOutline.length) {
            return false;
          }

          return startOutline.some(function (pos, i) {
            return endOutline[i] !== pos;
          });
        });
        var startIndex = rendered.indexOf(true);
        var endIndex = rendered.lastIndexOf(true);
        return endIndex === -1 ? [] : items.slice(startIndex, endIndex + 1);
      };

      __proto.destroy = function () {
        this.off();
        this.startCursor = -1;
        this.endCursor = -1;
        this.items = [];
        this.size = 0;
      };

      return Infinite;
    }(Component);

    var Renderer =
    /*#__PURE__*/
    function (_super) {
      __extends(Renderer, _super);

      function Renderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this.items = [];
        _this.container = null;
        _this.rendererKey = 0;
        _this._updateTimer = 0;
        _this._state = {};
        return _this;
      }

      var __proto = Renderer.prototype;

      __proto.updateKey = function () {
        this.rendererKey = Date.now();
      };

      __proto.getItems = function () {
        return this.items;
      };

      __proto.setContainer = function (container) {
        this.container = container;
      };

      __proto.render = function (nextItems, state) {
        return this.syncItems(nextItems, state);
      };

      __proto.update = function (state) {
        var _this = this;

        if (state === void 0) {
          state = {};
        }

        this._state = state;
        this.trigger("update", {
          state: state
        });
        clearTimeout(this._updateTimer);
        this._updateTimer = window.setTimeout(function () {
          _this.trigger("requestUpdate", {
            state: state
          });
        });
      };

      __proto.updated = function (nextElements) {
        var _a, _b;

        if (nextElements === void 0) {
          nextElements = (_b = (_a = this.container) === null || _a === void 0 ? void 0 : _a.children) !== null && _b !== void 0 ? _b : [];
        }

        var diffResult = this._diffResult;
        var isChanged = !!(diffResult.added.length || diffResult.removed.length || diffResult.changed.length);
        var state = this._state;
        this._state = {};
        var nextItems = diffResult.list;
        this.items = nextItems;
        nextItems.forEach(function (item, i) {
          item.element = nextElements[i];
        });
        this.trigger("updated", {
          items: nextItems,
          elements: toArray(nextElements),
          diffResult: this._diffResult,
          state: state,
          isChanged: isChanged
        });
        return isChanged;
      };

      __proto.syncItems = function (items, state) {
        var rendererKey = this.rendererKey;
        var prevItems = this.items;
        var nextItems = items.map(function (item) {
          return __assign(__assign({}, item), {
            renderKey: rendererKey + "_" + item.key
          });
        });
        var result = diff$1(prevItems, nextItems, function (item) {
          return item.renderKey;
        });

        if (state) {
          this._state = state;
        }

        this._diffResult = result;
        return result;
      };

      __proto.destroy = function () {
        this.off();
      };

      return Renderer;
    }(Component);

    var VanillaRenderer =
    /*#__PURE__*/
    function (_super) {
      __extends(VanillaRenderer, _super);

      function VanillaRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = VanillaRenderer.prototype;

      __proto.render = function (nextItems, state) {
        var container = this.container;

        var result = _super.prototype.render.call(this, nextItems, state);

        var prevList = result.prevList,
            removed = result.removed,
            ordered = result.ordered,
            added = result.added,
            list = result.list;

        var diffList = __spreadArrays(prevList);

        removed.forEach(function (index) {
          diffList.splice(index, 1);
          container.removeChild(prevList[index].element);
        });
        ordered.forEach(function (_a) {
          var _b, _c;

          var prevIndex = _a[0],
              nextIndex = _a[1];
          var item = diffList.splice(prevIndex, 1)[0];
          diffList.splice(nextIndex, 0, item);
          container.insertBefore(item.element, (_c = (_b = diffList[nextIndex + 1]) === null || _b === void 0 ? void 0 : _b.element) !== null && _c !== void 0 ? _c : null);
        });
        added.forEach(function (index) {
          var _a, _b;

          var item = list[index];
          diffList.splice(index, 0, item);
          container.insertBefore(item.element, (_b = (_a = diffList[index + 1]) === null || _a === void 0 ? void 0 : _a.element) !== null && _b !== void 0 ? _b : null);
        });
        this.updated(container.children);
        return result;
      };

      return VanillaRenderer;
    }(Renderer);

    var VanillaGridRenderer =
    /*#__PURE__*/
    function (_super) {
      __extends(VanillaGridRenderer, _super);

      function VanillaGridRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = VanillaGridRenderer.prototype;

      __proto.syncItems = function (nextItems) {
        var result = _super.prototype.syncItems.call(this, nextItems);

        var added = result.added,
            list = result.list;
        added.forEach(function (index) {
          var orgItem = nextItems[index].orgItem;

          if (orgItem.html && !orgItem.element) {
            orgItem.element = convertHTMLtoElement(orgItem.html)[0];
          }

          list[index].element = orgItem.element;
        });
        return result;
      };

      return VanillaGridRenderer;
    }(VanillaRenderer);

    var ScrollManager =
    /*#__PURE__*/
    function (_super) {
      __extends(ScrollManager, _super);

      function ScrollManager(wrapper, options) {
        var _this = _super.call(this) || this;

        _this.wrapper = wrapper;
        _this.prevScrollPos = null;
        _this.scrollOffset = 0;
        _this.contentSize = 0;
        _this._isScrollIssue = IS_IOS;

        _this._onCheck = function () {
          var prevScrollPos = _this.getScrollPos();

          var nextScrollPos = _this.getOrgScrollPos();

          _this.setScrollPos(nextScrollPos);

          if (prevScrollPos === null || _this._isScrollIssue && nextScrollPos === 0 || prevScrollPos === nextScrollPos) {
            nextScrollPos && (_this._isScrollIssue = false);
            return;
          }

          _this._isScrollIssue = false;

          _this.trigger(new ComponentEvent$1("scroll", {
            direction: prevScrollPos < nextScrollPos ? "end" : "start",
            scrollPos: nextScrollPos,
            relativeScrollPos: _this.getRelativeScrollPos()
          }));
        };

        _this.options = __assign({
          container: false,
          containerTag: "div",
          horizontal: false
        }, options);

        _this._init();

        return _this;
      }

      var __proto = ScrollManager.prototype;

      __proto.getWrapper = function () {
        return this.wrapper;
      };

      __proto.getContainer = function () {
        return this.container;
      };

      __proto.getScrollContainer = function () {
        return this.scrollContainer;
      };

      __proto.getScrollOffset = function () {
        return this.scrollOffset;
      };

      __proto.getContentSize = function () {
        return this.contentSize;
      };

      __proto.getRelativeScrollPos = function () {
        return (this.prevScrollPos || 0) - this.scrollOffset;
      };

      __proto.getScrollPos = function () {
        return this.prevScrollPos;
      };

      __proto.setScrollPos = function (pos) {
        this.prevScrollPos = pos;
      };

      __proto.getOrgScrollPos = function () {
        var eventTarget = this.eventTarget;
        var horizontal = this.options.horizontal;
        var prop = "scroll" + (horizontal ? "Left" : "Top");

        if (isWindow(eventTarget)) {
          return window[horizontal ? "pageXOffset" : "pageYOffset"] || document.documentElement[prop] || document.body[prop];
        } else {
          return eventTarget[prop];
        }
      };

      __proto.setStatus = function (status) {
        this.contentSize = status.contentSize;
        this.scrollOffset = status.scrollOffset;
        this.prevScrollPos = status.prevScrollPos;
        this.scrollTo(this.prevScrollPos);
      };

      __proto.getStatus = function () {
        return {
          contentSize: this.contentSize,
          scrollOffset: this.scrollOffset,
          prevScrollPos: this.prevScrollPos
        };
      };

      __proto.scrollTo = function (pos) {
        var eventTarget = this.eventTarget;
        var horizontal = this.options.horizontal;

        var _a = horizontal ? [pos, 0] : [0, pos],
            x = _a[0],
            y = _a[1];

        if (isWindow(eventTarget)) {
          eventTarget.scroll(x, y);
        } else {
          eventTarget.scrollLeft = x;
          eventTarget.scrollTop = y;
        }
      };

      __proto.scrollBy = function (pos) {
        if (!pos) {
          return;
        }

        var eventTarget = this.eventTarget;
        var horizontal = this.options.horizontal;

        var _a = horizontal ? [pos, 0] : [0, pos],
            x = _a[0],
            y = _a[1];

        this.prevScrollPos += pos;

        if (isWindow(eventTarget)) {
          eventTarget.scrollBy(x, y);
        } else {
          eventTarget.scrollLeft += x;
          eventTarget.scrollTop += y;
        }
      };

      __proto.resize = function () {
        var scrollContainer = this.scrollContainer;
        var horizontal = this.options.horizontal;
        var scrollContainerRect = scrollContainer === document.body ? {
          top: 0,
          left: 0
        } : scrollContainer.getBoundingClientRect();
        var containerRect = this.container.getBoundingClientRect();
        this.scrollOffset = (this.prevScrollPos || 0) + (horizontal ? containerRect.left - scrollContainerRect.left : containerRect.top - scrollContainerRect.top);
        this.contentSize = horizontal ? scrollContainer.offsetWidth : scrollContainer.offsetHeight;
      };

      __proto.destroy = function () {
        var container = this.container;
        this.eventTarget.removeEventListener("scroll", this._onCheck);

        if (this._isCreateElement) {
          var scrollContainer = this.scrollContainer;
          var fragment_1 = document.createDocumentFragment();
          var childNodes = toArray(container.childNodes);
          scrollContainer.removeChild(container);
          childNodes.forEach(function (childNode) {
            fragment_1.appendChild(childNode);
          });
          scrollContainer.appendChild(fragment_1);
        } else if (this.options.container) {
          container.style.cssText = this._orgCSSText;
        }
      };

      __proto._init = function () {
        var _a;

        var _b = this.options,
            containerOption = _b.container,
            containerTag = _b.containerTag,
            horizontal = _b.horizontal;
        var wrapper = this.wrapper;
        var scrollContainer = wrapper;
        var container = wrapper;
        var containerCSSText = "";

        if (!containerOption) {
          scrollContainer = document.body;
          containerCSSText = container.style.cssText;
        } else {
          if (containerOption instanceof HTMLElement) {
            // Container that already exists
            container = containerOption;
          } else if (containerOption === true) {
            // Create Container
            container = document.createElement(containerTag);
            container.style.position = "relative";
            container.className = CONTAINER_CLASS_NAME;
            var childNodes = toArray(scrollContainer.childNodes);
            childNodes.forEach(function (childNode) {
              container.appendChild(childNode);
            });
            scrollContainer.appendChild(container);
            this._isCreateElement = true;
          } else {
            // Find Container by Selector
            container = scrollContainer.querySelector(containerOption);
          }

          containerCSSText = container.style.cssText;
          var style = scrollContainer.style;
          _a = horizontal ? ["scroll", "hidden"] : ["hidden", "scroll"], style.overflowX = _a[0], style.overflowY = _a[1];

          if (horizontal) {
            container.style.height = "100%";
          }
        }

        var eventTarget = scrollContainer === document.body ? window : scrollContainer;
        eventTarget.addEventListener("scroll", this._onCheck);
        this._orgCSSText = containerCSSText;
        this.container = container;
        this.scrollContainer = scrollContainer;
        this.eventTarget = eventTarget;
        this.resize();
        this.setScrollPos(this.getOrgScrollPos());
      };

      return ScrollManager;
    }(Component);

    /**
     * A module used to arrange items including content infinitely according to layout type. With this module, you can implement various layouts composed of different items whose sizes vary. It guarantees performance by maintaining the number of DOMs the module is handling under any circumstance
     * @ko 콘텐츠가 있는 아이템을 레이아웃 타입에 따라 무한으로 배치하는 모듈. 다양한 크기의 아이템을 다양한 레이아웃으로 배치할 수 있다. 아이템의 개수가 계속 늘어나도 모듈이 처리하는 DOM의 개수를 일정하게 유지해 최적의 성능을 보장한다
     * @extends Component
     * @support {"ie": "9+(with polyfill)", "ch" : "latest", "ff" : "latest",  "sf" : "latest", "edge" : "latest", "ios" : "7+", "an" : "4.X+"}
     * @example
    ```html
    <ul id="grid">
      <li class="card">
        <div>test1</div>
      </li>
      <li class="card">
        <div>test2</div>
      </li>
      <li class="card">
        <div>test3</div>
      </li>
      <li class="card">
        <div>test4</div>
      </li>
      <li class="card">
        <div>test5</div>
      </li>
      <li class="card">
        <div>test6</div>
      </li>
    </ul>
    <script>
    import { MasonryInfiniteGrid } from "@egjs/infinitegrid";
    var some = new MasonryInfiniteGrid("#grid").on("renderComplete", function(e) {
      // ...
    });
    // If you already have items in the container, call "layout" method.
    some.renderItems();
    </script>
    ```
     */

    var InfiniteGrid$2 =
    /*#__PURE__*/
    function (_super) {
      __extends(InfiniteGrid, _super);
      /**
       * @param - A base element for a module <ko>모듈을 적용할 기준 엘리먼트</ko>
       * @param - The option object of the InfiniteGrid module <ko>eg.InfiniteGrid 모듈의 옵션 객체</ko>
       */


      function InfiniteGrid(wrapper, options) {
        var _this = _super.call(this) || this;

        _this._waitType = "";

        _this._onScroll = function (_a) {
          var direction = _a.direction,
              scrollPos = _a.scrollPos,
              relativeScrollPos = _a.relativeScrollPos;

          _this._scroll();
          /**
           * This event is fired when scrolling.
           * @ko 스크롤하면 발생하는 이벤트이다.
           * @event InfiniteGrid#changeScroll
           * @param {InfiniteGrid.OnChangeScroll} e - The object of data to be sent to an event <ko>이벤트에 전달되는 데이터 객체</ko>
           */


          _this.trigger(new ComponentEvent$1(INFINITEGRID_EVENTS.CHANGE_SCROLL, {
            direction: direction,
            scrollPos: scrollPos,
            relativeScrollPos: relativeScrollPos
          }));
        };

        _this._onChange = function (e) {
          _this.setCursors(e.nextStartCursor, e.nextEndCursor);
        };

        _this._onRendererUpdated = function (e) {
          if (!e.isChanged) {
            _this._checkEndLoading();

            _this._scroll();

            return;
          }

          var renderedItems = e.items;
          var _a = e.diffResult,
              added = _a.added,
              removed = _a.removed,
              prevList = _a.prevList,
              list = _a.list;
          removed.forEach(function (index) {
            var orgItem = prevList[index].orgItem;

            if (orgItem.mountState !== MOUNT_STATE.UNCHECKED) {
              orgItem.mountState = MOUNT_STATE.UNMOUNTED;
            }
          });
          renderedItems.forEach(function (item) {
            // set grid element
            var gridItem = item.orgItem;
            gridItem.element = item.element;
          });
          var horizontal = _this.options.horizontal;
          var addedItems = added.map(function (index) {
            var gridItem = list[index].orgItem;
            var element = gridItem.element;

            if (gridItem.type === ITEM_TYPE.VIRTUAL) {
              var cssRect = __assign({}, gridItem.cssRect);

              var rect = gridItem.rect;

              if (!cssRect.width && rect.width) {
                cssRect.width = rect.width;
              }

              if (!cssRect.height && rect.height) {
                cssRect.height = rect.height;
              } // virtual item


              return new GridItem(horizontal, {
                element: element,
                cssRect: cssRect
              });
            }

            return gridItem;
          });
          var _b = e.state,
              isRestore = _b.isRestore,
              isResize = _b.isResize;

          _this.itemRenderer.renderItems(addedItems);

          if (isRestore) {
            _this._onRenderComplete({
              mounted: added.map(function (index) {
                return list[index].orgItem;
              }),
              updated: [],
              isResize: false,
              direction: _this.defaultDirection
            });

            if (isResize) {
              _this.groupManager.renderItems();
            }
          } else {
            _this.groupManager.renderItems();
          }
        };

        _this._onResize = function () {
          _this.renderItems({
            useResize: true
          });
        };

        _this._onRequestAppend = function (e) {
          /**
           * The event is fired when scrolling reaches the end or when data for a virtual group is required.
           * @ko 스크롤이 끝에 도달하거나 virtual 그룹에 대한 데이터가 필요한 경우 이벤트가 발생한다.
           * @event InfiniteGrid#requestAppend
           * @param {InfiniteGrid.OnRequestAppend} e - The object of data to be sent to an event <ko>이벤트에 전달되는 데이터 객체</ko>
           */
          _this._onRequestInsert(DIRECTION.END, INFINITEGRID_EVENTS.REQUEST_APPEND, e);
        };

        _this._onRequestPrepend = function (e) {
          /**
           * The event is fired when scrolling reaches the start or when data for a virtual group is required.
           * @ko 스크롤이 끝에 도달하거나 virtual 그룹에 대한 데이터가 필요한 경우 이벤트가 발생한다.
           * @event InfiniteGrid#requestPrepend
           * @param {InfiniteGrid.OnRequestPrepend} e - The object of data to be sent to an event <ko>이벤트에 전달되는 데이터 객체</ko>
           */
          _this._onRequestInsert(DIRECTION.START, INFINITEGRID_EVENTS.REQUEST_PREPEND, e);
        };

        _this._onContentError = function (_a) {
          var element = _a.element,
              target = _a.target,
              item = _a.item,
              update = _a.update;
          /**
           * The event is fired when scrolling reaches the start or when data for a virtual group is required.
           * @ko 스크롤이 끝에 도달하거나 virtual 그룹에 대한 데이터가 필요한 경우 이벤트가 발생한다.
           * @event InfiniteGrid#contentError
           * @param {InfiniteGrid.OnContentError} e - The object of data to be sent to an event <ko>이벤트에 전달되는 데이터 객체</ko>
           */

          _this.trigger(new ComponentEvent$1(INFINITEGRID_EVENTS.CONTENT_ERROR, {
            element: element,
            target: target,
            item: item,
            update: update,
            remove: function () {
              _this.removeByKey(item.key);
            }
          }));
        };

        _this._onRenderComplete = function (_a) {
          var isResize = _a.isResize,
              mounted = _a.mounted,
              updated = _a.updated,
              direction = _a.direction;
          var infinite = _this.infinite;
          var prevRenderedGroups = infinite.getRenderedVisibleItems();
          var length = prevRenderedGroups.length;
          var isDirectionEnd = direction === DIRECTION.END;

          _this._syncInfinite();

          if (length) {
            var prevStandardGroup = prevRenderedGroups[isDirectionEnd ? 0 : length - 1];
            var nextStandardGroup = infinite.getItemByKey(prevStandardGroup.key);
            var offset = isDirectionEnd ? Math.min.apply(Math, nextStandardGroup.startOutline) - Math.min.apply(Math, prevStandardGroup.startOutline) : Math.max.apply(Math, nextStandardGroup.endOutline) - Math.max.apply(Math, prevStandardGroup.endOutline);

            _this.scrollManager.scrollBy(offset);
          }
          /**
           * This event is fired when the InfiniteGrid has completed rendering.
           * @ko InfiniteGrid가 렌더링이 완료됐을 때 이벤트가 발생한다.
           * @event InfiniteGrid#renderComplete
           * @param {InfiniteGrid.OnRenderComplete} e - The object of data to be sent to an event <ko>이벤트에 전달되는 데이터 객체</ko>
           */


          _this.trigger(new ComponentEvent$1(INFINITEGRID_EVENTS.RENDER_COMPLETE, {
            isResize: isResize,
            direction: direction,
            mounted: mounted.filter(function (item) {
              return item.type !== ITEM_TYPE.LOADING;
            }),
            updated: updated.filter(function (item) {
              return item.type !== ITEM_TYPE.LOADING;
            }),
            startCursor: _this.getStartCursor(),
            endCursor: _this.getEndCursor(),
            items: _this.getVisibleItems(true),
            groups: _this.getVisibleGroups(true)
          }));

          if (_this.groupManager.shouldRerenderItems()) {
            _this._update();
          } else {
            _this._checkEndLoading();

            _this._scroll();
          }
        };

        _this.options = __assign(__assign(__assign({}, _this.constructor.defaultOptions), {
          renderer: new VanillaGridRenderer().on("requestUpdate", function () {
            return _this._render();
          })
        }), options);

        var _a = _this.options,
            gridConstructor = _a.gridConstructor,
            containerTag = _a.containerTag,
            container = _a.container,
            renderer = _a.renderer,
            threshold = _a.threshold,
            useRecycle = _a.useRecycle,
            gridOptions = __rest(_a, ["gridConstructor", "containerTag", "container", "renderer", "threshold", "useRecycle"]); // options.container === false, wrapper = container, scrollContainer = document.body
        // options.container === true, wrapper = scrollContainer, container = wrapper's child
        // options.container === string,


        var horizontal = gridOptions.horizontal,
            attributePrefix = gridOptions.attributePrefix,
            useTransform = gridOptions.useTransform,
            percentage = gridOptions.percentage,
            isConstantSize = gridOptions.isConstantSize,
            isEqualSize = gridOptions.isEqualSize;
        var wrapperElement = isString(wrapper) ? document.querySelector(wrapper) : wrapper;
        var scrollManager = new ScrollManager(wrapperElement, {
          container: container,
          containerTag: containerTag,
          horizontal: horizontal
        }).on({
          scroll: _this._onScroll
        });
        var containerElement = scrollManager.getContainer();
        var containerManager = new ContainerManager(containerElement, {
          horizontal: horizontal
        }).on("resize", _this._onResize);
        var itemRenderer = new ItemRenderer({
          attributePrefix: attributePrefix,
          horizontal: horizontal,
          useTransform: useTransform,
          percentage: percentage,
          isEqualSize: isEqualSize,
          isConstantSize: isConstantSize
        });
        var infinite = new Infinite({
          useRecycle: useRecycle,
          threshold: threshold
        }).on({
          "change": _this._onChange,
          "requestAppend": _this._onRequestAppend,
          "requestPrepend": _this._onRequestPrepend
        });
        infinite.setSize(scrollManager.getContentSize());
        var groupManager = new GroupManager(containerElement, {
          gridConstructor: gridConstructor,
          externalItemRenderer: itemRenderer,
          externalContainerManager: containerManager,
          gridOptions: gridOptions
        });
        groupManager.on({
          "renderComplete": _this._onRenderComplete,
          "contentError": _this._onContentError
        });
        renderer.setContainer(containerElement);
        renderer.on("updated", _this._onRendererUpdated);
        _this.itemRenderer = itemRenderer;
        _this.groupManager = groupManager;
        _this.wrapperElement = wrapperElement;
        _this.scrollManager = scrollManager;
        _this.containerManager = containerManager;
        _this.infinite = infinite;

        _this.containerManager.resize();

        return _this;
      }

      var __proto = InfiniteGrid.prototype;
      /**
       * Rearrange items to fit the grid and render them. When rearrange is complete, the `renderComplete` event is fired.
       * @ko grid에 맞게 아이템을 재배치하고 렌더링을 한다. 배치가 완료되면 `renderComplete` 이벤트가 발생한다.
       * @param - Options for rendering. <ko>렌더링을 하기 위한 옵션.</ko>
       * @example
       * ```ts
       * import { MasonryInfiniteGrid } from "@egjs/infinitegrid";
       * const grid = new MasonryInfiniteGrid();
       *
       * grid.on("renderComplete", e => {
       *   console.log(e);
       * });
       * grid.renderItems();
       * ```
       */

      __proto.renderItems = function (options) {
        if (options === void 0) {
          options = {};
        }

        if (options.useResize) {
          this.containerManager.resize();
        }

        this._resizeScroll();

        if (!this.getRenderingItems().length) {
          var children = toArray(this.getContainerElement().children);

          if (children.length > 0) {
            // no items, but has children
            this.groupManager.syncItems(convertInsertedItems(children));

            this._syncInfinite();

            this.setCursors(0, 0, true);

            this._getRenderer().updated();
          } else {
            this.infinite.scroll(0);
          }

          return this;
        }

        if (!this.getVisibleGroups(true).length) {
          this.setCursors(0, 0);
        } else {
          this.groupManager.renderItems(options);
        }

        return this;
      };
      /**
       * Returns the wrapper element specified by the user.
       * @ko 컨테이너 엘리먼트를 반환한다.
       */


      __proto.getWrapperElement = function () {
        return this.scrollManager.getWrapper();
      };
      /**
       * Returns the container element corresponding to the scroll area.
       * @ko 스크롤 영역에 해당하는 컨테이너 엘리먼트를 반환한다.
       */


      __proto.getScrollContainerElement = function () {
        return this.scrollManager.getScrollContainer();
      };
      /**
       * Returns the container element containing item elements.
       * @ko 아이템 엘리먼트들을 담긴 컨테이너 엘리먼트를 반환한다.
       */


      __proto.getContainerElement = function () {
        return this.scrollManager.getContainer();
      };
      /**
       * When items change, it synchronizes and renders items.
       * @ko items가 바뀐 경우 동기화를 하고 렌더링을 한다.
       * @param - Options for rendering. <ko>렌더링을 하기 위한 옵션.</ko>
       */


      __proto.syncItems = function (items) {
        this.groupManager.syncItems(items);

        this._syncGroups();

        return this;
      };
      /**
       * Change the currently visible groups.
       * @ko 현재 보이는 그룹들을 바꾼다.
       * @param - first index of visible groups. <ko>보이는 그룹의 첫번째 index.</ko>
       * @param - last index of visible groups. <ko>보이는 그룹의 마지막 index.</ko>
       * @param - Whether the first rendering has already been done. <ko>첫 렌더링이 이미 되어있는지 여부.</ko>
       */


      __proto.setCursors = function (startCursor, endCursor, useFirstRender) {
        this.groupManager.setCursors(startCursor, endCursor);
        this.infinite.setCursors(startCursor, endCursor);

        if (useFirstRender) {
          this._syncItems();
        } else {
          this._update();

          this._checkEndLoading();
        }

        return this;
      };
      /**
       * Returns the first index of visible groups.
       * @ko 보이는 그룹들의 첫번째 index를 반환한다.
       */


      __proto.getStartCursor = function () {
        return this.infinite.getStartCursor();
      };
      /**
       * Returns the last index of visible groups.
       * @ko 보이는 그룹들의 마지막 index를 반환한다.
       */


      __proto.getEndCursor = function () {
        return this.infinite.getEndCursor();
      };
      /**
       * Add items at the bottom(right) of the grid.
       * @ko 아이템들을 grid 아래(오른쪽)에 추가한다.
       * @param - items to be added <ko>추가할 아이템들</ko>
       * @param - The group key to be configured in items. It is automatically generated by default. <ko>추가할 아이템에 설정할 그룹 키. 생략하면 값이 자동으로 생성된다.</ko>
       * @return - An instance of a module itself<ko>모듈 자신의 인스턴스</ko>
       * @example
       * ```js
       * ig.append(`<div class="item">test1</div><div class="item">test2</div>`);
       * ig.append([`<div class="item">test1</div>`, `<div class="item">test2</div>`]);
       * ig.append([HTMLElement1, HTMLElement2]);
       * ```
       */


      __proto.append = function (items, groupKey) {
        return this.insert(-1, items, groupKey);
      };
      /**
       * Add items at the top(left) of the grid.
       * @ko 아이템들을 grid 위(왼쪽)에 추가한다.
       * @param - items to be added <ko>추가할 아이템들</ko>
       * @param - The group key to be configured in items. It is automatically generated by default. <ko>추가할 아이템에 설정할 그룹 키. 생략하면 값이 자동으로 생성된다.</ko>
       * @return - An instance of a module itself<ko>모듈 자신의 인스턴스</ko>
       * @example
       * ```ts
       * ig.prepend(`<div class="item">test1</div><div class="item">test2</div>`);
       * ig.prepend([`<div class="item">test1</div>`, `<div class="item">test2</div>`]);
       * ig.prepend([HTMLElement1, HTMLElement2]);
       * ```
       */


      __proto.prepend = function (items, groupKey) {
        return this.insert(0, items, groupKey);
      };
      /**
       * Add items to a specific index.
       * @ko 아이템들을 특정 index에 추가한다.
       * @param - index to add <ko>추가하기 위한 index</ko>
       * @param - items to be added <ko>추가할 아이템들</ko>
       * @param - The group key to be configured in items. It is automatically generated by default. <ko>추가할 아이템에 설정할 그룹 키. 생략하면 값이 자동으로 생성된다.</ko>
       * @return - An instance of a module itself<ko>모듈 자신의 인스턴스</ko>
       * @example
       * ```ts
       * ig.insert(2, `<div class="item">test1</div><div class="item">test2</div>`);
       * ig.insert(3, [`<div class="item">test1</div>`, `<div class="item">test2</div>`]);
       * ig.insert(4, [HTMLElement1, HTMLElement2]);
       * ```
       */


      __proto.insert = function (index, items, groupKey) {
        var nextItemInfos = this.groupManager.getGroupItems();
        var itemInfos = convertInsertedItems(items, groupKey);

        if (index === -1) {
          nextItemInfos.push.apply(nextItemInfos, itemInfos);
        } else {
          nextItemInfos.splice.apply(nextItemInfos, __spreadArrays([index, 0], itemInfos));
        }

        return this.syncItems(nextItemInfos);
      };
      /**
       * Returns the current state of a module such as location information. You can use the setStatus() method to restore the information returned through a call to this method.
       * @ko 아이템의 위치 정보 등 모듈의 현재 상태 정보를 반환한다. 이 메서드가 반환한 정보를 저장해 두었다가 setStatus() 메서드로 복원할 수 있다
       * @param - STATUS_TYPE.NOT_REMOVE = Get all information about items. STATUS_TYPE.REMOVE_INVISIBLE_ITEMS = Get information on visible items only. STATUS_TYPE.MINIMIZE_INVISIBLE_ITEMS = Compress invisible items. You can replace it with a placeholder. STATUS_TYPE.MINIMIZE_INVISIBLE_GROUPS = Compress invisible groups. <ko> STATUS_TYPE.NOT_REMOVE = 모든 아이템들의 정보를 가져온다. STATUS_TYPE.REMOVE_INVISIBLE_ITEMS = 보이는 아이템들의 정보만 가져온다. STATUS_TYPE.MINIMIZE_INVISIBLE_ITEMS = 안보이는 아이템들을 압축한다. placeholder로 대체가 가능하다. STATUS_TYPE.MINIMIZE_INVISIBLE_GROUPS = 안보이는 그룹을 압축한다.</ko>
       */


      __proto.getStatus = function (type) {
        return {
          containerManager: this.containerManager.getStatus(),
          itemRenderer: this.itemRenderer.getStatus(),
          groupManager: this.groupManager.getGroupStatus(type),
          scrollManager: this.scrollManager.getStatus()
        };
      };
      /**
       * You can set placeholders to restore status or wait for items to be added.
       * @ko status 복구 또는 아이템 추가 대기를 위한 placeholder를 설정할 수 있다.
       * @param - The placeholder status. <ko>placeholder의 status</ko>
       */


      __proto.setPlaceholder = function (info) {
        this.groupManager.setPlaceholder(info);
        return this;
      };
      /**
       * You can set placeholders to restore status or wait for items to be added.
       * @ko status 복구 또는 아이템 추가 대기를 위한 placeholder를 설정할 수 있다.
       * @param - The placeholder status. <ko>placeholder의 status</ko>
       */


      __proto.setLoading = function (info) {
        this.groupManager.setLoading(info);
        return this;
      };
      /**
       * Add the placeholder at the end.
       * @ko placeholder들을 마지막에 추가한다.
       * @param - Items that correspond to placeholders. If it is a number, it duplicates the number of copies. <ko>placeholder에 해당하는 아이템들. 숫자면 갯수만큼 복제를 한다.</ko>
       * @param - The group key to be configured in items. It is automatically generated by default. <ko>추가할 아이템에 설정할 그룹 키. 생략하면 값이 자동으로 생성된다.</ko>
       */


      __proto.appendPlaceholders = function (items, groupKey) {
        var _this = this;

        var result = this.groupManager.appendPlaceholders(items, groupKey);

        this._syncGroups(true);

        return __assign(__assign({}, result), {
          remove: function () {
            _this.removePlaceholders({
              groupKey: result.group.groupKey
            });
          }
        });
      };
      /**
       * Add the placeholder at the start.
       * @ko placeholder들을 처음에 추가한다.
       * @param - Items that correspond to placeholders. If it is a number, it duplicates the number of copies. <ko>placeholder에 해당하는 아이템들. 숫자면 갯수만큼 복제를 한다.</ko>
       * @param - The group key to be configured in items. It is automatically generated by default. <ko>추가할 아이템에 설정할 그룹 키. 생략하면 값이 자동으로 생성된다.</ko>
       */


      __proto.prependPlaceholders = function (items, groupKey) {
        var _this = this;

        var result = this.groupManager.prependPlaceholders(items, groupKey);

        this._syncGroups(true);

        return __assign(__assign({}, result), {
          remove: function () {
            _this.removePlaceholders({
              groupKey: result.group.groupKey
            });
          }
        });
      };
      /**
       * Remove placeholders
       * @ko placeholder들을 삭제한다.
       * @param type - Remove the placeholders corresponding to the groupkey. When "start" or "end", remove all placeholders in that direction. <ko>groupkey에 해당하는 placeholder들을 삭제한다. "start" 또는 "end" 일 때 해당 방향의 모든 placeholder들을 삭제한다.</ko>
       */


      __proto.removePlaceholders = function (type) {
        this.groupManager.removePlaceholders(type);

        this._syncGroups(true);
      };
      /**
       * Sets the status of the InfiniteGrid module with the information returned through a call to the getStatus() method.
       * @ko getStatus() 메서드가 저장한 정보로 InfiniteGrid 모듈의 상태를 설정한다.
       * @param - status object of the InfiniteGrid module. <ko>InfiniteGrid 모듈의 status 객체.</ko>
       * @param - Whether the first rendering has already been done. <ko>첫 렌더링이 이미 되어있는지 여부.</ko>
       */


      __proto.setStatus = function (status, useFirstRender) {
        this.itemRenderer.setStatus(status.itemRenderer);
        this.containerManager.setStatus(status.containerManager);
        this.scrollManager.setStatus(status.scrollManager);
        var groupManager = this.groupManager;
        var prevInlineSize = this.containerManager.getInlineSize();
        groupManager.setGroupStatus(status.groupManager);

        this._syncInfinite();

        this.infinite.setCursors(groupManager.getStartCursor(), groupManager.getEndCursor());

        this._getRenderer().updateKey();

        var state = {
          isReisze: this.containerManager.getInlineSize() !== prevInlineSize,
          isRestore: true
        };

        if (useFirstRender) {
          this._syncItems(state);
        } else {
          this._update(state);
        }

        return this;
      };
      /**
       * Removes the group corresponding to index.
       * @ko index에 해당하는 그룹을 제거 한다.
       */


      __proto.removeGroupByIndex = function (index) {
        var nextGroups = this.groupManager.getGroups();
        return this.removeGroupByKey(nextGroups[index].groupKey);
      };
      /**
       * Removes the group corresponding to key.
       * @ko key에 해당하는 그룹을 제거 한다.
       */


      __proto.removeGroupByKey = function (key) {
        var nextItemInfos = this.groupManager.getItems();
        var firstIndex = findIndex(nextItemInfos, function (item) {
          return item.groupKey === key;
        });
        var lastIndex = findLastIndex(nextItemInfos, function (item) {
          return item.groupKey === key;
        });

        if (firstIndex === -1) {
          return this;
        }

        nextItemInfos.splice(firstIndex, lastIndex - firstIndex + 1);
        return this.syncItems(nextItemInfos);
      };
      /**
       * Removes the item corresponding to index.
       * @ko index에 해당하는 아이템을 제거 한다.
       */


      __proto.removeByIndex = function (index) {
        var nextItemInfos = this.getItems(true);
        nextItemInfos.splice(index, 1);
        return this.syncItems(nextItemInfos);
      };
      /**
       * Removes the item corresponding to key.
       * @ko key에 해당하는 아이템을 제거 한다.
       */


      __proto.removeByKey = function (key) {
        var nextItemInfos = this.getItems(true);
        var index = findIndex(nextItemInfos, function (item) {
          return item.key === key;
        });
        return this.removeByIndex(index);
      };
      /**
       * Update the size of the items and render them.
       * @ko 아이템들의 사이즈를 업데이트하고 렌더링을 한다.
       * @param - Items to be updated. <ko>업데이트할 아이템들.</ko>
       * @param - Options for rendering. <ko>렌더링을 하기 위한 옵션.</ko>
       */


      __proto.updateItems = function (items, options) {
        if (options === void 0) {
          options = {};
        }

        this.groupManager.updateItems(items, options);
        return this;
      };
      /**
       * Return all items of InfiniteGrid.
       * @ko InfiniteGrid의 모든 아이템들을 반환한다.
       * @param - Whether to include items corresponding to placeholders. <ko>placeholder에 해당하는 아이템들을 포함할지 여부.</ko>
       */


      __proto.getItems = function (includePlaceholders) {
        return this.groupManager.getGroupItems(includePlaceholders);
      };
      /**
       * Return visible items of InfiniteGrid.
       * @ko InfiniteGrid의 보이는 아이템들을 반환한다.
       * @param - Whether to include items corresponding to placeholders. <ko>placeholder에 해당하는 아이템들을 포함할지 여부.</ko>
       */


      __proto.getVisibleItems = function (includePlaceholders) {
        return this.groupManager.getVisibleItems(includePlaceholders);
      };
      /**
       * Return rendering items of InfiniteGrid.
       * @ko InfiniteGrid의 렌더링 아이템들을 반환한다.
       */


      __proto.getRenderingItems = function () {
        return this.groupManager.getRenderingItems();
      };
      /**
       * Return all groups of InfiniteGrid.
       * @ko InfiniteGrid의 모든 그룹들을 반환한다.
       * @param - Whether to include groups corresponding to placeholders. <ko>placeholder에 해당하는 그룹들을 포함할지 여부.</ko>
       */


      __proto.getGroups = function (includePlaceholders) {
        return this.groupManager.getGroups(includePlaceholders);
      };
      /**
       * Return visible groups of InfiniteGrid.
       * @ko InfiniteGrid의 보이는 그룹들을 반환한다.
       * @param - Whether to include groups corresponding to placeholders. <ko>placeholder에 해당하는 그룹들을 포함할지 여부.</ko>
       */


      __proto.getVisibleGroups = function (includePlaceholders) {
        return this.groupManager.getVisibleGroups(includePlaceholders);
      };
      /**
       * Set to wait to request data.
       * @ko 데이터를 요청하기 위해 대기 상태로 설정한다.
       * @param direction - direction in which data will be added. <ko>데이터를 추가하기 위한 방향.</ko>
       */


      __proto.wait = function (direction) {
        if (direction === void 0) {
          direction = DIRECTION.END;
        }

        this._waitType = direction;

        this._checkStartLoading(direction);
      };
      /**
       * When the data request is complete, it is set to ready state.
       * @ko 데이터 요청이 끝났다면 준비 상태로 설정한다.
       */


      __proto.ready = function () {
        this._waitType = "";
      };
      /**
       * Returns whether it is set to wait to request data.
       * @ko 데이터를 요청하기 위해 대기 상태로 설정되어 있는지 여부를 반환한다.
       */


      __proto.isWait = function () {
        return !!this._waitType;
      };
      /**
       * Releases the instnace and events and returns the CSS of the container and elements.
       * @ko 인스턴스와 이벤트를 해제하고 컨테이너와 엘리먼트들의 CSS를 되돌린다.
       */


      __proto.destroy = function () {
        this.off();
        this.groupManager.destroy();
        this.scrollManager.destroy();
        this.infinite.destroy();
      };

      __proto._getRenderer = function () {
        return this.options.renderer;
      };

      __proto._getRendererItems = function () {
        return this.getRenderingItems().map(function (item) {
          return {
            element: item.element,
            key: item.type + "_" + item.key,
            orgItem: item
          };
        });
      };

      __proto._syncItems = function (state) {
        this._getRenderer().syncItems(this._getRendererItems(), state);
      };

      __proto._render = function (state) {
        this._getRenderer().render(this._getRendererItems(), state);
      };

      __proto._update = function (state) {
        if (state === void 0) {
          state = {};
        }

        this._getRenderer().update(state);
      };

      __proto._resizeScroll = function () {
        var scrollManager = this.scrollManager;
        scrollManager.resize();
        this.infinite.setSize(scrollManager.getContentSize());
      };

      __proto._syncGroups = function (isUpdate) {
        var infinite = this.infinite;

        this._syncInfinite();

        this.groupManager.setCursors(infinite.getStartCursor(), infinite.getEndCursor());

        if (isUpdate) {
          this._update();
        } else {
          this._render();
        }
      };

      __proto._syncInfinite = function () {
        this.infinite.syncItems(this.getGroups(true).map(function (_a) {
          var groupKey = _a.groupKey,
              grid = _a.grid,
              type = _a.type;
          var outlines = grid.getOutlines();
          return {
            key: groupKey,
            isVirtual: type === GROUP_TYPE.VIRTUAL,
            startOutline: outlines.start,
            endOutline: outlines.end
          };
        }));
      };

      __proto._scroll = function () {
        this.infinite.scroll(this.scrollManager.getRelativeScrollPos());
      };

      __proto._onRequestInsert = function (direction, eventType, e) {
        var _this = this;

        if (this._waitType) {
          this._checkStartLoading(this._waitType);

          return;
        }

        this.trigger(new ComponentEvent$1(eventType, {
          groupKey: e.key,
          nextGroupKey: e.nextKey,
          isVirtual: e.isVirtual,
          wait: function () {
            _this.wait(direction);
          },
          ready: function () {
            _this.ready();
          }
        }));
      };

      __proto._checkStartLoading = function (direction) {
        var groupManager = this.groupManager;
        var infinite = this.infinite;

        if (!groupManager.getLoadingType() && infinite.isLoading(direction) && groupManager.startLoading(direction) && groupManager.hasLoadingItem()) {
          this._update();
        }
      };

      __proto._checkEndLoading = function () {
        var groupManager = this.groupManager;
        var loadingType = this.groupManager.getLoadingType();

        if (loadingType && (!this._waitType || !this.infinite.isLoading(loadingType)) && groupManager.endLoading() && groupManager.hasLoadingItem()) {
          this._update();
        }
      };
      InfiniteGrid.defaultOptions = __assign(__assign({}, DEFAULT_GRID_OPTIONS), {
        container: false,
        containerTag: "div",
        renderer: null,
        threshold: 100,
        useRecycle: true
      });
      InfiniteGrid.propertyTypes = INFINITEGRID_PROPERTY_TYPES;
      InfiniteGrid = __decorate([InfiniteGridGetterSetter], InfiniteGrid);
      return InfiniteGrid;
    }(Component);

    /**
     * MasonryInfiniteGrid is a grid that stacks items with the same width as a stack of bricks. Adjust the width of all images to the same size, find the lowest height column, and insert a new item.
     * @ko MasonryInfiniteGrid는 벽돌을 쌓아 올린 모양처럼 동일한 너비를 가진 아이템을 쌓는 레이아웃이다. 모든 이미지의 너비를 동일한 크기로 조정하고, 가장 높이가 낮은 열을 찾아 새로운 이미지를 삽입한다. 따라서 배치된 아이템 사이에 빈 공간이 생기지는 않지만 배치된 레이아웃의 아래쪽은 울퉁불퉁해진다.
     * @param {HTMLElement | string} container - A base element for a module <ko>모듈을 적용할 기준 엘리먼트</ko>
     * @param {MasonryInfiniteGridOptions} options - The option object of the MasonryInfiniteGrid module <ko>MasonryInfiniteGrid 모듈의 옵션 객체</ko>
     */

    var MasonryInfiniteGrid$1 =
    /*#__PURE__*/
    function (_super) {
      __extends(MasonryInfiniteGrid, _super);

      function MasonryInfiniteGrid() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      MasonryInfiniteGrid.propertyTypes = __assign(__assign({}, InfiniteGrid$2.propertyTypes), MasonryGrid.propertyTypes);
      MasonryInfiniteGrid.defaultOptions = __assign(__assign(__assign({}, InfiniteGrid$2.defaultOptions), MasonryGrid.defaultOptions), {
        gridConstructor: MasonryGrid
      });
      MasonryInfiniteGrid = __decorate([InfiniteGridGetterSetter], MasonryInfiniteGrid);
      return MasonryInfiniteGrid;
    }(InfiniteGrid$2);

    const SVELTE_INFINITEGRID_PROPS = [
      "status",
      "useFirstRender",
      "useLoading",
      "usePlaceholder",
      "items",
      "itemBy",
      "groupBy",
    ];

    /* node_modules\@egjs\svelte-infinitegrid\src\InfiniteGrid.svelte generated by Svelte v3.46.3 */
    const file$1 = "node_modules\\@egjs\\svelte-infinitegrid\\src\\InfiniteGrid.svelte";
    const get_default_slot_changes_1 = dirty => ({ visibleItems: dirty & /*visibleItems*/ 8 });
    const get_default_slot_context_1 = ctx => ({ visibleItems: /*visibleItems*/ ctx[3] });
    const get_default_slot_changes = dirty => ({ visibleItems: dirty & /*visibleItems*/ 8 });
    const get_default_slot_context = ctx => ({ visibleItems: /*visibleItems*/ ctx[3] });

    // (138:2) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], get_default_slot_context_1);

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
    				if (default_slot.p && (!current || dirty & /*$$scope, visibleItems*/ 264)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, get_default_slot_changes_1),
    						get_default_slot_context_1
    					);
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
    		id: create_else_block.name,
    		type: "else",
    		source: "(138:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (134:2) {#if $$props.container === true}
    function create_if_block(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], get_default_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", CONTAINER_CLASS_NAME);
    			add_location(div, file$1, 134, 4, 3254);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[10](div);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, visibleItems*/ 264)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
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
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[10](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(134:2) {#if $$props.container === true}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$$props*/ ctx[4].container === true) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let div_levels = [/*attributes*/ ctx[2]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			set_attributes(div, div_data);
    			add_location(div, file$1, 132, 0, 3173);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			/*div_binding_1*/ ctx[11](div);
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
    				if_block.m(div, null);
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*attributes*/ 4 && /*attributes*/ ctx[2]]));
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
    			if_blocks[current_block_type_index].d();
    			/*div_binding_1*/ ctx[11](null);
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
    	validate_slots('InfiniteGrid', slots, ['default']);
    	let { GridClass } = $$props;
    	let { vanillaGrid = null } = $$props;
    	const dispatch = createEventDispatcher();
    	const renderer = new Renderer();
    	let wrapper;
    	let container;
    	let isFirstMount = false;
    	let attributes = {};
    	let visibleItems = [];

    	function updateAttributes(props) {
    		$$invalidate(2, attributes = { ...props });
    		const defaultOptions = GridClass.defaultOptions;
    		delete attributes["GridClass"];

    		for (const name in defaultOptions) {
    			delete attributes[name];
    		}

    		SVELTE_INFINITEGRID_PROPS.forEach(name => {
    			delete attributes[name];
    		});
    	}

    	function getItemInfos() {
    		const items = $$props.items || [];
    		const itemBy = $$props.itemBy || (item => item.key);
    		const groupBy = $$props.groupBy || (item => item.groupKey);

    		return items.map((item, i) => {
    			return {
    				groupKey: groupBy(item, i),
    				key: itemBy(item, i),
    				data: item
    			};
    		});
    	}

    	function updateVisibleChildren(props) {
    		$$invalidate(3, visibleItems = getRenderingItems(getItemInfos(), {
    			grid: vanillaGrid,
    			status: props.status,
    			usePlaceholder: props.usePlaceholder,
    			useFirstRender: props.useFirstRender,
    			useLoading: props.useLoading,
    			horizontal: props.horizontal
    		}));
    	}

    	beforeUpdate(() => {
    		updateAttributes($$props);
    		updateVisibleChildren($$props);
    	});

    	onMount(() => {
    		const defaultOptions = GridClass.defaultOptions;
    		const options = {};

    		for (const name in defaultOptions) {
    			if (name in $$props) {
    				options[name] = $$props[name];
    			}
    		}

    		if (container) {
    			options.container = container;
    		}

    		options.renderer = renderer;
    		$$invalidate(5, vanillaGrid = new GridClass(wrapper, options));

    		for (const name in INFINITEGRID_EVENTS) {
    			const eventName = INFINITEGRID_EVENTS[name];

    			vanillaGrid.on(eventName, e => {
    				dispatch(eventName, e);
    			});
    		}

    		renderer.on("requestUpdate", () => {
    			updateVisibleChildren($$props);
    		});

    		mountRenderingItems(getItemInfos(), {
    			grid: vanillaGrid,
    			status: $$props.status,
    			usePlaceholder: $$props.usePlaceholder,
    			useFirstRender: $$props.useFirstRender,
    			useLoading: $$props.useLoading,
    			horizontal: $$props.horizontal
    		});

    		renderer.updated();
    	});

    	afterUpdate(() => {
    		if (isFirstMount) {
    			isFirstMount = false;
    			return;
    		}

    		const propertyTypes = GridClass.propertyTypes;

    		for (const name in propertyTypes) {
    			if (name in $$props) {
    				$$invalidate(5, vanillaGrid[name] = $$props[name], vanillaGrid);
    			}
    		}

    		renderer.updated();
    	});

    	onDestroy(() => {
    		vanillaGrid && vanillaGrid.destroy();
    	});

    	function getInstance() {
    		return vanillaGrid;
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			container = $$value;
    			$$invalidate(1, container);
    		});
    	}

    	function div_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			wrapper = $$value;
    			$$invalidate(0, wrapper);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(4, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('GridClass' in $$new_props) $$invalidate(6, GridClass = $$new_props.GridClass);
    		if ('vanillaGrid' in $$new_props) $$invalidate(5, vanillaGrid = $$new_props.vanillaGrid);
    		if ('$$scope' in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		beforeUpdate,
    		createEventDispatcher,
    		onDestroy,
    		afterUpdate,
    		INFINITEGRID_EVENTS,
    		Renderer,
    		CONTAINER_CLASS_NAME,
    		getRenderingItems,
    		mountRenderingItems,
    		SVELTE_INFINITEGRID_PROPS,
    		GridClass,
    		vanillaGrid,
    		dispatch,
    		renderer,
    		wrapper,
    		container,
    		isFirstMount,
    		attributes,
    		visibleItems,
    		updateAttributes,
    		getItemInfos,
    		updateVisibleChildren,
    		getInstance
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(4, $$props = assign(assign({}, $$props), $$new_props));
    		if ('GridClass' in $$props) $$invalidate(6, GridClass = $$new_props.GridClass);
    		if ('vanillaGrid' in $$props) $$invalidate(5, vanillaGrid = $$new_props.vanillaGrid);
    		if ('wrapper' in $$props) $$invalidate(0, wrapper = $$new_props.wrapper);
    		if ('container' in $$props) $$invalidate(1, container = $$new_props.container);
    		if ('isFirstMount' in $$props) isFirstMount = $$new_props.isFirstMount;
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    		if ('visibleItems' in $$props) $$invalidate(3, visibleItems = $$new_props.visibleItems);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);

    	return [
    		wrapper,
    		container,
    		attributes,
    		visibleItems,
    		$$props,
    		vanillaGrid,
    		GridClass,
    		getInstance,
    		$$scope,
    		slots,
    		div_binding,
    		div_binding_1
    	];
    }

    class InfiniteGrid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			GridClass: 6,
    			vanillaGrid: 5,
    			getInstance: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InfiniteGrid",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*GridClass*/ ctx[6] === undefined && !('GridClass' in props)) {
    			console.warn("<InfiniteGrid> was created without expected prop 'GridClass'");
    		}
    	}

    	get GridClass() {
    		throw new Error("<InfiniteGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set GridClass(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vanillaGrid() {
    		throw new Error("<InfiniteGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vanillaGrid(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getInstance() {
    		return this.$$.ctx[7];
    	}

    	set getInstance(value) {
    		throw new Error("<InfiniteGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var InfiniteGrid$1 = InfiniteGrid;

    let MasonryInfiniteGrid;

    if (typeof InfiniteGrid$1 === "object") {
      MasonryInfiniteGrid = InfiniteGrid$1;
    } else {
      MasonryInfiniteGrid = class MasonryInfiniteGrid extends InfiniteGrid$1 {
        constructor(options) {
          options.props.GridClass = MasonryInfiniteGrid$1;
          super(options);
        }
      };
    }

    var css_248z = "";
    styleInject(css_248z);

    /* src\App.svelte generated by Svelte v3.46.3 */
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (189:2) {#each visibleItems as item (item.key)}
    function create_each_block(key_1, ctx) {
    	let div1;
    	let div0;
    	let a;
    	let img;
    	let img_src_value;
    	let t;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			a = element("a");
    			img = element("img");
    			t = space();
    			if (!src_url_equal(img.src, img_src_value = `https://naver.github.io/egjs-infinitegrid/assets/image/${/*item*/ ctx[6].key % 33 + 1}.jpg`)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "egjs");
    			set_style(img, "width", "100%");
    			set_style(img, "height", "100%");
    			attr_dev(img, "class", "svelte-10yd5at");
    			add_location(img, file, 192, 3, 3427);
    			attr_dev(a, "href", "https://www.youtube.com/watch?v=oYmqJl4MoNI");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-10yd5at");
    			add_location(a, file, 191, 8, 3353);
    			attr_dev(div0, "class", "thumbnail svelte-10yd5at");
    			add_location(div0, file, 190, 6, 3321);
    			attr_dev(div1, "class", "item svelte-10yd5at");
    			add_location(div1, file, 189, 4, 3296);
    			this.first = div1;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, a);
    			append_dev(a, img);
    			append_dev(div1, t);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*visibleItems*/ 32 && !src_url_equal(img.src, img_src_value = `https://naver.github.io/egjs-infinitegrid/assets/image/${/*item*/ ctx[6].key % 33 + 1}.jpg`)) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(189:2) {#each visibleItems as item (item.key)}",
    		ctx
    	});

    	return block;
    }

    // (178:0) <MasonryInfiniteGrid   class="container"   gap={1}   {items}   on:requestAppend={({ detail: e }) => {     const nextGroupKey = (+e.groupKey || 0) + 1;      items = [...items, ...getItems(nextGroupKey, 10)];   }}   let:visibleItems >
    function create_default_slot(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let each_value = /*visibleItems*/ ctx[5];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[6].key;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

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
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*visibleItems*/ 32) {
    				each_value = /*visibleItems*/ ctx[5];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block, each_1_anchor, get_each_context);
    			}
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(178:0) <MasonryInfiniteGrid   class=\\\"container\\\"   gap={1}   {items}   on:requestAppend={({ detail: e }) => {     const nextGroupKey = (+e.groupKey || 0) + 1;      items = [...items, ...getItems(nextGroupKey, 10)];   }}   let:visibleItems >",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let p1;
    	let t5;
    	let masonryinfinitegrid;
    	let current;

    	masonryinfinitegrid = new MasonryInfiniteGrid({
    			props: {
    				class: "container",
    				gap: 1,
    				items: /*items*/ ctx[0],
    				$$slots: {
    					default: [
    						create_default_slot,
    						({ visibleItems }) => ({ 5: visibleItems }),
    						({ visibleItems }) => visibleItems ? 32 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	masonryinfinitegrid.$on("requestAppend", /*requestAppend_handler*/ ctx[1]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Welcome to Adam's Website";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "He is currently learning Svelte and how to make a personal website. Please check back later for updates.";
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "In the mean time, enjoy these pics.";
    			t5 = space();
    			create_component(masonryinfinitegrid.$$.fragment);
    			attr_dev(h1, "class", "svelte-10yd5at");
    			add_location(h1, file, 171, 1, 2815);
    			add_location(p0, file, 172, 1, 2851);
    			add_location(p1, file, 173, 1, 2964);
    			attr_dev(main, "class", "svelte-10yd5at");
    			add_location(main, file, 170, 0, 2807);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, p0);
    			append_dev(main, t3);
    			append_dev(main, p1);
    			insert_dev(target, t5, anchor);
    			mount_component(masonryinfinitegrid, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const masonryinfinitegrid_changes = {};
    			if (dirty & /*items*/ 1) masonryinfinitegrid_changes.items = /*items*/ ctx[0];

    			if (dirty & /*$$scope, visibleItems*/ 544) {
    				masonryinfinitegrid_changes.$$scope = { dirty, ctx };
    			}

    			masonryinfinitegrid.$set(masonryinfinitegrid_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(masonryinfinitegrid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(masonryinfinitegrid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (detaching) detach_dev(t5);
    			destroy_component(masonryinfinitegrid, detaching);
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

    function getItems(nextGroupKey, count) {
    	const nextItems = [];

    	for (let i = 0; i < count; ++i) {
    		const nextKey = nextGroupKey * count + i;
    		nextItems.push({ groupKey: nextGroupKey, key: nextKey });
    	}

    	return nextItems;
    }

    function instance($$self, $$props, $$invalidate) {
    	let cssVarStyles;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let noteBgColor = '#f4ed2a';
    	let noteColor = '#FF5555';
    	let items = getItems(0, 10);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const requestAppend_handler = ({ detail: e }) => {
    		const nextGroupKey = (+e.groupKey || 0) + 1;
    		$$invalidate(0, items = [...items, ...getItems(nextGroupKey, 10)]);
    	};

    	$$self.$capture_state = () => ({
    		Gallery,
    		handleClick: Gallery,
    		Card,
    		Content,
    		PrimaryAction,
    		Media,
    		MediaContent,
    		noteBgColor,
    		noteColor,
    		MasonryInfiniteGrid,
    		items,
    		getItems,
    		cssVarStyles
    	});

    	$$self.$inject_state = $$props => {
    		if ('noteBgColor' in $$props) $$invalidate(3, noteBgColor = $$props.noteBgColor);
    		if ('noteColor' in $$props) $$invalidate(4, noteColor = $$props.noteColor);
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    		if ('cssVarStyles' in $$props) cssVarStyles = $$props.cssVarStyles;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	cssVarStyles = `--note-color:${noteColor};--note-bg-color:${noteBgColor}`;
    	return [items, requestAppend_handler];
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
    		// name: 'Adam'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
