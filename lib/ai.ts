import OpenAI from 'openai'
import { GeneratedContent } from '@/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateBilingualContent(
  contentType: 'service' | 'blog' | 'project',
  description: string,
  options?: { keywords?: string[] }
): Promise<GeneratedContent> {
  const systemPrompt = `You are a professional content writer for Tec Fazer, a Portuguese technology company based in Mafra, Lisboa. 
Generate high-quality, professional bilingual content (Portuguese and English) for a ${contentType}.
The company specializes in web development, mobile apps, cloud solutions, and digital marketing.
Brand colors: teal-blue (#1B7A8A) and golden-orange (#F5A623).
Tagline: "Building The Future"
Return valid JSON only with these exact fields: titlePt, titleEn, descriptionPt, descriptionEn, contentPt, contentEn, metaTitlePt, metaTitleEn, metaDescPt, metaDescEn`

  const userPrompt = `Generate content for: ${description}${options?.keywords ? `\nKeywords: ${options.keywords.join(', ')}` : ''}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const content = JSON.parse(completion.choices[0].message.content || '{}')
    return content as GeneratedContent
  } catch (error) {
    console.error('AI generation failed:', error)
    throw new Error('Failed to generate content')
  }
}

export async function generateSeoSuggestions(
  title: string,
  contentType: string,
  locale: string
): Promise<{ metaTitle: string; metaDescription: string }> {
  const prompt = `Generate SEO-optimized meta title (max 60 chars) and meta description (max 160 chars) in ${locale === 'pt' ? 'Portuguese' : 'English'} for: ${title} (${contentType}). Return JSON with metaTitle and metaDescription fields.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    })

    return JSON.parse(completion.choices[0].message.content || '{}')
  } catch (error) {
    console.error('SEO generation failed:', error)
    return {
      metaTitle: title,
      metaDescription: title,
    }
  }
}
