;(function(){
    const CART_KEY = 'cart';
  
    // ——— Helpers ———
    function getCart(){
      return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    }
    function saveCart(cart){
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
    function findIndex(cart, id){
      return cart.findIndex(item => item.id === id);
    }
  
    // ——— Cart Operations ———
    function addToCart(newItem){
      const cart = getCart();
      const idx = findIndex(cart, newItem.id);
      if(idx > -1){
        cart[idx].quantity += newItem.quantity;
        cart[idx].color = newItem.color;
        cart[idx].size = newItem.size;
        cart[idx].customSize = newItem.customSize;
      } else {
        cart.push(newItem);
      }
      saveCart(cart);
    }
    function removeFromCart(id){
      let cart = getCart();
      cart = cart.filter(item => item.id !== id);
      saveCart(cart);
    }
    function updateQuantity(id, qty){
      const cart = getCart();
      const idx = findIndex(cart, id);
      if(idx > -1){
        cart[idx].quantity = qty;
        if(cart[idx].quantity < 1) cart.splice(idx,1);
        saveCart(cart);
      }
    }
  
    // ——— Rendering ———
    function updateHeaderCart(){
      const cart = getCart();
      const header = document.querySelector('.header-cart');
      if(!header) return;
  
      header.querySelector('.cart-icon span').textContent = cart.length;
      const wrapper = header.querySelector('.cart-content-wraper');
      wrapper.innerHTML = '';
  
      if(cart.length === 0){
        wrapper.innerHTML = '<p style="padding:1em;">Your cart is empty.</p>';
        return;
      }
  
      let subtotal = 0;
      cart.forEach(item => {
        subtotal += item.price * item.quantity;
        const div = document.createElement('div');
        div.className = 'cart-single-wraper';
        div.innerHTML = `
          <div class="cart-img">
            <a href="#"><img src="${item.image}" alt=""></a>
          </div>
          <div class="cart-content">
            <div class="cart-name"><a href="#">${item.name}</a></div>
            <div class="cart-options" style="font-size:0.9em; color:#555;">
              ${item.color && item.color !== '#' ? `Color: ${item.color}` : ''}
              ${item.size && item.size !== '#' ? ` | Size: ${item.size}` : ''}
              ${item.customSize ? ` | Custom: ${item.customSize}` : ''}
            </div>
            <div class="cart-price">Ksh ${item.price.toFixed(2)}</div>
            <div class="cart-qty">Qty: <span>${item.quantity}</span></div>
          </div>
          <div class="remove">
            <a href="#" class="remove-item" data-id="${item.id}"><i class="zmdi zmdi-close"></i></a>
          </div>
        `;
        wrapper.appendChild(div);
      });
  
      wrapper.insertAdjacentHTML('beforeend', `
        <div class="cart-subtotal">Subtotal: <span>Ksh ${subtotal.toFixed(2)}</span></div>
        <div class="cart-check-btn">
          <div class="view-cart"><a class="btn-def" href="cart.html">View Cart</a></div>
          <div class="check-btn"><a class="btn-def" href="checkout.html">Checkout</a></div>
        </div>
      `);
    }
  
    function renderCartPage(){
      const table = document.querySelector('table.shop_table-2.cart');
      if(!table) return;
      const tbody = table.querySelector('tbody');
      tbody.innerHTML = '';
      const cart = getCart();
      let subtotal = 0;
  
      cart.forEach(item => {
        const lineTotal = item.price * item.quantity;
        subtotal += lineTotal;
        const row = document.createElement('tr');
        row.className = 'cart_item';
        row.innerHTML = `
          <td class="item-img">
            <a href="#"><img src="${item.image}" alt=""></a>
          </td>
          <td class="item-title">
            <a href="#">${item.name}</a>
            <div class="item-options" style="font-size:0.9em; color:#555;">
              ${item.color && item.color !== '#' ? `Color: ${item.color}` : ''}
              ${item.size && item.size !== '#' ? ` | Size: ${item.size}` : ''}
              ${item.customSize ? ` | Custom: ${item.customSize}` : ''}
            </div>
          </td>
          <td class="item-price">Ksh ${item.price.toFixed(2)}</td>
          <td class="item-qty">
            <div class="cart-plus-minus">
              <div class="dec qtybutton">-</div>
              <input
                type="text"
                class="cart-plus-minus-box"
                data-id="${item.id}"
                value="${item.quantity}"
                readonly
              />
              <div class="inc qtybutton">+</div>
            </div>
          </td>
          <td class="total-price"><strong>Ksh ${lineTotal.toFixed(2)}</strong></td>
          <td class="remove-item">
            <a href="#" class="remove-item" data-id="${item.id}">
              <i class="fa fa-trash-o"></i>
            </a>
          </td>
        `;
        tbody.appendChild(row);
      });
  
      const subEl = document.querySelector('.sub-shipping p:first-child span');
      if(subEl) subEl.textContent = `Ksh ${subtotal.toFixed(2)}`;
  
      const totalEl = document.querySelector('.process-cart-total p span');
      if(totalEl) totalEl.textContent = `Ksh ${subtotal.toFixed(2)}`;
    }
  
    function renderCheckoutSummary(){
      const table = document.querySelector('.checkout-area.table');
      if(!table) return;
      const tbody = table.querySelector('tbody');
      tbody.innerHTML = '';
      const cart = getCart();
      let subtotal = 0;
  
      cart.forEach(item => {
        const lineTotal = item.price * item.quantity;
        subtotal += lineTotal;
        const tr = document.createElement('tr');
        tr.className = 'cart_item check-item prd-name';
        tr.innerHTML = `
          <td class="ctg-type">
            ${item.name} × <span>${item.quantity}</span>
            <div style="font-size:0.9em; color:#555;">
              ${item.color && item.color !== '#' ? `Color: ${item.color}` : ''}
              ${item.size && item.size !== '#' ? ` | Size: ${item.size}` : ''}
              ${item.customSize ? ` | Custom: ${item.customSize}` : ''}
            </div>
          </td>
          <td class="cgt-des">Ksh ${lineTotal.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
      });
  
      const subRow = document.createElement('tr');
      subRow.className = 'cart_item';
      subRow.innerHTML = `
        <td class="ctg-type">Subtotal</td>
        <td class="cgt-des">Ksh ${subtotal.toFixed(2)}</td>
      `;
      tbody.appendChild(subRow);
    }
  
    // ——— Event Setup ———
    function setupAddToCart(){
      const btn = document.getElementById('add-to-cart-btn');
      if(!btn) return;
      btn.addEventListener('click', function(e){
        e.preventDefault();
        const id = parseInt(new URLSearchParams(window.location.search).get('id'));
        const name = document.getElementById('product-name').textContent.trim();
        const price = parseFloat(
          document.getElementById('product-price-new')
            .textContent.replace(/[^0-9\.]/g,'')
        );
        const image = document.getElementById('product-image').src;
        const color = document.getElementById('input-sort-color').value;
        const size = document.getElementById('input-sort-size').value;
        const customSize = document.getElementById('custom-size-input').value.trim();
        const quantity = parseInt(document.getElementById('quantity-input').value) || 1;
        addToCart({id,name,price,image,color,size,customSize,quantity});
        updateHeaderCart();
        alert('Added to cart!');
      });
    }
  
    function setupCartListeners(){
      document.body.addEventListener('click', function(e){
        // remove item
        if(e.target.closest('.remove-item')){
          e.preventDefault();
          const id = parseInt(e.target.closest('[data-id]').dataset.id);
          removeFromCart(id);
          updateHeaderCart();
          renderCartPage();
          renderCheckoutSummary();
          return;
        }
        // quantity +/-
        if(e.target.classList.contains('inc') || e.target.classList.contains('dec')){
          e.preventDefault();
          const id = parseInt(e.target.parentElement.querySelector('.cart-plus-minus-box').dataset.id);
          const cart = getCart();
          const idx = findIndex(cart, id);
          if(idx === -1) return;
          const currentQty = cart[idx].quantity;
          const newQty = e.target.classList.contains('inc') ? currentQty + 1 : currentQty - 1;
          if(newQty < 1){
            removeFromCart(id);
          } else {
            updateQuantity(id, newQty);
          }
          updateHeaderCart();
          renderCartPage();
          renderCheckoutSummary();
        }
      });
    }
  
    // ——— Init ———
    document.addEventListener('DOMContentLoaded', function(){
      updateHeaderCart();
      renderCartPage();
      renderCheckoutSummary();
      setupAddToCart();
      setupCartListeners();
    });
  
  })();









































  
