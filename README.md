# EZHomesteading

- 🏚️ EZ Homesteading is a multivendor marketplace application with an emphasis on connecting family-scale farmers and gardeners with local consumers in their area.
- 🧑‍🌾 There are currently two roles on the site. A Co-Op, which can also be thought of as a vendor, is assigned a store upon signing up.
- 👀 Co-Ops can customize their store's appearance and functionality with a profile picture, a store banner, hours of operation, and much more.
- 🍅 Co-Ops can list items for sale so long as they are homesteading, farmer's market, or self-sufficiency-related. This can be anything from homegrown tomatoes to homemade candles to water purification tablets.
- 👱‍♂️ The other role on the site currently is a consumer, which as the name implies, are people who are interested in anything homesteading, farmer's market, or self-sufficiency-related. Consumers can search for items or browse through an assortment of categories.

### What Makes EZHomesteading Different?

Farmer's markets frequently charge vendors up front for their space. These vendors are outside watching over their items for up to 10 hours to sell their produce, hoping consumers will come looking for what they offer. EZHomesteading provides an easier, faster, and commitment-free way for these vendors to sell their fresh organic produce by connecting them with consumers in their area. EZHomesteading manages logistics and marketing for co-ops and producers. Producers are people with small gardens, a few cows, an apple tree, etc. These individuals do not have the time or desire to sell smaller quantities of their produce to consumers. By becoming EZH producers, these individuals can sell their excess produce in bulk to co-ops in their area. 

### Code Base Features

- 🅽 [Next.js 14](https://nextjs.org) with App Router support
- 🔍 Fuzzy search for listings, co-ops, and producers using [Fuse.js](https://www.npmjs.com/package/fuse.js?activeTab=readme)
- 🌀 [Tailwind CSS](https://tailwindcss.com)
- ✅ Strict Mode for TypeScript and type checking [TypeScript](https://www.typescriptlang.org)
- 🔒 Authentication with [NextAuth](https://next-auth.js.org/): Sign up as three different roles with different privileges and sign in.
- 🔼 Type-safe ORM with [Prisma](https://www.prisma.io/)
- ⌨️ Form handling with [React Hook Form](https://react-hook-form.com/)
- 🛡️ Validation library with [Zod](https://zod.dev/)
- 🔧 Linter with [ESLint](https://eslint.org) (default Next.js, Next.js Core Web Vitals, Tailwind CSS)
- 💖 Code Formatter with [Prettier](https://prettier.io)
- 💡 [Absolute Imports](https://nextjs.org/docs/app/building-your-application/configuring/absolute-imports-and-module-aliases) using `@` prefix
- 🗂 [VSCode](https://code.visualstudio.com/) configuration: Debug, Settings, Tasks and Extensions
- 🗺️ [Google Maps API](https://developers.google.com/maps) for autocomplete, nearby search, map drawing, and more
- 📤 [UploadThing](https://docs.uploadthing.com/) for image capture and upload
- 💬 [Pusher](https://pusher.com/docs/) for automated messaging
- 🔔 [Web push](https://www.npmjs.com/package/web-push) for notifications 

### Project Structure

```shell

├── .next                           # NextJs folder
├── .vscode                         # VSCode configuration
├── app                             # App folder for NextJs app router functionality
│   ├── (pages)                     # All front-end pages except the landing page | authorization routes
│   ├── (home)                      # Landing page
│   ├── (auth)                      # Authorization pages
│   ├── components                  # React components
│   └── api                         # Api folder for post, delete, update requests
│   globals.css                     # Global css
│   layout.tsx                      # Global layouts
│   loading.tsx                     # Loading page
└── page.tsx                        # Landing Page
├── actions                         # Get routes for listings, users, etc.
├── data                            #
├── libs                            # 3rd party libraries configuration
├── providers                       # Toast and Modal providers
├── types                           # Type definitions
├── hooks                           # Hooks for modals, text files for listings, etc.
├── public                          # Public assets folder
├── unused                          # All currently unused components that may be needed for reference
├── tailwind.config.js              # Tailwind JS CSS configuration
├── tailwind.config.ts              # Tailwind TS CSS configuration
└── tsconfig.json                   # TypeScript configuration
├── README.md                       # README file
```

### Contributors

[Zachary Short](https://zacharyshort-56e605e3dea5.herokuapp.com/)
[Maguire Wilson](https://www.linkedin.com/in/maguire-wilson-4611012a0/)
