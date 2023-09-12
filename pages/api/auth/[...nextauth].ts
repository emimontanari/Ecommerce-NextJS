import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { dbUsers } from "../../../database"



export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: "Correo:", type: "email", placeholder: "correo@correo.com" },
        password: { label: "Contraseña:", type: "password", placeholder: "Contraseña" },
      },
      async authorize(credentials): Promise<any> {

        return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password)
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // ...add more providers here



  ],
  //custom pages
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    strategy: "jwt",
    updateAge: 24 * 60 * 60, // 24 hours
  },
  
  //callbacks
  callbacks: {
    async jwt({ token, account, user }) {

      if (account) {
        token.accessToken = account.accessToken

        switch (account.type) {
          case "oauth":
            token.user = await dbUsers.oAuthToDbUser(user.email || "", user.name || "")
            break
          case "credentials":
            token.user = user
            break

        }
      }

      return token
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken as any;
      session.user = token.user as any;


      return session
    }
  },

}

export default NextAuth(authOptions)