# Buy Me Coffee

This project contains a Next.js frontend and an Express backend.

## Prisma Client

After editing `server/prisma/schema.prisma`, regenerate the Prisma Client:

```bash
cd server
npx prisma generate
```

This uses the configuration in `server/prisma/schema.prisma` and writes the updated client to `node_modules/@prisma/client`.
