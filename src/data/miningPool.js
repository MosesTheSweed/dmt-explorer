// Known mining pool payout addresses and identifiers
// Sources: blockchain explorers, pool documentation, community research
// This is a best-effort mapping — pools rotate addresses frequently

const MINING_POOLS = {
    // Foundry USA
    'bc1qxhmdufsvnuaaaer4ynz88fspdsxq2h9e9cetdj': 'Foundry USA',
    '1KFHE7w8BhaENAswwryaoccDb6qcT6DbYY': 'Foundry USA',

    // Antpool
    '1AJbsFZ64EVwjghy9T9Vx7grBjFW2H8xN': 'Antpool',
    '12dRugNcdxK39288NjcDV4GX7rMsKCGn6B': 'Antpool',
    'bc1qa5wkgaew2dkv56kfvj49j0av5nml45x9ek9hz6': 'Antpool',
    '1MATrHFGtCkFAbLE5zfCXiPRvKbJQR7bSH': 'Antpool',

    // F2Pool
    '1JLRXD8rUbAoADqZPFBqHhx4ZPMqBFCzqL': 'F2Pool',
    '1GzhWkMmVbgv9oTVFGBFaHPbZRGDrAq5DS': 'F2Pool',
    'bc1qm34lsc65zpw79lxes69zkqmk6ee3ewf0j77s3h': 'F2Pool',

    // Binance Pool
    'bc1qehrzfzqak3hy7k7p2yp5ur2rms0frke7fxp0x9': 'Binance Pool',
    '1Bf9sZvBHPFGVPX71WX2njhd1NXKv5y7v5': 'Binance Pool',

    // Luxor
    '1LuxLa9CNyi4oHCzVTsTZHMkAFqiHv2eaM': 'Luxor',
    'bc1qtfnk3n7nj4p3sxglx9kzf94h5jxk5wlmzl8k3': 'Luxor',

    // ViaBTC
    '1GW4SfTyZBVrztGFhqf8tSWwT9qMJBaQRW': 'ViaBTC',
    '15qSxP1SQcUX3o4nhkfdbygINtu1y1wUNM': 'ViaBTC',
    'bc1q2c7hp35axrh8nk94l68wrq7jzl5h8mrn5u2qvq': 'ViaBTC',

    // Braiins/Slush Pool
    '18cBEMRxXHqzWWCxZNtU91F5sbUNKhL5PX': 'Braiins Pool',

    // MARA Pool
    'bc1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxswvvzej': 'MARA Pool',
    '1MARA4nWQBMZFGPpSHgCqJCVGHXzR4K9NF': 'MARA Pool',

    // CleanSpark
    'bc1qjasf9z3h7w3jspkhtgatgpyvvzgpa2wwd2lr0eh5tx44reyn2k7qrkam7u': 'CleanSpark',

    // Tapscope Bridge (not a miner but frequent in DMT events)
    '3MqUP6G1daVS5YTD8fz3QgwjZortWwxXFd': 'Tapscope Bridge',
    'bc1qprdf80adfz7aekh5nejjfrp3jksc8r929svpxk': 'Tapscope Bridge',
};

// Prefix-based matching for pools that use HD wallet address derivation
const POOL_PREFIXES = [
    { prefix: 'bc1qxhm', name: 'Foundry USA' },
    { prefix: 'bc1qa5w', name: 'Antpool' },
    { prefix: 'bc1qehe', name: 'Binance Pool' },
    { prefix: 'bc1qwqd', name: 'MARA Pool' },
];

export const identifyPool = (address) => {
    if (!address) return null;
    if (MINING_POOLS[address]) return MINING_POOLS[address];
    for (const { prefix, name } of POOL_PREFIXES) {
        if (address.startsWith(prefix)) return name;
    }
    return null;
};

export const shortenAddress = (address, chars = 8) => {
    if (!address) return '—';
    return `${address.slice(0, chars)}...${address.slice(-4)}`;
};

export default MINING_POOLS;