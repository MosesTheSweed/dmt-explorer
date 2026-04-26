import {useState} from 'react';
import {
    Box, Typography, Paper, Grid, Chip,
    CircularProgress, Divider, TextField
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import {useNavigate} from 'react-router-dom';
import {useTracApi} from '../../hooks/useTracApi';
import api, {formatBalance} from '../../api/tracApi';
import {identifyPool, shortenAddress} from "../../data/miningPool.js";

const NAT_ACTIVATION_BLOCK = 885588;

const StatCard = ({label, value, color = 'text.primary'}) => (
    <Paper sx={{p: 2}}>
        <Typography variant="overline" sx={{display: 'block', lineHeight: 1.2, mb: 0.5}}>
            {label}
        </Typography>
        <Typography variant="h4" sx={{color}}>
            {value ?? '—'}
        </Typography>
    </Paper>
);

const BlockEventRow = ({event, index}) => {
    const navigate = useNavigate();
    const natVal = event.val ? BigInt(event.val).toLocaleString() : '—';
    const poolName = identifyPool(event.ownr);

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 2, py: 1,
                '&:hover': {backgroundColor: 'rgba(168,85,247,0.05)', cursor: 'pointer'},
            }}
                 onClick={() => navigate(`/portfolio?address=${event.ownr}`)}
            >
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0}}>
                    <Typography variant="caption" sx={{
                        color: 'text.disabled', minWidth: 24, fontFamily: 'monospace'
                    }}>
                        {String(index + 1).padStart(2, '0')}
                    </Typography>
                    <Box sx={{minWidth: 0}}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            <Typography variant="caption" sx={{
                                fontFamily: 'monospace', color: 'text.secondary',
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                                {shortenAddress(event.ownr)}
                            </Typography>
                            {poolName && (
                                <Chip label={poolName} size="small" sx={{
                                    height: 14, fontSize: '0.55rem', flexShrink: 0,
                                    backgroundColor: 'rgba(34,197,94,0.12)',
                                    color: 'success.main',
                                }}/>
                            )}
                        </Box>
                        <Box sx={{display: 'flex', gap: 1, mt: 0.25}}>
                            <Chip label={event.tick} size="small" sx={{
                                height: 14, fontSize: '0.55rem',
                                backgroundColor: 'rgba(168,85,247,0.15)',
                                color: 'primary.light',
                            }}/>
                            <Typography variant="caption" sx={{color: 'text.disabled', fontSize: '0.65rem'}}>
                                BTC block {event.dmtblck?.toLocaleString()}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Typography variant="caption" sx={{
                    fontFamily: 'monospace', color: 'secondary.main',
                    fontWeight: 600, flexShrink: 0, ml: 2,
                }}>
                    {natVal}
                </Typography>
            </Box>
            <Divider sx={{borderColor: '#2e2845'}}/>
        </Box>
    );
};

