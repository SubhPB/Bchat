# My Next.js App Structure

This document describes the structure of the `my-next-app` project.

```plaintext
my-next-app/
├── public/
│   ├── assets/
│   │   ├── images/
│   │   ├── fonts/
│   │   └── styles/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   └── Modal.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   └── specific/
│   │       ├── FeatureA/
│   │       │   ├── FeatureAComponent1.tsx
│   │       │   └── FeatureAComponent2.tsx
│   │       └── FeatureB/
│   │           ├── FeatureBComponent1.tsx
│   │           └── FeatureBComponent2.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useTheme.ts
│   ├── pages/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth].ts
│   │   │   │   └── credentials.ts
│   │   │   └── hello.ts
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
│   │   ├── dashboard/
│   │   │   ├── index.tsx
│   │   │   ├── profile.tsx
│   │   │   └── settings.tsx
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   └── index.tsx
│   ├── services/
│   │   ├── api/
│   │   │   ├── authService.ts
│   │   │   └── userService.ts
│   │   ├── constants/
│   │   │   ├── apiEndpoints.ts
│   │   │   └── appConfig.ts
│   │   ├── prisma/
│   │   │   ├── client.ts
│   │   │   └── models/
│   │   │       ├── userModel.ts
│   │   │       └── postModel.ts
│   │   └── utils/
│   │       ├── logger.ts
│   │       └── helpers.ts
│   ├── styles/
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── mixins.css
│   ├── types/
│   │   ├── auth.d.ts
│   │   └── user.d.ts
│   ├── middleware/
│   │   └── authMiddleware.ts
│   └── tests/
│       ├── __mocks__/
│       ├── __utils__/
│       ├── components/
│       │   ├── common/
│       │   └── layout/
│       ├── hooks/
│       ├── pages/
│       └── services/
├── .env.local
├── .gitignore
├── next.config.js
├── tsconfig.json
└── package.json
