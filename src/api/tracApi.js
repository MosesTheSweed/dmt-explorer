const BASE_URL = import.meta.env.VITE_TRAC_API_URL || 'http://192.168.1.136:5099';

async function get(path) {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return data.result;
}

export function formatBalance(raw, decimals = 0) {
    if (raw === null || raw === undefined) return null;
    if (decimals === 0) return BigInt(raw).toLocaleString();
    const divisor = BigInt(10 ** decimals);
    const whole = BigInt(raw) / divisor;
    const fraction = BigInt(raw) % divisor;
    return `${whole.toLocaleString()}.${fraction.toString().padStart(decimals, '0').slice(0, 4)}`;
}

const api = {
    getSyncStatus: () => get('/getSyncStatus'),
    getBalance: (address, ticker) => get(`/getBalance/${address}/${encodeURIComponent(ticker)}`),
    getAccountTokens: (address) => get(`/getAccountTokens/${address}`),
    getAccountTokensBalance: (address) => get(`/getAccountTokensBalance/${address}`),
    getDeployment: (ticker) => get(`/getDeployment/${encodeURIComponent(ticker)}`),
    getHoldersLength: (ticker) => get(`/getHoldersLength/${encodeURIComponent(ticker)}`),
    getHolders: (ticker, offset = 0, max = 500) => get(`/getHolders/${encodeURIComponent(ticker)}?offset=${offset}&max=${max}`),
    getDmtElementsList: () => get('/getDmtElementsList'),
    getDmtElementsListLength: () => get('/getDmtElementsListLength'),
    getDmtMintHolder: (inscriptionId) => get(`/getDmtMintHolder/${inscriptionId}`),
    getDmtMintHolderByBlock: (block) => get(`/getDmtMintHolderByBlock/${block}`),
    getDmtMintWalletHistoricList: (address, offset = 0, max = 500) =>
        get(`/getDmtMintWalletHistoricList/${address}?offset=${offset}&max=${max}`),
    getDmtMintWalletHistoricListLength: (address) =>
        get(`/getDmtMintWalletHistoricListLength/${address}`),
    getDmtEventByBlock: (block) => get(`/getDmtEventByBlock/${block}`),
    getDmtEventByBlockLength: (block) => get(`/getDmtEventByBlockLength/${block}`),
    getCurrentBlock: () => get('/getCurrentBlock'),
    getReorgs: () => get('/getReorgs'),
};

export default api;