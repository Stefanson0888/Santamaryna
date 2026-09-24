'use client'
import { useLang } from '@/lib/lang'
import Link from 'next/link'

export default function Navbar() {
  const { lang, setLang } = useLang()
  const links = [
    { href: '#portfolio', en: 'Portfolio',       ua: 'Портфоліо' },
    { href: '#services',  en: 'Services',         ua: 'Послуги' },
    { href: '#greetings', en: 'Video Greetings',  ua: 'Відео-привітання' },
    { href: '#contact',   en: 'Contact',          ua: 'Контакт' },
  ]
  return (
    <nav style={{ position:'fixed',top:0,left:0,right:0,zIndex:50,
      display:'flex',alignItems:'center',justifyContent:'space-between',
      padding:'1.25rem 3rem',
      background:'rgba(253,252,250,0.92)',backdropFilter:'blur(12px)',
      borderBottom:'1px solid rgba(26,24,20,0.06)' }}>
      <Link href="/" style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1.35rem',
        letterSpacing:'0.08em',color:'#1A1814',textDecoration:'none' }}>
        Santa<em style={{ color:'#B8976A',fontStyle:'normal' }}>Maryna</em>
      </Link>
      <ul style={{ display:'flex',gap:'2.5rem',listStyle:'none',margin:0,padding:0 }}>
        {links.map(l => (
          <li key={l.href}>
            <a href={l.href} style={{ fontSize:'0.72rem',letterSpacing:'0.15em',textTransform:'uppercase',
              color:'#6B6560',textDecoration:'none' }}>
              {lang === 'en' ? l.en : l.ua}
            </a>
          </li>
        ))}
      </ul>
      <div style={{ display:'flex',border:'1px solid rgba(26,24,20,0.1)',overflow:'hidden' }}>
        {(['en','ua'] as const).map(l => (
          <button key={l} onClick={() => setLang(l)} style={{
            padding:'0.3rem 0.65rem',fontFamily:"'Jost',sans-serif",
            fontSize:'0.7rem',letterSpacing:'0.1em',border:'none',cursor:'pointer',
            background: lang===l ? '#1A1814' : 'transparent',
            color: lang===l ? '#FDFCFA' : '#6B6560',
          }}>{l.toUpperCase()}</button>
        ))}
      </div>
    </nav>
  )
}