const RecentBlockEvents = ({block}) => {
    const {data: events, loading, error} = useTracApi(
        () => api.getDmtEventByBlock(block), [block]
    );
    const {data: eventCount} = useTracApi(
        () => api.getDmtEventByBlockLength(block), [block]
    );

    if (loading) return (
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, py: 2}}>
            <CircularProgress size={14} sx={{color: 'primary.main'}}/>
            <Typography variant="body2">Loading block {block?.toLocaleString()} events...</Typography>
        </Box>
    );

    if (error || !events || events.length === 0) return (
        <Paper sx={{p: 2}}>
            <Typography variant="body2" sx={{color: 'text.disabled'}}>
                No DMT events found for block {block?.toLocaleString()} — try a different block.
            </Typography>
        </Paper>
    );

    const totalNat = events.reduce((sum, e) => sum + BigInt(e.val ?? 0), BigInt(0));
    const uniqueOwners = new Set(events.map(e => e.ownr)).size;
    const tickers = [...new Set(events.map(e => e.tick))];

    return (
        <Box>
            <Box sx={{display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap'}}>
                <Box sx={{
                    px: 1.5, py: 1,
                    backgroundColor: 'rgba(168,85,247,0.05)',
                    border: '0.5px solid #2e2845',
                    borderRadius: 1,
                }}>
                    <Typography variant="caption" sx={{color: 'text.disabled', display: 'block'}}>
                        Total events
                    </Typography>
                    <Typography variant="body2" sx={{color: 'primary.light', fontWeight: 500}}>
                        {eventCount?.toLocaleString() ?? events.length}
                    </Typography>
                </Box>
                <Box sx={{
                    px: 1.5, py: 1,
                    backgroundColor: 'rgba(249,115,22,0.05)',
                    border: '0.5px solid #2e2845',
                    borderRadius: 1,
                }}>
                    <Typography variant="caption" sx={{color: 'text.disabled', display: 'block'}}>
                        Total NAT minted
                    </Typography>
                    <Typography variant="body2" sx={{color: 'secondary.main', fontWeight: 500}}>
                        {totalNat.toLocaleString()}
                    </Typography>
                </Box>
                <Box sx={{
                    px: 1.5, py: 1,
                    backgroundColor: 'rgba(34,197,94,0.05)',
                    border: '0.5px solid #2e2845',
                    borderRadius: 1,
                }}>
                    <Typography variant="caption" sx={{color: 'text.disabled', display: 'block'}}>
                        Unique minters
                    </Typography>
                    <Typography variant="body2" sx={{color: 'success.main', fontWeight: 500}}>
                        {uniqueOwners}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap'}}>
                {tickers.map(t => (
                    <Chip key={t} label={t} size="small" sx={{
                        height: 18, fontSize: '0.65rem',
                        backgroundColor: 'rgba(168,85,247,0.12)',
                        color: 'primary.light',
                    }}/>
                ))}
            </Box>

            <Paper sx={{overflow: 'hidden'}}>
                {events.slice(0, 50).map((event, i) => (
                    <BlockEventRow key={event.ins ?? i} event={event} index={i}/>
                ))}
            </Paper>
        </Box>
    );
};
const SIGNIFICANT_BLOCKS = [
    { block: 885588, label: 'Activation' },
    { block: 885590, label: 'First batch' },
];

const MAX_HISTORY = 4;

const loadHistory = () => {
    try {
        return JSON.parse(localStorage.getItem('nat-block-history') || '[]');
    } catch { return []; }
};

const saveHistory = (block, current) => {
    const updated = [block, ...current.filter(b => b !== block)].slice(0, MAX_HISTORY);
    try { localStorage.setItem('nat-block-history', JSON.stringify(updated)); } catch {}
    return updated;
};

const NatDistribution = () => {
    const [inputBlock, setInputBlock] = useState('');
    const [selectedBlock, setSelectedBlock] = useState(885590);
    const [history, setHistory] = useState(loadHistory);

    const { data: currentBlock } = useTracApi(() => api.getCurrentBlock(), []);
    const { data: holdersLen } = useTracApi(() => api.getHoldersLength('dmt-nat'), []);

    const blocksSinceActivation = currentBlock
        ? currentBlock - NAT_ACTIVATION_BLOCK
        : null;

    const handleSelectBlock = (block) => {
        setSelectedBlock(block);
        setInputBlock(String(block));
        setHistory(prev => saveHistory(block, prev));
    };

    const handleSearch = () => {
        const block = Number(inputBlock);
        if (block > 0) handleSelectBlock(block);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <BarChartIcon sx={{ color: 'primary.main' }} />
                <Typography variant="h2">NAT distribution</Typography>
                <Chip label="post-885,588" size="small" sx={{
                    backgroundColor: 'rgba(249,115,22,0.12)',
                    color: 'secondary.main', fontSize: '0.7rem',
                }} />
            </Box>

            <Grid container spacing={1.5} sx={{ mb: 3 }}>
                <Grid xs={6} sm={3}>
                    <StatCard label="Current block" value={currentBlock?.toLocaleString()} color="secondary.main" />
                </Grid>
                <Grid xs={6} sm={3}>
                    <StatCard label="Blocks since activation" value={blocksSinceActivation?.toLocaleString()} color="primary.light" />
                </Grid>
                <Grid xs={6} sm={3}>
                    <StatCard label="DMT-NAT holders" value={holdersLen != null ? Number(holdersLen).toLocaleString() : null} color="success.main" />
                </Grid>
                <Grid xs={6} sm={3}>
                    <StatCard label="Activation block" value="885,588" />
                </Grid>
            </Grid>

            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="h3">Block events</Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>

                    {/* Significant blocks */}
                    {SIGNIFICANT_BLOCKS.map(({ block, label }) => (
                        <Box
                            key={block}
                            onClick={() => handleSelectBlock(block)}
                            sx={{
                                px: 1.5, py: 0.5, borderRadius: 1, cursor: 'pointer',
                                border: `0.5px solid ${selectedBlock === block ? '#f97316' : '#2e2845'}`,
                                backgroundColor: selectedBlock === block ? 'rgba(249,115,22,0.12)' : 'transparent',
                            }}
                        >
                            <Typography variant="caption" sx={{
                                fontFamily: 'monospace', display: 'block', lineHeight: 1.2,
                                color: selectedBlock === block ? 'secondary.main' : 'text.secondary',
                                fontSize: '0.7rem',
                            }}>
                                {label}
                            </Typography>
                            <Typography variant="caption" sx={{
                                fontFamily: 'monospace',
                                color: selectedBlock === block ? 'secondary.light' : 'text.disabled',
                                fontSize: '0.65rem',
                            }}>
                                {block.toLocaleString()}
                            </Typography>
                        </Box>
                    ))}

                    {/* User history */}
                    {history.filter(b => !SIGNIFICANT_BLOCKS.find(s => s.block === b)).map(block => (
                        <Box
                            key={block}
                            onClick={() => handleSelectBlock(block)}
                            sx={{
                                px: 1.5, py: 0.5, borderRadius: 1, cursor: 'pointer',
                                border: `0.5px solid ${selectedBlock === block ? '#a855f7' : '#2e2845'}`,
                                backgroundColor: selectedBlock === block ? 'rgba(168,85,247,0.12)' : 'transparent',
                            }}
                        >
                            <Typography variant="caption" sx={{
                                fontFamily: 'monospace', display: 'block', lineHeight: 1.2,
                                color: 'text.disabled', fontSize: '0.65rem',
                            }}>
                                recent
                            </Typography>
                            <Typography variant="caption" sx={{
                                fontFamily: 'monospace',
                                color: selectedBlock === block ? 'primary.light' : 'text.secondary',
                                fontSize: '0.65rem',
                            }}>
                                {block.toLocaleString()}
                            </Typography>
                        </Box>
                    ))}

                    {/* Input */}
                    <TextField
                        value={inputBlock}
                        onChange={e => setInputBlock(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        placeholder="enter block..."
                        size="small"
                        sx={{
                            width: 130,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'background.paper',
                                '& fieldset': { borderColor: 'success.dark' },
                                '&:hover fieldset': { borderColor: 'success.main' },
                                '&.Mui-focused fieldset': { borderColor: 'success.main', borderWidth: 1 },
                            },
                            '& input': {
                                color: 'text.primary', fontSize: '0.75rem',
                                fontFamily: 'monospace', py: '4px', px: '10px',
                            },
                        }}
                    />
                </Box>
            </Box>

            <RecentBlockEvents block={selectedBlock} />
        </Box>
    );
};

export default NatDistribution;