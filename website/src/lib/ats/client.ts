import type { JobListing, SeniorityLevel, ContractType } from '@/types'

// Greenhouse API integration
// Swap this module for Workday/Lever/Ashby adapters without touching call sites

const ATS_API_KEY    = process.env.ATS_API_KEY ?? ''
const ATS_BOARD_TOKEN = process.env.ATS_BOARD_TOKEN ?? 'precisioncore'
const BASE_URL       = 'https://boards-api.greenhouse.io/v1/boards'

interface GreenhouseJob {
  id: number
  title: string
  updated_at: string
  location: { name: string }
  departments: { name: string }[]
  metadata: { id: number; name: string; value: string | null }[]
  absolute_url: string
}

interface GreenhouseJobDetail extends GreenhouseJob {
  content: string
  questions: unknown[]
}

function mapSeniority(metadata: GreenhouseJob['metadata']): SeniorityLevel {
  const meta = metadata.find((m) => m.name === 'Seniority Level')
  const map: Record<string, SeniorityLevel> = {
    'Mid':       'L3',
    'Senior':    'L4',
    'Principal': 'L5',
    'Staff':     'L6',
  }
  return map[meta?.value ?? ''] ?? 'L4'
}

function mapContractType(metadata: GreenhouseJob['metadata']): ContractType {
  const meta = metadata.find((m) => m.name === 'Employment Type')
  const map: Record<string, ContractType> = {
    'Full-Time':    'full-time',
    'Contract':     'contract',
    'Internship':   'intern',
    'Graduate':     'graduate',
  }
  return map[meta?.value ?? ''] ?? 'full-time'
}

function mapJob(job: GreenhouseJob, detail?: GreenhouseJobDetail): JobListing {
  const [city, country] = (job.location.name ?? ', ').split(', ')
  return {
    id:             String(job.id),
    title:          job.title,
    department:     job.departments[0]?.name ?? 'General',
    location:       job.location.name,
    country:        country ?? '',
    seniorityLevel: mapSeniority(job.metadata),
    contractType:   mapContractType(job.metadata),
    postedAt:       job.updated_at,
    description:    detail?.content ?? '',
    requirements:   [],
    applicationUrl: job.absolute_url,
    featured:       job.metadata.some(
      (m) => m.name === 'Featured' && m.value === 'Yes'
    ),
  }
}

export async function getJobListings(options?: {
  department?: string
  limit?: number
}): Promise<JobListing[]> {
  const response = await fetch(
    `${BASE_URL}/${ATS_BOARD_TOKEN}/jobs?content=true`,
    {
      headers: { Authorization: `Basic ${Buffer.from(ATS_API_KEY + ':').toString('base64')}` },
      next: { revalidate: parseInt(process.env.REVALIDATE_CAREERS ?? '1800', 10) },
    }
  )

  if (!response.ok) {
    console.error(`ATS API error: ${response.status} ${response.statusText}`)
    return []
  }

  const data = (await response.json()) as { jobs: GreenhouseJob[] }
  let jobs = data.jobs.map((j) => mapJob(j))

  if (options?.department) {
    jobs = jobs.filter((j) =>
      j.department.toLowerCase().includes(options.department!.toLowerCase())
    )
  }

  if (options?.limit) {
    jobs = jobs.slice(0, options.limit)
  }

  return jobs
}

export async function getJobById(id: string): Promise<JobListing | null> {
  const response = await fetch(
    `${BASE_URL}/${ATS_BOARD_TOKEN}/jobs/${id}`,
    {
      headers: { Authorization: `Basic ${Buffer.from(ATS_API_KEY + ':').toString('base64')}` },
      next: { revalidate: parseInt(process.env.REVALIDATE_CAREERS ?? '1800', 10) },
    }
  )

  if (!response.ok) return null

  const job = (await response.json()) as GreenhouseJobDetail
  return mapJob(job, job)
}
