"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("Your message has been sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSuccessMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      setSuccessMessage("An error occurred. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h2>

      <p className="text-lg text-gray-700">
        We'd love to hear from you! Please fill out the form below and we'll get
        back to you as soon as possible. Thank you! 🌟{" "}
      </p>
      <div className="mb-8">
        <p className="text-lg text-gray-700">
          For immediate inquiries, you can also reach us via:
        </p>
        <ul className="mt-2 text-gray-600">
          <li>
            Email:{" "}
            <a href="mailto:info@example.com" className="text-blue-500">
              agorawebapp@gmail.com
            </a>
          </li>
          <li>
            Phone:{" "}
            <a href="tel:+1234567890" className="text-blue-500">
              +995 598 99 99 99
            </a>
          </li>
        </ul>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Your Email
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700"
          >
            Message
          </label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <Button
          type="submit"
          className="startup-form_btn text-white"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Message"}
          <Send className="size-6 ml-2" />
        </Button>

        {successMessage && (
          <p className="mt-4 text-green-600 text-center">{successMessage}</p>
        )}
      </form>
    </div>
  );
};

export default ContactPage;
