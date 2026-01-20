/* ================== TELEGRAM ================== */

const tg = window.Telegram?.WebApp;
if (tg) tg.expand();

/* ================== CONFIG ================== */

const BALANCE_REFRESH_INTERVAL = 10000;

/* ================== STATE ================== */

window.walletConnected = false;
window.walletAddress = null;
window.walletBalance = 0;

let balanceTimer = null;

/* ================== TON CONNECT ================== */

window.tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://dark-crypto.netlify.app/tonconnect-manifest.json"
});

/* ================== UI ELEMENTS ================== */

const connectBtn = document.getElementById("connectWallet");
const walletStatus = document.getElementById("walletStatus");
const walletInfo = document.getElementById("walletInfo");
const balanceDiv = document.getElementById("balance");

/* ================== HELPERS ================== */

window.shortAddress = function (addr) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
};

/* ================== BALANCE ================== */

window.loadWalletBalance = async function (address) {
  try {
    const res = await fetch(`https://tonapi.io/v2/accounts/${address}`);
    const data = await res.json();

    window.walletBalance = Number(data.balance) / 1e9;
    balanceDiv.innerText = `Баланс: ${window.walletBalance.toFixed(2)} TON`;
  } catch {
    balanceDiv.innerText = "Баланс: ошибка загрузки";
  }
};

/* ================== AUTO REFRESH ================== */

function startBalanceAutoRefresh() {
  stopBalanceAutoRefresh();

  balanceTimer = setInterval(() => {
    if (window.walletConnected && window.walletAddress) {
      window.loadWalletBalance(window.walletAddress);
    }
  }, BALANCE_REFRESH_INTERVAL);
}

function stopBalanceAutoRefresh() {
  if (balanceTimer) {
    clearInterval(balanceTimer);
    balanceTimer = null;
  }
}

/* ================== CONNECT / DISCONNECT ================== */

if (connectBtn) {
  connectBtn.onclick = async () => {
    if (!window.walletConnected) {
      await window.tonConnectUI.openModal();
    } else {
      await window.tonConnectUI.disconnect();
    }
  };
}

/* ================== STATUS CHANGE ================== */

window.tonConnectUI.onStatusChange(async wallet => {
  if (wallet?.account?.address) {
    window.walletConnected = true;
    window.walletAddress = wallet.account.address;

    walletStatus.innerText = "🟢 Кошелёк подключён";
    walletInfo.innerHTML = `
      <div>Сеть: TON Mainnet</div>
      <div>Адрес: ${shortAddress(window.walletAddress)}</div>
    `;

    connectBtn.innerText = "Отключить кошелёк";

    await window.loadWalletBalance(window.walletAddress);
    startBalanceAutoRefresh();
  } else {
    window.walletConnected = false;
    window.walletAddress = null;
    window.walletBalance = 0;

    walletStatus.innerText = "🔴 Кошелёк не подключён";
    walletInfo.innerHTML = "";
    balanceDiv.innerText = "Баланс: 0.00 TON";
    connectBtn.innerText = "Подключить кошелёк";

    stopBalanceAutoRefresh();
  }
});