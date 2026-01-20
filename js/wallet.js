window.Wallet = {
  ton: null,
  address: null,
  balance: 0
};

let tonConnectUI = null;

document.addEventListener("DOMContentLoaded", () => {
  initTonConnect();
});

function initTonConnect() {
  tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: "https://dark-crypto.netlify.app/tonconnect-manifest.json"
  });

  const btn = document.getElementById("connect-wallet");

  tonConnectUI.onStatusChange(async wallet => {
    if (!wallet) {
      Wallet.address = null;
      Wallet.balance = 0;
      renderWallet();
      return;
    }

    Wallet.address = wallet.account.address;
    await fetchBalance();
    renderWallet();
  });

  btn.addEventListener("click", () => {
    tonConnectUI.openModal();
  });

  renderWallet();
}

async function fetchBalance() {
  try {
    const res = await fetch(
      `https://toncenter.com/api/v2/getAddressBalance?address=${Wallet.address}`
    );
    const json = await res.json();
    Wallet.balance = Number(json.result) / 1e9;
  } catch (e) {
    console.error("TON balance error", e);
    Wallet.balance = 0;
  }
}

function renderWallet() {
  const addr = document.getElementById("wallet-address");
  const bal = document.getElementById("wallet-balance");
  const btn = document.getElementById("connect-wallet");

  if (!Wallet.address) {
    addr.textContent = "";
    bal.textContent = "0 TON";
    btn.textContent = "Подключить кошелёк";
    return;
  }

  addr.textContent =
    Wallet.address.slice(0, 6) + "..." + Wallet.address.slice(-4);

  bal.textContent = Wallet.balance.toFixed(2) + " TON";
  btn.textContent = "Кошелёк подключён";
}
