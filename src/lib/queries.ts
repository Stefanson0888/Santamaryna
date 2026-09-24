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
    _id, order, titleEn, titleUa, category, image{asset, alt}, videoUrl, mediaType
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
