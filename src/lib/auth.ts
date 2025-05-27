import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongodb"
import { User } from "@/models/User"

const MAX_LOGIN_ATTEMPTS = 5
const LOCK_TIME = 15 * 60 * 1000 // 15 minutes in milliseconds

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        await dbConnect()

        const user = await User.findOne({ email: credentials.email }).select("+password")
        if (!user) {
          throw new Error("Invalid email or password")
        }

        // Check if account is locked
        if (user.isLocked && user.lockExpires && user.lockExpires > new Date()) {
          const remainingTime = Math.ceil((user.lockExpires.getTime() - Date.now()) / 60000)
          throw new Error(`Account is locked. Please try again in ${remainingTime} minutes.`)
        }

        // Check if account is inactive
        if (!user.isActive) {
          throw new Error("Account is inactive. Please contact support.")
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          // Increment failed login attempts
          user.failedLoginAttempts += 1
          user.lastFailedLogin = new Date()

          // Check if account should be locked
          if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
            user.isLocked = true
            user.lockExpires = new Date(Date.now() + LOCK_TIME)
          }

          await user.save()

          if (user.isLocked) {
            throw new Error(`Account is locked for ${LOCK_TIME / 60000} minutes due to too many failed attempts.`)
          }

          throw new Error("Invalid email or password")
        }

        // Reset failed login attempts on successful login
        if (user.failedLoginAttempts > 0) {
          user.failedLoginAttempts = 0
          user.lastFailedLogin = null
          user.isLocked = false
          user.lockExpires = null
          await user.save()
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/verify-email",
    newUser: "/profile",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Log incoming token, user, and account for debugging
      console.log('JWT callback - initial state:', { 
        token: { id: token.id, email: token.email, role: token.role },
        user: user ? { id: user.id, email: user.email, role: (user as any).role } : 'No user',
        account: account ? { provider: account.provider, type: account.type } : 'No account'
      });

      try {
        if (account && user) {
          // Initial sign in
          if (account.provider === "credentials") {
            token.role = (user as any).role || 'user';
            token.id = user.id;
            token.emailVerified = (user as any).emailVerified || false;
            token.createdAt = (user as any).createdAt || new Date();
            console.log('JWT - Credentials sign in:', { role: token.role, id: token.id });
          } else {
            // Social sign in
            await dbConnect();
            const existingUser = await User.findOne({ email: user.email });

            if (existingUser) {
              token.role = existingUser.role || 'user';
              token.id = existingUser._id.toString();
              token.emailVerified = existingUser.emailVerified || false;
              token.createdAt = existingUser.createdAt;
              console.log('JWT - Existing social user:', { role: token.role, id: token.id });
            } else {
              // Create new user for social sign in
              const newUser = await User.create({
                name: user.name,
                email: user.email,
                role: "user",
                emailVerified: true, // Social auth emails are pre-verified
                provider: account.provider,
              });
              token.role = newUser.role;
              token.id = newUser._id.toString();
              token.emailVerified = true;
              token.createdAt = newUser.createdAt;
              console.log('JWT - New social user created:', { role: token.role, id: token.id });
            }
          }
        } else if (token?.email) {
          // Always fetch the latest user from DB
          await dbConnect();
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser) {
            token.role = dbUser.role || 'user';
            token.id = dbUser._id.toString();
            token.emailVerified = dbUser.emailVerified;
            console.log('JWT - User from DB:', { role: token.role, id: token.id });
          }
        } else {
          console.log('JWT - No email in token, using existing token data');
        }
      } catch (error) {
        console.error('Error in JWT callback:', error);
      }
      return token
    },
    async session({ session, token }) {
      console.log('Session callback - token:', {
        id: token.id,
        role: token.role,
        email: token.email,
        sub: token.sub
      });

      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || 'user'; // Default to 'user' if no role is set
        session.user.emailVerified = token.emailVerified === true;
        session.user.createdAt = token.createdAt instanceof Date ? token.createdAt : new Date();
        
        console.log('Session user after update:', {
          id: session.user.id,
          email: session.user.email,
          role: session.user.role,
          emailVerified: session.user.emailVerified
        });
      }
      
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
} 