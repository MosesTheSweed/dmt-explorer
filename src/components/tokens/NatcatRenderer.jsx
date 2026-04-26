import { useMemo } from 'react';
import { Box } from '@mui/material';

// ─── Color maps ───────────────────────────────────────────────────────────────
const colorMap = {
    1:"#6D2BF8",2:"#AF89FE",3:"#FDF64D",4:"#2067F0",5:"#976F53",
    6:"#CBC7E3",7:"#15D96F",8:"#FF64C1",9:"#F95E3C",0:"#585663",
};
const colorMap2 = {
    1:"#5922CD",2:"#9C6EFE",3:"#FDE14D",4:"#1C54C0",5:"#725540",
    6:"#8F8DA5",7:"#17B35F",8:"#F343AC",9:"#EC5331",0:"#403F4A",
};
const colorMap3 = {
    1:"#A2FF00",2:"#49EFEF",3:"#FFB800",4:"#FFA1FB",5:"#FF7528",
    6:"#FF1E39",7:"#00B127",8:"#2A32FF",9:"#A9A8D6",
};

// ─── Trait checkers ───────────────────────────────────────────────────────────
const c420  = n => n.toString().includes('420');
const c4a0  = n => n.toString().includes('4') && n.toString().includes('0');
const c0    = n => n.toString().includes('0');
const c00   = n => n.toString().includes('00');
const c000  = n => n.toString().includes('000');
const c0000 = n => n.toString().includes('0000');
const c00000= n => n.toString().includes('00000');
const c11   = n => n.toString().includes('11');
const c111  = n => n.toString().includes('111');
const c1111 = n => n.toString().includes('1111');
const c11111= n => n.toString().includes('11111');
const c8a8  = n => ((n.toString().match(/8/g)||[]).length >= 2) ? true : false;
const c88   = n => n.toString().includes('88');
const c888  = n => n.toString().includes('888');
const c8888 = n => n.toString().includes('8888');
const c88888= n => n.toString().includes('88888');
const c9a9  = n => ((n.toString().match(/9/g)||[]).length >= 2) ? true : false;
const c99   = n => n.toString().includes('99');
const c999  = n => n.toString().includes('999');
const c9999 = n => n.toString().includes('9999');
const m11   = n => n % 11 === 0;
const m12   = n => n % 12 === 0;
const m13   = n => n % 13 === 0;
const m14   = n => n % 14 === 0;
const m15   = n => n % 15 === 0;
const m16   = n => n % 16 === 0;
const m69   = n => n % 69 === 0;
const m888  = n => n % 888 === 0;

const cp6 = n => {
    const s = n.toString();
    for (let i = 0; i <= s.length - 6; i++) {
        const sub = s.substring(i, i+6);
        if (sub === sub.split('').reverse().join('')) return true;
    }
    return false;
};
const cs5 = n => {
    const s = n.toString();
    for (let i = 0; i < s.length - 4; i++) {
        const sub = s.substring(i, i+5);
        if (!sub.startsWith('0')) {
            const sq = Math.sqrt(parseInt(sub, 10));
            if (sq === Math.floor(sq)) return true;
        }
    }
    return false;
};
const cs6 = n => {
    const s = n.toString();
    for (let i = 0; i < s.length - 5; i++) {
        const sub = s.substring(i, i+6);
        if (!sub.startsWith('0')) {
            const sq = Math.sqrt(parseInt(sub, 10));
            if (sq === Math.floor(sq)) return true;
        }
    }
    return false;
};
const makeFibSet = (minDigits, maxDigits) => {
    const min = Math.pow(10, minDigits-1);
    const max = Math.pow(10, maxDigits);
    let a=0, b=1, set=new Set();
    while (b < max) { if (b >= min) set.add(b.toString()); [a,b]=[b,a+b]; }
    return set;
};
const fibSets = { 3: makeFibSet(3,3), 4: makeFibSet(4,4), 5: makeFibSet(5,5), 6: makeFibSet(6,6), 7: makeFibSet(7,7) };
const cfN = (n, len) => {
    const s = n.toString();
    for (let i = 0; i <= s.length - len; i++)
        if (fibSets[len]?.has(s.substring(i, i+len))) return true;
    return false;
};
const ce7 = n => {
    const s = n.toString();
    let p=1;
    while (true) {
        const v = Math.pow(7,p).toString();
        if (s.includes(v)) return true;
        if (Math.pow(7,p) > n) break;
        p++;
    }
    return false;
};
const containsFourDigitSquare = n => {
    const s = n.toString();
    for (let i = 0; i <= s.length-4; i++) {
        const num = parseInt(s.substring(i,i+4),10);
        if (Math.sqrt(num) % 1 === 0) return true;
    }
    return false;
};
const getLook = n => {
    const last4 = parseInt(n.toString().slice(-4));
    if (last4 < 4800) return 'look_right';
    if (last4 <= 5200) return 'look_crossed';
    return 'look_left';
};
const getLaserDir = n => {
    const last4 = parseInt(n.toString().slice(-4));
    if (last4 < 4800) return 'laser_right';
    if (last4 <= 5200) return 'laser_crossed';
    return 'laser_left';
};

