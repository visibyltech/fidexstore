const ShopHeader = () => {
  return (
    <div className="mx-10 mt-6 rounded-3xl bg-gradient-to-r from-black via-neutral-900 to-black px-6 py-14 text-center">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
        Shop <span className="text-gold">Devices</span>
      </h1>
      <p className="mt-3 text-sm text-white/50">
        Home <span className="text-gold">/</span> Shop
      </p>
    </div>
  );
};

export default ShopHeader;
