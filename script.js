const products=[
  {name:'日常保濕洗髮精',type:'柔順・清新',price:680,color:'#8a6757'},
  {name:'深層修護護髮素',type:'滋養・修復',price:780,color:'#b59a80'},
  {name:'矯色洗髮精',type:'霧感髮色專用',price:850,color:'#6c6570'},
  {name:'免沖洗護髮噴霧',type:'輕盈・防毛躁',price:720,color:'#9a7c64'},
  {name:'自然質感髮泥',type:'輕塑型・不黏膩',price:620,color:'#52584e'}
];
let cart=[];const grid=document.querySelector('#productGrid');const fmt=n=>`NT$${n.toLocaleString('zh-TW')}`;
grid.innerHTML=products.map((p,i)=>`<article class="product"><div class="product-art"><div class="bottle" style="--bottle:${p.color}"></div></div><h3>${p.name}</h3><p>${p.type} · ${fmt(p.price)}</p><button data-id="${i}">加入購物袋</button></article>`).join('');
document.querySelectorAll('.product button').forEach(b=>b.onclick=()=>{cart.push(products[+b.dataset.id]);renderCart();openCart()});
const cartEl=document.querySelector('#cart'),overlay=document.querySelector('#overlay');function openCart(){cartEl.classList.add('open');overlay.classList.add('show');cartEl.setAttribute('aria-hidden','false')}function closeCart(){cartEl.classList.remove('open');overlay.classList.remove('show');cartEl.setAttribute('aria-hidden','true')}document.querySelector('#cartButton').onclick=openCart;document.querySelector('#closeCart').onclick=closeCart;overlay.onclick=closeCart;
function renderCart(){document.querySelector('#cartCount').textContent=cart.length;document.querySelector('#cartTotal').textContent=fmt(cart.reduce((n,p)=>n+p.price,0));document.querySelector('#cartItems').innerHTML=cart.length?cart.map((p,i)=>`<div class="cart-row"><span>${p.name}<br><small>${fmt(p.price)}</small></span><button data-remove="${i}">移除</button></div>`).join(''):'<p class="empty">尚未加入商品</p>';document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{cart.splice(+b.dataset.remove,1);renderCart()})}
const lineId='%40147cfkvk';const lineUrl=message=>`https://line.me/R/oaMessage/${lineId}/?${encodeURIComponent(message)}`;function showResult(parent,message,label){let box=parent.querySelector('.result');if(!box){box=document.createElement('div');box.className='result';box.style.cssText='background:#e7eee8;border-left:3px solid #5d8065;padding:12px;margin-top:14px;font-size:13px';parent.append(box)}box.innerHTML=`<strong>內容已產生。</strong><br>請確認資料後，<a href="${lineUrl(message)}" target="_blank" rel="noreferrer">點此開啟 LINE ${label}</a>。`}
document.querySelector('#bookingForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);const message=`您好，我想預約皇家造型美髮：\n姓名：${f.get('name')}\n手機：${f.get('phone')}\n服務：${f.get('service')}\n設計師：${f.get('stylist')}\n日期：${f.get('date')}（${f.get('time')}）\n備註：${f.get('note')}\n請協助確認空檔與訂金方式，謝謝。`;showResult(e.target,message,'送出預約')};
document.querySelector('#checkout').onclick=()=>{if(!cart.length)return;const message=`您好，我想訂購以下洗護商品：\n${cart.map(p=>`・${p.name} ${fmt(p.price)}`).join('\n')}\n合計：${fmt(cart.reduce((n,p)=>n+p.price,0))}\n請告知付款與取貨／寄送方式，謝謝。`;showResult(document.querySelector('.cart-footer'),message,'送出訂單')};
