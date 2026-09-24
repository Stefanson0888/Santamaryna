'use client'
import Image from 'next/image'
import { useLang, t } from '@/lib/lang'
import { urlFor } from '@/lib/sanity'

export default function HeroSection({ settings }: { settings: any }) {
  const { lang } = useLang()
  const titleRaw = t(settings,'heroTitle',lang) || 'Visuals that **speak** for your brand'
  const titleHtml = titleRaw.replace(/\*\*(.+?)\*\*/g,'<em style="color:#B8976A;font-style:normal">$1</em>')
  const sub = t(settings,'heroSub',lang) || 'AI-generated images, videos, and ad content for businesses and creative projects that demand something extraordinary.'
  const images = settings?.heroImages || []

  return (
    <section style={{ minHeight:'100vh',display:'grid',gridTemplateColumns:'1fr 1fr',paddingTop:'72px' }}>
      <div style={{ display:'flex',flexDirection:'column',justifyContent:'center',padding:'5rem 3rem',background:'#FDFCFA' }}>
        <div className="section-label animate-fade-up">
          {lang==='en' ? 'AI Visual Artist' : 'AI Візуальний Художник'}
        </div>
        <h1 className="animate-fade-up-1" style={{ fontFamily:"'Cormorant Garamond',serif",
          fontSize:'4rem',fontWeight:300,lineHeight:1.05,color:'#1A1814',marginBottom:'1.75rem' }}
          dangerouslySetInnerHTML={{ __html: titleHtml }} />
        <p className="animate-fade-up-2" style={{ fontSize:'0.9rem',lineHeight:1.8,
          color:'#6B6560',maxWidth:'360px',marginBottom:'2.5rem' }}>{sub}</p>
        <div className="animate-fade-up-3" style={{ display:'flex',gap:'1rem',flexWrap:'wrap' }}>
          <a href="#portfolio" style={{ display:'inline-flex',alignItems:'center',gap:'0.75rem',
            padding:'0.85rem 1.75rem',background:'#1A1814',color:'#FDFCFA',
            fontSize:'0.72rem',letterSpacing:'0.18em',textTransform:'uppercase',textDecoration:'none' }}>
            {lang==='en' ? 'View Work →' : 'Переглянути роботи →'}
          </a>
          <a href="#contact" style={{ display:'inline-flex',alignItems:'center',
            padding:'0.85rem 1.75rem',border:'1px solid rgba(26,24,20,0.1)',
            fontSize:'0.72rem',letterSpacing:'0.18em',textTransform:'uppercase',
            color:'#1A1814',textDecoration:'none' }}>
            {lang==='en' ? 'Start a Project' : 'Почати проєкт'}
          </a>
        </div>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gridTemplateRows:'1fr 1fr',gap:'2px',background:'#F8F5F0' }}>
        <div style={{ gridColumn:'1/3',position:'relative',minHeight:'260px',background:'#C8C2B8',overflow:'hidden' }}>
          {images[0] ? <Image src={urlFor(images[0]).width(900).url()} alt={images[0].alt||''} fill style={{ objectFit:'cover' }} />
            : <Placeholder label="hero image" />}
        </div>
        {[1,2].map(i => (
          <div key={i} style={{ position:'relative',minHeight:'180px',background:'#C8C2B8',overflow:'hidden' }}>
            {images[i] ? <Image src={urlFor(images[i]).width(450).url()} alt={images[i].alt||''} fill style={{ objectFit:'cover' }} />
              : <Placeholder label={`image ${i+1}`} />}
          </div>
        ))}
      </div>
    </section>
  )
}

function Placeholder({ label }: { label: string }) {
  return (
    <div style={{ width:'100%',height:'100%',minHeight:'inherit',display:'flex',
      alignItems:'center',justifyContent:'center',
      background:'linear-gradient(135deg,#EDE7DF 0%,#D8CFBF 100%)',
      fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',
      fontSize:'1rem',color:'#B8A898' }}>{label}</div>
  )
}
