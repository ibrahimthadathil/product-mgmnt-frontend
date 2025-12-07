import { Header } from "@/components/layout/header";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="w-full  mx-auto px-5 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </>
  );
};

export default layout;
