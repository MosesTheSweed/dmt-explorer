import NatcatRenderer from '../components/tokens/NatcatRenderer';

// Registry of DMT collection tickers that have a renderer available.
// Each entry defines:
//   - component: React component that accepts { blockNumber, size }
//   - previewBlock: a representative block number to use as a card thumbnail
//   - autoShow: whether to auto-expand art in mint history

const COLLECTION_RENDERERS = {
    'dmt-natcats': {
        component: NatcatRenderer,
        previewBlock: 829574,
        autoShow: true,
    },
};

export const getRenderer = (ticker) => COLLECTION_RENDERERS[ticker] ?? null;
export const hasRenderer = (ticker) => ticker in COLLECTION_RENDERERS;

export default COLLECTION_RENDERERS;