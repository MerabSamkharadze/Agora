// "use client";

// import { useState } from "react";
// import { createClient } from "@/utils/supabase/client";

// export default function AddProduct() {
//   const supabase = createClient();

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState(0);
//   const [category, setCategory] = useState("");
//   const [image, setImage] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);

//   const handleAddProduct = async () => {
//     setError(null);
//     setSuccess(false);

//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser();

//     if (authError || !user) {
//       setError("User is not authenticated");
//       return;
//     }

//     const { error: insertError } = await supabase.from("products").insert({
//       title,
//       description,
//       price,
//       category,
//       image,
//       author: user.id,
//     });

//     if (insertError) {
//       setError(insertError.message);
//     } else {
//       setSuccess(true);
//       setTitle("");
//       setDescription("");
//       setPrice(0);
//       setCategory("");
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-semibold mb-4">Add a New Product</h2>
//       {error && <p className="text-red-500 mb-4">{error}</p>}
//       {success && (
//         <p className="text-green-500 mb-4">Product added successfully!</p>
//       )}
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="border p-2 w-full"
//         />
//       </div>
//       <div className="mb-4">
//         <textarea
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="border p-2 w-full"
//         />
//       </div>
//       <div className="mb-4">
//         <input
//           type="number"
//           placeholder="Price"
//           value={price}
//           onChange={(e) => setPrice(Number(e.target.value))}
//           className="border p-2 w-full"
//         />
//       </div>
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Category"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           className="border p-2 w-full"
//         />
//       </div>
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="image"
//           value={image}
//           onChange={(e) => setImage(e.target.value)}
//           className="border p-2 w-full"
//         />
//       </div>
//       <button
//         onClick={handleAddProduct}
//         className="bg-blue-500 text-white py-2 px-4 rounded"
//       >
//         Add Product
//       </button>
//     </div>
//   );
// }
