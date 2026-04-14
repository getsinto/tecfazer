import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

export const ourFileRouter = {
  serviceImage: f({ image: { maxFileSize: '4MB', maxFileCount: 4 } })
    .middleware(async () => ({ userId: 'server' }))
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Service image uploaded:', file.url)
      return { url: file.url }
    }),
    
  projectImage: f({ image: { maxFileSize: '4MB', maxFileCount: 8 } })
    .middleware(async () => ({ userId: 'server' }))
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Project image uploaded:', file.url)
      return { url: file.url }
    }),
    
  blogImage: f({ image: { maxFileSize: '2MB', maxFileCount: 1 } })
    .middleware(async () => ({ userId: 'server' }))
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Blog image uploaded:', file.url)
      return { url: file.url }
    }),
    
  teamPhoto: f({ image: { maxFileSize: '1MB', maxFileCount: 1 } })
    .middleware(async () => ({ userId: 'server' }))
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Team photo uploaded:', file.url)
      return { url: file.url }
    }),
    
  documentFile: f({ pdf: { maxFileSize: '8MB', maxFileCount: 5 } })
    .middleware(async () => ({ userId: 'server' }))
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Document uploaded:', file.url)
      return { url: file.url }
    }),
    
  generalMedia: f({ image: { maxFileSize: '2MB', maxFileCount: 1 } })
    .middleware(async () => ({ userId: 'server' }))
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Media uploaded:', file.url)
      return { url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
