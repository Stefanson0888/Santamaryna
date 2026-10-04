import { client } from './sanity'

export async function getSiteSettings() {
  return client.fetch(`*[_type == "siteSettings"][0]{
    heroTitleEn, heroTitleUa, heroSubEn, heroSubUa,
    heroImages[]{asset, alt}, email, instagram,
    metaDescriptionEn, metaDescriptionUa
  }`)
}

export async function getServices() {
  return client.fetch(`*[_type == "service" && isActive == true] | order(order asc){
    _id, order, titleEn, titleUa, descEn, descUa, priceEn, priceUa
  }`)
}

export async function getPortfolioItems() {
  return client.fetch(`*[_type == "portfolioItem" && isActive == true] | order(order asc){
    _id, order, titleEn, titleUa, slug, category, shortDescEn, shortDescUa,
    image{asset, alt}, videoUrl, mediaType
  }`)
}

export async function getGreetings() {
  return client.fetch(`*[_type == "greeting" && isActive == true] | order(order asc){
    _id, order, titleEn, titleUa, descEn, descUa, price, currency, badge, thumbColor,
    fields[]{fieldKey, labelEn, labelUa, type, required}
  }`)
}

export async function getHowItWorks() {
  return client.fetch(`*[_type == "howItWorksStep"] | order(order asc){
    _id, order, titleEn, titleUa, descEn, descUa
  }`)
}

export async function getPortfolioItemBySlug(slug: string) {
  return client.fetch(
    `*[_type == "portfolioItem" && slug.current == $slug && isActive == true][0]{
      _id,
      titleEn,
      titleUa,
      slug,
      category,
      shortDescEn,
      shortDescUa,
      descriptionEn,
      descriptionUa,
      image{asset, alt},
      videoUrl,
      mediaType,
      gallery[]{asset, alt},
      tools,
      year
    }`,
    { slug }
  )
}
