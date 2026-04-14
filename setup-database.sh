#!/bin/bash
# Database Setup Script for Tec Fazer
# Run this script after stopping your development server (Ctrl+C)

echo "🚀 Setting up Tec Fazer Database..."
echo ""

# Step 1: Generate Prisma Client
echo "Step 1: Generating Prisma Client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    echo "Make sure your development server is stopped (Ctrl+C)"
    exit 1
fi
echo "✅ Prisma client generated"
echo ""

# Step 2: Push schema to database
echo "Step 2: Pushing schema to database..."
npx prisma db push
if [ $? -ne 0 ]; then
    echo "❌ Failed to push schema"
    exit 1
fi
echo "✅ Schema pushed to database"
echo ""

# Step 3: Seed database with sample data
echo "Step 3: Seeding database with sample data..."
npx prisma db seed
if [ $? -ne 0 ]; then
    echo "❌ Failed to seed database"
    exit 1
fi
echo "✅ Database seeded successfully"
echo ""

# Success message
echo "🎉 Database setup complete!"
echo ""
echo "What was created:"
echo "  ✅ 1 Admin user (admin@tecfazer.pt / TecFazer2024Admin)"
echo "  ✅ 6 Team members"
echo "  ✅ 35+ Services"
echo "  ✅ 4 Pricing plans"
echo "  ✅ 8 Testimonials"
echo ""
echo "Next steps:"
echo "  1. Start your development server: npm run dev"
echo "  2. Open http://localhost:3000"
echo "  3. Login to admin: http://localhost:3000/admin/login"
echo ""
echo "Optional: View your database"
echo "  Run: npx prisma studio"
echo ""
