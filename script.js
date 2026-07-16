const officialLineId = '%40147cfkvk';
const lineUrl = message => `https://line.me/R/oaMessage/${officialLineId}/?${encodeURIComponent(message)}`;

const bookingForm = document.querySelector('#bookingForm');
const serviceSelect = document.querySelector('#serviceSelect');
const hairCondition = document.querySelector('#hairCondition');
const bookingResult = document.querySelector('#bookingResult');
const conditionServices = ['冷燙', '溫熱塑燙', '染髮', '漂髮／挑染'];

function updateHairCondition() {
  const needsCondition = conditionServices.includes(serviceSelect.value);
  hairCondition.hidden = !needsCondition;
  hairCondition.querySelectorAll('select').forEach(field => field.required = needsCondition);
}

serviceSelect.addEventListener('change', updateHairCondition);

bookingForm.addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(bookingForm);
  const service = form.get('service');
  const needsCondition = conditionServices.includes(service);
  const selectedTime = form.get('time');
  const normalHours = selectedTime >= '05:00' && selectedTime <= '23:30';
  const deposit = service === '剪髮' ? 'NT$100' : conditionServices.includes(service) ? 'NT$500' : '由店家確認';
  const conditionSummary = needsCondition
    ? `\n\n【染燙漂髮況】\n目前髮長：${form.get('hairLength')}\n染漂紀錄：${form.get('hairHistory')}\n希望效果：${form.get('hairGoal') || '未填寫'}\n髮況及參考照片：${form.get('photosReady') ? '已準備，將於 LINE 傳送' : '尚未準備／待補'}`
    : '';
  const message = `您好，我想提出皇家造型預約需求：\n\n【基本資料】\n姓名：${form.get('name')}\n手機：${form.get('phone')}\n服務：${service}\n設計師：${form.get('stylist')}\n希望日期：${form.get('date')}\n希望時間：${selectedTime}${normalHours ? '' : '（其他時段，請設計師確認）'}\n參考訂金：${deposit}${conditionSummary}\n\n其他備註：${form.get('note') || '無'}\n\n我了解此訊息是預約需求，需由店家確認設計師、空檔、價格及訂金後才正式成立。`;

  bookingResult.hidden = false;
  bookingResult.innerHTML = `<strong>預約摘要已完成。</strong><br>請點選下方連結開啟官方 LINE，確認訊息後送出；若是染燙漂，請在 LINE 補傳髮況與參考照片。<br><a href="${lineUrl(message)}" target="_blank" rel="noreferrer">開啟官方 LINE 傳送預約需求 →</a>`;
  bookingResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

const assistant = document.querySelector('#assistant');
const overlay = document.querySelector('#overlay');
const chatLog = document.querySelector('#chatLog');
const chatForm = document.querySelector('#chatForm');
const chatInput = document.querySelector('#chatInput');

const answers = {
  price: '剪髮 NT$100–500；冷燙 NT$1,200 起；女士溫熱塑燙依髮長為 NT$3,000／3,500／4,000；染髮依髮長 NT$1,700 起。漂髮退色、挑染與特殊設計需看髮況，由真人報價。完整項目請看頁面的「店內參考價目」。',
  hours: '店內不是 24 小時現場營業。我可以 24 小時接收需求；一般可約 05:00–23:30，臨時預約請至少提前 1 小時。其他時段也能提出，但需由設計師確認。',
  alice: '2號 Alice 擅長頭皮養護、剪、燙、染與整頭漂染，風格以居家好整理、簡單俐落及目標明確的個性造型為主，也接受新客。空檔與指定價格仍需本人確認。',
  deposit: '剪髮訂金 NT$100；燙、染、漂訂金 NT$500。提前一天改期可保留，最多 2 次；當天取消、改期或遲到 15 分鐘，訂金不退。生病、車禍等突發狀況由店員個別處理。',
  booking: '請到頁面的「提出你的預約需求」填寫姓名、電話、服務、設計師、日期與時間。染燙漂還需提供髮長、染漂紀錄及照片。送出後會產生 LINE 摘要，店家確認後才成立預約。',
  human: '可直接聯絡官方 LINE：@147cfkvk，或電話 03-955-6520。價格、空檔、髮況、客訴、退款與特殊情況都會交由真人處理。'
};

function openAssistant() {
  assistant.classList.add('open');
  assistant.setAttribute('aria-hidden', 'false');
  overlay.classList.add('show');
  setTimeout(() => chatInput.focus(), 100);
}

function closeAssistant() {
  assistant.classList.remove('open');
  assistant.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('show');
}

function addBubble(text, type) {
  const bubble = document.createElement('div');
  bubble.className = `bubble ${type}`;
  bubble.textContent = text;
  chatLog.appendChild(bubble);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function classifyQuestion(text) {
  if (/價|多少|費用|剪|燙|染|漂|護髮|頭皮/.test(text)) return 'price';
  if (/時間|營業|幾點|臨時|24/.test(text)) return 'hours';
  if (/alice|愛麗絲|2號|設計師/.test(text.toLowerCase())) return 'alice';
  if (/訂金|取消|改期|遲到|退款/.test(text)) return 'deposit';
  if (/預約|空檔|有空/.test(text)) return 'booking';
  if (/真人|電話|店員|客訴|重做/.test(text)) return 'human';
  return null;
}

document.querySelectorAll('.assistant-trigger').forEach(button => button.addEventListener('click', openAssistant));
document.querySelector('#closeAssistant').addEventListener('click', closeAssistant);
overlay.addEventListener('click', closeAssistant);
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeAssistant(); });

document.querySelectorAll('[data-question]').forEach(button => {
  button.addEventListener('click', () => {
    const key = button.dataset.question;
    addBubble(button.textContent, 'user');
    addBubble(answers[key], 'bot');
    if (key === 'booking') {
      const link = document.createElement('a');
      link.className = 'bubble bot';
      link.href = '#booking';
      link.textContent = '前往填寫預約需求 →';
      link.addEventListener('click', closeAssistant);
      chatLog.appendChild(link);
    }
  });
});

chatForm.addEventListener('submit', event => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  addBubble(text, 'user');
  const key = classifyQuestion(text);
  addBubble(key ? answers[key] : '這個問題需要由真人確認，避免提供錯誤資訊。請聯絡官方 LINE：@147cfkvk，或電話 03-955-6520🙂', 'bot');
  chatInput.value = '';
});
