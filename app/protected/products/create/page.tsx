import StartupForm from "@/components/StartupForm";

const Page = async () => {
  return (
    <>
      <section className="pink_container  !min-h-[390px]">
        <h1 className="heading">Upload Your Product</h1>
      </section>

      <StartupForm />
    </>
  );
};

export default Page;
