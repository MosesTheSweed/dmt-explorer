const BASE_URL = import.meta.env.VITE_TRAC_API_URL || 'http://192.168.1.136:5099';

const get = async (path) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
        const res = await fetch(`${BASE_URL}${path}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        return data.result;
    } finally {
        clearTimeout(timeout);
    }
};

const getSlow = async (path) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
        const res = await fetch(`${BASE_URL}${path}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        return data.result;
    } finally {
        clearTimeout(timeout);
    }
};

export const formatBalance = (raw, decimals = 0) => {
    if (raw === null || raw === undefined) return null;
    if (decimals === 0) return BigInt(raw).toLocaleString();
    const divisor = BigInt(10 ** decimals);
    const whole = BigInt(raw) / divisor;
    const fraction = BigInt(raw) % divisor;
    return `${whole.toLocaleString()}.${fraction.toString().padStart(decimals, '0').slice(0, 4)}`;
};

const api = {
    getSyncStatus: () => get('/getSyncStatus'),
    getBalance: (address, ticker) => get(`/getBalance/${address}/${encodeURIComponent(ticker)}`),
    getAccountTokens: (address) => get(`/getAccountTokens/${address}`),
    getAccountTokensBalance: (address) => get(`/getAccountTokensBalance/${address}`),
    getDeployment: (ticker) => get(`/getDeployment/${encodeURIComponent(ticker)}`),
    getHoldersLength: (ticker) => get(`/getHoldersLength/${encodeURIComponent(ticker)}`),
    getHolders: (ticker, offset = 0, max = 500) =>
        get(`/getHolders/${encodeURIComponent(ticker)}?offset=${offset}&max=${max}`),
    getDmtElementsList: () => get('/getDmtElementsList'),
    getDmtElementsListLength: () => get('/getDmtElementsListLength'),
    getDmtMintHolder: (inscriptionId) => get(`/getDmtMintHolder/${inscriptionId}`),
    getDmtMintWalletHistoricList: (address, offset = 0, max = 500) =>
        get(`/getDmtMintWalletHistoricList/${address}?offset=${offset}&max=${max}`),
    getDmtMintWalletHistoricListLength: (address) =>
        get(`/getDmtMintWalletHistoricListLength/${address}`),
    getDmtEventByBlock: (block) => getSlow(`/getDmtEventByBlock/${block}`),
    getDmtEventByBlockLength: (block) => getSlow(`/getDmtEventByBlockLength/${block}`),
    getDmtMintHolderByBlock: (block) => get(`/getDmtMintHolderByBlock/${block}`),
    getCurrentBlock: () => get('/getCurrentBlock'),
    getReorgs: () => get('/getReorgs'),
    getTransferable: (address, ticker) =>
        get(`/getTransferable/${address}/${encodeURIComponent(ticker)}`),
    getBitmapByInscription: (inscriptionId) => get(`/getBitmapByInscription/${inscriptionId}`),
    getBitmapWalletHistoricList: (address) => get(`/getBitmapWalletHistoricList/${address}`),
    getBitmapWalletHistoricListLength: (address) => get(`/getBitmapWalletHistoricListLength/${address}`),
    getDmtMintHoldersHistoryList: (inscriptionId) =>
        get(`/getDmtMintHoldersHistoryList/${inscriptionId}`),
    getDmtMintHoldersHistoryListLength: (inscriptionId) =>
        get(`/getDmtMintHoldersHistoryListLength/${inscriptionId}`),
};

export default api;