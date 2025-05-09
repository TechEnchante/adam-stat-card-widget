(function () {
  'use strict';

  (() => {
      const scriptURL = document.currentScript.src;
      const baseURL   = scriptURL.slice(0, scriptURL.lastIndexOf('/') + 1);

      let CARD_HTML, CARD_CSS;
      async function loadAssets() {
        if (CARD_HTML && CARD_CSS) return;         
        [CARD_HTML, CARD_CSS] = await Promise.all([
          fetch(baseURL + 'card.html').then(r => r.text()),
          fetch(baseURL + 'card.css' ).then(r => r.text()),
        ]);
      }

      class AdroStatCard extends HTMLElement {
        static observedAttributes = ['theme']; 
    
        async connectedCallback() {
          await loadAssets();
    
          const shadow = this.attachShadow({ mode: 'open' });
          shadow.innerHTML = `
          <style>${CARD_CSS}</style>
          ${CARD_HTML}
        `;
    
          this.applyTheme(this.getAttribute('theme'));
        }
    
        attributeChangedCallback(name, _old, value) {
          if (name === 'theme') this.applyTheme(value);
        }
    
        applyTheme(theme) {
          this.shadowRoot.querySelector(':host');
          if (theme === 'light') {
            this.shadowRoot.host.style.setProperty('--bg',        '#ffffff');
            this.shadowRoot.host.style.setProperty('--card-bg',   '#f3f4f6');
            this.shadowRoot.host.style.setProperty('--text',      '#111827');
          } else {
            this.shadowRoot.host.style.removeProperty('--bg');
            this.shadowRoot.host.style.removeProperty('--card-bg');
            this.shadowRoot.host.style.removeProperty('--text');
          }
        }
      }
    
      if (!customElements.get('adro-stat-card')) {
        customElements.define('adro-stat-card', AdroStatCard);
      }
    
      window.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.adro-stat-card').forEach(div => {
          if (div.tagName.toLowerCase() === 'adro-stat-card') return;
          const el = document.createElement('adro-stat-card');
          [...div.attributes].forEach(attr => el.setAttribute(attr.name, attr.value));
          el.setAttribute('theme', div.dataset.theme || 'dark'); 
          div.replaceWith(el);
        });
      });
    })();

})();
