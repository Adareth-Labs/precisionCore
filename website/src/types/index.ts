// ── CONTENTFUL BASE ───────────────────────────────────────────────────────────

export interface ContentfulSys {
  id: string
  createdAt: string
  updatedAt: string
}

export interface ContentfulAsset {
  sys: ContentfulSys
  fields: {
    title: string
    description?: string
    file: {
      url: string
      fileName: string
      contentType: string
      details: {
        size: number
        image?: { width: number; height: number }
      }
    }
  }
}

// ── SOLUTIONS ──────────────────────────────────────────────────────────────────

export type VehicleSegment =
  | 'passenger-cars'
  | 'commercial-vehicles'
  | 'off-highway'
  | 'motorcycles-powersports'

export type TechnologyDomain =
  | 'powertrain'
  | 'safety-systems'
  | 'adas-autonomy'
  | 'thermal-management'
  | 'electrical-electronics'
  | 'body-chassis'
  | 'interiors'

export type ProductionStatus =
  | 'active-production'
  | 'beta-validation'
  | 'engineering-sample'
  | 'end-of-life'

export type Certification =
  | 'IATF 16949'
  | 'ISO 9001:2015'
  | 'ISO 14001'
  | 'ISO 26262 ASIL D'
  | 'ISO 26262 ASIL B'
  | 'REACH'
  | 'RoHS'

export interface SpecificationRow {
  label: string
  value: string
}

export interface Solution {
  sys: ContentfulSys
  slug: string
  name: string
  partFamily: string
  domain: TechnologyDomain
  vehicleSegments: VehicleSegment[]
  status: ProductionStatus
  certifications: Certification[]
  shortDescription: string
  fullDescription: string
  specifications: SpecificationRow[]
  oemCompatibility: string[]
  heroImage?: ContentfulAsset
  technicalDataSheetUrl?: string
  featuredOnHomepage: boolean
  metaTitle?: string
  metaDescription?: string
}

// ── INNOVATION ────────────────────────────────────────────────────────────────

export type InnovationCategory =
  | 'software-defined-vehicle'
  | 'electrification'
  | 'hydrogen-fuel-cell'
  | 'cybersecurity'
  | 'ee-architecture'
  | 'autonomous-driving'
  | 'circular-economy'

export interface InnovationArticle {
  sys: ContentfulSys
  slug: string
  title: string
  category: InnovationCategory
  authorName: string
  authorRole: string
  publishedAt: string
  readTimeMinutes: number
  summary: string
  body: unknown // Contentful Rich Text document
  heroImage?: ContentfulAsset
  isWhitePaper: boolean
  whitePaperAsset?: ContentfulAsset
  featuredOnHomepage: boolean
  metaTitle?: string
  metaDescription?: string
}

// ── NEWSROOM ──────────────────────────────────────────────────────────────────

export type NewsCategory =
  | 'technical'
  | 'corporate'
  | 'esg'
  | 'financial'
  | 'partnerships'

export interface NewsArticle {
  sys: ContentfulSys
  slug: string
  title: string
  category: NewsCategory
  attribution: string
  publishedAt: string
  readTimeMinutes: number
  summary: string
  body: unknown // Contentful Rich Text document
  heroImage?: ContentfulAsset
  featuredMaterial: boolean
  metaTitle?: string
  metaDescription?: string
}

// ── COMPANY ───────────────────────────────────────────────────────────────────

export interface LeadershipProfile {
  sys: ContentfulSys
  name: string
  title: string
  bio: string
  photo?: ContentfulAsset
  linkedInUrl?: string
  sortOrder: number
}

export interface Facility {
  sys: ContentfulSys
  name: string
  city: string
  country: string
  countryCode: string
  facilityType: 'manufacturing' | 'rd-centre' | 'sales-office'
  employeeRange: string
  capabilities: string[]
  iatfCertified: boolean
  latitude: number
  longitude: number
}

export interface BoardMember {
  sys: ContentfulSys
  name: string
  title: string
  committee?: string
  type: 'executive' | 'independent' | 'non-executive'
  sortOrder: number
}

// ── CAREERS ───────────────────────────────────────────────────────────────────

export type SeniorityLevel = 'L2' | 'L3' | 'L4' | 'L5' | 'L6'
export type ContractType = 'full-time' | 'contract' | 'intern' | 'graduate'

export interface JobListing {
  id: string
  title: string
  department: string
  location: string
  country: string
  seniorityLevel: SeniorityLevel
  contractType: ContractType
  postedAt: string
  closingAt?: string
  description: string
  requirements: string[]
  applicationUrl: string
  featured: boolean
}

// ── INVESTOR DOCUMENTS ────────────────────────────────────────────────────────

export type FilingType = '10-K' | '10-Q' | '8-K' | 'DEF 14A' | 'S-1' | 'Proxy'

export interface InvestorDocument {
  key: string
  title: string
  filingType: FilingType
  filedAt: string
  fiscalYear?: string
  fiscalQuarter?: string
  presignedUrl: string
  expiresAt: string
  fileSizeBytes: number
}

export interface InvestorCalendarEvent {
  id: string
  title: string
  description: string
  date: string
  time?: string
  timezone?: string
  type: 'earnings-call' | 'agm' | 'conference' | 'roadshow'
  status: 'upcoming' | 'live' | 'completed'
  replayUrl?: string
  webcastUrl?: string
}

// ── SITE METRICS (from Contentful) ────────────────────────────────────────────

export interface SiteMetrics {
  revenueRunRate: string
  revenueYear: string
  facilityCount: number
  headcount: number
  iatfCertifiedCount: number
  countryCount: number
  lastUpdated: string
}

// ── API RESPONSES ──────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}

export interface ApiError {
  message: string
  code: string
  status: number
}
