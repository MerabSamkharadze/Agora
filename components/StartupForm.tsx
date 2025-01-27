"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { createStripeProduct } from "@/actions/createProductOnStripe";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient();

const StartupForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmitStartupForm = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setIsPending(true);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setError("User is not authenticated");
      toast({
        title: "Authentication Error",
        description: "You need to log in to submit your pitch.",
        variant: "destructive",
      });
      setIsPending(false);
      return;
    }

    if (price <= 0) {
      setError("Price must be greater than zero.");
      setIsPending(false);
      return;
    }

    let imageUrl = "";
    let stripe_product_id = null;
    let stripe_price_id = null;
    if (image) {
      const uniquePath = `products/${uuidv4()}_${image.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(uniquePath, image);

      if (uploadError) {
        setError("Failed to upload image");
        toast({
          title: "Image Upload Error",
          description: uploadError.message,
          variant: "destructive",
        });
        setIsPending(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(uploadData.path);

      if (!publicUrlData.publicUrl) {
        setError("Failed to retrieve public URL for the uploaded image.");
        toast({
          title: "Image Upload Error",
          description: "Public URL could not be retrieved.",
          variant: "destructive",
        });
        setIsPending(false);
        return;
      }

      imageUrl = publicUrlData.publicUrl;
    }

    // Create product in Stripe
    const productData = { title, description, price, imageUrl };
    try {
      const { stripeProduct, stripePrice } =
        await createStripeProduct(productData);
      console.log("Product created:", stripeProduct.id);
      console.log("Price created:", stripePrice.id);
      stripe_product_id = stripeProduct.id;
      stripe_price_id = stripePrice.id;
    } catch (error: any) {
      setError("Failed to create product in Stripe");
      toast({
        title: "Stripe Error",
        description:
          error.message ||
          "An error occurred while creating the product on Stripe.",
        variant: "destructive",
      });
      setIsPending(false);
      return;
    }

    const { error: insertError } = await supabase.from("products").insert({
      title,
      description,
      category,
      price: price * 100,
      image: imageUrl,
      author: user.id,
      stripe_product_id,
      stripe_price_id,
    });

    if (insertError) {
      setError(insertError.message);
      toast({
        title: "Submission Failed",
        description: insertError.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Submission Successful",
        description: "Your pitch has been successfully submitted!",
      });

      setTitle("");
      setDescription("");
      setCategory("");
      setPrice(0);
      setImage(null);
      setPreviewUrl(null);

      router.push("/protected");
    }

    setIsPending(false);
  };

  return (
    <form onSubmit={handleSubmitStartupForm} className="startup-form">
      <div className="w-full">
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Startup Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          placeholder="Startup Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="price" className="startup-form_label">
          Price
        </label>
        <Input
          id="price"
          name="price"
          type="text"
          className="startup-form_input"
          required
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>

      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Product Category "
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="image" className="startup-form_label">
          Image
        </label>
        <Input
          id="image"
          name="image"
          className="startup-form_input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      {previewUrl && (
        <div className="mt-4">
          <p className="startup-form_label">Image Preview:</p>
          <img
            src={previewUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-md border shadow-lg"
          />
        </div>
      )}

      <Button
        type="submit"
        className="startup-form_btn text-white"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit Your Pitch"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default StartupForm;
