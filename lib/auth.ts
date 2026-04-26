import NextAuth, { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { getDbClient } from './db'
import { UserRole } from '@prisma/client'

const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      id: 'admin',
      name: 'Admin',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const db = getDbClient()
          const user = await db.user.findUnique({
            where: { email: credentials.email as string },
          })

          if (!user) {
            return null
          }

          const isValid = await compare(credentials.password as string, user.hashedPassword)

          if (!isValid) {
            return null
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          }
        } catch (error) {
          console.error('Admin auth error:', error)
          return null
        }
      },
    }),
    Credentials({
      id: 'portal',
      name: 'Portal',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const db = getDbClient()
          const clientUser = await db.clientUser.findUnique({
            where: { email: credentials.email as string },
          })

          if (!clientUser) {
            return null
          }

          const isValid = await compare(credentials.password as string, clientUser.hashedPassword)

          if (!isValid) {
            return null
          }

          return {
            id: clientUser.id,
            name: clientUser.name,
            email: clientUser.email,
          }
        } catch (error) {
          console.error('Portal auth error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only',
  debug: process.env.NODE_ENV === 'development',
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

export async function verifyAdminSession(requiredRole?: UserRole) {
  const session = await auth()
  
  if (!session?.user) {
    return { authorized: false, user: null }
  }

  if (requiredRole && session.user.role !== requiredRole && session.user.role !== 'SUPER_ADMIN') {
    return { authorized: false, user: session.user }
  }

  return { authorized: true, user: session.user }
}
