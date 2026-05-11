# PromptForge AI - Frontend

This is a Next.js-based frontend for the PromptForge AI application.

## Setup Instructions

1. Create a Vercel account at [Vercel](https://vercel.com) if you don't have one already.

2. Connect your GitHub repository:
   - Go to your Vercel dashboard
   - Create a new project and import your Git repository
   - Select the root directory as `frontend` when prompted during the import process

3. Or, deploy manually:
   - Build the project locally:
     ```
     npm install
     npm run build
     ```
   - Install the Vercel CLI: `npm i -g vercel`
   - Run `vercel` in your frontend directory to deploy

## Environment Variables

For environment variables, you'll need to set them in your Vercel project settings:
1. Go to your project settings on Vercel
2. Navigate to the "Environment Variables" section
3. Add the following variables:
   - `NEXT_PUBLIC_API_URL` - URL of your backend API
   - Any other environment variables required for your application

## Deployment Steps

1. Login to Vercel: `vercel login`
2. Deploy to Vercel: `vercel deploy`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Vercel Documentation](https://vercel.com/docs) - the best way to deploy your Next.js app.

## Deploying the Frontend

To deploy the frontend to Vercel, follow these steps:

1. Create a Vercel account at [Vercel](https://vercel.com/)
2. Install the Vercel CLI: `npm install -g @vercel/cli`
3. Run `vercel` in your project directory
4. Follow the prompts to:
   - Set the directory to your frontend folder
   - Select the framework as Next.js
   - Set the output directory to `out`
   - Auto-detected settings are usually correct