"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const supabase = createClient();

const StartupForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [link, setLink] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
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

    const { error: insertError } = await supabase.from("products").insert({
      title,
      description,
      category,
      price,
      image: link,
      author: user.id,
    });

    if (insertError) {
      setError(insertError.message);
      toast({
        title: "Submission Failed",
        description: insertError.message,
        variant: "destructive",
      });
    } else {
      setSuccess(true);
      toast({
        title: "Submission Successful",
        description: "Your pitch has been successfully submitted!",
      });

      setTitle("");
      setDescription("");
      setCategory("");
      setLink("");

      router.push("/protected");
    }

    setIsPending(false);
  };

  return (
    <form onSubmit={handleAddProduct} className="startup-form">
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
        {error && <p className="startup-form_error">{error}</p>}
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
        <label htmlFor="description" className="startup-form_label">
          Price
        </label>
        <Textarea
          id="price"
          name="price"
          className="startup-form_textarea"
          required
          placeholder="Startup Description"
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
          placeholder="Startup Category (Tech, Health, Education...)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="link" className="startup-form_label">
          Image URL
        </label>
        <Input
          id="link"
          name="link"
          className="startup-form_input"
          required
          placeholder="Startup Image URL"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>

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
