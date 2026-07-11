import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartContent from '@/components/shop/CartContent';

const Cart = () => {
  return (
    <div className="min-h-screen bg-[#EFFDF0] font-hero-inter">
      <Header />

      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <CartContent />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Cart;
