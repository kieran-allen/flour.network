const SESSION_STORE_KEY = "ada-pools-data";
const DATA_PROMISE = (async function () {
  if (sessionStorage.getItem(SESSION_STORE_KEY)) {
    return JSON.parse(sessionStorage.getItem(SESSION_STORE_KEY));
  }
  const res = await fetch(
    "https://js.adapools.org/pools/e17da710f1c139e4aacdc0dfe73c3be361cef97ddf3d5e9715c64278/summary.json"
  );
  if (res.ok) {
    const json = await res.json();
    sessionStorage.setItem(SESSION_STORE_KEY, JSON.stringify(json.data));
    return json.data;
  }
  return null;
})();
function lovelaceToAda(lovelaceValue) {
  return lovelaceValue / 1000000;
}
document.addEventListener("DOMContentLoaded", async function () {
  const data = await DATA_PROMISE;
  const locale = navigator.language;
  const format = new Intl.NumberFormat(locale).format;
  const PLEDGE = format(lovelaceToAda(Number(data.pledge)));
  const LIFETIME_BLOCKS = format(Number(data.blocks_lifetime));
  const ACTIVE_STAKE = format(lovelaceToAda(Number(data.active_stake)));
  const COST = format(lovelaceToAda(Number(data.tax_fix)));
  const FEE_PERCENTAGE = Number(data.tax_ratio) * 100;
  document.getElementById("pledge-amount").innerText = PLEDGE;
  document.getElementById("lifetime-blocks").innerText = LIFETIME_BLOCKS;
  document.getElementById("active-stake").innerText = ACTIVE_STAKE;
  document.getElementById("cost-amount").innerText = COST;
  document.getElementById("fee-percentage").innerText = FEE_PERCENTAGE;
});
