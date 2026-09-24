'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useLang, t } from '@/lib/lang'
import { urlFor } from '@/lib/sanity'

const CAT_EN: Record<string,string> = { all:'All','ai-images':'AI Images','ai-video':'AI Video',ads:'Ads',fashion:'Fashion' }
const CAT_UA: Record<string,string> = { all:'Всі','ai-images':'AI Зображення','ai-video':'AI Відео',ads:'Реклама',fashion:'Мода' }
const SPANS = ['8','4','4','4','4','6','6']

export default function PortfolioSection({ items }: { items: any[] }) {
  const { lang } = useLang()
  const [active, setActive] = useState('all')
  const labels = lang==='en' ? CAT_EN : CAT_UA
  const filtered = active==='all' ? items : items.filter(i=>i.category===active)
  const categories = ['all',...Array.from(new Set(items.map(i=>i.category)))] as string[]
  const display = filtered.length > 0 ? filtered : Array(5).fill(null)

  return (
    <section id="portfolio" style={{ padding:'6rem 3rem',background:'#FDFCFA' }}>
      <div style={{ display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:'3rem',flexWrap:'wrap',gap:'1.5rem' }}>
        <div>
          <div className="section-label">{lang==='en' ? 'Selected Work' : 'Вибрані роботи'}</div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:'2.8rem',fontWeight:300,color:'#1A1814' }}>
            {lang==='en' ? 'Portfolio' : 'Портфоліо'}
          </h2>
        </div>
        <div style={{ display:'flex',gap:'0.5rem',flexWrap:'wrap' }}>
          {categories.map(cat => (
            <button key={cat} onClick={()=>setActive(cat)} style={{
              padding:'0.4rem 1rem',fontFamily:"'Jost',sans-serif",fontSize:'0.68rem',
              letterSpacing:'0.12em',textTransform:'uppercase',cursor:'pointer',
              border: active===cat ? '1px solid #1A1814' : '1px solid rgba(26,24,20,0.1)',
              color: active===cat ? '#1A1814' : '#6B6560', background:'transparent' }}>
              {labels[cat]||cat}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(12,1fr)',gap:'3px' }}>
        {display.map((item,i) => (
          <div key={item?._id||i} style={{
            gridColumn:`span ${SPANS[i%SPANS.length]}`,
            minHeight: i<2 ? '400px' : '280px',
            position:'relative',overflow:'hidden',cursor:'pointer',background:'#F8F5F0' }}>
            {item?.image ? (
              <Image src={urlFor(item.image).width(900).url()} alt={item.image.alt||''} fill
                style={{ objectFit:'cover',transition:'transform 0.5s' }} />
            ) : (
              <div style={{ width:'100%',height:'100%',minHeight:'inherit',display:'flex',
                flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'0.5rem',
                background:'linear-gradient(135deg,#EDE7DF 0%,#D8CFBF 100%)' }}>
                <span style={{ fontSize:'0.58rem',letterSpacing:'0.2em',textTransform:'uppercase',
                  color:'#B8976A',padding:'0.3rem 0.7rem',border:'1px solid #E8D9C0',background:'rgba(255,255,255,0.5)' }}>
                  {item ? (CAT_EN[item.category]||item.category) : 'Portfolio'}
                </span>
                <span style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontSize:'1.1rem',color:'#6B6560' }}>
                  {item ? t(item,'title',lang) : 'your work here'}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
