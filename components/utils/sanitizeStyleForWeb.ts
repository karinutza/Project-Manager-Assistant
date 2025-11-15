import { Platform } from 'react-native';

type RNStyle = Record<string, any> | Array<Record<string, any>> | any;

export function sanitizeStyleForWeb(style: RNStyle): any {
  if (Platform.OS !== 'web' || !style) return style;

  const arr = Array.isArray(style) ? style.filter(Boolean) : [style];
  const flat = Object.assign({}, ...arr);
  const out: Record<string, any> = { ...flat };

  if (Array.isArray(out.transform)) {
    const parts = out.transform
      .map((t: any) => {
        if (!t || typeof t !== 'object') return '';
        const k = Object.keys(t)[0];
        const v = t[k];
        switch (k) {
          case 'rotate': return `rotate(${v})`;
          case 'rotateX': return `rotateX(${v})`;
          case 'rotateY': return `rotateY(${v})`;
          case 'translateX': return `translateX(${typeof v === 'number' ? v + 'px' : v})`;
          case 'translateY': return `translateY(${typeof v === 'number' ? v + 'px' : v})`;
          case 'scale': return `scale(${v})`;
          case 'scaleX': return `scaleX(${v})`;
          case 'scaleY': return `scaleY(${v})`;
          default: return '';
        }
      })
      .filter(Boolean)
      .join(' ');
    if (parts) out.transform = parts;
    else delete out.transform;
  }

  if (out.animationName && typeof out.animationName === 'object') {
    delete out.animationName;
  }

  if (out.shadowColor || out.shadowOffset || out.shadowRadius || out.shadowOpacity || out.elevation) {
    const color = out.shadowColor || 'rgba(0,0,0,0.1)';
    const offset = out.shadowOffset || { width: 0, height: 2 };
    const radius = out.shadowRadius ?? (out.elevation ? Math.max(2, out.elevation) : 4);
    const opacity = out.shadowOpacity ?? 0.06;
    const x = (offset && offset.width) || 0;
    const y = (offset && offset.height) || 0;
    out.boxShadow = `${x}px ${y}px ${radius}px rgba(0,0,0,${opacity})`;
    delete out.shadowColor;
    delete out.shadowOffset;
    delete out.shadowRadius;
    delete out.shadowOpacity;
    delete out.elevation;
  }

  return out;
}