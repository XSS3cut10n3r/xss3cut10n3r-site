(function(){"use strict";const d=document.querySelector(".theme-toggle"),u=document.documentElement;function W(){const e=localStorage.getItem("theme");return e?e:window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}const $=W();u.setAttribute("data-theme",$);function j(){const e=u.getAttribute("data-theme")==="dark";d&&(d.innerHTML=e?"☀️":"🌙")}window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",e=>{if(!localStorage.getItem("theme")){const t=e.matches?"dark":"light";u.setAttribute("data-theme",t),j()}}),d&&(j(),d.addEventListener("click",()=>{const t=u.getAttribute("data-theme"),e=t==="dark"?"light":"dark";u.setAttribute("data-theme",e),localStorage.setItem("theme",e),j()}));const E=document.querySelector(".reading-progress");if(E){function S(){const e=document.querySelector(".post-content");if(!e)return;const t=window.scrollY,n=e.offsetTop,s=e.offsetHeight,o=window.innerHeight,i=Math.max(0,Math.min(100,(t-n+o)/s*100));E.style.width=i+"%"}window.addEventListener("scroll",S),S()}const a=document.querySelector(".mute-toggle"),D=document.querySelectorAll(".ambient-icon"),s=document.querySelector(".ambient-label"),i=document.querySelector(".volume-slider"),y=document.querySelector(".equalizer");let e=null,t=!1,n={};const o={coffee:{name:"Coffee Shop Ambience",emoji:"☕"},rain:{name:"Gentle Rain",emoji:"🌧️"},fireplace:{name:"Crackling Fireplace",emoji:"🔥"}};function m(){if(!a||!s||!y)return;const n=a.querySelector("i");t&&e?(a.classList.remove("muted"),n&&(n.className="fas fa-volume-up"),a.title="Mute ambient sounds",y.classList.remove("muted"),s.textContent=`Playing: ${o[e].name}`):(a.classList.add("muted"),n&&(n.className="fas fa-volume-mute"),a.title="Play ambient sounds",y.classList.add("muted"),e?s.textContent=`Paused: ${o[e].name}`:s.textContent="Click to start ambient sounds")}async function C(e){if(n[e])return n[e];try{const t=new Audio(`/audio/${e}.mp3`);return t.loop=!0,t.volume=i?i.value:.3,t.addEventListener("error",()=>{console.log(`Could not load ${e} audio file`),s&&(s.textContent=`${o[e].name} not available`),delete n[e]}),new Promise((s,o)=>{t.addEventListener("canplaythrough",()=>{n[e]=t,s(t)}),t.addEventListener("error",()=>{o(new Error(`Audio file not found: ${e}.mp3`))}),setTimeout(()=>{o(new Error(`Audio loading timeout: ${e}.mp3`))},5e3),t.load()})}catch(t){return console.log(`Error loading ${e} audio:`,t),s&&(s.textContent=`${o[e].name} not available`),null}}a&&a.addEventListener("click",async()=>{if(e){const s=n[e];if(s){if(t)s.pause(),t=!1;else try{await s.play(),t=!0}catch(e){console.log("Could not play audio:",e)}m()}}}),D.forEach(i=>{i.addEventListener("click",async()=>{const a=i.dataset.sound;if(e&&n[e]&&(n[e].pause(),t=!1),D.forEach(e=>e.classList.remove("active")),e===a&&!t){{const e=n[a];if(e)try{await e.play(),t=!0,i.classList.add("active")}catch(e){console.log("Could not play audio:",e)}}}else if(e===a&&t)e=null,t=!1;else{e=a;try{const n=await C(a);n?(await n.play(),t=!0,i.classList.add("active")):(t=!1,e=null,s&&(s.textContent=`${o[a].name} not available`))}catch(n){console.log("Could not load or play audio:",n),t=!1,e=null,s&&(s.textContent=`${o[a].name} not available`)}}m()})}),i&&i.addEventListener("input",e=>{const t=e.target.value;Object.values(n).forEach(e=>{e.volume=t});const s=document.querySelectorAll(".equalizer-bar");s.forEach(e=>{e.style.opacity=Math.max(.3,t)})}),m(),document.querySelectorAll(".copy-btn").forEach(e=>{e.addEventListener("click",async t=>{const n=t.target.parentElement.nextElementSibling.textContent;try{await navigator.clipboard.writeText(n),e.textContent="Copied!",e.style.background="rgba(0, 255, 0, 0.3)",setTimeout(()=>{e.textContent="Copy",e.style.background="rgba(255, 255, 255, 0.2)"},2e3)}catch{e.textContent="Failed",setTimeout(()=>{e.textContent="Copy"},2e3)}})});function O(){const e=document.querySelectorAll(".highlight");e.forEach(e=>{const n=e.querySelector("pre"),t=e.querySelector("code");if(t){const s=Array.from(t.classList),n=s.find(e=>e.startsWith("language-"));if(n){const t=n.replace("language-","");e.setAttribute("data-lang",t)}}e.addEventListener("click",async t=>{const n=e.getBoundingClientRect(),s=t.clientX-n.left,o=t.clientY-n.top;if(s>n.width-80&&o<50){t.preventDefault();const n=e.querySelector("code");if(n)try{let t=n.textContent;t=t.replace(/^\s*\d+\s+/gm,"").replace(/^\s*\d+\s*/gm,"").trim(),await navigator.clipboard.writeText(t),e.setAttribute("data-copied","true"),setTimeout(()=>{e.removeAttribute("data-copied")},2e3)}catch(e){console.log("Copy failed:",e)}}})})}O();function R(){const e=document.getElementById("toc-content"),t=document.querySelectorAll(".post-body h2, .post-body h3");if(!e||t.length===0)return;const n=document.createElement("ul");t.forEach((e,t)=>{e.id||(e.id=`heading-${t}`);const o=document.createElement("li"),s=document.createElement("a");s.href=`#${e.id}`,s.textContent=e.textContent,s.addEventListener("click",t=>{t.preventDefault();const n=document.querySelector(".site-header")?.offsetHeight||80,s=e.getBoundingClientRect().top+window.pageYOffset-n-20;window.scrollTo({top:s,behavior:"smooth"})}),o.appendChild(s),n.appendChild(o)}),e.appendChild(n)}function z(){const e=document.querySelectorAll(".post-body h2, .post-body h3"),t=document.querySelectorAll("#toc-content a");if(e.length===0||t.length===0)return;let n=0;e.forEach((e,t)=>{e.getBoundingClientRect().top<=100&&(n=t)}),t.forEach((e,t)=>{e.classList.toggle("active",t===n)})}document.querySelector(".post-body")&&(R(),window.addEventListener("scroll",z),z());const A=document.querySelectorAll(".filter-tags .tag");A.forEach(e=>{e.addEventListener("click",()=>{A.forEach(e=>e.classList.remove("active")),e.classList.add("active");const t=e.dataset.tag||e.textContent.toLowerCase(),n=document.querySelectorAll(".post-item");t==="all"||e.textContent==="All"?n.forEach(e=>{e.style.display="grid"}):n.forEach(e=>{const n=Array.from(e.querySelectorAll(".post-tag-vaporwave")).map(e=>e.textContent.toLowerCase());n.some(e=>e.includes(t))?e.style.display="grid":e.style.display="none"})})}),document.querySelectorAll('a[href^="#"]').forEach(e=>{e.addEventListener("click",function(e){e.preventDefault();const t=document.querySelector(this.getAttribute("href"));t&&t.scrollIntoView({behavior:"smooth",block:"start"})})});const w=document.querySelector(".search-toggle"),b=document.getElementById("searchForm"),l=document.getElementById("searchInput"),c=document.getElementById("searchResults"),x=document.querySelector(".search-close"),k=document.querySelector(".search-submit");let g=[],f=!1;async function P(){const e=document.querySelectorAll(".post-item");if(e.length>0)g=Array.from(e).map(e=>{const t=e.querySelector(".post-title-vaporwave a"),n=e.querySelector(".post-excerpt-vaporwave"),o=e.querySelectorAll(".post-tag-vaporwave"),s=e.querySelector(".post-date");return{title:t?t.textContent:"",url:t?t.href:"",excerpt:n?n.textContent:"",tags:Array.from(o).map(e=>e.textContent),date:s?s.textContent:"",element:e}});else try{const e=await fetch("/"),t=await e.text(),n=new DOMParser,s=n.parseFromString(t,"text/html"),o=s.querySelectorAll(".post-item");g=Array.from(o).map(e=>{const t=e.querySelector(".post-title-vaporwave a"),n=e.querySelector(".post-excerpt-vaporwave"),o=e.querySelectorAll(".post-tag-vaporwave"),s=e.querySelector(".post-date");return{title:t?t.textContent:"",url:t?t.href:"",excerpt:n?n.textContent:"",tags:Array.from(o).map(e=>e.textContent),date:s?s.textContent:"",element:null}})}catch(e){console.log("Could not load search data:",e),g=[]}}function h(){f=!f,f?(b.classList.add("active"),setTimeout(()=>{l.focus()},300)):(b.classList.remove("active"),l.value="",c.innerHTML="",c.classList.remove("has-results"),T())}function T(){const t=document.querySelectorAll(".post-item");t.forEach(e=>{e.style.display="grid",e.style.outline="none"});const n=document.querySelectorAll(".filter-tags .tag");n.forEach(e=>e.classList.remove("active"));const e=document.querySelector('.filter-tags .tag[data-tag="all"]')||document.querySelector(".filter-tags .tag:first-child");e&&e.classList.add("active")}function v(e){if(!e.trim()){c.innerHTML="",c.classList.remove("has-results"),T();return}const t=e.toLowerCase(),n=g.filter(e=>e.title.toLowerCase().includes(t)||e.excerpt.toLowerCase().includes(t)||e.tags.some(e=>e.toLowerCase().includes(t)));K(n,e),B(n)}function K(e,t){if(e.length===0)c.innerHTML=`
        <div class="search-no-results">
          No posts found for "${t}". Try different keywords or browse by tags.
        </div>
      `;else{const n=e.map(e=>`
        <div class="search-result-item" onclick="handleSearchResultClick('${e.url}')">
          <div class="search-result-title">${M(e.title,t)}</div>
          <div class="search-result-excerpt">${M(H(e.excerpt,120),t)}</div>
          <div class="search-result-meta">
            <span>${e.date}</span>
            <span>${e.tags.join(", ")}</span>
          </div>
        </div>
      `).join("");c.innerHTML=n}c.classList.add("has-results")}function U(e){if(h(),window.spa&&e.startsWith("/posts/")){const t=e.split("/posts/")[1].replace("/","");window.spa.showPost(t,!0)}else window.location.href=e}window.handleSearchResultClick=U;function B(e){const t=document.querySelectorAll(".post-item");if(t.length>0){const n=new Set(e.map(e=>e.url));t.forEach(e=>{const t=e.querySelector(".post-title-vaporwave a");t&&n.has(t.href)?(e.style.display="grid",e.style.outline="2px solid var(--accent-primary)"):e.style.display="none"})}}function M(e,t){if(!t.trim())return e;const n=new RegExp(`(${q(t)})`,"gi");return e.replace(n,'<mark style="background: var(--accent-primary); color: white; padding: 0.1rem 0.2rem; border-radius: 3px;">$1</mark>')}function q(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function H(e,t){return e.length<=t?e:e.substr(0,t).trim()+"..."}if(w&&(P(),w.addEventListener("click",h)),x&&x.addEventListener("click",h),l){let e;l.addEventListener("input",t=>{clearTimeout(e),e=setTimeout(()=>{v(t.target.value)},300)}),l.addEventListener("keydown",e=>{e.key==="Enter"&&(e.preventDefault(),v(l.value)),e.key==="Escape"&&h()})}k&&k.addEventListener("click",()=>{v(l.value)}),document.addEventListener("click",e=>{f&&!b.contains(e.target)&&!w.contains(e.target)&&h()}),document.addEventListener("keydown",e=>{if(e.key==="t"&&!e.ctrlKey&&!e.metaKey&&!e.altKey){const e=document.activeElement;e.tagName!=="INPUT"&&e.tagName!=="TEXTAREA"&&d&&d.click()}if(e.key==="m"&&!e.ctrlKey&&!e.metaKey&&!e.altKey){const e=document.activeElement;e.tagName!=="INPUT"&&e.tagName!=="TEXTAREA"&&a&&a.click()}});function I(e){const t=document.querySelector(`[data-sound="${e}"]`);t&&(t.style.opacity="0.5",t.style.transform="scale(0.9)")}function L(e){const t=document.querySelector(`[data-sound="${e}"]`);t&&(t.style.opacity="",t.style.transform="")}async function X(e){if(n[e])return n[e];I(e);const t=new Audio(`/audio/${e}.mp3`);return t.loop=!0,t.volume=i?i.value:.3,t.addEventListener("canplaythrough",()=>{L(e)}),t.addEventListener("error",()=>{L(e),console.log(`Could not load ${e} audio file`),s&&(s.textContent=`${o[e].name} not available`)}),n[e]=t,t}function G(e,t=1e3){e.volume=0;const o=i?i.value:.3,n=20,a=t/n,r=o/n;let s=0;const c=setInterval(()=>{s++,e.volume=Math.min(r*s,o),s>=n&&clearInterval(c)},a)}function Y(e,t=500){const o=e.volume,n=10,i=t/n,a=o/n;let s=0;const r=setInterval(()=>{s++,e.volume=Math.max(o-a*s,0),s>=n&&(clearInterval(r),e.pause())},i)}class N{constructor(){this.postsData=[],this.pagesData=[],this.currentView="home",this.currentPost=null,this.currentPage=null,this.isLoading=!1,this.isRealPostPage=!1,this.isRealPage=!1,this.init()}async init(){this.detectPageType(),await this.loadPostsData(),await this.loadPagesData(),this.setupEventListeners(),this.handleInitialRoute()}detectPageType(){const e=document.querySelector(".post-layout .post-content .post-body"),t=window.location.pathname.startsWith("/posts/");this.isRealPostPage=t&&e,this.isRealPostPage&&(console.log("📄 Detected real post page, SPA overlay disabled"),this.currentView="post")}async loadPostsData(){try{const e=await fetch("/index.json");e.ok?(this.postsData=await e.json(),console.log("📚 Loaded",this.postsData.length,"posts for SPA navigation")):console.log("Could not load posts data for SPA")}catch(e){console.log("Error loading posts data:",e)}}async loadPagesData(){try{const e=await fetch("/pages.json");e.ok?(this.pagesData=await e.json(),console.log("📄 Loaded",this.pagesData.length,"pages for SPA navigation")):console.log("Could not load pages data for SPA")}catch(e){console.log("Error loading pages data:",e)}}setupEventListeners(){this.isRealPostPage?this.addBackToHomeButton():(document.addEventListener("click",e=>{const n=e.target.closest("a");if(!n)return;const t=n.getAttribute("href");if(!t||t.startsWith("http")||t.startsWith("#")||e.ctrlKey||e.metaKey)return;if(console.log("🔗 Link clicked:",t,"Link element:",n),t.startsWith("/posts/")){console.log("📝 Intercepting post link:",t),e.preventDefault(),this.navigateToPost(t);return}const s=this.pagesData.map(e=>e.url),o=t.endsWith("/")?t:t+"/";if(s.includes(o)||s.includes(t)){console.log("📄 Intercepting page link:",t),e.preventDefault(),this.navigateToPage(t);return}console.log("🔗 Allowing normal navigation for:",t)}),window.addEventListener("popstate",e=>{e.state?e.state.type==="post"?this.showPost(e.state.slug,!1):e.state.type==="page"?this.showPage(e.state.slug,!1):e.state.type==="home"&&this.showHome(!1):this.showHome(!1)}),document.addEventListener("keydown",e=>{e.key==="Escape"&&(this.currentView==="post"||this.currentView==="page")&&this.showHome()}))}addBackToHomeButton(){if(document.querySelector(".back-to-home-btn"))return;const e=document.createElement("button");e.className="back-to-home-btn",e.innerHTML='<i class="fas fa-times"></i>',e.title="Back to Home",e.style.cssText=`
        position: fixed;
        top: 2rem;
        right: 2rem;
        z-index: 1000;
        background: var(--bg-secondary);
        border: 2px solid var(--accent-primary);
        border-radius: 50%;
        width: 3rem;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--text-primary);
        font-size: 1.2rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      `,e.addEventListener("mouseenter",()=>{e.style.transform="scale(1.1)",e.style.background="var(--accent-primary)",e.style.color="var(--bg-primary)"}),e.addEventListener("mouseleave",()=>{e.style.transform="scale(1)",e.style.background="var(--bg-secondary)",e.style.color="var(--text-primary)"}),e.addEventListener("click",()=>{window.location.href="/"}),document.body.appendChild(e)}handleInitialRoute(){if(!this.isRealPostPage){const e=window.location.pathname;if(e.startsWith("/posts/")){const t=e.split("/posts/")[1].replace("/","");t&&this.showPost(t,!1)}}}navigateToPost(e){const t=e.split("/posts/")[1].replace("/","");this.showPost(t,!0)}navigateToPage(e){const t=e.replace(/^\/|\/$/g,"");this.showPage(t,!0)}async showPage(e,t=!0){if(this.isLoading)return;this.isLoading=!0,this.currentView="page";let n=this.pagesData.find(t=>{const n=t.url.replace(/^\/|\/$/g,"");return n===e||t.slug===e});if(!n){console.log("Page not found:",e),console.log("Available pages:",this.pagesData.map(e=>({slug:e.slug,url:e.url}))),this.isLoading=!1;return}if(this.currentPage=n,t){const t=`/${e}/`;history.pushState({type:"page",slug:e},n.title,t)}this.createPageOverlay(n),this.isLoading=!1}createPageOverlay(e){const n=document.querySelector(".post-overlay");n&&n.remove();const t=document.createElement("div");t.className="post-overlay";const o=document.querySelector(".logo")?.textContent||"LofiCode";t.innerHTML=`
        <div class="post-overlay-backdrop"></div>
        <div class="post-overlay-content">
          <div class="post-overlay-header">
            <div class="post-overlay-title">
              <a href="/" class="overlay-site-title">${o}</a>
            </div>
            <button class="post-overlay-close" aria-label="Close page">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="post-layout">
            <article class="post-content">
              <header class="post-header">
                <h1 class="post-title">${e.title}</h1>
              </header>
              <div class="post-body">
                ${e.content}
              </div>
            </article>
          </div>
        </div>
      `,document.body.appendChild(t);const i=t.querySelector(".post-overlay-close"),a=t.querySelector(".post-overlay-backdrop"),s=t.querySelector(".overlay-site-title");i.addEventListener("click",()=>this.showHome()),a.addEventListener("click",()=>this.showHome()),s&&s.addEventListener("click",e=>{e.preventDefault(),this.showHome()}),requestAnimationFrame(()=>{t.classList.add("active")}),setTimeout(()=>{O(),this.initializeOverlayAmbientControls(t)},100)}async showPost(e,t=!0){if(this.isLoading)return;this.isLoading=!0,this.currentView="post";let n=this.postsData.find(t=>t.slug===e);if(n||(n=this.postsData.find(t=>{const n=t.url.split("/").filter(Boolean).pop();return n===e})),n||(n=this.postsData.find(t=>{const n=t.url.split("/").filter(Boolean).pop();return n===e||n===e+"/"})),!n){console.log("Post not found:",e),console.log("Available posts:",this.postsData.map(e=>({slug:e.slug,url:e.url}))),this.isLoading=!1;return}if(this.currentPost=n,t){const t=`/posts/${e}/`;history.pushState({type:"post",slug:e},n.title,t)}this.createPostOverlay(n),this.isLoading=!1}createPostOverlay(e){const s=document.querySelector(".post-overlay");s&&s.remove();const o=this.findRelatedPosts(e),n=this.findPrevNextPosts(e),t=document.createElement("div");t.className="post-overlay";const a=document.querySelector(".logo")?.textContent||"LofiCode";t.innerHTML=`
        <div class="post-overlay-backdrop"></div>
        <div class="post-overlay-content">
          <div class="post-overlay-header">
            <div class="post-overlay-title">
              <a href="/" class="overlay-site-title">${a}</a>
            </div>
            <button class="post-overlay-close" aria-label="Close post">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="post-layout">
            <article class="post-content">
              <header class="post-header">
                <div class="post-meta">
                  <span class="post-date">${e.dateFormatted}</span>
                  <div class="reading-time-post">
                    <span class="coffee-cups">${"☕".repeat(Math.max(1,Math.min(5,Math.ceil(e.readingTime/3))))}</span>
                    <span>${e.readingTime} min read</span>
                  </div>
                </div>
                <h1 class="post-title">${e.title}</h1>
                ${e.subtitle?`<p class="post-subtitle">${e.subtitle}</p>`:""}
                ${e.tags&&e.tags.length>0?`
                  <div class="post-tags-header">
                    ${e.tags.map(e=>`<a href="/tags/${e.toLowerCase().replace(/\s+/g,"-")}" class="post-tag">${e}</a>`).join("")}
                  </div>
                `:""}
              </header>
              <div class="post-body">
                ${e.content}
              </div>

              ${o.length>0?`
                <div class="related-posts">
                  <h3>Related Content</h3>
                  <div class="related-grid">
                    ${o.map(e=>`
                      <div class="related-post">
                        <h4><a href="${e.url}" data-spa-link>${e.title}</a></h4>
                        <div class="related-meta">
                          ${e.dateFormatted} •
                          ${"☕".repeat(Math.max(1,Math.ceil(e.readingTime/3)))} ${e.readingTime} min read
                        </div>
                      </div>
                    `).join("")}
                  </div>
                </div>
              `:""}

              ${n.prev||n.next?`
                <nav class="post-navigation">
                  ${n.prev?`
                    <div class="nav-previous">
                      <span class="nav-label">← Previous</span>
                      <a href="${n.prev.url}" data-spa-link class="nav-title">${n.prev.title}</a>
                    </div>
                  `:"<div></div>"}
                  ${n.next?`
                    <div class="nav-next">
                      <span class="nav-label">Next →</span>
                      <a href="${n.next.url}" data-spa-link class="nav-title">${n.next.title}</a>
                    </div>
                  `:"<div></div>"}
                </nav>
              `:""}
            </article>

            <aside class="sidebar">
              <nav class="toc">
                <h4>Contents</h4>
                <div id="toc-content">
                  <!-- TOC will be generated by JavaScript -->
                </div>
              </nav>
            </aside>
          </div>

        </div>
      `,document.body.appendChild(t);const r=t.querySelector(".post-overlay-close"),c=t.querySelector(".post-overlay-backdrop"),i=t.querySelector(".overlay-site-title");r.addEventListener("click",()=>this.showHome()),c.addEventListener("click",()=>this.showHome()),i&&i.addEventListener("click",e=>{e.preventDefault(),this.showHome()});const l=t.querySelectorAll("a[data-spa-link]");l.forEach(e=>{e.addEventListener("click",t=>{t.preventDefault();const n=e.getAttribute("href");if(n&&n.startsWith("/posts/")){const e=n.split("/posts/")[1].replace("/","");this.showPost(e,!0)}})}),requestAnimationFrame(()=>{t.classList.add("active")}),setTimeout(()=>{O(),this.generateOverlayTOC(t),this.initializeOverlayAmbientControls(t)},100)}findRelatedPosts(e){if(!e.tags||e.tags.length===0)return[];const t=this.postsData.filter(t=>t.slug!==e.slug).map(t=>{const n=t.tags?t.tags.filter(t=>e.tags.includes(t)).length:0;return{...t,relevanceScore:n}}).filter(e=>e.relevanceScore>0).sort((e,t)=>t.relevanceScore-e.relevanceScore).slice(0,3);return t}findPrevNextPosts(e){const t=[...this.postsData].sort((e,t)=>new Date(t.date)-new Date(e.date)),n=t.findIndex(t=>t.slug===e.slug);return{prev:n>0?t[n-1]:null,next:n<t.length-1?t[n+1]:null}}initializeOverlayAmbientControls(s){const a=s.querySelector(".mute-toggle"),d=s.querySelectorAll(".ambient-icon"),r=s.querySelector(".ambient-label"),c=s.querySelector(".volume-slider"),l=s.querySelector(".equalizer");if(a&&e){const n=a.querySelector("i");t?(a.classList.remove("muted"),n&&(n.className="fas fa-volume-up"),a.title="Mute ambient sounds",l&&l.classList.remove("muted"),r&&(r.textContent=`Playing: ${o[e].name}`)):(a.classList.add("muted"),n&&(n.className="fas fa-volume-mute"),a.title="Play ambient sounds",l&&l.classList.add("muted"),r&&(r.textContent=`Paused: ${o[e].name}`))}if(e){const n=s.querySelector(`[data-sound="${e}"]`);n&&t&&n.classList.add("active")}c&&i&&(c.value=i.value),a&&a.addEventListener("click",async()=>{if(e){const o=n[e];if(o){if(t)o.pause(),t=!1;else try{await o.play(),t=!0}catch(e){console.log("Could not play audio:",e)}m(),this.updateOverlayAmbientState(s)}}}),d.forEach(i=>{i.addEventListener("click",async()=>{const a=i.dataset.sound;if(e&&n[e]&&(n[e].pause(),t=!1),document.querySelectorAll(".ambient-icon").forEach(e=>e.classList.remove("active")),d.forEach(e=>e.classList.remove("active")),e===a&&!t){{const e=n[a];if(e)try{await e.play(),t=!0,i.classList.add("active");const n=document.querySelector(`[data-sound="${a}"]:not(.post-overlay [data-sound="${a}"])`);n&&n.classList.add("active")}catch(e){console.log("Could not play audio:",e)}}}else if(e===a&&t)e=null,t=!1;else{e=a;try{const n=await C(a);if(n){await n.play(),t=!0,i.classList.add("active");const e=document.querySelector(`[data-sound="${a}"]:not(.post-overlay [data-sound="${a}"])`);e&&e.classList.add("active")}else t=!1,e=null,r&&(r.textContent=`${o[a].name} not available`)}catch(n){console.log("Could not load or play audio:",n),t=!1,e=null,r&&(r.textContent=`${o[a].name} not available`)}}m(),this.updateOverlayAmbientState(s)})}),c&&c.addEventListener("input",e=>{const t=e.target.value;Object.values(n).forEach(e=>{e.volume=t}),i&&(i.value=t);const s=document.querySelectorAll(".equalizer-bar");s.forEach(e=>{e.style.opacity=Math.max(.3,t)})})}updateOverlayAmbientState(n){const s=n.querySelector(".mute-toggle"),i=n.querySelector(".ambient-label"),r=n.querySelector(".equalizer");if(!s||!i||!r)return;const a=s.querySelector("i");t&&e?(s.classList.remove("muted"),a&&(a.className="fas fa-volume-up"),s.title="Mute ambient sounds",r.classList.remove("muted"),i.textContent=`Playing: ${o[e].name}`):(s.classList.add("muted"),a&&(a.className="fas fa-volume-mute"),s.title="Play ambient sounds",r.classList.add("muted"),e?i.textContent=`Paused: ${o[e].name}`:i.textContent="Click to start ambient sounds")}generateOverlayTOC(e){const t=e.querySelector("#toc-content"),n=e.querySelectorAll(".post-body h2, .post-body h3");if(!t||n.length===0)return;const s=document.createElement("ul");n.forEach((t,n)=>{t.id||(t.id=`heading-${n}`);const i=document.createElement("li"),o=document.createElement("a");o.href=`#${t.id}`,o.textContent=t.textContent,o.addEventListener("click",n=>{n.preventDefault();const s=e.querySelector(".post-overlay-content"),o=e.querySelector(".post-overlay-header")?.offsetHeight||60;if(s){const e=t.getBoundingClientRect().top+s.scrollTop-o-20;s.scrollTo({top:e,behavior:"smooth"})}}),i.appendChild(o),s.appendChild(i)}),t.appendChild(s);const o=e.querySelector(".post-overlay-content");o&&(o.addEventListener("scroll",()=>{this.updateOverlayTOC(e)}),this.updateOverlayTOC(e))}updateOverlayTOC(e){const t=e.querySelectorAll(".post-body h2, .post-body h3"),n=e.querySelectorAll("#toc-content a");if(t.length===0||n.length===0)return;const s=e.querySelector(".post-overlay-content");if(!s)return;let o=0;t.forEach((e,t)=>{const n=e.getBoundingClientRect(),i=s.getBoundingClientRect(),a=n.top-i.top;a<=100&&(o=t)}),n.forEach((e,t)=>{e.classList.toggle("active",t===o)})}showHome(e=!0){this.currentView="home",this.currentPost=null;const t=document.querySelector(".post-overlay");t&&(t.classList.remove("active"),setTimeout(()=>{t.remove()},300)),e&&history.pushState({type:"home"},"LofiCode","/")}}let p=null;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{p=new N,window.spa=p}):(p=new N,window.spa=p);const r=document.getElementById("load-more-btn"),_=document.getElementById("load-more-loading"),F=document.getElementById("posts-container");r&&F&&r.addEventListener("click",async()=>{const e=parseInt(r.dataset.loaded),t=parseInt(r.dataset.total),n=3;r.style.display="none",_.style.display="flex";try{const i=await fetch("/index.json"),a=await i.json(),s=a.slice(e,e+n);for(const e of s){const t=await V(e);F.appendChild(t),await new Promise(e=>setTimeout(e,100))}const o=e+s.length;r.dataset.loaded=o,_.style.display="none",o<t&&(r.style.display="flex")}catch(e){console.error("Error loading more posts:",e),_.style.display="none",r.style.display="flex",r.innerHTML='<span class="load-more-text">Error loading posts</span><span class="load-more-icon">😞</span>'}});async function V(e){const t=document.createElement("article");t.className=`post-item${e.featured?" featured":""}`;const s=Math.min(e.readingTime,5),o="☕".repeat(s),i=e.mood?`<span class="post-mood">${e.mood}</span>`:"",a=e.featured?'<span class="featured-badge">✨ Featured</span>':"",n=e.tags&&e.tags.length>0?e.tags.map(e=>`<span class="post-tag-vaporwave">${e}</span>`).join(""):"";return t.innerHTML=`
      <div class="post-content">
        <div class="post-header-inline">
          <h2 class="post-title-vaporwave">
            <a href="${e.url}">${e.title}</a>
          </h2>
        </div>

        <div class="post-date-with-badges">
          <span class="post-date">${e.dateFormatted}</span>
          ${a}
          ${i}
        </div>

        ${e.subtitle?`<p class="post-list-subtitle">${e.subtitle}</p>`:""}

        <p class="post-excerpt-vaporwave">
          ${e.excerpt}
        </p>

        ${n?`<div class="post-tags-vaporwave">${n}</div>`:""}

        <a href="${e.url}" class="continue-reading-vaporwave">
          Read More →
        </a>
      </div>

      <div class="post-meta-sidebar">
        <div class="reading-time-vaporwave">
          <span class="coffee-cups">${o}</span>
          <span>${e.readingTime} min</span>
        </div>
      </div>
    `,t.style.opacity="0",t.style.transform="translateY(20px)",setTimeout(()=>{t.style.transition="opacity 0.5s ease, transform 0.5s ease",t.style.opacity="1",t.style.transform="translateY(0)"},50),t}console.log(`
    ☕ Welcome to LofiCode! ☕

    You found the console! Here are some keyboard shortcuts:

    't' - Toggle theme (light/dark)
    'm' - Mute/unmute ambient sounds

    Built with love, coffee, and way too many interruptions.
    Happy coding! ✨
    `)})()