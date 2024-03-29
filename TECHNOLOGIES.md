# NanoPay.me - Technologies

## Next.js

Next.js defines itself as The React Framework - and most of React community certainly agree; it changed our way to work with React.
Vercel, the company behinds the technology is currently one of the biggest one and counts with many React co-founders and expertis.

Read more about Next.js: https://nextjs.org/docs

## Server Actions

Server Actions are asynchronous functions that are executed on the server.
They can be used in Server and Client Components to handle form submissions and data mutations in Next.js applications.

It means we don't need create Rest APIs endpoints do do all internal backend operations.
By using server actions, we increase performance, make development faster and more unified.

Read more about Server Actions: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations

## Supabase

Supabase is an open source Firebase alternative powered by Postgres.
It includes a Postgres database, Authentication, instant APIs and Realtime subscriptions.

Read more about Supabase: https://supabase.com/

## Authentication and Authorization

We use Supabase to authenticate users with email-password or social logins.

Authenticated users have a JWT (JSON Web Tokens) saved in the browser cookies, these persist and are automatically renewed during sessions.

JWT is used to authenticate Supabase API requests, this allows us to be stateless and not require database lookups for verification.

JWT contains a list of cryptographically signed claims, including role and sub (the user id).

When we authenticate our Supabase client with user's JWT, it will use it to communicate with PostgREST - which is responsible for authorizing database queries based on our provided credentials.

Read more about this process of JWT-Based User Impersonation: https://postgrest.org/en/v12/references/auth.html#user-impersonation

With the credentials present, the second step towards granular access control is done by Postgres Row Level Security and Column Level Privileges.

### Row Level Security

RLS is a feature in Postgres that enables users to restrict access to rows in database tables based on defined security policies, ensuring that users can only access the data they are authorized to see.

Read more about Row Level Security: https://supabase.com/docs/guides/auth/row-level-security

#### Column Level Privilege

Sometimes we need to restrict access to specific columns in our Postgres database. Column Level Privileges allows us to do just that.

We use this functionality especially in columns that should be readonly for the user, these should only be edited by the system (service_role), such as the created_at, updated_at columns and other columns generated by database functions (procedural functions) such as amount_paid and status in invoices table

Read more about Column Level Privilege: https://supabase.com/docs/guides/auth/column-level-security

## Route APIs

Although server actions is our internal backend, some backend operations should be accessible easily through API endpoints, so merchant developers can easily integrate his NanoPay service with his own backend.

Read more about Next.js Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

## Storage

Storage is important for saving user blobs as profile images.

For Uploads, is preferable Presigned URLS. It avoids server request body limits and ensures big request body will always be sent directly to the bucket with a verified size and format.

By using S3 compatible api, we are compatible with popular storage services like Amazon S3 and Cloudflare R2.

## Tailwind

Tailwind is certainly one of the most popular stilization library currently.
Tailwind is very fast, light and produces a very compact css after building.

It's installed with Next.js by default and allow us to create complex and modern stilizations event without advanced css knowledge, using simple classnames.

Read more about Tailwind: https://tailwindcss.com/docs

## Shadcn UI and Radix UI

Shadcn UI offers beautifully designed components, easily customizable with Tailwind. You can import any Shadcn UI components into your apps with a few copy and paste commands.
Unlike other UI solutions, Shadcn UI allows you to add only the components necessary for your application and have direct access to the component code.

Shadcn UI uses Radix UI project components, which provides a set of low-level, unstyled components that serve as the foundation for building highly composable UI components in web applications.

Radix components also prioritize accessibility and performance. They are built with best practices for accessibility in mind, ensuring that they can be easily navigated and used by people with disabilities.
Additionally, Radix components are designed to be lightweight and efficient, helping to improve the performance of web applications.

Read more about Shadcn UI: https://ui.shadcn.com/
Read more about Radix: https://www.radix-ui.com/
