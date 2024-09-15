import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/lib/db";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(client),
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Always redirect to the home page after signing in
      if (url.startsWith(baseUrl)) return url;
      // Otherwise redirect to the home page
      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST };
