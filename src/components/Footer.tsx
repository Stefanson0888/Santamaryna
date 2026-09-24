'use client'
import { useLang } from '@/lib/lang'

export default function Footer() {
  const { lang } = useLang()
  const year = new Date().getFullYear()
  const links = [
    { en:'FAQ', ua:'FAQ' }, { en:'Terms', ua:'Умови' },
    { en:'Privacy', ua:'Приватність' }, { en:'Payment Policy', ua:'Оплата' },
  ]
  return (
    <footer style={{ background:'#1A1814',padding:'1.5rem 3rem',
      display:'flex',alignItems:'center',justifyContent:'space-between',
      borderTop:'1px solid rgba(255,255,255,0.06)' }}>
      <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1rem',
        letterSpacing:'0.1em',color:'#F8F5F0' }}>
        Santa<em style={{ color:'#B8976A',fontStyle:'normal' }}>Maryna</em>
      </span>
      <div style={{ display:'flex',gap:'1.5rem' }}>
        {links.map(l => (
          <a key={l.en} href="#" style={{ fontSize:'0.65rem',letterSpacing:'0.12em',
            textTransform:'uppercase',color:'rgba(200,194,184,0.4)',textDecoration:'none' }}>
            {lang==='en' ? l.en : l.ua}
          </a>
        ))}
      </div>
      <span style={{ fontSize:'0.65rem',color:'rgba(200,194,184,0.3)',letterSpacing:'0.05em' }}>
        © {year} SantaMaryna
      </span>
    </footer>
  )
}