// ─── SVG builders ─────────────────────────────────────────────────────────────
const abs = (top, left, content) =>
    `<div style="position:absolute;top:${top}px;left:${left}px;">${content}</div>`;

const buildHtml = (blockNumber) => {
    const n = parseInt(blockNumber);
    const s = n.toString();
    const digits = s.padStart(7,'0').split('').map(Number).reverse();

    const c1 = colorMap[digits[0]];
    const c2 = colorMap2[digits[1]] || 'transparent';
    const c3 = colorMap2[digits[2]] || 'transparent';
    const c4 = colorMap2[digits[3]] || 'transparent';
    const c5 = colorMap2[digits[4]] || 'transparent';
    const c6 = colorMap[digits[5]]  || 'transparent';
    const c7 = colorMap3[digits[6]] || '#FFFFFF';

    const lookDir = getLook(n);
    const lookHtml = lookDir === 'look_left'
        ? abs(195,126,`<svg width="158" height="38" viewBox="0 0 158 38" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="37" y="38" width="37" height="38" transform="rotate(-180 37 38)" fill="#070609"/><rect x="158" y="38" width="37" height="38" transform="rotate(-180 158 38)" fill="#070609"/></svg>`)
        : lookDir === 'look_right'
            ? abs(195,163,`<svg width="158" height="38" viewBox="0 0 158 38" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="37" y="38" width="37" height="38" transform="rotate(-180 37 38)" fill="#070609"/><rect x="157.5" y="38" width="36.5" height="38" transform="rotate(-180 157.5 38)" fill="#070609"/></svg>`)
            : abs(195,126,`<svg width="195" height="38" viewBox="0 0 195 38" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="194.5" y="38" width="36.5" height="38" transform="rotate(-180 194.5 38)" fill="#070609"/><rect x="37" y="38" width="37" height="38" transform="rotate(-180 37 38)" fill="#070609"/></svg>`);

    const laserDir = getLaserDir(n);
    const laserEyesHtml = containsFourDigitSquare(n)
        ? laserDir === 'laser_left'
            ? abs(214,0,`<svg width="284" height="19"><rect width="284" height="18.5" fill="#FD1935"/></svg>`)
            : laserDir === 'laser_right'
                ? abs(214,163,`<svg width="262" height="19"><rect width="262" height="18.5" fill="#FD1935"/></svg>`)
                : abs(214,0,`<svg width="425" height="19"><rect width="163" height="18.5" fill="#FD1935"/><rect x="284" width="141" height="18.5" fill="#FD1935"/></svg>`)
        : '';

    const parts = [
        // background
        abs(0,0,`<svg width="425" height="425"><rect width="425" height="425" fill="#201F27"/></svg>`),
        // ears
        s.length>=3 ? abs(59,105,`<svg width="80" height="80" viewBox="0 0 80 80" fill="none"><path d="M6.99383e-06 0L80 80L0 80L6.99383e-06 0Z" fill="${c3}"/></svg>`) : '',
        s.length>=4 ? abs(59,240,`<svg width="80" height="80" viewBox="0 0 80 80" fill="none"><path d="M0 80L80 8.58338e-06L80 80L0 80Z" fill="${c4}"/></svg>`) : '',
        // earrings
        c0(n)    ? abs(120,87, `<svg width="19" height="18"><rect width="19" height="18" fill="#FFC700"/></svg>`) : '',
        c00(n)   ? abs(120,319,`<svg width="19" height="18"><rect width="19" height="18" fill="#FFC700"/></svg>`) : '',
        c000(n)  ? abs(120,87, `<svg width="19" height="18"><rect width="19" height="18" fill="#49EFEF"/></svg>`) : '',
        c0000(n) ? abs(120,319,`<svg width="19" height="18"><rect width="19" height="18" fill="#49EFEF"/></svg>`) : '',
        // eyes
        abs(195,126,`<svg width="194" height="38" viewBox="0 0 194 38" fill="none"><rect x="74" y="38" width="74" height="38" transform="rotate(-180 74 38)" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M121 0H193.469L194 0.53125V37.5391L193.539 38H121V0Z" fill="white"/></svg>`),
        ce7(n) ? abs(195,126,`<svg width="194" height="38" viewBox="0 0 194 38" fill="none"><rect x="74" y="38" width="74" height="38" transform="rotate(-180 74 38)" fill="#A2FF00"/><path fill-rule="evenodd" clip-rule="evenodd" d="M121 0H193.469L194 0.53125V37.5391L193.539 38H121V0Z" fill="#A2FF00"/></svg>`) : '',
        lookHtml,
        // teeth base
        abs(288,189,`<svg width="100" height="35"><rect width="100" height="35" fill="#FFFFFF"/></svg>`),
        // special teeth color
        s.length>=7 ? abs(288,189,`<svg width="40" height="35"><rect width="40" height="35" fill="${c7}"/></svg>`) : '',
        s.length>=7 ? abs(288,249,`<svg width="40" height="35"><rect width="40" height="35" fill="${c7}"/></svg>`) : '',
        // face
        s.length>=1 ? abs(138,105,`<svg width="215" height="209" viewBox="0 0 215 209" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M215 3.75918e-05L3.65427e-05 0L0 209L215 209L215 94L143.008 94L143.008 58L215 58L215 3.75918e-05ZM22 58L94 58L94 94L22 94L22 58ZM197 155H94V180H197V155Z" fill="${c1}"/></svg>`) : '',
        // mouth
        abs(288,194,`<svg width="113" height="35" viewBox="0 0 113 35" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M60 0L90 30V0H113V35H0V0L30 30V0H60Z" fill="#070609"/></svg>`),
        // neck
        s.length>=2 ? abs(345,105,`<svg width="78" height="80"><rect width="78" height="80" fill="${c2}"/></svg>`) : '',
        // nose
        s.length>=5 ? abs(254,220,`<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M28 28L0 0H28V28Z" fill="${c5}"/></svg>`) : '',
        // stripes
        s.length>=6 ? abs(365,105,`<svg width="36" height="54" viewBox="0 0 36 54" fill="none"><rect width="36" height="18" fill="${c6}"/><rect y="36" width="36" height="18" fill="${c6}"/></svg>`) : '',
        // tail
        s.length>=2 ? abs(279,0,`<svg width="46" height="146" viewBox="0 0 46 146" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M46.0001 146H0L5.3765e-05 23C5.93175e-05 10.2974 10.2975 -5.20515e-06 23.0001 0C35.7027 5.55247e-06 46.0001 10.2975 46.0001 23L46.0001 146Z" fill="${c2}"/></svg>`) : '',
        // accessories
        c420(n)  ? abs(293,356,`<svg width="18" height="18"><rect x="18" y="18" width="18" height="18" transform="rotate(-180 18 18)" fill="#00B127"/></svg>`) : '',
        c4a0(n)  ? abs(219,302,`<svg width="72" height="92" viewBox="0 0 72 92" fill="none"><rect x="72" y="92" width="72" height="18" transform="rotate(-180 72 92)" fill="#FBFBFB"/><rect x="72" y="56" width="18" height="56" transform="rotate(-180 72 56)" fill="#EEEEEE" fill-opacity="0.3"/><rect x="72" y="92" width="18" height="18" transform="rotate(-180 72 92)" fill="#FF0034"/></svg>`) : '',
        c00000(n)? abs(102,132,`<svg width="162" height="36" viewBox="0 0 162 36" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M36 0H54V18H36V0ZM36 18V36H18H0V18H18H36ZM72 18V36H54V18H72ZM90 18H72V0H90V18ZM108 18V36H90V18H108ZM126 18H108V0H126V18ZM144 18H126V36H144H162V18H144Z" fill="#00FFF0"/></svg>`) : '',
        c11(n)   ? abs(169,340,`<svg width="38" height="27" viewBox="0 0 38 27" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 9.00001L6.29443e-06 9L0 27L19 27H38L38 9.00001H19Z" fill="#070609"/><rect x="19" width="19" height="18" fill="white" fill-opacity="0.5"/></svg>`) : '',
        c111(n)  ? abs(178,378,`<svg width="18" height="18"><rect x="18" y="18" width="18" height="18" transform="rotate(-180 18 18)" fill="#FFC700"/></svg>`) : '',
        c1111(n) ? abs(178,378,`<svg width="18" height="18"><rect x="18" y="18" width="18" height="18" transform="rotate(-180 18 18)" fill="#49EFEF"/></svg>`) : '',
        c11111(n)? abs(178,0,  `<svg width="340" height="19"><rect width="340" height="18.5" fill="#FD1935"/></svg>`) : '',
        c8a8(n)  ? abs(138,87, `<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M0 36V0L18 18L0 36Z" fill="#FF94D4"/><path d="M36 9.43221e-07L36 36L18 18L36 9.43221e-07Z" fill="#FF94D4"/></svg>`) : '',
        c88(n)   ? abs(138,302,`<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M0 36V0L18 18L0 36Z" fill="#FF94D4"/><path d="M36 9.43221e-07L36 36L18 18L36 9.43221e-07Z" fill="#FF94D4"/></svg>`) : '',
        c888(n)  ? abs(293,28, `<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M0 36V0L18 18L0 36Z" fill="#FF94D4"/><path d="M36 9.43221e-07L36 36L18 18L36 9.43221e-07Z" fill="#FF94D4"/></svg>`) : '',
        c8888(n) ? abs(365,123,`<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M0 36V0L18 18L0 36Z" fill="#49EFEF"/><path d="M36 9.43221e-07L36 36L18 18L36 9.43221e-07Z" fill="#49EFEF"/></svg>`) : '',
        c88888(n)? abs(365,177,`<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M0 36V0L18 18L0 36Z" fill="#49EFEF"/><path d="M36 9.43221e-07L36 36L18 18L36 9.43221e-07Z" fill="#49EFEF"/></svg>`) : '',
        cp6(n)   ? abs(358,321,`<svg width="67" height="68" viewBox="0 0 67 68" fill="none"><rect x="33.2734" y="0.546875" width="47.0569" height="47.0569" transform="rotate(45 33.2734 0.546875)" fill="#49EFEF"/></svg>`) : '',
        cs5(n)   ? abs(359,200,`<svg width="225" height="66" viewBox="0 0 225 66" fill="none"><circle cx="33" cy="33" r="33" fill="#C53DF5"/><rect x="35" y="57" width="190" height="9" fill="#C53DF5"/></svg>`) : '',
        cs6(n)   ? abs(293,284,`<svg width="141" height="18" viewBox="0 0 141 18" fill="none"><rect x="52" y="18" width="52" height="18" transform="rotate(-180 52 18)" fill="#E7E5F7"/><rect x="141" y="18" width="89" height="18" transform="rotate(-180 141 18)" fill="#FF1E39"/></svg>`) : '',
        c9a9(n)  ? abs(318,219,`<svg width="176" height="76" viewBox="0 0 176 76" fill="none"><path d="M176 0V76L137 38L176 0Z" fill="#0082BA"/><rect width="137" height="76" rx="38" fill="#0D8DCE"/><path fill-rule="evenodd" clip-rule="evenodd" d="M38 0C17.0132 0 0 17.0132 0 38H137C137 17.0132 119.987 0 99 0H38Z" fill="#0082BA"/></svg>`) : '',
        c99(n)   ? abs(318,183,`<svg width="212" height="76" viewBox="0 0 212 76" fill="none"><path d="M212 0V76L173 38L212 0Z" fill="#0082BA"/><rect width="173" height="76" rx="38" fill="#FF906D"/><path fill-rule="evenodd" clip-rule="evenodd" d="M38 0C17.0132 0 0 17.0132 0 38H173C173 17.0132 155.987 0 135 0H38Z" fill="#0082BA"/></svg>`) : '',
        c999(n)  ? abs(318,183,`<svg width="212" height="76" viewBox="0 0 212 76" fill="none"><path d="M212 0V76L173 38L212 0Z" fill="#49EFEF"/><rect width="173" height="76" rx="38" fill="#66F8F8"/><path fill-rule="evenodd" clip-rule="evenodd" d="M38 0C17.0132 0 0 17.0132 0 38H173C173 17.0132 155.987 0 135 0H38Z" fill="#49EFEF"/></svg>`) : '',
        c9999(n) ? abs(318,123,`<svg width="272" height="76" viewBox="0 0 272 76" fill="none"><path d="M272 0V76L233 38L272 0Z" fill="#49EFEF"/><rect width="233" height="76" rx="38" fill="#66F8F8"/><path fill-rule="evenodd" clip-rule="evenodd" d="M38 0C17.0132 0 0 17.0132 0 38H233C233 17.0132 215.987 0 195 0H38Z" fill="#49EFEF"/></svg>`) : '',
        cfN(n,3) ? abs(329,159,`<svg width="36" height="90" viewBox="0 0 36 90" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M36 18L36 0L18 -7.86805e-07L18 18L18 36L36 36L36 18Z" fill="#FF1E39"/><path fill-rule="evenodd" clip-rule="evenodd" d="M18 72L18 54L0 54L-7.86805e-07 72L-1.57361e-06 90L18 90L18 72Z" fill="#FF1E39"/></svg>`) : '',
        cfN(n,4) ? abs(174,320,`<svg width="18" height="18"><rect x="18" y="18" width="18" height="18" transform="rotate(-180 18 18)" fill="#FFB800"/></svg>`) : '',
        cfN(n,5) ? abs(41, 146,`<svg width="132" height="18"><rect width="132" height="18" fill="#FFB700"/></svg>`) : '',
        cfN(n,6) ? abs(160,341,`<svg width="84" height="265" viewBox="0 0 84 265" fill="none"><rect x="33" y="265" width="229" height="18" transform="rotate(-90 33 265)" fill="#5A4545"/><path fill-rule="evenodd" clip-rule="evenodd" d="M48 0H0V36H48H84C84 16.1177 67.8822 0 48 0Z" fill="#C6C2D2"/></svg>`) : '',
        cfN(n,7) ? abs(251,338,`<svg width="36" height="174" viewBox="0 0 36 174" fill="none"><rect x="36" width="174" height="36" transform="rotate(90 36 0)" fill="white" fill-opacity="0.5"/><rect x="36" y="67" width="107" height="36" transform="rotate(90 36 67)" fill="#A2FF00"/></svg>`) : '',
        m11(n)   ? abs(318,224,`<svg width="201" height="38" viewBox="0 0 201 38" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 0C8.50659 0 0 8.50659 0 19C0 29.4934 8.50659 38 19 38L44 38L70 38L201 38V29L86.1586 29C87.9599 26.0954 89 22.6692 89 19C89 8.50659 80.4934 0 70 0L19 0Z" fill="#8F8DA5"/></svg>`) : '',
        m888(n)  ? abs(318,224,`<svg width="201" height="38" viewBox="0 0 201 38" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 0C8.50659 0 0 8.50659 0 19C0 29.4934 8.50659 38 19 38L44 38L70 38L201 38V29L86.1586 29C87.9599 26.0954 89 22.6692 89 19C89 8.50659 80.4934 0 70 0L19 0Z" fill="#49efef"/></svg>`) : '',
        m12(n)   ? abs(347,105,`<svg width="90" height="18" viewBox="0 0 90 18" fill="none"><rect width="20" height="18" fill="#FF1D38"/><rect x="18" width="20" height="18" fill="#C53DF5"/><rect x="36" width="20" height="18" fill="#115FF5"/><rect x="54" width="20" height="18" fill="#A1FF00"/><rect x="72" width="18" height="18" fill="#FFC700"/></svg>`) : '',
        m13(n)   ? abs(347,105,`<svg width="90" height="54" viewBox="0 0 90 54" fill="none"><rect width="18" height="18" fill="white"/><rect x="18" y="18" width="18" height="18" fill="white"/><rect x="36" y="36" width="18" height="18" fill="white"/><rect x="54" y="18" width="18" height="18" fill="white"/><rect x="72" width="18" height="18" fill="white"/></svg>`) : '',
        m14(n)   ? abs(365,105,`<svg width="90" height="18" viewBox="0 0 90 18" fill="none"><rect width="20" height="18" fill="#FF835A"/><rect x="18" width="20" height="18" fill="#FF6F41"/><rect x="36" width="20" height="18" fill="#FF6533"/><rect x="54" width="20" height="18" fill="#FF5620"/><rect x="72" width="18" height="18" fill="#FF490F"/></svg>`) : '',
        m15(n)   ? abs(156,105,`<svg width="215" height="18" viewBox="0 0 215 18" fill="none"><rect x="215" y="18" width="20" height="18" transform="rotate(-180 215 18)" fill="#FF9877"/><rect x="197" y="18" width="20" height="18" transform="rotate(-180 197 18)" fill="#FF835B"/><rect x="179" y="18" width="20" height="18" transform="rotate(-180 179 18)" fill="#FF6F41"/><rect x="161" y="18" width="20" height="18" transform="rotate(-180 161 18)" fill="#FF6533"/><rect x="143" y="18" width="20" height="18" transform="rotate(-180 143 18)" fill="#FF5620"/><rect width="20" height="18" fill="#FF9877"/><rect x="18" width="20" height="18" fill="#FF835B"/><rect x="36" width="20" height="18" fill="#FF6F41"/><rect x="54" width="20" height="18" fill="#FF6533"/><rect x="72" width="20" height="18" fill="#FF5620"/><path fill-rule="evenodd" clip-rule="evenodd" d="M107 0H90V18H107H108H125V0H108H107Z" fill="#FF4910"/></svg>`) : '',
        m16(n)   ? abs(120,68.5,`<svg width="287" height="37" viewBox="0 0 287 37" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M36 17.4999L36 0L252 9.34601e-05L252 17.5L287 17.5V36.5L0 36.4999L8.30517e-06 17.4999L36 17.4999Z" fill="#FFE898"/></svg>`) : '',
        m69(n)   ? abs(383,87, `<svg width="108" height="18" viewBox="0 0 108 18" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M18 0L18 17.9998H62.9996L62.9998 17.9998L107.999 17.9998L107.999 2.36039e-06L62.9996 0H18Z" fill="#2E2D34"/><path d="M17.9998 0L0 17.9998H17.9998V0Z" fill="#EDEAFC"/><path d="M89.9998 0L72 17.9998H89.9998V0Z" fill="#EDEAFC"/><path d="M53.9998 0L36 17.9998H53.9998V0Z" fill="#EDEAFC"/></svg>`) : '',
        laserEyesHtml,
    ];

    return `<div style="position:relative;width:425px;height:425px;overflow:hidden;">${parts.join('')}</div>`;
};

// ─── React component ──────────────────────────────────────────────────────────
const NatcatRenderer = ({ blockNumber, size = 160 }) => {
    const html = useMemo(() => buildHtml(blockNumber), [blockNumber]);
    const scale = size / 425;

    return (
        <Box sx={{
            width: size,
            height: size,
            overflow: 'hidden',
            borderRadius: 1,
            flexShrink: 0,
        }}>
            <Box sx={{
                width: 425,
                height: 425,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
            }}
                 dangerouslySetInnerHTML={{ __html: html }}
            />
        </Box>
    );
};

export default NatcatRenderer;