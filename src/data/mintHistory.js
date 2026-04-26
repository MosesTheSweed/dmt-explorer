/**
 * Given the holder history array and an address, classify the relationship.
 *
 * - 'owned': address currently holds the inscription
 * - 'transferred': address minted or held it at some point but no longer does
 * - 'lost-race': address appears nowhere in the history (mint attempt
 *   that lost to a faster send-to-self in the same block era)
 */
export const classifyMint = (history, address) => {
    if (!history || history.length === 0) return 'lost-race';
    const current = history[history.length - 1];
    if (current.ownr === address) return 'owned';
    const everOwned = history.some(h => h.ownr === address);
    return everOwned ? 'transferred' : 'lost-race';
};

/**
 * Pull the most useful single record from a holder history.
 * The last entry is the current owner — equivalent to what
 * getDmtMintHolder returns.
 */
export const currentRecord = (history) =>
    history && history.length > 0 ? history[history.length - 1] : null;