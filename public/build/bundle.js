var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function r(t){return"function"==typeof t}function c(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function s(t){t.parentNode.removeChild(t)}let a;function u(t){a=t}const l=[],i=[],f=[],d=[],p=Promise.resolve();let $=!1;function h(t){f.push(t)}const m=new Set;let g=0;function b(){const t=a;do{for(;g<l.length;){const t=l[g];g++,u(t),y(t.$$)}for(u(null),l.length=0,g=0;i.length;)i.pop()();for(let t=0;t<f.length;t+=1){const e=f[t];m.has(e)||(m.add(e),e())}f.length=0}while(l.length);for(;d.length;)d.pop()();$=!1,m.clear(),u(t)}function y(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(h)}}const _=new Set;function k(t,e){-1===t.$$.dirty[0]&&(l.push(t),$||($=!0,p.then(b)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function x(c,l,i,f,d,p,$,m=[-1]){const g=a;u(c);const y=c.$$={fragment:null,ctx:null,props:p,update:t,not_equal:d,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(l.context||(g?g.$$.context:[])),callbacks:n(),dirty:m,skip_bound:!1,root:l.target||g.$$.root};$&&$(y.root);let x=!1;if(y.ctx=i?i(c,l.props||{},((t,e,...n)=>{const o=n.length?n[0]:e;return y.ctx&&d(y.ctx[t],y.ctx[t]=o)&&(!y.skip_bound&&y.bound[t]&&y.bound[t](o),x&&k(c,t)),e})):[],y.update(),x=!0,o(y.before_update),y.fragment=!!f&&f(y.ctx),l.target){if(l.hydrate){const t=function(t){return Array.from(t.childNodes)}(l.target);y.fragment&&y.fragment.l(t),t.forEach(s)}else y.fragment&&y.fragment.c();l.intro&&((v=c.$$.fragment)&&v.i&&(_.delete(v),v.i(w))),function(t,n,c,s){const{fragment:a,on_mount:u,on_destroy:l,after_update:i}=t.$$;a&&a.m(n,c),s||h((()=>{const n=u.map(e).filter(r);l?l.push(...n):o(n),t.$$.on_mount=[]})),i.forEach(h)}(c,l.target,l.anchor,l.customElement),b()}var v,w;u(g)}function v(e){let n;return{c(){var t,e,o,r;t="main",n=document.createElement(t),n.innerHTML='<h1 class="svelte-1tky8bj">Welcome to Adam&#39;s Website</h1> \n\t<p>He is currently learning Svelte and how to make a personal website. Please check back later for updates.</p>',e=n,o="class",null==(r="svelte-1tky8bj")?e.removeAttribute(o):e.getAttribute(o)!==r&&e.setAttribute(o,r)},m(t,e){!function(t,e,n){t.insertBefore(e,n||null)}(t,n,e)},p:t,i:t,o:t,d(t){t&&s(n)}}}return new class extends class{$destroy(){!function(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}{constructor(t){super(),x(this,t,null,v,c,{})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map