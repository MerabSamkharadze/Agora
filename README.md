# Agora

Agora არის Next.js-ზე დაფუძნებული ვებსაიტი, რომელიც იყენებს App Router სტრუქტურას, Supabase-ს, Stripe-ს და Tailwind CSS-ს.

## 🔗 ლინკები

- 🖥 **Live Demo:** [Agora](https://agora-vert.vercel.app/protected)
- 📂 **GitHub Repository:** [Agora Repo](https://github.com/MerabSamkharadze/Agora)

## 🛠 გამოყენებული ტექნოლოგიები

- **Next.js (App Router)** - React-ის ფრეიმვორკი სერვერ-საიდ რენდერინგით.
- **Supabase** - Authentication და Database სერვისი.
- **Stripe** - გადახდების ინტეგრაციისთვის.
- **Tailwind CSS** - UI დიზაინისთვის.

## 📦 ინსტალაცია და გაშვება

```bash
# რეპოზიტორიის დაკლონება
git clone https://github.com/MerabSamkharadze/Agora.git

# პროექტის საქაღალდეში გადასვლა
cd Agora

# საჭირო პაკეტების დაყენება
yarn install  # ან npm install

# გარემოს ცვლადების კონფიგურაცია
cp .env.example .env  # ჩაწერე საჭირო კონფიგურაციები .env ფაილში

# ლოკალური სერვერის გაშვება
yarn dev  # ან npm run dev
```

## 🌟 ფუნქციები

- 🛍 **პროდუქტების ჩამონათვალი და კალათა** - მომხმარებლებს შეუძლიათ დაამატონ პროდუქტები კალათაში.
- 🔐 **Authentication** - რეგისტრაცია და შესვლა Supabase-ის გამოყენებით.
- 💳 **Stripe გადახდები** - პროდუქტის შეძენის შესაძლებლობა.
- ✍ **ბლოგი** - სტატიების დამატება, რედაქტირება და წაშლა.
- 🔍 **ძიება** - ბლოგის პოსტებში ძიების ფუნქცია.

## 📄 გარემოს ცვლადები

პროექტის სწორად გასაშვებად, საჭიროა `.env` ფაილის კონფიგურაცია. აი, ძირითადი ცვლადები:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```



## 📌 Lisence

MIT ლიცენზია.

